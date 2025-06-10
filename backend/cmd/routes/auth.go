package routes

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
	"wasemart/cmd/lib"
	"wasemart/cmd/models"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var webOauthConfig = &oauth2.Config{
	ClientID:     os.Getenv("GOOGLE_WEB_CLIENT_ID"),
	ClientSecret: os.Getenv("GOOGLE_WEB_CLIENT_SECRET"),
	RedirectURL:  os.Getenv("URL") + "/auth/callback",
	Scopes: []string{
		"https://www.googleapis.com/auth/userinfo.email",
		"openid",
	},
	Endpoint: google.Endpoint,
}

var states = make(map[string]string)

type TokenInfo struct {
	Audience  string `json:"aud"`
	ExpiresIn string `json:"expires_in"`
	Email     string `json:"email"`
	Scope     string `json:"scope"`
	Error     string `json:"error_description"`
}

func handleMain(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, `<html><a href="/auth/login">Login with Google</a></html>`)
}

func handleLogin(w http.ResponseWriter, r *http.Request) {

	log.Print("Entered handleLogin")

	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		http.Error(w, "Failed to generate state", http.StatusInternalServerError)
	}
	state := base64.URLEncoding.EncodeToString(b)

	platform := r.URL.Query().Get("platform")

	states[state] = platform

	if platform == "web" {
		// Set the state in a secure, HTTP-only cookie (expires in 5 mins)
		setCookie(w, "oauthstate", state, 300) // 5 minutes

		log.Print("Getting URL")
		authURL := webOauthConfig.AuthCodeURL(
			state,
			oauth2.AccessTypeOffline,
			oauth2.SetAuthURLParam("prompt", "consent"),
		)
		log.Println("Generated OAuth URL:", authURL)
		log.Print("Sending redirect")
		http.Redirect(w, r, authURL, http.StatusTemporaryRedirect)

	} else if platform == "mobile" {
		authURL := webOauthConfig.AuthCodeURL(
			state,
			oauth2.AccessTypeOffline,
			oauth2.SetAuthURLParam("prompt", "consent"),
		)
		log.Println("Generated OAuth URL: ", authURL)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(struct { Url string; State string } { Url: authURL, State: state })
	} else {
		http.Error(w, "Invalid platform specified", http.StatusBadRequest)
		return
	}
}

func handleCallback(w http.ResponseWriter, r *http.Request) {

	log.Print("Entered handleCallback")
	log.Printf("Callback URL: %s", r.URL.String())

	state := r.URL.Query().Get("state")
	platform, exists := states[state]; if !exists {
		http.Error(w, "Invalid or missing state parameter", http.StatusBadRequest)
		return
	}

	// Get state from cookie
	// cookie, err := r.Cookie("oauthstate")
	// if err != nil {
	// 	http.Error(w, "Missing state cookie", http.StatusBadRequest)
	// 	return
	// }
	//
	// // Compare with state from provider
	// if r.FormValue("state") != cookie.Value {
	// 	http.Error(w, "Invalid state parameter", http.StatusBadRequest)
	// 	return
	// }

	code := r.FormValue("code")
	if code == "" {
		http.Error(w, "Code not found", http.StatusBadRequest)
		return
	}

	token, err := webOauthConfig.Exchange(context.Background(), code)
	if err != nil {
		http.Error(w, "Token exchange failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	resp, err := http.Get("https://oauth2.googleapis.com/tokeninfo?access_token=" + token.AccessToken)
	if err != nil {
		http.Error(w, "Failed to get token info: "+err.Error(), http.StatusInternalServerError)
		return
	}

	var tokenInfo TokenInfo
	if err := json.NewDecoder(resp.Body).Decode(&tokenInfo); err != nil {
		http.Error(w, "Failed to decode token info: "+err.Error(), http.StatusInternalServerError)
		return
	}

	var user *models.User
	if err := lib.DB.First(&user, "email = ?", tokenInfo.Email).Error; err != nil {
		user = &models.User{
			Email:    tokenInfo.Email,
			Username: tokenInfo.Email,
		}
		if err := lib.DB.Create(user).Error; err != nil {
			http.Error(w, "Failed to create user: "+err.Error(), http.StatusInternalServerError)
			return
		}
	} 
	if platform == "web" {
		setCookie(w, "accesstoken", token.AccessToken, 60*60)        // 1 hour
		setCookie(w, "refreshtoken", token.RefreshToken, 60*60*24*7) // 1 week
		setCookie(w, "email", tokenInfo.Email, 10*365*24*60*60)
		setCookie(w, "id", user.ID.String(), 10*365*24*60*60)
	} else if platform == "mobile" {

		mobileAppRedirectScheme := "com.anonymous.mobile"
		mobileAppRedirectURL := fmt.Sprintf("%s:/(tabs)/index?accessToken=%s&refreshToken=%s&userId=%s&email=%s", mobileAppRedirectScheme, token.AccessToken, token.RefreshToken, user.ID.String(), tokenInfo.Email)

		log.Printf("Redirecting mobile app to: %s", mobileAppRedirectURL)
		http.Redirect(w, r, mobileAppRedirectURL, http.StatusTemporaryRedirect)
	}
	log.Printf("User authenticated: %s", user.Email)
}

func handleRefresh(w http.ResponseWriter, r *http.Request) {
	refreshCookie, err := r.Cookie("refreshtoken")
	if err != nil {
		http.Error(w, "Missing refresh token", http.StatusUnauthorized)
		return
	}

	token := &oauth2.Token{
		RefreshToken: refreshCookie.Value,
	}

	// Create a token source using the refresh token
	tokenSource := webOauthConfig.TokenSource(context.Background(), token)

	// Retrieve a new access token
	newToken, err := tokenSource.Token()
	if err != nil {
		http.Error(w, "Error using the refresh token to get a new access and refresh token", http.StatusUnauthorized)
		return
	}
	// Set new access token cookie
	setCookie(w, "accesstoken", newToken.AccessToken, int(newToken.Expiry.Sub(time.Now()).Seconds()))
	setCookie(w, "refreshtoken", newToken.RefreshToken, int(newToken.Expiry.Sub(time.Now()).Seconds()))

	fmt.Fprintf(w, "Token refreshed successfully")
}

func handleExchangeCodeForToken(w http.ResponseWriter, r *http.Request) {
	log.Print("Entered handleExchangeCodeForToken")
	var body struct { 
		Code string `json:"code"` 
		RedirectURI string `json:"redirectUri"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		log.Printf("Invalid request body: %v", err)
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	log.Printf("Exchanging code: %s", body.Code)
	log.Printf("redirect uri : %s", body.RedirectURI)
	copyOauthConfig := *webOauthConfig // Create a copy to avoid modifying the original
	copyOauthConfig.RedirectURL = body.RedirectURI
	token, err := copyOauthConfig.Exchange(context.Background(), body.Code)
	if err != nil {
		log.Printf("Token exchange failed: %v", err)
		http.Error(w, "Token exchange failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode(token); err != nil {
		log.Printf("Failed to encode token: %v", err)
		http.Error(w, "Failed to encode token: "+err.Error(), http.StatusInternalServerError)
		return
	}
	log.Printf("Token exchanged successfully: %s", token.AccessToken)
	log.Printf("Refresh Token: %s", token.RefreshToken)

	fmt.Fprintf(w, "Access Token: %s\n", token.AccessToken)
	fmt.Fprintf(w, "Refresh Token: %s\n", token.RefreshToken)
}

// setCookie is a helper to set cookies with consistent settings
func setCookie(w http.ResponseWriter, name, value string, maxAge int) {
	http.SetCookie(w, &http.Cookie{
		Name:     name,
		Value:    value,
		MaxAge:   maxAge,
		HttpOnly: false, // TODO: Set to true in production
		Secure:   false, // TODO: Set to true if using HTTPS
		Path:     "/",
	})
}

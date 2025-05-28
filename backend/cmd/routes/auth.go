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

	"github.com/google/uuid"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var oauthConfig = &oauth2.Config{
	ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
	ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
	RedirectURL:  os.Getenv("URL") + "/auth/callback",
	Scopes: []string{
		"https://www.googleapis.com/auth/userinfo.email",
		"openid",
	},
	Endpoint: google.Endpoint,
}

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

	// Set the state in a secure, HTTP-only cookie (expires in 5 mins)
	setCookie(w, "oauthstate", state, 300) // 5 minutes

	log.Print("Getting URL")
	authURL := oauthConfig.AuthCodeURL(
		state,
		oauth2.AccessTypeOffline,
		oauth2.SetAuthURLParam("prompt", "consent"),
	)
	log.Println("Generated OAuth URL:", authURL)
	log.Print("Sending redirect")
	http.Redirect(w, r, authURL, http.StatusTemporaryRedirect)
}

func handleCallback(w http.ResponseWriter, r *http.Request) {
	// Get state from cookie
	cookie, err := r.Cookie("oauthstate")
	if err != nil {
		http.Error(w, "Missing state cookie", http.StatusBadRequest)
		return
	}

	// Compare with state from provider
	if r.FormValue("state") != cookie.Value {
		http.Error(w, "Invalid state parameter", http.StatusBadRequest)
		return
	}

	code := r.FormValue("code")
	if code == "" {
		http.Error(w, "Code not found", http.StatusBadRequest)
		return
	}

	token, err := oauthConfig.Exchange(context.Background(), code)
	if err != nil {
		http.Error(w, "Token exchange failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	setCookie(w, "accesstoken", token.AccessToken, 60*60)        // 1 hour
	setCookie(w, "refreshtoken", token.RefreshToken, 60*60*24*7) // 1 week

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

	var user models.User
	if err := lib.DB.First(&user, "email = ?", tokenInfo.Email).Error; err != nil {
		if err.Error() == "record not found" {
			// User not found, create a new user
			user = models.User{
				ID:       uuid.Nil,
				Email:    tokenInfo.Email,
				Username: tokenInfo.Email, // Default username to email
			}
			if err := lib.DB.Create(&user).Error; err != nil {
				http.Error(w, "Failed to create user: "+err.Error(), http.StatusInternalServerError)
				return
			}
		}
	}

	setCookie(w, "id", user.ID.String(), 10*365*24*60*60)

	fmt.Fprintf(w, "Access Token: %s\n", token.AccessToken)
	fmt.Fprintf(w, "Refresh Token: %s\n", token.RefreshToken)
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
	tokenSource := oauthConfig.TokenSource(context.Background(), token)

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

package lib

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"os"
	"strings"
)

type GoogleIDTokenInfo struct {
	Aud           string `json:"aud"`
	UserID        string `json:"user_id"`
	Email         string `json:"email"`
	EmailVerified string `json:"email_verified"`
	ExpiresIn     string `json:"exp"`
	IssuedAt      string `json:"iat"`
	Issuer        string `json:"iss"`
	Subject       string `json:"sub"`
	Name          string `json:"name"`
	Picture       string `json:"picture"`
	GivenName     string `json:"given_name"`
	FamilyName    string `json:"family_name"`
	Locale        string `json:"locale"`
}

// UserInfo holds user info fetched from Google's userinfo endpoint.
type UserInfo struct {
	Email         string `json:"email"`
	EmailVerified bool   `json:"email_verified"`
	Name          string `json:"name"`
	Picture       string `json:"picture"`
	Sub           string `json:"sub"`
}

type TokenValidationResult struct {
	Valid        bool
	Expired      bool
	ErrorMessage string
	UserInfo     *UserInfo
}

// ValidateGoogleAccessTokenAndGetUserInfo tries to get user info using the access token.
// If the access token is expired, returns Expired=true; user should be redirected for refresh.
func ValidateGoogleAccessTokenAndGetUserInfo(accessToken, refreshToken string) (TokenValidationResult, error) {
	req, err := http.NewRequest("GET", "https://openidconnect.googleapis.com/v1/userinfo", nil)
	if err != nil {
		return TokenValidationResult{}, err
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return TokenValidationResult{}, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return TokenValidationResult{}, err
	}

	if resp.StatusCode == http.StatusOK {
		var userInfo UserInfo
		if err := json.Unmarshal(body, &userInfo); err != nil {
			return TokenValidationResult{}, err
		}
		return TokenValidationResult{
			Valid:    true,
			UserInfo: &userInfo,
		}, nil
	}

	// Parse error from Google
	var errResp struct {
		Error            string `json:"error"`
		ErrorDescription string `json:"error_description"`
	}
	_ = json.Unmarshal(body, &errResp) // best effort

	expired := false
	if strings.Contains(strings.ToLower(errResp.ErrorDescription), "expired") {
		expired = true
	}

	return TokenValidationResult{
		Valid:        false,
		Expired:      expired,
		ErrorMessage: errResp.ErrorDescription,
	}, errors.New(errResp.ErrorDescription)
}

func EnforceAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		accessToken, err := r.Cookie("accesstoken")
		if err != nil || accessToken == nil {
			http.Redirect(w, r, os.Getenv("URL")+"/auth/login", http.StatusTemporaryRedirect)
			return
		}
		refreshToken, err := r.Cookie("refreshToken")
		if err != nil || refreshToken == nil {
			http.Redirect(w, r, os.Getenv("URL")+"/auth/login", http.StatusTemporaryRedirect)
			return
		}

		idToken := accessToken.Value
		resp, err := http.Get("https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken)
		if err != nil || resp.StatusCode != http.StatusOK {
			if resp != nil {
				defer resp.Body.Close()
			}
			// Try to refresh the access token if unauthorized
			if resp != nil && resp.StatusCode == http.StatusUnauthorized {
				refreshReq, err := http.NewRequest("POST", os.Getenv("URL")+"/auth/refresh", nil)
				if err != nil {
					http.Redirect(w, r, os.Getenv("URL")+"/auth/login", http.StatusTemporaryRedirect)
					return
				}
				refreshReq.AddCookie(refreshToken)
				client := &http.Client{}
				refreshResp, refreshErr := client.Do(refreshReq)
				if refreshResp != nil {
					defer refreshResp.Body.Close()
				}
				if refreshErr == nil && refreshResp.StatusCode == http.StatusOK {
					// Token refreshed, retry original request
					http.Redirect(w, r, r.URL.String(), http.StatusTemporaryRedirect)
					return
				}
			}
			http.Redirect(w, r, os.Getenv("URL")+"/auth/login", http.StatusTemporaryRedirect)
			return
		}
		defer resp.Body.Close()

		// Call the next handler if everything is OK
		next.ServeHTTP(w, r)
	})
}

package routes

import (
	"encoding/json"
	"net/http"
	"wasemart/cmd/lib"
	"wasemart/cmd/models"

	"github.com/google/uuid"
)

func handleUser(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:

		accessToken, err := r.Cookie("accesstoken"); if err != nil {
			http.Error(w, "Error getting cookie", http.StatusNotFound)
		}

		refreshToken, err := r.Cookie("refreshtoken"); if err != nil {
			http.Error(w, "Error getting cookie", http.StatusNotFound)
		}

		result, err := lib.ValidateGoogleAccessTokenAndGetUserInfo(accessToken.Value, refreshToken.Value); if err != nil {
			http.Error(w, "Error getting token info: " + err.Error(), http.StatusInternalServerError)
			return
		}

		if result.Expired {
			http.Redirect(w, r, "/auth/login", http.StatusTemporaryRedirect)
		}

		var user models.User
		if err := lib.DB.First(&user, "email = ?", result.UserInfo.Email).Error; err != nil {
			http.Error(w, "User not found: " + err.Error(), http.StatusNotFound)
			return
		}
		json.NewEncoder(w).Encode(user)

	case http.MethodPost:

		username := r.URL.Query().Get("username"); if username == "" {
			http.Error(w, "Username is required", http.StatusBadRequest)
			return
		}

		accessToken, err := r.Cookie("accesstoken"); if err != nil {
			http.Error(w, "Error getting cookie", http.StatusNotFound)
		}

		refreshToken, err := r.Cookie("refreshtoken"); if err != nil {
			http.Error(w, "Error getting cookie", http.StatusNotFound)
		}

		result, err := lib.ValidateGoogleAccessTokenAndGetUserInfo(accessToken.Value, refreshToken.Value); if err != nil {
			http.Error(w, "Error getting token info: " + err.Error(), http.StatusInternalServerError)
			return
		}

		if result.Expired {
			http.Redirect(w, r, "/auth/login", http.StatusTemporaryRedirect)
		}

		user := models.User{
			ID:       uuid.Nil,
			Email:    result.UserInfo.Email,
			Username: username,
		}

		if err := lib.DB.Create(&user).Error; err != nil {
			http.Error(w, "Could not create user", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(user)

	case http.MethodPut:
		w.Write([]byte("Update user not implemented yet"))

	case http.MethodDelete:

		accessToken, err := r.Cookie("accesstoken"); if err != nil {
			http.Error(w, "Error getting cookie", http.StatusNotFound)
		}

		refreshToken, err := r.Cookie("refreshtoken"); if err != nil {
			http.Error(w, "Error getting cookie", http.StatusNotFound)
		}

		result, err := lib.ValidateGoogleAccessTokenAndGetUserInfo(accessToken.Value, refreshToken.Value); if err != nil {
			http.Error(w, "Error getting token info: " + err.Error(), http.StatusInternalServerError)
			return
		}

		var user models.User
		if err := lib.DB.First(&user, "email = ?", result.UserInfo.Email).Error; err != nil {
			http.Error(w, "User not found: " + err.Error(), http.StatusNotFound)
			return
		}

		if err := lib.DB.Delete(&user).Error; err != nil {
			http.Error(w, "Could not delete user", http.StatusInternalServerError)
			return
		}

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

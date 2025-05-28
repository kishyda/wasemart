package routes

import (
	"encoding/json"
	"net/http"
	"wasemart/cmd/lib"
	"wasemart/cmd/models"
)

func handleAd(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:

		var ads []models.Ad
		if err := lib.DB.Find(&ads).Error; err != nil {
			http.Error(w, "Failed to get ads from database: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(ads); err != nil {
			http.Error(w, "Failed to encode ads", http.StatusInternalServerError)
			return
		}

	case http.MethodPost:

		var ad models.Ad

		if err := json.NewDecoder(r.Body).Decode(&ad); err != nil {
			http.Error(w, "Invalid JSON payload: "+err.Error(), http.StatusBadRequest)
			return
		}

		if err := lib.DB.Create(&ad).Error; err != nil {
			http.Error(w, "Failed to insert ad into database: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Return created ad as JSON with status 201 Created
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(ad)

	case http.MethodPut:

		var ad models.Ad

		if err := json.NewDecoder(r.Body).Decode(&ad); err != nil {
			http.Error(w, "Invalid JSON payload: "+err.Error(), http.StatusBadRequest)
			return
		}

		if err := lib.DB.Save(&ad).Error; err != nil {
			http.Error(w, "Failed to update ad in database: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)

	case http.MethodDelete:

		var ad models.Ad

		if err := json.NewDecoder(r.Body).Decode(&ad); err != nil {
			http.Error(w, "Invalid JSON payload: "+err.Error(), http.StatusBadRequest)
			return
		}

		if err := lib.DB.Delete(&ad).Error; err != nil {
			http.Error(w, "Failed to delete ad from database: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

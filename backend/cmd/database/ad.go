package database

import (
	"fmt"
	"wasemart/cmd/models"

	"gorm.io/gorm"
)

func GetAdsFromDB(db *gorm.DB) []models.Ad {
	var ads []models.Ad
	if err := db.Find(&ads).Error; err != nil {
		panic(fmt.Sprintf("Failed to fetch ads: %v", err))
	}
	return ads
}

func InsertAdToDB(db *gorm.DB, ad models.Ad) {
	if err := db.Create(&ad).Error; err != nil {
		panic(fmt.Sprintf("Failed to insert ad: %v", err))
	}
}

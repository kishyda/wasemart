package database

// This file contains functions to interact with the database for managing ads.
// It provides CRUD operations: Create, Read, Update, and Delete for ads.

// import (
// 	"wasemart/cmd/models"
//
// 	"gorm.io/gorm"
// )
//
// func GetAdsFromDB(db *gorm.DB) ([]models.Ad, error) {
// 	var ads []models.Ad
// 	if err := db.Find(&ads).Error; err != nil {
// 		return nil, err
// 	}
// 	return ads, nil
// }
//
// func InsertAdToDB(db *gorm.DB, ad models.Ad) error {
// 	if err := db.Create(&ad).Error; err != nil {
// 		return err
// 	}
// 	return nil
// }
//
// func UpdateAdInDB(db *gorm.DB, ad models.Ad) error {
// 	if err := db.Save(&ad).Error; err != nil {
// 		return err
// 	}
// 	return nil
// }
//
// func DeleteAdFromDB(db *gorm.DB, ad models.Ad) error {
// 	if err := db.Delete(&ad).Error; err != nil {
// 		return err
// 	}
// 	return nil
// }

package database

import (
	"log"
	"wasemart/cmd/models"

	"gorm.io/gorm"
)

func AddUser(db *gorm.DB, user *models.User) {
	if err := db.Create(user).Error; err != nil {
		log.Printf("AddUser error: %v", err)
	}
}

func GetUser(db *gorm.DB, id string) *models.User {
	var user models.User
	if err := db.First(&user, "id = ?", id).Error; err != nil {
		log.Printf("GetUser error: %v", err)
		return nil
	}
	return &user
}

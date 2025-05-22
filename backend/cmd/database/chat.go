package database

import (
	"log"
	"wasemart/cmd/models"

	"gorm.io/gorm"
)

func InsertNewChat(db *gorm.DB, c *models.Chat) {
	if err := db.Create(c).Error; err != nil {
		log.Printf("InsertNewChat failed: %v", err)
	}
}

func InsertNewMessage(db *gorm.DB, m *models.Message) {
	if err := db.Create(m).Error; err != nil {
		log.Printf("InsertNewMessage failed: %v", err)
	}
}

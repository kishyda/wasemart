package database

// import (
// 	"errors"
// 	"log"
// 	"wasemart/cmd/models"
//
// 	"github.com/google/uuid"
// 	"gorm.io/gorm"
// )
//
// func InsertNewChat(db *gorm.DB, c *models.Chat) error {
// 	if c == nil {
// 		log.Println("InsertNewChat: received nil chat")
// 		return nil
// 	}
//
// 	// Check if the chat already exists based on ChatID
// 	var existingChat models.Chat
// 	if err := db.Where("chat_id = ?", c.ID).First(&existingChat).Error; err == nil {
// 		log.Printf("Chat with ID %d already exists, skipping insert.", c.ID)
// 		return err
// 	} else if err != gorm.ErrRecordNotFound {
// 		log.Printf("Error checking for existing chat: %v", err)
// 		return err
// 	}
//
// 	// Insert the new chat
// 	if err := db.Create(c).Error; err != nil {
// 		log.Printf("InsertNewChat failed: %v", err)
// 	}
//
// 	return nil
// }
//
// func InsertNewMessage(db *gorm.DB, m *models.Message) {
// 	if err := db.Create(m).Error; err != nil {
// 		log.Printf("InsertNewMessage failed: %v", err)
// 	}
// }
//
// // GetChatByID retrieves a chat by its ID, preloading BuyerUser, SellerUser, and Messages (including their Sender/Receiver).
// func GetChatByID(db *gorm.DB, chatID uuid.UUID) (*models.Chat, error) {
// 	var chat models.Chat
// 	err := db.
// 		Preload("BuyerUser").
// 		Preload("SellerUser").
// 		Preload("Messages", func(db *gorm.DB) *gorm.DB {
// 			return db.Order("timestamp ASC")
// 		}).
// 		Preload("Messages.Sender").
// 		Preload("Messages.Receiver").
// 		Where("id = ?", chatID).
// 		First(&chat).Error
// 	if err != nil {
// 		if errors.Is(err, gorm.ErrRecordNotFound) {
// 			return nil, nil // not found
// 		}
// 		return nil, err
// 	}
// 	return &chat, nil
// }
//
// // DeleteChatByID deletes a chat by its ID.
// func DeleteChatByID(db *gorm.DB, chatID uuid.UUID) error {
// 	if err := db.Where("chat_id = ?", chatID).Delete(&models.Chat{}).Error; err != nil {
// 		log.Printf("DeleteChatByID failed: %v", err)
// 		return err
// 	}
// 	return nil
// }

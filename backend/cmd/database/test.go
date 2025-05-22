package database

import (
	"time"
	"wasemart/cmd/models"

	"github.com/google/uuid"
)

func Test() {
	user1 := models.User{
		ID:       uuid.New(),
		Username: "alice",
		Email:    "alice@example.com",
	}
	user2 := models.User{
		ID:       uuid.New(),
		Username: "bob",
		Email:    "bob@example.com",
	}
	DB.Create(&user1)
	DB.Create(&user2)

	// Create an Ad posted by user1
	ad := models.Ad{
		ID:          uuid.New(),
		UserID:      user1.ID,
		Title:       "Vintage Bicycle",
		Price:       120.50,
		Category:    "Sports",
		Description: "A classic vintage bike in great condition.",
		Contact:     "alice@example.com",
		Pictures:    []string{"pic1.jpg", "pic2.jpg"},
		Locations:   []string{"New York", "Brooklyn"},
	}
	DB.Create(&ad)

	// Create a Chat between user2 (buyer) and user1 (seller) about the Ad
	chat := models.Chat{
		ID:        uuid.New(),
		Buyer:     user2.ID,
		Seller:    user1.ID,
		AdID:      ad.ID,
		CreatedAt: time.Now(),
	}
	DB.Create(&chat)

	// Create a Message in that Chat from buyer to seller
	message := models.Message{
		ID:        uuid.New(),
		ChatID:    chat.ID,
		FromUser:  user2.ID,
		ToUser:    user1.ID,
		Message:   "Is the bicycle still available?",
		Timestamp: time.Now(),
	}
	DB.Create(&message)
}

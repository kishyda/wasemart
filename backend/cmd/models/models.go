package models 

import (
	"time"
    "github.com/google/uuid"
)

type User struct {
	ID       uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Username string    `gorm:"type:varchar(100);unique;not null"`
	Email    string    `gorm:"type:varchar(100);unique;not null"`
}

type Ad struct {
	ID          uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID      uuid.UUID `gorm:"type:uuid;not null"`

	User        User      `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`

	Title       string    `gorm:"type:varchar(100);not null"`
	Price       float64   `gorm:"not null"`
	Category    string    `gorm:"type:varchar(100);not null"`
	Description string    `gorm:"type:varchar(1000);not null"`
	Contact     string    `gorm:"type:varchar(100);not null"`

	Pictures    []string  `gorm:"type:varchar(100)[];not null"`
	Locations   []string  `gorm:"type:varchar(100)[];not null"`
}

type Chat struct {
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Buyer     uuid.UUID `gorm:"type:uuid;not null;index"`
	Seller    uuid.UUID `gorm:"type:uuid;not null;index"`
	AdID      uuid.UUID `gorm:"type:uuid;not null"`
	CreatedAt time.Time `gorm:"autoCreateTime"`

	BuyerUser  User `gorm:"foreignKey:Buyer;references:ID;constraint:OnDelete:CASCADE"`
	SellerUser User `gorm:"foreignKey:Seller;references:ID;constraint:OnDelete:CASCADE"`

	Messages  []Message `gorm:"foreignKey:ChatID"`
}

type Message struct {
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`

	ChatID    uuid.UUID `gorm:"type:uuid;not null;index"`
	FromUser  uuid.UUID `gorm:"type:uuid;not null;index"`
	ToUser    uuid.UUID `gorm:"type:uuid;not null;index"`

	Chat      Chat      `gorm:"foreignKey:ChatID;references:ID;constraint:OnDelete:CASCADE"`
	Sender    User      `gorm:"foreignKey:FromUser;references:ID"`
	Receiver  User      `gorm:"foreignKey:ToUser;references:ID"`

	Message   string    `gorm:"type:varchar(100);not null"`
	Timestamp time.Time `gorm:"autoCreateTime"`
}

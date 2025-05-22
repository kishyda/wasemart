package database

import (
	"fmt"
	"os"
	"wasemart/cmd/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectToPostgresqlDatabase() *gorm.DB {
	if DB != nil {
		return DB
	}

	var (
		host     = os.Getenv("DB_HOST")
		port     = os.Getenv("DB_PORT")
		user     = os.Getenv("DB_USER")
		password = os.Getenv("DB_PASSWORD")
		dbname   = os.Getenv("DB_NAME")
	)

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(fmt.Sprintf("Failed to connect to database: %v", err))
	}

	DB = db
	fmt.Println("Successfully connected with GORM!")
	db.AutoMigrate(&models.User{}, &models.Ad{}, &models.Chat{}, &models.Message{})
	return db
}

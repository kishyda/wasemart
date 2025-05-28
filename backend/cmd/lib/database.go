package lib 

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"wasemart/cmd/models"

    _ "github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectToPostgresqlDatabase() {

	// var (
	// 	host     = os.Getenv("DB_HOST")
	// 	port     = os.Getenv("DB_PORT")
	// 	user     = os.Getenv("DB_USER")
	// 	password = os.Getenv("DB_PASSWORD")
	// 	dbname   = os.Getenv("DB_NAME")
	// )

	// defaultDBConnStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=postgres sslmode=disable", host, port, user, password)

	dbname := os.Getenv("DB_NAME")
	connectionString := os.Getenv("DATABASE_URL")

	sqlDB, err := sql.Open("postgres", connectionString); if err != nil {
		log.Fatalf("Failed to connect to default postgres database: %v", err)
	}
	defer sqlDB.Close()

	var exists bool
	checkDBExistsQuery := fmt.Sprintf("SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = '%s')", dbname); 
	err = sqlDB.QueryRow(checkDBExistsQuery).Scan(&exists); if err != nil {
		log.Fatalf("Failed to check if database exists: %v", err)
	}

	if !exists {
		_, err = sqlDB.Exec("CREATE DATABASE " + dbname); if err != nil {
			log.Fatalf("Failed to create database %s: %v", dbname, err)
		}
		log.Printf("Database %s created successfully.", dbname)
	} else {
		log.Printf("Database %s already exists.", dbname)
	}

	// dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)

	db, err := gorm.Open(postgres.Open(connectionString), &gorm.Config{}); if err != nil {
		panic(fmt.Sprintf("Failed to connect to database: %v", err))
	}

	fmt.Println("Successfully connected with GORM!")
	db.AutoMigrate(&models.User{}, &models.Ad{}, &models.Chat{}, &models.Message{})

	DB = db
}

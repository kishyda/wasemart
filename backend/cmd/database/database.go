package database

import (
	"context"
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var database *sql.DB

const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "password"
	dbname   = "main"
)

func ConnectToPostgresqlDatabase() *sql.DB {

	if database != nil {
		return database
	}

	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s " +
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}

	err = db.Ping()

	if err != nil {
        fmt.Print(err)
		panic(err)
	}
    database = db
	fmt.Println("Successfully connected!")
    return db
}

func ConnectToMongoDatabase() *mongo.Database {
	client, err := mongo.Connect(options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		panic(err)
	}
	if err := client.Ping(context.TODO(), nil); err != nil {
		print("Error in connecting to MongoDB client ", err)
	}
	return client.Database("db")
}

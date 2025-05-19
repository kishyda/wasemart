package main

import (
	"net/http"
	"wasemart/cmd/database"
	"wasemart/cmd/routes"

	"github.com/rs/cors"
)

var c = cors.New(cors.Options{
	AllowedOrigins:   []string{"*"},
	AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodDelete},
	AllowedHeaders:   []string{"*"},
	AllowCredentials: true,
})

func main() {

	db := database.ConnectToPostgresqlDatabase()
	db.Ping()

    routes.RegisterRoutes()

	// LATER ON, EMBED THE INDEX.HTML
	http.Handle("/", c.Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./build/index.html")
	})))

	http.ListenAndServe(":8080", nil)
}

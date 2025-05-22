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

func CORSHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set the CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*") // allow all origins, adjust as needed
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Handle preflight OPTIONS request
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		// Call the next handler
		next.ServeHTTP(w, r)
	})
}

func main() {

	database.ConnectToPostgresqlDatabase()
    routes.RegisterRoutes()

	http.Handle("/", CORSHandler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./build/index.html")
	})))

	// http.Handle("/", c.Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 	http.ServeFile(w, r, "./build/index.html")
	// })))

	http.ListenAndServe(":8080", nil)
}

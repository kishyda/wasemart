package main

import (
	"fmt"
	"log"
	"net/http"

	// "os"
	"wasemart/cmd/lib"
	"wasemart/cmd/routes"
)

func CORSHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		// Optional: restrict to trusted origins
		if origin == "https://wasemartfrontend.loca.lt" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		}

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {

	defer func() {
		if r := recover(); r != nil {
		}
	}()

	lib.ConnectToPostgresqlDatabase()
    routes.RegisterRoutes()

	http.Handle("/", CORSHandler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./build/index.html")
	})))

	http.HandleFunc("/authcookie", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Got request to /authcookie")
		cookies := r.Cookies()
		for _, c := range cookies {
			fmt.Println(c)
		}
		w.Write([]byte("FINISHED"))
	})

	http.HandleFunc("/hi", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("THIS IS A TEST, AND IT'S WORKING"))
	})

	// http.Handle("/", c.Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 	http.ServeFile(w, r, "./build/index.html")
	// })))

	log.Println("Server is running on port 8080")
	http.ListenAndServe(":8080", nil)
}

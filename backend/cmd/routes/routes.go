package routes

import (
	"log"
	"net/http"
)

func RegisterRoutes() {

	http.HandleFunc("/auth", handleMain)
	http.HandleFunc("/auth/login", handleLogin)
	http.HandleFunc("/auth/callback", handleCallback)
	http.HandleFunc("/auth/refresh", handleRefresh)

    http.HandleFunc("/ws", HandleWebSocketConnection)

	http.HandleFunc("/user", handleUser)

	http.HandleFunc("/ad", handleAd)

	http.HandleFunc("/chat", handleChat)
	http.HandleFunc("/chat/:id", handleChatByID)

	http.HandleFunc("/test", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Test endpoint hit")
		w.Write([]byte("Test endpoint is working!"))
	})
}


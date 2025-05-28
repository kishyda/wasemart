package routes

import (
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
}

package routes

import "net/http"

func RegisterRoutes() {

	http.HandleFunc("/auth", handleMain)
	http.HandleFunc("/auth/login", handleLogin)
	http.HandleFunc("/auth/callback", handleCallback)

	http.HandleFunc("/getAds", GetAds)

    http.HandleFunc("/ws", HandleWebSocketConnection)
}

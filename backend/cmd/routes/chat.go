package routes

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"wasemart/cmd/lib"
	"wasemart/cmd/models"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Connections map[string]*websocket.Conn

var connections Connections = make(map[string]*websocket.Conn)

func (c *Connections) sendMessage(m *models.Message) {
	conn, ok := connections[m.ToUser.String()]; if ok {
		conn.WriteJSON(m)
	}
	if err := lib.DB.Create(m).Error; err != nil {
		fmt.Println("Error saving message to database:", err)
		conn.WriteMessage(websocket.TextMessage, []byte("Error saving message to database: "+err.Error()))
		return
	}
}

func HandleWebSocketConnection(w http.ResponseWriter, r *http.Request) {
	fmt.Println("connection made")
	id := r.URL.Query().Get("id"); if id == "" {
		http.Error(w, "Missing 'id' query parameter", http.StatusBadRequest)
		return
	}
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error upgrading connection:", err)
		return
	}
	if conn == nil {
		log.Println("Connection is nil")
		return
	}
	connections[id] = conn
	go func() {
		for {
			defer conn.Close()
			defer delete(connections, id)
			message := models.Message{}
			if error := conn.ReadJSON(&message); error != nil {
				break
			}
			fmt.Println(message)
			connections.sendMessage(&message)
		}
	}()
}

func handleChat(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:

		accessToken, err := r.Cookie("accesstoken"); if err != nil {
			http.Error(w, "Error getting access token cookie: "+err.Error(), http.StatusUnauthorized)
			return
		}

		refreshToken, err := r.Cookie("refreshtoken"); if err != nil {
			http.Error(w, "Error getting refresh token cookie: "+err.Error(), http.StatusUnauthorized)
			return
		}

		result, err := lib.ValidateGoogleAccessTokenAndGetUserInfo(accessToken.Value, refreshToken.Value); if err != nil {
			http.Error(w, "Error validating access token: "+err.Error(), http.StatusInternalServerError)
			return
		}

		var user models.User
		if err := lib.DB.First(&user, "email = ?", result.UserInfo.Email).Error; err != nil {
			http.Error(w, "Error getting user from email: "+err.Error(), http.StatusInternalServerError)
			return
		}

		var chats []models.Chat
		err = lib.DB.Find(&chats, "buyer = ? OR seller = ?", user.ID, user.ID).Error; if err != nil {
			http.Error(w, "Failed to get chats: "+err.Error(), http.StatusInternalServerError)
		}
		json.NewEncoder(w).Encode(chats)

	case http.MethodPost:

		var chat models.Chat
		if err := json.NewDecoder(r.Body).Decode(&chat); err != nil {
			http.Error(w, "Invalid input: "+err.Error(), http.StatusBadRequest)
			return
		}
		if err := lib.DB.Create(&chat).Error; err != nil {
			http.Error(w, "Failed to create chat: "+err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)

	case http.MethodDelete:

		var chat models.Chat
		if err := json.NewDecoder(r.Body).Decode(&chat); err != nil {
			http.Error(w, "Invalid input: "+err.Error(), http.StatusBadRequest)
			return
		}
		if err := lib.DB.Delete(&chat).Error; err != nil {
			http.Error(w, "Failed to delete chat: "+err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK) 

		// No need for updating chat?...
	// case http.MethodPut:
	// 	GetChat(w, r)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

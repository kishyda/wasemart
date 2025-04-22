package main

import (
	"context"
	"github.com/gorilla/websocket"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"net/http"
)

type Restaurant struct {
	Name         string        `bson:"name,omitempty"`
	RestaurantId string        `bson:"restaurant_id,omitempty"`
	Cuisine      string        `bson:"cuisine,omitempty"`
	Address      interface{}   `bson:"address,omitempty"`
	Borough      string        `bson:"borough,omitempty"`
	Grades       []interface{} `bson:"grades,omitempty"`
}

type Message struct {
	From    string   `bson:"From,omitempty"`
	To      string   `bson:"To,omitempty"`
	Message string   `bson:"Message,omitempty"`
}

var c = cors.New(cors.Options{
	AllowedOrigins:   []string{"*"},
	AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodDelete},
	AllowedHeaders:   []string{"*"},
	AllowCredentials: true,
})

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Connections map[string]*websocket.Conn

var connections Connections = make(map[string]*websocket.Conn)

func (c *Connections) sendMessage(m *Message) {
    (*c)[m.To].WriteJSON(m)
}

func main() {
	client, err := mongo.Connect(options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		panic(err)
	}
	if err := client.Ping(context.TODO(), nil); err != nil {
		print("Error in connecting to client ", err)
	}
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	db := client.Database("db")
	_ = db.Collection("collection")

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./build/index.html")
	})

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		go func() {
			conn, err := upgrader.Upgrade(w, r, nil)
            defer conn.Close()
            connections["PLACEHOLDERID"] = conn
            defer delete(connections, "PLACEHOLDERID")
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
            if conn == nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
            }
			for {
                message := Message{}
				if error := conn.ReadJSON(message); error != nil {
                    print("Perhaps the connection is closed?", error)
                }
                print(message)
                conn.WriteJSON(message)
                connections.sendMessage(&message)
			}
		}()
	})

	http.ListenAndServe(":8080", nil)
}

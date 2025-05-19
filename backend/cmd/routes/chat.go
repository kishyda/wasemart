package routes

import (
	"fmt"
	"net/http"
	"wasemart/cmd/database"
	"wasemart/cmd/types"

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

func (c *Connections) sendMessage(m *types.Message) {
	conn, ok := connections[m.To]
	if ok {
		conn.WriteJSON(m)
	}
}

func HandleWebSocketConnection(w http.ResponseWriter, r *http.Request) {
    fmt.Println("connection made")
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        w.WriteHeader(http.StatusInternalServerError)
        return
    }
    if conn == nil {
        w.WriteHeader(http.StatusInternalServerError)
        return
    }
    id, err := r.Cookie("id")
    if err != nil {
        w.WriteHeader(http.StatusInternalServerError)
        w.Write([]byte(err.Error()))
    }
    connections[id.Value] = conn
    go func() {
        for {
            defer conn.Close()
            defer delete(connections, id.Value)
            message := types.Message{}
            if error := conn.ReadJSON(&message); error != nil {
                println("Perhaps the connection is closed?", error)
                break
            }
            fmt.Println(message)
            conn.WriteJSON(message)
            connections.sendMessage(&message)
        }
    }()
}

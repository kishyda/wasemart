package database

import (
	"fmt"
	"log"
	"wasemart/cmd/types"
)

// CREATE TABLE IF NOT EXISTS Message (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     chat_id UUID NOT NULL REFERENCES Chat(id) ON DELETE CASCADE,
//     from_user UUID NOT NULL REFERENCES "User"(id),
//     message VARCHAR(100) NOT NULL,
//     timestamp TIMESTAMP DEFAULT NOW()
// );

func InsertNewChat() {
}

func InsertNewMessage(m *types.Message) {
	_, err := database.Exec(fmt.Sprintf("INSERT INTO Messages (chat_id, from_user, message) VALUES ()", m.ChatId, m.From, m.Message))
	if err != nil {
		log.Print(err)
	}
}

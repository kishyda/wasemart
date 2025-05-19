package types

type User struct {
    uuid string
    userEmail string
    // store references of uuid
    ads []string
    // store references of uuid
    chats []string
}

type Ad struct {
    uuid string
    title string
    price float32
    category string
    description string
    contact string
    files []string
    location []string
    userEmail string
};

type Message struct {
	ChatId    string   `bson:"chat_id"`
	From      string   `bson:"From,omitempty"`
	To        string   `bson:"To,omitempty"`
	Message   string   `bson:"Message,omitempty"`
}

type chat struct {
    uuid string
    messages []string
}

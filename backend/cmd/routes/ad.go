package routes

import "net/http"

// CREATE TABLE Ad (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     user_id UUID REFERENCES "User"(id) ON DELETE CASCADE,  -- Link to User
//     title VARCHAR(100) NOT NULL,
//     price NUMERIC NOT NULL,
//     category VARCHAR(100) NOT NULL,
//     description VARCHAR(1000) NOT NULL,
//     contact VARCHAR(100) NOT NULL,
//     files VARCHAR(100)[] NOT NULL,
//     locations VARCHAR(100)[] NOT NULL
// );

type Ad struct {
	id          string
	user_id     string
	title       string
	price       float64
	category    string
	description string
	contact     string
	pictures    []string
	locations   []string
}

func GetAds(w http.ResponseWriter, r *http.Request) {}

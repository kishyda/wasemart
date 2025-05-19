package database

import "fmt"

type Ad struct {
	ID          string
	UserID     string
	Title       string
	Price       float64
	Category    string
	Description string
	Contact     string
	Pictures    []string
	Locations   []string
}

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

func GetAdsFromDB() []Ad {
    rows, err := database.Query("SELECT id, user_id, title, price, category, description, contact FROM Ad")
    if err != nil {
        panic(err)
    }
    defer rows.Close()

    var ads []Ad
    for rows.Next() {
        var ad Ad
        err := rows.Scan(&ad.ID, &ad.UserID, &ad.Title, &ad.Price, &ad.Category, &ad.Description, &ad.Contact)
        if err != nil {
            panic(err)
        }
        ads = append(ads, ad)
    }

    return ads
}

func InsertAdToDB(ad Ad) {
	database.Exec(fmt.Sprintf("INSERT INTO Ad (id, user_id, title, price, category, description, contact, files, locations) VALUES (%s, %s, %s, %f, %s, %s, %s, %s, %s)", ad.ID, ad.UserID, ad.Title, ad.Price, ad.Category, ad.Description, ad.Contact, ad.Pictures, ad.Locations))
}

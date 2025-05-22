CREATE DATABASE IF NOT EXISTS Main;

CREATE TABLE IF NOT EXISTS User (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userEmail VARCHAR(254),
);

CREATE TABLE IF NOT EXISTS Ad (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES "User"(id) ON DELETE CASCADE,  -- Link to User
    title VARCHAR(100) NOT NULL,
    price NUMERIC NOT NULL,
    category VARCHAR(100) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    contact VARCHAR(100) NOT NULL,
    files VARCHAR(100)[] NOT NULL,
    locations VARCHAR(100)[] NOT NULL
);

CREATE TABLE IF NOT EXISTS Chat (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer UUID NOT NULL REFERENCES "User"(id),
    seller UUID NOT NULL REFERENCES "User"(id),
    ad_id UUID NOT NULL REFERENCES Ad(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Message (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL REFERENCES Chat(id) ON DELETE CASCADE,
    from_user UUID NOT NULL REFERENCES "User"(id),
    to_user UUID NOT NULL REFERENCES "User"(id),
    message VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Speed up lookups by user
CREATE INDEX IF NOT EXISTS idx_ad_user_id ON Ad(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_buyer ON Chat(buyer);
CREATE INDEX IF NOT EXISTS idx_chat_seller ON Chat(seller);
CREATE INDEX IF NOT EXISTS idx_message_chat_id ON Message(chat_id);
CREATE INDEX IF NOT EXISTS idx_message_from_user ON Message(from_user);


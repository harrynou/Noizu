CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    hashed_password VARCHAR(255),
    spotify_account_id INTEGER DEFAULT NULL,
    soundcloud_account_id INTEGER DEFAULT NULL,
    volume FLOAT DEFAULT 0.5,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE linked_accounts (
    account_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
    premium BOOLEAN DEFAULT FALSE,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(50) NOT NULL,
    refresh_token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (provider, provider_user_id)
);

CREATE TABLE favorites (
    favorite_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) on DELETE CASCADE NOT NULL,
    provider VARCHAR(50) NOT NULL,
    track_id VARCHAR(50) NOT NULL,
    favorited_at TIMESTAMP WITH DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, provider, track_id)
);

ALTER TABLE users
    ADD CONSTRAINT fk_spotify_account
    FOREIGN KEY (spotify_account_id)
    REFERENCES linked_accounts(account_id)
    ON DELETE SET NULL;

ALTER TABLE users
    ADD CONSTRAINT fk_soundcloud_account
    FOREIGN KEY (soundcloud_account_id)
    REFERENCES linked_accounts(account_id)
    ON DELETE SET NULL;

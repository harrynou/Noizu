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
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
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
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    track_id VARCHAR(100) NOT NULL,
    favorited_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, provider, track_id)
);

CREATE TABLE playlists (
    playlist_id SERIAL PRIMARY KEY,	
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
	name VARCHAR(256) NOT NULL,
	track_count INTEGER DEFAULT 0,
    image_url TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_played_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE playlist_tracks (
    playlist_track_id SERIAL PRIMARY KEY,
	playlist_id INTEGER NOT NULL REFERENCES playlists(playlist_id) ON DELETE CASCADE,
	track_id VARCHAR(100) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
	added_at TIMESTAMP DEFAULT NOW(),
	UNIQUE (playlist_id, track_id, provider)
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

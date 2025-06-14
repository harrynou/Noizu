CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    hashed_password VARCHAR(255),
    spotify_account_id INTEGER DEFAULT NULL,
    soundcloud_account_id INTEGER DEFAULT NULL,
    volume FLOAT DEFAULT 0.5,
    created_at TIMESTAMP DEFAULT NOW(),
    password_updated_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE linked_accounts (
    account_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    premium BOOLEAN DEFAULT FALSE,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(50) NOT NULL,
    provider_username VARCHAR(50) NOT NULL,
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

CREATE OR REPLACE FUNCTION user_modified()
RETURNS TRIGGER AS $$
BEGIN
    IF (
        NEW IS DISTINCT FROM OLD 
        AND (
            NEW.volume IS NOT DISTINCT FROM OLD.volume
        )
    ) THEN
        NEW.updated_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ language plpgsql;

CREATE OR REPLACE FUNCTION linked_accounts_modified()
RETURNS TRIGGER AS $$
BEGIN
    IF (
        NEW IS DISTINCT FROM OLD
    ) THEN 
        NEW.updated_at = NOW();
    END IF;
    RETURN NEW;

END;
$$ language plpgsql;

CREATE OR REPLACE FUNCTION user_password_modified()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.hashed_password IS DISTINCT FROM OLD.hashed_password THEN
        NEW.password_updated_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER user_modified_trigger
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION user_modified();

CREATE TRIGGER linked_accounts_modified_trigger
BEFORE UPDATE ON linked_accounts
FOR EACH ROW
EXECUTE FUNCTION linked_accounts_modified();

CREATE TRIGGER user_modified_password_trigger
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION user_password_modified();

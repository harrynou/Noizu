CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	email VARCHAR(255) UNIQUE NOT NULL,
	password_hash VARCHAR(255),
	spotify_connected BOOLEAN DEFAULT FALSE,
	soundcloud_connected BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE api_tokens (
	id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id) on DELETE CASCADE,
	provider VARCHAR(50) NOT NULL,
	access_token text NOT NULL, 
	refresh_token text NOT NULL,
	expires_at TIMESTAMP,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
);


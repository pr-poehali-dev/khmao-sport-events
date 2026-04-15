CREATE TABLE IF NOT EXISTS t_p2335699_khmao_sport_events.sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p2335699_khmao_sport_events.users(id),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p2335699_khmao_sport_events.posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image_url TEXT,
    author_id INTEGER REFERENCES t_p2335699_khmao_sport_events.users(id),
    tags TEXT[],
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p2335699_khmao_sport_events.event_registrations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p2335699_khmao_sport_events.users(id),
    event_id INTEGER NOT NULL REFERENCES t_p2335699_khmao_sport_events.events(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, event_id)
);
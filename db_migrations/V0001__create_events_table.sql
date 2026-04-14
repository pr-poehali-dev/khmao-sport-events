
CREATE TABLE IF NOT EXISTS t_p2335699_khmao_sport_events.events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    sport VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    end_date DATE,
    location VARCHAR(255) NOT NULL,
    level VARCHAR(50) NOT NULL CHECK (level IN ('regional', 'federal', 'international')),
    participants INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    image_url TEXT,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO t_p2335699_khmao_sport_events.events (title, sport, date, end_date, location, level, participants, description, image_url, tags) VALUES
('Кубок Губернатора по биатлону', 'Биатлон', '2026-01-15', '2026-01-18', 'Биатлонный комплекс «Югра»', 'international', 250, 'Ежегодный международный турнир по биатлону на призы Губернатора ХМАО-Югры. Участвуют ведущие спортсмены из 20+ стран.', 'https://cdn.poehali.dev/projects/bedfc3d3-ec88-4a38-aa9b-6b3fe1ddd98d/files/af9e3b8f-159a-4186-a77f-c9d72a5783c5.jpg', ARRAY['Кубок', 'Элита']),
('Чемпионат ХМАО по лыжным гонкам', 'Лыжные гонки', '2026-02-05', '2026-02-07', 'Лыжный стадион им. Рочева', 'regional', 180, 'Главный региональный старт сезона по лыжным гонкам. Программа включает спринт, гонку с раздельным стартом и масс-старт.', 'https://cdn.poehali.dev/projects/bedfc3d3-ec88-4a38-aa9b-6b3fe1ddd98d/files/0e61203e-60ee-47ee-9bc7-7db5e616c7c3.jpg', ARRAY['Чемпионат', 'Официальный']),
('Открытый турнир по хоккею «Северная шайба»', 'Хоккей', '2026-02-20', '2026-02-23', 'Ледовый дворец «Арена Югра»', 'federal', 320, 'Турнир для молодёжных хоккейных команд до 18 лет. 16 команд из регионов России борются за главный трофей.', 'https://cdn.poehali.dev/projects/bedfc3d3-ec88-4a38-aa9b-6b3fe1ddd98d/files/461f1064-2c3f-49dc-8578-a99ef4cc86bc.jpg', ARRAY['U-18', 'Турнир']),
('Первенство города по плаванию', 'Плавание', '2026-03-12', NULL, 'Плавательный бассейн «Дельфин»', 'regional', 120, 'Городское первенство по плаванию среди юношей и девушек. Программа включает вольный стиль, брасс, баттерфляй и эстафеты.', NULL, ARRAY['Первенство', 'Молодёжь']),
('Марафон «Югра»', 'Лёгкая атлетика', '2026-04-19', NULL, 'Центральная набережная', 'federal', 1500, 'Массовый городской марафон открытый для всех желающих. Дистанции: 5 км, 10 км, полумарафон и марафон 42,2 км.', NULL, ARRAY['Массовый старт', 'Для всех']),
('Первенство ХМАО по вольной борьбе', 'Борьба', '2026-05-03', '2026-05-04', 'Дворец спорта «Олимп»', 'regional', 200, 'Региональное первенство по вольной борьбе среди юношей и юниоров. 12 весовых категорий.', NULL, ARRAY['Первенство', 'Боевые искусства']);

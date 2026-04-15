UPDATE t_p2335699_khmao_sport_events.users
SET password_hash = encode(sha256(('hmao_sport_2026admin123')::bytea), 'hex')
WHERE email = 'admin@sport-hmao.ru';
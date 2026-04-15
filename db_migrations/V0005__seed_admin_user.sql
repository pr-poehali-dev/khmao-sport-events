INSERT INTO t_p2335699_khmao_sport_events.users (name, email, phone, city, sport, rank, password_hash, role)
VALUES (
  'Администратор',
  'admin@sport-hmao.ru',
  '+7 (3467) 00-00-00',
  'Ханты-Мансийск',
  'Все виды спорта',
  'Организатор',
  '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
  'admin'
) ON CONFLICT (email) DO UPDATE SET
  password_hash = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
  role = 'admin';
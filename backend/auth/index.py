"""Регистрация, вход, выход, получение текущего пользователя."""

import json
import os
import secrets
import hashlib
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
}
S = 't_p2335699_khmao_sport_events'


def conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def hash_password(password: str) -> str:
    salt = 'hmao_sport_2026'
    return hashlib.sha256(f'{salt}{password}'.encode()).hexdigest()


def ok(data: dict) -> dict:
    return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps(data, ensure_ascii=False, default=str)}


def err(msg: str, code: int = 400) -> dict:
    return {'statusCode': code, 'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': msg}, ensure_ascii=False)}


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/').rstrip('/')
    action = path.split('/')[-1] if '/' in path else path.lstrip('/')

    body = {}
    if event.get('body'):
        body = json.loads(event['body'])

    session_id = (event.get('headers') or {}).get('x-session-id') or \
                 (event.get('queryStringParameters') or {}).get('session_id')

    db = conn()
    cur = db.cursor(cursor_factory=RealDictCursor)

    # --- GET /me ---
    if method == 'GET' and action in ('me', ''):
        if not session_id:
            return err('Не авторизован', 401)
        cur.execute(
            f"SELECT s.id, s.expires_at, u.id as user_id, u.name, u.email, u.phone, u.city, u.sport, u.rank, u.role, u.created_at "
            f"FROM {S}.sessions s JOIN {S}.users u ON u.id = s.user_id "
            f"WHERE s.id = %s AND s.expires_at > NOW()",
            (session_id,)
        )
        row = cur.fetchone()
        if not row:
            return err('Сессия истекла', 401)
        cur.close(); db.close()
        user = {k: v for k, v in dict(row).items() if k not in ('id', 'expires_at')}
        return ok({'user': user, 'session_id': session_id})

    # --- POST /register ---
    if method == 'POST' and action == 'register':
        name = (body.get('name') or '').strip()
        email = (body.get('email') or '').strip().lower()
        password = body.get('password') or ''
        phone = (body.get('phone') or '').strip()
        city = (body.get('city') or 'Ханты-Мансийск').strip()
        sport = (body.get('sport') or '').strip()

        if not name or not email or not password:
            return err('Заполните имя, email и пароль')
        if len(password) < 6:
            return err('Пароль должен быть не менее 6 символов')

        cur.execute(f"SELECT id FROM {S}.users WHERE email = %s", (email,))
        if cur.fetchone():
            cur.close(); db.close()
            return err('Пользователь с таким email уже существует')

        pw_hash = hash_password(password)
        cur.execute(
            f"INSERT INTO {S}.users (name, email, phone, city, sport, password_hash) "
            f"VALUES (%s, %s, %s, %s, %s, %s) RETURNING id, name, email, role, created_at",
            (name, email, phone, city, sport, pw_hash)
        )
        user = dict(cur.fetchone())

        sid = secrets.token_hex(32)
        expires = datetime.now() + timedelta(days=30)
        cur.execute(
            f"INSERT INTO {S}.sessions (id, user_id, expires_at) VALUES (%s, %s, %s)",
            (sid, user['id'], expires)
        )
        db.commit(); cur.close(); db.close()
        return ok({'user': user, 'session_id': sid})

    # --- POST /login ---
    if method == 'POST' and action == 'login':
        email = (body.get('email') or '').strip().lower()
        password = body.get('password') or ''

        if not email or not password:
            return err('Введите email и пароль')

        pw_hash = hash_password(password)
        cur.execute(
            f"SELECT id, name, email, role, city, sport, rank, phone, created_at "
            f"FROM {S}.users WHERE email = %s AND password_hash = %s AND is_active = TRUE",
            (email, pw_hash)
        )
        user = cur.fetchone()
        if not user:
            cur.close(); db.close()
            return err('Неверный email или пароль')

        user = dict(user)
        sid = secrets.token_hex(32)
        expires = datetime.now() + timedelta(days=30)
        cur.execute(
            f"INSERT INTO {S}.sessions (id, user_id, expires_at) VALUES (%s, %s, %s)",
            (sid, user['id'], expires)
        )
        db.commit(); cur.close(); db.close()
        return ok({'user': user, 'session_id': sid})

    # --- POST /logout ---
    if method == 'POST' and action == 'logout':
        if session_id:
            cur.execute(f"UPDATE {S}.sessions SET expires_at = NOW() WHERE id = %s", (session_id,))
            db.commit()
        cur.close(); db.close()
        return ok({'ok': True})

    cur.close(); db.close()
    return err('Not found', 404)

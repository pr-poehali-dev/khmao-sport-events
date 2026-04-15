"""Статистика и управление для администратора."""

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
}
S = 't_p2335699_khmao_sport_events'


def conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def ok(data: dict) -> dict:
    return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps(data, ensure_ascii=False, default=str)}


def err(msg: str, code: int = 400) -> dict:
    return {'statusCode': code, 'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': msg}, ensure_ascii=False)}


def check_admin(cur, session_id: str):
    if not session_id:
        return None
    cur.execute(
        f"SELECT u.id, u.role FROM {S}.sessions s JOIN {S}.users u ON u.id = s.user_id "
        f"WHERE s.id = %s AND s.expires_at > NOW()",
        (session_id,)
    )
    row = cur.fetchone()
    if not row or row['role'] != 'admin':
        return None
    return dict(row)


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'stats')
    session_id = (event.get('headers') or {}).get('x-session-id') or params.get('session_id')

    body = {}
    if event.get('body'):
        body = json.loads(event['body'])

    db = conn()
    cur = db.cursor(cursor_factory=RealDictCursor)

    admin = check_admin(cur, session_id)
    if not admin:
        cur.close(); db.close()
        return err('Доступ запрещён', 403)

    # GET /stats
    if method == 'GET' and action in ('stats', ''):
        cur.execute(f"SELECT COUNT(*) as total FROM {S}.users WHERE role = 'user'")
        users_total = cur.fetchone()['total']
        cur.execute(f"SELECT COUNT(*) as total FROM {S}.users WHERE role = 'user' AND created_at > NOW() - INTERVAL '7 days'")
        users_week = cur.fetchone()['total']
        cur.execute(f"SELECT COUNT(*) as total FROM {S}.events")
        events_total = cur.fetchone()['total']
        cur.execute(f"SELECT COUNT(*) as total FROM {S}.posts WHERE published = TRUE")
        posts_total = cur.fetchone()['total']
        cur.execute(f"SELECT COUNT(*) as total FROM {S}.event_registrations")
        regs_total = cur.fetchone()['total']

        cur.execute(
            f"SELECT sport, COUNT(*) as count FROM {S}.users WHERE sport IS NOT NULL AND sport != '' "
            f"GROUP BY sport ORDER BY count DESC LIMIT 5"
        )
        top_sports = [dict(r) for r in cur.fetchall()]

        cur.execute(
            f"SELECT u.name, u.email, u.city, u.sport, u.role, u.created_at "
            f"FROM {S}.users u ORDER BY u.created_at DESC LIMIT 10"
        )
        recent_users = [dict(r) for r in cur.fetchall()]

        cur.close(); db.close()
        return ok({
            'stats': {
                'users_total': users_total,
                'users_week': users_week,
                'events_total': events_total,
                'posts_total': posts_total,
                'registrations_total': regs_total,
            },
            'top_sports': top_sports,
            'recent_users': recent_users,
        })

    # POST /event - добавить мероприятие
    if method == 'POST' and action == 'event':
        title = (body.get('title') or '').strip()
        sport = (body.get('sport') or '').strip()
        date = body.get('date')
        location = (body.get('location') or '').strip()
        level = body.get('level', 'regional')
        participants = int(body.get('participants') or 0)
        description = (body.get('description') or '').strip()
        image_url = body.get('image_url')
        tags = body.get('tags') or []
        end_date = body.get('end_date')

        if not title or not sport or not date or not location:
            cur.close(); db.close()
            return err('Заполните обязательные поля: название, вид спорта, дата, место')

        cur.execute(
            f"INSERT INTO {S}.events (title, sport, date, end_date, location, level, participants, description, image_url, tags) "
            f"VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING *",
            (title, sport, date, end_date, location, level, participants, description, image_url, tags)
        )
        ev = dict(cur.fetchone())
        db.commit(); cur.close(); db.close()
        return ok({'event': ev})

    # PUT /event - обновить мероприятие
    if method == 'PUT' and action == 'event':
        ev_id = body.get('id')
        if not ev_id:
            cur.close(); db.close()
            return err('Укажите id мероприятия')

        fields, vals = [], []
        for f in ('title', 'sport', 'date', 'end_date', 'location', 'level', 'participants', 'description', 'image_url'):
            if f in body:
                fields.append(f"{f} = %s")
                vals.append(body[f])
        if 'tags' in body:
            fields.append("tags = %s")
            vals.append(body['tags'])

        if not fields:
            cur.close(); db.close()
            return err('Нет данных для обновления')

        fields.append("updated_at = NOW()")
        vals.append(ev_id)
        cur.execute(
            f"UPDATE {S}.events SET {', '.join(fields)} WHERE id = %s RETURNING *",
            vals
        )
        ev = cur.fetchone()
        db.commit(); cur.close(); db.close()
        if not ev:
            return err('Мероприятие не найдено', 404)
        return ok({'event': dict(ev)})

    # GET /users
    if method == 'GET' and action == 'users':
        cur.execute(
            f"SELECT id, name, email, phone, city, sport, rank, role, is_active, created_at "
            f"FROM {S}.users ORDER BY created_at DESC"
        )
        users = [dict(r) for r in cur.fetchall()]
        cur.close(); db.close()
        return ok({'users': users})

    cur.close(); db.close()
    return err('Not found', 404)
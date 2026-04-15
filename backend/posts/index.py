"""CRUD для новостей и публичное получение постов."""

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


def get_session_user(cur, session_id: str):
    if not session_id:
        return None
    cur.execute(
        f"SELECT u.id, u.role FROM {S}.sessions s JOIN {S}.users u ON u.id = s.user_id "
        f"WHERE s.id = %s AND s.expires_at > NOW()",
        (session_id,)
    )
    row = cur.fetchone()
    return dict(row) if row else None


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/').rstrip('/')
    params = event.get('queryStringParameters') or {}
    session_id = (event.get('headers') or {}).get('x-session-id') or params.get('session_id')

    body = {}
    if event.get('body'):
        body = json.loads(event['body'])

    db = conn()
    cur = db.cursor(cursor_factory=RealDictCursor)

    # GET /  - список постов
    if method == 'GET':
        limit = int(params.get('limit', 20))
        offset = int(params.get('offset', 0))
        published_only = params.get('all') != '1'

        where = f"WHERE p.published = TRUE" if published_only else ""
        cur.execute(
            f"SELECT p.*, u.name as author_name FROM {S}.posts p "
            f"LEFT JOIN {S}.users u ON u.id = p.author_id "
            f"{where} ORDER BY p.created_at DESC LIMIT %s OFFSET %s",
            (limit, offset)
        )
        rows = [dict(r) for r in cur.fetchall()]
        cur.execute(f"SELECT COUNT(*) as total FROM {S}.posts {where}")
        total = cur.fetchone()['total']
        cur.close(); db.close()
        return ok({'posts': rows, 'total': total})

    # POST / - создать пост (только admin)
    if method == 'POST':
        user = get_session_user(cur, session_id)
        if not user or user['role'] != 'admin':
            cur.close(); db.close()
            return err('Доступ запрещён', 403)

        title = (body.get('title') or '').strip()
        content = (body.get('content') or '').strip()
        if not title or not content:
            cur.close(); db.close()
            return err('Заполните заголовок и содержание')

        excerpt = (body.get('excerpt') or content[:200]).strip()
        image_url = body.get('image_url')
        tags = body.get('tags') or []
        published = body.get('published', True)

        cur.execute(
            f"INSERT INTO {S}.posts (title, content, excerpt, image_url, author_id, tags, published) "
            f"VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING *",
            (title, content, excerpt, image_url, user['id'], tags, published)
        )
        post = dict(cur.fetchone())
        db.commit(); cur.close(); db.close()
        return ok({'post': post})

    # PUT / - обновить пост (только admin)
    if method == 'PUT':
        user = get_session_user(cur, session_id)
        if not user or user['role'] != 'admin':
            cur.close(); db.close()
            return err('Доступ запрещён', 403)

        post_id = body.get('id')
        if not post_id:
            cur.close(); db.close()
            return err('Укажите id поста')

        fields, vals = [], []
        for f in ('title', 'content', 'excerpt', 'image_url', 'published'):
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
        vals.append(post_id)
        cur.execute(
            f"UPDATE {S}.posts SET {', '.join(fields)} WHERE id = %s RETURNING *",
            vals
        )
        post = cur.fetchone()
        db.commit(); cur.close(); db.close()
        if not post:
            return err('Пост не найден', 404)
        return ok({'post': dict(post)})

    cur.close(); db.close()
    return err('Not found', 404)

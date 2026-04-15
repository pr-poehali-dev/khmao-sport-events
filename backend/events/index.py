"""Получение и управление мероприятиями ХМАО-Югры из базы данных."""

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
}

SCHEMA = 't_p2335699_khmao_sport_events'


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}

    if method == 'GET':
        sport = params.get('sport', '')
        level = params.get('level', '')
        search = params.get('search', '')
        month = params.get('month', '')
        year = params.get('year', '')

        conditions = []
        values = []

        if sport:
            conditions.append('sport = %s')
            values.append(sport)
        if level:
            conditions.append('level = %s')
            values.append(level)
        if search:
            conditions.append('(title ILIKE %s OR location ILIKE %s)')
            values.extend([f'%{search}%', f'%{search}%'])
        if month and year:
            conditions.append("EXTRACT(MONTH FROM date) = %s AND EXTRACT(YEAR FROM date) = %s")
            values.extend([int(month), int(year)])

        where = ('WHERE ' + ' AND '.join(conditions)) if conditions else ''
        sql = f'SELECT * FROM {SCHEMA}.events {where} ORDER BY date ASC'

        conn = get_conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(sql, values)
        rows = cur.fetchall()
        cur.close()
        conn.close()

        result = []
        for row in rows:
            r = dict(row)
            r['date'] = str(r['date']) if r['date'] else None
            r['end_date'] = str(r['end_date']) if r['end_date'] else None
            r['created_at'] = str(r['created_at']) if r['created_at'] else None
            r['updated_at'] = str(r['updated_at']) if r['updated_at'] else None
            r['tags'] = r['tags'] or []
            result.append(r)

        return {
            'statusCode': 200,
            'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
            'body': json.dumps({'events': result, 'total': len(result)}, ensure_ascii=False),
        }

    # POST /register - записаться на мероприятие
    if method == 'POST':
        body = {}
        if event.get('body'):
            body = json.loads(event['body'])

        session_id = (event.get('headers') or {}).get('x-session-id')
        event_id = body.get('event_id')

        if not session_id:
            return {'statusCode': 401, 'headers': CORS_HEADERS,
                    'body': json.dumps({'error': 'Необходима авторизация'}, ensure_ascii=False)}

        conn = get_conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute(
            f"SELECT u.id FROM {SCHEMA}.sessions s JOIN {SCHEMA}.users u ON u.id = s.user_id "
            f"WHERE s.id = %s AND s.expires_at > NOW()", (session_id,)
        )
        user = cur.fetchone()
        if not user:
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': CORS_HEADERS,
                    'body': json.dumps({'error': 'Сессия истекла'}, ensure_ascii=False)}

        cur.execute(
            f"INSERT INTO {SCHEMA}.event_registrations (user_id, event_id, status) "
            f"VALUES (%s, %s, 'confirmed') ON CONFLICT (user_id, event_id) DO NOTHING RETURNING id",
            (user['id'], event_id)
        )
        conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True, 'message': 'Регистрация подтверждена!'}, ensure_ascii=False)}

    return {
        'statusCode': 405,
        'headers': CORS_HEADERS,
        'body': json.dumps({'error': 'Method not allowed'}),
    }
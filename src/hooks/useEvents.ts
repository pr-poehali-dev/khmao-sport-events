import { useState, useEffect, useCallback } from 'react';

const API_URL = 'https://functions.poehali.dev/14f13334-7ef7-48e8-8873-8b12d76ef588';

export interface SportEvent {
  id: number;
  title: string;
  sport: string;
  date: string;
  end_date?: string | null;
  location: string;
  level: 'regional' | 'federal' | 'international';
  participants: number;
  description: string;
  image_url?: string | null;
  tags: string[];
}

interface UseEventsParams {
  sport?: string;
  level?: string;
  search?: string;
  month?: number;
  year?: number;
}

export function useEvents(params: UseEventsParams = {}) {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    const query = new URLSearchParams();
    if (params.sport && params.sport !== 'Все виды') query.set('sport', params.sport);
    if (params.level && params.level !== 'all') query.set('level', params.level);
    if (params.search) query.set('search', params.search);
    if (params.month != null) query.set('month', String(params.month));
    if (params.year != null) query.set('year', String(params.year));

    const url = `${API_URL}?${query.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Ошибка загрузки данных');
    const data = await res.json();
    setEvents(data.events || []);
    setLoading(false);
  }, [params.sport, params.level, params.search, params.month, params.year]);

  useEffect(() => {
    fetchEvents().catch((e) => {
      setError(e.message);
      setLoading(false);
    });
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}

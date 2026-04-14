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

export const SPORTS = [
  'Все виды',
  'Биатлон',
  'Лыжные гонки',
  'Хоккей',
  'Плавание',
  'Лёгкая атлетика',
  'Борьба',
  'Волейбол',
  'Баскетбол',
];

export const LEVELS = [
  { value: 'all', label: 'Все уровни' },
  { value: 'regional', label: 'Региональный' },
  { value: 'federal', label: 'Федеральный' },
  { value: 'international', label: 'Международный' },
];

export const LEVEL_LABELS: Record<string, string> = {
  regional: 'Региональный',
  federal: 'Федеральный',
  international: 'Международный',
};

export const LEVEL_COLORS: Record<string, string> = {
  regional: 'bg-emerald-100 text-emerald-700',
  federal: 'bg-blue-100 text-blue-700',
  international: 'bg-amber-100 text-amber-700',
};

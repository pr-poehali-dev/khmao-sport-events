import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useEvents } from '@/hooks/useEvents';
import { SPORTS, LEVELS, LEVEL_LABELS, LEVEL_COLORS } from '@/data/events';

export default function EventsPage() {
  const [selectedSport, setSelectedSport] = useState('Все виды');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { events, loading, error } = useEvents({
    sport: selectedSport,
    level: selectedLevel,
    search: debouncedSearch,
  });

  const searchTimerRef = { current: 0 };
  const handleSearch = (val: string) => {
    setSearchQuery(val);
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = window.setTimeout(() => setDebouncedSearch(val), 400);
  };

  return (
    <div className="pt-20 pb-16">
      <div className="bg-hmao-gradient py-14">
        <div className="container mx-auto px-4">
          <div className="text-hmao-teal text-sm font-medium uppercase tracking-widest mb-2">Расписание</div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">Все мероприятия</h1>
          <p className="text-white/60 text-base">Найдите соревнование по душе и зарегистрируйтесь</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-border p-5 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Icon name="Search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск по названию или месту..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal transition-all"
              />
            </div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal bg-white min-w-[180px]"
            >
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {SPORTS.map((sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedSport === sport
                    ? 'bg-hmao-blue text-white shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-hmao-light hover:text-hmao-blue'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">
            Ошибка загрузки данных. Попробуйте обновить страницу.
          </div>
        )}

        {!loading && (
          <div className="text-sm text-muted-foreground mb-5">
            Найдено мероприятий: <span className="font-semibold text-hmao-blue">{events.length}</span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-border">
                <div className="h-44 bg-muted animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                  <div className="h-5 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-10 bg-muted rounded-xl animate-pulse mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Icon name="SearchX" size={48} className="mx-auto mb-4 opacity-30" />
            <div className="font-heading text-xl font-semibold mb-2">Ничего не найдено</div>
            <div className="text-sm">Попробуйте изменить фильтры поиска</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl overflow-hidden border border-border shadow-sm card-hover animate-fade-in"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                {event.image_url ? (
                  <div className="h-44 overflow-hidden">
                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  </div>
                ) : (
                  <div className="h-44 bg-hmao-gradient flex items-center justify-center">
                    <Icon name="Trophy" size={48} className="text-white/30" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${LEVEL_COLORS[event.level]}`}>
                      {LEVEL_LABELS[event.level]}
                    </span>
                    <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{event.sport}</span>
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-hmao-blue leading-snug mb-3">{event.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{event.description}</p>
                  <div className="space-y-2 text-sm text-muted-foreground border-t border-border pt-4">
                    <div className="flex items-center gap-2">
                      <Icon name="Calendar" size={13} className="text-hmao-teal shrink-0" />
                      <span>
                        {new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                        {event.end_date && ` — ${new Date(event.end_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={13} className="text-hmao-teal shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Users" size={13} className="text-hmao-teal shrink-0" />
                      <span>До {event.participants} участников</span>
                    </div>
                  </div>
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {event.tags.map((tag) => (
                        <span key={tag} className="text-xs text-hmao-teal bg-hmao-light px-2 py-0.5 rounded-md">#{tag}</span>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
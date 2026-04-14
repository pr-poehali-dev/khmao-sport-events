import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useEvents } from '@/hooks/useEvents';
import { LEVEL_COLORS, LEVEL_LABELS } from '@/data/events';

const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const WEEKDAYS = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

export default function CalendarPage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(0);

  const { events, loading } = useEvents({ month: viewMonth + 1, year: viewYear });

  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  const getEventsForDay = (day: number) =>
    events.filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === viewYear && d.getMonth() === viewMonth && d.getDate() === day;
    });

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const isToday = (day: number) =>
    today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;

  return (
    <div className="pt-20 pb-16">
      <div className="bg-hmao-gradient py-14">
        <div className="container mx-auto px-4">
          <div className="text-hmao-teal text-sm font-medium uppercase tracking-widest mb-2">Расписание</div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">Календарь событий</h1>
          <p className="text-white/60 text-base">Планируйте участие в мероприятиях заранее</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-hmao-blue">
                <button onClick={prevMonth} className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
                  <Icon name="ChevronLeft" size={18} />
                </button>
                <div className="font-heading text-xl font-semibold text-white uppercase tracking-wide">
                  {MONTHS[viewMonth]} {viewYear}
                </div>
                <button onClick={nextMonth} className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
                  <Icon name="ChevronRight" size={18} />
                </button>
              </div>

              <div className="grid grid-cols-7 border-b border-border">
                {WEEKDAYS.map((d) => (
                  <div key={d} className="py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {cells.map((day, idx) => {
                  if (!day) return <div key={`e-${idx}`} className="min-h-[72px] border-b border-r border-border/50 bg-muted/20" />;
                  const dayEvents = getEventsForDay(day);
                  return (
                    <div
                      key={day}
                      className={`min-h-[72px] p-1.5 border-b border-r border-border/50 transition-colors ${isToday(day) ? 'bg-hmao-light' : 'hover:bg-gray-50'}`}
                    >
                      <div className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1 ${isToday(day) ? 'bg-hmao-teal text-white' : 'text-foreground'}`}>
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.map((ev) => (
                          <div key={ev.id} className="text-[10px] leading-tight px-1.5 py-0.5 rounded bg-hmao-blue text-white truncate" title={ev.title}>
                            {ev.sport}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Events list */}
          <div>
            <div className="font-heading text-lg font-semibold text-hmao-blue mb-4">
              Мероприятия в {MONTHS[viewMonth].toLowerCase()}
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-xl border border-border p-4">
                    <div className="h-4 bg-muted rounded animate-pulse mb-2 w-2/3" />
                    <div className="h-5 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                  </div>
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="bg-white rounded-2xl border border-border p-8 text-center text-muted-foreground">
                <Icon name="CalendarX" size={36} className="mx-auto mb-3 opacity-30" />
                <div className="text-sm">В этом месяце мероприятий не запланировано</div>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl border border-border p-4 card-hover">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${LEVEL_COLORS[event.level]}`}>
                        {LEVEL_LABELS[event.level]}
                      </span>
                      <span className="text-xs font-semibold text-hmao-teal whitespace-nowrap">
                        {new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <div className="font-heading font-semibold text-hmao-blue text-sm leading-snug mb-1">{event.title}</div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Icon name="MapPin" size={11} className="text-hmao-teal shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 bg-hmao-light rounded-xl p-4">
              <div className="text-xs font-semibold text-hmao-blue uppercase tracking-wide mb-3">Быстрый переход</div>
              <div className="grid grid-cols-3 gap-1.5">
                {MONTHS.map((m, idx) => (
                  <button
                    key={m}
                    onClick={() => setViewMonth(idx)}
                    className={`py-1.5 text-xs rounded-lg transition-colors font-medium ${viewMonth === idx ? 'bg-hmao-blue text-white' : 'text-hmao-blue hover:bg-white'}`}
                  >
                    {m.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

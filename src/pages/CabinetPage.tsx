import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useEvents } from '@/hooks/useEvents';
import { LEVEL_LABELS, LEVEL_COLORS } from '@/data/events';

type Tab = 'profile' | 'registrations' | 'notifications';

export default function CabinetPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const { events } = useEvents();

  if (!isLoggedIn) {
    return (
      <div className="pt-20 pb-16 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-hmao-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="User" size={28} className="text-white" />
              </div>
              <h1 className="font-heading text-3xl font-bold text-hmao-blue">
                {isRegistering ? 'Регистрация' : 'Личный кабинет'}
              </h1>
              <p className="text-muted-foreground text-sm mt-2">
                {isRegistering ? 'Создайте аккаунт участника' : 'Войдите в свой аккаунт'}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
              <div className="space-y-4">
                {isRegistering && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">ФИО</label>
                    <input type="text" placeholder="Иванов Иван Иванович"
                      className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input type="email" placeholder="example@mail.ru" defaultValue="a.ivanov@mail.ru"
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
                </div>
                {isRegistering && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Телефон</label>
                    <input type="tel" placeholder="+7 (___) ___-__-__"
                      className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Пароль</label>
                  <input type="password" placeholder="Введите пароль" defaultValue="password123"
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
                </div>
                <button
                  onClick={() => setIsLoggedIn(true)}
                  className="w-full bg-hmao-blue hover:bg-hmao-teal text-white py-3 rounded-xl font-semibold text-sm transition-colors"
                >
                  {isRegistering ? 'Создать аккаунт' : 'Войти'}
                </button>
                {!isRegistering && (
                  <button className="w-full text-sm text-muted-foreground hover:text-hmao-teal transition-colors text-center">
                    Забыли пароль?
                  </button>
                )}
              </div>

              <div className="border-t border-border mt-5 pt-5 text-center">
                <span className="text-sm text-muted-foreground">
                  {isRegistering ? 'Уже есть аккаунт?' : 'Ещё нет аккаунта?'}
                </span>{' '}
                <button onClick={() => setIsRegistering(!isRegistering)} className="text-sm text-hmao-teal font-medium hover:text-hmao-blue transition-colors">
                  {isRegistering ? 'Войти' : 'Зарегистрироваться'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'profile', label: 'Профиль', icon: 'User' },
    { id: 'registrations', label: 'Мои заявки', icon: 'ClipboardList' },
    { id: 'notifications', label: 'Уведомления', icon: 'Bell' },
  ];

  return (
    <div className="pt-20 pb-16">
      <div className="bg-hmao-gradient py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white font-heading text-2xl font-bold">АИ</div>
            <div>
              <div className="font-heading text-2xl font-bold text-white">Иванов Алексей Сергеевич</div>
              <div className="text-white/60 text-sm">Биатлон · КМС · Ханты-Мансийск</div>
            </div>
            <button onClick={() => setIsLoggedIn(false)} className="ml-auto flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors">
              <Icon name="LogOut" size={15} />
              Выйти
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6">
        <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white text-hmao-blue shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Icon name={tab.icon} size={14} fallback="Circle" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-heading text-lg font-semibold text-hmao-blue mb-5">Личные данные</h3>
              <div className="space-y-4">
                {[
                  { label: 'ФИО', value: 'Иванов Алексей Сергеевич', icon: 'User' },
                  { label: 'Email', value: 'a.ivanov@mail.ru', icon: 'Mail' },
                  { label: 'Телефон', value: '+7 (929) 123-45-67', icon: 'Phone' },
                  { label: 'Город', value: 'Ханты-Мансийск', icon: 'MapPin' },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide">{f.label}</label>
                    <div className="flex items-center gap-2 mt-1 p-3 bg-muted/50 rounded-xl">
                      <Icon name={f.icon} size={14} className="text-hmao-teal shrink-0" fallback="Circle" />
                      <span className="text-sm font-medium">{f.value}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-5 w-full border border-hmao-blue text-hmao-blue hover:bg-hmao-blue hover:text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                Редактировать профиль
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-heading text-lg font-semibold text-hmao-blue mb-5">Спортивные данные</h3>
              {[
                { label: 'Вид спорта', value: 'Биатлон', icon: 'Trophy' },
                { label: 'Разряд', value: 'КМС', icon: 'Award' },
              ].map((f) => (
                <div key={f.label} className="mb-4">
                  <label className="text-xs text-muted-foreground uppercase tracking-wide">{f.label}</label>
                  <div className="flex items-center gap-2 mt-1 p-3 bg-muted/50 rounded-xl">
                    <Icon name={f.icon} size={14} className="text-hmao-teal shrink-0" fallback="Circle" />
                    <span className="text-sm font-medium">{f.value}</span>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-4 bg-hmao-light rounded-xl border border-hmao-teal/20">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="ShieldCheck" size={16} className="text-hmao-teal" />
                  <span className="text-sm font-semibold text-hmao-blue">Аккаунт подтверждён</span>
                </div>
                <p className="text-xs text-muted-foreground">Данные верифицированы спортивным комитетом ХМАО</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'registrations' && (
          <div className="animate-fade-in space-y-4">
            {events.slice(0, 2).map((event) => (
              <div key={event.id} className="bg-white rounded-2xl border border-border p-5 flex items-center gap-4 card-hover">
                <div className="w-12 h-12 bg-hmao-gradient rounded-xl flex items-center justify-center shrink-0">
                  <Icon name="Trophy" size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-semibold text-hmao-blue leading-snug">{event.title}</div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="Calendar" size={11} className="text-hmao-teal" />
                      {new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="MapPin" size={11} className="text-hmao-teal" />
                      {event.location}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${LEVEL_COLORS[event.level]}`}>
                    {LEVEL_LABELS[event.level]}
                  </span>
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <Icon name="CheckCircle" size={11} />
                    Подтверждена
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="animate-fade-in space-y-3">
            {[
              { icon: 'CheckCircle', color: 'text-emerald-500', title: 'Заявка подтверждена', text: 'Ваша заявка на «Кубок Губернатора по биатлону» принята', time: '2 часа назад' },
              { icon: 'Bell', color: 'text-hmao-teal', title: 'Напоминание', text: 'Чемпионат ХМАО по лыжным гонкам начнётся через 3 дня', time: '5 часов назад' },
              { icon: 'Info', color: 'text-blue-500', title: 'Обновление расписания', text: 'Изменено время старта в марафоне «Югра»', time: 'Вчера' },
            ].map((note, i) => (
              <div key={i} className="bg-white rounded-xl border border-border p-4 flex items-start gap-3 card-hover">
                <div className={`mt-0.5 shrink-0 ${note.color}`}>
                  <Icon name={note.icon} size={18} fallback="Circle" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-foreground">{note.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{note.text}</div>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{note.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

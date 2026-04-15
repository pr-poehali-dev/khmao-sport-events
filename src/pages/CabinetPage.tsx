import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/useAuth';
import { LEVEL_LABELS, LEVEL_COLORS } from '@/data/events';
import { useEvents } from '@/hooks/useEvents';
import { API, apiFetch } from '@/lib/api';

type Tab = 'profile' | 'registrations' | 'notifications';

interface CabinetPageProps {
  onNavigate: (page: string) => void;
}

export default function CabinetPage({ onNavigate }: CabinetPageProps) {
  const { user, loading, register, login, logout } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const { events } = useEvents();

  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', phone: '', city: 'Ханты-Мансийск', sport: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      await register(regForm);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Ошибка');
    } finally {
      setFormLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Ошибка');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-hmao-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-20 pb-16 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8 animate-fade-in">
              <div className="w-16 h-16 bg-hmao-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-hmao-blue/20">
                <Icon name="User" size={28} className="text-white" />
              </div>
              <h1 className="font-heading text-3xl font-bold text-hmao-blue">
                {isRegistering ? 'Регистрация' : 'Личный кабинет'}
              </h1>
              <p className="text-muted-foreground text-sm mt-1.5">
                {isRegistering ? 'Создайте аккаунт участника ХМАО-Югры' : 'Войдите в свой аккаунт'}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-border shadow-lg shadow-black/5 p-6 animate-fade-in">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4 flex items-center gap-2">
                  <Icon name="AlertCircle" size={15} className="shrink-0" />
                  {formError}
                </div>
              )}

              {isRegistering ? (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">ФИО <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Иванов Иван Иванович" required
                      value={regForm.name} onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Email <span className="text-red-500">*</span></label>
                      <input type="email" placeholder="mail@mail.ru" required
                        value={regForm.email} onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Телефон</label>
                      <input type="tel" placeholder="+7 (___) ___"
                        value={regForm.phone} onChange={e => setRegForm({ ...regForm, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Пароль <span className="text-red-500">*</span></label>
                    <input type="password" placeholder="Минимум 6 символов" required minLength={6}
                      value={regForm.password} onChange={e => setRegForm({ ...regForm, password: e.target.value })}
                      className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Город</label>
                      <input type="text" placeholder="Ханты-Мансийск"
                        value={regForm.city} onChange={e => setRegForm({ ...regForm, city: e.target.value })}
                        className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Вид спорта</label>
                      <input type="text" placeholder="Биатлон"
                        value={regForm.sport} onChange={e => setRegForm({ ...regForm, sport: e.target.value })}
                        className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
                    </div>
                  </div>
                  <button type="submit" disabled={formLoading}
                    className="w-full bg-hmao-blue hover:bg-hmao-teal text-white py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {formLoading
                      ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <Icon name="UserPlus" size={15} />}
                    Создать аккаунт
                  </button>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email</label>
                    <input type="email" placeholder="example@mail.ru" required
                      value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Пароль</label>
                    <input type="password" placeholder="Введите пароль" required
                      value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
                  </div>
                  <button type="submit" disabled={formLoading}
                    className="w-full bg-hmao-blue hover:bg-hmao-teal text-white py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {formLoading
                      ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <Icon name="LogIn" size={15} />}
                    Войти
                  </button>
                </form>
              )}

              <div className="border-t border-border mt-5 pt-4 text-center">
                <span className="text-sm text-muted-foreground">
                  {isRegistering ? 'Уже есть аккаунт?' : 'Ещё нет аккаунта?'}{' '}
                </span>
                <button onClick={() => { setIsRegistering(!isRegistering); setFormError(''); }}
                  className="text-sm text-hmao-teal font-medium hover:text-hmao-blue transition-colors">
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
    { id: 'registrations', label: 'Записаться', icon: 'ClipboardList' },
    { id: 'notifications', label: 'Уведомления', icon: 'Bell' },
  ];

  const initials = user.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="pt-20 pb-16">
      <div className="bg-hmao-gradient py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white font-heading text-2xl font-bold shadow-lg">
              {initials}
            </div>
            <div className="flex-1">
              <div className="font-heading text-2xl font-bold text-white">{user.name}</div>
              <div className="text-white/60 text-sm flex items-center gap-2 flex-wrap mt-0.5">
                {user.sport && <span>{user.sport}</span>}
                {user.city && <span>· {user.city}</span>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user.role === 'admin' && (
                <button onClick={() => onNavigate('admin')}
                  className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-hmao-blue-dark px-4 py-2 rounded-xl font-semibold text-sm transition-colors">
                  <Icon name="LayoutDashboard" size={15} />
                  Панель админа
                </button>
              )}
              <button onClick={logout}
                className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors">
                <Icon name="LogOut" size={15} />
                Выйти
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6">
        <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit mb-6">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white text-hmao-blue shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
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
                  { label: 'ФИО', value: user.name, icon: 'User' },
                  { label: 'Email', value: user.email, icon: 'Mail' },
                  { label: 'Телефон', value: user.phone || '—', icon: 'Phone' },
                  { label: 'Город', value: user.city || '—', icon: 'MapPin' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide">{f.label}</label>
                    <div className="flex items-center gap-2 mt-1 p-3 bg-muted/50 rounded-xl">
                      <Icon name={f.icon} size={14} className="text-hmao-teal shrink-0" fallback="Circle" />
                      <span className="text-sm font-medium">{f.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-heading text-lg font-semibold text-hmao-blue mb-4">Спортивные данные</h3>
              {[
                { label: 'Вид спорта', value: user.sport || '—', icon: 'Trophy' },
                { label: 'Разряд', value: user.rank || '—', icon: 'Award' },
              ].map(f => (
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
                  <span className="text-sm font-semibold text-hmao-blue">
                    {user.role === 'admin' ? 'Администратор' : 'Аккаунт активен'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {user.role === 'admin' ? 'Полный доступ к управлению порталом' : 'Регистрация подтверждена'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'registrations' && (
          <div className="animate-fade-in">
            <h3 className="font-heading text-xl font-semibold text-hmao-blue mb-4">Запись на мероприятие</h3>
            <RegisterForEvent events={events} />
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="animate-fade-in space-y-3">
            <div className="bg-white rounded-xl border border-border p-4 flex items-start gap-3">
              <div className="mt-0.5 shrink-0 text-emerald-500">
                <Icon name="CheckCircle" size={18} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">Добро пожаловать!</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Рады видеть вас на портале, {user.name.split(' ')[0]}! Выбирайте мероприятия и регистрируйтесь.
                </div>
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">Только что</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RegisterForEvent({ events }: { events: ReturnType<typeof useEvents>['events'] }) {
  const [registering, setRegistering] = useState<number | null>(null);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState<Record<number, string>>({});

  const handleRegister = async (eventId: number) => {
    setRegistering(eventId);
    setErrors(prev => ({ ...prev, [eventId]: '' }));
    const res = await apiFetch(API.events, { method: 'POST', body: JSON.stringify({ event_id: eventId }) });
    const data = await res.json();
    if (res.ok) {
      setDone(prev => new Set([...prev, eventId]));
    } else {
      setErrors(prev => ({ ...prev, [eventId]: data.error || 'Ошибка' }));
    }
    setRegistering(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {events.map(event => (
        <div key={event.id} className="bg-white rounded-xl border border-border p-4 flex items-start gap-3 card-hover">
          <div className="w-12 h-12 bg-hmao-gradient rounded-xl flex items-center justify-center shrink-0">
            <Icon name="Trophy" size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-heading font-semibold text-hmao-blue text-sm leading-snug">{event.title}</div>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <Icon name="Calendar" size={10} className="text-hmao-teal" />
                {new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
              </span>
              <span className={`px-2 py-0.5 rounded-full ${LEVEL_COLORS[event.level]}`}>
                {LEVEL_LABELS[event.level]}
              </span>
            </div>
            {errors[event.id] && <div className="text-xs text-red-500 mt-1">{errors[event.id]}</div>}
          </div>
          <button
            onClick={() => handleRegister(event.id)}
            disabled={registering === event.id || done.has(event.id)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              done.has(event.id)
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-hmao-blue hover:bg-hmao-teal text-white'
            } disabled:opacity-60`}
          >
            {registering === event.id ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : done.has(event.id) ? (
              <span className="flex items-center gap-1"><Icon name="Check" size={12} />Записан</span>
            ) : 'Записаться'}
          </button>
        </div>
      ))}
    </div>
  );
}

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';
import { API, apiFetch } from '@/lib/api';

type AdminTab = 'stats' | 'events' | 'posts' | 'users';

interface Stats {
  users_total: number;
  users_week: number;
  events_total: number;
  posts_total: number;
  registrations_total: number;
}

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('stats');

  if (loading) return (
    <div className="pt-20 min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-hmao-teal border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user || user.role !== 'admin') return (
    <div className="pt-20 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Icon name="ShieldX" size={48} className="text-muted-foreground mx-auto mb-4 opacity-40" />
        <div className="font-heading text-2xl font-bold text-hmao-blue mb-2">Доступ запрещён</div>
        <p className="text-muted-foreground text-sm mb-4">Эта страница доступна только администраторам</p>
        <button onClick={() => onNavigate('cabinet')}
          className="bg-hmao-blue text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-hmao-teal transition-colors">
          Войти как администратор
        </button>
      </div>
    </div>
  );

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'stats', label: 'Статистика', icon: 'BarChart3' },
    { id: 'events', label: 'Мероприятия', icon: 'Calendar' },
    { id: 'posts', label: 'Новости', icon: 'Newspaper' },
    { id: 'users', label: 'Пользователи', icon: 'Users' },
  ];

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-hmao-blue-dark border-b border-white/10 sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-4">
              <button onClick={() => onNavigate('home')}
                className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors">
                <Icon name="ArrowLeft" size={14} />
                На сайт
              </button>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-sm">
                <Icon name="LayoutDashboard" size={15} />
                Панель администратора
              </div>
            </div>
            <div className="text-white/50 text-xs">{user.name}</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-border p-1 rounded-xl w-fit mb-6 shadow-sm">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-hmao-blue text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
              <Icon name={tab.icon} size={14} fallback="Circle" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'stats' && <StatsTab />}
        {activeTab === 'events' && <EventsTab />}
        {activeTab === 'posts' && <PostsTab />}
        {activeTab === 'users' && <UsersTab />}
      </div>
    </div>
  );
}

function StatsTab() {
  const [data, setData] = useState<{ stats: Stats; top_sports: { sport: string; count: number }[]; recent_users: { name: string; email: string; city: string; sport: string; created_at: string }[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`${API.admin}?action=stats`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-hmao-teal border-t-transparent rounded-full animate-spin" /></div>;
  if (!data || !data.stats) return null;

  const cards = [
    { label: 'Пользователей', value: data.stats.users_total, sub: `+${data.stats.users_week} за неделю`, icon: 'Users', color: 'text-blue-600 bg-blue-50' },
    { label: 'Мероприятий', value: data.stats.events_total, sub: 'в базе данных', icon: 'Calendar', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Новостей', value: data.stats.posts_total, sub: 'опубликовано', icon: 'Newspaper', color: 'text-purple-600 bg-purple-50' },
    { label: 'Регистраций', value: data.stats.registrations_total, sub: 'на мероприятия', icon: 'ClipboardList', color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-border p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>
              <Icon name={c.icon} size={20} fallback="Circle" />
            </div>
            <div className="font-heading text-3xl font-bold text-foreground">{c.value}</div>
            <div className="text-sm font-medium text-foreground mt-0.5">{c.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-heading text-lg font-semibold text-hmao-blue mb-4">Популярные виды спорта</h3>
          {data.top_sports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Нет данных</div>
          ) : (
            <div className="space-y-3">
              {data.top_sports.map((s, i) => {
                const max = data.top_sports[0].count;
                return (
                  <div key={s.sport} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-hmao-gradient flex items-center justify-center text-white text-xs font-bold shrink-0">{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium truncate">{s.sport}</span>
                        <span className="text-sm text-muted-foreground shrink-0 ml-2">{s.count}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-hmao-gradient rounded-full transition-all"
                          style={{ width: `${(s.count / max) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-heading text-lg font-semibold text-hmao-blue mb-4">Новые пользователи</h3>
          {data.recent_users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Нет пользователей</div>
          ) : (
            <div className="space-y-3">
              {data.recent_users.map((u, i) => {
                const ini = u.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-hmao-gradient rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0">{ini}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{u.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0">{u.sport || '—'}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EventsTab() {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', sport: '', date: '', end_date: '', location: '',
    level: 'regional', participants: '', description: '', image_url: '', tags: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    const res = await apiFetch(`${API.admin}?action=event`, {
      method: 'POST',
      body: JSON.stringify({
        ...form,
        participants: parseInt(form.participants) || 0,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        end_date: form.end_date || null,
        image_url: form.image_url || null,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess(`Мероприятие «${data.event.title}» успешно добавлено!`);
      setForm({ title: '', sport: '', date: '', end_date: '', location: '', level: 'regional', participants: '', description: '', image_url: '', tags: '' });
      setShowForm(false);
    } else {
      setError(data.error || 'Ошибка сохранения');
    }
    setSaving(false);
  };

  const f = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-hmao-blue">Мероприятия</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-hmao-blue hover:bg-hmao-teal text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
          <Icon name={showForm ? 'X' : 'Plus'} size={15} />
          {showForm ? 'Отмена' : 'Добавить'}
        </button>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <Icon name="CheckCircle" size={15} />
          {success}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-4 animate-fade-in">
          <h3 className="font-heading text-lg font-semibold text-hmao-blue">Новое мероприятие</h3>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Название <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Кубок Губернатора по биатлону" required value={form.title} onChange={f('title')} className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
            </div>
            <div>
              <label className="label">Вид спорта <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Биатлон" required value={form.sport} onChange={f('sport')} className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
            </div>
            <div>
              <label className="label">Место проведения <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Биатлонный комплекс Югра" required value={form.location} onChange={f('location')} className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
            </div>
            <div>
              <label className="label">Дата начала <span className="text-red-500">*</span></label>
              <input type="date" required value={form.date} onChange={f('date')} className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
            </div>
            <div>
              <label className="label">Дата окончания</label>
              <input type="date" value={form.end_date} onChange={f('end_date')} className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
            </div>
            <div>
              <label className="label">Уровень</label>
              <select value={form.level} onChange={f('level')} className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal bg-white">
                <option value="regional">Региональный</option>
                <option value="federal">Федеральный</option>
                <option value="international">Международный</option>
              </select>
            </div>
            <div>
              <label className="label">Макс. участников</label>
              <input type="number" placeholder="200" value={form.participants} onChange={f('participants')} className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Описание</label>
              <textarea rows={3} placeholder="Подробное описание мероприятия..." value={form.description} onChange={f('description')} className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal resize-none" />
            </div>
            <div>
              <label className="label">Ссылка на фото (URL)</label>
              <input type="url" placeholder="https://..." value={form.image_url} onChange={f('image_url')} className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
            </div>
            <div>
              <label className="label">Теги (через запятую)</label>
              <input type="text" placeholder="Кубок, Элита" value={form.tags} onChange={f('tags')} className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-hmao-blue hover:bg-hmao-teal text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50">
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Icon name="Save" size={15} />}
            Сохранить мероприятие
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <p className="text-muted-foreground text-sm">Используйте форму выше для добавления новых мероприятий. Все добавленные события сразу появятся на главной странице и в разделе «Мероприятия».</p>
      </div>
    </div>
  );
}

function PostsTab() {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [posts, setPosts] = useState<{ id: number; title: string; excerpt: string; created_at: string; published: boolean }[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', image_url: '', tags: '', published: true });

  useEffect(() => {
    apiFetch(`${API.posts}?all=1&action=list`).then(r => r.json()).then(d => {
      setPosts(d.posts || []);
      setPostsLoading(false);
    }).catch(() => setPostsLoading(false));
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    const res = await apiFetch(API.posts, {
      method: 'POST',
      body: JSON.stringify({
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        image_url: form.image_url || null,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess(`Новость «${data.post.title}» опубликована!`);
      setForm({ title: '', content: '', excerpt: '', image_url: '', tags: '', published: true });
      setShowForm(false);
    } else {
      setError(data.error || 'Ошибка');
    }
    setSaving(false);
  };

  const f = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-hmao-blue">Новости</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-hmao-blue hover:bg-hmao-teal text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
          <Icon name={showForm ? 'X' : 'Plus'} size={15} />
          {showForm ? 'Отмена' : 'Добавить новость'}
        </button>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <Icon name="CheckCircle" size={15} />
          {success}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-4 animate-fade-in">
          <h3 className="font-heading text-lg font-semibold text-hmao-blue">Новая публикация</h3>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Заголовок <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Заголовок новости" required value={form.title} onChange={f('title')} className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Краткое описание</label>
              <input type="text" placeholder="Одна строка для превью..." value={form.excerpt} onChange={f('excerpt')} className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Текст новости <span className="text-red-500">*</span></label>
              <textarea rows={6} placeholder="Полный текст публикации..." required value={form.content} onChange={f('content')} className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Ссылка на фото</label>
                <input type="url" placeholder="https://..." value={form.image_url} onChange={f('image_url')} className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Теги (через запятую)</label>
                <input type="text" placeholder="Биатлон, Итоги" value={form.tags} onChange={f('tags')} className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="pub" checked={form.published}
                onChange={e => setForm(prev => ({ ...prev, published: e.target.checked }))}
                className="w-4 h-4 rounded accent-hmao-blue" />
              <label htmlFor="pub" className="text-sm font-medium">Опубликовать сразу</label>
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-hmao-blue hover:bg-hmao-teal text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50">
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Icon name="Send" size={15} />}
            Опубликовать
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {postsLoading ? (
          <div className="p-8 flex justify-center"><div className="w-6 h-6 border-2 border-hmao-teal border-t-transparent rounded-full animate-spin" /></div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Новостей пока нет</div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Заголовок</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Дата</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Статус</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <tr key={post.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                  <td className="px-5 py-3">
                    <div className="font-medium text-sm text-foreground">{post.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{post.excerpt}</div>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground hidden md:table-cell">
                    {new Date(post.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${post.published ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
                      {post.published ? 'Опубликовано' : 'Черновик'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState<{ id: number; name: string; email: string; city: string; sport: string; role: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`${API.admin}?action=users`).then(r => r.json()).then(d => {
      setUsers(d.users || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      <h2 className="font-heading text-2xl font-bold text-hmao-blue mb-4">Пользователи</h2>
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center"><div className="w-6 h-6 border-2 border-hmao-teal border-t-transparent rounded-full animate-spin" /></div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Пользователей пока нет</div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Пользователь</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Город / Спорт</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Роль</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Дата</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                const ini = u.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
                return (
                  <tr key={u.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-hmao-gradient rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">{ini}</div>
                        <div>
                          <div className="font-medium text-sm">{u.name}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-muted-foreground hidden md:table-cell">
                      {u.city || '—'}{u.sport ? ` · ${u.sport}` : ''}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${u.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-600'}`}>
                        {u.role === 'admin' ? 'Администратор' : 'Пользователь'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground hidden lg:table-cell">
                      {new Date(u.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
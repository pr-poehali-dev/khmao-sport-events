import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { useEvents } from '@/hooks/useEvents';
import { LEVEL_LABELS, LEVEL_COLORS } from '@/data/events';
import { API } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image_url?: string | null;
  tags: string[];
  created_at: string;
  published: boolean;
}

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const stats = [
  { value: '120+', label: 'Мероприятий в год', icon: 'Calendar' },
  { value: '15 000+', label: 'Участников', icon: 'Users' },
  { value: '25', label: 'Видов спорта', icon: 'Trophy' },
  { value: '40', label: 'Лет традиций', icon: 'Star' },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const { user } = useAuth();
  const { events, loading } = useEvents();
  const upcoming = events.slice(0, 3);

  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    fetch(API.posts)
      .then(r => r.json())
      .then(d => { setPosts((d.posts || []).slice(0, 6)); setPostsLoading(false); })
      .catch(() => setPostsLoading(false));
  }, []);

  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedPost]);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://cdn.poehali.dev/projects/bedfc3d3-ec88-4a38-aa9b-6b3fe1ddd98d/files/0e61203e-60ee-47ee-9bc7-7db5e616c7c3.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-hmao-blue-dark/95 via-hmao-blue/80 to-hmao-blue/40" />
        <div className="absolute right-0 top-1/4 w-[40vw] h-[40vw] rounded-full bg-hmao-teal/10 blur-3xl" />

        <div className="container mx-auto px-4 relative z-10 pt-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-hmao-teal/20 border border-hmao-teal/40 text-hmao-teal-light px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-hmao-teal-light animate-pulse" />
              Ханты-Мансийский АО — Югра
            </div>

            <h1 className="font-heading text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight mb-6 animate-fade-in delay-100">
              СПОРТ <br />
              <span className="text-gradient">ОБЪЕДИНЯЕТ</span> <br />
              ЮГРУ
            </h1>

            <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-10 max-w-xl animate-fade-in delay-200">
              Официальный портал спортивных мероприятий Ханты-Мансийска. Следите за событиями, регистрируйтесь и побеждайте!
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in delay-300">
              <button
                onClick={() => onNavigate('events')}
                className="flex items-center gap-2 bg-hmao-teal hover:bg-hmao-teal-light text-white px-8 py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all hover:scale-105 shadow-lg shadow-hmao-teal/30"
              >
                <Icon name="Calendar" size={16} />
                Все мероприятия
              </button>
              <button
                onClick={() => onNavigate('cabinet')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all hover:scale-105 backdrop-blur-sm"
              >
                <Icon name="UserPlus" size={16} />
                Зарегистрироваться
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">Прокрутите вниз</span>
          <Icon name="ChevronDown" size={16} className="animate-bounce" />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-hmao-blue py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-hmao-teal/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon name={stat.icon} size={22} className="text-hmao-teal" fallback="Star" />
                </div>
                <div className="font-heading text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-white/50 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-hmao-teal text-sm font-medium uppercase tracking-widest mb-2">Ближайшие старты</div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-hmao-blue">Предстоящие события</h2>
            </div>
            <button
              onClick={() => onNavigate('events')}
              className="hidden md:flex items-center gap-1.5 text-hmao-teal hover:text-hmao-blue font-medium text-sm transition-colors"
            >
              Все события <Icon name="ArrowRight" size={15} />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-border">
                  <div className="h-48 bg-muted animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                    <div className="h-6 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcoming.map((event, i) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border card-hover animate-fade-in"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  {event.image_url ? (
                    <div className="h-48 overflow-hidden">
                      <img src={event.image_url} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    </div>
                  ) : (
                    <div className="h-48 bg-hmao-gradient flex items-center justify-center">
                      <Icon name="Trophy" size={48} className="text-white/30" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${LEVEL_COLORS[event.level]}`}>
                        {LEVEL_LABELS[event.level]}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">{event.sport}</span>
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-hmao-blue leading-snug mb-2">{event.title}</h3>
                    <div className="space-y-1.5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Icon name="Calendar" size={13} className="text-hmao-teal" />
                        {new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Icon name="MapPin" size={13} className="text-hmao-teal" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Icon name="Users" size={13} className="text-hmao-teal" />
                        {event.participants} участников
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate('events')}
                      className="mt-4 w-full bg-hmao-blue hover:bg-hmao-teal text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
                    >
                      Подробнее
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* News Feed */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-hmao-teal text-sm font-medium uppercase tracking-widest mb-2">Последние публикации</div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-hmao-blue">Лента новостей</h2>
            </div>
          </div>

          {postsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-border">
                  <div className="h-44 bg-muted animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
                    <div className="h-5 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Icon name="Newspaper" size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm">Новостей пока нет</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border card-hover animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {post.image_url ? (
                    <div className="h-44 overflow-hidden">
                      <img src={post.image_url} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    </div>
                  ) : (
                    <div className="h-44 bg-hmao-gradient flex items-center justify-center">
                      <Icon name="Newspaper" size={40} className="text-white/30" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="text-xs text-muted-foreground mb-2">
                      {new Date(post.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h3 className="font-heading text-base font-semibold text-hmao-blue leading-snug mb-2 line-clamp-2">{post.title}</h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{post.excerpt}</p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs text-hmao-teal bg-hmao-light px-2 py-0.5 rounded-md">#{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 flex items-center gap-1 text-hmao-teal text-xs font-medium">
                      Читать далее <Icon name="ArrowRight" size={12} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Модальное окно новости */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {selectedPost.image_url ? (
              <div className="h-56 overflow-hidden rounded-t-2xl">
                <img src={selectedPost.image_url} alt={selectedPost.title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="h-32 bg-hmao-gradient rounded-t-2xl flex items-center justify-center">
                <Icon name="Newspaper" size={40} className="text-white/30" />
              </div>
            )}
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {new Date(selectedPost.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h2 className="font-heading text-xl md:text-2xl font-bold text-hmao-blue leading-snug">{selectedPost.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="flex-shrink-0 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Icon name="X" size={20} className="text-muted-foreground" />
                </button>
              </div>
              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {selectedPost.tags.map(tag => (
                    <span key={tag} className="text-xs text-hmao-teal bg-hmao-light px-2.5 py-1 rounded-full">#{tag}</span>
                  ))}
                </div>
              )}
              <div className="text-sm md:text-base text-foreground leading-relaxed whitespace-pre-line">
                {selectedPost.content}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Banner — только для незарегистрированных */}
      {!user && <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="bg-hmao-gradient rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url('https://cdn.poehali.dev/projects/bedfc3d3-ec88-4a38-aa9b-6b3fe1ddd98d/files/461f1064-2c3f-49dc-8578-a99ef4cc86bc.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="relative z-10">
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4">
                СТАНЬ ЧАСТЬЮ КОМАНДЫ ЮГРЫ
              </h2>
              <p className="text-white/70 text-base md:text-lg mb-8 max-w-xl mx-auto">
                Зарегистрируйтесь на портале и получайте уведомления о предстоящих мероприятиях
              </p>
              <button
                onClick={() => onNavigate('cabinet')}
                className="inline-flex items-center gap-2 bg-white text-hmao-blue hover:bg-hmao-light px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all hover:scale-105 shadow-xl"
              >
                <Icon name="UserPlus" size={16} />
                Создать аккаунт
              </button>
            </div>
          </div>
        </div>
      </section>}
    </div>
  );
}
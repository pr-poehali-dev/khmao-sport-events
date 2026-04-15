import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/useAuth';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'home', label: 'Главная' },
  { id: 'events', label: 'События' },
  { id: 'calendar', label: 'Календарь' },
  { id: 'contacts', label: 'Контакты' },
];

export default function Navbar({ activePage, onNavigate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const initials = user?.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-hmao-blue/95 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-hmao-teal rounded-lg flex items-center justify-center group-hover:bg-hmao-teal-light transition-colors">
                <Icon name="Trophy" size={18} className="text-white" />
              </div>
              <div className="text-left">
                <div className="font-heading text-white font-bold text-lg leading-tight tracking-wide">СПОРТХМАО</div>
                <div className="text-white/50 text-xs leading-tight">Ханты-Мансийск</div>
              </div>
            </button>

            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`nav-link font-medium text-sm tracking-wide uppercase ${activePage === item.id ? 'active text-white' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {user ? (
                <div className="hidden md:flex items-center gap-2">
                  {user.role === 'admin' && (
                    <button onClick={() => onNavigate('admin')}
                      className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-hmao-blue-dark px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                      <Icon name="LayoutDashboard" size={13} />
                      Админ
                    </button>
                  )}
                  <button onClick={() => onNavigate('cabinet')}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-white/20">
                    <div className="w-6 h-6 bg-hmao-teal rounded-md flex items-center justify-center text-white text-xs font-bold">
                      {initials}
                    </div>
                    <span className="max-w-[100px] truncate text-sm">{user.name.split(' ')[0]}</span>
                  </button>
                  <button onClick={logout} className="text-white/50 hover:text-white p-1.5 transition-colors" title="Выйти">
                    <Icon name="LogOut" size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onNavigate('cabinet')}
                  className="hidden md:flex items-center gap-2 bg-hmao-teal hover:bg-hmao-teal-light text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Icon name="User" size={15} />
                  Войти
                </button>
              )}
              <button className="md:hidden text-white p-1" onClick={() => setMenuOpen(!menuOpen)}>
                <Icon name={menuOpen ? 'X' : 'Menu'} size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-hmao-blue-dark border-b border-white/10 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMenuOpen(false); }}
                className={`text-left py-2.5 px-4 rounded-lg text-sm font-medium uppercase tracking-wide transition-colors ${
                  activePage === item.id ? 'bg-hmao-teal text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
            {user ? (
              <>
                <button onClick={() => { onNavigate('cabinet'); setMenuOpen(false); }}
                  className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2.5 rounded-lg text-sm font-medium mt-1">
                  <div className="w-6 h-6 bg-hmao-teal rounded-md flex items-center justify-center text-white text-xs font-bold">{initials}</div>
                  {user.name.split(' ')[0]}
                </button>
                {user.role === 'admin' && (
                  <button onClick={() => { onNavigate('admin'); setMenuOpen(false); }}
                    className="flex items-center gap-2 bg-amber-400 text-hmao-blue-dark px-4 py-2.5 rounded-lg text-sm font-bold">
                    <Icon name="LayoutDashboard" size={15} />
                    Панель администратора
                  </button>
                )}
                <button onClick={() => { logout(); setMenuOpen(false); }}
                  className="flex items-center gap-2 text-white/60 px-4 py-2.5 text-sm">
                  <Icon name="LogOut" size={15} />
                  Выйти
                </button>
              </>
            ) : (
              <button onClick={() => { onNavigate('cabinet'); setMenuOpen(false); }}
                className="flex items-center gap-2 bg-hmao-teal text-white px-4 py-2.5 rounded-lg text-sm font-medium mt-1">
                <Icon name="User" size={15} />
                Войти / Зарегистрироваться
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

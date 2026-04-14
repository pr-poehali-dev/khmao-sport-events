import { useState } from 'react';
import Icon from '@/components/ui/icon';

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

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('cabinet')}
                className="hidden md:flex items-center gap-2 bg-hmao-teal hover:bg-hmao-teal-light text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Icon name="User" size={15} />
                Личный кабинет
              </button>
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
            <button
              onClick={() => { onNavigate('cabinet'); setMenuOpen(false); }}
              className="flex items-center gap-2 bg-hmao-teal text-white px-4 py-2.5 rounded-lg text-sm font-medium mt-1"
            >
              <Icon name="User" size={15} />
              Личный кабинет
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

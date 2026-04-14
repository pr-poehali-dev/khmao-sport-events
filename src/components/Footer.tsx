import Icon from '@/components/ui/icon';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-hmao-blue-dark text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-hmao-teal rounded-lg flex items-center justify-center">
                <Icon name="Trophy" size={20} className="text-white" />
              </div>
              <div>
                <div className="font-heading text-xl font-bold tracking-wide">СПОРТХМАО</div>
                <div className="text-white/50 text-xs">Ханты-Мансийский АО</div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Официальный портал спортивных мероприятий Ханты-Мансийского автономного округа — Югры
            </p>
          </div>

          <div>
            <div className="font-heading text-sm uppercase tracking-widest text-white/40 mb-4">Навигация</div>
            <ul className="space-y-2">
              {[
                { id: 'home', label: 'Главная' },
                { id: 'events', label: 'События' },
                { id: 'calendar', label: 'Календарь' },
                { id: 'contacts', label: 'Контакты' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="text-white/60 hover:text-hmao-teal transition-colors text-sm"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-heading text-sm uppercase tracking-widest text-white/40 mb-4">Контакты</div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-white/60 text-sm">
                <Icon name="MapPin" size={15} className="text-hmao-teal mt-0.5 shrink-0" />
                г. Ханты-Мансийск, ул. Спортивная, 1
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Icon name="Phone" size={15} className="text-hmao-teal shrink-0" />
                +7 (3467) 00-00-00
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Icon name="Mail" size={15} className="text-hmao-teal shrink-0" />
                sport@hmao.ru
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <div className="text-white/30 text-xs">© 2026 СпортХМАО. Все права защищены.</div>
        </div>
      </div>
    </footer>
  );
}

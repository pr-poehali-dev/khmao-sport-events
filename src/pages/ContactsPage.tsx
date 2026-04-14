import Icon from '@/components/ui/icon';

export default function ContactsPage() {
  return (
    <div className="pt-20 pb-16">
      <div className="bg-hmao-gradient py-14">
        <div className="container mx-auto px-4">
          <div className="text-hmao-teal text-sm font-medium uppercase tracking-widest mb-2">Связь с нами</div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">Контакты</h1>
          <p className="text-white/60 text-base">Есть вопросы? Мы всегда на связи</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                { icon: 'MapPin', title: 'Адрес', lines: ['г. Ханты-Мансийск,', 'ул. Спортивная, 1'] },
                { icon: 'Phone', title: 'Телефон', lines: ['+7 (3467) 00-00-00', '+7 (3467) 00-00-01'] },
                { icon: 'Mail', title: 'Email', lines: ['sport@hmao.ru', 'info@sport-hmao.ru'] },
                { icon: 'Clock', title: 'Режим работы', lines: ['Пн–Пт: 9:00 — 18:00', 'Сб–Вс: выходной'] },
              ].map((c) => (
                <div key={c.title} className="bg-white rounded-2xl border border-border p-5 card-hover">
                  <div className="w-10 h-10 bg-hmao-light rounded-xl flex items-center justify-center mb-3">
                    <Icon name={c.icon} size={18} className="text-hmao-teal" fallback="Circle" />
                  </div>
                  <div className="font-heading font-semibold text-hmao-blue text-sm mb-1.5">{c.title}</div>
                  {c.lines.map((line) => (
                    <div key={line} className="text-sm text-muted-foreground">{line}</div>
                  ))}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-border p-5">
              <div className="font-heading font-semibold text-hmao-blue mb-4">Социальные сети</div>
              <div className="flex gap-3">
                {[
                  { label: 'ВКонтакте', icon: 'Users', color: 'bg-blue-500' },
                  { label: 'Telegram', icon: 'Send', color: 'bg-sky-500' },
                  { label: 'YouTube', icon: 'Play', color: 'bg-red-500' },
                ].map((s) => (
                  <a key={s.label} href="#" className={`flex items-center gap-2 ${s.color} hover:opacity-90 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105`}>
                    <Icon name={s.icon} size={14} fallback="Circle" />
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-7 shadow-sm">
            <h2 className="font-heading text-2xl font-bold text-hmao-blue mb-2">Написать нам</h2>
            <p className="text-sm text-muted-foreground mb-6">Оставьте сообщение и мы ответим в течение рабочего дня</p>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Имя</label>
                  <input type="text" placeholder="Ваше имя"
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input type="email" placeholder="example@mail.ru"
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Тема</label>
                <select className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal bg-white">
                  <option>Вопрос об участии в мероприятии</option>
                  <option>Организация мероприятия</option>
                  <option>Техническая поддержка</option>
                  <option>Сотрудничество</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Сообщение</label>
                <textarea rows={5} placeholder="Опишите ваш вопрос подробно..."
                  className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hmao-teal/30 focus:border-hmao-teal resize-none" />
              </div>
              <button type="submit" className="w-full bg-hmao-blue hover:bg-hmao-teal text-white py-3 rounded-xl font-semibold text-sm tracking-wide transition-colors flex items-center justify-center gap-2">
                <Icon name="Send" size={15} />
                Отправить сообщение
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

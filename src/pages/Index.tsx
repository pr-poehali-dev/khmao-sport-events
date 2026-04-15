import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import EventsPage from '@/pages/EventsPage';
import CalendarPage from '@/pages/CalendarPage';
import CabinetPage from '@/pages/CabinetPage';
import ContactsPage from '@/pages/ContactsPage';
import AdminPage from '@/pages/AdminPage';

type Page = 'home' | 'events' | 'calendar' | 'cabinet' | 'contacts' | 'admin';

export default function Index() {
  const [activePage, setActivePage] = useState<Page>('home');

  const navigate = (page: string) => {
    setActivePage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdmin = activePage === 'admin';

  const renderPage = () => {
    switch (activePage) {
      case 'home':     return <HomePage onNavigate={navigate} />;
      case 'events':   return <EventsPage />;
      case 'calendar': return <CalendarPage />;
      case 'cabinet':  return <CabinetPage onNavigate={navigate} />;
      case 'contacts': return <ContactsPage />;
      case 'admin':    return <AdminPage onNavigate={navigate} />;
      default:         return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && <Navbar activePage={activePage} onNavigate={navigate} />}
      <main className="flex-1">
        {renderPage()}
      </main>
      {!isAdmin && <Footer onNavigate={navigate} />}
    </div>
  );
}

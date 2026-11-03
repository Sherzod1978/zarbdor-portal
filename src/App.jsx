import React, { useState } from 'react';
import Collaboration from './pages/Collaboration';
import Contact from './pages/Contact';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  const [currentView, setCurrentView] = useState('site'); // 'site' yoki 'admin'

  if (currentView === 'admin') {
    return <AdminPanel onBackToSite={() => setCurrentView('site')} />;
  }

  return (
    <div>
      {/* Admin panelga o'tish uchun kichik tugma (yuqori qismda) */}
      <div className="bg-gray-900 text-white text-xs py-2 px-6 flex justify-between items-center">
        <span>Zarbdor IM Rasmiy Portali</span>
        <button 
          onClick={() => setCurrentView('admin')}
          className="text-orange-400 font-bold hover:underline"
        >
          ⚙️ Admin Panelga o'tish
        </button>
      </div>

      {/* Asosiy sahifalar */}
      <Collaboration />
      <Contact />
    </div>
  );
}
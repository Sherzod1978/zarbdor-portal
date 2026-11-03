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
    <div className="min-h-screen bg-gray-50">
      {/* Yuqori navigatsiya va admin panelga o'tish tugmasi */}
      <header className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 font-bold">🏫 Zarbdor IM</span>
          <span className="text-xs text-gray-400">Rasmiy portali</span>
        </div>
        <button 
          onClick={() => setCurrentView('admin')}
          className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition shadow"
        >
          ⚙️ Admin panelga ötiş
        </button>
      </header>

      {/* Asosiy sahifa tarkibi */}
      <main>
        <Collaboration />
        <Contact />
      </main>
    </div>
  );
}
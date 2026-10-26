import Contact from './pages/Contact';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Admission from './pages/Admission';
import News from './pages/News';
import Login from './pages/Login';
import Collaboration from './pages/Collaboration';
import Achievements from './pages/Achievements';

export default function App() {
  const [season, setSeason] = useState('autumn');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) setSeason('spring');
    else if (month >= 6 && month <= 8) setSeason('summer');
    else if (month >= 9 && month <= 11) setSeason('autumn');
    else setSeason('winter');
  }, []);

  const seasonStyles = {
    autumn: { 
      name: 'Kuz', 
      bgGradient: 'from-amber-100 via-orange-100 to-amber-200', 
      accentColor: 'text-amber-950', 
      particles: ['🍁', '🍁', '🍁', '🍁', '🍁', '🍁', '🍁', '🍁']
    },
    winter: { 
      name: 'Qish', 
      bgGradient: 'from-slate-100 via-sky-100 to-blue-200', 
      accentColor: 'text-sky-950', 
      particles: ['❄', '❅', '❆', '❄', '❅', '❆']
    },
    spring: { 
      name: 'Bahor', 
      bgGradient: 'from-emerald-100 via-pink-100 to-teal-100', 
      accentColor: 'text-emerald-950', 
      particles: ['🌸', '💧']
    },
    summer: { 
      name: 'Yoz', 
      bgGradient: 'from-yellow-100 via-amber-100 to-orange-200', 
      accentColor: 'text-amber-950'      
    }
  };

  const current = seasonStyles[season];
  const autumnColors = ['#facc15', '#f97316', '#dc2626'];

  return (
    <div className={`relative min-h-screen flex flex-col justify-between bg-gradient-to-br ${current.bgGradient} text-gray-900 transition-all duration-700 font-sans`}>
      
      {/* Dynamic Seasonal Effects */}
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        {current.particles.map((item, index) => {
          const leftPos = Math.random() * 100;
          const duration = 6 + Math.random() * 8;
          const delay = Math.random() * 5;
          const size = 0.8 + Math.random() * 0.8;
          const isRain = item === '💧';
          const particleColor = autumnColors[index % autumnColors.length];

          return (
            <span
              key={index}
              className={`absolute top-0 select-none ${isRain ? 'animate-rain text-blue-400 font-bold' : 'animate-fall'}`}
              style={{
                left: `${leftPos}%`,
                animationDuration: `${isRain ? duration * 0.4 : duration}s`,
                animationDelay: `${delay}s`,
                fontSize: `${size}rem`,
                color: isRain || season !== 'autumn' ? undefined : particleColor,
                filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.15))',
                opacity: 0.85
              }}
            >
              {item}
            </span>
          );
        })}
      </div>

      {/* Header & Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-6">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 shrink-0">
            <span className="text-3xl">🎓</span>
            <span className={`text-2xl font-black ${current.accentColor}`}>Zarbdor IM</span>
          </Link>

          {/* Qidiruv oynasi */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <input
              type="text"
              placeholder="Maktab bo'ylab qidiruv..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all shadow-inner"
            />
            <span className="absolute left-3.5 top-2.5 text-gray-400 text-sm">🔍</span>
          </div>

          {/* Menyu Navigatsiyasi */}
          <nav className="flex items-center space-x-6 text-base font-bold shrink-0">
            
            {/* Bosh sahifa Dropdown */}
            <div className="relative group py-2">
              <Link to="/" className="hover:text-orange-600 transition flex items-center gap-1">
                Bosh sahifa ▾
              </Link>
              <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-2xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                <Link 
                  to="/login" 
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-semibold transition"
                >
                  🏫 O'qituvchi va o'quvchilar hamkorligi
                </Link>
              </div>
            </div>

            {/* Maktab haqida Dropdown */}
            <div className="relative group py-2">
              <Link to="/about" className="hover:text-orange-600 transition flex items-center gap-1">
                Maktab haqida ▾
              </Link>
              <div className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-2xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                <Link 
                  to="/about" 
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-semibold transition"
                >
                  ℹ️ Biz haqimizda
                </Link>
                <Link 
                  to="/achievements" 
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-semibold transition border-t border-gray-50"
                >
                  🏆 Yutuqlar
                </Link>
              </div>
            </div>

            <Link to="/admission" className="hover:text-orange-600 transition">Qabul</Link>
            <Link to="/news" className="hover:text-orange-600 transition">Yangiliklar</Link>
            <Link to="/contact" className="hover:text-orange-600 transition">Bog'lanish</Link>
          </nav>
        </div>
      </header>

      {/* Asosiy Yo'nalishlar */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home current={current} searchQuery={searchQuery} />} />
          <Route path="/about" element={<About currentSeason={current} />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/admission" element={<Admission currentSeason={current} />} />
          <Route path="/news" element={<News currentSeason={current} />} />
          <Route path="/contact" element={<Contact currentSeason={current} />} />
          <Route path="/login" element={<Login currentSeason={current} />} />
          <Route path="/collaboration" element={<Collaboration />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-[#1f1f1f] text-white pt-12 pb-8 border-t border-gray-800 z-10 relative">
        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'space-around', 
            alignItems: 'flex-start',
            flexWrap: 'wrap', 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '0 20px',
            gap: '40px'
          }}
          className="mb-10"
        >
          <div style={{ minWidth: '280px' }}>
            <h3 className="text-xl font-bold mb-4 text-white">Zarbdor IM</h3>
            <div className="space-y-2 text-gray-300 text-sm md:text-base leading-relaxed">
              <p><span className="font-semibold text-white">Manzil:</span> Jizzax viloyati, Zarbdor tumani</p>
              <p><span className="font-semibold text-white">Tel:</span> +998 (72) 123-45-67</p>
              <p><span className="font-semibold text-white">Email:</span> info@zarbdorim.uz</p>
            </div>
          </div>

          <div style={{ minWidth: '220px' }}>
            <h3 className="text-xl font-bold mb-4 text-white">Tezkor Havolalar</h3>
            <ul className="space-y-2 text-sm md:text-base list-disc list-inside">
              <li>
                <Link to="/about" className="text-indigo-400 hover:text-indigo-300 hover:underline transition">
                  Maktab haqida
                </Link>
              </li>
              <li>
                <Link to="/achievements" className="text-indigo-400 hover:text-indigo-300 hover:underline transition">
                  Yutuqlar
                </Link>
              </li>
              <li>
                <Link to="/admission" className="text-indigo-400 hover:text-indigo-300 hover:underline transition">
                  Qabul shartlari
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-indigo-400 hover:text-indigo-300 hover:underline transition">
                  Yangiliklar
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-indigo-400 hover:text-indigo-300 hover:underline transition">
                  Bog'lanish
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-xs md:text-sm text-gray-400">
          © Zarbdor ixtisoslashtirilgan maktabi - 2026
        </div>
      </footer>

    </div>
  );
}
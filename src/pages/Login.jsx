import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ currentSeason }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Oddiy tekshiruv (maktab tomonidan berilgan login/parol)
    if (username === 'school2026' && password === 'zarbdor123') {
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/collaboration');
    } else {
      setError('Login yoki parol xato! Maktab bergan maʼlumotlarni kiriting.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200">
        <div className="text-center mb-8">
          <span className="text-4xl">🔐</span>
          <h2 className="text-2xl font-black text-gray-900 mt-2">Tizimga Kirish</h2>
          <p className="text-sm text-gray-600 mt-1">O'qituvchi va o'quvchilar hamkorligi bo'limi</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Maktab ID / Login</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masalan: school2026"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Maxfiy Parol</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition duration-300"
          >
            Kirish
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Namuna uchun login: <span className="font-bold">school2026</span> | Parol: <span className="font-bold">zarbdor123</span>
        </div>
      </div>
    </div>
  );
}
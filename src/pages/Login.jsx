import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({ currentSeason }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Bu yerda kirish mantiqi yoziladi (masalan, admin yoki o'qituvchi sifatida)
    if (email === 'admin@zarbdorim.uz') {
      navigate('/admin');
    } else {
      navigate('/collaboration');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-gray-900 font-sans">
      
      {/* Chap tomon: Rasm va qiziqarli ma'lumot */}
      <div className="hidden md:flex md:w-1/2 bg-gray-50 flex-col justify-between p-12 border-r border-gray-100">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xl font-black text-orange-600">← Boş sahifaga qaytiş</Link>
        </div>
        
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="text-6xl flex justify-center">🎓</div>
          <h2 className="text-2xl font-black text-gray-800">Zarbdor IM Hamkorlik Tizimi</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Öqituvçilar va öquvçilar o'rtasida uzluksiz ta'lim muhiti, raqamli testlar hamda bilim almashinish maskani.
          </p>
        </div>

        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 text-center">
          <h4 className="font-bold text-orange-800 text-sm mb-1">Bilarmidingiz?</h4>
          <p className="text-xs text-orange-700">
            Har bir öquvçi öz ustida işlab, fanlar böyiça yuqori natijalarga erişişi mumkin.
          </p>
        </div>
      </div>

      {/* O'ng tomon: Kirish Formasi */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-8">
          
          <div>
            <h2 className="text-3xl font-black tracking-tight text-gray-900">Tizimga kiriş</h2>
            <p className="text-sm text-gray-500 mt-2">Email yoki foydalanuvçi nomi orqali kiring</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                Email yoki foydalanuvçi nomi <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-1.5 border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 text-sm transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                Parol <span className="text-red-500">*</span>
              </label>
              
              {/* Parol konteyneri va ko'zcha tugmasi */}
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-1.5 border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 text-sm transition"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl focus:outline-none select-none p-1"
                  title={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link to="/contact" className="text-orange-600 hover:underline font-semibold">
                Parolni unutdingizmi?
              </Link>
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 bg-gray-900 hover:bg-orange-600 text-white font-bold rounded-xl transition duration-300 shadow-lg"
            >
              Kiriş
            </button>
          </form>

          <div className="text-center text-xs text-gray-500">
            Tizimga kiriş orqali siz barça qoidalarga rozilik bildirasiz.
          </div>

        </div>
      </div>

    </div>
  );
}
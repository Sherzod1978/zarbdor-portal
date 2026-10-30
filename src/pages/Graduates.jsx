import React, { useState, useEffect } from 'react';

export default function Graduates({ currentSeason }) {
  const [graduates, setGraduates] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [password, setPassword] = useState('');

  // Yangi bitiruvchi formasi uchun state
  const [formData, setFormData] = useState({
    name: '',
    year: '',
    currentRole: '',
    achievements: '',
    imageUrl: '',
    videoUrl: ''
  });

  // Saqlangan bitiruvchilarni yuklash
  useEffect(() => {
    const saved = localStorage.getItem('school_graduates');
    if (saved) {
      setGraduates(JSON.parse(saved));
    } else {
      // Boshlang'ich namuna ma'lumotlar
      const initialData = [
        {
          id: 1,
          name: "Azizbek Rahimov",
          year: "2024",
          currentRole: "TATU 2-bosqich talabasi",
          achievements: "Respublika Informatika olimpiadasi g'olibi",
          imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
          videoUrl: ""
        }
      ];
      setGraduates(initialData);
      localStorage.setItem('school_graduates', JSON.stringify(initialData));
    }
  }, []);

  // Admin sifatidagilarni parolini tekshirish (Parol: admin123)
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAdmin(true);
      setShowLoginForm(false);
      setPassword('');
    } else {
      alert("Parol noto'g'ri!");
    }
  };

  // Yangi bitiruvchini saqlash
  const handleAddGraduate = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.year) {
      alert("Iltimos, ism va bitirgan yilini kiriting!");
      return;
    }

    const newGrad = {
      id: Date.now(),
      ...formData,
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400'
    };

    const updated = [newGrad, ...graduates];
    setGraduates(updated);
    localStorage.setItem('school_graduates', JSON.stringify(updated));

    // Formani tozalash
    setFormData({
      name: '',
      year: '',
      currentRole: '',
      achievements: '',
      imageUrl: '',
      videoUrl: ''
    });
  };

  // Bitiruvchini o'chirish
  const handleDelete = (id) => {
    if (window.confirm("Haqiqatan ham ushbu ma'lumotni o'chirmoqchimisiz?")) {
      const updated = graduates.filter(item => item.id !== id);
      setGraduates(updated);
      localStorage.setItem('school_graduates', JSON.stringify(updated));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      
      {/* Sarlavha va Admin tugmasi */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">🎓 Bizning Bitiruvchilar</h1>
          <p className="text-gray-600 mt-1">Maktabimizni muvaffaqiyatli bitirgan o'quvchilar va ularning yutuqlari</p>
        </div>

        <div>
          {!isAdmin ? (
            <button 
              onClick={() => setShowLoginForm(!showLoginForm)}
              className="px-4 py-2 bg-gray-800 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition"
            >
              🔐 Admin boshqaruvi
            </button>
          ) : (
            <button 
              onClick={() => setIsAdmin(false)}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-500 transition"
            >
              🚪 Chiqish
            </button>
          )}
        </div>
      </div>

      {/* Admin Login Modal/Oynasi */}
      {showLoginForm && !isAdmin && (
        <form onSubmit={handleLogin} className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-200 max-w-md mx-auto">
          <h3 className="text-lg font-bold mb-4">Admin sifatidagi parol:</h3>
          <input 
            type="password" 
            placeholder="Parolni kiriting (admin123)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded-xl font-bold hover:bg-orange-500 transition">
            Kirish
          </button>
        </form>
      )}

      {/* Admin uchun Bitiruvchi qo'shish formasi */}
      {isAdmin && (
        <div className="mb-12 p-6 bg-orange-50 rounded-2xl border border-orange-200 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-orange-950">➕ Yangi bitiruvchi qo'shish</h2>
          <form onSubmit={handleAddGraduate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Ism va Familiyasi *"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="p-3 border rounded-xl bg-white"
            />
            <input 
              type="text" 
              placeholder="Bitirgan yili (masalan: 2024) *"
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
              className="p-3 border rounded-xl bg-white"
            />
            <input 
              type="text" 
              placeholder="Hozirgi faoliyati / OTM"
              value={formData.currentRole}
              onChange={(e) => setFormData({...formData, currentRole: e.target.value})}
              className="p-3 border rounded-xl bg-white"
            />
            <input 
              type="text" 
              placeholder="Rasm URL havolasi"
              value={formData.imageUrl}
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              className="p-3 border rounded-xl bg-white"
            />
            <input 
              type="text" 
              placeholder="Video/Intervyu havolasi (YouTube)"
              value={formData.videoUrl}
              onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
              className="p-3 border rounded-xl bg-white md:col-span-2"
            />
            <textarea 
              placeholder="Erishgan yutuqlari va ijodidan namunalar..."
              value={formData.achievements}
              onChange={(e) => setFormData({...formData, achievements: e.target.value})}
              className="p-3 border rounded-xl bg-white md:col-span-2 h-24"
            />
            <button type="submit" className="md:col-span-2 bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-500 transition">
              Saqlash va chop etish
            </button>
          </form>
        </div>
      )}

      {/* Bitiruvchilar kartalari ro'yxati */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {graduates.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-xl transition">
            <div>
              <img src={item.imageUrl} alt={item.name} className="w-full h-56 object-cover" />
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-3 py-1 bg-orange-100 text-orange-800 rounded-full">
                    {item.year}-yil bitiruvchisi
                  </span>
                  {isAdmin && (
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 text-xs font-bold hover:underline"
                    >
                      O'chirish
                    </button>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                <p className="text-sm font-medium text-orange-600 mt-1">{item.currentRole}</p>
                <p className="text-gray-600 text-sm mt-3 leading-relaxed">{item.achievements}</p>
                
                {item.videoUrl && (
                  <a 
                    href={item.videoUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-block mt-4 text-sm font-bold text-indigo-600 hover:underline"
                  >
                    🎬 Intervyuni tomosha qilish ➔
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
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
    image: '',
    videoUrl: ''
  });

  // Saqlangan bitiruvchilarni yuklash
  useEffect(() => {
    const saved = localStorage.getItem('school_graduates');
    if (saved) {
      setGraduates(JSON.parse(saved));
    } else {
      const initialData = [
        {
          id: 1,
          name: "Azizbek Rahimov",
          year: "2024",
          currentRole: "TATU 2-bosqich talabasi",
          achievements: "Respublika Informatika olimpiadasi ğolibi",
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
          videoUrl: ""
        }
      ];
      setGraduates(initialData);
      localStorage.setItem('school_graduates', JSON.stringify(initialData));
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAdmin(true);
      setShowLoginForm(false);
      setPassword('');
    } else {
      alert("Parol notöğri!");
    }
  };

  // Kompyuterdan rasm tanlanganda uni Base64 formatga o'tkazish
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddGraduate = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.year) {
      alert("Iltimos, ism va bitirgan yilini kiriting!");
      return;
    }

    const newGrad = {
      id: Date.now(),
      ...formData,
      image: formData.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400'
    };

    const updated = [newGrad, ...graduates];
    setGraduates(updated);
    localStorage.setItem('school_graduates', JSON.stringify(updated));

    setFormData({
      name: '',
      year: '',
      currentRole: '',
      achievements: '',
      image: '',
      videoUrl: ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Haqiqatan ham uşbu ma'lumotni öchirmoqçimisiz?")) {
      const updated = graduates.filter(item => item.id !== id);
      setGraduates(updated);
      localStorage.setItem('school_graduates', JSON.stringify(updated));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">🎓 Bitiruvçilar</h1>
          <p className="text-gray-600 mt-1">Maktabimizni muvaffaqiyatli bitirgan öquvçilar va ularning yutuqlari</p>
        </div>

        <div>
          {!isAdmin ? (
            <button 
              onClick={() => setShowLoginForm(!showLoginForm)}
              className="px-4 py-2 bg-gray-800 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition"
            >
              🔐 Admin boşqaruvi
            </button>
          ) : (
            <button 
              onClick={() => setIsAdmin(false)}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-500 transition"
            >
              🚪 Chiqiş
            </button>
          )}
        </div>
      </div>

      {showLoginForm && !isAdmin && (
        <form onSubmit={handleLogin} className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-200 max-w-md mx-auto">
          <h3 className="text-lg font-bold mb-4">Admin boşqaruvi paroli:</h3>
          <input 
            type="password" 
            placeholder="Parolni kiriting (admin123)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded-xl font-bold hover:bg-orange-500 transition">
            Kiriş
          </button>
        </form>
      )}

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
            
            {/* Kompyuterdan rasm tanlash inputi */}
            <div className="flex flex-col justify-center bg-white p-2 border rounded-xl">
              <label className="text-xs text-gray-500 mb-1 font-semibold">Kompyuterdan rasm tanlaş:</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
            </div>

            <input 
              type="text" 
              placeholder="Video/Intervyu havolasi (YouTube)"
              value={formData.videoUrl}
              onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
              className="p-3 border rounded-xl bg-white md:col-span-2"
            />
            <textarea 
              placeholder="Erişgan yutuqlari va ijodidan namunalar..."
              value={formData.achievements}
              onChange={(e) => setFormData({...formData, achievements: e.target.value})}
              className="p-3 border rounded-xl bg-white md:col-span-2 h-24"
            />
            <button type="submit" className="md:col-span-2 bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-500 transition">
              Saqlaş va çop etiş
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {graduates.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-xl transition">
            <div>
              <img src={item.image} alt={item.name} className="w-full h-64 object-contain bg-gray-50" />
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-3 py-1 bg-orange-100 text-orange-800 rounded-full">
                    {item.year}-yil bitiruvçisi
                  </span>
                  {isAdmin && (
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 text-xs font-bold hover:underline"
                    >
                      Öçiriş
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
                    🎬 Intervyuni tomoşa qiliş ➔
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
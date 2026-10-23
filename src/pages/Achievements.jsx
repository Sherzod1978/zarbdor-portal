import React, { useState, useEffect } from 'react';

export default function Achievements() {
  const defaultPlaceholder = 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?auto=format&fit=crop&w=600&q=80';

  const initialAchievements = [
    {
      id: 1,
      studentName: 'Ahmadov Jasur',
      title: 'Informatika fanidan Respublika Olimpiadasi 1-o\'rin',
      category: 'Olimpiada',
      date: '2026-05-10',
      image: defaultPlaceholder
    },
    {
      id: 2,
      studentName: 'Karimova Zilola',
      title: 'IELTS 7.5 Xalqaro Tillar Sertifikati',
      category: 'Sertifikat',
      date: '2026-08-15',
      image: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('school_achievements');
    return saved ? JSON.parse(saved) : initialAchievements;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPass, setAdminPass] = useState('');

  const [studentName, setStudentName] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Olimpiada');
  const [uploadedImage, setUploadedImage] = useState('');

  useEffect(() => {
    localStorage.setItem('school_achievements', JSON.stringify(achievements));
  }, [achievements]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPass === 'admin2026') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPass('');
    } else {
      alert('Admin paroli xato!');
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!studentName || !title) return;

    if (!uploadedImage) {
      alert('Iltimos, kompyuteringizdan sertifikat rasmini tanlang!');
      return;
    }

    const newItem = {
      id: Date.now(),
      studentName,
      title,
      category,
      date: new Date().toISOString().split('T')[0],
      image: uploadedImage
    };

    setAchievements([newItem, ...achievements]);
    setStudentName('');
    setTitle('');
    setUploadedImage('');
    e.target.reset();
    alert('Sertifikat muvaffaqiyatli joylashtirildi!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Haqiqatan ham ushbu sertifikatni o\'chirmoqchimisiz?')) {
      setAchievements(achievements.filter(item => item.id !== id));
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      
      {/* Sarlavha va Admin tugmasi */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-gray-200 mb-8 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">🏆 O'quvchilarimiz Yutuqlari</h1>
          <p className="text-gray-600">Maktabimiz o'quvchilarining olimpiadalarda va xalqaro sertifikatlarda erishgan natijalari.</p>
        </div>
        
        {!isAdmin ? (
          <button 
            onClick={() => setShowAdminLogin(true)}
            className="px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl text-sm hover:bg-gray-800 transition"
          >
            ⚙️ Admin Boshqaruvi
          </button>
        ) : (
          <button 
            onClick={() => setIsAdmin(false)}
            className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl text-sm hover:bg-red-700 transition"
          >
            🚪 Admin rejimidan chiqish
          </button>
        )}
      </div>

      {/* Admin Login Modali */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Admin Tizimiga Kirish</h3>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Admin paroliga kiriting..."
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <div className="text-xs text-gray-500">Parol: <span className="font-bold">admin2026</span></div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdminLogin(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-xl text-xs"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white font-bold rounded-xl text-xs hover:bg-orange-700"
                >
                  Kirish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {isAdmin && (
        <div className="bg-orange-50 border-2 border-orange-200 p-6 rounded-3xl mb-10 shadow-lg">
          <h2 className="text-xl font-black text-orange-900 mb-4 flex items-center gap-2">
            <span>➕</span> Yangi Yutuq/Sertifikat Qo'shish (Admin Panel)
          </h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">O'quvchi F.I.Sh</label>
                <input
                  type="text"
                  placeholder="Masalan: Amanov Sherzod"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Yutuq / Sertifikat nomi</label>
                <input
                  type="text"
                  placeholder="Masalan: IELTS 7.0 / IT Sertifikat"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Kategoriya</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="Olimpiada">Olimpiada</option>
                  <option value="Sertifikat">Fan Sertifikati (IELTS, CEFR, IT)</option>
                  <option value="Sport">Sport / Boshqa</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Sertifikat faylini tanlang (JPG, PNG)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                required
                className="w-full p-2 bg-white border border-gray-300 rounded-xl text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md shadow-orange-500/30 transition mt-2"
            >
              Sertifikatni Saytga Joylash
            </button>
          </form>
        </div>
      )}

      {/* Sertifikatlar Ro'yxati */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {achievements.map((item) => (
          <div key={item.id} className="bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl border border-gray-200 flex flex-col justify-between transition hover:-translate-y-1">
            <div>
              <div className="relative h-64 bg-gray-50 overflow-hidden flex items-center justify-center p-2">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  onError={(e) => { e.target.onerror = null; e.target.src = defaultPlaceholder; }} 
                  className="w-full h-full object-contain rounded-xl"
                />
                <span className="absolute top-3 right-3 bg-orange-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md z-10">
                  {item.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-black text-gray-900 mb-1">{item.studentName}</h3>
                <p className="text-sm font-semibold text-orange-600 mb-3">{item.title}</p>
                <span className="text-xs text-gray-400">Sana: {item.date}</span>
              </div>
            </div>

            {isAdmin && (
              <div className="p-4 border-t border-gray-100 bg-red-50 text-right">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition"
                >
                  🗑 O'chirish
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
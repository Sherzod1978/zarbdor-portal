import React, { useState, useEffect } from 'react';

export default function News() {
  const defaultPlaceholder = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80';

  // Dastlabki namunaviy yangiliklar
  const initialNews = [
    {
      id: 1,
      title: "Maktabimizda 'Zakovat' intellektual öyini bölib ötdi",
      date: '2026-10-20',
      category: 'Tadbirlar',
      description: "Öquvçilarning mantiqiy fikrlash doirasini kengaytiriş maqsadida maktabimizda yuqori sinf öquvçilari örtasida 'Zakovat' turniri taşkil etildi.",
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      title: "Robototexnika va IT böyiça yangi tögaraklar ish boşladi",
      date: '2026-10-15',
      category: 'IT va Innovatsiya',
      description: "Zarbdor IMda öquvçilar uchun zamonaviy kompyuter va robototexnika vositalari bilan jihozlangan tögarak xonalari foydalanishga topşirildi.",
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
    }
  ];

  // LocalStorage orqali saqlangan yangiliklarni yuklash
  const [newsList, setNewsList] = useState(() => {
    const saved = localStorage.getItem('school_news');
    return saved ? JSON.parse(saved) : initialNews;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPass, setAdminPass] = useState('');

  // Yangi yangilik formasi uchun state-lar
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tadbirlar');
  const [description, setDescription] = useState('');
  const [uploadedImage, setUploadedImage] = useState('');

  useEffect(() => {
    localStorage.setItem('school_news', JSON.stringify(newsList));
  }, [newsList]);

  // Faylni kompyuterdan tanlab o'qib olish (Base64)
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

  const handleAddNews = (e) => {
    e.preventDefault();
    if (!title || !description) return;

    const newItem = {
      id: Date.now(),
      title,
      category,
      description,
      date: new Date().toISOString().split('T')[0],
      image: uploadedImage || defaultPlaceholder
    };

    setNewsList([newItem, ...newsList]);
    setTitle('');
    setDescription('');
    setUploadedImage('');
    e.target.reset();
    alert("Yangi yangilik muvaffaqiyatli e'lon qilindi!");
  };

  const handleDeleteNews = (id) => {
    if (window.confirm("Haqiqatan ham ushbu yangilikni o'chirmoqchimisiz?")) {
      setNewsList(newsList.filter(item => item.id !== id));
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      
      {/* Sarlavha va Admin tugmasi */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-gray-200 mb-8 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">📰 Maktab yangiliklari va e'lonlar</h1>
          <p className="text-gray-600">Zarbdor ixtisoslaştirilgan maktabining eng sönggi yangiliklari va muhim voqealari.</p>
        </div>
        
        {!isAdmin ? (
          <button 
            onClick={() => setShowAdminLogin(true)}
            className="px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl text-sm hover:bg-gray-800 transition shadow-md"
          >
            ⚙️ Admin Boşqaruvi
          </button>
        ) : (
          <button 
            onClick={() => setIsAdmin(false)}
            className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl text-sm hover:bg-red-700 transition shadow-md"
          >
            🚪 Admin rejimidan çiqiş
          </button>
        )}
      </div>

      {/* Admin Login Modali */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Admin Tizimiga Kiriş</h3>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Admin paroliga kiriting..."
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
              <div className="text-xs text-gray-500">Parol: <span className="font-bold">admin2026</span></div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdminLogin(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-xl text-xs"
                >
                  Bekor qiliş
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white font-bold rounded-xl text-xs hover:bg-orange-700"
                >
                  Kiriş
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Panel (Kodlarsiz Yangilik Qo'shish) */}
      {isAdmin && (
        <div className="bg-orange-50 border-2 border-orange-200 p-6 rounded-3xl mb-10 shadow-lg">
          <h2 className="text-xl font-black text-orange-900 mb-4 flex items-center gap-2">
            <span>📝</span> Yangi yangilik/E'lon joylaş (Admin Panel)
          </h2>
          <form onSubmit={handleAddNews} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">Yangilik sarlavhasi</label>
                <input
                  type="text"
                  placeholder="Yangilik sarlavhasini kiriting..."
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
                  <option value="Tadbirlar">Tadbirlar</option>
                  <option value="IT va Innovatsiya">IT va Innovatsiya</option>
                  <option value="Sport">Sport</option>
                  <option value="E'lonlar">E'lonlar</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Yangilik Matni (Batafsil)</label>
              <textarea
                rows="4"
                placeholder="Yangilik haqida batafsil ma'lumot yozing..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              ></textarea>
            </div>

            <div className="pt-1">
              <label className="block text-xs font-bold text-gray-700 mb-1">Yangilik rasmini tanlang (Ixtiyoriy)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full p-2 bg-white border border-gray-300 rounded-xl text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md shadow-orange-500/30 transition mt-2"
            >
              Yangilikni e'lon qiliş
            </button>
          </form>
        </div>
      )}

      {/* Yangiliklar Ro'yxati */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {newsList.map((item) => (
          <div key={item.id} className="bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl border border-gray-200 flex flex-col justify-between transition hover:-translate-y-1">
            <div>
              <div className="relative h-64 bg-gray-100 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  onError={(e) => { e.target.onerror = null; e.target.src = defaultPlaceholder; }} 
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md z-10">
                  {item.category}
                </span>
              </div>
              <div className="p-6">
                <div className="text-xs text-gray-400 mb-2 flex items-center gap-1 font-semibold">
                  <span>📅</span> {item.date}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3 leading-snug">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            </div>

            {isAdmin && (
              <div className="p-4 border-t border-gray-100 bg-red-50 text-right">
                <button
                  onClick={() => handleDeleteNews(item.id)}
                  className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition"
                >
                  🗑 Yangilikni öchiriş
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
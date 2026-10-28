import React, { useState, useEffect } from 'react';

export default function Collaboration() {
  // Dastlabki namunaviy dars jadvali
  const initialSchedules = [
    { id: 1, day: 'Dushanba', classNum: '9-A', subjects: 'Matematika, Fizika, Informatika, Ingliz tili' },
    { id: 2, day: 'Seshanba', classNum: '9-A', subjects: 'Informatika (Robototexnika), Kimyo, Biologiya, Tarix' },
    { id: 3, day: 'Chorshanba', classNum: '10-B', subjects: 'Matematika (Algebra), Ona tili, Fizika, Geometriya' }
  ];

  // Dastlabki fanlar va ularning darslari
  const initialSubjects = {
    Matematika: {
      teacher: "M. Anorov (Oliy toifali o'qituvchi)",
      videos: [
        { title: '1-mavzu: Hosila va uning tatbiqi', duration: '45 min', link: '#' },
        { title: '2-mavzu: Integrallar va yuzlarni hisoblash', duration: '50 min', link: '#' }
      ],
      tests: [
        { title: '1-bosqich test nazorati (15 ta savol)', questions: 15 }
      ]
    },
    Informatika: {
      teacher: 'Sh. Amanov (IT mutaxassisi)',
      videos: [
        { title: 'Python dasturlash tiliga kirish', duration: '60 min', link: '#' },
        { title: 'LEGO EV3 Pybricks MicroPython asoslari', duration: '40 min', link: '#' }
      ],
      tests: [
        { title: 'Python asoslari bo\'yicha test', questions: 20 }
      ]
    }
  };

  // LocalStorage orqali saqlash
  const [subjectsData, setSubjectsData] = useState(() => {
    const saved = localStorage.getItem('school_subjects');
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem('school_schedules');
    return saved ? JSON.parse(saved) : initialSchedules;
  });

  const [selectedSubject, setSelectedSubject] = useState('Informatika');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPass, setAdminPass] = useState('');

  // Admin formalari uchun state-lar
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' yoki 'schedule'
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newTeacherName, setNewTeacherName] = useState('');
  
  // Dars materiali qo'shish state-lari
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDuration, setVideoDuration] = useState('');
  const [videoLink, setVideoLink] = useState('');

  // Dars jadvali qo'shish state-lari
  const [schedDay, setSchedDay] = useState('Dushanba');
  const [schedClass, setSchedClass] = useState('9-A');
  const [schedSubjects, setSchedSubjects] = useState('');

  useEffect(() => {
    localStorage.setItem('school_subjects', JSON.stringify(subjectsData));
  }, [subjectsData]);

  useEffect(() => {
    localStorage.setItem('school_schedules', JSON.stringify(schedules));
  }, [schedules]);

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

  // Yangi fan qo'shish
  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubjectName || !newTeacherName) return;

    if (subjectsData[newSubjectName]) {
      alert('Bu fan allaqachon mavjud!');
      return;
    }

    const updated = {
      ...subjectsData,
      [newSubjectName]: {
        teacher: newTeacherName,
        videos: [],
        tests: []
      }
    };

    setSubjectsData(updated);
    setSelectedSubject(newSubjectName);
    setNewSubjectName('');
    setNewTeacherName('');
    alert("Yangi fan muvaffaqiyatli qo'shildi!");
  };

  // Tanlangan fanga videodars qo'shish
  const handleAddVideo = (e) => {
    e.preventDefault();
    if (!videoTitle || !selectedSubject) return;

    const currentSub = subjectsData[selectedSubject];
    const newVideo = {
      title: videoTitle,
      duration: videoDuration || '30 min',
      link: videoLink || '#'
    };

    const updated = {
      ...subjectsData,
      [selectedSubject]: {
        ...currentSub,
        videos: [...currentSub.videos, newVideo]
      }
    };

    setSubjectsData(updated);
    setVideoTitle('');
    setVideoDuration('');
    setVideoLink('');
    alert("Videodars muvaffaqiyatli qo'shildi!");
  };

  // Dars jadvali qo'shish
  const handleAddSchedule = (e) => {
    e.preventDefault();
    if (!schedSubjects) return;

    const newSched = {
      id: Date.now(),
      day: schedDay,
      classNum: schedClass,
      subjects: schedSubjects
    };

    setSchedules([newSched, ...schedules]);
    setSchedSubjects('');
    alert("Dars jadvali muvaffaqiyatli saqlandi!");
  };

  // Dars jadvalini o'chirish
  const handleDeleteSchedule = (id) => {
    if (window.confirm("Ushbu dars jadvalini o'chirmoqchimisiz?")) {
      setSchedules(schedules.filter(item => item.id !== id));
    }
  };

  const currentData = subjectsData[selectedSubject] || { teacher: '', videos: [], tests: [] };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      
      {/* Sarlavha va Admin tugmasi */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-gray-200 mb-8 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">🎓 O'qituvchi va O'quvchilar Hamkorligi</h1>
          <p className="text-gray-600">Maktab bazasidagi maxsus o'quv kurslari, dars jadvallari, videodarslar va testlar markazi.</p>
        </div>

        {!isAdmin ? (
          <button 
            onClick={() => setShowAdminLogin(true)}
            className="px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl text-sm hover:bg-gray-800 transition shadow-md"
          >
            ⚙️ Admin Boshqaruvi
          </button>
        ) : (
          <button 
            onClick={() => setIsAdmin(false)}
            className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl text-sm hover:bg-red-700 transition shadow-md"
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
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
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

      {/* Admin Panel (Kodlarsiz Fan, Dars va Jadval Qo'shish) */}
      {isAdmin && (
        <div className="bg-orange-50 border-2 border-orange-200 p-6 rounded-3xl mb-10 shadow-lg space-y-6">
          <h2 className="text-xl font-black text-orange-900 flex items-center gap-2">
            <span>🛠</span> LMS va Dars Jadvalini Boshqarish (Admin Panel)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Yangi Fan Yaratish */}
            <form onSubmit={handleAddSubject} className="bg-white p-5 rounded-2xl border border-orange-200 space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">➕ Yangi Fan Qo'shish</h3>
              <input
                type="text"
                placeholder="Fan nomi (masalan: Kimyo)"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="O'qituvchi F.I.Sh."
                value={newTeacherName}
                onChange={(e) => setNewTeacherName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <button type="submit" className="w-full py-2 bg-orange-600 text-white font-bold text-xs rounded-xl hover:bg-orange-700">
                Fanni Ro'yxatga Qo'shish
              </button>
            </form>

            {/* 2. Tanlangan fanga Videodars qo'shish */}
            <form onSubmit={handleAddVideo} className="bg-white p-5 rounded-2xl border border-orange-200 space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">📹 [{selectedSubject}] Faniga Dars/Video Qo'shish</h3>
              <input
                type="text"
                placeholder="Dars sarlavhasi"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Davomiyligi (masalan: 40 min)"
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
                <input
                  type="url"
                  placeholder="Video linki (YouTube)"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <button type="submit" className="w-full py-2 bg-orange-600 text-white font-bold text-xs rounded-xl hover:bg-orange-700">
                Videodarsni Joylash
              </button>
            </form>
          </div>

          {/* 3. Dars Jadvali Qo'shish Formasi */}
          <form onSubmit={handleAddSchedule} className="bg-white p-5 rounded-2xl border border-orange-200 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm">📅 Yangi Dars Jadvali Kiriting</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                value={schedDay}
                onChange={(e) => setSchedDay(e.target.value)}
                className="px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value="Dushanba">Dushanba</option>
                <option value="Seshanba">Seshanba</option>
                <option value="Chorshanba">Chorshanba</option>
                <option value="Payshanba">Payshanba</option>
                <option value="Juma">Juma</option>
                <option value="Shanba">Shanba</option>
              </select>

              <input
                type="text"
                placeholder="Sinf (masalan: 9-A)"
                value={schedClass}
                onChange={(e) => setSchedClass(e.target.value)}
                required
                className="px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />

              <input
                type="text"
                placeholder="Fanlar ro'yxati (masalan: Matematika, Fizika...)"
                value={schedSubjects}
                onChange={(e) => setSchedSubjects(e.target.value)}
                required
                className="px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
            <button type="submit" className="w-full py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700">
              Jadvalni E'lon Qilish
            </button>
          </form>
        </div>
      )}

      {/* Tab Almashish Tugmalari (Kurslar va Dars Jadvali) */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-6 py-3 rounded-2xl font-bold transition-all shadow-md text-sm ${
            activeTab === 'courses' ? 'bg-orange-600 text-white shadow-orange-500/30' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          📚 Fanlar va O'quv Kurslari
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-6 py-3 rounded-2xl font-bold transition-all shadow-md text-sm ${
            activeTab === 'schedule' ? 'bg-orange-600 text-white shadow-orange-500/30' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          📅 Maktab Dars Jadvali
        </button>
      </div>

      {/* 1-TAB: FANLAR VA KURSLAR */}
      {activeTab === 'courses' && (
        <div>
          {/* Fanlar menyusi */}
          <div className="flex flex-wrap gap-3 mb-8">
            {Object.keys(subjectsData).map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-sm ${
                  selectedSubject === sub
                    ? 'bg-orange-600 text-white shadow-orange-500/30 scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Tanlangan fan ma'lumotlari */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Videodarslar */}
            <div className="lg:col-span-2 bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedSubject} fani bo'yicha kurslar</h2>
              <p className="text-sm text-orange-600 font-semibold mb-6">O'qituvchi: {currentData.teacher}</p>
              
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📹</span> Videodarslar ro'yxati
              </h3>
              
              {currentData.videos.length === 0 ? (
                <div className="p-6 bg-gray-50 rounded-2xl text-center text-gray-500 text-sm">
                  Ushbu fan bo'yicha hali videodarslar joylanmagan.
                </div>
              ) : (
                <div className="space-y-4">
                  {currentData.videos.map((vid, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-orange-50 transition">
                      <div>
                        <h4 className="font-bold text-gray-900">{vid.title}</h4>
                        <span className="text-xs text-gray-500">Davomiyligi: {vid.duration}</span>
                      </div>
                      <a href={vid.link} target="_blank" rel="noreferrer" className="px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl hover:bg-orange-700 transition">
                        Ko'rish ➔
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Onlayn Testlar */}
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📝</span> Onlayn Testlar
              </h3>
              {currentData.tests.length === 0 ? (
                <div className="p-6 bg-gray-50 rounded-2xl text-center text-gray-500 text-sm">
                  Testlar mavjud emas.
                </div>
              ) : (
                <div className="space-y-4">
                  {currentData.tests.map((test, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <h4 className="font-bold text-gray-900 text-sm mb-2">{test.title}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{test.questions} ta savol</span>
                        <button onClick={() => alert('Test tez orada ishga tushadi!')} className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition">
                          Testni boshlash
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 2-TAB: DARS JADVALI */}
      {activeTab === 'schedule' && (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>📅</span> Maktab Haftalik Dars Jadvali
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedules.map((item) => (
              <div key={item.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-black rounded-full">
                      {item.day}
                    </span>
                    <span className="font-black text-gray-900 text-lg">
                      {item.classNum} sinf
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed font-semibold">
                    {item.subjects}
                  </p>
                </div>

                {isAdmin && (
                  <div className="mt-4 pt-3 border-t border-gray-200 text-right">
                    <button
                      onClick={() => handleDeleteSchedule(item.id)}
                      className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700"
                    >
                      🗑 Jadvalni öçiriş
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
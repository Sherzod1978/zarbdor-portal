import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default function Collaboration() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const [className, setClassName] = useState('');
  const [classCodeInput, setClassCodeInput] = useState('');
  const [myClasses, setMyClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null); // Tanlangan sinf (ichiga kirish uchun)
  const [announcement, setAnnouncement] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserClasses();
    }
  }, [user]);

  const fetchUserClasses = async () => {
    try {
      const classesRef = collection(db, "classes");
      let q;
      if (user.role === 'teacher') {
        q = query(classesRef, where("teacherUsername", "==", user.username));
      } else {
        q = query(classesRef, where("students", "array-contains", user.username));
      }
      const querySnapshot = await getDocs(q);
      const list = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setMyClasses(list);
    } catch (err) {
      console.error("Sinflarni olishda xatolik:", err);
    }
  };

  // Sinf yaratish
  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!className.trim()) return;
    setLoading(true);
    setMessage('');

    try {
      const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      await setDoc(doc(db, "classes", classCode), {
        className: className,
        teacherUsername: user.username,
        teacherFullName: user.fullName,
        students: [],
        announcements: [],
        createdAt: new Date()
      });

      setMessage(`Sinf muvaffaqiyatli yaratildi! Sinf kodi: ${classCode}`);
      setClassName('');
      fetchUserClasses();
    } catch (err) {
      console.error(err);
      setMessage("Sinf yaratishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  // Sinfga qo'shilish
  const handleJoinClass = async (e) => {
    e.preventDefault();
    const code = classCodeInput.trim().toUpperCase();
    if (!code) return;
    setLoading(true);
    setMessage('');

    try {
      const classRef = doc(db, "classes", code);
      const classSnap = await getDoc(classRef);

      if (!classSnap.exists()) {
        setMessage("Bunday kodli sinf topilmadi!");
        setLoading(false);
        return;
      }

      await updateDoc(classRef, {
        students: arrayUnion(user.username)
      });

      setMessage("Sinfga muvaffaqiyatli qo'shildingiz!");
      setClassCodeInput('');
      fetchUserClasses();
    } catch (err) {
      console.error(err);
      setMessage("Sinfga qo'shilishda xatolik.");
    } finally {
      setLoading(false);
    }
  };

  // E'lon yoki material qo'shish
  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcement.trim() || !selectedClass) return;

    try {
      const classRef = doc(db, "classes", selectedClass.id);
      const newAnnouncement = {
        id: Date.now(),
        text: announcement,
        date: new Date().toLocaleDateString()
      };

      await updateDoc(classRef, {
        announcements: arrayUnion(newAnnouncement)
      });

      // Local state ni yangilash
      const updatedAnnouncements = [...(selectedClass.announcements || []), newAnnouncement];
      setSelectedClass({ ...selectedClass, announcements: updatedAnnouncements });
      setAnnouncement('');
    } catch (err) {
      console.error(err);
      alert("E'lon qo'shishda xatolik.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Iltimos, avval tizimga kiring</h2>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-orange-600 text-white font-bold rounded-xl shadow hover:bg-orange-700 transition"
        >
          Tizimga kirish sahifasiga o'tish
        </button>
      </div>
    );
  }

  // Agar biror sinf tanlangan bo'lsa, o'sha sinfning ichki sahifasini ko'rsatish
  if (selectedClass) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10 font-sans">
        <button
          onClick={() => setSelectedClass(null)}
          className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl text-sm transition"
        >
          ← Sinfga qaytish / Orqaga
        </button>

        <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 mb-8">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900">{selectedClass.className}</h1>
              <p className="text-sm text-gray-500 mt-1">O'qituvchi: {selectedClass.teacherFullName}</p>
            </div>
            <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-xl font-mono font-bold text-base shadow-inner">
              Sinf kodi: {selectedClass.id}
            </div>
          </div>
        </div>

        {/* O'qituvchi uchun e'lon kiritish */}
        {user.role === 'teacher' && (
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📌 Sinfga e'lon yoki topshiriq yuborish</h3>
            <form onSubmit={handleAddAnnouncement} className="space-y-4">
              <textarea
                rows="3"
                required
                placeholder="Topshiriq yoki e'lon matnini yozing..."
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 text-sm text-gray-900"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm transition shadow"
              >
                E'lon qilish
              </button>
            </form>
          </div>
        )}

        {/* E'lonlar ro'yxati */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📢 E'lonlar va Materiallar</h3>
            {(!selectedClass.announcements || selectedClass.announcements.length === 0) ? (
              <p className="text-sm text-gray-500">Hozircha e'lonlar mavjud emas.</p>
            ) : (
              <div className="space-y-3">
                {selectedClass.announcements.map((item) => (
                  <div key={item.id} className="p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                    <p className="text-xs text-gray-400 mb-1">{item.date}</p>
                    <p className="text-sm text-gray-800 font-medium">{item.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* O'quvchilar ro'yxati */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">👥 Sinf o'quvchilari ({selectedClass.students?.length || 0})</h3>
            {(!selectedClass.students || selectedClass.students.length === 0) ? (
              <p className="text-sm text-gray-500">Hozircha o'quvchilar qo'shilmagan.</p>
            ) : (
              <ul className="space-y-2">
                {selectedClass.students.map((st, index) => (
                  <li key={index} className="px-4 py-2.5 bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 border border-gray-100 flex items-center justify-between">
                    <span>{index + 1}. {st}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-lg">O'quvchi</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-sans">
      
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Xush kelibsiz, {user.fullName}! 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Rolingiz: <span className="font-bold text-orange-600">{user.role === 'teacher' ? 'O\'qituvchi' : 'O\'quvchi'}</span>
          </p>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition"
        >
          Chiqish
        </button>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-xl text-sm font-semibold text-center">
          {message}
        </div>
      )}

      {user.role === 'teacher' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🏫 Yangi sinf yaratish</h3>
            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Sinf nomi</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: 10-A Informatika"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 text-sm text-gray-900"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition shadow"
              >
                {loading ? "Yaratilmoqda..." : "Sinf yaratish va kod olish"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📂 Mening sinflarim (Ichiga kirish uchun bosing)</h3>
            {myClasses.length === 0 ? (
              <p className="text-sm text-gray-500">Hozircha sinflar yaratmagansiz.</p>
            ) : (
              <div className="space-y-3">
                {myClasses.map((cls) => (
                  <div 
                    key={cls.id} 
                    onClick={() => setSelectedClass(cls)}
                    className="p-4 bg-gray-50 hover:bg-orange-50/50 rounded-xl border border-gray-200 flex justify-between items-center cursor-pointer transition shadow-sm"
                  >
                    <div>
                      <h4 className="font-bold text-gray-900">{cls.className}</h4>
                      <p className="text-xs text-gray-500">O'quvchilar soni: {cls.students?.length || 0}</p>
                    </div>
                    <div className="bg-orange-100 text-orange-800 px-3 py-1.5 rounded-lg font-mono font-bold text-sm">
                      {cls.id} ➔
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🔗 Sinfga qo'shilish</h3>
            <form onSubmit={handleJoinClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Sinf kodi</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: A7B2X9"
                  value={classCodeInput}
                  onChange={(e) => setClassCodeInput(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 text-sm uppercase text-gray-900"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow"
              >
                {loading ? "Ulanmoqda..." : "Sinfga qo'shilish"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📚 Mening sinflarim</h3>
            {myClasses.length === 0 ? (
              <p className="text-sm text-gray-500">Hozircha hech qanday sinfga qo'shilmagansiz.</p>
            ) : (
              <div className="space-y-3">
                {myClasses.map((cls) => (
                  <div 
                    key={cls.id}
                    onClick={() => setSelectedClass(cls)}
                    className="p-4 bg-gray-50 hover:bg-blue-50/50 rounded-xl border border-gray-200 cursor-pointer transition shadow-sm"
                  >
                    <h4 className="font-bold text-gray-900">{cls.className}</h4>
                    <p className="text-xs text-gray-500 mt-1">O'qituvchi: {cls.teacherFullName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
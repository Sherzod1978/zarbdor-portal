import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase"; // Fayl yo'lini o'zingiznikiga moslang

export default function Collaboration() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Tizimga kirgan foydalanuvchi ma'lumotlari (Login sahifasidan state orqali keladi)
  const user = location.state?.user;

  const [className, setClassName] = useState('');
  const [classCodeInput, setClassCodeInput] = useState('');
  const [myClasses, setMyClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Agar foydalanuvchi login qilmasdan to'g'ridan-to'g'ri kirsa, login sahifasiga yo'naltirish
  useEffect(() => {
    if (!user) {
      // Sinov uchun vaqtincha oddiy foydalanuvchi obyektini ham qo'yish mumkin, 
      // lekin xavfsizlik uchun login sahifasiga qaytargani ma'qul.
    }
  }, [user, navigate]);

  // Sinf ma'lumotlarini yuklab olish
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
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setMyClasses(list);
    } catch (err) {
      console.error("Sinflarni olishda xatolik:", err);
    }
  };

  // 1. O'qituvchi uchun sinf yaratish
  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!className.trim()) return;
    setLoading(true);
    setMessage('');

    try {
      // 6 xonali unikal sinf kodi (masalan: ZARBDOR7)
      const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      await setDoc(doc(db, "classes", classCode), {
        className: className,
        teacherUsername: user.username,
        teacherFullName: user.fullName,
        students: [],
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

  // 2. O'quvchi uchun sinfga qo'shilish
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
// O'quvchining rolini avtomatik to'g'rilash yoki o'chirish uchun funksiya
const fixUserRole = async (targetUsername) => {
  try {
    const userRef = doc(db, "users", targetUsername);
    await updateDoc(userRef, { role: "student" });
    alert(`${targetUsername} ning roli "student" (o'quvchi) ga o'zgartirildi!`);
  } catch (err) {
    console.error(err);
    alert("Xatolik yuz berdi.");
  }
};
  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-bold mb-4">Iltimos, avval tizimga kiring</h2>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-orange-600 text-white font-bold rounded-xl shadow hover:bg-orange-700 transition"
        >
          Tizimga kirish sahifasiga o'tish
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-sans">
      
      {/* Yuqori qism: Foydalanuvchi profili */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800">
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

      {/* Asosiy qism: O'qituvchi yoki O'quvchi paneli */}
      {user.role === 'teacher' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Sinf yaratish formasi */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🏫 Yangi sinf yaratish</h3>
            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Sinf nomi</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: 10-A Informatika"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 text-sm"
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

          {/* O'qituvchining sinflari ro'yxati */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📂 Mening sinflarim</h3>
            {myClasses.length === 0 ? (
              <p className="text-sm text-gray-500">Hozircha sinflar yaratmagansiz.</p>
            ) : (
              <div className="space-y-3">
                {myClasses.map((cls) => (
                  <div key={cls.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-800">{cls.className}</h4>
                      <p className="text-xs text-gray-500">O'quvchilar soni: {cls.students?.length || 0}</p>
                    </div>
                    <div className="bg-orange-100 text-orange-800 px-3 py-1.5 rounded-lg font-mono font-bold text-sm">
                      {cls.id}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Sinfga qo'shilish formasi */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🔗 Sinfga qo'shilish</h3>
            <form onSubmit={handleJoinClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Sinf kodi</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: A7B2X9"
                  value={classCodeInput}
                  onChange={(e) => setClassCodeInput(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 text-sm uppercase"
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

          {/* O'quvchining qo'shilgan sinflari */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📚 Mening sinflarim</h3>
            {myClasses.length === 0 ? (
              <p className="text-sm text-gray-500">Hozircha hech qanday sinfga qo'shilmagansiz.</p>
            ) : (
              <div className="space-y-3">
                {myClasses.map((cls) => (
                  <div key={cls.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-800">{cls.className}</h4>
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
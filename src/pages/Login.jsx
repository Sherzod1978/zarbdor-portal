import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Fayl yo'lini o'zingiznikiga moslang
import bcrypt from 'bcryptjs';

export default function Login({ currentSeason }) {
  const [isSignUp, setIsSignUp] = useState(false); // Kirish yoki Ro'yxatdan o'tishni boshqarish
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // 'student' yoki 'teacher'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (isSignUp) {
        // --- RO'YXATDAN O'TISH (Sign Up) ---
        const userRef = doc(db, "users", username);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setErrorMessage("Bu foydalanuvchi nomi allaqachon band qilingan!");
          setLoading(false);
          return;
        }

        // Parolni xesh qilish
        const hashedPassword = await bcrypt.hash(password, 10);

        // Firestore'ga saqlash
        await setDoc(userRef, {
          fullName,
          username,
          passwordHash: hashedPassword,
          role,
          createdAt: new Date()
        });

        alert("Muvaffaqiyatli ro'yxatdan o'tdingiz! Endi tizimga kiring.");
        setIsSignUp(false); // Kirish oynasiga o'tkazish
      } else {
        // --- TIZIMGA KIRISH (Sign In) ---
        if (username === 'admin@zarbdorim.uz' && password === 'admin123') {
          navigate('/admin');
          return;
        }

        const userRef = doc(db, "users", username);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setErrorMessage("Bunday foydalanuvchi topilmadi!");
          setLoading(false);
          return;
        }

        const userData = userSnap.data();
        const isPasswordValid = await bcrypt.compare(password, userData.passwordHash);

        if (!isPasswordValid) {
          setErrorMessage("Parol noto'g'ri!");
          setLoading(false);
          return;
        }

        // Muvaffaqiyatli kirish - Collaboration sahifasiga yo'naltirish
        navigate('/collaboration', { state: { user: userData } });
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Xatolik yuz berdi. Internetni tekshiring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100">
        
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-900">
            {isSignUp ? "Hisob yaratish" : "Tizimga kirish"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isSignUp ? "Ma'lumotlaringizni kiriting va ro'yxatdan o'ting" : "O'qituvchilar va o'quvchilar hamkorligi"}
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold text-center border border-red-100">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                F.I.O (To'liqism) <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                placeholder="Anvar Karimov"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 text-sm transition"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
              Foydalanuvchi nomi (Login) <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              required
              placeholder="Loginingizni kiriting"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 text-sm transition text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
              Parol <span className="text-red-500">*</span>
            </label>
            
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                placeholder="Parolni kiriting"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 text-sm transition text-gray-900"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl focus:outline-none select-none p-1"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                Siz kimsiz? <span className="text-red-500">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 text-sm bg-white transition text-gray-900"
              >
                <option value="student">O'quvchi</option>
                <option value="teacher">O'qituvchi</option>
              </select>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition duration-300 shadow-lg disabled:opacity-50"
          >
            {loading ? "Bajarilmoqda..." : (isSignUp ? "Hisob yaratish" : "Tizimga kirish")}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 pt-2">
          {isSignUp ? "Hisobingiz bormi? " : "Hali ro'yxatdan o'tmaganmisiz? "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-orange-600 font-bold hover:underline"
          >
            {isSignUp ? "Tizimga kirish" : "Ro'yxatdan o'tish"}
          </button>
        </div>

      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import bcrypt from 'bcryptjs';

export default function AuthForm({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false); // Kirish yoki Ro'yxatdan o'tish rejimi
  const [role, setRole] = useState('student'); // 'teacher' yoki 'student'
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // --- RO'YXATDAN O'TISH (Sign Up) ---
        const userRef = doc(db, "users", username);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setError("Bu login allaqachon band qilingan!");
          setLoading(false);
          return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
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
        const userRef = doc(db, "users", username);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setError("Bunday foydalanuvchi topilmadi!");
          setLoading(false);
          return;
        }

        const userData = userSnap.data();
        const isPasswordValid = await bcrypt.compare(password, userData.passwordHash);

        if (!isPasswordValid) {
          setError("Parol noto'g'ri!");
          setLoading(false);
          return;
        }

        // Muvaffaqiyatli kirish
        onLoginSuccess(userData);
      }
    } catch (err) {
      console.error(err);
      setError("Tizimda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            {isSignUp ? "Ro'yxatdan o'tish" : "Tizimga kirish"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Zarbdor Maktabi Hamkorlik Portali
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700">F.I.O (To'liqism)</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Anvar Karimov"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Login</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Foydalanuvchi logini"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Parol</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-xl select-none"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Siz kimsiz?</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="student">O'quvchi</option>
                <option value="teacher">O'qituvchi</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Bajarilmoqda..." : (isSignUp ? "Hisob yaratish" : "Kirish")}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          {isSignUp ? "Hisobingiz bormi? " : "Hali ro'yxatdan o'tmaganmisiz? "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 font-medium hover:underline"
          >
            {isSignUp ? "Tizimga kirish" : "Ro'yxatdan o'tish"}
          </button>
        </div>

      </div>
    </div>
  );
}
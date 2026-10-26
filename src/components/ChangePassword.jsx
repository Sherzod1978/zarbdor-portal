import React, { useState } from 'react';

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });
    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', msg: data.message || "Parol muvaffaqiyatli o'zgartirildi!" });
        setOldPassword('');
        setNewPassword('');
      } else {
        setStatus({ type: 'error', msg: data.error || "Xatolik yuz berdi!" });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: "Server bilan aloqa yo'q!" });
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-slate-900 border border-orange-500/30 rounded-2xl shadow-xl text-white">
      <h3 className="text-xl font-bold mb-6 text-orange-500 text-center">Parolni o'zgartirish</h3>
      
      {status.msg && (
        <div className={`p-3 rounded-xl mb-4 text-sm font-semibold text-center border ${
          status.type === 'success' 
            ? 'bg-green-500/20 text-green-400 border-green-500/50' 
            : 'bg-red-500/20 text-red-400 border-red-500/50'
        }`}>
          {status.msg}
        </div>
      )}

      <form onSubmit={handlePasswordChange} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Amaldagi parol</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Yangi parol</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition shadow-md shadow-orange-600/20"
        >
          Parolni yangilash
        </button>
      </form>
    </div>
  );
}
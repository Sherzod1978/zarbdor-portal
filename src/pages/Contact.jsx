import React, { useState } from 'react';

export default function Contact({ currentSeason }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Taklif / Murojaat',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // TELEGRAM BOT SOZLAMALARI
  // O'zingizning Bot Token va Chat ID raqamlaringizni quyidagi qobitlar ichiga yozing:
  const TELEGRAM_BOT_TOKEN = '9038809843:AAGOCnTgQMtxqoO0RfTKZ01hNGhi0DGZodc'; 
  const TELEGRAM_CHAT_ID = '1024073475';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Telegram botga yuboriladigan matn strukturasi
    const textMessage = `
📩 *Yangi murojaat (Zarbdor IM Portali)*

👤 *F.I.Sh:* ${formData.name}
📞 *Tel:* ${formData.phone}
📧 *Email:* ${formData.email || "Körsatilmadi"}
📌 *Mavzu:* ${formData.subject}

📝 *Xabar matni:*
${formData.message}
    `;

    try {
      // Agar Token kiritilgan bo'lsa Telegram API ga so'rov yuborish
      if (TELEGRAM_BOT_TOKEN !== '9038809843:AAGOCnTgQMtxqoO0RfTKZ01hNGhi0DGZodc') {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: textMessage,
            parse_mode: 'Markdown'
          })
        });
      }

      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', subject: 'Taklif / Murojaat', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      alert("Xabar yuborişda xatolik yuz berdi!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      
      {/* Sarlavha */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-gray-200 mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">📞 Admin bilan boğlaniş</h1>
        <p className="text-gray-600">Maktab ma'muriyati yoki sayt admini bilan boğlaniş uçun murojaat qoldiring yoki körsatilgan aloqa vositalaridan foydalaning.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Aloqa Ma'lumotlari */}
        <div className="space-y-6">
          
          {/* Telefon Aloqasi */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-gray-200 flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl shrink-0">
              📞
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Telefon aloqasi</h3>
              <p className="text-xs text-gray-500 mb-2">Duşanba - Şanba (08:00 - 17:00)</p>
              <a href="tel:+998943422221" className="text-orange-600 font-bold hover:underline block text-sm">
                +998 (94) 342-22-21
              </a>
              <a href="tel:+998956337878" className="text-gray-700 font-semibold hover:underline block text-sm mt-1">
                +998 (95) 633-78-78 (Admin)
              </a>
            </div>
          </div>

          {/* Email Pochta */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-gray-200 flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shrink-0">
              ✉️
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Elektron poçta</h3>
              <p className="text-xs text-gray-500 mb-2">Xatingizga 24 soat içida javob beramiz</p>
              <a href="mailto:info@zarbdorim.uz" className="text-blue-600 font-bold hover:underline block text-sm">
                info@zarbdorim.uz
              </a>
              <a href="mailto:sherzod3191178@gmail.com" className="text-gray-700 font-semibold hover:underline block text-sm mt-1">
                sherzod3191178@gmail.com
              </a>
            </div>
          </div>

          {/* Manzil va Telegram */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-gray-200 flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl shrink-0">
              📍
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Manzil va Telegram</h3>
              <p className="text-sm text-gray-600 mt-1">Jizzax viloyati, Zarbdor tumani, Oqbuloq MFY</p>
              <a 
                href="https://t.me" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-sky-500 text-white text-xs font-bold rounded-xl hover:bg-sky-600 transition shadow-md"
              >
                ✈️ t.me/Zarbdor_IM
              </a>
            </div>
          </div>

        </div>

        {/* Murojaat Yuborish Formasi */}
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200">
          <h2 className="text-2xl font-black text-gray-900 mb-2">✉️ Admin portaliga xabar yuboriş</h2>
          <p className="text-sm text-gray-600 mb-6">Savol, taklif yoki murojaatlaringizni quyidagi forma orqali yuborişingiz mumkin.</p>

          {submitted && (
            <div className="mb-6 p-4 bg-emerald-100 border border-emerald-400 text-emerald-800 rounded-2xl text-sm font-bold flex items-center gap-2 animate-bounce">
              <span>✅</span> Murojaatingiz Telegram orqali muvaffaqiyatli yuborildi! Admin tez orada siz bilan boğlanadi.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Ismingiz va Familiyangiz</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Şerzod Amanov"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Telefon raqamingiz</label>
                <input
                  type="tel"
                  required
                  placeholder="+998 90 123 45 67"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Elektron poçtangiz (Email)</label>
                <input
                  type="email"
                  placeholder="misol@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Murojaat mavzusi</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none transition"
                >
                  <option value="Taklif / Murojaat">Taklif / Murojaat</option>
                  <option value="Qabul bo'yicha">Qabul böyiça savol</option>
                  <option value="Texnik muammo">Saytdagi texnik muammo</option>
                  <option value="Boshqa">Boşqa</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Murojaat matni</label>
              <textarea
                rows="5"
                required
                placeholder="Xabaringizni batafsil yozing..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none transition"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition duration-300 disabled:opacity-50"
            >
              {loading ? "🚀 Yuborilmoqda..." : "🚀 Murojaatni yuboriş"}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
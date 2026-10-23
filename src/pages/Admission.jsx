import React from 'react';
import { Link } from 'react-router-dom';

export default function Admission({ currentSeason }) {
  const steps = [
    { step: "1-Bosqich", title: "Onlayn ro'yxatdan o'tish", desc: "Maxsus portal orqali o'quvchining shaxsiy ma'lumotlari kiritiladi va ariza topshiriladi.", icon: "📝" },
    { step: "2-Bosqich", title: "Saralash imtihonlari", desc: "Matematika, mantiqiy fikrlash va ingliz tili fanlaridan test sinovlari o'tkaziladi.", icon: "✍️" },
    { step: "3-Bosqich", title: "Yakuniy natija va qabul", desc: "Imtihondan muvaffaqiyatli o'tgan nomzodlar maktabga o'qishga qabul qilinadi.", icon: "🎉" }
  ];

  const documents = [
    "O'quvchining tug'ilganlik haqida guvohnomasi (asli va nusxasi)",
    "Ota-ona pasport ma'lumotlari",
    "3x4 o'lchamdagi 4 ta rangli rasm"
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      {/* Banner */}
      <div className={`py-16 px-6 text-center text-white bg-gradient-to-r ${currentSeason?.heroBg || 'from-amber-600 to-orange-700'} shadow-lg`}>
        <div className="max-w-5xl mx-auto">
          <Link to="/" className="inline-block mb-6 px-5 py-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md text-sm font-semibold transition">
            ← Bosh sahifaga qaytish
          </Link>
          <h1 className="text-4xl md:text-6xl font-black mb-4">O'quvchilarni Qabul Qilish</h1>
          <p className="text-xl md:text-2xl font-light opacity-90 max-w-3xl mx-auto">
            Zarbdor Ixtisoslashtirilgan Maktabiga 2026-2027 o'quv yili uchun hujjat topshirish qoidalari va tartibi.
          </p>
        </div>
      </div>

      {/* Qabul Bosqichlari */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="text-orange-600 font-extrabold text-sm uppercase tracking-wider">Tartib-qoida</span>
          <h2 className="text-3xl md:text-4xl font-black mt-2">Qabul Jarayoni Bosqichlari</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:-translate-y-2 transition duration-300">
              <div className="text-3xl font-black text-orange-600 mb-2">{item.step}</div>
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-base leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Kerakli Hujjatlar */}
      <section className="bg-white py-16 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black">Talab Etiladigan Hujjatlar</h2>
            <p className="text-gray-600 text-lg mt-2">Ro'yxatdan o'tish va imtihon bosqichida quyidagi hujjatlar talab qilinadi:</p>
          </div>
          <div className="bg-orange-50/60 p-8 rounded-3xl border border-orange-200 shadow-sm">
            <ul className="space-y-4">
              {documents.map((doc, idx) => (
                <li key={idx} className="flex items-center space-x-4 text-lg text-gray-800">
                  <span className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm shrink-0">✓</span>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';

export default function About({ currentSeason }) {
  const management = [
    { 
      name: "Feruz Qarabayev", 
      role: "Maktab Direktori", 
      image: "/direktor.png",
      desc: "Maktab faoliyatini boshqarish va ta'lim sifatini nazorat qilish bo'yicha yuqori tajribaga ega rahbar."
    },
    { 
      name: "Shohjahon Amirov", 
      role: "O'quv ishlari bo'yicha direktor o'rinbosari", 
      image: "/Amirov.png",
      desc: "O'quv jarayonini rejalashtirish va ilg'or pedagogik texnologiyalarni joriy etish."
    },
    { 
      name: "Dilfuza Bekamova", 
      role: "Ma'naviy va ma'rifiy ishlar bo'yicha direktor o'rinbosari", 
      image: "/Dilfuza.jpg",
      desc: "O'quvchilar o'rtasida ma'naviy-axloqiy muhitni shakllantirish va loyihalarni boshqarish."
    }
  ];

  const features = [
    { title: "Zamonaviy IT Laboratoriya", desc: "So'nggi rusumdagi kompyuterlar, 3D printerlar va robototexnika to'plamlari.", icon: "💻" },
    { title: "Shinam va Shaffof Sinflar", desc: "Interaktiv doskalar hamda qulay ergonomik mebellar bilan jihozlangan.", icon: "🏫" },
    { title: "Sport va Salomatlik", desc: "Yopiq va ochiq sport maydonchalari, gimnastika va futbol to'garaklari.", icon: "⚽" },
    { title: "Boy Kutubxona va Media-markaz", desc: "Minglab ilmiy, badiiy va elektron kitoblar bazasi.", icon: "📚" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      {/* Banner */}
      <div className={`py-16 px-6 text-center text-white bg-gradient-to-r ${currentSeason?.heroBg || 'from-amber-600 to-orange-700'} shadow-lg`}>
        <div className="max-w-5xl mx-auto">
          <Link to="/" className="inline-block mb-6 px-5 py-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md text-sm font-semibold transition">
            ← Bosh sahifaga qaytish
          </Link>
          <h1 className="text-4xl md:text-6xl font-black mb-4 text-white drop-shadow-md">
            Maktabimiz Haqida
          </h1>
          <p className="text-xl md:text-2xl font-medium text-white/95 max-w-3xl mx-auto leading-relaxed">
            Zarbdor Ixtisoslashtirilgan Maktabi — iqtidorli yoshlarni kashf etuvchi va ularni kelajak yetakchilariga aylantiruvchi maskan.
          </p>
        </div>
      </div>

      {/* Tarix va Missiya */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-orange-600 font-extrabold text-sm uppercase tracking-wider">Bizning Missiyamiz</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2 mb-6">Kelajak Texnologiyalari va Mukammal Ta'lim</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Maktabimiz o'quvchilarga chuqurlashtirilgan aniq va tabiiy fanlar, zamonaviy axborot texnologiyalari hamda xorijiy tillarni mukammal o'rgatishga ixtisoslashgan.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Biz har bir o'quvchining shaxsiy iqtidorini yuzaga chiqarish uchun xavfsiz, zamonaviy va rag'batlantiruvchi ta'lim muhitini yaratamiz.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="text-2xl font-bold mb-2">Prezident Agentligi Tizimida</h3>
            <p className="text-gray-600 text-lg">
              Ixtisoslashtirilgan ta'lim muassasalari agentligi tizimiga kiruvchi ushbu maktabda darslar xalqaro standartlar va ilg'or metodikalar asosida olib boriladi.
            </p>
          </div>
        </div>
      </section>
      {/* Maktab Rahbariyati (3 kishi yonma-yon) */}
<section className="max-w-[1400px] mx-auto px-6 py-16">
  <div className="text-center mb-12">
    <h2 className="text-3xl md:text-4xl font-black text-gray-900">Maktab Rahbariyati</h2>
    <p className="text-gray-600 text-lg mt-2">Tajribali va fidoyi jamoamiz bilan tanishing</p>
  </div>

  {/* Flexbox orqali 3 ta kartochka kafolatlangan holda yonma-yon joylashadi */}
  <div 
    style={{ 
      display: 'flex', 
      flexDirection: 'row', 
      flexWrap: 'wrap', 
      justifyContent: 'center', 
      gap: '24px' 
    }}
  >
    {management.map((person, idx) => (
      <div 
        key={idx} 
        className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center hover:shadow-2xl transition-all duration-300 flex flex-col items-center"
        style={{ flex: '1 1 300px', maxWidth: '400px' }}
      >
        {person.image ? (
          <div className="w-36 h-36 mb-6 rounded-full overflow-hidden shadow-lg border-4 border-orange-500 shrink-0">
            <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="text-5xl mb-6 bg-orange-100 w-36 h-36 rounded-full flex items-center justify-center shrink-0">
            👤
          </div>
        )}

        <h3 className="text-xl font-bold text-gray-900 mb-2">{person.name}</h3>
        <span className="inline-block px-3 py-1.5 bg-orange-100 text-orange-800 text-xs font-bold rounded-full mb-4">
          {person.role}
        </span>
        <p className="text-gray-600 text-sm leading-relaxed">{person.desc}</p>
      </div>
    ))}
  </div>
</section>
      {/* Sharoitlar — 4 ta blok yonma-yon 1 qatorda */}
      <section className="bg-white py-16 border-y border-gray-200">
        <div className="max-w-[1500px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Maktabimizda Yaratilgan Sharoitlar</h2>
            <p className="text-gray-600 text-lg mt-2">Zamonaviy ta'lim uchun barcha imkoniyatlar bir joyda jamlangan</p>
          </div>

          {/* Flexbox orqali 4 ta blok kafolatlangan holda 1 qatorga joylashadi */}
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              flexWrap: 'wrap', 
              justifyContent: 'center', 
              gap: '24px' 
            }}
          >
            {features.map((item, idx) => (
              <div 
                key={idx} 
                className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 text-center flex flex-col items-center"
                style={{ flex: '1 1 250px', maxWidth: '320px' }}
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </div>
  );
}
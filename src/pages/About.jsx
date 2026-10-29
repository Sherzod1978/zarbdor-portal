import React from 'react';
import { Link } from 'react-router-dom';

export default function About({ currentSeason }) {
  // Agar App.js dan currentSeason kelmasa, xatolik chiqmasligi uchun standart qiymat
  const current = currentSeason || {
    name: 'Kuz', 
    bgGradient: 'from-amber-100 via-orange-100 to-amber-200', 
    heroBg: 'from-amber-600 to-orange-700',
    accentColor: 'text-amber-950', 
    particles: ['🍁', '🍁', '🍁']
  };

  const management = [
    { 
      name: "Feruz Qarabayev", 
      role: "Maktab Direktori", 
      image: "/direktor.png",
      desc: "Maktab faoliyatini boshqarish va ta'lim sifatini nazorat qilish bo'yicha yuqori tajribaga ega rahbar."
    },
    { 
      name: "Şohjahon Amirov", 
      role: "Öquv işlari böyicha direktor örinbosari", 
      image: "/Amirov.png",
      desc: "Öquv jarayonini rejalashtirish va ilğor pedagogik texnologiyalarni joriy etiş."
    },
    { 
      name: "Dilfuza Bekamova", 
      role: "Ma'naviy va ma'rifiy işlar böyiça direktor örinbosari", 
      image: "/Dilfuza.jpg",
      desc: "Öquvçilar örtasida ma'naviy-axloqiy muhitni şakllantiriş va loyihalarni boşqariş."
    }
  ];

  const features = [
    { title: "Zamonaviy IT Laboratoriya", desc: "Sönggi rusumdagi kompyuterlar, 3D printerlar va robototexnika töplamlari.", icon: "💻" },
    { title: "Şinam va şaffof sinflar", desc: "Interaktiv doskalar hamda qulay ergonomik mebellar bilan jihozlangan.", icon: "🏫" },
    { title: "Sport va salomatlik", desc: "Yopiq va oçiq sport maydonchalari, voleybol va futbol tögaraklari.", icon: "⚽" },
    { title: "Boy Kutubxona va Media-markaz", desc: "Minglab ilmiy, badiiy va elektron kitoblar bazasi.", icon: "📚" }
  ];

  return (
    <div className={`relative min-h-screen bg-gradient-to-br ${current.bgGradient} text-gray-900 transition-all duration-700 font-sans pb-20 overflow-hidden`}>
      
      {/* Dinamik Fasl Effektlari */}
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        {current.particles && current.particles.map((item, index) => {
          const leftPos = Math.random() * 100;
          const duration = 6 + Math.random() * 8;
          const delay = Math.random() * 5;
          const size = 0.9 + Math.random() * 0.8;

          return (
            <span
              key={index}
              className="absolute top-0 select-none animate-fall"
              style={{
                left: `${leftPos}%`,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
                fontSize: `${size}rem`,
                filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.15))',
                opacity: 0.85
              }}
            >
              {item}
            </span>
          );
        })}
      </div>

      {/* Banner */}
      <div className={`py-16 px-6 text-center text-white bg-gradient-to-r ${current.heroBg} shadow-lg relative z-10`}>
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
      <section className="max-w-6xl mx-auto px-6 py-16 relative z-10">
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
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="text-2xl font-bold mb-2">Prezident Agentligi Tizimida</h3>
            <p className="text-gray-600 text-lg">
              Ixtisoslashtirilgan ta'lim muassasalari agentligi tizimiga kiruvchi ushbu maktabda darslar xalqaro standartlar va ilg'or metodikalar asosida olib boriladi.
            </p>
          </div>
        </div>
      </section>

     
      {/* Maktab Rahbariyati va Mutaxassislar */}
      <section className="max-w-[1600px] mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">Maktab Rahbariyati va Mutaxassislar</h2>
          <p className="text-gray-600 text-lg mt-2">Tajribali va fidoyi jamoamiz bilan tanishing</p>
        </div>

        {/* lg ekranlarda aniq 5 ta ustun hosil qilamiz */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {management.map((person, idx) => (
            <div 
              key={idx} 
              className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-gray-100 text-center hover:shadow-2xl transition-all duration-300 flex flex-col items-center"
            >
              {person.image ? (
                <div className="w-28 h-28 mb-4 rounded-full overflow-hidden shadow-lg border-4 border-orange-500 shrink-0">
                  <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="text-5xl mb-4 bg-orange-100 w-28 h-28 rounded-full flex items-center justify-center shrink-0">
                  👤
                </div>
              )}

              <h3 className="text-lg font-bold text-gray-900 mb-1">{person.name}</h3>
              <span className="inline-block px-2.5 py-1 bg-orange-100 text-orange-800 text-[11px] font-bold rounded-full mb-3">
                {person.role}
              </span>
              <p className="text-gray-600 text-xs leading-relaxed">{person.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sharoitlar */}
      <section className="bg-white/80 backdrop-blur-md py-16 border-y border-gray-200 relative z-10">
        <div className="max-w-[1500px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Maktabimizda yaratilgan şaroitlar</h2>
            <p className="text-gray-600 text-lg mt-2">Zamonaviy ta'lim uçun barça imkoniyatlar bir joyda jamlangan</p>
          </div>

          <div 
            style={{ 
              flexDirection: 'row', 
              flexWrap: 'wrap', 
              justifyContent: 'center', 
              gap: '24px' 
            }}
            className="flex"
          >
            {features.map((item, idx) => (
              <div 
                key={idx} 
                className="p-8 rounded-3xl bg-white border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 text-center flex flex-col items-center"
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
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home({ current }) {
  return (
    <div className="w-full">
      {/* Hero Bo'limi — Ekran eni bo'yicha to'liq yoyilgan fon rasmi */}
      <div 
        className="relative w-full min-h-[75vh] flex items-center justify-center text-center text-white bg-cover bg-center bg-no-repeat shadow-2xl"
        style={{ backgroundImage: `url('/school.jpg')` }}
      >
        {/* Matnlar oson o'qilishi uchun to'q rangli shaffof qatlam (Overlay) */}
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]"></div>

        {/* Rasm ustidagi kontent */}
        <div className="relative z-10 max-w-5xl px-6 py-20">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 drop-shadow-xl tracking-tight leading-tight">
            Zarbdor Ixtisoslashtirilgan Maktabi
          </h1>
          
          <p className="text-lg md:text-2xl font-normal opacity-95 mb-10 max-w-3xl mx-auto drop-shadow-md leading-relaxed">
            Kelajak bunyodkorlari va ilmiy salohiyat maskani. Zamonaviy ta'lim, mukammal sharoit va kompyuter texnologiyalari markazi!
          </p>

          {/* Tugmalar */}
          <div className="flex flex-wrap gap-6 justify-center">
            <Link 
              to="/about" 
              className={`px-9 py-4 text-xl font-extrabold text-white rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 ${current?.btnBg || 'bg-orange-600'}`}
            >
              Maktab haqida batafsil
            </Link>
            
            <Link 
              to="/admission" 
              className="px-9 py-4 text-xl font-extrabold text-white bg-white/20 hover:bg-white/30 border-2 border-white/50 rounded-2xl backdrop-blur-md shadow-xl hover:scale-105 transition-all duration-300"
            >
              Qabul shartlari
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
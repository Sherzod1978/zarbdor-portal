import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function Home({ current, searchQuery }) {
  const [subjectsData, setSubjectsData] = useState({});

  // Real vaqt rejimida Firestore'dan ma'lumotlarni oliş
  useEffect(() => {
    const docRef = doc(db, "portal", "schoolData");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.subjects) setSubjectsData(data.subjects);
      }
    }, (err) => {
      console.error("Firestore tinglaşda xatolik:", err);
    });

    return () => unsubscribe();
  }, []);

  // Qidiruv söziga mos keluvchi tezkor havolalar
  const searchItems = [
    { title: "Maktab haqida va tariximiz", path: "/about", desc: "Zarbdor Ixtisoslaştirilgan Maktabi haqida batafsil ma'lumot." },
    { title: "Qabul şartlari va talablar", path: "/admission", desc: "Maktabga qabul jarayoni va imtihon talablari." },
    { title: "Sönggi yangiliklar va e'lonlar", path: "/news", desc: "Maktab hayotidagi muhim voqealari." },
    { title: "Bitiruvçilar va ularning yutuqlari", path: "/graduates", desc: "Muvaffaqiyatli bitiruvçilarimiz röyxati." },
    { title: "Öqituvçi va öquvçilar hamkorligi", path: "/collaboration", desc: "Admin va öqituvçilar uchun boşqaruv paneli." },
    { title: "Yutuqlar va olimpiada g'oliblari", path: "/achievements", desc: "Öquvçilarimizning faxrli örinlari." },
    { title: "Boğlaniş va manzil", path: "/contact", desc: "Biz bilan boğlaniş uchun telefon va manzil." }
  ];

  const filteredItems = searchQuery 
    ? searchItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="w-full">
      {/* Qidiruv natijalari */}
      {searchQuery ? (
        <div className="max-w-5xl mx-auto px-6 py-12 min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            🔍 "{searchQuery}" böyicha qidiruv natijalari:
          </h2>
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item, index) => (
                <Link 
                  key={index} 
                  to={item.path}
                  className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:border-orange-300 transition"
                >
                  <h3 className="text-xl font-bold text-orange-600 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-lg">Hech qanday natija topilmadi. Boşqa söz bilan qidirib köring.</p>
          )}
        </div>
      ) : (
        /* Odatiy Hero Bölimi */
        <div className="space-y-12">
          <div 
            className="relative w-full min-h-[75vh] flex items-center justify-center text-center text-white bg-cover bg-center bg-no-repeat shadow-2xl"
            style={{ backgroundImage: `url('/school.jpg')` }}
          >
            <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]"></div>

            <div className="relative z-10 max-w-5xl px-6 py-20">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 drop-shadow-xl tracking-tight leading-tight">
                Zarbdor Ixtisoslashtirilgan maktabi
              </h1>
              
              <p className="text-lg md:text-2xl font-normal opacity-95 mb-10 max-w-3xl mx-auto drop-shadow-md leading-relaxed">
                Kelajak bunyodkorlari va ilmiy salohiyat maskani. Zamonaviy ta'lim, mukammal şaroit va kompyuter texnologiyalari markazi!
              </p>

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
                  Qabul şartlari
                </Link>
              </div>
            </div>
          </div>

          
        </div>
      )}
    </div>
  );
}
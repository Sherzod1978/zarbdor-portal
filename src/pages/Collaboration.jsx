import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default function Collaboration() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const [className, setClassName] = useState('');
  const [classCodeInput, setClassCodeInput] = useState('');
  const [myClasses, setMyClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  
  // Material qo'shish uchun state-lar
  const [materialType, setMaterialType] = useState('announcement'); // 'announcement', 'video', 'interactive_test'
  const [title, setTitle] = useState('');
  const [contentUrl, setContentUrl] = useState('');

  // Interaktiv test yaratish uchun state-lar
  const [testQuestions, setTestQuestions] = useState([]);
  const [qText, setQText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState(0);

  // O'quvchi test yechishi uchun state-lar
  const [activeTest, setActiveTest] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setMyClasses(list);
    } catch (err) {
      console.error("Sinflarni olishda xatolik:", err);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!className.trim()) return;
    setLoading(true);
    setMessage('');

    try {
      const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      await setDoc(doc(db, "classes", classCode), {
        className: className,
        teacherUsername: user.username,
        teacherFullName: user.fullName,
        students: [],
        materials: [],
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

  // Testga savol qo'shish (o'qituvchi uchun)
  const handleAddQuestionToTest = () => {
    if (!qText.trim()) return;
    const newQ = {
      id: Date.now(),
      question: qText,
      options: [...options],
      correct: Number(correctOption)
    };
    setTestQuestions([...testQuestions, newQ]);
    setQText('');
    setOptions(['', '', '', '']);
    setCorrectOption(0);
  };

  // Material yoki Interaktiv testni sinfga e'lon qilish
  const handleAddMaterial = async (e) => {
    e.preventDefault();
    if (!title.trim() || !selectedClass) return;

    if (materialType === 'interactive_test' && testQuestions.length === 0) {
      alert("Iltimos, kamida bitta savol qo'shing!");
      return;
    }

    try {
      const classRef = doc(db, "classes", selectedClass.id);
      const newMaterial = {
        id: Date.now(),
        type: materialType, // 'announcement', 'video', 'interactive_test'
        title: title,
        url: contentUrl,
        questions: materialType === 'interactive_test' ? testQuestions : [],
        date: new Date().toLocaleDateString()
      };

      await updateDoc(classRef, {
        materials: arrayUnion(newMaterial)
      });

      const updatedMaterials = [...(selectedClass.materials || []), newMaterial];
      setSelectedClass({ ...selectedClass, materials: updatedMaterials });
      setTitle('');
      setContentUrl('');
      setTestQuestions([]);
      alert("Muvaffaqiyatli qo'shildi!");
    } catch (err) {
      console.error(err);
      alert("Qo'shishda xatolik yuz berdi.");
    }
  };

  // O'quvchi test javoblarini tekshirishi
  const handleCalculateTestScore = () => {
    let score = 0;
    activeTest.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        score += 1;
      }
    });
    setTestResult({
      score,
      total: activeTest.questions.length
    });
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Iltimos, avval tizimga kiring</h2>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-orange-600 text-white font-bold rounded-xl shadow hover:bg-orange-700 transition"
        >
          Tizimga kirish sahifasiga o'tish
        </button>
      </div>
    );
  }

  // Agar o'quvchi interaktiv testni yechayotgan bo'lsa
  if (activeTest) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10 font-sans">
        <button
          onClick={() => { setActiveTest(null); setTestResult(null); setSelectedAnswers({}); }}
          className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl text-sm transition"
        >
          ← Testlardan chiqish
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 space-y-6">
          <h2 className="text-2xl font-black text-gray-900">📝 {activeTest.title}</h2>

          {testResult !== null && (
            <div className="p-4 bg-orange-50 border border-orange-200 text-orange-900 rounded-xl text-center font-bold">
              Sizning natijangiz: {testResult.score} / {testResult.total} ta to'g'ri javob! ({Math.round((testResult.score / testResult.total) * 100)}%)
            </div>
          )}

          <div className="space-y-6">
            {activeTest.questions.map((q, qIndex) => (
              <div key={q.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                <h4 className="font-bold text-gray-900">{qIndex + 1}. {q.question}</h4>
                <div className="space-y-2">
                  {q.options.map((opt, optIndex) => (
                    <label key={optIndex} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      selectedAnswers[qIndex] === optIndex ? 'bg-orange-100 border-orange-500 font-bold' : 'bg-white border-gray-200 hover:bg-gray-100'
                    }`}>
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        checked={selectedAnswers[qIndex] === optIndex}
                        onChange={() => setSelectedAnswers({ ...selectedAnswers, [qIndex]: optIndex })}
                        disabled={testResult !== null}
                        className="text-orange-600"
                      />
                      <span className="text-sm text-gray-800">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {testResult === null && (
            <button
              onClick={handleCalculateTestScore}
              className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg transition"
            >
              Natijani tekshirish
            </button>
          )}
        </div>
      </div>
    );
  }

  if (selectedClass) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10 font-sans">
        <button
          onClick={() => setSelectedClass(null)}
          className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl text-sm transition"
        >
          ← Sinfga qaytish / Orqaga
        </button>

        <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 mb-8">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900">{selectedClass.className}</h1>
              <p className="text-sm text-gray-500 mt-1">O'qituvchi: {selectedClass.teacherFullName}</p>
            </div>
            <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-xl font-mono font-bold text-base shadow-inner">
              Sinf kodi: {selectedClass.id}
            </div>
          </div>
        </div>

        {/* O'qituvchi uchun material qo'shish */}
        {user.role === 'teacher' && (
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 mb-8 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">📚 Sinfga material yoki interaktiv test qo'shish</h3>
            <form onSubmit={handleAddMaterial} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Material turi</label>
                  <select
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 text-sm bg-white text-gray-900"
                  >
                    <option value="announcement">📢 E'lon / Matnli topshiriq</option>
                    <option value="video">🎥 Videodars havolasi</option>
                    <option value="interactive_test">📝 Sayt ichidagi interaktiv test</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Test yoki Mavzu nomi</label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: JavaScript asoslari bo'yicha test"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 text-sm text-gray-900"
                  />
                </div>
              </div>

              {materialType === 'video' && (
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-2">YouTube video havolasi (URL)</label>
                  <input
                    type="url"
                    required
                    placeholder="https://youtube.com/..."
                    value={contentUrl}
                    onChange={(e) => setContentUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 text-sm text-gray-900"
                  />
                </div>
              )}

              {materialType === 'announcement' && (
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-2">E'lon matni</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="E'lon tafsilotlarini yozing..."
                    value={contentUrl}
                    onChange={(e) => setContentUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 text-sm text-gray-900"
                  />
                </div>
              )}

              {/* Interaktiv test savollarini qo'shish qismi */}
              {materialType === 'interactive_test' && (
                <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-200 space-y-4">
                  <h4 className="font-bold text-orange-900">Test savollarini tuzish (Jami qo'shilgan: {testQuestions.length} ta)</h4>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Savol matni</label>
                    <input
                      type="text"
                      placeholder="Masalan: React qanday kutubxona?"
                      value={qText}
                      onChange={(e) => setQText(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {options.map((opt, idx) => (
                      <div key={idx}>
                        <label className="block text-xs font-bold text-gray-600 mb-1">{idx + 1}-variant</label>
                        <input
                          type="text"
                          placeholder={`Variant ${idx + 1}`}
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...options];
                            newOpts[idx] = e.target.value;
                            setOptions(newOpts);
                          }}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm text-gray-900"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">To'g'ri javob indeksi</label>
                    <select
                      value={correctOption}
                      onChange={(e) => setCorrectOption(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900"
                    >
                      <option value={0}>1-variant to'g'ri</option>
                      <option value={1}>2-variant to'g'ri</option>
                      <option value={2}>3-variant to'g'ri</option>
                      <option value={3}>4-variant to'g'ri</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddQuestionToTest}
                    className="px-4 py-2 bg-gray-900 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition"
                  >
                    + Savolni qo'shish
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm transition shadow"
              >
                Materialni e'lon qilish
              </button>
            </form>
          </div>
        )}

        {/* Materiallar va O'quvchilar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📂 Dars materiallari va Testlar</h3>
            {(!selectedClass.materials || selectedClass.materials.length === 0) ? (
              <p className="text-sm text-gray-500">Hozircha materiallar mavjud emas.</p>
            ) : (
              <div className="space-y-4">
                {selectedClass.materials.map((item) => (
                  <div key={item.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        item.type === 'video' ? 'bg-purple-100 text-purple-800' :
                        item.type === 'interactive_test' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {item.type === 'video' ? '🎥 Videodars' : item.type === 'interactive_test' ? '📝 Interaktiv test' : '📢 E\'lon'}
                      </span>
                      <span className="text-xs text-gray-400">{item.date}</span>
                    </div>

                    <h4 className="font-bold text-gray-900 text-base">{item.title}</h4>

                    {item.type === 'announcement' && (
                      <p className="text-sm text-gray-600">{item.url}</p>
                    )}

                    {item.type === 'video' && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition"
                      >
                        ▶ Videoni ko'rish
                      </a>
                    )}

                    {item.type === 'interactive_test' && (
                      <button
                        onClick={() => setActiveTest(item)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition"
                      >
                        ✍️ Testni boshlash ({item.questions?.length || 0} ta savol)
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">👥 Sinf o'quvchilari ({selectedClass.students?.length || 0})</h3>
            {(!selectedClass.students || selectedClass.students.length === 0) ? (
              <p className="text-sm text-gray-500">Hozircha o'quvchilar qo'shilmagan.</p>
            ) : (
              <ul className="space-y-2">
                {selectedClass.students.map((st, index) => (
                  <li key={index} className="px-4 py-2.5 bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 border border-gray-100 flex items-center justify-between">
                    <span>{index + 1}. {st}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-lg">O'quvchi</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-sans">
      
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
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

      {user.role === 'teacher' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🏫 Yangi sinf yaratish</h3>
            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Sinf nomi</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: 10-A Informatika"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 text-sm text-gray-900"
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

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📂 Mening sinflarim</h3>
            {myClasses.length === 0 ? (
              <p className="text-sm text-gray-500">Hozircha sinflar yaratmagansiz.</p>
            ) : (
              <div className="space-y-3">
                {myClasses.map((cls) => (
                  <div 
                    key={cls.id} 
                    onClick={() => setSelectedClass(cls)}
                    className="p-4 bg-gray-50 hover:bg-orange-50/50 rounded-xl border border-gray-200 flex justify-between items-center cursor-pointer transition shadow-sm"
                  >
                    <div>
                      <h4 className="font-bold text-gray-900">{cls.className}</h4>
                      <p className="text-xs text-gray-500">O'quvchilar soni: {cls.students?.length || 0}</p>
                    </div>
                    <div className="bg-orange-100 text-orange-800 px-3 py-1.5 rounded-lg font-mono font-bold text-sm">
                      {cls.id} ➔
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🔗 Sinfga qo'shilish</h3>
            <form onSubmit={handleJoinClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Sinf kodi</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: A7B2X9"
                  value={classCodeInput}
                  onChange={(e) => setClassCodeInput(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 text-sm uppercase text-gray-900"
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

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📚 Mening sinflarim</h3>
            {myClasses.length === 0 ? (
              <p className="text-sm text-gray-500">Hozircha hech qanday sinfga qo'shilmagansiz.</p>
            ) : (
              <div className="space-y-3">
                {myClasses.map((cls) => (
                  <div 
                    key={cls.id}
                    onClick={() => setSelectedClass(cls)}
                    className="p-4 bg-gray-50 hover:bg-blue-50/50 rounded-xl border border-gray-200 cursor-pointer transition shadow-sm"
                  >
                    <h4 className="font-bold text-gray-900">{cls.className}</h4>
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
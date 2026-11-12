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
  const [materialType, setMaterialType] = useState('announcement');
  const [title, setTitle] = useState('');
  const [contentUrl, setContentUrl] = useState('');

  // Interaktiv test yaratish/tahrirlash uchun state-lar
  const [testQuestions, setTestQuestions] = useState([]);
  const [qText, setQText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState(0);
  const [timeLimit, setTimeLimit] = useState(30);
  const [questionScore, setQuestionScore] = useState(10);
  
  // Mavjud testni tahrirlash rejimi
  const [editingTestId, setEditingTestId] = useState(null);

  // O'quvchi test yechishi uchun state-lar
  const [activeTest, setActiveTest] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [scoreEarned, setScoreEarned] = useState(0);
  const [totalPossibleScore, setTotalPossibleScore] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showReview, setShowReview] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserClasses();
    }
  }, [user]);

  // Test ishlash jarayonidagi taymer
  useEffect(() => {
    if (!activeTest || testCompleted || showReview) return;

    const currentQ = activeTest.questions[currentQIndex];
    const limit = currentQ?.timeLimit || 30;
    setTimeLeft(limit);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNextQuestion(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTest, currentQIndex, testCompleted, showReview]);

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
      // Agar tanlangan sinf bo'lsa, uning ma'lumotlarini ham yangilash
      if (selectedClass) {
        const updated = list.find(c => c.id === selectedClass.id);
        if (updated) setSelectedClass(updated);
      }
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
        testResults: [],
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

  const handleAddQuestionToTest = () => {
    if (!qText.trim()) return;
    const newQ = {
      id: Date.now(),
      question: qText,
      options: [...options],
      correct: Number(correctOption),
      timeLimit: Number(timeLimit),
      score: Number(questionScore)
    };
    setTestQuestions([...testQuestions, newQ]);
    setQText('');
    setOptions(['', '', '', '']);
    setCorrectOption(0);
  };

  const handleDeleteQuestionFromBuffer = (id) => {
    setTestQuestions(testQuestions.filter(q => q.id !== id));
  };

  // Testni saqlash yoki tahrirlanganini bazaga yangilash
  const handleSaveTestMaterial = async (e) => {
    e.preventDefault();
    if (!title.trim() || !selectedClass) return;

    if (testQuestions.length === 0) {
      alert("Iltimos, kamida bitta savol qo'shing!");
      return;
    }

    try {
      const classRef = doc(db, "classes", selectedClass.id);
      let updatedMaterials = [...(selectedClass.materials || [])];

      if (editingTestId) {
        // Mavjud testni yangilash (tahrirlash)
        updatedMaterials = updatedMaterials.map(mat => {
          if (mat.id === editingTestId) {
            return { ...mat, title: title, questions: testQuestions };
          }
          return mat;
        });
      } else {
        // Yangi test qo'shish
        const newMaterial = {
          id: Date.now(),
          type: 'interactive_test',
          title: title,
          url: '',
          questions: testQuestions,
          date: new Date().toLocaleDateString()
        };
        updatedMaterials.push(newMaterial);
      }

      await updateDoc(classRef, { materials: updatedMaterials });

      setSelectedClass({ ...selectedClass, materials: updatedMaterials });
      setTitle('');
      setTestQuestions([]);
      setEditingTestId(null);
      alert("Test muvaffaqiyatli saqlandi!");
    } catch (err) {
      console.error(err);
      alert("Saqlashda xatolik yuz berdi.");
    }
  };

  // Oddiy material (E'lon yoki Video) qo'shish
  const handleAddSimpleMaterial = async (e) => {
    e.preventDefault();
    if (!title.trim() || !contentUrl.trim() || !selectedClass) return;

    try {
      const classRef = doc(db, "classes", selectedClass.id);
      const newMaterial = {
        id: Date.now(),
        type: materialType,
        title: title,
        url: contentUrl,
        questions: [],
        date: new Date().toLocaleDateString()
      };

      const updatedMaterials = [...(selectedClass.materials || []), newMaterial];
      await updateDoc(classRef, { materials: updatedMaterials });

      setSelectedClass({ ...selectedClass, materials: updatedMaterials });
      setTitle('');
      setContentUrl('');
      alert("Material qo'shildi!");
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi.");
    }
  };

  // Testni tahrirlash rejimiga o'tkazish
  const handleStartEditTest = (mat) => {
    setEditingTestId(mat.id);
    setTitle(mat.title);
    setTestQuestions(mat.questions || []);
    setMaterialType('interactive_test');
  };

  // Materialni o'chirish
  const handleDeleteMaterial = async (matId) => {
    if (!window.confirm("Haqiqatan ham ushbu materialni o'chirmoqchimisiz?")) return;
    try {
      const classRef = doc(db, "classes", selectedClass.id);
      const updatedMaterials = selectedClass.materials.filter(m => m.id !== matId);
      await updateDoc(classRef, { materials: updatedMaterials });
      setSelectedClass({ ...selectedClass, materials: updatedMaterials });
    } catch (err) {
      console.error(err);
    }
  };

  const handleNextQuestion = async (isTimeOut = false) => {
    const questions = activeTest.questions;
    
    let currentEarned = scoreEarned;
    if (!isTimeOut) {
      const currentQ = questions[currentQIndex];
      const selectedOpt = selectedAnswers[currentQIndex];
      if (selectedOpt === currentQ.correct) {
        currentEarned += currentQ.score;
        setScoreEarned(currentEarned);
      }
    }

    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      let totalMax = 0;
      questions.forEach(q => totalMax += q.score);
      setTotalPossibleScore(totalMax);
      setTestCompleted(true);

      try {
        const classRef = doc(db, "classes", selectedClass.id);
        const resultRecord = {
          studentUsername: user.username,
          studentName: user.fullName || user.username,
          testTitle: activeTest.title,
          score: currentEarned,
          maxScore: totalMax,
          date: new Date().toLocaleString()
        };

        await updateDoc(classRef, {
          testResults: arrayUnion(resultRecord)
        });
        fetchUserClasses();
      } catch (err) {
        console.error("Natijani saqlashda xatolik:", err);
      }
    }
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

  if (activeTest) {
    const questions = activeTest.questions;

    return (
      <div className="max-w-3xl mx-auto px-6 py-10 font-sans">
        <button
          onClick={() => { setActiveTest(null); setCurrentQIndex(0); setSelectedAnswers({}); setScoreEarned(0); setTestCompleted(false); setShowReview(false); }}
          className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl text-sm transition"
        >
          ← Testlardan chiqish
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-black text-gray-900">📝 {activeTest.title}</h2>
            {!testCompleted && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold bg-orange-100 text-orange-800 px-3 py-1 rounded-lg">
                  Savol: {currentQIndex + 1} / {questions.length}
                </span>
                <span className={`text-xs font-bold px-3 py-1 rounded-lg ${timeLeft <= 5 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-100 text-blue-800'}`}>
                  ⏱️ {timeLeft}s
                </span>
              </div>
            )}
          </div>

          {testCompleted ? (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-2">
                <div className="text-5xl">🏆</div>
                <h3 className="text-2xl font-black text-gray-900">Test yakunlandi!</h3>
                <p className="text-lg text-gray-700 font-semibold">
                  Sizning to'plagan balingiz: <span className="text-orange-600">{scoreEarned}</span> / {totalPossibleScore} ball
                </p>
                <p className="text-xs text-green-600 font-bold">Natijangiz o'qituvchiga yuborildi!</p>
              </div>

              {!showReview ? (
                <button
                  onClick={() => setShowReview(true)}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition"
                >
                  🔍 Xatolarni tahlil qilish (Review)
                </button>
              ) : (
                <div className="space-y-6 pt-4 border-t">
                  <h4 className="font-bold text-gray-900 text-lg">Javoblar tahlili:</h4>
                  {questions.map((q, idx) => {
                    const studentAns = selectedAnswers[idx];
                    const isCorrect = studentAns === q.correct;
                    return (
                      <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <p className="font-bold text-gray-900 mb-2">{idx + 1}. {q.question}</p>
                        <p className="text-xs mb-1">
                          Sizning javobingiz: <span className={`font-bold ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
                            {studentAns !== undefined ? q.options[studentAns] : "Javob berilmadi"} {isCorrect ? '✅' : '❌'}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-xs text-green-700 font-bold">
                            To'g'ri javob: {q.options[q.correct]}
                          </p>
                        )}
                      </div>
                    );
                  })}
                  <button
                    onClick={() => { setActiveTest(null); setCurrentQIndex(0); setSelectedAnswers({}); setScoreEarned(0); setTestCompleted(false); setShowReview(false); }}
                    className="w-full py-3.5 bg-gray-900 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg transition"
                  >
                    Sinf sahifasiga qaytish
                  </button>
                </div>
              )}

              {!showReview && (
                <button
                  onClick={() => { setActiveTest(null); setCurrentQIndex(0); setSelectedAnswers({}); setScoreEarned(0); setTestCompleted(false); setShowReview(false); }}
                  className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition"
                >
                  Sinfga qaytish
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                <span>Ball: {questions[currentQIndex].score} ball</span>
              </div>

              <h3 className="text-lg font-bold text-gray-900">
                {currentQIndex + 1}. {questions[currentQIndex].question}
              </h3>

              <div className="space-y-3">
                {questions[currentQIndex].options.map((opt, optIndex) => (
                  <label key={optIndex} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
                    selectedAnswers[currentQIndex] === optIndex ? 'bg-orange-100 border-orange-500 font-bold' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}>
                    <input
                      type="radio"
                      name={`question-${currentQIndex}`}
                      checked={selectedAnswers[currentQIndex] === optIndex}
                      onChange={() => setSelectedAnswers({ ...selectedAnswers, [currentQIndex]: optIndex })}
                      className="text-orange-600"
                    />
                    <span className="text-sm text-gray-800">{opt}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={() => handleNextQuestion(false)}
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg transition"
              >
                {currentQIndex + 1 === questions.length ? "Testni yakunlash" : "Keyingi savol →"}
              </button>
            </div>
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

        {/* O'qituvchi uchun material / test qo'shish va tahrirlash */}
        {user.role === 'teacher' && (
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 mb-8 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">
              {editingTestId ? "✏️ Testni tahrirlash rejimi" : "📚 Sinfga material yoki interaktiv test qo'shish"}
            </h3>
            
            {/* Oddiy materiallar uchun forma */}
            {materialType !== 'interactive_test' ? (
              <form onSubmit={handleAddSimpleMaterial} className="space-y-4">
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
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Sarlavha yoki Mavzu</label>
                    <input
                      type="text"
                      required
                      placeholder="Mavzu nomini kiriting..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 text-sm text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                    {materialType === 'video' ? 'YouTube video havolasi (URL)' : 'E\'lon matni'}
                  </label>
                  <input
                    type={materialType === 'video' ? 'url' : 'text'}
                    required
                    placeholder={materialType === 'video' ? 'https://youtube.com/...' : 'Matnni kiriting...'}
                    value={contentUrl}
                    onChange={(e) => setContentUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 text-sm text-gray-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm transition shadow"
                >
                  Materialni e'lon qilish
                </button>
              </form>
            ) : (
              /* Interaktiv test yaratish va tahrirlash formasi */
              <form onSubmit={handleSaveTestMaterial} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Material turi</label>
                    <select
                      value={materialType}
                      onChange={(e) => {
                        setMaterialType(e.target.value);
                        if(e.target.value !== 'interactive_test') setEditingTestId(null);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 text-sm bg-white text-gray-900"
                    >
                      <option value="interactive_test">📝 Sayt ichidagi interaktiv test</option>
                      <option value="announcement">📢 E'lon / Matnli topshiriq</option>
                      <option value="video">🎥 Videodars havolasi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Test Nomi</label>
                    <input
                      type="text"
                      required
                      placeholder="Masalan: 1-mavzu testi"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-600 text-sm text-gray-900"
                    />
                  </div>
                </div>

                <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-200 space-y-4">
                  <h4 className="font-bold text-orange-900">Savollar ro'yxati (Jami: {testQuestions.length} ta)</h4>
                  
                  {testQuestions.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {testQuestions.map((q, idx) => (
                        <div key={q.id} className="flex justify-between items-center p-3 bg-white rounded-xl border text-xs">
                          <span>{idx + 1}. {q.question} ({q.score} ball, {q.timeLimit}s)</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteQuestionFromBuffer(q.id)}
                            className="text-red-600 font-bold hover:underline"
                          >
                            O'chirish
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Vaqt (sekund)</label>
                      <input
                        type="number"
                        min="5"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Ball</label>
                      <input
                        type="number"
                        min="1"
                        value={questionScore}
                        onChange={(e) => setQuestionScore(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Savol matni</label>
                    <input
                      type="text"
                      placeholder="Savolni kiriting..."
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

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm transition shadow"
                  >
                    {editingTestId ? "Test o'zgarishlarini saqlash" : "Testni e'lon qilish"}
                  </button>
                  {editingTestId && (
                    <button
                      type="button"
                      onClick={() => { setEditingTestId(null); setTitle(''); setTestQuestions([]); }}
                      className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-xl text-sm transition"
                    >
                      Bekor qilish
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}

        {/* Materiallar va Natijalar */}
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
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => { setActiveTest(item); setCurrentQIndex(0); setSelectedAnswers({}); setScoreEarned(0); setTestCompleted(false); setShowReview(false); }}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition"
                        >
                          ✍️ Testni ishlash ({item.questions?.length || 0} ta savol)
                        </button>
                        {user.role === 'teacher' && (
                          <button
                            onClick={() => handleStartEditTest(item)}
                            className="px-3 py-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold rounded-xl transition"
                          >
                            ✏️ Tahrirlash
                          </button>
                        )}
                      </div>
                    )}

                    {user.role === 'teacher' && (
                      <div className="text-right pt-1">
                        <button
                          onClick={() => handleDeleteMaterial(item.id)}
                          className="text-xs text-red-600 font-bold hover:underline"
                        >
                          O'chirish
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
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

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Test Natijalari</h3>
              {(!selectedClass.testResults || selectedClass.testResults.length === 0) ? (
                <p className="text-sm text-gray-500">Hozircha topshirilgan test natijalari yo'q.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedClass.testResults.map((res, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-xl border flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-gray-900">{res.studentName} ({res.testTitle})</p>
                        <p className="text-gray-400">{res.date}</p>
                      </div>
                      <span className="font-black text-orange-600 bg-orange-100 px-2 py-1 rounded-lg">
                        {res.score} / {res.maxScore} ball
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
import React, { useState, useEffect } from 'react';

export default function OnlineTestSystem({ currentSeason }) {
  // Asosiy holatlar (States)
  const [activeTab, setActiveTab] = useState('tests'); // 'tests', 'take-test', 'result', 'admin'
  const [tests, setTests] = useState([
    {
      id: 1,
      title: "Python asoslari bo'yicha test",
      subject: "Informatika",
      duration: 10, // daqiqa
      shuffle: true,
      questions: [
        {
          id: 1,
          question: "Python dasturlaş tilida ekranga matn çiqariş uçun qaysi funksiya işlatiladi?",
          options: ["print()", "echo()", "cout <<", "Console.WriteLine()"],
          correct: 0,
          points: 10,
          timer: 30, // soniya
          explanation: "Python-da ma'lumotlarni ekranga chiqarish uchun print() funksiyasidan foydalaniladi."
        },
        {
          id: 2,
          question: "Quyidagilardan qaysi biri o'zgaruvchi nomi bo'la olmaydi?",
          options: ["my_var", "_variable", "123var", "var123"],
          correct: 2,
          points: 10,
          timer: 30,
          explanation: "O'zgaruvchi nomlari raqam bilan boshlanishi mumkin emas."
        }
      ]
    }
  ]);

  const [currentTest, setCurrentTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentInfo, setStudentInfo] = useState({ name: '', className: '' });
  const [studentAnswers, setStudentAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [testResult, setTestResult] = useState(null);
  
  // Admin paneli uchun
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [submissions, setSubmissions] = useState([]); // O'quvchilar natijalari tarixi
  const [newTest, setNewTest] = useState({ title: '', subject: 'Informatika', duration: 15, shuffle: false });

  // Savollar uchun taymer
  useEffect(() => {
    let timer;
    if (activeTab === 'take-test' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && activeTab === 'take-test') {
      handleNextQuestion();
    }
    return () => clearInterval(timer);
  }, [timeLeft, activeTab]);

  // Testni boshlash
  const startTest = (test) => {
    if (!studentInfo.name || !studentInfo.className) {
      alert("Iltimos, Ism-familiyangiz va sinfingizni kiriting!");
      return;
    }
    let testQuestions = [...test.questions];
    if (test.shuffle) {
      testQuestions = testQuestions.sort(() => Math.random() - 0.5);
    }
    setCurrentTest({ ...test, questions: testQuestions });
    setCurrentQuestionIndex(0);
    setStudentAnswers({});
    setTimeLeft(testQuestions[0]?.timer || 30);
    setActiveTab('take-test');
  };

  // Keyingi savolga o'tish
  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentTest.questions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      setTimeLeft(currentTest.questions[nextIdx].timer || 30);
    } else {
      finishTest();
    }
  };

  // Testni yakunlash va natijani hisoblash
  const finishTest = () => {
    let totalScore = 0;
    let maxScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;

    currentTest.questions.forEach((q, idx) => {
      maxScore += q.points;
      if (studentAnswers[idx] === q.correct) {
        totalScore += q.points;
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    const percentage = Math.round((totalScore / maxScore) * 100);
    let grade = "Qoniqarsiz";
    if (percentage >= 85) grade = "A'lo (5)";
    else if (percentage >= 70) grade = "Yaxshi (4)";
    else if (percentage >= 50) grade = "Qoniqarli (3)";

    const resultData = {
      student: studentInfo,
      testTitle: currentTest.title,
      totalScore,
      maxScore,
      percentage,
      grade,
      correctCount,
      incorrectCount,
      date: new Date().toLocaleString()
    };

    setTestResult(resultData);
    setSubmissions([resultData, ...submissions]);
    setActiveTab('result');
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      {/* Sarlavha va Navigatsiya */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-gray-200 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">🎓 Onlayn Test Tizimi</h1>
          <p className="text-gray-600">O'quvchilar uchun bilimni baholash va o'qituvchilar uchun test boshqaruvi.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveTab('tests')}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition shadow-md ${activeTab === 'tests' || activeTab === 'take-test' || activeTab === 'result' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            📋 Mavjud Testlar
          </button>
          <button 
            onClick={() => setActiveTab('admin')}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition shadow-md ${activeTab === 'admin' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            ⚙️ O'qituvchi / Admin
          </button>
        </div>
      </div>

      {/* 1. TESTLAR RO'YXATI VA O'QUVCHI KIRISHI */}
      {activeTab === 'tests' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200 lg:col-span-1">
            <h2 className="text-xl font-bold text-gray-900 mb-4">✍️ Test topshirish uchun kirish</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Ism va Familiyangiz</label>
                <input 
                  type="text" 
                  placeholder="Masalan: Sherzod Amanov"
                  value={studentInfo.name}
                  onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Sinfingiz</label>
                <input 
                  type="text" 
                  placeholder="Masalan: 9-'A'"
                  value={studentInfo.className}
                  onChange={(e) => setStudentInfo({ ...studentInfo, className: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <p className="text-xs text-gray-500">Testni boshlash uchun quyidagi ro'yxatdan kerakli testni tanlang.</p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-black text-gray-900">Faol Testlar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tests.map((test) => (
                <div key={test.id} className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-gray-200 flex flex-col justify-between">
                  <div>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full">
                      {test.subject}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2">{test.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">Savollar soni: {test.questions.length} ta | Vaqt: {test.duration} daqiqa</p>
                  </div>
                  <button 
                    onClick={() => startTest(test)}
                    className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition"
                  >
                    🚀 Testni boshlash
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. TEST TOPSHIRISH JARAYONI */}
      {activeTab === 'take-test' && currentTest && (
        <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{currentTest.title}</h2>
              <p className="text-xs text-gray-500">O'quvchi: {studentInfo.name} ({studentInfo.className})</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 block">Qolgan vaqt:</span>
              <span className="text-xl font-black text-orange-600 animate-pulse">{timeLeft}s</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
              <span>Savol {currentQuestionIndex + 1} / {currentTest.questions.length}</span>
              <span>Ball: {currentTest.questions[currentQuestionIndex].points}</span>
            </div>
            <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-orange-600 h-2.5 transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / currentTest.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-6">
            {currentTest.questions[currentQuestionIndex].question}
          </h3>

          <div className="space-y-3 mb-8">
            {currentTest.questions[currentQuestionIndex].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setStudentAnswers({ ...studentAnswers, [currentQuestionIndex]: idx })}
                className={`w-full text-left p-4 rounded-2xl border font-semibold text-sm transition ${
                  studentAnswers[currentQuestionIndex] === idx
                    ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                    : 'bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextQuestion}
            className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg transition"
          >
            {currentQuestionIndex < currentTest.questions.length - 1 ? "Keyingi savol →" : "Testni yakunlaş va topşiriş ✓"}
          </button>
        </div>
      )}

      {/* 3. NATIJALAR TAHLILI */}
      {activeTab === 'result' && testResult && (
        <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200 text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-inner">
            🏆
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-1">Test yakunlandi!</h2>
          <p className="text-gray-600 mb-6">{testResult.student.name} ({testResult.student.className}), natijangiz:</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <span className="text-xs text-gray-500 block">Umumiy ball</span>
              <span className="text-2xl font-black text-gray-900">{testResult.totalScore} / {testResult.maxScore}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <span className="text-xs text-gray-500 block">Foiz körsatkiçi</span>
              <span className="text-2xl font-black text-orange-600">{testResult.percentage}%</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <span className="text-xs text-gray-500 block">Töğri / Notöğri</span>
              <span className="text-xl font-bold text-emerald-600">{testResult.correctCount}</span> / <span className="text-xl font-bold text-rose-600">{testResult.incorrectCount}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <span className="text-xs text-gray-500 block">Bahokorlik</span>
              <span className="text-lg font-black text-blue-600">{testResult.grade}</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('tests')}
            className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg transition"
          >
            ← Boş sahifaga qaytiş
          </button>
        </div>
      )}

      {/* 4. ADMIN / O'QITUVCHI PANELI */}
      {activeTab === 'admin' && (
        <div className="space-y-8">
          {!isAdminLoggedIn ? (
            <div className="max-w-md mx-auto bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200 text-center">
              <h2 className="text-2xl font-black text-gray-900 mb-2">🔐 Admin kiriş</h2>
              <p className="text-sm text-gray-600 mb-6">Testlarni boşqariş uçun parolni kiriting.</p>
              <input 
                type="password"
                placeholder="Parol (admin2026)"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm mb-4 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <button 
                onClick={() => {
                  if (adminPassword === 'admin2026') {
                    setIsAdminLoggedIn(true);
                  } else {
                    alert("Parol notöğri!");
                  }
                }}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition"
              >
                Kiriş
              </button>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-black text-gray-900">⚙️ Öqituvçi boşqaruv paneli</h2>
                <button 
                  onClick={() => setIsAdminLoggedIn(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl text-xs transition"
                >
                  Çiqiş
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">➕ Yangi test qöşiş</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Test Nomi</label>
                      <input 
                        type="text" 
                        placeholder="Masalan: Matematika asoslari"
                        value={newTest.title}
                        onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Fan</label>
                      <input 
                        type="text" 
                        placeholder="Fan nomi"
                        value={newTest.subject}
                        onChange={(e) => setNewTest({ ...newTest, subject: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>
                    <button 
                      onClick={() => {
                        if (!newTest.title) return alert("Test nomini kiriting!");
                        setTests([...tests, { id: Date.now(), ...newTest, questions: [] }]);
                        setNewTest({ title: '', subject: 'Informatika', duration: 15, shuffle: false });
                        alert("Yangi test muvaffaqiyatli qöşildi!");
                      }}
                      className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition"
                    >
                      Test yaratiş
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Topshirgan O'quvchilar Tarixi</h3>
                  {submissions.length === 0 ? (
                    <p className="text-sm text-gray-500">Hozircha test topshirgan o'quvchilar yo'q.</p>
                  ) : (
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                      {submissions.map((sub, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm flex justify-between items-center">
                          <div>
                            <span className="font-bold text-gray-900 block">{sub.student.name} ({sub.student.className})</span>
                            <span className="text-xs text-gray-500">{sub.testTitle} — {sub.date}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-orange-600 block">{sub.totalScore} ball ({sub.percentage}%)</span>
                            <span className="text-xs text-blue-600 font-semibold">{sub.grade}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
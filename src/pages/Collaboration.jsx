import React, { useState, useEffect } from 'react';

export default function Collaboration() {
  const initialSchedules = [
    { id: 1, day: 'Dushanba', classNum: '9-A', subjects: 'Matematika, Fizika, Informatika, Ingliz tili' },
    { id: 2, day: 'Seshanba', classNum: '9-A', subjects: 'Informatika (Robototexnika), Kimyo, Biologiya, Tarix' },
    { id: 3, day: 'Chorshanba', classNum: '10-B', subjects: 'Matematika (Algebra), Ona tili, Fizika, Geometriya' }
  ];

  const initialSubjects = {
    Matematika: {
      teacher: "K. Mamadiyorov (Oliy toifali o'qituvchi)",
      videos: [
        { title: '1-mavzu: Hosila va uning tatbiqi', duration: '45 min', link: '#' },
        { title: '2-mavzu: Integrallar va yuzlarni hisoblash', duration: '50 min', link: '#' }
      ],
      tests: [
        { 
          id: 101,
          title: '1-bosqich test nazorati', 
          duration: 10,
          shuffle: true,
          questions: [
            {
              id: 1,
              question: "2 + 2 * 2 ifodaning qiymatini toping:",
              options: ["6", "8", "4", "2"],
              correct: 0,
              points: 10,
              timer: 30,
              explanation: "Matematik qoidaga ko'ra avval ko'paytirish bajariladi: 2 * 2 = 4, keyin qo'shiladi: 2 + 4 = 6."
            }
          ]
        }
      ]
    },
    Informatika: {
      teacher: 'Sh. Amanov (IT mutaxassisi)',
      videos: [
        { title: 'Python dasturlash tiliga kirish', duration: '60 min', link: '#' },
        { title: 'LEGO EV3 Pybricks MicroPython asoslari', duration: '40 min', link: '#' }
      ],
      tests: [
        { 
          id: 102,
          title: "Python asoslari bo'yicha test", 
          duration: 15, 
          shuffle: false,
          questions: [
            {
              id: 1,
              question: "Python dasturlash tilida ekranga matn chiqarish uchun qaysi funksiya ishlatiladi?",
              options: ["print()", "echo()", "cout <<", "Console.WriteLine()"],
              correct: 0,
              points: 10,
              timer: 30,
              explanation: "Python-da ekranga ma'lumot chiqarish uchun print() funksiyasi qo'llaniladi."
            },
            {
              id: 2,
              question: "Quyidagilardan qaysi biri o'zgaruvchi nomi bo'la olmaydi?",
              options: ["my_var", "_variable", "123var", "var123"],
              correct: 2,
              points: 10,
              timer: 30,
              explanation: "O'zgaruvchi nomlari raqam bilan boshlanishi taqiqlangan."
            }
          ]
        }
      ]
    }
  };

  const [subjectsData, setSubjectsData] = useState(() => {
    const saved = localStorage.getItem('school_subjects');
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem('school_schedules');
    return saved ? JSON.parse(saved) : initialSchedules;
  });

  const [selectedSubject, setSelectedSubject] = useState('Informatika');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPass, setAdminPass] = useState('');

  const [activeTab, setActiveTab] = useState('courses'); 

  const [newSubjectName, setNewSubjectName] = useState('');
  const [newTeacherName, setNewTeacherName] = useState('');
  
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDuration, setVideoDuration] = useState('');
  const [videoLink, setVideoLink] = useState('');

  const [schedDay, setSchedDay] = useState('Dushanba');
  const [schedClass, setSchedClass] = useState('9-A');
  const [schedSubjects, setSchedSubjects] = useState('');

  const [activeTest, setActiveTest] = useState(null);
  const [studentInfo, setStudentInfo] = useState({ name: '', className: '' });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [testResult, setTestResult] = useState(null);
  const [submissions, setSubmissions] = useState(() => {
    const saved = localStorage.getItem('test_submissions');
    return saved ? JSON.parse(saved) : [];
  });

  const [newTestTitle, setNewTestTitle] = useState('');
  const [newTestDuration, setNewTestDuration] = useState(15);
  const [newTestShuffle, setNewTestShuffle] = useState(false);
  
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState(0);
  const [questionPoints, setQuestionPoints] = useState(10);
  const [questionTimer, setQuestionTimer] = useState(30);
  const [questionExplanation, setQuestionExplanation] = useState('');
  const [tempQuestions, setTempQuestions] = useState([]);

  useEffect(() => {
    localStorage.setItem('school_subjects', JSON.stringify(subjectsData));
  }, [subjectsData]);

  useEffect(() => {
    localStorage.setItem('school_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('test_submissions', JSON.stringify(submissions));
  }, [submissions]);

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

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPass === 'admin2026') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPass('');
    } else {
      alert("Admin paroli xato!");
    }
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubjectName || !newTeacherName) return;

    if (subjectsData[newSubjectName]) {
      alert("Bu fan allaqachon mavjud!");
      return;
    }

    const updated = {
      ...subjectsData,
      [newSubjectName]: {
        teacher: newTeacherName,
        videos: [],
        tests: []
      }
    };

    setSubjectsData(updated);
    setSelectedSubject(newSubjectName);
    setNewSubjectName('');
    setNewTeacherName('');
    alert("Yangi fan muvaffaqiyatli qo'shildi!");
  };

  const handleAddVideo = (e) => {
    e.preventDefault();
    if (!videoTitle || !selectedSubject) return;

    const currentSub = subjectsData[selectedSubject];
    const newVideo = {
      title: videoTitle,
      duration: videoDuration || '30 min',
      link: videoLink || '#'
    };

    const updated = {
      ...subjectsData,
      [selectedSubject]: {
        ...currentSub,
        videos: [...currentSub.videos, newVideo]
      }
    };

    setSubjectsData(updated);
    setVideoTitle('');
    setVideoDuration('');
    setVideoLink('');
    alert("Videodars muvaffaqiyatli qo'shildi!");
  };

  const handleDeleteVideo = (subjectName, videoIndex) => {
    if (window.confirm("Ushbu videoni o'chirmoqchimisiz?")) {
      const sub = subjectsData[subjectName];
      const updatedVideos = sub.videos.filter((_, idx) => idx !== videoIndex);
      const updated = {
        ...subjectsData,
        [subjectName]: {
          ...sub,
          videos: updatedVideos
        }
      };
      setSubjectsData(updated);
    }
  };

  const handleAddSchedule = (e) => {
    e.preventDefault();
    if (!schedSubjects) return;

    const newSched = {
      id: Date.now(),
      day: schedDay,
      classNum: schedClass,
      subjects: schedSubjects
    };

    setSchedules([newSched, ...schedules]);
    setSchedSubjects('');
    alert("Dars jadvali muvaffaqiyatli saqlandi!");
  };

  const handleDeleteSchedule = (id) => {
    if (window.confirm("Ushbu dars jadvalini o'chirmoqchimisiz?")) {
      setSchedules(schedules.filter(item => item.id !== id));
    }
  };

  const startTest = (test) => {
    if (!studentInfo.name || !studentInfo.className) {
      alert("Iltimos, avval ism-familiyangiz va sinfingizni kiriting!");
      setActiveTab('courses');
      return;
    }
    let testQuestions = [...test.questions];
    if (test.shuffle) {
      testQuestions = testQuestions.sort(() => Math.random() - 0.5);
    }
    setActiveTest({ ...test, questions: testQuestions });
    setCurrentQuestionIndex(0);
    setStudentAnswers({});
    setTimeLeft(testQuestions[0]?.timer || 30);
    setActiveTab('take-test');
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeTest.questions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      setTimeLeft(activeTest.questions[nextIdx].timer || 30);
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    let totalScore = 0;
    let maxScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;

    activeTest.questions.forEach((q, idx) => {
      maxScore += q.points;
      if (studentAnswers[idx] === q.correct) {
        totalScore += q.points;
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    let grade = "Qoniqarsiz";
    if (percentage >= 85) grade = "A'lo (5)";
    else if (percentage >= 70) grade = "Yaxshi (4)";
    else if (percentage >= 50) grade = "Qoniqarli (3)";

    const resultData = {
      student: studentInfo,
      testTitle: activeTest.title,
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

  const handleAddTempQuestion = (e) => {
    e.preventDefault();
    if (!questionText || options.some(opt => !opt)) {
      alert("Savol matni va barcha 4 ta variantni to'ldiring!");
      return;
    }

    const newQ = {
      id: Date.now(),
      question: questionText,
      options: [...options],
      correct: Number(correctOption),
      points: Number(questionPoints),
      timer: Number(questionTimer),
      explanation: questionExplanation
    };

    setTempQuestions([...tempQuestions, newQ]);
    setQuestionText('');
    setOptions(['', '', '', '']);
    setQuestionExplanation('');
    alert("Savol vaqtincha qo'shildi. Testni saqlash uchun 'Testni To'liq Saqlash' tugmasini bosing.");
  };

  const handleSaveNewTest = () => {
    if (!newTestTitle || tempQuestions.length === 0) {
      alert("Test sarlavhasini kiriting va kamida 1 ta savol qo'shing!");
      return;
    }

    const newTestObj = {
      id: Date.now(),
      title: newTestTitle,
      duration: Number(newTestDuration),
      shuffle: newTestShuffle,
      questions: tempQuestions
    };

    const currentSub = subjectsData[selectedSubject];
    const updated = {
      ...subjectsData,
      [selectedSubject]: {
        ...currentSub,
        tests: [...currentSub.tests, newTestObj]
      }
    };

    setSubjectsData(updated);
    setNewTestTitle('');
    setTempQuestions([]);
    alert("Yangi test muvaffaqiyatli yaratildi va fanga qo'shildi!");
  };

  const currentData = subjectsData[selectedSubject] || { teacher: '', videos: [], tests: [] };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-gray-200 mb-8 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">🎓 O'qituvchi va o'quvchilar hamkorligi</h1>
          <p className="text-gray-600">Maktab bazasidagi maxsus o'quv kurslari, dars jadvallari, videodarslar va testlar markazi.</p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button 
              onClick={() => setActiveTab('test-admin')}
              className="px-4 py-2.5 bg-orange-600 text-white font-bold rounded-xl text-sm hover:bg-orange-700 transition shadow-md"
            >
              📝 Testlar va Natijalar (Admin)
            </button>
          )}

          {!isAdmin ? (
            <button 
              onClick={() => setShowAdminLogin(true)}
              className="px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl text-sm hover:bg-gray-800 transition shadow-md"
            >
              ⚙️ Admin boshqaruvi
            </button>
          ) : (
            <button 
              onClick={() => { setIsAdmin(false); setActiveTab('courses'); }}
              className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl text-sm hover:bg-red-700 transition shadow-md"
            >
              🚪 Admin rejimidan chiqish
            </button>
          )}
        </div>
      </div>

      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Admin tizimiga kirish</h3>
            <form onSubmit={handleAdminLogin}>
              <input 
                type="password"
                placeholder="Admin parolini kiriting (admin2026)..."
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAdminLogin(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-500 transition font-bold"
                >
                  Kirish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAdmin && activeTab !== 'test-admin' && (
        <div className="bg-orange-50 border-2 border-orange-200 p-6 rounded-3xl mb-10 shadow-lg space-y-6">
          <h2 className="text-xl font-black text-orange-900 flex items-center gap-2">
            <span>🛠</span> LMS va dars jadvalini boshqarish (Admin Panel)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <form onSubmit={handleAddSubject} className="bg-white p-5 rounded-2xl border border-orange-200 space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">➕ Yangi Fan Qo'shish</h3>
              <input
                type="text"
                placeholder="Fan nomi (masalan: Kimyo)"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="O'qituvchi F.I.Sh."
                value={newTeacherName}
                onChange={(e) => setNewTeacherName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <button type="submit" className="w-full py-2 bg-orange-600 text-white font-bold text-xs rounded-xl hover:bg-orange-700">
                Fanni ro'yxatga qo'shish
              </button>
            </form>

            <form onSubmit={handleAddVideo} className="bg-white p-5 rounded-2xl border border-orange-200 space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">📹 [{selectedSubject}] Faniga Dars/Video Qo'shish</h3>
              <input
                type="text"
                placeholder="Dars sarlavhasi"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Davomiyligi (masalan: 40 min)"
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
                <input
                  type="url"
                  placeholder="Video linki (YouTube)"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <button type="submit" className="w-full py-2 bg-orange-600 text-white font-bold text-xs rounded-xl hover:bg-orange-700">
                Videodarsni Joylash
              </button>
            </form>
          </div>

          <form onSubmit={handleAddSchedule} className="bg-white p-5 rounded-2xl border border-orange-200 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm">📅 Yangi Dars Jadvali Kiriting</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                value={schedDay}
                onChange={(e) => setSchedDay(e.target.value)}
                className="px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value="Dushanba">Dushanba</option>
                <option value="Seshanba">Seshanba</option>
                <option value="Chorshanba">Chorshanba</option>
                <option value="Payshanba">Payshanba</option>
                <option value="Juma">Juma</option>
                <option value="Shanba">Shanba</option>
              </select>

              <input
                type="text"
                placeholder="Sinf (masalan: 9-A)"
                value={schedClass}
                onChange={(e) => setSchedClass(e.target.value)}
                required
                className="px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />

              <input
                type="text"
                placeholder="Fanlar ro'yxati (masalan: Matematika, Fizika...)"
                value={schedSubjects}
                onChange={(e) => setSchedSubjects(e.target.value)}
                required
                className="px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
            <button type="submit" className="w-full py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700">
              Jadvalni e'lon qilish
            </button>
          </form>
        </div>
      )}

      {activeTab !== 'take-test' && activeTab !== 'result' && activeTab !== 'test-admin' && (
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-3 rounded-2xl font-bold transition-all shadow-md text-sm ${
              activeTab === 'courses' ? 'bg-orange-600 text-white shadow-orange-500/30' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📚 Fanlar va o'quv kurslari
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-6 py-3 rounded-2xl font-bold transition-all shadow-md text-sm ${
              activeTab === 'schedule' ? 'bg-orange-600 text-white shadow-orange-500/30' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📅 Maktab Dars Jadvali
          </button>
        </div>
      )}

      {activeTab === 'courses' && (
        <div>
          <div className="flex flex-wrap gap-3 mb-8">
            {Object.keys(subjectsData).map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-sm ${
                  selectedSubject === sub
                    ? 'bg-orange-600 text-white shadow-orange-500/30 scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedSubject} fani bo'yicha kurslar</h2>
                <p className="text-sm text-orange-600 font-semibold mb-6">O'qituvchi: {currentData.teacher}</p>
                
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📹</span> Videodarslar ro'yxati
                </h3>
                
                {currentData.videos.length === 0 ? (
                  <div className="p-6 bg-gray-50 rounded-2xl text-center text-gray-500 text-sm">
                    Ushbu fan bo'yicha hali videodarslar joylanmagan.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentData.videos.map((vid, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-orange-50 transition">
                        <div>
                          <h4 className="font-bold text-gray-900">{vid.title}</h4>
                          <span className="text-xs text-gray-500">Davomiyligi: {vid.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <a href={vid.link} target="_blank" rel="noreferrer" className="px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl hover:bg-orange-700 transition">
                            Ko'rish ➔
                          </a>
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteVideo(selectedSubject, idx)}
                              className="px-3 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition"
                            >
                              🗑
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">✍️ Test topshirish uchun kirish</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Ism va Familiyangiz</label>
                    <input 
                      type="text" 
                      placeholder="Masalan: Sherzod Amanov"
                      value={studentInfo.name}
                      onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Sinfingiz</label>
                    <input 
                      type="text" 
                      placeholder="Masalan: 9-A"
                      value={studentInfo.className}
                      onChange={(e) => setStudentInfo({ ...studentInfo, className: e.target.value })}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📝</span> {selectedSubject} — Onlayn testlar
                </h3>
                {currentData.tests.length === 0 ? (
                  <div className="p-6 bg-gray-50 rounded-2xl text-center text-gray-500 text-sm">
                    Hozircha bu fandan testlar mavjud emas.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentData.tests.map((test) => (
                      <div key={test.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm mb-1">{test.title}</h4>
                          <span className="text-xs text-gray-500 block mb-3">Savollar soni: {test.questions.length} ta | Vaqt: {test.duration} min</span>
                        </div>
                        <button 
                          onClick={() => startTest(test)} 
                          className="w-full py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition shadow-sm"
                        >
                          🚀 Testni boshlash
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>📅</span> Maktab haftalik dars jadvali
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedules.map((item) => (
              <div key={item.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-black rounded-full">
                      {item.day}
                    </span>
                    <span className="font-black text-gray-900 text-lg">
                      {item.classNum} sinf
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed font-semibold">
                    {item.subjects}
                  </p>
                </div>

                {isAdmin && (
                  <div className="mt-4 pt-3 border-t border-gray-200 text-right">
                    <button
                      onClick={() => handleDeleteSchedule(item.id)}
                      className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700"
                    >
                      🗑 Jadvalni o'chirish
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'take-test' && activeTest && (
        <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{activeTest.title}</h2>
              <p className="text-xs text-gray-500">O'quvchi: {studentInfo.name} ({studentInfo.className} sinf)</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 block">Qolgan vaqt:</span>
              <span className="text-xl font-black text-orange-600 animate-pulse">{timeLeft}s</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
              <span>Savol {currentQuestionIndex + 1} / {activeTest.questions.length}</span>
              <span>Ball: {activeTest.questions[currentQuestionIndex].points}</span>
            </div>
            <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-orange-600 h-2.5 transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / activeTest.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-6">
            {activeTest.questions[currentQuestionIndex].question}
          </h3>

          <div className="space-y-3 mb-8">
            {activeTest.questions[currentQuestionIndex].options.map((option, idx) => (
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
            {currentQuestionIndex < activeTest.questions.length - 1 ? "Keyingi savol →" : "Testni yakunlash va topshirish ✓"}
          </button>
        </div>
      )}

      {activeTab === 'result' && testResult && (
        <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200 text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-inner">
            🏆
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-1">Test Yakunlandi!</h2>
          <p className="text-gray-600 mb-6">{testResult.student.name} ({testResult.student.className} sinf), natijangiz:</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <span className="text-xs text-gray-500 block">Umumiy ball</span>
              <span className="text-2xl font-black text-gray-900">{testResult.totalScore} / {testResult.maxScore}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <span className="text-xs text-gray-500 block">Foiz ko'rsatkichi</span>
              <span className="text-2xl font-black text-orange-600">{testResult.percentage}%</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <span className="text-xs text-gray-500 block">To'g'ri / Xato</span>
              <span className="text-xl font-bold text-emerald-600">{testResult.correctCount}</span> / <span className="text-xl font-bold text-rose-600">{testResult.incorrectCount}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <span className="text-xs text-gray-500 block">Bahokorlik</span>
              <span className="text-lg font-black text-blue-600">{testResult.grade}</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('courses')}
            className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg transition"
          >
            ← Bosh sahifaga qaytish
          </button>
        </div>
      )}

      {isAdmin && activeTab === 'test-admin' && (
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200 space-y-10">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-black text-gray-900">⚙️ Testlarni Boshqarish va Yaratish</h2>
              <p className="text-sm text-gray-600">O'qituvchilar uchun savollar qo'shish va natijalarni ko'rish paneli.</p>
            </div>
            <button 
              onClick={() => setActiveTab('courses')}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl text-xs transition"
            >
              ← Ortga qaytish
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-4">
              <h3 className="text-lg font-bold text-gray-900">➕ Yangi Test Tuzish</h3>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Fan tanlash</label>
                <select 
                  value={selectedSubject} 
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-white border rounded-xl text-sm"
                >
                  {Object.keys(subjectsData).map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Test Nomi</label>
                <input 
                  type="text" 
                  placeholder="Masalan: Ma'lumotlar bazasi asoslari"
                  value={newTestTitle}
                  onChange={(e) => setNewTestTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Davomiyligi (daqiqa)</label>
                  <input 
                    type="number" 
                    value={newTestDuration}
                    onChange={(e) => setNewTestDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-white border rounded-xl text-sm"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                    <input 
                      type="checkbox" 
                      checked={newTestShuffle}
                      onChange={(e) => setNewTestShuffle(e.target.checked)}
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                    Savollarni almashtirish (Shuffle)
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <h4 className="font-bold text-sm text-gray-800">Testga savol qo'shish (Hozircha: {tempQuestions.length} ta)</h4>
                
                <input 
                  type="text" 
                  placeholder="Savol matnini kiriting..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full px-3 py-2 bg-white border rounded-xl text-sm"
                />

                <div className="grid grid-cols-2 gap-2">
                  {options.map((opt, idx) => (
                    <input 
                      key={idx}
                      type="text" 
                      placeholder={`${idx + 1}-variant`}
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...options];
                        newOpts[idx] = e.target.value;
                        setOptions(newOpts);
                      }}
                      className="px-3 py-2 bg-white border rounded-xl text-xs"
                    />
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-1">To'g'ri variant (0-3)</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="3" 
                      value={correctOption}
                      onChange={(e) => setCorrectOption(e.target.value)}
                      className="w-full px-3 py-2 bg-white border rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-1">Ball</label>
                    <input 
                      type="number" 
                      value={questionPoints}
                      onChange={(e) => setQuestionPoints(e.target.value)}
                      className="w-full px-3 py-2 bg-white border rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-1">Vaqt (soniya)</label>
                    <input 
                      type="number" 
                      value={questionTimer}
                      onChange={(e) => setQuestionTimer(e.target.value)}
                      className="w-full px-3 py-2 bg-white border rounded-xl text-xs"
                    />
                  </div>
                </div>

                <input 
                  type="text" 
                  placeholder="To'g'ri javob uchun izoh (tushuntirish)"
                  value={questionExplanation}
                  onChange={(e) => setQuestionExplanation(e.target.value)}
                  className="w-full px-3 py-2 bg-white border rounded-xl text-xs"
                />

                <button 
                  type="button"
                  onClick={handleAddTempQuestion}
                  className="w-full py-2 bg-gray-800 text-white font-bold text-xs rounded-xl hover:bg-gray-900 transition"
                >
                  + Savolni qo'shish
                </button>
              </div>

              <button 
                type="button"
                onClick={handleSaveNewTest}
                className="w-full py-3 bg-orange-600 text-white font-bold text-sm rounded-xl hover:bg-orange-700 shadow-md transition mt-4"
              >
                💾 Testni To'liq Saqlash va E'lon Qilish
              </button>
            </div>

            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📊 O'quvchilar Natijalari Jurnali</h3>
              {submissions.length === 0 ? (
                <p className="text-sm text-gray-500">Hozircha test topshirgan o'quvchilar yo'q.</p>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {submissions.map((sub, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-2xl border border-gray-200 text-sm flex justify-between items-center shadow-xs">
                      <div>
                        <span className="font-bold text-gray-900 block">{sub.student.name} ({sub.student.className} sinf)</span>
                        <span className="text-xs text-gray-500 block">{sub.testTitle}</span>
                        <span className="text-[10px] text-gray-400">{sub.date}</span>
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
  );
}
import React, { useState, useEffect } from 'react';

export default function Collaboration() {
  const initialSchedules = [
    { id: 1, day: 'Duşanba', classNum: '9-A', subjects: 'Matematika, Fizika, Informatika, Ingliz tili' },
    { id: 2, day: 'Seşanba', classNum: '9-A', subjects: 'Informatika (Robototexnika), Kimyo, Biologiya, Tarix' },
    { id: 3, day: 'Chorşanba', classNum: '10-B', subjects: 'Matematika (Algebra), Ona tili, Fizika, Geometriya' }
  ];

  const initialSubjects = {
    Matematika: {
      teacher: "K. Mamadiyorov (Oliy toifali öqituvçi)",
      videos: [
        { title: '1-mavzu: Hosila va uning tatbiqi', duration: '45 min', link: '#' },
        { title: '2-mavzu: Integrallar va yuzlarni hisoblaş', duration: '50 min', link: '#' }
      ],
      tests: [
        { 
          id: 101,
          title: '1-bosqiç test nazorati', 
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
              explanation: "Matematik qoidaga köra avval köpaytiriş bajariladi: 2 * 2 = 4, keyin qo'shiladi: 2 + 4 = 6."
            }
          ]
        }
      ]
    },
    Informatika: {
      teacher: 'Ş. Amanov (IT mutaxassisi)',
      videos: [
        { title: 'Python dasturlaş tiliga kiriş', duration: '60 min', link: '#' },
        { title: 'LEGO EV3 Pybricks MicroPython asoslari', duration: '40 min', link: '#' }
      ],
      tests: [
        { 
          id: 102,
          title: "Python asoslari böyiça test", 
          duration: 15, 
          shuffle: false,
          questions: [
            {
              id: 1,
              question: "Python dasturlaş tilida ekranga matn çiqariş uçun qaysi funksiya işlatiladi?",
              options: ["print()", "echo()", "cout <<", "Console.WriteLine()"],
              correct: 0,
              points: 10,
              timer: 30,
              explanation: "Python-da ekranga ma'lumot çiqariş uçun print() funksiyasi qöllaniladi."
            },
            {
              id: 2,
              question: "Quyidagilardan qaysi biri özgaruvchi nomi böla olmaydi?",
              options: ["my_var", "_variable", "123var", "var123"],
              correct: 2,
              points: 10,
              timer: 30,
              explanation: "Özgaruvçi nomlari raqam bilan boşlanişi taqiqlangan."
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

  const [schedDay, setSchedDay] = useState('Duşanba');
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

  const [editingTestId, setEditingTestId] = useState(null);
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

  const handleDeleteSubmission = (indexToDelete) => {
    if (window.confirm("Uşbu öquvçi natijasini haqiqatan ham öçirmoqçimisiz?")) {
      const updatedSubmissions = submissions.filter((_, index) => index !== indexToDelete);
      setSubmissions(updatedSubmissions);
    }
  };

  const handleClearAllSubmissions = () => {
    if (window.confirm("Barça öquvçilar natijalarini tozalab taşlamoqçimisiz?")) {
      setSubmissions([]);
    }
  };

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
      alert("Bu fan allaqaçon mavjud!");
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
    alert("Yangi fan muvaffaqiyatli qöşildi!");
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
    alert("Videodars muvaffaqiyatli qöşildi!");
  };

  const handleDeleteVideo = (subjectName, videoIndex) => {
    if (window.confirm("Uşbu videoni öçirmoqçimisiz?")) {
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
    if (window.confirm("Uşbu dars jadvalini öçirmoqçimisiz?")) {
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
    else if (percentage >= 70) grade = "Yaxşi (4)";
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
      alert("Savol matni va barça 4 ta variantni töldiring!");
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
    alert("Savol qöşildi!");
  };

  const handleSaveNewTest = () => {
    if (!newTestTitle || tempQuestions.length === 0) {
      alert("Test sarlavhasini kiriting va kamida 1 ta savol qöşing!");
      return;
    }

    const currentSub = subjectsData[selectedSubject];
    let updatedTests = [...currentSub.tests];

    if (editingTestId) {
      updatedTests = updatedTests.map(t => 
        t.id === editingTestId 
          ? { ...t, title: newTestTitle, duration: Number(newTestDuration), shuffle: newTestShuffle, questions: tempQuestions }
          : t
      );
      alert("Test muvaffaqiyatli tahrirlandi!");
    } else {
      const newTestObj = {
        id: Date.now(),
        title: newTestTitle,
        duration: Number(newTestDuration),
        shuffle: newTestShuffle,
        questions: tempQuestions
      };
      updatedTests.push(newTestObj);
      alert("Yangi test muvaffaqiyatli yaratildi!");
    }

    const updated = {
      ...subjectsData,
      [selectedSubject]: {
        ...currentSub,
        tests: updatedTests
      }
    };

    setSubjectsData(updated);
    setNewTestTitle('');
    setTempQuestions([]);
    setEditingTestId(null);
  };

  const handleEditTest = (test) => {
    setEditingTestId(test.id);
    setNewTestTitle(test.title);
    setNewTestDuration(test.duration);
    setNewTestShuffle(test.shuffle);
    setTempQuestions([...test.questions]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTest = (testId) => {
    if (window.confirm("Haqiqatan ham uşbu testni öçirmoqçimisiz?")) {
      const currentSub = subjectsData[selectedSubject];
      const updatedTests = currentSub.tests.filter(t => t.id !== testId);
      const updated = {
        ...subjectsData,
        [selectedSubject]: {
          ...currentSub,
          tests: updatedTests
        }
      };
      setSubjectsData(updated);
    }
  };

  const currentData = subjectsData[selectedSubject] || { teacher: '', videos: [], tests: [] };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-gray-200 mb-8 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">🎓 Öqituvçi va öquvçilar hamkorligi</h1>
          <p className="text-gray-600">Maktab bazasidagi maxsus öquv kurslari, dars jadvallari, videodarslar va testlar markazi.</p>
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
              ⚙️ Admin boşqaruvi
            </button>
          ) : (
            <button 
              onClick={() => { setIsAdmin(false); setActiveTab('courses'); }}
              className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl text-sm hover:bg-red-700 transition shadow-md"
            >
              🚪 Admin rejimidan çiqiş
            </button>
          )}
        </div>
      </div>

      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Admin tizimiga kiriş</h3>
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
                  Bekor qiliş
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-500 transition font-bold"
                >
                  Kiriş
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAdmin && activeTab !== 'test-admin' && (
        <div className="bg-orange-50 border-2 border-orange-200 p-6 rounded-3xl mb-10 shadow-lg space-y-6">
          <h2 className="text-xl font-black text-orange-900 flex items-center gap-2">
            <span>🛠</span> LMS va dars jadvalini boşqariş (Admin Panel)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form onSubmit={handleAddSubject} className="bg-white p-5 rounded-2xl border border-orange-200 space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">➕ Yangi fan qöşiş</h3>
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
                placeholder="Öqituvçi F.I.Ş."
                value={newTeacherName}
                onChange={(e) => setNewTeacherName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <button type="submit" className="w-full py-2 bg-orange-600 text-white font-bold text-xs rounded-xl hover:bg-orange-700">
                Fanni röyxatga qöşiş
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
                Videodarsni joylaş
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
                <option value="Duşanba">Duşanba</option>
                <option value="Seşanba">Seşanba</option>
                <option value="Chorşanba">Chorşanba</option>
                <option value="Payşanba">Payşanba</option>
                <option value="Juma">Juma</option>
                <option value="Şanba">Şanba</option>
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
                placeholder="Fanlar röyxati (masalan: Matematika, Fizika...)"
                value={schedSubjects}
                onChange={(e) => setSchedSubjects(e.target.value)}
                required
                className="px-3 py-2 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
            <button type="submit" className="w-full py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700">
              Jadvalni e'lon qiliş
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
            📚 Fanlar va öquv kurslari
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
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedSubject} fani böyiça kurslar</h2>
                <p className="text-sm text-orange-600 font-semibold mb-6">Öqituvçi: {currentData.teacher}</p>
                
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📹</span> Videodarslar röyxati
                </h3>
                
                {currentData.videos.length === 0 ? (
                  <div className="p-6 bg-gray-50 rounded-2xl text-center text-gray-500 text-sm">
                    Uşbu fan böyiça hali videodarslar joylanmagan.
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
                            Köriş ➔
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
                <h3 className="text-lg font-bold text-gray-900 mb-4">✍️ Test topşiriş uçun kiriş</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Ism va Familiyangiz</label>
                    <input 
                      type="text" 
                      placeholder="Masalan: Şerzod Amanov"
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
                    Hozirça bu fandan testlar mavjud emas.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentData.tests.map((test) => (
                      <div key={test.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm mb-1">{test.title}</h4>
                          <span className="text-xs text-gray-500 block mb-3">Savollar soni: {test.questions.length} ta | Vaqt: {test.duration} min</span>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => startTest(test)} 
                            className="flex-1 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition shadow-sm"
                          >
                            🚀 Boşlaş
                          </button>
                          {isAdmin && (
                            <>
                              <button 
                                onClick={() => { setActiveTab('test-admin'); handleEditTest(test); }} 
                                className="px-3 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition"
                                title="Tahrirlash"
                              >
                                ✏️
                              </button>
                              <button 
                                onClick={() => handleDeleteTest(test.id)} 
                                className="px-3 py-2.5 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition"
                                title="O'chirish"
                              >
                                🗑
                              </button>
                            </>
                          )}
                        </div>
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
                      🗑 Jadvalni öçiriş
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
              <p className="text-xs text-gray-500">Öquvçi: {studentInfo.name} ({studentInfo.className} sinf)</p>
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

          <div className="mb-8">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              {activeTest.questions[currentQuestionIndex].question}
            </h3>
            <div className="space-y-3">
              {activeTest.questions[currentQuestionIndex].options.map((opt, optIdx) => (
                <button
                  key={optIdx}
                  onClick={() => setStudentAnswers({ ...studentAnswers, [currentQuestionIndex]: optIdx })}
                  className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition ${
                    studentAnswers[currentQuestionIndex] === optIdx
                      ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                      : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition shadow-lg text-sm"
            >
              {currentQuestionIndex < activeTest.questions.length - 1 ? 'Keyingi savol ➔' : 'Testni yakunlaş 🏁'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'result' && testResult && (
        <div className="max-w-xl mx-auto bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200 text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">
            🎉
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">Test yakunlandi!</h2>
            <p className="text-sm text-gray-600">{testResult.student.name} ({testResult.student.className} sinf)</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 grid grid-cols-2 gap-4 text-left">
            <div>
              <span className="text-xs text-gray-500 block">Töplagan balingiz:</span>
              <span className="text-xl font-black text-gray-900">{testResult.totalScore} / {testResult.maxScore}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Foiz körsatkichi:</span>
              <span className="text-xl font-black text-orange-600">{testResult.percentage}%</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Bahoingiz:</span>
              <span className="text-lg font-bold text-emerald-600">{testResult.grade}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Tög'ri / Nötög'ri:</span>
              <span className="text-sm font-bold text-gray-800">{testResult.correctCount} ta / {testResult.incorrectCount} ta</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('courses')}
            className="w-full py-3.5 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition shadow-lg text-sm"
          >
            Asosiy sahifaga qaytiş 🏠
          </button>
        </div>
      )}

      {isAdmin && activeTab === 'test-admin' && (
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200 space-y-8">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">📝 Test yaratış va Natijalar jurnali</h2>
              <p className="text-xs text-gray-500">[{selectedSubject}] fani uçun test tuziş va öquvçilar natijalarini boşqariş</p>
            </div>
            <button
              onClick={() => setActiveTab('courses')}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-200 transition"
            >
              ← Kurslarga qaytiş
            </button>
          </div>

          <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-200 space-y-4">
            <h3 className="font-bold text-orange-900 text-base">
              {editingTestId ? '✏️ Testni tahrirläş' : '➕ Yangi test yaratış'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Test sarlavhasi (masalan: 1-bosqiç nazorati)"
                value={newTestTitle}
                onChange={(e) => setNewTestTitle(e.target.value)}
                className="px-3 py-2 bg-white border rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none md:col-span-1"
              />
              <input
                type="number"
                placeholder="Vaqti (minut)"
                value={newTestDuration}
                onChange={(e) => setNewTestDuration(e.target.value)}
                className="px-3 py-2 bg-white border rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              <label className="flex items-center gap-2 px-3 py-2 bg-white border rounded-xl text-xs font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newTestShuffle}
                  onChange={(e) => setNewTestShuffle(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500"
                />
                Savollarni aralaştiriş (Shuffle)
              </label>
            </div>

            <div className="bg-white p-4 rounded-xl border border-orange-100 space-y-3">
              <h4 className="font-bold text-gray-800 text-xs">Savol va javob variantlarini qöşiş (Jami qöşilgan: {tempQuestions.length} ta)</h4>
              
              <textarea
                placeholder="Savol matnini kiriting..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                rows="2"
              ></textarea>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOpt"
                      checked={correctOption === oIdx}
                      onChange={() => setCorrectOption(oIdx)}
                      title="Tög'ri javob sifatida belgiläş"
                    />
                    <input
                      type="text"
                      placeholder={`${oIdx + 1}-variant`}
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...options];
                        newOpts[oIdx] = e.target.value;
                        setOptions(newOpts);
                      }}
                      className="w-full px-3 py-1.5 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Izoh (neça ball, tüşuntiriş...)"
                  value={questionExplanation}
                  onChange={(e) => setQuestionExplanation(e.target.value)}
                  className="px-3 py-1.5 bg-gray-50 border rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTempQuestion}
                  className="py-2 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-gray-800 transition"
                >
                  + Savolni röyxatga qöşiş
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveNewTest}
              className="w-full py-3 bg-orange-600 text-white font-bold text-sm rounded-xl hover:bg-orange-700 transition shadow-md"
            >
              {editingTestId ? '💾 Özgarişlarni saqlaş' : '🚀 Testni butunlay saqlaş va e\'lon qiliş'}
            </button>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                📊 Öquvçilar natijalari Jurnali
              </h3>
              {submissions.length > 0 && (
                <button
                  onClick={handleClearAllSubmissions}
                  className="px-3 py-1.5 bg-red-100 text-red-600 font-bold rounded-xl text-xs hover:bg-red-200 transition"
                >
                  🧹 Barçasini tozaläş
                </button>
              )}
            </div>

            {submissions.length === 0 ? (
              <p className="text-gray-500 text-center py-6 text-sm bg-gray-50 rounded-2xl border">Hali hiç qanday natijalar mavjud emas.</p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {submissions.map((sub, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex justify-between items-center hover:bg-orange-50 transition">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {sub.student.name} ({sub.student.className} sinf)
                      </h4>
                      <p className="text-xs text-gray-500">{sub.testTitle} | {sub.date}</p>
                      <div className="mt-1 text-xs">
                        <span className="font-bold text-emerald-600">Tög'ri: {sub.correctCount}</span> | 
                        <span className="font-bold text-red-500 ml-1">Nötög'ri: {sub.incorrectCount}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="font-black text-orange-600 text-base">{sub.totalScore} ball ({sub.percentage}%)</span>
                        <span className="block text-xs font-semibold text-gray-600">{sub.grade}</span>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteSubmission(idx)}
                        className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition text-xs shadow-sm"
                        title="Natijani öçiriş"
                      >
                        🗑
                      </button>
                    </div>
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
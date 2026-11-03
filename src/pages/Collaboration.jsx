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
              explanation: "Matematik qoidaga köra avval köpaytiriş bajariladi: 2 * 2 = 4, keyin qöshiladi: 2 + 4 = 6."
            }
          ]
        }
      ]
    },
    Informatika: {
      teacher: 'Sh. Amanov (IT mutaxassisi)',
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

  // Test yaratish va tahrirlash state-lari
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

  // Natijalarni öchirish funksiyalari (Töğri joyga qöyildi)
  const handleDeleteSubmission = (indexToDelete) => {
    if (window.confirm("Ushbu öquvchi natijasini haqiqatan ham öchirmoqchimisiz?")) {
      const updatedSubmissions = submissions.filter((_, index) => index !== indexToDelete);
      setSubmissions(updatedSubmissions);
    }
  };

  const handleClearAllSubmissions = () => {
    if (window.confirm("Barcha öquvchilar natijalarini tozalab tashlamoqchimisiz?")) {
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
    alert("Yangi fan muvaffaqiyatli qöshildi!");
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
    alert("Videodars muvaffaqiyatli qöshildi!");
  };

  const handleDeleteVideo = (subjectName, videoIndex) => {
    if (window.confirm("Ushbu videoni öchirmoqchimisiz?")) {
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
    if (window.confirm("Ushbu dars jadvalini öchirmoqchimisiz?")) {
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

  const currentData = subjectsData[selectedSubject] || { teacher: '', videos: [], tests: [] };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-gray-200 mb-8 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">🎓 Öqituvchi va öquvchilar hamkorligi</h1>
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

      {/* Admin Panel va boşqa qismlar davomi... */}
    </div>
  );
}
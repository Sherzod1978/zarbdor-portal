import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';

export default function AdminPanel({ onBackToSite }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  
  // Ma'lumotlar state-lari (Firebase'dan o'qiladi)
  const [subjectsData, setSubjectsData] = useState({});
  const [schedules, setSchedules] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const [activeSection, setActiveSection] = useState('tests'); // 'tests', 'schedules', 'submissions'

  // Forma state-lari
  const [selectedSubject, setSelectedSubject] = useState('Informatika');
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
  const [editingTestId, setEditingTestId] = useState(null);

  // 1. Sahifa ochilganda Firebase'dan ma'lumotlarni yuklab olish
  useEffect(() => {
    const fetchFirebaseData = async () => {
      try {
        const docRef = doc(db, "portal", "schoolData");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.subjects) setSubjectsData(data.subjects);
          if (data.schedules) setSchedules(data.schedules);
          if (data.submissions) setSubmissions(data.submissions);
        }
      } catch (err) {
        console.error("Firebase'dan ma'lumot olishda xatolik:", err);
      }
    };
    fetchFirebaseData();
  }, []);

  // 2. Ma'lumotlarni Firebase'ga saqlash funksiyasi
  const saveToFirebase = async (updatedSubjects, updatedSchedules, updatedSubmissions) => {
    try {
      await setDoc(doc(db, "portal", "schoolData"), { 
        subjects: updatedSubjects,
        schedules: updatedSchedules,
        submissions: updatedSubmissions
      });
      console.log("Firebase'ga muvaffaqiyatli saqlandi!");
    } catch (err) {
      console.error("Firebase'ga saqlashda xatolik:", err);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminPass === 'admin2026') {
      setIsAdminLoggedIn(true);
      setAdminPass('');
    } else {
      alert("Admin paroli xato!");
    }
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
    alert("Savol vaqtincha qo'shildi!");
  };

  const handleSaveNewTest = () => {
    if (!newTestTitle || tempQuestions.length === 0) {
      alert("Test sarlavhasini kiriting va kamida 1 ta savol qo'shing!");
      return;
    }

    const currentSub = subjectsData[selectedSubject] || { teacher: "O'qituvchi", videos: [], tests: [] };
    let updatedTests = [...(currentSub.tests || [])];

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
      alert("Yangi test yaratildi!");
    }

    const updatedSubjects = {
      ...subjectsData,
      [selectedSubject]: {
        ...currentSub,
        tests: updatedTests
      }
    };

    setSubjectsData(updatedSubjects);
    saveToFirebase(updatedSubjects, schedules, submissions);

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
  };

  const handleDeleteTest = (testId) => {
    if (window.confirm("Testni o'chirmoqchimisiz?")) {
      const currentSub = subjectsData[selectedSubject];
      const updatedTests = currentSub.tests.filter(t => t.id !== testId);
      const updatedSubjects = {
        ...subjectsData,
        [selectedSubject]: { ...currentSub, tests: updatedTests }
      };
      setSubjectsData(updatedSubjects);
      saveToFirebase(updatedSubjects, schedules, submissions);
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-800">
          <div className="text-center mb-6">
            <span className="text-4xl">🔐</span>
            <h2 className="text-2xl font-black text-gray-900 mt-2">Admin Portal</h2>
            <p className="text-xs text-gray-500">Zarbdor IM boshqaruv markazi</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password"
              placeholder="Admin parolini kiriting..."
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <button 
              type="submit" 
              className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-lg transition"
            >
              Tizimga kirish
            </button>
            <button 
              type="button"
              onClick={onBackToSite}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition text-sm"
            >
              ← Asosiy saytga qaytish
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">⚙️ Admin boshqaruv paneli</h1>
            <p className="text-xs text-gray-500">Subdomain: admin.zarbdor-im.uz (Firebase Cloud Connected)</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsAdminLoggedIn(false)}
              className="px-4 py-2.5 bg-red-100 text-red-600 font-bold rounded-xl text-xs hover:bg-red-200 transition"
            >
              Chiqish
            </button>
            <button 
              onClick={onBackToSite}
              className="px-4 py-2.5 bg-gray-900 text-white font-bold rounded-xl text-xs hover:bg-gray-800 transition"
            >
              Saytni ko'rish ↗
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-3">
          <button
            onClick={() => setActiveSection('tests')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition shadow-sm ${
              activeSection === 'tests' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📝 Testlarni boshqarish
          </button>
          <button
            onClick={() => setActiveSection('submissions')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition shadow-sm ${
              activeSection === 'submissions' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📊 O'quvchilar natijalari ({submissions.length})
          </button>
        </div>

        {/* Main Content Area */}
        {activeSection === 'tests' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Test Tuzish Formasi */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 space-y-5">
              <h3 className="text-lg font-black text-gray-900">
                {editingTestId ? "✏️ Testni Tahrirlash" : "➕ Yangi test qo'shish"}
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Fan</label>
                <select 
                  value={selectedSubject} 
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-3 bg-gray-50 border rounded-xl text-sm"
                >
                  {Object.keys(subjectsData).length > 0 ? (
                    Object.keys(subjectsData).map(sub => <option key={sub} value={sub}>{sub}</option>)
                  ) : (
                    <option value="Informatika">Informatika</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Test Nomi</label>
                <input 
                  type="text" 
                  placeholder="Masalan: Python funksiyalari"
                  value={newTestTitle}
                  onChange={(e) => setNewTestTitle(e.target.value)}
                  className="w-full p-3 bg-gray-50 border rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Vaqt (minut)</label>
                  <input 
                    type="number" 
                    value={newTestDuration}
                    onChange={(e) => setNewTestDuration(e.target.value)}
                    className="w-full p-3 bg-gray-50 border rounded-xl text-sm"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                    <input 
                      type="checkbox" 
                      checked={newTestShuffle}
                      onChange={(e) => setNewTestShuffle(e.target.checked)}
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                    Savolarni aralashtirish
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                <h4 className="font-bold text-xs text-gray-800">Savol qo'shish (Jami: {tempQuestions.length} ta)</h4>
                
                <input 
                  type="text" 
                  placeholder="Savol matni..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full p-3 bg-gray-50 border rounded-xl text-xs"
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
                      className="p-2.5 bg-gray-50 border rounded-xl text-xs"
                    />
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600">To'g'ri (0-3)</label>
                    <input type="number" min="0" max="3" value={correctOption} onChange={(e) => setCorrectOption(e.target.value)} className="w-full p-2.5 border rounded-xl text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600">Ball</label>
                    <input type="number" value={questionPoints} onChange={(e) => setQuestionPoints(e.target.value)} className="w-full p-2.5 border rounded-xl text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600">Vaqt (sek)</label>
                    <input type="number" value={questionTimer} onChange={(e) => setQuestionTimer(e.target.value)} className="w-full p-2.5 border rounded-xl text-xs" />
                  </div>
                </div>

                <input 
                  type="text" 
                  placeholder="Izoh (tushuntirish)"
                  value={questionExplanation}
                  onChange={(e) => setQuestionExplanation(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl text-xs"
                />

                <button 
                  type="button"
                  onClick={handleAddTempQuestion}
                  className="w-full py-2.5 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-gray-800"
                >
                  + Savolni ro'yxatga qo'shish
                </button>
              </div>

              <button 
                type="button"
                onClick={handleSaveNewTest}
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl shadow-lg transition"
              >
                💾 Testni To'liq Saqlash
              </button>
            </div>

            {/* Mavjud Testlar ro'yxati */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 space-y-4">
              <h3 className="text-lg font-black text-gray-900">📚 Mavjud Testlar</h3>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {Object.entries(subjectsData).map(([subName, subObj]) => (
                  <div key={subName} className="space-y-2">
                    <h4 className="text-xs font-black text-orange-600 uppercase tracking-wider">{subName}</h4>
                    {subObj.tests && subObj.tests.map((test) => (
                      <div key={test.id} className="p-4 bg-gray-50 border rounded-2xl flex justify-between items-center text-sm">
                        <div>
                          <span className="font-bold text-gray-900 block">{test.title}</span>
                          <span className="text-xs text-gray-500">Savollar: {test.questions.length} ta | Vaqt: {test.duration} min</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setSelectedSubject(subName); handleEditTest(test); }} className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg">✏️</button>
                          <button onClick={() => { setSelectedSubject(subName); handleDeleteTest(test.id); }} className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg">🗑</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'submissions' && (
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 space-y-6">
            <h3 className="text-lg font-black text-gray-900">📊 O'quvchilar Natijalari Jurnali</h3>
            {submissions.length === 0 ? (
              <p className="text-sm text-gray-500">Hozircha test topshirganlar yo'q.</p>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 border rounded-2xl flex justify-between items-center text-sm">
                    <div>
                      <span className="font-bold text-gray-900 block">{sub.student.name} ({sub.student.className} sinf)</span>
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
        )}

      </div>
    </div>
  );
}
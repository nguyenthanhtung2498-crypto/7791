
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { User, AppStep, Lesson, SetupInfo, UserRole } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [ip, setIp] = useState<string>('27.74.132.60');
  const [currentStep, setCurrentStep] = useState<AppStep>('LOGIN');
  const [initialLessons, setInitialLessons] = useState<Lesson[]>([]);
  const [setupInfo, setSetupInfo] = useState<SetupInfo>({ 
    subject: '', 
    grade: '', 
    examType: '',
    schoolName: 'THCS HUỲNH THÚC KHÁNG - HƯNG THỊNH',
    department: 'TỔ CHUYÊN MÔN',
    examName: '',
    schoolYear: 'NĂM HỌC 2026 - 2027',
    duration: '45 phút',
    testCode: '301',
    difficulty: 'Trung bình',
    mcqCount: 12,
    mcqScore: 0.25,
    tfCount: 2,
    tfScore: 1,
    shortCount: 4,
    shortScore: 0.25,
    essayCount: 1,
    essayScore: 1,
    percentKnow: 40,
    percentUnderstand: 30,
    percentApply: 30
  });

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIp(data.ip))
      .catch(() => setIp('27.74.132.60'));
  }, []);

  const handleLogin = (username: string, role: UserRole) => {
    setUser({ username, ip, role });
    setCurrentStep('SETUP');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentStep('LOGIN');
  };

  const handleSetupComplete = (lessons: Lesson[], info: any) => {
    setInitialLessons(lessons);
    setSetupInfo(prev => ({ 
      ...prev, 
      ...info, 
      examName: `MA TRẬN KIỂM TRA ${info.examType.toUpperCase()} MÔN ${info.subject.toUpperCase()} ${info.grade}`
    }));
    setCurrentStep('CONFIG');
  };

  return (
    <div className="min-h-screen">
      {currentStep === 'LOGIN' ? (
        <Login ip={ip} onLogin={handleLogin} />
      ) : (
        <Dashboard 
          user={user!} 
          onLogout={handleLogout} 
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          onSetupComplete={handleSetupComplete}
          initialLessons={initialLessons}
          setupInfo={setupInfo}
          setSetupInfo={setSetupInfo}
        />
      )}
    </div>
  );
};

export default App;


// Fix: Removed ApiKeyModal and key management UI elements to comply with the rule that the app must not ask for or manage the API key in the UI.
import React, { useState } from 'react';
import { User, AppStep, Lesson, SetupInfo, MatrixRow, Question } from '../types';
import MatrixForm from './MatrixForm';
import SetupStep from './SetupStep';
import MatrixConfig from './MatrixConfig';
import SpecificationTable from './SpecificationTable';
import ExamEditor from './ExamEditor';
import FinalPreview from './FinalPreview';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  LogOut, 
  Bell, 
  SlidersHorizontal,
  User as UserIcon,
  FileText,
  Shield,
  GraduationCap,
  PenTool,
  CheckCircle
} from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  currentStep: AppStep;
  setCurrentStep: (step: AppStep) => void;
  onSetupComplete: (lessons: Lesson[], info: any) => void;
  initialLessons: Lesson[];
  setupInfo: SetupInfo;
  setSetupInfo: (info: SetupInfo) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, onLogout, currentStep, setCurrentStep, onSetupComplete, initialLessons, setupInfo, setSetupInfo 
}) => {
  const [matrixRows, setMatrixRows] = useState<MatrixRow[]>([]);
  const [specData, setSpecData] = useState<any[]>([]);
  const [finalQuestions, setFinalQuestions] = useState<Question[]>([]);

  return (
    <div className="flex h-screen bg-[#f1f5f9]">
      <aside className="w-64 bg-white border-r border-[#e2e8f0] flex flex-col shadow-sm z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0d9488] rounded-xl flex items-center justify-center text-white font-bold italic shadow-lg shadow-[#0d9488]/20">
            BΦ
          </div>
          <div className="font-bold text-[#1e293b] leading-tight text-sm">
            Ứng dụng tạo đề thi<br/><span className="text-[10px] text-[#64748b] font-normal uppercase">Theo công văn 7791</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase px-4 mb-2 tracking-widest">Quy trình thực hiện</div>
          <button
            onClick={() => setCurrentStep('SETUP')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm ${currentStep === 'SETUP' ? 'bg-[#0d9488]/10 text-[#0d9488] font-bold shadow-sm' : 'text-[#64748b] hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={18} />
            1. Chọn bài học
          </button>
          <button
            disabled={initialLessons.length === 0}
            onClick={() => setCurrentStep('CONFIG')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm ${currentStep === 'CONFIG' ? 'bg-[#0d9488]/10 text-[#0d9488] font-bold shadow-sm' : 'text-[#64748b] hover:bg-slate-50 disabled:opacity-30'}`}
          >
            <SlidersHorizontal size={18} />
            2. Cấu hình khung
          </button>
          <button
            disabled={!setupInfo.examName}
            onClick={() => setCurrentStep('MATRIX')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm ${currentStep === 'MATRIX' ? 'bg-[#0d9488]/10 text-[#0d9488] font-bold shadow-sm' : 'text-[#64748b] hover:bg-slate-50 disabled:opacity-30'}`}
          >
            <FileSpreadsheet size={18} />
            3. Ma trận chi tiết
          </button>
          <button
            disabled={matrixRows.length === 0}
            onClick={() => setCurrentStep('SPECIFICATION')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm ${currentStep === 'SPECIFICATION' ? 'bg-[#0d9488]/10 text-[#0d9488] font-bold shadow-sm' : 'text-[#64748b] hover:bg-slate-50 disabled:opacity-30'}`}
          >
            <FileText size={18} />
            4. Bản đặc tả
          </button>
          <button
            disabled={specData.length === 0}
            onClick={() => setCurrentStep('EXAM')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm ${currentStep === 'EXAM' ? 'bg-[#0d9488]/10 text-[#0d9488] font-bold shadow-sm' : 'text-[#64748b] hover:bg-slate-50 disabled:opacity-30'}`}
          >
            <PenTool size={18} />
            5. Tạo đề thi & Đáp án
          </button>
          <button
            disabled={finalQuestions.length === 0}
            onClick={() => setCurrentStep('PREVIEW')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm ${currentStep === 'PREVIEW' ? 'bg-[#0d9488]/10 text-[#0d9488] font-bold shadow-sm' : 'text-[#64748b] hover:bg-slate-50 disabled:opacity-30'}`}
          >
            <CheckCircle size={18} />
            6. Xem & Tải về
          </button>
        </nav>

        <div className="p-4 border-t border-[#e2e8f0] space-y-4 bg-slate-50/50">
          <div className="flex items-center gap-3 px-2 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm relative group overflow-hidden">
            <div className={`absolute top-0 right-0 px-2 py-0.5 text-[8px] font-bold uppercase rounded-bl-lg ${user.role === 'admin' ? 'bg-[#0d9488] text-white' : 'bg-blue-600 text-white'}`}>
              {user.role}
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${user.role === 'admin' ? 'bg-[#0d9488]/10 text-[#0d9488]' : 'bg-blue-600/10 text-blue-600'}`}>
              {user.role === 'admin' ? <Shield size={20} /> : <GraduationCap size={20} />}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-[#1e293b] truncate">{user.username}</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-[10px] text-emerald-500 font-medium">Đang trực tuyến</p>
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm font-bold"
          >
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto flex flex-col relative bg-[#f1f5f9]">
        {/* Top bar fixed color */}
        <div className="bg-[#1e293b] text-white px-8 py-3 flex items-center justify-between text-[11px] font-medium shadow-xl relative z-40">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="bg-[#0d9488] px-2 py-0.5 rounded text-[10px] font-bold uppercase">Cung cấp:</span>
              <span>Tài khoản Canva, ứng dụng hỗ trợ giáo viên</span>
            </div>
          </div>
          <div className="text-right">
             <span className="font-bold text-emerald-400 uppercase tracking-tight">Trung tâm Tin học ứng dụng Bai Digitech</span><br/>
             <span className="opacity-70 text-[10px]">Liên hệ: 0972.300.864 - Thầy Giới</span>
          </div>
        </div>
        
        {/* Marquee */}
        <div className="bg-amber-50 py-2.5 border-b border-amber-200 marquee-container relative z-30 shadow-sm overflow-hidden min-h-[40px] flex items-center">
          <div className="marquee-content inline-block">
            <p className="text-[13px] font-bold text-amber-700 flex items-center gap-3 px-4">
              <Bell size={16} className="fill-amber-700 text-amber-700 shrink-0" />
              <span>THÔNG BÁO QUAN TRỌNG: <span className="font-normal italic text-slate-500">Lên dùng đề cương thầy cô nhé</span></span>
            </p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="bg-white border-b px-8 py-4 flex items-center gap-8 relative z-20 shadow-sm overflow-x-auto">
           {[
             { step: 'SETUP', label: '1. Chọn nội dung' },
             { step: 'CONFIG', label: '2. Ma trận (Phụ lục 1)' },
             { step: 'MATRIX', label: '3. Ma trận chi tiết' },
             { step: 'SPECIFICATION', label: '4. Bản đặc tả (Phụ lục 2)' },
             { step: 'EXAM', label: '5. Đề thi' },
             { step: 'PREVIEW', label: '6. Xem & Tải về' }
           ].map((item, idx) => (
             <React.Fragment key={item.step}>
               <div className={`flex items-center gap-2 text-xs font-bold shrink-0 ${currentStep === item.step ? 'text-[#0d9488]' : 'text-slate-400'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${currentStep === item.step ? 'border-[#0d9488] bg-[#0d9488] text-white' : 'border-slate-300'}`}>
                    {idx + 1}
                  </div>
                  {item.label}
               </div>
               {idx < 5 && <div className="h-px bg-slate-200 w-8 shrink-0"></div>}
             </React.Fragment>
           ))}
        </div>

        <div className="p-8 flex-1">
          {currentStep === 'SETUP' && <SetupStep onComplete={onSetupComplete} />}
          {currentStep === 'CONFIG' && (
            <MatrixConfig 
              setupInfo={setupInfo} 
              userRole={user.role}
              onBack={() => setCurrentStep('SETUP')}
              onNext={(config) => {
                setSetupInfo({ ...setupInfo, ...config });
                setCurrentStep('MATRIX');
              }}
            />
          )}
          {currentStep === 'MATRIX' && (
            <MatrixForm 
              lessons={initialLessons.filter(l => l.selected)} 
              setupInfo={setupInfo} 
              onNext={(rows) => {
                setMatrixRows(rows);
                setCurrentStep('SPECIFICATION');
              }}
            />
          )}
          {currentStep === 'SPECIFICATION' && (
            <SpecificationTable 
              matrixRows={matrixRows} 
              setupInfo={setupInfo} 
              onBack={() => setCurrentStep('MATRIX')}
              onNext={(data) => {
                setSpecData(data);
                setCurrentStep('EXAM');
              }}
            />
          )}
          {currentStep === 'EXAM' && (
            <ExamEditor 
              matrixRows={matrixRows} 
              setupInfo={setupInfo} 
              specData={specData}
              onBack={() => setCurrentStep('SPECIFICATION')}
              onNext={(questions) => {
                setFinalQuestions(questions);
                setCurrentStep('PREVIEW');
              }}
            />
          )}
          {currentStep === 'PREVIEW' && (
            <FinalPreview 
              questions={finalQuestions} 
              setupInfo={setupInfo}
              onBack={() => setCurrentStep('EXAM')}
            />
          )}
        </div>

        <footer className="px-8 py-4 bg-white text-slate-400 flex justify-between items-center text-[10px] border-t border-slate-200 relative z-30">
           <div>
              <p className="font-medium text-slate-500 uppercase tracking-widest">Trung tâm Tin học ứng dụng Bai Digitech | ĐT: 0972.300.864 - Thầy Giới</p>
              <p>© 2026 - Ứng dụng được phát triển bởi Thầy Giới.</p>
           </div>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;

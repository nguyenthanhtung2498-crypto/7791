
import React from 'react';
import { User, AppStep, Lesson, SetupInfo } from '../types';
import MatrixForm from './MatrixForm';
import SetupStep from './SetupStep';
import MatrixConfig from './MatrixConfig';
import { LayoutDashboard, FileSpreadsheet, LogOut, Settings, HelpCircle, Bell, ChevronRight, SlidersHorizontal } from 'lucide-react';

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
  return (
    <div className="flex h-screen bg-[#f1f5f9]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#e2e8f0] flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0d9488] rounded-lg flex items-center justify-center text-white font-bold italic">
            BΦ
          </div>
          <div className="font-bold text-[#1e293b] leading-tight text-sm">
            Ứng dụng tạo đề thi<br/><span className="text-[10px] text-[#64748b] font-normal uppercase">Theo công văn 7791</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <button
            onClick={() => setCurrentStep('SETUP')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${currentStep === 'SETUP' ? 'bg-[#0d9488]/10 text-[#0d9488] font-semibold' : 'text-[#64748b] hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={18} />
            1. Chọn bài học
          </button>
          <button
            disabled={initialLessons.length === 0}
            onClick={() => setCurrentStep('CONFIG')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${currentStep === 'CONFIG' ? 'bg-[#0d9488]/10 text-[#0d9488] font-semibold' : 'text-[#64748b] hover:bg-slate-50 disabled:opacity-30'}`}
          >
            <SlidersHorizontal size={18} />
            2. Cấu hình khung
          </button>
          <button
            disabled={!setupInfo.examName}
            onClick={() => setCurrentStep('MATRIX')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${currentStep === 'MATRIX' ? 'bg-[#0d9488]/10 text-[#0d9488] font-semibold' : 'text-[#64748b] hover:bg-slate-50 disabled:opacity-30'}`}
          >
            <FileSpreadsheet size={18} />
            3. Ma trận chi tiết
          </button>
        </nav>

        <div className="p-4 border-t border-[#e2e8f0] space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold uppercase">
              {user.username.substring(0, 2)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-[#1e293b] truncate">{user.username}</p>
              <p className="text-[10px] text-emerald-500">Online</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-all text-sm font-medium"
          >
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Top Header info from image */}
        <div className="bg-[#1e293b] text-white px-8 py-2 flex items-center justify-between text-[11px] font-medium">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="opacity-70 italic font-normal">Cung cấp:</span> Tài khoản Canva, ứng dụng hỗ trợ giáo viên
            </div>
            <div className="flex items-center gap-1">
              <span className="opacity-70 italic font-normal">Đào tạo:</span> AI, E-learning, ứng dụng AI trong giáo dục
            </div>
          </div>
          <div className="text-right">
             <span className="font-bold">Trung tâm Tin học ứng dụng Bai Digitech</span><br/>
             Liên hệ: 0972.300.864 - Thầy Giới (Hỗ trợ: 0359.399.467 - Thầy Tùng)
          </div>
        </div>
        
        <div className="bg-[#fef9c3] py-1 px-8 text-center border-b border-amber-200">
          <p className="text-xs font-bold text-amber-800 flex items-center justify-center gap-2">
            <Bell size={12} className="fill-amber-800" />
            THÔNG BÁO: <span className="font-normal italic">Nên dùng đề cương thầy cô nhé</span>
          </p>
        </div>

        <div className="bg-[#0d9488] text-white px-8 py-2 flex items-center gap-2 text-xs font-medium">
           <div className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center text-[10px]">✨</div>
           AI đã phân tích tài liệu. Vui lòng kiểm tra và xác nhận cấu hình ma trận.
        </div>

        <div className="p-8 flex-1">
          {currentStep === 'SETUP' && (
            <SetupStep onComplete={onSetupComplete} />
          )}
          {currentStep === 'CONFIG' && (
            <MatrixConfig 
              setupInfo={setupInfo} 
              onBack={() => setCurrentStep('SETUP')}
              onNext={(config) => {
                setSetupInfo({ ...setupInfo, ...config });
                setCurrentStep('MATRIX');
              }}
            />
          )}
          {currentStep === 'MATRIX' && (
            <MatrixForm lessons={initialLessons.filter(l => l.selected)} setupInfo={setupInfo} />
          )}
        </div>

        <footer className="px-8 py-4 bg-slate-900 text-slate-400 flex justify-between items-center text-[10px] border-t border-slate-800">
           <div>
              Trung tâm Tin học ứng dụng Bai Digitech | ĐT: 0972.300.864 - Thầy Giới<br/>
              © 2026 - Ứng dụng được phát triển bởi Thầy Giới.
           </div>
           <div className="flex gap-4 uppercase font-bold">
              <button className="hover:text-white flex items-center gap-1" onClick={onLogout}><LogOut size={12}/> Đăng xuất</button>
              <button className="hover:text-white flex items-center gap-1"><Settings size={12}/> Quản lý API Key (2)</button>
           </div>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;

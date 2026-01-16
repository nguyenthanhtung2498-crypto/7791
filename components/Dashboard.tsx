
import React from 'react';
import { User, AppStep, Lesson, SetupInfo } from '../types';
import MatrixForm from './MatrixForm';
import SetupStep from './SetupStep';
import MatrixConfig from './MatrixConfig';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  LogOut, 
  Settings, 
  Bell, 
  SlidersHorizontal,
  ShieldCheck,
  User as UserIcon
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
  return (
    <div className="flex h-screen bg-[#f1f5f9]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#e2e8f0] flex flex-col shadow-sm z-10">
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
        </nav>

        <div className="p-4 border-t border-[#e2e8f0] space-y-4 bg-slate-50/50">
          <div className="flex items-center gap-3 px-2 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#0d9488]/10 flex items-center justify-center text-[#0d9488]">
              <UserIcon size={20} />
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

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col relative">
        {/* Top Header info */}
        <div className="bg-[#1e293b] text-white px-8 py-2.5 flex items-center justify-between text-[11px] font-medium shadow-md relative z-20">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <span className="opacity-50 italic font-normal">Cung cấp:</span> Tài khoản Canva, ứng dụng hỗ trợ giáo viên
            </div>
            <div className="flex items-center gap-1.5 border-l border-white/10 pl-6">
              <span className="opacity-50 italic font-normal">Đào tạo:</span> AI, E-learning, ứng dụng AI trong giáo dục
            </div>
          </div>
          <div className="text-right">
             <span className="font-bold text-emerald-400">THCS Huỳnh Thúc Kháng - Hưng Thịnh</span><br/>
             <span className="opacity-70 text-[10px]">Liên hệ: Thầy Tùng 0359.399.467</span>
          </div>
        </div>
        
        <div className="bg-amber-50 py-1 border-b border-amber-200 marquee-container z-0">
          <div className="marquee-content">
            <p className="text-[11px] font-bold text-amber-700 flex items-center gap-2">
              <Bell size={12} className="fill-amber-700" />
              THÔNG BÁO QUAN TRỌNG: <span className="font-normal italic uppercase">vui lòng dung phụ lục III để AI phân tích chính xác nhất kế hoạch dạy học của bạn</span>
            </p>
          </div>
        </div>

        <div className="bg-emerald-600 text-white px-8 py-2.5 flex items-center gap-3 text-xs font-bold shadow-inner">
           <ShieldCheck size={16} className="text-emerald-200" />
           Hệ thống AI đã sẵn sàng xử lý tài liệu theo tiêu chuẩn Công văn 7791.
        </div>

        <div className="p-8 flex-1 bg-slate-50/50">
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

        <footer className="px-8 py-4 bg-white text-slate-400 flex justify-between items-center text-[10px] border-t border-slate-200">
           <div>
              <p className="font-medium text-slate-500">THCS Huỳnh Thúc Kháng - Hưng Thịnh | ĐT: Thầy Tùng 0359.399.467</p>
              <p>© 2026 - Ứng dụng được phát triển chuyên biệt cho giáo viên bởi Thầy Tùng.</p>
           </div>
           <div className="flex gap-4 uppercase font-bold text-slate-500">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                <Settings size={12}/> AI Status: Online
              </div>
           </div>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;

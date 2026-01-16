
import React, { useState } from 'react';
import { SetupInfo, UserRole } from '../types';
import { FileUp, Info, ChevronLeft, ChevronRight, Check, Loader2, Lock } from 'lucide-react';

interface MatrixConfigProps {
  setupInfo: SetupInfo;
  userRole?: UserRole;
  onBack: () => void;
  onNext: (config: Partial<SetupInfo>) => void;
}

const MatrixConfig: React.FC<MatrixConfigProps> = ({ setupInfo, userRole = 'teacher', onBack, onNext }) => {
  const [config, setConfig] = useState<SetupInfo>(setupInfo);
  const [pl1File, setPl1File] = useState<File | null>(null);
  const [isReading, setIsReading] = useState(false);

  const handleChange = (field: keyof SetupInfo, value: any) => {
    // Ngăn chặn teacher chỉnh sửa một số trường nhạy cảm nếu cần,
    // ở đây ta sẽ xử lý bằng việc vô hiệu hóa input trong UI.
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPl1File(file);
      setIsReading(true);
      
      try {
        const arrayBuffer = await file.arrayBuffer();
        // @ts-ignore
        const result = await window.mammoth.extractRawText({ arrayBuffer });
        handleChange('requirementsText', result.value);
      } catch (err) {
        console.error("Lỗi đọc file Phụ lục I", err);
      } finally {
        setIsReading(false);
      }
    }
  };

  const isAdmin = userRole === 'admin';
  const isComplete = pl1File !== null && config.examName !== '';

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in slide-in-from-right-10 duration-500">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-bold text-[#0d9488] flex items-center justify-center gap-3">
           <span className="w-10 h-10 bg-[#0d9488] rounded-lg flex items-center justify-center text-white text-xl font-bold italic shadow-md">BΦ</span>
           Cấu hình Khung Ma trận
        </h2>
        <p className="text-[#64748b] text-sm italic">Thiết lập các thông số cơ bản cho kỳ thi theo Công văn 7791.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: School Info */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-6 relative overflow-hidden">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-bold text-[#1e293b] text-sm uppercase tracking-wider">Thông tin đơn vị</h3>
            {!isAdmin && <Lock size={14} className="text-slate-300" />}
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest flex items-center gap-1.5">
                Tên trường {!isAdmin && <span className="text-[8px] bg-slate-100 px-1 rounded text-slate-400">Khóa</span>}
              </label>
              <input 
                type="text" 
                value={config.schoolName}
                disabled={!isAdmin}
                onChange={(e) => handleChange('schoolName', e.target.value)}
                className={`w-full border rounded-xl p-3 text-sm outline-none transition-all ${isAdmin ? 'bg-white border-[#e2e8f0] focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]' : 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed'}`}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest flex items-center gap-1.5">
                Tổ chuyên môn {!isAdmin && <span className="text-[8px] bg-slate-100 px-1 rounded text-slate-400">Khóa</span>}
              </label>
              <input 
                type="text" 
                value={config.department}
                disabled={!isAdmin}
                onChange={(e) => handleChange('department', e.target.value)}
                className={`w-full border rounded-xl p-3 text-sm outline-none transition-all ${isAdmin ? 'bg-white border-[#e2e8f0] focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]' : 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed'}`}
              />
            </div>
          </div>
          {!isAdmin && (
            <div className="absolute inset-x-0 bottom-0 p-3 bg-slate-50/80 backdrop-blur-sm border-t border-slate-100">
               <p className="text-[9px] text-slate-400 font-medium italic text-center">Tài khoản giáo viên không thể thay đổi thông tin đơn vị.</p>
            </div>
          )}
        </div>

        {/* Column 2: General Info */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-6">
          <h3 className="font-bold text-[#1e293b] text-sm uppercase tracking-wider border-b pb-2">Thông tin kỳ thi</h3>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">Tên kỳ thi <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={config.examName}
                onChange={(e) => handleChange('examName', e.target.value)}
                className="w-full bg-white border border-[#e2e8f0] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] outline-none transition-all"
                placeholder="Ví dụ: KIỂM TRA GIỮA KỲ I"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">Năm học</label>
                <input 
                  type="text" 
                  value={config.schoolYear}
                  onChange={(e) => handleChange('schoolYear', e.target.value)}
                  className="w-full bg-white border border-[#e2e8f0] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">Thời lượng</label>
                <input 
                  type="text" 
                  value={config.duration}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  className="w-full bg-white border border-[#e2e8f0] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] outline-none"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest flex items-center gap-2">
                Tải Phụ lục I (YCCĐ)
                <span className="text-red-500 font-bold">*</span>
              </label>
              <div className={`relative border-2 border-dashed rounded-2xl p-4 transition-all ${pl1File ? 'border-emerald-500 bg-emerald-50' : 'border-amber-300 bg-amber-50/30 hover:border-amber-400'}`}>
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept=".docx"
                  onChange={handleFileChange}
                />
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${pl1File ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-600'}`}>
                    {isReading ? <Loader2 size={18} className="animate-spin" /> : (pl1File ? <Check size={18} /> : <FileUp size={18} />)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[11px] font-bold text-[#1e293b] truncate leading-tight">
                      {pl1File ? pl1File.name : 'Chọn file Phụ lục I (Word)'}
                    </p>
                    <p className="text-[9px] text-[#64748b] font-medium">Bắt buộc để AI trích xuất YCCĐ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Structure & Rate */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-2">
             <h3 className="font-bold text-[#1e293b] text-sm uppercase tracking-wider">Cấu trúc & Điểm số</h3>
             {!isAdmin && <Lock size={14} className="text-slate-300" />}
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[#64748b] uppercase tracking-widest">Nhiều lựa chọn</label>
                <div className="flex gap-1.5">
                   <input type="number" title="Số câu" value={config.mcqCount} onChange={(e) => handleChange('mcqCount', parseInt(e.target.value) || 0)} className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-2.5 text-xs text-center font-bold" />
                   <input type="number" title="Điểm/Câu" step="0.05" disabled={!isAdmin} value={config.mcqScore} onChange={(e) => handleChange('mcqScore', parseFloat(e.target.value) || 0)} className={`w-full border rounded-xl p-2.5 text-xs text-center font-bold ${isAdmin ? 'bg-white border-slate-200' : 'bg-slate-50 border-transparent text-slate-400'}`} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[#64748b] uppercase tracking-widest">Đúng / Sai</label>
                <div className="flex gap-1.5">
                   <input type="number" title="Số câu" value={config.tfCount} onChange={(e) => handleChange('tfCount', parseInt(e.target.value) || 0)} className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-2.5 text-xs text-center font-bold" />
                   <input type="number" title="Điểm/Câu" step="0.05" disabled={!isAdmin} value={config.tfScore} onChange={(e) => handleChange('tfScore', parseFloat(e.target.value) || 0)} className={`w-full border rounded-xl p-2.5 text-xs text-center font-bold ${isAdmin ? 'bg-white border-slate-200' : 'bg-slate-50 border-transparent text-slate-400'}`} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[#64748b] uppercase tracking-widest">Trả lời ngắn</label>
                <div className="flex gap-1.5">
                   <input type="number" title="Số câu" value={config.shortCount} onChange={(e) => handleChange('shortCount', parseInt(e.target.value) || 0)} className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-2.5 text-xs text-center font-bold" />
                   <input type="number" title="Điểm/Câu" step="0.05" disabled={!isAdmin} value={config.shortScore} onChange={(e) => handleChange('shortScore', parseFloat(e.target.value) || 0)} className={`w-full border rounded-xl p-2.5 text-xs text-center font-bold ${isAdmin ? 'bg-white border-slate-200' : 'bg-slate-50 border-transparent text-slate-400'}`} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[#64748b] uppercase tracking-widest">Tự luận</label>
                <div className="flex gap-1.5">
                   <input type="number" title="Số câu" value={config.essayCount} onChange={(e) => handleChange('essayCount', parseInt(e.target.value) || 0)} className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-2.5 text-xs text-center font-bold" />
                   <div className="w-full bg-slate-100/50 p-2.5 text-center text-[9px] text-slate-400 rounded-xl italic leading-tight flex items-center justify-center">Hệ số 10.0</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="space-y-1 text-center bg-blue-50/50 rounded-xl p-2 border border-blue-100">
                <label className="text-[8px] font-bold text-blue-600 uppercase">Biết (%)</label>
                <input type="number" value={config.percentKnow} onChange={(e) => handleChange('percentKnow', parseInt(e.target.value) || 0)} className="w-full bg-transparent border-none p-0 text-xs text-center font-extrabold text-blue-800" />
              </div>
              <div className="space-y-1 text-center bg-emerald-50/50 rounded-xl p-2 border border-emerald-100">
                <label className="text-[8px] font-bold text-emerald-600 uppercase">Hiểu (%)</label>
                <input type="number" value={config.percentUnderstand} onChange={(e) => handleChange('percentUnderstand', parseInt(e.target.value) || 0)} className="w-full bg-transparent border-none p-0 text-xs text-center font-extrabold text-emerald-800" />
              </div>
              <div className="space-y-1 text-center bg-amber-50/50 rounded-xl p-2 border border-amber-100">
                <label className="text-[8px] font-bold text-amber-600 uppercase">Vận dụng (%)</label>
                <input type="number" value={config.percentApply} onChange={(e) => handleChange('percentApply', parseInt(e.target.value) || 0)} className="w-full bg-transparent border-none p-0 text-xs text-center font-extrabold text-amber-800" />
              </div>
            </div>
            {!isAdmin && (
               <p className="text-[9px] text-slate-400 font-medium italic text-center leading-tight">
                 * Chú thích: Bạn có thể thay đổi số lượng câu, nhưng mức điểm chuẩn được cấu hình bởi Admin.
               </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-8 pb-12">
        <button
          onClick={onBack}
          className="px-8 py-3.5 bg-white border border-[#e2e8f0] text-[#64748b] font-bold rounded-2xl shadow-sm transition-all hover:bg-slate-50 flex items-center gap-2"
        >
          <ChevronLeft size={18} /> Quay lại
        </button>
        <button
          onClick={() => onNext(config)}
          disabled={!isComplete || isReading}
          className={`px-10 py-3.5 font-bold rounded-2xl shadow-xl transition-all flex items-center gap-3 ${isComplete ? 'bg-[#0d9488] hover:bg-[#0f766e] text-white' : 'bg-slate-300 text-white cursor-not-allowed'}`}
        >
          {isReading ? 'Đang đọc file...' : 'Tiếp tục: Ma trận chi tiết'}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default MatrixConfig;

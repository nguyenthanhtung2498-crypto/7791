
import React, { useState } from 'react';
import { SetupInfo } from '../types';
import { FileUp, Info, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface MatrixConfigProps {
  setupInfo: SetupInfo;
  onBack: () => void;
  onNext: (config: Partial<SetupInfo>) => void;
}

const MatrixConfig: React.FC<MatrixConfigProps> = ({ setupInfo, onBack, onNext }) => {
  const [config, setConfig] = useState<SetupInfo>(setupInfo);
  const [pl1File, setPl1File] = useState<File | null>(null);

  const handleChange = (field: keyof SetupInfo, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPl1File(e.target.files[0]);
    }
  };

  const totalObjectiveScore = (config.mcqCount! * config.mcqScore!) + (config.tfCount! * config.tfScore!) + (config.shortCount! * config.shortScore!);
  const totalEssayScore = 10 - totalObjectiveScore;

  const isComplete = pl1File !== null && config.examName !== '';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-bold text-[#0d9488] flex items-center justify-center gap-3">
           <span className="w-10 h-10 bg-[#0d9488] rounded-lg flex items-center justify-center text-white text-xl font-bold italic">BΦ</span>
           Cấu hình Khung Ma trận Đề thi
        </h2>
        <p className="text-[#64748b] text-sm">AI đã phân tích tài liệu của bạn. Vui lòng kiểm tra và xác nhận các thông số dưới đây.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: School Info */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-6">
          <h3 className="font-bold text-[#1e293b] text-sm border-b pb-2">Thông tin Trường học</h3>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#64748b] uppercase">Tên trường</label>
              <input 
                type="text" 
                value={config.schoolName}
                onChange={(e) => handleChange('schoolName', e.target.value)}
                className="w-full bg-white border border-[#e2e8f0] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#0d9488] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#64748b] uppercase">Tổ chuyên môn</label>
              <input 
                type="text" 
                value={config.department}
                onChange={(e) => handleChange('department', e.target.value)}
                className="w-full bg-white border border-[#e2e8f0] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#0d9488] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Column 2: General Info */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-6">
          <h3 className="font-bold text-[#1e293b] text-sm border-b pb-2">Thông tin chung</h3>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#64748b] uppercase">Tên kỳ thi</label>
              <input 
                type="text" 
                value={config.examName}
                onChange={(e) => handleChange('examName', e.target.value)}
                className="w-full bg-white border border-[#e2e8f0] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#0d9488] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#64748b] uppercase">Môn học</label>
              <input 
                type="text" 
                value={config.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                className="w-full bg-white border border-[#e2e8f0] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#0d9488] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#64748b] uppercase">Năm học</label>
              <input 
                type="text" 
                value={config.schoolYear}
                onChange={(e) => handleChange('schoolYear', e.target.value)}
                className="w-full bg-white border border-[#e2e8f0] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#0d9488] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#64748b] uppercase">Thời gian làm bài</label>
              <input 
                type="text" 
                value={config.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                className="w-full bg-white border border-[#e2e8f0] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#0d9488] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#64748b] uppercase">Mã đề (tùy chọn)</label>
              <input 
                type="text" 
                value={config.testCode}
                onChange={(e) => handleChange('testCode', e.target.value)}
                className="w-full bg-white border border-[#e2e8f0] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#0d9488] outline-none"
              />
            </div>

            {/* PHỤ LỤC I UPLOAD - MANDATORY */}
            <div className="space-y-2 pt-2">
              <label className="text-[11px] font-bold text-[#64748b] uppercase flex items-center gap-2">
                Thêm File Phụ lục I (Bắt buộc)
                <span className="text-red-500">*</span>
              </label>
              <div className={`relative border-2 border-dashed rounded-lg p-4 transition-all ${pl1File ? 'border-emerald-500 bg-emerald-50' : 'border-amber-300 bg-amber-50/30'}`}>
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept=".doc,.docx,.xls,.xlsx"
                  onChange={handleFileChange}
                />
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${pl1File ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-600'}`}>
                    {pl1File ? <Check size={16} /> : <FileUp size={16} />}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] font-bold text-[#1e293b] truncate">
                      {pl1File ? pl1File.name : 'Chọn file Phụ lục I (Word/Excel)'}
                    </p>
                    <p className="text-[9px] text-[#64748b]">Yêu cầu file mẫu của trung tâm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Structure & Rate */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-6">
          <h3 className="font-bold text-[#1e293b] text-sm border-b pb-2">Cấu trúc Đề thi & Tỉ lệ</h3>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#64748b] uppercase">Độ khó đề thi</label>
              <div className="grid grid-cols-3 gap-2">
                {['Dễ', 'Trung bình', 'Trung bình khá'].map(d => (
                  <button
                    key={d}
                    onClick={() => handleChange('difficulty', d)}
                    className={`py-2 text-[11px] font-bold rounded-lg border transition-all ${config.difficulty === d ? 'border-[#0d9488] bg-white text-[#0d9488] ring-2 ring-[#0d9488]/20' : 'border-[#e2e8f0] bg-white text-[#64748b]'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#64748b] uppercase leading-tight">Trắc nghiệm nhiều lựa chọn</label>
                <div className="flex gap-2">
                   <input type="number" value={config.mcqCount} onChange={(e) => handleChange('mcqCount', parseInt(e.target.value) || 0)} className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2 text-xs text-center" />
                   <input type="number" step="0.05" value={config.mcqScore} onChange={(e) => handleChange('mcqScore', parseFloat(e.target.value) || 0)} className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2 text-xs text-center" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#64748b] uppercase leading-tight">Trắc nghiệm Đúng/Sai</label>
                <div className="flex gap-2">
                   <input type="number" value={config.tfCount} onChange={(e) => handleChange('tfCount', parseInt(e.target.value) || 0)} className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2 text-xs text-center" />
                   <input type="number" step="0.05" value={config.tfScore} onChange={(e) => handleChange('tfScore', parseFloat(e.target.value) || 0)} className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2 text-xs text-center" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#64748b] uppercase leading-tight">Trả lời ngắn</label>
                <div className="flex gap-2">
                   <input type="number" value={config.shortCount} onChange={(e) => handleChange('shortCount', parseInt(e.target.value) || 0)} className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2 text-xs text-center" />
                   <input type="number" step="0.05" value={config.shortScore} onChange={(e) => handleChange('shortScore', parseFloat(e.target.value) || 0)} className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2 text-xs text-center" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#64748b] uppercase leading-tight">Tự luận</label>
                <div className="flex gap-2">
                   <input type="number" value={config.essayCount} onChange={(e) => handleChange('essayCount', parseInt(e.target.value) || 0)} className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2 text-xs text-center" />
                   <div className="w-full bg-slate-100 p-2 text-center text-xs text-slate-400 rounded-lg">Auto</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
               <div className="bg-[#f0f9ff] p-3 rounded-xl border border-[#bae6fd]">
                  <p className="text-[9px] font-bold text-[#0369a1] uppercase">Tổng TNKQ (Tự tính)</p>
                  <p className="text-xl font-bold text-[#0369a1]">{totalObjectiveScore.toFixed(1)}</p>
               </div>
               <div className="bg-[#f0fdf4] p-3 rounded-xl border border-[#bbf7d0]">
                  <p className="text-[9px] font-bold text-[#15803d] uppercase">Điểm Tự luận (10 - TNKQ)</p>
                  <p className="text-xl font-bold text-[#15803d]">{totalEssayScore.toFixed(1)}</p>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[#64748b] uppercase">Biết (%)</label>
                <input type="number" value={config.percentKnow} onChange={(e) => handleChange('percentKnow', parseInt(e.target.value) || 0)} className="w-full bg-white border border-[#e2e8f0] rounded-lg p-2 text-xs text-center" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[#64748b] uppercase">Hiểu (%)</label>
                <input type="number" value={config.percentUnderstand} onChange={(e) => handleChange('percentUnderstand', parseInt(e.target.value) || 0)} className="w-full bg-white border border-[#e2e8f0] rounded-lg p-2 text-xs text-center" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-[#64748b] uppercase">Vận dụng (%)</label>
                <input type="number" value={config.percentApply} onChange={(e) => handleChange('percentApply', parseInt(e.target.value) || 0)} className="w-full bg-white border border-[#e2e8f0] rounded-lg p-2 text-xs text-center" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-8 pb-12">
        <button
          onClick={onBack}
          className="px-8 py-3 bg-white border border-[#e2e8f0] text-[#64748b] font-bold rounded-full shadow-sm transition-all hover:bg-slate-50 flex items-center gap-2"
        >
          Quay lại
        </button>
        <button
          onClick={() => onNext(config)}
          disabled={!isComplete}
          className={`px-10 py-3 font-bold rounded-full shadow-lg transition-all flex items-center gap-2 ${isComplete ? 'bg-[#0d9488] hover:bg-[#0f766e] text-white' : 'bg-slate-300 text-white cursor-not-allowed'}`}
        >
          Tạo Ma trận chi tiết
        </button>
      </div>
    </div>
  );
};

export default MatrixConfig;

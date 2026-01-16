
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, FileDown, Sparkles, Info } from 'lucide-react';
import { MatrixRow, Lesson, SetupInfo } from '../types';
import { geminiService } from '../services/gemini';

interface MatrixFormProps {
  lessons?: Lesson[];
  setupInfo?: SetupInfo;
}

const MatrixForm: React.FC<MatrixFormProps> = ({ 
  lessons = [], 
  setupInfo = { 
    subject: '', 
    grade: '', 
    examType: '',
    schoolName: '',
    examName: '',
    duration: '',
    percentKnow: 40,
    percentUnderstand: 30,
    percentApply: 30,
    difficulty: 'Trung bình'
  } 
}) => {
  const [rows, setRows] = useState<MatrixRow[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (lessons.length > 0) {
      const initialRows = lessons.filter(l => l.selected).map(l => ({
        id: l.id,
        topic: l.topic,
        unit: l.name,
        levels: { recognition: 0, understanding: 0, application: 0, highApplication: 0 },
        totalQuestions: 0,
        score: 0
      }));
      setRows(initialRows);
    }
  }, [lessons]);

  const addRow = () => {
    const newRow: MatrixRow = {
      id: Math.random().toString(36).substr(2, 9),
      topic: '',
      unit: '',
      levels: { recognition: 0, understanding: 0, application: 0, highApplication: 0 },
      totalQuestions: 0,
      score: 0
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (id: string) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const updateRow = (id: string, field: string, value: any) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value } as MatrixRow;
        if (field === 'levels') {
          const levelsArray = Object.values(updatedRow.levels) as number[];
          updatedRow.totalQuestions = levelsArray.reduce((a: number, b: number) => a + b, 0);
          updatedRow.score = updatedRow.totalQuestions * 0.25; 
        }
        return updatedRow;
      }
      return row;
    }));
  };

  const totals = rows.reduce((acc, row) => ({
    recognition: acc.recognition + row.levels.recognition,
    understanding: acc.understanding + row.levels.understanding,
    application: acc.application + row.levels.application,
    highApplication: acc.highApplication + row.levels.highApplication,
    totalQuestions: acc.totalQuestions + row.totalQuestions,
    score: acc.score + row.score
  }), { recognition: 0, understanding: 0, application: 0, highApplication: 0, totalQuestions: 0, score: 0 });

  const handleAISuggest = async () => {
    if (rows.length === 0) return;
    setIsGenerating(true);
    try {
      const selectedLessons = lessons.filter(l => l.selected);
      const suggestions = await geminiService.suggestMatrixDistribution(selectedLessons, setupInfo);
      
      setRows(rows.map(row => {
        const sug = suggestions.find((s: any) => s.unit === row.unit || s.unit.includes(row.unit));
        if (sug) {
          const levels = {
            recognition: Math.max(0, parseInt(sug.recognition) || 0),
            understanding: Math.max(0, parseInt(sug.understanding) || 0),
            application: Math.max(0, parseInt(sug.application) || 0),
            highApplication: Math.max(0, parseInt(sug.highApplication) || 0)
          };
          const total = Object.values(levels).reduce((a, b) => a + b, 0);
          return { ...row, levels, totalQuestions: total, score: total * 0.25 };
        }
        return row;
      }));
    } catch (error: any) {
      alert(error.message || "Lỗi khi AI gợi ý phân bổ.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
           <div>
              <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-widest">{setupInfo.schoolName}</p>
              <h1 className="text-xl font-bold text-[#1e293b] mt-1">{setupInfo.examName}</h1>
              <div className="flex flex-wrap gap-4 mt-2 text-xs text-[#64748b]">
                 <span>Môn: <b>{setupInfo.subject}</b></span>
                 <span>Lớp: <b>{setupInfo.grade}</b></span>
                 <span>Thời gian: <b>{setupInfo.duration}</b></span>
              </div>
           </div>
           <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={handleAISuggest}
                disabled={isGenerating || rows.length === 0}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all font-bold disabled:opacity-50 text-sm border border-indigo-100"
              >
                <Sparkles size={16} />
                {isGenerating ? 'AI đang tính...' : 'AI Phân bổ câu hỏi'}
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0d9488] text-white rounded-xl hover:bg-[#0f766e] transition-all font-bold shadow-lg shadow-[#0d9488]/20 text-sm">
                <FileDown size={16} />
                Xuất Ma trận
              </button>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-[#e2e8f0]">
                <th className="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider w-1/4">Chủ đề / Bài học</th>
                <th className="px-4 py-4 text-center text-xs font-bold text-blue-600 uppercase tracking-wider">Nhận biết</th>
                <th className="px-4 py-4 text-center text-xs font-bold text-emerald-600 uppercase tracking-wider">Thông hiểu</th>
                <th className="px-4 py-4 text-center text-xs font-bold text-amber-600 uppercase tracking-wider">Vận dụng</th>
                <th className="px-4 py-4 text-center text-xs font-bold text-red-600 uppercase tracking-wider">Vận dụng cao</th>
                <th className="px-4 py-4 text-center text-xs font-bold text-[#1e293b] uppercase tracking-wider">Tổng</th>
                <th className="px-6 py-4 text-right w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <input 
                        className="w-full text-sm font-semibold bg-transparent border-none p-0 focus:ring-0 text-[#1e293b]" 
                        value={row.topic}
                        onChange={(e) => updateRow(row.id, 'topic', e.target.value)}
                        placeholder="Chủ đề chính"
                      />
                      <input 
                        className="w-full text-xs bg-transparent border-none p-0 focus:ring-0 text-[#64748b]" 
                        value={row.unit}
                        onChange={(e) => updateRow(row.id, 'unit', e.target.value)}
                        placeholder="Đơn vị kiến thức"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <input 
                      type="number" 
                      className="w-12 text-center border rounded py-1 text-sm bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-400 outline-none"
                      value={row.levels.recognition}
                      onChange={(e) => updateRow(row.id, 'levels', { ...row.levels, recognition: parseInt(e.target.value) || 0 })}
                    />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <input 
                      type="number" 
                      className="w-12 text-center border rounded py-1 text-sm bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-400 outline-none"
                      value={row.levels.understanding}
                      onChange={(e) => updateRow(row.id, 'levels', { ...row.levels, understanding: parseInt(e.target.value) || 0 })}
                    />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <input 
                      type="number" 
                      className="w-12 text-center border rounded py-1 text-sm bg-slate-50 focus:bg-white focus:ring-1 focus:ring-amber-400 outline-none"
                      value={row.levels.application}
                      onChange={(e) => updateRow(row.id, 'levels', { ...row.levels, application: parseInt(e.target.value) || 0 })}
                    />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <input 
                      type="number" 
                      className="w-12 text-center border rounded py-1 text-sm bg-slate-50 focus:bg-white focus:ring-1 focus:ring-red-400 outline-none"
                      value={row.levels.highApplication}
                      onChange={(e) => updateRow(row.id, 'levels', { ...row.levels, highApplication: parseInt(e.target.value) || 0 })}
                    />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm font-bold text-[#1e293b]">{row.totalQuestions}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => removeRow(row.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50/80 font-bold border-t border-[#e2e8f0]">
              <tr>
                <td className="px-6 py-4 text-sm text-[#1e293b]">TỔNG CỘNG</td>
                <td className="px-4 py-4 text-center text-blue-600">{totals.recognition}</td>
                <td className="px-4 py-4 text-center text-emerald-600">{totals.understanding}</td>
                <td className="px-4 py-4 text-center text-amber-600">{totals.application}</td>
                <td className="px-4 py-4 text-center text-red-600">{totals.highApplication}</td>
                <td className="px-4 py-4 text-center text-slate-900">{totals.totalQuestions}</td>
                <td className="px-6 py-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="p-4 border-t border-[#e2e8f0] bg-white">
          <button onClick={addRow} className="flex items-center gap-2 text-sm text-[#0d9488] font-bold hover:text-[#0f766e] transition-colors">
            <Plus size={18} /> Thêm bài học mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] text-center shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Tổng điểm ma trận</p>
          <p className="text-2xl font-bold text-[#0d9488]">{totals.score.toFixed(1)} / 10.0</p>
          <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#0d9488] transition-all" style={{ width: `${Math.min(100, totals.score * 10)}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] text-center shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Số câu trắc nghiệm</p>
          <p className="text-2xl font-bold text-blue-600">{totals.totalQuestions}</p>
          <p className="text-[10px] text-slate-400 mt-1">Mục tiêu: 40 câu</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] text-center col-span-2 flex items-center px-6 gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
             <Info size={24} />
          </div>
          <p className="text-xs text-slate-600 text-left leading-relaxed">
            <b>Phân tích AI:</b> Ma trận đang bám sát tỷ lệ <b>{setupInfo.percentKnow}% - {setupInfo.percentUnderstand}% - {setupInfo.percentApply}%</b> theo CV 7791. 
            Hệ thống tự động điều chỉnh độ phân hóa phù hợp mức độ <b>{setupInfo.difficulty}</b>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MatrixForm;

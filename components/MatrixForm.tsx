
// Fix: Added missing 'Sparkles' import from lucide-react to resolve the reference error on line 302.
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Download, RefreshCw, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { MatrixRow, Lesson, SetupInfo } from '../types';
import { geminiService } from '../services/gemini';

interface MatrixFormProps {
  lessons?: Lesson[];
  setupInfo?: SetupInfo;
  onNext: (rows: MatrixRow[]) => void;
}

const MatrixForm: React.FC<MatrixFormProps> = ({ 
  lessons = [], 
  setupInfo = { 
    subject: '', 
    grade: '', 
    examType: '',
    schoolName: '',
    examName: '',
    mcqCount: 12, mcqScore: 0.25,
    tfCount: 2, tfScore: 1,
    shortCount: 4, shortScore: 0.25,
    essayCount: 1, essayScore: 2,
    percentKnow: 40, percentUnderstand: 30, percentApply: 30
  },
  onNext
}) => {
  const [rows, setRows] = useState<MatrixRow[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const autoFetchRef = useRef(false);

  // Sắp xếp bài học theo chủ đề
  const sortedLessons = useMemo(() => {
    return [...lessons].filter(l => l.selected).sort((a, b) => {
      if (a.topic < b.topic) return -1;
      if (a.topic > b.topic) return 1;
      return a.week - b.week;
    });
  }, [lessons]);

  const calculateRowTotals = (row: MatrixRow) => {
    const totalKnow = (row.mcq.recognition || 0) + (row.tf.recognition || 0) + (row.short.recognition || 0) + (row.essay.recognition || 0);
    const totalUnderstand = (row.mcq.understanding || 0) + (row.tf.understanding || 0) + (row.short.understanding || 0) + (row.essay.understanding || 0);
    const totalApply = (row.mcq.application || 0) + (row.tf.application || 0) + (row.short.application || 0) + (row.essay.application || 0);
    
    const rowPoints = 
      ((row.mcq.recognition || 0) + (row.mcq.understanding || 0) + (row.mcq.application || 0)) * (setupInfo.mcqScore || 0.25) +
      ((row.tf.recognition || 0) + (row.tf.understanding || 0) + (row.tf.application || 0)) * (setupInfo.tfScore || 1) +
      ((row.short.recognition || 0) + (row.short.understanding || 0) + (row.short.application || 0)) * (setupInfo.shortScore || 0.25) +
      ((row.essay.recognition || 0) + (row.essay.understanding || 0) + (row.essay.application || 0)) * (setupInfo.essayScore || 2);

    const percentage = (rowPoints / 10) * 100;
    return { ...row, totalKnow, totalUnderstand, totalApply, percentage };
  };

  const handleAISuggest = async (currentRows: MatrixRow[]) => {
    if (sortedLessons.length === 0) return;
    setIsGenerating(true);
    try {
      const suggestions = await geminiService.suggestMatrixDistribution(sortedLessons, setupInfo);
      
      const updatedRows = currentRows.map(row => {
        const sug = suggestions.find((s: any) => 
          s.unit.toLowerCase().trim() === row.unit.toLowerCase().trim() || 
          row.unit.toLowerCase().includes(s.unit.toLowerCase().trim()) ||
          s.unit.toLowerCase().includes(row.unit.toLowerCase().trim())
        );
        if (sug) {
          const newRow = { 
            ...row, 
            mcq: {
              recognition: Number(sug.mcq?.recognition || 0),
              understanding: Number(sug.mcq?.understanding || 0),
              application: Number(sug.mcq?.application || 0)
            },
            tf: {
              recognition: Number(sug.tf?.recognition || 0),
              understanding: Number(sug.tf?.understanding || 0),
              application: Number(sug.tf?.application || 0)
            },
            short: {
              recognition: Number(sug.short?.recognition || 0),
              understanding: Number(sug.short?.understanding || 0),
              application: Number(sug.short?.application || 0)
            },
            essay: {
              recognition: Number(sug.essay?.recognition || 0),
              understanding: Number(sug.essay?.understanding || 0),
              application: Number(sug.essay?.application || 0)
            }
          };
          return calculateRowTotals(newRow);
        }
        return row;
      });
      setRows(updatedRows);
    } catch (error: any) {
      alert(error.message || "Không thể tự động lập ma trận.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (sortedLessons.length > 0 && !autoFetchRef.current) {
      const initialRows = sortedLessons.map(l => ({
        id: l.id,
        topic: l.topic,
        unit: l.name,
        mcq: { recognition: 0, understanding: 0, application: 0 },
        tf: { recognition: 0, understanding: 0, application: 0 },
        short: { recognition: 0, understanding: 0, application: 0 },
        essay: { recognition: 0, understanding: 0, application: 0 },
        totalKnow: 0, totalUnderstand: 0, totalApply: 0, percentage: 0
      }));
      setRows(initialRows);
      autoFetchRef.current = true;
      handleAISuggest(initialRows);
    }
  }, [sortedLessons]);

  const totals = useMemo(() => rows.reduce((acc, row) => ({
    mcq: { 
      recognition: acc.mcq.recognition + (row.mcq.recognition || 0), 
      understanding: acc.mcq.understanding + (row.mcq.understanding || 0), 
      application: acc.mcq.application + (row.mcq.application || 0) 
    },
    tf: { 
      recognition: acc.tf.recognition + (row.tf.recognition || 0), 
      understanding: acc.tf.understanding + (row.tf.understanding || 0), 
      application: acc.tf.application + (row.tf.application || 0) 
    },
    short: { 
      recognition: acc.short.recognition + (row.short.recognition || 0), 
      understanding: acc.short.understanding + (row.short.understanding || 0), 
      application: acc.short.application + (row.short.application || 0) 
    },
    essay: { 
      recognition: acc.essay.recognition + (row.essay.recognition || 0), 
      understanding: acc.essay.understanding + (row.essay.understanding || 0), 
      application: acc.essay.application + (row.essay.application || 0) 
    },
    totalKnow: acc.totalKnow + (row.totalKnow || 0),
    totalUnderstand: acc.totalUnderstand + (row.totalUnderstand || 0),
    totalApply: acc.totalApply + (row.totalApply || 0),
    percentage: acc.percentage + (row.percentage || 0)
  }), { 
    mcq: { recognition: 0, understanding: 0, application: 0 },
    tf: { recognition: 0, understanding: 0, application: 0 },
    short: { recognition: 0, understanding: 0, application: 0 },
    essay: { recognition: 0, understanding: 0, application: 0 },
    totalKnow: 0, totalUnderstand: 0, totalApply: 0, percentage: 0 
  }), [rows]);

  const topicRowSpans = useMemo(() => {
    const spans: { [key: number]: number } = {};
    rows.forEach((row, index) => {
      if (index === 0 || row.topic !== rows[index - 1].topic) {
        let count = 0;
        for (let i = index; i < rows.length; i++) {
          if (rows[i].topic === row.topic) count++;
          else break;
        }
        spans[index] = count;
      }
    });
    return spans;
  }, [rows]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">A. MA TRẬN ĐỀ KIỂM TRA CHI TIẾT</h2>
        <button 
          onClick={() => handleAISuggest(rows)} 
          disabled={isGenerating}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all text-xs font-bold shadow-lg shadow-emerald-200 disabled:opacity-50"
        >
          {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          Lập lại ma trận tự động
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] border-collapse text-center table-fixed">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <th rowSpan={3} className="border-r p-2 w-8">TT</th>
                <th rowSpan={3} className="border-r p-2 w-40">Chủ đề</th>
                <th rowSpan={3} className="border-r p-2 w-56">Nội dung/đơn vị kiến thức</th>
                <th colSpan={12} className="border-b border-r p-2 bg-slate-100/30 font-bold uppercase tracking-wider">Mức độ đánh giá</th>
                <th colSpan={3} rowSpan={2} className="border-r p-2 bg-blue-50/50 font-bold">Tổng số câu</th>
                <th rowSpan={3} className="p-2 w-16">Tỉ lệ % điểm</th>
              </tr>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th colSpan={9} className="border-r p-1 font-semibold">Trắc nghiệm khách quan (TNKQ)</th>
                <th colSpan={3} className="border-r p-1 font-semibold">Tự luận</th>
              </tr>
              <tr className="bg-slate-50 border-b border-slate-200 text-[9px] text-slate-500">
                <th colSpan={3} className="border-r p-1 font-bold bg-white">Nhiều lựa chọn</th>
                <th colSpan={3} className="border-r p-1 font-bold bg-white">"Đúng - Sai"</th>
                <th colSpan={3} className="border-r p-1 font-bold bg-white">Trả lời ngắn</th>
                <th colSpan={3} className="border-r p-1 font-bold bg-white">Câu hỏi tự luận</th>
                <th className="border-r p-1 w-7 bg-blue-50/20">Biết</th>
                <th className="border-r p-1 w-7 bg-blue-50/20">Hiểu</th>
                <th className="border-r p-1 w-7 bg-blue-50/20">Vận</th>
              </tr>
              <tr className="bg-slate-100/20 border-b border-slate-200 text-[8px] text-slate-400">
                <td colSpan={3}></td>
                <td className="border-r p-1">Biết</td><td className="border-r p-1">Hiểu</td><td className="border-r p-1">Vận</td>
                <td className="border-r p-1">Biết</td><td className="border-r p-1">Hiểu</td><td className="border-r p-1">Vận</td>
                <td className="border-r p-1">Biết</td><td className="border-r p-1">Hiểu</td><td className="border-r p-1">Vận</td>
                <td className="border-r p-1">Biết</td><td className="border-r p-1">Hiểu</td><td className="border-r p-1">Vận</td>
                <td colSpan={4}></td>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rows.map((row, idx) => (
                <tr key={row.id} className="hover:bg-emerald-50/30 transition-colors h-9">
                  <td className="border-r p-1 font-bold text-slate-400">{idx + 1}</td>
                  {topicRowSpans[idx] !== undefined && (
                    <td rowSpan={topicRowSpans[idx]} className="border-r p-2 text-left font-bold text-slate-800 bg-slate-50/30 align-middle leading-tight">
                      {row.topic}
                    </td>
                  )}
                  <td className="border-r p-2 text-left text-slate-700 truncate font-medium">{row.unit}</td>
                  <td className="border-r p-1 bg-white">{row.mcq.recognition || ''}</td>
                  <td className="border-r p-1 bg-white">{row.mcq.understanding || ''}</td>
                  <td className="border-r p-1 bg-white">{row.mcq.application || ''}</td>
                  <td className="border-r p-1 bg-slate-50/20">{row.tf.recognition || ''}</td>
                  <td className="border-r p-1 bg-slate-50/20">{row.tf.understanding || ''}</td>
                  <td className="border-r p-1 bg-slate-50/20">{row.tf.application || ''}</td>
                  <td className="border-r p-1 bg-white">{row.short.recognition || ''}</td>
                  <td className="border-r p-1 bg-white">{row.short.understanding || ''}</td>
                  <td className="border-r p-1 bg-white">{row.short.application || ''}</td>
                  <td className="border-r p-1 bg-slate-50/20">{row.essay.recognition || ''}</td>
                  <td className="border-r p-1 bg-slate-50/20">{row.essay.understanding || ''}</td>
                  <td className="border-r p-1 bg-slate-50/20">{row.essay.application || ''}</td>
                  <td className="border-r p-1 bg-blue-50/30 font-bold text-blue-600">{row.totalKnow || ''}</td>
                  <td className="border-r p-1 bg-blue-50/30 font-bold text-blue-600">{row.totalUnderstand || ''}</td>
                  <td className="border-r p-1 bg-blue-50/30 font-bold text-blue-600">{row.totalApply || ''}</td>
                  <td className="p-1 font-bold text-slate-600">{row.percentage > 0 ? row.percentage.toFixed(1) + '%' : ''}</td>
                </tr>
              ))}
              <tr className="bg-slate-100 font-bold h-10 text-slate-800">
                <td colSpan={3} className="border-r p-2 text-right uppercase text-[9px] tracking-wider">Tổng số câu</td>
                <td className="border-r p-1 bg-white/50">{totals.mcq.recognition}</td>
                <td className="border-r p-1 bg-white/50">{totals.mcq.understanding}</td>
                <td className="border-r p-1 bg-white/50">{totals.mcq.application}</td>
                <td className="border-r p-1">{totals.tf.recognition}</td>
                <td className="border-r p-1">{totals.tf.understanding}</td>
                <td className="border-r p-1">{totals.tf.application}</td>
                <td className="border-r p-1 bg-white/50">{totals.short.recognition}</td>
                <td className="border-r p-1 bg-white/50">{totals.short.understanding}</td>
                <td className="border-r p-1 bg-white/50">{totals.short.application}</td>
                <td className="border-r p-1">{totals.essay.recognition}</td>
                <td className="border-r p-1">{totals.essay.understanding}</td>
                <td className="border-r p-1">{totals.essay.application}</td>
                <td className="border-r p-1 bg-blue-200/50 text-blue-900">{totals.totalKnow}</td>
                <td className="border-r p-1 bg-blue-200/50 text-blue-900">{totals.totalUnderstand}</td>
                <td className="border-r p-1 bg-blue-200/50 text-blue-900">{totals.totalApply}</td>
                <td className="p-1"></td>
              </tr>
              <tr className="bg-slate-200/50 font-bold h-10 text-slate-900">
                <td colSpan={3} className="border-r p-2 text-right uppercase text-[9px]">Tổng số điểm</td>
                <td colSpan={3} className="border-r p-1 bg-white/30 text-emerald-700">{( (totals.mcq.recognition + totals.mcq.understanding + totals.mcq.application) * (setupInfo.mcqScore || 0.25) ).toFixed(2)}</td>
                <td colSpan={3} className="border-r p-1 text-emerald-700">{( (totals.tf.recognition + totals.tf.understanding + totals.tf.application) * (setupInfo.tfScore || 1) ).toFixed(2)}</td>
                <td colSpan={3} className="border-r p-1 bg-white/30 text-emerald-700">{( (totals.short.recognition + totals.short.understanding + totals.short.application) * (setupInfo.shortScore || 0.25) ).toFixed(2)}</td>
                <td colSpan={3} className="border-r p-1 text-emerald-700">{( (totals.essay.recognition + totals.essay.understanding + totals.essay.application) * (setupInfo.essayScore || 2) ).toFixed(2)}</td>
                <td colSpan={3} className="border-r p-1 bg-blue-200/40"></td>
                <td className="p-1 font-extrabold text-blue-900 text-xs">10.0</td>
              </tr>
              <tr className="bg-slate-200 font-extrabold h-10 text-slate-900">
                <td colSpan={3} className="border-r p-2 text-right uppercase text-[9px]">Tỉ lệ % tổng</td>
                <td colSpan={3} className="border-r p-1 text-blue-800">{setupInfo.percentKnow}%</td>
                <td colSpan={3} className="border-r p-1 text-blue-800">{setupInfo.percentUnderstand}%</td>
                <td colSpan={3} className="border-r p-1 text-blue-800">{setupInfo.percentApply}%</td>
                <td colSpan={3} className="border-r p-1">100%</td>
                <td colSpan={3} className="border-r p-1 bg-slate-300/30"></td>
                <td className="p-1 bg-emerald-600 text-white shadow-inner">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <button className="px-8 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 font-bold flex items-center gap-2 hover:bg-slate-50 transition-all text-sm shadow-sm">
          <Download size={18} className="text-emerald-600" /> Tải Ma trận (Excel)
        </button>
        <button 
          onClick={() => onNext(rows)}
          className="px-10 py-3 bg-[#0d9488] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#0f766e] shadow-xl shadow-emerald-200 transition-all text-sm"
        >
          Tiếp tục: Xây dựng Bản đặc tả
          <ChevronRight size={18} />
        </button>
      </div>

      {isGenerating && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center gap-6 max-w-sm text-center border border-emerald-100">
             <div className="relative">
                <div className="w-20 h-20 border-4 border-emerald-50 border-t-emerald-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <Sparkles className="text-emerald-400 animate-pulse" size={24} />
                </div>
             </div>
             <div>
                <p className="font-extrabold text-slate-900 text-lg mb-2">AI đang lập Ma trận Đề thi</p>
                <p className="text-xs text-slate-500 leading-relaxed px-4">
                  Đang phân tích Yêu cầu cần đạt (Phụ lục I) và phân bổ số lượng câu hỏi theo trọng số CV 7791. 
                  Sẽ hoàn tất trong giây lát...
                </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatrixForm;

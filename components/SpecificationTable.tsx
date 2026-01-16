
import React, { useState, useEffect, useMemo } from 'react';
import { Download, ChevronLeft, Loader2, Sparkles, FileText, CheckCircle, ChevronRight } from 'lucide-react';
import { MatrixRow, SetupInfo } from '../types';
import { geminiService } from '../services/gemini';

interface SpecificationTableProps {
  matrixRows: MatrixRow[];
  setupInfo: SetupInfo;
  onBack: () => void;
  onNext: (specData: any[]) => void;
}

const SpecificationTable: React.FC<SpecificationTableProps> = ({ matrixRows, setupInfo, onBack, onNext }) => {
  const [specData, setSpecData] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchSpec = async () => {
      setIsGenerating(true);
      try {
        const data = await geminiService.generateSpecification(matrixRows, setupInfo);
        setSpecData(data);
      } catch (error: any) {
        alert(error.message || "Lỗi khi tạo bản đặc tả.");
      } finally {
        setIsGenerating(false);
      }
    };
    fetchSpec();
  }, [matrixRows, setupInfo]);

  const topicRowSpans = useMemo(() => {
    const spans: { [key: number]: number } = {};
    matrixRows.forEach((row, index) => {
      if (index === 0 || row.topic !== matrixRows[index - 1].topic) {
        let count = 0;
        for (let i = index; i < matrixRows.length; i++) {
          if (matrixRows[i].topic === row.topic) count++;
          else break;
        }
        spans[index] = count;
      }
    });
    return spans;
  }, [matrixRows]);

  const totals = useMemo(() => matrixRows.reduce((acc, row) => ({
    mcq: { 
      rec: acc.mcq.rec + (row.mcq.recognition || 0), 
      und: acc.mcq.und + (row.mcq.understanding || 0), 
      app: acc.mcq.app + (row.mcq.application || 0) 
    },
    tf: { 
      rec: acc.tf.rec + (row.tf.recognition || 0), 
      und: acc.tf.und + (row.tf.understanding || 0), 
      app: acc.tf.app + (row.tf.application || 0) 
    },
    short: { 
      rec: acc.short.rec + (row.short.recognition || 0), 
      und: acc.short.und + (row.short.understanding || 0), 
      app: acc.short.app + (row.short.application || 0) 
    },
    essay: { 
      rec: acc.essay.rec + (row.essay.recognition || 0), 
      und: acc.essay.und + (row.essay.understanding || 0), 
      app: acc.essay.app + (row.essay.application || 0) 
    }
  }), { 
    mcq: { rec: 0, und: 0, app: 0 },
    tf: { rec: 0, und: 0, app: 0 },
    short: { rec: 0, und: 0, app: 0 },
    essay: { rec: 0, und: 0, app: 0 }
  }), [matrixRows]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="text-center space-y-2 mb-4">
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">B. BẢN ĐẶC TẢ ĐỀ KIỂM TRA</h2>
        <p className="text-sm text-slate-500 italic">Dựa trên ma trận chi tiết và yêu cầu cần đạt chuẩn CV 7791</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] border-collapse text-left table-fixed">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                <th rowSpan={3} className="border-r p-2 w-8 text-center">TT</th>
                <th rowSpan={3} className="border-r p-2 w-36 text-center">Chủ đề/Chương</th>
                <th rowSpan={3} className="border-r p-2 w-48 text-center">Nội dung/Đơn vị kiến thức</th>
                <th rowSpan={3} className="border-r p-2 w-80 text-center">Yêu cầu cần đạt</th>
                <th colSpan={12} className="border-b border-r p-2 text-center uppercase text-[9px]">Số câu hỏi ở các mức độ đánh giá</th>
              </tr>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[9px] font-bold">
                <th colSpan={9} className="border-r p-1 text-center">TNKQ</th>
                <th colSpan={3} className="border-r p-1 text-center">Tự luận</th>
              </tr>
              <tr className="bg-white border-b border-slate-200 text-[8px] text-slate-500 font-bold">
                <th colSpan={3} className="border-r p-1 text-center bg-slate-50/20">Nhiều lựa chọn</th>
                <th colSpan={3} className="border-r p-1 text-center bg-slate-50/20">"Đúng - Sai"</th>
                <th colSpan={3} className="border-r p-1 text-center bg-slate-50/20">Trả lời ngắn</th>
                <th colSpan={3} className="border-r p-1 text-center">Tự luận</th>
              </tr>
              <tr className="bg-slate-50/30 text-[8px] text-slate-400 font-bold text-center border-b border-slate-200">
                <td colSpan={4}></td>
                <td className="border-r">Biết</td><td className="border-r">Hiểu</td><td className="border-r">Vận</td>
                <td className="border-r">Biết</td><td className="border-r">Hiểu</td><td className="border-r">Vận</td>
                <td className="border-r">Biết</td><td className="border-r">Hiểu</td><td className="border-r">Vận</td>
                <td className="border-r">Biết</td><td className="border-r">Hiểu</td><td className="border-r">Vận</td>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {matrixRows.map((row, idx) => {
                const aiRequirement = specData.find(s => s.unit === row.unit)?.requirements;
                return (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="border-r p-2 text-center font-bold text-slate-400">{idx + 1}</td>
                    {topicRowSpans[idx] !== undefined && (
                      <td rowSpan={topicRowSpans[idx]} className="border-r p-2 text-left font-bold text-slate-800 bg-slate-50/10 align-middle leading-tight">
                        {row.topic}
                      </td>
                    )}
                    <td className="border-r p-2 text-left font-semibold text-slate-700 align-top">{row.unit}</td>
                    <td className="border-r p-2 text-justify text-slate-600 text-[9px] leading-relaxed whitespace-pre-wrap">
                      {isGenerating ? (
                        <div className="flex items-center gap-2 text-slate-300 italic">
                          <Loader2 size={12} className="animate-spin" /> Đang trích xuất YCCĐ...
                        </div>
                      ) : (aiRequirement || "AI không trích xuất được yêu cầu tương ứng.")}
                    </td>
                    
                    <td className="border-r p-1 text-center bg-white">{row.mcq.recognition || ''}</td>
                    <td className="border-r p-1 text-center bg-white">{row.mcq.understanding || ''}</td>
                    <td className="border-r p-1 text-center bg-white">{row.mcq.application || ''}</td>
                    
                    <td className="border-r p-1 text-center bg-slate-50/20">{row.tf.recognition || ''}</td>
                    <td className="border-r p-1 text-center bg-slate-50/20">{row.tf.understanding || ''}</td>
                    <td className="border-r p-1 text-center bg-slate-50/20">{row.tf.application || ''}</td>
                    
                    <td className="border-r p-1 text-center bg-white">{row.short.recognition || ''}</td>
                    <td className="border-r p-1 text-center bg-white">{row.short.understanding || ''}</td>
                    <td className="border-r p-1 text-center bg-white">{row.short.application || ''}</td>
                    
                    <td className="border-r p-1 text-center bg-slate-50/20">{row.essay.recognition || ''}</td>
                    <td className="border-r p-1 text-center bg-slate-50/20">{row.essay.understanding || ''}</td>
                    <td className="border-r p-1 text-center bg-slate-50/20">{row.essay.application || ''}</td>
                  </tr>
                );
              })}
              <tr className="bg-slate-100 font-bold text-slate-800 text-[9px]">
                <td colSpan={4} className="border-r p-2 text-right uppercase tracking-wider">Tổng số câu</td>
                <td className="border-r p-1 text-center">{totals.mcq.rec}</td>
                <td className="border-r p-1 text-center">{totals.mcq.und}</td>
                <td className="border-r p-1 text-center">{totals.mcq.app}</td>
                <td className="border-r p-1 text-center">{totals.tf.rec}</td>
                <td className="border-r p-1 text-center">{totals.tf.und}</td>
                <td className="border-r p-1 text-center">{totals.tf.app}</td>
                <td className="border-r p-1 text-center">{totals.short.rec}</td>
                <td className="border-r p-1 text-center">{totals.short.und}</td>
                <td className="border-r p-1 text-center">{totals.short.app}</td>
                <td className="border-r p-1 text-center">{totals.essay.rec}</td>
                <td className="border-r p-1 text-center">{totals.essay.und}</td>
                <td className="border-r p-1 text-center">{totals.essay.app}</td>
              </tr>
              <tr className="bg-slate-200 font-bold text-slate-900 text-[9px]">
                <td colSpan={4} className="border-r p-2 text-right uppercase">Tổng số điểm</td>
                <td colSpan={3} className="border-r p-1 text-center">{( (totals.mcq.rec + totals.mcq.und + totals.mcq.app) * (setupInfo.mcqScore || 0.25) ).toFixed(1)}</td>
                <td colSpan={3} className="border-r p-1 text-center">{( (totals.tf.rec + totals.tf.und + totals.tf.app) * (setupInfo.tfScore || 1) ).toFixed(1)}</td>
                <td colSpan={3} className="border-r p-1 text-center">{( (totals.short.rec + totals.short.und + totals.short.app) * (setupInfo.shortScore || 0.25) ).toFixed(1)}</td>
                <td colSpan={3} className="border-r p-1 text-center">{( (totals.essay.rec + totals.essay.und + totals.essay.app) * (setupInfo.essayScore || 2) ).toFixed(1)}</td>
              </tr>
              <tr className="bg-emerald-600 font-extrabold text-white text-[10px]">
                <td colSpan={4} className="border-r p-2 text-right uppercase">Tỉ lệ % điểm</td>
                <td colSpan={3} className="border-r p-1 text-center">{setupInfo.percentKnow}%</td>
                <td colSpan={3} className="border-r p-1 text-center">{setupInfo.percentUnderstand}%</td>
                <td colSpan={3} className="border-r p-1 text-center">{( (totals.short.rec + totals.short.und + totals.short.app) * (setupInfo.shortScore || 0.25) * 10).toFixed(0)}%</td>
                <td colSpan={3} className="border-r p-1 text-center">{setupInfo.percentApply}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-4 pb-12">
        <button
          onClick={onBack}
          className="px-8 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 font-bold flex items-center gap-2 hover:bg-slate-50 shadow-sm"
        >
          <ChevronLeft size={18} /> Quay lại Ma trận
        </button>
        <button className="px-8 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 font-bold flex items-center gap-2 hover:bg-slate-50 shadow-sm">
          <Download size={18} className="text-emerald-600" /> Tải Đặc tả (Excel)
        </button>
        <button 
          onClick={() => onNext(specData)}
          className="px-10 py-3 bg-[#0d9488] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#0f766e] shadow-xl transition-all"
        >
          <CheckCircle size={18} /> Tiếp tục: Tạo Câu hỏi
          <ChevronRight size={18} />
        </button>
      </div>

      {isGenerating && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 max-w-sm text-center border border-emerald-100">
             <div className="w-16 h-16 border-4 border-emerald-50 border-t-emerald-600 rounded-full animate-spin"></div>
             <p className="font-extrabold text-slate-900">AI đang trích xuất Bản đặc tả...</p>
             <p className="text-xs text-slate-500 italic">Đang phân tích Phụ lục I để gắn kết các yêu cầu cần đạt với số lượng câu hỏi trong ma trận.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecificationTable;

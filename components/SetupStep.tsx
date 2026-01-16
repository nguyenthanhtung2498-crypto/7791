
import React, { useState } from 'react';
import { SUBJECTS, GRADES, EXAM_TYPES, Lesson } from '../types';
import { FileUp, Search, CheckCircle2, Loader2, Sparkles, ChevronRight } from 'lucide-react';
// @google/genai guidelines followed for initialization and content generation
import { GoogleGenAI, Type } from '@google/genai';

interface SetupStepProps {
  onComplete: (lessons: Lesson[], info: any) => void;
}

const SetupStep: React.FC<SetupStepProps> = ({ onComplete }) => {
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [examType, setExamType] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setIsAnalyzing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      // @ts-ignore
      const result = await window.mammoth.extractRawText({ arrayBuffer });
      const text = result.value;

      // Fix: Follow Google GenAI SDK guidelines for initialization
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Dưới đây là nội dung Phụ lục III kế hoạch dạy học môn ${subject} khối ${grade}. 
        Hãy phân tích nội dung này và trích xuất danh sách các bài học.
        Yêu cầu:
        1. Chỉ lấy các bài học thực tế có kiến thức.
        2. LOẠI BỎ hoàn toàn các tiết: Ôn tập, Kiểm tra, Đánh giá, Trả bài, Sinh hoạt.
        3. Định dạng kết quả là JSON array.
        
        Nội dung: ${text.substring(0, 8000)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                topic: { type: Type.STRING, description: "Tên chương hoặc chủ đề chính" },
                name: { type: Type.STRING, description: "Tên bài học cụ thể" },
                week: { type: Type.NUMBER, description: "Tuần thứ mấy" },
                periods: { type: Type.NUMBER, description: "Số tiết" }
              },
              required: ["topic", "name", "week", "periods"]
            }
          }
        }
      });

      const parsedLessons = JSON.parse(response.text || '[]').map((l: any) => ({
        ...l,
        id: Math.random().toString(36).substr(2, 9),
        selected: true
      }));

      setLessons(parsedLessons);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi phân tích file. Vui lòng thử lại.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleLesson = (id: string) => {
    setLessons(lessons.map(l => l.id === id ? { ...l, selected: !l.selected } : l));
  };

  const canContinue = subject && grade && examType && lessons.some(l => l.selected);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#475569]">Chọn môn học</label>
          <select 
            className="w-full bg-white border border-[#e2e8f0] rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#0d9488]"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">-- Môn học --</option>
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#475569]">Chọn khối lớp</label>
          <select 
            className="w-full bg-white border border-[#e2e8f0] rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#0d9488]"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          >
            <option value="">-- Khối --</option>
            {GRADES.map(g => <option key={g} value={g}>Khối {g}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#475569]">Loại bài thi</label>
          <select 
            className="w-full bg-white border border-[#e2e8f0] rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#0d9488]"
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
          >
            <option value="">-- Kỳ thi --</option>
            {EXAM_TYPES.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
          </select>
        </div>
      </div>

      <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${fileName ? 'border-emerald-200 bg-emerald-50' : 'border-[#e2e8f0] bg-white hover:border-[#0d9488]'}`}>
        <input 
          type="file" 
          id="fileInput" 
          hidden 
          accept=".docx"
          onChange={handleFileUpload}
        />
        <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-[#f1f5f9] rounded-full flex items-center justify-center text-[#64748b]">
            <FileUp size={32} />
          </div>
          <div>
            <p className="text-lg font-bold text-[#1e293b]">{fileName || 'Tải lên Phụ lục III (File Word)'}</p>
            <p className="text-sm text-[#64748b]">Kéo thả hoặc nhấp để chọn file .docx</p>
          </div>
        </label>
      </div>

      {isAnalyzing && (
        <div className="flex items-center justify-center gap-3 p-8 bg-white rounded-xl border border-[#e2e8f0]">
          <Loader2 className="animate-spin text-[#0d9488]" />
          <span className="font-medium text-[#1e293b]">AI đang đọc và phân tích danh mục bài học...</span>
        </div>
      )}

      {lessons.length > 0 && !isAnalyzing && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1e293b] flex items-center gap-2">
              <Sparkles className="text-amber-500" size={20} />
              Danh mục bài học phù hợp cho bài thi
            </h3>
            <span className="text-sm text-[#64748b]">Tích chọn các bài sẽ có trong ma trận đề</span>
          </div>

          <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-sm">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 sticky top-0 border-b border-[#e2e8f0]">
                  <tr>
                    <th className="p-4 w-10"></th>
                    <th className="p-4 text-xs font-bold text-[#64748b] uppercase">Tuần</th>
                    <th className="p-4 text-xs font-bold text-[#64748b] uppercase">Tiết</th>
                    <th className="p-4 text-xs font-bold text-[#64748b] uppercase">Bài học</th>
                    <th className="p-4 text-xs font-bold text-[#64748b] uppercase">Chủ đề</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {lessons.map(l => (
                    <tr 
                      key={l.id} 
                      className={`hover:bg-slate-50 cursor-pointer transition-colors ${l.selected ? 'bg-emerald-50/30' : ''}`}
                      onClick={() => toggleLesson(l.id)}
                    >
                      <td className="p-4">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${l.selected ? 'bg-[#0d9488] border-[#0d9488] text-white' : 'border-slate-300 bg-white'}`}>
                          {l.selected && <CheckCircle2 size={14} />}
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium text-[#64748b]">{l.week}</td>
                      <td className="p-4 text-sm font-medium text-[#64748b]">{l.periods}</td>
                      <td className="p-4 text-sm font-bold text-[#1e293b]">{l.name}</td>
                      <td className="p-4 text-xs font-medium text-[#64748b]">{l.topic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={() => onComplete(lessons, { subject, grade, examType })}
              disabled={!canContinue}
              className="px-12 py-4 bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Tiếp tục: Tạo ma trận theo CV 7791
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupStep;


import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  Loader2, 
  ChevronLeft, 
  Download, 
  RefreshCw, 
  Edit3, 
  CheckCircle,
  FileText,
  RotateCcw,
  Check,
  ChevronRight
} from 'lucide-react';
import { MatrixRow, SetupInfo, Question } from '../types';
import { geminiService } from '../services/gemini';

interface ExamEditorProps {
  matrixRows: MatrixRow[];
  setupInfo: SetupInfo;
  specData: any[];
  onBack: () => void;
  onNext: (questions: Question[]) => void;
}

const MATH_SYMBOLS = [
  { label: 'x²', tex: 'x^2' },
  { label: 'xⁿ', tex: 'x^n' },
  { label: 'X₁', tex: 'x_1' },
  { label: 'Xₙ', tex: 'x_n' },
  { label: 'a/b', tex: '\\frac{a}{b}' },
  { label: '√x', tex: '\\sqrt{x}' },
  { label: '×', tex: '\\times' },
  { label: '÷', tex: '\\div' },
  { label: 'π', tex: '\\pi' },
  { label: 'α', tex: '\\alpha' },
  { label: 'β', tex: '\\beta' },
  { label: 'Δ', tex: '\\Delta' },
  { label: 'Ω', tex: '\\Omega' },
  { label: '°', tex: '^{\\circ}' },
  { label: '→', tex: '\\rightarrow' },
  { label: '⇒', tex: '\\Rightarrow' },
  { label: '≤', tex: '\\le' },
  { label: '≥', tex: '\\ge' },
  { label: '≈', tex: '\\approx' },
  { label: '≠', tex: '\\neq' },
  { label: '#', tex: '\\#' },
  { label: '∞', tex: '\\infty' },
  { label: 'Σ', tex: '\\Sigma' },
  { label: '∈', tex: '\\in' },
  { label: '⊂', tex: '\\subset' }
];

const ExamEditor: React.FC<ExamEditorProps> = ({ matrixRows, setupInfo, specData, onBack, onNext }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [unitsLoading, setUnitsLoading] = useState<{ [key: string]: boolean }>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAllGenerating, setIsAllGenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const unitsToProcess = useMemo(() => {
    return matrixRows.filter(row => 
      row.mcq.recognition + row.mcq.understanding + row.mcq.application +
      row.tf.recognition + row.tf.understanding + row.tf.application +
      row.short.recognition + row.short.understanding + row.short.application +
      row.essay.recognition + row.essay.understanding + row.essay.application > 0
    );
  }, [matrixRows]);

  const triggerMathJax = () => {
    if ((window as any).MathJax) {
      setTimeout(() => {
        (window as any).MathJax.typesetPromise();
      }, 100);
    }
  };

  const generateAllQuestions = async () => {
    setIsAllGenerating(true);
    setQuestions([]);
    
    const initialLoading: { [key: string]: boolean } = {};
    unitsToProcess.forEach(u => initialLoading[u.unit] = true);
    setUnitsLoading(initialLoading);

    for (const unit of unitsToProcess) {
      try {
        const spec = specData.find(s => s.unit === unit.unit)?.requirements || "Phân bổ theo chuẩn kiến thức.";
        const unitQuestions = await geminiService.generateQuestions(unit.unit, unit, spec, setupInfo);
        setQuestions(prev => [...prev, ...unitQuestions]);
      } catch (error) {
        console.error(`Lỗi tạo câu hỏi cho ${unit.unit}`, error);
      } finally {
        setUnitsLoading(prev => ({ ...prev, [unit.unit]: false }));
      }
    }
    setIsAllGenerating(false);
  };

  useEffect(() => {
    if (questions.length === 0) {
      generateAllQuestions();
    }
  }, []);

  useEffect(() => {
    triggerMathJax();
  }, [questions, editingId, isAllGenerating]);

  const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const insertSymbol = (symbolTex: string) => {
    if (!textareaRef.current || !editingId) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const q = questions.find(q => q.id === editingId);
    if (!q) return;

    const content = q.content;
    const inserted = `$${symbolTex}$`;
    const newContent = content.substring(0, start) + inserted + content.substring(end);
    
    handleUpdateQuestion(editingId, { content: newContent });
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + inserted.length, start + inserted.length);
      }
    }, 10);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 uppercase flex items-center gap-3">
          C. ĐỀ KIỂM TRA & ĐÁP ÁN
        </h2>
        <button 
          onClick={generateAllQuestions}
          className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all text-xs font-bold"
        >
          Tạo lại tất cả
        </button>
      </div>

      {isAllGenerating && questions.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl border border-slate-200 shadow-xl flex flex-col items-center justify-center gap-8 min-h-[400px]">
           <div className="text-center space-y-4">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">AI đang soạn thảo câu hỏi...</h2>
              <p className="text-slate-500 italic text-sm">Vui lòng đợi trong giây lát</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
              {unitsToProcess.map(u => (
                <div key={u.unit} className={`p-4 rounded-2xl border-2 flex items-center justify-between ${unitsLoading[u.unit] ? 'bg-white border-emerald-400 animate-pulse' : 'bg-white border-slate-100'}`}>
                   <div>
                      <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{u.topic}</p>
                      <p className="text-xs font-bold text-slate-800 truncate max-w-[150px]">{u.unit}</p>
                   </div>
                   {unitsLoading[u.unit] ? <div className="w-4 h-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div> : <CheckCircle size={18} className="text-emerald-500" />}
                </div>
              ))}
           </div>
        </div>
      ) : (
        <div className="space-y-12 bg-white p-12 rounded-3xl border border-slate-200 shadow-xl">
           <div className="text-center space-y-4 mb-12 border-b border-slate-100 pb-8">
              <div className="flex justify-between items-start text-xs font-bold text-slate-800 uppercase">
                 <div className="text-left leading-relaxed">
                    {setupInfo.schoolName || "TRƯỜNG THPT SỐ 3 BẢO THẮNG"}<br/>
                    <span className="underline decoration-1 underline-offset-4">{setupInfo.department || "TỔ CHUYÊN MÔN"}</span>
                 </div>
                 <div className="text-right leading-relaxed">
                    MA TRẬN KIỂM TRA {setupInfo.examType.toUpperCase()}<br/>
                    MÔN {setupInfo.subject.toUpperCase()} {setupInfo.grade}<br/>
                    NĂM HỌC {setupInfo.schoolYear || "2026 - 2027"}<br/>
                    MÔN: {setupInfo.subject.toUpperCase()}<br/>
                    <span className="italic font-medium normal-case">Thời gian làm bài: {setupInfo.duration}</span>
                 </div>
              </div>
           </div>

           {unitsToProcess.map((unit, uIdx) => {
             const unitQuestions = questions.filter(q => q.unit === unit.unit);
             if (unitQuestions.length === 0) return null;
             return (
               <div key={unit.unit} className="space-y-6">
                  <h3 className="text-emerald-700 font-bold text-sm uppercase flex items-center gap-2">
                     <span className="text-slate-400">{uIdx + 1}.</span> {unit.unit} ({unit.topic})
                  </h3>
                  <div className="space-y-8">
                     {unitQuestions.map((q, qIdx) => (
                       <div key={q.id} className="relative group pl-8">
                          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => setEditingId(editingId === q.id ? null : q.id)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg">
                                <Edit3 size={16} />
                             </button>
                          </div>
                          
                          <div className="absolute top-0 right-12 bg-slate-100 text-[10px] font-bold text-slate-400 px-1.5 py-0.5 rounded uppercase">
                             {q.level}
                          </div>

                          <div className="space-y-4">
                             <div className="flex gap-2">
                                <span className="font-bold text-slate-900 min-w-[3.5rem]">Câu {qIdx + 1}:</span>
                                {editingId === q.id ? (
                                  <div className="flex-1 space-y-3">
                                     <div className="flex flex-wrap gap-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                        {MATH_SYMBOLS.map(sym => (
                                          <button key={sym.label} onClick={() => insertSymbol(sym.tex)} className="px-2 py-1 bg-white border border-slate-200 rounded text-[9px] hover:border-emerald-500">{sym.label}</button>
                                        ))}
                                     </div>
                                     <textarea 
                                       ref={textareaRef}
                                       className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500/20"
                                       rows={3}
                                       value={q.content}
                                       onChange={(e) => handleUpdateQuestion(q.id, { content: e.target.value })}
                                     />
                                     <div className="flex justify-end">
                                        <button onClick={() => setEditingId(null)} className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold">Hoàn tất</button>
                                     </div>
                                  </div>
                                ) : (
                                  <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">{q.content}</p>
                                )}
                             </div>

                             {q.type === 'MCQ' && q.options && (
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 pl-16">
                                  {q.options.map((opt, oIdx) => (
                                    <div key={oIdx} className="flex gap-2 text-sm">
                                       <span className="font-bold text-slate-800">{String.fromCharCode(65 + oIdx)}.</span>
                                       <span className={`${q.answer === String.fromCharCode(65 + oIdx) ? 'text-emerald-700 font-bold' : 'text-slate-600'}`}>{opt}</span>
                                    </div>
                                  ))}
                               </div>
                             )}

                             {q.type === 'TF' && (
                                <div className="pl-16 p-3 bg-emerald-50/30 rounded-xl border border-emerald-100">
                                   <p className="text-[10px] font-bold text-emerald-600 uppercase mb-2">Đáp án:</p>
                                   <div className="flex gap-4">
                                      {q.answer.map((ans: boolean, aIdx: number) => (
                                        <div key={aIdx} className="flex gap-1.5 items-center">
                                           <span className="text-xs font-bold text-slate-400">{String.fromCharCode(97 + aIdx)})</span>
                                           <span className={`text-[10px] font-bold ${ans ? 'text-emerald-600' : 'text-red-500'}`}>{ans ? 'Đúng' : 'Sai'}</span>
                                        </div>
                                      ))}
                                   </div>
                                </div>
                             )}
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
             );
           })}
        </div>
      )}

      <div className="flex justify-center gap-4 pt-4 pb-20">
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-700 font-bold text-sm"
        >
          Quay lại
        </button>
        <button 
          onClick={() => onNext(questions)}
          disabled={questions.length === 0 || isAllGenerating}
          className="px-8 py-2.5 bg-[#0d9488] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#0f766e] transition-all text-sm disabled:opacity-50"
        >
          Tiếp tục: 5. Xem & Tải về
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default ExamEditor;

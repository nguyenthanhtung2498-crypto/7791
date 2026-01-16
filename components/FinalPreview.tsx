
import React, { useEffect } from 'react';
import { Download, ChevronLeft, FileText, Printer } from 'lucide-react';
import { SetupInfo, Question } from '../types';

interface FinalPreviewProps {
  questions: Question[];
  setupInfo: SetupInfo;
  onBack: () => void;
}

const FinalPreview: React.FC<FinalPreviewProps> = ({ questions, setupInfo, onBack }) => {
  useEffect(() => {
    if ((window as any).MathJax) {
      (window as any).MathJax.typesetPromise();
    }
  }, []);

  const mcqs = questions.filter(q => q.type === 'MCQ');
  const tfs = questions.filter(q => q.type === 'TF');
  const shorts = questions.filter(q => q.type === 'SHORT');
  const essays = questions.filter(q => q.type === 'ESSAY');

  const handleDownload = () => {
    const filename = `DE_THI_${setupInfo.subject.toUpperCase()}_${setupInfo.grade}_${setupInfo.examType.replace(/\s+/g, '_')}.doc`;
    alert(`Đang khởi tạo tải xuống file: ${filename}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
         <h2 className="text-emerald-800 font-bold flex items-center gap-2">
            <FileText size={20} /> Xuất Đề thi & Đáp án
         </h2>
         <div className="flex gap-3">
            <button onClick={() => window.print()} className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-50">
               <Printer size={16} /> In đề thi
            </button>
            <button onClick={handleDownload} className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-100">
               <Download size={16} /> Tải file Word (.doc)
            </button>
         </div>
      </div>

      <div className="flex justify-center bg-slate-200/50 p-8 rounded-3xl overflow-x-auto">
        <div className="paper-view">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="text-center w-5/12">
              <p className="font-bold text-[14pt] leading-tight uppercase">{setupInfo.schoolName || "TRƯỜNG THPT SỐ 3 BẢO THẮNG"}</p>
              <p className="font-bold text-[13pt] leading-tight uppercase underline decoration-1 underline-offset-4">{setupInfo.department || "TỔ CHUYÊN MÔN"}</p>
            </div>
            <div className="text-center w-6/12">
              <p className="font-bold text-[14pt] leading-tight uppercase">MA TRẬN KIỂM TRA CUỐI HỌC KÌ 1</p>
              <p className="font-bold text-[14pt] leading-tight uppercase">MÔN {setupInfo.subject.toUpperCase()} {setupInfo.grade}</p>
              <p className="font-bold text-[13pt] leading-tight uppercase">NĂM HỌC {setupInfo.schoolYear || "2026 - 2027"}</p>
              <p className="font-bold text-[13pt] leading-tight uppercase">MÔN: {setupInfo.subject.toUpperCase()}</p>
              <p className="italic text-[12pt] leading-tight">Thời gian làm bài: {setupInfo.duration}</p>
            </div>
          </div>

          <div className="flex justify-between items-end mb-12 border-b-2 border-dotted pb-2 text-[12pt]">
            <div className="w-2/3">Họ và tên: ............................................................</div>
            <div className="w-1/4">Số báo danh: ...........................</div>
            <div className="font-bold">Mã đề {setupInfo.testCode || "301"}</div>
          </div>

          {/* Section A */}
          <div className="space-y-6">
            <h3 className="font-bold text-[13pt] uppercase">A. PHẦN TRẮC NGHIỆM KHÁCH QUAN (6 ĐIỂM)</h3>
            
            {mcqs.length > 0 && (
              <div className="space-y-4">
                <p className="font-bold italic text-[12pt]">I. Trắc nghiệm nhiều lựa chọn</p>
                {mcqs.map((q, idx) => (
                  <div key={q.id} className="space-y-2 text-[12pt]">
                    <p><span className="font-bold">Câu {idx + 1}:</span> {q.content}</p>
                    <div className="grid grid-cols-2 gap-x-12 pl-4">
                      {q.options?.map((opt, oIdx) => (
                        <p key={oIdx}><span className="font-bold">{String.fromCharCode(65 + oIdx)}.</span> {opt}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tfs.length > 0 && (
              <div className="space-y-4">
                <p className="font-bold italic text-[12pt]">II. Câu hỏi đúng sai</p>
                {tfs.map((q, idx) => (
                  <div key={q.id} className="space-y-2 text-[12pt]">
                    <p><span className="font-bold">Câu {idx + mcqs.length + 1}:</span> {q.content}</p>
                  </div>
                ))}
              </div>
            )}

            {shorts.length > 0 && (
              <div className="space-y-4">
                <p className="font-bold italic text-[12pt]">III. Trả lời ngắn</p>
                {shorts.map((q, idx) => (
                  <div key={q.id} className="space-y-2 text-[12pt]">
                    <p><span className="font-bold">Câu {idx + mcqs.length + tfs.length + 1}:</span> {q.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section B */}
          {essays.length > 0 && (
            <div className="mt-8 space-y-6">
              <h3 className="font-bold text-[13pt] uppercase">B. PHẦN TỰ LUẬN (4 ĐIỂM)</h3>
              {essays.map((q, idx) => (
                <div key={q.id} className="space-y-2 text-[12pt]">
                  <p><span className="font-bold">Câu {idx + mcqs.length + tfs.length + shorts.length + 1}:</span> {q.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Page Break for Answer Key */}
          <div className="mt-20 border-t-2 border-slate-200 pt-12">
            <h2 className="text-center font-bold text-[14pt] uppercase mb-8 underline decoration-2 underline-offset-8">ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM</h2>
            
            <p className="font-bold uppercase text-[12pt] mb-4">PHẦN I. TRẮC NGHIỆM NHIỀU LỰA CHỌN</p>
            <table className="w-full border-collapse border border-black text-center text-[12pt] mb-8">
               <tbody>
                  <tr className="bg-slate-50 font-bold">
                    {Array.from({ length: Math.min(10, mcqs.length) }).map((_, i) => <td key={i} className="border border-black p-2">{i+1}</td>)}
                  </tr>
                  <tr>
                    {mcqs.slice(0, 10).map((q, i) => <td key={i} className="border border-black p-2 font-bold">{q.answer}</td>)}
                  </tr>
                  {mcqs.length > 10 && (
                    <>
                      <tr className="bg-slate-50 font-bold">
                        {Array.from({ length: mcqs.length - 10 }).map((_, i) => <td key={i} className="border border-black p-2">{i+11}</td>)}
                      </tr>
                      <tr>
                        {mcqs.slice(10).map((q, i) => <td key={i} className="border border-black p-2 font-bold">{q.answer}</td>)}
                      </tr>
                    </>
                  )}
               </tbody>
            </table>

            {tfs.length > 0 && (
              <>
                <p className="font-bold uppercase text-[12pt] mb-4">PHẦN II. TRẮC NGHIỆM ĐÚNG SAI</p>
                <table className="w-full border-collapse border border-black text-left text-[11pt] mb-8">
                  <thead className="bg-slate-50 font-bold text-center">
                    <tr><td className="border border-black p-2 w-20">Câu</td><td className="border border-black p-2">Đáp án</td></tr>
                  </thead>
                  <tbody>
                    {tfs.map((q, idx) => (
                      <tr key={q.id}>
                        <td className="border border-black p-2 text-center font-bold">Câu {idx + 1}</td>
                        <td className="border border-black p-2">
                          {q.answer.map((ans: boolean, i: number) => (
                            <span key={i} className="mr-3">{String.fromCharCode(97 + i)}) <span className="font-bold">{ans ? 'Đúng' : 'Sai'}</span>{i < 3 ? ',' : ''}</span>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {shorts.length > 0 && (
              <>
                <p className="font-bold uppercase text-[12pt] mb-4">PHẦN III. TRẢ LỜI NGẮN</p>
                <table className="w-full border-collapse border border-black text-left text-[11pt] mb-8">
                  <thead className="bg-slate-50 font-bold text-center">
                    <tr><td className="border border-black p-2 w-20">Câu</td><td className="border border-black p-2">Đáp án</td></tr>
                  </thead>
                  <tbody>
                    {shorts.map((q, idx) => (
                      <tr key={q.id}>
                        <td className="border border-black p-2 text-center font-bold">Câu {idx + 1}</td>
                        <td className="border border-black p-2">{q.answer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {essays.length > 0 && (
              <>
                <p className="font-bold uppercase text-[12pt] mb-4">PHẦN IV. TỰ LUẬN</p>
                <div className="space-y-4 text-[12pt]">
                  {essays.map((q, idx) => (
                    <div key={q.id}>
                      <p className="font-bold">Câu {idx + 1}:</p>
                      <p className="text-justify italic text-slate-700">{q.explanation || "Đang cập nhật..."}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-8 pb-12">
         <button onClick={onBack} className="px-10 py-3 bg-white border border-slate-300 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50">
            <ChevronLeft size={18} /> Quay lại Chỉnh sửa đề
         </button>
      </div>
    </div>
  );
};

export default FinalPreview;

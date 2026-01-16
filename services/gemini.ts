
import { GoogleGenAI, Type } from '@google/genai';
import { Lesson, SetupInfo, MatrixRow, Question } from '../types';

class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  private handleApiError(error: any, context: string) {
    console.error(`Gemini Service Error during [${context}]:`, error);
    const message = error.message || '';
    if (message.includes('API_KEY_INVALID') || message.includes('401') || message.includes('403')) {
      return new Error('API Key không chính xác hoặc đã hết hạn.');
    }
    if (message.includes('quota') || message.includes('429')) {
      return new Error('Hết lượt sử dụng miễn phí. Vui lòng đợi 1 phút.');
    }
    return new Error(`Lỗi hệ thống khi ${context}. Vui lòng thử lại.`);
  }

  async analyzeSyllabus(text: string, subject: string, grade: string, examType: string): Promise<Lesson[]> {
    try {
      const ai = this.getAI();
      let weekRange = "";
      if (examType.includes("Giữa học kỳ I")) weekRange = "Tuần 1-9";
      else if (examType.includes("Cuối học kỳ I")) weekRange = "Tuần 1-18";
      else if (examType.includes("Giữa học kỳ II")) weekRange = "Tuần 19-27";
      else if (examType.includes("Cuối học kỳ II")) weekRange = "Tuần 19-35";

      const prompt = `Phân tích Phụ lục III môn ${subject} lớp ${grade}, kỳ thi ${examType} (${weekRange}). 
      Trích xuất danh sách bài học (Nội dung kiến thức mới). 
      BỎ QUA: Ôn tập, Kiểm tra, Đánh giá, Trả bài.
      Trả về JSON Array<{topic: string, name: string, week: number, periods: number}>.
      VĂN BẢN: ${text.substring(0, 15000)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      const data = JSON.parse(response.text || '[]');
      return data.map((item: any) => ({ ...item, id: Math.random().toString(36).substr(2, 9), selected: true }));
    } catch (error) {
      throw this.handleApiError(error, 'phân tích Phụ lục III');
    }
  }

  async suggestMatrixDistribution(lessons: Lesson[], setupInfo: SetupInfo): Promise<any[]> {
    try {
      const ai = this.getAI();
      const isSem1 = setupInfo.examType.includes("I") && !setupInfo.examType.includes("II");
      const threshold = isSem1 ? 9 : 27;

      const prompt = `Lập ma trận đề thi ${setupInfo.subject} ${setupInfo.grade}, ${setupInfo.examType} theo CV 7791.
      
      CẤU TRÚC TỔNG:
      - MCQ (4 lựa chọn): ${setupInfo.mcqCount} câu.
      - TF (Đúng/Sai): ${setupInfo.tfCount} câu (mỗi câu 4 ý nhỏ).
      - Short (Trả lời ngắn): ${setupInfo.shortCount} câu.
      - Essay (Tự luận): ${setupInfo.essayCount} câu (mỗi câu 2 ý nhỏ).
      - Tỉ lệ điểm: ${setupInfo.percentKnow}% Biết, ${setupInfo.percentUnderstand}% Hiểu, ${setupInfo.percentApply}% Vận dụng.

      QUY TẮC PHÂN BỔ:
      1. 1 câu = 1 yêu cầu cần đạt (YCCĐ).
      2. Nếu CUỐI KỲ: 20% điểm (2đ) cho các bài trước/bằng tuần ${threshold}. 80% điểm (8đ) cho các bài sau tuần ${threshold}.
      3. Tổng số câu các dòng cộng lại phải khớp chính xác với cấu trúc tổng.
      4. Phân bổ câu hỏi dựa trên số tiết (periods).

      DANH SÁCH BÀI HỌC: 
      ${lessons.map(l => `- ${l.name} (Tuần ${l.week}, ${l.periods} tiết, Chủ đề: ${l.topic})`).join('\n')}
      
      NỘI DUNG YCCĐ: ${setupInfo.requirementsText?.substring(0, 6000) || "Phân bổ theo chuẩn kiến thức."}

      TRẢ VỀ JSON MẢNG: Array<{unit: string, mcq: {recognition: number, understanding: number, application: number}, tf: {recognition: number, understanding: number, application: number}, short: {recognition: number, understanding: number, application: number}, essay: {recognition: number, understanding: number, application: number}}>`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      return JSON.parse(response.text || '[]');
    } catch (error) {
      throw this.handleApiError(error, 'tính toán ma trận chi tiết');
    }
  }

  async generateSpecification(matrixRows: MatrixRow[], setupInfo: SetupInfo): Promise<any[]> {
    try {
      const ai = this.getAI();
      const prompt = `Xây dựng BẢN ĐẶC TẢ ĐỀ KIỂM TRA môn ${setupInfo.subject} lớp ${setupInfo.grade} theo CV 7791.
      Dựa vào Ma trận đã lập và nội dung Phụ lục I dưới đây, hãy trích xuất các Yêu cầu cần đạt tương ứng cho từng mức độ (Biết, Hiểu, Vận dụng) của mỗi bài.

      NỘI DUNG MA TRẬN:
      ${matrixRows.map(r => `- Bài: ${r.unit}, MCQ: ${JSON.stringify(r.mcq)}, TF: ${JSON.stringify(r.tf)}, Short: ${JSON.stringify(r.short)}, Essay: ${JSON.stringify(r.essay)}`).join('\n')}

      NỘI DUNG PHỤ LỤC I (YCCĐ):
      ${setupInfo.requirementsText?.substring(0, 8000)}

      YÊU CẦU:
      1. Với mỗi bài, tóm tắt các YCCĐ tương ứng với số câu hỏi đã phân bổ.
      2. Nếu 1 bài có câu hỏi mức "Biết", hãy liệt kê các YCCĐ ở mức "Biết". Tương tự với "Hiểu" và "Vận dụng".
      3. Đảm bảo ngôn ngữ chuẩn sư phạm.
      
      TRẢ VỀ JSON MẢNG: Array<{unit: string, requirements: string}>`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      return JSON.parse(response.text || '[]');
    } catch (error) {
      throw this.handleApiError(error, 'tạo bản đặc tả chi tiết');
    }
  }

  async generateQuestions(unitName: string, matrixRow: MatrixRow, specRequirement: string, setupInfo: SetupInfo): Promise<Question[]> {
    try {
      const ai = this.getAI();
      const prompt = `Bạn là chuyên gia soạn thảo đề thi môn ${setupInfo.subject} lớp ${setupInfo.grade}.
      Hãy soạn thảo các câu hỏi cho ĐƠN VỊ KIẾN THỨC: "${unitName}".
      
      YÊU CẦU CẦN ĐẠT CẦN BÁM SÁT:
      ${specRequirement}

      SỐ LƯỢNG VÀ MỨC ĐỘ CẦN TẠO CHO ĐƠN VỊ NÀY (BẮT BUỘC KHỚP):
      - Trắc nghiệm (MCQ): Biết=${matrixRow.mcq.recognition}, Hiểu=${matrixRow.mcq.understanding}, Vận dụng=${matrixRow.mcq.application}
      - Đúng/Sai (TF): Biết=${matrixRow.tf.recognition}, Hiểu=${matrixRow.tf.understanding}, Vận dụng=${matrixRow.tf.application}
      - Trả lời ngắn (SHORT): Biết=${matrixRow.short.recognition}, Hiểu=${matrixRow.short.understanding}, Vận dụng=${matrixRow.short.application}
      - Tự luận (ESSAY): Biết=${matrixRow.essay.recognition}, Hiểu=${matrixRow.essay.understanding}, Vận dụng=${matrixRow.essay.application}

      QUY ĐỊNH SOẠN THẢO:
      1. Với các môn tự nhiên (Toán, Lý, Hóa, Sinh), các công thức toán học PHẢI bao bọc trong dấu $, ví dụ: $x^2 + 1 = 0$, $H_2SO_4$.
      2. MCQ: Phải có 4 lựa chọn A, B, C, D. Đáp án là 'A', 'B', 'C' hoặc 'D'.
      3. TF: Một câu Đúng/Sai gồm 4 ý nhỏ. Đáp án là mảng 4 giá trị boolean [true, false, true, false].
      4. Câu hỏi phải hay, bám sát thực tế và yêu cầu cần đạt.

      TRẢ VỀ JSON MẢNG Question:
      Array<{
        id: string (random),
        unit: string (tên bài),
        type: 'MCQ' | 'TF' | 'SHORT' | 'ESSAY',
        level: 'NB' | 'TH' | 'VD',
        content: string,
        options?: string[] (chỉ cho MCQ, mảng 4 chuỗi),
        answer: any (theo quy định trên),
        explanation: string
      }>`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      return JSON.parse(response.text || '[]');
    } catch (error) {
      throw this.handleApiError(error, `soạn câu hỏi cho bài ${unitName}`);
    }
  }
}

export const geminiService = new GeminiService();

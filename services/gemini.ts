
import { GoogleGenAI, Type } from '@google/genai';
import { Lesson, SetupInfo } from '../types';

/**
 * GeminiService: Lớp dịch vụ xử lý các tương tác với Google Gemini API.
 * Tuân thủ hướng dẫn: Sử dụng process.env.GEMINI_API_KEY và các model Gemini 3.
 */
class GeminiService {
  private getAI() {
    // Luôn lấy API Key từ môi trường (được Vercel/System cấu hình)
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
  }

  /**
   * Phân tích nội dung Phụ lục III từ văn bản thô (Word)
   */
  async analyzeSyllabus(text: string, subject: string, grade: string): Promise<Lesson[]> {
    const ai = this.getAI();
    const prompt = `Dưới đây là nội dung Phụ lục III kế hoạch dạy học môn ${subject} khối ${grade}. 
    Hãy phân tích nội dung này và trích xuất danh sách các bài học thực tế.
    
    YÊU CẦU NGHIÊM NGẶT:
    1. Chỉ lấy các bài học thực tế có nội dung kiến thức.
    2. LOẠI BỎ hoàn toàn các tiết: Ôn tập, Kiểm tra, Đánh giá, Trả bài, Sinh hoạt, Dự phòng.
    3. Trả về dưới dạng mảng JSON.
    
    NỘI DUNG VĂN BẢN:
    ${text.substring(0, 10000)}`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', // Flash phù hợp cho việc trích xuất thông tin nhanh
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                topic: { type: Type.STRING, description: "Tên chương hoặc chủ đề lớn" },
                name: { type: Type.STRING, description: "Tên bài học cụ thể" },
                week: { type: Type.NUMBER, description: "Tuần học" },
                periods: { type: Type.NUMBER, description: "Số tiết học của bài" }
              },
              required: ["topic", "name", "week", "periods"]
            }
          }
        }
      });

      const data = JSON.parse(response.text || '[]');
      return data.map((item: any) => ({
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        selected: true
      }));
    } catch (error) {
      console.error('Gemini analyzeSyllabus Error:', error);
      throw new Error('Không thể phân tích Phụ lục III. Vui lòng kiểm tra định dạng file.');
    }
  }

  /**
   * Gợi ý phân bổ ma trận đề thi dựa trên các bài học đã chọn
   */
  async suggestMatrixDistribution(
    lessons: Lesson[], 
    setupInfo: SetupInfo
  ): Promise<any[]> {
    const ai = this.getAI();
    const prompt = `Bạn là một chuyên gia khảo thí. Hãy lập ma trận phân bổ câu hỏi cho môn ${setupInfo.subject} lớp ${setupInfo.grade}.
    Kỳ thi: ${setupInfo.examType}.
    Tổng số câu hỏi mục tiêu: 40 câu (mỗi câu 0.25 điểm).
    Tỷ lệ yêu cầu: ${setupInfo.percentKnow}% Nhận biết - ${setupInfo.percentUnderstand}% Thông hiểu - ${setupInfo.percentApply}% Vận dụng & Vận dụng cao.
    Độ khó mục tiêu: ${setupInfo.difficulty}.
    
    Danh sách các bài học đã chọn:
    ${lessons.map(l => `- ${l.name} (${l.topic})`).join('\n')}
    
    Hãy phân bổ số câu hỏi vào 4 mức độ cho từng bài học sao cho tổng cộng đúng 40 câu và sát với tỷ lệ mục tiêu nhất có thể.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Pro cho các tác vụ suy luận/tính toán phức tạp
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                unit: { type: Type.STRING },
                recognition: { type: Type.NUMBER },
                understanding: { type: Type.NUMBER },
                application: { type: Type.NUMBER },
                highApplication: { type: Type.NUMBER }
              },
              required: ["unit", "recognition", "understanding", "application", "highApplication"]
            }
          }
        }
      });

      return JSON.parse(response.text || '[]');
    } catch (error) {
      console.error('Gemini suggestMatrix Error:', error);
      throw new Error('Lỗi khi AI tính toán ma trận. Vui lòng thử lại.');
    }
  }
}

export const geminiService = new GeminiService();

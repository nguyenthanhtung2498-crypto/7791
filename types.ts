
export interface Lesson {
  id: string;
  name: string;
  week: number;
  periods: number;
  topic: string;
  selected: boolean;
}

export interface QuestionLevel {
  recognition: number;
  understanding: number;
  application: number;
}

export interface MatrixRow {
  id: string;
  topic: string;
  unit: string;
  mcq: QuestionLevel;
  tf: QuestionLevel;
  short: QuestionLevel;
  essay: QuestionLevel;
  totalKnow: number;
  totalUnderstand: number;
  totalApply: number;
  percentage: number;
}

export type QuestionType = 'MCQ' | 'TF' | 'SHORT' | 'ESSAY';
export type Level = 'NB' | 'TH' | 'VD' | 'VDC';

export interface Question {
  id: string;
  unit: string;
  type: QuestionType;
  level: Level;
  content: string;
  options?: string[]; // Cho MCQ
  answer: any; // Chuỗi cho MCQ/Short, Array Boolean cho TF, Chuỗi cho Essay
  explanation?: string;
}

export type UserRole = 'admin' | 'teacher';

export interface User {
  username: string;
  ip: string;
  role: UserRole;
}

export interface SetupInfo {
  subject: string;
  grade: string;
  examType: string;
  schoolName?: string;
  department?: string;
  examName?: string;
  schoolYear?: string;
  duration?: string;
  testCode?: string;
  difficulty?: string;
  mcqCount?: number;
  mcqScore?: number;
  tfCount?: number;
  tfScore?: number;
  shortCount?: number;
  shortScore?: number;
  essayCount?: number;
  essayScore?: number;
  percentKnow?: number;
  percentUnderstand?: number;
  percentApply?: number;
  syllabusText?: string;
  requirementsText?: string;
}

export type AppStep = 'LOGIN' | 'SETUP' | 'CONFIG' | 'MATRIX' | 'SPECIFICATION' | 'EXAM' | 'PREVIEW';

export const SUBJECTS = [
  'KHTN', 'TOÁN', 'NGỮ VĂN', 'TIẾNG ANH', 'GDCD', 'LS-ĐL', 'CÔNG NGHỆ'
];

export const GRADES = ['6', '7', '8', '9'];

export const EXAM_TYPES = [
  { id: 'GKI', name: 'Giữa học kỳ I' },
  { id: 'CKI', name: 'Cuối học kỳ I' },
  { id: 'GKII', name: 'Giữa học kỳ II' },
  { id: 'CKII', name: 'Cuối học kỳ II' }
];

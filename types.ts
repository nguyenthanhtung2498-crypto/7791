
export interface Lesson {
  id: string;
  name: string;
  week: number;
  periods: number;
  topic: string;
  selected: boolean;
}

export interface MatrixRow {
  id: string;
  topic: string;
  unit: string;
  levels: {
    recognition: number;
    understanding: number;
    application: number;
    highApplication: number;
  };
  totalQuestions: number;
  score: number;
}

export interface User {
  username: string;
  ip: string;
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
}

export type AppStep = 'LOGIN' | 'SETUP' | 'CONFIG' | 'MATRIX';

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

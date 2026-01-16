
import React, { useState } from 'react';
import { User as UserIcon, Lock, AlertTriangle, AlertCircle, Shield, GraduationCap } from 'lucide-react';
import { UserRole } from '../types';

interface LoginProps {
  ip: string;
  onLogin: (username: string, role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ ip, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      onLogin(username, 'admin');
    } else if (username === 'teacher' && password === 'teacher123') {
      onLogin(username, 'teacher');
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không chính xác!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-[#f1f5f9]">
      {/* Logo */}
      <div className="mb-8 flex items-center justify-center">
        <div className="w-16 h-16 bg-[#0d9488] rounded-xl flex items-center justify-center text-white text-3xl font-bold italic shadow-lg">
          BΦ
        </div>
      </div>

      <h1 className="text-3xl font-bold text-[#1e293b] mb-2 text-center">Hệ thống tạo Đề thi</h1>
      <p className="text-[#64748b] mb-8 text-center max-w-xs uppercase text-xs font-bold tracking-widest">THCS Huỳnh Thúc Kháng - Hưng Thịnh</p>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-[#e2e8f0]">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-shake">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Tên đăng nhập</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <UserIcon size={18} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] outline-none text-[#1e293b] transition-all"
                placeholder="admin hoặc teacher"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Mật khẩu</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] outline-none text-[#1e293b] transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
            <div className="text-amber-500 shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-slate-600 uppercase">Địa chỉ IP:</span>
                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-mono font-bold">{ip}</span>
              </div>
              <p className="text-[10px] font-bold text-red-500 uppercase leading-tight italic">
                Lưu ý: Hệ thống chỉ hỗ trợ truy cập từ IP đã đăng ký.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#0d9488]/20 flex items-center justify-center gap-2 group"
          >
            Đăng nhập ngay
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 flex items-center gap-3">
          <div className="h-px bg-[#e2e8f0] flex-1"></div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap">Phân quyền tài khoản</span>
          <div className="h-px bg-[#e2e8f0] flex-1"></div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center gap-1">
            <Shield size={16} className="text-[#0d9488]" />
            <span className="text-[10px] font-bold text-slate-500">QUẢN TRỊ VIÊN</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center gap-1">
            <GraduationCap size={16} className="text-[#0d9488]" />
            <span className="text-[10px] font-bold text-slate-500">GIÁO VIÊN</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400 font-medium">
            Phát triển bởi <span className="text-slate-600">Thầy Tùng</span> • 0359.399.467
          </p>
        </div>
      </div>
    </div>
  );
};

// Simple utility icon for the button
const ChevronRight = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export default Login;

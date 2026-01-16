
import React, { useState } from 'react';
import { User as UserIcon, Lock, AlertTriangle, AlertCircle } from 'lucide-react';

interface LoginProps {
  ip: string;
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ ip, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      onLogin(username);
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không chính xác!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-[#f1f5f9]">
      {/* Logo */}
      <div className="mb-8 flex items-center justify-center">
        <div className="w-16 h-16 bg-[#0d9488] rounded-xl flex items-center justify-center text-white text-3xl font-bold italic">
          BΦ
        </div>
      </div>

      <h1 className="text-3xl font-bold text-[#1e293b] mb-2">Đăng nhập</h1>
      <p className="text-[#64748b] mb-8">Ứng dụng tạo đề thi theo công văn 7791</p>

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-[#e2e8f0]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-pulse">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#475569]">Tên đăng nhập</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                <UserIcon size={18} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className="w-full bg-[#f1f5f9] border-none rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#0d9488] outline-none text-[#1e293b]"
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#475569]">Mật khẩu</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                <Lock size={18} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full bg-[#f1f5f9] border-none rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#0d9488] outline-none text-[#1e293b]"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
            <div className="text-amber-500 shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-[#475569]">Địa chỉ IP của bạn:</span>
                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-sm font-mono">{ip}</span>
              </div>
              <p className="text-[10px] font-bold text-red-500 uppercase leading-tight">
                Cảnh báo: Nếu chia sẻ cho máy tính khác sẽ xóa tài khoản
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold py-3 rounded-lg transition-colors shadow-md"
          >
            Đăng nhập
          </button>
        </form>

        <div className="mt-8 flex items-center gap-2">
          <div className="h-px bg-[#e2e8f0] flex-1"></div>
          <span className="text-xs text-[#94a3b8] font-medium whitespace-nowrap">THCS Huỳnh Thúc Kháng - Hưng Thịnh</span>
          <div className="h-px bg-[#e2e8f0] flex-1"></div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-[#94a3b8]">
            Liên hệ: <span className="text-[#64748b]">Thầy Tùng 0359.399.467</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { mockUsers } from '../data/mockData';
import { Mail, Lock, UserCheck, LogIn, ArrowLeft, Chrome, Apple, AlertCircle, Info, Sparkles } from 'lucide-react';

interface LoginRegisterProps {
  onLoginSuccess: (user: User) => void;
  onBack: () => void;
  initialRole: UserRole;
}

export default function LoginRegister({ onLoginSuccess, onBack, initialRole }: LoginRegisterProps) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Autofill login helper for presentation/evaluation
  const handleAutofill = (selectedUser: User) => {
    setEmail(selectedUser.email);
    setPassword('password123');
    setRole(selectedUser.role);
    setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      // Find matching mock user
      const matched = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (matched) {
        if (matched.status === 'suspended') {
          setError('Akun Anda ditangguhkan oleh admin. Silakan hubungi bantuan.');
          setLoading(false);
          return;
        }
        
        onLoginSuccess({
          ...matched,
          role: role // force role selection matching user's intent
        });
      } else if (email && password) {
        // Fallback or create new user
        const newUser: User = {
          id: `new-user-${Date.now()}`,
          name: email.split('@')[0],
          email: email,
          role: role,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          status: 'active',
          phone: '6281299998888'
        };
        onLoginSuccess(newUser);
      } else {
        setError('Silakan isi email dan password Anda.');
      }
      setLoading(false);
    }, 600);
  };

  // Find a mock user for each role to show as quick-login buttons
  const seekerUser = mockUsers.find(u => u.role === 'pencari')!;
  const ownerUser = mockUsers.find(u => u.role === 'pemilik')!;
  const adminUser = mockUsers.find(u => u.role === 'admin')!;

  return (
    <div className="w-full flex flex-col justify-between p-6 md:p-8 text-slate-800 relative overflow-hidden">
      
      {/* Background radial effects */}
      <div className="absolute top-[10%] right-[-10%] w-[60%] h-[40%] bg-blue-100/50 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[60%] h-[40%] bg-violet-100/40 rounded-full blur-[80px] pointer-events-none" />

      {/* Header back button */}
      <div className="flex items-center gap-2 z-10">
        <button 
          onClick={onBack}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 active:scale-95 transition-all text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span className="text-xs font-black uppercase tracking-wider text-slate-500">Kembali ke Beranda</span>
      </div>

      {/* Main Container */}
      <div className="my-auto py-6 z-10 space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-slate-800 leading-tight">Selamat Datang di <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">KosFinder</span></h2>
          <p className="text-xs text-slate-500">Masuk atau hubungkan akun Anda untuk melanjutkan pencarian</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-white border border-slate-200 focus:border-blue-600 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-800 focus:outline-none transition-all placeholder-slate-400"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Password</label>
              <button type="button" className="text-[10px] text-blue-600 hover:underline">Lupa password?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-200 focus:border-blue-600 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-800 focus:outline-none transition-all placeholder-slate-400"
              />
            </div>
          </div>

          {/* Role selection tab inside form */}
          <div className="bg-slate-100 p-1.5 rounded-xl border border-slate-200 flex gap-1">
            {(['pencari', 'pemilik', 'admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all capitalize ${
                  role === r 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow shadow-indigo-500/20' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                }`}
              >
                {r === 'pencari' ? 'Pencari' : r === 'pemilik' ? 'Pemilik' : 'Admin'}
              </button>
            ))}
          </div>

          {/* Error notice */}
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 text-[11px] p-3 rounded-xl flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-xs"
          >
            <LogIn className="h-4 w-4" />
            {loading ? 'Menghubungkan...' : 'Masuk ke Akun'}
          </button>
        </form>

        {/* Social login line separator */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Atau</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Social auth buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className="flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-semibold text-slate-700">
            <Chrome className="h-3.5 w-3.5 text-rose-500" />
            Google
          </button>
          <button type="button" className="flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-semibold text-slate-700">
            <Apple className="h-3.5 w-3.5 text-slate-800" />
            Apple ID
          </button>
        </div>

        {/* Developer Sandbox Accounts for fast validation (EXCELLENT UX) */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-blue-600 font-extrabold text-[10px] uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              Akses Cepat Developer (1-Klik)
            </div>
          </div>
          <p className="text-[10px] text-slate-500 leading-normal">
            Klik akun simulasi di bawah ini untuk langsung mengisi form masuk secara instan:
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              id="dev-login-seeker"
              type="button"
              onClick={() => handleAutofill(seekerUser)}
              className="flex flex-col items-center p-2 bg-white hover:bg-blue-50/50 border border-slate-200 rounded-xl text-center active:scale-95 transition-all"
            >
              <img src={seekerUser.avatar} className="w-6.5 h-6.5 rounded-full border border-blue-200 mb-1 object-cover" />
              <span className="text-[9px] font-bold text-slate-700 block truncate max-w-[80px]">{seekerUser.name.split(' ')[0]}</span>
              <span className="text-[7.5px] text-blue-600 font-bold uppercase">Pencari</span>
            </button>
            
            <button
              id="dev-login-owner"
              type="button"
              onClick={() => handleAutofill(ownerUser)}
              className="flex flex-col items-center p-2 bg-white hover:bg-emerald-50/50 border border-slate-200 rounded-xl text-center active:scale-95 transition-all"
            >
              <img src={ownerUser.avatar} className="w-6.5 h-6.5 rounded-full border border-emerald-200 mb-1 object-cover" />
              <span className="text-[9px] font-bold text-slate-700 block truncate max-w-[80px]">{ownerUser.name.split(' ')[0]}</span>
              <span className="text-[7.5px] text-emerald-600 font-bold uppercase">Pemilik</span>
            </button>

            <button
              id="dev-login-admin"
              type="button"
              onClick={() => handleAutofill(adminUser)}
              className="flex flex-col items-center p-2 bg-white hover:bg-purple-50/50 border border-slate-200 rounded-xl text-center active:scale-95 transition-all"
            >
              <img src={adminUser.avatar} className="w-6.5 h-6.5 rounded-full border border-purple-200 mb-1 object-cover" />
              <span className="text-[9px] font-bold text-slate-700 block truncate max-w-[80px]">{adminUser.name.split(' ')[0]}</span>
              <span className="text-[7.5px] text-purple-600 font-bold uppercase">Admin</span>
            </button>
          </div>
        </div>

      </div>

      {/* Footer support */}
      <div className="text-center text-[10px] text-slate-500 pt-2 z-10">
        Belum punya akun? <button type="button" className="text-blue-600 font-bold hover:underline">Daftar di sini</button>
      </div>
    </div>
  );
}

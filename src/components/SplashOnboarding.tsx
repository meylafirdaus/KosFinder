import React, { useState } from 'react';
import { Search, Home, Building2, UserCheck, ShieldCheck, ChevronRight, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

interface SplashOnboardingProps {
  onStart: (role: UserRole) => void;
}

export default function SplashOnboarding({ onStart }: SplashOnboardingProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedRole, setSelectedRole] = useState<UserRole>('pencari');

  const onboardingSlides = [
    {
      title: 'Cari Kos Terbaik',
      subtitle: 'Sesuai Kebutuhanmu',
      description: 'Platform pencarian, pengajuan sewa, dan pengelolaan kos terpercaya di Indonesia.',
      color: 'from-blue-600 to-indigo-700',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Transaksi Mudah & Aman',
      subtitle: 'Pembayaran Online',
      description: 'Gunakan pembayaran virtual account, e-wallet, atau QRIS demi keamanan transaksi sewa Anda.',
      color: 'from-emerald-600 to-teal-700',
      image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Pantau Secara Real-time',
      subtitle: 'Notifikasi & Pesan Instan',
      description: 'Chat langsung dengan pemilik kos dan pantau status pemesanan Anda dengan notifikasi push.',
      color: 'from-purple-600 to-pink-700',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const roleDescriptions = {
    pencari: {
      title: 'Pencari Kos',
      desc: 'Cari dan sewa kamar kos impian Anda di dekat kampus atau kantor dengan mudah.',
      icon: Search,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/25'
    },
    pemilik: {
      title: 'Pemilik Kos',
      desc: 'Kelola unit kos Anda, terima pemesanan sewa, dan kelola laporan keuangan kos Anda.',
      icon: Building2,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/25'
    },
    admin: {
      title: 'Admin Platform',
      desc: 'Verifikasi pengajuan kos baru, moderasi konten, kelola pengguna dan transaksi.',
      icon: ShieldCheck,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/25'
    }
  };

  return (
    <div className="w-full flex flex-col justify-between p-6 md:p-8 text-slate-800 relative overflow-hidden">
      
      {/* Visual background lights */}
      <div className="absolute top-[-10%] left-[-20%] w-[100%] h-[50%] bg-blue-100/50 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[100%] h-[50%] bg-violet-100/50 rounded-full blur-[100px] pointer-events-none animate-pulse" />
 
      {/* Header Brand */}
      <div className="flex items-center justify-between z-10 pt-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 p-2.5 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/15">
            <Home className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              KosFinder
            </h1>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">3 AKUN, 1 SOLUSI</p>
          </div>
        </div>
        <div className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-bounce" />
          <span className="text-[10px] font-bold text-slate-600">Beta v1.0</span>
        </div>
      </div>
 
      {/* Carousel Slides */}
      <div className="my-auto py-6 z-10">
        <div className="relative rounded-2xl overflow-hidden h-[190px] mb-6 shadow-xl border border-slate-200">
          <img 
            src={onboardingSlides[activeStep].image} 
            alt="Room" 
            className="w-full h-full object-cover transition-all duration-700 hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-[10px] uppercase font-black tracking-wider px-3 py-1 rounded bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/35">
              Sewa Kos Mudah
            </span>
          </div>
        </div>
 
        <div className="space-y-2.5">
          <h2 className="text-2xl font-black tracking-tight text-slate-800 leading-tight">
            {onboardingSlides[activeStep].title}
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-black text-xl mt-0.5">
              {onboardingSlides[activeStep].subtitle}
            </span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {onboardingSlides[activeStep].description}
          </p>
        </div>
 
        {/* Dots Indicator */}
        <div className="flex items-center gap-2 mt-6">
          {onboardingSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeStep === idx ? 'w-8 bg-gradient-to-r from-blue-500 to-indigo-500' : 'w-2 bg-slate-200 hover:bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
 
      {/* Role Selector Card */}
      <div className="bg-slate-50 border border-slate-200 p-5 rounded-3xl z-10 space-y-4 shadow-lg">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Pilih Peran Anda</h3>
          <p className="text-[10px] text-slate-500">Sesuaikan peran Anda untuk mulai menjelajah platform</p>
        </div>
 
        <div className="grid grid-cols-3 gap-2">
          {(['pencari', 'pemilik', 'admin'] as UserRole[]).map((r) => {
            const isSelected = selectedRole === r;
            const config = roleDescriptions[r];
            const Icon = config.icon;
 
            return (
              <button
                key={r}
                id={`role-btn-${r}`}
                onClick={() => setSelectedRole(r)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                  isSelected 
                    ? 'bg-blue-600 border-blue-600 text-white scale-[1.05] shadow-lg shadow-blue-500/15' 
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800'
                }`}
              >
                <Icon className={`h-5 w-5 mb-1.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span className="text-[10px] font-black tracking-wide capitalize">{config.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
 
        <div className="bg-white rounded-2xl p-3 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
          <strong className="text-blue-600 font-bold">Deskripsi:</strong> {roleDescriptions[selectedRole].desc}
        </div>
 
        {/* Start Button */}
        <button
          onClick={() => onStart(selectedRole)}
          className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20 active:scale-98 transition-all text-xs"
        >
          Lanjutkan ke Aplikasi
          <ChevronRight className="h-4.5 w-4.5" />
        </button>
      </div>
 
      {/* Footer copyright */}
      <div className="text-center text-[10px] text-slate-400 pt-4 z-10">
        Platform Pencarian & Pengelolaan Kos Terpercaya • © 2026 KosFinder
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { KosListing, User, Booking, PromoCode } from '../types';
import { Users, Building2, ShieldCheck, Check, X, Ban, Trash, Plus, Sparkles, TrendingUp, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  user: User | null;
  listings: KosListing[];
  users: User[];
  bookings: Booking[];
  promos: PromoCode[];
  onVerifyListing: (id: string, status: 'verified' | 'rejected') => void;
  onUpdateUserStatus: (id: string, status: 'active' | 'suspended') => void;
  onAddPromo: (promo: PromoCode) => void;
}

export default function AdminDashboard({ user, listings, users, bookings, promos, onVerifyListing, onUpdateUserStatus, onAddPromo }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'verify' | 'users' | 'promos'>('overview');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState('10');
  const [promoDesc, setPromoDesc] = useState('');

  // Statistics
  const pendingVerificationListings = listings.filter(l => l.isVerified === 'pending');
  const totalUsersCount = users.length;
  const totalListingsCount = listings.length;
  
  const platformRevenueSum = bookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  // Platform Area Chart using Recharts
  const platformTrendsData = [
    { name: 'Feb', Transaksi: 24000000 },
    { name: 'Mar', Transaksi: 38000000 },
    { name: 'Apr', Transaksi: 45000000 },
    { name: 'Mei', Transaksi: 55000000 },
    { name: 'Jun', Transaksi: platformRevenueSum || 78000000 }
  ];

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode || !promoDiscount) return;

    onAddPromo({
      code: promoCode.trim().toUpperCase(),
      discountPercent: Number(promoDiscount),
      description: promoDesc || `Diskon potongan sewa sebesar ${promoDiscount}%`
    });

    setPromoCode('');
    setPromoDesc('');
  };

  return (
    <div className="w-full text-slate-800 pb-24 relative overflow-hidden">
      
      {/* Top Admin banner block */}
      <div className="bg-white p-5 pt-7 border-b border-slate-200 rounded-b-3xl shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <img src={user?.avatar} className="w-10 h-10 rounded-full border border-purple-200 object-cover" />
          <div>
            <h2 className="text-sm font-black text-slate-800">{user?.name}</h2>
            <p className="text-[9px] uppercase tracking-wider text-purple-600 font-bold">Portal Utama Administrator</p>
          </div>
        </div>

        {/* Tab switch control */}
        <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex gap-1">
          {[
            { id: 'overview', label: 'Ringkasan' },
            { id: 'verify', label: `Verifikasi (${pendingVerificationListings.length})` },
            { id: 'users', label: 'Pengguna' },
            { id: 'promos', label: 'Voucher' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                activeTab === t.id 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow shadow-purple-500/10' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 space-y-6">

        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* System platform grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <div className="bg-purple-50 p-1.5 rounded-lg text-purple-600 w-fit border border-purple-100">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-[9px] uppercase text-slate-500 font-bold block">Total Pengguna</span>
                <span className="text-lg font-black text-slate-800">{totalUsersCount} Terdaftar</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <div className="bg-blue-50 p-1.5 rounded-lg text-blue-600 w-fit border border-blue-100">
                  <Building2 className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-[9px] uppercase text-slate-500 font-bold block">Total Unit Kos</span>
                <span className="text-lg font-black text-slate-800">{totalListingsCount} Terdata</span>
              </div>
            </div>

            {/* Platform Volume Financial metrics */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-700">Volume Transaksi Platform</h4>
                  <p className="text-[9px] text-slate-500">Omset perputaran uang sewa online di sistem</p>
                </div>
                <div className="text-right">
                  <span className="block text-[8px] text-slate-400 font-bold uppercase">Nilai Akumulasi</span>
                  <span className="text-sm font-black text-emerald-600">Rp {platformRevenueSum.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Chart of revenue */}
              <div className="h-[140px] w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={platformTrendsData}>
                    <defs>
                      <linearGradient id="colorTrx" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                    <YAxis stroke="#64748b" fontSize={9} width={40} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#cbd5e1', color: '#1e293b', fontSize: '10px' }} />
                    <Area type="monotone" dataKey="Transaksi" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorTrx)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick overview table logs */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-700">Transaksi Terbaru</h4>
              <div className="space-y-2">
                {bookings.slice(0, 3).map((b) => (
                  <div key={b.id} className="flex justify-between items-center text-[10px] text-slate-500 border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                    <div>
                      <strong className="text-slate-800 block">{b.tenantName}</strong>
                      <span>Sewa {b.kosTitle.replace('Kos ', '')} • {b.durationMonths} bln</span>
                    </div>
                    <div className="text-right">
                      <strong className="text-slate-800 block">Rp {b.totalAmount.toLocaleString('id-ID')}</strong>
                      <span className="text-[8px] text-emerald-600 font-bold uppercase">{b.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'verify' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase text-slate-700">Antrean Verifikasi Kos Baru</h3>
              <span className="bg-purple-50 text-purple-600 border border-purple-100 px-2.5 py-0.5 rounded text-[9px] font-bold">
                {pendingVerificationListings.length} Menunggu
              </span>
            </div>

            <div className="space-y-3">
              {pendingVerificationListings.map((l) => (
                <div key={l.id} className="bg-white border border-slate-200 shadow-sm p-4 rounded-2xl space-y-3">
                  <div className="flex gap-3">
                    <img src={l.images[0]} className="w-14 h-14 object-cover rounded-xl border border-slate-200" />
                    <div className="min-w-0">
                      <span className="bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded text-[8px] font-bold uppercase">
                        Kos {l.type}
                      </span>
                      <h4 className="font-bold text-xs text-slate-800 mt-1 truncate">{l.title}</h4>
                      <p className="text-[10px] text-slate-500 truncate">{l.address}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[10px] text-slate-500">
                    <div>Pemilik: <strong className="text-slate-700">{l.ownerName}</strong></div>
                    <div>Harga: <strong className="text-emerald-600">Rp {l.price.toLocaleString('id-ID')}/bulan</strong></div>
                    <div className="mt-1">Fasilitas: <span className="font-mono text-slate-400">{l.amenities.join(', ')}</span></div>
                  </div>

                  {/* Accept / Reject actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onVerifyListing(l.id, 'rejected')}
                      className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-white border border-rose-200 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1"
                    >
                      <X className="h-4 w-4" /> Tolak
                    </button>
                    <button
                      onClick={() => onVerifyListing(l.id, 'verified')}
                      className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-emerald-600 border border-slate-200 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1"
                    >
                      <Check className="h-4 w-4 text-emerald-600" /> Setujui Go Live
                    </button>
                  </div>
                </div>
              ))}

              {pendingVerificationListings.length === 0 && (
                <div className="text-center py-16 text-slate-400">
                  <ShieldCheck className="h-8 w-8 mx-auto text-emerald-500 mb-1" />
                  <p className="text-xs font-bold text-slate-700">Semua Kos Telah Terverifikasi</p>
                  <p className="text-[10px] text-slate-500">Tidak ada pengajuan verifikasi tertunda saat ini.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-700">Pengelolaan Status Akun</h3>

            <div className="space-y-2.5">
              {users.map((u) => (
                <div key={u.id} className="bg-white border border-slate-200 shadow-sm p-3.5 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={u.avatar} className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-slate-800 truncate">{u.name}</h4>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                          u.role === 'admin' ? 'bg-purple-55 text-purple-600 bg-purple-50' : u.role === 'pemilik' ? 'bg-emerald-55 text-emerald-600 bg-emerald-50' : 'bg-blue-55 text-blue-600 bg-blue-50'
                        }`}>
                          {u.role}
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-500 truncate">{u.email}</p>
                    </div>
                  </div>

                  {u.id !== user?.id && (
                    <button
                      onClick={() => onUpdateUserStatus(u.id, u.status === 'active' ? 'suspended' : 'active')}
                      className={`p-1.5 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all ${
                        u.status === 'active'
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-white border-rose-200'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 hover:text-white border-emerald-200'
                      }`}
                    >
                      <Ban className="h-3.5 w-3.5" />
                      {u.status === 'active' ? 'Suspend' : 'Aktifkan'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'promos' && (
          <div className="space-y-5">
            
            {/* New Promo Form */}
            <form onSubmit={handleCreatePromo} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-700 border-b border-slate-100 pb-1.5">Buat Voucher Baru</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold block">Kode Promo</label>
                  <input
                    type="text"
                    required
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="MUDIKASIK"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 uppercase focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold block">Diskon (%)</label>
                  <input
                    type="number"
                    required
                    value={promoDiscount}
                    onChange={(e) => setPromoDiscount(e.target.value)}
                    placeholder="15"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold block">Deskripsi Singkat</label>
                <input
                  type="text"
                  required
                  value={promoDesc}
                  onChange={(e) => setPromoDesc(e.target.value)}
                  placeholder="Diskon khusus akhir tahun sewa"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg text-xs shadow-md shadow-purple-500/10"
              >
                Buat & Aktifkan Voucher
              </button>
            </form>

            {/* List active promos */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-black uppercase text-slate-700">Voucher Aktif Terdaftar</h3>
              
              <div className="grid grid-cols-2 gap-2">
                {promos.map((p) => (
                  <div key={p.code} className="bg-white border border-slate-200 shadow-sm p-3.5 rounded-2xl relative overflow-hidden">
                    <span className="absolute right-2 top-2 bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded text-[8px] font-black uppercase">
                      -{p.discountPercent}% Off
                    </span>
                    <h5 className="font-extrabold text-xs text-slate-800 font-mono">{p.code}</h5>
                    <p className="text-[9px] text-slate-500 leading-snug mt-1">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

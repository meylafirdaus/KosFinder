import React, { useState } from 'react';
import { KosListing, Booking, User } from '../types';
import { Building2, Users, Check, X, ShieldAlert, Plus, Trash, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OwnerDashboardProps {
  user: User | null;
  listings: KosListing[];
  bookings: Booking[];
  onUpdateBookingStatus: (id: string, status: 'approved' | 'rejected') => void;
  onAddListing: (listing: KosListing) => void;
  onDeleteListing: (id: string) => void;
}

export default function OwnerDashboard({ user, listings, bookings, onUpdateBookingStatus, onAddListing, onDeleteListing }: OwnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'listings' | 'bookings'>('stats');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'putra' | 'putri' | 'campur'>('putri');
  const [category, setCategory] = useState<'kos' | 'kontrakan'>('kos');
  const [city, setCity] = useState('Semarang');
  const [price, setPrice] = useState('950000');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState<string[]>(['wifi', 'km_dalam']);
  const [editorOpen, setEditorOpen] = useState(false);

  // Filter listings owned by this owner
  const myListings = listings.filter(l => l.ownerId === (user?.id || 'owner-1'));
  const myBookings = bookings.filter(b => b.ownerId === (user?.id || 'owner-1'));

  // Calculate stats
  const totalListingsCount = myListings.length;
  const activeTenantsCount = myBookings.filter(b => b.status === 'approved' && b.paymentStatus === 'paid').length;
  const monthlyEarningsSum = myBookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + (b.totalAmount / b.durationMonths), 0);

  // Financial chart data using Recharts
  const monthlyIncomeData = [
    { name: 'Jan', Pendapatan: 12000000 },
    { name: 'Feb', Pendapatan: 14500000 },
    { name: 'Mar', Pendapatan: 14500000 },
    { name: 'Apr', Pendapatan: 16000000 },
    { name: 'Mei', Pendapatan: 18500000 },
    { name: 'Jun', Pendapatan: monthlyEarningsSum || 18500000 }
  ];

  const handleToggleAmenity = (amenity: string) => {
    setAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !address || !price) return;

    const newListing: KosListing = {
      id: `kos-${Date.now()}`,
      title: title,
      type: type,
      category: category,
      description: description || `${category === 'kos' ? 'Kost' : 'Kontrakan'} nyaman di lokasi strategis ${city} dengan fasilitas memadai.`,
      address: address,
      city: city,
      price: Number(price),
      rating: 5.0,
      reviewsCount: 0,
      coordinates: { lat: -7.0482 + (Math.random() - 0.5) * 0.02, lng: 110.4410 + (Math.random() - 0.5) * 0.02 },
      amenities: amenities,
      images: [
        category === 'kos'
          ? 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
      ],
      ownerId: user?.id || 'owner-1',
      ownerName: user?.name || 'Ibu Hartini',
      ownerPhone: user?.phone || '6289876543210',
      isVerified: 'pending', // must be approved by Admin!
      totalRooms: 10,
      availableRooms: 10,
      reviews: []
    };

    onAddListing(newListing);
    setTitle('');
    setAddress('');
    setDescription('');
    setEditorOpen(false);
  };

  return (
    <div className="w-full text-slate-800 pb-24 relative overflow-hidden">
      
      {/* Top Banner & Title */}
      <div className="bg-white p-5 pt-7 border-b border-slate-200 rounded-b-3xl shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <img src={user?.avatar} className="w-10 h-10 rounded-full border border-emerald-200 object-cover" />
          <div>
            <h2 className="text-sm font-black text-slate-800">{user?.name}</h2>
            <p className="text-[9px] uppercase tracking-wider text-emerald-600 font-bold">Portal Pemilik Kos</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex gap-1">
          {[
            { id: 'stats', label: 'Dashboard' },
            { id: 'listings', label: 'Data Kos' },
            { id: 'bookings', label: 'Pemesanan' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all capitalize ${
                activeTab === t.id 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow shadow-emerald-500/10' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 space-y-6">

        {activeTab === 'stats' && (
          <div className="space-y-6">
            
            {/* Quick stats cards grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <div className="bg-emerald-50 p-1.5 rounded-lg text-emerald-600 w-fit border border-emerald-100">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-[9px] uppercase text-slate-500 font-bold block">Total Properti</span>
                <span className="text-lg font-black text-slate-800">{totalListingsCount} Unit Kos</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <div className="bg-blue-50 p-1.5 rounded-lg text-blue-600 w-fit border border-blue-100">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-[9px] uppercase text-slate-500 font-bold block">Penyewa Aktif</span>
                <span className="text-lg font-black text-slate-800">{activeTenantsCount} Orang</span>
              </div>
            </div>

            {/* Income Report Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2">
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-700">Laporan Pendapatan</h4>
                  <p className="text-[9px] text-slate-500">Total akumulasi pembayaran sewa online</p>
                </div>
                <span className="text-xs font-black text-emerald-600">
                  Rp {monthlyEarningsSum.toLocaleString('id-ID')}/bln
                </span>
              </div>

              {/* Earnings chart representation using Recharts */}
              <div className="h-[140px] w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyIncomeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                    <YAxis stroke="#64748b" fontSize={9} width={35} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#cbd5e1', color: '#1e293b', fontSize: '10px' }} />
                    <Bar dataKey="Pendapatan" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Alert for Pending bookings */}
            {myBookings.filter(b => b.status === 'pending').length > 0 && (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0" />
                  <div>
                    <h5 className="text-[11px] font-black text-rose-800 uppercase tracking-wider">Menunggu Persetujuan</h5>
                    <p className="text-[9px] text-slate-500">Penyewa baru mendaftar sewa online</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {myBookings.filter(b => b.status === 'pending').map((b) => (
                    <div key={b.id} className="bg-white p-3 rounded-xl border border-rose-200 flex justify-between items-center gap-2 text-xs shadow-sm">
                      <div>
                        <strong className="text-slate-800">{b.tenantName}</strong>
                        <div className="text-[10px] text-slate-500">{b.kosTitle} • {b.durationMonths} bln</div>
                        <div className="text-[10px] text-slate-600 mt-1">Sewa: Rp {b.totalAmount.toLocaleString('id-ID')}</div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => onUpdateBookingStatus(b.id, 'rejected')}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg active:scale-95 transition-all"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onUpdateBookingStatus(b.id, 'approved')}
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-lg active:scale-95 transition-all"
                        >
                          <Check className="h-4 w-4 text-emerald-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase text-slate-700">Daftar Properti Kos Saya</h3>
              <button
                onClick={() => setEditorOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] flex items-center gap-1 active:scale-95 transition-all shadow-md shadow-emerald-500/10"
              >
                <Plus className="h-3.5 w-3.5" />
                Tambah Kos Baru
              </button>
            </div>

            {editorOpen && (
              <form onSubmit={handleCreateListing} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xl">
                <h4 className="text-xs font-bold uppercase text-slate-700 border-b border-slate-100 pb-1.5">Informasi Kos Baru</h4>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold block">Nama Kos</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Kos Putri Nusa Indah"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold block">Kategori Properti</label>
                    <select
                      value={category}
                      onChange={(e: any) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                    >
                      <option value="kos">Kost-Kosan</option>
                      <option value="kontrakan">Kontrakan Rumah</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold block">Kota Lokasi</label>
                    <select
                      value={city}
                      onChange={(e: any) => setCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                    >
                      {['Semarang', 'Jakarta', 'Bandung', 'Yogyakarta', 'Surabaya', 'Medan', 'Bali', 'Malang'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold block">Tipe Sewa</label>
                    <select
                      value={type}
                      onChange={(e: any) => setType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                    >
                      <option value="putra">Putra</option>
                      <option value="putri">Putri</option>
                      <option value="campur">Campur</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold block">Harga per Bulan (Rp)</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="950000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold block">Alamat Lengkap</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Jl. Tembalong No. 5"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold block">Fasilitas</label>
                  <div className="grid grid-cols-3 gap-1">
                    {['wifi', 'ac', 'km_dalam', 'dapur', 'parkir', 'cctv'].map(a => {
                      const isChecked = amenities.includes(a);
                      return (
                        <button
                          key={a}
                          type="button"
                          onClick={() => handleToggleAmenity(a)}
                          className={`p-1 border rounded text-[9px] uppercase font-bold text-center transition-all ${
                            isChecked ? 'bg-emerald-50 border-emerald-500 text-emerald-600 font-extrabold' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          {a.replace('_', ' ')}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditorOpen(false)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-600 text-xs font-semibold transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all"
                  >
                    Kirim Verifikasi
                  </button>
                </div>
              </form>
            )}

            {/* List properties */}
            <div className="space-y-3">
              {myListings.map((l) => (
                <div key={l.id} className="bg-white border border-slate-200 p-3.5 rounded-2xl flex gap-3 hover:border-emerald-500/30 transition-all shadow-sm">
                  <img src={l.images[0]} alt={l.title} className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0" />
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-xs text-slate-800 truncate pr-2">{l.title}</h4>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase shrink-0 ${
                          l.isVerified === 'verified' 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                            : l.isVerified === 'pending'
                              ? 'bg-amber-50 text-amber-600 border border-amber-200'
                              : 'bg-rose-50 text-rose-600 border border-rose-200'
                        }`}>
                          {l.isVerified === 'verified' ? 'Aktif' : l.isVerified === 'pending' ? 'Verifikasi' : 'Ditolak'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{l.address}</p>
                    </div>

                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[11px] font-black text-emerald-600 font-extrabold">Rp {l.price.toLocaleString('id-ID')}/bln</span>
                      
                      <div className="flex gap-1">
                        <button 
                          onClick={() => onDeleteListing(l.id)}
                          className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 rounded-md transition-colors"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-700">Histori Penyewaan Unit</h3>

            <div className="space-y-3">
              {myBookings.map((b) => (
                <div key={b.id} className="bg-white border border-slate-200 p-3.5 rounded-2xl space-y-2.5 shadow-sm">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{b.tenantName}</h4>
                      <p className="text-[9px] text-slate-500">{b.tenantEmail}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      b.status === 'approved' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                        : b.status === 'pending'
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : 'bg-rose-50 text-rose-600 border border-rose-200'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
                    <div>
                      <div>Kos: <strong className="text-slate-800">{b.kosTitle}</strong></div>
                      <div>Mulai: <strong className="text-slate-800">{b.startDate}</strong></div>
                      <div>Durasi: <strong className="text-slate-800">{b.durationMonths} Bulan</strong></div>
                    </div>
                    <div className="text-right">
                      <span className="block text-[8px] text-slate-400 uppercase font-bold">Total Pembayaran</span>
                      <strong className="text-xs font-black text-emerald-600 font-extrabold">Rp {b.totalAmount.toLocaleString('id-ID')}</strong>
                      <span className="block text-[8px] text-emerald-600 font-bold uppercase mt-0.5">{b.paymentStatus === 'paid' ? 'LUNAS (Verifikasi Online)' : 'BELUM BAYAR'}</span>
                    </div>
                  </div>
                </div>
              ))}

              {myBookings.length === 0 && (
                <div className="text-center py-16 text-slate-400">
                  <FileText className="h-8 w-8 mx-auto text-slate-300 mb-1" />
                  <p className="text-xs font-bold text-slate-700">Belum ada pengajuan masuk</p>
                  <p className="text-[10px] text-slate-500">Promosikan kos Anda untuk menjangkau mahasiswa Universitas Diponegoro Semarang.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

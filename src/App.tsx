import React, { useState, useEffect } from 'react';
import { User, KosListing, Booking, Message, Notification, PromoCode, UserRole } from './types';
import { 
  initialListings, 
  mockUsers, 
  initialBookings, 
  initialMessages, 
  initialNotifications, 
  mockPromoCodes 
} from './data/mockData';

// Component imports
import SplashOnboarding from './components/SplashOnboarding';
import LoginRegister from './components/LoginRegister';
import HomeDashboard from './components/HomeDashboard';
import DetailKosView from './components/DetailKosView';
import MapContainer from './components/MapContainer';
import BookingView from './components/BookingView';
import ChatView from './components/ChatView';
import OwnerDashboard from './components/OwnerDashboard';
import AdminDashboard from './components/AdminDashboard';

// Lucide icon imports
import { 
  Home, 
  Map, 
  Heart, 
  MessageSquare, 
  User as UserIcon, 
  LogOut, 
  Sparkles, 
  Bell, 
  Check, 
  X, 
  PhoneCall, 
  Compass, 
  ShieldCheck, 
  Smartphone,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function App() {
  // Global States
  const [appState, setAppState] = useState<'onboarding' | 'login' | 'app'>('onboarding');
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<KosListing[]>(initialListings);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [promos, setPromos] = useState<PromoCode[]>(mockPromoCodes);
  
  // Navigation tabs for Seeker
  const [currentTab, setCurrentTab] = useState<'beranda' | 'peta' | 'favorit' | 'chat' | 'profil'>('beranda');
  
  // Role selector for Splash/Login flow
  const [selectedRole, setSelectedRole] = useState<UserRole>('pencari');
  
  // Navigation details
  const [selectedListing, setSelectedListing] = useState<KosListing | null>(null);
  const [isBookingMode, setIsBookingMode] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>(['kos-1']); // default bookmark

  // Real-time Push Notification Simulation banner state
  const [pushNotification, setPushNotification] = useState<{ title: string; desc: string; type: string } | null>(null);

  // Trigger simulated push notification
  const triggerPushNotification = (title: string, desc: string, type: 'booking' | 'payment' | 'admin' | 'info' = 'info') => {
    setPushNotification({ title, desc, type });
    
    // Add to persistent notification collection
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId: user?.id || 'all',
      title,
      description: desc,
      timestamp: new Date().toISOString(),
      isRead: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Clear after 4 seconds
    setTimeout(() => {
      setPushNotification(null);
    }, 4500);
  };

  // Seeker - Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    const isCurrentlyFav = favorites.includes(id);
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
    triggerPushNotification(
      'Kos Favorit Diperbarui', 
      isCurrentlyFav ? 'Kos telah dihapus dari daftar favorit Anda.' : 'Kos telah ditambahkan ke daftar favorit Anda.',
      'info'
    );
  };

  // Auth Handlers
  const handleStartOnboarding = (role: UserRole) => {
    setSelectedRole(role);
    setAppState('login');
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setAppState('app');
    
    // Redirect based on role
    if (loggedInUser.role === 'pencari') {
      setCurrentTab('beranda');
    }
    
    triggerPushNotification(
      `Masuk Berhasil`, 
      `Selamat datang kembali, ${loggedInUser.name}! Peran Anda adalah ${loggedInUser.role.toUpperCase()}.`,
      'info'
    );
  };

  const handleLogOut = () => {
    setUser(null);
    setSelectedListing(null);
    setIsBookingMode(false);
    setAppState('onboarding');
  };

  // SEWER / BOOKING FLOW
  const handleStartBooking = (listing: KosListing) => {
    setSelectedListing(listing);
    setIsBookingMode(true);
  };

  const handleSubmitBooking = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    setIsBookingMode(false);
    
    // Decrease room count instantly
    setListings(prev => prev.map(l => {
      if (l.id === newBooking.kosId) {
        return { ...l, availableRooms: Math.max(0, l.availableRooms - 1) };
      }
      return l;
    }));

    // Trigger visual push notification
    triggerPushNotification(
      'Pembayaran Sewa Berhasil', 
      `Transaksi Rp ${newBooking.totalAmount.toLocaleString('id-ID')} untuk sewa ${newBooking.kosTitle} terverifikasi otomatis.`,
      'payment'
    );
  };

  // CHAT INTERACTION
  const handleStartChat = (listing: KosListing) => {
    setSelectedListing(null);
    // Force set active conversation
    setCurrentTab('chat');
  };

  const handleSendMessage = (newMsg: Message) => {
    setMessages(prev => [...prev, newMsg]);
    
    // Trigger notification if message is from landlord (simulated bot reply)
    if (newMsg.senderRole === 'pemilik') {
      triggerPushNotification(
        `Pesan Baru dari ${newMsg.senderName}`,
        newMsg.content,
        'info'
      );
    }
  };

  // LANDLORD - Update order status (Approve/Reject)
  const handleUpdateBookingStatus = (id: string, status: 'approved' | 'rejected') => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    
    const target = bookings.find(b => b.id === id);
    if (target) {
      triggerPushNotification(
        status === 'approved' ? 'Pemesanan Disetujui' : 'Pemesanan Ditolak',
        status === 'approved' 
          ? `Sewa untuk ${target.tenantName} di unit ${target.kosTitle} telah disetujui.`
          : `Sewa untuk ${target.tenantName} di unit ${target.kosTitle} telah ditolak.`,
        'booking'
      );
    }
  };

  // LANDLORD - Upload listing
  const handleAddListing = (newListing: KosListing) => {
    setListings(prev => [newListing, ...prev]);
    
    // Trigger admin alert push notification
    triggerPushNotification(
      'Pengajuan Kos Baru Terkirim',
      `Unit "${newListing.title}" berhasil diunggah. Menunggu verifikasi dari Admin KosFinder sebelum Go Live.`,
      'admin'
    );
  };

  const handleDeleteListing = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
    triggerPushNotification('Listing Dihapus', 'Listing kos telah berhasil dihapus dari daftar properti Anda.', 'admin');
  };

  // ADMIN - Approve/Reject new properties
  const handleVerifyListing = (id: string, status: 'verified' | 'rejected') => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, isVerified: status } : l));
    
    const target = listings.find(l => l.id === id);
    if (target) {
      triggerPushNotification(
        status === 'verified' ? 'Kos Berhasil Diverifikasi' : 'Kos Ditolak Verifikasi',
        status === 'verified'
          ? `Unit "${target.title}" disetujui oleh admin dan telah tayang di peta pencarian.`
          : `Unit "${target.title}" ditolak verifikasinya karena dokumen kurang lengkap.`,
        'admin'
      );
    }
  };

  // ADMIN - Suspend user
  const handleUpdateUserStatus = (id: string, status: 'active' | 'suspended') => {
    mockUsers.forEach(u => {
      if (u.id === id) u.status = status;
    });
    
    const target = mockUsers.find(u => u.id === id);
    if (target) {
      triggerPushNotification(
        status === 'suspended' ? 'Pengguna Ditangguhkan' : 'Pengguna Diaktifkan Kembali',
        `Akun ${target.name} (${target.role.toUpperCase()}) telah diubah statusnya menjadi ${status.toUpperCase()}.`,
        'admin'
      );
    }
  };

  // ADMIN - Create Voucher promo code
  const handleAddPromo = (newPromo: PromoCode) => {
    setPromos(prev => [newPromo, ...prev]);
    triggerPushNotification(
      'Voucher Baru Aktif!',
      `Kode promo "${newPromo.code}" potongan sewa ${newPromo.discountPercent}% telah terdaftar secara nasional.`,
      'info'
    );
  };

  // Developer Fast Switch Helper
  const handleDeveloperSwitchRole = (role: UserRole) => {
    const defaultUser = mockUsers.find(u => u.role === role)!;
    setUser(defaultUser);
    setSelectedListing(null);
    setIsBookingMode(false);
    
    if (role === 'pencari') {
      setCurrentTab('beranda');
    }
    
    triggerPushNotification(
      `Mode Developer: Peran Ganti`,
      `Beralih peran menjadi ${role.toUpperCase()} - Akun: ${defaultUser.name}`,
      'info'
    );
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 min-h-screen text-slate-800 flex flex-col justify-center items-center py-6 px-4 font-sans">
      
      {/* Platform Sandbox Wrapper for Desktop review */}
      <div className="w-full max-w-6xl flex flex-col gap-5 relative">
        
        {/* Sleek Top Banner: Interactive Developer Console Control Panel */}
        <div className="w-full bg-white p-4 rounded-3xl border border-slate-200/80 shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="relative block h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Sandbox Developer Simulator</h3>
              <p className="text-[10px] text-slate-500 leading-normal">
                Ubah peran secara instan untuk mensimulasikan alur sewa kos secara otomatis.
              </p>
            </div>
          </div>

          {/* Quick Switch horizontal controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleDeveloperSwitchRole('pencari')}
              className={`p-2 px-3.5 rounded-xl border text-[11px] font-bold flex items-center gap-2 transition-all ${
                user?.role === 'pencari' 
                  ? 'bg-blue-50 border-blue-200 text-blue-700 font-extrabold shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Pencari Kos (Meyla)</span>
            </button>

            <button
              onClick={() => handleDeveloperSwitchRole('pemilik')}
              className={`p-2 px-3.5 rounded-xl border text-[11px] font-bold flex items-center gap-2 transition-all ${
                user?.role === 'pemilik' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-extrabold shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Pemilik Kos (Ibu Hartini)</span>
            </button>

            <button
              onClick={() => handleDeveloperSwitchRole('admin')}
              className={`p-2 px-3.5 rounded-xl border text-[11px] font-bold flex items-center gap-2 transition-all ${
                user?.role === 'admin' 
                  ? 'bg-purple-50 border-purple-200 text-purple-700 font-extrabold shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Platform Admin (Admin)</span>
            </button>

            {user && (
              <button
                onClick={handleLogOut}
                className="p-2 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-xl text-[10px] font-bold transition-all ml-2"
              >
                Keluar
              </button>
            )}
          </div>
        </div>

        {/* Real App Container: Full width, spacious responsive design */}
        <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col overflow-hidden relative min-h-[650px] lg:min-h-[750px]">
          
          {/* REAL-TIME PUSH NOTIFICATION SIMULATOR (Requested) */}
          {pushNotification && (
            <div className="absolute top-4 right-4 max-w-sm bg-white/95 backdrop-blur-md border border-slate-200 p-3.5 rounded-2xl z-50 shadow-2xl flex items-start gap-2.5 animate-slide-down">
              <div className="bg-blue-50 p-2 rounded-xl text-blue-600 border border-blue-200 shrink-0">
                <Smartphone className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Push Notification</h4>
                  <span className="text-[8px] text-slate-400 font-bold">Sekarang</span>
                </div>
                <h5 className="font-bold text-[11px] text-slate-800 leading-tight mt-0.5">{pushNotification.title}</h5>
                <p className="text-[10px] text-slate-600 mt-0.5 leading-relaxed">{pushNotification.desc}</p>
              </div>
              <button 
                onClick={() => setPushNotification(null)}
                className="p-0.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Master view router container */}
          <div className="flex-1 overflow-y-auto">
            {appState === 'onboarding' && (
              <SplashOnboarding onStart={handleStartOnboarding} />
            )}

            {appState === 'login' && (
              <LoginRegister 
                onLoginSuccess={handleLoginSuccess} 
                onBack={() => setAppState('onboarding')}
                initialRole={selectedRole}
              />
            )}

            {appState === 'app' && user && (
              <>
                {/* Router based on user role */}
                {user.role === 'pencari' && (
                  <>
                    {/* Seeker View router */}
                    {isBookingMode && selectedListing ? (
                      <BookingView 
                        listing={selectedListing} 
                        user={user} 
                        onBack={() => setIsBookingMode(false)}
                        onSubmitBooking={handleSubmitBooking}
                      />
                    ) : selectedListing ? (
                      <DetailKosView 
                        listing={selectedListing} 
                        user={user}
                        onBack={() => setSelectedListing(null)}
                        onStartBooking={handleStartBooking}
                        onStartChat={handleStartChat}
                      />
                    ) : (
                      <>
                        {currentTab === 'beranda' && (
                          <HomeDashboard 
                            listings={listings} 
                            user={user}
                            onSelectListing={(l) => setSelectedListing(l)}
                            onNavigateToMap={() => setCurrentTab('peta')}
                          />
                        )}

                        {currentTab === 'peta' && (
                          <div className="p-5 space-y-4">
                            <div>
                              <h2 className="text-sm font-black uppercase text-slate-800 tracking-wider">Peta Hunian Interaktif</h2>
                              <p className="text-[10px] text-slate-500">Gunakan radar sebaran kost & kontrakan nyata di seluruh Indonesia</p>
                            </div>
                            <MapContainer 
                              listings={listings} 
                              userLocation={{ lat: -7.0482, lng: 110.4410 }} 
                              onSelectListing={(l) => setSelectedListing(l)}
                              selectedListing={selectedListing || undefined}
                            />
                          </div>
                        )}

                        {currentTab === 'favorit' && (
                          <div className="p-5 space-y-4">
                            <div>
                              <h2 className="text-sm font-black uppercase text-slate-800 tracking-wider">Favorit Saya</h2>
                              <p className="text-[10px] text-slate-500">Kos terverifikasi yang Anda simpan</p>
                            </div>

                            <div className="space-y-3">
                              {listings
                                .filter(l => favorites.includes(l.id))
                                .map((l) => (
                                  <div 
                                    key={l.id} 
                                    onClick={() => setSelectedListing(l)}
                                    className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex gap-3 cursor-pointer hover:bg-slate-100 transition-colors"
                                  >
                                    <img src={l.images[0]} className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0" />
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                      <div>
                                        <h4 className="font-bold text-xs text-slate-800 truncate">{l.title}</h4>
                                        <p className="text-[10px] text-slate-500 truncate">{l.address}</p>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-emerald-600 font-bold text-xs">Rp {l.price.toLocaleString('id-ID')}/bln</span>
                                        <span className="text-[9px] text-blue-600 font-bold">Lihat Detail</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                              {listings.filter(l => favorites.includes(l.id)).length === 0 && (
                                <div className="text-center py-16 text-slate-400">
                                  <Heart className="h-8 w-8 mx-auto text-slate-300 mb-1" />
                                  <p className="text-xs font-bold text-slate-700">Belum ada kos disimpan</p>
                                  <p className="text-[10px] text-slate-500">Ketuk ikon simpan pada halaman pencarian kos.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {currentTab === 'chat' && (
                          <ChatView 
                            user={user} 
                            messages={messages} 
                            onSendMessage={handleSendMessage}
                            listings={listings}
                          />
                        )}

                        {currentTab === 'profil' && (
                          <div className="p-5 space-y-5">
                            <div className="text-center space-y-1.5 py-4 border-b border-slate-100">
                              <img src={user.avatar} className="w-16 h-16 rounded-full border border-blue-200 object-cover mx-auto shadow-lg" />
                              <h3 className="text-sm font-black text-slate-800">{user.name}</h3>
                              <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded text-[8px] font-bold uppercase">
                                {user.role}
                              </span>
                            </div>

                            {/* Booking history logs */}
                            <div className="space-y-3">
                              <h4 className="text-xs font-black uppercase text-slate-700">Riwayat Pemesanan Saya</h4>
                              
                              <div className="space-y-2.5">
                                {bookings
                                  .filter(b => b.tenantId === user.id)
                                  .map((b) => (
                                    <div key={b.id} className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-2">
                                      <div className="flex justify-between items-start border-b border-slate-200 pb-1.5">
                                        <div>
                                          <h5 className="font-bold text-xs text-slate-800">{b.kosTitle}</h5>
                                          <span className="text-[8px] text-slate-500">{b.bookingDate} • Transaksi Real-time</span>
                                        </div>
                                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded text-[8px] font-black uppercase whitespace-nowrap">
                                          Sewa Aktif
                                        </span>
                                      </div>
                                      <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                                        <div>
                                          <div>Durasi: <strong className="text-slate-700">{b.durationMonths} Bulan</strong></div>
                                          <div>Masuk: <strong className="text-slate-700">{b.startDate}</strong></div>
                                        </div>
                                        <div className="text-right">
                                          <div>Sewa Online: <strong className="text-emerald-600">Paid</strong></div>
                                          <div className="text-emerald-600 font-extrabold text-[11px]">Rp {b.totalAmount.toLocaleString('id-ID')}</div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                     {/* Bottom Consumer Navigation Bar */}
                    {!selectedListing && !isBookingMode && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-xl bg-white/95 backdrop-blur border border-slate-200/80 py-3 px-8 flex justify-between items-center z-40 rounded-2xl shadow-xl shadow-slate-200">
                        {[
                          { id: 'beranda', label: 'Cari', icon: Home },
                          { id: 'peta', label: 'Peta', icon: Compass },
                          { id: 'favorit', label: 'Simpan', icon: Heart },
                          { id: 'chat', label: 'Chat', icon: MessageSquare },
                          { id: 'profil', label: 'Saya', icon: UserIcon }
                        ].map((item) => {
                          const Icon = item.icon;
                          const isActive = currentTab === item.id;
                          return (
                            <button
                              key={item.id}
                              id={`nav-tab-${item.id}`}
                              onClick={() => setCurrentTab(item.id as any)}
                              className={`flex flex-col items-center gap-1 transition-colors ${
                                isActive ? 'text-blue-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                              <span className="text-[9px] uppercase tracking-wider">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}

                {/* Landlord Portal Router */}
                {user.role === 'pemilik' && (
                  <OwnerDashboard 
                    user={user} 
                    listings={listings} 
                    bookings={bookings} 
                    onUpdateBookingStatus={handleUpdateBookingStatus}
                    onAddListing={handleAddListing}
                    onDeleteListing={handleDeleteListing}
                  />
                )}

                {/* Admin Portal Router */}
                {user.role === 'admin' && (
                  <AdminDashboard 
                    user={user} 
                    listings={listings} 
                    users={mockUsers} 
                    bookings={bookings} 
                    promos={promos}
                    onVerifyListing={handleVerifyListing}
                    onUpdateUserStatus={handleUpdateUserStatus}
                    onAddPromo={handleAddPromo}
                  />
                )}
              </>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

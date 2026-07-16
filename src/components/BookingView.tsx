import React, { useState } from 'react';
import { KosListing, Booking, User, PromoCode } from '../types';
import { Calendar, CreditCard, ChevronLeft, Ticket, Landmark, AlertCircle, ShieldCheck, HelpCircle, CheckCircle2 } from 'lucide-react';
import { mockPromoCodes } from '../data/mockData';

interface BookingViewProps {
  listing: KosListing;
  user: User | null;
  onBack: () => void;
  onSubmitBooking: (booking: Booking) => void;
}

export default function BookingView({ listing, user, onBack, onSubmitBooking }: BookingViewProps) {
  const [startDate, setStartDate] = useState<string>('2026-08-01');
  const [duration, setDuration] = useState<number>(6); // Default 6 months
  const [notes, setNotes] = useState<string>('');
  const [promoInput, setPromoInput] = useState<string>('');
  const [activePromo, setActivePromo] = useState<PromoCode | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('va-bca');
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'payment' | 'completed'>('details');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Price calculations
  const originalPrice = listing.price * duration;
  const discountAmount = activePromo ? (originalPrice * activePromo.discountPercent) / 100 : 0;
  const adminFee = 15000; // Rp 15.000 flat
  const totalAmount = originalPrice - discountAmount + adminFee;

  // Promo code validation
  const handleApplyPromo = () => {
    setError('');
    const code = promoInput.trim().toUpperCase();
    const found = mockPromoCodes.find(p => p.code === code);
    if (found) {
      setActivePromo(found);
    } else {
      setError('Kode promo tidak valid atau kedaluwarsa.');
      setActivePromo(null);
    }
  };

  // Payment channels
  const paymentChannels = [
    { id: 'va-bca', name: 'BCA Virtual Account', category: 'VA', icon: Landmark },
    { id: 'va-mandiri', name: 'Mandiri Virtual Account', category: 'VA', icon: Landmark },
    { id: 'qris', name: 'QRIS (Gopay, OVO, Dana)', category: 'QR', icon: CreditCard },
    { id: 'cc', name: 'Kartu Kredit (Visa/Mastercard)', category: 'CC', icon: CreditCard }
  ];

  // Submit booking and payment
  const handleCompletePayment = () => {
    setLoading(true);
    setTimeout(() => {
      const newBooking: Booking = {
        id: `book-${Date.now()}`,
        kosId: listing.id,
        kosTitle: listing.title,
        kosImage: listing.images[0],
        tenantId: user?.id || 'guest',
        tenantName: user?.name || 'Guest User',
        tenantEmail: user?.email || 'guest@example.com',
        ownerId: listing.ownerId,
        startDate: startDate,
        durationMonths: duration,
        totalAmount: totalAmount,
        status: 'approved', // instantly approved for mock demonstration
        paymentStatus: 'paid',
        paymentMethod: paymentChannels.find(p => p.id === paymentMethod)?.name || 'Online Payment',
        bookingDate: new Date().toISOString().split('T')[0],
        notes: notes
      };
      
      onSubmitBooking(newBooking);
      setCheckoutStep('completed');
      setLoading(false);
    }, 1800);
  };

  return (
    <div className="w-full text-slate-800 pb-24 relative overflow-hidden">
      
      {/* Header */}
      <div className="bg-white p-5 pt-7 border-b border-slate-200 rounded-b-3xl flex items-center gap-3 shadow-sm">
        {checkoutStep !== 'completed' && (
          <button 
            onClick={onBack}
            className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 active:scale-95 transition-all text-slate-600"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
        )}
        <div>
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
            {checkoutStep === 'details' ? 'Rincian Sewa' : checkoutStep === 'payment' ? 'Pembayaran Online' : 'Pembayaran Berhasil'}
          </h2>
          <p className="text-[10px] text-slate-500">Keamanan transaksi sewa terjamin 100%</p>
        </div>
      </div>

      {checkoutStep === 'details' && (
        <div className="p-5 space-y-6">
          
          {/* Selected Kos Summary card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex gap-3">
            <img src={listing.images[0]} alt={listing.title} className="w-16 h-16 object-cover rounded-xl border border-slate-200" />
            <div>
              <span className="text-[8px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded font-bold uppercase block w-fit">
                Khusus {listing.type}
              </span>
              <h4 className="font-bold text-xs text-slate-800 mt-1">{listing.title}</h4>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">{listing.address}</p>
            </div>
          </div>

          {/* Form Date and Duration */}
          <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            
            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Mulai Tanggal Masuk</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-800 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Duration Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Durasi Sewa</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[1, 3, 6, 12].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDuration(m)}
                    className={`py-2 rounded-lg border text-[10px] font-bold transition-all text-center ${
                      duration === m 
                        ? 'bg-blue-50 border-blue-500 text-blue-600 font-black' 
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {m} Bulan
                  </button>
                ))}
              </div>
            </div>

            {/* Catatan Tambahan */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Catatan Tambahan (Opsional)</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Kamar lantai bawah, minta sprei biru, dll."
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl p-3 text-xs text-slate-800 focus:outline-none transition-all placeholder-slate-400 resize-none"
              />
            </div>

          </div>

          {/* Promo code application section */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Kode Voucher / Promo</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Ticket className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Contoh: DISKON10"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 uppercase focus:outline-none transition-all placeholder-slate-400"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyPromo}
                className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-4 py-2.5 rounded-xl transition-all"
              >
                Gunakan
              </button>
            </div>

            {activePromo && (
              <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center justify-between text-[10px] text-emerald-700">
                <div className="font-semibold">Voucher "{activePromo.code}" Berhasil Dipakai</div>
                <div className="font-extrabold">Potongan {activePromo.discountPercent}%</div>
              </div>
            )}

            {error && (
              <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-[10px] text-rose-700 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Bill breakdown */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Rincian Pembayaran</h4>
            
            <div className="space-y-1.5 text-xs text-slate-500 border-b border-slate-100 pb-2.5">
              <div className="flex justify-between">
                <span>Harga Sewa ({duration} bulan)</span>
                <span className="font-bold text-slate-800">Rp {originalPrice.toLocaleString('id-ID')}</span>
              </div>
              {activePromo && (
                <div className="flex justify-between text-emerald-600">
                  <span>Potongan Promo ({activePromo.discountPercent}%)</span>
                  <span>-Rp {discountAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Biaya Admin & Layanan</span>
                <span className="font-bold text-slate-800">Rp {adminFee.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-xs font-black text-slate-800">Total Tagihan</span>
              <span className="text-base font-black text-emerald-600">Rp {totalAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Step action */}
          <button
            id="booking-submit-details"
            onClick={() => setCheckoutStep('payment')}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/10 active:scale-95 transition-all text-xs flex items-center justify-center gap-1.5"
          >
            Lanjutkan ke Pembayaran Online
          </button>

        </div>
      )}

      {checkoutStep === 'payment' && (
        <div className="p-5 space-y-6">
          
          {/* Payment amount header summary */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Jumlah Tagihan</span>
            <h3 className="text-2xl font-black text-emerald-600">Rp {totalAmount.toLocaleString('id-ID')}</h3>
            <span className="text-[9px] text-slate-500 block">Sewa Kos: {listing.title} ({duration} bln)</span>
          </div>

          {/* Select payment method channels */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">Pilih Metode Transaksi Aman</h4>
            <div className="space-y-2">
              {paymentChannels.map((p) => {
                const isSelected = paymentMethod === p.id;
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    id={`pay-channel-${p.id}`}
                    onClick={() => setPaymentMethod(p.id)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected 
                        ? 'bg-blue-50 border-blue-500 text-blue-600 scale-[1.01] shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${
                        isSelected ? 'bg-blue-100/50 border-blue-200 text-blue-600' : 'bg-slate-100 border-slate-200 text-slate-400'
                      }`}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold leading-tight">{p.name}</h5>
                        <p className="text-[9px] text-slate-500 uppercase font-black tracking-wider mt-0.5">{p.category} • Verifikasi Otomatis</p>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-blue-500 bg-blue-600' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Verification Shield Badge */}
          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex gap-3">
            <ShieldCheck className="h-6 w-6 text-blue-600 shrink-0" />
            <div className="text-[10px] text-slate-600 leading-normal">
              <strong className="text-slate-800 block">Jaminan Keamanan Transaksi Online</strong>
              Dana sewa Anda ditampung sementara oleh sistem kami dan baru dilepaskan ke pemilik setelah Anda berhasil check-in di unit kos.
            </div>
          </div>

          {/* Payment action triggers */}
          <div className="flex gap-2">
            <button
              onClick={() => setCheckoutStep('details')}
              className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 text-[11px] font-bold rounded-xl border border-slate-200 transition-colors"
            >
              Ubah Rincian
            </button>
            <button
              id="payment-confirm-submit"
              onClick={handleCompletePayment}
              disabled={loading}
              className="flex-[2] bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-200 text-white font-black py-3.5 rounded-xl shadow-lg shadow-emerald-500/10 active:scale-95 transition-all text-xs flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="h-4.5 w-4.5 animate-pulse text-white" />
              {loading ? 'Memproses Transaksi...' : 'Selesaikan Pembayaran'}
            </button>
          </div>

        </div>
      )}

      {checkoutStep === 'completed' && (
        <div className="p-6 text-center space-y-6">
          <div className="py-8">
            <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-lg shadow-emerald-500/5 animate-bounce">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            
            <h3 className="text-lg font-black text-slate-800">Pembayaran Sewa Berhasil!</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
              Selamat! Sewa Anda untuk <strong className="text-slate-800">{listing.title}</strong> telah terkonfirmasi secara real-time.
            </p>
          </div>

          {/* Receipt Breakdown Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-left space-y-3 max-w-sm mx-auto shadow-sm">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">Bukti Transaksi Elektronik</h4>
            
            <div className="space-y-1.5 text-[10px] text-slate-500 font-medium">
              <div className="flex justify-between">
                <span>Nama Penyewa:</span>
                <span className="text-slate-800 font-bold">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Metode Pembayaran:</span>
                <span className="text-slate-800 font-bold">{paymentChannels.find(p => p.id === paymentMethod)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal Masuk:</span>
                <span className="text-slate-800 font-bold">{startDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Durasi:</span>
                <span className="text-slate-800 font-bold">{duration} Bulan</span>
              </div>
              <div className="flex justify-between border-t border-slate-150 pt-2 text-xs">
                <span className="font-bold text-slate-700">Total Transaksi:</span>
                <span className="font-extrabold text-emerald-600">Rp {totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-xl text-[10px] text-slate-500 text-left leading-normal flex gap-2">
            <HelpCircle className="h-4.5 w-4.5 text-blue-500 shrink-0" />
            <div>
              <strong className="text-slate-700 block">Langkah Selanjutnya:</strong>
              Notifikasi push real-time telah dikirimkan ke pemilik kos ({listing.ownerName}). Anda dapat langsung melakukan obrolan via pesan atau kontak WhatsApp di bagian obrolan.
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl active:scale-95 transition-all text-xs"
          >
            Selesai & Kembali ke Cari Kos
          </button>
        </div>
      )}

    </div>
  );
}

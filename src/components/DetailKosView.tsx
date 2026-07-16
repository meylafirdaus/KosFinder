import React, { useState } from 'react';
import { KosListing, User } from '../types';
import { Wifi, Star, MapPin, ChevronLeft, Calendar, MessageSquare, PhoneCall, Check, Sparkles, Navigation, ShieldCheck } from 'lucide-react';

interface DetailKosViewProps {
  listing: KosListing;
  user: User | null;
  onBack: () => void;
  onStartBooking: (listing: KosListing) => void;
  onStartChat: (listing: KosListing) => void;
}

export default function DetailKosView({ listing, user, onBack, onStartBooking, onStartChat }: DetailKosViewProps) {
  const [activeImage, setActiveImage] = useState<number>(0);
  
  // Icon mapper for facilities/amenities
  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return { label: 'Wi-Fi Cepat', desc: 'Sangat stabil untuk kuliah/kerja' };
      case 'ac':
        return { label: 'AC Dingin', desc: 'Unit AC modern hemat energi' };
      case 'km_dalam':
        return { label: 'KM Dalam', desc: 'Kamar mandi dalam bersih & rapi' };
      case 'dapur':
        return { label: 'Dapur Bersama', desc: 'Peralatan masak lengkap' };
      case 'parkir':
        return { label: 'Parkir Teduh', desc: 'Keamanan motor terjaga' };
      case 'cctv':
        return { label: 'CCTV 24 Jam', desc: 'Keamanan ekstra di setiap lorong' };
      default:
        return { label: amenity.toUpperCase(), desc: 'Tersedia di unit' };
    }
  };

  // Generate dynamic nearby location highlight based on actual property details
  const getNearbyHighlight = (listing: KosListing) => {
    const addressLower = listing.address.toLowerCase();
    
    // Semarang
    if (listing.city === 'Semarang') {
      if (addressLower.includes('tembalong')) {
        return {
          title: 'Dekat Kampus UNDIP Tembalong',
          desc: 'Akses cepat ke Fakultas Teknik, Ekonomi, dan FISIP'
        };
      }
      if (addressLower.includes('banyumanik')) {
        return {
          title: 'Area Banyumanik Strategis',
          desc: 'Dekat gerbang tol Banyumanik & pusat kuliner Semarang Atas'
        };
      }
      if (addressLower.includes('ngaliyan')) {
        return {
          title: 'Dekat Kampus UIN Walisongo',
          desc: 'Lingkungan ramai mahasiswa, dekat pertokoan & pusat kuliner'
        };
      }
      if (addressLower.includes('pedurungan')) {
        return {
          title: 'Akses Cepat Trans Semarang',
          desc: 'Dekat pusat belanja Majapahit & halte BRT utama'
        };
      }
      return {
        title: 'Area Strategis Semarang',
        desc: 'Dekat akses kampus, pusat belanja, dan kuliner terpopuler'
      };
    }
    
    // Jakarta
    if (listing.city === 'Jakarta') {
      if (addressLower.includes('tebet')) {
        return {
          title: 'Pusat Kuliner & KRL Tebet',
          desc: 'Hanya menit ke Stasiun KRL Tebet dan area perkantoran Kuningan'
        };
      }
      if (addressLower.includes('kemang')) {
        return {
          title: 'Kawasan Elit Kemang',
          desc: 'Dekat pusat kafe trendi, ekspatriat, dan hiburan Jakarta Selatan'
        };
      }
      return {
        title: 'Jantung Bisnis Jakarta',
        desc: 'Akses mudah ke Sudirman-Kuningan, stasiun transportasi umum utama'
      };
    }
    
    // Bandung
    if (listing.city === 'Bandung') {
      if (addressLower.includes('dago') || addressLower.includes('coblong')) {
        return {
          title: 'Sangat Dekat ITB & UNPAD',
          desc: 'Kawasan Dago yang sejuk, asri, penuh kafe, dan sangat kondusif'
        };
      }
      return {
        title: 'Kawasan Kreatif Bandung',
        desc: 'Udara sejuk, dekat pusat fesyen, distro, kafe estetik, dan kampus'
      };
    }
    
    // Yogyakarta
    if (listing.city === 'Yogyakarta') {
      return {
        title: 'Dekat Kampus UGM / UNY',
        desc: 'Kawasan mahasiswa tenang, dekat angkringan, toko buku, dan kuliner murah'
      };
    }
    
    // Surabaya
    if (listing.city === 'Surabaya') {
      return {
        title: 'Dekat Kampus ITS / UNAIR',
        desc: 'Kemudahan akses ke Surabaya Timur & pusat komersial bisnis metropolis'
      };
    }
    
    // Medan
    if (listing.city === 'Medan') {
      return {
        title: 'Dekat Universitas Sumatera Utara (USU)',
        desc: 'Kawasan mahasiswa ramai, dekat pusat kuliner Medan dan perkantoran'
      };
    }
    
    // Bali
    if (listing.city === 'Bali') {
      return {
        title: 'Kawasan Wisata & Pantai Bali',
        desc: 'Lingkungan asri dan tenang bernuansa resor, dekat akses pantai utama'
      };
    }
    
    // Malang
    if (listing.city === 'Malang') {
      return {
        title: 'Dekat Kampus UB (Brawijaya) / UM',
        desc: 'Kota pendidikan berhawa dingin sejuk, dekat pusat kafe mahasiswa'
      };
    }

    // Default Fallback
    return {
      title: `Area Strategis ${listing.city}`,
      desc: 'Akses prima ke jalan raya utama, transportasi umum, dan fasilitas harian'
    };
  };

  const nearbyHighlight = getNearbyHighlight(listing);

  // WhatsApp Prefilled Link Generator
  const getWhatsAppLink = () => {
    const phone = listing.ownerPhone || '6289876543210';
    const text = encodeURIComponent(
      `Halo ${listing.ownerName}, saya tertarik untuk menyewa *${listing.title}* di *${listing.address}* dengan harga sewa Rp ${listing.price.toLocaleString('id-ID')}/bulan. Apakah kamar masih tersedia?`
    );
    return `https://api.whatsapp.com/send?phone=${phone}&text=${text}`;
  };

  return (
    <div className="w-full text-slate-800 pb-24 relative overflow-hidden">
      
      {/* Top Media Slideshow */}
      <div className="relative h-[250px] bg-slate-100">
        <img 
          src={listing.images[activeImage]} 
          alt={listing.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />

        {/* Floating buttons */}
        <div className="absolute top-5 left-4 right-4 flex justify-between items-center z-10">
          <button 
            onClick={onBack}
            className="p-2.5 bg-white/85 backdrop-blur hover:bg-slate-100 text-slate-800 rounded-xl border border-slate-200 shadow active:scale-95 transition-all"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
          
          <div className="flex gap-1.5">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase shadow border border-white/10 ${
              listing.type === 'putra' 
                ? 'bg-blue-600 text-white' 
                : listing.type === 'putri' 
                  ? 'bg-rose-600 text-white' 
                  : 'bg-purple-600 text-white'
            }`}>
              Khusus {listing.type}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase shadow border border-white/10 bg-slate-900 text-white">
              {listing.category === 'kos' ? 'Kost' : 'Kontrakan'}
            </span>
          </div>
        </div>

        {/* Tiny Image Slider Buttons */}
        <div className="absolute bottom-4 right-4 flex gap-1 z-10">
          {listing.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={`w-2.5 h-2.5 rounded-full border border-white/20 transition-all ${
                activeImage === idx ? 'bg-blue-500 scale-125' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="p-5 space-y-6 relative -mt-4 bg-white rounded-t-3xl border-t border-slate-200 shadow-sm">
        
        {/* Title, Verification Status, and Owner Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg w-fit text-[9px] font-bold">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            TERVERIFIKASI AMAN & BEBAS PENIPUAN
          </div>
          
          <h2 className="text-xl font-black text-slate-800 leading-tight">{listing.title}</h2>
          
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span>{listing.address}, {listing.city}</span>
          </div>

          <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-black text-slate-700">{listing.rating}</span>
              <span className="text-[10px] text-slate-500">({listing.reviewsCount} Ulasan)</span>
            </div>
            
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              Sisa Kamar: <strong className="text-rose-600 font-black">{listing.availableRooms}/{listing.totalRooms} Unit</strong>
            </span>
          </div>
        </div>

        {/* Pricing Block */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex justify-between items-center">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Sewa Bulanan</span>
            <div className="text-lg font-black text-emerald-600">
              Rp {listing.price.toLocaleString('id-ID')}
              <span className="text-xs text-slate-500 font-medium">/bulan</span>
            </div>
          </div>
          <div className="text-right text-[10px] text-slate-500 leading-normal">
            <div>DP mulai dari 0%</div>
            <div className="text-blue-600 font-extrabold uppercase text-[8px] tracking-wider">Bisa dicicil via sewa online</div>
          </div>
        </div>

        {/* Deskripsi */}
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">
            Deskripsi {listing.category === 'kos' ? 'Kost-Kosan' : 'Kontrakan Rumah'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Fasilitas Kamar */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">Fasilitas & Layanan</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {listing.amenities.map((a) => {
              const details = getAmenityIcon(a);
              return (
                <div key={a} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-2.5">
                  <div className="bg-blue-50 p-1.5 rounded-lg border border-blue-100 text-blue-600 shrink-0">
                    <Wifi className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-800 leading-tight">{details.label}</h5>
                    <p className="text-[9px] text-slate-500 leading-none mt-0.5">{details.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real Google Maps Embed Integration */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">Lokasi Google Maps</h3>
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="text-xs font-bold text-slate-800">{nearbyHighlight.title}</h5>
                <p className="text-[10px] text-slate-500">{nearbyHighlight.desc}</p>
              </div>
              <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[9px] px-2 py-0.5 rounded font-bold uppercase">
                Sangat Strategis
              </span>
            </div>
            
            {/* Real Interactive Google Map Embed Frame */}
            <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-200 relative shadow-inner">
              <iframe
                title="Google Maps Location"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${listing.coordinates.lat},${listing.coordinates.lng}&z=15&output=embed`}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="flex gap-4 text-[10px] text-slate-500 border-t border-slate-200 pt-2.5">
              <div>
                <span className="block font-bold text-slate-700">Latitude:</span>
                <span className="font-mono text-[9px]">{listing.coordinates.lat}</span>
              </div>
              <div>
                <span className="block font-bold text-slate-700">Longitude:</span>
                <span className="font-mono text-[9px]">{listing.coordinates.lng}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ulasan Pengguna (Ulasan) */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">Ulasan Pengguna</h3>
            <span className="text-[10px] text-slate-500 font-bold">{listing.reviews.length} ulasan terverifikasi</span>
          </div>

          <div className="space-y-3">
            {listing.reviews.map((r) => (
              <div key={r.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <img 
                      src={r.userAvatar} 
                      alt={r.userName} 
                      className="w-7 h-7 rounded-full border border-blue-100 object-cover" 
                    />
                    <div>
                      <h5 className="text-[11px] font-bold text-slate-800 leading-tight">{r.userName}</h5>
                      <span className="text-[8px] text-slate-400 block">{r.date} • Penyewa Terverifikasi</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-[9px] font-extrabold text-amber-600">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{r.rating}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed italic">
                  "{r.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Persistent Bottom Action Drawer (Booking and Chat triggers) */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-200 px-5 py-4 flex gap-2 z-40 shadow-2xl rounded-t-3xl">
        
        {/* Chat Pemilik */}
        <button
          onClick={() => onStartChat(listing)}
          className="p-3 bg-slate-50 hover:bg-slate-100 text-blue-600 border border-slate-200 rounded-xl active:scale-95 transition-all flex flex-col items-center justify-center shrink-0 w-14"
        >
          <MessageSquare className="h-4.5 w-4.5 mb-0.5 text-blue-600" />
          <span className="text-[8px] font-black uppercase tracking-wider">Chat</span>
        </button>

        {/* WhatsApp direct contact (Requested) */}
        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100 rounded-xl active:scale-95 transition-all flex flex-col items-center justify-center shrink-0 w-14"
        >
          <PhoneCall className="h-4.5 w-4.5 mb-0.5 text-emerald-600 animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-wider">WA</span>
        </a>

        {/* Booking / Cek Ketersediaan (Requested) */}
        <button
          id="detail-booking-submit"
          onClick={() => onStartBooking(listing)}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-xs"
        >
          <Calendar className="h-4 w-4 text-white" />
          Booking / Cek Ketersediaan
        </button>

      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { KosListing, User } from '../types';
import { Search, Filter, SlidersHorizontal, Star, Sparkles, Navigation, ChevronRight, X, Compass, Check, ArrowUpDown, Home, Building2 } from 'lucide-react';

interface HomeDashboardProps {
  listings: KosListing[];
  user: User | null;
  onSelectListing: (listing: KosListing) => void;
  onNavigateToMap: () => void;
}

export default function HomeDashboard({ listings, user, onSelectListing, onNavigateToMap }: HomeDashboardProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('Semua');
  const [selectedCategory, setSelectedCategory] = useState<'semua' | 'kos' | 'kontrakan'>('semua');
  const [selectedType, setSelectedType] = useState<string>('semua');
  const [maxPrice, setMaxPrice] = useState<number>(5000000);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('rating'); // rating, price-asc, price-desc

  // Promos and banners
  const promoBanners = [
    {
      id: 'promo-1',
      title: 'Diskon Spesial Mahasiswa & Keluarga',
      subtitle: 'Masukkan kode DISKON10 untuk potongan langsung 10% di bulan pertama sewa!',
      bg: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'promo-2',
      title: 'Bayar Aman Via QRIS & VA',
      subtitle: 'Dapatkan garansi perlindungan transaksi sewa online 100% aman.',
      bg: 'from-purple-600 to-pink-600',
    }
  ];
  const [activePromo, setActivePromo] = useState<number>(0);

  // Helper for province mapping
  const getProvinceByCity = (city: string) => {
    switch (city) {
      case 'Jakarta': return 'DKI Jakarta';
      case 'Bandung': return 'Jawa Barat';
      case 'Yogyakarta': return 'DIY Yogyakarta';
      case 'Surabaya': return 'Jawa Timur';
      case 'Medan': return 'Sumatera Utara';
      case 'Bali': return 'Bali';
      case 'Malang': return 'Jawa Timur';
      case 'Semarang': return 'Jawa Tengah';
      case 'Semua': return 'Indonesia';
      default: return 'Indonesia';
    }
  };

  // Toggle amenity selection
  const handleToggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  // Reset filters
  const handleResetFilters = () => {
    setSelectedType('semua');
    setMaxPrice(5000000);
    setMinRating(0);
    setSelectedAmenities([]);
    setSearchQuery('');
    setSelectedCity('Semua');
    setSelectedCategory('semua');
  };

  // Apply filtering rules
  const filteredListings = listings.filter((l) => {
    // City filter
    const matchesCity = selectedCity === 'Semua' || l.city.toLowerCase() === selectedCity.toLowerCase();
    
    // Category filter
    const matchesCategory = selectedCategory === 'semua' || l.category === selectedCategory;

    // Search query matches title, address, description, or city
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
      l.title.toLowerCase().includes(query) ||
      l.address.toLowerCase().includes(query) ||
      l.description.toLowerCase().includes(query) ||
      l.city.toLowerCase().includes(query);
    
    const matchesType = selectedType === 'semua' || l.type === selectedType;
    const matchesPrice = l.price <= maxPrice;
    const matchesRating = l.rating >= minRating;
    const matchesAmenities = selectedAmenities.every(a => l.amenities.includes(a));
    const matchesVerification = l.isVerified === 'verified';

    return matchesCity && matchesCategory && matchesSearch && matchesType && matchesPrice && matchesRating && matchesAmenities && matchesVerification;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="w-full text-slate-800 pb-24 relative overflow-hidden">
      
      {/* Header and User greeting */}
      <div className="bg-white p-5 pt-7 border-b border-slate-200 rounded-b-3xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <img 
              src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full border-2 border-blue-200 object-cover" 
            />
            <div>
              <p className="text-[10px] text-slate-500 font-extrabold tracking-wider uppercase">Lokasi Pencarian</p>
              <div className="flex items-center gap-1">
                <Navigation className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
                <span className="text-xs font-black text-slate-800">
                  {selectedCity === 'Semua' ? 'Seluruh Indonesia' : `${selectedCity}, ${getProvinceByCity(selectedCity)}`}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={onNavigateToMap}
            className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-[10px] font-extrabold px-3.5 py-2 rounded-full border border-blue-100 flex items-center gap-1 active:scale-95 transition-all"
          >
            <Compass className="h-3.5 w-3.5 text-blue-600" />
            Peta Terdekat
          </button>
        </div>

        {/* Big Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kota, nama area, kos, atau kontrakan..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-800 focus:outline-none transition-all placeholder-slate-400"
            />
          </div>
          <button 
            id="filter-drawer-toggle"
            onClick={() => setFilterOpen(true)}
            className="bg-slate-50 hover:bg-slate-100 text-slate-600 p-3 rounded-xl border border-slate-200 active:scale-95 transition-all"
          >
            <Filter className="h-4.5 w-4.5 text-blue-600" />
          </button>
        </div>

        {/* Category Tabs Switcher (Kost vs Kontrakan) */}
        <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-200/50 mt-4 gap-1">
          <button
            onClick={() => setSelectedCategory('semua')}
            className={`flex-1 py-2 px-3 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all ${
              selectedCategory === 'semua'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>Semua</span>
          </button>
          <button
            onClick={() => setSelectedCategory('kos')}
            className={`flex-1 py-2 px-3 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all ${
              selectedCategory === 'kos'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-700'
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>Kost-Kosan</span>
          </button>
          <button
            onClick={() => setSelectedCategory('kontrakan')}
            className={`flex-1 py-2 px-3 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all ${
              selectedCategory === 'kontrakan'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-700'
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            <span>Kontrakan Rumah</span>
          </button>
        </div>
      </div>

      {/* Main content scroll container */}
      <div className="p-5 space-y-6">
        
        {/* Dynamic Carousel Promo Banner */}
        <div className={`rounded-2xl p-5 bg-gradient-to-r ${promoBanners[activePromo].bg} relative overflow-hidden shadow-lg border border-white/10`}>
          <div className="absolute right-[-10%] top-[-20%] opacity-15">
            <Sparkles className="h-32 w-32 rotate-12" />
          </div>
          <span className="bg-black/20 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full">
            PROMO SPESIAL KOSFINDER
          </span>
          <h4 className="text-sm font-black text-white mt-2 leading-snug">
            {promoBanners[activePromo].title}
          </h4>
          <p className="text-[10px] text-slate-100/80 mt-1 max-w-[85%] leading-relaxed">
            {promoBanners[activePromo].subtitle}
          </p>
          
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-1">
              {promoBanners.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActivePromo(idx)}
                  className={`w-1.5 h-1.5 rounded-full ${activePromo === idx ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
            <span className="text-[9px] font-bold text-white bg-white/20 px-2 py-1 rounded flex items-center gap-0.5">
              Promo Aktif <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* Title and Sort Controls */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-black tracking-tight text-slate-800 uppercase">
              Rekomendasi {selectedCategory === 'semua' ? 'Hunian' : selectedCategory === 'kos' ? 'Kost-Kosan' : 'Kontrakan'} Terbaik
            </h3>
            <p className="text-[10px] text-slate-500">
              Menampilkan {selectedCategory === 'semua' ? 'kost & kontrakan' : selectedCategory} aman terverifikasi di {selectedCity === 'Semua' ? 'seluruh Indonesia' : selectedCity}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
            <ArrowUpDown className="h-3 w-3 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[10px] font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="rating" className="bg-white text-slate-800">Rating Tertinggi</option>
              <option value="price-asc" className="bg-white text-slate-800">Harga Terendah</option>
              <option value="price-desc" className="bg-white text-slate-800">Harga Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Listings Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredListings.map((l) => (
            <div
              key={l.id}
              id={`listing-card-${l.id}`}
              onClick={() => onSelectListing(l)}
              className="bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm flex cursor-pointer transition-all hover:scale-[1.01] hover:border-blue-500/50"
            >
              <div className="w-[110px] h-[110px] shrink-0 relative">
                <img 
                  src={l.images[0]} 
                  alt={l.title} 
                  className="w-full h-full object-cover" 
                />
                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase shadow-md ${
                  l.type === 'putra' 
                    ? 'bg-blue-600 text-white' 
                    : l.type === 'putri' 
                      ? 'bg-rose-600 text-white' 
                      : 'bg-purple-600 text-white'
                }`}>
                  {l.type}
                </span>
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase shadow-md bg-slate-900/85 text-white tracking-wider">
                  {l.category === 'kos' ? 'Kost' : 'Kontrakan'}
                </span>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between overflow-hidden">
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <h5 className="font-bold text-xs text-slate-800 truncate max-w-[170px]">{l.title}</h5>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">{l.city} • {l.address}</p>
                  
                  {/* Rating / Ulasan pengguna */}
                  <div className="flex items-center gap-1 mt-1 bg-amber-50 w-fit px-1.5 py-0.5 rounded border border-amber-100">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                    <span className="text-[10px] font-extrabold text-amber-700">{l.rating}</span>
                    <span className="text-[9px] text-slate-500">({l.reviewsCount} Ulasan)</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mt-1">
                  <div>
                    <span className="text-slate-500 text-[8px] uppercase font-bold block">Harga Sewa</span>
                    <span className="text-xs font-black text-emerald-600">
                      Rp {l.price.toLocaleString('id-ID')}
                      <span className="text-[9px] text-slate-500 font-medium">/bln</span>
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-blue-600 hover:underline flex items-center gap-0.5 shrink-0">
                    Sewa Sekarang <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredListings.length === 0 && (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
              <Compass className="h-10 w-10 text-slate-400 mx-auto mb-2 animate-bounce" />
              <p className="text-xs font-bold text-slate-700">Hunian tidak ditemukan</p>
              <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] mx-auto">
                Coba sesuaikan filter pencarian, tipe sewa, kota, atau kisaran harga Anda.
              </p>
              <button 
                onClick={handleResetFilters}
                className="mt-4 text-[10px] bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg transition-colors"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FILTER DRAWER PANEL (Mockup #4 "Pencarian & Filter") */}
      {filterOpen && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col justify-end">
          <div className="bg-white border-t border-slate-200 rounded-t-3xl max-h-[85%] overflow-y-auto p-5 space-y-5 shadow-2xl">
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Filter Pencarian</h4>
                <p className="text-[10px] text-slate-500">Sesuaikan dengan kriteria hunian impianmu</p>
              </div>
              <button 
                onClick={() => setFilterOpen(false)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 hover:text-slate-800"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Filter Lokasi Semarang Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-700 tracking-wider">Pilih Kota di Indonesia</label>
              <div className="grid grid-cols-3 gap-1.5">
                {['Semua', 'Jakarta', 'Bandung', 'Yogyakarta', 'Surabaya', 'Medan', 'Bali', 'Malang', 'Semarang'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setSelectedCity(c);
                    }}
                    className={`p-2 rounded-xl border text-[10px] font-bold flex items-center justify-between transition-all ${
                      selectedCity === c 
                        ? 'bg-blue-50 border-blue-500 text-blue-600 font-extrabold shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span>{c === 'Semua' ? 'Semua Kota' : c}</span>
                    {selectedCity === c && <Check className="h-3 w-3 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Tipe Kos */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-700 tracking-wider">Tipe Sewa</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'semua', label: 'Semua' },
                  { id: 'putra', label: 'Putra' },
                  { id: 'putri', label: 'Putri' },
                  { id: 'campur', label: 'Campur' }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedType(t.id)}
                    className={`py-2 rounded-lg border text-[10px] font-semibold transition-all text-center ${
                      selectedType === t.id 
                        ? 'bg-blue-50 border-blue-500 text-blue-600' 
                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rentang Harga Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-black uppercase text-slate-700">
                <span>Maksimal Harga</span>
                <span className="text-emerald-600 font-extrabold text-[11px]">Rp {maxPrice.toLocaleString('id-ID')}/bln</span>
              </div>
              <input 
                type="range" 
                min="500000" 
                max="5000000" 
                step="100000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600" 
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                <span>Rp 500rb</span>
                <span>Rp 5.0jt</span>
              </div>
            </div>

            {/* Filter Ulasan Pengguna (Rating Stars) */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-700 tracking-wider">Ulasan Pengguna (Rating Minimum)</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { value: 0, label: 'Semua' },
                  { value: 4.2, label: '4.2+ ⭐' },
                  { value: 4.5, label: '4.5+ ⭐' },
                  { value: 4.8, label: '4.8+ ⭐' }
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setMinRating(r.value)}
                    className={`py-2 rounded-lg border text-[10px] font-bold transition-all text-center ${
                      minRating === r.value 
                        ? 'bg-amber-50 border-amber-500 text-amber-700 font-extrabold' 
                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fasilitas Checkboxes */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-700 tracking-wider">Fasilitas Tambahan</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'wifi', label: 'Wi-Fi' },
                  { id: 'ac', label: 'AC' },
                  { id: 'km_dalam', label: 'Kamar Mandi Dalam' },
                  { id: 'dapur', label: 'Dapur Bersama' },
                  { id: 'parkir', label: 'Area Parkir' },
                  { id: 'cctv', label: 'CCTV 24 Jam' }
                ].map((a) => {
                  const isChecked = selectedAmenities.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => handleToggleAmenity(a.id)}
                      className={`p-2.5 rounded-xl border text-[10px] font-bold text-left flex items-center justify-between transition-all ${
                        isChecked 
                          ? 'bg-blue-50 border-blue-500 text-blue-600' 
                          : 'bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span>{a.label}</span>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isChecked ? 'bg-blue-600 border-blue-600' : 'border-slate-200 bg-white'
                      }`}>
                        {isChecked && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 text-[11px] font-bold rounded-xl border border-slate-200 transition-colors"
              >
                Reset Filter
              </button>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[11px] font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

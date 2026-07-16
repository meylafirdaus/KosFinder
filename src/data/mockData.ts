import { KosListing, User, Booking, Message, Notification, PromoCode } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Meyla Firdaus',
    email: 'meyla@email.com',
    role: 'pencari',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    phone: '6281234567890'
  },
  {
    id: 'owner-1',
    name: 'Ibu Hartini',
    email: 'hartini@email.com',
    role: 'pemilik',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    phone: '6289876543210'
  },
  {
    id: 'owner-2',
    name: 'Bpk. Bambang',
    email: 'bambang@email.com',
    role: 'pemilik',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    phone: '6281112223334'
  },
  {
    id: 'owner-3',
    name: 'Ibu Sri',
    email: 'sri@email.com',
    role: 'pemilik',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    phone: '6282223334445'
  },
  {
    id: 'owner-4',
    name: 'Bpk. Joko',
    email: 'joko@email.com',
    role: 'pemilik',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    phone: '6283334445556'
  },
  {
    id: 'admin-1',
    name: 'Admin KosFinder',
    email: 'admin@kosfinder.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    phone: '6285556667778'
  }
];

export const mockPromoCodes: PromoCode[] = [
  {
    code: 'DISKON10',
    discountPercent: 10,
    description: 'Diskon 10% untuk kos pilihan'
  },
  {
    code: 'PROMOSEKOLAH',
    discountPercent: 15,
    description: 'Promo khusus mahasiswa baru'
  },
  {
    code: 'MUDIKASIK',
    discountPercent: 5,
    description: 'Diskon hemat sewa 6 bulan'
  }
];

export const initialListings: KosListing[] = [
  {
    id: 'kos-1',
    title: 'Kos Putri Nusa Indah',
    type: 'putri',
    category: 'kos',
    description: 'Kos putri nyaman, aman, dan bersih. Berada di lingkungan strategis dekat kampus UNDIP Tembalong. Fasilitas lengkap, sirkulasi udara baik, dan parkir luas.',
    address: 'Jl. Nusa Indah No. 10, Tembalong',
    city: 'Semarang',
    price: 950000,
    rating: 4.8,
    reviewsCount: 136,
    coordinates: { lat: -7.0494, lng: 110.4382 },
    amenities: ['wifi', 'ac', 'km_dalam', 'dapur', 'parkir', 'cctv'],
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80'
    ],
    ownerId: 'owner-1',
    ownerName: 'Ibu Hartini',
    ownerPhone: '6289876543210',
    isVerified: 'verified',
    totalRooms: 12,
    availableRooms: 8,
    reviews: [
      {
        id: 'rev-1-1',
        userName: 'Siti Aisyah',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        comment: 'Sangat nyaman dan aman! Dekat sekali dengan kampus. Ibu kos sangat ramah.',
        date: '2026-06-12'
      },
      {
        id: 'rev-1-2',
        userName: 'Rina Marlina',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
        rating: 4.6,
        comment: 'Fasilitas kamar mandi dalam bersih, AC dingin, internet kencang untuk ngerjain tugas.',
        date: '2026-05-20'
      }
    ]
  },
  {
    id: 'kos-2',
    title: 'Kos Griya Aari',
    type: 'putri',
    category: 'kos',
    description: 'Kos putri eksklusif di daerah Banyumanik. Suasana tenang dan sejuk, sangat cocok untuk belajar. Kamar luas dengan perabotan kayu berkualitas.',
    address: 'Jl. Jati Raya No. 45, Banyumanik',
    city: 'Semarang',
    price: 850000,
    rating: 4.5,
    reviewsCount: 98,
    coordinates: { lat: -7.0621, lng: 110.4284 },
    amenities: ['wifi', 'ac', 'km_dalam', 'parkir'],
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    ],
    ownerId: 'owner-2',
    ownerName: 'Bpk. Bambang',
    ownerPhone: '6281112223334',
    isVerified: 'verified',
    totalRooms: 10,
    availableRooms: 5,
    reviews: [
      {
        id: 'rev-2-1',
        userName: 'Dewi Lestari',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        rating: 4.5,
        comment: 'Lingkungan aman, parkiran motor teduh. Kamar luas sekali.',
        date: '2026-05-28'
      }
    ]
  },
  {
    id: 'kos-3',
    title: 'Kos Mahkota',
    type: 'putra',
    category: 'kos',
    description: 'Kos khusus putra di daerah Pedurungan yang strategis. Dekat pusat perbelanjaan, kuliner, dan jalan raya utama. Kamar bersih dan nyaman dengan sirkulasi udara baik.',
    address: 'Jl. Majapahit No. 120, Pedurungan',
    city: 'Semarang',
    price: 700000,
    rating: 4.2,
    reviewsCount: 76,
    coordinates: { lat: -7.0125, lng: 110.4731 },
    amenities: ['wifi', 'km_dalam', 'dapur', 'cctv'],
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'
    ],
    ownerId: 'owner-3',
    ownerName: 'Ibu Sri',
    ownerPhone: '6282223334445',
    isVerified: 'verified',
    totalRooms: 15,
    availableRooms: 3,
    reviews: [
      {
        id: 'rev-3-1',
        userName: 'Budi Santoso',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        rating: 4.2,
        comment: 'Harga terjangkau, fasilitas memadai. CCTV bikin tenang.',
        date: '2026-04-15'
      }
    ]
  },
  {
    id: 'kos-4',
    title: 'Kos Melati',
    type: 'campur',
    category: 'kos',
    description: 'Kos campur ekonomis di Ngaliyan. Sangat cocok bagi mahasiswa UIN Walisongo maupun pekerja kantor. Suasana ramah, bebas banjir, aman.',
    address: 'Jl. Melati No. 5, Ngaliyan',
    city: 'Semarang',
    price: 600000,
    rating: 4.3,
    reviewsCount: 54,
    coordinates: { lat: -6.9945, lng: 110.3541 },
    amenities: ['wifi', 'dapur', 'parkir', 'cctv'],
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80'
    ],
    ownerId: 'owner-4',
    ownerName: 'Bpk. Joko',
    ownerPhone: '6283334445556',
    isVerified: 'verified',
    totalRooms: 8,
    availableRooms: 2,
    reviews: [
      {
        id: 'rev-4-1',
        userName: 'Andi Wijaya',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        rating: 4.3,
        comment: 'Sangat cocok untuk kantong mahasiswa. Ibu kos pengertian.',
        date: '2026-03-10'
      }
    ]
  },
  // JAKARTA
  {
    id: 'prop-jk-1',
    title: 'Kos Eksklusif Tebet Residence',
    type: 'campur',
    category: 'kos',
    description: 'Kos eksklusif fully furnished di Tebet, Jakarta Selatan. Dekat stasiun KRL, perkantoran Kuningan, dan dipenuhi kafe kekinian. Kamar modern dengan smart lock, TV, AC, kuliner melimpah.',
    address: 'Jl. Tebet Barat Dalam Raya No. 42, Tebet',
    city: 'Jakarta',
    price: 2400000,
    rating: 4.9,
    reviewsCount: 88,
    coordinates: { lat: -6.2341, lng: 106.8455 },
    amenities: ['wifi', 'ac', 'km_dalam', 'parkir', 'cctv', 'laundry'],
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    ],
    ownerId: 'owner-1',
    ownerName: 'Ibu Hartini',
    ownerPhone: '6289876543210',
    isVerified: 'verified',
    totalRooms: 15,
    availableRooms: 6,
    reviews: []
  },
  {
    id: 'prop-jk-2',
    title: 'Kontrakan Rumah Minimalis Kemang',
    type: 'campur',
    category: 'kontrakan',
    description: 'Rumah kontrakan minimalis modern 2 kamar tidur di jantung Kemang, Jakarta Selatan. Desain interior estetik, sirkulasi udara baik, lingkungan asri dan tenang. Sangat cocok untuk keluarga muda atau pekerja kreatif.',
    address: 'Jl. Kemang Timur No. 12B, Mampang Prapatan',
    city: 'Jakarta',
    price: 4500000,
    rating: 4.7,
    reviewsCount: 14,
    coordinates: { lat: -6.2612, lng: 106.8214 },
    amenities: ['wifi', 'ac', 'dapur', 'parkir', 'cctv'],
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80'
    ],
    ownerId: 'owner-2',
    ownerName: 'Bpk. Bambang',
    ownerPhone: '6281112223334',
    isVerified: 'verified',
    totalRooms: 1,
    availableRooms: 1,
    reviews: []
  },
  // BANDUNG
  {
    id: 'prop-bdg-1',
    title: 'Griya Kos Dago Asri',
    type: 'putri',
    category: 'kos',
    description: 'Kos putri premium di Dago, Bandung. Sangat sejuk, bersih, dekat kampus ITB dan UNPAD Dipatiukur. Keamanan 24 jam dengan suasana belajar yang sangat kondusif.',
    address: 'Jl. Dago Asri No. 15, Coblong',
    city: 'Bandung',
    price: 1500000,
    rating: 4.8,
    reviewsCount: 72,
    coordinates: { lat: -6.8824, lng: 107.6152 },
    amenities: ['wifi', 'ac', 'km_dalam', 'dapur', 'parkir', 'cctv'],
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80'
    ],
    ownerId: 'owner-3',
    ownerName: 'Ibu Sri',
    ownerPhone: '6282223334445',
    isVerified: 'verified',
    totalRooms: 18,
    availableRooms: 4,
    reviews: []
  },
  {
    id: 'prop-bdg-2',
    title: 'Kontrakan Paviliun Bandung Kidul',
    type: 'campur',
    category: 'kontrakan',
    description: 'Rumah paviliun disewakan tahunan/bulanan di Bandung Kidul. Dekat tol Buahbatu dan Telkom University. Memiliki teras santai, dapur pribadi, ruang tamu luas, dan garasi mobil teduh.',
    address: 'Jl. Terusan Buahbatu No. 98, Bandung Kidul',
    city: 'Bandung',
    price: 2800000,
    rating: 4.6,
    reviewsCount: 9,
    coordinates: { lat: -6.9532, lng: 107.6322 },
    amenities: ['wifi', 'dapur', 'parkir', 'cctv'],
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'
    ],
    ownerId: 'owner-4',
    ownerName: 'Bpk. Joko',
    ownerPhone: '6283334445556',
    isVerified: 'verified',
    totalRooms: 1,
    availableRooms: 1,
    reviews: []
  },
  // YOGYAKARTA
  {
    id: 'prop-yog-1',
    title: 'Kos Putra Kaliurang Premium',
    type: 'putra',
    category: 'kos',
    description: 'Kos putra eksklusif ber-AC dekat kampus UGM Jalan Kaliurang KM 5. Fasilitas lengkap jempolan, internet fiber optic ultra kencang untuk menunjang studi dan gaming.',
    address: 'Jl. Kaliurang KM 5.2, Pogung Baru',
    city: 'Yogyakarta',
    price: 1300000,
    rating: 4.7,
    reviewsCount: 110,
    coordinates: { lat: -7.7652, lng: 110.3785 },
    amenities: ['wifi', 'ac', 'km_dalam', 'parkir', 'cctv'],
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'
    ],
    ownerId: 'owner-2',
    ownerName: 'Bpk. Bambang',
    ownerPhone: '6281112223334',
    isVerified: 'verified',
    totalRooms: 20,
    availableRooms: 10,
    reviews: []
  },
  {
    id: 'prop-yog-2',
    title: 'Kontrakan Rumah Joglo Modern Sleman',
    type: 'campur',
    category: 'kontrakan',
    description: 'Sewa rumah kontrakan bergaya etnik Joglo modern di Sleman, Yogyakarta. View hamparan sawah hijau yang sejuk dan menenangkan pikiran. Lengkap dengan perabotan, dapur, dan taman pribadi yang luas.',
    address: 'Jl. Palagan Tentara Pelajar No. 89, Sleman',
    city: 'Yogyakarta',
    price: 3200000,
    rating: 4.9,
    reviewsCount: 22,
    coordinates: { lat: -7.7121, lng: 110.3854 },
    amenities: ['wifi', 'dapur', 'parkir', 'cctv'],
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80'
    ],
    ownerId: 'owner-1',
    ownerName: 'Ibu Hartini',
    ownerPhone: '6289876543210',
    isVerified: 'verified',
    totalRooms: 1,
    availableRooms: 1,
    reviews: []
  },
  // SURABAYA
  {
    id: 'prop-sby-1',
    title: 'Kos Putri Gubeng Airlangga',
    type: 'putri',
    category: 'kos',
    description: 'Kos putri murah, bersih, dan sangat aman di area Gubeng, Surabaya. Dekat kampus UNAIR Kampus B & stasiun Gubeng. Sangat cocok bagi mahasiswi rajin atau karyawati.',
    address: 'Jl. Gubeng Kertajaya VIII No. 11, Gubeng',
    city: 'Surabaya',
    price: 850000,
    rating: 4.4,
    reviewsCount: 45,
    coordinates: { lat: -7.2751, lng: 112.7562 },
    amenities: ['wifi', 'km_dalam', 'dapur', 'parkir', 'cctv'],
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'
    ],
    ownerId: 'owner-3',
    ownerName: 'Ibu Sri',
    ownerPhone: '6282223334445',
    isVerified: 'verified',
    totalRooms: 10,
    availableRooms: 3,
    reviews: []
  },
  {
    id: 'prop-sby-2',
    title: 'Kontrakan Rumah 2 Lantai Mulyorejo',
    type: 'campur',
    category: 'kontrakan',
    description: 'Sewa rumah kontrakan mewah 2 lantai berlokasi di perumahan elit Mulyorejo, Surabaya Timur. Dekat ITS, Galaxy Mall, dan pusat bisnis. Keamanan cluster satu pintu (One-Gate System) dengan security 24 jam.',
    address: 'Perumahan Dharmahusada Indah No. C-4, Mulyorejo',
    city: 'Surabaya',
    price: 4800000,
    rating: 4.8,
    reviewsCount: 6,
    coordinates: { lat: -7.2654, lng: 112.7842 },
    amenities: ['wifi', 'ac', 'dapur', 'parkir', 'cctv'],
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80'
    ],
    ownerId: 'owner-4',
    ownerName: 'Bpk. Joko',
    ownerPhone: '6283334445556',
    isVerified: 'verified',
    totalRooms: 1,
    availableRooms: 1,
    reviews: []
  },
  // BALI
  {
    id: 'prop-bali-1',
    title: 'Kost Elite Jimbaran Residence',
    type: 'campur',
    category: 'kos',
    description: 'Kost eksklusif gaya resort di Jimbaran, Bali. Dekat Kampus UNUD Jimbaran dan pantai berpasir putih. Fasilitas setara hotel dengan pemandangan sunset menawan.',
    address: 'Jl. Kampus Udayana No. 23X, Jimbaran',
    city: 'Bali',
    price: 1800000,
    rating: 4.9,
    reviewsCount: 57,
    coordinates: { lat: -8.7984, lng: 115.1762 },
    amenities: ['wifi', 'ac', 'km_dalam', 'parkir', 'cctv'],
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    ],
    ownerId: 'owner-1',
    ownerName: 'Ibu Hartini',
    ownerPhone: '6289876543210',
    isVerified: 'verified',
    totalRooms: 12,
    availableRooms: 5,
    reviews: []
  },
  {
    id: 'prop-bali-2',
    title: 'Kontrakan Townhouse Kuta Seminyak',
    type: 'campur',
    category: 'kontrakan',
    description: 'Sewa rumah kontrakan tipe Townhouse modern di perbatasan Kuta dan Seminyak, Bali. Lokasi strategis dekat pusat hiburan, restoran, pantai Kuta. Dilengkapi private pool mini dan ruang keluarga semi-terbuka.',
    address: 'Jl. Sunset Road Gg. Melasti No. 3, Kuta',
    city: 'Bali',
    price: 5000000,
    rating: 4.9,
    reviewsCount: 18,
    coordinates: { lat: -8.7042, lng: 115.1784 },
    amenities: ['wifi', 'ac', 'dapur', 'parkir', 'cctv'],
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80'
    ],
    ownerId: 'owner-2',
    ownerName: 'Bpk. Bambang',
    ownerPhone: '6281112223334',
    isVerified: 'verified',
    totalRooms: 1,
    availableRooms: 1,
    reviews: []
  },
  // MEDAN
  {
    id: 'prop-med-1',
    title: 'Kos Putra Medan Baru',
    type: 'putra',
    category: 'kos',
    description: 'Kos khusus putra di kawasan Medan Baru, dekat Universitas Sumatera Utara (USU). Kamar nyaman dan tenang, lingkungan kondusif, dan parkir motor aman berpagar besi.',
    address: 'Jl. Dr. Mansyur Gg. Keluarga No. 7, Medan Baru',
    city: 'Medan',
    price: 800000,
    rating: 4.3,
    reviewsCount: 31,
    coordinates: { lat: 3.5654, lng: 98.6542 },
    amenities: ['wifi', 'km_dalam', 'parkir', 'cctv'],
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'
    ],
    ownerId: 'owner-3',
    ownerName: 'Ibu Sri',
    ownerPhone: '6282223334445',
    isVerified: 'verified',
    totalRooms: 14,
    availableRooms: 4,
    reviews: []
  },
  {
    id: 'prop-med-2',
    title: 'Kontrakan Rumah Asri Selayang',
    type: 'campur',
    category: 'kontrakan',
    description: 'Rumah kontrakan asri, sejuk, dan aman di Medan Selayang. Memiliki 3 kamar tidur, 2 kamar mandi, ruang tamu, halaman depan berumput hijau, dan pagar keliling pribadi.',
    address: 'Jl. Jamin Ginting KM 8.5, Medan Selayang',
    city: 'Medan',
    price: 2200000,
    rating: 4.5,
    reviewsCount: 11,
    coordinates: { lat: 3.5342, lng: 98.6321 },
    amenities: ['dapur', 'parkir', 'cctv'],
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80'
    ],
    ownerId: 'owner-4',
    ownerName: 'Bpk. Joko',
    ownerPhone: '6283334445556',
    isVerified: 'verified',
    totalRooms: 1,
    availableRooms: 1,
    reviews: []
  },
  // MALANG
  {
    id: 'prop-mlg-1',
    title: 'Kos Campur Lowokwaru Premium',
    type: 'campur',
    category: 'kos',
    description: 'Kos campur eksklusif berfasilitas lengkap di Lowokwaru, Malang. Dekat gerbang UB (Universitas Brawijaya) dan UIN Malang. Hawanya sejuk karena dekat area taman kota dan persawahan asri.',
    address: 'Jl. Soekarno-Hatta Indah No. 5, Lowokwaru',
    city: 'Malang',
    price: 1200000,
    rating: 4.8,
    reviewsCount: 64,
    coordinates: { lat: -7.9421, lng: 112.6214 },
    amenities: ['wifi', 'ac', 'km_dalam', 'dapur', 'parkir', 'cctv'],
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'
    ],
    ownerId: 'owner-1',
    ownerName: 'Ibu Hartini',
    ownerPhone: '6289876543210',
    isVerified: 'verified',
    totalRooms: 16,
    availableRooms: 7,
    reviews: []
  },
  {
    id: 'prop-mlg-2',
    title: 'Kontrakan Rumah Mahasiswa Dinoyo',
    type: 'campur',
    category: 'kontrakan',
    description: 'Rumah kontrakan sejuk 4 kamar tidur di Dinoyo, Malang. Sangat cocok disewa patungan bersama teman kuliah. Lokasi super strategis, dekat minimarket, warung makan murah meriah, dan kampus.',
    address: 'Jl. MT Haryono Gg. 10, Dinoyo',
    city: 'Malang',
    price: 2500000,
    rating: 4.7,
    reviewsCount: 15,
    coordinates: { lat: -7.9512, lng: 112.6084 },
    amenities: ['wifi', 'dapur', 'parkir', 'cctv'],
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    ],
    ownerId: 'owner-2',
    ownerName: 'Bpk. Bambang',
    ownerPhone: '6281112223334',
    isVerified: 'verified',
    totalRooms: 1,
    availableRooms: 1,
    reviews: []
  }
];

export const initialBookings: Booking[] = [
  {
    id: 'book-1',
    kosId: 'kos-1',
    kosTitle: 'Kos Putri Nusa Indah',
    kosImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    tenantId: 'user-1',
    tenantName: 'Meyla Firdaus',
    tenantEmail: 'meyla@email.com',
    ownerId: 'owner-1',
    startDate: '2026-08-01',
    durationMonths: 6,
    totalAmount: 5700000, // 950000 * 6
    status: 'approved',
    paymentStatus: 'paid',
    paymentMethod: 'E-Wallet (Gopay)',
    bookingDate: '2026-07-10',
    notes: 'Kamar lantai bawah kalau bisa'
  },
  {
    id: 'book-2',
    kosId: 'kos-2',
    kosTitle: 'Kos Griya Aari',
    kosImage: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
    tenantId: 'user-2', // some other tenant
    tenantName: 'Siti Aisyah',
    tenantEmail: 'siti@email.com',
    ownerId: 'owner-2',
    startDate: '2026-08-05',
    durationMonths: 3,
    totalAmount: 2550000, // 850000 * 3
    status: 'pending',
    paymentStatus: 'unpaid',
    bookingDate: '2026-07-14'
  }
];

export const initialMessages: Message[] = [
  {
    id: 'msg-1',
    senderId: 'owner-1',
    senderName: 'Ibu Hartini',
    senderRole: 'pemilik',
    receiverId: 'user-1',
    receiverName: 'Meyla Firdaus',
    content: 'Terima kasih, pembayaran sudah kami terima. Kamar nomor 5 siap ditempati tanggal 1 Agustus ya.',
    timestamp: '2026-07-14T10:30:00Z',
    isRead: true
  },
  {
    id: 'msg-2',
    senderId: 'user-1',
    senderName: 'Meyla Firdaus',
    senderRole: 'pencari',
    receiverId: 'owner-1',
    receiverName: 'Ibu Hartini',
    content: 'Baik Bu, nanti saya hubungi lagi kalau sudah mau jalan. Terima kasih banyak!',
    timestamp: '2026-07-14T10:35:00Z',
    isRead: true
  },
  {
    id: 'msg-3',
    senderId: 'user-1',
    senderName: 'Meyla Firdaus',
    senderRole: 'pencari',
    receiverId: 'owner-2',
    receiverName: 'Bpk. Bambang',
    content: 'Halo Pak, apakah kamar di Kos Griya Aari masih tersedia untuk bulan depan?',
    timestamp: '2026-07-15T08:15:00Z',
    isRead: true
  },
  {
    id: 'msg-4',
    senderId: 'owner-2',
    senderName: 'Bpk. Bambang',
    senderRole: 'pemilik',
    receiverId: 'user-1',
    receiverName: 'Meyla Firdaus',
    content: 'Halo Mbak Meyla. Masih ada 2 kamar kosong Mbak. Mau dipesan sekarang?',
    timestamp: '2026-07-15T08:20:00Z',
    isRead: false
  }
];

export const initialNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    title: 'Permintaan booking disetujui!',
    description: 'Permintaan booking Anda untuk Kos Putri Nusa Indah telah disetujui oleh Ibu Hartini.',
    timestamp: '2026-07-12T10:00:00Z',
    isRead: false,
    type: 'booking'
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    title: 'Pembayaran Berhasil',
    description: 'Pembayaran sebesar Rp 5.700.000 untuk sewa Kos Putri Nusa Indah telah terverifikasi.',
    timestamp: '2026-07-10T14:30:00Z',
    isRead: true,
    type: 'payment'
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    title: 'Promo Spesial Juli',
    description: 'Dapatkan diskon sewa hingga 15% dengan memasukkan kode promo DISKON10 di detail sewa.',
    timestamp: '2026-07-08T09:00:00Z',
    isRead: true,
    type: 'info'
  }
];

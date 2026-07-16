export type UserRole = 'pencari' | 'pemilik' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: 'active' | 'suspended';
  phone?: string;
}

export interface KosReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface KosListing {
  id: string;
  title: string;
  type: 'putra' | 'putri' | 'campur';
  description: string;
  address: string;
  city: string;
  price: number; // per month
  rating: number;
  reviewsCount: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  amenities: string[]; // 'wifi', 'ac', 'km_dalam', 'dapur', 'parkir', 'cctv', 'laundry'
  category: 'kos' | 'kontrakan';
  images: string[];
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  isVerified: 'pending' | 'verified' | 'rejected';
  totalRooms: number;
  availableRooms: number;
  reviews: KosReview[];
}

export interface Booking {
  id: string;
  kosId: string;
  kosTitle: string;
  kosImage: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  ownerId: string;
  startDate: string;
  durationMonths: number;
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  paymentStatus: 'unpaid' | 'paid';
  paymentMethod?: string;
  bookingDate: string;
  notes?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  receiverName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Notification {
  id: string;
  userId: string; // 'all' or specific user ID
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'booking' | 'payment' | 'admin';
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  description: string;
}

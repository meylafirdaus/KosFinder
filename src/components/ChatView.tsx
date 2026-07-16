import React, { useState } from 'react';
import { Message, User, KosListing } from '../types';
import { Send, PhoneCall, Check, MessageSquare, Sparkles } from 'lucide-react';

interface ChatViewProps {
  user: User | null;
  messages: Message[];
  onSendMessage: (msg: Message) => void;
  listings: KosListing[];
}

export default function ChatView({ user, messages, onSendMessage, listings }: ChatViewProps) {
  const [selectedContactId, setSelectedContactId] = useState<string>('owner-1');
  const [typedMessage, setTypedMessage] = useState<string>('');

  // Group messages into distinct conversations with owners
  const contacts = [
    { id: 'owner-1', name: 'Ibu Hartini', role: 'Pemilik Kos', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', phone: '6289876543210' },
    { id: 'owner-2', name: 'Bpk. Bambang', role: 'Pemilik Kos', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', phone: '6281112223334' },
    { id: 'owner-3', name: 'Ibu Sri', role: 'Pemilik Kos', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80', phone: '6282223334445' }
  ];

  const activeContact = contacts.find(c => c.id === selectedContactId) || contacts[0];

  // Filter messages for the active conversation between logged-in user and active contact
  const conversationMessages = messages.filter(
    m => (m.senderId === user?.id && m.receiverId === selectedContactId) ||
         (m.senderId === selectedContactId && m.receiverId === user?.id)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Trigger automated replies from landlord
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !user) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      receiverId: selectedContactId,
      receiverName: activeContact.name,
      content: typedMessage,
      timestamp: new Date().toISOString(),
      isRead: true
    };

    onSendMessage(userMsg);
    const contentTyped = typedMessage.toLowerCase();
    setTypedMessage('');

    // Trigger custom automated responses
    setTimeout(() => {
      let replyContent = 'Baik Kak, terima kasih atas pertanyaannya. Segera saya kabari ya.';
      
      if (contentTyped.includes('ready') || contentTyped.includes('ada') || contentTyped.includes('kosong')) {
        replyContent = `Halo Kak ${user.name}! Unit kamar di kos saya alhamdulillah masih ada yang kosong dan siap ditempati bulan ini. Kakak mau survey kapan?`;
      } else if (contentTyped.includes('diskon') || contentTyped.includes('kurang') || contentTyped.includes('nego')) {
        replyContent = 'Harga sewa kami sudah pas Kak, sudah termasuk biaya air, kebersihan, dan Wi-Fi gratis. Tetapi jika sewa langsung 1 tahun ada potongan khusus lho!';
      } else if (contentTyped.includes('parkir') || contentTyped.includes('motor') || contentTyped.includes('mobil')) {
        replyContent = 'Area parkir kendaraan kami cukup luas, teduh, aman, serta diawasi CCTV 24 jam Kak.';
      } else if (contentTyped.includes('alamat') || contentTyped.includes('lokasi') || contentTyped.includes('kampus')) {
        replyContent = 'Lokasi kami sangat strategis Kak, dekat kampus UNDIP Semarang tinggal jalan kaki sekitar 5 menit saja.';
      }

      const botMsg: Message = {
        id: `msg-bot-${Date.now()}`,
        senderId: selectedContactId,
        senderName: activeContact.name,
        senderRole: 'pemilik',
        receiverId: user.id,
        receiverName: user.name,
        content: replyContent,
        timestamp: new Date().toISOString(),
        isRead: false
      };

      onSendMessage(botMsg);
    }, 1500);
  };

  // WhatsApp Prefilled Link inside individual chat head
  const getWhatsAppLink = () => {
    const text = encodeURIComponent(
      `Halo ${activeContact.name}, saya adalah calon penghuni Kos yang menghubungi Anda melalui KosFinder. Apakah kamar sewa Anda masih tersedia?`
    );
    return `https://api.whatsapp.com/send?phone=${activeContact.phone}&text=${text}`;
  };

  return (
    <div className="w-full text-slate-800 flex flex-col relative overflow-hidden h-[600px] lg:h-[700px] pb-24">
      
      {/* Top Header */}
      <div className="bg-white p-5 pt-7 border-b border-slate-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">Pesan & Obrolan</h2>
        </div>
        <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
          {contacts.length} Obrolan Aktif
        </span>
      </div>

      {/* Horizontal Contacts Selector List (Mockup #8 "Chat") */}
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex gap-3 overflow-x-auto select-none">
        {contacts.map((c) => {
          const isActive = c.id === selectedContactId;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedContactId(c.id)}
              className={`flex items-center gap-2.5 p-2 px-3 rounded-xl border transition-all shrink-0 ${
                isActive 
                  ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="relative">
                <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full animate-pulse" />
              </div>
              <div className="text-left">
                <h4 className="text-[10px] font-black leading-tight whitespace-nowrap">{c.name}</h4>
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">{c.role}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Direct WhatsApp Callout Info */}
      <div className="bg-emerald-50/50 px-5 py-2.5 border-b border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
        <div className="flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <span>Butuh respon cepat? Chat via WhatsApp langsung!</span>
        </div>
        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-1 rounded text-[9px] flex items-center gap-1 shadow-sm shrink-0"
        >
          <PhoneCall className="h-2.5 w-2.5" />
          WhatsApp
        </a>
      </div>

      {/* Messages Feed View */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50/60">
        {conversationMessages.map((m) => {
          const isMe = m.senderId === user?.id;
          return (
            <div
              key={m.id}
              className={`flex flex-col max-w-[80%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
            >
              <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                isMe 
                  ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/10' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
              }`}>
                {m.content}
              </div>
              
              <div className="flex items-center gap-1 mt-1 text-[8px] text-slate-400 font-bold">
                <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {isMe && <Check className="h-3 w-3 text-blue-500" />}
              </div>
            </div>
          );
        })}

        {conversationMessages.length === 0 && (
          <div className="text-center py-16 text-slate-400 space-y-1">
            <MessageSquare className="h-8 w-8 mx-auto text-slate-300" />
            <p className="text-xs font-bold text-slate-700">Mulai Obrolan Baru</p>
            <p className="text-[10px] text-slate-500">Tanyakan tentang ketersediaan kamar, survei lokasi, atau harga khusus.</p>
          </div>
        )}
      </div>

      {/* Message input footer form */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex gap-2 shadow-sm">
        <input
          type="text"
          value={typedMessage}
          onChange={(e) => setTypedMessage(e.target.value)}
          placeholder={`Kirim pesan ke ${activeContact.name}...`}
          className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none transition-all placeholder-slate-400"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl shadow active:scale-95 transition-all"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </form>

    </div>
  );
}

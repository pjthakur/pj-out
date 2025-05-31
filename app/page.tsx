"use client"; 
import React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import { useState, useEffect, useRef, FormEvent, ChangeEvent, useMemo } from 'react';
import { FiMessageSquare, FiUsers, FiSettings, FiSun, FiMoon, FiSend, FiPlusCircle, FiSearch, FiLogOut, FiUser, FiBell, FiChevronDown, FiX, FiPaperclip, FiImage, FiFile } from 'react-icons/fi';
import { FaHashtag, FaRegSmile } from "react-icons/fa";


type Theme = 'light' | 'dark';

interface Room {
  id: string;
  name: string;
  icon?: React.JSX.Element;
  unread?: number;
  type: 'channel' | 'dm';
  avatar?: string; 
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  roomId: string;
  avatar?: string; 
  senderName?: string; 
  attachment?: Attachment; 
}

interface Attachment {
  type: 'image' | 'file';
  url: string;
  name: string;
  size?: number;
}

interface ToastMessage {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error';
}

interface EmojiCategory {
  name: string;
  emojis: string[];
}


const INITIAL_ROOMS: Room[] = [
  { id: '1', name: 'general', icon: <FaHashtag className="text-gray-400" />, unread: 3, type: 'channel' },
  { id: '2', name: 'random', icon: <FaHashtag className="text-gray-400" />, type: 'channel' },
  { id: '3', name: 'dev-team', icon: <FaHashtag className="text-gray-400" />, unread: 1, type: 'channel' },
  { id: '4', name: 'Alice Wonderland', avatar: 'https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXZhdGFyfGVufDB8fDB8fHww', type: 'dm' },
  { id: '5', name: 'Bob The Builder', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww', type: 'dm' },
];

const INITIAL_MESSAGES: Message[] = [
  { id: 'm1', roomId: '1', text: 'Hello team! Any updates on project Alpha?', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 5), senderName: 'Eve', avatar: 'https://plus.unsplash.com/premium_photo-1670884441012-c5cf195c062a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww' },
  { id: 'm2', roomId: '1', text: 'Hey Eve! I just pushed the latest commits.', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 3), avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fHww'},
  { id: 'm3', roomId: '1', text: 'Great, I\'ll check them out. Thanks!', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 1), senderName: 'Eve', avatar: 'https://plus.unsplash.com/premium_photo-1670884441012-c5cf195c062a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww' },
  { id: 'm4', roomId: '2', text: 'Anyone seen that new cat video? Hilarious!', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 10), senderName: 'Charlie', avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D' },
  { id: 'm5', roomId: '4', text: 'Hi Alice! How are you doing?', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 2), avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fHww' },
  { id: 'm6', roomId: '4', text: 'Doing great! Just working on a new feature.', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 1), senderName: 'Alice', avatar: 'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D' },
  { 
    id: 'm7', 
    roomId: '2', 
    text: 'Check out this image I found!', 
    sender: 'other', 
    timestamp: new Date(Date.now() - 1000 * 60 * 8), 
    senderName: 'Charlie', 
    avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D',
    attachment: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.3',
      name: 'cat.jpg'
    }
  },
];

const EMOJI_DATA: EmojiCategory[] = [
  { name: 'Smileys', emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥲', '🥹', '☺️', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘'] },
  { name: 'Gestures', emojis: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👋', '🤏', '✍️'] },
  { name: 'People', emojis: ['👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👩‍🦱', '🧑‍🦱', '👨‍🦱', '👩‍🦰', '🧑‍🦰', '👨‍🦰', '👱‍♀️', '👱', '👱‍♂️', '👩‍🦳', '🧑‍🦳', '👨‍🦳', '👩‍🦲'] },
  { name: 'Animals', emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤'] },
  { name: 'Objects', emojis: ['💻', '📱', '💾', '📷', '🔋', '📚', '📝', '📅', '📌', '📎', '🔒', '🔑', '📢', '🔔', '🎁', '🏆', '🎯', '⚽', '🎮', '🎲'] }
];

const USER_AVATAR = 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fHww';


const formatTimestampForSSR = (timestamp: Date): string => {
  const date = new Date(timestamp); 
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; 
  const minutesStr = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
  return `${hours}:${minutesStr} ${ampm}`;
};

const HomePage: NextPage = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(INITIAL_ROOMS[0]?.id || null);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Room[]>([]);
  const [isAddChannelModalOpen, setIsAddChannelModalOpen] = useState(false);
  const [isNewDMModalOpen, setIsNewDMModalOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newDMUsername, setNewDMUsername] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false); 
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState('Smileys');

  const [isClient, setIsClient] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem('chat-app-theme') as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      document.documentElement.classList.toggle('dark', initialTheme === 'dark');
      localStorage.setItem('chat-app-theme', initialTheme);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('chat-app-theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      return newTheme;
    });
  };

  const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const newToast = { id: Date.now(), message, type };
    setToasts(prevToasts => [...prevToasts, newToast]);
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(t => t.id !== newToast.id));
    }, 3000);
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }
    const filteredRooms = rooms.filter(room => 
      room.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredRooms);
  }, [searchTerm, rooms]);

  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setRooms(prevRooms => prevRooms.map(r => r.id === roomId ? { ...r, unread: 0 } : r));
    setIsMobileMenuOpen(false);
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if ((!currentMessage.trim() && !selectedFile) || !selectedRoomId) return;

    let attachment: Attachment | undefined;

    if (selectedFile) {
      const fileType = selectedFile.type.startsWith('image/') ? 'image' : 'file';
      const previewUrl = URL.createObjectURL(selectedFile); 
      
      attachment = {
        type: fileType,
        url: previewUrl,
        name: selectedFile.name,
        size: selectedFile.size
      };
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text: currentMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      roomId: selectedRoomId,
      avatar: USER_AVATAR,
      attachment
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setCurrentMessage('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = ''; 
    setIsEmojiPickerOpen(false);

    const selectedRoom = rooms.find(r => r.id === selectedRoomId);
    if (selectedRoom) {
      setTimeout(() => {
        const replyText = selectedRoom.type === 'dm' 
            ? `Thanks for your message! I'll get back to you soon.`
            : `Someone in ${selectedRoom.name} will respond shortly.`;
        const replyMessage: Message = {
          id: `reply-${Date.now()}`,
          text: replyText,
          sender: 'other',
          timestamp: new Date(),
          roomId: selectedRoomId,
          avatar: selectedRoom.type === 'dm' ? selectedRoom.avatar : 'https://plus.unsplash.com/premium_photo-1677094310956-7f88ae5f5c6b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Ym90JTIwYXZhdGFyfGVufDB8fDB8fHww',
          senderName: selectedRoom.type === 'dm' ? selectedRoom.name : 'Channel Bot'
        };
        setMessages(prevMessages => [...prevMessages, replyMessage]);
      }, 1500);
    }
  };

  const handleAddChannel = (e: FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;
    const channelName = newChannelName.trim().toLowerCase().replace(/\s+/g, '-');
    if (rooms.some(room => room.type === 'channel' && room.name === channelName)) {
      showToast(`Channel #${channelName} already exists`, 'error');
      return;
    }
    const newChannel: Room = {
      id: `channel-${Date.now()}`,
      name: channelName,
      icon: <FaHashtag className="text-gray-400" />,
      type: 'channel'
    };
    setRooms(prevRooms => [...prevRooms, newChannel]);
    setIsAddChannelModalOpen(false);
    setNewChannelName('');
    showToast(`Channel #${channelName} created successfully!`, 'success');
    setSelectedRoomId(newChannel.id);
  };

  const handleAddNewDM = (e: FormEvent) => {
    e.preventDefault();
    if (!newDMUsername.trim()) return;
    if (rooms.some(room => room.type === 'dm' && room.name.toLowerCase() === newDMUsername.trim().toLowerCase())) {
      showToast(`DM with ${newDMUsername} already exists`, 'error');
      return;
    }
    const avatarIndex = Math.floor(Math.random() * 100);
    const newDM: Room = {
      id: `dm-${Date.now()}`,
      name: newDMUsername.trim(),
      type: 'dm',
      avatar: `https://randomuser.me/api/portraits/men/${avatarIndex}.jpg`
    };
    setRooms(prevRooms => [...prevRooms, newDM]);
    setIsNewDMModalOpen(false);
    setNewDMUsername('');
    showToast(`DM with ${newDMUsername} created successfully!`, 'success');
    setSelectedRoomId(newDM.id);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 15 * 1024 * 1024) { 
        showToast('File is too large. Maximum 15MB allowed.', 'error');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setSelectedFile(file);
      showToast(`File "${file.name}" selected. Ready to send!`, 'info');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setCurrentMessage(prev => prev + emoji);
  };

  const filteredMessages = useMemo(() => {
    return messages
      .filter(msg => msg.roomId === selectedRoomId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages, selectedRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages]);

  const selectedRoomDetails = rooms.find(room => room.id === selectedRoomId);

  return (
    <>
      <Head>
        <title>Chat App Pro</title>
        <meta name="description" content="A simple and beautiful messaging app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <style jsx global>{`
        :root {
          --bg-primary: #ffffff;
          --bg-secondary: #f3f4f6;
          --bg-tertiary: #e5e7eb;
          --bg-hover: #d1d5db;
          --text-primary: #1f2937;
          --text-secondary: #4b5563;
          --text-accent: #3b82f6;
          --border-color: #d1d5db;
          --sidebar-bg: #f9fafb;
          --sidebar-text: #374151;
          --sidebar-hover-bg: #e5e7eb;
          --sidebar-active-bg: #dbeafe;
          --sidebar-active-text: #2563eb;
          --input-bg: #ffffff;
          --input-border: #cbd5e1;
          --message-user-bg: #3b82f6;
          --message-user-text: #ffffff;
          --message-other-bg: #e5e7eb;
          --message-other-text: #1f2937;
          --shadow-color: rgba(0, 0, 0, 0.1);
          --modal-overlay: rgba(0, 0, 0, 0.5);
        }

        html.dark {
          --bg-primary: #111827;
          --bg-secondary: #1f2937;
          --bg-tertiary: #374151;
          --bg-hover: #4b5563;
          --text-primary: #f3f4f6;
          --text-secondary: #9ca3af;
          --text-accent: #60a5fa;
          --border-color: #374151;
          --sidebar-bg: #1f2937;
          --sidebar-text: #d1d5db;
          --sidebar-hover-bg: #374151;
          --sidebar-active-bg: #1e40af;
          --sidebar-active-text: #eff6ff;
          --input-bg: #1f2937;
          --input-border: #4b5563;
          --message-user-bg: #2563eb;
          --message-user-text: #ffffff;
          --message-other-bg: #374151;
          --message-other-text: #f3f4f6;
          --shadow-color: rgba(0, 0, 0, 0.3);
          --modal-overlay: rgba(0, 0, 0, 0.7);
        }

        body {
          background-color: var(--bg-primary);
          color: var(--text-primary);
          transition: background-color 0.3s ease, color 0.3s ease;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: var(--bg-secondary); border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: var(--bg-tertiary); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--bg-hover); }
      `}</style>

      <div className="flex h-screen antialiased text-gray-800 dark:text-gray-200">
        <div className={`
          ${isMobileMenuOpen ? 'fixed inset-0 z-40' : 'hidden md:fixed md:inset-y-0 md:flex'} 
          md:w-72 flex-col bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] transition-all duration-300 ease-in-out
        `}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--border-color)] shrink-0">
              <div className="flex items-center">
                <FiMessageSquare className="w-8 h-8 text-[var(--text-accent)]" />
                <span className="ml-2 text-xl font-semibold text-[var(--sidebar-text)]">ChatPro</span>
              </div>
              <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-1 text-[var(--sidebar-text)] hover:text-[var(--text-accent)] cursor-pointer">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 border-b border-[var(--border-color)]">
                <div className="flex items-center">
                    <img src={USER_AVATAR || "/avatars/default.png"} alt="User Avatar" className="w-10 h-10 rounded-full mr-3 object-cover"/>
                    <div>
                        <p className="font-semibold text-[var(--sidebar-text)]">Current User</p>
                        <p className="text-xs text-[var(--text-secondary)]">Online</p>
                    </div>
                    <FiChevronDown className="ml-auto text-[var(--sidebar-text)] cursor-pointer" onClick={() => showToast('Profile options coming soon!', 'info')} />
                </div>
            </div>

            <div className="p-4">
              <div className="relative">
                <FiSearch className="absolute w-5 h-5 text-gray-400 top-1/2 left-3 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search chats or DMs..."
                  className="w-full py-2 pl-10 pr-4 text-sm border rounded-lg bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--text-accent)] focus:border-[var(--text-accent)] outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {searchResults.length > 0 && searchTerm.trim() !== '' && (
                <div className="mt-2 p-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <h3 className="text-xs font-semibold px-2 py-1 text-[var(--text-secondary)]">Search Results</h3>
                  {searchResults.map(room => (
                    <a
                      key={room.id}
                      href="#"
                      onClick={(e) => { e.preventDefault(); handleSelectRoom(room.id); setSearchTerm(''); }}
                      className="flex items-center px-2 py-2 text-sm hover:bg-[var(--sidebar-hover-bg)] rounded-md text-[var(--sidebar-text)] cursor-pointer"
                    >
                      {room.type === 'channel' && room.icon ? (
                        React.cloneElement(room.icon, {className: "mr-2 text-base text-gray-400"})
                      ) : room.type === 'channel' ? (
                        <FaHashtag className="mr-2 text-base text-gray-400" />
                      ) : (
                        <img src={room.avatar || "/avatars/default.png"} alt={room.name} className="w-6 h-6 mr-2 rounded-full object-cover" />
                      )}
                      <span>{room.name}</span>
                      <span className="ml-auto text-xs text-[var(--text-secondary)]">{room.type === 'channel' ? 'Channel' : 'DM'}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
              <h3 className="px-2 pt-2 pb-1 text-xs font-semibold tracking-wider uppercase text-[var(--text-secondary)]">Channels</h3>
              {rooms.filter(r => r.type === 'channel').map(room => (
                <a
                  key={room.id}
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleSelectRoom(room.id); }}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg group cursor-pointer
                    ${selectedRoomId === room.id 
                      ? 'bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)]' 
                      : 'text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--text-primary)]'
                    }
                  `}
                >
                  {room.icon ? React.cloneElement(room.icon, {className: `mr-3 text-base ${selectedRoomId === room.id ? 'text-[var(--sidebar-active-text)]' : 'text-gray-400 group-hover:text-[var(--sidebar-text)]'}` }) : <FaHashtag className="mr-3 text-base text-gray-400" />}
                  <span className="flex-1">{room.name}</span>
                  {(room.unread ?? 0) > 0 && (
                    <span className="px-2 py-0.5 ml-auto text-xs font-medium text-white bg-red-500 rounded-full">{room.unread}</span>
                  )}
                </a>
              ))}
              <button 
                type="button"
                onClick={() => setIsAddChannelModalOpen(true)}
                className="flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--text-primary)] group cursor-pointer"
              >
                <FiPlusCircle className="mr-3 text-base text-gray-400 group-hover:text-[var(--text-accent)]" />
                Add Channel
              </button>

              <h3 className="px-2 pt-4 pb-1 text-xs font-semibold tracking-wider uppercase text-[var(--text-secondary)]">Direct Messages</h3>
              {rooms.filter(r => r.type === 'dm').map(room => (
                <a
                  key={room.id}
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleSelectRoom(room.id); }}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg group cursor-pointer
                    ${selectedRoomId === room.id 
                      ? 'bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)]' 
                      : 'text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--text-primary)]'
                    }
                  `}
                >
                  <img src={room.avatar || "/avatars/default.png"} alt={room.name} className="w-6 h-6 mr-3 rounded-full object-cover" />
                  <span className="flex-1">{room.name}</span>
                   {(room.unread ?? 0) > 0 && (
                    <span className="px-2 py-0.5 ml-auto text-xs font-medium text-white bg-red-500 rounded-full">{room.unread}</span>
                  )}
                </a>
              ))}
               <button 
                type="button"
                onClick={() => setIsNewDMModalOpen(true)}
                className="flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--text-primary)] group cursor-pointer"
              >
                <FiPlusCircle className="mr-3 text-base text-gray-400 group-hover:text-[var(--text-accent)]" />
                New DM
              </button>
            </nav>

            <div className="p-3 mt-auto border-t border-[var(--border-color)]">
              <div className="flex items-center justify-between">
                 <button
                    type="button"
                    onClick={() => showToast('Settings page will be added later.', 'info')}
                    className="flex items-center p-2 text-sm rounded-md text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover-bg)] cursor-pointer"
                    title="Settings"
                  > <FiSettings className="w-5 h-5" /> </button>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-2 rounded-md text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover-bg)] cursor-pointer"
                  title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                > {theme === 'light' ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />} </button>
                 <button
                    type="button"
                    onClick={() => showToast('Logout feature will be added later.', 'info')}
                    className="flex items-center p-2 text-sm rounded-md text-red-500 hover:bg-red-100 dark:hover:bg-red-800 dark:hover:text-red-300 cursor-pointer"
                    title="Logout"
                  > <FiLogOut className="w-5 h-5" /> </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 md:ml-72 h-screen bg-[var(--bg-secondary)]">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-color)] bg-[var(--bg-primary)] shrink-0">
            <div className="flex items-center">
               <button type="button" onClick={() => setIsMobileMenuOpen(true)} className="md:hidden mr-3 p-1 text-[var(--text-primary)] hover:text-[var(--text-accent)] cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
              {selectedRoomDetails ? (
                <>
                  {selectedRoomDetails.type === 'dm' && selectedRoomDetails.avatar && (
                    <img src={selectedRoomDetails.avatar} alt={selectedRoomDetails.name} className="w-8 h-8 mr-3 rounded-full object-cover"/>
                  )}
                  {selectedRoomDetails.type === 'channel' && selectedRoomDetails.icon && (
                    <div className="mr-3 text-[var(--text-secondary)]">
                        {React.cloneElement(selectedRoomDetails.icon, { className: "text-xl text-[var(--text-primary)]" })}
                    </div>
                  )}
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">{selectedRoomDetails.name}</h2>
                  {selectedRoomDetails.type === 'dm' && <span className="ml-2 w-2.5 h-2.5 bg-green-500 rounded-full self-center"></span>}
                </>
              ) : (
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Select a room</h2>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button type="button" onClick={() => showToast('Call feature coming soon!', 'info')} className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" /></svg>
              </button>
               <button type="button" onClick={() => showToast('Video call feature coming soon!', 'info')} className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" /></svg>
              </button>
              <button type="button" onClick={() => showToast('Room info panel coming soon!', 'info')} className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto">
            {selectedRoomId ? (
              filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-end max-w-xs lg:max-w-md ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                       {msg.sender === 'other' && (
                          <img 
                            src={msg.avatar || '/avatars/default.png'} 
                            alt={msg.senderName || 'Other user'} 
                            className="w-8 h-8 rounded-full object-cover mr-2 self-start shrink-0"
                          />
                        )}
                      <div 
                        className={`p-3 rounded-xl shadow-md 
                          ${msg.sender === 'user' 
                            ? 'bg-[var(--message-user-bg)] text-[var(--message-user-text)] rounded-br-none' 
                            : 'bg-[var(--message-other-bg)] text-[var(--message-other-text)] rounded-bl-none'
                          }`}
                      >
                        {msg.sender === 'other' && msg.senderName && (
                          <p className="text-xs font-semibold mb-1 opacity-80">{msg.senderName}</p>
                        )}
                        {msg.text && <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>}
                        
                        {msg.attachment && (
                          <div className={`mt-2 ${!msg.text ? '-mt-0' : ''}`}>
                            {msg.attachment.type === 'image' ? (
                              <div className="relative">
                                <img 
                                  src={msg.attachment.url} 
                                  alt={msg.attachment.name} 
                                  className="max-w-full h-auto rounded-lg max-h-60 object-cover cursor-pointer"
                                  onClick={() => window.open(msg.attachment?.url, '_blank')}
                                />
                                <p className="text-xs mt-1 opacity-70">{msg.attachment.name}</p>
                              </div>
                            ) : (
                              <div className={`flex items-center p-2 rounded-lg ${msg.sender === 'user' ? 'bg-[var(--message-user-bg)] bg-opacity-50' : 'bg-[var(--bg-tertiary)] bg-opacity-40'}`}>
                                <FiFile className="mr-2 text-lg shrink-0" />
                                <div className="overflow-hidden">
                                  <p className="text-xs font-medium truncate">{msg.attachment.name}</p>
                                  {msg.attachment.size && (
                                    <p className="text-xs opacity-70">
                                      {(msg.attachment.size / 1024).toFixed(1)} KB
                                    </p>
                                  )}
                                </div>
                                <a 
                                  href={msg.attachment.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  download={msg.attachment.name}
                                  className="ml-auto p-1 hover:text-opacity-80 shrink-0 cursor-pointer"
                                  style={{color: msg.sender === 'user' ? 'var(--message-user-text)' : 'var(--text-accent)' }}
                                  title="Download file"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                  </svg>
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <p className={`text-xs mt-1 opacity-70 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                          {isClient
                            ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : formatTimestampForSSR(new Date(msg.timestamp))
                          }
                        </p>
                      </div>
                       {msg.sender === 'user' && (
                          <img 
                            src={msg.avatar || '/avatars/default.png'} 
                            alt="You" 
                            className="w-8 h-8 rounded-full object-cover ml-2 self-start shrink-0"
                          />
                        )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-[var(--text-secondary)]">
                  <FiMessageSquare className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-xl font-semibold">No messages yet</p>
                  <p>Be the first to send a message in {selectedRoomDetails?.type === 'channel' ? '#' : ''}{selectedRoomDetails?.name || 'this room'}.</p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-[var(--text-secondary)]">
                <FiUsers className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-xl font-semibold">Welcome to ChatPro!</p>
                <p>Select a room from the sidebar to start chatting.</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {selectedRoomId && (
            <div className="p-2 border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
              {selectedFile && (
                <div className="mb-3 p-2 bg-[var(--bg-tertiary)] rounded-lg flex items-center text-[var(--text-primary)]">
                  {selectedFile.type.startsWith('image/') ? (
                    <FiImage className="mr-2 text-[var(--text-secondary)] shrink-0" />
                  ) : (
                    <FiFile className="mr-2 text-[var(--text-secondary)] shrink-0" />
                  )}
                  <span className="text-sm truncate flex-1">{selectedFile.name} ({ (selectedFile.size / 1024).toFixed(1)} KB)</span>
                  <button 
                    type="button"
                    onClick={handleClearFile}
                    className="p-1 ml-2 text-[var(--text-secondary)] hover:text-[var(--text-accent)] rounded-full shrink-0 cursor-pointer"
                    title="Remove file"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                <div className="relative">
                  <button 
                    type="button" 
                    onClick={triggerFileInput}
                    title="Attach file"
                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-accent)] rounded-full hover:bg-[var(--bg-tertiary)] cursor-pointer"
                  >
                    <FiPaperclip className="w-5 h-5" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,application/pdf,.doc,.docx,.txt,.zip,.rar,.tar,.gz,.csv,.xls,.xlsx,.ppt,.pptx" 
                  />
                </div>
                
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentMessage(e.target.value)}
                  placeholder={`Message ${selectedRoomDetails?.type === 'channel' ? '#' : ''}${selectedRoomDetails?.name || '...'}`}
                  className="flex-1 px-4 py-3 text-sm border rounded-lg bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--text-accent)] focus:border-[var(--text-accent)] outline-none transition-colors duration-200"
                />
                
                <div className="relative">
                  <button 
                    type="button"
                    title="Add emoji"
                    onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-accent)] rounded-full hover:bg-[var(--bg-tertiary)] cursor-pointer"
                  >
                    <FaRegSmile className="w-5 h-5" />
                  </button>
                  
                  {isEmojiPickerOpen && (
                    <div className="absolute bottom-full right-0 mb-2 p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg shadow-xl w-72 z-10">
                      <div className="flex justify-between items-center mb-2 border-b border-[var(--border-color)] pb-2">
                        <h4 className="text-sm font-medium text-[var(--text-primary)]">Emojis</h4>
                        <button 
                          type="button" 
                          onClick={() => setIsEmojiPickerOpen(false)}
                          className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-accent)] rounded-full cursor-pointer"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex space-x-1 mb-2 overflow-x-auto pb-1 scrollbar-thin">
                        {EMOJI_DATA.map(category => (
                          <button
                            type="button" 
                            key={category.name}
                            onClick={() => setSelectedEmojiCategory(category.name)}
                            title={category.name}
                            className={`px-2.5 py-1.5 text-xs rounded-md whitespace-nowrap transition-colors cursor-pointer
                              ${selectedEmojiCategory === category.name 
                                ? 'bg-[var(--text-accent)] text-white' 
                                : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                              }
                            `}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-7 gap-0.5 max-h-48 overflow-y-auto scrollbar-thin pr-1">
                        {EMOJI_DATA.find(c => c.name === selectedEmojiCategory)?.emojis.map((emoji, index) => (
                          <button
                            type="button" 
                            key={index}
                            onClick={() => handleEmojiClick(emoji)}
                            className="h-8 w-8 flex items-center justify-center text-xl hover:bg-[var(--bg-tertiary)] rounded transition-colors cursor-pointer"
                            title={emoji}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  title="Send message"
                  className="p-3 rounded-lg bg-[var(--text-accent)] text-white hover:bg-opacity-90 focus:ring-2 focus:ring-offset-2 focus:ring-[var(--text-accent)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-opacity cursor-pointer"
                  disabled={(!currentMessage.trim() && !selectedFile) || !selectedRoomId}
                >
                  <FiSend className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {isAddChannelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--modal-overlay)] p-4">
          <div className="bg-[var(--bg-primary)] rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Create a New Channel</h3>
              <button 
                type="button"
                onClick={() => {setIsAddChannelModalOpen(false); setNewChannelName('');}} 
                className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-accent)] rounded-full cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddChannel}>
              <div className="mb-4">
                <label htmlFor="channelNameModal" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Channel Name
                </label>
                <div className="flex items-center">
                  <span className="mr-2 text-[var(--text-secondary)]"><FaHashtag /></span>
                  <input
                    id="channelNameModal"
                    type="text"
                    placeholder="e.g. marketing-updates"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="flex-1 px-3 py-2 text-sm border rounded-md bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--text-accent)] focus:border-[var(--text-accent)] outline-none"
                    pattern="[a-z0-9-]+"
                    title="Lowercase letters, numbers, and hyphens only."
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  Use lowercase letters, numbers, and hyphens. No spaces or special characters.
                </p>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {setIsAddChannelModalOpen(false); setNewChannelName('');}}
                  className="px-4 py-2 text-sm font-medium rounded-md border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium rounded-md bg-[var(--text-accent)] text-white hover:bg-opacity-90 disabled:opacity-50 cursor-pointer"
                  disabled={!newChannelName.trim() || !/^[a-z0-9-]+$/.test(newChannelName)}
                >
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isNewDMModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--modal-overlay)] p-4">
          <div className="bg-[var(--bg-primary)] rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Start a Direct Message</h3>
              <button 
                type="button"
                onClick={() => {setIsNewDMModalOpen(false); setNewDMUsername('');}} 
                className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-accent)] rounded-full cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddNewDM}>
              <div className="mb-4">
                <label htmlFor="dmUsernameModal" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Username or Display Name
                </label>
                <input
                  id="dmUsernameModal"
                  type="text"
                  placeholder="e.g. John Smith"
                  value={newDMUsername}
                  onChange={(e) => setNewDMUsername(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-md bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--text-accent)] focus:border-[var(--text-accent)] outline-none"
                  required
                />
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  Enter the name of the person you want to message.
                </p>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {setIsNewDMModalOpen(false); setNewDMUsername('');}}
                  className="px-4 py-2 text-sm font-medium rounded-md border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium rounded-md bg-[var(--text-accent)] text-white hover:bg-opacity-90 disabled:opacity-50 cursor-pointer"
                  disabled={!newDMUsername.trim()}
                >
                  Start Conversation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="fixed bottom-5 right-5 z-[100] space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-md shadow-lg text-sm font-medium
              ${toast.type === 'success' ? 'bg-green-500 text-white' : ''}
              ${toast.type === 'error' ? 'bg-red-500 text-white' : ''}
              ${toast.type === 'info' ? 'bg-blue-500 text-white dark:bg-blue-600' : ''}
              animate-fadeInOutToast
            `}
          >
            {toast.message}
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes fadeInOutToast {
          0% { opacity: 0; transform: translateY(10px) scale(0.95); }
          10% { opacity: 1; transform: translateY(0) scale(1); }
          90% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(10px) scale(0.95); }
        }
        .animate-fadeInOutToast {
          animation: fadeInOutToast 3s ease-in-out forwards;
        }
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: var(--bg-tertiary) var(--bg-secondary);
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: var(--bg-secondary);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: var(--bg-tertiary);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: var(--bg-hover);
        }
      `}</style>
    </>
  );
};

export default HomePage;
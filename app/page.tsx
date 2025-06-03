"use client"; 
import Head from 'next/head';
import { NextPage } from 'next';
import { useState, useEffect, useRef, FormEvent, ChangeEvent, useMemo } from 'react';
import type { JSX } from 'react';
import { FiMessageSquare, FiUsers, FiSettings, FiSun, FiMoon, FiSend, FiPlusCircle, FiSearch, FiLogOut, FiChevronDown, FiX, FiPaperclip, FiImage, FiFile, FiDownload } from 'react-icons/fi';
import { FaHashtag, FaRegSmile } from "react-icons/fa";
import EmojiPicker, { EmojiClickData, Theme as EmojiPickerTheme } from 'emoji-picker-react';

type Theme = 'light' | 'dark';

interface Room {
 id: string;
 name: string;
 icon?: JSX.Element;
 unread?: number;
 type: 'channel' | 'dm';
 avatar?: string;
 description?: string;
}

interface Message {
 id:string;
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


const USER_AVATAR = 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fHww';
const CURRENT_USER_NAME = "You";

const INITIAL_ROOMS: Room[] = [
 { id: '1', name: 'general', icon: <FaHashtag className="text-gray-400" />, unread: 3, type: 'channel', description: 'General team discussions' },
 { id: '2', name: 'random', icon: <FaHashtag className="text-gray-400" />, type: 'channel', description: 'Anything under the sun' },
 { id: '3', name: 'dev-team', icon: <FaHashtag className="text-gray-400" />, unread: 1, type: 'channel', description: 'Software development discussions' },
 { id: '6', name: 'design-talk', icon: <FaHashtag className="text-gray-400" />, type: 'channel', description: 'All about UI/UX and graphics' },
 { id: '7', name: 'product-updates', icon: <FaHashtag className="text-gray-400" />, unread: 2, type: 'channel', description: 'Latest news on product development' },
 { id: '4', name: 'Alice Wonderland', avatar: 'https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXZhdGFyfGVufDB8fDB8fHww', type: 'dm' },
 { id: '5', name: 'Bob The Builder', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww', type: 'dm' },
 { id: '8', name: 'Charlie Brown', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YXZhdGFyfGVufDB8fDB8fHww', type: 'dm', unread: 1 },
 { id: '9', name: 'Diana Prince', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww', type: 'dm' },
];

const INITIAL_MESSAGES: Message[] = [
 { id: 'm1', roomId: '1', text: 'Hello team! Any updates on project Alpha?', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 65), senderName: 'Eve', avatar: 'https://plus.unsplash.com/premium_photo-1670884441012-c5cf195c062a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww' },
 { id: 'm2', roomId: '1', text: 'Hey Eve! I just pushed the latest commits.', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 63), avatar: USER_AVATAR, senderName: CURRENT_USER_NAME },
 { id: 'm3', roomId: '1', text: 'Great, I\'ll check them out. Thanks!', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 61), senderName: 'Eve', avatar: 'https://plus.unsplash.com/premium_photo-1670884441012-c5cf195c062a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww' },
 { id: 'm20', roomId: '1', text: 'Meeting at 3 PM today to discuss the new roadmap. 📅', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 30), senderName: 'David Lee', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YXZhdGFyfGVufDB8fDB8fHww'},
 { id: 'm4', roomId: '2', text: 'Anyone seen that new cat video? Hilarious! 😹', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 50), senderName: 'Charlie', avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D' },
 { id: 'm7', roomId: '2', text: 'Check out this image I found!', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 48), senderName: 'Charlie', avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D', attachment: { type: 'image', url: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.3', name: 'landscape.jpg' }},
 { id: 'm21', roomId: '2', text: 'I agree, super funny! 😂 Have you tried the new coffee shop downtown?', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 45), avatar: USER_AVATAR, senderName: CURRENT_USER_NAME },
 { id: 'm22', roomId: '2', text: 'Not yet, is it any good?', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 44), senderName: 'Charlie', avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D' },
 { id: 'm23', roomId: '3', text: 'Need help with a TypeScript error, anyone free?', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 20), senderName: 'Grace', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww'},
 { id: 'm24', roomId: '3', text: 'Sure, I can take a look. What\'s the issue?', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 18), avatar: USER_AVATAR, senderName: CURRENT_USER_NAME },
 { id: 'm25', roomId: '3', text: 'Thanks! It\'s related to generics.', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 17), senderName: 'Grace', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww'},
 { id: 'm5', roomId: '4', text: 'Hi Alice! How are you doing?', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 12), avatar: USER_AVATAR, senderName: CURRENT_USER_NAME },
 { id: 'm6', roomId: '4', text: 'Doing great! Just working on a new feature. You?', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 11), senderName: 'Alice Wonderland', avatar: 'https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXZhdGFyfGVufDB8fDB8fHww' },
 { id: 'm26', roomId: '4', text: 'Pretty busy, but good! Want to grab lunch next week?', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 5), avatar: USER_AVATAR, senderName: CURRENT_USER_NAME },
 { id: 'm27', roomId: '5', text: 'Hey Bob, can you send me the report? 📄', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 25), avatar: USER_AVATAR, senderName: CURRENT_USER_NAME, attachment: { type: 'file', name: 'request-details.pdf', url: '#', size: 120 * 1024 } },
 { id: 'm28', roomId: '5', text: 'Sure, sending it over now.', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 23), senderName: 'Bob The Builder', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww' },
 { id: 'm29', roomId: '6', text: 'What does everyone think of the new logo proposal?', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 40), senderName: 'Sophia', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D' },
 { id: 'm30', roomId: '6', text: 'I like it! The colors are vibrant. 👍', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 38), avatar: USER_AVATAR, senderName: CURRENT_USER_NAME },
 { id: 'm31', roomId: '6', text: 'Here\'s a mockup I made.', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 35), senderName: 'Sophia', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D', attachment: { type: 'image', url: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2F0JTIwYXZhdGFyfGVufDB8fDB8fHww', name: 'logo_mockup.png'}},
 { id: 'm32', roomId: '7', text: '📢 New version 2.5.0 is now live! Check out the release notes.', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 55), senderName: 'Product Team Bot', avatar: 'https://plus.unsplash.com/premium_photo-1677094310956-7f88ae5f5c6b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Ym90JTIwYXZhdGFyfGVufDB8fDB8fHww' },
 { id: 'm33', roomId: '7', text: 'Awesome! Excited to try the new features. 🎉', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 52), avatar: USER_AVATAR, senderName: CURRENT_USER_NAME },
 { id: 'm34', roomId: '8', text: 'Hey, are we still on for coffee tomorrow?', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 8), senderName: 'Charlie Brown', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YXZhdGFyfGVufDB8fDB8fHww' },
 { id: 'm35', roomId: '8', text: 'Yes! Looking forward to it. ☕', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 7), avatar: USER_AVATAR, senderName: CURRENT_USER_NAME },
 { id: 'm36', roomId: '9', text: 'Can you review this document when you have a moment?', sender: 'other', timestamp: new Date(Date.now() - 1000 * 60 * 15), senderName: 'Diana Prince', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww', attachment: { type: 'file', url: '#', name: 'project_proposal.docx', size: 256 * 1024 }},
 { id: 'm37', roomId: '9', text: 'Will do! I\'ll get to it this afternoon.', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 14), avatar: USER_AVATAR, senderName: CURRENT_USER_NAME },
];


const HomePage: NextPage = () => {
 const [appTheme, setAppTheme] = useState<Theme>('light');
 const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
 const [selectedRoomId, setSelectedRoomId] = useState<string | null>(INITIAL_ROOMS[0]?.id || null);
 const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
 const [currentMessage, setCurrentMessage] = useState<string>('');
 const [toasts, setToasts] = useState<ToastMessage[]>([]);
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 
 const [searchTerm, setSearchTerm] = useState('');
 const [isAddChannelModalOpen, setIsAddChannelModalOpen] = useState(false);
 const [isNewDMModalOpen, setIsNewDMModalOpen] = useState(false);
 const [newChannelName, setNewChannelName] = useState('');
 const [newDMUsername, setNewDMUsername] = useState('');
 const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
 const [selectedFile, setSelectedFile] = useState<File | null>(null);
 const [isUploading, setIsUploading] = useState(false);
 const [isClient, setIsClient] = useState(false);

 const messagesEndRef = useRef<HTMLDivElement | null>(null);
 const fileInputRef = useRef<HTMLInputElement | null>(null);
 const emojiPickerRef = useRef<HTMLDivElement | null>(null);
 const emojiButtonRef = useRef<HTMLButtonElement | null>(null);
 const messageInputRef = useRef<HTMLInputElement | null>(null);


 useEffect(() => {
   setIsClient(true); 
   const storedTheme = localStorage.getItem('chat-app-theme') as Theme | null;
   if (storedTheme) {
     setAppTheme(storedTheme);
     document.documentElement.classList.toggle('dark', storedTheme === 'dark');
   } else {
     const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
     const initialTheme = prefersDark ? 'dark' : 'light';
     setAppTheme(initialTheme);
     document.documentElement.classList.toggle('dark', initialTheme === 'dark');
     localStorage.setItem('chat-app-theme', initialTheme);
   }
 }, []);

 const toggleTheme = () => {
   setAppTheme(prevTheme => {
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

 const filteredRoomsAndDMs = useMemo(() => {
   if (searchTerm.trim() === '') {
     return [];
   }
   return rooms.filter(room =>
     room.name.toLowerCase().includes(searchTerm.toLowerCase())
   );
 }, [searchTerm, rooms]);

 const handleSelectRoom = (roomId: string) => {
   setSelectedRoomId(roomId);
   setRooms(prevRooms => prevRooms.map(r => {
     if (r.id === roomId) {
       const { unread, ...rest } = r;
       return rest;
     }
     return r;
   }));
   setIsMobileMenuOpen(false);
   setIsEmojiPickerOpen(false);
 };

 const handleSendMessage = (e: FormEvent) => {
   e.preventDefault();
   if ((!currentMessage.trim() && !selectedFile) || !selectedRoomId) return;

   let attachment: Attachment | undefined;
   setIsUploading(true); 

   if (selectedFile) {
     const fileType = selectedFile.type.startsWith('image/') ? 'image' : 'file';
     const objectURL = URL.createObjectURL(selectedFile); 
     
     attachment = {
       type: fileType,
       url: objectURL, 
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
     senderName: CURRENT_USER_NAME,
     attachment
   };
   
   setMessages(prevMessages => [...prevMessages, newMessage]);
   setCurrentMessage('');
   setSelectedFile(null);
   if (fileInputRef.current) fileInputRef.current.value = ''; 
   messageInputRef.current?.focus(); 
   setIsUploading(false); 

   const selectedRoom = rooms.find(r => r.id === selectedRoomId);
   if (selectedRoom) {
     setTimeout(() => {
       const replyText = selectedRoom.type === 'dm' 
           ? `Got your message! I'll reply soon.`
           : `Thanks for posting in ${selectedRoom.name}!`;
       
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
   const channelName = newChannelName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
   
   if (rooms.some(room => room.type === 'channel' && room.name === channelName)) {
     showToast(`Channel #${channelName} already exists`, 'error');
     return;
   }

   const newChannel: Room = {
     id: `channel-${Date.now()}`,
     name: channelName,
     icon: <FaHashtag className="text-gray-400" />,
     type: 'channel',
     description: `Discussions for #${channelName}`
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

   const avatarIndex = Math.floor(Math.random() * 70) + 1; 
   const gender = Math.random() > 0.5 ? 'men' : 'women';
   const newDM: Room = {
     id: `dm-${Date.now()}`,
     name: newDMUsername.trim(),
     type: 'dm',
     avatar: `https://randomuser.me/api/portraits/${gender}/${avatarIndex}.jpg`
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
      if (file.size > 10 * 1024 * 1024) { 
       showToast('File is too large (max 10MB).', 'error');
       return;
     }
     setSelectedFile(file);
     showToast(`Selected: ${file.name}`, 'info');
     setIsEmojiPickerOpen(false);
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

 const onEmojiPickerClick = (emojiData: EmojiClickData) => {
   setCurrentMessage(prev => prev + emojiData.emoji);
   messageInputRef.current?.focus(); 
 };

 useEffect(() => {
   function handleClickOutside(event: MouseEvent) {
     if (isEmojiPickerOpen && 
         emojiPickerRef.current && 
         !emojiPickerRef.current.contains(event.target as Node) &&
         emojiButtonRef.current &&
         !emojiButtonRef.current.contains(event.target as Node)
         ) {
       setIsEmojiPickerOpen(false);
     }
   }
   document.addEventListener('mousedown', handleClickOutside);
   return () => {
     document.removeEventListener('mousedown', handleClickOutside);
   };
 }, [isEmojiPickerOpen]);

 const filteredMessages = useMemo(() => {
   return messages
     .filter(msg => msg.roomId === selectedRoomId)
     .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
 }, [messages, selectedRoomId]);

 useEffect(() => {
   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [filteredMessages]);

 const selectedRoomDetails = rooms.find(room => room.id === selectedRoomId);

 // Clear unread count for initially selected room
 useEffect(() => {
   if (selectedRoomId) {
     setRooms(prevRooms => prevRooms.map(r => {
       if (r.id === selectedRoomId) {
         const { unread, ...rest } = r;
         return rest;
       }
       return r;
     }));
   }
 }, []); // Run only once on component mount

 return (
   <>
     <Head>
       <title>Chat App Pro</title>
       <meta name="description" content="A feature-rich messaging application" />
       <link rel="icon" href="/favicon.ico" />
     </Head>

     <style jsx global>{`
       :root {
         --bg-primary: #ffffff; --bg-secondary: #f3f4f6; --bg-tertiary: #e5e7eb; --bg-hover: #d1d5db;
         --text-primary: #1f2937; --text-secondary: #4b5563; --text-accent: #3b82f6;
         --border-color: #d1d5db; --sidebar-bg: #f9fafb; --sidebar-text: #374151;
         --sidebar-hover-bg: #e5e7eb; --sidebar-active-bg: #dbeafe; --sidebar-active-text: #2563eb;
         --input-bg: #ffffff; --input-border: #cbd5e1; --message-user-bg: #3b82f6;
         --message-user-text: #ffffff; --message-other-bg: #e5e7eb; --message-other-text: #1f2937;
         --shadow-color: rgba(0, 0, 0, 0.1); --modal-overlay: rgba(0, 0, 0, 0.5);
       }
       html.dark {
         --bg-primary: #111827; --bg-secondary: #1f2937; --bg-tertiary: #374151; --bg-hover: #4b5563;
         --text-primary: #f3f4f6; --text-secondary: #9ca3af; --text-accent: #60a5fa;
         --border-color: #374151; --sidebar-bg: #1f2937; --sidebar-text: #d1d5db;
         --sidebar-hover-bg: #374151; --sidebar-active-bg: #1e40af; --sidebar-active-text: #eff6ff;
         --input-bg: #1f2937; --input-border: #4b5563; --message-user-bg: #2563eb;
         --message-user-text: #ffffff; --message-other-bg: #374151; --message-other-text: #f3f4f6;
         --shadow-color: rgba(0, 0, 0, 0.3); --modal-overlay: rgba(0, 0, 0, 0.7);
       }
       html {
         height: 100%;
         overflow: hidden; 
       }
       body { 
         background-color: var(--bg-primary); 
         color: var(--text-primary); 
         transition: background-color 0.3s ease, color 0.3s ease; 
         font-family: 'Inter', sans-serif; 
         height: 100%;
         overflow: hidden; 
         overflow-x: hidden; 
       }
       
       /* Hide all scrollbars globally */
       * {
         scrollbar-width: none; /* Firefox */
         -ms-overflow-style: none; /* Internet Explorer 10+ */
       }
       *::-webkit-scrollbar { 
         display: none; /* WebKit */
       }
       
       html.dark .EmojiPickerReact {
         --epr-bg-color: var(--bg-secondary);
         --epr-text-color: var(--text-primary);
         --epr-search-input-bg-color: var(--input-bg);
         --epr-category-label-bg-color: var(--bg-secondary);
         --epr-hover-bg-color: var(--bg-tertiary);
         --epr-focus-bg-color: var(--bg-hover);
         --epr-border-color: var(--border-color);
       }
       
       /* Animation Keyframes */
       @keyframes slideInFromLeft {
         0% { transform: translateX(-100%); opacity: 0; }
         100% { transform: translateX(0); opacity: 1; }
       }
       
       @keyframes slideInFromRight {
         0% { transform: translateX(100%); opacity: 0; }
         100% { transform: translateX(0); opacity: 1; }
       }
       
       @keyframes fadeInUp {
         0% { transform: translateY(20px); opacity: 0; }
         100% { transform: translateY(0); opacity: 1; }
       }
       
       @keyframes fadeInDown {
         0% { transform: translateY(-20px); opacity: 0; }
         100% { transform: translateY(0); opacity: 1; }
       }
       
       @keyframes scaleIn {
         0% { transform: scale(0.8); opacity: 0; }
         100% { transform: scale(1); opacity: 1; }
       }
       
       @keyframes pulse {
         0% { transform: scale(1); }
         50% { transform: scale(1.05); }
         100% { transform: scale(1); }
       }
       
       @keyframes bounce {
         0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
         40% { transform: translateY(-10px); }
         60% { transform: translateY(-5px); }
       }
       
       @keyframes shake {
         0%, 100% { transform: translateX(0); }
         10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
         20%, 40%, 60%, 80% { transform: translateX(2px); }
       }
       
       @keyframes glow {
         0% { box-shadow: 0 0 5px var(--text-accent); }
         50% { box-shadow: 0 0 20px var(--text-accent), 0 0 30px var(--text-accent); }
         100% { box-shadow: 0 0 5px var(--text-accent); }
       }
       
       @keyframes typing {
         0% { width: 0; }
         100% { width: 100%; }
       }
       
       @keyframes blink {
         0%, 50% { opacity: 1; }
         51%, 100% { opacity: 0; }
       }
       
       /* Animation Classes */
       .animate-slideInLeft {
         animation: slideInFromLeft 0.5s ease-out forwards;
       }
       
       .animate-slideInRight {
         animation: slideInFromRight 0.5s ease-out forwards;
       }
       
       .animate-fadeInUp {
         animation: fadeInUp 0.3s ease-out forwards;
       }
       
       .animate-fadeInDown {
         animation: fadeInDown 0.3s ease-out forwards;
       }
       
       .animate-scaleIn {
         animation: scaleIn 0.2s ease-out forwards;
       }
       
       .animate-pulse {
         animation: pulse 2s infinite;
       }
       
       .animate-shake {
         animation: shake 0.5s ease-in-out;
       }
       
       .animate-glow {
         animation: glow 2s ease-in-out infinite;
       }
       
       /* Interactive Animations */
       .hover-lift {
         transition: transform 0.2s ease, box-shadow 0.2s ease;
       }
       
       .hover-lift:hover {
         transform: translateY(-2px);
         box-shadow: 0 4px 12px var(--shadow-color);
       }
       
       .hover-scale {
         transition: transform 0.2s ease;
       }
       
       .hover-scale:hover {
         transform: scale(1.05);
       }
       
       .hover-rotate {
         transition: transform 0.3s ease;
       }
       
       .hover-rotate:hover {
         transform: rotate(180deg);
       }
       
       .hover-glow {
         transition: box-shadow 0.3s ease;
       }
       
       .hover-glow:hover {
         box-shadow: 0 0 15px var(--text-accent);
       }
       
       /* Button Animations */
       .btn-animate {
         position: relative;
         overflow: hidden;
         transition: all 0.3s ease;
       }
       
       .btn-animate::before {
         content: '';
         position: absolute;
         top: 0;
         left: -100%;
         width: 100%;
         height: 100%;
         background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
         transition: left 0.5s ease;
       }
       
       .btn-animate:hover::before {
         left: 100%;
       }
       
       .btn-animate:active {
         transform: scale(0.98);
       }
       
       /* Message Animations */
       .message-enter {
         animation: fadeInUp 0.4s ease-out forwards;
         opacity: 0;
         transform: translateY(20px);
       }
       
       .message-user {
         animation: slideInFromRight 0.4s ease-out forwards;
       }
       
       .message-other {
         animation: slideInFromLeft 0.4s ease-out forwards;
       }
       
       /* Sidebar Animations */
       .sidebar-item {
         transition: all 0.2s ease;
         position: relative;
       }
       
       .sidebar-item::before {
         content: '';
         position: absolute;
         left: 0;
         top: 0;
         height: 100%;
         width: 3px;
         background-color: var(--text-accent);
         transform: scaleY(0);
         transition: transform 0.2s ease;
       }
       
       .sidebar-item:hover::before,
       .sidebar-item.active::before {
         transform: scaleY(1);
       }
       
       .sidebar-item:hover {
         transform: translateX(5px);
         background-color: var(--sidebar-hover-bg);
       }
       
       /* Modal Animations */
       .modal-overlay {
         animation: fadeInUp 0.3s ease-out forwards;
       }
       
       .modal-content {
         animation: scaleIn 0.3s ease-out forwards;
       }
       
       /* Toast Animations */
       @keyframes slideInFromTop {
         0% { transform: translateY(-100px) scale(0.8); opacity: 0; }
         100% { transform: translateY(0) scale(1); opacity: 1; }
       }
       
       @keyframes slideOutToTop {
         0% { transform: translateY(0) scale(1); opacity: 1; }
         100% { transform: translateY(-100px) scale(0.8); opacity: 0; }
       }
       
       .toast-enter {
         animation: slideInFromTop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
       }
       
       .toast-exit {
         animation: slideOutToTop 0.3s ease-in forwards;
       }
       
       /* Loading Animations */
       .loading-dots {
         display: inline-flex;
         gap: 2px;
       }
       
       .loading-dots span {
         width: 4px;
         height: 4px;
         border-radius: 50%;
         background-color: currentColor;
         animation: bounce 1.4s ease-in-out infinite both;
       }
       
       .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
       .loading-dots span:nth-child(2) { animation-delay: -0.16s; }
       .loading-dots span:nth-child(3) { animation-delay: 0s; }
       
       /* Emoji Picker Animations */
       .emoji-picker-enter {
         animation: scaleIn 0.2s ease-out forwards;
         transform-origin: bottom right;
       }
       
       /* Stagger Animation for Lists */
       .stagger-item {
         opacity: 0;
         transform: translateY(20px);
         animation: fadeInUp 0.4s ease-out forwards;
       }
       
       .stagger-item:nth-child(1) { animation-delay: 0.1s; }
       .stagger-item:nth-child(2) { animation-delay: 0.2s; }
       .stagger-item:nth-child(3) { animation-delay: 0.3s; }
       .stagger-item:nth-child(4) { animation-delay: 0.4s; }
       .stagger-item:nth-child(5) { animation-delay: 0.5s; }
       .stagger-item:nth-child(6) { animation-delay: 0.6s; }
       .stagger-item:nth-child(7) { animation-delay: 0.7s; }
       .stagger-item:nth-child(8) { animation-delay: 0.8s; }
       .stagger-item:nth-child(9) { animation-delay: 0.9s; }
       .stagger-item:nth-child(10) { animation-delay: 1.0s; }
       
       /* Smooth Transitions */
       * {
         transition-property: color, background-color, border-color, box-shadow, transform;
         transition-duration: 0.2s;
         transition-timing-function: ease;
       }
       
       /* Focus Animations */
       input:focus, textarea:focus, button:focus {
         outline: none;
         box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
         animation: glow 0.3s ease-out;
       }
     `}</style>

     <div className="flex h-screen antialiased text-gray-800 dark:text-gray-200 overflow-hidden">
       
       <div className={`
         ${isMobileMenuOpen ? 'fixed inset-0 z-40 flex' : 'hidden md:fixed md:inset-y-0 md:flex'} 
         md:w-72 flex-col bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] transition-transform duration-300 ease-in-out
         ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
       `}>
         <div className="flex flex-col h-full">
           <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--border-color)] shrink-0 animate-fadeInDown">
             <div className="flex items-center">
               <FiMessageSquare className="w-8 h-8 text-[var(--text-accent)] hover-scale" />
               <span className="ml-2 text-xl font-semibold text-[var(--sidebar-text)]">Convey</span>
             </div>
             <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-1 text-[var(--sidebar-text)] hover:text-[var(--text-accent)] cursor-pointer hover-scale">
               <FiX className="w-6 h-6" />
             </button>
           </div>

           <div className="p-4 border-b border-[var(--border-color)] animate-fadeInLeft" style={{ animationDelay: '0.2s' }}>
               <div className="flex items-center">
                   <img src={USER_AVATAR} alt="User Avatar" className="w-10 h-10 rounded-full mr-3 object-cover hover-scale"/>
                   <div>
                       <p className="font-semibold text-[var(--sidebar-text)]">{CURRENT_USER_NAME}</p>
                       <p className="text-xs text-green-500 animate-pulse">Online</p>
                   </div>
                   <FiChevronDown className="ml-auto text-[var(--sidebar-text)] cursor-pointer hover-scale hover-rotate" onClick={() => showToast('Profile options coming soon!', 'info')} />
               </div>
           </div>

           <div className="p-4 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
             <div className="relative">
               <FiSearch className="absolute w-5 h-5 text-gray-400 top-1/2 left-3 transform -translate-y-1/2 hover-scale" />
               <input
                 type="text"
                 placeholder="Search channels or DMs..."
                 className="w-full py-2 pl-10 pr-4 text-sm border rounded-lg bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--text-accent)] focus:border-[var(--text-accent)] outline-none transition-all duration-300 hover-glow"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
             
             {filteredRoomsAndDMs.length > 0 && searchTerm.trim() !== '' && (
               <div className="mt-2 p-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg shadow-lg max-h-60 overflow-y-auto animate-scaleIn">
                 <h3 className="text-xs font-semibold px-2 py-1 text-[var(--text-secondary)]">Search Results</h3>
                 {filteredRoomsAndDMs.map(room => (
                   <a
                     key={room.id}
                     href="#"
                     onClick={(e) => { e.preventDefault(); handleSelectRoom(room.id); setSearchTerm(''); }}
                     className="flex items-center px-2 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--sidebar-hover-bg)] rounded-md cursor-pointer hover-lift"
                   >
                     {room.type === 'channel' ? (
                       room.icon || <FaHashtag className="mr-2 text-base text-gray-400 hover-scale" />
                     ) : (
                       <img src={room.avatar} alt={room.name} className="w-6 h-6 mr-2 rounded-full object-cover hover-scale" />
                     )}
                     <span>{room.name}</span>
                     <span className="ml-auto text-xs text-[var(--text-secondary)]">{room.type === 'channel' ? 'Channel' : 'DM'}</span>
                   </a>
                 ))}
               </div>
             )}
           </div>

           <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
             <h3 className="px-2 pt-2 pb-1 text-xs font-semibold tracking-wider uppercase text-[var(--text-secondary)] animate-fadeInDown">Channels</h3>
             {rooms.filter(r => r.type === 'channel').map((room, index) => (
               <a
                 key={room.id}
                 href="#"
                 onClick={(e) => { e.preventDefault(); handleSelectRoom(room.id); }}
                 className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg group cursor-pointer sidebar-item stagger-item hover-lift
                   ${selectedRoomId === room.id 
                     ? 'bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] active' 
                     : 'text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--text-primary)]'
                   }
                 `}
                 style={{ animationDelay: `${index * 0.1}s` }}
               >
                 {room.icon || <FaHashtag className="mr-3 text-base text-gray-400 hover-scale" />}
                 <span className="flex-1 truncate">{room.name}</span>
                 {room.unread && room.unread > 0 && (
                   <span className="px-2 py-0.5 ml-auto text-xs font-medium text-white bg-red-500 rounded-full">{room.unread}</span>
                 )}
               </a>
             ))}
             <button 
               type="button"
               onClick={() => setIsAddChannelModalOpen(true)}
               className="flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--text-primary)] group cursor-pointer sidebar-item hover-lift btn-animate"
             >
               <FiPlusCircle className="mr-3 text-base text-gray-400 group-hover:text-[var(--text-accent)] hover-rotate" />
               Add Channel
             </button>

             <h3 className="px-2 pt-4 pb-1 text-xs font-semibold tracking-wider uppercase text-[var(--text-secondary)] animate-fadeInDown" style={{ animationDelay: '0.5s' }}>Direct Messages</h3>
             {rooms.filter(r => r.type === 'dm').map((room, index) => (
               <a
                 key={room.id}
                 href="#"
                 onClick={(e) => { e.preventDefault(); handleSelectRoom(room.id); }}
                 className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg group cursor-pointer sidebar-item stagger-item hover-lift
                   ${selectedRoomId === room.id 
                     ? 'bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] active' 
                     : 'text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--text-primary)]'
                   }
                 `}
                 style={{ animationDelay: `${(index + 6) * 0.1}s` }}
               >
                 <img src={room.avatar} alt={room.name} className="w-6 h-6 mr-3 rounded-full object-cover hover-scale" />
                 <span className="flex-1 truncate">{room.name}</span>
                  {room.unread && room.unread > 0 && (
                   <span className="px-2 py-0.5 ml-auto text-xs font-medium text-white bg-red-500 rounded-full">{room.unread}</span>
                 )}
               </a>
             ))}
              <button 
               type="button"
               onClick={() => setIsNewDMModalOpen(true)}
               className="flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--text-primary)] group cursor-pointer sidebar-item hover-lift btn-animate"
             >
               <FiPlusCircle className="mr-3 text-base text-gray-400 group-hover:text-[var(--text-accent)] hover-rotate" />
               New DM
             </button>
           </nav>

           <div className="p-3 mt-auto border-t border-[var(--border-color)] animate-fadeInUp" style={{ animationDelay: '1.2s' }}>
             <div className="flex items-center justify-between">
                <button type="button" onClick={() => showToast('Settings page coming soon.', 'info')} className="p-2 text-sm rounded-md text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover-bg)] cursor-pointer hover-scale btn-animate" title="Settings">
                   <FiSettings className="w-5 h-5 hover-rotate" />
                 </button>
               <button type="button" onClick={toggleTheme} className="p-2 rounded-md text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover-bg)] cursor-pointer hover-scale btn-animate" title={`Switch to ${appTheme === 'light' ? 'Dark' : 'Light'} Mode`}>
                 {appTheme === 'light' ? <FiMoon className="w-5 h-5 hover-rotate" /> : <FiSun className="w-5 h-5 hover-rotate" />}
               </button>
                <button type="button" onClick={() => showToast('Logout feature coming soon.', 'info')} className="p-2 text-sm rounded-md text-red-500 hover:bg-red-100 dark:hover:bg-red-800 dark:hover:text-red-300 cursor-pointer hover-scale btn-animate" title="Logout">
                   <FiLogOut className="w-5 h-5 hover-scale" />
                 </button>
             </div>
           </div>
         </div>
       </div>
       
       {isMobileMenuOpen && (
         <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
       )}

       <div className="flex flex-col flex-1 md:ml-72 h-screen bg-[var(--bg-secondary)] overflow-hidden"> 
         <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-color)] bg-[var(--bg-primary)] shrink-0 animate-fadeInDown">
           <div className="flex items-center min-w-0"> 
              <button type="button" onClick={() => setIsMobileMenuOpen(true)} className="md:hidden mr-3 p-1 text-[var(--text-primary)] hover:text-[var(--text-accent)] shrink-0 cursor-pointer hover-scale">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
               </svg>
             </button>
             {selectedRoomDetails ? (
               <div className="flex items-center animate-fadeInRight">
                 {selectedRoomDetails.type === 'dm' && selectedRoomDetails.avatar && (
                   <img src={selectedRoomDetails.avatar} alt={selectedRoomDetails.name} className="w-8 h-8 mr-3 rounded-full object-cover shrink-0 hover-scale"/>
                 )}
                 {selectedRoomDetails.type === 'channel' && selectedRoomDetails.icon && (
                   <div className="mr-3 text-[var(--text-secondary)] shrink-0 hover-scale">{selectedRoomDetails.icon}</div>
                 )}
                 <h2 className="text-lg font-semibold text-[var(--text-primary)] truncate">{selectedRoomDetails.name}</h2>
                 {selectedRoomDetails.type === 'dm' && <span className="ml-2 w-2.5 h-2.5 bg-green-500 rounded-full shrink-0 animate-pulse"></span>}
               </div>
             ) : (
               <h2 className="text-lg font-semibold text-[var(--text-primary)] animate-fadeInRight">Select a conversation</h2>
             )}
           </div>
           <div className="flex items-center space-x-1 sm:space-x-3 shrink-0 animate-fadeInLeft">
             <button type="button" onClick={() => showToast('Call feature coming soon!', 'info')} className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] cursor-pointer hover-scale btn-animate">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" /></svg>
             </button>
              <button type="button" onClick={() => showToast('Video call feature coming soon!', 'info')} className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] cursor-pointer hover-scale btn-animate">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" /></svg>
             </button>
             <button type="button" onClick={() => showToast('Room info panel coming soon!', 'info')} className="p-2 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] cursor-pointer hover-scale btn-animate">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
             </button>
           </div>
         </div>

         <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto"> 
           {selectedRoomId ? (
             filteredMessages.length > 0 ? (
               filteredMessages.map((msg, index) => (
                 <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} message-enter`} style={{ animationDelay: `${index * 0.1}s` }}>
                   <div className={`flex items-end gap-3 max-w-[90%] xs:max-w-[80%] sm:max-w-xs lg:max-w-md hover-lift ${msg.sender === 'user' ? 'flex-row-reverse message-user' : 'message-other'}`}> 
                      {msg.sender === 'other' && (
                         <img src={msg.avatar} alt={msg.senderName || "Avatar"} className="w-8 h-8 rounded-full object-cover self-start shrink-0 hover-scale"/>
                       )}
                     <div className={`p-3 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg ${msg.sender === 'user' ? 'bg-[var(--message-user-bg)] text-[var(--message-user-text)] rounded-br-none' : 'bg-[var(--message-other-bg)] text-[var(--message-other-text)] rounded-bl-none'}`}>
                       {msg.sender === 'other' && msg.senderName && (
                         <p className="text-xs font-semibold mb-1 opacity-80">{msg.senderName}</p>
                       )}
                       {msg.text && <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>}
                       
                       {msg.attachment && (
                         <div className={`mt-2 ${!msg.text ? 'mt-0' : ''} animate-fadeInUp`}>
                           {msg.attachment?.type === 'image' ? (
                             <div className="relative group">
                               <img src={msg.attachment?.url} alt={msg.attachment?.name} className="max-w-full h-auto rounded-lg max-h-60 object-cover cursor-pointer transition-transform duration-300 hover:scale-105" onClick={() => window.open(msg.attachment?.url, '_blank')}/>
                               <p className="text-xs mt-1 opacity-70">{msg.attachment?.name}</p>
                             </div>
                           ) : (
                             <div className="flex items-center p-2 bg-black/10 dark:bg-white/10 rounded-lg hover-lift">
                               <FiFile className="mr-2 text-lg shrink-0 text-[var(--text-accent)] hover-scale" />
                               <div className="truncate">
                                 <p className="text-xs font-medium truncate">{msg.attachment.name}</p>
                                 {msg.attachment.size && (<p className="text-xs opacity-70">{(msg.attachment.size / 1024).toFixed(1)} KB</p>)}
                               </div>
                               <a href={msg.attachment.url} target="_blank" rel="noopener noreferrer" download={msg.attachment.name} className="ml-auto p-1 text-[var(--text-accent)] hover:text-opacity-80 cursor-pointer hover-scale">
                                 <FiDownload className="w-4 h-4" />
                               </a>
                             </div>
                           )}
                         </div>
                       )}
                       <p className={`text-xs mt-1 opacity-70 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                         {isClient ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                       </p>
                     </div>
                      {msg.sender === 'user' && (
                         <img src={msg.avatar} alt={msg.senderName || "User Avatar"} className="w-8 h-8 rounded-full object-cover self-start shrink-0 hover-scale"/>
                       )}
                   </div>
                 </div>
               ))
             ) : (
               <div className="flex flex-col items-center justify-center h-full text-center text-[var(--text-secondary)] animate-fadeInUp">
                 <FiMessageSquare className="w-16 h-16 mb-4 opacity-50 animate-pulse" />
                 <p className="text-xl font-semibold">No messages yet</p>
                 <p>Be the first to send a message in {selectedRoomDetails?.type === 'channel' ? '#' : ''}{selectedRoomDetails?.name || 'this room'}.</p>
               </div>
             )
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-center text-[var(--text-secondary)] animate-fadeInUp">
               <FiUsers className="w-16 h-16 mb-4 opacity-50 animate-pulse" />
               <p className="text-xl font-semibold">Welcome to Convey!</p>
               <p>Select a channel or DM from the sidebar to start chatting.</p>
             </div>
           )}
           <div ref={messagesEndRef} />
         </div>

         {selectedRoomId && (
           <div className="p-4 sm:p-3 border-t border-[var(--border-color)] bg-[var(--bg-primary)] shrink-0 animate-fadeInUp"> 
             {selectedFile && (
               <div className="mb-3 p-2 bg-[var(--bg-tertiary)] rounded-lg flex items-center animate-slideInLeft">
                 {selectedFile.type.startsWith('image/') ? <FiImage className="mr-2 text-[var(--text-secondary)] shrink-0 hover-scale" /> : <FiFile className="mr-2 text-[var(--text-secondary)] shrink-0 hover-scale" />}
                 <span className="text-sm truncate flex-1 mr-2">{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                 <button type="button" onClick={handleClearFile} className="p-1 ml-auto text-[var(--text-secondary)] hover:text-[var(--text-accent)] rounded-full cursor-pointer hover-scale">
                   <FiX className="w-4 h-4" />
                 </button>
               </div>
             )}
             
             <form onSubmit={handleSendMessage} className="flex items-center space-x-2 sm:space-x-3">
               <button type="button" onClick={triggerFileInput} className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-accent)] rounded-full hover:bg-[var(--bg-tertiary)] cursor-pointer hover-scale btn-animate">
                 <FiPaperclip className="w-5 h-5" />
               </button>
               <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*,application/pdf,.doc,.docx,.txt,.zip,.mp4,.mov,.mp3"/>
               
               <input
                 ref={messageInputRef}
                 type="text"
                 value={currentMessage}
                 onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentMessage(e.target.value)}
                 placeholder={`Message ${selectedRoomDetails?.type === 'channel' ? '#' : ''}${selectedRoomDetails?.name || '...'}`}
                 className="flex-1 px-3 py-2 text-sm border rounded-lg bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--text-accent)] focus:border-[var(--text-accent)] outline-none transition-all duration-300 hover-glow"
               />
               
               <div className="relative">
                 <button 
                   type="button"
                   ref={emojiButtonRef}
                   onClick={() => setIsEmojiPickerOpen(prev => !prev)}
                   className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-accent)] rounded-full hover:bg-[var(--bg-tertiary)] cursor-pointer hover-scale btn-animate"
                 >
                   <FaRegSmile className="w-5 h-5" />
                 </button>
                 
                 {isEmojiPickerOpen && (
                   <div ref={emojiPickerRef} className="absolute bottom-full right-0 mb-2 z-20 emoji-picker-enter">
                      <EmojiPicker
                         onEmojiClick={onEmojiPickerClick}
                         autoFocusSearch={false}
                         theme={appTheme === 'dark' ? EmojiPickerTheme.DARK : EmojiPickerTheme.LIGHT}
                         height={350}
                         width={320}
                         lazyLoadEmojis={true}
                         previewConfig={{showPreview: false}} 
                       />
                   </div>
                 )}
               </div>
               
               <button
                 type="submit"
                 className="p-2 rounded-lg bg-[var(--text-accent)] text-white hover:bg-opacity-90 focus:ring-2 focus:ring-offset-1 focus:ring-[var(--text-accent)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer hover-scale btn-animate animate-glow"
                 disabled={(!currentMessage.trim() && !selectedFile) || isUploading}
               >
                 {isUploading ? (
                   <div className="loading-dots">
                     <span></span>
                     <span></span>
                     <span></span>
                   </div>
                 ) : (
                   <FiSend className="w-5 h-5" />
                 )}
               </button>
             </form>
           </div>
         )}
       </div>
     </div>

     {isAddChannelModalOpen && (
       <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--modal-overlay)] p-4 modal-overlay">
         <div className="bg-[var(--bg-primary)] rounded-lg shadow-xl w-full max-w-md p-6 modal-content">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-semibold text-[var(--text-primary)]">Create New Channel</h3>
             <button type="button" onClick={() => {setIsAddChannelModalOpen(false); setNewChannelName('');}} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-accent)] cursor-pointer hover-scale"><FiX className="w-5 h-5" /></button>
           </div>
           <form onSubmit={handleAddChannel}>
             <div className="mb-4">
               <label htmlFor="channelName" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Channel Name</label>
               <div className="flex items-center">
                 <span className="mr-2 text-[var(--text-secondary)]"><FaHashtag /></span>
                 <input id="channelName" type="text" placeholder="e.g. marketing-updates" value={newChannelName} onChange={(e) => setNewChannelName(e.target.value)} className="flex-1 px-3 py-2 text-sm border rounded-md bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--text-accent)] outline-none transition-all duration-300" required />
               </div>
               <p className="mt-1 text-xs text-[var(--text-secondary)]">Use lowercase letters, numbers, and hyphens. Will be auto-formatted.</p>
             </div>
             <div className="flex justify-end space-x-3">
               <button type="button" onClick={() => {setIsAddChannelModalOpen(false); setNewChannelName('');}} className="px-4 py-2 text-sm font-medium rounded-md border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] cursor-pointer hover-lift btn-animate">Cancel</button>
               <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md bg-[var(--text-accent)] text-white hover:bg-opacity-90 disabled:opacity-50 cursor-pointer hover-lift btn-animate" disabled={!newChannelName.trim()}>Create Channel</button>
             </div>
           </form>
         </div>
       </div>
     )}

     {isNewDMModalOpen && (
       <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--modal-overlay)] p-4 modal-overlay">
         <div className="bg-[var(--bg-primary)] rounded-lg shadow-xl w-full max-w-md p-6 modal-content">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-semibold text-[var(--text-primary)]">Start Direct Message</h3>
             <button type="button" onClick={() => {setIsNewDMModalOpen(false); setNewDMUsername('');}} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-accent)] cursor-pointer hover-scale"><FiX className="w-5 h-5" /></button>
           </div>
           <form onSubmit={handleAddNewDM}>
             <div className="mb-4">
               <label htmlFor="dmUsername" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Username or Name</label>
               <input id="dmUsername" type="text" placeholder="e.g. John Doe" value={newDMUsername} onChange={(e) => setNewDMUsername(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-md bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--text-accent)] outline-none transition-all duration-300" required />
             </div>
             <div className="flex justify-end space-x-3">
               <button type="button" onClick={() => {setIsNewDMModalOpen(false); setNewDMUsername('');}} className="px-4 py-2 text-sm font-medium rounded-md border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] cursor-pointer hover-lift btn-animate">Cancel</button>
               <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md bg-[var(--text-accent)] text-white hover:bg-opacity-90 disabled:opacity-50 cursor-pointer hover-lift btn-animate" disabled={!newDMUsername.trim()}>Start Chat</button>
             </div>
           </form>
         </div>
       </div>
     )}

     <div className="fixed bottom-5 right-5 z-[100] space-y-2">
       {toasts.map(toast => (
         <div
           key={toast.id}
           className={`px-4 py-3 rounded-md shadow-lg text-sm font-medium min-w-[200px] toast-enter hover-lift
             ${toast.type === 'success' ? 'bg-green-500 text-white' : ''}
             ${toast.type === 'error' ? 'bg-red-500 text-white' : ''}
             ${toast.type === 'info' ? 'bg-blue-500 text-white dark:bg-blue-600' : ''}
           `}
         >
           {toast.message}
         </div>
       ))}
     </div>
     <style jsx>{`
       @keyframes fadeInOutToast {
         0% { opacity: 0; transform: translateY(20px) scale(0.95); }
         10% { opacity: 1; transform: translateY(0) scale(1); }
         90% { opacity: 1; transform: translateY(0) scale(1); }
         100% { opacity: 0; transform: translateY(20px) scale(0.95); }
       }
       .animate-fadeInOutToast {
         animation: fadeInOutToast 3s ease-in-out forwards;
       }
     `}</style>
   </>
 );
};

export default HomePage;
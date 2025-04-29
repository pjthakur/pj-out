"use client";
import { useState, useEffect } from 'react';
import { 
  MessageSquare, Users, LogOut, Plus, Send, FileText, 
  Image as ImageIcon, Moon, Sun, ArrowLeft, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Channel {
  id: number;
  name: string;
}

interface Message {
  text: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  status: 'online' | 'offline';
  avatar: string;
}

const App = () => {
  const [channels, setChannels] = useState<Channel[]>([
    { id: 1, name: 'Project 1' },
    { id: 2, name: 'Project 2' },
  ]);
  
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(channels[0] || null); 
  
  const [channelMessages, setChannelMessages] = useState<{ [key: number]: Message[] }>({
    1: [{text: "Welcome to Project 1!", userId: 0}],
    2: [{text: "Welcome to Project 2!", userId: 0}],
  });
  
  const [newMessage, setNewMessage] = useState('');
  const [newDirectMessage, setNewDirectMessage] = useState('');
  
  const [directMessages, setDirectMessages] = useState<{ [key: number]: Message[] }>({
    1: [{text: "Hey there!", userId: 1}],
    2: [],
  });
  
  const [activeDMUser, setActiveDMUser] = useState<number | null>(null);
  
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Doe', status: 'online', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 2, name: 'Jane Smith', status: 'offline', avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=3135&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 3, name: 'Mike Johnson', status: 'online', avatar: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  ]);
  
  const [theme, setTheme] = useState('light');
  const [notification, setNotification] = useState(false);
  const [showNewChannelForm, setShowNewChannelForm] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);
  
  const handleCreateChannel = () => {
    if (!newChannelName.trim()) return;
    
    const newChannel = { id: channels.length + 1, name: newChannelName };
    setChannels([...channels, newChannel]);
    setChannelMessages({ ...channelMessages, [newChannel.id]: [] });
    setNewChannelName('');
    setShowNewChannelForm(false);
  };
  
  const handleLeaveChannel = () => {
    if (!selectedChannel) return;
    const updatedChannels = channels.filter(channel => channel.id !== selectedChannel.id);
    setChannels(updatedChannels);
    
    const updatedMessages = { ...channelMessages };
    delete updatedMessages[selectedChannel.id];
    setChannelMessages(updatedMessages);
    
    setSelectedChannel(updatedChannels.length > 0 ? updatedChannels[0] : null);
  };
  
  const handleSendMessage = () => {
    if (!selectedChannel || !newMessage.trim() || activeDMUser !== null) return;
    const message = { text: newMessage, userId: 1 };
    const updatedChannelMsgs = [...(channelMessages[selectedChannel.id] || []), message];
    setChannelMessages({ ...channelMessages, [selectedChannel.id]: updatedChannelMsgs });
    setNewMessage('');
    setNotification(true);
    setTimeout(() => setNotification(false), 2000);
  };
  
  const handleSendDirectMessage = () => {
    if (activeDMUser === null || !newDirectMessage.trim()) return;
    const message = { text: newDirectMessage, userId: 1 };
    const updatedDMs = directMessages[activeDMUser]
      ? [...directMessages[activeDMUser], message]
      : [message];
    setDirectMessages({ ...directMessages, [activeDMUser]: updatedDMs });
    setNewDirectMessage('');
  };
  
  useEffect(() => {
    if (activeDMUser !== null) {
      setNotification(false);
    }
  }, [activeDMUser]);
  
  const handleShareFile = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const message = { text: `File: ${file.name}`, userId: 1 };
        if (activeDMUser !== null) {
          const updatedDMs = directMessages[activeDMUser]
            ? [...directMessages[activeDMUser], message]
            : [message];
          setDirectMessages({ ...directMessages, [activeDMUser]: updatedDMs });
        } else if (selectedChannel) {
          const updatedChannelMsgs = [...(channelMessages[selectedChannel.id] || []), message];
          setChannelMessages({ ...channelMessages, [selectedChannel.id]: updatedChannelMsgs });
        }
      }
    };
    fileInput.click();
  };
  
  const handleShareImage = () => {
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.accept = 'image/*';
    imageInput.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const message = { text: `Image: ${file.name}`, userId: 1 };
        if (activeDMUser !== null) {
          const updatedDMs = directMessages[activeDMUser]
            ? [...directMessages[activeDMUser], message]
            : [message];
          setDirectMessages({ ...directMessages, [activeDMUser]: updatedDMs });
        } else if (selectedChannel) {
          const updatedChannelMsgs = [...(channelMessages[selectedChannel.id] || []), message];
          setChannelMessages({ ...channelMessages, [selectedChannel.id]: updatedChannelMsgs });
        }
      }
    };
    imageInput.click();
  };
  
  const handleThemeSwitch = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`h-screen flex flex-col ${theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-gray-900 text-gray-100'}`}
    >
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`px-4 py-3 flex justify-between items-center ${theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-900'} text-white shadow-md`}
      >
        <div className="flex items-center space-x-2">
          <Users size={24} />
          <h1 className="text-xl font-bold">TeamCollab</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          {notification && (
            <div className="flex items-center text-sm">
              <Bell size={16} className="mr-1 text-yellow-300" />
              <span>New message!</span>
            </div>
          )}
          <button
            className={`p-2 rounded-full ${theme === 'light' ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-indigo-800 hover:bg-indigo-700'} transition-colors`}
            onClick={handleThemeSwitch}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </motion.header>

      <main className="flex flex-1 overflow-hidden">
        {/* Channels sidebar */}
        <motion.aside 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className={`w-64 flex flex-col ${theme === 'light' ? 'bg-white border-r border-gray-200' : 'bg-gray-800 border-r border-gray-700'}`}
        >
          <div className="p-4">
            <h2 className="flex items-center text-lg font-semibold mb-3">
              <MessageSquare size={18} className="mr-2" />
              Channels
            </h2>
            <div className="space-y-1 mb-4 max-h-64 overflow-y-auto">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${
                    selectedChannel && selectedChannel.id === channel.id
                      ? theme === 'light' 
                        ? 'bg-indigo-100 text-indigo-800' 
                        : 'bg-indigo-900 text-indigo-100'
                      : theme === 'light'
                        ? 'hover:bg-gray-100' 
                        : 'hover:bg-gray-700'
                  }`}
                  onClick={() => {
                    setSelectedChannel(channel);
                    setActiveDMUser(null);
                  }}
                >
                  <span className="text-left truncate"># {channel.name}</span>
                </button>
              ))}
            </div>
            
            {/* Channel form and buttons remain the same */}
            {showNewChannelForm ? (
              <div className="space-y-2 mb-2">
                <input
                  type="text"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="Channel name"
                  className={`w-full px-3 py-2 rounded-md text-sm ${
                    theme === 'light' 
                      ? 'bg-gray-100 border border-gray-200 focus:border-indigo-500' 
                      : 'bg-gray-700 border border-gray-700 focus:border-indigo-500'
                  } focus:outline-none`}
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    className={`flex-1 flex items-center justify-center px-3 py-1.5 rounded-md text-sm ${
                      theme === 'light' 
                        ? 'bg-indigo-600 hover:bg-indigo-700' 
                        : 'bg-indigo-700 hover:bg-indigo-600'
                    } text-white transition-colors`}
                    onClick={handleCreateChannel}
                  >
                    Create
                  </button>
                  <button
                    className={`flex-1 flex items-center justify-center px-3 py-1.5 rounded-md text-sm ${
                      theme === 'light' 
                        ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    } transition-colors`}
                    onClick={() => setShowNewChannelForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-sm ${
                  theme === 'light' 
                    ? 'bg-indigo-600 hover:bg-indigo-700' 
                    : 'bg-indigo-700 hover:bg-indigo-600'
                } text-white transition-colors`}
                onClick={() => setShowNewChannelForm(true)}
              >
                <Plus size={16} className="mr-1" />
                Create Channel
              </button>
            )}
            
            {selectedChannel && (
              <button
                className={`w-full flex items-center justify-center px-4 py-2 mt-2 rounded-md text-sm ${
                  theme === 'light' 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-red-600 hover:bg-red-700'
                } text-white transition-colors`}
                onClick={handleLeaveChannel}
              >
                <LogOut size={16} className="mr-1" />
                Leave Channel
              </button>
            )}
          </div>
          
          {/* Users section */}
          <div className={`p-4 mt-auto ${theme === 'light' ? 'border-t border-gray-200' : 'border-t border-gray-700'}`}>
            <h2 className="flex items-center text-lg font-semibold mb-3">
              <Users size={18} className="mr-2" />
              Team Members
            </h2>
            <div className="space-y-1">
              {users.map((user) => (
                <motion.button
                  key={user.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${
                    activeDMUser === user.id
                      ? theme === 'light' 
                        ? 'bg-indigo-100 text-indigo-800' 
                        : 'bg-indigo-900 text-indigo-100'
                      : theme === 'light'
                        ? 'hover:bg-gray-100' 
                        : 'hover:bg-gray-700'
                  }`}
                  onClick={() => {
                    setActiveDMUser(user.id);
                    setSelectedChannel(null);
                  }}
                >
                  <div className="relative mr-2">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-6 h-6 rounded-full"
                    />
                    <span 
                      className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${
                        user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      } border border-white`}
                    ></span>
                  </div>
                  <span className="flex-1 text-left truncate">{user.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.aside>
        
        {/* Main chat area */}
        <section className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {selectedChannel ? (
              <motion.div
                key="channel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <div className={`flex items-center px-6 py-3 ${theme === 'light' ? 'bg-white border-b border-gray-200' : 'bg-gray-800 border-b border-gray-700'}`}>
                  <h2 className="text-lg font-semibold">
                    # {selectedChannel.name}
                  </h2>
                </div>
                
                <div className={`flex-1 p-6 overflow-y-auto ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
                  {channelMessages[selectedChannel.id] && channelMessages[selectedChannel.id].length > 0 ? (
                    <div className="space-y-4">
                      {channelMessages[selectedChannel.id].map((message, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex ${message.userId === 1 ? 'justify-end' : ''}`}
                        >
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className={`max-w-lg px-4 py-2 rounded-lg ${
                              message.userId === 1
                                ? theme === 'light' 
                                  ? 'bg-indigo-100 text-indigo-900' 
                                  : 'bg-indigo-900 text-indigo-100'
                                : theme === 'light'
                                  ? 'bg-gray-200 text-gray-900' 
                                  : 'bg-gray-800 text-gray-100'
                            }`}
                          >
                            <p>{message.text}</p>
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-center justify-center h-full text-center"
                    >
                      <MessageSquare size={48} className={`${theme === 'light' ? 'text-gray-300' : 'text-gray-600'} mb-4`} />
                      <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>No messages yet in this channel.</p>
                      <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Be the first to send a message!</p>
                    </motion.div>
                  )}
                </div>
                
                <div className={`p-4 ${theme === 'light' ? 'bg-white border-t border-gray-200' : 'bg-gray-800 border-t border-gray-700'}`}>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className={`flex-1 px-4 py-2 rounded-md ${
                        theme === 'light' 
                          ? 'bg-gray-100 border border-gray-200 focus:border-indigo-500' 
                          : 'bg-gray-700 border border-gray-700 focus:border-indigo-500'
                      } focus:outline-none transition-colors`}
                      placeholder="Type a message..."
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 rounded-md ${
                        theme === 'light' 
                          ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      } transition-colors`}
                      onClick={handleShareFile}
                      aria-label="Share File"
                    >
                      <FileText size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 rounded-md ${
                        theme === 'light' 
                          ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      } transition-colors`}
                      onClick={handleShareImage}
                      aria-label="Share Image"
                    >
                      <ImageIcon size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 rounded-md ${
                        theme === 'light' 
                          ? 'bg-indigo-600 hover:bg-indigo-700' 
                          : 'bg-indigo-700 hover:bg-indigo-600'
                      } text-white transition-colors`}
                      onClick={handleSendMessage}
                      aria-label="Send Message"
                    >
                      <Send size={20} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : activeDMUser !== null ? (
              <motion.div
                key="dm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <div className={`flex items-center px-6 py-3 ${theme === 'light' ? 'bg-white border-b border-gray-200' : 'bg-gray-800 border-b border-gray-700'}`}>
                  <button 
                    className={`mr-2 p-1 rounded-md ${
                      theme === 'light' 
                        ? 'hover:bg-gray-200 text-gray-600' 
                        : 'hover:bg-gray-700 text-gray-300'
                    } transition-colors`}
                    onClick={() => setActiveDMUser(null)}
                    aria-label="Back to users"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="flex items-center">
                    <div className="relative mr-2">
                      <img 
                        src={users.find(u => u.id === activeDMUser)?.avatar} 
                        alt={users.find(u => u.id === activeDMUser)?.name} 
                        className="w-8 h-8 rounded-full"
                      />
                      <span 
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${
                          users.find(u => u.id === activeDMUser)?.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        } border border-white`}
                      ></span>
                    </div>
                    <h2 className="text-lg font-semibold">
                      {users.find(u => u.id === activeDMUser)?.name}
                    </h2>
                  </div>
                </div>
                
                <div className={`flex-1 p-6 overflow-y-auto ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
                  {directMessages[activeDMUser] && directMessages[activeDMUser].length > 0 ? (
                    <div className="space-y-4">
                      {directMessages[activeDMUser].map((message, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex ${message.userId === 1 ? 'justify-end' : ''}`}
                        >
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className={`max-w-lg px-4 py-2 rounded-lg ${
                              message.userId === 1
                                ? theme === 'light' 
                                  ? 'bg-indigo-50 text-indigo-600' 
                                  : 'bg-indigo-900/50 text-indigo-300'
                                : theme === 'light'
                                  ? 'bg-gray-200 text-gray-900' 
                                  : 'bg-gray-800 text-gray-100'
                            }`}
                          >
                            <p>{message.text}</p>
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-center justify-center h-full text-center"
                    >
                      <div className={`p-4 rounded-lg mb-4 ${
                        theme === 'light' 
                          ? 'bg-gray-100 text-gray-400' 
                          : 'bg-gray-800 text-gray-600'
                      }`}>
                        <MessageSquare size={48} />
                      </div>
                      <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>No messages yet.</p>
                      <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Start a conversation!</p>
                    </motion.div>
                  )}
                </div>
                
                <div className={`p-4 ${theme === 'light' ? 'bg-white border-t border-gray-200' : 'bg-gray-800 border-t border-gray-700'}`}>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newDirectMessage}
                      onChange={(e) => setNewDirectMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendDirectMessage()}
                      className={`flex-1 px-4 py-2 rounded-md ${
                        theme === 'light' 
                          ? 'bg-gray-100 border border-gray-200 focus:border-indigo-500' 
                          : 'bg-gray-700 border border-gray-700 focus:border-indigo-500'
                      } focus:outline-none transition-colors`}
                      placeholder="Type a message..."
                    />
                    <button
                      className={`p-2 rounded-md ${
                        theme === 'light' 
                          ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      } transition-colors`}
                      onClick={handleShareFile}
                      aria-label="Share File"
                    >
                      <FileText size={20} />
                    </button>
                    <button
                      className={`p-2 rounded-md ${
                        theme === 'light' 
                          ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      } transition-colors`}
                      onClick={handleShareImage}
                      aria-label="Share Image"
                    >
                      <ImageIcon size={20} />
                    </button>
                    <button
                      className={`p-2 rounded-md ${
                        theme === 'light' 
                          ? 'bg-indigo-600 hover:bg-indigo-700' 
                          : 'bg-indigo-700 hover:bg-indigo-600'
                      } text-white transition-colors`}
                      onClick={handleSendDirectMessage}
                      aria-label="Send Message"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center h-full text-center p-6"
              >
                <img src="/api/placeholder/180/180" alt="TeamCollab" className="mb-6 rounded-lg" />
                <h2 className="text-2xl font-bold mb-2">Welcome to TeamCollab</h2>
                <p className={`max-w-md ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Select a channel or team member to start collaborating and chatting with your team.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </motion.div>
  );
};

export default App;
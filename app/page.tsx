"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, X, ArrowLeft, Save, History, AlertTriangle } from "lucide-react";
import * as Tooltip from '@radix-ui/react-tooltip';

type Mood = {
  type: "calm" | "happy" | "anxious" | "sad" | "energetic" | "angry" | "surprised" | "tired" | "grateful" | "confused";
  note: string;
  timestamp: number;
  id: string;
  isSample?: boolean;
};

const getMoodEmoji = (mood: Mood["type"]) => {
  switch (mood) {
    case "calm": return "😌";
    case "happy": return "😄";
    case "anxious": return "😰";
    case "sad": return "😢";
    case "energetic": return "💪";
    case "angry": return "😡";
    case "surprised": return "😮";
    case "tired": return "😴";
    case "grateful": return "🙏";
    case "confused": return "🤔";
  }
};

interface HistoryBubbleProps {
  entry: Mood;
  theme: "light" | "dark";
  onDelete: (id: string) => void;
  isFormOpen: boolean;
}

const HistoryBubble: React.FC<HistoryBubbleProps> = ({ entry, theme, onDelete, isFormOpen }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const bubbleSize = 50 + (entry.timestamp % 30);

  const randomOffset = useRef({
    x: Math.random(),
    y: Math.random(),
    seed: Math.random() * 1000
  }).current;

  const directionX = useRef(Math.random() > 0.5 ? 1 : -1);
  const directionY = useRef(Math.random() > 0.5 ? 1 : -1);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const isInitialized = useRef<boolean>(false);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isInitialized.current && typeof window !== 'undefined') {
      const startX = window.innerWidth * (0.2 + randomOffset.x * 0.6);
      const startY = window.innerHeight * (0.2 + randomOffset.y * 0.6);

      currentX.current = startX;
      currentY.current = startY;
      setPosition({ x: startX, y: startY });
      isInitialized.current = true;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [randomOffset.x, randomOffset.y]);

  const getMoodBgColor = useCallback((mood: Mood["type"]) => {
    switch (mood) {
      case "calm": return theme === "light" ? "bg-blue-100/80" : "bg-blue-900/80";
      case "happy": return theme === "light" ? "bg-yellow-100/80" : "bg-yellow-900/80";
      case "anxious": return theme === "light" ? "bg-red-100/80" : "bg-red-900/80";
      case "sad": return theme === "light" ? "bg-indigo-100/80" : "bg-indigo-900/80";
      case "energetic": return theme === "light" ? "bg-orange-100/80" : "bg-orange-900/80";
      case "angry": return theme === "light" ? "bg-rose-100/80" : "bg-rose-900/80";
      case "surprised": return theme === "light" ? "bg-purple-100/80" : "bg-purple-900/80";
      case "tired": return theme === "light" ? "bg-gray-100/80" : "bg-gray-800/80";
      case "grateful": return theme === "light" ? "bg-emerald-100/80" : "bg-emerald-900/80";
      case "confused": return theme === "light" ? "bg-amber-100/80" : "bg-amber-900/80";
    }
  }, [theme]);

  const getMoodBorderColor = useCallback((mood: Mood["type"]) => {
    switch (mood) {
      case "calm": return theme === "light" ? "border-blue-300" : "border-blue-700";
      case "happy": return theme === "light" ? "border-yellow-300" : "border-yellow-700";
      case "anxious": return theme === "light" ? "border-red-300" : "border-red-700";
      case "sad": return theme === "light" ? "border-indigo-300" : "border-indigo-700";
      case "energetic": return theme === "light" ? "border-orange-300" : "border-orange-700";
      case "angry": return theme === "light" ? "border-rose-300" : "border-rose-700";
      case "surprised": return theme === "light" ? "border-purple-300" : "border-purple-700";
      case "tired": return theme === "light" ? "border-gray-300" : "border-gray-700";
      case "grateful": return theme === "light" ? "border-emerald-300" : "border-emerald-700";
      case "confused": return theme === "light" ? "border-amber-300" : "border-amber-700";
    }
  }, [theme]);

  const getMoodGlowColor = useCallback((mood: Mood["type"]) => {
    switch (mood) {
      case "calm": return "rgba(59, 130, 246, 0.4)";
      case "happy": return "rgba(234, 179, 8, 0.4)";
      case "anxious": return "rgba(239, 68, 68, 0.4)";
      case "sad": return "rgba(99, 102, 241, 0.4)";
      case "energetic": return "rgba(249, 115, 22, 0.4)";
      case "angry": return "rgba(225, 29, 72, 0.4)";
      case "surprised": return "rgba(168, 85, 247, 0.4)";
      case "tired": return "rgba(107, 114, 128, 0.4)";
      case "grateful": return "rgba(16, 185, 129, 0.4)";
      case "confused": return "rgba(245, 158, 11, 0.4)";
      default: return "rgba(107, 114, 128, 0.4)";
    }
  }, []);

  const cardBg = theme === "light" ? "bg-white" : "bg-gray-800";
  const borderColor = theme === "light" ? "border-gray-200" : "border-gray-700";
  const textColor = theme === "light" ? "text-gray-800" : "text-gray-200";

  const handleMouseEnter = useCallback(() => {
    if (isFormOpen) return;
    setIsHovered(true);
    setOpen(true);
  }, [isFormOpen]);

  const handleMouseLeave = useCallback(() => {
    currentX.current = position.x;
    currentY.current = position.y;
    setIsHovered(false);
  }, [position.x, position.y]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(entry.id);
    setOpen(false);
  }, [onDelete, entry.id]);

  useEffect(() => {
    if (open && !isFormOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        setOpen(false);
      };

      const timer = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [open, isFormOpen]);

  useEffect(() => {
    if (isFormOpen && open) {
      setOpen(false);
      setIsHovered(false);
    }
  }, [isFormOpen, open]);

  useEffect(() => {
    if (isHovered || open || !isInitialized.current) return;

    const speedX = 0.3 + (randomOffset.seed % 15) / 25;
    const speedY = 0.3 + (randomOffset.seed % 20) / 35;

    const animate = () => {
      let newX = currentX.current + speedX * directionX.current;
      let newY = currentY.current + speedY * directionY.current;

      const rightEdge = window.innerWidth - bubbleSize;
      const bottomEdge = window.innerHeight - bubbleSize;

      if (newX >= rightEdge) {
        newX = rightEdge;
        directionX.current = -1;
      }
      else if (newX <= 0) {
        newX = 0;
        directionX.current = 1;
      }

      if (newY >= bottomEdge) {
        newY = bottomEdge;
        directionY.current = -1;
      }
      else if (newY <= 0) {
        newY = 0;
        directionY.current = 1;
      }

      currentX.current = newX;
      currentY.current = newY;

      setPosition({ x: newX, y: newY });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHovered, open, bubbleSize, randomOffset.seed]);

  const bubble = useMemo(() => {
    const moodBgColor = getMoodBgColor(entry.type);
    const moodBorderColor = getMoodBorderColor(entry.type);
    const moodGlowColor = getMoodGlowColor(entry.type);

    return (
      <div
        className="absolute pointer-events-auto"
        style={{
          left: 0,
          top: 0,
          width: `${bubbleSize}px`,
          height: `${bubbleSize}px`,
          transform: `translate(${position.x}px, ${position.y}px)`,
          zIndex: open ? 9990 : 100,
          transition: open ? 'transform 0.3s ease' : 'none',
          willChange: 'transform'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          className={`w-full h-full rounded-full flex items-center justify-center cursor-pointer backdrop-blur-xl 
            ${moodBgColor} border-2 ${moodBorderColor} shadow-lg transition-all duration-300`}
          animate={open ? {
            boxShadow: `0 0 25px 8px ${moodGlowColor}`,
            scale: 1.15
          } : {
            scale: 1,
            boxShadow: `0 4px 12px -2px ${moodGlowColor}`
          }}
        >
          <motion.div
            className="text-2xl flex items-center justify-center h-full relative"
            animate={!open ? {
              rotate: [0, entry.timestamp % 2 === 0 ? 5 : -5, 0],
            } : {}}
            transition={!open ? {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            } : {}}
          >
            {getMoodEmoji(entry.type)}
          </motion.div>
        </motion.div>

        {!open && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                `0 0 0 0px rgba(255, 255, 255, 0)`,
                `0 0 0 5px ${moodGlowColor.replace('0.4', '0.15')}`,
                `0 0 0 0px rgba(255, 255, 255, 0)`
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>
    );
  }, [position.x, position.y, open, entry.type, entry.timestamp, bubbleSize,
    handleMouseEnter, handleMouseLeave, getMoodBgColor, getMoodBorderColor, getMoodGlowColor]);

  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root open={open && !isFormOpen} onOpenChange={setOpen}>
        <Tooltip.Trigger asChild>
          {bubble}
        </Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            align="center"
            sideOffset={8}
            alignOffset={0}
            className="z-[9999] p-0 max-w-sm pointer-events-auto border-none outline-none"
            avoidCollisions
            sticky="always"
            style={{
              maxWidth: 'calc(100vw - 20px)',
              filter: `drop-shadow(0 0 10px ${getMoodGlowColor(entry.type)})`,
              padding: '3px',
              background: theme === "light" ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              boxShadow: `0 0 0 2px ${getMoodBorderColor(entry.type).replace('border-', '')}`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl overflow-hidden"
              style={{
                boxShadow: `0 10px 25px -5px ${getMoodGlowColor(entry.type)}, 0 8px 10px -6px rgba(0, 0, 0, 0.1)`,
                borderRadius: '14px'
              }}
            >
              <div className={`${cardBg} p-5 backdrop-blur-xl border-none rounded-xl shadow-inner`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <motion.span
                        className="text-3xl"
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        {getMoodEmoji(entry.type)}
                      </motion.span>
                      <p className="font-medium text-lg capitalize bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">{entry.type}</p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: theme === "light" ? "rgba(239, 68, 68, 0.1)" : "rgba(239, 68, 68, 0.2)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDeleteClick}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X size={16} />
                  </motion.button>
                </div>
                <div className={`p-4 rounded-lg ${theme === "light" ? "bg-gradient-to-br from-gray-50 to-white" : "bg-gradient-to-br from-gray-900 to-gray-800"} ${textColor} text-base shadow-inner border border-gray-100 dark:border-gray-700`}>
                  <div className="flex items-start">
                    <div className="text-gray-400 dark:text-gray-500 mr-1.5">"</div>
                    <p className="italic flex-1">{entry.note}</p>
                    <div className="text-gray-400 dark:text-gray-500 ml-1.5">"</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${entry.isSample ? "bg-amber-400 dark:bg-amber-500" : "bg-green-400 dark:bg-green-500"} mr-1.5`}></div>
                    <span>{entry.isSample ? "Sample Entry" : "Your Memory"}</span>
                  </div>
                  <div>
                    {Math.floor((Date.now() - entry.timestamp) / (1000 * 60 * 60 * 24))} days ago
                  </div>
                </div>
              </div>
            </motion.div>
            <Tooltip.Arrow
              width={16}
              height={8}
              className="fill-white dark:fill-gray-800"
              style={{
                filter: `drop-shadow(0 0 3px ${getMoodGlowColor(entry.type)})`,
                stroke: theme === "light" ? '#e5e7eb' : '#374151',
                strokeWidth: '1px',
                margin: '0 3px'
              }}
            />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  theme: "light" | "dark";
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, theme }) => {
  if (!isOpen) return null;

  const bgColor = theme === "light" ? "bg-white" : "bg-gray-800";
  const textColor = theme === "light" ? "text-gray-800" : "text-gray-200";
  const overlayColor = theme === "light" ? "bg-black/50" : "bg-black/70";
  const borderColor = theme === "light" ? "border-gray-200" : "border-gray-700";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div
        className={`fixed inset-0 ${overlayColor} backdrop-blur-sm`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className={`${bgColor} ${textColor} rounded-xl border ${borderColor} shadow-2xl p-6 w-full max-w-md relative z-10 backdrop-blur-xl`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex items-start gap-4 mb-5">
          <div className="mt-1 p-2 rounded-full bg-red-100 dark:bg-red-900/40 text-red-500 dark:text-red-400 flex-shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">Clear All Memories</h3>
            <p className="text-gray-600 dark:text-gray-400">Are you sure you want to clear all your mood history? This action cannot be undone.</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`px-4 py-2 rounded-lg ${theme === "light" ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-gray-700 hover:bg-gray-600 text-gray-200"}`}
            onClick={onClose}
          >
            Cancel
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Clear All
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

interface MoodHistoryPanelProps {
  entries: Mood[];
  theme: "light" | "dark";
  onDelete: (id: string) => void;
  onClose: () => void;
}

const MoodHistoryPanel: React.FC<MoodHistoryPanelProps> = ({ entries, theme, onDelete, onClose }) => {
  const groupedEntries = useMemo(() => {
    const grouped: { [key: string]: Mood[] } = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.timestamp);
      const dateKey = date.toLocaleDateString();
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      
      grouped[dateKey].push(entry);
    });
    
    return grouped;
  }, [entries]);
  
  const sortedDates = useMemo(() => {
    return Object.keys(groupedEntries).sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime();
    });
  }, [groupedEntries]);
  
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-800";
  const borderColor = theme === "light" ? "border-gray-200" : "border-gray-700";
  const textColor = theme === "light" ? "text-gray-800" : "text-gray-200";
  const noteBg = theme === "light" ? "bg-blue-50" : "bg-gray-700/50";
  const noteTextColor = theme === "light" ? "text-gray-800" : "text-gray-300";
  const noteBoxShadow = theme === "light" ? "shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]" : "shadow-inner";
  const dateHeaderColor = theme === "light" ? "text-gray-700 bg-gray-50" : "text-gray-400 bg-gray-800/90";
  const timeTextColor = theme === "light" ? "text-gray-600" : "text-gray-400";
  
  return (
    <motion.div 
      className="fixed right-0 top-0 h-full z-[9000] max-w-md w-full shadow-2xl"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className={`h-full ${cardBg} ${textColor} overflow-y-auto border-l ${borderColor} backdrop-blur-xl`}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 bg-inherit backdrop-blur-xl">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
            Mood History
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </motion.button>
        </div>
        
        <div className="p-4">
          {entries.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              <p>No mood entries yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedDates.map(date => (
                <div key={date} className="space-y-3">
                  <h3 className={`font-medium sticky top-16 py-2 px-3 rounded-md ${dateHeaderColor} shadow-sm`}>
                    {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h3>
                  
                  <div className="space-y-3">
                    {groupedEntries[date]
                      .sort((a, b) => b.timestamp - a.timestamp)
                      .map(entry => (
                        <motion.div 
                          key={entry.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-lg border ${borderColor} ${cardBg} shadow-sm`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{getMoodEmoji(entry.type)}</span>
                              <span className="font-medium capitalize">{entry.type}</span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1, color: "#ef4444" }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onDelete(entry.id)}
                              className="text-gray-400 hover:text-red-500 p-1 rounded-full"
                            >
                              <X size={16} />
                            </motion.button>
                          </div>
                          
                          <div className={`mt-3 p-3 rounded ${noteBg} ${noteTextColor} text-sm font-medium ${noteBoxShadow} border ${theme === "light" ? "border-blue-100" : "border-gray-600"}`}>
                            "{entry.note}"
                          </div>
                          
                          <div className={`mt-2 text-xs ${timeTextColor} font-medium flex items-center gap-1.5`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(entry.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [selectedMood, setSelectedMood] = useState<Mood["type"] | null>(null);
  const [lastSelectedMood, setLastSelectedMood] = useState<Mood["type"] | null>(null);
  const [note, setNote] = useState("");
  const [history, setHistory] = useState<Mood[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sampleHistoryData: Mood[] = [
    {
      type: "happy",
      note: "Got a promotion at work today! All the hard work finally paid off.",
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2 - 1000 * 60 * 60 * 3,
      id: "sample-1",
      isSample: true
    },
    {
      type: "calm",
      note: "Meditation session was great this morning. Feeling centered and peaceful.",
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4 - 1000 * 60 * 33,
      id: "sample-2",
      isSample: true
    },
    {
      type: "energetic",
      note: "Morning run gave me so much energy! Ready to tackle the day.",
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 1 - 1000 * 60 * 60 * 5,
      id: "sample-3",
      isSample: true
    },
    {
      type: "grateful",
      note: "Thankful for the surprise call from my old friend. Great to catch up after so long.",
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3 - 1000 * 60 * 60 * 7,
      id: "sample-4",
      isSample: true
    },
    {
      type: "anxious",
      note: "Big presentation tomorrow. Nervous but trying to stay prepared and positive.",
      timestamp: Date.now() - 1000 * 60 * 60 * 12 - 1000 * 60 * 27,
      id: "sample-5",
      isSample: true
    }
  ];

  const getBackgroundElements = useCallback(() => {
    const currentMood = selectedMood || lastSelectedMood;
    if (!currentMood) return null;

    switch (currentMood) {
      case "calm":
        return (
          <>
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const distanceFromCenter = 150 + ((i * 941) % 150);

              const centerX = window.innerWidth / 2;
              const centerY = window.innerHeight / 2;

              const posX = centerX + Math.cos(angle) * distanceFromCenter;
              const posY = centerY + Math.sin(angle) * distanceFromCenter;

              const size = 100 + ((i * 941) % 100) * 2;
              const opacity = theme === "light"
                ? 0.6 + ((i * 1123) % 40) / 100
                : 0.4 + ((i * 1123) % 60) / 100;

              return (
                <div
                  key={`calm-${i}`}
                  className={`absolute rounded-full backdrop-blur-sm`}
                  style={{
                    left: posX - size / 2,
                    top: posY - size / 2,
                    width: size,
                    height: size,
                    opacity: opacity,
                    background: theme === "light"
                      ? `radial-gradient(circle at center, rgba(191, 219, 254, 0.95) 0%, rgba(147, 197, 253, 0.7) 70%, rgba(59, 130, 246, 0.4) 100%)`
                      : `radial-gradient(circle at center, rgba(30, 58, 138, 0.7) 0%, rgba(29, 78, 216, 0.4) 70%, rgba(37, 99, 235, 0.2) 100%)`,
                    boxShadow: `0 0 50px 25px ${theme === "light" ? "rgba(59, 130, 246, 0.4)" : "rgba(59, 130, 246, 0.2)"}`,
                    filter: theme === "light" ? "blur(6px)" : "blur(8px)",
                    transition: "all 1.5s ease-out",
                    zIndex: -1
                  }}
                />
              );
            })}
          </>
        );

      case "happy":
        return (
          <>
            {Array.from({ length: 15 }).map((_, i) => {
              const centerX = window.innerWidth / 2;
              const centerY = window.innerHeight / 2;

              if (i < 8) {
                const angle = (i / 8) * Math.PI * 2;
                const distanceFromCenter = 200 + ((i * 631) % 100);
                const posX = centerX + Math.cos(angle) * distanceFromCenter;
                const posY = centerY + Math.sin(angle) * distanceFromCenter;
                const size = 18 + ((i * 631) % 40);
                const opacity = theme === "light"
                  ? 0.7 + ((i * 1873) % 30) / 100
                  : 0.5 + ((i * 1873) % 50) / 100;

                return (
                  <div
                    key={`happy-${i}`}
                    className="absolute rounded-full"
                    style={{
                      left: posX - size / 2,
                      top: posY - size / 2,
                      width: size,
                      height: size,
                      opacity: opacity,
                      background: theme === "light"
                        ? `radial-gradient(circle at center, rgba(254, 240, 138, 1) 0%, rgba(253, 224, 71, 0.9) 70%, rgba(234, 179, 8, 0.6) 100%)`
                        : `radial-gradient(circle at center, rgba(161, 98, 7, 0.9) 0%, rgba(133, 77, 14, 0.7) 70%, rgba(113, 63, 18, 0.4) 100%)`,
                      boxShadow: `0 0 35px 15px ${theme === "light" ? "rgba(234, 179, 8, 0.5)" : "rgba(234, 179, 8, 0.3)"}`,
                      transition: "all 1.5s ease-out",
                      zIndex: -1
                    }}
                  />
                );
              } else {
                const angle = Math.random() * Math.PI * 2;
                const distanceFromCenter = ((i * 957) % 150);
                const posX = centerX + Math.cos(angle) * distanceFromCenter;
                const posY = centerY + Math.sin(angle) * distanceFromCenter;
                const size = 18 + ((i * 631) % 40);
                const opacity = theme === "light"
                  ? 0.7 + ((i * 1873) % 30) / 100
                  : 0.5 + ((i * 1873) % 50) / 100;

                return (
                  <div
                    key={`happy-${i}`}
                    className="absolute rounded-full"
                    style={{
                      left: posX - size / 2,
                      top: posY - size / 2,
                      width: size,
                      height: size,
                      opacity: opacity,
                      background: theme === "light"
                        ? `radial-gradient(circle at center, rgba(254, 240, 138, 1) 0%, rgba(254, 249, 195, 0.9) 40%, rgba(234, 179, 8, 0.6) 100%)`
                        : `radial-gradient(circle at center, rgba(161, 98, 7, 0.9) 0%, rgba(133, 77, 14, 0.7) 70%, rgba(113, 63, 18, 0.4) 100%)`,
                      boxShadow: `0 0 35px 15px ${theme === "light" ? "rgba(234, 179, 8, 0.5)" : "rgba(234, 179, 8, 0.3)"}`,
                      transition: "all 1.5s ease-out",
                      zIndex: -1
                    }}
                  />
                );
              }
            })}
          </>
        );

      case "anxious":
        return (
          <>
            {Array.from({ length: 10 }).map((_, i) => {
              const centerX = window.innerWidth / 2;
              const centerY = window.innerHeight / 2;

              let distanceFromCenter = 120 + ((i * 797) % 180);
              if (i % 3 === 0) distanceFromCenter += 80;

              const angle = (i / 10) * Math.PI * 2 + Math.sin(i) * 0.5;
              const posX = centerX + Math.cos(angle) * distanceFromCenter;
              const posY = centerY + Math.sin(angle) * distanceFromCenter;

              const width = 40 + ((i * 797) % 80);
              const height = 40 + ((i * 1153) % 80);
              const rotation = ((i * 2371) % 45);
              const opacity = theme === "light"
                ? 0.45 + ((i * 1511) % 35) / 100
                : 0.3 + ((i * 1511) % 40) / 100;

              return (
                <div
                  key={`anxious-${i}`}
                  className="absolute"
                  style={{
                    left: posX - width / 2,
                    top: posY - height / 2,
                    width: width,
                    height: height,
                    opacity: opacity,
                    background: theme === "light" ? "rgba(254, 202, 202, 0.75)" : "rgba(153, 27, 27, 0.5)",
                    boxShadow: `0 0 40px 20px ${theme === "light" ? "rgba(239, 68, 68, 0.45)" : "rgba(239, 68, 68, 0.2)"}`,
                    transform: `rotate(${rotation}deg)`,
                    borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
                    transition: "all 1.5s ease-out",
                    zIndex: -1
                  }}
                />
              );
            })}
          </>
        );

      case "sad":
        return (
          <>
            {Array.from({ length: 10 }).map((_, i) => {
              const centerX = window.innerWidth / 2;
              const centerY = window.innerHeight / 2 - 50;

              let posX, posY;

              if (i < 6) {
                const angle = ((i / 6) * Math.PI) + Math.PI / 2;
                const distanceFromCenter = 150 + ((i * 3761) % 100);
                posX = centerX + Math.cos(angle) * distanceFromCenter;
                posY = centerY + Math.sin(angle) * distanceFromCenter;
              } else {
                const angle = (i / 4) * Math.PI * 2;
                const distanceFromCenter = 100 + ((i * 5903) % 200);
                posX = centerX + Math.cos(angle) * distanceFromCenter;
                posY = centerY + Math.sin(angle) * distanceFromCenter;
              }

              const width = 12 + ((i * 631) % 18);
              const height = 70 + ((i * 1117) % 110);
              const opacity = theme === "light"
                ? 0.45 + ((i * 2273) % 40) / 100
                : 0.3 + ((i * 2273) % 40) / 100;

              return (
                <div
                  key={`sad-${i}`}
                  className="absolute rounded-full"
                  style={{
                    left: posX - width / 2,
                    top: posY - height / 2,
                    width: width,
                    height: height,
                    opacity: opacity,
                    background: theme === "light" ? "rgba(165, 180, 252, 0.7)" : "rgba(67, 56, 202, 0.5)",
                    boxShadow: `0 0 25px 12px ${theme === "light" ? "rgba(99, 102, 241, 0.45)" : "rgba(99, 102, 241, 0.2)"}`,
                    transition: "all 1.5s ease-out",
                    zIndex: -1
                  }}
                />
              );
            })}
          </>
        );

      case "energetic":
        return (
          <>
            {Array.from({ length: 12 }).map((_, i) => {
              const centerX = window.innerWidth / 2;
              const centerY = window.innerHeight / 2;

              const angle = (i / 12) * Math.PI * 2;
              let distanceFromCenter = 120 + ((i % 3) * 80);

              if (i % 3 === 0) {
                distanceFromCenter = 100 + ((i * 1327) % 50);
              } else if (i % 3 === 1) {
                distanceFromCenter = 200 + ((i * 1327) % 30);
              } else {
                distanceFromCenter = 280 + ((i * 1327) % 20);
              }

              const posX = centerX + Math.cos(angle) * distanceFromCenter;
              const posY = centerY + Math.sin(angle) * distanceFromCenter;

              const size = 35 + ((i * 1327) % 55);
              const rotation = ((i * 2129) % 360);
              const opacity = theme === "light"
                ? 0.55 + ((i * 1787) % 40) / 100
                : 0.4 + ((i * 1787) % 40) / 100;

              return (
                <div
                  key={`energetic-${i}`}
                  className="absolute"
                  style={{
                    left: posX - size / 2,
                    top: posY - size / 2,
                    width: size,
                    height: size,
                    opacity: opacity,
                    background: theme === "light" ? "rgba(254, 215, 170, 0.8)" : "rgba(154, 52, 18, 0.6)",
                    boxShadow: `0 0 35px 18px ${theme === "light" ? "rgba(249, 115, 22, 0.5)" : "rgba(249, 115, 22, 0.3)"}`,
                    transform: `rotate(${rotation}deg)`,
                    clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                    transition: "all 1.5s ease-out",
                    zIndex: -1
                  }}
                />
              );
            })}
          </>
        );

      case "angry":
        return (
          <>
            {Array.from({ length: 12 }).map((_, i) => {
              const centerX = window.innerWidth / 2;
              const centerY = window.innerHeight / 2;

              const angle = (i / 12) * Math.PI * 2;
              const distanceFromCenter = 100 + (i * 20);

              const posX = centerX + Math.cos(angle) * distanceFromCenter;
              const posY = centerY + Math.sin(angle) * distanceFromCenter;

              const size = 22 + ((i * 1523) % 45);
              const opacity = theme === "light"
                ? 0.55 + ((i * 2341) % 40) / 100
                : 0.35 + ((i * 2341) % 40) / 100;

              return (
                <div
                  key={`angry-${i}`}
                  className="absolute rounded-md"
                  style={{
                    left: posX - size / 2,
                    top: posY - size / 2,
                    width: size,
                    height: size,
                    opacity: opacity,
                    background: theme === "light" ? "rgba(254, 205, 211, 0.85)" : "rgba(159, 18, 57, 0.7)",
                    boxShadow: `0 0 40px 20px ${theme === "light" ? "rgba(225, 29, 72, 0.6)" : "rgba(225, 29, 72, 0.4)"}`,
                    transition: "all 1.5s ease-out",
                    zIndex: -1
                  }}
                />
              );
            })}
          </>
        );

      case "surprised":
        return (
          <>
            {Array.from({ length: 15 }).map((_, i) => {
              const centerX = window.innerWidth / 2;
              const centerY = window.innerHeight / 2;

              let angle, distanceFromCenter;

              if (i < 8) {
                angle = (i / 8) * Math.PI * 2;
                distanceFromCenter = 180;
              } else {
                angle = (i / 7) * Math.PI * 2;
                distanceFromCenter = 70 + ((i * 839) % 80);
              }

              const posX = centerX + Math.cos(angle) * distanceFromCenter;
              const posY = centerY + Math.sin(angle) * distanceFromCenter;

              const size = 20 + ((i * 839) % 35);
              const isCircle = i % 2 === 0;
              const opacity = theme === "light"
                ? 0.6 + ((i * 2003) % 40) / 100
                : 0.4 + ((i * 2003) % 50) / 100;

              return (
                <div
                  key={`surprised-${i}`}
                  className={`absolute ${isCircle ? "rounded-full" : "rounded-md"}`}
                  style={{
                    left: posX - size / 2,
                    top: posY - size / 2,
                    width: size,
                    height: size,
                    opacity: opacity,
                    background: theme === "light" ? "rgba(216, 180, 254, 0.85)" : "rgba(126, 34, 206, 0.7)",
                    boxShadow: `0 0 30px 15px ${theme === "light" ? "rgba(168, 85, 247, 0.5)" : "rgba(168, 85, 247, 0.3)"}`,
                    transition: "all 1.5s ease-out",
                    zIndex: -1
                  }}
                />
              );
            })}
          </>
        );

      case "tired":
        return (
          <>
            {Array.from({ length: 7 }).map((_, i) => {
              const centerX = window.innerWidth / 2;
              const centerY = window.innerHeight / 2;

              const angle = (i / 7) * Math.PI * 2;
              const distanceFromCenter = 120 * (i % 3 + 1);

              const posX = centerX + Math.cos(angle) * distanceFromCenter;
              const posY = centerY + Math.sin(angle) * distanceFromCenter;

              const size = 110 + ((i * 1619) % 130);
              const opacity = theme === "light"
                ? 0.25 + ((i * 2749) % 30) / 100
                : 0.15 + ((i * 2749) % 20) / 100;

              return (
                <div
                  key={`tired-${i}`}
                  className="absolute rounded-full"
                  style={{
                    left: posX - size / 2,
                    top: posY - size / 2,
                    width: size,
                    height: size,
                    opacity: opacity,
                    background: theme === "light" ? "rgba(209, 213, 219, 0.9)" : "rgba(75, 85, 99, 0.8)",
                    boxShadow: `0 0 50px 25px ${theme === "light" ? "rgba(107, 114, 128, 0.3)" : "rgba(107, 114, 128, 0.15)"}`,
                    filter: "blur(10px)",
                    transition: "all 1.5s ease-out",
                    zIndex: -1
                  }}
                />
              );
            })}
          </>
        );

      case "grateful":
        return (
          <>
            {Array.from({ length: 12 }).map((_, i) => {
              const centerX = window.innerWidth / 2;
              const centerY = window.innerHeight / 2;

              let angle, distanceFromCenter;

              if (i < 8) {
                angle = (i / 8) * Math.PI * 2;
                distanceFromCenter = 200;
              } else {
                angle = (i / 4) * Math.PI * 2;
                distanceFromCenter = 80;
              }

              const posX = centerX + Math.cos(angle) * distanceFromCenter;
              const posY = centerY + Math.sin(angle) * distanceFromCenter;

              const size = 30 + ((i * 1031) % 55);
              const cornerRadius = 10 + ((i * 2081) % 50);
              const opacity = theme === "light"
                ? 0.5 + ((i * 2707) % 45) / 100
                : 0.3 + ((i * 2707) % 50) / 100;

              return (
                <div
                  key={`grateful-${i}`}
                  className="absolute"
                  style={{
                    left: posX - size / 2,
                    top: posY - size / 2,
                    width: size,
                    height: size,
                    opacity: opacity,
                    background: theme === "light" ? "rgba(167, 243, 208, 0.85)" : "rgba(6, 95, 70, 0.7)",
                    boxShadow: `0 0 35px 18px ${theme === "light" ? "rgba(16, 185, 129, 0.5)" : "rgba(16, 185, 129, 0.3)"}`,
                    borderRadius: `${cornerRadius}% ${100 - cornerRadius}% ${cornerRadius}% ${100 - cornerRadius}%`,
                    transition: "all 1.5s ease-out",
                    zIndex: -1
                  }}
                />
              );
            })}
          </>
        );

      case "confused":
        return (
          <>
            {Array.from({ length: 12 }).map((_, i) => {
              const centerX = window.innerWidth / 2;
              const centerY = window.innerHeight / 2;

              const angle = (i / 5) * Math.PI;
              const distanceFromCenter = 50 + i * 20;

              const posX = centerX + Math.cos(angle) * distanceFromCenter;
              const posY = centerY + Math.sin(angle) * distanceFromCenter;

              const size = 25 + ((i * 1901) % 45);
              const rotation = ((i * 3121) % 360);
              const opacity = theme === "light"
                ? 0.5 + ((i * 2053) % 40) / 100
                : 0.3 + ((i * 2053) % 40) / 100;

              return (
                <div
                  key={`confused-${i}`}
                  className="absolute"
                  style={{
                    left: posX - size / 2,
                    top: posY - size / 2,
                    width: size,
                    height: size,
                    opacity: opacity,
                    background: theme === "light" ? "rgba(254, 243, 199, 0.85)" : "rgba(146, 64, 14, 0.7)",
                    boxShadow: `0 0 30px 15px ${theme === "light" ? "rgba(245, 158, 11, 0.5)" : "rgba(245, 158, 11, 0.3)"}`,
                    transform: `rotate(${rotation}deg)`,
                    clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                    transition: "all 1.5s ease-out",
                    zIndex: -1
                  }}
                />
              );
            })}
          </>
        );

      default:
        return null;
    }
  }, [selectedMood, theme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const savedHistory = localStorage.getItem("moodHistory");

    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }

    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory.length > 0 ? parsedHistory : sampleHistoryData);
      } catch (e) {
        console.error("Failed to parse saved history");
        setHistory(sampleHistoryData);
      }
    } else {
      setHistory(sampleHistoryData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.style.backgroundColor = theme === "light" ? "#ffffff" : "#0a0a0a";
    document.body.style.color = theme === "light" ? "#171717" : "#ededed";
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("moodHistory", JSON.stringify(history));
  }, [history]);

  // Control body overflow when history panel is open
  useEffect(() => {
    if (showHistoryPanel) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [showHistoryPanel]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const handleMoodSelect = (mood: Mood["type"]) => {
    setSelectedMood(mood);
    setLastSelectedMood(mood);
    if (textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
    }
  };

  const saveMood = () => {
    if (selectedMood && note.trim()) {
      const newMood: Mood = {
        type: selectedMood,
        note: note.trim(),
        timestamp: Date.now(),
        id: Date.now().toString()
      };
      setHistory(prev => [newMood, ...prev]);
      setNote("");
      setSelectedMood(null);
    }
  };

  const resetSelection = () => {
    setSelectedMood(null);
    setNote("");
  };

  const deleteMoodEntry = (id: string) => {
    setHistory(prev => prev.filter(entry => entry.id !== id));
  };

  const clearAllEntries = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmClear = () => {
    setHistory([]);
    localStorage.removeItem("moodHistory");
  };

  const getMoodColor = (mood: Mood["type"]) => {
    switch (mood) {
      case "calm": return theme === "light" ? "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" : "bg-gradient-to-br from-blue-950 to-blue-900 border-blue-800";
      case "happy": return theme === "light" ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200" : "bg-gradient-to-br from-yellow-950 to-yellow-900 border-yellow-800";
      case "anxious": return theme === "light" ? "bg-gradient-to-br from-red-50 to-red-100 border-red-200" : "bg-gradient-to-br from-red-950 to-red-900 border-red-800";
      case "sad": return theme === "light" ? "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200" : "bg-gradient-to-br from-indigo-950 to-indigo-900 border-indigo-800";
      case "energetic": return theme === "light" ? "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200" : "bg-gradient-to-br from-orange-950 to-orange-900 border-orange-800";
      case "angry": return theme === "light" ? "bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200" : "bg-gradient-to-br from-rose-950 to-rose-900 border-rose-800";
      case "surprised": return theme === "light" ? "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200" : "bg-gradient-to-br from-purple-950 to-purple-900 border-purple-800";
      case "tired": return theme === "light" ? "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200" : "bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700";
      case "grateful": return theme === "light" ? "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200" : "bg-gradient-to-br from-emerald-950 to-emerald-900 border-emerald-800";
      case "confused": return theme === "light" ? "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200" : "bg-gradient-to-br from-amber-950 to-amber-900 border-amber-800";
    }
  };

  const groupEntriesByDate = (entries: Mood[]) => {
    const grouped: { [key: string]: Mood[] } = {};

    entries.forEach(entry => {
      const date = new Date(entry.timestamp);
      const dateKey = date.toLocaleDateString();

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(entry);
    });

    return grouped;
  };

  const getMoodContainerBackground = useCallback((mood: Mood["type"] | null) => {
    if (!mood) return theme === "light" 
      ? "from-gray-50 via-blue-50/30 to-white" 
      : "from-gray-900 via-blue-900/10 to-black";
    
    switch (mood) {
      case "calm": return theme === "light" 
        ? "from-blue-50 via-blue-100/50 to-white" 
        : "from-blue-950 via-blue-900/50 to-gray-900";
      case "happy": return theme === "light" 
        ? "from-yellow-50 via-yellow-100/50 to-white" 
        : "from-yellow-950 via-yellow-900/50 to-gray-900";
      case "anxious": return theme === "light" 
        ? "from-red-50 via-red-100/50 to-white" 
        : "from-red-950 via-red-900/50 to-gray-900";
      case "sad": return theme === "light" 
        ? "from-indigo-50 via-indigo-100/50 to-white" 
        : "from-indigo-950 via-indigo-900/50 to-gray-900";
      case "energetic": return theme === "light" 
        ? "from-orange-50 via-orange-100/50 to-white" 
        : "from-orange-950 via-orange-900/50 to-gray-900";
      case "angry": return theme === "light" 
        ? "from-rose-50 via-rose-100/50 to-white" 
        : "from-rose-950 via-rose-900/50 to-gray-900";
      case "surprised": return theme === "light" 
        ? "from-purple-50 via-purple-100/50 to-white" 
        : "from-purple-950 via-purple-900/50 to-gray-900";
      case "tired": return theme === "light" 
        ? "from-gray-100 via-gray-100/50 to-white" 
        : "from-gray-800 via-gray-800/50 to-gray-900";
      case "grateful": return theme === "light" 
        ? "from-emerald-50 via-emerald-100/50 to-white" 
        : "from-emerald-950 via-emerald-900/50 to-gray-900";
      case "confused": return theme === "light" 
        ? "from-amber-50 via-amber-100/50 to-white" 
        : "from-amber-950 via-amber-900/50 to-gray-900";
      default: return theme === "light" 
        ? "from-gray-50 via-blue-50/30 to-white" 
        : "from-gray-900 via-blue-900/10 to-black";
    }
  }, [theme]);

  const currentMood = selectedMood || lastSelectedMood;
  const bgGradient = getMoodContainerBackground(currentMood);

  const bgColor = theme === "light" ? "bg-white" : "bg-[#0a0a0a]";
  const textColor = theme === "light" ? "text-black" : "text-white";
  const buttonBg = theme === "light" ? "bg-gray-100 hover:bg-gray-200" : "bg-gray-800 hover:bg-gray-700";
  const cardBg = theme === "light" ? "bg-white" : "bg-gray-800";
  const borderColor = theme === "light" ? "border-gray-200" : "border-gray-700";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveMood();
    }
  };

  return (
    <motion.div 
      className="relative min-h-screen overflow-hidden"
      animate={{ 
        background: currentMood ? theme === "light" 
          ? `linear-gradient(to bottom right, var(--${currentMood}-light-from), var(--${currentMood}-light-to))`
          : `linear-gradient(to bottom right, var(--${currentMood}-dark-from), var(--${currentMood}-dark-to))`
        : theme === "light"
          ? "linear-gradient(to bottom right, #f9fafb, #ffffff)"
          : "linear-gradient(to bottom right, #111827, #0a0a0a)"
      }}
      transition={{ duration: 1.5 }}
    >
      <style jsx global>{`
        :root {
          --calm-light-from: #eff6ff;
          --calm-light-to: #ffffff;
          --calm-dark-from: #172554;
          --calm-dark-to: #0f172a;
          
          --happy-light-from: #fefce8;
          --happy-light-to: #ffffff;
          --happy-dark-from: #422006;
          --happy-dark-to: #0f172a;
          
          --anxious-light-from: #fee2e2;
          --anxious-light-to: #ffffff;
          --anxious-dark-from: #450a0a;
          --anxious-dark-to: #0f172a;
          
          --sad-light-from: #eef2ff;
          --sad-light-to: #ffffff;
          --sad-dark-from: #1e1b4b;
          --sad-dark-to: #0f172a;
          
          --energetic-light-from: #fff7ed;
          --energetic-light-to: #ffffff;
          --energetic-dark-from: #431407;
          --energetic-dark-to: #0f172a;
          
          --angry-light-from: #fff1f2;
          --angry-light-to: #ffffff;
          --angry-dark-from: #4c0519;
          --angry-dark-to: #0f172a;
          
          --surprised-light-from: #faf5ff;
          --surprised-light-to: #ffffff;
          --surprised-dark-from: #3b0764;
          --surprised-dark-to: #0f172a;
          
          --tired-light-from: #f8fafc;
          --tired-light-to: #ffffff;
          --tired-dark-from: #1e293b;
          --tired-dark-to: #0f172a;
          
          --grateful-light-from: #ecfdf5;
          --grateful-light-to: #ffffff;
          --grateful-dark-from: #022c22;
          --grateful-dark-to: #0f172a;
          
          --confused-light-from: #fffbeb;
          --confused-light-to: #ffffff;
          --confused-dark-from: #451a03;
          --confused-dark-to: #0f172a;
        }
      `}</style>
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-90`} />
      
      {(selectedMood || lastSelectedMood) && <div className="fixed top-0 left-0 w-full h-full pointer-events-none">{getBackgroundElements()}</div>}

      <main className={`relative z-10 flex flex-col items-center justify-center min-h-screen max-w-4xl mx-auto px-4 ${textColor}`}>
        {!selectedMood ? (
          <div className="w-full space-y-8 mt-2 mb-4">
            <h1 className="text-4xl font-bold text-center mb-8 tracking-tight leading-tight transition-transform duration-300 ease-out bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              How are you feeling today?
            </h1>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {(["calm", "happy", "anxious", "sad", "energetic", "angry", "surprised", "tired", "grateful", "confused"] as const).map((mood) => (
                <motion.button
                  key={mood}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMoodSelect(mood)}
                  className={`${getMoodColor(mood)} border p-4 rounded-xl text-center capitalize transition-all flex flex-col items-center py-6 shadow-md backdrop-blur-md relative group hover:shadow-xl`}
                  style={{ transform: 'translateZ(0)' }} /* Force hardware acceleration */
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: ["calm", "happy", "anxious", "sad", "energetic", "angry", "surprised", "tired", "grateful", "confused"].indexOf(mood) * 0.05
                  }}
                >
                  <motion.span
                    className="text-4xl mb-2"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: mood === "energetic" ? [0, 5, -5, 0] : undefined
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      repeatType: "reverse",
                      ease: "easeInOut",
                      delay: ["calm", "happy", "anxious", "sad", "energetic", "angry", "surprised", "tired", "grateful", "confused"].indexOf(mood) * 0.1
                    }}
                  >
                    {getMoodEmoji(mood)}
                  </motion.span>
                  <span className="font-medium">{mood}</span>
                  <motion.div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    style={{
                      background: `radial-gradient(circle at center, ${theme === "light" ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.1)"} 0%, transparent 70%)`,
                      pointerEvents: "none"
                    }}
                  />
                </motion.button>
              ))}
            </div>

            <motion.div
              className={`mb-10 p-6 rounded-xl backdrop-blur-xl ${theme === "light" ? "bg-white/70" : "bg-gray-800/50"} border border-gray-200/50 dark:border-gray-700/50 shadow-lg`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl mr-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    💭
                  </motion.div>
                </div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  Tracking Your Emotions
                </h2>
              </div>

              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-500/5">
                  <div className="mt-1 text-blue-500 text-lg">•</div>
                  <div>
                    <p className="font-medium text-base mb-1">Record Your Feelings</p>
                    <p>Track and reflect on your emotions to understand your patterns over time.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-500/5">
                  <div className="mt-1 text-purple-500 text-lg">•</div>
                  <div>
                    <p className="font-medium text-base mb-1">Floating Memory Bubbles</p>
                    <p>Your saved mood entries will appear as interactive floating bubbles on this screen.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-indigo-500/10 to-indigo-500/5">
                  <div className="mt-1 text-indigo-500 text-lg">•</div>
                  <div>
                    <p className="font-medium text-base mb-1">Explore Past Emotions</p>
                    <p>Hover over any bubble to see when you felt that way and what you wrote.</p>
                  </div>
                </li>
              </ul>

              <div className="mt-5 p-3 rounded-lg bg-gradient-to-r from-pink-500/10 to-orange-500/10 flex items-center gap-3">
                <div className="flex-shrink-0 text-xl">💡</div>
                <p className="text-sm">Try adding a few emotions to see them appear as floating bubbles on your screen!</p>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`w-full ${cardBg} border ${borderColor} rounded-xl shadow-xl p-6 backdrop-blur-xl ${theme === "light" ? "bg-white/90" : "bg-gray-800/70"}`}
            style={{
              boxShadow: theme === "light"
                ? "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.03), 0 0 40px -10px rgba(147, 197, 253, 0.25)"
                : "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)"
            }}
          >
              <div className="flex justify-between items-center mb-5">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetSelection}
                  className={`${buttonBg} p-2 rounded-full transition-colors backdrop-blur-md shadow-sm ${theme === "light" ? "bg-gradient-to-r from-gray-50 to-gray-100/90" : ""}`}
                >
                  <X size={18} />
                </motion.button>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getMoodEmoji(selectedMood)}</span>
                  <span className="font-medium capitalize text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{selectedMood}</span>
                </div>
                <motion.button
                  whileHover={{ scale: note.trim() ? 1.05 : 1, boxShadow: note.trim() ? "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)" : "none" }}
                  whileTap={{ scale: note.trim() ? 0.95 : 1 }}
                  onClick={saveMood}
                  disabled={!note.trim()}
                  className={`${buttonBg} p-2 rounded-full transition-colors backdrop-blur-md shadow-sm ${!note.trim() ? "opacity-50 cursor-not-allowed" : ""} ${theme === "light" ? "bg-gradient-to-r from-blue-500/90 to-purple-500/90 hover:from-blue-600/90 hover:to-purple-600/90 text-white" : "bg-gradient-to-r from-purple-900/70 to-pink-900/70"}`}
                >
                  <Save size={18} />
                </motion.button>
              </div>

              <textarea
                ref={textareaRef}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Why do you feel this way?"
                className={`w-full p-4 rounded-xl border ${borderColor} ${bgColor} ${textColor} min-h-[150px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-400/50 ${theme === "light" ? "bg-white/80 placeholder-gray-400" : "bg-gray-800/60"} backdrop-blur-md shadow-inner`}
                style={{
                  boxShadow: theme === "light"
                    ? "inset 0 2px 4px 0 rgba(0, 0, 0, 0.03), inset 0 0 0 1px rgba(0, 0, 0, 0.02)"
                    : "inset 0 2px 4px 0 rgba(0, 0, 0, 0.15)"
                }}
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center"
              >
              <p>Your mood will be saved to your history when you click the save button</p>
            </motion.div>
          </motion.div>
        )}
      </main>

      {history.length > 0 && !selectedMood && showHistory && (
        <div className="fixed inset-0 pointer-events-none z-[50]">
          {/* Only render a maximum of 10 bubbles to improve performance */}
          {history.slice(0, 10).map((entry) => (
            <HistoryBubble
              key={entry.id}
              entry={entry}
              theme={theme}
              onDelete={deleteMoodEntry}
              isFormOpen={selectedMood !== null}
            />
          ))}
        </div>
      )}

      {history.length > 0 && !selectedMood && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-[9960] flex flex-col items-center gap-3">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearAllEntries}
            className={`${theme === "light" ? "bg-white text-gray-800 border-gray-300 shadow-md" : "bg-gray-800/80 text-gray-300 border-gray-700"} backdrop-blur-md px-3 sm:px-5 py-2 rounded-full border text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 font-medium max-w-[calc(100vw-2rem)]`}
          >
            <X size={14} className={theme === "light" ? "text-red-500" : "text-red-400"} />
            <span className="truncate">Clear All Mood History</span>
          </motion.button>
        </div>
      )}

      <div className="fixed bottom-6 right-3 sm:right-6 z-[9950] flex items-center gap-2 sm:gap-3">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowHistory(prev => !prev)}
          className={`p-2.5 sm:p-3 rounded-full transition-colors shadow-md flex items-center justify-center ${!showHistory 
            ? theme === "light" 
              ? "bg-gray-200 text-gray-600" 
              : "bg-gray-600 text-gray-300" 
            : theme === "light"
              ? "bg-blue-50 text-blue-600 border border-blue-200"
              : "bg-blue-900/40 text-blue-300 border border-blue-800"
          }`}
          aria-label="Toggle floating bubbles"
        >
          <span className="text-lg sm:text-xl">💭</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (selectedMood === null) {
              setShowHistoryPanel(prev => !prev);
            }
          }}
          className={`p-3 rounded-full transition-colors shadow-md flex items-center justify-center ${
            showHistoryPanel 
              ? "bg-blue-500 dark:bg-blue-600 text-white" 
              : theme === "light"
                ? "bg-white text-gray-700 border border-gray-200"
                : "bg-gray-800 text-gray-300 border border-gray-700"
          }`}
          aria-label="Toggle history panel"
        >
          <History size={20} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className={`p-3 rounded-full transition-colors shadow-md flex items-center justify-center ${
            theme === "light" 
              ? "bg-white text-gray-700 border border-gray-200" 
              : "bg-gray-800 text-gray-300 border border-gray-700"
          }`}
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isConfirmModalOpen && (
          <ConfirmModal
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            onConfirm={handleConfirmClear}
            theme={theme}
          />
        )}
        
        {showHistoryPanel && !selectedMood && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-[8990]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistoryPanel(false)}
            />
            <MoodHistoryPanel
              entries={history}
              theme={theme}
              onDelete={deleteMoodEntry}
              onClose={() => setShowHistoryPanel(false)}
            />
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .tooltip-arrow {
          fill: ${theme === "light" ? "white" : "#1f2937"};
          filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
        }
      `}</style>

      {history.length === 0 && !selectedMood && (
        <div className="fixed bottom-[100px] left-1/2 transform -translate-x-1/2 z-[8000]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${theme === "light" ? "bg-white/80 text-gray-600 border-gray-200" : "bg-gray-800/80 text-gray-300 border-gray-700"} rounded-xl p-4 backdrop-blur-md shadow-lg border text-center max-w-xs`}
          >
            <div className="text-2xl mb-2">😊</div>
            <p className="text-sm">Select a mood to record how you're feeling today!</p>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
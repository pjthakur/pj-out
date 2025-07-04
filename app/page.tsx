"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiClock, 
  FiEdit2,  
  FiX, 
  FiPlus,
  FiMinus,
  FiActivity,
  FiAward,
  FiZap,
  FiTarget,
  FiPlay,
  FiPause,
  FiSquare
} from 'react-icons/fi';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted ? ReactDOM.createPortal(children, document.body) : null;
};

interface FocusSession {
  id: string;
  title: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  score: number;
}
if (typeof window !== 'undefined') {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);

  const style = document.createElement('style');
  style.id = 'focus-insights-styles';
  style.textContent = `
    html, body {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    html::-webkit-scrollbar, body::-webkit-scrollbar {
      display: none;
    }
    html.modal-open,
    body.modal-open {
      overflow: hidden !important;
    }
    .modal-backdrop-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.2);
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
      z-index: 50;
    }
  `;
  if (!document.getElementById('focus-insights-styles')) {
    document.head.appendChild(style);
  }
}
const FocusInsightsWidget: React.FC = () => {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSession, setEditingSession] = useState<FocusSession | null>(null);
  const addModalScrollRef = useRef<HTMLDivElement>(null);
  const editModalScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isModalOpen = showAddModal || showEditModal;
    const htmlElement = document.documentElement;

    if (isModalOpen) {
      htmlElement.classList.add('modal-open');
    } else {
      htmlElement.classList.remove('modal-open');
    }

    return () => {
      htmlElement.classList.remove('modal-open');
    };
  }, [showAddModal, showEditModal]);

  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [newSessionStartTime, setNewSessionStartTime] = useState({ hour: '09', minute: '00', period: 'AM' });
  const [newSessionEndTime, setNewSessionEndTime] = useState({ hour: '10', minute: '00', period: 'AM' });

  const [editSessionTitle, setEditSessionTitle] = useState('');
  const [editSessionStartTime, setEditSessionStartTime] = useState({ hour: '09', minute: '00', period: 'AM' });
  const [editSessionEndTime, setEditSessionEndTime] = useState({ hour: '10', minute: '00', period: 'AM' });
  
  const [addSessionError, setAddSessionError] = useState('');
  const [editSessionError, setEditSessionError] = useState('');
  const [conflictingSessionId, setConflictingSessionId] = useState<string | null>(null);
  const [titleChangedNotice, setTitleChangedNotice] = useState('');
  const [streak, setStreak] = useState(0);
  const [todayScore, setTodayScore] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerStartTime, setTimerStartTime] = useState<Date | null>(null);
  const [currentSessionTitle, setCurrentSessionTitle] = useState('Focus Session');

  const calculateFocusScore = useCallback((duration: number, startTime: Date, title: string): number => {
    let score = 50;
    if (duration >= 25 && duration <= 90) {
      score += Math.min(40, (duration - 25) * 0.6 + 20);
    } else if (duration > 90) {
      score += Math.max(20, 40 - (duration - 90) * 0.3);
    } else if (duration > 0) {
      score += duration * 0.8;
    }
    const hour = startTime.getHours();
    if (hour >= 9 && hour <= 11) {
      score += 10; 
    } else if (hour >= 14 && hour <= 16) {
      score += 8; 
    } else if (hour >= 8 && hour <= 12) {
      score += 6; 
    } else if (hour >= 13 && hour <= 17) {
      score += 4; 
    }
    const titleLower = title.toLowerCase();
    if (titleLower.includes('deep work') || titleLower.includes('coding') || titleLower.includes('writing')) {
      score += 10; 
    } else if (titleLower.includes('review') || titleLower.includes('research') || titleLower.includes('study')) {
      score += 8; 
    } else if (titleLower.includes('planning') || titleLower.includes('design')) {
      score += 6; 
    } else if (titleLower.includes('meeting') || titleLower.includes('call')) {
      score += 3; 
    } else {
      score += 5; 
    }
    score += Math.floor(Math.random() * 11) - 5;
    return Math.max(0, Math.min(100, Math.round(score)));
  }, []);
  const generateMockData = useCallback(() => {
    const today = new Date();
    const mockSessions: FocusSession[] = [
      {
        id: '1',
        title: 'Deep Work Session',
        duration: 90,
        startTime: new Date(today.setHours(9, 0, 0, 0)),
        endTime: new Date(today.setHours(10, 30, 0, 0)),
        score: 0 
      },
      {
        id: '2',
        title: 'Project Planning',
        duration: 45,
        startTime: new Date(today.setHours(11, 0, 0, 0)),
        endTime: new Date(today.setHours(11, 45, 0, 0)),
        score: 0 
      },
      {
        id: '3',
        title: 'Code Review',
        duration: 60,
        startTime: new Date(today.setHours(14, 0, 0, 0)),
        endTime: new Date(today.setHours(15, 0, 0, 0)),
        score: 0 
      }
    ];
    mockSessions.forEach(session => {
      session.score = calculateFocusScore(session.duration, session.startTime, session.title);
    });
    return { mockSessions };
  }, [calculateFocusScore]);
  const calculateTodayScore = useCallback(() => {
    if (sessions.length === 0) return 0;
    const totalScore = sessions.reduce((acc, session) => acc + session.score, 0);
    return Math.round(totalScore / sessions.length);
  }, [sessions]);
  useEffect(() => {
    const { mockSessions } = generateMockData();
    setSessions(mockSessions);
    setStreak(5);
  }, [generateMockData]);
  useEffect(() => {
    const newScore = calculateTodayScore();
    if (newScore > 0) {
      setTodayScore(newScore);
    }
  }, [sessions, calculateTodayScore]);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);
  const timeToObject = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return {
      hour: hour12.toString().padStart(2, '0'),
      minute: minutes.toString().padStart(2, '0'),
      period
    };
  };
  const objectToTime = (timeObj: { hour: string; minute: string; period: string }) => {
    let hour = parseInt(timeObj.hour);
    if (timeObj.period === 'PM' && hour !== 12) hour += 12;
    if (timeObj.period === 'AM' && hour === 12) hour = 0;
    const date = new Date();
    date.setHours(hour, parseInt(timeObj.minute), 0, 0);
    return date;
  };
  const calculateDuration = (startTime: { hour: string; minute: string; period: string }, endTime: { hour: string; minute: string; period: string }) => {
    const start = objectToTime(startTime);
    const end = objectToTime(endTime);
    const durationMs = end.getTime() - start.getTime();
    return Math.round(durationMs / (1000 * 60));
  };
  const adjustDuration = (startTime: { hour: string; minute: string; period: string }, durationMinutes: number) => {
    const start = objectToTime(startTime);
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
    return timeToObject(end);
  };
  const changeDuration = (currentStartTime: { hour: string; minute: string; period: string }, currentEndTime: { hour: string; minute: string; period: string }, change: number, isAddModal: boolean) => {
    const currentDuration = calculateDuration(currentStartTime, currentEndTime);
    const newDuration = Math.max(15, Math.min(480, currentDuration + change));
    const newEndTime = adjustDuration(currentStartTime, newDuration);
    
    const scrollRef = isAddModal ? addModalScrollRef : editModalScrollRef;
    const scrollTop = scrollRef.current?.scrollTop || 0;
    
    if (isAddModal) {
      setNewSessionEndTime(newEndTime);
      setAddSessionError('');
    } else {
      setEditSessionEndTime(newEndTime);
      setEditSessionError('');
    }
    setConflictingSessionId(null);
    
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollTop;
      }
    });
  };
  const generateUniqueTitle = (proposedTitle: string, excludeSessionId?: string) => {
    const existingTitles = sessions
      .filter(session => excludeSessionId ? session.id !== excludeSessionId : true)
      .map(session => session.title.toLowerCase());
    if (!existingTitles.includes(proposedTitle.toLowerCase())) {
      return proposedTitle;
    }
    let counter = 2;
    let uniqueTitle = `${proposedTitle} (${counter})`;
    while (existingTitles.includes(uniqueTitle.toLowerCase())) {
      counter++;
      uniqueTitle = `${proposedTitle} (${counter})`;
    }
    return uniqueTitle;
  };
  const checkTimeConflicts = (startTime: Date, endTime: Date, excludeSessionId?: string) => {
    const conflictingSessions = sessions.filter(session => {
      if (excludeSessionId && session.id === excludeSessionId) {
        return false;
      }
      return (startTime < session.endTime) && (endTime > session.startTime);
    });
    return conflictingSessions;
  };
  const validateTimeRange = (startTime: { hour: string; minute: string; period: string }, endTime: { hour: string; minute: string; period: string }, excludeSessionId?: string) => {
    const start = objectToTime(startTime);
    const end = objectToTime(endTime);
    if (end <= start) {
      return 'End time must be after start time';
    }
    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    if (durationMinutes > 480) { 
      return 'Session duration cannot exceed 8 hours';
    }
    const conflictingSessions = checkTimeConflicts(start, end, excludeSessionId);
    if (conflictingSessions.length > 0) {
      const conflictSession = conflictingSessions[0];
      const conflictStart = formatTime(conflictSession.startTime);
      const conflictEnd = formatTime(conflictSession.endTime);
      setConflictingSessionId(conflictSession.id);
      return `Time conflict with "${conflictSession.title}" (${conflictStart} - ${conflictEnd})`;
    }
    setConflictingSessionId(null);
    return '';
  };
  const handleEdit = (session: FocusSession) => {
    setEditingSession(session);
    setEditSessionTitle(session.title);
    setEditSessionStartTime(timeToObject(session.startTime));
    setEditSessionEndTime(timeToObject(session.endTime));
    setShowEditModal(true);
  };
  const handleSaveEdit = () => {
    if (!editingSession || !editSessionTitle) {
      setEditSessionError('Please enter a session title');
      return;
    }
    const validationError = validateTimeRange(editSessionStartTime, editSessionEndTime, editingSession.id);
    if (validationError) {
      setEditSessionError(validationError);
      return;
    }
    const startTime = objectToTime(editSessionStartTime);
    const endTime = objectToTime(editSessionEndTime);
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
    const uniqueTitle = generateUniqueTitle(editSessionTitle, editingSession.id);
    const updatedSession = {
      ...editingSession,
      title: uniqueTitle,
      startTime,
      endTime,
      duration,
      score: calculateFocusScore(duration, startTime, uniqueTitle)
    };
    setSessions(sessions.map(session => 
      session.id === editingSession.id ? updatedSession : session
    ));
    if (uniqueTitle !== editSessionTitle) {
      setTitleChangedNotice(`Title changed to "${uniqueTitle}" to avoid duplicates`);
      setTimeout(() => setTitleChangedNotice(''), 3000);
    }
    setShowEditModal(false);
    setEditingSession(null);
    setEditSessionTitle('');
    setEditSessionError('');
    setConflictingSessionId(null);
    setTitleChangedNotice('');
  };
  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingSession(null);
    setEditSessionTitle('');
    setEditSessionError('');
    setConflictingSessionId(null);
    setTitleChangedNotice('');
  };
  const startTimer = () => {
    if (!timerStartTime) {
      setTimerStartTime(new Date());
    }
    setIsTimerRunning(true);
  };
  const pauseTimer = () => {
    setIsTimerRunning(false);
  };
  const stopTimer = () => {
    if (timerSeconds > 0 && timerStartTime) {
      const now = new Date();
      const actualDuration = Math.round((now.getTime() - timerStartTime.getTime()) / (1000 * 60));
      const uniqueTitle = generateUniqueTitle(currentSessionTitle);
      const newSession: FocusSession = {
        id: Date.now().toString(),
        title: uniqueTitle,
        duration: actualDuration,
        startTime: timerStartTime,
        endTime: now,
        score: calculateFocusScore(actualDuration, timerStartTime, uniqueTitle)
      };
      setSessions([...sessions, newSession]);
      if (uniqueTitle !== currentSessionTitle) {
        setTitleChangedNotice(`Title changed to "${uniqueTitle}" to avoid duplicates`);
        setTimeout(() => setTitleChangedNotice(''), 3000);
      }
    }
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setTimerStartTime(null);
    setCurrentSessionTitle('Focus Session');
  };
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setTimerStartTime(null);
  };
  const formatTimerTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const handleAddSession = () => {
    if (!newSessionTitle) {
      setAddSessionError('Please enter a session title');
      return;
    }
    const validationError = validateTimeRange(newSessionStartTime, newSessionEndTime);
    if (validationError) {
      setAddSessionError(validationError);
      return;
    }
    const startTime = objectToTime(newSessionStartTime);
    const endTime = objectToTime(newSessionEndTime);
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
    const uniqueTitle = generateUniqueTitle(newSessionTitle);
      const newSessionObj: FocusSession = {
        id: Date.now().toString(),
      title: uniqueTitle,
        duration: duration,
        startTime: startTime,
      endTime: endTime,
      score: calculateFocusScore(duration, startTime, uniqueTitle)
      };
      setSessions([...sessions, newSessionObj]);
    if (uniqueTitle !== newSessionTitle) {
      setTitleChangedNotice(`Title changed to "${uniqueTitle}" to avoid duplicates`);
      setTimeout(() => setTitleChangedNotice(''), 3000);
    }
    setShowAddModal(false);
    setNewSessionTitle('');
    setNewSessionStartTime({ hour: '09', minute: '00', period: 'AM' });
    setNewSessionEndTime({ hour: '10', minute: '00', period: 'AM' });
    setAddSessionError('');
    setConflictingSessionId(null);
    setTitleChangedNotice('');
  };
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };
  const handleStartTimeChange = (newStartTime: { hour: string; minute: string; period: string }, isAddModal: boolean) => {
    const startTime = objectToTime(newStartTime);
    let endTime = new Date(startTime.getTime() + 60 * 60 * 1000); 
    const excludeId = isAddModal ? undefined : editingSession?.id;
    const conflictingSessions = checkTimeConflicts(startTime, endTime, excludeId);
    if (conflictingSessions.length > 0) {
      const conflictingSession = conflictingSessions[0];
      const maxEndTime = new Date(conflictingSession.startTime.getTime() - 60 * 1000); 
      if (maxEndTime > startTime) {
        endTime = maxEndTime;
      } else {
        endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
      }
    }
    const newEndTime = timeToObject(endTime);
    if (isAddModal) {
      setNewSessionStartTime(newStartTime);
      setNewSessionEndTime(newEndTime);
      setAddSessionError('');
    } else {
      setEditSessionStartTime(newStartTime);
      setEditSessionEndTime(newEndTime);
      setEditSessionError('');
    }
    setConflictingSessionId(null);
  };
  const DurationPicker = ({ 
    startTime, 
    endTime, 
    isAddModal 
  }: { 
    startTime: { hour: string; minute: string; period: string }, 
    endTime: { hour: string; minute: string; period: string }, 
    isAddModal: boolean 
  }) => {
    const duration = calculateDuration(startTime, endTime);
  return (
      <div>
        <label className="block text-base font-medium text-gray-700 mb-2">Duration</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => changeDuration(startTime, endTime, -15, isAddModal)}
            className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <FiMinus className="w-3 h-3 text-gray-600" />
          </button>
          <div className="flex-1 text-center">
            <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-base font-semibold text-gray-900">
                {duration} min
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => changeDuration(startTime, endTime, 15, isAddModal)}
            className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <FiPlus className="w-3 h-3 text-gray-600" />
          </button>
      </div>
      </div>
    );
  };
  const TimePicker = ({ 
    value, 
    onChange, 
    label,
    isStartTime = false,
    isAddModal = false
  }: { 
    value: { hour: string; minute: string; period: string }, 
    onChange: (newTime: { hour: string; minute: string; period: string }) => void,
    label: string,
    isStartTime?: boolean,
    isAddModal?: boolean
  }) => {
    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const periods = ['AM', 'PM'];
  return (
      <div>
        <label className="block text-base font-medium text-gray-700 mb-3">{label}</label>
        <div className="flex gap-3">
          <select
            value={value.hour}
            onChange={(e) => {
              const newTime = { ...value, hour: e.target.value };
              if (isStartTime) {
                handleStartTimeChange(newTime, isAddModal);
              } else {
                onChange(newTime);
                setConflictingSessionId(null);
                if (isAddModal) {
                  setAddSessionError('');
                } else {
                  setEditSessionError('');
                }
              }
            }}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-medium text-center appearance-none bg-white"
          >
            {hours.map(hour => (
              <option key={hour} value={hour}>{hour}</option>
            ))}
          </select>
          <span className="px-2 py-3 text-gray-500 text-xl font-bold">:</span>
          <select
            value={value.minute}
            onChange={(e) => {
              const newTime = { ...value, minute: e.target.value };
              if (isStartTime) {
                handleStartTimeChange(newTime, isAddModal);
              } else {
                onChange(newTime);
                setConflictingSessionId(null);
                if (isAddModal) {
                  setAddSessionError('');
                } else {
                  setEditSessionError('');
                }
              }
            }}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-medium text-center appearance-none bg-white"
          >
            {minutes.map(minute => (
              <option key={minute} value={minute}>{minute}</option>
            ))}
          </select>
          <select
            value={value.period}
            onChange={(e) => {
              const newTime = { ...value, period: e.target.value };
              if (isStartTime) {
                handleStartTimeChange(newTime, isAddModal);
              } else {
                onChange(newTime);
                setConflictingSessionId(null);
                if (isAddModal) {
                  setAddSessionError('');
                } else {
                  setEditSessionError('');
                }
              }
            }}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-medium text-center appearance-none bg-white min-w-[80px]"
          >
            {periods.map(period => (
              <option key={period} value={period}>{period}</option>
            ))}
          </select>
        </div>
      </div>
    );
  };
  const totalFocusTime = sessions.reduce((acc, session) => acc + session.duration, 0);
  const sparklineData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = dayNames[date.getDay()];
    let score;
    if (index === 6) {
      score = todayScore || 85;
    } else {
      const baseScore = todayScore || 85;
      const variation = Math.random() * 20 - 10; 
      const trendFactor = (index - 3) * 2; 
      const weekendFactor = (date.getDay() === 0 || date.getDay() === 6) ? -5 : 0; 
      score = Math.max(40, Math.min(100, Math.round(baseScore + variation + trendFactor + weekendFactor)));
    }
    return {
      day: index + 1,
      score: score,
      dayName: index === 6 ? 'Today' : dayName,
      date: date.toISOString().split('T')[0]
    };
  });
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 65) return 'text-yellow-600';
    return 'text-red-600';
  };
  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-green-50 border-green-200';
    if (score >= 75) return 'bg-blue-50 border-blue-200';
    if (score >= 65) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };
  const renderTodayTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-2xl border-2 ${getScoreBg(todayScore)}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Score</p>
              <motion.p 
                key={todayScore}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`text-4xl font-bold ${getScoreColor(todayScore)}`}
              >
                {todayScore}%
              </motion.p>
              <p className="text-xs text-gray-500 mt-1">
                {todayScore >= 85 ? 'Excellent focus!' : todayScore >= 75 ? 'Good performance!' : 'Room for improvement'}
              </p>
            </div>
            <FiTarget className="w-8 h-8 text-gray-400" />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Past 7 days</span>
              <FiTrendingUp className="w-3 h-3 text-gray-400" />
            </div>
            <div className="h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line 
                  type="monotone" 
                    dataKey="score" 
                    stroke={todayScore >= 85 ? '#16A34A' : todayScore >= 75 ? '#3B82F6' : todayScore >= 65 ? '#F59E0B' : '#DC2626'}
                  strokeWidth={2}
                    dot={{ r: 2, fill: todayScore >= 85 ? '#16A34A' : todayScore >= 75 ? '#3B82F6' : todayScore >= 65 ? '#F59E0B' : '#DC2626', strokeWidth: 0 }}
                    activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Focus Streak</p>
              <motion.p 
                key={streak}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-4xl font-bold text-purple-600"
              >
                {streak}
              </motion.p>
            </div>
            <FiAward className="w-8 h-8 text-purple-400" />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <FiZap className="w-4 h-4 text-purple-500" />
            <p className="text-sm text-purple-700 font-medium">
              {streak >= 7 ? 'Amazing!' : streak >= 3 ? 'Keep going!' : 'Build momentum!'}
            </p>
          </div>
          <p className="text-xs text-gray-500">Consecutive days ≥75%</p>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-2 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 p-6"
        >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
            <FiClock className="text-indigo-500" />
            Focus Timer
          </h3>
          <div className="mb-4">
            <input
              type="text"
              value={currentSessionTitle}
              onChange={(e) => setCurrentSessionTitle(e.target.value)}
              className="text-center bg-white/80 border border-indigo-200 rounded-lg px-4 py-2 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Session title"
              disabled={isTimerRunning}
            />
            </div>
          <div className="mb-6">
            <div className="text-5xl font-mono font-bold text-indigo-700 mb-2">
              {formatTimerTime(timerSeconds)}
          </div>
            <div className="text-sm text-gray-600">
              {isTimerRunning ? 'Timer running...' : 'Ready to focus'}
      </div>
      </div>
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            {!isTimerRunning ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
                onClick={startTimer}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-500 text-white rounded-2xl hover:bg-indigo-600 transition-colors font-medium cursor-pointer col-span-2 min-h-[56px]"
          >
                <FiPlay className="w-5 h-5" />
                <span className="text-base font-semibold">Start Focus</span>
          </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={pauseTimer}
                  className="flex items-center justify-center gap-2 px-4 py-4 bg-yellow-500 text-white rounded-2xl hover:bg-yellow-600 transition-colors font-medium cursor-pointer min-h-[56px]"
                >
                  <FiPause className="w-5 h-5 stroke-2" />
                  <span className="text-sm font-semibold">Pause</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopTimer}
                  className="flex items-center justify-center gap-2 px-4 py-4 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-colors font-medium cursor-pointer min-h-[56px]"
                >
                  <FiSquare className="w-5 h-5" />
                  <span className="text-sm font-semibold">Stop</span>
                </motion.button>
              </>
            )}
            {timerSeconds > 0 && !isTimerRunning && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetTimer}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 transition-colors font-medium cursor-pointer col-span-2 min-h-[48px]"
              >
                <FiX className="w-4 h-4" />
                <span className="text-sm font-semibold">Reset Timer</span>
              </motion.button>
            )}
        </div>
        </div>
      </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:hidden flex justify-between items-center p-4 bg-gray-50 rounded-xl"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
            <p className="text-sm text-gray-600">Sessions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m
            </p>
            <p className="text-sm text-gray-600">Focus Time</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {sessions.length > 0 ? Math.round(totalFocusTime / sessions.length) : 0}m
            </p>
            <p className="text-sm text-gray-600">Avg Session</p>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="hidden lg:block space-y-4"
        >
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{sessions.length}</p>
            <p className="text-sm text-gray-600">Sessions</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-xl font-bold text-gray-900">
              {Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m
            </p>
            <p className="text-sm text-gray-600">Focus Time</p>
            </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">
              {sessions.length > 0 ? Math.round(totalFocusTime / sessions.length) : 0}m
            </p>
            <p className="text-sm text-gray-600">Avg Session</p>
          </div>
        </motion.div>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm"
      >
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiClock className="text-blue-500" />
            Today's Sessions
          </h3>
          </div>
        </div>
        <div className="p-4">
        <AnimatePresence>
          {sessions.length === 0 ? (
              <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <FiActivity className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <p className="text-gray-500 mb-6 text-lg">No focus sessions yet today</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-8 py-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors font-semibold cursor-pointer text-base min-w-[200px]"
                >
                  Start Your First Session
                </button>
              </motion.div>
          ) : (
              <div className="space-y-3">
                {[...sessions].reverse().map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border transition-all active:scale-98 ${
                      session.id === conflictingSessionId 
                        ? 'border-red-300 bg-red-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  onClick={() => handleEdit(session)}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 text-lg truncate pr-2">{session.title}</h4>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 ${
                            session.score >= 85 ? 'bg-green-100 text-green-800' :
                            session.score >= 75 ? 'bg-blue-100 text-blue-800' :
                            session.score >= 65 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {session.score}%
                          </div>
                      </div>
                        <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-base text-gray-600">
                            <div className="flex items-center gap-2">
                              <FiClock className="w-4 h-4" />
                              <span className="font-medium">{session.duration} min</span>
                            </div>
                            <span className="text-sm">{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
                        </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="hidden sm:inline">Tap to edit</span>
                            <FiEdit2 className="w-4 h-4" />
                      </div>
                    </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              </div>
          )}
        </AnimatePresence>
      </div>
      </motion.div>
    </div>
  );
  return (
    <div className="w-full max-w-2xl lg:max-w-6xl xl:max-w-7xl mx-auto p-4 lg:p-8 space-y-6 pb-24 touch-manipulation" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <AnimatePresence>
        {titleChangedNotice && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-safe left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 sm:max-w-md z-[9999] bg-blue-500 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-medium mx-auto"
            style={{ 
              top: 'max(1rem, env(safe-area-inset-top, 1rem))',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
              <span className="leading-relaxed">{titleChangedNotice}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 flex items-center justify-center gap-2 sm:gap-3">
          <FiActivity className="text-blue-500 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
          Focus Insights
        </h1>
        <p className="text-gray-600 text-base sm:text-lg lg:text-xl mt-2 sm:mt-3 font-medium">Track your productivity with precision</p>
            </motion.div>
      {renderTodayTab()}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
        className="fixed z-40"
        style={{ 
          bottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))',
          right: 'max(1.5rem, env(safe-area-inset-right, 1.5rem))'
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          onClick={() => setShowAddModal(true)}
          className="relative w-16 h-16 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-full cursor-pointer flex items-center justify-center overflow-hidden group transition-colors duration-200"
          style={{ 
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
            WebkitTapHighlightColor: 'transparent'
          }}
          aria-label="Add new focus session"
        >
          <FiPlus 
            className="w-8 h-8 text-white" 
            strokeWidth={2.5}
          />
        </motion.button>
      </motion.div>

      <Portal>
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-backdrop-overlay flex items-end sm:items-center justify-center p-0 sm:p-4 cursor-pointer"
              onClick={() => {
                setShowAddModal(false);
                setAddSessionError('');
                setConflictingSessionId(null);
                setTitleChangedNotice('');
              }}
            >
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm sm:w-full shadow-xl border border-gray-200 sm:border-white/20 max-h-[85vh] sm:max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex-shrink-0 p-6 pb-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Add Focus Session</h3>
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        setAddSessionError('');
                        setConflictingSessionId(null);
                        setTitleChangedNotice('');
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div ref={addModalScrollRef} className="flex-1 overflow-y-auto px-6">
                  <div className="space-y-5">
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">Session Title</label>
                    <input
                      type="text"
                      value={newSessionTitle}
                      onChange={(e) => setNewSessionTitle(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      placeholder="e.g., Deep Work Session"
                      autoFocus
                    />
                  </div>
                  <TimePicker
                    value={newSessionStartTime}
                    onChange={(time) => setNewSessionStartTime(time)}
                    label="Start Time"
                    isStartTime={true}
                    isAddModal={true}
                  />
                  <TimePicker
                    value={newSessionEndTime}
                    onChange={(time) => setNewSessionEndTime(time)}
                    label="End Time"
                    isStartTime={false}
                    isAddModal={true}
                  />
                  <DurationPicker
                    startTime={newSessionStartTime}
                    endTime={newSessionEndTime}
                    isAddModal={true}
                  />
                  {addSessionError && (
                    <div className="text-red-600 text-base bg-red-50 p-3 rounded-xl border border-red-200">
                      {addSessionError}
                  </div>
                  )}
                  </div>
                </div>
                <div className="flex-shrink-0 p-6 pt-4" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))' }}>
                  <div className="space-y-3">
                    <button
                      onClick={handleAddSession}
                      className="w-full px-6 py-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors font-semibold text-base"
                    >
                      Add Session
                    </button>
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        setAddSessionError('');
                        setConflictingSessionId(null);
                        setTitleChangedNotice('');
                      }}
                      className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors font-medium text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>

      <Portal>
        <AnimatePresence>
          {showEditModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-backdrop-overlay flex items-end sm:items-center justify-center p-0 sm:p-4 cursor-pointer"
              onClick={() => {
                setShowEditModal(false);
                setEditSessionError('');
                setConflictingSessionId(null);
                setTitleChangedNotice('');
              }}
            >
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm sm:w-full shadow-xl border border-gray-200 sm:border-white/20 max-h-[85vh] sm:max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex-shrink-0 p-6 pb-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Edit Focus Session</h3>
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div ref={editModalScrollRef} className="flex-1 overflow-y-auto px-6">
                  <div className="space-y-5">
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">Session Title</label>
                    <input
                      type="text"
                      value={editSessionTitle}
                      onChange={(e) => setEditSessionTitle(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      placeholder="e.g., Deep Work Session"
                      autoFocus
                    />
                  </div>
                  <TimePicker
                    value={editSessionStartTime}
                    onChange={(time) => setEditSessionStartTime(time)}
                    label="Start Time"
                    isStartTime={true}
                    isAddModal={false}
                  />
                  <TimePicker
                    value={editSessionEndTime}
                    onChange={(time) => setEditSessionEndTime(time)}
                    label="End Time"
                    isStartTime={false}
                    isAddModal={false}
                  />
                  <DurationPicker
                    startTime={editSessionStartTime}
                    endTime={editSessionEndTime}
                    isAddModal={false}
                  />
                  {editSessionError && (
                    <div className="text-red-600 text-base bg-red-50 p-3 rounded-xl border border-red-200">
                      {editSessionError}
                    </div>
                  )}
                  </div>
                </div>
                <div className="flex-shrink-0 p-6 pt-4" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))' }}>
                  <div className="space-y-3">
                    <button
                      onClick={handleSaveEdit}
                      className="w-full px-6 py-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors font-semibold text-base"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors font-medium text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </div>
  );
};
export default FocusInsightsWidget;
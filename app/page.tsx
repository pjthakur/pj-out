"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}
interface TranscriptLine {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  culturalNote?: string;
}
interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
}
interface Bookmark {
  lineId: string;
  text: string;
  timestamp: number;
}
interface QuizAnswer {
  questionIndex: number;
  selectedAnswer: number | null;
  isCorrect: boolean;
}
const LanguageLearningApp: React.FC = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [source, setSource] = useState<AudioBufferSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLine, setActiveLine] = useState<string | null>(null);
  const [heardLines, setHeardLines] = useState<Set<string>>(new Set());
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    if (showBookmarks && isMobile) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else if (!showBookmarks && isMobile) {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';
      if (scrollY) {
        requestAnimationFrame(() => {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        });
      }
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';
    };
  }, [showBookmarks]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    message: string;
    status: "correct" | "incorrect" | null;
  }>({
    message: "",
    status: null,
  });
  const [showSpeedDropdown, setShowSpeedDropdown] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const speedDropdownRef = useRef<HTMLDivElement>(null);
  const transcript: TranscriptLine[] = [
    { id: "1", startTime: 0, endTime: 2, text: "Hello." },
    { id: "2", startTime: 2, endTime: 4, text: "Hi." },
    { id: "3", startTime: 4, endTime: 6, text: "Been a while." },
    {
      id: "4",
      startTime: 6,
      endTime: 8,
      text: "You're back!",
      culturalNote:
        "This should be used when the person returns from a short absence.",
    },
    { id: "5", startTime: 8, endTime: 10, text: "Welcome." },
    { id: "6", startTime: 10, endTime: 14, text: "I'd recognize that face anywhere!" },
    {
      id: "7",
      startTime: 14,
      endTime: 17,
      text: "You've looked better.",
      culturalNote:
        "This greeting would be used when the other person doesn't look ok.",
    },
    { id: "8", startTime: 17, endTime: 19, text: "Greetings." },
    {
      id: "9",
      startTime: 19,
      endTime: 21,
      text: "Well howdy!",
      culturalNote:
        "The phrase 'howdy' is an informal greeting, from 'How do ye?'",
    },
    { id: "10", startTime: 21, endTime: 24, text: "Nice to meet you." },
    { id: "11", startTime: 24, endTime: 26, text: "Well hello there!" },
    {
      id: "12",
      startTime: 26,
      endTime: 29,
      text: "You must be the hero!",
      culturalNote:
        "This phrase would be used by a character in a video game.",
    },
    {
      id: "13",
      startTime: 29,
      endTime: 32,
      text: "It's a real honor to meet you.",
      culturalNote:
        "This greeting is a formal way to show respect.",
    },
    {
      id: "14",
      startTime: 32,
      endTime: 35,
      text: "Wow! It's really you!",
      culturalNote:
        "This phrase would be used when you are surprised to meet somebody.",
    }
  ];
  const quizzes: Quiz[] = [
    {
      question: "What greeting can be used to show respect?",
      options: ["Well howdy!", "It's a real honor to meet you.", "Hi."],
      correctAnswer: 1,
    },
    {
      question: "What greeting should be used when a person has returned after a short while?",
      options: ["You're back!", "Welcome.", "It's a real honor to meet you."],
      correctAnswer: 0,
    },
    {
      question: "Which greeting could be appropriate if the other person is ill?",
      options: ["You've looked better.", "Been a while.", "Wow! It's really you!"],
      correctAnswer: 0,
    }
  ];
  useEffect(() => {
    const context = new (window.AudioContext ||
      window.webkitAudioContext)();
    setAudioContext(context);
    const loadAudio = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://cdn.freesound.org/previews/731/731767_15857333-lq.mp3"
        );
        if (!response.ok) {
          throw new Error(`Failed to load audio: ${response.status} ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const decoded = await context.decodeAudioData(arrayBuffer);
        setAudioBuffer(decoded);
        setDuration(decoded.duration);
        setError(null);
      } catch (error) {
        console.error("Failed to load audio file:", error);
        setError("Failed to load audio. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    loadAudio();
    return () => {
      if (source) {
        source.stop();
      }
      if (seekTimeoutRef.current) {
        clearTimeout(seekTimeoutRef.current);
      }
      if (seekAnimationRef.current) {
        cancelAnimationFrame(seekAnimationRef.current);
      }
      context.close();
    };
  }, []);
  const lastUpdateTimeRef = useRef<number>(0);
  const lastActiveLineRef = useRef<string | null>(null);
  const seekTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const seekAnimationRef = useRef<number | null>(null);
  const updateTime = useCallback(() => {
    if (audioContext && isPlaying && !isSeeking) {
      const elapsed = audioContext.currentTime - startTimeRef.current;
      const currentPos = pauseTimeRef.current + elapsed * playbackRate;
      const now = Date.now();
      if (now - lastUpdateTimeRef.current > 100) {
        setCurrentTime(currentPos);
        lastUpdateTimeRef.current = now;
        if (progressBarRef.current && currentPos > 0) {
          const percentage = (currentPos / duration) * 100;
          progressBarRef.current.style.width = `${percentage}%`;
        }
      }
      const active = transcript.find(line =>
        currentPos >= line.startTime && currentPos < line.endTime
      );
      if (active && active.id !== lastActiveLineRef.current) {
        setActiveLine(active.id);
        setHeardLines(prev => {
          const newSet = new Set(prev);
          newSet.add(active.id);
          return newSet;
        });
        const lineElement = document.getElementById(`line-${active.id}`);
        if (lineElement) {
          lineElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }
        lastActiveLineRef.current = active.id;
      } else if (!active && lastActiveLineRef.current) {
        setActiveLine(null);
        lastActiveLineRef.current = null;
      }
      if (currentPos >= duration) {
        stopAudio();
        setShowQuiz(true);
      } else {
        animationFrameRef.current = requestAnimationFrame(updateTime);
      }
    }
  }, [audioContext, isPlaying, isSeeking, playbackRate, duration, transcript]);
  useEffect(() => {
    if (isPlaying) {
      updateTime();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (seekTimeoutRef.current) {
        clearTimeout(seekTimeoutRef.current);
      }
      if (seekAnimationRef.current) {
        cancelAnimationFrame(seekAnimationRef.current);
      }
    };
  }, [isPlaying, updateTime]);
  const playAudio = (startFrom: number = currentTime) => {
    if (audioContext && audioBuffer) {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      if (source) {
        source.stop();
      }
      const newSource = audioContext.createBufferSource();
      newSource.buffer = audioBuffer;
      newSource.playbackRate.value = playbackRate;
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 1.0;
      newSource.connect(gainNode);
      gainNode.connect(audioContext.destination);
      const offset = Math.min(startFrom, duration - 0.1);
      setCurrentTime(offset);
      if (progressBarRef.current) {
        const percentage = (offset / duration) * 100;
        progressBarRef.current.style.width = `${percentage}%`;
      }
      newSource.start(0, offset);
      newSource.onended = () => {
        if (Math.abs(currentTime - duration) < 0.5) {
          stopAudio();
          setShowQuiz(true);
        }
      };
      setSource(newSource);
      setIsPlaying(true);
      startTimeRef.current = audioContext.currentTime;
      pauseTimeRef.current = offset;
    }
  };
  const pauseAudio = () => {
    if (!audioContext || !isPlaying) return;
    const elapsed = audioContext.currentTime - startTimeRef.current;
    const exactCurrentTime = pauseTimeRef.current + elapsed * playbackRate;
    if (source) {
      source.stop();
      setSource(null);
    }
    setIsPlaying(false);
    setCurrentTime(exactCurrentTime);
    pauseTimeRef.current = exactCurrentTime;
    if (progressBarRef.current) {
      const percentage = (exactCurrentTime / duration) * 100;
      progressBarRef.current.style.width = `${percentage}%`;
    }
  };
  const stopAudio = () => {
    pauseAudio();
    setCurrentTime(0);
    pauseTimeRef.current = 0;
    setActiveLine(null);
  };
  const seekTo = (time: number) => {
    const targetTime = Math.min(Math.max(time, 0), duration);
    const wasPlaying = isPlaying;
    if (isPlaying && source) {
      source.stop();
      setSource(null);
      setIsPlaying(false);
    }
    requestAnimationFrame(() => {
      setCurrentTime(targetTime);
      pauseTimeRef.current = targetTime;
      if (progressBarRef.current) {
        const percentage = (targetTime / duration) * 100;
        progressBarRef.current.style.width = `${percentage}%`;
      }
      if (wasPlaying) {
        playAudio(targetTime);
      }
    });
  };
  const handleLineClick = (line: TranscriptLine) => {
    seekTo(line.startTime);
    if (!isPlaying) {
      playAudio(line.startTime);
    }
  };
  const toggleBookmark = (line: TranscriptLine) => {
    const exists = bookmarks.find(b => b.lineId === line.id);
    if (exists) {
      setBookmarks(bookmarks.filter(b => b.lineId !== line.id));
    } else {
      setBookmarks([...bookmarks, {
        lineId: line.id,
        text: line.text,
        timestamp: line.startTime
      }]);
    }
  };
  const handleBookmarkClick = (bookmark: Bookmark) => {
    setShowBookmarks(false);
    seekTo(bookmark.timestamp);
    if (!isPlaying) {
      playAudio(bookmark.timestamp);
    }
  };
  const handleQuizAnswer = () => {
    const selectedAnswer = quizAnswers[currentQuizIndex]?.selectedAnswer;
    if (selectedAnswer === null || selectedAnswer === undefined) return;
    const currentQuiz = quizzes[currentQuizIndex];
    const isCorrect = selectedAnswer === currentQuiz.correctAnswer;
    const updatedAnswers = [...quizAnswers];
    updatedAnswers[currentQuizIndex] = {
      questionIndex: currentQuizIndex,
      selectedAnswer,
      isCorrect
    };
    setQuizAnswers(updatedAnswers);
    setQuizResult({
      message: isCorrect
        ? "Correct! Great job!"
        : `Not quite. The correct answer is: ${currentQuiz.options[currentQuiz.correctAnswer]}`,
      status: isCorrect ? "correct" : "incorrect",
    });
  };
  const goToNextQuestion = () => {
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setQuizResult({ message: "", status: null });
    } else {
      setShowQuizResults(true);
    }
  };
  const goToPreviousQuestion = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
      const prevAnswer = quizAnswers[currentQuizIndex - 1];
      if (prevAnswer) {
        setQuizResult({
          message: prevAnswer.isCorrect
            ? "Correct! Great job!"
            : `Not quite. The correct answer is: ${quizzes[currentQuizIndex - 1].options[quizzes[currentQuizIndex - 1].correctAnswer]}`,
          status: prevAnswer.isCorrect ? "correct" : "incorrect",
        });
      } else {
        setQuizResult({ message: "", status: null });
      }
    }
  };
  const resetQuiz = () => {
    setShowQuiz(false);
    setShowQuizResults(false);
    setCurrentQuizIndex(0);
    setQuizAnswers([]);
    setQuizResult({ message: "", status: null });
    stopAudio();
  };
  const calculateQuizScore = () => {
    const correctAnswers = quizAnswers.filter(answer => answer.isCorrect).length;
    return {
      score: correctAnswers,
      total: quizzes.length,
      percentage: Math.round((correctAnswers / quizzes.length) * 100)
    };
  };
  useEffect(() => {
    if (showQuiz) {
      setQuizAnswers(quizzes.map((_, index) => ({
        questionIndex: index,
        selectedAnswer: null,
        isCorrect: false
      })));
    }
  }, [showQuiz]);
  useEffect(() => {
    if (showQuiz) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [showQuiz]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (speedDropdownRef.current && !speedDropdownRef.current.contains(event.target as Node)) {
        setShowSpeedDropdown(false);
      }
    };
    if (showSpeedDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showSpeedDropdown]);
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-['Poppins',system-ui,-apple-system,sans-serif] relative overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-4 w-96 h-96 bg-gradient-to-br from-indigo-400/15 to-pink-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 right-1/3 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
              {!isLoading && (
          <header className={`fixed top-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-2xl border-b border-white/20 transition-all duration-300 ${showQuiz ? 'blur-sm' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12l2 2 4-4" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent truncate">
                    Learning Greetings
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium hidden sm:block">Interactive Language Learning</p>
                </div>
              </div>
              <button
                          onClick={() => setShowBookmarks(!showBookmarks)}
              className="group relative inline-flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs sm:text-sm font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 flex-shrink-0 cursor-pointer"
            >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                <span className="relative z-10 hidden sm:inline">Bookmarks</span>
                <span className="relative z-10 sm:hidden">({bookmarks.length})</span>
                <span className="relative z-10 hidden sm:inline">({bookmarks.length})</span>
              </button>
            </div>
          </div>
        </header>
      )}
      <div className={`max-w-7xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8 ${isLoading ? 'pt-0' : 'pt-20 sm:pt-24'} pb-4 sm:pb-8 transition-all duration-300 ${showQuiz ? 'blur-sm' : ''}`}>
        <div className="w-full">
          <div className="w-full">
            {isLoading && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] py-16 sm:py-32">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
                  <div className="absolute top-2 left-2 w-12 h-12 border-4 border-transparent border-t-purple-500 rounded-full animate-spin animate-reverse"></div>
                </div>
                <div className="mt-8 text-center max-w-md mx-auto px-4">
                  <p className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Loading Audio Experience
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base">Preparing your interactive lesson...</p>
                </div>
              </div>
            )}
            {error && (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="relative bg-white/80 backdrop-blur-xl border border-red-200/50 rounded-3xl p-8 text-center max-w-md shadow-2xl shadow-red-500/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-orange-50/50 rounded-3xl"></div>
                  <div className="relative z-10">
                                          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Audio Loading Failed</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                                             className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                     >
                      <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="relative z-10">Try Again</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            {!isLoading && !error && (
              <div className="space-y-3 sm:space-y-4 pb-32 sm:pb-40">
                {transcript.map((line, index) => {
                  const isActive = activeLine === line.id;
                  const hasBeenHeard = heardLines.has(line.id);
                  const isBookmarked = bookmarks.some((b) => b.lineId === line.id);
                  return (
                    <div
                      key={line.id}
                      id={`line-${line.id}`}
                      className={`
                         group relative bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-white/30 overflow-hidden 
                         transition-all duration-500 active:scale-95 sm:hover:scale-[1.02] hover:bg-white/95
                                                    ${isActive ? "bg-white/95 border-blue-500/40 scale-[1.02]" : ""}
                         ${isActive ? "ring-2 ring-blue-500/20" : ""}
                       `}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {isActive && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 animate-pulse"></div>
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full shadow-lg"></div>
                        </>
                      )}
                      <div
                        className="relative z-10 flex items-center justify-between p-4 sm:p-6 cursor-pointer touch-manipulation"
                        onClick={() => handleLineClick(line)}
                      >
                        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                          <div className="flex-shrink-0 relative">
                            <div className={`
                               w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all duration-500 shadow-lg
                               ${isActive
                                ? "bg-gradient-to-r from-blue-500 to-purple-600 shadow-blue-500/50 animate-pulse-glow"
                                : hasBeenHeard
                                  ? "bg-gradient-to-r from-green-400 to-blue-500 shadow-green-400/30"
                                  : "bg-gradient-to-r from-gray-300 to-gray-400 group-hover:from-blue-400 group-hover:to-purple-500"
                              }
                             `}>
                              {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-75"></div>
                              )}
                            </div>
                            {hasBeenHeard && !isActive && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white shadow-sm"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={`
                               block text-base sm:text-lg font-medium transition-all duration-300 
                               ${isActive
                                ? "text-gray-900 font-semibold"
                                : "text-gray-700 group-hover:text-gray-900"
                              }
                             `}>
                              {line.text}
                            </span>
                            <div className="mt-1 sm:hidden">
                              <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <span>#{index + 1}</span>
                                {hasBeenHeard && (
                                  <>
                                    <span>•</span>
                                    <span className="text-green-600 font-medium">Heard</span>
                                  </>
                                )}
                                {isBookmarked && (
                                  <>
                                    <span>•</span>
                                    <span className="text-blue-600 font-medium flex items-center">
                                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                                      </svg>
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          className={`
                             group/btn relative p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 transform active:scale-95 sm:hover:scale-110 flex-shrink-0 cursor-pointer
                             ${isBookmarked
                              ? "text-blue-600 bg-blue-50/80 shadow-lg shadow-blue-500/20 border border-blue-200/50"
                              : "text-gray-400 hover:text-blue-500 hover:bg-blue-50/80 border border-transparent hover:border-blue-200/50"
                            }
                    `}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(line);
                          }}
                        >
                          {isBookmarked && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-xl sm:rounded-2xl blur-sm"></div>
                          )}
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 relative z-10 transition-transform group-active/btn:scale-110" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                          </svg>
                        </button>
                      </div>
                      {line.culturalNote && hasBeenHeard && (
                        <div className="px-6 pb-6">
                          <div className="relative bg-gradient-to-br from-amber-50/80 to-orange-50/80 backdrop-blur-sm border border-amber-200/50 rounded-2xl p-4 shadow-lg shadow-amber-500/10">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 to-orange-100/20 rounded-2xl"></div>
                            <div className="relative z-10 flex gap-3">
                                                              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-amber-900 mb-1">Cultural Context</p>
                                <p className="text-sm text-amber-800 leading-relaxed">{line.culturalNote}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {showBookmarks && (
          <div className="hidden lg:block fixed top-28 right-4 w-[28rem] xl:w-[32rem] z-40">
            <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/40 p-6 animate-slide-in-right">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-purple-50/80 rounded-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent truncate">Bookmarks</h3>
                  </div>
                  <button
                    onClick={() => setShowBookmarks(false)}
                    className="group p-2 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-white/80 transition-all duration-300 cursor-pointer flex-shrink-0"
                  >
                    <svg className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden overscroll-contain">
                  {bookmarks.length === 0 ? (
                    <div className="text-center py-12">
                                              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 font-medium mb-1">No bookmarks yet</p>
                      <p className="text-gray-500 text-sm">Tap the bookmark icon to save your favorite phrases</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookmarks.map((bookmark, index) => (
                        <div
                          key={bookmark.lineId}
                          onClick={() => handleBookmarkClick(bookmark)}
                          className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 cursor-pointer hover:bg-white/95 transition-all duration-300 border border-white/50 hover:scale-[1.02]"
                        >
                          <div className="flex items-start justify-between min-w-0">
                            <div className="flex-1 min-w-0 pr-3">
                              <p className="text-sm font-medium text-gray-900 mb-2 group-hover:text-blue-800 transition-colors break-words">{bookmark.text}</p>
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                <span className="whitespace-nowrap">{formatTime(bookmark.timestamp)}</span>
                              </div>
                            </div>
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex-shrink-0"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {showBookmarks && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center p-0">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowBookmarks(false)}
          ></div>
          <div
                         className="relative w-full max-h-[80vh] bg-white/98 backdrop-blur-3xl rounded-t-3xl transform transition-all duration-500 ease-out animate-slide-up border-t-2 border-white/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-blue-50/60 to-purple-50/60 rounded-t-3xl"></div>
            <div className="relative z-10 flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/20">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                  </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent truncate">Your Bookmarks</h3>
              </div>
              <button
                onClick={() => setShowBookmarks(false)}
                className="group p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100/50 transition-all duration-300 touch-manipulation cursor-pointer flex-shrink-0"
              >
                <svg className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative z-10 p-6 overflow-y-auto overflow-x-hidden max-h-[60vh] overscroll-contain">
              {bookmarks.length === 0 ? (
                <div className="text-center py-12">
                                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">No bookmarks yet</h4>
                  <div className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto text-center space-y-1">
                    <p>Tap the bookmark icon next to any phrase</p>
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                      <span>to save it here for quick access</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookmarks.map((bookmark, index) => (
                    <div
                      key={bookmark.lineId}
                      onClick={() => handleBookmarkClick(bookmark)}
                                             className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-4 cursor-pointer active:scale-95 transition-all duration-300 hover:bg-white/98 border border-white/60 touch-manipulation"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start space-x-4 min-w-0">
                        <div className="flex-shrink-0">
                                                     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="text-base font-semibold text-gray-900 mb-2 group-hover:text-blue-800 transition-colors leading-tight break-words">
                            "{bookmark.text}"
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-1 sm:space-y-0 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              <span className="font-medium whitespace-nowrap">{formatTime(bookmark.timestamp)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span className="text-blue-600 font-medium whitespace-nowrap">Tap to play</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {!isLoading && !error && (
        <div
          ref={audioPlayerRef}
                      className={`fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-3xl border-t border-white/30 z-30 transition-all duration-300 ${showQuiz ? 'blur-sm' : ''}`}
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-blue-50/40 via-purple-50/20 to-transparent"></div>
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/60 to-transparent"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div
              className="group relative h-2 sm:h-2.5 bg-white/40 backdrop-blur-sm rounded-full mb-4 sm:mb-5 cursor-pointer touch-manipulation border border-white/30"
              onClick={(e) => {
                e.preventDefault();
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = Math.max(0, Math.min(clickX / rect.width, 1));
                const newTime = percentage * duration;
                if (progressBarRef.current) {
                  progressBarRef.current.style.width = `${percentage * 100}%`;
                }
                seekTo(newTime);
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-full blur-sm"></div>
              <div
                ref={progressBarRef}
                className="absolute h-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-full transition-all duration-300 shadow-lg"
                style={{
                  width: `${(currentTime / duration) * 100}%`,
                }}
              />
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => {
                  if (!isSeeking) {
                    seekTo(parseFloat((e.target as HTMLInputElement).value));
                  }
                }}
                onInput={(e) => {
                  if (!isSeeking) {
                    setIsSeeking(true);
                  }
                  const newTime = parseFloat((e.target as HTMLInputElement).value);
                  if (seekAnimationRef.current) {
                    cancelAnimationFrame(seekAnimationRef.current);
                  }
                  seekAnimationRef.current = requestAnimationFrame(() => {
                    setCurrentTime(newTime);
                    pauseTimeRef.current = newTime;
                    if (progressBarRef.current) {
                      const percentage = (newTime / duration) * 100;
                      progressBarRef.current.style.width = `${percentage}%`;
                    }
                  });
                  if (isPlaying && source) {
                    if (seekTimeoutRef.current) {
                      clearTimeout(seekTimeoutRef.current);
                    }
                    seekTimeoutRef.current = setTimeout(() => {
                      if (source) {
                        source.stop();
                        setSource(null);
                        playAudio(newTime);
                      }
                    }, 8);
                  }
                }}
                onMouseDown={() => {
                  setIsSeeking(true);
                }}
                onMouseUp={(e) => {
                  const finalTime = parseFloat((e.target as HTMLInputElement).value);
                  if (seekAnimationRef.current) {
                    cancelAnimationFrame(seekAnimationRef.current);
                  }
                  if (seekTimeoutRef.current) {
                    clearTimeout(seekTimeoutRef.current);
                  }
                  seekTo(finalTime);
                  setIsSeeking(false);
                }}
                onTouchStart={() => {
                  setIsSeeking(true);
                }}
                onTouchEnd={(e) => {
                  const finalTime = parseFloat((e.target as HTMLInputElement).value);
                  if (seekAnimationRef.current) {
                    cancelAnimationFrame(seekAnimationRef.current);
                  }
                  if (seekTimeoutRef.current) {
                    clearTimeout(seekTimeoutRef.current);
                  }
                  seekTo(finalTime);
                  setIsSeeking(false);
                }}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer touch-manipulation z-10"
              />
            </div>
            <div className="flex items-center justify-between gap-2 sm:gap-6">
                              <div className="bg-white/50 backdrop-blur-xl rounded-xl px-3 sm:px-4 py-2.5 border border-white/30">
                <div className="flex items-center space-x-2 text-sm font-mono">
                  <span className="font-bold text-gray-900">{formatTime(currentTime)}</span>
                  <span className="text-gray-400 font-medium">/</span>
                  <span className="text-gray-600">{formatTime(duration)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={stopAudio}
                                      className="group p-2.5 sm:p-3.5 bg-white/60 backdrop-blur-xl text-gray-600 hover:text-blue-600 rounded-xl border border-white/30 hover:bg-blue-50/80 hover:border-blue-200/50 transition-all duration-300 active:scale-95 touch-manipulation cursor-pointer"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button
                  onClick={() => (isPlaying ? pauseAudio() : playAudio())}
                  className="group relative p-3.5 sm:p-4.5 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl transition-all duration-300 active:scale-95 touch-manipulation overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  <div className="relative z-10">
                    {isPlaying ? (
                      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  {isPlaying && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl animate-ping opacity-25"></div>
                  )}
                </button>
                <div ref={speedDropdownRef} className="relative group">
                  <button
                    onClick={() => setShowSpeedDropdown(!showSpeedDropdown)}
                                  className="appearance-none bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl px-2.5 sm:px-3 py-3 pr-7 sm:pr-8 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/60 hover:bg-white/90 hover:border-blue-300/50 transition-all duration-300 cursor-pointer touch-manipulation w-[68px] sm:w-[76px] sm:min-w-[76px] flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.9) 100%)',
                backdropFilter: 'blur(20px)',
              }}
                  >
                    {playbackRate}x
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-purple-50/10 to-transparent rounded-xl pointer-events-none"></div>
                  <div className="absolute right-1 sm:right-1.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white/60 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                      <svg className={`w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-600 group-hover:text-blue-600 transition-all duration-300 ${showSpeedDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {showSpeedDropdown && (
                                          <div className="absolute bottom-full right-0 mb-2 w-[68px] sm:w-[76px] bg-white/95 backdrop-blur-3xl border border-white/40 rounded-2xl z-50 overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
                          backdropFilter: 'blur(25px)',
                        }}>
                      {[0.5, 0.75, 1, 1.25, 1.5].map((rate, index) => (
                        <button
                          key={rate}
                          onClick={() => {
                            setPlaybackRate(rate);
                            if (source) {
                              source.playbackRate.value = rate;
                            }
                            setShowSpeedDropdown(false);
                          }}
                          className={`w-full px-3 sm:px-4 py-3 text-sm font-semibold text-center sm:text-left transition-all duration-200 hover:bg-blue-50/80 hover:text-blue-800 active:scale-95 touch-manipulation cursor-pointer ${playbackRate === rate
                              ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/10 text-blue-800 font-bold'
                              : 'text-gray-700 hover:bg-blue-50/60'
                            } ${index === 0 ? 'rounded-t-2xl' : ''} ${index === 4 ? 'rounded-b-2xl' : ''}`}
                          style={{
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          <div className="flex items-center justify-center sm:justify-between">
                            <span>{rate}x</span>
                            {playbackRate === rate && (
                              <svg className="w-3 h-3 text-blue-600 ml-1 sm:ml-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showQuiz && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 lg:p-6">
          <div className="relative bg-white/95 backdrop-blur-3xl rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-lg lg:max-w-2xl xl:max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-white/30"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.15), 0 10px 30px rgba(59, 130, 246, 0.1)'
            }}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-purple-50/20 to-transparent rounded-2xl sm:rounded-3xl"></div>
            {!showQuizResults ? (
              <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-5 gap-3 sm:gap-0">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent truncate">Quiz Time</h2>
                      <p className="text-sm sm:text-base text-gray-600 font-medium">Test your knowledge</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-3 sm:gap-4">
                                          <div className="bg-white/60 backdrop-blur-xl rounded-lg sm:rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 border border-white/40 flex-shrink-0 w-fit">
                      <span className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                        Question {currentQuizIndex + 1} of {quizzes.length}
                      </span>
                    </div>
                    <button
                      onClick={resetQuiz}
                                              className="group p-2 text-gray-500 hover:text-gray-700 bg-white/60 backdrop-blur-xl rounded-lg sm:rounded-xl border border-white/40 hover:bg-white/80 transition-all duration-300 flex-shrink-0 cursor-pointer"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="sm:hidden bg-white/60 backdrop-blur-xl rounded-lg px-3 py-1.5 border border-white/40 flex-shrink-0 w-fit">
                    <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                      Question {currentQuizIndex + 1} of {quizzes.length}
                    </span>
                  </div>
                </div>
                <button
                  onClick={resetQuiz}
                                      className="absolute top-4 right-4 sm:hidden z-20 group p-2 text-gray-500 hover:text-gray-700 bg-white/60 backdrop-blur-xl rounded-lg border border-white/40 hover:bg-white/80 transition-all duration-300 cursor-pointer"
                >
                  <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="relative h-2 sm:h-3 bg-white/40 backdrop-blur-sm rounded-full mb-4 sm:mb-5 border border-white/30">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-full blur-sm"></div>
                  <div
                    className="relative h-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-full transition-all duration-500 shadow-lg"
                                      style={{
                    width: `${((currentQuizIndex + 1) / quizzes.length) * 100}%`,
                  }}
                  />
                </div>
                <div className="mb-5 sm:mb-6">
                  <div className="bg-white/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/40 mb-4 sm:mb-5">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-relaxed">{quizzes[currentQuizIndex].question}</h3>
                  </div>
                  <div className="space-y-2.5 sm:space-y-3">
                    {quizzes[currentQuizIndex].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          const newAnswers = [...quizAnswers];
                          newAnswers[currentQuizIndex] = {
                            ...newAnswers[currentQuizIndex],
                            selectedAnswer: index
                          };
                          setQuizAnswers(newAnswers);
                        }}
                        disabled={quizResult.status !== null}
                                                  className={`
                            group relative w-full p-4 sm:p-5 text-left rounded-xl sm:rounded-2xl border-2 transition-all duration-300 backdrop-blur-xl touch-manipulation
                          ${quizAnswers[currentQuizIndex]?.selectedAnswer === index
                                                          ? "border-blue-500/60 bg-blue-50/80 text-blue-900"
                            : "border-white/40 bg-white/60 hover:border-blue-300/60 hover:bg-white/80 text-gray-800"
                          }
                          ${quizResult.status !== null ? "opacity-70 cursor-not-allowed" : "hover:opacity-90 cursor-pointer"}
                        `}
                      >
                        <div className={`
                          absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 transition-all duration-300
                          ${quizAnswers[currentQuizIndex]?.selectedAnswer === index
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300 group-hover:border-blue-400"
                          }
                        `}>
                          {quizAnswers[currentQuizIndex]?.selectedAnswer === index && (
                            <div className="absolute inset-0.5 sm:inset-1 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="pl-7 sm:pl-8 font-medium text-sm sm:text-base leading-relaxed">{option}</div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  {quizResult.status && (
                    <div className={`
                      p-3 sm:p-4 backdrop-blur-xl rounded-lg sm:rounded-xl border transition-all duration-300 animate-fade-in
                      ${quizResult.status === "correct"
                        ? "bg-green-50/80 border-green-200/60"
                        : "bg-red-50/80 border-red-200/60"}
                    `}>
                      <div className="flex items-center space-x-3">
                        <div className={`
                          w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center flex-shrink-0
                          ${quizResult.status === "correct"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"}
                        `}>
                          {quizResult.status === "correct" ? (
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm sm:text-base font-medium leading-tight ${quizResult.status === "correct" ? "text-green-800" : "text-red-800"
                            }`}>
                            {quizResult.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={goToPreviousQuestion}
                        disabled={currentQuizIndex === 0}
                        className={`
                          px-3 py-2 bg-white/60 backdrop-blur-xl border border-white/40 rounded-lg font-medium transition-all duration-300 touch-manipulation text-sm
                        ${currentQuizIndex === 0
                            ? "opacity-50 cursor-not-allowed text-gray-400"
                            : "text-gray-700 hover:bg-white/80 cursor-pointer"}
                      `}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      {currentQuizIndex < quizzes.length - 1 && (
                        <button
                          onClick={() => {
                            const updatedAnswers = [...quizAnswers];
                            updatedAnswers[currentQuizIndex] = {
                              questionIndex: currentQuizIndex,
                              selectedAnswer: null,
                              isCorrect: false
                            };
                            setQuizAnswers(updatedAnswers);
                            setCurrentQuizIndex(currentQuizIndex + 1);
                            setQuizResult({ message: "", status: null });
                          }}
                          className="px-3 py-2 text-gray-500 hover:text-gray-700 bg-white/60 backdrop-blur-xl border border-white/40 hover:bg-white/80 rounded-lg font-medium transition-all duration-300 text-sm touch-manipulation cursor-pointer"
                        >
                          Skip
                        </button>
                      )}
                    </div>
                    <div className="flex-1 flex justify-end">
                      {quizResult.status === null ? (
                        <button
                          onClick={handleQuizAnswer}
                          disabled={quizAnswers[currentQuizIndex]?.selectedAnswer === null}
                          className={`
                            group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold transition-all duration-300 overflow-hidden touch-manipulation text-sm
                            ${quizAnswers[currentQuizIndex]?.selectedAnswer === null
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:from-blue-700 hover:to-purple-700 cursor-pointer"}
                          `}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <span className="relative z-10">Check Answer</span>
                        </button>
                      ) : (
                        <button
                          onClick={goToNextQuestion}
                          className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-300 overflow-hidden touch-manipulation text-sm cursor-pointer"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative z-10 flex items-center space-x-1.5">
                            <span>{currentQuizIndex < quizzes.length - 1 ? "Next" : "Results"}</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                <div className="relative mb-4 sm:mb-6">
                  <button
                    onClick={resetQuiz}
                    className="absolute top-0 right-0 z-10 group p-2 text-gray-500 hover:text-gray-700 bg-white/60 backdrop-blur-xl rounded-lg sm:rounded-xl border border-white/40 hover:bg-white/80 transition-all duration-300 cursor-pointer"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="flex items-center space-x-3 sm:space-x-4 pr-12 sm:pr-16">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent truncate">Quiz Results</h2>
                      <p className="text-sm sm:text-base text-gray-600 font-medium">Your performance summary</p>
                    </div>
                  </div>
                </div>
                {(() => {
                  const { score, total, percentage } = calculateQuizScore();
                  return (
                    <div className="bg-white/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/40 shadow-lg mb-4 sm:mb-6">
                      <div className="text-center">
                        <div className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3">{percentage}%</div>
                        <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-2 sm:mb-4 font-semibold">
                          You scored {score} out of {total}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm sm:text-base text-gray-600 font-medium">
                          {percentage >= 80 ? (
                            <>
                              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>Excellent work!</span>
                            </>
                          ) : percentage >= 60 ? (
                            <>
                              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>Good job!</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              <span>Keep practicing!</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <div className="bg-white/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/40">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Review Your Answers
                    </h3>
                  </div>
                  {quizAnswers.map((answer, index) => (
                    <div
                      key={index}
                      className={`relative bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 transition-all duration-300 ${answer.isCorrect
                          ? 'border-green-200/60 bg-green-50/80'
                          : 'border-red-200/60 bg-red-50/80'
                        }`}
                    >
                      <div className="flex gap-3 sm:gap-4">
                        <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${answer.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                          }`}>
                          <span className="text-lg sm:text-xl font-bold">
                            {answer.isCorrect ? '✓' : '✗'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base leading-relaxed">{quizzes[index].question}</p>
                          {answer.selectedAnswer !== null ? (
                            <div className="space-y-1 sm:space-y-2">
                              <p className="text-xs sm:text-sm">
                                <span className="text-gray-600 font-medium">Your answer: </span>
                                <span className={`font-semibold ${answer.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                  {quizzes[index].options[answer.selectedAnswer]}
                                </span>
                              </p>
                              {!answer.isCorrect && (
                                <p className="text-xs sm:text-sm">
                                  <span className="text-gray-600 font-medium">Correct answer: </span>
                                  <span className="text-green-700 font-semibold">
                                    {quizzes[index].options[quizzes[index].correctAnswer]}
                                  </span>
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-1 sm:space-y-2">
                              <p className="text-xs sm:text-sm">
                                <span className="text-gray-600 font-medium">Your answer: </span>
                                <span className="text-gray-500 font-semibold italic">Skipped</span>
                              </p>
                              <p className="text-xs sm:text-sm">
                                <span className="text-gray-600 font-medium">Correct answer: </span>
                                <span className="text-green-700 font-semibold">
                                  {quizzes[index].options[quizzes[index].correctAnswer]}
                                </span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={resetQuiz}
                    className="flex-1 px-4 sm:px-6 py-3 sm:py-3 bg-white/60 backdrop-blur-xl border border-white/40 text-gray-700 rounded-xl font-semibold hover:bg-white/80 hover:border-gray-300/60 transition-all duration-300 touch-manipulation text-sm sm:text-base cursor-pointer"
                  >
                    Exit Quiz
                  </button>
                  <button
                    onClick={() => {
                      setShowQuizResults(false);
                      setCurrentQuizIndex(0);
                      setQuizAnswers(quizzes.map((_, index) => ({
                        questionIndex: index,
                        selectedAnswer: null,
                        isCorrect: false
                      })));
                      setQuizResult({ message: "", status: null });
                    }}
                    className="flex-1 px-4 sm:px-6 py-3 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 touch-manipulation text-sm sm:text-base cursor-pointer"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Try Again</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        html, body {
          padding: 0;
          margin: 0;
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;
          overflow-x: hidden;
        }
        * {
          box-sizing: border-box;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .animate-reverse {
          animation-direction: reverse;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .touch-manipulation {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        @keyframes mobile-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.95); }
        }
        .animate-mobile-bounce {
          animation: mobile-bounce 0.15s ease-in-out;
        }
        @keyframes slide-up {
          0% { 
            transform: translateY(100%); 
            opacity: 0;
          }
          100% { 
            transform: translateY(0); 
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slide-in-right {
          0% { 
            transform: translateX(100%); 
            opacity: 0;
          }
          100% { 
            transform: translateX(0); 
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
          background-clip: content-box;
        }
        select {
          background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%) !important;
          backdrop-filter: blur(25px) !important;
          border: 1px solid rgba(255,255,255,0.4) !important;
        }
                  select option {
            background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%) !important;
            backdrop-filter: blur(20px) !important;
            color: #374151 !important;
            font-weight: 600 !important;
            padding: 12px 16px !important;
            border-radius: 12px !important;
            margin: 4px 8px !important;
            border: 1px solid rgba(255,255,255,0.3) !important;
            transition: all 0.2s ease !important;
          }
                  select option:hover {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.08) 100%) !important;
            color: #1e40af !important;
            border-color: rgba(59, 130, 246, 0.3) !important;
            transform: translateY(-1px) !important;
          }
                  select option:checked,
          select option[selected] {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(147, 51, 234, 0.15) 100%) !important;
            color: #1e40af !important;
            font-weight: 700 !important;
            border-color: rgba(59, 130, 246, 0.4) !important;
          }
        select option:active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.1) 100%) !important;
          transform: translateY(0) !important;
        }
                  select:focus {
            outline: none !important;
            border-color: rgba(59, 130, 246, 0.5) !important;
          }
        @media (max-width: 640px) {
          select {
            transform: translateY(-2px);
            direction: rtl;
          }
          select option {
            direction: ltr;
            transform: translateY(-100%);
          }
        }
        select {
          position: relative;
        }
        @supports (-webkit-appearance: none) {
          @media (max-width: 640px) {
            select {
              -webkit-appearance: none;
              appearance: none;
              background-position: right 8px center;
              background-repeat: no-repeat;
            }
          }
        }
        .glass {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        .glass-dark {
          background: rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
      `}</style>
    </div>
  );
};
export default LanguageLearningApp;
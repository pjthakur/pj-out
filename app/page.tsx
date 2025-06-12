"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  HomeIcon,
  BookOpenIcon,
  ChartBarIcon,
  UserIcon,

  PlayIcon,
  MicrophoneIcon,
  CheckCircleIcon,
  TrophyIcon,
  FireIcon,
  StarIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  SpeakerWaveIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  CalendarIcon,
  BoltIcon,
  HeartIcon,
  GiftIcon,
  AcademicCapIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";
import {
  FireIcon as FireIconSolid,
  StarIcon as StarIconSolid,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";

// Types
interface SkillNode {
  id: string;
  name: string;
  completed: boolean;
  level: number;
  xp: number;
  maxXp: number;
  x: number;
  y: number;
  prerequisites: string[];
  category: "basics" | "grammar" | "vocabulary" | "conversation";
  color: string;
}

interface WeeklyData {
  day: string;
  date: string;
  xp: number;
  lessons: number;
  timeSpent: number;
  accuracy: number;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

interface UserStats {
  totalLessons: number;
  totalTimeSpent: number;
  averageAccuracy: number;
  longestStreak: number;
  skillsCompleted: number;
  practiceMinutesToday: number;
  weeklyGoal: number;
  monthlyXP: number;
}

  // Achievement icon renderer
  const renderAchievementIcon = (iconType: string, className: string = "w-5 h-5") => {
    switch (iconType) {
      case "target":
        return <BeakerIcon className={className} />;
      case "fire":
        return <FireIconSolid className={className} />;
      case "microphone":
        return <MicrophoneIcon className={className} />;
      case "star":
        return <StarIconSolid className={className} />;
      case "check-badge":
        return <CheckBadgeIcon className={className} />;
      case "bolt":
        return <BoltIcon className={className} />;
      default:
        return <StarIconSolid className={className} />;
    }
  };

const LinguaFlow: React.FC = () => {
  // Navigation state
  const [activeTab, setActiveTab] = useState("learn");

  // Progress states
  const [currentStreak, setCurrentStreak] = useState(23);
  const [totalXp, setTotalXp] = useState(3547);
  const [dailyGoal] = useState(300);
  const [todayXp, setTodayXp] = useState(89);
  const [weekIndex, setWeekIndex] = useState(0);

  // Interaction states
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [scrollY, setScrollY] = useState(0);

  // Canvas states
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [canvasReady, setCanvasReady] = useState(false);

  // Touch states
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const [isTouch, setIsTouch] = useState(false);

  // Swipe states
  const [swipeStart, setSwipeStart] = useState({ x: 0, y: 0 });
  const [swipeEnd, setSwipeEnd] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const speechRecognition = useRef<any>(null);
  const weeklyScrollRef = useRef<HTMLDivElement>(null);

  // User stats
  const [userStats, setUserStats] = useState<UserStats>({
    totalLessons: 47,
    totalTimeSpent: 1240, // minutes
    averageAccuracy: 87,
    longestStreak: 31,
    skillsCompleted: 2,
    practiceMinutesToday: 25,
    weeklyGoal: 5, // hours
    monthlyXP: 8250,
  });

  // Achievements system
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first_skill",
      name: "First Steps",
      description: "Complete your first skill",
      icon: "target",
      unlocked: true,
      progress: 1,
      maxProgress: 1,
    },
    {
      id: "week_streak",
      name: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: "fire",
      unlocked: true,
      progress: 7,
      maxProgress: 7,
    },
    {
      id: "pronunciation_master",
      name: "Pronunciation Pro",
      description: "Get 90%+ on 10 pronunciation exercises",
      icon: "microphone",
      unlocked: false,
      progress: 6,
      maxProgress: 10,
    },
    {
      id: "xp_milestone",
      name: "XP Collector",
      description: "Earn 5000 total XP",
      icon: "star",
      unlocked: false,
      progress: 3547,
      maxProgress: 5000,
    },
    {
      id: "perfect_week",
      name: "Perfect Week",
      description: "Complete daily goals for 7 consecutive days",
      icon: "check-badge",
      unlocked: false,
      progress: 4,
      maxProgress: 7,
    },
    {
      id: "speed_learner",
      name: "Speed Learner",
      description: "Complete 5 lessons in one day",
      icon: "bolt",
      unlocked: false,
      progress: 3,
      maxProgress: 5,
    },
  ]);

  // Weekly progress data (multiple weeks for swiping)
  const weeklyDataSets = useMemo(
    () => [
      // Current week
      [
        {
          day: "Mon",
          date: "12/2",
          xp: 120,
          lessons: 3,
          timeSpent: 45,
          accuracy: 85,
        },
        {
          day: "Tue",
          date: "12/3",
          xp: 95,
          lessons: 2,
          timeSpent: 30,
          accuracy: 92,
        },
        {
          day: "Wed",
          date: "12/4",
          xp: 180,
          lessons: 4,
          timeSpent: 60,
          accuracy: 88,
        },
        {
          day: "Thu",
          date: "12/5",
          xp: 140,
          lessons: 3,
          timeSpent: 50,
          accuracy: 90,
        },
        {
          day: "Fri",
          date: "12/6",
          xp: 160,
          lessons: 3,
          timeSpent: 55,
          accuracy: 87,
        },
        {
          day: "Sat",
          date: "12/7",
          xp: 200,
          lessons: 5,
          timeSpent: 75,
          accuracy: 94,
        },
        {
          day: "Sun",
          date: "12/8",
          xp: 89,
          lessons: 2,
          timeSpent: 35,
          accuracy: 89,
        },
      ],
      // Previous week
      [
        {
          day: "Mon",
          date: "11/25",
          xp: 100,
          lessons: 2,
          timeSpent: 40,
          accuracy: 83,
        },
        {
          day: "Tue",
          date: "11/26",
          xp: 130,
          lessons: 3,
          timeSpent: 45,
          accuracy: 86,
        },
        {
          day: "Wed",
          date: "11/27",
          xp: 150,
          lessons: 3,
          timeSpent: 50,
          accuracy: 91,
        },
        {
          day: "Thu",
          date: "11/28",
          xp: 80,
          lessons: 2,
          timeSpent: 25,
          accuracy: 85,
        },
        {
          day: "Fri",
          date: "11/29",
          xp: 170,
          lessons: 4,
          timeSpent: 65,
          accuracy: 88,
        },
        {
          day: "Sat",
          date: "11/30",
          xp: 190,
          lessons: 4,
          timeSpent: 70,
          accuracy: 92,
        },
        {
          day: "Sun",
          date: "12/1",
          xp: 110,
          lessons: 3,
          timeSpent: 40,
          accuracy: 87,
        },
      ],
      // Week before
      [
        {
          day: "Mon",
          date: "11/18",
          xp: 90,
          lessons: 2,
          timeSpent: 35,
          accuracy: 80,
        },
        {
          day: "Tue",
          date: "11/19",
          xp: 110,
          lessons: 2,
          timeSpent: 40,
          accuracy: 84,
        },
        {
          day: "Wed",
          date: "11/20",
          xp: 140,
          lessons: 3,
          timeSpent: 55,
          accuracy: 87,
        },
        {
          day: "Thu",
          date: "11/21",
          xp: 120,
          lessons: 3,
          timeSpent: 45,
          accuracy: 86,
        },
        {
          day: "Fri",
          date: "11/22",
          xp: 160,
          lessons: 4,
          timeSpent: 60,
          accuracy: 90,
        },
        {
          day: "Sat",
          date: "11/23",
          xp: 180,
          lessons: 4,
          timeSpent: 65,
          accuracy: 88,
        },
        {
          day: "Sun",
          date: "11/24",
          xp: 100,
          lessons: 2,
          timeSpent: 35,
          accuracy: 85,
        },
      ],
    ],
    []
  );

  // Skill tree data with responsive positioning
  const [skillNodes, setSkillNodes] = useState<SkillNode[]>([
    {
      id: "1",
      name: "Greetings",
      completed: true,
      level: 3,
      xp: 150,
      maxXp: 150,
      x: 50,
      y: 50,
      prerequisites: [],
      category: "basics",
      color: "#10b981",
    },
    {
      id: "2",
      name: "Numbers",
      completed: true,
      level: 2,
      xp: 120,
      maxXp: 120,
      x: 200,
      y: 50,
      prerequisites: ["1"],
      category: "basics",
      color: "#3b82f6",
    },
    {
      id: "3",
      name: "Colors",
      completed: false,
      level: 1,
      xp: 60,
      maxXp: 100,
      x: 350,
      y: 50,
      prerequisites: ["2"],
      category: "vocabulary",
      color: "#f59e0b",
    },
    {
      id: "4",
      name: "Family",
      completed: false,
      level: 1,
      xp: 30,
      maxXp: 120,
      x: 50,
      y: 180,
      prerequisites: ["1"],
      category: "vocabulary",
      color: "#ef4444",
    },
    {
      id: "5",
      name: "Present Tense",
      completed: false,
      level: 1,
      xp: 40,
      maxXp: 150,
      x: 200,
      y: 180,
      prerequisites: ["2", "4"],
      category: "grammar",
      color: "#8b5cf6",
    },
    {
      id: "6",
      name: "Food & Drinks",
      completed: false,
      level: 1,
      xp: 20,
      maxXp: 130,
      x: 350,
      y: 180,
      prerequisites: ["3"],
      category: "vocabulary",
      color: "#06b6d4",
    },
    {
      id: "7",
      name: "Shopping",
      completed: false,
      level: 1,
      xp: 0,
      maxXp: 140,
      x: 125,
      y: 310,
      prerequisites: ["5"],
      category: "conversation",
      color: "#84cc16",
    },
    {
      id: "8",
      name: "Directions",
      completed: false,
      level: 1,
      xp: 0,
      maxXp: 120,
      x: 275,
      y: 310,
      prerequisites: ["6"],
      category: "conversation",
      color: "#f97316",
    },
    {
      id: "9",
      name: "Past Tense",
      completed: false,
      level: 1,
      xp: 0,
      maxXp: 160,
      x: 200,
      y: 440,
      prerequisites: ["7", "8"],
      category: "grammar",
      color: "#ec4899",
    },
  ]);

  // Toast management
  const addToast = useCallback(
    (
      message: string,
      type: "success" | "error" | "info" | "warning" = "info"
    ) => {
      const id = Date.now().toString();
      const newToast: Toast = { id, message, type };
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );

  // Vibration feedback with enhanced patterns
  const vibrate = useCallback((pattern: number[] = [100]) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  // Scroll tracking for floating elements
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Canvas resize handling with proper responsive sizing
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const padding = window.innerWidth < 640 ? 16 : 32; // Smaller padding on mobile
        const availableWidth = rect.width - padding;

        // Responsive canvas sizing
        let width, height;
        if (window.innerWidth < 480) {
          // Very small screens (320px+)
          width = Math.min(availableWidth, 400);
          height = Math.min(width * 1.5, 480); // Taller aspect ratio for mobile
        } else if (window.innerWidth < 768) {
          // Mobile screens
          width = Math.min(availableWidth, 500);
          height = Math.min(width * 1, 500);
        } else {
          // Desktop screens
          width = Math.min(availableWidth, 1200);
          height = Math.min(width * 0.8, 560);
        }

        setCanvasSize({ width, height });

        // Only recenter when zoom is at 1 (reset) or canvas size changes significantly
        const allX = skillNodes.map((n) => n.x);
        const allY = skillNodes.map((n) => n.y);
        const minX = Math.min(...allX);
        const maxX = Math.max(...allX);
        const minY = Math.min(...allY);
        const maxY = Math.max(...allY);

        const treeWidth = maxX - minX + 100;
        const treeHeight = maxY - minY + 100;

        const offsetX = (width - treeWidth * zoomLevel) / 2 - minX * zoomLevel;
        const offsetY = (height - treeHeight * zoomLevel) / 2 - minY * zoomLevel;

        // Only update pan offset if zoom is 1 (reset) or if canvas isn't ready yet
        if (zoomLevel === 1 || !canvasReady) {
          setPanOffset({ x: offsetX, y: offsetY });
        }
        
        setCanvasReady(true);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    const timer = setTimeout(() => handleResize(), 200);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [skillNodes, zoomLevel, canvasReady]);

  // Voice recognition state
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [pronunciationScore, setPronunciationScore] = useState(0);
  const [practiceStreak, setPracticeStreak] = useState(0);
  const [voicePracticeStats, setVoicePracticeStats] = useState({
    totalAttempts: 12,
    averageScore: 78,
    bestScore: 95,
    practiceTime: 18, // minutes
  });

  // Practice phrases for pronunciation
  const practicePhrases = useMemo(
    () => [
      { spanish: "Hola", english: "Hello", difficulty: 1 },
      { spanish: "Buenos días", english: "Good morning", difficulty: 2 },
      { spanish: "¿Cómo estás?", english: "How are you?", difficulty: 3 },
      { spanish: "Me llamo María", english: "My name is María", difficulty: 3 },
      { spanish: "Mucho gusto", english: "Nice to meet you", difficulty: 2 },
      {
        spanish: "¿Dónde está el baño?",
        english: "Where is the bathroom?",
        difficulty: 4,
      },
      {
        spanish: "No hablo español muy bien",
        english: "I don't speak Spanish very well",
        difficulty: 5,
      },
    ],
    []
  );

  // Voice recognition setup
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      speechRecognition.current = new SpeechRecognition();
      speechRecognition.current.continuous = false;
      speechRecognition.current.interimResults = false;
      speechRecognition.current.lang = "es-ES";
      speechRecognition.current.maxAlternatives = 3;

      speechRecognition.current.onstart = () => {
        addToast(
          `Say: "${practicePhrases[currentPhraseIndex].spanish}"`,
          "info"
        );
      };

      speechRecognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        const confidence = event.results[0][0].confidence;
        const targetPhrase =
          practicePhrases[currentPhraseIndex].spanish.toLowerCase();

        const similarity = calculateSimilarity(transcript, targetPhrase);
        const finalScore = Math.round(
          (confidence * 0.6 + similarity * 0.4) * 100
        );

        setPronunciationScore(finalScore);

        // Update voice practice stats
        setVoicePracticeStats((prev) => ({
          ...prev,
          totalAttempts: prev.totalAttempts + 1,
          averageScore: Math.round(
            (prev.averageScore * prev.totalAttempts + finalScore) /
              (prev.totalAttempts + 1)
          ),
          bestScore: Math.max(prev.bestScore, finalScore),
          practiceTime: prev.practiceTime + 1,
        }));

        if (finalScore >= 80) {
          vibrate([100, 50, 100, 50, 200]);
          addToast(`Excellent! Score: ${finalScore}%`, "success");
          setPracticeStreak((prev) => prev + 1);
          setTotalXp((prev) => prev + 20);
          setTodayXp((prev) => prev + 20);

          setTimeout(() => {
            setCurrentPhraseIndex(
              (prev) => (prev + 1) % practicePhrases.length
            );
          }, 1500);
        } else if (finalScore >= 60) {
          vibrate([100, 50, 100]);
          addToast(
            `Good! Score: ${finalScore}% - Try again for better`,
            "success"
          );
          setTotalXp((prev) => prev + 10);
          setTodayXp((prev) => prev + 10);
          setPracticeStreak((prev) => Math.floor(prev / 2));
        } else {
          vibrate([200]);
          addToast(`Keep practicing! Score: ${finalScore}%`, "warning");
          setPracticeStreak(0);
        }

        setTimeout(() => {
          addToast(
            `Heard: "${transcript}" | Expected: "${targetPhrase}"`,
            "info"
          );
        }, 2000);
      };

      speechRecognition.current.onend = () => {
        setIsListening(false);
      };

      speechRecognition.current.onerror = (event: any) => {
        setIsListening(false);
        console.error("Speech recognition error:", event.error);

        switch (event.error) {
          case "no-speech":
            addToast("No speech detected. Try speaking louder!", "warning");
            break;
          case "network":
            addToast("Network error. Check your connection.", "error");
            break;
          case "not-allowed":
            addToast(
              "Microphone access denied. Please allow microphone.",
              "error"
            );
            break;
          default:
            addToast("Voice recognition error. Try again!", "error");
        }
        vibrate([300]);
      };
    }
  }, [addToast, vibrate, currentPhraseIndex, practicePhrases]);

  // Simple similarity calculation
  const calculateSimilarity = useCallback(
    (str1: string, str2: string): number => {
      const longer = str1.length > str2.length ? str1 : str2;
      const shorter = str1.length > str2.length ? str2 : str1;

      if (longer.length === 0) return 1.0;

      const editDistance = levenshteinDistance(longer, shorter);
      return (longer.length - editDistance) / longer.length;
    },
    []
  );

  // Levenshtein distance calculation
  const levenshteinDistance = useCallback(
    (str1: string, str2: string): number => {
      const matrix = [];

      for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
      }

      for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
      }

      for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
          if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
          }
        }
      }

      return matrix[str2.length][str1.length];
    },
    []
  );

  // Touch distance calculation for pinch-to-zoom
  const getTouchDistance = (touches: TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Get canvas coordinates accounting for zoom and pan
  const getCanvasCoordinates = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvasSize.width / rect.width;
      const scaleY = canvasSize.height / rect.height;

      const x = ((clientX - rect.left) * scaleX - panOffset.x) / zoomLevel;
      const y = ((clientY - rect.top) * scaleY - panOffset.y) / zoomLevel;

      return { x, y };
    },
    [canvasSize, panOffset, zoomLevel]
  );

  // Handle skill node interaction
  const handleSkillNodeInteraction = useCallback(
    (x: number, y: number) => {
      const clickedNode = skillNodes.find((node) => {
        const nodeRadius = 35;
        const distance = Math.sqrt(
          (x - (node.x + nodeRadius)) ** 2 + (y - (node.y + nodeRadius)) ** 2
        );
        return distance <= nodeRadius;
      });

      if (clickedNode) {
        setSelectedSkill(clickedNode.id);

        const prereqsMet = clickedNode.prerequisites.every(
          (prereqId) => skillNodes.find((n) => n.id === prereqId)?.completed
        );

        if (prereqsMet && !clickedNode.completed) {
          const practiceGain = 30;
          const newXp = Math.min(
            clickedNode.xp + practiceGain,
            clickedNode.maxXp
          );
          const isCompleted = newXp === clickedNode.maxXp;

          setSkillNodes((prev) =>
            prev.map((node) =>
              node.id === clickedNode.id
                ? {
                    ...node,
                    xp: newXp,
                    completed: isCompleted,
                    level: isCompleted ? node.level + 1 : node.level,
                  }
                : node
            )
          );

          setTotalXp((prev) => prev + practiceGain);
          setTodayXp((prev) => prev + practiceGain);
          setUserStats((prev) => ({
            ...prev,
            totalLessons: prev.totalLessons + 1,
            practiceMinutesToday: prev.practiceMinutesToday + 5,
          }));

          if (isCompleted) {
            vibrate([200, 100, 200, 100, 300]);
            addToast(`Skill Mastered: ${clickedNode.name}!`, "success");

            // Update achievements
            setAchievements((prev) =>
              prev.map((achievement) => {
                if (achievement.id === "first_skill" && !achievement.unlocked) {
                  return { ...achievement, unlocked: true, progress: 1 };
                }
                return achievement;
              })
            );

            const newlyUnlocked = skillNodes.filter(
              (node) =>
                !node.completed &&
                node.prerequisites.includes(clickedNode.id) &&
                node.prerequisites.every(
                  (prereqId) =>
                    skillNodes.find((n) => n.id === prereqId)?.completed ||
                    prereqId === clickedNode.id
                )
            );

            if (newlyUnlocked.length > 0) {
              setTimeout(() => {
                addToast(
                  `${newlyUnlocked.length} new skill${
                    newlyUnlocked.length > 1 ? "s" : ""
                  } unlocked!`,
                  "info"
                );
                vibrate([100, 50, 100]);
              }, 1000);
            }
          } else {
            vibrate([100]);
            const progressPercent = Math.round(
              (newXp / clickedNode.maxXp) * 100
            );
            addToast(
              `+${practiceGain} XP • ${clickedNode.name} (${progressPercent}%)`,
              "info"
            );
          }
        } else if (!prereqsMet) {
          vibrate([300, 150, 300]);
          const missingPrereqs = clickedNode.prerequisites.filter(
            (prereqId) => !skillNodes.find((n) => n.id === prereqId)?.completed
          );
          const prereqNames = missingPrereqs
            .map((id) => skillNodes.find((n) => n.id === id)?.name)
            .join(", ");
          addToast(`Complete "${prereqNames}" first!`, "warning");
        } else if (clickedNode.completed) {
          vibrate([50]);
          addToast(`${clickedNode.name} mastered! Try a new skill.`, "info");
        }
      }
    },
    [skillNodes, vibrate, addToast]
  );

  // Canvas drawing with proper scaling and responsive font sizes
  const drawSkillTree = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvasReady) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvasSize.width;
    const displayHeight = canvasSize.height;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    ctx.save();
    ctx.scale(zoomLevel, zoomLevel);
    ctx.translate(panOffset.x, panOffset.y);

    const time = Date.now() * 0.001;

    // Responsive sizing based on canvas size
    const isMobile = displayWidth < 500;
    const nodeRadius = isMobile ? 30 : 35;
    const fontSize = isMobile ? 10 : 12;
    const levelFontSize = isMobile ? 12 : 14;

    // Draw connections first
    skillNodes.forEach((node) => {
      node.prerequisites.forEach((prereqId) => {
        const prereq = skillNodes.find((n) => n.id === prereqId);
        if (prereq) {
          const isActive = prereq.completed;

          ctx.beginPath();
          ctx.moveTo(prereq.x + nodeRadius, prereq.y + nodeRadius);
          ctx.lineTo(node.x + nodeRadius, node.y + nodeRadius);
          ctx.strokeStyle = isActive ? prereq.color : "#e5e7eb";
          ctx.lineWidth = isMobile ? 2 : 3;
          ctx.stroke();

          if (isActive) {
            const progress = (time % 2) / 2;
            const x = prereq.x + nodeRadius + (node.x - prereq.x) * progress;
            const y = prereq.y + nodeRadius + (node.y - prereq.y) * progress;

            ctx.beginPath();
            ctx.arc(x, y, isMobile ? 3 : 4, 0, 2 * Math.PI);
            ctx.fillStyle = prereq.color;
            ctx.fill();
          }
        }
      });
    });

    // Draw skill nodes
    skillNodes.forEach((node) => {
      const centerX = node.x + nodeRadius;
      const centerY = node.y + nodeRadius;

      // Shadow
      ctx.beginPath();
      ctx.arc(centerX + 2, centerY + 2, nodeRadius, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fill();

      // Node background
      ctx.beginPath();
      ctx.arc(centerX, centerY, nodeRadius, 0, 2 * Math.PI);
      ctx.fillStyle = node.completed
        ? node.color
        : node.xp > 0
        ? "#f3f4f6"
        : "#e5e7eb";
      ctx.fill();

      // Node border
      ctx.beginPath();
      ctx.arc(centerX, centerY, nodeRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = node.color;
      ctx.lineWidth = isMobile ? 2 : 3;
      ctx.stroke();

      // Progress arc
      if (node.xp > 0 && !node.completed) {
        const progress = (node.xp / node.maxXp) * 2 * Math.PI;
        ctx.beginPath();
        ctx.arc(
          centerX,
          centerY,
          nodeRadius + 3,
          -Math.PI / 2,
          -Math.PI / 2 + progress
        );
        ctx.strokeStyle = node.color;
        ctx.lineWidth = isMobile ? 3 : 4;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      // Completion indicator OR level number (not both)
      if (node.completed) {
        // Show checkmark instead of level number when completed
        ctx.beginPath();
        ctx.arc(centerX, centerY, isMobile ? 12 : 15, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();

        // Checkmark
        ctx.beginPath();
        ctx.moveTo(centerX - (isMobile ? 6 : 8), centerY);
        ctx.lineTo(centerX - (isMobile ? 1 : 2), centerY + (isMobile ? 5 : 6));
        ctx.lineTo(centerX + (isMobile ? 6 : 8), centerY - (isMobile ? 5 : 6));
        ctx.strokeStyle = node.color;
        ctx.lineWidth = isMobile ? 2 : 3;
        ctx.lineCap = "round";
        ctx.stroke();
      } else {
        // Show level number only when NOT completed
        ctx.fillStyle = "#374151";
        ctx.font = `bold ${levelFontSize}px system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.level.toString(), centerX, centerY);
      }

      // Selection highlight
      if (selectedSkill === node.id) {
        ctx.beginPath();
        ctx.arc(
          centerX,
          centerY,
          nodeRadius + (isMobile ? 5 : 7),
          0,
          2 * Math.PI
        );
        ctx.strokeStyle = "#8b5cf6";
        ctx.lineWidth = isMobile ? 2 : 3;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Node name
      ctx.fillStyle = "#374151";
      ctx.font = `${fontSize}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      // Wrap text for mobile
      const maxWidth = isMobile ? 80 : 100;
      const words = node.name.split(" ");
      if (words.length > 1 && ctx.measureText(node.name).width > maxWidth) {
        // Split into two lines for mobile
        const line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
        const line2 = words.slice(Math.ceil(words.length / 2)).join(" ");
        ctx.fillText(
          line1,
          centerX,
          centerY + nodeRadius + (isMobile ? 8 : 12)
        );
        ctx.fillText(
          line2,
          centerX,
          centerY + nodeRadius + (isMobile ? 20 : 26)
        );
      } else {
        ctx.fillText(
          node.name,
          centerX,
          centerY + nodeRadius + (isMobile ? 8 : 12)
        );
      }
    });

    ctx.restore();
  }, [
    skillNodes,
    selectedSkill,
    zoomLevel,
    panOffset,
    canvasSize,
    canvasReady,
  ]);
  useEffect(() => {
    if (activeTab === "learn" && canvasReady) {
      drawSkillTree();
    }
  }, [activeTab, canvasReady, drawSkillTree]);
  // Mouse event handlers
  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      setIsTouch(false);
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    },
    [panOffset]
  );

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDragging || isTouch) return;

      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart, isTouch]
  );

  const handleCanvasMouseUp = useCallback(() => {
    if (isTouch) return;
    setIsDragging(false);
  }, [isTouch]);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (isDragging || isTouch) return;

      const coords = getCanvasCoordinates(e.clientX, e.clientY);
      handleSkillNodeInteraction(coords.x, coords.y);
    },
    [isDragging, isTouch, getCanvasCoordinates, handleSkillNodeInteraction]
  );

  // Touch handlers for mobile with swipe detection
  const handleCanvasTouchStart = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      setIsTouch(true);

      if (e.touches.length === 1) {
        const touch = e.touches[0];
        setTouchStart({ x: touch.clientX, y: touch.clientY });
        setIsDragging(false); // Don't start dragging immediately
        setDragStart({
          x: touch.clientX - panOffset.x,
          y: touch.clientY - panOffset.y,
        });
              } else if (e.touches.length === 2) {
          const distance = getTouchDistance(e.touches as any);
          setLastTouchDistance(distance);
          setIsDragging(false);
        }
    },
    [panOffset]
  );

  const handleCanvasTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();

      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStart.x);
        const deltaY = Math.abs(touch.clientY - touchStart.y);
        
        // Only start dragging if moved more than 10px (to allow taps)
        if (deltaX > 10 || deltaY > 10) {
          setIsDragging(true);
          setPanOffset({
            x: touch.clientX - dragStart.x,
            y: touch.clientY - dragStart.y,
          });
        }
              } else if (e.touches.length === 2) {
          const distance = getTouchDistance(e.touches as any);
          if (lastTouchDistance > 0) {
            const scale = distance / lastTouchDistance;
            const newZoom = Math.max(0.3, Math.min(4, zoomLevel * scale));
            setZoomLevel(newZoom);
          }
          setLastTouchDistance(distance);
          setIsDragging(false);
        }
    },
    [isDragging, dragStart, lastTouchDistance, touchStart, zoomLevel]
  );

  const handleCanvasTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();

      if (e.touches.length === 0) {
        // If we didn't drag much, treat it as a tap
        if (!isDragging && e.changedTouches.length === 1) {
          const touch = e.changedTouches[0];
          const deltaX = Math.abs(touch.clientX - touchStart.x);
          const deltaY = Math.abs(touch.clientY - touchStart.y);
          
          // Only register as tap if movement was minimal
          if (deltaX < 10 && deltaY < 10) {
            const coords = getCanvasCoordinates(touch.clientX, touch.clientY);
            handleSkillNodeInteraction(coords.x, coords.y);
          }
        }
        setIsDragging(false);
        setIsTouch(false);
        setLastTouchDistance(0);
      }
    },
    [isDragging, getCanvasCoordinates, handleSkillNodeInteraction, touchStart]
  );

  // Weekly swipe handlers
  const handleSwipeStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setSwipeStart({ x: touch.clientX, y: touch.clientY });
  }, []);

  const handleSwipeMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setSwipeEnd({ x: touch.clientX, y: touch.clientY });
  }, []);

  const handleSwipeEnd = useCallback(() => {
    if (!swipeStart.x || !swipeEnd.x) return;

    const deltaX = swipeStart.x - swipeEnd.x;
    const deltaY = Math.abs(swipeStart.y - swipeEnd.y);

    // Only horizontal swipes
    if (Math.abs(deltaX) > 50 && deltaY < 100) {
      if (deltaX > 0 && weekIndex < weeklyDataSets.length - 1) {
        // Swipe left - next week
        setWeekIndex((prev) => prev + 1);
        vibrate([50]);
      } else if (deltaX < 0 && weekIndex > 0) {
        // Swipe right - previous week
        setWeekIndex((prev) => prev - 1);
        vibrate([50]);
      }
    }

    setSwipeStart({ x: 0, y: 0 });
    setSwipeEnd({ x: 0, y: 0 });
  }, [swipeStart, swipeEnd, weekIndex, weeklyDataSets.length, vibrate]);

  // Weekly comparison navigation
  const handleWeeklyNavigation = useCallback(
    (direction: "left" | "right") => {
      if (direction === "left" && weekIndex < weeklyDataSets.length - 1) {
        setWeekIndex((prev) => prev + 1);
      } else if (direction === "right" && weekIndex > 0) {
        setWeekIndex((prev) => prev - 1);
      }
      vibrate([50]);
    },
    [weekIndex, weeklyDataSets.length, vibrate]
  );

  // Voice recognition toggle
  const toggleVoiceRecognition = useCallback(() => {
    if (isListening) {
      speechRecognition.current?.stop();
      addToast("Recording stopped", "info");
    } else {
      try {
        speechRecognition.current?.start();
        setIsListening(true);
        vibrate([50, 50, 50]);
              } catch (error) {
          addToast("Could not start voice recognition", "error");
          setIsListening(false);
        }
    }
  }, [isListening, addToast, vibrate]);

  // Navigate to next/previous practice phrase
  const changePracticePhrase = useCallback(
    (direction: "next" | "prev") => {
      if (direction === "next") {
        setCurrentPhraseIndex((prev) => (prev + 1) % practicePhrases.length);
      } else {
        setCurrentPhraseIndex((prev) =>
          prev === 0 ? practicePhrases.length - 1 : prev - 1
        );
      }
      vibrate([50]);
    },
    [practicePhrases.length, vibrate]
  );

  // Progress calculations
  const progressPercentage = useMemo(
    () => Math.min((todayXp / dailyGoal) * 100, 100),
    [todayXp, dailyGoal]
  );

  const completedSkills = useMemo(
    () => skillNodes.filter((node) => node.completed).length,
    [skillNodes]
  );

  const currentWeeklyData = weeklyDataSets[weekIndex];

  // Calculate weekly improvement
  const weeklyImprovement = useMemo(() => {
    if (weekIndex === 0) return null; // Current week

    const currentWeek = weeklyDataSets[weekIndex];
    const previousWeek = weeklyDataSets[weekIndex + 1];

    if (!previousWeek) return null;

    const currentTotal = currentWeek.reduce((sum, day) => sum + day.xp, 0);
    const previousTotal = previousWeek.reduce((sum, day) => sum + day.xp, 0);
    const improvement = currentTotal - previousTotal;
    const improvementPercent =
      previousTotal > 0 ? (improvement / previousTotal) * 100 : 0;

    return {
      xpChange: improvement,
      percentChange: improvementPercent,
      isImprovement: improvement > 0,
    };
  }, [weekIndex, weeklyDataSets]);

  // Draw canvas when data changes
  useEffect(() => {
    if (canvasReady) {
      drawSkillTree();
    }
  }, [drawSkillTree, canvasReady]);

  // Navigation items
  const navigationItems = [
    { name: "Learn", icon: BookOpenIcon, id: "learn" },
    { name: "Progress", icon: ChartBarIcon, id: "progress" },
    { name: "Practice", icon: SpeakerWaveIcon, id: "practice" },
    { name: "Profile", icon: UserIcon, id: "profile" },
  ];

  // Render different tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "learn":
        return (
          <>
            {/* Interactive Skill Tree */}
            <div
              className="bg-white rounded-3xl shadow-xl border border-white/50 p-3 sm:p-6 mb-4 sm:mb-6"
              ref={containerRef}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Skill Tree
                </h2>
                <div className="flex gap-1 sm:gap-2">
                  <button
                    onTouchStart={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setZoomLevel((prev) => Math.min(prev + 0.3, 3));
                      vibrate([50]);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setZoomLevel((prev) => Math.min(prev + 0.3, 3));
                      vibrate([50]);
                    }}
                    className="px-3 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 active:bg-blue-300 transition-colors text-sm font-medium touch-manipulation select-none"
                    title="Zoom In"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                  <button
                    onTouchStart={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setZoomLevel((prev) => Math.max(prev - 0.3, 0.5));
                      vibrate([50]);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setZoomLevel((prev) => Math.max(prev - 0.3, 0.5));
                      vibrate([50]);
                    }}
                    className="px-3 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 active:bg-blue-300 transition-colors text-sm font-medium touch-manipulation select-none"
                    title="Zoom Out"
                  >
                    −
                  </button>
                  <button
                    onTouchStart={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setZoomLevel(1);
                      // Reset will be handled by the resize useEffect
                      vibrate([100]);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setZoomLevel(1);
                      // Reset will be handled by the resize useEffect
                      vibrate([100]);
                    }}
                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors text-sm font-medium touch-manipulation select-none"
                    title="Reset View"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Click or tap on skill nodes to practice and earn XP. Drag to
                pan, use buttons to zoom.
              </div>

              <div className="relative w-full max-w-full overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100">
                {!canvasReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">
                        Loading skill tree...
                      </p>
                    </div>
                  </div>
                )}
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onClick={handleCanvasClick}
                  onTouchStart={handleCanvasTouchStart}
                  onTouchMove={handleCanvasTouchMove}
                  onTouchEnd={handleCanvasTouchEnd}
                  className="w-full cursor-pointer touch-none select-none block"
                  style={{
                    width: `${canvasSize.width}px`,
                    height: `${canvasSize.height}px`,
                    maxWidth: "100%",
                    opacity: canvasReady ? 1 : 0,
                    transition: "opacity 0.3s ease",
                  }}
                />

                {selectedSkill && (
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 max-w-xs border border-white/50 z-10">
                    {(() => {
                      const skill = skillNodes.find(
                        (n) => n.id === selectedSkill
                      );
                      return skill ? (
                        <div>
                          <div className="flex items-start justify-between mb-3 sm:mb-4">
                            <div className="flex items-center flex-1 mr-3">
                              <div
                                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-2 sm:mr-3"
                                style={{ backgroundColor: skill.color }}
                              ></div>
                              <div>
                                <h3 className="font-bold text-sm sm:text-lg">
                                  {skill.name}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600">
                                  Level {skill.level}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedSkill(null)}
                              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-gray-400 hover:text-gray-600 flex-shrink-0"
                              title="Close"
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-2">
                            <div
                              className="h-2 sm:h-3 rounded-full transition-all duration-300"
                              style={{
                                width: `${(skill.xp / skill.maxXp) * 100}%`,
                                backgroundColor: skill.color,
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mb-2 sm:mb-3">
                            {skill.xp}/{skill.maxXp} XP
                          </p>
                          {skill.completed ? (
                            <div className="flex items-center text-green-600 bg-green-50 rounded-lg p-2">
                              <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                              <span className="text-xs sm:text-sm font-medium">
                                Mastered!
                              </span>
                            </div>
                          ) : (
                            <div className="text-xs text-blue-600 bg-blue-50 rounded-lg p-2">
                              Click to practice and earn +30 XP!
                            </div>
                          )}
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
              {/* Go to Progress */}
              <button
                onClick={() => setActiveTab("progress")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl cursor-pointer sm:rounded-2xl p-4 sm:p-6 text-left hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <div className="flex items-center mb-2">
                  <ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  <span className="font-semibold text-sm sm:text-base">
                    Progress Overview
                  </span>
                </div>
                <p className="text-xs sm:text-sm opacity-90">
                  Check your weekly performance
                </p>
              </button>

              {/* Go to Practice */}
              <button
                onClick={() => setActiveTab("practice")}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl cursor-pointer sm:rounded-2xl p-4 sm:p-6 text-left hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <div className="flex items-center mb-2">
                  <MicrophoneIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  <span className="font-semibold text-sm sm:text-base">
                    Voice Practice
                  </span>
                </div>
                <p className="text-xs sm:text-sm opacity-90">
                  Improve pronunciation
                </p>
              </button>

              {/* Go to Profile */}
              <button
                onClick={() => setActiveTab("profile")}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl cursor-pointer sm:rounded-2xl p-4 sm:p-6 text-left hover:shadow-lg transition-all duration-200 transform hover:scale-105 sm:col-span-2 lg:col-span-1"
              >
                <div className="flex items-center mb-2">
                  <BoltIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  <span className="font-semibold text-sm sm:text-base">
                    Profile & Goals
                  </span>
                </div>
                <p className="text-xs sm:text-sm opacity-90">
                  View achievements and learning streak
                </p>
              </button>
            </div>
          </>
        );

      case "progress":
        return (
          <>
            {/* Weekly Progress Comparison with Swipe */}
            <div className="bg-white rounded-3xl shadow-xl border border-white/50 p-3 sm:p-6 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
                  Weekly Progress
                </h2>
                <div className="flex justify-center sm:justify-end items-center gap-2">
                  <button
                    onClick={() => handleWeeklyNavigation("left")}
                    disabled={weekIndex === weeklyDataSets.length - 1}
                    className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-medium text-gray-600 px-3">
                    Week {weeklyDataSets.length - weekIndex}
                  </span>
                  <button
                    onClick={() => handleWeeklyNavigation("right")}
                    disabled={weekIndex === 0}
                    className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Weekly Improvement Indicator */}
              {weeklyImprovement && (
                <div
                  className={`mb-3 sm:mb-4 p-2 sm:p-3 rounded-lg sm:rounded-xl ${
                    weeklyImprovement.isImprovement
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center">
                    {weeklyImprovement.isImprovement ? (
                      <ChartBarIcon className="w-4 h-4 mr-2 text-green-600" />
                    ) : (
                      <ChartBarIcon className="w-4 h-4 mr-2 text-red-600 transform rotate-180" />
                    )}
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        weeklyImprovement.isImprovement
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {weeklyImprovement.isImprovement ? "+" : ""}
                      {weeklyImprovement.xpChange} XP vs previous week (
                      {weeklyImprovement.percentChange > 0 ? "+" : ""}
                      {weeklyImprovement.percentChange.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              )}

              <div
                className="grid grid-cols-7 gap-1 sm:gap-2"
                onTouchStart={handleSwipeStart}
                onTouchMove={handleSwipeMove}
                onTouchEnd={handleSwipeEnd}
              >
                {currentWeeklyData.map((day, index) => (
                  <div key={`${weekIndex}-${index}`} className="text-center">
                    <div className="text-xs font-medium text-gray-500 mb-1 sm:mb-2">
                      {day.day}
                    </div>
                    <div className="text-xs text-gray-400 mb-1 sm:mb-2">
                      {day.date}
                    </div>
                    <div
                      className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-lg sm:rounded-xl p-2 sm:p-3 hover:shadow-lg transition-all duration-200 cursor-pointer relative overflow-hidden"
                      style={{ height: `${Math.max(day.xp / 4, 70)}px` }}
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-lg sm:rounded-xl"></div>
                      <div className="relative text-white">
                        <div className="text-xs font-bold">{day.xp}</div>
                        <div className="text-xs opacity-80">{day.lessons}L</div>
                        <div className="text-xs opacity-60">
                          {day.accuracy}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-2 sm:mt-3 text-center">
                Swipe left/right to view different weeks
              </div>
            </div>

            {/* Detailed Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="bg-white rounded-2xl shadow-lg border border-white/50 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <ChartBarIcon className="w-5 h-5 mr-2 text-blue-500" />
                  Learning Stats
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-gray-600">
                      Total Lessons
                    </span>
                    <span className="font-bold text-sm sm:text-base text-gray-900">
                      {userStats.totalLessons}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-gray-600">
                      Total Time
                    </span>
                    <span className="font-bold text-sm sm:text-base text-gray-900">
                      {Math.round(userStats.totalTimeSpent / 60)}h{" "}
                      {userStats.totalTimeSpent % 60}m
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-gray-600">
                      Average Accuracy
                    </span>
                    <span className="font-bold text-sm sm:text-base text-gray-900">
                      {userStats.averageAccuracy}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-gray-600">
                      Longest Streak
                    </span>
                    <span className="font-bold text-sm sm:text-base text-gray-900">
                      {userStats.longestStreak} days
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-white/50 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <TrophyIcon className="w-5 h-5 mr-2 text-yellow-500" />
                  Achievements
                </h3>
                <div className="space-y-3">
                  {achievements.slice(0, 4).map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`flex items-center p-2 sm:p-3 rounded-lg sm:rounded-xl ${
                        achievement.unlocked
                          ? "bg-green-50 border border-green-200"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className={`mr-2 sm:mr-3 p-1.5 rounded-lg ${
                        achievement.unlocked 
                          ? "bg-green-100 text-green-600" 
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {renderAchievementIcon(achievement.icon, "w-4 h-4 sm:w-5 sm:h-5")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm sm:text-base text-gray-900 truncate">
                          {achievement.name}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {achievement.description}
                        </div>
                        {!achievement.unlocked && (
                          <div className="mt-1">
                            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                              <div
                                className="bg-blue-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${
                                    (achievement.progress /
                                      achievement.maxProgress) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {achievement.progress}/{achievement.maxProgress}
                            </div>
                          </div>
                        )}
                      </div>
                      {achievement.unlocked && (
                        <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );

      case "practice":
        return (
          <>
            {/* Voice Practice Section */}
            <div className="bg-white rounded-3xl shadow-xl border border-white/50 p-3 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Pronunciation Practice
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Voice Recognition Panel */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <MicrophoneIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mr-2 sm:mr-3" />
                      <h3 className="text-base sm:text-lg font-semibold">
                        Voice Practice
                      </h3>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm font-medium text-gray-600">
                      Streak: {practiceStreak} 
                      <FireIconSolid className="w-3 h-3 ml-1 text-orange-500" />
                    </div>
                  </div>

                  {/* Current Phrase Display */}
                  <div className="bg-white rounded-xl p-3 sm:p-4 mb-4 border-2 border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <button
                        onClick={() => changePracticePhrase("prev")}
                        className="p-1.5 sm:p-2 rounded-lg bg-blue-100 text-blue-600 cursor-pointer  hover:bg-blue-200"
                      >
                        <ChevronLeftIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <div className="text-center flex-1 px-2">
                        <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">
                          {practicePhrases[currentPhraseIndex].spanish}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          {practicePhrases[currentPhraseIndex].english}
                        </div>
                        <div className="flex items-center text-xs text-blue-600 mt-1">
                          <span className="mr-1">Difficulty:</span>
                          {Array.from({ length: practicePhrases[currentPhraseIndex].difficulty }, (_, i) => (
                            <StarIconSolid key={i} className="w-3 h-3 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => changePracticePhrase("next")}
                        className="p-1.5 sm:p-2 rounded-lg bg-blue-100  cursor-pointer text-blue-600 hover:bg-blue-200"
                      >
                        <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Pronunciation Score */}
                  {pronunciationScore > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs sm:text-sm font-medium text-gray-600">
                          Pronunciation Score
                        </span>
                        <span
                          className={`text-xs sm:text-sm font-bold ${
                            pronunciationScore >= 80
                              ? "text-green-600"
                              : pronunciationScore >= 60
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {pronunciationScore}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                        <div
                          className={`h-2 sm:h-3 rounded-full transition-all duration-500 ${
                            pronunciationScore >= 80
                              ? "bg-green-500"
                              : pronunciationScore >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${pronunciationScore}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Voice Control Button */}
                  <button
                    onClick={toggleVoiceRecognition}
                    className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-2xl  cursor-pointer font-semibold transition-all duration-200 flex items-center justify-center ${
                      isListening
                        ? "bg-red-500 text-white hover:bg-red-600 shadow-lg animate-pulse"
                        : "bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    <MicrophoneIcon
                      className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${
                        isListening ? "animate-bounce" : ""
                      }`}
                    />
                    <span className="text-sm sm:text-base">
                      {isListening ? "Stop Recording" : "Start Speaking"}
                    </span>
                  </button>

                  <p className="text-xs sm:text-sm text-gray-600 mt-3 text-center">
                    {isListening
                      ? "Listening for your pronunciation..."
                      : "Tap to practice pronunciation with AI feedback"}
                  </p>
                </div>

                {/* Practice Stats Panel */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-4 sm:p-6">
                  <div className="flex items-center mb-4">
                    <SpeakerWaveIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mr-2 sm:mr-3" />
                    <h3 className="text-base sm:text-lg font-semibold">
                      Practice Stats
                    </h3>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-white rounded-xl p-3 sm:p-4 border border-green-100">
                      <div className="flex items-center mb-2 sm:mb-3">
                        <ChartBarIcon className="w-4 h-4 mr-2 text-blue-500" />
                        <h4 className="font-medium text-sm sm:text-base text-gray-900">
                          Your Progress
                        </h4>
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Total Attempts</span>
                          <span className="font-bold text-gray-900">
                            {voicePracticeStats.totalAttempts}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Average Score</span>
                          <span className="font-bold text-gray-900">
                            {voicePracticeStats.averageScore}%
                          </span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Best Score</span>
                          <span className="font-bold text-green-600">
                            {voicePracticeStats.bestScore}%
                          </span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Practice Time</span>
                          <span className="font-bold text-gray-900">
                            {voicePracticeStats.practiceTime}m
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-3 sm:p-4 border border-blue-100">
                      <div className="flex items-center mb-2">
                        <BeakerIcon className="w-4 h-4 mr-2 text-green-500" />
                        <h4 className="font-medium text-sm sm:text-base text-gray-900">
                          Scoring System
                        </h4>
                      </div>
                      <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-600">80-100%</span>
                          <span className="text-gray-600">Excellent!</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-yellow-600">60-79%</span>
                          <span className="text-gray-600">Good</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-600">0-59%</span>
                          <span className="text-gray-600">Keep practicing</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-3 sm:p-4 border border-purple-100">
                      <div className="flex items-center mb-2">
                        <AcademicCapIcon className="w-4 h-4 mr-2 text-purple-500" />
                        <h4 className="font-medium text-sm sm:text-base text-gray-900">
                          Tips for Success
                        </h4>
                      </div>
                      <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                        <li>• Speak clearly and confidently</li>
                        <li>• Practice in a quiet environment</li>
                        <li>• Focus on accent and pronunciation</li>
                        <li>• Repeat difficult phrases</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case "profile":
        return (
          <>
            {/* User Profile */}
            <div className="bg-white rounded-3xl shadow-xl border border-white/50 p-3 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Your Profile
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Profile Info */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold">
                      M
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                        Maria Rodriguez
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        Spanish Learner
                      </p>
                      <p className="text-xs sm:text-sm text-blue-600">
                        Member since Oct 2024
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 sm:p-4">
                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">
                      Learning Goals
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span>Weekly Goal: {userStats.weeklyGoal} hours</span>
                        <span className="font-medium">
                          {Math.round(
                            (userStats.practiceMinutesToday / 60) * 10
                          ) / 10}
                          h / {userStats.weeklyGoal}h
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              (userStats.practiceMinutesToday /
                                60 /
                                userStats.weeklyGoal) *
                                100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-xl p-3 sm:p-4">
                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-2">
                      Current Streak
                    </h4>
                    <div className="flex items-center">
                      <FireIcon className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 mr-2" />
                      <span className="text-xl sm:text-2xl font-bold text-gray-900">
                        {currentStreak}
                      </span>
                      <span className="text-sm sm:text-base text-gray-600 ml-2">
                        days
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      Keep it up! You're doing great!
                    </p>
                  </div>
                </div>

                {/* All Achievements */}
                <div>
                  <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-3 sm:mb-4">
                    All Achievements
                  </h4>
                  <div className="space-y-2 sm:space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`flex items-center p-2 sm:p-3 rounded-lg sm:rounded-xl ${
                          achievement.unlocked
                            ? "bg-green-50 border border-green-200"
                            : "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <div className={`mr-2 sm:mr-3 p-2 rounded-lg ${
                          achievement.unlocked 
                            ? "bg-green-100 text-green-600" 
                            : "bg-gray-100 text-gray-500"
                        }`}>
                          {renderAchievementIcon(achievement.icon, "w-4 h-4 sm:w-5 sm:h-5")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm sm:text-base text-gray-900 truncate">
                            {achievement.name}
                          </div>
                          <div className="text-xs text-gray-600 truncate">
                            {achievement.description}
                          </div>
                          {!achievement.unlocked && (
                            <div className="mt-1 sm:mt-2">
                              <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                                <div
                                  className="bg-blue-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${
                                      (achievement.progress /
                                        achievement.maxProgress) *
                                      100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {achievement.progress}/{achievement.maxProgress}
                              </div>
                            </div>
                          )}
                        </div>
                        {achievement.unlocked && (
                          <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Settings */}
            {/* <div className="bg-white rounded-3xl shadow-xl border border-white/50 p-3 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                Settings
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="font-medium text-sm sm:text-base text-gray-900">
                    Notifications
                  </span>
                  <button className="bg-blue-500  cursor-pointer rounded-full w-10 h-5 sm:w-12 sm:h-6 relative">
                    <div className="bg-white w-4 h-4 sm:w-5 sm:h-5 rounded-full absolute top-0.5 right-0.5"></div>
                  </button>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="font-medium text-sm sm:text-base text-gray-900">
                    Sound Effects
                  </span>
                  <button className="bg-blue-500 cursor-pointer  rounded-full w-10 h-5 sm:w-12 sm:h-6 relative">
                    <div className="bg-white w-4 h-4 sm:w-5 sm:h-5 rounded-full absolute top-0.5 right-0.5"></div>
                  </button>
                </div>
                <div className="flex justify-between cursor-pointer  items-center p-3 bg-gray-50 rounded-xl">
                  <span className="font-medium text-sm sm:text-base text-gray-900">
                    Vibration
                  </span>
                  <button className="bg-blue-500 rounded-full w-10 h-5 sm:w-12 sm:h-6 relative">
                    <div className="bg-white w-4 h-4 sm:w-5 sm:h-5 rounded-full absolute top-0.5 right-0.5"></div>
                  </button>
                </div>
              </div>
            </div> */}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                <BookOpenIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LinguaFlow
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center px-3 cursor-pointer  lg:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-blue-500 text-white shadow-lg"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <item.icon className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>


      </header>

      {/* Floating Progress Ring */}
      <div
        className="fixed top-16 sm:top-20 right-2 sm:right-4 z-40 transition-transform duration-200"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      >
        <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full shadow-lg">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 transform -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="#e5e7eb"
              strokeWidth="3"
              fill="transparent"
              className="sm:hidden"
            />
            <circle
              cx="32"
              cy="32"
              r="26"
              stroke="#e5e7eb"
              strokeWidth="4"
              fill="transparent"
              className="hidden sm:block"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="url(#progressGradient)"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={`${progressPercentage * 1.26} 126`}
              className="transition-all duration-300 sm:hidden"
            />
            <circle
              cx="32"
              cy="32"
              r="26"
              stroke="url(#progressGradient)"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={`${progressPercentage * 1.63} 163`}
              className="transition-all duration-300 hidden sm:block"
            />
            <defs>
              <linearGradient
                id="progressGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <FireIcon className="w-4 h-4 sm:w-6 sm:h-6 text-orange-500" />
          </div>
        </div>
        <div className="text-center text-xs font-medium text-gray-600 mt-1">
          {todayXp}/{dailyGoal}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 pb-16 sm:pb-20">
        {/* Hero Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 py-4 sm:py-6">
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-white/50">
            <div className="flex items-center">
              <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg sm:rounded-xl">
                <FireIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
              </div>
              <div className="ml-2 sm:ml-3 min-w-0">
                <p className="text-xs font-medium text-gray-500">Streak</p>
                <p className="text-sm sm:text-lg font-bold text-gray-900 truncate">
                  {currentStreak}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-white/50">
            <div className="flex items-center">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg sm:rounded-xl">
                <StarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              </div>
              <div className="ml-2 sm:ml-3 min-w-0">
                <p className="text-xs font-medium text-gray-500">Total XP</p>
                <p className="text-sm sm:text-lg font-bold text-gray-900 truncate">
                  {totalXp.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-white/50">
            <div className="flex items-center">
              <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg sm:rounded-xl">
                <TrophyIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              </div>
              <div className="ml-2 sm:ml-3 min-w-0">
                <p className="text-xs font-medium text-gray-500">Skills</p>
                <p className="text-sm sm:text-lg font-bold text-gray-900 truncate">
                  {completedSkills}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-white/50">
            <div className="flex items-center">
              <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg sm:rounded-xl">
                <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
              </div>
              <div className="ml-2 sm:ml-3 min-w-0">
                <p className="text-xs font-medium text-gray-500">Progress</p>
                <p className="text-sm sm:text-lg font-bold text-gray-900 truncate">
                  {Math.round(progressPercentage)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 px-2 sm:px-4 py-2 safe-area-bottom">
        <div className="flex justify-around">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-2 px-2 sm:px-3 cursor-pointer  rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600"
              }`}
            >
              <item.icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Toast Notifications */}
      <div className="fixed top-16 sm:top-20 left-2 right-2 sm:left-4 sm:right-4 z-50 space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg transform transition-all duration-300 backdrop-blur-lg border ${
              toast.type === "success"
                ? "bg-green-500/90 text-white border-green-400"
                : toast.type === "error"
                ? "bg-red-500/90 text-white border-red-400"
                : toast.type === "warning"
                ? "bg-yellow-500/90 text-white border-yellow-400"
                : "bg-blue-500/90 text-white border-blue-400"
            } max-w-sm mx-auto text-center`}
          >
            <span className="text-xs sm:text-sm break-words">
              {toast.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinguaFlow;
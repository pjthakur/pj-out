"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Activity,
  BookOpen,
  Brain,
  Droplets,
  Salad,
  Dumbbell,
  Target,
  PenTool,
  Music,
  Smartphone,
  User,
  Palette,
  Star,
  Zap,
  Flame,
  Lightbulb,
  Gamepad2,
  Home,
  Settings,
  Info,
  Plus,
  ChevronLeft,
  ChevronRight,
  Check,
  BarChart3,
  Calendar,
  TrendingUp,
  Trophy,
  Crown,
  Diamond,
  Sparkles,
  Award,
  ThumbsUp,
  Heart,
  Smile,
  Rocket,
  Coffee,
  Moon,
  Sun,
  Users,
  Camera,
  Mail,
  MapPin,
  Phone,
  Edit3,
  Bell,
  Download,
  RefreshCw,
  Shield,
  HelpCircle,
  ArrowRight,
  Sprout,
  AlertCircle,
  CheckCircle,
  X,
  CircleDot
} from "lucide-react";

interface Habit {
  id: string;
  name: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  streak: number;
  longestStreak: number;
  completedDates: string[];
  target: number;
  category: string;
  createdAt: string;
}

interface DayCompletion {
  date: string;
  habits: { [habitId: string]: boolean };
  timestamp: number;
}

interface Milestone {
  days: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface NewHabitForm {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
}

interface UserProfile {
  name: string;
  email: string;
  image: React.ComponentType<{ className?: string }>;
  joinedDate: string;
}

interface Toast {
  id: string;
  message: string;
  type: "info" | "success" | "warning";
}

const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [completions, setCompletions] = useState<DayCompletion[]>([]);
  const [animatingHabit, setAnimatingHabit] = useState<string | null>(null);
  const [celebratingMilestone, setCelebratingMilestone] = useState<{
    habitId: string;
    milestone: Milestone;
  } | null>(null);
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [viewMode, setViewMode] = useState<
    "overview" | "timeline" | "analytics"
  >("overview");
  const [monthTransition, setMonthTransition] = useState<
    "none" | "left" | "right"
  >("none");
  const [newHabitForm, setNewHabitForm] = useState<NewHabitForm>({
    name: "",
    icon: Target,
    category: "Health",
  });

  const [activeTab, setActiveTab] = useState<
    "home" | "profile" | "settings" | "about"
  >("home");
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    image: User,
    joinedDate: new Date().toISOString(),
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [streakCelebration, setStreakCelebration] = useState<{
    habitId: string;
    streak: number;
  } | null>(null);
  const [showMilestoneMarkers, setShowMilestoneMarkers] = useState(false);
  const [pendingCompletions, setPendingCompletions] = useState<{
    [habitId: string]: boolean;
  }>({});

  const containerRef = useRef<HTMLDivElement>(null);

  // Prevent background scrolling when modals are open
  useEffect(() => {
    const isAnyModalOpen = showCheckIn || showAddHabit || celebratingMilestone !== null || streakCelebration !== null;
    
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCheckIn, showAddHabit, celebratingMilestone, streakCelebration]);

  const milestones: Milestone[] = [
    {
      days: 3,
      title: "First Steps",
      icon: Sprout,
      color: "from-green-400 to-emerald-500",
    },
    {
      days: 7,
      title: "One Week Strong",
      icon: Sparkles,
      color: "from-emerald-400 to-green-500",
    },
    {
      days: 14,
      title: "Two Week Warrior",
      icon: Zap,
      color: "from-green-400 to-teal-500",
    },
    {
      days: 21,
      title: "Habit Former",
      icon: Trophy,
      color: "from-teal-400 to-green-500",
    },
    {
      days: 30,
      title: "Monthly Master",
      icon: Crown,
      color: "from-lime-400 to-green-500",
    },
    {
      days: 60,
      title: "Consistency Champion",
      icon: Flame,
      color: "from-green-500 to-emerald-500",
    },
    {
      days: 90,
      title: "Quarterly Queen/King",
      icon: Diamond,
      color: "from-emerald-500 to-green-600",
    },
    {
      days: 180,
      title: "Half-Year Hero",
      icon: Star,
      color: "from-green-600 to-teal-600",
    },
    {
      days: 365,
      title: "Year-Long Legend",
      icon: Target,
      color: "from-gradient-rainbow",
    },
  ];

  const habitIcons = [
    Activity,
    BookOpen,
    Brain,
    Droplets,
    Salad,
    Dumbbell,
    Target,
    PenTool,
    Music,
    Smartphone,
    Coffee,
    Palette,
    Star,
    Zap,
    Flame,
    Lightbulb,
    Gamepad2,
    Home,
  ];

  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    'Activity': Activity,
    'BookOpen': BookOpen,
    'Brain': Brain,
    'Droplets': Droplets,
    'Salad': Salad,
    'Dumbbell': Dumbbell,
    'Target': Target,
    'PenTool': PenTool,
    'Music': Music,
    'Smartphone': Smartphone,
    'Coffee': Coffee,
    'Palette': Palette,
    'Star': Star,
    'Zap': Zap,
    'Flame': Flame,
    'Lightbulb': Lightbulb,
    'Gamepad2': Gamepad2,
    'Home': Home,
    'User': User,
    'Smile': Smile,
    'Diamond': Diamond,
    'Rocket': Rocket,
    'Plus': Plus,
    'Trophy': Trophy,
    'Crown': Crown,
    'Sprout': Sprout,
    'Sparkles': Sparkles
  };

  const componentToName: { [key: string]: string } = {
    [Activity.name]: 'Activity',
    [BookOpen.name]: 'BookOpen',
    [Brain.name]: 'Brain',
    [Droplets.name]: 'Droplets',
    [Salad.name]: 'Salad',
    [Dumbbell.name]: 'Dumbbell',
    [Target.name]: 'Target',
    [PenTool.name]: 'PenTool',
    [Music.name]: 'Music',
    [Smartphone.name]: 'Smartphone',
    [Coffee.name]: 'Coffee',
    [Palette.name]: 'Palette',
    [Star.name]: 'Star',
    [Zap.name]: 'Zap',
    [Flame.name]: 'Flame',
    [Lightbulb.name]: 'Lightbulb',
    [Gamepad2.name]: 'Gamepad2',
    [Home.name]: 'Home',
    [User.name]: 'User',
    [Smile.name]: 'Smile',
    [Diamond.name]: 'Diamond',
    [Rocket.name]: 'Rocket',
    [Plus.name]: 'Plus',
    [Trophy.name]: 'Trophy',
    [Crown.name]: 'Crown',
    [Sprout.name]: 'Sprout',
    [Sparkles.name]: 'Sparkles'
  };

  const getIconFromName = (iconName: string): React.ComponentType<{ className?: string }> => {
    return iconMap[iconName] || Target;
  };

  const getNameFromIcon = (icon: React.ComponentType<{ className?: string }>): string => {
    return componentToName[icon.name] || 'Target';
  };

  const categories = [
    "Health",
    "Learning",
    "Wellness",
    "Productivity",
    "Creative",
    "Social",
  ];
  // mock data
  const generateMockData = useCallback(() => {
    const mockHabits: Habit[] = [
      {
        id: "1",
        name: "Morning Workout",
        color: "from-green-500 to-emerald-600",
        icon: Dumbbell,
        streak: 0,
        longestStreak: 0,
        completedDates: [],
        target: 30,
        category: "Health",
        createdAt: new Date(
          Date.now() - 180 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
      {
        id: "2",
        name: "Read 30 Minutes",
        color: "from-emerald-500 to-teal-500",
        icon: BookOpen,
        streak: 0,
        longestStreak: 0,
        completedDates: [],
        target: 30,
        category: "Learning",
        createdAt: new Date(
          Date.now() - 160 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
      {
        id: "3",
        name: "Meditation",
        color: "from-teal-500 to-green-500",
        icon: Brain,
        streak: 0,
        longestStreak: 0,
        completedDates: [],
        target: 30,
        category: "Wellness",
        createdAt: new Date(
          Date.now() - 140 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
      {
        id: "4",
        name: "Drink 8 Glasses",
        color: "from-lime-500 to-green-500",
        icon: Droplets,
        streak: 0,
        longestStreak: 0,
        completedDates: [],
        target: 30,
        category: "Health",
        createdAt: new Date(
          Date.now() - 120 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    ];

    // Generate realistic completion data for the past 6 months (180 days)
    const mockCompletions: DayCompletion[] = [];
    const today = new Date();

    // Generate data for the past 180 days
    for (let i = 179; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = formatDate(date);

      const dayCompletion: DayCompletion = {
        date: dateStr,
        habits: {},
        timestamp: date.getTime(),
      };

      // Add realistic completion patterns for each habit
      mockHabits.forEach((habit) => {
        let completionChance = 0.7; // Base 70% completion rate

        // Adjust based on habit type and patterns
        if (habit.name === "Morning Workout") {
          // Lower completion on weekends, improving over time
          const weekendPenalty =
            date.getDay() === 0 || date.getDay() === 6 ? 0.3 : 0;
          const daysSinceStart = Math.floor(
            (date.getTime() - new Date(habit.createdAt).getTime()) /
              (24 * 60 * 60 * 1000)
          );
          completionChance =
            Math.min(0.85, 0.4 + daysSinceStart / 200) - weekendPenalty;
        } else if (habit.name === "Read 30 Minutes") {
          // More consistent, slightly better on weekends
          const weekendBonus =
            date.getDay() === 0 || date.getDay() === 6 ? 0.1 : 0;
          completionChance = 0.8 + weekendBonus;
        } else if (habit.name === "Meditation") {
          // Building up over time, some dips for realism
          const daysSinceStart = Math.floor(
            (date.getTime() - new Date(habit.createdAt).getTime()) /
              (24 * 60 * 60 * 1000)
          );
          const cyclicVariation = Math.sin(daysSinceStart / 10) * 0.2; // Some ups and downs
          completionChance = Math.min(
            0.9,
            0.3 + daysSinceStart / 150 + cyclicVariation
          );
        } else if (habit.name === "Drink 8 Glasses") {
          // Very consistent
          completionChance = 0.88;
        }

        // Create realistic streaks and breaks
        if (Math.random() < Math.max(0.1, completionChance)) {
          dayCompletion.habits[habit.id] = true;
        }
      });

      mockCompletions.push(dayCompletion);
    }

    // Calculate streaks and longest streaks
    mockHabits.forEach((habit) => {
      const completedDates = mockCompletions
        .filter((c) => c.habits[habit.id])
        .map((c) => c.date);

      habit.completedDates = completedDates;

      // Calculate current streak
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      // Calculate current streak from today backwards
      for (let i = 0; i < 180; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = formatDate(date);
        const completion = mockCompletions.find((c) => c.date === dateStr);

        if (completion && completion.habits[habit.id]) {
          if (i === 0 || currentStreak === i) {
            currentStreak = i + 1;
          }
        } else if (i === 0) {
          break; // If today is not completed, current streak is 0
        } else {
          break; // Break in streak
        }
      }

      // Calculate longest streak
      let maxStreak = 0;
      tempStreak = 0;
      for (let i = 179; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = formatDate(date);
        const completion = mockCompletions.find((c) => c.date === dateStr);

        if (completion && completion.habits[habit.id]) {
          tempStreak++;
          maxStreak = Math.max(maxStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      }

      habit.streak = currentStreak;
      habit.longestStreak = maxStreak;
    });

    return { habits: mockHabits, completions: mockCompletions };
  }, []);

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    // Clear localStorage to start fresh (temporary)
    localStorage.removeItem("habit-tracker-habits");
    localStorage.removeItem("habit-tracker-completions");
    localStorage.removeItem("habit-tracker-profile");
    
    const savedHabits = localStorage.getItem("habit-tracker-habits");
    const savedCompletions = localStorage.getItem("habit-tracker-completions");
    const savedProfile = localStorage.getItem("habit-tracker-profile");

    if (savedHabits && savedCompletions) {
      try {
        const parsedHabits = JSON.parse(savedHabits);
        // Convert icon names back to React components
        const habitsWithIcons = parsedHabits.map((habit: any) => ({
          ...habit,
          icon: typeof habit.icon === 'string' ? getIconFromName(habit.icon) : habit.icon
        }));
        setHabits(habitsWithIcons);
        setCompletions(JSON.parse(savedCompletions));
      } catch (e) {
        console.error("Failed to load data:", e);
        const mockData = generateMockData();
        setHabits(mockData.habits);
        setCompletions(mockData.completions);
      }
    } else {
      const mockData = generateMockData();
      setHabits(mockData.habits);
      setCompletions(mockData.completions);
    }

    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        // Convert image name back to React component
        const profileWithIcon = {
          ...parsedProfile,
          image: typeof parsedProfile.image === 'string' ? getIconFromName(parsedProfile.image) : parsedProfile.image
        };
        setUserProfile(profileWithIcon);
      } catch (e) {
        console.error("Failed to load profile:", e);
      }
    }
  }, [generateMockData]);

  useEffect(() => {
    if (habits.length > 0) {
      // Convert React components to strings for storage
      const habitsForStorage = habits.map(habit => ({
        ...habit,
        icon: getNameFromIcon(habit.icon)
      }));
      localStorage.setItem("habit-tracker-habits", JSON.stringify(habitsForStorage));
    }
  }, [habits]);

  useEffect(() => {
    if (completions.length > 0) {
      localStorage.setItem(
        "habit-tracker-completions",
        JSON.stringify(completions)
      );
    }
  }, [completions]);

  useEffect(() => {
    // Convert React component to string for storage
    const profileForStorage = {
      ...userProfile,
      image: getNameFromIcon(userProfile.image)
    };
    localStorage.setItem("habit-tracker-profile", JSON.stringify(profileForStorage));
  }, [userProfile]);

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getMonthName = (date: Date): string => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const calculateStreak = useCallback(
    (habit: Habit): number => {
      const today = new Date();
      let streak = 0;
      let checkDate = new Date(today);

      const todayStr = formatDate(today);
      const todayCompletion = completions.find((c) => c.date === todayStr);

      if (!todayCompletion?.habits[habit.id]) {
        checkDate.setDate(checkDate.getDate() - 1);
      }

      while (checkDate >= new Date(habit.createdAt)) {
        const dateStr = formatDate(checkDate);
        const completion = completions.find((c) => c.date === dateStr);

        if (completion && completion.habits[habit.id]) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      return streak;
    },
    [completions]
  );

  const getHabitCompletion = (habitId: string, date: Date): boolean => {
    const dateStr = formatDate(date);
    const completion = completions.find((c) => c.date === dateStr);
    return completion?.habits[habitId] || false;
  };

  const showToast = (
    message: string,
    type: "info" | "success" | "warning" = "info"
  ) => {
    const id = Date.now().toString();
    const newToast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const toggleHabitCompletion = (habitId: string) => {
    setPendingCompletions((prev) => ({
      ...prev,
      [habitId]: !prev[habitId],
    }));
  };

  const submitCheckIn = () => {
    const today = formatDate(currentDate);
    const existingCompletion = completions.find((c) => c.date === today);

    let newCompletions: DayCompletion[];

    if (existingCompletion) {
      newCompletions = completions.map((c) =>
        c.date === today
          ? {
              ...c,
              habits: { ...c.habits, ...pendingCompletions },
              timestamp: Date.now(),
            }
          : c
      );
    } else {
      const newCompletion: DayCompletion = {
        date: today,
        habits: { ...pendingCompletions },
        timestamp: Date.now(),
      };
      newCompletions = [...completions, newCompletion];
    }

    setCompletions(newCompletions);

    Object.entries(pendingCompletions).forEach(([habitId, isCompleted]) => {
      if (isCompleted) {
        const habit = habits.find((h) => h.id === habitId);
        if (habit) {
          const oldStreak = calculateStreak(habit);

          setTimeout(() => {
            const newStreak = calculateStreak(habit);

            setHabits((prevHabits) =>
              prevHabits.map((h) =>
                h.id === habitId
                  ? {
                      ...h,
                      streak: newStreak + 1,
                      longestStreak: Math.max(
                        h.longestStreak || 0,
                        newStreak + 1
                      ),
                      completedDates: newCompletions
                        .filter((c) => c.habits[habitId])
                        .map((c) => c.date),
                    }
                  : h
              )
            );

            const finalStreak = newStreak + 1;

            setAnimatingHabit(habitId);

            setTimeout(() => {
              setStreakCelebration({ habitId, streak: finalStreak });
              setTimeout(() => setStreakCelebration(null), 2000);
            }, 200);

            const achievedMilestone = milestones.find(
              (m) => m.days === finalStreak
            );
            if (achievedMilestone) {
              setTimeout(() => {
                setCelebratingMilestone({
                  habitId,
                  milestone: achievedMilestone,
                });
                setTimeout(() => setCelebratingMilestone(null), 4000);
              }, 2500);
            }

            setTimeout(() => setAnimatingHabit(null), 1500);
          }, 100);
        }
      }
    });

    setPendingCompletions({});
    setShowCheckIn(false);
  };

  const getCircularTimelineData = (habit: Habit) => {
    const daysInMonth = getDaysInMonth(selectedMonth);
    const centerX = 120;
    const centerY = 120;
    const radius = 75;
    const days = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const angle = (day / daysInMonth) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const numberRadius = radius + 20;
      const numberX = centerX + numberRadius * Math.cos(angle);
      const numberY = centerY + numberRadius * Math.sin(angle);

      const date = new Date(
        selectedMonth.getFullYear(),
        selectedMonth.getMonth(),
        day
      );
      const isCompleted = getHabitCompletion(habit.id, date);
      const isToday =
        formatDate(date) === formatDate(currentDate) &&
        selectedMonth.getMonth() === currentDate.getMonth() &&
        selectedMonth.getFullYear() === currentDate.getFullYear();

      days.push({
        day,
        x,
        y,
        numberX,
        numberY,
        isCompleted,
        isToday,
        date,
      });
    }

    return days;
  };

  const getMonthProgress = (habit: Habit): number => {
    const daysInMonth = getDaysInMonth(selectedMonth);
    let completedDays = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        selectedMonth.getFullYear(),
        selectedMonth.getMonth(),
        day
      );
      if (getHabitCompletion(habit.id, date)) {
        completedDays++;
      }
    }

    return daysInMonth > 0 ? (completedDays / daysInMonth) * 100 : 0;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        navigateMonth("next");
      } else {
        navigateMonth("prev");
      }
    }

    setTouchStart(null);
  };

  const navigateMonth = (direction: "next" | "prev") => {
    setMonthTransition(direction === "next" ? "left" : "right");

    setTimeout(() => {
      setSelectedMonth((prev) =>
        direction === "next"
          ? new Date(prev.getFullYear(), prev.getMonth() + 1)
          : new Date(prev.getFullYear(), prev.getMonth() - 1)
      );

      setTimeout(() => {
        setMonthTransition("none");
      }, 150);
    }, 150);
  };

  const getNextMilestone = (habit: Habit): Milestone | null => {
    return milestones.find((m) => m.days > habit.streak) || null;
  };

  const getAchievedMilestones = (habit: Habit): Milestone[] => {
    return milestones.filter((m) => m.days <= habit.longestStreak);
  };

  const getTodayCompletionRate = (): number => {
    const today = formatDate(currentDate);
    const todayCompletion = completions.find((c) => c.date === today);
    const completedCount = habits.filter(
      (h) => todayCompletion?.habits[h.id]
    ).length;
    return habits.length > 0 ? (completedCount / habits.length) * 100 : 0;
  };

  const addNewHabit = () => {
    if (!newHabitForm.name.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitForm.name.trim(),
      icon: newHabitForm.icon,
      category: newHabitForm.category,
      color: "from-green-500 to-emerald-500",
      streak: 0,
      longestStreak: 0,
      completedDates: [],
      target: 30,
      createdAt: new Date().toISOString(),
    };

    setHabits((prev) => [...prev, newHabit]);
    setNewHabitForm({ name: "", icon: Target, category: "Health" });
    setShowAddHabit(false);
    showToast("New habit added successfully!", "success");
  };

  const getCurrentDayCompletions = () => {
    const today = formatDate(currentDate);
    const todayCompletion = completions.find((c) => c.date === today);
    const actualCompletions = todayCompletion?.habits || {};

    return { ...actualCompletions, ...pendingCompletions };
  };

  const updateProfile = () => {
    setIsEditingProfile(false);
    showToast("Profile updated successfully!", "success");
  };

  const getTotalStats = () => {
    const totalHabits = habits.length;
    const totalCompletions = completions.reduce((acc, comp) => {
      return acc + Object.values(comp.habits).filter(Boolean).length;
    }, 0);
    const bestStreak = Math.max(...habits.map((h) => h.longestStreak || 0), 0);
    const daysActive = new Set(completions.map((c) => c.date)).size;

    return { totalHabits, totalCompletions, bestStreak, daysActive };
  };

  // Navigation items
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "about", label: "About", icon: Info },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        const stats = getTotalStats();
        return (
          <div className="space-y-6 mb-6">
            {/* profile header */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-4xl">
                  <userProfile.image className="w-10 h-10 text-white" />
                </div>
                {isEditingProfile ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={(e) =>
                        setUserProfile((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full bg-white/10 border border-white/30 rounded-2xl px-4 py-3 text-white text-center placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                    />
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) =>
                        setUserProfile((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full bg-white/10 border border-white/30 rounded-2xl px-4 py-3 text-white text-center placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                    />
                    <div className="grid grid-cols-6 gap-2">
                      {[
                        User,
                        Smile,
                        Star,
                        Zap,
                        Flame,
                        Diamond,
                        Target,
                        Plus,
                        Dumbbell,
                        Brain,
                        BookOpen,
                        Palette,
                      ].map((Emoji) => (
                        <button
                          key={Emoji.name}
                          onClick={() =>
                            setUserProfile((prev) => ({
                              ...prev,
                              image: Emoji,
                            }))
                          }
                          className={`p-3 cursor-pointer text-2xl rounded-xl border transition-all flex items-center justify-center ${
                            userProfile.image === Emoji
                              ? "border-green-400 bg-white/20"
                              : "border-white/20 bg-white/10"
                          }`}
                        >
                          <Emoji className="w-8 h-8 text-white" />
                        </button>
                      ))}
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        className="flex-1 bg-white/10 cursor-pointer border border-white/30 text-white py-3 rounded-2xl font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={updateProfile}
                        className="flex-1 bg-gradient-to-r from-green-500 cursor-pointer to-emerald-500 text-white py-3 rounded-2xl font-semibold"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {userProfile.name}
                    </h2>
                    <p className="text-white/70 mb-4">{userProfile.email}</p>
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="bg-white/20 border cursor-pointer border-white/30 text-white px-6 py-2 rounded-2xl font-medium hover:bg-white/30 transition-all"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* stats */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl">
              <h3 className="text-white font-bold text-xl mb-4">
                Your Journey
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                  <p className="text-3xl font-bold text-white">
                    {stats.totalHabits}
                  </p>
                  <p className="text-white/60 text-sm">Total Habits</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                  <p className="text-3xl font-bold text-white">
                    {stats.totalCompletions}
                  </p>
                  <p className="text-white/60 text-sm">Completions</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                  <p className="text-3xl font-bold text-white">
                    {stats.bestStreak}
                  </p>
                  <p className="text-white/60 text-sm">Best Streak</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                  <p className="text-3xl font-bold text-white">
                    {stats.daysActive}
                  </p>
                  <p className="text-white/60 text-sm">Active Days</p>
                </div>
              </div>
            </div>

            {/* achievement badges */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl">
              <h3 className="text-white font-bold text-xl mb-4">
                Achievements
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {milestones
                  .filter((m) => habits.some((h) => h.longestStreak >= m.days))
                  .map((milestone) => (
                    <div
                      key={milestone.days}
                      className="bg-white/5 rounded-2xl p-3 text-center border border-white/10"
                    >
                      <div className="text-2xl mb-1 flex justify-center">
                        <milestone.icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-white/80 text-xs font-medium">
                        {milestone.title}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* interactive milestone markers */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-xl">
                  Milestone Progress
                </h3>
                <button
                  onClick={() => setShowMilestoneMarkers(!showMilestoneMarkers)}
                  className="bg-white/20 border cursor-pointer border-white/30 text-white px-4 py-2 rounded-2xl font-medium hover:bg-white/30 transition-all text-sm"
                >
                  {showMilestoneMarkers ? "Hide" : "Show"} Details
                </button>
              </div>

              {showMilestoneMarkers && (
                <div className="space-y-4">
                  {habits.map((habit) => {
                    const achievedMilestones = getAchievedMilestones(habit);
                    const nextMilestone = getNextMilestone(habit);

                    return (
                      <div
                        key={habit.id}
                        className="bg-white/5 rounded-2xl p-4 border border-white/10"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-xl">
                            <habit.icon className="w-6 h-6 text-white" />
                          </span>
                          <div className="flex-1">
                            <h4 className="text-white font-medium">
                              {habit.name}
                            </h4>
                            <p className="text-white/60 text-sm">
                              Current streak: {habit.streak} days
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {achievedMilestones.map((milestone) => (
                            <div
                              key={milestone.days}
                              className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl px-3 py-1 flex items-center space-x-2"
                            >
                              <span className="text-sm">
                                <milestone.icon className="w-4 h-4 text-white" />
                              </span>
                              <span className="text-green-100 text-xs font-medium">
                                {milestone.title}
                              </span>
                            </div>
                          ))}
                        </div>

                        {nextMilestone && (
                          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white/80 text-sm">
                                Next Milestone:
                              </span>
                              <span className="text-green-300 text-sm font-medium">
                                {nextMilestone.title}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
                                  style={{
                                    width: `${
                                      (habit.streak / nextMilestone.days) * 100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-white/60 text-xs">
                                {habit.streak}/{nextMilestone.days}
                              </span>
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
        );

      case "settings":
        return (
          <div className="space-y-6 mb-6">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>

              <div className="space-y-4">
                {[
                  {
                    icon: Bell,
                    title: "Notifications",
                    subtitle: "Manage your habit reminders",
                  },
                  {
                    icon: Moon,
                    title: "Dark Mode",
                    subtitle: "Switch between themes",
                  },
                  {
                    icon: Download,
                    title: "Data Export",
                    subtitle: "Export your habit data",
                  },
                  {
                    icon: RefreshCw,
                    title: "Sync Settings",
                    subtitle: "Cloud backup options",
                  },
                  {
                    icon: Target,
                    title: "Goal Settings",
                    subtitle: "Customize your targets",
                  },
                  {
                    icon: Smartphone,
                    title: "Widget Settings",
                    subtitle: "Home screen widgets",
                  },
                  {
                    icon: Shield,
                    title: "Privacy",
                    subtitle: "Data and privacy settings",
                  },
                  {
                    icon: HelpCircle,
                    title: "Help & Support",
                    subtitle: "Get help and contact us",
                  },
                ].map((setting, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      showToast("This feature is coming soon!", "info")
                    }
                    className="w-full flex cursor-pointer items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <span className="text-2xl">
                      <setting.icon className="w-6 h-6 text-white" />
                    </span>
                    <div className="flex-1 text-left">
                      <p className="text-white font-medium">{setting.title}</p>
                      <p className="text-white/60 text-sm">
                        {setting.subtitle}
                      </p>
                    </div>
                    <span className="text-white/40">→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "about":
        return (
          <div className="space-y-6 mb-6">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center text-3xl">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent mb-2">
                  Habit Flow
                </h2>
                <p className="text-white/70">Version 1.0.0</p>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <h3 className="text-white font-bold mb-2">About the App</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Habit Flow is a modern, beautifully designed habit tracking
                    app that helps you build better daily routines. Track your
                    progress with stunning circular timelines, celebrate
                    milestones, and transform your life one habit at a time.
                  </p>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <h3 className="text-white font-bold mb-2">Features</h3>
                  <ul className="text-white/80 text-sm space-y-1">
                    <li>• Beautiful glassmorphism design</li>
                    <li>• Circular timeline visualization</li>
                    <li>• Interactive milestone markers</li>
                    <li>• Streak celebrations & animations</li>
                    <li>• Offline-first functionality</li>
                    <li>• Comprehensive analytics</li>
                    <li>• Customizable habit categories</li>
                  </ul>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <h3 className="text-white font-bold mb-2">Developer</h3>
                  <p className="text-white/80 text-sm">
                    Created with ❤️ using React and TypeScript
                  </p>
                </div>

                <div className="text-center">
                  <button
                    onClick={() =>
                      showToast("Thanks for using Habit Flow!", "success")
                    }
                    className="bg-gradient-to-r from-green-500 cursor-pointer to-emerald-500 text-white px-8 py-3 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform transition-all duration-200 hover:scale-105"
                  >
                    Rate This App ⭐
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <>
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 mb-6 shadow-2xl">
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-32 h-32">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#todayGradient)"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 56 * (1 - getTodayCompletionRate() / 100)
                      }`}
                      className="transition-all duration-1000 ease-out"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient
                        id="todayGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {Math.round(getTodayCompletionRate())}%
                    </span>
                    <span className="text-white/60 text-xs">Today</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center bg-white/5 rounded-2xl p-3 border border-white/10">
                  <p className="text-white/60 text-xs uppercase tracking-wide mb-1">
                    Best Streak
                  </p>
                  <p className="text-white text-xl font-bold">
                    {Math.max(...habits.map((h) => h.longestStreak || 0), 0)}
                  </p>
                </div>
                <div className="text-center bg-white/5 rounded-2xl p-3 border border-white/10">
                  <p className="text-white/60 text-xs uppercase tracking-wide mb-1">
                    Active
                  </p>
                  <p className="text-white text-xl font-bold">
                    {habits.filter((h) => calculateStreak(h) > 0).length}
                  </p>
                </div>
                <div className="text-center bg-white/5 rounded-2xl p-3 border border-white/10">
                  <p className="text-white/60 text-xs uppercase tracking-wide mb-1">
                    Habits
                  </p>
                  <p className="text-white text-xl font-bold">
                    {habits.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-2 mb-6 shadow-xl">
              <div className="flex space-x-1">
                {[
                  { id: "overview", label: "Overview", icon: BarChart3 },
                  { id: "timeline", label: "Timeline", icon: CircleDot },
                  { id: "analytics", label: "Analytics", icon: TrendingUp },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setViewMode(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                      viewMode === tab.id
                        ? "bg-white/20 text-white shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span className="text-sm">
                      <tab.icon className="w-4 h-4 text-white" />
                    </span>
                    <span className="text-xs">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 mb-6 shadow-xl">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigateMonth("prev")}
                  className="text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                >
                  <span className="text-xl">
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </span>
                </button>
                <div className="text-center overflow-hidden">
                  <div
                    className={`transition-transform duration-300 ${
                      monthTransition === "left"
                        ? "transform translate-x-full opacity-0"
                        : monthTransition === "right"
                        ? "transform -translate-x-full opacity-0"
                        : "transform translate-x-0 opacity-100"
                    }`}
                  >
                    <h2 className="text-white font-semibold text-lg">
                      {getMonthName(selectedMonth)}
                    </h2>
                    <p className="text-white/50 text-xs">Swipe to navigate</p>
                  </div>
                </div>
                <button
                  onClick={() => navigateMonth("next")}
                  className="text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                >
                  <span className="text-xl">
                    <ChevronRight className="w-4 h-4 text-white" />
                  </span>
                </button>
              </div>
            </div>

            {viewMode === "overview" && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {habits.map((habit) => {
                  const progress = getMonthProgress(habit);
                  const streak = calculateStreak(habit);
                  const nextMilestone = getNextMilestone(habit);
                  const isAnimating = animatingHabit === habit.id;

                  return (
                    <div
                      key={habit.id}
                      onClick={() =>
                        setSelectedHabit(
                          selectedHabit === habit.id ? null : habit.id
                        )
                      }
                      className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                        isAnimating
                          ? "scale-110 shadow-2xl bg-white/20 ring-2 ring-green-400/50"
                          : ""
                      } ${
                        selectedHabit === habit.id
                          ? "ring-2 ring-green-400/50"
                          : ""
                      }`}
                    >
                      <div className="relative w-20 h-20 mx-auto mb-4">
                        <svg className="transform -rotate-90 w-20 h-20">
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="4"
                            fill="transparent"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke={`url(#gradient-${habit.id})`}
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 32}`}
                            strokeDashoffset={`${
                              2 * Math.PI * 32 * (1 - progress / 100)
                            }`}
                            className="transition-all duration-1000 ease-out"
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient
                              id={`gradient-${habit.id}`}
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#10B981" />
                              <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl">
                            <habit.icon className="w-6 h-6 text-white" />
                          </span>
                        </div>
                      </div>

                      <div className="text-center">
                        <h3 className="text-white font-bold text-sm mb-2">
                          {habit.name}
                        </h3>
                        <div className="space-y-2">
                          <div className="bg-white/10 rounded-xl px-3 py-1">
                            <span className="text-white/80 text-xs flex items-center space-x-1">
                              <Flame className="w-3 h-3 text-white" />
                              <span>{streak} days</span>
                            </span>
                          </div>
                          <div className="text-white/60 text-xs">
                            {Math.round(progress)}% this month
                          </div>
                          {nextMilestone && (
                            <div className="text-green-300 text-xs">
                              Next: {nextMilestone.title}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {viewMode === "timeline" && (
              <div className="space-y-6 mb-6">
                {habits.map((habit) => {
                  const timelineData = getCircularTimelineData(habit);
                  const streak = calculateStreak(habit);
                  const progress = getMonthProgress(habit);

                  return (
                    <div
                      key={habit.id}
                      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">
                            <habit.icon className="w-6 h-6 text-white" />
                          </span>
                          <div>
                            <h3 className="text-white font-bold">
                              {habit.name}
                            </h3>
                            <p className="text-white/60 text-sm flex items-center space-x-1">
                              <Flame className="w-3 h-3 text-white" />
                              <span>{streak} day streak</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="relative flex justify-center items-center">
                        <svg width="240" height="240" className="mx-auto">
                          <circle
                            cx="120"
                            cy="120"
                            r="75"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                            strokeDasharray="2,2"
                          />

                          {timelineData.map((day) => (
                            <g key={day.day}>
                              <circle
                                cx={day.x}
                                cy={day.y}
                                r={day.isToday ? "8" : "6"}
                                fill={
                                  day.isCompleted
                                    ? "#10B981"
                                    : day.isToday
                                    ? getCurrentDayCompletions()[habit.id] ===
                                      false
                                      ? "rgba(239, 68, 68, 0.4)"
                                      : "rgba(255, 255, 255, 0.2)"
                                    : "rgba(255, 255, 255, 0.2)"
                                }
                                stroke={day.isToday ? "#FFFFFF" : "none"}
                                strokeWidth={day.isToday ? "2" : "0"}
                                className="transition-all duration-300"
                              />
                              <text
                                x={day.numberX}
                                y={day.numberY + 4}
                                textAnchor="middle"
                                className="fill-white text-xs font-medium"
                                style={{ fontSize: "10px" }}
                              >
                                {day.day}
                              </text>
                            </g>
                          ))}

                          <text
                            x="120"
                            y="115"
                            textAnchor="middle"
                            className="fill-white text-sm font-bold"
                          >
                            {getMonthName(selectedMonth).split(" ")[0]}
                          </text>
                          <text
                            x="120"
                            y="130"
                            textAnchor="middle"
                            className="fill-white/60 text-xs"
                          >
                            {Math.round(progress)}% Complete
                          </text>
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {viewMode === "analytics" && (
              <div className="space-y-6 mb-6">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl">
                  <h3 className="text-white font-bold mb-4">
                    {getMonthName(selectedMonth)} Statistics
                  </h3>
                  <div className="space-y-4">
                    {habits.map((habit) => {
                      const streak = calculateStreak(habit);
                      const progress = getMonthProgress(habit);
                      const completionRate = habit.completedDates.length;

                      return (
                        <div
                          key={habit.id}
                          className="bg-white/5 rounded-2xl p-4 border border-white/10"
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="text-xl">
                              <habit.icon className="w-6 h-6 text-white" />
                            </span>
                            <div className="flex-1">
                              <h4 className="text-white font-medium">
                                {habit.name}
                              </h4>
                              <p className="text-white/60 text-sm">
                                {habit.category}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3 text-center">
                            <div>
                              <p className="text-white/60 text-xs uppercase">
                                Current
                              </p>
                              <p className="text-white font-bold">{streak}d</p>
                            </div>
                            <div>
                              <p className="text-white/60 text-xs uppercase">
                                Best
                              </p>
                              <p className="text-white font-bold">
                                {habit.longestStreak}d
                              </p>
                            </div>
                            <div>
                              <p className="text-white/60 text-xs uppercase">
                                Total
                              </p>
                              <p className="text-white font-bold">
                                {completionRate}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-white/60 mb-1">
                              <span>This Month</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${habit.color} transition-all duration-1000`}
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 overflow-hidden">
      {/* Toast Notifications */}
      <div className="fixed top-4 left-0 right-0 z-[60] flex flex-col items-center space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`backdrop-blur-xl border rounded-2xl px-6 py-3 shadow-2xl transform animate-slide-down ${
              toast.type === "success"
                ? "bg-green-500/20 border-green-400/30 text-green-100"
                : toast.type === "warning"
                ? "bg-yellow-500/20 border-yellow-400/30 text-yellow-100"
                : "bg-blue-500/20 border-blue-400/30 text-blue-100"
            }`}
          >
            <p className="font-medium text-sm">{toast.message}</p>
          </div>
        ))}
      </div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-8 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-6 w-36 h-36 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-12 w-28 h-28 bg-lime-500/15 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20 px-4 py-4 shadow-xl">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                Habit Flow
              </h1>
              <p className="text-white/60 text-xs">
                Welcome back, {userProfile.name.split(" ")[0]}!
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {activeTab === "home" && (
              <>
                <button
                  onClick={() => setShowAddHabit(true)}
                  className="bg-white/20 border border-white/30 text-white p-2 rounded-2xl backdrop-blur-sm hover:bg-white/30 transition-all duration-200 shadow-lg cursor-pointer"
                >
                  <Plus className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => setShowCheckIn(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform transition-all duration-200 hover:scale-105 text-sm cursor-pointer"
                >
                  Check In
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative z-10 max-w-md mx-auto p-4 pb-24 mt-20"
        onTouchStart={activeTab === "home" ? handleTouchStart : undefined}
        onTouchEnd={activeTab === "home" ? handleTouchEnd : undefined}
      >
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-20 backdrop-blur-xl bg-white/10 border-t border-white/20 px-4 py-2 shadow-2xl">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-around">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-2xl transition-all duration-200 cursor-pointer ${
                  activeTab === item.id
                    ? "bg-white/20 shadow-lg transform scale-105"
                    : "hover:bg-white/10"
                }`}
              >
                <span
                  className={`text-xl transition-all duration-200 ${
                    activeTab === item.id ? "transform scale-110" : ""
                  }`}
                >
                  <item.icon className="w-6 h-6 text-white" />
                </span>
                <span
                  className={`text-xs font-medium transition-all duration-200 ${
                    activeTab === item.id ? "text-white" : "text-white/60"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Streak Celebration */}
      {streakCelebration && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 pointer-events-none">
          <div className="text-center transform animate-bounce">
            <div className="text-6xl mb-4 animate-pulse flex justify-center">
              <Flame className="w-16 h-16 text-orange-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {streakCelebration.streak} Day
              {streakCelebration.streak > 1 ? "s" : ""}!
            </h2>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-lime-400 to-green-500 bg-clip-text text-transparent">
              Amazing streak!
            </h3>
          </div>
        </div>
      )}

      {/* Check-in Modal */}
      {showCheckIn && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-2xl bg-white/15 border border-white/30 rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all duration-300 scale-100 max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Daily Check-in
              </h2>
              <p className="text-white/70">
                Mark your completed habits for today
              </p>
              <div className="mt-4 bg-white/10 rounded-2xl p-3">
                <p className="text-white/60 text-sm">
                  {currentDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {habits.map((habit) => {
                const currentCompletions = getCurrentDayCompletions();
                const isCompleted = currentCompletions[habit.id] || false;
                const streak = calculateStreak(habit);

                return (
                  <button
                    key={habit.id}
                    onClick={() => toggleHabitCompletion(habit.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isCompleted
                        ? "bg-white/20 border-green-400/50 shadow-lg shadow-green-400/20"
                        : "bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">
                        <habit.icon className="w-6 h-6 text-white" />
                      </span>
                      <div className="text-left">
                        <span className="text-white font-medium block">
                          {habit.name}
                        </span>
                        <span className="text-white/60 text-sm flex items-center space-x-1">
                          <Flame className="w-3 h-3 text-white" />
                          <span>{streak} days</span>
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        isCompleted
                          ? "bg-green-500 border-green-500 shadow-lg shadow-green-500/30"
                          : "border-white/40 hover:border-white/60"
                      }`}
                    >
                      {isCompleted && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setPendingCompletions({});
                  setShowCheckIn(false);
                }}
                className="flex-1 bg-white/10 border border-white/30 text-white py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-200 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={submitCheckIn}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Habit Modal */}
      {showAddHabit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-2xl bg-white/15 border border-white/30 rounded-3xl p-8 max-w-sm w-full shadow-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Add New Habit
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-white/80 text-sm font-medium block mb-2">
                  Habit Name
                </label>
                <input
                  type="text"
                  value={newHabitForm.name}
                  onChange={(e) =>
                    setNewHabitForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g., Morning Jog"
                  className="w-full bg-white/10 border border-white/30 rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-white/80 text-sm font-medium block mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-6 gap-3">
                  {habitIcons.map((Icon) => (
                    <button
                      key={Icon.name}
                      onClick={() =>
                        setNewHabitForm((prev) => ({ ...prev, icon: Icon }))
                      }
                      className={`bg-white/10 hover:bg-white/20 border rounded-xl p-3 text-xl transition-all duration-200 cursor-pointer flex items-center justify-center ${
                        newHabitForm.icon === Icon
                          ? "border-green-400 bg-white/20"
                          : "border-white/20"
                      }`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-white/80 text-sm font-medium block mb-2">
                  Category
                </label>
                <select
                  value={newHabitForm.category}
                  onChange={(e) =>
                    setNewHabitForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full bg-white/10 border border-white/30 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400/50"
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="bg-slate-800 text-white"
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-8">
              <button
                onClick={() => {
                  setShowAddHabit(false);
                  setNewHabitForm({ name: "", icon: Target, category: "Health" });
                }}
                className="flex-1 bg-white/10 border border-white/30 text-white py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={addNewHabit}
                disabled={!newHabitForm.name.trim()}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
              >
                Add Habit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Milestone Celebration */}
      {celebratingMilestone && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center transform animate-bounce">
            <div className="text-6xl mb-4 animate-pulse flex justify-center">
              <celebratingMilestone.milestone.icon className="w-16 h-16 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Milestone Achieved!
            </h2>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-lime-400 to-green-500 bg-clip-text text-transparent mb-4">
              {celebratingMilestone.milestone.title}
            </h3>
            <p className="text-white/80 mb-6">
              You've completed {celebratingMilestone.milestone.days} days of{" "}
              {habits.find((h) => h.id === celebratingMilestone.habitId)?.name}!
            </p>
            <div className="text-4xl animate-bounce flex justify-center">
              <Sparkles className="w-10 h-10 text-yellow-400" />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HabitTracker;
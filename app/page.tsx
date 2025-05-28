"use client"
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Play,
  Pause,
  RotateCcw,
  User,
  Menu,
  X,
  Share2,
  TrendingUp,
  Activity,
  Clock,
  Target,
  Filter,
  ChevronDown,
  Settings,
  Award,
  Users,
  BarChart3,
  Zap,
  Heart,
  Calendar,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  Home,
  PieChart,
  BookOpen,
  MessageCircle,
  Volume2,
  VolumeX,
  Maximize,
  Star,
  Plus,
  Minus,
  Coffee,
  Apple,
  Dumbbell,
  Timer,
  Trophy,
  ChevronRight,
  PlayCircle,
  Download,
} from "lucide-react";

// Types
interface WorkoutData {
  id: string;
  exercise: string;
  frequency: number;
  intensity: number;
  recovery: number;
  muscleGroup: string;
  duration: number;
  calories: number;
  date: string;
}

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface IntensityZone {
  zone: string;
  percentage: number;
  color: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface WorkoutPlan {
  id: string;
  name: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  exercises: number;
  image: string;
  description: string;
}

interface NutritionItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
}

interface WorkoutSession {
  planId: string;
  planName: string;
  currentExercise: number;
  totalExercises: number;
  exercises: {
    name: string;
    duration: number;
    reps?: number;
    sets?: number;
  }[];
}

interface MealForm {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

// Sample data
const sampleWorkoutData: WorkoutData[] = [
  {
    id: "1",
    exercise: "Push-ups",
    frequency: 85,
    intensity: 75,
    recovery: 60,
    muscleGroup: "Chest",
    duration: 45,
    calories: 120,
    date: "2024-01-15",
  },
  {
    id: "2",
    exercise: "Squats",
    frequency: 90,
    intensity: 80,
    recovery: 45,
    muscleGroup: "Legs",
    duration: 50,
    calories: 150,
    date: "2024-01-15",
  },
  {
    id: "3",
    exercise: "Pull-ups",
    frequency: 70,
    intensity: 85,
    recovery: 70,
    muscleGroup: "Back",
    duration: 35,
    calories: 100,
    date: "2024-01-14",
  },
  {
    id: "4",
    exercise: "Plank",
    frequency: 95,
    intensity: 60,
    recovery: 30,
    muscleGroup: "Core",
    duration: 25,
    calories: 80,
    date: "2024-01-14",
  },
  {
    id: "5",
    exercise: "Deadlifts",
    frequency: 60,
    intensity: 95,
    recovery: 90,
    muscleGroup: "Full Body",
    duration: 60,
    calories: 200,
    date: "2024-01-13",
  },
  {
    id: "6",
    exercise: "Bench Press",
    frequency: 75,
    intensity: 90,
    recovery: 75,
    muscleGroup: "Chest",
    duration: 40,
    calories: 130,
    date: "2024-01-13",
  },
];

const intensityZones: IntensityZone[] = [
  { zone: "Recovery", percentage: 15, color: "#10b981" },
  { zone: "Aerobic", percentage: 25, color: "#3b82f6" },
  { zone: "Threshold", percentage: 35, color: "#f59e0b" },
  { zone: "VO2 Max", percentage: 20, color: "#ef4444" },
  { zone: "Neuromuscular", percentage: 5, color: "#8b5cf6" },
];

const workoutPlans: WorkoutPlan[] = [
  {
    id: "1",
    name: "Full Body Strength",
    duration: "45 min",
    difficulty: "Intermediate",
    exercises: 8,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    description: "Complete full-body workout targeting all major muscle groups",
  },
  {
    id: "2",
    name: "HIIT Cardio Blast",
    duration: "30 min",
    difficulty: "Advanced",
    exercises: 12,
    image:
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&h=250&fit=crop",
    description: "High-intensity interval training for maximum calorie burn",
  },
  {
    id: "3",
    name: "Beginner Yoga Flow",
    duration: "25 min",
    difficulty: "Beginner",
    exercises: 6,
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop",
    description: "Gentle yoga posture sequence perfect for beginners guide ",
  },
];

const muscleGroups = [
  "All",
  "Chest",
  "Back",
  "Legs",
  "Core",
  "Full Body",
  "Arms",
  "Shoulders",
];

// Email validation function
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate user name from email
const generateUserName = (email: string): string => {
  const username = email.split('@')[0];
  return username.charAt(0).toUpperCase() + username.slice(1);
};

const FitPro: React.FC = () => {
  // Refs for scrolling
  const dashboardRef = useRef<HTMLDivElement>(null);
  const analyticsRef = useRef<HTMLDivElement>(null);
  const workoutPlansRef = useRef<HTMLDivElement>(null);
  const nutritionRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const addMealModalRef = useRef<HTMLDivElement>(null);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [loginData, setLoginData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [copied, setCopied] = useState(false);

  const [loginError, setLoginError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authMessage, setAuthMessage] = useState<string>("");

  // UI state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showAddMealModal, setShowAddMealModal] = useState<boolean>(false);
  const [showWorkoutSessionModal, setShowWorkoutSessionModal] =
    useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("dashboard");

  // Workout state
  const [workoutData] = useState<WorkoutData[]>(sampleWorkoutData);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("All");
  const [intensityFilter, setIntensityFilter] = useState<number>(0);
  const [recoveryFilter, setRecoveryFilter] = useState<number>(0);
  const workoutModalRef = useRef<HTMLDivElement>(null);

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);

  // Video state
  const [selectedVideo, setSelectedVideo] = useState<string>("push-ups");
  const [showPoseComparison, setShowPoseComparison] = useState<boolean>(false);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState<boolean>(false);
  const shareModalRef = useRef<HTMLDivElement>(null);

  // Nutrition state
  const [nutritionData, setNutritionData] = useState<NutritionItem[]>([
    {
      id: "1",
      name: "Protein Shake",
      calories: 250,
      protein: 30,
      carbs: 15,
      fat: 5,
      time: "8:00 AM",
    },
    {
      id: "2",
      name: "Chicken Salad",
      calories: 420,
      protein: 35,
      carbs: 25,
      fat: 18,
      time: "12:30 PM",
    },
    {
      id: "3",
      name: "Greek Yogurt",
      calories: 150,
      protein: 15,
      carbs: 12,
      fat: 6,
      time: "3:00 PM",
    },
    {
      id: "4",
      name: "Salmon & Rice",
      calories: 580,
      protein: 40,
      carbs: 45,
      fat: 22,
      time: "7:00 PM",
    },
  ]);
  const [calorieGoal] = useState<number>(2200);
  const [waterIntake, setWaterIntake] = useState<number>(6);
  const [waterGoal] = useState<number>(8);
  const [mealForm, setMealForm] = useState<MealForm>({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  // Calculate daily calories from nutrition data
  const dailyCalories = useMemo(() => {
    return nutritionData.reduce((sum, item) => sum + item.calories, 0);
  }, [nutritionData]);

  // Workout session state
  const [currentWorkoutSession, setCurrentWorkoutSession] =
    useState<WorkoutSession | null>(null);
  const [workoutSessionTimer, setWorkoutSessionTimer] = useState<number>(0);
  const [isWorkoutSessionActive, setIsWorkoutSessionActive] =
    useState<boolean>(false);

  // Workout plans state
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);

  // Filtered data based on filters
  const filteredWorkoutData = useMemo(() => {
    return workoutData.filter((workout) => {
      const muscleGroupMatch =
        selectedMuscleGroup === "All" ||
        workout.muscleGroup === selectedMuscleGroup;
      const intensityMatch =
        intensityFilter === 0 || workout.intensity >= intensityFilter;
      const recoveryMatch =
        recoveryFilter === 0 || workout.recovery <= recoveryFilter;
      return muscleGroupMatch && intensityMatch && recoveryMatch;
    });
  }, [workoutData, selectedMuscleGroup, intensityFilter, recoveryFilter]);

  // Timer effects
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareModalRef.current &&
        !shareModalRef.current.contains(event.target as Node)
      ) {
        setShowShareModal(false);
      }
    };

    if (showShareModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showShareModal]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        addMealModalRef.current &&
        !addMealModalRef.current.contains(event.target as Node)
      ) {
        setShowAddMealModal(false);
      }
    };

    if (showAddMealModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAddMealModal]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        workoutModalRef.current &&
        !workoutModalRef.current.contains(event.target as Node)
      ) {
        setShowWorkoutSessionModal(false);
      }
    };

    if (showWorkoutSessionModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showWorkoutSessionModal]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorkoutSessionActive) {
      interval = setInterval(() => {
        setWorkoutSessionTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutSessionActive]);

  // Body scroll lock for modals
  useEffect(() => {
    const shouldLockScroll =
      showLoginModal ||
      showShareModal ||
      showSettingsModal ||
      isMobileMenuOpen ||
      showAddMealModal ||
      showWorkoutSessionModal;
    if (shouldLockScroll) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [
    showLoginModal,
    showShareModal,
    showSettingsModal,
    isMobileMenuOpen,
    showAddMealModal,
    showWorkoutSessionModal,
  ]);

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionName: string) => {
    const refs = {
      dashboard: dashboardRef,
      analytics: analyticsRef,
      "workout-plans": workoutPlansRef,
      nutrition: nutritionRef,
      community: communityRef,
    };
    setIsMobileMenuOpen(false);

    const targetRef = refs[sectionName as keyof typeof refs];
    setTimeout(() => {
      if (targetRef?.current) {
        const offsetTop =
          targetRef.current.getBoundingClientRect().top + window.scrollY - 100;

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });

        setActiveSection(sectionName);
      }
    }, 100);
  }, []);

  // Authentication handlers
  const handleLogin = useCallback(async () => {
    setLoginError("");

    if (!loginData.email || !loginData.password) {
      setLoginError("Please fill in all fields");
      return;
    }

    if (!isValidEmail(loginData.email)) {
      setLoginError("Invalid email format");
      return;
    }

    if (loginData.password.length < 6) {
      setLoginError("Password must be at least 6 characters long");
      return;
    }

    setIsAuthenticated(true);
    setUser({
      name: generateUserName(loginData.email),
      email: loginData.email,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    });
    setShowLoginModal(false);
    setLoginData({ email: "", password: "" });
    setAuthMessage("Successfully logged in!");
    setTimeout(() => setAuthMessage(""), 3000);
  }, [loginData]);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setAuthMessage("Successfully logged out!");
    setTimeout(() => setAuthMessage(""), 3000);
  }, []);

  // Timer handlers
  const startTimer = useCallback(() => {
    setIsTimerRunning(true);
    if (!workoutStartTime) {
      setWorkoutStartTime(new Date());
    }
  }, [workoutStartTime]);

  const pauseTimer = useCallback(() => {
    setIsTimerRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setWorkoutStartTime(null);
  }, []);

  // Modal handlers
  const closeAllModals = useCallback(() => {
    setShowLoginModal(false);
    setShowShareModal(false);
    setShowSettingsModal(false);
    setIsMobileMenuOpen(false);
    setShowAddMealModal(false);
    setShowWorkoutSessionModal(false);
  }, []);

  // Meal handlers
  const handleAddMeal = useCallback(() => {
    if (!mealForm.name || !mealForm.calories) {
      return;
    }

    const newMeal: NutritionItem = {
      id: Date.now().toString(),
      name: mealForm.name,
      calories: parseInt(mealForm.calories),
      protein: parseInt(mealForm.protein) || 0,
      carbs: parseInt(mealForm.carbs) || 0,
      fat: parseInt(mealForm.fat) || 0,
      time: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };

    setNutritionData((prev) => [...prev, newMeal]);
    setMealForm({ name: "", calories: "", protein: "", carbs: "", fat: "" });
    setShowAddMealModal(false);
    setAuthMessage("Meal added successfully!");
    setTimeout(() => setAuthMessage(""), 3000);
  }, [mealForm]);

  // Workout session handlers
  const startWorkoutSession = useCallback((plan: WorkoutPlan) => {
    const exercises = [
      { name: "Warm-up", duration: 300 },
      { name: "Push-ups", duration: 180, reps: 15, sets: 3 },
      { name: "Squats", duration: 240, reps: 20, sets: 3 },
      { name: "Plank", duration: 120, reps: 1, sets: 3 },
      { name: "Jumping Jacks", duration: 180, reps: 30, sets: 2 },
      { name: "Cool-down", duration: 300 },
    ];

    const session: WorkoutSession = {
      planId: plan.id,
      planName: plan.name,
      currentExercise: 0,
      totalExercises: exercises.length,
      exercises,
    };

    setCurrentWorkoutSession(session);
    setShowWorkoutSessionModal(true);
    setWorkoutSessionTimer(0);
    setIsWorkoutSessionActive(true);
    setSelectedPlan(null);
  }, []);

  const nextExercise = useCallback(() => {
    if (
      currentWorkoutSession &&
      currentWorkoutSession.currentExercise <
        currentWorkoutSession.totalExercises - 1
    ) {
      setCurrentWorkoutSession((prev) =>
        prev
          ? {
              ...prev,
              currentExercise: prev.currentExercise + 1,
            }
          : null
      );
    }
  }, [currentWorkoutSession]);

  const endWorkoutSession = useCallback(() => {
    setCurrentWorkoutSession(null);
    setShowWorkoutSessionModal(false);
    setIsWorkoutSessionActive(false);
    setWorkoutSessionTimer(0);
    setAuthMessage("Workout completed! Great job!");
    setTimeout(() => setAuthMessage(""), 3000);
  }, []);

  // Format time helper
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate workout stats
  const workoutStats = useMemo(() => {
    const totalWorkouts = filteredWorkoutData.length;
    const avgIntensity =
      filteredWorkoutData.reduce((sum, w) => sum + w.intensity, 0) /
        totalWorkouts || 0;
    const totalCalories = filteredWorkoutData.reduce(
      (sum, w) => sum + w.calories,
      0
    );
    const avgRecovery =
      filteredWorkoutData.reduce((sum, w) => sum + w.recovery, 0) /
        totalWorkouts || 0;

    return {
      totalWorkouts,
      avgIntensity: Math.round(avgIntensity),
      totalCalories,
      avgRecovery: Math.round(avgRecovery),
    };
  }, [filteredWorkoutData]);

  // Bubble chart data
  const bubbleChartData = useMemo(() => {
    return filteredWorkoutData.map((workout, index) => ({
      ...workout,
      x: workout.frequency,
      y: workout.intensity,
      size: workout.recovery,
      color: `hsl(${(index * 360) / filteredWorkoutData.length}, 70%, 60%)`,
    }));
  }, [filteredWorkoutData]);

  // Navigation items
  const navItems = [
    { name: "Dashboard", key: "dashboard", icon: Home },
    { name: "Analytics", key: "analytics", icon: PieChart },
    { name: "Workout Plans", key: "workout-plans", icon: Dumbbell },
    { name: "Nutrition", key: "nutrition", icon: Apple },
    { name: "Community", key: "community", icon: Users },
  ];

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4"
        style={{ fontFamily: "Roboto, sans-serif" }}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-8 w-full max-w-md transform transition-all duration-300 hover:scale-105">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              FitPro Analytics
            </h1>
            <p className="text-gray-600">Professional Workout Intelligence</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData((prev) => ({ ...prev, email: e.target.value }))
                }
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{loginError}</span>
              </div>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>

        {authMessage && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-pulse">
            <CheckCircle className="w-5 h-5" />
            <span>{authMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "Roboto, sans-serif" }}
    >
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                FitPro Analytics
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.key)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                    activeSection === item.key
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3">
                <img
                  src={user?.avatar}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-gray-700 hover:text-blue-600 cursor-pointer"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0   bg-opacity-50 z-30 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="md:hidden bg-white border-t border-gray-200 absolute top-full left-0 right-0 z-40 shadow-lg">
              <div className="px-4 py-3 space-y-1 max-h-96 overflow-y-auto">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => scrollToSection(item.key)}
                    className={`flex items-center space-x-3 w-full text-left px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                      activeSection === item.key
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <img
                      src={user?.avatar}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Success Message */}
      {authMessage && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span>{authMessage}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Section */}
        <div ref={dashboardRef} className="mb-16">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Workouts
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {workoutStats.totalWorkouts}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Avg Intensity
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {workoutStats.avgIntensity}%
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Calories
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {workoutStats.totalCalories}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Avg Recovery
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {workoutStats.avgRecovery}min
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Timer */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Filters */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Workout Filters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Muscle Group
                  </label>
                  <select
                    value={selectedMuscleGroup}
                    onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    {muscleGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Min Intensity: {intensityFilter}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={intensityFilter}
                    onChange={(e) => setIntensityFilter(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Max Recovery: {recoveryFilter || "All"}min
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={recoveryFilter}
                    onChange={(e) => setRecoveryFilter(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Workout Timer
              </h3>

              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-mono font-bold text-gray-900 mb-4">
                  {formatTime(timerSeconds)}
                </div>

                <div className="flex justify-center space-x-3">
                  <button
                    onClick={isTimerRunning ? pauseTimer : startTimer}
                    className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    {isTimerRunning ? (
                      <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>

                  <button
                    onClick={resetTimer}
                    className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div ref={analyticsRef} className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Analytics Dashboard
          </h2>

          {/* Charts and Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Bubble Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Exercise Effectiveness
              </h3>
              <div className="relative h-80">
                <svg className="w-full h-full" viewBox="0 0 400 300">
                  {/* Axes */}
                  <line
                    x1="40"
                    y1="260"
                    x2="360"
                    y2="260"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <line
                    x1="40"
                    y1="40"
                    x2="40"
                    y2="260"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />

                  {/* Labels */}
                  <text
                    x="200"
                    y="290"
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                  >
                    Frequency
                  </text>
                  <text
                    x="20"
                    y="150"
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                    transform="rotate(-90 20 150)"
                  >
                    Intensity
                  </text>

                  {/* Bubbles */}
                  {bubbleChartData.map((point, index) => (
                    <g key={point.id}>
                      <circle
                        cx={40 + (point.x / 100) * 320}
                        cy={260 - (point.y / 100) * 220}
                        r={Math.max(5, point.size / 5)}
                        fill={point.color}
                        opacity="0.7"
                        className="transition-all duration-300 hover:opacity-100"
                      />
                      <text
                        x={40 + (point.x / 100) * 320}
                        y={280 - (point.y / 100) * 220}
                        textAnchor="middle"
                        className="text-xs fill-gray-700 pointer-events-none"
                      >
                        {point.exercise}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Intensity Zones */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Intensity Zones
              </h3>
              <div className="space-y-4">
                {intensityZones.map((zone, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: zone.color }}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {zone.zone}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 sm:justify-end">
                      <div className="w-full sm:w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${zone.percentage}%`,
                            backgroundColor: zone.color,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {zone.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Video Demonstration */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sm:gap-0">
              <h3 className="text-lg font-semibold text-gray-900">
                Exercise Demonstrations
              </h3>
              <div className="flex justify-start sm:justify-end space-x-2">
                <button
                  onClick={() => setShowPoseComparison(!showPoseComparison)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                    showPoseComparison
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Target className="w-4 h-4" />
                  <span>Pose Analysis</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative">
                <div className="relative bg-black/50 rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-64 object-cover"
                    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                    poster="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop"
                    controls
                    muted={isVideoMuted}
                    loop
                  />

                  {/* Video Controls Overlay */}
                  <div className="absolute bottom-4 right-4 flex space-x-2 hidden">
                    <button
                      onClick={() => setIsVideoMuted(!isVideoMuted)}
                      className="bg-black/50 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all cursor-pointer"
                    >
                      {isVideoMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => setIsVideoFullscreen(!isVideoFullscreen)}
                      className="bg-black/50 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all cursor-pointer"
                    >
                      <Maximize className="w-4 h-4" />
                    </button>
                  </div>

                  {showPoseComparison && (
                    <div className="absolute inset-0 bg-blue-600 bg-opacity-20 rounded-lg flex items-center justify-center">
                      <div className="bg-white rounded-lg p-4 shadow-lg">
                        <p className="text-sm font-medium text-gray-900">
                          Pose Analysis Active
                        </p>
                        <p className="text-xs text-gray-600">
                          Form: 94% Accurate
                        </p>
                        <div className="mt-2 flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-600">
                            Real-time tracking
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Exercise
                  </label>
                  <select
                    value={selectedVideo}
                    onChange={(e) => setSelectedVideo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="push-ups">Push-ups</option>
                    <option value="squats">Squats</option>
                    <option value="pull-ups">Pull-ups</option>
                    <option value="plank">Plank</option>
                    <option value="deadlifts">Deadlifts</option>
                    <option value="burpees">Burpees</option>
                  </select>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Exercise Tips
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Keep your core engaged throughout the movement</li>
                    <li>• Focus on controlled movements</li>
                    <li>• Listen to your body and rest when needed</li>
                  </ul>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = 0;
                        videoRef.current.play();
                      }
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Start Workout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workout Plans Section */}
        <div ref={workoutPlansRef} className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Workout Plans
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {workoutPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
              >
                <img
                  src={plan.image}
                  alt={plan.name}
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex-1">
                      {plan.name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                        plan.difficulty === "Beginner"
                          ? "bg-green-100 text-green-700"
                          : plan.difficulty === "Intermediate"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {plan.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {plan.description}
                  </p>

                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-4 gap-2">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>{plan.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Dumbbell className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>{plan.exercises} exercises</span>
                    </div>
                  </div>

                  <button
                    onClick={() => startWorkoutSession(plan)}
                    className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Start Workout</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Milestones */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2 sm:gap-0">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Progress Milestones
              </h3>
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer w-full sm:w-auto"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Progress</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Consistency Champion
                </h4>
                <p className="text-sm text-gray-600">7 days workout streak</p>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Intensity Master
                </h4>
                <p className="text-sm text-gray-600">Average 85% intensity</p>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Community Leader
                </h4>
                <p className="text-sm text-gray-600">Top 10% performer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nutrition Section */}
        <div ref={nutritionRef} className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Nutrition Tracking
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Daily Calories */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Coffee className="w-5 h-5 mr-2" />
                Daily Calories
              </h3>

              <div className="relative mb-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (dailyCalories / calorieGoal) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>
                    {dailyCalories} / {calorieGoal} cal
                  </span>
                  <span>
                    {Math.round((dailyCalories / calorieGoal) * 100)}%
                  </span>
                </div>
              </div>

              <div className="space-y-3 max-h-[200px] overflow-y-auto  ">
                {nutritionData.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {item.calories} cal
                      </p>
                      <p className="text-xs text-gray-600">
                        P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowAddMealModal(true)}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Meal</span>
              </button>
            </div>

            {/* Water Intake */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Water Intake
              </h3>

              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {waterIntake}/{waterGoal}
                </div>
                <p className="text-gray-600">Glasses today</p>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-6">
                {Array.from({ length: waterGoal }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      index < waterIntake
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <Coffee className="w-4 h-4" />
                  </div>
                ))}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setWaterIntake(Math.max(0, waterIntake - 1))}
                  className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition-colors cursor-pointer flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setWaterIntake(Math.min(waterGoal, waterIntake + 1))
                  }
                  className="flex-1 bg-blue-100 text-blue-600 py-2 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {waterIntake >= waterGoal && (
                <div className="mt-4 bg-green-100 text-green-700 p-3 rounded-lg text-center">
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Great job! You've reached your daily water goal!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Community Section */}
        <div ref={communityRef} className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Community</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leaderboard */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Weekly Leaderboard
              </h3>

              <div className="space-y-4">
                {[
                  {
                    rank: 1,
                    name: "Sarah Johnson",
                    points: 2840,
                    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
                  },
                  {
                    rank: 2,
                    name: "Mike Chen",
                    points: 2720,
                    avatar:
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
                  },
                  { rank: 3, name: "You", points: 2650, avatar: user?.avatar },
                  {
                    rank: 4,
                    name: "Emma Davis",
                    points: 2580,
                    avatar:
                      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
                  },
                  {
                    rank: 5,
                    name: "Alex Kumar",
                    points: 2520,
                    avatar:
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
                  },
                ].map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      user.name === "You"
                        ? "bg-blue-50 border-2 border-blue-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          user.rank === 1
                            ? "bg-yellow-500 text-white"
                            : user.rank === 2
                            ? "bg-gray-400 text-white"
                            : user.rank === 3
                            ? "bg-amber-600 text-white"
                            : "bg-gray-300 text-gray-700"
                        }`}
                      >
                        {user.rank}
                      </div>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">
                          {user.points} points
                        </p>
                      </div>
                    </div>
                    {user.rank <= 3 && (
                      <Trophy
                        className={`w-5 h-5 ${
                          user.rank === 1
                            ? "text-yellow-500"
                            : user.rank === 2
                            ? "text-gray-400"
                            : "text-amber-600"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Activity Feed
              </h3>

              <div className="space-y-4">
                {[
                  {
                    user: "Sarah Johnson",
                    action: "completed a 45-min HIIT workout",
                    time: "2 hours ago",
                    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
                  },
                  {
                    user: "Mike Chen",
                    action: "achieved a new personal best in squats",
                    time: "4 hours ago",
                    avatar:
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
                  },
                  {
                    user: "Emma Davis",
                    action: "joined the Morning Yoga challenge",
                    time: "6 hours ago",
                    avatar:
                      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
                  },
                  {
                    user: "Alek Johnson",
                    action: "completed a 40Km Marathon",
                    time: "5 hours ago",
                    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                  },
                  {
                    user: "You",
                    action: "completed a strength training session",
                    time: "1 day ago",
                    avatar: user?.avatar,
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={activity.avatar}
                      alt={activity.user}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium text-gray-900">
                          {activity.user}
                        </span>
                        <span className="text-gray-600">
                          {" "}
                          {activity.action}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center">
                {/* <Clock className="h-8 w-8 text-blue-400" /> */}
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-white">
                  FitPro Analytics
                </span>
              </div>
              <p className="mt-4 text-sm text-gray-400">
                Empowering FitPro ideas through community-driven crowdfunding
                for impactful change.
              </p>
              <div className="mt-6 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14v-.648c.959-.689 1.795-1.556 2.455-2.541z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  <span className="sr-only">GitHub</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                Product
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#features"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Discover
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Start a Project
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    How it Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                Company
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Press
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between">
            <p className="text-base text-gray-400">
              &copy; 2025 TimeTrack, Inc. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
      {/* Share Modal */}
      {showShareModal && (
        <>
          {/* <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-40" /> */}
          <div className="fixed inset-0 bg-black/50 bg-opacity-40 z-50 flex items-center justify-center">
            <div
              ref={shareModalRef}
              className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative z-60"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Share Your Progress
                </h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Weekly Summary
                  </h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {workoutStats.totalWorkouts}
                  </p>
                  <p className="text-sm text-gray-600">Workouts Completed</p>
                  <div className="mt-3 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-orange-600">
                        {workoutStats.avgIntensity}%
                      </p>
                      <p className="text-xs text-gray-600">Avg Intensity</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-red-600">
                        {workoutStats.totalCalories}
                      </p>
                      <p className="text-xs text-gray-600">Calories</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">
                        {waterIntake}/{waterGoal}
                      </p>
                      <p className="text-xs text-gray-600">Hydration</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      const shareUrl = encodeURIComponent(window.location.href);
                      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
                      window.open(fbUrl, "_blank");
                      setShowShareModal(false); // close modal
                    }}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={() => {
                      const shareUrl = encodeURIComponent(window.location.href);
                      const text = encodeURIComponent(
                        "Check out my progress on FitPro Analytics!"
                      );
                      const twitterUrl = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${text}`;
                      window.open(twitterUrl, "_blank");
                      setShowShareModal(false); // close modal
                    }}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Twitter</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href); // or any custom link
                    setCopied(true);
                    setShowShareModal(false); // close modal
                    setAuthMessage("Link copied to clipboard!");
                    setTimeout(() => {
                      setCopied(false);

                      setAuthMessage(""); // reset message
                    }, 2000); // 2s delay before closing modal
                  }}
                  className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Copy Link to Clipboard
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add Meal Modal */}
      {showAddMealModal && (
        <>
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex justify-center items-center">
            <div
              ref={addMealModalRef}
              className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add New Meal
                </h3>
                <button
                  onClick={() => setShowAddMealModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meal Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={mealForm.name}
                    onChange={(e) =>
                      setMealForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Grilled Chicken"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calories <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={mealForm.calories}
                      onChange={(e) =>
                        setMealForm((prev) => ({
                          ...prev,
                          calories: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      value={mealForm.protein}
                      onChange={(e) =>
                        setMealForm((prev) => ({
                          ...prev,
                          protein: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="25"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Carbs (g)
                    </label>
                    <input
                      type="number"
                      value={mealForm.carbs}
                      onChange={(e) =>
                        setMealForm((prev) => ({
                          ...prev,
                          carbs: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fat (g)
                    </label>
                    <input
                      type="number"
                      value={mealForm.fat}
                      onChange={(e) =>
                        setMealForm((prev) => ({
                          ...prev,
                          fat: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowAddMealModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMeal}
                    disabled={!mealForm.name || !mealForm.calories}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Add Meal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Workout Session Modal */}
      {showWorkoutSessionModal && currentWorkoutSession && (
        <>
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex justify-center items-center">
            <div
              ref={workoutModalRef}
              className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentWorkoutSession.planName}
                </h3>
                <div className="text-4xl font-mono font-bold text-blue-600 mb-2">
                  {formatTime(workoutSessionTimer)}
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <span>
                    Exercise {currentWorkoutSession.currentExercise + 1} of{" "}
                    {currentWorkoutSession.totalExercises}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {
                      currentWorkoutSession.exercises[
                        currentWorkoutSession.currentExercise
                      ]?.name
                    }
                  </h4>

                  {currentWorkoutSession.exercises[
                    currentWorkoutSession.currentExercise
                  ]?.reps && (
                    <div className="flex justify-center space-x-4 text-sm text-gray-600 mb-4">
                      <span>
                        {
                          currentWorkoutSession.exercises[
                            currentWorkoutSession.currentExercise
                          ].reps
                        }{" "}
                        reps
                      </span>
                      <span>×</span>
                      <span>
                        {
                          currentWorkoutSession.exercises[
                            currentWorkoutSession.currentExercise
                          ].sets
                        }{" "}
                        sets
                      </span>
                    </div>
                  )}

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          ((currentWorkoutSession.currentExercise + 1) /
                            currentWorkoutSession.totalExercises) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={endWorkoutSession}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                >
                  End
                </button>

                {currentWorkoutSession.currentExercise <
                currentWorkoutSession.totalExercises - 1 ? (
                  <button
                    onClick={nextExercise}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>Next </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={endWorkoutSession}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Complete</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Workout Plan Modal */}
      {selectedPlan && (
        <>
          <div
            className="fixed inset-0 bg-black/50 bg-opacity-50 z-40"
            onClick={() => setSelectedPlan(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedPlan.name}
                </h3>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <img
                src={selectedPlan.image}
                alt={selectedPlan.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{selectedPlan.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Dumbbell className="w-4 h-4" />
                    <span>{selectedPlan.exercises} exercises</span>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      selectedPlan.difficulty === "Beginner"
                        ? "bg-green-100 text-green-700"
                        : selectedPlan.difficulty === "Intermediate"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedPlan.difficulty}
                  </span>
                </div>

                <p className="text-gray-600">{selectedPlan.description}</p>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    What you'll need:
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Exercise mat</li>
                    <li>• Dumbbells (optional)</li>
                    <li>• Water bottle</li>
                    <li>• Towel</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => startWorkoutSession(selectedPlan)}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <PlayCircle className="w-5 h-5" />
                    <span>Start Now</span>
                  </button>
                  <button className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Schedule</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FitPro;
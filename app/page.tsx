"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  Area,
  AreaChart,
  BarChart,
  Bar,
} from "recharts";
import {
  Moon,
  Sun,
  User,
  Menu,
  Activity,
  Heart,
  Award,
  Calendar,
  MapPin,
  ChevronDown,
  Clock,
  TrendingUp,
  BarChart as BarChartIcon,
  Flame,
  Plus,
  Layers,
  Compass,
  PlusCircle,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


interface TrainingProgress {
  type: string;
  percentage: number;
  details: string;
  color: string;
  icon: React.ReactNode;
}

interface HeartRateData {
  time: number;
  value: number;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface RunningActivity {
  route: string;
  startTime: string;
  endTime: string;
  distance: string;
  distanceValue: number;
  distanceUnit: string;
  totalTime: string;
  totalTimeValue: number;
  totalSteps: string;
  totalStepsValue: number;
  totalCalories: string;
  totalCaloriesValue: number;
  averagePace: string;
  coordinates: Coordinates[];
  startCoordinate: Coordinates;
  endCoordinate: Coordinates;
  mapCenter: Coordinates;
  mapZoom: number;
}

interface MealItem {
  name: string;
  description: string;
  calories: number;
  image: string;
  time?: string;
  healthScore: number;
  dayOfWeek?: string;
}

interface MealData {
  type: string;
  isWeekly: boolean;
  meals: MealItem[];
  primaryMeal?: MealItem;
  difficulty?: string;
  duration?: string;
  calories?: number;
  carbs?: number;
  protein?: number;
  fats?: number;
  healthScore?: number;
}

interface ProfileData {
  name: string;
  level: string;
  points: string;
  weight: string;
  height: string;
  age: string;
  avatar: string;
}

interface DashboardMode {
  id: string;
  name: string;
  isWeekly: boolean;
  heartRate: number;
  heartStatus: string;
  healthScore: number;
  healthStatus: string;
  goalCompletion: number;
  trainingProgress: TrainingProgress[];
  heartRateData: HeartRateData[];
  runningActivity: RunningActivity;
  mealData: MealData;
  weeklyHealthData?: {
    day: string;
    score: number;
  }[];
}

const generateECGData = (
  baseValue: number,
  pattern: string
): HeartRateData[] => {
  const data: HeartRateData[] = [];

  const patterns = {
    normal: [0, 0, 0, 0, 5, 10, -5, -20, 80, -30, 10, 0, 0, 0, 0],
    active: [0, 0, 0, 5, 15, -10, -25, 100, -40, 10, 0, 0, 0],
    relaxed: [0, 0, 0, 0, 0, 3, 7, -3, -15, 60, -20, 5, 0, 0, 0, 0, 0],
    moderate: [0, 0, 0, 8, 12, -7, -22, 85, -35, 12, 2, 0, 0, 0],
  };

  const selectedPattern =
    patterns[pattern as keyof typeof patterns] || patterns.normal;
  const amplitude = pattern === "active" ? 60 : pattern === "relaxed" ? 40 : 50;

  for (let i = 0; i < 4; i++) {
    selectedPattern.forEach((value, index) => {
      data.push({
        time: i * selectedPattern.length + index,
        value: baseValue + (value * amplitude) / 100,
      });
    });
  }

  return data;
};

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } }
};

const slideInFromBottom = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const slideInFromLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

const slideInFromRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20, 
      duration: 0.5 
    } 
  }
};

const FitnessDashboard: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [currentMode, setCurrentMode] = useState<string>("today");
  const [mapType, setMapType] = useState<string>("roadmap");
  const [mapZoom, setMapZoom] = useState<number>(14);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("Manual addition is not available currently");

  const mapRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const startDragPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mapPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const hours = new Date().getHours();
    setDarkMode(hours < 6 || hours >= 18);
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const mealImages = {
    salmon: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    chicken: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    bowl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    breakfast: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    lunch: "https://images.unsplash.com/photo-1547496502-affa22d38842?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    snack: "https://images.unsplash.com/photo-1585853131366-13d1e681e08e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    dinner2: "https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    veggieBowl: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    pasta: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    curry: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  };

  const dashboardModes: DashboardMode[] = [
    {
      id: "today",
      name: "Today",
      isWeekly: false,
      heartRate: 110,
      heartStatus: "Normal",
      healthScore: 82,
      healthStatus: "Very Healthy",
      goalCompletion: 75,
      trainingProgress: [
        {
          type: "Cardio Training",
          percentage: 85,
          details: "5/6 sets of HIIT session",
          color: "#BFDBFE",
          icon: <Heart className="h-4 w-4 text-blue-500" />,
        },
        {
          type: "Strength Training",
          percentage: 75,
          details: "4/5 sets of full-body strength circuit",
          color: "#FEF08A",
          icon: <TrendingUp className="h-4 w-4 text-yellow-500" />,
        },
        {
          type: "Flexibility Training",
          percentage: 65,
          details: "3/4 sets of yoga sessions",
          color: "#BBF7D0",
          icon: <Activity className="h-4 w-4 text-green-500" />,
        },
      ],
      heartRateData: generateECGData(110, "normal"),
      runningActivity: {
        route: "Central Park Loop Trail",
        startTime: "6:30 AM",
        endTime: "7:20 AM",
        distance: "5 miles (8 km)",
        distanceValue: 5,
        distanceUnit: "miles",
        totalTime: "50 minutes",
        totalTimeValue: 50,
        totalSteps: "10,500 steps",
        totalStepsValue: 10500,
        totalCalories: "450 Cal",
        totalCaloriesValue: 450,
        averagePace: "10 minutes/mile",
        coordinates: [
          { lat: 40.764, lng: -73.973 },
          { lat: 40.767, lng: -73.981 },
          { lat: 40.772, lng: -73.979 },
          { lat: 40.775, lng: -73.969 },
          { lat: 40.771, lng: -73.965 },
          { lat: 40.764, lng: -73.973 },
        ],
        startCoordinate: { lat: 40.764, lng: -73.973 },
        endCoordinate: { lat: 40.764, lng: -73.973 },
        mapCenter: { lat: 40.768, lng: -73.973 },
        mapZoom: 14,
      },
      mealData: {
        type: "Dinner",
        isWeekly: false,
        primaryMeal: {
          name: "Lean & Green",
          description: "Baked Salmon with Steamed Broccoli and Brown Rice",
          calories: 450,
          image: mealImages.salmon,
          healthScore: 85,
        },
        meals: [],
        difficulty: "Easy",
        duration: "30 minutes",
        calories: 450,
        carbs: 40,
        protein: 35,
        fats: 15,
        healthScore: 85,
      },
    },
    // TODO: add more dashboard modes here
    {
      id: "yesterday",
      name: "Yesterday",
      isWeekly: false,
      heartRate: 115,
      heartStatus: "Active",
      healthScore: 79,
      healthStatus: "Healthy",
      goalCompletion: 68,
      trainingProgress: [
        {
          type: "Cardio Training",
          percentage: 80,
          details: "4/5 sets of treadmill intervals",
          color: "#BFDBFE",
          icon: <Heart className="h-4 w-4 text-blue-500" />,
        },
        {
          type: "Strength Training",
          percentage: 65,
          details: "3/5 sets of upper body workout",
          color: "#FEF08A",
          icon: <TrendingUp className="h-4 w-4 text-yellow-500" />,
        },
        {
          type: "Flexibility Training",
          percentage: 60,
          details: "2/3 sets of stretching routines",
          color: "#BBF7D0",
          icon: <Activity className="h-4 w-4 text-green-500" />,
        },
      ],
      heartRateData: generateECGData(115, "active"),
      runningActivity: {
        route: "Riverside Park Trail",
        startTime: "7:15 AM",
        endTime: "8:00 AM",
        distance: "4.2 miles (6.8 km)",
        distanceValue: 4.2,
        distanceUnit: "miles",
        totalTime: "45 minutes",
        totalTimeValue: 45,
        totalSteps: "9,800 steps",
        totalStepsValue: 9800,
        totalCalories: "410 Cal",
        totalCaloriesValue: 410,
        averagePace: "10.7 minutes/mile",
        coordinates: [
          { lat: 40.801, lng: -73.972 },
          { lat: 40.807, lng: -73.975 },
          { lat: 40.814, lng: -73.98 },
          { lat: 40.819, lng: -73.974 },
          { lat: 40.812, lng: -73.969 },
          { lat: 40.801, lng: -73.972 },
        ],
        startCoordinate: { lat: 40.801, lng: -73.972 },
        endCoordinate: { lat: 40.801, lng: -73.972 },
        mapCenter: { lat: 40.81, lng: -73.975 },
        mapZoom: 14,
      },
      mealData: {
        type: "Dinner",
        isWeekly: false,
        primaryMeal: {
          name: "Protein Power",
          description: "Grilled Chicken with Quinoa and Roasted Vegetables",
          calories: 520,
          image: mealImages.chicken,
          healthScore: 82,
        },
        meals: [],
        difficulty: "Medium",
        duration: "35 minutes",
        calories: 520,
        carbs: 45,
        protein: 42,
        fats: 18,
        healthScore: 82,
      },
    },
    {
      id: "thisWeek",
      name: "This Week",
      isWeekly: true,
      heartRate: 105,
      heartStatus: "Relaxed",
      healthScore: 85,
      healthStatus: "Very Healthy",
      goalCompletion: 80,
      trainingProgress: [
        {
          type: "Cardio Training",
          percentage: 90,
          details: "15/16 cardio sessions completed",
          color: "#BFDBFE",
          icon: <Heart className="h-4 w-4 text-blue-500" />,
        },
        {
          type: "Strength Training",
          percentage: 85,
          details: "12/14 strength sessions completed",
          color: "#FEF08A",
          icon: <TrendingUp className="h-4 w-4 text-yellow-500" />,
        },
        {
          type: "Flexibility Training",
          percentage: 70,
          details: "7/10 flexibility sessions completed",
          color: "#BBF7D0",
          icon: <Activity className="h-4 w-4 text-green-500" />,
        },
      ],
      heartRateData: generateECGData(105, "relaxed"),
      runningActivity: {
        route: "Weekly Challenge Routes",
        startTime: "Avg. 6:45 AM",
        endTime: "Avg. 7:35 AM",
        distance: "23.5 miles (37.8 km)",
        distanceValue: 23.5,
        distanceUnit: "miles",
        totalTime: "235 minutes",
        totalTimeValue: 235,
        totalSteps: "48,900 steps",
        totalStepsValue: 48900,
        totalCalories: "2,150 Cal",
        totalCaloriesValue: 2150,
        averagePace: "10 minutes/mile",
        coordinates: [
          { lat: 40.73, lng: -73.997 },
          { lat: 40.738, lng: -74.001 },
          { lat: 40.742, lng: -73.989 },
          { lat: 40.735, lng: -73.978 },
          { lat: 40.725, lng: -73.985 },
          { lat: 40.73, lng: -73.997 },
        ],
        startCoordinate: { lat: 40.73, lng: -73.997 },
        endCoordinate: { lat: 40.73, lng: -73.997 },
        mapCenter: { lat: 40.734, lng: -73.99 },
        mapZoom: 13,
      },
      mealData: {
        type: "Weekly Meal Plan",
        isWeekly: true,
        meals: [
          {
            name: "Mediterranean Bowl",
            description: "Whole grains, vegetables, olive oil",
            calories: 480,
            image: mealImages.bowl,
            healthScore: 90,
            dayOfWeek: "Mon",
          },
          {
            name: "Grilled Salmon",
            description: "With roasted vegetables and quinoa",
            calories: 520,
            image: mealImages.salmon,
            healthScore: 95,
            dayOfWeek: "Tue",
          },
          {
            name: "Chicken Salad",
            description: "Mixed greens with grilled chicken",
            calories: 420,
            image: mealImages.chicken,
            healthScore: 88,
            dayOfWeek: "Wed",
          },
          {
            name: "Veggie Stir-Fry",
            description: "Tofu with mixed vegetables",
            calories: 380,
            image: mealImages.salad,
            healthScore: 92,
            dayOfWeek: "Thu",
          },
          {
            name: "Grilled Fish",
            description: "With steamed vegetables and brown rice",
            calories: 450,
            image: mealImages.dinner2,
            healthScore: 94,
            dayOfWeek: "Fri",
          },
          {
            name: "Curry Bowl",
            description: "Vegetable curry with brown rice",
            calories: 490,
            image: mealImages.curry,
            healthScore: 87,
            dayOfWeek: "Sat",
          },
          {
            name: "Pasta Primavera",
            description: "Whole wheat pasta with vegetables",
            calories: 510,
            image: mealImages.pasta,
            healthScore: 86,
            dayOfWeek: "Sun",
          },
        ],
        healthScore: 90,
      },
      weeklyHealthData: [
        { day: "Mon", score: 83 },
        { day: "Tue", score: 85 },
        { day: "Wed", score: 82 },
        { day: "Thu", score: 88 },
        { day: "Fri", score: 85 },
        { day: "Sat", score: 87 },
        { day: "Sun", score: 84 },
      ],
    },
    {
      id: "lastWeek",
      name: "Last Week",
      isWeekly: true,
      heartRate: 112,
      heartStatus: "Moderate",
      healthScore: 77,
      healthStatus: "Healthy",
      goalCompletion: 65,
      trainingProgress: [
        {
          type: "Cardio Training",
          percentage: 75,
          details: "12/16 cardio sessions completed",
          color: "#BFDBFE",
          icon: <Heart className="h-4 w-4 text-blue-500" />,
        },
        {
          type: "Strength Training",
          percentage: 60,
          details: "9/14 strength sessions completed",
          color: "#FEF08A",
          icon: <TrendingUp className="h-4 w-4 text-yellow-500" />,
        },
        {
          type: "Flexibility Training",
          percentage: 50,
          details: "5/10 flexibility sessions completed",
          color: "#BBF7D0",
          icon: <Activity className="h-4 w-4 text-green-500" />,
        },
      ],
      heartRateData: generateECGData(112, "moderate"),
      runningActivity: {
        route: "Last Week's Routes",
        startTime: "Avg. 7:00 AM",
        endTime: "Avg. 7:50 AM",
        distance: "18.8 miles (30.3 km)",
        distanceValue: 18.8,
        distanceUnit: "miles",
        totalTime: "200 minutes",
        totalTimeValue: 200,
        totalSteps: "40,500 steps",
        totalStepsValue: 40500,
        totalCalories: "1,850 Cal",
        totalCaloriesValue: 1850,
        averagePace: "10.6 minutes/mile",
        coordinates: [
          { lat: 40.75, lng: -73.98 },
          { lat: 40.755, lng: -73.99 },
          { lat: 40.765, lng: -73.985 },
          { lat: 40.76, lng: -73.97 },
          { lat: 40.745, lng: -73.975 },
          { lat: 40.75, lng: -73.98 },
        ],
        startCoordinate: { lat: 40.75, lng: -73.98 },
        endCoordinate: { lat: 40.75, lng: -73.98 },
        mapCenter: { lat: 40.755, lng: -73.98 },
        mapZoom: 13,
      },
      mealData: {
        type: "Last Week's Meals",
        isWeekly: true,
        meals: [
          {
            name: "Asian Rice Bowl",
            description: "Rice with vegetables and tofu",
            calories: 450,
            image: mealImages.bowl,
            healthScore: 82,
            dayOfWeek: "Mon",
          },
          {
            name: "Grilled Chicken",
            description: "With vegetables and sweet potato",
            calories: 490,
            image: mealImages.chicken,
            healthScore: 78,
            dayOfWeek: "Tue",
          },
          {
            name: "Pasta Salad",
            description: "Whole grain pasta with vegetables",
            calories: 520,
            image: mealImages.pasta,
            healthScore: 75,
            dayOfWeek: "Wed",
          },
          {
            name: "Fish Tacos",
            description: "Grilled fish with cabbage slaw",
            calories: 480,
            image: mealImages.salmon,
            healthScore: 80,
            dayOfWeek: "Thu",
          },
          {
            name: "Stir Fry",
            description: "Mixed vegetables with brown rice",
            calories: 410,
            image: mealImages.dinner2,
            healthScore: 85,
            dayOfWeek: "Fri",
          },
          {
            name: "Avocado Toast",
            description: "Whole grain bread with avocado",
            calories: 390,
            image: mealImages.veggieBowl,
            healthScore: 82,
            dayOfWeek: "Sat",
          },
          {
            name: "Vegetable Curry",
            description: "Curry with coconut milk and rice",
            calories: 470,
            image: mealImages.curry,
            healthScore: 79,
            dayOfWeek: "Sun",
          },
        ],
        healthScore: 78,
      },
      weeklyHealthData: [
        { day: "Mon", score: 75 },
        { day: "Tue", score: 78 },
        { day: "Wed", score: 74 },
        { day: "Thu", score: 80 },
        { day: "Fri", score: 78 },
        { day: "Sat", score: 79 },
        { day: "Sun", score: 77 },
      ],
    },
  ];

  const getCurrentModeData = (): DashboardMode => {
    return (
      dashboardModes.find((mode) => mode.id === currentMode) ||
      dashboardModes[0]
    );
  };

  const modeData = getCurrentModeData();

  const renderHealthScoreIndicators = () => {
    const scoreSegments = [
      { value: 20, color: "#BFDBFE", active: modeData.healthScore >= 20 },
      { value: 40, color: "#93C5FD", active: modeData.healthScore >= 40 },
      { value: 60, color: "#60A5FA", active: modeData.healthScore >= 60 },
      { value: 80, color: "#3B82F6", active: modeData.healthScore >= 80 },
      { value: 100, color: "#2563EB", active: modeData.healthScore >= 100 },
    ];

    return (
      <motion.div 
        className="flex items-center space-x-2 w-full"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {scoreSegments.map((segment, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, scaleX: 0 },
              visible: { 
                opacity: segment.active ? 1 : 0.3, 
                scaleX: 1,
                transition: { 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }
              }
            }}
            className={`h-2 rounded-full origin-left`}
            style={{
              backgroundColor: segment.active
                ? segment.color
                : darkMode
                ? "#4B5563"
                : "#E5E7EB",
              flex: 1,
            }}
          ></motion.div>
        ))}
      </motion.div>
    );
  };

  const profileData: ProfileData = {
    name: "Kalendra Wingman", 
    level: "Advanced",
    points: "14,750",
    weight: "75 kg",
    height: "175 cm",
    age: "29 yrs",
    avatar:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
  };

  const CustomizedDot = (props: any) => {
    const { cx, cy, payload, index } = props;

    const getPatternValue = () => {
      if (currentMode === "today") return 15;
      if (currentMode === "yesterday") return 13;
      if (currentMode === "thisWeek") return 17;
      return 14;
    };

    const patternValue = getPatternValue();

    if (payload.time % patternValue === 6) {
      return <circle cx={cx} cy={cy} r={2} fill="#991B1B" />;
    }
    return null;
  };

  const ProgressCircle = ({
    percentage,
    color,
    radius = 40,
    strokeWidth = 8,
    className = "",
  }: {
    percentage: number;
    color: string;
    radius?: number;
    strokeWidth?: number;
    className?: string;
  }) => {
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    return (
      <svg height={radius * 2} width={radius * 2} className={className}>
        <circle
          stroke={darkMode ? "#374151" : "#E5E7EB"}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + " " + circumference}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius} ${radius})`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ 
            strokeDashoffset: circumference - (percentage / 100) * circumference 
          }}
          transition={{ 
            duration: 1.5, 
            ease: "easeInOut",
            delay: 0.3
          }}
        />
      </svg>
    );
  };


  const renderWeeklyMealCard = () => {
    const { mealData } = modeData;

    return (
      <div className={`rounded-xl shadow-xl overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"} transition-all duration-300 col-span-full lg:col-span-3`}>
        <div className="p-4 md:p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-green-500" />
              {mealData.type}
            </h3>
            <div className={`px-3 py-1 rounded-full text-xs ${darkMode ? "bg-gray-700 text-green-400" : "bg-green-100 text-green-800"}`}>
              Avg. Score: {mealData.healthScore}/100
            </div>
          </div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-7 gap-3 mb-2"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {mealData.meals.map((meal, idx) => (
              <motion.div
                key={idx}
                className={`rounded-lg overflow-hidden shadow-sm ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100"} transition-all duration-200 hover:shadow-md cursor-pointer group`}
                variants={scaleIn}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <div
                  className="h-24 w-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url(${meal.image})` }}
                ></div>
                <div className="p-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-medium ${darkMode ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"} px-2 py-0.5 rounded`}>
                      {meal.dayOfWeek}
                    </span>
                    <span className="text-xs text-gray-500">
                      {meal.calories} cal
                    </span>
                  </div>
                  <h4 className="font-medium text-sm line-clamp-1">
                    {meal.name}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {meal.description}
                  </p>
                  <div className="mt-1 h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${meal.healthScore}%`,
                        backgroundColor: meal.healthScore > 85 ? "#10B981" : "#60A5FA"
                      }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    ></motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center">
              <div className="text-sm font-medium mr-2">
                Nutritional Balance:
              </div>
              <div className="flex -space-x-1">
                <div className="w-5 h-5 rounded-full bg-blue-400 flex items-center justify-center text-xs text-white font-bold">
                  P
                </div>
                <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-xs text-white font-bold">
                  C
                </div>
                <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center text-xs text-white font-bold">
                  F
                </div>
              </div>
              <div className="ml-2 text-xs text-gray-500">35% | 45% | 20%</div>
            </div>
            <motion.button
              onClick={() => {
                setToastMessage("Manual meal addition is not available currently");
                setShowToast(true);
              }}
              className={`flex items-center px-3 py-1.5 rounded-full text-xs ${darkMode
                  ? "bg-green-700 text-white hover:bg-green-600"
                  : "bg-green-500 text-white hover:bg-green-600"
              } transition-colors duration-200 cursor-pointer`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PlusCircle className="h-3.5 w-3.5 mr-1" />
              Add Meal
            </motion.button>
          </div>
        </div>
      </div>
    );
  };

  const renderDailyMealCard = () => {
    const { mealData } = modeData;
    const meal = mealData.primaryMeal!;

    return (
      <div className={`rounded-xl shadow-xl overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"} transition-all duration-300 col-span-full lg:col-span-3`}>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-2/5 lg:w-1/3">
            <motion.div
              className="h-48 md:h-full bg-cover bg-center cursor-pointer"
              style={{ backgroundImage: `url(${meal.image})` }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
          <div className="w-full md:w-3/5 lg:w-2/3 p-4 md:p-5">
            <div className="flex justify-between items-center mb-3">
              <div className={`px-3 py-1 rounded-full text-xs ${darkMode ? "bg-gray-700 text-green-400" : "bg-green-100 text-green-800"}`}>
                {mealData.type}
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {mealData.duration}
              </div>
            </div>

            <h3 className="font-semibold text-lg mb-1">{meal.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{meal.description}</p>

            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} hover:shadow-md transition-shadow duration-200 cursor-pointer`}
                variants={scaleIn}
                whileHover={{ y: -3 }}
              >
                <div className="text-xs text-gray-500">Calories</div>
                <div className="font-medium flex items-center">
                  <Flame className="h-3 w-3 mr-1 text-orange-500" />
                  {mealData.calories} cal
                </div>
              </motion.div>
              <motion.div
                className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} hover:shadow-md transition-shadow duration-200 cursor-pointer`}
                variants={scaleIn}
                whileHover={{ y: -3 }}
              >
                <div className="text-xs text-gray-500">Carbs</div>
                <div className="font-medium flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 mr-1"></div>
                  {mealData.carbs}g
                </div>
              </motion.div>
              <motion.div
                className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} hover:shadow-md transition-shadow duration-200 cursor-pointer`}
                variants={scaleIn}
                whileHover={{ y: -3 }}
              >
                <div className="text-xs text-gray-500">Protein</div>
                <div className="font-medium flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-400 mr-1"></div>
                  {mealData.protein}g
                </div>
              </motion.div>
              <motion.div
                className={`p-3 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-50"
                } hover:shadow-md transition-shadow duration-200 cursor-pointer`}
                variants={scaleIn}
                whileHover={{ y: -3 }}
              >
                <div className="text-xs text-gray-500">Fats</div>
                <div className="font-medium flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-400 mr-1"></div>
                  {mealData.fats}g
                </div>
              </motion.div>
            </motion.div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="text-sm">Health Score:</div>
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${mealData.healthScore}%`,
                      backgroundColor: (mealData.healthScore || 0) >= 80 ? "#10B981" : "#60A5FA"
                    }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  ></motion.div>
                </div>
                <div className="text-sm font-medium">
                  {mealData.healthScore}/100
                </div>
              </div>

              <motion.button
                onClick={() => {
                  setToastMessage("Manual meal addition is not available currently");
                  setShowToast(true);
                }}
                className={`flex items-center px-3 py-1.5 rounded-full text-xs ${darkMode
                  ? "bg-green-700 text-white hover:bg-green-600"
                  : "bg-green-500 text-white hover:bg-green-600"
                } transition-colors duration-200 cursor-pointer`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlusCircle className="h-3.5 w-3.5 mr-1" />
                Add Meal
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getThemeColors = () => {
    return {
      bgPrimary: darkMode ? "bg-gray-900" : "bg-gray-100",
      bgSecondary: darkMode ? "bg-gray-800" : "bg-white",
      textPrimary: darkMode ? "text-white" : "text-gray-800",
      textSecondary: darkMode ? "text-gray-300" : "text-gray-600",
      heartBeatCard: darkMode ? "bg-emerald-900 bg-opacity-30" : "bg-green-100",
      healthScoreCard: darkMode ? "bg-blue-900 bg-opacity-30" : "bg-blue-100",
      accent: darkMode ? "text-emerald-400" : "text-emerald-500",
      accentHover: darkMode ? "hover:text-emerald-300" : "hover:text-emerald-600",
      borderColor: darkMode ? "border-gray-700" : "border-gray-200",
      menuHover: darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100",
      shadow: darkMode
        ? "shadow-lg shadow-gray-900/20"
        : "shadow-xl shadow-gray-200/40",
      buttonPrimary: darkMode
        ? "bg-emerald-700 hover:bg-emerald-600 text-white"
        : "bg-emerald-500 hover:bg-emerald-600 text-white",
      buttonSecondary: darkMode
        ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
        : "bg-gray-200 hover:bg-gray-300 text-gray-700",
      progressBg: darkMode ? "bg-gray-700" : "bg-gray-200",
    };
  };

  const theme = getThemeColors();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.bgPrimary} ${theme.textPrimary}`}>
      <AnimatePresence>
        {showToast && (
          <motion.div 
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`px-4 py-3 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center`}>
              <div className={`mr-3 p-1 rounded-full ${
                toastMessage.includes("Exercise") 
                  ? darkMode ? 'bg-blue-900/30' : 'bg-blue-100' 
                  : darkMode ? 'bg-amber-900/30' : 'bg-amber-100'
              }`}>
                {toastMessage.includes("Exercise") ? (
                  <Activity className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-sm font-medium">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <header className={`sticky top-0 z-50 ${theme.bgSecondary} bg-opacity-95 backdrop-blur-sm ${theme.shadow}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className={`h-10 w-10 rounded-xl flex items-center justify-center ${darkMode ? "bg-gradient-to-br from-emerald-500 to-blue-600" : "bg-gradient-to-br from-emerald-400 to-blue-500"} shadow-lg`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap className="h-6 w-6 text-white" />
              </motion.div>
              <motion.h1 
                className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-500"
                whileHover={{ scale: 1.05 }}
              >
                FitTrack Pro
              </motion.h1>
            </motion.div>

            <motion.div 
              className="hidden md:flex items-center justify-center flex-1 max-w-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className={`flex p-1 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                {dashboardModes.map((mode, index) => (
                  <motion.button
                    key={mode.id}
                    onClick={() => setCurrentMode(mode.id)}
                    className={`text-sm font-medium py-2 px-4 rounded-full transition-all duration-200 cursor-pointer ${currentMode === mode.id
                        ? `${darkMode ? "bg-gray-800" : "bg-white"} shadow-md ${theme.accent}`
                        : darkMode
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {mode.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full ${theme.buttonSecondary} transition-colors duration-200 cursor-pointer`}
                aria-label="Toggle dark mode"
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </motion.button>

              <motion.button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-full text-gray-500 hover:text-gray-700 transition-colors duration-200 cursor-pointer"
                aria-label="Open menu"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Menu className="h-5 w-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              className={`md:hidden ${theme.bgSecondary} py-4 px-4 shadow-md border-t ${theme.borderColor}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-3">Dashboard Mode</h3>
                <motion.div 
                  className="grid grid-cols-2 gap-2"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {dashboardModes.map((mode) => (
                    <motion.button
                      key={mode.id}
                      onClick={() => {
                        setCurrentMode(mode.id);
                        setMenuOpen(false);
                      }}
                      className={`py-2 px-3 rounded-lg text-sm font-medium ${currentMode === mode.id
                          ? "bg-green-100 text-green-800"
                          : darkMode
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-600"
                      } transition-colors duration-200 cursor-pointer`}
                      variants={fadeIn}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {mode.name}
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          {modeData.isWeekly ? (
            <motion.div
              variants={slideInFromLeft}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
              className="col-span-full lg:col-span-3"
            >
              {renderWeeklyMealCard()}
            </motion.div>
          ) : (
            <motion.div
              variants={slideInFromLeft}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
              className="col-span-full lg:col-span-3"
            >
              {renderDailyMealCard()}
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Progress Section */}
          <motion.div 
            className="flex flex-col h-full"
            variants={slideInFromLeft}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.div 
              className={`rounded-xl ${theme.shadow} p-4 md:p-6 ${theme.bgSecondary} transition-all duration-300 hover:shadow-2xl h-full`}
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold flex items-center">
                  <BarChartIcon className={`h-5 w-5 mr-2 ${theme.accent}`} />
                  Progress
                </h2>
              </div>

              <div className="text-center mb-4">
                <div className="text-4xl font-bold mb-1">
                  {modeData.goalCompletion}%
                </div>
                <div className="text-sm text-gray-500">Goal Completion</div>
              </div>

              <div className="flex justify-center mb-6">
                <div className="relative h-36 w-36 md:h-44 md:w-44">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ProgressCircle
                      percentage={modeData.trainingProgress[0].percentage}
                      color={modeData.trainingProgress[0].color}
                      radius={70}
                      strokeWidth={12}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ProgressCircle
                      percentage={modeData.trainingProgress[1].percentage}
                      color={modeData.trainingProgress[1].color}
                      radius={55}
                      strokeWidth={12}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ProgressCircle
                      percentage={modeData.trainingProgress[2].percentage}
                      color={modeData.trainingProgress[2].color}
                      radius={40}
                      strokeWidth={12}
                    />
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-2xl font-bold">
                      {modeData.goalCompletion}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {modeData.trainingProgress.map((item, index) => (
                  <div
                    key={index}
                    className={`space-y-1 ${theme.menuHover} px-3 py-2 rounded-lg transition-colors duration-200 cursor-pointer`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {item.icon}
                        <span className="text-sm font-medium ml-2">
                          {item.type}
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="mt-1">
                      <div className={`w-full ${theme.progressBg} rounded-full h-1.5`}>
                        <div
                          className="h-1.5 rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.color,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className={`text-xs ${theme.textSecondary} pt-1`}>
                      {item.details}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <motion.div 
                  className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${darkMode ? "bg-green-700 text-white" : "bg-green-500 text-white"} cursor-pointer`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setToastMessage("Exercise list is not available in this preview");
                    setShowToast(true);
                  }}
                >
                  View All Exercises
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* middle column */}
          <motion.div 
            className="flex flex-col h-full space-y-4 md:space-y-6"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div 
              className={`rounded-xl ${theme.shadow} p-4 md:p-6 ${theme.heartBeatCard} transition-all duration-300 hover:shadow-2xl flex-1`}
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  <h2 className="text-lg font-semibold">Heart Beat</h2>
                </div>
              </div>

              <div className="text-center mb-3">
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold">
                    {modeData.heartRate}
                  </span>
                  <span className="ml-2 text-sm">bpm</span>
                </div>
                <div className={`inline-block px-3 py-1 mt-2 rounded-full text-sm ${darkMode
                    ? "bg-green-600 text-white"
                    : "bg-indigo-100 text-green-800"
                }`}>
                  {modeData.heartStatus}
                </div>
              </div>

              <div className="mt-3 text-sm text-center">
                {currentMode === 'today' 
                  ? `You are ${modeData.heartStatus.toLowerCase()} and ready for exercises!` 
                  : modeData.isWeekly 
                    ? `Your average heart rate was ${modeData.heartStatus.toLowerCase()} this week.`
                    : `You were ${modeData.heartStatus.toLowerCase()} for exercises yesterday.`}
              </div>

              <div className="mt-3 h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={modeData.heartRateData}
                    margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                  >
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={darkMode ? "#fff" : "#000"}
                      strokeWidth={1.5}
                      dot={<CustomizedDot />}
                      isAnimationActive={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
              className={`rounded-xl ${theme.shadow} p-4 md:p-6 ${theme.healthScoreCard} transition-all duration-300 hover:shadow-2xl flex-1`}
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold">Health Score</h2>
                </div>
              </div>

              <div className="text-center mb-3">
                <div className="text-4xl font-bold">
                  {modeData.healthScore}%
                </div>
                <div className={`inline-block px-3 py-1 mt-2 rounded-full text-sm ${modeData.healthStatus === "Very Healthy"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-200 text-blue-800"
                }`}>
                  {modeData.healthStatus}
                </div>
              </div>

              <div className="mt-3">{renderHealthScoreIndicators()}</div>

              <div className="mt-3 text-sm text-center">
                Keep up your good work, Kalendra!
              </div>

              {modeData.isWeekly && modeData.weeklyHealthData ? (
                <div className="mt-3 h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={modeData.weeklyHealthData}>
                      <Bar
                        dataKey="score"
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
                      />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="mt-3">
                  <ResponsiveContainer width="100%" height={50}>
                    <AreaChart
                      data={[
                        { value: modeData.healthScore * 0.8 },
                        { value: modeData.healthScore * 0.9 },
                        { value: modeData.healthScore * 0.85 },
                        { value: modeData.healthScore * 0.95 },
                        { value: modeData.healthScore },
                      ]}
                      margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient
                          id="healthScoreGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3B82F6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3B82F6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3B82F6"
                        fillOpacity={1}
                        fill="url(#healthScoreGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* third column */}
          <motion.div 
            className="flex flex-col h-full"
            variants={slideInFromRight}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div 
              className={`rounded-xl ${theme.shadow} p-4 md:p-6 ${theme.bgSecondary} transition-all duration-300 hover:shadow-2xl h-full`}
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <Flame className="h-5 w-5 mr-2 text-orange-500" />
                  Today's Activity
                </h2>
                <div className={`flex items-center px-3 py-1 rounded-full text-xs ${darkMode
                    ? "bg-green-700 text-white"
                    : "bg-green-100 text-green-800"
                }`}>
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>Running</span>
                </div>
              </div>

              <div className="mb-4 text-xs text-gray-500 flex justify-between">
                <div>
                  {modeData.runningActivity.startTime} -{" "}
                  {modeData.runningActivity.endTime}
                </div>
              </div>

              <div className="mb-4 font-medium">
                {modeData.runningActivity.route}
              </div>

              {/* Map Container */}

              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4">
                <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} hover:shadow-md transition-shadow duration-200 cursor-pointer`}>
                  <div className={`text-sm ${theme.textSecondary} flex items-center`}>
                    <MapPin className="h-3 w-3 mr-1 text-blue-500" />
                    Distance
                  </div>
                  <div className="text-base font-medium mt-1">
                    {modeData.runningActivity.distance}
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} hover:shadow-md transition-shadow duration-200 cursor-pointer`}>
                  <div className={`text-sm ${theme.textSecondary} flex items-center`}>
                    <Clock className="h-3 w-3 mr-1 text-purple-500" />
                    Total Time
                  </div>
                  <div className="text-base font-medium mt-1">
                    {modeData.runningActivity.totalTime}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4">
                <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} hover:shadow-md transition-shadow duration-200 cursor-pointer`}>
                  <div className={`text-sm ${theme.textSecondary} flex items-center`}>
                    <Activity className="h-3 w-3 mr-1 text-green-500" />
                    Total Steps
                  </div>
                  <div className="text-base font-medium mt-1">
                    {modeData.runningActivity.totalSteps}
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} hover:shadow-md transition-shadow duration-200 cursor-pointer`}>
                  <div className={`text-sm ${theme.textSecondary} flex items-center`}>
                    <Flame className="h-3 w-3 mr-1 text-orange-500" />
                    Total Calories
                  </div>
                  <div className="text-base font-medium mt-1">
                    {modeData.runningActivity.totalCalories}
                  </div>
                </div>
              </div>

              <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} hover:shadow-md transition-shadow duration-200 cursor-pointer`}>
                <div className={`text-sm ${theme.textSecondary}`}>
                  Average Pace
                </div>
                <div className="text-base font-medium">
                  {modeData.runningActivity.averagePace}
                </div>
                <div className={`mt-2 h-1.5 ${theme.progressBg} rounded-full overflow-hidden`}>
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-medium flex items-center">
                    <User className="h-4 w-4 mr-2 text-indigo-500" />
                    Profile
                  </h3>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="mr-3">
                    <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-md cursor-pointer">
                      <img
                        src={profileData.avatar}
                        alt={profileData.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">
                      {profileData.name}
                    </h3>
                    <div className="flex items-center mt-1 space-x-2">
                      <div className={`px-2 py-0.5 rounded text-xs ${darkMode
                          ? "bg-indigo-900 text-indigo-300"
                          : "bg-indigo-100 text-indigo-800"
                      }`}>
                        {profileData.level}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className={`p-2 py-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} hover:shadow-md transition-shadow duration-200 cursor-pointer`}>
                    <div className={`text-xs ${theme.textSecondary}`}>
                      Weight
                    </div>
                    <div className="text-sm font-semibold">
                      {profileData.weight}
                    </div>
                  </div>
                  <div className={`p-2 py-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} hover:shadow-md transition-shadow duration-200 cursor-pointer`}>
                    <div className={`text-xs ${theme.textSecondary}`}>
                      Height
                    </div>
                    <div className="text-sm font-semibold">
                      {profileData.height}
                    </div>
                  </div>
                  <div className={`p-2 py-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} hover:shadow-md transition-shadow duration-200 cursor-pointer`}>
                    <div className={`text-xs ${theme.textSecondary}`}>
                      Age
                    </div>
                    <div className="text-sm font-semibold">
                      {profileData.age}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <motion.footer 
        className={`py-4 border-t ${theme.bgSecondary} ${theme.borderColor} shadow-inner mt-6`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className={`text-sm ${theme.textSecondary} mb-2 md:mb-0`}>
              © 2025 FitTrack Pro. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
              <motion.a 
                href="#" 
                className={`text-sm ${theme.textSecondary} ${theme.accentHover} transition-colors duration-200 cursor-pointer`}
                whileHover={{ scale: 1.05, x: 2 }}
              >
                Privacy Policy
              </motion.a>
              <motion.a 
                href="#" 
                className={`text-sm ${theme.textSecondary} ${theme.accentHover} transition-colors duration-200 cursor-pointer`}
                whileHover={{ scale: 1.05, x: 2 }}
              >
                Terms of Service
              </motion.a>
              <motion.a 
                href="#" 
                className={`text-sm ${theme.textSecondary} ${theme.accentHover} transition-colors duration-200 cursor-pointer`}
                whileHover={{ scale: 1.05, x: 2 }}
              >
                Contact
              </motion.a>
              <motion.a 
                href="#" 
                className={`text-sm ${theme.textSecondary} ${theme.accentHover} transition-colors duration-200 cursor-pointer`}
                whileHover={{ scale: 1.05, x: 2 }}
              >
                Help & Support
              </motion.a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default FitnessDashboard;
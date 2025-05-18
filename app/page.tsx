"use client"

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
  useRef,
} from "react";
import {
  Clock,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  BarChart,
  PieChart,
  Calendar,
  Plus,
  Check,
  Edit,
  Trash,
  ClipboardList,
  Activity,
  Bell,
  Settings,
  CheckCircle,
  ArrowRight,
  Users,
  Award,
  Shield,
  Zap,
  ChevronRight,
  Play,
  MessageCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Types
type Task = {
  id: string;
  title: string;
  category: string;
  duration: number;
  startTime: Date;
  completed: boolean;
};

type ChartData = {
  name: string;
  Work: number;
  Personal: number;
  Learning: number;
  Other: number;
};

type Testimonial = {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
};

type PricingPlan = {
  id: string;
  name: string;
  price: number;
  period: string;
  popular: boolean;
  features: string[];
};

type Faq = {
  question: string;
  answer: string;
};

// Memoized sample data functions
const generateChartData = (): ChartData[] => {
  return [
    { name: "Mon", Work: 5, Personal: 2, Learning: 3, Other: 1 },
    { name: "Tue", Work: 4, Personal: 3, Learning: 2, Other: 2 },
    { name: "Wed", Work: 6, Personal: 1, Learning: 2, Other: 1 },
    { name: "Thu", Work: 3, Personal: 2, Learning: 4, Other: 2 },
    { name: "Fri", Work: 5, Personal: 2, Learning: 1, Other: 3 },
    { name: "Sat", Work: 2, Personal: 4, Learning: 3, Other: 1 },
    { name: "Sun", Work: 1, Personal: 5, Learning: 2, Other: 1 },
  ];
};

const generateSampleTasks = (): Task[] => {
  return [
    {
      id: "1",
      title: "Project planning meeting",
      category: "Work",
      duration: 45,
      startTime: new Date(new Date().setHours(9, 0, 0, 0)),
      completed: true,
    },
    {
      id: "2",
      title: "Email responses",
      category: "Work",
      duration: 45,
      startTime: new Date(new Date().setHours(10, 0, 0, 0)),
      completed: true,
    },

    {
      id: "4",
      title: "Client presentation",
      category: "Work",
      duration: 40,
      startTime: new Date(new Date().setHours(16, 0, 0, 0)),
      completed: false,
    },
    {
      id: "5",
      title: "React tutorial",
      category: "Learning",
      duration: 15,
      startTime: new Date(new Date().setHours(17, 30, 0, 0)),
      completed: false,
    },
  ];
};

// Landing page data
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Director of Operations",
    company: "TechGrowth Inc.",
    quote:
      "TimeTrack has transformed how our teams manage their time. We've seen a 32% increase in productivity since implementing this solution.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Senior Project Manager",
    company: "InnovateCorp",
    quote:
      "The insights from TimeTrack helped us identify workflow bottlenecks. Our project delivery time has improved by 28% in just three months.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Freelance Designer",
    company: "Self-employed",
    quote:
      "As a freelancer, tracking billable hours accurately is critical. TimeTrack has simplified my workflow and helped me increase my billable time by 20%.",
  },
];

const pricingPlans: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 0,
    period: "Forever",
    popular: false,
    features: [
      "Personal time tracking",
      "Basic dashboard",
      "Up to 10 tasks per day",
      "7-day history",
    ],
  },
  {
    id: "pro",
    name: "Professional",
    price: 12,
    period: "Per month",
    popular: true,
    features: [
      "Everything in Basic",
      "Advanced analytics",
      "Unlimited tasks",
      "Team collaboration (up to 5)",
      "30-day history",
      "CSV export",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 49,
    period: "Per month",
    popular: false,
    features: [
      "Everything in Professional",
      "Enterprise integrations",
      "Unlimited team members",
      "Unlimited history",
      "Priority support",
      "Custom reporting",
      "Advanced security",
    ],
  },
];

const faqs: Faq[] = [
  {
    question: "How does TimeTrack help improve productivity?",
    answer:
      "TimeTrack provides visual insights into how you spend your time, helping you identify patterns, reduce time-wasting activities, and focus on high-value tasks. Users typically report a 20-30% boost in productivity within the first month.",
  },
  {
    question: "Can I use TimeTrack with my team?",
    answer:
      "Absolutely! Our Professional and Enterprise plans support team collaboration, allowing managers to oversee team productivity, allocate resources effectively, and identify bottlenecks in workflows.",
  },
  {
    question: "Is my data secure with TimeTrack?",
    answer:
      "We take security seriously. TimeTrack employs industry-standard encryption, regular security audits, and strict access controls. Your data is stored in secure, redundant cloud infrastructure with 99.9% uptime.",
  },
  {
    question: "Does TimeTrack integrate with other tools?",
    answer:
      "Yes, TimeTrack integrates with popular productivity tools including Slack, Asana, Trello, Google Calendar, and Microsoft Office. Enterprise customers get access to our API for custom integrations.",
  },
  {
    question: "Can I try TimeTrack before purchasing?",
    answer:
      "We offer a 14-day free trial of our Professional plan with no credit card required. You can also use our Basic plan for free, forever.",
  },
];

// Pure helper functions memoized
const getCategoryColor = (category: string): string => {
  switch (category) {
    case "Work":
      return "bg-blue-500";
    case "Personal":
      return "bg-green-500";
    case "Learning":
      return "bg-purple-500";
    case "Other":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Memoized TaskRow component to prevent re-renders
const TaskRow = memo(
  ({
    task,
    onEdit,
    onDelete,
    onToggleComplete,
  }: {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onToggleComplete: (id: string) => void;
  }) => {
    return (
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{task.title}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(
              task.category
            )} text-white`}
          >
            {task.category}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatTime(task.startTime)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {task.duration} min
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <button
            onClick={() => onToggleComplete(task.id)}
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              task.completed
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {task.completed ? "Completed" : "In Progress"}
          </button>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-900 mr-3"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-900"
          >
            <Trash size={16} />
          </button>
        </td>
      </tr>
    );
  }
);

// Memoized CategoryLabel component
const CategoryLabel = memo(({ category }: { category: string }) => (
  <div className="flex items-center">
    <div
      className={`w-3 h-3 ${getCategoryColor(category)} rounded-full mr-2`}
    ></div>
    <span className="text-sm text-gray-600">{category}</span>
  </div>
));

// Feature component for landing page
const Feature = memo(
  ({
    icon: Icon,
    title,
    description,
  }: {
    icon: React.ElementType;
    title: string;
    description: string;
  }) => (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md transition-transform duration-300 hover:transform hover:scale-105">
      <div className="p-3 rounded-full bg-blue-100 text-blue-600 mb-4">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-center text-gray-600">{description}</p>
    </div>
  )
);

// Testimonial component for landing page
const TestimonialCard = memo(
  ({ testimonial }: { testimonial: Testimonial }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <div className="mb-4">
        <p className="text-gray-600 italic">"{testimonial.quote}"</p>
      </div>
      <div className="mt-auto">
        <p className="font-semibold text-gray-900">{testimonial.name}</p>
        <p className="text-sm text-gray-600">
          {testimonial.role}, {testimonial.company}
        </p>
      </div>
    </div>
  )
);

// Pricing plan component for landing page
const PricingCard = memo(
  ({
    plan,
    onSelectPlan,
  }: {
    plan: PricingPlan;
    onSelectPlan: (planId: string) => void;
  }) => (
    <div
      className={`flex flex-col bg-white rounded-lg shadow-md overflow-hidden ${
        plan.popular ? "border-2 border-blue-500 relative" : ""
      }`}
    >
      {plan.popular && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm font-semibold">
          Popular
        </div>
      )}
      <div className="p-6 flex flex-col items-center">
        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-extrabold text-gray-900">
            ${plan.price}
          </span>
          <span className="ml-1 text-xl font-medium text-gray-500">
            /{plan.period}
          </span>
        </div>
      </div>
      <div className="flex-1 bg-gray-50 p-6 flex flex-col justify-between">
        <ul className="space-y-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
              <span className="ml-3 text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={() => onSelectPlan(plan.id)}
          className={`mt-8 w-full px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
            plan.popular
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-white border border-blue-600 text-blue-600 hover:bg-blue-50"
          }`}
        >
          {plan.price === 0 ? "Start" : "Start Free Trial"}
        </button>
      </div>
    </div>
  )
);

// FAQ component for landing page
const FaqItem = memo(
  ({
    faq,
    isOpen,
    onToggle,
  }: {
    faq: Faq;
    isOpen: boolean;
    onToggle: () => void;
  }) => (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={onToggle}
        className="flex justify-between items-center w-full text-left font-medium text-gray-900 focus:outline-none"
      >
        <span>{faq.question}</span>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`mt-2 text-gray-600 overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p>{faq.answer}</p>
      </div>
    </div>
  )
);

// Main component
const TimeTrack = () => {
  // App state
  const [showLandingPage, setShowLandingPage] = useState(true);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Login state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("alex@gmail.com");
  const [password, setPassword] = useState("password");

  // UI state
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSettingsDropdown, setIsSettingsDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Task state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("Work");
  const [newTaskDuration, setNewTaskDuration] = useState(30);

  // Data state
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [currentDate] = useState(new Date());
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Task reminder: Client presentation",
      description: "Starts in 15 minutes",
      time: "Just now",
      icon: Clock,
      bg: "bg-blue-100",
      color: "text-blue-600",
      read: false,
    },
    {
      id: 2,
      title: "Task completed: Email responses",
      description: "Well done! You've completed this task.",
      time: "30 minutes ago",
      icon: Check,
      bg: "bg-green-100",
      color: "text-green-600",
      read: false,
    },
    {
      id: 3,
      title: "Productivity insight",
      description: "Your productivity increased by 15% this week!",
      time: "2 hours ago",
      icon: Activity,
      bg: "bg-purple-100",
      color: "text-purple-600",
      read: false,
    },
    {
      id: 4,
      title: "New feature available",
      description: "Try our new reports dashboard for insights.",
      time: "Yesterday",
      icon: Bell,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
      read: false,
    },
  ]);

  // Initialize with sample data
  useEffect(() => {
    if (isLoggedIn) {
      setChartData(generateChartData());
      setTasks(generateSampleTasks());
    }
  }, [isLoggedIn]);
  useEffect(() => {
    const modalOpen = showLoginModal || showAddTaskModal;
    document.body.style.overflow = modalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto"; // reset on unmount
    };
  }, [showLoginModal, showAddTaskModal]);

  // Reset task form when opening modal
  useEffect(() => {
    if (showAddTaskModal && !editingTask) {
      setNewTaskTitle("");
      setNewTaskCategory("Work");
      setNewTaskDuration(30);
    }
  }, [showAddTaskModal, editingTask]);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(e.target as Node)
      ) {
        setIsSettingsDropdown(false);
      }
    };

    if (isSettingsDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingsDropdown]);
  // Set form values when editing
  useEffect(() => {
    if (editingTask) {
      setNewTaskTitle(editingTask.title);
      setNewTaskCategory(editingTask.category);
      setNewTaskDuration(editingTask.duration);
    }
  }, [editingTask]);

  // Memoized derived data
  const hours = useMemo(() => {
    const result = { Work: 0, Personal: 0, Learning: 0, Other: 0 };
    tasks.forEach((task) => {
      result[task.category as keyof typeof result] += task.duration / 60;
    });
    return result;
  }, [tasks]);

  const productivity = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((task) => task.completed).length;
    return Math.floor((completed / tasks.length) * 100);
  }, [tasks]);

  // Handlers with useCallback
  const handleLogin = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (username === "alex@gmail.com" && password === "password") {
        setIsLoggedIn(true);
        setShowLoginModal(false);
        setShowLandingPage(false);
      } else {
        alert("Invalid credentials. Use alex@gmail.com/password");
      }
    },
    [username, password]
  );

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setShowLandingPage(true);
    setUsername("");
    setPassword("");
    setMenuOpen(false);
    setIsSettingsDropdown(false);
  }, []);

  const handleAddTask = useCallback(() => {
    if (!newTaskTitle) return;
    if (!newTaskTitle || newTaskDuration <= 0) return;

    const taskToAdd: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      category: newTaskCategory,
      duration: newTaskDuration,
      startTime: new Date(),
      completed: false,
    };

    if (editingTask) {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === editingTask.id ? { ...taskToAdd, id: editingTask.id } : t
        )
      );
      setEditingTask(null);
    } else {
      setTasks((prevTasks) => [...prevTasks, taskToAdd]);
    }

    setNewTaskTitle("");
    setNewTaskCategory("Work");
    setNewTaskDuration(30);
    setShowAddTaskModal(false);
  }, [newTaskTitle, newTaskCategory, newTaskDuration, editingTask]);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setShowAddTaskModal(true);
  }, []);

  const handleDeleteTask = useCallback((id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }, []);

  const toggleTaskCompletion = useCallback((id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const setTab = useCallback((tab: string) => {
    setActiveTab(tab);
    setMenuOpen(false);
  }, []);

  const notificationCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };
  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
    if (showNotifications) setShowNotifications(false);
  }, [showNotifications]);

  const toggleNotifications = useCallback(() => {
    setShowNotifications((prev) => !prev);
    if (menuOpen) setMenuOpen(false);
  }, [menuOpen]);

  const toggleFaq = useCallback((index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  }, []);

  const handleSelectPlan = useCallback((planId: string) => {
    setShowLoginModal(true);
  }, []);

  const handleGetStarted = useCallback(() => {
    setShowLoginModal(true);
  }, []);

  // Memoized landing page components
  const LandingPageHeader = useMemo(
    () => (
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Clock className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  TimeTrack
                </span>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-gray-900"
              >
                Testimonials
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900">
                FAQ
              </a>
            </nav>
            <div className="flex items-center">
              <button
                onClick={() => setShowLoginModal(true)}
                className="hidden md:block text-gray-600 hover:text-gray-900 font-medium mr-4"
              >
                Sign In
              </button>
              <button
                onClick={handleGetStarted}
                className="bg-blue-600 hidden md:block hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Get Started
              </button>
            </div>
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {menuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${menuOpen ? "block" : "hidden"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#features"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setMenuOpen(false)}
            >
              Testimonials
            </a>
            <a
              href="#pricing"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setMenuOpen(false)}
            >
              FAQ
            </a>
            <button
              onClick={() => {
                setShowLoginModal(true);
                setMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>
    ),
    [menuOpen, toggleMenu, handleGetStarted]
  );

  const HeroSection = useMemo(
    () => (
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-pattern"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28 relative z-10">
          <div className="md:flex items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
                Master Your Time,
                <br />
                Elevate Your Productivity
              </h1>
              <p className="mt-4 text-lg text-blue-100 max-w-xl">
                TimeTrack helps professionals and teams visualize their time
                usage, boost efficiency, and achieve more. Start tracking
                smarter, not harder.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleGetStarted}
                  className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 shadow-md transition duration-200"
                >
                  Start Free Trial
                </button>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10 flex justify-center">
              <div className="relative w-full max-w-md rounded-xl shadow-2xl overflow-hidden bg-white z-[5]">
                <div className="p-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                <div className="p-5">
                  <div className="flex justify-between mb-4">
                    <div className="text-lg font-semibold text-gray-900">
                      Today's Productivity
                    </div>
                    <div className="text-sm text-gray-600">May 18, 2025</div>
                  </div>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Overall</span>
                      <span className="font-bold">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: "78%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-blue-600 font-bold text-xl">5.2</div>
                      <div className="text-gray-600 text-sm">Work Hours</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-green-600 font-bold text-xl">
                        1.5
                      </div>
                      <div className="text-gray-600 text-sm">Personal</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">
                        Weekly Trend
                      </div>
                      <div className="text-xs text-blue-600 z-[5] relative">View Report</div>
                    </div>
                    <div className="h-20 mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { day: "M", productivity: 65 },
                            { day: "T", productivity: 72 },
                            { day: "W", productivity: 85 },
                            { day: "T", productivity: 78 },
                            { day: "F", productivity: 90 },
                            { day: "S", productivity: 60 },
                            { day: "S", productivity: 45 },
                          ]}
                        >
                          <Line
                            type="monotone"
                            dataKey="productivity"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
    [handleGetStarted]
  );

  const FeaturesSection = useMemo(
    () => (
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything You Need to Master Productivity
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              TimeTrack gives you powerful tools to visualize, analyze, and
              optimize how you spend your time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Feature
              icon={Clock}
              title="Time Tracking"
              description="Effortlessly track time spent on tasks with intuitive controls and automatic categorization."
            />
            <Feature
              icon={BarChart}
              title="Visual Analytics"
              description="Transform time data into actionable insights with beautiful, interactive charts and reports."
            />
            <Feature
              icon={Calendar}
              title="Smart Scheduling"
              description="Plan your day efficiently with AI-powered scheduling recommendations based on your habits."
            />
            <Feature
              icon={Users}
              title="Team Collaboration"
              description="Coordinate with your team, assign tasks, and monitor collective productivity in real-time."
            />
            <Feature
              icon={Award}
              title="Goal Setting"
              description="Set productivity targets, track progress, and celebrate achievements with built-in milestones."
            />
            <Feature
              icon={Shield}
              title="Privacy Focused"
              description="Your data stays private with enterprise-grade security and customizable sharing controls."
            />
          </div>

          <div className="mt-16 text-center"></div>
        </div>
      </section>
    ),
    []
  );

  const StatSection = useMemo(
    () => (
      <section className="bg-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-blue-700 bg-opacity-40 rounded-lg p-6">
              <div className="text-4xl font-bold text-white">30%</div>
              <div className="mt-2 text-blue-100">
                Average Productivity Boost
              </div>
            </div>
            <div className="bg-blue-700 bg-opacity-40 rounded-lg p-6">
              <div className="text-4xl font-bold text-white">10,000+</div>
              <div className="mt-2 text-blue-100">Active Teams</div>
            </div>
            <div className="bg-blue-700 bg-opacity-40 rounded-lg p-6">
              <div className="text-4xl font-bold text-white">45M+</div>
              <div className="mt-2 text-blue-100">Hours Tracked</div>
            </div>
          </div>
        </div>
      </section>
    ),
    []
  );

  const TestimonialsSection = useMemo(
    () => (
      <section id="testimonials" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Trusted by Teams Worldwide
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              See how TimeTrack has transformed productivity for professionals
              across industries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>
    ),
    []
  );

  const PricingSection = useMemo(
    () => (
      <section id="pricing" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Choose the plan that fits your needs. All plans include a 14-day
              free trial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                onSelectPlan={handleSelectPlan}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Choose the plan that fits your needs.
            </p>
          </div>
        </div>
      </section>
    ),
    [handleSelectPlan]
  );

  const FaqSection = useMemo(
    () => (
      <section id="faq" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Everything you need to know about TimeTrack
            </p>
          </div>

          <div className="mt-8">
            {faqs.map((faq, index) => (
              <FaqItem
                key={index}
                faq={faq}
                isOpen={openFaqIndex === index}
                onToggle={() => toggleFaq(index)}
              />
            ))}
          </div>
        </div>
      </section>
    ),
    [openFaqIndex, toggleFaq]
  );

  const CtaSection = useMemo(
    () => (
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to transform your productivity?
          </h2>
          <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
            Join thousands of professionals who have optimized their workflow
            with TimeTrack.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleGetStarted}
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 shadow-lg transition duration-200"
            >
              Start Your Free Trial
            </button>
          </div>
          <p className="mt-4 text-sm text-blue-200">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </section>
    ),
    [handleGetStarted]
  );

  const Footer = useMemo(
    () => (
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold text-white">
                  TimeTrack
                </span>
              </div>
              <p className="mt-4 text-sm text-gray-400">
                TimeTrack helps professionals and teams optimize their time
                usage and boost productivity.
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
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Integrations
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
    ),
    []
  );

  // Memoized components for app
  const LoginModal = useMemo(
    () => (
      <div
        className={`fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
          showLoginModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-lg p-8 w-11/12 max-w-md transform transition-transform duration-300 ease-in-out">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <button
              onClick={() => setShowLoginModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Demo Credentials:</p>
            <p className="font-medium">
              Username: alex@gmail.com | Password: password
            </p>
          </div>
        </div>
      </div>
    ),
    [showLoginModal, username, password, handleLogin]
  );

  const AddTaskModal = useMemo(
    () => (
      <div
        className={`fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
          showAddTaskModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-lg p-6 w-11/12 max-w-md transform transition-transform duration-300 ease-in-out">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {editingTask ? "Edit Task" : "Add New Task"}
            </h2>
            <button
              onClick={() => {
                setShowAddTaskModal(false);
                setEditingTask(null);
                setNewTaskTitle("");
                setNewTaskCategory("Work");
                setNewTaskDuration(30);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="task-title"
            >
              Task Title
            </label>
            <input
              type="text"
              id="task-title"
              placeholder="What are you working on?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="task-category"
            >
              Category
            </label>
            <select
              id="task-category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newTaskCategory}
              onChange={(e) => setNewTaskCategory(e.target.value)}
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Learning">Learning</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="task-duration"
            >
              Duration (minutes)
            </label>
            <input
              type="number"
              id="task-duration"
              min="5"
              max="480"
              step="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newTaskDuration}
              onChange={(e) =>
                setNewTaskDuration(parseInt(e.target.value) || 0)
              }
            />
          </div>

          <button
            onClick={handleAddTask}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            {editingTask ? "Update Task" : "Add Task"}
          </button>
        </div>
      </div>
    ),
    [
      showAddTaskModal,
      editingTask,
      newTaskTitle,
      newTaskCategory,
      newTaskDuration,
      handleAddTask,
    ]
  );

  const NotificationsDropdown = ({
    showNotifications,
    notifications,
    markNotificationAsRead,
    onClose,
  }: {
    showNotifications: boolean;
    notifications: {
      id: number;
      title: string;
      description: string;
      time: string;
      icon: React.ElementType;
      bg: string;
      color: string;
      read: boolean;
    }[];
    markNotificationAsRead: (id: number) => void;
    onClose: () => void;
  }) => {
    // const dropdownRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     const handleClickOutside = (e: MouseEvent) => {
    //         if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
    //             onClose();
    //         }
    //     };

    //     if (showNotifications) {
    //         document.addEventListener("mousedown", handleClickOutside);
    //     }
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, [showNotifications, onClose]);

    return (
      <>
        <div
          // ref={dropdownRef}
          className={`absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-20 transition-all duration-300 ease-in-out 
    ${
      showNotifications
        ? "opacity-100 translate-y-0"
        : "opacity-0 -translate-y-2 pointer-events-none"
    } 
    hidden md:block
  `}
        >
          <div className="px-4 py-2 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Notifications
            </h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                  n.read ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 ${n.bg} rounded-full p-2`}>
                    <n.icon className={`h-4 w-4 ${n.color}`} />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-500">{n.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          // ref={dropdownRef}
          className={`absolute mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-20 transition-all duration-300 ease-in-out 
    ${
      showNotifications
        ? "opacity-100 translate-y-0"
        : "opacity-0 -translate-y-2 pointer-events-none"
    }
    -left-10 -translate-x-1/2 
    block md:hidden
  `}
        >
          <div className="px-4 py-2 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Notifications
            </h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                  n.read ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 ${n.bg} rounded-full p-2`}>
                    <n.icon className={`h-4 w-4 ${n.color}`} />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-500">{n.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const SettingsDropdown = useMemo(
    () => (
      <div
        ref={settingsRef}
        className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 transition-all duration-300 ease-in-out ${
          isSettingsDropdown
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm text-gray-500">Signed in as</p>
          <p className="text-sm font-medium text-gray-900">alex@gmail.com</p>
        </div>

        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <div className="flex items-center">
            <LogOut className="mr-3 h-4 w-4" />
            <span>Sign out</span>
          </div>
        </button>
      </div>
    ),
    [menuOpen, handleLogout, isSettingsDropdown]
  );

  // Memoized content components
  const Dashboard = useMemo(
    () => (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Weekly Activity</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  label={{ value: "Hours", angle: -90, position: "insideLeft" }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Work"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Personal"
                  stroke="#10b981"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Learning"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Other"
                  stroke="#6b7280"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Today's Performance</h2>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Productivity Score</span>
              <span className="font-bold">{productivity}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${productivity}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 font-bold text-xl">
                {hours.Work.toFixed(1)}
              </div>
              <div className="text-gray-600 text-sm">Work Hours</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600 font-bold text-xl">
                {hours.Personal.toFixed(1)}
              </div>
              <div className="text-gray-600 text-sm">Personal</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-purple-600 font-bold text-xl">
                {hours.Learning.toFixed(1)}
              </div>
              <div className="text-gray-600 text-sm">Learning</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-600 font-bold text-xl">
                {hours.Other.toFixed(1)}
              </div>
              <div className="text-gray-600 text-sm">Other</div>
            </div>
          </div>

          <button
            onClick={() => setShowAddTaskModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 transition duration-150 ease-in-out"
          >
            <Plus size={16} />
            <span>Add New Task</span>
          </button>
        </div>

        <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Today's Schedule</h2>
            <div className="flex items-center text-gray-600">
              <Calendar size={16} className="mr-2" />
              <span>
                {currentDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Task
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Duration
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onToggleComplete={toggleTaskCompletion}
                  />
                ))}
                {tasks.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No tasks scheduled for today. Click "Add New Task" to get
                      started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),
    [
      tasks,
      chartData,
      hours,
      productivity,
      handleEditTask,
      handleDeleteTask,
      toggleTaskCompletion,
      currentDate,
    ]
  );

  const Timeline = useMemo(() => {
    // Memoize timeline calculations
    const timelineItems = tasks.map((task) => {
      const startHour =
        task.startTime.getHours() + task.startTime.getMinutes() / 60;
      const top = ((startHour - 9) / 9) * 100;
      const height = (task.duration / 60 / 9) * 100;

      return {
        id: task.id,
        task,
        top,
        height: Math.max(height, 5), // Ensure minimum height
        endTime: new Date(task.startTime.getTime() + task.duration * 60000),
      };
    });

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Daily Timeline</h2>

        <div className="relative h-[600px]">
          {timelineItems.map(({ id, task, top, height, endTime }, index) => (
            <div
              key={id}
              className={`absolute left-[${
                index * 10
              }px] right-0 rounded-md p-2 transition-all duration-300 ease-in-out ${getCategoryColor(
                task.category
              )} ${task.completed ? "opacity-70" : "opacity-100"}`}
              style={{
                top: `${top}%`,
                height: `${height}%`,
                minHeight: "30px",
                marginLeft: `${index * 20}px`, // Stagger horizontally to prevent overlap
                width: "calc(100% - 60px)", // Adjust width to leave space
              }}
            >
              <div className="flex justify-between text-white text-sm">
                <div>
                  <div className="font-medium">{task.title}</div>
                  <div className="text-xs">
                    {formatTime(task.startTime)} - {formatTime(endTime)}
                  </div>
                </div>
                <div className="text-xs">{task.duration} min</div>
              </div>
            </div>
          ))}

          {/* Time markers */}
          <div className="absolute top-0 left-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center">
                <span className="mr-2">{9 + i}:00</span>
                <div className="h-px w-screen bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center flex-wrap space-x-6">
          <CategoryLabel category="Work" />
          <CategoryLabel category="Personal" />
          <CategoryLabel category="Learning" />
          <CategoryLabel category="Other" />
        </div>
      </div>
    );
  }, [tasks]);

  const Reports = useMemo(() => {
    // Sample data for reports - memoized
    const productivityData = [
      { day: "Mon", productivity: 65 },
      { day: "Tue", productivity: 72 },
      { day: "Wed", productivity: 85 },
      { day: "Thu", productivity: 78 },
      { day: "Fri", productivity: 90 },
      { day: "Sat", productivity: 60 },
      { day: "Sun", productivity: 45 },
    ];

    const timeData = [
      { category: "Work", hours: hours.Work },
      { category: "Personal", hours: hours.Personal },
      { category: "Learning", hours: hours.Learning },
      { category: "Other", hours: hours.Other },
    ];

    // Generate random summary data
    const weeklySummary = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ].map((day) => ({
      day,
      tasksCompleted: Math.floor(Math.random() * 10) + 1,
      workHours: (Math.random() * 8 + 2).toFixed(1),
      personalHours: (Math.random() * 4 + 1).toFixed(1),
      productivity: Math.floor(Math.random() * 40) + 60,
    }));

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Productivity Trends</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="productivity"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Time Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Weekly Summary</h2>

          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Day
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tasks Completed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Work Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Personal Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Productivity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {weeklySummary.map((day, index) => (
                  <tr
                    key={day.day}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {day.day}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {day.tasksCompleted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {day.workHours}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {day.personalHours}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${day.productivity}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {day.productivity}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }, [hours]);

  const LandingPage = useMemo(
    () => (
      <div className="min-h-screen bg-white  scroll-smooth">
        {LandingPageHeader}
        {HeroSection}
        {FeaturesSection}
        {StatSection}
        {TestimonialsSection}
        {PricingSection}
        {FaqSection}
        {CtaSection}
        {Footer}
      </div>
    ),
    [
      LandingPageHeader,
      HeroSection,
      FeaturesSection,
      StatSection,
      TestimonialsSection,
      PricingSection,
      FaqSection,
      CtaSection,
      Footer,
    ]
  );

  return (
    <div
      className="min-h-screen bg-gray-100 font-sans scroll-smooth"
      style={{ fontFamily: "var(--font-roboto), sans-serif" }}
    >
      {/* Login Modal */}
      {showLoginModal && LoginModal}

      {/* Add Task Modal */}
      {showAddTaskModal && AddTaskModal}

      {/* Landing Page */}
      {showLandingPage && !isLoggedIn && LandingPage}

      {isLoggedIn && (
        <>
          {/* Header & Navigation */}
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0 flex items-center">
                    <Clock className="h-8 w-8 text-blue-600" />
                    <span className="ml-2 text-xl font-bold text-gray-900">
                      TimeTrack
                    </span>
                  </div>
                  <nav className="hidden md:ml-6 md:flex space-x-4">
                    <button
                      onClick={() => setTab("dashboard")}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        activeTab === "dashboard"
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      } transition duration-150 ease-in-out`}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => setTab("timeline")}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        activeTab === "timeline"
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      } transition duration-150 ease-in-out`}
                    >
                      Timeline
                    </button>
                    <button
                      onClick={() => setTab("reports")}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        activeTab === "reports"
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      } transition duration-150 ease-in-out`}
                    >
                      Reports
                    </button>
                  </nav>
                </div>
                <div className="flex items-center">
                  {/* Notifications */}
                  <div className="relative ml-3">
                    <button
                      onClick={toggleNotifications}
                      className="p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none"
                    >
                      <Bell className="h-6 w-6" />
                      {notificationCount > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                          {notificationCount}
                        </span>
                      )}
                    </button>
                    <NotificationsDropdown
                      showNotifications={showNotifications}
                      notifications={notifications}
                      markNotificationAsRead={markNotificationAsRead}
                      onClose={() => setShowNotifications(false)}
                    />
                  </div>

                  {/* Profile dropdown */}
                  <div className="relative ml-3">
                    <button
                      onClick={() => setIsSettingsDropdown(true)}
                      className="flex text-sm rounded-full focus:outline-none"
                    >
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        A
                      </div>
                    </button>
                    {SettingsDropdown}
                  </div>

                  {/* Mobile menu button */}
                  <div className="md:hidden ml-2">
                    <button
                      onClick={toggleMenu}
                      className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                    >
                      {menuOpen ? (
                        <X className="block h-6 w-6" />
                      ) : (
                        <Menu className="block h-6 w-6" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden ${menuOpen ? "block" : "hidden"}`}>
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <button
                  onClick={() => setTab("dashboard")}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    activeTab === "dashboard"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  } transition duration-150 ease-in-out`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setTab("timeline")}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    activeTab === "timeline"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  } transition duration-150 ease-in-out`}
                >
                  Timeline
                </button>
                <button
                  onClick={() => setTab("reports")}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    activeTab === "reports"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  } transition duration-150 ease-in-out`}
                >
                  Reports
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Page header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === "dashboard" && "Productivity Dashboard"}
                {activeTab === "timeline" && "Daily Timeline"}
                {activeTab === "reports" && "Performance Reports"}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {activeTab === "dashboard" &&
                  "Track your daily productivity and task completion"}
                {activeTab === "timeline" &&
                  "Visualize your day with a timeline of activities"}
                {activeTab === "reports" &&
                  "Analyze your productivity trends and patterns"}
              </p>
            </div>

            {/* Content based on active tab */}
            {activeTab === "dashboard" && Dashboard}
            {activeTab === "timeline" && Timeline}
            {activeTab === "reports" && Reports}
          </main>

          {/* Footer */}
          <footer className="bg-white shadow-inner mt-8">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center mb-4 md:mb-0">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <span className="ml-2 text-lg font-semibold text-gray-900">
                    TimeTrack
                  </span>
                </div>
                <div className="flex space-x-6">
                  <a href="#" className="text-gray-500 hover:text-gray-700">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-gray-500 hover:text-gray-700">
                    Terms of Service
                  </a>
                  <a href="#" className="text-gray-500 hover:text-gray-700">
                    Help Center
                  </a>
                </div>
                <div className="mt-4 md:mt-0 text-sm text-gray-500">
                  &copy; 2025 TimeTrack Inc. All rights reserved.
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default TimeTrack;
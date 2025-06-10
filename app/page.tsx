"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  ChartBarIcon,
  ClockIcon,
  EyeIcon,
  PlusIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  Bars3Icon,
  XMarkIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ChevronDownIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CogIcon,
  BellIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeSlashIcon,
  LockClosedIcon,
  ShareIcon,
  StarIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Question {
  id: string;
  type: "multiple-choice" | "text" | "essay";
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  points: number;
}

interface Test {
  id: string;
  title: string;
  description: string;
  duration: number;
  questions: Question[];
  createdAt: Date;
  status: "draft" | "published" | "archived";
  category: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
}

interface TestSession {
  id: string;
  testId: string;
  userId: string;
  userName: string;
  startTime: Date;
  endTime?: Date;
  answers: Record<string, any>;
  score?: number;
  violations: string[];
  status: "in-progress" | "completed" | "paused" | "terminated";
  timeSpent: number;
}

interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "instructor" | "student";
  avatar: string;
  totalTests: number;
  avgScore: number;
}

const TestPro: React.FC = () => {
  // UI State
  const [activeView, setActiveView] = useState<
    | "dashboard"
    | "create"
    | "test"
    | "analytics"
    | "settings"
    | "users"
    | "library"
  >("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop"
  );
  const [showProctorModal, setShowProctorModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
  const [isClient, setisClient] = useState(false);
  // Test Management State
  const [tests, setTests] = useState<Test[]>([
    {
      id: "1",
      title: "JavaScript Fundamentals",
      description: "Test your knowledge of JavaScript basics",
      duration: 45,
      questions: [
        {
          id: "q1",
          type: "multiple-choice",
          question:
            "What is the correct way to declare a variable in JavaScript?",
          options: [
            "var x = 5;",
            "variable x = 5;",
            "v x = 5;",
            "declare x = 5;",
          ],
          correctAnswer: 0,
          points: 1,
        },
        {
          id: "q2",
          type: "multiple-choice",
          question:
            "Which method is used to add an element to the end of an array?",
          options: ["append()", "push()", "add()", "insert()"],
          correctAnswer: 1,
          points: 1,
        },
        {
          id: "q3",
          type: "text",
          question: "What does 'DOM' stand for in web development?",
          correctAnswer: "Document Object Model",
          points: 2,
        },
      ],
      createdAt: new Date("2024-01-15"),
      status: "published",
      category: "Programming",
      difficulty: "medium",
      tags: ["javascript", "fundamentals", "programming"],
    },
    {
      id: "2",
      title: "React Components",
      description: "Advanced React component patterns and hooks",
      duration: 60,
      questions: [
        {
          id: "q4",
          type: "multiple-choice",
          question:
            "Which hook is used to manage state in functional components?",
          options: ["useEffect", "useState", "useContext", "useReducer"],
          correctAnswer: 1,
          points: 1,
        },
        {
          id: "q5",
          type: "essay",
          question:
            "Explain the difference between controlled and uncontrolled components in React.",
          points: 5,
        },
      ],
      createdAt: new Date("2024-01-20"),
      status: "published", // Changed from "draft" to "published"
      category: "Frontend",
      difficulty: "hard",
      tags: ["react", "components", "hooks"],
    },
  ]);
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
  const [currentSession, setCurrentSession] = useState<TestSession | null>(
    null
  );
  const [testSessions, setTestSessions] = useState<TestSession[]>([
    {
      id: "session1",
      testId: "1",
      userId: "user1",
      userName: "Alice Johnson",
      startTime: new Date("2024-01-16T10:00:00"),
      endTime: new Date("2024-01-16T10:42:00"),
      answers: {},
      score: 85,
      violations: [],
      status: "completed",
      timeSpent: 2520,
    },
    {
      id: "session2",
      testId: "1",
      userId: "user2",
      userName: "Bob Smith",
      startTime: new Date("2024-01-17T14:30:00"),
      endTime: new Date("2024-01-17T15:15:00"),
      answers: {},
      score: 92,
      violations: ["Fullscreen exited"],
      status: "completed",
      timeSpent: 2700,
    },
    {
      id: "session3",
      testId: "2",
      userId: "user3",
      userName: "Carol Davis",
      startTime: new Date("2024-01-18T09:00:00"),
      endTime: new Date("2024-01-18T09:55:00"),
      answers: {},
      score: 78,
      violations: [],
      status: "completed",
      timeSpent: 3300,
    },
    {
      id: "session4",
      testId: "1",
      userId: "user1",
      userName: "Alice Johnson",
      startTime: new Date("2024-01-19T11:00:00"),
      endTime: new Date("2024-01-19T11:38:00"),
      answers: {},
      score: 95,
      violations: [],
      status: "completed",
      timeSpent: 2280,
    },
    {
      id: "session5",
      testId: "2",
      userId: "user2",
      userName: "Bob Smith",
      startTime: new Date("2024-01-20T13:00:00"),
      endTime: new Date("2024-01-20T13:52:00"),
      answers: {},
      score: 88,
      violations: ["Tab switched"],
      status: "completed",
      timeSpent: 3120,
    },
  ]);

  // Users State
  const [users, setUsers] = useState<User[]>([
    {
      id: "user1",
      name: "Alice Johnson",
      email: "alice@company.com",
      role: "student",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face",
      totalTests: 5,
      avgScore: 87,
    },
    {
      id: "user2",
      name: "Bob Smith",
      email: "bob@company.com",
      role: "student",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      totalTests: 3,
      avgScore: 92,
    },
    {
      id: "user3",
      name: "Carol Davis",
      email: "carol@company.com",
      role: "instructor",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      totalTests: 12,
      avgScore: 95,
    },
  ]);

  // Test Creation State
  const [testForm, setTestForm] = useState({
    title: "",
    description: "",
    duration: 60,
    category: "",
    difficulty: "medium" as "easy" | "medium" | "hard",
    tags: [] as string[],
    questions: [] as Question[],
  });
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: "multiple-choice",
    question: "",
    options: ["", "", "", ""],
    points: 1,
    correctAnswer: undefined,
  });

  // Timer State
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [breaks, setBreaks] = useState<
    { start: Date; end?: Date; reason: string }[]
  >([]);

  // Toast State
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Form Validation State
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  // Check if mobile view
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!isClient) setisClient(true);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Toast Management
  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 5000);
  }, []);

  // Close mobile menu function
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Fullscreen Detection with User-Initiated Re-entry
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);

      if (
        currentSession &&
        !isCurrentlyFullscreen &&
        (currentSession.status === "in-progress" || isOnBreak)
      ) {
        // Log the violation
        setCurrentSession((prev) =>
          prev
            ? {
                ...prev,
                violations: [
                  ...prev.violations,
                  `Fullscreen exited at ${new Date().toISOString()}`,
                ],
              }
            : null
        );

        // Pause the timer when fullscreen is exited
        setIsTimerActive(false);

        // Show warning modal that requires user action
        setShowFullscreenWarning(true);

        addToast({
          type: "error",
          message: "Test paused - Fullscreen mode required!",
          duration: 5000,
        });
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [currentSession, addToast, isOnBreak]);
  // Fullscreen Detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);

      if (currentSession && !isCurrentlyFullscreen) {
        // Log violation
        setCurrentSession((prev) =>
          prev
            ? {
                ...prev,
                violations: [
                  ...prev.violations,
                  `Fullscreen exited at ${new Date().toISOString()}`,
                ],
              }
            : null
        );

        // Always pause and show blocking modal
        setIsTimerActive(false);
        setShowFullscreenWarning(true);

        addToast({
          type: "error",
          message: "Test paused - Fullscreen mode required!",
        });
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [currentSession, addToast]);

  // Timer Management
  useEffect(() => {
    if (isTimerActive && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            if (currentSession) {
              endTestSession();
            }
            return 0;
          }

          // Warning alerts
          if (prev === 300) {
            // 5 minutes
            addToast({
              type: "warning",
              message: "5 minutes remaining!",
            });
          } else if (prev === 60) {
            // 1 minute
            addToast({
              type: "error",
              message: "1 minute remaining!",
            });
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isTimerActive, timeRemaining, currentSession]);

  // Validation
  const validateTestForm = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!testForm.title.trim()) errors.title = "Title is required";
    if (!testForm.description.trim())
      errors.description = "Description is required";
    if (testForm.duration < 1)
      errors.duration = "Duration must be at least 1 minute";
    if (!testForm.category.trim()) errors.category = "Category is required";
    if (testForm.questions.length === 0)
      errors.questions = "At least one question is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [testForm]);

  const validateQuestion = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!currentQuestion.question?.trim())
      errors.question = "Question text is required";
    if (!currentQuestion.points || currentQuestion.points < 1)
      errors.points = "Points must be at least 1";

    if (currentQuestion.type === "multiple-choice") {
      if (!currentQuestion.options?.some((opt) => opt.trim())) {
        errors.options = "At least one option is required";
      }
      if (currentQuestion.correctAnswer === undefined || currentQuestion.correctAnswer === null) {
        errors.correctAnswer = "Please select the correct answer";
      }
    }

    if (currentQuestion.type === "text") {
      if (!currentQuestion.correctAnswer || !(currentQuestion.correctAnswer as string).trim()) {
        errors.correctAnswer = "Correct answer is required for text questions";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [currentQuestion]);

  // Test Management Functions
  const createTest = useCallback(() => {
    if (!validateTestForm()) return;

    const newTest: Test = {
      id: Date.now().toString(),
      title: testForm.title,
      description: testForm.description,
      duration: testForm.duration,
      category: testForm.category,
      difficulty: testForm.difficulty,
      tags: testForm.tags,
      questions: testForm.questions,
      createdAt: new Date(),
      status: "draft",
    };

    setTests((prev) => [...prev, newTest]);
    setTestForm({
      title: "",
      description: "",
      duration: 60,
      category: "",
      difficulty: "medium",
      tags: [],
      questions: [],
    });
    addToast({ type: "success", message: "Test created successfully!" });
    setActiveView("library");
  }, [testForm, validateTestForm, addToast]);

  const duplicateTest = useCallback(
    (test: Test) => {
      const duplicatedTest: Test = {
        ...test,
        id: Date.now().toString(),
        title: `${test.title} (Copy)`,
        status: "draft",
        createdAt: new Date(),
      };
      setTests((prev) => [...prev, duplicatedTest]);
      addToast({ type: "success", message: "Test duplicated successfully!" });
    },
    [addToast]
  );

  const deleteTest = useCallback(
    (testId: string) => {
      setTests((prev) => prev.filter((t) => t.id !== testId));
      addToast({ type: "success", message: "Test deleted successfully!" });
    },
    [addToast]
  );

  const publishTest = useCallback(
    (testId: string) => {
      setTests((prev) =>
        prev.map((t) =>
          t.id === testId ? { ...t, status: "published" as const } : t
        )
      );
      addToast({ type: "success", message: "Test published successfully!" });
    },
    [addToast]
  );

  const addQuestion = useCallback(() => {
    if (!validateQuestion()) return;

    const question: Question = {
      id: Date.now().toString(),
      type: currentQuestion.type!,
      question: currentQuestion.question!,
      options: currentQuestion.options,
      correctAnswer: currentQuestion.correctAnswer,
      points: currentQuestion.points!,
    };

    setTestForm((prev) => ({
      ...prev,
      questions: [...prev.questions, question],
    }));

    setCurrentQuestion({
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      points: 1,
      correctAnswer: undefined,
    });

    addToast({ type: "success", message: "Question added successfully!" });
  }, [currentQuestion, validateQuestion, addToast]);

  const editQuestion = useCallback(
    (questionId: string) => {
      const question = testForm.questions.find((q) => q.id === questionId);
      if (question) {
        setCurrentQuestion(question);
        setTestForm((prev) => ({
          ...prev,
          questions: prev.questions.filter((q) => q.id !== questionId),
        }));
      }
    },
    [testForm.questions]
  );

  const removeQuestion = useCallback(
    (questionId: string) => {
      setTestForm((prev) => ({
        ...prev,
        questions: prev.questions.filter((q) => q.id !== questionId),
      }));
      addToast({ type: "success", message: "Question removed successfully!" });
    },
    [addToast]
  );

  const startTest = useCallback(
    (test: Test) => {
      setCurrentTest(test);
      setTimeRemaining(test.duration * 60);

      const session: TestSession = {
        id: Date.now().toString(),
        testId: test.id,
        userId: "current-user",
        userName: "Current User",
        startTime: new Date(),
        answers: {},
        violations: [],
        status: "in-progress",
        timeSpent: 0,
      };

      setCurrentSession(session);
      setIsTimerActive(true);
      setActiveView("test");

      // Enter fullscreen
      if (fullscreenRef.current) {
        fullscreenRef.current.requestFullscreen();
      }

      addToast({ type: "info", message: "Test started. Good luck!" });
    },
    [addToast]
  );

  const endTestSession = useCallback(() => {
    if (!currentSession || !currentTest) return;

    // Calculate the score
    let totalPoints = 0;
    let earnedPoints = 0;

    currentTest.questions.forEach((question) => {
      totalPoints += question.points;
      const userAnswer = currentSession.answers[question.id];

      if (userAnswer !== undefined && userAnswer !== null) {
        if (question.type === "multiple-choice") {
          // For multiple choice, check if the selected option index matches
          if (userAnswer === question.correctAnswer) {
            earnedPoints += question.points;
          }
        } else if (question.type === "text") {
          // For text questions, do case-insensitive comparison
          const correctAnswer = (question.correctAnswer as string || "").toLowerCase().trim();
          const givenAnswer = (userAnswer as string || "").toLowerCase().trim();
          if (correctAnswer && givenAnswer === correctAnswer) {
            earnedPoints += question.points;
          }
        }
        // Note: Essay questions are not auto-graded, they would need manual review
      }
    });

    // Calculate percentage score
    const percentageScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

    const completedSession: TestSession = {
      ...currentSession,
      endTime: new Date(),
      status: "completed",
      score: percentageScore,
      timeSpent: currentTest ? currentTest.duration * 60 - timeRemaining : 0,
    };

    setTestSessions((prev) => [...prev, completedSession]);

    // Reset all test-related state
    setCurrentSession(null);
    setCurrentTest(null);
    setIsTimerActive(false);
    setTimeRemaining(0);
    setIsOnBreak(false);

    // Clear any timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }

    setActiveView("dashboard");
    addToast({ 
      type: "success", 
      message: `Test completed! Your score: ${percentageScore}% (${earnedPoints}/${totalPoints} points)` 
    });
  }, [currentSession, currentTest, timeRemaining, addToast]);

  const takeBreak = useCallback(
    (reason: string) => {
      if (!currentSession) return;

      setBreaks((prev) => [...prev, { start: new Date(), reason }]);
      setIsTimerActive(false);
      setIsOnBreak(true);
      setShowProctorModal(false);

      addToast({ type: "info", message: `Break started: ${reason}` });
    },
    [currentSession, addToast]
  );
  const resumeTest = useCallback(() => {
    if (!currentSession || !isOnBreak) return;

    setIsOnBreak(false);
    setIsTimerActive(true);

    // Update the last break entry with end time
    setBreaks((prev) => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[updated.length - 1].end = new Date();
      }
      return updated;
    });

    addToast({ type: "info", message: "Test resumed" });
  }, [currentSession, isOnBreak, addToast]);
  // Filtered tests
  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const matchesSearch =
        test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        filterCategory === "all" || test.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tests, searchQuery, filterCategory]);

  // Analytics Data
  const analyticsData = useMemo(() => {
    const completedSessions = testSessions.filter(
      (s) => s.status === "completed"
    );
    const categories = [...new Set(tests.map((t) => t.category))];

    // Performance over time data
    const performanceData = completedSessions
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      .map((session, index) => ({
        session: index + 1,
        score: session.score || 0,
        date: session.startTime.toLocaleDateString(),
      }));

    // Category performance data
    const categoryData = categories.map((category) => {
      const categoryTests = tests.filter((t) => t.category === category);
      const categorySessions = completedSessions.filter((s) =>
        categoryTests.some((t) => t.id === s.testId)
      );
      const avgScore =
        categorySessions.length > 0
          ? categorySessions.reduce((acc, s) => acc + (s.score || 0), 0) /
            categorySessions.length
          : 0;

      return {
        category,
        avgScore: Math.round(avgScore),
        sessions: categorySessions.length,
      };
    });

    // Score distribution data
    const scoreRanges = [
      { range: "90-100", count: 0, color: "#10B981", name: "90-100" },
      { range: "80-89", count: 0, color: "#3B82F6", name: "80-89" },
      { range: "70-79", count: 0, color: "#F59E0B", name: "70-79" },
      { range: "60-69", count: 0, color: "#EF4444", name: "60-69" },
      { range: "Below 60", count: 0, color: "#6B7280", name: "Below 60" },
    ];

    completedSessions.forEach((session) => {
      const score = session.score || 0;
      if (score >= 90) scoreRanges[0].count++;
      else if (score >= 80) scoreRanges[1].count++;
      else if (score >= 70) scoreRanges[2].count++;
      else if (score >= 60) scoreRanges[3].count++;
      else scoreRanges[4].count++;
    });

    // Update names to include counts for legend
    scoreRanges.forEach(range => {
      range.name = `${range.range}: ${range.count}`;
    });

    return {
      totalTests: tests.length,
      totalSessions: testSessions.length,
      totalUsers: users.length,
      avgScore:
        completedSessions.reduce((acc, s) => acc + (s.score || 0), 0) /
          completedSessions.length || 0,
      completionRate:
        (completedSessions.length / testSessions.length) * 100 || 0,
      categories,
      recentActivity: testSessions.slice(-10).reverse(),
      performanceData,
      categoryData,
      scoreDistribution: scoreRanges,
    };
  }, [tests, testSessions, users]);

  // Format time helper
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  // Close mobile menu when clicking outside
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsMobileMenuOpen(false);
      setShowExportModal(false);
    }
  }, []);

  // Handle proctor modal overlay click
  const handleProctorOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowProctorModal(false);
    }
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isMobileMenuOpen || showProctorModal || showExportModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen, showProctorModal, showExportModal]);

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: ChartBarIcon },
    { key: "library", label: "Test Library", icon: DocumentTextIcon },
    { key: "create", label: "Create Test", icon: PlusIcon },
    { key: "analytics", label: "Analytics", icon: ChartBarIcon },
  ];

  // Sparkline component for mobile
  const Sparkline: React.FC<{ data: any[]; color: string }> = ({
    data,
    color,
  }) => (
    <div className="h-8 w-16 relative">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="score"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  if (!isClient) {
    return "";
  }

  return (
    <div
      ref={fullscreenRef}
      className="min-h-screen overflow-y-auto bg-gray-50 font-roboto"
    >
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : toast.type === "error"
                ? "bg-red-500 text-white"
                : toast.type === "warning"
                ? "bg-yellow-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            <div className="flex items-center space-x-2">
              {toast.type === "success" && (
                <CheckCircleIcon className="h-5 w-5" />
              )}
              {toast.type === "error" && <XCircleIcon className="h-5 w-5" />}
              {toast.type === "warning" && (
                <ExclamationTriangleIcon className="h-5 w-5" />
              )}
              {toast.type === "info" && <BellIcon className="h-5 w-5" />}
              <span className="font-medium">{toast.message}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      {!isFullscreen && (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                    <ClipboardDocumentListIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="ml-3">
                    <h1 className="text-xl font-bold text-gray-900">TestPro</h1>
                    <p className="text-xs text-gray-500">
                      Professional Testing Platform
                    </p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:flex">
                  <div className="hidden md:flex">
                    <div className="flex items-center space-x-4">
                      {menuItems.map(({ key, label, icon: Icon }) => (
                        <button
                          key={key}
                          onClick={() => setActiveView(key as any)}
                          className={`cursor-pointer flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeView === key
                              ? "bg-blue-100 text-blue-700"
                              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="ml-4 flex items-center md:ml-6">
                  {currentSession && (
                    <div className="flex items-center space-x-4 mr-4">
                      <div className="text-sm font-medium text-gray-700">
                        Time: {formatTime(timeRemaining)}
                      </div>
                      <button
                        onClick={() => setShowProctorModal(true)}
                        className="cursor-pointer bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        Request Break
                      </button>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                      alt="User"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      John Doe
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="cursor-pointer inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <XMarkIcon className="block h-6 w-6" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
            <div className="fixed inset-0 z-50 flex">
              <div
                className="fixed inset-0 bg-gray-600 bg-opacity-75"
                onClick={handleOverlayClick}
              ></div>

              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                {/* Enhanced close button with better positioning */}
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    onClick={closeMobileMenu}
                    className="text-gray-500 hover:text-gray-800 focus:outline-none"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <div className="flex-shrink-0 flex items-center px-4">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                      <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-3">
                      <h1 className="text-lg font-bold text-gray-900">
                        TestPro
                      </h1>
                      <p className="text-xs text-gray-500">
                        Professional Testing
                      </p>
                    </div>
                  </div>
                  <nav className="mt-5 px-2 space-y-1">
                    {menuItems.map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => {
                          setActiveView(key as any);
                          closeMobileMenu();
                        }}
                        className={`cursor-pointer group w-full flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors ${
                          activeView === key
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <Icon className="mr-4 h-6 w-6" />
                        {label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                      alt="User"
                    />
                    <div className="ml-3">
                      <p className="text-base font-medium text-gray-700">
                        John Doe
                      </p>
                      <p className="text-sm font-medium text-gray-500">
                        Administrator
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeView === "dashboard" && (
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Welcome to TestPro
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Enterprise-grade assessment platform for modern organizations
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-8 w-8" />
                    <div className="ml-4">
                      <p className="text-2xl font-semibold">
                        {analyticsData.totalTests}
                      </p>
                      <p className="text-blue-100">Total Tests</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white">
                  <div className="flex items-center">
                    <UserGroupIcon className="h-8 w-8" />
                    <div className="ml-4">
                      <p className="text-2xl font-semibold">
                        {analyticsData.totalSessions}
                      </p>
                      <p className="text-green-100">Test Sessions</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
                  <div className="flex items-center">
                    <ChartBarIcon className="h-8 w-8" />
                    <div className="ml-4">
                      <p className="text-2xl font-semibold">
                        {analyticsData.avgScore.toFixed(1)}%
                      </p>
                      <p className="text-purple-100">Average Score</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg shadow-lg text-white">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-8 w-8" />
                    <div className="ml-4">
                      <p className="text-2xl font-semibold">
                        {analyticsData.completionRate.toFixed(1)}%
                      </p>
                      <p className="text-orange-100">Completion Rate</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Quick Actions
                  </h2>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveView("create")}
                      className="cursor-pointer w-full flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <PlusIcon className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="font-medium text-blue-600">
                        Create New Test
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveView("library")}
                      className="cursor-pointer w-full flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <DocumentTextIcon className="h-5 w-5 text-green-600 mr-3" />
                      <span className="font-medium text-green-600">
                        Browse Test Library
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveView("analytics")}
                      className="cursor-pointer w-full flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <ChartBarIcon className="h-5 w-5 text-purple-600 mr-3" />
                      <span className="font-medium text-purple-600">
                        View Analytics
                      </span>
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Recent Activity
                  </h2>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {analyticsData.recentActivity.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {session.userName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {session.startTime.toLocaleDateString()} at{" "}
                            {session.startTime.toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              session.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : session.status === "in-progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {session.status}
                          </span>
                          {session.score && (
                            <p className="text-sm font-medium mt-1">
                              {session.score}%
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === "library" && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
                    Test Library
                  </h1>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="relative">
                      <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search tests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                    >
                      <option value="all">All Categories</option>
                      {analyticsData.categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setShowExportModal(true)}
                      className="cursor-pointer flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                      Export
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTests.map((test) => (
                    <div
                      key={test.id}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow h-80 flex flex-col"
                    >
                      <div className="p-6 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              test.status === "published"
                                ? "bg-green-100 text-green-800"
                                : test.status === "draft"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {test.status}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              test.difficulty === "easy"
                                ? "bg-blue-100 text-blue-800"
                                : test.difficulty === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {test.difficulty}
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2 overflow-hidden" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          textOverflow: 'ellipsis'
                        }}>
                          {test.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 flex-grow overflow-hidden" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          textOverflow: 'ellipsis'
                        }}>
                          {test.description}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                          <span className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {test.duration} min
                          </span>
                          <span className="flex items-center">
                            <DocumentTextIcon className="h-4 w-4 mr-1" />
                            {test.questions.length} questions
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4 min-h-[28px]">
                          {test.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {test.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{test.tags.length - 3} more
                            </span>
                          )}
                        </div>

                        <div className="flex space-x-2 mt-auto">
                          <button
                            onClick={() => startTest(test)}
                            className="cursor-pointer flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
                          >
                            <PlayIcon className="h-4 w-4 mr-1" />
                            Start
                          </button>

                          <div className="flex space-x-1">
                            <button
                              onClick={() => duplicateTest(test)}
                              className="cursor-pointer p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                              title="Duplicate"
                            >
                              <DocumentDuplicateIcon className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => deleteTest(test.id)}
                              className="cursor-pointer p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md transition-colors"
                              title="Delete"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredTests.length === 0 && (
                  <div className="text-center py-12">
                    <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No tests found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchQuery || filterCategory !== "all"
                        ? "Try adjusting your search or filter criteria."
                        : "Get started by creating your first test."}
                    </p>
                    <button
                      onClick={() => setActiveView("create")}
                      className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Test
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeView === "create" && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Create New Test
                  </h1>

                  <div className="md:flex justify-start sm:justify-end hidden ">
                    <button
                      onClick={() =>
                        setPreviewMode(
                          previewMode === "desktop" ? "mobile" : "desktop"
                        )
                      }
                      className="cursor-pointer flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      {previewMode === "desktop" ? (
                        <>
                          <DevicePhoneMobileIcon className="h-4 w-4" />
                          <span>Mobile View</span>
                        </>
                      ) : (
                        <>
                          <ComputerDesktopIcon className="h-4 w-4" />
                          <span>Desktop View</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div
                className={`${
                  previewMode === "desktop"
                    ? "grid grid-cols-1 lg:grid-cols-2"
                    : ""
                } min-h-screen`}
              >
                {/* Editor Panel */}
                <div className="p-6 border-r border-gray-200 md:overflow-y-auto md:max-h-screen">
                  <div className="space-y-6">
                    {/* Test Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Test Information
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                          </label>
                          <input
                            type="text"
                            value={testForm.title}
                            onChange={(e) =>
                              setTestForm((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter test title"
                          />
                          {validationErrors.title && (
                            <p className="mt-1 text-sm text-red-600">
                              {validationErrors.title}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                          </label>
                          <textarea
                            value={testForm.description}
                            onChange={(e) =>
                              setTestForm((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            rows={3}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter test description"
                          />
                          {validationErrors.description && (
                            <p className="mt-1 text-sm text-red-600">
                              {validationErrors.description}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Duration (minutes) *
                            </label>
                            <input
                              type="number"
                              value={testForm.duration}
                              onChange={(e) =>
                                setTestForm((prev) => ({
                                  ...prev,
                                  duration: parseInt(e.target.value) || 0,
                                }))
                              }
                              min="1"
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {validationErrors.duration && (
                              <p className="mt-1 text-sm text-red-600">
                                {validationErrors.duration}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Difficulty
                            </label>
                            <select
                              value={testForm.difficulty}
                              onChange={(e) =>
                                setTestForm((prev) => ({
                                  ...prev,
                                  difficulty: e.target.value as any,
                                }))
                              }
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                              <option value="easy">Easy</option>
                              <option value="medium">Medium</option>
                              <option value="hard">Hard</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                          </label>
                          <input
                            type="text"
                            value={testForm.category}
                            onChange={(e) =>
                              setTestForm((prev) => ({
                                ...prev,
                                category: e.target.value,
                              }))
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Programming, Mathematics"
                          />
                          {validationErrors.category && (
                            <p className="mt-1 text-sm text-red-600">
                              {validationErrors.category}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Question Builder */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Add Question
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Question Type
                          </label>
                          <select
                            value={currentQuestion.type}
                            onChange={(e) =>
                              setCurrentQuestion((prev) => ({
                                ...prev,
                                type: e.target.value as any,
                              }))
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                          >
                            <option value="multiple-choice">
                              Multiple Choice
                            </option>
                            <option value="text">Short Text</option>
                            <option value="essay">Essay</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Question *
                          </label>
                          <textarea
                            value={currentQuestion.question}
                            onChange={(e) =>
                              setCurrentQuestion((prev) => ({
                                ...prev,
                                question: e.target.value,
                              }))
                            }
                            rows={2}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your question"
                          />
                          {validationErrors.question && (
                            <p className="mt-1 text-sm text-red-600">
                              {validationErrors.question}
                            </p>
                          )}
                        </div>

                        {currentQuestion.type === "multiple-choice" && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Options *
                              </label>
                              {currentQuestion.options?.map((option, index) => (
                                <div key={index} className="flex items-center mb-2 space-x-2">
                                  <input
                                    type="radio"
                                    name="correctAnswer"
                                    value={index}
                                    checked={currentQuestion.correctAnswer === index}
                                    onChange={(e) => {
                                      setCurrentQuestion((prev) => ({
                                        ...prev,
                                        correctAnswer: parseInt(e.target.value),
                                      }));
                                    }}
                                    className="cursor-pointer"
                                    title="Mark as correct answer"
                                  />
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [
                                        ...(currentQuestion.options || []),
                                      ];
                                      newOptions[index] = e.target.value;
                                      setCurrentQuestion((prev) => ({
                                        ...prev,
                                        options: newOptions,
                                      }));
                                    }}
                                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={`Option ${index + 1}`}
                                  />
                                </div>
                              ))}
                              <p className="text-xs text-gray-500 mt-1">
                                ✓ Select the radio button next to the correct answer
                              </p>
                              {validationErrors.options && (
                                <p className="mt-1 text-sm text-red-600">
                                  {validationErrors.options}
                                </p>
                              )}
                              {validationErrors.correctAnswer && (
                                <p className="mt-1 text-sm text-red-600">
                                  {validationErrors.correctAnswer}
                                </p>
                              )}
                            </div>
                          </>
                        )}

                        {currentQuestion.type === "text" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Correct Answer *
                            </label>
                            <input
                              type="text"
                              value={currentQuestion.correctAnswer as string || ""}
                              onChange={(e) =>
                                setCurrentQuestion((prev) => ({
                                  ...prev,
                                  correctAnswer: e.target.value,
                                }))
                              }
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter the correct answer"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              This will be used for automatic grading
                            </p>
                            {validationErrors.correctAnswer && (
                              <p className="mt-1 text-sm text-red-600">
                                {validationErrors.correctAnswer}
                              </p>
                            )}
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Points *
                          </label>
                          <input
                            type="number"
                            value={currentQuestion.points}
                            onChange={(e) =>
                              setCurrentQuestion((prev) => ({
                                ...prev,
                                points: parseInt(e.target.value) || 1,
                              }))
                            }
                            min="1"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {validationErrors.points && (
                            <p className="mt-1 text-sm text-red-600">
                              {validationErrors.points}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={addQuestion}
                          className="cursor-pointer w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                        >
                          Add Question
                        </button>
                      </div>
                    </div>

                    {/* Questions List */}
                    {testForm.questions.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                          Questions ({testForm.questions.length})
                        </h2>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {testForm.questions.map((question, index) => (
                            <div
                              key={question.id}
                              className="bg-white p-3 rounded border border-gray-200 "
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="font-medium text-sm">
                                    Q{index + 1}: {question.question}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {question.type} • {question.points} points
                                  </p>
                                </div>
                                <div className="flex space-x-1 ml-2">
                                  <button
                                    onClick={() => editQuestion(question.id)}
                                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                                    title="Edit"
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => removeQuestion(question.id)}
                                    className="cursor-pointer text-red-600 hover:text-red-800"
                                    title="Remove"
                                  >
                                    <XMarkIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                      <button
                        onClick={createTest}
                        className="cursor-pointer flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Create Test
                      </button>
                      <button
                        onClick={() => setActiveView("library")}
                        className="cursor-pointer flex-1 sm:flex-none px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preview Panel (Desktop Only) */}
                {previewMode === "desktop" && (
                  <div className="bg-gray-100 p-4 sm:p-6 overflow-y-auto max-h-screen md:block hidden">
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 w-full max-w-lg mx-auto">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                        Live Preview
                      </h3>

                      {testForm.title && (
                        <div className="mb-4">
                          <h4 className="text-base sm:text-lg font-semibold text-gray-800">
                            {testForm.title}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {testForm.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                            <span>Duration: {testForm.duration} minutes</span>
                            <span>Category: {testForm.category}</span>
                            <span
                              className={`px-2 py-1 rounded ${
                                testForm.difficulty === "easy"
                                  ? "bg-green-100 text-green-800"
                                  : testForm.difficulty === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {testForm.difficulty}
                            </span>
                          </div>
                        </div>
                      )}

                      {testForm.questions.length > 0 && (
                        <div className="space-y-4">
                          <h5 className="font-medium text-gray-700 text-sm sm:text-base">
                            Sample Questions:
                          </h5>

                          {testForm.questions
                            .slice(0, 2)
                            .map((question, index) => (
                              <div
                                key={question.id}
                                className="border border-gray-200 rounded p-3"
                              >
                                <p className="font-medium text-sm mb-2">
                                  Q{index + 1}: {question.question}
                                </p>

                                {question.type === "multiple-choice" &&
                                  question.options && (
                                    <div className="space-y-1">
                                      {question.options
                                        .filter((opt) => opt.trim())
                                        .map((option, optIndex) => (
                                          <label
                                            key={optIndex}
                                            className="flex items-center text-xs"
                                          >
                                            <input
                                              type="radio"
                                              className="mr-2"
                                              disabled
                                            />
                                            {option}
                                          </label>
                                        ))}
                                    </div>
                                  )}

                                {question.type === "text" && (
                                  <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                                    disabled
                                  />
                                )}

                                {question.type === "essay" && (
                                  <textarea
                                    rows={2}
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                                    disabled
                                  />
                                )}

                                <p className="text-xs text-gray-500 mt-1">
                                  {question.points} points
                                </p>
                              </div>
                            ))}

                          {testForm.questions.length > 2 && (
                            <p className="text-xs text-gray-500 text-center">
                              ... and {testForm.questions.length - 2} more
                              questions
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-gray-100 pt-2 flex md:hidden">
                  <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 w-full max-w-lg mx-auto">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      Live Preview
                    </h3>

                    {testForm.title && (
                      <div className="mb-4">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800">
                          {testForm.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {testForm.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                          <span>Duration: {testForm.duration} minutes</span>
                          <span>Category: {testForm.category}</span>
                          <span
                            className={`px-2 py-1 rounded ${
                              testForm.difficulty === "easy"
                                ? "bg-green-100 text-green-800"
                                : testForm.difficulty === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {testForm.difficulty}
                          </span>
                        </div>
                      </div>
                    )}

                    {testForm.questions.length > 0 && (
                      <div className="space-y-4">
                        <h5 className="font-medium text-gray-700 text-sm sm:text-base">
                          Sample Questions:
                        </h5>

                        {testForm.questions
                          .slice(0, 2)
                          .map((question, index) => (
                            <div
                              key={question.id}
                              className="border border-gray-200 rounded p-3"
                            >
                              <p className="font-medium text-sm mb-2">
                                Q{index + 1}: {question.question}
                              </p>

                              {question.type === "multiple-choice" &&
                                question.options && (
                                  <div className="space-y-1">
                                    {question.options
                                      .filter((opt) => opt.trim())
                                      .map((option, optIndex) => (
                                        <label
                                          key={optIndex}
                                          className="flex items-center text-xs"
                                        >
                                          <input
                                            type="radio"
                                            className="mr-2"
                                            disabled
                                          />
                                          {option}
                                        </label>
                                      ))}
                                  </div>
                                )}

                              {question.type === "text" && (
                                <input
                                  type="text"
                                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                                  disabled
                                />
                              )}

                              {question.type === "essay" && (
                                <textarea
                                  rows={2}
                                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                                  disabled
                                />
                              )}

                              <p className="text-xs text-gray-500 mt-1">
                                {question.points} points
                              </p>
                            </div>
                          ))}

                        {testForm.questions.length > 2 && (
                          <p className="text-xs text-gray-500 text-center">
                            ... and {testForm.questions.length - 2} more
                            questions
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === "test" && currentTest && currentSession && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
              {/* Test Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      {currentTest.title}
                    </h1>
                    <p className="text-sm text-gray-600">
                      {currentTest.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div
                      className={`text-lg font-semibold ${
                        showFullscreenWarning
                          ? "text-red-600"
                          : isOnBreak
                          ? "text-orange-600"
                          : "text-blue-600"
                      }`}
                    >
                      {showFullscreenWarning
                        ? "PAUSED - FULLSCREEN REQUIRED"
                        : isOnBreak
                        ? "ON BREAK"
                        : formatTime(timeRemaining)}
                    </div>
                    {!isFullscreen && !showFullscreenWarning && (
                      <div className="text-sm text-red-600 font-medium">
                        Not in fullscreen
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Test Content */}
              <div className=" p-4 md:p-6 overflow-y-auto max-h-screen">
                <div className="max-w-4xl mx-auto">
                  {currentTest.questions.length === 0 ? (
                    <div className="text-center py-12">
                      <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No questions available
                      </h3>
                      <p className="text-gray-600 mb-4">
                        This test doesn't have any questions yet.
                      </p>
                      <button
                        onClick={endTestSession}
                        className="cursor-pointer bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Return to Dashboard
                      </button>
                    </div>
                  ) : (
                    <>
                      {currentTest.questions.map((question, index) => (
                        <div
                          key={question.id}
                          className="mb-8 p-6 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Question {index + 1}
                            </h3>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {question.points} points
                            </span>
                          </div>

                          <p className="text-gray-700 mb-4">
                            {question.question}
                          </p>

                          {question.type === "multiple-choice" &&
                            question.options && (
                              <div className="space-y-2">
                                {question.options
                                  .filter((opt) => opt.trim())
                                  .map((option, optIndex) => (
                                    <label
                                      key={optIndex}
                                      className="flex items-center cursor-pointer"
                                    >
                                      <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        value={optIndex}
                                        onChange={(e) => {
                                          if (currentSession) {
                                            setCurrentSession((prev) =>
                                              prev
                                                ? {
                                                    ...prev,
                                                    answers: {
                                                      ...prev.answers,
                                                      [question.id]: parseInt(
                                                        e.target.value
                                                      ),
                                                    },
                                                  }
                                                : null
                                            );
                                          }
                                        }}
                                        className="mr-3"
                                      />
                                      <span className="text-gray-700">
                                        {option}
                                      </span>
                                    </label>
                                  ))}
                              </div>
                            )}

                          {question.type === "text" && (
                            <input
                              type="text"
                              onChange={(e) => {
                                if (currentSession) {
                                  setCurrentSession((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          answers: {
                                            ...prev.answers,
                                            [question.id]: e.target.value,
                                          },
                                        }
                                      : null
                                  );
                                }
                              }}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter your answer"
                            />
                          )}

                          {question.type === "essay" && (
                            <textarea
                              rows={4}
                              onChange={(e) => {
                                if (currentSession) {
                                  setCurrentSession((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          answers: {
                                            ...prev.answers,
                                            [question.id]: e.target.value,
                                          },
                                        }
                                      : null
                                  );
                                }
                              }}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter your essay response"
                            />
                          )}
                        </div>
                      ))}
                    </>
                  )}
                  <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0 mt-8">
                    {isOnBreak ? (
                      <button
                        onClick={resumeTest}
                        className="w-full sm:w-auto cursor-pointer bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        Resume Test
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={endTestSession}
                          className="w-full sm:w-auto cursor-pointer bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                          Submit Test
                        </button>
                        <button
                          onClick={() => setShowProctorModal(true)}
                          className="w-full sm:w-auto cursor-pointer bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          Request Break
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === "analytics" && (
          <div className="px-4 py-6 sm:px-0 overflow-y-auto">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">
                  Analytics Dashboard
                </h1>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-8 w-8" />
                        <div className="ml-4">
                          <p className="text-2xl font-semibold">
                            {analyticsData.totalTests}
                          </p>
                          <p className="text-blue-100">Total Tests</p>
                        </div>
                      </div>
                      {isMobile && (
                        <Sparkline
                          data={analyticsData.performanceData}
                          color="#ffffff"
                        />
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <UserGroupIcon className="h-8 w-8" />
                        <div className="ml-4">
                          <p className="text-2xl font-semibold">
                            {analyticsData.totalSessions}
                          </p>
                          <p className="text-green-100">Test Sessions</p>
                        </div>
                      </div>
                      {isMobile && (
                        <Sparkline
                          data={analyticsData.performanceData}
                          color="#ffffff"
                        />
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ChartBarIcon className="h-8 w-8" />
                        <div className="ml-4">
                          <p className="text-2xl font-semibold">
                            {analyticsData.avgScore.toFixed(1)}%
                          </p>
                          <p className="text-purple-100">Average Score</p>
                        </div>
                      </div>
                      {isMobile && (
                        <Sparkline
                          data={analyticsData.performanceData}
                          color="#ffffff"
                        />
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-8 w-8" />
                        <div className="ml-4">
                          <p className="text-2xl font-semibold">
                            {analyticsData.completionRate.toFixed(1)}%
                          </p>
                          <p className="text-orange-100">Completion Rate</p>
                        </div>
                      </div>
                      {isMobile && (
                        <Sparkline
                          data={analyticsData.performanceData}
                          color="#ffffff"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Performance Over Time Chart */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Performance Over Time
                    </h3>
                    {isMobile ? (
                      <div className="space-y-3">
                        {analyticsData.performanceData
                          .slice(-5)
                          .map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-white rounded"
                            >
                              <span className="text-sm font-medium">
                                Session {item.session}
                              </span>
                              <div className="flex items-center space-x-2">
                                <Sparkline data={[item]} color="#3B82F6" />
                                <span className="text-sm font-bold text-blue-600">
                                  {item.score}%
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={analyticsData.performanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="session" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="score"
                              stroke="#3B82F6"
                              strokeWidth={2}
                              dot={{ fill: "#3B82F6" }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>

                  {/* Category Performance */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Performance by Category
                    </h3>
                    {isMobile ? (
                      <div className="space-y-3">
                        {analyticsData.categoryData.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-white rounded"
                          >
                            <span className="text-sm font-medium">
                              {item.category}
                            </span>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-600 h-2 rounded-full"
                                  style={{ width: `${item.avgScore}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-bold">
                                {item.avgScore}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analyticsData.categoryData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Bar dataKey="avgScore" fill="#10B981" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Score Distribution */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Score Distribution
                    </h3>
                    {isMobile ? (
                      <div className="space-y-2">
                        {analyticsData.scoreDistribution.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-white rounded"
                          >
                            <span className="text-sm">{item.range}</span>
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-3 h-3 rounded"
                                style={{ backgroundColor: item.color }}
                              ></div>
                              <span className="text-sm font-medium">
                                {item.count}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analyticsData.scoreDistribution}
                              cx="50%"
                              cy="45%"
                              outerRadius={70}
                              dataKey="count"
                              label={false}
                            >
                              {analyticsData.scoreDistribution.map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                )
                              )}
                            </Pie>
                            <Tooltip 
                              formatter={(value, name, props) => [
                                `${value} students`,
                                props.payload.range
                              ]}
                            />
                            <Legend 
                              verticalAlign="bottom"
                              height={60}
                              formatter={(value) => value}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>

                  {/* Recent Sessions */}
                  <div className="bg-gray-50 p-6 rounded-lg h-[456px] flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recent Test Sessions
                    </h3>
                    <div className="space-y-3 flex-1 overflow-y-auto">
                      {analyticsData.recentActivity.map((session) => (
                        <div
                          key={session.id}
                          className="bg-white p-3 rounded border border-gray-200"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">
                                {session.userName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {session.startTime.toLocaleDateString()} at{" "}
                                {session.startTime.toLocaleTimeString()}
                              </p>
                              {session.violations.length > 0 && (
                                <p className="text-xs text-red-600 flex items-center">
                                  <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                                  {session.violations.length} violation(s)
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  session.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : session.status === "in-progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {session.status}
                              </span>
                              {session.score && (
                                <p className="text-sm font-medium mt-1">
                                  {session.score}%
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {analyticsData.recentActivity.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No sessions yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === "settings" && (
          <div className="px-4 py-6 sm:px-0 overflow-y-auto">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              </div>

              <div className="p-6">
                <div className="max-w-2xl">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Proctoring Settings
                      </h3>
                      <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="mr-3 h-4 w-4 text-blue-600 rounded"
                          />
                          <div>
                            <span className="text-gray-700 font-medium">
                              Require fullscreen mode
                            </span>
                            <p className="text-sm text-gray-500">
                              Force users to stay in fullscreen during tests
                            </p>
                          </div>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="mr-3 h-4 w-4 text-blue-600 rounded"
                          />
                          <div>
                            <span className="text-gray-700 font-medium">
                              Track tab switching
                            </span>
                            <p className="text-sm text-gray-500">
                              Log when users switch browser tabs
                            </p>
                          </div>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="mr-3 h-4 w-4 text-blue-600 rounded"
                          />
                          <div>
                            <span className="text-gray-700 font-medium">
                              Enable break requests
                            </span>
                            <p className="text-sm text-gray-500">
                              Allow users to request breaks during tests
                            </p>
                          </div>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="mr-3 h-4 w-4 text-blue-600 rounded"
                          />
                          <div>
                            <span className="text-gray-700 font-medium">
                              Webcam monitoring
                            </span>
                            <p className="text-sm text-gray-500">
                              Record user webcam during test sessions
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Time Management
                      </h3>
                      <div className="space-y-4 pl-4 border-l-2 border-green-200">
                        <div className="flex items-center space-x-4">
                          <label className="text-gray-700 font-medium">
                            Warning alert at:
                          </label>
                          <select className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 cursor-pointer">
                            <option>5 minutes remaining</option>
                            <option>10 minutes remaining</option>
                            <option>15 minutes remaining</option>
                          </select>
                        </div>
                        <div className="flex items-center space-x-4">
                          <label className="text-gray-700 font-medium">
                            Final warning at:
                          </label>
                          <select className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 cursor-pointer">
                            <option>1 minute remaining</option>
                            <option>2 minutes remaining</option>
                            <option>30 seconds remaining</option>
                          </select>
                        </div>
                        <div className="flex items-center space-x-4">
                          <label className="text-gray-700 font-medium">
                            Auto-submit after time:
                          </label>
                          <select className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 cursor-pointer">
                            <option>Immediately</option>
                            <option>30 seconds grace</option>
                            <option>1 minute grace</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Security
                      </h3>
                      <div className="space-y-4 pl-4 border-l-2 border-red-200">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="mr-3 h-4 w-4 text-red-600 rounded"
                          />
                          <div>
                            <span className="text-gray-700 font-medium">
                              Disable right-click during test
                            </span>
                            <p className="text-sm text-gray-500">
                              Prevent copy/paste and context menus
                            </p>
                          </div>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="mr-3 h-4 w-4 text-red-600 rounded"
                          />
                          <div>
                            <span className="text-gray-700 font-medium">
                              Disable keyboard shortcuts
                            </span>
                            <p className="text-sm text-gray-500">
                              Block common shortcuts like Ctrl+C, Ctrl+V
                            </p>
                          </div>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="mr-3 h-4 w-4 text-red-600 rounded"
                          />
                          <div>
                            <span className="text-gray-700 font-medium">
                              Randomize question order
                            </span>
                            <p className="text-sm text-gray-500">
                              Show questions in random order for each user
                            </p>
                          </div>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="mr-3 h-4 w-4 text-red-600 rounded"
                          />
                          <div>
                            <span className="text-gray-700 font-medium">
                              Randomize answer options
                            </span>
                            <p className="text-sm text-gray-500">
                              Shuffle multiple choice options
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Notifications
                      </h3>
                      <div className="space-y-4 pl-4 border-l-2 border-purple-200">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="mr-3 h-4 w-4 text-purple-600 rounded"
                          />
                          <div>
                            <span className="text-gray-700 font-medium">
                              Email test completion reports
                            </span>
                            <p className="text-sm text-gray-500">
                              Send summary emails when tests are completed
                            </p>
                          </div>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="mr-3 h-4 w-4 text-purple-600 rounded"
                          />
                          <div>
                            <span className="text-gray-700 font-medium">
                              Real-time violation alerts
                            </span>
                            <p className="text-sm text-gray-500">
                              Immediate notifications for proctoring violations
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <button
                        onClick={() =>
                          addToast({
                            type: "success",
                            message: "Settings saved successfully!",
                          })
                        }
                        className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
                      >
                        Save Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} TestPro - Professional Testing Platform. All rights reserved.</p>
        </div>
      </footer>

      {/* Proctor Modal */}
      {showProctorModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setShowProctorModal(false)} // ✅ Close on outside click
        >
          {/* Modern Blurry Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

          {/* Modal */}
          <div
            className="relative z-10 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-6 w-full max-w-lg border border-white/20"
            onClick={(e) => e.stopPropagation()} // ✅ Prevent inner click from closing
          >
            <div className="flex items-center space-x-3 mb-4">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Request Break
              </h3>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Select the reason for your break request. Your test timer will be
              paused:
            </p>

            <div className="space-y-2">
              {[
                "Bathroom break",
                "Technical issue",
                "Medical emergency",
                "Network connectivity problem",
                "Other",
              ].map((reason) => (
                <button
                  key={reason}
                  onClick={(e) => {
                    e.stopPropagation();
                    takeBreak(reason);
                  }}
                  className="cursor-pointer w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setShowProctorModal(false)}
                className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setShowExportModal(false)} // ✅ Close on outside click
        >
          {/* Modern Blurry Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

          {/* Modal Content */}
          <div
            className="relative z-10 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-6 w-full max-w-lg border border-white/20"
            onClick={(e) => e.stopPropagation()} // ✅ Prevent close on inner click
          >
            <div className="flex items-center space-x-3 mb-4">
              <ArrowDownTrayIcon className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Export Data
              </h3>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Choose what data you'd like to export:
            </p>

            {[
              { id: "tests", label: "Test Definitions", desc: "All test data" },
              {
                id: "sessions",
                label: "Test Sessions",
                desc: "Session results",
              },
              { id: "users", label: "User Data", desc: "User info & stats" },
              {
                id: "analytics",
                label: "Analytics Report",
                desc: "Charts & metrics",
              },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  addToast({
                    type: "success",
                    message: `${item.label} exported!`,
                  });
                  setShowExportModal(false);
                }}
                className="cursor-pointer w-full text-left px-4 py-3 mb-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">{item.label}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </button>
            ))}

            <div className="mt-4 text-right">
              <button
                onClick={() => setShowExportModal(false)}
                className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Warning Modal */}
      {showFullscreenWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop that blocks interaction with background */}
          <div
            className="absolute inset-0 bg-red-600 bg-opacity-90"
            style={{ pointerEvents: "auto" }}
          ></div>

          {/* Modal - Make sure it's clickable */}
          <div
            className="relative z-10 bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center"
            style={{ pointerEvents: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6">
              <ExclamationTriangleIcon className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
                Test Paused
              </h3>
              <p className="text-gray-600 mb-4">
                Fullscreen mode is required during the test. Your timer has been
                paused.
              </p>
              <p className="text-sm text-red-600 font-medium">
                Click the button below to return to fullscreen and resume your
                test.
              </p>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (fullscreenRef.current) {
                  fullscreenRef.current
                    .requestFullscreen()
                    .then(() => {
                      setShowFullscreenWarning(false);
                      // Resume timer only if not on break
                      if (!isOnBreak && currentSession) {
                        setIsTimerActive(true);
                      }
                      addToast({
                        type: "success",
                        message: "Test resumed in fullscreen mode",
                      });
                    })
                    .catch((err) => {
                      console.error("Fullscreen failed:", err);
                      addToast({
                        type: "error",
                        message:
                          "Unable to enter fullscreen. Please try again or contact support.",
                        duration: 5000,
                      });
                    });
                }
              }}
              className="cursor-pointer bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg focus:outline-none focus:ring-4 focus:ring-red-300 flex items-center justify-center"
              type="button"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Return to Fullscreen & Resume Test
            </button>

            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Note:</strong> This violation has been recorded in your
                test session.
              </p>
            </div>

            <div className="mt-3 text-xs text-gray-500 flex items-center justify-center">
              <BellIcon className="h-3 w-3 mr-1" />
              <strong>Tip:</strong> Press F11 on most browsers to enter
              fullscreen mode
            </div>
          </div>
        </div>
      )}
      {isOnBreak && !showFullscreenWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-yellow-600/20 backdrop-blur-sm"></div>

          <div
            className="relative z-10 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-8 w-full max-w-md text-center border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <ClockIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              You're on a break
            </h3>
            <p className="text-gray-600 mb-6">
              The test timer is paused. Click below to resume when you're ready.
            </p>

            <button
              onClick={resumeTest}
              className="cursor-pointer bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg focus:outline-none focus:ring-4 focus:ring-green-300 flex items-center justify-center"
            >
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Resume Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPro;
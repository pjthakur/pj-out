"use client";

import { useEffect, useState } from "react";
import {
  FiPlus,
  FiTrash,
  FiFilter,
  FiX,
  FiEdit,
  FiCalendar,
  FiFlag,
  FiBarChart2,
  FiCheck,
  FiClock,
  FiChevronDown,
  FiChevronUp,
  FiHome,
  FiList,
  FiTrendingUp,
  FiSettings,
  FiMenu,
  FiArrowRight,
  FiCheckCircle,
  FiTarget,
  FiZap,
  FiUsers,
} from "react-icons/fi";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date | null;
  priority: "low" | "medium" | "high";
  category: string;
}

interface CategorySummary {
  name: string;
  count: number;
  completed: number;
}

export default function TaskManagerApp() {
  const [currentView, setCurrentView] = useState<"landing" | "dashboard">(
    "landing"
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [filterOption, setFilterOption] = useState<string>("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAddTaskInput, setShowAddTaskInput] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dueDate, setDueDate] = useState<string>("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [category, setCategory] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([
    "Work",
    "Personal",
    "Shopping",
    "Health",
  ]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [showStats, setShowStats] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("tasks");

  // Initialize with some sample data for demo
  useEffect(() => {
    const sampleTasks: Task[] = [
      {
        id: 1,
        text: "Complete project proposal",
        completed: false,
        createdAt: new Date(),
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        priority: "high",
        category: "Work",
      },
      {
        id: 2,
        text: "Buy groceries",
        completed: false,
        createdAt: new Date(),
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        priority: "medium",
        category: "Personal",
      },
      {
        id: 3,
        text: "Review quarterly reports",
        completed: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        dueDate: null,
        priority: "low",
        category: "Work",
      },
      {
        id: 4,
        text: "Call the dentist",
        completed: false,
        createdAt: new Date(),
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        priority: "high",
        category: "Health",
      },
      {
        id: 5,
        text: "Finish UI design draft",
        completed: false,
        createdAt: new Date(),
        dueDate: null,
        priority: "medium",
        category: "Work",
      },
      {
        id: 6,
        text: "Plan weekend trip",
        completed: false,
        createdAt: new Date(),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        priority: "low",
        category: "Personal",
      },
      {
        id: 7,
        text: "Refill prescriptions",
        completed: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        priority: "medium",
        category: "Health",
      },
      {
        id: 8,
        text: "Update resume",
        completed: false,
        createdAt: new Date(),
        dueDate: null,
        priority: "high",
        category: "Work",
      },
    ];
    setTasks(sampleTasks);
  }, []);

  // Set sidebar open by default on desktop, closed on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // Desktop: always open, no toggle needed
        setSidebarOpen(true);
      } else {
        // Mobile: closed by default
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const uniqueCategories = [
      ...new Set(tasks.map((task) => task.category)),
    ].filter(Boolean);
    setCategories((prev) => [...new Set([...prev, ...uniqueCategories])]);
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() === "") return;

    setIsLoading(true);

    setTimeout(() => {
      const task: Task = {
        id: Date.now(),
        text: newTask,
        completed: false,
        createdAt: new Date(),
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority,
        category: category.trim() || "General",
      };

      setTasks([...tasks, task]);
      setNewTask("");
      setDueDate("");
      setPriority("medium");
      setCategory("");
      setShowAddTaskInput(false);
      setIsLoading(false);
    }, 300);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask(task.text);
    setDueDate(task.dueDate ? task.dueDate.toISOString().split("T")[0] : "");
    setPriority(task.priority);
    setCategory(task.category);
    setShowAddTaskInput(true);
  };

  const handleUpdateTask = () => {
    if (editingTask && newTask.trim() !== "") {
      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                text: newTask,
                dueDate: dueDate ? new Date(dueDate) : null,
                priority: priority,
                category: category.trim() || task.category,
              }
            : task
        )
      );
      setEditingTask(null);
      setNewTask("");
      setDueDate("");
      setPriority("medium");
      setCategory("");
      setShowAddTaskInput(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setNewTask("");
    setDueDate("");
    setPriority("medium");
    setCategory("");
    setShowAddTaskInput(false);
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleToggleComplete = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleFilterChange = (option: string) => {
    setFilterOption(option);
  };

  const handleCategoryFilterChange = (option: string) => {
    setCategoryFilter(option);
  };

  const handlePriorityFilterChange = (option: string) => {
    setPriorityFilter(option);
  };

  const handleSortChange = (option: string) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(option);
      setSortDirection("asc");
    }
  };

  const handleResetFilters = () => {
    setFilterOption("all");
    setCategoryFilter("all");
    setPriorityFilter("all");
    setSortBy("createdAt");
    setSortDirection("desc");
  };

  const filteredTasks = () => {
    return tasks
      .filter((task) => {
        if (filterOption === "completed" && !task.completed) return false;
        if (filterOption === "pending" && task.completed) return false;
        if (categoryFilter !== "all" && task.category !== categoryFilter)
          return false;
        if (priorityFilter !== "all" && task.priority !== priorityFilter)
          return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "createdAt") {
          return sortDirection === "asc"
            ? a.createdAt.getTime() - b.createdAt.getTime()
            : b.createdAt.getTime() - a.createdAt.getTime();
        } else if (sortBy === "dueDate") {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return sortDirection === "asc" ? 1 : -1;
          if (!b.dueDate) return sortDirection === "asc" ? -1 : 1;

          return sortDirection === "asc"
            ? a.dueDate.getTime() - b.dueDate.getTime()
            : b.dueDate.getTime() - a.dueDate.getTime();
        } else if (sortBy === "priority") {
          const priorityValues = { low: 1, medium: 2, high: 3 };
          return sortDirection === "asc"
            ? priorityValues[a.priority] - priorityValues[b.priority]
            : priorityValues[b.priority] - priorityValues[a.priority];
        }
        return 0;
      });
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const remainingCount = tasks.length - completedCount;
  const progressPercentage = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  const today = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(today.getDate() + 3);

  const dueSoonCount = tasks.filter(
    (task) =>
      !task.completed &&
      task.dueDate &&
      task.dueDate >= today &&
      task.dueDate <= threeDaysFromNow
  ).length;

  const overdueCount = tasks.filter(
    (task) => !task.completed && task.dueDate && task.dueDate < today
  ).length;

  const categorySummary: CategorySummary[] = categories.map((cat) => {
    const categoryTasks = tasks.filter((task) => task.category === cat);
    return {
      name: cat,
      count: categoryTasks.length,
      completed: categoryTasks.filter((task) => task.completed).length,
    };
  });

  const formatDate = (date: Date | null | undefined): string => {
    if (!date) return "No due date";

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }

    if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: today.getFullYear() !== date.getFullYear() ? "numeric" : undefined,
    });
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-slate-500";
    }
  };

  const getPriorityBgColor = (priority: string): string => {
    switch (priority) {
      case "high":
        return "bg-red-100";
      case "medium":
        return "bg-yellow-100";
      case "low":
        return "bg-green-100";
      default:
        return "bg-slate-100";
    }
  };

  const isOverdue = (task: Task): boolean => {
    return (
      !task.completed &&
      task.dueDate !== null &&
      task.dueDate !== undefined &&
      task.dueDate < new Date()
    );
  };

  const isDueSoon = (task: Task): boolean => {
    if (!task.dueDate || task.completed) return false;

    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    return task.dueDate >= today && task.dueDate <= threeDaysFromNow;
  };

  if (currentView === "landing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/60 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FiCheck className="text-white text-lg md:text-xl" />
                </div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  TaskFlow Pro
                </h1>
              </div>
              <button
                onClick={() => setCurrentView("dashboard")}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-sm md:text-base cursor-pointer"
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-12 md:pt-20 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="space-y-6 md:space-y-8">
                <div className="space-y-4">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Organize Your Life with
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent block">
                      Smart Task Management
                    </span>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                    Boost your productivity with our intuitive task manager.
                    Track progress, set priorities, and never miss a deadline
                    again.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setCurrentView("dashboard")}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group cursor-pointer"
                  >
                    Start Managing Tasks
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>

                <div className="flex items-center justify-between sm:justify-start sm:space-x-8 pt-6 md:pt-8">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">
                      10K+
                    </div>
                    <div className="text-sm md:text-base text-gray-600">
                      Active Users
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">
                      99%
                    </div>
                    <div className="text-sm md:text-base text-gray-600">
                      Satisfaction
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">
                      24/7
                    </div>
                    <div className="text-sm md:text-base text-gray-600">
                      Support
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Today's Tasks
                      </h3>
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FiCheck className="text-white" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <FiCheck className="text-white text-xs" />
                        </div>
                        <span className="text-gray-700 line-through">
                          Complete morning workout
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="w-5 h-5 border-2 border-yellow-500 rounded-full"></div>
                        <span className="text-gray-700">
                          Review project proposal
                        </span>
                        <span className="ml-auto text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                          High
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="w-5 h-5 border-2 border-blue-500 rounded-full"></div>
                        <span className="text-gray-700">
                          Team meeting at 3 PM
                        </span>
                        <span className="ml-auto text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                          Work
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>67%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full w-2/3"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FiZap className="text-white" />
                </div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FiTarget className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to Stay Organized
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Powerful features designed to help you manage tasks efficiently
                and boost your productivity.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl border border-indigo-100">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <FiList className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Smart Organization
                </h3>
                <p className="text-gray-600">
                  Organize tasks by categories, priorities, and due dates. Keep
                  everything structured and easy to find.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl border border-green-100">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <FiBarChart2 className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Progress Tracking
                </h3>
                <p className="text-gray-600">
                  Visual progress bars and statistics help you track your
                  productivity and stay motivated.
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl border border-yellow-100">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mb-6">
                  <FiClock className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Smart Reminders
                </h3>
                <p className="text-gray-600">
                  Never miss a deadline with intelligent due date tracking and
                  overdue task highlights.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-100">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                  <FiFilter className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Advanced Filtering
                </h3>
                <p className="text-gray-600">
                  Filter and sort tasks by status, category, priority, or due
                  date to focus on what matters most.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <FiUsers className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Team Collaboration
                </h3>
                <p className="text-gray-600">
                  Share tasks and collaborate with team members to achieve
                  common goals together.
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-2xl border border-red-100">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                  <FiSettings className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Customizable
                </h3>
                <p className="text-gray-600">
                  Personalize your workflow with custom categories, themes, and
                  notification preferences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-700">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Productivity?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of users who have already boosted their
              productivity with TaskFlow Pro.
            </p>
            <button
              onClick={() => setCurrentView("dashboard")}
              className="bg-white hover:bg-gray-50 text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center group cursor-pointer"
            >
              Start Your Free Trial
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FiCheck className="text-white" />
              </div>
              <span className="text-xl font-bold">TaskFlow Pro</span>
            </div>
            <div className="text-center text-gray-400">
              <p>&copy; 2024 TaskFlow Pro. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-['Roboto',sans-serif] overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-white shadow-xl transition-all duration-300 z-50 ${
          // Mobile: fixed overlay that slides in from left
          "md:relative fixed top-0 left-0 md:h-auto h-full " +
          // Mobile: hidden by default, full width when open
          (sidebarOpen ? "translate-x-0 w-80" : "-translate-x-full w-80") +
          " " +
          // Desktop: always visible with full width
          "md:translate-x-0 md:w-80"
        } flex-shrink-0 border-r border-gray-100 flex flex-col h-screen md:h-screen`}
      >
        {/* Header */}
        <div className="py-3 px-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiCheck className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  TaskFlow Pro
                </h1>
                <p className="text-sm text-gray-500">Stay organized</p>
              </div>
            </div>
            {/* Only show close button on mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 rounded-xl hover:bg-white/60 transition-all duration-200 cursor-pointer"
            >
              <FiX className="text-gray-600 w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {/* Navigation */}
          <nav className="p-4 space-y-2">
            <button
              onClick={() => {
                setCurrentView("landing");
                setSidebarOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200 text-left group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-600 flex items-center justify-center transition-all duration-200">
                <FiHome className="text-gray-600 group-hover:text-white w-4 h-4 transition-colors duration-200" />
              </div>
              <span className="text-gray-700 font-medium group-hover:text-gray-900">Home</span>
            </button>

            <button
              onClick={() => {
                setActiveSection("tasks");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group cursor-pointer ${
                activeSection === "tasks"
                  ? "bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 shadow-sm"
                  : "hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                activeSection === "tasks"
                  ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                  : "bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-600"
              }`}>
                <FiList className={`w-4 h-4 transition-colors duration-200 ${
                  activeSection === "tasks"
                    ? "text-white"
                    : "text-gray-600 group-hover:text-white"
                }`} />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <span className={`font-medium transition-colors duration-200 ${
                  activeSection === "tasks"
                    ? "text-indigo-700"
                    : "text-gray-700 group-hover:text-gray-900"
                }`}>
                  All Tasks
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all duration-200 ${
                  activeSection === "tasks"
                    ? "bg-indigo-200 text-indigo-700"
                    : "bg-gray-200 text-gray-600 group-hover:bg-indigo-200 group-hover:text-indigo-700"
                }`}>
                  {tasks.length}
                </span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveSection("analytics");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group cursor-pointer ${
                activeSection === "analytics"
                  ? "bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 shadow-sm"
                  : "hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                activeSection === "analytics"
                  ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                  : "bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-600"
              }`}>
                <FiTrendingUp className={`w-4 h-4 transition-colors duration-200 ${
                  activeSection === "analytics"
                    ? "text-white"
                    : "text-gray-600 group-hover:text-white"
                }`} />
              </div>
              <span className={`font-medium transition-colors duration-200 ${
                activeSection === "analytics"
                  ? "text-indigo-700"
                  : "text-gray-700 group-hover:text-gray-900"
              }`}>
                Analytics
              </span>
            </button>
          </nav>

          {/* Quick Stats */}
          <div className="p-4">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                  Quick Stats
                </h3>
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FiBarChart2 className="text-white w-3 h-3" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <FiCheckCircle className="text-green-600 w-4 h-4" />
                    </div>
                    <span className="text-gray-700 font-medium">Completed</span>
                  </div>
                  <span className="font-bold text-green-600 text-lg">
                    {completedCount}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <FiClock className="text-amber-600 w-4 h-4" />
                    </div>
                    <span className="text-gray-700 font-medium">Remaining</span>
                  </div>
                  <span className="font-bold text-amber-600 text-lg">
                    {remainingCount}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <FiFlag className="text-red-600 w-4 h-4" />
                    </div>
                    <span className="text-gray-700 font-medium">Overdue</span>
                  </div>
                  <span className="font-bold text-red-600 text-lg">{overdueCount}</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                  <span className="text-sm font-bold text-indigo-600">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-3 fixed top-0 left-0 md:left-80 right-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Hamburger Menu */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
              >
                <FiMenu className="text-gray-600" />
              </button>

              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900">
                  {activeSection === "tasks"
                    ? "Task Management"
                    : "Analytics Dashboard"}
                </h1>
                <p className="text-gray-600 mt-0.5 text-xs md:text-sm">
                  {activeSection === "tasks"
                    ? `Manage your ${tasks.length} tasks efficiently`
                    : "Track your productivity and progress"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-20 md:pt-24 scrollbar-hide">
          {/* Progress and Add Task Section */}
          <div className="max-w-7xl mx-auto mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  {/* Progress Circle */}
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="w-20 h-20 md:w-24 md:h-24">
                        <svg
                          className="w-full h-full transform -rotate-90"
                          viewBox="0 0 36 36"
                        >
                          <path
                            d="M18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                            fill="none"
                            stroke="#f3f4f6"
                            strokeWidth="3"
                          />
                          <path
                            d="M18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                            fill="none"
                            stroke="#6366f1"
                            strokeWidth="3"
                            strokeDasharray={`${progressPercentage}, 100`}
                            className="transition-all duration-1000 ease-in-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-xl md:text-2xl font-bold text-indigo-600">
                              {progressPercentage}%
                            </div>
                            <div className="text-xs text-gray-500 font-medium">
                              Complete
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 md:gap-6 flex-1 min-w-0">
                    <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">
                        {completedCount}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        Completed
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="text-2xl md:text-3xl font-bold text-amber-600 mb-1">
                        {remainingCount}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        Remaining
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="text-2xl md:text-3xl font-bold text-red-600 mb-1">
                        {overdueCount}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        Overdue
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add Task Button */}
                <div className="flex-shrink-0">
                  <button
                    onClick={() => {
                      setShowAddTaskInput(true);
                      setActiveSection("tasks");
                    }}
                    className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 font-medium cursor-pointer group"
                  >
                    <FiPlus className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span>Add New Task</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {activeSection === "tasks" ? (
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Quick Actions */}
              {showAddTaskInput && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    {editingTask ? "Edit Task" : "Add New Task"}
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="task-text"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Task Description
                      </label>
                      <input
                        id="task-text"
                        type="text"
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        placeholder="What needs to be done?"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        autoFocus
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="due-date"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Due Date
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FiCalendar className="text-gray-400" />
                          </div>
                          <input
                            id="due-date"
                            type="date"
                            className="w-full pl-12 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="priority"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Priority
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FiFlag className={getPriorityColor(priority)} />
                          </div>
                          <select
                            id="priority"
                            className="w-full pl-12 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 cursor-pointer"
                            value={priority}
                            onChange={(e) =>
                              setPriority(
                                e.target.value as "low" | "medium" | "high"
                              )
                            }
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="category"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Category
                        </label>
                        <input
                          id="category"
                          type="text"
                          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                          placeholder="e.g., Work, Personal"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          list="categories"
                        />
                        <datalist id="categories">
                          {categories.map((cat) => (
                            <option key={cat} value={cat} />
                          ))}
                        </datalist>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                      <button
                        className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 cursor-pointer font-medium"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                      <button
                        className={`px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors duration-200 cursor-pointer font-medium ${
                          isLoading || !newTask.trim()
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={editingTask ? handleUpdateTask : handleAddTask}
                        disabled={isLoading || !newTask.trim()}
                      >
                        {isLoading
                          ? "Processing..."
                          : editingTask
                          ? "Update Task"
                          : "Add Task"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Filters and Controls */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
                <div className="space-y-6">
                  {/* Filter Dropdowns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <select
                      className="w-full p-4 bg-white text-gray-700 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 cursor-pointer font-medium"
                      value={filterOption}
                      onChange={(e) => handleFilterChange(e.target.value)}
                    >
                      <option value="all">All Tasks</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                    </select>

                    <select
                      className="w-full p-4 bg-white text-gray-700 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 cursor-pointer font-medium"
                      value={categoryFilter}
                      onChange={(e) =>
                        handleCategoryFilterChange(e.target.value)
                      }
                    >
                      <option value="all">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>

                    <select
                      className="w-full p-4 bg-white text-gray-700 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 cursor-pointer font-medium"
                      value={priorityFilter}
                      onChange={(e) =>
                        handlePriorityFilterChange(e.target.value)
                      }
                    >
                      <option value="all">All Priorities</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  {/* Sort Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-3">
                    <button
                      className={`px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer text-sm md:text-base font-medium flex items-center justify-center space-x-2 ${
                        sortBy === "createdAt"
                          ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                      onClick={() => handleSortChange("createdAt")}
                    >
                      <span className="whitespace-nowrap">Date Added</span>
                      {sortBy === "createdAt" &&
                        (sortDirection === "asc" ? (
                          <FiChevronUp className="w-4 h-4" />
                        ) : (
                          <FiChevronDown className="w-4 h-4" />
                        ))}
                    </button>
                    <button
                      className={`px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer text-sm md:text-base font-medium flex items-center justify-center space-x-2 ${
                        sortBy === "dueDate"
                          ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                      onClick={() => handleSortChange("dueDate")}
                    >
                      <span className="whitespace-nowrap">Due Date</span>
                      {sortBy === "dueDate" &&
                        (sortDirection === "asc" ? (
                          <FiChevronUp className="w-4 h-4" />
                        ) : (
                          <FiChevronDown className="w-4 h-4" />
                        ))}
                    </button>
                    <button
                      className={`px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer text-sm md:text-base font-medium flex items-center justify-center space-x-2 ${
                        sortBy === "priority"
                          ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                      onClick={() => handleSortChange("priority")}
                    >
                      <span className="whitespace-nowrap">Priority</span>
                      {sortBy === "priority" &&
                        (sortDirection === "asc" ? (
                          <FiChevronUp className="w-4 h-4" />
                        ) : (
                          <FiChevronDown className="w-4 h-4" />
                        ))}
                    </button>

                    {/* Reset Button */}
                    <button
                      onClick={handleResetFilters}
                      className="lg:ml-auto px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-xl transition-all duration-200 cursor-pointer text-sm md:text-base font-medium flex items-center justify-center space-x-2 group col-span-2 sm:col-span-1"
                    >
                      <FiX className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="whitespace-nowrap">Reset Filters</span>
                    </button>
                  </div>

                  {/* Results Count */}
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 font-medium">
                      Showing {filteredTasks().length} of {tasks.length} tasks
                      {(filterOption !== "all" || categoryFilter !== "all" || priorityFilter !== "all" || sortBy !== "createdAt" || sortDirection !== "desc") && (
                        <span className="ml-2 text-indigo-600">• Filters applied</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Task List */}
              <div className="bg-white rounded-2xl border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Your Tasks
                  </h3>
                </div>

                <div className="divide-y divide-gray-200">
                  {filteredTasks().length > 0 ? (
                    filteredTasks().map((task) => (
                      <div
                        key={task.id}
                        className={`p-6 transition-all duration-300 hover:bg-gray-50 group ${
                          isOverdue(task)
                            ? "bg-red-50 border-l-4 border-l-red-500 hover:bg-red-100"
                            : isDueSoon(task)
                            ? "bg-yellow-50 border-l-4 border-l-yellow-500 hover:bg-yellow-100"
                            : "hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="pt-1">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  className="sr-only"
                                  checked={task.completed}
                                  onChange={() => handleToggleComplete(task.id)}
                                />
                                <div
                                  onClick={() => handleToggleComplete(task.id)}
                                  className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                                    task.completed
                                      ? "bg-green-500 border-green-500 scale-110"
                                      : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50"
                                  }`}
                                >
                                  {task.completed && (
                                    <FiCheck className="w-4 h-4 text-white stroke-2" />
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div
                                className={`text-gray-900 font-semibold text-lg leading-tight mb-3 transition-all duration-200 ${
                                  task.completed
                                    ? "line-through text-gray-500"
                                    : "group-hover:text-indigo-700"
                                }`}
                              >
                                {task.text}
                              </div>

                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                {task.category && (
                                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                                    {task.category}
                                  </span>
                                )}

                                <span
                                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${
                                    task.priority === "high"
                                      ? "bg-red-100 text-red-800 border-red-200"
                                      : task.priority === "medium"
                                      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                      : "bg-green-100 text-green-800 border-green-200"
                                  }`}
                                >
                                  <FiFlag className="mr-1.5 w-3 h-3" />
                                  {task.priority}
                                </span>

                                {task.dueDate && (
                                  <span
                                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${
                                      isOverdue(task)
                                        ? "bg-red-100 text-red-800 border-red-200"
                                        : isDueSoon(task)
                                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                        : "bg-gray-100 text-gray-700 border-gray-200"
                                    }`}
                                  >
                                    <FiClock className="mr-1.5 w-3 h-3" />
                                    {formatDate(task.dueDate)}
                                    {isOverdue(task) && " (Overdue)"}
                                  </span>
                                )}
                              </div>

                              <div className="text-sm text-gray-500 mt-2">
                                Added {task.createdAt.toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              className="p-2.5 text-indigo-600 cursor-pointer hover:text-indigo-800 hover:bg-indigo-50 rounded-xl transition-all duration-200 hover:scale-105"
                              onClick={() => handleEditTask(task)}
                              aria-label="Edit task"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              className="p-2.5 text-red-600 cursor-pointer hover:text-red-800 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-105"
                              onClick={() => handleDeleteTask(task.id)}
                              aria-label="Delete task"
                            >
                              <FiTrash size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16">
                      <FiCheckCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No tasks found
                      </h3>
                      <p className="text-gray-500 mb-6">
                        {tasks.length > 0
                          ? "Try adjusting your filters to see more tasks"
                          : "Create your first task to get started"}
                      </p>
                      {tasks.length === 0 && (
                        <button
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center cursor-pointer"
                          onClick={() => setShowAddTaskInput(true)}
                        >
                          <FiPlus className="mr-2" /> Create Your First Task
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Analytics Section */
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Overview Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Tasks
                      </p>
                      <p className="text-2xl md:text-3xl font-bold text-gray-900">
                        {tasks.length}
                      </p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FiList className="text-indigo-600 text-lg md:text-xl" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Completed
                      </p>
                      <p className="text-2xl md:text-3xl font-bold text-green-600">
                        {completedCount}
                      </p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <FiCheckCircle className="text-green-600 text-lg md:text-xl" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Due Soon
                      </p>
                      <p className="text-2xl md:text-3xl font-bold text-yellow-600">
                        {dueSoonCount}
                      </p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <FiClock className="text-yellow-600 text-lg md:text-xl" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Overdue
                      </p>
                      <p className="text-2xl md:text-3xl font-bold text-red-600">
                        {overdueCount}
                      </p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <FiFlag className="text-red-600 text-lg md:text-xl" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Overview */}
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Overall Progress
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Completion Rate
                    </span>
                    <span className="text-sm font-bold text-indigo-600">
                      {progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-500 ease-in-out"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Category Statistics */}
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Statistics by Category
                </h3>
                <div className="space-y-4">
                  {categorySummary.map((cat) => (
                    <div key={cat.name} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">
                          {cat.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {cat.completed}/{cat.count} (
                          {cat.count > 0
                            ? Math.round((cat.completed / cat.count) * 100)
                            : 0}
                          %)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-in-out"
                          style={{
                            width: `${
                              cat.count > 0
                                ? (cat.completed / cat.count) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Custom CSS for hiding scrollbars */}
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");
        
        .scrollbar-hide {
          -ms-overflow-style: none;  /* Internet Explorer 10+ */
          scrollbar-width: none;  /* Firefox */
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;  /* Safari and Chrome */
        }
      `}</style>
    </div>
  );
}
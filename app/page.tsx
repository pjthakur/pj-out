"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Moon,
  Sun,
  CheckCircle2,
  Circle,
  Trash2,
  Calendar,
  TrendingUp,
  Sparkles,
  Target,
  Zap,
  Home,
  BarChart3,
  Settings,
  User,
  Github,
  Twitter,
  Mail,
  Menu,
  X,
  Bell,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority?: "low" | "medium" | "high";
}

interface UserProfile {
  name: string;
  email: string;
  bio: string;
}

interface AppSettings {
  darkMode: boolean;
  animations: boolean;
  taskReminders: boolean;
  emailUpdates: boolean;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

const TaskDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      text: "Complete project presentation",
      completed: false,
      createdAt: new Date(),
      priority: "high",
    },
    {
      id: "2",
      text: "Review team feedback",
      completed: true,
      createdAt: new Date(Date.now() - 86400000),
      priority: "medium",
    },
    {
      id: "3",
      text: "Update documentation",
      completed: false,
      createdAt: new Date(),
      priority: "low",
    },
  ]);

  const [newTask, setNewTask] = useState<string>("");
  const [animateStats, setAnimateStats] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<string>("dashboard");
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john.doe@taskflow.com",
    bio: "Productivity enthusiast and task management expert",
  });

  const [settings, setSettings] = useState<AppSettings>({
    darkMode: false,
    animations: true,
    taskReminders: true,
    emailUpdates: false,
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  const defaultSettings: AppSettings = {
    darkMode: false,
    animations: true,
    taskReminders: true,
    emailUpdates: false,
  };

  const defaultUserProfile: UserProfile = {
    name: "John Doe",
    email: "john.doe@taskflow.com",
    bio: "Productivity enthusiast and task management expert",
  };

  useEffect(() => {
    setAnimateStats(true);
  }, [tasks]);

  const addTask = (): void => {
    if (newTask.trim() !== "") {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date(),
        priority: "medium",
      };
      setTasks([...tasks, task]);
      setNewTask("");
    }
  };

  const toggleTask = (id: string): void => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string): void => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const handleNavigation = (page: string) => {
    setActivePage(page);
    setShowMobileMenu(false);
  };

  const handleSocialClick = (platform: string) => {
    const urls: { [key: string]: string } = {
      github: "https://github.com",
      twitter: "https://twitter.com",
      email: "mailto:contact@taskflow.com",
    };
    if (urls[platform]) {
      window.open(urls[platform], "_blank");
    }
  };

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const updateSetting = (key: keyof AppSettings, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    
    // Show toast for animation toggle
    if (key === "animations") {
      showToast(
        value ? "Animations enabled" : "Animations disabled - This functionality is not fully implemented yet",
        value ? "success" : "info"
      );
    }
  };

  const resetToDefault = () => {
    setSettings(defaultSettings);
    setUserProfile(defaultUserProfile);
    showToast("Settings reset to default values", "success");
  };

  const saveSettings = () => {
    // In a real app, this would save to a backend or localStorage
    showToast("Settings saved successfully", "success");
  };

  const completedTasks = tasks.filter((task) => task.completed);
  const pendingTasks = tasks.filter((task) => !task.completed);
  const completionRate =
    tasks.length > 0
      ? Math.round((completedTasks.length / tasks.length) * 100)
      : 0;

  const pieData = [
    { name: "Completed", value: completedTasks.length, color: "#10b981" },
    { name: "Pending", value: pendingTasks.length, color: "#3b82f6" },
  ];

  const priorityData = [
    {
      name: "High",
      value: tasks.filter((t) => t.priority === "high").length,
      color: "#3b82f6",
    },
    {
      name: "Medium",
      value: tasks.filter((t) => t.priority === "medium").length,
      color: "#06b6d4",
    },
    {
      name: "Low",
      value: tasks.filter((t) => t.priority === "low").length,
      color: "#10b981",
    },
  ];

  const progressData = [
    { name: "Mon", completed: 3, pending: 2 },
    { name: "Tue", completed: 5, pending: 1 },
    { name: "Wed", completed: 4, pending: 3 },
    { name: "Thu", completed: 6, pending: 1 },
    {
      name: "Fri",
      completed: completedTasks.length,
      pending: pendingTasks.length,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "from-blue-400 to-blue-500";
      case "medium":
        return "from-cyan-400 to-cyan-500";
      case "low":
        return "from-emerald-400 to-emerald-500";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  const AnalyticsView = () => (
    <div className="space-y-6">
      <div
        className={`p-8 rounded-3xl ${
          settings.darkMode ? "bg-white/10" : "bg-white/50"
        } backdrop-blur-lg border border-white/20 shadow-2xl`}
      >
        <h2
          className={`font-display text-display-lg mb-6 ${
            settings.darkMode ? "text-white" : "text-gray-900"
          } flex items-center gap-3 spacing-tight`}
        >
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          Analytics Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={`p-6 rounded-2xl ${
              settings.darkMode ? "bg-white/5" : "bg-white/40"
            } backdrop-blur-lg border border-white/20`}
          >
            <h3
              className={`font-heading text-subtitle mb-4 ${
                settings.darkMode ? "text-white" : "text-gray-900"
              } spacing-tight`}
            >
              Productivity Metrics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span
                  className={`font-body ${
                    settings.darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Daily Average:
                </span>
                <span
                  className={`font-bold ${
                    settings.darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {Math.round((completedTasks.length / 7) * 10) / 10} tasks
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={
                    settings.darkMode ? "text-gray-300" : "text-gray-600"
                  }
                >
                  Best Day:
                </span>
                <span
                  className={`font-bold ${
                    settings.darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Friday
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={
                    settings.darkMode ? "text-gray-300" : "text-gray-600"
                  }
                >
                  Total Completed:
                </span>
                <span
                  className={`font-bold ${
                    settings.darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {completedTasks.length + 24} tasks
                </span>
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-2xl ${
              settings.darkMode ? "bg-white/5" : "bg-white/40"
            } backdrop-blur-lg border border-white/20`}
          >
            <h3
              className={`font-heading text-subtitle mb-4 ${
                settings.darkMode ? "text-white" : "text-gray-900"
              } spacing-tight`}
            >
              Time Management
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span
                  className={
                    settings.darkMode ? "text-gray-300" : "text-gray-600"
                  }
                >
                  Avg. Task Time:
                </span>
                <span
                  className={`font-bold ${
                    settings.darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  2.5 hours
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={
                    settings.darkMode ? "text-gray-300" : "text-gray-600"
                  }
                >
                  Focus Time:
                </span>
                <span
                  className={`font-bold ${
                    settings.darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  6.2 hours/day
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={
                    settings.darkMode ? "text-gray-300" : "text-gray-600"
                  }
                >
                  Efficiency:
                </span>
                <span className="font-bold text-emerald-500">87%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ToggleSwitch = ({
    enabled,
    onChange,
  }: {
    enabled: boolean;
    onChange: () => void;
  }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
        enabled ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  const SettingsView = () => (
    <div className="space-y-6">
      <div
        className={`p-8 rounded-3xl ${
          settings.darkMode ? "bg-white/10" : "bg-white/50"
        } backdrop-blur-lg border border-white/20 shadow-2xl`}
      >
        <h2
          className={`font-display text-display-lg mb-6 ${
            settings.darkMode ? "text-white" : "text-gray-900"
          } flex items-center gap-3 spacing-tight`}
        >
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500">
            <Settings className="h-6 w-6 text-white" />
          </div>
          Settings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={`p-6 rounded-2xl ${
              settings.darkMode ? "bg-white/5" : "bg-white/40"
            } backdrop-blur-lg border border-white/20`}
          >
            <h3
              className={`font-heading text-subtitle mb-4 ${
                settings.darkMode ? "text-white" : "text-gray-900"
              } spacing-tight`}
            >
              Appearance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={
                    settings.darkMode ? "text-gray-300" : "text-gray-600"
                  }
                >
                  Dark Mode
                </span>
                <ToggleSwitch
                  enabled={settings.darkMode}
                  onChange={() => updateSetting("darkMode", !settings.darkMode)}
                />
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={
                    settings.darkMode ? "text-gray-300" : "text-gray-600"
                  }
                >
                  Animations
                </span>
                <ToggleSwitch
                  enabled={settings.animations}
                  onChange={() =>
                    updateSetting("animations", !settings.animations)
                  }
                />
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-2xl ${
              settings.darkMode ? "bg-white/5" : "bg-white/40"
            } backdrop-blur-lg border border-white/20`}
          >
            <h3
              className={`font-heading text-subtitle mb-4 ${
                settings.darkMode ? "text-white" : "text-gray-900"
              } spacing-tight`}
            >
              Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={
                    settings.darkMode ? "text-gray-300" : "text-gray-600"
                  }
                >
                  Task Reminders
                </span>
                <ToggleSwitch
                  enabled={settings.taskReminders}
                  onChange={() =>
                    updateSetting("taskReminders", !settings.taskReminders)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={
                    settings.darkMode ? "text-gray-300" : "text-gray-600"
                  }
                >
                  Email Updates
                </span>
                <ToggleSwitch
                  enabled={settings.emailUpdates}
                  onChange={() =>
                    updateSetting("emailUpdates", !settings.emailUpdates)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={saveSettings}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 font-semibold cursor-pointer">
            Save Changes
          </button>
          <button
            onClick={resetToDefault}
            className={`px-6 py-3 rounded-xl border-2 transition-all duration-300 font-semibold cursor-pointer ${
              settings.darkMode
                ? "border-white/20 text-white hover:bg-white/10"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );

  const MobileMenu = () =>
    showMobileMenu && (
      <div className="fixed inset-0 z-50 md:hidden">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
          onClick={() => setShowMobileMenu(false)}
        />
        <div
          className={`absolute top-0 left-0 h-full w-80 max-w-sm ${
            settings.darkMode ? "bg-gray-900/95" : "bg-white/95"
          } backdrop-blur-lg border-r border-white/20 shadow-2xl transform transition-transform duration-300 ease-out`}
          style={{ animation: "slideInLeft 0.3s ease-out" }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    settings.darkMode ? "bg-white/10" : "bg-white/40"
                  } backdrop-blur-lg border border-white/20`}
                >
                  <Calendar
                    className={`h-5 w-5 ${
                      settings.darkMode ? "text-cyan-400" : "text-blue-600"
                    }`}
                  />
                </div>
                <h2
                  className={`font-display text-subtitle bg-gradient-to-r ${
                    settings.darkMode
                      ? "from-white via-blue-200 to-cyan-200"
                      : "from-gray-900 via-blue-700 to-emerald-700"
                  } bg-clip-text text-transparent spacing-tight`}
                >
                  TaskFlow
                </h2>
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                className={`p-2 rounded-lg cursor-pointer ${
                  settings.darkMode
                    ? "bg-white/10 hover:bg-white/20"
                    : "bg-white/40 hover:bg-white/60"
                } backdrop-blur-lg border border-white/20 transition-all duration-300`}
              >
                <X
                  className={`h-5 w-5 ${
                    settings.darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                />
              </button>
            </div>

            <nav className="space-y-2">
              {[
                { icon: Home, label: "Dashboard", page: "dashboard" },
                { icon: BarChart3, label: "Analytics", page: "analytics" },
                { icon: Settings, label: "Settings", page: "settings" },
                { icon: Target, label: "Help", page: "help" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.page)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-subheading cursor-pointer ${
                    activePage === item.page
                      ? settings.darkMode
                        ? "bg-white/20 text-white border border-white/30"
                        : "bg-white/60 text-blue-700 border border-white/40"
                      : settings.darkMode
                      ? "text-gray-300 hover:bg-white/10 hover:text-white"
                      : "text-gray-600 hover:bg-white/40 hover:text-blue-700"
                  } backdrop-blur-lg font-medium ${settings.animations ? "hover:scale-105" : ""}`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-white/20">
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  setShowUserModal(true);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-subheading cursor-pointer ${
                  settings.darkMode
                    ? "text-gray-300 hover:bg-white/10 hover:text-white"
                    : "text-gray-600 hover:bg-white/40 hover:text-blue-700"
                } backdrop-blur-lg font-medium`}
              >
                <User className="h-5 w-5" />
                Profile
              </button>

              <button
                onClick={() => updateSetting("darkMode", !settings.darkMode)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-subheading cursor-pointer ${
                  settings.darkMode
                    ? "text-gray-300 hover:bg-white/10 hover:text-white"
                    : "text-gray-600 hover:bg-white/40 hover:text-blue-700"
                } backdrop-blur-lg font-medium`}
              >
                {settings.darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                {settings.darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  const UserModal = () =>
    showUserModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
          onClick={() => setShowUserModal(false)}
        />
        <div
          className={`relative p-8 rounded-3xl ${
            settings.darkMode ? "bg-gray-900/90" : "bg-white/90"
          } backdrop-blur-lg border border-white/20 shadow-2xl max-w-md w-full mx-4`}
        >
          <h3
            className={`font-display text-title-lg mb-6 ${
              settings.darkMode ? "text-white" : "text-gray-900"
            } spacing-tight`}
          >
            User Profile
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h4
                  className={`font-heading text-body-lg font-semibold ${
                    settings.darkMode ? "text-white" : "text-gray-900"
                  } spacing-tight`}
                >
                  {userProfile.name}
                </h4>
                <p
                  className={`font-body text-body-sm ${
                    settings.darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {userProfile.email}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/20">
              <p
                className={`text-sm mb-4 ${
                  settings.darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {userProfile.bio}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span
                    className={
                      settings.darkMode ? "text-gray-300" : "text-gray-600"
                    }
                  >
                    Tasks Completed:
                  </span>
                  <span
                    className={`font-semibold ${
                      settings.darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {completedTasks.length + 47}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={
                      settings.darkMode ? "text-gray-300" : "text-gray-600"
                    }
                  >
                    Member Since:
                  </span>
                  <span
                    className={`font-semibold ${
                      settings.darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Jan 2024
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={
                      settings.darkMode ? "text-gray-300" : "text-gray-600"
                    }
                  >
                    Productivity Score:
                  </span>
                  <span className="font-semibold text-emerald-500">92%</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setShowEditProfile(true);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 font-semibold cursor-pointer"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setShowUserModal(false)}
                className={`px-4 py-2 rounded-xl border-2 transition-all duration-300 font-semibold cursor-pointer ${
                  settings.darkMode
                    ? "border-white/20 text-white hover:bg-white/10"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  const EditProfileModal = () => {
    const [editedProfile, setEditedProfile] =
      useState<UserProfile>(userProfile);

    const handleSave = () => {
      setUserProfile(editedProfile);
      setShowEditProfile(false);
    };

    const handleCancel = () => {
      setEditedProfile(userProfile);
      setShowEditProfile(false);
    };

    useEffect(() => {
      setEditedProfile(userProfile);
    }, [userProfile]);

    return showEditProfile ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
          onClick={handleCancel}
        />
        <div
          className={`relative p-8 rounded-3xl ${
            settings.darkMode ? "bg-gray-900/90" : "bg-white/90"
          } backdrop-blur-lg border border-white/20 shadow-2xl max-w-md w-full mx-4`}
        >
          <h3
            className={`font-display text-title-lg mb-6 ${
              settings.darkMode ? "text-white" : "text-gray-900"
            } spacing-tight`}
          >
            Edit Profile
          </h3>

          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  settings.darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Full Name
              </label>
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, name: e.target.value })
                }
                className={`font-body flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 cursor-text ${
                  settings.darkMode
                    ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                    : "bg-white/60 border-white/40 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                } backdrop-blur-lg text-body ${settings.animations ? "hover:scale-[1.02] focus:scale-[1.02]" : ""}`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  settings.darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email Address
              </label>
              <input
                type="email"
                value={editedProfile.email}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, email: e.target.value })
                }
                className={`font-body flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 cursor-text ${
                  settings.darkMode
                    ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                    : "bg-white/60 border-white/40 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                } backdrop-blur-lg text-body ${settings.animations ? "hover:scale-[1.02] focus:scale-[1.02]" : ""}`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  settings.darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Bio
              </label>
              <textarea
                value={editedProfile.bio}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, bio: e.target.value })
                }
                rows={3}
                className={`font-body flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 cursor-text ${
                  settings.darkMode
                    ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                    : "bg-white/60 border-white/40 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                } backdrop-blur-lg text-body ${settings.animations ? "hover:scale-[1.02] focus:scale-[1.02]" : ""}`}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 font-semibold cursor-pointer"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 font-semibold cursor-pointer ${
                  settings.darkMode
                    ? "border-white/20 text-white hover:bg-white/10"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    ) : null;
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-lg border transition-all duration-300 transform ${
            toast.type === "success"
              ? "bg-emerald-500/90 border-emerald-400/50 text-white"
              : toast.type === "error"
              ? "bg-red-500/90 border-red-400/50 text-white"
              : "bg-blue-500/90 border-blue-400/50 text-white"
          } ${settings.animations ? "animate-slide-in" : ""}`}
        >
          <div className="flex-shrink-0">
            {toast.type === "success" && <CheckCircle2 className="h-5 w-5" />}
            {toast.type === "error" && <X className="h-5 w-5" />}
            {toast.type === "info" && <Bell className="h-5 w-5" />}
          </div>
          <span className="font-medium text-sm">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={`min-h-screen transition-all duration-700 relative overflow-hidden ${
        settings.darkMode
          ? "bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-1/2 -left-1/2 w-full h-full rounded-full ${
            settings.darkMode
              ? "bg-gradient-to-r from-blue-600/10 to-cyan-600/10"
              : "bg-gradient-to-r from-blue-200/20 to-cyan-200/20"
          } animate-pulse`}
          style={{
            animation: "float 20s ease-in-out infinite",
          }}
        ></div>
        <div
          className={`absolute -bottom-1/2 -right-1/2 w-3/4 h-3/4 rounded-full ${
            settings.darkMode
              ? "bg-gradient-to-r from-cyan-600/10 to-emerald-600/10"
              : "bg-gradient-to-r from-cyan-200/20 to-emerald-200/20"
          }`}
          style={{
            animation: "float 15s ease-in-out infinite reverse",
          }}
        ></div>
      </div>

      <div
        className={`absolute inset-0 ${
          settings.darkMode ? "bg-black/20" : "bg-white/30"
        } backdrop-blur-sm`}
      ></div>

      <header className="relative z-10 border-b border-white/20">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-xl ${
                    settings.darkMode ? "bg-white/10" : "bg-white/40"
                  } backdrop-blur-lg border border-white/20 shadow-lg`}
                >
                  <Calendar
                    className={`h-6 w-6 ${
                      settings.darkMode ? "text-cyan-400" : "text-blue-600"
                    }`}
                  />
                </div>
                <h1
                  className={`font-display text-title-lg bg-gradient-to-r ${
                    settings.darkMode
                      ? "from-white via-blue-200 to-cyan-200"
                      : "from-gray-900 via-blue-700 to-emerald-700"
                  } bg-clip-text text-transparent spacing-tight hover:animate-pulse transition-all duration-300 cursor-pointer`}
                >
                  TaskFlow
                </h1>
              </div>

              <nav className="hidden md:flex items-center gap-6">
                {[
                  { icon: Home, label: "Dashboard", page: "dashboard" },
                  { icon: BarChart3, label: "Analytics", page: "analytics" },
                  { icon: Settings, label: "Settings", page: "settings" },
                  { icon: Target, label: "Help", page: "help" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item.page)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-subheading cursor-pointer ${
                      activePage === item.page
                        ? settings.darkMode
                          ? "bg-white/20 text-white border border-white/30"
                          : "bg-white/60 text-blue-700 border border-white/40"
                        : settings.darkMode
                        ? "text-gray-300 hover:bg-white/10 hover:text-white"
                        : "text-gray-600 hover:bg-white/40 hover:text-blue-700"
                    } backdrop-blur-lg font-medium ${settings.animations ? "hover:scale-105" : ""}`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowMobileMenu(true)}
                className={`md:hidden p-3 rounded-xl cursor-pointer ${
                  settings.darkMode
                    ? "bg-white/10 hover:bg-white/20"
                    : "bg-white/40 hover:bg-white/60"
                } backdrop-blur-lg border border-white/20 transition-all duration-300 ${settings.animations ? "hover:scale-110" : ""}`}
              >
                <Menu
                  className={`h-5 w-5 ${
                    settings.darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                />
              </button>

              <button
                onClick={() => setShowUserModal(true)}
                className={`p-3 rounded-xl cursor-pointer ${
                  settings.darkMode
                    ? "bg-white/10 hover:bg-white/20"
                    : "bg-white/40 hover:bg-white/60"
                } backdrop-blur-lg border border-white/20 transition-all duration-300 ${settings.animations ? "hover:scale-110" : ""}`}
              >
                <User
                  className={`h-5 w-5 ${
                    settings.darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                />
              </button>

              <button
                onClick={() => updateSetting("darkMode", !settings.darkMode)}
                className={`p-3 rounded-xl cursor-pointer ${
                  settings.darkMode ? "bg-white/10" : "bg-white/40"
                } backdrop-blur-lg border border-white/20 shadow-lg ${settings.animations ? "hover:scale-110" : ""} transition-all duration-300 group overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  {settings.darkMode ? (
                    <Sun className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <Moon className="h-5 w-5 text-blue-600" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-8">
          <div className="text-center">
            <p
              className={`font-body text-body-lg ${
                settings.darkMode ? "text-gray-300" : "text-gray-600"
              } flex items-center justify-center gap-2`}
            >
              <Zap className="h-5 w-5 text-emerald-500" />
              {activePage === "dashboard" &&
                "Welcome to your productivity dashboard"}
              {activePage === "analytics" &&
                "Deep insights into your productivity"}
              {activePage === "settings" &&
                "Customize your TaskFlow experience"}
              {activePage === "help" && "Get help and support"}
            </p>
          </div>
        </div>

        {activePage === "dashboard" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {[
                {
                  label: "Total Tasks",
                  value: tasks.length,
                  icon: Target,
                  gradient: "from-blue-500 to-cyan-500",
                  bg: "from-blue-500/20 to-cyan-500/20",
                },
                {
                  label: "Completed",
                  value: completedTasks.length,
                  icon: CheckCircle2,
                  gradient: "from-emerald-500 to-green-500",
                  bg: "from-emerald-500/20 to-green-500/20",
                },
                {
                  label: "Progress",
                  value: `${completionRate}%`,
                  icon: TrendingUp,
                  gradient: "from-cyan-500 to-blue-500",
                  bg: "from-cyan-500/20 to-blue-500/20",
                },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className={`relative p-6 rounded-3xl ${
                    settings.darkMode ? "bg-white/10" : "bg-white/50"
                  } backdrop-blur-lg border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 group overflow-hidden`}
                  style={{
                    animation: animateStats && settings.animations
                      ? `slideInUp 0.8s ease-out ${index * 0.2}s both`
                      : "",
                  }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  ></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p
                        className={`font-subheading text-caption font-semibold ${
                          settings.darkMode ? "text-gray-300" : "text-gray-600"
                        } mb-2 tracking-wide uppercase spacing-wider`}
                      >
                        {stat.label}
                      </p>
                      <p
                        className={`font-stats text-display ${
                          settings.darkMode ? "text-white" : "text-gray-900"
                        } transition-all duration-300 ${settings.animations ? "group-hover:scale-110" : ""} spacing-tight hover:text-shimmer`}
                      >
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg ${settings.animations ? "group-hover:rotate-12" : ""} transition-transform duration-300`}
                    >
                      <stat.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full"></div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-6">
                <div
                  className={`relative p-4 sm:p-8 rounded-3xl ${
                    settings.darkMode ? "bg-white/10" : "bg-white/50"
                  } backdrop-blur-lg border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <h2
                      className={`font-heading text-title mb-6 ${
                        settings.darkMode ? "text-white" : "text-gray-900"
                      } flex items-center gap-3 spacing-tight`}
                    >
                      <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500">
                        <Plus className="h-5 w-5 text-white" />
                      </div>
                      Create New Task
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="What needs to be done?"
                        className={`font-body flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 cursor-text ${
                          settings.darkMode
                            ? "bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                            : "bg-white/60 border-white/40 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                        } backdrop-blur-lg text-body ${settings.animations ? "hover:scale-[1.02] focus:scale-[1.02]" : ""}`}
                      />
                      <button
                        onClick={addTask}
                        className={`font-subheading px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 text-white rounded-2xl hover:from-blue-600 hover:via-cyan-600 hover:to-emerald-600 transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center justify-center gap-3 font-bold text-body cursor-pointer ${settings.animations ? "hover:scale-110 active:scale-95" : ""} min-w-fit`}
                      >
                        <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
                        <span className="hidden sm:inline">Add</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  className={`relative p-4 sm:p-8 rounded-3xl ${
                    settings.darkMode ? "bg-white/10" : "bg-white/50"
                  } backdrop-blur-lg border border-white/20 shadow-2xl overflow-hidden`}
                >
                  <h2
                    className={`font-heading text-title mb-6 ${
                      settings.darkMode ? "text-white" : "text-gray-900"
                    } flex items-center gap-3 spacing-tight`}
                  >
                    <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    Your Tasks ({tasks.length})
                  </h2>
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {tasks.length === 0 ? (
                      <div
                        className={`text-center py-12 ${
                          settings.darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <Circle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="font-body text-subtitle">No tasks yet!</p>
                        <p className="font-body text-body">
                          Add your first task above to get started
                        </p>
                      </div>
                    ) : (
                      tasks.map((task, index) => (
                        <div
                          key={task.id}
                          className={`group relative p-5 rounded-2xl border-2 transition-all duration-500 hover:shadow-xl ${
                            task.completed
                              ? settings.darkMode
                                ? "bg-emerald-500/10 border-emerald-500/30 backdrop-blur-lg"
                                : "bg-emerald-50/80 border-emerald-200/60 backdrop-blur-lg"
                              : settings.darkMode
                              ? "bg-white/5 border-white/20 hover:bg-white/10 backdrop-blur-lg"
                              : "bg-white/40 border-white/30 hover:bg-white/60 backdrop-blur-lg"
                          }`}
                          style={{
                            animation: settings.animations ? `slideInLeft 0.6s ease-out ${
                              index * 0.1
                            }s both` : "",
                          }}
                        >
                          <div
                            className={`absolute top-1 right-1 w-3 h-3 rounded-full bg-gradient-to-r ${getPriorityColor(
                              task.priority || "medium"
                            )} opacity-70`}
                          ></div>

                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => toggleTask(task.id)}
                              className={`transition-all duration-300 ${settings.animations ? "hover:scale-125" : ""} cursor-pointer ${
                                task.completed
                                  ? `text-emerald-500 ${settings.animations ? "animate-pulse" : ""}`
                                  : settings.darkMode
                                  ? "text-gray-400 hover:text-emerald-400"
                                  : "text-gray-400 hover:text-emerald-500"
                              }`}
                            >
                              {task.completed ? (
                                <CheckCircle2 className="h-7 w-7" />
                              ) : (
                                <Circle className="h-7 w-7" />
                              )}
                            </button>

                            <span
                              className={`flex-1 font-body text-body ${
                                task.completed
                                  ? `line-through ${
                                      settings.darkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }`
                                  : settings.darkMode
                                  ? "text-white"
                                  : "text-gray-900"
                              } transition-all duration-300`}
                            >
                              {task.text}
                            </span>

                            <button
                              onClick={() => deleteTask(task.id)}
                              className={`opacity-0 group-hover:opacity-100 transition-all duration-300 ${settings.animations ? "hover:scale-125" : ""} p-2 rounded-xl cursor-pointer ${
                                settings.darkMode
                                  ? "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                                  : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                              }`}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div
                  className={`relative p-6 rounded-3xl ${
                    settings.darkMode ? "bg-white/10" : "bg-white/50"
                  } backdrop-blur-lg border border-white/20 shadow-2xl overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <h3
                    className={`font-heading text-subtitle mb-4 ${
                      settings.darkMode ? "text-white" : "text-gray-900"
                    } relative z-10 spacing-tight`}
                  >
                    Task Distribution
                  </h3>
                  {tasks.length > 0 ? (
                    <div className="relative z-10">
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: settings.darkMode
                                ? "rgba(0,0,0,0.8)"
                                : "rgba(255,255,255,0.8)",
                              border: "none",
                              borderRadius: "12px",
                              backdropFilter: "blur(10px)",
                              color: settings.darkMode ? "#ffffff" : "#000000",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div
                      className={`h-48 flex items-center justify-center ${
                        settings.darkMode ? "text-gray-400" : "text-gray-500"
                      } relative z-10`}
                    >
                      <div className="text-center">
                        <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Add tasks to see distribution</p>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`relative p-6 rounded-3xl ${
                    settings.darkMode ? "bg-white/10" : "bg-white/50"
                  } backdrop-blur-lg border border-white/20 shadow-2xl overflow-hidden`}
                >
                  <h3
                    className={`font-heading text-subtitle mb-4 ${
                      settings.darkMode ? "text-white" : "text-gray-900"
                    } spacing-tight`}
                  >
                    Weekly Progress
                  </h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis
                        dataKey="name"
                        tick={{
                          fill: settings.darkMode ? "#9CA3AF" : "#6B7280",
                          fontSize: 12,
                        }}
                      />
                      <YAxis
                        tick={{
                          fill: settings.darkMode ? "#9CA3AF" : "#6B7280",
                          fontSize: 12,
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: settings.darkMode
                            ? "rgba(0,0,0,0.8)"
                            : "rgba(255,255,255,0.8)",
                          border: "none",
                          borderRadius: "12px",
                          backdropFilter: "blur(10px)",
                          color: settings.darkMode ? "#ffffff" : "#000000",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="completed"
                        stackId="1"
                        stroke="#10b981"
                        fill="url(#completedGradient)"
                      />
                      <Area
                        type="monotone"
                        dataKey="pending"
                        stackId="1"
                        stroke="#3b82f6"
                        fill="url(#pendingGradient)"
                      />
                      <defs>
                        <linearGradient
                          id="completedGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#10b981"
                            stopOpacity={0.6}
                          />
                          <stop
                            offset="100%"
                            stopColor="#10b981"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="pendingGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#3b82f6"
                            stopOpacity={0.6}
                          />
                          <stop
                            offset="100%"
                            stopColor="#3b82f6"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        {activePage === "analytics" && <AnalyticsView />}
        {activePage === "settings" && <SettingsView />}

        {activePage === "help" && (
          <div
            className={`p-8 rounded-3xl ${
              settings.darkMode ? "bg-white/10" : "bg-white/50"
            } backdrop-blur-lg border border-white/20 shadow-2xl`}
          >
            <h2
              className={`font-display text-display-lg mb-6 ${
                settings.darkMode ? "text-white" : "text-gray-900"
              } flex items-center gap-3 spacing-tight`}
            >
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500">
                <Target className="h-6 w-6 text-white" />
              </div>
              Help & Support
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className={`p-6 rounded-2xl ${
                  settings.darkMode ? "bg-white/5" : "bg-white/40"
                } backdrop-blur-lg border border-white/20`}
              >
                <h3
                  className={`font-heading text-subtitle mb-4 ${
                    settings.darkMode ? "text-white" : "text-gray-900"
                  } spacing-tight`}
                >
                  Quick Start Guide
                </h3>
                <ul className="space-y-2">
                  <li
                    className={`flex items-center gap-2 ${
                      settings.darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Add your first task using the input field
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      settings.darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Mark tasks as complete by clicking the circle
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      settings.darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    View your progress in the Analytics section
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      settings.darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Customize your experience in Settings
                  </li>
                </ul>
              </div>

              <div
                className={`p-6 rounded-2xl ${
                  settings.darkMode ? "bg-white/5" : "bg-white/40"
                } backdrop-blur-lg border border-white/20`}
              >
                <h3
                  className={`font-heading text-subtitle mb-4 ${
                    settings.darkMode ? "text-white" : "text-gray-900"
                  } spacing-tight`}
                >
                  Need More Help?
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleSocialClick("email")}
                    className="w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 cursor-pointer"
                  >
                    📧 Contact Support
                  </button>
                  <button
                    onClick={() => handleSocialClick("github")}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
                      settings.darkMode
                        ? "bg-white/10 text-white hover:bg-white/20"
                        : "bg-white/60 text-gray-900 hover:bg-white/80"
                    }`}
                  >
                    📚 Documentation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <MobileMenu />
        <UserModal />
        <EditProfileModal />
        <ToastContainer />
      </div>

      <footer className="relative z-10 border-t border-white/20">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    settings.darkMode ? "bg-white/10" : "bg-white/40"
                  } backdrop-blur-lg border border-white/20`}
                >
                  <Calendar
                    className={`h-5 w-5 ${
                      settings.darkMode ? "text-cyan-400" : "text-blue-600"
                    }`}
                  />
                </div>
                <h3
                  className={`font-display text-subtitle bg-gradient-to-r ${
                    settings.darkMode
                      ? "from-white via-blue-200 to-cyan-200"
                      : "from-gray-900 via-blue-700 to-emerald-700"
                  } bg-clip-text text-transparent spacing-tight`}
                >
                  TaskFlow
                </h3>
              </div>
              <p
                className={`font-body text-body-sm ${
                  settings.darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Supercharge your productivity with our intuitive task management
                platform.
              </p>
            </div>

            <div className="space-y-4">
              <h4
                className={`font-heading font-semibold ${
                  settings.darkMode ? "text-white" : "text-gray-900"
                } spacing-tight`}
              >
                Quick Links
              </h4>
              <ul className="space-y-2">
                {[
                  { label: "Dashboard", page: "dashboard" },
                  { label: "Analytics", page: "analytics" },
                  { label: "Settings", page: "settings" },
                  { label: "Help", page: "help" },
                ].map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleNavigation(link.page)}
                      className={`text-sm transition-colors cursor-pointer ${
                        settings.darkMode
                          ? "text-gray-400 hover:text-cyan-400"
                          : "text-gray-600 hover:text-blue-600"
                      }`}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4
                className={`font-heading font-semibold ${
                  settings.darkMode ? "text-white" : "text-gray-900"
                } spacing-tight`}
              >
                Connect
              </h4>
              <div className="flex gap-3">
                {[
                  { icon: Github, label: "GitHub", platform: "github" },
                  { icon: Twitter, label: "Twitter", platform: "twitter" },
                  { icon: Mail, label: "Email", platform: "email" },
                ].map((social) => (
                  <button
                    key={social.label}
                    onClick={() => handleSocialClick(social.platform)}
                    className={`p-2 rounded-lg cursor-pointer ${
                      settings.darkMode
                        ? "bg-white/10 hover:bg-white/20"
                        : "bg-white/40 hover:bg-white/60"
                    } backdrop-blur-lg border border-white/20 transition-all duration-300 hover:scale-110 group`}
                  >
                    <social.icon
                      className={`h-4 w-4 ${
                        settings.darkMode
                          ? "text-gray-400 group-hover:text-white"
                          : "text-gray-600 group-hover:text-blue-600"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`mt-8 pt-6 border-t border-white/10 text-center font-body text-body-sm ${
              settings.darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <p>
              &copy; 2025 TaskFlow. All rights reserved. Built with ❤️ for
              productivity.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap");

        * {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            "Roboto", "Helvetica Neue", Arial, sans-serif;
        }

        .font-display {
          font-family: "Playfair Display", serif;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .font-heading {
          font-family: "Poppins", sans-serif;
          font-weight: 600;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }

        .font-subheading {
          font-family: "Space Grotesk", sans-serif;
          font-weight: 500;
          letter-spacing: -0.005em;
          line-height: 1.4;
        }

        .font-body {
          font-family: "Inter", sans-serif;
          font-weight: 400;
          letter-spacing: 0;
          line-height: 1.6;
        }

        .font-mono {
          font-family: "JetBrains Mono", monospace;
          font-weight: 400;
          letter-spacing: 0.01em;
        }

        .text-display-xl {
          font-size: 4.5rem;
          line-height: 1.1;
          letter-spacing: -0.04em;
        }
        .text-display-lg {
          font-size: 3.75rem;
          line-height: 1.1;
          letter-spacing: -0.03em;
        }
        .text-display {
          font-size: 3rem;
          line-height: 1.15;
          letter-spacing: -0.025em;
        }
        .text-title-xl {
          font-size: 2.25rem;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }
        .text-title-lg {
          font-size: 1.875rem;
          line-height: 1.25;
          letter-spacing: -0.015em;
        }
        .text-title {
          font-size: 1.5rem;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }
        .text-subtitle {
          font-size: 1.25rem;
          line-height: 1.35;
          letter-spacing: -0.005em;
        }
        .text-body-lg {
          font-size: 1.125rem;
          line-height: 1.6;
        }
        .text-body {
          font-size: 1rem;
          line-height: 1.6;
        }
        .text-body-sm {
          font-size: 0.875rem;
          line-height: 1.5;
        }
        .text-caption {
          font-size: 0.75rem;
          line-height: 1.4;
          letter-spacing: 0.02em;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes animate-slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: animate-slide-in 0.3s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #3b82f6, #10b981);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #2563eb, #059669);
        }

        .font-stats {
          font-family: "Space Grotesk", sans-serif;
          font-weight: 800;
          font-feature-settings: "tnum" 1;
          letter-spacing: -0.03em;
        }

        .text-shimmer {
          background: linear-gradient(
            90deg,
            #ff6b6b,
            #4ecdc4,
            #45b7d1,
            #96ceb4,
            #feca57
          );
          background-size: 400% 400%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .spacing-tight {
          letter-spacing: -0.05em;
        }
        .spacing-wider {
          letter-spacing: 0.1em;
        }
      `}</style>
    </div>
  );
};

export default TaskDashboard;
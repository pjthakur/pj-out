"use client";
import { useState, useEffect, useRef } from "react";
import {
  FiEye,
  FiEyeOff,
  FiX,
  FiUser,
  FiShield,
  FiSettings,
  FiSave,
  FiChevronDown,
  FiCheck,
  FiMenu,
  FiAlertCircle,
  FiCheckCircle,
  FiPlay,
  FiArrowRight,
  FiZap,
  FiSmartphone,
  FiLock,
} from "react-icons/fi";
import zxcvbn from "zxcvbn";

interface SuccessToastProps {
  message: string;
  onClose: () => void;
}
interface ErrorToastProps {
  message: string;
  onClose: () => void;
}
function SuccessToast({ message, onClose }: SuccessToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed top-4 right-4 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl bg-white/95 backdrop-blur-sm border border-green-200/50 z-50 animate-slideInFromTop max-w-md">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-emerald-600 rounded-l-2xl"></div>
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
        <FiCheckCircle className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 leading-relaxed">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 group cursor-pointer"
      >
        <FiX className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
      </button>
    </div>
  );
}
function ErrorToast({ message, onClose }: ErrorToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed top-4 right-4 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl bg-white/95 backdrop-blur-sm border border-red-200/50 z-50 animate-slideInFromTop max-w-md">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-400 to-rose-600 rounded-l-2xl"></div>
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-400 to-rose-600 rounded-xl flex items-center justify-center">
        <FiAlertCircle className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 leading-relaxed">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 group cursor-pointer"
      >
        <FiX className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
      </button>
    </div>
  );
}
interface FormData {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
    avatar: string;
  };
  security: {
    newPassword: string;
    confirmPassword: string;
    twoFactorAuth: boolean;
    loginAlerts: boolean;
    sessionTimeout: boolean;
    passwordChangeEnabled: boolean;
  };
  preferences: {
    timezone: string;
    language: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    notificationFrequency: string;
  };
}
interface ErrorState {
  [key: string]: string;
}
interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
}
function CustomDropdown({ value, onChange, options, placeholder, error }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const selectedOption = options.find((opt) => opt.value === value);
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 text-left bg-white/70 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md ${
          error
            ? "border-red-400 bg-red-50/80 focus:border-red-500 focus:ring-red-500/20"
            : isOpen
            ? "border-purple-500 ring-4 ring-purple-500/20"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <span className={`font-medium ${selectedOption ? "text-slate-800" : "text-slate-400"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center gap-2">
          <FiChevronDown
            className={`w-5 h-5 text-slate-400 transition-all duration-300 ${
              isOpen ? "transform rotate-180 text-purple-500" : ""
            }`}
          />
        </div>
      </button>
      {isOpen && (
        <div
          className={`absolute z-50 w-full mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto custom-dropdown-scroll ${
            dropdownRef.current && dropdownRef.current.getBoundingClientRect().bottom + 200 > window.innerHeight
              ? "bottom-full mb-2 mt-0"
              : ""
          }`}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2.5 text-left transition-all duration-200 flex items-center justify-between cursor-pointer first:rounded-t-xl last:rounded-b-xl text-sm ${
                value === option.value
                  ? "text-purple-700 bg-purple-50 font-medium border-l-4 border-l-purple-500"
                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span>{option.label}</span>
              {value === option.value && <FiCheck className="w-4 h-4 text-purple-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
function LandingPage({ onStartDemo, isLoading }: { onStartDemo: () => void; isLoading: boolean }) {
  return (
    <div
      className="space-grotesk min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        .space-grotesk {
          font-family: 'Space Grotesk', sans-serif;
        }
      `}</style>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-500/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400/10 rounded-full blur-2xl animate-pulse [animation-delay:0.5s]"></div>
      </div>
      <nav className="relative z-10 p-6 bg-slate-800/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-slate-600 rounded-xl flex items-center justify-center">
              <FiSettings className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Account Settings Pro</span>
          </div>
        </div>
      </nav>
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-gray-300 font-medium">
              Professional Account Management
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">Beautiful</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-slate-400 bg-clip-text text-transparent">
              Account Settings
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Experience premium form design with glassmorphism effects, smooth animations, and modern interactions. Built
            with Tailwind CSS and React.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onStartDemo}
              disabled={isLoading}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 via-purple-600 to-slate-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-purple-500/30 hover:scale-105 hover:from-purple-400 hover:via-purple-500 hover:to-slate-500 transition-all duration-300 overflow-hidden disabled:opacity-80 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-700 -translate-x-full"></div>
                  <div className="relative flex items-center gap-2">
                    <FiPlay className="w-5 h-5" />
                    <span>Get Started</span>
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </>
              )}
            </button>
          </div>
        </div>
        <section id="features" className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="group bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl hover:bg-white/15 hover:border-white/30 hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-slate-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FiEye className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Glassmorphism Design</h3>
            </div>
            <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300">
              Modern transparent effects with backdrop blur, creating depth and visual hierarchy.
            </p>
          </div>
          <div className="group bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl hover:bg-white/15 hover:border-white/30 hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-slate-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FiZap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Smooth Animations</h3>
            </div>
            <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300">
              Micro-interactions and transitions that delight users and provide clear feedback.
            </p>
          </div>
          <div className="group bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl hover:bg-white/15 hover:border-white/30 hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-slate-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FiSmartphone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Fully Responsive</h3>
            </div>
            <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300">
              Optimized for all devices with mobile-first design and touch-friendly interactions.
            </p>
          </div>
        </section>
      </main>
      <footer className="relative z-10 text-center py-6 text-gray-400 bg-slate-800/30 backdrop-blur-md border-t border-white/10">
        <p>2025 Account Settings Pro. Built with modern web technologies.</p>
      </footer>
    </div>
  );
}
export default function AccountSettings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);
  const lastErrorTime = useRef<number>(0);
  const [showLanding, setShowLanding] = useState(true);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const initialState: FormData = {
    profile: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      bio: "Software developer passionate about creating great user experiences.",
      avatar: "",
    },
    security: {
      newPassword: "",
      confirmPassword: "",
      twoFactorAuth: false,
      loginAlerts: true,
      sessionTimeout: true,
      passwordChangeEnabled: false,
    },
    preferences: {
      timezone: "America/New_York",
      language: "en",
      emailNotifications: true,
      pushNotifications: false,
      notificationFrequency: "daily",
    },
  };
  const [formData, setFormData] = useState<FormData>(initialState);
  const [savedState, setSavedState] = useState<FormData>(initialState);
  const [sectionSavedState, setSectionSavedState] = useState<FormData>(initialState);
  const [errors, setErrors] = useState<ErrorState>({});
  const validateForm = (data: FormData) => {
    const newErrors: ErrorState = {};
    if (!data.profile.firstName.trim()) {
      newErrors["profile.firstName"] = "First name is required";
    }
    if (!data.profile.lastName.trim()) {
      newErrors["profile.lastName"] = "Last name is required";
    }
    if (!data.profile.email.trim()) {
      newErrors["profile.email"] = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.profile.email)) {
      newErrors["profile.email"] = "Email is invalid";
    }
    if (data.profile.bio && data.profile.bio.length > 500) {
      newErrors["profile.bio"] = "Bio must be less than 500 characters";
    }
    if (data.security.passwordChangeEnabled) {
    if (!data.security.newPassword) {
      newErrors["security.newPassword"] = "Password is required";
    } else if (data.security.newPassword.length < 8) {
      newErrors["security.newPassword"] = "Password must be at least 8 characters";
    }
    if (!data.security.confirmPassword) {
      newErrors["security.confirmPassword"] = "Please confirm your password";
    } else if (data.security.newPassword !== data.security.confirmPassword) {
      newErrors["security.confirmPassword"] = "Passwords do not match";
    }
    if (data.security.newPassword) {
      const strength = zxcvbn(data.security.newPassword);
      if (strength.score < 2) {
        newErrors["security.newPassword"] = "Password is too weak. Please follow the suggestions below.";
      }
    }
    }
    return newErrors;
  };
  const validatePreferences = (preferences: FormData["preferences"]): ErrorState => {
    const errors: ErrorState = {};
    if (!preferences.timezone) {
      errors["preferences.timezone"] = "Please select a timezone";
    }
    if (!preferences.language) {
      errors["preferences.language"] = "Please select a language";
    }
    if (!preferences.notificationFrequency) {
      errors["preferences.notificationFrequency"] = "Please select notification frequency";
    } else {
      const validFrequencies = notificationFrequencies.map((freq) => freq.value);
      if (!validFrequencies.includes(preferences.notificationFrequency)) {
        errors["preferences.notificationFrequency"] = "Invalid notification frequency selected";
      }
    }
    if (preferences.emailNotifications || preferences.pushNotifications) {
      if (!preferences.notificationFrequency) {
        errors["preferences.notificationFrequency"] =
          "Please select notification frequency when notifications are enabled";
      }
    }
    if (!preferences.emailNotifications && !preferences.pushNotifications) {
      errors["preferences.notifications"] = "Please enable at least one type of notification";
    }
    return errors;
  };
  const calculatePasswordStrength = (password: string) => {
    if (!password)
      return {
        score: 0,
        label: "",
        color: "",
        feedback: { warning: "", suggestions: [] },
      };
    const result = zxcvbn(password);
    const strengthMap = {
      0: { label: "Very Weak", color: "bg-red-500" },
      1: { label: "Weak", color: "bg-orange-500" },
      2: { label: "Fair", color: "bg-yellow-500" },
      3: { label: "Good", color: "bg-blue-500" },
      4: { label: "Strong", color: "bg-green-500" },
    } as const;
    return {
      score: result.score,
      ...strengthMap[result.score as keyof typeof strengthMap],
      feedback: result.feedback,
    };
  };
  const passwordStrength = calculatePasswordStrength(formData.security.newPassword);
  useEffect(() => {
    const draft = localStorage.getItem("accountSettingsDraft");
    if (draft) {
      const parsedDraft = JSON.parse(draft);
      setFormData(parsedDraft);
      const validationResult = validateAllSections(parsedDraft);
      if (validationResult.hasErrors) {
        setErrors(validationResult.errors);
      }
    }
  }, []);
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);
  const showSuccessToast = (message: string) => {
    const now = Date.now();
    const timeSinceLastError = now - lastErrorTime.current;
    const minimumDelay = 500;
    setTimeout(() => {
      setErrorToast(null);
      setSuccessToast(message);
    }, Math.max(minimumDelay, timeSinceLastError));
  };
  const showErrorToast = (message: string) => {
    lastErrorTime.current = Date.now();
    setTimeout(() => {
      setSuccessToast(null);
      setErrorToast(message);
    }, 100);
  };
  useEffect(() => {
    if (isDirty) {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
      autoSaveTimer.current = setTimeout(() => {
        localStorage.setItem("accountSettingsDraft", JSON.stringify(formData));
        setLastSaved(new Date());
        const timeSinceLastError = Date.now() - lastErrorTime.current;
        if (timeSinceLastError > 500) {
          showSuccessToast("Draft saved automatically.");
        }
      }, 2000);
    }
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [formData, isDirty]);
  const timezones = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Australia/Sydney",
  ];
  const notificationFrequencies = [
    { value: "realtime", label: "Real-time updates" },
    { value: "hourly", label: "Every hour" },
    { value: "daily", label: "Once a day" },
    { value: "weekly", label: "Weekly digest" },
    { value: "never", label: "Never" },
  ];
  const timezoneOptions = timezones.map((tz) => ({
    value: tz,
    label: tz.replace("_", " ").replace(/\//g, " / "),
  }));
  const notificationFrequencyOptions = notificationFrequencies.map((freq) => ({
    value: freq.value,
    label: freq.label,
  }));
  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
  ];
  const handleInputChange = (section: keyof FormData, field: string, value: string | boolean) => {
    const updatedFormData = {
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    };
    setFormData(updatedFormData);
    setIsDirty(true);
    if (section === "security" && (field === "newPassword" || field === "confirmPassword")) {
      const newErrors: ErrorState = {};
      const newPassword = field === "newPassword" ? value as string : updatedFormData.security.newPassword;
      const confirmPassword = field === "confirmPassword" ? value as string : updatedFormData.security.confirmPassword;
      if (newPassword && newPassword.length < 8) {
        newErrors["security.newPassword"] = "Password must be at least 8 characters";
      } else if (newPassword) {
        const strength = zxcvbn(newPassword);
        if (strength.score < 2) {
          newErrors["security.newPassword"] = "Password is too weak. Please follow the suggestions below.";
        }
      }
      if (confirmPassword && newPassword !== confirmPassword) {
        newErrors["security.confirmPassword"] = "Passwords do not match";
      }
      setErrors((prev) => {
        const updatedErrors = { ...prev };
        if (newErrors["security.newPassword"]) {
          updatedErrors["security.newPassword"] = newErrors["security.newPassword"];
    } else {
          delete updatedErrors["security.newPassword"];
        }
        if (newErrors["security.confirmPassword"]) {
          updatedErrors["security.confirmPassword"] = newErrors["security.confirmPassword"];
        } else {
          delete updatedErrors["security.confirmPassword"];
        }
        return updatedErrors;
      });
    } else if (section === "profile") {
      // Real-time validation for profile fields
      const newErrors: ErrorState = {};
      
      if (field === "firstName" && !(value as string).trim()) {
        newErrors["profile.firstName"] = "First name is required";
      }
      
      if (field === "lastName" && !(value as string).trim()) {
        newErrors["profile.lastName"] = "Last name is required";
      }
      
      if (field === "email") {
        const emailValue = value as string;
        if (!emailValue.trim()) {
          newErrors["profile.email"] = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(emailValue)) {
          newErrors["profile.email"] = "Email is invalid";
        }
      }
      
      if (field === "bio") {
        const bioValue = value as string;
        if (bioValue.length > 500) {
          newErrors["profile.bio"] = "Bio must be less than 500 characters";
        }
      }
      
      setErrors((prev) => {
        const updatedErrors = { ...prev };
        
        // Clear or set the specific field error
        if (newErrors[`${section}.${field}`]) {
          updatedErrors[`${section}.${field}`] = newErrors[`${section}.${field}`];
        } else {
          delete updatedErrors[`${section}.${field}`];
        }
        
        return updatedErrors;
      });
    } else {
      setErrors((prev) => {
        const updatedErrors = { ...prev };
        delete updatedErrors[`${section}.${field}`];
        return updatedErrors;
      });
    }
  };
  const sections = [
    { id: "profile", label: "Profile", icon: FiUser },
    { id: "security", label: "Security", icon: FiShield },
    { id: "preferences", label: "Preferences", icon: FiSettings },
  ];
  const validateAllSections = (data: FormData) => {
    const allErrors: ErrorState = {};
    const errorSections: string[] = [];
    const profileErrors = validateForm(data);
    if (Object.keys(profileErrors).length > 0) {
      Object.assign(allErrors, profileErrors);
      if (Object.keys(profileErrors).some(k => k.startsWith('profile.'))) {
        errorSections.push("Profile");
      }
      if (Object.keys(profileErrors).some(k => k.startsWith('security.'))) {
        errorSections.push("Security");
      }
    }

    const preferenceErrors = validatePreferences(data.preferences);
    if (Object.keys(preferenceErrors).length > 0) {
      Object.assign(allErrors, preferenceErrors);
      errorSections.push("Preferences");
    }
    return {
      hasErrors: Object.keys(allErrors).length > 0,
      errors: allErrors,
      errorSections: [...new Set(errorSections)],
    };
  };
  const handleSectionSave = (sectionName: keyof FormData) => {
    const sectionData = formData[sectionName];
    if (sectionName === "profile") {
      const profileErrors = validateForm(formData);
      const sectionErrors = Object.keys(profileErrors).filter(key => key.startsWith("profile."));
      if (sectionErrors.length > 0) {
        showErrorToast(`Please fix the errors in the ${sectionName} section.`);
        return;
      }
    } else if (sectionName === "security") {
      if (formData.security.passwordChangeEnabled) {
        if (!formData.security.newPassword || formData.security.newPassword.length < 8) {
          showErrorToast("Please enter a valid password (at least 8 characters).");
          return;
        }
        if (formData.security.newPassword !== formData.security.confirmPassword) {
          showErrorToast("Passwords do not match.");
          return;
        }
        const strength = zxcvbn(formData.security.newPassword);
        if (strength.score < 2) {
          showErrorToast("Password is too weak. Please follow the suggestions.");
          return;
        }
      }
    } else if (sectionName === "preferences") {
      const preferenceErrors = validatePreferences(formData.preferences);
      if (Object.keys(preferenceErrors).length > 0) {
        showErrorToast(`Please fix the errors in the ${sectionName} section.`);
        return;
      }
    }
    setSectionSavedState(prev => ({
      ...prev,
      [sectionName]: { ...sectionData }
    }));
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`${sectionName}.`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
    showSuccessToast(`${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} section saved locally!`);
  };
  const handleSave = () => {
    const validationResult = validateAllSections(formData);
    setErrors(validationResult.errors);
    if (validationResult.hasErrors) {
      const errorMessage = `Please fix the errors in the following sections: ${validationResult.errorSections.join(
        ", "
      )}`;
      showErrorToast(errorMessage);
      return;
    }
    setSavedState(formData);
    setSectionSavedState(formData);
    setIsDirty(false);
    localStorage.removeItem("accountSettingsDraft");
    showSuccessToast("All settings saved successfully!");
  };
  const handleSectionUndo = (sectionName: keyof FormData) => {
    setFormData(prev => ({
      ...prev,
      [sectionName]: { ...savedState[sectionName] }
    }));
    setSectionSavedState(prev => ({
      ...prev,
      [sectionName]: { ...savedState[sectionName] }
    }));
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`${sectionName}.`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
    const updatedFormData = {
      ...formData,
      [sectionName]: { ...savedState[sectionName] }
    };
    const hasChanges = JSON.stringify(updatedFormData) !== JSON.stringify(savedState);
    if (!hasChanges) {
      setIsDirty(false);
      localStorage.removeItem("accountSettingsDraft");
    }
    showSuccessToast(`${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} changes undone.`);
  };
  const handleCancel = () => {
    setFormData(savedState);
    setSectionSavedState(savedState);
    setIsDirty(false);
    setErrors({});
    localStorage.removeItem("accountSettingsDraft");
    showSuccessToast("All changes cancelled. Reverted to last saved state.");
  };
  const startDemo = () => {
    setIsLoadingDemo(true);
    setTimeout(() => {
      setShowLanding(false);
      setIsLoadingDemo(false);
    }, 800);
  };
  if (showLanding) {
    return (
      <div className="animate-fadeIn">
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @keyframes slideIn {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
            .animate-slideIn {
              animation: slideIn 0.3s ease-out forwards;
            }
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            .animate-fadeIn {
              animation: fadeIn 0.5s ease-out forwards;
            }
          `,
          }}
        />
        <LandingPage onStartDemo={startDemo} isLoading={isLoadingDemo} />
      </div>
    );
  }
  return (
    <div className="space-grotesk min-h-screen bg-gray-100 text-gray-900 animate-fadeIn">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        .space-grotesk {
          font-family: 'Space Grotesk', sans-serif;
        }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
      {successToast && <SuccessToast message={successToast} onClose={() => setSuccessToast(null)} />}
      {errorToast && <ErrorToast message={errorToast} onClose={() => setErrorToast(null)} />}
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Account Settings</h1>
          <div className="w-10"></div>
        </div>
        <div
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:sticky top-0 left-0 z-50 w-80 h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-2xl border-r border-purple-800/20 transition-transform duration-300 ease-in-out`}
        >
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h1 className="text-xl font-bold text-white whitespace-nowrap">Account Settings</h1>
              <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
              <FiX className="w-5 h-5" />
              </button>
          </div>
          <nav className="p-4">
            {sections.map((section) => {
              const Icon = section.icon;
              const hasError = Object.keys(errors).some((key) => key.startsWith(`${section.id}.`));
              const isSectionSaved = JSON.stringify(sectionSavedState[section.id as keyof FormData]) === JSON.stringify(formData[section.id as keyof FormData]);
              const isGloballySaved = JSON.stringify(savedState[section.id as keyof FormData]) === JSON.stringify(formData[section.id as keyof FormData]);
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-200 relative cursor-pointer ${
                    activeSection === section.id
                      ? "bg-white/20 text-white font-medium shadow-lg border border-white/30 backdrop-blur-sm"
                      : hasError
                      ? "text-red-200 hover:bg-red-500/20 border border-red-400/30 bg-red-500/10 hover:border-red-400/50"
                      : isGloballySaved
                      ? "text-green-200 hover:bg-green-500/20 border border-green-400/30 bg-green-500/10 hover:border-green-400/50"
                      : isSectionSaved
                      ? "text-yellow-200 hover:bg-yellow-500/20 border border-yellow-400/30 bg-yellow-500/10 hover:border-yellow-400/50"
                      : "text-gray-100 hover:bg-white/10 border border-transparent hover:text-white hover:border-white/20"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {section.label}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {hasError && (
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                  )}
                    {!hasError && isGloballySaved && (
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                    )}
                    {!hasError && !isGloballySaved && isSectionSaved && (
                      <span className="w-2 h-2 rounded-full bg-yellow-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
          <div className="mt-auto border-t border-white/10">
          {lastSaved && (
              <div className="px-6 py-3 text-xs text-gray-100">
              Draft saved {lastSaved.toLocaleTimeString()}
            </div>
          )}
            <div className="p-4 space-y-3">
              <button
                onClick={handleSave}
                disabled={!isDirty || !(
                  JSON.stringify(sectionSavedState.profile) === JSON.stringify(formData.profile) &&
                  JSON.stringify(sectionSavedState.security) === JSON.stringify(formData.security) &&
                  JSON.stringify(sectionSavedState.preferences) === JSON.stringify(formData.preferences)
                )}
                className="group relative w-full flex items-center justify-center px-4 py-2.5 text-white bg-gradient-to-r from-purple-500/80 to-slate-500/80 backdrop-blur-sm border border-white/20 rounded-xl hover:from-purple-500 hover:to-slate-500 hover:border-white/30 hover:scale-105 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:from-purple-500/80 disabled:hover:to-slate-500/80 text-sm font-medium overflow-hidden cursor-pointer disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-700 -translate-x-full"></div>
                <FiSave className="w-4 h-4 mr-2 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10">Save</span>
              </button>
              <button
                onClick={handleCancel}
                disabled={!(
                  (JSON.stringify(sectionSavedState.profile) === JSON.stringify(formData.profile) && JSON.stringify(savedState.profile) !== JSON.stringify(formData.profile)) ||
                  (JSON.stringify(sectionSavedState.security) === JSON.stringify(formData.security) && JSON.stringify(savedState.security) !== JSON.stringify(formData.security)) ||
                  (JSON.stringify(sectionSavedState.preferences) === JSON.stringify(formData.preferences) && JSON.stringify(savedState.preferences) !== JSON.stringify(formData.preferences))
                )}
                className="group w-full flex items-center justify-center px-4 py-2.5 text-gray-100 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/15 hover:border-red-300/50 hover:text-red-200 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/10 disabled:hover:border-white/20 disabled:hover:text-gray-100 text-sm font-medium cursor-pointer disabled:cursor-not-allowed"
              >
                <FiX className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                <span>Cancel</span>
              </button>
              <button
                onClick={() => setShowLanding(true)}
                className="group w-full flex items-center justify-center px-4 py-2.5 text-gray-100 bg-transparent border border-white/20 rounded-xl hover:bg-white/10 hover:border-white/30 hover:text-white transition-all duration-300 text-sm font-medium cursor-pointer"
              >
                <FiArrowRight className="w-4 h-4 mr-2 rotate-180 group-hover:translate-x-[-2px] transition-transform duration-300" />
                <span>Back to Home</span>
              </button>
        </div>
          </div>
        </div>
        <div className="flex-1 p-2 sm:p-4 lg:p-8 mt-0 lg:mt-0 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 min-h-screen flex items-center justify-center">
          <div className="max-w-4xl mx-auto w-full">
            {activeSection === "profile" && (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600/15 to-slate-600/15 p-6 sm:p-8 border-b border-slate-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-slate-600 rounded-xl flex items-center justify-center text-white text-2xl">
                      <FiUser />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent">
                      Profile Information
                    </h2>
                  </div>
                </div>
                <div className="p-6 sm:p-8 lg:p-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-700 mb-3 group-focus-within:text-purple-600 transition-colors">
                        First Name <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.profile.firstName}
                          onChange={(e) => handleInputChange("profile", "firstName", e.target.value)}
                          placeholder="Enter your first name"
                          className={`w-full px-4 py-3 bg-white/70 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder:text-slate-400 text-slate-800 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-0 ${
                            errors["profile.firstName"]
                              ? "border-red-400 bg-red-50/80 focus:border-red-500 focus:ring-red-500/20"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        />

                      </div>
                      {errors["profile.firstName"] && (
                        <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {errors["profile.firstName"]}
                        </p>
                      )}
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-700 mb-3 group-focus-within:text-purple-600 transition-colors">
                        Last Name <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.profile.lastName}
                          onChange={(e) => handleInputChange("profile", "lastName", e.target.value)}
                          placeholder="Enter your last name"
                          className={`w-full px-4 py-3 bg-white/70 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder:text-slate-400 text-slate-800 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-0 ${
                            errors["profile.lastName"]
                              ? "border-red-400 bg-red-50/80 focus:border-red-500 focus:ring-red-500/20"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        />

                      </div>
                      {errors["profile.lastName"] && (
                        <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {errors["profile.lastName"]}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-8 group">
                    <label className="block text-sm font-semibold text-slate-700 mb-3 group-focus-within:text-purple-600 transition-colors">
                      Email Address <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={formData.profile.email}
                        onChange={(e) => handleInputChange("profile", "email", e.target.value)}
                        placeholder="Enter your email address"
                        className={`w-full pl-12 pr-4 py-3 bg-white/70 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder:text-slate-400 text-slate-800 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-0 ${
                          errors["profile.email"]
                            ? "border-red-400 bg-red-50/80 focus:border-red-500 focus:ring-red-500/20"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      />

                    </div>
                    {errors["profile.email"] && (
                      <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors["profile.email"]}
                      </p>
                    )}
                  </div>
                  <div className="mt-8 group">
                    <label className="block text-sm font-semibold text-slate-700 mb-3 group-focus-within:text-purple-600 transition-colors">
                      Bio
                    </label>
                    <div className="relative">
                      <textarea
                        value={formData.profile.bio}
                        onChange={(e) => handleInputChange("profile", "bio", e.target.value)}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        maxLength={500}
                        className={`w-full px-4 py-3 bg-white/70 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder:text-slate-400 text-slate-800 shadow-sm hover:shadow-md resize-none focus-visible:outline-none focus-visible:ring-0 ${
                          errors["profile.bio"]
                            ? "border-red-400 bg-red-50/80 focus:border-red-500 focus:ring-red-500/20"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      />
                      <div className={`absolute bottom-3 right-3 text-xs ${
                        (formData.profile.bio?.length || 0) > 450 
                          ? "text-amber-500 font-medium" 
                          : errors["profile.bio"]
                          ? "text-red-500 font-medium"
                          : "text-slate-400"
                      }`}>
                        {formData.profile.bio?.length || 0}/500
                      </div>

                    </div>
                    {errors["profile.bio"] && (
                      <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors["profile.bio"]}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    {(() => {
                      const isProfileChanged = JSON.stringify(savedState.profile) !== JSON.stringify(formData.profile);
                      const isProfileSaved = JSON.stringify(sectionSavedState.profile) === JSON.stringify(formData.profile);
                      if (isProfileChanged) {
                        return (
                          <>
                    <button
                              onClick={() => handleSectionUndo("profile")}
                              className="group flex items-center justify-center px-4 py-2.5 text-slate-600 bg-white border-2 border-slate-300 shadow-lg rounded-xl hover:bg-slate-50 hover:border-red-400 hover:text-red-600 transition-all duration-300 text-sm font-medium cursor-pointer"
                    >
                      <FiX className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                              <span>Undo</span>
                    </button>
                            {isProfileSaved ? (
                    <button
                                disabled
                                className="group relative flex items-center justify-center px-6 py-2.5 text-green-700 bg-green-100 border border-green-300 shadow-lg rounded-xl text-sm font-medium cursor-not-allowed"
                              >
                                <FiCheckCircle className="w-4 h-4 mr-2" />
                                <span>Profile Saved</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSectionSave("profile")}
                                className="group relative flex items-center justify-center px-6 py-2.5 text-white bg-gradient-to-r from-purple-500 to-slate-500 border border-transparent shadow-lg rounded-xl hover:from-purple-600 hover:to-slate-600 hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm font-medium overflow-hidden cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-700 -translate-x-full"></div>
                      <FiSave className="w-4 h-4 mr-2 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                                <span className="relative z-10">Save Profile</span>
                    </button>
                            )}
                          </>
                        );
                      } else {
                        return (
                          <button
                            disabled
                            className="group relative flex items-center justify-center px-6 py-2.5 text-slate-400 bg-slate-100 border border-slate-200 shadow-lg rounded-xl text-sm font-medium cursor-not-allowed opacity-50"
                          >
                            <FiSave className="w-4 h-4 mr-2" />
                            <span>Save Profile</span>
                          </button>
                        );
                      }
                    })()}
                  </div>
                </div>
              </div>
            )}
            {activeSection === "security" && (
              <div className="bg-white rounded-2xl max-w-2xl mx-auto shadow-xl border border-slate-200/50 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600/15 to-slate-600/15 p-6 sm:p-8 border-b border-slate-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-slate-600 rounded-xl flex items-center justify-center text-white text-2xl">
                      <FiShield />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent">
                      Security Settings
                    </h2>
                  </div>
                </div>
                <div className="p-6 sm:p-8 lg:p-10">
                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-700 mb-4 group-focus-within:text-purple-600 transition-colors">
                        Security Options
                      </label>
                      <div className="space-y-4">
                        <label className="flex items-start group cursor-pointer p-3 rounded-xl hover:bg-slate-50/80 transition-all duration-200">
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.security.twoFactorAuth}
                              onChange={(e) => handleInputChange("security", "twoFactorAuth", e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-6 h-6 border-2 border-slate-300 rounded-lg transition-all duration-300 peer-checked:border-purple-500 peer-checked:bg-gradient-to-br peer-checked:from-purple-500 peer-checked:to-slate-500 peer-focus:ring-4 peer-focus:ring-purple-500/20 group-hover:border-purple-400 group-hover:shadow-md flex items-center justify-center shadow-sm">
                              {formData.security.twoFactorAuth && (
                                <FiCheck className="w-4 h-4 text-white drop-shadow-sm" />
                              )}
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <span className="text-sm font-medium text-slate-800 group-hover:text-slate-900 block">
                              Two-Factor Authentication
                            </span>
                            <span className="text-xs text-slate-500 mt-0.5 block">
                              Add an extra layer of security to your account
                            </span>
                          </div>
                        </label>
                        <label className="flex items-start group cursor-pointer p-3 rounded-xl hover:bg-slate-50/80 transition-all duration-200">
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.security.loginAlerts}
                              onChange={(e) => handleInputChange("security", "loginAlerts", e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-6 h-6 border-2 border-slate-300 rounded-lg transition-all duration-300 peer-checked:border-purple-500 peer-checked:bg-gradient-to-br peer-checked:from-purple-500 peer-checked:to-slate-500 peer-focus:ring-4 peer-focus:ring-purple-500/20 group-hover:border-purple-400 group-hover:shadow-md flex items-center justify-center shadow-sm">
                              {formData.security.loginAlerts && (
                                <FiCheck className="w-4 h-4 text-white drop-shadow-sm" />
                              )}
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <span className="text-sm font-medium text-slate-800 group-hover:text-slate-900 block">
                              Login Alerts
                            </span>
                            <span className="text-xs text-slate-500 mt-0.5 block">
                              Get notified when someone logs into your account
                            </span>
                          </div>
                        </label>
                        <label className="flex items-start group cursor-pointer p-3 rounded-xl hover:bg-slate-50/80 transition-all duration-200">
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.security.sessionTimeout}
                              onChange={(e) => handleInputChange("security", "sessionTimeout", e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-6 h-6 border-2 border-slate-300 rounded-lg transition-all duration-300 peer-checked:border-purple-500 peer-checked:bg-gradient-to-br peer-checked:from-purple-500 peer-checked:to-slate-500 peer-focus:ring-4 peer-focus:ring-purple-500/20 group-hover:border-purple-400 group-hover:shadow-md flex items-center justify-center shadow-sm">
                              {formData.security.sessionTimeout && (
                                <FiCheck className="w-4 h-4 text-white drop-shadow-sm" />
                              )}
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <span className="text-sm font-medium text-slate-800 group-hover:text-slate-900 block">
                              Automatic Session Timeout
                            </span>
                            <span className="text-xs text-slate-500 mt-0.5 block">
                              Automatically log out after 30 minutes of inactivity
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="border-t border-slate-200 pt-6">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-slate-50 rounded-xl border border-purple-200/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-slate-500 rounded-lg flex items-center justify-center text-white">
                            <FiLock className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-slate-800">Change Password</h3>
                            <p className="text-xs text-slate-600">Update your account password</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newValue = !formData.security.passwordChangeEnabled;
                            if (!newValue) {
                              const updatedSecurityData = {
                                ...formData.security,
                                passwordChangeEnabled: false,
                                newPassword: "",
                                confirmPassword: ""
                              };
                              setFormData(prev => ({
                                ...prev,
                                security: updatedSecurityData
                              }));
                              setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors["security.newPassword"];
                                delete newErrors["security.confirmPassword"];
                                return newErrors;
                              });
                              const hasOtherSecurityChanges = JSON.stringify({
                                ...updatedSecurityData,
                                newPassword: "",
                                confirmPassword: ""
                              }) !== JSON.stringify({
                                ...savedState.security,
                                newPassword: "",
                                confirmPassword: ""
                              });
                              const hasOtherChanges = 
                                JSON.stringify(formData.profile) !== JSON.stringify(savedState.profile) ||
                                JSON.stringify(formData.preferences) !== JSON.stringify(savedState.preferences) ||
                                hasOtherSecurityChanges;
                              if (hasOtherChanges) {
                                setIsDirty(true);
                              } else {
                                setIsDirty(false);
                                localStorage.removeItem("accountSettingsDraft");
                              }
                            } else {
                              handleInputChange("security", "passwordChangeEnabled", newValue);
                            }
                          }}
                          className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-all duration-300 ${
                            formData.security.passwordChangeEnabled
                              ? "bg-purple-600 text-white hover:bg-purple-700"
                              : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                          }`}
                        >
                          {formData.security.passwordChangeEnabled ? "Cancel" : "Change Password"}
                        </button>
                      </div>
                      {formData.security.passwordChangeEnabled && (
                        <div className="mt-6 space-y-6 animate-fadeIn">
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-700 mb-3 group-focus-within:text-purple-600 transition-colors">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.security.newPassword}
                          onChange={(e) => handleInputChange("security", "newPassword", e.target.value)}
                          placeholder="Enter new password"
                                className={`w-full px-4 py-3 pr-12 bg-white/70 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder:text-slate-400 text-slate-800 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-0 ${
                                  errors["security.newPassword"]
                                    ? "border-red-400 bg-red-50/80 focus:border-red-500 focus:ring-red-500/20"
                                    : "border-slate-200 hover:border-slate-300"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                        </button>

                      </div>
                      {errors["security.newPassword"] && (
                              <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {errors["security.newPassword"]}
                              </p>
                      )}
                          </div>
                      {formData.security.newPassword && (
                            <div className="bg-slate-50/80 border border-slate-200/50 rounded-xl p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <FiShield className="w-4 h-4 text-slate-600" />
                                <span className="text-sm font-medium text-slate-700">Password Strength</span>
                          </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                                      className={`h-full transition-all duration-500 ${
                                        calculatePasswordStrength(formData.security.newPassword).color
                                      }`}
                              style={{
                                        width: `${(calculatePasswordStrength(formData.security.newPassword).score / 4) * 100}%`,
                              }}
                            />
                          </div>
                                  <span className="text-sm font-medium text-slate-600 min-w-[60px]">
                                    {calculatePasswordStrength(formData.security.newPassword).label}
                                  </span>
                                </div>
                                {calculatePasswordStrength(formData.security.newPassword).feedback.warning && (
                                  <p className="text-amber-600 text-sm flex items-start gap-1">
                                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                      <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    {calculatePasswordStrength(formData.security.newPassword).feedback.warning}
                                  </p>
                          )}
                                {calculatePasswordStrength(formData.security.newPassword).feedback.suggestions.length > 0 && (
                                  <div className="space-y-1">
                                    {calculatePasswordStrength(formData.security.newPassword).feedback.suggestions.map(
                                      (suggestion, index) => (
                                        <p key={index} className="text-blue-600 text-sm flex items-start gap-1">
                                          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                              fillRule="evenodd"
                                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                          {suggestion}
                                        </p>
                                      )
                          )}
                        </div>
                      )}
                    </div>
                            </div>
                          )}
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-700 mb-3 group-focus-within:text-purple-600 transition-colors">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.security.confirmPassword}
                          onChange={(e) => handleInputChange("security", "confirmPassword", e.target.value)}
                          placeholder="Confirm new password"
                                className={`w-full px-4 py-3 pr-12 bg-white/70 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder:text-slate-400 text-slate-800 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-0 ${
                                  errors["security.confirmPassword"]
                                    ? "border-red-400 bg-red-50/80 focus:border-red-500 focus:ring-red-500/20"
                                    : "border-slate-200 hover:border-slate-300"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                                {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                        </button>

                      </div>
                      {errors["security.confirmPassword"] && (
                              <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {errors["security.confirmPassword"]}
                              </p>
                      )}
                    </div>
                  </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    {(() => {
                      const isSecurityChanged = JSON.stringify(savedState.security) !== JSON.stringify(formData.security);
                      const isSecuritySaved = JSON.stringify(sectionSavedState.security) === JSON.stringify(formData.security);
                      if (isSecurityChanged) {
                        return (
                          <>
                    <button
                              onClick={() => handleSectionUndo("security")}
                              className="group flex items-center justify-center px-4 py-2.5 text-slate-600 bg-white border-2 border-slate-300 shadow-lg rounded-xl hover:bg-slate-50 hover:border-red-400 hover:text-red-600 transition-all duration-300 text-sm font-medium cursor-pointer"
                    >
                      <FiX className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                              <span>Undo</span>
                    </button>
                            {isSecuritySaved ? (
                    <button
                                disabled
                                className="group relative flex items-center justify-center px-6 py-2.5 text-green-700 bg-green-100 border border-green-300 shadow-lg rounded-xl text-sm font-medium cursor-not-allowed"
                              >
                                <FiCheckCircle className="w-4 h-4 mr-2" />
                                <span>Security Saved</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSectionSave("security")}
                                className="group relative flex items-center justify-center px-6 py-2.5 text-white bg-gradient-to-r from-purple-500 to-slate-500 border border-transparent shadow-lg rounded-xl hover:from-purple-600 hover:to-slate-600 hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm font-medium overflow-hidden cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-700 -translate-x-full"></div>
                      <FiSave className="w-4 h-4 mr-2 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                                <span className="relative z-10">Save Security</span>
                    </button>
                            )}
                          </>
                        );
                      } else {
                        return (
                          <button
                            disabled
                            className="group relative flex items-center justify-center px-6 py-2.5 text-slate-400 bg-slate-100 border border-slate-200 shadow-lg rounded-xl text-sm font-medium cursor-not-allowed opacity-50"
                          >
                            <FiSave className="w-4 h-4 mr-2" />
                            <span>Save Security</span>
                          </button>
                        );
                      }
                    })()}
                  </div>
                </div>
              </div>
            )}
            {activeSection === "preferences" && (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600/15 to-slate-600/15 p-6 sm:p-8 border-b border-slate-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-slate-600 rounded-xl flex items-center justify-center text-white text-2xl">
                      <FiSettings />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent">
                      Preferences
                    </h2>
                  </div>
                </div>
                <div className="p-6 sm:p-8 lg:p-10">
                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-700 mb-3 group-focus-within:text-purple-600 transition-colors">
                        Timezone
                      </label>
                      <CustomDropdown
                        value={formData.preferences.timezone}
                        onChange={(value) => handleInputChange("preferences", "timezone", value)}
                        options={timezoneOptions}
                        placeholder="Select timezone"
                        error={errors["preferences.timezone"]}
                      />
                      {errors["preferences.timezone"] && (
                        <p className="text-red-600 text-sm mt-1">{errors["preferences.timezone"]}</p>
                      )}
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-700 mb-3 group-focus-within:text-purple-600 transition-colors">
                        Language
                      </label>
                      <CustomDropdown
                        value={formData.preferences.language}
                        onChange={(value) => handleInputChange("preferences", "language", value)}
                        options={languageOptions}
                        placeholder="Select language"
                        error={errors["preferences.language"]}
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-700 mb-3 group-focus-within:text-purple-600 transition-colors">
                        Notification Frequency
                        {(formData.preferences.emailNotifications || formData.preferences.pushNotifications) && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <CustomDropdown
                        value={formData.preferences.notificationFrequency}
                        onChange={(value) => handleInputChange("preferences", "notificationFrequency", value)}
                        options={notificationFrequencyOptions}
                        placeholder="How often would you like to receive notifications?"
                        error={errors["preferences.notificationFrequency"]}
                      />
                      {errors["preferences.notificationFrequency"] && (
                        <p className="text-red-600 text-sm mt-1">{errors["preferences.notificationFrequency"]}</p>
                      )}
                      <p className="text-gray-500 text-sm mt-1">
                        {formData.preferences.notificationFrequency === "never"
                          ? "You won't receive any notifications"
                          : formData.preferences.notificationFrequency
                          ? `You'll receive notifications ${
                              formData.preferences.notificationFrequency === "realtime"
                                ? "as they happen"
                                : formData.preferences.notificationFrequency === "hourly"
                                ? "every hour"
                                : formData.preferences.notificationFrequency === "daily"
                                ? "once a day"
                                : "once a week"
                            }`
                          : "Select how often you want to receive notifications"}
                      </p>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-700 mb-4 group-focus-within:text-purple-600 transition-colors">
                        Notifications
                      </label>
                      <div className="space-y-4">
                        <label className="flex items-start group cursor-pointer p-3 rounded-xl hover:bg-slate-50/80 transition-all duration-200">
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.preferences.emailNotifications}
                              onChange={(e) => handleInputChange("preferences", "emailNotifications", e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-6 h-6 border-2 border-slate-300 rounded-lg transition-all duration-300 peer-checked:border-purple-500 peer-checked:bg-gradient-to-br peer-checked:from-purple-500 peer-checked:to-slate-500 peer-focus:ring-4 peer-focus:ring-purple-500/20 group-hover:border-purple-400 group-hover:shadow-md flex items-center justify-center shadow-sm">
                              {formData.preferences.emailNotifications && (
                                <FiCheck className="w-4 h-4 text-white drop-shadow-sm" />
                              )}
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <span className="text-sm font-medium text-slate-800 group-hover:text-slate-900 block">
                              Email Notifications
                            </span>
                            <span className="text-xs text-slate-500 mt-0.5 block">
                              Receive updates and alerts via email
                            </span>
                          </div>
                        </label>
                        <label className="flex items-start group cursor-pointer p-3 rounded-xl hover:bg-slate-50/80 transition-all duration-200">
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.preferences.pushNotifications}
                              onChange={(e) => handleInputChange("preferences", "pushNotifications", e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-6 h-6 border-2 border-slate-300 rounded-lg transition-all duration-300 peer-checked:border-purple-500 peer-checked:bg-gradient-to-br peer-checked:from-purple-500 peer-checked:to-slate-500 peer-focus:ring-4 peer-focus:ring-purple-500/20 group-hover:border-purple-400 group-hover:shadow-md flex items-center justify-center shadow-sm">
                              {formData.preferences.pushNotifications && (
                                <FiCheck className="w-4 h-4 text-white drop-shadow-sm" />
                              )}
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <span className="text-sm font-medium text-slate-800 group-hover:text-slate-900 block">
                              Push Notifications
                            </span>
                            <span className="text-xs text-slate-500 mt-0.5 block">
                              Get instant notifications on your device
                            </span>
                          </div>
                        </label>
                        {errors["preferences.notifications"] && (
                          <div className="p-3 rounded-xl bg-red-50/80 border border-red-200/50">
                            <p className="text-red-600 text-sm flex items-center gap-2">
                              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {errors["preferences.notifications"]}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    {(() => {
                      const isPreferencesChanged = JSON.stringify(savedState.preferences) !== JSON.stringify(formData.preferences);
                      const isPreferencesSaved = JSON.stringify(sectionSavedState.preferences) === JSON.stringify(formData.preferences);
                      if (isPreferencesChanged) {
                        return (
                          <>
                    <button
                              onClick={() => handleSectionUndo("preferences")}
                              className="group flex items-center justify-center px-4 py-2.5 text-slate-600 bg-white border-2 border-slate-300 shadow-lg rounded-xl hover:bg-slate-50 hover:border-red-400 hover:text-red-600 transition-all duration-300 text-sm font-medium cursor-pointer"
                    >
                      <FiX className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                              <span>Undo</span>
                    </button>
                            {isPreferencesSaved ? (
                    <button
                                disabled
                                className="group relative flex items-center justify-center px-6 py-2.5 text-green-700 bg-green-100 border border-green-300 shadow-lg rounded-xl text-sm font-medium cursor-not-allowed"
                              >
                                <FiCheckCircle className="w-4 h-4 mr-2" />
                                <span>Preferences Saved</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSectionSave("preferences")}
                                className="group relative flex items-center justify-center px-6 py-2.5 text-white bg-gradient-to-r from-purple-500 to-slate-500 border border-transparent shadow-lg rounded-xl hover:from-purple-600 hover:to-slate-600 hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm font-medium overflow-hidden cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-700 -translate-x-full"></div>
                      <FiSave className="w-4 h-4 mr-2 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                                <span className="relative z-10">Save Preferences</span>
                    </button>
                            )}
                          </>
                        );
                      } else {
                        return (
                          <button
                            disabled
                            className="group relative flex items-center justify-center px-6 py-2.5 text-slate-400 bg-slate-100 border border-slate-200 shadow-lg rounded-xl text-sm font-medium cursor-not-allowed opacity-50"
                          >
                            <FiSave className="w-4 h-4 mr-2" />
                            <span>Save Preferences</span>
                          </button>
                        );
                      }
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" 
            onClick={() => setIsSidebarOpen(false)} 
          />
        )}
      </div>
    </div>
  );
}
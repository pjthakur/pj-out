"use client";
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
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
const slideInVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1 }
};
interface ClassBooking {
  id: string;
  className: string;
  instructor: string;
  dateTime: Date;
  status: "completed" | "upcoming" | "cancelled";
}
interface AvailableClass {
  id: string;
  className: string;
  instructor: string;
  time: string;
  duration: number;
  spotsAvailable: number;
  totalSpots: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: "Yoga" | "HIIT" | "Strength" | "Cardio" | "Dance" | "Pilates";
}
interface SubscriptionPlan {
  planId: number;
  name: string;
  creditsPerMonth: number;
  guestPassesPerMonth: number;
  workshopsPerMonth: number;
  price: number;
  features: string[];
}
interface Referral {
  id: string;
  name: string;
  joinDate: string;
  creditsEarned: number;
  status: "pending" | "completed";
}
interface User {
  name: string;
  email: string;
  initials: string;
}
interface UsageData {
  classesUsed: number;
  classesTotal: number;
  guestPassesUsed: number;
  guestPassesTotal: number;
  workshopsAttended: number;
  workshopsTotal: number;
}
const IconCheck = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);
const IconChevronRight = ({
  className = "w-5 h-5",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);
const IconChevronLeft = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);
const IconCreditCard = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);
const IconGift = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 13l-4-4h8l-4 4zm0-13a2 2 0 00-2 2h4a2 2 0 00-2-2z"
    />
  </svg>
);
const IconHistory = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const IconHome = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);
const IconCalendar = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    ></path>
  </svg>
);
const IconCopy = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);
const IconUser = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);
const IconMenu = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);
const IconX = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const IconSpinner = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={`animate-spin ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);
const IconTrophy = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
    />
  </svg>
);
const IconCancelled = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      strokeWidth={2}
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 9l-6 6M9 9l6 6"
    />
  </svg>
);
const IconFireworks = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);
const GlobalStyles = () => (
  <style>{`
      @import "tailwindcss/preflight";
      @tailwind utilities;
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap'); 
    body {
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%);
      background-attachment: fixed;
      color: #f8fafc;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      overflow-x: hidden;
      min-height: 100vh;
    }
    *, *::before, *::after {
      box-sizing: inherit;
    }
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(15, 23, 42, 0.3);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #8b5cf6, #a855f7);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #a78bfa, #8b5cf6);
    }
    *:focus-visible {
      outline: 2px solid #8b5cf6;
      outline-offset: 2px;
      border-radius: 4px;
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.4); }
      50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.6); }
    }
    .animate-shimmer {
      background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    .animate-glow {
      animation: glow 2s ease-in-out infinite;
    }
    .glass {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    }
    .glass-darker {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.25);
    }
    .glass-purple {
      background: rgba(139, 92, 246, 0.1);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(139, 92, 246, 0.2);
      box-shadow: 0 8px 32px 0 rgba(139, 92, 246, 0.2);
    }
    .glass-pink {
      background: rgba(236, 72, 153, 0.1);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(236, 72, 153, 0.2);
      box-shadow: 0 8px 32px 0 rgba(236, 72, 153, 0.2);
    }
    .gradient-text {
      background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .gradient-text-blue {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .gradient-text-green {
      background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .gradient-bg-purple {
      background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #9333ea 100%);
    }
    .gradient-bg-pink {
      background: linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #be185d 100%);
    }
    .gradient-bg-blue {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%);
    }
    .gradient-bg-green {
      background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%);
    }
    .gradient-bg-orange {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%);
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      transition: opacity 0.15s ease-out;
      will-change: opacity;
      z-index: 9999;
    }
    .modal-content-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      z-index: 10000;
      pointer-events: none;
    }
    .modal-content-wrapper > * {
      pointer-events: auto;
    }
    .modal-backdrop-enter {
      opacity: 0;
    }
    .modal-backdrop-enter-active {
      opacity: 1;
    }
    .modal-backdrop-exit {
      opacity: 1;
    }
    .modal-backdrop-exit-active {
      opacity: 0;
    }
  `}</style>
);
interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}
const ToastContext = React.createContext<{
  addToast: (message: string, type: "success" | "error" | "info") => void;
}>({
  addToast: () => { },
});
const useToast = () => React.useContext(ToastContext);
const ToastNotification = ({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: () => void;
  key?: string;
}) => {
  useEffect(() => {
    const timer = setTimeout(onRemove, 3000);
    return () => clearTimeout(timer);
  }, [onRemove]);
  const bgColor = {
    success: "from-emerald-600 to-emerald-700",
    error: "from-red-600 to-red-700",
    info: "from-blue-600 to-blue-700",
  }[toast.type];
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-lg shadow-xl p-4 min-w-[300px]`}
      role="alert"
    >
      <div className={`flex items-center gap-3`}>
        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${bgColor}`} />
        <p className="text-white font-semibold">{toast.message}</p>
      </div>
    </motion.div>
  );
};
const Skeleton = ({
  className = "",
  lines = 1,
}: {
  className?: string;
  lines?: number;
}) => (
  <div className={className}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`h-4 bg-slate-700/50 rounded animate-shimmer ${i > 0 ? "mt-2" : ""
          } ${i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"}`}
      />
    ))}
  </div>
);
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <div key="confirmation-backdrop" className="modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div key="confirmation-content-wrapper" className="modal-content-wrapper">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="glass rounded-xl shadow-2xl p-6 max-w-md w-full"
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <h3 id="modal-title" className="text-xl font-bold text-white mb-2">
            {title}
          </h3>
          <p id="modal-description" className="text-slate-200 mb-6 leading-relaxed">
            {message}
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all hover:shadow-lg cursor-pointer"
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
const EmptyState = ({
  icon: Icon,
  title,
  message,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  message: string;
  action?: { label: string; onClick: () => void };
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fadeIn">
    <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-slate-400" />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-400 mb-6 max-w-sm">{message}</p>
    {action && (
      <button
        onClick={action.onClick}
        className="px-4 py-2 rounded-lg glass border border-blue-500/50 hover:border-blue-400/70 text-white font-medium transition-all hover:shadow-lg cursor-pointer"
      >
        {action.label}
      </button>
    )}
  </div>
);
const Header = React.memo(
  ({
    user,
    onLogout,
    onMenuToggle,
    isMobileMenuOpen,
    activeTab,
  }: {
    user: User | null;
    onLogout: () => void;
    onMenuToggle: () => void;
    isMobileMenuOpen: boolean;
    activeTab: string;
  }) => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const timerRef = useRef<number | null>(null);
    const handleMouseEnter = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setDropdownVisible(true);
    };
    const handleMouseLeave = () => {
      timerRef.current = window.setTimeout(() => {
        setDropdownVisible(false);
      }, 300);
    };
    return (
      <header className="sticky top-0 z-40 glass border-b border-white/10">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 gradient-bg-purple text-white px-4 py-2 rounded-md"
        >
          Skip to main content
        </a>
        <div className="px-4 md:px-6 py-4 flex items-center justify-between min-w-0">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <IconX className="w-6 h-6 text-white" />
              ) : (
                <IconMenu className="w-6 h-6 text-white" />
              )}
            </button>
            <h1 className="font-bold text-lg md:text-xl text-white truncate flex-1 min-w-0">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "bookings" && "Booking History"}
              {activeTab === "subscription" && "Subscription"}
              {activeTab === "calendar" && "Calendar"}
              {activeTab === "referrals" && "Referrals"}
            </h1>
          </div>
          <div
            className="relative flex-shrink-0 ml-3"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className="w-10 h-10 gradient-bg-purple rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
              aria-label="User menu"
              aria-expanded={isDropdownVisible}
            >
              {user?.initials || "U"}
            </button>
            {isDropdownVisible && (
              <div className="absolute right-0 top-full mt-3 w-56 max-w-[calc(100vw-2rem)] bg-slate-800/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl animate-fadeIn z-50 overflow-hidden">
                <div className="px-5 py-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 gradient-bg-purple rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {user?.initials || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white truncate text-base">
                        {user?.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-100 truncate pl-11">
                    {user?.email}
                  </div>
                </div>
                <div className="p-2">
                  <button
                    onClick={onLogout}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-500/20 hover:border-red-500/30 rounded-xl transition-all duration-200 hover:shadow-lg cursor-pointer group border border-transparent"
                  >
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="group-hover:text-red-400 transition-colors">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  },
);
const Sidebar = ({
  activeTab,
  onTabClick,
  isMobileMenuOpen,
  onMobileMenuClose,
}: {
  activeTab: string;
  onTabClick: (tab: string) => void;
  isMobileMenuOpen: boolean;
  onMobileMenuClose: () => void;
}) => {
  const sidebarItems = [
    { id: "dashboard", icon: IconHome, label: "Dashboard" },
    { id: "bookings", icon: IconHistory, label: "Booking History" },
    { id: "subscription", icon: IconCreditCard, label: "Subscription" },
    { id: "calendar", icon: IconCalendar, label: "Calendar" },
    { id: "referrals", icon: IconGift, label: "Referrals" },
  ];
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);
  const handleTabClick = (tabId: string) => {
    onTabClick(tabId);
    if (isMobileMenuOpen) {
      onMobileMenuClose();
    }
  };
  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998] md:hidden"
          onClick={onMobileMenuClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`
          fixed inset-y-0 left-0 z-[9999] w-64 p-4
          glass-darker border-r border-white/10
          transition-transform duration-300 ease-in-out
          overflow-hidden
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between mb-6 pl-2">
          <div>
            <h1 className="font-bold text-3xl xl:text-4xl text-white leading-tight">
              <span className="gradient-text">FitStudio</span>
            </h1>
            <p className="text-sm font-medium text-slate-300 mt-1 tracking-wide">Members Portal</p>
          </div>
          <button
            onClick={onMobileMenuClose}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer ml-6"
            aria-label="Close menu"
          >
            <IconX className="w-6 h-6 text-white" />
          </button>
        </div>
        <nav className="space-y-2">
          {sidebarItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 min-h-[48px] cursor-pointer ${activeTab === item.id
                ? "gradient-bg-purple text-white shadow-lg animate-glow"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              aria-current={activeTab === item.id ? "page" : undefined}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};
const ToggleSwitch = ({
  enabled,
  onChange,
  disabled = false,
  label,
}: {
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
  label?: string;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    aria-label={label}
    onClick={onChange}
    disabled={disabled}
    className={`${enabled ? "gradient-bg-purple" : "bg-white/20"} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 ease-in-out hover:shadow-md ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
  >
    <span
      aria-hidden="true"
      className={`${enabled ? "translate-x-5" : "translate-x-0"} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out`}
    />
  </button>
);
const Dashboard = React.memo(
  ({
    usageData,
    isAutoRenewalOn,
    isSubscriptionFrozen,
    totalReferralCredits,
    renewalDate,
    isLoading = false,
  }: {
    usageData: UsageData;
    isAutoRenewalOn: boolean;
    isSubscriptionFrozen: boolean;
    totalReferralCredits: number;
    renewalDate: Date;
    isLoading?: boolean;
  }) => {
    const remainingCredits = usageData.classesTotal - usageData.classesUsed;
    return (
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div
          variants={fadeInVariants}
          className="relative rounded-2xl overflow-hidden h-48 md:h-64"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/80 to-slate-900/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3 drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)' }}>
              Welcome back! <IconTrophy className="w-8 h-8 text-blue-400 drop-shadow-lg" />
            </h1>
            <p className="text-lg text-white drop-shadow-md" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.5)' }}>
              You have{" "}
              <span className="font-bold text-blue-300 drop-shadow-sm">
                {remainingCredits}
              </span>{" "}
              classes remaining this month
            </p>
          </div>
        </motion.div>
        <motion.div
          variants={fadeInVariants}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Your Credits</h2>
            <div className="w-8 h-8 rounded-full glass flex items-center justify-center">
              <IconCreditCard className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="group glass-purple rounded-xl p-4 sm:p-6 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.02]">
              {isLoading ? (
                <Skeleton lines={3} />
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                      <p className="text-sm font-bold text-white">
                        Remaining Credits
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300">
                      <IconCreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
                      {remainingCredits}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-full bg-slate-700/30 rounded-full h-1">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                          style={{ width: `${(remainingCredits / usageData.classesTotal) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-300 font-semibold whitespace-nowrap">
                        {usageData.classesTotal} total
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="group glass-pink rounded-xl p-4 sm:p-6 border border-pink-500/30 hover:border-pink-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20 hover:scale-[1.02]">
              {isLoading ? (
                <Skeleton lines={3} />
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                      <p className="text-sm font-bold text-white">
                        Referral Credits
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-pink-600 to-pink-700 flex items-center justify-center shadow-lg group-hover:shadow-pink-500/30 transition-all duration-300">
                      <IconGift className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-pink-300 bg-clip-text text-transparent">
                      {totalReferralCredits}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <IconFireworks className="w-4 h-4 text-pink-400" />
                      <span className="text-xs text-slate-300 font-medium">
                        earned from friends
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="group glass rounded-xl p-4 sm:p-6 border border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-[1.02]">
              {isLoading ? (
                <Skeleton lines={3} />
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <p className="text-sm font-bold text-white">
                        Next Renewal
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                      <IconCalendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">
                      {renewalDate.toLocaleDateString("default", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <div className="flex items-center gap-2">
                      {isSubscriptionFrozen ? (
                        <>
                          <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                          <p className="text-sm text-yellow-400 font-medium">
                            Subscription Frozen
                          </p>
                        </>
                      ) : (
                        <>
                          <div className={`w-2 h-2 rounded-full animate-pulse ${isAutoRenewalOn ? "bg-emerald-500" : "bg-red-500"}`} />
                          <p className={`text-sm font-medium ${isAutoRenewalOn ? "text-emerald-400" : "text-red-400"}`}>
                            Auto-renewal {isAutoRenewalOn ? "ON" : "OFF"}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
        <motion.div
          variants={fadeInVariants}
          className="glass rounded-xl p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white">Benefits Usage</h2>
            <div className="w-8 h-8 rounded-full glass flex items-center justify-center">
              <IconTrophy className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton lines={2} />
              <Skeleton lines={2} />
              <Skeleton lines={2} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="group">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    <span className="text-white font-bold">Classes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-lg">
                      {usageData.classesUsed}
                    </span>
                    <span className="text-slate-300 text-sm">/ {usageData.classesTotal}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-700/30 rounded-full h-2 overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
                    style={{ width: `${(usageData.classesUsed / usageData.classesTotal) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-200 font-semibold">
                  {Math.round((usageData.classesUsed / usageData.classesTotal) * 100)}% used
                </div>
              </div>
              <div className="group">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                    <span className="text-white font-bold">Guest Passes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-lg">
                      {usageData.guestPassesUsed}
                    </span>
                    <span className="text-slate-300 text-sm">/ {usageData.guestPassesTotal}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-700/30 rounded-full h-2 overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg"
                    style={{ width: `${(usageData.guestPassesUsed / usageData.guestPassesTotal) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-200 font-semibold">
                  {Math.round((usageData.guestPassesUsed / usageData.guestPassesTotal) * 100)}% used
                </div>
              </div>
              <div className="group">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-white font-bold">Workshops</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-lg">
                      {usageData.workshopsAttended}
                    </span>
                    <span className="text-slate-300 text-sm">/ {usageData.workshopsTotal}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-700/30 rounded-full h-2 overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg"
                    style={{ width: `${(usageData.workshopsAttended / usageData.workshopsTotal) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-200 font-semibold">
                  {Math.round((usageData.workshopsAttended / usageData.workshopsTotal) * 100)}% used
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    );
  },
);
const BookingHistory = React.memo(
  ({ bookings }: { bookings: ClassBooking[] }) => {
    const completedBookings = bookings.filter((b) => b.status === "completed");
    const upcomingBookings = bookings.filter((b) => b.status === "upcoming");
    const cancelledBookings = bookings.filter((b) => b.status === "cancelled");
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-fadeIn">
          <div className="group glass rounded-xl p-4 sm:p-5 border border-emerald-500/30 hover:border-emerald-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-sm font-bold text-white">Completed</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-300">
                <IconCheck className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent mb-1">
              {completedBookings.length}
            </p>
            <p className="text-xs text-slate-200 font-semibold">classes attended</p>
          </div>
          <div className="group glass rounded-xl p-4 sm:p-5 border border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <p className="text-sm font-bold text-white">Upcoming</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                <IconCalendar className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-1">
              {upcomingBookings.length}
            </p>
            <p className="text-xs text-slate-200 font-semibold">classes scheduled</p>
          </div>
          <div className="group glass rounded-xl p-4 sm:p-5 border border-red-500/30 hover:border-red-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-sm font-bold text-white">Cancelled</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                <IconCancelled className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent mb-1">
              {cancelledBookings.length}
            </p>
            <p className="text-xs text-slate-200 font-semibold">classes cancelled</p>
          </div>
        </div>
        <div
          className="glass rounded-xl p-4 sm:p-6 animate-fadeIn"
          style={{ animationDelay: "100ms" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white">All Bookings</h2>
            <div className="text-sm text-slate-300">
              {bookings.length} total booking{bookings.length !== 1 ? 's' : ''}
            </div>
          </div>
          {bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.map((booking, index) => {
                const statusConfig = {
                  completed: {
                    bgGradient: 'from-emerald-600/20 via-emerald-500/10 to-transparent',
                    border: 'border-emerald-500/30 hover:border-emerald-400/60',
                    shadow: 'hover:shadow-emerald-500/20',
                    iconBg: 'from-emerald-600 to-emerald-700',
                    iconShadow: 'group-hover:shadow-emerald-500/30',
                    dot: 'bg-emerald-500',
                    statusBg: 'from-emerald-600/20 to-emerald-700/20',
                    statusText: 'text-emerald-400',
                    statusBorder: 'border-emerald-500/30',
                    statusDot: 'bg-emerald-400',
                    blurOrb: 'from-emerald-500/20 to-green-500/20'
                  },
                  upcoming: {
                    bgGradient: 'from-blue-600/20 via-blue-500/10 to-transparent',
                    border: 'border-blue-500/30 hover:border-blue-400/60',
                    shadow: 'hover:shadow-blue-500/20',
                    iconBg: 'from-blue-600 to-blue-700',
                    iconShadow: 'group-hover:shadow-blue-500/30',
                    dot: 'bg-blue-500',
                    statusBg: 'from-blue-600/20 to-blue-700/20',
                    statusText: 'text-blue-400',
                    statusBorder: 'border-blue-500/30',
                    statusDot: 'bg-blue-400 animate-pulse',
                    blurOrb: 'from-blue-500/20 to-cyan-500/20'
                  },
                  cancelled: {
                    bgGradient: 'from-red-600/20 via-red-500/10 to-transparent',
                    border: 'border-red-500/30 hover:border-red-400/60',
                    shadow: 'hover:shadow-red-500/20',
                    iconBg: 'from-red-600 to-red-700',
                    iconShadow: 'group-hover:shadow-red-500/30',
                    dot: 'bg-red-500',
                    statusBg: 'from-red-600/20 to-red-700/20',
                    statusText: 'text-red-400',
                    statusBorder: 'border-red-500/30',
                    statusDot: 'bg-red-400',
                    blurOrb: 'from-red-500/20 to-rose-500/20'
                  }
                };
                const config = statusConfig[booking.status];
                return (
                  <div
                    key={booking.id}
                    className={`group glass rounded-xl p-4 sm:p-6 border ${config.border} transition-all duration-300 hover:shadow-xl ${config.shadow} hover:scale-[1.01] animate-fadeIn`}
                    style={{ animationDelay: `${index * 50 + 200}ms` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${config.iconBg} flex items-center justify-center shadow-lg ${config.iconShadow} transition-all duration-300 flex-shrink-0`}>
                            <IconHistory className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
                              <h3 className="font-bold text-white text-base sm:text-lg">
                                {booking.className}
                              </h3>
                            </div>
                            <p className="text-sm text-slate-200 mb-1 flex items-center gap-2">
                              <IconUser className="w-4 h-4 text-slate-300" />
                              with {booking.instructor}
                            </p>
                            <p className="text-sm text-slate-300 flex items-center gap-2">
                              <IconCalendar className="w-4 h-4 text-slate-400" />
                              {booking.dateTime.toLocaleDateString("default", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}{" "}
                              at{" "}
                              {booking.dateTime.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`px-4 py-2 text-sm font-medium rounded-full inline-flex items-center gap-2 bg-gradient-to-r ${config.statusBg} ${config.statusText} border ${config.statusBorder}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${config.statusDot}`} />
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={IconHistory}
              title="No bookings yet"
              message="Start your fitness journey by booking your first class!"
              action={{
                label: "Browse Classes",
                onClick: () => console.log("Browse classes"),
              }}
            />
          )}
        </div>
      </div>
    );
  },
);
const Subscription = ({
  currentPlanId,
  plans,
  onPlanChange,
  isAutoRenewalOn,
  onToggleAutoRenewal,
  isSubscriptionFrozen,
  onToggleFreeze,
}: {
  currentPlanId: number;
  plans: SubscriptionPlan[];
  onPlanChange: (id: number) => void;
  isAutoRenewalOn: boolean;
  onToggleAutoRenewal: () => void;
  isSubscriptionFrozen: boolean;
  onToggleFreeze: () => void;
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { addToast } = useToast();
  const handlePlanSelect = (planId: number) => {
    if (planId !== currentPlanId) {
      setSelectedPlanId(planId);
      setShowConfirmModal(true);
    }
  };
  const confirmPlanChange = () => {
    if (selectedPlanId) {
      onPlanChange(selectedPlanId);
      const plan = plans.find((p) => p.planId === selectedPlanId);
      addToast(`Successfully changed to ${plan?.name}`, "success");
      setShowConfirmModal(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-4 sm:p-6 animate-fadeIn">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
          Subscription Settings
        </h2>
        <div className="space-y-4">
          <div
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 p-3 sm:p-4 glass rounded-lg border border-white/10 transition-all ${isSubscriptionFrozen ? "opacity-60" : "hover:border-purple-500/50"}`}
          >
            <div className="flex-1">
              <h3
                className={`font-semibold transition-colors ${isSubscriptionFrozen ? "text-slate-500" : "text-white"}`}
              >
                Auto-Renewal
              </h3>
              <p className="text-sm text-slate-200 mt-1">
                {isSubscriptionFrozen
                  ? "Disabled while membership is frozen"
                  : "Your plan will renew automatically"}
              </p>
            </div>
            <ToggleSwitch
              enabled={isAutoRenewalOn}
              onChange={onToggleAutoRenewal}
              disabled={isSubscriptionFrozen}
              label="Toggle auto-renewal"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 p-3 sm:p-4 glass rounded-lg border border-white/10 hover:border-amber-500/50 transition-all">
            <div className="flex-1">
              <h3 className="font-semibold text-white">Freeze Subscription</h3>
              <p className="text-sm text-slate-200 mt-1">
                {isSubscriptionFrozen
                  ? "Your subscription is currently frozen"
                  : "Temporarily pause your plan"}
              </p>
            </div>
            <ToggleSwitch
              enabled={isSubscriptionFrozen}
              onChange={onToggleFreeze}
              label="Toggle membership freeze"
            />
          </div>
        </div>
      </div>
      <div
        className="glass rounded-xl p-4 sm:p-6 animate-fadeIn"
        style={{ animationDelay: "100ms" }}
      >
        <h2 className="text-lg sm:text-xl font-bold text-white mb-6">
          Change Subscription Plan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {plans.map((plan, index) => {
            const isCurrentPlan = currentPlanId === plan.planId;
            return (
              <div
                key={plan.planId}
                className={`relative p-4 sm:p-6 rounded-xl border-2 transition-all transform hover:scale-[1.02] animate-fadeIn ${isCurrentPlan
                  ? "border-purple-500 glass-purple shadow-lg shadow-purple-500/20"
                  : "border-white/10 glass hover:border-purple-500/50"
                  }`}
                style={{ animationDelay: `${index * 100 + 200}ms` }}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4">
                    <span className="px-3 py-1 gradient-bg-purple text-white text-xs font-semibold rounded-full">
                      CURRENT
                    </span>
                  </div>
                )}
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text">
                    ${plan.price}
                  </span>
                  <span className="text-sm font-normal text-slate-200">
                    /month
                  </span>
                </div>
                <ul className="space-y-3 mb-6 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="w-5 h-5 rounded-full gradient-bg-green flex items-center justify-center flex-shrink-0 mt-0.5">
                        <IconCheck className="w-3 h-3 text-white" />
                      </div>
                      <span className="ml-3 text-slate-100">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePlanSelect(plan.planId)}
                  disabled={isCurrentPlan}
                  className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${isCurrentPlan
                    ? "bg-white/20 text-slate-300 cursor-not-allowed"
                    : "gradient-bg-purple text-white hover:shadow-lg cursor-pointer"
                    }`}
                >
                  {isCurrentPlan ? "Current Plan" : "Select Plan"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmPlanChange}
        title="Change Subscription Plan"
        message={`Are you sure you want to change to the ${plans.find((p) => p.planId === selectedPlanId)?.name} plan? The remaining amount would be charged or credited (if you are downgrading) from your credit system through our payment app.`}
        confirmText="Change Plan"
      />
    </div>
  );
};
const CalendarView = React.memo(
  ({
    bookings,
    renewalDate,
    onBookClass,
    remainingCredits,
    isAutoRenewalOn,
    isSubscriptionFrozen,
  }: {
    bookings: ClassBooking[];
    renewalDate: Date;
    onBookClass: (classId: string, dateTime: Date) => void;
    remainingCredits: number;
    isAutoRenewalOn: boolean;
    isSubscriptionFrozen: boolean;
  }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
    const [showClassModal, setShowClassModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState<AvailableClass | null>(null);
    const [showBookingConfirm, setShowBookingConfirm] = useState(false);
    useEffect(() => {
      if (showClassModal || showBookingConfirm) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [showClassModal, showBookingConfirm]);
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    ).getDate();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    ).getDay();
    const changeMonth = (amount: number) => {
      setCurrentDate((prev) => {
        const newDate = new Date(prev);
        newDate.setMonth(prev.getMonth() + amount);
        return newDate;
      });
    };
    const dayHasEvent = (day: number) => {
      return bookings.some(
        (b) =>
          b.dateTime.getFullYear() === currentDate.getFullYear() &&
          b.dateTime.getMonth() === currentDate.getMonth() &&
          b.dateTime.getDate() === day,
      );
    };
    const isRenewalDay = (day: number) => {
      return (
        renewalDate.getFullYear() === currentDate.getFullYear() &&
        renewalDate.getMonth() === currentDate.getMonth() &&
        renewalDate.getDate() === day
      );
    };
    const selectedDayEvents = useMemo(() => {
      if (!selectedDay) return [];
      return bookings.filter(
        (b) =>
          b.dateTime.getFullYear() === selectedDay.getFullYear() &&
          b.dateTime.getMonth() === selectedDay.getMonth() &&
          b.dateTime.getDate() === selectedDay.getDate(),
      );
    }, [selectedDay, bookings]);
    const touchStartX = useRef<number | null>(null);
    const availableClasses: AvailableClass[] = [
      {
        id: "class-1",
        className: "Morning Yoga Flow",
        instructor: "Sarah Johnson",
        time: "07:00",
        duration: 60,
        spotsAvailable: 8,
        totalSpots: 15,
        level: "Beginner",
        category: "Yoga",
      },
      {
        id: "class-2",
        className: "HIIT Bootcamp",
        instructor: "Mike Chen",
        time: "09:00",
        duration: 45,
        spotsAvailable: 3,
        totalSpots: 20,
        level: "Intermediate",
        category: "HIIT",
      },
      {
        id: "class-3",
        className: "Power Pilates",
        instructor: "Emma Wilson",
        time: "12:00",
        duration: 50,
        spotsAvailable: 12,
        totalSpots: 18,
        level: "Intermediate",
        category: "Pilates",
      },
      {
        id: "class-4",
        className: "Strength Training",
        instructor: "David Lee",
        time: "17:30",
        duration: 60,
        spotsAvailable: 5,
        totalSpots: 12,
        level: "Advanced",
        category: "Strength",
      },
      {
        id: "class-5",
        className: "Evening Yoga",
        instructor: "Sarah Johnson",
        time: "19:00",
        duration: 75,
        spotsAvailable: 10,
        totalSpots: 15,
        level: "Beginner",
        category: "Yoga",
      },
    ];
    const handleTouchStart = (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
      if (!touchStartX.current) return;
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX.current - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          changeMonth(1);
        } else {
          changeMonth(-1);
        }
      }
      touchStartX.current = null;
    };
    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div
            className="lg:col-span-2 glass rounded-xl p-4 md:p-6 animate-fadeIn"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => changeMonth(-1)}
                className="p-2 md:p-3 rounded-lg hover:bg-slate-700/50 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Previous month"
              >
                <IconChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg md:text-xl font-bold text-white text-center">
                {currentDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <button
                onClick={() => changeMonth(1)}
                className="p-2 md:p-3 rounded-lg hover:bg-slate-700/50 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Next month"
              >
                <IconChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-400 mb-3">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayDate = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day,
                );
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                dayDate.setHours(0, 0, 0, 0);
                const isSelected =
                  selectedDay?.getDate() === day &&
                  selectedDay?.getMonth() === currentDate.getMonth();
                const hasEvent = dayHasEvent(day);
                const isRenewal = isRenewalDay(day);
                const isToday = dayDate.getTime() === today.getTime();
                const isPastDate = dayDate.getTime() < today.getTime();
                const expiryDate = new Date(renewalDate);
                expiryDate.setHours(0, 0, 0, 0);
                const isBeyondExpiry = dayDate.getTime() > expiryDate.getTime() && !isAutoRenewalOn;
                return (
                  <button
                    key={day}
                    onClick={() => {
                      if (isPastDate || isBeyondExpiry) return;
                      setSelectedDay(isSelected ? null : dayDate);
                    }}
                    disabled={isPastDate || isBeyondExpiry}
                    className={`
                  aspect-square rounded-lg flex flex-col items-center justify-center relative
                  transition-all duration-200 min-h-[44px] text-sm md:text-base
                  ${isPastDate
                        ? "text-slate-600 cursor-not-allowed opacity-50"
                        : isBeyondExpiry
                          ? "text-red-400 cursor-not-allowed opacity-60 border border-red-500/30"
                          : isSelected
                            ? "glass border border-blue-500/50 text-white shadow-lg scale-105"
                            : isToday
                              ? "bg-slate-700/50 text-white border border-blue-500/50"
                              : "hover:bg-slate-700/50 text-slate-300 cursor-pointer"
                      }
                `}
                    aria-label={`${day} ${currentDate.toLocaleString("default", { month: "long" })}${isPastDate
                      ? " (past date)"
                      : isBeyondExpiry
                        ? " (subscription expired)"
                        : ""
                      }`}
                    aria-current={isSelected ? "date" : undefined}
                  >
                    <span className="font-medium">{day}</span>
                    {(hasEvent || isRenewal) && (
                      <div className="absolute bottom-1 flex gap-0.5">
                        {hasEvent && (
                          <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-emerald-500 animate-pulse shadow-lg" />
                        )}
                        {isRenewal && (
                          <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-red-500 animate-pulse shadow-lg" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div
            className="lg:col-span-1 glass rounded-xl p-4 md:p-6 animate-fadeIn"
            style={{ animationDelay: "100ms" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-lg">
                {selectedDay
                  ? selectedDay.toLocaleDateString("default", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })
                  : "Select a day"}
              </h3>
              {selectedDay && selectedDayEvents.length > 0 && (() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const selectedDate = new Date(selectedDay);
                selectedDate.setHours(0, 0, 0, 0);
                const isPastDate = selectedDate.getTime() < today.getTime();
                const expiryDate = new Date(renewalDate);
                expiryDate.setHours(0, 0, 0, 0);
                const isBeyondExpiry = selectedDate.getTime() > expiryDate.getTime() && !isAutoRenewalOn;
                return !isPastDate ? (
                  isSubscriptionFrozen ? (
                    <div className="px-4 py-2 text-sm font-semibold rounded-lg glass border border-yellow-500/50 text-yellow-400">
                      Subscription Frozen
                    </div>
                  ) : isBeyondExpiry ? (
                    <div className="px-4 py-2 text-sm font-semibold rounded-lg glass border border-red-500/50 text-red-400">
                      Subscription Expired
                    </div>
                  ) : remainingCredits > 0 ? (
                    <button
                      onClick={() => setShowClassModal(true)}
                      className="px-4 py-2 text-sm font-semibold rounded-lg glass border border-blue-500/50 hover:border-blue-400/70 text-white transition-all hover:shadow-lg cursor-pointer"
                    >
                      Book a Class
                    </button>
                  ) : (
                    <div className="px-4 py-2 text-sm font-semibold rounded-lg glass border border-red-500/50 text-red-400">
                      No Credits
                    </div>
                  )
                ) : null;
              })()}
            </div>
            <div className="space-y-3">
              {selectedDay && isRenewalDay(selectedDay.getDate()) && (
                <div className="p-3 glass rounded-lg border border-red-500/30 animate-fadeIn">
                  <p className="text-red-400 font-medium text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Subscription Expiring
                  </p>
                </div>
              )}
              {selectedDay && selectedDayEvents.length > 0 ? (
                selectedDayEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className="group glass p-5 rounded-xl border border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:scale-[1.02] animate-fadeIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                          <h4 className="font-bold text-white text-lg">
                            {event.className}
                          </h4>
                        </div>
                        <p className="text-sm text-slate-300 mb-1 flex items-center gap-2">
                          <IconHistory className="w-4 h-4 text-blue-400" />
                          {event.dateTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-sm text-slate-400 flex items-center gap-2">
                          <IconUser className="w-4 h-4 text-slate-500" />
                          with {event.instructor}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl glass border border-blue-500/50 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300 flex-shrink-0">
                        <IconCalendar className="w-5 h-5 text-blue-400" />
                      </div>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${event.status === 'completed'
                      ? 'bg-gradient-to-r from-emerald-600/20 to-emerald-700/20 text-emerald-400 border border-emerald-500/30'
                      : event.status === 'upcoming'
                        ? 'bg-gradient-to-r from-blue-600/20 to-blue-700/20 text-blue-400 border border-blue-500/30'
                        : 'bg-gradient-to-r from-red-600/20 to-red-700/20 text-red-400 border border-red-500/30'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${event.status === 'completed'
                        ? 'bg-emerald-400'
                        : event.status === 'upcoming'
                          ? 'bg-blue-400 animate-pulse'
                          : 'bg-red-400'
                        }`} />
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </div>
                  </div>
                ))
              ) : selectedDay ? (
                (() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const selectedDate = new Date(selectedDay);
                  selectedDate.setHours(0, 0, 0, 0);
                  const isPastDate = selectedDate.getTime() < today.getTime();
                  const expiryDate = new Date(renewalDate);
                  expiryDate.setHours(0, 0, 0, 0);
                  const isBeyondExpiry = selectedDate.getTime() > expiryDate.getTime() && !isAutoRenewalOn;
                  return (
                    <EmptyState
                      icon={IconCalendar}
                      title="No events"
                      message={
                        isPastDate
                          ? "No classes were scheduled for this past date."
                          : isBeyondExpiry
                            ? "No classes scheduled for this day. This date is beyond your subscription expiry date."
                            : remainingCredits <= 0
                              ? "No classes scheduled for this day. You have no remaining credits to book new classes. Please upgrade your membership plan."
                              : "No classes scheduled for this day."
                      }
                      action={!isPastDate && remainingCredits > 0 ? {
                        label: "Book a Class",
                        onClick: () => setShowClassModal(true),
                      } : undefined}
                    />
                  );
                })()
              ) : (
                <div className="text-center py-8">
                  <IconCalendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">
                    Select a day to view events
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {showClassModal && selectedDay && (() => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const selectedDate = new Date(selectedDay);
          selectedDate.setHours(0, 0, 0, 0);
          const isPastDate = selectedDate.getTime() < today.getTime();
          if (isPastDate) {
            setShowClassModal(false);
            return null;
          }
          return (
            <AnimatePresence>
              <div key="modal-backdrop" className="modal-backdrop" onClick={() => setShowClassModal(false)} aria-hidden="true" />
              <div key="modal-content-wrapper" className="modal-content-wrapper">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="glass rounded-xl shadow-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl sm:text-2xl font-bold text-white">Available Classes</h2>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        {selectedDay.toLocaleDateString("default", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      {remainingCredits <= 0 && (
                        <div className="mt-2 sm:mt-3 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-500/20 border border-red-500/50 rounded-lg">
                          <p className="text-red-400 text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
                            <IconX className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate">No remaining credits - Upgrade your membership to book classes</span>
                          </p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setShowClassModal(false)}
                      className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer flex-shrink-0 ml-2"
                      aria-label="Close modal"
                    >
                      <IconX className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
                    </button>
                  </div>
                  <div className="space-y-3 overflow-y-auto max-h-[65vh] sm:max-h-[60vh] scrollbar-hide">
                    {availableClasses.map((cls, index) => {
                      const spotsPercentage = (cls.spotsAvailable / cls.totalSpots) * 100;
                      const isLowAvailability = spotsPercentage < 30;
                      return (
                        <div
                          key={cls.id}
                          className={`group glass rounded-xl p-3 sm:p-5 border transition-all duration-300 animate-fadeIn ${remainingCredits <= 0
                            ? "border-red-500/30 opacity-60 cursor-not-allowed"
                            : "border-slate-600/30 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/20 cursor-pointer"
                            }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                          onClick={() => {
                            if (remainingCredits <= 0) {
                              return;
                            }
                            setSelectedClass(cls);
                            setShowBookingConfirm(true);
                          }}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
                                <h3 className="font-bold text-white text-base sm:text-lg flex-1 min-w-0">{cls.className}</h3>
                                <span className={`px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-semibold rounded-full flex-shrink-0 ${cls.level === 'Beginner'
                                  ? 'bg-gradient-to-r from-emerald-600/20 to-emerald-700/20 text-emerald-400 border border-emerald-500/30'
                                  : cls.level === 'Intermediate'
                                    ? 'bg-gradient-to-r from-blue-600/20 to-blue-700/20 text-blue-400 border border-blue-500/30'
                                    : 'bg-gradient-to-r from-purple-600/20 to-purple-700/20 text-purple-400 border border-purple-500/30'
                                  }`}>
                                  {cls.level}
                                </span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-300 mb-3">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <IconUser className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                                  <span className="truncate">{cls.instructor}</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <IconHistory className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                                  <span>{cls.time}</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <IconCalendar className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                                  <span>{cls.duration} min</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between sm:block sm:text-right sm:flex-shrink-0 sm:ml-4 mt-2 sm:mt-0">
                              <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${isLowAvailability
                                ? 'bg-gradient-to-r from-amber-600/20 to-amber-700/20 text-amber-400 border border-amber-500/30'
                                : 'bg-gradient-to-r from-emerald-600/20 to-emerald-700/20 text-emerald-400 border border-emerald-500/30'
                                }`}>
                                <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${isLowAvailability ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
                                {cls.spotsAvailable} spots left
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 sm:mt-1 self-end sm:self-auto">
                                of {cls.totalSpots} total
                              </p>
                            </div>
                          </div>
                          <div className="w-full bg-slate-700/30 rounded-full h-1.5 overflow-hidden shadow-inner">
                            <div
                              className={`h-full rounded-full transition-all duration-500 relative overflow-hidden ${isLowAvailability ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-emerald-500 to-emerald-600'} shadow-lg`}
                              style={{ width: `${spotsPercentage}%` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                            </div>
                          </div>
                          {remainingCredits <= 0 && (
                            <div className="mt-2 sm:mt-3 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-500/20 border border-red-500/50 rounded-lg">
                              <p className="text-red-400 text-xs sm:text-sm font-medium text-center">
                                Insufficient credits - Upgrade membership
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </AnimatePresence>
          );
        })()}
        <ConfirmationModal
          isOpen={showBookingConfirm}
          onClose={() => {
            setShowBookingConfirm(false);
            setSelectedClass(null);
          }}
          onConfirm={() => {
            if (selectedClass && selectedDay) {
              const [hours, minutes] = selectedClass.time.split(':').map(Number);
              const classDateTime = new Date(selectedDay);
              classDateTime.setHours(hours, minutes, 0, 0);
              onBookClass(selectedClass.id, classDateTime);
              setShowClassModal(false);
              setSelectedClass(null);
            }
          }}
          title="Confirm Class Booking"
          message={`Would you like to book ${selectedClass?.className} with ${selectedClass?.instructor} at ${selectedClass?.time}?`}
          confirmText="Book Class"
        />
      </>
    );
  },
);
const Referrals = React.memo(
  ({
    referrals,
    onAddReferral,
    referralCode,
  }: {
    referrals: Referral[];
    onAddReferral: (name: string) => void;
    referralCode: string;
  }) => {
    const [referralName, setReferralName] = useState("");
    const [isCopied, setIsCopied] = useState(false);
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onAddReferral(referralName);
      setReferralName("");
    };
    const handleCopyCode = () => {
      navigator.clipboard.writeText(referralCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    };
    const totalCreditsEarned = referrals
      .filter((r) => r.status === "completed")
      .reduce((sum, r) => sum + r.creditsEarned, 0);
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-fadeIn">
          <div className="group glass-purple rounded-xl p-4 sm:p-5 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                <p className="text-sm font-bold text-white">
                  Total Referrals
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300">
                <IconUser className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent mb-1">
              {referrals.length}
            </p>
            <p className="text-xs text-slate-200 font-semibold">friends invited</p>
          </div>
          <div className="group glass-pink rounded-xl p-4 sm:p-5 border border-pink-500/30 hover:border-pink-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                <p className="text-sm font-bold text-white">
                  Credits Earned
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-pink-700 flex items-center justify-center shadow-lg group-hover:shadow-pink-500/30 transition-all duration-300">
                <IconGift className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent mb-1">
              {totalCreditsEarned}
            </p>
            <p className="text-xs text-slate-200 font-semibold">bonus credits</p>
          </div>
          <div className="group glass rounded-xl p-4 sm:p-5 border border-amber-500/30 hover:border-amber-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <p className="text-sm font-bold text-white">Pending</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shadow-lg group-hover:shadow-amber-500/30 transition-all duration-300">
                <IconHistory className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent mb-1">
              {referrals.filter((r) => r.status === "pending").length}
            </p>
            <p className="text-xs text-slate-200 font-semibold">awaiting activation</p>
          </div>
        </div>
        <div
          className="glass rounded-xl p-4 sm:p-6 animate-fadeIn"
          style={{ animationDelay: "100ms" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0 mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Share Your Code</h2>
              <p className="text-sm text-slate-300 mt-1 flex items-center gap-2">
                Earn 2 bonus credits for each friend who joins! <IconFireworks className="w-4 h-4 text-blue-400" />
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass flex items-center justify-center">
              <IconGift className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
          </div>
          <div className="glass-purple rounded-lg p-4 sm:p-5 border border-purple-500/30">
            <label className="text-sm font-medium text-slate-200 block mb-3">
              Your Unique Referral Code
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-grow px-3 sm:px-4 py-3 glass rounded-lg text-center min-h-[48px] flex items-center justify-center">
                <p className="font-mono text-lg sm:text-xl lg:text-2xl font-bold gradient-text tracking-[0.15em] sm:tracking-[0.25em]">
                  {referralCode}
                </p>
              </div>
              <button
                onClick={handleCopyCode}
                className={`px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-md transition-all flex items-center justify-center gap-2 min-h-[48px] cursor-pointer ${isCopied
                  ? "gradient-bg-green text-white"
                  : "gradient-bg-purple text-white hover:shadow-lg"
                  }`}
              >
                {isCopied ? (
                  <>
                    <IconCheck className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <IconCopy className="w-5 h-5" />
                    Copy Code
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        <div
          className="glass rounded-xl p-4 sm:p-6 animate-fadeIn"
          style={{ animationDelay: "200ms" }}
        >
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Your Referrals</h2>
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={referralName}
                onChange={(e) => setReferralName(e.target.value)}
                placeholder="Enter friend's name..."
                className="flex-grow p-3 glass rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                aria-label="Friend's name"
              />
              <button
                type="submit"
                disabled={!referralName.trim()}
                className="px-6 py-3 gradient-bg-purple text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] cursor-pointer"
              >
                Add Referral
              </button>
            </div>
          </form>
          {referrals.length > 0 ? (
            <div className="space-y-3">
              {referrals.map((ref, index) => {
                const isCompleted = ref.status === "completed";
                const config = isCompleted ? {
                  bgGradient: 'from-emerald-600/20 via-emerald-500/10 to-transparent',
                  border: 'border-emerald-500/30 hover:border-emerald-400/60',
                  shadow: 'hover:shadow-emerald-500/20',
                  iconBg: 'from-emerald-600 to-emerald-700',
                  iconShadow: 'group-hover:shadow-emerald-500/30',
                  dot: 'bg-emerald-500',
                  blurOrb: 'from-emerald-500/20 to-green-500/20'
                } : {
                  bgGradient: 'from-amber-600/20 via-amber-500/10 to-transparent',
                  border: 'border-amber-500/30 hover:border-amber-400/60',
                  shadow: 'hover:shadow-amber-500/20',
                  iconBg: 'from-amber-600 to-amber-700',
                  iconShadow: 'group-hover:shadow-amber-500/30',
                  dot: 'bg-amber-500',
                  blurOrb: 'from-amber-500/20 to-orange-500/20'
                };
                return (
                  <div
                    key={ref.id}
                    className={`group glass rounded-xl p-4 sm:p-5 border ${config.border} transition-all duration-300 hover:shadow-xl ${config.shadow} hover:scale-[1.01] animate-fadeIn`}
                    style={{ animationDelay: `${index * 50 + 300}ms` }}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="flex items-start gap-3 sm:gap-4 flex-1">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${config.iconBg} flex items-center justify-center shadow-lg ${config.iconShadow} transition-all duration-300 flex-shrink-0`}>
                          <IconUser className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
                            <h4 className="font-bold text-white text-base sm:text-lg">{ref.name}</h4>
                          </div>
                          <p className="text-sm text-slate-300 flex items-center gap-2">
                            <IconCalendar className="w-4 h-4 text-slate-400" />
                            Joined{" "}
                            {new Date(ref.joinDate).toLocaleDateString("default", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600/20 to-emerald-700/20 border border-emerald-500/30 rounded-full">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                            <span className="text-sm font-medium text-emerald-400">
                              +{ref.creditsEarned} Credits
                            </span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600/20 to-amber-700/20 border border-amber-500/30 rounded-full">
                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-amber-400">
                              Pending
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={IconGift}
              title="No referrals yet"
              message="Start inviting friends and earn bonus credits!"
              action={{
                label: "Share Your Code",
                onClick: handleCopyCode,
              }}
            />
          )}
        </div>
      </div>
    );
  },
);
const LoginView = ({ onLogin }: { onLogin: (name: string) => void }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (trimmedName === "") {
      setError("Please enter your name.");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters long.");
      return;
    }

    const validChars = /^[\p{L}\s\-'\.]+$/u;
    if (!validChars.test(trimmedName)) {
      setError("Name can only contain letters, spaces, hyphens, and apostrophes.");
      return;
    }

    const hasLetter = /\p{L}/u.test(trimmedName);
    if (!hasLetter) {
      setError("Please enter a valid name with at least one letter.");
      return;
    }

    const words = trimmedName.split(/\s+/).filter(word => word.length > 0);
    
    if (words.length < 2) {
      setError("Please enter both your first and last name.");
      return;
    }

    const allWordsValid = words.every(word => /\p{L}/u.test(word));
    if (!allWordsValid) {
      setError("Each part of your name must contain at least one letter.");
      return;
    }

    if (trimmedName.length > 50) {
      setError("Name is too long. Please use a shorter version.");
      return;
    }

    setError("");
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onLogin(trimmedName);
  };
  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-slate-900/85 to-black/90" />
      </div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/3 right-1/3 w-60 h-60 bg-purple-500/6 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md p-8 m-2 space-y-6 glass rounded-2xl shadow-2xl animate-fadeIn"
      >
        <div
          className="text-center animate-fadeIn"
          style={{ animationDelay: "100ms" }}
        >
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-white mb-2">
              <span className="gradient-text">FitStudio</span>
            </h1>
            <p className="text-lg text-slate-300 flex items-center gap-2 justify-center">
              Welcome back, champion! <IconTrophy className="w-6 h-6 text-blue-400" />
            </p>
          </div>
        </div>
        <div className="animate-fadeIn" style={{ animationDelay: "200ms" }}>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4">
              <IconUser className="w-5 h-5 text-slate-400" />
            </span>
            <input
              id="username"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="Enter your full name"
              className={`w-full pl-12 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-slate-400 transition-all duration-200 ${error
                ? "border-red-500 focus:ring-red-500"
                : "border-white/20 hover:border-white/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                }`}
              aria-describedby={error ? "name-error" : undefined}
            />
          </div>
          {error && (
            <p
              id="name-error"
              className="text-red-400 text-sm mt-2 animate-fadeIn flex items-center gap-2"
            >
              <span className="w-1 h-1 bg-red-400 rounded-full" />
              {error}
            </p>
          )}
        </div>
        <div className="animate-fadeIn" style={{ animationDelay: "300ms" }}>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 gradient-bg-purple text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <IconSpinner className="w-5 h-5" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPlanId, setCurrentPlanId] = useState(1);
  const [isAutoRenewalOn, setIsAutoRenewalOn] = useState(true);
  const [isSubscriptionFrozen, setIsSubscriptionFrozen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [bookings, setBookings] = useState<ClassBooking[]>([]);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [lastBookedClass, setLastBookedClass] = useState<ClassBooking | null>(null);
  useEffect(() => {
    if (showBookingSuccess) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showBookingSuccess]);
  const addToast = useCallback(
    (message: string, type: "success" | "error" | "info") => {
      const newToast: Toast = {
        id: Date.now().toString(),
        message,
        type,
      };
      setToasts((prev) => [...prev, newToast]);
    },
    [],
  );
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);
  const initialReferralsData = useMemo<Referral[]>(
    () => [
      {
        id: "1",
        name: "John Smith",
        joinDate: "2024-01-10",
        creditsEarned: 2,
        status: "completed",
      },
      {
        id: "2",
        name: "Lisa Chen",
        joinDate: "2024-01-15",
        creditsEarned: 0,
        status: "pending",
      },
    ],
    [],
  );
  const [referrals, setReferrals] = useState(initialReferralsData);
  const [usageData, setUsageData] = useState<UsageData>({
    classesUsed: 5,
    classesTotal: 0,
    guestPassesUsed: 1,
    guestPassesTotal: 0,
    workshopsAttended: 0,
    workshopsTotal: 0,
  });
  const plans = useMemo<SubscriptionPlan[]>(
    () => [
      {
        planId: 1,
        name: "Premium Monthly",
        creditsPerMonth: 12,
        guestPassesPerMonth: 2,
        workshopsPerMonth: 1,
        price: 149,
        features: [
          "12 classes/month",
          "Access to all locations",
          "2 guest passes/month",
          "Priority booking",
        ],
      },
      {
        planId: 2,
        name: "Unlimited Monthly",
        creditsPerMonth: 30,
        guestPassesPerMonth: 4,
        workshopsPerMonth: 2,
        price: 199,
        features: [
          "30 classes/month",
          "All Premium features",
          "4 guest passes/month",
          "Personal training discount",
        ],
      },
      {
        planId: 3,
        name: "Annual Premium",
        creditsPerMonth: 36,
        guestPassesPerMonth: 5,
        workshopsPerMonth: 4,
        price: 250,
        features: [
          "36 classes/month",
          "Access to all locations",
          "5 guest passes/month",
          "Exclusive workshops",
        ],
      },
    ],
    [],
  );
  const initialBookingHistory = useMemo<ClassBooking[]>(
    () => [
      {
        id: "1",
        className: "Power Yoga",
        instructor: "Sarah Johnson",
        dateTime: new Date("2025-06-01T09:00"),
        status: "completed",
      },
      {
        id: "2",
        className: "HIIT Training",
        instructor: "Mike Chen",
        dateTime: new Date("2025-06-03T18:00"),
        status: "completed",
      },
      {
        id: "3",
        className: "Pilates Core",
        instructor: "Emma Wilson",
        dateTime: new Date("2025-07-20T10:00"),
        status: "upcoming",
      },
      {
        id: "4",
        className: "Spin Class",
        instructor: "David Lee",
        dateTime: new Date("2025-07-18T17:30"),
        status: "upcoming",
      },
    ],
    [],
  );
  useEffect(() => {
    setBookings(initialBookingHistory);
  }, [initialBookingHistory]);
  const totalReferralCredits = useMemo(() => {
    return referrals.reduce((sum, ref) => sum + ref.creditsEarned, 0);
  }, [referrals]);
  const RENEWAL_DATE = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const renewalDate = new Date(currentYear, currentMonth, 20);
    if (today.getDate() > 20) {
      renewalDate.setMonth(currentMonth + 1);
    }
    return renewalDate;
  }, []);
  const REFERRAL_CODE = "FITNESS2025";
  useEffect(() => {
    const selectedPlan = plans.find((p) => p.planId === currentPlanId);
    if (selectedPlan) {
      setUsageData((prevUsage) => ({
        ...prevUsage,
        classesTotal: selectedPlan.creditsPerMonth,
        guestPassesTotal: selectedPlan.guestPassesPerMonth,
        workshopsTotal: selectedPlan.workshopsPerMonth,
      }));
    }
  }, [currentPlanId, plans]);
  const handleLogin = (userName: string) => {
    if (userName.trim()) {
      const initials = userName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
      setCurrentUser({
        name: userName,
        email: `${userName
          .split(" ")[0]
          .toLowerCase()
          .replace(/[^a-z0-9]/, "")}@fitstudio.com`,
        initials: initials,
      });
    }
  };
  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab("dashboard");
  };
  const handleToggleAutoRenewal = useCallback(() => {
    const newAutoRenewalState = !isAutoRenewalOn;
    setIsAutoRenewalOn(newAutoRenewalState);
    if (!newAutoRenewalState) {
      const expiryDate = new Date(RENEWAL_DATE);
      expiryDate.setHours(0, 0, 0, 0);
      const bookingsToCancel = bookings.filter(booking => {
        const bookingDate = new Date(booking.dateTime);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate.getTime() > expiryDate.getTime() && booking.status === "upcoming";
      });
      if (bookingsToCancel.length > 0) {
        setBookings(prev => prev.map(booking => {
          const bookingDate = new Date(booking.dateTime);
          bookingDate.setHours(0, 0, 0, 0);
          if (bookingDate.getTime() > expiryDate.getTime() && booking.status === "upcoming") {
            return { ...booking, status: "cancelled" as const };
          }
          return booking;
        }));
        setUsageData(prev => ({
          ...prev,
          classesUsed: Math.max(0, prev.classesUsed - bookingsToCancel.length)
        }));
        addToast(
          `Auto-renewal disabled. ${bookingsToCancel.length} future booking${bookingsToCancel.length > 1 ? 's' : ''} beyond ${RENEWAL_DATE.toLocaleDateString()} ${bookingsToCancel.length > 1 ? 'have' : 'has'} been cancelled and credits refunded.`,
          "info"
        );
      } else {
        addToast("Auto-renewal disabled", "success");
      }
    } else {
      addToast("Auto-renewal enabled", "success");
    }
  }, [isAutoRenewalOn, addToast, bookings, RENEWAL_DATE]);
  const handleToggleFreeze = useCallback(() => {
    const newFrozenState = !isSubscriptionFrozen;
    setIsSubscriptionFrozen(newFrozenState);
    if (newFrozenState) {
      if (isAutoRenewalOn) {
        setIsAutoRenewalOn(false);
      }
      const upcomingBookings = bookings.filter(booking => booking.status === "upcoming");
      if (upcomingBookings.length > 0) {
        setBookings(prev => prev.map(booking => {
          if (booking.status === "upcoming") {
            return { ...booking, status: "cancelled" as const };
          }
          return booking;
        }));
        setUsageData(prev => ({
          ...prev,
          classesUsed: Math.max(0, prev.classesUsed - upcomingBookings.length)
        }));
        addToast(
          `Subscription frozen. ${upcomingBookings.length} upcoming booking${upcomingBookings.length > 1 ? 's' : ''} ${upcomingBookings.length > 1 ? 'have' : 'has'} been cancelled and credits refunded.`,
          "info"
        );
      } else {
        addToast("Subscription frozen", "success");
      }
    } else {
      addToast("Subscription unfrozen", "success");
    }
  }, [isSubscriptionFrozen, isAutoRenewalOn, addToast, bookings]);
  const handleAddReferral = useCallback(
    (name: string) => {
      if (!name.trim()) return;
      const newReferral: Referral = {
        id: Date.now().toString(),
        name,
        joinDate: new Date().toISOString().split("T")[0],
        creditsEarned: 0,
        status: "pending",
      };
      setReferrals((prev) => [newReferral, ...prev]);
      addToast(`Referral added for ${name}`, "success");
    },
    [addToast],
  );
  const handleBookClass = useCallback(
    (classId: string, dateTime: Date) => {
      const remainingCredits = usageData.classesTotal - usageData.classesUsed;
      if (isSubscriptionFrozen) {
        addToast(
          "Cannot book classes while subscription is frozen. Please unfreeze your subscription first.",
          "error"
        );
        return;
      }
      const classDate = new Date(dateTime);
      classDate.setHours(0, 0, 0, 0);
      const expiryDate = new Date(RENEWAL_DATE);
      expiryDate.setHours(0, 0, 0, 0);
      console.log('Booking validation:', {
        classDate: classDate.toLocaleDateString(),
        expiryDate: expiryDate.toLocaleDateString(),
        isAutoRenewalOn,
        classDateTime: classDate.getTime(),
        expiryDateTime: expiryDate.getTime(),
        isAfterExpiry: classDate.getTime() > expiryDate.getTime()
      });
      if (classDate.getTime() > expiryDate.getTime() && !isAutoRenewalOn) {
        addToast(
          `Cannot book classes after ${expiryDate.toLocaleDateString()} as your subscription expires on ${RENEWAL_DATE.toLocaleDateString()}. Classes on the expiry date are allowed. Please renew your subscription or enable auto-renewal to book future classes.`,
          "error"
        );
        return;
      }
      if (remainingCredits <= 0) {
        addToast(
          "You have no remaining credits! Please upgrade your membership plan to continue booking classes.",
          "error"
        );
        return;
      }
      const availableClasses: AvailableClass[] = [
        {
          id: "class-1",
          className: "Morning Yoga Flow",
          instructor: "Sarah Johnson",
          time: "07:00",
          duration: 60,
          spotsAvailable: 8,
          totalSpots: 15,
          level: "Beginner",
          category: "Yoga",
        },
        {
          id: "class-2",
          className: "HIIT Bootcamp",
          instructor: "Mike Chen",
          time: "09:00",
          duration: 45,
          spotsAvailable: 3,
          totalSpots: 20,
          level: "Intermediate",
          category: "HIIT",
        },
        {
          id: "class-3",
          className: "Power Pilates",
          instructor: "Emma Wilson",
          time: "12:00",
          duration: 50,
          spotsAvailable: 12,
          totalSpots: 18,
          level: "Intermediate",
          category: "Pilates",
        },
        {
          id: "class-4",
          className: "Strength Training",
          instructor: "David Lee",
          time: "17:30",
          duration: 60,
          spotsAvailable: 5,
          totalSpots: 12,
          level: "Advanced",
          category: "Strength",
        },
        {
          id: "class-5",
          className: "Evening Yoga",
          instructor: "Sarah Johnson",
          time: "19:00",
          duration: 75,
          spotsAvailable: 10,
          totalSpots: 15,
          level: "Beginner",
          category: "Yoga",
        },
      ];
      const selectedClass = availableClasses.find((cls) => cls.id === classId);
      if (!selectedClass) return;
      const newBooking: ClassBooking = {
        id: Date.now().toString(),
        className: selectedClass.className,
        instructor: selectedClass.instructor,
        dateTime: dateTime,
        status: "upcoming",
      };
      setBookings((prev) => [...prev, newBooking]);
      setUsageData((prev) => ({
        ...prev,
        classesUsed: prev.classesUsed + 1,
      }));
      setLastBookedClass(newBooking);
      setShowBookingSuccess(true);
      addToast(
        `Successfully booked ${selectedClass.className} for ${dateTime.toLocaleDateString()} at ${dateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}! Check your Booking History to see all your classes.`,
        "success"
      );
    },
    [addToast, usageData.classesUsed, usageData.classesTotal]
  );
  const renderContent = () => {
    const contentVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    };
    const getContent = () => {
      switch (activeTab) {
        case "dashboard":
          return (
            <Dashboard
              usageData={usageData}
              isAutoRenewalOn={isAutoRenewalOn}
              isSubscriptionFrozen={isSubscriptionFrozen}
              totalReferralCredits={totalReferralCredits}
              renewalDate={RENEWAL_DATE}
            />
          );
        case "bookings":
          return <BookingHistory bookings={bookings} />;
        case "subscription":
          return (
            <Subscription
              currentPlanId={currentPlanId}
              plans={plans}
              onPlanChange={setCurrentPlanId}
              isAutoRenewalOn={isAutoRenewalOn}
              onToggleAutoRenewal={handleToggleAutoRenewal}
              isSubscriptionFrozen={isSubscriptionFrozen}
              onToggleFreeze={handleToggleFreeze}
            />
          );
        case "calendar":
          return (
            <CalendarView
              bookings={bookings}
              renewalDate={RENEWAL_DATE}
              onBookClass={handleBookClass}
              remainingCredits={usageData.classesTotal - usageData.classesUsed}
              isAutoRenewalOn={isAutoRenewalOn}
              isSubscriptionFrozen={isSubscriptionFrozen}
            />
          );
        case "referrals":
          return (
            <Referrals
              referrals={referrals}
              onAddReferral={handleAddReferral}
              referralCode={REFERRAL_CODE}
            />
          );
        default:
          return (
            <Dashboard
              usageData={usageData}
              isAutoRenewalOn={isAutoRenewalOn}
              isSubscriptionFrozen={isSubscriptionFrozen}
              totalReferralCredits={totalReferralCredits}
              renewalDate={RENEWAL_DATE}
            />
          );
      }
    };
    return (
      <motion.div
        key={activeTab}
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
      >
        {getContent()}
      </motion.div>
    );
  };
  if (!currentUser) {
    return (
      <>
        <GlobalStyles />
        <LoginView onLogin={handleLogin} />
      </>
    );
  }
  return (
    <ToastContext.Provider value={{ addToast }}>
      <GlobalStyles />
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar
          activeTab={activeTab}
          onTabClick={setActiveTab}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuClose={() => setIsMobileMenuOpen(false)}
        />
        <div className={`flex-1 flex flex-col min-h-screen md:ml-64 ${isMobileMenuOpen ? 'pointer-events-none md:pointer-events-auto' : ''}`}>
          <Header
            user={currentUser}
            onLogout={handleLogout}
            onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            isMobileMenuOpen={isMobileMenuOpen}
            activeTab={activeTab}
          />
          <main id="main-content" className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </main>
        </div>
      </div>
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastNotification
              key={toast.id}
              toast={toast}
              onRemove={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
      {showBookingSuccess && lastBookedClass && (
        <AnimatePresence>
          <div key="booking-success-backdrop" className="modal-backdrop" onClick={() => setShowBookingSuccess(false)} aria-hidden="true" />
          <div key="booking-success-content-wrapper" className="modal-content-wrapper">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="glass rounded-xl shadow-2xl p-6 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-bg-green flex items-center justify-center">
                  <IconCheck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
                <p className="text-slate-300">Your class has been successfully booked.</p>
              </div>
              <div className="glass-darker rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg gradient-bg-blue flex items-center justify-center flex-shrink-0">
                    <IconCalendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{lastBookedClass.className}</h4>
                    <p className="text-sm text-slate-300 mt-1">with {lastBookedClass.instructor}</p>
                    <p className="text-sm text-slate-400 mt-1">
                      {lastBookedClass.dateTime.toLocaleDateString("default", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      at{" "}
                      {lastBookedClass.dateTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setActiveTab("bookings");
                    setShowBookingSuccess(false);
                  }}
                  className="w-full py-3 gradient-bg-purple text-white font-semibold rounded-lg hover:shadow-lg transition-all cursor-pointer"
                >
                  View All Bookings
                </button>
                <button
                  onClick={() => setShowBookingSuccess(false)}
                  className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </ToastContext.Provider>
  );
};
export default App;

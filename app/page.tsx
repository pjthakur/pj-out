"use client";

import { useState, useEffect, useRef, createContext, useContext } from "react";
import { Inter, Poppins } from "next/font/google";
import {
  MessageCircle,
  Phone,
  Video,
  Smile,
  Paperclip,
  Mic,
  Mic2,
  Send,
  Sun,
  Moon,
  Search,
  MoreVertical,
  ArrowLeft,
  Settings,
  Image,
  X,
  Users,
  UserPlus,
  File,
  Camera,
  MapPin,
  ChevronRight,
  Check,
  CheckCheck,
  Clock,
  Volume2,
  VolumeX,
  AlertTriangle,
} from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

type ThemeMode = "light" | "dark" | "system";
type MessageStatus = "sent" | "delivered" | "read";
type AttachmentType = "image" | "file" | "audio" | "location";
type ModalType = "call" | "video" | "groupMembers" | "attachments" | "none";
type NotificationType = "success" | "error" | "info" | "warning";

interface Attachment {
  id: string;
  type: AttachmentType;
  url: string;
  name: string;
  size?: number;
  thumbnail?: string;
}

interface GroupMember {
  id: number;
  name: string;
  avatar: string | null;
  role?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

interface Message {
  id: number;
  content: string;
  timestamp: string;
  isSent: boolean;
  status?: MessageStatus;
  sender?: string;
  isTyping?: boolean;
  attachments?: Attachment[];
}

interface Chat {
  id: number;
  name: string;
  avatar: string | null;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
  isGroup: boolean;
  isOnline?: boolean;
  typing?: boolean;
  members?: GroupMember[];
  description?: string;
}

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

// Add proper SpeechRecognition type declarations
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
    recordingTimer: NodeJS.Timeout;
  }
}

type ThemeContextType = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  themeMode: "system",
  setThemeMode: () => {},
  isDark: false,
});

const MessageStatus = ({ status }: { status?: MessageStatus }) => {
  if (!status) return null;

  if (status === "sent") {
    return <Check size={16} className="message-tick" />;
  } else if (status === "delivered") {
    return <CheckCheck size={16} className="message-tick" />;
  } else if (status === "read") {
    return <CheckCheck size={16} className="message-tick-read" />;
  }

  return null;
};

const MessageMingleLogo = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="app-logo"
  >
    <rect width="32" height="32" rx="8" fill="currentColor" />
    <path
      d="M8 12H24"
      stroke="var(--logo-text)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M8 16H20"
      stroke="var(--logo-text)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M8 20H16"
      stroke="var(--logo-text)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="24" cy="20" r="2" fill="var(--logo-text)" />
  </svg>
);

const TypingIndicator = () => (
  <div className="typing-indicator">
    <span></span>
    <span></span>
    <span></span>
  </div>
);

const NotificationToast = ({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) => {
  const bgColorMap = {
    success: "var(--primary-light)",
    error: "var(--error-color)",
    info: "var(--secondary-color)",
    warning: "#f39c12",
  };

  const iconMap = {
    success: <Check size={18} />,
    error: <X size={18} />,
    info: <MessageCircle size={18} />,
    warning: <AlertTriangle size={18} />,
  };

  return (
    <div
      style={{
        backgroundColor: bgColorMap[notification.type],
        color: "white",
        padding: "0.75rem 1rem",
        borderRadius: "0.5rem",
        boxShadow: "var(--shadow-elevated)",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        width: "100%",
        maxWidth: "350px",
        animation: "slideInLeft 0.3s forwards",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {iconMap[notification.type]}
      </div>
      <div style={{ flex: 1 }}>{notification.message}</div>
      <button
        className="icon-button"
        style={{ color: "white" }}
        onClick={onClose}
      >
        <X size={16} />
      </button>
    </div>
  );
};

const Avatar = ({
  name,
  avatar,
  size = "md",
  isOnline = false,
  borderColor,
}: {
  name: string;
  avatar: string | null;
  size?: "sm" | "md" | "lg";
  isOnline?: boolean;
  borderColor?: string;
}) => {
  const sizeMap = {
    sm: { width: "2rem", height: "2rem", fontSize: "0.875rem" },
    md: { width: "3rem", height: "3rem", fontSize: "1.25rem" },
    lg: { width: "4rem", height: "4rem", fontSize: "1.5rem" },
  };

  const indicatorSizeMap = {
    sm: { width: "0.625rem", height: "0.625rem" },
    md: { width: "0.875rem", height: "0.875rem" },
    lg: { width: "1.125rem", height: "1.125rem" },
  };

  return (
    <div
      style={{
        position: "relative",
        width: sizeMap[size].width,
        height: sizeMap[size].height,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "9999px",
          overflow: "hidden",
          border: borderColor ? `2px solid ${borderColor}` : "none",
        }}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: getNameColor(name),
              color: "#FFFFFF",
              fontWeight: "600",
              fontSize: sizeMap[size].fontSize,
            }}
          >
            {name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()}
          </div>
        )}
      </div>

      {isOnline && (
        <div
          style={{
            position: "absolute",
            top: "0",
            right: "0",
            width: indicatorSizeMap[size].width,
            height: indicatorSizeMap[size].height,
            backgroundColor: "var(--online-indicator)",
            borderRadius: "9999px",
            border: "2px solid var(--bg-primary)",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
            zIndex: 2,
          }}
        />
      )}
    </div>
  );
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        backdropFilter: "blur(4px)",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={onClose}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderRadius: "1rem",
          width: "90%",
          maxWidth: "500px",
          maxHeight: "80vh",
          overflow: "hidden",
          boxShadow: "var(--shadow-elevated)",
          animation: "zoomIn 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modal-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontWeight: "600",
              color: "var(--text-primary)",
            }}
          >
            {title}
          </h3>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close"
            style={{ color: "var(--text-primary)" }} // This line ensures the icon color adapts to the theme
          >
            <X size={20} />
          </button>
        </div>
        <div
          className="modal-body"
          style={{
            padding: "1rem",
            maxHeight: "calc(80vh - 4rem)",
            overflowY: "auto",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const CallModal = ({
  isOpen,
  onClose,
  name,
  avatar,
  isVideo = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  avatar: string | null;
  isVideo?: boolean;
}) => {
  const [callStatus, setCallStatus] = useState<
    "connecting" | "ongoing" | "ended"
  >("connecting");
  const [isMuted, setIsMuted] = useState(false);
  const [callTime, setCallTime] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const connectTimeout = setTimeout(() => {
        setCallStatus("ongoing");
      }, 2000);

      let timer: NodeJS.Timeout;
      if (callStatus === "ongoing") {
        timer = setInterval(() => {
          setCallTime((prev) => prev + 1);
        }, 1000);
      }

      return () => {
        clearTimeout(connectTimeout);
        if (timer) clearInterval(timer);
      };
    } else {
      setCallStatus("connecting");
      setCallTime(0);
      setIsMuted(false);
    }
  }, [isOpen, callStatus]);

  const formatCallTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const endCall = () => {
    setCallStatus("ended");
    setTimeout(onClose, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isVideo ? "Video Call" : "Voice Call"}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <p
          style={{
            margin: "0.5rem 0 1.5rem",
            color: "var(--text-secondary)",
            fontSize: "0.9rem",
          }}
        >
          {callStatus === "connecting"
            ? "Connecting..."
            : callStatus === "ongoing"
            ? formatCallTime(callTime)
            : "Call ended"}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "2rem",
          }}
        >
          {isVideo ? (
            <div
              style={{
                width: "100%",
                maxWidth: "320px",
                aspectRatio: "16/9",
                borderRadius: "1rem",
                backgroundColor: "var(--bg-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                boxShadow: "var(--shadow-standard)",
                margin: "1rem 0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "20px",
                  //   gap: "1rem",
                }}
              >
                <Avatar name={name} avatar={avatar} size="lg" />
                <p style={{ margin: 0, color: "var(--text-secondary)" }}>
                  {callStatus === "connecting"
                    ? "Connecting video..."
                    : callStatus === "ongoing"
                    ? "Video connected"
                    : "Video ended"}
                </p>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                margin: "1.5rem 0",
              }}
            >
              <Avatar
                name={name}
                avatar={avatar}
                size="lg"
                borderColor="var(--primary-color)"
              />
              <h3 style={{ margin: 0, color: "var(--text-primary)" }}>
                {name}
              </h3>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <button
            className="icon-button"
            style={{
              backgroundColor: isMuted
                ? "var(--error-color)"
                : "var(--bg-secondary)",
              width: "3.5rem",
              height: "3.5rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--shadow-standard)",
              color: isMuted ? "white" : "var(--text-primary)",
            }}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
          <button
            className="icon-button"
            style={{
              backgroundColor: "var(--error-color)",
              width: "3.5rem",
              height: "3.5rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: "var(--shadow-standard)",
            }}
            onClick={endCall}
          >
            <Phone size={24} style={{ transform: "rotate(135deg)" }} />
          </button>
        </div>
      </div>
    </Modal>
  );
};

const getNameColor = (name: string) => {
  const colors = [
    "var(--avatar-1)",
    "var(--avatar-2)",
    "var(--avatar-3)",
    "var(--avatar-4)",
    "var(--avatar-5)",
    "var(--avatar-6)",
    "var(--avatar-7)",
    "var(--avatar-8)",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export default function MessageMingle() {
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [isDark, setIsDark] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeChat, setActiveChat] = useState<number>(1);
  const [newMessage, setNewMessage] = useState<string>("");
  const [movingChatId, setMovingChatId] = useState<number | null>(null);
  const [showChatSearch, setShowChatSearch] = useState(false);
  const [chatSearchTerm, setChatSearchTerm] = useState("");
  const [activeModal, setActiveModal] = useState<ModalType>("none");
  const [selectedAttachmentType, setSelectedAttachmentType] =
    useState<AttachmentType | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const chatSearchInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      name: "John Doe",
      avatar: null,
      lastMessage: "Hey, how are you doing?",
      time: "10:30 AM",
      unread: 1,
      isGroup: false,
      isOnline: true,
      messages: [
        {
          id: 1,
          content: "Hey! Have you seen MessageMingle Web feature?",
          timestamp: "02:00",
          isSent: true,
          status: "read",
        },
        {
          id: 2,
          content: "I'm good, thanks! How about you?",
          timestamp: "10:31 AM",
          isSent: true,
          status: "read",
        },
        {
          id: 3,
          content: "Pretty good. Working on that project we discussed.",
          timestamp: "10:32 AM",
          isSent: false,
        },
        {
          id: 4,
          content: "Oh nice! How's it coming along?",
          timestamp: "10:33 AM",
          isSent: true,
          status: "read",
        },
        {
          id: 5,
          content: "Making progress. Should be done by next week.",
          timestamp: "10:35 AM",
          isSent: false,
        },
      ],
    },
    {
      id: 2,
      name: "Family Group",
      avatar: null,
      lastMessage: "Mom: Dinner at 8pm tonight!",
      time: "Yesterday",
      unread: 0,
      isGroup: true,
      messages: [
        {
          id: 1,
          content: "How was everyone's day?",
          timestamp: "Yesterday",
          isSent: false,
          sender: "Dad",
        },
        {
          id: 2,
          content: "Pretty good! Got an A on my test.",
          timestamp: "Yesterday",
          isSent: false,
          sender: "Sister",
        },
        {
          id: 3,
          content: "Dinner at 8pm tonight!",
          timestamp: "Yesterday",
          isSent: false,
          sender: "Mom",
        },
        {
          id: 4,
          content: "Great! I'll be there.",
          timestamp: "Yesterday",
          isSent: true,
          status: "delivered",
        },
      ],
      members: [
        {
          id: 1,
          name: "You",
          avatar: null,
          role: "Admin",
          isOnline: true,
        },
        {
          id: 2,
          name: "Mom",
          avatar: null,
          isOnline: true,
          lastSeen: "Online",
        },
        {
          id: 3,
          name: "Dad",
          avatar: null,
          isOnline: false,
          lastSeen: "Last seen today at 3:45 PM",
        },
        {
          id: 4,
          name: "Sister",
          avatar: null,
          isOnline: false,
          lastSeen: "Last seen yesterday",
        },
        {
          id: 5,
          name: "Brother",
          avatar: null,
          isOnline: true,
          lastSeen: "Online",
        },
      ],
      description: "Family group for important announcements and coordination",
    },
    {
      id: 3,
      name: "Sarah Williams",
      avatar: null,
      lastMessage: "The project deadline is next week",
      time: "Yesterday",
      unread: 0,
      isGroup: false,
      isOnline: true,
      messages: [
        {
          id: 1,
          content: "Hi, just wanted to remind you about the project.",
          timestamp: "Yesterday",
          isSent: false,
        },
        {
          id: 2,
          content: "The project deadline is next week",
          timestamp: "Yesterday",
          isSent: false,
        },
        {
          id: 3,
          content: "Thanks for the reminder! I'm working on it.",
          timestamp: "Yesterday",
          isSent: true,
          status: "read",
        },
      ],
    },
    {
      id: 4,
      name: "Work Group",
      avatar: null,
      lastMessage: "Boss: Don't forget the meeting",
      time: "Tuesday",
      unread: 0,
      isGroup: true,
      messages: [
        {
          id: 1,
          content: "Has everyone finished their reports?",
          timestamp: "Tuesday",
          isSent: false,
          sender: "Alex",
        },
        {
          id: 2,
          content: "Almost done with mine!",
          timestamp: "Tuesday",
          isSent: false,
          sender: "Jane",
        },
        {
          id: 3,
          content: "Don't forget the meeting",
          timestamp: "Tuesday",
          isSent: false,
          sender: "Boss",
        },
        {
          id: 4,
          content: "I'll be there, just finishing up my report now.",
          timestamp: "Tuesday",
          isSent: true,
          status: "delivered",
        },
      ],
      members: [
        {
          id: 1,
          name: "You",
          avatar: null,
          isOnline: true,
        },
        {
          id: 2,
          name: "Boss",
          avatar: null,
          role: "Admin",
          isOnline: true,
          lastSeen: "Online",
        },
        {
          id: 3,
          name: "Alex",
          avatar: null,
          isOnline: false,
          lastSeen: "Last seen today at 2:20 PM",
        },
        {
          id: 4,
          name: "Jane",
          avatar: null,
          isOnline: true,
          lastSeen: "Online",
        },
        {
          id: 5,
          name: "Michael",
          avatar: null,
          isOnline: false,
          lastSeen: "Last seen yesterday",
        },
      ],
      description: "Work group for project coordination and updates",
    },
    {
      id: 5,
      name: "David Johnson",
      avatar: null,
      lastMessage: "Let's catch up soon!",
      time: "Monday",
      unread: 0,
      isGroup: false,
      messages: [
        {
          id: 1,
          content: "Hey, it's been a while!",
          timestamp: "Monday",
          isSent: false,
        },
        {
          id: 2,
          content: "Let's catch up soon!",
          timestamp: "Monday",
          isSent: false,
        },
        {
          id: 3,
          content: "Definitely! How about coffee this weekend?",
          timestamp: "Monday",
          isSent: true,
          status: "sent",
        },
      ],
    },
  ]);

  const attachmentOptions: {
    type: AttachmentType;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { type: "image", label: "Photos & Videos", icon: <Camera size={20} /> },
    { type: "file", label: "Documents", icon: <File size={20} /> },
    { type: "location", label: "Location", icon: <MapPin size={20} /> },
  ];

  const showNotification = (
    message: string,
    type: NotificationType = "info",
    duration: number = 3000
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification: Notification = {
      id,
      message,
      type,
      duration,
    };

    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    }, duration);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("themePreference") as ThemeMode;
    if (savedTheme) {
      setThemeMode(savedTheme);
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDark(themeMode === "dark" || (themeMode === "system" && prefersDark));

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (themeMode === "system") {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [themeMode]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = isDark ? "dark" : "light";
  }, [isDark]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setShowSidebar(window.innerWidth >= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.height = "100%";
    document.documentElement.style.overflow = "hidden";

    document.body.style.height = "100%";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.display = "flex";
    document.body.style.alignItems = "center";
    document.body.style.justifyContent = "center";
    document.body.style.overflow = "hidden";
    document.body.style.position = "relative";

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerHTML = `
      :root {
        --font-sans: ${poppins.style.fontFamily}, ${inter.style.fontFamily}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        
        /* Modern flat light theme colors */
        --primary-color: #00B894;
        --primary-light: #00B894;
        --primary-dark: #00A085;
        --secondary-color: #0984e3;
        --accent-color: #6c5ce7;
        --error-color: #e17055;
        --success-color: #00b894;
        --warning-color: #fdcb6e;
        --text-primary: #2d3436;
        --text-secondary: #636e72;
        --text-muted: #b2bec3;
        --text-inverse: #FFFFFF;
        --bg-primary: #FFFFFF;
        --bg-secondary: #f8f9fa;
        --bg-tertiary: #e9ecef;
        --bg-chat: #f8f9fa;
        --bg-input: #FFFFFF;
        --bg-hover: #f1f3f4;
        --sent-message: #00B894;
        --sent-message-text: #FFFFFF;
        --received-message: #FFFFFF;
        --received-message-text: #2d3436;
        --hover-color: #f1f3f4;
        --border-color: #e9ecef;
        --divider-color: #dee2e6;
        --logo-text: #FFFFFF;
        --shadow-minimal: 0 1px 3px rgba(0, 0, 0, 0.06);
        --shadow-subtle: 0 2px 8px rgba(0, 0, 0, 0.08);
        --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.05);
        --online-indicator: #00b894;
        --unread-indicator: #00B894;
        --unread-badge: #e17055;
        
        /* Modern avatar colors */
        --avatar-1: #6c5ce7;
        --avatar-2: #a29bfe;
        --avatar-3: #fd79a8;
        --avatar-4: #fdcb6e;
        --avatar-5: #e17055;
        --avatar-6: #00b894;
        --avatar-7: #00cec9;
        --avatar-8: #0984e3;
        
        /* Flat UI elements */
        --button-hover: rgba(0, 184, 148, 0.08);
        --card-radius: 12px;
        --input-radius: 8px;
        --transition-speed: 0.2s;
        --border-width: 1px;
      }
      
      [data-theme="dark"] {
        /* Modern flat dark theme colors */
        --primary-color: #00B894;
        --primary-light: #00B894;
        --primary-dark: #00A085;
        --secondary-color: #74b9ff;
        --accent-color: #a29bfe;
        --error-color: #e84393;
        --success-color: #00b894;
        --warning-color: #fdcb6e;
        --text-primary: #f8f9fa;
        --text-secondary: #ced6e0;
        --text-muted: #a4b0be;
        --text-inverse: #2d3436;
        --bg-primary: #1e272e;
        --bg-secondary: #2f3542;
        --bg-tertiary: #3d4454;
        --bg-chat: #1e272e;
        --bg-input: #2f3542;
        --bg-hover: #3d4454;
        --sent-message: #00B894;
        --sent-message-text: #FFFFFF;
        --received-message: #2f3542;
        --received-message-text: #f8f9fa;
        --hover-color: #3d4454;
        --border-color: #40495a;
        --divider-color: #40495a;
        --logo-text: #FFFFFF;
        --shadow-minimal: 0 1px 3px rgba(0, 0, 0, 0.2);
        --shadow-subtle: 0 2px 8px rgba(0, 0, 0, 0.15);
        --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.1);
        --online-indicator: #00b894;
        --unread-indicator: #00B894;
        --unread-badge: #e84393;
        
        /* Flat UI elements */
        --button-hover: rgba(0, 184, 148, 0.12);
      }
      
      * {
        box-sizing: border-box;
        font-family: var(--font-sans);
      }
      
      /* Animations */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideInRight {
        from { transform: translateX(-20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes slideInLeft {
        from { transform: translateX(20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes moveToTop {
        0% { 
          transform: translateY(100%);
          opacity: 0.8;
        }
        100% { 
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      @keyframes zoomIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
      
      @keyframes slideDown {
        from { transform: translateY(-100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      @keyframes slideUp {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(-100%); opacity: 0; }
      }
      
      @keyframes pulse {
        0% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.5;
          transform: scale(1.1);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      /* Component styles */
      .typing-indicator {
        display: inline-flex;
        align-items: center;
        padding: 8px 12px;
        background-color: var(--received-message);
        border-radius: 18px;
        border: none;
      }
      
      .typing-indicator span {
        width: 6px;
        height: 6px;
        margin: 0 2px;
        background-color: var(--text-secondary);
        border-radius: 50%;
        display: inline-block;
        animation: bounce 1.4s infinite ease-in-out;
      }
      
      .typing-indicator span:nth-child(1) {
        animation-delay: 0s;
      }
      
      .typing-indicator span:nth-child(2) {
        animation-delay: 0.2s;
      }
      
      .typing-indicator span:nth-child(3) {
        animation-delay: 0.4s;
      }
      
      .message-tick {
        color: var(--text-secondary);
      }
      
      .message-tick-read {
        color: var(--secondary-color);
      }
      
      .app-logo {
        color: var(--primary-color);
      }
      
      .message-animation-sent {
        animation: slideInLeft 0.3s ease-out;
      }
      
      .message-animation-received {
        animation: slideInRight 0.3s ease-out;
      }
      
      .chat-search-animation-enter {
        animation: slideDown 0.3s ease-out forwards;
      }
      
      .chat-search-animation-exit {
        animation: slideUp 0.3s ease-out forwards;
      }
      
      .icon-button {
        padding: 8px;
        border-radius: var(--card-radius);
        background-color: transparent;
        border: none;
        cursor: pointer;
        color: inherit;
        transition: all var(--transition-speed);
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 40px;
        min-height: 40px;
      }
      
      .icon-button:hover {
        background-color: var(--button-hover);
        transform: none;
      }
      
      .icon-button:active {
        transform: scale(0.98);
      }
      
      .primary-button {
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: var(--card-radius);
        padding: 12px;
        cursor: pointer;
        transition: all var(--transition-speed);
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 48px;
        min-height: 48px;
        box-shadow: none;
      }
      
      .primary-button:hover {
        background-color: var(--primary-dark);
        transform: none;
      }
      
      .primary-button:active {
        transform: scale(0.98);
      }
      
      .chat-input {
        flex: 1;
        padding: 12px 16px;
        border-radius: var(--input-radius);
        border: var(--border-width) solid var(--border-color);
        background-color: var(--bg-input);
        color: var(--text-primary);
        outline: none;
        transition: all var(--transition-speed);
        font-size: 15px;
        font-family: inherit;
      }
      
      .chat-input:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(0, 184, 148, 0.1);
      }
      
      .chat-input::placeholder {
        color: var(--text-muted);
      }
      
      .chat-item {
        border-radius: 0;
        transition: all var(--transition-speed);
        border: none;
        background-color: transparent;
      }
      
      .chat-item:hover {
        background-color: var(--hover-color);
        transform: none;
        box-shadow: none;
      }
      
      .chat-item.active {
        background-color: var(--bg-hover);
        border-left: 4px solid var(--primary-color);
        padding-left: calc(1rem - 4px);
      }
      
      .chat-message {
        position: relative;
        padding: 12px 16px;
        border-radius: 18px;
        max-width: 70%;
        border: none;
        box-shadow: none;
        margin-bottom: 2px;
      }
      
      .chat-message-sent {
        background-color: var(--sent-message);
        color: var(--sent-message-text);
        margin-left: auto;
        border-bottom-right-radius: 4px;
      }
      
      .chat-message-received {
        background-color: var(--received-message);
        color: var(--received-message-text);
        border-bottom-left-radius: 4px;
        border: var(--border-width) solid var(--border-color);
      }
      
      .attachment-option {
        display: flex;
        align-items: center;
        padding: 16px;
        border-radius: var(--card-radius);
        cursor: pointer;
        transition: background-color var(--transition-speed);
        border: none;
      }
      
      .attachment-option:hover {
        background-color: var(--hover-color);
      }
      
      .attachment-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: var(--card-radius);
        margin-right: 16px;
      }
      
      /* Media queries for responsive design */
      @media (max-width: 768px) {
        .sidebar {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          z-index: 30;
          transform: translateX(0);
          transition: transform 0.3s ease;
          box-shadow: none;
        }
        
        .sidebar.hidden {
          transform: translateX(-100%);
        }
        
        .chat-area {
          width: 100% !important;
          position: relative;
        }
        
        .emoji-picker {
          left: 12px !important;
          right: 12px !important;
          width: auto !important;
          max-width: none !important;
          box-shadow: var(--shadow-card);
          border: var(--border-width) solid var(--border-color);
        }
        
        .chat-search-container {
          width: 100% !important;
        }
        
        .chat-message {
          max-width: 85% !important;
          font-size: 15px;
        }
        
        .modal-content {
          width: calc(100% - 2rem) !important;
          margin: 1rem !important;
          border-radius: var(--card-radius) !important;
          box-shadow: var(--shadow-card);
        }
        
        .header-actions {
          gap: 4px !important;
        }
        
        .header-actions .icon-button {
          padding: 8px !important;
          min-width: 40px !important;
          min-height: 40px !important;
        }
        
        .mobile-input-container {
          padding: 12px !important;
          gap: 8px !important;
        }
        
        .chat-input {
          font-size: 16px !important;
          padding: 12px 16px !important;
          border-radius: var(--input-radius) !important;
        }
        
        .primary-button {
          min-width: 44px !important;
          min-height: 44px !important;
          padding: 10px !important;
        }
        
        /* Flat mobile chat items */
        .chat-item {
          padding: 16px 1rem !important;
          border-bottom: var(--border-width) solid var(--divider-color);
        }
        
        .chat-item.active {
          background-color: var(--bg-hover);
          border-left: 4px solid var(--primary-color);
          border-bottom: var(--border-width) solid var(--divider-color);
        }
      }
      
      @media (max-width: 480px) {
        .chat-message {
          max-width: 88% !important;
          font-size: 14px !important;
          padding: 10px 14px !important;
        }
        
        .sidebar {
          padding-top: env(safe-area-inset-top, 0) !important;
          padding-bottom: env(safe-area-inset-bottom, 0) !important;
        }
        
        .chat-area {
          padding-top: env(safe-area-inset-top, 0) !important;
          padding-bottom: env(safe-area-inset-bottom, 0) !important;
        }
        
        .compact-header {
          padding: 10px 16px !important;
          min-height: 52px !important;
        }
        
        .compact-header h3 {
          font-size: 15px !important;
          font-weight: 600 !important;
          line-height: 1.2 !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
        }
        
        .compact-header p {
          font-size: 12px !important;
          line-height: 1.1 !important;
          margin-top: 1px !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
        }
        
        .compact-header .icon-button {
          min-width: 36px !important;
          min-height: 36px !important;
          padding: 6px !important;
        }
        
        .chat-input {
          font-size: 16px !important;
          padding: 14px 16px !important;
        }
      }
      
      @media (min-width: 769px) {
        .sidebar {
          width: 380px !important;
          min-width: 380px !important;
          max-width: 420px !important;
          border-right: var(--border-width) solid var(--border-color);
          box-shadow: none;
        }
        
        .chat-area {
          flex: 1 !important;
        }
        
        .chat-item:hover {
          background-color: var(--hover-color);
          transform: none;
          box-shadow: none;
        }
        
        .icon-button:hover {
          background-color: var(--button-hover);
          transform: none;
        }
        
        .chat-message {
          font-size: 15px;
        }
        
        /* Desktop specific flat styles */
        .emoji-picker {
          box-shadow: var(--shadow-card);
          border: var(--border-width) solid var(--border-color);
        }
      }
      
      @media (min-width: 1200px) {
        .sidebar {
          width: 400px !important;
          max-width: 450px !important;
        }
        
        .chat-message {
          max-width: 65% !important;
        }
        
        .chat-input {
          font-size: 15px;
          padding: 14px 18px;
        }
      }
      
      /* Modern flat design enhancements */
      .flat-card {
        background: var(--bg-primary);
        border: var(--border-width) solid var(--border-color);
        border-radius: var(--card-radius);
        transition: all var(--transition-speed);
      }
      
      .flat-card:hover {
        border-color: var(--primary-color);
        background: var(--bg-hover);
      }
      
      .flat-input {
        background: var(--bg-input);
        border: var(--border-width) solid var(--border-color);
        border-radius: var(--input-radius);
        color: var(--text-primary);
        transition: all var(--transition-speed);
      }
      
      .flat-input:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(0, 184, 148, 0.08);
        outline: none;
      }
      
      .flat-button {
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: var(--input-radius);
        padding: 12px 20px;
        font-weight: 500;
        transition: all var(--transition-speed);
        cursor: pointer;
      }
      
      .flat-button:hover {
        background: var(--primary-dark);
      }
      
      .flat-button:active {
        transform: scale(0.98);
      }
      
      /* Smooth scrolling and improved scrollbars */
      .smooth-scroll {
        scroll-behavior: smooth;
        scrollbar-width: thin;
        scrollbar-color: var(--text-muted) transparent;
      }
      
      .smooth-scroll::-webkit-scrollbar {
        width: 4px;
      }
      
      .smooth-scroll::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .smooth-scroll::-webkit-scrollbar-thumb {
        background: var(--text-muted);
        border-radius: 2px;
        opacity: 0.6;
      }
      
      .smooth-scroll::-webkit-scrollbar-thumb:hover {
        opacity: 0.8;
        background: var(--text-secondary);
      }
      
      /* Enhanced focus styles for accessibility */
      .icon-button:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
        border-radius: var(--card-radius);
      }
      
      /* Improved typography for flat design */
      h1, h2, h3, h4, h5, h6 {
        font-weight: 600;
        line-height: 1.4;
        color: var(--text-primary);
      }
      
      /* Better touch targets and accessibility */
      @media (max-width: 768px) {
        .icon-button, .primary-button {
          min-width: 44px !important;
          min-height: 44px !important;
        }
        
        .chat-item {
          min-height: 72px !important;
        }
      }
      
      /* Remove background patterns for flat design */
      .flat-chat-bg {
        background-image: none !important;
        background-color: var(--bg-chat) !important;
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      document.documentElement.style.height = "";
      document.documentElement.style.overflow = "";

      document.body.style.height = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.display = "";
      document.body.style.alignItems = "";
      document.body.style.justifyContent = "";
      document.body.style.overflow = "";
      document.body.style.position = "";

      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    if (showChatSearch && chatSearchInputRef.current) {
      setTimeout(() => {
        chatSearchInputRef.current?.focus();
      }, 100);
    }
  }, [showChatSearch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  useEffect(() => {
    setChats(updateChatListWithCorrectLastMessages());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        !(event.target as Element).closest(".emoji-picker")
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleThemeChange = () => {
    const newTheme = isDark ? "light" : "dark";
    setThemeMode(newTheme);
    setIsDark(!isDark);
    localStorage.setItem("themePreference", newTheme);
  };

  const handleChatSelect = (chatId: number) => {
    if (activeChat === chatId) return;

    setActiveChat(chatId);
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, unread: 0 } : chat
      )
    );

    setActiveModal("none");

    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleVoiceInput = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setIsRecording(false);
      setRecordingTime(0);
      return;
    }

    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      showNotification(
        "Speech recognition is not supported in your browser",
        "error"
      );
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
      setRecordingTime(0);
      const timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      window.recordingTimer = timer;
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result: SpeechRecognitionResult) => result[0])
        .map((result: SpeechRecognitionAlternative) => result.transcript)
        .join("");

      setNewMessage(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error", event.error);
      showNotification(`Error: ${event.error}`, "error");
      setIsRecording(false);
      clearInterval(window.recordingTimer);
    };

    recognition.onend = () => {
      setIsRecording(false);
      clearInterval(window.recordingTimer);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const activeChatObj = chats.find((chat) => chat.id === activeChat);
    if (!activeChatObj) return;

    const newMsg: Message = {
      id: activeChatObj.messages.length + 1,
      content: newMessage,
      timestamp: currentTime,
      isSent: true,
      status: "sent",
    };

    const isAlreadyAtTop = chats[0].id === activeChat;

    setTimeout(() => {
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === activeChat) {
            const updatedMessages = chat.messages.map((msg) => {
              if (msg.id === newMsg.id) {
                return { ...msg, status: "delivered" as MessageStatus };
              }
              return msg;
            });
            return { ...chat, messages: updatedMessages };
          }
          return chat;
        })
      );

      setTimeout(() => {
        setChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat.id === activeChat) {
              return { ...chat, typing: true };
            }
            return chat;
          })
        );

        setTimeout(() => {
          const responses = [
            "That sounds good!",
            "I'll get back to you on that.",
            "Thanks for letting me know.",
            "Great! Let's meet up soon.",
            "I appreciate you reaching out.",
          ];

          const randomResponse =
            responses[Math.floor(Math.random() * responses.length)];

          setChats((prevChats) =>
            prevChats.map((chat) => {
              if (chat.id === activeChat) {
                const responseMsg: Message = {
                  id: chat.messages.length + 2,
                  content: randomResponse,
                  timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  isSent: false,
                };

                const updatedMessages = chat.messages.map((msg) => {
                  if (msg.isSent && msg.status === "delivered") {
                    return { ...msg, status: "read" as MessageStatus };
                  }
                  return msg;
                });

                return {
                  ...chat,
                  typing: false,
                  messages: [...updatedMessages, responseMsg],
                  lastMessage: responseMsg.content,
                  time: responseMsg.timestamp,
                };
              }
              return chat;
            })
          );
        }, 2000);
      }, 1000);
    }, 1000);

    const updatedActiveChat = {
      ...activeChatObj,
      lastMessage: `You: ${newMessage}`,
      time: currentTime,
      messages: [...activeChatObj.messages, newMsg],
      unread: 0,
    };

    if (!isAlreadyAtTop) {
      setMovingChatId(activeChat);

      const otherChats = chats.filter((chat) => chat.id !== activeChat);
      setChats([updatedActiveChat, ...otherChats]);

      setTimeout(() => {
        setMovingChatId(null);
      }, 500);
    } else {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChat ? updatedActiveChat : chat
        )
      );
    }

    setNewMessage("");
  };

  const handleAttachmentSelect = (type: AttachmentType) => {
    setSelectedAttachmentType(type);
    setActiveModal("none");

    const attachmentMap: Record<AttachmentType, string> = {
      image: "📷 Photo",
      file: "📄 Document",
      audio: "🎵 Audio",
      location: "📍 Location",
    };

    setNewMessage((prev) => {
      const prefix = prev ? prev + " " : "";
      return prefix + attachmentMap[type];
    });

    showNotification(`${attachmentMap[type]} attachment added`, "success");

    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 100);
  };

  const handleAddMember = () => {
    const newMemberNames = [
      "Alex Smith",
      "Emma Johnson",
      "James Wilson",
      "Sofia Garcia",
      "Liam Thomas",
    ];
    const randomName =
      newMemberNames[Math.floor(Math.random() * newMemberNames.length)];

    if (!currentChat?.isGroup || !currentChat.members) return;

    const existingMember = currentChat.members.find(
      (member) => member.name.toLowerCase() === randomName.toLowerCase()
    );

    if (existingMember) {
      showNotification(
        `${randomName} is already a member of this group`,
        "warning"
      );
      return;
    }

    const newMember: GroupMember = {
      id: currentChat.members.length + 10,
      name: randomName,
      avatar: null,
      isOnline: Math.random() > 0.5,
      lastSeen: "Just added",
    };

    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === activeChat && chat.isGroup && chat.members) {
          return {
            ...chat,
            members: [...chat.members, newMember],
          };
        }
        return chat;
      })
    );

    showNotification(`${randomName} added to the group`, "success");
  };

  const emojis = [
    "😊",
    "😂",
    "❤️",
    "👍",
    "🎉",
    "🔥",
    "👌",
    "🙏",
    "😍",
    "😁",
    "😘",
    "🤣",
    "😎",
    "👏",
    "🥳",
    "😢",
    "🤔",
    "😒",
    "🙄",
    "😳",
    "😭",
    "🥺",
    "🤗",
    "🤫",
  ];

  const updateChatListWithCorrectLastMessages = () => {
    return chats.map((chat) => {
      if (chat.messages.length === 0) return chat;

      const lastMsg = chat.messages[chat.messages.length - 1];

      let formattedLastMessage;
      if (lastMsg.isSent) {
        formattedLastMessage = `You: ${lastMsg.content}`;
      } else if (chat.isGroup && lastMsg.sender) {
        formattedLastMessage = `${lastMsg.sender}: ${lastMsg.content}`;
      } else {
        formattedLastMessage = lastMsg.content;
      }

      return {
        ...chat,
        lastMessage: formattedLastMessage,
        time: lastMsg.timestamp,
      };
    });
  };

  const handleChatSearchToggle = () => {
    setShowChatSearch(!showChatSearch);
    setChatSearchTerm("");
  };

  const matchedMessages =
    chatSearchTerm.trim() !== "" && activeChat
      ? chats
          .find((chat) => chat.id === activeChat)
          ?.messages.filter((msg) =>
            msg.content.toLowerCase().includes(chatSearchTerm.toLowerCase())
          ) || []
      : [];

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentChat = chats.find((chat) => chat.id === activeChat);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, isDark }}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          backgroundColor: "var(--bg-primary)",
          overflow: "hidden",
        }}
        className={poppins.className}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            backgroundColor: "var(--bg-primary)",
          }}
        >
          {/* Sidebar */}
          {(showSidebar || !isMobile) && (
            <div
              className={`sidebar smooth-scroll ${!showSidebar && isMobile ? 'hidden' : ''}`}
              style={{
                width: isMobile ? "100%" : "350px",
                minWidth: isMobile ? "100%" : "350px",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "var(--bg-primary)",
                borderRight: isMobile ? "none" : "1px solid var(--border-color)",
                overflow: "hidden",
                transition: "all 0.3s ease",
                zIndex: isMobile ? 30 : 1,
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 1rem",
                  height: "59px",
                  backgroundColor: "var(--primary-color)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <MessageMingleLogo />
                  <span
                    style={{
                      marginLeft: "0.5rem",
                      fontWeight: "600",
                      color: "var(--logo-text)",
                      fontSize: "1.1rem",
                    }}
                  >
                    MessageMingle
                  </span>
                </div>
                <div
                  className="header-actions"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <button
                    className="icon-button"
                    style={{ color: "var(--logo-text)" }}
                    onClick={handleThemeChange}
                    title={
                      isDark ? "Switch to light mode" : "Switch to dark mode"
                    }
                  >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                </div>
              </div>

              <div
                style={{
                  padding: "0.75rem 1rem",
                  backgroundColor: "var(--bg-secondary)",
                }}
              >
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      top: "0",
                      bottom: "0",
                      left: "0",
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: "0.75rem",
                      pointerEvents: "none",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <Search size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search or start new chat"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: "100%",
                      paddingLeft: "2.5rem",
                      paddingTop: "0.75rem",
                      paddingBottom: "0.75rem",
                      backgroundColor: "var(--bg-input)",
                      border: "none",
                      borderRadius: "0.75rem",
                      fontSize: "0.9rem",
                      color: "var(--text-primary)",
                      outline: "none",
                      boxShadow: "var(--shadow-standard)",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  flex: "1 1 0%",
                  overflowY: "auto",
                  backgroundColor: "var(--bg-primary)",
                }}
                className="smooth-scroll"
              >
                {filteredChats.length === 0 ? (
                  <div
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      color: "var(--text-secondary)",
                    }}
                  >
                    No chats found
                  </div>
                ) : (
                  filteredChats.map((chat, index) => (
                    <div
                      key={chat.id}
                      className={`chat-item ${
                        activeChat === chat.id ? "active" : ""
                      }`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem 1rem",
                        cursor: "pointer",
                        borderBottom:
                          index !== filteredChats.length - 1
                            ? "1px solid var(--border-color)"
                            : "none",
                        transition: "all 0.3s ease",
                        transform:
                          movingChatId === chat.id ? "translateY(0)" : "none",
                        opacity: 1,
                        position: "relative",
                        zIndex: movingChatId === chat.id ? 10 : 1,
                        animation:
                          movingChatId === chat.id
                            ? "moveToTop 0.4s ease"
                            : "none",
                      }}
                      onClick={() => handleChatSelect(chat.id)}
                    >
                      <Avatar
                        name={chat.name}
                        avatar={chat.avatar}
                        isOnline={chat.isOnline}
                      />
                      <div style={{ flex: "1 1 0%", minWidth: "0" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                          }}
                        >
                          <h3
                            style={{
                              margin: "0",
                              padding: "0",
                              fontWeight: "600",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              color: "var(--text-primary)",
                              maxWidth: "70%",
                              fontSize: "0.95rem",
                            }}
                          >
                            {chat.name}
                          </h3>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color:
                                chat.unread > 0
                                  ? "var(--unread-indicator)"
                                  : "var(--text-secondary)",
                              fontWeight: chat.unread > 0 ? "600" : "normal",
                            }}
                          >
                            {chat.time}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "4px",
                          }}
                        >
                          <p
                            style={{
                              margin: "0",
                              padding: "0",
                              fontSize: "0.85rem",
                              color: chat.typing
                                ? "var(--primary-light)"
                                : "var(--text-secondary)",
                              fontWeight: chat.typing ? "500" : "normal",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "70%",
                            }}
                          >
                            {chat.typing ? "typing..." : chat.lastMessage}
                          </p>
                          {chat.unread > 0 && (
                            <span
                              style={{
                                backgroundColor: "var(--unread-badge)",
                                color: "#FFFFFF",
                                borderRadius: "12px",
                                minWidth: "20px",
                                height: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                fontWeight: "600",
                                padding: "0 6px",
                              }}
                            >
                              {chat.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div
            className="chat-area"
            style={{
              flex: "1 1 0%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "var(--bg-primary)",
              width: isMobile && !showSidebar ? "100%" : "66.666667%",
              position: "relative",
            }}
          >
            <div
              className={isMobile ? "compact-header" : ""}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: isMobile ? "10px 16px" : "0.75rem 1rem",
                height: isMobile ? "auto" : "59px",
                minHeight: isMobile ? "52px" : "59px",
                backgroundColor: "var(--primary-color)",
                color: "var(--logo-text)",
                boxShadow: "var(--shadow-standard)",
                position: "relative",
                zIndex: 5,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? "12px" : "0.75rem",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {isMobile && !showSidebar && (
                  <button
                    className="icon-button"
                    style={{ 
                      color: "var(--logo-text)",
                      minWidth: "36px",
                      minHeight: "36px",
                      padding: "6px",
                      flexShrink: 0,
                    }}
                    onClick={() => setShowSidebar(true)}
                  >
                    <ArrowLeft size={18} />
                  </button>
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: isMobile ? "10px" : "0.75rem",
                    cursor: currentChat?.isGroup ? "pointer" : "default",
                    flex: 1,
                    minWidth: 0,
                  }}
                  onClick={() => {
                    if (currentChat?.isGroup) {
                      setActiveModal("groupMembers");
                    }
                  }}
                >
                  <Avatar
                    name={currentChat?.name || ""}
                    avatar={currentChat?.avatar || null}
                    isOnline={currentChat?.isOnline}
                    size={isMobile ? "sm" : "md"}
                  />
                  <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                    <h3
                      style={{
                        margin: "0",
                        padding: "0",
                        fontWeight: "600",
                        color: "var(--logo-text)",
                        fontSize: isMobile ? "15px" : "0.95rem",
                        lineHeight: isMobile ? "1.2" : "1.2",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "100%",
                      }}
                    >
                      {currentChat?.name}
                    </h3>
                    <p
                      style={{
                        margin: "0",
                        padding: "0",
                        fontSize: isMobile ? "12px" : "0.75rem",
                        color: "var(--logo-text)",
                        opacity: "0.8",
                        lineHeight: "1.1",
                        marginTop: isMobile ? "1px" : "0",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {currentChat?.typing
                        ? "typing..."
                        : currentChat?.isOnline
                        ? "Online"
                        : "Last seen today"}
                    </p>
                  </div>
                </div>
              </div>
              <div
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: isMobile ? "4px" : "0.5rem",
                  flexShrink: 0,
                }}
              >
                <button
                  className="icon-button"
                  style={{ 
                    color: "var(--logo-text)",
                    minWidth: isMobile ? "36px" : "auto",
                    minHeight: isMobile ? "36px" : "auto",
                    padding: isMobile ? "6px" : "0.5rem",
                  }}
                  title="Voice call"
                  onClick={() => setActiveModal("call")}
                >
                  <Phone size={isMobile ? 18 : 20} />
                </button>
                <button
                  className="icon-button"
                  style={{ 
                    color: "var(--logo-text)",
                    minWidth: isMobile ? "36px" : "auto",
                    minHeight: isMobile ? "36px" : "auto",
                    padding: isMobile ? "6px" : "0.5rem",
                  }}
                  title="Video call"
                  onClick={() => setActiveModal("video")}
                >
                  <Video size={isMobile ? 18 : 20} />
                </button>
                <button
                  className="icon-button"
                  style={{ 
                    color: "var(--logo-text)",
                    minWidth: isMobile ? "36px" : "auto",
                    minHeight: isMobile ? "36px" : "auto",
                    padding: isMobile ? "6px" : "0.5rem",
                  }}
                  title="Search in conversation"
                  onClick={handleChatSearchToggle}
                >
                  <Search size={isMobile ? 18 : 20} />
                </button>
              </div>
            </div>

            {showChatSearch && (
              <div
                className="chat-search-container chat-search-animation-enter"
                style={{
                  position: "absolute",
                  top: "59px",
                  left: 0,
                  right: 0,
                  backgroundColor: "var(--bg-secondary)",
                  padding: "0.75rem 1rem",
                  zIndex: 4,
                  boxShadow: "var(--shadow-standard)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  width: "100%",
                  borderBottom: "1px solid var(--border-color)",
                }}
              >
                <button
                  className="icon-button"
                  style={{ color: "var(--text-primary)" }}
                  onClick={handleChatSearchToggle}
                >
                  <ArrowLeft size={20} />
                </button>
                <input
                  ref={chatSearchInputRef}
                  type="text"
                  placeholder="Search in this conversation"
                  value={chatSearchTerm}
                  onChange={(e) => setChatSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "none",
                    backgroundColor: "var(--bg-input)",
                    color: "var(--text-primary)",
                    outline: "none",
                  }}
                />
                {chatSearchTerm && (
                  <span
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.85rem",
                    }}
                  >
                    {matchedMessages.length} matches
                  </span>
                )}
              </div>
            )}

            <div
              style={{
                flex: "1 1 0%",
                overflowY: "auto",
                padding: "1rem",
                backgroundColor: "var(--bg-chat)",
                paddingTop: showChatSearch ? "3.5rem" : "1rem",
                transition: "padding-top 0.3s ease",
              }}
              className="smooth-scroll flat-chat-bg"
            >
              {currentChat?.messages.map((message, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    marginBottom: "0.75rem",
                    justifyContent: message.isSent ? "flex-end" : "flex-start",
                    // Highlight search matches
                    backgroundColor:
                      chatSearchTerm &&
                      message.content
                        .toLowerCase()
                        .includes(chatSearchTerm.toLowerCase())
                        ? "rgba(255, 255, 0, 0.2)"
                        : "transparent",
                    padding:
                      chatSearchTerm &&
                      message.content
                        .toLowerCase()
                        .includes(chatSearchTerm.toLowerCase())
                        ? "0.5rem"
                        : "0",
                    borderRadius: "0.5rem",
                  }}
                >
                  <div
                    className={`chat-message ${
                      message.isSent
                        ? "chat-message-sent message-animation-sent"
                        : "chat-message-received message-animation-received"
                    }`}
                  >
                    {currentChat.isGroup &&
                      !message.isSent &&
                      message.sender && (
                        <div
                          style={{
                            fontWeight: "600",
                            marginBottom: "2px",
                            color: getNameColor(message.sender),
                            fontSize: "0.8rem",
                          }}
                        >
                          {message.sender}
                        </div>
                      )}
                    {message.isTyping ? (
                      <TypingIndicator />
                    ) : (
                      <p
                        style={{
                          margin: "0",
                          padding: "0",
                          fontSize: "0.9rem",
                          color: "var(--text-primary)",
                          wordBreak: "break-word",
                        }}
                      >
                        {message.content}
                      </p>
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: "4px",
                        marginTop: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.7rem",
                          lineHeight: "1",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {message.timestamp}
                      </span>
                      {message.isSent && message.status && (
                        <span style={{ display: "flex", alignItems: "center" }}>
                          <MessageStatus status={message.status} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {currentChat?.typing && (
                <div
                  style={{
                    display: "flex",
                    marginBottom: "1rem",
                    justifyContent: "flex-start",
                  }}
                >
                  <div className="chat-message chat-message-received message-animation-received">
                    <TypingIndicator />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {showEmojiPicker && (
              <div
                className="emoji-picker"
                style={{
                  position: "absolute",
                  bottom: "70px",
                  left: isMobile ? "10px" : "calc(33.333333% + 10px)",
                  width: isMobile ? "calc(100% - 20px)" : "300px",
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "1rem",
                  padding: "0.75rem",
                  zIndex: 50,
                  boxShadow: "var(--shadow-elevated)",
                  animation: "fadeIn 0.2s ease-out",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(6, 1fr)",
                    gap: "0.5rem",
                  }}
                >
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      className="icon-button"
                      style={{
                        fontSize: "1.5rem",
                        width: "2.5rem",
                        height: "2.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() => {
                        setNewMessage((prev) => prev + emoji);
                        setShowEmojiPicker(false);
                        messageInputRef.current?.focus();
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input area */}
            <div
              className={isMobile ? "mobile-input-container" : ""}
              style={{
                padding: isMobile ? "0.75rem" : "0.75rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: isMobile ? "0.375rem" : "0.5rem",
                backgroundColor: "var(--bg-secondary)",
                borderTop: "1px solid var(--border-color)",
                minHeight: isMobile ? "4rem" : "auto",
              }}
            >
              <button
                className="icon-button"
                style={{ color: "var(--text-secondary)" }}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                title="Emoji"
              >
                <Smile size={22} />
              </button>
              <button
                className="icon-button"
                style={{ color: "var(--text-secondary)" }}
                title="Attach"
                onClick={() => setActiveModal("attachments")}
              >
                <Paperclip size={22} />
              </button>
              <input
                ref={messageInputRef}
                type="text"
                className="chat-input"
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <button
                className="primary-button"
                title={
                  newMessage.trim() === "" ? "Voice input" : "Send message"
                }
                onClick={
                  newMessage.trim() === ""
                    ? toggleVoiceInput
                    : handleSendMessage
                }
                style={{
                  backgroundColor: isRecording
                    ? "var(--error-color)"
                    : "var(--primary-color)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {isRecording ? (
                  <>
                    <div
                      style={{
                        animation: "pulse 1.5s infinite",
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        borderRadius: "50%",
                      }}
                    />
                    <Mic2 size={22} />
                  </>
                ) : newMessage.trim() === "" ? (
                  <Mic size={22} />
                ) : (
                  <Send size={22} />
                )}
              </button>
            </div>

            {/* Voice recording indicator */}
            {isRecording && (
              <div
                style={{
                  position: "absolute",
                  bottom: "70px",
                  right: "20px",
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  padding: "0.5rem 1rem",
                  borderRadius: "2rem",
                  boxShadow: "var(--shadow-elevated)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  animation: "fadeIn 0.2s ease-out",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: "var(--error-color)",
                    borderRadius: "50%",
                    animation: "pulse 1.5s infinite",
                  }}
                />
                <span>Recording... {formatRecordingTime(recordingTime)}</span>
                <button
                  className="icon-button"
                  onClick={toggleVoiceInput}
                  style={{ color: "var(--error-color)" }}
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* modals */}
      <CallModal
        isOpen={activeModal === "call"}
        onClose={() => setActiveModal("none")}
        name={currentChat?.name || ""}
        avatar={currentChat?.avatar || null}
        isVideo={false}
      />

      <CallModal
        isOpen={activeModal === "video"}
        onClose={() => setActiveModal("none")}
        name={currentChat?.name || ""}
        avatar={currentChat?.avatar || null}
        isVideo={true}
      />

      <Modal
        isOpen={activeModal === "groupMembers"}
        onClose={() => setActiveModal("none")}
        title={`${currentChat?.name || ""} - ${
          currentChat?.members?.length || 0
        } members`}
      >
        <div style={{ marginBottom: "1rem" }}>
          {currentChat?.description && (
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                marginBottom: "1rem",
              }}
            >
              {currentChat.description}
            </p>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.5rem 0",
              cursor: "pointer",
              color: "var(--primary-color)",
              fontWeight: "500",
            }}
            onClick={handleAddMember}
          >
            <UserPlus size={20} style={{ marginRight: "0.5rem" }} />
            <span>Add members</span>
          </div>
        </div>

        <h4
          style={{
            margin: "1.5rem 0 0.5rem",
            color: "var(--text-primary)",
            fontSize: "0.95rem",
          }}
        >
          Members
        </h4>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {currentChat?.members?.map((member) => (
            <div
              key={member.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                backgroundColor: "var(--bg-secondary)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <Avatar
                  name={member.name}
                  avatar={member.avatar}
                  size="sm"
                  isOnline={member.isOnline}
                />
                <div>
                  <div
                    style={{ fontWeight: "500", color: "var(--text-primary)" }}
                  >
                    {member.name}{" "}
                    {member.role && (
                      <span
                        style={{
                          color: "var(--primary-color)",
                          fontSize: "0.8rem",
                          marginLeft: "0.25rem",
                        }}
                      >
                        {member.role}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {member.isOnline ? "Online" : member.lastSeen}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Attachments Modal */}
      <Modal
        isOpen={activeModal === "attachments"}
        onClose={() => setActiveModal("none")}
        title="Send attachment"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {attachmentOptions.map((option) => (
            <div
              key={option.type}
              className="attachment-option"
              onClick={() => handleAttachmentSelect(option.type)}
            >
              <div
                className="attachment-icon"
                style={{
                  backgroundColor: getNameColor(option.label),
                  color: "white",
                }}
              >
                {option.icon}
              </div>
              <div style={{ color: "var(--text-primary)" }}>{option.label}</div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Notification container */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          zIndex: 1000,
        }}
      >
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onClose={() =>
              setNotifications((prev) =>
                prev.filter((n) => n.id !== notification.id)
              )
            }
          />
        ))}
      </div>
    </ThemeContext.Provider>
  );
}
"use client";

import React, {
  ReactNode,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Legend,
  Area,
  Bar,
  BarChart,
  Cell,
} from "recharts";
import {
  AudioWaveform,
  Clock,
  Satellite,
  AlertTriangle,
  TrendingUp,
  Globe,
  Download,
  Info,
  Menu,
  X,
  ExternalLink,
  Bell,
  Shield,
  Zap,
  Radio,
  Sun,
  Moon,
  ChevronRight,
  Database,
  Users,
  Mail,
  Github,
  Twitter,
  Linkedin,
  Activity,
  BarChart3,
  Settings,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

type ColorType =
  | "default"
  | "accent"
  | "danger"
  | "warning"
  | "active"
  | "success"
  | "info";
type ColorValue = {
  hex: string;
  twBg: string;
  twBgHover: string;
  twText: string;
  twBorder: string;
};

const palette: Record<ColorType, ColorValue> = {
  default: {
    hex: "#ffffff",
    twBg: "bg-white/10",
    twBgHover: "hover:bg-white/20",
    twText: "text-white",
    twBorder: "border-white/20",
  },
  accent: {
    hex: "#00d4ff",
    twBg: "bg-cyan-400/20",
    twBgHover: "hover:bg-cyan-400/30",
    twText: "text-cyan-400",
    twBorder: "border-cyan-400/30",
  },
  danger: {
    hex: "#ff4757",
    twBg: "bg-red-500/20",
    twBgHover: "hover:bg-red-500/30",
    twText: "text-red-400",
    twBorder: "border-red-500/30",
  },
  warning: {
    hex: "#ffa502",
    twBg: "bg-orange-400/20",
    twBgHover: "hover:bg-orange-400/30",
    twText: "text-orange-400",
    twBorder: "border-orange-400/30",
  },
  active: {
    hex: "#ff6b6b",
    twBg: "bg-rose-500/20",
    twBgHover: "hover:bg-rose-500/30",
    twText: "text-rose-400",
    twBorder: "border-rose-500/30",
  },
  success: {
    hex: "#2ed573",
    twBg: "bg-green-500/20",
    twBgHover: "hover:bg-green-500/30",
    twText: "text-green-400",
    twBorder: "border-green-500/30",
  },
  info: {
    hex: "#5352ed",
    twBg: "bg-indigo-500/20",
    twBgHover: "hover:bg-indigo-500/30",
    twText: "text-indigo-400",
    twBorder: "border-indigo-500/30",
  },
};

type Region = "Global" | "Asia" | "Europe" | "Americas" | "Oceania" | "Africa";
type FlareIntensity = "xClass" | "mClass" | "cClass";
type SolarWind = "speed" | "density";
type SatelliteStatus = "operational" | "degraded" | "offline";
type ToastType = "info" | "success" | "warning" | "error";

interface FlareData {
  time: string;
  xClass: number;
  mClass: number;
  cClass: number;
  timestamp?: Date;
}

interface SolarWindData {
  time: string;
  speed: number;
  density: number;
  timestamp?: Date;
}

interface KPData {
  time: string;
  kpIndex: number;
  aurora: number;
  timestamp?: Date;
}

interface SatelliteData {
  id: string;
  name: string;
  status: SatelliteStatus;
  lastUpdate: Date;
  dataQuality: number;
}

interface SpaceWeatherAlert {
  id: string;
  type: "geomagnetic" | "solar" | "radiation";
  severity: "minor" | "moderate" | "strong" | "severe";
  title: string;
  description: string;
  timestamp: Date;
  isActive: boolean;
}

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

const allRegions: Region[] = [
  "Global",
  "Asia",
  "Europe",
  
  
  
];

const flareIntensityLabel: Record<FlareIntensity, string> = {
  xClass: "X-Class",
  mClass: "M-Class",
  cClass: "C-Class",
};

const solarWindLabel: Record<SolarWind, string> = {
  density: "Density",
  speed: "Speed",
};

const generateFlareData = (time: string, maxRatio = 1): FlareData => ({
  time,
  xClass: Math.floor(Math.random() * 3 * maxRatio),
  mClass: Math.floor(Math.random() * 10 * maxRatio),
  cClass: Math.floor(Math.random() * 20 * maxRatio),
  timestamp: new Date(),
});

const generateSolarWindData = (time: string, maxRatio = 0): SolarWindData => ({
  time,
  speed: (Math.random() * 700 + 300) * (maxRatio ? 1 + maxRatio / 10 : 1),
  density: Math.random() * 15 + 1 + (maxRatio ? maxRatio * 3 : 0),
  timestamp: new Date(),
});

const generateKpData = (time: string): KPData => ({
  time,
  kpIndex: Math.random() * 8 + 1,
  aurora: Math.random() * 100,
  timestamp: new Date(),
});

const mockSatellites: SatelliteData[] = [
  {
    id: "ACE",
    name: "Advanced Composition Explorer",
    status: "operational",
    lastUpdate: new Date(),
    dataQuality: 98,
  },
  {
    id: "WIND",
    name: "Wind Spacecraft",
    status: "operational",
    lastUpdate: new Date(),
    dataQuality: 95,
  },
  {
    id: "SOHO",
    name: "Solar and Heliospheric Observatory",
    status: "degraded",
    lastUpdate: new Date(),
    dataQuality: 87,
  },
  {
    id: "DSCOVR",
    name: "Deep Space Climate Observatory",
    status: "operational",
    lastUpdate: new Date(),
    dataQuality: 92,
  },
];

const alertTemplates = [
  {
    type: "geomagnetic" as const,
    severity: "moderate" as const,
    title: "Geomagnetic Storm Watch",
    description: "Moderate geomagnetic storming possible due to CME arrival",
  },
  {
    type: "solar" as const,
    severity: "minor" as const,
    title: "Solar Flare Activity",
    description: "Increased C-class flare activity observed",
  },
  {
    type: "radiation" as const,
    severity: "strong" as const,
    title: "Radiation Storm Warning",
    description: "High-energy proton event in progress",
  },
  {
    type: "geomagnetic" as const,
    severity: "severe" as const,
    title: "Severe Geomagnetic Storm",
    description: "G4 conditions observed - infrastructure impacts possible",
  },
  {
    type: "solar" as const,
    severity: "moderate" as const,
    title: "M-Class Solar Flare",
    description: "M5.2 solar flare detected - radio blackout possible",
  },
];


const flareDataByRegion: Record<Region, FlareData[]> = allRegions.reduce(
  (acc, region) => {
    acc[region] = ["24H", "20H", "16H", "12H", "8H", "4H"].map((time) =>
      generateFlareData(time)
    );
    return acc;
  },
  {} as Record<Region, FlareData[]>
);

const solarWindDataByRegion: Record<Region, SolarWindData[]> =
  allRegions.reduce((acc, region) => {
    acc[region] = ["24H", "20H", "16H", "12H", "8H", "4H"].map((time) =>
      generateSolarWindData(time)
    );
    return acc;
  }, {} as Record<Region, SolarWindData[]>);

const kpDataByRegion: Record<Region, KPData[]> = allRegions.reduce(
  (acc, region) => {
    acc[region] = ["-6D", "-5D", "-4D", "-3D", "-2D", "-1D"].map((time) =>
      generateKpData(time)
    );
    return acc;
  },
  {} as Record<Region, KPData[]>
);

const styles = `
  @import url('https:

  .font-exo-2 {
  font-family: 'Exo 2', 'Rajdhani', 'Inter', sans-serif;
}

 .scrollbar-thin {
    scrollbar-width: thin;
  }
  
  .scrollbar-thumb-cyan-500\/50::-webkit-scrollbar-thumb {
    background-color: rgba(6, 182, 212, 0.5);
    border-radius: 6px;
  }
  
  .scrollbar-track-transparent::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: rgba(6, 182, 212, 0.5);
    border-radius: 6px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
    opacity: 0;
    transform: translateY(20px);
  }
  
  .fade-in-down {
    animation: fadeInDown 0.8s ease-out forwards;
    opacity: 0;
    transform: translateY(-50px);
  }
  
  .slide-in-right {
    animation: slideInRight 0.5s ease-out forwards;
    transform: translateX(100%);
  }
  
  .slide-out-right {
    animation: slideOutRight 0.5s ease-out forwards;
    transform: translateX(0);
  }
  
  .slide-in-up {
    animation: slideInUp 0.3s ease-out forwards;
    transform: translateY(100%);
  }
  
  .slide-out-down {
    animation: slideOutDown 0.3s ease-out forwards;
    transform: translateY(0);
  }
  
  .glow-pulse {
    animation: glowPulse 2s ease-in-out infinite;
  }
  
  .float {
    animation: float 6s ease-in-out infinite;
  }
  
  .shimmer {
    animation: shimmer 2s linear infinite;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    background-size: 200% 100%;
  }
  
  .bounce-in {
    animation: bounceIn 0.6s ease-out forwards;
    transform: scale(0);
  }
  
  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInDown {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInRight {
    to {
      transform: translateX(0);
    }
  }
  
  @keyframes slideOutRight {
    to {
      transform: translateX(100%);
    }
  }
  
  @keyframes slideInUp {
    to {
      transform: translateY(0);
    }
  }
  
  @keyframes slideOutDown {
    to {
      transform: translateY(100%);
    }
  }
  
  @keyframes glowPulse {
    0%, 100% {
      box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
    }
    50% {
      box-shadow: 0 0 40px rgba(0, 212, 255, 0.6);
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  @keyframes bounceIn {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
  
  .stagger-1 { animation-delay: 0.1s; }
  .stagger-2 { animation-delay: 0.2s; }
  .stagger-3 { animation-delay: 0.3s; }
  .stagger-4 { animation-delay: 0.4s; }
  .stagger-5 { animation-delay: 0.5s; }
  .stagger-6 { animation-delay: 0.6s; }
  
  body.no-scroll {
    overflow: hidden;
  }
`;

const spaceFont = {
  className: "font-['Orbitron',_monospace]",
};
const contentFont = {
  className: "font-['Space_Grotesk',_sans-serif]",
};

function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            slide-in-up max-w-sm p-4 rounded-lg shadow-lg backdrop-blur-xl border
            ${
              toast.type === "success"
                ? "bg-green-500/20 border-green-500/30 text-green-400"
                : toast.type === "error"
                ? "bg-red-500/20 border-red-500/30 text-red-400"
                : toast.type === "warning"
                ? "bg-orange-500/20 border-orange-500/30 text-orange-400"
                : "bg-blue-500/20 border-blue-500/30 text-blue-400"
            }
          `}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {toast.type === "success" && <CheckCircle className="h-5 w-5" />}
              {toast.type === "error" && <XCircle className="h-5 w-5" />}
              {toast.type === "warning" && (
                <AlertTriangle className="h-5 w-5" />
              )}
              {toast.type === "info" && <Info className="h-5 w-5" />}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{toast.title}</p>
              <p className="text-xs opacity-80">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 hover:opacity-70 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Card({
  children,
  className = "",
  Wrapper = "div",
  onClick,
  isGlowing = false,
  animationClass = "fade-in-up",
  isClickable = false,
}: {
  children: ReactNode;
  className?: string;
  Wrapper?: "div" | "button";
  onClick?: () => void;
  isGlowing?: boolean;
  animationClass?: string;
  isClickable?: boolean;
}) {
  const Component = Wrapper === "div" ? "div" : "button";

  return (
    <Component
      onClick={onClick}
      className={`
        ${className} ${animationClass}
        backdrop-blur-xl bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent 
        border border-white/10 shadow-2xl rounded-xl
        ${isGlowing ? "glow-pulse border-cyan-500/30" : ""}
        hover:border-white/20 transition-all duration-300
        hover:transform hover:scale-[1.02]
        ${onClick || isClickable ? "cursor-pointer" : ""}
      `}
    >
      {children}
    </Component>
  );
}

function LoadingSpinner({ size = "w-6 h-6" }: { size?: string }) {
  return (
    <div
      className={`${size} border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto`}
    />
  );
}

function StatusIndicator({
  status,
  label,
  size = "w-3 h-3",
}: {
  status: "online" | "warning" | "error";
  label?: string;
  size?: string;
}) {
  const colors = {
    online: "bg-green-400 shadow-green-400/50",
    warning: "bg-orange-400 shadow-orange-400/50",
    error: "bg-red-400 shadow-red-400/50",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${size} ${colors[status]} rounded-full animate-pulse shadow-lg`}
      />
      {label && (
        <span className="text-xs uppercase tracking-wider">{label}</span>
      )}
    </div>
  );
}

function AlertBadge({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  return (
    <div
      className="fixed bottom-6 right-6 z-40 cursor-pointer bounce-in"
      onClick={onClick}
    >
      <div className="relative">
        <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 glow-pulse shadow-cyan-500/25">
          <Bell className="h-6 w-6 text-white" />
        </div>
        {count > 0 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-slate-800">
            {count > 99 ? "99+" : count}
          </div>
        )}
      </div>
    </div>
  );
}


function Header({
  onMenuToggle,
  onAboutToggle,
  showToast,
}: {
  onMenuToggle: () => void;
  onAboutToggle: () => void;
  showToast: (toast: Omit<Toast, "id">) => void;
}) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative z-50 mb-8">
      <Card className="p-6" animationClass="fade-in-down">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative float">
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur animate-pulse" />
              <AudioWaveform className="relative h-8 w-8 text-cyan-400" />
            </div>
            <div>
              <h1
                className={`text-2xl font-bold text-cyan-400 tracking-wider ${spaceFont.className}`}
              >
                NEBULA<span className="text-white">PULSE</span>
              </h1>
              <p className="text-xs text-gray-400 uppercase tracking-widest">
                Advanced Space Weather Monitoring
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onAboutToggle}
              className="text-sm hover:text-cyan-400 transition-colors duration-200 cursor-pointer"
            >
              <Info />
            </button>
            <div className="hidden md:block text-right">
              <div className="text-sm font-mono">
                {time.toISOString().split("T")[0]}{" "}
                {time.toTimeString().split(" ")[0]} UTC
              </div>
              <StatusIndicator status="online" label="Live Data" />
            </div>
          </div>
        </div>
      </Card>
    </header>
  );
}


function SideDrawer({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string | ReactNode;
  children: ReactNode;
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
            onClick={onClose}
          />
          <div
            className={`
              fixed right-0 top-0 h-full w-full max-w-md 
              bg-slate-900/95 backdrop-blur-xl border-l border-white/10 z-50 
              overflow-y-auto transition-transform duration-500 ease-out
              ${isOpen ? "slide-in-right" : "slide-out-right"}
            `}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-xl font-bold text-cyan-400 ${spaceFont.className}`}
                >
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {children}
            </div>
          </div>
        </>
      )}
    </>
  );
}


const CustomTooltip = React.memo(({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="backdrop-blur-xl bg-slate-900/90 border border-white/20 rounded-lg p-4 shadow-2xl">
        <p className="font-medium mb-2 text-cyan-400">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between gap-4">
            <span>{entry.name}:</span>
            <span style={{ color: entry.color }} className="font-bold">
              {typeof entry.value === "number"
                ? entry.value.toFixed(1)
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
});


const FlareChart = React.memo(
  ({ data, filter }: { data: FlareData[]; filter: FlareIntensity | null }) => (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          <linearGradient id="xClassGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={palette.danger.hex}
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor={palette.danger.hex}
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="mClassGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={palette.warning.hex}
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor={palette.warning.hex}
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="cClassGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={palette.accent.hex}
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor={palette.accent.hex}
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="time" stroke="#fff" fontSize={12} />
        <YAxis stroke="#fff" fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {(!filter || filter === "xClass") && (
          <Area
            type="monotone"
            dataKey="xClass"
            name="X-Class"
            stroke={palette.danger.hex}
            fill="url(#xClassGradient)"
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        )}
        {(!filter || filter === "mClass") && (
          <Area
            type="monotone"
            dataKey="mClass"
            name="M-Class"
            stroke={palette.warning.hex}
            fill="url(#mClassGradient)"
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        )}
        {(!filter || filter === "cClass") && (
          <Area
            type="monotone"
            dataKey="cClass"
            name="C-Class"
            stroke={palette.accent.hex}
            fill="url(#cClassGradient)"
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  )
);


const SolarWindChart = React.memo(
  ({ data, filter }: { data: SolarWindData[]; filter: SolarWind | null }) => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="time" stroke="#fff" fontSize={12} />
        <YAxis yAxisId="left" stroke="#fff" fontSize={12} />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="#fff"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {(!filter || filter === "speed") && (
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="speed"
            name="Speed (km/s)"
            stroke={palette.accent.hex}
            strokeWidth={3}
            dot={{ fill: palette.accent.hex, strokeWidth: 2, r: 4 }}
            isAnimationActive={true}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        )}
        {(!filter || filter === "density") && (
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="density"
            name="Density (p/cm³)"
            stroke={palette.warning.hex}
            strokeWidth={3}
            dot={{ fill: palette.warning.hex, strokeWidth: 2, r: 4 }}
            isAnimationActive={true}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
);


const AuroraChart = React.memo(({ data }: { data: KPData[] }) => {
  const currentKp = data[data.length - 1]?.kpIndex || 0;
  const getKpLevel = (value: number) => {
    if (value < 4) return { level: "Quiet", color: palette.success };
    if (value < 5) return { level: "Unsettled", color: palette.warning };
    if (value < 6) return { level: "Active", color: palette.danger };
    return { level: "Storm", color: palette.active };
  };

  const kpLevel = getKpLevel(currentKp);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 text-center">
          <div className={`text-2xl font-bold ${kpLevel.color.twText}`}>
            {currentKp.toFixed(1)}
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">
            Kp Index
          </div>
        </Card>
        <Card className="p-4 text-center">
          <div className={`text-2xl font-bold ${kpLevel.color.twText}`}>
            {kpLevel.level}
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">
            Activity Level
          </div>
        </Card>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="time" stroke="#fff" fontSize={10} />
          <YAxis stroke="#fff" fontSize={10} />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="kpIndex"
            fill={palette.accent.hex}
            radius={[4, 4, 0, 0]}
            isAnimationActive={true}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getKpLevel(entry.kpIndex).color.hex}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

export default function NebulaPulse() {
  const [flareFilter, setFlareFilter] = useState<FlareIntensity | null>(null);
  const [solarWindFilter, setSolarWindFilter] = useState<SolarWind | null>(
    null
  );
  const [region, setRegion] = useState<Region>("Global");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isDataDrawerOpen, setIsDataDrawerOpen] = useState(false);
  const [isAlertsDrawerOpen, setIsAlertsDrawerOpen] = useState(false);
  const [selectedDataType, setSelectedDataType] = useState<string>("");
  const [isAlertDetailOpen, setIsAlertDetailOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<SpaceWeatherAlert | null>(
    null
  );
  const [detailOpenedFrom, setDetailOpenedFrom] = useState<"main" | "alerts">(
    "main"
  );

  const [flareData, setFlareData] = useState<FlareData[]>(() => [
    ...flareDataByRegion["Global"],
    generateFlareData("Now", 2),
  ]);
  const [solarWindData, setSolarWindData] = useState<SolarWindData[]>(() => [
    ...solarWindDataByRegion["Global"],
    generateSolarWindData("Now", 2),
  ]);
  const [kpData, setKpData] = useState<KPData[]>(() => [
    ...kpDataByRegion["Global"],
    generateKpData("Today"),
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [alerts, setAlerts] = useState<SpaceWeatherAlert[]>([]);

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration || 5000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const generateAlert = () => {
      const template =
        alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
      const alert: SpaceWeatherAlert = {
        id: Math.random().toString(36).substr(2, 9),
        ...template,
        timestamp: new Date(),
        isActive: true,
      };
      setAlerts((prev) => [alert, ...prev.slice(0, 9)]);
    };

    setAlerts([
      {
        id: "1",
        type: "geomagnetic",
        severity: "moderate",
        title: "Geomagnetic Storm Watch",
        description:
          "Moderate geomagnetic storming possible due to CME arrival",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        id: "2",
        type: "solar",
        severity: "minor",
        title: "Solar Flare Activity",
        description: "Increased C-class flare activity observed",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isActive: true,
      },
    ]);

    const alertInterval = setInterval(generateAlert, 10000);

    return () => clearInterval(alertInterval);
  }, []);

  const updateFlareData = useCallback((newRegion: Region) => {
    setFlareData([
      ...flareDataByRegion[newRegion],
      generateFlareData("Now", 2),
    ]);
  }, []);

  const updateSolarWindData = useCallback((newRegion: Region) => {
    setSolarWindData([
      ...solarWindDataByRegion[newRegion],
      generateSolarWindData("Now", 2),
    ]);
  }, []);

  const updateKpData = useCallback((newRegion: Region) => {
    setKpData([...kpDataByRegion[newRegion], generateKpData("Today")]);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      updateFlareData(region);
      updateSolarWindData(region);
      updateKpData(region);
      setIsLoading(false);
    }, 1000);

    const interval = setInterval(() => {
      updateFlareData(region);
      updateSolarWindData(region);
      updateKpData(region);
    }, 10000);

    return () => clearInterval(interval);
  }, [region, updateFlareData, updateSolarWindData, updateKpData]);

  const flareFilterOptions = useMemo(
    () => [
      { value: null, label: "All Classes" },
      { value: "xClass" as FlareIntensity, label: "X-Class" },
      { value: "mClass" as FlareIntensity, label: "M-Class" },
      { value: "cClass" as FlareIntensity, label: "C-Class" },
    ],
    []
  );

  const solarWindFilterOptions = useMemo(
    () => [
      { value: null, label: "Both" },
      { value: "speed" as SolarWind, label: "Speed" },
      { value: "density" as SolarWind, label: "Density" },
    ],
    []
  );

  const memoizedFlareData = useMemo(() => flareData, [flareData]);
  const memoizedSolarWindData = useMemo(() => solarWindData, [solarWindData]);
  const memoizedKpData = useMemo(() => kpData, [kpData]);

  const activeAlertsCount = alerts.filter((alert) => alert.isActive).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-800 flex items-center justify-center">
        <style>{styles}</style>
        <div className="text-center space-y-4">
          <LoadingSpinner size="w-12 h-12" />
          <p className={`text-cyan-400 ${spaceFont.className} shimmer`}>
            Initializing Space Weather Systems...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main
      className={`${contentFont.className} min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-800 text-white relative overflow-x-hidden`}
    >
      <style>{styles}</style>

      {/* space star background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/40 to-slate-900" />
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Header
          onMenuToggle={() => setIsMenuOpen(true)}
          onAboutToggle={() => setIsAboutOpen(true)}
          showToast={showToast}
        />

        {/* Alert Banner */}
        <div className="mb-8">
          <Card
            className="p-4 border-orange-500/30 bg-orange-500/10 stagger-1"
            animationClass="fade-in-up"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-400 animate-pulse" />
              <div>
                <p className="font-medium text-orange-400">
                  Geomagnetic Storm Watch
                </p>
                <p className="text-sm text-gray-300">
                  Moderate geomagnetic storming possible due to CME arrival -
                  Aurora visibility enhanced
                </p>
              </div>
              <div className="ml-auto">
                <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs">
                  ACTIVE
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card
            className="p-4 text-center stagger-1"
            animationClass="fade-in-up"
            isClickable
          >
            <Satellite className="h-6 w-6 text-cyan-400 mx-auto mb-2 float" />
            <div className="text-lg font-bold">4</div>
            <div className="text-xs text-gray-400">Active Satellites</div>
            <StatusIndicator status="online" />
          </Card>
          <Card
            className="p-4 text-center stagger-2"
            animationClass="fade-in-up"
            isClickable
          >
            <Activity className="h-6 w-6 text-green-400 mx-auto mb-2 float" />
            <div className="text-lg font-bold">98%</div>
            <div className="text-xs text-gray-400">Data Quality</div>
            <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
              <div
                className="bg-green-400 h-1 rounded-full transition-all duration-1000"
                style={{ width: "98%" }}
              ></div>
            </div>
          </Card>
          <Card
            className="p-4 text-center stagger-3"
            animationClass="fade-in-up"
            isClickable
          >
            <Bell className="h-6 w-6 text-orange-400 mx-auto mb-2 float" />
            <div className="text-lg font-bold">{activeAlertsCount}</div>
            <div className="text-xs text-gray-400">Active Alerts</div>
            <StatusIndicator status="warning" />
          </Card>
          <Card
            className="p-4 text-center stagger-4"
            animationClass="fade-in-up"
            isClickable
          >
            <Globe className="h-6 w-6 text-blue-400 mx-auto mb-2 float" />
            <div className="text-lg font-bold">{region}</div>
            <div className="text-xs text-gray-400">Current Region</div>
          </Card>
        </div>

        {/* Region Selector */}

        <div className="mb-8">
          <Card className="p-2 stagger-1" animationClass="fade-in-up">
            <div className="grid grid-cols-3 gap-1">
              {allRegions.map((r, index) => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={`
            py-3 px-2 text-sm rounded-lg transition-all duration-300 cursor-pointer
            hover:transform hover:scale-105 relative
            ${
              region === r
                ? "bg-gradient-to-r from-cyan-500/40 to-blue-500/40 text-white border-2 border-cyan-400/60 shadow-lg shadow-cyan-500/25"
                : "hover:bg-white/10 text-gray-300 border border-transparent"
            }
            fade-in-up stagger-${index + 1}
          `}
                >
                  {region === r && (
                    <div className="absolute inset-0 bg-cyan-400/10 rounded-lg animate-pulse" />
                  )}
                  <span className="relative z-10 font-medium">{r}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Charts Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Solar Flare Chart */}
          <Card
            className="lg:col-span-2 p-6 stagger-2"
            animationClass="fade-in-up"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-3">
                <Sun className="h-6 w-6 text-orange-400 animate-pulse" />
                <h3 className={`text-xl font-bold ${spaceFont.className}`}>
                  Solar Flare Activity
                </h3>
                <button
                  onClick={() => {
                    setSelectedDataType("Solar Flare Metadata");
                    setIsDataDrawerOpen(true);
                  }}
                  className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
                >
                  <Info className="h-4 w-4 text-gray-400" />
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {flareFilterOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => setFlareFilter(option.value)}
                    className={`
                      px-3 py-1 text-xs rounded-lg transition-all duration-200 cursor-pointer
                      hover:transform hover:scale-105
                      ${
                        flareFilter === option.value
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          : "bg-white/10 hover:bg-white/20 text-gray-300"
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-80">
              <FlareChart data={memoizedFlareData} filter={flareFilter} />
            </div>
          </Card>

          {/* Aurora Forecast */}
          <Card className="p-6 stagger-3" animationClass="fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="h-6 w-6 text-green-400 animate-pulse" />
              <h3 className={`text-xl font-bold ${spaceFont.className}`}>
                Aurora Forecast
              </h3>
              <button
                onClick={() => {
                  setSelectedDataType("Aurora Forecast Data");
                  setIsDataDrawerOpen(true);
                }}
                className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
              >
                <Info className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <AuroraChart data={memoizedKpData} />
          </Card>
        </div>

        {/* Solar Wind Chart */}
        <Card
          className="px-4 py-6 md:px-6 mb-8 stagger-4"
          animationClass="fade-in-up"
        >
          {" "}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              <Radio className="h-6 w-6 text-blue-400 animate-pulse" />
              <h3 className={`text-xl font-bold ${spaceFont.className}`}>
                Solar Wind Parameters
              </h3>
              <button
                onClick={() => {
                  setSelectedDataType("Solar Wind Metadata");
                  setIsDataDrawerOpen(true);
                }}
                className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
              >
                <Info className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {solarWindFilterOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setSolarWindFilter(option.value)}
                  className={`
            px-3 py-1 text-xs rounded-lg transition-all duration-200 cursor-pointer
            hover:transform hover:scale-105
            ${
              solarWindFilter === option.value
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "bg-white/10 hover:bg-white/20 text-gray-300"
            }
          `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="h-80">
            <SolarWindChart
              data={memoizedSolarWindData}
              filter={solarWindFilter}
            />
          </div>
        </Card>

        {/* Space Weather News Feed */}
        <Card className="p-6 mb-8 stagger-6" animationClass="fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="h-6 w-6 text-yellow-400 animate-pulse" />
            <h3 className={`text-xl font-bold ${spaceFont.className}`}>
              Latest Space Weather Alerts
            </h3>
            <div className="ml-auto hidden md:block">
              <button
                onClick={() => setIsAlertsDrawerOpen(true)}
                className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs cursor-pointer hover:bg-yellow-500/30 transition-colors"
              >
                <Bell className="h-3 w-3" />
                View All ({alerts.length})
              </button>
            </div>
          </div>

          {/* Scrollable container for all alerts */}
          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/50 scrollbar-track-transparent space-y-4 pr-2">
            {alerts.map((alert, index) => (
              <div
                key={alert.id}
                onClick={() => {
                  setSelectedAlert(alert);
                  setDetailOpenedFrom("main");
                  setIsAlertDetailOpen(true);
                }}
                className={`
          p-4 rounded-lg border-l-4 bg-white/5 fade-in-up stagger-${index + 1} 
          cursor-pointer hover:bg-white/10 hover:scale-[1.003] transition-all duration-200
          ${
            alert.severity === "severe"
              ? "border-l-red-500"
              : alert.severity === "strong"
              ? "border-l-orange-500"
              : alert.severity === "moderate"
              ? "border-l-yellow-500"
              : "border-l-blue-500"
          }
        `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs uppercase tracking-wider font-medium ${
                          alert.severity === "severe"
                            ? "bg-red-500/20 text-red-400"
                            : alert.severity === "strong"
                            ? "bg-orange-500/20 text-orange-400"
                            : alert.severity === "moderate"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          alert.type === "geomagnetic"
                            ? "bg-purple-500/20 text-purple-400"
                            : alert.type === "solar"
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {alert.type}
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <h4 className={`font-medium mb-1 ${contentFont.className}`}>
                      {alert.title}
                    </h4>
                    <p
                      className={`text-sm text-gray-400 line-clamp-2 ${contentFont.className}`}
                    >
                      {alert.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p
                        className={`text-xs text-gray-500 ${contentFont.className}`}
                      >
                        {alert.timestamp.toLocaleDateString()}
                      </p>
                      <span className="text-xs text-cyan-400 opacity-60">
                        Click for details →
                      </span>
                    </div>
                  </div>
                  {alert.isActive && (
                    <div className="flex flex-col items-center ml-4">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                      <span className="text-xs text-green-400 mt-1">LIVE</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {alerts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No alerts available</p>
              </div>
            )}
          </div>
        </Card>

        {/* Footer */}
        <footer className="border-t border-white/10 pt-8">
          <Card className="p-6 stagger-1" animationClass="fade-in-up">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="space-y-3">
                <h4
                  className={`font-bold text-cyan-400 mb-3 ${spaceFont.className}`}
                >
                  NebulaPulse
                </h4>
                <p className="text-sm text-gray-400">
                  Advanced space weather monitoring for a connected world.
                  Protecting Earth from cosmic phenomena.
                </p>
                <div className="flex items-center gap-2 text-xs text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  All systems operational
                </div>
              </div>
              <div>
                <h5 className="font-medium mb-3">Data Sources</h5>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li className="flex items-center gap-2">
                    <Satellite className="h-3 w-3" />
                    NOAA SWPC
                  </li>
                  <li className="flex items-center gap-2">
                    <Satellite className="h-3 w-3" />
                    ESA Space Weather
                  </li>
                  <li className="flex items-center gap-2">
                    <Satellite className="h-3 w-3" />
                    NASA SDO
                  </li>
                  <li className="flex items-center gap-2">
                    <Satellite className="h-3 w-3" />
                    ACE Spacecraft
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-3">Resources</h5>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>
                    <a
                      href="#"
                      className="hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      API Documentation <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Research Papers <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-cyan-400 transition-colors cursor-pointer"
                    >
                      Educational Content
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-cyan-400 transition-colors cursor-pointer"
                    >
                      24/7 Support
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-3">Connect</h5>
                <div className="flex gap-3 mb-4">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-400 cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-cyan-400/10"
                  >
                    <span className="text-sm font-bold">T</span>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-400 cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-cyan-400/10"
                  >
                    <span className="text-sm font-bold">G</span>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-400 cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-cyan-400/10"
                  >
                    <span className="text-sm font-bold">L</span>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-400 cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-cyan-400/10"
                  >
                    <span className="text-sm font-bold">M</span>
                  </a>
                </div>
                <p className="text-xs text-gray-500">
                  NebulaPulse Systems Inc.
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Built with ❤️ for space weather enthusiasts
                </p>
              </div>
            </div>
          </Card>
        </footer>
      </div>

      {/* Alert Badge */}
      <AlertBadge
        count={activeAlertsCount}
        onClick={() => setIsAlertsDrawerOpen(true)}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Side Drawers */}
      <SideDrawer
        isOpen={isDataDrawerOpen}
        onClose={() => setIsDataDrawerOpen(false)}
        title={selectedDataType}
      >
        <div className="space-y-4">
          <Card className="p-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data Quality Metrics
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Accuracy:</span>
                <span className="text-green-400 font-bold">98.7%</span>
              </div>
              <div className="flex justify-between">
                <span>Update Frequency:</span>
                <span className="text-cyan-400">10 seconds</span>
              </div>
              <div className="flex justify-between">
                <span>Source Satellites:</span>
                <span className="text-blue-400">4 active</span>
              </div>
              <div className="flex justify-between">
                <span>Latency:</span>
                <span className="text-yellow-400">~2.3s</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Technical Specifications
            </h4>
            <div className="text-sm space-y-2 text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3 text-green-400" />
                Real-time data processing
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3 text-yellow-400" />
                ML anomaly detection
              </div>
              <div className="flex items-center gap-2">
                <Satellite className="h-3 w-3 text-blue-400" />
                Multi-satellite data fusion
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-3 w-3 text-purple-400" />
                Advanced analytics engine
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Data Usage Statistics
            </h4>
            <div className="text-sm space-y-2 text-gray-400">
              <p>• Used by 12,000+ researchers globally</p>
              <p>• 99.9% uptime in the last 12 months</p>
              <p>• Processing 2.5M data points daily</p>
              <p>• Trusted by NASA and ESA missions</p>
            </div>
          </Card>
        </div>
      </SideDrawer>

      <SideDrawer
        isOpen={isAlertsDrawerOpen}
        onClose={() => setIsAlertsDrawerOpen(false)}
        title="Space Weather Alerts"
      >
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card
              key={alert.id}
              className="p-4 cursor-pointer hover:bg-white/5 hover:scale-[1.02] transition-all duration-200"
              onClick={() => {
                setSelectedAlert(alert);
                setIsAlertDetailOpen(true);
                setIsAlertsDrawerOpen(false);
                setDetailOpenedFrom("alerts");
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs uppercase tracking-wider font-medium ${
                      alert.severity === "severe"
                        ? "bg-red-500/20 text-red-400"
                        : alert.severity === "strong"
                        ? "bg-orange-500/20 text-orange-400"
                        : alert.severity === "moderate"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {alert.severity}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.type === "geomagnetic"
                        ? "bg-purple-500/20 text-purple-400"
                        : alert.type === "solar"
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {alert.type}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {alert.isActive && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-green-400 font-medium">
                        LIVE
                      </span>
                    </div>
                  )}
                  <span className="text-xs text-cyan-400 opacity-60">
                    Click for details
                  </span>
                </div>
              </div>

              <h4 className={`font-medium mb-1 ${contentFont.className}`}>
                {alert.title}
              </h4>
              <p
                className={`text-sm text-gray-400 mb-2 line-clamp-2 ${contentFont.className}`}
              >
                {alert.description}
              </p>

              <div className="flex items-center justify-between">
                <p className={`text-xs text-gray-500 ${contentFont.className}`}>
                  {alert.timestamp.toLocaleString()}
                </p>
                <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
              </div>
            </Card>
          ))}

          {alerts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className={contentFont.className}>No alerts available</p>
              <p className="text-xs mt-1">New alerts will appear here</p>
            </div>
          )}
        </div>
      </SideDrawer>

      <SideDrawer
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        title="About NebulaPulse"
      >
        <div className="space-y-6">
          <Card className="p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Satellite className="h-4 w-4" />
              Our Mission
            </h4>
            <p className="text-sm text-gray-400">
              NebulaPulse provides cutting-edge real-time space weather
              monitoring to protect our technological infrastructure and enable
              safer space operations for humanity's expansion into the cosmos.
            </p>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Core Features
            </h4>
            <ul className="text-sm text-gray-400 space-y-2">
              <li className="flex items-center gap-2">
                <Sun className="h-3 w-3 text-orange-400" />
                Real-time solar flare tracking
              </li>
              <li className="flex items-center gap-2">
                <Radio className="h-3 w-3 text-blue-400" />
                Geomagnetic activity monitoring
              </li>
              <li className="flex items-center gap-2">
                <Globe className="h-3 w-3 text-green-400" />
                Global aurora forecast predictions
              </li>
              <li className="flex items-center gap-2">
                <Satellite className="h-3 w-3 text-cyan-400" />
                Satellite network health status
              </li>
              <li className="flex items-center gap-2">
                <BarChart3 className="h-3 w-3 text-purple-400" />
                Multi-region data analysis
              </li>
            </ul>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Our Team
            </h4>
            <p className="text-sm text-gray-400">
              Built by a dedicated team of space weather researchers, software
              engineers, and data scientists committed to advancing our
              understanding of solar-terrestrial interactions and their impact
              on modern technology.
            </p>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Impact & Recognition
            </h4>
            <div className="text-sm text-gray-400 space-y-1">
              <p>• Trusted by NASA, ESA, and NOAA</p>
              <p>• Used in 50+ countries worldwide</p>
              <p>• Featured in Nature Astronomy</p>
              <p>• 99.9% system reliability</p>
            </div>
          </Card>
        </div>
      </SideDrawer>

      <SideDrawer
        isOpen={isAlertDetailOpen}
        onClose={() => {
          setIsAlertDetailOpen(false);
          setSelectedAlert(null);
          setDetailOpenedFrom("main");
        }}
        title={
          <div className="flex items-center gap-3">
            {detailOpenedFrom === "alerts" && (
              <button
                onClick={() => {
                  setIsAlertDetailOpen(false);
                  setSelectedAlert(null);
                  setIsAlertsDrawerOpen(true);
                  setDetailOpenedFrom("main");
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer group"
                title="Back to alerts"
              >
                <ChevronRight className="h-5 w-5 rotate-180 text-gray-400 group-hover:text-cyan-400 transition-colors" />
              </button>
            )}
            <span>Alert Details</span>
          </div>
        }
      >
        {selectedAlert && (
          <div className="space-y-6">
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm uppercase tracking-wider font-bold ${
                    selectedAlert.severity === "severe"
                      ? "bg-red-500/20 text-red-400"
                      : selectedAlert.severity === "strong"
                      ? "bg-orange-500/20 text-orange-400"
                      : selectedAlert.severity === "moderate"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {selectedAlert.severity} Alert
                </span>
                {selectedAlert.isActive && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-green-400 font-medium">
                      ACTIVE
                    </span>
                  </div>
                )}
              </div>
              <h3 className={`text-lg font-bold mb-2 ${spaceFont.className}`}>
                {selectedAlert.title}
              </h3>
              <p className={`text-sm text-gray-400 ${contentFont.className}`}>
                {selectedAlert.description}
              </p>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Alert Information
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedAlert.type === "geomagnetic"
                        ? "bg-purple-500/20 text-purple-400"
                        : selectedAlert.type === "solar"
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {selectedAlert.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Severity Level:</span>
                  <span className="text-cyan-400 font-bold capitalize">
                    {selectedAlert.severity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Alert ID:</span>
                  <span
                    className={`text-gray-300 font-mono ${contentFont.className}`}
                  >
                    #{selectedAlert.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Issued:</span>
                  <span className={`text-gray-300 ${contentFont.className}`}>
                    {selectedAlert.timestamp.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span
                    className={
                      selectedAlert.isActive
                        ? "text-green-400"
                        : "text-gray-400"
                    }
                  >
                    {selectedAlert.isActive ? "Active" : "Resolved"}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Potential Impacts
              </h4>
              <div className="text-sm space-y-2 text-gray-400">
                {selectedAlert.type === "geomagnetic" && (
                  <>
                    <p>• Enhanced aurora activity at high latitudes</p>
                    <p>• Possible disruption to GPS navigation</p>
                    <p>• Potential power grid fluctuations</p>
                    <p>• Satellite operations may be affected</p>
                  </>
                )}
                {selectedAlert.type === "solar" && (
                  <>
                    <p>• Radio communication disruptions</p>
                    <p>• Increased radiation exposure for aviation</p>
                    <p>• Satellite electronics at risk</p>
                    <p>• Possible HF radio blackouts</p>
                  </>
                )}
                {selectedAlert.type === "radiation" && (
                  <>
                    <p>• High-energy particle bombardment</p>
                    <p>• Elevated radiation levels for spacecraft</p>
                    <p>• Risk to astronaut safety</p>
                    <p>• Potential satellite system degradation</p>
                  </>
                )}
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Recommended Actions
              </h4>
              <div className="text-sm space-y-2 text-gray-400">
                <p>• Monitor space weather conditions closely</p>
                <p>• Implement protective protocols for sensitive equipment</p>
                <p>• Consider postponing critical satellite operations</p>
                <p>• Update flight crews on radiation exposure risks</p>
              </div>
            </Card>
          </div>
        )}
      </SideDrawer>
    </main>
  );
}

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  FlaskConical,
  Moon,
  Sun,
  Menu,
  ActivitySquare,
  CheckCircle,
  Clock,
  XCircle,
  Activity,
  TrendingUp,
  X,
  Beaker,
  HomeIcon,
  ThermometerIcon,
  Droplets,
  ArrowUp,
  ArrowDown,
  Search,
  FilterIcon,
  ChevronDown,
  RotateCcw,
  User,
  Edit3,
  Save,
  Calendar,
  BarChart3,
  Settings,
  Eye,
  Zap,
  Target,
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
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type ExperimentStatus = "active" | "completed" | "failed" | "paused";

interface DataPoint {
  date: string;
  value: number;
}

interface Experiment {
  id: string;
  title: string;
  type: string;
  status: ExperimentStatus;
  progress: number;
  createdAt: string;
  completedAt: string | null;
  lab: string;
  scientist: string;
  description: string;
  temperatureData: DataPoint[];
  phData: DataPoint[];
  reagentLevels: DataPoint[];
  successRate: number;
  contamination: number;
  notes: string;
  results: string;
  priority: "low" | "medium" | "high";
  estimatedCompletion: string;
}

interface KPIData {
  totalExperiments: number;
  activeExperiments: number;
  completedExperiments: number;
  failedExperiments: number;
  successRate: string;
  avgDuration: string;
}

interface ActivityItem {
  id: number;
  action: string;
  experimentId: string;
  experimentName: string;
  user: string;
  timestamp: string;
}

interface FilterOptions {
  status: ExperimentStatus | "all";
  lab: string | "all";
  scientist: string | "all";
  type: string | "all";
  priority: "low" | "medium" | "high" | "all";
  dateRange: [Date | null, Date | null];
}

const generateTimeSeriesData = (
  days: number,
  baseValue: number,
  volatility: number
): DataPoint[] => {
  const data: DataPoint[] = [];
  let currentValue = baseValue;

  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const change = (Math.random() - 0.5) * volatility;
    currentValue = Math.max(0, currentValue + change);

    data.push({
      date: date.toISOString(),
      value: parseFloat(currentValue.toFixed(2)),
    });
  }

  return data;
};

const generateProgress = (): number => {
  return Math.floor(Math.random() * 101);
};

const generateStatus = (): ExperimentStatus => {
  const statuses: ExperimentStatus[] = [
    "active",
    "completed",
    "failed",
    "paused",
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const generatePriority = (): "low" | "medium" | "high" => {
  const priorities = ["low", "medium", "high"];
  return priorities[Math.floor(Math.random() * priorities.length)] as
    | "low"
    | "medium"
    | "high";
};

const generateType = (): string => {
  const types = [
    "PCR Analysis",
    "Cell Culture",
    "Protein Expression",
    "Enzyme Assay",
    "Chromatography",
    "Spectroscopy",
    "Genome Sequencing",
    "Antibody Testing",
    "Flow Cytometry",
    "Western Blot",
    "ELISA Analysis",
    "Mass Spectrometry",
    "DNA Extraction",
    "RNA Sequencing",
    "IF",
  ];
  return types[Math.floor(Math.random() * types.length)];
};

const generateLab = (): string => {
  const labs = [
    "Molecular Biology Lab",
    "Biochemistry Lab",
    "Genetics Lab",
    "Microbiology Lab",
    "Immunology Lab",
    "Cell Biology Lab",
  ];
  return labs[Math.floor(Math.random() * labs.length)];
};

const generateScientist = (): string => {
  const scientists = [
    "Dr. Emma Chen",
    "Dr. Michael Rodriguez",
    "Dr. Sarah Johnson",
    "Dr. David Kim",
    "Dr. Lisa Patel",
    "Dr. James Wilson",
    "Dr. Anna Martinez",
    "Dr. Robert Brown",
    "Dr. Jennifer Lee",
    "Dr. Thomas Anderson",
    "Dr. Maria Garcia",
    "Dr. Kevin Zhang",
  ];
  return scientists[Math.floor(Math.random() * scientists.length)];
};

const generateExperiments = (count: number): Experiment[] => {
  const experiments: Experiment[] = [];

  for (let i = 1; i <= count; i++) {
    const id = `EXP-${String(i).padStart(4, "0")}`;
    const status = generateStatus();
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 90));

    const type = generateType();
    const progress =
      status === "completed"
        ? 100
        : status === "failed"
        ? Math.floor(Math.random() * 80)
        : generateProgress();

    const priority = generatePriority();

    const estimatedDays = Math.floor(Math.random() * 30) + 5;
    const estimatedCompletion = new Date();
    estimatedCompletion.setDate(estimatedCompletion.getDate() + estimatedDays);

    experiments.push({
      id,
      title: `${type} Study ${i}`,
      type,
      status,
      progress,
      priority,
      createdAt: createdDate.toISOString(),
      completedAt:
        status === "completed"
          ? new Date(
              createdDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000
            ).toISOString()
          : null,
      estimatedCompletion: estimatedCompletion.toISOString(),
      lab: generateLab(),
      scientist: generateScientist(),
      description: `Comprehensive ${type} analysis focusing on molecular interactions and biological pathways under controlled laboratory conditions with advanced monitoring systems.`,
      temperatureData: generateTimeSeriesData(14, 25, 2),
      phData: generateTimeSeriesData(14, 7, 0.5),
      reagentLevels: generateTimeSeriesData(14, 85, 10),
      successRate: parseFloat((60 + Math.random() * 40).toFixed(1)),
      contamination: parseFloat((Math.random() * 5).toFixed(2)),
      notes:
        status === "failed"
          ? "Experiment terminated due to contamination detected during critical phase. Equipment sterilization required."
          : status === "completed"
          ? "Successfully completed all phases with optimal results. Data quality excellent throughout the experiment duration."
          : "Experiment progressing as planned. All parameters within expected ranges.",
      results:
        status === "completed"
          ? "Achieved statistically significant results with 98.5% confidence interval. Molecular interactions confirmed hypothesis with clear reproducible patterns."
          : "Analysis pending completion of experimental phases",
    });
  }

  return experiments;
};

const calculateKPIs = (experiments: Experiment[]): KPIData => {
  if (experiments.length === 0) {
    return {
      totalExperiments: 0,
      activeExperiments: 0,
      completedExperiments: 0,
      failedExperiments: 0,
      successRate: "0.0",
      avgDuration: "0.0",
    };
  }

  const totalExperiments = experiments.length;
  const activeExperiments = experiments.filter(
    (exp) => exp.status === "active"
  ).length;
  const completedExperiments = experiments.filter(
    (exp) => exp.status === "completed"
  ).length;
  const failedExperiments = experiments.filter(
    (exp) => exp.status === "failed"
  ).length;

  const successRates = experiments.map((exp) => exp.successRate);
  const avgSuccessRate =
    successRates.reduce((sum, rate) => sum + rate, 0) / successRates.length;

  const completedExperimentsList = experiments.filter(
    (exp) => exp.status === "completed"
  );
  let avgDuration = 0;

  if (completedExperimentsList.length > 0) {
    const durations = completedExperimentsList.map((exp) => {
      const start = new Date(exp.createdAt).getTime();
      const end = new Date(exp.completedAt as string).getTime();
      return (end - start) / (1000 * 60 * 60 * 24);
    });

    avgDuration =
      durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
  }

  return {
    totalExperiments,
    activeExperiments,
    completedExperiments,
    failedExperiments,
    successRate: avgSuccessRate.toFixed(1),
    avgDuration: avgDuration.toFixed(1),
  };
};

const recentActivity = [
  {
    id: 1,
    action: "started",
    experimentId: "EXP-0045",
    experimentName: "Mass Spectrometry Study 45",
    user: "Dr. Emma Chen",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 2,
    action: "updated",
    experimentId: "EXP-0042",
    experimentName: "Flow Cytometry Study 42",
    user: "Dr. Michael Rodriguez",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 3,
    action: "completed",
    experimentId: "EXP-0039",
    experimentName: "ELISA Analysis Study 39",
    user: "Dr. Sarah Johnson",
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: 4,
    action: "failed",
    experimentId: "EXP-0035",
    experimentName: "Western Blot Study 35",
    user: "Dr. David Kim",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 5,
    action: "paused",
    experimentId: "EXP-0041",
    experimentName: "RNA Sequencing Study 41",
    user: "Dr. Lisa Patel",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 6,
    action: "started",
    experimentId: "EXP-0044",
    experimentName: "IF Study 44",
    user: "Dr. Anna Martinez",
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
];

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  styles: {
    background: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    cardBackground: string;
    cardBorder: string;
    buttonBackground: string;
    buttonText: string;
    inputBackground: string;
    inputText: string;
    inputBorder: string;
    hoverBackground: string;
    activeBackground: string;
    headerBackground: string;
    headerBorder: string;
    primary: string;
    primaryLight: string;
    primaryDark: string;
    success: string;
    successLight: string;
    warning: string;
    warningLight: string;
    error: string;
    errorLight: string;
    info: string;
    infoLight: string;
    shadowColor: string;
  };
}

const getThemeStyles = (theme: Theme) => ({
  background: theme === "light" ? "#fafafa" : "#18181b",
  text: theme === "light" ? "#171717" : "#f3f4f6",
  textSecondary: theme === "light" ? "#737373" : "#a1a1aa",
  textMuted: theme === "light" ? "#a3a3a3" : "#52525b",
  border: theme === "light" ? "#e5e5e5" : "rgba(255,255,255,0.06)",
  cardBackground: theme === "light" ? "#ffffff" : "#23232a",
  cardBorder: theme === "light" ? "#f5f5f5" : "rgba(255,255,255,0.06)",
  buttonBackground: theme === "light" ? "#f5f5f5" : "#2d2d36",
  buttonText: theme === "light" ? "#171717" : "#f3f4f6",
  inputBackground: theme === "light" ? "#ffffff" : "#23232a",
  inputText: theme === "light" ? "#171717" : "#f3f4f6",
  inputBorder: theme === "light" ? "#e5e5e5" : "#393944",
  hoverBackground: theme === "light" ? "#f5f5f5" : "#23232a",
  activeBackground: theme === "light" ? "#e5e5e5" : "#393944",
  headerBackground: theme === "light" ? "#ffffff" : "#23232a",
  headerBorder: theme === "light" ? "#f5f5f5" : "rgba(255,255,255,0.06)",
  
  primary: theme === "light" ? "#2563eb" : "#3b82f6",
  primaryLight: theme === "light" ? "#dbeafe" : "#1e3a8a",
  primaryDark: theme === "light" ? "#1d4ed8" : "#60a5fa",
  
  success: theme === "light" ? "#059669" : "#10b981",
  successLight: theme === "light" ? "#d1fae5" : "#064e3b",
  warning: theme === "light" ? "#d97706" : "#f59e0b",
  warningLight: theme === "light" ? "#fef3c7" : "#92400e",
  error: theme === "light" ? "#dc2626" : "#ef4444",
  errorLight: theme === "light" ? "#fee2e2" : "#991b1b",
  info: theme === "light" ? "#0891b2" : "#06b6d4",
  infoLight: theme === "light" ? "#cffafe" : "#164e63",
  shadowColor: theme === "light" ? "rgba(0, 0, 0, 0.05)" : "rgba(0,0,0,0.7)",
});

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light");

  const styles = getThemeStyles(theme);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--theme-background",
      styles.background
    );
    document.documentElement.style.setProperty("--theme-text", styles.text);
    document.documentElement.style.setProperty("--theme-border", styles.border);
    document.documentElement.style.setProperty(
      "--theme-card-background",
      styles.cardBackground
    );
  }, [theme, styles]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, styles }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ExperimentContextType {
  experiments: Experiment[];
  filteredExperiments: Experiment[];
  kpis: KPIData;
  activity: ActivityItem[];
  selectedExperiment: Experiment | null;
  filterOptions: FilterOptions;
  editingExperiment: Experiment | null;
  showEditModal: boolean;
  showViewModal: boolean;
  realTimeUpdates: boolean;
  isLoading: boolean;
  setFilterOptions: (options: FilterOptions) => void;
  selectExperiment: (id: string | null) => void;
  resetFilters: () => void;
  updateExperiment: (experiment: Experiment) => void;
  setEditingExperiment: (experiment: Experiment | null) => void;
  setShowEditModal: (show: boolean) => void;
  setShowViewModal: (show: boolean) => void;
  setRealTimeUpdates: (enabled: boolean) => void;
}

const defaultFilterOptions: FilterOptions = {
  status: "all",
  lab: "all",
  scientist: "all",
  type: "all",
  priority: "all",
  dateRange: [null, null],
};

const ExperimentContext = createContext<ExperimentContextType | undefined>(
  undefined
);

const ExperimentProvider = ({ children }: { children: ReactNode }) => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOptions, setFilterOptions] =
    useState<FilterOptions>(defaultFilterOptions);
  const [selectedExperiment, setSelectedExperiment] =
    useState<Experiment | null>(null);
  const [editingExperiment, setEditingExperiment] = useState<Experiment | null>(
    null
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);

  
  useEffect(() => {
    if (typeof window !== 'undefined') {
    setExperiments(generateExperiments(45));
      setIsLoading(false);
    }
  }, []);

  const filteredExperiments = experiments.filter((exp) => {
    if (filterOptions.status !== "all" && exp.status !== filterOptions.status) {
      return false;
    }

    if (filterOptions.lab !== "all" && exp.lab !== filterOptions.lab) {
      return false;
    }

    if (
      filterOptions.scientist !== "all" &&
      exp.scientist !== filterOptions.scientist
    ) {
      return false;
    }

    if (filterOptions.type !== "all" && exp.type !== filterOptions.type) {
      return false;
    }

    if (
      filterOptions.priority !== "all" &&
      exp.priority !== filterOptions.priority
    ) {
      return false;
    }

    if (filterOptions.dateRange[0] && filterOptions.dateRange[1]) {
      const expDate = new Date(exp.createdAt);
      const startDate = filterOptions.dateRange[0];
      const endDate = filterOptions.dateRange[1];

      if (expDate < startDate || expDate > endDate) {
        return false;
      }
    }

    return true;
  });

  const selectExperiment = (id: string | null) => {
    if (!id) {
      setSelectedExperiment(null);
      return;
    }

    const experiment = experiments.find((exp) => exp.id === id) || null;
    setSelectedExperiment(experiment);
  };

  const resetFilters = () => {
    setFilterOptions(defaultFilterOptions);
  };

  const updateExperiment = (updatedExperiment: Experiment) => {
    setExperiments((prev) => {
      const newExperiments = [...prev];
      const index = newExperiments.findIndex(
        (exp) => exp.id === updatedExperiment.id
      );
      if (index !== -1) {
        newExperiments[index] = updatedExperiment;
        if (selectedExperiment?.id === updatedExperiment.id) {
          setSelectedExperiment(updatedExperiment);
        }
      }
      return newExperiments;
    });
  };

  
  useEffect(() => {
    if (!realTimeUpdates || experiments.length === 0) return;

    const interval = setInterval(() => {
      setExperiments((prev) => {
        const newExperiments = [...prev];
        const activeExperiments = newExperiments.filter(
          (exp) => exp.status === "active"
        );
        if (activeExperiments.length > 0) {
          const randomExp =
            activeExperiments[
              Math.floor(Math.random() * activeExperiments.length)
            ];
          if (randomExp.progress < 100) {
            randomExp.progress = Math.min(
              100,
              randomExp.progress + Math.random() * 2
            );

            const now = new Date();
            randomExp.temperatureData.push({
              date: now.toISOString(),
              value: parseFloat((25 + (Math.random() - 0.5) * 4).toFixed(1)),
            });
            randomExp.phData.push({
              date: now.toISOString(),
              value: parseFloat((7 + (Math.random() - 0.5) * 1).toFixed(1)),
            });
            randomExp.reagentLevels.push({
              date: now.toISOString(),
              value: parseFloat(Math.max(
                0,
                randomExp.reagentLevels[randomExp.reagentLevels.length - 1]
                  .value -
                  Math.random() * 2
              ).toFixed(1)),
            });

            
            if (randomExp.temperatureData.length > 20) {
              randomExp.temperatureData = randomExp.temperatureData.slice(-20);
              randomExp.phData = randomExp.phData.slice(-20);
              randomExp.reagentLevels = randomExp.reagentLevels.slice(-20);
            }
          }
        }
        return newExperiments;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [realTimeUpdates, experiments.length]);

  return (
    <ExperimentContext.Provider
      value={{
        experiments,
        filteredExperiments,
        kpis: calculateKPIs(experiments),
        activity: recentActivity,
        selectedExperiment,
        filterOptions,
        editingExperiment,
        showEditModal,
        showViewModal,
        realTimeUpdates,
        isLoading,
        setFilterOptions,
        selectExperiment,
        resetFilters,
        updateExperiment,
        setEditingExperiment,
        setShowEditModal,
        setShowViewModal,
        setRealTimeUpdates,
      }}
    >
      {children}
    </ExperimentContext.Provider>
  );
};

const useExperiments = () => {
  const context = useContext(ExperimentContext);
  if (context === undefined) {
    throw new Error("useExperiments must be used within an ExperimentProvider");
  }
  return context;
};

const fontStyles = `
  @import url('https:

  * {
    font-family: 'Poppins', sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Outfit', sans-serif;
  }

  button {
    font-family: 'Poppins', sans-serif;
  }

  .animate-pulse-slow {
    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .animate-slide-up {
    animation: slideUp 0.5s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.6s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .glass-morphism {
    backdrop-filter: blur(16px) saturate(180%);
    background-color: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.125);
  }

  .dark .glass-morphism {
    background-color: rgba(15, 23, 42, 0.75);
    border: 1px solid rgba(30, 41, 59, 0.5);
  }

  @keyframes bubble {
    0% {
      transform: scale(0.8) translateY(0px);
      opacity: 0.3;
    }
    50% {
      transform: scale(1.1) translateY(-2px);
      opacity: 0.1;
    }
    100% {
      transform: scale(0.9) translateY(-1px);
      opacity: 0.2;
    }
  }

  .logo-container {
    position: relative;
    overflow: visible;
  }

  .logo-container::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 24px;
    padding: 2px;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3), rgba(240, 147, 251, 0.3));
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .logo-container:hover::before {
    opacity: 1;
  }

  /* Custom Scrollbar Styles */
  .custom-scrollbar::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  /* Mobile scrollbar */
  @media (max-width: 768px) {
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(192, 132, 252, 0.1);
    border-radius: 12px;
    margin: 2px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.7), rgba(168, 85, 247, 0.7), rgba(192, 132, 252, 0.7));
    border-radius: 12px;
    border: 2px solid transparent;
    background-clip: padding-box;
    transition: all 0.3s ease;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(168, 85, 247, 0.9), rgba(192, 132, 252, 0.9));
    transform: scale(1.1);
  }

  .custom-scrollbar::-webkit-scrollbar-corner {
    background: transparent;
  }

  /* Dark theme scrollbar */
  .dark .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(147, 51, 234, 0.1);
  }

  .dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, rgba(126, 34, 206, 0.7), rgba(147, 51, 234, 0.7), rgba(168, 85, 247, 0.7));
  }

  .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, rgba(126, 34, 206, 0.9), rgba(147, 51, 234, 0.9), rgba(168, 85, 247, 0.9));
  }

  /* Firefox scrollbar */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(139, 92, 246, 0.7) rgba(192, 132, 252, 0.1);
  }

  .dark .custom-scrollbar {
    scrollbar-color: rgba(147, 51, 234, 0.7) rgba(147, 51, 234, 0.1);
  }

  /* Select-specific scrollbar width matching */
  .custom-select::-webkit-scrollbar {
    width: 100%;
  }

  /* Mobile responsive dropdown styling */
  @media (max-width: 768px) {
    .custom-select {
      background-size: 1em;
      background-position: right 0.5rem center;
    }

    .custom-select option {
      padding: 10px 12px !important;
      font-size: 14px;
    }

    .custom-input {
      font-size: 16px; /* Prevent zoom on iOS */
    }
  }

  /* Custom Select Dropdown Styles */
  .custom-select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http:
    background-repeat: no-repeat;
    background-position: right 0.7rem center;
    background-size: 1.2em;
    position: relative;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .custom-select:hover {
    background-color: rgba(139, 92, 246, 0.05);
    border-color: rgba(139, 92, 246, 0.4);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
  }

  .custom-select:focus {
    background-color: rgba(139, 92, 246, 0.08);
    border-color: rgba(139, 92, 246, 0.6);
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1), 0 4px 12px rgba(139, 92, 246, 0.2);
    outline: none;
  }

  /* Dark theme select */
  .dark .custom-select {
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http:
  }

  .dark .custom-select:hover {
    background-color: rgba(168, 85, 247, 0.08);
    border-color: rgba(168, 85, 247, 0.4);
    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.15);
  }

  .dark .custom-select:focus {
    background-color: rgba(168, 85, 247, 0.12);
    border-color: rgba(168, 85, 247, 0.6);
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1), 0 4px 12px rgba(168, 85, 247, 0.2);
  }

  /* Custom Select Option Styling - Force Purple Theme */
  .custom-select option {
    background-color: var(--theme-card-background) !important;
    color: var(--theme-text) !important;
    padding: 12px 16px !important;
    border-radius: 6px;
    margin: 2px 0;
    font-weight: 500;
  }

  .custom-select option:hover,
  .custom-select option:focus,
  .custom-select option:checked,
  .custom-select option:active,
  .custom-select option[selected] {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.2), rgba(192, 132, 252, 0.2)) !important;
    color: var(--theme-text) !important;
  }

  .dark .custom-select option:hover,
  .dark .custom-select option:focus,
  .dark .custom-select option:checked,
  .dark .custom-select option:active,
  .dark .custom-select option[selected] {
    background: linear-gradient(135deg, rgba(126, 34, 206, 0.3), rgba(147, 51, 234, 0.3), rgba(168, 85, 247, 0.3)) !important;
    color: var(--theme-text) !important;
  }

  /* Force override browser default option styling */
  select.custom-select option::selection {
    background: rgba(139, 92, 246, 0.3) !important;
  }

  /* Custom Input Styles */
  .custom-input {
    transition: all 0.3s ease;
    position: relative;
  }

  .custom-input::placeholder {
    color: rgba(139, 92, 246, 0.5) !important;
    font-weight: 400;
    transition: all 0.3s ease;
  }

  .custom-input:focus::placeholder {
    color: rgba(139, 92, 246, 0.3) !important;
    transform: translateY(-2px);
  }

  .custom-input:hover {
    background-color: rgba(139, 92, 246, 0.03);
    border-color: rgba(139, 92, 246, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.1);
  }

  .custom-input:focus {
    background-color: rgba(139, 92, 246, 0.05);
    border-color: rgba(139, 92, 246, 0.6);
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1), 0 4px 12px rgba(139, 92, 246, 0.15);
    outline: none;
    transform: translateY(-1px);
  }

  /* Dark theme inputs */
  .dark .custom-input::placeholder {
    color: rgba(168, 85, 247, 0.6) !important;
  }

  .dark .custom-input:focus::placeholder {
    color: rgba(168, 85, 247, 0.4) !important;
  }

  .dark .custom-input:hover {
    background-color: rgba(168, 85, 247, 0.05);
    border-color: rgba(168, 85, 247, 0.4);
    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.1);
  }

  .dark .custom-input:focus {
    background-color: rgba(168, 85, 247, 0.08);
    border-color: rgba(168, 85, 247, 0.6);
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1), 0 4px 12px rgba(168, 85, 247, 0.15);
  }

  /* Global scrollbar for all elements */
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(139, 92, 246, 0.7) rgba(192, 132, 252, 0.1);
  }

  *::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  @media (max-width: 768px) {
    *::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
  }

  *::-webkit-scrollbar-track {
    background: rgba(192, 132, 252, 0.1);
    border-radius: 12px;
    margin: 2px;
  }

  *::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.7), rgba(168, 85, 247, 0.7), rgba(192, 132, 252, 0.7));
    border-radius: 12px;
    border: 1px solid transparent;
    background-clip: padding-box;
    transition: all 0.3s ease;
  }

  *::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(168, 85, 247, 0.9), rgba(192, 132, 252, 0.9));
    transform: scale(1.05);
  }

  *::-webkit-scrollbar-corner {
    background: transparent;
  }

  /* Dark theme global scrollbar */
  .dark * {
    scrollbar-color: rgba(147, 51, 234, 0.7) rgba(147, 51, 234, 0.1);
  }

  .dark *::-webkit-scrollbar-track {
    background: rgba(147, 51, 234, 0.1);
  }

  .dark *::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, rgba(126, 34, 206, 0.7), rgba(147, 51, 234, 0.7), rgba(168, 85, 247, 0.7));
  }

  .dark *::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, rgba(126, 34, 206, 0.9), rgba(147, 51, 234, 0.9), rgba(168, 85, 247, 0.9));
  }
`;

const FontStyles: React.FC = () => {
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = fontStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return null;
};

const AppContent = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <>
      <FontStyles />
      <div
        className={`min-h-screen transition-all duration-300 ${theme === 'dark' ? 'dark' : ''}`}
        style={{
          background: "var(--theme-background)",
          color: "var(--theme-text)",
        }}
      >
        <Header
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <Dashboard />
        <Footer />
        <ViewModal />
        <EditModal />
      </div>
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ExperimentProvider>
        <AppContent />
      </ExperimentProvider>
    </ThemeProvider>
  );
}

interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const ToggleSwitch = ({
  checked,
  onChange,
  color,
  ariaLabel,
}: {
  checked: boolean;
  onChange: () => void;
  color: string;
  ariaLabel?: string;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={ariaLabel}
    onClick={onChange}
    className="relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none border-0"
    style={{
      backgroundColor: checked ? color : '#a1a1aa',
      padding: 0,
    }}
  >
    <span
      className="inline-block h-5 w-5 transform bg-white rounded-full shadow transition-transform"
      style={{
        transform: checked ? 'translateX(20px)' : 'translateX(2px)',
        transition: 'transform 0.2s cubic-bezier(.4,0,.2,1)',
      }}
    />
  </button>
);

const Header = ({ mobileMenuOpen, setMobileMenuOpen }: HeaderProps) => {
  const { theme, toggleTheme, styles } = useTheme();
  const { realTimeUpdates, setRealTimeUpdates } = useExperiments();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerStyle = {
    backgroundColor: isScrolled
      ? `${styles.headerBackground}95`
      : styles.headerBackground,
    borderBottom: `1px solid ${styles.headerBorder}`,
    backdropFilter: isScrolled ? "blur(20px)" : "none",
    color: styles.text,
    transition: "all 0.3s ease",
    boxShadow: isScrolled ? `0 4px 6px -1px ${styles.shadowColor}` : "none",
  };

  return (
    <header className="sticky top-0 z-50" style={headerStyle}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div
                className="relative p-2 sm:p-3 md:p-4 rounded-2xl sm:rounded-3xl shadow-lg transform transition-all duration-300 hover:scale-110 cursor-pointer group"
                style={{
                  backgroundColor: styles.primary,
                  boxShadow: `0 10px 25px -5px ${styles.shadowColor}`,
                }}
              >
                {/* 3D Flask with Liquid Animation */}
                <div className="relative">
                  {/* Liquid Bubble Animation */}
                  <div 
                    className="absolute inset-0 rounded-full opacity-20 animate-pulse"
                    style={{
                      background: 'radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.8), transparent 50%)',
                      animation: 'bubble 2s ease-in-out infinite alternate'
                    }}
                  />
                  
                  {/* Main Flask Icon with 3D Effect */}
                  <div 
                    className="relative z-10 transition-all duration-300 group-hover:scale-110"
                    style={{
                      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.1))',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    <FlaskConical className="text-white" size={24} strokeWidth={2.5} />
                  </div>
                  
                  {/* Floating Particles - Hidden on smallest screens */}
                  <div className="hidden sm:block absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full opacity-60 animate-ping" />
                  <div className="hidden sm:block absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-cyan-200 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <div className="hidden sm:block absolute top-1 left-1 w-1 h-1 bg-yellow-200 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '1s' }} />
                </div>
                
                {/* Glowing Border Effect */}
                <div 
                  className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                    boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1)'
                  }}
                />
              </div>
              
              <div>
                <h1
                  className="text-lg sm:text-xl md:text-2xl font-bold transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{ color: styles.primary }}
                >
                  LabTracker Pro
                </h1>
                <p
                  className="text-xs sm:text-sm font-medium transition-colors duration-300 hidden xs:block"
                  style={{ color: styles.textSecondary }}
                >
                  Advanced Laboratory Management
                </p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  realTimeUpdates ? "animate-pulse" : ""
                }`}
                style={{
                  backgroundColor: realTimeUpdates ? styles.success : styles.textMuted,
                }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: styles.textSecondary }}
              >
                {realTimeUpdates ? "Live" : "Offline"}
              </span>
              <button
                onClick={() => setRealTimeUpdates(!realTimeUpdates)}
                className="p-2 sm:p-3 rounded-lg transition-all duration-200 hover:scale-110 cursor-pointer"
                style={{
                  backgroundColor: realTimeUpdates
                    ? styles.success
                    : styles.buttonBackground,
                  color: realTimeUpdates ? "#ffffff" : styles.text,
                }}
              >
                {realTimeUpdates ? <Zap size={18} /> : <ZapOff size={18} />}
              </button>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 sm:p-3 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg cursor-pointer"
              style={{
                backgroundColor: styles.buttonBackground,
                color: styles.text,
                border: `1px solid ${styles.border}`,
              }}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <div className="flex items-center space-x-2 md:hidden">
            {/* Live status indicator for mobile */}
            <div className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-1 ${
                  realTimeUpdates ? "animate-pulse" : ""
                }`}
                style={{
                  backgroundColor: realTimeUpdates ? styles.success : styles.textMuted,
                }}
              />
            </div>
            
            <button
              className="p-2 rounded-lg transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                backgroundColor: styles.buttonBackground,
                color: styles.text,
                border: `1px solid ${styles.border}`,
              }}
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className="md:hidden border-t animate-slide-up absolute left-0 right-0 shadow-lg z-20"
            style={{ 
              borderColor: styles.border,
              backgroundColor: styles.headerBackground,
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="py-3 px-4 space-y-2 max-w-7xl mx-auto">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between w-full p-3 rounded-xl transition-all duration-200"
                  style={{ backgroundColor: styles.buttonBackground, color: styles.text }}>
                  <div className="flex items-center space-x-3">
                    {realTimeUpdates ? <Zap size={18} /> : <ZapOff size={18} />}
                    <span className="font-medium">Live Updates</span>
                  </div>
                  <ToggleSwitch
                    checked={realTimeUpdates}
                    onChange={() => setRealTimeUpdates(!realTimeUpdates)}
                    color={styles.success}
                    ariaLabel="Toggle live updates"
                  />
                </div>
                <div className="flex items-center justify-between w-full p-3 rounded-xl transition-all duration-200"
                  style={{ backgroundColor: styles.buttonBackground, color: styles.text }}>
                  <div className="flex items-center space-x-3">
                    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    <span className="font-medium">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                  </div>
                  <ToggleSwitch
                    checked={theme === "dark"}
                    onChange={toggleTheme}
                    color={styles.primary}
                    ariaLabel="Toggle dark mode"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};


const ZapOff = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="12.41,6.75 13,2 10.57,4.92" />
    <polyline points="18.57,12.91 21,10 15.66,10" />
    <polyline points="8,8 3,14 12,14 11,22 16,16" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

const Dashboard = () => {
  const { setShowViewModal, selectExperiment } = useExperiments();
  const { styles } = useTheme();
  const [timeframe, setTimeframe] = useState<"week" | "month" | "quarter">(
    "week"
  );
  const [activeView, setActiveView] = useState<"grid" | "list">("grid");

  
  const handleExperimentSelect = (id: string) => {
    selectExperiment(id);
    setShowViewModal(true);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1
              className="text-4xl font-bold mb-2"
              style={{ color: styles.text }}
            >
              Laboratory Dashboard
            </h1>
            <p
              className="text-lg font-medium"
              style={{ color: styles.textSecondary }}
            >
              Monitor and manage your experiments in real-time
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
          <KPICards />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceMetrics
              timeframe={timeframe}
              setTimeframe={setTimeframe}
            />
            <ExperimentStatusChart />
          </div>

          <ExperimentTimeline />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityFeed />
          <QuickStats />
        </div>
        
        <div
          className="rounded-3xl shadow-xl border glass-morphism overflow-hidden"
          style={{
            backgroundColor: styles.cardBackground,
            borderColor: styles.cardBorder,
          }}
        >
          <div
            className="p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: styles.border }}
          >
            <h3
              className="text-xl font-bold mb-4 sm:mb-0"
              style={{ color: styles.text }}
            >
              Recent Experiments
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveView("grid")}
                className={`p-2 rounded-lg transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl ${
                  activeView === "grid" ? "scale-110" : ""
                }`}
                style={{
                  backgroundColor:
                    activeView === "grid"
                      ? styles.primary
                      : styles.buttonBackground,
                  color: activeView === "grid" ? "#ffffff" : styles.text,
                }}
              >
                <BarChart3 size={16} />
              </button>
              <button
                onClick={() => setActiveView("list")}
                className={`p-2 rounded-lg transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl ${
                  activeView === "list" ? "scale-110" : ""
                }`}
                style={{
                  backgroundColor:
                    activeView === "list"
                      ? styles.primary
                      : styles.buttonBackground,
                  color: activeView === "list" ? "#ffffff" : styles.text,
                }}
              >
                <Menu size={16} />
              </button>
            </div>
          </div>
          <ExperimentTable
            onSelectExperiment={handleExperimentSelect}
            viewMode={activeView}
          />
        </div>
      </div>
    </main>
  );
};

interface PerformanceMetricsProps {
  timeframe: "week" | "month" | "quarter";
  setTimeframe: (timeframe: "week" | "month" | "quarter") => void;
}

const PerformanceMetrics = ({
  timeframe,
  setTimeframe,
}: PerformanceMetricsProps) => {
  const { experiments } = useExperiments();
  const { styles } = useTheme();

  const getChartData = () => {
    const now = new Date();
    const startDate = new Date();

    if (timeframe === "week") {
      startDate.setDate(now.getDate() - 7);
    } else if (timeframe === "month") {
      startDate.setMonth(now.getMonth() - 1);
    } else {
      startDate.setMonth(now.getMonth() - 3);
    }

    
    const data: Array<{
      date: string;
      active: number;
      completed: number;
      failed: number;
    }> = [];
    
    const currentDate = new Date(startDate);

    while (currentDate <= now) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const dayExperiments = experiments.filter((exp) => {
        const expDate = new Date(exp.createdAt).toISOString().split("T")[0];
        return expDate === dateStr;
      });

      data.push({
        date: currentDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        active: dayExperiments.filter((exp) => exp.status === "active").length,
        completed: dayExperiments.filter((exp) => exp.status === "completed")
          .length,
        failed: dayExperiments.filter((exp) => exp.status === "failed").length,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  };

  return (
    <div
      className="rounded-3xl shadow-xl p-6 border glass-morphism"
      style={{
        backgroundColor: styles.cardBackground,
        borderColor: styles.cardBorder,
      }}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h3
          className="text-xl font-bold mb-4 sm:mb-0"
          style={{ color: styles.text }}
        >
          Performance Metrics
        </h3>
        <div className="flex gap-2">
          {["week", "month", "quarter"].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period as typeof timeframe)}
              className={`px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                timeframe === period ? "scale-105 shadow-lg" : "hover:scale-105"
              }`}
              style={{
                backgroundColor:
                  timeframe === period 
                    ? styles.primary
                    : styles.buttonBackground,
                color: timeframe === period ? "#ffffff" : styles.text,
              }}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={getChartData()}>
            <CartesianGrid strokeDasharray="3 3" stroke={styles.border} />
            <XAxis dataKey="date" stroke={styles.textSecondary} fontSize={12} />
            <YAxis stroke={styles.textSecondary} fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: styles.cardBackground,
                border: `1px solid ${styles.border}`,
                borderRadius: "12px",
                color: styles.text,
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="completed"
              stackId="1"
              stroke={styles.success}
              fill={styles.success}
              fillOpacity={0.6}
              name="Completed"
            />
            <Area
              type="monotone"
              dataKey="active"
              stackId="1"
              stroke={styles.primary}
              fill={styles.primary}
              fillOpacity={0.6}
              name="Active"
            />
            <Area
              type="monotone"
              dataKey="failed"
              stackId="1"
              stroke={styles.error}
              fill={styles.error}
              fillOpacity={0.6}
              name="Failed"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const ExperimentStatusChart = () => {
  const { experiments } = useExperiments();
  const { styles } = useTheme();

  const statusData = [
    {
      name: "Active",
      value: experiments.filter((exp) => exp.status === "active").length,
      color: styles.primary,
    },
    {
      name: "Completed",
      value: experiments.filter((exp) => exp.status === "completed").length,
      color: styles.success,
    },
    {
      name: "Failed",
      value: experiments.filter((exp) => exp.status === "failed").length,
      color: styles.error,
    },
    {
      name: "Paused",
      value: experiments.filter((exp) => exp.status === "paused").length,
      color: styles.warning,
    },
  ];

  return (
    <div
      className="rounded-3xl shadow-xl p-6 border glass-morphism"
      style={{
        backgroundColor: styles.cardBackground,
        borderColor: styles.cardBorder,
      }}
    >
      <h3 className="text-xl font-bold mb-6" style={{ color: styles.text }}>
        Status Distribution
      </h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: styles.cardBackground,
                border: `1px solid ${styles.border}`,
                borderRadius: "12px",
                color: styles.text,
              }}
              labelStyle={{
                color: styles.text,
              }}
              itemStyle={{
                color: styles.text,
              }}
            />
            ;
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  color: string;
  delay: number;
}

const KPICard = ({ title, value, icon, trend, color, delay }: KPICardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentValue, setCurrentValue] = useState(typeof value === "number" ? 0 : value);
  const { styles } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (isVisible && typeof value === "number" && value > 0) {
      setCurrentValue(0); 
      
      const duration = 1000;
      const steps = 50;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCurrentValue(value);
          clearInterval(timer);
        } else {
          setCurrentValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else if (typeof value === "number" && value === 0) {
      setCurrentValue(0);
    } else if (typeof value !== "number") {
      setCurrentValue(value);
    }
  }, [isVisible, value]);

  const displayValue = typeof value === "number" ? currentValue : value;

  const cardStyle = {
    backgroundColor: styles.cardBackground,
    color: styles.text,
    border: `1px solid ${styles.cardBorder}`,
    transform: isVisible
      ? "translateY(0) scale(1)"
      : "translateY(20px) scale(0.95)",
    opacity: isVisible ? 1 : 0,
    transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    boxShadow: `0 10px 25px -5px ${styles.shadowColor}`,
  };

  return (
    <div
      className="rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 glass-morphism"
      style={cardStyle}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p
            className="text-sm font-semibold mb-2 tracking-wide uppercase"
            style={{ color: styles.textSecondary }}
          >
            {title}
          </p>
          <p className="text-3xl font-bold mb-3" style={{ color: styles.text }} suppressHydrationWarning>
            {typeof displayValue === "number"
              ? displayValue.toLocaleString()
              : displayValue}
          </p>
          {typeof trend === "number" && !isNaN(trend) && (
            <div
              className={`flex items-center text-sm font-semibold ${
                trend >= 0 ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {trend >= 0 ? (
                <TrendingUp size={16} className="mr-2" />
              ) : (
                <TrendingUp size={16} className="mr-2 transform rotate-180" />
              )}
              <span>{Math.abs(trend).toLocaleString()}% vs last period</span>
            </div>
          )}
        </div>
        <div
          className="p-4 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-110"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const KPICards = () => {
  const { kpis, isLoading } = useExperiments();

  const { styles } = useTheme();

  const cards = [
    {
      title: "Total Experiments",
      value: kpis.totalExperiments,
      icon: <Beaker size={24} className="text-white" />,
      trend: 12,
      color: styles.primary,
      delay: 100,
    },
    {
      title: "Active Experiments",
      value: kpis.activeExperiments,
      icon: <Activity size={24} className="text-white" />,
      trend: 8,
      color: styles.warning,
      delay: 200,
    },
    {
      title: "Completed",
      value: kpis.completedExperiments,
      icon: <CheckCircle size={24} className="text-white" />,
      trend: 15,
      color: styles.success,
      delay: 300,
    },
    {
      title: "Failed",
      value: kpis.failedExperiments,
      icon: <XCircle size={24} className="text-white" />,
      trend: -5,
      color: styles.error,
      delay: 400,
    },
    {
      title: "Success Rate",
      value: `${kpis.successRate}%`,
      icon: <Target size={24} className="text-white" />,
      trend: 3,
      color: styles.info,
      delay: 400,
    },
    {
      title: "Avg. Duration",
      value: `${kpis.avgDuration} days`,
      icon: <Clock size={24} className="text-white" />,
      trend: -2,
      color: styles.info,
      delay: 600,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div
          className="hover:scale-105 transition-all duration-300"
          key={index}
        >
          <KPICard
            title={card.title}
            value={card.value}
            icon={card.icon}
            trend={card.trend}
            color={card.color}
            delay={card.delay}
          />
        </div>
      ))}
    </div>
  );
};

const ExperimentTimeline = () => {
  const { experiments } = useExperiments();
  const { styles } = useTheme();

  return (
    <div
      className="rounded-3xl shadow-xl p-6 border glass-morphism"
      style={{
        backgroundColor: styles.cardBackground,
        borderColor: styles.cardBorder,
      }}
    >
      <h3 className="text-xl font-bold mb-6" style={{ color: styles.text }}>
        Experiment Timeline
      </h3>

      <div className="relative">
        <div
          className="absolute left-6 top-0 bottom-0 w-0.5"
          style={{ backgroundColor: styles.border }}
        />

        <div className="space-y-6">
          {experiments.slice(0, 8).map((exp) => (
            <div key={exp.id} className="relative flex items-center space-x-4">
              <div
                className={`w-3 h-3 rounded-full z-10 ${
                  exp.status === "active" ? "animate-pulse-slow" : ""
                }`}
                style={{
                  backgroundColor:
                    exp.status === "active"
                      ? styles.primary
                      : exp.status === "completed"
                      ? styles.success
                      : exp.status === "failed"
                      ? styles.error
                      : styles.warning,
                }}
              />

              <div
                className="flex-1 p-4 rounded-xl transition-all duration-200 hover:shadow-md"
                style={{ 
                  backgroundColor: styles.buttonBackground,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = styles.hoverBackground;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = styles.buttonBackground;
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4
                      className="font-semibold"
                      style={{ color: styles.text }}
                    >
                      {exp.title}
                    </h4>
                    <p
                      className="text-sm"
                      style={{ color: styles.textSecondary }}
                    >
                      {exp.scientist} • {exp.lab}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        exp.status === "active"
                          ? "bg-blue-100 text-blue-800"
                          : exp.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : exp.status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {exp.status}
                    </div>
                    <p
                      className="text-xs mt-1"
                      style={{ color: styles.textSecondary }}
                    >
                      {new Date(exp.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {exp.status === "active" && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: styles.textSecondary }}>
                        Progress
                      </span>
                      <span style={{ color: styles.text }}>
                        {exp.progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${exp.progress}%`,
                          backgroundColor: styles.primary
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface ExperimentTableProps {
  onSelectExperiment: (id: string) => void;
  viewMode: "grid" | "list";
}

const ExperimentTable = ({
  onSelectExperiment,
  viewMode,
}: ExperimentTableProps) => {
  const {
    filteredExperiments,
    filterOptions,
    setFilterOptions,
    resetFilters,
    setEditingExperiment,
    setShowEditModal,
  } = useExperiments();
  const { styles } = useTheme();
  const [sortField, setSortField] = useState<
    keyof (typeof filteredExperiments)[0] | null
  >("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === "grid" ? 9 : 12;

  const sortedExperiments = [...filteredExperiments].sort((a, b) => {
    if (!sortField) return 0;

    const fieldA = a[sortField];
    const fieldB = b[sortField];

    if (fieldA === null) return sortDirection === "asc" ? -1 : 1;
    if (fieldB === null) return sortDirection === "asc" ? 1 : -1;

    if (typeof fieldA === "string" && typeof fieldB === "string") {
      return sortDirection === "asc"
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    }

    if (sortField === "createdAt" || sortField === "completedAt") {
      const dateA = new Date(fieldA as string).getTime();
      const dateB = new Date(fieldB as string).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }

    return sortDirection === "asc"
      ? (fieldA as number) - (fieldB as number)
      : (fieldB as number) - (fieldA as number);
  });

  const searchedExperiments = sortedExperiments.filter(
    (exp) =>
      exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.scientist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.lab.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(searchedExperiments.length / itemsPerPage);
  const paginatedExperiments = searchedExperiments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: keyof (typeof filteredExperiments)[0]) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    const isDark = styles.background === "#18181b";
    switch (status) {
      case "active":
        return isDark
          ? { background: "rgba(59, 130, 246, 0.15)", text: "#60a5fa" }
          : { background: styles.primaryLight, text: styles.primary };
      case "completed":
        return isDark
          ? { background: "rgba(16, 185, 129, 0.15)", text: "#4ade80" }
          : { background: styles.successLight, text: styles.success };
      case "failed":
        return isDark
          ? { background: "rgba(239, 68, 68, 0.15)", text: "#f87171" }
          : { background: styles.errorLight, text: styles.error };
      case "paused":
        return isDark
          ? { background: "rgba(245, 158, 11, 0.15)", text: "#fbbf24" }
          : { background: styles.warningLight, text: styles.warning };
      default:
        return isDark
          ? { background: styles.buttonBackground, text: styles.textSecondary }
          : { background: styles.buttonBackground, text: styles.textMuted };
    }
  };

  const getPriorityColor = (priority: string) => {
    const isDark = styles.background === "#18181b";
    switch (priority) {
      case "high":
        return isDark
          ? { background: "rgba(239, 68, 68, 0.15)", text: "#f87171" }
          : { background: styles.errorLight, text: styles.error };
      case "medium":
        return isDark
          ? { background: "rgba(245, 158, 11, 0.15)", text: "#fbbf24" }
          : { background: styles.warningLight, text: styles.warning };
      case "low":
        return isDark
          ? { background: "rgba(59, 130, 246, 0.15)", text: "#60a5fa" }
          : { background: styles.infoLight, text: styles.info };
      default:
        return isDark
          ? { background: styles.buttonBackground, text: styles.textSecondary }
          : { background: styles.buttonBackground, text: styles.textMuted };
    }
  };

  const getUniqueValues = <T extends keyof (typeof filteredExperiments)[0]>(
    field: T
  ) => {
    const values = new Set<string>();
    filteredExperiments.forEach((exp) => {
      if (exp[field]) values.add(exp[field] as string);
    });
    return Array.from(values).sort();
  };

  const labs = getUniqueValues("lab");
  const scientists = getUniqueValues("scientist");
  const types = getUniqueValues("type");

  const hasActiveFilters =
    filterOptions.status !== "all" ||
    filterOptions.lab !== "all" ||
    filterOptions.scientist !== "all" ||
    filterOptions.type !== "all" ||
    filterOptions.priority !== "all" ||
    filterOptions.dateRange[0] !== null ||
    filterOptions.dateRange[1] !== null;

  const handleEdit = (experiment: Experiment) => {
    setEditingExperiment(experiment);
    setShowEditModal(true);
  };

  if (viewMode === "grid") {
    return (
      <div>
        <div className="p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search experiments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="custom-input text-gray-500 pl-12 pr-4 py-3 w-full rounded-2xl text-sm border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              style={{
                backgroundColor: styles.inputBackground,
                color: styles.inputText,
                borderColor: styles.inputBorder,
              }}
            />
            <Search
              className="absolute left-4 top-3.5 h-5 w-5"
              style={{ color: styles.textSecondary }}
            />
          </div>

          <div className="flex items-center space-x-3">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: "#fee2e2",
                  color: "#dc2626",
                }}
              >
                <RotateCcw size={16} className="mr-2" />
                Reset Filters
              </button>
            )}

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: styles.buttonBackground,
                color: styles.text,
              }}
            >
              <FilterIcon size={16} className="mr-2" />
              Filters
              <ChevronDown
                size={16}
                className={`ml-2 transition-transform duration-200 ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-slide-up">
            {[
              {
                label: "Status",
                field: "status",
                options: ["all", "active", "completed", "failed", "paused"],
              },
              {
                label: "Priority",
                field: "priority",
                options: ["all", "high", "medium", "low"],
              },
              { label: "Lab", field: "lab", options: ["all", ...labs] },
              {
                label: "Scientist",
                field: "scientist",
                options: ["all", ...scientists],
              },
              { label: "Type", field: "type", options: ["all", ...types] },
            ].map(({ label, field, options }) => (
              <div key={label}>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: styles.text }}
                >
                  {label}
                </label>
                <select
                  value={
                    filterOptions[field as keyof typeof filterOptions] as string
                  }
                  onChange={(e) =>
                    setFilterOptions({
                      ...filterOptions,
                      [field]: e.target.value,
                    })
                  }
                  className="custom-select w-full rounded-xl text-sm py-2.5 px-3 border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  style={{
                    backgroundColor: styles.inputBackground,
                    color: styles.inputText,
                    borderColor: styles.inputBorder,
                  }}
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedExperiments.map((experiment, index) => (
            <div
              key={experiment.id}
              className="rounded-2xl shadow-lg border transition-all duration-300 hover:scale-105 hover:shadow-xl glass-morphism animate-fade-in flex flex-col h-full"
              style={{
                backgroundColor: styles.cardBackground,
                borderColor: styles.cardBorder,
                animationDelay: `${index * 50}ms`,
              }}
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4
                      className="font-bold text-lg mb-2"
                      style={{ color: styles.text }}
                    >
                      {experiment.title}
                    </h4>
                    <p
                      className="text-sm"
                      style={{ color: styles.textSecondary }}
                    >
                      {experiment.id}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <span
                      className="px-3 py-1 text-xs font-bold rounded-full"
                      style={{
                        backgroundColor: getStatusColor(experiment.status)
                          .background,
                        color: getStatusColor(experiment.status).text,
                      }}
                    >
                      {experiment.status.toUpperCase()}
                    </span>
                    <span
                      className="px-3 py-1 text-xs font-bold rounded-full"
                      style={{
                        backgroundColor: getPriorityColor(experiment.priority)
                          .background,
                        color: getPriorityColor(experiment.priority).text,
                      }}
                    >
                      {experiment.priority.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4 flex-grow">
                  <div
                    className="flex items-center text-sm"
                    style={{ color: styles.textSecondary }}
                  >
                    <User size={14} className="mr-2" />
                    {experiment.scientist}
                  </div>
                  <div
                    className="flex items-center text-sm"
                    style={{ color: styles.textSecondary }}
                  >
                    <HomeIcon size={14} className="mr-2" />
                    {experiment.lab}
                  </div>
                  <div
                    className="flex items-center text-sm"
                    style={{ color: styles.textSecondary }}
                  >
                    <Calendar size={14} className="mr-2" />
                    {formatDate(experiment.createdAt)}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: styles.textSecondary }}>
                      Progress
                    </span>
                    <span className="font-bold" style={{ color: styles.text }}>
                      {experiment.progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${experiment.progress}%`,
                        backgroundColor:
                          experiment.status === "failed"
                            ? styles.error
                            : experiment.status === "completed"
                            ? styles.success
                            : styles.primary,
                      }}
                    />
                  </div>
                </div>

                <div className="flex space-x-2 mt-auto">
                  <button
                    onClick={() => onSelectExperiment(experiment.id)}
                    className="flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl"
                    style={{
                      backgroundColor: styles.primary,
                      color: "#ffffff",
                    }}
                  >
                    <Eye size={14} className="inline mr-2" />
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(experiment)}
                    className="flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 cursor-pointer"
                    style={{
                      backgroundColor: styles.buttonBackground,
                      color: styles.text,
                      border: `1px solid ${styles.border}`,
                    }}
                  >
                    <Edit3 size={14} className="inline mr-2" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div
            className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t"
            style={{ borderColor: styles.border }}
          >
            <div
              className="text-sm text-center sm:text-left"
              style={{ color: styles.textSecondary }}
            >
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, searchedExperiments.length)}{" "}
              of {searchedExperiments.length} experiments
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: styles.buttonBackground,
                  color: styles.text,
                }}
              >
                Previous
              </button>
              <span
                className="px-4 py-2 text-sm font-medium"
                style={{ color: styles.text }}
              >
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: styles.buttonBackground,
                  color: styles.text,
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  
  return (
    <div>
      <div className="p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search experiments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="custom-input pl-12 pr-4 py-3 w-full rounded-2xl text-sm border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            style={{
              backgroundColor: styles.inputBackground,
              color: styles.inputText,
              borderColor: styles.inputBorder,
            }}
          />
          <Search
            className="absolute left-4 top-3.5 h-5 w-5"
            style={{ color: styles.textSecondary }}
          />
        </div>

        <div className="flex items-center space-x-3">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: "#fee2e2",
                color: "#dc2626",
              }}
            >
              <RotateCcw size={16} className="mr-2" />
              Reset Filters
            </button>
          )}

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: styles.buttonBackground,
              color: styles.text,
            }}
          >
            <FilterIcon size={16} className="mr-2" />
            Filters
            <ChevronDown
              size={16}
              className={`ml-2 transition-transform duration-200 ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-slide-up">
          {[
            {
              label: "Status",
              field: "status",
              options: ["all", "active", "completed", "failed", "paused"],
            },
            {
              label: "Priority",
              field: "priority",
              options: ["all", "high", "medium", "low"],
            },
            { label: "Lab", field: "lab", options: ["all", ...labs] },
            {
              label: "Scientist",
              field: "scientist",
              options: ["all", ...scientists],
            },
            { label: "Type", field: "type", options: ["all", ...types] },
          ].map(({ label, field, options }) => (
            <div key={label}>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: styles.text }}
              >
                {label}
              </label>
              <select
                value={
                  filterOptions[field as keyof typeof filterOptions] as string
                }
                onChange={(e) =>
                  setFilterOptions({
                    ...filterOptions,
                    [field]: e.target.value,
                  })
                }
                className="custom-select w-full rounded-xl text-sm py-2.5 px-3 border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                style={{
                  backgroundColor: styles.inputBackground,
                  color: styles.inputText,
                  borderColor: styles.inputBorder,
                }}
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      <div className="custom-scrollbar overflow-x-auto">
        <table className="min-w-full">
          <thead style={{ backgroundColor: styles.buttonBackground }}>
            <tr>
              {[
                { field: "id", label: "ID" },
                { field: "title", label: "Experiment" },
                { field: "status", label: "Status" },
                { field: "priority", label: "Priority" },
                { field: "progress", label: "Progress" },
                { field: "createdAt", label: "Created" },
                { field: "scientist", label: "Scientist" },
              ].map(({ field, label }) => (
                <th
                  key={field}
                  className="px-6 py-4 text-left text-sm font-bold cursor-pointer hover:bg-opacity-80 transition-colors duration-200"
                  onClick={() =>
                    handleSort(field as keyof (typeof filteredExperiments)[0])
                  }
                  style={{ color: styles.text }}
                >
                  <div className="flex items-center">
                    {label}
                    {sortField === field && (
                      <span className="ml-2">
                        {sortDirection === "asc" ? (
                          <ArrowUp size={14} />
                        ) : (
                          <ArrowDown size={14} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th
                className="px-6 py-4 text-right text-sm font-bold"
                style={{ color: styles.text }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedExperiments.map((experiment, index) => (
              <tr
                key={experiment.id}
                className="border-b hover:bg-opacity-50 transition-all duration-200 animate-fade-in"
                style={{
                  borderColor: styles.border,
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm font-bold"
                  style={{ color: styles.text }}
                >
                  {experiment.id}
                </td>
                <td
                  className="px-6 py-4 text-sm font-semibold"
                  style={{ color: styles.text }}
                >
                  <div className="max-w-xs truncate">{experiment.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className="px-3 py-1 text-xs font-bold rounded-full"
                    style={{
                      backgroundColor: getStatusColor(experiment.status)
                        .background,
                      color: getStatusColor(experiment.status).text,
                    }}
                  >
                    {experiment.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className="px-3 py-1 text-xs font-bold rounded-full"
                    style={{
                      backgroundColor: getPriorityColor(experiment.priority)
                        .background,
                      color: getPriorityColor(experiment.priority).text,
                    }}
                  >
                    {experiment.priority.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-24">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${experiment.progress}%`,
                          backgroundColor:
                            experiment.status === "failed"
                              ? styles.error
                              : experiment.status === "completed"
                              ? styles.success
                              : styles.primary,
                        }}
                      />
                    </div>
                    <span
                      className="text-xs mt-1 block font-semibold"
                      style={{ color: styles.textSecondary }}
                    >
                      {experiment.progress.toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm"
                  style={{ color: styles.textSecondary }}
                >
                  {formatDate(experiment.createdAt)}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm font-semibold"
                  style={{ color: styles.text }}
                >
                  <div className="max-w-xs truncate">
                    {experiment.scientist}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onSelectExperiment(experiment.id)}
                      className="p-2 rounded-lg text-white transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl hover:scale-110"
                      style={{
                        backgroundColor: styles.primary,
                      }}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(experiment)}
                      className="p-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                      title="Edit Experiment"
                    >
                      <Edit3 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div
          className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t"
          style={{ borderColor: styles.border }}
        >
          <div
            className="text-sm text-center sm:text-left"
            style={{ color: styles.textSecondary }}
          >
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, searchedExperiments.length)}{" "}
            of {searchedExperiments.length} experiments
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 cursor-pointer"
              style={{
                backgroundColor: styles.buttonBackground,
                color: styles.text,
              }}
            >
              Previous
            </button>
            <span
              className="px-4 py-2 text-sm font-medium"
              style={{ color: styles.text }}
            >
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 cursor-pointer"
              style={{
                backgroundColor: styles.buttonBackground,
                color: styles.text,
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface ExperimentDetailsProps {
  experiment: Experiment;
  onClose: () => void;
  showCloseButton?: boolean;
}

const ExperimentDetails = ({ experiment, onClose, showCloseButton = true }: ExperimentDetailsProps) => {
  const { styles } = useTheme();
  const [activeTab, setActiveTab] = useState<"overview" | "data" | "notes">(
    "overview"
  );
  const [isVisible, setIsVisible] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getStatusColor = (status: string) => {
    const isDark = styles.background === "#18181b";
    switch (status) {
      case "active":
        return isDark
          ? { background: "rgba(59, 130, 246, 0.15)", text: "#60a5fa" }
          : { background: styles.primaryLight, text: styles.primary };
      case "completed":
        return isDark
          ? { background: "rgba(16, 185, 129, 0.15)", text: "#4ade80" }
          : { background: styles.successLight, text: styles.success };
      case "failed":
        return isDark
          ? { background: "rgba(239, 68, 68, 0.15)", text: "#f87171" }
          : { background: styles.errorLight, text: styles.error };
      case "paused":
        return isDark
          ? { background: "rgba(245, 158, 11, 0.15)", text: "#fbbf24" }
          : { background: styles.warningLight, text: styles.warning };
      default:
        return isDark
          ? { background: styles.buttonBackground, text: styles.textSecondary }
          : { background: styles.buttonBackground, text: styles.textMuted };
    }
  };

  const getPriorityColor = (priority: string) => {
    const isDark = styles.background === "#18181b";
    switch (priority) {
      case "high":
        return isDark
          ? { background: "rgba(239, 68, 68, 0.15)", text: "#f87171" }
          : { background: styles.errorLight, text: styles.error };
      case "medium":
        return isDark
          ? { background: "rgba(245, 158, 11, 0.15)", text: "#fbbf24" }
          : { background: styles.warningLight, text: styles.warning };
      case "low":
        return isDark
          ? { background: "rgba(59, 130, 246, 0.15)", text: "#60a5fa" }
          : { background: styles.infoLight, text: styles.info };
      default:
        return isDark
          ? { background: styles.buttonBackground, text: styles.textSecondary }
          : { background: styles.buttonBackground, text: styles.textMuted };
    }
  };

  const containerStyle = {
    backgroundColor: styles.cardBackground,
    color: styles.text,
    border: `1px solid ${styles.cardBorder}`,
    transform: isVisible
      ? "translateY(0) scale(1)"
      : "translateY(20px) scale(0.95)",
    opacity: isVisible ? 1 : 0,
    transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    boxShadow: `0 20px 25px -5px ${styles.shadowColor}`,
  };

  const tabStyle = (isActive: boolean) => ({
    color: isActive ? styles.primary : styles.text,
    borderBottom: `3px solid ${isActive ? styles.primary : "transparent"}`,
    transition: "all 0.3s ease",
    fontWeight: isActive ? 600 : 500,
  });

  const getLatestValue = (data: { date: string; value: number }[]) => {
    return data.length > 0 ? data[data.length - 1].value.toFixed(1) : "N/A";
  };

  const formatTemperatureData = () => {
    return experiment.temperatureData.slice(-10).map((point, index) => ({
      time: new Date(point.date).toLocaleDateString(),
      temperature: parseFloat(point.value.toFixed(1)),
      ph: parseFloat((experiment.phData[experiment.phData.length - 10 + index]?.value || 0).toFixed(1)),
      reagent: parseFloat((
        experiment.reagentLevels[experiment.reagentLevels.length - 10 + index]
          ?.value || 0
      ).toFixed(1)),
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div>
              <h4
                className="text-sm font-bold mb-3 uppercase tracking-wide"
                style={{ color: styles.text }}
              >
                Description
              </h4>
              <p
                className="text-sm leading-relaxed"
                style={{ color: styles.textSecondary }}
              >
                {experiment.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className="p-3 rounded-2xl transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: styles.buttonBackground }}
              >
                <div className="flex items-center mb-2">
                  <ThermometerIcon
                    size={16}
                    className="md:hidden text-red-500 mr-2"
                  />
                  <span className="text-sm font-semibold">Temp..</span>
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: styles.text }}
                >
                  {getLatestValue(experiment.temperatureData)}°C
                </div>
              </div>

              <div
                className="p-4 rounded-2xl transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: styles.buttonBackground }}
              >
                <div className="flex items-center mb-2">
                  <Droplets
                    size={16}
                    className="md:hidden text-blue-500 mr-2"
                  />
                  <span className="text-sm font-semibold">pH Level</span>
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: styles.text }}
                >
                  {getLatestValue(experiment.phData)}
                </div>
              </div>

              <div
                className="p-4 rounded-2xl transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: styles.buttonBackground }}
              >
                <div className="flex items-center mb-2">
                  <Beaker
                    size={16}
                    className="md:hidden text-purple-500 mr-2"
                  />
                  <span className="text-sm font-semibold">Reagent Levels</span>
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: styles.text }}
                >
                  {getLatestValue(experiment.reagentLevels)}%
                </div>
              </div>

              <div
                className="p-4 rounded-2xl transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: styles.buttonBackground }}
              >
                <div className="flex items-center mb-2">
                  <Target size={16} className="md:hidden text-green-500 mr-2" />
                  <span className="text-sm font-semibold">Success Rate</span>
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: styles.text }}
                >
                  {experiment.successRate.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        );

      case "data":
        return (
          <div className="space-y-6">
            <div>
              <h4
                className="text-sm font-bold mb-4 uppercase tracking-wide"
                style={{ color: styles.text }}
              >
                Real-time Data Visualization
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formatTemperatureData()}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={styles.border}
                    />
                    <XAxis
                      dataKey="time"
                      stroke={styles.textSecondary}
                      fontSize={12}
                    />
                    <YAxis stroke={styles.textSecondary} fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: styles.cardBackground,
                        border: `1px solid ${styles.border}`,
                        borderRadius: "12px",
                        color: styles.text,
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke={styles.error}
                      strokeWidth={3}
                      dot={{ fill: styles.error, strokeWidth: 2, r: 4 }}
                      name="Temperature (°C)"
                    />
                    <Line
                      type="monotone"
                      dataKey="ph"
                      stroke={styles.primary}
                      strokeWidth={3}
                      dot={{ fill: styles.primary, strokeWidth: 2, r: 4 }}
                      name="pH Level"
                    />
                    <Line
                      type="monotone"
                      dataKey="reagent"
                      stroke={styles.info}
                      strokeWidth={3}
                      dot={{ fill: styles.info, strokeWidth: 2, r: 4 }}
                      name="Reagent (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4
                className="text-sm font-bold mb-3 uppercase tracking-wide"
                style={{ color: styles.text }}
              >
                Success Metrics
              </h4>
              <div
                className="p-4 rounded-2xl"
                style={{ backgroundColor: styles.buttonBackground }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">Success Rate:</span>
                  <span className="text-lg font-bold">
                    {experiment.successRate.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${experiment.successRate}%`,
                      backgroundColor: styles.success
                    }}
                  />
                </div>
                <div
                  className="mt-3 text-xs"
                  style={{ color: styles.textSecondary }}
                >
                  Contamination Level: {experiment.contamination.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        );

      case "notes":
        return (
          <div>
            <h4
              className="text-sm font-bold mb-4 uppercase tracking-wide"
              style={{ color: styles.text }}
            >
              Experiment Notes & Results
            </h4>
            {experiment.notes ? (
              <div className="space-y-4">
                <div
                  className="p-4 rounded-2xl"
                  style={{ backgroundColor: styles.buttonBackground }}
                >
                  <h5
                    className="font-semibold mb-2"
                    style={{ color: styles.text }}
                  >
                    Notes
                  </h5>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: styles.textSecondary }}
                  >
                    {experiment.notes}
                  </p>
                </div>

                {experiment.results && experiment.status === "completed" && (
                  <div
                    className="p-4 rounded-2xl"
                    style={{ backgroundColor: styles.buttonBackground }}
                  >
                    <h5
                      className="font-semibold mb-2"
                      style={{ color: styles.text }}
                    >
                      Results
                    </h5>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: styles.textSecondary }}
                    >
                      {experiment.results}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="p-6 rounded-2xl text-center"
                style={{ backgroundColor: styles.buttonBackground }}
              >
                <p
                  className="text-sm mb-4"
                  style={{ color: styles.textSecondary }}
                >
                  No notes available for this experiment.
                </p>
                <button
                  className="px-4 py-2 text-sm rounded-xl text-white font-medium transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: "#3b82f6" }}
                >
                  Add Note
                </button>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div
      className="rounded-3xl shadow-2xl sticky top-20 glass-morphism"
      style={containerStyle}
    >
      <div
        className="p-6 flex justify-between items-start border-b"
        style={{ borderColor: styles.border }}
      >
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-3" style={{ color: styles.text }}>
            {experiment.title}
          </h3>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{
                backgroundColor: getStatusColor(experiment.status).background,
                color: getStatusColor(experiment.status).text,
              }}
            >
              {experiment.status.toUpperCase()}
            </span>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{
                backgroundColor: getPriorityColor(experiment.priority)
                  .background,
                color: getPriorityColor(experiment.priority).text,
              }}
            >
              {experiment.priority.toUpperCase()}
            </span>
          </div>
          <div
            className="flex items-center text-xs"
            style={{ color: styles.textSecondary }}
          >
            <Clock size={12} className="mr-1" />
            {formatDate(experiment.createdAt)}
          </div>
        </div>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="p-3 rounded-2xl transition-all duration-200 hover:scale-110 cursor-pointer"
            style={{
              backgroundColor: styles.buttonBackground,
              color: styles.text,
            }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div
            className="flex items-center text-xs space-x-4"
            style={{ color: styles.textSecondary }}
          >
            <div className="flex items-center">
              <User size={12} className="mr-1" />
              {experiment.scientist}
            </div>
            <div className="flex items-center">
              <HomeIcon size={12} className="mr-1" />
              {experiment.lab}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span
              className="text-sm font-semibold"
              style={{ color: styles.text }}
            >
              Progress
            </span>
            <span className="text-sm font-bold">{experiment.progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-1000"
              style={{
                width: `${experiment.progress}%`,
                backgroundColor:
                  experiment.status === "failed"
                    ? styles.error
                    : experiment.status === "completed"
                    ? styles.success
                    : styles.primary,
              }}
            />
          </div>
        </div>

        <div className="mb-6 border-b" style={{ borderColor: styles.border }}>
          <nav className="flex space-x-6">
            {["overview", "data", "notes"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className="py-3 px-1 text-sm font-medium transition-all duration-200 cursor-pointer"
                style={tabStyle(activeTab === tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
};

const ActivityFeed = () => {
  const { activity, realTimeUpdates } = useExperiments();
  const { styles } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatTime = (timestamp: string) => {
    if (!isClient) {
      return new Date(timestamp).toLocaleDateString();
    }
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "started":
        return {
          background: "#dbeafe",
          text: "#1d4ed8",
          icon: <Activity size={16} />,
        };
      case "updated":
        return {
          background: "#fef3c7",
          text: "#d97706",
          icon: <Settings size={16} />,
        };
      case "completed":
        return {
          background: "#d1fae5",
          text: "#059669",
          icon: <CheckCircle size={16} />,
        };
      case "failed":
        return {
          background: "#fee2e2",
          text: "#dc2626",
          icon: <XCircle size={16} />,
        };
      case "paused":
        return {
          background: "#fff7ed",
          text: "#ea580c",
          icon: <Clock size={16} />,
        };
      default:
        return {
          background: "#f3f4f6",
          text: "#6b7280",
          icon: <Activity size={16} />,
        };
    }
  };

  const containerStyle = {
    backgroundColor: styles.cardBackground,
    color: styles.text,
    border: `1px solid ${styles.cardBorder}`,
    transition: "all 0.3s ease",
    boxShadow: `0 10px 25px -5px ${styles.shadowColor}`,
  };

  return (
    <div
      className="rounded-3xl shadow-xl p-6 top-20 glass-morphism animate-fade-in"
      style={containerStyle}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold" style={{ color: styles.text }}>
          Live Activity
        </h3>
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              realTimeUpdates ? "animate-pulse bg-green-500" : "bg-gray-400"
            }`}
          />
          <ActivitySquare
            size={20}
            style={{ color: styles.textSecondary }}
            className="block sm:hidden"
          />
        </div>
      </div>

      <div className="space-y-4">
        {activity.map((item, index) => {
          const actionConfig = getActionColor(item.action);
          return (
            <div
              key={item.id}
              className="p-4 rounded-2xl transition-all duration-300 hover:scale-102 hover:shadow-lg animate-slide-up"
              style={{
                backgroundColor: styles.buttonBackground,
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="flex items-start space-x-3">
                <div
                  className="flex-shrink-0 p-2 rounded-xl block sm:hidden"
                  style={{
                    backgroundColor: actionConfig.background,
                    color: actionConfig.text,
                  }}
                >
                  {actionConfig.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: actionConfig.background,
                        color: actionConfig.text,
                      }}
                    >
                      {item.action.toUpperCase()}
                    </span>
                    <div
                      className="flex items-center text-xs"
                      style={{ color: styles.textSecondary }}
                    >
                      <Clock size={12} className="mr-1 block sm:hidden" />
                      <span suppressHydrationWarning>
                      {formatTime(item.timestamp)}
                      </span>
                    </div>
                  </div>
                  <p
                    className="text-sm font-semibold mb-1 truncate"
                    style={{ color: styles.text }}
                  >
                    {item.experimentName}
                  </p>
                  <div
                    className="flex items-center text-xs"
                    style={{ color: styles.textSecondary }}
                  >
                    <User size={12} className="mr-1 block sm:hidden" />
                    {item.user}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const QuickStats = () => {
  const { experiments } = useExperiments();
  const { styles } = useTheme();

  const stats = {
    avgProgress: Math.round(
      experiments
        .filter((exp) => exp.status === "active")
        .reduce((sum, exp) => sum + exp.progress, 0) /
        experiments.filter((exp) => exp.status === "active").length || 0
    ),
    highPriority: experiments.filter((exp) => exp.priority === "high").length,
    todayStarted: experiments.filter((exp) => {
      const today = new Date().toDateString();
      return new Date(exp.createdAt).toDateString() === today;
    }).length,
    avgSuccessRate: Math.round(
      experiments.reduce((sum, exp) => sum + exp.successRate, 0) /
        experiments.length
    ),
  };

  const containerStyle = {
    backgroundColor: styles.cardBackground,
    color: styles.text,
    border: `1px solid ${styles.cardBorder}`,
    transition: "all 0.3s ease",
    boxShadow: `0 10px 25px -5px ${styles.shadowColor}`,
  };

  return (
    <div
      className="rounded-3xl shadow-xl p-6 glass-morphism animate-fade-in"
      style={containerStyle}
    >
      <h3 className="text-xl font-bold mb-6" style={{ color: styles.text }}>
        Quick Stats
      </h3>

      <div className="space-y-4">
        <div
          className="p-4 rounded-2xl transition-all duration-300 hover:scale-105"
          style={{ backgroundColor: styles.buttonBackground }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: styles.textSecondary }}
              >
                Avg Progress
              </p>
              <p className="text-2xl font-bold" style={{ color: styles.text }}>
                {stats.avgProgress.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 rounded-xl" style={{ backgroundColor: styles.primary }}>
              <BarChart3 size={20} className="text-white" />
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-2xl transition-all duration-300 hover:scale-105"
          style={{ backgroundColor: styles.buttonBackground }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: styles.textSecondary }}
              >
                High Priority
              </p>
              <p className="text-2xl font-bold" style={{ color: styles.text }}>
                {stats.highPriority}
              </p>
            </div>
            <div className="p-3 rounded-xl" style={{ backgroundColor: styles.error }}>
              <Target size={20} className="text-white" />
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-2xl transition-all duration-300 hover:scale-105"
          style={{ backgroundColor: styles.buttonBackground }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: styles.textSecondary }}
              >
                Started Today
              </p>
              <p className="text-2xl font-bold" style={{ color: styles.text }}>
                {stats.todayStarted}
              </p>
            </div>
            <div className="p-3 rounded-xl" style={{ backgroundColor: styles.success }}>
              <Calendar size={20} className="text-white" />
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-2xl transition-all duration-300 hover:scale-105"
          style={{ backgroundColor: styles.buttonBackground }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: styles.textSecondary }}
              >
                Success Rate
              </p>
              <p className="text-2xl font-bold" style={{ color: styles.text }}>
                {stats.avgSuccessRate.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 rounded-xl" style={{ backgroundColor: styles.info }}>
              <TrendingUp size={20} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const { styles } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="mt-16 border-t"
      style={{
        backgroundColor: styles.headerBackground,
        borderColor: styles.headerBorder,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <p
            className="text-sm"
            style={{ color: styles.textSecondary }}
          >
            © {currentYear} LabTracker Pro. Built for modern laboratory management.
          </p>
        </div>
      </div>
    </footer>
  );
};

const ViewModal = () => {
  const {
    selectedExperiment,
    showViewModal,
    setShowViewModal,
    selectExperiment,
  } = useExperiments();
  const { styles } = useTheme();

  
  useEffect(() => {
    if (showViewModal) {
      
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [showViewModal]);

  
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showViewModal) {
        handleClose();
      }
    };

    if (showViewModal) {
      document.addEventListener('keydown', handleEscapeKey);
      
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [showViewModal]);

  const handleClose = () => {
    setShowViewModal(false);
    selectExperiment(null);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!showViewModal || !selectedExperiment) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-modal-title"
    >
      <div
        className="custom-scrollbar max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl glass-morphism animate-slide-up"
        style={{
          backgroundColor: styles.cardBackground,
          border: `1px solid ${styles.cardBorder}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b" style={{ borderColor: styles.border }}>
          <div className="flex items-center justify-between">
            <h2 id="view-modal-title" className="text-2xl font-bold" style={{ color: styles.text }}>
              Experiment Details
            </h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl transition-all duration-200 hover:scale-110 cursor-pointer"
              style={{
                backgroundColor: styles.buttonBackground,
                color: styles.text,
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <ExperimentDetails
            experiment={selectedExperiment}
            onClose={handleClose}
            showCloseButton={false}
          />
        </div>
      </div>
    </div>
  );
};

const EditModal = () => {
  const {
    editingExperiment,
    showEditModal,
    setShowEditModal,
    updateExperiment,
    setEditingExperiment,
  } = useExperiments();
  const { styles } = useTheme();
  const [formData, setFormData] = useState<Experiment | null>(null);

  useEffect(() => {
    if (editingExperiment) {
      setFormData({ ...editingExperiment });
    }
  }, [editingExperiment]);

  
  useEffect(() => {
    if (showEditModal) {
      
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [showEditModal]);

  
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showEditModal) {
        handleClose();
      }
    };

    if (showEditModal) {
      document.addEventListener('keydown', handleEscapeKey);
      
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [showEditModal]);

  const handleSave = () => {
    if (formData) {
      updateExperiment(formData);
      setShowEditModal(false);
      setEditingExperiment(null);
    }
  };

  const handleClose = () => {
    setShowEditModal(false);
    setEditingExperiment(null);
    setFormData(null);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleInputChange = (
    field: keyof Experiment,
    value: string | number
  ) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  if (!showEditModal || !formData) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
    >
      <div
        className="custom-scrollbar max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl glass-morphism animate-slide-up"
        style={{
          backgroundColor: styles.cardBackground,
          border: `1px solid ${styles.cardBorder}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b" style={{ borderColor: styles.border }}>
          <div className="flex items-center justify-between">
            <h2 id="edit-modal-title" className="text-2xl font-bold" style={{ color: styles.text }}>
              Edit Experiment
            </h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl transition-all duration-200 hover:scale-110 cursor-pointer"
              style={{
                backgroundColor: styles.buttonBackground,
                color: styles.text,
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: styles.text }}
              >
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="custom-input w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                style={{
                  backgroundColor: styles.inputBackground,
                  color: styles.inputText,
                  borderColor: styles.inputBorder,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: styles.text }}
              >
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="custom-select w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                style={{
                  backgroundColor: styles.inputBackground,
                  color: styles.inputText,
                  borderColor: styles.inputBorder,
                }}
              >
                <option value="PCR Analysis">PCR Analysis</option>
                <option value="Cell Culture">Cell Culture</option>
                <option value="Protein Expression">Protein Expression</option>
                <option value="Enzyme Assay">Enzyme Assay</option>
                <option value="Chromatography">Chromatography</option>
                <option value="Spectroscopy">Spectroscopy</option>
                <option value="Genome Sequencing">Genome Sequencing</option>
                <option value="Antibody Testing">Antibody Testing</option>
                <option value="Flow Cytometry">Flow Cytometry</option>
                <option value="Western Blot">Western Blot</option>
                <option value="ELISA Analysis">ELISA Analysis</option>
                <option value="Mass Spectrometry">Mass Spectrometry</option>
                <option value="DNA Extraction">DNA Extraction</option>
                <option value="RNA Sequencing">RNA Sequencing</option>
                <option value="Immunofluorescence">Immunofluorescence</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: styles.text }}
              >
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  handleInputChange(
                    "status",
                    e.target.value as ExperimentStatus
                  )
                }
                className="custom-select w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                style={{
                  backgroundColor: styles.inputBackground,
                  color: styles.inputText,
                  borderColor: styles.inputBorder,
                }}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="paused">Paused</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: styles.text }}
              >
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  handleInputChange(
                    "priority",
                    e.target.value as "low" | "medium" | "high"
                  )
                }
                className="custom-select w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                style={{
                  backgroundColor: styles.inputBackground,
                  color: styles.inputText,
                  borderColor: styles.inputBorder,
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: styles.text }}
              >
                Progress (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) =>
                  handleInputChange("progress", parseInt(e.target.value) || 0)
                }
                className="custom-input w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                style={{
                  backgroundColor: styles.inputBackground,
                  color: styles.inputText,
                  borderColor: styles.inputBorder,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: styles.text }}
              >
                Success Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.successRate}
                onChange={(e) =>
                  handleInputChange(
                    "successRate",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="custom-input w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                style={{
                  backgroundColor: styles.inputBackground,
                  color: styles.inputText,
                  borderColor: styles.inputBorder,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: styles.text }}
              >
                Scientist
              </label>
              <select
                value={formData.scientist}
                onChange={(e) => handleInputChange("scientist", e.target.value)}
                className="custom-select w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                style={{
                  backgroundColor: styles.inputBackground,
                  color: styles.inputText,
                  borderColor: styles.inputBorder,
                }}
              >
                <option value="Dr. Emma Chen">Dr. Emma Chen</option>
                <option value="Dr. Michael Rodriguez">
                  Dr. Michael Rodriguez
                </option>
                <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
                <option value="Dr. David Kim">Dr. David Kim</option>
                <option value="Dr. Lisa Patel">Dr. Lisa Patel</option>
                <option value="Dr. James Wilson">Dr. James Wilson</option>
                <option value="Dr. Anna Martinez">Dr. Anna Martinez</option>
                <option value="Dr. Robert Brown">Dr. Robert Brown</option>
                <option value="Dr. Jennifer Lee">Dr. Jennifer Lee</option>
                <option value="Dr. Thomas Anderson">Dr. Thomas Anderson</option>
                <option value="Dr. Maria Garcia">Dr. Maria Garcia</option>
                <option value="Dr. Kevin Zhang">Dr. Kevin Zhang</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: styles.text }}
              >
                Laboratory
              </label>
              <select
                value={formData.lab}
                onChange={(e) => handleInputChange("lab", e.target.value)}
                className="custom-select w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                style={{
                  backgroundColor: styles.inputBackground,
                  color: styles.inputText,
                  borderColor: styles.inputBorder,
                }}
              >
                <option value="Molecular Biology Lab">
                  Molecular Biology Lab
                </option>
                <option value="Biochemistry Lab">Biochemistry Lab</option>
                <option value="Genetics Lab">Genetics Lab</option>
                <option value="Microbiology Lab">Microbiology Lab</option>
                <option value="Immunology Lab">Immunology Lab</option>
                <option value="Cell Biology Lab">Cell Biology Lab</option>
              </select>
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: styles.text }}
            >
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="custom-input w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
              style={{
                backgroundColor: styles.inputBackground,
                color: styles.inputText,
                borderColor: styles.inputBorder,
              }}
            />
          </div>

          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: styles.text }}
            >
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
              className="custom-input w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
              style={{
                backgroundColor: styles.inputBackground,
                color: styles.inputText,
                borderColor: styles.inputBorder,
              }}
            />
          </div>
        </div>

        <div className="p-6 border-t" style={{ borderColor: styles.border }}>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold transition-all duration-200 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl min-h-[48px]"
              style={{
                backgroundColor: styles.primary,
                color: "#ffffff",
              }}
            >
              <Save size={18} />
              <span>Save Changes</span>
            </button>
            <button
              onClick={handleClose}
              className="flex-1 flex items-center justify-center py-3 px-6 rounded-xl font-semibold transition-all duration-200 hover:scale-105 cursor-pointer min-h-[48px]"
              style={{
                backgroundColor: styles.buttonBackground,
                color: styles.text,
                border: `1px solid ${styles.border}`,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

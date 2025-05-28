"use client"
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  MoreVertical,
  DollarSign,
  Users,
  ShoppingCart,
  Activity,
  Target,
  Zap,
  BarChart3,
  PieChart,
  Download,
  Share,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Grip,
  Eye,
  Settings,
  Bell,
  Search,
  ChevronRight,
  Star,
  Clock,
  Globe,
  Heart,
  Award,
  Briefcase,
  X,
  BarChart,
  Flag,
  Calendar as CalendarIcon,
  Sparkles,
} from "lucide-react";

interface MetricData {
  id: string;
  title: string;
  value: number;
  target: number;
  trend: number[];
  unit: string;
  prefix?: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  priority: number;
  category:
    | "revenue"
    | "users"
    | "performance"
    | "growth"
    | "marketing"
    | "operations";
  description: string;
  lastUpdated: string;
  status: "excellent" | "good" | "warning" | "critical";
  isRealTime?: boolean;
  historicalData: {
    "7d": { value: number; target: number; trend: number[] };
    "30d": { value: number; target: number; trend: number[] };
    "90d": { value: number; target: number; trend: number[] };
  };
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  action: () => void;
  description: string;
}

interface TrendPrediction {
  direction: "up" | "down" | "stable";
  confidence: number;
  predictedValue: number;
  timeframe: string;
  volatility: "low" | "medium" | "high";
  insights: string[];
  recommendations: string[];
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

interface PredictiveInsight {
  id: string;
  metric: MetricData;
  prediction: TrendPrediction;
  projectedGrowth: number;
}

const BIMobileDashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [dateRange, setDateRange] = useState<string>("7d");
  const [activeQuickActions, setActiveQuickActions] = useState<string | null>(
    null
  );
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<string>("overview");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [animationPhase, setAnimationPhase] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sideDrawerOpen, setSideDrawerOpen] = useState<boolean>(false);
  const [selectedInsight, setSelectedInsight] =
    useState<PredictiveInsight | null>(null);

  const addToast = useCallback(
    (
      message: string,
      type: Toast["type"] = "success",
      duration: number = 3000
    ) => {
      const id = Date.now().toString();
      const newToast: Toast = { id, message, type, duration };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    },
    []
  );

  const baseMetricsData: MetricData[] = [
    {
      id: "revenue",
      title: "Total Revenue",
      value: 127500,
      target: 150000,
      trend: [
        95000, 102000, 108000, 118000, 125000, 127500, 132000, 138000, 145000,
        152000,
      ],
      unit: "",
      prefix: "$",
      icon: DollarSign,
      color: "#10B981",
      bgColor: "#ECFDF5",
      priority: 1,
      category: "revenue",
      description: "Monthly recurring revenue from all sources",
      lastUpdated: "2 mins ago",
      status: "good",
      isRealTime: true,
      historicalData: {
        "7d": {
          value: 127500,
          target: 150000,
          trend: [120000, 122000, 124000, 125000, 126000, 127000, 127500],
        },
        "30d": {
          value: 127500,
          target: 150000,
          trend: [
            95000, 98000, 102000, 108000, 115000, 118000, 122000, 125000,
            126500, 127500,
          ],
        },
        "90d": {
          value: 127500,
          target: 150000,
          trend: [
            80000, 85000, 90000, 95000, 100000, 108000, 115000, 120000, 125000,
            127500,
          ],
        },
      },
    },
    {
      id: "customers",
      title: "Active Users",
      value: 8420,
      target: 10000,
      trend: [7200, 7400, 7800, 8100, 8300, 8420, 8650, 8900, 9200, 9500],
      unit: "",
      icon: Users,
      color: "#3B82F6",
      bgColor: "#EFF6FF",
      priority: 2,
      category: "users",
      description: "Monthly active users across all platforms",
      lastUpdated: "5 mins ago",
      status: "good",
      isRealTime: true,
      historicalData: {
        "7d": {
          value: 8420,
          target: 10000,
          trend: [8200, 8250, 8300, 8350, 8380, 8400, 8420],
        },
        "30d": {
          value: 8420,
          target: 10000,
          trend: [7200, 7400, 7600, 7800, 8000, 8100, 8200, 8300, 8350, 8420],
        },
        "90d": {
          value: 8420,
          target: 10000,
          trend: [6800, 7000, 7200, 7400, 7600, 7800, 8000, 8100, 8300, 8420],
        },
      },
    },
    {
      id: "orders",
      title: "Total Orders",
      value: 1247,
      target: 1500,
      trend: [980, 1050, 1100, 1180, 1220, 1247, 1290, 1340, 1400, 1450],
      unit: "",
      icon: ShoppingCart,
      color: "#F59E0B",
      bgColor: "#FFFBEB",
      priority: 3,
      category: "revenue",
      description: "Total orders processed this month",
      lastUpdated: "1 min ago",
      status: "warning",
      historicalData: {
        "7d": {
          value: 1247,
          target: 1500,
          trend: [1200, 1215, 1225, 1235, 1240, 1245, 1247],
        },
        "30d": {
          value: 1247,
          target: 1500,
          trend: [980, 1020, 1050, 1100, 1150, 1180, 1200, 1220, 1235, 1247],
        },
        "90d": {
          value: 1247,
          target: 1500,
          trend: [850, 900, 950, 980, 1020, 1080, 1150, 1180, 1220, 1247],
        },
      },
    },
    {
      id: "conversion",
      title: "Conversion Rate",
      value: 3.8,
      target: 4.5,
      trend: [3.2, 3.3, 3.4, 3.6, 3.7, 3.8, 3.9, 4.1, 4.3, 4.5],
      unit: "%",
      icon: Target,
      color: "#8B5CF6",
      bgColor: "#F3F4F6",
      priority: 4,
      category: "performance",
      description: "Visitor to customer conversion rate",
      lastUpdated: "3 mins ago",
      status: "warning",
      historicalData: {
        "7d": {
          value: 3.8,
          target: 4.5,
          trend: [3.6, 3.65, 3.7, 3.72, 3.75, 3.78, 3.8],
        },
        "30d": {
          value: 3.8,
          target: 4.5,
          trend: [3.2, 3.3, 3.4, 3.5, 3.6, 3.65, 3.7, 3.75, 3.78, 3.8],
        },
        "90d": {
          value: 3.8,
          target: 4.5,
          trend: [2.9, 3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8],
        },
      },
    },
    {
      id: "retention",
      title: "User Retention",
      value: 78.5,
      target: 85.0,
      trend: [72.1, 73.5, 74.3, 76.8, 77.2, 78.5, 79.8, 82.1, 84.2, 86.5],
      unit: "%",
      icon: Heart,
      color: "#EF4444",
      bgColor: "#FEF2F2",
      priority: 5,
      category: "users",
      description: "30-day user retention rate",
      lastUpdated: "8 mins ago",
      status: "good",
      historicalData: {
        "7d": {
          value: 78.5,
          target: 85.0,
          trend: [77.8, 78.0, 78.1, 78.2, 78.3, 78.4, 78.5],
        },
        "30d": {
          value: 78.5,
          target: 85.0,
          trend: [72.1, 73.5, 74.3, 75.8, 76.5, 77.2, 77.8, 78.0, 78.3, 78.5],
        },
        "90d": {
          value: 78.5,
          target: 85.0,
          trend: [68.5, 70.2, 72.1, 73.5, 74.8, 76.0, 77.0, 77.8, 78.2, 78.5],
        },
      },
    },
    {
      id: "satisfaction",
      title: "Customer Satisfaction",
      value: 4.2,
      target: 4.5,
      trend: [3.8, 3.9, 4.0, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6],
      unit: "/5",
      icon: Star,
      color: "#F97316",
      bgColor: "#FFF7ED",
      priority: 6,
      category: "performance",
      description: "Average customer satisfaction score",
      lastUpdated: "12 mins ago",
      status: "good",
      historicalData: {
        "7d": {
          value: 4.2,
          target: 4.5,
          trend: [4.15, 4.16, 4.17, 4.18, 4.19, 4.2, 4.2],
        },
        "30d": {
          value: 4.2,
          target: 4.5,
          trend: [3.8, 3.9, 4.0, 4.05, 4.1, 4.12, 4.15, 4.17, 4.19, 4.2],
        },
        "90d": {
          value: 4.2,
          target: 4.5,
          trend: [3.6, 3.7, 3.8, 3.85, 3.9, 4.0, 4.05, 4.1, 4.15, 4.2],
        },
      },
    },
    {
      id: "growth",
      title: "Growth Rate",
      value: 23.4,
      target: 30.0,
      trend: [18.2, 19.1, 19.8, 21.5, 22.1, 23.4, 25.8, 28.2, 29.8, 32.1],
      unit: "%",
      icon: TrendingUp,
      color: "#06B6D4",
      bgColor: "#F0F9FF",
      priority: 7,
      category: "growth",
      description: "Month-over-month growth rate",
      lastUpdated: "6 mins ago",
      status: "excellent",
      historicalData: {
        "7d": {
          value: 23.4,
          target: 30.0,
          trend: [22.8, 22.9, 23.0, 23.1, 23.2, 23.3, 23.4],
        },
        "30d": {
          value: 23.4,
          target: 30.0,
          trend: [18.2, 19.1, 19.8, 20.5, 21.2, 21.8, 22.4, 22.8, 23.1, 23.4],
        },
        "90d": {
          value: 23.4,
          target: 30.0,
          trend: [15.2, 16.5, 17.8, 18.5, 19.2, 20.1, 21.0, 22.0, 22.8, 23.4],
        },
      },
    },
    {
      id: "expenses",
      title: "Operating Expenses",
      value: 45200,
      target: 40000,
      trend: [
        42000, 43000, 43500, 44200, 44800, 45200, 44800, 43500, 42800, 41500,
      ],
      unit: "",
      prefix: "$",
      icon: Briefcase,
      color: "#DC2626",
      bgColor: "#FEF2F2",
      priority: 8,
      category: "operations",
      description: "Total operating expenses this month",
      lastUpdated: "15 mins ago",
      status: "critical",
      historicalData: {
        "7d": {
          value: 45200,
          target: 40000,
          trend: [45000, 45050, 45100, 45120, 45150, 45180, 45200],
        },
        "30d": {
          value: 45200,
          target: 40000,
          trend: [
            42000, 42500, 43000, 43500, 44000, 44200, 44500, 44800, 45000,
            45200,
          ],
        },
        "90d": {
          value: 45200,
          target: 40000,
          trend: [
            40000, 40800, 41500, 42000, 42800, 43200, 43800, 44200, 44800,
            45200,
          ],
        },
      },
    },
  ];

  const [metrics, setMetrics] = useState<MetricData[]>(baseMetricsData);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const updatedMetrics = baseMetricsData.map((metric) => {
        const historicalData =
          metric.historicalData[
            dateRange as keyof typeof metric.historicalData
          ];
        return {
          ...metric,
          value: historicalData.value,
          target: historicalData.target,
          trend: historicalData.trend,
          lastUpdated: `Updated for ${dateRange}`,
        };
      });
      setMetrics(updatedMetrics);
      setAnimationPhase((prev) => prev + 1);
      setIsLoading(false);
    }, 1000);
  }, [dateRange]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setMetrics((prevMetrics) =>
        prevMetrics.map((metric) => {
          if (!metric.isRealTime) return metric;

          const variation = (Math.random() - 0.5) * 0.05;
          const newValue = Math.max(0, metric.value * (1 + variation));
          const newTrend = [...metric.trend.slice(1), newValue];

          return {
            ...metric,
            value: Math.round(newValue * 100) / 100,
            trend: newTrend,
            lastUpdated: "Just now",
          };
        })
      );
      setAnimationPhase((prev) => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getMetricQuickActions = useCallback(
    (metric: MetricData): QuickAction[] => {
      const baseActions: QuickAction[] = [
        {
          id: "view_details",
          label: "View Details",
          icon: Eye,
          action: () =>
            addToast(`Opening detailed view for ${metric.title}`, "info"),
          description: "Open comprehensive analytics",
        },
        {
          id: "refresh_data",
          label: "Refresh Data",
          icon: RefreshCw,
          action: () => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              addToast(
                `${metric.title} data refreshed successfully`,
                "success"
              );
            }, 1000);
          },
          description: "Update latest metrics",
        },
        {
          id: "set_alert",
          label: "Set Alert",
          icon: Bell,
          action: () =>
            addToast(`Alert configured for ${metric.title}`, "success"),
          description: "Configure threshold notifications",
        },
        {
          id: "export_data",
          label: "Export Data",
          icon: Download,
          action: () => addToast(`Exporting ${metric.title} data...`, "info"),
          description: "Download metric data",
        },
      ];

      const categoryActions: Record<string, QuickAction[]> = {
        revenue: [
          {
            id: "forecast_revenue",
            label: "Revenue Forecast",
            icon: TrendingUp,
            action: () =>
              addToast("Generating revenue forecast report", "info"),
            description: "Generate revenue predictions",
          },
          {
            id: "compare_periods",
            label: "Compare Periods",
            icon: BarChart,
            action: () =>
              addToast("Opening period comparison for revenue", "info"),
            description: "Compare with previous periods",
          },
        ],
        users: [
          {
            id: "user_segmentation",
            label: "User Segments",
            icon: Users,
            action: () =>
              addToast("Opening user segmentation analysis", "info"),
            description: "Analyze user demographics",
          },
          {
            id: "retention_analysis",
            label: "Retention Analysis",
            icon: Heart,
            action: () => addToast("Loading retention cohort analysis", "info"),
            description: "Deep dive into user retention",
          },
        ],
        performance: [
          {
            id: "performance_optimization",
            label: "Optimize",
            icon: Zap,
            action: () =>
              addToast(
                `Performance optimization tips for ${metric.title}`,
                "info"
              ),
            description: "Get optimization recommendations",
          },
          {
            id: "benchmark",
            label: "Benchmark",
            icon: Target,
            action: () => addToast("Loading industry benchmarks", "info"),
            description: "Compare with industry standards",
          },
        ],
        growth: [
          {
            id: "growth_drivers",
            label: "Growth Drivers",
            icon: TrendingUp,
            action: () => addToast("Analyzing growth factors", "info"),
            description: "Identify key growth drivers",
          },
          {
            id: "market_analysis",
            label: "Market Analysis",
            icon: Globe,
            action: () => addToast("Opening market trend analysis", "info"),
            description: "View market conditions",
          },
        ],
        marketing: [
          {
            id: "campaign_analysis",
            label: "Campaign Stats",
            icon: BarChart,
            action: () => addToast("Loading campaign performance data", "info"),
            description: "Analyze marketing campaigns",
          },
          {
            id: "audience_insights",
            label: "Audience Insights",
            icon: Users,
            action: () =>
              addToast("Generating audience insights report", "info"),
            description: "Understand target audience",
          },
        ],
        operations: [
          {
            id: "process_optimization",
            label: "Optimize Process",
            icon: Settings,
            action: () =>
              addToast(`Process optimization for ${metric.title}`, "info"),
            description: "Improve operational efficiency",
          },
          {
            id: "cost_analysis",
            label: "Cost Analysis",
            icon: DollarSign,
            action: () => addToast("Opening cost breakdown analysis", "info"),
            description: "Analyze cost structures",
          },
        ],
      };

      const statusActions: Record<string, QuickAction[]> = {
        critical: [
          {
            id: "urgent_action",
            label: "Urgent Action Required",
            icon: AlertTriangle,
            action: () =>
              addToast(`Critical issue flagged for ${metric.title}`, "warning"),
            description: "Address critical performance issues",
          },
          {
            id: "escalate",
            label: "Escalate Issue",
            icon: Flag,
            action: () => addToast("Issue escalated to management", "warning"),
            description: "Notify management team",
          },
        ],
        warning: [
          {
            id: "improvement_plan",
            label: "Improvement Plan",
            icon: TrendingUp,
            action: () =>
              addToast(`Creating improvement plan for ${metric.title}`, "info"),
            description: "Generate action plan",
          },
        ],
        excellent: [
          {
            id: "share_success",
            label: "Share Success",
            icon: Share,
            action: () => addToast("Success story shared with team", "success"),
            description: "Share positive results",
          },
        ],
      };

      return [
        ...baseActions,
        ...(categoryActions[metric.category] || []),
        ...(statusActions[metric.status] || []),
      ];
    },
    [addToast]
  );

  const calculateMovingAverage = useCallback(
    (data: number[], window: number = 3): number => {
      if (data.length < window) return data[data.length - 1];
      const recent = data.slice(-window);
      return recent.reduce((sum, val) => sum + val, 0) / window;
    },
    []
  );

  const calculateTrendPrediction = useCallback(
    (data: number[]): TrendPrediction => {
      const recentTrend = data.slice(-5);
      const avgGrowth =
        recentTrend.reduce((acc, val, idx) => {
          if (idx === 0) return acc;
          return acc + (val - recentTrend[idx - 1]) / recentTrend[idx - 1];
        }, 0) /
        (recentTrend.length - 1);

      const currentValue = data[data.length - 1];
      const predictedValue = currentValue * (1 + avgGrowth);

      const variance =
        recentTrend.reduce((acc, val) => {
          const mean =
            recentTrend.reduce((sum, v) => sum + v, 0) / recentTrend.length;
          return acc + Math.pow(val - mean, 2);
        }, 0) / recentTrend.length;

      const volatility = Math.sqrt(variance) / currentValue;

      const insights = [
        `Current trend shows ${avgGrowth > 0 ? "growth" : "decline"} of ${(
          avgGrowth * 100
        ).toFixed(1)}%`,
        `Volatility is ${
          volatility > 0.2 ? "high" : volatility > 0.1 ? "medium" : "low"
        } indicating ${volatility > 0.2 ? "unstable" : "stable"} performance`,
        `Confidence level is based on recent ${recentTrend.length} data points`,
      ];

      const recommendations = [
        avgGrowth > 0
          ? "Maintain current strategies to sustain growth"
          : "Review and adjust current strategies",
        volatility > 0.2
          ? "Implement risk management measures"
          : "Consider scaling current operations",
        "Monitor key performance indicators more frequently",
      ];

      return {
        direction:
          avgGrowth > 0.02 ? "up" : avgGrowth < -0.02 ? "down" : "stable",
        confidence: Math.min(Math.max(Math.abs(avgGrowth) * 100, 60), 95),
        predictedValue,
        timeframe: "7 days",
        volatility:
          volatility > 0.2 ? "high" : volatility > 0.1 ? "medium" : "low",
        insights,
        recommendations,
      };
    },
    []
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent, metricId: string) => {
      setDraggedItem(metricId);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", metricId);

      const target = e.target as HTMLElement;
      target.style.opacity = "0.6";
      target.style.transform = "scale(0.95) rotate(2deg)";
    },
    []
  );

  const handleDragEnd = useCallback(
    () => {
      const elementId = draggedItem;

      if (elementId) {
        const draggedElement = document.querySelector(
          `[data-metric-id="${elementId}"]`
        ) as HTMLElement;
        if (draggedElement) {
          draggedElement.style.opacity = "1";
          draggedElement.style.transform = "scale(1) rotate(0deg)";
        }
      }

      setDraggedItem(null);
      setDragOverItem(null);
    },
    [draggedItem]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, targetId?: string) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (targetId && targetId !== draggedItem) {
        setDragOverItem(targetId);
      }
    },
    [draggedItem]
  );

  const handleDragLeave = useCallback(() => {
    setDragOverItem(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetId?: string) => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData("text/plain");

      if (!draggedId || !targetId || draggedId === targetId) {
        return;
      }

      setMetrics((prevMetrics) => {
        const newMetrics = [...prevMetrics];
        const draggedIndex = newMetrics.findIndex((m) => m.id === draggedId);
        const targetIndex = newMetrics.findIndex((m) => m.id === targetId);

        if (draggedIndex !== -1 && targetIndex !== -1) {
          [newMetrics[draggedIndex], newMetrics[targetIndex]] = [
            newMetrics[targetIndex],
            newMetrics[draggedIndex],
          ];

          newMetrics.forEach((metric, index) => {
            metric.priority = index + 1;
          });
        }

        return newMetrics;
      });

      addToast("Metrics reordered successfully", "success");
    },
    [addToast, setMetrics]
  );

  const filteredMetrics = useMemo(() => {
    return metrics
      .filter((metric) => {
        const matchesSearch =
          metric.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          metric.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          filterCategory === "all" || metric.category === filterCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => a.priority - b.priority);
  }, [metrics, searchQuery, filterCategory]);

  const predictiveInsights = useMemo(() => {
    return filteredMetrics.slice(0, 6).map((metric) => {
      const prediction = calculateTrendPrediction(metric.trend);
      const projectedGrowth =
        ((prediction.predictedValue - metric.value) / metric.value) * 100;

      return {
        id: metric.id,
        metric,
        prediction,
        projectedGrowth,
      };
    });
  }, [filteredMetrics, calculateTrendPrediction]);

  const AnimatedGauge: React.FC<{
    value: number;
    target: number;
    color: string;
    size?: number;
    showPercentage?: boolean;
    showTarget?: boolean;
    variant?: "circle" | "arc" | "bar";
    animate?: boolean;
  }> = ({
    value,
    target,
    color,
    size = 120,
    showPercentage = true,
    showTarget = false,
    variant = "circle",
    animate = true,
  }) => {
    const [animatedValue, setAnimatedValue] = useState(0);
    const percentage = Math.min((value / target) * 100, 100);

    useEffect(() => {
      if (!animate) {
        setAnimatedValue(percentage);
        return;
      }

      const timer = setTimeout(() => {
        setAnimatedValue(percentage);
      }, 200 + Math.random() * 500);
      return () => clearTimeout(timer);
    }, [percentage, animationPhase, animate]);

    if (variant === "bar") {
      return (
        <div className="w-full">
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(animatedValue)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${animatedValue}%`,
                backgroundColor: color,
                transform: `translateX(-${100 - animatedValue}%)`,
              }}
            />
          </div>
          {showTarget && (
            <div className="text-xs text-gray-500 mt-1">
              Target: {target.toLocaleString()}
            </div>
          )}
        </div>
      );
    }

    const radius = (size - 20) / 2;
    const circumference =
      variant === "arc" ? Math.PI * radius : 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset =
      circumference - (animatedValue / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className={`transform transition-all duration-1000 ease-out ${
            variant === "arc" ? "-rotate-90" : "-rotate-90"
          }`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="8"
            strokeDasharray={
              variant === "arc"
                ? `${Math.PI * radius} ${Math.PI * radius}`
                : "none"
            }
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
            }}
          />
        </svg>
        {showPercentage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-gray-800 transition-all duration-500">
              {Math.round(animatedValue)}%
            </span>
            {showTarget && (
              <span className="text-xs text-gray-500">
                of {target.toLocaleString()}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  const EnhancedTrendIndicator: React.FC<{
    metric: MetricData;
    showPrediction?: boolean;
  }> = ({ metric, showPrediction = true }) => {
    const prediction = calculateTrendPrediction(metric.trend);
    const currentValue = metric.trend[metric.trend.length - 1];
    const changePercent =
      metric.trend.length > 1
        ? ((currentValue - metric.trend[metric.trend.length - 2]) /
            metric.trend[metric.trend.length - 2]) *
          100
        : 0;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
              changePercent > 0
                ? "bg-green-100 text-green-800"
                : changePercent < 0
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {changePercent > 0 ? (
              <ArrowUp className="h-4 w-4" />
            ) : changePercent < 0 ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <Activity className="h-4 w-4" />
            )}
            <span>{Math.abs(changePercent).toFixed(1)}%</span>
          </div>
          <span className="text-xs text-gray-500">{metric.lastUpdated}</span>
        </div>

        <div className="flex items-end space-x-1 h-8">
          {metric.trend.map((value, index) => {
            const height = (value / Math.max(...metric.trend)) * 32;
            const isLatest = index === metric.trend.length - 1;
            const isPrevious = index === metric.trend.length - 2;

            return (
              <div
                key={index}
                className="flex-1 rounded-t transition-all duration-500 hover:opacity-80 cursor-pointer"
                style={{
                  height: `${height}px`,
                  backgroundColor: isLatest
                    ? metric.color
                    : isPrevious
                    ? `${metric.color}80`
                    : "#E5E7EB",
                  minWidth: "4px",
                  transform: isLatest ? "scale(1.1)" : "scale(1)",
                  filter: isLatest
                    ? "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                    : "none",
                }}
              />
            );
          })}
        </div>

        {showPrediction && (
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-3 border border-gray-100 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">
                Prediction ({prediction.timeframe})
              </span>
              <div className="flex items-center space-x-2">
                <div
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    prediction.direction === "up"
                      ? "bg-green-100 text-green-700"
                      : prediction.direction === "down"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {prediction.confidence.toFixed(0)}% confidence
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs ${
                    prediction.volatility === "high"
                      ? "bg-red-100 text-red-600"
                      : prediction.volatility === "medium"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {prediction.volatility} volatility
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {prediction.direction === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : prediction.direction === "down" ? (
                <TrendingDown className="h-4 w-4 text-red-600" />
              ) : (
                <Activity className="h-4 w-4 text-blue-600" />
              )}
              <span className="text-sm font-medium text-gray-800">
                {metric.prefix}
                {prediction.predictedValue.toLocaleString()}
                {metric.unit}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const StatusIndicator: React.FC<{ status: MetricData["status"] }> = ({
    status,
  }) => {
    const statusConfig = {
      excellent: {
        color: "text-green-600",
        bg: "bg-green-100",
        label: "Excellent",
        icon: Award,
      },
      good: {
        color: "text-blue-600",
        bg: "bg-blue-100",
        label: "Good",
        icon: CheckCircle,
      },
      warning: {
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        label: "Warning",
        icon: AlertTriangle,
      },
      critical: {
        color: "text-red-600",
        bg: "bg-red-100",
        label: "Critical",
        icon: Activity,
      },
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <div
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 ${config.bg} ${config.color}`}
      >
        <IconComponent className={`w-3 h-3 mr-1 ${config.color}`} />
        {config.label}
      </div>
    );
  };

  const ToastContainer: React.FC = () => {
    return (
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => {
          const bgColor = {
            success: "bg-gradient-to-r from-green-500 to-green-600",
            error: "bg-gradient-to-r from-red-500 to-red-600",
            warning: "bg-gradient-to-r from-yellow-500 to-yellow-600",
            info: "bg-gradient-to-r from-blue-500 to-blue-600",
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`${bgColor} text-white px-4 py-3 rounded-xl shadow-lg flex items-center space-x-3 animate-in slide-in-from-right duration-300 min-w-[300px]`}
            >
              <div className="flex-1 text-sm font-medium">{toast.message}</div>
              <button
                onClick={() =>
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                }
                className="text-white hover:text-gray-200 cursor-pointer transition-colors rounded-full hover:bg-white/20 flex items-center justify-center min-w-[44px] min-h-[44px]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  const SideDrawer: React.FC = () => {
    if (!sideDrawerOpen || !selectedInsight) return null;

    return (
      <>
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out animate-in fade-in"
          onClick={() => setSideDrawerOpen(false)}
        />

        <div className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 transform transition-all duration-300 ease-in-out overflow-y-auto animate-in slide-in-from-right">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100">
              <div className="flex items-center space-x-3">
                <div
                  className="p-3 rounded-xl shadow-lg transition-transform duration-300 hover:scale-110"
                  style={{ backgroundColor: selectedInsight.metric.bgColor }}
                >
                  <selectedInsight.metric.icon
                    className="h-6 w-6"
                    style={{ color: selectedInsight.metric.color }}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedInsight.metric.title}
                  </h2>
                  <p className="text-sm text-gray-600 font-medium">
                    Predictive Analysis
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSideDrawerOpen(false)}
                className="p-2 rounded-xl hover:bg-white/80 transition-all duration-300 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close quick actions"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Current Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">
                    Current Value:
                  </span>
                  <span className="font-bold text-gray-900">
                    {selectedInsight.metric.prefix}
                    {selectedInsight.metric.value.toLocaleString()}
                    {selectedInsight.metric.unit}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">
                    Target:
                  </span>
                  <span className="font-bold text-gray-900">
                    {selectedInsight.metric.prefix}
                    {selectedInsight.metric.target.toLocaleString()}
                    {selectedInsight.metric.unit}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">
                    Progress:
                  </span>
                  <span className="font-bold text-gray-900">
                    {(
                      (selectedInsight.metric.value /
                        selectedInsight.metric.target) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-green-600" />
                Prediction Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                  <div className="flex items-center space-x-2">
                    {selectedInsight.prediction.direction === "up" ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : selectedInsight.prediction.direction === "down" ? (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    ) : (
                      <Activity className="h-5 w-5 text-blue-600" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      Predicted Value
                    </span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {selectedInsight.metric.prefix}
                    {selectedInsight.prediction.predictedValue.toLocaleString()}
                    {selectedInsight.metric.unit}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">
                    Growth
                  </span>
                  <span
                    className={`font-bold ${
                      selectedInsight.projectedGrowth > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedInsight.projectedGrowth > 0 ? "+" : ""}
                    {selectedInsight.projectedGrowth.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">
                    Confidence
                  </span>
                  <span className="font-bold text-gray-900">
                    {selectedInsight.prediction.confidence.toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">
                    Volatility
                  </span>
                  <span
                    className={`font-bold capitalize ${
                      selectedInsight.prediction.volatility === "high"
                        ? "text-red-600"
                        : selectedInsight.prediction.volatility === "medium"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {selectedInsight.prediction.volatility}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-purple-600" />
                Key Insights
              </h3>
              <div className="space-y-3">
                {selectedInsight.prediction.insights.map((insight, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-white/50 rounded-xl"
                  >
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700 font-medium">
                      {insight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-amber-600" />
                Recommendations
              </h3>
              <div className="space-y-3">
                {selectedInsight.prediction.recommendations.map(
                  (recommendation, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-white/50 rounded-xl"
                    >
                      <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-medium">
                        {recommendation}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setSideDrawerOpen(false);
                  addToast(
                    `Setting up monitoring for ${selectedInsight.metric.title}`,
                    "info"
                  );
                }}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-4 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-0.5 min-h-[44px]"
                aria-label="Set up monitoring for this metric"
              >
                Set Up Monitoring
              </button>
              <button
                onClick={() => {
                  setSideDrawerOpen(false);
                  addToast("Detailed report generated", "success");
                }}
                className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-0.5 min-h-[44px]"
                aria-label="Generate detailed report"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Toast Container */}
      <ToastContainer />

      {/* Side Drawer */}
      <SideDrawer />

      {/* Loading   */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 shadow-2xl flex items-center space-x-4 border">
            <RefreshCw className="h-6 w-6 text-indigo-600 animate-spin" />
            <span className="text-gray-800 font-medium">
              Updating dashboard...
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 border-b border-emerald-200 shadow-xl">
        <div className="px-3 py-2 sm:px-4 sm:py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-2">
            <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white">
                    Business Intelligence
                  </h1>
                  <p className="text-xs sm:text-sm text-emerald-100">
                    Real-time analytics
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1 sm:hidden">
                <div
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                    autoRefresh ? "bg-emerald-400 animate-pulse" : "bg-gray-400"
                  }`}
                />
                <span className="text-white font-medium">
                  {autoRefresh ? "Live" : "Paused"}
                </span>
              </div>
            </div>
            <div className="hidden sm:flex items-center justify-end space-x-2 sm:space-x-3">
              <div className="flex items-center space-x-1 sm:space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1">
                <div
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                    autoRefresh ? "bg-emerald-400 animate-pulse" : "bg-gray-400"
                  }`}
                />
                <span className="text-white font-medium">
                  {autoRefresh ? "Live" : "Paused"}
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                <Clock className="h-4 w-4 text-white" />
                <span
                  suppressHydrationWarning
                  className="text-white font-medium"
                >
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 min-w-[120px]">
              <CalendarIcon className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-100" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setIsLoading(true);
                  setTimeout(() => {
                    const updatedMetrics = baseMetricsData.map((metric) => {
                      const historicalData = metric.historicalData["7d"];
                      return {
                        ...metric,
                        value: historicalData.value,
                        target: historicalData.target,
                        trend: historicalData.trend,
                        lastUpdated: `Updated for ${new Date(
                          e.target.value
                        ).toLocaleDateString()}`,
                      };
                    });
                    setMetrics(updatedMetrics);
                    setAnimationPhase((prev) => prev + 1);
                    setIsLoading(false);
                    addToast(
                      `Data updated for ${new Date(
                        e.target.value
                      ).toLocaleDateString()}`,
                      "success"
                    );
                  }, 1000);
                }}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-xs sm:text-sm bg-white/10 backdrop-blur-sm min-h-[44px] shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer text-white placeholder-emerald-200"
              />
            </div>
            <div className="relative flex-1 min-w-[100px]">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-100" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-xs sm:text-sm bg-white/10 backdrop-blur-sm min-h-[44px] transition-all duration-200 hover:shadow-md text-white placeholder-emerald-200"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-[120px] sm:w-auto px-2 sm:px-3 py-1.5 sm:py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-xs sm:text-sm bg-white/10 backdrop-blur-sm min-h-[44px] transition-all duration-200 hover:shadow-md cursor-pointer text-white"
            >
              <option value="all" className="text-gray-900">
                All
              </option>
              <option value="revenue" className="text-gray-900">
                Revenue
              </option>
              <option value="users" className="text-gray-900">
                Users
              </option>
              <option value="performance" className="text-gray-900">
                Performance
              </option>
              <option value="growth" className="text-gray-900">
                Growth
              </option>
              <option value="marketing" className="text-gray-900">
                Marketing
              </option>
              <option value="operations" className="text-gray-900">
                Operations
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Key Performance Indicators
            </h2>
            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
              Click cards for quick actions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMetrics.map((metric) => {
              const IconComponent = metric.icon;
              const prediction = calculateTrendPrediction(metric.trend);
              const quickActions = getMetricQuickActions(metric);

              return (
                <div key={metric.id} className="relative">
                  <div
                    data-metric-id={metric.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, metric.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, metric.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, metric.id)}
                    className={`bg-white rounded-2xl p-6 shadow-xl border border-gray-100 cursor-move transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                      draggedItem === metric.id
                        ? "opacity-60 scale-95 rotate-2 z-50"
                        : dragOverItem === metric.id
                        ? "ring-2 ring-indigo-500 shadow-2xl scale-105 bg-indigo-50"
                        : ""
                    }`}
                    style={{ minHeight: "400px" }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className="p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-110"
                          style={{ backgroundColor: metric.bgColor }}
                        >
                          <IconComponent
                            className="h-6 w-6 transition-all duration-300"
                            style={{ color: metric.color }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">
                            {metric.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {metric.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-2">
                          <Grip className="h-5 w-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveQuickActions(
                                activeQuickActions === metric.id
                                  ? null
                                  : metric.id
                              );
                            }}
                            className="p-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transition-all duration-200 cursor-pointer hover:scale-105 shadow-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label="Quick actions"
                          >
                            <MoreVertical className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                        <StatusIndicator status={metric.status} />
                      </div>
                    </div>

                    <div className="text-center mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                      <div className="text-3xl font-bold text-gray-900 mb-1 transition-all duration-500">
                        {metric.prefix}
                        {metric.value.toLocaleString()}
                        {metric.unit}
                      </div>
                      <div className="text-sm text-gray-500">
                        Target: {metric.prefix}
                        {metric.target.toLocaleString()}
                        {metric.unit}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 font-medium">
                        {((metric.value / metric.target) * 100).toFixed(1)}% of
                        target
                      </div>
                    </div>

                    <div className="flex items-center justify-center space-x-6 mb-6">
                      <AnimatedGauge
                        value={metric.value}
                        target={metric.target}
                        color={metric.color}
                        size={100}
                        variant="circle"
                        animate={true}
                      />
                    </div>

                    <EnhancedTrendIndicator
                      metric={metric}
                      showPrediction={true}
                    />
                  </div>

                  {activeQuickActions === metric.id && (
                    <div className="absolute top-16 right-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-30 overflow-hidden animate-in slide-in-from-top duration-200">
                      <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Quick Actions
                            </h3>
                            <p className="text-sm text-gray-600">
                              {metric.title}
                            </p>
                          </div>
                          <button
                            onClick={() => setActiveQuickActions(null)}
                            className="p-1 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label="Close quick actions"
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {quickActions.map((action) => {
                          const ActionIcon = action.icon;
                          return (
                            <button
                              key={action.id}
                              onClick={() => {
                                action.action();
                                setActiveQuickActions(null);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 flex items-center space-x-3 text-sm text-gray-700 min-h-[56px] transition-all duration-200 hover:scale-102 cursor-pointer border-b border-gray-100 last:border-b-0"
                              aria-label={`${action.label} - ${action.description}`}
                            >
                              <div className="p-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg transition-colors duration-200 group-hover:from-indigo-100 group-hover:to-purple-100">
                                <ActionIcon className="h-4 w-4 text-gray-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">
                                  {action.label}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {action.description}
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Performance Overview
            </h2>
            <PieChart className="h-6 w-6 text-indigo-400" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                title: "Excellent",
                count: filteredMetrics.filter((m) => m.status === "excellent")
                  .length,
                color: "text-green-600",
                bg: "bg-gradient-to-br from-green-50 to-emerald-50",
                border: "border-green-200",
                icon: Award,
              },
              {
                title: "Good",
                count: filteredMetrics.filter((m) => m.status === "good")
                  .length,
                color: "text-blue-600",
                bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
                border: "border-blue-200",
                icon: CheckCircle,
              },
              {
                title: "Warning",
                count: filteredMetrics.filter((m) => m.status === "warning")
                  .length,
                color: "text-yellow-600",
                bg: "bg-gradient-to-br from-yellow-50 to-orange-50",
                border: "border-yellow-200",
                icon: AlertTriangle,
              },
              {
                title: "Critical",
                count: filteredMetrics.filter((m) => m.status === "critical")
                  .length,
                color: "text-red-600",
                bg: "bg-gradient-to-br from-red-50 to-pink-50",
                border: "border-red-200",
                icon: Activity,
              },
            ].map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={stat.title}
                  className={`text-center p-4 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer ${stat.bg} ${stat.border}`}
                >
                  <IconComponent
                    className={`h-8 w-8 mx-auto mb-2 ${stat.color}`}
                  />
                  <div
                    className={`text-2xl font-bold ${stat.color} transition-all duration-300`}
                  >
                    {stat.count}
                  </div>
                  <div className={`text-sm font-medium ${stat.color}`}>
                    {stat.title}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "revenue",
              "users",
              "performance",
              "growth",
              "marketing",
              "operations",
            ].map((category) => {
              const categoryMetrics = filteredMetrics.filter(
                (m) => m.category === category
              );
              const avgPerformance =
                categoryMetrics.length > 0
                  ? (categoryMetrics.reduce(
                      (acc, m) => acc + m.value / m.target,
                      0
                    ) /
                      categoryMetrics.length) *
                    100
                  : 0;

              return (
                <div
                  key={category}
                  className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-3 transition-all duration-300 hover:shadow-md cursor-pointer border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {category}
                    </span>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                      {categoryMetrics.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                    <div
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.min(avgPerformance, 100)}%`,
                        background:
                          avgPerformance > 90
                            ? "linear-gradient(to right, #10B981, #059669)"
                            : avgPerformance > 70
                            ? "linear-gradient(to right, #3B82F6, #1D4ED8)"
                            : avgPerformance > 50
                            ? "linear-gradient(to right, #F59E0B, #D97706)"
                            : "linear-gradient(to right, #EF4444, #DC2626)",
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    {avgPerformance.toFixed(0)}% avg performance
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Predictive Insights
            </h2>
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-indigo-400" />
              <span className="text-sm text-gray-500">Click for details</span>
            </div>
          </div>

          <div className="space-y-4">
            {predictiveInsights.map((insight) => (
              <div
                key={insight.id}
                onClick={() => {
                  setSelectedInsight(insight);
                  setSideDrawerOpen(true);
                }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-lg cursor-pointer hover:scale-102"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-4 h-4 rounded-full transition-all duration-300 hover:scale-125 shadow-sm"
                    style={{ backgroundColor: insight.metric.color }}
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {insight.metric.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      Projected: {insight.metric.prefix}
                      {insight.prediction.predictedValue.toLocaleString()}
                      {insight.metric.unit}
                    </div>
                    <div className="text-xs text-gray-500">
                      Volatility: {insight.prediction.volatility}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`flex items-center space-x-2 text-sm font-medium transition-all duration-300 ${
                      insight.projectedGrowth > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {insight.prediction.direction === "up" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : insight.prediction.direction === "down" ? (
                      <TrendingDown className="h-4 w-4" />
                    ) : (
                      <Activity className="h-4 w-4" />
                    )}
                    <span>
                      {insight.projectedGrowth > 0 ? "+" : ""}
                      {insight.projectedGrowth.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {insight.prediction.confidence.toFixed(0)}% confidence
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-indigo-200 transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Smart Recommendations
            </h2>
            <Target className="h-6 w-6 text-indigo-600" />
          </div>

          <div className="space-y-3">
            {filteredMetrics
              .filter((m) => m.value / m.target < 0.9)
              .slice(0, 4)
              .map((metric) => {
                const gap =
                  ((metric.target - metric.value) / metric.value) * 100;
                return (
                  <div
                    key={metric.id}
                    className="flex items-start space-x-3 p-4 bg-white rounded-xl shadow-sm border border-white/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div
                      className={`p-2 rounded-lg ${metric.bgColor} transition-all duration-300 hover:scale-110 shadow-sm`}
                    >
                      <AlertTriangle
                        className="h-5 w-5"
                        style={{ color: metric.color }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        Optimize {metric.title}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Currently at{" "}
                        {((metric.value / metric.target) * 100).toFixed(0)}% of
                        target. Need {gap.toFixed(1)}% improvement to reach{" "}
                        {metric.prefix}
                        {metric.target.toLocaleString()}
                        {metric.unit}.
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <button
                          onClick={() =>
                            addToast(
                              `Viewing optimization strategies for ${metric.title}`,
                              "info"
                            )
                          }
                          className="text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 cursor-pointer hover:scale-105 shadow-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
                          aria-label={`View optimization strategies for ${metric.title}`}
                        >
                          View Strategies
                        </button>
                        <button
                          onClick={() =>
                            addToast(`Alert set for ${metric.title}`, "success")
                          }
                          className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 px-3 py-1 rounded-full hover:from-gray-200 hover:to-gray-300 transition-all duration-200 cursor-pointer hover:scale-105 shadow-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
                          aria-label={`Set alert for ${metric.title}`}
                        >
                          Set Alert
                        </button>
                        <button
                          onClick={() =>
                            addToast(
                              `Quick fix applied to ${metric.title}`,
                              "success"
                            )
                          }
                          className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-600 px-3 py-1 rounded-full hover:from-green-200 hover:to-emerald-200 transition-all duration-200 cursor-pointer hover:scale-105 shadow-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
                          aria-label={`Apply quick fix to ${metric.title}`}
                        >
                          Quick Fix
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="h-24" />

      {draggedItem && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30 pointer-events-none transition-all duration-300" />
      )}

      {activeQuickActions && (
        <div
          className="fixed inset-0 z-20 cursor-pointer"
          onClick={() => setActiveQuickActions(null)}
        />
      )}
    </div>
  );
};

export default BIMobileDashboard;
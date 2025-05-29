"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
  useRef,
} from "react";
import {
  ChartBarIcon,
  BellIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  DocumentTextIcon,
  ChartPieIcon,
  CurrencyDollarIcon,
  AdjustmentsHorizontalIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

// Types
interface User {
  email: string;
  isAuthenticated: boolean;
}

interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface NewsItem {
  id: string;
  title: string;
  content: string;
  sentiment: "positive" | "negative" | "neutral";
  score: number;
  source: string;
  timestamp: string;
}

interface RiskMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  status: "good" | "warning" | "danger";
  description: string;
}

interface Portfolio {
  id: string;
  name: string;
  value: number;
  change: number;
  allocation: { [key: string]: number };
}

interface Alert {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  timestamp: string;
  read: boolean;
}

// Mock data generators
const generateStockData = (): StockData[] => {
  const data: StockData[] = [];
  let basePrice = 150;

  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const open = basePrice + (Math.random() - 0.5) * 10;
    const close = open + (Math.random() - 0.5) * 8;
    const high = Math.max(open, close) + Math.random() * 5;
    const low = Math.min(open, close) - Math.random() * 5;

    data.push({
      date: date.toISOString().split("T")[0],
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.floor(Math.random() * 1000000) + 500000,
    });

    basePrice = close;
  }

  return data;
};

const generateNewsData = (): NewsItem[] => {
  const words = [
    "Growth",
    "Innovation",
    "Market",
    "Technology",
    "Profit",
    "Revenue",
    "Expansion",
    "Investment",
    "Risk",
    "Opportunity",
  ];
  const sources = [
    "Reuters",
    "Bloomberg",
    "CNBC",
    "MarketWatch",
    "Financial Times",
  ];
  const contents = [
    "Market analysts are optimistic about the upcoming quarter with strong earnings expected across multiple sectors.",
    "Technology stocks continue to show resilience despite market volatility and regulatory concerns.",
    "Investment flows into emerging markets have increased significantly this month.",
    "Risk assessment models suggest a cautious approach to portfolio allocation in current conditions.",
    "Revenue growth in the financial sector exceeds expectations for the third consecutive quarter.",
  ];

  return Array.from({ length: 50 }, (_, i) => ({
    id: `news-${i}`,
    title: `${words[Math.floor(Math.random() * words.length)]} ${
      words[Math.floor(Math.random() * words.length)]
    } Report`,
    content: contents[Math.floor(Math.random() * contents.length)],
    sentiment: ["positive", "negative", "neutral"][
      Math.floor(Math.random() * 3)
    ] as "positive" | "negative" | "neutral",
    score: Math.random(),
    source: sources[Math.floor(Math.random() * sources.length)],
    timestamp: new Date(
      Date.now() - Math.random() * 86400000 * 7
    ).toISOString(),
  }));
};

const generateRiskMetrics = (): RiskMetric[] => [
  {
    id: "var",
    name: "Value at Risk",
    value: 2.35,
    change: -0.12,
    status: "good",
    description:
      "Maximum potential loss over a given time period at a specified confidence level",
  },
  {
    id: "sharpe",
    name: "Sharpe Ratio",
    value: 1.42,
    change: 0.08,
    status: "good",
    description:
      "Risk-adjusted return measure comparing excess return to volatility",
  },
  {
    id: "beta",
    name: "Portfolio Beta",
    value: 1.15,
    change: 0.03,
    status: "warning",
    description: "Measure of portfolio sensitivity to market movements",
  },
  {
    id: "volatility",
    name: "Volatility",
    value: 18.5,
    change: 2.1,
    status: "danger",
    description:
      "Standard deviation of returns indicating price fluctuation magnitude",
  },
];

const generatePortfolios = (): Portfolio[] => [
  {
    id: "growth",
    name: "Growth Portfolio",
    value: 125000,
    change: 5.2,
    allocation: { Stocks: 70, Bonds: 20, Cash: 10 },
  },
  {
    id: "conservative",
    name: "Conservative Portfolio",
    value: 85000,
    change: 2.1,
    allocation: { Stocks: 40, Bonds: 50, Cash: 10 },
  },
  {
    id: "aggressive",
    name: "Aggressive Portfolio",
    value: 95000,
    change: -1.5,
    allocation: { Stocks: 85, Bonds: 10, Cash: 5 },
  },
];

const generateAlerts = (): Alert[] => [
  {
    id: "alert-1",
    title: "Portfolio Rebalancing",
    message:
      "Your Growth Portfolio allocation has drifted beyond target ranges",
    type: "warning",
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: "alert-2",
    title: "Market Update",
    message: "Significant market movement detected in your watchlist",
    type: "info",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
  },
  {
    id: "alert-3",
    title: "Risk Threshold",
    message: "Portfolio volatility has exceeded your risk tolerance",
    type: "error",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: true,
  },
];

// Smooth scroll utility
const scrollToSection = (sectionId: string, offset = 80) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

// Authentication Guard Component
const AuthGuard = memo(
  ({
    children,
    isAuthenticated,
    onLoginRequired,
  }: {
    children: React.ReactNode;
    isAuthenticated: boolean;
    onLoginRequired: () => void;
  }) => {
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <LockClosedIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-8">
              Please log in to access your portfolio dashboard and analytics
              tools.
            </p>
            <button
              onClick={onLoginRequired}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Sign In to Continue
            </button>
          </div>
        </div>
      );
    }

    return <>{children}</>;
  }
);

// Memoized Components
const CandlestickChart = memo(
  ({
    data,
    width,
    height,
  }: {
    data: StockData[];
    width: number;
    height: number;
  }) => {
    const [selectedRange, setSelectedRange] = useState<[number, number]>([
      0,
      data.length - 1,
    ]);
    const [tooltip, setTooltip] = useState<{
      x: number;
      y: number;
      data: StockData | null;
    }>({ x: 0, y: 0, data: null });
    const [chartType, setChartType] = useState<"candlestick" | "line">(
      "candlestick"
    );

    const visibleData = useMemo(() => {
      return data.slice(selectedRange[0], selectedRange[1] + 1);
    }, [data, selectedRange]);

    const { minPrice, maxPrice, priceRange } = useMemo(() => {
      const prices = visibleData.flatMap((d) => [d.high, d.low]);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      return { minPrice: min, maxPrice: max, priceRange: max - min };
    }, [visibleData]);

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<SVGElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const dataIndex = Math.floor((x / width) * visibleData.length);

        if (dataIndex >= 0 && dataIndex < visibleData.length) {
          setTooltip({
            x: e.clientX,
            y: e.clientY,
            data: visibleData[dataIndex],
          });
        }
      },
      [width, visibleData]
    );

    const handleMouseLeave = useCallback(() => {
      setTooltip({ x: 0, y: 0, data: null });
    }, []);

    const exportChart = useCallback(() => {
      const csvContent =
        "data:text/csv;charset=utf-8," +
        "Date,Open,High,Low,Close,Volume\n" +
        visibleData
          .map(
            (row) =>
              `${row.date},${row.open},${row.high},${row.low},${row.close},${row.volume}`
          )
          .join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "chart_data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, [visibleData]);

    return (
      <div className="relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setChartType("candlestick")}
              className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 shadow-sm ${
                chartType === "candlestick"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Candlestick
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 shadow-sm ${
                chartType === "line"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Line
            </button>
            <button
              onClick={exportChart}
              className="flex md:hidden items-center space-x-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-800 cursor-pointer transition-all duration-300 shadow-md"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
          <button
            onClick={exportChart}
            className="hidden md:flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-800 cursor-pointer transition-all duration-300 shadow-md"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <svg
            width={width}
            height={height}
            className="border border-gray-200 rounded-lg bg-white cursor-crosshair min-w-full shadow-sm"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Grid lines */}
            {Array.from({ length: 5 }, (_, i) => (
              <line
                key={i}
                x1={0}
                y1={(height / 4) * i}
                x2={width}
                y2={(height / 4) * i}
                stroke="#e5e7eb"
                strokeWidth={1}
              />
            ))}

            {chartType === "candlestick" ? (
              /* Candlesticks */
              visibleData.map((item, index) => {
                const x =
                  (index / visibleData.length) * width +
                  width / visibleData.length / 2;
                const candleWidth = Math.max(
                  2,
                  (width / visibleData.length) * 0.6
                );

                const openY =
                  height - ((item.open - minPrice) / priceRange) * height;
                const closeY =
                  height - ((item.close - minPrice) / priceRange) * height;
                const highY =
                  height - ((item.high - minPrice) / priceRange) * height;
                const lowY =
                  height - ((item.low - minPrice) / priceRange) * height;

                const isGreen = item.close > item.open;
                const color = isGreen ? "#10b981" : "#ef4444";

                return (
                  <g key={index}>
                    {/* High-Low line */}
                    <line
                      x1={x}
                      y1={highY}
                      x2={x}
                      y2={lowY}
                      stroke={color}
                      strokeWidth={1}
                    />
                    {/* Open-Close rectangle */}
                    <rect
                      x={x - candleWidth / 2}
                      y={Math.min(openY, closeY)}
                      width={candleWidth}
                      height={Math.abs(closeY - openY) || 1}
                      fill={isGreen ? color : "#ffffff"}
                      stroke={color}
                      strokeWidth={1}
                    />
                  </g>
                );
              })
            ) : (
              /* Line Chart */
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth={2}
                points={visibleData
                  .map((item, index) => {
                    const x =
                      (index / visibleData.length) * width +
                      width / visibleData.length / 2;
                    const y =
                      height - ((item.close - minPrice) / priceRange) * height;
                    return `${x},${y}`;
                  })
                  .join(" ")}
              />
            )}
          </svg>
        </div>

        {/* Brush selector */}
        <div className="mt-4">
          <input
            type="range"
            min={0}
            max={data.length - 1}
            value={selectedRange[0]}
            onChange={(e) =>
              setSelectedRange([parseInt(e.target.value), selectedRange[1]])
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{data[selectedRange[0]]?.date}</span>
            <span>{data[selectedRange[1]]?.date}</span>
          </div>
        </div>

        {/* Tooltip */}
        {tooltip.data && (
          <div
            className="fixed z-50 bg-black text-white p-2 rounded shadow-lg text-xs pointer-events-none"
            style={{ left: tooltip.x + 10, top: tooltip.y - 10 }}
          >
            <div>Date: {tooltip.data.date}</div>
            <div>Open: ${tooltip.data.open}</div>
            <div>High: ${tooltip.data.high}</div>
            <div>Low: ${tooltip.data.low}</div>
            <div>Close: ${tooltip.data.close}</div>
            <div>Volume: {tooltip.data.volume.toLocaleString()}</div>
          </div>
        )}
      </div>
    );
  }
);

const WordCloud = memo(
  ({
    news,
    onNewsClick,
  }: {
    news: NewsItem[];
    onNewsClick: (news: NewsItem) => void;
  }) => {
    const [filter, setFilter] = useState<
      "all" | "positive" | "negative" | "neutral"
    >("all");

    const filteredNews = useMemo(() => {
      return filter === "all"
        ? news
        : news.filter((item) => item.sentiment === filter);
    }, [news, filter]);

    const wordFreq = useMemo(() => {
      const freq: Record<
        string,
        {
          count: number;
          sentiment: "positive" | "negative" | "neutral";
          news: NewsItem[];
        }
      > = {};

      filteredNews.forEach((item) => {
        const words = item.title.split(" ");
        words.forEach((word) => {
          if (word.length > 3) {
            if (freq[word]) {
              freq[word].count++;
              freq[word].news.push(item);
            } else {
              freq[word] = {
                count: 1,
                sentiment: item.sentiment,
                news: [item],
              };
            }
          }
        });
      });

      return Object.entries(freq)
        .sort(([, a], [, b]) => b.count - a.count)
        .slice(0, 20);
    }, [filteredNews]);

    return (
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex flex-wrap gap-3">
            {(["all", "positive", "negative", "neutral"] as const).map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all duration-300 capitalize shadow-sm ${
                    filter === type
                      ? type === "positive"
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200"
                        : type === "negative"
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200"
                        : type === "neutral"
                        ? "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-gray-200"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200"
                      : "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 hover:border-gray-400 hover:text-gray-900"
                  }`}
                >
                  {type}
                  {filter === type && (
                    <span className="ml-2 bg-black bg-opacity-20 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                      {filteredNews.length}
                    </span>
                  )}
                </button>
              )
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-500">Positive</span>
            <div className="h-2 w-2 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-500">Negative</span>
            <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
            <span className="text-xs text-gray-500">Neutral</span>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-slate-50 via-white to-slate-100 rounded-xl border border-gray-200 p-8 min-h-[300px] overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full opacity-50 -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-100 to-transparent rounded-full opacity-50 translate-y-12 -translate-x-12"></div>
          
          <div className="relative flex flex-wrap gap-4 items-center justify-center">
            {wordFreq.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DocumentTextIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No articles found for this filter</p>
              </div>
            ) : (
              wordFreq.map(([word, data], index) => {
                const size = Math.max(14, Math.min(36, 14 + data.count * 2.5));
                const opacity = Math.max(0.7, Math.min(1, 0.5 + data.count * 0.1));
                
                const colors = {
                  positive: "text-green-600 hover:text-green-700 shadow-green-100",
                  negative: "text-red-600 hover:text-red-700 shadow-red-100", 
                  neutral: "text-gray-600 hover:text-gray-700 shadow-gray-100",
                };

                const bgColors = {
                  positive: "hover:bg-green-50",
                  negative: "hover:bg-red-50",
                  neutral: "hover:bg-gray-50",
                };

                return (
                  <button
                    key={word}
                    onClick={() => onNewsClick(data.news[0])}
                    className={`font-bold ${colors[data.sentiment]} ${bgColors[data.sentiment]} 
                      transition-all duration-300 cursor-pointer hover:scale-110 hover:shadow-lg 
                      px-3 py-2 rounded-lg border border-transparent hover:border-gray-200
                      transform hover:-translate-y-1 active:scale-95`}
                    style={{ 
                      fontSize: `${size}px`,
                      opacity: opacity,
                      fontWeight: 600 + Math.min(300, data.count * 50),
                    }}
                    title={`${word} - ${data.count} mentions (${data.sentiment})`}
                  >
                    {word}
                    <span className="ml-1 text-xs opacity-60 font-normal">
                      {data.count > 1 ? `×${data.count}` : ''}
                    </span>
                  </button>
                );
              })
            )}
          </div>
          
          {/* Bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        </div>

        {filteredNews.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Analyzing <span className="font-semibold text-blue-600">{filteredNews.length}</span> articles • 
              Click on any word to read related news
            </p>
          </div>
        )}
      </div>
    );
  }
);

const RiskCard = memo(
  ({
    metric,
    onDetailsClick,
  }: {
    metric: RiskMetric;
    onDetailsClick: (metric: RiskMetric) => void;
  }) => {
    const statusColors = {
      good: "border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg hover:from-green-100 hover:to-green-200",
      warning: "border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-lg hover:from-yellow-100 hover:to-yellow-200",
      danger: "border-red-200 bg-gradient-to-br from-red-50 to-red-100 hover:shadow-lg hover:from-red-100 hover:to-red-200",
    };

    const statusIcons = {
      good: <CheckCircleIcon className="w-5 h-5 text-green-600" />,
      warning: <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />,
      danger: <InformationCircleIcon className="w-5 h-5 text-red-600" />,
    };

    return (
      <div
        onClick={() => onDetailsClick(metric)}
        className={`p-4 rounded-xl border shadow-md ${
          statusColors[metric.status]
        } transition-all duration-300 cursor-pointer`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {statusIcons[metric.status]}
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
              {metric.name}
            </h3>
          </div>
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              {metric.value}
            </div>
            <div
              className={`text-xs sm:text-sm flex items-center ${
                metric.change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {metric.change >= 0 ? (
                <ArrowTrendingUpIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              )}
              {Math.abs(metric.change).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

const Modal = memo(
  ({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
  }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
  }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const sizeClasses = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-2xl",
      xl: "max-w-4xl",
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          modalRef.current &&
          !modalRef.current.contains(event.target as Node)
        ) {
          onClose();
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div
          ref={modalRef}
          className={`relative bg-white rounded-2xl shadow-2xl border border-gray-100 ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100`}
        >
          <div className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="p-4 sm:p-6">{children}</div>
        </div>
      </div>
    );
  }
);

const LoginModal = memo(
  ({
    isOpen,
    onClose,
    onLogin,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (email: string, password: string) => void;
  }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>(
      {}
    );

    const validateForm = useCallback(() => {
      const newErrors: { email?: string; password?: string } = {};

      if (!email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Email is invalid";
      }

      if (!password) {
        newErrors.password = "Password is required";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }, [email, password]);

    const handleSubmit = useCallback(() => {
      if (validateForm()) {
        onLogin(email.trim(), password);
        setEmail("");
        setPassword("");
        setErrors({});
      }
    }, [email, password, onLogin, validateForm]);

    const handleClose = useCallback(() => {
      onClose();
      setEmail("");
      setPassword("");
      setErrors({});
    }, [onClose]);

    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Sign In">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter password (hint: 12345678)"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium cursor-pointer"
          >
            Sign In
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-500 text-center">
          Use any email and any password to login
        </p>
      </Modal>
    );
  }
);

const PortfolioModal = ({
  isOpen,
  onClose,
  portfolios,
  onCreatePortfolio,
  onDeletePortfolio,
}: {
  isOpen: boolean;
  onClose: () => void;
  portfolios: Portfolio[];
  onCreatePortfolio: (name: string) => void;
  onDeletePortfolio: (id: string) => void;
}) => {
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreate = useCallback(() => {
    if (newPortfolioName.trim()) {
      onCreatePortfolio(newPortfolioName.trim());
      setNewPortfolioName("");
      setShowCreateForm(false);
    }
  }, [newPortfolioName, onCreatePortfolio]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Portfolio Management"
      size="lg"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Your Portfolios
          </h3>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer transition-colors w-full sm:w-auto justify-center"
          >
            <PlusIcon className="w-4 h-4" />
            <span>New Portfolio</span>
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="text"
                value={newPortfolioName}
                onChange={(e) => setNewPortfolioName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCreate()}
                placeholder="Portfolio name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleCreate}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer transition-colors flex-1 sm:flex-none"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewPortfolioName("");
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 cursor-pointer transition-colors flex-1 sm:flex-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {portfolios.map((portfolio) => (
            <div
              key={portfolio.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                <h4 className="font-semibold text-gray-900">
                  {portfolio.name}
                </h4>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onDeletePortfolio(portfolio.id)}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  ${portfolio.value.toLocaleString()}
                </span>
                <span
                  className={`flex items-center ${
                    portfolio.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {portfolio.change >= 0 ? (
                    <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(portfolio.change).toFixed(2)}%
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 sm:gap-4 text-sm text-gray-600">
                {Object.entries(portfolio.allocation).map(
                  ([asset, percent]) => (
                    <span key={asset}>
                      {asset}: {percent.toFixed(2)}%
                    </span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

const AlertsModal = memo(
  ({
    isOpen,
    onClose,
    alerts,
    onMarkAsRead,
    onDeleteAlert,
  }: {
    isOpen: boolean;
    onClose: () => void;
    alerts: Alert[];
    onMarkAsRead: (id: string) => void;
    onDeleteAlert: (id: string) => void;
  }) => {
    const alertColors = {
      info: "border-blue-200 bg-blue-50",
      warning: "border-yellow-200 bg-yellow-50",
      success: "border-green-200 bg-green-50",
      error: "border-red-200 bg-red-50",
    };

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Notifications & Alerts"
        size="lg"
      >
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BellIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No alerts at this time</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border rounded-lg p-4 ${alertColors[alert.type]} ${
                  alert.read ? "opacity-60" : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {alert.title}
                    </h4>
                    <p className="text-gray-700 text-sm mb-2">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-auto">
                    {!alert.read && (
                      <button
                        onClick={() => onMarkAsRead(alert.id)}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer text-xs whitespace-nowrap"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteAlert(alert.id)}
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    );
  }
);

const NewsDetailsModal = memo(
  ({
    isOpen,
    onClose,
    news,
  }: {
    isOpen: boolean;
    onClose: () => void;
    news: NewsItem | null;
  }) => {
    if (!news) return null;

    const sentimentColors = {
      positive: "text-green-600 bg-green-100",
      negative: "text-red-600 bg-red-100",
      neutral: "text-gray-600 bg-gray-100",
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} title="News Article" size="lg">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                sentimentColors[news.sentiment]
              }`}
            >
              {news.sentiment.toUpperCase()}
            </span>
            <span className="text-sm text-gray-500">{news.source}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{news.title}</h3>
          <p className="text-gray-700">{news.content}</p>
          <div className="text-xs text-gray-500">
            {new Date(news.timestamp).toLocaleString()}
          </div>
        </div>
      </Modal>
    );
  }
);

const RiskDetailsModal = memo(
  ({
    isOpen,
    onClose,
    metric,
  }: {
    isOpen: boolean;
    onClose: () => void;
    metric: RiskMetric | null;
  }) => {
    if (!metric) return null;

    return (
      <Modal isOpen={isOpen} onClose={onClose} title={metric.name} size="lg">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="text-3xl font-bold text-gray-900">
              {metric.value}
            </span>
            <span
              className={`flex items-center ${
                metric.change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {metric.change >= 0 ? (
                <ArrowTrendingUpIcon className="w-5 h-5 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="w-5 h-5 mr-1" />
              )}
              {Math.abs(metric.change).toFixed(2)}
            </span>
          </div>
          <p className="text-gray-700">{metric.description}</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Risk Level</h4>
            <div
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                metric.status === "good"
                  ? "bg-green-100 text-green-800"
                  : metric.status === "warning"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {metric.status.toUpperCase()}
            </div>
          </div>
        </div>
      </Modal>
    );
  }
);

const Navbar = memo(
  ({
    user,
    onLoginClick,
    onLogout,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    onPortfolioClick,
    onAlertsClick,
    unreadAlertsCount,
  }: {
    user: User;
    onLoginClick: () => void;
    onLogout: () => void;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (open: boolean) => void;
    onPortfolioClick: () => void;
    onAlertsClick: () => void;
    unreadAlertsCount: number;
  }) => {
    const navbarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          navbarRef.current &&
          !navbarRef.current.contains(event.target as Node) &&
          isMobileMenuOpen
        ) {
          setIsMobileMenuOpen(false);
        }
      };

      if (isMobileMenuOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.body.style.overflow = "unset";
      };
    }, [isMobileMenuOpen, setIsMobileMenuOpen]);

    const handleNavClick = (sectionId: string) => {
      scrollToSection(sectionId);
      setIsMobileMenuOpen(false);
    };

    return (
      <nav ref={navbarRef} className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Portfolio<span className="text-blue-600">Analyzer</span>
                </h1>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => handleNavClick("dashboard")}
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center space-x-1"
              >
                <ChartBarIcon className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => handleNavClick("analytics")}
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center space-x-1"
              >
                <ChartPieIcon className="w-4 h-4" />
                <span>Charts</span>
              </button>
              <button
                onClick={() => handleNavClick("insights")}
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center space-x-1"
              >
                <DocumentTextIcon className="w-4 h-4" />
                <span>Analysis</span>
              </button>

              <button
                onClick={onAlertsClick}
                className="relative text-gray-600 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition-all p-2 rounded-lg"
              >
                <BellIcon className="w-5 h-5" />
                {unreadAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium shadow-lg">
                    {unreadAlertsCount}
                  </span>
                )}
              </button>

              {user.isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 hidden lg:inline">
                    {user.email.length > 20
                      ? `${user.email.substring(0, 20)}...`
                      : user.email}
                  </span>
                  <button
                    onClick={onLogout}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-md cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md cursor-pointer"
                >
                  Login
                </button>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-blue-600 cursor-pointer"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => handleNavClick("dashboard")}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-base font-medium w-full text-left transition-all cursor-pointer"
              >
                <ChartBarIcon className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => handleNavClick("analytics")}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-base font-medium w-full text-left transition-all cursor-pointer"
              >
                <ChartPieIcon className="w-4 h-4" />
                <span>Charts</span>
              </button>
              <button
                onClick={() => handleNavClick("insights")}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-base font-medium w-full text-left transition-all cursor-pointer"
              >
                <DocumentTextIcon className="w-4 h-4" />
                <span>Analysis</span>
              </button>
              <button
                onClick={() => {
                  onAlertsClick();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-base font-medium w-full text-left transition-all cursor-pointer"
              >
                <BellIcon className="w-4 h-4" />
                <span>
                  Alerts {unreadAlertsCount > 0 && `(${unreadAlertsCount})`}
                </span>
              </button>

              {user.isAuthenticated ? (
                <div className="px-3 py-2">
                  <p className="text-sm text-gray-600 mb-2">
                    Welcome, {user.email}
                  </p>
                  <button
                    onClick={onLogout}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-md cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="px-3 py-2">
                  <button
                    onClick={onLoginClick}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md cursor-pointer"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    );
  }
);

const Toast = memo(
  ({
    message,
    type,
    isVisible,
    onClose,
  }: {
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
    onClose: () => void;
  }) => {
    const colors = {
      success: "bg-green-500",
      error: "bg-red-500",
      info: "bg-blue-500",
    };

    useEffect(() => {
      if (isVisible) {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
      }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
      <div
        className={`fixed top-10 md:top-20 right-4 z-50 ${
          colors[type]
        } text-white px-4 sm:px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 max-w-[300px] md:max-w-sm ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm">{message}</span>
          <button onClick={onClose} className="ml-2 cursor-pointer">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }
);

// Main Component
export default function PortfolioAnalyzer() {
  // State management
  const [user, setUser] = useState<User>({ email: "", isAuthenticated: false });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedRiskMetric, setSelectedRiskMetric] =
    useState<RiskMetric | null>(null);
  const [isClient, setisClient] = useState(false);
  const [stockData, setStockData] = useState(() => generateStockData());
  const [newsData] = useState(() => generateNewsData());
  const [riskMetrics, setRiskMetrics] = useState(() => generateRiskMetrics());
  const [portfolios, setPortfolios] = useState(() => generatePortfolios());
  const [alerts, setAlerts] = useState(() => generateAlerts());

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  const unreadAlertsCount = useMemo(
    () => alerts.filter((alert) => !alert.read).length,
    [alerts]
  );

  useEffect(() => {
    if (!isClient) {
      setisClient(true);
    }
  }, []);

  // Event handlers
  const handleLogin = useCallback((email: string, password: string) => {
    if (password) {
      setUser({ email, isAuthenticated: true });
      setIsLoginModalOpen(false);
      setToast({
        message: `Welcome back, ${email}!`,
        type: "success",
        isVisible: true,
      });
    } else {
      setToast({
        message: "Invalid credentials. Use password: 12345678",
        type: "error",
        isVisible: true,
      });
    }
  }, []);

  const handleLogout = useCallback(() => {
    const userEmail = user.email;
    setUser({ email: "", isAuthenticated: false });
    setIsMobileMenuOpen(false);
    setToast({
      message: `Goodbye, ${userEmail}!`,
      type: "info",
      isVisible: true,
    });
  }, [user.email]);

  const handleNewsClick = useCallback((news: NewsItem) => {
    setSelectedNews(news);
    setIsNewsModalOpen(true);
  }, []);

  const handleRiskClick = useCallback((metric: RiskMetric) => {
    setSelectedRiskMetric(metric);
    setIsRiskModalOpen(true);
  }, []);

  const handleCreatePortfolio = useCallback((name: string) => {
    const newPortfolio: Portfolio = {
      id: `portfolio-${Date.now()}`,
      name,
      value: Math.floor(Math.random() * 100000) + 50000,
      change: (Math.random() - 0.5) * 10,
      allocation: { Stocks: 60, Bonds: 30, Cash: 10 },
    };
    setPortfolios((prev) => [...prev, newPortfolio]);
    setToast({
      message: `Portfolio "${name}" created successfully!`,
      type: "success",
      isVisible: true,
    });
  }, []);

  const handleDeletePortfolio = useCallback((id: string) => {
    setPortfolios((prev) => prev.filter((p) => p.id !== id));
    setToast({
      message: "Portfolio deleted successfully!",
      type: "info",
      isVisible: true,
    });
  }, []);

  const handleMarkAsRead = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert))
    );
  }, []);

  const handleDeleteAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  // Add live data update mechanism
  useEffect(() => {
    const interval = setInterval(() => {
      // Update stock data with new values
      setStockData((prev: StockData[]) => {
        const newData = [...prev];
        const lastItem = newData[newData.length - 1];
        const today = new Date().toISOString().split("T")[0];
        
        // Only add new data if it's a new day or update the last entry
        if (lastItem.date !== today) {
          const basePrice = lastItem.close;
          const open = basePrice + (Math.random() - 0.5) * 5;
          const close = open + (Math.random() - 0.5) * 4;
          const high = Math.max(open, close) + Math.random() * 3;
          const low = Math.min(open, close) - Math.random() * 3;

          newData.push({
            date: today,
            open: Math.round(open * 100) / 100,
            high: Math.round(high * 100) / 100,
            low: Math.round(low * 100) / 100,
            close: Math.round(close * 100) / 100,
            volume: Math.floor(Math.random() * 1000000) + 500000,
          });
        } else {
          // Update current day's data
          const updatedClose = lastItem.close + (Math.random() - 0.5) * 2;
          newData[newData.length - 1] = {
            ...lastItem,
            close: Math.round(updatedClose * 100) / 100,
            high: Math.max(lastItem.high, updatedClose),
            low: Math.min(lastItem.low, updatedClose),
          };
        }
        
        return newData;
      });

      // Update risk metrics with slight variations
      setRiskMetrics((prev: RiskMetric[]) => prev.map((metric: RiskMetric) => ({
        ...metric,
        value: Math.round((metric.value + (Math.random() - 0.5) * 0.1) * 100) / 100,
        change: Math.round((Math.random() - 0.5) * 0.2 * 100) / 100,
      })));

      // Update portfolios with real-time changes
      setPortfolios((prev: Portfolio[]) => prev.map((portfolio: Portfolio) => {
        const changePercent = (Math.random() - 0.5) * 0.25; // Random change between -0.25% to +0.25%
        const newValue = portfolio.value * (1 + changePercent / 100);
        const newChange = portfolio.change + (Math.random() - 0.5) * 0.2; // Small random adjustment
        
        return {
          ...portfolio,
          value: Math.round(newValue),
          change: Math.round(newChange * 100) / 100, // Format to 2 decimal places
        };
      }));

    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (!isClient) {
    return "";
  }
  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "Roboto, sans-serif" }}
    >
      {user.isAuthenticated && (
        <Navbar
          user={user}
          onLoginClick={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          onPortfolioClick={() => setIsPortfolioModalOpen(true)}
          onAlertsClick={() => setIsAlertsModalOpen(true)}
          unreadAlertsCount={unreadAlertsCount}
        />
      )}

      <AuthGuard
        isAuthenticated={user.isAuthenticated}
        onLoginRequired={() => setIsLoginModalOpen(true)}
      >
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Hero Section */}
          <div id="dashboard" className="mb-6 sm:mb-8">
            <div className="relative h-64 sm:h-72 md:h-80 lg:h-[26rem] xl:h-[30rem] rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1563986768711-b3bde3dc821e?w=1200&h=400&fit=crop&crop=center"
                alt="Financial Dashboard"
                className="w-full h-full object-cover"
              />
              {/* <div
                className="relative h-[60vh] md:h-[75vh] lg:h-[90vh] w-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://source.unsplash.com/1600x900/?stock,finance,analytics')`,
                }}
              > */}
              {/* Black overlay */}
              <div className="absolute inset-0 bg-black/50 bg-opacity-60 flex items-center justify-center p-4">
                <div className="text-center text-white px-2">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
                    Advanced Portfolio Analytics
                  </h1>
                  <p className="text-sm sm:text-lg md:text-xl opacity-90 mb-4 sm:mb-6">
                    Real-time insights for informed investment decisions
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
                    <button
                      onClick={() => setIsPortfolioModalOpen(true)}
                      className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <ChartPieIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">
                        Manage Portfolios
                      </span>
                    </button>
                  </div>
                </div>
                {/* </div> */}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Value
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    $305K
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <CurrencyDollarIcon className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-1 sm:mt-2 text-xs sm:text-sm">
                <ArrowTrendingUpIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mr-1" />
                <span className="text-green-600">+5.2%</span>
                <span className="text-gray-500 ml-1 hidden sm:inline">
                  from last month
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Portfolios
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {portfolios.length}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <ChartPieIcon className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-1 sm:mt-2 text-xs sm:text-sm">
                <span className="text-gray-500">Diversified</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Risk Score
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    7.2
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                  <ExclamationTriangleIcon className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
                </div>
              </div>
              <div className="flex items-center mt-1 sm:mt-2 text-xs sm:text-sm">
                <span className="text-yellow-600">Moderate</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Alerts
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {unreadAlertsCount}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                  <BellIcon className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
                </div>
              </div>
              <div className="flex items-center mt-1 sm:mt-2 text-xs sm:text-sm">
                <span className="text-gray-500">Unread</span>
              </div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div
            id="analytics"
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {/* Candlestick Chart */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                    <ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
                    Stock Price Movement
                  </h2>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs sm:text-sm text-gray-500">
                      Last 30 days
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <CandlestickChart
                    data={stockData}
                    width={Math.max(
                      300,
                      window.innerWidth > 1024
                        ? 750
                        : Math.min(window.innerWidth - 100, 500)
                    )}
                    height={250}
                  />
                </div>
              </div>
            </div>

            {/* Risk Metrics */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Risk Metrics
                </h2>
              </div>
              {riskMetrics.map((metric) => (
                <RiskCard
                  key={metric.id}
                  metric={metric}
                  onDetailsClick={handleRiskClick}
                />
              ))}
            </div>
          </div>

          {/* News Sentiment Word Cloud */}
          <div className="mt-6 sm:mt-12">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Market Sentiment Analysis
                </h2>
                <div className="flex items-center space-x-2"></div>
              </div>
              <WordCloud news={newsData} onNewsClick={handleNewsClick} />
            </div>
          </div>

          {/* Additional Insights */}
          <div
            id="insights"
            className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <img
                src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=200&fit=crop&crop=center"
                alt="Market Analysis"
                className="w-full h-24 sm:h-32 object-cover rounded-lg mb-4 group-hover:opacity-90 transition-opacity"
              />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Market Trends
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Comprehensive analysis of current market conditions and future
                projections.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <img
                src="https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=200&fit=crop&crop=center"
                alt="Portfolio Management"
                className="w-full h-24 sm:h-32 object-cover rounded-lg mb-4 group-hover:opacity-90 transition-opacity"
              />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Portfolio Optimization
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                AI-powered recommendations to optimize your investment portfolio
                for maximum returns.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 group md:col-span-2 lg:col-span-1">
              <img
                src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=200&fit=crop&crop=center"
                alt="Risk Assessment"
                className="w-full h-24 sm:h-32 object-cover rounded-lg mb-4 group-hover:opacity-90 transition-opacity"
              />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Risk Assessment
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Advanced risk modeling and stress testing for your investment
                strategies.
              </p>
            </div>
          </div>
        </main>
        <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
              {/* Brand + Social */}
              <div>
                <a
                  href="#"
                  className="text-xl font-bold text-white flex justify-center md:justify-start items-center mb-6"
                >
                  <span>
                    Portfolio<span className="text-indigo-400">Analyzer</span>
                  </span>
                </a>
                <p className="mb-6">
                  Empowering businesses with next-generation automation and
                  analytics tools. twitter facebook
                </p>
              </div>

              {/* Links */}
              <div>
                <h5 className="text-white font-medium mb-4">Product</h5>
                <ul className="space-y-2">
                  {[
                    "Features",
                    "Pricing",
                    "Integrations",
                    "Changelog",
                    "Documentation",
                  ].map((item, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="hover:text-white transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-white font-medium mb-4">Company</h5>
                <ul className="space-y-2">
                  {["About", "Customers", "Careers", "Press", "Contact"].map(
                    (item, index) => (
                      <li key={index}>
                        <a
                          href="#"
                          className="hover:text-white transition-colors"
                        >
                          {item}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <h5 className="text-white font-medium mb-4">Resources</h5>
                <ul className="space-y-2">
                  {[
                    "Blog",
                    "Guides",
                    "Webinars",
                    "API Reference",
                    "Support Center",
                  ].map((item, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="hover:text-white transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 mt-12 pt-6 text-center">
              <p>
                © {new Date().getFullYear()} PortfolioAnalyzer. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </AuthGuard>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      <PortfolioModal
        isOpen={isPortfolioModalOpen}
        onClose={() => setIsPortfolioModalOpen(false)}
        portfolios={portfolios}
        onCreatePortfolio={handleCreatePortfolio}
        onDeletePortfolio={handleDeletePortfolio}
      />

      <AlertsModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        alerts={alerts}
        onMarkAsRead={handleMarkAsRead}
        onDeleteAlert={handleDeleteAlert}
      />

      <NewsDetailsModal
        isOpen={isNewsModalOpen}
        onClose={() => setIsNewsModalOpen(false)}
        news={selectedNews}
      />

      <RiskDetailsModal
        isOpen={isRiskModalOpen}
        onClose={() => setIsRiskModalOpen(false)}
        metric={selectedRiskMetric}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </div>
  );
}
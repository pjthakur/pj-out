"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  AdjustmentsHorizontalIcon,
  ArrowsRightLeftIcon,
  MapPinIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowPathIcon,
  BellIcon,
  ShieldExclamationIcon,
  PlayIcon,
  PauseIcon,
} from "@heroicons/react/24/outline";

// Types
interface AirQualityData {
  id: string;
  city: string;
  country: string;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
  aqi: number;
  status: "Good" | "Moderate" | "Unhealthy" | "Very Unhealthy" | "Hazardous";
  coordinates: { lat: number; lng: number };
  timestamp: Date;
  trend: number[];
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

interface Alert {
  id: string;
  cityId: string;
  cityName: string;
  type: "threshold" | "trend" | "health";
  severity: "low" | "medium" | "high";
  message: string;
  timestamp: Date;
  isRead: boolean;
}

let toastCounter = 0;
let alertCounter = 0;

// Mock data generator
const generateMockData = (): AirQualityData[] => {
  const cities = [
    {
      name: "New York",
      country: "USA",
      lat: 40.7128,
      lng: -74.006,
      baseAQI: 45,
    },
    {
      name: "Los Angeles",
      country: "USA",
      lat: 34.0522,
      lng: -118.2437,
      baseAQI: 65,
    },
    { name: "London", country: "UK", lat: 51.5074, lng: -0.1278, baseAQI: 40 },
    {
      name: "Paris",
      country: "France",
      lat: 48.8566,
      lng: 2.3522,
      baseAQI: 50,
    },
    {
      name: "Tokyo",
      country: "Japan",
      lat: 35.6762,
      lng: 139.6503,
      baseAQI: 55,
    },
    {
      name: "Beijing",
      country: "China",
      lat: 39.9042,
      lng: 116.4074,
      baseAQI: 120,
    },
    {
      name: "Mumbai",
      country: "India",
      lat: 19.076,
      lng: 72.8777,
      baseAQI: 140,
    },
    {
      name: "São Paulo",
      country: "Brazil",
      lat: -23.5505,
      lng: -46.6333,
      baseAQI: 70,
    },
    {
      name: "Sydney",
      country: "Australia",
      lat: -33.8688,
      lng: 151.2093,
      baseAQI: 35,
    },
    {
      name: "Berlin",
      country: "Germany",
      lat: 52.52,
      lng: 13.405,
      baseAQI: 42,
    },
    {
      name: "Toronto",
      country: "Canada",
      lat: 43.6532,
      lng: -79.3832,
      baseAQI: 38,
    },
    {
      name: "Singapore",
      country: "Singapore",
      lat: 1.3521,
      lng: 103.8198,
      baseAQI: 48,
    },
    { name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, baseAQI: 85 },
    {
      name: "Mexico City",
      country: "Mexico",
      lat: 19.4326,
      lng: -99.1332,
      baseAQI: 95,
    },
    {
      name: "Cairo",
      country: "Egypt",
      lat: 30.0444,
      lng: 31.2357,
      baseAQI: 110,
    },
  ];

  const getAQIStatus = (aqi: number): AirQualityData["status"] => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  return cities.map((city, index) => {
    const variation = (Math.random() - 0.5) * 30;
    const currentAQI = Math.max(15, Math.min(300, city.baseAQI + variation));
    const pm25 = Math.round(currentAQI * 0.4 + (Math.random() - 0.5) * 10);

    const trend = Array.from({ length: 24 }, (_, hourIndex) => {
      const timeVariation = Math.sin((hourIndex / 24) * Math.PI * 2) * 15;
      const randomVariation = (Math.random() - 0.5) * 10;
      const baseValue = pm25 + timeVariation + randomVariation;
      return Math.max(5, Math.round(baseValue));
    });

    return {
      id: `city-${index}-${city.name.toLowerCase().replace(/\s/g, "-")}`,
      city: city.name,
      country: city.country,
      pm25,
      pm10: Math.round(pm25 * 1.3 + Math.random() * 8),
      o3: Math.round(currentAQI * 0.6 + Math.random() * 20),
      no2: Math.round(currentAQI * 0.3 + Math.random() * 15),
      so2: Math.round(currentAQI * 0.2 + Math.random() * 8),
      co: Math.round(currentAQI * 0.05 + Math.random() * 3),
      aqi: Math.round(currentAQI),
      status: getAQIStatus(Math.round(currentAQI)),
      coordinates: { lat: city.lat, lng: city.lng },
      timestamp: new Date(),
      trend,
    };
  });
};

const AirWatch: React.FC = () => {
  // State management
  const [data, setData] = useState<AirQualityData[]>([]);
  const [filteredData, setFilteredData] = useState<AirQualityData[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [compareCity, setCompareCity] = useState<string | null>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [filters, setFilters] = useState({
    country: "",
    minAQI: 0,
    maxAQI: 500,
    status: "",
  });

  const [isClient, setisClient] = useState(false);

  // Refs for scrolling
  const compareSectionRef = React.useRef<HTMLDivElement>(null);
  const alertsRef = React.useRef<HTMLDivElement>(null);

  // Thresholds for alerts
  const thresholds = {
    pm25: { moderate: 25, unhealthy: 40, dangerous: 60 },
    aqi: { moderate: 60, unhealthy: 100, dangerous: 150 },
  };

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isSidebarOpen || isMobileMenuOpen || isAlertsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen, isMobileMenuOpen, isAlertsOpen]);
  useEffect(() => {
    if (!isAlertsOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        alertsRef.current &&
        !alertsRef.current.contains(event.target as Node)
      ) {
        setIsAlertsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAlertsOpen]);

  useEffect(() => {
    if (!isClient) {
      setisClient(true);
    }
  }, []);
  // Initialize data
  useEffect(() => {
    const mockData = generateMockData();
    setData(mockData);
    setFilteredData(mockData);
    setSelectedCity(mockData[0]?.id || null);

    // Generate initial alerts for demo
    setTimeout(() => {
      mockData.forEach((city) => {
        if (city.pm25 > thresholds.pm25.moderate) {
          const severity =
            city.pm25 > thresholds.pm25.dangerous
              ? "high"
              : city.pm25 > thresholds.pm25.unhealthy
              ? "medium"
              : "low";
          const alert: Alert = {
            id: `initial-alert-${++alertCounter}-${city.id}`,
            cityId: city.id,
            cityName: city.city,
            type: "threshold",
            severity,
            message: `${city.city} PM2.5 levels are ${
              severity === "high"
                ? "dangerous"
                : severity === "medium"
                ? "unhealthy"
                : "elevated"
            } (${city.pm25} μg/m³)`,
            timestamp: new Date(),
            isRead: false,
          };
          setAlerts((prev) => [alert, ...prev]);
        }
      });
    }, 2000);
  }, []);

  // Filter data based on filters
  useEffect(() => {
    const filtered = data.filter((city) => {
      const matchesCountry =
        !filters.country ||
        city.country.toLowerCase().includes(filters.country.toLowerCase());
      const matchesAQI =
        city.aqi >= filters.minAQI && city.aqi <= filters.maxAQI;
      const matchesStatus = !filters.status || city.status === filters.status;
      return matchesCountry && matchesAQI && matchesStatus;
    });
    setFilteredData(filtered);
  }, [data, filters]);

  const showToast = (
    setToasts: React.Dispatch<React.SetStateAction<Toast[]>>,
    message: string,
    type: Toast["type"] = "info",
    duration = 5000
  ) => {
    const id = `toast-${++toastCounter}-${Date.now()}`;
    const newToast: Toast = { id, message, type, duration };

    setToasts((prev) => {
      const exists = prev.some(
        (toast) => toast.message === message && toast.type === type
      );
      if (exists) return prev;
      return [newToast, ...prev.slice(0, 4)];
    });

    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, duration);
  };

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Get color based on AQI
  const getAQIColor = useCallback((aqi: number): string => {
    if (aqi <= 50) return "text-green-600 bg-green-50 border-green-200";
    if (aqi <= 100) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (aqi <= 150) return "text-orange-600 bg-orange-50 border-orange-200";
    if (aqi <= 200) return "text-red-600 bg-red-50 border-red-200";
    if (aqi <= 300) return "text-purple-600 bg-purple-50 border-purple-200";
    return "text-rose-600 bg-rose-50 border-rose-200";
  }, []);

  const getMapPointColor = useCallback((aqi: number): string => {
    if (aqi <= 50) return "bg-green-500";
    if (aqi <= 100) return "bg-yellow-500";
    if (aqi <= 150) return "bg-orange-500";
    if (aqi <= 200) return "bg-red-500";
    if (aqi <= 300) return "bg-purple-500";
    return "bg-rose-500";
  }, []);

  const getPM25OverlayColor = useCallback((pm25: number): string => {
    if (pm25 <= 12) return "rgba(16, 185, 129, 0.15)";
    if (pm25 <= 35) return "rgba(245, 158, 11, 0.15)";
    if (pm25 <= 55) return "rgba(249, 115, 22, 0.2)";
    if (pm25 <= 150) return "rgba(239, 68, 68, 0.25)";
    if (pm25 <= 250) return "rgba(147, 51, 234, 0.3)";
    return "rgba(244, 63, 94, 0.35)";
  }, []);

  // Check for threshold alerts
  const checkThresholdAlerts = useCallback(
    (newData: AirQualityData[], oldData: AirQualityData[]) => {
      newData.forEach((city) => {
        const oldCity = oldData.find((old) => old.id === city.id);
        if (!oldCity) return;

        if (
          city.pm25 > thresholds.pm25.dangerous &&
          oldCity.pm25 <= thresholds.pm25.dangerous
        ) {
          const alert: Alert = {
            id: `alert-${++alertCounter}-${Date.now()}`,
            cityId: city.id,
            cityName: city.city,
            type: "threshold",
            severity: "high",
            message: `🚨 ${city.city}: PM2.5 reached dangerous levels (${city.pm25} μg/m³)`,
            timestamp: new Date(),
            isRead: false,
          };
          setAlerts((prev) => [alert, ...prev.slice(0, 19)]);
        } else if (
          city.pm25 > thresholds.pm25.unhealthy &&
          oldCity.pm25 <= thresholds.pm25.unhealthy
        ) {
          const alert: Alert = {
            id: `alert-${++alertCounter}-${Date.now()}`,
            cityId: city.id,
            cityName: city.city,
            type: "threshold",
            severity: "medium",
            message: `⚠️ ${city.city}: PM2.5 levels Unhealthy(${city.pm25} μg/m³)`,
            timestamp: new Date(),
            isRead: false,
          };
          setAlerts((prev) => [alert, ...prev.slice(0, 19)]);
        } else if (
          city.pm25 > thresholds.pm25.moderate &&
          oldCity.pm25 <= thresholds.pm25.moderate
        ) {
          const alert: Alert = {
            id: `alert-${++alertCounter}-${Date.now()}`,
            cityId: city.id,
            cityName: city.city,
            type: "threshold",
            severity: "low",
            message: `ℹ️ ${city.city}: PM2.5 levels elevated (${city.pm25} μg/m³)`,
            timestamp: new Date(),
            isRead: false,
          };
          setAlerts((prev) => [alert, ...prev.slice(0, 19)]);
        }

        const trendChange =
          city.trend[city.trend.length - 1] - city.trend[city.trend.length - 4];
        if (Math.abs(trendChange) > 15) {
          const alert: Alert = {
            id: `alert-${++alertCounter}-${Date.now()}`,
            cityId: city.id,
            cityName: city.city,
            type: "trend",
            severity: trendChange > 0 ? "medium" : "low",
            message: `📈 ${city.city}: Rapid air quality ${
              trendChange > 0 ? "deterioration" : "improvement"
            } detected`,
            timestamp: new Date(),
            isRead: false,
          };
          setAlerts((prev) => [alert, ...prev.slice(0, 19)]);
        }

        if (
          city.aqi > thresholds.aqi.dangerous &&
          oldCity.aqi <= thresholds.aqi.dangerous
        ) {
          const alert: Alert = {
            id: `alert-${++alertCounter}-${Date.now()}`,
            cityId: city.id,
            cityName: city.city,
            type: "threshold",
            severity: "high",
            message: `🔴 ${city.city}: AQI reached dangerous levels (${city.aqi})`,
            timestamp: new Date(),
            isRead: false,
          };
          setAlerts((prev) => [alert, ...prev.slice(0, 19)]);
        }
      });
    },
    [thresholds]
  );

  // Update data periodically
  useEffect(() => {
    if (!isAutoRefreshEnabled) return;

    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = prevData.map((city) => {
          const variation = (Math.random() - 0.5) * 0.1;
          const newPM25 = Math.max(5, Math.round(city.pm25 * (1 + variation)));
          const newAQI = Math.max(
            10,
            Math.round(city.aqi * (1 + variation * 0.8))
          );
          const newTrend = [...city.trend.slice(1), newPM25];

          return {
            ...city,
            pm25: newPM25,
            pm10: Math.round(newPM25 * 1.3),
            aqi: newAQI,
            timestamp: new Date(),
            trend: newTrend,
          };
        });

        checkThresholdAlerts(newData, prevData);
        setLastRefresh(new Date());

        return newData;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [isAutoRefreshEnabled, checkThresholdAlerts]);

  // Manual refresh function
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);

    showToast(setToasts, "Refreshing air quality data...", "info", 2000);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const oldData = [...data];
      const newData = generateMockData();
      setData(newData);
      setLastRefresh(new Date());

      if (oldData.length > 0) {
        checkThresholdAlerts(newData, oldData);
      }

      showToast(setToasts, "Data refreshed successfully", "success", 3000);
    } catch (error) {
      showToast(setToasts, "Failed to refresh data", "error", 4000);
    } finally {
      setIsRefreshing(false);
    }
  }, [data, checkThresholdAlerts]);

  const toggleAutoRefresh = useCallback(() => {
    setIsAutoRefreshEnabled((prev) => {
      const newState = !prev;
      showToast(
        setToasts,
        newState ? "Auto-refresh enabled" : "Auto-refresh disabled",
        "info"
      );
      return newState;
    });
  }, []);
  const markAlertAsRead = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  }, []);
  const markAllAlertsAsRead = useCallback(() => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, isRead: true })));
    showToast(setToasts, "All alerts marked as read", "info");
  }, []);

  // Memoized components
  const selectedCityData = useMemo(
    () => data.find((city) => city.id === selectedCity),
    [data, selectedCity]
  );

  const compareCityData = useMemo(
    () => data.find((city) => city.id === compareCity),
    [data, compareCity]
  );
  const handleCitySelect = useCallback(
    (cityId: string, showToastMessage = true) => {
      setSelectedCity(cityId);
      setIsMobileMenuOpen(false);
      if (showToastMessage) {
        showToast(
          setToasts,
          `Selected ${data.find((c) => c.id === cityId)?.city}`,
          "info"
        );
      }
    },
    [data]
  );
  const handleCompareSelect = useCallback(
    (cityId: string) => {
      setCompareCity(cityId);
      showToast(
        setToasts,
        `Comparing with ${data.find((c) => c.id === cityId)?.city}`,
        "info"
      );
    },
    [data]
  );

  const toggleCompareMode = useCallback(() => {
    setIsCompareMode((prev) => {
      const newMode = !prev;
      showToast(
        setToasts,
        newMode ? "Compare mode enabled" : "Compare mode disabled",
        "info"
      );
      return newMode;
    });
  }, []);

  useEffect(() => {
    if (isCompareMode && compareSectionRef.current) {
      compareSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isCompareMode]);

  // Chart component
  const TrendChart: React.FC<{
    data: number[];
    title: string;
    color: string;
  }> = ({ data, title, color }) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    const avgValue = Math.round(
      data.reduce((sum, val) => sum + val, 0) / data.length
    );
    const currentValue = data[data.length - 1];
    const previousValue = data[data.length - 2];
    const change = currentValue - previousValue;

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 flex items-center">
              <ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-blue-600" />
              <span className="text-sm sm:text-xl">{title}</span>
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-sm">
              <div className="flex items-center">
                <span className="text-gray-500">Current:</span>
                <span
                  className="ml-2 font-bold text-base sm:text-lg"
                  style={{ color }}
                >
                  {currentValue} μg/m³
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500">Avg:</span>
                <span className="ml-2 font-semibold text-gray-700">
                  {avgValue} μg/m³
                </span>
              </div>
              <div
                className={`flex items-center px-2 py-1 rounded-md w-fit ${
                  change > 0
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-700"
                }`}
              >
                <span className="text-xs font-medium">
                  {change > 0 ? "↗" : "↘"} {Math.abs(change).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative h-32 sm:h-48 mb-4">
          <svg className="w-full h-full" viewBox="0 0 400 180">
            <defs>
              <linearGradient
                id={`gradient-${color.replace("#", "")}`}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                <stop offset="50%" stopColor={color} stopOpacity="0.2" />
                <stop offset="100%" stopColor={color} stopOpacity="0.05" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {[0, 25, 50, 75, 100].map((percent) => (
              <line
                key={percent}
                x1="0"
                y1={percent * 1.6}
                x2="400"
                y2={percent * 1.6}
                stroke="#f1f5f9"
                strokeWidth="1"
              />
            ))}

            <path
              d={`M 0 160 L 0 ${
                160 - (((data[0] - minValue) / range) * 120 + 20)
              } ${data
                .map(
                  (value, index) =>
                    `L ${(index / (data.length - 1)) * 400} ${
                      160 - (((value - minValue) / range) * 120 + 20)
                    }`
                )
                .join(" ")} L 400 160 Z`}
              fill={`url(#gradient-${color.replace("#", "")})`}
              className="transition-all duration-700"
            />

            <path
              d={`M 0 ${
                160 - (((data[0] - minValue) / range) * 120 + 20)
              } ${data
                .map(
                  (value, index) =>
                    `L ${(index / (data.length - 1)) * 400} ${
                      160 - (((value - minValue) / range) * 120 + 20)
                    }`
                )
                .join(" ")}`}
              fill="none"
              stroke={color}
              strokeWidth="3"
              filter="url(#glow)"
              className="transition-all duration-700"
            />

            {data.map((value, index) => (
              <circle
                key={index}
                cx={(index / (data.length - 1)) * 400}
                cy={160 - (((value - minValue) / range) * 120 + 20)}
                r="4"
                fill={color}
                stroke="white"
                strokeWidth="2"
                className="transition-all duration-300 hover:r-6 cursor-pointer"
                opacity={index === data.length - 1 ? 1 : 0.7}
              >
                <title>{`${index}h ago: ${value} μg/m³`}</title>
              </circle>
            ))}

            <circle
              cx={400}
              cy={
                160 - (((data[data.length - 1] - minValue) / range) * 120 + 20)
              }
              r="6"
              fill={color}
              stroke="white"
              strokeWidth="3"
              className="animate-pulse"
            />
          </svg>
        </div>

        <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500">
          <span>24h ago</span>
          <div className="hidden sm:flex items-center space-x-4">
            <span>Peak: {maxValue} μg/m³</span>
            <span>Low: {minValue} μg/m³</span>
          </div>
          <span>Now</span>
        </div>
      </div>
    );
  };

  // City card component
  const CityCard: React.FC<{
    city: AirQualityData;
    isSelected?: boolean;
    onClick: () => void;
  }> = ({ city, isSelected, onClick }) => (
    <div
      className={`relative p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:shadow-xl transform hover:-translate-y-1 ${
        isSelected
          ? "border-blue-500 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 ring-2 ring-blue-200"
          : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div
        className={`absolute top-3 right-3 w-3 h-3 rounded-full ${
          city.status === "Good"
            ? "bg-green-500"
            : city.status === "Moderate"
            ? "bg-yellow-500"
            : "bg-red-500"
        } shadow-sm`}
      >
        <div
          className={`absolute inset-0 rounded-full animate-ping ${
            city.status === "Good"
              ? "bg-green-400"
              : city.status === "Moderate"
              ? "bg-yellow-400"
              : "bg-red-400"
          }`}
        ></div>
      </div>

      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">
            {city.city}
          </h3>
          <p className="text-sm text-gray-500 font-medium">{city.country}</p>
        </div>
        <div
          className={`px-2 sm:px-3 py-1 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border-2 shadow-sm ml-2 ${getAQIColor(
            city.aqi
          )}`}
        >
          AQI {city.aqi}
        </div>
      </div>

      <div className="mb-3 sm:mb-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              PM2.5
            </span>
            <div className="flex items-baseline">
              <span className="text-xl sm:text-2xl font-bold text-gray-900">
                {city.pm25}
              </span>
              <span className="text-sm text-gray-500 ml-1">μg/m³</span>
            </div>
          </div>
          <div
            className={`w-10 h-6 sm:w-12 sm:h-8 rounded-lg flex items-center justify-center ${
              city.pm25 <= 12
                ? "bg-green-100 text-green-700"
                : city.pm25 <= 35
                ? "bg-yellow-100 text-yellow-700"
                : city.pm25 <= 55
                ? "bg-orange-100 text-orange-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            <div
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                city.pm25 <= 12
                  ? "bg-green-500"
                  : city.pm25 <= 35
                  ? "bg-yellow-500"
                  : city.pm25 <= 55
                  ? "bg-orange-500"
                  : "bg-red-500"
              }`}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 text-sm mb-3 sm:mb-4">
        <div className="flex gap-3">
          <span className="text-gray-500">PM10:</span>
          <span className="font-semibold text-gray-900">{city.pm10}</span>
        </div>
        <div className="flex gap-3">
          <span className="text-gray-500">O₃:</span>
          <span className="font-semibold text-gray-900">{city.o3}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className={`text-xs sm:text-sm font-bold px-2 py-1 rounded-md ${
            city.status === "Good"
              ? "text-green-700 bg-green-100"
              : city.status === "Moderate"
              ? "text-yellow-700 bg-yellow-100"
              : "text-red-700 bg-red-100"
          }`}
        >
          {city.status}
        </span>
        <div className="flex items-center text-xs text-gray-400">
          <ClockIcon className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">
            {city.timestamp.toLocaleTimeString()}
          </span>
          <span className="sm:hidden">
            {city.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">24h trend</span>
          <div className="flex items-center">
            {city.trend[city.trend.length - 1] > city.trend[0] ? (
              <span className="text-red-600 flex items-center">
                ↗ Increasing
              </span>
            ) : (
              <span className="text-green-600 flex items-center">
                ↘ Decreasing
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (!isClient) {
    return "";
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Roboto',sans-serif]">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="  mx-auto px-3 sm:px-4 lg:px-24 ">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <button
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Bars3Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </button>
              <div className="flex items-center ml-2 sm:ml-4 lg:ml-0">
                <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <MapPinIcon className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                </div>
                <div className="ml-2 sm:ml-3">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                    AirWatch Pro
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                    Real-time Air Quality Monitoring
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Alerts Button */}
              <div className="relative">
                <button
                  className="p-1.5 sm:p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 cursor-pointer relative"
                  onClick={() => setIsAlertsOpen(!isAlertsOpen)}
                  title="View alerts"
                >
                  <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  {alerts.filter((alert) => !alert.isRead).length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {alerts.filter((alert) => !alert.isRead).length}
                    </span>
                  )}
                </button>
              </div>

              {/* Auto-refresh Toggle */}
              <button
                className={` hidden md:flex p-1.5 sm:p-2 rounded-lg transition-all duration-200 cursor-pointer  items-center ${
                  isAutoRefreshEnabled
                    ? "text-green-600 bg-green-50 border border-green-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                onClick={toggleAutoRefresh}
                title={
                  isAutoRefreshEnabled
                    ? "Disable auto-refresh"
                    : "Enable auto-refresh"
                }
              >
                {isAutoRefreshEnabled ? (
                  <PlayIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <PauseIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>

              {/* Manual Refresh Button */}
              <button
                className={` hidden md:flex px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-200 cursor-pointer   items-center space-x-1 sm:space-x-2 ${
                  isRefreshing
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200"
                }`}
                onClick={handleRefresh}
                disabled={isRefreshing}
                title="Refresh data"
              >
                <ArrowPathIcon
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                <span className="hidden sm:inline text-sm">
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </span>
              </button>

              {/* Compare Mode Toggle */}
              <button
                className={`hidden md:flex px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-200 cursor-pointer  items-center ${
                  isCompareMode
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200"
                }`}
                onClick={toggleCompareMode}
              >
                <ArrowsRightLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
                <span className="hidden sm:inline text-sm">Compare</span>
              </button>

              <button
                className="lg:hidden p-1.5 sm:p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 max-h-96 overflow-y-auto">
            <div className="px-3 sm:px-4 py-4 space-y-3">
              <div className="flex gap-3">
                <button
                  className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center ${
                    isAutoRefreshEnabled
                      ? "text-green-600 bg-green-50 border border-green-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    toggleAutoRefresh();
                    setIsMobileMenuOpen(false);
                  }}
                  title={
                    isAutoRefreshEnabled
                      ? "Disable auto-refresh"
                      : "Enable auto-refresh"
                  }
                >
                  {isAutoRefreshEnabled ? (
                    <PlayIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <PauseIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>

                {/* Manual Refresh Button */}
                <button
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center space-x-1 sm:space-x-2 ${
                    isRefreshing
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200"
                  }`}
                  onClick={() => {
                    handleRefresh();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={isRefreshing}
                  title="Refresh data"
                >
                  <ArrowPathIcon
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                  <span className="hidden sm:inline text-sm">
                    {isRefreshing ? "Refreshing..." : "Refresh"}
                  </span>
                </button>

                {/* Compare Mode Toggle */}
                <button
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center ${
                    isCompareMode
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200"
                  }`}
                  onClick={() => {
                    toggleCompareMode();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <ArrowsRightLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
                  <span className="hidden sm:inline text-sm">Compare</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Bar */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-3 sm:px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center text-gray-600">
                <ClockIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </span>
                <span className="sm:hidden">
                  {lastRefresh.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full mr-1 sm:mr-2 ${
                    isAutoRefreshEnabled
                      ? "bg-green-500 animate-pulse"
                      : "bg-gray-400"
                  }`}
                ></div>
                <span className="text-gray-600">
                  {isAutoRefreshEnabled ? "Live" : "Manual"}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 text-gray-600">
              <span className="hidden sm:inline">
                {data.length} cities monitored
              </span>
              <span className="sm:hidden">{data.length} cities</span>
              <span className="hidden sm:inline">•</span>
              <span>
                {alerts.filter((alert) => !alert.isRead).length} alerts
              </span>
            </div>
          </div>
        </div>

        {/* Alerts Dropdown */}
        {isAlertsOpen && (
          <div
            ref={alertsRef}
            className="absolute sm:top-16 right-0 z-50 w-full sm:w-96 bg-white shadow-xl border border-gray-200 rounded-b-lg sm:rounded-lg md:right-32 "
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ShieldExclamationIcon className="h-5 w-5 mr-2 text-amber-500" />
                  Alerts
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                    onClick={markAllAlertsAsRead}
                  >
                    Mark all as read
                  </button>
                  <button
                    className="p-1 rounded-md text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={() => setIsAlertsOpen(false)}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-64 sm:max-h-80 overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BellIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No alerts</p>
                  </div>
                ) : (
                  alerts.slice(0, 10).map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border-l-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                        alert.isRead ? "opacity-60" : ""
                      } ${
                        alert.severity === "high"
                          ? "bg-red-50 border-red-500"
                          : alert.severity === "medium"
                          ? "bg-amber-50 border-amber-500"
                          : "bg-blue-50 border-blue-500"
                      }`}
                      onClick={() => {
                        markAlertAsRead(alert.id);
                        handleCitySelect(alert.cityId, false);
                        setIsAlertsOpen(false);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${
                              alert.severity === "high"
                                ? "text-red-800"
                                : alert.severity === "medium"
                                ? "text-amber-800"
                                : "text-blue-800"
                            }`}
                          >
                            {alert.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {alert.timestamp.toLocaleTimeString()} •{" "}
                            {alert.cityName}
                          </p>
                        </div>
                        {!alert.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-2"></div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Alerts overlay for mobile */}
        {isAlertsOpen && (
          <div
            className="lg:hidden fixed inset-0   bg-opacity-50 z-40"
            onClick={() => setIsAlertsOpen(false)}
          />
        )}
      </nav>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-80 bg-white shadow-sm border-r border-gray-200   sticky top-20 overflow-y-auto h-[90vh]">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Cities</h2>
              <span className="text-sm text-gray-500">
                {filteredData.length} locations
              </span>
            </div>

            {/* Filters */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Filters</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Search by country..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={filters.country}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, country: e.target.value }))
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min AQI"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={filters.minAQI === 0 ? '' : filters.minAQI}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minAQI: e.target.value === '' ? 0 : Number(e.target.value),
                      }))
                    }
                  />
                  <input
                    type="number"
                    placeholder="Max AQI"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={filters.maxAQI === 500 ? '' : filters.maxAQI}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxAQI: e.target.value === '' ? 500 : Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {filteredData.map((city) => (
                <CityCard
                  key={city.id}
                  city={city}
                  isSelected={selectedCity === city.id}
                  onClick={() => handleCitySelect(city.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 bg-opacity-50"
              onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar */}
            <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Filters & Cities
                  </h2>
                  <button
                    className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Filters Section */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Filters</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Search by country..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={filters.country}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          country: e.target.value,
                        }))
                      }
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min AQI"
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={filters.minAQI === 0 ? '' : filters.minAQI}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            minAQI: e.target.value === '' ? 0 : Number(e.target.value),
                          }))
                        }
                      />
                      <input
                        type="number"
                        placeholder="Max AQI"
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={filters.maxAQI === 500 ? '' : filters.maxAQI}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            maxAQI: e.target.value === '' ? 500 : Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Cities Section */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Cities ({filteredData.length})
                  </h3>
                  <div className="space-y-3">
                    {filteredData.map((city) => (
                      <CityCard
                        key={city.id}
                        city={city}
                        isSelected={selectedCity === city.id}
                        onClick={() => {
                          handleCitySelect(city.id);
                          setIsSidebarOpen(false);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 p-3 sm:p-4 lg:p-8 transition-all duration-300 ${
          isSidebarOpen ? 'lg:mr-0 mr-80' : ''
        }`}>
          {selectedCityData && (
            <div
              className={`grid gap-4 sm:gap-6 lg:gap-8 ${
                isCompareMode && compareCityData
                  ? "lg:grid-cols-2"
                  : "grid-cols-1"
              } ${isCompareMode ? "items-start" : ""}`}
            >
              {/* Primary City */}
              <div className="space-y-4 sm:space-y-6 flex flex-col h-full">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {selectedCityData.city}
                      </h2>
                      <p className="text-gray-500">
                        {selectedCityData.country}
                      </p>
                    </div>
                    <div
                      className={`px-3 sm:px-4 py-2 rounded-full text-base sm:text-lg font-semibold border-2 w-fit ${getAQIColor(
                        selectedCityData.aqi
                      )}`}
                    >
                      AQI {selectedCityData.aqi}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">
                        {selectedCityData.pm25}
                      </div>
                      <div className="text-xs  text-gray-500">PM2.5 μg/m³</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">
                        {selectedCityData.pm10}
                      </div>
                      <div className="text-xs  text-gray-500">PM10 μg/m³</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg col-span-2 sm:col-span-1">
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">
                        {selectedCityData.o3}
                      </div>
                      <div className="text-xs  text-gray-500">O₃ μg/m³</div>
                    </div>
                  </div>

                  <div
                    className={`p-3 sm:p-4 rounded-lg border-l-4 ${
                      selectedCityData.status === "Good"
                        ? "bg-green-50 border-green-500"
                        : selectedCityData.status === "Moderate"
                        ? "bg-yellow-50 border-yellow-500"
                        : "bg-red-50 border-red-500"
                    }`}
                  >
                    <div className="flex items-center">
                      {selectedCityData.status === "Good" ? (
                        <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2" />
                      ) : selectedCityData.status === "Moderate" ? (
                        <InformationCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mr-2" />
                      ) : (
                        <ExclamationTriangleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mr-2" />
                      )}
                      <span className="font-semibold text-sm sm:text-base">
                        {selectedCityData.status}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm mt-1 text-gray-600">
                      {selectedCityData.status === "Good" &&
                        "Air quality is satisfactory for most people. Great for outdoor activities."}
                      {selectedCityData.status === "Moderate" &&
                        "Air quality is acceptable for most people. Sensitive individuals may experience minor issues."}
                      {selectedCityData.status === "Unhealthy" &&
                        "Sensitive groups may experience health effects. General public less likely to be affected."}

                      {selectedCityData.status === "Very Unhealthy" &&
                        "Health warnings of emergency conditions. Everyone may experience serious health effects."}
                      {selectedCityData.status === "Hazardous" &&
                        "Health alert: everyone may experience serious health effects. Avoid outdoor activities."}
                    </p>
                  </div>
                </div>

                <div className="flex-1">
                  <TrendChart
                    data={selectedCityData.trend}
                    title={`${selectedCityData.city} - 24 Hour PM2.5 Trend`}
                    color="#3B82F6"
                  />
                </div>

                {/* World Map - Hidden on small screens, shown on medium+ and hidden in compare mode */}
                {!isCompareMode && (
                <div className=" block bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    Global Air Quality Map
                  </h3>
                  <div className="relative bg-gradient-to-b from-blue-100 to-blue-50 rounded-lg overflow-hidden">
                    <svg
                      viewBox="0 0 1000 500"
                      className="w-full h-auto min-h-[150px] sm:min-h-[200px]"
                      //   style={{ minHeight: "200px" }}
                    >
                      <defs>
                        <pattern
                          id="worldPattern"
                          patternUnits="userSpaceOnUse"
                          width="20"
                          height="20"
                        >
                          <rect width="20" height="20" fill="#f8fafc" />
                          <circle
                            cx="2"
                            cy="2"
                            r="0.5"
                            fill="#e2e8f0"
                            opacity="0.3"
                          />
                        </pattern>
                        <filter id="dropShadow">
                          <feDropShadow
                            dx="0"
                            dy="2"
                            stdDeviation="3"
                            floodOpacity="0.1"
                          />
                        </filter>
                      </defs>

                      <rect
                        width="1000"
                        height="500"
                        fill="url(#worldPattern)"
                      />

                      {/* Continents */}
                      <path
                        d="M120 80 Q200 60 280 90 L300 120 L280 180 L250 200 L200 190 L150 210 L100 180 L80 120 Z"
                        fill="#e5e7eb"
                        stroke="#d1d5db"
                        strokeWidth="1"
                        filter="url(#dropShadow)"
                      />
                      <path
                        d="M180 220 Q220 200 250 230 L280 280 L270 350 L240 380 L200 370 L180 340 L170 280 Z"
                        fill="#e5e7eb"
                        stroke="#d1d5db"
                        strokeWidth="1"
                        filter="url(#dropShadow)"
                      />
                      <path
                        d="M400 60 Q460 50 520 80 L540 120 L520 140 L480 130 L440 140 L400 120 Z"
                        fill="#e5e7eb"
                        stroke="#d1d5db"
                        strokeWidth="1"
                        filter="url(#dropShadow)"
                      />
                      <path
                        d="M420 160 Q480 140 540 170 L560 220 L550 280 L520 320 L480 340 L440 330 L420 280 L410 220 Z"
                        fill="#e5e7eb"
                        stroke="#d1d5db"
                        strokeWidth="1"
                        filter="url(#dropShadow)"
                      />
                      <path
                        d="M550 60 Q680 40 800 80 L820 120 L800 160 L750 180 L680 170 L600 150 L550 120 Z"
                        fill="#e5e7eb"
                        stroke="#d1d5db"
                        strokeWidth="1"
                        filter="url(#dropShadow)"
                      />
                      <path
                        d="M720 320 Q780 310 840 330 L860 350 L840 370 L780 380 L720 370 L700 350 Z"
                        fill="#e5e7eb"
                        stroke="#d1d5db"
                        strokeWidth="1"
                        filter="url(#dropShadow)"
                      />

                      {/* PM2.5 Overlay Zones */}
                      {data.map((city, index) => {
                        const x = ((city.coordinates.lng + 180) / 360) * 1000;
                        const y = ((90 - city.coordinates.lat) / 180) * 500;
                        const radius = Math.max(
                          30,
                          Math.min(80, city.pm25 * 0.8)
                        );

                        return (
                          <circle
                            key={`overlay-${city.id}`}
                            cx={x}
                            cy={y}
                            r={radius}
                            fill={getPM25OverlayColor(city.pm25)}
                            className="transition-all duration-1000"
                          >
                            <animate
                              attributeName="r"
                              values={`${radius};${radius + 5};${radius}`}
                              dur="4s"
                              repeatCount="indefinite"
                              begin={`${index * 0.5}s`}
                            />
                          </circle>
                        );
                      })}

                      {/* Air Quality Data Points */}
                      {data.map((city, index) => {
                        const x = ((city.coordinates.lng + 180) / 360) * 1000;
                        const y = ((90 - city.coordinates.lat) / 180) * 500;
                        const pulseDelay = index * 0.3;

                        return (
                          <g key={`city-marker-${city.id}`}>
                            <circle
                              cx={x}
                              cy={y}
                              r="8"
                              fill="none"
                              stroke={
                                city.aqi <= 50
                                  ? "#10b981"
                                  : city.aqi <= 100
                                  ? "#f59e0b"
                                  : "#ef4444"
                              }
                              strokeWidth="1"
                              opacity="0.6"
                            >
                              <animate
                                attributeName="r"
                                values="8;16;8"
                                dur="3s"
                                repeatCount="indefinite"
                                begin={`${pulseDelay}s`}
                              />
                              <animate
                                attributeName="opacity"
                                values="0.6;0.1;0.6"
                                dur="3s"
                                repeatCount="indefinite"
                                begin={`${pulseDelay}s`}
                              />
                            </circle>

                            <circle
                              cx={x}
                              cy={y}
                              r="12"
                              fill={
                                city.aqi <= 50
                                  ? "#10b981"
                                  : city.aqi <= 100
                                  ? "#f59e0b"
                                  : "#ef4444"
                              }
                              stroke="white"
                              strokeWidth="2"
                              className="cursor-pointer transition-all duration-200 hover:r-8"
                              filter="url(#dropShadow)"
                              onClick={() => handleCitySelect(city.id)}
                            >
                              <animate
                                attributeName="r"
                                values="10;12;10"
                                dur="2s"
                                repeatCount="indefinite"
                                begin={`${pulseDelay * 0.5}s`}
                              />
                            </circle>

                            <g className="opacity-0 hover:opacity-100 transition-opacity duration-200">
                              <rect
                                x={x - 30}
                                y={y - 35}
                                width="60"
                                height="26"
                                rx="3"
                                fill="rgba(0,0,0,0.8)"
                              />
                              <text
                                x={x}
                                y={y - 25}
                                textAnchor="middle"
                                fill="white"
                                fontSize="9"
                                fontWeight="600"
                              >
                                {city.city}
                              </text>
                              <text
                                x={x}
                                y={y - 15}
                                textAnchor="middle"
                                fill="white"
                                fontSize="8"
                              >
                                AQI {city.aqi}
                              </text>
                            </g>

                            <text
                              x={x}
                              y={y + 3}
                              textAnchor="middle"
                              fill="white"
                              fontSize="8"
                              fontWeight="700"
                              className="pointer-events-none"
                            >
                              {city.aqi}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            AQI Levels
                          </h4>
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-green-500 rounded-full mr-2 shadow-sm"></div>
                              <span className="text-gray-600">Good (0-50)</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2 shadow-sm"></div>
                              <span className="text-gray-600">
                                Moderate (51-100)
                              </span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-red-500 rounded-full mr-2 shadow-sm"></div>
                              <span className="text-gray-600">
                                Unhealthy(101+)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4" />
                        <span>Live updates every 30s</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-base sm:text-lg font-bold text-green-700">
                        {data.filter((city) => city.aqi <= 50).length}
                      </div>
                      <div className="text-xs text-green-600">Good Quality</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="text-base sm:text-lg font-bold text-yellow-700">
                        {
                          data.filter(
                            (city) => city.aqi > 50 && city.aqi <= 100
                          ).length
                        }
                      </div>
                      <div className="text-xs text-yellow-600">Moderate</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-base sm:text-lg font-bold text-red-700">
                        {data.filter((city) => city.aqi > 100).length}
                      </div>
                      <div className="text-xs text-red-600">Unhealthy</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-base sm:text-lg font-bold text-blue-700">
                        {Math.round(
                          data.reduce((sum, city) => sum + city.aqi, 0) /
                            data.length
                        )}
                      </div>
                      <div className="text-xs text-blue-600">Global Avg</div>
                    </div>
                  </div>
                </div>
                )}
              </div>

              {/* Compare City */}
              {isCompareMode && (
                <div className="space-y-4 sm:space-y-6 flex flex-col ">
                  {!compareCityData ? (
                    <div
                      ref={compareSectionRef}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center flex-1 flex flex-col justify-center"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Select a City to Compare
                      </h3>
                      <div className="space-y-2">
                        {filteredData
                          .filter((city) => city.id !== selectedCity)
                          .slice(0, 5)
                          .map((city) => (
                            <button
                              key={city.id}
                              className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                              onClick={() => handleCompareSelect(city.id)}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-sm sm:text-base">
                                  {city.city}, {city.country}
                                </span>
                                <span
                                  className={`px-2 py-1 text-sm rounded ${getAQIColor(
                                    city.aqi
                                  )}`}
                                >
                                  {city.aqi}
                                </span>
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                          <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                              {compareCityData.city}
                            </h2>
                            <p className="text-gray-500">
                              {compareCityData.country}
                            </p>
                          </div>
                          <div
                            className={`px-3 sm:px-4 py-2 rounded-full text-base sm:text-lg font-semibold border-2 w-fit ${getAQIColor(
                              compareCityData.aqi
                            )}`}
                          >
                            AQI {compareCityData.aqi}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                          <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                            <div className="text-xl sm:text-2xl font-bold text-gray-900">
                              {compareCityData.pm25}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">
                              PM2.5 μg/m³
                            </div>
                          </div>
                          <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                            <div className="text-xl sm:text-2xl font-bold text-gray-900">
                              {compareCityData.pm10}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">
                              PM10 μg/m³
                            </div>
                          </div>
                          <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg col-span-2 sm:col-span-1">
                            <div className="text-xl sm:text-2xl font-bold text-gray-900">
                              {compareCityData.o3}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">
                              O₃ μg/m³
                            </div>
                          </div>
                        </div>

                        <div
                          className={`p-3 sm:p-4 rounded-lg border-l-4 ${
                            compareCityData.status === "Good"
                              ? "bg-green-50 border-green-500"
                              : compareCityData.status === "Moderate"
                              ? "bg-yellow-50 border-yellow-500"
                              : "bg-red-50 border-red-500"
                          }`}
                        >
                          <div className="flex items-center">
                            {compareCityData.status === "Good" ? (
                              <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2" />
                            ) : compareCityData.status === "Moderate" ? (
                              <InformationCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mr-2" />
                            ) : (
                              <ExclamationTriangleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mr-2" />
                            )}
                            <span className="font-semibold text-sm sm:text-base">
                              {compareCityData.status}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm mt-1 text-gray-600">
                            {compareCityData.status === "Good" &&
                              "Air quality is satisfactory for most people. Great for outdoor activities."}
                            {compareCityData.status === "Moderate" &&
                              "Air quality is acceptable for most people. Sensitive individuals may experience minor issues."}

                            {compareCityData.status === "Unhealthy" &&
                              "Sensitive groups may experience health effects. General public less likely to be affected."}
                            {compareCityData.status === "Very Unhealthy" &&
                              "Health warnings of emergency conditions. Everyone may experience serious health effects."}
                            {compareCityData.status === "Hazardous" &&
                              "Health alert: everyone may experience serious health effects. Avoid outdoor activities."}
                          </p>
                        </div>
                      </div>

                      <div className="flex-1">
                        <TrendChart
                          data={compareCityData.trend}
                          title={`${compareCityData.city} - 24 Hour PM2.5 Trend`}
                          color="#10B981"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg border transform transition-all duration-300 min-w-48 sm:min-w-64 ${
              toast.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : toast.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : toast.type === "warning"
                ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                : "bg-blue-50 border-blue-200 text-blue-800"
            }`}
            style={{ animation: "slideIn 0.3s ease-out" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium">
                {toast.message}
              </span>
              <button
                className="ml-2 sm:ml-3 text-current opacity-60 hover:opacity-100 cursor-pointer"
                onClick={() => removeToast(toast.id)}
              >
                <XMarkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
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
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
      <footer className="text-center text-sm text-gray-500 py-4 border-t border-gray-200">
        © 2025 AirWatch Pro. All rights reserved.
      </footer>
    </div>
  );
};

export default AirWatch;
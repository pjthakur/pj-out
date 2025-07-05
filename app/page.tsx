"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChevronLeft,
  FaChevronRight,
  FaBed,
  FaChartLine,
  FaLeaf,
  FaCoffee,
  FaDumbbell,
  FaThermometerHalf,
  FaMoon,
  FaSun,
  FaCalendarAlt,
  FaBrain,
  FaChartBar,
  FaPlus,
  FaClock,
  FaDownload,
} from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
  BarProps
} from 'recharts';
const SleepAnalyzer = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [previousSlide, setPreviousSlide] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('2025-06');
  const [timeRange, setTimeRange] = useState([22, 7]);
  const [isMobile, setIsMobile] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [showAddDataModal, setShowAddDataModal] = useState(false);
  const [bedtimeSlider, setBedtimeSlider] = useState(22);
  const [waketimeSlider, setWaketimeSlider] = useState(7);
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [manualSleepData, setManualSleepData] = useState<{ [key: string]: any }>({
    '2025-06-01': {
      selectedDate: '2025-06-01',
      bedtime: '22:15',
      wakeTime: '06:45',
      quality: 85, 
      deepSleep: 2.3,
      lightSleep: 4.7,
      remSleep: 1.6,
      totalSleep: 8.6,
      environmental: { caffeine: 1, exercise: 45, temperature: 22 }
    },
    '2025-06-02': {
      selectedDate: '2025-06-02',
      bedtime: '22:45',
      wakeTime: '07:15',
      quality: 78, 
      deepSleep: 2.1,
      lightSleep: 4.9,
      remSleep: 1.5,
      totalSleep: 8.5,
      environmental: { caffeine: 2, exercise: 30, temperature: 23 }
    },
    '2025-06-03': {
      selectedDate: '2025-06-03',
      bedtime: '23:00',
      wakeTime: '07:30',
      quality: 79,
      deepSleep: 1.9,
      lightSleep: 5.1,
      remSleep: 1.5,
      totalSleep: 8.5,
      environmental: { caffeine: 2, exercise: 25, temperature: 24 }
    },
    '2025-06-04': {
      selectedDate: '2025-06-04',
      bedtime: '22:30',
      wakeTime: '07:00',
      quality: 85,
      deepSleep: 2.2,
      lightSleep: 4.8,
      remSleep: 1.5,
      totalSleep: 8.5,
      environmental: { caffeine: 1, exercise: 40, temperature: 22 }
    },
    '2025-06-05': {
      selectedDate: '2025-06-05',
      bedtime: '22:20',
      wakeTime: '06:50',
      quality: 90,
      deepSleep: 2.5,
      lightSleep: 4.5,
      remSleep: 1.7,
      totalSleep: 8.7,
      environmental: { caffeine: 1, exercise: 55, temperature: 21 }
    },
    '2025-06-06': {
      selectedDate: '2025-06-06',
      bedtime: '23:15',
      wakeTime: '07:45',
      quality: 76,
      deepSleep: 1.8,
      lightSleep: 5.2,
      remSleep: 1.5,
      totalSleep: 8.5,
      environmental: { caffeine: 3, exercise: 20, temperature: 25 }
    },
    '2025-06-07': {
      selectedDate: '2025-06-07',
      bedtime: '23:30',
      wakeTime: '08:00',
      quality: 74,
      deepSleep: 1.7,
      lightSleep: 5.3,
      remSleep: 1.5,
      totalSleep: 8.5,
      environmental: { caffeine: 2, exercise: 15, temperature: 25 }
    },
    '2025-06-08': {
      selectedDate: '2025-06-08',
      bedtime: '22:00',
      wakeTime: '06:30',
      quality: 92,
      deepSleep: 2.6,
      lightSleep: 4.4,
      remSleep: 1.8,
      totalSleep: 8.8,
      environmental: { caffeine: 1, exercise: 60, temperature: 20 }
    },
    '2025-06-09': {
      selectedDate: '2025-06-09',
      bedtime: '22:40',
      wakeTime: '07:10',
      quality: 84,
      deepSleep: 2.2,
      lightSleep: 4.8,
      remSleep: 1.5,
      totalSleep: 8.5,
      environmental: { caffeine: 1, exercise: 35, temperature: 22 }
    },
    '2025-06-10': {
      selectedDate: '2025-06-10',
      bedtime: '22:50',
      wakeTime: '07:20',
      quality: 81,
      deepSleep: 2.0,
      lightSleep: 5.0,
      remSleep: 1.5,
      totalSleep: 8.5,
      environmental: { caffeine: 2, exercise: 30, temperature: 23 }
    },
    '2025-06-11': {
      selectedDate: '2025-06-11',
      bedtime: '22:25',
      wakeTime: '06:55',
      quality: 87,
      deepSleep: 2.3,
      lightSleep: 4.7,
      remSleep: 1.6,
      totalSleep: 8.6,
      environmental: { caffeine: 1, exercise: 45, temperature: 21 }
    },
    '2025-06-12': {
      selectedDate: '2025-06-12',
      bedtime: '22:35',
      wakeTime: '07:05',
      quality: 83,
      deepSleep: 2.1,
      lightSleep: 4.9,
      remSleep: 1.5,
      totalSleep: 8.5,
      environmental: { caffeine: 1, exercise: 40, temperature: 22 }
    },
    '2025-06-13': {
      selectedDate: '2025-06-13',
      bedtime: '23:00',
      wakeTime: '07:30',
      quality: 78,
      deepSleep: 1.9,
      lightSleep: 5.1,
      remSleep: 1.5,
      totalSleep: 8.5,
      environmental: { caffeine: 2, exercise: 25, temperature: 24 }
    },
    '2025-06-14': {
      selectedDate: '2025-06-14',
      bedtime: '23:45',
      wakeTime: '08:15',
      quality: 72,
      deepSleep: 1.6,
      lightSleep: 5.4,
      remSleep: 1.5,
      totalSleep: 8.5,
      environmental: { caffeine: 3, exercise: 10, temperature: 26 }
    },
    '2025-06-15': {
      selectedDate: '2025-06-15',
      bedtime: '22:10',
      wakeTime: '06:40',
      quality: 89,
      deepSleep: 2.4,
      lightSleep: 4.6,
      remSleep: 1.7,
      totalSleep: 8.7,
      environmental: { caffeine: 1, exercise: 50, temperature: 20 }
    }
  });
  useEffect(() => {
    if (showAddDataModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddDataModal]);
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ show: true, message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };
  const exportTimelineData = () => {
    const monthName = new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const exportData = {
      month: monthName,
      selectedMonth,
      sleepData: generateMonthlySleepData,
      monthlyStats,
      exportDate: new Date().toISOString(),
      dataType: 'timeline'
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `sleep-timeline-${selectedMonth}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showToast(`Timeline data exported for ${monthName}`, 'success');
  };
  const exportQualityData = () => {
    const monthName = new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const exportData = {
      month: monthName,
      selectedMonth,
      radarData,
      monthlyStats,
      sleepPhases: (() => {
        if (!generateMonthlySleepData.length) return [];
        const avgDeepSleep = generateMonthlySleepData.reduce((sum, day) => sum + day.deep, 0) / generateMonthlySleepData.length;
        const avgLightSleep = generateMonthlySleepData.reduce((sum, day) => sum + day.light, 0) / generateMonthlySleepData.length;
        const avgRemSleep = generateMonthlySleepData.reduce((sum, day) => sum + day.rem, 0) / generateMonthlySleepData.length;
        const totalAvg = avgDeepSleep + avgLightSleep + avgRemSleep;
        return [
          { phase: 'Deep Sleep', duration: avgDeepSleep, percentage: totalAvg > 0 ? (avgDeepSleep / totalAvg) * 100 : 0 },
          { phase: 'Light Sleep', duration: avgLightSleep, percentage: totalAvg > 0 ? (avgLightSleep / totalAvg) * 100 : 0 },
          { phase: 'REM Sleep', duration: avgRemSleep, percentage: totalAvg > 0 ? (avgRemSleep / totalAvg) * 100 : 0 }
        ];
      })(),
      exportDate: new Date().toISOString(),
      dataType: 'quality'
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `sleep-quality-${selectedMonth}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showToast(`Quality data exported for ${monthName}`, 'success');
  };
  const exportEnvironmentalData = () => {
    const monthName = new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const [year, month] = selectedMonth.split('-').map(Number);
    const monthlyEnvData = [];
    for (let day = 1; day <= new Date(year, month, 0).getDate(); day++) {
      const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayData = manualSleepData[dateString];
      if (dayData && dayData.environmental) {
        monthlyEnvData.push({
          date: dateString,
          ...dayData.environmental,
          quality: dayData.quality,
          totalSleep: dayData.totalSleep
        });
      }
    }
    const exportData = {
      month: monthName,
      selectedMonth,
      correlationData,
      environmentalFactors: monthlyEnvData,
      averages: monthlyEnvData.length > 0 ? {
        caffeine: monthlyEnvData.reduce((sum, env) => sum + env.caffeine, 0) / monthlyEnvData.length,
        exercise: monthlyEnvData.reduce((sum, env) => sum + env.exercise, 0) / monthlyEnvData.length,
        temperature: monthlyEnvData.reduce((sum, env) => sum + env.temperature, 0) / monthlyEnvData.length
      } : null,
      exportDate: new Date().toISOString(),
      dataType: 'environmental'
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `sleep-environmental-${selectedMonth}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showToast(`Environmental data exported for ${monthName}`, 'success');
  };
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMonthPicker && !(event.target as Element).closest('.month-picker-container')) {
        setShowMonthPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMonthPicker]);
  const generateMonthlySleepData = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const data: Array<{
      date: string;
      day: number;
      dayName: string;
      duration: number;
      deep: number;
      light: number;
      rem: number;
      quality: number;
      bedtime: number;
      wakeup: number;
    }> = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const date = new Date(year, month - 1, day);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const sleepData = manualSleepData[dateString];
      if (sleepData) {
        data.push({
          date: dateString,
          day: day,
          dayName: dayName,
          duration: sleepData.totalSleep,
          deep: sleepData.deepSleep,
          light: sleepData.lightSleep,
          rem: sleepData.remSleep,
          quality: sleepData.quality,
          bedtime: sleepData.bedtime,
          wakeup: sleepData.wakeTime
        });
      } else {
        data.push({
          date: dateString,
          day: day,
          dayName: dayName,
          duration: 0,
          deep: 0,
          light: 0,
          rem: 0,
          quality: 0,
          bedtime: 0,
          wakeup: 0
        });
      }
    }
    return data;
  }, [selectedMonth, manualSleepData]);
  const monthlyStats = useMemo(() => {
    if (!generateMonthlySleepData.length) return null;
    const daysWithData = generateMonthlySleepData.filter(day => day.duration > 0);
    if (!daysWithData.length) return null;
    const avgDuration = daysWithData.reduce((sum, day) => sum + day.duration, 0) / daysWithData.length;
    const avgQuality = daysWithData.reduce((sum, day) => sum + day.quality, 0) / daysWithData.length;
    const bestNight = daysWithData.reduce((best, day) => day.quality > best.quality ? day : best);
    const totalSleep = daysWithData.reduce((sum, day) => sum + day.duration, 0);
    return {
      avgDuration: Number(avgDuration.toFixed(1)),
      avgQuality: Math.round(avgQuality),
      bestNight,
      totalSleep: Number(totalSleep.toFixed(1)),
      consistency: Math.round(100 - (Math.max(...daysWithData.map(d => d.duration)) - Math.min(...daysWithData.map(d => d.duration))) * 10),
      daysTracked: daysWithData.length
    };
  }, [generateMonthlySleepData]);
  const radarData = useMemo(() => {
    const daysWithData = generateMonthlySleepData.filter(day => day.duration > 0);
    if (!daysWithData.length) {
      return [
        { subject: 'Deep Sleep', A: 0, fullMark: 100 },
        { subject: 'Light Sleep', A: 0, fullMark: 100 },
        { subject: 'REM Sleep', A: 0, fullMark: 100 },
        { subject: 'Sleep Efficiency', A: 0, fullMark: 100 },
        { subject: 'Recovery Rate', A: 0, fullMark: 100 },
        { subject: 'Sleep Latency', A: 0, fullMark: 100 }
      ];
    }
    const avgDeepSleep = daysWithData.reduce((sum, day) => sum + day.deep, 0) / daysWithData.length;
    const avgLightSleep = daysWithData.reduce((sum, day) => sum + day.light, 0) / daysWithData.length;
    const avgRemSleep = daysWithData.reduce((sum, day) => sum + day.rem, 0) / daysWithData.length;
    const avgTotalSleep = daysWithData.reduce((sum, day) => sum + day.duration, 0) / daysWithData.length;
    return [
      { subject: 'Deep Sleep', A: Math.round((avgDeepSleep / avgTotalSleep) * 100), fullMark: 100 },
      { subject: 'Light Sleep', A: Math.round((avgLightSleep / avgTotalSleep) * 100), fullMark: 100 },
      { subject: 'REM Sleep', A: Math.round((avgRemSleep / avgTotalSleep) * 100), fullMark: 100 },
      { subject: 'Sleep Efficiency', A: monthlyStats?.avgQuality || 0, fullMark: 100 },
      { subject: 'Recovery Rate', A: monthlyStats?.consistency || 0, fullMark: 100 },
      { subject: 'Sleep Latency', A: avgTotalSleep >= 7 ? 85 : Math.round(avgTotalSleep * 12), fullMark: 100 }
    ];
  }, [generateMonthlySleepData, monthlyStats]);
  const correlationData = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const monthlyEnvData = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayData = manualSleepData[dateString];
      if (dayData && dayData.environmental) {
        monthlyEnvData.push([
          { x: dayData.environmental.caffeine, y: dayData.quality, z: dayData.totalSleep, factor: 'Caffeine (cups)', value: dayData.environmental.caffeine, date: dateString },
          { x: dayData.environmental.exercise, y: dayData.quality, z: dayData.totalSleep, factor: 'Exercise (min)', value: dayData.environmental.exercise, date: dateString },
          { x: dayData.environmental.temperature, y: dayData.quality, z: dayData.totalSleep, factor: 'Temperature (°C)', value: dayData.environmental.temperature, date: dateString }
        ]);
      }
    }
    return monthlyEnvData.flat();
  }, [manualSleepData, selectedMonth]);
  const fadeAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };
  const nextSlide = () => {
    setPreviousSlide(currentSlide);
    setCurrentSlide((prev) => (prev + 1) % 3);
  };
  const prevSlide = () => {
    setPreviousSlide(currentSlide);
    setCurrentSlide((prev) => (prev - 1 + 3) % 3);
  };
  const changeMonth = (direction: number) => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const newDate = new Date(year, month - 1 + direction, 1);
    const newMonth = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const newYear = newDate.getFullYear();
    const newMonthNumber = newDate.getMonth() + 1;
    const wouldBeFuture = newYear > currentYear || (newYear === currentYear && newMonthNumber > currentMonth);
    if (!wouldBeFuture) {
      setSelectedMonth(newMonth);
    }
  };
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900/95 backdrop-blur-md p-4 rounded-xl border border-purple-500/30 shadow-2xl max-w-xs">
          <p className="text-white font-medium mb-2 text-sm">{`${data.dayName}, ${label}`}</p>
          <p className="text-purple-300 text-xs mb-1">Total: {data.duration}h</p>
          <p className="text-purple-400 text-xs mb-1">Quality: {data.quality}%</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs mb-1" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}h`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  const TimelineSlide = () => {
    return (
      <motion.div
        initial={fadeAnimation.initial}
        animate={fadeAnimation.animate}
        exit={fadeAnimation.exit}
        transition={{ duration: 0.3 }}
        className="w-full h-full flex flex-col overflow-hidden"
      >
      <div className="flex-1 bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-700/50 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700/30">
                      <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-3 border border-gray-600/50 flex items-center space-x-3">
            <FaCalendarAlt className="text-purple-400" />
            <div className="flex items-center space-x-2">
              <button
                onClick={() => changeMonth(-1)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <FaChevronLeft className="text-sm" />
              </button>
              <div className="relative month-picker-container" style={{ zIndex: 999999 }}>
                <button
                  onClick={() => setShowMonthPicker(!showMonthPicker)}
                  className="bg-transparent text-white text-sm cursor-pointer min-w-24 hover:text-purple-300 transition-colors flex items-center justify-center space-x-1"
                >
                  <span>{new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </button>
                {showMonthPicker && (
                  <div className="absolute top-full left-0 mt-2 bg-gray-800/95 backdrop-blur-md rounded-xl border border-gray-600/50 shadow-2xl p-4 min-w-64" style={{ zIndex: 99999999 }}>
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => {
                          const currentYear = parseInt(selectedMonth.split('-')[0]);
                          const newYear = currentYear - 1;
                          const currentMonth = selectedMonth.split('-')[1];
                          setSelectedMonth(`${newYear}-${currentMonth}`);
                        }}
                        className="text-gray-400 hover:text-white transition-colors p-1 cursor-pointer"
                      >
                        <FaChevronLeft className="text-sm" />
                      </button>
                      <div className="text-center text-gray-300 text-lg font-medium">
                        {selectedMonth.split('-')[0]}
                      </div>
                      <button
                        onClick={() => {
                          const currentYear = parseInt(selectedMonth.split('-')[0]);
                          const newYear = currentYear + 1;
                          const currentMonth = selectedMonth.split('-')[1];
                          setSelectedMonth(`${newYear}-${currentMonth}`);
                        }}
                        className="text-gray-400 hover:text-white transition-colors p-1 cursor-pointer"
                      >
                        <FaChevronRight className="text-sm" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = String(i + 1).padStart(2, '0');
                        const monthValue = `${selectedMonth.split('-')[0]}-${month}`;
                        const monthName = new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' });
                        const isSelected = selectedMonth === monthValue;
                        const currentDate = new Date();
                        const currentYear = currentDate.getFullYear();
                        const currentMonth = currentDate.getMonth() + 1;
                        const selectedYear = parseInt(selectedMonth.split('-')[0]);
                        const isCurrentYear = selectedYear === currentYear;
                        const isFutureMonth = isCurrentYear && (i + 1) > currentMonth;
                        const isFutureYear = selectedYear > currentYear;
                        const isDisabled = isFutureMonth || isFutureYear;
                        return (
                          <button
                            key={month}
                            onClick={() => {
                              if (!isDisabled) {
                                setSelectedMonth(monthValue);
                                setShowMonthPicker(false);
                              }
                            }}
                            disabled={isDisabled}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              isDisabled 
                                ? 'text-gray-500 cursor-not-allowed opacity-50' 
                                : isSelected
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg cursor-pointer'
                                : 'text-gray-300 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm cursor-pointer'
                            }`}
                          >
                            {monthName}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-between mt-4 pt-3 border-t border-gray-700/50">
                      <button
                        onClick={() => setShowMonthPicker(false)}
                        className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          const currentDate = new Date();
                          const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
                          setSelectedMonth(currentMonth);
                          setShowMonthPicker(false);
                        }}
                        className="text-purple-400 hover:text-purple-300 text-sm transition-colors cursor-pointer"
                      >
                        This month
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => changeMonth(1)}
                className={`transition-colors ${(() => {
                  const [year, month] = selectedMonth.split('-').map(Number);
                  const nextDate = new Date(year, month, 1); 
                  const currentDate = new Date();
                  const currentYear = currentDate.getFullYear();
                  const currentMonth = currentDate.getMonth() + 1;
                  const nextYear = nextDate.getFullYear();
                  const nextMonthNumber = nextDate.getMonth() + 1;
                  const wouldBeFuture = nextYear > currentYear || (nextYear === currentYear && nextMonthNumber > currentMonth);
                  return wouldBeFuture 
                    ? 'text-gray-600 cursor-not-allowed opacity-50' 
                    : 'text-gray-400 hover:text-white cursor-pointer';
                })()}`}
              >
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={exportTimelineData}
              className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-3 border border-gray-600/50 flex items-center space-x-3 hover:bg-gray-600/50 hover:text-white transition-all duration-300 cursor-pointer"
              title="Export Timeline Data"
            >
              <FaDownload className="text-purple-400" />
              <span className="text-white text-sm font-medium">Export</span>
            </button>
          <button
            onClick={() => setShowAddDataModal(true)}
              className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            title="Add Sleep Data"
          >
            <FaPlus className="text-sm" />
            <span className="text-sm font-medium">Add Data</span>
          </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden flex">
          <div className="w-80 flex-shrink-0 p-6 pb-4 bg-gray-800/40 rounded-xl shadow-lg h-full max-h-full overflow-y-auto scrollbar-hide flex flex-col hide-scrollbar">
                          <div className="flex-1 min-h-0 flex flex-col gap-y-8.5">
              <div className="bg-gray-700/20 rounded-xl p-4 space-y-4 mb-2.5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
                  <FaBed className="mr-2 text-purple-400" /> Sleep Schedule
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-xs flex items-center">
                      <FaMoon className="mr-1 text-indigo-400 text-sm" /> Bedtime
                    </span>
                    <div className="text-right">
                      <span className="text-white font-bold text-base">
                        {bedtimeSlider > 12 ? `${bedtimeSlider - 12}:00 PM` : bedtimeSlider === 12 ? '12:00 PM' : bedtimeSlider === 0 ? '12:00 AM' : `${bedtimeSlider}:00 AM`}
                      </span>
                      <div className="text-xs text-gray-300 leading-none">
                        {bedtimeSlider <= 21 ? "Early" : bedtimeSlider <= 23 ? "Evening" : "Late"}
                      </div>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="26"
                    value={bedtimeSlider}
                    onChange={(e) => setBedtimeSlider(parseInt(e.target.value))}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseMove={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                    className="w-full h-2 bg-gray-600/50 rounded-lg appearance-none cursor-pointer touch-slider mb-1"
                    style={{
                      background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${((bedtimeSlider - 20) / 6) * 100}%, #4B5563 ${((bedtimeSlider - 20) / 6) * 100}%, #4B5563 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-300 leading-none">
                    <span>8PM</span>
                    <span>10PM</span>
                    <span>12AM</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-xs flex items-center">
                      <FaSun className="mr-1 text-yellow-400 text-sm" /> Wake Time
                    </span>
                    <div className="text-right">
                      <span className="text-white font-bold text-base">
                        {waketimeSlider > 12 ? `${waketimeSlider - 12}:00 PM` : waketimeSlider === 12 ? '12:00 PM' : waketimeSlider === 0 ? '12:00 AM' : `${waketimeSlider}:00 AM`}
                      </span>
                      <div className="text-xs text-gray-300 leading-none">
                        {waketimeSlider <= 6 ? "Early Bird" : waketimeSlider <= 8 ? "Normal" : "Late"}
                      </div>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="11"
                    value={waketimeSlider}
                    onChange={(e) => setWaketimeSlider(parseInt(e.target.value))}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseMove={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                    className="w-full h-2 bg-gray-600/50 rounded-lg appearance-none cursor-pointer touch-slider mb-1"
                    style={{
                      background: `linear-gradient(to right, #F59E0B 0%, #F59E0B ${((waketimeSlider - 5) / 6) * 100}%, #4B5563 ${((waketimeSlider - 5) / 6) * 100}%, #4B5563 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-300 leading-none">
                    <span>5AM</span>
                    <span>7AM</span>
                    <span>11AM</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FaClock className="text-purple-400 text-sm" />
                      <span className="text-purple-300 text-xs">Sleep Duration</span>
                    </div>
                    <div className="text-white font-bold text-lg">
                      {(() => {
                        let duration = waketimeSlider - bedtimeSlider;
                        if (duration <= 0) duration += 24;
                        return `${duration}h`;
                      })()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="pb-4">
                <h4 className="text-md font-bold text-gray-200 mb-3">Monthly Summary</h4>
                {isFutureMonth ? (
                  <div className="bg-gray-700/30 rounded-xl p-5 text-center shadow-sm">
                    <div className="text-gray-300 text-sm">No data available for this month</div>
                  </div>
                ) : monthlyStats ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/30 rounded-xl p-5 text-center shadow-sm">
                      <div className="text-white font-semibold text-base">{monthlyStats.totalSleep}h</div>
                      <div className="text-gray-300 text-xs leading-none">Total Sleep</div>
                    </div>
                    <div className="bg-gray-700/30 rounded-xl p-5 text-center shadow-sm">
                      <div className="text-white font-semibold text-base">{monthlyStats.consistency}%</div>
                      <div className="text-gray-300 text-xs leading-none">Consistency</div>
                    </div>
                    <div className="bg-gray-700/30 rounded-xl p-5 text-center shadow-sm">
                      <div className="text-white font-semibold text-base">{monthlyStats.bestNight.day}</div>
                      <div className="text-gray-300 text-xs leading-none">Best Night</div>
                    </div>
                    <div className="bg-gray-700/30 rounded-xl p-5 text-center shadow-sm">
                      <div className="text-white font-semibold text-base">{monthlyStats.daysTracked}</div>
                      <div className="text-gray-300 text-xs leading-none">Days Tracked</div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-700/30 rounded-xl p-5 text-center shadow-sm">
                    <div className="text-gray-300 text-sm">No data available for this month</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0 p-6 pb-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-white text-left">Monthly Sleep Pattern</h4>
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span className="text-gray-300">Deep</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-purple-400 rounded"></div>
                  <span className="text-gray-300">Light</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-purple-300 rounded"></div>
                  <span className="text-gray-300">REM</span>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-gray-700/20 rounded-xl p-6 min-h-0 relative" style={{ zIndex: 1 }}>
              {isFutureMonth ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="text-6xl text-gray-600 mb-4">
                    <FaCalendarAlt />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No Sleep Data Available</h3>
                    <p className="text-gray-300 text-sm max-w-md">
                      This month is in the future. Start tracking your sleep patterns to see your data here.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddDataModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  >
                    Add Sleep Data
                  </button>
                </div>
              ) : generateMonthlySleepData.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="text-6xl text-gray-600 mb-4">
                    <FaBed />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No Sleep Data Yet</h3>
                    <p className="text-gray-300 text-sm max-w-md">
                      Start tracking your sleep patterns for this month to see your analysis here.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddDataModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  >
                    Add Sleep Data
                  </button>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    key={`chart-${selectedMonth}-${Object.keys(manualSleepData).length}-${JSON.stringify(generateMonthlySleepData).slice(0, 50)}`}
                    data={generateMonthlySleepData} 
                    margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                    <XAxis
                      dataKey="day"
                      stroke="#9CA3AF"
                      fontSize={12}
                      height={50}
                      interval={Math.max(0, Math.floor(generateMonthlySleepData.length / 12))}
                      tick={{ fill: '#D1D5DB', fontSize: 12, dy: 10 }}
                      axisLine={{ stroke: '#6B7280', strokeWidth: 1 }}
                      tickLine={{ stroke: '#6B7280', strokeWidth: 1 }}
                      label={{ value: 'Day of Month', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#9CA3AF', fontSize: 11 } }}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={12}
                      tick={{ fill: '#D1D5DB', fontSize: 12 }}
                      axisLine={{ stroke: '#6B7280', strokeWidth: 1 }}
                      tickLine={{ stroke: '#6B7280', strokeWidth: 1 }}
                      label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF', fontSize: 11 } }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="deep" stackId="a" fill="#8B5CF6" name="Deep Sleep" radius={[0, 0, 0, 0]} activeBar={<ActiveBarShape />} />
                    <Bar dataKey="light" stackId="a" fill="#A78BFA" name="Light Sleep" radius={[0, 0, 0, 0]} activeBar={<ActiveBarShape />} />
                    <Bar dataKey="rem" stackId="a" fill="#C084FC" name="REM Sleep" radius={[2, 2, 0, 0]} activeBar={<ActiveBarShape />} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    );
  };
  const RadarSlide = () => {
    return (
      <motion.div
        initial={fadeAnimation.initial}
        animate={fadeAnimation.animate}
        exit={fadeAnimation.exit}
        transition={{ duration: 0.3 }}
        className="w-full h-full flex flex-col overflow-hidden"
      >
      <div className="flex-1 bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-3 border border-gray-600/50 flex items-center space-x-3">
            <FaCalendarAlt className="text-purple-400" />
            <span className="text-white text-sm font-medium">
              {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <button
            onClick={exportQualityData}
            className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-3 border border-gray-600/50 flex items-center space-x-3 hover:bg-gray-600/50 hover:text-white transition-all duration-300 cursor-pointer"
            title="Export Quality Data"
          >
            <FaDownload className="text-purple-400" />
            <span className="text-white text-sm font-medium">Export</span>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-5 shadow text-center flex flex-col items-center justify-between">
            <div className="text-2xl font-bold text-white">{monthlyStats?.avgQuality || 0}</div>
            <div className="text-sm text-gray-300 font-medium mt-2 whitespace-nowrap">Avg Quality</div>
          </div>
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl p-5 shadow text-center flex flex-col items-center justify-between">
            <div className="text-2xl font-bold text-white">{monthlyStats?.avgDuration || 0}h</div>
            <div className="text-sm text-gray-300 font-medium mt-2 whitespace-nowrap">Avg Duration</div>
          </div>
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-5 shadow text-center flex flex-col items-center justify-between">
            <div className="text-2xl font-bold text-white">{monthlyStats?.consistency || 0}%</div>
            <div className="text-sm text-gray-300 font-medium mt-2 whitespace-nowrap">Consistency</div>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 flex-1 min-h-0">
          <div className="flex flex-col min-h-0">
            <h4 className="text-xl font-bold text-white mb-4 text-left">Sleep Quality Analysis</h4>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart 
                  key={`radar-${selectedMonth}-${Object.keys(manualSleepData).length}`}
                  data={radarData} 
                  margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
                >
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#9CA3AF', fontSize: 12, dy: -10 }} 
                    tickFormatter={(value) => value}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: '#9CA3AF', fontSize: 11, dx: 5 }}
                    tickCount={6}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Radar
                    name="Quality"
                    dataKey="A"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex flex-col min-h-0">
            <h4 className="text-xl font-bold text-white mb-4 text-left">Sleep Phases</h4>
            <div className="space-y-3 overflow-y-auto flex-1 scrollbar-hide" style={{ maxHeight: 'calc(100vh - 320px)' }}>
              {(() => {
                if (!generateMonthlySleepData.length) {
                  return [
                    { phase: 'Deep Sleep', duration: '0h', percentage: 0, color: 'bg-purple-500', icon: <FaMoon className="text-indigo-400" />, desc: 'Restorative phase for body and mind.' },
                    { phase: 'Light Sleep', duration: '0h', percentage: 0, color: 'bg-purple-400', icon: <FaBed className="text-purple-400" />, desc: 'Transitional phase, easy to wake.' },
                    { phase: 'REM Sleep', duration: '0h', percentage: 0, color: 'bg-purple-300', icon: <FaBrain className="text-purple-300" />, desc: 'Dream phase, important for memory.' }
                  ];
                }
                const avgDeepSleep = generateMonthlySleepData.reduce((sum, day) => sum + day.deep, 0) / generateMonthlySleepData.length;
                const avgLightSleep = generateMonthlySleepData.reduce((sum, day) => sum + day.light, 0) / generateMonthlySleepData.length;
                const avgRemSleep = generateMonthlySleepData.reduce((sum, day) => sum + day.rem, 0) / generateMonthlySleepData.length;
                const totalAvg = avgDeepSleep + avgLightSleep + avgRemSleep;
                return [
                  {
                    phase: 'Deep Sleep',
                    duration: `${avgDeepSleep.toFixed(1)}h`,
                    percentage: totalAvg > 0 ? Math.round((avgDeepSleep / totalAvg) * 100) : 0,
                    color: 'bg-purple-500',
                    icon: <FaMoon className="text-indigo-400" />,
                    desc: 'Restorative phase for body and mind.'
                  },
                  {
                    phase: 'Light Sleep',
                    duration: `${avgLightSleep.toFixed(1)}h`,
                    percentage: totalAvg > 0 ? Math.round((avgLightSleep / totalAvg) * 100) : 0,
                    color: 'bg-purple-400',
                    icon: <FaBed className="text-purple-400" />,
                    desc: 'Transitional phase, easy to wake.'
                  },
                  {
                    phase: 'REM Sleep',
                    duration: `${avgRemSleep.toFixed(1)}h`,
                    percentage: totalAvg > 0 ? Math.round((avgRemSleep / totalAvg) * 100) : 0,
                    color: 'bg-purple-300',
                    icon: <FaBrain className="text-purple-300" />,
                    desc: 'Dream phase, important for memory.'
                  }
                ];
              })().map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-4 shadow relative cursor-pointer"
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                      hoverTimeoutRef.current = setTimeout(() => {
                        setHoveredPhase(item.phase);
                        setHoverPosition({ x: e.clientX, y: e.clientY });
                      }, 150);
                    }
                  }}
                  onMouseMove={(e) => {
                    if (!isMobile && hoveredPhase === item.phase) {
                      setHoverPosition({ x: e.clientX, y: e.clientY });
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isMobile) {
                      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                      hoverTimeoutRef.current = setTimeout(() => setHoveredPhase(null), 100);
                    }
                  }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-base font-semibold text-white">{item.phase}</span>
                      </div>
                      <span className="text-xs text-gray-300 mt-1">{item.desc}</span>
                    </div>
                    <span className="text-gray-300 font-mono">{item.duration}</span>
                  </div>
                  <div className="w-full bg-gray-600/50 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className={`h-3 rounded-full ${item.color} shadow-lg`}
                    />
                  </div>
                  <div className="text-sm text-gray-300 mt-2 text-right">{item.percentage}%</div>
                </motion.div>
              ))}
              {!isMobile && hoveredPhase && (
                <div
                  className="fixed z-50 pointer-events-none"
                  style={{
                    left: (() => {
                      const tooltipWidth = 280; 
                      const viewportWidth = window.innerWidth;
                      const maxWidth = Math.min(viewportWidth * 0.9, 1200); 
                      const containerLeft = (viewportWidth - maxWidth) / 2; 
                      const containerRight = containerLeft + maxWidth - 100; 
                      let leftPos = hoverPosition.x - tooltipWidth / 2; 
                      if (leftPos < containerLeft + 20) {
                        leftPos = containerLeft + 20; 
                      } 
                      else if (leftPos + tooltipWidth > containerRight - 20) {
                        leftPos = containerRight - tooltipWidth - 20; 
                      }
                      return leftPos;
                    })(),
                    top: (() => {
                      const tooltipHeight = 200; 
                      const viewportHeight = window.innerHeight;
                      const headerHeight = 120; 
                      const footerHeight = 120; 
                      const containerTop = headerHeight; 
                      const containerBottom = viewportHeight - footerHeight; 
                      let topPos = hoverPosition.y - tooltipHeight - 20; 
                      if (topPos < containerTop) {
                        topPos = hoverPosition.y + 20; 
                        if (topPos + tooltipHeight > containerBottom) {
                          topPos = containerBottom - tooltipHeight - 20;
                        }
                      }
                      else if (topPos + tooltipHeight > containerBottom) {
                        topPos = containerBottom - tooltipHeight - 20;
                      }
                      topPos = Math.max(topPos, containerTop + 20);
                      topPos = Math.min(topPos, containerBottom - tooltipHeight - 40);
                      return topPos;
                    })(),
                    width: '280px',
                    maxWidth: '280px'
                  }}
                >
                  <div className="bg-gray-900/95 backdrop-blur-md rounded-xl border border-purple-500/30 shadow-2xl p-4 w-full">
                    <div className="text-white font-semibold text-sm mb-2">{hoveredPhase} Analysis</div>
                    {(() => {
                      const phaseData = (() => {
                        const daysWithData = generateMonthlySleepData.filter(day => day.duration > 0);
                        if (!daysWithData.length) return null;
                        const avgDeep = daysWithData.reduce((sum, day) => sum + day.deep, 0) / daysWithData.length;
                        const avgLight = daysWithData.reduce((sum, day) => sum + day.light, 0) / daysWithData.length;
                        const avgRem = daysWithData.reduce((sum, day) => sum + day.rem, 0) / daysWithData.length;
                        const totalAvg = avgDeep + avgLight + avgRem;
                        switch (hoveredPhase) {
                          case 'Deep Sleep':
                            return {
                              avg: avgDeep,
                              percentage: totalAvg > 0 ? (avgDeep / totalAvg) * 100 : 0,
                              optimal: '15-20%',
                              benefits: 'Physical recovery, memory consolidation, hormone regulation',
                              quality: avgDeep >= 1.5 && avgDeep <= 2.5 ? 'Optimal' : avgDeep < 1.5 ? 'Low' : 'High'
                            };
                          case 'Light Sleep':
                            return {
                              avg: avgLight,
                              percentage: totalAvg > 0 ? (avgLight / totalAvg) * 100 : 0,
                              optimal: '45-55%',
                              benefits: 'Transition between sleep stages, easy arousal',
                              quality: avgLight >= 3.5 && avgLight <= 5.5 ? 'Optimal' : avgLight < 3.5 ? 'Low' : 'High'
                            };
                          case 'REM Sleep':
                            return {
                              avg: avgRem,
                              percentage: totalAvg > 0 ? (avgRem / totalAvg) * 100 : 0,
                              optimal: '20-25%',
                              benefits: 'Memory processing, creativity, emotional regulation',
                              quality: avgRem >= 1.2 && avgRem <= 2.0 ? 'Optimal' : avgRem < 1.2 ? 'Low' : 'High'
                            };
                          default:
                            return null;
                        }
                      })();
                      if (!phaseData) {
                        return (
                          <div className="text-gray-300 text-xs">
                            No data available for analysis
                          </div>
                        );
                      }
                      return (
                        <>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-300 text-xs">Average Duration:</span>
                              <span className="text-purple-300 text-xs font-semibold">{phaseData.avg.toFixed(1)}h</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300 text-xs">Percentage:</span>
                              <span className="text-purple-300 text-xs font-semibold">{phaseData.percentage.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300 text-xs">Optimal Range:</span>
                              <span className="text-purple-300 text-xs font-semibold">{phaseData.optimal}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300 text-xs">Quality:</span>
                              <span className={`text-xs font-semibold ${
                                phaseData.quality === 'Optimal' ? 'text-green-400' : 
                                phaseData.quality === 'Low' ? 'text-red-400' : 'text-yellow-400'
                              }`}>
                                {phaseData.quality}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-700/50">
                            <div className="text-gray-300 text-xs">
                              <strong>Benefits:</strong> {phaseData.benefits}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    );
  };
  const CorrelationSlide = () => {
    return (
      <motion.div
        initial={fadeAnimation.initial}
        animate={fadeAnimation.animate}
        exit={fadeAnimation.exit}
        transition={{ duration: 0.3 }}
        className="w-full h-full flex flex-col overflow-hidden"
            >
      <div className="flex-1 bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-3 border border-gray-600/50 flex items-center space-x-3">
            <FaCalendarAlt className="text-purple-400" />
            <span className="text-white text-sm font-medium">
              {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <button
            onClick={exportEnvironmentalData}
            className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-3 border border-gray-600/50 flex items-center space-x-3 hover:bg-gray-600/50 hover:text-white transition-all duration-300 cursor-pointer"
            title="Export Environmental Data"
          >
            <FaDownload className="text-purple-400" />
            <span className="text-white text-sm font-medium">Export</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {(() => {
              const [year, month] = selectedMonth.split('-').map(Number);
              const monthlyEnvData = [];
              for (let day = 1; day <= new Date(year, month, 0).getDate(); day++) {
                const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayData = manualSleepData[dateString];
                if (dayData && dayData.environmental) {
                  monthlyEnvData.push(dayData.environmental);
                }
              }
              if (!monthlyEnvData.length) {
              return [
                {
                  icon: FaCoffee,
                  label: 'Caffeine',
                  value: 'No data',
                  impact: 'Add data',
                  color: 'text-amber-300',
                  bgColor: 'bg-gray-700/20',
                  borderColor: 'border-gray-500/15',
                  impactColor: 'text-gray-300',
                },
                {
                  icon: FaDumbbell,
                  label: 'Exercise',
                  value: 'No data',
                  impact: 'Add data',
                  color: 'text-emerald-300',
                  bgColor: 'bg-gray-700/20',
                  borderColor: 'border-gray-500/15',
                  impactColor: 'text-gray-300',
                },
                {
                  icon: FaThermometerHalf,
                  label: 'Temperature',
                  value: 'No data',
                  impact: 'Add data',
                  color: 'text-sky-300',
                  bgColor: 'bg-gray-700/20',
                  borderColor: 'border-gray-500/15',
                  impactColor: 'text-gray-300',
                }
              ];
            }
              const avgCaffeine = monthlyEnvData.reduce((sum, env) => sum + env.caffeine, 0) / monthlyEnvData.length;
              const avgExercise = monthlyEnvData.reduce((sum, env) => sum + env.exercise, 0) / monthlyEnvData.length;
              const avgTemperature = monthlyEnvData.reduce((sum, env) => sum + env.temperature, 0) / monthlyEnvData.length;
            return [
              {
                icon: FaCoffee,
                label: 'Caffeine',
                value: `${avgCaffeine.toFixed(1)} cups`,
                impact: avgCaffeine <= 1 ? 'Low' : avgCaffeine <= 2 ? 'Moderate' : 'High',
                color: 'text-orange-300',
                bgColor: 'bg-orange-500/20',
                borderColor: 'border-orange-500/30',
                impactColor: 'text-orange-200',
              },
              {
                icon: FaDumbbell,
                label: 'Exercise',
                value: `${Math.round(avgExercise)} min`,
                impact: avgExercise >= 30 ? 'Positive' : avgExercise >= 15 ? 'Moderate' : 'Low',
                color: 'text-emerald-300',
                bgColor: 'bg-emerald-500/20',
                borderColor: 'border-emerald-500/30',
                impactColor: 'text-emerald-200',
              },
              {
                icon: FaThermometerHalf,
                label: 'Temperature',
                value: `${Math.round(avgTemperature)}°C`,
                impact: avgTemperature >= 20 && avgTemperature <= 22 ? 'Optimal' : 'Suboptimal',
                color: 'text-sky-300',
                bgColor: 'bg-sky-500/20',
                borderColor: 'border-sky-500/30',
                impactColor: 'text-sky-200',
              }
            ];
          })().map((factor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${index === 0 ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20' : index === 1 ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20' : 'bg-gradient-to-r from-sky-500/20 to-cyan-500/20'} rounded-2xl p-5 shadow text-center flex flex-col items-center`}
            >
              <factor.icon className={`text-3xl mx-auto mb-3 ${factor.color}`} />
              <div className="text-2xl font-bold text-white">{factor.value}</div>
              <div className="text-sm text-gray-300 font-medium mt-1">{factor.label}</div>
            </motion.div>
          ))}
        </div>
        <div className="flex-1 bg-gray-700/20 rounded-xl p-6 min-h-0 flex flex-col">
          <h4 className="text-base font-medium text-gray-300 mb-4 text-left">Sleep Quality vs Environmental Factors</h4>
          <div className="flex-1 min-h-0">
            {correlationData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="text-5xl text-gray-500">
                  <FaLeaf />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">No Environmental Data</h3>
                  <p className="text-gray-300 text-sm max-w-md">
                    No environmental factors data available for {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}. Add sleep data with environmental factors to see correlations.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddDataModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  Add Sleep Data
                </button>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart 
                  key={`scatter-${selectedMonth}-${Object.keys(manualSleepData).length}`}
                  data={correlationData} 
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Factor Value"
                    stroke="#9CA3AF"
                    fontSize={12}
                    label={{ value: 'Factor Value', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#9CA3AF', fontSize: 11 } }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Sleep Quality"
                    stroke="#9CA3AF"
                    fontSize={12}
                    label={{ value: 'Sleep Quality (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF', fontSize: 11 } }}
                  />
                  <ZAxis type="number" dataKey="z" range={[50, 200]} />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-gray-900/95 backdrop-blur-md p-3 rounded-xl border border-purple-500/30 shadow-2xl max-w-xs">
                            <p className="text-white font-medium text-sm">{data.factor}</p>
                            {data.date && <p className="text-gray-300 text-xs">Date: {new Date(data.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>}
                            <p className="text-gray-300 text-xs">Value: {data.value}</p>
                            <p className="text-gray-300 text-xs">Quality: {data.y}%</p>
                            <p className="text-gray-300 text-xs">Duration: {data.z}h</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter dataKey="y" fill="#8B5CF6" />
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </motion.div>
    );
  };
  const slides = [TimelineSlide, RadarSlide, CorrelationSlide];
  const slideInfo = [
    { title: 'Sleep Timeline', subtitle: 'Track your sleep patterns', icon: FaBed },
    { title: 'Sleep Quality', subtitle: 'Analyze your sleep metrics', icon: FaChartLine },
    { title: 'Environmental Factors', subtitle: 'Correlations with sleep quality', icon: FaLeaf }
  ];
  const isFutureMonth = (() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const now = new Date();
    return year > now.getFullYear() || (year === now.getFullYear() && month > now.getMonth() + 1);
  })();
  const hasFutureDates = (() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const now = new Date();
    const selectedDate = new Date(year, month - 1, 1);
    return selectedDate.getFullYear() >= now.getFullYear() &&
      selectedDate.getMonth() >= now.getMonth();
  })();
  function handleTouchStart(e: React.TouchEvent) {
    setDragStartX(e.touches[0].clientX);
    setDragging(true);
  }
  function handleTouchMove(e: React.TouchEvent) {
    if (!dragging || dragStartX === null) return;
    const deltaX = e.touches[0].clientX - dragStartX;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
      setDragging(false);
      setDragStartX(null);
    }
  }
  function handleTouchEnd() {
    setDragging(false);
    setDragStartX(null);
  }
  function handleMouseDown(e: React.MouseEvent) {
    setDragStartX(e.clientX);
    setDragging(true);
  }
  function handleMouseMove(e: React.MouseEvent) {
    if (!dragging || dragStartX === null) return;
    const deltaX = e.clientX - dragStartX;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
      setDragging(false);
      setDragStartX(null);
    }
  }
  function handleMouseUp() {
    setDragging(false);
    setDragStartX(null);
  }
  const calculateSleepQuality = (sleepData: {
    totalSleep: number;
    deepSleep: number;
    lightSleep: number;
    remSleep: number;
    bedtime: string;
    wakeTime: string;
    environmental: {
      caffeine: number;
      exercise: number;
      temperature: number;
    };
  }) => {
    let qualityScore = 0;
    const duration = sleepData.totalSleep;
    if (duration >= 7 && duration <= 9) {
      qualityScore += 30;
    } else if (duration >= 6 && duration < 7) {
      qualityScore += 20;
    } else if (duration >= 5 && duration < 6) {
      qualityScore += 10;
    } else if (duration < 5 || duration > 10) {
      qualityScore += 0;
    } else {
      qualityScore += 15; 
    }
    const deepPercent = (sleepData.deepSleep / duration) * 100;
    const remPercent = (sleepData.remSleep / duration) * 100;
    if (deepPercent >= 15 && deepPercent <= 20) {
      qualityScore += 12;
    } else if (deepPercent >= 10 && deepPercent < 15) {
      qualityScore += 8;
    } else if (deepPercent >= 20 && deepPercent <= 25) {
      qualityScore += 10;
    } else {
      qualityScore += 4;
    }
    if (remPercent >= 20 && remPercent <= 25) {
      qualityScore += 13;
    } else if (remPercent >= 15 && remPercent < 20) {
      qualityScore += 10;
    } else if (remPercent >= 25 && remPercent <= 30) {
      qualityScore += 8;
    } else {
      qualityScore += 4;
    }
    const bedHour = parseInt(sleepData.bedtime.split(':')[0]);
    const wakeHour = parseInt(sleepData.wakeTime.split(':')[0]);
    if (bedHour >= 22 && bedHour <= 23) {
      qualityScore += 10;
    } else if (bedHour >= 21 && bedHour < 22) {
      qualityScore += 8;
    } else if (bedHour >= 20 && bedHour < 21) {
      qualityScore += 6;
    } else {
      qualityScore += 3;
    }
    if (wakeHour >= 6 && wakeHour <= 8) {
      qualityScore += 10;
    } else if (wakeHour >= 5 && wakeHour < 6) {
      qualityScore += 7;
    } else if (wakeHour >= 8 && wakeHour <= 9) {
      qualityScore += 7;
    } else {
      qualityScore += 3;
    }
    if (sleepData.environmental.caffeine <= 1) {
      qualityScore += 5;
    } else if (sleepData.environmental.caffeine <= 2) {
      qualityScore += 3;
    } else {
      qualityScore += 0; 
    }
    if (sleepData.environmental.exercise >= 30) {
      qualityScore += 5;
    } else if (sleepData.environmental.exercise >= 15) {
      qualityScore += 3;
    } else {
      qualityScore += 1;
    }
    if (sleepData.environmental.temperature >= 18 && sleepData.environmental.temperature <= 22) {
      qualityScore += 5;
    } else if (sleepData.environmental.temperature >= 16 && sleepData.environmental.temperature <= 24) {
      qualityScore += 3;
    } else {
      qualityScore += 1;
    }
    const lightPercent = (sleepData.lightSleep / duration) * 100;
    if (lightPercent >= 45 && lightPercent <= 55) {
      qualityScore += 10; 
    } else if (lightPercent >= 40 && lightPercent <= 60) {
      qualityScore += 7;
    } else {
      qualityScore += 3;
    }
    return Math.min(100, Math.round(qualityScore));
  };
  const CustomTimePicker = ({ value, onChange, placeholder }: { value: string; onChange: (time: string) => void; placeholder: string }) => {
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedHour, setSelectedHour] = useState(7);
    const [selectedMinute, setSelectedMinute] = useState(0);
    const [selectedPeriod, setSelectedPeriod] = useState('AM');
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (showTimePicker && !(event.target as Element).closest('.time-picker-container')) {
          setShowTimePicker(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showTimePicker]);
    useEffect(() => {
      if (value) {
        const [time, period] = value.includes('AM') || value.includes('PM') 
          ? [value.slice(0, -3), value.slice(-2)]
          : [value, ''];
        const [hours, minutes] = time.split(':').map(Number);
        if (period) {
          setSelectedHour(hours === 0 ? 12 : hours > 12 ? hours - 12 : hours);
          setSelectedPeriod(period);
        } else {
          if (hours === 0) {
            setSelectedHour(12);
            setSelectedPeriod('AM');
          } else if (hours <= 12) {
            setSelectedHour(hours);
            setSelectedPeriod(hours === 12 ? 'PM' : 'AM');
          } else {
            setSelectedHour(hours - 12);
            setSelectedPeriod('PM');
          }
        }
        setSelectedMinute(minutes);
      }
    }, [value]);
    const handleTimeSelect = () => {
      const formattedTime = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
      onChange(formattedTime);
      setShowTimePicker(false);
    };
    const displayValue = value ? (() => {
      if (value.includes('AM') || value.includes('PM')) return value;
      const [hours, minutes] = value.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return `${String(displayHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
    })() : '';
    return (
      <div className="relative time-picker-container">
        <button
          type="button"
          onClick={() => setShowTimePicker(!showTimePicker)}
          className="w-full px-3 py-2 bg-gray-600/70 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-left flex items-center justify-between cursor-pointer"
        >
          <span className={value ? 'text-white' : 'text-gray-300'}>
            {displayValue || placeholder}
          </span>
          <div className="text-purple-400 text-sm"><FaClock /></div>
        </button>
        {showTimePicker && (
          <div className="fixed inset-x-12 top-1/2 transform -translate-y-1/2 sm:absolute sm:top-full sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:translate-y-0 sm:inset-auto mt-0 sm:mt-2 bg-gray-800/95 backdrop-blur-md rounded-xl border border-gray-600/50 shadow-2xl p-2 sm:p-4 z-[9999] w-auto sm:w-64 max-w-xs sm:max-w-none mx-auto">
            <div className="text-center mb-1.5 sm:mb-4">
              <div className="text-white text-base sm:text-xl font-semibold">
                {String(selectedHour).padStart(2, '0')}:{String(selectedMinute).padStart(2, '0')} {selectedPeriod}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1 sm:gap-3 mb-1.5 sm:mb-4">
              <div className="text-center">
                  <div className="text-gray-300 text-xs font-semibold mb-0.5 sm:mb-2">Hour</div>
                  <div className="h-16 sm:h-32 overflow-y-auto scrollbar-hide bg-gray-700/30 rounded-lg p-1 sm:p-2">
                  {Array.from({ length: 12 }, (_, i) => {
                    const hour = i + 1;
                    const isSelected = selectedHour === hour;
                    return (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => setSelectedHour(hour)}
                        className={`w-full py-0.5 sm:py-1 rounded text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'text-gray-300 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm'
                        }`}
                      >
                        {String(hour).padStart(2, '0')}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-300 text-xs font-semibold mb-0.5 sm:mb-2">Minute</div>
                <div className="h-16 sm:h-32 overflow-y-auto scrollbar-hide bg-gray-700/30 rounded-lg p-1 sm:p-2">
                  {Array.from({ length: 12 }, (_, i) => {
                    const minute = i * 5;
                    const isSelected = selectedMinute === minute;
                    return (
                      <button
                        key={minute}
                        type="button"
                        onClick={() => setSelectedMinute(minute)}
                        className={`w-full py-0.5 sm:py-1 rounded text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'text-gray-300 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm'
                        }`}
                      >
                        {String(minute).padStart(2, '0')}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-300 text-xs font-semibold mb-0.5 sm:mb-2">Period</div>
                <div className="h-16 sm:h-32 bg-gray-700/30 rounded-lg p-1 sm:p-2 flex flex-col justify-center space-y-1 sm:space-y-2">
                  {['AM', 'PM'].map((period) => {
                    const isSelected = selectedPeriod === period;
                    return (
                      <button
                        key={period}
                        type="button"
                        onClick={() => setSelectedPeriod(period)}
                        className={`w-full py-0.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'text-gray-300 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm'
                        }`}
                      >
                        {period}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex justify-between pt-1 sm:pt-2 border-t border-gray-700/50">
              <button
                type="button"
                onClick={() => setShowTimePicker(false)}
                className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors cursor-pointer py-0.5 px-1.5 hover:bg-white/10 hover:backdrop-blur-sm rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTimeSelect}
                className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm transition-colors cursor-pointer py-0.5 px-1.5 hover:bg-purple-500/10 rounded-lg"
              >
                Select
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  const CustomDatePicker = ({ value, onChange, placeholder }: { value: string; onChange: (date: string) => void; placeholder: string }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [showMonthSelector, setShowMonthSelector] = useState(false);
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (showDatePicker && !(event.target as Element).closest('.date-picker-container')) {
          setShowDatePicker(false);
        }
        if (showMonthSelector && !(event.target as Element).closest('.month-selector-container')) {
          setShowMonthSelector(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDatePicker, showMonthSelector]);
    const currentDate = new Date();
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const handleDateSelect = (day: number) => {
      const dateString = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      onChange(dateString);
      setShowDatePicker(false);
    };
    const displayValue = value ? new Date(value + 'T00:00:00').toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }) : '';
    return (
      <div className="relative date-picker-container">
        <button
          type="button"
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="w-full px-3 py-2 bg-gray-600/70 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-left flex items-center justify-between cursor-pointer"
        >
          <span className={value ? 'text-white' : 'text-gray-300'}>
            {displayValue || placeholder}
          </span>
          <FaCalendarAlt className="text-purple-400 text-sm" />
        </button>
                 {showDatePicker && (
          <div className="fixed inset-x-8 top-1/2 transform -translate-y-1/2 sm:absolute sm:top-full sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:translate-y-0 sm:inset-auto mt-0 sm:mt-2 bg-gray-800/95 backdrop-blur-md rounded-xl border border-gray-600/50 shadow-2xl p-3 sm:p-3 z-[9999] w-auto sm:w-72 max-w-xs sm:max-w-none mx-auto">
             <div className="flex items-center justify-center mb-2 sm:mb-4">
               <button
                 type="button"
                 onClick={() => setSelectedYear(selectedYear - 1)}
                 className="text-gray-300 hover:text-white transition-colors p-1 hover:bg-white/10 hover:backdrop-blur-sm rounded-lg cursor-pointer touch-target"
               >
                 <FaChevronLeft className="text-xs" />
               </button>
               <div className="flex flex-col items-center mx-2 sm:mx-6">
                 <div className="text-white text-sm sm:text-lg font-semibold mb-1">{selectedYear}</div>
                 <div className="relative month-selector-container">
                   <button
                     type="button"
                     onClick={() => setShowMonthSelector(!showMonthSelector)}
                       className="bg-gray-700/50 text-white text-xs rounded-lg px-1.5 py-0.5 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer min-w-16 text-center hover:bg-white/10 hover:backdrop-blur-sm transition-all duration-200 flex items-center justify-center space-x-1"
                   >
                     <span>{monthNames[selectedMonth]}</span>
                     <FaChevronLeft className={`text-xs transition-transform duration-200 ${showMonthSelector ? 'rotate-90' : '-rotate-90'}`} />
                   </button>
                   {showMonthSelector && (
                     <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-800/95 backdrop-blur-md rounded-xl border border-gray-600/50 shadow-2xl p-4 z-[9999] min-w-48">
                       <div className="grid grid-cols-3 gap-2">
                         {monthNames.map((month, index) => {
                           const isSelected = selectedMonth === index;
                           return (
                             <button
                               key={month}
                               type="button"
                               onClick={() => {
                                 setSelectedMonth(index);
                                 setShowMonthSelector(false);
                               }}
                               className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                                 isSelected
                                   ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                   : 'text-gray-300 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm'
                               }`}
                             >
                               {month.substring(0, 3)}
                             </button>
                           );
                         })}
                       </div>
                     </div>
                   )}
                 </div>
               </div>
               <button
                 type="button"
                 onClick={() => setSelectedYear(selectedYear + 1)}
                 className="text-gray-300 hover:text-white transition-colors p-1 hover:bg-white/10 hover:backdrop-blur-sm rounded-lg cursor-pointer touch-target"
               >
                 <FaChevronRight className="text-xs" />
               </button>
             </div>
             <div className="grid grid-cols-7 gap-0.5 mb-1.5">
               {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                 <div key={day} className="text-gray-300 text-xs text-center py-0.5 font-semibold">
                   {day}
                 </div>
               ))}
             </div>
             <div className="grid grid-cols-7 gap-0.5">
               {Array.from({ length: firstDayOfMonth }, (_, i) => (
                 <div key={`empty-${i}`} className="h-6 w-6 sm:h-8 sm:w-8"></div>
               ))}
               {Array.from({ length: daysInMonth }, (_, i) => {
                 const day = i + 1;
                 const dateString = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                 const isSelected = value === dateString;
                 const isToday = 
                   selectedYear === currentDate.getFullYear() &&
                   selectedMonth === currentDate.getMonth() &&
                   day === currentDate.getDate();
                 return (
                   <button
                     key={day}
                     type="button"
                     onClick={() => handleDateSelect(day)}
                       className={`h-6 w-6 sm:h-8 sm:w-8 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer flex items-center justify-center touch-target ${
                       isSelected
                         ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                         : isToday
                         ? 'bg-purple-500/30 text-white border border-purple-500/50'
                         : 'text-gray-300 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm'
                     }`}
                   >
                     {day}
                   </button>
                 );
               })}
             </div>
             <div className="flex justify-between mt-1.5 pt-1.5 border-t border-gray-700/50">
               <button
                 type="button"
                 onClick={() => setShowDatePicker(false)}
                 className="text-gray-300 hover:text-white text-xs transition-colors cursor-pointer py-1 px-2 hover:bg-white/10 hover:backdrop-blur-sm rounded-lg touch-target"
               >
                 Cancel
               </button>
               <button
                 type="button"
                 onClick={() => {
                   const today = new Date();
                   const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                   onChange(todayString);
                   setShowDatePicker(false);
                 }}
                 className="text-purple-400 hover:text-purple-300 text-xs transition-colors cursor-pointer py-1 px-2 hover:bg-purple-500/10 rounded-lg touch-target"
               >
                 Today
               </button>
             </div>
          </div>
        )}
      </div>
    );
  };
  const AddDataModal = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [bedtime, setBedtime] = useState('22:00');
    const [wakeTime, setWakeTime] = useState('07:00');
    const [deepSleep, setDeepSleep] = useState(2.0);
    const [lightSleep, setLightSleep] = useState(4.5);
    const [remSleep, setRemSleep] = useState(1.5);
    const [caffeine, setCaffeine] = useState(1);
    const [exercise, setExercise] = useState(30);
    const [temperature, setTemperature] = useState(22);
    const [showValidationError, setShowValidationError] = useState(false);
    const dateInputRef = useRef<HTMLDivElement>(null);
    const existingData = selectedDate ? manualSleepData[selectedDate] : null;
    const isEditMode = !!existingData;
    useEffect(() => {
      if (existingData) {
        setBedtime(existingData.bedtime);
        setWakeTime(existingData.wakeTime);
        setDeepSleep(existingData.deepSleep);
        setLightSleep(existingData.lightSleep);
        setRemSleep(existingData.remSleep);
        setCaffeine(existingData.environmental.caffeine);
        setExercise(existingData.environmental.exercise);
        setTemperature(existingData.environmental.temperature);
      } else if (selectedDate) {
        setBedtime('22:00');
        setWakeTime('07:00');
        setDeepSleep(2.0);
        setLightSleep(4.5);
        setRemSleep(1.5);
        setCaffeine(1);
        setExercise(30);
        setTemperature(22);
      }
    }, [selectedDate, existingData]);
    useEffect(() => {
      if (showValidationError && dateInputRef.current) {
        setTimeout(() => {
          dateInputRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }, 100);
      }
    }, [showValidationError]);
    const totalSleep = deepSleep + lightSleep + remSleep;
    const quality = calculateSleepQuality({
      totalSleep,
      deepSleep,
      lightSleep,
      remSleep,
      bedtime,
      wakeTime,
      environmental: { caffeine, exercise, temperature }
    });
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedDate) {
        setShowValidationError(true);
        return;
      }
      setShowValidationError(false);
      const sleepData = {
        selectedDate,
        bedtime,
        wakeTime,
        quality,
        deepSleep,
        lightSleep,
        remSleep,
        totalSleep,
        environmental: {
          caffeine,
          exercise,
          temperature
        }
      };
      setManualSleepData(prev => ({
        ...prev,
        [selectedDate]: sleepData
      }));
      const dateFormatted = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      showToast(
        isEditMode 
          ? `Sleep data updated for ${dateFormatted}` 
          : `Sleep data added for ${dateFormatted}`,
        'success'
      );
      console.log(isEditMode ? 'Updated sleep data:' : 'Added sleep data:', sleepData);
      setShowAddDataModal(false);
      setSelectedDate('');
      setBedtime('22:00');
      setWakeTime('07:00');
      setDeepSleep(2.0);
      setLightSleep(4.5);
      setRemSleep(1.5);
      setCaffeine(1);
      setExercise(30);
      setTemperature(22);
      setShowValidationError(false);
    };
    if (!showAddDataModal) return null;
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-gray-800/95 backdrop-blur-md rounded-2xl p-4 sm:p-6 max-w-2xl w-full border border-gray-700/50 shadow-2xl max-h-[90vh] overflow-y-auto"
        >
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
              {isEditMode ? (
                <>
                  <FaBed className="text-purple-400 text-base sm:text-lg" />
                  <span>Edit Sleep Data</span>
                </>
              ) : (
                <>
                  <FaPlus className="text-purple-400 text-base sm:text-lg" />
              <span>Add Sleep Data</span>
                </>
              )}
            </h3>
            <button
              onClick={() => {
                setShowAddDataModal(false);
                setShowValidationError(false);
              }}
              className="text-gray-300 hover:text-white text-lg sm:text-xl cursor-pointer p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <IoMdClose />
            </button>
          </div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent mb-4 sm:mb-6"></div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-semibold text-white flex items-center space-x-2">
                <FaBed className="text-purple-400 text-sm sm:text-base" />
                <span>Sleep Schedule</span>
              </h4>
              <div ref={dateInputRef}>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Date</label>
                <CustomDatePicker
                  value={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    setShowValidationError(false);
                  }}
                  placeholder="Select date"
                />
                {showValidationError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-2"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-300 text-xs sm:text-sm">Please select a date to continue</span>
                  </motion.div>
                )}
                {isEditMode && selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center space-x-2"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <span className="text-blue-300 text-xs sm:text-sm">Editing existing sleep data for {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </motion.div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Bedtime</label>
                  <CustomTimePicker
                    value={bedtime}
                    onChange={setBedtime}
                    placeholder="Select bedtime"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Wake Time</label>
                  <CustomTimePicker
                    value={wakeTime}
                    onChange={setWakeTime}
                    placeholder="Select wake time"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base sm:text-lg font-semibold text-white flex items-center space-x-2">
                  <FaBrain className="text-purple-400 text-sm sm:text-base" />
                <span>Sleep Phases</span>
              </h4>
                <div className="text-xs sm:text-sm text-gray-300 font-medium bg-gray-700/30 px-2 py-1 rounded-lg">
                  Total: {totalSleep.toFixed(1)}h
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-gray-700/20 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center space-x-2">
                      <FaMoon className="text-indigo-400 text-sm sm:text-base" />
                      <span className="text-xs sm:text-sm font-medium text-gray-300">Deep Sleep</span>
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-white">{deepSleep}h</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="4"
                    step="0.1"
                    value={deepSleep}
                    onChange={(e) => setDeepSleep(parseFloat(e.target.value))}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseMove={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${(deepSleep - 0.5) / 3.5 * 100}%, #4B5563 ${(deepSleep - 0.5) / 3.5 * 100}%, #4B5563 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0.5h</span>
                    <span>4h</span>
                </div>
                </div>
                <div className="bg-gray-700/20 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center space-x-2">
                      <FaBed className="text-purple-400 text-sm sm:text-base" />
                      <span className="text-xs sm:text-sm font-medium text-gray-300">Light Sleep</span>
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-white">{lightSleep}h</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    step="0.1"
                    value={lightSleep}
                    onChange={(e) => setLightSleep(parseFloat(e.target.value))}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseMove={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #A78BFA 0%, #A78BFA ${(lightSleep - 2) / 4 * 100}%, #4B5563 ${(lightSleep - 2) / 4 * 100}%, #4B5563 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>2h</span>
                    <span>6h</span>
                </div>
                </div>
                <div className="bg-gray-700/20 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center space-x-2">
                      <FaBrain className="text-pink-400 text-sm sm:text-base" />
                      <span className="text-xs sm:text-sm font-medium text-gray-300">REM Sleep</span>
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-white">{remSleep}h</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={remSleep}
                    onChange={(e) => setRemSleep(parseFloat(e.target.value))}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseMove={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #C084FC 0%, #C084FC ${(remSleep - 0.5) / 2.5 * 100}%, #4B5563 ${(remSleep - 0.5) / 2.5 * 100}%, #4B5563 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0.5h</span>
                    <span>3h</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-semibold text-white flex items-center space-x-2">
                <FaChartLine className="text-purple-400 text-sm sm:text-base" />
                <span>Sleep Quality (Auto-calculated)</span>
              </h4>
                            <div className="bg-gray-700/30 rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FaChartBar className="text-purple-400 text-sm sm:text-base" />
                    <span className="text-xs sm:text-sm text-gray-300">Calculated Quality Score:</span>
                </div>
                  <span className="text-xl sm:text-2xl font-bold text-white">{quality}%</span>
                </div>
                <div className="w-full bg-gray-600/50 rounded-full h-2 sm:h-3 overflow-hidden mb-4">
                  <div
                    className="h-2 sm:h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${quality}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs text-gray-300 mb-4">
                  <div className="text-center">
                    <div className="font-medium">Poor</div>
                    <div className="text-gray-400">(0-40)</div>
                </div>
                  <div className="text-center">
                    <div className="font-medium">Fair</div>
                    <div className="text-gray-400">(41-60)</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Good</div>
                    <div className="text-gray-400">(61-80)</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Excellent</div>
                    <div className="text-gray-400">(81-100)</div>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-gray-300 border-t border-gray-600/30 pt-3">
                  <div className="flex items-start space-x-2">
                    <span className="text-purple-400 mt-0.5">•</span>
                    <div>
                    <strong>Quality factors:</strong> Sleep duration, sleep phases distribution, timing, and environmental conditions
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-purple-400 mt-0.5">•</span>
                    <div>
                    <strong>Current rating:</strong> {quality <= 40 ? 'Poor' : quality <= 60 ? 'Fair' : quality <= 80 ? 'Good' : 'Excellent'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-semibold text-white flex items-center space-x-2">
                <FaLeaf className="text-purple-400 text-sm sm:text-base" />
                <span>Environmental Factors</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-gray-700/20 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center space-x-2">
                      <FaCoffee className="text-orange-400 text-sm sm:text-base" />
                      <span className="text-xs sm:text-sm font-medium text-gray-300">Caffeine</span>
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-white">{caffeine} cups</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={caffeine}
                    onChange={(e) => setCaffeine(parseInt(e.target.value))}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseMove={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #D946EF 0%, #D946EF ${caffeine * 20}%, #4B5563 ${caffeine * 20}%, #4B5563 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0</span>
                    <span>5 cups</span>
                </div>
                </div>
                <div className="bg-gray-700/20 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center space-x-2">
                      <FaDumbbell className="text-green-400 text-sm sm:text-base" />
                      <span className="text-xs sm:text-sm font-medium text-gray-300">Exercise</span>
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-white">{exercise} min</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    value={exercise}
                    onChange={(e) => setExercise(parseInt(e.target.value))}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseMove={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #A855F7 0%, #A855F7 ${exercise / 120 * 100}%, #4B5563 ${exercise / 120 * 100}%, #4B5563 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0 min</span>
                    <span>120 min</span>
                </div>
                </div>
                <div className="bg-gray-700/20 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center space-x-2">
                      <FaThermometerHalf className="text-blue-400 text-sm sm:text-base" />
                      <span className="text-xs sm:text-sm font-medium text-gray-300">Temperature</span>
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-white">{temperature}°C</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="26"
                    value={temperature}
                    onChange={(e) => setTemperature(parseInt(e.target.value))}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseMove={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #EC4899 0%, #EC4899 ${(temperature - 16) / 10 * 100}%, #4B5563 ${(temperature - 16) / 10 * 100}%, #4B5563 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>16°C</span>
                    <span>26°C</span>
                </div>
              </div>
            </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-3 sm:pt-4 border-t border-gray-700/50">
              <button
                type="button"
                onClick={() => {
                  setShowAddDataModal(false);
                  setShowValidationError(false);
                }}
                className="flex-1 px-4 py-2.5 sm:py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-white/10 hover:backdrop-blur-sm transition-all duration-300 cursor-pointer text-sm sm:text-base font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 sm:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-medium cursor-pointer text-sm sm:text-base"
              >
                {isEditMode ? 'Update Sleep Data' : 'Add Sleep Data'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  };
  if (!isClient) {
    return null; 
  }
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-2 sm:p-4 overflow-x-hidden hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', fontFamily: 'Poppins, sans-serif' }}>
        <div className="max-w-md mx-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/40 backdrop-blur-md rounded-2xl border border-gray-700/30 shadow-xl mb-6 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                  <FaMoon className="text-white text-xl" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold text-white leading-tight">Sleep Analyzer</h1>
                  <p className="text-gray-300 text-xs leading-tight">Track your sleep patterns</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAddDataModal(true)}
                  className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 cursor-pointer transform hover:scale-105"
                title="Add Sleep Data"
              >
                  <FaPlus className="text-sm" />
              </button>
              </div>
            </div>
          </motion.header>
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="bg-gray-800/95 backdrop-blur-md rounded-3xl p-6 min-h-96 border border-gray-700/40 flex flex-col"
            >
              <div className="w-full mb-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-white text-left flex items-center whitespace-nowrap">
                  <FaChartBar className="mr-2 text-purple-400 flex-shrink-0" />
                  <span className="truncate">Monthly Sleep Pattern</span>
                </h2>
                  <button
                    onClick={exportTimelineData}
                    className="flex items-center justify-center p-2 text-purple-400 hover:text-purple-300 transition-all duration-300 cursor-pointer"
                    title="Export Timeline Data"
                  >
                    <FaDownload className="text-base" />
                  </button>
                </div>
                <p className="text-gray-300 text-sm">Your sleep data for the selected month</p>
              </div>
              <div className="w-full mb-6">
                {isFutureMonth ? (
                  <div className="w-full flex flex-col items-center justify-center h-64 bg-gray-700/20 rounded-2xl space-y-6">
                    <div className="text-3xl text-gray-500">
                      <FaCalendarAlt />
                    </div>
                    <div className="text-center px-6">
                      <h3 className="text-lg font-semibold text-gray-300 mb-3">No Sleep Data Available</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">This month is in the future. Start tracking your sleep patterns to see your data here.</p>
                    </div>
                    <button
                      onClick={() => setShowAddDataModal(true)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 cursor-pointer"
                    >
                      Add Sleep Data
                    </button>
                  </div>
                ) : generateMonthlySleepData.length === 0 ? (
                  <div className="w-full flex flex-col items-center justify-center h-64 bg-gray-700/20 rounded-2xl space-y-6">
                    <div className="text-5xl text-gray-500">
                      <FaBed />
                    </div>
                    <div className="text-center px-6">
                      <h3 className="text-lg font-semibold text-gray-300 mb-3">No Sleep Data Yet</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">Start tracking your sleep patterns for this month to see your analysis here.</p>
                    </div>
                    <button
                      onClick={() => setShowAddDataModal(true)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 cursor-pointer"
                    >
                      Add Sleep Data
                    </button>
                  </div>
                ) : (
                  <div className="w-full bg-gray-700/20 rounded-2xl p-4 overflow-hidden">
                    <div className="overflow-x-auto">
                      <div className="min-w-[380px] h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            key={`mobile-chart-${selectedMonth}-${Object.keys(manualSleepData).length}-${JSON.stringify(generateMonthlySleepData).slice(0, 50)}`}
                            data={generateMonthlySleepData} 
                            margin={{ top: 10, right: 10, left: 20, bottom: 10 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                            <XAxis
                              dataKey="day"
                              stroke="#9CA3AF"
                              fontSize={10}
                              height={30}
                              interval={Math.max(0, Math.floor(generateMonthlySleepData.length / 8))}
                              tick={{ fill: '#D1D5DB', fontSize: 10, dy: 6 }}
                              axisLine={{ stroke: '#6B7280', strokeWidth: 1 }}
                              tickLine={{ stroke: '#6B7280', strokeWidth: 1 }}
                              label={{ value: 'Day', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#9CA3AF', fontSize: 10 } }}
                            />
                            <YAxis
                              stroke="#9CA3AF"
                              fontSize={10}
                              tick={{ fill: '#D1D5DB', fontSize: 10 }}
                              axisLine={{ stroke: '#6B7280', strokeWidth: 1 }}
                              tickLine={{ stroke: '#6B7280', strokeWidth: 1 }}
                              label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF', fontSize: 10 } }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="deep" stackId="a" fill="#8B5CF6" name="Deep Sleep" radius={[0, 0, 0, 0]} activeBar={<ActiveBarShape />} />
                            <Bar dataKey="light" stackId="a" fill="#A78BFA" name="Light Sleep" radius={[0, 0, 0, 0]} activeBar={<ActiveBarShape />} />
                            <Bar dataKey="rem" stackId="a" fill="#C084FC" name="REM Sleep" radius={[2, 2, 0, 0]} activeBar={<ActiveBarShape />} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-full mb-5">
                <div className="bg-gray-700/20 rounded-xl p-3">
                  <div className="flex items-center justify-center">
                    <button onClick={() => changeMonth(-1)} className="text-gray-400 hover:text-white p-2 hover:bg-gray-600/30 rounded-lg transition-all cursor-pointer">
                      <FaChevronLeft className="text-base" />
                    </button>
                    <div className="relative month-picker-container mx-4">
                      <button
                        onClick={() => setShowMonthPicker(!showMonthPicker)}
                        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white text-base font-semibold cursor-pointer px-4 py-2 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all border border-purple-500/20"
                      >
                        {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </button>
                      {showMonthPicker && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-800/95 backdrop-blur-md rounded-xl border border-gray-600/50 shadow-2xl p-4 z-[9999] min-w-64">
                          <div className="flex items-center justify-between mb-4">
                            <button onClick={() => setSelectedMonth(`${parseInt(selectedMonth.split('-')[0]) - 1}-${selectedMonth.split('-')[1]}`)} className="text-gray-400 hover:text-white p-1 cursor-pointer"><FaChevronLeft className="text-sm" /></button>
                            <div className="text-center text-gray-300 text-lg font-medium">{selectedMonth.split('-')[0]}</div>
                            <button onClick={() => setSelectedMonth(`${parseInt(selectedMonth.split('-')[0]) + 1}-${selectedMonth.split('-')[1]}`)} className="text-gray-400 hover:text-white p-1 cursor-pointer"><FaChevronRight className="text-sm" /></button>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {Array.from({ length: 12 }, (_, i) => {
                              const month = String(i + 1).padStart(2, '0');
                              const monthValue = `${selectedMonth.split('-')[0]}-${month}`;
                              const monthName = new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' });
                              const isSelected = selectedMonth === monthValue;
                              const currentDate = new Date();
                              const currentYear = currentDate.getFullYear();
                              const currentMonth = currentDate.getMonth() + 1;
                              const selectedYear = parseInt(selectedMonth.split('-')[0]);
                              const isCurrentYear = selectedYear === currentYear;
                              const isFutureMonth = isCurrentYear && (i + 1) > currentMonth;
                              const isFutureYear = selectedYear > currentYear;
                              const isDisabled = isFutureMonth || isFutureYear;
                              return (
                                <button
                                  key={month}
                                  onClick={() => { 
                                    if (!isDisabled) {
                                      setSelectedMonth(monthValue); 
                                      setShowMonthPicker(false); 
                                    }
                                  }}
                                  disabled={isDisabled}
                                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                    isDisabled 
                                      ? 'text-gray-500 cursor-not-allowed opacity-50' 
                                      : isSelected 
                                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg cursor-pointer' 
                                      : 'text-gray-300 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm cursor-pointer'
                                  }`}
                                >
                                  {monthName}
                                </button>
                              );
                            })}
                          </div>
                          <div className="flex justify-between mt-4 pt-3 border-t border-gray-700/50">
                            <button onClick={() => setShowMonthPicker(false)} className="text-gray-400 hover:text-white text-xs cursor-pointer">Cancel</button>
                            <button onClick={() => { const currentDate = new Date(); const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`; setSelectedMonth(currentMonth); setShowMonthPicker(false); }} className="text-purple-400 hover:text-purple-300 text-xs cursor-pointer">This month</button>
                          </div>
                        </div>
                      )}
                    </div>
                    <button onClick={() => changeMonth(1)} className="text-gray-400 hover:text-white p-2 hover:bg-gray-600/30 rounded-lg transition-all cursor-pointer">
                      <FaChevronRight className="text-base" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center whitespace-nowrap">
                  <FaBed className="mr-2 text-purple-400 flex-shrink-0" />
                  <span className="truncate">Sleep Schedule</span>
                </h3>
                <div className="bg-gray-700/20 rounded-2xl p-5 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-500/20 rounded-xl">
                          <FaMoon className="text-indigo-400 text-lg" />
                        </div>
                        <div>
                          <span className="text-white font-medium text-base">Bedtime</span>
                          <p className="text-gray-300 text-xs">{bedtimeSlider <= 21 ? "Early" : bedtimeSlider <= 23 ? "Evening" : "Late"}</p>
                        </div>
                      </div>
                      <span className="text-white font-bold text-xl">
                        {bedtimeSlider > 12 ? `${bedtimeSlider - 12}:00 PM` : bedtimeSlider === 12 ? '12:00 PM' : bedtimeSlider === 0 ? '12:00 AM' : `${bedtimeSlider}:00 AM`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="26"
                      value={bedtimeSlider}
                      onChange={(e) => setBedtimeSlider(parseInt(e.target.value))}
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchMove={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      onMouseMove={(e) => e.stopPropagation()}
                      onMouseUp={(e) => e.stopPropagation()}
                      className="w-full h-3 bg-gray-600/30 rounded-lg appearance-none cursor-pointer touch-slider mb-2"
                      style={{
                        background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${((bedtimeSlider - 20) / 6) * 100}%, #4B5563 ${((bedtimeSlider - 20) / 6) * 100}%, #4B5563 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-300">
                      <span>8PM</span>
                      <span>10PM</span>
                      <span>12AM</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-500/20 rounded-xl">
                          <FaSun className="text-yellow-400 text-lg" />
                        </div>
                        <div>
                          <span className="text-white font-medium text-base">Wake Time</span>
                          <p className="text-gray-300 text-xs">{waketimeSlider <= 6 ? "Early Bird" : waketimeSlider <= 8 ? "Normal" : "Late"}</p>
                        </div>
                      </div>
                      <span className="text-white font-bold text-xl">
                        {waketimeSlider > 12 ? `${waketimeSlider - 12}:00 PM` : waketimeSlider === 12 ? '12:00 PM' : waketimeSlider === 0 ? '12:00 AM' : `${waketimeSlider}:00 AM`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="11"
                      value={waketimeSlider}
                      onChange={(e) => setWaketimeSlider(parseInt(e.target.value))}
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchMove={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      onMouseMove={(e) => e.stopPropagation()}
                      onMouseUp={(e) => e.stopPropagation()}
                      className="w-full h-3 bg-gray-600/30 rounded-lg appearance-none cursor-pointer touch-slider mb-2"
                      style={{
                        background: `linear-gradient(to right, #F59E0B 0%, #F59E0B ${((waketimeSlider - 5) / 6) * 100}%, #4B5563 ${((waketimeSlider - 5) / 6) * 100}%, #4B5563 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-300">
                      <span>5AM</span>
                      <span>7AM</span>
                      <span>11AM</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FaClock className="text-purple-400 text-lg" />
                        <span className="text-purple-300 text-sm">Sleep Duration</span>
                      </div>
                      <div className="text-white font-bold text-2xl">
                        {(() => {
                          let duration = waketimeSlider - bedtimeSlider;
                          if (duration <= 0) duration += 24;
                          return `${duration}h`;
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <h3 className="text-lg font-semibold text-white mb-4">Monthly Summary</h3>
                {isFutureMonth ? (
                  <div className="bg-gray-700/20 rounded-2xl p-6 text-center">
                    <div className="text-gray-300 text-sm">No data available for this month</div>
                  </div>
                ) : monthlyStats ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-4 text-center">
                      <div className="text-white font-bold text-lg">{monthlyStats.totalSleep}h</div>
                      <div className="text-gray-300 text-sm">Total Sleep</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-4 text-center">
                      <div className="text-white font-bold text-lg">{monthlyStats.consistency}%</div>
                      <div className="text-gray-300 text-sm">Consistency</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-4 text-center">
                      <div className="text-white font-bold text-lg">{monthlyStats.bestNight.day}</div>
                      <div className="text-gray-300 text-sm">Best Night</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-4 text-center">
                      <div className="text-white font-bold text-lg">{monthlyStats.daysTracked}</div>
                      <div className="text-gray-300 text-sm">Days Tracked</div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-700/20 rounded-2xl p-6 text-center">
                    <div className="text-gray-300 text-sm">No data available for this month</div>
                  </div>
                )}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/95 backdrop-blur-md rounded-3xl p-6 min-h-96 border border-gray-700/40 flex flex-col"
            >
              <div className="w-full mb-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-white text-left flex items-center whitespace-nowrap">
                  <FaChartLine className="mr-2 text-purple-400 flex-shrink-0" />
                  <span className="truncate">Sleep Quality Analysis</span>
                </h2>
                  <button
                    onClick={exportQualityData}
                    className="flex items-center justify-center p-2 text-purple-400 hover:text-purple-300 transition-all duration-300 cursor-pointer"
                    title="Export Quality Data"
                  >
                    <FaDownload className="text-base" />
                  </button>
                </div>
                <p className="text-gray-300 text-sm">Detailed metrics of your sleep</p>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-3 shadow text-center flex flex-col items-center justify-between">
                  <div className="text-lg font-bold text-white">{monthlyStats?.avgQuality || 0}</div>
                  <div className="text-xs text-gray-300 font-medium mt-2 whitespace-nowrap">Avg Quality</div>
                </div>
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-3 shadow text-center flex flex-col items-center justify-between">
                  <div className="text-lg font-bold text-white">{monthlyStats?.avgDuration || 0}h</div>
                  <div className="text-xs text-gray-300 font-medium mt-2 whitespace-nowrap">Avg Duration</div>
                </div>
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-3 shadow text-center flex flex-col items-center justify-between">
                  <div className="text-lg font-bold text-white">{monthlyStats?.consistency || 0}%</div>
                  <div className="text-xs text-gray-300 font-medium mt-2 whitespace-nowrap">Consistency</div>
                </div>
              </div>
              <div className="w-full h-48 sm:h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart 
                    key={`mobile-radar-${selectedMonth}-${Object.keys(manualSleepData).length}`}
                    data={radarData}
                  >
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: '#9CA3AF', fontSize: 10, dy: -5 }} 
                      tickFormatter={(value) => value}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fill: '#9CA3AF', fontSize: 9, dx: 2 }} 
                      tickCount={6}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Radar name="Quality" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full space-y-2">
                {(() => {
                if (!generateMonthlySleepData.length) {
                  return [
                    { phase: 'Deep Sleep', duration: '0.0h', percentage: 0, color: 'bg-purple-500', icon: <FaMoon className="text-indigo-400" />, desc: 'Restorative phase for body and mind.' },
                    { phase: 'Light Sleep', duration: '0.0h', percentage: 0, color: 'bg-purple-400', icon: <FaBed className="text-purple-400" />, desc: 'Transitional phase, easy to wake.' },
                    { phase: 'REM Sleep', duration: '0.0h', percentage: 0, color: 'bg-purple-300', icon: <FaBrain className="text-purple-300" />, desc: 'Dream phase, important for memory.' }
                  ];
                }
                const avgDeepSleep = generateMonthlySleepData.reduce((sum, day) => sum + day.deep, 0) / generateMonthlySleepData.length;
                const avgLightSleep = generateMonthlySleepData.reduce((sum, day) => sum + day.light, 0) / generateMonthlySleepData.length;
                const avgRemSleep = generateMonthlySleepData.reduce((sum, day) => sum + day.rem, 0) / generateMonthlySleepData.length;
                const totalAvg = avgDeepSleep + avgLightSleep + avgRemSleep;
                return [
                  {
                    phase: 'Deep Sleep',
                    duration: `${avgDeepSleep.toFixed(1)}h`,
                    percentage: totalAvg > 0 ? Math.round((avgDeepSleep / totalAvg) * 100) : 0,
                    color: 'bg-purple-500',
                    icon: <FaMoon className="text-indigo-400" />,
                    desc: 'Restorative phase for body and mind.'
                  },
                  {
                    phase: 'Light Sleep',
                    duration: `${avgLightSleep.toFixed(1)}h`,
                    percentage: totalAvg > 0 ? Math.round((avgLightSleep / totalAvg) * 100) : 0,
                    color: 'bg-purple-400',
                    icon: <FaBed className="text-purple-400" />,
                    desc: 'Transitional phase, easy to wake.'
                  },
                  {
                    phase: 'REM Sleep',
                    duration: `${avgRemSleep.toFixed(1)}h`,
                    percentage: totalAvg > 0 ? Math.round((avgRemSleep / totalAvg) * 100) : 0,
                    color: 'bg-purple-300',
                    icon: <FaBrain className="text-purple-300" />,
                    desc: 'Dream phase, important for memory.'
                  }
                ];
              })().map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-3 border border-gray-600/30 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-base font-semibold text-white">{item.phase}</span>
                    </div>
                    <span className="text-gray-300 font-mono text-xs sm:text-sm">{item.duration}</span>
                    <div className="w-20 h-2 bg-gray-600/50 rounded-full overflow-hidden mx-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className={`h-2 rounded-full ${item.color} shadow-lg`}
                      />
                    </div>
                    <span className="text-xs text-gray-300">{item.percentage}%</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800/95 backdrop-blur-md rounded-3xl p-6 min-h-96 border border-gray-700/40 flex flex-col"
            >
              <div className="w-full mb-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-white text-left flex items-center whitespace-nowrap">
                  <FaLeaf className="mr-2 text-purple-400 flex-shrink-0" />
                  <span className="truncate">Environmental Factors</span>
                </h2>
                  <button
                    onClick={exportEnvironmentalData}
                    className="flex items-center justify-center p-2 text-purple-400 hover:text-purple-300 transition-all duration-300 cursor-pointer"
                    title="Export Environmental Data"
                  >
                    <FaDownload className="text-base" />
                  </button>
                </div>
                <p className="text-gray-300 text-sm">How external factors affect your sleep quality</p>
              </div>
              <div className="w-full overflow-x-auto">
                {correlationData.length === 0 ? (
                  <div className="w-full flex flex-col items-center justify-center h-56 sm:h-64 bg-gray-700/20 rounded-2xl space-y-4">
                    <div className="text-4xl text-gray-500">
                      <FaLeaf />
                    </div>
                    <div className="text-center px-4">
                      <h3 className="text-base font-semibold text-gray-300 mb-2">No Environmental Data</h3>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        No environmental factors data for {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}. Add sleep data to see correlations.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddDataModal(true)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 cursor-pointer text-sm"
                    >
                      Add Sleep Data
                    </button>
                  </div>
                ) : (
                  <div className="min-w-[420px] h-56 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart 
                        key={`mobile-scatter-${selectedMonth}-${Object.keys(manualSleepData).length}`}
                        data={correlationData} 
                        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                          type="number"
                          dataKey="x"
                          name="Factor Value"
                          stroke="#9CA3AF"
                          fontSize={10}
                          label={{ value: 'Factor Value', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#9CA3AF', fontSize: 10 } }}
                        />
                        <YAxis
                          type="number"
                          dataKey="y"
                          name="Sleep Quality"
                          stroke="#9CA3AF"
                          fontSize={10}
                          label={{ value: 'Sleep Quality (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF', fontSize: 10 } }}
                        />
                        <ZAxis type="number" dataKey="z" range={[50, 200]} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-gray-900/95 backdrop-blur-md p-3 rounded-xl border border-purple-500/30 shadow-2xl max-w-xs">
                                <p className="text-white font-medium text-xs sm:text-sm">{data.factor}</p>
                                {data.date && <p className="text-gray-300 text-xs">Date: {new Date(data.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>}
                                <p className="text-gray-300 text-xs">Value: {data.value}</p>
                                <p className="text-gray-300 text-xs">Quality: {data.y}%</p>
                                <p className="text-gray-300 text-xs">Duration: {data.z}h</p>
                              </div>
                            );
                          }
                          return null;
                        }} />
                        <Scatter dataKey="y" fill="#8B5CF6" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
              <div className="w-full space-y-2 mt-3">
                {(() => {
                  const [year, month] = selectedMonth.split('-').map(Number);
                  const monthlyEnvData = [];
                  for (let day = 1; day <= new Date(year, month, 0).getDate(); day++) {
                    const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayData = manualSleepData[dateString];
                    if (dayData && dayData.environmental) {
                      monthlyEnvData.push(dayData.environmental);
                    }
                  }
                  if (!monthlyEnvData.length) {
                    return [
                  {
                    icon: FaCoffee,
                    label: 'Caffeine',
                        value: 'No data',
                        impact: 'Add data',
                        color: 'text-amber-300',
                        bgColor: 'bg-gray-700/20',
                        borderColor: 'border-gray-500/15',
                        impactColor: 'text-gray-300',
                      },
                      {
                        icon: FaDumbbell,
                        label: 'Exercise',
                        value: 'No data',
                        impact: 'Add data',
                        color: 'text-emerald-300',
                        bgColor: 'bg-gray-700/20',
                        borderColor: 'border-gray-500/15',
                        impactColor: 'text-gray-300',
                      },
                      {
                        icon: FaThermometerHalf,
                        label: 'Temperature',
                        value: 'No data',
                        impact: 'Add data',
                        color: 'text-sky-300',
                        bgColor: 'bg-gray-700/20',
                        borderColor: 'border-gray-500/15',
                        impactColor: 'text-gray-300',
                      }
                    ];
                  }
                  const avgCaffeine = monthlyEnvData.reduce((sum, env) => sum + env.caffeine, 0) / monthlyEnvData.length;
                  const avgExercise = monthlyEnvData.reduce((sum, env) => sum + env.exercise, 0) / monthlyEnvData.length;
                  const avgTemperature = monthlyEnvData.reduce((sum, env) => sum + env.temperature, 0) / monthlyEnvData.length;
                  return [
                    {
                      icon: FaCoffee,
                      label: 'Caffeine',
                      value: `${avgCaffeine.toFixed(1)} cups`,
                      impact: avgCaffeine <= 1 ? 'Low' : avgCaffeine <= 2 ? 'Moderate' : 'High',
                    color: 'text-orange-300',
                    bgColor: 'bg-orange-500/20',
                    borderColor: 'border-orange-500/30',
                    impactColor: 'text-orange-200',
                  },
                  {
                    icon: FaDumbbell,
                    label: 'Exercise',
                      value: `${Math.round(avgExercise)} min`,
                      impact: avgExercise >= 30 ? 'Positive' : avgExercise >= 15 ? 'Moderate' : 'Low',
                    color: 'text-emerald-300',
                    bgColor: 'bg-emerald-500/20',
                    borderColor: 'border-emerald-500/30',
                    impactColor: 'text-emerald-200',
                  },
                  {
                    icon: FaThermometerHalf,
                    label: 'Temperature',
                      value: `${Math.round(avgTemperature)}°C`,
                      impact: avgTemperature >= 20 && avgTemperature <= 22 ? 'Optimal' : 'Suboptimal',
                    color: 'text-sky-300',
                    bgColor: 'bg-sky-500/20',
                    borderColor: 'border-sky-500/30',
                    impactColor: 'text-sky-200',
                  }
                  ];
                })().map((factor, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                                        className={`${index === 0 ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20' : index === 1 ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20' : 'bg-gradient-to-r from-sky-500/20 to-cyan-500/20'} rounded-xl p-3 shadow text-center flex flex-col items-center`}
                  >
                    <factor.icon className={`text-2xl mx-auto mb-2 ${factor.color}`} />
                    <div className="text-lg font-bold text-white">{factor.value}</div>
                    <div className="text-xs text-gray-300 font-medium mt-1">{factor.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        <AddDataModal />
        <AnimatePresence>
          {toast.show && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-4 left-4 right-4 z-[99999]"
            >
              <div className={`rounded-xl shadow-2xl border backdrop-blur-md px-4 py-3 ${
                toast.type === 'success' 
                  ? 'bg-gray-800/90 border-purple-500/30' 
                  : 'bg-gray-800/90 border-red-500/30'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`flex-shrink-0 p-1.5 rounded-lg ${
                    toast.type === 'success' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                      : 'bg-gradient-to-r from-red-500 to-red-600'
                  }`}>
                    {toast.type === 'success' ? (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-white font-medium text-sm">
                      {toast.type === 'success' ? 'Success! ' : 'Error! '}
                      <span className="text-gray-300 font-normal">{toast.message}</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setToast(prev => ({ ...prev, show: false }))}
                    className="flex-shrink-0 text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                  >
                    <IoMdClose className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-8">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"></div>
          <div className="flex justify-center py-4">
            <span className="text-xs text-gray-300 opacity-90">Sleep Analyzer 2024 &mdash; All data of sleep in one place.</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 overflow-hidden hide-scrollbar" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="h-full flex flex-col max-w-7xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-2 py-4 flex-shrink-0"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg">
              <FaMoon className="text-white text-lg" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-white">Sleep Analyzer</h1>
              <div className="flex items-center space-x-2">
                                  {React.createElement(slideInfo[currentSlide].icon, { className: "text-gray-300 text-xs" })}
                <span className="text-gray-300 text-xs">{slideInfo[currentSlide].title}</span>
                <span className="text-gray-300 text-xs">•</span>
                <span className="text-gray-300 text-xs">{slideInfo[currentSlide].subtitle}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-800/80 backdrop-blur-sm rounded-xl p-2 border border-gray-700/50">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => {
                    setPreviousSlide(currentSlide);
                    setCurrentSlide(index);
                  }}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium cursor-pointer ${currentSlide === index
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm'
                    }`}
                >
                  {index === 0 ? 'Timeline' : index === 1 ? 'Quality' : 'Factors'}
                </button>
              ))}
            </div>
          </div>
        </motion.header>
        <div className="flex-1 relative px-2 pb-4 min-h-0">
          <div
            className="relative h-full group select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={dragging ? handleMouseMove : undefined}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            role="presentation"
          >
            <AnimatePresence mode="wait" initial={false}>
              <div key={`${currentSlide}-${previousSlide}`} className="h-full">
                {slides[currentSlide]()}
              </div>
            </AnimatePresence>
            <div className="absolute top-1/2 left-2 -translate-y-1/2 flex items-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto hidden md:flex">
              <button
                onClick={prevSlide}
                className="p-2 m-0 bg-transparent border-none outline-none focus:outline-none cursor-pointer transition-all duration-300"
                aria-label="Previous slide"
              >
                <FaChevronLeft className="text-2xl text-white/70 hover:text-white hover:scale-110 transition-all duration-300 drop-shadow-lg" />
              </button>
            </div>
            <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto hidden md:flex">
              <button
                onClick={nextSlide}
                className="p-2 m-0 bg-transparent border-none outline-none focus:outline-none cursor-pointer transition-all duration-300"
                aria-label="Next slide"
              >
                <FaChevronRight className="text-2xl text-white/70 hover:text-white hover:scale-110 transition-all duration-300 drop-shadow-lg" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center pb-6 pt-2">
          <span className="text-xs text-gray-300 opacity-90">Sleep Analyzer 2024 &mdash; All data of sleep in one place.</span>
        </div>
      </div>
      <AddDataModal />
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[99999] max-w-md w-auto mx-4"
          >
            <div className={`rounded-xl shadow-2xl border backdrop-blur-md px-4 py-3 ${
              toast.type === 'success' 
                ? 'bg-gray-800/90 border-purple-500/30' 
                : 'bg-gray-800/90 border-red-500/30'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`flex-shrink-0 p-1.5 rounded-lg ${
                  toast.type === 'success' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                    : 'bg-gradient-to-r from-red-500 to-red-600'
                }`}>
                  {toast.type === 'success' ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-white font-medium text-sm">
                    {toast.type === 'success' ? 'Success! ' : 'Error! '}
                    <span className="text-gray-300 font-normal">{toast.message}</span>
                  </span>
                </div>
                <button
                  onClick={() => setToast(prev => ({ ...prev, show: false }))}
                  className="flex-shrink-0 text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                >
                  <IoMdClose className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          border: 2px solid #ffffff;
          transition: all 0.2s ease;
        }
        .slider::-webkit-slider-thumb:hover {
          background: #7C3AED;
          transform: scale(1.1);
        }
        .slider::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          border: 2px solid #ffffff;
          transition: all 0.2s ease;
        }
        .slider::-moz-range-thumb:hover {
          background: #7C3AED;
          transform: scale(1.1);
        }
        .touch-slider {
          -webkit-appearance: none;
          appearance: none;
          outline: none;
          border: none;
        }
        .touch-slider::-webkit-slider-track {
          height: 12px;
          border-radius: 6px;
          background: transparent;
        }
        .touch-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%);
          cursor: pointer;
          box-shadow: 
            0 4px 12px rgba(139, 92, 246, 0.4),
            0 0 0 2px white,
            0 0 0 4px rgba(139, 92, 246, 0.2);
          border: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .touch-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 
            0 6px 20px rgba(139, 92, 246, 0.5),
            0 0 0 2px white,
            0 0 0 6px rgba(139, 92, 246, 0.3);
        }
        .touch-slider::-webkit-slider-thumb:active {
          transform: scale(1.2);
          box-shadow: 
            0 8px 24px rgba(139, 92, 246, 0.6),
            0 0 0 2px white,
            0 0 0 8px rgba(139, 92, 246, 0.4);
        }
        .touch-slider::-moz-range-track {
          height: 12px;
          border-radius: 6px;
          background: transparent;
          border: none;
        }
        .touch-slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%);
          cursor: pointer;
          box-shadow: 
            0 4px 12px rgba(139, 92, 246, 0.4),
            0 0 0 2px white,
            0 0 0 4px rgba(139, 92, 246, 0.2);
          border: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .touch-slider::-moz-range-thumb:hover {
          transform: scale(1.15);
          box-shadow: 
            0 6px 20px rgba(139, 92, 246, 0.5),
            0 0 0 2px white,
            0 0 0 6px rgba(139, 92, 246, 0.3);
        }
        @media (max-width: 768px) {
          .touch-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%);
            cursor: pointer;
            box-shadow: 
              0 4px 12px rgba(139, 92, 246, 0.4),
              0 0 0 2px white,
              0 0 0 4px rgba(139, 92, 246, 0.2);
            border: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .touch-slider::-webkit-slider-thumb:hover {
            transform: scale(1.15);
            box-shadow: 
              0 6px 20px rgba(139, 92, 246, 0.5),
              0 0 0 2px white,
              0 0 0 6px rgba(139, 92, 246, 0.3);
          }
          .touch-slider::-webkit-slider-thumb:active {
            transform: scale(1.2);
            box-shadow: 
              0 8px 24px rgba(139, 92, 246, 0.6),
              0 0 0 2px white,
              0 0 0 8px rgba(139, 92, 246, 0.4);
          }
          .touch-slider::-moz-range-thumb {
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%);
            cursor: pointer;
            box-shadow: 
              0 4px 12px rgba(139, 92, 246, 0.4),
              0 0 0 2px white,
              0 0 0 4px rgba(139, 92, 246, 0.2);
            border: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .touch-slider::-moz-range-thumb:hover {
            transform: scale(1.15);
            box-shadow: 
              0 6px 20px rgba(139, 92, 246, 0.5),
              0 0 0 2px white,
              0 0 0 6px rgba(139, 92, 246, 0.3);
          }
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .month-picker::-webkit-calendar-picker-indicator {
          background: transparent;
          bottom: 0;
          color: transparent;
          cursor: pointer;
          height: auto;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: auto;
        }
        .month-picker::-webkit-inner-spin-button,
        .month-picker::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="month"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }
        input[type="month"]:hover::-webkit-calendar-picker-indicator {
          opacity: 1;
        }
        input[type="month"] {
          -moz-appearance: none;
          appearance: none;
        }
        @supports (-webkit-appearance: none) {
          .month-picker {
            position: relative;
          }
          .month-picker::after {
            content: '';
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
            font-size: 12px;
            opacity: 0.7;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http:
            background-size: 12px 12px;
            width: 12px;
            height: 12px;
          }
        }
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(1) brightness(1.2) contrast(1.2);
          opacity: 0.8;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        input[type="date"]::-webkit-calendar-picker-indicator:hover,
        input[type="time"]::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
          filter: invert(1) brightness(1.4) contrast(1.4);
        }
        input[type="date"],
        input[type="time"] {
          color-scheme: dark;
        }
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          background: transparent;
          cursor: pointer;
        }
        input[type="date"]::-webkit-datetime-edit,
        input[type="time"]::-webkit-datetime-edit {
          color: #ffffff;
          background: transparent;
        }
        input[type="date"]::-webkit-datetime-edit-fields-wrapper,
        input[type="time"]::-webkit-datetime-edit-fields-wrapper {
          background: transparent;
        }
        input[type="date"]::-webkit-datetime-edit-text,
        input[type="time"]::-webkit-datetime-edit-text {
          color: #9CA3AF;
          padding: 0 1px;
        }
        input[type="date"]::-webkit-datetime-edit-month-field,
        input[type="date"]::-webkit-datetime-edit-day-field,
        input[type="date"]::-webkit-datetime-edit-year-field,
        input[type="time"]::-webkit-datetime-edit-hour-field,
        input[type="time"]::-webkit-datetime-edit-minute-field {
          background: transparent;
          color: #ffffff;
          border: none;
          outline: none;
        }
        input[type="date"]::-webkit-datetime-edit-month-field:focus,
        input[type="date"]::-webkit-datetime-edit-day-field:focus,
        input[type="date"]::-webkit-datetime-edit-year-field:focus,
        input[type="time"]::-webkit-datetime-edit-hour-field:focus,
        input[type="time"]::-webkit-datetime-edit-minute-field:focus {
          background: rgba(139, 92, 246, 0.2);
          border-radius: 4px;
          color: #ffffff;
        }
        @supports (-webkit-appearance: none) {
          input[type="date"]::-webkit-calendar-picker-indicator {
            background: url('data:image/svg+xml;utf8,<svg xmlns="http:
            background-size: 16px 16px;
            opacity: 0.7;
            transition: opacity 0.2s ease;
          }
          input[type="time"]::-webkit-calendar-picker-indicator {
            background: url('data:image/svg+xml;utf8,<svg xmlns="http:
            background-size: 16px 16px;
            opacity: 0.7;
            transition: opacity 0.2s ease;
          }
          input[type="date"]:hover::-webkit-calendar-picker-indicator,
          input[type="time"]:hover::-webkit-calendar-picker-indicator {
            opacity: 1;
          }
        }
        input[type="date"]::-webkit-inner-spin-button,
        input[type="time"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="date"]::-webkit-outer-spin-button,
        input[type="time"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
      <style jsx global>{`
        .hide-scrollbar, .hide-scrollbar * {
          scrollbar-width: none !important;     
          -ms-overflow-style: none !important;  
        }
        .hide-scrollbar::-webkit-scrollbar, .hide-scrollbar *::-webkit-scrollbar {
          display: none !important;             
        }
        *, *::before, *::after {
          scrollbar-width: none !important;     
          -ms-overflow-style: none !important;  
        }
        *::-webkit-scrollbar, *::before::-webkit-scrollbar, *::after::-webkit-scrollbar {
          display: none !important;             
          width: 0 !important;
          height: 0 !important;
        }
        html, body {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        html::-webkit-scrollbar, body::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        .overflow-auto, .overflow-x-auto, .overflow-y-auto,
        .overflow-scroll, .overflow-x-scroll, .overflow-y-scroll,
        .space-y-6, .space-y-4, .space-y-3, .space-y-2 {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .overflow-auto::-webkit-scrollbar, .overflow-x-auto::-webkit-scrollbar, 
        .overflow-y-auto::-webkit-scrollbar, .overflow-scroll::-webkit-scrollbar,
        .overflow-x-scroll::-webkit-scrollbar, .overflow-y-scroll::-webkit-scrollbar,
        .space-y-6::-webkit-scrollbar, .space-y-4::-webkit-scrollbar,
        .space-y-3::-webkit-scrollbar, .space-y-2::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        @media (max-width: 768px) {
          * {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          *::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
            background: transparent !important;
          }
          .min-h-screen, .max-w-md, .mx-auto {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          .min-h-screen::-webkit-scrollbar, .max-w-md::-webkit-scrollbar, .mx-auto::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: brightness(0) saturate(100%) invert(74%) sepia(17%) saturate(1136%) hue-rotate(213deg) brightness(96%) contrast(93%);
        }
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: brightness(0) saturate(100%) invert(74%) sepia(17%) saturate(1136%) hue-rotate(213deg) brightness(96%) contrast(93%);
        }
        input[type="date"]:focus,
        input[type="time"]:focus {
          border-color: #8B5CF6 !important;
          ring-color: #8B5CF6 !important;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1) !important;
        }
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          background-color: rgba(139, 92, 246, 0.1);
          border-radius: 4px;
        }
        input[type="time"]::-webkit-calendar-picker-indicator:hover {
          background-color: rgba(139, 92, 246, 0.1);
          border-radius: 4px;
        }
        @-moz-document url-prefix() {
          input[type="date"],
          input[type="time"] {
            background-color: rgba(75, 85, 99, 0.7) !important;
            border: 1px solid rgba(107, 114, 128, 0.5) !important;
            color: #ffffff !important;
          }
          input[type="date"]:focus,
          input[type="time"]:focus {
            border-color: #8B5CF6 !important;
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1) !important;
          }
        }
        input[type="date"]::-ms-clear,
        input[type="time"]::-ms-clear {
          display: none;
        }
        input[type="date"]::-ms-reveal,
        input[type="time"]::-ms-reveal {
          display: none;
        }
        .touch-target {
          min-height: 44px;
          min-width: 44px;
        }
        @media (max-width: 640px) {
          .touch-target {
            min-height: 48px;
            min-width: 48px;
          }
        }
      `}</style>
    </div>
  );
};
const ActiveBarShape = (props: Partial<BarProps>) => {
  const { fill, x, y, width, height, radius } = props;
  if (x === undefined || y === undefined || width === undefined || height === undefined) return null;
  let rx = 4;
  if (typeof radius === 'number') rx = radius;
  else if (Array.isArray(radius) && radius.length > 0) rx = radius[0];
  const nx = Number(x), ny = Number(y), nwidth = Number(width), nheight = Number(height);
  return (
    <g>
      <rect
        x={nx - 2}
        y={ny - 8}
        width={nwidth + 4}
        height={nheight + 10}
        rx={rx}
        fill="#C084FC"
        opacity={0.35}
        style={{ filter: 'blur(2px)' }}
      />
      <rect
        x={nx}
        y={ny}
        width={nwidth}
        height={nheight}
        rx={rx}
        fill={fill}
        style={{ stroke: '#C084FC', strokeWidth: 2 }}
      />
    </g>
  );
};
export default SleepAnalyzer;
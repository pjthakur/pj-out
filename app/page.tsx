"use client";

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { FiMoon, FiSun, FiPlus } from 'react-icons/fi';
import {
  LineChart, Line as ReLine, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend as ReLegend, ResponsiveContainer, BarChart, Bar as ReBar, PieChart, Pie as RePie, Cell
} from 'recharts';
import type { TooltipProps } from 'recharts';

type HealthMetric = {
  id: string;
  date: string;
  weight: number;
  height: number;
  bodyFat: number;
  muscleMass: number;
  waterPercentage: number;
  calories: number;
};

type Theme = 'light' | 'dark';

export default function HealthDashboard() {
  const [theme, setTheme] = useState<Theme>('light');
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [newMetric, setNewMetric] = useState<Omit<HealthMetric, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    weight: 0,
    height: 0,
    bodyFat: 0,
    muscleMass: 0,
    waterPercentage: 0,
    calories: 0,
  });
  const [isAdding, setIsAdding] = useState(false);
  const inputSectionRef = useRef<HTMLDivElement>(null);

  // initialize with mock data
  useEffect(() => {
    const mockData: HealthMetric[] = [
      {
        id: '1',
        date: '2023-01-01',
        weight: 75,
        height: 175,
        bodyFat: 22,
        muscleMass: 38,
        waterPercentage: 55,
        calories: 2200,
      },
      {
        id: '2',
        date: '2023-02-01',
        weight: 73,
        height: 175,
        bodyFat: 20,
        muscleMass: 39,
        waterPercentage: 56,
        calories: 2300,
      },
      {
        id: '3',
        date: '2023-03-01',
        weight: 72,
        height: 175,
        bodyFat: 19,
        muscleMass: 40,
        waterPercentage: 57,
        calories: 2400,
      },
      {
        id: '4',
        date: '2023-04-01',
        weight: 71,
        height: 176,
        bodyFat: 18,
        muscleMass: 41,
        waterPercentage: 58,
        calories: 2500,
      },
      {
        id: '5',
        date: '2023-05-01',
        weight: 70,
        height: 176,
        bodyFat: 17,
        muscleMass: 42,
        waterPercentage: 59,
        calories: 2600,
      },
    ];
    setMetrics(mockData);
  }, []);

  // Add effect to manage body scroll
  useEffect(() => {
    if (isAdding) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function to ensure scroll is restored
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAdding]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMetric({
      ...newMetric,
      [name]: parseFloat(value) || 0,
    });
  };

  const handleAddMetric = () => {
    const metric: HealthMetric = {
      ...newMetric,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
    };
    setMetrics([...metrics, metric]);
    setIsAdding(false);
    setNewMetric({
      date: new Date().toISOString().split('T')[0],
      weight: 0,
      height: 0,
      bodyFat: 0,
      muscleMass: 0,
      waterPercentage: 0,
      calories: 0,
    });
  };

  // scroll to input section
  const scrollToInput = () => {
    setIsAdding(true);
    setTimeout(() => {
      inputSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const colors = {
    light: {
      primary: '#6366F1', // Indigo
      secondary: '#8B5CF6', // Violet
      accent: '#EC4899', // Pink
      background: '#F8FAFC',
      card: '#FFFFFF',
      text: '#1E293B',
      textSecondary: '#64748B',
      border: '#E2E8F0',
      gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    dark: {
      primary: '#818CF8',
      secondary: '#A78BFA',
      accent: '#F472B6',
      background: '#0F172A',
      card: '#1E293B',
      text: '#F8FAFC',
      textSecondary: '#CBD5E1',
      border: '#334155',
      gradient: 'linear-gradient(135deg, #818CF8 0%, #A78BFA 100%)',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
    },
  };

  const currentColors = colors[theme];

  // Prepare data for Recharts
  const rechartsLineData = metrics.map(m => ({
    date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: m.weight,
    calories: m.calories,
    bodyFat: m.bodyFat,
  }));

  const rechartsBodyFatData = metrics.map(m => ({
    date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    bodyFat: m.bodyFat,
  }));

  const latest = metrics[metrics.length - 1] || { bodyFat: 0, muscleMass: 0, waterPercentage: 0 };
  const bodyCompositionPieData = [
    { name: 'Body Fat', value: latest.bodyFat, color: currentColors.primary },
    { name: 'Muscle Mass', value: latest.muscleMass, color: currentColors.secondary },
    { name: 'Water', value: latest.waterPercentage, color: currentColors.accent },
  ];

  // Custom tooltip for PieChart
  const renderPieTooltip = (props: TooltipProps<number, string>) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      const entry = payload[0];
      return (
        <div
          style={{
            background: theme === 'dark' ? '#1E293B' : currentColors.card,
            color: theme === 'dark' ? '#F8FAFC' : currentColors.text,
            border: `1px solid ${currentColors.border}`,
            borderRadius: 8,
            padding: '12px 18px',
            fontWeight: 600,
            fontSize: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          }}
        >
          <span style={{ color: entry.payload.color, fontWeight: 700 }}>
            {entry.name}
          </span>
          <span style={{ marginLeft: 8, color: theme === 'dark' ? '#F8FAFC' : currentColors.text }}>
            : {entry.value}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`dashboard ${theme}`}>
      <Head>
        <title>Health Growth Dashboard</title>
      </Head>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');
        
        .dashboard {
          min-height: 100vh;
          transition: all 0.3s ease;
          position: relative;
          overflow-x: hidden;
          font-family: 'Montserrat', 'Nunito', system-ui, sans-serif;
        }

        .dashboard::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: ${theme === 'light' ? 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent 50%)' : 'radial-gradient(circle at top right, rgba(129, 140, 248, 0.1), transparent 50%)'};
          z-index: -1;
        }

        .dashboard.light {
          background-color: #F8FAFC;
        }

        .dashboard.dark {
          background-color: #0F172A;
        }

        .main-content {
          padding: 32px;
          margin: 0 auto;
          width: 90%;
          max-width: 1600px;
        }

        .header {
          margin-bottom: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 12px;
          background: ${colors[theme].gradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-family: 'Montserrat', 'Nunito', system-ui, sans-serif;
        }

        .subtitle {
          color: ${colors[theme].textSecondary};
          font-size: 1.1rem;
          font-weight: 400;
        }

        .theme-toggle {
          padding: 12px;
          border-radius: 9999px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : colors[theme].card};
          box-shadow: 0 4px 16px 2px ${theme === 'dark' ? 'rgba(168,140,250,0.25)' : 'rgba(129,140,248,0.10)'};
          border: 2px solid ${theme === 'dark' ? '#F8FAFC' : colors[theme].border};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(2px);
        }

        .theme-toggle:hover {
          transform: translateY(-2px) rotate(15deg);
          box-shadow: 0 6px 24px 2px ${theme === 'dark' ? 'rgba(168,140,250,0.35)' : 'rgba(129,140,248,0.18)'};
          border-color: ${theme === 'dark' ? '#F8FAFC' : colors[theme].primary};
          background: ${theme === 'dark' ? 'rgba(255,255,255,0.16)' : colors[theme].card};
        }

        .theme-toggle:active {
          transform: translateY(0) rotate(0);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .theme-toggle svg {
          color: ${theme === 'dark' ? '#F8FAFC' : '#1E293B'} !important;
        }

        .input-section {
          margin-bottom: 40px;
          animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .add-button {
          display: flex;
          align-items: center;
          padding: 14px 28px;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: ${colors[theme].gradient};
          color: white;
          font-weight: 600;
          font-size: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
          border: none;
        }

        .add-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transform: translateX(100%);
          transition: transform 0.6s ease;
        }

        .add-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .add-button:hover::before {
          transform: translateX(-100%);
        }

        .add-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .form-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          background: ${colors[theme].card};
          border: 1px solid ${colors[theme].border};
          animation: modalSlideIn 0.3s ease-out;
          z-index: 1000;
          max-width: 90%;
          width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 999;
          animation: fadeIn 0.3s ease-out;
          overflow: hidden;
        }

        @keyframes modalSlideIn {
          from { opacity: 0; transform: translate(-50%, -60%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .form-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 24px;
          color: ${colors[theme].text};
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }

        .form-group {
          margin-bottom: 4px;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          color: ${colors[theme].text};
        }

        .form-input {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 2px solid ${colors[theme].border};
          transition: all 0.3s ease;
          font-size: 1rem;
          background: ${colors[theme].card};
          color: ${colors[theme].text};
        }

        .form-input:focus {
          outline: none;
          border-color: ${colors[theme].primary};
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .button-group {
          margin-top: 32px;
          display: flex;
          gap: 16px;
        }

        .button {
          padding: 14px 28px;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 600;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
        }

        .button.primary {
          background: ${colors[theme].gradient};
          color: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: none;
        }

        .button.primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transform: translateX(100%);
          transition: transform 0.6s ease;
        }

        .button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .button.primary:hover::before {
          transform: translateX(-100%);
        }

        .button.primary:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .button.secondary {
          background: ${colors[theme].card};
          color: ${colors[theme].text};
          border: 2px solid ${colors[theme].border};
          position: relative;
        }

        .button.secondary::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: ${colors[theme].gradient};
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .button.secondary:hover {
          border-color: transparent;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .button.secondary:hover::before {
          opacity: 1;
        }

        .button.secondary:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 32px;
          margin-bottom: 40px;
        }

        .chart-card {
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          background: ${colors[theme].card};
          border: 1px solid ${colors[theme].border};
          transition: all 0.3s ease;
          animation: slideUp 0.5s ease-out;
        }

        .chart-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
        }

        .chart-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: ${colors[theme].text};
        }

        .chart-container {
          height: 300px;
        }

        .progress-overview {
          grid-column: 1 / -1;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          background: ${colors[theme].card};
          border: 1px solid ${colors[theme].border};
          animation: slideUp 0.5s ease-out;
        }

        .progress-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }

        .progress-card {
          padding: 24px;
          border-radius: 12px;
          transition: all 0.3s ease;
          background: ${colors[theme].card};
          border: 1px solid ${colors[theme].border};
        }

        .progress-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .progress-title {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 12px;
          color: ${colors[theme].textSecondary};
        }

        .progress-value {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .progress-change {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .table-section {
          margin-top: 40px;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          background: ${colors[theme].card};
          border: 1px solid ${colors[theme].border};
          animation: slideUp 0.5s ease-out;
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .table-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: ${colors[theme].text};
        }

        .table-container {
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid ${colors[theme].border};
        }

        .table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .table th {
          padding: 16px;
          text-align: left;
          font-size: 0.95rem;
          font-weight: 600;
          color: ${colors[theme].text};
          background: ${colors[theme].card};
          border-bottom: 2px solid ${colors[theme].border};
        }

        .table td {
          padding: 16px;
          font-size: 0.95rem;
          color: ${colors[theme].text};
          border-bottom: 1px solid ${colors[theme].border};
        }

        .table tr:last-child td {
          border-bottom: none;
        }

        .table tr:hover td {
          background: ${theme === 'light' ? 'rgba(99, 102, 241, 0.05)' : 'rgba(129, 140, 248, 0.05)'};
        }

        @media (max-width: 1024px) {
          .main-content {
            width: 95%;
            padding: 24px;
          }

          .title {
            font-size: 2rem;
          }
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 20px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }

          .progress-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .table-section {
            padding: 24px;
          }
        }

        @media (max-width: 480px) {
          .main-content {
            padding: 16px;
          }

          .title {
            font-size: 1.75rem;
          }

          .progress-grid {
            grid-template-columns: 1fr;
          }

          .button-group {
            flex-direction: column;
            margin-top: 18px;
          }

          .table-section {
            padding: 20px;
          }

          .form-container {
            padding: 14px 8px 18px 8px;
            width: 98vw;
            max-width: 98vw;
          }
          .form-title {
            font-size: 1.35rem;
            font-weight: 800;
            margin-bottom: 12px;
            letter-spacing: -0.5px;
          }
          .form-label {
            font-size: 0.98rem;
            font-weight: 600;
            margin-bottom: 4px;
          }
          .form-input {
            font-size: 0.97rem;
            padding: 7px 10px;
          }
          .form-group {
            margin-bottom: 4px;
          }
          .button {
            font-size: 0.97rem;
            padding: 10px 16px;
          }
          .add-btn-text {
            display: none;
          }
        }
      `}</style>

      <main className="main-content">
        <header className="header">
          <div>
            <h1 className="title" style={{ color: currentColors.text }}>Health Growth Dashboard</h1>
            <p className="subtitle">Track your fitness journey and visualize your progress</p>
          </div>
          <button 
            onClick={toggleTheme}
            className={`theme-toggle ${theme}`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
          </button>
        </header>

        <div className="input-section" ref={inputSectionRef}>
          <button
            onClick={() => setIsAdding(true)}
            className="add-button"
            style={{ backgroundColor: currentColors.primary, color: 'white' }}
          >
            <FiPlus className="mr-2" />
            <span className="add-btn-text">Add Current Status</span>
          </button>
        </div>

        {isAdding && (
          <>
            <div className="modal-overlay" onClick={() => setIsAdding(false)} />
            <div className={`form-container ${theme}`}>
              <h2 className="form-title" style={{ color: currentColors.text }}>Add Current Health Metrics</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" style={{ color: currentColors.text }}>Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={newMetric.weight || ''}
                    onChange={handleInputChange}
                    className={`form-input ${theme}`}
                    placeholder="Enter weight"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: currentColors.text }}>Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={newMetric.height || ''}
                    onChange={handleInputChange}
                    className={`form-input ${theme}`}
                    placeholder="Enter height"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: currentColors.text }}>Body Fat (%)</label>
                  <input
                    type="number"
                    name="bodyFat"
                    value={newMetric.bodyFat || ''}
                    onChange={handleInputChange}
                    className={`form-input ${theme}`}
                    placeholder="Enter body fat %"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: currentColors.text }}>Muscle Mass (kg)</label>
                  <input
                    type="number"
                    name="muscleMass"
                    value={newMetric.muscleMass || ''}
                    onChange={handleInputChange}
                    className={`form-input ${theme}`}
                    placeholder="Enter muscle mass"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: currentColors.text }}>Water Percentage (%)</label>
                  <input
                    type="number"
                    name="waterPercentage"
                    value={newMetric.waterPercentage || ''}
                    onChange={handleInputChange}
                    className={`form-input ${theme}`}
                    placeholder="Enter water %"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: currentColors.text }}>Calories (kcal)</label>
                  <input
                    type="number"
                    name="calories"
                    value={newMetric.calories || ''}
                    onChange={handleInputChange}
                    className={`form-input ${theme}`}
                    placeholder="Enter calories"
                  />
                </div>
              </div>
              <div className="button-group">
                <button
                  onClick={handleAddMetric}
                  className="button primary"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="button secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}

        <section className="charts-grid">
          <div className={`chart-card ${theme}`}>
            <h2 className="chart-title" style={{ color: currentColors.text }}>Weight Progress</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rechartsLineData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={currentColors.border} strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke={currentColors.textSecondary} />
                  <YAxis stroke={currentColors.textSecondary} />
                  <ReTooltip contentStyle={{ background: currentColors.card, color: currentColors.text, border: `1px solid ${currentColors.border}` }} />
                  <ReLegend />
                  <ReLine type="monotone" dataKey="weight" stroke={currentColors.primary} strokeWidth={3} dot={{ r: 5, fill: currentColors.primary }} activeDot={{ r: 7 }} fill={currentColors.primary} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`chart-card ${theme}`}>
            <h2 className="chart-title" style={{ color: currentColors.text }}>Body Composition</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RePie 
                    data={bodyCompositionPieData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={80} 
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, value }) => {
                      const RADIAN = Math.PI / 180;
                      const radius =  outerRadius + 16;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text
                          x={x}
                          y={y}
                          fill={theme === 'dark' ? '#F8FAFC' : '#1E293B'}
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                          fontWeight={700}
                          fontSize={18}
                        >
                          {value}
                        </text>
                      );
                    }}
                  >
                    {bodyCompositionPieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </RePie>
                  <ReLegend
                    wrapperStyle={{
                      color: theme === 'dark' ? '#F8FAFC' : '#1E293B',
                      fontWeight: 600,
                      fontSize: 16,
                    }}
                  />
                  <ReTooltip content={renderPieTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`chart-card ${theme}`}>
            <h2 className="chart-title" style={{ color: currentColors.text }}>Body Fat Percentage</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rechartsBodyFatData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={currentColors.border} strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke={currentColors.textSecondary} />
                  <YAxis stroke={currentColors.textSecondary} />
                  <ReTooltip contentStyle={{ background: currentColors.card, color: currentColors.text, border: `1px solid ${currentColors.border}` }} />
                  <ReLegend />
                  <ReBar dataKey="bodyFat" fill={currentColors.primary} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`chart-card ${theme}`}>
            <h2 className="chart-title" style={{ color: currentColors.text }}>Calorie Intake</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rechartsLineData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={currentColors.border} strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke={currentColors.textSecondary} />
                  <YAxis stroke={currentColors.textSecondary} />
                  <ReTooltip contentStyle={{ background: currentColors.card, color: currentColors.text, border: `1px solid ${currentColors.border}` }} />
                  <ReLegend />
                  <ReLine type="monotone" dataKey="calories" stroke={currentColors.accent} strokeWidth={3} dot={{ r: 5, fill: currentColors.accent }} activeDot={{ r: 7 }} fill={currentColors.accent} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`progress-overview ${theme}`}>
            <h2 className="chart-title" style={{ color: currentColors.text }}>Progress Overview</h2>
            <div className="progress-grid">
              <div className={`progress-card ${theme}`}>
                <h3 className="progress-title" style={{ color: currentColors.textSecondary }}>Weight Change</h3>
                <p className="progress-value" style={{ color: currentColors.primary }}>
                  {metrics.length > 1 ? (metrics[metrics.length - 1].weight - metrics[0].weight).toFixed(1) : 0} kg
                </p>
                <p className="progress-change" style={{ color: currentColors.textSecondary }}>
                  {metrics.length > 1 ? 
                    (metrics[metrics.length - 1].weight > metrics[0].weight ? 'Increased' : 'Decreased') : 
                    'No change'}
                </p>
              </div>
              <div className={`progress-card ${theme}`}>
                <h3 className="progress-title" style={{ color: currentColors.textSecondary }}>Body Fat Change</h3>
                <p className="progress-value" style={{ color: currentColors.primary }}>
                  {metrics.length > 1 ? (metrics[metrics.length - 1].bodyFat - metrics[0].bodyFat).toFixed(1) : 0}%
                </p>
                <p className="progress-change" style={{ color: currentColors.textSecondary }}>
                  {metrics.length > 1 ? 
                    (metrics[metrics.length - 1].bodyFat > metrics[0].bodyFat ? 'Increased' : 'Decreased') : 
                    'No change'}
                </p>
              </div>
              <div className={`progress-card ${theme}`}>
                <h3 className="progress-title" style={{ color: currentColors.textSecondary }}>Muscle Mass Change</h3>
                <p className="progress-value" style={{ color: currentColors.primary }}>
                  {metrics.length > 1 ? (metrics[metrics.length - 1].muscleMass - metrics[0].muscleMass).toFixed(1) : 0} kg
                </p>
                <p className="progress-change" style={{ color: currentColors.textSecondary }}>
                  {metrics.length > 1 ? 
                    (metrics[metrics.length - 1].muscleMass > metrics[0].muscleMass ? 'Increased' : 'Decreased') : 
                    'No change'}
                </p>
              </div>
              <div className={`progress-card ${theme}`}>
                <h3 className="progress-title" style={{ color: currentColors.textSecondary }}>Calorie Change</h3>
                <p className="progress-value" style={{ color: currentColors.primary }}>
                  {metrics.length > 1 ? (metrics[metrics.length - 1].calories - metrics[0].calories) : 0} kcal
                </p>
                <p className="progress-change" style={{ color: currentColors.textSecondary }}>
                  {metrics.length > 1 ? 
                    (metrics[metrics.length - 1].calories > metrics[0].calories ? 'Increased' : 'Decreased') : 
                    'No change'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={`table-section ${theme}`}>
          <div className="table-header">
            <h2 className="table-title" style={{ color: currentColors.text }}>Recent Measurements</h2>
            <button
              onClick={scrollToInput}
              className="add-button"
              style={{ backgroundColor: currentColors.primary, color: 'white' }}
            >
              <FiPlus className="mr-1" />
              <span className="add-btn-text">Add New</span>
            </button>
          </div>
          <div className="table-container">
            <table className={`table ${theme}`}>
              <thead>
                <tr>
                  <th style={{ color: currentColors.text }}>Date</th>
                  <th style={{ color: currentColors.text }}>Weight (kg)</th>
                  <th style={{ color: currentColors.text }}>Height (cm)</th>
                  <th style={{ color: currentColors.text }}>Body Fat (%)</th>
                  <th style={{ color: currentColors.text }}>Muscle Mass (kg)</th>
                  <th style={{ color: currentColors.text }}>Water (%)</th>
                  <th style={{ color: currentColors.text }}>Calories</th>
                </tr>
              </thead>
              <tbody>
                {metrics.slice().reverse().map((metric, index) => (
                  <tr key={metric.id}>
                    <td style={{ color: currentColors.text }}>
                      {new Date(metric.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ color: currentColors.text }}>{metric.weight}</td>
                    <td style={{ color: currentColors.text }}>{metric.height}</td>
                    <td style={{ color: currentColors.text }}>{metric.bodyFat}</td>
                    <td style={{ color: currentColors.text }}>{metric.muscleMass}</td>
                    <td style={{ color: currentColors.text }}>{metric.waterPercentage}</td>
                    <td style={{ color: currentColors.text }}>{metric.calories}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
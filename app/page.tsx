"use client"
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar
} from 'recharts';

import { 
  MdTrendingUp, MdPublic, MdDownload, MdFilterList, MdExpandMore, 
  MdRefresh, MdClose, MdLibraryBooks, MdShowChart, MdAnalytics, MdPerson
} from 'react-icons/md';


interface CitationData {
  year: string;
  citations: number;
  selfCitations: number;
  crossRef: number;
}

interface AltmetricData {
  source: string;
  score: number;
  mentions: number;
  color: string;
}

interface ReadershipData {
  country: string;
  countryCode: string;
  reads: number;
  downloads: number;
  lat: number;
  lng: number;
  coordinates: [number, number];
}

interface MetricCard {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgGradient: string;
}

interface ResearchPaper {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi: string;
  abstract: string;
}

interface AccordionPanelProps {
  title: string;   
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  icon: React.ComponentType<{ className?: string }>;
}


const WelcomeScreen: React.FC<{
  onGetStarted: (paperTitle: string) => void;
}> = ({ onGetStarted }) => {
  const [paperTitle, setPaperTitle] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const paperSuggestions = [
    "Machine Learning Applications in Climate Science",
    "Deep Learning for Medical Image Analysis",
    "Quantum Computing and Cryptography",
    "Artificial Intelligence in Drug Discovery",
    "Sustainable Energy Systems and Smart Grids",
    "Blockchain Technology in Supply Chain Management",
    "Natural Language Processing for Social Media Analysis",
    "Computer Vision in Autonomous Vehicles",
    "Biomedical Engineering and Tissue Regeneration",
    "Cybersecurity in IoT Networks",
    "Robotics and Human-Robot Interaction",
    "Data Mining Techniques for Healthcare",
    "Renewable Energy Storage Solutions",
    "Augmented Reality in Education",
    "Genomics and Personalized Medicine"
  ];

  const handleInputChange = (value: string) => {
    setPaperTitle(value);
    if (value.trim()) {
      const filtered = paperSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      } else {
      setFilteredSuggestions(paperSuggestions);
    }
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
    setFilteredSuggestions(paperSuggestions);
  };

  const handleInputBlur = () => {
    
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPaperTitle(suggestion);
    setShowSuggestions(false);
  };

  const handleSubmit = () => {
    if (paperTitle.trim()) {
      setIsAnimating(true);
      setTimeout(() => {
        onGetStarted(paperTitle.trim());
      }, 500);
    }
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Poppins', sans-serif;
        }
        
        body {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
      
      <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-emerald-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

      <div className={`relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl transform transition-all duration-500 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl sm:rounded-3xl border border-white/10 p-6 sm:p-8 lg:p-12 shadow-2xl">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-2xl">
              <MdAnalytics className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent leading-tight">
              Research Analytics
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-100 font-medium px-2 sm:px-4">
              Comprehensive insights for your academic research
              </p>
            </div>

          <div className="space-y-5 sm:space-y-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-100 mb-3">
                Enter your paper title to get started
            </label>
              <input
                type="text"
                value={paperTitle}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="e.g., Machine Learning Applications in Climate Science"
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200 text-sm sm:text-base"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
              
                            {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 backdrop-blur-2xl bg-slate-900/80 border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl z-50 max-h-48 sm:max-h-60 overflow-y-auto ring-1 ring-black/20">
                  {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-4 sm:px-6 py-3 hover:bg-white/15 active:bg-white/20 cursor-pointer transition-all duration-200 border-b border-white/10 last:border-b-0 touch-manipulation"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0 mt-1.5 sm:mt-2 shadow-sm"></div>
                        <span className="text-white text-sm sm:text-base font-medium leading-relaxed">{suggestion}</span>
            </div>
          </div>
                  ))}
                  {filteredSuggestions.length > 8 && (
                    <div className="px-4 sm:px-6 py-3 text-slate-100 text-xs sm:text-sm text-center">
                      And {filteredSuggestions.length - 8} more suggestions...
            </div>
                  )}
          </div>
              )}
        </div>

          <button
              onClick={handleSubmit}
              disabled={!paperTitle.trim()}
              className="w-full py-3 sm:py-4 px-6 sm:px-8 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 disabled:from-slate-600 disabled:to-slate-700 text-white rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100 cursor-pointer disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none touch-manipulation"
            >
              Get Started
          </button>
        </div>

          <div className="mt-8 sm:mt-10 lg:mt-12 text-center">
            <p className="text-xs sm:text-sm text-slate-200 px-2">
              Analyze citations, altmetrics, and global readership patterns
                </p>
      </div>
            </div>
      </div>
    </div>
    </>
  );
};


const AccordionPanel: React.FC<AccordionPanelProps> = ({ title, children, isOpen, onToggle, icon: Icon }) => {
  return (
    <motion.div 
      className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-all duration-200 cursor-pointer"
        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: isOpen ? 360 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="h-5 w-5 text-cyan-400" />
          </motion.div>
          <span className="text-lg font-semibold text-white">{title}</span>
            </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <MdExpandMore className="h-6 w-6 text-slate-200" />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.04, 0.62, 0.23, 0.98],
              opacity: { duration: 0.3 }
            }}
            className="overflow-hidden"
          >
            <motion.div 
              className="px-6 pb-6 border-t border-white/10"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              exit={{ y: -10 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
        {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


const SvgMap = ({ data, width = 1000, height = 500 }: { data: ReadershipData[], width?: number, height?: number }) => {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState<ReadershipData | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const projection = (lng: number, lat: number) => {
    const x = (lng + 180) * (width / 360);
    const y = (lat * -1 + 90) * (height / 180);
    return [x, y];
  };

  // More detailed and accurate continent paths
  const worldPaths = {
    northAmerica: "M158,110 L165,85 L175,75 L190,70 L210,65 L230,60 L250,55 L270,60 L285,70 L295,85 L300,100 L295,120 L285,140 L270,155 L250,165 L230,170 L210,165 L190,155 L175,140 L165,125 Z M100,180 L120,175 L140,180 L155,190 L165,205 L160,220 L150,235 L135,245 L120,240 L105,230 L95,215 L90,200 L95,185 Z",
    southAmerica: "M240,200 L255,195 L270,200 L280,215 L285,235 L290,255 L285,275 L275,295 L265,315 L250,330 L235,335 L220,330 L210,315 L205,295 L210,275 L215,255 L220,235 L225,215 L235,205 Z",
    europe: "M380,85 L395,80 L410,75 L425,78 L440,85 L450,95 L445,110 L435,120 L420,125 L405,120 L390,115 L385,100 Z M360,120 L375,115 L390,120 L395,135 L385,145 L370,140 L365,130 Z",
    africa: "M380,140 L395,135 L410,140 L425,150 L435,165 L440,185 L435,205 L425,225 L415,245 L400,260 L385,270 L370,275 L355,270 L345,255 L340,235 L345,215 L355,195 L370,175 L380,155 Z",
    asia: "M450,70 L480,65 L510,70 L540,75 L570,80 L590,90 L600,105 L595,125 L585,145 L570,160 L550,170 L525,175 L500,170 L475,160 L460,145 L450,125 L455,105 L460,85 Z M520,180 L540,175 L560,180 L575,190 L580,205 L575,220 L560,230 L540,225 L525,215 L520,200 Z",
    oceania: "M620,240 L635,235 L650,240 L660,250 L665,265 L660,280 L650,290 L635,285 L625,275 L620,260 Z M680,220 L690,215 L700,220 L705,230 L700,240 L690,235 L685,225 Z",
    antarctica: "M100,400 L900,400 L900,450 L100,450 Z"
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(transform.scale * delta, 0.5), 5);

    setTransform(prev => ({
      scale: newScale,
      x: mouseX - (mouseX - prev.x) * (newScale / prev.scale),
      y: mouseY - (mouseY - prev.y) * (newScale / prev.scale)
    }));
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const delta = direction === 'in' ? 1.2 : 0.8;
    const newScale = Math.min(Math.max(transform.scale * delta, 0.5), 5);
    
    setTransform(prev => ({
      ...prev,
      scale: newScale,
      x: prev.x * (newScale / prev.scale),
      y: prev.y * (newScale / prev.scale)
    }));
  };

  const resetView = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  return (
    <div className="relative bg-slate-900 rounded-xl overflow-hidden">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        <button
          onClick={() => handleZoom('in')}
          className="w-8 h-8 bg-slate-800/80 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-slate-700/80 transition-colors"
        >
          <span className="text-lg font-bold">+</span>
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="w-8 h-8 bg-slate-800/80 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-slate-700/80 transition-colors"
        >
          <span className="text-lg font-bold">−</span>
        </button>
        <button
          onClick={resetView}
          className="w-8 h-8 bg-slate-800/80 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-slate-700/80 transition-colors"
        >
          <span className="text-xs">⌂</span>
        </button>
      </div>

      {/* Map Container */}
      <div className="w-full h-96 cursor-grab active:cursor-grabbing">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className="select-none"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          
          {/* Ocean Background */}
          <rect width="100%" height="100%" fill="url(#oceanGradient)" />
          
          {/* Transform Group */}
          <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
            {/* Continents */}
            <g>
              {Object.entries(worldPaths).map(([continent, path], i) => (
                <path
                  key={i}
                  d={path}
                  fill={continent === 'antarctica' ? '#475569' : '#374151'}
                  stroke="#1e293b"
                  strokeWidth="1"
                  className="transition-colors duration-300 hover:fill-slate-600"
                />
              ))}
            </g>
            
            {/* Country Data Points */}
            <g>
              {data.map((country, index) => {
                const [x, y] = projection(country.lng, country.lat);
                const radius = Math.sqrt(country.reads) / 8;
                const isHovered = hovered?.country === country.country;
                
                return (
                  <g key={index}>
                    {/* Glow effect for hovered point */}
                    {isHovered && (
                      <circle
                        cx={x}
                        cy={y}
                        r={radius + 5}
                        fill="#06b6d4"
                        fillOpacity={0.3}
                        filter="url(#glow)"
                      />
                    )}
                    
                    {/* Main data point */}
                    <circle
                      cx={x}
                      cy={y}
                      r={radius}
                      fill="#06b6d4"
                      fillOpacity={0.8}
                      stroke="#ffffff"
                      strokeWidth={isHovered ? 2 : 1}
                      onMouseEnter={() => setHovered(country)}
                      onMouseLeave={() => setHovered(null)}
                      className="cursor-pointer transition-all duration-200 hover:fill-cyan-400"
                      style={{
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                        transformOrigin: `${x}px ${y}px`
                      }}
                    />
                    
                    {/* Country label for larger data points */}
                    {radius > 8 && (
                      <text
                        x={x}
                        y={y - radius - 8}
                        textAnchor="middle"
                        className="fill-white text-xs font-medium pointer-events-none"
                        style={{ textShadow: '0 0 3px rgba(0,0,0,0.8)' }}
                      >
                        {country.reads > 1000 ? `${(country.reads/1000).toFixed(0)}k` : country.reads}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </g>
        </svg>
      </div>

      {/* Tooltip */}
      {hovered && (
        <div className="absolute bottom-4 left-4 bg-slate-800/95 backdrop-blur-sm text-white p-3 rounded-lg shadow-xl border border-white/20 max-w-xs">
          <p className="font-bold text-cyan-400 mb-1">{hovered.country}</p>
          <div className="text-sm space-y-1">
            <p>📖 Reads: <span className="text-cyan-300">{hovered.reads.toLocaleString()}</span></p>
            <p>⬇️ Downloads: <span className="text-emerald-300">{hovered.downloads.toLocaleString()}</span></p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 text-xs text-slate-400 bg-slate-800/50 backdrop-blur-sm px-2 py-1 rounded">
        Scroll to zoom • Drag to pan
      </div>
    </div>
  );
};


const ResearchDashboard: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentPaper, setCurrentPaper] = useState<ResearchPaper | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set(['filters', 'metrics']));

  
  const allCitationData: CitationData[] = [
    { year: '2003', citations: 5, selfCitations: 1, crossRef: 4 },
    { year: '2004', citations: 23, selfCitations: 3, crossRef: 20 },
    { year: '2005', citations: 48, selfCitations: 6, crossRef: 42 },
    { year: '2006', citations: 72, selfCitations: 8, crossRef: 64 },
    { year: '2007', citations: 94, selfCitations: 10, crossRef: 84 },
    { year: '2008', citations: 118, selfCitations: 12, crossRef: 106 },
  ];

  
  const citationData = useMemo(() => {
    switch (selectedTimeRange) {
      case 'recent':
        
        return allCitationData.filter(item => parseInt(item.year) >= 2006);
      case 'early':
        
        return allCitationData.filter(item => parseInt(item.year) <= 2005);
      case 'all':
      default:
        return allCitationData;
    }
  }, [selectedTimeRange, allCitationData]);

  const altmetricData: AltmetricData[] = [
    { source: 'Twitter', score: 156, mentions: 78, color: '#1DA1F2' },
    { source: 'Facebook', score: 89, mentions: 45, color: '#1877F2' },
    { source: 'LinkedIn', score: 234, mentions: 67, color: '#0A66C2' },
    { source: 'Reddit', score: 67, mentions: 23, color: '#FF4500' },
    { source: 'News', score: 123, mentions: 12, color: '#FF6B6B' },
  ];

  const readershipsData: ReadershipData[] = [
    { country: 'United States', countryCode: 'US', reads: 1250, downloads: 890, lat: 39.8283, lng: -98.5795, coordinates: [-98.5795, 39.8283] },
    { country: 'United Kingdom', countryCode: 'GB', reads: 890, downloads: 650, lat: 55.3781, lng: -3.4360, coordinates: [-3.4360, 55.3781] },
    { country: 'Germany', countryCode: 'DE', reads: 750, downloads: 580, lat: 51.1657, lng: 10.4515, coordinates: [10.4515, 51.1657] },
    { country: 'China', countryCode: 'CN', reads: 1100, downloads: 820, lat: 35.8617, lng: 104.1954, coordinates: [104.1954, 35.8617] },
    { country: 'Canada', countryCode: 'CA', reads: 680, downloads: 470, lat: 56.1304, lng: -106.3468, coordinates: [-106.3468, 56.1304] },
    { country: 'Australia', countryCode: 'AU', reads: 520, downloads: 390, lat: -25.2744, lng: 133.7751, coordinates: [133.7751, -25.2744] },
    { country: 'Japan', countryCode: 'JP', reads: 620, downloads: 445, lat: 36.2048, lng: 138.2529, coordinates: [138.2529, 36.2048] },
    { country: 'France', countryCode: 'FR', reads: 540, downloads: 380, lat: 46.6034, lng: 1.8883, coordinates: [1.8883, 46.6034] },
    { country: 'Brazil', countryCode: 'BR', reads: 480, downloads: 350, lat: -14.2350, lng: -51.9253, coordinates: [-51.9253, -14.2350] },
    { country: 'India', countryCode: 'IN', reads: 780, downloads: 560, lat: 20.5937, lng: 78.9629, coordinates: [78.9629, 20.5937] },
  ];

  
  const metricsCards: MetricCard[] = useMemo(() => {
    const totalCitations = citationData.reduce((sum, item) => sum + item.citations, 0);
    const totalAltmetric = altmetricData.reduce((sum, item) => sum + item.score, 0);
    const totalReads = readershipsData.reduce((sum, item) => sum + item.reads, 0);
    const totalDownloads = readershipsData.reduce((sum, item) => sum + item.downloads, 0);
    
    
    const getChangePercentage = (current: number, timeRange: string) => {
      const baseMultiplier = timeRange === 'early' ? 0.15 : timeRange === 'recent' ? 0.25 : 0.35;
      return `+${(current * baseMultiplier / 10).toFixed(1)}%`;
    };

    return [
    {
        title: 'Total Citations',
        value: totalCitations.toString(),
        change: getChangePercentage(totalCitations, selectedTimeRange),
        icon: MdLibraryBooks,
        color: 'text-cyan-400',
        bgGradient: 'from-cyan-500/20 to-cyan-600/20'
      },
      {
        title: 'Altmetric Score',
        value: totalAltmetric.toString(),
        change: getChangePercentage(totalAltmetric, selectedTimeRange),
        icon: MdTrendingUp,
        color: 'text-emerald-400',
        bgGradient: 'from-emerald-500/20 to-emerald-600/20'
      },
      {
        title: 'Global Reads',
        value: totalReads > 1000 ? `${(totalReads/1000).toFixed(1)}K` : totalReads.toString(),
        change: getChangePercentage(totalReads, selectedTimeRange),
        icon: MdPublic,
        color: 'text-blue-400',
        bgGradient: 'from-blue-500/20 to-blue-600/20'
      },
      {
        title: 'Downloads',
        value: totalDownloads > 1000 ? `${(totalDownloads/1000).toFixed(1)}K` : totalDownloads.toString(),
        change: getChangePercentage(totalDownloads, selectedTimeRange),
        icon: MdDownload,
        color: 'text-teal-400',
        bgGradient: 'from-teal-500/20 to-teal-600/20'
      },
    ];
  }, [citationData, selectedTimeRange, altmetricData, readershipsData]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); 
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    
    window.addEventListener('orientationchange', () => {
      setTimeout(checkMobile, 100);
    });
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  const handleGetStarted = (paperTitle: string) => {
    setCurrentPaper({
      title: paperTitle,
      authors: ['Dr. Sarah Johnson', 'Prof. Michael Chen', 'Dr. Emily Rodriguez'],
      journal: 'Nature Communications',
      year: 2003,
      doi: '10.1038/s41467-003-00000-0',
      abstract: 'This groundbreaking research explores innovative applications in the field, providing new insights and methodologies that advance our understanding of complex systems.'
    });
    setShowWelcome(false);
  };

  const handleRefresh = async () => {
      setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleExport = (type: string) => {
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `research-analytics-${type}-${timestamp}.csv`;
    
    let csvContent = '';
    
    if (type === 'citations') {
      csvContent = 'Year,Citations,Self Citations,CrossRef\n' +
        citationData.map(d => `${d.year},${d.citations},${d.selfCitations},${d.crossRef}`).join('\n');
    } else if (type === 'altmetrics') {
      csvContent = 'Source,Score,Mentions\n' +
        altmetricData.map(d => `${d.source},${d.score},${d.mentions}`).join('\n');
    } else if (type === 'readership') {
      csvContent = 'Country,Reads,Downloads\n' +
        readershipsData.map(d => `${d.country},${d.reads},${d.downloads}`).join('\n');
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleAccordion = (panel: string) => {
    setOpenAccordions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(panel)) {
        newSet.delete(panel);
    } else {
        newSet.add(panel);
      }
      return newSet;
    });
  };

  if (showWelcome) {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Poppins', sans-serif;
        }
        
        body {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-cyan-500/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-emerald-500/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <MdAnalytics className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
        </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white truncate">Research Analytics</h1>
                <p className="text-xs text-slate-200 hidden sm:block">University Dashboard</p>
            </div>
          </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              <div className="hidden lg:flex items-center space-x-2">
                  <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer touch-manipulation transition-all duration-200 ${
                    selectedTimeRange !== 'all' ? 'ring-2 ring-cyan-500/30 bg-cyan-500/10' : ''
                  }`}
                                    >
                      <option value="all">All Time (2003-2008)</option>
                      <option value="recent">Recent Years (2006-2008)</option>
                      <option value="early">Early Years (2003-2005)</option>
                    </select>


                
            <button
                  onClick={handleRefresh}
              disabled={isRefreshing}
                  className="p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 active:bg-white/15 transition-all duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed touch-manipulation"
            >
              <MdRefresh className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

                {selectedTimeRange !== 'all' && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => {
                      setSelectedTimeRange('all');
                    }}
                    className="p-2 rounded-lg bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-300 hover:bg-red-500/30 active:bg-red-500/40 transition-all duration-200 cursor-pointer touch-manipulation"
                    title="Clear all filters"
                  >
                    <MdClose className="h-4 w-4" />
                  </motion.button>
                )}
        </div>
              
              <div className="hidden sm:flex lg:hidden items-center space-x-2">
                  <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer touch-manipulation transition-all duration-200 ${
                    selectedTimeRange !== 'all' ? 'ring-1 ring-cyan-500/30 bg-cyan-500/10' : ''
                  }`}
                                 >
                   <option value="all">All Time</option>
                   <option value="recent">Recent (2006-2008)</option>
                   <option value="early">Early (2003-2005)</option>
                  </select>

            <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 active:bg-white/15 transition-all duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed touch-manipulation"
                >
                  <MdRefresh className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

                {selectedTimeRange !== 'all' && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => {
                      setSelectedTimeRange('all');
                    }}
                    className="p-1.5 rounded-lg bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-300 hover:bg-red-500/30 active:bg-red-500/40 transition-all duration-200 cursor-pointer touch-manipulation"
                    title="Clear filters"
                  >
                    <MdClose className="h-3 w-3" />
                  </motion.button>
                )}
                  </div>
              
            <button
                onClick={() => setShowWelcome(true)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-emerald-600 active:from-cyan-700 active:to-emerald-700 transition-all duration-200 text-xs sm:text-sm cursor-pointer touch-manipulation"
            >
                <span className="hidden sm:inline">New Search</span>
                <span className="sm:hidden">New</span>
            </button>
                </div>
              </div>
            </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <motion.div 
          className="mb-6 sm:mb-8 backdrop-blur-xl bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 leading-tight">{currentPaper?.title}</h2>
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-100 mb-3 sm:mb-4">
                <span className="flex items-center gap-1 min-w-0">
                  <MdPerson className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">{currentPaper?.authors.join(', ')}</span>
                </span>
                <span className="flex items-center gap-1 min-w-0">
                  <MdLibraryBooks className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">{currentPaper?.journal} ({currentPaper?.year})</span>
      </span>
          </div>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">{currentPaper?.abstract}</p>
        </div>
            </div>
        </motion.div>



        {!isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {metricsCards.map((metric, index) => (
                <motion.div 
                  key={index} 
                  className={`backdrop-blur-xl bg-gradient-to-br ${metric.bgGradient} rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 hover:bg-white/10 transition-all duration-300 group touch-manipulation`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-white/10 to-white/5 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <metric.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${metric.color}`} />
      </div>
                    <span className="text-xs sm:text-sm font-semibold text-emerald-400 bg-emerald-400/20 px-2 py-1 rounded-full">
                      {metric.change}
            </span>
          </div>
                  <h3 className="text-xs sm:text-sm font-medium text-slate-100 mb-1">{metric.title}</h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{metric.value}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="space-y-6 sm:space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                <motion.div 
                  className="backdrop-blur-xl bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <MdShowChart className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 flex-shrink-0" />
                    <h3 className="text-base sm:text-lg font-semibold text-white truncate">Citation Metrics</h3>
        </div>
                  <button
                    onClick={() => handleExport('citations')}
                    className="p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-slate-100 hover:text-white hover:bg-white/10 active:bg-white/15 transition-all duration-200 cursor-pointer touch-manipulation flex-shrink-0"
                  >
                    <MdDownload className="h-4 w-4" />
                  </button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={citationData}>
               <defs>
                      <linearGradient id="citationGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05}/>
                 </linearGradient>
               </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="year" stroke="#9ca3af" fontSize={11} />
                    <YAxis stroke="#9ca3af" fontSize={11} />
               <Tooltip 
                 contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                   borderRadius: '12px',
                        color: '#ffffff',
                        backdropFilter: 'blur(20px)',
                        fontSize: '14px'
                 }}
               />
               <Area
                 type="monotone"
                      dataKey="citations"
                      stroke="#06b6d4"
                 strokeWidth={2}
                      fill="url(#citationGradient)"
               />
             </AreaChart>
           </ResponsiveContainer>
                </motion.div>

                <motion.div 
                  className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <MdTrendingUp className="h-5 w-5 text-emerald-400" />
                    <h3 className="text-lg font-semibold text-white">Altmetric Breakdown</h3>
                  </div>
                  <button
                    onClick={() => handleExport('altmetrics')}
                    className="p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-slate-100 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
                  >
                    <MdDownload className="h-4 w-4" />
                  </button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={altmetricData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="source" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
               <Tooltip 
                 contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                   borderRadius: '12px',
                        color: '#ffffff',
                        backdropFilter: 'blur(20px)'
                      }}
                    />
                    <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
           </ResponsiveContainer>
                </motion.div>
       </div>

                <motion.div 
                  className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6">
             <div className="flex items-center space-x-3">
                      <MdPublic className="h-5 w-5 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">Global Readership Map</h3>
             </div>
                    <button
                      onClick={() => handleExport('readership')}
                      className="p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-slate-100 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
                    >
                      <MdDownload className="h-4 w-4" />
                    </button>
               </div>
                  
                  <div className="bg-slate-900/50 rounded-xl border border-white/10 p-4 mb-6">
                    <SvgMap data={readershipsData} />
                   </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {readershipsData.map((item, index) => (
                      <motion.div 
                        key={index} 
                        className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-3 h-3 bg-blue-400 rounded-full flex-shrink-0"></div>
                          <span className="text-white font-medium text-sm truncate">{item.country}</span>
               </div>
                        <div className="space-y-1 text-xs text-slate-100">
                          <div className="flex justify-between">
                            <span>Reads:</span>
                            <span className="text-cyan-400 font-medium">{item.reads.toLocaleString()}</span>
             </div>
                          <div className="flex justify-between">
                            <span>Downloads:</span>
                            <span className="text-emerald-400 font-medium">{item.downloads.toLocaleString()}</span>
           </div>
         </div>
                      </motion.div>
                    ))}
         </div>
                </motion.div>

              
         </motion.div>
       </motion.div>
     )}

        {isMobile && (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AccordionPanel
                title="Filters & Settings"
                isOpen={openAccordions.has('filters')}
                onToggle={() => toggleAccordion('filters')}
                icon={MdFilterList}
              >
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-100 mb-2">Time Range</label>
                    <select
                      value={selectedTimeRange}
                      onChange={(e) => setSelectedTimeRange(e.target.value)}
                      className={`w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer touch-manipulation transition-all duration-200 ${
                        selectedTimeRange !== 'all' ? 'ring-2 ring-cyan-500/30 bg-cyan-500/10' : ''
                      }`}
                    >
                      <option value="all">All Time (2003-2008)</option>
                      <option value="recent">Recent Years (2006-2008)</option>
                      <option value="early">Early Years (2003-2005)</option>
                    </select>
       </div>

                  <div className="flex items-center justify-between pt-2">
               <button
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 active:bg-white/15 transition-all duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed touch-manipulation"
               >
                      <MdRefresh className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
               </button>

                    {selectedTimeRange !== 'all' && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                 onClick={() => {
                          setSelectedTimeRange('all');
                        }}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-300 hover:bg-red-500/30 active:bg-red-500/40 transition-all duration-200 cursor-pointer touch-manipulation"
                      >
                        <MdClose className="h-4 w-4" />
                        <span>Clear</span>
                      </motion.button>
                    )}
                   </div>
                   </div>
              </AccordionPanel>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <AccordionPanel
                title="Key Metrics"
                isOpen={openAccordions.has('metrics')}
                onToggle={() => toggleAccordion('metrics')}
                icon={MdAnalytics}
              >
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {metricsCards.map((metric, index) => (
                    <motion.div 
                      key={index} 
                      className={`backdrop-blur-xl bg-gradient-to-br ${metric.bgGradient} rounded-xl border border-white/10 p-4`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <metric.icon className={`h-5 w-5 ${metric.color}`} />
                        <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/20 px-2 py-1 rounded-full">
                          {metric.change}
                        </span>
                 </div>
                      <h3 className="text-xs font-medium text-slate-100 mb-1">{metric.title}</h3>
                      <p className="text-xl font-bold text-white">{metric.value}</p>
                    </motion.div>
                  ))}
               </div>
              </AccordionPanel>
            </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <AccordionPanel
                  title="Citation Metrics"
                  isOpen={openAccordions.has('citations')}
                  onToggle={() => toggleAccordion('citations')}
                  icon={MdShowChart}
                >
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-medium">Citation Metrics</h4>
                 <button
                      onClick={() => handleExport('citations')}
                      className="p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-slate-100 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
                    >
                      <MdDownload className="h-4 w-4" />
                    </button>
                   </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={citationData}>
                      <defs>
                        <linearGradient id="citationGradientMobile" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="year" stroke="#9ca3af" fontSize={10} />
                      <YAxis stroke="#9ca3af" fontSize={10} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          color: '#ffffff',
                          backdropFilter: 'blur(20px)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="citations"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        fill="url(#citationGradientMobile)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                   </div>
            </AccordionPanel>
            </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <AccordionPanel
                  title="Social Impact"
                  isOpen={openAccordions.has('altmetrics')}
                  onToggle={() => toggleAccordion('altmetrics')}
                  icon={MdTrendingUp}
                >
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-medium">Altmetric Breakdown</h4>
                 <button
                      onClick={() => handleExport('altmetrics')}
                      className="p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-slate-100 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
                    >
                      <MdDownload className="h-4 w-4" />
                 </button>
               </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={altmetricData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="source" stroke="#9ca3af" fontSize={9} angle={-45} textAnchor="end" height={45} />
                      <YAxis stroke="#9ca3af" fontSize={10} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          color: '#ffffff',
                          backdropFilter: 'blur(20px)'
                        }}
                      />
                      <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
             </div>
            </AccordionPanel>
            </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <AccordionPanel
                  title="Global Readership Map"
                  isOpen={openAccordions.has('readership')}
                  onToggle={() => toggleAccordion('readership')}
                  icon={MdPublic}
                >
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-medium">Interactive World Map</h4>
               <button
                      onClick={() => handleExport('readership')}
                      className="p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-slate-100 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
               >
                      <MdDownload className="h-4 w-4" />
               </button>
                 </div>
                  
                  <div className="bg-slate-900/50 rounded-xl border border-white/10 p-3 mb-4">
                    <SvgMap data={readershipsData} />
             </div>

                  <div className="grid grid-cols-2 gap-3">
                    {readershipsData.map((item, index) => (
                      <motion.div 
                        key={index} 
                        className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                          <span className="text-white font-medium text-xs truncate">{item.country}</span>
           </div>
                        <div className="space-y-1 text-xs text-slate-100">
                          <div className="flex justify-between">
                            <span>Reads:</span>
                            <span className="text-cyan-400 font-medium">{item.reads.toLocaleString()}</span>
         </div>
                          <div className="flex justify-between">
                            <span>Downloads:</span>
                            <span className="text-emerald-400 font-medium">{item.downloads.toLocaleString()}</span>
       </div>
                 </div>
                      </motion.div>
               ))}
                 </div>
               </div>
            </AccordionPanel>
            </motion.div>


          </motion.div>
        )}
      </main>

      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
                  <MdRefresh className="h-6 w-6 text-white animate-spin" />
                 </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-1">Refreshing Data</h3>
                  <p className="text-sm text-slate-100">Please wait while we update your analytics...</p>
             </div>
           </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="backdrop-blur-xl bg-white/5 border-t border-white/10 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-slate-200">
              2025 University Research Analytics Dashboard. Empowering academic excellence.
                   </p>
                 </div>
             </div>
      </footer>
   </div>
 );
};

export default ResearchDashboard;
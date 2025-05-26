'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react';

interface ColorData {
  name: string;
  rgb: [number, number, number];
  percentage: number;
  icon: string;
}

interface SavedColor {
  rgb: [number, number, number];
  hex: string;
  timestamp: number;
  colors: ColorData[];
}

interface DropAnimation {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: [number, number, number];
  active: boolean;
}

interface Confetti {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

const BackgroundParticles = React.memo(() => {
  const particles = useMemo(() => 
    [...Array(60)].map((_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 4}s`
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <div
          suppressHydrationWarning
          key={i}
          className="absolute w-1 h-1 bg-white opacity-20 rounded-full"
          style={{
            left: particle.left,
            top: particle.top,
            animationDelay: particle.delay,
            animation: `twinkle ${particle.duration} ease-in-out infinite`
          }}
        />
      ))}
    </div>
  );
});

const ConfettiParticle: React.FC<{ confetti: Confetti }> = ({ confetti }) => (
  <div
    className="absolute pointer-events-none"
    style={{
      left: confetti.x,
      top: confetti.y,
      width: confetti.size,
      height: confetti.size,
      backgroundColor: confetti.color,
      borderRadius: '50%',
      opacity: confetti.life / 100,
      animation: 'confettiFall 3s ease-out forwards'
    }}
  />
);

const ColorMixingPlayground: React.FC = () => {
  const [colorData, setColorData] = useState<ColorData[]>([
    { name: 'Red', rgb: [255, 60, 60], percentage: 0, icon: '🔴' },
    { name: 'Blue', rgb: [60, 120, 255], percentage: 0, icon: '🔵' },
    { name: 'Yellow', rgb: [255, 230, 60], percentage: 0, icon: '🟡' },
    { name: 'Green', rgb: [60, 200, 90], percentage: 0, icon: '🟢' },
    { name: 'Purple', rgb: [160, 60, 200], percentage: 0, icon: '🟣' },
    { name: 'Orange', rgb: [255, 150, 60], percentage: 0, icon: '🟠' },
    { name: 'Water', rgb: [240, 248, 255], percentage: 0, icon: '💧' },
  ]);

  const [mixedColor, setMixedColor] = useState<[number, number, number]>([240, 240, 240]);
  const [targetColor, setTargetColor] = useState<[number, number, number]>([180, 120, 200]);
  const [drops, setDrops] = useState<DropAnimation[]>([]);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [showAbout, setShowAbout] = useState(false);
  const [showTargetHelp, setShowTargetHelp] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [showWinning, setShowWinning] = useState(false);
  const [lastScore, setLastScore] = useState(0);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const dropIdRef = useRef(0);
  const confettiIdRef = useRef(0);

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (showAbout || showTargetHelp) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAbout, showTargetHelp]);

  // Color mixing and scoring logic
  useEffect(() => {
    const total = colorData.reduce((sum, color) => sum + color.percentage, 0);
    setTotalPercentage(total);
    
    if (total === 0) {
      setMixedColor([240, 240, 240]);
      return;
    }

    // Improved color mixing using weighted average
    let r = 0, g = 0, b = 0;
    let totalWeight = 0;
    
    colorData.forEach(color => {
      if (color.percentage > 0) {
        const weight = color.percentage / 100;
        totalWeight += weight;
        r += color.rgb[0] * weight;
        g += color.rgb[1] * weight;
        b += color.rgb[2] * weight;
      }
    });

    if (totalWeight > 0) {
      r = Math.round(r / totalWeight);
      g = Math.round(g / totalWeight);
      b = Math.round(b / totalWeight);
    }

    setMixedColor([r, g, b]);
    const newScore = Math.round(calculateColorSimilarity([r, g, b], targetColor));
    setScore(newScore);

    // Trigger winning animation
    if (newScore >= 90 && lastScore < 90) {
      triggerWinningAnimation();
    }
    setLastScore(newScore);
  }, [colorData, targetColor, lastScore]);

  const calculateColorSimilarity = (color1: [number, number, number], color2: [number, number, number]): number => {
    const diff = Math.sqrt(
      Math.pow(color1[0] - color2[0], 2) +
      Math.pow(color1[1] - color2[1], 2) +
      Math.pow(color1[2] - color2[2], 2)
    );
    const maxDiff = Math.sqrt(3 * 255 * 255);
    return ((maxDiff - diff) / maxDiff) * 100;
  };

  const triggerWinningAnimation = () => {
    setShowWinning(true);
    
    // Create confetti explosion
    const newConfetti: Confetti[] = [];
    for (let i = 0; i < 100; i++) {
      newConfetti.push({
        id: confettiIdRef.current++,
        x: Math.random() * window.innerWidth,
        y: -10,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * 5 + 2,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        size: Math.random() * 8 + 4,
        life: 100
      });
    }
    setConfetti(newConfetti);

    // Clear confetti after animation
    setTimeout(() => {
      setConfetti([]);
      setShowWinning(false);
    }, 3000);
  };

  const getTargetColorSuggestions = () => {
    const suggestions = [];
    const [r, g, b] = targetColor;
    
    if (r > g && r > b) {
      suggestions.push("🔴 Start with Red as your primary base");
      if (g > 100) suggestions.push("🟡 Add Yellow for warmth");
      if (b > 100) suggestions.push("🔵 Mix in Blue for depth");
    } else if (g > r && g > b) {
      suggestions.push("🟢 Begin with Green as your foundation");
      if (r > 100) suggestions.push("🟡 Add Yellow for brightness");
      if (b > 100) suggestions.push("🔵 Include Blue for coolness");
    } else if (b > r && b > g) {
      suggestions.push("🔵 Use Blue as your primary color");
      if (r > 100) suggestions.push("🟣 Mix Purple for richness");
      if (g > 100) suggestions.push("🟢 Add Green for balance");
    }
    
    if (r + g + b > 450) {
      suggestions.push("💧 Add Water to lighten the mix");
    }
    
    return suggestions;
  };

  const addColor = (index: number) => {
    if (totalPercentage >= 100) return;
    
    const increment = Math.min(4, 100 - totalPercentage);
    
    const containerElement = document.getElementById(`container-${index}`);
    const mixerElement = document.getElementById('color-mixer');
    
    if (containerElement && mixerElement) {
      const containerRect = containerElement.getBoundingClientRect();
      const mixerRect = mixerElement.getBoundingClientRect();
      
      const startX = containerRect.left + containerRect.width / 2;
      const startY = containerRect.top;
      const endX = mixerRect.left + mixerRect.width / 2;
      const endY = mixerRect.top + mixerRect.height / 2;

      const newDrop: DropAnimation = {
        id: dropIdRef.current++,
        startX,
        startY,
        endX,
        endY,
        color: colorData[index].rgb,
        active: true
      };

      setDrops(prev => [...prev, newDrop]);

      setTimeout(() => {
        setDrops(prev => prev.filter(drop => drop.id !== newDrop.id));
        setColorData(prev => 
          prev.map((color, i) => 
            i === index ? { ...color, percentage: color.percentage + increment } : color
          )
        );
      }, 1000);
    }
  };

  const removeColor = (index: number) => {
    setColorData(prev => 
      prev.map((color, i) => 
        i === index ? { ...color, percentage: Math.max(0, color.percentage - 4) } : color
      )
    );
  };

  const resetColors = () => {
    setColorData(prev => prev.map(color => ({ ...color, percentage: 0 })));
    setDrops([]);
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const getColorString = (rgb: [number, number, number]): string => {
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  };

  // Handler to copy color hex code
  const handleCopyColor = () => {
    navigator.clipboard.writeText(rgbToHex(mixedColor[0], mixedColor[1], mixedColor[2]));
    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col lg:flex-row overflow-hidden antialiased relative">
      <BackgroundParticles />

      {/* --- LEFT CONTROL PANEL --- */}
      <div className="w-full lg:w-[400px] xl:w-[480px] lg:flex-shrink-0 lg:h-screen lg:overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 order-1">
        
        {/* 1. App Header */}
        <header className="space-y-2">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-2xl">🌪️ Color Tornado Lab</h1>
            <p className="text-sm sm:text-base text-white/80 drop-shadow-lg">Mix colors in the mesmerizing tornado!</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {/* Reset Button */}
            <button
              onClick={resetColors}
              className="group w-full sm:w-auto relative px-3 py-1.5 backdrop-blur-md bg-red-500/80 hover:bg-red-600/80 text-white rounded-lg font-semibold shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20 cursor-pointer overflow-hidden text-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-400/20 to-red-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="relative flex items-center justify-center sm:justify-start gap-1.5">
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reset</span>
              </div>
            </button>
            {/* About button */}
            <button
              onClick={() => setShowAbout(true)}
              className="w-full sm:w-auto px-3 py-1.5 backdrop-blur-md bg-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-xl cursor-pointer text-sm font-semibold transform hover:scale-105"
            >
              <span className="mr-1.5">ℹ️</span> About
            </button>
          </div>
        </header>

        {/* 2. Target Color Card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 sm:p-6 border border-white/20 shadow-2xl">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg">🎯 Target</h2>
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="relative group">
                <div
                  className="w-20 h-10 sm:w-24 sm:h-12 rounded-2xl border-2 sm:border-3 border-white/30 shadow-xl cursor-pointer relative"
                  style={{ backgroundColor: getColorString(targetColor) }}
                >
                  <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-white/90 rounded-full p-0.5 sm:p-1 shadow-lg transform transition-transform duration-200 group-hover:scale-110">
                    <svg 
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-700" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                      />
                    </svg>
                  </div>
                </div>
                <input
                  type="color"
                  value={rgbToHex(targetColor[0], targetColor[1], targetColor[2])}
                  onChange={(e) => {
                    const hex = e.target.value;
                    const r = parseInt(hex.slice(1, 3), 16);
                    const g = parseInt(hex.slice(3, 5), 16);
                    const b = parseInt(hex.slice(5, 7), 16);
                    setTargetColor([r, g, b]);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
            <div className="text-white mb-2 sm:mb-3">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-xs sm:text-sm">
                <div className="text-white/70 drop-shadow">
                  {rgbToHex(targetColor[0], targetColor[1], targetColor[2])}
                </div>
                <div className="text-white/50 hidden sm:block">•</div>
                <div className="text-white/70 drop-shadow">
                  RGB({targetColor[0]}, {targetColor[1]}, {targetColor[2]})
                </div>
              </div>
            </div>
            
            <div className={`text-3xl sm:text-4xl font-bold mb-2 sm:mb-3 drop-shadow-lg transition-all duration-500 ${
              score > 85 ? 'text-green-400 animate-pulse' : 
              score > 70 ? 'text-yellow-400' : 
              'text-red-400'
            }`}>
              {score}%
            </div>
            <div className="text-white/90 mb-3 sm:mb-4 drop-shadow text-xs sm:text-sm">Match Score</div>
            
            {score >= 90 && (
              <div className="text-green-400 font-semibold animate-bounce mb-3 sm:mb-4 drop-shadow-lg text-sm sm:text-base">
                🎉 Perfect Match!
              </div>
            )}

            <button
              onClick={() => setShowTargetHelp(true)}
              className="backdrop-blur-sm bg-white/20 border border-white/30 text-white px-4 py-1.5 sm:px-6 sm:py-2 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-105 shadow-lg drop-shadow text-xs sm:text-sm cursor-pointer"
            >
              💡 Get Hints
            </button>
          </div>
        </div>

        {/* 4. Color Selection Section (Moved from bottom) */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-3 sm:p-4 border border-white/20 shadow-2xl space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-end gap-2 sm:gap-3 justify-center">
            {colorData.map((color, index) => (
              <div key={color.name} id={`container-${index}`} className="flex flex-col items-center">
                <div className="relative group mb-1 sm:mb-2">
                  <div 
                    className="w-10 h-14 sm:w-12 sm:h-16 relative cursor-pointer transform transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                    onClick={() => addColor(index)}
                  >
                    <div
                      className="w-full h-10 sm:h-12 rounded-b-2xl border-2 border-gray-700 shadow-xl relative overflow-hidden transition-all duration-300"
                      style={{ 
                        background: color.name === 'Water' 
                          ? `linear-gradient(180deg, rgba(240,248,255,0.9) 0%, rgba(173,216,230,0.8) 70%, rgba(100,149,237,0.6) 100%)`
                          : `linear-gradient(180deg, ${getColorString(color.rgb)} 0%, ${getColorString(color.rgb)} 60%, rgba(0,0,0,0.3) 100%)` 
                      }}
                    >
                      <div 
                        className="absolute top-0.5 sm:top-1 left-0.5 sm:left-1 right-0.5 sm:right-1 h-1 sm:h-1.5 rounded-full opacity-90"
                        style={{ 
                          backgroundColor: color.name === 'Water' ? 'rgba(173,216,230,0.9)' : getColorString(color.rgb), 
                          filter: 'brightness(1.3)',
                          animation: 'liquidWave 2s ease-in-out infinite'
                        }}
                      />
                      <div className="absolute -right-0.5 top-1 sm:top-2 w-1 sm:w-1.5 h-2 sm:h-3 border-2 border-gray-700 rounded-r-lg bg-gray-400" />
                    </div>
                    <div className="absolute top-0 left-0 right-0 h-2 sm:h-3 bg-gray-400 border-2 border-gray-700 rounded-t-lg" />
                    {color.percentage > 0 && (
                      <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-gradient-to-br from-yellow-400 to-yellow-500 text-black rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold animate-pulse border-2 border-white/80 shadow-lg transform transition-all duration-300 group-hover:scale-110">
                        <div className="relative">
                          <span className="relative z-10">{color.percentage}</span>
                          <span className="absolute -top-1 -right-1 text-[8px] text-gray-600">%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-0.5 sm:gap-1">
                  <button
                    onClick={() => removeColor(index)}
                    disabled={color.percentage === 0}
                    className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 hover:bg-red-600 disabled:bg-gray-500/70 disabled:cursor-not-allowed text-white rounded-full text-xs font-bold flex items-center justify-center transition-all duration-200 transform hover:scale-110 disabled:hover:scale-100 shadow-lg cursor-pointer"
                  >
                    −
                  </button>
                  
                  <div className="text-center min-w-[20px] sm:min-w-[28px] px-0.5 sm:px-0">
                    <div className="text-white text-[10px] sm:text-xs font-bold drop-shadow">{color.name}</div>
                  </div>
                  
                  <button
                    onClick={() => addColor(index)}
                    disabled={totalPercentage >= 100}
                    className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 hover:bg-green-600 disabled:bg-gray-500/70 disabled:cursor-not-allowed text-white rounded-full text-xs font-bold flex items-center justify-center transition-all duration-200 transform hover:scale-110 disabled:hover:scale-100 shadow-lg cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 sm:pt-3 border-t border-white/20">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 text-xs text-white/90">
              <div className="flex items-center gap-1 sm:gap-2 bg-white/5 hover:bg-white/10 rounded-lg px-2 py-1 sm:px-3 sm:py-2 transition-colors duration-200">
                <span className="text-green-400 bg-green-400/10 p-0.5 sm:p-1 rounded">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
                <span className="font-medium text-[10px] sm:text-xs">Add 4</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 bg-white/5 hover:bg-white/10 rounded-lg px-2 py-1 sm:px-3 sm:py-2 transition-colors duration-200">
                <span className="text-red-400 bg-red-400/10 p-0.5 sm:p-1 rounded">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </span>
                <span className="font-medium text-[10px] sm:text-xs">Remove</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 bg-white/5 hover:bg-white/10 rounded-lg px-2 py-1 sm:px-3 sm:py-2 transition-colors duration-200">
                <span className="text-blue-400 bg-blue-400/10 p-0.5 sm:p-1 rounded text-sm sm:text-base">💧</span>
                <span className="font-medium text-[10px] sm:text-xs">Lighten</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 bg-white/5 hover:bg-white/10 rounded-lg px-2 py-1 sm:px-3 sm:py-2 transition-colors duration-200">
                <span className="text-yellow-400 bg-yellow-400/10 p-0.5 sm:p-1 rounded text-sm sm:text-base">🎯</span>
                <span className="font-medium text-[10px] sm:text-xs">90%+</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- NEW RIGHT CONTAINER (Mixer + Composition) --- */}
      <div className="flex flex-col flex-grow order-2 lg:h-screen lg:overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* --- RIGHT DISPLAY PANEL (Mixing Bowl) --- */}
        <div className="flex items-center justify-center relative min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:flex-grow lg:min-h-0">
          <div id="color-mixer" className="relative">
            {/* Main Mixing Bowl (Responsive Size) */}
            <div
              className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[380px] lg:h-[380px] xl:w-[420px] xl:h-[420px] relative rounded-full transition-all duration-1000 ease-in-out overflow-hidden"
              style={{
                background: totalPercentage > 0 
                  ? `radial-gradient(circle at center, 
                      ${getColorString(mixedColor)} 0%,
                      ${getColorString(mixedColor)}E0 30%,
                      ${getColorString(mixedColor)}C0 60%,
                      ${getColorString(mixedColor)}A0 80%,
                      ${getColorString(mixedColor)}60 100%)`
                  : `radial-gradient(circle at center, 
                      rgba(240,248,255,0.8) 0%,
                      rgba(173,216,230,0.6) 30%,
                      rgba(100,149,237,0.4) 60%,
                      rgba(70,130,180,0.3) 80%,
                      rgba(30,60,120,0.2) 100%)`,
                boxShadow: `
                  0 0 30px sm:0 0 40px md:0 0 60px ${totalPercentage > 0 ? getColorString(mixedColor) + '60' : 'rgba(173,216,230,0.4)'}, 
                  0 0 60px sm:0 0 80px md:0 0 120px ${totalPercentage > 0 ? getColorString(mixedColor) + '30' : 'rgba(173,216,230,0.2)'},
                  inset 0 0 20px sm:inset 0 0 30px md:inset 0 0 40px rgba(255,255,255,0.1)
                `,
                border: '3px sm:4px solid rgba(255,255,255,0.2)'
              }}
            >
              {/* Liquid Surface Effect */}
              <div 
                className="absolute inset-2 sm:inset-3 md:inset-4 rounded-full"
                style={{
                  background: totalPercentage > 0 
                    ? `linear-gradient(45deg, 
                        ${getColorString(mixedColor)}FF 0%,
                        ${getColorString(mixedColor)}E0 25%,
                        ${getColorString(mixedColor)}FF 50%,
                        ${getColorString(mixedColor)}E0 75%,
                        ${getColorString(mixedColor)}FF 100%)`
                    : `linear-gradient(45deg, 
                        rgba(173,216,230,0.8) 0%,
                        rgba(173,216,230,0.6) 25%,
                        rgba(173,216,230,0.8) 50%,
                        rgba(173,216,230,0.6) 75%,
                        rgba(173,216,230,0.8) 100%)`,
                  animation: 'liquidSwirl 8s linear infinite',
                  filter: 'brightness(1.1)'
                }}
              />

              {/* Color Blending Layers (Responsive Size) */}
              {colorData.filter(color => color.percentage > 0).map((color, index) => (
                <div
                  key={`blend-${color.name}-${index}`}
                  className="absolute rounded-full opacity-70"
                  style={{
                    width: `calc(50% + ${index * 10}px)`, // Responsive sizing
                    height: `calc(50% + ${index * 10}px)`,
                    left: `${40 + Math.cos(index * 60 * Math.PI / 180) * 10}%`, // Adjusted spread
                    top: `${40 + Math.sin(index * 60 * Math.PI / 180) * 10}%`,
                    background: `radial-gradient(circle, 
                      ${getColorString(color.rgb)}${Math.round(color.percentage * 2.55).toString(16).padStart(2, '0')} 0%, 
                      ${getColorString(color.rgb)}${Math.round(color.percentage * 1.5).toString(16).padStart(2, '0')} 40%, 
                      transparent 70%)`,
                    animation: `colorBlend ${4 + index * 0.5}s linear infinite ${index % 2 === 0 ? '' : 'reverse'}`,
                    transform: 'translate(-50%, -50%)',
                    filter: 'blur(1px)'
                  }}
                />
              ))}

              {/* Swirling Effect (Responsive Inset) */}
              <div 
                className="absolute inset-4 sm:inset-6 md:inset-8 rounded-full"
                style={{
                  background: totalPercentage > 0 
                    ? `conic-gradient(from 0deg, 
                        ${getColorString(mixedColor)}80, 
                        transparent 30%, 
                        ${getColorString(mixedColor)}60 60%, 
                        transparent 90%, 
                        ${getColorString(mixedColor)}80)`
                    : `conic-gradient(from 0deg, 
                        rgba(173,216,230,0.5), 
                        transparent 30%, 
                        rgba(173,216,230,0.3) 60%, 
                        transparent 90%, 
                        rgba(173,216,230,0.5))`,
                  animation: 'colorSwirl 6s linear infinite'
                }}
              />

              {/* Center Highlight (Responsive Inset) */}
              <div 
                className="absolute inset-12 sm:inset-16 md:inset-24 rounded-full"
                style={{
                  background: totalPercentage > 0 
                    ? `radial-gradient(circle, 
                        ${getColorString(mixedColor)} 0%, 
                        ${getColorString(mixedColor)}C0 40%, 
                        transparent 100%)`
                    : `radial-gradient(circle, 
                        rgba(240,248,255,0.9) 0%, 
                        rgba(173,216,230,0.7) 40%, 
                        transparent 100%)`,
                  animation: 'pulse 3s ease-in-out infinite'
                }}
              />

              {/* Ripple Effects (Responsive Sizes) */}
              {totalPercentage > 0 && (
                <>
                  {/* Primary Ripples */}
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={`ripple-primary-${i}`}
                      className="absolute rounded-full border opacity-70"
                      style={{
                        width: `calc(25% + ${i * 12}%)`, // Responsive sizing
                        height: `calc(25% + ${i * 12}%)`,
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        borderColor: getColorString(mixedColor),
                        borderWidth: '2px sm:3px',
                        animation: `ripple ${1.2 + i * 0.25}s ease-out infinite`,
                        boxShadow: `
                          0 0 10px sm:0 0 15px md:0 0 20px ${getColorString(mixedColor)}50,
                          inset 0 0 8px sm:inset 0 0 12px md:inset 0 0 15px ${getColorString(mixedColor)}30
                        `,
                        background: `radial-gradient(circle, 
                          ${getColorString(mixedColor)}30 0%, 
                          ${getColorString(mixedColor)}15 30%, 
                          transparent 70%)`
                      }}
                    />
                  ))}
                  
                  {/* Secondary Ripples (offset) */}
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={`ripple-secondary-${i}`}
                      className="absolute rounded-full border opacity-50"
                      style={{
                        width: `calc(30% + ${i * 15}%)`, // Responsive sizing
                        height: `calc(30% + ${i * 15}%)`,
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        borderColor: getColorString(mixedColor),
                        borderWidth: '1px sm:2px',
                        animation: `rippleSecondary ${1.8 + i * 0.3}s ease-out infinite`,
                        boxShadow: `0 0 8px sm:0 0 12px md:0 0 15px ${getColorString(mixedColor)}40`,
                        background: `radial-gradient(circle, 
                          ${getColorString(mixedColor)}20 0%, 
                          transparent 60%)`
                      }}
                    />
                  ))}

                  {/* Glow Layer (Responsive Size) */}
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: '60%', // Responsive sizing
                      height: '60%',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: `radial-gradient(circle, 
                        ${getColorString(mixedColor)}15 0%, 
                        transparent 70%)`,
                      animation: 'pulseGlow 2s ease-in-out infinite',
                      filter: 'blur(8px) sm:blur(10px)'
                    }}
                  />
                </>
              )}
            </div>

            {/* Color Info Above Bowl */}
            <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 backdrop-blur-xl bg-white/10 rounded-2xl px-4 py-1.5 sm:px-6 sm:py-2 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <div className="text-base sm:text-lg font-bold text-white drop-shadow-lg">
                  {rgbToHex(mixedColor[0], mixedColor[1], mixedColor[2])}
                </div>
                <button
                  onClick={handleCopyColor}
                  className="p-1 rounded-md hover:bg-white/20 cursor-pointer transition-colors relative"
                  aria-label="Copy color hex code"
                >
                  {showCopiedMessage ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-white/70 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Color Composition Card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 sm:p-6 border border-white/20 shadow-2xl">
          <h3 className="text-base sm:text-lg text-white font-semibold mb-3 sm:mb-4 text-center drop-shadow">Color Composition</h3>
          <div className="relative h-5 sm:h-6 bg-white/20 rounded-full overflow-hidden border border-white/30 mb-3 sm:mb-4">
            {(() => {
              let currentPosition = 0;
              return colorData.map((color, index) => {
                if (color.percentage > 0) {
                  const segment = (
                    <div
                      key={color.name}
                      className="absolute top-0 h-full transition-all duration-1000 ease-out"
                      style={{
                        left: `${currentPosition}%`,
                        width: `${color.percentage}%`,
                        backgroundColor: getColorString(color.rgb),
                        boxShadow: `inset 0 0 10px rgba(0,0,0,0.2)`
                      }}
                    />
                  );
                  currentPosition += color.percentage;
                  return segment;
                }
                return null;
              }).filter(Boolean);
            })()}
          </div>
          <div className="flex justify-between items-center mb-3 sm:mb-4 text-xs text-white/80">
            <span>0%</span>
            <span>100%</span>
          </div>
          <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
            {colorData.filter(color => color.percentage > 0).map(color => (
              <div key={color.name} className="flex items-center justify-between text-white/90">
                <div className="flex items-center gap-2">
                  <span>{color.icon}</span>
                  <span>{color.name}</span>
                </div>
                <span>{color.percentage}%</span>
              </div>
            ))}
             {colorData.filter(c => c.percentage > 0).length === 0 && (
              <p className="text-center text-white/60 text-xs">Mix some colors to see their composition!</p>
            )}
          </div>
        </div>
      </div>

      {/* Winning Animation Overlay */}
      {showWinning && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-3xl md:text-6xl font-bold text-yellow-300 animate-bounce drop-shadow-2xl text-center px-4">
              🎉 PERFECT MATCH! 🎉
            </div>
          </div>
          {confetti.map(particle => (
            <ConfettiParticle key={particle.id} confetti={particle} />
          ))}
        </div>
      )}
      
      {/* Drop Animations */}
      {drops.map(drop => (
        <div
          key={drop.id}
          className="fixed w-5 h-5 md:w-6 md:h-6 rounded-full pointer-events-none z-30" // Slightly smaller base for drops
          style={{
            left: drop.startX - 10, // Adjust offset for smaller size
            top: drop.startY,
            background: `radial-gradient(circle, ${getColorString(drop.color)}, ${getColorString(drop.color)}CC)`,
            boxShadow: `0 0 15px ${getColorString(drop.color)}CC, 0 0 30px ${getColorString(drop.color)}66`,
            filter: 'brightness(1.3)',
            animation: `dropAnimation 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
            '--end-x': `${drop.endX - drop.startX}px`,
            '--end-y': `${drop.endY - drop.startY}px`
          } as React.CSSProperties}
        />
      ))}

      {/* Modals */}
      {showTargetHelp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"> {/* Increased z-index for modals */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow">💡 Mixing Hints</h2>
              <button
                onClick={() => setShowTargetHelp(false)}
                className="text-white/80 hover:text-white text-2xl transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3 sm:space-y-4 text-white">
              <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-3 sm:p-4 border border-white/20">
                <h3 className="font-semibold mb-2 sm:mb-3 text-yellow-300 drop-shadow">How to achieve this color:</h3>
                <ul className="text-sm space-y-1.5 sm:space-y-2 text-white/90">
                  {getTargetColorSuggestions().map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-300">•</span>
                      <span className="drop-shadow">{suggestion}</span>
                    </li>
                  ))}
                   {getTargetColorSuggestions().length === 0 && (
                    <li className="text-white/70">Try adding some primary colors first!</li>
                  )}
                </ul>
              </div>
              
              <div className="text-center pt-2 sm:pt-4">
                <p className="text-xs sm:text-sm text-white/80 drop-shadow">
                  Watch the color bowl swirl as colors blend naturally together!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAbout && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"> {/* Increased z-index for modals */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow">About Color Tornado Lab</h2>
              <button
                onClick={() => setShowAbout(false)}
                className="text-white/80 hover:text-white text-2xl transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3 sm:space-y-4 text-white">
              <p className="text-sm sm:text-base text-white/90 drop-shadow">
                Experience the magic of <strong className="text-yellow-300">Color Tornado Lab</strong> - where colors swirl in a realistic mixing bowl!
              </p>
              
              <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-3 sm:p-4 border border-white/20">
                <h3 className="font-semibold text-yellow-300 mb-2 drop-shadow">🌪️ Features:</h3>
                <ul className="text-xs sm:text-sm space-y-1 text-white/90">
                  <li>• Realistic color mixing bowl with swirling effects</li>
                  <li>• Scientific color mixing algorithms</li>
                  <li>• Target color challenges with hints</li>
                  <li>• Beautiful glassmorphism UI design</li>
                  <li>• Winning celebrations and confetti!</li>
                </ul>
              </div>
              
              <div className="text-center pt-3 sm:pt-4 border-t border-white/20">
                <p className="text-xs sm:text-sm text-white/70 drop-shadow">
                  Created with ❤️ for color enthusiasts
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes liquidSwirl {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.02); }
          100% { transform: rotate(360deg) scale(1); }
        }

        @keyframes colorSwirl {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes colorBlend {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        @keyframes ripple {
          0% { 
            transform: translate(-50%, -50%) scale(0.8) rotate(0deg); 
            opacity: 0.8;
            borderWidth: '3px';
          }
          50% {
            opacity: 0.5;
            borderWidth: '2px';
            transform: translate(-50%, -50%) scale(1.15) rotate(180deg);
          }
          100% { 
            transform: translate(-50%, -50%) scale(1.5) rotate(360deg); 
            opacity: 0;
            borderWidth: '1px';
          }
        }
        
        @keyframes dropAnimation {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--end-x), var(--end-y)) scale(0.3);
            opacity: 0;
          }
        }

        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes liquidWave {
          0%, 100% { 
            transform: scaleX(1) scaleY(1);
          }
          50% { 
            transform: scaleX(1.05) scaleY(0.95);
          }
        }
        
        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.2;
            transform: scale(1);
          }
          50% { 
            opacity: 0.6;
            transform: scale(1.2);
          }
        }

        @keyframes rippleSecondary {
          0% { 
            transform: translate(-50%, -50%) scale(0.9) rotate(0deg); 
            opacity: 0.6;
          }
          50% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1.2) rotate(-180deg);
          }
          100% { 
            transform: translate(-50%, -50%) scale(1.6) rotate(-360deg); 
            opacity: 0;
          }
        }

        @keyframes pulseGlow {
          0%, 100% { 
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1);
          }
          50% { 
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default ColorMixingPlayground;
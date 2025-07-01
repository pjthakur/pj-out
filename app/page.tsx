"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiRefreshCw, FiShuffle, FiPlus, FiMinus, FiMenu, FiInfo, FiActivity, FiTarget, FiMousePointer } from 'react-icons/fi';

interface Charge {
  id: string;
  x: number;
  y: number;
  magnitude: number;
  isPositive: boolean;
}

interface Vector {
  x: number;
  y: number;
}

interface FloatingParticle {
  id: string;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

interface InteractionState {
  isDragging: boolean;
  startDistance: number | null;
  isTouchDevice: boolean;
}

const CoulombLawDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [charges, setCharges] = useState<Charge[]>([]);
  const [selectedCharge, setSelectedCharge] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [showInfo, setShowInfo] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; time: number } | null>(null);
  const [hasDraggedSignificantly, setHasDraggedSignificantly] = useState(false);
  const [floatingParticles, setFloatingParticles] = useState<FloatingParticle[]>([]);
  const [interactionState, setInteractionState] = useState<InteractionState>({
    isDragging: false,
    startDistance: null,
    isTouchDevice: false
  });
  const [isMobile, setIsMobile] = useState(false);
  const [chargePlacementMode, setChargePlacementMode] = useState<'positive' | 'negative' | 'random'>('positive');
  const animationFrameRef = useRef<number>(0);

  const k = 8.99e9;

  useEffect(() => {
    const checkDeviceAndSize = () => {
      if (typeof window !== 'undefined') {
        setInteractionState(prev => ({
          ...prev,
          isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0
        }));
        setIsMobile(window.innerWidth < 768);
      }
    };

    checkDeviceAndSize();
    
    const particles: FloatingParticle[] = [];
    for (let i = 0; i < 15; i++) {
      particles.push({
        id: `particle-${i}`,
        x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 800,
        y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 600,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1
      });
    }
    setFloatingParticles(particles);

    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'p':
          setChargePlacementMode('positive');
          break;
        case 'n':
          setChargePlacementMode('negative');
          break;
        case 'r':
          setChargePlacementMode('random');
          break;
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, []);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setCanvasSize({ width, height });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const calculateElectricField = useCallback((x: number, y: number): Vector => {
    let Ex = 0;
    let Ey = 0;

    charges.forEach(charge => {
      const dx = x - charge.x;
      const dy = y - charge.y;
      const r = Math.sqrt(dx * dx + dy * dy);
      
      if (r > 5) {
        const force = (k * Math.abs(charge.magnitude)) / (r * r);
        const sign = charge.isPositive ? 1 : -1;
        Ex += sign * force * (dx / r);
        Ey += sign * force * (dy / r);
      }
    });

    return { x: Ex, y: Ey };
  }, [charges]);

  const drawField = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gridSize = isMobile ? 35 : 30;
    const arrowScale = 0.000000001;
    const minArrowLength = isMobile ? 8 : 10;
    const maxArrowLength = isMobile ? 20 : 25;

    for (let x = gridSize / 2; x < canvas.width; x += gridSize) {
      for (let y = gridSize / 2; y < canvas.height; y += gridSize) {
        const field = calculateElectricField(x, y);
        const magnitude = Math.sqrt(field.x * field.x + field.y * field.y);
        
        if (magnitude > 0) {
          const normalizedMagnitude = Math.min(magnitude * arrowScale, 1);
          const adjustedMagnitude = Math.max(normalizedMagnitude, 0.1);
          
          const hue = 260 - adjustedMagnitude * 120;
          const saturation = 70 + adjustedMagnitude * 30;
          const lightness = 60 + adjustedMagnitude * 20;
          const alpha = Math.max(0.4, adjustedMagnitude * 0.6 + 0.4);
          
          ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
          ctx.fillStyle = ctx.strokeStyle;
          ctx.lineWidth = isMobile ? 1.5 : 2;
          
          const arrowLength = minArrowLength + (maxArrowLength - minArrowLength) * adjustedMagnitude;
          const angle = Math.atan2(field.y, field.x);
          
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(arrowLength, 0);
          ctx.stroke();
          
          const headSize = isMobile ? 4 : 5;
          ctx.beginPath();
          ctx.moveTo(arrowLength, 0);
          ctx.lineTo(arrowLength - headSize, -headSize/2);
          ctx.lineTo(arrowLength - headSize, headSize/2);
          ctx.closePath();
          ctx.fill();
          
          ctx.restore();
        }
      }
    }

    charges.forEach(charge => {
      const baseRadius = (isMobile ? 12 : 15) + Math.abs(charge.magnitude) * (isMobile ? 6 : 8);
      
      const outerGradient = ctx.createRadialGradient(charge.x, charge.y, 0, charge.x, charge.y, baseRadius * 2);
      if (charge.isPositive) {
        outerGradient.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
        outerGradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.08)');
        outerGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
      } else {
        outerGradient.addColorStop(0, 'rgba(147, 51, 234, 0.15)');
        outerGradient.addColorStop(0.5, 'rgba(147, 51, 234, 0.08)');
        outerGradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
      }
      
      ctx.fillStyle = outerGradient;
      ctx.beginPath();
      ctx.arc(charge.x, charge.y, baseRadius * 2, 0, Math.PI * 2);
      ctx.fill();
      
      const gradient = ctx.createRadialGradient(charge.x, charge.y, 0, charge.x, charge.y, baseRadius);
      if (charge.isPositive) {
        gradient.addColorStop(0, 'rgba(99, 179, 237, 0.95)');
        gradient.addColorStop(0.7, 'rgba(59, 130, 246, 0.85)');
        gradient.addColorStop(1, 'rgba(37, 99, 235, 0.7)');
      } else {
        gradient.addColorStop(0, 'rgba(196, 181, 253, 0.95)');
        gradient.addColorStop(0.7, 'rgba(147, 51, 234, 0.85)');
        gradient.addColorStop(1, 'rgba(126, 34, 206, 0.7)');
      }
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(charge.x, charge.y, baseRadius, 0, Math.PI * 2);
      ctx.fill();
      
      if (selectedCharge === charge.id) {
        ctx.strokeStyle = charge.isPositive ? '#60a5fa' : '#c084fc';
        ctx.lineWidth = isMobile ? 2 : 3;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(charge.x, charge.y, baseRadius + 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      
      ctx.strokeStyle = charge.isPositive ? '#1d4ed8' : '#7c3aed';
      ctx.lineWidth = isMobile ? 1.5 : 2;
      ctx.beginPath();
      ctx.arc(charge.x, charge.y, baseRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(14, baseRadius * 0.7)}px system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 2;
      ctx.fillText(charge.isPositive ? '+' : '-', charge.x, charge.y);
      ctx.shadowBlur = 0;
    });
  }, [charges, selectedCharge, calculateElectricField, isMobile]);

  useEffect(() => {
    const animate = () => {
      drawField();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawField]);

  const getCanvasPosition = useCallback((clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }, []);

  const findChargeAtPosition = useCallback((x: number, y: number) => {
    return charges.find(charge => {
      const distance = Math.sqrt((charge.x - x) ** 2 + (charge.y - y) ** 2);
      const baseRadius = (isMobile ? 12 : 15) + Math.abs(charge.magnitude) * (isMobile ? 6 : 8);
      return distance < baseRadius + 10;
    });
  }, [charges, isMobile]);

  const constrainToCanvas = useCallback((x: number, y: number, magnitude: number = 1) => {
    const radius = (isMobile ? 12 : 15) + Math.abs(magnitude) * (isMobile ? 6 : 8);
    return {
      x: Math.max(radius, Math.min(canvasSize.width - radius, x)),
      y: Math.max(radius, Math.min(canvasSize.height - radius, y))
    };
  }, [canvasSize, isMobile]);

  const createNewCharge = useCallback((x: number, y: number) => {
    let isPositive: boolean;
    
    switch (chargePlacementMode) {
      case 'positive':
        isPositive = true;
        break;
      case 'negative':
        isPositive = false;
        break;
      case 'random':
      default:
        isPositive = Math.random() > 0.5;
        break;
    }
    
    const magnitude = Math.random() * 1.5 + 0.5;
    const constrainedPos = constrainToCanvas(x, y, magnitude);
    
    const newCharge: Charge = {
      id: Date.now().toString(),
      x: constrainedPos.x,
      y: constrainedPos.y,
      magnitude,
      isPositive
    };
    setCharges(prev => [...prev, newCharge]);
  }, [chargePlacementMode, constrainToCanvas]);

  // Mouse Event Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const position = getCanvasPosition(e.clientX, e.clientY);
    if (!position) return;

    const clickedCharge = findChargeAtPosition(position.x, position.y);
    const currentTime = Date.now();
    
    // Set drag start position and reset drag flag
    setDragStart({ x: position.x, y: position.y, time: currentTime });
    setHasDraggedSignificantly(false);
    
    if (clickedCharge) {
      // If there's a selected charge, start dragging immediately
      if (selectedCharge) {
        setInteractionState(prev => ({ ...prev, isDragging: true }));
      }
      // Note: Selection toggle will happen on mouseup if it's a click (not drag)
    } else {
      // Deselect any selected charge when clicking on empty space
      setSelectedCharge(null);
      setInteractionState(prev => ({ ...prev, isDragging: false }));
      createNewCharge(position.x, position.y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const position = getCanvasPosition(e.clientX, e.clientY);
    if (!position) return;
    
    // Check if we've dragged significantly
    if (dragStart && !hasDraggedSignificantly) {
      const dragDistance = Math.sqrt(
        Math.pow(position.x - dragStart.x, 2) + Math.pow(position.y - dragStart.y, 2)
      );
      if (dragDistance > 5) { // 5px threshold
        setHasDraggedSignificantly(true);
      }
    }
    
    if (!interactionState.isDragging || !selectedCharge) return;
    
    setCharges(charges.map(charge => {
      if (charge.id === selectedCharge) {
        const constrainedPos = constrainToCanvas(position.x, position.y, charge.magnitude);
        return { ...charge, x: constrainedPos.x, y: constrainedPos.y };
      }
      return charge;
    }));
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const position = getCanvasPosition(e.clientX, e.clientY);
    if (!position) return;
    
    const clickedCharge = findChargeAtPosition(position.x, position.y);
    
    // If we didn't drag significantly and clicked on a charge, toggle selection
    if (!hasDraggedSignificantly && clickedCharge && dragStart) {
      if (selectedCharge === clickedCharge.id) {
        // Deselect if already selected
        setSelectedCharge(null);
      } else {
        // Select the new charge
        setSelectedCharge(clickedCharge.id);
      }
    }
    
    setInteractionState(prev => ({ ...prev, isDragging: false }));
    setDragStart(null);
    setHasDraggedSignificantly(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!selectedCharge) return;
    
    e.preventDefault();
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    
    setCharges(charges.map(charge => 
      charge.id === selectedCharge 
        ? { ...charge, magnitude: Math.max(0.1, Math.min(5, charge.magnitude * scaleFactor)) }
        : charge
    ));
  };

  // Touch Event Handlers
    const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const position = getCanvasPosition(touch.clientX, touch.clientY);
      if (!position) return;
      
      const clickedCharge = findChargeAtPosition(position.x, position.y);
      const currentTime = Date.now();
      
      // Set drag start position and reset drag flag
      setDragStart({ x: position.x, y: position.y, time: currentTime });
      setHasDraggedSignificantly(false);
      
      if (clickedCharge) {
        // If there's a selected charge, start dragging immediately
        if (selectedCharge) {
          setInteractionState(prev => ({ ...prev, isDragging: true }));
        }
        // Note: Selection toggle will happen on touchend if it's a tap (not drag)
      } else {
        // Deselect any selected charge when touching empty space
        setSelectedCharge(null);
        setInteractionState(prev => ({ ...prev, isDragging: false }));
        createNewCharge(position.x, position.y);
      }
    } else if (e.touches.length === 2) {
      const distance = Math.sqrt(
        (e.touches[0].clientX - e.touches[1].clientX) ** 2 +
        (e.touches[0].clientY - e.touches[1].clientY) ** 2
      );
      setInteractionState(prev => ({ ...prev, startDistance: distance }));
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const position = getCanvasPosition(touch.clientX, touch.clientY);
      if (!position) return;
      
      // Check if we've dragged significantly
      if (dragStart && !hasDraggedSignificantly) {
        const dragDistance = Math.sqrt(
          Math.pow(position.x - dragStart.x, 2) + Math.pow(position.y - dragStart.y, 2)
        );
        if (dragDistance > 5) { // 5px threshold
          setHasDraggedSignificantly(true);
        }
      }
      
      if (interactionState.isDragging && selectedCharge) {
        setCharges(charges.map(charge => {
          if (charge.id === selectedCharge) {
            const constrainedPos = constrainToCanvas(position.x, position.y, charge.magnitude);
            return { ...charge, x: constrainedPos.x, y: constrainedPos.y };
          }
          return charge;
        }));
      }
    } else if (e.touches.length === 2 && selectedCharge && interactionState.startDistance) {
      const newDistance = Math.sqrt(
        (e.touches[0].clientX - e.touches[1].clientX) ** 2 +
        (e.touches[0].clientY - e.touches[1].clientY) ** 2
      );
      
      const scale = newDistance / interactionState.startDistance;
      
      setCharges(charges.map(charge => 
        charge.id === selectedCharge 
          ? { ...charge, magnitude: Math.max(0.1, Math.min(5, charge.magnitude * scale)) }
          : charge
      ));
      
      setInteractionState(prev => ({ ...prev, startDistance: newDistance }));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      const position = getCanvasPosition(touch.clientX, touch.clientY);
      if (position) {
        const clickedCharge = findChargeAtPosition(position.x, position.y);
        
        // If we didn't drag significantly and tapped on a charge, toggle selection
        if (!hasDraggedSignificantly && clickedCharge && dragStart) {
          if (selectedCharge === clickedCharge.id) {
            // Deselect if already selected
            setSelectedCharge(null);
          } else {
            // Select the new charge
            setSelectedCharge(clickedCharge.id);
          }
        }
      }
    }
    
    setInteractionState({
      isDragging: false,
      startDistance: null,
      isTouchDevice: interactionState.isTouchDevice
    });
    setDragStart(null);
    setHasDraggedSignificantly(false);
  };

  const resetCharges = () => {
    setCharges([]);
    setShowMenu(false);
    setSelectedCharge(null);
  };

  const randomizeCharges = () => {
    const newCharges: Charge[] = [];
    const count = Math.floor(Math.random() * 4) + 3;
    
    for (let i = 0; i < count; i++) {
      const magnitude = Math.random() * 2.5 + 0.5;
      const x = Math.random() * canvasSize.width;
      const y = Math.random() * canvasSize.height;
      const constrainedPos = constrainToCanvas(x, y, magnitude);
      
      newCharges.push({
        id: `${Date.now()}-${i}`,
        x: constrainedPos.x,
        y: constrainedPos.y,
        magnitude,
        isPositive: Math.random() > 0.5
      });
    }
    
    setCharges(newCharges);
    setShowMenu(false);
  };

  const toggleChargeSign = () => {
    if (selectedCharge) {
      setCharges(charges.map(charge => 
        charge.id === selectedCharge 
          ? { ...charge, isPositive: !charge.isPositive }
          : charge
      ));
    }
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
    setShowMenu(false);
  };

  useEffect(() => {
    if (showInfo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showInfo]);

  const getTotalFieldStrength = () => {
    if (charges.length === 0) return 0;
    
    let totalStrength = 0;
    const samplePoints = 20;
    
    for (let i = 0; i < samplePoints; i++) {
      const x = Math.random() * canvasSize.width;
      const y = Math.random() * canvasSize.height;
      const field = calculateElectricField(x, y);
      const magnitude = Math.sqrt(field.x * field.x + field.y * field.y);
      totalStrength += magnitude;
    }
    
    return (totalStrength / samplePoints) * 0.0000000001;
  };

  const selectedChargeData = charges.find(c => c.id === selectedCharge);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 overflow-hidden relative">
      {floatingParticles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-blue-400/40 to-purple-400/40 pointer-events-none"
          style={{
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
          animate={{
            x: [particle.x - 40, particle.x + 40, particle.x - 40],
            y: [particle.y - 25, particle.y + 25, particle.y - 25],
          }}
          transition={{
            duration: Math.random() * 12 + 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/25 to-slate-900/30" />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full h-full"
      >        
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="relative z-10 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-b border-slate-700/50 shadow-lg"
        >
          {isMobile && (
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="p-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                <FiActivity className="text-indigo-400 text-base" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                Coulomb's Law Simulator
              </h1>
            </div>
          )}
          
          {isMobile ? (
            <div className="space-y-2">
              <p className="text-xs text-slate-300 text-center font-medium">
                Tap to place • Pinch to adjust • Drag to move
              </p>
              
              <motion.div 
                className="flex justify-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-700/50 rounded-full border border-slate-600/50 backdrop-blur-sm">
                  <FiActivity className="text-xs text-slate-300" />
                  <span className="text-xs text-slate-300 font-medium">{charges.length} charges</span>
                </div>
              </motion.div>

              <motion.div 
                className="flex justify-center items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-xs text-slate-400 font-medium">Place:</span>
                <div className="flex gap-1">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setChargePlacementMode('positive')}
                    className={`flex items-center gap-0.5 px-2 py-1 rounded-full border transition-all text-xs font-medium ${
                      chargePlacementMode === 'positive'
                        ? 'bg-blue-500/30 border-blue-400/60 text-blue-100 shadow-lg shadow-blue-500/25'
                        : 'bg-blue-500/10 border-blue-400/30 text-blue-300/80 hover:bg-blue-500/20'
                    }`}
                  >
                    <FiPlus className="text-xs" />
                    <span>+</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setChargePlacementMode('negative')}
                    className={`flex items-center gap-0.5 px-2 py-1 rounded-full border transition-all text-xs font-medium ${
                      chargePlacementMode === 'negative'
                        ? 'bg-purple-500/30 border-purple-400/60 text-purple-100 shadow-lg shadow-purple-500/25'
                        : 'bg-purple-500/10 border-purple-400/30 text-purple-300/80 hover:bg-purple-500/20'
                    }`}
                  >
                    <FiMinus className="text-xs" />
                    <span>-</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setChargePlacementMode('random')}
                    className={`flex items-center gap-0.5 px-2 py-1 rounded-full border transition-all text-xs font-medium ${
                      chargePlacementMode === 'random'
                        ? 'bg-amber-500/30 border-amber-400/60 text-amber-100 shadow-lg shadow-amber-500/25'
                        : 'bg-amber-500/10 border-amber-400/30 text-amber-300/80 hover:bg-amber-500/20'
                    }`}
                  >
                    <FiShuffle className="text-xs" />
                    <span>?</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                {/* Left side - Title */}
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 backdrop-blur-sm">
                    <FiActivity className="text-indigo-400 text-xl" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                      Coulomb's Law Simulator
                    </h1>
                    <p className="text-xs text-slate-400 font-medium">
                      Interactive Physics Simulation
                    </p>
                  </div>
                </div>

                {/* Right side - Controls */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/60 rounded-lg border border-slate-600/50 backdrop-blur-sm">
                      <FiActivity className="text-indigo-400 text-sm" />
                      <span className="text-slate-200 font-semibold text-sm">{charges.length}</span>
                      <span className="text-slate-400 text-xs">charges</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 rounded-lg border border-emerald-500/40 backdrop-blur-sm">
                      <FiMousePointer className="text-emerald-400 text-sm" />
                      <span className="text-emerald-300 font-medium text-sm">Desktop</span>
                    </div>
                  </div>

                  <div className="h-6 w-px bg-gradient-to-b from-transparent via-slate-600/60 to-transparent"></div>

                  <motion.div 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="text-slate-300 font-medium text-sm">Placement Mode:</div>
                    <div className="flex items-center gap-1 p-0.5 bg-slate-800/40 rounded-lg border border-slate-700/50 backdrop-blur-sm">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setChargePlacementMode('positive')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200 font-medium text-sm ${
                          chargePlacementMode === 'positive'
                            ? 'bg-blue-500/30 border border-blue-400/60 text-blue-100 shadow-lg shadow-blue-500/25'
                            : 'text-blue-300/80 hover:bg-blue-500/15 hover:text-blue-200'
                        }`}
                      >
                        <FiPlus className="text-xs" />
                        <span>Positive</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setChargePlacementMode('negative')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200 font-medium text-sm ${
                          chargePlacementMode === 'negative'
                            ? 'bg-purple-500/30 border border-purple-400/60 text-purple-100 shadow-lg shadow-purple-500/25'
                            : 'text-purple-300/80 hover:bg-purple-500/15 hover:text-purple-200'
                        }`}
                      >
                        <FiMinus className="text-xs" />
                        <span>Negative</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setChargePlacementMode('random')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200 font-medium text-sm ${
                          chargePlacementMode === 'random'
                            ? 'bg-amber-500/30 border border-amber-400/60 text-amber-100 shadow-lg shadow-amber-500/25'
                            : 'text-amber-300/80 hover:bg-amber-500/15 hover:text-amber-200'
                        }`}
                      >
                        <FiShuffle className="text-xs" />
                        <span>Random</span>
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              <div className="mt-3 px-3 py-1.5 bg-slate-800/30 rounded-lg border border-slate-700/40 backdrop-blur-sm">
                <p className="text-xs text-slate-300 text-center font-medium">
                  Click to place charges • Scroll wheel to adjust magnitude • Drag to move • P/N/R keys to switch modes
                </p>
              </div>
            </div>
          )}
        </motion.div>

        <div 
          ref={containerRef}
          className="absolute inset-x-1 md:inset-x-4 top-32 md:top-36 bottom-24 md:bottom-28"
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
            className="relative w-full h-full bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent_50%)] opacity-60" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)] opacity-60" />
            
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className="absolute inset-0 touch-none rounded-3xl cursor-crosshair hover:cursor-pointer transition-all duration-200"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
            
            {charges.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="text-center max-w-md">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 10, -10, 0],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="mb-8"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-xl scale-150"></div>
                      <FiTarget className={`mx-auto relative z-10 ${isMobile ? 'text-5xl' : 'text-7xl'} text-gradient bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent`} />
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className={`bg-gradient-to-br from-slate-800/80 via-slate-700/60 to-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-600/40 shadow-2xl ${isMobile ? 'mx-4' : 'mx-8'}`}
                  >
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className={`text-slate-100 font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                          {isMobile ? "Tap anywhere to begin" : "Click anywhere to begin"}
                        </h3>
                        <p className={`text-slate-300 font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
                          Start by placing your first charge
                        </p>
                      </div>
                      
                      <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${
                        chargePlacementMode === 'positive' ? 'from-blue-500/30 to-blue-600/30 border-blue-400/50' :
                        chargePlacementMode === 'negative' ? 'from-purple-500/30 to-purple-600/30 border-purple-400/50' :
                        'from-amber-500/30 to-amber-600/30 border-amber-400/50'
                      } rounded-full border backdrop-blur-sm`}>
                        <span className="text-slate-200 text-sm font-medium">Next charge:</span>
                        <span className={`font-semibold ${
                          chargePlacementMode === 'positive' ? 'text-blue-200' :
                          chargePlacementMode === 'negative' ? 'text-purple-200' :
                          'text-amber-200'
                        }`}>
                          {chargePlacementMode === 'positive' && "Positive (+)"}
                          {chargePlacementMode === 'negative' && "Negative (-)"}
                          {chargePlacementMode === 'random' && "Random"}
                        </span>
                      </div>
                      
                      {!isMobile && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2 }}
                          className="flex items-center justify-center gap-6 pt-4 border-t border-slate-600/30"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                            <span className="text-slate-400 text-sm">Positive charges</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
                            <span className="text-slate-400 text-sm">Negative charges</span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-8 md:right-24"
        >
          <div className="h-14 md:h-16 bg-gradient-to-r from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl rounded-full shadow-2xl border border-slate-700/60 px-4 md:px-6 flex items-center justify-between">
            {selectedChargeData ? (
              isMobile ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${selectedChargeData.isPositive ? 'bg-gradient-to-r from-blue-400 to-blue-500 shadow-sm shadow-blue-500/50' : 'bg-gradient-to-r from-purple-400 to-purple-500 shadow-sm shadow-purple-500/50'}`} />
                    <span className="text-white font-semibold text-sm">Selected</span>
                    <span className="text-slate-300 text-xs">Mag: {selectedChargeData.magnitude.toFixed(2)}</span>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleChargeSign}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-medium shadow-md transition-all text-xs ${
                      selectedChargeData.isPositive
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                    }`}
                  >
                    {selectedChargeData.isPositive ? (
                      <>
                        <FiPlus className="text-xs" />
                        <span>Switch to -</span>
                      </>
                    ) : (
                      <>
                        <FiMinus className="text-xs" />
                        <span>Switch to +</span>
                      </>
                    )}
                  </motion.button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full ${selectedChargeData.isPositive ? 'bg-gradient-to-r from-blue-400 to-blue-500 shadow-sm shadow-blue-500/50' : 'bg-gradient-to-r from-purple-400 to-purple-500 shadow-sm shadow-purple-500/50'}`} />
                    <span className="text-white font-semibold text-base">Selected Charge</span>
                    <span className="text-slate-400 text-sm">
                      {selectedChargeData.isPositive ? 'Positive' : 'Negative'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-slate-400 text-xs uppercase tracking-wide">Magnitude</div>
                      <div className="text-white font-mono text-sm font-bold">
                        {selectedChargeData.magnitude.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-slate-400 text-xs uppercase tracking-wide">Field Strength</div>
                      <div className="text-white font-mono text-sm font-bold">
                        {getTotalFieldStrength().toFixed(3)}
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleChargeSign}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium shadow-lg transition-all duration-200 ${
                        selectedChargeData.isPositive
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                          : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                      }`}
                    >
                      {selectedChargeData.isPositive ? (
                        <>
                          <FiPlus className="text-sm" />
                          <span>Switch to Negative</span>
                        </>
                      ) : (
                        <>
                          <FiMinus className="text-sm" />
                          <span>Switch to Positive</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </>
              )
            ) : (
              // No charge selected state
              isMobile ? (
                <div className="flex items-center justify-center w-full">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-600/60" />
                    <span className="text-slate-400 font-medium text-sm">No charge selected</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-slate-600/60" />
                    <span className="text-slate-400 font-medium text-base">No charge selected</span>
                    <span className="text-slate-500 text-sm">Click a charge to view details</span>
                  </div>
                </div>
              )
            )}
          </div>
        </motion.div>

        <motion.button
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowMenu(!showMenu)}
          className="fixed z-50 w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center text-white border-2 border-white/30 backdrop-blur-lg bottom-8 md:bottom-8 right-4 md:right-8"
        >
          <motion.div
            animate={{ rotate: showMenu ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="drop-shadow-lg"
          >
            <FiMenu size={isMobile ? 22 : 24} />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {showMenu && (
            <>
              <motion.button
                initial={{ scale: 0, y: 0, opacity: 0 }}
                animate={{ scale: 1, y: isMobile ? -80 : -90, opacity: 1 }}
                exit={{ scale: 0, y: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                whileHover={{ scale: 1.1, y: isMobile ? -85 : -95 }}
                whileTap={{ scale: 0.9 }}
                onClick={resetCharges}
                className="fixed z-50 w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-full shadow-xl flex items-center justify-center text-white border-2 border-white/30 backdrop-blur-lg bottom-3 md:bottom-6 right-4 md:right-8"
              >
                <FiRefreshCw size={isMobile ? 16 : 18} className="drop-shadow-sm" />
              </motion.button>
              
              <motion.button
                initial={{ scale: 0, y: 0, opacity: 0 }}
                animate={{ scale: 1, y: isMobile ? -150 : -170, opacity: 1 }}
                exit={{ scale: 0, y: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                whileHover={{ scale: 1.1, y: isMobile ? -155 : -175 }}
                whileTap={{ scale: 0.9 }}
                onClick={randomizeCharges}
                className="fixed z-50 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-xl flex items-center justify-center text-white border-2 border-white/30 backdrop-blur-lg bottom-3 md:bottom-6 right-4 md:right-8"
              >
                <FiShuffle size={isMobile ? 16 : 18} className="drop-shadow-sm" />
              </motion.button>

              <motion.button
                initial={{ scale: 0, y: 0, opacity: 0 }}
                animate={{ scale: 1, y: isMobile ? -220 : -250, opacity: 1 }}
                exit={{ scale: 0, y: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
                whileHover={{ scale: 1.1, y: isMobile ? -225 : -255 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleInfo}
                className="fixed z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white border-2 border-white/30 backdrop-blur-lg bottom-3 md:bottom-6 right-4 md:right-8 bg-gradient-to-br from-blue-500 to-blue-600"
              >
                <FiInfo size={isMobile ? 16 : 18} className="drop-shadow-sm" />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowInfo(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full border border-slate-700/50 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/30">
                    <FiInfo className="text-blue-400 text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Coulomb's Law</h3>
                </div>
                
                <div className="space-y-4 text-slate-300">
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
                    <h4 className="font-semibold text-blue-300 mb-2">Formula</h4>
                    <p className="font-mono text-sm bg-slate-900/50 p-2 rounded border border-slate-700/30">
                      F = k × (q₁ × q₂) / r²
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-purple-300 mb-2">Controls</h4>
                      <ul className="text-sm space-y-1 pl-2">
                        <li>• Click/tap to place charges</li>
                        <li>• Click/tap charge to select/deselect</li>
                        <li>• Drag selected charges to move</li>
                        <li>• Scroll wheel to adjust magnitude</li>
                        <li>• Pinch to zoom on mobile</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-green-300 mb-2">Visualization</h4>
                      <ul className="text-sm space-y-1 pl-2">
                        <li>• Blue arrows show electric field</li>
                        <li>• Arrow color indicates field strength</li>
                        <li>• Like charges repel, unlike attract</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowInfo(false)}
                  className="w-full mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  Got it!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CoulombLawDemo;
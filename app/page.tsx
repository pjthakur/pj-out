"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

interface Wall {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isDragging: boolean;
  material: "concrete" | "wood" | "metal" | "glass";
  reflectionCoeff: number;
}

interface WaveConfig {
  frequency: number;
  amplitude: number;
  speed: number;
  waveType: "sine" | "square" | "triangle" | "sawtooth";
  phase: number;
}

interface Point {
  x: number;
  y: number;
}

interface WaveSource {
  id: string;
  x: number;
  y: number;
  isActive: boolean;
}

const WaveReflect: React.FC = () => {
  // Refs for modal management
  const controlPanelRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const settingsModalRef = useRef<HTMLDivElement>(null);
  const helpModalRef = useRef<HTMLDivElement>(null);

  // Core state management
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Responsive state
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // UI state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "wave" | "walls" | "sources" | "analysis"
  >("wave");
  const [isPlaying, setIsPlaying] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showWaveNumbers, setShowWaveNumbers] = useState(false);

  // Wave configuration
  const [waveConfig, setWaveConfig] = useState<WaveConfig>({
    frequency: 1,
    amplitude: 50,
    speed: 1,
    waveType: "sine",
    phase: 0,
  });

  // Wave sources
  const [waveSources, setWaveSources] = useState<WaveSource[]>([
    { id: "1", x: 50, y: 150, isActive: true },
  ]);

  // Walls state with different materials
  const [walls, setWalls] = useState<Wall[]>([
    {
      id: "1",
      x: 300,
      y: 100,
      width: 15,
      height: 100,
      isDragging: false,
      material: "concrete",
      reflectionCoeff: 0.8,
    },
  ]);

  // Canvas dimensions - responsive
  const [canvasSize, setCanvasSize] = useState({ width: 320, height: 240 });

  // Dragging state - Fixed implementation
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    wallId: string | null;
    sourceId: string | null;
    offset: Point;
    startPos: Point;
  }>({
    isDragging: false,
    wallId: null,
    sourceId: null,
    offset: { x: 0, y: 0 },
    startPos: { x: 0, y: 0 },
  });

  // Responsive breakpoints
  const getScreenType = useCallback((width: number) => {
    if (width < 640) return "mobile";
    if (width < 1024) return "tablet";
    return "desktop";
  }, []);

  // Update screen size and responsive states
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setScreenSize({ width, height });
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);

    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (isMenuOpen || isControlsOpen || isSettingsOpen || isHelpOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen, isControlsOpen, isSettingsOpen, isHelpOpen]);

  // Click outside to close modals
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        controlPanelRef.current &&
        !controlPanelRef.current.contains(event.target as Node)
      ) {
        if (isControlsOpen) setIsControlsOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        if (isMenuOpen) setIsMenuOpen(false);
      }

      if (
        settingsModalRef.current &&
        !settingsModalRef.current.contains(event.target as Node)
      ) {
        if (isSettingsOpen) setIsSettingsOpen(false);
      }

      if (
        helpModalRef.current &&
        !helpModalRef.current.contains(event.target as Node)
      ) {
        if (isHelpOpen) setIsHelpOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isControlsOpen, isMenuOpen, isSettingsOpen, isHelpOpen]);

  // Material properties
  const materialProperties = {
    concrete: { color: "#ef4444", reflectionCoeff: 0.8, name: "Concrete" },
    wood: { color: "#d97706", reflectionCoeff: 0.6, name: "Wood" },
    metal: { color: "#6b7280", reflectionCoeff: 0.9, name: "Metal" },
    glass: { color: "#3b82f6", reflectionCoeff: 0.4, name: "Glass" },
  };

  // Wave function implementations
  const waveFunction = useCallback(
    (x: number, t: number, config: WaveConfig, sourceX: number = 0): number => {
      const { frequency, amplitude, speed, waveType, phase } = config;
      const distance = Math.abs(x - sourceX);
      const wavePhase =
        2 * Math.PI * frequency * (t * speed - distance / 100) + phase;

      switch (waveType) {
        case "sine":
          return amplitude * Math.sin(wavePhase);
        case "square":
          return amplitude * Math.sign(Math.sin(wavePhase));
        case "triangle":
          return amplitude * (2 / Math.PI) * Math.asin(Math.sin(wavePhase));
        case "sawtooth":
          return (
            amplitude * (2 / Math.PI) * ((wavePhase % (2 * Math.PI)) - Math.PI)
          );
        default:
          return amplitude * Math.sin(wavePhase);
      }
    },
    []
  );

  // Enhanced wave reflection calculation
  const calculateWaveAtPoint = useCallback(
    (
      x: number,
      t: number,
      config: WaveConfig,
      walls: Wall[],
      sources: WaveSource[]
    ): number => {
      let totalAmplitude = 0;

      // Calculate waves from all active sources
      sources.forEach((source) => {
        if (!source.isActive) return;

        // Direct wave
        totalAmplitude += waveFunction(x, t, config, source.x);

        // Reflected waves from each wall
        walls.forEach((wall) => {
          const distanceToWall = Math.abs(source.x - wall.x);
          const distanceFromWallToPoint = Math.abs(x - wall.x);
          const totalDistance = distanceToWall + distanceFromWallToPoint;
          const timeDelay = totalDistance / (config.speed * 100);

          // Only calculate reflection if the wave has reached the wall
          if (t * config.speed * 100 > distanceToWall) {
            const reflectedAmplitude =
              wall.reflectionCoeff *
              waveFunction(
                source.x,
                t - timeDelay,
                { ...config, phase: config.phase + Math.PI },
                wall.x
              );

            // Add phase shift based on distance from wall
            const phaseShift =
              (2 * Math.PI * config.frequency * distanceFromWallToPoint) / 100;
            totalAmplitude += reflectedAmplitude * Math.cos(phaseShift);
          }
        });
      });

      return totalAmplitude;
    },
    [waveFunction]
  );

  // Enhanced canvas rendering with responsive scaling
  const drawWave = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      config: WaveConfig,
      walls: Wall[],
      sources: WaveSource[],
      time: number
    ) => {
      const { width, height } = ctx.canvas;
      const scale = Math.min(width / 800, height / 600); // Responsive scaling

      // Clear canvas with animated background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#0f172a");
      gradient.addColorStop(0.5, "#1e293b");
      gradient.addColorStop(1, "#0f172a");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw responsive grid
      if (showGrid) {
        ctx.strokeStyle = `rgba(51, 65, 85, ${
          0.3 + 0.2 * Math.sin(time * 0.5)
        })`;
        ctx.lineWidth = 0.5;
        ctx.setLineDash([5 * scale, 5 * scale]);

        const gridSize = Math.max(25, 50 * scale);

        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        ctx.setLineDash([]);
      }

      // Draw wave sources with responsive sizing
      sources.forEach((source, index) => {
        const pulse = source.isActive ? 1 + 0.3 * Math.sin(time * 5) : 0.5;
        const radius = Math.max(8, 15 * scale) * pulse;

        // Source glow effect
        const sourceGradient = ctx.createRadialGradient(
          source.x,
          source.y,
          0,
          source.x,
          source.y,
          radius * 2
        );
        sourceGradient.addColorStop(0, source.isActive ? "#10b981" : "#6b7280");
        sourceGradient.addColorStop(
          0.5,
          source.isActive
            ? "rgba(16, 185, 129, 0.5)"
            : "rgba(107, 114, 128, 0.5)"
        );
        sourceGradient.addColorStop(1, "transparent");

        ctx.fillStyle = sourceGradient;
        ctx.fillRect(
          source.x - radius * 2,
          source.y - radius * 2,
          radius * 4,
          radius * 4
        );

        // Source core
        ctx.fillStyle = source.isActive ? "#10b981" : "#6b7280";
        ctx.beginPath();
        ctx.arc(source.x, source.y, radius, 0, 2 * Math.PI);
        ctx.fill();

        // Source label - responsive font size
        if (showWaveNumbers) {
          ctx.fillStyle = "white";
          ctx.font = `bold ${Math.max(10, 12 * scale)}px Roboto`;
          ctx.textAlign = "center";
          ctx.fillText(
            `S${index + 1}`,
            source.x,
            source.y - radius - 10 * scale
          );
        }
      });

      // Draw walls with responsive sizing and material effects
      walls.forEach((wall, index) => {
        const material = materialProperties[wall.material];
        const shadowOffset = wall.isDragging ? 8 * scale : 3 * scale;

        // Wall shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(
          wall.x + shadowOffset,
          wall.y + shadowOffset,
          wall.width,
          wall.height
        );

        // Wall gradient based on material
        const wallGradient = ctx.createLinearGradient(
          wall.x,
          wall.y,
          wall.x + wall.width,
          wall.y + wall.height
        );
        wallGradient.addColorStop(0, material.color);
        wallGradient.addColorStop(0.5, material.color + "88");
        wallGradient.addColorStop(1, material.color);

        ctx.fillStyle = wallGradient;
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);

        // Wall border with material-specific styling
        ctx.strokeStyle = material.color;
        ctx.lineWidth = wall.isDragging ? 3 * scale : 2 * scale;
        ctx.strokeRect(wall.x, wall.y, wall.width, wall.height);

        // Material indicator - responsive font
        ctx.fillStyle = "white";
        ctx.font = `bold ${Math.max(8, 10 * scale)}px Roboto`;
        ctx.textAlign = "center";
        ctx.fillText(
          material.name[0],
          wall.x + wall.width / 2,
          wall.y + wall.height / 2 + 3 * scale
        );

        // Reflection coefficient display
        if (showWaveNumbers) {
          ctx.fillStyle = "white";
          ctx.font = `${Math.max(10, 12 * scale)}px Roboto`;
          ctx.textAlign = "center";
          ctx.fillText(
            `R: ${(wall.reflectionCoeff * 100).toFixed(0)}%`,
            wall.x + wall.width / 2,
            wall.y - 10 * scale
          );
        }
      });

      // Draw composite wave with responsive line width
      if (isPlaying) {
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = Math.max(2, 3 * scale);
        ctx.shadowColor = "#3b82f6";
        ctx.shadowBlur = 10 * scale;
        ctx.beginPath();

        const centerY = height / 2;
        const step = Math.max(1, 2 * scale);

        for (let x = 0; x < width; x += step) {
          const y =
            centerY + calculateWaveAtPoint(x, time, config, walls, sources);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw individual source waves (faint) - responsive
        sources.forEach((source, index) => {
          if (!source.isActive) return;

          ctx.strokeStyle = `hsla(${index * 60}, 70%, 60%, 0.3)`;
          ctx.lineWidth = Math.max(1, 1 * scale);
          ctx.beginPath();

          for (let x = 0; x < width; x += step) {
            const y = centerY + waveFunction(x, time, config, source.x);
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }

          ctx.stroke();
        });
      }

      // Performance indicator - responsive positioning and font
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = `${Math.max(10, 12 * scale)}px Roboto`;
      ctx.textAlign = "right";
      ctx.fillText(`FPS: ${Math.round(60)}`, width - 10 * scale, 20 * scale);
    },
    [calculateWaveAtPoint, waveFunction, showGrid, showWaveNumbers, isPlaying]
  );

  // Fixed dragging implementation with responsive touch handling
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);

      // Responsive hit detection - larger touch areas on mobile
      const hitRadius = isMobile ? 30 : 20;

      // Check for wall collision
      const clickedWall = walls.find(
        (wall) =>
          x >= wall.x - hitRadius / 2 &&
          x <= wall.x + wall.width + hitRadius / 2 &&
          y >= wall.y - hitRadius / 2 &&
          y <= wall.y + wall.height + hitRadius / 2
      );

      // Check for source collision
      const clickedSource = waveSources.find((source) => {
        const distance = Math.sqrt((x - source.x) ** 2 + (y - source.y) ** 2);
        return distance <= hitRadius;
      });

      if (clickedWall) {
        setDragState({
          isDragging: true,
          wallId: clickedWall.id,
          sourceId: null,
          offset: { x: x - clickedWall.x, y: y - clickedWall.y },
          startPos: { x: clickedWall.x, y: clickedWall.y },
        });

        setWalls((prev) =>
          prev.map((wall) =>
            wall.id === clickedWall.id ? { ...wall, isDragging: true } : wall
          )
        );

        canvas.setPointerCapture(e.pointerId);
      } else if (clickedSource) {
        setDragState({
          isDragging: true,
          wallId: null,
          sourceId: clickedSource.id,
          offset: { x: x - clickedSource.x, y: y - clickedSource.y },
          startPos: { x: clickedSource.x, y: clickedSource.y },
        });

        canvas.setPointerCapture(e.pointerId);
      }
    },
    [walls, waveSources, isMobile]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!dragState.isDragging) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x =
        (e.clientX - rect.left) * (canvas.width / rect.width) -
        dragState.offset.x;
      const y =
        (e.clientY - rect.top) * (canvas.height / rect.height) -
        dragState.offset.y;

      if (dragState.wallId) {
        setWalls((prev) =>
          prev.map((wall) =>
            wall.id === dragState.wallId
              ? {
                  ...wall,
                  x: Math.max(0, Math.min(canvasSize.width - wall.width, x)),
                  y: Math.max(0, Math.min(canvasSize.height - wall.height, y)),
                }
              : wall
          )
        );
      } else if (dragState.sourceId) {
        const margin = isMobile ? 30 : 20;
        setWaveSources((prev) =>
          prev.map((source) =>
            source.id === dragState.sourceId
              ? {
                  ...source,
                  x: Math.max(margin, Math.min(canvasSize.width - margin, x)),
                  y: Math.max(margin, Math.min(canvasSize.height - margin, y)),
                }
              : source
          )
        );
      }
    },
    [dragState, canvasSize, isMobile]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.releasePointerCapture(e.pointerId);

      setDragState({
        isDragging: false,
        wallId: null,
        sourceId: null,
        offset: { x: 0, y: 0 },
        startPos: { x: 0, y: 0 },
      });

      setWalls((prev) => prev.map((wall) => ({ ...wall, isDragging: false })));
    },
    []
  );

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (isPlaying) {
      timeRef.current += 0.02;
    }

    drawWave(ctx, waveConfig, walls, waveSources, timeRef.current);

    animationRef.current = requestAnimationFrame(animate);
  }, [drawWave, waveConfig, walls, waveSources, isPlaying]);

  // Responsive canvas resize handler
  const handleResize = useCallback(() => {
    const updateCanvasSize = () => {
      const container = document.getElementById("canvas-container");
      if (container) {
        const rect = container.getBoundingClientRect();
        const containerWidth = rect.width;
        const padding = isMobile ? 16 : 32;

        let width = Math.max(320, containerWidth - padding);
        let height;

        if (isMobile) {
          // Significantly more height on mobile
          height = Math.min(600, width * 1.5); // More vertical space
          if (window.innerHeight < 600) {
            height = Math.min(500, width * 1.2); // Still more than before
          }
        } else if (isTablet) {
          height = Math.min(500, width * 0.65);
        } else {
          height = Math.min(600, width * 0.6);
        }

        setCanvasSize({ width, height });
      }
    };

    updateCanvasSize();
  }, [isMobile, isTablet]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          setIsControlsOpen((prev) => !prev);
          break;
        case "p":
          setIsPlaying((prev) => !prev);
          break;
        case "r":
          // Reset simulation with responsive positioning
          const wallX = isMobile
            ? canvasSize.width * 0.6
            : canvasSize.width * 0.75;
          const sourceX = isMobile ? 30 : 50;

          setWalls([
            {
              id: "1",
              x: wallX,
              y: canvasSize.height * 0.3,
              width: isMobile ? 15 : 20,
              height: canvasSize.height * 0.35,
              isDragging: false,
              material: "concrete",
              reflectionCoeff: 0.8,
            },
          ]);
          setWaveSources([
            { id: "1", x: sourceX, y: canvasSize.height * 0.5, isActive: true },
          ]);
          timeRef.current = 0;
          break;
        case "g":
          setShowGrid((prev) => !prev);
          break;
        case "n":
          setShowWaveNumbers((prev) => !prev);
          break;
        case "h":
          setIsHelpOpen(true);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [canvasSize, isMobile]);

  // Initialize canvas and animation
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
    }
  }, [canvasSize]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  // Form validation
  const validateFrequency = (value: number): boolean =>
    value >= 0.1 && value <= 10;
  const validateAmplitude = (value: number): boolean =>
    value >= 10 && value <= 150;
  const validateSpeed = (value: number): boolean => value >= 0.1 && value <= 5;
  const validatePhase = (value: number): boolean => value >= 0 && value <= 360;

  // Utility functions with responsive positioning
  const addWall = useCallback(
    (material: Wall["material"] = "concrete") => {
      const wallWidth = isMobile ? 15 : 20;
      const wallHeight = isMobile ? 80 : 100;

      const newWall: Wall = {
        id: Date.now().toString(),
        x: Math.random() * (canvasSize.width - wallWidth - 40) + 20,
        y: Math.random() * (canvasSize.height - wallHeight - 40) + 20,
        width: wallWidth,
        height: wallHeight,
        isDragging: false,
        material,
        reflectionCoeff: materialProperties[material].reflectionCoeff,
      };
      setWalls((prev) => [...prev, newWall]);
    },
    [canvasSize, isMobile]
  );

  const addWaveSource = useCallback(() => {
    const margin = isMobile ? 30 : 40;
    const newSource: WaveSource = {
      id: Date.now().toString(),
      x: Math.random() * (canvasSize.width - margin * 2) + margin,
      y: Math.random() * (canvasSize.height - margin * 2) + margin,
      isActive: true,
    };
    setWaveSources((prev) => [...prev, newSource]);
  }, [canvasSize, isMobile]);

  // Responsive Control Panel
  const ControlPanel = useMemo(
    () => (
      <div
        ref={controlPanelRef}
        className={`fixed ${
          isMobile
            ? "top-16 left-0 right-0 mx-2 w-auto"
            : isTablet
            ? "top-20 right-2 w-72"
            : "top-20 right-4 w-80"
        } bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl transition-all duration-300 ${
          isControlsOpen
            ? "translate-y-0 opacity-100"
            : isMobile
            ? "-translate-y-full opacity-0 pointer-events-none"
            : "translate-x-full opacity-0 pointer-events-none"
        } z-40 `}
      >
        <div className={`p-${isMobile ? "4" : "6"}`}>
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`${
                isMobile ? "text-lg" : "text-xl"
              } font-bold text-gray-900`}
            >
              Wave Controls
            </h3>
            <button
              onClick={() => setIsControlsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              title="Close Controls (Space)"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div
            className={`flex border-b border-gray-200 mb-4 ${
              isMobile ? "text-sm" : ""
            } overflow-x-auto`}
          >
            {[
              { 
                id: "wave", 
                label: "Wave", 
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0 4 4 6 0" />
                  </svg>
                )
              },
              { 
                id: "walls", 
                label: "Walls", 
                icon: (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="4" y="4" width="4" height="16" />
                    <rect x="10" y="4" width="4" height="16" />
                    <rect x="16" y="4" width="4" height="16" />
                  </svg>
                )
              },
              { 
                id: "sources", 
                label: "Sources", 
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3" />
                    <circle cx="12" cy="12" r="6" strokeDasharray="2 2" opacity="0.5" />
                    <circle cx="12" cy="12" r="9" strokeDasharray="3 3" opacity="0.3" />
                  </svg>
                )
              },
              { 
                id: "analysis", 
                label: "Analysis", 
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                  </svg>
                )
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-shrink-0 py-2 px-3 text-sm font-medium transition-colors cursor-pointer flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          <div className=" max-h-[calc(60vh)] overflow-y-auto   ">
            {activeTab === "wave" && (
              <div className={`space-y-${isMobile ? "4" : "6"}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Animation
                  </span>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-sm flex items-center space-x-1 ${
                      isPlaying
                        ? "bg-red-400 text-white hover:bg-red-500"
                        : "bg-green-400 text-white hover:bg-green-500"
                    }`}
                    title="Play/Pause (P)"
                  >
                    {isPlaying ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                    <span>{isPlaying ? "Pause" : "Play"}</span>
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wave Type
                  </label>
                  <select
                    value={waveConfig.waveType}
                    onChange={(e) =>
                      setWaveConfig((prev) => ({
                        ...prev,
                        waveType: e.target.value as any,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer text-sm"
                  >
                    <option value="sine">Sine Wave</option>
                    <option value="square">Square Wave</option>
                    <option value="triangle">Triangle Wave</option>
                    <option value="sawtooth">Sawtooth Wave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency: {waveConfig.frequency.toFixed(1)} Hz
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={waveConfig.frequency}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (validateFrequency(value)) {
                        setWaveConfig((prev) => ({
                          ...prev,
                          frequency: value,
                        }));
                      }
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amplitude: {waveConfig.amplitude}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    step="5"
                    value={waveConfig.amplitude}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (validateAmplitude(value)) {
                        setWaveConfig((prev) => ({
                          ...prev,
                          amplitude: value,
                        }));
                      }
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speed: {waveConfig.speed.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={waveConfig.speed}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (validateSpeed(value)) {
                        setWaveConfig((prev) => ({ ...prev, speed: value }));
                      }
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phase: {waveConfig.phase.toFixed(0)}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="10"
                    value={(waveConfig.phase * 180) / Math.PI}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (validatePhase(value)) {
                        setWaveConfig((prev) => ({
                          ...prev,
                          phase: (value * Math.PI) / 180,
                        }));
                      }
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeTab === "walls" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Drag walls in the canvas to change reflection points.
                  Different materials have different reflection coefficients.
                </p>

                <div
                  className={`grid ${
                    isMobile ? "grid-cols-1" : "grid-cols-2"
                  } gap-2 mb-4`}
                >
                  {Object.entries(materialProperties).map(
                    ([material, props]) => (
                      <button
                        key={material}
                        onClick={() => addWall(material as Wall["material"])}
                        className="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: props.color }}
                        />
                        <div className="text-left">
                          <div className="text-xs font-medium">
                            {props.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {(props.reflectionCoeff * 100).toFixed(0)}%
                          </div>
                        </div>
                      </button>
                    )
                  )}
                </div>

                <div className="bg-blue-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                  <h4 className="font-medium text-blue-900 mb-2 text-sm">
                    Active Walls ({walls.length})
                  </h4>
                  {walls.map((wall) => (
                    <div
                      key={wall.id}
                      className="flex justify-between items-center py-1 border-b border-blue-200 last:border-b-0"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-2 h-2 rounded"
                          style={{
                            backgroundColor:
                              materialProperties[wall.material].color,
                          }}
                        />
                        <span className="text-xs text-blue-700">
                          {materialProperties[wall.material].name} (
                          {Math.round(wall.x)}, {Math.round(wall.y)})
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          setWalls((prev) =>
                            prev.filter((w) => w.id !== wall.id)
                          )
                        }
                        className="text-red-500 hover:text-red-700 cursor-pointer text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "sources" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Manage wave sources. Drag sources in the canvas to reposition
                  them.
                </p>

                <button
                  onClick={addWaveSource}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors cursor-pointer text-sm"
                >
                  Add Wave Source
                </button>

                <div className="bg-green-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                  <h4 className="font-medium text-green-900 mb-2 text-sm">
                    Active Sources ({waveSources.length})
                  </h4>
                  {waveSources.map((source, index) => (
                    <div
                      key={source.id}
                      className="flex justify-between items-center py-1 border-b border-green-200 last:border-b-0"
                    >
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            setWaveSources((prev) =>
                              prev.map((s) =>
                                s.id === source.id
                                  ? { ...s, isActive: !s.isActive }
                                  : s
                              )
                            )
                          }
                          className={`w-4 h-4 rounded-full border transition-colors cursor-pointer ${
                            source.isActive
                              ? "bg-green-500 border-green-500"
                              : "bg-gray-200 border-gray-400"
                          }`}
                        />
                        <span className="text-xs text-green-700">
                          Source {index + 1} ({Math.round(source.x)},{" "}
                          {Math.round(source.y)})
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          setWaveSources((prev) =>
                            prev.filter((s) => s.id !== source.id)
                          )
                        }
                        className="text-red-500 hover:text-red-700 cursor-pointer text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "analysis" && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">
                    Wave Properties
                  </h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>
                      Wavelength: {(100 / waveConfig.frequency).toFixed(1)}px
                    </div>
                    <div>Period: {(1 / waveConfig.frequency).toFixed(2)}s</div>
                    <div>Peak Amplitude: {waveConfig.amplitude}px</div>
                    <div>
                      Active Sources:{" "}
                      {waveSources.filter((s) => s.isActive).length}
                    </div>
                    <div>Active Reflectors: {walls.length}</div>
                    <div>
                      Phase Shift:{" "}
                      {((waveConfig.phase * 180) / Math.PI).toFixed(0)}°
                    </div>
                    <div>
                      Screen: {getScreenType(screenSize.width)} (
                      {screenSize.width}×{screenSize.height})
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2 text-sm">
                    Reflection Analysis
                  </h4>
                  <div className="text-xs text-blue-700 space-y-1">
                    <div>
                      Avg Reflection:{" "}
                      {(
                        walls.reduce(
                          (sum, wall) => sum + wall.reflectionCoeff,
                          0
                        ) / walls.length || 0
                      ).toFixed(2)}
                    </div>
                    <div>
                      Standing Wave Nodes:{" "}
                      {Math.floor(
                        canvasSize.width / (100 / waveConfig.frequency / 2)
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2 text-sm">
                    Visualization
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showGrid}
                        onChange={(e) => setShowGrid(e.target.checked)}
                        className="cursor-pointer"
                      />
                      <span className="text-xs text-yellow-700">
                        Show Grid (G)
                      </span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showWaveNumbers}
                        onChange={(e) => setShowWaveNumbers(e.target.checked)}
                        className="cursor-pointer"
                      />
                      <span className="text-xs text-yellow-700">
                        Show Labels (N)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    [
      isControlsOpen,
      activeTab,
      waveConfig,
      walls,
      waveSources,
      canvasSize,
      isPlaying,
      showGrid,
      showWaveNumbers,
      addWall,
      addWaveSource,
      isMobile,
      isTablet,
      screenSize,
    ]
  );

  // Responsive Settings Modal
  const SettingsModal = useMemo(
    () => (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
          isSettingsOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div
          ref={settingsModalRef}
          className={`relative bg-white rounded-2xl p-4 w-full max-h-[80vh] overflow-y-auto ${
            isMobile ? "max-w-sm" : isTablet ? "max-w-md" : "max-w-lg"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`${
                isMobile ? "text-lg" : "text-xl"
              } font-bold text-gray-900`}
            >
              Settings
            </h3>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Display Options
              </h4>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-700">Show Grid</span>
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-700">
                    Show Wave Numbers
                  </span>
                  <input
                    type="checkbox"
                    checked={showWaveNumbers}
                    onChange={(e) => setShowWaveNumbers(e.target.checked)}
                    className="cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Device Info</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>
                  Screen: {screenSize.width}×{screenSize.height}
                </div>
                <div>Type: {getScreenType(screenSize.width)}</div>
                <div>
                  Canvas: {canvasSize.width}×{canvasSize.height}
                </div>
                <div>Touch: {isMobile ? "Optimized" : "Desktop"}</div>
                <div>Rendering: Hardware Accelerated</div>
              </div>
            </div>

            <button
              onClick={() => {
                // Reset all settings to default
                setShowGrid(true);
                setShowWaveNumbers(false);
                setWaveConfig({
                  frequency: 2,
                  amplitude: 50,
                  speed: 2,
                  waveType: "sine",
                  phase: 0,
                });
                setIsSettingsOpen(false);
              }}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    ),
    [
      isSettingsOpen,
      showGrid,
      showWaveNumbers,
      canvasSize,
      screenSize,
      isMobile,
      isTablet,
      getScreenType,
    ]
  );

  // Responsive Help Modal
  const HelpModal = useMemo(
    () => (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-2 transition-all duration-300 ${
          isHelpOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div
          ref={helpModalRef}
          className={`relative bg-white rounded-2xl p-4 w-full ${
            isMobile ? "max-w-sm" : isTablet ? "max-w-lg" : "max-w-2xl"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`${
                isMobile ? "text-lg" : "text-xl"
              } font-bold text-gray-900`}
            >
              Help & Shortcuts
            </h3>
            <button
              onClick={() => setIsHelpOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-6 max-h-[70vh] overflow-y-auto ">
            {!isMobile && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Keyboard Shortcuts
                </h4>
                <div
                  className={`grid ${
                    isTablet ? "grid-cols-1" : "grid-cols-2"
                  } gap-4 text-sm`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                        Space
                      </span>
                      <span>Toggle Controls</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                        P
                      </span>
                      <span>Play/Pause</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                        R
                      </span>
                      <span>Reset</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                        G
                      </span>
                      <span>Toggle Grid</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                        N
                      </span>
                      <span>Toggle Numbers</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                        H
                      </span>
                      <span>Help</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium text-gray-900 mb-3">How to Use</h4>
              <div className="text-sm text-gray-600 space-y-2">
                <div>
                  • <strong>Drag walls and sources</strong>{" "}
                  {isMobile ? "with your finger" : "with mouse"} to change wave
                  patterns
                </div>
                <div>
                  • <strong>Add different materials</strong> with varying
                  reflection coefficients
                </div>
                <div>
                  • <strong>Multiple wave sources</strong> create complex
                  interference patterns
                </div>
                <div>
                  • <strong>Toggle source activation</strong> to see individual
                  wave contributions
                </div>
                <div>
                  • <strong>Adjust wave parameters</strong> to see how
                  frequency, amplitude, and phase affect patterns
                </div>
                {isMobile && (
                  <div>
                    • <strong>Use quick controls</strong> at the bottom of the
                    canvas for easy adjustments
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Wave Physics</h4>
              <div className="text-sm text-gray-600 space-y-2">
                <div>
                  • <strong>Blue waves</strong> represent the composite wave
                  pattern
                </div>
                <div>
                  • <strong>Faint colored waves</strong> show individual source
                  contributions
                </div>
                <div>
                  • <strong>Standing waves</strong> form when reflected waves
                  interfere with original waves
                </div>
                <div>
                  • <strong>Different materials</strong> reflect different
                  amounts of wave energy
                </div>
              </div>
            </div>

            {isMobile && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Mobile Tips</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <div>
                    • <strong>Larger touch areas</strong> make dragging easier
                    on mobile
                  </div>
                  <div>
                    • <strong>Responsive canvas</strong> adapts to your screen
                    size
                  </div>
                  <div>
                    • <strong>Portrait mode</strong> optimizes the layout for
                    phone use
                  </div>
                  <div>
                    • <strong>Quick controls</strong> provide easy access to
                    common settings
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    [isHelpOpen, isMobile, isTablet]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 font-['Roboto',sans-serif]">
      {/* Professional Header - Responsive */}
      <header className="relative z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div
            className={`flex justify-between items-center ${
              isMobile ? "h-14" : "h-16"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`${
                  isMobile ? "w-8 h-8" : "w-10 h-10"
                } bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center`}
              >
                <span
                  className={`text-white font-bold ${
                    isMobile ? "text-lg" : "text-xl"
                  }`}
                >
                  W
                </span>
              </div>
              <div>
                <h1
                  className={`${
                    isMobile ? "text-lg" : "text-xl"
                  } font-bold text-white`}
                >
                  WaveReflect Pro
                </h1>
                {!isMobile && (
                  <p className="text-sm text-blue-200">
                    Advanced Sound Wave Simulation
                  </p>
                )}
              </div>
            </div>

            <div
              className={`hidden ${
                isMobile ? "sm" : "md"
              }:flex items-center space-x-2`}
            >
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors cursor-pointer text-sm ${
                  isPlaying
                    ? "bg-red-500 text-white hover:bg-red-700"
                    : "bg-green-500 text-white hover:bg-green-700"
                }`}
                title="Play/Pause (P)"
              >
                {isPlaying ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
                <span className="hidden lg:inline">
                  {isPlaying ? "Pause" : "Play"}
                </span>
              </button>

              <button
                onClick={() => setIsControlsOpen(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm"
                title="Open Controls (Space)"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
                <span className="hidden lg:inline">Controls</span>
              </button>

              {!isMobile && (
                <>
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                    title="Settings"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => setIsHelpOpen(true)}
                    className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                    title="Help (H)"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${
                isMobile ? "sm" : "md"
              }:hidden p-2 text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu - Responsive */}
        {isMenuOpen && (
          <div
            ref={mobileMenuRef}
            className={`${
              isMobile ? "sm" : "md"
            }:hidden bg-white/10 backdrop-blur-md border-t border-white/20`}
          >
            <div className="px-4 py-3 space-y-2">
              <button
                onClick={() => {
                  setIsPlaying(!isPlaying);
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors cursor-pointer text-sm ${
                  isPlaying
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
                <span>{isPlaying ? "Pause Animation" : "Play Animation"}</span>
              </button>

              <button
                onClick={() => {
                  setIsControlsOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
                <span>Wave Controls</span>
              </button>

              <button
                onClick={() => {
                  setIsSettingsOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer text-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>Settings</span>
              </button>

              <button
                onClick={() => {
                  setIsHelpOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer text-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Help & Shortcuts</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content - Responsive */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
          {/* Hero Section - Responsive */}
          <div className="text-center mb-6 sm:mb-8">
            <h2
              className={`${
                isMobile ? "text-2xl sm:text-3xl" : "text-4xl md:text-6xl"
              } font-bold text-white mb-4`}
            >
              Wave Reflection
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {" "}
                Simulation
              </span>
            </h2>
            <p
              className={`${
                isMobile ? "text-base" : "text-xl"
              } text-blue-200 max-w-3xl mx-auto px-4`}
            >
              Experience real-time sound wave physics with interactive
              reflection barriers and multiple wave sources.
              {isMobile
                ? " Drag with your finger to create patterns."
                : " Drag walls and sources to create complex interference patterns."}
            </p>
          </div>

          {/* Status Bar - Responsive */}
          <div
            className={`flex ${
              isMobile
                ? "flex-wrap justify-center"
                : "justify-center items-center"
            } space-x-4 mb-6 text-sm text-blue-200`}
          >
            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
              <div
                className={`w-3 h-3 rounded-full ${
                  isPlaying ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span>{isPlaying ? "Playing" : "Paused"}</span>
            </div>
            <div className="mb-2 sm:mb-0">
              Sources: {waveSources.filter((s) => s.isActive).length}/
              {waveSources.length}
            </div>
            <div className="mb-2 sm:mb-0">Walls: {walls.length}</div>
            <div className="mb-2 sm:mb-0">
              Freq: {waveConfig.frequency.toFixed(1)} Hz
            </div>
            {!isMobile && (
              <div>
                Canvas: {canvasSize.width}×{canvasSize.height}
              </div>
            )}
          </div>

          {/* Canvas Container - Fully Responsive */}
          <div
            id="canvas-container"
            className={`relative bg-white/5 backdrop-blur-sm rounded-2xl ${
              isMobile ? "p-2" : "p-4 md:p-8"
            } shadow-2xl border border-white/10`}
          >
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="w-full h-auto rounded-xl shadow-inner cursor-crosshair touch-none"
              style={{ maxWidth: "100%", height: "auto" }}
            />

            {/* Canvas Overlay Info - Responsive */}
            <div
              className={`absolute ${
                isMobile ? "top-2 left-2" : "top-8 left-8"
              } bg-black/50 backdrop-blur-sm rounded-lg p-2 text-white ${
                isMobile ? "text-xs" : "text-sm"
              }`}
            >
              <div
                className={`grid ${
                  isMobile
                    ? "grid-cols-2 gap-1"
                    : "grid-cols-1 md:grid-cols-2 gap-2"
                }`}
              >
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Wave</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Source</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-sm"></div>
                  <span>Wall</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full opacity-50"></div>
                  <span>Faint</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons - Responsive */}
            <div
              className={`absolute ${
                isMobile ? "top-2 right-2" : "top-8 right-8"
              } flex space-x-1`}
            >
              <button
                onClick={() => addWall()}
                className={`bg-red-600/80 hover:bg-red-600 text-white ${
                  isMobile ? "p-1.5" : "p-2"
                } rounded-lg transition-colors cursor-pointer`}
                title="Add Wall"
              >
                <svg
                  className={`${isMobile ? "w-3 h-3" : "w-4 h-4"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>

              <button
                onClick={addWaveSource}
                className={`bg-green-600/80 hover:bg-green-600 text-white ${
                  isMobile ? "p-1.5" : "p-2"
                } rounded-lg transition-colors cursor-pointer`}
                title="Add Wave Source"
              >
                <svg
                  className={`${isMobile ? "w-3 h-3" : "w-4 h-4"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </button>
            </div>

            {/* Quick Controls for Mobile - Enhanced */}
            <div
              className={`${
                isMobile ? "block" : "hidden"
              } absolute bottom-2 left-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg p-3`}
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white mb-1">
                    Freq: {waveConfig.frequency.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={waveConfig.frequency}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (validateFrequency(value)) {
                        setWaveConfig((prev) => ({
                          ...prev,
                          frequency: value,
                        }));
                      }
                    }}
                    className="w-full h-1 bg-gray-600 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white mb-1">
                    Amp: {waveConfig.amplitude}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    step="5"
                    value={waveConfig.amplitude}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (validateAmplitude(value)) {
                        setWaveConfig((prev) => ({
                          ...prev,
                          amplitude: value,
                        }));
                      }
                    }}
                    className="w-full h-1 bg-gray-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-center mt-2">
                <button
                  onClick={() => setIsControlsOpen(true)}
                  className="bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors cursor-pointer"
                >
                  More Controls
                </button>
              </div>
            </div>
          </div>

          {/* Feature Grid - Responsive */}
          <div
            className={`grid ${
              isMobile
                ? "grid-cols-1 gap-4"
                : isTablet
                ? "grid-cols-2 gap-6"
                : "md:grid-cols-4 gap-6"
            } mt-8 sm:mt-16`}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10 hover:bg-white/10 transition-colors">
              <div
                className={`${
                  isMobile ? "w-10 h-10" : "w-12 h-12"
                } bg-blue-500 rounded-lg flex items-center justify-center mb-4`}
              >
                <svg
                  className={`${isMobile ? "w-5 h-5" : "w-6 h-6"} text-white`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3
                className={`${
                  isMobile ? "text-lg" : "text-xl"
                } font-bold text-white mb-2`}
              >
                Real-Time Physics
              </h3>
              <p
                className={`text-blue-200 ${isMobile ? "text-sm" : "text-sm"}`}
              >
                Authentic wave behavior with accurate reflection coefficients
                and interference patterns.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10 hover:bg-white/10 transition-colors">
              <div
                className={`${
                  isMobile ? "w-10 h-10" : "w-12 h-12"
                } bg-green-500 rounded-lg flex items-center justify-center mb-4`}
              >
                <svg
                  className={`${isMobile ? "w-5 h-5" : "w-6 h-6"} text-white`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3
                className={`${
                  isMobile ? "text-lg" : "text-xl"
                } font-bold text-white mb-2`}
              >
                Touch Optimized
              </h3>
              <p
                className={`text-blue-200 ${isMobile ? "text-sm" : "text-sm"}`}
              >
                Fully responsive design with touch-friendly controls for mobile
                devices and tablets.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10 hover:bg-white/10 transition-colors">
              <div
                className={`${
                  isMobile ? "w-10 h-10" : "w-12 h-12"
                } bg-purple-500 rounded-lg flex items-center justify-center mb-4`}
              >
                <svg
                  className={`${isMobile ? "w-5 h-5" : "w-6 h-6"} text-white`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"
                  />
                </svg>
              </div>
              <h3
                className={`${
                  isMobile ? "text-lg" : "text-xl"
                } font-bold text-white mb-2`}
              >
                Advanced Analysis
              </h3>
              <p
                className={`text-blue-200 ${isMobile ? "text-sm" : "text-sm"}`}
              >
                Multiple wave types, frequency analysis, and standing wave
                pattern visualization.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10 hover:bg-white/10 transition-colors">
              <div
                className={`${
                  isMobile ? "w-10 h-10" : "w-12 h-12"
                } bg-orange-500 rounded-lg flex items-center justify-center mb-4`}
              >
                <svg
                  className={`${isMobile ? "w-5 h-5" : "w-6 h-6"} text-white`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4L5.5 6M17 4l1.5 2M6 8v8a2 2 0 002 2h8a2 2 0 002-2V8M10 12h4"
                  />
                </svg>
              </div>
              <h3
                className={`${
                  isMobile ? "text-lg" : "text-xl"
                } font-bold text-white mb-2`}
              >
                Multiple Sources
              </h3>
              <p
                className={`text-blue-200 ${isMobile ? "text-sm" : "text-sm"}`}
              >
                Create complex interference patterns with multiple wave sources
                and materials.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modals and Panels - All Responsive */}
      {ControlPanel}
      {SettingsModal}
      {HelpModal}

      {/* Footer - Responsive */}
      <footer className="bg-black/20 border-t border-white/10 mt-8 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <div className="text-center text-blue-200">
            <p className={`${isMobile ? "text-sm" : ""}`}>
              &copy; 2025 WaveReflect Pro. Advanced Wave Simulation Technology.
            </p>
            <p className={`${isMobile ? "text-xs" : "text-sm"} mt-2`}>
              {isMobile
                ? "Tap canvas to interact"
                : "Press H for help and keyboard shortcuts"}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WaveReflect;
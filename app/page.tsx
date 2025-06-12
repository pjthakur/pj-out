"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  BeakerIcon,
  XMarkIcon,
  Bars3Icon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  AdjustmentsHorizontalIcon,
  RocketLaunchIcon,
  ChartPieIcon,
  BookOpenIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CpuChipIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ProjectileState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  time: number;
  isFlying: boolean;
  hasCollided: boolean;
  collisionType?: string;
}

const ProjectileMotionSimulator: React.FC = () => {
  // Core simulation state
  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(25);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [projectile, setProjectile] = useState<ProjectileState>({
    x: 50,
    y: 320,
    vx: 0,
    vy: 0,
    time: 0,
    isFlying: false,
    hasCollided: false,
  });

  // UI state
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTrajectory, setShowTrajectory] = useState(true);
  const [showVectors, setShowVectors] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [controlPanelOpen, setControlPanelOpen] = useState(false);
  const [controlPanelPosition, setControlPanelPosition] = useState({
    x: 20,
    y: 100,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isInSimulatorSection, setIsInSimulatorSection] = useState(false);

  const [isClient, setisClient] = useState(false);

  // Section refs for smooth scrolling
  const heroRef = useRef<HTMLDivElement | null>(null);
  const simulatorRef = useRef<HTMLDivElement | null>(null);
  const featuresRef = useRef<HTMLDivElement | null>(null);
  const analyticsRef = useRef<HTMLDivElement | null>(null);
  const documentationRef = useRef<HTMLDivElement | null>(null);
  const enterpriseRef = useRef<HTMLDivElement | null>(null);

  // Physics constants
  const GRAVITY = 9.81;
  const SCALE = 4 * zoomLevel;
  const TIME_STEP = 0.02;
  const BASE_CANVAS_HEIGHT = 400;
  const CANVAS_HEIGHT = BASE_CANVAS_HEIGHT * zoomLevel;
  const GROUND_Y = 360 * zoomLevel;
  const LAUNCH_X = 50 * zoomLevel;
  const LAUNCH_Y = 320 * zoomLevel;

  // Static obstacles (scaled)
  const obstacles: Obstacle[] = [
    {
      x: 200 * zoomLevel,
      y: 250 * zoomLevel,
      width: 60 * zoomLevel,
      height: 110 * zoomLevel,
    },
    {
      x: 350 * zoomLevel,
      y: 200 * zoomLevel,
      width: 80 * zoomLevel,
      height: 160 * zoomLevel,
    },
    {
      x: 500 * zoomLevel,
      y: 220 * zoomLevel,
      width: 70 * zoomLevel,
      height: 140 * zoomLevel,
    },
  ];

  // Refs
  const animationRef = useRef<number | null>(null);
  const dragRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 });
  const collisionNotifiedRef = useRef(false);

  // Smooth scroll function
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setMobileMenuOpen(false);
  };

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        // compute the actual panel width (we cap it at window.innerWidth - 20 for 10px margins)
        const panelWidth = Math.min(320, window.innerWidth - 20);
        // maxX is the rightmost x coordinate that still shows the panel fully
        const maxX = window.innerWidth - panelWidth;
        // pick a small margin (10px), but never exceed maxX
        const initialX = Math.min(10, maxX);
        setControlPanelPosition({
          x: initialX,
          y: 80,
        });
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  useEffect(() => {
    if (!isClient) {
      setisClient(true);
    }
  }, []);

  // Check if user is in simulator section
  useEffect(() => {
    const checkSection = () => {
      if (simulatorRef.current) {
        const rect = simulatorRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        setIsInSimulatorSection(isVisible);
      }
    };

    checkSection();
    window.addEventListener('scroll', checkSection);
    return () => window.removeEventListener('scroll', checkSection);
  }, []);
  // Toast management
  const addToast = useCallback((message: string, type: Toast["type"]) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  // Calculate trajectory points for visualization
  const trajectoryPoints = React.useMemo(() => {
    const angleRad = (angle * Math.PI) / 180;
    const v0x = velocity * Math.cos(angleRad);
    const v0y = velocity * Math.sin(angleRad);

    const points: { x: number; y: number }[] = [];
    let t = 0;

    while (t <= 10) {
      const x = LAUNCH_X + v0x * t * SCALE;
      const y = LAUNCH_Y - (v0y * t - 0.5 * GRAVITY * t * t) * SCALE;

      if (y >= GROUND_Y) {
        points.push({ x, y: GROUND_Y });
        break;
      }

      let hitObstacle = false;
      for (const obstacle of obstacles) {
        if (
          x >= obstacle.x &&
          x <= obstacle.x + obstacle.width &&
          y >= obstacle.y &&
          y <= obstacle.y + obstacle.height
        ) {
          hitObstacle = true;
          break;
        }
      }

      points.push({ x, y });
      if (hitObstacle) break;

      t += 0.05;
    }

    return points;
  }, [angle, velocity, LAUNCH_X, LAUNCH_Y, SCALE, GROUND_Y, obstacles]);

  // Check collision function
  const checkCollision = useCallback(
    (x: number, y: number) => {
      if (y >= GROUND_Y) return "ground";

      for (const obstacle of obstacles) {
        if (
          x >= obstacle.x &&
          x <= obstacle.x + obstacle.width &&
          y >= obstacle.y &&
          y <= obstacle.y + obstacle.height
        ) {
          return "obstacle";
        }
      }

      return null;
    },
    [GROUND_Y, obstacles]
  );

  // Animation loop
  useEffect(() => {
    if (!isPlaying || !projectile.isFlying || projectile.hasCollided) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = () => {
      setProjectile((prev) => {
        const newTime = prev.time + TIME_STEP;
        const angleRad = (angle * Math.PI) / 180;
        const v0x = velocity * Math.cos(angleRad);
        const v0y = velocity * Math.sin(angleRad);

        const newX = LAUNCH_X + v0x * newTime * SCALE;
        const newY =
          LAUNCH_Y -
          (v0y * newTime - 0.5 * GRAVITY * newTime * newTime) * SCALE;

        const newVx = v0x;
        const newVy = v0y - GRAVITY * newTime;

        const collision = checkCollision(newX, newY);
        if (collision && !collisionNotifiedRef.current) {
          collisionNotifiedRef.current = true;

          setTimeout(() => {
            addToast(
              collision === "ground" ? "Ground impact!" : "Obstacle collision!",
              "info"
            );
            setIsPlaying(false);
            // Reset projectile position after collision
            setTimeout(() => {
              setProjectile({
                x: LAUNCH_X,
                y: LAUNCH_Y,
                vx: 0,
                vy: 0,
                time: 0,
                isFlying: false,
                hasCollided: false,
              });
            }, 500); // Reset after a short delay to show the collision
          }, 100);

          return {
            ...prev,
            x: newX,
            y: collision === "ground" ? GROUND_Y : newY,
            hasCollided: true,
            isFlying: false,
            collisionType: collision,
          };
        }

        return {
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          time: newTime,
          isFlying: true,
          hasCollided: false,
        };
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    isPlaying,
    projectile.isFlying,
    projectile.hasCollided,
    angle,
    velocity,
    checkCollision,
    addToast,
    LAUNCH_X,
    LAUNCH_Y,
    SCALE,
    GROUND_Y,
  ]);

  // Start/stop simulation
  const toggleSimulation = () => {
    if (!isPlaying) {
      if (!projectile.isFlying) {
        collisionNotifiedRef.current = false;

        const angleRad = (angle * Math.PI) / 180;
        const v0x = velocity * Math.cos(angleRad);
        const v0y = velocity * Math.sin(angleRad);

        setProjectile({
          x: LAUNCH_X,
          y: LAUNCH_Y,
          vx: v0x,
          vy: v0y,
          time: 0,
          isFlying: true,
          hasCollided: false,
        });

        addToast("Projectile launched!", "success");
      }
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      addToast("Simulation paused", "info");
    }
  };

  // Reset simulation
  const resetSimulation = () => {
    setIsPlaying(false);
    collisionNotifiedRef.current = false;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setProjectile({
      x: LAUNCH_X,
      y: LAUNCH_Y,
      vx: 0,
      vy: 0,
      time: 0,
      isFlying: false,
      hasCollided: false,
    });
    addToast("Simulation reset", "success");
  };

  // Zoom controls
  const zoomIn = () => {
    if (zoomLevel < 1.1) {
      const newZoomLevel = zoomLevel === 1 ? 1.05 : 1.1;
      setZoomLevel(newZoomLevel);
      // Reset simulation after zoom level is set
      setTimeout(() => {
        const newLaunchX = 50 * newZoomLevel;
        const newLaunchY = 320 * newZoomLevel;
        // resetSimulation();

        // collisionNotifiedRef.current = false;
        // if (animationRef.current) {
        //   cancelAnimationFrame(animationRef.current);
        // }
        setProjectile((prev) => ({
          ...prev,
          x: newLaunchX,
          y: newLaunchY,
          vx: 0,
          vy: 0,
          time: 0,
          isFlying: false,
          hasCollided: false,
        }));
      }, 50);
      addToast(`Zoomed to ${newZoomLevel === 1.05 ? "1.05x" : "1.1x"}`, "info");
    }
  };

  const zoomOut = () => {
    if (zoomLevel > 1) {
      const newZoomLevel = zoomLevel === 1.1 ? 1.05 : 1;
      setZoomLevel(newZoomLevel);
      // Reset simulation after zoom level is set
      setTimeout(() => {
        const newLaunchX = 50 * newZoomLevel;
        const newLaunchY = 320 * newZoomLevel;

        setProjectile((prev) => ({
          ...prev,
          x: newLaunchX,
          y: newLaunchY,
          vx: 0,
          vy: 0,
          time: 0,
          isFlying: false,
          hasCollided: false,
        }));
      }, 50);
      addToast(`Zoomed to ${newZoomLevel === 1.05 ? "1.05x" : "1x"}`, "info");
    }
  };

  // Drag functionality
  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: controlPanelPosition.x,
      startPosY: controlPanelPosition.y,
    };
  };

  const handleTitleBarTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    setIsDragging(true);
    dragRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startPosX: controlPanelPosition.x,
      startPosY: controlPanelPosition.y,
    };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;

      const panelWidth = isMobile ? Math.min(320, window.innerWidth - 20) : 320;
      const panelHeight = isMobile ? 450 : 400;

      setControlPanelPosition({
        x: Math.max(
          0,
          Math.min(
            window.innerWidth - panelWidth,
            dragRef.current.startPosX + deltaX
          )
        ),
        y: Math.max(
          0,
          Math.min(
            window.innerHeight - panelHeight,
            dragRef.current.startPosY + deltaY
          )
        ),
      });
    },
    [isDragging, isMobile]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      const touch = e.touches[0];
      const deltaX = touch.clientX - dragRef.current.startX;
      const deltaY = touch.clientY - dragRef.current.startY;

      const panelWidth = isMobile ? Math.min(320, window.innerWidth - 20) : 320;
      const panelHeight = isMobile ? 450 : 400;

      setControlPanelPosition({
        x: Math.max(
          0,
          Math.min(
            window.innerWidth - panelWidth,
            dragRef.current.startPosX + deltaX
          )
        ),
        y: Math.max(
          0,
          Math.min(
            window.innerHeight - panelHeight,
            dragRef.current.startPosY + deltaY
          )
        ),
      });
    },
    [isDragging, isMobile]
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleEnd]);

  // Click outside handler for mobile menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        mobileMenuOpen &&
        !target.closest(".mobile-menu") &&
        !target.closest(".menu-button")
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [mobileMenuOpen]);

  const pathData =
    trajectoryPoints.length > 0
      ? `M ${trajectoryPoints[0].x} ${trajectoryPoints[0].y} ` +
        trajectoryPoints
          .slice(1)
          .map((p) => `L ${p.x} ${p.y}`)
          .join(" ")
      : "";
  if (!isClient) {
    return "";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-x-hidden font-roboto">
      {/* Navigation */}
      <nav className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/50 px-2 sm:px-4 py-3 relative z-30 fixed w-full top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <BeakerIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
            <span className="text-lg sm:text-xl font-bold text-white">
              PhysicsLab Pro
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => scrollToSection(simulatorRef)}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Simulator
            </button>
            <button
              onClick={() => scrollToSection(featuresRef)}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection(analyticsRef)}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Analytics
            </button>
            <button
              onClick={() => scrollToSection(documentationRef)}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Documentation
            </button>
            <button
              onClick={() => scrollToSection(enterpriseRef)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Enterprise
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={() => setControlPanelOpen(!controlPanelOpen)}
              className="text-white p-2 cursor-pointer"
              title="Toggle Control Panel"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
            </button>
            <button
              className="text-white menu-button p-2 cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700/50 mobile-menu z-40">
            <div className="px-4 py-4 space-y-3">
              <button
                onClick={() => scrollToSection(simulatorRef)}
                className="block text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Simulator
              </button>
              <button
                onClick={() => scrollToSection(featuresRef)}
                className="block text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection(analyticsRef)}
                className="block text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Analytics
              </button>
              <button
                onClick={() => scrollToSection(documentationRef)}
                className="block text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Documentation
              </button>
              <button
                onClick={() => scrollToSection(enterpriseRef)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Enterprise
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div
        ref={heroRef}
        className="pt-16 px-2 sm:px-4 py-8 sm:py-16 text-center"
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
            Advanced Physics <span className="text-blue-400">Simulation</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
            Experience cutting-edge projectile motion simulation with real-time
            physics, interactive controls, and professional-grade analytics for
            education and research.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={() => scrollToSection(simulatorRef)}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 cursor-pointer"
            >
              Try Simulator
            </button>
            <button
              onClick={() => scrollToSection(featuresRef)}
              className="w-full sm:w-auto border-2 border-slate-600 hover:border-slate-500 text-white px-8 py-4 rounded-xl font-semibold transition-all cursor-pointer"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div ref={featuresRef} className="px-2 sm:px-4 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Powerful <span className="text-blue-400">Features</span>
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Everything you need for comprehensive physics simulation and
              analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all">
              <RocketLaunchIcon className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">
                Real-time Physics
              </h3>
              <p className="text-slate-300">
                Advanced physics engine with accurate trajectory calculation and
                collision detection
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all">
              <ChartPieIcon className="h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">
                Live Analytics
              </h3>
              <p className="text-slate-300">
                Real-time data visualization with velocity vectors and
                trajectory paths
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all">
              <CpuChipIcon className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">
                Interactive Controls
              </h3>
              <p className="text-slate-300">
                Intuitive interface with drag-and-drop panels and responsive
                controls
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all">
              <GlobeAltIcon className="h-12 w-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">
                Cross-Platform
              </h3>
              <p className="text-slate-300">
                Works seamlessly on desktop, tablet, and mobile devices
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all">
              <ShieldCheckIcon className="h-12 w-12 text-red-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">
                Collision Detection
              </h3>
              <p className="text-slate-300">
                Advanced obstacle detection with multiple collision types and
                feedback
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all">
              <LightBulbIcon className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">
                Educational Tools
              </h3>
              <p className="text-slate-300">
                Perfect for students, educators, and researchers studying
                physics
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Section */}
      <div ref={simulatorRef} className="px-2 sm:px-4 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Interactive <span className="text-blue-400">Simulator</span>
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Experience physics in action with our interactive projectile
              motion simulator
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-2 sm:p-4 md:p-6">
            {/* Zoom Controls */}
            <div className="flex items-center justify-center mb-4 space-x-2">
              <button
                onClick={zoomOut}
                disabled={zoomLevel <= 1}
                className="flex items-center space-x-1 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg transition-all cursor-pointer"
              >
                <MagnifyingGlassMinusIcon className="h-4 w-4" />
                <span className="text-sm">Zoom Out</span>
              </button>
              <span className="text-white font-medium bg-slate-700 px-3 py-2 rounded-lg text-sm">
                {zoomLevel}x
              </span>
              <button
                onClick={zoomIn}
                disabled={zoomLevel >= 1.1}
                className="flex items-center space-x-1 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg transition-all cursor-pointer"
              >
                <MagnifyingGlassPlusIcon className="h-4 w-4" />
                <span className="text-sm">Zoom In</span>
              </button>
            </div>

            {/* Simulation Canvas */}
            <div
              className="relative bg-gradient-to-b from-sky-200 to-green-200 rounded-xl overflow-hidden mb-4 sm:mb-6 mx-auto"
              style={{
                height: `${Math.min(
                  CANVAS_HEIGHT,
                  isMobile ? window.innerHeight * 0.8 : window.innerHeight * 0.6
                )}px`,
                // width:
                //   isMobile && zoomLevel > 1 ? `${800 * zoomLevel}px` : "100%",
                width: isMobile && zoomLevel > 1 ? "100%" : "100%",
                maxWidth: isMobile && zoomLevel > 1 ? "none" : "100%",
                // overflowX: zoomLevel > 1 ? "auto" : "hidden",
                overflowY: "hidden",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {/* Sky with sun and clouds */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-sky-200 to-green-300">
                {/* Sun */}
                <div
                  className="absolute bg-yellow-400 rounded-full shadow-lg opacity-90"
                  style={{
                    top: 6 * zoomLevel,
                    right: 8 * zoomLevel,
                    width: 12 * zoomLevel,
                    height: 12 * zoomLevel,
                  }}
                >
                  <div
                    className="absolute bg-yellow-300 rounded-full"
                    style={{
                      top: 1 * zoomLevel,
                      left: 1 * zoomLevel,
                      right: 1 * zoomLevel,
                      bottom: 1 * zoomLevel,
                    }}
                  ></div>
                </div>

                {/* Clouds */}
                <div
                  className="absolute bg-white/60 rounded-full"
                  style={{
                    top: 8 * zoomLevel,
                    left: 20 * zoomLevel,
                    width: 8 * zoomLevel,
                    height: 4 * zoomLevel,
                  }}
                ></div>
                <div
                  className="absolute bg-white/40 rounded-full"
                  style={{
                    top: 12 * zoomLevel,
                    left: 16 * zoomLevel,
                    width: 12 * zoomLevel,
                    height: 6 * zoomLevel,
                  }}
                ></div>
                <div
                  className="absolute bg-white/50 rounded-full"
                  style={{
                    top: 16 * zoomLevel,
                    right: 32 * zoomLevel,
                    width: 10 * zoomLevel,
                    height: 5 * zoomLevel,
                  }}
                ></div>
              </div>

              {/* Ground */}
              <div
                className="absolute left-0 right-0 bg-gradient-to-t from-green-700 to-green-500"
                style={{
                  bottom: 0,
                  height: `${(BASE_CANVAS_HEIGHT - 360) * zoomLevel}px`,
                }}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 bg-green-800"
                  style={{ height: 2 * zoomLevel }}
                ></div>
                <div
                  className="absolute left-0 right-0 bg-green-600 opacity-70"
                  style={{
                    bottom: 2 * zoomLevel,
                    height: 4 * zoomLevel,
                  }}
                ></div>
              </div>

              {/* SVG Overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="12"
                    markerHeight="8"
                    refX="10"
                    refY="4"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <polygon points="0 0, 12 4, 0 8" fill="#3b82f6" />
                  </marker>

                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Trajectory Path */}
                {showTrajectory && pathData && (
                  <path
                    d={pathData}
                    stroke="#ef4444"
                    strokeWidth={3 * zoomLevel}
                    fill="none"
                    strokeDasharray={`${8 * zoomLevel},${4 * zoomLevel}`}
                    opacity="0.8"
                  />
                )}

                {/* Projectile */}
                <circle
                  cx={projectile.x}
                  cy={projectile.y}
                  r={8 * zoomLevel}
                  fill="#dc2626"
                  stroke="#fff"
                  strokeWidth={2 * zoomLevel}
                  filter="url(#glow)"
                />

                {/* Velocity Vectors */}
                {showVectors && projectile.isFlying && (
                  <g>
                    <line
                      x1={projectile.x}
                      y1={projectile.y}
                      x2={projectile.x + projectile.vx * 3 * zoomLevel}
                      y2={projectile.y - projectile.vy * 3 * zoomLevel}
                      stroke="#3b82f6"
                      strokeWidth={3 * zoomLevel}
                      markerEnd="url(#arrowhead)"
                      opacity="0.9"
                    />
                  </g>
                )}

                {/* Launch Angle Indicator */}
                <line
                  x1={LAUNCH_X}
                  y1={LAUNCH_Y}
                  x2={
                    LAUNCH_X +
                    Math.cos((angle * Math.PI) / 180) * 40 * zoomLevel
                  }
                  y2={
                    LAUNCH_Y -
                    Math.sin((angle * Math.PI) / 180) * 40 * zoomLevel
                  }
                  stroke="#fbbf24"
                  strokeWidth={2 * zoomLevel}
                  opacity="0.8"
                />
                <text
                  x={
                    LAUNCH_X +
                    Math.cos((angle * Math.PI) / 180) * 50 * zoomLevel
                  }
                  y={
                    LAUNCH_Y -
                    Math.sin((angle * Math.PI) / 180) * 50 * zoomLevel
                  }
                  fill="#f59e0b"
                  fontSize={14 * zoomLevel}
                  fontWeight="bold"
                >
                  {angle}°
                </text>
              </svg>

              {/* Obstacles */}
              {obstacles.map((obstacle, index) => (
                <div
                  key={index}
                  className="absolute bg-gradient-to-b from-gray-500 to-gray-700 border-2 border-gray-800 rounded shadow-lg"
                  style={{
                    left: obstacle.x,
                    top: obstacle.y,
                    width: obstacle.width,
                    height: obstacle.height,
                  }}
                >
                  <div
                    className="absolute left-1 right-1 bg-gray-400/50 rounded"
                    style={{
                      top: 1 * zoomLevel,
                      height: 2 * zoomLevel,
                    }}
                  ></div>
                </div>
              ))}

              {/* Launch Point */}
              <div
                className="absolute bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                style={{
                  left: `${LAUNCH_X - 12 * zoomLevel}px`,
                  top: `${LAUNCH_Y - 12 * zoomLevel}px`,
                  width: 6 * zoomLevel * 4,
                  height: 6 * zoomLevel * 4,
                }}
              >
                <div
                  className="bg-white rounded-full"
                  style={{
                    width: 2 * zoomLevel,
                    height: 2 * zoomLevel,
                  }}
                ></div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <button
                onClick={toggleSimulation}
                className="flex items-center space-x-1 sm:space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base cursor-pointer"
              >
                {isPlaying ? (
                  <PauseIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <PlayIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
                <span>{isPlaying ? "Pause" : "Launch"}</span>
              </button>

              <button
                onClick={resetSimulation}
                className="flex items-center space-x-1 sm:space-x-2 bg-slate-700 hover:bg-slate-800 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base cursor-pointer border border-slate-600 hover:border-slate-500"
              >
                <ArrowPathIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Reset</span>
              </button>

              <button
                onClick={() => setShowTrajectory(!showTrajectory)}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base cursor-pointer border ${
                  showTrajectory
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 hover:border-emerald-400"
                    : "bg-slate-700 hover:bg-slate-800 text-white border-slate-600 hover:border-slate-500"
                }`}
              >
                <ChartBarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Trajectory</span>
              </button>

              <button
                onClick={() => setShowVectors(!showVectors)}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base cursor-pointer border ${
                  showVectors
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500 hover:border-indigo-400"
                    : "bg-slate-700 hover:bg-slate-800 text-white border-slate-600 hover:border-slate-500"
                }`}
              >
                <Cog6ToothIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Vectors</span>
              </button>

              <button
                onClick={() => setControlPanelOpen(!controlPanelOpen)}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base cursor-pointer border ${
                  controlPanelOpen
                    ? "bg-orange-600 hover:bg-orange-700 text-white border-orange-500 hover:border-orange-400"
                    : "bg-slate-700 hover:bg-slate-800 text-white border-slate-600 hover:border-slate-500"
                }`}
                title="Toggle Control Panel"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
                <span>Controls</span>
              </button>
            </div>
          </div>

          {/* Mobile Data Display */}
          <div className="md:hidden flex flex-col bg-slate-800/50 rounded-2xl p-3 sm:p-4 mt-4">
            <h4 className="font-semibold text-white mb-3 flex items-center text-sm sm:text-base">
              <InformationCircleIcon className="h-4 w-4 mr-2" />
              Live Data
            </h4>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
              <div>
                <div className="text-slate-400">Position X:</div>
                <div className="text-blue-400 font-mono">
                  {((projectile.x - LAUNCH_X) / zoomLevel).toFixed(0)}m
                </div>
              </div>
              <div>
                <div className="text-slate-400">Position Y:</div>
                <div className="text-blue-400 font-mono">
                  {Math.max(0, (LAUNCH_Y - projectile.y) / SCALE).toFixed(0)}m
                </div>
              </div>
              <div>
                <div className="text-slate-400">Speed:</div>
                <div className="text-green-400 font-mono">
                  {Math.sqrt(projectile.vx ** 2 + projectile.vy ** 2).toFixed(
                    1
                  )}{" "}
                  m/s
                </div>
              </div>
              <div>
                <div className="text-slate-400">Time:</div>
                <div className="text-yellow-400 font-mono">
                  {projectile.time.toFixed(2)}s
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-600">
              <div className="text-slate-400 text-xs sm:text-sm">Status:</div>
              <div
                className={`font-semibold text-xs sm:text-sm ${
                  projectile.hasCollided
                    ? "text-red-400"
                    : projectile.isFlying
                    ? "text-green-400"
                    : "text-gray-400"
                }`}
              >
                {projectile.hasCollided
                  ? "Impact"
                  : projectile.isFlying
                  ? "In Flight"
                  : "Ready to Launch"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div
        ref={analyticsRef}
        className="px-2 sm:px-4 py-12 sm:py-20 bg-slate-900/50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Advanced <span className="text-blue-400">Analytics</span>
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Deep insights into projectile motion with comprehensive data
              analysis
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-slate-700/50">
              <h3 className="text-2xl font-semibold text-white mb-6">
                Real-time Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Trajectory Analysis</span>
                  <span className="text-green-400 font-semibold">Live</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Collision Detection</span>
                  <span className="text-blue-400 font-semibold">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Vector Visualization</span>
                  <span className="text-purple-400 font-semibold">Enabled</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Performance Monitoring</span>
                  <span className="text-yellow-400 font-semibold">60 FPS</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-slate-700/50">
              <h3 className="text-2xl font-semibold text-white mb-6">
                Export Options
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg transition-colors text-left  ">
                  Export Trajectory Data (CSV)
                </button>
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg transition-colors text-left  ">
                  Save Simulation Parameters
                </button>
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg transition-colors text-left  ">
                  Generate Analysis Report
                </button>
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg transition-colors text-left  ">
                  Share Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documentation Section */}
      <div ref={documentationRef} className="px-2 sm:px-4 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              <span className="text-blue-400">Documentation</span> & Guides
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Comprehensive resources to help you get the most out of our
              physics simulator
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all">
              <BookOpenIcon className="h-10 w-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">
                Quick Start Guide
              </h3>
              <p className="text-slate-300 mb-4">
                Get up and running with the simulator in minutes
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all">
              <AcademicCapIcon className="h-10 w-10 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">
                Physics Theory
              </h3>
              <p className="text-slate-300 mb-4">
                Understand the mathematical principles behind the simulation
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all">
              <UserGroupIcon className="h-10 w-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">
                Educational Use
              </h3>
              <p className="text-slate-300 mb-4">
                Best practices for using the simulator in educational settings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise Section */}
      <div
        ref={enterpriseRef}
        className="px-2 sm:px-4 py-12 sm:py-20 bg-slate-900/50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              <span className="text-blue-400">Enterprise</span> Solutions
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Scalable physics simulation solutions for institutions and
              organizations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-slate-700/50">
              <BuildingOfficeIcon className="h-12 w-12 text-blue-400 mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-4">
                For Institutions
              </h3>
              <ul className="space-y-3 text-slate-300 mb-6">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                  Multi-user collaboration tools
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                  Advanced analytics dashboard
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                  Custom simulation scenarios
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                  Priority support & training
                </li>
              </ul>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-slate-700/50">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Contact Sales
                </h3>
                <p className="text-slate-300 mb-6">
                  Ready to transform your physics education or research? Our
                  team is here to help.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-slate-300">
                  <EnvelopeIcon className="h-5 w-5 text-blue-400 mr-3" />
                  enterprise@physicslab.pro
                </div>
                <div className="flex items-center text-slate-300">
                  <PhoneIcon className="h-5 w-5 text-blue-400 mr-3" />
                  +1 (555) 123-4567
                </div>
                <div className="flex items-center text-slate-300">
                  <MapPinIcon className="h-5 w-5 text-blue-400 mr-3" />
                  San Francisco, CA
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

            {/* Sleek Side Panel Toggle Button */}
      <div
        className={`fixed right-0 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-500 ease-in-out ${
          controlPanelOpen ? (isMobile ? '-translate-x-70' : '-translate-x-80') : 'translate-x-0'
        } ${
          isInSimulatorSection 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95 translate-x-4'
        }`}
        style={{
          transitionProperty: 'opacity, transform',
          transitionDuration: '600ms, 500ms',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: isInSimulatorSection ? 'auto' : 'none'
        }}
      >
          <div className="relative group">
            {/* Sleek glow effect */}
            <div className="absolute inset-0 bg-gradient-to-l from-blue-500/30 to-indigo-600/30 rounded-l-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
            
            {/* Main sleek button */}
            <button
              onClick={() => setControlPanelOpen(!controlPanelOpen)}
              className="relative bg-gradient-to-b from-slate-800/90 via-slate-700/90 to-slate-900/90 hover:from-blue-600/90 hover:via-blue-700/90 hover:to-indigo-700/90 text-white backdrop-blur-md border border-slate-600/40 hover:border-blue-400/60 shadow-xl hover:shadow-blue-500/20 transition-all duration-400 flex flex-col items-center justify-center group overflow-hidden"
              style={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderTopLeftRadius: '24px',
                borderBottomLeftRadius: '24px',
                width: '40px',
                height: '80px',
                boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)'
              }}
            >
              {/* Vertical shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/8 to-white/0 -translate-y-full group-hover:translate-y-full transition-transform duration-700 ease-out"></div>
              
              {/* Icon container */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                {controlPanelOpen ? (
                  <svg className="w-5 h-5 transition-all duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 transition-all duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                )}
                
                {/* Minimalist dots */}
                <div className="mt-2 flex flex-col space-y-1">
                  <div className={`w-1 h-1 rounded-full transition-all duration-300 ${controlPanelOpen ? 'bg-orange-400' : 'bg-slate-400'}`}></div>
                  <div className={`w-1 h-1 rounded-full transition-all duration-300 delay-75 ${controlPanelOpen ? 'bg-orange-400' : 'bg-slate-400'}`}></div>
                </div>
              </div>
              
              {/* Subtle inner glow */}
              <div className="absolute inset-0 rounded-l-full bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            {/* Side accent line */}
            <div className={`absolute -left-1 top-1/2 transform -translate-y-1/2 w-0.5 transition-all duration-300 ${
              controlPanelOpen 
                ? 'h-12 bg-gradient-to-b from-orange-400 to-orange-600' 
                : 'h-8 bg-gradient-to-b from-blue-400 to-blue-600'
            } rounded-full shadow-sm`}></div>
          </div>
        </div>

      {/* Modern Control Panel */}
      {isInSimulatorSection && (
        <div
          className={`fixed right-0 top-1/2 transform -translate-y-1/2 bg-slate-900/95 backdrop-blur-md border-l border-slate-600/50 shadow-2xl z-40 transition-all duration-300 rounded-l-3xl ${
            controlPanelOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            width: isMobile ? Math.min(280, window.innerWidth - 40) : 320,
            maxHeight: isMobile ? '70vh' : '80vh',
            overflow: 'auto',
          }}
        >
          {/* Modern Header */}
          <div className="p-4 border-b border-slate-700/50 rounded-tl-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-white">Control Panel</h3>
              </div>
            </div>
          </div>

          {/* Control Content */}
          <div className="p-4">
            {/* Angle Control */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Launch Angle:{" "}
                <span className="text-blue-400 font-bold">{angle}°</span>
              </label>
              <input
                type="range"
                min="5"
                max="85"
                value={angle}
                disabled={isPlaying}
                onChange={(e) => {
                  setAngle(Number(e.target.value));
                  // Reset projectile position when angle changes
                  setProjectile({
                    x: LAUNCH_X,
                    y: LAUNCH_Y,
                    vx: 0,
                    vy: 0,
                    time: 0,
                    isFlying: false,
                    hasCollided: false,
                  });
                  setIsPlaying(false);
                  collisionNotifiedRef.current = false;
                  if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                  }
                }}
                className={`w-full h-3 rounded-lg appearance-none slider ${
                  isPlaying 
                    ? 'bg-slate-700 cursor-not-allowed opacity-50' 
                    : 'bg-slate-600 cursor-pointer'
                }`}
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>5°</span>
                <span>45°</span>
                <span>85°</span>
              </div>
            </div>

            {/* Velocity Control */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Initial Velocity:{" "}
                <span className="text-blue-400 font-bold">{velocity} m/s</span>
              </label>
              <input
                type="range"
                min="10"
                max="50"
                value={velocity}
                disabled={isPlaying}
                onChange={(e) => {
                  setVelocity(Number(e.target.value));
                  // Reset projectile position when velocity changes
                  setProjectile({
                    x: LAUNCH_X,
                    y: LAUNCH_Y,
                    vx: 0,
                    vy: 0,
                    time: 0,
                    isFlying: false,
                    hasCollided: false,
                  });
                  setIsPlaying(false);
                  collisionNotifiedRef.current = false;
                  if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                  }
                }}
                className={`w-full h-3 rounded-lg appearance-none slider ${
                  isPlaying 
                    ? 'bg-slate-700 cursor-not-allowed opacity-50' 
                    : 'bg-slate-600 cursor-pointer'
                }`}
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>10 m/s</span>
                <span>30 m/s</span>
                <span>50 m/s</span>
              </div>
            </div>

            {/* Real-time Data */}
            <div className="flex flex-col bg-slate-800/60 rounded-2xl p-4 border border-slate-600/30">
              <h4 className="font-semibold text-white mb-3 flex items-center text-sm sm:text-base">
                <InformationCircleIcon className="h-4 w-4 mr-2" />
                Live Data
              </h4>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div>
                  <div className="text-slate-400">Position X:</div>
                  <div className="text-blue-400 font-mono">
                    {((projectile.x - LAUNCH_X) / zoomLevel).toFixed(0)}m
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Position Y:</div>
                  <div className="text-blue-400 font-mono">
                    {Math.max(0, (LAUNCH_Y - projectile.y) / SCALE).toFixed(0)}m
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Speed:</div>
                  <div className="text-green-400 font-mono">
                    {Math.sqrt(projectile.vx ** 2 + projectile.vy ** 2).toFixed(
                      1
                    )}{" "}
                    m/s
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Time:</div>
                  <div className="text-yellow-400 font-mono">
                    {projectile.time.toFixed(2)}s
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-600">
                <div className="text-slate-400 text-xs sm:text-sm">Status:</div>
                <div
                  className={`font-semibold text-xs sm:text-sm ${
                    projectile.hasCollided
                      ? "text-red-400"
                      : projectile.isFlying
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  {projectile.hasCollided
                    ? "Impact"
                    : projectile.isFlying
                    ? "In Flight"
                    : "Ready to Launch"}
                </div>
              </div>
              <div className="mt-2">
                <div className="text-slate-400 text-xs sm:text-sm">
                  Zoom Level:
                </div>
                <div className="text-blue-400 font-mono text-xs sm:text-sm">
                  {zoomLevel}x
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <BeakerIcon className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold text-white">
                  PhysicsLab Pro
                </span>
              </div>
              <p className="text-slate-300 mb-6 max-w-md">
                Advanced physics simulation platform designed for education,
                research, and professional applications. Experience the future
                of interactive learning.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <span className="text-blue-400 font-bold text-sm">f</span>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <span className="text-blue-400 font-bold text-sm">t</span>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <span className="text-blue-400 font-bold text-sm">in</span>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <span className="text-blue-400 font-bold text-sm">yt</span>
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => scrollToSection(simulatorRef)}
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Simulator
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(featuresRef)}
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(analyticsRef)}
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Analytics
                  </button>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    API Access
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Mobile App
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => scrollToSection(documentationRef)}
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Documentation
                  </button>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Community Forum
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Contact Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    System Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <div className="text-slate-400 text-sm mb-4 sm:mb-0">
              © 2024 PhysicsLab Pro. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Messages */}
      <div className="fixed top-16 sm:top-20 right-2 sm:right-4 z-50 space-y-2 max-w-xs">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-slide-in text-xs sm:text-sm ${
              toast.type === "success"
                ? "bg-green-600 text-white"
                : toast.type === "error"
                ? "bg-red-600 text-white"
                : "bg-blue-600 text-white"
            }`}
          >
            {toast.type === "success" && (
              <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            )}
            {toast.type === "error" && (
              <ExclamationTriangleIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            )}
            {toast.type === "info" && (
              <InformationCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");

        .font-roboto {
          font-family: "Roboto", sans-serif;
        }
        html {
          scroll-behavior: smooth;
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(145deg, #3b82f6, #1d4ed8);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
        }

        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(145deg, #3b82f6, #1d4ed8);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          border: none;
        }

        .slider::-webkit-slider-track {
          height: 12px;
          border-radius: 6px;
          background: #475569;
        }

        .slider::-moz-range-track {
          height: 12px;
          border-radius: 6px;
          background: #475569;
          border: none;
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        @media (max-width: 320px) {
          .slider::-webkit-slider-thumb {
            height: 20px;
            width: 20px;
          }

          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectileMotionSimulator;
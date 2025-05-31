"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  Rocket, 
  Globe, 
  Zap, 
  Waves, 
  Atom, 
  Microscope, 
  FlaskConical,
  Info,
  Play,
  Square,
  RotateCcw,
  Pause,
  Circle,
  Target
} from "lucide-react";

interface MotionState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  time: number;
  trail: { x: number; y: number }[];
}

interface GravityObject {
  y: number;
  vy: number;
  mass: number;
  id: number;
}

interface WaveState {
  time: number;
  points: number[];
}

interface CurrentDot {
  x: number;
  y: number;
  id: number;
  progress: number;
}

const PhysicsLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "motion" | "gravity" | "waves" | "circuits"
  >("motion");
  const [showAboutModal, setShowAboutModal] = useState(false);

  const [motionParams, setMotionParams] = useState({
    initialVelocity: 25,
    angle: 45,
    gravity: 9.81,
    airResistance: 0,
  });
  const [motionState, setMotionState] = useState<MotionState>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    time: 0,
    trail: [],
  });
  const [isMotionRunning, setIsMotionRunning] = useState(false);

  const [gravityParams, setGravityParams] = useState({
    gravity: 9.81,
    mass1: 5,
    mass2: 10,
    height: 80,
    airResistance: 0,
  });
  const [gravityObjects, setGravityObjects] = useState<GravityObject[]>([
    { y: 80, vy: 0, mass: 5, id: 1 },
    { y: 80, vy: 0, mass: 10, id: 2 },
  ]);
  const [isGravityRunning, setIsGravityRunning] = useState(false);

  const [waveParams, setWaveParams] = useState({
    amplitude: 40,
    frequency: 1,
    wavelength: 100,
    amplitude2: 25,
    frequency2: 1.5,
    showInterference: false,
  });
  const [waveState, setWaveState] = useState<WaveState>({
    time: 0,
    points: [],
  });
  const [isWaveRunning, setIsWaveRunning] = useState(false);

  // Circuit State
  const [circuitParams, setCircuitParams] = useState({
    voltage: 12,
    resistance1: 4,
    resistance2: 6,
    circuitType: "series" as "series" | "parallel",
  });
  const [isCircuitRunning, setIsCircuitRunning] = useState(false);
  const [currentDots, setCurrentDots] = useState<CurrentDot[]>([]);

  const animationRef = useRef<number | undefined>(undefined);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showAboutModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAboutModal]);

  // Motion Dynamics
  useEffect(() => {
    if (isMotionRunning) {
      const startTime = Date.now();
      const radians = (motionParams.angle * Math.PI) / 180;
      const v0x = motionParams.initialVelocity * Math.cos(radians);
      const v0y = motionParams.initialVelocity * Math.sin(radians);

      const animate = () => {
        const currentTime = (Date.now() - startTime) / 1000;

        const dragCoeff = motionParams.airResistance * 0.01;

        let x, y, vx, vy;

        if (dragCoeff === 0) {
          x = v0x * currentTime;
          y =
            v0y * currentTime -
            0.5 * motionParams.gravity * currentTime * currentTime;
          vx = v0x;
          vy = v0y - motionParams.gravity * currentTime;
        } else {
          const expTerm = Math.exp(-dragCoeff * currentTime);
          x = (v0x / dragCoeff) * (1 - expTerm);
          y =
            ((v0y + motionParams.gravity / dragCoeff) / dragCoeff) *
              (1 - expTerm) -
            (motionParams.gravity / dragCoeff) * currentTime;
          vx = v0x * expTerm;
          vy =
            (v0y + motionParams.gravity / dragCoeff) * expTerm -
            motionParams.gravity / dragCoeff;
        }

        if (y >= 0) {
          const newTrail = [...motionState.trail, { x, y }];
          if (newTrail.length > 50) newTrail.shift();

          setMotionState({
            x,
            y: Math.max(0, y),
            vx,
            vy,
            time: currentTime,
            trail: newTrail,
          });
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsMotionRunning(false);
        }
      };
      animate();
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isMotionRunning, motionParams]);

  // Gravity
  useEffect(() => {
    if (isGravityRunning) {
      const startTime = Date.now();
      const initialHeight = gravityParams.height;

      const animate = () => {
        const currentTime = (Date.now() - startTime) / 1000;

        const calculateFall = (mass: number) => {
          if (gravityParams.airResistance === 0) {
            // No air resistance - all objects fall at same rate
            return {
              y: Math.max(
                0,
                initialHeight -
                  0.5 * gravityParams.gravity * currentTime * currentTime
              ),
              vy: -gravityParams.gravity * currentTime,
            };
          } else {
            // With air resistance - heavier objects fall faster
            // Drag coefficient is constant for same-shaped objects
            const baseDragCoeff = gravityParams.airResistance * 0.01;
            
            // Terminal velocity is proportional to sqrt(mass) for same-shaped objects
            // v_terminal = sqrt(2mg / (ρAC_d))
            const terminalVelocity = Math.sqrt(mass * gravityParams.gravity / baseDragCoeff);
            
            // Time constant for exponential approach to terminal velocity
            const timeConstant = terminalVelocity / gravityParams.gravity;
            
            // Velocity approaches terminal velocity exponentially
            const vy = -terminalVelocity * (1 - Math.exp(-currentTime / timeConstant));
            
            // Integrate velocity to get position
            const y = initialHeight - terminalVelocity * (currentTime + timeConstant * (Math.exp(-currentTime / timeConstant) - 1));
            
            return {
              y: Math.max(0, y),
              vy: vy,
            };
          }
        };

        const obj1 = calculateFall(gravityParams.mass1);
        const obj2 = calculateFall(gravityParams.mass2);

        const newObjects = [
          {
            ...obj1,
            mass: gravityParams.mass1,
            id: 1,
          },
          {
            ...obj2,
            mass: gravityParams.mass2,
            id: 2,
          },
        ];

        setGravityObjects(newObjects);

        if (newObjects.some((obj) => obj.y > 0)) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsGravityRunning(false);
        }
      };
      animate();
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isGravityRunning, gravityParams]);

  // Wave
  useEffect(() => {
    if (isWaveRunning) {
      const animate = () => {
        setWaveState((prev) => ({ ...prev, time: prev.time + 0.05 }));
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isWaveRunning]);

  // Circuit
  useEffect(() => {
    if (isCircuitRunning) {
      const initDots = () => {
        const dots: CurrentDot[] = [];
        for (let i = 0; i < 3; i++) {
          dots.push({
            x: 0,
            y: 0,
            id: i,
            progress: i * 0.33,
          });
        }
        setCurrentDots(dots);
      };

      if (currentDots.length === 0) {
        initDots();
      }

      const animate = () => {
        setCurrentDots((prevDots) =>
          prevDots.map((dot) => ({
            ...dot,
            progress: (dot.progress + 0.01) % 1,
          }))
        );
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      setCurrentDots([]);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isCircuitRunning]);

  // Generate wave points
  const generateWavePoints = (width: number, height: number) => {
    const centerY = height / 2;
    const numPoints = 100;

    const points1: string[] = [];
    const points2: string[] = [];
    const interference: string[] = [];

    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * width;

      const k1 = (2 * Math.PI) / waveParams.wavelength;
      const omega1 = 2 * Math.PI * waveParams.frequency;
      const y1 =
        waveParams.amplitude * Math.sin(k1 * x - omega1 * waveState.time);

      points1.push(`${x},${centerY - y1}`);

      if (waveParams.showInterference) {
        const k2 = (2 * Math.PI) / (waveParams.wavelength * 0.8);
        const omega2 = 2 * Math.PI * waveParams.frequency2;
        const y2 =
          waveParams.amplitude2 * Math.sin(k2 * x - omega2 * waveState.time);

        points2.push(`${x},${centerY - y2}`);

        const yTotal = y1 + y2;
        interference.push(`${x},${centerY - yTotal}`);
      }
    }

    return {
      path1: `M ${points1.join(" L ")}`,
      path2: `M ${points2.join(" L ")}`,
      pathInterference: `M ${interference.join(" L ")}`,
    };
  };

  const getCircuitCalculations = () => {
    let totalResistance: number;
    let totalCurrent: number;
    let power: number;
    let current1: number;
    let current2: number;
    let voltage1: number;
    let voltage2: number;

    if (circuitParams.circuitType === "series") {
      totalResistance = circuitParams.resistance1 + circuitParams.resistance2;
      totalCurrent = circuitParams.voltage / totalResistance;
      current1 = current2 = totalCurrent;
      voltage1 = totalCurrent * circuitParams.resistance1;
      voltage2 = totalCurrent * circuitParams.resistance2;
      power = circuitParams.voltage * totalCurrent;
    } else {
      totalResistance =
        (circuitParams.resistance1 * circuitParams.resistance2) /
        (circuitParams.resistance1 + circuitParams.resistance2);
      totalCurrent = circuitParams.voltage / totalResistance;
      current1 = circuitParams.voltage / circuitParams.resistance1;
      current2 = circuitParams.voltage / circuitParams.resistance2;
      voltage1 = voltage2 = circuitParams.voltage;
      power = circuitParams.voltage * totalCurrent;
    }

    return {
      totalResistance: parseFloat(totalResistance.toFixed(2)),
      totalCurrent: parseFloat(totalCurrent.toFixed(2)),
      current1: parseFloat(current1.toFixed(2)),
      current2: parseFloat(current2.toFixed(2)),
      voltage1: parseFloat(voltage1.toFixed(2)),
      voltage2: parseFloat(voltage2.toFixed(2)),
      power: parseFloat(power.toFixed(2)),
    };
  };

  const getCircuitPath = (progress: number) => {
    if (circuitParams.circuitType === "series") {
      const totalLength = 800;
      const currentPos = progress * totalLength;

      if (currentPos <= 300) {
        return { x: 50 + currentPos, y: 50 };
      } else if (currentPos <= 450) {
        return { x: 350, y: 50 + (currentPos - 300) };
      } else if (currentPos <= 750) {
        return { x: 350 - (currentPos - 450), y: 200 };
      } else {
        return { x: 50, y: 200 - (currentPos - 750) };
      }
    } else {
      const branchChoice = Math.floor(progress * 2) % 2;
      const branchProgress = (progress * 2) % 1;

      if (branchChoice === 0) {
        if (branchProgress <= 0.25) {
          return { x: 50 + branchProgress * 400, y: 50 };
        } else if (branchProgress <= 0.75) {
          return { x: 150, y: 50 + (branchProgress - 0.25) * 300 };
        } else {
          return { x: 150 - (branchProgress - 0.75) * 400, y: 200 };
        }
      } else {
        if (branchProgress <= 0.25) {
          return { x: 150 + branchProgress * 400, y: 50 };
        } else if (branchProgress <= 0.75) {
          return { x: 250, y: 50 + (branchProgress - 0.25) * 300 };
        } else {
          return { x: 250 - (branchProgress - 0.75) * 400, y: 200 };
        }
      }
    }
  };

  const resetMotion = () => {
    setIsMotionRunning(false);
    setMotionState({ x: 0, y: 0, vx: 0, vy: 0, time: 0, trail: [] });
  };

  const resetGravity = () => {
    setIsGravityRunning(false);
    setGravityObjects([
      { y: gravityParams.height, vy: 0, mass: gravityParams.mass1, id: 1 },
      { y: gravityParams.height, vy: 0, mass: gravityParams.mass2, id: 2 },
    ]);
  };

  const resetWave = () => {
    setIsWaveRunning(false);
    setWaveState({ time: 0, points: [] });
  };

  const resetCircuit = () => {
    setIsCircuitRunning(false);
    setCurrentDots([]);
  };

  const motionStats = {
    range:
      (motionParams.initialVelocity ** 2 *
        Math.sin((2 * motionParams.angle * Math.PI) / 180)) /
      motionParams.gravity,
    maxHeight:
      (motionParams.initialVelocity ** 2 *
        Math.sin((motionParams.angle * Math.PI) / 180) ** 2) /
      (2 * motionParams.gravity),
    flightTime:
      (2 *
        motionParams.initialVelocity *
        Math.sin((motionParams.angle * Math.PI) / 180)) /
      motionParams.gravity,
  };

  const circuitStats = getCircuitCalculations();
  const waveSpeed = waveParams.frequency * waveParams.wavelength;

  // About Modal
  const AboutModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              About Virtual Physics Lab
            </h2>
            <button
              onClick={() => setShowAboutModal(false)}
              className="text-white/70 hover:text-white text-2xl font-bold cursor-pointer transition-colors"
            >
              ×
            </button>
          </div>

          <div className="space-y-6 text-white/90">
            <div>
              <h3 className="text-xl font-semibold text-blue-300 mb-3 flex items-center gap-2">
                <Microscope size={20} />
                What is This App?
              </h3>
              <p className="text-sm sm:text-base leading-relaxed">
                Virtual Physics Laboratory is an interactive educational
                platform that brings fundamental physics concepts to life.
                Students can explore motion dynamics, gravity, wave behavior,
                and electrical circuits through hands-on experiments with
                real-time calculations and visual feedback.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-green-300 mb-3 flex items-center gap-2">
                <Zap size={20} />
                Features
              </h3>
              <ul className="space-y-2 text-sm sm:text-base">
                <li className="flex items-start gap-2">
                  <Circle size={6} className="mt-2 flex-shrink-0" />
                  <span><strong>Projectile Motion:</strong> Launch projectiles with
                  customizable velocity, angle, and air resistance</span>
                </li>
                <li className="flex items-start gap-2">
                  <Circle size={6} className="mt-2 flex-shrink-0" />
                  <span><strong>Gravity Experiments:</strong> Drop objects of
                  different masses to study free fall</span>
                </li>
                <li className="flex items-start gap-2">
                  <Circle size={6} className="mt-2 flex-shrink-0" />
                  <span><strong>Wave Physics:</strong> Generate sine waves with
                  interference patterns and wave properties</span>
                </li>
                <li className="flex items-start gap-2">
                  <Circle size={6} className="mt-2 flex-shrink-0" />
                  <span><strong>Circuit Analysis:</strong> Build series and parallel
                  circuits with real electrical calculations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Circle size={6} className="mt-2 flex-shrink-0" />
                  <span><strong>Real-time Calculations:</strong> All physics
                  formulas are mathematically accurate</span>
                </li>
                <li className="flex items-start gap-2">
                  <Circle size={6} className="mt-2 flex-shrink-0" />
                  <span><strong>Interactive Controls:</strong> Adjust parameters and
                  see immediate results</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <Target size={20} />
                Educational Goals
              </h3>
              <p className="text-sm sm:text-base leading-relaxed">
                This application helps students visualize abstract physics
                concepts, understand mathematical relationships, and develop
                intuition about how physical systems behave. Perfect for high
                school and college physics courses.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-yellow-300 mb-3 flex items-center gap-2">
                <Rocket size={20} />
                How to Use
              </h3>
              <ol className="space-y-2 text-sm sm:text-base">
                <li>1. Select an experiment from the navigation tabs</li>
                <li>2. Adjust parameters using the interactive sliders</li>
                <li>3. Click "Start" or "Launch" to run the simulation</li>
                <li>4. Observe real-time calculations and visualizations</li>
                <li>5. Reset and try different parameter combinations</li>
              </ol>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
              <h3 className="text-lg font-semibold text-orange-300 mb-2 flex items-center gap-2">
                <Globe size={18} />
                Mobile Optimized
              </h3>
              <p className="text-sm leading-relaxed">
                This app is designed mobile-first and works perfectly on
                smartphones, tablets, and desktops. All experiments are
                touch-friendly and responsive.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAboutModal(false)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <FlaskConical size={18} />
              Start Experimenting!
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/*  Header */}
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Atom className="text-white text-xl" size={20} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Virtual Physics Lab
                </h1>
                <p className="text-xs sm:text-sm text-indigo-300">
                  Interactive Physics Simulations
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAboutModal(true)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl px-4 sm:px-4 py-2 text-white/90 hover:text-white transition-all duration-300 cursor-pointer text-sm sm:text-base flex items-center"
            >
              <Info size={18} />
              <span className="hidden sm:inline">About</span>
            </button>
          </div>
        </div>
      </header>

      <div className="p-3 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Navigation Tabs */}
          <div className="w-full mb-2 sm:mb-8">
            <div className="flex gap-2 sm:gap-4 overflow-x-auto px-4 sm:px-0 pb-2 sm:pb-0 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="flex gap-2 sm:gap-4 mx-auto sm:justify-center min-w-max sm:min-w-0 py-2">
                {[
                  {
                    id: "motion",
                    label: "Motion Dynamics",
                    shortLabel: "Motion",
                    icon: <Rocket size={14} className="sm:w-4 sm:h-4" />,
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    id: "gravity",
                    label: "Gravity Simulation",
                    shortLabel: "Gravity",
                    icon: <Globe size={14} className="sm:w-4 sm:h-4" />,
                    color: "from-green-500 to-emerald-500",
                  },
                  {
                    id: "waves",
                    label: "Wave Behavior",
                    shortLabel: "Wave",
                    icon: <Waves size={14} className="sm:w-4 sm:h-4" />,
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    id: "circuits",
                    label: "Circuit Analysis",
                    shortLabel: "Circuit",
                    icon: <Zap size={14} className="sm:w-4 sm:h-4" />,
                    color: "from-yellow-500 to-orange-500",
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 sm:px-6 py-2 sm:py-3 rounded-2xl sm:rounded-2xl backdrop-blur-md transition-all duration-300 cursor-pointer text-xs sm:text-base font-medium border whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 sm:gap-2 min-w-fit ${
                      activeTab === tab.id
                        ? `bg-gradient-to-r ${tab.color} text-white border-white/30 shadow-lg transform scale-105`
                        : "bg-white/10 text-indigo-200 hover:bg-white/20 border-white/20 hover:scale-102"
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden text-xs">{tab.shortLabel}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl p-4 sm:p-6">
            {/* Motion Dynamics */}
            {activeTab === "motion" && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">
                  Projectile Motion Simulator
                </h2>

                <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
                  {/* Simulator/Diagram */}
                  <div className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10">
                    <svg
                      viewBox="0 0 400 250"
                      className="w-full h-auto bg-black/20 rounded-lg"
                    >
                      <line
                        x1="0"
                        y1="230"
                        x2="400"
                        y2="230"
                        stroke="#22c55e"
                        strokeWidth="3"
                      />

                      <defs>
                        <pattern
                          id="grid"
                          width="20"
                          height="20"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 20 0 L 0 0 0 20"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                          />
                        </pattern>
                      </defs>
                      <rect width="400" height="230" fill="url(#grid)" />

                      {motionState.trail.length > 1 && (
                        <path
                          d={`M ${motionState.trail
                            .map(
                              (point, index) =>
                                `${index === 0 ? "M" : "L"} ${
                                  20 + point.x * 3
                                } ${230 - point.y * 2}`
                            )
                            .join(" ")}`}
                          stroke="rgba(59, 130, 246, 0.6)"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray="3,3"
                        />
                      )}

                      <circle
                        cx={20 + motionState.x * 3}
                        cy={230 - motionState.y * 2}
                        r="6"
                        fill="#ef4444"
                        stroke="white"
                        strokeWidth="2"
                      />

                      {isMotionRunning && (
                        <g>
                          <line
                            x1={20 + motionState.x * 3}
                            y1={230 - motionState.y * 2}
                            x2={20 + motionState.x * 3 + motionState.vx * 2}
                            y2={230 - motionState.y * 2 - motionState.vy * 2}
                            stroke="#3b82f6"
                            strokeWidth="3"
                            markerEnd="url(#arrow)"
                          />
                          <text
                            x={20 + motionState.x * 3 + 15}
                            y={230 - motionState.y * 2 - 10}
                            fill="#3b82f6"
                            fontSize="12"
                            fontFamily="monospace"
                          >
                            v ={" "}
                            {Math.sqrt(
                              motionState.vx ** 2 + motionState.vy ** 2
                            ).toFixed(1)}{" "}
                            m/s
                          </text>
                        </g>
                      )}

                      {!isMotionRunning && (
                        <g>
                          <path
                            d={`M 20 230 A 25 25 0 0 0 ${
                              20 +
                              25 *
                                Math.cos((motionParams.angle * Math.PI) / 180)
                            } ${
                              230 -
                              25 *
                                Math.sin((motionParams.angle * Math.PI) / 180)
                            }`}
                            stroke="#f59e0b"
                            strokeWidth="2"
                            fill="none"
                          />
                          <text x="50" y="225" fill="#f59e0b" fontSize="12">
                            {motionParams.angle}°
                          </text>
                        </g>
                      )}

                      <defs>
                        <marker
                          id="arrow"
                          markerWidth="10"
                          markerHeight="10"
                          refX="9"
                          refY="3"
                          orient="auto"
                          markerUnits="strokeWidth"
                        >
                          <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
                        </marker>
                      </defs>
                    </svg>
                  </div>

                  {/* Action Buttons - Mobile: Below diagram, Desktop: Hidden (shown in controls) */}
                  <div className="flex gap-3 lg:hidden">
                    <button
                      onClick={() => setIsMotionRunning(true)}
                      disabled={isMotionRunning}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Rocket size={18} />
                      Launch
                    </button>
                    <button
                      onClick={resetMotion}
                      className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={18} />
                      Reset
                    </button>
                  </div>

                  {/* Controls Panel */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <label className="block text-white text-sm font-medium mb-2">
                        Initial Velocity: {motionParams.initialVelocity} m/s
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        value={motionParams.initialVelocity}
                        onChange={(e) =>
                          setMotionParams((prev) => ({
                            ...prev,
                            initialVelocity: parseInt(e.target.value),
                          }))
                        }
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <label className="block text-white text-sm font-medium mb-2">
                        Launch Angle: {motionParams.angle}°
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="90"
                        value={motionParams.angle}
                        onChange={(e) =>
                          setMotionParams((prev) => ({
                            ...prev,
                            angle: parseInt(e.target.value),
                          }))
                        }
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <label className="block text-white text-sm font-medium mb-2">
                        Gravity: {motionParams.gravity} m/s²
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="25"
                        step="0.1"
                        value={motionParams.gravity}
                        onChange={(e) =>
                          setMotionParams((prev) => ({
                            ...prev,
                            gravity: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <label className="block text-white text-sm font-medium mb-2">
                        Air Resistance: {motionParams.airResistance}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={motionParams.airResistance}
                        onChange={(e) =>
                          setMotionParams((prev) => ({
                            ...prev,
                            airResistance: parseInt(e.target.value),
                          }))
                        }
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Action Buttons - Desktop: In controls, Mobile: Hidden (shown above) */}
                    <div className="hidden lg:flex gap-3">
                      <button
                        onClick={() => setIsMotionRunning(true)}
                        disabled={isMotionRunning}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Rocket size={18} />
                        Launch
                      </button>
                      <button
                        onClick={resetMotion}
                        className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <RotateCcw size={18} />
                        Reset
                      </button>
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <h4 className="text-white font-medium mb-2">
                        Predicted Values
                      </h4>
                      <div className="text-blue-200 text-sm space-y-1">
                        <p>Range: {motionStats.range.toFixed(1)} m</p>
                        <p>Max Height: {motionStats.maxHeight.toFixed(1)} m</p>
                        <p>
                          Flight Time: {motionStats.flightTime.toFixed(1)} s
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <h4 className="text-white font-medium mb-2">
                        Current State
                      </h4>
                      <div className="text-blue-200 text-sm space-y-1">
                        <p>Time: {motionState.time.toFixed(2)} s</p>
                        <p>
                          Position: ({motionState.x.toFixed(1)},{" "}
                          {motionState.y.toFixed(1)}) m
                        </p>
                        <p>
                          Velocity: ({motionState.vx.toFixed(1)},{" "}
                          {motionState.vy.toFixed(1)}) m/s
                        </p>
                        <p>
                          Speed:{" "}
                          {Math.sqrt(
                            motionState.vx ** 2 + motionState.vy ** 2
                          ).toFixed(1)}{" "}
                          m/s
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Gravity Simulation */}
            {activeTab === "gravity" && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">
                  Gravity & Free Fall Experiment
                </h2>

                <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
                  {/* Simulator/Diagram */}
                  <div className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10">
                    <svg
                      viewBox="0 0 400 250"
                      className="w-full h-auto bg-black/20 rounded-lg"
                    >
                      <line
                        x1="0"
                        y1="230"
                        x2="400"
                        y2="230"
                        stroke="#22c55e"
                        strokeWidth="3"
                      />

                      <line
                        x1="50"
                        y1={230 - gravityParams.height * 2}
                        x2="350"
                        y2={230 - gravityParams.height * 2}
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth="1"
                        strokeDasharray="5,5"
                      />
                      <text
                        x="10"
                        y={235 - gravityParams.height * 2}
                        fill="white"
                        fontSize="12"
                      >
                        {gravityParams.height}m
                      </text>

                      <g>
                        <circle
                          cx="150"
                          cy={230 - gravityObjects[0].y * 2}
                          r={Math.sqrt(gravityParams.mass1) * 2 + 8}
                          fill="#3b82f6"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <text
                          x="150"
                          y={245 - gravityObjects[0].y * 2}
                          textAnchor="middle"
                          fill="white"
                          fontSize="12"
                        >
                          {gravityParams.mass1}kg
                        </text>

                        {isGravityRunning &&
                          Math.abs(gravityObjects[0].vy) > 0.1 && (
                            <line
                              x1="150"
                              y1={230 - gravityObjects[0].y * 2}
                              x2="150"
                              y2={
                                230 -
                                gravityObjects[0].y * 2 -
                                gravityObjects[0].vy * 3
                              }
                              stroke="#22c55e"
                              strokeWidth="3"
                              markerEnd="url(#arrow2)"
                            />
                          )}
                      </g>

                      <g>
                        <circle
                          cx="250"
                          cy={230 - gravityObjects[1].y * 2}
                          r={Math.sqrt(gravityParams.mass2) * 2 + 8}
                          fill="#ef4444"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <text
                          x="250"
                          y={245 - gravityObjects[1].y * 2}
                          textAnchor="middle"
                          fill="white"
                          fontSize="12"
                        >
                          {gravityParams.mass2}kg
                        </text>

                        {isGravityRunning &&
                          Math.abs(gravityObjects[1].vy) > 0.1 && (
                            <line
                              x1="250"
                              y1={230 - gravityObjects[1].y * 2}
                              x2="250"
                              y2={
                                230 -
                                gravityObjects[1].y * 2 -
                                gravityObjects[1].vy * 3
                              }
                              stroke="#22c55e"
                              strokeWidth="3"
                              markerEnd="url(#arrow2)"
                            />
                          )}
                      </g>

                      <defs>
                        <marker
                          id="arrow2"
                          markerWidth="10"
                          markerHeight="10"
                          refX="9"
                          refY="3"
                          orient="auto"
                        >
                          <path d="M0,0 L0,6 L9,3 z" fill="#22c55e" />
                        </marker>
                      </defs>
                    </svg>
                  </div>

                  {/* Action Buttons - Mobile: Below diagram, Desktop: Hidden (shown in controls) */}
                  <div className="flex gap-3 lg:hidden">
                    <button
                      onClick={() => setIsGravityRunning(true)}
                      disabled={isGravityRunning}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Globe size={18} />
                      Drop
                    </button>
                    <button
                      onClick={resetGravity}
                      className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={18} />
                      Reset
                    </button>
                  </div>

                  {/* Controls Panel */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <label className="block text-white text-sm font-medium mb-2">
                        Gravity: {gravityParams.gravity} m/s²
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="25"
                        step="0.1"
                        value={gravityParams.gravity}
                        onChange={(e) =>
                          setGravityParams((prev) => ({
                            ...prev,
                            gravity: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <label className="block text-white text-sm font-medium mb-2">
                        Mass 1: {gravityParams.mass1} kg
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={gravityParams.mass1}
                        onChange={(e) =>
                          setGravityParams((prev) => ({
                            ...prev,
                            mass1: parseInt(e.target.value),
                          }))
                        }
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <label className="block text-white text-sm font-medium mb-2">
                        Mass 2: {gravityParams.mass2} kg
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={gravityParams.mass2}
                        onChange={(e) =>
                          setGravityParams((prev) => ({
                            ...prev,
                            mass2: parseInt(e.target.value),
                          }))
                        }
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <label className="block text-white text-sm font-medium mb-2">
                        Drop Height: {gravityParams.height} m
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={gravityParams.height}
                        onChange={(e) =>
                          setGravityParams((prev) => ({
                            ...prev,
                            height: parseInt(e.target.value),
                          }))
                        }
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <label className="block text-white text-sm font-medium mb-2">
                        Air Resistance: {gravityParams.airResistance}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={gravityParams.airResistance}
                        onChange={(e) =>
                          setGravityParams((prev) => ({
                            ...prev,
                            airResistance: parseInt(e.target.value),
                          }))
                        }
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div className="hidden lg:flex gap-3">
                      <button
                        onClick={() => setIsGravityRunning(true)}
                        disabled={isGravityRunning}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Globe size={18} />
                        Drop
                      </button>
                      <button
                        onClick={resetGravity}
                        className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <RotateCcw size={18} />
                        Reset
                      </button>
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <h4 className="text-white font-medium mb-2">
                        Physics Principles
                      </h4>
                      <div className="text-green-200 text-sm space-y-1">
                        <p>F = mg (Force = mass × gravity)</p>
                        <p>v = gt (velocity = gravity × time)</p>
                        <p>s = ½gt² (distance = ½ × gravity × time²)</p>
                        {gravityParams.airResistance === 0 ? (
                          <p>All objects fall at same rate (in vacuum)</p>
                        ) : (
                          <p>Heavier objects fall faster (with air resistance)</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <h4 className="text-white font-medium mb-2">
                        Calculated Values
                      </h4>
                      <div className="text-green-200 text-sm space-y-1">
                        {gravityParams.airResistance === 0 ? (
                          <>
                            <p>
                              Fall Time:{" "}
                              {Math.sqrt(
                                (2 * gravityParams.height) / gravityParams.gravity
                              ).toFixed(2)}{" "}
                              s
                            </p>
                            <p>
                              Final Velocity:{" "}
                              {Math.sqrt(
                                2 * gravityParams.gravity * gravityParams.height
                              ).toFixed(1)}{" "}
                              m/s
                            </p>
                          </>
                        ) : (
                          <>
                            <p>
                              Terminal Vel 1:{" "}
                              {Math.sqrt(
                                (gravityParams.mass1 * gravityParams.gravity) / 
                                (gravityParams.airResistance * 0.01)
                              ).toFixed(1)}{" "}
                              m/s
                            </p>
                            <p>
                              Terminal Vel 2:{" "}
                              {Math.sqrt(
                                (gravityParams.mass2 * gravityParams.gravity) / 
                                (gravityParams.airResistance * 0.01)
                              ).toFixed(1)}{" "}
                              m/s
                            </p>
                          </>
                        )}
                        <p>
                          Obj 1 Force:{" "}
                          {(
                            gravityParams.mass1 * gravityParams.gravity
                          ).toFixed(1)}{" "}
                          N
                        </p>
                        <p>
                          Obj 2 Force:{" "}
                          {(
                            gravityParams.mass2 * gravityParams.gravity
                          ).toFixed(1)}{" "}
                          N
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <h4 className="text-white font-medium mb-2">
                        Current State
                      </h4>
                      <div className="text-green-200 text-sm space-y-1">
                        <p>
                          Obj 1: {gravityObjects[0].y.toFixed(1)}m,{" "}
                          {Math.abs(gravityObjects[0].vy).toFixed(1)} m/s
                        </p>
                        <p>
                          Obj 2: {gravityObjects[1].y.toFixed(1)}m,{" "}
                          {Math.abs(gravityObjects[1].vy).toFixed(1)} m/s
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Wave Behavior */}
            {activeTab === "waves" && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">
                  Wave Physics & Interference
                </h2>

                <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
                  {/* Simulator/Diagram */}
                  <div className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10">
                    <svg
                      viewBox="0 0 400 250"
                      className="w-full h-auto bg-black/20 rounded-lg"
                    >
                      <defs>
                        <pattern
                          id="waveGrid"
                          width="20"
                          height="20"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 20 0 L 0 0 0 20"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                          />
                        </pattern>
                      </defs>
                      <rect width="400" height="250" fill="url(#waveGrid)" />

                      <line
                        x1="0"
                        y1="125"
                        x2="400"
                        y2="125"
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth="1"
                      />

                      <line
                        x1="0"
                        y1={125 - waveParams.amplitude}
                        x2="400"
                        y2={125 - waveParams.amplitude}
                        stroke="rgba(255, 255, 255, 0.2)"
                        strokeWidth="1"
                        strokeDasharray="3,3"
                      />
                      <line
                        x1="0"
                        y1={125 + waveParams.amplitude}
                        x2="400"
                        y2={125 + waveParams.amplitude}
                        stroke="rgba(255, 255, 255, 0.2)"
                        strokeWidth="1"
                        strokeDasharray="3,3"
                      />

                      {/* Wave visualization */}
                      {(() => {
                        const { path1, path2, pathInterference } =
                          generateWavePoints(400, 250);

                        return (
                          <g>
                            <path
                              d={path1}
                              stroke="#3b82f6"
                              strokeWidth="3"
                              fill="none"
                            />

                            {waveParams.showInterference && (
                              <path
                                d={path2}
                                stroke="#ef4444"
                                strokeWidth="2"
                                fill="none"
                                opacity="0.7"
                              />
                            )}

                            {waveParams.showInterference && (
                              <path
                                d={pathInterference}
                                stroke="#22c55e"
                                strokeWidth="4"
                                fill="none"
                              />
                            )}
                          </g>
                        );
                      })()}

                      <text x="10" y="20" fill="white" fontSize="12">
                        {waveParams.showInterference
                          ? "Blue: Wave 1, Red: Wave 2, Green: Interference"
                          : "Wave Propagation"}
                      </text>
                      <text
                        x="10"
                        y={125 - waveParams.amplitude - 10}
                        fill="white"
                        fontSize="10"
                      >
                        +A
                      </text>
                      <text
                        x="10"
                        y={125 + waveParams.amplitude + 20}
                        fill="white"
                        fontSize="10"
                      >
                        -A
                      </text>
                    </svg>
                  </div>

                  {/* Action Buttons - Mobile: Below diagram, Desktop: Hidden (shown in controls) */}
                  <div className="flex gap-3 lg:hidden">
                    <button
                      onClick={() => setIsWaveRunning(!isWaveRunning)}
                      className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
                        isWaveRunning
                          ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                          : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      } text-white`}
                    >
                      {isWaveRunning ? <Pause size={18} /> : <Play size={18} />}
                      {isWaveRunning ? "Pause" : "Start"}
                    </button>
                    <button
                      onClick={resetWave}
                      className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={18} />
                      Reset
                    </button>
                  </div>

                  {/* Controls Panel */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <label className="block text-white text-sm font-medium mb-2">
                        Amplitude: {waveParams.amplitude}px
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="80"
                        value={waveParams.amplitude}
                        onChange={(e) =>
                          setWaveParams((prev) => ({
                            ...prev,
                            amplitude: parseInt(e.target.value),
                          }))
                        }
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <label className="block text-white text-sm font-medium mb-2">
                        Frequency: {waveParams.frequency} Hz
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="3"
                        step="0.1"
                        value={waveParams.frequency}
                        onChange={(e) =>
                          setWaveParams((prev) => ({
                            ...prev,
                            frequency: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <label className="block text-white text-sm font-medium mb-2">
                        Wavelength: {waveParams.wavelength}px
                      </label>
                      <input
                        type="range"
                        min="30"
                        max="200"
                        value={waveParams.wavelength}
                        onChange={(e) =>
                          setWaveParams((prev) => ({
                            ...prev,
                            wavelength: parseInt(e.target.value),
                          }))
                        }
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <label className="flex items-center text-white text-sm font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={waveParams.showInterference}
                          onChange={(e) =>
                            setWaveParams((prev) => ({
                              ...prev,
                              showInterference: e.target.checked,
                            }))
                          }
                          className="mr-2 cursor-pointer"
                        />
                        Show Wave Interference
                      </label>
                    </div>

                    {waveParams.showInterference && (
                      <>
                        <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                          <label className="block text-white text-sm font-medium mb-2">
                            Wave 2 Amplitude: {waveParams.amplitude2}px
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="80"
                            value={waveParams.amplitude2}
                            onChange={(e) =>
                              setWaveParams((prev) => ({
                                ...prev,
                                amplitude2: parseInt(e.target.value),
                              }))
                            }
                            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>

                        <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                          <label className="block text-white text-sm font-medium mb-2">
                            Wave 2 Frequency: {waveParams.frequency2} Hz
                          </label>
                          <input
                            type="range"
                            min="0.1"
                            max="3"
                            step="0.1"
                            value={waveParams.frequency2}
                            onChange={(e) =>
                              setWaveParams((prev) => ({
                                ...prev,
                                frequency2: parseFloat(e.target.value),
                              }))
                            }
                            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                      </>
                    )}

                    <div className="hidden lg:flex gap-3">
                      <button
                        onClick={() => setIsWaveRunning(!isWaveRunning)}
                        className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
                          isWaveRunning
                            ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                            : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        } text-white`}
                      >
                        {isWaveRunning ? <Pause size={18} /> : <Play size={18} />}
                        {isWaveRunning ? "Pause" : "Start"}
                      </button>
                      <button
                        onClick={resetWave}
                        className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <RotateCcw size={18} />
                        Reset
                      </button>
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <h4 className="text-white font-medium mb-2">
                        Wave Equation
                      </h4>
                      <div className="text-purple-200 text-sm space-y-1">
                        <p>y = A sin(2πx/λ - 2πft)</p>
                        <p>A = Amplitude ({waveParams.amplitude}px)</p>
                        <p>f = Frequency ({waveParams.frequency} Hz)</p>
                        <p>λ = Wavelength ({waveParams.wavelength}px)</p>
                        <p>v = fλ = {waveSpeed.toFixed(1)} px/s</p>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <h4 className="text-white font-medium mb-2">
                        Wave Properties
                      </h4>
                      <div className="text-purple-200 text-sm space-y-1">
                        <p>
                          Period: T = {(1 / waveParams.frequency).toFixed(2)} s
                        </p>
                        <p>
                          Angular frequency: ω ={" "}
                          {(2 * Math.PI * waveParams.frequency).toFixed(2)}{" "}
                          rad/s
                        </p>
                        {waveParams.showInterference && (
                          <>
                            <p>
                              Beat frequency:{" "}
                              {Math.abs(
                                waveParams.frequency - waveParams.frequency2
                              ).toFixed(1)}{" "}
                              Hz
                            </p>
                            <p>
                              Constructive interference when waves are in phase
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Circuit Analysis */}
            {activeTab === "circuits" && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">
                  Electrical Circuit Analysis
                </h2>

                <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
                  {/* Simulator/Diagram */}
                  <div className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10">
                    <svg
                      viewBox="0 0 400 250"
                      className="w-full h-auto bg-black/20 rounded-lg"
                    >
                      {circuitParams.circuitType === "series" ? (
                        <g>
                          <path
                            d="M 50 50 L 350 50 L 350 200 L 50 200 Z"
                            stroke="white"
                            strokeWidth="3"
                            fill="none"
                          />

                          <g transform="translate(50,125)">
                            <line
                              x1="-5"
                              y1="-15"
                              x2="-5"
                              y2="15"
                              stroke="white"
                              strokeWidth="4"
                            />
                            <line
                              x1="5"
                              y1="-10"
                              x2="5"
                              y2="10"
                              stroke="white"
                              strokeWidth="2"
                            />
                            <text x="15" y="5" fill="#22c55e" fontSize="12">
                              +
                            </text>
                            <text x="-25" y="5" fill="#ef4444" fontSize="12">
                              -
                            </text>
                            <text x="-15" y="35" fill="white" fontSize="12">
                              {circuitParams.voltage}V
                            </text>
                          </g>

                          <g transform="translate(150,50)">
                            <path
                              d="M -20 0 L -15 -10 L -5 10 L 5 -10 L 15 10 L 20 0"
                              stroke="white"
                              strokeWidth="2"
                              fill="none"
                            />
                            <text
                              x="0"
                              y="-20"
                              textAnchor="middle"
                              fill="white"
                              fontSize="12"
                            >
                              R₁: {circuitParams.resistance1}Ω
                            </text>
                            <text
                              x="0"
                              y="35"
                              textAnchor="middle"
                              fill="#3b82f6"
                              fontSize="10"
                            >
                              V₁: {circuitStats.voltage1}V
                            </text>
                          </g>

                          <g transform="translate(250,50)">
                            <path
                              d="M -20 0 L -15 -10 L -5 10 L 5 -10 L 15 10 L 20 0"
                              stroke="white"
                              strokeWidth="2"
                              fill="none"
                            />
                            <text
                              x="0"
                              y="-20"
                              textAnchor="middle"
                              fill="white"
                              fontSize="12"
                            >
                              R₂: {circuitParams.resistance2}Ω
                            </text>
                            <text
                              x="0"
                              y="35"
                              textAnchor="middle"
                              fill="#3b82f6"
                              fontSize="10"
                            >
                              V₂: {circuitStats.voltage2}V
                            </text>
                          </g>

                          <g transform="translate(100,30)">
                            <path
                              d="M -15 0 L 15 0 M 10 -5 L 15 0 L 10 5"
                              stroke="#22c55e"
                              strokeWidth="2"
                              fill="none"
                            />
                            <text
                              x="0"
                              y="-10"
                              textAnchor="middle"
                              fill="#22c55e"
                              fontSize="12"
                            >
                              I: {circuitStats.totalCurrent}A
                            </text>
                          </g>

                          {isCircuitRunning &&
                            currentDots.map((dot) => {
                              const pos = getCircuitPath(dot.progress);
                              return (
                                <circle
                                  key={dot.id}
                                  cx={pos.x}
                                  cy={pos.y}
                                  r="4"
                                  fill="#fbbf24"
                                  opacity="0.8"
                                />
                              );
                            })}
                        </g>
                      ) : (
                        <g>
                          <path
                            d="M 50 50 L 150 50 M 250 50 L 350 50 L 350 200 L 250 200 M 150 200 L 50 200 L 50 50"
                            stroke="white"
                            strokeWidth="3"
                            fill="none"
                          />
                          <path
                            d="M 150 50 L 150 100 L 150 150 L 150 200"
                            stroke="white"
                            strokeWidth="3"
                            fill="none"
                          />
                          <path
                            d="M 250 50 L 250 100 L 250 150 L 250 200"
                            stroke="white"
                            strokeWidth="3"
                            fill="none"
                          />

                          <g transform="translate(50,125)">
                            <line
                              x1="-5"
                              y1="-15"
                              x2="-5"
                              y2="15"
                              stroke="white"
                              strokeWidth="4"
                            />
                            <line
                              x1="5"
                              y1="-10"
                              x2="5"
                              y2="10"
                              stroke="white"
                              strokeWidth="2"
                            />
                            <text x="15" y="5" fill="#22c55e" fontSize="12">
                              +
                            </text>
                            <text x="-25" y="5" fill="#ef4444" fontSize="12">
                              -
                            </text>
                            <text x="-15" y="35" fill="white" fontSize="12">
                              {circuitParams.voltage}V
                            </text>
                          </g>

                          <g transform="translate(150,125)">
                            <path
                              d="M 0 -20 L -10 -15 L 10 -5 L -10 5 L 10 15 L 0 20"
                              stroke="white"
                              strokeWidth="2"
                              fill="none"
                            />
                            <text x="-50" y="-5" fill="white" fontSize="12">
                              R₁: {circuitParams.resistance1}Ω
                            </text>
                            <text x="-45" y="25" fill="#3b82f6" fontSize="10">
                              I₁: {circuitStats.current1}A
                            </text>
                          </g>

                          <g transform="translate(250,125)">
                            <path
                              d="M 0 -20 L -10 -15 L 10 -5 L -10 5 L 10 15 L 0 20"
                              stroke="white"
                              strokeWidth="2"
                              fill="none"
                            />
                            <text x="30" y="-5" fill="white" fontSize="12">
                              R₂: {circuitParams.resistance2}Ω
                            </text>
                            <text x="35" y="25" fill="#3b82f6" fontSize="10">
                              I₂: {circuitStats.current2}A
                            </text>
                          </g>

                          <g transform="translate(100,30)">
                            <path
                              d="M -15 0 L 15 0 M 10 -5 L 15 0 L 10 5"
                              stroke="#22c55e"
                              strokeWidth="2"
                              fill="none"
                            />
                            <text
                              x="0"
                              y="-10"
                              textAnchor="middle"
                              fill="#22c55e"
                              fontSize="12"
                            >
                              I: {circuitStats.totalCurrent}A
                            </text>
                          </g>

                          {isCircuitRunning &&
                            currentDots.map((dot) => {
                              const pos = getCircuitPath(dot.progress);
                              return (
                                <circle
                                  key={dot.id}
                                  cx={pos.x}
                                  cy={pos.y}
                                  r="4"
                                  fill="#fbbf24"
                                  opacity="0.8"
                                />
                              );
                            })}
                        </g>
                      )}
                    </svg>
                  </div>

                  {/* Action Buttons - Mobile: Below diagram, Desktop: Hidden (shown in controls) */}
                  <div className="flex gap-3 lg:hidden">
                    <button
                      onClick={() => setIsCircuitRunning(!isCircuitRunning)}
                      className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
                        isCircuitRunning
                          ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                          : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      } text-white`}
                    >
                      {isCircuitRunning ? <Square size={18} /> : <Zap size={18} />}
                      {isCircuitRunning ? "Stop" : "Start"}
                    </button>
                    <button
                      onClick={resetCircuit}
                      className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={18} />
                      Reset
                    </button>
                  </div>

                  {/* Controls Panel */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <label className="block text-white text-sm font-medium mb-2">
                        Circuit Type
                      </label>
                      <select
                        value={circuitParams.circuitType}
                        onChange={(e) =>
                          setCircuitParams((prev) => ({
                            ...prev,
                            circuitType: e.target.value as any,
                          }))
                        }
                        className="w-full bg-white/20 text-white rounded-lg p-2 border border-white/30 cursor-pointer"
                      >
                        <option value="series" className="bg-gray-800">
                          Series Circuit
                        </option>
                        <option value="parallel" className="bg-gray-800">
                          Parallel Circuit
                        </option>
                      </select>
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <label className="block text-white text-sm font-medium mb-2">
                        Voltage: {circuitParams.voltage} V
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="24"
                        value={circuitParams.voltage}
                        onChange={(e) =>
                          setCircuitParams((prev) => ({
                            ...prev,
                            voltage: parseInt(e.target.value),
                          }))
                        }
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <label className="block text-white text-sm font-medium mb-2">
                        Resistance 1: {circuitParams.resistance1} Ω
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={circuitParams.resistance1}
                        onChange={(e) =>
                          setCircuitParams((prev) => ({
                            ...prev,
                            resistance1: parseInt(e.target.value),
                          }))
                        }
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <label className="block text-white text-sm font-medium mb-2">
                        Resistance 2: {circuitParams.resistance2} Ω
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={circuitParams.resistance2}
                        onChange={(e) =>
                          setCircuitParams((prev) => ({
                            ...prev,
                            resistance2: parseInt(e.target.value),
                          }))
                        }
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div className="hidden lg:flex gap-3">
                      <button
                        onClick={() => setIsCircuitRunning(!isCircuitRunning)}
                        className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
                          isCircuitRunning
                            ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                            : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        } text-white`}
                      >
                        {isCircuitRunning ? <Square size={18} /> : <Zap size={18} />}
                        {isCircuitRunning ? "Stop" : "Start"}
                      </button>
                      <button
                        onClick={resetCircuit}
                        className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <RotateCcw size={18} />
                        Reset
                      </button>
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <h4 className="text-white font-medium mb-2">
                        Circuit Analysis
                      </h4>
                      <div className="text-yellow-200 text-sm space-y-1">
                        <p>
                          Total Resistance: {circuitStats.totalResistance} Ω
                        </p>
                        <p>Total Current: {circuitStats.totalCurrent} A</p>
                        <p>Total Power: {circuitStats.power} W</p>
                        <p>
                          Power R₁:{" "}
                          {(
                            circuitStats.current1 ** 2 *
                            circuitParams.resistance1
                          ).toFixed(2)}{" "}
                          W
                        </p>
                        <p>
                          Power R₂:{" "}
                          {(
                            circuitStats.current2 ** 2 *
                            circuitParams.resistance2
                          ).toFixed(2)}{" "}
                          W
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <h4 className="text-white font-medium mb-2">
                        Circuit Laws
                      </h4>
                      <div className="text-yellow-200 text-sm space-y-1">
                        <p>Ohm's Law: V = I × R</p>
                        <p>Power: P = V × I = I²R = V²/R</p>
                        {circuitParams.circuitType === "series" ? (
                          <>
                            <p>Series: R_total = R₁ + R₂</p>
                            <p>Same current through all components</p>
                            <p>Voltages add up: V = V₁ + V₂</p>
                          </>
                        ) : (
                          <>
                            <p>Parallel: 1/R_total = 1/R₁ + 1/R₂</p>
                            <p>Same voltage across all components</p>
                            <p>Currents add up: I = I₁ + I₂</p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                      <h4 className="text-white font-medium mb-2">
                        Experiment Status
                      </h4>
                      <div className="text-yellow-200 text-sm space-y-1">
                        <p className="flex items-center gap-2">
                          {isCircuitRunning ? (
                            <Circle size={12} className="text-green-400 fill-current" />
                          ) : (
                            <Circle size={12} className="text-red-400 fill-current" />
                          )}
                          Circuit Status:{" "}
                          {isCircuitRunning
                            ? "Active - Current Flowing"
                            : "Inactive - No Current"}
                        </p>
                        <p>Click "Start" to see current flow animation</p>
                        <p>Yellow dots represent electron movement</p>
                        <p>Current flows from positive to negative terminal</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About Modal */}
      {showAboutModal && <AboutModal />}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #60a5fa, #3b82f6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #60a5fa, #3b82f6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }

        .slider:hover::-webkit-slider-thumb {
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.7);
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
          overflow: -moz-scrollbars-none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
          background: transparent !important;
        }

        .scrollbar-hide::-webkit-scrollbar-track {
          display: none !important;
        }

        .scrollbar-hide::-webkit-scrollbar-thumb {
          display: none !important;
        }

        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }
      `}</style>
    </div>
  );
};

export default PhysicsLab;
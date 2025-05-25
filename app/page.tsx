"use client";

import type React from "react";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PocketKnifeIcon as Knife,
  Heart,
  Trophy,
  RefreshCw,
  Pause,
  Play,
} from "lucide-react";
import { Poppins } from "next/font/google";
import Head from "next/head";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const theme = {
  light: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    text: "#2d3748",
    primary: "#4f46e5",
    secondary: "#f59e0b",
    accent: "#8b5cf6",
    danger: "#ef4444",
    success: "#10b981",
    cardBg: "rgba(255, 255, 255, 0.95)",
    modalOverlay: "rgba(0, 0, 0, 0.6)",
    playAreaBg: "rgba(255, 255, 255, 0.1)",
    playAreaBorder: "rgba(255, 255, 255, 0.3)",
    shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  dark: {
    background: "linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #4a5568 100%)",
    text: "#f7fafc",
    primary: "#60a5fa",
    secondary: "#fbbf24",
    accent: "#a78bfa",
    danger: "#f87171",
    success: "#34d399",
    cardBg: "rgba(26, 32, 44, 0.95)",
    modalOverlay: "rgba(0, 0, 0, 0.8)",
    playAreaBg: "rgba(255, 255, 255, 0.05)",
    playAreaBorder: "rgba(255, 255, 255, 0.2)",
    shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  },
};

type Fruit = {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  type: "apple" | "orange" | "watermelon" | "banana" | "bomb";
  emoji: string;
  velocityX: number;
  velocityY: number;
  rotation: number;
  rotationSpeed: number;
  sliced: boolean;
  sliceTime: number;
  points: number;
};

type Slice = {
  id: number;
  points: number[];
  color: string;
  alpha: number;
};

type Splash = {
  id: number;
  x: number;
  y: number;
  color: string;
  particles: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    alpha: number;
  }[];
};

type Toast = {
  id: number;
  message: string;
  type: "success" | "error" | "info";
  duration: number;
};

type GameState = "menu" | "playing" | "paused" | "gameOver";

export default function FruitNinjaGame() {
  const [darkMode, setDarkMode] = useState(false);
  const [gameState, setGameState] = useState<GameState>("menu");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [lastSliceTime, setLastSliceTime] = useState(0);
  const [comboTimeRemaining, setComboTimeRemaining] = useState(0);
  const [isComboActive, setIsComboActive] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<"instructions" | "gameOver">(
    "instructions"
  );
  const [isClient, setIsClient] = useState(false);

  // Generate stable particle positions on client side only
  const [particles, setParticles] = useState<Array<{ left: string; top: string; delay: number; duration: number }>>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const fruitsRef = useRef<Fruit[]>([]);
  const slicesRef = useRef<Slice[]>([]);
  const splashesRef = useRef<Splash[]>([]);
  const lastTimeRef = useRef<number>(0);
  const mouseTrailRef = useRef<{ x: number; y: number }[]>([]);
  const isSlicingRef = useRef<boolean>(false);
  const fruitSpawnTimerRef = useRef<number>(0);
  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [_, forceRerender] = useState(0);

  const currentTheme = darkMode ? theme.dark : theme.light;

  const showToast = useCallback(
    (
      message: string,
      type: "success" | "error" | "info" = "info",
      duration = 2000
    ) => {
      const id = Date.now();

      const formattedMessage =
        message.startsWith("+") || message.startsWith("-")
          ? message.replace(/[+-]\d+/, (match) => match.padStart(4, " "))
          : message;

      setToasts((prev) => {
        const filtered = prev.filter(
          (toast) => toast.message !== formattedMessage
        );
        return [...filtered, { id, message: formattedMessage, type, duration }];
      });

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    },
    []
  );

  const generateFruit = useCallback(
    (canvasWidth: number): Fruit => {
      const types = ["apple", "orange", "watermelon", "banana"];
      const colors = {
        apple: "rgb(255, 107, 107)",
        orange: "rgb(255, 165, 2)",
        watermelon: "rgb(255, 71, 87)",
        banana: "rgb(236, 204, 104)",
        bomb: "rgb(47, 53, 66)",
      };

      const emojis = {
        apple: "🍎",
        orange: "🍊",
        watermelon: "🍉",
        banana: "🍌",
        bomb: "💣",
      };

      if (Math.random() < 0.05 * Math.min(level / 2, 0.4)) {
        types.push("bomb");
      }

      const type = types[
        Math.floor(Math.random() * types.length)
      ] as Fruit["type"];
      
      // Adjust fruit radius based on screen size
      const isMobile = canvasWidth < 500;
      const baseRadius = type === "watermelon" ? 45 : 35;
      const radius = isMobile ? Math.max(baseRadius * 0.7, 25) : baseRadius;
      
      const basePoints =
        type === "watermelon"
          ? 10
          : type === "apple"
          ? 20
          : type === "orange"
          ? 15
          : type === "banana"
          ? 25
          : 0;
      const points = Math.floor(basePoints * (1 + (level - 1) * 0.1));

      const uniqueId = `${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const baseVelocity = 4 + Math.min(level * 0.5, 4);

      // Ensure fruits spawn within visible area with proper margins
      const margin = radius + 10;
      const spawnWidth = Math.max(canvasWidth - (margin * 2), radius * 2);
      const spawnX = margin + Math.random() * spawnWidth;

      return {
        id: uniqueId,
        x: spawnX,
        y: -radius,
        radius,
        color: colors[type],
        type,
        emoji: emojis[type],
        velocityX: (Math.random() - 0.5) * 3,
        velocityY: baseVelocity,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        sliced: false,
        sliceTime: 0,
        points: type === "bomb" ? -50 : points,
      };
    },
    [level]
  );

  const createSplash = useCallback((fruit: Fruit): Splash => {
    const particleCount = 20;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 1 + Math.random() * 3;

      particles.push({
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1 + Math.random() * 3,
        alpha: 1,
      });
    }

    return {
      id: Date.now() + Math.random(),
      x: fruit.x,
      y: fruit.y,
      color: fruit.color,
      particles,
    };
  }, []);

  const createSlice = useCallback((points: number[], color: string): Slice => {
    return {
      id: Date.now() + Math.random(),
      points,
      color,
      alpha: 1,
    };
  }, []);

  const clearGameObjects = useCallback(() => {
    fruitsRef.current = [];
    slicesRef.current = [];
    splashesRef.current = [];
    mouseTrailRef.current = [];
    forceRerender((v) => v + 1);
  }, []);

  const startGame = useCallback(() => {
    setGameState("playing");
    setScore(0);
    setLives(3);
    setLevel(1);
    setCombo(0);
    clearGameObjects();
    lastTimeRef.current = 0;
    fruitSpawnTimerRef.current = 0;
    showToast("Game started! Slice the fruits!", "info");
  }, [showToast, clearGameObjects]);

  const endGame = useCallback(() => {
    const isNewHighScore = score > highScore;

    setGameState("gameOver");
    clearGameObjects();

    setTimeout(() => {
      if (isNewHighScore) {
        setHighScore(score);
        showToast(`New high score: ${score}!`, "success");
      }
    }, 500);

    setModalContent("gameOver");
    setShowModal(true);
  }, [highScore, score, showToast, clearGameObjects]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isSlicingRef.current) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouseTrailRef.current.push({ x, y });

      if (mouseTrailRef.current.length > 10) {
        mouseTrailRef.current.shift();
      }

      const now = Date.now();
      fruitsRef.current.forEach((fruit) => {
        if (fruit.sliced) return;

        for (let i = 1; i < mouseTrailRef.current.length; i++) {
          const p1 = mouseTrailRef.current[i - 1];
          const p2 = mouseTrailRef.current[i];

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const len = Math.sqrt(dx * dx + dy * dy);

          if (len < 1) continue;

          const dot =
            ((fruit.x - p1.x) * dx + (fruit.y - p1.y) * dy) / (len * len);
          const closestX = p1.x + dot * dx;
          const closestY = p1.y + dot * dy;

          const distance = Math.sqrt(
            (fruit.x - closestX) * (fruit.x - closestX) +
              (fruit.y - closestY) * (fruit.y - closestY)
          );

          if (distance < fruit.radius) {
            fruit.sliced = true;
            fruit.sliceTime = now;

            slicesRef.current.push(
              createSlice([p1.x, p1.y, p2.x, p2.y], fruit.color)
            );

            splashesRef.current.push(createSplash(fruit));

            if (fruit.type === "bomb") {
              setLives((prev) => Math.max(0, prev - 1));
              showToast("Bomb hit! -1 life", "error");

              if (lives <= 1) {
                endGame();
              }
            } else {
              const timeSinceLastSlice = now - lastSliceTime;
              let points = fruit.points;

              if (timeSinceLastSlice < 1000) {
                setCombo((prev) => prev + 1);
                
                if (comboTimerRef.current) {
                  clearTimeout(comboTimerRef.current);
                }

                setIsComboActive(true);
                setComboTimeRemaining(1500);

                comboTimerRef.current = setTimeout(() => {
                  setCombo(0);
                  setIsComboActive(false);
                  setComboTimeRemaining(0);
                }, 1500);

                if (combo >= 2) {
                  points = Math.floor(points * (1 + combo * 0.1));
                  showToast(`${combo + 1}x Combo! +${points}`, "success");
                } else {
                  showToast(`+${points}`, "success");
                }
              } else {
                setCombo(0);
                setIsComboActive(false);
                setComboTimeRemaining(0);
                showToast(`+${points}`, "success");
              }

              setScore((prev) => {
                const newScore = prev + points;
                const currentLevel = Math.floor(prev / 100) + 1;
                const newLevel = Math.floor(newScore / 100) + 1;

                if (newLevel > currentLevel) {
                  setTimeout(() => {
                    setLevel(newLevel);
                    showToast(`Level Up! Level ${newLevel}`, "success");
                  }, 500);
                }
                return newScore;
              });
              setLastSliceTime(now);
            }

            break;
          }
        }
      });
    },
    [
      combo,
      createSlice,
      createSplash,
      endGame,
      lives,
      lastSliceTime,
      score,
      showToast,
    ]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      isSlicingRef.current = true;
      mouseTrailRef.current = [];

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      mouseTrailRef.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    []
  );

  const handlePointerUp = useCallback(() => {
    isSlicingRef.current = false;
  }, []);

  const togglePause = useCallback(() => {
    if (gameState === "playing") {
      setGameState("paused");
      showToast("Game paused", "info");
    } else if (gameState === "paused") {
      setGameState("playing");
      showToast("Game resumed", "info");
    }
  }, [gameState, showToast]);

  const getPlayAreaColors = (isDark: boolean) => {
    if (isDark) {
      return {
        bg: "rgba(255,255,255,0.07)",
        border: "rgba(255,255,255,0.3)",
        bottomLine: "rgba(255, 0, 0, 0.3)",
        bottomLine2: "rgba(255, 255, 0, 0.3)",
      };
    } else {
      return {
        bg: "rgba(0,0,0,0.04)",
        border: "rgba(0,0,0,0.15)",
        bottomLine: "rgba(255, 0, 0, 0.18)",
        bottomLine2: "rgba(255, 165, 0, 0.18)",
      };
    }
  };

  const handleFruitTap = (fruit: Fruit, idx: number) => {
    if (fruit.sliced) return;
    fruit.sliced = true;

    const now = Date.now();

    if (fruit.type === "bomb") {
      setLives((prev) => Math.max(0, prev - 1));
      showToast("Bomb hit! -1 life", "error");
      if (lives <= 1) {
        endGame();
      }
    } else {
      const timeSinceLastSlice = now - lastSliceTime;
      let points = fruit.points;

      if (timeSinceLastSlice < 1000) {
        setCombo((prev) => prev + 1);
        
        if (comboTimerRef.current) {
          clearTimeout(comboTimerRef.current);
        }

        setIsComboActive(true);
        setComboTimeRemaining(1500);

        comboTimerRef.current = setTimeout(() => {
          setCombo(0);
          setIsComboActive(false);
          setComboTimeRemaining(0);
        }, 1500);

        if (combo >= 2) {
          points = Math.floor(points * (1 + combo * 0.1));
          showToast(`${combo + 1}x Combo! +${points}`, "success");
        } else {
          showToast(`+${points}`, "success");
        }
      } else {
        setCombo(0);
        setIsComboActive(false);
        setComboTimeRemaining(0);
        showToast(`+${points}`, "success");
      }

      setScore((prev) => {
        const newScore = prev + points;
        const currentLevel = Math.floor(prev / 100) + 1;
        const newLevel = Math.floor(newScore / 100) + 1;

        if (newLevel > currentLevel) {
          setTimeout(() => {
            setLevel(newLevel);
            showToast(`Level Up! Level ${newLevel}`, "success");
          }, 500);
        }
        return newScore;
      });

      setLastSliceTime(now);
    }
    fruitsRef.current.splice(idx, 1);
    forceRerender((v) => v + 1);
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    let lastSpawn = Date.now();
    let spawnInterval = Math.max(2000 - level * 150, 500);
    const gravity = 0.25;

    const interval = setInterval(() => {
      fruitsRef.current.forEach((fruit, idx) => {
        fruit.velocityY += gravity;
        fruit.x += fruit.velocityX;
        fruit.y += fruit.velocityY;
        fruit.rotation += fruit.rotationSpeed;
      });

      const playArea = document.querySelector(".relative.rounded-2xl.backdrop-blur-md");
      let width = 900,
        height = 700;
      if (playArea) {
        width = playArea.clientWidth;
        height = playArea.clientHeight;
      } else {
        // Fallback: Get viewport-based dimensions for mobile
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        width = Math.min(vw * 0.9, 900);
        height = Math.min(vh * 0.7, 600);
      }
      for (let i = fruitsRef.current.length - 1; i >= 0; i--) {
        const fruit = fruitsRef.current[i];
        if (fruit.y - fruit.radius > height) {
          if (!fruit.sliced && fruit.type !== "bomb") {
            setLives((prev) => {
              const newLives = prev - 1;
              if (newLives <= 0) {
                endGame();
              }
              return Math.max(0, newLives);
            });
            showToast("Missed a fruit! -1 life", "error");
          }
          fruitsRef.current.splice(i, 1);
        }
      }

      if (Date.now() - lastSpawn > spawnInterval) {
        lastSpawn = Date.now();
        const fruitCount = Math.min(1 + Math.floor(level / 2), 5);
        for (let i = 0; i < fruitCount; i++) {
          fruitsRef.current.push(generateFruit(width));
        }
      }

      forceRerender((v) => v + 1);
    }, 40);

    return () => clearInterval(interval);
  }, [gameState, level, endGame, showToast, generateFruit]);

  // Combo timer countdown effect
  useEffect(() => {
    if (!isComboActive || comboTimeRemaining <= 0) return;

    const interval = setInterval(() => {
      setComboTimeRemaining((prev) => {
        const newTime = prev - 50;
        if (newTime <= 0) {
          setIsComboActive(false);
          return 0;
        }
        return newTime;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isComboActive, comboTimeRemaining]);

  useEffect(() => {
    return () => {
      if (comboTimerRef.current) {
        clearTimeout(comboTimerRef.current);
      }
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Initialize client-side only elements
  useEffect(() => {
    setIsClient(true);
    // Generate particle positions only on client side
    const generatedParticles = Array.from({ length: 20 }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }));
    setParticles(generatedParticles);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  return (
    <div
      className={`${poppins.className} min-h-screen flex flex-col overflow-hidden relative`}
      style={{
        background: currentTheme.background,
        color: currentTheme.text,
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isClient && particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-20"
            style={{
              background: darkMode ? "#60a5fa" : "#4f46e5",
              left: particle.left,
              top: particle.top,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <Head>
        <title>Fruit Ninja Game</title>
        <meta name="description" content="A fast-paced fruit slicing game" />
      </Head>

      <header 
        className="relative z-10 p-4 md:p-6 backdrop-blur-md"
        style={{
          background: darkMode 
            ? "rgba(26, 32, 44, 0.8)" 
            : "rgba(255, 255, 255, 0.8)",
          borderBottom: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
        }}
      >
        <div className="flex justify-between items-center">
          {/* Left Section - Title */}
          <motion.div 
            className="flex items-center gap-2 md:gap-3 flex-shrink-0"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Knife className="w-6 h-6 md:w-8 md:h-8" style={{ color: currentTheme.primary }} />
            </motion.div>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              <span className="hidden sm:inline">Fruit Ninja</span>
              <span className="sm:hidden">Fruit</span>
            </h1>
          </motion.div>

          {/* Center Section - Game Stats (Hidden on very small screens) */}
          <motion.div 
            className="hidden sm:flex items-center gap-3 md:gap-6 flex-1 justify-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Score */}
            <div className="flex items-center gap-1 md:gap-2">
              <div className="p-1.5 md:p-2 rounded-full" style={{ background: `linear-gradient(135deg, ${currentTheme.secondary}, #f97316)` }}>
                <Trophy className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </div>
              <div className="text-center">
                <div className="text-xs opacity-70 font-medium hidden md:block">Score</div>
                <motion.div
                  className="font-bold text-sm md:text-lg"
                  style={{ color: currentTheme.secondary }}
                  key={score}
                  initial={{ scale: 1.2, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {score}
                </motion.div>
              </div>
            </div>

            {/* Level */}
            <div className="text-center">
              <div className="text-xs opacity-70 font-medium hidden md:block">Level</div>
              <motion.div 
                className="font-bold text-sm md:text-lg"
                style={{ color: currentTheme.primary }}
                key={level}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {level}
              </motion.div>
            </div>
            
            {/* Combo (Only shown on larger screens when active) */}
            {combo > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: isComboActive ? [1, 1.05, 1] : 1,
                  opacity: 1 
                }}
                transition={{ 
                  scale: { duration: 0.5, repeat: isComboActive ? Infinity : 0 },
                  opacity: { duration: 0.3 }
                }}
                className="relative px-2 md:px-3 py-1 rounded-lg font-bold text-white shadow-lg hidden md:block"
                style={{ 
                  background: `linear-gradient(135deg, ${currentTheme.accent}, #8b5cf6)`,
                  boxShadow: isComboActive ? `0 0 20px ${currentTheme.accent}40` : 'none'
                }}
              >
                <div className="flex items-center gap-1">
                  <span className="text-xs md:text-sm">{combo}x</span>
                  <div className="text-xs font-semibold">COMBO</div>
                </div>
                
                {/* Compact Progress Bar */}
                <motion.div 
                  className="absolute bottom-0 left-0 h-0.5 rounded-b-lg"
                  style={{
                    width: `${(comboTimeRemaining / 1500) * 100}%`,
                    background: comboTimeRemaining > 500 
                      ? currentTheme.success
                      : currentTheme.danger,
                  }}
                  initial={{ width: "100%" }}
                  animate={{ width: `${(comboTimeRemaining / 1500) * 100}%` }}
                  transition={{ duration: 0.1 }}
                />
                
                {/* Subtle Ring Effect */}
                {isComboActive && (
                  <motion.div
                    className="absolute inset-0 rounded-lg border border-white/30"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Right Section - Lives & Theme Toggle */}
          <motion.div 
            className="flex items-center gap-2 md:gap-4 flex-shrink-0"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Lives */}
            <div className="flex items-center gap-0.5 md:gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 300 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Heart
                    className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-all duration-300"
                    fill={i < lives ? currentTheme.danger : "none"}
                    stroke={currentTheme.danger}
                    style={{
                      filter: i < lives ? `drop-shadow(0 0 4px ${currentTheme.danger}40)` : 'none'
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Theme Toggle */}
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              className="relative p-2 md:p-2.5 rounded-full transition-all duration-300"
              style={{ 
                background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent})`,
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                cursor: "pointer",
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: darkMode ? 180 : 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {darkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 md:w-5 md:h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 md:w-5 md:h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </motion.div>
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile Stats Bar - Only visible on small screens */}
        <motion.div 
          className="sm:hidden mt-3 pt-3 border-t border-white/10 flex items-center justify-between"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Mobile Score */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full" style={{ background: `linear-gradient(135deg, ${currentTheme.secondary}, #f97316)` }}>
              <Trophy className="w-3 h-3 text-white" />
            </div>
            <div>
              <div className="text-xs opacity-70">Score</div>
              <motion.div
                className="font-bold text-sm"
                style={{ color: currentTheme.secondary }}
                key={score}
                initial={{ scale: 1.2, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {score}
              </motion.div>
            </div>
          </div>

          {/* Mobile Level */}
          <div className="text-center">
            <div className="text-xs opacity-70">Level</div>
            <motion.div 
              className="font-bold text-sm"
              style={{ color: currentTheme.primary }}
              key={level}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {level}
            </motion.div>
          </div>

          {/* Mobile Combo - Only when active */}
          {combo > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: isComboActive ? [1, 1.05, 1] : 1,
                opacity: 1 
              }}
              transition={{ 
                scale: { duration: 0.5, repeat: isComboActive ? Infinity : 0 },
                opacity: { duration: 0.3 }
              }}
              className="relative px-2 py-1 rounded-lg font-bold text-white shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, ${currentTheme.accent}, #8b5cf6)`,
                boxShadow: isComboActive ? `0 0 15px ${currentTheme.accent}40` : 'none'
              }}
            >
              <div className="flex items-center gap-1">
                <span className="text-xs">{combo}x</span>
                <div className="text-xs">COMBO</div>
              </div>
              
              {/* Mobile Progress Bar */}
              <motion.div 
                className="absolute bottom-0 left-0 h-0.5 rounded-b-lg"
                style={{
                  width: `${(comboTimeRemaining / 1500) * 100}%`,
                  background: comboTimeRemaining > 500 
                    ? currentTheme.success
                    : currentTheme.danger,
                }}
                initial={{ width: "100%" }}
                animate={{ width: `${(comboTimeRemaining / 1500) * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </motion.div>
          )}
        </motion.div>
      </header>

      <main
        className="flex-1 flex flex-col relative overflow-hidden"
        style={{ height: "100%", minHeight: 0 }}
      >
        <div
          className="flex-1 flex flex-col relative items-center justify-center overflow-hidden"
          style={{ height: "100%", minHeight: 0 }}
        >
          <div
            className="relative rounded-2xl backdrop-blur-md"
            style={{
              width: "90vw",
              height: "70vh",
              maxWidth: "900px",
              maxHeight: "600px",
              background: currentTheme.playAreaBg,
              border: `2px solid ${currentTheme.playAreaBorder}`,
              boxShadow: currentTheme.shadow,
              overflow: "hidden",
              position: "relative",
              margin: "auto",
              touchAction: "none",
            }}
          >
            {fruitsRef.current.map((fruit, idx) => (
              <motion.div
                key={fruit.id}
                onClick={() => handleFruitTap(fruit, idx)}
                onTouchStart={() => handleFruitTap(fruit, idx)}
                initial={{ scale: 0, opacity: 0, x: fruit.x - fruit.radius, y: fruit.y - fruit.radius }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  x: fruit.x - fruit.radius,
                  y: fruit.y - fruit.radius,
                  rotate: fruit.rotation * (180 / Math.PI), // Convert radians to degrees for Framer Motion
                }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ 
                  type: "tween",
                  duration: 0.016, // ~60fps for smooth movement
                  ease: "linear"
                }}
                style={{
                  position: "absolute",
                  width: fruit.radius * 2,
                  height: fruit.radius * 2,
                  borderRadius: "50%",
                  background: fruit.type === "bomb" 
                    ? `linear-gradient(135deg, #2d3748, #1a202c)` 
                    : `linear-gradient(135deg, ${fruit.color}, ${fruit.color}dd)`,
                  boxShadow: fruit.type === "bomb" 
                    ? "0 8px 32px rgba(239, 68, 68, 0.4), inset 0 2px 4px rgba(255,255,255,0.1)" 
                    : `0 8px 32px ${fruit.color}40, inset 0 2px 4px rgba(255,255,255,0.2)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: fruit.type === "bomb" ? "3px solid #ef4444" : `2px solid ${fruit.color}aa`,
                  zIndex: 2,
                  fontSize: `${fruit.radius * 1.2}px`,
                  WebkitUserSelect: "none",
                  userSelect: "none",
                  touchAction: "none",
                }}
              >
                <motion.span
                  animate={{ 
                    rotate: fruit.type === "bomb" ? [0, 5, -5, 0] : 0,
                  }}
                  transition={{ 
                    duration: 0.5, 
                    repeat: fruit.type === "bomb" ? Infinity : 0 
                  }}
                >
                  {fruit.emoji}
                </motion.span>
                
                {/* Enhanced tap area */}
                <div
                  style={{
                    position: "absolute",
                    left: -fruit.radius * 0.5,
                    top: -fruit.radius * 0.5,
                    width: fruit.radius * 3,
                    height: fruit.radius * 3,
                    cursor: "pointer",
                    zIndex: 1,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFruitTap(fruit, idx);
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    handleFruitTap(fruit, idx);
                  }}
                />
              </motion.div>
            ))}

            {/* Play area decoration */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center opacity-30">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-sm font-medium"
              >
                Slice the fruits! 🍎🍊🍉
              </motion.div>
            </div>
          </div>

          {gameState === "menu" && (
            <motion.div 
              className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative p-8 rounded-3xl max-w-md backdrop-blur-xl"
                style={{ 
                  background: `${currentTheme.cardBg}`,
                  boxShadow: currentTheme.shadow,
                  border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                }}
              >
                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-12 h-12 rounded-full opacity-20"
                     style={{ background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent})` }} />
                <div className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full opacity-20"
                     style={{ background: `linear-gradient(135deg, ${currentTheme.secondary}, ${currentTheme.primary})` }} />

                <motion.h2
                  className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  Fruit Ninja
                </motion.h2>
                
                <motion.p 
                  className="mb-8 opacity-80 text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Slice fruits, avoid bombs, and set high scores!
                </motion.p>

                <div className="flex flex-col gap-4">
                  <motion.button
                    onClick={() => startGame()}
                    className="relative py-4 px-8 rounded-xl font-bold text-white transition-all duration-300 overflow-hidden group"
                    style={{ 
                      background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent})`,
                      boxShadow: `0 10px 30px ${currentTheme.primary}40`,
                      cursor: "pointer",
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: `0 15px 40px ${currentTheme.primary}60`,
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <span className="relative z-10">🚀 Start Game</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      setModalContent("instructions");
                      setShowModal(true);
                    }}
                    className="py-3 px-6 rounded-xl font-bold transition-all duration-300 backdrop-blur-sm"
                    style={{
                      background: `${currentTheme.primary}20`,
                      color: currentTheme.primary,
                      border: `2px solid ${currentTheme.primary}40`,
                      cursor: "pointer",
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      background: `${currentTheme.primary}30`,
                    }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    📖 How to Play
                  </motion.button>
                </div>

                {highScore > 0 && (
                  <motion.div 
                    className="mt-8 p-4 rounded-xl"
                    style={{ 
                      background: `${currentTheme.secondary}20`,
                      border: `1px solid ${currentTheme.secondary}40`,
                    }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <div className="text-sm opacity-80 font-medium">🏆 High Score</div>
                    <motion.div
                      className="font-bold text-2xl"
                      style={{ color: currentTheme.secondary }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {highScore}
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}

          {gameState === "paused" && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="p-8 rounded-3xl max-w-md text-center backdrop-blur-xl"
                style={{ 
                  background: currentTheme.cardBg,
                  boxShadow: currentTheme.shadow,
                  border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                }}
              >
                <motion.h2 
                  className="text-3xl font-bold mb-6"
                  style={{ color: currentTheme.primary }}
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  ⏸️ Game Paused
                </motion.h2>
                
                <div className="flex justify-center gap-4 mt-6">
                  <motion.button
                    onClick={() => togglePause()}
                    className="py-3 px-6 rounded-xl font-bold text-white transition-all duration-300"
                    style={{ 
                      background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent})`,
                      boxShadow: `0 8px 25px ${currentTheme.primary}40`,
                      cursor: "pointer",
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: `0 12px 35px ${currentTheme.primary}60`,
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    ▶️ Resume
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      setShowModal(false);
                      setGameState("menu");
                      clearGameObjects();
                    }}
                    className="py-3 px-6 rounded-xl font-bold transition-all duration-300"
                    style={{
                      background: `${currentTheme.danger}20`,
                      color: currentTheme.danger,
                      border: `2px solid ${currentTheme.danger}40`,
                      cursor: "pointer",
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      background: `${currentTheme.danger}30`,
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    🏠 Quit
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {(gameState === "playing" || gameState === "paused") && (
            <motion.button
              onClick={togglePause}
              className="absolute top-6 right-6 p-3 rounded-xl backdrop-blur-md transition-all duration-300"
              style={{
                background: darkMode ? "rgba(26, 32, 44, 0.8)" : "rgba(255, 255, 255, 0.8)",
                border: `1px solid ${darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}`,
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                cursor: "pointer",
              }}
              whileHover={{ 
                scale: 1.1,
                boxShadow: "0 12px 35px rgba(0,0,0,0.25)",
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              {gameState === "paused" ? (
                <Play className="w-6 h-6" style={{ color: currentTheme.primary }} />
              ) : (
                <Pause className="w-6 h-6" style={{ color: currentTheme.primary }} />
              )}
            </motion.button>
          )}
        </div>
      </main>

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="px-4 py-2 rounded-lg shadow-lg text-white font-medium min-w-[120px] text-center flex items-center justify-center"
              style={{
                backgroundColor:
                  toast.type === "success"
                    ? currentTheme.success
                    : toast.type === "error"
                    ? currentTheme.danger
                    : currentTheme.primary,
                minWidth: "120px",
                width: "auto",
                maxWidth: "300px",
              }}
            >
              <span className="inline-block">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
            style={{ backgroundColor: currentTheme.modalOverlay }}
            onClick={() => {
              if (modalContent === "instructions") {
                setShowModal(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-md w-full p-6 rounded-2xl max-h-[90vh] overflow-y-auto"
              style={{ backgroundColor: currentTheme.cardBg }}
              onClick={(e) => e.stopPropagation()}
            >
              {modalContent === "instructions" ? (
                <>
                  <h2
                    className="text-2xl font-bold mb-4"
                    style={{ color: currentTheme.primary }}
                  >
                    How to Play
                  </h2>
                  <div className="space-y-4">
                    <p>
                      Swipe or drag your cursor across the screen to slice
                      fruits as they fly up from the bottom.
                    </p>

                    <div
                      className="flex items-center gap-3 p-3 rounded-lg"
                      style={{ backgroundColor: `${currentTheme.success}20` }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: currentTheme.success }}
                      >
                        <Knife className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold">Slice Fruits</h3>
                        <p className="text-sm opacity-80">
                          Each fruit gives you points when sliced
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-3 p-3 rounded-lg"
                      style={{ backgroundColor: `${currentTheme.danger}20` }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: currentTheme.danger }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="8" />
                          <line x1="12" y1="6" x2="12" y2="4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold">Avoid Bombs</h3>
                        <p className="text-sm opacity-80">
                          Slicing bombs will cost you a life
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-3 p-3 rounded-lg"
                      style={{ backgroundColor: `${currentTheme.accent}20` }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: currentTheme.accent }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M13 2L3 14h9l-1 8 10-16h-9l1-4z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold">Combo Bonus</h3>
                        <p className="text-sm opacity-80">
                          Slice fruits quickly for combo multipliers
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-3 p-3 rounded-lg"
                      style={{ backgroundColor: `${currentTheme.secondary}20` }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: currentTheme.secondary }}
                      >
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold">Lives</h3>
                        <p className="text-sm opacity-80">
                          You lose a life when you miss a fruit or hit a bomb
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowModal(false)}
                    className="mt-6 w-full py-3 px-6 rounded-lg font-bold text-white transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    Got it!
                  </button>
                </>
              ) : (
                <>
                  <h2
                    className="text-2xl font-bold mb-4"
                    style={{ color: currentTheme.primary }}
                  >
                    Game Over
                  </h2>

                  <div className="space-y-4 text-center">
                    <div
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: `${currentTheme.secondary}20` }}
                    >
                      <div className="text-sm opacity-80">Final Score</div>
                      <div
                        className="font-bold text-3xl"
                        style={{ color: currentTheme.secondary }}
                      >
                        {score}
                      </div>
                    </div>

                    <div
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: `${currentTheme.primary}20` }}
                    >
                      <div className="text-sm opacity-80">High Score</div>
                      <div
                        className="font-bold text-2xl"
                        style={{ color: currentTheme.primary }}
                      >
                        {highScore}
                      </div>
                    </div>

                    <div
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: `${currentTheme.accent}20` }}
                    >
                      <div className="text-sm opacity-80">Level Reached</div>
                      <div
                        className="font-bold text-xl"
                        style={{ color: currentTheme.accent }}
                      >
                        {level}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 mt-6">
                    <button
                      onClick={() => {
                        setShowModal(false);
                        startGame();
                      }}
                      className="py-3 px-6 rounded-lg font-bold text-white transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                      style={{ backgroundColor: currentTheme.primary }}
                    >
                      <RefreshCw className="w-5 h-5" />
                      Play Again
                    </button>

                    <button
                      onClick={() => {
                        setShowModal(false);
                        setGameState("menu");
                        clearGameObjects();
                      }}
                      className="py-3 px-6 rounded-lg font-bold transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                      style={{
                        backgroundColor: `${currentTheme.primary}20`,
                        color: currentTheme.primary,
                      }}
                    >
                      Back to Menu
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SunIcon, MoonIcon, InfoIcon, XIcon, Clock, Star, Trophy, Sparkles, Frown, Smile, Pause, Play, BarChart3, Info } from "lucide-react";
import { Orbitron, Press_Start_2P, Russo_One, Bungee, Righteous, Bangers, Rowdies, Paytone_One } from 'next/font/google';

const orbitron = Orbitron({ subsets: ['latin'] });
const bungee = Bungee({ weight: '400', subsets: ['latin'] });
const righteous = Righteous({ weight: '400', subsets: ['latin'] });
const bangers = Bangers({ weight: '400', subsets: ['latin'] });
const rowdies = Rowdies({ weight: '400', subsets: ['latin'] });
const paytoneOne = Paytone_One({ weight: '400', subsets: ['latin'] });

type ThemeType = "light" | "dark";
type GameItem = {
  id: number;
  text: string;
  isOddOne: boolean;
};

export default function Home() {
  const [theme, setTheme] = useState<ThemeType>("light");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameItems, setGameItems] = useState<GameItem[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [stars, setStars] = useState(0);
  const [showGame, setShowGame] = useState(true);
  const [pauseGame, setPauseGame] = useState(false);
  const [confetti, setConfetti] = useState<{ x: number, y: number, color: string }[]>([]);
  const [userLevel, setUserLevel] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [streakCount, setStreakCount] = useState(0);
  const [emojiType, setEmojiType] = useState("faces");
  const [showStatsPanel, setShowStatsPanel] = useState(false);
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [showEmojiDropdown, setShowEmojiDropdown] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const emojiDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTotalScore = localStorage.getItem("totalScore");
    if (savedTotalScore) {
      setTotalScore(parseInt(savedTotalScore));
      setUserLevel(getUserLevel(parseInt(savedTotalScore)));
    }

    const savedAchievements = localStorage.getItem("achievements");
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }

    const savedTheme = localStorage.getItem("theme") as ThemeType | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }

    // Check if device is touch-enabled
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      document.documentElement.classList.add('touch-device');
    }

    const savedHighScore = localStorage.getItem("highScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }

    generateRoundForLevel(1);

    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);

      if (width < 768) {
        setShowStatsPanel(false);
        setShowHelpPanel(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("totalScore", totalScore.toString());
  }, [totalScore]);

  useEffect(() => {
    localStorage.setItem("achievements", JSON.stringify(achievements));
  }, [achievements]);

  // Clean up toast timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const getUserLevel = (score: number) => {
    if (score < 100) return 1;
    if (score < 300) return 2;
    if (score < 600) return 3;
    if (score < 1000) return 4;
    if (score < 2000) return 5;
    return Math.floor(score / 400) + 1;
  };

  const checkForAchievements = (correct: boolean, timeRemaining: number) => {
    const newAchievements = [...achievements];

    if (correct && timeRemaining > 25 && !achievements.includes("⚡ Speed Demon")) {
      newAchievements.push("⚡ Speed Demon");
    }

    if (correct) {
      const newStreakCount = streakCount + 1;
      setStreakCount(newStreakCount);

      if (newStreakCount >= 5 && !achievements.includes("🔥 Hot Streak")) {
        newAchievements.push("🔥 Hot Streak");
      }
    } else {
      setStreakCount(0);
    }

    if (level === 10 && !achievements.includes("🏆 Completionist")) {
      newAchievements.push("🏆 Completionist");
    }

    const currentLevel = userLevel;
    const newLevel = getUserLevel(totalScore + (correct ? Math.max(10, timeLeft) : 0));

    if (newLevel > currentLevel && !achievements.includes(`🌟 Reached League ${newLevel}`)) {
      newAchievements.push(`🌟 Reached League ${newLevel}`);
    }

    if (newAchievements.length > achievements.length) {
      setAchievements(newAchievements);
    }
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("highScore", highScore.toString());
  }, [highScore]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (!showFeedback && !gameOver && !pauseGame) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [level, showFeedback, gameOver, pauseGame]);

  const createConfetti = () => {
    const colors = ["#FF5252", "#FFD740", "#64FFDA", "#448AFF", "#E040FB"];
    const newConfetti = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setConfetti(newConfetti);
  };

  const handleTimeout = () => {
    setShowFeedback(true);
    setIsCorrect(false);

    setTimeout(() => {
      if (level >= 10) {
        endGame();
      } else {
        moveToNextLevel();
      }
    }, 2000);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const moveToNextLevel = () => {
    setShowFeedback(false);
    setSelectedItem(null);
    const nextLevel = level + 1;
    setLevel(nextLevel);
    setTimeLeft(30);
    generateRoundForLevel(nextLevel);
  };

  const generateRoundForLevel = (levelValue: number) => {
    let gridSize = 4; // Default for 2x2 grid

    if (levelValue <= 3) {
      gridSize = 4; // 2x2 grid for levels 1-3
    } else if (levelValue <= 7) {
      gridSize = 9; // 3x3 grid for levels 4-7
    } else {
      gridSize = 16; // 4x4 grid for levels 8-10
    }

    const oddOneOutIndex = Math.floor(Math.random() * gridSize);

    let baseText = "";
    let oddText = "";

    if (emojiType === "shapes") {
      switch (levelValue % 5) {
        case 1:
          baseText = "●";
          oddText = "○";
          break;
        case 2:
          baseText = "■";
          oddText = "□";
          break;
        case 3:
          baseText = "▲";
          oddText = "△";
          break;
        case 4:
          baseText = "◆";
          oddText = "◇";
          break;
        case 0:
          baseText = "✦";
          oddText = "✧";
          break;
      }
    } else if (emojiType === "animals") {
      switch (levelValue % 5) {
        case 1:
          baseText = "🐱";
          oddText = "🐯";
          break;
        case 2:
          baseText = "🐶";
          oddText = "🦊";
          break;
        case 3:
          baseText = "🐻";
          oddText = "🐨";
          break;
        case 4:
          baseText = "🐸";
          oddText = "🦎";
          break;
        case 0:
          baseText = "🐵";
          oddText = "🦍";
          break;
      }
    } else if (emojiType === "food") {
      switch (levelValue % 5) {
        case 1:
          baseText = "🍎";
          oddText = "🍏";
          break;
        case 2:
          baseText = "🍕";
          oddText = "🍔";
          break;
        case 3:
          baseText = "🍦";
          oddText = "🧁";
          break;
        case 4:
          baseText = "🍒";
          oddText = "🍓";
          break;
        case 0:
          baseText = "🍫";
          oddText = "🍬";
          break;
      }
    } else if (emojiType === "faces") {
      switch (levelValue % 5) {
        case 1:
          baseText = "😀";
          oddText = "😃";
          break;
        case 2:
          baseText = "😎";
          oddText = "🥸";
          break;
        case 3:
          baseText = "😴";
          oddText = "🥱";
          break;
        case 4:
          baseText = "🙂";
          oddText = "🙃";
          break;
        case 0:
          baseText = "😑";
          oddText = "😶";
          break;
      }
    }

    const newItems: GameItem[] = Array(gridSize).fill(null).map((_, index) => ({
      id: index,
      text: index === oddOneOutIndex ? oddText : baseText,
      isOddOne: index === oddOneOutIndex
    }));

    setGameItems(newItems);
  };

  const generateRound = () => {
    generateRoundForLevel(level);
  };

  const handleItemClick = (id: number) => {
    if (showFeedback || gameOver || pauseGame) return;

    const item = gameItems.find(item => item.id === id);
    if (!item) return;

    setSelectedItem(id);
    setIsCorrect(item.isOddOne);
    setShowFeedback(true);

    if (item.isOddOne) {
      const earnedPoints = Math.max(10, timeLeft);
      setScore((prev) => prev + earnedPoints);
      setTotalScore((prev) => prev + earnedPoints);

      const newLevel = getUserLevel(totalScore + earnedPoints);
      if (newLevel > userLevel) {
        setUserLevel(newLevel);
      }

      checkForAchievements(true, timeLeft);

      const earnedStars = timeLeft > 20 ? 3 : timeLeft > 10 ? 2 : 1;
      setStars(earnedStars);
      setShowCelebration(true);
      createConfetti();
    } else {
      checkForAchievements(false, timeLeft);
    }

    if (timerRef.current) clearInterval(timerRef.current);

    setTimeout(() => {
      setConfetti([]);
      setShowCelebration(false);

      if (level >= 10 || !item.isOddOne) {
        endGame();
      } else if (item.isOddOne) {
        moveToNextLevel();
      }
    }, 2500);
  };

  const endGame = () => {
    setGameOver(true);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(30);
    setShowFeedback(false);
    setSelectedItem(null);
    setGameOver(false);
    setShowCelebration(false);
    setShowGame(true);
    setPauseGame(false);
    
    // Generate 2x2 grid for level 1
    generateRoundForLevel(1);
  };

  const bgOverlay = theme === "dark"
    ? "bg-gradient-to-b from-gray-900/70 to-[#0a2e64]/70"
    : "bg-gradient-to-b from-[#64b5f6]/70 to-[#1976d2]/70";
  const cardBgColor = theme === "dark"
    ? "bg-gray-800/40 backdrop-blur-md border border-gray-700/50"
    : "bg-white/40 backdrop-blur-md border border-white/50";
  const textColor = theme === "dark" ? "text-white" : "text-gray-900";
  const primaryButtonBg = "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700";
  const secondaryButtonBg = "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700";

  const getGridClass = () => {
    if (gameItems.length === 4) return "grid-cols-2";
    if (gameItems.length === 9) return "grid-cols-3";
    if (isSmallScreen) return "grid-cols-3 sm:grid-cols-4"; // 4x4 grid on small screens uses 3 columns
    return "grid-cols-4"; // 4x4 grid with 4 columns on larger screens
  };

  const isLargeScreen = windowWidth >= 1024;

  const toggleStatsPanel = () => {
    setShowStatsPanel(!showStatsPanel);
    if (showHelpPanel) setShowHelpPanel(false);
  };

  const toggleHelpPanel = () => {
    setShowHelpPanel(!showHelpPanel);
    if (showStatsPanel) setShowStatsPanel(false);
  };

  const isSmallScreen = windowWidth < 768;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (emojiDropdownRef.current && !emojiDropdownRef.current.contains(event.target as Node)) {
        setShowEmojiDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchend', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchend', handleClickOutside);
    };
  }, []);

  const toggleEmojiDropdown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowEmojiDropdown(!showEmojiDropdown);
  };

  const selectEmojiType = (type: string) => {
    setTimeout(() => {
      setEmojiType(type);
      setShowEmojiDropdown(false);
      setShowToast(true);
      setToastMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} will be used from the next round`);
      
      // Clear previous toast timer if exists
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
      
      // Auto-hide toast after 3 seconds
      toastTimerRef.current = setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }, 50);
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed -top-24 inset-0 z-0 overflow-hidden">
        <img
          src={theme === "dark"
            ? "https://images.unsplash.com/photo-1694023445909-8752bb171a00?q=80&w=2071&auto=format&fit=crop"
            : "https://images.unsplash.com/photo-1694023445909-8752bb171a00?q=80&w=2070&auto=format&fit=crop"
          }
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className={`absolute inset-0 z-10 ${bgOverlay}`}></div>

      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg ${
              theme === "dark" ? "bg-gray-800/90 text-white" : "bg-white/90 text-gray-800"
            } border ${theme === "dark" ? "border-gray-700" : "border-gray-200"} backdrop-blur-sm flex items-center space-x-2 max-w-xs`}
          >
            <div className={`p-1 rounded-full ${theme === "dark" ? "bg-blue-500/20" : "bg-blue-100"}`}>
              <Info size={16} className={`${theme === "dark" ? "text-blue-300" : "text-blue-500"}`} />
            </div>
            <p className="text-sm font-medium">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`relative z-20 flex flex-col ${textColor}`}>
        <div className="w-full max-w-5xl mx-auto flex justify-center">
          <div className="relative w-full max-w-md h-screen flex flex-col overflow-x-hidden overflow-y-auto">
            <div className="flex justify-between items-center px-4 py-3">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <div className="flex items-center gap-2">
                  <span className={`${theme === "dark" ? "text-white" : "text-gray-900"} font-bold text-sm ${rowdies.className}`}>League {userLevel}</span>
                  <span className="text-yellow-400">👑</span>
                </div>
              </div>

              <div className={`${theme === "dark" ? "bg-gray-800/40" : "bg-white/20"} backdrop-blur-sm px-4 py-2 rounded-full`}>
                <div className="flex items-center gap-2">
                  <span className={`${theme === "dark" ? "text-white" : "text-gray-900"} font-bold ${righteous.className}`}>High Score: {highScore}</span>
                  <span>⭐</span>
                </div>
              </div>

              <div className="relative" ref={emojiDropdownRef}>
                <div
                  className={`${theme === "dark" ? "bg-gray-800/40" : "bg-white/20"} backdrop-blur-sm w-11 h-11 flex items-center justify-center rounded-full cursor-pointer shadow-md hover:shadow-lg transition-all border ${theme === "dark" ? "border-gray-700/50" : "border-white/50"}`}
                  onClick={toggleEmojiDropdown}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    toggleEmojiDropdown(e);
                  }}
                >
                  {emojiType === "shapes" && <span className="text-xl">⚪</span>}
                  {emojiType === "animals" && <span className="text-xl">🐱</span>}
                  {emojiType === "food" && <span className="text-xl">🍎</span>}
                  {emojiType === "faces" && <span className="text-xl">😀</span>}
                </div>

                {showEmojiDropdown && (
                  <div
                    className={`fixed sm:absolute ${isSmallScreen ? 'top-16 right-4' : 'right-0'} mt-2 ${theme === "dark" ? "bg-gray-800" : "bg-white"} 
                    p-3 rounded-lg shadow-lg z-50 min-w-[160px] border ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
                    style={{
                      maxWidth: isSmallScreen ? '200px' : 'auto',
                      transform: isSmallScreen ? 'translateX(0)' : 'none'
                    }}
                  >
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => selectEmojiType("shapes")}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          selectEmojiType("shapes");
                        }}
                        className={`flex items-center w-full py-3 px-4 rounded-md ${emojiType === "shapes" ?
                          "bg-blue-500/80 text-white" :
                          (theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100")}`}
                      >
                        <span className="text-lg mr-2">⚪</span>
                        <span className="font-medium">Shapes</span>
                      </button>
                      <button
                        onClick={() => selectEmojiType("animals")}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          selectEmojiType("animals");
                        }}
                        className={`flex items-center w-full py-3 px-4 rounded-md ${emojiType === "animals" ?
                          "bg-blue-500/80 text-white" :
                          (theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100")}`}
                      >
                        <span className="text-lg mr-2">🐱</span>
                        <span className="font-medium">Animals</span>
                      </button>
                      <button
                        onClick={() => selectEmojiType("food")}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          selectEmojiType("food");
                        }}
                        className={`flex items-center w-full py-3 px-4 rounded-md ${emojiType === "food" ?
                          "bg-blue-500/80 text-white" :
                          (theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100")}`}
                      >
                        <span className="text-lg mr-2">🍎</span>
                        <span className="font-medium">Food</span>
                      </button>
                      <button
                        onClick={() => selectEmojiType("faces")}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          selectEmojiType("faces");
                        }}
                        className={`flex items-center w-full py-3 px-4 rounded-md ${emojiType === "faces" ?
                          "bg-blue-500/80 text-white" :
                          (theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100")}`}
                      >
                        <span className="text-lg mr-2">😀</span>
                        <span className="font-medium">Faces</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {showGame && !gameOver && (
              <div className={`flex-1 flex flex-col px-2 sm:px-4 backdrop-blur-sm rounded-t-xl overflow-x-hidden`}>
                <div className="flex justify-between items-center mt-4 mb-2">
                  <motion.div
                    className={`flex items-center ${theme === "dark" ? "bg-yellow-500/90" : "bg-yellow-600/90"} text-white px-4 py-2 rounded-full`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <span className={`font-bold ${bungee.className}`}>{score}</span>
                  </motion.div>

                  <motion.div
                    className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"} ${paytoneOne.className}`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={level}
                  >
                    LEVEL {level}/10
                  </motion.div>

                  <motion.button
                    onClick={() => setPauseGame(!pauseGame)}
                    className="bg-white/20 backdrop-blur-sm p-2 rounded-full"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {pauseGame ? <Play size={24} /> : <Pause size={24} />}
                  </motion.button>
                </div>

                <div className={`w-full h-5 ${cardBgColor} rounded-full mb-4 overflow-hidden`}>
                  <div className="flex">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="flex-1 flex items-center justify-center">
                        <motion.div
                          className={`w-full h-full ${i < level - 1 ? 'bg-yellow-500' : ''}`}
                          initial={{ opacity: i === level - 2 ? 0 : 1 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.div
                            className={`w-4 h-4 mx-auto ${i < level ? 'text-yellow-500' : 'text-gray-500'}`}
                            initial={{ scale: i === level - 1 ? 0 : 1 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            {i < level - 1 && <span className="text-xs">★</span>}
                          </motion.div>
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`flex items-center mb-3 ${cardBgColor} px-3 py-1 rounded-full w-fit`}>
                  <Clock size={16} className="mr-1" />
                  <span className="text-sm">{timeLeft}s</span>
                </div>

                <div className={`w-full ${cardBgColor} rounded-full h-2 mb-8 overflow-hidden`}>
                  <motion.div
                    className="bg-gradient-to-r from-yellow-500 to-amber-500 h-full rounded-full"
                    initial={{ width: "100%" }}
                    animate={{ width: `${(timeLeft / 30) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <motion.div
                  className={`text-center mb-8 ${cardBgColor} p-4 rounded-xl shadow-lg`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className={`text-base sm:text-xl font-bold ${bangers.className} tracking-wider`}>FIND THE ODD ONE OUT!</p>
                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-2 text-base sm:text-lg flex justify-center items-center font-bold ${isCorrect ? (theme === "dark" ? "text-green-300" : "text-green-600") : (theme === "dark" ? "text-red-300" : "text-red-600")}`}
                    >
                      {isCorrect ? (
                        <div className="flex items-center">
                          <Smile className="mr-2" />
                          <span>Correct!</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Frown className="mr-2" />
                          <span>Wrong!</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>

                <div className="relative">
                  <div className={`grid ${getGridClass()} gap-2 sm:gap-3 mb-8 relative z-10 p-2 sm:p-3 mx-auto max-w-full`}>
                    <AnimatePresence mode="wait">
                      {gameItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.9, rotateY: 180 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            rotateY: 0,
                            transition: {
                              delay: index * 0.05,
                              type: "spring",
                              stiffness: 300
                            }
                          }}
                          exit={{ opacity: 0, scale: 0.9, rotateY: 180 }}
                          whileHover={{
                            scale: 1.05,
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                            rotateY: 15
                          }}
                          whileTap={{ scale: 0.95, rotateY: 0 }}
                          onClick={() => handleItemClick(item.id)}
                          style={{
                            perspective: "1000px",
                            transformStyle: "preserve-3d"
                          }}
                          className={`
                            aspect-square flex items-center justify-center text-2xl sm:text-3xl font-bold
                            rounded-xl cursor-pointer transition-all shadow-lg
                            ${selectedItem === item.id ? "border-4 border-white" : ""}
                            ${showFeedback && item.isOddOne ? "border-4 border-green-400" : ""}
                            ${showFeedback && selectedItem === item.id && !item.isOddOne ? "border-4 border-red-400" : ""}
                            ${theme === "dark" ? "bg-gray-800/70" : "bg-white/70"} 
                            backdrop-blur-md
                          `}
                        >
                          {item.text}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            )}

            {confetti.length > 0 && (
              <div className="absolute inset-0 pointer-events-none z-30">
                {confetti.map((particle, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      x: "50%",
                      y: "50%",
                      opacity: 1
                    }}
                    animate={{
                      x: `${particle.x}%`,
                      y: `${particle.y}%`,
                      opacity: 0
                    }}
                    transition={{
                      duration: 2,
                      ease: "easeOut"
                    }}
                    style={{
                      position: "absolute",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: particle.color
                    }}
                  />
                ))}
              </div>
            )}

            {showCelebration && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-30">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className={`text-center p-8 rounded-xl shadow-lg 
                  ${theme === "dark" ?
                      "bg-gradient-to-b from-indigo-900/90 to-blue-900/90 border border-indigo-500/30" :
                      "bg-gradient-to-b from-blue-500/90 to-indigo-600/90 border border-blue-300/30"
                    }
                  max-w-xs w-full mx-auto`}
                >
                  <div className="absolute -top-3 -right-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles size={28} className="text-yellow-400" />
                    </motion.div>
                  </div>
                  <motion.h2
                    className={`text-2xl font-bold text-white mb-6 ${orbitron.className}`}
                    animate={{
                      scale: [1, 1.05, 1],
                      y: [0, -3, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    WELL DONE!
                  </motion.h2>
                  <div className="flex justify-center gap-4 mb-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -15 }}
                        animate={{
                          scale: i < stars ? 1 : 0.7,
                          rotate: 0,
                          transition: { delay: i * 0.1, type: "spring" }
                        }}
                        whileHover={{ rotate: i < stars ? 10 : 0 }}
                        className={i < stars ? "text-yellow-400" : "text-blue-900"}
                      >
                        <Star size={42} fill={i < stars ? "currentColor" : "none"} strokeWidth={1} />
                      </motion.div>
                    ))}
                  </div>
                  <div className={`text-lg font-bold mb-3 text-gray-200 ${orbitron.className}`}>
                    REWARDS
                  </div>
                  <motion.div
                    className="bg-white/10 rounded-lg p-3 inline-block"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center justify-center">
                      <motion.span
                        className="font-bold text-2xl text-white mr-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.4 }}
                      >
                        +{Math.max(10, timeLeft)}
                      </motion.span>
                      <motion.span
                        className="text-yellow-400 text-xl"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        ⭐
                      </motion.span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 flex items-center justify-center z-30">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-center p-8 rounded-xl max-w-sm w-full shadow-xl ${cardBgColor}`}
                >
                  <h2 className={`text-3xl font-bold mb-4 ${theme === "dark" ? "text-yellow-500" : "text-yellow-600"} ${bangers.className} tracking-wider`}>GAME OVER!</h2>
                  <div className="mb-6">
                    <p className={`text-2xl ${righteous.className}`}>Your Score: <span className="font-bold">{score}</span></p>
                    <div className={`flex items-center justify-center mt-4 p-3 rounded-lg ${cardBgColor}`}>
                      <Trophy className="mr-2 text-yellow-500" size={24} />
                      <p className={`text-xl ${bungee.className}`}>High Score: <span className="font-bold">{highScore}</span></p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">League {userLevel}</span>
                      <span className="text-sm font-medium">League {userLevel + 1}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300"
                        style={{
                          width: `${((totalScore - (userLevel === 1 ? 0 :
                            userLevel === 2 ? 100 :
                              userLevel === 3 ? 300 :
                                userLevel === 4 ? 600 :
                                  userLevel === 5 ? 1000 :
                                    (userLevel - 1) * 400)) /
                            (userLevel === 1 ? 100 :
                              userLevel === 2 ? 200 :
                                userLevel === 3 ? 300 :
                                  userLevel === 4 ? 400 :
                                    userLevel === 5 ? 1000 :
                                      400)) * 100}%`
                        }}
                      ></div>
                    </div>
                    <p className="text-sm mt-1">Total Score: {totalScore}</p>
                  </div>

                  {achievements.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold mb-2">Achievements</h3>
                      <div className="flex flex-wrap justify-center gap-2">
                        {achievements.slice(-3).map((achievement, index) => (
                          <motion.div
                            key={index}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: index * 0.2,
                              type: "spring"
                            }}
                            className={`${cardBgColor} p-2 rounded-lg text-sm`}
                          >
                            {achievement}
                          </motion.div>
                        ))}
                      </div>
                      {achievements.length > 3 && (
                        <p className="text-xs mt-2">+{achievements.length - 3} more</p>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <motion.button
                      onClick={resetGame}
                      className={`w-full py-3 rounded-full font-bold text-white ${primaryButtonBg} ${rowdies.className}`}
                      whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Restart
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`fixed bottom-4 right-4 flex flex-row gap-3 z-50 justify-center items-center ${!isSmallScreen ? 'hidden' : ''}`}>
        <motion.button
          onClick={toggleStatsPanel}
          className={`p-3 rounded-full ${theme === "dark" ? "bg-gray-900/40" : "bg-white/20"} backdrop-blur-md border border-white/30 shadow-lg ${showStatsPanel ? "border-yellow-400" : ""}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle stats panel"
        >
          <BarChart3 size={24} className={theme === "dark" ? "text-white" : "text-gray-900"} />
        </motion.button>

        <motion.button
          onClick={toggleHelpPanel}
          className={`p-3 rounded-full ${theme === "dark" ? "bg-gray-900/40" : "bg-white/20"} backdrop-blur-md border border-white/30 shadow-lg ${showHelpPanel ? "border-yellow-400" : ""}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle help panel"
        >
          <InfoIcon size={24} className={theme === "dark" ? "text-white" : "text-gray-900"} />
        </motion.button>

        <motion.button
          onClick={toggleTheme}
          className={`p-3 rounded-full ${theme === "dark" ? "bg-gray-900/40" : "bg-white/20"} backdrop-blur-md border border-white/30 shadow-lg ${showHelpPanel ? "border-yellow-400" : ""}`}
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9, rotate: 0 }}
          aria-label="Toggle theme"
        >
          {theme === "light" ? <MoonIcon size={24} className="text-gray-900" /> : <SunIcon size={24} className="text-white" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {(showStatsPanel || (!isSmallScreen)) && (
          <motion.div
            initial={isSmallScreen ? { x: -300, opacity: 0 } : { x: 0, opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className={`fixed top-0 left-0 h-full ${isSmallScreen ? 'w-full' : 'w-sm'} 
            ${isSmallScreen
                ? (theme === "dark" ? "bg-gray-900" : "bg-white")
                : (theme === "dark" ? "bg-gray-800/40" : "bg-white/40")} 
            ${isSmallScreen ? 'backdrop-blur-none' : 'backdrop-blur-md'}
            ${theme === "dark" ? (isSmallScreen ? "" : "border-r border-gray-700/50") : (isSmallScreen ? "" : "border-r border-white/50")} 
            shadow-lg z-60 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            <div className="p-6 h-full overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold text-center flex mx-auto ${orbitron.className}`}>
                  <span className={`bg-clip-text text-transparent ${theme === "dark" ? "bg-gradient-to-r from-yellow-400 to-amber-500" : "bg-gradient-to-r from-blue-600 to-indigo-700"}`}>GAME STATS</span>
                </h2>
                {isSmallScreen && (
                  <button
                    onClick={toggleStatsPanel}
                    className="rounded-full p-1 hover:bg-gray-700/30"
                  >
                    <XIcon size={20} />
                  </button>
                )}
              </div>

              <div className={`p-4 rounded-xl ${isSmallScreen
                ? (theme === "dark" ? "bg-gray-800" : "bg-gray-100")
                : (theme === "dark" ? "bg-gray-700/40" : "bg-white/40")} 
                ${isSmallScreen ? '' : 'backdrop-blur-sm'} mb-6`}>
                <h3 className="text-lg font-bold mb-3">Your Progress</h3>

                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">👑</span>
                    <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>League {userLevel}</span>
                  </div>
                  <span className="text-sm">{totalScore} pts</span>
                </div>

                <div className="w-full h-2 bg-gray-700/30 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300"
                    style={{
                      width: `${((totalScore - (userLevel === 1 ? 0 : (userLevel === 2 ? 100 : (userLevel === 3 ? 300 : (userLevel === 4 ? 600 : (userLevel === 5 ? 1000 : (userLevel - 1) * 400)))))) /
                        (userLevel === 1 ? 100 : (userLevel === 2 ? 200 : (userLevel === 3 ? 300 : (userLevel === 4 ? 400 : (userLevel === 5 ? 1000 : 400)))))) * 100}%`
                    }}
                  ></div>
                </div>

                <p className="text-xs">
                  {userLevel === 1 ? (
                    <>Need {100 - totalScore} more points to reach League 2</>
                  ) : userLevel === 2 ? (
                    <>Need {300 - totalScore} more points to reach League 3</>
                  ) : userLevel === 3 ? (
                    <>Need {600 - totalScore} more points to reach League 4</>
                  ) : userLevel === 4 ? (
                    <>Need {1000 - totalScore} more points to reach League 5</>
                  ) : userLevel === 5 ? (
                    <>Need {2000 - totalScore} more points to reach League 6</>
                  ) : (
                    <>Need {userLevel * 400 - totalScore} more points to reach League {userLevel + 1}</>
                  )}
                </p>
              </div>

              {achievements.length > 0 && (
                <div className={`p-4 rounded-xl ${isSmallScreen
                  ? (theme === "dark" ? "bg-gray-800" : "bg-gray-100")
                  : (theme === "dark" ? "bg-gray-700/40" : "bg-white/40")} 
                  ${isSmallScreen ? '' : 'backdrop-blur-sm'} mb-6`}>
                  <h3 className="text-lg font-bold mb-3">Recent Achievements</h3>
                  <div className="space-y-2">
                    {achievements.slice(-3).map((achievement, index) => (
                      <div key={index} className="text-sm">
                        {achievement}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={`p-4 rounded-xl ${isSmallScreen
                ? (theme === "dark" ? "bg-gray-800" : "bg-gray-100")
                : (theme === "dark" ? "bg-gray-700/40" : "bg-white/40")} 
                ${isSmallScreen ? '' : 'backdrop-blur-sm'}`}>
                <h3 className="text-lg font-bold mb-2">Pro Tips</h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">💡</span>
                    <span>Try to scan the grid in a systematic pattern</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">💡</span>
                    <span>The faster you find the odd one, the more points you earn</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">💡</span>
                    <span>Change emoji types using the selector at the top</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(showHelpPanel || (!isSmallScreen)) && (
          <motion.div
            initial={isSmallScreen ? { x: 300, opacity: 0 } : { x: 0, opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className={`fixed top-0 right-0 h-full ${isSmallScreen ? 'w-full' : 'w-sm'} 
            ${isSmallScreen
                ? (theme === "dark" ? "bg-gray-900" : "bg-white")
                : (theme === "dark" ? "bg-gray-800/40" : "bg-white/40")} 
            ${isSmallScreen ? 'backdrop-blur-none' : 'backdrop-blur-md'}
            ${theme === "dark" ? (isSmallScreen ? "" : "border-l border-gray-700/50") : (isSmallScreen ? "" : "border-l border-white/50")} 
            shadow-lg z-60 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            <div className="p-6 h-full overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <motion.button
                  onClick={toggleTheme}
                  className={`p-3 fixed bottom-4 right-4 rounded-full ${theme === "dark" ? "bg-gray-900/40 border-white/50" : "bg-white/20 border-white/50"} backdrop-blur-md shadow-lg ${isSmallScreen ? 'hidden' : ''}`}
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9, rotate: 0 }}
                  aria-label="Toggle theme"
                >
                  {theme === "light" ? <MoonIcon size={24} className="text-gray-900" /> : <SunIcon size={24} className="text-white" />}
                </motion.button>
                <h2 className={`text-2xl font-bold text-center flex mx-auto ${orbitron.className}`}>
                  <span className={`bg-clip-text text-transparent ${theme === "dark" ? "bg-gradient-to-r from-yellow-400 to-amber-500" : "bg-gradient-to-r from-blue-600 to-indigo-700"}`}>HOW TO PLAY</span>
                </h2>
                {isSmallScreen && (
                  <motion.button
                    onClick={toggleHelpPanel}
                    className="rounded-full p-2 hover:bg-gray-700/30 transition-colors"
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <XIcon size={20} />
                  </motion.button>
                )}
              </div>

              <div className="space-y-6">
                <motion.div
                  className="flex items-start"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-medium mr-3 shadow-md text-sm">1</div>
                  <p className="mt-1 text-sm">Look carefully at the grid of items shown in each level. One of them is slightly different from the others.</p>
                </motion.div>

                <motion.div
                  className="flex items-start"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-medium mr-3 shadow-md text-sm">2</div>
                  <p className="mt-1 text-sm">Click on the item you think is different before the timer runs out.</p>
                </motion.div>

                <motion.div
                  className="flex items-start"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-medium mr-3 shadow-md text-sm">3</div>
                  <p className="mt-1 text-sm">Earn points based on how quickly you find the odd one out. The faster you respond, the more points you get!</p>
                </motion.div>

                <motion.div
                  className="flex items-start"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-medium mr-3 shadow-md text-sm">4</div>
                  <p className="mt-1 text-sm">The game gets progressively harder with larger grids at higher levels:</p>
                </motion.div>

                <motion.ul
                  className="ml-11 space-y-2 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <li className="flex items-center">
                    <span className=" w-5 h-5 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full text-white text-xs flex items-center justify-center mr-2 shadow-sm">•</span>
                    <span className="font-medium">Levels 1-3:</span> <span className="ml-1">2×2 grid</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-5 h-5 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full text-white text-xs flex items-center justify-center mr-2 shadow-sm">•</span>
                    <span className="font-medium">Levels 4-7:</span> <span className="ml-1">3×3 grid</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-5 h-5 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full text-white text-xs flex items-center justify-center mr-2 shadow-sm">•</span>
                    <span className="font-medium">Levels 8-10:</span> <span className="ml-1">4×4 grid</span>
                  </li>
                </motion.ul>

                <motion.div
                  className="flex items-start"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-medium mr-3 shadow-md text-sm">5</div>
                  <p className="mt-1 text-sm">Complete all 10 levels to finish the game and try to beat your high score!</p>
                </motion.div>

                <motion.div
                  className={`mt-6 p-3 rounded-lg ${theme === "dark" ? "bg-gray-700/60" : "bg-white/60"} backdrop-blur-sm border ${theme === "dark" ? "border-gray-600/50" : "border-gray-200/50"}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex items-center mb-1">
                    <Sparkles size={16} className="text-yellow-400 mr-2" />
                    <h3 className="font-medium text-sm">Bonus Tip</h3>
                  </div>
                  <p className="text-xs">Try different emoji sets for varied difficulty levels. Some emoji types may be easier to distinguish than others!</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
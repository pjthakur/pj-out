"use client";

import type React from "react";

import { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lexend, Outfit } from "next/font/google";
import {
  Sparkles,
  Clock,
  Award,
  Info,
  X,
  Moon,
  Sun,
  Check,
  AlertTriangle,
} from "lucide-react";

const lexend = Lexend({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"] });

type ThemeType = "light" | "dark";

const themeColors = {
  light: {
    background: "bg-gradient-to-br from-slate-50 to-slate-100",
    text: "text-slate-800",
    textMuted: "text-slate-500",
    primary: "bg-indigo-600 hover:bg-indigo-700",
    primaryText: "text-white",
    secondary: "bg-amber-500 hover:bg-amber-600",
    secondaryText: "text-white",
    accent: "bg-emerald-500",
    accentText: "text-white",
    card: "bg-white",
    cardBorder: "border border-slate-200",
    shadow: "shadow-md",
    letterTile: "bg-white border-slate-300 text-slate-800",
    letterTileActive: "bg-indigo-600 text-white border-indigo-700",
    letterTileInvalid: "bg-red-100 border-red-300 text-red-800",
    wordGroupBg: "bg-slate-100",
    modalOverlay: "bg-slate-900/50 backdrop-blur-sm",
    modalContent: "bg-white text-slate-800",
    toastSuccess: "bg-emerald-100 border-emerald-500 text-emerald-800",
    toastError: "bg-red-100 border-red-500 text-red-800",
    toastInfo: "bg-blue-100 border-blue-500 text-blue-800",
  },
  dark: {
    background: "bg-gradient-to-br from-slate-900 to-slate-800",
    text: "text-slate-100",
    textMuted: "text-slate-400",
    primary: "bg-indigo-600 hover:bg-indigo-700",
    primaryText: "text-white",
    secondary: "bg-amber-500 hover:bg-amber-600",
    secondaryText: "text-white",
    accent: "bg-emerald-500",
    accentText: "text-white",
    card: "bg-slate-800",
    cardBorder: "border border-slate-700",
    shadow: "shadow-lg shadow-black/20",
    letterTile: "bg-slate-700 border-slate-600 text-slate-100",
    letterTileActive: "bg-indigo-600 text-white border-indigo-700",
    letterTileInvalid: "bg-red-900 border-red-700 text-red-100",
    wordGroupBg: "bg-slate-700",
    modalOverlay: "bg-slate-900/70 backdrop-blur-sm",
    modalContent: "bg-slate-800 text-slate-100",
    toastSuccess: "bg-emerald-900 border-emerald-600 text-emerald-100",
    toastError: "bg-red-900 border-red-600 text-red-100",
    toastInfo: "bg-blue-900 border-blue-600 text-blue-100",
  },
};

const ThemeContext = createContext<{
  theme: ThemeType;
  colors: typeof themeColors.light;
  toggleTheme: () => void;
}>({
  theme: "light",
  colors: themeColors.light,
  toggleTheme: () => {},
});

const useTheme = () => useContext(ThemeContext);

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

const generateValidWords = (letters: string[]) => {
  const validWordsByLength: Record<number, string[]> = {
    2: ["at", "an", "as", "la", "el"],
    3: [
      "ant",
      "art",
      "ate",
      "ear",
      "eat",
      "era",
      "let",
      "net",
      "rat",
      "sat",
      "sea",
      "set",
      "tan",
      "tea",
    ],
    4: [
      "ante",
      "earn",
      "east",
      "late",
      "lean",
      "neat",
      "nest",
      "rate",
      "real",
      "sale",
      "salt",
      "seal",
      "seat",
      "tale",
      "tear",
      "teal",
    ],
    5: [
      "alert",
      "alter",
      "later",
      "learn",
      "least",
      "rates",
      "reals",
      "saint",
      "saner",
      "slate",
      "stale",
      "steal",
      "tales",
    ],
    6: ["alerts", "alters", "artels", "salter", "slater", "staler", "stelar"],
    7: ["starlet", "saltern", "rentals"],
  };
  return validWordsByLength;
};

export default function WordGame() {
  const [theme, setTheme] = useState<ThemeType>("light");
  const colors = themeColors[theme];

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const [letters, setLetters] = useState<string[]>([
    "E",
    "T",
    "A",
    "L",
    "R",
    "N",
    "S",
  ]);
  const [selectedLetters, setSelectedLetters] = useState<
    { letter: string; index: number }[]
  >([]);
  const [currentWord, setCurrentWord] = useState("");
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [gameActive, setGameActive] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [validWords, setValidWords] = useState<Record<number, string[]>>({});
  const [totalPossibleWords, setTotalPossibleWords] = useState(0);
  const [isInvalidWord, setIsInvalidWord] = useState(false);
  const [showAllWords, setShowAllWords] = useState(false);

  useEffect(() => {
    const words = generateValidWords(letters);
    setValidWords(words);

    let total = 0;
    Object.values(words).forEach((wordList) => {
      total += wordList.length;
    });
    setTotalPossibleWords(total);
  }, [letters]);

  useEffect(() => {
    if (showAllWords) {
      setTimeout(() => {
        const allWordsSection = document.getElementById('all-possible-words');
        if (allWordsSection) {
          allWordsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  }, [showAllWords]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const startGame = () => {
    setGameActive(true);
    setFoundWords([]);
    setScore(0);
    setTimeLeft(180);
    setShowInstructions(false);
    setShowAllWords(false);
  };

  const endGame = () => {
    setGameActive(false);
    setShowGameOver(true);
    setShowAllWords(true);
  };

  const resetGame = () => {
    setSelectedLetters([]);
    setCurrentWord("");
    setFoundWords([]);
    setScore(0);
    setTimeLeft(180);
    setGameActive(false);
    setShowGameOver(false);
    setShowAllWords(false);
  };

  const addToast = (message: string, type: ToastType = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const selectLetter = (letter: string, index: number) => {
    if (!gameActive) return;

    if (isInvalidWord) {
      setIsInvalidWord(false);
    }

    const isAlreadySelected = selectedLetters.some(
      (item) => item.index === index
    );

    if (isAlreadySelected) {
      const position = selectedLetters.findIndex(
        (item) => item.index === index
      );
      const newSelected = selectedLetters.slice(0, position);
      setSelectedLetters(newSelected);
      setCurrentWord(newSelected.map((item) => item.letter).join(""));
    } else {
      const newSelected = [...selectedLetters, { letter, index }];
      setSelectedLetters(newSelected);
      setCurrentWord(newSelected.map((item) => item.letter).join(""));
    }
  };

  const submitWord = () => {
    if (!gameActive || currentWord.length < 2) return;

    const isValid = Object.values(validWords).some((wordList) =>
      wordList.includes(currentWord.toLowerCase())
    );

    const isDuplicate = foundWords.includes(currentWord.toLowerCase());

    if (isValid && !isDuplicate) {
      setFoundWords((prev) => [...prev, currentWord.toLowerCase()]);

      const wordScore = currentWord.length * currentWord.length;
      setScore((prev) => prev + wordScore);

      addToast(`+${wordScore} points! "${currentWord}" is valid.`, "success");

      setSelectedLetters([]);
      setCurrentWord("");

      const allWords = Object.values(validWords).flat();
      if (foundWords.length + 1 >= allWords.length) {
        addToast("Amazing! You found all possible words!", "success");
        setTimeout(endGame, 1500);
      }
    } else if (isDuplicate) {
      addToast(`You already found "${currentWord}"`, "info");
      setIsInvalidWord(true);
      setSelectedLetters([]);
      setCurrentWord("");
    } else {
      addToast(`"${currentWord}" is not a valid word`, "error");
      setIsInvalidWord(true);
      setSelectedLetters([]);
      setCurrentWord("");
    }
  };

  const clearWord = () => {
    setSelectedLetters([]);
    setCurrentWord("");
    setIsInvalidWord(false);
  };

  const wordsByLength = foundWords.reduce((acc, word) => {
    const length = word.length;
    if (!acc[length]) acc[length] = [];
    acc[length].push(word);
    return acc;
  }, {} as Record<number, string[]>);

  const calculateCompletion = () => {
    if (totalPossibleWords === 0) return 0;
    return Math.round((foundWords.length / totalPossibleWords) * 100);
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      <div
        className={`min-h-screen ${colors.background} ${colors.text} ${lexend.className}`}
      >
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Sparkles className="text-amber-500" size={28} />
              <h1
                className={`text-3xl md:text-4xl font-bold ${outfit.className}`}
              >
                Word Wizard
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowInstructions(true)}
                className={`p-2 rounded-full ${colors.card} ${colors.cardBorder} ${colors.shadow} cursor-pointer`}
                aria-label="Instructions"
              >
                <Info size={20} />
              </button>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${colors.card} ${colors.cardBorder} ${colors.shadow} cursor-pointer`}
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>
          </header>

          <div
            className={`${colors.card} ${colors.cardBorder} ${colors.shadow} rounded-xl p-6 mb-8`}
          >
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`${colors.accent} ${colors.accentText} p-2 rounded-lg ${colors.shadow}`}
                >
                  <Award size={24} />
                </div>
                <div>
                  <p className={`${colors.textMuted} text-sm`}>Score</p>
                  <p className="text-2xl font-bold">{score}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`${
                    gameActive && timeLeft < 30 ? "bg-red-500" : colors.accent
                  } ${colors.accentText} p-2 rounded-lg ${colors.shadow}`}
                >
                  <Clock size={24} />
                </div>
                <div>
                  <p className={`${colors.textMuted} text-sm`}>Time</p>
                  <p className="text-2xl font-bold">{formatTime(timeLeft)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`${colors.accent} ${colors.accentText} p-2 rounded-lg ${colors.shadow}`}
                >
                  <Check size={24} />
                </div>
                <div>
                  <p className={`${colors.textMuted} text-sm`}>Words</p>
                  <p className="text-2xl font-bold">
                    {foundWords.length} / {totalPossibleWords}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className={`${colors.textMuted} text-sm mb-2`}>Current Word</p>
              <div
                className={`h-16 flex items-center justify-center rounded-lg ${colors.wordGroupBg} ${colors.shadow} overflow-hidden`}
              >
                {currentWord ? (
                  <p
                    className={`text-2xl md:text-3xl font-bold ${
                      isInvalidWord ? "text-red-500" : ""
                    }`}
                  >
                    {currentWord}
                  </p>
                ) : (
                  <p className={`${colors.textMuted} italic`}>
                    Select letters to form a word
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {letters.map((letter, index) => {
                  const isSelected = selectedLetters.some(
                    (item) => item.index === index
                  );
                  const selectionOrder = selectedLetters.findIndex(
                    (item) => item.index === index
                  );

                  return (
                    <motion.button
                      key={`${letter}-${index}`}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => selectLetter(letter, index)}
                      disabled={!gameActive}
                      className={`
                        w-14 h-14 md:w-16 md:h-16 
                        flex items-center justify-center 
                        rounded-lg border-2 font-bold text-2xl md:text-3xl
                        cursor-pointer transition-all duration-200
                        ${
                          isSelected
                            ? isInvalidWord
                              ? colors.letterTileInvalid
                              : colors.letterTileActive
                            : colors.letterTile
                        }
                        ${!gameActive ? "opacity-70 cursor-not-allowed" : ""}
                        ${colors.shadow}
                        relative
                      `}
                    >
                      {letter}
                      {isSelected && (
                        <span className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-amber-500 text-white text-sm font-bold rounded-full border-2 border-white shadow-md z-10">
                          {selectionOrder + 1}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {!gameActive ? (
                <button
                  onClick={startGame}
                  className={`${colors.primary} ${colors.primaryText} ${colors.shadow} px-6 py-3 rounded-lg font-bold text-lg cursor-pointer`}
                >
                  {foundWords.length > 0 ? "Play Again" : "Start Game"}
                </button>
              ) : (
                <>
                  <button
                    onClick={submitWord}
                    disabled={currentWord.length < 2}
                    className={`${colors.primary} ${colors.primaryText} ${
                      colors.shadow
                    } px-6 py-3 rounded-lg font-bold text-lg ${
                      currentWord.length < 2
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    Submit Word
                  </button>
                  <button
                    onClick={clearWord}
                    disabled={currentWord.length === 0}
                    className={`${colors.secondary} ${colors.secondaryText} ${
                      colors.shadow
                    } px-6 py-3 rounded-lg font-bold text-lg ${
                      currentWord.length === 0
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    Clear
                  </button>
                  <button
                    onClick={endGame}
                    className={`bg-red-500 hover:bg-red-600 text-white ${
                      colors.shadow
                    } px-6 py-3 rounded-lg font-bold text-lg cursor-pointer`}
                  >
                    End Game
                  </button>
                </>
              )}
            </div>
          </div>

          <div
            className={`${colors.card} ${colors.cardBorder} ${colors.shadow} rounded-xl p-6`}
          >
            <h2
              className={`text-xl md:text-2xl font-bold mb-4 ${outfit.className}`}
            >
              Found Words
            </h2>

            {foundWords.length === 0 ? (
              <p className={`${colors.textMuted} text-center py-4`}>
                {gameActive
                  ? "Start finding words!"
                  : "Start the game to find words"}
              </p>
            ) : (
              <div className="space-y-4">
                {[2, 3, 4, 5, 6, 7, 8].map((length) => {
                  if (
                    !wordsByLength[length] ||
                    wordsByLength[length].length === 0
                  )
                    return null;

                  return (
                    <div key={`length-${length}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`font-bold ${colors.textMuted}`}>
                          {length}-Letter Words
                        </h3>
                        <span className={`text-sm ${colors.textMuted}`}>
                          ({wordsByLength[length].length} /{" "}
                          {validWords[length]?.length || 0})
                        </span>
                      </div>
                      <div
                        className={`${colors.wordGroupBg} rounded-lg p-3 flex flex-wrap gap-2`}
                      >
                        {wordsByLength[length].map((word) => (
                          <span
                            key={word}
                            className={`${colors.card} ${colors.cardBorder} px-3 py-1 rounded-md text-sm md:text-base capitalize`}
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {foundWords.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className={colors.textMuted}>Progress</span>
                  <span className="font-bold">{calculateCompletion()}%</span>
                </div>
                <div
                  className={`w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}
                >
                  <div
                    className={`h-full ${colors.accent}`}
                    style={{ width: `${calculateCompletion()}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          {showAllWords && (
            <div 
              id="all-possible-words"
              className={`${colors.card} ${colors.cardBorder} ${colors.shadow} rounded-xl p-6 mt-8`}
            >
              <h2 className={`text-xl md:text-2xl font-bold mb-4 ${outfit.className}`}>
                All Possible Words
              </h2>
              <div className="space-y-6">
                {Object.entries(validWords)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([length, words]) => (
                    <div key={`all-length-${length}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`font-bold ${colors.textMuted}`}>
                          {length}-Letter Words
                        </h3>
                        <span className={`text-sm ${colors.textMuted}`}>
                          ({words.length} words)
                        </span>
                      </div>
                      <div className={`${colors.wordGroupBg} rounded-lg p-3 flex flex-wrap gap-2`}>
                        {words.map((word) => {
                          const isFound = foundWords.includes(word);
                          return (
                            <span
                              key={`all-${word}`}
                              className={`px-3 py-1 rounded-md text-sm md:text-base capitalize
                                ${
                                  isFound
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                }
                              `}
                            >
                              {word}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {showInstructions && (
            <Modal
              title="How to Play"
              onClose={() => setShowInstructions(false)}
            >
              <div className="space-y-4">
                <p>Welcome to Word Wizard! Here's how to play:</p>

                <div className="space-y-2">
                  <h3 className="font-bold">Rules:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Form words using the 7 provided letters</li>
                    <li>Words must be 2-8 letters long</li>
                    <li>Each letter can only be used once per word</li>
                    <li>
                      You have 3 minutes to find as many words as possible
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold">Scoring:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>2-letter word: 4 points</li>
                    <li>3-letter word: 9 points</li>
                    <li>4-letter word: 16 points</li>
                    <li>5-letter word: 25 points</li>
                    <li>6-letter word: 36 points</li>
                    <li>7-letter word: 49 points</li>
                    <li>8-letter word: 64 points</li>
                  </ul>
                </div>

                <p>Try to find all possible words before time runs out!</p>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      setShowInstructions(false);
                      if (!gameActive) startGame();
                    }}
                    className={`${colors.primary} ${colors.primaryText} ${colors.shadow} px-6 py-3 rounded-lg font-bold text-lg w-full cursor-pointer`}
                  >
                    {gameActive ? "Continue Playing" : "Start Game"}
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showGameOver && (
            <Modal title="Game Over!" onClose={() => setShowGameOver(false)}>
              <div className="space-y-4">
                <div className="py-4 text-center">
                  <p className="text-lg">Your final score:</p>
                  <p className="text-4xl font-bold">{score}</p>
                </div>

                <div className="text-center">
                  <p className="text-lg">Words found:</p>
                  <p className="text-2xl font-bold">
                    {foundWords.length} / {totalPossibleWords}
                  </p>
                  <p className={`${colors.textMuted}`}>
                    ({calculateCompletion()}% complete)
                  </p>
                </div>

                <div className="pt-6 space-y-3">
                  <button
                    onClick={resetGame}
                    className={`${colors.primary} ${colors.primaryText} ${colors.shadow} px-6 py-3 rounded-lg font-bold text-lg w-full cursor-pointer`}
                  >
                    Play Again
                  </button>
                  <button
                    onClick={() => setShowGameOver(false)}
                    className={`${colors.card} ${colors.cardBorder} ${colors.shadow} px-6 py-3 rounded-lg font-bold text-lg w-full cursor-pointer`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </AnimatePresence>

        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-md px-4">
          <AnimatePresence>
            {toasts.map((toast) => (
              <Toast key={toast.id} toast={toast} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

function Modal({ title, children, onClose }: ModalProps) {
  const { colors } = useTheme();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${colors.modalOverlay}`}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`w-full max-w-md max-h-[90vh] rounded-xl ${colors.modalContent} ${colors.shadow} overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-70px)]">{children}</div>
      </motion.div>
    </motion.div>
  );
}

interface ToastProps {
  toast: Toast;
}

function Toast({ toast }: ToastProps) {
  const { colors } = useTheme();

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return colors.toastSuccess;
      case "error":
        return colors.toastError;
      case "info":
        return colors.toastInfo;
      default:
        return colors.toastInfo;
    }
  };

  const getToastIcon = () => {
    switch (toast.type) {
      case "success":
        return <Check size={18} />;
      case "error":
        return <AlertTriangle size={18} />;
      case "info":
        return <Info size={18} />;
      default:
        return <Info size={18} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${getToastStyles()} border-l-4 rounded-lg p-3 ${
        colors.shadow
      } flex items-center gap-2`}
    >
      {getToastIcon()}
      <p>{toast.message}</p>
    </motion.div>
  );
}
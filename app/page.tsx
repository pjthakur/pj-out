"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun, Moon, RefreshCw, Info, Lightbulb, Check, Brain,
  Keyboard, Award, Target, Shuffle, Crown,
  Medal, Settings, Clock, Trophy, ChevronRight
} from "lucide-react";

export default function Home() {
  const [theme, setTheme] = useState("light");
  const [words] = useState({
    easy: [
      "apple", "banana", "cherry", "dragon", "elephant",
      "flower", "giraffe", "hamster", "igloo", "jungle"
    ],
    medium: [
      "abstract", "business", "calendar", "database", "exercise",
      "festival", "graduate", "heritage", "industry", "journey"
    ],
    hard: [
      "ambiguous", "benevolent", "cognizant", "delimitate", "exacerbate",
      "faciliate", "gregarious", "hypothesis", "juxtapose", "knowledge"
    ]
  });

  // Add word definitions/clues for each difficulty level
  const [wordDefinitions] = useState({
    easy: {
      "apple": "A red or green fruit that keeps the doctor away",
      "banana": "A yellow curved fruit with a peel",
      "cherry": "Small red fruit often on top of ice cream",
      "dragon": "A mythical fire-breathing creature",
      "elephant": "The largest land mammal with a trunk",
      "flower": "Colorful plant bloom that smells nice",
      "giraffe": "Tallest animal with a very long neck",
      "hamster": "Small rodent kept as a pet in a cage",
      "igloo": "Ice house built in the Arctic",
      "jungle": "Dense forest in tropical regions"
    },
    medium: {
      "abstract": "Existing in thought rather than physical form",
      "business": "Commercial activity or enterprise",
      "calendar": "System to organize days and months",
      "database": "Organized collection of information",
      "exercise": "Physical activity for fitness",
      "festival": "Celebration or special event",
      "graduate": "Complete studies and earn a degree",
      "heritage": "Things passed down from previous generations",
      "industry": "Economic activity of manufacturing goods",
      "journey": "Travel from one place to another"
    },
    hard: {
      "ambiguous": "Open to more than one interpretation",
      "benevolent": "Kind and generous in nature",
      "cognizant": "Having knowledge or awareness",
      "delimitate": "Establish boundaries or limits",
      "exacerbate": "Make a problem or situation worse",
      "faciliate": "Make an action or process easier",
      "gregarious": "Fond of company; sociable",
      "hypothesis": "Proposed explanation requiring more testing",
      "juxtapose": "Place or deal with close together for contrast",
      "knowledge": "Awareness or familiarity gained by experience"
    }
  });
  const [difficulty, setDifficulty] = useState("easy");
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [userGuess, setUserGuess] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongGuess, setWrongGuess] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [playerName, setPlayerName] = useState("Neo");
  const [hasEnteredName, setHasEnteredName] = useState(true);
  const [landingAnimationComplete, setLandingAnimationComplete] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showTestimonials, setShowTestimonials] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds = 1 minute
  const [timerActive, setTimerActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [correctWord, setCorrectWord] = useState("");
  const [points, setPoints] = useState(0);
  const [timeBonus, setTimeBonus] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [startTime] = useState(60); // Initial timer value in seconds
  const [hint, setHint] = useState("");
  const [currentDefinition, setCurrentDefinition] = useState("");

  // Sample leaderboard data
  const [leaderboard] = useState([
    { name: "Alex", score: 350, rank: 1, difficulty: "hard", wordsCompleted: 12 },
    { name: "Taylor", score: 310, rank: 2, difficulty: "medium", wordsCompleted: 15 },
    { name: "Jordan", score: 280, rank: 3, difficulty: "hard", wordsCompleted: 9 },
    { name: "Casey", score: 230, rank: 4, difficulty: "medium", wordsCompleted: 11 },
    { name: "Riley", score: 210, rank: 5, difficulty: "easy", wordsCompleted: 21 },
    { name: "Priyansh", score: 200, rank: 5, difficulty: "easy", wordsCompleted: 21 },
  ]);

  // Add new state for game over
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);

  useEffect(() => {
    // Get theme from localStorage on initial load
    const savedTheme = localStorage.getItem("wordPuzzleTheme") || "light";
    setTheme(savedTheme);

    // Get player name from localStorage if available
    const savedName = localStorage.getItem("wordPuzzlePlayerName") || "";
    if (savedName) {
      setPlayerName(savedName);
      setHasEnteredName(true);
    }

    // Get saved difficulty if available
    const savedDifficulty = localStorage.getItem("wordPuzzleDifficulty") || "easy";
    setDifficulty(savedDifficulty);

    // Get saved score if available
    const savedScore = localStorage.getItem("wordPuzzleScore");
    if (savedScore) {
      setScore(parseInt(savedScore, 10));
    }

    // Get a random word and scramble it
    getNewWord(savedDifficulty);
  }, []);

  // When the player name is entered (game starts), start the timer
  useEffect(() => {
    if (hasEnteredName) {
      startTimer();
    }
  }, [hasEnteredName]);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;

    if (timerActive && timeRemaining > 0) {
      timerInterval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            // Game Over when time expires
            setIsGameOver(true);
            setFinalScore(score);
            setWordsCompleted(Math.floor(score / (difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 30)));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerActive, timeRemaining, score, difficulty]);

  const getNewWord = (difficultyLevel = difficulty) => {
    const currentWordList = words[difficultyLevel as keyof typeof words];
    const randomIndex = Math.floor(Math.random() * currentWordList.length);
    const word = currentWordList[randomIndex];
    setCurrentWord(word);
    setScrambledWord(scrambleWord(word));
    setUserGuess("");
    setIsCorrect(false);
    setShowHint(false);
    setWrongGuess(false);

    // Get the definition or clue for the selected word
    const definitions = wordDefinitions[difficultyLevel as keyof typeof wordDefinitions];
    const wordDef = definitions[word as keyof typeof definitions] || `A ${word.length}-letter word`;
    setCurrentDefinition(wordDef);

    // Generate advanced hint for the word
    const advancedHint = generateHint(word);
    setHint(advancedHint);

    // Reset and start timer when a new word is presented
    resetTimer();
    startTimer();
  };

  // Generate a more helpful hint based on word structure
  const generateHint = (word: string): string => {
    // First level hint - first and last letter
    if (word.length <= 5) {
      return `The word starts with "${word[0].toUpperCase()}" and ends with "${word[word.length - 1]}".`;
    }
    // More advanced hint for longer words
    else {
      // For medium and hard words, reveal a bit more structure
      let pattern = '';
      for (let i = 0; i < word.length; i++) {
        if (i === 0 || i === word.length - 1 || i === Math.floor(word.length / 2)) {
          pattern += word[i].toUpperCase();
        } else {
          pattern += '_ ';
        }
      }
      return `Word pattern: ${pattern}`;
    }
  };

  const scrambleWord = (word: string): string => {
    const wordArray = word.split("");
    let scrambled = wordArray.sort(() => Math.random() - 0.5).join("");

    // Make sure scrambled word is different from original
    while (scrambled === word) {
      scrambled = wordArray.sort(() => Math.random() - 0.5).join("");
    }

    return scrambled;
  };

  // Update the function that formats timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleGuess();
  };

  const handleNextWord = () => {
    setShowResult(false);
    getNewWord();
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("wordPuzzleTheme", newTheme);
  };

  const getHint = () => {
    setShowHint(true);
  };

  const toggleInstructionsModal = () => {
    setShowInstructionsModal(!showInstructionsModal);
  };

  // Add useEffect to prevent body scrolling when modal is open
  useEffect(() => {
    const isAnyModalOpen = showInstructionsModal || showLeaderboard || isGameOver || showResult;
    
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showInstructionsModal, showLeaderboard, isGameOver, showResult]);

  const handleNameSubmit = (name: string) => {
    if (name.trim()) {
      setPlayerName(name.trim());
      setHasEnteredName(true);
      localStorage.setItem("wordPuzzlePlayerName", name.trim());
    }
  };

  const changeDifficulty = (newDifficulty: string) => {
    setDifficulty(newDifficulty);
    localStorage.setItem("wordPuzzleDifficulty", newDifficulty);
    getNewWord(newDifficulty);
    // Timer will restart automatically via getNewWord
  };

  // Update color variables for better aesthetics and consistency
  const glassCard = theme === "light"
    ? "bg-white/60 backdrop-blur-lg border border-white/60 shadow-xl"
    : "bg-black/40 backdrop-blur-lg border border-gray-700/60 shadow-xl";

  const glassCardDarker = theme === "light"
    ? "bg-white/80 backdrop-blur-lg border border-white/70 shadow-xl"
    : "bg-black/60 backdrop-blur-lg border border-gray-700/70 shadow-xl";

  const bgGradient = theme === "light"
    ? "bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200"
    : "bg-gradient-to-br from-indigo-950 via-purple-950 to-gray-900";

  const textColor = theme === "light" ? "text-gray-800" : "text-gray-100";

  const buttonPrimary = theme === "light"
    ? "bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-600 hover:to-fuchsia-700 text-white shadow-lg shadow-violet-500/30"
    : "bg-gradient-to-r from-violet-400 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-600 text-white shadow-lg shadow-violet-500/20";

  const buttonSecondary = theme === "light"
    ? "bg-white/80 hover:bg-white/100 text-gray-800 shadow-md border border-gray-200/60"
    : "bg-gray-800/80 hover:bg-gray-800/100 text-gray-200 shadow-md border border-gray-700/60";

  const inputBg = theme === "light"
    ? "bg-white/80 border border-gray-200/70 shadow-inner"
    : "bg-gray-800/80 border border-gray-700/70 shadow-inner";

  const hintBg = theme === "light"
    ? "bg-amber-500/10 text-amber-800 border border-amber-200/50"
    : "bg-amber-800/30 text-amber-200 border border-amber-700/50";

  // Update sidebar panel styling for consistency
  const sidebarPanel = theme === "light"
    ? "bg-white/70 backdrop-blur-lg border-l border-white/60 shadow-xl"
    : "bg-black/50 backdrop-blur-lg border-l border-gray-700/60 shadow-xl";

  // Instructions step styles
  const instructionCard = theme === "light"
    ? "bg-white/80 border border-white/60 shadow-md"
    : "bg-gray-800/80 border border-gray-700/60 shadow-md";

  // Landing screen component
  const LandingScreen = () => {
    const [localPlayerName, setLocalPlayerName] = useState(playerName);

    const handleLocalNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (localPlayerName.trim()) {
        setPlayerName(localPlayerName);
        setHasEnteredName(true);
        localStorage.setItem("wordPuzzlePlayerName", localPlayerName);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: theme === 'light'
            ? 'linear-gradient(135deg, rgba(255,182,255,0.3), rgba(158,208,255,0.3))'
            : 'linear-gradient(135deg, rgba(88,28,135,0.3), rgba(30,64,175,0.3))'
        }}
      >
        <motion.div
          className={`${glassCardDarker} rounded-3xl p-8 w-full max-w-lg shadow-2xl relative overflow-hidden`}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Decorative elements */}
          <div className="absolute w-32 h-32 rounded-full bg-pink-400/20 blur-2xl -top-16 -left-16"></div>
          <div className="absolute w-32 h-32 rounded-full bg-blue-400/20 blur-2xl -bottom-16 -right-16"></div>

          <motion.div
            className="text-center mb-8"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="flex justify-center mb-4"
              animate={{
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              <Shuffle className="w-16 h-16 text-purple-500" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Word Puzzle
            </h1>
            <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
              Challenge your mind with word scrambles!
            </p>
          </motion.div>

          {/* <form onSubmit={handleLocalNameSubmit} className="space-y-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium mb-2">Enter Your Name</label>
            <input
              type="text"
              value={localPlayerName}
              onChange={(e) => setLocalPlayerName(e.target.value)}
              className={`w-full p-4 rounded-xl ${inputBg} text-center text-xl`}
              placeholder="Type your name here..."
              required
              minLength={2}
            />
          </motion.div>

          <motion.button
            type="submit"
            className={`w-full py-4 px-6 rounded-xl ${buttonPrimary} font-medium text-lg flex items-center justify-center gap-3 relative overflow-hidden`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Target size={24} />
            Start Playing
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.8 }}
            />
          </motion.button>
        </form> */}

          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-sm flex items-center justify-center gap-2">
              <Brain size={16} />
              <span className="italic">Train your brain with word puzzles!</span>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    )
  };

  const startTimer = () => {
    setTimeRemaining(startTime);
    setTimerActive(true);
    setIsTimerActive(true);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimeRemaining(startTime);
    setIsTimerActive(false);
  };

  const handleTimerToggle = () => {
    // Timer is now automatic and can't be toggled by the user
    // This function is now just a placeholder
  };

  const reshuffleWord = () => {
    if (!isCorrect) {
      setScrambledWord(scrambleWord(currentWord));
      // Reset and restart timer when word is reshuffled
      // resetTimer();
      // startTimer();
    }
  };

  const handleSkip = () => {
    // Skip current word and get a new one
    getNewWord();
  };

  const handleGuess = () => {
    if (!playerName.trim()) {
      alert("Please enter your name first!");
      return;
    }

    if (userGuess.toLowerCase() === currentWord.toLowerCase()) {
      setIsCorrect(true);

      // Calculate score based on difficulty, time remaining, and whether hint was used
      let pointsEarned = 0;
      switch (difficulty) {
        case "easy":
          pointsEarned = 10;
          break;
        case "medium":
          pointsEarned = 20;
          break;
        case "hard":
          pointsEarned = 30;
          break;
      }

      // Time bonus: Up to 5 points based on time remaining
      const timeBonusPoints = Math.floor((timeRemaining / startTime) * 5);

      // Penalty for using hint
      if (showHint) {
        pointsEarned = Math.floor(pointsEarned * 0.7); // 30% penalty
      }

      const totalPoints = pointsEarned + timeBonusPoints;

      setTimeBonus(timeBonusPoints);
      setPoints(totalPoints);
      setScore(prevScore => prevScore + totalPoints);

      // Update localStorage
      localStorage.setItem("wordPuzzleScore", (score + totalPoints).toString());

      // Update leaderboard
      const playerEntry = {
        name: playerName,
        score: score + totalPoints,
        difficulty,
        wordsCompleted: 1, // This would need to be tracked more accurately
      };

      // This is where you would update your database/storage
      // For now, we're just showing the result modal

      // Stop the timer when they get it right
      setTimerActive(false);
      setIsTimerActive(false);

      // Show the result modal
      setCorrectWord(currentWord);
      setShowResult(true);
    } else {
      // Wrong guess animation
      setWrongGuess(true);
      setTimeout(() => {
        setWrongGuess(false);
      }, 500);
    }
  };

  const handleLeaderboardClick = () => {
    setShowLeaderboard(true);
  };

  const handleHintClick = () => {
    setShowHint(!showHint);
  };

  const handleReshuffle = () => {
    reshuffleWord();
  };

  const handleRestart = () => {
    setScore(0);
    setTimeRemaining(startTime);
    setTimerActive(false);
    setIsGameOver(false);
    setIsCorrect(false);
    setShowHint(false);
    setUserGuess("");
    getNewWord();
  };

  return (
    <div className={`min-h-screen ${bgGradient} ${textColor} font-['Quicksand',sans-serif] transition-colors duration-300 relative overflow-hidden`}>
      {/* Decorative floating bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { width: 60, height: 60, left: 20, top: 15 },
          { width: 45, height: 45, left: 80, top: 30 },
          { width: 70, height: 50, left: 40, top: 70 },
          { width: 50, height: 50, left: 70, top: 60 },
          { width: 40, height: 55, left: 30, top: 50 },
          { width: 55, height: 40, left: 60, top: 40 },
          { width: 65, height: 65, left: 50, top: 20 },
          { width: 35, height: 35, left: 90, top: 80 }
        ].map((bubble, index) => (
          <motion.div
            key={index}
            className={`absolute rounded-full ${theme === "light"
              ? "bg-gradient-to-r from-purple-300/30 to-pink-300/30"
              : "bg-gradient-to-r from-purple-900/20 to-pink-900/20"
              }`}
            style={{
              width: `${bubble.width}px`,
              height: `${bubble.height}px`,
              left: `${bubble.left}%`,
              top: `${bubble.top}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 10 + index * 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.5,
            }}
          />
        ))}
      </div>

      {/* Website Logo at Top */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full py-2 flex justify-center items-center ${theme === "light"
          ? "bg-gradient-to-r from-violet-200/90 via-fuchsia-200/90 to-pink-200/90"
          : "bg-gradient-to-r from-violet-950/90 via-fuchsia-950/90 to-indigo-950/90"} shadow-md border-b ${theme === "light" ? "border-violet-300/50" : "border-violet-900/50"}`}
      >
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="flex items-center justify-center gap-4">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 5, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 1
              }}
              className="relative"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-md">
                <Shuffle className="w-8 h-8 text-white" />
              </div>
              <motion.div
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center shadow-sm"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="font-bold text-amber-900 text-xs">W</span>
              </motion.div>
              <motion.div
                className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-violet-500 border-2 border-white flex items-center justify-center shadow-sm"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="font-bold text-white text-xs">P</span>
              </motion.div>
            </motion.div>
            <div>
              <h1 className={`text-2xl md:text-3xl font-extrabold ${theme === "light"
                ? "bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent"}`}
              >
                Word Puzzle
              </h1>
              <p className={`text-xs italic font-medium ${theme === "light" ? "text-violet-800" : "text-violet-300"}`}>
                Unscramble & Train Your Brain!
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.button
        onClick={toggleInstructionsModal}
        className={`fixed bottom-4 left-4 p-3 rounded-full ${buttonSecondary} z-50 lg:hidden`}
        whileHover={{ scale: 1.1, rotate: [0, 10, -10, 0] }}
        whileTap={{ scale: 0.9 }}
        aria-label="Show instructions"
      >
        <Info size={20} />
      </motion.button>
      <motion.button
        onClick={toggleTheme}
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full border ${theme === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      >
        {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </motion.button>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-48px)] overflow-hidden">
        <div className="flex-1 px-4 py-2 relative overflow-auto">
          {/* Landing Screen */}
          {/* <AnimatePresence>
            {!hasEnteredName && <LandingScreen />}
          </AnimatePresence> */}

          {/* Main Game Content */}
          {hasEnteredName && (
            <div className="flex mt-2 flex-col lg:flex-row gap-5">
              {/* Leaderboard - Left Side */}
              <div className={`w-full lg:w-80 ${theme === "light"
                ? "bg-white/90 border border-violet-200"
                : "bg-gray-900/90 border border-violet-900"} backdrop-blur-md rounded-xl shadow-md p-4 mb-5 lg:mb-0 order-3 lg:order-1 h-fit`}>
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className={`w-5 h-5 ${theme === "light" ? "text-amber-500" : "text-amber-400"}`} />
                  <h2 className={`text-lg font-bold ${theme === "light" ? "text-violet-900" : "text-violet-300"}`}>
                    Leaderboard
                  </h2>
                </div>
                <p className={`text-xs mb-3 ${theme === "light" ? "text-violet-700" : "text-violet-400"}`}>
                  Top players with the most points
                </p>

                <div className="space-y-2.5">
                  {leaderboard.slice(0, 6).map((entry, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center justify-between p-3 rounded-lg ${index === 0
                        ? theme === "light" ? "bg-amber-50 border border-amber-200" : "bg-amber-950/40 border border-amber-800"
                        : index === 1
                          ? theme === "light" ? "bg-gray-100 border border-gray-200" : "bg-gray-800/60 border border-gray-700"
                          : index === 2
                            ? theme === "light" ? "bg-orange-50 border border-orange-200" : "bg-orange-950/40 border border-orange-800"
                            : theme === "light" ? "bg-violet-50 border border-violet-200" : "bg-violet-950/40 border border-violet-800"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0
                          ? "bg-amber-200 text-amber-900"
                          : index === 1
                            ? "bg-gray-200 text-gray-800"
                            : index === 2
                              ? "bg-orange-200 text-orange-900"
                              : theme === "light" ? "bg-violet-200 text-violet-900" : "bg-violet-800 text-violet-200"
                          }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className={`font-medium text-sm ${theme === "light" ? "text-gray-900" : "text-gray-100"}`}>
                            {entry.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${entry.difficulty === "easy"
                              ? theme === "light" ? "bg-green-100 text-green-800" : "bg-green-950/60 text-green-400"
                              : entry.difficulty === "medium"
                                ? theme === "light" ? "bg-blue-100 text-blue-800" : "bg-blue-950/60 text-blue-400"
                                : theme === "light" ? "bg-red-100 text-red-800" : "bg-red-950/60 text-red-400"
                              }`}>
                              {entry.difficulty.charAt(0).toUpperCase() + entry.difficulty.slice(1)}
                            </span>
                            <p className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                              {entry.wordsCompleted || "5"} words
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${index === 0
                        ? "bg-amber-200/70 text-amber-900"
                        : index === 1
                          ? "bg-gray-200/70 text-gray-800"
                          : index === 2
                            ? "bg-orange-200/70 text-orange-900"
                            : theme === "light" ? "bg-violet-200/70 text-violet-900" : "bg-violet-800/70 text-violet-200"
                        }`}>
                        {entry.score} pts
                      </div>
                    </motion.div>
                  ))}

                  {leaderboard.length === 0 && (
                    <div className={`p-6 rounded-lg text-center ${theme === "light" ? "bg-gray-50 text-gray-500" : "bg-gray-800/50 text-gray-400"}`}>
                      <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="font-medium text-sm">No players yet</p>
                      <p className="text-xs mt-1">Be the first to get on the leaderboard!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Central Game Area */}
              <div className="flex flex-col flex-1 order-1 lg:order-2">
                {/* Welcome Banner */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`w-full mx-auto ${theme === "light"
                    ? "bg-white/90 border border-violet-200"
                    : "bg-gray-900/90 border border-violet-900"} backdrop-blur-md rounded-xl shadow-md p-2 mb-2 flex items-center justify-between`}
                >
                  <div className="flex items-center gap-2">
                    <Target size={18} className="text-purple-500" />
                    <span className="font-medium text-sm">Welcome, {playerName}!</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={18} className="text-yellow-500" />
                    <span className="font-bold">{score}</span>
                  </div>
                </motion.div>

                {/* Difficulty Selector */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`w-full mx-auto ${theme === "light"
                    ? "bg-white/90 border border-violet-200"
                    : "bg-gray-900/90 border border-violet-900"} backdrop-blur-md rounded-xl shadow-md p-2 mb-2`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Settings size={16} className="text-blue-500" />
                      <span className="text-sm font-medium">Difficulty</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => changeDifficulty("easy")}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${difficulty === "easy"
                          ? "bg-green-500 text-white shadow-md"
                          : theme === "light" ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-green-900/30 text-green-300 hover:bg-green-800/50"
                          }`}
                      >
                        Easy
                      </button>
                      <button
                        onClick={() => changeDifficulty("medium")}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${difficulty === "medium"
                          ? "bg-yellow-500 text-white shadow-md"
                          : theme === "light" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" : "bg-yellow-900/30 text-yellow-300 hover:bg-yellow-800/50"
                          }`}
                      >
                        Medium
                      </button>
                      <button
                        onClick={() => changeDifficulty("hard")}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${difficulty === "hard"
                          ? "bg-red-500 text-white shadow-md"
                          : theme === "light" ? "bg-red-100 text-red-800 hover:bg-red-200" : "bg-red-900/30 text-red-300 hover:bg-red-800/50"
                          }`}
                      >
                        Hard
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Main Game Card */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className={`w-full mx-auto ${theme === "light"
                    ? "bg-white/90 border border-violet-200"
                    : "bg-gray-900/90 border border-violet-900"} backdrop-blur-md rounded-xl shadow-lg overflow-hidden relative`}
                >
                  {/* Decorative floating orbs */}
                  <div className="absolute w-20 h-20 rounded-full bg-pink-400/30 blur-xl -top-5 -left-5 animate-pulse"></div>
                  <div className="absolute w-16 h-16 rounded-full bg-blue-400/30 blur-xl -bottom-4 -right-4 animate-pulse" style={{ animationDelay: "1s" }}></div>
                  <div className="absolute w-12 h-12 rounded-full bg-purple-400/30 blur-xl top-1/2 -right-6 animate-pulse" style={{ animationDelay: "1.5s" }}></div>

                  <div className="p-4 relative">
                    {/* Game Stats - Add new section at top */}
                    <div className="mb-3 grid grid-cols-3 gap-2">
                      <div className={`p-3 rounded-lg ${theme === "light"
                        ? "bg-violet-50 border border-violet-200"
                        : "bg-violet-950/30 border border-violet-800"} flex flex-col items-center justify-center`}>
                        <span className="text-xs opacity-70 mb-1">Current Level</span>
                        <span className={`text-lg font-bold ${difficulty === "easy"
                          ? theme === "light" ? "text-green-600" : "text-green-400"
                          : difficulty === "medium"
                            ? theme === "light" ? "text-yellow-600" : "text-yellow-400"
                            : theme === "light" ? "text-red-600" : "text-red-400"
                          }`}>
                          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </span>
                      </div>

                      <div className={`p-3 rounded-lg ${theme === "light"
                        ? "bg-violet-50 border border-violet-200"
                        : "bg-violet-950/30 border border-violet-800"} flex flex-col items-center justify-center`}>
                        <span className="text-xs opacity-70 mb-1">Current Score</span>
                        <span className="text-lg font-bold">
                          {score}
                        </span>
                      </div>

                      <div className={`p-3 rounded-lg ${theme === "light"
                        ? "bg-violet-50 border border-violet-200"
                        : "bg-violet-950/30 border border-violet-800"} flex flex-col items-center justify-center`}>
                        <span className="text-xs opacity-70 mb-1">Words Solved</span>
                        <span className="text-lg font-bold">
                          {Math.floor(
                            (score) / (
                              difficulty === "easy" ? 10 :
                                difficulty === "medium" ? 20 : 30
                            )
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Timer and Shuffle Controls */}
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      <motion.div
                        className={`relative flex flex-col items-center justify-center rounded-lg px-3 py-2 ${isTimerActive && timeRemaining <= 15
                          ? `${theme === "light"
                            ? "bg-red-100 text-red-800 border border-red-300"
                            : "bg-red-950/70 text-red-300 border border-red-800"}`
                          : isTimerActive
                            ? `${theme === "light"
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-amber-950/70 text-amber-300 border border-amber-800"}`
                            : `${theme === "light"
                              ? "bg-violet-100 text-violet-800 border border-violet-300"
                              : "bg-violet-950/70 text-violet-300 border border-violet-800"}`
                          } transition-all duration-300 shadow-sm`}
                      >
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={isTimerActive ? {
                              rotate: [0, 360],
                              scale: [1, 1.2, 1],
                            } : {}}
                            transition={isTimerActive ? {
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "loop",
                            } : {}}
                          >
                            <Clock className={`w-5 h-5 ${isTimerActive && timeRemaining <= 15
                              ? "text-red-500"
                              : ""
                              }`} />
                          </motion.div>
                          <span className={`font-semibold text-sm ${isTimerActive && timeRemaining <= 15
                            ? theme === "light" ? "text-red-600" : "text-red-400"
                            : ""
                            }`}>
                            {formatTime(timeRemaining)}
                          </span>
                        </div>
                        {/* <span className="text-xs font-medium">Time</span> */}
                      </motion.div>

                      <motion.button
                        onClick={handleReshuffle}
                        disabled={isCorrect}
                        className={`flex items-center justify-center px-3 py-2 rounded-lg ${isCorrect
                          ? "opacity-50 cursor-not-allowed"
                          : theme === "light"
                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                            : "bg-blue-950/70 text-blue-300 border border-blue-800"
                          } shadow-sm`}
                        whileHover={!isCorrect ? { scale: 1.05 } : {}}
                        whileTap={!isCorrect ? { scale: 0.95 } : {}}
                      >
                        <motion.div
                          animate={{
                            rotate: [0, -360],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: "easeInOut",
                            repeatDelay: 3
                          }}
                        >
                          <RefreshCw className="w-5 h-5 mr-1" />
                        </motion.div>
                        <span className="text-xs font-medium">Shuffle</span>
                      </motion.button>

                      <motion.button
                        onClick={handleSkip}
                        disabled={isCorrect}
                        className={`flex items-center justify-center px-3 py-2 rounded-lg ${isCorrect
                          ? "opacity-50 cursor-not-allowed"
                          : theme === "light"
                            ? "bg-purple-100 text-purple-800 border border-purple-300"
                            : "bg-purple-950/70 text-purple-300 border border-purple-800"
                          } shadow-sm`}
                        whileHover={!isCorrect ? { scale: 1.05 } : {}}
                        whileTap={!isCorrect ? { scale: 0.95 } : {}}
                      >
                        <motion.div
                          animate={{
                            x: [0, 2, 0],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            repeatType: "loop",
                          }}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </motion.div>
                        <span className="text-xs font-medium">Skip</span>
                      </motion.button>
                    </div>

                    {/* Scrambled Word Display with Background */}
                    <div className={`mb-4 p-4 rounded-xl flex flex-col items-center justify-center ${theme === "light"
                      ? "bg-gradient-to-br from-fuchsia-50 to-violet-50 border border-violet-200"
                      : "bg-gradient-to-br from-fuchsia-950/20 to-violet-950/20 border border-violet-800"} shadow-inner`}>
                      <div className="mb-4">
                        <span className={`text-xs uppercase tracking-wider font-medium ${theme === "light" ? "text-violet-600/70" : "text-violet-400/70"}`}>
                          Unscramble This Word
                        </span>
                      </div>

                      <motion.div
                        className="flex flex-wrap justify-center gap-2 mb-4"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      >
                        {scrambledWord.split('').map((letter, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`w-10 h-10 flex items-center justify-center text-xl font-bold rounded-lg ${theme === "light"
                              ? "bg-white/80 border-2 border-violet-300 text-violet-900 shadow-md"
                              : "bg-gray-800/80 border-2 border-violet-700 text-violet-300 shadow-md"}`}
                          >
                            {letter.toUpperCase()}
                          </motion.div>
                        ))}
                      </motion.div>

                      {/* Word Definition/Clue */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className={`w-full p-3 rounded-lg mb-3 text-center ${theme === "light"
                          ? "bg-indigo-100/70 border border-indigo-200 text-indigo-900"
                          : "bg-indigo-900/30 border border-indigo-800 text-indigo-300"}`}
                      >
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Brain size={16} className={theme === "light" ? "text-indigo-600" : "text-indigo-400"} />
                          <span className={`text-xs font-medium ${theme === "light" ? "text-indigo-600" : "text-indigo-400"}`}>
                            WORD CLUE
                          </span>
                        </div>
                        <p className="text-sm font-medium italic">
                          "{currentDefinition}"
                        </p>
                      </motion.div>

                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 10, -10, 0],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${theme === "light"
                          ? "bg-fuchsia-100 text-fuchsia-700"
                          : "bg-fuchsia-900/30 text-fuchsia-300"}`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Brain size={14} />
                          <span>{scrambledWord.length} letters</span>
                        </div>
                      </motion.div>
                    </div>

                    {!isCorrect ? (
                      <form onSubmit={handleSubmit} className="w-full mx-auto">
                        <div className="mb-4">
                          <div className="relative">
                            <motion.input
                              type="text"
                              value={userGuess}
                              onChange={(e) => setUserGuess(e.target.value)}
                              className={`w-full p-3 px-10 rounded-lg ${theme === "light"
                                ? "bg-white border border-violet-200 text-violet-900 placeholder-violet-400"
                                : "bg-gray-800 border border-violet-700 text-violet-100 placeholder-violet-500"} text-center text-base shadow-inner focus:ring-2 focus:ring-violet-400 focus:outline-none transition-all`}
                              placeholder="Type your guess"
                              animate={wrongGuess ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                              transition={{ duration: 0.5 }}
                            />
                            <Keyboard size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
                          </div>
                        </div>

                        <div className="flex gap-2 w-full mb-4">
                          <motion.button
                            type="submit"
                            className={`w-full py-2.5 px-4 rounded-lg ${theme === "light"
                              ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
                              : "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"} text-sm font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Check size={16} />
                            Check
                          </motion.button>

                          <motion.button
                            type="button"
                            onClick={handleHintClick}
                            className={`py-2.5 px-4 rounded-lg ${showHint
                              ? theme === "light"
                                ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-white"
                                : "bg-gradient-to-r from-amber-700 to-yellow-700 text-white"
                              : theme === "light"
                                ? "bg-gradient-to-r from-amber-400 to-yellow-400 text-white"
                                : "bg-gradient-to-r from-amber-500 to-yellow-500 text-white"} text-sm font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <motion.div
                              animate={{
                                y: [0, -2, 0],
                                opacity: [1, 0.8, 1],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <Lightbulb size={16} />
                            </motion.div>
                            {showHint ? "Hide" : "Hint?"}
                          </motion.button>
                        </div>

                        {/* Hint Content - Only show when hint is toggled */}
                        <AnimatePresence>
                          {showHint && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className={`p-4 rounded-lg ${theme === "light"
                                ? "bg-amber-50 border border-amber-200"
                                : "bg-amber-950/20 border border-amber-900"}`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className={`w-5 h-5 ${theme === "light" ? "text-amber-500" : "text-amber-400"}`} />
                                <span className={`font-medium ${theme === "light" ? "text-amber-700" : "text-amber-300"}`}>
                                  Extra Hint
                                </span>
                              </div>
                              <p className={`text-sm ${theme === "light" ? "text-amber-800" : "text-amber-300"}`}>{hint}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </form>
                    ) : (
                      <AnimatePresence>
                        <motion.div
                          className="flex flex-col items-center"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.5,
                            type: "spring",
                            stiffness: 200
                          }}
                        >
                          <motion.div
                            className="flex items-center gap-2 mb-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <motion.div
                              animate={{
                                rotate: [0, 10, -10, 10, -10, 0],
                                scale: [1, 1.2, 1, 1.2, 1]
                              }}
                              transition={{ duration: 1.5 }}
                              className="text-3xl">🎉</motion.div>
                            <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
                              You got it!
                            </p>
                            <motion.div
                              animate={{
                                rotate: [0, -10, 10, -10, 10, 0],
                                scale: [1, 1.2, 1, 1.2, 1]
                              }}
                              transition={{ duration: 1.5 }}
                              className="text-3xl">🎉</motion.div>
                          </motion.div>

                          <motion.p
                            className="mb-4 text-base"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            The word was: <span className="font-bold">{currentWord}</span>
                          </motion.p>

                          <motion.button
                            onClick={handleNextWord}
                            className={`py-2.5 px-5 rounded-lg ${theme === "light"
                              ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
                              : "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"} text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                          >
                            <RefreshCw size={16} />
                            Next Word
                          </motion.button>
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar for desktop view - How to Play */}
        <div className={`hidden lg:block w-1/4 overflow-y-auto`}>
          <div className="p-4">
            {/* How to Play Panel with enhanced UI */}
            <div className={`w-full ${theme === "light"
                ? "bg-white/90 border border-violet-200"
                : "bg-gray-900/90 border border-violet-900"} backdrop-blur-md rounded-xl shadow-md p-4 mb-5 h-fit`}>
              <div className="flex items-center gap-2 mb-3">
                <Info className={`w-5 h-5 ${theme === "light" ? "text-blue-500" : "text-blue-400"}`} />
                <h2 className={`text-lg font-bold ${theme === "light" ? "text-violet-900" : "text-violet-300"}`}>
                  How to Play
                </h2>
              </div>
              <p className={`text-xs mb-3 ${theme === "light" ? "text-violet-700" : "text-violet-400"}`}>
                Unscramble words and earn points
              </p>

              <div className="space-y-2.5">
                <motion.div
                  className={`flex items-center gap-3 p-3 rounded-lg ${theme === "light" ? "bg-violet-50 border border-violet-200" : "bg-violet-950/40 border border-violet-800"}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === "light" ? "bg-violet-200 text-violet-900" : "bg-violet-800 text-violet-200"}`}>
                    <Shuffle size={16} />
                  </div>
                  <div>
                    <p className={`font-medium text-sm ${theme === "light" ? "text-gray-900" : "text-gray-100"}`}>Unscramble</p>
                    <p className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>Figure out the original word from the jumbled letters.</p>
                  </div>
                </motion.div>

                <motion.div
                  className={`flex items-center gap-3 p-3 rounded-lg ${theme === "light" ? "bg-violet-50 border border-violet-200" : "bg-violet-950/40 border border-violet-800"}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === "light" ? "bg-violet-200 text-violet-900" : "bg-violet-800 text-violet-200"}`}>
                    <Keyboard size={16} />
                  </div>
                  <div>
                    <p className={`font-medium text-sm ${theme === "light" ? "text-gray-900" : "text-gray-100"}`}>Type Answer</p>
                    <p className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>Enter your guess and click "Check".</p>
                  </div>
                </motion.div>

                <motion.div
                  className={`flex items-center gap-3 p-3 rounded-lg ${theme === "light" ? "bg-violet-50 border border-violet-200" : "bg-violet-950/40 border border-violet-800"}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === "light" ? "bg-violet-200 text-violet-900" : "bg-violet-800 text-violet-200"}`}>
                    <Lightbulb size={16} />
                  </div>
                  <div>
                    <p className={`font-medium text-sm ${theme === "light" ? "text-gray-900" : "text-gray-100"}`}>Use Hints</p>
                    <p className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>Get clues when you're stuck.</p>
                  </div>
                </motion.div>

                <motion.div
                  className={`flex items-center gap-3 p-3 rounded-lg ${theme === "light" ? "bg-violet-50 border border-violet-200" : "bg-violet-950/40 border border-violet-800"}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === "light" ? "bg-violet-200 text-violet-900" : "bg-violet-800 text-violet-200"}`}>
                    <Award size={16} />
                  </div>
                  <div>
                    <p className={`font-medium text-sm ${theme === "light" ? "text-gray-900" : "text-gray-100"}`}>Score points</p>
                    <p className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>Earn 10 points for each correct answer.</p>
                  </div>
                </motion.div>

                <motion.div
                  className={`flex items-center gap-3 p-3 rounded-lg ${theme === "light" ? "bg-violet-50 border border-violet-200" : "bg-violet-950/40 border border-violet-800"}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === "light" ? "bg-violet-200 text-violet-900" : "bg-violet-800 text-violet-200"}`}>
                    <Target size={16} />
                  </div>
                  <div>
                    <p className={`font-medium text-sm ${theme === "light" ? "text-gray-900" : "text-gray-100"}`}>Have Fun!</p>
                    <p className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>Challenge yourself and improve your vocabulary.</p>
                  </div>
                </motion.div>
              </div>

              <div className="mt-4">
                <div className={`p-3 rounded-lg ${theme === "light" ? "bg-violet-50 text-violet-800 border border-violet-200" : "bg-violet-950/30 text-violet-300 border border-violet-800"}`}>
                  <p className="text-center text-xs flex items-center gap-1 justify-center">
                    <Brain size={14} />
                    <span className="font-semibold italic">
                      "Word puzzles improve cognitive skills!"
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Instructions Modal */}
        <AnimatePresence>
          {showInstructionsModal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInstructionsModal(false)}
            >
              <motion.div
                className={`${glassCardDarker} rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto`}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Info size={24} className="text-blue-500" />
                    How to Play
                  </h2>

                  <button
                    onClick={() => setShowInstructionsModal(false)}
                    className="text-2xl"
                  >
                    &times;
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`p-3 rounded-xl ${instructionCard} flex gap-3 items-center`}
                  >
                    <Shuffle size={22} className="text-purple-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">1. Unscramble the word</p>
                      <p className="text-sm">Figure out the original word from jumbled letters.</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`p-3 rounded-xl ${instructionCard} flex gap-3 items-center`}
                  >
                    <Keyboard size={22} className="text-indigo-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">2. Type your answer</p>
                      <p className="text-sm">Enter your guess and click "Check".</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`p-3 rounded-xl ${instructionCard} flex gap-3 items-center`}
                  >
                    <Lightbulb size={22} className="text-yellow-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">3. Use hints if needed</p>
                      <p className="text-sm">Get a hint showing the first letter and word length.</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={`p-3 rounded-xl ${instructionCard} flex gap-3 items-center`}
                  >
                    <Award size={22} className="text-emerald-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">4. Score points</p>
                      <p className="text-sm">Earn 10 points for each correct answer.</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className={`p-3 rounded-xl ${instructionCard} flex gap-3 items-center`}
                  >
                    <Target size={22} className="text-pink-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">5. Have fun!</p>
                      <p className="text-sm">Challenge yourself and improve your vocabulary.</p>
                    </div>
                  </motion.div>
                </div>

                <motion.button
                  onClick={() => setShowInstructionsModal(false)}
                  className={`w-full py-3 px-6 rounded-lg ${buttonPrimary} font-medium flex items-center justify-center gap-2`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Check size={20} />
                  Got it!
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leaderboard Modal */}
        <AnimatePresence>
          {showLeaderboard && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLeaderboard(false)}
            >
              <motion.div
                className={`${glassCardDarker} rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto`}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Crown size={24} className="text-yellow-500" />
                    Leaderboard
                  </h2>

                  <button
                    onClick={() => setShowLeaderboard(false)}
                    className="text-2xl"
                  >
                    &times;
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  {/* Your current ranking */}
                  <div className={`p-4 rounded-xl ${theme === "light" ? "bg-indigo-100" : "bg-indigo-900/30"} border ${theme === "light" ? "border-indigo-200" : "border-indigo-700"}`}>
                    <p className="text-sm text-center mb-2">Your Current Ranking</p>
                    <div className="flex items-center justify-center gap-3">
                      <Medal size={24} className="text-indigo-500" />
                      <p className="text-xl font-bold">{
                        leaderboard.findIndex(player => player.score < score) + 1 || leaderboard.length + 1
                      }</p>
                    </div>
                  </div>

                  {/* Leaderboard list */}
                  <div className={`rounded-xl overflow-hidden ${theme === "light" ? "bg-white/80" : "bg-black/40"} border ${theme === "light" ? "border-gray-100" : "border-gray-700"}`}>
                    <div className="grid grid-cols-4 text-sm font-medium p-3 border-b border-gray-200">
                      <div>Rank</div>
                      <div className="col-span-2">Player</div>
                      <div className="text-right">Score</div>
                    </div>

                    {leaderboard.map((player, index) => (
                      <div
                        key={index}
                        className={`grid grid-cols-4 p-3 text-sm ${player.name === playerName ?
                          theme === "light" ? "bg-indigo-50" : "bg-indigo-900/20" :
                          index % 2 === 0 ?
                            theme === "light" ? "bg-gray-50" : "bg-gray-800/20" : ""
                          } ${index !== leaderboard.length - 1 ? "border-b border-gray-200" : ""}`}
                      >
                        <div className="flex items-center">
                          {player.rank <= 3 ? (
                            <Crown size={16} className={
                              player.rank === 1 ? "text-yellow-500" :
                                player.rank === 2 ? "text-gray-400" : "text-amber-700"
                            } />
                          ) : (
                            player.rank
                          )}
                        </div>
                        <div className="col-span-2 font-medium">{player.name}</div>
                        <div className="text-right">{player.score}</div>
                      </div>
                    ))}

                    {/* Add player to leaderboard */}
                    {score > 0 && !leaderboard.find(p => p.name === playerName) && (
                      <div className={`grid grid-cols-4 p-3 text-sm ${theme === "light" ? "bg-indigo-50" : "bg-indigo-900/20"} border-t border-indigo-200`}>
                        <div>{leaderboard.findIndex(player => player.score < score) + 1 || leaderboard.length + 1}</div>
                        <div className="col-span-2 font-medium">{playerName} (You)</div>
                        <div className="text-right">{score}</div>
                      </div>
                    )}
                  </div>
                </div>

                <motion.button
                  onClick={() => setShowLeaderboard(false)}
                  className={`w-full py-3 px-6 rounded-lg ${buttonPrimary} font-medium flex items-center justify-center gap-2`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Check size={20} />
                  Close
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Over Modal */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className={`${glassCardDarker} rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden`}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {/* Decorative elements */}
                <div className="absolute w-32 h-32 rounded-full bg-red-400/20 blur-2xl -top-16 -left-16"></div>
                <div className="absolute w-32 h-32 rounded-full bg-blue-400/20 blur-2xl -bottom-16 -right-16"></div>

                <motion.div
                  className="text-center mb-8"
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="flex justify-center mb-4"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <Clock className="w-16 h-16 text-red-500" />
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600">
                    Time's Up!
                  </h2>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    Great effort! Here's how you did:
                  </p>
                </motion.div>

                <div className="space-y-4 mb-8">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`p-4 rounded-xl ${theme === "light"
                      ? "bg-violet-50 border border-violet-200"
                      : "bg-violet-950/30 border border-violet-800"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <span className="font-medium">Final Score</span>
                      </div>
                      <span className="text-xl font-bold">{finalScore}</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className={`p-4 rounded-xl ${theme === "light"
                      ? "bg-violet-50 border border-violet-200"
                      : "bg-violet-950/30 border border-violet-800"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="font-medium">Words Completed</span>
                      </div>
                      <span className="text-xl font-bold">{wordsCompleted}</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className={`p-4 rounded-xl ${theme === "light"
                      ? "bg-violet-50 border border-violet-200"
                      : "bg-violet-950/30 border border-violet-800"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">Difficulty</span>
                      </div>
                      <span className="text-xl font-bold capitalize">{difficulty}</span>
                    </div>
                  </motion.div>
                </div>

                <div className="flex flex-col gap-3">
                  <motion.button
                    onClick={handleRestart}
                    className={`w-full py-3 px-6 rounded-xl ${buttonPrimary} font-medium flex items-center justify-center gap-2`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <RefreshCw size={20} />
                    Play Again
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
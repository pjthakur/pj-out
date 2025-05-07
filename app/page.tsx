"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import {
    Sun,
    Moon,
    Lightbulb,
    Trophy,
    Search,
    Clock,
    Gamepad2,
    Check,
    ArrowLeft,
    HelpCircle,
    RefreshCw,
    Sparkles,
    BookOpen,
    Brain,
    Hash,
    Compass,
    AlignJustify,
    Menu
} from "lucide-react"

// Define types
type Difficulty = "easy" | "medium" | "hard"
type GameMode = "regular" | "daily"
type Direction = "right" | "down"

interface Cell {
    row: number
    col: number
}

interface Clue {
    id: number
    clue: string
    answer: string
    x: number
    y: number
    direction: Direction
}

interface Word {
    id: number
    word: string
    x: number
    y: number
    direction: Direction
}

interface HighlightedWord {
    wordId: number
    cells: Cell[]
}

interface VictoryScreenProps {
    onRestart: () => void
    difficulty: Difficulty
    foundWords: number
    solvedClues: number
    totalWords: number
    totalClues: number
}

interface LeaderboardModalProps {
    onClose: () => void
    darkMode: boolean
}

const Header: React.FC<{ 
    darkMode: boolean,
    onLeaderboardClick: () => void,
    onHelpClick: () => void
}> = ({ darkMode, onLeaderboardClick, onHelpClick }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    
    return (
        <div className={`w-full ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-1">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-teal-400 flex items-center justify-center shadow-lg">
                            <Hash className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-teal-400 bg-clip-text text-transparent">
                                Word<span className="font-light">Craft</span>
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Puzzle Your Way</p>
                        </div>
                    </div>
                    
                    <div className="hidden md:flex items-center space-x-6">
                        <NavLink icon={<BookOpen className="h-4 w-4 mr-1" />} label="Play" active />
                        <NavLink 
                            icon={<Trophy className="h-4 w-4 mr-1" />} 
                            label="Leaderboard" 
                            onLeaderboardClick={onLeaderboardClick}
                        />
                        <NavLink 
                            icon={<Brain className="h-4 w-4 mr-1" />} 
                            label="How to Play" 
                            onHelpClick={onHelpClick}
                        />
                    </div>
                    
                    <div className="md:hidden">
                        <button 
                            onClick={() => setMenuOpen(!menuOpen)}
                            className={`p-2 rounded-lg ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                
                {/* Mobile Navigation */}
                {menuOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden py-2 space-y-2 mt-2 border-t border-gray-200 dark:border-gray-700"
                    >
                        <MobileNavLink icon={<BookOpen className="h-4 w-4 mr-2" />} label="Play" active />
                        <MobileNavLink 
                            icon={<Trophy className="h-4 w-4 mr-2" />} 
                            label="Leaderboard" 
                            onLeaderboardClick={onLeaderboardClick}
                            onMenuClose={() => setMenuOpen(false)}
                        />
                        <MobileNavLink 
                            icon={<Brain className="h-4 w-4 mr-2" />} 
                            label="How to Play" 
                            onHelpClick={onHelpClick}
                            onMenuClose={() => setMenuOpen(false)}
                        />
                    </motion.div>
                )}
            </div>
        </div>
    )
}

// Navigation link component
const NavLink: React.FC<{ 
    icon: React.ReactNode, 
    label: string, 
    active?: boolean,
    onLeaderboardClick?: () => void,
    onHelpClick?: () => void
}> = ({ icon, label, active, onLeaderboardClick, onHelpClick }) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        if (label === "Leaderboard" && onLeaderboardClick) {
            onLeaderboardClick()
        } else if (label === "How to Play" && onHelpClick) {
            onHelpClick()
        }
    }

    return (
        <a 
            href="#" 
            onClick={handleClick}
            className={`flex items-center text-sm font-medium hover:text-violet-500 transition duration-200 ${
                active 
                ? "text-violet-500 dark:text-violet-400" 
                : "text-gray-600 dark:text-gray-300"
            }`}
        >
            {icon}
            {label}
        </a>
    )
}

// Mobile Navigation link
const MobileNavLink: React.FC<{ 
    icon: React.ReactNode, 
    label: string, 
    active?: boolean,
    onLeaderboardClick?: () => void,
    onHelpClick?: () => void,
    onMenuClose?: () => void
}> = ({ icon, label, active, onLeaderboardClick, onHelpClick, onMenuClose }) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        if (label === "Leaderboard") {
            onLeaderboardClick?.()
            onMenuClose?.()
        } else if (label === "How to Play") {
            onHelpClick?.()
            onMenuClose?.()
        }
    }

    return (
        <a 
            href="#" 
            onClick={handleClick}
            className={`flex items-center py-2 px-1 text-sm font-medium ${
                active 
                ? "text-violet-500 dark:text-violet-400" 
                : "text-gray-600 dark:text-gray-300"
            }`}
        >
            {icon}
            {label}
        </a>
    )
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({
    onRestart,
    difficulty,
    foundWords,
    solvedClues,
    totalWords,
    totalClues,
}) => {
    const [score, setScore] = useState(0)

    useEffect(() => {
        const baseScore = difficulty === "easy" ? 100 : difficulty === "medium" ? 200 : 300
        const completionScore = (foundWords + solvedClues) * 50
        setScore(baseScore + completionScore)

        const launchConfetti = () => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            })
        }

        launchConfetti()

        const timer1 = setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
            })
        }, 300)

        const timer2 = setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
            })
        }, 600)

        return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
        }
    }, [difficulty, foundWords, solvedClues, totalWords, totalClues])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-8 text-center w-full max-w-md mx-auto shadow-2xl overflow-y-auto max-h-[90vh]"
            >
                <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-2"
                >
                    <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-400 mx-auto" />
                </motion.div>

                <motion.h2
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-violet-500 to-teal-400 bg-clip-text text-transparent"
                >
                    Puzzle Mastered!
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-600 dark:text-gray-300 mb-6"
                >
                    Your wordcraft skills are impressive!
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6"
                >
                    <div className="text-3xl font-bold mb-2 text-violet-600 dark:text-violet-400">{score}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">POINTS</div>

                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                        <div className="text-left">
                            <div className="text-gray-500 dark:text-gray-400">Words Found</div>
                            <div className="font-medium">
                                {foundWords}/{totalWords}
                            </div>
                        </div>
                        <div className="text-left">
                            <div className="text-gray-500 dark:text-gray-400">Clues Solved</div>
                            <div className="font-medium">
                                {solvedClues}/{totalClues}
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="flex flex-col space-y-3">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onRestart}
                        className="bg-gradient-to-r from-violet-500 to-teal-400 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Play Again
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onRestart}
                        className="bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-lg"
                    >
                        Back to Menu
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    )
}

const HelpModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 w-full max-w-md mx-auto shadow-xl max-h-[80vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">How to Play</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <div>
                        <h3 className="font-medium text-lg mb-2 text-violet-600 dark:text-violet-400">Game Objective</h3>
                        <p>Solve all clues and find all hidden words in the grid to complete the puzzle.</p>
                    </div>

                    <div>
                        <h3 className="font-medium text-lg mb-2 text-violet-600 dark:text-violet-400">Solving Clues</h3>
                        <p>
                            Read each clue and type your answer in the input field. If correct, the word will be highlighted in the
                            grid.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-medium text-lg mb-2 text-violet-600 dark:text-violet-400">Finding Hidden Words</h3>
                        <p>Hidden words are placed in the grid. Click the "Find" button to reveal them when you spot one.</p>
                    </div>

                    <div>
                        <h3 className="font-medium text-lg mb-2 text-violet-600 dark:text-violet-400">Using Hints</h3>
                        <p>If you're stuck, click the "Get a Hint" button for help with a random clue or hidden word.</p>
                    </div>

                    <div>
                        <h3 className="font-medium text-lg mb-2 text-violet-600 dark:text-violet-400">Difficulty Levels</h3>
                        <p>Choose from Easy, Medium, or Hard difficulty levels. Higher difficulties have more words and clues.</p>
                    </div>

                    <div>
                        <h3 className="font-medium text-lg mb-2 text-violet-600 dark:text-violet-400">Daily Challenge</h3>
                        <p>Play a special daily puzzle that changes every day for an extra challenge!</p>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-6 bg-violet-500 hover:bg-violet-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    Got it!
                </button>
            </motion.div>
        </motion.div>
    )
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose, darkMode }) => {
    // Mock data for top players
    const topPlayers = [
        { name: "Alex", score: 1250, rank: 1 },
        { name: "Sarah", score: 1100, rank: 2 },
        { name: "Mike", score: 950, rank: 3 }
    ]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-auto shadow-xl`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-amber-400" />
                        Leaderboard
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    {topPlayers.map((player) => (
                        <motion.div
                            key={player.rank}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: player.rank * 0.1 }}
                            className={`p-4 rounded-lg flex items-center justify-between ${
                                darkMode ? "bg-gray-700" : "bg-gray-50"
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                    player.rank === 1 
                                        ? "bg-amber-400 text-gray-900" 
                                        : player.rank === 2 
                                        ? "bg-gray-300 text-gray-700" 
                                        : "bg-amber-700 text-white"
                                }`}>
                                    {player.rank}
                                </div>
                                <span className="font-medium">{player.name}</span>
                            </div>
                            <div className="text-lg font-bold text-violet-500 dark:text-violet-400">
                                {player.score}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Play more to climb the ranks!
                </div>
            </motion.div>
        </motion.div>
    )
}

const size = 10
const difficultyLevels: Difficulty[] = ["easy", "medium", "hard"]
const modes: GameMode[] = ["regular", "daily"]

function WordcraftGame() {
    const [loading, setLoading] = useState<boolean>(true)
    const [showWelcome, setShowWelcome] = useState<boolean>(true)
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null)
    const [gameMode, setGameMode] = useState<GameMode>("regular")
    const [activeTab, setActiveTab] = useState<GameMode>("regular")

    const [grid, setGrid] = useState<string[][]>([])
    const [clues, setClues] = useState<Clue[]>([])
    const [hiddenWords, setHiddenWords] = useState<Word[]>([])
    const [difficulty, setDifficulty] = useState<Difficulty>("easy")
    const [hint, setHint] = useState<string | null>(null)
    const [darkMode, setDarkMode] = useState<boolean>(false)
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null)
    const [foundWords, setFoundWords] = useState<number[]>([])
    const [solvedClues, setSolvedClues] = useState<number[]>([])
    const [gameStarted, setGameStarted] = useState<boolean>(false)
    const [highlightedWord, setHighlightedWord] = useState<HighlightedWord | null>(null)
    const [clueInputs, setClueInputs] = useState<{ [key: number]: string }>({})
    const [activeSection, setActiveSection] = useState<"clues" | "words" | "grid">("grid")
    const [showVictory, setShowVictory] = useState<boolean>(false)
    const [showHelp, setShowHelp] = useState<boolean>(false)
    const [hintUsed, setHintUsed] = useState<number>(0)
    const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false)

    const gridRef = useRef<HTMLDivElement>(null)
    const isMobile = useRef<boolean>(false)

    useEffect(() => {
        // Check if mobile
        isMobile.current = window.innerWidth < 768

        // Listen for resize events
        const handleResize = () => {
            isMobile.current = window.innerWidth < 768
        }

        window.addEventListener("resize", handleResize)

        // Simulate loading
        setTimeout(() => {
            setLoading(false)
        }, 1500)

        // Check for saved dark mode preference
        const savedMode = localStorage.getItem("wordcraftDarkMode")
        if (savedMode) {
            setDarkMode(savedMode === "true")
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
            setDarkMode(prefersDark)
        }

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    useEffect(() => {
        if (selectedDifficulty && !gameStarted) {
            setDifficulty(selectedDifficulty)
            setGameStarted(true)
            setShowWelcome(false)
        }
    }, [selectedDifficulty, gameStarted])

    useEffect(() => {
        localStorage.setItem("wordcraftDarkMode", darkMode.toString())
        document.body.classList.toggle("dark", darkMode)
        document.documentElement.classList.toggle("dark", darkMode)
        document.body.style.transition = "background-color 0.3s ease-in-out"
        return () => {
            document.body.style.transition = ""
        }
    }, [darkMode])

    const generateGameData = (difficultyLevel: Difficulty) => {
        // Initialize a properly sized grid
        const newGrid: string[][] = Array(size)
            .fill(null)
            .map(() => Array(size).fill(""))

        let newClues: Clue[] = []
        let newHiddenWords: Word[] = []

        if (difficultyLevel === "easy") {
            newClues = [
                { id: 1, clue: "Flower", answer: "ROSE", x: 1, y: 1, direction: "right" },
                { id: 2, clue: "Feline pet", answer: "CAT", x: 3, y: 3, direction: "down" },
                { id: 3, clue: "Fruit", answer: "APPLE", x: 5, y: 0, direction: "down" },
            ]

            newHiddenWords = [
                { id: 1, word: "TRAIN", x: 0, y: 0, direction: "right" },
                { id: 2, word: "BOOK", x: 7, y: 2, direction: "down" },
            ]
        } else if (difficultyLevel === "medium") {
            newClues = [
                { id: 1, clue: "Capital of France", answer: "PARIS", x: 2, y: 2, direction: "right" },
                { id: 2, clue: "Computer language", answer: "PYTHON", x: 0, y: 5, direction: "right" },
                { id: 3, clue: "Planet", answer: "MARS", x: 4, y: 1, direction: "down" },
                { id: 4, clue: "Musical instrument", answer: "PIANO", x: 7, y: 4, direction: "down" },
            ]

            newHiddenWords = [
                { id: 1, word: "COFFEE", x: 1, y: 8, direction: "right" },
                { id: 2, word: "STAR", x: 5, y: 6, direction: "down" },
                { id: 3, word: "JUNGLE", x: 3, y: 0, direction: "down" },
            ]
        } else if (difficultyLevel === "hard") {
            newClues = [
                { id: 1, clue: "Mathematical constant", answer: "PI", x: 1, y: 1, direction: "right" },
                { id: 2, clue: "Constellation", answer: "ORION", x: 3, y: 0, direction: "down" },
                { id: 3, clue: "Chemical element", answer: "CARBON", x: 5, y: 5, direction: "right" },
                { id: 4, clue: "Ancient civilization", answer: "MAYAN", x: 0, y: 6, direction: "right" },
                { id: 5, clue: "Programming concept", answer: "LOOP", x: 8, y: 2, direction: "down" },
            ]

            newHiddenWords = [
                { id: 1, word: "QUANTUM", x: 2, y: 3, direction: "right" },
                { id: 2, word: "GALAXY", x: 4, y: 7, direction: "right" },
                { id: 3, word: "PYRAMID", x: 0, y: 0, direction: "down" },
                { id: 4, word: "ECLIPSE", x: 9, y: 0, direction: "down" },
            ]
        }

        // Generate a random grid with letters
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                newGrid[i][j] = String.fromCharCode(Math.floor(Math.random() * 26) + 65)
            }
        }

        // Place clues in the grid with proper bounds checking
        newClues.forEach((clue) => {
            for (let i = 0; i < clue.answer.length; i++) {
                if (clue.direction === "right" && clue.x >= 0 && clue.x < size && clue.y + i >= 0 && clue.y + i < size) {
                    newGrid[clue.x][clue.y + i] = clue.answer[i]
                } else if (clue.direction === "down" && clue.x + i >= 0 && clue.x + i < size && clue.y >= 0 && clue.y < size) {
                    newGrid[clue.x + i][clue.y] = clue.answer[i]
                }
            }
        })

        // Place hidden words in the grid with proper bounds checking
        newHiddenWords.forEach((word) => {
            for (let i = 0; i < word.word.length; i++) {
                if (word.direction === "right" && word.x >= 0 && word.x < size && word.y + i >= 0 && word.y + i < size) {
                    newGrid[word.x][word.y + i] = word.word[i]
                } else if (word.direction === "down" && word.x + i >= 0 && word.x + i < size && word.y >= 0 && word.y < size) {
                    newGrid[word.x + i][word.y] = word.word[i]
                }
            }
        })

        setGrid(newGrid)
        setClues(newClues)
        setHiddenWords(newHiddenWords)
        setFoundWords([])
        setSolvedClues([])
        setClueInputs({})
        setHint(null)
        setHintUsed(0)
        setActiveSection("grid")

        // Create daily challenge if needed
        if (gameMode === "daily") {
            const today = new Date().toISOString().split("T")[0]

            const dailyWords: Word[] = [
                { id: 100, word: "DAILY", x: 0, y: 4, direction: "right" },
                { id: 101, word: "CHALLENGE", x: 2, y: 0, direction: "down" },
                { id: 102, word: "PUZZLE", x: 4, y: 5, direction: "right" },
            ]

            const dailyClues: Clue[] = [
                { id: 100, clue: "Today's special", answer: "DAILY", x: 0, y: 4, direction: "right" },
                { id: 101, clue: "Test of skill", answer: "CHALLENGE", x: 2, y: 0, direction: "down" },
                { id: 102, clue: "Brain game", answer: "PUZZLE", x: 4, y: 5, direction: "right" },
            ]

            dailyWords.forEach((word) => {
                for (let i = 0; i < word.word.length; i++) {
                    if (word.direction === "right" && word.x >= 0 && word.x < size && word.y + i >= 0 && word.y + i < size) {
                        newGrid[word.x][word.y + i] = word.word[i]
                    } else if (
                        word.direction === "down" &&
                        word.x + i >= 0 &&
                        word.x + i < size &&
                        word.y >= 0 &&
                        word.y < size
                    ) {
                        newGrid[word.x + i][word.y] = word.word[i]
                    }
                }
            })

            // Make sure the grid is fully updated with the daily challenge words
            setGrid([...newGrid])

            // Add daily challenge special words and clues
            setHiddenWords([...newHiddenWords, ...dailyWords])
            setClues([...newClues, ...dailyClues])
        }
    }

    useEffect(() => {
        if (gameStarted) {
            generateGameData(difficulty)
        }
    }, [difficulty, gameStarted, gameMode])

    useEffect(() => {
        if (
            gameStarted &&
            clues.length > 0 &&
            hiddenWords.length > 0 &&
            solvedClues.length === clues.length &&
            foundWords.length === hiddenWords.length
        ) {
            // Show victory screen with a slight delay
            setTimeout(() => {
                setShowVictory(true)
            }, 800)
        }
    }, [solvedClues, foundWords, clues.length, hiddenWords.length, gameStarted])

    const handleGameRestart = () => {
        setShowVictory(false)
        setSelectedDifficulty(null)
        setGameStarted(false)
        setShowWelcome(true)
        setFoundWords([])
        setSolvedClues([])
        setClueInputs({})
        setHint(null)
        setHintUsed(0)
    }

    const handleClueInput = (clueId: number, value: string) => {
        const newClueInputs = { ...clueInputs, [clueId]: value.toUpperCase() }
        setClueInputs(newClueInputs)

        const clue = clues.find((c) => c.id === clueId)
        if (clue && value.toUpperCase() === clue.answer) {
            handleClueCheck(clueId, value.toUpperCase())
        }
    }

    const handleClueCheck = (clueId: number, inputAnswer: string) => {
        const clueIndex = clues.findIndex((clue) => clue.id === clueId)

        if (clueIndex === -1 || solvedClues.includes(clueId)) return

        const clue = clues[clueIndex]

        if (inputAnswer.toUpperCase() === clue.answer) {
            setSolvedClues([...solvedClues, clueId])

            // Highlight the word in the grid
            const highlightCells: Cell[] = []
            for (let i = 0; i < clue.answer.length; i++) {
                if (clue.direction === "right") {
                    highlightCells.push({ row: clue.x, col: clue.y + i })
                } else if (clue.direction === "down") {
                    highlightCells.push({ row: clue.x + i, col: clue.y })
                }
            }

            setHighlightedWord({ wordId: clueId, cells: highlightCells })

            // Small confetti burst for solving a clue
            confetti({
                particleCount: 30,
                spread: 50,
                origin: { y: 0.7 },
            })

            setTimeout(() => {
                setHighlightedWord(null)
            }, 2000)
        }
    }

    const handleHiddenWordFind = (wordId: number) => {
        if (foundWords.includes(wordId)) return

        const wordIndex = hiddenWords.findIndex((word) => word.id === wordId)
        if (wordIndex === -1) return

        const word = hiddenWords[wordIndex]

        // Create cells to highlight
        const highlightCells: Cell[] = []
        for (let i = 0; i < word.word.length; i++) {
            if (word.direction === "right") {
                highlightCells.push({ row: word.x, col: word.y + i })
            } else if (word.direction === "down") {
                highlightCells.push({ row: word.x + i, col: word.y })
            }
        }

        // Highlight the word
        setHighlightedWord({ wordId: word.id, cells: highlightCells })
        setFoundWords([...foundWords, wordId])

        // Small confetti burst for finding a word
        confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.7 },
        })

        // Scroll to the grid if not visible
        if (gridRef.current && activeSection !== "grid") {
            gridRef.current.scrollIntoView({ behavior: "smooth" })
            setActiveSection("grid")
        }

        setTimeout(() => {
            setHighlightedWord(null)
        }, 2000)
    }

    const handleHint = () => {
        setHintUsed(hintUsed + 1)

        const unsolvedClues = clues.filter((clue) => !solvedClues.includes(clue.id))
        const unsolvedWords = hiddenWords.filter((word) => !foundWords.includes(word.id))

        if (unsolvedClues.length > 0) {
            const randomClue = unsolvedClues[Math.floor(Math.random() * unsolvedClues.length)]

            // Generate a more helpful hint
            let hintText = `For "${randomClue.clue}": `

            // Add the first letter as a hint
            hintText += `Starts with "${randomClue.answer[0]}"`

            // Add location hint
            if (randomClue.direction === "right") {
                hintText += ` and reads from left to right`
            } else {
                hintText += ` and reads downward`
            }

            setHint(hintText)

            // Scroll to the specific clue
            const clueElement = document.getElementById(`clue-${randomClue.id}`)
            if (clueElement) {
                clueElement.scrollIntoView({ behavior: "smooth" })
                setActiveSection("clues")
            }
        } else if (unsolvedWords.length > 0) {
            const randomWord = unsolvedWords[Math.floor(Math.random() * unsolvedWords.length)]

            // Generate a more helpful hint
            let hintText = `Look for "${randomWord.word}": `

            // Add specific location information
            if (randomWord.direction === "right") {
                hintText += `It reads from left to right starting at row ${randomWord.x + 1}`
            } else {
                hintText += `It reads downward starting at row ${randomWord.x + 1}`
            }

            setHint(hintText)

            // Highlight the first letter of the hidden word
            setSelectedCell({ row: randomWord.x, col: randomWord.y })

            // Scroll to hidden words section
            setActiveSection("words")
        } else {
            setHint("Great job! You've solved all clues and found all hidden words!")

            confetti({
                particleCount: 200,
                spread: 160,
                origin: { y: 0.6 },
            })
        }
    }

    const handleCellClick = (rowIndex: number, columnIndex: number) => {
        setSelectedCell({ row: rowIndex, col: columnIndex })

        const cellInfo: string[] = []

        clues.forEach((clue) => {
            let isPartOfClue = false

            if (clue.direction === "right" && clue.x === rowIndex) {
                if (columnIndex >= clue.y && columnIndex < clue.y + clue.answer.length) {
                    isPartOfClue = true
                }
            } else if (clue.direction === "down" && clue.y === columnIndex) {
                if (rowIndex >= clue.x && rowIndex < clue.x + clue.answer.length) {
                    isPartOfClue = true
                }
            }

            if (isPartOfClue && !cellInfo.includes(`Clue: ${clue.clue}`)) {
                cellInfo.push(`Clue: ${clue.clue}`)

                if (!solvedClues.includes(clue.id)) {
                    const clueElement = document.getElementById(`clue-${clue.id}`)
                    if (clueElement) {
                        setTimeout(() => {
                            clueElement.scrollIntoView({ behavior: "smooth" })
                            setActiveSection("clues")
                        }, 500)
                    }
                }
            }
        })

        hiddenWords.forEach((word) => {
            let isPartOfWord = false

            if (word.direction === "right" && word.x === rowIndex) {
                if (columnIndex >= word.y && columnIndex < word.y + word.word.length) {
                    isPartOfWord = true
                }
            } else if (word.direction === "down" && word.y === columnIndex) {
                if (rowIndex >= word.x && rowIndex < word.x + word.word.length) {
                    isPartOfWord = true
                }
            }

            if (isPartOfWord && !cellInfo.includes(`Word: ${word.word}`)) {
                cellInfo.push(`Word: ${word.word}`)

                if (!foundWords.includes(word.id)) {
                    const wordElement = document.getElementById(`word-${word.id}`)
                    if (wordElement) {
                        setTimeout(() => {
                            wordElement.scrollIntoView({ behavior: "smooth" })
                            setActiveSection("words")
                        }, 500)
                    }
                }
            }
        })
    }

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
    }

    const startGame = (diffLevel: Difficulty) => {
        setSelectedDifficulty(diffLevel)
    }

    const toggleGameMode = (mode: GameMode) => {
        setGameMode(mode)
        setActiveTab(mode)
        setGameStarted(false)
        setShowWelcome(true)
    }

    const handleDifficultyChange = () => {
        setSelectedDifficulty(null)
        setGameStarted(false)
        setShowWelcome(true)
    }

    const renderTabContent = () => {
        switch (activeSection) {
            case "grid":
                return (
                    <div ref={gridRef} className="aspect-square bg-opacity-10 rounded-lg overflow-hidden mb-4">
                        <div className="grid grid-cols-10 w-full h-full">
                            {grid.map((row, rowIndex) =>
                                row.map((cell, columnIndex) => {
                                    const isHighlighted = highlightedWord?.cells.some((c) => c.row === rowIndex && c.col === columnIndex)

                                    return (
                                        <motion.div
                                            key={rowIndex * size + columnIndex}
                                            initial={{ opacity: 0 }}
                                            animate={{
                                                opacity: 1,
                                                scale: isHighlighted
                                                    ? 1.1
                                                    : selectedCell && selectedCell.row === rowIndex && selectedCell.col === columnIndex
                                                        ? 1.05
                                                        : 1,
                                                backgroundColor: isHighlighted ? "#60a5fa" : undefined,
                                            }}
                                            transition={{
                                                duration: 0.2,
                                                delay: (rowIndex * size + columnIndex) * 0.001,
                                            }}
                                            className={`flex justify-center items-center aspect-square border text-sm md:text-base lg:text-lg font-bold cursor-pointer transition-all ${isHighlighted
                                                ? "bg-violet-500 text-white z-10"
                                                : selectedCell && selectedCell.row === rowIndex && selectedCell.col === columnIndex
                                                    ? "bg-teal-500 text-white z-10"
                                                    : darkMode
                                                        ? "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                                                        : "bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300"
                                                }`}
                                            onClick={() => handleCellClick(rowIndex, columnIndex)}
                                        >
                                            {cell}
                                        </motion.div>
                                    )
                                }),
                            )}
                        </div>
                    </div>
                )
            case "clues":
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`p-4 sm:p-6 rounded-lg mb-6 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}
                    >
                        <h3 className="font-bold mb-4 text-xl flex items-center">
                            <span className="mr-2">Clues</span>
                            <span className="text-sm bg-violet-500 text-white px-2 py-0.5 rounded-full">
                                {solvedClues.length}/{clues.length}
                            </span>
                        </h3>
                        <div className="space-y-5">
                            {clues.map((clue) => (
                                <motion.div
                                    id={`clue-${clue.id}`}
                                    key={clue.id}
                                    className={`flex flex-col ${solvedClues.includes(clue.id) ? "opacity-60" : ""}`}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium">{clue.clue}:</span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{clue.answer.length} letters</span>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            value={solvedClues.includes(clue.id) ? clue.answer : clueInputs[clue.id] || ""}
                                            onChange={(e) => handleClueInput(clue.id, e.target.value)}
                                            placeholder={`${clue.answer.length} letters`}
                                            disabled={solvedClues.includes(clue.id)}
                                            className={`py-2 sm:py-3 px-2 sm:px-4 border rounded-lg focus:outline-none focus:ring-2 w-full uppercase text-center text-base sm:text-lg ${solvedClues.includes(clue.id)
                                                ? "bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-300"
                                                : darkMode
                                                    ? "bg-gray-800 border-gray-600 text-white focus:ring-violet-500"
                                                    : "bg-white border-gray-300 text-gray-900 focus:ring-violet-400"
                                                }`}
                                            maxLength={clue.answer.length}
                                        />
                                        {solvedClues.includes(clue.id) && (
                                            <span className="ml-2 text-green-500 dark:text-green-400 text-xl">
                                                <Check />
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )
            case "words":
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`p-4 sm:p-6 rounded-lg mb-6 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}
                    >
                        <h3 className="font-bold mb-4 text-xl flex items-center">
                            <span className="mr-2">Hidden Words</span>
                            <span className="text-sm bg-teal-500 text-white px-2 py-0.5 rounded-full">
                                {foundWords.length}/{hiddenWords.length}
                            </span>
                        </h3>
                        <div className="space-y-5">
                            {hiddenWords.map((word) => (
                                <motion.div
                                    id={`word-${word.id}`}
                                    key={word.id}
                                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${foundWords.includes(word.id) ? "opacity-60" : ""}`}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <span className="font-medium flex items-center">
                                        <Search className="mr-2 h-4 w-4" />
                                        Find "{word.word}":
                                    </span>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        disabled={foundWords.includes(word.id)}
                                        className={`py-2 px-5 rounded-lg transition-colors ${foundWords.includes(word.id)
                                            ? "bg-green-500 text-white dark:bg-green-600"
                                            : darkMode
                                                ? "bg-teal-600 hover:bg-teal-700 text-white"
                                                : "bg-teal-500 hover:bg-teal-600 text-white"
                                            }`}
                                        onClick={() => handleHiddenWordFind(word.id)}
                                    >
                                        {foundWords.includes(word.id) ? "Found!" : "Find"}
                                    </motion.button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )
            default:
                return null
        }
    }

    if (loading) {
        return (
            <div
                className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center p-6"
                >
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-violet-500 to-teal-400 bg-clip-text text-transparent">
                        WordCraft
                    </h1>
                    <p className="text-lg sm:text-xl mb-8 text-gray-600 dark:text-gray-300">Setting up your puzzle journey...</p>
                    <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto border-violet-500"></div>
                </motion.div>
            </div>
        )
    }

    if (showWelcome) {
        return (
            <div
                className={`min-h-screen flex flex-col items-center justify-center p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`w-full max-w-md rounded-2xl overflow-hidden shadow-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}
                >
                    <div className="p-4 sm:p-6">
                        <div className="flex justify-between items-center">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowHelp(true)}
                                className="rounded-full p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                aria-label="Help"
                            >
                                <HelpCircle className="h-5 w-5" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleDarkMode}
                                className={`rounded-full p-2 ${darkMode ? "bg-amber-400 text-gray-900" : "bg-violet-500 text-white"}`}
                                aria-label="Toggle dark mode"
                            >
                                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </motion.button>
                        </div>

                        <div className="text-center my-6 sm:my-8">
                            <motion.h1
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-500 to-teal-400 bg-clip-text text-transparent mb-4"
                            >
                                WordCraft
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-base sm:text-lg text-gray-600 dark:text-gray-300"
                            >
                                Where words come alive in puzzling adventures!
                            </motion.p>
                        </div>

                        <div className="mb-6 sm:mb-8">
                            <div className="flex border-b border-gray-200 dark:border-gray-700">
                                {modes.map((mode) => (
                                    <button
                                        key={mode}
                                        className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 font-medium transition-colors text-sm sm:text-base ${activeTab === mode
                                            ? `${darkMode ? "text-violet-400 border-b-2 border-violet-400" : "text-violet-600 border-b-2 border-violet-600"}`
                                            : `${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`
                                            }`}
                                        onClick={() => toggleGameMode(mode)}
                                    >
                                        {mode === "regular" ? (
                                            <span className="flex items-center justify-center">
                                                <Gamepad2 className="mr-1 sm:mr-2 h-4 w-4" /> Regular Game
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center">
                                                <Trophy className="mr-1 sm:mr-2 h-4 w-4" /> Daily Challenge
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6 sm:mb-8">
                            <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">
                                {gameMode === "daily" ? "Ready for today's challenge?" : "Choose difficulty level:"}
                            </h2>

                            <div className={gameMode === "daily" ? "" : "grid grid-cols-1 gap-4"}>
                                {gameMode === "daily" ? (
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-bold transition-all duration-200 transform bg-gradient-to-r from-violet-500 to-teal-400 text-white shadow-lg"
                                        onClick={() => startGame("medium")}
                                    >
                                        Start Daily Challenge
                                    </motion.button>
                                ) : (
                                    difficultyLevels.map((level) => (
                                        <motion.button
                                            key={level}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            className={`py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-bold transition-all duration-200 mb-3 shadow-md ${level === "easy"
                                                ? "bg-green-500 dark:bg-green-600"
                                                : level === "medium"
                                                    ? "bg-violet-500 dark:bg-violet-600"
                                                    : "bg-teal-500 dark:bg-teal-600"
                                                } text-white`}
                                            onClick={() => startGame(level)}
                                        >
                                            {level.charAt(0).toUpperCase() + level.slice(1)}
                                        </motion.button>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                            <p>Discover hidden words and unlock the mystery!</p>
                        </div>
                    </div>
                </motion.div>

                <AnimatePresence>{showHelp && <HelpModal onClose={() => setShowHelp(false)} />}</AnimatePresence>
            </div>
        )
    }

    return (
        <div
            className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} font-sans`}
        >
            <Header 
                darkMode={darkMode} 
                onLeaderboardClick={() => setShowLeaderboard(true)}
                onHelpClick={() => setShowHelp(true)}
            />

            <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`rounded-2xl overflow-hidden shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}
                >
                    <div className="p-3 sm:p-4 md:p-6">
                        <div className="relative overflow-hidden rounded-xl mb-6">
                            <div className={`absolute inset-0 opacity-20 ${darkMode ? "bg-violet-900" : "bg-violet-100"}`}>
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 to-teal-400/30"></div>
                            </div>
                            
                            <div className="relative p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center">
                                <div className="mb-4 sm:mb-0">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-1">
                                        {gameMode === "daily" ? (
                                            <span className="flex items-center">
                                                <Trophy className="mr-2 h-5 w-5 text-amber-400" /> Today's Special Challenge
                                            </span>
                                        ) : (
                                            <span>Puzzle Adventure</span>
                                        )}
                                    </h2>
                                    <p className="text-sm opacity-80">
                                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} mode • Find words and solve clues
                                    </p>
                                    
                                    <div className="flex mt-2 space-x-4">
                                        <div className="bg-violet-500/20 dark:bg-violet-500/30 rounded-lg px-3 py-1 text-center">
                                            <div className="text-sm font-medium text-violet-700 dark:text-violet-300">Clues</div>
                                            <div className="font-bold">{solvedClues.length}/{clues.length}</div>
                                        </div>
                                        
                                        <div className="bg-teal-500/20 dark:bg-teal-500/30 rounded-lg px-3 py-1 text-center">
                                            <div className="text-sm font-medium text-teal-700 dark:text-teal-300">Words</div>
                                            <div className="font-bold">{foundWords.length}/{hiddenWords.length}</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => {
                                            setGameStarted(false)
                                            setShowWelcome(true)
                                        }}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium ${darkMode ? "bg-violet-600 hover:bg-violet-700" : "bg-violet-500 hover:bg-violet-600"
                                            } text-white`}
                                    >
                                        New Game
                                    </button>

                                    <button
                                        onClick={handleDifficultyChange}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? "bg-teal-600 hover:bg-teal-700" : "bg-teal-500 hover:bg-teal-600"
                                            } text-white`}
                                    >
                                        Change Difficulty
                                    </button>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={toggleDarkMode}
                                        className={`rounded-full p-2 ${darkMode ? "bg-amber-400 text-gray-900" : "bg-violet-500 text-white"}`}
                                        aria-label="Toggle dark mode"
                                    >
                                        {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center mb-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`py-1.5 sm:py-2 px-3 sm:px-5 rounded-lg font-medium transition-all duration-200 flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${darkMode ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-amber-500 hover:bg-amber-600 text-white"
                                    } shadow-md`}
                                onClick={handleHint}
                            >
                                <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4" /> Get a Hint
                            </motion.button>
                        </div>

                        <AnimatePresence>
                            {hint && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`p-3 sm:p-4 rounded-lg border-l-4 border-amber-500 mb-4 text-sm sm:text-base ${darkMode ? "bg-amber-900/30" : "bg-amber-50"
                                        }`}
                                >
                                    <div className="flex items-start">
                                        <Lightbulb className="text-amber-500 mt-1 mr-2 flex-shrink-0 h-4 w-4 sm:h-5 sm:w-5" />
                                        <div>
                                            <span className="font-bold text-amber-500 mr-2">Hint:</span>
                                            <span>{hint}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="sm:hidden">
                            {/* Grid is always visible */}
                            <div ref={gridRef} className="aspect-square bg-opacity-10 rounded-lg overflow-hidden mb-4 shadow-md">
                                <div className="grid grid-cols-10 w-full h-full">
                                    {grid.map((row, rowIndex) =>
                                        row.map((cell, columnIndex) => {
                                            const isHighlighted = highlightedWord?.cells.some(
                                                (c) => c.row === rowIndex && c.col === columnIndex,
                                            )

                                            return (
                                                <motion.div
                                                    key={rowIndex * size + columnIndex}
                                                    initial={{ opacity: 0 }}
                                                    animate={{
                                                        opacity: 1,
                                                        scale: isHighlighted
                                                            ? 1.1
                                                            : selectedCell && selectedCell.row === rowIndex && selectedCell.col === columnIndex
                                                                ? 1.05
                                                                : 1,
                                                        backgroundColor: isHighlighted ? "#8b5cf6" : undefined,
                                                    }}
                                                    transition={{
                                                        duration: 0.2,
                                                        delay: (rowIndex * size + columnIndex) * 0.001,
                                                    }}
                                                    className={`flex justify-center items-center aspect-square border text-xs sm:text-sm font-bold cursor-pointer transition-all ${isHighlighted
                                                        ? "bg-violet-500 text-white z-10"
                                                        : selectedCell && selectedCell.row === rowIndex && selectedCell.col === columnIndex
                                                            ? "bg-teal-500 text-white z-10"
                                                            : darkMode
                                                                ? "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                                                                : "bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300"
                                                        }`}
                                                    onClick={() => handleCellClick(rowIndex, columnIndex)}
                                                >
                                                    {cell}
                                                </motion.div>
                                            )
                                        }),
                                    )}
                                </div>
                            </div>

                            {/* Tabs for Clues and Words */}
                            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex">
                                    <button
                                        onClick={() => setActiveSection("clues")}
                                        className={`flex-1 py-2 px-3 text-center text-sm ${activeSection === "clues"
                                            ? `font-medium ${darkMode ? "text-violet-400 border-b-2 border-violet-400" : "text-violet-600 border-b-2 border-violet-600"}`
                                            : `${darkMode ? "text-gray-400" : "text-gray-500"}`
                                            }`}
                                    >
                                        Clues{" "}
                                        <span className="text-xs bg-violet-500 text-white px-1.5 py-0.5 rounded-full">
                                            {solvedClues.length}/{clues.length}
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setActiveSection("words")}
                                        className={`flex-1 py-2 px-3 text-center text-sm ${activeSection === "words"
                                            ? `font-medium ${darkMode ? "text-teal-400 border-b-2 border-teal-400" : "text-teal-600 border-b-2 border-teal-600"}`
                                            : `${darkMode ? "text-gray-400" : "text-gray-500"}`
                                            }`}
                                    >
                                        Words{" "}
                                        <span className="text-xs bg-teal-500 text-white px-1.5 py-0.5 rounded-full">
                                            {foundWords.length}/{hiddenWords.length}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Content for selected tab */}
                            <div>
                                {activeSection === "clues" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`p-4 rounded-lg mb-6 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}
                                    >
                                        <div className="space-y-5">
                                            {clues.map((clue) => (
                                                <motion.div
                                                    id={`clue-${clue.id}`}
                                                    key={clue.id}
                                                    className={`flex flex-col ${solvedClues.includes(clue.id) ? "opacity-60" : ""}`}
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-medium text-sm">{clue.clue}:</span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {clue.answer.length} letters
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            type="text"
                                                            value={solvedClues.includes(clue.id) ? clue.answer : clueInputs[clue.id] || ""}
                                                            onChange={(e) => handleClueInput(clue.id, e.target.value)}
                                                            placeholder={`${clue.answer.length} letters`}
                                                            disabled={solvedClues.includes(clue.id)}
                                                            className={`py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 w-full uppercase text-center text-sm sm:text-base ${solvedClues.includes(clue.id)
                                                                ? "bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-300"
                                                                : darkMode
                                                                    ? "bg-gray-800 border-gray-600 text-white focus:ring-violet-500"
                                                                    : "bg-white border-gray-300 text-gray-900 focus:ring-violet-400"
                                                                }`}
                                                            maxLength={clue.answer.length}
                                                        />
                                                        {solvedClues.includes(clue.id) && (
                                                            <span className="ml-2 text-green-500 dark:text-green-400 text-xl">
                                                                <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                                                            </span>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                                {activeSection === "words" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`p-4 rounded-lg mb-6 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}
                                    >
                                        <div className="space-y-4">
                                            {hiddenWords.map((word) => (
                                                <motion.div
                                                    id={`word-${word.id}`}
                                                    key={word.id}
                                                    className={`flex flex-col sm:flex-row sm:items-center gap-2 justify-between ${foundWords.includes(word.id) ? "opacity-60" : ""}`}
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <span className="font-medium flex items-center text-sm">
                                                        <Search className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                                                        Find "{word.word}":
                                                    </span>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        disabled={foundWords.includes(word.id)}
                                                        className={`py-1.5 px-4 rounded-lg transition-colors text-sm ${foundWords.includes(word.id)
                                                            ? "bg-green-500 text-white dark:bg-green-600"
                                                            : darkMode
                                                                ? "bg-teal-600 hover:bg-teal-700 text-white"
                                                                : "bg-teal-500 hover:bg-teal-600 text-white"
                                                            }`}
                                                        onClick={() => handleHiddenWordFind(word.id)}
                                                    >
                                                        {foundWords.includes(word.id) ? "Found!" : "Find"}
                                                    </motion.button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:grid sm:grid-cols-2 gap-6">
                            <div className="order-1">
                                {/* Desktop grid */}
                                <div ref={gridRef} className="aspect-square bg-opacity-10 rounded-lg overflow-hidden mb-4 shadow-md">
                                    <div className="grid grid-cols-10 w-full h-full">
                                        {grid.map((row, rowIndex) =>
                                            row.map((cell, columnIndex) => {
                                                const isHighlighted = highlightedWord?.cells.some(
                                                    (c) => c.row === rowIndex && c.col === columnIndex,
                                                )

                                                return (
                                                    <motion.div
                                                        key={rowIndex * size + columnIndex}
                                                        initial={{ opacity: 0 }}
                                                        animate={{
                                                            opacity: 1,
                                                            scale: isHighlighted
                                                                ? 1.1
                                                                : selectedCell && selectedCell.row === rowIndex && selectedCell.col === columnIndex
                                                                    ? 1.05
                                                                    : 1,
                                                            backgroundColor: isHighlighted ? "#8b5cf6" : undefined,
                                                        }}
                                                        transition={{
                                                            duration: 0.2,
                                                            delay: (rowIndex * size + columnIndex) * 0.001,
                                                        }}
                                                        className={`flex justify-center items-center aspect-square border text-sm md:text-base lg:text-lg font-bold cursor-pointer transition-all ${isHighlighted
                                                            ? "bg-violet-500 text-white z-10"
                                                            : selectedCell && selectedCell.row === rowIndex && selectedCell.col === columnIndex
                                                                ? "bg-teal-500 text-white z-10"
                                                                : darkMode
                                                                    ? "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                                                                    : "bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300"
                                                            }`}
                                                        onClick={() => handleCellClick(rowIndex, columnIndex)}
                                                    >
                                                        {cell}
                                                    </motion.div>
                                                )
                                            }),
                                        )}
                                    </div>
                                </div>

                                <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} shadow-sm`}>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <Clock className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                            <span className="text-gray-600 dark:text-gray-300 text-sm">Game Stats</span>
                                        </div>
                                        <div className="flex space-x-4">
                                            <div className="flex items-center">
                                                <span className="text-xs font-medium bg-violet-500 text-white px-2 py-0.5 rounded-full mr-1">
                                                    {solvedClues.length}/{clues.length}
                                                </span>
                                                <span className="text-gray-600 dark:text-gray-300 text-sm">Clues</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-xs font-medium bg-teal-500 text-white px-2 py-0.5 rounded-full mr-1">
                                                    {foundWords.length}/{hiddenWords.length}
                                                </span>
                                                <span className="text-gray-600 dark:text-gray-300 text-sm">Words</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="order-2 space-y-6">
                                {/* Desktop clues section */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`p-4 md:p-6 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}
                                >
                                    <h3 className="font-bold mb-4 text-lg md:text-xl flex items-center">
                                        <span className="mr-2">Clues</span>
                                        <span className="text-xs bg-violet-500 text-white px-2 py-0.5 rounded-full">
                                            {solvedClues.length}/{clues.length}
                                        </span>
                                    </h3>
                                    <div className="space-y-5">
                                        {clues.map((clue) => (
                                            <motion.div
                                                id={`clue-${clue.id}`}
                                                key={clue.id}
                                                className={`flex flex-col ${solvedClues.includes(clue.id) ? "opacity-60" : ""}`}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-medium">{clue.clue}:</span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">{clue.answer.length} letters</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <input
                                                        type="text"
                                                        value={solvedClues.includes(clue.id) ? clue.answer : clueInputs[clue.id] || ""}
                                                        onChange={(e) => handleClueInput(clue.id, e.target.value)}
                                                        placeholder={`${clue.answer.length} letters`}
                                                        disabled={solvedClues.includes(clue.id)}
                                                        className={`py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 w-full uppercase text-center ${solvedClues.includes(clue.id)
                                                            ? "bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-300"
                                                            : darkMode
                                                                ? "bg-gray-800 border-gray-600 text-white focus:ring-violet-500"
                                                                : "bg-white border-gray-300 text-gray-900 focus:ring-violet-400"
                                                            }`}
                                                        maxLength={clue.answer.length}
                                                    />
                                                    {solvedClues.includes(clue.id) && (
                                                        <span className="ml-2 text-green-500 dark:text-green-400 text-xl">
                                                            <Check className="h-5 w-5" />
                                                        </span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Desktop hidden words section */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`p-4 md:p-6 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}
                                >
                                    <h3 className="font-bold mb-4 text-lg md:text-xl flex items-center">
                                        <span className="mr-2">Hidden Words</span>
                                        <span className="text-xs bg-teal-500 text-white px-2 py-0.5 rounded-full">
                                            {foundWords.length}/{hiddenWords.length}
                                        </span>
                                    </h3>
                                    <div className="space-y-4">
                                        {hiddenWords.map((word) => (
                                            <motion.div
                                                id={`word-${word.id}`}
                                                key={word.id}
                                                className={`flex items-center justify-between ${foundWords.includes(word.id) ? "opacity-60" : ""}`}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <span className="font-medium flex items-center">
                                                    <Search className="mr-2 h-4 w-4" />
                                                    Find "{word.word}":
                                                </span>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    disabled={foundWords.includes(word.id)}
                                                    className={`py-2 px-5 rounded-lg transition-colors ${foundWords.includes(word.id)
                                                        ? "bg-green-500 text-white dark:bg-green-600"
                                                        : darkMode
                                                            ? "bg-teal-600 hover:bg-teal-700 text-white"
                                                            : "bg-teal-500 hover:bg-teal-600 text-white"
                                                        }`}
                                                    onClick={() => handleHiddenWordFind(word.id)}
                                                >
                                                    {foundWords.includes(word.id) ? "Found!" : "Find"}
                                                </motion.button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className={`mt-6 sm:mt-8 py-8 px-4 sm:px-8 rounded-xl mx-auto text-center ${darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-600"} shadow-sm`}
                >
                    <div className="max-w-6xl mx-auto w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-left pb-8">
                            {/* Logo */}
                            <div className="flex flex-col items-start justify-center h-full">
                                <h2 className="text-2xl sm:text-3xl font-light mb-2">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-400">
                                        Word
                                    </span>{''}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                                        Craft.
                                    </span>
                                </h2>
                            </div>
                            {/* Partnerships */}
                            <div className="flex flex-col items-start justify-center h-full">
                                <h3 className="text-sm sm:text-base uppercase mb-3 text-gray-500 dark:text-gray-400 font-semibold tracking-widest">Partnerships</h3>
                                <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                                    <li><a href="#" className="hover:text-teal-400 font-medium">Investors</a></li>
                                    <li><a href="#" className="hover:text-teal-400 font-medium">Social Media Marketing</a></li>
                                </ul>
                            </div>
                            {/* About */}
                            <div className="flex flex-col items-start justify-center h-full">
                                <h3 className="text-sm sm:text-base uppercase mb-3 text-gray-500 dark:text-gray-400 font-semibold tracking-widest">About</h3>
                                <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                                    <li><a href="#" className="hover:text-teal-400 font-medium">Our Why</a></li>
                                    <li><a href="#" className="hover:text-teal-400 font-medium">Our Work</a></li>
                                </ul>
                            </div>
                            {/* Support */}
                            <div className="flex flex-col items-start justify-center h-full">
                                <h3 className="text-sm sm:text-base uppercase mb-3 text-gray-500 dark:text-gray-400 font-semibold tracking-widest">Support</h3>
                                <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                                    <li><a href="#" className="hover:text-teal-400 font-medium">Support Request</a></li>
                                    <li><a href="#" className="hover:text-teal-400 font-medium">Contact</a></li>
                                </ul>
                            </div>
                        </div>
                        <hr className="w-full border-t border-gray-700 dark:border-gray-600 mb-4" />
                        <div className="flex flex-col md:flex-row justify-between items-center text-xs pt-2 pb-1">
                            <p className="text-gray-400">©2024 letsone.io. All rights reserved.</p>
                            <a href="#" className="hover:text-teal-400 text-gray-400 mt-2 md:mt-0">Privacy Policy</a>
                        </div>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {showVictory && (
                    <VictoryScreen
                        onRestart={handleGameRestart}
                        difficulty={difficulty}
                        foundWords={foundWords.length}
                        solvedClues={solvedClues.length}
                        totalWords={hiddenWords.length}
                        totalClues={clues.length}
                    />
                )}
                {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
                {showLeaderboard && <LeaderboardModal onClose={() => setShowLeaderboard(false)} darkMode={darkMode} />}
            </AnimatePresence>
        </div>
    )
}

export default WordcraftGame
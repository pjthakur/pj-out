"use client"

import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react"
import {
  AlertCircle,
  CheckCircle,
  Trophy,
  Clock,
  Zap,
  Brain,
  Sparkles,
  ArrowRight,
  HelpCircle,
  XCircle,
  Play,
  Home,
  Lightbulb,
} from "lucide-react"

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  children: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          variant === "default" && "bg-purple-600 text-white hover:bg-purple-700",
          variant === "outline" && "border border-gray-300 hover:bg-gray-100",
          variant === "ghost" && "hover:bg-gray-100",
          variant === "link" && "underline-offset-4 hover:underline text-purple-600",
          size === "default" && "h-10 py-2 px-4",
          size === "sm" && "h-9 px-3 rounded-md",
          size === "lg" && "h-11 px-8 rounded-md",
          size === "icon" && "h-10 w-10",
          className,
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = "Button"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-ring focus:ring-offset-2",
        variant === "default" && "border-transparent bg-purple-600 text-white",
        variant === "secondary" && "border-transparent bg-blue-100 text-blue-800",
        variant === "destructive" && "border-transparent bg-red-100 text-red-800",
        variant === "outline" && "border-gray-300 text-gray-800",
        className,
      )}
      {...props}
    />
  )
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

function Card({ className, ...props }: CardProps) {
  return <div className={cn("rounded-lg border border-gray-200 bg-white shadow-sm", className)} {...props} />
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

function CardTitle({ className, ...props }: CardTitleProps) {
  return <h3 className={cn("text-2xl font-semibold leading-none tracking-tight text-gray-900", className)} {...props} />
}

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

function CardDescription({ className, ...props }: CardDescriptionProps) {
  return <p className={cn("text-sm text-gray-500", className)} {...props} />
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn("p-6 pt-0", className)} {...props} />
}

const wordBanks = {
  easy: [
    "cat",
    "dog",
    "sun",
    "hat",
    "run",
    "fun",
    "map",
    "pen",
    "cup",
    "box",
    "car",
    "book",
    "tree",
    "fish",
    "bird",
    "cake",
    "door",
    "star",
    "ball",
    "game",
  ],
  medium: [
    "apple",
    "house",
    "music",
    "water",
    "plant",
    "beach",
    "phone",
    "chair",
    "table",
    "light",
    "paper",
    "money",
    "smile",
    "cloud",
    "river",
    "pizza",
    "movie",
    "dance",
    "sleep",
    "laugh",
  ],
  hard: [
    "elephant",
    "computer",
    "mountain",
    "universe",
    "knowledge",
    "beautiful",
    "adventure",
    "chocolate",
    "butterfly",
    "happiness",
    "education",
    "technology",
    "restaurant",
    "experience",
    "celebration",
    "opportunity",
    "imagination",
    "conversation",
    "environment",
    "development",
  ],
}

const scrambleWord = (word: string): string => {
  if (word.length <= 3) {
    if (word.length === 2) {
      return word[1] + word[0]
    }

    if (word.length === 3) {
      return word[1] + word[2] + word[0]
    }
  }

  const characters = word.split("")
  let scrambled = ""
  let attempts = 0
  const maxAttempts = 20

  do {
    const shuffled = [...characters]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    scrambled = shuffled.join("")
    attempts++

    if (attempts >= maxAttempts) {
      return word.split("").reverse().join("")
    }
  } while (scrambled === word || !isScrambledEnough(word, scrambled))

  return scrambled
}

const isScrambledEnough = (original: string, scrambled: string): boolean => {
  if (original.length <= 4) return original !== scrambled

  let differentPositions = 0
  for (let i = 0; i < original.length; i++) {
    if (original[i] !== scrambled[i]) {
      differentPositions++
    }
  }

  return differentPositions >= Math.ceil(original.length / 2)
}

export default function WordScrambleGame() {
  const [showWelcome, setShowWelcome] = useState(true)

  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy")
  const [currentWord, setCurrentWord] = useState("")
  const [scrambledWord, setScrambledWord] = useState("")
  const [userInput, setUserInput] = useState("")
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameActive, setGameActive] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [message, setMessage] = useState({ text: "Start a new game to begin!", type: "info" })
  const [animation, setAnimation] = useState(false)
  const [usedWords, setUsedWords] = useState<string[]>([])
  const [changingDifficulty, setChangingDifficulty] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startNewGame = () => {
    setShowWelcome(false)
    const newWord = getRandomWord(difficulty)
    setCurrentWord(newWord)
    setScrambledWord(scrambleWord(newWord))
    setUserInput("")
    setTimeLeft(difficulty === "easy" ? 30 : difficulty === "medium" ? 25 : 20)
    setGameActive(true)
    setShowHint(false)
    setHintsUsed(0)
    setMessage({ text: "Game started! Unscramble the word.", type: "info" })
    setUsedWords([newWord])
    setScore(0)
    setStreak(0)
    setChangingDifficulty(false)

    if (inputRef.current) {
      inputRef.current.focus()
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const getRandomWord = (difficulty: "easy" | "medium" | "hard"): string => {
    const availableWords = wordBanks[difficulty].filter((word) => !usedWords.includes(word))

    if (availableWords.length === 0) {
      setUsedWords([])
      return wordBanks[difficulty][Math.floor(Math.random() * wordBanks[difficulty].length)]
    }

    return availableWords[Math.floor(Math.random() * availableWords.length)]
  }

  const handleTimeUp = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    const wordWhenTimeRanOut = currentWord

    setGameActive(false)
    setMessage({
      text: `Time's up! The word was "${wordWhenTimeRanOut}".`,
      type: "error",
    })

    setStreak(0)
  }

  const startNextWord = () => {
    if (changingDifficulty) return

    const newWord = getRandomWord(difficulty)
    setCurrentWord(newWord)
    setScrambledWord(scrambleWord(newWord))
    setUserInput("")
    setTimeLeft(difficulty === "easy" ? 30 : difficulty === "medium" ? 25 : 20)
    setShowHint(false)
    setHintsUsed(0)
    setGameActive(true)
    setUsedWords((prev) => [...prev, newWord])
    setMessage({ text: "Unscramble the word!", type: "info" })

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleSubmit = () => {
    if (!gameActive) return

    if (userInput.toLowerCase() === currentWord.toLowerCase()) {
      handleCorrectAnswer()
    } else {
      const wordAtSubmission = currentWord

      setMessage({
        text: `That's not right. The word was "${wordAtSubmission}".`,
        type: "error",
      })

      setStreak(0)

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      setGameActive(false)

      setTimeout(() => {
        if (!changingDifficulty) {
          startNextWord()
        }
      }, 2000)
    }
  }

  const handleCorrectAnswer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    const difficultyMultiplier = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3
    const timeBonus = Math.floor(timeLeft * 0.5)
    const hintPenalty = hintsUsed * 5
    const wordPoints = currentWord.length * difficultyMultiplier

    const pointsEarned = Math.max(5, wordPoints + timeBonus - hintPenalty)

    setScore((prev) => prev + pointsEarned)
    setStreak((prev) => prev + 1)
    setBestStreak((prev) => Math.max(prev, streak + 1))
    setHighScore((prev) => Math.max(prev, score + pointsEarned))

    setMessage({
      text: `Correct! +${pointsEarned} points`,
      type: "success",
    })

    setAnimation(true)
    setTimeout(() => setAnimation(false), 1000)

    setTimeout(() => {
      if (!changingDifficulty) {
        startNextWord()
      }
    }, 1500)
  }

  const showWordHint = () => {
    if (!gameActive || (difficulty === "hard" && hintsUsed > 0)) return

    setShowHint(true)
    setHintsUsed((prev) => prev + 1)
  }

  const changeDifficulty = (newDifficulty: "easy" | "medium" | "hard") => {
    if (difficulty === newDifficulty) return

    setChangingDifficulty(true)

    setDifficulty(newDifficulty)

    if (gameActive) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      setGameActive(false)
      setMessage({
        text: `Difficulty changed to ${newDifficulty}. Starting new word...`,
        type: "info",
      })

      setTimeout(() => {
        const newWord = getRandomWord(newDifficulty)
        setCurrentWord(newWord)
        setScrambledWord(scrambleWord(newWord))
        setUserInput("")
        setTimeLeft(newDifficulty === "easy" ? 30 : newDifficulty === "medium" ? 25 : 20)
        setShowHint(false)
        setHintsUsed(0)
        setGameActive(true)
        setUsedWords((prev) => [...prev, newWord])
        setMessage({ text: "Unscramble the word!", type: "info" })
        setChangingDifficulty(false)

        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              handleTimeUp()
              return 0
            }
            return prev - 1
          })
        }, 1000)

        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 1500)
    } else {
      setMessage({
        text: `Difficulty set to ${newDifficulty}. Start a new game to begin!`,
        type: "info",
      })
      setChangingDifficulty(false)
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const getHintText = () => {
    if (difficulty === "easy") {
      return `Starts with "${currentWord[0]}"`
    } else if (difficulty === "medium") {
      return `Starts with "${currentWord[0]}" and ends with "${currentWord[currentWord.length - 1]}"`
    } else {
      return `${currentWord.length} letters`
    }
  }

  const stopGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setGameActive(false)
    setChangingDifficulty(false)
    setMessage({
      text: `Game stopped. Your final score: ${score}`,
      type: "info",
    })
  }

  const returnToWelcome = () => {
    stopGame()
    setShowWelcome(true)
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
      <div className="flex min-h-screen max-h-screen flex-col items-center justify-center p-4 sm:p-6 py-12 sm:py-16 md:py-20 relative overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900 to-indigo-900"></div>

          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full opacity-10 transform translate-x-1/3 -translate-y-1/3"></div>

            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full opacity-10 transform -translate-x-1/3 translate-y-1/3"></div>

            <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-pink-500 rounded-full opacity-5 transform -translate-x-1/2 -translate-y-1/2"></div>

            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute w-full h-full"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              ></div>
            </div>

            <div className="absolute inset-0">
              {Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={`dot-${i}`}
                  className="absolute rounded-full bg-white opacity-20"
                  style={{
                    width: `${Math.random() * 4 + 1}px`,
                    height: `${Math.random() * 4 + 1}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                ></div>
              ))}
            </div>

            <div className="absolute top-20 left-20 w-32 h-32 border-2 border-purple-300 opacity-10 rotate-45"></div>
            <div className="absolute bottom-40 right-20 w-40 h-40 border-2 border-indigo-300 opacity-10 rounded-lg"></div>
            <div className="absolute top-1/3 right-1/4 w-24 h-24 border-2 border-pink-300 opacity-10 rounded-full"></div>

            <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-10"></div>
            <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent opacity-10"></div>
            <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent opacity-10"></div>
          </div>
        </div>

        {showWelcome ? (
          <Card className="w-full max-w-lg shadow-xl backdrop-blur-xl bg-white/90 border-0 transition-all duration-500 hover:shadow-purple-500/20 relative z-10">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg p-4 sm:p-6">
              <CardTitle className="text-center text-2xl sm:text-3xl font-bold flex items-center justify-center gap-2 text-white">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                Word Scramble
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
              </CardTitle>
              <CardDescription className="text-center text-white text-base sm:text-lg">
                Test your vocabulary and unscrambling skills!
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-800">How to Play</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Unscramble the jumbled letters to form a real word. Type your answer and submit before the timer
                      runs out!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:gap-3">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-800">Beat the Clock</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      You have limited time for each word. The faster you solve, the more points you earn!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:gap-3">
                  <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-800">Score Points</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Earn points for each correct word. Build a streak of correct answers to maximize your score!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:gap-3">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-800">Difficulty Levels</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Choose from three difficulty levels: Easy, Medium, and Hard. Each level offers different word
                      lengths and time limits.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 sm:pt-4">
                <Button
                  onClick={startNewGame}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-base sm:text-lg py-4 sm:py-6 group transition-all duration-300 btn-gradient btn-glow text-white"
                >
                  <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Start Game
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full max-w-md shadow-xl backdrop-blur-xl bg-white/90 border-0 relative z-10">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg p-3 sm:p-4">
              <CardTitle className="text-center text-xl sm:text-2xl font-bold text-white">Word Scramble</CardTitle>
            </CardHeader>

            <CardContent className="p-4 sm:p-6">
              <div className="mb-4 sm:mb-6">
                <div className="grid w-full grid-cols-3 p-1 bg-purple-100 rounded-md">
                  <button
                    onClick={() => changeDifficulty("easy")}
                    className={cn(
                      "text-xs sm:text-sm py-1.5 px-3 rounded-sm font-medium transition-all",
                      difficulty === "easy"
                        ? "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-sm"
                        : "text-gray-600 hover:bg-purple-50",
                    )}
                  >
                    Easy
                  </button>
                  <button
                    onClick={() => changeDifficulty("medium")}
                    className={cn(
                      "text-xs sm:text-sm py-1.5 px-3 rounded-sm font-medium transition-all",
                      difficulty === "medium"
                        ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-sm"
                        : "text-gray-600 hover:bg-purple-50",
                    )}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => changeDifficulty("hard")}
                    className={cn(
                      "text-xs sm:text-sm py-1.5 px-3 rounded-sm font-medium transition-all",
                      difficulty === "hard"
                        ? "bg-gradient-to-r from-red-400 to-red-500 text-white shadow-sm"
                        : "text-gray-600 hover:bg-purple-50",
                    )}
                  >
                    Hard
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4 sm:mb-5 bg-gradient-to-r from-purple-100/50 to-blue-100/50 p-2 sm:p-3 rounded-lg">
                <div className="flex items-center bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-md shadow-sm">
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 mr-1" />
                  <span className="font-medium text-sm sm:text-base text-gray-800">{score}</span>
                </div>
                <div className="flex items-center bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-md shadow-sm">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 mr-1" />
                  <span className="font-medium text-sm sm:text-base text-gray-800">{streak}</span>
                </div>
                <div className="flex items-center bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-md shadow-sm">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mr-1" />
                  <span
                    className={cn(
                      "font-medium text-sm sm:text-base text-gray-800",
                      timeLeft < 10 && gameActive && "text-red-500 animate-pulse",
                    )}
                  >
                    {timeLeft}s
                  </span>
                </div>
              </div>

              <div
                className={cn(
                  "text-center p-5 sm:p-7 mb-4 sm:mb-5 rounded-lg bg-gradient-to-br from-purple-100/80 to-blue-100/80 transition-all duration-500 shadow-lg border border-white/20",
                  animation && "bg-green-100/80 scale-105 border-green-300/50",
                )}
              >
                <h2 className="text-3xl sm:text-4xl font-bold tracking-wider mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  {scrambledWord.toUpperCase()}
                </h2>
                {showHint && (
                  <Badge variant="outline" className="bg-white text-xs sm:text-sm">
                    <Lightbulb className="h-3 w-3 mr-1 text-yellow-500" />
                    {getHintText()}
                  </Badge>
                )}
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div className="flex space-x-2">
                  <Input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="Type your answer..."
                    disabled={!gameActive}
                    className="flex-1 bg-white border-purple-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-sm text-sm sm:text-base"
                    autoComplete="off"
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={!gameActive || !userInput.trim()}
                    className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 shadow-md btn-gradient text-white"
                  >
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <Button
                    onClick={showWordHint}
                    disabled={!gameActive || showHint || (difficulty === "hard" && hintsUsed > 0)}
                    variant="outline"
                    className="flex items-center justify-center gap-1 sm:gap-2 bg-white border-purple-200 hover:bg-purple-50 shadow-sm transition-all text-xs sm:text-sm text-gray-700"
                  >
                    <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                    <span>Hint</span>
                  </Button>

                  {gameActive ? (
                    <Button
                      onClick={stopGame}
                      disabled={!gameActive}
                      className="flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 shadow-md btn-gradient text-xs sm:text-sm text-white"
                    >
                      <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Stop</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={startNextWord}
                      className="flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 shadow-md btn-gradient text-xs sm:text-sm text-white"
                    >
                      <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Start</span>
                    </Button>
                  )}
                </div>

                <div
                  className={cn(
                    "p-3 sm:p-4 rounded-lg text-center shadow-inner text-xs sm:text-sm",
                    message.type === "success" && "bg-gradient-to-r from-green-100 to-green-50 text-green-800",
                    message.type === "error" && "bg-gradient-to-r from-red-100 to-red-50 text-red-800",
                    message.type === "info" && "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800",
                  )}
                >
                  {message.type === "success" && <CheckCircle className="inline-block h-3 w-3 sm:h-4 sm:w-4 mr-1" />}
                  {message.type === "error" && <AlertCircle className="inline-block h-3 w-3 sm:h-4 sm:w-4 mr-1" />}
                  {message.text}
                </div>
              </div>

              <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2 mb-4 sm:mb-5">
                  <div className="bg-white p-2 sm:p-3 rounded-md shadow-sm">
                    <span className="text-gray-500 text-xs sm:text-sm">Best Streak:</span>
                    <span className="font-bold ml-1 text-xs sm:text-sm text-gray-800">{bestStreak}</span>
                  </div>
                  <div className="bg-white p-2 sm:p-3 rounded-md shadow-sm">
                    <span className="text-gray-500 text-xs sm:text-sm">High Score:</span>
                    <span className="font-bold ml-1 text-xs sm:text-sm text-gray-800">{highScore}</span>
                  </div>
                </div>

                <Button
                  onClick={returnToWelcome}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-1 sm:gap-2 bg-white border-purple-200 hover:bg-purple-50 shadow-sm transition-all text-xs sm:text-sm text-gray-700"
                >
                  <Home className="h-3 w-3 sm:h-4 sm:w-4" />
                  Return to Instrucions
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <style jsx global>{`
          html, body {
            height: 100%;
            overflow: hidden;
            font-family: 'Montserrat', sans-serif;
          }
          .btn-glow:hover {
            box-shadow: 0 0 15px rgba(123, 97, 255, 0.5);
          }
          
          .btn-gradient {
            background-size: 200% auto;
            transition: 0.5s;
          }
          
          .btn-gradient:hover {
            background-position: right center;
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          .animate-pulse {
            animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          @media (max-width: 640px) {
            .text-4xl {
              font-size: 1.75rem;
            }
            .text-3xl {
              font-size: 1.5rem;
            }
            .text-2xl {
              font-size: 1.25rem;
            }
            .text-xl {
              font-size: 1.125rem;
            }
            .text-lg {
              font-size: 1rem;
            }
            .p-4 {
              padding: 1.25rem;
            }
            .p-6 {
              padding: 1.5rem;
            }
            .py-12 {
              padding-top: 3rem;
              padding-bottom: 3rem;
            }
            .space-y-4 {
              margin-top: 1.25rem;
            }
            .mb-4 {
              margin-bottom: 1.25rem;
            }
          }
        `}</style>
      </div>
    </>
  )
}

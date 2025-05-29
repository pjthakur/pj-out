"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { HelpCircle, Sun, Moon, Pause, Play, RotateCcw, Star, Trophy, Target, Gamepad2, Zap } from "lucide-react"

interface Star {
  id: number
  x: number
  y: number
  speed: number
  size: number
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
}

type GameState = "menu" | "playing" | "paused" | "gameOver"

// Button Component
const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  isDark = false,
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  className?: string
  disabled?: boolean
  isDark?: boolean
}) => {
  const baseClasses =
    "font-semibold rounded-lg transition-all duration-200 flex items-center justify-center border-none outline-none focus:ring-2 focus:ring-offset-2 marcellus-regular cursor-pointer"

  const variants = {
    primary: "bg-[#4F1C51] hover:bg-[#210F37] text-white focus:ring-[#A55B4B] shadow-lg",
    secondary: "bg-[#A55B4B] hover:bg-[#DCA06D] text-white focus:ring-[#4F1C51] shadow-lg",
    ghost: "backdrop-blur-sm focus:ring-white/50 border",
  }

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  const getGhostStyles = () => {
    if (isDark) {
      return "bg-white/10 hover:bg-white/20 text-white border-white/20"
    } else {
      return "bg-[#4F1C51] hover:bg-[#210F37] text-white border-[#4F1C51]"
    }
  }

  variants.ghost = `${getGhostStyles()} backdrop-blur-sm focus:ring-white/50`

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  )
}

//Card Component
const Card = ({
  children,
  className = "",
  isDark = false,
}: { children: React.ReactNode; className?: string; isDark?: boolean }) => {
  return (
    <div
      className={`backdrop-blur-md rounded-xl shadow-lg ${isDark ? "bg-[#4F1C51]/20 border border-[#DCA06D]/30" : "bg-white/40 border border-[#4F1C51]/20"} ${className}`}
    >
      {children}
    </div>
  )
}

//Dialog Component 
const Dialog = ({
  isOpen,
  onClose,
  title,
  children,
  isDark = false,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  isDark?: boolean
}) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30" onClick={onClose} />
      <div
        className={`relative rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-auto backdrop-blur-md ${isDark ? "bg-[#210F37]/90 border border-[#DCA06D]/30" : "bg-white/90 border border-[#4F1C51]/30"}`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-bold marcellus-regular ${isDark ? "text-white" : "text-[#210F37]"}`}>
              {title}
            </h2>
            <button
              onClick={onClose}
              className={`${isDark ? "text-gray-300 hover:text-white" : "text-[#210F37] hover:text-[#4F1C51]"} text-2xl leading-none transition-colors cursor-pointer`}
            >
              ×
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default function FallingStarsGame() {
  const [gameState, setGameState] = useState<GameState>("menu")
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [basketX, setBasketX] = useState(50)
  const [targetBasketX, setTargetBasketX] = useState(50)
  const [stars, setStars] = useState<Star[]>([])
  const [particles, setParticles] = useState<Particle[]>([])
  const [starSpeed] = useState(1.5) // Constant speed
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const lastStarSpawn = useRef<number>(0)
  const keysPressed = useRef<Set<string>>(new Set())
  const gameStartTime = useRef<number>(0)
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const particleIdCounter = useRef<number>(0) // Add counter for unique particle IDs

  // mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  //high score from local storage 
  useEffect(() => {
    const savedHighScore = localStorage.getItem("stellarCatchHighScore")
    if (savedHighScore) {
      setHighScore(Number.parseInt(savedHighScore))
    }

    // Check for dark mode preference
    const savedTheme = localStorage.getItem("stellarCatchTheme")
    if (savedTheme === "dark") {
      setIsDarkMode(true)
    }
  }, [])

  // Save high score and theme to local storage 
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem("stellarCatchHighScore", score.toString())
    }
  }, [score, highScore])

  useEffect(() => {
    localStorage.setItem("stellarCatchTheme", isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  // Timer
  useEffect(() => {
    if (gameState === "playing") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState("gameOver")
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [gameState])

  //basket movement
  useEffect(() => {
    if (isMobile) return // Skip smooth movement for mobile

    const smoothMovement = () => {
      setBasketX((current) => {
        const diff = targetBasketX - current
        if (Math.abs(diff) < 0.1) return targetBasketX
        return current + diff * 0.15 // Smooth interpolation
      })
    }

    const interval = setInterval(smoothMovement, 16) // ~60fps
    return () => clearInterval(interval)
  }, [targetBasketX, isMobile])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
        e.preventDefault()
        keysPressed.current.add(e.code)
      }
      if (e.code === "Space" && gameState === "playing") {
        e.preventDefault()
        pauseGame()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [gameState])

  //controls for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (gameState !== "playing" || !gameAreaRef.current) return

    const gameAreaRect = gameAreaRef.current.getBoundingClientRect()
    const touchX = e.touches[0].clientX
    const relativeX = ((touchX - gameAreaRect.left) / gameAreaRect.width) * 100

    const newPosition = Math.max(7.5, Math.min(92.5, relativeX))

    if (isMobile) {
      // movement for mobile
      setBasketX(newPosition)
    } else {
      setTargetBasketX(newPosition)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (gameState !== "playing" || !gameAreaRef.current) return

    const gameAreaRect = gameAreaRef.current.getBoundingClientRect()
    const touchX = e.touches[0].clientX
    const relativeX = ((touchX - gameAreaRect.left) / gameAreaRect.width) * 100

    const newPosition = Math.max(7.5, Math.min(92.5, relativeX))

    if (isMobile) {
       
      setBasketX(newPosition)
    } else {
      setTargetBasketX(newPosition)
    }
  }

  const handleTouchEnd = () => {
    // No action needed
  }

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameState !== "playing" || showHowToPlay) return

    const currentTime = Date.now()

    // Keyboard movement
    if (!isMobile) {
      if (keysPressed.current.has("ArrowLeft")) {
        setTargetBasketX((prev) => Math.max(7.5, prev - 2))
      }
      if (keysPressed.current.has("ArrowRight")) {
        setTargetBasketX((prev) => Math.min(92.5, prev + 2))
      }
    } else {
      // Direct movement for mobile keyboard
      if (keysPressed.current.has("ArrowLeft")) {
        setBasketX((prev) => Math.max(7.5, prev - 2))
      }
      if (keysPressed.current.has("ArrowRight")) {
        setBasketX((prev) => Math.min(92.5, prev + 2))
      }
    }

    // Spawn stars
    if (currentTime - lastStarSpawn.current > 1200) {
      // Spawn every 1.2 seconds
      const newStar: Star = {
        id: Date.now(),
        x: Math.random() * 80 + 10, 
        y: -5,
        speed: starSpeed, // Constant speed
        size: 20 + Math.random() * 10,
      }
      setStars((prev) => [...prev, newStar])
      lastStarSpawn.current = currentTime
    }

    // Update stars and check collisions
    setStars((prev) => {
      const updatedStars = prev
        .map((star) => ({
          ...star,
          y: star.y + star.speed,
        }))
        .filter((star) => star.y < 105)

      //collisions with basket 
      const basketWidth = 15
      const basketY = 85
      const caughtStars: Star[] = []

      const remainingStars = updatedStars.filter((star) => {
        const starLeft = star.x
        const starRight = star.x + 5 // Star width
        const starTop = star.y
        const starBottom = star.y + 5 // Star height

        const basketLeft = basketX - basketWidth / 2
        const basketRight = basketX + basketWidth / 2
        const basketTop = basketY
        const basketBottom = basketY + 8

        // collision detection
        if (starBottom >= basketTop && starTop <= basketBottom && starRight >= basketLeft && starLeft <= basketRight) {
          caughtStars.push(star)
          return false
        }
        return true
      })

      // Add particles for caught stars
      if (caughtStars.length > 0) {
        setScore((prev) => prev + caughtStars.length)
        const newParticles = caughtStars.flatMap((star) =>
          Array.from({ length: 8 }, (_, i) => ({
            id: particleIdCounter.current++,
            x: star.x + 2.5,
            y: star.y + 2.5,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 30,
            maxLife: 30,
          })),
        )
        setParticles((prev) => [...prev, ...newParticles])
      }

      return remainingStars
    })

    // Update particles
    setParticles((prev) =>
      prev
        .map((particle) => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 1,
        }))
        .filter((particle) => particle.life > 0),
    )

    animationRef.current = requestAnimationFrame(gameLoop)
  }, [gameState, basketX, starSpeed, isMobile, showHowToPlay])

  useEffect(() => {
    if (gameState === "playing") {
      gameStartTime.current = Date.now()
      animationRef.current = requestAnimationFrame(gameLoop)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameState, gameLoop])

  const startGame = () => {
    setGameState("playing")
    setScore(0)
    setTimeLeft(60)
    setBasketX(50)
    setTargetBasketX(50)
    setStars([])
    setParticles([])
    particleIdCounter.current = 0 // Reset particle counter
    gameStartTime.current = Date.now()
  }

  const pauseGame = () => {
    setGameState(gameState === "paused" ? "playing" : "paused")
  }

  const resetGame = () => {
    setGameState("menu")
    setScore(0)
    setTimeLeft(60)
    setBasketX(50)
    setTargetBasketX(50)
    setStars([])
    setParticles([])
    particleIdCounter.current = 0 // Reset particle counter
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus:wght@400&display=swap');
        .marcellus-regular {
          font-family: "Marcellus", serif;
          font-weight: 400;
          font-style: normal;
        }
      `}</style>

      <div
        className={`min-h-screen transition-all duration-300 marcellus-regular ${isDarkMode ? "bg-[#210F37]" : "bg-gradient-to-br from-[#DCA06D]/20 via-[#A55B4B]/10 to-[#4F1C51]/15"}`}
      >
        {/* Header */}
        <header
          className={`flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 backdrop-blur-sm border-b ${
            isDarkMode ? "bg-[#4F1C51]/30 border-[#DCA06D]/20" : "bg-white/50 border-[#4F1C51]/20"
          }`}
        >
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className={`text-3xl ${isDarkMode ? "text-yellow-300" : "text-yellow-500"}`}>
              <Star className="w-8 h-8 fill-current" />
            </div>
            <div>
              <h1
                className={`text-2xl sm:text-3xl font-bold marcellus-regular ${isDarkMode ? "text-white" : "text-[#210F37]"}`}
              >
                Stellar Catcher
              </h1>
              <p className={`text-sm marcellus-regular ${isDarkMode ? "text-[#DCA06D]" : "text-[#4F1C51]"}`}>
                Master the Art of Cosmic Collection
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button onClick={() => setShowHowToPlay(true)} variant="ghost" size="sm" isDark={isDarkMode}>
              <HelpCircle className="w-4 h-4 mr-2" />
              Guide
            </Button>

            <Button onClick={toggleTheme} variant="ghost" size="sm" isDark={isDarkMode}>
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </header>

        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 sm:p-6 pb-8 sm:pb-12">
          <Card isDark={isDarkMode} className="p-4 text-center">
            <div
              className={`text-sm font-medium marcellus-regular ${isDarkMode ? "text-[#DCA06D]" : "text-[#4F1C51]"}`}
            >
              Score
            </div>
            <div
              className={`text-2xl sm:text-3xl font-bold marcellus-regular ${isDarkMode ? "text-white" : "text-[#210F37]"}`}
            >
              {score}
            </div>
          </Card>

          <Card isDark={isDarkMode} className="p-4 text-center">
            <div
              className={`text-sm font-medium marcellus-regular ${isDarkMode ? "text-[#DCA06D]" : "text-[#4F1C51]"}`}
            >
              Time Left
            </div>
            <div
              className={`text-2xl sm:text-3xl font-bold marcellus-regular ${
                timeLeft <= 10 ? "text-red-400" : isDarkMode ? "text-white" : "text-[#210F37]"
              }`}
            >
              {formatTime(timeLeft)}
            </div>
          </Card>

          <Card isDark={isDarkMode} className="p-4 text-center">
            <div
              className={`text-sm font-medium marcellus-regular ${isDarkMode ? "text-[#DCA06D]" : "text-[#4F1C51]"}`}
            >
              Best Score
            </div>
            <div
              className={`text-2xl sm:text-3xl font-bold marcellus-regular ${isDarkMode ? "text-[#DCA06D]" : "text-[#A55B4B]"}`}
            >
              {highScore}
            </div>
          </Card>
        </div>

        {/* Game Area */}
        <div className="flex justify-center px-4 sm:px-6">
          <Card isDark={isDarkMode} className="w-full max-w-4xl">
            <div
              ref={gameAreaRef}
              className={`relative w-full h-80 sm:h-96 overflow-hidden rounded-lg ${
                isDarkMode
                  ? "bg-gradient-to-b from-[#4F1C51]/40 to-[#210F37]/60"
                  : "bg-gradient-to-b from-white/60 to-[#DCA06D]/30"
              }`}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Stars */}
              {stars.map((star) => (
                <div
                  key={star.id}
                  className="absolute text-yellow-400 animate-pulse"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    fontSize: `${star.size}px`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <Star className="w-full h-full fill-current" />
                </div>
              ))}

              {/* Particles */}
              {particles.map((particle) => (
                <div
                  key={particle.id}
                  className={`absolute w-1 h-1 rounded-full ${isDarkMode ? "bg-yellow-300" : "bg-yellow-500"}`}
                  style={{
                    left: `${(particle.x / 100) * 100}%`,
                    top: `${(particle.y / 100) * 100}%`,
                    opacity: particle.life / particle.maxLife,
                  }}
                />
              ))}

              {/* Basket */}
              <div
                className="absolute bottom-4 transition-none"
                style={{
                  left: `${basketX}%`,
                  transform: "translateX(-50%)",
                }}
              >
                <div
                  className="bg-[#A55B4B] rounded-sm border-2 border-[#DCA06D] shadow-lg"
                  style={{
                    width: "60px",
                    height: "20px",
                  }}
                />
              </div>

              {/* Game State Overlays */}
              {gameState === "menu" && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center text-white p-6 flex flex-col items-center">
                    <div className="flex items-center justify-center mb-4">
                      <Star className="w-12 h-12 text-yellow-300 fill-current mr-2" />
                      <h2 className="text-3xl sm:text-5xl font-bold marcellus-regular">Stellar Catcher</h2>
                    </div>
                    <p className="text-lg sm:text-xl mb-2 opacity-90 marcellus-regular">
                      Embark on a Cosmic Adventure!
                    </p>
                    <p className="text-sm sm:text-base mb-8 opacity-75 marcellus-regular">
                      Catch falling stars and become a legend
                    </p>
                    <Button onClick={startGame} size="lg" variant="primary" className="mx-auto">
                      <Play className="w-5 h-5 mr-2" />
                      Begin Mission
                    </Button>
                  </div>
                </div>
              )}

              {gameState === "paused" && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 marcellus-regular">Mission Paused</h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button onClick={pauseGame} size="lg" variant="secondary">
                        <Play className="w-5 h-5 mr-2" />
                        Continue
                      </Button>
                      <Button onClick={resetGame} size="lg" variant="ghost">
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Restart
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {gameState === "gameOver" && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <h2 className="text-2xl sm:text-4xl font-bold mb-4 marcellus-regular">Mission Complete!</h2>
                    <p className="text-xl sm:text-2xl mb-2 marcellus-regular">Stars Collected: {score}</p>
                    {score === highScore && score > 0 && (
                      <div className="flex items-center justify-center text-[#DCA06D] text-lg mb-4 marcellus-regular">
                        <Trophy className="w-6 h-6 mr-2 fill-current" />
                        New Record Achieved!
                        <Trophy className="w-6 h-6 ml-2 fill-current" />
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
                      <Button onClick={startGame} size="lg" variant="primary">
                        <Play className="w-5 h-5 mr-2" />
                        New Mission
                      </Button>
                      <Button onClick={resetGame} size="lg" variant="ghost">
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Main Menu
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Game Controls */}
        {gameState === "playing" && (
          <div className="flex justify-center mt-6 gap-4 px-4">
            <Button onClick={pauseGame} variant="ghost" isDark={isDarkMode}>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
            <Button onClick={resetGame} variant="ghost" isDark={isDarkMode}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </Button>
          </div>
        )}

        {/* Mobile Controls */}
        <div className="text-center mt-6 pb-8 px-4">
          <p className={`text-sm marcellus-regular ${isDarkMode ? "text-[#DCA06D]/80" : "text-[#4F1C51]/80"}`}>
            <span className="hidden sm:inline">Use ← → arrow keys to move your basket</span>
            <span className="sm:hidden">Touch and drag to move your basket</span>
          </p>
        </div>

        {/* How to Play Section */} 
        <Dialog
          isOpen={showHowToPlay}
          onClose={() => setShowHowToPlay(false)}
          title="Mission Briefing"
          isDark={isDarkMode}
        >
          <div className={`space-y-4 marcellus-regular ${isDarkMode ? "text-[#DCA06D]" : "text-[#4F1C51]"}`}>
            <div className="flex items-start space-x-3">
              <Target className={`w-6 h-6 mt-0.5 ${isDarkMode ? "text-[#DCA06D]" : "text-[#4F1C51]"}`} />
              <div>
                <h3 className="font-semibold">Objective</h3>
                <p className="text-sm">Collect as many falling stars as possible within 60 seconds!</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Gamepad2 className={`w-6 h-6 mt-0.5 ${isDarkMode ? "text-[#DCA06D]" : "text-[#4F1C51]"}`} />
              <div>
                <h3 className="font-semibold">Controls</h3>
                <p className="text-sm">
                  <span className="hidden sm:inline">Use LEFT and RIGHT arrow keys to move your basket</span>
                  <span className="sm:hidden">Touch and drag to move your basket</span>
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Star className={`w-6 h-6 mt-0.5 ${isDarkMode ? "text-yellow-300" : "text-yellow-500"} fill-current`} />
              <div>
                <h3 className="font-semibold">Scoring</h3>
                <p className="text-sm">Each star you catch adds +1 to your score</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Zap className={`w-6 h-6 mt-0.5 ${isDarkMode ? "text-[#DCA06D]" : "text-[#4F1C51]"}`} />
              <div>
                <h3 className="font-semibold">Challenge</h3>
                <p className="text-sm">Catch as many stars as you can before time runs out!</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Trophy className={`w-6 h-6 mt-0.5 ${isDarkMode ? "text-[#DCA06D]" : "text-[#A55B4B]"}`} />
              <div>
                <h3 className="font-semibold">Goal</h3>
                <p className="text-sm">Beat your high score and become a stellar legend!</p>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </>
  )
}
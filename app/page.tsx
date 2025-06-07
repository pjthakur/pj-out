"use client"

import { useState, useEffect, createContext } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Theme context
const ThemeContext = createContext<{
  theme: "light" | "dark"
  toggleTheme: () => void
}>({
  theme: "light",
  toggleTheme: () => {},
})

// Block type definition
interface BlockShape {
  id: string
  shape: boolean[][]
  color: string
}

// Game board cell type
type Cell = string | null

// Define block shapes
const BLOCK_SHAPES: Omit<BlockShape, "id" | "color">[] = [
  // Single block
  { shape: [[true]] },
  // Line shapes
  { shape: [[true, true]] },
  { shape: [[true, true, true]] },
  { shape: [[true], [true]] },
  { shape: [[true], [true], [true]] },
  // L shapes
  {
    shape: [
      [true, false],
      [true, true],
    ],
  },
  {
    shape: [
      [false, true],
      [true, true],
    ],
  },
  {
    shape: [
      [true, true],
      [true, false],
    ],
  },
  {
    shape: [
      [true, true],
      [false, true],
    ],
  },
  // T shape
  {
    shape: [
      [true, true, true],
      [false, true, false],
    ],
  },
  {
    shape: [
      [false, true, false],
      [true, true, true],
    ],
  },
  // Square shape
  {
    shape: [
      [true, true],
      [true, true],
    ],
  },
  // Z shapes
  {
    shape: [
      [true, true, false],
      [false, true, true],
    ],
  },
  {
    shape: [
      [false, true, true],
      [true, true, false],
    ],
  },
]

// Game utility functions
function canPlaceBlock(board: Cell[][], block: BlockShape, startRow: number, startCol: number): boolean {
  const rows = board.length
  const cols = board[0].length

  if (startRow + block.shape.length > rows || startCol + block.shape[0].length > cols) {
    return false
  }

  for (let r = 0; r < block.shape.length; r++) {
    for (let c = 0; c < block.shape[0].length; c++) {
      if (block.shape[r][c] && board[startRow + r][startCol + c] !== null) {
        return false
      }
    }
  }

  return true
}

function checkForCompleteLines(board: Cell[][]) {
  const rows = board.length
  const cols = board[0].length
  const newBoard = [...board.map((row) => [...row])]
  let linesCleared = 0

  for (let i = 0; i < rows; i++) {
    let isComplete = true

    for (let j = 0; j < cols; j++) {
      if (newBoard[i][j] === null) {
        isComplete = false
        break
      }
    }

    if (isComplete) {
      for (let j = 0; j < cols; j++) {
        newBoard[i][j] = null
      }
      linesCleared++
    }
  }

  return { clearedBoard: newBoard, linesCleared }
}

export default function BlockBlastGame() {
  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [showInstructions, setShowInstructions] = useState(true)

  // Game state
  const BOARD_SIZE = 8
  const POINTS_PER_LINE = 100
  const BLOCKS_PER_LEVEL = 10

  const [gameBoard, setGameBoard] = useState<Cell[][]>(
    Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(null)),
  )
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [placedBlocks, setPlacedBlocks] = useState(0)
  const [availableBlocks, setAvailableBlocks] = useState<BlockShape[]>([])
  const [selectedBlock, setSelectedBlock] = useState<BlockShape | null>(null)
  const [isGameOver, setIsGameOver] = useState(false)
  const [displayScore, setDisplayScore] = useState(0)
  const [hoverPosition, setHoverPosition] = useState<{ row: number; col: number } | null>(null)

  // Drag and drop state
  const [draggedBlock, setDraggedBlock] = useState<BlockShape | null>(null)
  const [dragOverPosition, setDragOverPosition] = useState<{ row: number; col: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  
  // Touch/Mobile drag state
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null)
  const [touchDragElement, setTouchDragElement] = useState<HTMLElement | null>(null)

  // Sound and effects state
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [particles, setParticles] = useState<Array<{
    id: string
    x: number
    y: number
    color: string
    velocity: { x: number; y: number }
    life: number
  }>>([])
  
  // High scores and achievements
  const [highScore, setHighScore] = useState(0)
  const [achievements, setAchievements] = useState<Set<string>>(new Set())
  const [showAchievement, setShowAchievement] = useState<{
    title: string
    description: string
    icon: string
  } | null>(null)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)

  // Game state tracking
  const [gameStarted, setGameStarted] = useState(false)

  // Helper function for block colors
  const getBlockColorClass = (color: string) => {
    const colorClasses = {
      blue: 'bg-blue-500 shadow-blue-500/30',
      green: 'bg-emerald-500 shadow-emerald-500/30', 
      purple: 'bg-purple-500 shadow-purple-500/30',
      orange: 'bg-orange-500 shadow-orange-500/30',
      red: 'bg-red-500 shadow-red-500/30'
    }
    return colorClasses[color as keyof typeof colorClasses] || 'bg-blue-500'
  }

  // Helper function for block shadow colors
  const getBlockShadowColor = (color: string) => {
    const shadowColors = {
      blue: 'rgba(59, 130, 246, 0.3)',
      green: 'rgba(16, 185, 129, 0.3)', 
      purple: 'rgba(139, 92, 246, 0.3)',
      orange: 'rgba(245, 158, 11, 0.3)',
      red: 'rgba(239, 68, 68, 0.3)'
    }
    return shadowColors[color as keyof typeof shadowColors] || 'rgba(59, 130, 246, 0.3)'
  }

  // Theme toggle function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  // Sound effects functions
  const playSound = (frequency: number, duration: number, type: 'sine' | 'square' | 'triangle' = 'sine') => {
    if (!soundEnabled) return
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = type
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    } catch (error) {
      console.log('Audio not supported')
    }
  }

  const sounds = {
    place: () => playSound(440, 0.1, 'triangle'),
    lineClear: () => playSound(880, 0.3, 'sine'),
    levelUp: () => {
      playSound(523, 0.2, 'sine')
      setTimeout(() => playSound(659, 0.2, 'sine'), 100)
      setTimeout(() => playSound(784, 0.3, 'sine'), 200)
    },
    gameOver: () => playSound(220, 0.5, 'square'),
    achievement: () => {
      playSound(659, 0.15, 'sine')
      setTimeout(() => playSound(784, 0.15, 'sine'), 150)
      setTimeout(() => playSound(1047, 0.2, 'sine'), 300)
    }
  }

  // Particle effects
  const createParticles = (centerX: number, centerY: number, color: string, count: number = 8) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: `particle-${Date.now()}-${i}`,
      x: centerX,
      y: centerY,
      color,
      velocity: {
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10 - 2
      },
      life: 1.0
    }))
    
    setParticles(prev => [...prev, ...newParticles])
    
    // Remove particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)))
    }, 1000)
  }

  // Achievement system
  const achievementsList = {
    'first-block': { title: 'First Steps', description: 'Place your first block', icon: '🎯' },
    'line-clearer': { title: 'Line Clearer', description: 'Clear your first line', icon: '✨' },
    'combo-starter': { title: 'Combo Starter', description: 'Clear 2 lines in one move', icon: '🔥' },
    'combo-master': { title: 'Combo Master', description: 'Clear 3 or more lines in one move', icon: '💫' },
    'century-club': { title: 'Century Club', description: 'Score 100 points', icon: '💯' },
    'thousand-points': { title: 'Four Digits', description: 'Score 1000 points', icon: '🚀' },
    'level-up': { title: 'Level Up', description: 'Reach level 2', icon: '📈' },
    'perfectionist': { title: 'Perfectionist', description: 'Place 10 blocks in a row without wasting space', icon: '🎨' },
    'speed-demon': { title: 'Speed Demon', description: 'Place 5 blocks in 10 seconds', icon: '⚡' }
  }

  const checkAchievements = (newScore: number, linesCleared: number, newLevel: number) => {
    const newAchievements = new Set(achievements)
    let achievementUnlocked = false

    // Check various achievements
    if (placedBlocks === 1 && !achievements.has('first-block')) {
      newAchievements.add('first-block')
      achievementUnlocked = true
      showAchievementPopup('first-block')
    }

    if (linesCleared >= 1 && !achievements.has('line-clearer')) {
      newAchievements.add('line-clearer')
      achievementUnlocked = true
      showAchievementPopup('line-clearer')
    }

    if (linesCleared >= 2 && !achievements.has('combo-starter')) {
      newAchievements.add('combo-starter')
      achievementUnlocked = true
      showAchievementPopup('combo-starter')
    }

    if (linesCleared >= 3 && !achievements.has('combo-master')) {
      newAchievements.add('combo-master')
      achievementUnlocked = true
      showAchievementPopup('combo-master')
    }

    if (newScore >= 100 && !achievements.has('century-club')) {
      newAchievements.add('century-club')
      achievementUnlocked = true
      showAchievementPopup('century-club')
    }

    if (newScore >= 1000 && !achievements.has('thousand-points')) {
      newAchievements.add('thousand-points')
      achievementUnlocked = true
      showAchievementPopup('thousand-points')
    }

    if (newLevel >= 2 && !achievements.has('level-up')) {
      newAchievements.add('level-up')
      achievementUnlocked = true
      showAchievementPopup('level-up')
    }

    if (achievementUnlocked) {
      setAchievements(newAchievements)
      sounds.achievement()
      localStorage.setItem('achievements', JSON.stringify([...newAchievements]))
    }
  }

  const showAchievementPopup = (achievementId: string) => {
    const achievement = achievementsList[achievementId as keyof typeof achievementsList]
    setShowAchievement(achievement)
    setTimeout(() => setShowAchievement(null), 3000)
  }

  // Initialize game
  useEffect(() => {
    generateNewBlocks()
    setGameStarted(true) // Game is started as soon as blocks are available

    // Comprehensive viewport and scaling fixes - self-contained
    const ensureProperViewport = () => {
      // Remove any existing viewport meta tags
      const existingViewports = document.querySelectorAll('meta[name="viewport"]')
      existingViewports.forEach(meta => meta.remove())
      
      // Add our specific viewport meta tag
      const viewportMeta = document.createElement('meta')
      viewportMeta.name = 'viewport'
      viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover, shrink-to-fit=no'
      document.head.appendChild(viewportMeta)
      
      // Add additional mobile web app meta tags
      const webAppMeta = document.createElement('meta')
      webAppMeta.name = 'apple-mobile-web-app-capable'
      webAppMeta.content = 'yes'
      document.head.appendChild(webAppMeta)
      
      const statusBarMeta = document.createElement('meta')
      statusBarMeta.name = 'apple-mobile-web-app-status-bar-style'
      statusBarMeta.content = 'default'
      document.head.appendChild(statusBarMeta)
      
      const formatMeta = document.createElement('meta')
      formatMeta.name = 'format-detection'
      formatMeta.content = 'telephone=no'
      document.head.appendChild(formatMeta)
      
      // Force zoom reset and additional hosted environment fixes
      setTimeout(() => {
        if (window.visualViewport) {
          window.visualViewport.addEventListener('resize', () => {
            document.documentElement.style.zoom = '1'
            document.body.style.zoom = '1'
          })
        }
        
        // Additional fixes for hosted environments
        document.documentElement.style.transform = 'scale(1)'
        document.body.style.transform = 'scale(1)'
        document.documentElement.style.width = '100%'
        document.body.style.width = '100%'
        
        // Force render logo text
        const logoText = document.querySelector('.logo-text') as HTMLElement
        if (logoText) {
          logoText.style.display = 'block'
          logoText.style.visibility = 'visible'
          logoText.style.opacity = '1'
        }
      }, 100)
    }
    
    ensureProperViewport()

    // Load saved data
    const savedHighScore = localStorage.getItem('highScore')
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore))
    }
    
    const savedAchievements = localStorage.getItem('achievements')
    if (savedAchievements) {
      setAchievements(new Set(JSON.parse(savedAchievements)))
    }
    
    const savedSoundSetting = localStorage.getItem('soundEnabled')
    if (savedSoundSetting !== null) {
      setSoundEnabled(JSON.parse(savedSoundSetting))
    }
    
    // Enhanced global styles with better zoom control
    const style = document.createElement("style")
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
      
      /* Force load fonts immediately */
      @font-face {
        font-family: 'Press Start 2P';
        src: url('https://fonts.gstatic.com/s/pressstart2p/v14/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff2') format('woff2');
        font-display: block;
      }
      
      :root {
        --primary: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);
        --primary-solid: #3B82F6;
        --primary-dark: #1E40AF;
        --primary-light: #DBEAFE;
        --accent: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
        --accent-solid: #8B5CF6;
        --success: linear-gradient(135deg, #10B981 0%, #059669 100%);
        --success-solid: #10B981;
        --warning: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
        --warning-solid: #F59E0B;
        --error: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
        --error-solid: #EF4444;
        
        /* Fonts */
        --font-game: 'Press Start 2P', 'Courier New', monospace;
        --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        
        /* Light theme - High contrast */
        --bg-primary: #FFFFFF;
        --bg-secondary: #F8FAFC;
        --bg-tertiary: #F1F5F9;
        --bg-card: #FFFFFF;
        --bg-elevated: #FFFFFF;
        --text-primary: #0F172A;
        --text-secondary: #334155;
        --text-muted: #64748B;
        --text-inverse: #FFFFFF;
        --border: #E2E8F0;
        --border-light: #F1F5F9;
        --border-dark: #CBD5E1;
        --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
        --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        --glow: 0 0 0 3px rgb(59 130 246 / 0.1);
        --surface-1: #FFFFFF;
        --surface-2: #F8FAFC;
        --surface-3: #F1F5F9;
      }
      
      [data-theme="dark"] {
        --bg-primary: #0D1117;
        --bg-secondary: #161B22;
        --bg-tertiary: #21262D;
        --bg-card: #161B22;
        --bg-elevated: #21262D;
        --text-primary: #F0F6FC;
        --text-secondary: #C9D1D9;
        --text-muted: #8B949E;
        --text-inverse: #0D1117;
        --border: #30363D;
        --border-light: #21262D;
        --border-dark: #161B22;
        --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4);
        --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4);
        --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4);
        --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4);
        --glow: 0 0 0 3px rgb(59 130 246 / 0.3);
        --surface-1: #161B22;
        --surface-2: #21262D;
        --surface-3: #30363D;
        
        /* Enhanced dark mode colors */
        --primary-solid: #58A6FF;
        --primary-dark: #388BFD;
        --primary-light: rgba(88, 166, 255, 0.15);
        --accent-solid: #A5A3FF;
        --success-solid: #56D364;
        --warning-solid: #E3B341;
        --error-solid: #F85149;
      }
      
      /* Global zoom and viewport fixes */
      html {
        font-size: 16px !important;
        -webkit-text-size-adjust: 100% !important;
        -ms-text-size-adjust: 100% !important;
        text-size-adjust: 100% !important;
        zoom: 1 !important;
        transform: scale(1) !important;
      }
      
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        overflow-x: hidden !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
        touch-action: manipulation !important;
      }
      
      body {
        zoom: 1 !important;
        transform: scale(1) !important;
        min-zoom: 1 !important;
        max-zoom: 1 !important;
      }
      
      /* Custom animations */
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.05); opacity: 1; }
      }
      
      @keyframes dragPulse {
        0%, 100% { transform: scale(1); opacity: 0.9; }
        50% { transform: scale(1.05); opacity: 1; }
      }
      
      @keyframes comboPulse {
        0% { transform: scale(0.8); opacity: 0; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      
      @keyframes achievementSlide {
        0% { transform: translateX(100%); opacity: 0; }
        15% { transform: translateX(0); opacity: 1; }
        85% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
      }
      
      @keyframes achievementBounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }
      
      /* Custom utilities */
      .pulse-animation { animation: pulse 1s infinite; }
      .drag-pulse-animation { animation: dragPulse 1s infinite; }
      .combo-pulse-animation { animation: comboPulse 0.6s ease-out; }
      .achievement-slide-animation { animation: achievementSlide 3s ease-out; }
      .achievement-bounce-animation { animation: achievementBounce 0.6s ease-out; }
    `
    document.head.appendChild(style)

    return () => {
      if (style && style.parentNode) {
      document.head.removeChild(style)
      }
    }
  }, [])

  // Update theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  // Check for level up
  useEffect(() => {
    if (placedBlocks >= level * BLOCKS_PER_LEVEL) {
      setLevel((prev) => prev + 1)
      generateNewBlocks(true)
    }
  }, [placedBlocks, level])

  // Check for game over
  useEffect(() => {
    if (availableBlocks.length > 0 && !canPlaceAnyBlock()) {
      setIsGameOver(true)
      sounds.gameOver()
    }
  }, [gameBoard, availableBlocks])

  // Add keyboard listener for rotation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "r" || e.key === "R") && selectedBlock) {
        rotateSelectedBlock()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedBlock])

  // Animate score
  useEffect(() => {
    const interval = setInterval(() => {
      if (displayScore < score) {
        setDisplayScore((prev) => Math.min(prev + Math.ceil((score - prev) / 10), score))
      }
    }, 50)

    return () => clearInterval(interval)
  }, [score, displayScore])

  // Prevent background scrolling when modals are open
  useEffect(() => {
    if (showInstructions || isGameOver) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
    }
  }, [showInstructions, isGameOver])

  // Update high score when score changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('highScore', score.toString())
    }
  }, [score, highScore])

  // Game functions
  const startNewGame = () => {
    setGameBoard(
      Array(BOARD_SIZE)
        .fill(null)
        .map(() => Array(BOARD_SIZE).fill(null)),
    )
    setScore(0)
    setDisplayScore(0)
    setLevel(1)
    setPlacedBlocks(0)
    setSelectedBlock(null)
    setIsGameOver(false)
    setGameStarted(false)
    generateNewBlocks()
  }

  const generateNewBlocks = (isLevelUp = false) => {
    const count = 3
    const newBlocks: BlockShape[] = []

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * BLOCK_SHAPES.length)
      const block = JSON.parse(JSON.stringify(BLOCK_SHAPES[randomIndex])) as Omit<BlockShape, "id" | "color">

      const colors = ["blue", "green", "purple", "orange", "red"]
      const randomColor = colors[Math.floor(Math.random() * colors.length)]

      const newBlock: BlockShape = {
        ...block,
        color: randomColor,
        id: `block-${Date.now()}-${i}`,
      }

      newBlocks.push(newBlock)
    }

    setAvailableBlocks(newBlocks)
  }

  const handleBlockSelect = (block: BlockShape) => {
    setSelectedBlock(block)
  }

  const handleCellClick = (row: number, col: number) => {
    if (!selectedBlock) return

    if (canPlaceBlock(gameBoard, selectedBlock, row, col)) {
      const newBoard = [...gameBoard.map((row) => [...row])]

      selectedBlock.shape.forEach((blockRow, rowOffset) => {
        blockRow.forEach((cell, colOffset) => {
          if (cell) {
            newBoard[row + rowOffset][col + colOffset] = selectedBlock.color
          }
        })
      })

      setGameBoard(newBoard)
      setAvailableBlocks((prev) => prev.filter((block) => block.id !== selectedBlock.id))
      setPlacedBlocks((prev) => prev + 1)
      setSelectedBlock(null)

      const { clearedBoard, linesCleared } = checkForCompleteLines(newBoard)

      if (linesCleared > 0) {
        const pointsEarned = linesCleared * POINTS_PER_LINE * level
        setScore((prev) => prev + pointsEarned)
        setGameBoard(clearedBoard)
        checkAchievements(score, linesCleared, level)
        sounds.lineClear()
      }

      if (availableBlocks.length <= 1) {
        generateNewBlocks()
        sounds.levelUp()
      }
    }
  }

  const canPlaceAnyBlock = () => {
    for (const block of availableBlocks) {
      for (let row = 0; row <= BOARD_SIZE - block.shape.length; row++) {
        for (let col = 0; col <= BOARD_SIZE - block.shape[0].length; col++) {
          if (canPlaceBlock(gameBoard, block, row, col)) {
            return true
          }
        }
      }
    }
    return false
  }

  const rotateSelectedBlock = () => {
    if (!selectedBlock) return

    const rotatedBlock = JSON.parse(JSON.stringify(selectedBlock)) as BlockShape
    const rows = rotatedBlock.shape.length
    const cols = rotatedBlock.shape[0].length
    const newShape: boolean[][] = Array(cols)
      .fill(null)
      .map(() => Array(rows).fill(false))

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        newShape[c][rows - 1 - r] = rotatedBlock.shape[r][c]
      }
    }

    rotatedBlock.shape = newShape
    setSelectedBlock(rotatedBlock)
  }

  const handleCellHover = (row: number, col: number) => {
    setHoverPosition({ row, col })
  }

  const handleCellLeave = () => {
    setHoverPosition(null)
  }

  const getAffectedCells = (row: number, col: number) => {
    if (!selectedBlock) return []

    const affectedCells: { row: number; col: number; valid: boolean }[] = []
    const isValidPlacement = canPlaceBlock(gameBoard, selectedBlock, row, col)

    for (let r = 0; r < selectedBlock.shape.length; r++) {
      for (let c = 0; c < selectedBlock.shape[0].length; c++) {
        if (selectedBlock.shape[r][c]) {
          const cellRow = row + r
          const cellCol = col + c
          const isInBounds = cellRow >= 0 && cellRow < gameBoard.length && cellCol >= 0 && cellCol < gameBoard[0].length

          if (isInBounds) {
            const isCellValid = gameBoard[cellRow][cellCol] === null
            affectedCells.push({
              row: cellRow,
              col: cellCol,
              valid: isCellValid && isValidPlacement,
            })
          }
        }
      }
    }

    return affectedCells
  }

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, block: BlockShape) => {
    setDraggedBlock(block)
    setIsDragging(true)
    setSelectedBlock(block)
    
    // Create a custom drag image
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      const blockSize = 20
      const cols = block.shape[0].length
      const rows = block.shape.length
      
      canvas.width = cols * blockSize
      canvas.height = rows * blockSize
      
      // Draw the block shape
      block.shape.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell) {
            const colors = {
              blue: '#3B82F6',
              green: '#10B981',
              purple: '#8B5CF6',
              orange: '#F59E0B',
              red: '#EF4444'
            }
            
            ctx.fillStyle = colors[block.color as keyof typeof colors] || '#3B82F6'
            ctx.fillRect(colIndex * blockSize, rowIndex * blockSize, blockSize - 1, blockSize - 1)
          }
        })
      })
      
      e.dataTransfer.setDragImage(canvas, canvas.width / 2, canvas.height / 2)
    }
    
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedBlock(null)
    setIsDragging(false)
    setDragOverPosition(null)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, row: number, col: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    
    if (draggedBlock && canPlaceBlock(gameBoard, draggedBlock, row, col)) {
      setDragOverPosition({ row, col })
    } else {
      setDragOverPosition(null)
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    setDragOverPosition(null)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, row: number, col: number) => {
    e.preventDefault()
    
    if (!draggedBlock) return
    
    if (canPlaceBlock(gameBoard, draggedBlock, row, col)) {
      placeBlock(draggedBlock, row, col)
    }
    
    setDragOverPosition(null)
  }

  // Touch handlers for mobile drag and drop - improved to prevent blinking
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, block: BlockShape) => {
    const touch = e.touches[0]
    setTouchStartPos({ x: touch.clientX, y: touch.clientY })
    setDraggedBlock(block)
    setSelectedBlock(block)
    setTouchDragElement(e.currentTarget as HTMLElement)
    
    // Prevent default to avoid interference with other touch events
    e.preventDefault()
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!draggedBlock || !touchStartPos || !touchDragElement) return
    
    const touch = e.touches[0]
    const deltaX = touch.clientX - touchStartPos.x
    const deltaY = touch.clientY - touchStartPos.y
    
    // Only start dragging after significant movement to prevent accidental drags
    if (Math.abs(deltaX) > 15 || Math.abs(deltaY) > 15) {
      setIsDragging(true)
      
      // Find the element under the touch point
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
      const cellElement = elementBelow?.closest('.cell') as HTMLElement
      
      if (cellElement) {
        const row = parseInt(cellElement.dataset.row || '0')
        const col = parseInt(cellElement.dataset.col || '0')
        
        if (canPlaceBlock(gameBoard, draggedBlock, row, col)) {
          setDragOverPosition({ row, col })
        } else {
          setDragOverPosition(null)
        }
      } else {
        setDragOverPosition(null)
      }
    }
    
    e.preventDefault()
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!draggedBlock) {
      return
    }
    
    // If we were dragging, try to place the block
    if (isDragging) {
      const touch = e.changedTouches[0]
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY)
      const cellElement = elementBelow?.closest('.cell') as HTMLElement
      
      if (cellElement) {
        const row = parseInt(cellElement.dataset.row || '0')
        const col = parseInt(cellElement.dataset.col || '0')
        
        if (canPlaceBlock(gameBoard, draggedBlock, row, col)) {
          placeBlock(draggedBlock, row, col)
        }
      }
    }
    
    // Reset all touch and drag state
    setDraggedBlock(null)
    setIsDragging(false)
    setDragOverPosition(null)
    setTouchStartPos(null)
    setTouchDragElement(null)
  }

  // Unified block placement function
  const placeBlock = (block: BlockShape, row: number, col: number) => {
    const newBoard = [...gameBoard.map((row) => [...row])]

    block.shape.forEach((blockRow, rowOffset) => {
      blockRow.forEach((cell, colOffset) => {
        if (cell) {
          newBoard[row + rowOffset][col + colOffset] = block.color
        }
      })
    })

    setGameBoard(newBoard)
    setAvailableBlocks((prev) => prev.filter((b) => b.id !== block.id))
    setPlacedBlocks((prev) => prev + 1)
    setSelectedBlock(null)

    // Play placement sound
    sounds.place()

    const { clearedBoard, linesCleared } = checkForCompleteLines(newBoard)

    if (linesCleared > 0) {
      const pointsEarned = linesCleared * POINTS_PER_LINE * level
      setScore((prev) => {
        const newScore = prev + pointsEarned
        checkAchievements(newScore, linesCleared, level)
        return newScore
      })
      setGameBoard(clearedBoard)
      setCombo(linesCleared)
      setMaxCombo(prev => Math.max(prev, linesCleared))
      
      // Create particle effects for line clearing
      const boardElement = document.querySelector('.board')
      if (boardElement) {
        const rect = boardElement.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        createParticles(centerX, centerY, block.color, linesCleared * 4)
      }
      
      sounds.lineClear()
    } else {
      setCombo(0)
    }

    if (availableBlocks.length <= 1) {
      generateNewBlocks()
    }
  }

  // Enhanced getAffectedCells for drag preview
  const getDragAffectedCells = (row: number, col: number) => {
    if (!draggedBlock) return []

    const affectedCells: { row: number; col: number; valid: boolean }[] = []
    const isValidPlacement = canPlaceBlock(gameBoard, draggedBlock, row, col)

    for (let r = 0; r < draggedBlock.shape.length; r++) {
      for (let c = 0; c < draggedBlock.shape[0].length; c++) {
        if (draggedBlock.shape[r][c]) {
          const cellRow = row + r
          const cellCol = col + c
          const isInBounds = cellRow >= 0 && cellRow < gameBoard.length && cellCol >= 0 && cellCol < gameBoard[0].length

          if (isInBounds) {
            const isCellValid = gameBoard[cellRow][cellCol] === null
            affectedCells.push({
              row: cellRow,
              col: cellCol,
              valid: isCellValid && isValidPlacement,
            })
          }
        }
      }
    }

    return affectedCells
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="min-h-screen flex flex-col font-body antialiased"
           style={{ 
             background: 'var(--bg-secondary)', 
             color: 'var(--text-primary)',
             zoom: 1,
             transform: 'scale(1)',
             minWidth: '100vw',
             minHeight: '100vh'
           }}>
        
        {/* Background gradient overlay */}
        <div className="fixed inset-0 pointer-events-none -z-10"
             style={{
               background: `
                 radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
                 radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
                 radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.03) 0%, transparent 50%)
               `
             }} />

        {/* Header */}
        <header className="sticky top-0 z-50 border-b backdrop-blur-xl"
                style={{ 
                  background: 'var(--bg-card)', 
                  borderColor: 'var(--border)',
                  boxShadow: 'var(--shadow)'
                }}>
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-2xl font-black relative overflow-hidden cursor-pointer shadow-md"
                   style={{ background: 'var(--primary)' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500" />
                🎯
              </div>
              <span className="text-3xl font-black tracking-tight text-blue-500 block visible opacity-100 whitespace-nowrap"
                    style={{ 
                      fontFamily: 'var(--font-game)', 
                      color: 'var(--primary-solid)',
                      textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
                    }}>
                Block Placer
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border transition-all duration-300 relative overflow-hidden uppercase tracking-wider"
                      style={{ 
                        fontFamily: 'var(--font-game)',
                        background: 'var(--surface-1)', 
                        color: 'var(--text-primary)',
                        borderColor: 'var(--border)',
                        boxShadow: 'var(--shadow)'
                      }}
                      onClick={() => setShowInstructions(true)}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500" />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <span className="hidden md:block">How to Play</span>
              </button>

              <button
                className="w-12 h-12 flex items-center justify-center rounded-xl border transition-all duration-300 relative overflow-hidden"
                style={{ 
                  background: 'var(--surface-1)', 
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border)',
                  boxShadow: 'var(--shadow)'
                }}
                onClick={() => {
                  setSoundEnabled(!soundEnabled)
                  localStorage.setItem('soundEnabled', JSON.stringify(!soundEnabled))
                }}
                aria-label={`${soundEnabled ? 'Disable' : 'Enable'} sound effects`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500" />
                {soundEnabled ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"/>
                  </svg>
                )}
              </button>

              <button
                className="w-12 h-12 flex items-center justify-center rounded-xl border transition-all duration-300 relative overflow-hidden"
                style={{ 
                  background: 'var(--surface-1)', 
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border)',
                  boxShadow: 'var(--shadow)'
                }}
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500" />
                {theme === "light" ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Game Area */}
        <main className="flex-1 p-4 flex justify-center items-center w-screen max-w-full mx-auto relative"
              style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="w-full min-w-80 rounded-3xl border overflow-hidden backdrop-blur-2xl relative mx-auto"
               style={{ 
                 maxWidth: 'min(90vw, 600px)',
                 background: 'var(--bg-card)',
                 borderColor: 'var(--border)',
                 boxShadow: 'var(--shadow-xl)',
                 transform: 'scale(1)',
                 zoom: 1
               }}>
            
            {/* Top border gradient */}
            <div className="absolute top-0 left-0 right-0 h-px"
                 style={{ background: 'linear-gradient(90deg, transparent, var(--border-light), transparent)' }} />

            {/* Game Header with Stats */}
            <div className="p-5 border-b flex justify-between items-center gap-4 flex-wrap md:flex-nowrap"
                 style={{ 
                   background: 'var(--surface-2)',
                   borderColor: 'var(--border)'
                 }}>
              <div className="flex gap-8 items-center w-full md:w-auto">
                <div className="flex flex-col items-center gap-1 relative cursor-pointer flex-1 md:flex-none">
                  <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ 
                          fontFamily: 'var(--font-game)', 
                          color: 'var(--text-muted)',
                          letterSpacing: '0.1em'
                        }}>
                    SCORE
                  </span>
                  <span className="text-2xl font-black relative"
                        style={{ 
                          fontFamily: 'var(--font-game)', 
                          color: 'var(--primary-solid)',
                          textShadow: '1px 1px 0px rgba(0,0,0,0.1)'
                        }}>
                    {displayScore.toLocaleString()}
                    <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 rounded-sm"
                         style={{ background: 'var(--primary-solid)' }} />
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 relative cursor-pointer flex-1 md:flex-none">
                  <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ 
                          fontFamily: 'var(--font-game)', 
                          color: 'var(--text-muted)',
                          letterSpacing: '0.1em'
                        }}>
                    LEVEL
                  </span>
                  <motion.span 
                    key={level} 
                    initial={{ scale: 1.2 }} 
                    animate={{ scale: 1 }} 
                    className="text-2xl font-black"
                    style={{ 
                      fontFamily: 'var(--font-game)', 
                      color: 'var(--primary-solid)',
                      textShadow: '1px 1px 0px rgba(0,0,0,0.1)'
                    }}>
                    {level}
                  </motion.span>
                  <div className="w-15 h-1 rounded-sm mt-1 overflow-hidden"
                       style={{ background: 'var(--border)' }}>
                    <motion.div
                      className="h-full rounded-sm"
                      style={{ background: 'var(--primary-solid)' }}
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${Math.min(100, (placedBlocks % BLOCKS_PER_LEVEL) / BLOCKS_PER_LEVEL * 100)}%` 
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 relative cursor-pointer flex-1 md:flex-none">
                  <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ 
                          fontFamily: 'var(--font-game)', 
                          color: 'var(--text-muted)',
                          letterSpacing: '0.1em'
                        }}>
                    HIGH SCORE
                  </span>
                  <span className="text-2xl font-black relative"
                        style={{ 
                          fontFamily: 'var(--font-game)', 
                          color: 'var(--primary-solid)',
                          textShadow: '1px 1px 0px rgba(0,0,0,0.1)'
                        }}>
                    {highScore.toLocaleString()}
                    <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 rounded-sm"
                         style={{ background: 'var(--primary-solid)' }} />
                  </span>
                </div>
                {combo > 0 && (
                  <motion.div 
                    className="rounded-xl px-4 py-2 combo-pulse-animation flex flex-col items-center gap-1 flex-1 md:flex-none"
                    style={{
                      background: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
                      boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)'
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider"
                          style={{ 
                            fontFamily: 'var(--font-game)', 
                            color: 'white',
                            letterSpacing: '0.1em'
                          }}>
                      COMBO
                    </span>
                    <span className="text-2xl font-black text-white"
                          style={{ 
                            fontFamily: 'var(--font-game)',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                          }}>
                      {combo}x
                    </span>
                  </motion.div>
                )}
              </div>

              <button 
                onClick={startNewGame} 
                className="px-5 py-3 rounded-xl text-sm font-semibold border transition-all duration-300 relative overflow-hidden uppercase tracking-wider"
                style={{ 
                  fontFamily: 'var(--font-game)',
                  background: 'var(--primary-solid)',
                  color: 'var(--text-inverse)',
                  borderColor: 'transparent',
                  boxShadow: 'var(--shadow-md)'
                }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500" />
                {gameStarted ? "New Game" : "Restart"}
              </button>
            </div>

            {/* Game Content */}
            <div className="p-5 flex flex-col gap-5">
              {/* Game Board */}
              <div className="flex justify-center relative w-full max-w-full overflow-visible">
                {/* Board background */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 rounded-2xl opacity-50 -z-10"
                     style={{ 
                       width: 'calc(100% + 16px)',
                       height: 'calc(100% + 16px)',
                       background: 'var(--surface-2)'
                     }} />
                
                <div className="grid grid-cols-8 gap-0.5 p-1 rounded-xl w-fit max-w-full mx-auto"
                     style={{ 
                       background: 'var(--border)',
                       boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                     }}>
                  {gameBoard.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                      let previewInfo = { isPreview: false, isValid: false, color: "" }

                      if (selectedBlock && hoverPosition) {
                        const affectedCells = getAffectedCells(hoverPosition.row, hoverPosition.col)
                        const matchingCell = affectedCells.find((c) => c.row === rowIndex && c.col === colIndex)

                        if (matchingCell) {
                          previewInfo = {
                            isPreview: true,
                            isValid: matchingCell.valid,
                            color: selectedBlock.color,
                          }
                        }
                      }

                      // Drag preview
                      let dragPreviewInfo = { isDragPreview: false, isValid: false }
                      if (draggedBlock && dragOverPosition) {
                        const dragAffectedCells = getDragAffectedCells(dragOverPosition.row, dragOverPosition.col)
                        const matchingDragCell = dragAffectedCells.find((c) => c.row === rowIndex && c.col === colIndex)

                        if (matchingDragCell) {
                          dragPreviewInfo = {
                            isDragPreview: true,
                            isValid: matchingDragCell.valid,
                          }
                        }
                      }

                      return (
                        <motion.div
                          key={`${rowIndex}-${colIndex}`}
                          className={`w-9 h-9 md:w-10 md:h-10 rounded-md relative cursor-pointer transition-all duration-200 border ${
                            cell ? getBlockColorClass(cell) : ''
                          } ${isDragging ? 'relative' : ''}`}
                          style={{ 
                            background: cell ? undefined : 'var(--bg-card)',
                            borderColor: cell ? 'transparent' : 'var(--border-light)',
                            boxShadow: cell ? undefined : 'var(--shadow)'
                          }}
                          data-row={rowIndex}
                          data-col={colIndex}
                          onClick={() => handleCellClick(rowIndex, colIndex)}
                          onMouseEnter={() => handleCellHover(rowIndex, colIndex)}
                          onMouseLeave={handleCellLeave}
                          onDragOver={(e) => handleDragOver(e, rowIndex, colIndex)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                        >
                          {!cell && (
                            <div className="absolute inset-0 rounded-md opacity-0 transition-opacity duration-200 hover:opacity-100"
                                 style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, transparent 100%)' }} />
                          )}
                          
                          {/* Drag target indicator */}
                          {isDragging && (
                            <div className="absolute inset-0 rounded-md border-2 border-dashed opacity-0 transition-opacity duration-200 hover:opacity-50"
                                 style={{ borderColor: 'var(--border-dark)' }} />
                          )}
                          
                          {previewInfo.isPreview && (
                            <div
                              className={`absolute inset-0 rounded-md opacity-80 pulse-animation ${
                                previewInfo.isValid ? 'valid-preview' : 'invalid-preview'
                              }`}
                              style={{
                                background: previewInfo.isValid ? 'var(--success-solid)' : 'var(--error-solid)',
                                boxShadow: previewInfo.isValid 
                                  ? '0 0 12px rgba(16, 185, 129, 0.4)' 
                                  : '0 0 12px rgba(239, 68, 68, 0.4)'
                              }}
                            />
                          )}
                          
                          {dragPreviewInfo.isDragPreview && (
                            <div
                              className={`absolute inset-0 rounded-md opacity-90 drag-pulse-animation z-10 ${
                                dragPreviewInfo.isValid ? 'drag-valid-preview' : 'drag-invalid-preview'
                              }`}
                              style={{
                                background: dragPreviewInfo.isValid ? 'var(--success-solid)' : 'var(--error-solid)',
                                boxShadow: dragPreviewInfo.isValid 
                                  ? '0 0 12px rgba(16, 185, 129, 0.4)' 
                                  : '0 0 12px rgba(239, 68, 68, 0.4)'
                              }}
                            />
                          )}
                        </motion.div>
                      )
                    }),
                  )}
                </div>
              </div>

              {/* Block Selector */}
              <div className="rounded-2xl p-5 border relative overflow-hidden"
                   style={{ 
                     background: 'var(--surface-2)',
                     borderColor: 'var(--border)'
                   }}>
                {/* Background gradient */}
                <div className="absolute inset-0 pointer-events-none"
                     style={{
                       background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%)'
                     }} />
                
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <h3 className="text-lg font-bold"
                      style={{ 
                        fontFamily: 'var(--font-game)', 
                        color: 'var(--text-primary)',
                        textShadow: '1px 1px 0px rgba(0,0,0,0.1)'
                      }}>
                    AVAILABLE BLOCKS
                  </h3>
                  {selectedBlock && (
                    <button 
                      onClick={rotateSelectedBlock} 
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border transition-all duration-300 relative overflow-hidden"
                      style={{ 
                        background: 'var(--surface-1)', 
                        color: 'var(--text-primary)',
                        borderColor: 'var(--border)',
                        boxShadow: 'var(--shadow)'
                      }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 4v6h-6"></path>
                        <path d="M1 20v-6h6"></path>
                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10"></path>
                        <path d="M3.51 15a9 9 0 0 0 14.85 3.36L23 14"></path>
                      </svg>
                      Rotate (R)
                    </button>
                  )}
                </div>

                <div className="flex justify-center gap-4 flex-wrap relative z-10">
                  {availableBlocks.map((block) => (
                    <motion.div
                      key={block.id}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 min-w-18 flex justify-center items-center relative overflow-hidden ${
                        selectedBlock?.id === block.id ? 'selected-block' : ''
                      } ${isDragging && draggedBlock?.id === block.id ? 'opacity-60 scale-95' : ''}`}
                      style={{ 
                        background: selectedBlock?.id === block.id ? 'var(--primary-light)' : 'var(--bg-card)',
                        borderColor: selectedBlock?.id === block.id ? 'var(--primary-solid)' : 'var(--border)',
                        boxShadow: selectedBlock?.id === block.id ? 'var(--shadow-lg), var(--glow)' : 'var(--shadow)'
                      }}
                      draggable={true}
                      onClick={() => handleBlockSelect(block)}
                      onDragStart={(e) => handleDragStart(e as any, block)}
                      onDragEnd={(e) => handleDragEnd(e as any)}
                      onTouchStart={(e) => handleTouchStart(e, block)}
                      onTouchMove={(e) => handleTouchMove(e)}
                      onTouchEnd={(e) => handleTouchEnd(e)}
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
                           style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, transparent 100%)' }} />
                      
                      <div
                        className="grid gap-1"
                        style={{
                          gridTemplateColumns: `repeat(${block.shape[0].length}, 1fr)`,
                          gridTemplateRows: `repeat(${block.shape.length}, 1fr)`,
                        }}
                      >
                        {block.shape.map((row, rowIndex) =>
                          row.map((cell, colIndex) => (
                            <div
                              key={`${rowIndex}-${colIndex}`}
                              className={`w-3.5 h-3.5 rounded-sm relative ${
                                cell ? getBlockColorClass(block.color) : 'bg-transparent'
                              }`}
                              style={cell ? {
                                boxShadow: `0 3px 6px ${getBlockShadowColor(block.color)}`
                              } : {}}
                            >
                              {cell && (
                                <div className="absolute inset-0 rounded-sm"
                                     style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.2) 0%, transparent 100%)' }} />
                              )}
                            </div>
                          )),
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {availableBlocks.length === 0 && (
                    <div className="text-center py-8 px-4 text-sm font-medium uppercase tracking-wider"
                         style={{ 
                           color: 'var(--text-muted)',
                           fontFamily: 'var(--font-game)',
                           letterSpacing: '0.05em'
                         }}>
                      No blocks available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Instructions Modal */}
        <AnimatePresence>
          {showInstructions && (
            <motion.div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm cursor-pointer"
              style={{ 
                overscrollBehavior: 'none',
                touchAction: 'none'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInstructions(false)}
            >
              <motion.div
                className="rounded-3xl border max-w-lg w-full overflow-hidden relative cursor-default max-h-[calc(100vh-1rem)] md:max-h-[calc(100vh-2rem)]"
                style={{ 
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border)',
                  boxShadow: 'var(--shadow-xl)'
                }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Top border gradient */}
                <div className="absolute top-0 left-0 right-0 h-px"
                     style={{ background: 'linear-gradient(90deg, transparent, var(--border-light), transparent)' }} />

                <div className="p-8 border-b"
                     style={{ 
                       background: 'var(--surface-2)',
                       borderColor: 'var(--border)'
                     }}>
                  <h2 className="text-2xl font-black mb-2"
                      style={{ 
                        fontFamily: 'var(--font-game)', 
                        color: 'var(--primary-solid)',
                        textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
                      }}>
                    How to Play
                  </h2>
                  <p className="text-base font-medium"
                     style={{ 
                       color: 'var(--text-secondary)',
                       fontFamily: 'var(--font-body)'
                     }}>
                    Master the art of strategic block placement
                  </p>
                </div>

                <div className="p-8 max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-160px)] overflow-y-auto">
                  <ol className="list-none flex flex-col gap-6">
                    <li className="flex items-start gap-4 text-base leading-relaxed"
                        style={{ 
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-body)'
                        }}>
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 cursor-pointer"
                            style={{ 
                              background: 'var(--primary-solid)',
                              color: 'var(--text-inverse)',
                              fontFamily: 'var(--font-game)',
                              boxShadow: 'var(--shadow)'
                            }}>
                        1
                      </span>
                      <span>Select a block from the available blocks below the game board</span>
                    </li>
                    <li className="flex items-start gap-4 text-base leading-relaxed"
                        style={{ 
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-body)'
                        }}>
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 cursor-pointer"
                            style={{ 
                              background: 'var(--primary-solid)',
                              color: 'var(--text-inverse)',
                              fontFamily: 'var(--font-game)',
                              boxShadow: 'var(--shadow)'
                            }}>
                        2
                      </span>
                      <span>Click on the game board to place the selected block, or drag and drop blocks directly onto the board</span>
                    </li>
                    <li className="flex items-start gap-4 text-base leading-relaxed"
                        style={{ 
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-body)'
                        }}>
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 cursor-pointer"
                            style={{ 
                              background: 'var(--primary-solid)',
                              color: 'var(--text-inverse)',
                              fontFamily: 'var(--font-game)',
                              boxShadow: 'var(--shadow)'
                            }}>
                        3
                      </span>
                      <span>
                        Rotate blocks using the Rotate button or press the{' '}
                        <span className="px-3 py-1.5 rounded-lg text-sm border font-semibold uppercase"
                              style={{ 
                                background: 'var(--surface-3)',
                                borderColor: 'var(--border)',
                                fontFamily: 'var(--font-game)',
                                color: 'var(--primary-solid)'
                              }}>
                          R
                        </span>{' '}
                        key
                      </span>
                    </li>
                    <li className="flex items-start gap-4 text-base leading-relaxed"
                        style={{ 
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-body)'
                        }}>
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 cursor-pointer"
                            style={{ 
                              background: 'var(--primary-solid)',
                              color: 'var(--text-inverse)',
                              fontFamily: 'var(--font-game)',
                              boxShadow: 'var(--shadow)'
                            }}>
                        4
                      </span>
                      <span>Fill complete horizontal lines to clear them and earn points</span>
                    </li>
                    <li className="flex items-start gap-4 text-base leading-relaxed"
                        style={{ 
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-body)'
                        }}>
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 cursor-pointer"
                            style={{ 
                              background: 'var(--primary-solid)',
                              color: 'var(--text-inverse)',
                              fontFamily: 'var(--font-game)',
                              boxShadow: 'var(--shadow)'
                            }}>
                        5
                      </span>
                      <span>Get new blocks after placing all available ones</span>
                    </li>
                    <li className="flex items-start gap-4 text-base leading-relaxed"
                        style={{ 
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-body)'
                        }}>
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 cursor-pointer"
                            style={{ 
                              background: 'var(--primary-solid)',
                              color: 'var(--text-inverse)',
                              fontFamily: 'var(--font-game)',
                              boxShadow: 'var(--shadow)'
                            }}>
                        6
                      </span>
                      <span>Game ends when no more blocks can be placed</span>
                    </li>
                  </ol>
                </div>

                <div className="p-8 border-t flex justify-end gap-4"
                     style={{ 
                       borderColor: 'var(--border)',
                       background: 'var(--surface-2)'
                     }}>
                  <button 
                    onClick={() => setShowInstructions(false)} 
                    className="px-5 py-3 rounded-xl text-sm font-semibold border transition-all duration-300 relative overflow-hidden uppercase tracking-wider"
                    style={{ 
                      fontFamily: 'var(--font-game)',
                      background: 'var(--primary-solid)',
                      color: 'var(--text-inverse)',
                      borderColor: 'transparent',
                      boxShadow: 'var(--shadow-md)'
                    }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500" />
                    Got it!
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Over Modal */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="rounded-3xl border max-w-lg w-full overflow-hidden relative max-h-[calc(100vh-1rem)]"
                style={{ 
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border)',
                  boxShadow: 'var(--shadow-xl)'
                }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                {/* Top border gradient */}
                <div className="absolute top-0 left-0 right-0 h-px"
                     style={{ background: 'linear-gradient(90deg, transparent, var(--border-light), transparent)' }} />

                <div className="p-8 border-b"
                     style={{ 
                       background: 'var(--surface-2)',
                       borderColor: 'var(--border)'
                     }}>
                  <h2 className="text-2xl font-black mb-2"
                      style={{ 
                        fontFamily: 'var(--font-game)', 
                        color: 'var(--primary-solid)',
                        textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
                      }}>
                    Game Over!
                  </h2>
                  <p className="text-base font-medium"
                     style={{ 
                       color: 'var(--text-secondary)',
                       fontFamily: 'var(--font-body)'
                     }}>
                    Great job! Here are your final results
                  </p>
                </div>

                <div className="p-8 max-h-[calc(100vh-240px)] overflow-y-auto">
                  <div className="rounded-2xl p-8 mt-4 flex flex-col gap-4 border"
                       style={{ 
                         background: 'var(--surface-2)',
                         borderColor: 'var(--border)'
                       }}>
                    <div className="flex justify-between items-center text-base">
                      <span className="font-medium text-sm uppercase tracking-wider"
                            style={{ 
                              color: 'var(--text-secondary)',
                              fontFamily: 'var(--font-game)',
                              letterSpacing: '0.05em'
                            }}>
                        FINAL SCORE
                      </span>
                      <span className="font-bold text-xl"
                            style={{ 
                              fontFamily: 'var(--font-game)', 
                              color: 'var(--primary-solid)'
                            }}>
                        {score.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-base">
                      <span className="font-medium text-sm uppercase tracking-wider"
                            style={{ 
                              color: 'var(--text-secondary)',
                              fontFamily: 'var(--font-game)',
                              letterSpacing: '0.05em'
                            }}>
                        LEVEL REACHED
                      </span>
                      <span className="font-bold text-xl"
                            style={{ 
                              fontFamily: 'var(--font-game)', 
                              color: 'var(--primary-solid)'
                            }}>
                        {level}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-base">
                      <span className="font-medium text-sm uppercase tracking-wider"
                            style={{ 
                              color: 'var(--text-secondary)',
                              fontFamily: 'var(--font-game)',
                              letterSpacing: '0.05em'
                            }}>
                        BLOCKS PLACED
                      </span>
                      <span className="font-bold text-xl"
                            style={{ 
                              fontFamily: 'var(--font-game)', 
                              color: 'var(--primary-solid)'
                            }}>
                        {placedBlocks}
                      </span>
                    </div>
                  </div>

                  {/* Statistics Panel */}
                  <div className="mt-6">
                    <h3 className="text-lg font-bold mb-4"
                        style={{ 
                          fontFamily: 'var(--font-game)', 
                          color: 'var(--text-primary)'
                        }}>
                      GAME STATISTICS
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="font-medium text-xs uppercase tracking-wider mb-1"
                             style={{ 
                               color: 'var(--text-secondary)',
                               fontFamily: 'var(--font-game)'
                             }}>
                          HIGH SCORE
                        </div>
                        <div className="font-bold text-lg"
                             style={{ 
                               fontFamily: 'var(--font-game)', 
                               color: 'var(--primary-solid)'
                             }}>
                          {highScore.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-xs uppercase tracking-wider mb-1"
                             style={{ 
                               color: 'var(--text-secondary)',
                               fontFamily: 'var(--font-game)'
                             }}>
                          Max Combo
                        </div>
                        <div className="font-bold text-lg"
                             style={{ 
                               fontFamily: 'var(--font-game)', 
                               color: 'var(--primary-solid)'
                             }}>
                          {maxCombo}x
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-xs uppercase tracking-wider mb-1"
                             style={{ 
                               color: 'var(--text-secondary)',
                               fontFamily: 'var(--font-game)'
                             }}>
                          Achievements
                        </div>
                        <div className="font-bold text-lg"
                             style={{ 
                               fontFamily: 'var(--font-game)', 
                               color: 'var(--primary-solid)'
                             }}>
                          {achievements.size}/{Object.keys(achievementsList).length}
                        </div>
                      </div>
                    </div>
                    
                    {achievements.size > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm mb-2"
                            style={{ 
                              color: 'var(--text-secondary)'
                            }}>
                          Unlocked Achievements
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {[...achievements].map((achievementId) => {
                            const achievement = achievementsList[achievementId as keyof typeof achievementsList]
                            return (
                              <div
                                key={achievementId}
                                className="flex items-center gap-2 px-2 py-2 rounded-lg text-xs"
                                style={{
                                  background: 'var(--surface-3)'
                                }}
                              >
                                <span>{achievement.icon}</span>
                                <span>{achievement.title}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-8 border-t flex justify-end gap-4"
                     style={{ 
                       borderColor: 'var(--border)',
                       background: 'var(--surface-2)'
                     }}>
                  <button
                    onClick={() => {
                      startNewGame()
                      setIsGameOver(false)
                    }}
                    className="px-5 py-3 rounded-xl text-sm font-semibold border transition-all duration-300 relative overflow-hidden uppercase tracking-wider"
                    style={{ 
                      fontFamily: 'var(--font-game)',
                      background: 'var(--primary-solid)',
                      color: 'var(--text-inverse)',
                      borderColor: 'transparent',
                      boxShadow: 'var(--shadow-md)'
                    }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500" />
                    Play Again
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Achievement Popup */}
        <AnimatePresence>
          {showAchievement && (
            <motion.div
              className="fixed top-24 right-5 border-2 rounded-2xl p-6 max-w-sm z-[200] achievement-slide-animation"
              style={{ 
                background: 'var(--bg-card)',
                borderColor: 'var(--primary-solid)',
                boxShadow: 'var(--shadow-xl), 0 0 20px var(--primary-solid)'
              }}
              initial={{ x: 350, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 350, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl achievement-bounce-animation">{showAchievement.icon}</span>
                <div>
                  <h3 className="text-lg font-bold mb-0"
                      style={{ 
                        fontFamily: 'var(--font-game)', 
                        color: 'var(--primary-solid)',
                        textShadow: '1px 1px 0px rgba(0,0,0,0.1)'
                      }}>
                    {showAchievement.title}
                  </h3>
                  <p className="text-sm leading-snug mb-0"
                     style={{ 
                       color: 'var(--text-secondary)',
                       fontFamily: 'var(--font-body)',
                       lineHeight: 1.4
                     }}>
                    {showAchievement.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Particle Effects */}
        <div className="particles-container">
          <AnimatePresence>
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="particle"
                style={{
                  left: particle.x,
                  top: particle.y,
                  backgroundColor: particle.color,
                }}
                initial={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  opacity: 0,
                  scale: 0.5,
                  x: particle.velocity.x * 100,
                  y: particle.velocity.y * 100,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ThemeContext.Provider>
  )
}
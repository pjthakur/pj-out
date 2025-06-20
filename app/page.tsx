"use client"
import type React from "react"
import { useState, useEffect, useRef, useCallback, createContext, useContext, useMemo } from "react"
import type { FC, ReactNode } from "react"
import { motion } from "framer-motion"
import { 
  MdPlayArrow, 
  MdPause,
  MdRefresh,
  MdLightMode, 
  MdDarkMode, 
  MdExpandMore, 
  MdThermostat, 
  MdViewInAr, 
  MdShowChart, 
  MdSchool,
  MdLightbulb,
  MdRocket,
  MdScience,
  MdSpeed,
  MdTune,
} from "react-icons/md"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
const GoogleFontsLoader: FC = () => {
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
    }
  }, [])
  return null
}
interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
}
const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
})
const MATERIALS = {
  copper: {
    name: "Copper",
    color: "#B87333",
    thermalConductivity: 401,
    density: 8960,
    specificHeat: 385,
  },
  wood: {
    name: "Wood",
    color: "#8B4513",
    thermalConductivity: 0.12,
    density: 600,
    specificHeat: 1700,
  },
}
type MaterialType = keyof typeof MATERIALS
type TransferMode = "conduction" | "convection"
interface MaterialBlock {
  id: string
  material: MaterialType
  temperature: number
  mass: number
  surfaceArea: number
  position: { x: number; y: number }
}
const TemperatureGraph: FC<{
  data: Array<{ time: number; temp1: number; temp2: number }>
  isDark: boolean
}> = ({ data, isDark }) => {
  const maxTimeInSeconds = 600 
  const dataPointInterval = 2 
  const totalPoints = maxTimeInSeconds / dataPointInterval 
  const baseTimeline = Array.from({ length: totalPoints + 1 }, (_, index) => ({
    time: (index * dataPointInterval) / 60, 
    'Block 1': null as number | null,
    'Block 2': null as number | null
  }))
  const chartData = baseTimeline.map((point, index) => {
    const actualDataIndex = Math.floor(index * dataPointInterval / 0.1) 
    if (data.length > actualDataIndex && actualDataIndex >= 0) {
      const actualData = data[actualDataIndex]
      return {
        time: point.time,
        'Block 1': Number(actualData.temp1.toFixed(2)),
        'Block 2': Number(actualData.temp2.toFixed(2))
      }
    }
    return point
  })
  return (
    <div
      className={`p-3 rounded-xl h-72 md:h-80 lg:h-90 transition-all duration-300 ${
        isDark
          ? "bg-gray-700/30 border border-gray-600/30"
          : "bg-gray-50/80 border border-gray-200/50"
      } backdrop-blur-sm w-full overflow-hidden`}
    >
      <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${
        isDark ? "text-cyan-400" : "text-cyan-600"
      }`}>
        <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
        Temperature vs Time
      </h3>
      <div className="h-60 sm:h-56 md:h-64 lg:h-75 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? "#374151" : "#E5E7EB"} 
            />
            <XAxis 
              dataKey="time" 
              stroke={isDark ? "#9CA3AF" : "#6B7280"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 10]}
              type="number"
              ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
              tickFormatter={(value) => `${value}m`}
            />
            <YAxis 
              stroke={isDark ? "#9CA3AF" : "#6B7280"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 200]}
              width={35}
              tickFormatter={(value) => `${value}°`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
                borderRadius: '8px',
                color: isDark ? '#FFFFFF' : '#1F2937',
                fontSize: '12px'
              }}
              formatter={(value: any, name: string) => [value ? `${value}°C` : 'No data', name]}
              labelFormatter={(label) => `Time: ${Number(label).toFixed(1)}m`}
            />
            <Legend 
              wrapperStyle={{
                fontSize: '12px',
                color: isDark ? '#FFFFFF' : '#1F2937'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="Block 1" 
              stroke="#EF4444" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: '#EF4444', strokeWidth: 2 }}
              connectNulls={false}
            />
            <Line 
              type="monotone" 
              dataKey="Block 2" 
                stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: '#3B82F6', strokeWidth: 2 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
const MIN_BLOCK_SIZE = 48
const MAX_BLOCK_SIZE = 80
const MaterialBlock: FC<{
  block: MaterialBlock
  onDrag: (id: string, position: { x: number; y: number }) => void
  isDark: boolean
}> = ({ block, onDrag, isDark }) => {
  const blockSize = useMemo(() => {
    const baseSize = 48
    const maxSize = 80
    const sizeRange = maxSize - baseSize
    
    // Combine both mass and surface area for visual representation
    const normalizedMass = (block.mass - 0.1) / (5 - 0.1)
    const normalizedSurfaceArea = (block.surfaceArea - 0.001) / (0.1 - 0.001)
    
    // Weight: 60% mass, 40% surface area for balanced visual effect
    const combinedFactor = (normalizedMass * 0.6) + (normalizedSurfaceArea * 0.4)
    
    return Math.round(baseSize + (sizeRange * combinedFactor))
  }, [block.mass, block.surfaceArea])
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const blockRef = useRef<HTMLDivElement>(null)
  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (blockRef.current) {
      const rect = blockRef.current.getBoundingClientRect()
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top,
      })
      setIsDragging(true)
    }
  }, [])
  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (isDragging && blockRef.current) {
        const visualizationArea = document.querySelector(".visualization-area")
        if (visualizationArea) {
          const rect = visualizationArea.getBoundingClientRect()
          const newX = clientX - rect.left - dragOffset.x
          const newY = clientY - rect.top - dragOffset.y
          const maxX = rect.width - blockSize
          const maxY = rect.height - blockSize
          const boundedX = Math.max(0, Math.min(newX, maxX))
          const boundedY = Math.max(0, Math.min(newY, maxY))
          onDrag(block.id, { x: boundedX, y: boundedY })
        }
      }
    },
    [isDragging, dragOffset, onDrag, block.id, blockSize],
  )
  const handleEnd = useCallback(() => {
    setIsDragging(false)
  }, [])
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX, e.clientY)
  }
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    },
    [handleMove],
  )
  const handleMouseUp = useCallback(() => {
    handleEnd()
  }, [handleEnd])
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    },
    [handleMove],
  )
  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      e.preventDefault()
      handleEnd()
    },
    [handleEnd],
  )
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleTouchEnd, { passive: false })
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])
  const material = MATERIALS[block.material]
  return (
    <div
      ref={blockRef}
      className={`absolute rounded-lg cursor-move select-none transition-transform duration-200 ${
        isDragging ? "scale-110 z-10" : "z-0"
      } ${isDark ? "shadow-lg shadow-gray-900" : "shadow-lg shadow-gray-300"}`}
      style={{
        left: block.position.x,
        top: block.position.y,
        width: blockSize,
        height: blockSize,
        transform: isDragging ? 'scale(1.1)' : 'scale(1)',
        backgroundColor: isDark ? 
          (block.material === "copper" ? "#B87333" : "#8B4513") :
          (block.material === "copper" ? "#B87333" : "#8B4513"),
        border: `2px solid ${isDark ? "#374151" : "#d1d5db"}`,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="flex flex-col items-center justify-center h-full text-white font-bold text-center px-1">
        <div className={`${blockSize < 60 ? 'text-[8px]' : blockSize < 70 ? 'text-[9px]' : 'text-[10px]'} leading-tight`}>
          {material.name}
        </div>
        <div className={`${blockSize < 60 ? 'text-[7px]' : blockSize < 70 ? 'text-[8px]' : 'text-[9px]'} leading-tight mt-0.5`}>
          {block.temperature.toFixed(1)}°C
        </div>
      </div>
    </div>
  )
}
const ControlPanel: FC<{
  title: string
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
  isDark: boolean
}> = ({ title, isOpen, onToggle, children, isDark }) => {
  return (
    <motion.div
      initial={false}
      animate={{ 
        height: isOpen ? "auto" : "64px"
      }}
      transition={{ 
        duration: 0.4, 
        ease: [0.04, 0.62, 0.23, 0.98] 
      }}
      className={`rounded-xl ${
        isDark
          ? "bg-gray-800/90 border border-gray-700"
          : "bg-gray-50 border border-gray-200 shadow-sm"
      } overflow-hidden`}
    >
      <motion.button
        onClick={onToggle}
        whileHover={{ opacity: 0.8 }}
        whileTap={{ opacity: 0.7 }}
        className={`w-full h-16 px-4 flex items-center justify-between transition-colors cursor-pointer ${
          isDark ? "text-white" : "text-gray-900"
        } ${isOpen ? "rounded-t-xl" : "rounded-xl"}`}
      >
        <span className="text-sm font-semibold">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <MdExpandMore className="w-5 h-5" />
        </motion.div>
      </motion.button>
      <motion.div
        initial={false}
        animate={{
          opacity: isOpen ? 1 : 0,
          y: isOpen ? 0 : -10
        }}
        transition={{
          duration: 0.3,
          delay: isOpen ? 0.1 : 0,
          ease: "easeOut"
        }}
        style={{ display: isOpen ? "block" : "none" }}
      >
        <motion.div
          initial={false}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2, delay: isOpen ? 0.2 : 0 }}
          className="p-4 pt-0"
        >
          <div className="text-sm">{children}</div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
const HeatTransferSimulation: FC<{ onBack: () => void }> = ({ onBack }) => {
  const { isDark } = useContext(ThemeContext)
  
  // Function to calculate centered positions for blocks
  const getCenteredPositions = () => {
    const visualizationArea = document.querySelector(".visualization-area")
    if (visualizationArea) {
      const rect = visualizationArea.getBoundingClientRect()
      const blockSize = 64 // Default block size for positioning
      const centerY = (rect.height - blockSize) / 2
      const spacing = 120 // Space between blocks
      const totalWidth = blockSize * 2 + spacing
      const startX = (rect.width - totalWidth) / 2
      
      return [
        { x: Math.max(0, startX), y: Math.max(0, centerY) },
        { x: Math.max(0, startX + blockSize + spacing), y: Math.max(0, centerY) }
      ]
    }
    // Fallback positions if visualization area not found
    return [
      { x: 80, y: 100 },
      { x: 240, y: 100 }
    ]
  }

  const [blocks, setBlocks] = useState<MaterialBlock[]>([
    {
      id: "1",
      material: "copper",
      temperature: 100,
      mass: 1,
      surfaceArea: 0.01,
      position: { x: 80, y: 100 },
    },
    {
      id: "2",
      material: "wood",
      temperature: 20,
      mass: 1,
      surfaceArea: 0.01,
      position: { x: 240, y: 100 },
    },
  ])
  const [transferMode, setTransferMode] = useState<TransferMode>("conduction")
  const [isRunning, setIsRunning] = useState(false)
  const [temperatureData, setTemperatureData] = useState<Array<{ time: number; temp1: number; temp2: number }>>([])
  const [panelStates, setPanelStates] = useState({
    materials: true,
    properties: true,
    mode: true,
  })
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const calculateHeatTransfer = useCallback(() => {
    setBlocks((prevBlocks) => {
      const [block1, block2] = prevBlocks
      const material1 = MATERIALS[block1.material]
      const material2 = MATERIALS[block2.material]
      const dx = block2.position.x - block1.position.x
      const dy = block2.position.y - block1.position.y
      const distance = Math.sqrt(dx * dx + dy * dy) / 100
      let heatTransferRate = 0
      if (transferMode === "conduction") {
        const avgConductivity = (material1.thermalConductivity + material2.thermalConductivity) / 2
        const avgArea = (block1.surfaceArea + block2.surfaceArea) / 2
        const distanceFactor = 1 / Math.pow(Math.max(distance, 0.1), 2)
        heatTransferRate = avgConductivity * avgArea * (block1.temperature - block2.temperature) * distanceFactor * 5
      } else {
        const baseConvectionCoeff = 25
        const distanceFactor = 1 / Math.max(distance, 0.1)
        const effectiveConvectionCoeff = baseConvectionCoeff * distanceFactor
        const avgArea = (block1.surfaceArea + block2.surfaceArea) / 2
        heatTransferRate = effectiveConvectionCoeff * avgArea * (block1.temperature - block2.temperature)
      }
      const dt = 0.1 * (1 / Math.max(distance, 0.1))
      const tempChange1 = (-heatTransferRate * dt) / (block1.mass * material1.specificHeat)
      const tempChange2 = (heatTransferRate * dt) / (block2.mass * material2.specificHeat)
      const newBlock1 = {
        ...block1,
        temperature: Math.max(0, block1.temperature + tempChange1),
      }
      const newBlock2 = {
        ...block2,
        temperature: Math.max(0, block2.temperature + tempChange2),
      }
      return [newBlock1, newBlock2]
    })
  }, [transferMode])
  useEffect(() => {
    if (isRunning) {
      setTemperatureData((prev) => {
        const newPoint = {
          time: prev.length * 0.1, 
          temp1: Number(blocks[0].temperature.toFixed(1)),
          temp2: Number(blocks[1].temperature.toFixed(1)),
        }
        const newData = [...prev, newPoint]
        return newData.slice(-6000)
      })
    }
  }, [blocks, isRunning])
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(calculateHeatTransfer, 50)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, calculateHeatTransfer])
  const handleBlockDrag = (id: string, position: { x: number; y: number }) => {
    setBlocks((prev) => prev.map((block) => (block.id === id ? { ...block, position } : block)))
  }
  const updateBlockProperty = (id: string, property: keyof MaterialBlock, value: any) => {
    setBlocks((prev) => prev.map((block) => (block.id === id ? { ...block, [property]: value } : block)))
  }
  const togglePanel = (panel: keyof typeof panelStates) => {
    setPanelStates((prev) => ({ ...prev, [panel]: !prev[panel] }))
  }
  const resetSimulation = () => {
    setIsRunning(false)
    setTemperatureData([])
    const centeredPositions = getCenteredPositions()
    setBlocks([
      {
        id: "1",
        material: "copper",
        temperature: 100,
        mass: 1,
        surfaceArea: 0.01,
        position: centeredPositions[0],
      },
      {
        id: "2",
        material: "wood",
        temperature: 20,
        mass: 1,
        surfaceArea: 0.01,
        position: centeredPositions[1],
      },
    ])
  }
  useEffect(() => {
    const handleResize = () => {
      const visualizationArea = document.querySelector(".visualization-area")
      if (!visualizationArea) return
      const rect = visualizationArea.getBoundingClientRect()
      setBlocks((prevBlocks) =>
        prevBlocks.map((block) => {
          let { x, y } = block.position
          const maxX = rect.width - MAX_BLOCK_SIZE
          const maxY = rect.height - MAX_BLOCK_SIZE
          x = Math.max(0, Math.min(x, maxX))
          y = Math.max(0, Math.min(y, maxY))
          return { ...block, position: { x, y } }
        }),
      )
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Center blocks on initial load
  useEffect(() => {
    const centerBlocks = () => {
      const centeredPositions = getCenteredPositions()
      setBlocks(prevBlocks => prevBlocks.map((block, index) => ({
        ...block,
        position: centeredPositions[index] || block.position
      })))
    }
    
    // Small delay to ensure the visualization area is rendered
    const timer = setTimeout(centerBlocks, 100)
    return () => clearTimeout(timer)
  }, [])
  return (
    <>
      <div
        className={`min-h-screen ${
          isDark ? "bg-gray-900" : "bg-white"
        } transition-all duration-300 w-full`}
      >
        <div
          className={`fixed top-0 left-0 right-0 z-50 ${
            isDark ? "bg-gray-900/95" : "bg-white/95"
          } backdrop-blur-md border-b ${
            isDark ? "border-gray-700" : "border-gray-200"
          } transition-all duration-300 min-h-16 shadow-sm w-full`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            <div className="flex items-center">
          <button
            onClick={onBack}
                className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-200"
                aria-label="Go to landing page"
              >
                <div className={`p-2 rounded-lg ${
                  isDark ? "bg-gradient-to-br from-cyan-500 to-blue-600" : "bg-gradient-to-br from-cyan-500 to-blue-600"
                }`}>
                  <MdThermostat className="w-5 h-5 text-white" />
                </div>
                <h1 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                  HeatFlow Pro
          </h1>
              </button>
            </div>
          <ThemeToggle />
        </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="px-4 sm:px-6 lg:px-8 py-6 pt-20 space-y-6 w-full max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-full order-2 xl:order-1"
            >
              <div
                className={`visualization-area relative h-64 md:h-80 rounded-xl border-2 border-dashed ${
                  isDark
                    ? "border-gray-600 bg-gray-800/50 hover:shadow-lg hover:shadow-gray-900/50"
                    : "border-gray-300 bg-gray-50 hover:shadow-lg hover:shadow-gray-500/20"
                } overflow-hidden w-full transition-all duration-300`}
              >
                <svg className="absolute inset-0 pointer-events-none w-full h-full">
                  <line
                    x1={blocks[0].position.x + 32}
                    y1={blocks[0].position.y + 32}
                    x2={blocks[1].position.x + 32}
                    y2={blocks[1].position.y + 32}
                    stroke={isDark ? "#6b7280" : "#000"}
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                </svg>
                {blocks.map((block) => (
                  <MaterialBlock key={block.id} block={block} onDrag={handleBlockDrag} isDark={isDark} />
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`w-full rounded-xl transition-all duration-300 order-1 xl:order-2 ${
                isDark
                  ? "bg-gray-800/90 border border-gray-700"
                  : "bg-gray-50 border border-gray-200 shadow-sm"
              }`}
            >
              <div className="flex flex-col justify-center h-full p-4 space-y-4">
                {/* Description */}
                <div className="text-center">
                  <p className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"} leading-relaxed`}>
                    Observe real-time heat transfer between materials based on thermodynamic principles.
                  </p>
                </div>
                {/* Buttons Container */}
                <div className="space-y-3">
                  {/* Start/Stop Button */}
                  <motion.button
                    onClick={() => setIsRunning(!isRunning)}
                    whileHover={{ 
                      scale: 1.02,
                      y: -2
                    }}
                    whileTap={{ 
                      scale: 0.98,
                      y: 0
                    }}
                    className={`w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                      isRunning 
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                        : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700"
                    }`}
                  >
                    <motion.div
                      key={isRunning ? 'pause' : 'play'}
                      initial={{ scale: 0.8, opacity: 0, rotate: -90 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0.8, opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      {isRunning ? <MdPause className="w-4 h-4" /> : <MdPlayArrow className="w-4 h-4" />}
                    </motion.div>
                    <motion.span
                      key={isRunning ? 'pause-text' : 'start-text'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      {isRunning ? "Pause" : "Start"} Simulation
                    </motion.span>
                  </motion.button>
                  {/* Reset Button */}
                  <motion.button
                    onClick={resetSimulation}
                    whileHover={{ 
                      scale: 1.02,
                      y: -2
                    }}
                    whileTap={{ 
                      scale: 0.98,
                      y: 0
                    }}
                    className={`w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                      isDark 
                        ? "bg-gray-700 text-white hover:bg-gray-600 border border-gray-600" 
                        : "bg-white text-gray-900 hover:bg-gray-100 border border-gray-300"
                    }`}
                  >
                    <motion.div
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <MdRefresh className="w-4 h-4" />
                    </motion.div>
                    Reset
                  </motion.button>
                </div>
                {/* Reset Description */}
                <div className="text-center">
                  <p className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"} leading-relaxed`}>
                    Reset all parameters to start fresh with new configurations.
                  </p>
                </div>
              </div>
            </motion.div>
            </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`w-full rounded-2xl backdrop-blur-sm ${
              isDark
                ? "bg-gray-800/95 border border-gray-700/60 shadow-xl shadow-gray-900/20"
                : "bg-white/95 border border-gray-200/60 shadow-xl shadow-gray-500/10"
            } transition-all duration-300`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              <div className="w-full">
                <TemperatureGraph data={temperatureData} isDark={isDark} />
              </div>
              <div className={`${isDark ? "text-gray-300" : "text-gray-800"} space-y-6`}>
                <div className={`p-4 rounded-xl ${
                  isDark 
                    ? "bg-gray-700/30 border border-gray-600/30" 
                    : "bg-gray-50/80 border border-gray-200/50"
                } backdrop-blur-sm`}>
                  <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${
                    isDark ? "text-cyan-400" : "text-cyan-600"
                  }`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                    Understanding the Graph
                  </h4>
                  <p className="text-xs font-medium leading-relaxed">
                    Red line shows Block 1's temperature and blue line shows Block 2's temperature. Watch as they
                    converge to thermal equilibrium.
                  </p>
                </div>
                <div className={`p-4 rounded-xl ${
                  isDark 
                    ? "bg-gray-700/30 border border-gray-600/30" 
                    : "bg-gray-50/80 border border-gray-200/50"
                } backdrop-blur-sm`}>
                  <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${
                    isDark ? "text-cyan-400" : "text-cyan-600"
                  }`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                    Heat Transfer Principles
                  </h4>
                  <p className="text-xs font-medium mb-3 leading-relaxed">
                    Heat naturally flows from higher to lower temperature regions. The rate of heat transfer depends on:
                  </p>
                  <ul className="text-xs space-y-2 font-medium">
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-current mt-1.5 flex-shrink-0"></div>
                      <span>Temperature difference between the blocks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-current mt-1.5 flex-shrink-0"></div>
                      <span>Material properties (thermal conductivity)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-current mt-1.5 flex-shrink-0"></div>
                      <span>Surface area of contact or exposure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-current mt-1.5 flex-shrink-0"></div>
                      <span>Distance between the blocks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-current mt-1.5 flex-shrink-0"></div>
                      <span>Transfer mode (conduction or convection)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-6"
          >
            <ControlPanel
              title="Material Properties"
              isOpen={panelStates.materials}
              onToggle={() => togglePanel("materials")}
              isDark={isDark}
            >
              <div className="space-y-4">
                {/* Block 1 */}
                <div className={`p-4 rounded-lg ${
                  isDark ? "bg-gray-700/50 border border-gray-600" : "bg-gray-50 border border-gray-200"
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Block 1</h4>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      isDark 
                        ? 'bg-gray-700 text-gray-300 border border-gray-600' 
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {MATERIALS[blocks[0].material].name}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        Material
                      </label>
                  <select
                    value={blocks[0].material}
                    onChange={(e) => updateBlockProperty("1", "material", e.target.value as MaterialType)}
                        className={`w-full px-3 py-2 text-xs rounded-lg border font-medium cursor-pointer ${
                      isDark
                            ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600 focus:border-cyan-500"
                            : "bg-white text-gray-900 border-gray-300 hover:border-gray-400 focus:border-cyan-500"
                        } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
                      >
                        <option value="copper">Copper</option>
                        <option value="wood">Wood</option>
                  </select>
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        Temperature
                      </label>
                      <div className={`px-3 py-2 text-xs rounded-lg border font-semibold ${
                        isDark ? "bg-gray-800 text-white border-gray-600" : "bg-gray-50 text-gray-900 border-gray-200"
                      }`}>
                        {blocks[0].temperature.toFixed(2)}°C
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <input
                      type="range"
                      min={0}
                      max={200}
                      step={1}
                      value={blocks[0].temperature}
                      onChange={(e) => updateBlockProperty("1", "temperature", Number(e.target.value))}
                      className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                        isDark ? "bg-gray-600 accent-cyan-500" : "bg-gray-300 accent-cyan-500"
                      }`}
                    />
                  </div>
                </div>
                {/* Block 2 */}
                <div className={`p-4 rounded-lg ${
                  isDark ? "bg-gray-700/50 border border-gray-600" : "bg-gray-50 border border-gray-200"
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Block 2</h4>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      isDark 
                        ? 'bg-gray-700 text-gray-300 border border-gray-600' 
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {MATERIALS[blocks[1].material].name}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        Material
                      </label>
                  <select
                    value={blocks[1].material}
                    onChange={(e) => updateBlockProperty("2", "material", e.target.value as MaterialType)}
                        className={`w-full px-3 py-2 text-xs rounded-lg border font-medium ${
                      isDark
                            ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600 focus:border-cyan-500"
                            : "bg-white text-gray-900 border-gray-300 hover:border-gray-400 focus:border-cyan-500"
                        } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
                      >
                        <option value="copper">Copper</option>
                        <option value="wood">Wood</option>
                  </select>
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        Temperature
                      </label>
                      <div className={`px-3 py-2 text-xs rounded-lg border font-semibold ${
                        isDark ? "bg-gray-800 text-white border-gray-600" : "bg-gray-50 text-gray-900 border-gray-200"
                      }`}>
                        {blocks[1].temperature.toFixed(2)}°C
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <input
                      type="range"
                      min={0}
                      max={200}
                      step={1}
                      value={blocks[1].temperature}
                      onChange={(e) => updateBlockProperty("2", "temperature", Number(e.target.value))}
                      className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                        isDark ? "bg-gray-600 accent-cyan-500" : "bg-gray-300 accent-cyan-500"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </ControlPanel>
            <ControlPanel
              title="Transfer Mode"
              isOpen={panelStates.mode}
              onToggle={() => togglePanel("mode")}
              isDark={isDark}
            >
              <div className="space-y-4">
                {/* Toggle Buttons */}
                <div className={`flex rounded-lg p-1 ${
                  isDark ? "bg-gray-700" : "bg-gray-200"
                }`}>
                  <button
                    onClick={() => setTransferMode("conduction")}
                    className={`flex-1 px-4 py-2 text-xs font-medium rounded-md transition-all duration-200 cursor-pointer ${
                      transferMode === "conduction"
                        ? isDark
                          ? "bg-cyan-600 text-white shadow-sm"
                          : "bg-cyan-500 text-white shadow-sm"
                        : isDark
                          ? "text-gray-300 hover:text-white hover:bg-gray-600"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    Conduction
                  </button>
                  <button
                    onClick={() => setTransferMode("convection")}
                    className={`flex-1 px-4 py-2 text-xs font-medium rounded-md transition-all duration-200 cursor-pointer ${
                      transferMode === "convection"
                        ? isDark
                          ? "bg-cyan-600 text-white shadow-sm"
                          : "bg-cyan-500 text-white shadow-sm"
                        : isDark
                          ? "text-gray-300 hover:text-white hover:bg-gray-600"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    Convection
                  </button>
                </div>
                {/* Mode Explanations */}
                <div className={`p-3 rounded-lg ${
                  isDark ? "bg-gray-700/50 border border-gray-600" : "bg-gray-50 border border-gray-200"
                }`}>
                  {transferMode === "conduction" ? (
                    <div>
                      <h4 className={`text-xs font-semibold mb-2 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
                        Conduction Mode
                      </h4>
                      <p className={`text-xs leading-relaxed mb-3 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        Heat transfer through direct contact between materials. Energy moves from high to low temperature regions through molecular vibrations and collisions.
                      </p>
                      {/* Properties */}
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>Transfer Rate:</span>
                          <span className={`text-xs font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>High</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>Distance Factor:</span>
                          <span className={`text-xs font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Direct Contact</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>Efficiency:</span>
                          <span className={`text-xs font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Very High</span>
                        </div>
                      </div>
                      <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        <span className="font-medium">Best for:</span> Solid materials in direct contact
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className={`text-xs font-semibold mb-2 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
                        Convection Mode
                      </h4>
                      <p className={`text-xs leading-relaxed mb-3 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        Heat transfer through fluid motion (air or liquid). Warm fluid rises while cool fluid sinks, creating circulation patterns that distribute heat.
                      </p>
                      {/* Properties */}
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>Transfer Rate:</span>
                          <span className={`text-xs font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Medium</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>Distance Factor:</span>
                          <span className={`text-xs font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Air Gap</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>Efficiency:</span>
                          <span className={`text-xs font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Moderate</span>
                        </div>
                      </div>
                      <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        <span className="font-medium">Best for:</span> Materials separated by air or fluid
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ControlPanel>
            <ControlPanel
              title="Physical Properties"
              isOpen={panelStates.properties}
              onToggle={() => togglePanel("properties")}
              isDark={isDark}
            >
              <div className="space-y-3">
                {/* Block 1 */}
                <div className={`p-3 rounded-lg ${
                  isDark ? "bg-gray-700/50 border border-gray-600" : "bg-gray-50 border border-gray-200"
                }`}>
                  <h4 className={`text-sm font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>Block 1</h4>
                  <div className="space-y-3">
                    {/* Mass */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                          Mass
                        </label>
                        <div className={`px-2 py-1 rounded text-xs font-semibold ${
                          isDark ? "bg-gray-800 text-white border border-gray-600" : "bg-gray-50 text-gray-900 border border-gray-200"
                        }`}>
                          {blocks[0].mass.toFixed(1)} kg
                        </div>
                      </div>
                      <input
                        type="range"
                      min={0.1}
                      max={5}
                      step={0.1}
                        value={blocks[0].mass}
                        onChange={(e) => updateBlockProperty("1", "mass", Number(e.target.value))}
                        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                          isDark ? "bg-gray-600 accent-cyan-500" : "bg-gray-300 accent-cyan-500"
                        }`}
                      />
                    </div>
                    {/* Surface Area */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                          Surface Area
                        </label>
                        <div className={`px-2 py-1 rounded text-xs font-semibold ${
                          isDark ? "bg-gray-800 text-white border border-gray-600" : "bg-gray-50 text-gray-900 border border-gray-200"
                        }`}>
                          {blocks[0].surfaceArea.toFixed(3)} m²
                        </div>
                      </div>
                      <input
                        type="range"
                      min={0.001}
                      max={0.1}
                      step={0.001}
                        value={blocks[0].surfaceArea}
                        onChange={(e) => updateBlockProperty("1", "surfaceArea", Number(e.target.value))}
                        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                          isDark ? "bg-gray-600 accent-cyan-500" : "bg-gray-300 accent-cyan-500"
                        }`}
                    />
                  </div>
                </div>
                </div>
                {/* Block 2 */}
                <div className={`p-3 rounded-lg ${
                  isDark ? "bg-gray-700/50 border border-gray-600" : "bg-gray-50 border border-gray-200"
                }`}>
                  <h4 className={`text-sm font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>Block 2</h4>
                  <div className="space-y-3">
                    {/* Mass */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                          Mass
                        </label>
                        <div className={`px-2 py-1 rounded text-xs font-semibold ${
                          isDark ? "bg-gray-800 text-white border border-gray-600" : "bg-gray-50 text-gray-900 border border-gray-200"
                        }`}>
                          {blocks[1].mass.toFixed(1)} kg
                        </div>
                      </div>
                      <input
                        type="range"
                      min={0.1}
                      max={5}
                      step={0.1}
                        value={blocks[1].mass}
                        onChange={(e) => updateBlockProperty("2", "mass", Number(e.target.value))}
                        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                          isDark ? "bg-gray-600 accent-cyan-500" : "bg-gray-300 accent-cyan-500"
                        }`}
                      />
                    </div>
                    {/* Surface Area */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                          Surface Area
                        </label>
                        <div className={`px-2 py-1 rounded text-xs font-semibold ${
                          isDark ? "bg-gray-800 text-white border border-gray-600" : "bg-gray-50 text-gray-900 border border-gray-200"
                        }`}>
                          {blocks[1].surfaceArea.toFixed(3)} m²
                        </div>
                      </div>
                      <input
                        type="range"
                      min={0.001}
                      max={0.1}
                      step={0.001}
                        value={blocks[1].surfaceArea}
                        onChange={(e) => updateBlockProperty("2", "surfaceArea", Number(e.target.value))}
                        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                          isDark ? "bg-gray-600 accent-cyan-500" : "bg-gray-300 accent-cyan-500"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ControlPanel>
          </motion.div>
        </motion.div>
          </div>
      <footer
        className={`w-full py-4 px-4 mt-auto ${
          isDark ? "bg-gray-900 border-gray-700 text-gray-400" : "bg-gray-50 border-gray-200 text-gray-500"
        } border-t text-center`}
      >
        <div className="text-xs sm:text-sm leading-relaxed">
          2025 HeatFlow Pro. All rights reserved. Built for educational excellence.
        </div>
      </footer>
    </>
  )
}
const Header: FC = () => {
  const { isDark } = useContext(ThemeContext)
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 ${
        isDark ? "bg-gray-900/95" : "bg-white/95"
      } backdrop-blur-md border-b ${
        isDark ? "border-gray-700" : "border-gray-200"
      } transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center space-x-3"
          >
            <div className={`p-2 rounded-lg ${
              isDark ? "bg-gradient-to-br from-cyan-500 to-blue-600" : "bg-gradient-to-br from-cyan-500 to-blue-600"
            }`}>
              <MdThermostat className="w-6 h-6 text-white" />
      </div>
            <h1 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              HeatFlow Pro
            </h1>
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ThemeToggle />
          </motion.div>
          </div>
          </div>
    </motion.header>
  )
}
const StatsSection: FC = () => {
  const { isDark } = useContext(ThemeContext)
  const stats = [
    { icon: MdSchool, value: "10,000+", label: "Students Taught" },
    { icon: MdScience, value: "500+", label: "Simulations Run" },
    { icon: MdLightbulb, value: "98%", label: "Understanding Rate" },
    { icon: MdSpeed, value: "24/7", label: "Available" }
  ]
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-16"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className={`text-center p-4 md:p-6 rounded-2xl ${
            isDark
              ? "bg-gray-800/90 border border-gray-700"
              : "bg-gray-50 border border-gray-200 shadow-sm"
          } hover:scale-105 transition-transform duration-300`}
        >
          <div className={`inline-flex p-3 rounded-full mb-4 ${
            isDark
              ? "bg-gradient-to-br from-cyan-600 to-blue-700"
              : "bg-gradient-to-br from-cyan-500 to-blue-600"
          }`}>
            <stat.icon className="w-6 h-6 text-white" />
          </div>
          <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            {stat.value}
        </div>
          <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {stat.label}
        </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
const LandingPage: FC<{ onStart: () => void }> = ({ onStart }) => {
  const { isDark } = useContext(ThemeContext)
  const features = [
    {
      icon: MdViewInAr,
      title: "Interactive Materials",
      description: "Drag and drop different materials like copper and wood to see how thermal properties affect heat transfer in real-time.",
      color: "from-cyan-500 to-blue-600"
    },
    {
      icon: MdShowChart,
      title: "Real-time Analytics",
      description: "Watch temperature changes over time with dynamic graphs that update as heat flows between materials.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: MdScience,
      title: "Physics Modes",
      description: "Switch between conduction and convection modes to understand different heat transfer mechanisms.",
      color: "from-cyan-600 to-blue-700"
    },
    {
      icon: MdTune,
      title: "Customizable Properties",
      description: "Adjust mass, surface area, thermal conductivity, and initial temperatures to explore various scenarios.",
      color: "from-blue-600 to-cyan-700"
    }
  ]
  return (
    <>
      <Header />
      <div className={`min-h-screen ${
        isDark 
          ? "bg-gray-900" 
          : "bg-white"
      } transition-all duration-500`}>
        {/* Hero Section */}
        <section className="min-h-[80vh] md:min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-8 md:pt-0 md:pb-0">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`text-3xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Master{" "}
                <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  Heat Transfer
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className={`text-base md:text-xl max-w-3xl mx-auto mb-8 md:mb-12 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
                Explore thermodynamics through interactive simulations. Visualize heat flow, experiment with materials, 
                and understand the principles that govern energy transfer in our world.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <motion.button
                  onClick={onStart}
                  whileHover={{ opacity: 0.9 }}
                  whileTap={{ opacity: 0.8 }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 cursor-pointer"
                >
                                     <MdPlayArrow className="w-5 h-5" />
                   Start Simulation
                </motion.button>
              </motion.div>
            </motion.div>
                         <StatsSection />
            </div>
         </section>
         {/* Divider */}
         <div className="relative">
           <div className={`h-px ${
             isDark ? "bg-gradient-to-r from-transparent via-gray-700 to-transparent" : "bg-gradient-to-r from-transparent via-gray-300 to-transparent"
           }`} />
           <div className="absolute inset-0 flex items-center justify-center">
             <div className={`w-2 h-2 rounded-full ${
               isDark ? "bg-cyan-400" : "bg-cyan-500"
             }`} />
           </div>
         </div>
         {/* Features Section */}
         <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                Powerful Learning Features
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}>
                Everything you need to understand heat transfer concepts through hands-on experimentation
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-6 rounded-2xl ${
                isDark
                      ? "bg-gray-800/90 border border-gray-700"
                      : "bg-gray-50 border border-gray-200 shadow-sm"
                  } transition-all duration-300 hover:shadow-lg`}
                >
                  <div className={`inline-flex p-4 rounded-2xl mb-6 bg-gradient-to-br ${feature.color}`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}>
                    {feature.title}
              </h3>
                  <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    {feature.description}
              </p>
                </motion.div>
              ))}
            </div>
                     </div>
         </section>
         {/* Divider */}
         <div className="relative">
           <div className={`h-px ${
             isDark ? "bg-gradient-to-r from-transparent via-gray-700 to-transparent" : "bg-gradient-to-r from-transparent via-gray-300 to-transparent"
           }`} />
           <div className="absolute inset-0 flex items-center justify-center">
             <div className={`w-8 h-px ${
               isDark ? "bg-gradient-to-r from-cyan-400 to-blue-500" : "bg-gradient-to-r from-cyan-500 to-blue-600"
             }`} />
           </div>
         </div>
         {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
                        className={`max-w-4xl mx-auto text-center p-12 rounded-3xl ${
                isDark
                ? "bg-gray-800/90 border border-gray-700"
                : "bg-gray-50 border border-gray-200 shadow-lg"
            }`}
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              Ready to Explore Heat Transfer?
            </h2>
            <p className={`text-lg mb-8 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Join thousands of students and professionals who have enhanced their understanding of thermodynamics 
              through our interactive simulations.
            </p>
            <motion.button
            onClick={onStart}
              whileHover={{ opacity: 0.9, y: -2 }}
              whileTap={{ opacity: 0.8 }}
              className="inline-flex items-center justify-center gap-2 md:gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-6 py-3 md:px-8 md:py-4 rounded-xl text-base md:text-lg shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 focus:outline-none focus:ring-4 focus:ring-cyan-300/50 w-full sm:w-auto"
            >
              <MdRocket className="w-4 h-4 md:w-5 md:h-5" />
              Launch Simulation Now
            </motion.button>
                     </motion.div>
         </section>
         {/* Footer */}
        <footer className={`${
          isDark ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"
        } border-t`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                  <div className={`p-2 rounded-lg ${
                    isDark ? "bg-gradient-to-br from-cyan-500 to-blue-600" : "bg-gradient-to-br from-cyan-500 to-blue-600"
                  }`}>
                    <MdThermostat className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
                  <h3 className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    HeatFlow Pro
                  </h3>
                </div>
                <p className={`${isDark ? "text-gray-300" : "text-gray-600"} max-w-md text-sm sm:text-base leading-relaxed`}>
                  Advanced heat transfer simulation platform designed for students, educators, and professionals 
                  to explore thermodynamic principles through interactive learning.
              </p>
            </div>
              <div className="sm:col-span-1">
                <h4 className={`text-base sm:text-lg font-bold mb-4 sm:mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Features
                </h4>
                <ul className={`space-y-2 sm:space-y-3 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  <li>
                    <a href="#" className="text-xs sm:text-sm hover:text-cyan-500 transition-colors duration-200 block">
                      Interactive Simulations
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-xs sm:text-sm hover:text-cyan-500 transition-colors duration-200 block">
                      Real-time Visualization
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-xs sm:text-sm hover:text-cyan-500 transition-colors duration-200 block">
                      Material Properties
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-xs sm:text-sm hover:text-cyan-500 transition-colors duration-200 block">
                      Physics Modes
                    </a>
                  </li>
              </ul>
            </div>
              <div className="sm:col-span-1">
                <h4 className={`text-base sm:text-lg font-bold mb-4 sm:mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Support
                </h4>
                <ul className={`space-y-2 sm:space-y-3 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  <li>
                    <a href="#" className="text-xs sm:text-sm hover:text-cyan-500 transition-colors duration-200 block">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-xs sm:text-sm hover:text-cyan-500 transition-colors duration-200 block">
                      Tutorials
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-xs sm:text-sm hover:text-cyan-500 transition-colors duration-200 block">
                      Community
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-xs sm:text-sm hover:text-cyan-500 transition-colors duration-200 block">
                      Contact Us
                    </a>
                  </li>
                </ul>
            </div>
          </div>
            <div className={`mt-8 sm:mt-12 pt-6 sm:pt-8 border-t ${
              isDark ? "border-gray-700" : "border-gray-200"
            } text-center`}>
              <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-xs sm:text-sm`}>
                2025 HeatFlow Pro. All rights reserved. Built for educational excellence.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
const ThemeToggle: FC = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext)
  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ opacity: 0.8 }}
      whileTap={{ opacity: 0.7 }}
      className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer ${
        isDark 
          ? "bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-gray-600" 
          : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
      }`}
      aria-label="Toggle theme"
    >
             {isDark ? <MdLightMode className="w-5 h-5" /> : <MdDarkMode className="w-5 h-5" />}
    </motion.button>
  )
}
const App: FC = () => {
  const [isDark, setIsDark] = useState(false)
  const [currentPage, setCurrentPage] = useState<"landing" | "simulation">("landing")

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const startSimulation = () => {
    setCurrentPage("simulation")
  }

  const goToLanding = () => {
    setCurrentPage("landing")
  }

  // Reset scroll position whenever page changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPage])

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <GoogleFontsLoader />
      <div className={`${isDark ? "dark" : ""} font-poppins`} style={{ fontFamily: "'Poppins', sans-serif" }}>
        <div key={currentPage} className="w-full h-full">
        {currentPage === "landing" ? (
          <LandingPage onStart={startSimulation} />
        ) : (
          <HeatTransferSimulation onBack={goToLanding} />
        )}
        </div>
      </div>
    </ThemeContext.Provider>
  )
}
export default App

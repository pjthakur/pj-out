"use client"
import type React from "react"
if (typeof document !== 'undefined') {
  const link = document.createElement('link')
  link.href = 'https://fonts.googleapis.com/css2?family=Oxanium:wght@300;400;500;600;700&display=swap'
  link.rel = 'stylesheet'
  document.head.appendChild(link)
  const style = document.createElement('style')
  style.textContent = `
    ::-webkit-scrollbar {
      display: none;
    }
    * {
      scrollbar-width: none;
    }
    * {
      -ms-overflow-style: none;
    }
    html, body {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    html::-webkit-scrollbar, body::-webkit-scrollbar {
      display: none;
    }
  `
  document.head.appendChild(style)
}
import { useState, useEffect, useCallback, useRef } from "react"
import {
  FaPlay as Play,
  FaPause as Pause,
  FaBolt as Zap,
  FaGem as Gem,
  FaAtom as Atom,
  FaStar as Star,
  FaRocket as Rocket,
  FaCog as Cog,
  FaShieldAlt as Shield,
  FaBullseye as Target,
  FaClock as Clock,
  FaMicrochip as Cpu,
  FaDatabase as Database,
  FaSatellite as Satellite,
  FaGlobe as Globe,
  FaIndustry as Factory,
  FaWrench as Wrench,
  FaFlask as Beaker,
  FaCrown as Crown,
  FaCog as Settings,
  FaFire as Flame,
  FaSave as Save,
  FaSkull as Skull,
  FaSun as Sun,
  FaPlane as Plane,
  FaHome as Home,
  FaMicroscope as Microscope,
  FaCircle as Circle,
  FaGem as Diamond,
  FaChartLine as TrendingUp,
  FaUsers as Users,
  FaBuilding as Building,
  FaBookOpen as BookOpen,
  FaMap as Map,
  FaDollarSign as DollarSign,
  FaChartBar as BarChart3,
  FaTrophy as Trophy,
  FaVolumeUp as Volume2,
  FaVolumeMute as VolumeX,
  FaBell as Bell,
  FaTimes as X,
  FaCheck as Check,
  FaExclamationTriangle as AlertTriangle,
  FaInfoCircle as Info,
  FaCheckCircle as CheckCircle,
  FaTimesCircle as XCircle,
  FaBars as Menu,
  FaEllipsisV as MoreVertical,
} from "react-icons/fa"
interface GameState {
  resources: {
    energy: number
    minerals: number
    darkMatter: number
    antimatter: number
    quantumFlux: number
    nanobots: number
    crystals: number
    plasma: number
  }
  buildings: {
    solarPanels: number
    miners: number
    reactors: number
    collectors: number
    refineries: number
    laboratories: number
    factories: number
    shipyards: number
  }
  fleet: {
    scouts: number
    frigates: number
    destroyers: number
    battleships: number
    carriers: number
    dreadnoughts: number
  }
  research: {
    energyEfficiency: number
    miningSpeed: number
    fleetCapacity: number
    darkMatterTech: number
    antimatterTech: number
    quantumComputing: number
    nanotechnology: number
    crystalTech: number
    plasmaTech: number
    warpDrive: number
    shielding: number
    weaponSystems: number
  }
  territories: {
    solarSystems: number
    planets: number
    moons: number
    asteroids: number
    spaceStations: number
  }
  achievements: { [key: string]: boolean }
  stats: {
    totalEarnings: number
    prestigeLevel: number
    lastSave: number
    totalPlayTime: number
    startTime: number
    totalClicks: number
    buildingsBuilt: number
    shipsLaunched: number
    researchCompleted: number
  }
  market: {
    prices: { [key: string]: number }
    lastUpdate: number
  }
}
const initialState: GameState = {
  resources: {
    energy: 1000,
    minerals: 500,
    darkMatter: 0,
    antimatter: 0,
    quantumFlux: 0,
    nanobots: 0,
    crystals: 0,
    plasma: 0,
  },
  buildings: {
    solarPanels: 2,
    miners: 1,
    reactors: 0,
    collectors: 0,
    refineries: 0,
    laboratories: 0,
    factories: 0,
    shipyards: 0,
  },
  fleet: {
    scouts: 0,
    frigates: 0,
    destroyers: 0,
    battleships: 0,
    carriers: 0,
    dreadnoughts: 0,
  },
  research: {
    energyEfficiency: 0,
    miningSpeed: 0,
    fleetCapacity: 0,
    darkMatterTech: 0,
    antimatterTech: 0,
    quantumComputing: 0,
    nanotechnology: 0,
    crystalTech: 0,
    plasmaTech: 0,
    warpDrive: 0,
    shielding: 0,
    weaponSystems: 0,
  },
  territories: {
    solarSystems: 1,
    planets: 1,
    moons: 0,
    asteroids: 0,
    spaceStations: 0,
  },
  achievements: {},
  stats: {
    totalEarnings: 0,
    prestigeLevel: 0,
    lastSave: Date.now(),
    totalPlayTime: 0,
    startTime: Date.now(),
    totalClicks: 0,
    buildingsBuilt: 0,
    shipsLaunched: 0,
    researchCompleted: 0,
  },
  market: {
    prices: {
      energy: 1.0,
      minerals: 1.2,
      darkMatter: 10.0,
      antimatter: 50.0,
      quantumFlux: 100.0,
      nanobots: 500.0,
      crystals: 25.0,
      plasma: 75.0,
    },
    lastUpdate: Date.now(),
  },
}
const BUILDING_DATA = {
  solarPanels: {
    name: "Solar Panel",
    icon: Sun,
    description: "Converts stellar radiation into energy",
    baseProduction: { energy: 3 },
    baseCost: { energy: 100 },
    costMultiplier: 1.15,
    unlocked: true,
  },
  miners: {
    name: "Mining Drone",
    icon: Gem,
    description: "Extracts minerals from asteroids",
    baseProduction: { minerals: 2 },
    baseCost: { energy: 200, minerals: 50 },
    costMultiplier: 1.15,
    unlocked: true,
  },
  reactors: {
    name: "Fusion Reactor",
    icon: Atom,
    description: "High-efficiency energy generation",
    baseProduction: { energy: 25 },
    baseCost: { energy: 1000, minerals: 400 },
    costMultiplier: 1.2,
    unlocked: true,
  },
  collectors: {
    name: "Dark Matter Collector",
    icon: Database,
    description: "Harvests exotic dark matter",
    baseProduction: { darkMatter: 0.2 },
    baseCost: { energy: 5000, minerals: 2000 },
    costMultiplier: 1.25,
    unlocked: true,
  },
  refineries: {
    name: "Antimatter Refinery",
    icon: Beaker,
    description: "Processes dark matter into antimatter",
    baseProduction: { antimatter: 0.05 },
    baseCost: { energy: 10000, minerals: 5000, darkMatter: 100 },
    costMultiplier: 1.3,
    unlockRequirement: { research: { darkMatterTech: 1 } },
  },
  laboratories: {
    name: "Research Laboratory",
    icon: Microscope,
    description: "Accelerates research progress",
    baseProduction: { quantumFlux: 0.1 },
    baseCost: { energy: 25000, minerals: 10000, darkMatter: 500 },
    costMultiplier: 1.35,
    unlockRequirement: { research: { quantumComputing: 1 } },
  },
  factories: {
    name: "Nanobot Factory",
    icon: Factory,
    description: "Produces self-replicating nanobots",
    baseProduction: { nanobots: 1 },
    baseCost: { energy: 50000, minerals: 25000, antimatter: 100 },
    costMultiplier: 1.4,
    unlockRequirement: { research: { nanotechnology: 1 } },
  },
  shipyards: {
    name: "Orbital Shipyard",
    icon: Wrench,
    description: "Constructs advanced spacecraft",
    baseProduction: { crystals: 0.1 },
    baseCost: { energy: 100000, minerals: 50000, antimatter: 500 },
    costMultiplier: 1.45,
    unlockRequirement: { research: { fleetCapacity: 3 } },
  },
}
const FLEET_DATA = {
  scouts: {
    name: "Scout Ship",
    icon: Satellite,
    description: "Fast reconnaissance vessel",
    baseStats: { exploration: 1, combat: 0.1 },
    baseCost: { energy: 500, minerals: 200 },
    costMultiplier: 1.1,
    unlocked: true,
  },
  frigates: {
    name: "Frigate",
    icon: Shield,
    description: "Balanced combat vessel",
    baseStats: { exploration: 0.5, combat: 1 },
    baseCost: { energy: 2000, minerals: 800, darkMatter: 20 },
    costMultiplier: 1.15,
    unlockRequirement: { research: { fleetCapacity: 1 } },
  },
  destroyers: {
    name: "Destroyer",
    icon: Target,
    description: "Heavy combat vessel",
    baseStats: { exploration: 0.3, combat: 2.5 },
    baseCost: { energy: 8000, minerals: 3000, darkMatter: 100 },
    costMultiplier: 1.2,
    unlockRequirement: { research: { weaponSystems: 2 } },
  },
  battleships: {
    name: "Battleship",
    icon: Globe,
    description: "Massive warship",
    baseStats: { exploration: 0.2, combat: 5 },
    baseCost: { energy: 25000, minerals: 10000, darkMatter: 500, antimatter: 50 },
    costMultiplier: 1.25,
    unlockRequirement: { research: { weaponSystems: 5 } },
  },
  carriers: {
    name: "Carrier",
    icon: Plane,
    description: "Mobile fleet command center",
    baseStats: { exploration: 1, combat: 3, support: 2 },
    baseCost: { energy: 100000, minerals: 40000, antimatter: 200, nanobots: 500 },
    costMultiplier: 1.3,
    unlockRequirement: { research: { fleetCapacity: 8 } },
  },
  dreadnoughts: {
    name: "Dreadnought",
    icon: Skull,
    description: "Ultimate weapon of war",
    baseStats: { combat: 15, intimidation: 5 },
    baseCost: { energy: 500000, minerals: 200000, antimatter: 1000, crystals: 100 },
    costMultiplier: 1.35,
    unlockRequirement: { research: { weaponSystems: 10 } },
  },
}
const RESEARCH_DATA = {
  energyEfficiency: {
    name: "Energy Efficiency",
    icon: Zap,
    description: "Improves energy production by 25% per level",
    baseCost: { energy: 2000 },
    costMultiplier: 2.5,
    maxLevel: 20,
    unlocked: true,
  },
  miningSpeed: {
    name: "Mining Speed",
    icon: Gem,
    description: "Increases mineral extraction by 30% per level",
    baseCost: { energy: 3000, minerals: 1000 },
    costMultiplier: 2.5,
    maxLevel: 20,
    unlocked: true,
  },
  fleetCapacity: {
    name: "Fleet Capacity",
    icon: Rocket,
    description: "Unlocks new ship types and improves fleet effectiveness",
    baseCost: { energy: 5000, minerals: 2000 },
    costMultiplier: 3,
    maxLevel: 15,
    unlocked: true,
  },
  darkMatterTech: {
    name: "Dark Matter Technology",
    icon: Atom,
    description: "Enables dark matter manipulation and improves collection",
    baseCost: { energy: 10000, minerals: 5000 },
    costMultiplier: 3.5,
    maxLevel: 12,
    unlocked: true,
  },
  antimatterTech: {
    name: "Antimatter Technology",
    icon: Star,
    description: "Unlocks antimatter production and applications",
    baseCost: { energy: 25000, darkMatter: 500 },
    costMultiplier: 4,
    maxLevel: 10,
    unlockRequirement: { research: { darkMatterTech: 3 } },
  },
  quantumComputing: {
    name: "Quantum Computing",
    icon: Cpu,
    description: "Enables quantum calculations and advanced research",
    baseCost: { energy: 50000, minerals: 20000, darkMatter: 1000 },
    costMultiplier: 4.5,
    maxLevel: 10,
    unlockRequirement: { research: { darkMatterTech: 5 } },
  },
  nanotechnology: {
    name: "Nanotechnology",
    icon: Cog,
    description: "Enables molecular-scale manufacturing",
    baseCost: { energy: 100000, antimatter: 500 },
    costMultiplier: 5,
    maxLevel: 8,
    unlockRequirement: { research: { antimatterTech: 3, quantumComputing: 2 } },
  },
  crystalTech: {
    name: "Crystal Technology",
    icon: Diamond,
    description: "Harnesses the power of exotic crystals",
    baseCost: { energy: 200000, nanobots: 1000, quantumFlux: 100 },
    costMultiplier: 5.5,
    maxLevel: 8,
    unlockRequirement: { research: { nanotechnology: 3 } },
  },
  plasmaTech: {
    name: "Plasma Technology",
    icon: Flame,
    description: "Controls high-energy plasma states",
    baseCost: { energy: 500000, crystals: 500, quantumFlux: 250 },
    costMultiplier: 6,
    maxLevel: 8,
    unlockRequirement: { research: { crystalTech: 3 } },
  },
  warpDrive: {
    name: "Warp Drive",
    icon: Rocket,
    description: "Enables faster-than-light travel",
    baseCost: { energy: 1000000, antimatter: 5000, crystals: 1000 },
    costMultiplier: 7,
    maxLevel: 10,
    unlockRequirement: { research: { plasmaTech: 2, fleetCapacity: 8 } },
  },
  shielding: {
    name: "Advanced Shielding",
    icon: Shield,
    description: "Protects against cosmic threats",
    baseCost: { energy: 150000, minerals: 50000, darkMatter: 2000 },
    costMultiplier: 4,
    maxLevel: 12,
    unlockRequirement: { research: { fleetCapacity: 3 } },
  },
  weaponSystems: {
    name: "Weapon Systems",
    icon: Target,
    description: "Develops advanced combat technologies",
    baseCost: { energy: 300000, minerals: 100000, antimatter: 1000 },
    costMultiplier: 4.5,
    maxLevel: 20,
    unlockRequirement: { research: { fleetCapacity: 2 } },
  },
}
const ACHIEVEMENTS = {
  firstStep: {
    name: "First Step",
    description: "Build your first structure",
    icon: Home,
    requirement: { buildingsBuilt: 1 },
    reward: { energy: 1000 },
  },
  energyMaster: {
    name: "Energy Master",
    description: "Reach 1M energy",
    icon: Zap,
    requirement: { resources: { energy: 1000000 } },
    reward: { energy: 10000 },
  },
  fleetCommander: {
    name: "Fleet Commander",
    description: "Launch 100 ships",
    icon: Rocket,
    requirement: { shipsLaunched: 100 },
    reward: { minerals: 50000 },
  },
  researcher: {
    name: "Researcher",
    description: "Complete 10 research projects",
    icon: Beaker,
    requirement: { researchCompleted: 10 },
    reward: { darkMatter: 1000 },
  },
  industrialist: {
    name: "Industrialist",
    description: "Build 1000 structures",
    icon: Factory,
    requirement: { buildingsBuilt: 1000 },
    reward: { antimatter: 500 },
  },
  warlord: {
    name: "Warlord",
    description: "Launch 1000 warships",
    icon: Skull,
    requirement: { shipsLaunched: 1000 },
    reward: { crystals: 100 },
  },
  emperor: {
    name: "Emperor",
    description: "Control 100 solar systems",
    icon: Crown,
    requirement: { territories: { solarSystems: 100 } },
    reward: { plasma: 50 },
  },
  transcendent: {
    name: "Transcendent",
    description: "Reach prestige level 10",
    icon: Star,
    requirement: { prestigeLevel: 10 },
    reward: { quantumFlux: 1000 },
  },
}
export default function SpaceIdleGame() {
  const [gameState, setGameState] = useState<GameState>(initialState)
  const [gameStarted, setGameStarted] = useState(false)
  const [hasSavedData, setHasSavedData] = useState(false)
  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])
  const [isPlaying, setIsPlaying] = useState(true)
  const [activeTab, setActiveTab] = useState("buildings")
  const [notifications, setNotifications] = useState<
    Array<{ id: string; message: string; type: string; timestamp: number }>
  >([])
  const [showStats, setShowStats] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(Date.now())
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
  const gameStateRef = useRef<GameState>(gameState)
  const formatNumber = (num: number): string => {
    if (num >= 1e15) return (num / 1e15).toFixed(2) + "Q"
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T"
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B"
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M"
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K"
    return num.toFixed(1)
  }
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    if (hours > 0) return `${hours}h ${minutes}m`
    if (minutes > 0) return `${minutes}m ${secs}s`
    return `${secs}s`
  }
  const addNotification = useCallback((message: string, type: "info" | "success" | "warning" | "error" = "info") => {
    const notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: Date.now(),
    }
    setNotifications((prev) => [...prev.slice(-4), notification])
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
    }, 5000)
  }, [])
  const checkAchievements = useCallback(
    (state: GameState) => {
      Object.entries(ACHIEVEMENTS).forEach(([key, achievement]) => {
        if (state.achievements[key]) return
        let unlocked = false
        const req = achievement.requirement
        if ("buildingsBuilt" in req && state.stats.buildingsBuilt >= req.buildingsBuilt) unlocked = true
        if ("shipsLaunched" in req && state.stats.shipsLaunched >= req.shipsLaunched) unlocked = true
        if ("researchCompleted" in req && state.stats.researchCompleted >= req.researchCompleted) unlocked = true
        if ("prestigeLevel" in req && state.stats.prestigeLevel >= req.prestigeLevel) unlocked = true
        if ("resources" in req) {
          unlocked = Object.entries(req.resources).every(
            ([resource, amount]) => state.resources[resource as keyof GameState["resources"]] >= (amount as number),
          )
        }
        if ("territories" in req) {
          unlocked = Object.entries(req.territories).every(
            ([territory, amount]) => state.territories[territory as keyof GameState["territories"]] >= (amount as number),
          )
        }
        if (unlocked) {
          setGameState((prev) => ({
            ...prev,
            achievements: { ...prev.achievements, [key]: true },
            resources: {
              ...prev.resources,
              ...Object.fromEntries(
                Object.entries(achievement.reward).map(([resource, amount]) => [
                  resource,
                  prev.resources[resource as keyof GameState["resources"]] + amount,
                ]),
              ),
            },
          }))
          addNotification(`Achievement Unlocked: ${achievement.name}!`, "success")
        }
      })
    },
    [addNotification],
  )
  const isUnlocked = useCallback((item: any, state: GameState) => {
    if (item.unlocked) return true
    if (!item.unlockRequirement) return false
    const req = item.unlockRequirement
    if (req.research) {
      return Object.entries(req.research).every(
        ([tech, level]) => state.research[tech as keyof GameState["research"]] >= (level as number),
      )
    }
    return false
  }, [])
  const calculateProduction = useCallback((state: GameState) => {
    const production = {
      energy: 0,
      minerals: 0,
      darkMatter: 0,
      antimatter: 0,
      quantumFlux: 0,
      nanobots: 0,
      crystals: 0,
      plasma: 0,
    }
    Object.entries(BUILDING_DATA).forEach(([buildingKey, buildingData]) => {
      const count = state.buildings[buildingKey as keyof GameState["buildings"]]
      if (count > 0 && buildingData.baseProduction) {
        Object.entries(buildingData.baseProduction).forEach(([resource, amount]) => {
          production[resource as keyof typeof production] += amount * count
        })
      }
    })
    const energyMult = 1 + state.research.energyEfficiency * 0.25
    const miningMult = 1 + state.research.miningSpeed * 0.3
    const darkMatterMult = 1 + state.research.darkMatterTech * 0.4
    const antimatterMult = 1 + state.research.antimatterTech * 0.5
    const quantumMult = 1 + state.research.quantumComputing * 0.3
    const nanoMult = 1 + state.research.nanotechnology * 0.4
    const crystalMult = 1 + state.research.crystalTech * 0.5
    const plasmaMult = 1 + state.research.plasmaTech * 0.6
    production.energy *= energyMult
    production.minerals *= miningMult
    production.darkMatter *= darkMatterMult
    production.antimatter *= antimatterMult
    production.quantumFlux *= quantumMult
    production.nanobots *= nanoMult
    production.crystals *= crystalMult
    production.plasma *= plasmaMult
    const fleetBonus = Object.entries(FLEET_DATA).reduce((total, [shipKey, shipData]) => {
      const count = state.fleet[shipKey as keyof GameState["fleet"]]
      const explorationValue = "exploration" in shipData.baseStats ? shipData.baseStats.exploration : 0
      return total + count * explorationValue * 0.1
    }, 0)
    Object.keys(production).forEach((resource) => {
      production[resource as keyof typeof production] += fleetBonus
    })
    const territoryMult =
      1 +
      (state.territories.solarSystems - 1) * 0.1 +
      state.territories.planets * 0.05 +
      state.territories.spaceStations * 0.02
    Object.keys(production).forEach((resource) => {
      production[resource as keyof typeof production] *= territoryMult
    })
    const prestigeMult = 1 + state.stats.prestigeLevel * 0.1
    Object.keys(production).forEach((resource) => {
      production[resource as keyof typeof production] *= prestigeMult
    })
    return production
  }, [])
  const gameLoop = useCallback(() => {
    if (!isPlaying) return
    const now = Date.now()
    const deltaTime = (now - lastUpdate) / 1000
    setLastUpdate(now)
    setGameState((prevState) => {
      const production = calculateProduction(prevState)
      const newResources = { ...prevState.resources }
      Object.entries(production).forEach(([resource, amount]) => {
        newResources[resource as keyof GameState["resources"]] += amount * deltaTime
      })
      const newState = {
        ...prevState,
        resources: newResources,
        stats: {
          ...prevState.stats,
          totalEarnings: prevState.stats.totalEarnings + (production.energy + production.minerals) * deltaTime,
          totalPlayTime: prevState.stats.totalPlayTime + deltaTime,
        },
      }
      checkAchievements(newState)
      return newState
    })
  }, [isPlaying, lastUpdate, calculateProduction, checkAchievements])
  useEffect(() => {
    if (isPlaying) {
      setLastUpdate(Date.now())
    }
  }, [isPlaying])
  const calculateOfflineEarnings = useCallback(
    (lastSave: number, currentTime: number, state: GameState) => {
      const offlineTime = Math.min((currentTime - lastSave) / 1000, 3600 * 12)
      const production = calculateProduction(state)
      const earnings = {
        energy: production.energy * offlineTime,
        minerals: production.minerals * offlineTime,
        darkMatter: production.darkMatter * offlineTime,
        antimatter: production.antimatter * offlineTime,
        quantumFlux: production.quantumFlux * offlineTime,
        nanobots: production.nanobots * offlineTime,
        crystals: production.crystals * offlineTime,
        plasma: production.plasma * offlineTime,
      }
      return { earnings, offlineTime }
    },
    [calculateProduction],
  )
  const saveGame = useCallback(() => {
    const currentGameState = gameStateRef.current
    const saveData = {
      ...currentGameState,
      stats: {
        ...currentGameState.stats,
        lastSave: Date.now(),
      },
    }
    localStorage.setItem("spaceIdleGame", JSON.stringify(saveData))
    addNotification("Game saved successfully", "success")
  }, [addNotification])
  const loadGame = useCallback(() => {
    try {
      const saved = localStorage.getItem("spaceIdleGame")
      if (saved) {
        const parsedState = JSON.parse(saved)
        const currentTime = Date.now()
        const { earnings, offlineTime } = calculateOfflineEarnings(parsedState.stats.lastSave, currentTime, parsedState)
        if (offlineTime > 60) {
          const totalValue = Object.values(earnings).reduce((sum, val) => sum + val, 0)
          if (totalValue > 0) {
            addNotification(`Welcome back! Offline for ${formatTime(offlineTime)}`, "info")
            addNotification(`Offline earnings: ${formatNumber(totalValue)} total resources`, "success")
          }
        }
        setGameState({
          ...parsedState,
          resources: {
            energy: parsedState.resources.energy + earnings.energy,
            minerals: parsedState.resources.minerals + earnings.minerals,
            darkMatter: parsedState.resources.darkMatter + earnings.darkMatter,
            antimatter: parsedState.resources.antimatter + earnings.antimatter,
            quantumFlux: parsedState.resources.quantumFlux + earnings.quantumFlux,
            nanobots: parsedState.resources.nanobots + earnings.nanobots,
            crystals: parsedState.resources.crystals + earnings.crystals,
            plasma: parsedState.resources.plasma + earnings.plasma,
          },
          stats: {
            ...parsedState.stats,
            lastSave: currentTime,
            totalPlayTime: parsedState.stats.totalPlayTime + offlineTime,
          },
        })
      }
    } catch (error) {
      console.error("Failed to load game:", error)
      addNotification("Failed to load saved game", "error")
    }
  }, [calculateOfflineEarnings, addNotification])
  const startNewGame = useCallback(() => {
    setGameState(initialState)
    setGameStarted(true)
    addNotification("Welcome to Cosmic Empire!", "info")
  }, [addNotification])
  const continueGame = useCallback(() => {
    loadGame()
    setGameStarted(true)
  }, [loadGame])
  const exitToMenu = useCallback(() => {
    setGameStarted(false)
  }, [])
  useEffect(() => {
    setLastUpdate(Date.now())
    try {
      const saved = localStorage.getItem("spaceIdleGame")
      setHasSavedData(saved !== null)
    } catch (error) {
      setHasSavedData(false)
    }
  }, [])
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentGameState = gameStateRef.current
      const saveData = {
        ...currentGameState,
        stats: {
          ...currentGameState.stats,
          lastSave: Date.now(),
        },
      }
      localStorage.setItem("spaceIdleGame", JSON.stringify(saveData))
    }
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleBeforeUnload()
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])
  useEffect(() => {
    const isAnyModalOpen = showStats || showAchievements
    if (isAnyModalOpen) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.right = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [showStats, showAchievements])
  useEffect(() => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    gameLoopRef.current = setInterval(gameLoop, 100)
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    }
  }, [gameLoop])
  const canAfford = useCallback(
    (costs: Partial<GameState["resources"]>) => {
      return Object.entries(costs).every(
        ([resource, cost]) => gameState.resources[resource as keyof GameState["resources"]] >= cost,
      )
    },
    [gameState.resources],
  )
  const spendResources = useCallback((costs: Partial<GameState["resources"]>) => {
    setGameState((prev) => ({
      ...prev,
      resources: {
        ...prev.resources,
        energy: prev.resources.energy - (costs.energy || 0),
        minerals: prev.resources.minerals - (costs.minerals || 0),
        darkMatter: prev.resources.darkMatter - (costs.darkMatter || 0),
        antimatter: prev.resources.antimatter - (costs.antimatter || 0),
        quantumFlux: prev.resources.quantumFlux - (costs.quantumFlux || 0),
        nanobots: prev.resources.nanobots - (costs.nanobots || 0),
        crystals: prev.resources.crystals - (costs.crystals || 0),
        plasma: prev.resources.plasma - (costs.plasma || 0),
      },
      stats: {
        ...prev.stats,
        totalClicks: prev.stats.totalClicks + 1,
      },
    }))
  }, [])
  const buyBuilding = useCallback(
    (buildingKey: keyof GameState["buildings"], costs: Partial<GameState["resources"]>) => {
      if (!canAfford(costs)) return
      spendResources(costs)
      setGameState((prev) => ({
        ...prev,
        buildings: {
          ...prev.buildings,
          [buildingKey]: prev.buildings[buildingKey] + 1,
        },
        stats: {
          ...prev.stats,
          buildingsBuilt: prev.stats.buildingsBuilt + 1,
        },
      }))
      const buildingData = BUILDING_DATA[buildingKey]
      addNotification(`Built ${buildingData.name}!`, "success")
    },
    [canAfford, spendResources, addNotification],
  )
  const buyShip = useCallback(
    (shipKey: keyof GameState["fleet"], costs: Partial<GameState["resources"]>) => {
      if (!canAfford(costs)) return
      spendResources(costs)
      setGameState((prev) => ({
        ...prev,
        fleet: {
          ...prev.fleet,
          [shipKey]: prev.fleet[shipKey] + 1,
        },
        stats: {
          ...prev.stats,
          shipsLaunched: prev.stats.shipsLaunched + 1,
        },
      }))
      const shipData = FLEET_DATA[shipKey]
      addNotification(`Launched ${shipData.name}!`, "success")
    },
    [canAfford, spendResources, addNotification],
  )
  const buyResearch = useCallback(
    (techKey: keyof GameState["research"], costs: Partial<GameState["resources"]>) => {
      const techData = RESEARCH_DATA[techKey]
      if (!canAfford(costs) || gameState.research[techKey] >= techData.maxLevel) return
      spendResources(costs)
      setGameState((prev) => ({
        ...prev,
        research: {
          ...prev.research,
          [techKey]: prev.research[techKey] + 1,
        },
        stats: {
          ...prev.stats,
          researchCompleted: prev.stats.researchCompleted + 1,
        },
      }))
      addNotification(`Researched ${techData.name} Level ${gameState.research[techKey] + 1}!`, "success")
    },
    [canAfford, spendResources, gameState.research, addNotification],
  )
  const prestige = useCallback(() => {
    if (gameState.stats.totalEarnings < 10000000) {
      addNotification("Need 10M total earnings to prestige", "warning")
      return
    }
    if (!confirm("Prestige will reset most progress but grant permanent bonuses. Continue?")) return
    setGameState((prev) => ({
      ...initialState,
      stats: {
        ...initialState.stats,
        prestigeLevel: prev.stats.prestigeLevel + 1,
        totalPlayTime: prev.stats.totalPlayTime,
        startTime: Date.now(),
        lastSave: Date.now(),
      },
      achievements: prev.achievements,
    }))
    addNotification("Prestige activated! Starting fresh with bonuses!", "success")
  }, [gameState.stats.totalEarnings, addNotification])
  const getBuildingCost = useCallback(
    (buildingKey: keyof GameState["buildings"]) => {
      const buildingData = BUILDING_DATA[buildingKey]
      const count = gameState.buildings[buildingKey]
      const costs: Partial<GameState["resources"]> = {}
      Object.entries(buildingData.baseCost).forEach(([resource, baseCost]) => {
        costs[resource as keyof GameState["resources"]] = Math.floor(
          baseCost * Math.pow(buildingData.costMultiplier, count),
        )
      })
      return costs
    },
    [gameState.buildings],
  )
  const getShipCost = useCallback(
    (shipKey: keyof GameState["fleet"]) => {
      const shipData = FLEET_DATA[shipKey]
      const count = gameState.fleet[shipKey]
      const costs: Partial<GameState["resources"]> = {}
      Object.entries(shipData.baseCost).forEach(([resource, baseCost]) => {
        costs[resource as keyof GameState["resources"]] = Math.floor(
          baseCost * Math.pow(shipData.costMultiplier, count),
        )
      })
      return costs
    },
    [gameState.fleet],
  )
  const getResearchCost = useCallback(
    (techKey: keyof GameState["research"]) => {
      const techData = RESEARCH_DATA[techKey]
      const level = gameState.research[techKey]
      const costs: Partial<GameState["resources"]> = {}
      Object.entries(techData.baseCost).forEach(([resource, baseCost]) => {
        costs[resource as keyof GameState["resources"]] = Math.floor(
          baseCost * Math.pow(techData.costMultiplier, level),
        )
      })
      return costs
    },
    [gameState.research],
  )
  const expandTerritory = useCallback(
    (territoryType: keyof GameState["territories"]) => {
      const costs = {
        solarSystems: { energy: 1000000, minerals: 500000, darkMatter: 10000, antimatter: 1000 },
        planets: { energy: 100000, minerals: 50000, darkMatter: 1000 },
        moons: { energy: 50000, minerals: 25000 },
        asteroids: { energy: 25000, minerals: 10000 },
        spaceStations: { energy: 500000, minerals: 200000, antimatter: 500, crystals: 100 },
      }
      const cost = costs[territoryType]
      const currentCount = gameState.territories[territoryType]
      const adjustedCost: Partial<GameState["resources"]> = {}
      Object.entries(cost).forEach(([resource, baseCost]) => {
        adjustedCost[resource as keyof GameState["resources"]] = Math.floor(baseCost * Math.pow(1.5, currentCount))
      })
      if (!canAfford(adjustedCost)) return
      spendResources(adjustedCost)
      setGameState((prev) => ({
        ...prev,
        territories: {
          ...prev.territories,
          [territoryType]: prev.territories[territoryType] + 1,
        },
      }))
      addNotification(`Expanded to new ${territoryType.replace(/([A-Z])/g, " $1").toLowerCase()}!`, "success")
    },
    [canAfford, spendResources, gameState.territories, addNotification],
  )
  const production = calculateProduction(gameState)
  const totalAchievements = Object.keys(ACHIEVEMENTS).length
  const unlockedAchievements = Object.values(gameState.achievements).filter(Boolean).length
  const NotificationIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-400" />
      default:
        return <Info className="w-4 h-4 text-blue-400" />
    }
  }
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white flex flex-col items-center justify-center font-['Oxanium',sans-serif] overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;100&quot; height=&quot;100&quot; viewBox=&quot;0 0 100 100&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fillOpacity=&quot;0.03&quot;%3E%3Ccircle cx=&quot;50&quot; cy=&quot;50&quot; r=&quot;1&quot;/%3E%3Ccircle cx=&quot;25&quot; cy=&quot;25&quot; r=&quot;0.5&quot;/%3E%3Ccircle cx=&quot;75&quot; cy=&quot;75&quot; r=&quot;0.5&quot;/%3E%3Ccircle cx=&quot;25&quot; cy=&quot;75&quot; r=&quot;0.5&quot;/%3E%3Ccircle cx=&quot;75&quot; cy=&quot;25&quot; r=&quot;0.5&quot;/%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto p-8">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-[0_20px_60px_rgba(59,130,246,0.4)] animate-pulse">
              <Rocket className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-wider mb-4 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Cosmic Empire
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100/80 font-light tracking-wide">
              Build your galactic civilization
            </p>
          </div>
          <div className="mb-12 max-w-2xl mx-auto">
            <p className="text-lg text-blue-100/70 leading-relaxed">
              Command fleets, research advanced technologies, and expand across the cosmos. 
              Build your empire from a single solar system to a galactic superpower.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {hasSavedData && (
              <button
                onClick={continueGame}
                className="group relative px-12 py-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-400 hover:via-emerald-400 hover:to-teal-400 rounded-2xl text-white font-semibold text-lg tracking-wide transition-all duration-300 shadow-[0_20px_60px_rgba(34,197,94,0.3)] hover:shadow-[0_25px_80px_rgba(34,197,94,0.4)] active:scale-95 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-3">
                  <Play className="w-5 h-5" />
                  Continue Empire
                </span>
              </button>
            )}
            <button
              onClick={startNewGame}
              className="group relative px-12 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-400 hover:via-purple-400 hover:to-pink-400 rounded-2xl text-white font-semibold text-lg tracking-wide transition-all duration-300 shadow-[0_20px_60px_rgba(59,130,246,0.3)] hover:shadow-[0_25px_80px_rgba(59,130,246,0.4)] active:scale-95 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
              <span className="relative flex items-center gap-3">
                <Rocket className="w-5 h-5" />
                {hasSavedData ? "New Empire" : "Start Your Empire"}
              </span>
            </button>
          </div>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { icon: Building, title: "Build & Expand", desc: "Construct buildings and expand your territory" },
              { icon: Rocket, title: "Explore Space", desc: "Launch fleets to discover new worlds" },
              { icon: BookOpen, title: "Research Tech", desc: "Unlock advanced technologies and upgrades" }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <feature.icon className="w-8 h-8 text-blue-300" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-blue-100/60">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen lg:h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white lg:overflow-hidden flex flex-col font-['Oxanium',sans-serif]">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;100&quot; height=&quot;100&quot; viewBox=&quot;0 0 100 100&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fillOpacity=&quot;0.03&quot;%3E%3Ccircle cx=&quot;50&quot; cy=&quot;50&quot; r=&quot;1&quot;/%3E%3Ccircle cx=&quot;25&quot; cy=&quot;25&quot; r=&quot;0.5&quot;/%3E%3Ccircle cx=&quot;75&quot; cy=&quot;75&quot; r=&quot;0.5&quot;/%3E%3Ccircle cx=&quot;25&quot; cy=&quot;75&quot; r=&quot;0.5&quot;/%3E%3Ccircle cx=&quot;75&quot; cy=&quot;25&quot; r=&quot;0.5&quot;/%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>
              <div className="relative z-10 flex flex-col lg:h-full p-2 sm:p-3 md:p-4 lg:p-6 pb-6 sm:pb-8 lg:pb-6">
        <header className="flex flex-col gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6 bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.3)] border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-12 md:w-14 sm:h-12 md:h-14 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(59,130,246,0.4)] animate-pulse flex-shrink-0">
                <Rocket className="w-5 h-5 sm:w-6 md:w-7 sm:h-6 md:h-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-wider bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Cosmic Empire
                </h1>
                <div className="hidden sm:flex items-center gap-2 md:gap-4 text-sm sm:text-base text-blue-100/80 flex-wrap">
                  <span className="whitespace-nowrap">Prestige Level {gameState.stats.prestigeLevel}</span>
                  <span className="hidden md:inline">•</span>
                  <span className="whitespace-nowrap">Playtime: {formatTime(gameState.stats.totalPlayTime)}</span>
                  <span className="hidden md:inline">•</span>
                  <span className="whitespace-nowrap hidden md:inline">
                    Achievements: {unlockedAchievements}/{totalAchievements}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="sm:hidden p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 border border-white/10 cursor-pointer flex items-center justify-center"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-1 md:gap-2 lg:gap-3 flex-shrink-0">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-3 lg:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg md:rounded-xl lg:rounded-2xl transition-all duration-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] active:scale-95 border border-white/10 min-h-[40px] md:min-h-[44px] cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span className="hidden md:inline text-base">{isPlaying ? "Pause" : "Play"}</span>
              </button>
              <button
                onClick={saveGame}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-3 lg:px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg md:rounded-xl lg:rounded-2xl transition-all duration-300 shadow-[inset_0_2px_4px_rgba(34,197,94,0.1)] hover:shadow-[inset_0_2px_4px_rgba(34,197,94,0.2)] active:scale-95 border border-green-400/20 min-h-[40px] md:min-h-[44px] cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span className="hidden md:inline text-base">Save</span>
              </button>
              <button
                onClick={exitToMenu}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-3 lg:px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg md:rounded-xl lg:rounded-2xl transition-all duration-300 shadow-[inset_0_2px_4px_rgba(239,68,68,0.1)] hover:shadow-[inset_0_2px_4px_rgba(239,68,68,0.2)] active:scale-95 border border-red-400/20 min-h-[40px] md:min-h-[44px] cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span className="hidden md:inline text-base">Exit</span>
              </button>
              {gameState.stats.totalEarnings >= 10000000 && (
                <button
                  onClick={prestige}
                  className="flex items-center gap-1 md:gap-2 px-2 md:px-3 lg:px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-lg md:rounded-xl lg:rounded-2xl transition-all duration-300 shadow-[0_8px_32px_rgba(251,191,36,0.4)] hover:shadow-[0_8px_32px_rgba(251,191,36,0.6)] active:scale-95 border border-yellow-400/30 min-h-[40px] md:min-h-[44px] cursor-pointer"
                >
                  <Crown className="w-4 h-4" />
                  <span className="hidden lg:inline text-base">Prestige</span>
                </button>
              )}
              <button
                onClick={() => setShowStats(!showStats)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg md:rounded-xl lg:rounded-2xl transition-all duration-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] active:scale-95 border border-white/10 min-h-[40px] min-w-[40px] md:min-h-[44px] md:min-w-[44px] cursor-pointer flex items-center justify-center"
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowAchievements(!showAchievements)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg md:rounded-xl lg:rounded-2xl transition-all duration-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] active:scale-95 border border-white/10 min-h-[40px] min-w-[40px] md:min-h-[44px] md:min-w-[44px] cursor-pointer flex items-center justify-center"
              >
                <Trophy className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="sm:hidden text-sm text-blue-100/80 space-y-1 px-1">
            <div className="flex flex-wrap gap-2">
              <span className="whitespace-nowrap">Prestige Level {gameState.stats.prestigeLevel}</span>
              <span>•</span>
              <span className="whitespace-nowrap">Playtime: {formatTime(gameState.stats.totalPlayTime)}</span>
            </div>
            <div>
              <span className="whitespace-nowrap">Achievements: {unlockedAchievements}/{totalAchievements}</span>
            </div>
          </div>
          {showMobileMenu && (
            <div className="sm:hidden grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  setIsPlaying(!isPlaying)
                  setShowMobileMenu(false)
                }}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 border border-white/10 min-h-[40px] text-base cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button
                onClick={() => {
                  saveGame()
                  setShowMobileMenu(false)
                }}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-all duration-300 border border-green-400/20 min-h-[40px] text-base cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => {
                  exitToMenu()
                  setShowMobileMenu(false)
                }}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all duration-300 border border-red-400/20 min-h-[40px] text-base cursor-pointer"
              >
                <X className="w-4 h-4" />
                Exit
              </button>
              {gameState.stats.totalEarnings >= 10000000 && (
                <button
                  onClick={() => {
                    prestige()
                    setShowMobileMenu(false)
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-lg transition-all duration-300 border border-yellow-400/30 min-h-[40px] text-base cursor-pointer col-span-2"
                >
                  <Crown className="w-4 h-4" />
                  Prestige
                </button>
              )}
              <button
                onClick={() => {
                  setShowStats(!showStats)
                  setShowMobileMenu(false)
                }}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 border border-white/10 min-h-[40px] text-base cursor-pointer"
              >
                <BarChart3 className="w-4 h-4" />
                Stats
              </button>
              <button
                onClick={() => {
                  setShowAchievements(!showAchievements)
                  setShowMobileMenu(false)
                }}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 border border-white/10 min-h-[40px] text-base cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                Achievements
              </button>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 border border-white/10 min-h-[40px] text-base cursor-pointer"
              >
                {showSidebar ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                {showSidebar ? "Hide" : "Show"} Sidebar
              </button>
            </div>
          )}
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6 flex-shrink-0">
          {Object.entries(gameState.resources).map(([key, value]) => {
            const resourceProduction = production[key as keyof typeof production] || 0
            const icons = {
              energy: Zap,
              minerals: Gem,
              darkMatter: Atom,
              antimatter: Star,
              quantumFlux: Cpu,
              nanobots: Cog,
              crystals: Diamond,
              plasma: Flame,
            }
            const colors = {
              energy: "from-yellow-400 to-orange-500",
              minerals: "from-green-400 to-emerald-500",
              darkMatter: "from-purple-400 to-violet-500",
              antimatter: "from-pink-400 to-rose-500",
              quantumFlux: "from-blue-400 to-cyan-500",
              nanobots: "from-gray-400 to-slate-500",
              crystals: "from-teal-400 to-green-500",
              plasma: "from-red-400 to-orange-500",
            }
            const Icon = icons[key as keyof typeof icons] || Circle
            const color = colors[key as keyof typeof colors] || "from-gray-400 to-gray-500"
            return (
              <div
                key={key}
                className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.15),0_12px_40px_rgba(0,0,0,0.4)] transition-all duration-300 border border-white/5 flex flex-col min-h-[80px] sm:min-h-[90px]"
              >
                <div className="flex items-center gap-1 sm:gap-2 mb-2 flex-1">
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center shadow-lg flex-shrink-0`}
                  >
                    <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  </div>
                  <span className="text-xs font-medium tracking-wide capitalize text-white/90 flex-1 min-w-0 break-words leading-tight">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-base sm:text-lg md:text-xl font-bold tracking-wide text-white">{formatNumber(value)}</div>
                  <div className={`text-sm font-medium ${resourceProduction > 0 ? "text-green-300" : "text-gray-500"}`}>
                    +{resourceProduction > 0 ? formatNumber(resourceProduction) : "0.0"}/s
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className={`grid gap-3 sm:gap-4 md:gap-6 flex-1 lg:min-h-0 ${showSidebar ? "grid-cols-1 lg:grid-cols-4" : "grid-cols-1"}`}>
          <div className={`${showSidebar ? "lg:col-span-3" : "col-span-1"} flex flex-col lg:min-h-0`}>
                          <div className="bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.3)] border border-white/10 flex-1 flex flex-col lg:min-h-0">
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4 md:mb-6 p-1 sm:p-2 bg-white/5 rounded-xl sm:rounded-2xl">
                {[
                  { id: "buildings", label: "Buildings", icon: Building },
                  { id: "fleet", label: "Fleet", icon: Rocket },
                  { id: "research", label: "Research", icon: BookOpen },
                  { id: "territories", label: "Territories", icon: Map },
                  { id: "market", label: "Market", icon: DollarSign },
                ].map(({ id, label, icon: Icon }, index) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center justify-center gap-1 sm:gap-2 px-1 sm:px-3 md:px-4 py-2 rounded-lg sm:rounded-xl transition-all duration-300 min-h-[44px] cursor-pointer ${
                      activeTab === id
                        ? "bg-blue-500/30 text-blue-100 shadow-[inset_0_2px_4px_rgba(59,130,246,0.3)] border border-blue-400/30"
                        : "bg-white/10 text-blue-200/80 hover:bg-white/20 hover:text-blue-100 border border-white/10"
                    } ${index === 4 ? "col-span-2 sm:col-span-1" : ""}`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-center leading-tight whitespace-nowrap">{label}</span>
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-auto lg:min-h-0">
                <div className="space-y-4">
                {activeTab === "buildings" && (
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                    {Object.entries(BUILDING_DATA).map(([buildingKey, buildingData]) => {
                      const cost = getBuildingCost(buildingKey as keyof GameState["buildings"])
                      const affordable = canAfford(cost)
                      const unlocked = isUnlocked(buildingData, gameState)
                      const count = gameState.buildings[buildingKey as keyof GameState["buildings"]]
                      if (!unlocked) return null
                      return (
                        <div
                          key={buildingKey}
                          className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:bg-white/10 transition-all duration-300 border border-white/10 flex flex-col min-h-[140px] sm:min-h-[150px]"
                        >
                          <div className="flex items-start gap-2 sm:gap-3 mb-3 flex-1">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                              <buildingData.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white text-base sm:text-lg mb-1">
                                {buildingData.name}
                              </h3>
                              <p className="text-sm text-blue-100/90 leading-relaxed">{buildingData.description}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-base font-bold text-blue-200">{count}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => buyBuilding(buildingKey as keyof GameState["buildings"], cost)}
                            disabled={!affordable}
                            className={`w-full py-3 px-3 rounded-lg sm:rounded-xl transition-all duration-300 min-h-[44px] cursor-pointer ${
                              affordable
                                ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 shadow-[0_4px_16px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] active:scale-95"
                                : "bg-gray-600/30 cursor-not-allowed"
                            }`}
                          >
                            <div className="text-sm leading-relaxed text-center">
                              {Object.entries(cost).map(([resource, amount], index) => (
                                <span key={resource} className="block sm:inline">
                                  {index > 0 && <span className="hidden sm:inline"> • </span>}
                                  {formatNumber(amount)} {resource.charAt(0).toUpperCase() + resource.slice(1)}
                                </span>
                              ))}
                            </div>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
                {activeTab === "fleet" && (
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                    {Object.entries(FLEET_DATA).map(([shipKey, shipData]) => {
                      const cost = getShipCost(shipKey as keyof GameState["fleet"])
                      const affordable = canAfford(cost)
                      const unlocked = isUnlocked(shipData, gameState)
                      const count = gameState.fleet[shipKey as keyof GameState["fleet"]]
                      if (!unlocked) return null
                      return (
                        <div
                          key={shipKey}
                          className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:bg-white/10 transition-all duration-300 border border-white/10 flex flex-col min-h-[140px] sm:min-h-[150px]"
                        >
                          <div className="flex items-start gap-2 sm:gap-3 mb-3 flex-1">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                              <shipData.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white text-base sm:text-lg mb-1">
                                {shipData.name}
                              </h3>
                              <p className="text-sm text-blue-100/90 leading-relaxed">{shipData.description}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-base font-bold text-blue-200">{count}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => buyShip(shipKey as keyof GameState["fleet"], cost)}
                            disabled={!affordable}
                            className={`w-full py-3 px-3 rounded-lg sm:rounded-xl transition-all duration-300 min-h-[44px] cursor-pointer ${
                              affordable
                                ? "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 shadow-[0_4px_16px_rgba(34,197,94,0.3)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.4)] active:scale-95"
                                : "bg-gray-600/30 cursor-not-allowed"
                            }`}
                          >
                            <div className="text-sm leading-relaxed text-center">
                              {Object.entries(cost).map(([resource, amount], index) => (
                                <span key={resource} className="block sm:inline">
                                  {index > 0 && <span className="hidden sm:inline"> • </span>}
                                  {formatNumber(amount)} {resource.charAt(0).toUpperCase() + resource.slice(1)}
                                </span>
                              ))}
                            </div>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
                {activeTab === "research" && (
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                    {Object.entries(RESEARCH_DATA).map(([techKey, techData]) => {
                      const cost = getResearchCost(techKey as keyof GameState["research"])
                      const affordable = canAfford(cost)
                      const unlocked = isUnlocked(techData, gameState)
                      const level = gameState.research[techKey as keyof GameState["research"]]
                      const maxLevel = level >= techData.maxLevel
                      if (!unlocked) return null
                      return (
                        <div
                          key={techKey}
                          className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:bg-white/10 transition-all duration-300 border border-white/10 flex flex-col min-h-[140px] sm:min-h-[150px]"
                        >
                          <div className="flex items-start gap-2 sm:gap-3 mb-3 flex-1">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                              <techData.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white text-base sm:text-lg mb-1">
                                {techData.name}
                              </h3>
                              <p className="text-sm text-blue-100/90 leading-relaxed">{techData.description}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-base font-bold text-blue-200">
                                {level}/{techData.maxLevel}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => buyResearch(techKey as keyof GameState["research"], cost)}
                            disabled={!affordable || maxLevel}
                            className={`w-full py-3 px-3 rounded-lg sm:rounded-xl transition-all duration-300 min-h-[44px] cursor-pointer ${
                              maxLevel
                                ? "bg-green-600/30 cursor-not-allowed"
                                : affordable
                                  ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-[0_4px_16px_rgba(168,85,247,0.3)] hover:shadow-[0_6px_20px_rgba(168,85,247,0.4)] active:scale-95"
                                  : "bg-gray-600/30 cursor-not-allowed"
                            }`}
                          >
                            <div className="text-sm leading-relaxed text-center">
                              {maxLevel
                                ? "MAX LEVEL"
                                : Object.entries(cost).map(([resource, amount], index) => (
                                    <span key={resource} className="block sm:inline">
                                      {index > 0 && <span className="hidden sm:inline"> • </span>}
                                      {formatNumber(amount)} {resource.charAt(0).toUpperCase() + resource.slice(1)}
                                    </span>
                                  ))}
                            </div>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
                {activeTab === "territories" && (
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                    {Object.entries(gameState.territories).map(([territoryKey, count]) => {
                      const territoryData = {
                        solarSystems: { name: "Solar Systems", icon: Sun, description: "Expand to new star systems" },
                        planets: { name: "Planets", icon: Globe, description: "Colonize habitable worlds" },
                        moons: { name: "Moons", icon: Circle, description: "Establish lunar outposts" },
                        asteroids: { name: "Asteroids", icon: Gem, description: "Mine asteroid belts" },
                        spaceStations: {
                          name: "Space Stations",
                          icon: Satellite,
                          description: "Build orbital facilities",
                        },
                      }
                      const data = territoryData[territoryKey as keyof typeof territoryData]
                      const costs = {
                        solarSystems: { energy: 1000000, minerals: 500000, darkMatter: 10000, antimatter: 1000 },
                        planets: { energy: 100000, minerals: 50000, darkMatter: 1000 },
                        moons: { energy: 50000, minerals: 25000 },
                        asteroids: { energy: 25000, minerals: 10000 },
                        spaceStations: { energy: 500000, minerals: 200000, antimatter: 500, crystals: 100 },
                      }
                      const cost = costs[territoryKey as keyof typeof costs]
                      const adjustedCost: Partial<GameState["resources"]> = {}
                      Object.entries(cost).forEach(([resource, baseCost]) => {
                        adjustedCost[resource as keyof GameState["resources"]] = Math.floor(
                          baseCost * Math.pow(1.5, count),
                        )
                      })
                      const affordable = canAfford(adjustedCost)
                      return (
                        <div
                          key={territoryKey}
                          className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:bg-white/10 transition-all duration-300 border border-white/10 flex flex-col min-h-[140px] sm:min-h-[150px]"
                        >
                          <div className="flex items-start gap-2 sm:gap-3 mb-3 flex-1">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                              <data.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white text-sm sm:text-base mb-1">{data.name}</h3>
                              <p className="text-xs text-blue-100/90 leading-relaxed">{data.description}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-sm font-bold text-blue-200">{count}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => expandTerritory(territoryKey as keyof GameState["territories"])}
                            disabled={!affordable}
                            className={`w-full py-3 px-3 rounded-lg sm:rounded-xl transition-all duration-300 min-h-[44px] cursor-pointer ${
                              affordable
                                ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 shadow-[0_4px_16px_rgba(249,115,22,0.3)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.4)] active:scale-95"
                                : "bg-gray-600/30 cursor-not-allowed"
                            }`}
                          >
                            <div className="text-xs leading-relaxed text-center">
                              {Object.entries(adjustedCost).map(([resource, amount], index) => (
                                <span key={resource} className="block sm:inline">
                                  {index > 0 && <span className="hidden sm:inline"> • </span>}
                                  {formatNumber(amount)} {resource.charAt(0).toUpperCase() + resource.slice(1)}
                                </span>
                              ))}
                            </div>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
                {activeTab === "market" && (
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10">
                      <h3 className="text-lg sm:text-xl font-semibold tracking-wide text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                        Resource Market
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                        {Object.entries(gameState.market.prices)
                          .filter(([resource]) => resource !== 'minerals')
                          .map(([resource, price]) => {
                          const resourceValue = gameState.resources[resource as keyof GameState["resources"]]
                          const canSell = resourceValue >= 100
                          return (
                            <div
                              key={resource}
                              className="bg-white/5 rounded-lg sm:rounded-xl p-3 border border-white/10 flex flex-col min-h-[120px] sm:min-h-[130px]"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-base font-medium text-blue-100/90 capitalize">
                                  {resource.replace(/([A-Z])/g, " $1")}
                                </span>
                                <span className="text-sm text-green-300 font-medium flex-shrink-0">{price.toFixed(2)} minerals</span>
                              </div>
                              <div className="text-lg sm:text-xl font-bold text-white mb-2 flex-1">
                                {formatNumber(resourceValue)}
                              </div>
                              <button
                                onClick={() => {
                                  if (canSell) {
                                    const sellAmount = Math.min(100, resourceValue)
                                    const earnings = sellAmount * price
                                    setGameState((prev) => ({
                                      ...prev,
                                      resources: {
                                        ...prev.resources,
                                        [resource]:
                                          prev.resources[resource as keyof GameState["resources"]] - sellAmount,
                                        minerals: prev.resources.minerals + earnings,
                                      },
                                    }))
                                    addNotification(
                                      `Sold ${sellAmount} ${resource} for ${earnings.toFixed(0)} minerals`,
                                      "success",
                                    )
                                  }
                                }}
                                disabled={!canSell}
                                className={`w-full py-3 px-2 rounded-lg text-sm transition-all duration-300 min-h-[44px] cursor-pointer ${
                                  canSell
                                    ? "bg-green-500/20 hover:bg-green-500/30 text-green-200 border border-green-400/30"
                                    : "bg-gray-600/20 text-gray-400 cursor-not-allowed border border-gray-600/30"
                                }`}
                              >
                                Sell 100
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
          {showSidebar && (
            <div className="flex flex-col lg:min-h-0 lg:overflow-auto px-2 pb-8">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] border border-white/10 lg:flex-shrink-0 mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold tracking-wide text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                  Fleet Status
                </h3>
                <div className="space-y-3">
                  {Object.entries(gameState.fleet).map(([ship, count]) => (
                    <div key={ship} className="flex justify-between items-center">
                      <span className="text-blue-100/90 capitalize text-base font-medium">{ship.replace(/([A-Z])/g, " $1")}</span>
                      <span className="text-white font-semibold text-base">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] border border-white/10 lg:flex-shrink-0 mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold tracking-wide text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                  Production
                </h3>
                <div className="space-y-3">
                  {Object.entries(production).map(
                    ([resource, amount]) =>
                      amount > 0 && (
                        <div key={resource} className="flex justify-between items-center">
                          <span className="text-blue-100/90 capitalize text-base font-medium">
                            {resource.replace(/([A-Z])/g, " $1")}
                          </span>
                          <span className="text-green-300 font-semibold text-base">+{formatNumber(amount)}/s</span>
                        </div>
                      ),
                  )}
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] border border-white/10 lg:flex-shrink-0 mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold tracking-wide text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
                  Territory Control
                </h3>
                <div className="space-y-3">
                  {Object.entries(gameState.territories).map(([territory, count]) => (
                    <div key={territory} className="flex justify-between items-center">
                      <span className="text-blue-100/90 capitalize text-base font-medium">{territory.replace(/([A-Z])/g, " $1")}</span>
                      <span className="text-white font-semibold text-base">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              {notifications.length > 0 && (
                <div className="bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] border border-white/10 lg:flex-shrink-0">
                  <h3 className="text-base font-semibold tracking-wide text-white mb-2 flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notifications
                  </h3>
                  <div className="space-y-2">
                    {notifications.map((notification, index) => (
                      <div
                        key={notification.id + index}
                        className="flex items-center gap-2 text-sm bg-white/5 rounded-lg p-2 border border-white/10"
                      >
                        <NotificationIcon type={notification.type} />
                        <span className="text-blue-100/90 flex-1">{notification.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {showStats && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="relative bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-indigo-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 max-w-4xl w-full border border-white/20 max-h-[90vh] overflow-y-auto shadow-[0_32px_64px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-8 duration-500">
              <div className="flex items-center justify-between mb-8 relative">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(59,130,246,0.4)] animate-pulse">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-wide bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                      Statistics
                    </h2>
                    <p className="text-blue-200/70 text-base">Empire Performance Overview</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowStats(false)}
                  className="group p-3 bg-white/10 hover:bg-red-500/20 rounded-2xl transition-all duration-300 border border-white/10 hover:border-red-400/30 cursor-pointer flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-white/80 group-hover:text-red-300 transition-colors" />
                </button>
              </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold tracking-wide text-white">General Stats</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "Total Earnings", value: formatNumber(gameState.stats.totalEarnings), icon: DollarSign, color: "from-green-400 to-emerald-500" },
                      { label: "Prestige Level", value: gameState.stats.prestigeLevel.toString(), icon: Crown, color: "from-yellow-400 to-orange-500" },
                      { label: "Total Play Time", value: formatTime(gameState.stats.totalPlayTime), icon: Clock, color: "from-blue-400 to-cyan-500" },
                      { label: "Total Clicks", value: formatNumber(gameState.stats.totalClicks), icon: Target, color: "from-purple-400 to-pink-500" }
                    ].map((stat, index) => (
                      <div key={stat.label} className="group bg-white/5 hover:bg-white/10 rounded-xl p-3 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                              <stat.icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-blue-100/90 font-medium text-base">{stat.label}</span>
                          </div>
                          <span className="text-white font-bold text-lg">
                            {stat.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold tracking-wide text-white">Progress Stats</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "Buildings Built", value: formatNumber(gameState.stats.buildingsBuilt), icon: Building, color: "from-blue-400 to-indigo-500" },
                      { label: "Ships Launched", value: formatNumber(gameState.stats.shipsLaunched), icon: Rocket, color: "from-red-400 to-orange-500" },
                      { label: "Research Completed", value: formatNumber(gameState.stats.researchCompleted), icon: BookOpen, color: "from-teal-400 to-green-500" },
                      { label: "Achievements", value: `${unlockedAchievements}/${totalAchievements}`, icon: Trophy, color: "from-yellow-400 to-amber-500" }
                    ].map((stat, index) => (
                      <div key={stat.label} className="group bg-white/5 hover:bg-white/10 rounded-xl p-3 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                              <stat.icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-blue-100/90 font-medium text-base">{stat.label}</span>
                          </div>
                          <span className="text-white font-bold text-lg">
                            {stat.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-3xl">
                <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-red-600/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        )}
        {showAchievements && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="relative bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-indigo-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-[0_32px_64px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-8 duration-500">
              <div className="flex items-center justify-between mb-8 relative">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(251,191,36,0.4)] animate-pulse">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-wide bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                      Achievements
                    </h2>
                    <p className="text-blue-200/70 text-base">
                      Progress: {unlockedAchievements}/{totalAchievements} Unlocked
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAchievements(false)}
                  className="group p-3 bg-white/10 hover:bg-red-500/20 rounded-2xl transition-all duration-300 border border-white/10 hover:border-red-400/30 cursor-pointer flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-white/80 group-hover:text-red-300 transition-colors" />
                </button>
              </div>
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-medium text-blue-200">Overall Progress</span>
                  <span className="text-base font-bold text-white">{Math.round((unlockedAchievements / totalAchievements) * 100)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(251,191,36,0.5)]"
                    style={{ width: `${(unlockedAchievements / totalAchievements) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {Object.entries(ACHIEVEMENTS).map(([key, achievement], index) => {
                  const unlocked = gameState.achievements[key]
                  return (
                    <div
                      key={key}
                      className={`group relative p-4 rounded-2xl border transition-all duration-500 hover:scale-[1.02] ${
                        unlocked 
                          ? "bg-gradient-to-br from-green-500/20 via-emerald-500/15 to-teal-500/20 border-green-400/40 shadow-[0_8px_32px_rgba(34,197,94,0.2)]" 
                          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                      }`}
                      style={{
                        animationDelay: `${index * 50}ms`
                      }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="relative flex-shrink-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                              unlocked 
                                ? "bg-gradient-to-br from-green-400 to-emerald-500 group-hover:scale-110" 
                                : "bg-gradient-to-br from-gray-500 to-gray-600 group-hover:scale-105"
                            }`}
                          >
                            <achievement.icon className="w-5 h-5 text-white" />
                          </div>
                          {unlocked && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`font-bold text-lg leading-tight mb-1 ${
                              unlocked 
                                ? "text-green-100" 
                                : "text-gray-300"
                            }`}
                          >
                            {achievement.name}
                          </h3>
                          <p className={`text-base leading-snug ${
                            unlocked 
                              ? "text-green-100/80" 
                              : "text-gray-400"
                          }`}>
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                      {!unlocked && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-slate-900/20 rounded-2xl pointer-events-none"></div>
                      )}
                      {unlocked && (
                        <div className="absolute inset-0 pointer-events-none rounded-2xl">
                          <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-3xl">
                <div className="absolute top-8 right-8 w-40 h-40 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-8 left-8 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-green-600/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-xl animate-pulse delay-500"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
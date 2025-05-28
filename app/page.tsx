"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext, useMemo } from "react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts" 
import { ArrowDown, ArrowUp, Search, TrendingUp, BarChart2, Moon, Sun, Sparkles, Menu, X, Bitcoin } from "lucide-react"

// Theme
type Theme = "light" | "dark"

const ThemeContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
})

// Types
interface CryptoData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  marketCap: number
  volume: number
}

interface HistoricalDataPoint {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface ComparisonCrypto {
  symbol: string
  data: HistoricalDataPoint[]
}

//data
const mockCryptos: CryptoData[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 68432.21,
    change: 1542.35,
    changePercent: 2.31,
    marketCap: 1350000000000,
    volume: 28900000000,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 3421.87,
    change: -78.43,
    changePercent: -2.24,
    marketCap: 410000000000,
    volume: 15600000000,
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: 142.56,
    change: 8.32,
    changePercent: 6.2,
    marketCap: 62000000000,
    volume: 3400000000,
  },
  {
    symbol: "ADA",
    name: "Cardano",
    price: 0.45,
    change: -0.02,
    changePercent: -4.26,
    marketCap: 16000000000,
    volume: 412000000,
  },
  {
    symbol: "DOT",
    name: "Polkadot",
    price: 6.78,
    change: 0.34,
    changePercent: 5.28,
    marketCap: 8500000000,
    volume: 298000000,
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    price: 0.89,
    change: 0.12,
    changePercent: 15.73,
    marketCap: 8200000000,
    volume: 485000000,
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    price: 24.67,
    change: -2.45,
    changePercent: -9.03,
    marketCap: 9800000000,
    volume: 320000000,
  },
]

// Real-time price simulation function
const simulatePriceChange = (currentPrice: number, volatility: number = 0.02): number => {
  // Generate a random change between -volatility and +volatility
  const changePercent = (Math.random() - 0.5) * 2 * volatility
  const newPrice = currentPrice * (1 + changePercent)
  return Math.max(newPrice, currentPrice * 0.5) // Prevent price from going too low
}

// Calculate change and change percent
const calculateChange = (currentPrice: number, previousPrice: number) => {
  const change = currentPrice - previousPrice
  const changePercent = (change / previousPrice) * 100
  return { change, changePercent }
}

//historical data
const generateHistoricalData = (basePrice: number, days: number): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = []
  let currentPrice = basePrice

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]

    //price movement 
    const change = (Math.random() - 0.5) * (basePrice * 0.05)
    currentPrice = Math.max(currentPrice + change, basePrice * 0.6)

    const open = currentPrice
    const high = open * (1 + Math.random() * 0.03)
    const low = open * (1 - Math.random() * 0.03)
    const close = (open + high + low) / 3 + (Math.random() - 0.5) * (high - low)
    const volume = Math.floor(Math.random() * 1000000000) + 50000000

    data.push({
      date: dateStr,
      open,
      high,
      low,
      close,
      volume,
    })
  }

  return data
}

// Format large numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000000000) {
    return `$${(num / 1000000000000).toFixed(2)}T`
  }
  if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(2)}B`
  }
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(2)}M`
  }
  return `$${num.toLocaleString()}`
}

// Format crypto price
const formatCryptoPrice = (price: number): string => {
  if (price >= 1000) {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  if (price >= 1) {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`
  }
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 8 })}`
}

// Format date for display
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")

  // Apply theme class to document element
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement

      // Remove both classes first
      root.classList.remove("light", "dark")

      // Add the current theme class
      root.classList.add(theme)

      // Store theme preference
      localStorage.setItem("theme", theme)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
}

function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export default function CryptoDashboard() {
  // Add global styles
  useEffect(() => {
    const styleElement = document.createElement("style")
    styleElement.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&display=swap');

      :root {
        /* color palette */
        --color-f1f1f5: 241, 241, 245; 
        --color-5f8b4c: 95, 139, 76;   
        --color-ff9a9a: 255, 154, 154; 
        --color-945034: 148, 80, 52; 
        --color-030303: 3, 3, 3;  

        /* Light theme */
        --background-light: rgb(var(--color-f1f1f5));
        --card-light: rgba(255, 255, 255, 0.8);
        --card-light-accent: rgba(255, 255, 255, 0.6);
        --text-primary: rgb(var(--color-030303));
        --text-secondary: rgb(60, 60, 67);
        --text-muted: rgb(120, 120, 128);
        --border-light: rgba(0, 0, 0, 0.1);
        --input-light: rgba(255, 255, 255, 0.8);
        --primary-light: rgb(var(--color-5f8b4c));
        --primary-light-hover: rgba(var(--color-5f8b4c), 0.9);
        --accent-light: rgb(var(--color-945034));
        --accent-light-hover: rgba(var(--color-945034), 0.9);
        --highlight-light: rgb(var(--color-ff9a9a));

        /* Dark theme*/
        --background-dark: rgb(18, 18, 22);
        --card-dark: rgba(30, 30, 35, 0.7);
        --card-dark-accent: rgba(40, 40, 45, 0.7);
        --text-primary-dark: rgb(255, 255, 255);
        --text-secondary-dark: rgba(255, 255, 255, 0.85);
        --text-muted-dark: rgba(255, 255, 255, 0.6);
        --border-dark: rgba(255, 255, 255, 0.15);
        --input-dark: rgba(40, 40, 45, 0.7);
        --primary-dark: rgb(var(--color-5f8b4c));
        --primary-dark-hover: rgba(var(--color-5f8b4c), 0.9);
        --accent-dark: rgb(var(--color-ff9a9a));
        --accent-dark-hover: rgba(var(--color-ff9a9a), 0.9);
        --highlight-dark: rgb(var(--color-945034));

        /* Font family */
        --font-sans: "Comfortaa", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }

      /* Base styles */
      body {
        font-family: var(--font-sans);
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        letter-spacing: -0.01em;
        font-weight: 400;
      }

      .light {
        --background: var(--background-light);
        --card: var(--card-light);
        --card-accent: var(--card-light-accent);
        --text-primary: var(--text-primary);
        --text-secondary: var(--text-secondary);
        --text-muted: var(--text-muted);
        --border: var(--border-light);
        --input: var(--input-light);
        --primary: var(--primary-light);
        --primary-hover: var(--primary-light-hover);
        --accent: var(--accent-light);
        --accent-hover: var(--accent-light-hover);
        --highlight: var(--highlight-light);
      }

      .dark {
        --background: var(--background-dark);
        --card: var(--card-dark);
        --card-accent: var(--card-dark-accent);
        --text-primary: var(--text-primary-dark);
        --text-secondary: var(--text-secondary-dark);
        --text-muted: var(--text-muted-dark);
        --border: var(--border-dark);
        --input: var(--input-dark);
        --primary: var(--primary-dark);
        --primary-hover: var(--primary-dark-hover);
        --accent: var(--accent-dark);
        --accent-hover: var(--accent-dark-hover);
        --highlight: var(--highlight-dark);
      }

      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      ::-webkit-scrollbar-track {
        background: rgba(var(--color-f1f1f5), 0.5);
      }

      ::-webkit-scrollbar-thumb {
        background: rgba(var(--color-5f8b4c), 0.7);
        border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: rgba(var(--color-5f8b4c), 0.9);
      }

      /* Hide scrollbar for dropdown elements */
      .dropdown-no-scrollbar {
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* Internet Explorer 10+ */
      }

      .dropdown-no-scrollbar::-webkit-scrollbar {
        display: none; /* WebKit */
      }

      /* Custom styles for charts */
      .recharts-cartesian-grid-horizontal line,
      .recharts-cartesian-grid-vertical line {
        stroke-opacity: 0.2;
      }

      .recharts-tooltip-wrapper {
        filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
      }

      .recharts-default-tooltip {
        border-radius: 0.5rem !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        backdrop-filter: blur(8px) !important;
        background-color: rgba(255, 255, 255, 0.8) !important;
      }

      .dark .recharts-default-tooltip {
        background-color: rgba(30, 30, 35, 0.8) !important;
      }

      /*button styling */
      .accent-button {
        color: white !important;
        font-weight: 500;
      }

      .dark .accent-button {
        color: white !important;
        font-weight: 500;
      }

      /* Responsive adjustments */
      @media (max-width: 640px) {
        .recharts-legend-item {
          font-size: 10px !important;
        }

        .recharts-legend-item-text {
          margin-right: 5px !important;
        }

        .recharts-tooltip {
          font-size: 10px !important;
        }
      }

      /* Animation for loading spinner */
      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* Animation for real-time pulse */
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }

      /* Smooth transitions for real-time data */
      .smooth-transition {
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .price-flash-up {
        background-color: rgba(16, 185, 129, 0.2) !important;
        transition: background-color 0.3s ease;
      }

      .price-flash-down {
        background-color: rgba(239, 68, 68, 0.2) !important;
        transition: background-color 0.3s ease;
      }

      /* Glassmorphism effects */
      .glass {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      }

      .dark .glass {
        background: rgba(30, 30, 35, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      /* Flat design elements */
      .flat-button {
        border: none;
        background: var(--primary);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-weight: 500;
        transition: all 0.2s;
      }

      .flat-button:hover {
        background: var(--primary-hover);
      }
    `
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  return (
    <ThemeProvider>
      <CryptoDashboardContent />
    </ThemeProvider>
  )
}

function CryptoDashboardContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [cryptoData, setCryptoData] = useState<CryptoData[]>(mockCryptos)
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData>(mockCryptos[0])
  const [timeRange, setTimeRange] = useState("1M")
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [comparisonCryptos, setComparisonCryptos] = useState<ComparisonCrypto[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [activeTab, setActiveTab] = useState<"line" | "volume">("line")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024)
  const [isRealTimeActive, setIsRealTimeActive] = useState(true)
  const [priceFlash, setPriceFlash] = useState<{[key: string]: 'up' | 'down' | null}>({})
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const { theme, toggleTheme } = useTheme()

  // Real-time price updates
  useEffect(() => {
    if (!isRealTimeActive) return

    const interval = setInterval(() => {
      setCryptoData(prevData => {
        const newData = prevData.map(crypto => {
          const previousPrice = crypto.price
          const newPrice = simulatePriceChange(crypto.price, 0.008) // Reduced volatility for smoother changes
          const { change, changePercent } = calculateChange(newPrice, previousPrice)
          
          // Track price direction for flash effect (only for significant changes)
          if (Math.abs(newPrice - previousPrice) > previousPrice * 0.002) { // Flash for changes > 0.2%
            if (newPrice > previousPrice) {
              setPriceFlash(prev => ({ ...prev, [crypto.symbol]: 'up' }))
            } else if (newPrice < previousPrice) {
              setPriceFlash(prev => ({ ...prev, [crypto.symbol]: 'down' }))
            }
          }
          
          // Update market cap and volume slightly
          const marketCapChange = (Math.random() - 0.5) * 0.005 // Reduced to 0.5% max change
          const volumeChange = (Math.random() - 0.5) * 0.02 // Reduced to 2% max change
          
          return {
            ...crypto,
            price: newPrice,
            change,
            changePercent,
            marketCap: crypto.marketCap * (1 + marketCapChange),
            volume: crypto.volume * (1 + volumeChange),
          }
        })
        
        // Update selected crypto if it matches one of the updated cryptos
        const updatedSelectedCrypto = newData.find(crypto => crypto.symbol === selectedCrypto.symbol)
        if (updatedSelectedCrypto) {
          setSelectedCrypto(updatedSelectedCrypto)
        }
        
        return newData
      })
      
      // Clear flash effect after a short delay
      setTimeout(() => {
        setPriceFlash({})
      }, 1200) // Longer flash duration for smoother effect
    }, 5000) // Update every 5 seconds instead of 3 for smoother experience

    return () => clearInterval(interval)
  }, [isRealTimeActive, selectedCrypto.symbol])

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Filter cryptos based on search term
  const filteredCryptos = cryptoData.filter(
    (crypto) =>
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  //data when selected crypto or time range changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      // Determine days based on time range
      let days = 30
      switch (timeRange) {
        case "1W":
          days = 7
          break
        case "1M":
          days = 30
          break
        case "3M":
          days = 90
          break
        case "6M":
          days = 180
          break
        case "1Y":
          days = 365
          break
        case "5Y":
          days = 1825
          break
      }

      // Simulate API call with timeout
      setTimeout(() => {
        setHistoricalData(generateHistoricalData(selectedCrypto.price, days))
        setIsLoading(false)
      }, 500)
    }

    fetchData()
  }, [selectedCrypto.symbol, timeRange]) // Only update when crypto symbol or time range changes, not price

  // Add crypto to comparison
  const addCryptoToComparison = (crypto: CryptoData) => {
    if (comparisonCryptos.some((s) => s.symbol === crypto.symbol)) return

    const days =
      timeRange === "1W"
        ? 7
        : timeRange === "1M"
          ? 30
          : timeRange === "3M"
            ? 90
            : timeRange === "6M"
              ? 180
              : timeRange === "1Y"
                ? 365
                : 1825

    setComparisonCryptos([
      ...comparisonCryptos,
      {
        symbol: crypto.symbol,
        data: generateHistoricalData(crypto.price, days),
      },
    ])

    setShowComparison(true)
  }

  // Remove crypto from comparison
  const removeCryptoFromComparison = (symbol: string) => {
    setComparisonCryptos(comparisonCryptos.filter((s) => s.symbol !== symbol))
    if (comparisonCryptos.length <= 1) setShowComparison(false)
  }

  // Prepare comparison crypto options
  const comparisonCryptoOptions = useMemo(() => {
    return cryptoData
      .filter((s) => s.symbol !== selectedCrypto.symbol && !comparisonCryptos.some((cs) => cs.symbol === s.symbol))
      .map((crypto) => ({
        value: crypto.symbol,
        label: `${crypto.symbol} - ${crypto.name}`,
      }))
  }, [selectedCrypto, comparisonCryptos, cryptoData])

  // Prepare data for comparison chart
  const prepareComparisonData = () => {
    const result: any[] = []

    // Find the earliest start date among all cryptos
    const allDates = new Set<string>()

    // Add the selected crypto's dates
    historicalData.forEach((point) => allDates.add(point.date))

    // Add comparison cryptos' dates
    comparisonCryptos.forEach((crypto) => {
      crypto.data.forEach((point) => allDates.add(point.date))
    })

    // Sort dates
    const sortedDates = Array.from(allDates).sort()

    // Create data points for each date
    sortedDates.forEach((date) => {
      const dataPoint: any = { date: formatDate(date) }

      // Add selected crypto data
      const mainCryptoPoint = historicalData.find((p) => p.date === date)
      if (mainCryptoPoint) {
        dataPoint[selectedCrypto.symbol] = mainCryptoPoint.close
      }

      // Add comparison cryptos data
      comparisonCryptos.forEach((crypto) => {
        const cryptoPoint = crypto.data.find((p) => p.date === date)
        if (cryptoPoint) {
          dataPoint[crypto.symbol] = cryptoPoint.close
        }
      })

      result.push(dataPoint)
    })

    return result
  }

  // Prepare data for line chart
  const prepareLineData = () => {
    return historicalData.map((point) => ({
      date: formatDate(point.date),
      price: point.close,
    }))
  }

  // Prepare data for volume chart
  const prepareVolumeData = () => {
    return historicalData.map((point) => ({
      date: formatDate(point.date),
      volume: point.volume,
    }))
  }

  // Colors for charts based on theme
  const chartColors = useMemo(
    () => ({
      line: "#5F8B4C",
      candleUp: "#10b981",
      candleDown: "#ef4444",
      volume: "#945034",
      grid: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      text: theme === "dark" ? "#FFFFFF" : "#030303",
    }),
    [theme],
  )

  //colors for each cryptocurrency 
  const cryptoColors = {
    BTC: "#5F8B4C", 
    ETH: "#945034", 
    SOL: "#FF9A9A", 
    ADA: "#6A7FDB", 
    DOT: "#F7B32B", 
    MATIC: "#8247E5",
    AVAX: "#E84142",
  }

  return (
    <div
      style={{
        backgroundColor: theme === "dark" ? "var(--background-dark)" : "var(--background-light)",
        color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundImage:
          theme === "dark"
            ? "radial-gradient(circle at 10% 20%, rgba(95, 139, 76, 0.1) 0%, transparent 20%), radial-gradient(circle at 80% 70%, rgba(148, 80, 52, 0.05) 0%, transparent 20%)"
            : "radial-gradient(circle at 10% 20%, rgba(95, 139, 76, 0.05) 0%, transparent 20%), radial-gradient(circle at 80% 70%, rgba(255, 154, 154, 0.03) 0%, transparent 20%)",
      }}
    >
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: theme === "dark" ? "rgba(30, 30, 35, 0.7)" : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: `1px solid ${theme === "dark" ? "var(--border-dark)" : "var(--border-light)"}`,
          padding: "1rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              margin: 0,
            }}
          >
            <Bitcoin
              style={{
                marginRight: "0.5rem",
                height: "1.5rem",
                width: "1.5rem",
                color: "#5F8B4C",
              }}
            />
            <span style={{ display: windowWidth < 640 ? "none" : "inline" }}>Crypto</span>
            <span style={{ display: windowWidth < 640 ? "inline" : "none" }}>C</span>
            <span
              style={{
                marginLeft: "0.25rem",
                color: "#FF9A9A",
                fontWeight: "700",
              }}
            >
              FCX
            </span>
          </h1>

          {/* Desktop search */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "28rem",
              margin: "0 1rem",
              display: windowWidth < 768 ? "none" : "block",
            }}
          >
            <Search
              style={{
                position: "absolute",
                left: "0.875rem",
                top: "0.75rem",
                height: "1.25rem",
                width: "1.25rem",
                color: theme === "dark" ? "var(--text-muted-dark)" : "var(--text-muted)",
              }}
            />
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} // Delay to allow click on dropdown items
              style={{
                width: "100%",
                padding: "0.75rem 0.75rem 0.75rem 2.75rem",
                backgroundColor: theme === "dark" ? "rgba(40, 40, 45, 0.5)" : "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: `1px solid ${theme === "dark" ? "var(--border-dark)" : "var(--border-light)"}`,
                borderRadius: "0.5rem",
                color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                fontSize: "0.875rem",
                outline: "none",
                fontFamily: "Comfortaa, sans-serif",
              }}
            />
            {(searchTerm || isSearchFocused) && (
              <div
                className="dropdown-no-scrollbar"
                style={{
                  marginTop: "0.25rem",
                  width: "100%",
                  backgroundColor: theme === "dark" ? "rgb(30, 30, 35)" : "rgb(255, 255, 255)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                  border: `1px solid ${theme === "dark" ? "var(--border-dark)" : "var(--border-light)"}`,
                  maxHeight: "15rem",
                  overflowY: "auto",
                }}
              >
                {(searchTerm ? filteredCryptos : cryptoData).length > 0 ? (
                  (searchTerm ? filteredCryptos : cryptoData).map((crypto) => (
                    <div
                      key={crypto.symbol}
                      onClick={() => {
                        setSelectedCrypto(crypto)
                        setSearchTerm("")
                        setIsSearchFocused(false)
                      }}
                      style={{
                        padding: "0.75rem",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        backgroundColor: "transparent",
                        transition: "background-color 0.2s",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor =
                          theme === "dark" ? "rgba(40, 40, 45, 0.5)" : "rgba(241, 241, 245, 0.5)"
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent"
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 600 }}>{crypto.symbol}</span>
                        <span
                          style={{
                            color: theme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary)",
                            marginLeft: "0.5rem",
                          }}
                        >
                          {crypto.name}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            fontWeight: 600,
                            color: crypto.change >= 0 ? "#10b981" : "#ef4444",
                          }}
                        >
                          {formatCryptoPrice(crypto.price)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      padding: "0.75rem",
                      color: theme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary)",
                    }}
                  >
                    No cryptocurrencies found
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {/* Real-time indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "9999px",
                  backgroundColor: theme === "dark" ? "rgba(16, 185, 129, 0.1)" : "rgba(16, 185, 129, 0.1)",
                  border: `1px solid #10b981`,
                  opacity: isRealTimeActive ? 1 : 0.4,
                  transition: "opacity 0.3s ease",
                }}
              >
                <div
                  style={{
                    width: "0.5rem",
                    height: "0.5rem",
                    borderRadius: "50%",
                    backgroundColor: "#10b981",
                    animation: isRealTimeActive ? "pulse 2s infinite" : "none",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "500",
                    color: "#10b981",
                    fontFamily: "Comfortaa, sans-serif",
                  }}
                >
                  LIVE
                </span>
              </div>
              <button
                onClick={() => setIsRealTimeActive(!isRealTimeActive)}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "9999px",
                  padding: "0.5rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                }}
                title={isRealTimeActive ? "Pause real-time updates" : "Resume real-time updates"}
              >
                {isRealTimeActive ? (
                  <svg style={{ height: "1.25rem", width: "1.25rem" }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg style={{ height: "1.25rem", width: "1.25rem" }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
            <button
              onClick={toggleTheme}
              style={{
                backgroundColor: "transparent",
                border: "none",
                borderRadius: "9999px",
                padding: "0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
              }}
            >
              {theme === "dark" ? (
                <Sun style={{ height: "1.5rem", width: "1.5rem", color: "#FF9A9A" }} />
              ) : (
                <Moon style={{ height: "1.5rem", width: "1.5rem", color: "#945034" }} />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{
                backgroundColor: "transparent",
                border: "none",
                borderRadius: "9999px",
                padding: "0.5rem",
                cursor: "pointer",
                display: windowWidth < 768 ? "flex" : "none",
                alignItems: "center",
                justifyContent: "center",
                color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
              }}
            >
              <Menu style={{ height: "1.5rem", width: "1.5rem" }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            backgroundColor: theme === "dark" ? "rgba(18, 18, 22, 0.95)" : "rgba(241, 241, 245, 0.95)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            transition: "transform 0.3s ease-in-out",
            transform: mobileMenuOpen ? "translateX(0)" : "translateX(100%)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "1rem" }}>
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: "0.5rem",
                borderRadius: "9999px",
                backgroundColor: theme === "dark" ? "rgba(40, 40, 45, 0.5)" : "rgba(255, 255, 255, 0.5)",
                color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
              }}
            >
              <X style={{ height: "1.5rem", width: "1.5rem" }} />
            </button>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1.5rem", gap: "1.5rem" }}
          >
            <div style={{ width: "100%", maxWidth: "28rem", marginBottom: "1.5rem" }}>
              <div style={{ position: "relative" }}>
                <Search
                  style={{
                    position: "absolute",
                    left: "0.875rem",
                    top: "0.75rem",
                    height: "1.25rem",
                    width: "1.25rem",
                    color: theme === "dark" ? "var(--text-muted-dark)" : "var(--text-muted)",
                    zIndex: 1,
                  }}
                />
                <input
                  type="text"
                  placeholder="Search cryptocurrencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} // Delay to allow click on dropdown items
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.75rem 0.75rem 2.75rem",
                    backgroundColor: theme === "dark" ? "rgba(40, 40, 45, 0.5)" : "rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: `1px solid ${theme === "dark" ? "var(--border-dark)" : "var(--border-light)"}`,
                    borderRadius: "0.5rem",
                    color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                    fontSize: "0.875rem",
                    outline: "none",
                    fontFamily: "Comfortaa, sans-serif",
                  }}
                />
              </div>
              {(searchTerm || isSearchFocused) && (
                <div
                  className="dropdown-no-scrollbar"
                  style={{
                    marginTop: "0.25rem",
                    width: "100%",
                    backgroundColor: theme === "dark" ? "rgb(30, 30, 35)" : "rgb(255, 255, 255)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    border: `1px solid ${theme === "dark" ? "var(--border-dark)" : "var(--border-light)"}`,
                    maxHeight: "15rem",
                    overflowY: "auto",
                  }}
                >
                  {(searchTerm ? filteredCryptos : cryptoData).length > 0 ? (
                    (searchTerm ? filteredCryptos : cryptoData).map((crypto) => (
                      <div
                        key={crypto.symbol}
                        onClick={() => {
                          setSelectedCrypto(crypto)
                          setSearchTerm("")
                          setMobileMenuOpen(false)
                          setIsSearchFocused(false)
                        }}
                        style={{
                          padding: "0.75rem",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          backgroundColor: "transparent",
                          transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor =
                            theme === "dark" ? "rgba(40, 40, 45, 0.5)" : "rgba(241, 241, 245, 0.5)"
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent"
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: 600 }}>{crypto.symbol}</span>
                          <span
                            style={{
                              color: theme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary)",
                              marginLeft: "0.5rem",
                            }}
                          >
                            {crypto.name}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span
                            style={{
                              fontWeight: 600,
                              color: crypto.change >= 0 ? "#10b981" : "#ef4444",
                            }}
                          >
                            {formatCryptoPrice(crypto.price)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        padding: "0.75rem",
                        color: theme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary)",
                      }}
                    >
                      No cryptocurrencies found
                    </div>
                  )}
                </div>
              )}
            </div>
            <div style={{ width: "100%", marginBottom: "1rem" }}>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                  marginBottom: "1rem",
                }}
              >
                Time Range
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "0.5rem",
                  width: "100%",
                }}
              >
                {["1W", "1M", "3M", "6M", "1Y", "5Y"].map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setTimeRange(range)
                      setMobileMenuOpen(false)
                    }}
                    style={{
                      padding: "0.5rem",
                      backgroundColor: timeRange === range ? "#5F8B4C" : "transparent",
                      color:
                        timeRange === range
                          ? "white"
                          : theme === "dark"
                            ? "var(--text-primary-dark)"
                            : "var(--text-primary)",
                      border: `1px solid ${
                        timeRange === range
                          ? "transparent"
                          : theme === "dark"
                            ? "var(--border-dark)"
                            : "var(--border-light)"
                      }`,
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                      fontWeight: timeRange === range ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      fontFamily: "Comfortaa, sans-serif",
                    }}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            {comparisonCryptos.length > 0 && (
              <div style={{ width: "100%", marginBottom: "1rem" }}>
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                    marginBottom: "1rem",
                  }}
                >
                  View Mode
                </h2>
                <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
                  <button
                    onClick={() => {
                      setShowComparison(false)
                      setMobileMenuOpen(false)
                    }}
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      backgroundColor: !showComparison ? "#5F8B4C" : "transparent",
                      color: !showComparison
                        ? "white"
                        : theme === "dark"
                          ? "var(--text-primary-dark)"
                          : "var(--text-primary)",
                      border: `1px solid ${
                        !showComparison
                          ? "transparent"
                          : theme === "dark"
                            ? "var(--border-dark)"
                            : "var(--border-light)"
                      }`,
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                      fontWeight: !showComparison ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      fontFamily: "Comfortaa, sans-serif",
                    }}
                  >
                    Single View
                  </button>
                  <button
                    onClick={() => {
                      setShowComparison(true)
                      setMobileMenuOpen(false)
                    }}
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      backgroundColor: showComparison ? "#5F8B4C" : "transparent",
                      color: showComparison
                        ? "white"
                        : theme === "dark"
                          ? "var(--text-primary-dark)"
                          : "var(--text-primary)",
                      border: `1px solid ${
                        showComparison ? "transparent" : theme === "dark" ? "var(--border-dark)" : "var(--border-light)"
                      }`,
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                      fontWeight: showComparison ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      fontFamily: "Comfortaa, sans-serif",
                    }}
                  >
                    Comparison
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main content */}
      <main style={{ flex: 1, padding: "1rem", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        {/* Crypto info */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: windowWidth < 1024 ? "1fr" : "1fr 1fr",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div
            className="glass"
            style={{
              backgroundColor: theme === "dark" ? "rgba(30, 30, 35, 0.5)" : "rgba(255, 255, 255, 0.5)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              borderRadius: "1rem",
              border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.5)"}`,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "1.25rem", paddingBottom: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                      margin: 0,
                      fontFamily: "Comfortaa, sans-serif",
                    }}
                  >
                    {selectedCrypto.symbol}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: theme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary)",
                      margin: "0.25rem 0 0 0",
                      fontFamily: "Comfortaa, sans-serif",
                    }}
                  >
                    {selectedCrypto.name}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    className={`smooth-transition ${
                      priceFlash[selectedCrypto.symbol] === 'up' 
                        ? 'price-flash-up' 
                        : priceFlash[selectedCrypto.symbol] === 'down' 
                        ? 'price-flash-down' 
                        : ''
                    }`}
                    style={{
                      fontSize: "1.875rem",
                      fontWeight: "700",
                      color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                      fontFamily: "Comfortaa, sans-serif",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.375rem",
                      backgroundColor: "transparent",
                    }}
                  >
                    {formatCryptoPrice(selectedCrypto.price)}
                  </div>
                  <div
                    className="smooth-transition"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      fontSize: "1.125rem",
                      color: selectedCrypto.change >= 0 ? "#10b981" : "#ef4444",
                      fontWeight: "600",
                      fontFamily: "Comfortaa, sans-serif",
                    }}
                  >
                    {selectedCrypto.change >= 0 ? (
                      <ArrowUp style={{ height: "1.25rem", width: "1.25rem", marginRight: "0.25rem" }} />
                    ) : (
                      <ArrowDown style={{ height: "1.25rem", width: "1.25rem", marginRight: "0.25rem" }} />
                    )}
                    <span>
                      ${Math.abs(selectedCrypto.change).toFixed(2)} ({Math.abs(selectedCrypto.changePercent).toFixed(2)}
                      %)
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ padding: "1.25rem" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <div
                  style={{
                    backgroundColor: theme === "dark" ? "rgba(40, 40, 45, 0.5)" : "rgba(241, 241, 245, 0.5)",
                    padding: "0.75rem",
                    borderRadius: "0.75rem",
                    backdropFilter: "blur(5px)",
                    WebkitBackdropFilter: "blur(5px)",
                    border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.3)"}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: theme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary)",
                      fontWeight: "500",
                      fontFamily: "Comfortaa, sans-serif",
                    }}
                  >
                    Market Cap
                  </div>
                  <div
                    className="smooth-transition"
                    style={{
                      fontWeight: 600,
                      fontSize: "1.125rem",
                      color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                      fontFamily: "Comfortaa, sans-serif",
                    }}
                  >
                    {formatNumber(selectedCrypto.marketCap)}
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: theme === "dark" ? "rgba(40, 40, 45, 0.5)" : "rgba(241, 241, 245, 0.5)",
                    padding: "0.75rem",
                    borderRadius: "0.75rem",
                    backdropFilter: "blur(5px)",
                    WebkitBackdropFilter: "blur(5px)",
                    border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.3)"}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: theme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary)",
                      fontWeight: "500",
                      fontFamily: "Comfortaa, sans-serif",
                    }}
                  >
                    24h Volume
                  </div>
                  <div
                    className="smooth-transition"
                    style={{
                      fontWeight: 600,
                      fontSize: "1.125rem",
                      color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                      fontFamily: "Comfortaa, sans-serif",
                    }}
                  >
                    {formatNumber(selectedCrypto.volume)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: windowWidth < 640 ? "1fr" : "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div
              className="glass"
              style={{
                backgroundColor: theme === "dark" ? "rgba(30, 30, 35, 0.5)" : "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderRadius: "1rem",
                border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.5)"}`,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "1.25rem", paddingBottom: "0.5rem" }}>
                <h3
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                    margin: 0,
                    fontFamily: "Comfortaa, sans-serif",
                  }}
                >
                  <Sparkles
                    style={{
                      height: "1rem",
                      width: "1rem",
                      marginRight: "0.5rem",
                      color: "#5F8B4C",
                    }}
                  />
                  Market Overview
                </h3>
              </div>
              <div style={{ padding: "1.25rem", paddingTop: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.5rem",
                      borderRadius: "0.75rem",
                      backgroundColor: theme === "dark" ? "rgba(40, 40, 45, 0.5)" : "rgba(241, 241, 245, 0.5)",
                      backdropFilter: "blur(5px)",
                      WebkitBackdropFilter: "blur(5px)",
                      border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.3)"}`,
                    }}
                  >
                    <span style={{ fontSize: "0.875rem", fontWeight: "500", fontFamily: "Comfortaa, sans-serif" }}>
                      BTC Dominance
                    </span>
                    <span
                      style={{
                        color: "#10b981",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        fontFamily: "Comfortaa, sans-serif",
                      }}
                    >
                      42.8%
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.5rem",
                      borderRadius: "0.75rem",
                      backgroundColor: theme === "dark" ? "rgba(40, 40, 45, 0.5)" : "rgba(241, 241, 245, 0.5)",
                      backdropFilter: "blur(5px)",
                      WebkitBackdropFilter: "blur(5px)",
                      border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.3)"}`,
                    }}
                  >
                    <span style={{ fontSize: "0.875rem", fontWeight: "500", fontFamily: "Comfortaa, sans-serif" }}>
                      Total Market Cap
                    </span>
                    <span
                      style={{
                        color: "#10b981",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        fontFamily: "Comfortaa, sans-serif",
                      }}
                    >
                      $2.47T
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.5rem",
                      borderRadius: "0.75rem",
                      backgroundColor: theme === "dark" ? "rgba(40, 40, 45, 0.5)" : "rgba(241, 241, 245, 0.5)",
                      backdropFilter: "blur(5px)",
                      WebkitBackdropFilter: "blur(5px)",
                      border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.3)"}`,
                    }}
                  >
                    <span style={{ fontSize: "0.875rem", fontWeight: "500", fontFamily: "Comfortaa, sans-serif" }}>
                      24h Volume
                    </span>
                    <span
                      style={{
                        color: "#ef4444",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        fontFamily: "Comfortaa, sans-serif",
                      }}
                    >
                      $98.6B
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="glass"
              style={{
                backgroundColor: theme === "dark" ? "rgba(30, 30, 35, 0.5)" : "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderRadius: "1rem",
                border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.5)"}`,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                minHeight: "12rem", // Ensure consistent height with other cards
              }}
            >
              <div style={{ padding: "1.25rem", paddingBottom: "0.5rem" }}>
                <h3
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                    margin: 0,
                    fontFamily: "Comfortaa, sans-serif",
                  }}
                >
                  <BarChart2
                    style={{
                      height: "1rem",
                      width: "1rem",
                      marginRight: "0.5rem",
                      color: "#5F8B4C",
                    }}
                  />
                  Compare
                </h3>
              </div>
              <div style={{ padding: "1.25rem", paddingTop: 0 }}>
                <div style={{ position: "relative" }}>
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      const value = e.target.value
                      if (value) {
                        const crypto = cryptoData.find((s) => s.symbol === value)
                        if (crypto) addCryptoToComparison(crypto)
                        e.target.value = "" // Reset select after selection
                      }
                    }}
                    disabled={comparisonCryptoOptions.length === 0}
                    style={{
                      width: "100%",
                      padding: "0.625rem",
                      paddingRight: "2.5rem",
                      backgroundColor: theme === "dark" ? "rgba(40, 40, 45, 0.5)" : "rgba(241, 241, 245, 0.5)",
                      backdropFilter: "blur(5px)",
                      WebkitBackdropFilter: "blur(5px)",
                      border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.3)"}`,
                      borderRadius: "0.75rem",
                      color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                      fontSize: "0.875rem",
                      appearance: "none",
                      cursor: "pointer",
                      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                      transition: "all 0.2s",
                      outline: "none",
                      fontWeight: "500",
                      fontFamily: "Comfortaa, sans-serif",
                    }}
                  >
                    <option value="" disabled>
                      Add cryptocurrency
                    </option>
                    {comparisonCryptoOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div
                    style={{
                      pointerEvents: "none",
                      position: "absolute",
                      inset: "0 0 0 auto",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 0.75rem",
                      color: theme === "dark" ? "var(--text-muted-dark)" : "var(--text-muted)",
                    }}
                  >
                    <svg
                      style={{ height: "1rem", width: "1rem" }}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                <div 
                  className="dropdown-no-scrollbar"
                  style={{ 
                    marginTop: "0.75rem", 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "0.5rem",
                    maxHeight: "8rem", // Fixed height to match other card content areas
                    overflowY: "auto", // Make it scrollable
                    paddingRight: "0.25rem" // Small padding to account for hidden scrollbar
                  }}
                >
                  {comparisonCryptos.map((crypto) => (
                    <div
                      key={crypto.symbol}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "0.875rem",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "0.75rem",
                        backgroundColor: theme === "dark" ? "rgba(40, 40, 45, 0.5)" : "rgba(241, 241, 245, 0.5)",
                        backdropFilter: "blur(5px)",
                        WebkitBackdropFilter: "blur(5px)",
                        border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.3)"}`,
                        transition: "all 0.2s",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = "#FF9A9A"
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor =
                          theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.3)"
                      }}
                    >
                      <span style={{ fontWeight: 600, fontFamily: "Comfortaa, sans-serif" }}>{crypto.symbol}</span>
                      <button
                        onClick={() => removeCryptoFromComparison(crypto.symbol)}
                        style={{
                          height: "1.5rem",
                          padding: "0 0.5rem",
                          backgroundColor: "transparent",
                          color: "#ef4444",
                          border: "none",
                          borderRadius: "0.375rem",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          fontFamily: "Comfortaa, sans-serif",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor =
                            theme === "dark" ? "rgba(239, 68, 68, 0.1)" : "#fee2e2"
                          e.currentTarget.style.color = "#b91c1c"
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent"
                          e.currentTarget.style.color = "#ef4444"
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Time range selector*/}
        <div
          style={{
            display: windowWidth < 768 ? "none" : "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            gap: "0.5rem",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {["1W", "1M", "3M", "6M", "1Y", "5Y"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: timeRange === range ? "#5F8B4C" : "transparent",
                  color:
                    timeRange === range
                      ? "white"
                      : theme === "dark"
                        ? "var(--text-primary-dark)"
                        : "var(--text-primary)",
                  border: `1px solid ${
                    timeRange === range
                      ? "transparent"
                      : theme === "dark"
                        ? "var(--border-dark)"
                        : "var(--border-light)"
                  }`,
                  borderRadius: "0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: timeRange === range ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "Comfortaa, sans-serif",
                }}
              >
                {range}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => setShowComparison(false)}
              disabled={comparisonCryptos.length === 0}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: !showComparison ? "#5F8B4C" : "transparent",
                color: !showComparison
                  ? "white"
                  : theme === "dark"
                    ? "var(--text-primary-dark)"
                    : "var(--text-primary)",
                border: `1px solid ${
                  !showComparison ? "transparent" : theme === "dark" ? "var(--border-dark)" : "var(--border-light)"
                }`,
                borderRadius: "0.75rem",
                fontSize: "0.875rem",
                fontWeight: !showComparison ? 600 : 400,
                cursor: comparisonCryptos.length === 0 ? "not-allowed" : "pointer",
                opacity: comparisonCryptos.length === 0 ? 0.5 : 1,
                transition: "all 0.2s",
                fontFamily: "Comfortaa, sans-serif",
              }}
            >
              Single View
            </button>
            <button
              onClick={() => setShowComparison(true)}
              disabled={comparisonCryptos.length === 0}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: showComparison ? "#5F8B4C" : "transparent",
                color: showComparison ? "white" : theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                border: `1px solid ${
                  showComparison ? "transparent" : theme === "dark" ? "var(--border-dark)" : "var(--border-light)"
                }`,
                borderRadius: "0.75rem",
                fontSize: "0.875rem",
                fontWeight: showComparison ? 600 : 400,
                cursor: comparisonCryptos.length === 0 ? "not-allowed" : "pointer",
                opacity: comparisonCryptos.length === 0 ? 0.5 : 1,
                transition: "all 0.2s",
                fontFamily: "Comfortaa, sans-serif",
              }}
            >
              Comparison
            </button>
          </div>
        </div>

        {/* Charts */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "0.75rem",
                backgroundColor: theme === "dark" ? "rgba(30, 30, 35, 0.5)" : "rgba(241, 241, 245, 0.5)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                padding: "0.25rem",
                border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.5)"}`,
              }}
            >
              <button
                onClick={() => setActiveTab("line")}
                style={{
                  padding: "0.5rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "0.5rem",
                  transition: "all 0.2s",
                  backgroundColor:
                    activeTab === "line"
                      ? theme === "dark"
                        ? "rgba(40, 40, 45, 0.7)"
                        : "rgba(255, 255, 255, 0.7)"
                      : "transparent",
                  color:
                    activeTab === "line"
                      ? theme === "dark"
                        ? "var(--text-primary-dark)"
                        : "var(--text-primary)"
                      : theme === "dark"
                        ? "var(--text-secondary-dark)"
                        : "var(--text-secondary)",
                  boxShadow: activeTab === "line" ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)" : "none",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  border: "none",
                  fontFamily: "Comfortaa, sans-serif",
                }}
              >
                <TrendingUp style={{ height: "1rem", width: "1rem", marginRight: "0.5rem" }} />
                Price
              </button>
              <button
                onClick={() => setActiveTab("volume")}
                style={{
                  padding: "0.5rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "0.5rem",
                  transition: "all 0.2s",
                  backgroundColor:
                    activeTab === "volume"
                      ? theme === "dark"
                        ? "rgba(40, 40, 45, 0.7)"
                        : "rgba(255, 255, 255, 0.7)"
                      : "transparent",
                  color:
                    activeTab === "volume"
                      ? theme === "dark"
                        ? "var(--text-primary-dark)"
                        : "var(--text-primary)"
                      : theme === "dark"
                        ? "var(--text-secondary-dark)"
                        : "var(--text-secondary)",
                  boxShadow: activeTab === "volume" ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)" : "none",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  border: "none",
                  fontFamily: "Comfortaa, sans-serif",
                }}
              >
                <BarChart2 style={{ height: "1rem", width: "1rem", marginRight: "0.5rem" }} />
                Volume
              </button>
            </div>
          </div>

          {isLoading ? (
            <div
              className="glass"
              style={{
                height: "24rem",
                backgroundColor: theme === "dark" ? "rgba(30, 30, 35, 0.5)" : "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderRadius: "1rem",
                border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.5)"}`,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <svg
                  style={{
                    height: "2.5rem",
                    width: "2.5rem",
                    color: "#5F8B4C",
                    animation: "spin 1s linear infinite",
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    style={{ opacity: 0.25 }}
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    style={{ opacity: 0.75 }}
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p
                  style={{
                    marginTop: "1rem",
                    color: theme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary)",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    fontFamily: "Comfortaa, sans-serif",
                  }}
                >
                  Loading chart data...
                </p>
              </div>
            </div>
          ) : (
            <div
              className="glass"
              style={{
                backgroundColor: theme === "dark" ? "rgba(30, 30, 35, 0.5)" : "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderRadius: "1rem",
                border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.5)"}`,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "1rem 1.5rem" }}>
                {activeTab === "line" && (
                  <div style={{ height: "24rem" }}>
                    {!showComparison ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={prepareLineData()} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                          <XAxis
                            dataKey="date"
                            stroke={chartColors.text}
                            tick={{ fontSize: 10, fontWeight: 500, fontFamily: "Comfortaa, sans-serif" }}
                            tickFormatter={(value) => {
                              // On small screens, show fewer ticks
                              return windowWidth < 640 && value.length > 3 ? value.substring(0, 3) : value
                            }}
                          />
                          <YAxis
                            domain={["auto", "auto"]}
                            tickFormatter={(value) => `$${value.toFixed(0)}`}
                            stroke={chartColors.text}
                            tick={{ fontSize: 10, fontWeight: 500, fontFamily: "Comfortaa, sans-serif" }}
                            width={40}
                          />
                          <Tooltip
                            formatter={(value: any) => [`$${Number(value).toFixed(2)}`, "Price"]}
                            labelFormatter={(label) => `Date: ${label}`}
                            contentStyle={{
                              backgroundColor: theme === "dark" ? "rgba(30, 30, 35, 0.8)" : "rgba(255, 255, 255, 0.8)",
                              backdropFilter: "blur(10px)",
                              WebkitBackdropFilter: "blur(10px)",
                              borderColor: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                              color: theme === "dark" ? "#FFFFFF" : "#030303",
                              borderRadius: "0.5rem",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                              padding: "0.5rem",
                              fontSize: "0.75rem",
                              fontWeight: "500",
                              fontFamily: "Comfortaa, sans-serif",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke={chartColors.line}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6, fill: chartColors.line }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={prepareComparisonData()} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                          <XAxis
                            dataKey="date"
                            stroke={chartColors.text}
                            tick={{ fontSize: 10, fontWeight: 500, fontFamily: "Comfortaa, sans-serif" }}
                            tickFormatter={(value) => {
                              // On small screens, show fewer ticks
                              return windowWidth < 640 && value.length > 3 ? value.substring(0, 3) : value
                            }}
                          />
                          <YAxis
                            domain={["auto", "auto"]}
                            tickFormatter={(value) => `$${value.toFixed(0)}`}
                            stroke={chartColors.text}
                            tick={{ fontSize: 10, fontWeight: 500, fontFamily: "Comfortaa, sans-serif" }}
                            width={40}
                          />
                          <Tooltip
                            formatter={(value: any) => [`$${Number(value).toFixed(2)}`, ""]}
                            labelFormatter={(label) => `Date: ${label}`}
                            contentStyle={{
                              backgroundColor: theme === "dark" ? "rgba(30, 30, 35, 0.8)" : "rgba(255, 255, 255, 0.8)",
                              backdropFilter: "blur(10px)",
                              WebkitBackdropFilter: "blur(10px)",
                              borderColor: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                              color: theme === "dark" ? "#FFFFFF" : "#030303",
                              borderRadius: "0.5rem",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                              padding: "0.5rem",
                              fontSize: "0.75rem",
                              fontWeight: "500",
                              fontFamily: "Comfortaa, sans-serif",
                            }}
                          />
                          <Legend
                            iconType="circle"
                            wrapperStyle={{
                              paddingTop: "0.5rem",
                              fontSize: "0.75rem",
                              fontWeight: "500",
                              fontFamily: "Comfortaa, sans-serif",
                            }}
                            layout={windowWidth < 640 ? "horizontal" : "vertical"}
                            verticalAlign={windowWidth < 640 ? "bottom" : "middle"}
                            align={windowWidth < 640 ? "center" : "right"}
                          />
                          <Line
                            type="monotone"
                            dataKey={selectedCrypto.symbol}
                            stroke={cryptoColors[selectedCrypto.symbol as keyof typeof cryptoColors] || "#5F8B4C"}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                          />
                          {comparisonCryptos.map((crypto) => (
                            <Line
                              key={crypto.symbol}
                              type="monotone"
                              dataKey={crypto.symbol}
                              stroke={cryptoColors[crypto.symbol as keyof typeof cryptoColors] || "#FF9A9A"}
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 6 }}
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                )}

                {activeTab === "volume" && (
                  <div style={{ height: "24rem" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={prepareVolumeData()} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                        <XAxis
                          dataKey="date"
                          stroke={chartColors.text}
                          tick={{ fontSize: 10, fontWeight: 500, fontFamily: "Comfortaa, sans-serif" }}
                          tickFormatter={(value) => {
                            // On small screens, show fewer ticks
                            return windowWidth < 640 && value.length > 3 ? value.substring(0, 3) : value
                          }}
                        />
                        <YAxis
                          tickFormatter={(value) => {
                            if (value >= 1000000000) return `${(value / 1000000000).toFixed(0)}B`
                            if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`
                            if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                            return value
                          }}
                          stroke={chartColors.text}
                          tick={{ fontSize: 10, fontWeight: 500, fontFamily: "Comfortaa, sans-serif" }}
                          width={40}
                        />
                        <Tooltip
                          formatter={(value: any) => {
                            const val = Number(value)
                            if (val >= 1000000000) return [`${(val / 1000000000).toFixed(2)}B`, "Volume"]
                            if (val >= 1000000) return [`${(val / 1000000).toFixed(2)}M`, "Volume"]
                            if (val >= 1000) return [`${(val / 1000).toFixed(2)}K`, "Volume"]
                            return [val, "Volume"]
                          }}
                          labelFormatter={(label) => `Date: ${label}`}
                          contentStyle={{
                            backgroundColor: theme === "dark" ? "rgba(30, 30, 35, 0.8)" : "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            borderColor: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                            color: theme === "dark" ? "#FFFFFF" : "#030303",
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            padding: "0.5rem",
                            fontSize: "0.75rem",
                            fontWeight: "500",
                            fontFamily: "Comfortaa, sans-serif",
                          }}
                        />
                        <Bar dataKey="volume" name="Volume">
                          {prepareVolumeData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartColors.volume} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Crypto movers */}
        <div style={{ marginTop: "2rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "1.5rem",
              color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              fontFamily: "Comfortaa, sans-serif",
            }}
          >
            <Sparkles
              style={{
                height: "1.25rem",
                width: "1.25rem",
                marginRight: "0.5rem",
                color: "#5F8B4C",
              }}
            />
            Crypto Movers
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: windowWidth < 768 ? "1fr" : "repeat(3, 1fr)",
              gap: "1rem",
            }}
          >
            <div
              className="glass"
              style={{
                backgroundColor: theme === "dark" ? "rgba(30, 30, 35, 0.5)" : "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderRadius: "1rem",
                border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.5)"}`,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "1.25rem", paddingBottom: "0.5rem" }}>
                <h3
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                    margin: 0,
                    fontFamily: "Comfortaa, sans-serif",
                  }}
                >
                  <ArrowUp style={{ height: "1rem", width: "1rem", marginRight: "0.5rem", color: "#10b981" }} />
                  Top Gainers
                </h3>
              </div>
              <div style={{ padding: "1.25rem", paddingTop: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {cryptoData
                    .filter((crypto) => crypto.change > 0)
                    .sort((a, b) => b.changePercent - a.changePercent)
                    .slice(0, 3)
                    .map((crypto) => (
                      <div
                        key={crypto.symbol}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "0.75rem",
                          backgroundColor: theme === "dark" ? "rgba(40, 40, 45, 0.5)" : "rgba(241, 241, 245, 0.5)",
                          backdropFilter: "blur(5px)",
                          WebkitBackdropFilter: "blur(5px)",
                          border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.3)"}`,
                          transition: "all 0.2s",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = "#10b981"
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor =
                            theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.3)"
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                              fontFamily: "Comfortaa, sans-serif",
                            }}
                          >
                            {crypto.symbol}
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: theme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary)",
                              fontFamily: "Comfortaa, sans-serif",
                            }}
                          >
                            {crypto.name}
                          </div>
                        </div>
                        <div
                          className="smooth-transition"
                          style={{
                            color: "#10b981",
                            fontWeight: 600,
                            fontSize: "1.125rem",
                            fontFamily: "Comfortaa, sans-serif",
                          }}
                        >
                          +{crypto.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div
              className="glass"
              style={{
                backgroundColor: theme === "dark" ? "rgba(30, 30, 35, 0.5)" : "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderRadius: "1rem",
                border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.5)"}`,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "1.25rem", paddingBottom: "0.5rem" }}>
                <h3
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                    margin: 0,
                    fontFamily: "Comfortaa, sans-serif",
                  }}
                >
                  <ArrowDown style={{ height: "1rem", width: "1rem", marginRight: "0.5rem", color: "#ef4444" }} />
                  Top Losers
                </h3>
              </div>
              <div style={{ padding: "1.25rem", paddingTop: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {cryptoData
                    .filter((crypto) => crypto.change < 0)
                    .sort((a, b) => a.changePercent - b.changePercent)
                    .slice(0, 3)
                    .map((crypto) => (
                      <div
                        key={crypto.symbol}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "0.75rem",
                          backgroundColor: theme === "dark" ? "rgba(40, 40, 45, 0.5)" : "rgba(241, 241, 245, 0.5)",
                          backdropFilter: "blur(5px)",
                          WebkitBackdropFilter: "blur(5px)",
                          border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.3)"}`,
                          transition: "all 0.2s",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = "#ef4444"
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor =
                            theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.3)"
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                              fontFamily: "Comfortaa, sans-serif",
                            }}
                          >
                            {crypto.symbol}
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: theme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary)",
                              fontFamily: "Comfortaa, sans-serif",
                            }}
                          >
                            {crypto.name}
                          </div>
                        </div>
                        <div
                          className="smooth-transition"
                          style={{
                            color: "#ef4444",
                            fontWeight: 600,
                            fontSize: "1.125rem",
                            fontFamily: "Comfortaa, sans-serif",
                          }}
                        >
                          {crypto.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div
              className="glass"
              style={{
                backgroundColor: theme === "dark" ? "rgba(30, 30, 35, 0.5)" : "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderRadius: "1rem",
                border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.5)"}`,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "1.25rem", paddingBottom: "0.5rem" }}>
                <h3
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                    margin: 0,
                    fontFamily: "Comfortaa, sans-serif",
                  }}
                >
                  <BarChart2
                    style={{
                      height: "1rem",
                      width: "1rem",
                      marginRight: "0.5rem",
                      color: "#5F8B4C",
                    }}
                  />
                  Most Active
                </h3>
              </div>
              <div style={{ padding: "1.25rem", paddingTop: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {cryptoData
                    .sort((a, b) => b.volume - a.volume)
                    .slice(0, 3)
                    .map((crypto) => (
                      <div
                        key={crypto.symbol}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "0.75rem",
                          backgroundColor: theme === "dark" ? "rgba(40, 40, 45, 0.5)" : "rgba(241, 241, 245, 0.5)",
                          backdropFilter: "blur(5px)",
                          WebkitBackdropFilter: "blur(5px)",
                          border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.3)"}`,
                          transition: "all 0.2s",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = "#5F8B4C"
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor =
                            theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.3)"
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                              fontFamily: "Comfortaa, sans-serif",
                            }}
                          >
                            {crypto.symbol}
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: theme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary)",
                              fontFamily: "Comfortaa, sans-serif",
                            }}
                          >
                            {crypto.name}
                          </div>
                        </div>
                        <div
                          className="smooth-transition"
                          style={{
                            fontWeight: 600,
                            fontSize: "1.125rem",
                            color: theme === "dark" ? "var(--text-primary-dark)" : "var(--text-primary)",
                            fontFamily: "Comfortaa, sans-serif",
                          }}
                        >
                          {formatNumber(crypto.volume)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: theme === "dark" ? "rgba(30, 30, 35, 0.7)" : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderTop: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
          padding: "1rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "0.75rem",
              color: theme === "dark" ? "var(--text-secondary-dark)" : "var(--text-secondary)",
              fontWeight: "500",
              fontFamily: "Comfortaa, sans-serif",
            }}
          >
            © {new Date().getFullYear()} Crypto FCX. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
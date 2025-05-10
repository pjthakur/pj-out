"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiCloud, FiThermometer, FiWind } from "react-icons/fi"

interface WeatherData {
  name: string;
  temperature: number;
  weatherType: string;
  description: string;
  windSpeed: number;
  humidity: number;
  feelsLike: number;
}

interface WeatherDatabase {
  [key: string]: WeatherData;
}

interface Location {
  name: string;
  id: string;
}

interface WeatherFilter {
  name: string;
  value: string;
}

interface WeatherState {
  temperature: number;
  description: string;
  location: string;
  windSpeed: number;
  humidity: number;
  feelsLike: number;
}

const weatherDatabase: WeatherDatabase = {
  istanbul: {
    name: "Istanbul",
    temperature: 24,
    weatherType: "clear",
    description: "Sunny skies",
    windSpeed: 8,
    humidity: 65,
    feelsLike: 26
  },  paris: {
    name: "Paris",
    temperature: 18,
    weatherType: "cloudy",
    description: "Overcast clouds",
    windSpeed: 12,
    humidity: 78,
    feelsLike: 16
  },
  tokyo: {
    name: "Tokyo",
    temperature: 22,    weatherType: "rain",    description: "Rain showers",
    windSpeed: 6,
    humidity: 85,
    feelsLike: 20
  },
  newyork: {
    name: "New York",
    temperature: 15,
    windSpeed: 25,
    description: "Windy conditions",
    humidity: 45,
    weatherType: "windy",
    feelsLike: 12
  },
  dubai: {
    name: "Dubai",
    temperature: 35,
    windSpeed: 10,
    description: "Clear skies",
    humidity: 40,
    weatherType: "clear",
    feelsLike: 38
  }
}

export default function WeatherAtmosphere() {
  const [isMounted, setIsMounted] = useState(false);
  const [weather, setWeather] = useState<string>("clear")
  const [timeOfDay, setTimeOfDay] = useState<string>("day")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showNotification, setShowNotification] = useState<boolean>(false)
  const [notificationMessage, setNotificationMessage] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [weatherData, setWeatherData] = useState<WeatherState | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<Location>({name: "Istanbul", id: "istanbul" })
  const [showIntro, setShowIntro] = useState<boolean>(true)
  const [showDropdown, setShowDropdown] = useState(false);
  
  const locations: Location[] = [
    { name: "Istanbul", id: "istanbul" },
    { name: "Paris", id: "paris" },
    { name: "Tokyo", id: "tokyo" },
    { name: "New York", id: "newyork" },
    { name: "Dubai", id: "dubai" }
  ]
  
  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }
  
  const [locationTransition, setLocationTransition] = useState(false)
  
  const handleLocationSelect = (location: Location) => {
    console.log('Selected location:', location)
    setLocationTransition(true)
    setTimeout(() => {
      setSelectedLocation(location)
      setSearchQuery('')
      const cityData = weatherDatabase[location.id.toLowerCase()] || weatherDatabase['istanbul'];
      setWeather(cityData.weatherType);
      setWeatherData({
        temperature: cityData.temperature,
        description: getWeatherDescription(cityData.weatherType),
        location: cityData.name,
        windSpeed: cityData.windSpeed,
        humidity: cityData.humidity,
        feelsLike: cityData.feelsLike
      });
      showNotificationMessage(`Weather showing for ${location.name}`)
      setTimeout(() => {
        setLocationTransition(false)
      }, 300)
    }, 300)
  }
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {setShowIntro(false)}, 2000)   
    return () => clearTimeout(timer)
  }, [])
  
  useEffect(() => {
    if (!showIntro) {
      console.log('Fetching weather for:', selectedLocation)
      const validId = selectedLocation && selectedLocation.id ? selectedLocation.id : 'istanbul'      
      fetchWeather(validId)
    }
  }, [selectedLocation, showIntro])

  function fetchWeather(locationId: string) {
    try {
      setLoading(true)
      
      const normalizedId = locationId.toLowerCase().trim()
      
      setTimeout(() => {
        const cityData = weatherDatabase[normalizedId] || weatherDatabase['istanbul']
        
        let weatherCondition = cityData.weatherType
        
        setWeather(weatherCondition)
        const hour = new Date().getHours()
        setTimeOfDay(hour >= 6 && hour < 20 ? "day" : "night")
        
        setWeatherData({
          temperature: cityData.temperature,
          description: getWeatherDescription(weatherCondition),
          location: cityData.name,
          windSpeed: cityData.windSpeed,
          humidity: cityData.humidity,
          feelsLike: cityData.feelsLike
        })
        
        setError(null)
        setLoading(false)
      }, 400) 
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong") 
      setLoading(false)
    }
  }
  
  const handleSearch = () => {
    try {
      if (!searchQuery.trim()) {
        showNotificationMessage("Please enter a location name")
              return
      }
            const matchingLocation = locations.find(
        loc => loc.name.toLowerCase() === searchQuery.toLowerCase()
      )
      
      if (matchingLocation) {
        handleLocationSelect(matchingLocation)
      } else { showNotificationMessage("Location not found. Try Istanbul, Paris, Tokyo, New York or Dubai")   }
    } catch (error) {
      showNotificationMessage("Error searching location. Please try again.")
    }
  }

  const getWeatherDescription = (condition: string): string => {
    switch (condition) {
      case "clear":
        return timeOfDay === "day" ? "Sunny skies" : "Clear night"
      case "cloudy":
        return "Overcast clouds"
      case "rain":
        return "Rain showers"
      case "windy":
        return "Windy conditions"
      default:
        return "Clear skies"
    }
  }

  const getBackgroundGradient = () => {
    if (loading) { return "bg-gradient-to-b from-indigo-700 to-violet-900"  }

    switch (weather) {
      case "clear":
        return timeOfDay === "day"
          ? "bg-gradient-to-b from-sky-400 via-blue-400 to-cyan-300"
          : "bg-gradient-to-b from-indigo-900 via-purple-900 to-violet-900"
      case "cloudy":
        return "bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800"
      case "rain":
        return "bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900"
      case "windy":
        return timeOfDay === "day"
          ? "bg-gradient-to-b from-sky-500 via-sky-600 to-cyan-600"
          : "bg-gradient-to-b from-indigo-800 via-slate-800 to-slate-900"
      default:
        return "bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700"
    }
  }

  const getAtmosphereElements = () => {
    if (loading) {
      return <LoadingAnimation />
    }

    switch (weather) {
      case "clear":
        return <ClearSkies timeOfDay={timeOfDay} />
      case "cloudy":
        return <CloudySkies />
      case "rain":
        return <RainyWeather />
      case "windy":
        return <WindyWeather />
      default:
        return <ClearSkies timeOfDay={timeOfDay} />
    }
  }

  // Helper for text color based on weather and time
  const getTextColor = (base: string, alt: string = "text-slate-700") =>
    weather === "clear" && timeOfDay === "day" ? alt : base;

  const filteredLocations = searchQuery
    ? locations.filter(loc => loc.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  if (!isMounted) {
    return null;
  }

  if (typeof window === 'undefined') {
    return null; 
  }

  if (showIntro) {
    return <IntroAnimation />
  }

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-start ${getBackgroundGradient()} transition-all duration-1000 relative overflow-hidden font-inter`}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: locationTransition ? 0.3 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black/30 z-30 pointer-events-none"
      />
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]"></div>
        <div 
          className="absolute top-0 left-0 w-full h-[40vh] opacity-40"
          style={{ 
            background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)' 
          }}
        ></div>
        <div 
          className="absolute bottom-0 left-0 w-full h-[40vh] opacity-30"
          style={{ 
            background: 'radial-gradient(circle at 50% 100%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 70%)' 
          }}
        ></div>
      </div>
      
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${weather === "clear" && timeOfDay === "day" ? "opacity-100" : "opacity-0"}`}
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%)",
          }}
        ></div>

  <div
    className={`absolute inset-0 transition-opacity duration-1000 ${weather === "clear" && timeOfDay === "night" ? "opacity-100" : "opacity-0"}`}
    style={{
      backgroundImage:
        "radial-gradient(circle at 30% 40%, rgba(150,150,255,0.3) 0%, rgba(150,150,255,0) 60%), radial-gradient(circle at 70% 30%, rgba(200,200,255,0.2) 0%, rgba(200,200,255,0) 60%)",
    }}
  ></div>

  <div
    className={`absolute inset-0 transition-opacity duration-1000 ${weather === "cloudy" ? "opacity-100" : "opacity-0"}`}
    style={{
      backgroundImage:
        "radial-gradient(circle at 25% 35%, rgba(200,200,200,0.4) 0%, rgba(200,200,200,0) 40%), radial-gradient(circle at 60% 50%, rgba(150,150,150,0.3) 0%, rgba(150,150,150,0) 50%), radial-gradient(circle at 35% 60%, rgba(180,180,180,0.4) 0%, rgba(180,180,180,0) 30%)",
    }}
  ></div>

  <div
    className={`absolute inset-0 transition-opacity duration-1000 ${weather === "rain" ? "opacity-100" : "opacity-0"}`}
    style={{
      backgroundImage:
        "radial-gradient(circle at 20% 30%, rgba(100,150,200,0.3) 0%, rgba(100,150,200,0) 40%), radial-gradient(circle at 80% 40%, rgba(150,180,220,0.3) 0%, rgba(150,180,220,0) 50%), radial-gradient(circle at 50% 60%, rgba(120,160,200,0.3) 0%, rgba(120,160,200,0) 40%)",
    }}
        ></div>

        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${weather === "windy" ? "opacity-100" : "opacity-0"}`}
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 25%, rgba(100,180,240,0.2) 0%, rgba(100,180,240,0) 45%), radial-gradient(circle at 85% 35%, rgba(120,200,255,0.2) 0%, rgba(120,200,255,0) 50%), radial-gradient(circle at 50% 55%, rgba(80,160,230,0.2) 0%, rgba(80,160,230,0) 45%)",
          }}
        ></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="w-full max-w-7xl mx-auto p-6 z-50 sticky top-0"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/10">
          <div className="flex items-center justify-center md:justify-start w-full md:w-auto gap-2">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-3xl relative"
            >
              <span className="relative z-10">🌦️</span>
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl -z-10 scale-150"></div>
            </motion.div>
            <h2 className={`text-2xl font-bold tracking-tight ${getTextColor('text-white', 'text-slate-700')}`}>Atmosphere</h2>
          </div>
          
          <div className="flex flex-1 max-w-md relative">
            <div className="relative flex-1 group">
              <input 
                type="text"
                placeholder="Search location..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(!!e.target.value);
                }}
                onFocus={() => setShowDropdown(!!searchQuery)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className={`w-full px-4 py-2 pl-10 rounded-l-lg bg-white/20 border border-white/10 
                  ${getTextColor('text-white', 'text-slate-700')} 
                  ${weather === 'clear' && timeOfDay === 'day' ? 'placeholder:text-slate-400' : 'placeholder:text-white/70'}
                  focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300`}
                disabled={locationTransition}
              />
              {/* Dropdown for city search */}
              {showDropdown && filteredLocations.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-white/50 backdrop-blur-lg rounded-xl shadow-xl z-50 border border-white/20 overflow-hidden">
                  {filteredLocations.map(loc => (
                    <button
                      key={loc.id}
                      className={`w-full text-left px-4 py-2 transition-all duration-200 
                        hover:bg-white/40 focus:bg-white/40 outline-none 
                        ${getTextColor('text-slate-700', 'text-slate-700')}`}
                      onMouseDown={() => {
                        handleLocationSelect(loc);
                        setShowDropdown(false);
                      }}
                    >
                      {loc.name}
                    </button>
                  ))}
                </div>
              )}
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 group-hover:text-white/80 transition-colors duration-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                initial={{ scale: 1 }}
                animate={{ scale: searchQuery ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </motion.svg>
            </div>
            <button 
              onClick={handleSearch}
              className={`bg-white/20 hover:bg-white/30 ${getTextColor('text-white', 'text-slate-700')} px-4 py-2 rounded-r-lg transition-all duration-300 flex items-center justify-center border-l-0 border border-white/10 hover:shadow-md hover:shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={locationTransition}
            >
              Search
            </button>
          </div>
          
          <div className="flex gap-2 flex-wrap justify-start md:justify-center">
            {locations.map((loc) => (
              <motion.button
                key={loc.name}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 border border-white/20 hover:shadow-md hover:shadow-white/10 ${
                  selectedLocation.id === loc.id 
                    ? `bg-white/30 ${getTextColor('text-white', 'text-slate-700')} border-white/30` 
                    : `bg-white/10 ${getTextColor('text-white/80', 'text-slate-700')} hover:bg-white/20`
                } ${locationTransition ? 'pointer-events-none' : ''}`}
                onClick={() => handleLocationSelect(loc)}
                disabled={locationTransition}
              >
                {loc.name}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: locationTransition ? 0 : 1, y: locationTransition ? 30 : 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl mx-auto px-6 py-8 z-10"
      >
        <div className="w-full bg-white/10 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/10 relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
          
          <div className="p-8 relative">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-8">
              <div className="text-center md:text-left relative">
                <motion.h1
                  key={`temp-${selectedLocation.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: locationTransition ? 0.5 : 0.2, duration: 0.6 }}
                  className={`text-6xl font-black ${getTextColor("text-white")} tracking-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]`}
                >
                  {weatherData?.temperature}°
                </motion.h1>

        {weatherData && (
          <motion.div
            key={`details-${selectedLocation.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: locationTransition ? 0.6 : 0.4, duration: 0.6 }}
            className="mt-4"
          >
            <p className={`text-3xl font-extralight ${getTextColor("text-white")} drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] mb-1 tracking-wide`}>
              {weatherData.description}
            </p>
            <div className={`flex items-center justify-center md:justify-start gap-2 text-xl ${getTextColor("text-white")} drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)] mb-4`}>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: locationTransition ? 0.7 : 0.6, type: "spring" }}
                className="w-2 h-2 rounded-full bg-white/60"
              ></motion.div>
              <p>{weatherData.location}</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4">
                      <div className={`flex items-center gap-3 ${getTextColor("text-white")} drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)] group`}>
                        <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors duration-300 border border-white/10">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
                          </svg>
                        </div>
                        <span>{weatherData.windSpeed} km/h</span>
                      </div>
                      <div className={`flex items-center gap-3 ${getTextColor("text-white")} drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)] group`}>
                        <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors duration-300 border border-white/10">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14.184V11a6.5 6.5 0 0 0-13 0v3.184a2 2 0 0 0 1.15 1.808l4.41 2.205a2.5 2.5 0 0 0 2.28 0l4.41-2.205A2 2 0 0 0 19 14.184Z" />
                          </svg>
                        </div>
                        <span>{weatherData.humidity}%</span>
                      </div>
                      <div className={`flex items-center gap-3 ${getTextColor("text-white")} drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)] group`}>
                        <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors duration-300 border border-white/10">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                <span>Feels like {weatherData?.feelsLike ? weatherData.feelsLike.toFixed(1) : "N/A"}°</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex flex-col items-center md:items-end gap-6">
        <motion.div
          key={`icon-${selectedLocation.id}-${weather}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: locationTransition ? 0.5 : 0.3, type: "spring" }}
          className="text-9xl relative"
        >
          <span className="relative z-10">
            {weather === "clear" && timeOfDay === "day" && "☀️"}
            {weather === "clear" && timeOfDay === "night" && "🌙"}
            {weather === "cloudy" && "☁️"}
            {weather === "rain" && "🌧️"}
            {weather === "windy" && "💨"}
          </span>
          <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl -z-10 scale-150"></div>
                </motion.div>
              </div>
            </div>
            
            <motion.div
              key={`highlights-${selectedLocation.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: locationTransition ? 0.7 : 0.6, duration: 0.8 }}
              className="pt-8 border-t border-white/10 relative"
            >
  <h3 className={`text-xl font-medium ${getTextColor("text-white/90")} mb-6 tracking-wide`}>Today's Highlights</h3>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 15px 30px -10px rgba(0,0,0,0.2)" }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 hover:bg-white/15 transition-all duration-300 border border-white/10 group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors duration-300 border border-white/10 flex items-center justify-center">
                <FiCloud className={`h-6 w-6 ${getTextColor('text-white/80', 'text-slate-700')}`} />
              </div>
              <h3 className={`text-lg ${getTextColor("text-white/90")} font-medium`}>Forecast</h3>
            </div>
            <p className={`${getTextColor("text-white/80")} leading-relaxed`}>
              {weather === "clear" ? "Expect clear skies to continue throughout the day with excellent visibility." : 
               weather === "cloudy" ? "Clouds will persist throughout the day with occasional breaks of sunshine." : 
               weather === "rain" ? "Rain expected for the next few hours with intermittent heavy showers." : 
               "Windy conditions will continue with occasional strong gusts."}
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            whileHover={{ y: -5, boxShadow: "0 15px 30px -10px rgba(0,0,0,0.2)" }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 hover:bg-white/15 transition-all duration-300 border border-white/10 group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors duration-300 border border-white/10 flex items-center justify-center">
                <FiThermometer className={`h-6 w-6 ${getTextColor('text-white/80', 'text-slate-700')}`} />
              </div>
              <h3 className={`text-lg ${getTextColor("text-white/90")} font-medium`}>Temperature</h3>
            </div>
            <div className={`${getTextColor("text-white/80")} leading-relaxed`}>
              <div className="flex justify-between items-center mb-2">
                <span>High</span>
                <span className={`text-lg font-medium ${getTextColor("text-white/90")}`}>{weatherData ? (weatherData.temperature + 3).toFixed(1) : "N/A"}°</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full mb-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1, duration: 1 }}
                  className="h-full bg-gradient-to-r from-blue-300 to-red-300"
                ></motion.div>
              </div>
              <div className="flex justify-between items-center">
                <span>Low</span>
                <span className={`text-lg font-medium ${getTextColor("text-white/90")}`}>{weatherData ? (weatherData.temperature - 4).toFixed(1) : "N/A"}°</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            whileHover={{ y: -5, boxShadow: "0 15px 30px -10px rgba(0,0,0,0.2)" }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-6 hover:bg-white/15 transition-all duration-300 border border-white/10 group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors duration-300 border border-white/10 flex items-center justify-center">
                <FiWind className={`h-6 w-6 ${getTextColor('text-white/80', 'text-slate-700')}`} />
              </div>
              <h3 className={`text-lg ${getTextColor("text-white/90")} font-medium`}>Air Quality</h3>
            </div>
            <div className={`${getTextColor("text-white/80")} leading-relaxed`}>
              <div className="mb-2">
                <span className="px-3 py-1 rounded-full bg-white/10 text-sm inline-flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    weather === "clear" ? "bg-green-400" : 
                    weather === "cloudy" ? "bg-yellow-400" : 
                    weather === "rain" ? "bg-green-400" : 
                    "bg-yellow-400"
                  }`}></span>
                  <span>
                    {weather === "clear" ? "Good" : 
                    weather === "cloudy" ? "Moderate" : 
                    weather === "rain" ? "Good after rain" : 
                    "Moderate with wind"}
                  </span>
                </span>
              </div>
              <p className="mt-2">
                {weather === "clear" ? "Perfect conditions for outdoor activities." : 
                       weather === "cloudy" ? "Acceptable for most individuals." : 
                       weather === "rain" ? "Precipitation helps clear pollutants from the air." : 
                       "Wind helps disperse pollutants but may carry allergens."}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="absolute inset-0 z-0 pointer-events-none">{getAtmosphereElements()}</div>
      
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md text-slate-800 px-6 py-3 rounded-lg shadow-lg z-50 font-medium"
          >
            {notificationMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function IntroAnimation() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getStarPosition = (i: number) => {
    return {
      top: `${(i * 3.7) % 100}%`,
      left: `${(i * 6.3) % 100}%`,
      opacity: 0.2 + (i % 5) * 0.1,
      scale: 0.5 + (i % 3) * 0.3,
      delay: (i % 7) * 0.7
    };
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-indigo-800 via-violet-800 to-purple-900 overflow-hidden font-inter">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => {
          const pos = getStarPosition(i);
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full"
              initial={{
                top: pos.top,
                left: pos.left,
                opacity: pos.opacity,
                scale: pos.scale,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [1, 1.2, 1],
                y: [0, -5 - (i % 5) * 2, 0],
              }}
              transition={{
                duration: 2 + (i % 4),
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                delay: pos.delay,
              }}
            />
          );
        })}
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -30 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: [0.19, 1.0, 0.22, 1.0] }}
          className="text-9xl relative mb-8"
        >
          <span className="drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">🌦️</span>
          <motion.div 
            className="absolute -inset-8 bg-white/10 rounded-full blur-2xl -z-10"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5] 
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          ></motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center mt-4"
        >
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70 tracking-tight mb-2">Atmosphere</h1>
          <p className="text-white/80 text-xl tracking-wide">Experience the weather</p>
        </motion.div>
        
        <motion.div 
          className="absolute -bottom-10 flex space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white/50 rounded-full"
              animate={{ 
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1] 
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

function LoadingAnimation() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          rotate: 360,
          transition: {
            repeat: Number.POSITIVE_INFINITY,
            duration: 1,
            ease: "linear",
          }
        }}
        className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full"
      ></motion.div>
    </div>
  )
}

function ClearSkies({ timeOfDay }: { timeOfDay: string }) {
  return (
    <>
      {timeOfDay === "day" && (
        <>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute top-20 right-20 w-32 h-32 bg-yellow-300/30 rounded-full blur-xl"
          ></motion.div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute top-10 left-1/4 w-16 h-16 bg-yellow-300/20 rounded-full blur-xl"
          ></motion.div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-yellow-300/15 rounded-full blur-xl"
          ></motion.div>

          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/40 rounded-full"
                initial={{
                  top: `${(i * 3) % 100}%`,
                  left: `${(i * 5) % 100}%`,
                  opacity: 0.2 + (i % 3) * 0.1,
                  scale: 0.5 + (i % 2) * 0.5,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [1, 1.2, 1],
                  y: [0, -10 - (i % 5) * 4, 0],
                }}
                transition={{
                  duration: 2 + (i % 3),
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                  delay: (i % 5) * 1,
                }}
              />
            ))}
          </div>
        </>
      )}

      {timeOfDay === "night" && (
        <>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute top-20 right-20 w-20 h-20 bg-indigo-400/20 rounded-full blur-xl"
          ></motion.div>
          <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    className="absolute top-10 left-1/4 w-12 h-12 bg-indigo-300/20 rounded-full blur-xl"
  ></motion.div>
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.8, delay: 0.4 }}
    className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-indigo-400/15 rounded-full blur-xl"
  ></motion.div>

  <div className="absolute inset-0 overflow-hidden">
    {[...Array(50)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-white/40 rounded-full"
        initial={{
          top: `${(i * 2) % 100}%`,
          left: `${(i * 4) % 100}%`,
          opacity: 0.2 + (i % 4) * 0.1,
          scale: 0.5 + (i % 2) * 0.5,
        }}
        animate={{
          opacity: [0, 1, 0],
                  scale: [1, 1.2, 1],
                  y: [0, -5 - (i % 3) * 3, 0],
                }}
                transition={{
                  duration: 2 + (i % 3),
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                  delay: (i % 5) * 1,
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute top-1/4 left-1/4 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl"
          ></motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="absolute top-1/3 right-1/4 w-56 h-56 bg-indigo-600/10 rounded-full blur-2xl"
          ></motion.div>
        </>
      )}
    </>
  )
}

function CloudySkies() {
  return (
    <>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute top-20 left-1/4 w-40 h-20 bg-white/15 rounded-full blur-xl"
      ></motion.div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-1/3 right-1/3 w-56 h-32 bg-white/20 rounded-full blur-xl"
      ></motion.div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute bottom-1/2 left-1/2 w-48 h-24 bg-white/15 rounded-full blur-xl"
      ></motion.div>

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            initial={{
              top: `${(i * 2.5) % 100}%`,
              left: `${(i * 4.5) % 100}%`,
              opacity: 0.1 + (i % 2) * 0.1,
              scale: 0.5 + (i % 2) * 0.5,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [1, 1.2, 1],
              y: [0, -5 - (i % 5), 0],
              x: [0, (i % 3) - 1, 0],
            }}
            transition={{
              duration: 5 + (i % 5),
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: (i % 5),
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="absolute top-1/2 left-1/4 w-32 h-16 bg-white/10 rounded-full blur-xl"
      ></motion.div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute top-2/3 right-1/4 w-40 h-20 bg-white/10 rounded-full blur-xl"
      ></motion.div>
    </>
  )
}

function RainyWeather() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute top-0 left-0 w-full h-full bg-blue-500/10"
      ></motion.div>

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(150)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-4 bg-blue-300/40 rounded-full"
            initial={{
              top: `${(i * 0.6) % 100}%`,
              left: `${(i * 1.5) % 100}%`,
              opacity: 0.3 + (i % 3) * 0.1,
            }}
            animate={{
              top: ["0%", "100%"],
              opacity: [0.3, 0.5, 0],
              scaleY: [1, 1.5, 0.5],
              scaleX: [1, 0.8, 1],
            }}
            transition={{
              duration: 0.8 + (i % 3) * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: (i % 10) * 0.3,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/15 rounded-full blur-xl"
      ></motion.div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="absolute top-1/3 right-1/4 w-48 h-48 bg-blue-500/15 rounded-full blur-xl"
      ></motion.div>

      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-blue-500/15 to-transparent"></div>
    </>
  )
}

function WindyWeather() {
  const [windowWidth, setWindowWidth] = useState(0);
  
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute top-0 left-0 w-full h-full bg-sky-500/10"
      ></motion.div>

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-sky-300/40 rounded-full"
            initial={{
              top: `${i * 2}%`,
              left: `${(i * 7) % 100}%`,
              opacity: 0.2 + (i % 3) * 0.1,
            }}
            animate={{
              x: [0, 100 + (i % 5) * 20],
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: (i % 5) * 0.6,
            }}
          />
        ))}
        
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`leaf-${i}`}
            className="absolute w-2 h-2 text-xl"
            initial={{
              top: `${(i * 12) % 100}%`,
              left: `-5%`,
              opacity: 0.7 + (i % 3) * 0.1,
              rotate: i * 45
            }}
            animate={{
              x: [0, windowWidth > 0 ? windowWidth + 100 : 1000],
              y: [0, (i % 3 - 1) * 50],
              rotate: [0, 360 + i * 90],
              opacity: [0.7, 0.9, 0.7, 0],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: i * 1.2,
      }}
    >
      {["🍃", "🍂", "🍁", "🌿"][i % 4]}
    </motion.div>
  ))}
</div>

<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.5, duration: 0.8 }}
  className="absolute top-1/4 left-1/4 w-40 h-40 bg-sky-400/15 rounded-full blur-xl"
></motion.div>
<motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.7, duration: 0.8 }}
  className="absolute top-1/3 right-1/4 w-56 h-56 bg-sky-500/15 rounded-full blur-xl"
></motion.div>

      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-sky-500/15 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-full h-16 bg-gradient-to-t from-sky-500/15 to-transparent"></div>
    </>
  )
}
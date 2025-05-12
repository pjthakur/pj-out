"use client";

import { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Moon, Sun, Music, Coffee, Trophy, Star, ArrowUp, HelpCircle, Info, X } from "lucide-react";
import { Bangers, Poppins, Silkscreen } from "next/font/google";



const gameHeadingFont = Bangers({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-game-heading",
});

const gamePixelFont = Silkscreen({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-game-pixel",
});

const mainFont = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-main",
});



const StatusBar = memo(({ value, color, theme, label }: { value: number, color: string, theme: string, label?: string }) => (
  <div className="relative w-full h-6 bg-gray-800/40 rounded-md overflow-hidden backdrop-blur-sm shadow-inner border-2 border-gray-900/50">
    <motion.div
      className={`h-full ${color} transition-all duration-300 ease-out shadow-lg`}
      style={{ width: `${value}%` }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 0.5 }}
    >
      {/* Shine effect */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-white/20"></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '10px 10px'
      }}></div>
    </motion.div>

    {label && (
      <div className="absolute inset-0 flex items-center justify-between px-3">
        <div className="font-game-pixel text-[10px] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] uppercase tracking-wider">
          {label}
        </div>
        <div className="font-game-pixel text-[10px] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] bg-black/20 rounded px-1">
          {value}%
        </div>
      </div>
    )}
  </div>
));

StatusBar.displayName = "StatusBar";


const InstructionsPanel = ({ theme, isMobile, onClose }: { theme: string, isMobile: boolean, onClose?: () => void }) => (
  <div className={`h-full flex flex-col ${theme === "dark" ? "text-white" : "text-slate-800"
    } font-main`}>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-3xl font-game-heading tracking-wide flex items-center gap-2">
        <span className={`p-1.5 rounded-lg ${theme === "dark" ? "bg-sky-500/20" : "bg-sky-500/30"
          }`}>
          <Info size={24} className={theme === "dark" ? "text-sky-400" : "text-sky-600"} />
        </span>
        How To Play
      </h2>
      {isMobile && onClose && (
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-200/20"
        >
          <X size={24} />
        </motion.button>
      )}
    </div>

    <div className="space-y-4 overflow-auto pr-1">
      <motion.section
        className={`rounded-lg p-3 ${theme === "dark" ? "bg-amber-500/10" : "bg-amber-100/50"
          } border-l-4 border-amber-400`}
        whileHover={{ x: 4 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="flex items-center gap-2 text-lg font-game-heading mb-1 text-amber-500">
          <Coffee size={18} /> Feeding Your Pet
        </h3>
        <p className="text-sm">Click <span className="font-game-pixel text-amber-600 px-1">FEED</span> to increase hunger. Feeding has a small happiness boost.</p>
        <div className="text-xs mt-1 opacity-70 bg-black/10 rounded px-2 py-1 inline-block">+15-25 hunger, +3 happiness</div>
      </motion.section>

      <motion.section
        className={`rounded-lg p-3 ${theme === "dark" ? "bg-indigo-500/10" : "bg-indigo-100/50"
          } border-l-4 border-indigo-400`}
        whileHover={{ x: 4 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="flex items-center gap-2 text-lg font-game-heading mb-1 text-indigo-500">
          <Music size={18} /> Playing
        </h3>
        <p className="text-sm">Click <span className="font-game-pixel text-indigo-600 px-1">PLAY</span> for happiness boost. Requires energy and makes pet hungry.</p>
        <div className="text-xs mt-1 opacity-70 bg-black/10 rounded px-2 py-1 inline-block">+10-25 happiness, -5-15 energy, -8 hunger</div>
      </motion.section>

      <motion.section
        className={`rounded-lg p-3 ${theme === "dark" ? "bg-rose-500/10" : "bg-rose-100/50"
          } border-l-4 border-rose-400`}
        whileHover={{ x: 4 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="flex items-center gap-2 text-lg font-game-heading mb-1 text-rose-500">
          <Moon size={18} /> Sleep
        </h3>
        <p className="text-sm">Click <span className="font-game-pixel text-rose-600 px-1">SLEEP</span> to restore energy. May decrease happiness slightly.</p>
        <div className="text-xs mt-1 opacity-70 bg-black/10 rounded px-2 py-1 inline-block">+15-35 energy, -2 happiness</div>
      </motion.section>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <section className={`rounded-lg p-3 ${theme === "dark" ? "bg-slate-700/30" : "bg-slate-200/50"
          }`}>
          <h3 className="flex items-center gap-2 text-base font-medium mb-1">
            <Star size={16} className="text-yellow-500" /> Leveling
          </h3>
          <p className="text-xs">Earn XP from actions. Level up for bonuses and achievements.</p>
        </section>

        <section className={`rounded-lg p-3 ${theme === "dark" ? "bg-slate-700/30" : "bg-slate-200/50"
          }`}>
          <h3 className="flex items-center gap-2 text-base font-medium mb-1">
            <Trophy size={16} className="text-yellow-500" /> Achievements
          </h3>
          <p className="text-xs">Complete milestones to earn special achievements.</p>
        </section>

        <section className={`rounded-lg p-3 ${theme === "dark" ? "bg-slate-700/30" : "bg-slate-200/50"
          }`}>
          <h3 className="flex items-center gap-2 text-base font-medium mb-1">
            <ArrowUp size={16} className="text-green-500" /> Streaks
          </h3>
          <p className="text-xs">Repeated actions earn bonus XP. Try for 3+ streaks!</p>
        </section>

        <section className={`rounded-lg p-3 ${theme === "dark" ? "bg-slate-700/30" : "bg-slate-200/50"
          }`}>
          <h3 className="flex items-center gap-2 text-base font-medium mb-1">
            <Heart size={16} className="text-rose-500" /> Status Bars
          </h3>
          <p className="text-xs">Keep all bars in the green for a happy, healthy pet.</p>
        </section>
      </motion.div>

      <motion.section
        className={`rounded-lg p-3 mt-4 ${theme === "dark" ? "bg-green-500/10" : "bg-green-100/50"
          } border-l-4 border-green-400`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="flex items-center gap-2 text-lg font-game-heading mb-2 text-green-500">
          <HelpCircle size={18} /> Tips & Tricks
        </h3>
        <ul className="text-xs space-y-1.5 list-disc list-inside">
          <li>Balance all three needs for maximum happiness</li>
          <li>Happiness decays faster than other stats</li>
          <li>Play is best for happiness, but costs hunger</li>
          <li>Feed before playing if hunger is low</li>
          <li>Sleep when energy is low to recover</li>
        </ul>
      </motion.section>
    </div>
  </div>
);



const getMessageStyles = (message: string) => {
  if (!message) return {
    icon: null,
    borderColor: "border-indigo-500/50",
    shadowColor: "shadow-[0_0_15px_rgba(99,102,241,0.4)]"
  };

  if (message.toLowerCase().includes("hungry") ||
    message.toLowerCase().includes("hunger") ||
    message.toLowerCase().includes("feed") ||
    message.toLowerCase().includes("food") ||
    message.toLowerCase().includes("full")) {
    return {
      icon: <Coffee className="mr-2 text-amber-400" size={18} />,
      borderColor: "border-amber-500/50",
      shadowColor: "shadow-[0_0_15px_rgba(245,158,11,0.4)]"
    };
  } else if (message.toLowerCase().includes("happy") ||
    message.toLowerCase().includes("happiness") ||
    message.toLowerCase().includes("fun") ||
    message.toLowerCase().includes("playing") ||
    message.toLowerCase().includes("played") ||
    message.toLowerCase().includes("trick") ||
    message.toLowerCase().includes("time of their life")) {
    return {
      icon: <Music className="mr-2 text-indigo-400" size={18} />,
      borderColor: "border-indigo-500/50",
      shadowColor: "shadow-[0_0_15px_rgba(99,102,241,0.4)]"
    };
  } else if (message.toLowerCase().includes("energy") ||
    message.toLowerCase().includes("tired") ||
    message.toLowerCase().includes("sleep") ||
    message.toLowerCase().includes("dream") ||
    message.toLowerCase().includes("slept") ||
    message.toLowerCase().includes("nightmare")) {
    return {
      icon: <Heart className="mr-2 text-rose-400" size={18} />,
      borderColor: "border-rose-500/50",
      shadowColor: "shadow-[0_0_15px_rgba(244,63,94,0.4)]"
    };
  } else if (message.toLowerCase().includes("level") ||
    message.toLowerCase().includes("xp") ||
    message.toLowerCase().includes("streak")) {
    return {
      icon: <Star className="mr-2 text-yellow-400" size={18} />,
      borderColor: "border-yellow-500/50",
      shadowColor: "shadow-[0_0_15px_rgba(234,179,8,0.4)]"
    };
  } else if (message.toLowerCase().includes("achievement") ||
    message.toLowerCase().includes("unlocked")) {
    return {
      icon: <Trophy className="mr-2 text-emerald-400" size={18} />,
      borderColor: "border-emerald-500/50",
      shadowColor: "shadow-[0_0_15px_rgba(16,185,129,0.4)]"
    };
  }

  return {
    icon: null,
    borderColor: "border-indigo-500/50",
    shadowColor: "shadow-[0_0_15px_rgba(99,102,241,0.4)]"
  };
};

export default function Home() {
  const [hunger, setHunger] = useState(50);
  const [happiness, setHappiness] = useState(50);
  const [energy, setEnergy] = useState(50);
  const [mood, setMood] = useState("normal");
  const [theme, setTheme] = useState("light");
  const [message, setMessage] = useState("Your pet is waiting for you to play!");
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [petLevel, setPetLevel] = useState(1);
  const [petXP, setPetXP] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [lastAction, setLastAction] = useState("");
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const lowStatsWarned = useRef({
    hunger: false,
    energy: false,
    happiness: false
  });

  const isMounted = useRef(true);

  const messageTimerRef = useRef<NodeJS.Timeout | null>(null);
  const decayTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    isMounted.current = true;

    const savedTheme = localStorage.getItem("pet-theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme("dark");
    }

    try {
      const savedData = localStorage.getItem("pet-data");
      if (savedData) {
        const data = JSON.parse(savedData);
        const batchUpdates = () => {
          if (!isMounted.current) return;
          setHunger(data.hunger || 50);
          setHappiness(data.happiness || 50);
          setEnergy(data.energy || 50);
          setPetLevel(data.petLevel || 1);
          setPetXP(data.petXP || 0);
          setStreakCount(data.streakCount || 0);
          setLastInteraction(data.lastInteraction || Date.now());
          setAchievements(data.achievements || []);
        };
        requestAnimationFrame(batchUpdates);
      }
    } catch (e) {
      console.error("Error loading saved data");
    }

    return () => {
      isMounted.current = false;
      if (decayTimerRef.current) clearInterval(decayTimerRef.current);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (decayTimerRef.current) {
      clearInterval(decayTimerRef.current);
    }

    const interval = setInterval(() => {
      if (!isMounted.current) return;

      setHunger(prev => Math.max(Math.round((prev - 0.5) * 10) / 10, 0));
      setHappiness(prev => Math.max(Math.round((prev - 0.7) * 10) / 10, 0));
      setEnergy(prev => Math.max(Math.round((prev - 0.4) * 10) / 10, 0));

      if (Date.now() - lastInteraction > 24 * 60 * 60 * 1000) {
        setStreakCount(0);
      }
    }, 40000);

    decayTimerRef.current = interval;

    return () => clearInterval(interval);
  }, [lastInteraction]);

  useEffect(() => {
    if (!isMounted.current) return;

    try {
      const dataToSave = {
        hunger: Math.round(hunger),
        happiness: Math.round(happiness),
        energy: Math.round(energy),
        petLevel,
        petXP,
        streakCount,
        lastInteraction,
        achievements
      };
      localStorage.setItem("pet-data", JSON.stringify(dataToSave));
    } catch (e) {
      console.error("Error saving data");
    }
  }, [hunger, happiness, energy, petLevel, petXP, streakCount, lastInteraction, achievements]);

  useEffect(() => {
    updateMood();
    if (typeof document !== 'undefined') {
      document.body.className = theme === "dark" ? "bg-slate-900 text-white" : "bg-white text-slate-900";
    }
  }, [hunger, happiness, energy, theme]);

  useEffect(() => {
    if (!isMounted.current) return;

    const checkStats = () => {
      if (hunger < 20 && !lowStatsWarned.current.hunger) {
        showMessage("Your pet is very hungry! Please feed them soon!", 3000);
        lowStatsWarned.current.hunger = true;
      } else if (hunger >= 40) {
        lowStatsWarned.current.hunger = false;
      }

      if (energy < 15 && !lowStatsWarned.current.energy) {
        showMessage("Your pet is exhausted and needs sleep!", 3000);
        lowStatsWarned.current.energy = true;
      } else if (energy >= 40) {
        lowStatsWarned.current.energy = false;
      }

      if (happiness < 20 && !lowStatsWarned.current.happiness) {
        showMessage("Your pet is feeling sad. Try playing with them!", 3000);
        lowStatsWarned.current.happiness = true;
      } else if (happiness >= 40) {
        lowStatsWarned.current.happiness = false;
      }
    };

    const roundedSum = Math.round(hunger) + Math.round(happiness) + Math.round(energy);
    if (roundedSum % 5 === 0) {
      checkStats();
    }
  }, [hunger, happiness, energy]);

  useEffect(() => {
    if (!isMounted.current) return;

    const xpNeeded = petLevel * 100;
    if (petXP >= xpNeeded) {
      setPetLevel(prev => prev + 1);
      setPetXP(prev => prev - xpNeeded);
      setShowLevelUp(true);
      showMessage(`Level up! Your pet is now level ${petLevel + 1}!`, 4000);

      setTimeout(() => {
        if (!isMounted.current) return;
        setShowLevelUp(false);
      }, 3000);

      if (petLevel + 1 === 5 && !achievements.includes("Reached Level 5")) {
        addAchievement("Reached Level 5");
      } else if (petLevel + 1 === 10 && !achievements.includes("Reached Level 10")) {
        addAchievement("Reached Level 10");
      }
    }
  }, [petXP, petLevel, achievements]);

  const addAchievement = (achievement: string) => {
    if (!achievements.includes(achievement)) {
      setAchievements(prev => [...prev, achievement]);
      showMessage(`Achievement unlocked: ${achievement}!`, 4000);
    }
  };

  const updateMood = () => {
    const total = hunger + happiness + energy;
    const newMood = total < 60 ? "sad" : total < 120 ? "normal" : total < 200 ? "happy" : "ecstatic";

    if (newMood !== mood) {
      setMood(newMood);
    }
  };

  const showMessage = (text: string, duration: number = 3000) => {
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
    }

    setMessage(text);
    setIsMessageVisible(true);

    const timer = setTimeout(() => {
      if (!isMounted.current) return;
      setIsMessageVisible(false);
    }, duration);

    messageTimerRef.current = timer;
  };

  const addXP = (amount: number) => {
    setPetXP(prev => prev + amount);
  };

  const updateStreak = (action: string) => {
    setLastInteraction(Date.now());

    if (action === lastAction) {
      setStreakCount(prev => prev + 1);
      if (streakCount + 1 >= 3) {
        addXP(5);
        showMessage(`${streakCount + 1}x streak! Bonus XP awarded!`);
      }
    } else {
      setStreakCount(0);
    }

    setLastAction(action);
  };

  const feed = () => {
    if (hunger >= 90) {
      showMessage("Your pet is too full to eat more right now!");
      return;
    }

    updateStreak("feed");

    const feedAmount = Math.floor(Math.random() * 10) + 15;
    setHunger(prev => Math.min(prev + feedAmount, 100));

    if (Math.random() < 0.1) {
      showMessage("Your pet doesn't feel well after eating...");
      setHappiness(prev => Math.max(prev - 10, 0));
      setAnimation("wiggle");
      addXP(3);
    } else {
      showMessage(`Your pet enjoyed the food! +${feedAmount} hunger`);
      setHappiness(prev => Math.min(prev + 3, 100));
      setAnimation("wiggle");
      addXP(5);
    }

    if (hunger + feedAmount >= 100 && !achievements.includes("Fully Satisfied")) {
      addAchievement("Fully Satisfied");
    }
  };

  const play = () => {
    if (energy < 20) {
      showMessage("Your pet is too tired to play right now. Let them sleep!");
      setAnimation("sleep");
      return;
    }

    if (hunger < 25) {
      showMessage("Your pet is too hungry to play. Feed them first!");
      setAnimation("wiggle");
      return;
    }

    updateStreak("play");

    const happinessAmount = Math.floor(Math.random() * 15) + 10;
    const energyDecrease = Math.floor(Math.random() * 10) + 5;

    setHappiness(prev => Math.min(prev + happinessAmount, 100));
    setEnergy(prev => Math.max(prev - energyDecrease, 0));

    setHunger(prev => Math.max(prev - 8, 0));

    const playOutcome = Math.random();
    if (playOutcome < 0.7) {
      showMessage(`Your pet had fun playing! +${happinessAmount} happiness`);
      setAnimation("bounce");
      addXP(7);
    } else if (playOutcome < 0.9) {
      showMessage("Your pet learned a new trick while playing!");
      setHappiness(prev => Math.min(prev + 10, 100));
      setAnimation("bounce");
      addXP(10);
    } else {
      showMessage("Your pet is having the time of their life!");
      setHappiness(prev => Math.min(prev + 15, 100));
      setAnimation("bounce");
      addXP(15);
    }

    if (happiness + happinessAmount >= 100 && !achievements.includes("Overjoyed")) {
      addAchievement("Overjoyed");
    }
  };

  const sleep = () => {
    if (energy >= 90) {
      showMessage("Your pet isn't tired right now.");
      return;
    }

    updateStreak("sleep");

    const energyAmount = Math.floor(Math.random() * 20) + 15;
    setEnergy(prev => Math.min(prev + energyAmount, 100));

    setHappiness(prev => Math.max(prev - 2, 0));

    const sleepOutcome = Math.random();
    if (sleepOutcome < 0.8) {
      showMessage(`Your pet slept well! +${energyAmount} energy`);
      setAnimation("sleep");
      addXP(6);
    } else if (sleepOutcome < 0.95) {
      showMessage("Your pet had a dream and woke up happier!");
      setHappiness(prev => Math.min(prev + 15, 100));
      setAnimation("sleep");
      addXP(8);
    } else {
      showMessage("Your pet had a nightmare!");
      setHappiness(prev => Math.max(prev - 12, 0));
      setAnimation("sleep");
      addXP(3);
    }

    if (energy + energyAmount >= 100 && !achievements.includes("Fully Rested")) {
      addAchievement("Fully Rested");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("pet-theme", newTheme);
  };

  const [animation, setAnimation] = useState("idle");

  useEffect(() => {
    if (animation !== "idle") {
      const timer = setTimeout(() => {
        if (!isMounted.current) return;
        setAnimation("idle");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [animation]);

  const getStatusBarColor = (value: number, type: 'hunger' | 'happiness' | 'energy') => {
    const colors = {
      hunger: {
        low: "bg-gradient-to-r from-red-500 to-red-600",
        medium: "bg-gradient-to-r from-yellow-500 to-orange-500",
        high: "bg-gradient-to-r from-green-400 to-emerald-500"
      },
      happiness: {
        low: "bg-gradient-to-r from-red-500 via-red-600 to-red-500",
        medium: "bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500",
        high: "bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500"
      },
      energy: {
        low: "bg-gradient-to-r from-red-500 via-pink-500 to-red-600",
        medium: "bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500",
        high: "bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500"
      }
    };

    if (value < 30) return colors[type].low;
    if (value < 60) return colors[type].medium;
    return colors[type].high;
  };

  const getPetImage = () => {
    if (animation === "sleep") {
      return "🥱";
    }

    if (animation === "wiggle") {
      return "😋";
    }

    if (animation === "bounce") {
      return "😆";
    }

    switch (mood) {
      case "sad": return "😢";
      case "normal": return "😐";
      case "happy": return "😊";
      case "ecstatic": return "🥰";
      default: return "😐";
    }
  };

  const animationVariants = {
    idle: {
      y: [0, -3, 0],
      transition: {
        y: {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        }
      }
    },
    wiggle: {
      rotate: [0, -10, 10, -10, 10, 0],
      scale: [1, 1.1, 1],
      transition: { duration: 0.5 }
    },
    bounce: {
      y: [0, -20, 0],
      scale: [1, 1.1, 1],
      transition: { duration: 0.5 }
    },
    sleep: {
      rotate: 5,
      scale: [1, 0.95, 1],
      transition: {
        scale: {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        },
        rotate: { duration: 0.2 }
      }
    }
  };

  const levelUpVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    },
    exit: { opacity: 0, scale: 0.8, y: -20 }
  };

  const xpNeeded = petLevel * 100;
  const xpPercentage = Math.max(0, Math.min(100, (petXP / xpNeeded) * 100));

  const displayHunger = Math.round(hunger);
  const displayHappiness = Math.round(happiness);
  const displayEnergy = Math.round(energy);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    if (typeof window !== 'undefined') {
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isMobile && showInstructions) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [isMobile, showInstructions]);

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${gameHeadingFont.variable} ${gamePixelFont.variable} ${mainFont.variable} ${theme === "dark"
      ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800"
      : "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100"
      } transition-colors duration-700 font-main`}>
      <div className="fixed inset-0 overflow-hidden z-0 opacity-30">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-purple-400 blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 -right-10 w-60 h-60 rounded-full bg-pink-400 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/3 w-40 h-40 rounded-full bg-blue-400 blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className={`fixed bottom-4 right-4 p-3 rounded-full backdrop-blur-md z-50 ${theme === "dark"
          ? "bg-slate-700/50 text-yellow-300 shadow-[0_0_15px_rgba(253,224,71,0.3)]"
          : "bg-white/50 text-slate-800 shadow-[0_0_15px_rgba(203,213,225,0.5)]"
          }`}
      >
        {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
      </motion.button>

      {isMobile && (
        <motion.button
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowInstructions(true)}
          className={`fixed bottom-4 left-4 p-3 rounded-full backdrop-blur-md z-50 ${theme === "dark"
            ? "bg-slate-700/50 text-sky-300 shadow-[0_0_15px_rgba(125,211,252,0.3)]"
            : "bg-white/50 text-slate-800 shadow-[0_0_15px_rgba(203,213,225,0.5)]"
            }`}
        >
          <HelpCircle size={24} />
        </motion.button>
      )}

      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={levelUpVariants}
          >
            <motion.div
              className={`p-8 rounded-xl backdrop-blur-lg shadow-xl ${theme === "dark"
                ? "bg-slate-800/80 text-white border border-yellow-300/30 shadow-[0_0_30px_rgba(250,204,21,0.5)]"
                : "bg-white/90 text-slate-800 border border-yellow-400/50 shadow-[0_0_30px_rgba(250,204,21,0.4)]"
                } text-center font-main`}
              animate={{
                boxShadow: theme === "dark"
                  ? ["0 0 30px rgba(250,204,21,0.3)", "0 0 40px rgba(250,204,21,0.6)", "0 0 30px rgba(250,204,21,0.3)"]
                  : ["0 0 30px rgba(250,204,21,0.2)", "0 0 40px rgba(250,204,21,0.4)", "0 0 30px rgba(250,204,21,0.2)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className={`mx-auto mb-4 p-4 rounded-full inline-block ${theme === "dark"
                  ? "bg-yellow-300 text-yellow-800"
                  : "bg-yellow-400 text-yellow-900"
                  }`}
              >
                <ArrowUp size={48} />
              </motion.div>
              <h2 className={`text-4xl font-game-heading mb-2 tracking-wider ${theme === "dark" ? "text-yellow-300" : "text-yellow-500"
                }`}>Level Up!</h2>
              <p className="font-game-pixel text-sm mb-4 mt-1">YOUR PET IS NOW LEVEL {petLevel}!</p>
              <motion.div
                className="mt-6 space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <p className="text-sm font-medium">You've unlocked new potential!</p>
                <div className={`text-xs py-2 px-3 rounded ${theme === "dark" ? "bg-slate-700/70" : "bg-yellow-100"
                  }`}>
                  <span className="font-medium">Bonus:</span> Slower stat decay
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isMobile && (
        <AnimatePresence>
          {showInstructions && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className={`w-full max-w-lg mx-4 p-6 rounded-xl ${theme === "dark" ? "bg-slate-800/80" : "bg-white/80"
                  } backdrop-blur-md shadow-2xl max-h-[80vh] overflow-auto`}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <InstructionsPanel
                  theme={theme}
                  isMobile={true}
                  onClose={() => setShowInstructions(false)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <div className="lg:w-1/2 flex items-center justify-center p-4 relative z-10 min-h-screen">
        <div className="relative w-full max-w-md">
          <motion.div
            className={`w-full p-8 rounded-xl shadow-2xl backdrop-blur-md border border-white/10 relative overflow-hidden ${theme === "dark"
              ? "bg-slate-800/40 text-white"
              : "bg-white/40 text-slate-800"
              }`}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

            <div className="absolute right-4 top-4 flex items-center backdrop-blur-sm px-2 py-1 rounded-full bg-white/10 border border-white/20">
              <motion.div
                className="p-1 rounded-full bg-yellow-400/20 mr-1"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Star className="h-4 w-4 text-yellow-400" />
              </motion.div>
              <span className="font-game-pixel text-xs">LVL {petLevel}</span>
            </div>

            <h1 className="text-3xl font-game-heading text-center my-2 tracking-wide relative">
              <span className={`${theme === "dark"
                ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-blue-300"
                : "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500"
                }`}>Virtual Pet</span>
            </h1>

            <div className="flex justify-center mb-4">
              <motion.div
                className="text-9xl p-10 overflow-hidden"
                variants={animationVariants}
                animate={animation}
              >
                {getPetImage()}
              </motion.div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-game-pixel uppercase text-blue-400">Level Progress</span>
                <span className="text-xs font-medium font-main">{petXP}/{xpNeeded} XP</span>
              </div>
              <div className="w-full h-3 bg-slate-700/30 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={false}
                  style={{ width: `${xpPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div className="space-y-5 mb-7">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-1 font-medium font-main">
                    <Coffee size={16} className={theme === "dark" ? "text-amber-400" : "text-amber-600"} /> Hunger
                  </span>
                </div>
                <StatusBar
                  value={displayHunger}
                  color={getStatusBarColor(displayHunger, 'hunger')}
                  theme={theme}
                  label="HUNGER"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-1 font-medium font-main">
                    <Music size={16} className={theme === "dark" ? "text-indigo-400" : "text-indigo-600"} /> Happiness
                  </span>
                </div>
                <StatusBar
                  value={displayHappiness}
                  color={getStatusBarColor(displayHappiness, 'happiness')}
                  theme={theme}
                  label="HAPPY"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-1 font-medium font-main">
                    <Heart size={16} className={theme === "dark" ? "text-rose-400" : "text-rose-600"} /> Energy
                  </span>
                </div>
                <StatusBar
                  value={displayEnergy}
                  color={getStatusBarColor(displayEnergy, 'energy')}
                  theme={theme}
                  label="ENERGY"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95, y: 5 }}
                onClick={feed}
                className={`px-4 py-3 rounded-lg font-game-pixel text-sm shadow-lg border-b-4 border-r-4 border-l-2 border-t-2 transition-all relative overflow-hidden ${theme === "dark"
                  ? "bg-amber-600 hover:bg-amber-500 text-white border-amber-800 hover:border-amber-700 shadow-amber-900/50"
                  : "bg-amber-500 hover:bg-amber-400 text-white border-amber-700 hover:border-amber-600 shadow-amber-800/50"
                  }`}
              >
                <span className="relative z-10">FEED</span>
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95, y: 5 }}
                onClick={play}
                className={`px-4 py-3 rounded-lg font-game-pixel text-sm shadow-lg border-b-4 border-r-4 border-l-2 border-t-2 transition-all relative overflow-hidden ${theme === "dark"
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-800 hover:border-indigo-700 shadow-indigo-900/50"
                  : "bg-indigo-500 hover:bg-indigo-400 text-white border-indigo-700 hover:border-indigo-600 shadow-indigo-800/50"
                  }`}
              >
                <span className="relative z-10">PLAY</span>
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95, y: 5 }}
                onClick={sleep}
                className={`px-4 py-3 rounded-lg font-game-pixel text-sm shadow-lg border-b-4 border-r-4 border-l-2 border-t-2 transition-all relative overflow-hidden ${theme === "dark"
                  ? "bg-rose-600 hover:bg-rose-500 text-white border-rose-800 hover:border-rose-700 shadow-rose-900/50"
                  : "bg-rose-500 hover:bg-rose-400 text-white border-rose-700 hover:border-rose-600 shadow-rose-800/50"
                  }`}
              >
                <span className="relative z-10">SLEEP</span>
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
              </motion.button>
            </div>

            <AnimatePresence>
              {isMessageVisible && (
                <motion.div
                  className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg backdrop-blur-md bg-slate-900/90 border-2 ${getMessageStyles(message).borderColor} text-center w-11/12 max-w-xs z-50 ${getMessageStyles(message).shadowColor} font-medium text-white font-main`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    initial={{ opacity: 0.5, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="flex items-center justify-center"
                  >
                    {getMessageStyles(message).icon}
                    <span>{message}</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {achievements.length > 0 && (
              <motion.div
                className="mt-5 pt-3 border-t border-white/10 font-main"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Trophy size={16} className="text-yellow-400" />
                  <span className="text-sm font-medium uppercase tracking-wide">Achievements ({achievements.length}/8)</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      className={`text-xs px-2 py-1 rounded ${theme === "dark"
                        ? "bg-slate-800/50 text-slate-200"
                        : "bg-white/50 text-slate-700"
                        } flex items-center gap-1 border-l-2 border-yellow-400`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {achievement.includes("Level") ? (
                        <Star size={10} className="text-yellow-400 shrink-0" />
                      ) : achievement.includes("Satisfied") ? (
                        <Coffee size={10} className="text-amber-400 shrink-0" />
                      ) : achievement.includes("Rested") ? (
                        <Moon size={10} className="text-rose-400 shrink-0" />
                      ) : achievement.includes("Overjoyed") ? (
                        <Music size={10} className="text-indigo-400 shrink-0" />
                      ) : (
                        <Trophy size={10} className="text-emerald-400 shrink-0" />
                      )}
                      <span className="truncate">{achievement}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-2">
                  <div className="w-full h-1 bg-gray-700/40 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-yellow-400"
                      style={{ width: `${(achievements.length / 8) * 100}%` }}
                      animate={{ width: `${(achievements.length / 8) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {streakCount > 0 && (
            <motion.div
              className={`mt-3 text-center font-medium ${theme === "dark" ? "text-amber-300" : "text-amber-600"
                } font-game-heading text-lg`}
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {streakCount}x Streak!
            </motion.div>
          )}
        </div>
      </div>

      {!isMobile && (
        <div className="hidden lg:block lg:w-1/2 h-screen overflow-auto relative z-10">
          <motion.div
            className={`h-full p-8 backdrop-blur-md ${theme === "dark" ? "bg-slate-800/30" : "bg-white/30"
              } border-l border-white/10`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <InstructionsPanel theme={theme} isMobile={isMobile} />
          </motion.div>
        </div>
      )}

      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(0, 20px) scale(0.9); }
          75% { transform: translate(-20px, -10px) scale(1.05); }
        }
        
        .animate-blob {
          animation: blob 10s infinite alternate;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .font-game-heading {
          font-family: var(--font-game-heading);
        }
        
        .font-game-pixel {
          font-family: var(--font-game-pixel);
        }
      `}</style>
    </div>
  );
}

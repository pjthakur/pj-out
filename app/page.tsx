'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';

type Difficulty = 'easy' | 'medium' | 'hard';
type SpaceshipType = 'classic' | 'futuristic' | 'alien';
type BackgroundType = 'nebula' | 'deepspace' | 'galaxy';

interface Asteroid {
  id: string;
  word: string;
  position: { x: number; y: number };
  speed: number;
  size: number;
  color: string;
  rotation: number;
  active: boolean;
}

interface GameState {
  isPlaying: boolean;
  score: number;
  lives: number;
  asteroids: Asteroid[];
  currentInput: string;
  accuracy: number;
  wpm: number;
  startTime: number | null;
  totalKeystrokes: number;
  correctKeystrokes: number;
  gameOver: boolean;
  difficulty: Difficulty;
  wordsTyped: number;
  soundEnabled: boolean;
  spaceship: SpaceshipType;
  background: BackgroundType;
}

const WORD_LISTS = {
  easy: [
    'code', 'html', 'css', 'tag', 'div', 'span', 'flex', 'grid', 'font',
    'link', 'text', 'view', 'app', 'web', 'dev', 'bug', 'fix', 'test'
  ],
  medium: [
    'function', 'variable', 'component', 'element', 'module', 'export',
    'import', 'promise', 'async', 'await', 'object', 'string', 'class'
  ],
  hard: [
    'asynchronous', 'authentication', 'authorization', 'concatenation',
    'destructuring', 'encapsulation', 'inheritance', 'interpolation',
    'middleware', 'dependency', 'algorithm', 'virtualization'
  ]
};

const GAME_SETTINGS = {
  easy: {
    asteroidFrequency: 3000,
    asteroidSpeed: 60,
    basePoints: 10
  },
  medium: {
    asteroidFrequency: 2000,
    asteroidSpeed: 80,
    basePoints: 20
  },
  hard: {
    asteroidFrequency: 1500,
    asteroidSpeed: 100,
    basePoints: 30
  }
};

const SPACESHIPS = {
  classic: {
    svg: `<svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="classicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3498db;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2980b9;stop-opacity:1" />
        </linearGradient>
        <filter id="classicGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <path d="M30,10 L45,60 L30,70 L15,60 Z" fill="url(#classicGradient)" stroke="#ffffff" stroke-width="1" />
      <ellipse cx="30" cy="65" rx="10" ry="5" fill="#ff9900" filter="url(#classicGlow)" class="engine-glow" />
      <path d="M20,60 L40,60 L35,75 L25,75 Z" fill="#ff9900" opacity="0.8" />
      <circle cx="25" cy="40" r="3" fill="#ffffff" opacity="0.7" />
      <circle cx="35" cy="40" r="3" fill="#ffffff" opacity="0.7" />
      <path d="M28,25 L32,25 L32,45 L28,45 Z" fill="#ffffff" opacity="0.5" />
    </svg>`
  },
  futuristic: {
    svg: `<svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="futuristicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#9b59b6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8e44ad;stop-opacity:1" />
        </linearGradient>
        <filter id="futuristicGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="cockpitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.7" />
          <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0.1" />
        </linearGradient>
      </defs>
      <path d="M30,5 L45,40 L50,50 L45,65 L30,75 L15,65 L10,50 L15,40 Z" fill="url(#futuristicGradient)" stroke="#ffffff" stroke-width="1" />
      <ellipse cx="30" cy="70" rx="12" ry="3" fill="#cc00ff" filter="url(#futuristicGlow)" class="engine-glow" />
      <ellipse cx="30" cy="30" rx="8" ry="12" fill="url(#cockpitGradient)" />
      <path d="M28,40 L32,40 L31,65 L29,65 Z" fill="#ffffff" opacity="0.5" />
      <path d="M20,50 L15,58 M40,50 L45,58" stroke="#ffffff" stroke-width="1" opacity="0.8" />
    </svg>`
  },
  alien: {
    svg: `<svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="alienGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style="stop-color:#2ecc71;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#27ae60;stop-opacity:1" />
        </radialGradient>
        <filter id="alienGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <radialGradient id="cockpitAlien" cx="50%" cy="50%" r="50%" fx="40%" fy="40%">
          <stop offset="0%" style="stop-color:#1affff;stop-opacity:0.7" />
          <stop offset="100%" style="stop-color:#1affff;stop-opacity:0.1" />
        </radialGradient>
      </defs>
      <ellipse cx="30" cy="35" rx="25" ry="15" fill="url(#alienGradient)" stroke="#ffffff" stroke-width="1" />
      <ellipse cx="30" cy="35" rx="15" ry="7" fill="url(#cockpitAlien)" />
      <path d="M20,35 L5,55 L10,60" stroke="#2ecc71" stroke-width="2" fill="none" />
      <path d="M40,35 L55,55 L50,60" stroke="#2ecc71" stroke-width="2" fill="none" />
      <circle cx="30" cy="70" r="8" fill="#2ecc71" filter="url(#alienGlow)" class="engine-glow" />
      <circle cx="24" cy="32" r="2" fill="#ffffff" />
      <circle cx="36" cy="32" r="2" fill="#ffffff" />
      <path d="M26,38 Q30,42 34,38" stroke="#ffffff" stroke-width="1" fill="none" />
    </svg>`
  }
};

const BACKGROUNDS = {
  nebula: {
    primaryColor: '#1a1a2e',
    gradient: 'radial-gradient(ellipse at center, rgba(255, 50, 255, 0.2) 0%, rgba(25, 25, 55, 0.9) 70%, #1a1a2e 100%)',
    starsColor: '#ffffff',
    starsCount: 100,
    nebulaColors: ['rgba(255, 50, 255, 0.05)', 'rgba(150, 50, 255, 0.05)', 'rgba(50, 50, 255, 0.05)']
  },
  deepspace: {
    primaryColor: '#0f0f23',
    gradient: 'radial-gradient(ellipse at center, rgba(10, 10, 40, 0.6) 0%, rgba(5, 5, 20, 0.8) 70%, #0f0f23 100%)',
    starsColor: '#f1c40f',
    starsCount: 200,
    nebulaColors: ['rgba(0, 100, 255, 0.03)', 'rgba(0, 50, 255, 0.03)', 'rgba(0, 0, 100, 0.03)']
  },
  galaxy: {
    primaryColor: '#16213e',
    gradient: 'url(#galaxyGradient)',
    starsColor: '#ffffff',
    starsCount: 150,
    nebulaColors: ['rgba(0, 255, 150, 0.03)', 'rgba(0, 200, 100, 0.03)', 'rgba(50, 255, 50, 0.03)']
  }
};

const ASTEROID_COLORS = [
  '#e74c3c', '#f39c12', '#2ecc71', '#3498db', '#9b59b6', '#1abc9c'
];


const AUDIO = {
    typing: "https://assets.mixkit.co/active_storage/sfx/2409/2409-preview.mp3",
    explosion: "https://assets.mixkit.co/active_storage/sfx/235/235-preview.mp3",
    gameOver: "https://assets.mixkit.co/active_storage/sfx/254/254-preview.mp3",
    lifeDown: "https://assets.mixkit.co/active_storage/sfx/2307/2307-preview.mp3",
    start: "https://assets.mixkit.co/active_storage/sfx/1929/1929-preview.mp3",
    backgroundMusic: "https://assets.mixkit.co/active_storage/sfx/958/958-preview.mp3",
  };
  


const SpaceTypingGame = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    score: 0,
    lives: 3,
    asteroids: [],
    currentInput: '',
    accuracy: 100,
    wpm: 0,
    startTime: null,
    totalKeystrokes: 0,
    correctKeystrokes: 0,
    gameOver: false,
    difficulty: 'medium',
    wordsTyped: 0,
    soundEnabled: true,
    spaceship: 'classic',
    background: 'nebula'
  });

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const asteroidGenRef = useRef<NodeJS.Timeout | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const explosionAnimationsRef = useRef<Map<string, { x: number, y: number, frame: number }>>(new Map());
  const audioRef = useRef<Record<string, HTMLAudioElement | null>>({});
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const starsRef = useRef<HTMLDivElement | null>(null);
  const gameOverStarsRef = useRef<HTMLDivElement | null>(null);
  
  // Generate stars on client-side only
  useEffect(() => {
    const generateStarsInContainer = (container: HTMLDivElement | null) => {
      if (!container) return;
      
      // Clear any existing stars
      container.innerHTML = '';
      
      // Generate 10 random stars
      for (let i = 0; i < 10; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(star);
      }
    };
    
    if (typeof window !== 'undefined') {
      generateStarsInContainer(starsRef.current);
      generateStarsInContainer(gameOverStarsRef.current);
    }
  }, [showInstructions, gameState.gameOver]); // Re-run when modals open/close
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Object.keys(AUDIO).forEach(key => {
        const audio = new Audio(AUDIO[key as keyof typeof AUDIO]);
        
        if (key === 'typing') audio.volume = 0.2;
        else if (key === 'explosion') audio.volume = 0.5;
        else if (key === 'backgroundMusic') {
          audio.volume = 0.3;
          audio.loop = true;
          backgroundMusicRef.current = audio;
        }
        else audio.volume = 0.6;
        
        audioRef.current[key] = audio;
      });
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.isPlaying && !gameState.gameOver && inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
      }
    };
  }, [gameState.isPlaying, gameState.gameOver]);

  useEffect(() => {
    if (gameState.isPlaying && gameState.soundEnabled && backgroundMusicRef.current) {
      backgroundMusicRef.current.play().catch(() => {
        console.log('Background music playback prevented by browser');
      });
    } else if ((!gameState.isPlaying || !gameState.soundEnabled) && backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
    }
  }, [gameState.isPlaying, gameState.soundEnabled]);

  const playSound = useCallback((type: keyof typeof AUDIO) => {
    if (gameState.soundEnabled && audioRef.current[type]) {
      const sound = audioRef.current[type];
      if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {
          console.log(`${type} sound playback prevented by browser`);
        });
      }
    }
  }, [gameState.soundEnabled]);

  const getRandomWord = useCallback(() => {
    const words = WORD_LISTS[gameState.difficulty];
    return words[Math.floor(Math.random() * words.length)];
  }, [gameState.difficulty]);

  const generateAsteroid = useCallback(() => {
    if (!gameAreaRef.current || !gameState.isPlaying) return;
    
    const gameAreaWidth = gameAreaRef.current.clientWidth;
    const word = getRandomWord();
    const size = Math.max(40, Math.min(70, word.length * 6));
    
    const newAsteroid: Asteroid = {
      id: `asteroid-${Date.now()}-${Math.random()}`,
      word,
      position: {
        x: Math.random() * (gameAreaWidth - size),
        y: -size
      },
      speed: GAME_SETTINGS[gameState.difficulty].asteroidSpeed * (0.8 + Math.random() * 0.4),
      size,
      color: ASTEROID_COLORS[Math.floor(Math.random() * ASTEROID_COLORS.length)],
      rotation: Math.random() * 360,
      active: true
    };
    
    setGameState(prevState => ({
      ...prevState,
      asteroids: [...prevState.asteroids, newAsteroid]
    }));
  }, [gameState.isPlaying, gameState.difficulty, getRandomWord]);

  useEffect(() => {
    if (gameState.isPlaying && !asteroidGenRef.current) {
      asteroidGenRef.current = setInterval(
        generateAsteroid,
        GAME_SETTINGS[gameState.difficulty].asteroidFrequency
      );
    }

    return () => {
      if (asteroidGenRef.current) {
        clearInterval(asteroidGenRef.current);
        asteroidGenRef.current = null;
      }
    };
  }, [gameState.isPlaying, gameState.difficulty, generateAsteroid]);

  const gameLoop = useCallback((timestamp: number) => {
    if (!gameState.isPlaying || !gameAreaRef.current) return;
    
    const deltaTime = timestamp - (lastFrameTimeRef.current || timestamp);
    lastFrameTimeRef.current = timestamp;
    
    const gameAreaHeight = gameAreaRef.current.clientHeight;
    
    if (gameState.startTime && gameState.wordsTyped > 0) {
      const minutesElapsed = (Date.now() - gameState.startTime) / 60000;
      if (minutesElapsed > 0) {
        const newWpm = Math.round(gameState.wordsTyped / minutesElapsed);
        if (newWpm !== gameState.wpm) {
          setGameState(prevState => ({ ...prevState, wpm: newWpm }));
        }
      }
    }
    
    setGameState(prevState => {
      if (prevState.lives <= 0 && !prevState.gameOver) {
        playSound('gameOver');
        return {
          ...prevState,
          isPlaying: false,
          gameOver: true
        };
      }
      
      const updatedAsteroids = prevState.asteroids.map(asteroid => {
        if (!asteroid.active) return asteroid;
        
        const newY = asteroid.position.y + (asteroid.speed * deltaTime / 1000);
        
        if (newY > gameAreaHeight - 70) {
          if (!prevState.gameOver) {
            playSound('lifeDown');
            return {
              ...asteroid,
              active: false,
              position: {
                ...asteroid.position,
                y: newY
              }
            };
          }
        }
        
        return {
          ...asteroid,
          position: {
            ...asteroid.position,
            y: newY
          },
          rotation: asteroid.rotation + (deltaTime * 0.01) 
        };
      });
      
      const activeAsteroids = updatedAsteroids.filter(asteroid => asteroid.active);
      const missedAsteroids = updatedAsteroids.filter(asteroid => 
        !asteroid.active && asteroid.position.y > gameAreaHeight - 70
      );
      
      const newLives = prevState.lives - missedAsteroids.length;
      
      return {
        ...prevState,
        asteroids: activeAsteroids,
        lives: Math.max(0, newLives)
      };
    });
    
    const explosions = explosionAnimationsRef.current;
    explosions.forEach((explosion, id) => {
      if (explosion.frame >= 15) { 
        explosions.delete(id);
      } else {
        explosions.set(id, { ...explosion, frame: explosion.frame + 0.5 }); 
      }
    });
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.isPlaying, gameState.startTime, gameState.wordsTyped, gameState.wpm, gameState.lives, gameState.gameOver, playSound]);

  useEffect(() => {
    if (gameState.isPlaying && !gameLoopRef.current) {
      lastFrameTimeRef.current = performance.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState.isPlaying, gameLoop]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    setGameState(prevState => {
      playSound('typing');
      
      const newTotalKeystrokes = prevState.totalKeystrokes + 1;
      let newCorrectKeystrokes = prevState.correctKeystrokes;
      
      const matchingAsteroidIndex = prevState.asteroids.findIndex(
        asteroid => asteroid.word.toLowerCase() === input.toLowerCase()
      );
      
      if (matchingAsteroidIndex !== -1) {
        const matchedAsteroid = prevState.asteroids[matchingAsteroidIndex];
        
        explosionAnimationsRef.current.set(
          matchedAsteroid.id,
          { x: matchedAsteroid.position.x, y: matchedAsteroid.position.y, frame: 0 }
        );
        
        playSound('explosion');
        
        newCorrectKeystrokes += matchedAsteroid.word.length;
        
        const updatedAsteroids = prevState.asteroids.filter((_, i) => i !== matchingAsteroidIndex);
        
        const points = matchedAsteroid.word.length * GAME_SETTINGS[prevState.difficulty].basePoints;
        
        const startTime = prevState.startTime || Date.now();
        
        return {
          ...prevState,
          asteroids: updatedAsteroids,
          score: prevState.score + points,
          wordsTyped: prevState.wordsTyped + 1,
          currentInput: '',
          totalKeystrokes: newTotalKeystrokes,
          correctKeystrokes: newCorrectKeystrokes,
          accuracy: Math.round((newCorrectKeystrokes / newTotalKeystrokes) * 100),
          startTime
        };
      }
      
      const newAccuracy = newTotalKeystrokes > 0 
        ? Math.round((newCorrectKeystrokes / newTotalKeystrokes) * 100)
        : 100;
      
      return {
        ...prevState,
        currentInput: input,
        totalKeystrokes: newTotalKeystrokes,
        correctKeystrokes: newCorrectKeystrokes,
        accuracy: newAccuracy
      };
    });
  };

  const startGame = () => {
    setGameState({
      isPlaying: true,
      score: 0,
      lives: 3,
      asteroids: [],
      currentInput: '',
      accuracy: 100,
      wpm: 0,
      startTime: null,
      totalKeystrokes: 0,
      correctKeystrokes: 0,
      gameOver: false,
      difficulty: gameState.difficulty,
      wordsTyped: 0,
      soundEnabled: gameState.soundEnabled,
      spaceship: gameState.spaceship,
      background: gameState.background
    });
    
    setShowInstructions(false);
    playSound('start');
    
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const changeDifficulty = (difficulty: Difficulty) => {
    setGameState(prevState => ({ ...prevState, difficulty }));
  };

  const toggleSound = () => {
    setGameState(prevState => ({ 
      ...prevState, 
      soundEnabled: !prevState.soundEnabled 
    }));
  };

  const changeSpaceship = (spaceship: SpaceshipType) => {
    setGameState(prevState => ({ ...prevState, spaceship }));
  };

  const changeBackground = (background: BackgroundType) => {
    setGameState(prevState => ({ ...prevState, background }));
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const resetGame = () => {
    setGameState(prevState => ({
      ...prevState,
      isPlaying: false,
      score: 0,
      lives: 3,
      asteroids: [],
      currentInput: '',
      accuracy: 100,
      wpm: 0,
      startTime: null,
      totalKeystrokes: 0,
      correctKeystrokes: 0,
      gameOver: false,
      wordsTyped: 0
    }));
    
    setShowInstructions(true);
  };

  const generateStars = useCallback(() => {
    if (typeof window === 'undefined') return [];
    
    const bgSettings = BACKGROUNDS[gameState.background];
    const stars = [];
    
    for (let i = 0; i < bgSettings.starsCount; i++) {
      const size = Math.random() * 2 + 1;
      const opacity = Math.random() * 0.7 + 0.3;
      // Much slower twinkle animation
      const twinkleSpeed = Math.random() * 10 + 10;
      
      stars.push(
        <div
          key={`star-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: bgSettings.starsColor,
            opacity,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${twinkleSpeed}s infinite alternate ${Math.random() * twinkleSpeed}s`
          }}
        />
      );
    }
    
    return stars;
  }, [gameState.background]);
  
  const generateNebulae = useCallback(() => {
    if (typeof window === 'undefined') return [];
    
    const bgSettings = BACKGROUNDS[gameState.background];
    const nebulae = [];
    
    for (let i = 0; i < 3; i++) {
      const size = Math.random() * 60 + 40;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      
      nebulae.push(
        <div
          key={`nebula-${i}`}
          className="absolute rounded-full blur-3xl"
          style={{
            width: `${size}%`,
            height: `${size}%`,
            background: bgSettings.nebulaColors[i % bgSettings.nebulaColors.length],
            top: `${posY}%`,
            left: `${posX}%`,
            transform: 'translate(-50%, -50%)',
            animation: `nebula-float ${40 + i * 10}s infinite ease-in-out ${i * 7}s` 
          }}
        />
      );
    }
    
    return nebulae;
  }, [gameState.background]);

  const [starsElements, setStarsElements] = useState<React.ReactNode[]>([]);
  const [nebulaeElements, setNebulaeElements] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    setStarsElements(generateStars());
    setNebulaeElements(generateNebulae());
  }, [generateStars, generateNebulae]);

  const renderExplosions = () => {
    return Array.from(explosionAnimationsRef.current.entries()).map(([id, explosion]) => {
      const size = 150; 
      const opacity = 1 - explosion.frame / 15;
      
      return (
        <div
          key={id}
          className="absolute pointer-events-none"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${explosion.x}px`,
            top: `${explosion.y}px`,
            opacity,
            transform: `scale(${explosion.frame / 3 + 0.5})`,
            background: 'radial-gradient(circle, rgba(255,255,0,0.8) 0%, rgba(255,120,0,0.6) 40%, rgba(255,0,0,0) 70%)'
          }}
        />
      );
    });
  };

  const renderSpaceship = () => {
    return (
      <div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-2 w-16 h-20"
        dangerouslySetInnerHTML={{ __html: SPACESHIPS[gameState.spaceship].svg }}
      />
    );
  };

  const renderLives = () => {
    return (
      <div className="flex">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={`life-${i}`}
            className={`w-5 h-5 mx-1 rounded-full ${
              i < gameState.lives ? 'bg-red-500 animate-pulse' : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
    );
  };
  
  const getHighlightedText = (word: string, input: string) => {
    if (!input) return { matched: '', remaining: word };
    
    let matchedPart = '';
    
    for (let i = 0; i < word.length; i++) {
      if (i >= input.length) break;
      if (word[i].toLowerCase() !== input[i].toLowerCase()) break;
      matchedPart += word[i];
    }
    
    return { 
      matched: matchedPart, 
      remaining: word.slice(matchedPart.length) 
    };
  };

  const backgroundStyle = () => {
    const bg = BACKGROUNDS[gameState.background];
    
    if (gameState.background === 'galaxy') {
      return {
        background: `linear-gradient(to bottom, ${bg.primaryColor}, #000000)`,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3CradialGradient id='rg' cx='50%25' cy='50%25' r='50%25' fx='50%25' fy='50%25'%3E%3Cstop offset='0%25' stop-color='%2316213e' stop-opacity='0.1'/%3E%3Cstop offset='100%25' stop-color='%2316213e' stop-opacity='1'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23rg)'/%3E%3C/svg%3E")`,
        overflow: 'hidden'
      };
    }
    
    return {
      background: `linear-gradient(to bottom, ${bg.primaryColor}, #000000)`,
      backgroundImage: bg.gradient,
      overflow: 'hidden'
    };
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden font-sans">
      <Head>
        <title>Space Typing Game</title>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700&display=swap');
          
          @keyframes twinkle {
            0% { opacity: 0.3; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1.2); }
          }
          
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          
          @keyframes nebula-float {
            0% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-53%, -47%) scale(1.2); }
            100% { transform: translate(-50%, -50%) scale(1); }
          }
          
          @keyframes pulse {
            0% { opacity: 0.6; transform: scale(0.98); }
            50% { opacity: 1; transform: scale(1.02); }
            100% { opacity: 0.6; transform: scale(0.98); }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes engine-glow {
            0% { opacity: 0.7; filter: blur(5px); }
            50% { opacity: 1; filter: blur(7px); }
            100% { opacity: 0.7; filter: blur(5px); }
          }

          @keyframes cosmic-pulse {
            0% { box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(66, 153, 225, 0); }
            100% { box-shadow: 0 0 0 0 rgba(66, 153, 225, 0); }
          }
          
          @keyframes space-float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
            100% { transform: translateY(0); }
          }
          
          @keyframes button-glow {
            0% { box-shadow: 0 0 5px rgba(88, 107, 224, 0.5), inset 0 0 5px rgba(88, 107, 224, 0.2); }
            50% { box-shadow: 0 0 15px rgba(88, 107, 224, 0.8), inset 0 0 8px rgba(88, 107, 224, 0.4); }
            100% { box-shadow: 0 0 5px rgba(88, 107, 224, 0.5), inset 0 0 5px rgba(88, 107, 224, 0.2); }
          }

          .animate-spin-slow {
            animation: spin 60s linear infinite;
          }
          
          .engine-glow {
            animation: engine-glow 1.5s infinite alternate;
          }
          
          .cosmic-pulse {
            animation: cosmic-pulse 2s infinite;
          }
          
          .space-float {
            animation: space-float 2s ease-in-out infinite;
          }
          
          .cosmic-button {
            background: linear-gradient(135deg, rgba(88, 107, 224, 0.8) 0%, rgba(101, 31, 255, 0.8) 100%); 
            border: 1px solid rgba(145, 167, 255, 0.3);
            box-shadow: 0 0 15px rgba(88, 107, 224, 0.5), inset 0 0 10px rgba(88, 107, 224, 0.2);
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
            position: relative;
            overflow: hidden;
            transition: all 0.3s;
            cursor: pointer;
          }
          
          .cosmic-button:hover {
            background: linear-gradient(135deg, rgba(101, 31, 255, 0.9) 0%, rgba(88, 107, 224, 0.9) 100%);
            border: 1px solid rgba(145, 167, 255, 0.5);
            box-shadow: 0 0 20px rgba(88, 107, 224, 0.7), inset 0 0 15px rgba(88, 107, 224, 0.4);
            transform: translateY(-2px) scale(1.02);
          }
          
          .cosmic-button:active {
            transform: translateY(1px) scale(0.98);
            box-shadow: 0 0 10px rgba(88, 107, 224, 0.5), inset 0 0 5px rgba(88, 107, 224, 0.2);
          }
          
          .cosmic-button:before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transform: rotate(45deg);
            animation: shine 3s infinite;
          }
          
          @keyframes shine {
            0% { left: -50%; }
            100% { left: 150%; }
          }
          
          .space-option {
            border: 1px solid rgba(145, 167, 255, 0.1);
            background: rgba(20, 30, 70, 0.3);
            transition: all 0.3s;
            cursor: pointer;
          }
          
          .space-option:hover {
            background: rgba(30, 50, 100, 0.4);
            border: 1px solid rgba(145, 167, 255, 0.3);
            box-shadow: 0 0 15px rgba(88, 107, 224, 0.3);
            transform: translateY(-2px) scale(1.03);
          }
          
          .space-option:active {
            transform: translateY(1px) scale(0.98);
          }
          
          .space-option.active {
            background: linear-gradient(145deg, rgba(30, 50, 130, 0.6), rgba(60, 90, 200, 0.4));
            border: 1px solid rgba(145, 167, 255, 0.5);
            box-shadow: 0 0 15px rgba(88, 107, 224, 0.5), inset 0 0 8px rgba(88, 107, 224, 0.2);
            animation: button-glow 2s infinite;
          }
          
          .launch-button {
            background: linear-gradient(135deg, rgba(29, 53, 203, 0.8) 0%, rgba(107, 31, 243, 0.9) 100%);
            border: 1px solid rgba(157, 176, 255, 0.4);
            box-shadow: 0 0 25px rgba(88, 107, 224, 0.6), inset 0 0 15px rgba(125, 142, 232, 0.4);
            text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
            position: relative;
            overflow: hidden;
            transition: all 0.3s;
            letter-spacing: 1px;
            transform: perspective(500px) rotateX(10deg);
            transform-style: preserve-3d;
            cursor: pointer;
          }
          
          .launch-button:hover {
            background: linear-gradient(135deg, rgba(58, 83, 243, 0.9) 0%, rgba(126, 64, 246, 1) 100%);
            border: 1px solid rgba(169, 185, 255, 0.7);
            box-shadow: 0 0 30px rgba(88, 107, 224, 0.8), inset 0 0 20px rgba(125, 142, 232, 0.6);
            transform: perspective(500px) rotateX(5deg) translateY(-5px) scale(1.03);
            letter-spacing: 2px;
          }
          
          .launch-button:active {
            transform: perspective(500px) rotateX(15deg) translateY(2px) scale(0.98);
            box-shadow: 0 0 15px rgba(88, 107, 224, 0.4), inset 0 0 10px rgba(125, 142, 232, 0.2);
          }
          
          .launch-button:before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transform: rotate(45deg);
            animation: launch-shine 2.5s infinite;
          }
          
          @keyframes launch-shine {
            0% { left: -50%; }
            100% { left: 150%; }
          }
          
          .launch-button .stars {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 0;
          }
          
          .launch-button .star {
            position: absolute;
            width: 2px;
            height: 2px;
            border-radius: 50%;
            background: white;
            opacity: 0;
            animation: star-pulse 2s infinite;
          }
          
          @keyframes star-pulse {
            0% { opacity: 0; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.5); }
            100% { opacity: 0; transform: scale(0.8); }
          }
          
          .rocket-icon {
            display: inline-block;
            margin-right: 8px;
            transform: rotate(-45deg);
            position: relative;
            animation: rocket-shake 2s infinite;
          }
          
          @keyframes rocket-shake {
            0% { transform: rotate(-45deg) translateX(0); }
            25% { transform: rotate(-45deg) translateX(-1px); }
            75% { transform: rotate(-45deg) translateX(1px); }
            100% { transform: rotate(-45deg) translateX(0); }
          }
          
          .launch-button .button-glow {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: inherit;
            z-index: -1;
            background: radial-gradient(circle at center, rgba(123, 66, 255, 0.8) 0%, rgba(45, 85, 255, 0.4) 50%, transparent 70%);
            opacity: 0.7;
            filter: blur(15px);
            animation: button-pulse 3s infinite;
          }
          
          @keyframes button-pulse {
            0% { opacity: 0.5; transform: scale(0.97); }
            50% { opacity: 0.8; transform: scale(1.03); }
            100% { opacity: 0.5; transform: scale(0.97); }
          }

          body {
            overflow: hidden;
            margin: 0;
            padding: 0;
            font-family: 'Exo 2', sans-serif;
          }
          
          ::-webkit-scrollbar {
            width: 6px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
          }

          .game-btn {
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
            cursor: pointer;
            transform: translateY(0);
          }
          
          .game-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          }
          
          .game-btn:active {
            transform: translateY(0);
          }
          
          .game-btn:before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.2),
              transparent
            );
            transition: all 0.4s ease;
          }
          
          .game-btn:hover:before {
            left: 100%;
          }
          
          .asteroid {
            animation: float 5s infinite ease-in-out;
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.15));
          }
          
          .input-glow {
            transition: all 0.3s ease;
          }
          
          .input-glow:focus {
            box-shadow: 0 0 20px rgba(66, 153, 225, 0.8);
          }
          
          .glass-panel {
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          }
          
          .modern-glass {
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            background: rgba(15, 23, 42, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.18);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border-radius: 12px;
          }
          
          .glass-card {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }
          
          .glass-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            background: rgba(255, 255, 255, 0.12);
          }
          
          .neo-button {
            background: linear-gradient(145deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.9));
            box-shadow: 0 4px 20px rgba(37, 99, 235, 0.5), inset 0 -2px 0 rgba(0, 0, 0, 0.2);
            border: none;
            color: white;
            font-weight: 600;
            transition: all 0.2s ease;
            border-radius: 12px;
            letter-spacing: 0.5px;
          }
          
          .neo-button:hover {
            background: linear-gradient(145deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 1));
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.6), inset 0 -3px 0 rgba(0, 0, 0, 0.2);
            transform: translateY(-2px);
          }
          
          .neo-button:active {
            transform: translateY(1px);
            box-shadow: 0 2px 15px rgba(37, 99, 235, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.2);
          }
          
          .setting-btn {
            transition: all 0.2s ease;
            cursor: pointer;
            transform: translateY(0);
          }
          
          .setting-btn:hover {
            transform: translateY(-2px);
          }
          
          .setting-btn:active {
            transform: translateY(0);
          }

          /* Adding interactive styling for all button types */
          button {
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          button:hover {
            filter: brightness(1.1);
          }
          
          button:active {
            filter: brightness(0.9);
            transform: scale(0.98);
          }
          
          /* Styling for toggle buttons and other interactive elements */
          .setting-btn, .game-btn {
            cursor: pointer;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .setting-btn:hover, .game-btn:hover {
            transform: translateY(-2px);
            filter: brightness(1.1);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          }
          
          .setting-btn:active, .game-btn:active {
            transform: translateY(1px);
            filter: brightness(0.95);
          }
        `}</style>
      </Head>

      <div className="fixed inset-0 w-full h-full" style={backgroundStyle()}>
        {starsElements}
        {nebulaeElements}
        
        {gameState.background === 'galaxy' && (
          <div className="absolute w-full h-full opacity-20 animate-spin-slow" style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(100, 200, 255, 0.05) 40%, transparent 70%)',
            backgroundSize: '150% 150%',
            backgroundPosition: 'center',
            transformOrigin: 'center',
          }} />
        )}
      </div>

      <div className="relative z-10 w-full max-w-6xl px-4 py-2">
        <div className="flex flex-wrap justify-between items-center mb-4 modern-glass rounded-xl p-4 shadow-lg">
          <div className="text-white text-2xl font-bold tracking-wide flex items-center">
            <span className="inline-block mr-2 transform rotate-12">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFD700" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>Space Typing</span>
          </div>
          
          <div className="flex items-center flex-wrap space-x-1 md:space-x-4">
            <div className="text-white rounded-xl glass-card p-2 flex items-center">
              <span className="text-sm opacity-70 mr-1">Score:</span>
              <span className="font-bold">{gameState.score}</span>
            </div>
            
            <div className="text-white rounded-xl glass-card p-2 flex items-center">
              <span className="text-sm opacity-70 mr-1">WPM:</span>
              <span className="font-bold">{gameState.wpm}</span>
            </div>
            
            <div className="text-white rounded-xl glass-card p-2 flex items-center">
              <span className="text-sm opacity-70 mr-1">Accuracy:</span>
              <span className="font-bold">{gameState.accuracy}%</span>
            </div>
            
            <div className="flex items-center rounded-xl glass-card p-2">
              <span className="text-white text-sm opacity-70 mr-2">Lives:</span>
              {renderLives()}
            </div>
            
            <button
              onClick={toggleSettings}
              className="game-btn text-white bg-indigo-700 hover:bg-indigo-600 rounded-xl p-2 focus:outline-none flex items-center justify-center cursor-pointer shadow-lg"
              aria-label="Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div 
        ref={gameAreaRef}
        className="relative z-10 w-full max-w-6xl h-[70vh] border border-indigo-400 rounded-xl overflow-hidden modern-glass shadow-xl"
        onClick={() => inputRef.current?.focus()}
        style={{ cursor: 'default' }}
      >
        {gameState.asteroids.map(asteroid => {
          const { matched, remaining } = getHighlightedText(asteroid.word, gameState.currentInput);
          
          return (
            <div
              key={asteroid.id}
              className="asteroid absolute flex flex-col items-center justify-center"
              style={{
                left: `${asteroid.position.x}px`,
                top: `${asteroid.position.y}px`,
                width: `${asteroid.size}px`,
                height: `${asteroid.size}px`
              }}
            >
              <svg 
                width={asteroid.size} 
                height={asteroid.size} 
                viewBox="0 0 50 50"
                style={{ 
                  transform: `rotate(${asteroid.rotation}deg)`,
                }}
              >
                <defs>
                  <radialGradient id={`asteroid-gradient-${asteroid.id}`} cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
                    <stop offset="100%" stopColor={asteroid.color} />
                  </radialGradient>
                  <filter id={`asteroid-glow-${asteroid.id}`}>
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <path
                  d="M25,5 L35,10 L40,20 L45,30 L40,40 L30,45 L20,45 L10,40 L5,30 L10,20 L15,10 Z"
                  fill={`url(#asteroid-gradient-${asteroid.id})`}
                  stroke="#ffffff"
                  strokeWidth="1"
                  filter={`url(#asteroid-glow-${asteroid.id})`}
                />
                <circle cx="20" cy="20" r="3" fill="#ffffff" opacity="0.5" />
                <circle cx="30" cy="25" r="2" fill="#ffffff" opacity="0.3" />
              </svg>
              
              <div 
                className="absolute top-full mt-2 text-center font-bold tracking-wide"
                style={{ 
                  textShadow: '0 0 10px rgba(0, 0, 0, 1), 0 0 20px rgba(0, 0, 0, 0.8)',
                  fontSize: `${Math.max(12, Math.min(18, 22 - asteroid.word.length))}px`
                }}
              >
                <span className="inline-block whitespace-nowrap">
                  {matched && <span className="bg-green-500 text-white px-1 rounded-sm">{matched}</span>}
                  {remaining && <span className="text-white">{remaining}</span>}
                </span>
              </div>
            </div>
          );
        })}
        
        {renderExplosions()}
        {renderSpaceship()}
        
        {gameState.gameOver && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center p-2 sm:p-4">
            <div className="glass-panel p-4 sm:p-6 rounded-xl text-center w-full max-w-xs sm:max-w-sm mx-auto backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
              <div className="absolute -top-28 -right-28 w-56 h-56 bg-red-500/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-28 -left-28 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <h2 className="text-red-500 text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Game Over!</h2>
              <div className="p-3 mb-3 rounded-lg bg-white/5 mx-auto max-w-[200px]">
                <p className="text-white text-base sm:text-lg font-bold mb-1">Score: <span className="text-blue-400">{gameState.score}</span></p>
                <p className="text-white/80 text-xs sm:text-sm mb-0.5">WPM: <span className="font-semibold text-white">{gameState.wpm}</span></p>
                <p className="text-white/80 text-xs sm:text-sm">Accuracy: <span className="font-semibold text-white">{gameState.accuracy}%</span></p>
              </div>
              
              <button
                onClick={resetGame}
                className="cosmic-button relative overflow-hidden w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-white focus:outline-none shadow-lg transition-all duration-300 space-float"
              >
                <div ref={gameOverStarsRef} className="stars">
                  {/* Stars will be generated via useEffect */}
                </div>
                <span className="relative z-10">Play Again</span>
              </button>
            </div>
          </div>
        )}
        
        {showInstructions && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center p-2 sm:p-4">
            <div className="modern-glass p-4 sm:p-6 rounded-xl text-center w-full max-w-md sm:max-w-lg mx-auto backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
              <div className="absolute -top-28 -right-28 w-56 h-56 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-28 -left-28 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <h2 className="text-blue-400 text-xl sm:text-2xl font-bold mb-2 sm:mb-3 relative">Space Typing</h2>
              <p className="text-white/90 text-sm sm:text-base mb-3 sm:mb-4 max-w-sm mx-auto">Type the words on the asteroids before they hit your spaceship!</p>
              
              <div className="mb-3 sm:mb-4 text-left text-white/80">
                <p className="text-xs sm:text-sm font-medium text-blue-400 mb-1">How to Play:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-xs sm:text-sm">
                  <li>Type the words shown on the asteroids</li>
                  <li>Each correct word destroys an asteroid</li>
                  <li>If an asteroid hits your ship, you lose a life</li>
                  <li>You have 3 lives total</li>
                  <li>Longer words give more points</li>
                </ul>
              </div>
              
              <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-4 sm:mb-5">
                <button
                  onClick={() => changeDifficulty('easy')}
                  className={`rounded-lg sm:rounded-xl font-medium focus:outline-none cursor-pointer text-xs sm:text-sm p-2 transition-all space-option ${
                    gameState.difficulty === 'easy'
                      ? 'active bg-green-600/40 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/90'
                  }`}
                >
                  Easy
                </button>
                <button
                  onClick={() => changeDifficulty('medium')}
                  className={`rounded-lg sm:rounded-xl font-medium focus:outline-none cursor-pointer text-xs sm:text-sm p-2 transition-all space-option ${
                    gameState.difficulty === 'medium'
                      ? 'active bg-yellow-600/40 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/90'
                  }`}
                >
                  Medium
                </button>
                <button
                  onClick={() => changeDifficulty('hard')}
                  className={`rounded-lg sm:rounded-xl font-medium focus:outline-none cursor-pointer text-xs sm:text-sm p-2 transition-all space-option ${
                    gameState.difficulty === 'hard'
                      ? 'active bg-red-600/40 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/90'
                  }`}
                >
                  Hard
                </button>
              </div>
              
              <button
                onClick={startGame}
                className="launch-button relative overflow-hidden cursor-pointer w-full py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-bold text-white focus:outline-none shadow-xl transition-all duration-300 group"
              >
                <div className="button-glow"></div>
                <div ref={starsRef} className="stars">
                  {/* Stars will be generated via useEffect */}
                </div>
                <span className="rocket-icon">🚀 </span>
                <span className="relative z-10 tracking-wider"> START GAME</span>
              </button>
            </div>
          </div>
        )}
        
        {showSettings && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-20 p-2 sm:p-4">
            <div className="modern-glass p-4 sm:p-6 rounded-xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto backdrop-blur-xl border border-white/20 shadow-2xl">
              <div className="absolute -top-28 -right-28 w-56 h-56 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-28 -left-28 w-56 h-56 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-blue-400 text-lg sm:text-xl font-bold">Game Settings</h2>
                <button
                  onClick={toggleSettings}
                  className="text-gray-400 hover:text-white focus:outline-none cursor-pointer bg-white/5 hover:bg-white/10 rounded-full p-1.5 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-5">
                <div className="flex justify-between items-center">
                  <label className="text-white font-medium text-sm sm:text-base">Sound Effects</label>
                  <div 
                    onClick={toggleSound}
                    className={`relative h-6 w-12 rounded-full cursor-pointer transition-colors duration-300 ${
                      gameState.soundEnabled ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gray-700'
                    }`}
                  >
                    <span 
                      className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                        gameState.soundEnabled ? 'translate-x-6' : ''
                      }`}
                    ></span>
                  </div>
                </div>
              </div>
              
              <div className="mb-5">
                <h3 className="text-sm text-blue-400 font-medium mb-2">Difficulty</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => changeDifficulty('easy')}
                    className={`py-2 rounded-lg text-xs sm:text-sm font-medium transition-all space-option ${
                      gameState.difficulty === 'easy'
                        ? 'active bg-green-600/40 text-white'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/90'
                    }`}
                  >
                    Easy
                  </button>
                  <button
                    onClick={() => changeDifficulty('medium')}
                    className={`py-2 rounded-lg text-xs sm:text-sm font-medium transition-all space-option ${
                      gameState.difficulty === 'medium'
                        ? 'active bg-yellow-600/40 text-white'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/90'
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => changeDifficulty('hard')}
                    className={`py-2 rounded-lg text-xs sm:text-sm font-medium transition-all space-option ${
                      gameState.difficulty === 'hard'
                        ? 'active bg-red-600/40 text-white'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/90'
                    }`}
                  >
                    Hard
                  </button>
                </div>
              </div>
              
              <div className="mb-5">
                <h3 className="text-sm text-blue-400 font-medium mb-2">Spaceship</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => changeSpaceship('classic')}
                    className={`flex flex-col items-center p-2 rounded-lg transition-all space-option ${
                      gameState.spaceship === 'classic'
                        ? 'active'
                        : ''
                    }`}
                  >
                    <div className="w-10 h-14 mb-1" dangerouslySetInnerHTML={{ __html: SPACESHIPS.classic.svg }} />
                    <span className="text-white text-xs">Classic</span>
                  </button>
                  <button
                    onClick={() => changeSpaceship('futuristic')}
                    className={`flex flex-col items-center p-2 rounded-lg transition-all space-option ${
                      gameState.spaceship === 'futuristic'
                        ? 'active'
                        : ''
                    }`}
                  >
                    <div className="w-10 h-14 mb-1" dangerouslySetInnerHTML={{ __html: SPACESHIPS.futuristic.svg }} />
                    <span className="text-white text-xs">Future</span>
                  </button>
                  <button
                    onClick={() => changeSpaceship('alien')}
                    className={`flex flex-col items-center p-2 rounded-lg transition-all space-option ${
                      gameState.spaceship === 'alien'
                        ? 'active'
                        : ''
                    }`}
                  >
                    <div className="w-10 h-14 mb-1" dangerouslySetInnerHTML={{ __html: SPACESHIPS.alien.svg }} />
                    <span className="text-white text-xs">Alien</span>
                  </button>
                </div>
              </div>
              
              <div className="mb-5">
                <h3 className="text-sm text-blue-400 font-medium mb-2">Background</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => changeBackground('nebula')}
                    className={`transition-all rounded-lg overflow-hidden space-option ${
                      gameState.background === 'nebula'
                        ? 'active'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="w-full h-12 rounded-lg mb-1" style={{ background: 'linear-gradient(to right, #1a1a2e, #7a1979, #1a1a2e)' }}></div>
                    <span className="text-white text-xs">Nebula</span>
                  </button>
                  <button
                    onClick={() => changeBackground('deepspace')}
                    className={`transition-all rounded-lg overflow-hidden space-option ${
                      gameState.background === 'deepspace'
                        ? 'active'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="w-full h-12 rounded-lg mb-1" style={{ background: 'linear-gradient(to right, #0f0f23, #1a2653, #0f0f23)' }}></div>
                    <span className="text-white text-xs">Deep Space</span>
                  </button>
                  <button
                    onClick={() => changeBackground('galaxy')}
                    className={`transition-all rounded-lg overflow-hidden space-option ${
                      gameState.background === 'galaxy'
                        ? 'active'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="w-full h-12 rounded-lg mb-1" style={{ background: 'linear-gradient(to right, #16213e, #26418f, #16213e)' }}></div>
                    <span className="text-white text-xs">Galaxy</span>
                  </button>
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-700/50">
                <button
                  onClick={() => {
                    toggleSettings();
                    if (!gameState.isPlaying && !gameState.gameOver) {
                      startGame();
                    }
                  }}
                  className="cosmic-button cursor-pointer relative overflow-hidden w-full py-2.5 rounded-lg text-sm font-semibold text-white focus:outline-none shadow-lg transition-all duration-300"
                >
                  <span className="relative z-10">Save & Play</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 w-full max-w-6xl px-4 mt-4">
        <div className="flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={gameState.currentInput}
            onChange={handleInputChange}
            placeholder="Type here..."
            className="input-glow w-full py-3 px-4 modern-glass text-white placeholder-gray-400 border border-indigo-400/50 rounded-xl focus:outline-none"
            disabled={!gameState.isPlaying || gameState.gameOver}
            autoFocus
          />
          {gameState.isPlaying && (
            <button
              onClick={resetGame}
              className="ml-2 text-white px-6 py-3 rounded-xl font-bold focus:outline-none cursor-pointer backdrop-blur-md shadow-lg cosmic-button"
            >
              <span className="relative z-10">Reset</span>
            </button>
          )}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-6xl px-4 mt-6 mb-4">
        <div className="text-center text-gray-400 text-sm">
          <p>Space Typing Game © 2025 | Practice your typing skills in space</p>
        </div>
      </div>
    </div>
  );
};

export default SpaceTypingGame;

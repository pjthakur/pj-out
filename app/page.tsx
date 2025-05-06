'use client'
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Bubble {
  id: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  speed: number;
  isBomb?: boolean;
}

interface Droplet {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  velocityX: number;
  velocityY: number;
  opacity: number;
}

interface Confetti {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  velocityX: number;
  velocityY: number;
  opacity: number;
  shape: 'circle' | 'square' | 'triangle';
}

interface Star {
  id: number;
  left: string;
  top: string;
  width: string;
  height: string;
  animationDuration: number;
  animationDelay: number;
}

interface Cloud {
  id: number;
  left: string;
  top: string;
  width: string;
  height: string;
  animationDuration: number;
  animationDelay: number;
}

interface BackgroundBalloon {
  id: number;
  left: string;
  bottom: string;
  size: number;
  color: string;
  animationDuration: number;
  animationDelay: number;
}

export default function BubbleGame() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [droplets, setDroplets] = useState<Droplet[]>([]);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  const [poppingBubbles, setPoppingBubbles] = useState<number[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [bombExploding, setBombExploding] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [backgroundBalloons, setBackgroundBalloons] = useState<BackgroundBalloon[]>([]);

  const gameConfig = useRef({
    baseSpeed: 2,
    speedMultiplier: 0.5,
    spawnRate: 1000,
    maxBubbles: 10,
    bombChance: 0.15,
  });

  const confettiIdCounter = useRef(0);

  useEffect(() => {
    setIsClient(true);

    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const savedHighScore = localStorage.getItem('bubblePopHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (score > 0) {
      const newLevel = Math.floor(score / 10) + 1;

      if (newLevel !== difficultyLevel) {
        setDifficultyLevel(newLevel);

        gameConfig.current = {
          baseSpeed: 2 + (newLevel * 0.5),
          speedMultiplier: 0.5 + (newLevel * 0.1),
          spawnRate: Math.max(300, 1000 - (newLevel * 70)),
          maxBubbles: 10 + newLevel,
          bombChance: Math.min(0.2, 0.15 + (newLevel * 0.01)),
        };
      }
    }
  }, [score, difficultyLevel]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('bubblePopHighScore', score.toString());
    }
  }, [score, highScore]);

  useEffect(() => {
    if (!isClient) return;

    const generatedStars: Star[] = Array.from({ length: 15 }).map((_, index) => ({
      id: index,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${10 + Math.random() * 15}px`,
      height: `${10 + Math.random() * 15}px`,
      animationDuration: 3 + Math.random() * 5,
      animationDelay: Math.random() * 5,
    }));

    const generatedClouds: Cloud[] = Array.from({ length: 5 }).map((_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        top: `${10 + Math.random() * 80}%`,
        width: `${100 + Math.random() * 150}px`,
        height: `${50 + Math.random() * 40}px`,
        animationDuration: 20 + Math.random() * 40,
        animationDelay: Math.random() * 10,
    }));

    const generatedBalloons: BackgroundBalloon[] = Array.from({ length: 8 }).map((_, index) => {
      const size = 40 + Math.random() * 60;
      return {
        id: index,
        left: `${Math.random() * 100}%`,
        bottom: `-${size * 1.5}px`,
        size: size,
        color: `hsl(${Math.random() * 360}, 80%, 70%)`,
        animationDuration: 15 + Math.random() * 20,
        animationDelay: Math.random() * 10,
      };
    });

    setStars(generatedStars);
    setClouds(generatedClouds);
    setBackgroundBalloons(generatedBalloons);

  }, [isClient]);

  const createBubble = () => {
    const radius = Math.random() * 20 + 30;
    const speed = gameConfig.current.baseSpeed * (Math.random() * 0.4 + 0.8) * gameConfig.current.speedMultiplier;
    const isBomb = Math.random() < gameConfig.current.bombChance;
    const margin = 8;
    return {
      id: Date.now() + Math.random(),
      x: Math.random() * (windowSize.width - radius * 2 - margin * 2) + radius + margin,
      y: windowSize.height + radius,
      radius: radius,
      color: isBomb ? 'rgba(0, 0, 0, 0.8)' : `rgba(${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
      speed: speed,
      isBomb: isBomb,
    };
  };

  const createDroplets = (bubble: Bubble, count: number, isBombExplosion: boolean = false) => {
    const newDroplets: Droplet[] = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + (isBombExplosion ? 5 : 2);
      const size = Math.random() * (bubble.radius / (isBombExplosion ? 2 : 3)) + (bubble.radius / (isBombExplosion ? 4 : 6));

      newDroplets.push({
        id: Date.now() + Math.random(),
        x: bubble.x + Math.cos(angle) * (bubble.radius / (isBombExplosion ? 1 : 2)),
        y: bubble.y + Math.sin(angle) * (bubble.radius / (isBombExplosion ? 1 : 2)),
        size: size,
        color: isBombExplosion ?
          `rgba(${220 + Math.floor(Math.random() * 35)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 30)}, 0.8)` :
          bubble.color,
        velocityX: Math.cos(angle) * speed * (isBombExplosion ? 1.5 : 1),
        velocityY: Math.sin(angle) * speed * (isBombExplosion ? 1.5 : 1) - (isBombExplosion ? 0 : 1),
        opacity: 1
      });
    }

    return newDroplets;
  };

  const createConfetti = (x: number, y: number, count: number, isBombExplosion: boolean = false) => {
    const newConfetti: Confetti[] = [];
    const shapes: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle'];
    const colors = isBombExplosion ?
      ['#FF4D00', '#FF6347', '#FF0000', '#8B0000', '#B22222', '#000000'] :
      ['#FF4D89', '#FFD700', '#00BFFF', '#7CFC00', '#FF6347', '#9370DB'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + (isBombExplosion ? 6 : 3);
      const size = Math.random() * 8 + (isBombExplosion ? 6 : 4);
      const newId = confettiIdCounter.current++;
      newConfetti.push({
        id: newId, 
        x,
        y,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * (isBombExplosion ? 15 : 10),
        velocityX: Math.cos(angle) * speed * (Math.random() + 0.5) * (isBombExplosion ? 1.5 : 1),
        velocityY: Math.sin(angle) * speed * (isBombExplosion ? 1.5 : 1) - (isBombExplosion ? 1 : 2),
        opacity: 1,
        shape: shapes[Math.floor(Math.random() * shapes.length)]
      });
    }

    return newConfetti;
  };

   useEffect(() => {
    if (!isClient || !gameStarted || gameOver) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isClient, gameStarted, gameOver]);

  useEffect(() => {
    if (!isClient || !gameStarted || gameOver || isPaused) return;

    setBubbles(prev => [...prev, createBubble()]);

    const spawnInterval = setInterval(() => {
      setBubbles(prev => {
        if (prev.length >= gameConfig.current.maxBubbles) return prev;
        return [...prev, createBubble()];
      });
    }, gameConfig.current.spawnRate);

    const moveInterval = setInterval(() => {
      setBubbles(prev => {
        if (prev.length === 0) return prev;

        return prev
          .map(b => ({ ...b, y: b.y - b.speed }))
          .filter(b => b.y + b.radius > 0);
      });

      setDroplets(prev => {
        if (prev.length === 0) return prev;

        return prev
          .map(d => ({
            ...d,
            x: d.x + d.velocityX,
            y: d.y + d.velocityY,
            velocityY: d.velocityY + 0.2,
            opacity: d.opacity - 0.02
          }))
          .filter(d => d.opacity > 0);
      });

      setConfetti(prev => {
        if (prev.length === 0) return prev;

        return prev
          .map(c => ({
            ...c,
            x: c.x + c.velocityX,
            y: c.y + c.velocityY,
            velocityY: c.velocityY + 0.1,
            rotation: c.rotation + c.rotationSpeed,
            opacity: c.opacity - 0.01
          }))
          .filter(c => c.opacity > 0);
      });
    }, 16);

    const checkGameOverInterval = setInterval(() => {
      setBubbles(prev => {
        const anyNormalBubbleReachedTop = prev.some(
          bubble => !bubble.isBomb && bubble.y - bubble.radius <= 0
        );

        if (anyNormalBubbleReachedTop && gameStarted) {
          setGameOver(true);
        }

        return prev;
      });
    }, 300);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
      clearInterval(checkGameOverInterval);
    };
  }, [gameStarted, gameOver, isClient, isPaused]);

  const handleBubbleClick = (bubble: Bubble) => {
    if (isPaused || gameOver || !gameStarted) return;
    setPoppingBubbles(prev => [...prev, bubble.id]);

    if (bubble.isBomb) {
      setBombExploding(bubble.id);
      const bombDroplets = createDroplets(bubble, Math.floor(bubble.radius) + 15, true);
      setDroplets(prev => [...prev, ...bombDroplets]);

      const bombConfetti = createConfetti(bubble.x, bubble.y, Math.floor(bubble.radius) + 15, true);
      setConfetti(prev => [...prev, ...bombConfetti]);

      setTimeout(() => {
        setGameOver(true);
      }, 500);
    } else {
      const newDroplets = createDroplets(bubble, Math.floor(bubble.radius / 3) + 5);
      setDroplets(prev => [...prev, ...newDroplets]);

      const newConfetti = createConfetti(bubble.x, bubble.y, Math.floor(bubble.radius / 2) + 5);
      setConfetti(prev => [...prev, ...newConfetti]);

      setTimeout(() => {
        setBubbles(prev => prev.filter(b => b.id !== bubble.id));
        setPoppingBubbles(prev => prev.filter(bubbleId => bubbleId !== bubble.id));
        setScore(prev => prev + 1);
      }, 150);
    }
  };

  const handleBackgroundClick = () => {
    if (gameStarted && !gameOver && !isPaused) {
      setGameOver(true);
    }
  };

  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGameStarted(true);
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    setBubbles([]);
    setDroplets([]);
    setConfetti([]);
    setPoppingBubbles([]);
    setBombExploding(null);
    setDifficultyLevel(1);
    confettiIdCounter.current = 0;
    gameConfig.current = {
      baseSpeed: 2,
      speedMultiplier: 0.5,
      spawnRate: 1000,
      maxBubbles: 10,
      bombChance: 0.15,
    };
  };

  if (!isClient) {
    return (
      <div className="h-screen w-screen bg-gradient-to-b from-purple-400 to-pink-500 flex items-center justify-center">
        <div className="text-2xl font-bold text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden"
      onClick={handleBackgroundClick}
      style={{
        width: '100vw',
        height: '100vh',
        background: "linear-gradient(135deg, #FF9F80, #FF6B6B, #7F7FD5)",
        backgroundSize: "400% 400%",
        animation: "gradient 15s ease infinite",
      }}
    >
      <div className="topbar-unified">
        <div className="stats-group">
          <div className="stat-glass">Score: {score}</div>
          {gameStarted && !gameOver && <div className="stat-glass">Level: {difficultyLevel}</div>}
          <div className="stat-glass">High Score: {highScore}</div>
        </div>
        {gameStarted && !gameOver && (
          <div className="buttons-group">
            {!isPaused && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused(!isPaused);
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="modern-btn"
              >
                Pause
              </motion.button>
            )}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setGameOver(true);
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className={`modern-btn${isPaused ? ' opacity-60 cursor-not-allowed' : ''}`}
              disabled={isPaused}
            >
              End Game
            </motion.button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50"
            onClick={(e) => {
                e.stopPropagation();
                setIsPaused(false);
              }}
          >
            <div className="gameover-card flex flex-col items-center justify-center gap-6" style={{ minWidth: '260px' }}>
              <div className="text-4xl font-extrabold bg-gradient-to-r from-pink-300 via-yellow-200 to-pink-400 bg-clip-text text-transparent tracking-wide drop-shadow-lg" style={{ letterSpacing: '0.01em' }}>
                PAUSED
              </div>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused(false);
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="modern-btn text-xl px-10 py-4 mt-2"
                style={{ zIndex: 50 }}
              >
                Resume
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <div
            key={`star-${star.id}`}
            className="absolute"
            style={{
              width: star.width,
              height: star.height,
              left: star.left,
              top: star.top,
              opacity: 0.6,
              animation: `twinkle ${star.animationDuration}s linear infinite ${star.animationDelay}s`,
            }}
          >
            <svg viewBox="0 0 24 24" fill="white">
              <path d="M12 2l2.5 7h7l-5.5 4.5 2 7-6-4.5-6 4.5 2-7-5.5-4.5h7z" />
            </svg>
          </div>
        ))}

        {clouds.map((cloud) => (
          <div
            key={`cloud-${cloud.id}`}
            className="absolute rounded-full bg-white/10"
            style={{
              width: cloud.width,
              height: cloud.height,
              left: cloud.left,
              top: cloud.top,
              animation: `floatCloud ${cloud.animationDuration}s linear infinite ${cloud.animationDelay}s`,
              opacity: 0.2,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              boxShadow: '0 0 20px rgba(255,255,255,0.2) inset',
            }}
          />
        ))}

        {backgroundBalloons.map((balloon) => (
          <div
            key={`balloon-bg-${balloon.id}`}
            className="absolute opacity-10"
            style={{
              left: balloon.left,
              bottom: balloon.bottom,
              animation: `floatBalloon ${balloon.animationDuration}s linear infinite ${balloon.animationDelay}s`,
            }}
          >
            <div
              style={{
                width: `${balloon.size}px`,
                height: `${balloon.size * 1.2}px`,
                background: balloon.color,
                borderRadius: '50% 50% 50% 50% / 55% 55% 45% 45%',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '2px',
                  height: '40px',
                  background: 'rgba(255,255,255,0.5)',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {!gameStarted && (
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 bg-black/40 text-white z-50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400"
          >
            Balloon Pop!
          </motion.div>
          <p className="text-lg mb-2 text-pink-100">Pop the balloons before they reach the top!</p>
          <p className="text-md mb-2 text-pink-200">Careful - clicking outside a balloon ends the game!</p>
          <p className="text-md mb-6 text-red-300 font-semibold">Watch out for<span className="text-black bg-white/70 px-2 py-1 rounded-md mx-1 font-bold">bomb</span>balloons!</p>

          {highScore > 0 && (
            <div className="text-xl font-semibold mb-4 text-yellow-300">High Score: {highScore}</div>
          )}

          <motion.button
            onClick={handleRestart}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="modern-btn text-lg px-10 py-4"
          >
            Start Game
          </motion.button>
          <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/60 pointer-events-none">
            © 2025 Ballon Pop. All Rights Reserved
          </div>
        </div>
      )}

      <AnimatePresence>
        {confetti.map((c) => {
          let shapeElement;

          switch(c.shape) {
            case 'circle':
              shapeElement = <div className="w-full h-full rounded-full" style={{ background: c.color }} />;
              break;
            case 'square':
              shapeElement = <div className="w-full h-full" style={{ background: c.color }} />;
              break;
            case 'triangle':
              shapeElement = (
                <div
                  className="w-full h-full"
                  style={{
                    background: c.color,
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                  }}
                />
              );
              break;
          }

          return (
            <motion.div
              key={c.id}
              className="absolute pointer-events-none"
              style={{
                left: c.x,
                top: c.y,
                width: c.size,
                height: c.size,
                opacity: c.opacity,
                transform: `rotate(${c.rotation}deg)`,
              }}
            >
              {shapeElement}
            </motion.div>
          );
        })}
      </AnimatePresence>

      <AnimatePresence>
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            onClick={(e) => {
              e.stopPropagation();
              handleBubbleClick(bubble);
            }}
            className="absolute rounded-full cursor-pointer"
            style={{
              left: bubble.x - bubble.radius,
              top: bubble.y - bubble.radius,
              width: bubble.radius * 2,
              height: bubble.radius * 2,
              backdropFilter: 'blur(2px)',
              border: bubble.isBomb
                ? '2px solid rgba(255,80,80,0.8)'
                : '1px solid rgba(255,255,255,0.6)',
              background: poppingBubbles.includes(bubble.id)
                ? 'transparent'
                : bubble.isBomb
                  ? `radial-gradient(circle at 30% 30%, rgba(40, 40, 40, 0.9), rgba(0, 0, 0, 0.8))`
                  : `radial-gradient(circle at 30% 30%, ${bubble.color.replace('0.5', '0.8')}, ${bubble.color.replace('0.5', '0.3')})`,
              boxShadow: poppingBubbles.includes(bubble.id)
                ? 'none'
                : bubble.isBomb
                  ? '0 0 15px rgba(255,0,0,0.4), 0 0 5px rgba(255,0,0,0.2) inset'
                  : `0 0 15px ${bubble.color.replace('0.5', '0.6')}, 0 0 5px ${bubble.color.replace('0.5', '0.3')} inset`,
            }}
            initial={{ scale: 0 }}
            animate={
              poppingBubbles.includes(bubble.id)
                ? bubble.isBomb && bombExploding === bubble.id
                  ? {
                      scale: [1, 1.5, 0],
                      opacity: [1, 0.9, 0],
                    }
                  : {
                      scale: [1, 1.2, 0],
                      opacity: [1, 0.8, 0],
                    }
                : {
                    scale: 1,
                    opacity: 1,
                }
            }
            exit={{ scale: 0 }}
            transition={{
              duration: poppingBubbles.includes(bubble.id)
                ? bubble.isBomb && bombExploding === bubble.id ? 0.5 : 0.15
                : 0.3,
              ease: poppingBubbles.includes(bubble.id) ? "easeOut" : "easeInOut"
            }}
            whileHover={{ scale: 1.05 }}
          >
            {!poppingBubbles.includes(bubble.id) && (
              <div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                style={{
                  width: '2px',
                  height: `${bubble.radius * 0.7}px`,
                  background: bubble.isBomb ? 'rgba(255,80,80,0.7)' : 'rgba(255,255,255,0.6)',
                  transform: 'translate(-50%, 100%)',
                  borderRadius: '2px',
                }}
              />
            )}

            {!poppingBubbles.includes(bubble.id) && bubble.isBomb && (
              <>
                <div
                  className="absolute"
                  style={{
                    width: '8px',
                    height: '8px',
                    top: '10%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255,80,80,0.9)',
                    borderRadius: '50%',
                    boxShadow: '0 0 8px rgba(255,50,50,0.8)',
                    animation: 'pulseFuse 0.8s infinite alternate'
                  }}
                />
                <div
                  className="absolute"
                  style={{
                    width: '4px',
                    height: '12px',
                    top: '2%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(150,150,150,0.8)',
                    borderRadius: '2px'
                  }}
                />
              </>
            )}

            {!poppingBubbles.includes(bubble.id) && !bubble.isBomb && (
              <div
                className="absolute rounded-full"
                style={{
                  width: '40%',
                  height: '40%',
                  top: '15%',
                  left: '15%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
                  transform: 'rotate(-45deg)',
                }}
              />
            )}

            {!poppingBubbles.includes(bubble.id) && bubble.isBomb && (
              <div
                className="absolute"
                style={{
                  width: '60%',
                  height: '60%',
                  top: '20%',
                  left: '20%',
                  opacity: 0.6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg viewBox="0 0 24 24" width="100%" height="100%" fill="white">
                  <path d="M12 2c.5 0 .9.4.9.9V5h1.1c.5 0 .9.4.9.9s-.4.9-.9.9H13v1.8a7 7 0 1 1-4 0V6.8h-1c-.5 0-.9-.4-.9-.9s.4-.9.9-.9h1.1V2.9c0-.5.4-.9.9-.9zm-2 5.4V8c0 .5.4.9.9.9s.9-.4.9-.9V7.4a5.1 5.1 0 1 0-1.8 0z"/>
                </svg>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {droplets.map((droplet) => (
          <motion.div
            key={droplet.id}
            className="absolute rounded-full"
            style={{
              left: droplet.x - droplet.size / 2,
              top: droplet.y - droplet.size / 2,
              width: droplet.size,
              height: droplet.size,
              background: droplet.color.replace('0.5', '0.8'),
              boxShadow: `0 0 3px ${droplet.color}`,
              opacity: droplet.opacity,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          />
        ))}
      </AnimatePresence>

      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white z-50 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="gameover-card flex flex-col items-center justify-center"
          >
            <div className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-pink-300 via-yellow-200 to-pink-400 bg-clip-text text-transparent drop-shadow-lg" style={{ letterSpacing: '0.01em' }}>Game Over!</div>
            <div className="text-lg font-medium mb-1 text-white/80">Your Score:</div>
            <div className="text-3xl font-bold mb-4 text-white drop-shadow-sm flex items-center gap-2">
              {score}
              {score >= highScore && score > 0 && (
                <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-300 to-pink-300 text-pink-900 shadow-md animate-pulse">New High!</span>
              )}
            </div>
            {bombExploding !== null && (
              <div className="text-base mb-3 text-red-300 font-semibold">Boom! You popped a bomb balloon!</div>
            )}
            <motion.button
              onClick={handleRestart}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="modern-btn text-lg px-10 py-4 mt-2"
            >
              Play Again
            </motion.button>
          </motion.div>
          <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/60 pointer-events-none">
            © 2025 Ballon Pop. All Rights Reserved
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes floatBalloon {
          0% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(-2deg); }
        }

        @keyframes floatCloud {
           0% { transform: translateX(0px); }
           50% { transform: translateX(15px); }
           100% { transform: translateX(0px); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        @keyframes pulseFuse {
           0% { box-shadow: 0 0 6px rgba(255,50,50,0.6); }
           100% { box-shadow: 0 0 12px rgba(255,100,100,1); }
        }

        .modern-btn {
          background: rgba(255,255,255,0.10);
          color: #fff;
          border: 1.5px solid rgba(255,255,255,0.18);
          border-radius: 9999px;
          box-shadow: 0 2px 12px 0 rgba(127,127,213,0.10), 0 1.5px 6px 0 rgba(255,128,191,0.10);
          padding: 0.7rem 2.2rem;
          font-size: 1.08rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          transition: all 0.16s cubic-bezier(.4,2,.6,1);
          outline: none;
          cursor: pointer;
          position: relative;
          backdrop-filter: blur(8px);
        }
        .modern-btn:hover, .modern-btn:focus {
          background: rgba(255,255,255,0.18);
          box-shadow: 0 4px 18px 0 #ffd6fa33, 0 2px 8px 0 #7f7fd533;
          filter: brightness(1.08) saturate(1.08);
        }
        .modern-btn:active {
          filter: brightness(0.98) saturate(1.05);
        }
        .stat-glass {
          background: rgba(255,255,255,0.13);
          border: 1.5px solid rgba(255,255,255,0.18);
          border-radius: 1.5rem;
          box-shadow: 0 2px 12px 0 rgba(127,127,213,0.10);
          padding: 0.6rem 1.6rem;
          color: #fff;
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          backdrop-filter: blur(10px);
          text-shadow: 0 1px 4px #7f7fd5cc;
        }
        .gameover-card {
          background: linear-gradient(120deg, rgba(127,127,213,0.22) 0%, rgba(255,128,191,0.18) 100%);
          border-radius: 1.5rem;
          box-shadow: 0 8px 40px 0 #7f7fd5cc, 0 2px 12px 0 #ff80bf33;
          border: 1.5px solid rgba(255,255,255,0.22);
          min-width: 320px;
          max-width: 92vw;
          padding: 2.5rem 2.5rem 2rem 2.5rem;
          backdrop-filter: blur(22px) saturate(1.3);
          margin: 0 auto;
          text-align: center;
          transition: background 0.3s;
        }
        .topbar-unified {
          display: flex;
          flex-wrap: wrap;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          width: 100vw;
          position: absolute;
          top: 1rem;
          left: 0;
          z-index: 10;
          padding: 0 0.2rem;
        }
        .stats-group {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.25rem;
        }
        .buttons-group {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.25rem;
          margin-top: 0.25rem;
        }
        @media (max-width: 639px) {
          .stat-glass {
            font-size: 0.85rem;
            padding: 0.28rem 0.6rem;
          }
          .modern-btn {
            font-size: 0.85rem;
            padding: 0.28rem 0.6rem;
          }
        }
        @media (min-width: 640px) {
          .topbar-unified {
            flex-direction: row;
            justify-content: space-between;
            padding: 0 2rem;
          }
          .stats-group {
            gap: 1rem;
            justify-content: flex-start;
          }
          .buttons-group {
            gap: 1rem;
            margin-top: 0;
          }
          .stat-glass {
            font-size: 1.15rem;
            padding: 0.6rem 1.6rem;
          }
          .modern-btn {
            font-size: 1.08rem;
            padding: 0.7rem 2.2rem;
          }
        }
      `}</style>
    </div>
  );
}
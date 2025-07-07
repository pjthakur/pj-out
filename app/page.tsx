"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaRedo,
  FaRocket,
  FaGamepad,
  FaCircle,
  FaGhost,
  FaDotCircle
} from "react-icons/fa";
interface Position {
  x: number;
  y: number;
}
interface Ghost {
  position: Position;
  color: string;
  mode: "chase" | "scatter" | "frightened" | "eaten";
  target: Position;
  direction: Position;
  speed: number;
  aiPattern: "aggressive" | "ambush" | "flanking" | "patrol";
  frightenedTargetTimer?: number;
}
interface GameState {
  pacman: {
    position: Position;
    direction: Position;
    nextDirection: Position;
    mouthOpen: boolean;
  };
  ghosts: Ghost[];
  score: number;
  lives: number;
  level: number;
  gameStatus: "welcome" | "playing" | "paused" | "gameOver" | "victory";
  powerPelletActive: boolean;
  powerPelletTimer: number;
  scoreMultiplier: number;
  dots: boolean[][];
  powerPellets: Position[];
  scatterChaseTimer: number;
  scatterChasePhase: number;
  frightenedTargetTimer?: number;
}
const MAZE_WIDTH = 28;
const MAZE_HEIGHT = 31;
const CELL_SIZE = 20;
const PACMAN_SPEED = 0.1;
const GHOST_SPEED = 0.07;
const FRIGHTENED_SPEED = 0.05;
const POWER_PELLET_DURATION = 10000;
const ENEMY_SCORE = 200;
const SCATTER_CHASE_CYCLE = [
  { mode: "scatter", duration: 10000 },
  { mode: "chase", duration: 20000 },
  { mode: "scatter", duration: 10000 },
  { mode: "chase", duration: 20000 },
  { mode: "scatter", duration: 5000 },
  { mode: "chase", duration: 5000 },
  { mode: "scatter", duration: 15000 },
  { mode: "chase", duration: Infinity },
];
const MAZE: number[][] = [
  [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1,
  ],
  [
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1,
    1, 0, 1,
  ],
  [
    1, 3, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1,
    1, 3, 1,
  ],
  [
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1,
    1, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1,
  ],
  [
    1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1,
    1, 0, 1,
  ],
  [
    1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1,
    1, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0,
    0, 0, 1,
  ],
  [
    1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 1,
    1, 1, 1,
  ],
  [
    1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 1,
    1, 1, 1,
  ],
  [
    1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0, 1, 1, 1,
    1, 1, 1,
  ],
  [
    1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1,
    1, 1, 1,
  ],
  [
    1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 0, 1, 1, 1,
    1, 1, 1,
  ],
  [
    2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 0, 2, 2, 2,
    2, 2, 2,
  ],
  [
    1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 0, 1, 1, 1,
    1, 1, 1,
  ],
  [
    1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1,
    1, 1, 1,
  ],
  [
    1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0, 1, 1, 1,
    1, 1, 1,
  ],
  [
    1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1,
    1, 1, 1,
  ],
  [
    1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1,
    1, 1, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1,
  ],
  [
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1,
    1, 0, 1,
  ],
  [
    1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1,
    1, 0, 1,
  ],
  [
    1, 3, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0,
    0, 3, 1,
  ],
  [
    1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0,
    1, 1, 1,
  ],
  [
    1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0,
    1, 1, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0,
    0, 0, 1,
  ],
  [
    1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 1,
  ],
  [
    1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 1,
  ],
  [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1,
  ],
  [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1,
  ],
];
const INITIAL_GAME_STATE: GameState = {
  pacman: {
    position: { x: 14, y: 23 },
    direction: { x: 0, y: 0 },
    nextDirection: { x: 0, y: 0 },
    mouthOpen: true,
  },
  ghosts: [
    {
      position: { x: 14, y: 11 },
      color: "#ff0000",
      mode: "scatter",
      target: { x: 25, y: 0 },
      direction: { x: 1, y: 0 },
      speed: GHOST_SPEED,
      aiPattern: "aggressive",
    },
    {
      position: { x: 13, y: 14 },
      color: "#ffb8ff",
      mode: "scatter",
      target: { x: 2, y: 0 },
      direction: { x: 1, y: 0 },
      speed: GHOST_SPEED,
      aiPattern: "ambush",
    },
    {
      position: { x: 14, y: 14 },
      color: "#00ffff",
      mode: "scatter",
      target: { x: 27, y: 30 },
      direction: { x: -1, y: 0 },
      speed: GHOST_SPEED,
      aiPattern: "flanking",
    },
    {
      position: { x: 15, y: 14 },
      color: "#ffb851",
      mode: "scatter",
      target: { x: 0, y: 30 },
      direction: { x: 0, y: 1 },
      speed: GHOST_SPEED,
      aiPattern: "patrol",
    },
  ],
  score: 0,
  lives: 1,
  level: 1,
  gameStatus: "welcome",
  powerPelletActive: false,
  powerPelletTimer: 0,
  scoreMultiplier: 1,
  dots: MAZE.map((row) => row.map((cell) => cell === 0)),
  powerPellets: [],
  scatterChaseTimer: 10000,
  scatterChasePhase: 0,
};
export default function MazeRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(null);
  const lastTimeRef = useRef<number>(0);
  const gameStateRef = useRef<GameState>(INITIAL_GAME_STATE);
  const [uiState, setUiState] = useState({
    score: INITIAL_GAME_STATE.score,
    lives: INITIAL_GAME_STATE.lives,
    level: INITIAL_GAME_STATE.level,
    gameStatus: INITIAL_GAME_STATE.gameStatus,
    powerPelletActive: INITIAL_GAME_STATE.powerPelletActive,
    powerPelletTimer: INITIAL_GAME_STATE.powerPelletTimer,
    scoreMultiplier: INITIAL_GAME_STATE.scoreMultiplier,
    scale: 1,
    isMobile: false,
    touchStart: null as Position | null,
    joystickPosition: { x: 0, y: 0 },
    isJoystickActive: false,
  });
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);
  const playSound = useCallback(async (frequency: number, duration: number) => {
    if (isMuted) return;
    try {
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }
      if (audioContext.current.state === 'suspended') {
        await audioContext.current.resume();
      }
      if (audioContext.current.state !== 'running') {
        return;
      }
      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      oscillator.frequency.value = frequency;
      gainNode.gain.value = 0.1;
      oscillator.start();
      oscillator.stop(audioContext.current.currentTime + duration);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, [isMuted]);
  useEffect(() => {
    const powerPellets: Position[] = [];
    MAZE.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 3) {
          powerPellets.push({ x, y });
        }
      });
    });
    gameStateRef.current.powerPellets = powerPellets;
  }, []);
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const status = gameStateRef.current.gameStatus;
      if (status === "welcome" && e.key === "Enter") {
        await startGame();
      }
      if (status !== "playing" && status !== "welcome" && e.key === "Enter") {
        await restartGame();
      }
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        if (status === "playing" || status === "paused") {
          setIsPaused(prev => !prev);
        }
      }
      if (e.key === "m" || e.key === "M") {
        setIsMuted(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const isMobile = viewportWidth < 768;
      const headerHeight = 80;
      let availableWidth, availableHeight, padding;
      if (isMobile) {
        padding = 16;
        availableWidth = viewportWidth - padding;
        availableHeight = viewportHeight - headerHeight - 100 - padding;
      } else {
        padding = 32;
        availableWidth = (viewportWidth * 0.7) - padding;
        availableHeight = viewportHeight - headerHeight - padding;
      }
      const gameWidth = MAZE_WIDTH * CELL_SIZE;
      const gameHeight = MAZE_HEIGHT * CELL_SIZE;
      const scaleX = availableWidth / gameWidth;
      const scaleY = availableHeight / gameHeight;
      let newScale = Math.min(scaleX, scaleY);
      newScale = Math.max(newScale, 0.25);
      if (isMobile) {
        newScale = Math.min(newScale, 1.8);
        newScale *= 0.98;
      } else {
        newScale = Math.min(newScale, 1.2);
        newScale *= 0.9;
      }
      setUiState(prev => ({
        ...prev,
        scale: newScale,
        isMobile: isMobile
      }));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", () => {
      setTimeout(handleResize, 100);
    });
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameStateRef.current.gameStatus !== "playing") return;
      let nextDirection = { ...gameStateRef.current.pacman.nextDirection };
      switch (e.key) {
        case "ArrowUp":
        case "w":
          nextDirection = { x: 0, y: -1 };
          break;
        case "ArrowDown":
        case "s":
          nextDirection = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
        case "a":
          nextDirection = { x: -1, y: 0 };
          break;
        case "ArrowRight":
        case "d":
          nextDirection = { x: 1, y: 0 };
          break;
      }
      gameStateRef.current.pacman.nextDirection = nextDirection;
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setUiState((prev) => ({
      ...prev,
      touchStart: {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      },
    }));
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!uiState.touchStart) return;
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const currentX = touch.clientX - rect.left;
    const currentY = touch.clientY - rect.top;
    const deltaX = currentX - uiState.touchStart.x;
    const deltaY = currentY - uiState.touchStart.y;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 20) {
        gameStateRef.current.pacman.nextDirection = { x: 1, y: 0 };
      } else if (deltaX < -20) {
        gameStateRef.current.pacman.nextDirection = { x: -1, y: 0 };
      }
    } else {
      if (deltaY > 20) {
        gameStateRef.current.pacman.nextDirection = { x: 0, y: 1 };
      } else if (deltaY < -20) {
        gameStateRef.current.pacman.nextDirection = { x: 0, y: -1 };
      }
    }
  };
  const handleJoystickTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (gameStateRef.current.gameStatus !== "playing") return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = touch.clientX - centerX;
    const deltaY = touch.clientY - centerY;
    const maxDistance = 20;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const clampedDistance = Math.min(distance, maxDistance);
    let joystickX = 0;
    let joystickY = 0;
    if (distance > 0) {
      joystickX = (deltaX / distance) * clampedDistance;
      joystickY = (deltaY / distance) * clampedDistance;
    }
    setUiState(prev => ({
      ...prev,
      joystickPosition: { x: joystickX, y: joystickY },
      isJoystickActive: true
    }));
    const threshold = 15;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > threshold) {
        gameStateRef.current.pacman.nextDirection = { x: 1, y: 0 };
      } else if (deltaX < -threshold) {
        gameStateRef.current.pacman.nextDirection = { x: -1, y: 0 };
      }
    } else {
      if (deltaY > threshold) {
        gameStateRef.current.pacman.nextDirection = { x: 0, y: 1 };
      } else if (deltaY < -threshold) {
        gameStateRef.current.pacman.nextDirection = { x: 0, y: -1 };
      }
    }
  };
  const handleJoystickTouchEnd = () => {
    setUiState(prev => ({
      ...prev,
      joystickPosition: { x: 0, y: 0 },
      isJoystickActive: false
    }));
  };
  function findNextDirectionBFS(
    start: Position,
    target: Position,
    isValidPosition: (x: number, y: number) => boolean
  ): Position {
    const queue: { pos: Position; path: Position[] }[] = [
      { pos: start, path: [] },
    ];
    const visited = new Set<string>();
    const dirs = [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
    ];
    while (queue.length > 0) {
      const { pos, path } = queue.shift()!;
      const key = `${Math.round(pos.x)},${Math.round(pos.y)}`;
      if (visited.has(key)) continue;
      visited.add(key);
      if (
        Math.round(pos.x) === Math.round(target.x) &&
        Math.round(pos.y) === Math.round(target.y)
      ) {
        return path[0] || { x: 0, y: 0 };
      }
      for (const dir of dirs) {
        const nx = Math.round(pos.x) + dir.x;
        const ny = Math.round(pos.y) + dir.y;
        if (isValidPosition(nx, ny)) {
          queue.push({ pos: { x: nx, y: ny }, path: [...path, dir] });
        }
      }
    }
    return { x: 0, y: 0 };
  }
  const isValidPosition = useCallback((x: number, y: number): boolean => {
    const roundedX = Math.round(x);
    const roundedY = Math.round(y);
    if (
      roundedX < 0 ||
      roundedX >= MAZE_WIDTH ||
      roundedY < 0 ||
      roundedY >= MAZE_HEIGHT
    ) {
      return false;
    }
    return MAZE[roundedY][roundedX] !== 1;
  }, []);
  const updateGhostAI = useCallback((
    ghost: Ghost,
    pacman: GameState['pacman'],
    aggressiveGhost: Ghost,
    powerPelletActive: boolean,
    currentMode: 'chase' | 'scatter'
  ): Ghost => {
    const newGhost = { ...ghost };
    if (powerPelletActive && ghost.mode !== "eaten") {
      newGhost.mode = "frightened";
      newGhost.speed = FRIGHTENED_SPEED;
    } else if (!powerPelletActive && ghost.mode === "frightened") {
      newGhost.mode = currentMode;
      newGhost.speed = GHOST_SPEED;
    }
    if (newGhost.mode === "frightened") {
      const now = performance.now();
      if (
        !newGhost.frightenedTargetTimer ||
        now - newGhost.frightenedTargetTimer > 500
      ) {
        newGhost.target = {
          x: Math.floor(Math.random() * MAZE_WIDTH),
          y: Math.floor(Math.random() * MAZE_HEIGHT),
        };
        newGhost.frightenedTargetTimer = now;
      }
    } else if (newGhost.mode === "eaten") {
      newGhost.target = { x: 14, y: 14 };
      newGhost.speed = GHOST_SPEED * 2;
    } else {
      switch (ghost.aiPattern) {
        case "aggressive":
          newGhost.target = { ...pacman.position };
          break;
        case "ambush":
          newGhost.target = {
            x: pacman.position.x + pacman.direction.x * 4,
            y: pacman.position.y + pacman.direction.y * 4,
          };
          break;
        case "flanking":
          const pivotX = pacman.position.x + pacman.direction.x * 2;
          const pivotY = pacman.position.y + pacman.direction.y * 2;
          newGhost.target = {
            x: pivotX + (pivotX - aggressiveGhost.position.x),
            y: pivotY + (pivotY - aggressiveGhost.position.y),
          };
          break;
        case "patrol":
          const distance = Math.sqrt(
            Math.pow(pacman.position.x - ghost.position.x, 2) +
            Math.pow(pacman.position.y - ghost.position.y, 2)
          );
          if (distance > 8) {
            newGhost.target = { ...pacman.position };
          } else {
            newGhost.target = { x: 0, y: 30 };
          }
          break;
      }
    }
    const atCenter =
      Math.abs(newGhost.position.x - Math.round(newGhost.position.x)) < 0.05 &&
      Math.abs(newGhost.position.y - Math.round(newGhost.position.y)) < 0.05;
    if (atCenter) {
      newGhost.position.x = Math.round(newGhost.position.x);
      newGhost.position.y = Math.round(newGhost.position.y);
      newGhost.direction = findNextDirectionBFS(
        newGhost.position,
        newGhost.target,
        isValidPosition
      );
    }
    const nextX = newGhost.position.x + newGhost.direction.x * newGhost.speed;
    const nextY = newGhost.position.y + newGhost.direction.y * newGhost.speed;
    if (isValidPosition(nextX, nextY)) {
      newGhost.position = { x: nextX, y: nextY };
    } else {
      newGhost.position.x = Math.round(newGhost.position.x);
      newGhost.position.y = Math.round(newGhost.position.y);
    }
    if (
      newGhost.mode === "eaten" &&
      Math.abs(newGhost.position.x - 14) < 1 &&
      Math.abs(newGhost.position.y - 14) < 1
    ) {
      newGhost.mode = "chase";
      newGhost.speed = GHOST_SPEED;
    }
    return newGhost;
  }, [isValidPosition]);
  const gameLoop = useCallback(
    (timestamp: number) => {
      if (!canvasRef.current) return;
      const gameState = gameStateRef.current;
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.save();
      ctx.scale(uiState.scale, uiState.scale);
      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#00ffff";
      ctx.shadowBlur = 4;
      MAZE.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell === 1) {
            ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          }
        });
      });
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ffffff";
      gameState.dots.forEach((row, y) => {
        row.forEach((hasDot, x) => {
          if (hasDot) {
            ctx.beginPath();
            ctx.arc(
              x * CELL_SIZE + CELL_SIZE / 2,
              y * CELL_SIZE + CELL_SIZE / 2,
              2,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
        });
      });
      const pulseSize = Math.sin(timestamp / 200) * 2 + 6;
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 8;
      gameState.powerPellets.forEach((pellet) => {
        ctx.beginPath();
        ctx.arc(
          pellet.x * CELL_SIZE + CELL_SIZE / 2,
          pellet.y * CELL_SIZE + CELL_SIZE / 2,
          pulseSize,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });
      ctx.shadowBlur = 0;
      if (gameState.gameStatus === "playing" && !isPaused) {
        const nextState = {
          ...gameState,
          ghosts: gameState.ghosts.map(g => ({ ...g })),
          dots: gameState.dots.map(r => [...r]),
          powerPellets: [...gameState.powerPellets]
        };
        nextState.scatterChaseTimer -= deltaTime;
        if (nextState.scatterChaseTimer <= 0) {
          nextState.scatterChasePhase = Math.min(
            nextState.scatterChasePhase + 1,
            SCATTER_CHASE_CYCLE.length - 1
          );
          nextState.scatterChaseTimer =
            SCATTER_CHASE_CYCLE[nextState.scatterChasePhase].duration;
        }
        const currentMode = SCATTER_CHASE_CYCLE[nextState.scatterChasePhase].mode;
        const pacman = { ...nextState.pacman };
        const nextXForDirection = pacman.position.x + pacman.nextDirection.x * PACMAN_SPEED;
        const nextYForDirection = pacman.position.y + pacman.nextDirection.y * PACMAN_SPEED;
        if (isValidPosition(nextXForDirection, nextYForDirection)) {
          if (pacman.nextDirection.x !== 0 && pacman.direction.y !== 0) {
            pacman.position.y = Math.round(pacman.position.y);
          }
          if (pacman.nextDirection.y !== 0 && pacman.direction.x !== 0) {
            pacman.position.x = Math.round(pacman.position.x);
          }
          pacman.direction = { ...pacman.nextDirection };
        }
        const moveX = pacman.position.x + pacman.direction.x * PACMAN_SPEED;
        const moveY = pacman.position.y + pacman.direction.y * PACMAN_SPEED;
        if (isValidPosition(moveX, moveY)) {
          pacman.position = { x: moveX, y: moveY };
          pacman.mouthOpen = Math.floor(timestamp / 100) % 2 === 0;
        } else {
          pacman.mouthOpen = true;
        }
        nextState.pacman = pacman;
        const gridX = Math.round(pacman.position.x);
        const gridY = Math.round(pacman.position.y);
        if (
          Math.abs(pacman.position.x - gridX) < 0.3 &&
          Math.abs(pacman.position.y - gridY) < 0.3
        ) {
          if (nextState.dots[gridY]?.[gridX]) {
            nextState.dots[gridY][gridX] = false;
            nextState.score += 10 * nextState.scoreMultiplier;
            playSound(440, 0.1);
          }
          const powerPelletIndex = nextState.powerPellets.findIndex(
            (p) => p.x === gridX && p.y === gridY
          );
          if (powerPelletIndex !== -1) {
            nextState.powerPellets.splice(powerPelletIndex, 1);
            nextState.powerPelletActive = true;
            nextState.powerPelletTimer = POWER_PELLET_DURATION;
            nextState.scoreMultiplier = 2;
            nextState.score += 50;
            playSound(220, 0.3);
          }
        }
        const aggressiveGhost = nextState.ghosts.find(g => g.aiPattern === 'aggressive') || nextState.ghosts[0];
        nextState.ghosts = nextState.ghosts.map((ghost) =>
          updateGhostAI(ghost, pacman, aggressiveGhost, nextState.powerPelletActive, currentMode as 'chase' | 'scatter')
        );
        nextState.ghosts.forEach((ghost, index) => {
          const distance = Math.sqrt(
            Math.pow(pacman.position.x - ghost.position.x, 2) +
            Math.pow(pacman.position.y - ghost.position.y, 2)
          );
          if (distance < 0.8) {
            if (ghost.mode === "frightened") {
              nextState.ghosts[index].mode = "eaten";
              nextState.score += ENEMY_SCORE * nextState.scoreMultiplier * (index + 1);
              playSound(880, 0.2);
            } else if (ghost.mode !== "eaten") {
              nextState.lives -= 1;
              if (nextState.lives <= 0) {
                nextState.gameStatus = "gameOver";
              } else {
                nextState.pacman = { ...INITIAL_GAME_STATE.pacman };
                nextState.ghosts = INITIAL_GAME_STATE.ghosts.map(g => ({ ...g }));
              }
              playSound(110, 0.5);
            }
          }
        });
        if (nextState.powerPelletActive) {
          nextState.powerPelletTimer -= deltaTime;
          if (nextState.powerPelletTimer <= 0) {
            nextState.powerPelletActive = false;
            nextState.powerPelletTimer = 0;
            nextState.scoreMultiplier = 1;
          }
        }
        const dotsRemaining = nextState.dots.flat().filter(Boolean).length;
        if (dotsRemaining === 0 && nextState.powerPellets.length === 0) {
          nextState.gameStatus = "victory";
          nextState.score += 1000 * nextState.level;
        }
        gameStateRef.current = nextState;
        if (
          gameState.score !== nextState.score ||
          gameState.lives !== nextState.lives ||
          gameState.gameStatus !== nextState.gameStatus ||
          gameState.powerPelletActive !== nextState.powerPelletActive ||
          gameState.scoreMultiplier !== nextState.scoreMultiplier ||
          Math.ceil(gameState.powerPelletTimer / 1000) !== Math.ceil(nextState.powerPelletTimer / 1000)
        ) {
          setUiState(prev => ({
            ...prev,
            score: nextState.score,
            lives: nextState.lives,
            level: nextState.level,
            gameStatus: nextState.gameStatus,
            powerPelletActive: nextState.powerPelletActive,
            powerPelletTimer: nextState.powerPelletTimer,
            scoreMultiplier: nextState.scoreMultiplier,
          }));
        }
      }
      ctx.fillStyle = "#ffff00";
      ctx.shadowColor = "#ffff00";
      ctx.shadowBlur = 6;
      ctx.save();
      ctx.translate(
        gameState.pacman.position.x * CELL_SIZE + CELL_SIZE / 2,
        gameState.pacman.position.y * CELL_SIZE + CELL_SIZE / 2
      );
      let rotation = 0;
      if (gameState.pacman.direction.x === 1) rotation = 0;
      else if (gameState.pacman.direction.x === -1) rotation = Math.PI;
      else if (gameState.pacman.direction.y === 1) rotation = Math.PI / 2;
      else if (gameState.pacman.direction.y === -1) rotation = -Math.PI / 2;
      ctx.rotate(rotation);
      ctx.beginPath();
      if (gameState.pacman.mouthOpen) {
        ctx.arc(0, 0, CELL_SIZE / 2 - 2, 0.2 * Math.PI, 1.8 * Math.PI);
      } else {
        ctx.arc(0, 0, CELL_SIZE / 2 - 2, 0, 2 * Math.PI);
      }
      ctx.lineTo(0, 0);
      ctx.fill();
      ctx.restore();
      ctx.shadowBlur = 0;
      gameState.ghosts.forEach((ghost) => {
        if (ghost.mode === "frightened") {
          ctx.fillStyle =
            gameState.powerPelletTimer < 2000 && Math.floor(timestamp / 200) % 2
              ? "#ffffff"
              : "#0000ff";
          ctx.shadowColor = "#0000ff";
          ctx.shadowBlur = 4;
        } else if (ghost.mode === "eaten") {
          ctx.fillStyle = "#444444";
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = ghost.color;
          ctx.shadowColor = ghost.color;
          ctx.shadowBlur = 4;
        }
        const ghostX = ghost.position.x * CELL_SIZE + CELL_SIZE / 2;
        const ghostY = ghost.position.y * CELL_SIZE + CELL_SIZE / 2;
        ctx.beginPath();
        ctx.arc(ghostX, ghostY - 2, CELL_SIZE / 2 - 2, Math.PI, 0);
        ctx.lineTo(ghostX + CELL_SIZE / 2 - 2, ghostY + CELL_SIZE / 2 - 4);
        for (let i = 0; i < 4; i++) {
          const waveX = ghostX + CELL_SIZE / 2 - 2 - (i * (CELL_SIZE - 4)) / 3;
          const waveY =
            ghostY + CELL_SIZE / 2 - 4 + Math.sin(timestamp / 100 + i) * 2;
          ctx.lineTo(waveX, waveY);
        }
        ctx.closePath();
        ctx.fill();
        if (ghost.mode !== "eaten") {
          ctx.shadowBlur = 0;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(ghostX - 4, ghostY - 2, 3, 0, Math.PI * 2);
          ctx.arc(ghostX + 4, ghostY - 2, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = ghost.mode === "frightened" ? "#ff0000" : "#000000";
          ctx.beginPath();
          ctx.arc(
            ghostX - 4 + ghost.direction.x * 2,
            ghostY - 2 + ghost.direction.y * 2,
            1.5,
            0,
            Math.PI * 2
          );
          ctx.arc(
            ghostX + 4 + ghost.direction.x * 2,
            ghostY - 2 + ghost.direction.y * 2,
            1.5,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      });
      ctx.shadowBlur = 0;
      ctx.restore();
      if (
        gameState.gameStatus === "gameOver" ||
        gameState.gameStatus === "victory"
      ) {
        const centerX = canvasRef.current.width / 2;
        const centerY = canvasRef.current.height / 2;
        const scale = uiState.scale;
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(canvasRef.current.width, canvasRef.current.height) / 2);
        gradient.addColorStop(0, "rgba(0, 0, 0, 0.7)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0.95)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        const panelWidth = Math.min(400 * scale, canvasRef.current.width * 0.8);
        const panelHeight = Math.min(300 * scale, canvasRef.current.height * 0.6);
        const panelX = centerX - panelWidth / 2;
        const panelY = centerY - panelHeight / 2;
        ctx.fillStyle = "rgba(20, 20, 30, 0.95)";
        ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        const isVictory = gameState.gameStatus === "victory";
        const borderColor = isVictory ? "#00ffff" : "#c084fc";
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 3 * scale;
        ctx.shadowColor = borderColor;
        ctx.shadowBlur = 15 * scale;
        ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
        ctx.strokeStyle = isVictory ? "#22d3ee" : "#a855f7";
        ctx.lineWidth = 1 * scale;
        ctx.shadowBlur = 5 * scale;
        ctx.strokeRect(panelX + 10 * scale, panelY + 10 * scale, panelWidth - 20 * scale, panelHeight - 20 * scale);
        ctx.shadowBlur = 0;
        ctx.fillStyle = borderColor;
        ctx.font = `bold ${Math.max(36 * scale, 28)}px 'Orbitron', monospace`;
        ctx.textAlign = "center";
        ctx.shadowColor = borderColor;
        ctx.shadowBlur = 20 * scale;
        const title = isVictory ? "LEVEL COMPLETE" : "GAME OVER";
        ctx.fillText(title, centerX, centerY - 60 * scale);
        ctx.fillStyle = "#ffffff";
        ctx.font = `${Math.max(18 * scale, 14)}px 'Rajdhani', sans-serif`;
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 10 * scale;
        const subtitle = isVictory ? "CONGRATULATIONS!" : "BETTER LUCK NEXT TIME";
        ctx.fillText(subtitle, centerX, centerY - 30 * scale);
        ctx.fillStyle = "#fbbf24";
        ctx.font = `bold ${Math.max(24 * scale, 18)}px 'Orbitron', monospace`;
        ctx.shadowColor = "#fbbf24";
        ctx.shadowBlur = 15 * scale;
        ctx.fillText("FINAL SCORE", centerX, centerY + 10 * scale);
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${Math.max(32 * scale, 24)}px 'Orbitron', monospace`;
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 15 * scale;
        ctx.fillText(gameState.score.toLocaleString(), centerX, centerY + 45 * scale);
        const restartMessage = uiState.isMobile ? "TAP TO RESTART" : "PRESS ENTER TO RESTART";
        ctx.fillStyle = isVictory ? "#00ffff" : "#c084fc";
        ctx.font = `${Math.max(16 * scale, 12)}px 'Rajdhani', sans-serif`;
        ctx.shadowColor = isVictory ? "#00ffff" : "#c084fc";
        ctx.shadowBlur = 10 * scale;
        ctx.fillText(restartMessage, centerX, centerY + 85 * scale);
        const time = Date.now() / 1000;
        const pulseAlpha = 0.3 + 0.7 * Math.sin(time * 3);
        ctx.strokeStyle = borderColor + Math.floor(pulseAlpha * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = 2 * scale;
        ctx.shadowColor = borderColor;
        ctx.shadowBlur = 25 * scale;
        ctx.strokeRect(panelX - 5 * scale, panelY - 5 * scale, panelWidth + 10 * scale, panelHeight + 10 * scale);
        ctx.shadowBlur = 0;
      }
      if (isPaused && gameState.gameStatus === "playing") {
        const centerX = canvasRef.current.width / 2;
        const centerY = canvasRef.current.height / 2;
        const scale = uiState.scale;
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        const panelWidth = Math.min(300 * scale, canvasRef.current.width * 0.7);
        const panelHeight = Math.min(150 * scale, canvasRef.current.height * 0.4);
        const panelX = centerX - panelWidth / 2;
        const panelY = centerY - panelHeight / 2;
        ctx.fillStyle = "rgba(15, 15, 25, 0.95)";
        ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 2 * scale;
        ctx.shadowColor = "#00ffff";
        ctx.shadowBlur = 12 * scale;
        ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
        ctx.strokeStyle = "#22d3ee";
        ctx.lineWidth = 1 * scale;
        ctx.shadowBlur = 6 * scale;
        ctx.strokeRect(panelX + 8 * scale, panelY + 8 * scale, panelWidth - 16 * scale, panelHeight - 16 * scale);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#00ffff";
        ctx.font = `bold ${Math.max(32 * scale, 24)}px 'Orbitron', monospace`;
        ctx.textAlign = "center";
        ctx.shadowColor = "#00ffff";
        ctx.shadowBlur = 15 * scale;
        ctx.fillText("PAUSED", centerX, centerY - 10 * scale);
        const resumeMessage = uiState.isMobile ? "TAP RESUME BUTTON" : "PRESS SPACEBAR";
        ctx.fillStyle = "#ffffff";
        ctx.font = `${Math.max(14 * scale, 11)}px 'Rajdhani', sans-serif`;
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 8 * scale;
        ctx.fillText(resumeMessage, centerX, centerY + 25 * scale);
        ctx.shadowBlur = 0;
      }
      animationRef.current = requestAnimationFrame(gameLoop);
    },
    [uiState, playSound, isPaused, updateGhostAI, isValidPosition]
  );
  useEffect(() => {
    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop]);
  const initializeAudio = useCallback(async () => {
    try {
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }
      if (audioContext.current.state === 'suspended') {
        await audioContext.current.resume();
      }
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }, []);
  const startGame = async () => {
    await initializeAudio();
    const powerPellets: Position[] = [];
    MAZE.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 3) {
          powerPellets.push({ x, y });
        }
      });
    });
    gameStateRef.current = {
      ...INITIAL_GAME_STATE,
      dots: MAZE.map((row) => row.map((cell) => cell === 0)),
      powerPellets,
      gameStatus: "playing",
    };
    setUiState(prev => ({
      ...prev,
      score: INITIAL_GAME_STATE.score,
      lives: INITIAL_GAME_STATE.lives,
      level: INITIAL_GAME_STATE.level,
      gameStatus: "playing",
      powerPelletActive: INITIAL_GAME_STATE.powerPelletActive,
      powerPelletTimer: INITIAL_GAME_STATE.powerPelletTimer,
      scoreMultiplier: INITIAL_GAME_STATE.scoreMultiplier,
    }));
    setIsPaused(false);
  };
  const restartGame = async () => {
    await initializeAudio();
    const powerPellets: Position[] = [];
    MAZE.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 3) {
          powerPellets.push({ x, y });
        }
      });
    });
    gameStateRef.current = {
      ...INITIAL_GAME_STATE,
      dots: MAZE.map((row) => row.map((cell) => cell === 0)),
      powerPellets,
      gameStatus: "welcome",
    };
    setUiState(prev => ({
      ...prev,
      score: INITIAL_GAME_STATE.score,
      lives: INITIAL_GAME_STATE.lives,
      level: INITIAL_GAME_STATE.level,
      gameStatus: "welcome",
      powerPelletActive: INITIAL_GAME_STATE.powerPelletActive,
      powerPelletTimer: INITIAL_GAME_STATE.powerPelletTimer,
      scoreMultiplier: INITIAL_GAME_STATE.scoreMultiplier,
    }));
    setIsPaused(false);
  };
  return (
    <>
      <style jsx global>{`
       @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
       * {
         scrollbar-width: none;
         -ms-overflow-style: none;
       }
       *::-webkit-scrollbar {
         display: none;
       }
     `}</style>
      <div className="w-full h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {uiState.gameStatus === "welcome" ? (
          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="w-full max-w-4xl mx-auto text-center">
              <div className="mb-8 sm:mb-12">
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2 sm:mb-4 animate-pulse" style={{ fontFamily: 'Orbitron, monospace' }}>
                  MAZE RUNNER
                </h1>
                <div className="text-lg sm:text-2xl md:text-3xl font-bold text-cyan-400 mb-1 sm:mb-2 tracking-wider" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  NEON EDITION
                </div>
                <div className="text-sm sm:text-lg text-gray-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  A Modern Retro Gaming Experience
                </div>
              </div>
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 w-full max-w-3xl mx-auto shadow-2xl border border-cyan-500/30">
                <h2 className="text-xl sm:text-2xl font-bold text-cyan-400 mb-4 sm:mb-6 flex items-center justify-center gap-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                  <FaGamepad className="text-base sm:text-xl" /> HOW TO PLAY
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold flex-shrink-0">
                        <FaDotCircle className="text-xs sm:text-sm" />
                      </div>
                      <span className="text-white text-sm sm:text-base" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Collect all dots</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center animate-pulse flex-shrink-0">
                        <FaCircle className="text-white text-xs sm:text-sm" />
                      </div>
                      <span className="text-white text-sm sm:text-base" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Power pellets = 2x score</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaGhost className="text-white text-xs sm:text-sm" />
                      </div>
                      <span className="text-white text-sm sm:text-base" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Avoid enemies</span>
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4 mt-4 lg:mt-0">
                    <div className="text-cyan-400 font-bold mb-2 text-sm sm:text-base" style={{ fontFamily: 'Orbitron, monospace' }}>CONTROLS:</div>
                    {uiState.isMobile ? (
                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>• Touch & swipe to move</div>
                        <div className="text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>• Tap buttons to control</div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>• WASD / Arrow keys: Move</div>
                        <div className="text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>• SPACEBAR: Pause</div>
                        <div className="text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>• M: Mute/Unmute</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-md mx-auto">
                <button
                  onClick={startGame}
                  className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white font-bold text-lg sm:text-xl rounded-lg shadow-lg shadow-cyan-500/50 border-2 border-cyan-400 transition-all duration-300 transform hover:scale-105 animate-pulse flex items-center justify-center gap-2 sm:gap-3 hover:shadow-cyan-400/60 hover:border-cyan-300 cursor-pointer"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  <FaRocket className="text-sm sm:text-base" /> START GAME
                </button>
                <div className="text-gray-400 text-xs sm:text-sm text-center" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  {uiState.isMobile ? "Tap to start" : "Press ENTER or click to start"}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-cyan-500/30 shadow-lg flex-shrink-0">
              <div className="max-w-9xl mx-auto px-6 py-3 sm:py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-purple-500 bg-clip-text text-transparent" style={{ fontFamily: 'Orbitron, monospace' }}>
                    MAZE RUNNER NEON EDITION
                  </h1>
                  {uiState.isMobile && (
                    <div className="flex flex-col w-full sm:w-auto gap-2">
                      <div className="flex justify-center sm:justify-end items-center gap-4 text-sm">
                        <span className="text-cyan-400 font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>
                          SCORE: <span className="text-yellow-400">{uiState.score.toLocaleString()}</span>
                        </span>
                        <span className="text-red-400 font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>
                          LIVES: <span className="text-white">{uiState.lives}</span>
                        </span>
                        <span className="text-green-400 font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>
                          LEVEL: <span className="text-white">{uiState.level}</span>
                        </span>
                      </div>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setIsPaused(prev => !prev)}
                          disabled={uiState.gameStatus !== "playing"}
                          className={`px-3 py-1.5 rounded-lg font-bold text-white transition-all duration-200 border-2 flex items-center gap-1 text-xs cursor-pointer ${uiState.gameStatus !== "playing"
                              ? "bg-gray-700 border-gray-600 cursor-not-allowed opacity-50"
                              : isPaused
                                ? "bg-gradient-to-r from-slate-700 to-slate-800 border-cyan-500 shadow-sm shadow-cyan-500/30"
                                : "bg-gradient-to-r from-slate-800 to-slate-900 border-cyan-400 shadow-sm shadow-cyan-400/30"
                            }`}
                          style={{ fontFamily: 'Orbitron, monospace' }}
                        >
                          {isPaused ? <><FaPlay className="text-xs" /> RESUME</> : <><FaPause className="text-xs" /> PAUSE</>}
                        </button>
                        <button
                          onClick={() => setIsMuted(prev => !prev)}
                          className={`px-3 py-1.5 rounded-lg font-bold text-white transition-all duration-200 border-2 flex items-center gap-1 text-xs cursor-pointer ${isMuted
                              ? "bg-gradient-to-r from-slate-800 to-slate-900 border-gray-500 shadow-sm shadow-gray-500/30"
                              : "bg-gradient-to-r from-slate-700 to-slate-800 border-cyan-400 shadow-sm shadow-cyan-400/30"
                            }`}
                          style={{ fontFamily: 'Orbitron, monospace' }}
                        >
                          {isMuted ? <><FaVolumeMute className="text-xs" /> MUTE</> : <><FaVolumeUp className="text-xs" /> MUTE</>}
                        </button>
                        <button
                          onClick={restartGame}
                          className="px-3 py-1.5 rounded-lg font-bold text-white transition-all duration-200 border-2 bg-gradient-to-r from-slate-800 to-slate-900 border-purple-400 shadow-sm shadow-purple-400/30 flex items-center gap-1 text-xs hover:shadow-purple-400/50 cursor-pointer"
                          style={{ fontFamily: 'Orbitron, monospace' }}
                        >
                          <FaRedo className="text-xs" /> RESTART
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1 flex overflow-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {!uiState.isMobile && (
                <div className="w-[30%] bg-gradient-to-b from-gray-800 to-gray-900 border-r border-cyan-500/30 flex flex-col h-full overflow-hidden">
                  <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar p-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                        <FaGamepad /> GAME STATUS
                      </h2>
                      <div className="space-y-3">
                        <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-3 border border-cyan-500/20">
                          <div className="text-cyan-400 text-sm font-bold mb-1" style={{ fontFamily: 'Orbitron, monospace' }}>SCORE</div>
                          <div className="text-yellow-400 text-2xl font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>{uiState.score.toLocaleString()}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 rounded-lg p-3 border border-red-500/20">
                            <div className="text-red-400 text-sm font-bold mb-1" style={{ fontFamily: 'Orbitron, monospace' }}>LIVES</div>
                            <div className="text-white text-xl font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>{uiState.lives}</div>
                          </div>
                          <div className="bg-gradient-to-r from-green-900/30 to-green-800/30 rounded-lg p-3 border border-green-500/20">
                            <div className="text-green-400 text-sm font-bold mb-1" style={{ fontFamily: 'Orbitron, monospace' }}>LEVEL</div>
                            <div className="text-white text-xl font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>{uiState.level}</div>
                          </div>
                        </div>
                        {uiState.scoreMultiplier > 1 && (
                          <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 rounded-lg p-3 border border-purple-500/20">
                            <div className="text-purple-400 text-sm font-bold mb-1" style={{ fontFamily: 'Orbitron, monospace' }}>MULTIPLIER</div>
                            <div className="text-white text-xl font-bold animate-pulse" style={{ fontFamily: 'Orbitron, monospace' }}>{uiState.scoreMultiplier}X</div>
                          </div>
                        )}
                      </div>
                    </div>
                    {uiState.powerPelletActive && (
                      <div className="mb-6">
                        <h3 className="text-lg font-bold text-cyan-400 mb-3" style={{ fontFamily: 'Orbitron, monospace' }}>POWER MODE</h3>
                        <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-4 border border-cyan-500/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-cyan-400 text-sm font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>TIME REMAINING</span>
                            <span className="text-cyan-400 text-sm font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>
                              {Math.ceil(uiState.powerPelletTimer / 1000)}s
                            </span>
                          </div>
                          <div className="bg-gray-700 h-3 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all duration-100 ease-linear animate-pulse"
                              style={{
                                width: `${(uiState.powerPelletTimer / POWER_PELLET_DURATION) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-cyan-400 mb-3" style={{ fontFamily: 'Orbitron, monospace' }}>CONTROLS</h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => setIsPaused(prev => !prev)}
                          disabled={uiState.gameStatus !== "playing"}
                                                      className={`w-full px-4 py-3 rounded-lg font-bold text-white transition-all duration-200 border-2 flex items-center justify-center gap-2 cursor-pointer ${uiState.gameStatus !== "playing"
                              ? "bg-gray-700 border-gray-600 cursor-not-allowed opacity-50"
                              : isPaused
                                ? "bg-gradient-to-r from-slate-700 to-slate-800 border-cyan-500 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:border-cyan-400"
                                : "bg-gradient-to-r from-slate-800 to-slate-900 border-cyan-400 shadow-lg shadow-cyan-400/30 hover:shadow-cyan-400/50 hover:border-cyan-300"
                            }`}
                            style={{ fontFamily: 'Orbitron, monospace' }}
                        >
                          {isPaused ? <><FaPlay /> RESUME GAME</> : <><FaPause /> PAUSE GAME</>}
                        </button>
                        <button
                          onClick={() => setIsMuted(prev => !prev)}
                                                      className={`w-full px-4 py-3 rounded-lg font-bold text-white transition-all duration-200 border-2 flex items-center justify-center gap-2 cursor-pointer ${isMuted
                              ? "bg-gradient-to-r from-slate-800 to-slate-900 border-gray-500 shadow-lg shadow-gray-500/30 hover:shadow-gray-500/50 hover:border-gray-400"
                              : "bg-gradient-to-r from-slate-700 to-slate-800 border-cyan-400 shadow-lg shadow-cyan-400/30 hover:shadow-cyan-400/50 hover:border-cyan-300"
                            }`}
                            style={{ fontFamily: 'Orbitron, monospace' }}
                        >
                          {isMuted ? <><FaVolumeMute /> UNMUTE SOUND</> : <><FaVolumeUp /> MUTE SOUND</>}
                        </button>
                        <button
                          onClick={restartGame}
                          className="w-full px-4 py-3 rounded-lg font-bold text-white transition-all duration-200 border-2 bg-gradient-to-r from-slate-800 to-slate-900 border-purple-400 shadow-lg shadow-purple-400/30 hover:shadow-purple-400/50 hover:border-purple-300 flex items-center justify-center gap-2 cursor-pointer"
                          style={{ fontFamily: 'Orbitron, monospace' }}
                        >
                          <FaRedo /> RESTART GAME
                        </button>
                      </div>
                    </div>
                    <div className="mt-auto overflow-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      <h3 className="text-lg font-bold text-cyan-400 mb-3" style={{ fontFamily: 'Orbitron, monospace' }}>KEYBOARD SHORTCUTS</h3>
                      <div className="space-y-2 text-sm text-gray-300" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        <div className="flex justify-between">
                          <span>Move:</span>
                          <span className="text-cyan-400">WASD / Arrow Keys</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pause:</span>
                          <span className="text-cyan-400">SPACEBAR</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mute:</span>
                          <span className="text-cyan-400">M</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Restart:</span>
                          <span className="text-cyan-400">ENTER</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className={`${uiState.isMobile ? 'w-full' : 'w-[70%]'} flex flex-col relative overflow-hidden`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <canvas
                    ref={canvasRef}
                    width={MAZE_WIDTH * CELL_SIZE * uiState.scale}
                    height={MAZE_HEIGHT * CELL_SIZE * uiState.scale}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onClick={() => {
                      if (uiState.gameStatus !== "playing") {
                        restartGame();
                      }
                    }}
                    onTouchEnd={() => {
                      if (uiState.gameStatus !== "playing") {
                        restartGame();
                      }
                    }}
                    className="cursor-pointer border-2 border-cyan-500/50 rounded-lg shadow-2xl shadow-cyan-500/20 max-w-full max-h-full"
                    style={{
                      width: `${MAZE_WIDTH * CELL_SIZE * uiState.scale}px`,
                      height: `${MAZE_HEIGHT * CELL_SIZE * uiState.scale}px`,
                      imageRendering: "pixelated",
                      touchAction: "none",
                    }}
                  />
                </div>
                {uiState.isMobile && (
                  <div className="flex-shrink-0 flex justify-center items-center p-4 bg-gradient-to-t from-gray-800/50 to-transparent">
                    <div className="relative">
                      <div
                        className="w-28 h-28 bg-gradient-to-r from-slate-800/80 to-slate-900/80 rounded-full border-2 border-cyan-400/60 flex items-center justify-center shadow-xl backdrop-blur-sm transition-all duration-200 active:scale-95 active:border-cyan-300 cursor-pointer"
                        onTouchStart={handleJoystickTouch}
                        onTouchMove={handleJoystickTouch}
                        onTouchEnd={handleJoystickTouchEnd}
                        style={{ touchAction: 'none' }}
                      >
                        <div className="w-20 h-20 bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-full border border-cyan-300/50 flex items-center justify-center shadow-lg relative">
                          <div
                            className={`w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full border border-yellow-300 shadow-lg shadow-cyan-400/30 transition-all duration-150 ease-out ${uiState.isJoystickActive ? 'animate-pulse' : ''}`}
                            style={{
                              transform: `translate(${uiState.joystickPosition.x}px, ${uiState.joystickPosition.y}px)`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {uiState.isMobile && uiState.powerPelletActive && (
                  <div className="absolute top-4 left-4 right-4">
                    <div className="bg-gradient-to-r from-cyan-900/80 to-blue-900/80 backdrop-blur-sm rounded-lg p-3 border border-cyan-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-cyan-400 text-xs font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>POWER MODE</span>
                        <span className="text-cyan-400 text-xs font-bold" style={{ fontFamily: 'Orbitron, monospace' }}>
                          {Math.ceil(uiState.powerPelletTimer / 1000)}s
                        </span>
                      </div>
                      <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all duration-100 ease-linear"
                          style={{
                            width: `${(uiState.powerPelletTimer / POWER_PELLET_DURATION) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <style jsx>{`
     .hide-scrollbar::-webkit-scrollbar { display: none; }
     .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
   `}</style>
    </>
  );
}

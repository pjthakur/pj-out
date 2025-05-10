"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Poppins, Play } from 'next/font/google';
import { Moon, Sun, Trophy, X, RefreshCcw, PlayIcon, PauseIcon } from 'lucide-react';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins'
});

const playFont = Play({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-play'
});

type GridType = number[][];
type Direction = 'up' | 'down' | 'left' | 'right';
type Theme = 'light' | 'dark';
type GameState = 'not-started' | 'playing' | 'won' | 'game-over';
type GameRecord = {
  score: number;
  time: number;
  date: string;
  isCurrent?: boolean;
};

const Game2048 = () => {
  const [grid, setGrid] = useState<GridType>([]);
  const [score, setScore] = useState<number>(0);
  const [topScore, setTopScore] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>('not-started'); 
  const [time, setTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [previousGrid, setPreviousGrid] = useState<GridType>([]);
  const [gameRecords, setGameRecords] = useState<GameRecord[]>([]);
  const [showContinueModal, setShowContinueModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showHowToPlayModal, setShowHowToPlayModal] = useState<boolean>(false);
  const [reachedTarget, setReachedTarget] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (showContinueModal || showHistoryModal || showHowToPlayModal || gameState === 'not-started' || gameState === 'game-over' || gameState === 'won' || isPaused) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showContinueModal, showHistoryModal, showHowToPlayModal, gameState, isPaused]);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontal = Math.abs(distanceX) > Math.abs(distanceY);

    if (Math.max(Math.abs(distanceX), Math.abs(distanceY)) < minSwipeDistance) return;

    if (isHorizontal) {
      if (distanceX > 0) move('left');
      else move('right');
    } else {
      if (distanceY > 0) move('up');
      else move('down');
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    const newGrid: GridType = Array(4).fill(0).map(() => Array(4).fill(0));
    addRandomTile(newGrid); 
    addRandomTile(newGrid);
    setGrid(newGrid);

    const storedRecords = localStorage.getItem('game2048Records');
    if (storedRecords) {
      const records = JSON.parse(storedRecords);
      setGameRecords(records);

      if (records.length > 0) {
        const highestRecord = records.reduce(
          (max: GameRecord, record: GameRecord): GameRecord =>
            record.score > max.score ? record : max,
          records[0] as GameRecord
        );
        setTopScore(highestRecord.score);
      }
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (gameState === 'playing' && !isPaused) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, isPaused]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameState !== 'playing' || isPaused) return;

      switch (event.key) {
        case 'ArrowUp':
          move('up');
          break;
        case 'ArrowDown':
          move('down');
          break;
        case 'ArrowLeft':
          move('left');
          break;
        case 'ArrowRight':
          move('right');
          break;
        default:
          return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [grid, gameState, isPaused]);

  useEffect(() => {
    if (gameRecords.length > 0) {
      localStorage.setItem('game2048Records', JSON.stringify(gameRecords));
    }
  }, [gameRecords]);

  const startGame = () => {
    const newGrid: GridType = Array(4).fill(0).map(() => Array(4).fill(0));

    addRandomTile(newGrid);
    addRandomTile(newGrid);

    setGrid(newGrid);
    setPreviousGrid([]);
    setScore(0);
    setGameState('playing');
    setTime(0);
    setIsPlaying(true);
    setReachedTarget(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
  };

  const resetGame = () => {
    const newGrid: GridType = Array(4).fill(0).map(() => Array(4).fill(0));

    addRandomTile(newGrid);
    addRandomTile(newGrid);

    setGrid(newGrid);
    setPreviousGrid([]);
    setScore(0);
    setGameState('playing');
    setTime(0);
    setIsPlaying(true);
    setReachedTarget(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
  };

  const endGame = (state: 'won' | 'game-over') => {
    setGameState(state);
    setIsPlaying(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const newRecord: GameRecord = {
      score,
      time,
      date: new Date().toLocaleString(),
      isCurrent: true
    };

    const updatedRecords = gameRecords.map(record => ({ ...record, isCurrent: false }));
    const newRecords = [...updatedRecords, newRecord].sort((a, b) => b.score - a.score);
    setGameRecords(newRecords);

    if (score > topScore) {
      setTopScore(score);
    }
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const toggleHistoryModal = () => {
    setShowHistoryModal(prev => !prev);
  };

  const toggleHowToPlay = () => {
    setShowHowToPlayModal(prev => !prev);
  };

  const continueGame = () => {
    setShowContinueModal(false);
    setReachedTarget(true);
  };

  const finishGame = () => {
    setShowContinueModal(false);
    endGame('won');
  };

  const addRandomTile = (currentGrid: GridType): void => {
    const emptyCells: { row: number; col: number }[] = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (currentGrid[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) return;

    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    currentGrid[row][col] = Math.random() < 0.9 ? 2 : 4;
  };

  const checkGameOver = (currentGrid: GridType): boolean => {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (currentGrid[row][col] === 0) return false;
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (currentGrid[row][col] === currentGrid[row][col + 1]) return false;
      }
    }

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (currentGrid[row][col] === currentGrid[row + 1][col]) return false;
      }
    }

    return true;
  };

  const checkWinCondition = (currentGrid: GridType): boolean => {
    if (reachedTarget) return false; 

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (currentGrid[row][col] === 2048) return true;
      }
    }

    return false;
  };

  const move = (direction: Direction): void => {
    setPreviousGrid(JSON.parse(JSON.stringify(grid)));
    const newGrid: GridType = JSON.parse(JSON.stringify(grid));
    let moved = false;
    let newScore = score;

    if (!isPlaying) {
      setIsPlaying(true);
    }

    if (direction === 'left') {
      for (let row = 0; row < 4; row++) {
        const result = processTilesLeftRight(newGrid[row], false);
        newGrid[row] = result.newRow;
        moved = moved || result.moved;
        newScore += result.scoreIncrease;
      }
    } else if (direction === 'right') {
      for (let row = 0; row < 4; row++) {
        const result = processTilesLeftRight(newGrid[row], true);
        newGrid[row] = result.newRow;
        moved = moved || result.moved;
        newScore += result.scoreIncrease;
      }
    } else if (direction === 'up') {
      for (let col = 0; col < 4; col++) {
        const column = [newGrid[0][col], newGrid[1][col], newGrid[2][col], newGrid[3][col]];
        const result = processTilesLeftRight(column, false);
        for (let row = 0; row < 4; row++) {
          newGrid[row][col] = result.newRow[row];
        }
        moved = moved || result.moved;
        newScore += result.scoreIncrease;
      }
    } else if (direction === 'down') {
      for (let col = 0; col < 4; col++) {
        const column = [newGrid[0][col], newGrid[1][col], newGrid[2][col], newGrid[3][col]];
        const result = processTilesLeftRight(column, true);
        for (let row = 0; row < 4; row++) {
          newGrid[row][col] = result.newRow[row];
        }
        moved = moved || result.moved;
        newScore += result.scoreIncrease;
      }
    }

    if (moved) {
      addRandomTile(newGrid);
      setScore(newScore);

      if (newScore > topScore) {
        setTopScore(newScore);
      }

      setGrid(newGrid);

      if (checkWinCondition(newGrid)) {
        setShowContinueModal(true);
      }

      if (checkGameOver(newGrid)) {
        endGame('game-over');
      }
    }
  };

  const processTilesLeftRight = (
    row: number[],
    reverse: boolean
  ): { newRow: number[]; moved: boolean; scoreIncrease: number } => {
    let newRow = [...row];
    let moved = false;
    let scoreIncrease = 0;

    if (reverse) newRow.reverse();

    newRow = newRow.filter(tile => tile !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        scoreIncrease += newRow[i];
        newRow.splice(i + 1, 1);
        moved = true;
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    if (reverse) newRow.reverse();

    if (!moved) {
      moved = !row.every((val, index) => val === newRow[index]);
    }

    return { newRow, moved, scoreIncrease };
  };

  const getTileColor = (value: number): string => {
    switch (value) {
      case 2:
        return 'bg-yellow-100';
      case 4:
        return 'bg-yellow-200';
      case 8:
        return 'bg-orange-200';
      case 16:
        return 'bg-orange-300';
      case 32:
        return 'bg-red-300';
      case 64:
        return 'bg-red-400';
      case 128:
        return 'bg-blue-300';
      case 256:
        return 'bg-blue-400';
      case 512:
        return 'bg-indigo-400';
      case 1024:
        return 'bg-indigo-500';
      case 2048:
        return 'bg-purple-500';
      default:
        return theme === 'light' ? 'bg-gray-200' : 'bg-gray-600';
    }
  };

  const getTextColor = (value: number): string => {
    return value <= 4 ? 'text-gray-700' : 'text-white';
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getFontSize = (value: number): string => {
    if (value < 100) return 'text-3xl';
    if (value < 1000) return 'text-2xl';
    return 'text-xl';
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  return (
    <div className={`${poppins.variable} ${playFont.variable} flex flex-col min-h-screen transition-colors duration-300 ${
      theme === 'light' ? 'bg-slate-50/100' : 'bg-gradient-to-br from-gray-900 to-gray-800'
    }`}>
      <nav className={`fixed top-0 left-0 right-0 z-50 ${
        theme === 'light' 
          ? 'bg-white/80 border-b border-gray-200/50' 
          : 'bg-gray-900/80 border-b border-gray-700/50'
      } backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between flex-wrap sm:flex-nowrap gap-2">
              <span className={`font-play font-bold text-3xl sm:text-4xl inline-flex transform hover:scale-105 transition-all duration-300 
                ${theme === 'light' ? 'drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]' : ''}`}
              >
                <span className={`${theme === 'light' ? 'text-yellow-200' : 'text-yellow-100'}`}>2</span>
                <span className={`${theme === 'light' ? 'text-yellow-300' : 'text-yellow-100'}`}>0</span>
                <span className={`${theme === 'light' ? 'text-yellow-400' : 'text-yellow-200'}`}>4</span>
                <span className={`${theme === 'light' ? 'text-orange-500' : 'text-orange-300'}`}>8</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleHowToPlay}
                  className={`group transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-1
                    ${theme === 'light'
                      ? 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700'
                      : 'bg-gradient-to-br from-gray-700 to-gray-800 text-slate-200'
                    } p-2 sm:px-3 sm:py-2 rounded-xl shadow-lg hover:shadow-slate-500/25 text-xs sm:text-sm border ${
                      theme === 'light' ? 'border-slate-200' : 'border-gray-600'
                    }`}
                >
                  <i className="hidden sm:block">?</i>
                  <span>How to Play</span>
                </button>
                <button
                  onClick={toggleHistoryModal}
                  className={`group transform hover:scale-105 active:scale-95 transition-all duration-200
                    ${theme === 'light'
                      ? 'bg-gradient-to-br from-amber-400 to-amber-500'
                      : 'bg-gradient-to-br from-amber-500 to-amber-600'
                    } p-2 rounded-xl text-white shadow-lg hover:shadow-amber-500/25`}
                  aria-label="View score history"
                >
                  <Trophy size={20} className="transform group-hover:-rotate-12 transition-transform" />
                </button>
                <button
                  onClick={toggleTheme}
                  className={`group transform hover:scale-105 active:scale-95 transition-all duration-200 ${
                    theme === 'light' 
                      ? 'bg-white/90 text-slate-700 shadow-lg hover:bg-white' 
                      : 'bg-gray-800/90 text-slate-200 shadow-lg hover:bg-gray-800'
                  } p-2 rounded-xl backdrop-blur-sm`}
                >
                  {theme === 'light' 
                    ? <Moon size={20} className="transform group-hover:rotate-12 transition-transform" /> 
                    : <Sun size={20} className="transform group-hover:rotate-90 transition-transform" />
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center pt-20 sm:pt-28">
        <main className="container mx-auto max-w-lg px-2 sm:px-4 w-full">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className={`${
              theme === 'light'
                ? 'bg-white/80 shadow-lg backdrop-blur-sm'
                : 'bg-gray-800/80 shadow-lg backdrop-blur-sm'
            } rounded-xl sm:rounded-2xl p-3 sm:p-5 transition-all duration-300`}>
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                <div className={`${
                  theme === 'light' ? 'bg-slate-100' : 'bg-gray-700'
                } col-span-1 rounded-xl p-3 text-center transition-colors flex flex-col items-center justify-center`}>
                  <p className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Score</p>
                  <p className={`text-xl font-bold font-play ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{score}</p>
                </div>
                
                <div className={`${
                  theme === 'light' ? 'bg-slate-100' : 'bg-gray-700'
                } col-span-1 rounded-xl p-3 text-center transition-colors flex flex-col items-center justify-center`}>
                  <p className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Time</p>
                  <p className={`text-xl font-bold font-play ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{formatTime(time)}</p>
                </div>

                <div className={`${
                  theme === 'light' ? 'bg-slate-100' : 'bg-gray-700'
                } col-span-1 rounded-xl p-3 text-center transition-colors flex flex-col items-center justify-center`}>
                  <p className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Top Score</p>
                  <p className={`text-xl font-bold font-play ${score > 0 && score === topScore ? 'text-green-500' : (theme === 'light' ? 'text-slate-900' : 'text-white')}`}>
                    {topScore}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  {gameState === 'playing' && (
                    <button
                      onClick={togglePause}
                      className={`group flex items-center justify-center transform hover:scale-105 active:scale-95 transition-all duration-200
                        ${theme === 'light'
                          ? 'bg-gradient-to-br from-blue-400 to-blue-500'
                          : 'bg-gradient-to-br from-blue-500 to-blue-600'
                        } rounded-xl text-white shadow-lg hover:shadow-blue-500/25 flex-1`}
                      aria-label={isPaused ? "Resume game" : "Pause game"}
                    >
                      {isPaused ? (
                        <PlayIcon size={20} className="transform group-hover:scale-110 transition-transform" />
                      ) : (
                        <PauseIcon size={20} className="transform group-hover:scale-110 transition-transform" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={resetGame}
                    className={`group flex items-center justify-center transform hover:scale-105 active:scale-95 transition-all duration-200
                      ${theme === 'light'
                        ? 'bg-gradient-to-br from-rose-400 to-rose-500'
                        : 'bg-gradient-to-br from-rose-500 to-rose-600'
                      } rounded-xl text-white shadow-lg hover:shadow-rose-500/25 flex-1`}
                    aria-label="Reset game"
                  >
                    <RefreshCcw size={20} className="transform group-hover:rotate-180 transition-transform duration-500" />
                  </button>
                </div>
              </div>
            </div>

            <div 
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              className={`${
                theme === 'light'
                  ? 'bg-white/80 shadow-lg backdrop-blur-sm'
                  : 'bg-gray-800/80 shadow-lg backdrop-blur-sm'
              } p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300`}
            >
              <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full aspect-square">
                {grid.map((row, rowIndex) => (
                  row.map((value, colIndex) => {
                    const isPreviousTile = previousGrid.length > 0 && previousGrid[rowIndex]?.[colIndex] !== value;
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`aspect-square flex items-center justify-center rounded-xl shadow-lg
                          ${value === 0 
                            ? theme === 'light' 
                              ? 'bg-slate-200/50' 
                              : 'bg-gray-700/50' 
                            : getTileColor(value)} 
                          ${getTextColor(value)} font-bold font-play ${getFontSize(value)}
                          transform transition-all ease-in-out duration-150 ${isPreviousTile ? 'animate-pop' : ''}
                          hover:scale-[1.02] transition-transform`}
                      >
                        {value !== 0 && value}
                      </div>
                    );
                  })
                ))}
              </div>
            </div>
          </div>

          {gameState === 'playing' && (
            <div className={`mt-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-center`}>
              <p>Use arrow keys or swipe to move the tiles</p>
              <p className="text-sm mt-2">
                Combine tiles with the same number to create a tile with the sum!
              </p>
            </div>
          )}
        </main>
      </div>

      {gameState === 'not-started' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className={`${theme === 'light' 
            ? 'bg-white/90 shadow-xl' 
            : 'bg-gray-800/90'
          } max-w-md w-full mx-4 p-8 rounded-3xl backdrop-blur-sm border ${
            theme === 'light' ? 'border-slate-200' : 'border-gray-700'
          }`}>
            <div className="text-center space-y-6">
              <h1 className={`font-play font-bold text-5xl inline-flex transform hover:scale-105 transition-all duration-300 
                ${theme === 'light' ? 'drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]' : ''}`}
              >
                <span className={`${theme === 'light' ? 'text-yellow-200' : 'text-yellow-100'}`}>2</span>
                <span className={`${theme === 'light' ? 'text-yellow-300' : 'text-yellow-100'}`}>0</span>
                <span className={`${theme === 'light' ? 'text-yellow-400' : 'text-yellow-200'}`}>4</span>
                <span className={`${theme === 'light' ? 'text-orange-500' : 'text-orange-300'}`}>8</span>
              </h1>
              
              <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} text-lg`}>
                Join the tiles, get to 2048!
              </p>

              <button
                onClick={startGame}
                className={`w-full py-4 px-6 rounded-xl font-medium transition-all transform hover:scale-105 active:scale-95 
                  ${theme === 'light'
                    ? 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 hover:from-slate-100 hover:to-slate-200'
                    : 'bg-gradient-to-r from-gray-700 to-gray-800 text-slate-200 border border-gray-600 hover:border-gray-500 hover:from-gray-600 hover:to-gray-700'
                  } shadow-lg`}
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'game-over' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className={`${theme === 'light' 
            ? 'bg-white shadow-xl' 
            : 'bg-gray-900/95'
          } max-w-md w-full mx-4 p-6 rounded-3xl backdrop-blur-sm border ${
            theme === 'light' ? 'border-orange-200' : 'border-gray-700'
          }`}>
            <div className="text-center space-y-6">
              <div className={`${
                theme === 'light' ? 'bg-red-100' : 'bg-red-900/20'
              } w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4`}>
                <X size={32} className={`${
                  theme === 'light' ? 'text-red-600' : 'text-red-400'
                }`} />
              </div>
              
              <div>
                <h2 className={`text-3xl font-bold font-play mb-3 ${
                  theme === 'light' ? 'text-gray-900' : 'text-gray-100'
                }`}>Game Over</h2>
                <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
                  <div className={`${
                    theme === 'light' 
                      ? 'bg-orange-100 text-gray-900' 
                      : 'bg-gray-700 text-white'
                  } px-6 py-2 rounded-xl`}>
                    <div className="text-sm font-medium opacity-75">Score</div>
                    <div className="font-play font-bold text-2xl">{score}</div>
                  </div>
                  <div className={`${
                    theme === 'light' 
                      ? 'bg-slate-100 text-slate-700' 
                      : 'bg-gray-700 text-white'
                  } px-6 py-2 rounded-xl`}>
                    <div className="text-sm font-medium opacity-75">Time</div>
                    <div className="font-play font-bold text-2xl">{formatTime(time)}</div>
                  </div>
                </div>
              </div>

              {score > 0 && (
                <div className={`${
                  theme === 'light' 
                    ? 'bg-gradient-to-b from-slate-50 to-white border border-slate-200' 
                    : 'bg-gradient-to-b from-gray-700 to-gray-800 border border-gray-600'
                } rounded-2xl p-5`}>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Trophy size={18} className={theme === 'light' ? 'text-amber-500' : 'text-amber-400'} />
                    <span className={`font-medium ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                    }`}>Top 3 Scores</span>
                  </div>
                  <div className="space-y-3">
                    {gameRecords.slice(0, 3).map((record, index) => (
                      <div key={index} 
                        className={`flex justify-between items-center p-2 rounded-xl transition-colors ${
                          record.isCurrent 
                            ? theme === 'light'
                              ? 'bg-blue-50 text-blue-600 font-medium'
                              : 'bg-blue-700 text-blue-200 font-medium'
                            : theme === 'light'
                              ? 'bg-slate-50'
                              : 'bg-gray-800 text-gray-200'
                        }`}>
                        <div className="flex items-center gap-3">
                          <span className={`${
                            theme === 'light' ? 'text-slate-400' : 'text-slate-500'
                          } text-sm`}>#{index + 1}</span>
                          <span className={`font-play text-lg ${
                            theme === 'light' 
                              ? 'text-gray-900 font-semibold' 
                              : 'text-white font-semibold'
                          }`}>{record.score}</span>
                        </div>
                        <span className={`${
                          theme === 'light' ? 'text-slate-400' : 'text-slate-300'
                        } text-sm font-medium`}>{formatTime(record.time)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={startGame}
                className={`w-full py-3 px-4 rounded-xl font-medium transition-all transform hover:scale-105 active:scale-95 ${
                  theme === 'light'
                    ? 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                } shadow-lg`}
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'won' && (
        <div className={`absolute inset-0 flex items-center justify-center bg-opacity-50 z-10 rounded-lg ${theme==='light'?'bg-gray-200':'bg-gray-800'} `}>
          <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-6 rounded-lg shadow-lg text-center transition-colors max-h-96 overflow-y-auto w-full`}>
            <h2 className={`text-2xl font-bold font-play mb-2 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>You Won!</h2>
            <p className={`mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Your score: {score} - Time: {formatTime(time)}</p>

            <div className="mb-4">
              <h3 className={`text-lg font-bold font-play mb-2 flex items-center justify-center ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
                <Trophy size={18} className="mr-1" />
                <span>High Scores</span>
              </h3>

              <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'} rounded-lg p-2 max-h-32 overflow-y-auto`}>
                <table className="w-full">
                  <thead>
                    <tr className={`text-left ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      <th className="px-2 py-1">Rank</th>
                      <th className="px-2 py-1">Score</th>
                      <th className="px-2 py-1">Time</th>
                      <th className="px-2 py-1">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameRecords.map((record, index) => (
                      <tr
                        key={index}
                        className={`${record.isCurrent ? (theme === 'light' ? 'bg-yellow-100' : 'bg-yellow-900') : ''} ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}
                      >
                        <td className="px-2 py-1">{index + 1}</td>
                        <td className="px-2 py-1 font-play">{record.score}</td>
                        <td className="px-2 py-1 font-play">{formatTime(record.time)}</td>
                        <td className="px-2 py-1 text-xs">{record.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              onClick={startGame}
              className={`${theme === 'light' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded transition-colors`}
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {showContinueModal && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 rounded-lg">
          <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-6 rounded-lg shadow-lg text-center transition-colors`}>
            <h2 className={`text-2xl font-bold font-play mb-4 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>You reached 2048!</h2>
            <p className={`mb-6 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Would you like to continue playing?</p>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={continueGame}
                className={`${theme === 'light' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded transition-colors`}
              >
                Continue
              </button>
              <button
                onClick={finishGame}
                className={`${theme === 'light' ? 'bg-gray-500 hover:bg-gray-600' : 'bg-gray-600 hover:bg-gray-700'} text-white px-4 py-2 rounded transition-colors`}
              >
                End Game
              </button>
            </div>
          </div>
        </div>
      )}

      {showHowToPlayModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-30">
          <div className={`${
            theme === 'light' 
              ? 'bg-white/80 backdrop-blur-md' 
              : 'bg-gray-800/80 backdrop-blur-md'
          } p-6 rounded-2xl shadow-lg text-center transition-colors w-full max-w-md border ${
            theme === 'light' ? 'border-gray-200/50' : 'border-gray-700/50'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold font-play ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
                How to Play
              </h2>
              <button
                onClick={toggleHowToPlay}
                className={`${theme === 'light' ? 'text-gray-700 hover:bg-gray-200' : 'text-gray-300 hover:bg-gray-700'} p-1 rounded-full transition-colors`}
              >
                <X size={20} className='cursor-pointer' />
              </button>
            </div>

            <div className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} space-y-4 text-left`}>
              <p className="text-sm">Use your arrow keys to move the tiles. When two tiles with the same number touch, they merge into one!</p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Start with tiles showing 2 and 4</li>
                <li>Join matching numbers to add them together</li>
                <li>Plan your moves carefully to reach 2048</li>
                <li>Keep combining to aim for higher scores!</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {isPaused && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-30">
          <div className={`${
            theme === 'light' 
              ? 'bg-white/80 backdrop-blur-md' 
              : 'bg-gray-800/80 backdrop-blur-md'
          } p-6 rounded-2xl shadow-lg text-center transition-colors w-full max-w-md border ${
            theme === 'light' ? 'border-gray-200/50' : 'border-gray-700/50'
          }`}>
            <h2 className={`text-2xl font-bold font-play mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
              Game Paused
            </h2>
            <div className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} mb-6`}>
              <p className="mb-2">Current Score: {score}</p>
              <p>Time: {formatTime(time)}</p>
            </div>
            <button
              onClick={togglePause}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all transform hover:scale-105 active:scale-95 ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
              } text-white shadow-lg`}
            >
              Resume Game
            </button>
          </div>
        </div>
      )}

      {showHistoryModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-30">
          <div className={`${
            theme === 'light' 
              ? 'bg-white/80 backdrop-blur-md' 
              : 'bg-gray-800/80 backdrop-blur-md'
          } p-6 rounded-2xl shadow-lg text-center transition-colors max-h-96 overflow-y-auto w-full max-w-md border ${
            theme === 'light' ? 'border-gray-200/50' : 'border-gray-700/50'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold font-play flex items-center ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
                <Trophy size={20} className="mr-2 cursor-pointer" />
                <span>Score History</span>
              </h2>
              <button
                onClick={toggleHistoryModal}
                className={`${theme === 'light' ? 'text-gray-700 hover:bg-gray-200' : 'text-gray-300 hover:bg-gray-700'} p-1 rounded-full transition-colors`}
              >
                <X size={20} className='cursor-pointer' />
              </button>
            </div>

            {gameRecords.length > 0 ? (
              <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'} rounded-lg p-2 max-h-60 overflow-y-auto`}>
                <table className="w-full">
                  <thead>
                    <tr className={`text-left ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      <th className="px-2 py-1">Rank</th>
                      <th className="px-2 py-1">Score</th>
                      <th className="px-2 py-1">Time</th>
                      <th className="px-2 py-1">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameRecords.map((record, index) => (
                      <tr
                        key={index}
                        className={`${record.isCurrent ? (theme === 'light' ? 'bg-yellow-100' : 'bg-yellow-900') : ''} ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}
                      >
                        <td className="px-2 py-1">{index + 1}</td>
                        <td className="px-2 py-1 font-play">{record.score}</td>
                        <td className="px-2 py-1 font-play">{formatTime(record.time)}</td>
                        <td className="px-2 py-1 text-xs">{record.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className={`my-8 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                No games played yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Game2048;
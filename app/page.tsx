"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Play,
  Pause,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Palette,
  Home,
  Info,
  X,
  Github,
  Twitter,
  Mail,
  Star,
} from "lucide-react";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 26;

const TETROMINOES = {
  I: [[[1, 1, 1, 1]], [[1], [1], [1], [1]]],
  O: [
    [
      [1, 1],
      [1, 1],
    ],
  ],
  T: [
    [
      [0, 1, 0],
      [1, 1, 1],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 0],
    ],
    [
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [0, 1],
    ],
  ],
  S: [
    [
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 0],
      [1, 1],
      [0, 1],
    ],
  ],
  Z: [
    [
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1],
      [1, 1],
      [1, 0],
    ],
  ],
  J: [
    [
      [1, 0, 0],
      [1, 1, 1],
    ],
    [
      [1, 1],
      [1, 0],
      [1, 0],
    ],
    [
      [1, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
  ],
  L: [
    [
      [0, 0, 1],
      [1, 1, 1],
    ],
    [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    [
      [1, 1, 1],
      [1, 0, 0],
    ],
    [
      [1, 1],
      [0, 1],
      [0, 1],
    ],
  ],
};

const PIECE_TYPES = Object.keys(TETROMINOES);

const THEMES = {
  rainbow: {
    name: "Rainbow",
    colors: [
      "#FF3B30",
      "#FF9500",
      "#FFCC02",
      "#34C759",
      "#007AFF",
      "#5856D6",
      "#AF52DE",
    ],
    background: "from-purple-600 via-pink-600 to-blue-700",
    boardBg: "bg-white/20 backdrop-blur-xl",
    textColor: "text-white",
    headerBg: "bg-white/15 backdrop-blur-xl",
    buttonBg: "bg-white/20 hover:bg-white/30 backdrop-blur-lg",
    blockStyle: "rounded-lg shadow-xl border-2 border-white/40",
    accent: "from-purple-500 to-pink-500",
    modalBg: "bg-white/10 backdrop-blur-2xl border border-white/30",
  },
  ocean: {
    name: "Ocean",
    colors: [
      "#1e3a8a",
      "#1e40af",
      "#2563eb",
      "#3b82f6",
      "#60a5fa",
      "#93c5fd",
      "#dbeafe",
    ],
    background: "from-blue-700 via-cyan-600 to-teal-700",
    boardBg: "bg-white/25 backdrop-blur-xl",
    textColor: "text-white",
    headerBg: "bg-white/15 backdrop-blur-xl",
    buttonBg: "bg-white/20 hover:bg-white/30 backdrop-blur-lg",
    blockStyle: "rounded-full shadow-lg border-2 border-white/50",
    accent: "from-blue-500 to-cyan-500",
    modalBg: "bg-white/10 backdrop-blur-2xl border border-white/30",
  },
  forest: {
    name: "Forest",
    colors: [
      "#14532d",
      "#166534",
      "#15803d",
      "#16a34a",
      "#22c55e",
      "#4ade80",
      "#86efac",
    ],
    background: "from-green-700 via-emerald-600 to-teal-700",
    boardBg: "bg-white/20 backdrop-blur-xl",
    textColor: "text-white",
    headerBg: "bg-white/15 backdrop-blur-xl",
    buttonBg: "bg-white/20 hover:bg-white/30 backdrop-blur-lg",
    blockStyle: "rounded-md shadow-xl border-l-4 border-white/60",
    accent: "from-green-500 to-emerald-500",
    modalBg: "bg-white/10 backdrop-blur-2xl border border-white/30",
  },
  sunset: {
    name: "Sunset",
    colors: [
      "#7f1d1d",
      "#dc2626",
      "#ea580c",
      "#f97316",
      "#fb923c",
      "#fed7aa",
      "#fff7ed",
    ],
    background: "from-red-600 via-orange-600 to-yellow-600",
    boardBg: "bg-black/15 backdrop-blur-xl",
    textColor: "text-white",
    headerBg: "bg-black/10 backdrop-blur-xl",
    buttonBg: "bg-black/15 hover:bg-black/25 backdrop-blur-lg",
    blockStyle: "rounded-lg shadow-2xl border-2 border-yellow-200/80",
    accent: "from-red-500 to-orange-500",
    modalBg: "bg-black/10 backdrop-blur-2xl border border-white/20",
  },
};

interface GamePiece {
  type: string;
  x: number;
  y: number;
  rotation: number;
}

interface GameState {
  board: number[][];
  currentPiece: GamePiece | null;
  nextPiece: string;
  score: number;
  level: number;
  linesCleared: number;
  gameOver: boolean;
  paused: boolean;
  difficulty: "simple" | "medium" | "hard";
}

const BlockPuzzleGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(BOARD_HEIGHT)
      .fill(null)
      .map(() => Array(BOARD_WIDTH).fill(0)),
    currentPiece: null,
    nextPiece: PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)],
    score: 0,
    level: 1,
    linesCleared: 0,
    gameOver: false,
    paused: false,
    difficulty: "simple",
  });

  const [currentTheme, setCurrentTheme] =
    useState<keyof typeof THEMES>("rainbow");
  const [gameStarted, setGameStarted] = useState(false);
  const [clearingLines, setClearingLines] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const gameLoopRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const theme = THEMES[currentTheme];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const createNewPiece = useCallback((): GamePiece => {
    return {
      type: gameState.nextPiece,
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0,
      rotation: 0,
    };
  }, [gameState.nextPiece]);

  const getNextPieceType = useCallback(() => {
    return PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
  }, []);

  const getPieceShape = useCallback((piece: GamePiece) => {
    return TETROMINOES[piece.type as keyof typeof TETROMINOES][piece.rotation];
  }, []);

  const isValidPosition = useCallback(
    (piece: GamePiece, board: number[][]) => {
      const shape = getPieceShape(piece);

      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            const newX = piece.x + x;
            const newY = piece.y + y;

            if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
              return false;
            }

            if (newY >= 0 && board[newY][newX]) {
              return false;
            }
          }
        }
      }
      return true;
    },
    [getPieceShape]
  );

  const placePiece = useCallback(
    (piece: GamePiece, board: number[][]) => {
      const newBoard = board.map((row) => [...row]);
      const shape = getPieceShape(piece);
      const colorIndex = PIECE_TYPES.indexOf(piece.type) + 1;

      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            const boardY = piece.y + y;
            const boardX = piece.x + x;
            if (boardY >= 0) {
              newBoard[boardY][boardX] = colorIndex;
            }
          }
        }
      }

      return newBoard;
    },
    [getPieceShape]
  );

  const clearLines = useCallback((board: number[][]) => {
    const linesToClear: number[] = [];

    for (let y = 0; y < BOARD_HEIGHT; y++) {
      if (board[y].every((cell) => cell !== 0)) {
        linesToClear.push(y);
      }
    }

    if (linesToClear.length > 0) {
      setClearingLines(linesToClear);

      setTimeout(() => {
        setGameState((prev) => {
          const newBoard = prev.board.filter(
            (_, index) => !linesToClear.includes(index)
          );
          const emptyRows = Array(linesToClear.length)
            .fill(null)
            .map(() => Array(BOARD_WIDTH).fill(0));
          const finalBoard = [...emptyRows, ...newBoard];

          const linesCleared = prev.linesCleared + linesToClear.length;
          const newLevel = Math.floor(linesCleared / 10) + 1;
          const lineScore = linesToClear.length * 100 * newLevel;

          return {
            ...prev,
            board: finalBoard,
            score: prev.score + lineScore,
            level: newLevel,
            linesCleared,
          };
        });
        setClearingLines([]);
      }, 800);
    }

    return linesToClear.length;
  }, []);

  const getDropPreview = useCallback(
    (piece: GamePiece | null, board: number[][]) => {
      if (!piece) return null;

      let previewPiece = { ...piece };
      while (
        isValidPosition({ ...previewPiece, y: previewPiece.y + 1 }, board)
      ) {
        previewPiece.y++;
      }
      return previewPiece;
    },
    [isValidPosition]
  );

  const movePiece = useCallback(
    (dx: number, dy: number) => {
      if (gameState.gameOver || gameState.paused || !gameState.currentPiece)
        return;

      setGameState((prev) => {
        if (!prev.currentPiece) return prev;

        const newPiece = {
          ...prev.currentPiece,
          x: prev.currentPiece.x + dx,
          y: prev.currentPiece.y + dy,
        };

        if (isValidPosition(newPiece, prev.board)) {
          return { ...prev, currentPiece: newPiece };
        }

        if (dy > 0) {
          const newBoard = placePiece(prev.currentPiece, prev.board);
          const linesCleared = clearLines(newBoard);

          const nextPieceType = getNextPieceType();
          const newCurrentPiece = {
            type: prev.nextPiece,
            x: Math.floor(BOARD_WIDTH / 2) - 1,
            y: 0,
            rotation: 0,
          };

          if (!isValidPosition(newCurrentPiece, newBoard)) {
            return { ...prev, gameOver: true, board: newBoard };
          }

          return {
            ...prev,
            board: newBoard,
            currentPiece: newCurrentPiece,
            nextPiece: nextPieceType,
          };
        }

        return prev;
      });
    },
    [
      gameState.gameOver,
      gameState.paused,
      gameState.currentPiece,
      isValidPosition,
      placePiece,
      clearLines,
      getNextPieceType,
    ]
  );

  const rotatePiece = useCallback(() => {
    if (gameState.gameOver || gameState.paused || !gameState.currentPiece)
      return;

    setGameState((prev) => {
      if (!prev.currentPiece) return prev;

      const currentRotations =
        TETROMINOES[prev.currentPiece.type as keyof typeof TETROMINOES];
      const newRotation =
        (prev.currentPiece.rotation + 1) % currentRotations.length;
      const newPiece = { ...prev.currentPiece, rotation: newRotation };

      if (isValidPosition(newPiece, prev.board)) {
        return { ...prev, currentPiece: newPiece };
      }
      return prev;
    });
  }, [
    gameState.gameOver,
    gameState.paused,
    gameState.currentPiece,
    isValidPosition,
  ]);

  const startGame = useCallback(() => {
    const newPiece = createNewPiece();
    setGameState((prev) => ({
      ...prev,
      board: Array(BOARD_HEIGHT)
        .fill(null)
        .map(() => Array(BOARD_WIDTH).fill(0)),
      currentPiece: newPiece,
      nextPiece: getNextPieceType(),
      score: 0,
      level: 1,
      linesCleared: 0,
      gameOver: false,
      paused: false,
    }));
    setGameStarted(true);
  }, [createNewPiece, getNextPieceType]);

  const togglePause = useCallback(() => {
    if (!gameStarted || gameState.gameOver) return;
    setGameState((prev) => ({ ...prev, paused: !prev.paused }));
  }, [gameStarted, gameState.gameOver]);

  const getDropSpeed = useCallback(() => {
    const baseSpeed =
      gameState.difficulty === "simple"
        ? 1000
        : gameState.difficulty === "medium"
        ? 800
        : 600;
    return Math.max(100, baseSpeed - gameState.level * 50);
  }, [gameState.difficulty, gameState.level]);

  // game loop
  useEffect(() => {
    if (!gameStarted || gameState.paused || gameState.gameOver) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      return;
    }

    gameLoopRef.current = setInterval(() => {
      movePiece(0, 1);
    }, getDropSpeed());

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [
    gameStarted,
    gameState.paused,
    gameState.gameOver,
    getDropSpeed,
    movePiece,
  ]);

  // keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || gameState.gameOver) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          if (!gameState.paused) movePiece(-1, 0);
          break;
        case "ArrowRight":
          e.preventDefault();
          if (!gameState.paused) movePiece(1, 0);
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!gameState.paused) movePiece(0, 1);
          break;
        case "ArrowUp":
        case " ":
          e.preventDefault();
          if (!gameState.paused) rotatePiece();
          break;
        case "p":
        case "P":
          e.preventDefault();
          togglePause();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    gameStarted,
    gameState.paused,
    gameState.gameOver,
    movePiece,
    rotatePiece,
    togglePause,
  ]);

  const renderCell = (value: number, isPreview = false, isClearing = false) => {
    const colorIndex = value - 1;
    const color =
      value > 0
        ? theme.colors[colorIndex % theme.colors.length]
        : "transparent";
    const opacity = isPreview ? 0.4 : isClearing ? 0.8 : 1;

    return (
      <div
        className={`w-full h-full ${
          theme.blockStyle
        } transition-all duration-300 ${
          isClearing
            ? "animate-pulse scale-110 bg-gradient-to-r from-yellow-400 to-orange-400"
            : ""
        }`}
        style={{
          backgroundColor: isClearing ? undefined : color,
          opacity,
          transform: isClearing ? "scale(1.1)" : "scale(1)",
          background: isClearing
            ? "linear-gradient(45deg, #fbbf24, #f97316)"
            : color,
        }}
      />
    );
  };

  const renderBoard = () => {
    const displayBoard = gameState.board.map((row) => [...row]);

    if (gameState.currentPiece) {
      const shape = getPieceShape(gameState.currentPiece);
      const colorIndex = PIECE_TYPES.indexOf(gameState.currentPiece.type) + 1;

      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            const boardY = gameState.currentPiece.y + y;
            const boardX = gameState.currentPiece.x + x;
            if (
              boardY >= 0 &&
              boardY < BOARD_HEIGHT &&
              boardX >= 0 &&
              boardX < BOARD_WIDTH
            ) {
              displayBoard[boardY][boardX] = colorIndex;
            }
          }
        }
      }
    }

    const previewPiece = getDropPreview(
      gameState.currentPiece,
      gameState.board
    );
    const previewBoard = displayBoard.map((row) => [...row]);

    if (previewPiece && gameState.currentPiece) {
      const shape = getPieceShape(previewPiece);
      const colorIndex = PIECE_TYPES.indexOf(previewPiece.type) + 1;

      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            const boardY = previewPiece.y + y;
            const boardX = previewPiece.x + x;
            if (
              boardY >= 0 &&
              boardY < BOARD_HEIGHT &&
              boardX >= 0 &&
              boardX < BOARD_WIDTH
            ) {
              if (displayBoard[boardY][boardX] === 0) {
                previewBoard[boardY][boardX] = -colorIndex;
              }
            }
          }
        }
      }
    }

    return (
      <div className="relative">
        <div
          className={`grid gap-0.5 p-2 rounded-2xl ${theme.boardBg} border-2 border-white/40 mx-auto shadow-2xl`}
          style={{
            gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${BOARD_HEIGHT}, ${CELL_SIZE}px)`,
            width: `${BOARD_WIDTH * CELL_SIZE + BOARD_WIDTH * 2 + 16}px`,
            height: `${BOARD_HEIGHT * CELL_SIZE + BOARD_HEIGHT * 2 + 16}px`,
          }}
        >
          {previewBoard.map((row, y) =>
            row.map((cell, x) => (
              <div key={`${y}-${x}`} className="relative">
                {renderCell(
                  Math.abs(cell),
                  cell < 0,
                  clearingLines.includes(y)
                )}
              </div>
            ))
          )}
        </div>

        {/* Pause/Game Modal */}
        {(gameState.paused || gameState.gameOver) && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl backdrop-blur-md">
            <div
              className={`p-6 rounded-3xl ${theme.modalBg} text-center max-w-sm mx-4 shadow-2xl ${theme.textColor}`}
            >
              <div className="text-5xl mb-4 animate-bounce">
                {gameState.gameOver ? "💥" : "⏸️"}
              </div>
              <h2 className="text-2xl font-bold mb-4">
                {gameState.gameOver ? "Game Over!" : "Game Paused"}
              </h2>
              {gameState.gameOver ? (
                <div className="space-y-3">
                  <div className={`p-3 ${theme.buttonBg} rounded-2xl`}>
                    <p className="text-sm mb-1">🏆 Final Score</p>
                    <p className="text-2xl font-bold">
                      {gameState.score.toLocaleString()}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`p-2 ${theme.buttonBg} rounded-xl`}>
                      <p className="text-xs">Level</p>
                      <p className="text-lg font-bold">{gameState.level}</p>
                    </div>
                    <div className={`p-2 ${theme.buttonBg} rounded-xl`}>
                      <p className="text-xs">Lines</p>
                      <p className="text-lg font-bold">
                        {gameState.linesCleared}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={startGame}
                      className={`flex-1 px-4 py-2 ${theme.buttonBg} rounded-2xl font-bold transition-all duration-200 cursor-pointer hover:scale-105`}
                    >
                      <Play className="w-4 h-4 inline mr-1" />
                      Again
                    </button>
                    <button
                      onClick={() => setGameStarted(false)}
                      className={`flex-1 px-4 py-2 ${theme.buttonBg} rounded-2xl font-bold transition-all duration-200 cursor-pointer hover:scale-105`}
                    >
                      <Home className="w-4 h-4 inline mr-1" />
                      Menu
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm opacity-90">Ready to continue?</p>
                  <button
                    onClick={togglePause}
                    className={`px-6 py-3 ${theme.buttonBg} rounded-2xl font-bold transition-all duration-200 cursor-pointer hover:scale-105`}
                  >
                    <Play className="w-5 h-5 inline mr-2" />
                    Resume Game
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderNextPiece = () => {
    const shape =
      TETROMINOES[gameState.nextPiece as keyof typeof TETROMINOES][0];
    const colorIndex = PIECE_TYPES.indexOf(gameState.nextPiece) + 1;
    const color = theme.colors[colorIndex % theme.colors.length];

    return (
      <div
        className={`grid gap-0.5 p-2 ${theme.buttonBg} rounded-xl shadow-lg`}
      >
        {shape.map((row, y) => (
          <div key={y} className="flex gap-0.5">
            {row.map((cell, x) => (
              <div
                key={x}
                className={`w-4 h-4 ${theme.blockStyle}`}
                style={{
                  backgroundColor: cell ? color : "transparent",
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  // About Modal
  const AboutModal = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div
        className={`${theme.modalBg} rounded-3xl p-6 max-w-lg w-full shadow-2xl ${theme.textColor}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">About Block Builder</h2>
          <button
            onClick={() => setShowAbout(false)}
            className={`p-2 ${theme.buttonBg} rounded-full transition-colors cursor-pointer hover:scale-110`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3 text-sm">
          <p>
            🧩 <strong>Block Builder</strong> is a modern block-stacking puzzle
            game!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className={`p-3 ${theme.buttonBg} rounded-2xl`}>
              <h3 className="font-bold mb-2">🎮 Features</h3>
              <ul className="text-xs space-y-0.5">
                <li>• 4 Beautiful themes</li>
                <li>• 3 Difficulty levels</li>
                <li>• Smooth animations</li>
                <li>• Mobile & desktop support</li>
              </ul>
            </div>
            <div className={`p-3 ${theme.buttonBg} rounded-2xl`}>
              <h3 className="font-bold mb-2">🎯 How to Play</h3>
              <ul className="text-xs space-y-0.5">
                <li>• Use arrows to move blocks</li>
                <li>• Space/Up to rotate</li>
                <li>• Fill horizontal lines to clear</li>
                <li>• Level up every 10 lines!</li>
              </ul>
            </div>
          </div>
          <div className={`p-3 ${theme.buttonBg} rounded-2xl`}>
            <h3 className="font-bold mb-2">🏆 Scoring</h3>
            <p className="text-xs">
              Each cleared line = 100 × Current Level points. Clear multiple
              lines for bonus!
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (!gameStarted) {
    return (
      <div
        className={`h-screen bg-gradient-to-br ${theme.background} relative overflow-hidden flex flex-col`}
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-16 h-16 bg-white/10 rounded-full animate-bounce"></div>
          <div className="absolute top-32 right-16 w-12 h-12 bg-white/10 rounded-lg animate-pulse"></div>
          <div className="absolute bottom-16 left-16 w-10 h-10 bg-white/10 rounded-full animate-ping"></div>
          <div className="absolute bottom-32 right-8 w-20 h-20 bg-white/10 rounded-lg animate-bounce delay-300"></div>
        </div>

        {/* mobile header */}
        {isMobile && (
          <header className={`${theme.headerBg} p-3 relative z-10`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-xl">🧩</div>
                <h1 className={`text-lg font-bold ${theme.textColor}`}>
                  Block Builder
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowAbout(true)}
                  className={`p-2 rounded-lg ${theme.buttonBg} ${theme.textColor} transition-all cursor-pointer`}
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>
        )}

        {/* desktop header */}
        {!isMobile && (
          <header className={`${theme.headerBg} p-4 relative z-10`}>
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🧩</div>
                <div>
                  <h1 className={`text-xl font-bold ${theme.textColor}`}>
                    Block Builder
                  </h1>
                  <p className={`text-xs ${theme.textColor} opacity-80`}>
                    Modern Puzzle Experience
                  </p>
                </div>
              </div>
              <nav className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAbout(true)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl ${theme.buttonBg} ${theme.textColor} transition-all cursor-pointer hover:scale-105`}
                >
                  <Info className="w-4 h-4" />
                  About
                </button>
              </nav>
            </div>
          </header>
        )}

        <div className="flex-1 relative z-10 max-w-6xl mx-auto p-4 flex flex-col justify-center">
          {/* hero section */}
          <div className={`text-center mb-6 ${theme.textColor}`}>
            <h1 className="text-4xl md:text-6xl font-bold mb-2 drop-shadow-2xl animate-bounce">
              🧩 Block Builder 🧩
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-4">
              The Ultimate Block Stacking Experience
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-300" />
                <span>Multiple Themes</span>
              </div>
              <div className="flex items-center gap-1">
                <Play className="w-4 h-4 text-green-300" />
                <span>Smooth Gameplay</span>
              </div>
              <div className="flex items-center gap-1">
                <Palette className="w-4 h-4 text-purple-300" />
                <span>Beautiful Design</span>
              </div>
            </div>
          </div>

          {/* difficulty selection */}
          <div className="text-center mb-6">
            <h2 className={`text-2xl font-bold mb-4 ${theme.textColor}`}>
              Choose Your Challenge
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {(["simple", "medium", "hard"] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() =>
                    setGameState((prev) => ({ ...prev, difficulty }))
                  }
                  className={`group p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                    gameState.difficulty === difficulty
                      ? "border-white bg-white/25 shadow-xl scale-105"
                      : "border-white/50 bg-white/10 hover:bg-white/20"
                  } ${theme.textColor}`}
                >
                  <div className="text-3xl mb-2 group-hover:animate-bounce">
                    {difficulty === "simple"
                      ? "🐢"
                      : difficulty === "medium"
                      ? "🐰"
                      : "🚀"}
                  </div>
                  <div className="font-bold text-lg capitalize">
                    {difficulty}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* theme selection */}
          <div className="text-center mb-6">
            <h2 className={`text-2xl font-bold mb-4 ${theme.textColor}`}>
              Pick Your Style
            </h2>
            <div className="grid grid-cols-4 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {Object.entries(THEMES).map(([key, themeData]) => (
                <button
                  key={key}
                  onClick={() => setCurrentTheme(key as keyof typeof THEMES)}
                  className={`group p-3 rounded-2xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                    currentTheme === key
                      ? "border-white bg-white/25 shadow-xl scale-105"
                      : "border-white/50 bg-white/10 hover:bg-white/20"
                  } ${theme.textColor}`}
                >
                  <div
                    className={`w-full h-12 rounded-lg bg-gradient-to-r ${themeData.accent} mb-2 group-hover:animate-pulse`}
                  ></div>
                  <div className="font-bold text-sm">{themeData.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* start game */}
          <div className="text-center">
            <button
              onClick={startGame}
              className={`group px-8 py-4 ${theme.buttonBg} rounded-3xl font-bold text-2xl ${theme.textColor} border-2 border-white/50 transition-all duration-300 hover:scale-110 shadow-2xl cursor-pointer`}
            >
              <Play className="w-8 h-8 inline mr-2 group-hover:animate-bounce" />
              Start Playing!
            </button>
          </div>
        </div>

        {showAbout && <AboutModal />}
      </div>
    );
  }

  return (
    <div
      className={`h-screen bg-gradient-to-br ${theme.background} flex flex-col`}
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* mobile header */}
      {isMobile && (
        <div className={`${theme.headerBg} p-3 ${theme.textColor}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setGameStarted(false)}
                className={`p-2 rounded-lg ${theme.buttonBg} transition-colors cursor-pointer`}
              >
                <Home className="w-4 h-4" />
              </button>
              <div className="text-sm">
                <div className="font-bold">
                  Score: {gameState.score.toLocaleString()}
                </div>
                <div className="text-xs">
                  Level: {gameState.level} | Lines: {gameState.linesCleared}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={togglePause}
                className={`p-2 rounded-lg ${theme.buttonBg} transition-colors cursor-pointer`}
              >
                {gameState.paused ? (
                  <Play className="w-4 h-4" />
                ) : (
                  <Pause className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => setShowAbout(true)}
                className={`p-2 rounded-xl ${theme.buttonBg} ${theme.textColor} transition-all cursor-pointer hover:scale-105`}
              >
                <Info className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGameStarted(false)}
                className={`p-2 rounded-xl ${theme.buttonBg} ${theme.textColor} transition-all cursor-pointer hover:scale-105`}
              >
                <Home className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <div className="text-center">
              <div className="text-xs mb-1">Next:</div>
              {renderNextPiece()}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 p-3 overflow-hidden">
        {isMobile ? (
          /* mobile layout */
          <div className="h-full flex flex-col space-y-3">
            <div className="flex-1 flex items-center justify-center">
              {renderBoard()}
            </div>

            <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
              <button
                onTouchStart={(e) => {
                  e.preventDefault();
                  if (!gameState.paused) movePiece(-1, 0);
                }}
                className={`p-3 rounded-xl ${theme.buttonBg} border border-white/30 ${theme.textColor} active:bg-white/50 transition-colors cursor-pointer`}
              >
                <ChevronLeft className="w-5 h-5 mx-auto" />
              </button>
              <button
                onTouchStart={(e) => {
                  e.preventDefault();
                  if (!gameState.paused) rotatePiece();
                }}
                className={`p-3 rounded-xl ${theme.buttonBg} border border-white/30 ${theme.textColor} active:bg-white/50 transition-colors cursor-pointer`}
              >
                <RotateCw className="w-5 h-5 mx-auto" />
              </button>
              <button
                onTouchStart={(e) => {
                  e.preventDefault();
                  if (!gameState.paused) movePiece(1, 0);
                }}
                className={`p-3 rounded-xl ${theme.buttonBg} border border-white/30 ${theme.textColor} active:bg-white/50 transition-colors cursor-pointer`}
              >
                <ChevronRight className="w-5 h-5 mx-auto" />
              </button>
              <button
                onTouchStart={(e) => {
                  e.preventDefault();
                  if (!gameState.paused) movePiece(0, 1);
                }}
                className={`col-span-3 p-3 rounded-xl ${theme.buttonBg} border border-white/30 ${theme.textColor} active:bg-white/50 transition-colors cursor-pointer`}
              >
                <ChevronDown className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm">Drop Faster</span>
              </button>
            </div>
          </div>
        ) : (
          /* desktop layout */
          <div className="h-full max-w-7xl mx-auto">
            <header
              className={`${theme.headerBg} rounded-2xl p-3 mb-3 shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-xl">🧩</div>
                  <h1 className={`text-lg font-bold ${theme.textColor}`}>
                    Block Builder
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`${theme.textColor} text-center`}>
                    <div className="text-xs">Score</div>
                    <div className="text-lg font-bold">
                      {gameState.score.toLocaleString()}
                    </div>
                  </div>
                  <div className={`${theme.textColor} text-center`}>
                    <div className="text-xs">Level</div>
                    <div className="text-lg font-bold">{gameState.level}</div>
                  </div>
                  <div className={`${theme.textColor} text-center`}>
                    <div className="text-xs">Lines</div>
                    <div className="text-lg font-bold">
                      {gameState.linesCleared}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={togglePause}
                      className={`p-2 rounded-xl ${theme.buttonBg} ${theme.textColor} transition-all cursor-pointer hover:scale-105`}
                    >
                      {gameState.paused ? (
                        <Play className="w-4 h-4" />
                      ) : (
                        <Pause className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => setShowAbout(true)}
                      className={`p-2 rounded-xl ${theme.buttonBg} ${theme.textColor} transition-all cursor-pointer hover:scale-105`}
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setGameStarted(false)}
                      className={`p-2 rounded-xl ${theme.buttonBg} ${theme.textColor} transition-all cursor-pointer hover:scale-105`}
                    >
                      <Home className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-5 gap-4 h-[calc(100vh-140px)]">
              <div className="space-y-3">
                <div
                  className={`p-4 rounded-2xl ${theme.headerBg} ${theme.textColor} shadow-xl`}
                >
                  <h3 className="text-lg font-bold mb-3 text-center">
                    ⏭️ Next
                  </h3>
                  <div className="flex justify-center">{renderNextPiece()}</div>
                </div>

                <div
                  className={`p-4 rounded-2xl ${theme.headerBg} ${theme.textColor} shadow-xl`}
                >
                  <h3 className="text-lg font-bold mb-3">🎮 Controls</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-white/20 rounded text-xs">
                        ←→
                      </kbd>
                      <span>Move</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-white/20 rounded text-xs">
                        ↓
                      </kbd>
                      <span>Drop</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-white/20 rounded text-xs">
                        ↑
                      </kbd>
                      <span>Rotate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 bg-white/20 rounded text-xs">
                        P
                      </kbd>
                      <span>Pause</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-3 flex items-center justify-center">
                {renderBoard()}
              </div>

              <div className="space-y-3">
                <div
                  className={`p-4 rounded-2xl ${theme.headerBg} ${theme.textColor} shadow-xl`}
                >
                  <h3 className="text-lg font-bold mb-3">📊 Stats</h3>
                  <div className="space-y-3">
                    <div
                      className={`p-2 ${theme.buttonBg} rounded-xl text-center`}
                    >
                      <div className="text-xs">Score</div>
                      <div className="text-lg font-bold">
                        {gameState.score.toLocaleString()}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        className={`p-2 ${theme.buttonBg} rounded-xl text-center`}
                      >
                        <div className="text-xs">Level</div>
                        <div className="text-sm font-bold">
                          {gameState.level}
                        </div>
                      </div>
                      <div
                        className={`p-2 ${theme.buttonBg} rounded-xl text-center`}
                      >
                        <div className="text-xs">Lines</div>
                        <div className="text-sm font-bold">
                          {gameState.linesCleared}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`p-2 ${theme.buttonBg} rounded-xl text-center`}
                    >
                      <div className="text-xs">Mode</div>
                      <div className="text-sm font-bold capitalize">
                        {gameState.difficulty}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showAbout && <AboutModal />}
    </div>
  );
};

export default BlockPuzzleGame;
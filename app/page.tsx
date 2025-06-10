"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, CheckCircle, HelpCircle, Edit3, Trophy, Zap, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import confetti from 'canvas-confetti'; // Added Trophy and Zap icons

// --- Types ---
type Board = (number | null)[][];
type Cell = { row: number; col: number };
type Difficulty = "easy" | "medium" | "hard"; // Added Difficulty type

// --- Sudoku Logic ---
const EMPTY_CELL = 0; // Using 0 for empty cells internally for easier logic

// Puzzles organized by difficulty
const puzzlesByDifficulty: Record<Difficulty, Board[]> = {
  easy: [
    [
      [0, 0, 0, 2, 6, 0, 7, 0, 1],
      [6, 8, 0, 0, 7, 0, 0, 9, 0],
      [1, 9, 0, 0, 0, 4, 5, 0, 0],
      [8, 2, 0, 1, 0, 0, 0, 4, 0],
      [0, 0, 4, 6, 0, 2, 9, 0, 0],
      [0, 5, 0, 0, 0, 3, 0, 2, 8],
      [0, 0, 9, 3, 0, 0, 0, 7, 4],
      [0, 4, 0, 0, 5, 0, 0, 3, 6],
      [7, 0, 3, 0, 1, 8, 0, 0, 0],
    ],
    // Add more easy puzzles if desired
  ],
  medium: [ // Original samplePuzzles are now under 'medium'
    [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ],
    [
      [0, 0, 3, 0, 2, 0, 6, 0, 0],
      [9, 0, 0, 3, 0, 5, 0, 0, 1],
      [0, 0, 1, 8, 0, 6, 4, 0, 0],
      [0, 0, 8, 1, 0, 2, 9, 0, 0],
      [7, 0, 0, 0, 0, 0, 0, 0, 8],
      [0, 0, 6, 7, 0, 8, 2, 0, 0],
      [0, 0, 2, 6, 0, 9, 5, 0, 0],
      [8, 0, 0, 2, 0, 3, 0, 0, 9],
      [0, 0, 5, 0, 1, 0, 3, 0, 0],
    ],
    [
      [1, 0, 0, 4, 8, 9, 0, 0, 6],
      [7, 3, 0, 0, 0, 0, 0, 4, 0],
      [0, 0, 0, 0, 0, 1, 2, 9, 5],
      [0, 0, 7, 1, 2, 0, 6, 0, 0],
      [5, 0, 0, 7, 0, 3, 0, 0, 8],
      [0, 0, 6, 0, 9, 5, 7, 0, 0],
      [9, 1, 4, 6, 0, 0, 0, 0, 0],
      [0, 2, 0, 0, 0, 0, 0, 3, 7],
      [8, 0, 0, 5, 1, 2, 0, 0, 4],
    ],
  ],
  hard: [
    [ // Example of a harder puzzle
      [8, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 3, 6, 0, 0, 0, 0, 0],
      [0, 7, 0, 0, 9, 0, 2, 0, 0],
      [0, 5, 0, 0, 0, 7, 0, 0, 0],
      [0, 0, 0, 0, 4, 5, 7, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 3, 0],
      [0, 0, 1, 0, 0, 0, 0, 6, 8],
      [0, 0, 8, 5, 0, 0, 0, 1, 0],
      [0, 9, 0, 0, 0, 0, 4, 0, 0],
    ],
    // Add more hard puzzles if desired
  ],
};

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];


const copyBoard = (board: Board): Board => board.map(row => [...row]);

const isValid = (board: Board, row: number, col: number, num: number): boolean => {
  if (num === EMPTY_CELL) return true; // Allowing to clear a cell

  // Check row
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num && c !== col) return false;
  }
  // Check column
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num && r !== row) return false;
  }
  // Check 3x3 subgrid
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[startRow + r][startCol + c] === num && (startRow + r !== row || startCol + c !== col)) {
        return false;
      }
    }
  }
  return true;
};

const findEmpty = (board: Board): Cell | null => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === EMPTY_CELL) return { row: r, col: c };
    }
  }
  return null;
};

const solveSudoku = (board: Board): Board | null => {
  const boardCopy = copyBoard(board);

  function solve(): boolean {
    const emptyCell = findEmpty(boardCopy);
    if (!emptyCell) return true; // Solved

    const { row, col } = emptyCell;
    for (let num = 1; num <= 9; num++) {
      if (isValid(boardCopy, row, col, num)) {
        boardCopy[row][col] = num;
        if (solve()) return true;
        boardCopy[row][col] = EMPTY_CELL; // Backtrack
      }
    }
    return false;
  }

  if (solve()) return boardCopy;
  return null; // No solution
};

const checkSolution = (currentBoard: Board): { isSolved: boolean; errors: Cell[] } => {
  const errors: Cell[] = [];
  let isFull = true;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = currentBoard[r][c];
      if (val === EMPTY_CELL) {
        isFull = false; // Not full, so not solved yet
      } else if (!isValid(currentBoard, r, c, val as number)) {
        errors.push({ row: r, col: c });
      }
    }
  }
  return { isSolved: isFull && errors.length === 0, errors };
};


// --- React Component ---
const Index: React.FC = () => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [initialBoard, setInitialBoard] = useState<Board>(() => copyBoard(puzzlesByDifficulty['medium'][0]));
  const [currentBoard, setCurrentBoard] = useState<Board>(() => copyBoard(puzzlesByDifficulty['medium'][0]));
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [errors, setErrors] = useState<Cell[]>([]);
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  // Celebration function for when puzzle is solved
  const triggerCelebration = useCallback(() => {
    // Multiple confetti bursts with different colors and patterns
    const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
    
    // First burst - from center
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors
    });

    // Second burst - from left
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: colors
      });
    }, 250);

    // Third burst - from right
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: colors
      });
    }, 500);

    // Final burst - stars from top
    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 360,
        startVelocity: 30,
        decay: 0.9,
        scalar: 1.2,
        shapes: ['star'],
        colors: ['#FFD700', '#FFA500', '#FF6347'],
        origin: { y: 0.2 }
      });
    }, 750);
  }, []);

  // Renamed and updated startNewGame to handle difficulties
  const startNewGameWithDifficulty = useCallback((difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    const puzzlesForDifficulty = puzzlesByDifficulty[difficulty];
    const newPuzzleIndex = Math.floor(Math.random() * puzzlesForDifficulty.length);
    const newPuzzle = copyBoard(puzzlesForDifficulty[newPuzzleIndex]);
    
    setInitialBoard(newPuzzle);
    setCurrentBoard(copyBoard(newPuzzle));
    setSelectedCell(null);
    setErrors([]);
    toast.success(`New ${difficulty} game started!`, {
      icon: '🎮',
      duration: 3000,
    });
    
    // Show keyboard shortcuts tip after a delay
    setTimeout(() => {
      toast.success('💡 Tip: Use keyboard numbers (1-9) and arrow keys for faster play!', {
        icon: '⌨️',
        duration: 4000,
      });
    }, 2000);
    setIsSolved(false);
    setHighlightedNumber(null);
    setGameStarted(true);
  }, []);

  const handleNewGame = () => {
    setGameStarted(false);
    setSelectedCell(null);
    setErrors([]);
    setIsSolved(false);
    setHighlightedNumber(null);
  };

  const toggleInfoModal = () => {
    setShowInfoModal(!showInfoModal);
  };

  useEffect(() => {
    if (showInfoModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showInfoModal]);

  // Keyboard navigation and input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle keyboard if modal is open or game not started
      if (showInfoModal || !gameStarted) return;

      const key = event.key;
      
      // Number input (1-9)
      if (/^[1-9]$/.test(key)) {
        event.preventDefault();
        const num = parseInt(key);
        handleNumberInput(num);
        return;
      }
      
      // Clear cell (Backspace, Delete, or 0)
      if (key === 'Backspace' || key === 'Delete' || key === '0') {
        event.preventDefault();
        handleNumberInput(null);
        return;
      }
      
      // Arrow key navigation
      if (selectedCell && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        event.preventDefault();
        const { row, col } = selectedCell;
        let newRow = row;
        let newCol = col;
        
        switch (key) {
          case 'ArrowUp':
            newRow = Math.max(0, row - 1);
            break;
          case 'ArrowDown':
            newRow = Math.min(8, row + 1);
            break;
          case 'ArrowLeft':
            newCol = Math.max(0, col - 1);
            break;
          case 'ArrowRight':
            newCol = Math.min(8, col + 1);
            break;
        }
        
        // Move to the new cell
        setSelectedCell({ row: newRow, col: newCol });
        setHighlightedNumber(currentBoard[newRow][newCol] === EMPTY_CELL ? null : currentBoard[newRow][newCol]);
        return;
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
     }, [selectedCell, showInfoModal, gameStarted, currentBoard]);



  const handleCellClick = (row: number, col: number) => {
    if (initialBoard[row][col] !== EMPTY_CELL) { 
      setSelectedCell(null); 
      setHighlightedNumber(currentBoard[row][col]);
      return;
    }
    setSelectedCell({ row, col });
    setHighlightedNumber(currentBoard[row][col] === EMPTY_CELL ? null : currentBoard[row][col]);
  };

  const handleNumberInput = (num: number | null) => {
    if (!selectedCell || initialBoard[selectedCell.row][selectedCell.col] !== EMPTY_CELL) return;

    const { row, col } = selectedCell;
    const newBoard = copyBoard(currentBoard);
    const valToSet = num === null ? EMPTY_CELL : num;
    newBoard[row][col] = valToSet;
    setCurrentBoard(newBoard);

    const cellIsValid = isValid(newBoard, row, col, valToSet);
    const currentErrors = errors.filter(e => !(e.row === row && e.col === col));
    if (!cellIsValid && valToSet !== EMPTY_CELL) {
      setErrors([...currentErrors, { row, col }]);
    } else {
      setErrors(currentErrors);
    }
    setHighlightedNumber(valToSet === EMPTY_CELL ? null : valToSet);
    
    if (valToSet !== EMPTY_CELL && cellIsValid) {
        const solutionCheck = checkSolution(newBoard);
        if (solutionCheck.isSolved) {
            toast.success("🎉 Congratulations! Puzzle Solved! 🎉", {
              icon: '🏆',
              duration: 5000,
            });
            setIsSolved(true);
            setErrors([]);
            // Trigger celebration confetti
            setTimeout(() => triggerCelebration(), 500);
        } else {
            setIsSolved(false);
        }
    } else if (valToSet === EMPTY_CELL) { 
        setIsSolved(false);
    }
  };
  
  const handleReset = () => {
    setCurrentBoard(copyBoard(initialBoard));
    setSelectedCell(null);
    setErrors([]);
    toast.success('Board reset to initial state.', {
      icon: '🔄',
      duration: 2000,
    });
    setIsSolved(false);
    setHighlightedNumber(null);
  };

  const handleCheck = () => {
    const { isSolved: solved, errors: validationErrors } = checkSolution(currentBoard);
    setErrors(validationErrors);
    if (solved) {
      toast.success("🎉 Congratulations! Puzzle Solved! 🎉", {
        icon: '🏆',
        duration: 5000,
      });
      setIsSolved(true);
      // Trigger celebration confetti
      setTimeout(() => triggerCelebration(), 500);
    } else if (validationErrors.length > 0) {
      toast.error(`Found ${validationErrors.length} error(s). Keep trying!`, {
        icon: '❌',
        duration: 3000,
      });
      setIsSolved(false);
    } else {
      const isEmpty = findEmpty(currentBoard);
      if (isEmpty) {
        toast.success("Board is valid so far, but not complete yet.", {
          icon: '✅',
          duration: 2000,
        });
      } else {
        toast.error("Board is full and valid, but checkSolution didn't mark as solved.", {
          icon: '⚠️',
          duration: 3000,
        });
      }
      setIsSolved(false);
    }
  };

  const handleHint = () => {
    if (isSolved) {
      toast.error("Puzzle is already solved!", {
        icon: '🏆',
        duration: 2000,
      });
      return;
    }
    const emptyCell = findEmpty(currentBoard);
    if (!emptyCell) {
      toast.error("No empty cells left for a hint.", {
        icon: '🚫',
        duration: 2000,
      });
      return;
    }

    const solution = solveSudoku(currentBoard);
    if (solution) {
      let hintApplied = false;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (currentBoard[r][c] === EMPTY_CELL && solution[r][c] !== EMPTY_CELL) {
            const newBoard = copyBoard(currentBoard);
            newBoard[r][c] = solution[r][c];
            setCurrentBoard(newBoard);
            setSelectedCell({ row: r, col: c }); 
            setHighlightedNumber(solution[r][c]);
            
            setErrors(prevErrors => prevErrors.filter(e => !(e.row === r && e.col === c)));
            
            toast.success(`💡 Hint applied for cell (${r + 1}, ${c + 1}).`, {
              icon: '💡',
              duration: 3000,
            });
            hintApplied = true;

            const solutionCheck = checkSolution(newBoard);
            if (solutionCheck.isSolved) {
                toast.success("🎉 Congratulations! Puzzle Solved with a hint! 🎉", {
                  icon: '🏆',
                  duration: 5000,
                });
                setIsSolved(true);
                // Trigger celebration confetti
                setTimeout(() => triggerCelebration(), 500);
            }
            break;
          }
        }
        if (hintApplied) break;
      }
      if (!hintApplied) {
         toast.error("Could not find a simple hint. Try checking your existing numbers.", {
           icon: '🤔',
           duration: 3000,
         });
      }
    } else {
      toast.error("Could not find a hint. The puzzle might be in an unsolvable state.", {
        icon: '⚠️',
        duration: 3000,
      });
    }
  };

  const getCellClasses = (row: number, col: number, val: number | null): string => {
    let classes = "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 ";
    
    // Calculate 3x3 box position for alternating background
    const boxRow = Math.floor(row / 3);
    const boxCol = Math.floor(col / 3);
    const isAlternateBox = (boxRow + boxCol) % 2 === 1;
    
    // Base background with subtle alternating pattern for 3x3 boxes
    if (isAlternateBox) {
      classes += "bg-gradient-to-br from-slate-800/90 to-slate-900/90 hover:from-slate-700 hover:to-slate-800 shadow-lg ";
    } else {
      classes += "bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 shadow-lg ";
    }

    // Enhanced borders with better visual hierarchy for mobile and desktop
    const mainBorderColor = "border-purple-400"; 
    const lightBorderColor = "border-slate-600"; 

    // Main 3x3 grid borders - thicker on mobile for better visibility
    if (col === 2 || col === 5) classes += `border-r-4 sm:border-r-6 ${mainBorderColor} `; 
    else if (col !== 8) classes += `border-r border-r-2 ${lightBorderColor} `;
    
    if (row === 2 || row === 5) classes += `border-b-4 sm:border-b-6 ${mainBorderColor} `; 
    else if (row !== 8) classes += `border-b border-b-2 ${lightBorderColor} `;
    
    // Outer borders - always thick
    if (col === 0) classes += `border-l-4 sm:border-l-6 ${mainBorderColor} `;
    if (row === 0) classes += `border-t-4 sm:border-t-6 ${mainBorderColor} `;
    if (col === 8) classes += `border-r-4 sm:border-r-6 ${mainBorderColor} `;
    if (row === 8) classes += `border-b-4 sm:border-b-6 ${mainBorderColor} `;

    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const isFixed = initialBoard[row][col] !== EMPTY_CELL;
    const isError = errors.some(e => e.row === row && e.col === col);
    const isInHighlightedRegion = selectedCell && (selectedCell.row === row || selectedCell.col === col || (Math.floor(selectedCell.row / 3) === Math.floor(row / 3) && Math.floor(selectedCell.col / 3) === Math.floor(col / 3)));

    if (isFixed) {
      classes += "text-purple-200 font-black text-shadow ";
    } else {
      classes += "text-cyan-400 font-bold ";
    }

    if (isSelected) {
      classes += "ring-4 ring-purple-400 ring-inset scale-110 z-10 bg-gradient-to-br from-purple-600 to-purple-700 shadow-2xl ";
    } else if (isInHighlightedRegion) {
      classes += "bg-gradient-to-br from-slate-700 to-slate-800 ";
    }
    
    if (highlightedNumber && val === highlightedNumber && val !== EMPTY_CELL) {
      classes += isSelected ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white " : "bg-gradient-to-br from-purple-500/60 to-purple-600/60 text-white ";
    }
    
    if (isError && val !== EMPTY_CELL) {
      classes += "text-red-400 font-black animate-pulse bg-gradient-to-br from-red-900/50 to-red-800/50 ";
    }
    
    if (isSolved) {
        classes += "text-green-300 animate-pulse ";
    }

    return classes;
  };

  if (!gameStarted) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-purple-300 p-4 selection:bg-purple-500 selection:text-white"
      >
        <style dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@400;600;700;800&display=swap');
            
            .game-title {
              font-family: 'Orbitron', monospace;
              text-shadow: 0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.3);
              letter-spacing: 0.1em;
            }
            
            .game-ui {
              font-family: 'Exo 2', sans-serif;
            }
            
            .animate-float {
              animation: float 3s ease-in-out infinite;
            }
            
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
          `
        }} />

        <motion.div 
          className="text-center mb-12"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1 
            className="game-title text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 leading-tight"
            animate={{ 
              y: [-10, 0, -10],
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            SUDOKU
          </motion.h1>
          <motion.div 
            className="flex items-center justify-center gap-3 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy className="text-yellow-400" size={32} />
            </motion.div>
            <h2 className="game-ui text-3xl sm:text-4xl font-bold text-purple-300 tracking-wider">
              CHALLENGE
            </h2>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Zap className="text-cyan-400" size={32} />
            </motion.div>
          </motion.div>
          <motion.div 
            className="w-48 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full mb-8"
            initial={{ width: 0 }}
            animate={{ width: 192 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          ></motion.div>
        </motion.div>

        <motion.div 
          className="text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.h3 
            className="game-ui text-2xl sm:text-3xl font-bold text-purple-300 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Choose Difficulty Level
          </motion.h3>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            {DIFFICULTIES.map((diff, index) => (
              <motion.button
                key={diff}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(168, 85, 247, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startNewGameWithDifficulty(diff)}
                className="game-ui px-8 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-slate-700 to-slate-800 text-purple-300 hover:from-purple-600 hover:to-purple-700 hover:text-white rounded-xl font-bold transition-all duration-300 text-xl sm:text-2xl shadow-lg border border-purple-500/30 hover:border-purple-400 cursor-pointer"
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-purple-300 p-4 selection:bg-purple-500 selection:text-white"
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@400;600;700;800&display=swap');
          
          .game-title {
            font-family: 'Orbitron', monospace;
            text-shadow: 0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.3);
            letter-spacing: 0.1em;
          }
          
          .game-ui {
            font-family: 'Exo 2', sans-serif;
          }
          
          .text-shadow {
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          }
          
          .glow-effect {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `
      }} />

      {/* Mobile Header */}
      <motion.div 
        className="lg:hidden flex items-center justify-between mb-6 px-2"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="game-title text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 leading-tight">
            SUDOKU
          </h1>
          <motion.div 
            className="w-16 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mt-1"
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          ></motion.div>
        </motion.div>
        
        <motion.button
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleInfoModal}
          className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-3 rounded-full shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 cursor-pointer"
          aria-label="Show game instructions"
        >
          <Info size={20} />
        </motion.button>
      </motion.div>

      {/* Desktop Header */}
      <motion.div 
        className="hidden lg:block text-center mb-6"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="game-title text-3xl sm:text-4xl md:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 leading-tight"
          animate={{ 
            y: [-5, 0, -5],
            scale: [1, 1.01, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          SUDOKU
        </motion.h1>
        <motion.div 
          className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full"
          initial={{ width: 0 }}
          animate={{ width: 96 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        ></motion.div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-7xl mx-auto">
        <motion.div 
          className="flex flex-col space-y-4 lg:space-y-8 lg:w-2/5 order-2 lg:order-1"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >


          <div className="hidden lg:block bg-gradient-to-br from-purple-800/30 to-purple-900/30 border border-purple-400/30 rounded-xl p-4 lg:p-6">
            <h3 className="game-ui text-lg lg:text-xl font-bold text-purple-300 mb-3 lg:mb-4 text-center">
              How to Play
            </h3>
            <div className="space-y-2 lg:space-y-3 text-xs lg:text-sm text-purple-200 game-ui">
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">1.</span>
                <span>Click on an empty cell to select it</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">2.</span>
                <span>Use number keys (1-9) or number pad to enter digits</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">3.</span>
                <span>Press Backspace/Delete to clear a cell</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">4.</span>
                <span>Use arrow keys to navigate between cells</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">5.</span>
                <span>Fill each row, column, and 3×3 box with numbers 1-9</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">6.</span>
                <span>No number can repeat in the same row, column, or box</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3 lg:gap-6 max-w-sm lg:max-w-full mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleNumberInput(num)}
                onMouseEnter={() => setHighlightedNumber(num)}
                onMouseLeave={() => { if (selectedCell) { setHighlightedNumber(currentBoard[selectedCell.row][selectedCell.col] === EMPTY_CELL ? null : currentBoard[selectedCell.row][selectedCell.col]) } else {setHighlightedNumber(null)} }}
                disabled={!selectedCell || initialBoard[selectedCell.row][selectedCell.col] !== EMPTY_CELL || isSolved}
                className={`game-ui w-12 h-12 lg:w-20 lg:h-20 text-xl lg:text-3xl font-black rounded-xl transition-all duration-200 ease-in-out transform hover:scale-110 cursor-pointer
                            bg-gradient-to-br from-slate-700 to-slate-800 text-cyan-400 hover:from-purple-600 hover:to-purple-700 hover:text-white 
                            focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-75 shadow-lg
                            disabled:from-gray-800 disabled:to-gray-900 disabled:text-gray-600 disabled:cursor-not-allowed disabled:transform-none
                            ${highlightedNumber === num ? 'from-purple-500 to-purple-600 text-white shadow-purple-500/50 shadow-lg' : ''}`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handleNumberInput(null)}
              onMouseEnter={() => setHighlightedNumber(null)}
              onMouseLeave={() => { if (selectedCell) { setHighlightedNumber(currentBoard[selectedCell.row][selectedCell.col] === EMPTY_CELL ? null : currentBoard[selectedCell.row][selectedCell.col]) } else {setHighlightedNumber(null)} }}
              disabled={!selectedCell || initialBoard[selectedCell.row][selectedCell.col] !== EMPTY_CELL || isSolved}
              className="game-ui w-12 h-12 lg:w-20 lg:h-20 flex items-center justify-center rounded-xl transition-all duration-200 ease-in-out transform hover:scale-110 cursor-pointer
                          bg-gradient-to-br from-slate-700 to-slate-800 text-cyan-400 hover:from-yellow-600 hover:to-yellow-700 hover:text-white 
                          focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-75 shadow-lg
                          disabled:from-gray-800 disabled:to-gray-900 disabled:text-gray-600 disabled:cursor-not-allowed disabled:transform-none"
              aria-label="Erase number"
            >
              <Edit3 size={28} className="lg:w-8 lg:h-8" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            <button
              onClick={handleNewGame}
              className="game-ui px-4 py-3 lg:px-6 lg:py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg transform hover:scale-105 text-sm lg:text-base cursor-pointer"
            >
              <RefreshCw size={18} /> New Game
            </button>
            <button
              onClick={handleReset}
              className="game-ui px-4 py-3 lg:px-6 lg:py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg transform hover:scale-105 text-sm lg:text-base cursor-pointer"
            >
              <RefreshCw size={18} /> Reset
            </button>
            <button
              onClick={handleCheck}
              disabled={isSolved}
              className="game-ui px-4 py-3 lg:px-6 lg:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg transform hover:scale-105 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:transform-none text-sm lg:text-base cursor-pointer"
            >
              <CheckCircle size={18} /> Check
            </button>
            <button
              onClick={handleHint}
              disabled={isSolved}
              className="game-ui px-4 py-3 lg:px-6 lg:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg transform hover:scale-105 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:transform-none text-sm lg:text-base cursor-pointer"
            >
              <HelpCircle size={18} /> Hint
            </button>
          </div>

        </motion.div>

        <motion.div 
          className="flex justify-center lg:w-3/5 order-1 lg:order-2"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div 
            className="grid grid-cols-9 gap-0 shadow-2xl rounded-xl overflow-hidden border-4 sm:border-6 border-purple-400 glow-effect bg-gradient-to-br from-slate-800 to-slate-900 p-1 sm:p-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{
              filter: 'drop-shadow(0 0 15px rgba(168, 85, 247, 0.4))'
            }}
          >
            {currentBoard.map((rowVals, rowIndex) =>
              rowVals.map((val, colIndex) => (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: 0.8 + (rowIndex * 9 + colIndex) * 0.01 
                  }}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  whileTap={{ scale: 0.95 }}
                  className={getCellClasses(rowIndex, colIndex, val)}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onMouseEnter={() => { if (val !== EMPTY_CELL) setHighlightedNumber(val); }}
                  onMouseLeave={() => { if (selectedCell) { setHighlightedNumber(currentBoard[selectedCell.row][selectedCell.col] === EMPTY_CELL ? null : currentBoard[selectedCell.row][selectedCell.col]) } else {setHighlightedNumber(null)} }}
                >
                  <AnimatePresence mode="wait">
                    {val !== EMPTY_CELL && (
                      <motion.span
                        key={val}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {val}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showInfoModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={toggleInfoModal}
          >
            <motion.div 
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div 
                className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 p-4 rounded-t-2xl flex justify-between items-center"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h3 className="game-ui text-xl font-bold text-white">How to Play</h3>
                <motion.button
                  onClick={toggleInfoModal}
                  className="text-white hover:text-purple-200 transition-colors p-1 cursor-pointer"
                  aria-label="Close instructions"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </motion.div>
            <div className="p-6">
              <div className="space-y-4 text-sm text-purple-200 game-ui">
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold text-lg">1.</span>
                  <span>Click on an empty cell to select it</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold text-lg">2.</span>
                  <span>Use number keys (1-9) or number pad to enter digits</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold text-lg">3.</span>
                  <span>Press Backspace/Delete to clear a cell</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold text-lg">4.</span>
                  <span>Use arrow keys to navigate between cells</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold text-lg">5.</span>
                  <span>Fill each row, column, and 3×3 box with numbers 1-9</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold text-lg">6.</span>
                  <span>No number can repeat in the same row, column, or box</span>
                </div>
                <div className="mt-6 p-4 bg-purple-900/30 rounded-xl border border-purple-500/30">
                  <p className="text-cyan-300 font-semibold mb-2">💡 Tips:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Start with cells that have fewer possibilities</li>
                    <li>• Look for numbers that can only go in one place</li>
                    <li>• Use the hint button if you get stuck</li>
                  </ul>
                </div>
              </div>
            </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      <footer className="mt-8 text-center text-sm text-gray-400 game-ui">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-purple-500"></div>
          <span className="text-purple-400 font-semibold">Built with Lovable</span>
          <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-purple-500"></div>
        </div>
        <p>Current Date: {new Date().toLocaleDateString()}</p>
      </footer>

      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{
          top: 20,
          right: 20,
        }}
        toastOptions={{
          duration: 3000,
          style: {
            background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
            color: '#e879f9',
            border: '1px solid #8b5cf6',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            fontFamily: "'Exo 2', sans-serif",
            boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </motion.div>
  );
};

export default Index;
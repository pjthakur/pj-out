'use client'
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Shuffle, Trophy, Image, Timer, MoveRight, Sun, Moon, Info } from 'lucide-react';
import { useLocalStorage } from 'usehooks-ts';

const PuzzleGame = () => {
  const [tiles, setTiles] = useState<number[]>([]);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [imageTiles, setImageTiles] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useLocalStorage('puzzle-dark-mode', false);
  const [bestScores, setBestScores] = useLocalStorage<Record<string, { moves: number; time: number }>>(
    'puzzle-best-scores',
    {}
  );

  const generateTiles = useCallback(() => {
    const total = rows * cols - 1;
    const newTiles = Array.from({ length: total }, (_, i) => i + 1);
    newTiles.sort(() => Math.random() - 0.5);
    setTiles([...newTiles, 0]);
  }, [rows, cols]);

  const generateImageTiles = useCallback(async (imageUrl: string, rows: number, cols: number) => {
    return new Promise<string[]>((resolve) => {
      const img = new window.Image(); ;
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const tileWidth = img.width / cols;
        const tileHeight = img.height / rows;
        canvas.width = tileWidth;
        canvas.height = tileHeight;
        const tiles: string[] = [];
        
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            if (i === rows - 1 && j === cols - 1) continue;
            ctx?.clearRect(0, 0, tileWidth, tileHeight);
            ctx?.drawImage(
              img,
              j * tileWidth,
              i * tileHeight,
              tileWidth,
              tileHeight,
              0,
              0,
              tileWidth,
              tileHeight
            );
            tiles.push(canvas.toDataURL());
          }
        }
        resolve(tiles);
      };
      img.onerror = () => resolve([]);
    });
  }, []);

  useEffect(() => {
    if (customImage) {
      generateImageTiles(customImage, rows, cols).then(setImageTiles);
    } else {
      setImageTiles([]);
    }
  }, [customImage, rows, cols, generateImageTiles]);

  const isValidMove = (index: number) => {
    const emptyIndex = tiles.indexOf(0);
    const row = Math.floor(index / cols);
    const emptyRow = Math.floor(emptyIndex / cols);
    const col = index % cols;
    const emptyCol = emptyIndex % cols;

    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    );
  };

  const handleMove = (index: number) => {
    if (!isRunning || isSolved || !isValidMove(index)) return;

    const newTiles = [...tiles];
    const emptyIndex = tiles.indexOf(0);
    [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
    
    setTiles(newTiles);
    setMoves(m => m + 1);
    checkSolved(newTiles);
  };

  const checkSolved = (currentTiles: number[]) => {
    const solved = currentTiles.every((tile, i) => tile === i + 1 || tile === 0);
    if (solved) {
      setIsSolved(true);
      setIsRunning(false);
      const key = `${rows}x${cols}`;
      if (!bestScores[key] || moves < bestScores[key].moves || time < bestScores[key].time) {
        setBestScores({ ...bestScores, [key]: { moves, time } });
      }
    }
  };

  useEffect(() => {
    generateTiles();
  }, [generateTiles, rows, cols]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isSolved) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isSolved]);
  

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-100 to-blue-100'}`}>
      {/* Header */}
      <motion.header 
        className="fixed w-full top-0 z-50 backdrop-blur-sm border-b"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className={`container mx-auto px-4 py-4 flex justify-between items-center ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <h1 className="text-3xl font-bold font-['Bangers'] bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            SLIDE MASTER
          </h1>
          
          <div className="flex items-center gap-4">
            <select
              value={`${rows}x${cols}`}
              onChange={(e) => {
                const [r, c] = e.target.value.split('x').map(Number);
                setRows(r);
                setCols(c);
              }}
              className={`px-4 py-2 rounded-lg transition-all ${
                darkMode 
                  ? 'bg-gray-800 text-white hover:bg-gray-700' 
                  : 'bg-white text-gray-900 hover:bg-gray-50'
              } shadow-sm`}
            >
              <option value="3x3">Easy (3x3)</option>
              <option value="4x4">Medium (4x4)</option>
              <option value="5x5">Hard (5x5)</option>
            </select>

            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-white hover:bg-gray-50'
              } shadow-sm`}
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Game Area */}
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Game Grid */}
          <div className="w-full lg:w-auto flex-1">
            <div className={`relative p-4 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/90'} shadow-2xl`}>
              <div 
                className="grid gap-2 mb-6 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  maxWidth: `calc(${cols} * 100px + ${cols - 1} * 0.5rem)`
                }}
              >
                {tiles.map((tile, i) => (
                  <motion.button
                    key={tile}
                    layout
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    className={`cursor-pointer aspect-square relative ${tile === 0 ? 'invisible' : ''}`}
                    onClick={() => handleMove(i)}
                    style={{ 
                      width: `min(20vw, 100px)`,
                      height: `min(20vw, 100px)`,
                      visibility: tile === 0 ? 'hidden' : 'visible'
                    }}
                  >
                    <motion.div
                      className={`absolute inset-0 flex items-center justify-center font-bold rounded-xl ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-purple-100 hover:bg-purple-200'
                      } shadow-md overflow-hidden`}
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 0 }}
                    >
                      {imageTiles.length > 0 && tile !== 0 ? (
                        <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${imageTiles[tile - 1]})` }}
                        />
                      ) : (
                        <span className={`text-[calc(1.5rem-0.2*${cols}rem)] ${
                          darkMode ? 'text-purple-400' : 'text-purple-700'
                        }`}>
                          {tile}
                        </span>
                      )}
                    </motion.div>
                  </motion.button>
                ))}
              </div>

              {/* Game Controls */}
              <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 ${darkMode?'text-white':'text-gray-900'}`}>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-purple-100'
                  }`}>
                    <Timer size={20} />
                    <span>{Math.floor(time / 60)}:{time % 60 < 10 ? '0' : ''}{time % 60}</span>
                  </div>
                  
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-purple-100'
                  }`}>
                    <MoveRight size={20} />
                    <span>{moves}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl transition-colors  ${
                      darkMode 
                        ? 'bg-[#8E7DBE] hover:bg-gray-500' 
                        : 'bg-[#8E7DBE] hover:bg-gray-500'
                    } text-white`}
                    onClick={() => {
                      generateTiles();
                      setMoves(0);
                      setTime(0);
                      setIsRunning(true);
                      setIsSolved(false);
                    }}
                  >
                    <Shuffle size={20} />
                    Start Game
                  </motion.button>

                  <label className="flex items-center gap-2 px-6 py-3 rounded-xl cursor-pointer transition-colors bg-[#8E7DBE] hover:bg-gray-500 text-white">
                    <Image size={20} />
                    Custom Image
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setCustomImage(URL.createObjectURL(file));
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Best Scores Panel */}
          <motion.div 
            className={`w-full lg:w-80 p-6 rounded-2xl ${
              darkMode ? 'bg-gray-800/50 text-white' : 'bg-white/90'
            } shadow-xl`}
            initial={{ x: 50 }}
            animate={{ x: 0 }}
          >
            <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 `}>
              <Trophy className="text-yellow-400" size={28} />
              Best Scores
            </h2>
            {Object.entries(bestScores).map(([key, score]) => (
              <div key={key} className="mb-3">
                <div className="font-medium text-sm mb-1">{key.replace('x', '×')} Grid:</div>
                <div className="text-sm opacity-75 flex justify-between">
                  <span>{score.moves} moves</span>
                  <span>
                    {Math.floor(score.time / 60)}:
                    {score.time % 60 < 10 ? '0' : ''}{score.time % 60}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Victory Modal */}
        <AnimatePresence>
          {isSolved && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                className={`p-8 rounded-2xl ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-2xl text-center`}
              >
                <motion.h2 
                  className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  🎉 VICTORY! 🎉
                </motion.h2>
                <p className="text-xl mb-4">
                  Time: {Math.floor(time / 60)}:{time % 60 < 10 ? '0' : ''}{time % 60}
                </p>
                <p className="text-xl mb-6">Moves: {moves}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
                  onClick={() => setIsSolved(false)}
                >
                  Play Again
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Helper Text */}
      <motion.div 
        className="fixed bottom-4 right-4 flex items-center gap-2 text-sm opacity-75"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Info size={16} className={`${darkMode?'text-white':'text-gray-900'}`} />
        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
          Click New Game and then adjacent tiles to solve the puzzle!
        </span>
      </motion.div>
    </div>
  );
};

export default PuzzleGame;
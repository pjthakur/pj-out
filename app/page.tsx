"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const DiceRollerGame: React.FC = () => {
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [diceColor, setDiceColor] = useState<string>("#6366F1");
  const [dotColor, setDotColor] = useState<string>("#FFFFFF");
  const [displayMode, setDisplayMode] = useState<"dots" | "number">("dots");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [rollHistory, setRollHistory] = useState<number[]>([]);
  const [backgroundTheme, setBackgroundTheme] = useState<string>("midnight");
  const [showResult, setShowResult] = useState<boolean>(false);
  const [diceFace, setDiceFace] = useState<number>(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Use base64 encoded simple clicking sound as a fallback
      const audio = new Audio(
        "data:audio/mpeg;base64,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"
      );
      audio.volume = 0.6;
      audioRef.current = audio;

      // Try to load the external sound as well
      const externalAudio = new Audio(
        "https://cdn.pixabay.com/download/audio/2022/03/24/audio_d1718ab41b.mp3"
      );
      externalAudio.volume = 0.6;
      externalAudio.addEventListener("loadeddata", () => {
        audioRef.current = externalAudio;
      });
    }
  }, []);

  const rollDice = () => {
    setIsRolling(true);
    setShowResult(false);

    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => {
        console.error("Error playing sound:", e);
        const fallbackAudio = new Audio(
          "https://cdn.pixabay.com/audio/2021/08/05/audio_5f9b9c7a3e.mp3"
        );
        fallbackAudio.volume = 0.4;
        fallbackAudio.play().catch(() => {});
      });
    }

    const duration = 2500;
    const startTime = Date.now();
    let frameCount = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      frameCount++;

      if (frameCount % 3 === 0) {
        setDiceFace(Math.floor(Math.random() * 6) + 1);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        setDiceFace(finalValue);
        setRollHistory((prev) => [finalValue, ...prev.slice(0, 9)]);
        setTimeout(() => {
          setShowResult(true);
          setIsRolling(false);
        }, 300);
      }
    };

    animate();
  };

  const getDiceDotsPosition = (
    value: number
  ): { x: number; y: number; size: number }[] => {
    const dotSize = 24;
    const positions: {
      [key: number]: { x: number; y: number; size: number }[];
    } = {
      1: [{ x: 50, y: 50, size: dotSize }],
      2: [
        { x: 30, y: 30, size: dotSize },
        { x: 70, y: 70, size: dotSize },
      ],
      3: [
        { x: 30, y: 30, size: dotSize },
        { x: 50, y: 50, size: dotSize },
        { x: 70, y: 70, size: dotSize },
      ],
      4: [
        { x: 30, y: 30, size: dotSize },
        { x: 70, y: 30, size: dotSize },
        { x: 30, y: 70, size: dotSize },
        { x: 70, y: 70, size: dotSize },
      ],
      5: [
        { x: 30, y: 30, size: dotSize },
        { x: 70, y: 30, size: dotSize },
        { x: 50, y: 50, size: dotSize },
        { x: 30, y: 70, size: dotSize },
        { x: 70, y: 70, size: dotSize },
      ],
      6: [
        { x: 30, y: 25, size: dotSize },
        { x: 70, y: 25, size: dotSize },
        { x: 30, y: 50, size: dotSize },
        { x: 70, y: 50, size: dotSize },
        { x: 30, y: 75, size: dotSize },
        { x: 70, y: 75, size: dotSize },
      ],
    };
    return positions[value] || [];
  };

  const colorOptions = [
    "#6366F1",
    "#EF4444",
    "#10B981",
    "#8B5CF6",
    "#F59E0B",
    "#EC4899",
    "#06B6D4",
    "#F97316",
  ];

  const backgroundThemes = {
    midnight: "from-slate-900 via-purple-900 to-slate-900",
    sunset: "from-orange-500 via-pink-500 to-purple-600",
    ocean: "from-blue-600 via-cyan-600 to-teal-700",
    aurora: "from-green-400 via-blue-500 to-purple-600",
    cosmic: "from-indigo-900 via-purple-800 to-pink-800",
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${
        backgroundThemes[backgroundTheme as keyof typeof backgroundThemes]
      } flex items-center justify-center p-4 ${poppins.className}`}
    >
      <div className="backdrop-blur-md bg-white/10 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-lg border border-white/20">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8 tracking-tight bg-gradient-to-r from-blue-200 via-indigo-100 to-purple-200 text-transparent bg-clip-text drop-shadow-sm">
          Dice Roller
        </h1>

        <div className="flex justify-center mb-6 h-32 md:h-36">
          <div
            className="relative w-32 h-32 md:w-36 md:h-36"
            style={{ perspective: "600px" }}
          >
            <motion.div
              className="absolute w-full h-full"
              animate={{
                rotateX: isRolling
                  ? [0, 360, 720, 1080, 1440]
                  : diceValue === 1
                  ? 0
                  : diceValue === 2
                  ? -90
                  : diceValue === 3
                  ? 0
                  : diceValue === 4
                  ? 0
                  : diceValue === 5
                  ? 90
                  : diceValue === 6
                  ? 0
                  : 0,
                rotateY: isRolling
                  ? [0, 360, 720, 1080, 1440]
                  : diceValue === 1
                  ? 0
                  : diceValue === 2
                  ? 0
                  : diceValue === 3
                  ? -90
                  : diceValue === 4
                  ? 90
                  : diceValue === 5
                  ? 0
                  : diceValue === 6
                  ? 180
                  : 0,
                x: isRolling ? [0, 50, -50, 20, 0] : 0,
                y: isRolling ? [0, -100, -50, -30, 0] : 0,
              }}
              transition={{
                duration: isRolling ? 2.5 : 0.3,
                ease: isRolling ? [0.25, 0.1, 0.25, 1] : "easeOut",
                times: isRolling ? [0, 0.2, 0.5, 0.8, 1] : undefined,
              }}
              style={{
                transformStyle: "preserve-3d",
                transformOrigin: "center center",
              }}
            >
              <div
                className="absolute w-full h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front Face - 1 */}
                <div
                  className="absolute w-full h-full rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white/30"
                  style={{
                    backgroundColor: diceColor,
                    transform: "translateZ(72px)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  {displayMode === "dots" ? (
                    <div className="relative w-full h-full">
                      {getDiceDotsPosition(1).map((pos, index) => (
                        <div
                          key={index}
                          className="absolute rounded-full"
                          style={{
                            backgroundColor: dotColor,
                            width: `${pos.size}%`,
                            height: `${pos.size}%`,
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                            transform: "translate(-50%, -50%)",
                            boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-6xl font-bold text-white">1</span>
                  )}
                </div>

                {/* Back Face - 6 */}
                <div
                  className="absolute w-full h-full rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white/30"
                  style={{
                    backgroundColor: diceColor,
                    transform: "rotateY(180deg) translateZ(72px)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  {displayMode === "dots" ? (
                    <div className="relative w-full h-full">
                      {getDiceDotsPosition(6).map((pos, index) => (
                        <div
                          key={index}
                          className="absolute rounded-full"
                          style={{
                            backgroundColor: dotColor,
                            width: `${pos.size}%`,
                            height: `${pos.size}%`,
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                            transform: "translate(-50%, -50%)",
                            boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-6xl font-bold text-white">6</span>
                  )}
                </div>

                {/* Top Face - 2 */}
                <div
                  className="absolute w-full h-full rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white/30"
                  style={{
                    backgroundColor: diceColor,
                    transform: "rotateX(90deg) translateZ(72px)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  {displayMode === "dots" ? (
                    <div className="relative w-full h-full">
                      {getDiceDotsPosition(2).map((pos, index) => (
                        <div
                          key={index}
                          className="absolute rounded-full"
                          style={{
                            backgroundColor: dotColor,
                            width: `${pos.size}%`,
                            height: `${pos.size}%`,
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                            transform: "translate(-50%, -50%)",
                            boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-6xl font-bold text-white">2</span>
                  )}
                </div>

                {/* Bottom Face - 5 */}
                <div
                  className="absolute w-full h-full rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white/30"
                  style={{
                    backgroundColor: diceColor,
                    transform: "rotateX(-90deg) translateZ(72px)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  {displayMode === "dots" ? (
                    <div className="relative w-full h-full">
                      {getDiceDotsPosition(5).map((pos, index) => (
                        <div
                          key={index}
                          className="absolute rounded-full"
                          style={{
                            backgroundColor: dotColor,
                            width: `${pos.size}%`,
                            height: `${pos.size}%`,
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                            transform: "translate(-50%, -50%)",
                            boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-6xl font-bold text-white">5</span>
                  )}
                </div>

                {/* Right Face - 3 */}
                <div
                  className="absolute w-full h-full rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white/30"
                  style={{
                    backgroundColor: diceColor,
                    transform: "rotateY(90deg) translateZ(72px)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  {displayMode === "dots" ? (
                    <div className="relative w-full h-full">
                      {getDiceDotsPosition(3).map((pos, index) => (
                        <div
                          key={index}
                          className="absolute rounded-full"
                          style={{
                            backgroundColor: dotColor,
                            width: `${pos.size}%`,
                            height: `${pos.size}%`,
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                            transform: "translate(-50%, -50%)",
                            boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-6xl font-bold text-white">3</span>
                  )}
                </div>

                {/* Left Face - 4 */}
                <div
                  className="absolute w-full h-full rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white/30"
                  style={{
                    backgroundColor: diceColor,
                    transform: "rotateY(-90deg) translateZ(72px)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  {displayMode === "dots" ? (
                    <div className="relative w-full h-full">
                      {getDiceDotsPosition(4).map((pos, index) => (
                        <div
                          key={index}
                          className="absolute rounded-full"
                          style={{
                            backgroundColor: dotColor,
                            width: `${pos.size}%`,
                            height: `${pos.size}%`,
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                            transform: "translate(-50%, -50%)",
                            boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-6xl font-bold text-white">4</span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: showResult ? 1 : 0,
            y: showResult ? 0 : 20,
          }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <p className="text-4xl md:text-5xl font-extrabold text-white mb-1">
            {diceValue}
          </p>
          <p className="text-white/70 text-base md:text-lg font-medium">
            You rolled a {diceValue}!
          </p>
        </motion.div>

        <button
          onClick={rollDice}
          disabled={isRolling}
          className="w-full py-3 md:py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base md:text-lg shadow-xl backdrop-blur-sm border border-white/20 cursor-pointer mb-6 tracking-wide"
        >
          {isRolling ? "Rolling..." : "Roll Dice"}
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div className="backdrop-blur-sm bg-white/5 rounded-xl p-3 md:p-4 border border-white/10">
            <p className="text-white/80 text-xs md:text-sm mb-2 font-medium tracking-wide">
              Dice Color
            </p>
            <div className="grid grid-cols-4 gap-1.5 md:gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setDiceColor(color)}
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-lg border-2 transition-all hover:scale-110 cursor-pointer ${
                    diceColor === color
                      ? "border-white/80 scale-110"
                      : "border-white/20"
                  }`}
                  style={{
                    backgroundColor: color,
                    boxShadow:
                      diceColor === color
                        ? "0 0 15px rgba(255,255,255,0.5)"
                        : "none",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="backdrop-blur-sm bg-white/5 rounded-xl p-3 md:p-4 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/80 text-xs md:text-sm font-medium tracking-wide">
                Display
              </p>
              <button
                onClick={() =>
                  setDisplayMode(displayMode === "dots" ? "number" : "dots")
                }
                className="px-2 md:px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors cursor-pointer border border-white/20"
              >
                {displayMode === "dots" ? "Dots" : "Number"}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-white/80 text-xs md:text-sm font-medium tracking-wide">
                Sound
              </p>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`relative w-11 md:w-12 h-6 md:h-6 rounded-full transition-colors duration-300 ${
                  soundEnabled ? "bg-indigo-500" : "bg-white/20"
                }`}
              >
                <div
                  className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 md:w-4 md:h-4 bg-white rounded-full shadow-md transition-all duration-300 ${
                    soundEnabled ? "left-[calc(100%-18px)]" : "left-1"
                  }`}
                ></div>
              </button>
            </div>
          </div>

          <div className="backdrop-blur-sm bg-white/5 rounded-xl p-3 md:p-4 border border-white/10">
            <p className="text-white/80 text-xs md:text-sm mb-2 font-medium tracking-wide">
              Theme
            </p>
            <select
              value={backgroundTheme}
              onChange={(e) => setBackgroundTheme(e.target.value)}
              className="w-full px-2 md:px-3 py-1.5 md:py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:border-white/40 outline-none text-xs md:text-sm cursor-pointer backdrop-blur-sm"
            >
              <option value="midnight" className="bg-gray-800">
                Midnight
              </option>
              <option value="sunset" className="bg-gray-800">
                Sunset
              </option>
              <option value="ocean" className="bg-gray-800">
                Ocean
              </option>
              <option value="aurora" className="bg-gray-800">
                Aurora
              </option>
              <option value="cosmic" className="bg-gray-800">
                Cosmic
              </option>
            </select>
          </div>

          <div className="backdrop-blur-sm bg-white/5 rounded-xl p-3 md:p-4 border border-white/10">
            <p className="text-white/80 text-xs md:text-sm mb-2 font-medium tracking-wide">
              History
            </p>
            <div className="flex gap-1 flex-wrap">
              {rollHistory.map((roll, index) => (
                <motion.span
                  key={`history-${index}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-1.5 md:px-2 py-0.5 md:py-1 bg-white/10 text-white rounded-md text-xs font-bold backdrop-blur-sm"
                  style={{ opacity: 1 - index * 0.08 }}
                >
                  {roll}
                </motion.span>
              ))}
              {rollHistory.length === 0 && (
                <span className="text-white/40 text-xs">No rolls yet</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiceRollerGame;
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  MouseSensor,
  KeyboardSensor,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { FaFlask, FaVial, FaAtom, FaFire, FaWater, FaLeaf, FaVials, FaTemperatureHigh, FaClipboardList, FaTrash, FaTimes, FaCheck, FaLayerGroup, FaArrowDown } from "react-icons/fa";
import { IoFlaskOutline, IoWater, IoSunny, IoMoon, IoBeaker, IoFlask } from "react-icons/io5";
import { GiBubbles, GiChemicalDrop, GiSmokeBomb, GiMolecule, GiTestTubes, GiMicroscope, GiChemicalTank } from "react-icons/gi";

const glowEffects = {
  light: {
    primary: "0 0 15px rgba(13, 148, 136, 0.5)",
    secondary: "0 0 15px rgba(236, 201, 75, 0.5)",
    danger: "0 0 15px rgba(239, 68, 68, 0.5)",
    info: "0 0 15px rgba(59, 130, 246, 0.5)",
  },
  dark: {
    primary: "0 0 15px rgba(20, 184, 166, 0.5)",
    secondary: "0 0 15px rgba(250, 204, 21, 0.5)",
    danger: "0 0 15px rgba(248, 113, 113, 0.5)",
    info: "0 0 15px rgba(96, 165, 250, 0.5)",
  }
};

const getReactionGlowColor = (colorName: string, opacity = 0.5) => {
  switch (colorName) {
    case "light-blue": return `rgba(59, 130, 246, ${opacity})`;
    case "yellow-green": return `rgba(132, 204, 22, ${opacity})`;
    case "orange": return `rgba(249, 115, 22, ${opacity})`;
    case "pink": return `rgba(236, 72, 153, ${opacity})`;
    case "milky-white": return `rgba(229, 231, 235, ${opacity})`;
    case "deep-red": return `rgba(239, 68, 68, ${opacity})`;
    case "gray": return `rgba(156, 163, 175, ${opacity})`;
    default: return `rgba(20, 184, 166, ${opacity})`;
  }
};

function DraggableChemical({ id, children, isSelected, onSelect }: { id: string, children: React.ReactNode, isSelected: boolean, onSelect: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  });

  const controls = useAnimation();

  useEffect(() => {
    if (isSelected) {
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.8, repeat: Infinity, repeatType: "reverse" }
      });
    } else {
      controls.stop();
      controls.set({ scale: 1 });
    }
  }, [isSelected, controls]);

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: transform ? 10 : 1,
    touchAction: "none",
    opacity: 1
  };

  const handleTouch = (e: React.TouchEvent) => {
    if (e.currentTarget === e.target || !e.currentTarget.contains(document.activeElement)) {
      e.stopPropagation();
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="relative"
      onClick={(e) => {
        if (e.target === e.currentTarget || !e.currentTarget.contains(document.activeElement)) {
          onSelect();
        }
      }}
      onTouchStart={handleTouch}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={controls}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      {isSelected && (
        <motion.div
          className="absolute -top-2 -right-2 z-10 w-5 h-5 flex items-center justify-center rounded-full bg-teal-500 text-white border-2 border-white dark:border-gray-700 shadow-sm"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          <FaCheck size={10} />
        </motion.div>
      )}
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [theme, setTheme] = useState("light");
  const [activeChemical, setActiveChemical] = useState<string | null>(null);
  const [beaker, setBeaker] = useState<string[]>([]);
  const [reaction, setReaction] = useState<{
    name: string;
    description: string;
    formula: string;
    color: string;
    effect: string;
  } | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showAddEffect, setShowAddEffect] = useState(false);
  const [lastAddedChemical, setLastAddedChemical] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedChemicals, setSelectedChemicals] = useState<string[]>([]);
  const [isMultiDragging, setIsMultiDragging] = useState(false);
  const [showExperimenting, setShowExperimenting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileHint, setShowMobileHint] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
        delayTolerance: 150
      }
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const chemicals = [
    {
      id: "acid",
      name: "Acid",
      formula: "HCl",
      color: "green",
      icon: <FaVial className="text-2xl" />
    },
    {
      id: "base",
      name: "Base",
      formula: "NaOH",
      color: "blue",
      icon: <FaFlask className="text-2xl" />
    },
    {
      id: "salt",
      name: "Salt",
      formula: "NaCl",
      color: "white",
      icon: <GiChemicalDrop className="text-2xl" />
    },
    {
      id: "catalyst",
      name: "Catalyst",
      formula: "Fe₂O₃",
      color: "purple",
      icon: <FaAtom className="text-2xl" />
    },
    {
      id: "alcohol",
      name: "Alcohol",
      formula: "C₂H₅OH",
      color: "transparent",
      icon: <FaWater className="text-2xl" />
    },
    {
      id: "organic",
      name: "Organic",
      formula: "CH₃COOH",
      color: "brown",
      icon: <FaLeaf className="text-2xl" />
    },
  ];

  const reactions = {
    "acid-base": {
      name: "Neutralization",
      description: "Acid and base combine to form salt and water",
      formula: "HCl + NaOH → NaCl + H₂O",
      color: "light-blue",
      effect: "bubbling",
    },
    "acid-salt": {
      name: "Decomposition",
      description: "Acid breaks down salt into component ions",
      formula: "HCl + NaCl → Na⁺ + 2Cl⁻ + H⁺",
      color: "yellow-green",
      effect: "fizzing",
    },
    "catalyst-organic": {
      name: "Catalytic Reaction",
      description: "Catalyst speeds up the breakdown of organic compounds",
      formula: "CH₃COOH + Fe₂O₃ → CO₂ + H₂O + (Fe)",
      color: "orange",
      effect: "smoke",
    },
    "alcohol-organic": {
      name: "Esterification",
      description: "Alcohol and organic compounds form sweet-smelling esters",
      formula: "C₂H₅OH + CH₃COOH → CH₃COOC₂H₅ + H₂O",
      color: "pink",
      effect: "aroma",
    },
    "base-organic": {
      name: "Saponification",
      description: "Base and organic compounds form soap-like substances",
      formula: "CH₃COOH + NaOH → CH₃COONa + H₂O",
      color: "milky-white",
      effect: "foam",
    },
    "catalyst-alcohol": {
      name: "Oxidation",
      description: "Catalyst helps alcohol oxidize rapidly",
      formula: "C₂H₅OH + Fe₂O₃ → CH₃CHO + H₂O + (Fe)",
      color: "deep-red",
      effect: "heat",
    },
  };

  const toggleChemicalSelection = (chemicalId: string) => {
    if (selectedChemicals.includes(chemicalId)) {
      setSelectedChemicals(prev => prev.filter(id => id !== chemicalId));
    } else {
      // Prevent selecting if total (beaker + selected) would exceed 5
      if (beaker.length + selectedChemicals.length >= 5) {
        return;
      }
      setSelectedChemicals(prev => [...prev, chemicalId]);
    }
  };

  const clearSelections = () => {
    setSelectedChemicals([]);
  };

  const addSelectedToBeaker = () => {
    if (selectedChemicals.length === 0) return;

    setIsProcessing(true);
    setShowInfo(false);

    // Calculate how many chemicals we can actually add
    let remainingBeakerSlots = 5 - beaker.length;
    const chemsToAdd = selectedChemicals.slice(0, remainingBeakerSlots);

    const addNextChemical = (index: number) => {
      if (index >= chemsToAdd.length) {
        if (beaker.length + chemsToAdd.length >= 2) {
          setShowExperimenting(true);

          setTimeout(() => {
            setShowExperimenting(false);
            setIsProcessing(false);
          }, 2500);
        } else {
          setIsProcessing(false);
        }

        clearSelections();
        return;
      }

      const chemId = chemsToAdd[index];
      setLastAddedChemical(chemId);
      setShowAddEffect(true);

      setBeaker(prev => [...prev, chemId]);

      setTimeout(() => {
        setShowAddEffect(false);
        setTimeout(() => {
          addNextChemical(index + 1);
        }, 100);
      }, 400);
    };

    addNextChemical(0);
  };

  const addToBeaker = (chemicalId: string) => {
    if (beaker.length < 5) {
      setIsProcessing(true);
      setShowInfo(false);

      setBeaker(prev => [...prev, chemicalId]);
      setLastAddedChemical(chemicalId);
      setShowAddEffect(true);

      setTimeout(() => {
        setShowAddEffect(false);

        if (beaker.length + 1 >= 2) {
          setShowExperimenting(true);

          setTimeout(() => {
            setShowExperimenting(false);
            setIsProcessing(false);
          }, 2500);
        } else {
          setIsProcessing(false);
        }
      }, 1000);
    } else {
      setIsProcessing(true);
      setShowInfo(false);

      const newBeaker = [...beaker.slice(1), chemicalId];
      setBeaker(newBeaker);
      setLastAddedChemical(chemicalId);
      setShowAddEffect(true);

      setTimeout(() => {
        setShowAddEffect(false);

        setShowExperimenting(true);

        setTimeout(() => {
          setShowExperimenting(false);
          setIsProcessing(false);
        }, 2500);
      }, 1000);
    }
  };

  const removeFromBeaker = (index: number) => {
    setIsProcessing(true);

    const chemicalToRemove = beaker[index];
    setLastAddedChemical(chemicalToRemove);

    setShowAddEffect(true);

    setTimeout(() => {
      const newBeaker = [...beaker.slice(0, index), ...beaker.slice(index + 1)];
      setBeaker(newBeaker);
      setShowAddEffect(false);

      setTimeout(() => {
        if (newBeaker.length < 2) {
          setReaction(null);
          setShowInfo(false);
        }
        setIsProcessing(false);
      }, 100);
    }, 400);
  };

  const checkReaction = (chemicals: string[]) => {
    if (chemicals.length < 2) return null;

    if (chemicals.length >= 3) {
      if (chemicals.includes("acid") && chemicals.includes("base") && chemicals.includes("catalyst")) {
        return {
          name: "Catalytic Neutralization",
          description: "A complex reaction accelerated by the catalyst",
          formula: "HCl + NaOH + Fe₂O₃ → NaCl + H₂O + (Fe)",
          color: "light-blue",
          effect: "complex"
        };
      }

      if (chemicals.includes("organic") && chemicals.includes("alcohol") && chemicals.includes("salt")) {
        return {
          name: "Organic Synthesis",
          description: "A complex organic compound is formed",
          formula: "CH₃COOH + C₂H₅OH + NaCl → CH₃COOC₂H₅ + NaOH + Cl⁻",
          color: "deep-green",
          effect: "synthesis"
        };
      }

      if (chemicals.includes("acid") && chemicals.includes("alcohol") && chemicals.includes("organic")) {
        return {
          name: "Ester Formation",
          description: "Acid-catalyzed reaction between alcohol and organic compound",
          formula: "CH₃COOH + C₂H₅OH + H⁺ → CH₃COOC₂H₅ + H₂O",
          color: "pink",
          effect: "aroma"
        };
      }

      if (chemicals.includes("base") && chemicals.includes("salt") && chemicals.includes("catalyst")) {
        return {
          name: "Catalytic Substitution",
          description: "Catalyst enables substitution in basic environment",
          formula: "NaOH + NaCl + Fe₂O₃ → Na₂O + HCl + (Fe)",
          color: "orange",
          effect: "heat"
        };
      }
    }

    let foundPairReaction = null;

    for (let i = 0; i < chemicals.length - 1; i++) {
      for (let j = i + 1; j < chemicals.length; j++) {
        const pair = [chemicals[i], chemicals[j]];
        const sortedPair = [...pair].sort().join("-");

        for (const key of Object.keys(reactions)) {
          const sortedKey = key.split("-").sort().join("-");
          if (sortedKey === sortedPair) {
            const reaction = reactions[key as keyof typeof reactions];
            foundPairReaction = reaction;
          }
        }
      }
    }

    if (foundPairReaction) {
      if (chemicals.length > 2) {
        return {
          ...foundPairReaction,
          name: `Enhanced ${foundPairReaction.name}`,
          description: `${foundPairReaction.description} (enhanced by ${chemicals.length - 2} additional chemical${chemicals.length > 3 ? 's' : ''})`,
          effect: foundPairReaction.effect,
          color: foundPairReaction.color
        };
      }

      return foundPairReaction;
    }

    return {
      name: "Complex Mixture",
      description: `A mixture of ${chemicals.length} chemicals with no specific reaction`,
      formula: "Mixed Compounds → No Defined Reaction",
      color: "gray",
      effect: "swirl"
    };
  };

  useEffect(() => {
    if (beaker.length >= 2 && !showExperimenting && !isProcessing) {
      const result = checkReaction(beaker);
      setReaction(result);
      setShowInfo(true);
    } else if (beaker.length < 2 && !isProcessing) {
      setReaction(null);
      setShowInfo(false);
    }
  }, [beaker, isProcessing, showExperimenting]);

  useEffect(() => {
    if (showExperimenting) {
      setShowInfo(false);
    }
  }, [showExperimenting]);

  const resetExperiment = () => {
    setIsProcessing(false);
    setTimeout(() => {
      setBeaker([]);
      setReaction(null);
      setShowInfo(false);
      setActiveChemical(null);
      setActiveId(null);
    }, 50);
  };

  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileDevice = window.innerWidth <= 768 || 'ontouchstart' in window;
      setIsMobile(isMobileDevice);

      if (isMobileDevice && showMobileHint) {
        setTimeout(() => {
          setShowMobileHint(false);
        }, 5000);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [showMobileHint]);

  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);
    setActiveChemical(id);
    setActiveId(id);

    const isChemicalSelected = selectedChemicals.includes(id);
    setIsMultiDragging(isChemicalSelected && selectedChemicals.length > 0);

    if (!isChemicalSelected && selectedChemicals.length > 0) {
      clearSelections();
    }

    const beakerElement = document.querySelector('[data-droppable-id="beaker"]');
    if (beakerElement) {
      beakerElement.classList.add('scale-105', 'transition-transform', 'duration-300');

      setTimeout(() => {
        beakerElement.classList.remove('scale-105');
      }, 300);
    }

    if (isMobile) {
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate(50);
        } catch (e) {
        }
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && over.id === "beaker") {
      if (isMultiDragging && selectedChemicals.length > 0) {
        addSelectedToBeaker();
      } else if (active.id) {
        const chemicalId = String(active.id);
        if (!selectedChemicals.includes(chemicalId)) {
          addToBeaker(chemicalId);
        } else {
          addToBeaker(chemicalId);
        }
      }
    }

    const beakerElement = document.querySelector('[data-droppable-id="beaker"]');
    if (beakerElement) {
      beakerElement.classList.remove('scale-105');
    }

    setActiveChemical(null);
    setActiveId(null);
    setIsMultiDragging(false);
  };

  function DroppableBeaker({ children }: { children: React.ReactNode }) {
    const { isOver, setNodeRef } = useDroppable({
      id: "beaker",
    });

    const handleTouchEvent = (e: React.TouchEvent) => {
      e.stopPropagation();
    };

    return (
      <motion.div
        ref={setNodeRef}
        data-droppable-id="beaker"
        className={`relative w-36 h-48 sm:w-40 sm:h-56 md:w-48 md:h-64 mx-auto transition-all duration-300 ${isOver ? 'scale-105' : ''}`}
        onTouchStart={handleTouchEvent}
        onTouchMove={handleTouchEvent}
        whileHover={{ scale: 1.02 }}
        animate={isOver ? {
          scale: [1, 1.05, 1.03],
          transition: { duration: 0.6, repeat: Infinity, repeatType: "reverse" }
        } : {}}
        style={{ touchAction: "none" }}
      >
        {children}
        {isOver && (
          <motion.div
            className="absolute inset-0 bg-teal-500 bg-opacity-10 rounded-xl z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.2, 0.4, 0.2],
              boxShadow: [
                theme === "dark" ? glowEffects.dark.primary : glowEffects.light.primary,
                theme === "dark" ? "0 0 25px rgba(20, 184, 166, 0.7)" : "0 0 25px rgba(13, 148, 136, 0.7)",
                theme === "dark" ? glowEffects.dark.primary : glowEffects.light.primary
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.div>
    );
  }

  const renderReactionEffect = () => {
    if (!reaction) return null;

    switch (reaction.effect) {
      case "bubbling":
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [0.9, 1.1, 0.9],
                filter: ["blur(0px)", "blur(2px)", "blur(0px)"],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <GiBubbles className="text-6xl text-cyan-400" />
            </motion.div>
            {isMounted && Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-gradient-to-br from-cyan-300 to-cyan-100"
                style={{
                  width: `${3 + Math.random() * 8}px`,
                  height: `${3 + Math.random() * 8}px`,
                  left: `${10 + Math.random() * 80}%`,
                  bottom: "0%",
                  opacity: 0.2 + Math.random() * 0.5,
                  boxShadow: "0 0 5px rgba(103, 232, 249, 0.3), inset 0 0 3px rgba(255, 255, 255, 0.5)"
                }}
                initial={{ y: "100%", opacity: 0 }}
                animate={{
                  y: "-120%",
                  x: `${Math.sin(Math.random() * Math.PI * 2) * 30}px`,
                  opacity: [0.2, 0.7, 0],
                  scale: [0.6, 1.3, 0.8]
                }}
                transition={{
                  duration: 2.5 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 4,
                  ease: [0.45, 0.05, 0.55, 0.95]
                }}
              />
            ))}
            <motion.div
              className="absolute inset-0 bg-cyan-500/5"
              animate={{
                opacity: [0.05, 0.1, 0.05]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            />
          </div>
        );
      case "fizzing":
        return (
          <div className="absolute inset-0">
            {isMounted && Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-2 w-2 rounded-full bg-yellow-300"
                initial={{ y: "100%", x: `${Math.random() * 100}%`, opacity: 0.4 }}
                animate={{
                  y: "0%",
                  x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                  opacity: [0.4, 0.8, 0],
                  scale: [0.4, 1, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: Math.random() * 2,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        );
      case "smoke":
        return (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <motion.div
              className="relative w-20 h-20"
              animate={{
                opacity: [0.7, 0.9, 0.7],
                filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <GiSmokeBomb className="text-6xl text-gray-500 absolute inset-0" />

              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    background: `radial-gradient(circle, rgba(100,100,100,0.6) 0%, rgba(100,100,100,0.1) 70%, rgba(100,100,100,0) 100%)`,
                    width: `${30 + i * 10}px`,
                    height: `${30 + i * 10}px`,
                    top: `${50 - (15 + i * 5)}%`,
                    left: `${50 - (15 + i * 5)}%`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                    y: [0, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </div>
        );
      case "aroma":
        return (
          <div className="absolute inset-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ opacity: 0, scale: 0, x: "50%", y: "50%" }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  x: [`50%`, `${50 + (i - 2) * 20}%`],
                  y: [`50%`, `${30 + (i * 10)}%`],
                  rotate: [-10, 0, 10]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  animate={{
                    filter: ["drop-shadow(0 0 2px rgba(244, 114, 182, 0.3))", "drop-shadow(0 0 5px rgba(244, 114, 182, 0.6))", "drop-shadow(0 0 2px rgba(244, 114, 182, 0.3))"]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <GiMolecule className="text-2xl text-pink-300" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        );
      case "foam":
        return (
          <div className="absolute inset-0 flex flex-wrap justify-center content-center">
            {isMounted && Array.from({ length: 16 }).map((_, i) => (
              <motion.div
                key={i}
                className="h-4 w-4 m-1 rounded-full bg-white opacity-80"
                animate={{
                  y: [0, -6 - Math.random() * 6, 0],
                  scale: [1, 1.1 + Math.random() * 0.2, 1],
                  boxShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 4px rgba(255,255,255,0.4)", "0 0 0px rgba(255,255,255,0)"]
                }}
                transition={{
                  duration: 1.5 + Math.random(),
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: Math.random() * 1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        );
      case "heat":
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [0.95, 1.05, 0.95],
                filter: [
                  "drop-shadow(0 0 4px rgba(239, 68, 68, 0.4))",
                  "drop-shadow(0 0 8px rgba(239, 68, 68, 0.7))",
                  "drop-shadow(0 0 4px rgba(239, 68, 68, 0.4))"
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <FaTemperatureHigh className="text-6xl text-red-500" />
            </motion.div>

            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-red-500/10 to-transparent"
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute bottom-0 w-full h-8 opacity-20"
                initial={{ y: 0 }}
                animate={{ y: -30 - (i * 6), opacity: [0.1, 0.3, 0.1] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut"
                }}
                style={{
                  background: `linear-gradient(transparent, rgba(239, 68, 68, ${0.3 + i * 0.1}))`,
                }}
              />
            ))}
          </div>
        );
      case "complex":
        return (
          <div className="absolute inset-0">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [0.9, 1.1, 0.9],
                  rotate: [0, 15, -15, 0],
                  filter: ["drop-shadow(0 0 3px rgba(59, 130, 246, 0.4))", "drop-shadow(0 0 6px rgba(59, 130, 246, 0.7))", "drop-shadow(0 0 3px rgba(59, 130, 246, 0.4))"]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <GiBubbles className="text-5xl text-cyan-400" />
              </motion.div>
            </div>

            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-blue-400/10"
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            {isMounted && Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-3 w-3 rounded-full bg-purple-400"
                initial={{ y: "100%", x: `${Math.random() * 100}%` }}
                animate={{
                  y: "0%",
                  x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                  scale: [0.6, 1.2, 0.6],
                  opacity: [0.4, 0.8, 0.4],
                  boxShadow: ["0 0 0px rgba(192,132,252,0)", "0 0 6px rgba(192,132,252,0.6)", "0 0 0px rgba(192,132,252,0)"],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        );
      case "synthesis":
        return (
          <div className="absolute inset-0">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-green-300 to-blue-300 opacity-50"
              animate={{
                opacity: [0.3, 0.5, 0.3],
                background: [
                  "linear-gradient(to bottom right, rgba(110, 231, 183, 0.4), rgba(96, 165, 250, 0.4))",
                  "linear-gradient(to bottom right, rgba(110, 231, 183, 0.6), rgba(96, 165, 250, 0.6))",
                  "linear-gradient(to bottom right, rgba(110, 231, 183, 0.4), rgba(96, 165, 250, 0.4))"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  rotate: 360,
                  filter: ["drop-shadow(0 0 3px rgba(13, 148, 136, 0.4))", "drop-shadow(0 0 8px rgba(13, 148, 136, 0.7))", "drop-shadow(0 0 3px rgba(13, 148, 136, 0.4))"]
                }}
                transition={{
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  filter: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <GiMolecule className="text-6xl text-teal-700" />
              </motion.div>
            </div>

            {isMounted && Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-teal-200 opacity-70"
                style={{
                  width: `${10 + Math.random() * 10}px`,
                  height: `${10 + Math.random() * 10}px`,
                }}
                initial={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: 0
                }}
                animate={{
                  x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                  y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                  scale: [0, 1, 0],
                  opacity: [0, 0.7, 0]
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: i * 0.7
                }}
              />
            ))}
          </div>
        );
      case "swirl":
        return (
          <div className="absolute inset-0">
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  "radial-gradient(circle at 50% 50%, rgba(156, 163, 175, 0) 0%, rgba(156, 163, 175, 0.1) 50%, rgba(156, 163, 175, 0) 100%)",
                  "radial-gradient(circle at 50% 50%, rgba(156, 163, 175, 0) 0%, rgba(156, 163, 175, 0.3) 50%, rgba(156, 163, 175, 0) 100%)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <motion.div
              className="absolute w-36 h-36 top-6 left-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "center center" }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-4 w-4 rounded-full"
                  style={{
                    backgroundColor: i % 2 === 0 ? '#9CA3AF' : '#6B7280',
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${i * 60}deg) translate(${30 + (i * 2)}px) rotate(-${i * 60}deg)`,
                  }}
                  animate={{
                    y: [0, -5, 5, 0],
                    x: [0, 5, -5, 0],
                    scale: [1, 1.2, 0.8, 1],
                    opacity: [0.6, 0.9, 0.6]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </div>
        );
      default:
        return null;
    }
  };

  const getBackgroundStyle = () => {
    const baseStyle = "min-h-screen transition-colors duration-300";
    return theme === "dark"
      ? `${baseStyle} bg-gradient-to-br from-gray-900 to-gray-800 text-white`
      : `${baseStyle} bg-gradient-to-br from-[#e8e0d0] to-[#f0e9dc] text-gray-900`;
  };

  const getBeakerStyle = () => {
    let baseStyle = "relative rounded-b-xl border-t-0 w-full h-full transition-colors duration-300";
    if (theme === "dark") {
      baseStyle += " bg-gray-700 border-gray-600";
    } else {
      baseStyle += " bg-white/70 border-gray-800";
    }

    let glowStyle = "";
    if (reaction) {
      let glowColor;
      switch (reaction.color) {
        case "light-blue": glowColor = "rgba(59, 130, 246, 0.6)"; break;
        case "yellow-green": glowColor = "rgba(132, 204, 22, 0.6)"; break;
        case "orange": glowColor = "rgba(249, 115, 22, 0.6)"; break;
        case "pink": glowColor = "rgba(236, 72, 153, 0.6)"; break;
        case "milky-white": glowColor = "rgba(229, 231, 235, 0.6)"; break;
        case "deep-red": glowColor = "rgba(239, 68, 68, 0.6)"; break;
        case "gray": glowColor = "rgba(156, 163, 175, 0.6)"; break;
        default: glowColor = "rgba(20, 184, 166, 0.4)";
      }
      glowStyle = `boxShadow: "0 0 20px ${glowColor}, inset 0 0 15px ${glowColor}"`;
    }

    if (reaction) {
      switch (reaction.color) {
        case "light-blue": return {
          className: `${baseStyle} bg-gradient-to-b from-cyan-300 to-blue-300`,
          style: { boxShadow: "0 0 20px rgba(59, 130, 246, 0.6), inset 0 0 15px rgba(59, 130, 246, 0.4)" }
        };
        case "yellow-green": return {
          className: `${baseStyle} bg-gradient-to-b from-yellow-300 to-green-300`,
          style: { boxShadow: "0 0 20px rgba(132, 204, 22, 0.6), inset 0 0 15px rgba(132, 204, 22, 0.4)" }
        };
        case "orange": return {
          className: `${baseStyle} bg-gradient-to-b from-orange-300 to-orange-400`,
          style: { boxShadow: "0 0 20px rgba(249, 115, 22, 0.6), inset 0 0 15px rgba(249, 115, 22, 0.4)" }
        };
        case "pink": return {
          className: `${baseStyle} bg-gradient-to-b from-pink-200 to-pink-300`,
          style: { boxShadow: "0 0 20px rgba(236, 72, 153, 0.6), inset 0 0 15px rgba(236, 72, 153, 0.4)" }
        };
        case "milky-white": return {
          className: `${baseStyle} bg-gradient-to-b from-gray-100 to-gray-200`,
          style: { boxShadow: "0 0 20px rgba(229, 231, 235, 0.6), inset 0 0 15px rgba(229, 231, 235, 0.4)" }
        };
        case "deep-red": return {
          className: `${baseStyle} bg-gradient-to-b from-red-400 to-red-500`,
          style: { boxShadow: "0 0 20px rgba(239, 68, 68, 0.6), inset 0 0 15px rgba(239, 68, 68, 0.4)" }
        };
        case "gray": return {
          className: `${baseStyle} ${theme === "dark" ? "bg-gray-700" : "bg-[#f8f6f0]"}`,
          style: { boxShadow: "0 0 20px rgba(156, 163, 175, 0.4), inset 0 0 10px rgba(156, 163, 175, 0.3)" }
        };
        default: return {
          className: baseStyle,
          style: {}
        };
      }
    }

    return {
      className: baseStyle,
      style: {}
    };
  };

  const renderSelectedCount = () => {
    if (selectedChemicals.length <= 1) return null;

    return (
      <div className="fixed top-4 right-4 z-50 bg-teal-500 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
        <FaLayerGroup size={14} />
        <span className="font-medium">{selectedChemicals.length} selected</span>
      </div>
    );
  };

  return (
    <div className={getBackgroundStyle()}>
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-5">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className="absolute opacity-10">
          <pattern id="lab-grid" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="scale(2) rotate(0)">
            <rect width="100%" height="100%" fill="none" />
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0d9488" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#lab-grid)" />
        </svg>
      </div>

      {/* Floating particles background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {isMounted && Array.from({ length: 15 }).map((_, index) => (
          <motion.div
            key={`particle-${index}`}
            className={`absolute rounded-full ${theme === "dark" ? "bg-teal-500/20" : "bg-teal-600/10"}`}
            style={{
              width: `${5 + Math.random() * 10}px`,
              height: `${5 + Math.random() * 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: `blur(${Math.random() > 0.5 ? 1 : 0}px)`
            }}
            animate={{
              x: [0, Math.random() * 50 - 25, 0],
              y: [0, Math.random() * 50 - 25, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          />
        ))}
        {isMounted && Array.from({ length: 10 }).map((_, index) => (
          <motion.div
            key={`molecular-${index}`}
            className="absolute text-teal-500/10"
            style={{
              fontSize: `${20 + Math.random() * 30}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 20 + Math.random() * 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          >
            <GiMolecule />
          </motion.div>
        ))}
      </div>

      {renderSelectedCount()}

      {/* Mobile hint */}
      {isMobile && showMobileHint && (
        <div className="fixed bottom-6 left-0 right-0 z-50 mx-auto text-center">
          <motion.div
            className="inline-block px-4 py-2 bg-teal-500 text-white rounded-full text-sm shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <span>Tap and hold to drag chemicals</span>
          </motion.div>
        </div>
      )}

      {/* Main content container */}
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Large decorative background elements */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
          <div className="absolute right-[10%] top-[15%] text-teal-700 text-8xl transition-all duration-300">
            <GiMicroscope />
          </div>
          <div className="absolute left-[5%] bottom-[20%] text-teal-800 text-7xl transition-all duration-300">
            <GiTestTubes />
          </div>
          <div className="absolute right-[15%] bottom-[10%] text-teal-600 text-6xl transition-all duration-300">
            <GiChemicalTank />
          </div>
        </div>

        {/* Header */}
        <header className="flex justify-between items-center mb-12 relative z-10">
          <div className="flex items-center gap-4">
            <motion.div
              className="bg-teal-500 text-white p-3 rounded-xl"
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                boxShadow: [
                  theme === "dark" ? "0 0 0px rgba(20, 184, 166, 0)" : "0 0 0px rgba(13, 148, 136, 0)",
                  theme === "dark" ? "0 0 15px rgba(20, 184, 166, 0.5)" : "0 0 15px rgba(13, 148, 136, 0.5)",
                  theme === "dark" ? "0 0 0px rgba(20, 184, 166, 0)" : "0 0 0px rgba(13, 148, 136, 0)"
                ]
              }}
              transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
            >
              <FaVials className="text-2xl" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-teal-700 text-transparent bg-clip-text">
              ChemLab Simulator
            </h1>
          </div>
          <motion.button
            onClick={toggleTheme}
            className={`p-3 rounded-xl transition-all duration-200 ${theme === "dark" ? "bg-gray-700 text-yellow-300 hover:bg-gray-600" : "bg-teal-50 text-teal-700 hover:bg-teal-100"}`}
            aria-label="Toggle theme"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {theme === "dark" ? <IoSunny className="text-xl" /> : <IoMoon className="text-xl" />}
          </motion.button>
        </header>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Main grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {/* Chemical Elements Panel */}
            <motion.div
              className={`${theme === "dark"
                ? "border border-gray-700 bg-gray-800/95 shadow-2xl"
                : "border border-[#d6cfb8] bg-[#f2eadb]/95 shadow-2xl"} 
                rounded-2xl p-6 col-span-1 h-fit backdrop-blur-sm`}
              animate={{
                boxShadow: [
                  theme === "dark"
                    ? "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 15px rgba(20, 184, 166, 0.3)"
                    : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05), 0 0 15px rgba(13, 148, 136, 0.2)",
                ]
              }}
            >
              {/* Panel header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-semibold flex items-center gap-3 ${theme === "dark" ? "text-teal-300" : "text-teal-700"}`}>
                  <IoFlaskOutline className="text-2xl" />
                  Chemical Elements
                </h2>

                {selectedChemicals.length > 0 && (
                  <motion.button
                    onClick={clearSelections}
                    className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${theme === "dark"
                      ? "bg-red-700 hover:bg-red-600 text-white"
                      : "bg-red-400 hover:bg-red-600 text-white"
                      }`}
                    title="Clear selections"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaTimes size={12} />
                    Clear
                  </motion.button>
                )}
              </div>

              {/* Chemical grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {chemicals.map((chemical) => (
                  <DraggableChemical
                    key={chemical.id}
                    id={chemical.id}
                    isSelected={selectedChemicals.includes(chemical.id)}
                    onSelect={() => toggleChemicalSelection(chemical.id)}
                  >
                    <motion.div
                      className={`${isMultiDragging ? '' : 'cursor-pointer'} p-4 rounded-xl flex flex-col items-center justify-center text-center ${theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600 border-gray-600"
                        : "bg-[#e9e1d0] hover:bg-[#e0d9c3] border-[#d6cfb8]"
                        } transition-all duration-200 shadow-lg border-2 ${selectedChemicals.includes(chemical.id)
                          ? `border-teal-500 ring-2 ring-teal-500 ring-offset-2 ${theme === "dark" ? "ring-offset-gray-800" : "ring-offset-[#f2eadb]"}`
                          : ''
                        } ${!selectedChemicals.includes(chemical.id) && beaker.length + selectedChemicals.length >= 5
                          ? theme === "dark" 
                            ? "opacity-50 cursor-not-allowed bg-gray-800/50" 
                            : "opacity-50 cursor-not-allowed bg-gray-300/50"
                          : ''
                        }`}
                      whileHover={{
                        scale: (!selectedChemicals.includes(chemical.id) && beaker.length + selectedChemicals.length >= 5) ? 1 : 1.05,
                        boxShadow: (!selectedChemicals.includes(chemical.id) && beaker.length + selectedChemicals.length >= 5) ? "none" : (theme === "dark" ? glowEffects.dark.primary : glowEffects.light.primary)
                      }}
                      whileTap={{ scale: (!selectedChemicals.includes(chemical.id) && beaker.length + selectedChemicals.length >= 5) ? 1 : 0.98 }}
                      style={{
                        boxShadow: selectedChemicals.includes(chemical.id)
                          ? theme === "dark" ? glowEffects.dark.primary : glowEffects.light.primary
                          : "none"
                      }}
                      onClick={() => {
                        // Don't allow selection if total would exceed 5
                        if (!selectedChemicals.includes(chemical.id) && beaker.length + selectedChemicals.length >= 5) {
                          return;
                        }
                        toggleChemicalSelection(chemical.id);
                      }}
                    >
                      <div
                        className="w-16 h-16 rounded-full mb-3 flex items-center justify-center relative overflow-hidden transform transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: theme === "dark"
                            ? `rgba(100, 100, 100, 0.5)`
                            : `rgba(240, 240, 240, 0.8)`,
                          border: `3px solid ${chemical.id === "acid" ? "#10B981" :
                            chemical.id === "base" ? "#3B82F6" :
                              chemical.id === "salt" ? "#F59E0B" :
                                chemical.id === "catalyst" ? "#8B5CF6" :
                                  chemical.id === "alcohol" ? "#60A5FA" :
                                    "#78350F"
                            }`,
                          boxShadow: selectedChemicals.includes(chemical.id)
                            ? (theme === "dark"
                              ? `0 0 20px ${chemical.id === "acid" ? "rgba(16, 185, 129, 0.8)" :
                                chemical.id === "base" ? "rgba(59, 130, 246, 0.8)" :
                                  chemical.id === "salt" ? "rgba(245, 158, 11, 0.8)" :
                                    chemical.id === "catalyst" ? "rgba(139, 92, 246, 0.8)" :
                                      chemical.id === "alcohol" ? "rgba(96, 165, 250, 0.8)" :
                                        "rgba(120, 53, 15, 0.8)"}`
                              : `0 0 20px ${chemical.id === "acid" ? "rgba(16, 185, 129, 0.6)" :
                                chemical.id === "base" ? "rgba(59, 130, 246, 0.6)" :
                                  chemical.id === "salt" ? "rgba(245, 158, 11, 0.6)" :
                                    chemical.id === "catalyst" ? "rgba(139, 92, 246, 0.6)" :
                                      chemical.id === "alcohol" ? "rgba(96, 165, 250, 0.6)" :
                                        "rgba(120, 53, 15, 0.6)"}`)
                            : "0 6px 20px rgba(0, 0, 0, 0.1)"
                        }}
                      >
                        <div className="absolute inset-0 opacity-20" style={{
                          background: `radial-gradient(circle at 30% 30%, ${chemical.id === "acid" ? "#10B98180" :
                            chemical.id === "base" ? "#3B82F680" :
                              chemical.id === "salt" ? "#F59E0B80" :
                                chemical.id === "catalyst" ? "#8B5CF680" :
                                  chemical.id === "alcohol" ? "#60A5FA80" :
                                    "#78350F80"
                            }, transparent 70%)`
                        }}></div>
                        <div className="relative z-10" style={{
                          color: chemical.id === "acid" ? "#10B981" :
                            chemical.id === "base" ? "#3B82F6" :
                              chemical.id === "salt" ? "#F59E0B" :
                                chemical.id === "catalyst" ? "#8B5CF6" :
                                  chemical.id === "alcohol" ? "#60A5FA" :
                                    "#78350F",
                          filter: selectedChemicals.includes(chemical.id) ? "drop-shadow(0 0 8px currentColor)" : "none",
                          transform: selectedChemicals.includes(chemical.id) ? "scale(1.1)" : "scale(1)",
                          transition: "all 0.3s ease"
                        }}>
                          <motion.div
                            animate={selectedChemicals.includes(chemical.id) ?
                              { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } :
                              {}
                            }
                            transition={{ duration: 2, repeat: selectedChemicals.includes(chemical.id) ? Infinity : 0, repeatType: "reverse" }}
                          >
                            {chemical.icon}
                          </motion.div>
                        </div>
                      </div>
                      <span className="font-semibold text-sm">{chemical.name}</span>
                      <span className={`text-xs font-mono mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{chemical.formula}</span>
                    </motion.div>
                  </DraggableChemical>
                ))}
              </div>

              {/* Add selected chemicals button */}
              <AnimatePresence>
                {selectedChemicals.length > 0 && (
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.button
                      onClick={addSelectedToBeaker}
                      disabled={isProcessing || beaker.length >= 5}
                      className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-3 transition-all duration-200 ${
                        isProcessing || beaker.length >= 5
                          ? theme === "dark" 
                            ? "bg-gray-700/50 text-gray-500 cursor-not-allowed" 
                            : "bg-gray-200/50 text-gray-400 cursor-not-allowed"
                          : theme === "dark"
                            ? "bg-teal-600 hover:bg-teal-500 text-white shadow-lg hover:shadow-xl"
                            : "bg-teal-500 hover:bg-teal-600 text-white shadow-lg hover:shadow-xl"
                      }`}
                      whileHover={!isProcessing && beaker.length < 5 ? { scale: 1.02 } : {}}
                      whileTap={!isProcessing && beaker.length < 5 ? { scale: 0.98 } : {}}
                      animate={!isProcessing && beaker.length < 5 ? {
                        boxShadow: [
                          theme === "dark" ? "0 4px 14px 0 rgba(20, 184, 166, 0.3)" : "0 4px 14px 0 rgba(13, 148, 136, 0.3)",
                          theme === "dark" ? "0 6px 20px 0 rgba(20, 184, 166, 0.4)" : "0 6px 20px 0 rgba(13, 148, 136, 0.4)",
                          theme === "dark" ? "0 4px 14px 0 rgba(20, 184, 166, 0.3)" : "0 4px 14px 0 rgba(13, 148, 136, 0.3)"
                        ]
                      } : {}}
                      transition={{ 
                        boxShadow: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                      }}
                    >
                      <IoBeaker className="text-lg" />
                      <span>
                        Add {Math.min(selectedChemicals.length, 5 - beaker.length)} Chemical{Math.min(selectedChemicals.length, 5 - beaker.length) !== 1 ? 's' : ''} to Beaker
                        {selectedChemicals.length > (5 - beaker.length) && ` (${selectedChemicals.length - (5 - beaker.length)} won't fit)`}
                      </span>
                      {isProcessing && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4"
                        >
                          <FaAtom size={16} />
                        </motion.div>
                      )}
                    </motion.button>
                    
                    {beaker.length >= 5 && (
                      <motion.p 
                        className={`text-xs mt-2 text-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        Beaker is full. Clear it to add more chemicals.
                      </motion.p>
                    )}

                    {beaker.length + selectedChemicals.length >= 5 && beaker.length < 5 && (
                      <motion.p 
                        className={`text-xs mt-2 text-center ${theme === "dark" ? "text-amber-400" : "text-amber-600"}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        Selection limit reached. Beaker has {beaker.length}, can add {5 - beaker.length} more (total max: 5).
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Instructions panel */}
              <div className={`p-4 ${theme === "dark" ? "bg-gray-700/80 border-gray-600" : "bg-[#e7ddc4]/80 border-[#d6cfb8]"} rounded-xl border-2`}>
                <ul className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-amber-800"} list-none space-y-4`}>
                  <li className="flex items-start gap-3 p-3 rounded-lg transition-all hover:scale-[1.02]">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-teal-500/20 text-teal-500 flex-shrink-0 mt-0.5">
                      <span className="text-sm font-semibold">1</span>
                    </div>
                    <span className="flex-1 leading-relaxed">
                      Click on chemicals to select them <span className="opacity-75">(click again to unselect)</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg transition-all hover:scale-[1.02]">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-teal-500/20 text-teal-500 flex-shrink-0 mt-0.5">
                      <span className="text-sm font-semibold">2</span>
                    </div>
                    <span className="flex-1 leading-relaxed">
                      Use the button above or drag chemicals to add them to the beaker
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Laboratory Panel */}
            <motion.div
              className={`${theme === "dark"
                ? "border border-gray-700/50 bg-gray-800/95 shadow-2xl backdrop-blur-lg"
                : "border border-[#d6cfb8]/60 bg-[#eae2cf]/95 shadow-2xl backdrop-blur-lg"} 
                 rounded-2xl p-8 col-span-1 lg:col-span-2 h-fit flex flex-col
                 hover:border-teal-500/30 transition-all duration-300`}
              animate={{
                boxShadow: [
                  theme === "dark"
                    ? "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(96, 165, 250, 0.2)"
                    : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05), 0 0 20px rgba(59, 130, 246, 0.15)"
                ]
              }}
            >
              {/* Laboratory header */}
              <h2 className={`text-2xl font-bold mb-8 flex items-center gap-4 ${theme === "dark" ? "text-teal-300" : "text-teal-700"}`}>
                <div className="p-3 rounded-xl bg-teal-500/10">
                  <IoBeaker className="w-7 h-7" />
                </div>
                Laboratory
              </h2>

              {/* Laboratory workspace */}
              <div className="flex-grow flex flex-col items-center justify-center relative min-h-[400px] md:min-h-[500px] p-4 md:p-8">
                {/* Background pattern */}
                <div className="absolute inset-0 overflow-hidden z-0 rounded-xl">
                  <div className={`w-full h-full ${theme === "dark" ?
                    "bg-gray-800/30" :
                    "bg-white/50"}`}></div>
                  <div className="absolute inset-0 opacity-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                      <pattern id="lab-dots" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="scale(1) rotate(0)">
                        <rect width="100%" height="100%" fill="none" />
                        <circle cx="10" cy="10" r="1" fill={theme === "dark" ? "#ffffff" : "#0d9488"} />
                      </pattern>
                      <rect width="100%" height="100%" fill="url(#lab-dots)" />
                    </svg>
                  </div>
                </div>

                {/* Beaker container */}
                <div className="relative z-10 w-full flex flex-col items-center">
                  <div className="relative">
                    <DroppableBeaker>
                      {/* Beaker top rim */}
                      <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-36 sm:w-40 md:w-48 h-4 sm:h-5 md:h-6 rounded-t-xl border-2 border-b-0 ${theme === "dark" ? "border-gray-600/80 bg-gray-600/40" : "border-gray-400/90 bg-white/60"} backdrop-blur-sm`}></div>
                      
                      {/* Main beaker body */}
                      <div className={`absolute top-4 sm:top-5 md:top-6 left-1/2 transform -translate-x-1/2 w-32 sm:w-36 md:w-40 h-44 sm:h-48 md:h-56 rounded-b-xl border-2 border-t-0 ${theme === "dark" ? "border-gray-600/80 bg-gray-700/40" : "border-gray-400/90 bg-white/60"} overflow-hidden shadow-inner backdrop-blur-sm`}>
                        <div className={getBeakerStyle().className} style={{
                          ...getBeakerStyle().style,
                          boxShadow: "inset 0 0 20px rgba(255, 255, 255, 0.1), inset 8px 8px 20px rgba(0, 0, 0, 0.05)",
                          position: "relative"
                        }}>

                          {/* Glass effect overlay */}
                          <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                            <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-white to-transparent"></div>
                            <div className="absolute top-0 left-[15%] h-full w-[1px] bg-gradient-to-b from-white to-transparent opacity-50"></div>
                            <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-white to-transparent"></div>
                            <div className="absolute top-0 right-[15%] h-full w-[1px] bg-gradient-to-b from-white to-transparent opacity-50"></div>
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-white via-transparent to-white"></div>
                          </div>

                          {/* Chemicals inside beaker */}
                          {beaker.length > 0 && (
                            <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 right-1 sm:right-2 flex flex-col-reverse gap-0.5 sm:gap-1 z-20">
                              {beaker.map((chemId, index) => {
                                const chem = chemicals.find(c => c.id === chemId);
                                // Dynamic sizing based on number of chemicals and screen size
                                const getChemicalSize = () => {
                                  const isMobile = window.innerWidth < 640;
                                  if (isMobile) {
                                    if (beaker.length <= 2) return { padding: 'px-2 py-1.5', text: 'text-xs', gap: 'gap-1.5', dot: 'text-sm' };
                                    if (beaker.length <= 3) return { padding: 'px-2 py-1', text: 'text-xs', gap: 'gap-1', dot: 'text-xs' };
                                    if (beaker.length <= 4) return { padding: 'px-1.5 py-0.5', text: 'text-[10px]', gap: 'gap-1', dot: 'text-xs' };
                                    return { padding: 'px-1.5 py-0.5', text: 'text-[10px]', gap: 'gap-0.5', dot: 'text-[10px]' };
                                  } else {
                                    if (beaker.length <= 2) return { padding: 'px-3 py-2', text: 'text-sm', gap: 'gap-2', dot: 'text-base' };
                                    if (beaker.length <= 3) return { padding: 'px-3 py-1.5', text: 'text-sm', gap: 'gap-2', dot: 'text-sm' };
                                    if (beaker.length <= 4) return { padding: 'px-2 py-1', text: 'text-xs', gap: 'gap-1.5', dot: 'text-sm' };
                                    return { padding: 'px-2 py-1', text: 'text-xs', gap: 'gap-1', dot: 'text-sm' };
                                  }
                                };
                                const size = getChemicalSize();
                                
                                return (
                                  <motion.div
                                    key={index}
                                    className={`w-full ${size.padding} rounded-md sm:rounded-lg ${size.text} flex items-center justify-between ${theme === "dark" ? "bg-gray-700/95" : "bg-white/95"
                                      } shadow-md backdrop-blur-sm border border-gray-300/50`}
                                    style={{
                                      borderColor: lastAddedChemical === chemId ? '#0D9488' : (theme === "dark" ? '#374151' : '#e6dfd0')
                                    }}
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{ 
                                      opacity: 1, 
                                      scale: 1, 
                                      y: 0,
                                      boxShadow: lastAddedChemical === chemId ? [
                                        "0 1px 2px rgba(0,0,0,0.1)",
                                        `0 0 8px ${chem?.id === "acid" ? "rgba(16, 185, 129, 0.5)" :
                                          chem?.id === "base" ? "rgba(59, 130, 246, 0.5)" :
                                            chem?.id === "salt" ? "rgba(245, 158, 11, 0.5)" :
                                              chem?.id === "catalyst" ? "rgba(139, 92, 246, 0.5)" :
                                                chem?.id === "alcohol" ? "rgba(96, 165, 250, 0.5)" :
                                                  "rgba(120, 53, 15, 0.5)"}`,
                                        "0 1px 2px rgba(0,0,0,0.1)"
                                      ] : ["0 1px 2px rgba(0,0,0,0.1)"]
                                    }}
                                    transition={{ 
                                      duration: 0.3, 
                                      delay: index * 0.1,
                                      boxShadow: { duration: 1.5, repeat: Infinity }
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                  >
                                    <div className={`flex items-center ${size.gap} flex-1 min-w-0`}>
                                      <span className={`${size.dot} font-semibold flex-shrink-0`} style={{
                                        color: chem?.id === "acid" ? "#10B981" :
                                          chem?.id === "base" ? "#3B82F6" :
                                            chem?.id === "salt" ? "#F59E0B" :
                                              chem?.id === "catalyst" ? "#8B5CF6" :
                                                chem?.id === "alcohol" ? "#60A5FA" :
                                                  "#78350F"
                                      }}>●</span>
                                      <span className={`font-medium ${size.text} truncate`}>{chem?.name}</span>
                                    </div>

                                    <motion.button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeFromBeaker(index);
                                      }}
                                      whileHover={{ scale: 1.2 }}
                                      whileTap={{ scale: 0.9 }}
                                      className={`rounded-full flex items-center justify-center ${beaker.length <= 2 ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-3 h-3 sm:w-4 sm:h-4'} 
                                          ${theme === "dark"
                                          ? "bg-gray-600/90 hover:bg-gray-500/90 text-white"
                                          : "bg-teal-100/90 hover:bg-teal-200/90 text-teal-700"
                                        } opacity-70 hover:opacity-100 transition-opacity flex-shrink-0`}
                                      aria-label={`Remove ${chem?.name}`}
                                      title={`Remove ${chem?.name}`}
                                    >
                                      <FaTimes size={beaker.length <= 2 ? 8 : 6} />
                                    </motion.button>
                                  </motion.div>
                                );
                              })}
                            </div>
                          )}

                          {renderReactionEffect()}

                          {/* Empty beaker prompt */}
                          {beaker.length === 0 && (
                            <motion.div
                              className="absolute inset-0 flex items-center justify-center z-10"
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: [0.6, 0.9, 0.6],
                                y: [0, -5, 0]
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatType: "reverse"
                              }}
                            >
                              <div className={`text-center p-3 sm:p-4 rounded-lg sm:rounded-xl ${theme === "dark" ? "bg-gray-800/60 text-teal-300" : "bg-white/60 text-teal-700"} backdrop-blur-sm`}>
                                <motion.div
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <FaArrowDown className="text-lg sm:text-xl mx-auto mb-1 sm:mb-2" />
                                  <p className="text-xs sm:text-sm font-medium">Drop chemicals here</p>
                                </motion.div>
                              </div>
                            </motion.div>
                          )}

                          {/* Add effect animation */}
                          <AnimatePresence>
                            {showAddEffect && lastAddedChemical && (
                              <motion.div
                                className="absolute inset-0 flex items-center justify-center"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.2 }}
                                transition={{ duration: 0.5 }}
                              >
                                <motion.div
                                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm"
                                  animate={{
                                    boxShadow: [
                                      "0 0 8px rgba(255, 255, 255, 0.5)",
                                      "0 0 25px rgba(255, 255, 255, 0.7)",
                                      "0 0 8px rgba(255, 255, 255, 0.5)"
                                    ]
                                  }}
                                  transition={{ duration: 1.2, repeat: 1 }}
                                >
                                  {(() => {
                                    const chem = chemicals.find(c => c.id === lastAddedChemical);
                                    return chem ? (
                                      <motion.div
                                        className="text-2xl sm:text-3xl"
                                        style={{
                                          color: chem.id === "acid" ? "#10B981" :
                                            chem.id === "base" ? "#3B82F6" :
                                              chem.id === "salt" ? "#F59E0B" :
                                                chem.id === "catalyst" ? "#8B5CF6" :
                                                  chem.id === "alcohol" ? "#60A5FA" :
                                                    "#78350F"
                                        }}
                                        animate={beaker.includes(lastAddedChemical) ?
                                          { scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7], rotate: [0, 15, -15, 0] } :
                                          { scale: [1, 0.5], opacity: [1, 0], y: [0, -30] }
                                        }
                                        transition={{ duration: 0.6 }}
                                      >
                                        {chem.icon}
                                      </motion.div>
                                    ) : null;
                                  })()}
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Experimenting overlay */}
                          <AnimatePresence>
                            {showExperimenting && (
                              <motion.div
                                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="text-center">
                                  <motion.div
                                    animate={{
                                      rotate: 360,
                                      boxShadow: [
                                        "0 0 8px rgba(255, 255, 255, 0.3)",
                                        "0 0 20px rgba(255, 255, 255, 0.6)",
                                        "0 0 8px rgba(255, 255, 255, 0.3)"
                                      ]
                                    }}
                                    transition={{
                                      rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                                      boxShadow: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                    className="mx-auto mb-2 sm:mb-3 text-white/90 p-2 sm:p-3 rounded-full inline-flex justify-center items-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-800/20"
                                  >
                                    <FaAtom size={window.innerWidth < 640 ? 24 : 32} />
                                  </motion.div>
                                  <p className="text-sm sm:text-base font-medium text-white">Experimenting...</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Beaker measurement lines */}
                        <div className="absolute left-1 sm:left-2 top-0 h-full w-2 sm:w-3 flex flex-col justify-between py-2 sm:py-4 opacity-70">
                          <div className="w-2 sm:w-3 h-[1px] bg-gray-400"></div>
                          <div className="w-1 sm:w-2 h-[1px] bg-gray-400 ml-0.5 sm:ml-1"></div>
                          <div className="w-2 sm:w-3 h-[1px] bg-gray-400"></div>
                          <div className="w-1 sm:w-2 h-[1px] bg-gray-400 ml-0.5 sm:ml-1"></div>
                          <div className="w-2 sm:w-3 h-[1px] bg-gray-400"></div>
                        </div>
                      </div>

                      {/* Beaker base */}
                      <div className={`absolute -bottom-4 sm:-bottom-6 left-1/2 transform -translate-x-1/2 w-44 sm:w-52 md:w-56 h-3 sm:h-4 ${theme === "dark" ? "bg-gray-700/90" : "bg-[#d6d0c4]/90"} rounded-lg`}></div>

                      {/* Clear beaker button - moved outside and below */}
                      {beaker.length > 0 && (
                        <div className="absolute w-full text-center -bottom-12 sm:-bottom-16">
                          <motion.button
                            onClick={resetExperiment}
                            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm flex items-center gap-2 mx-auto ${theme === "dark"
                              ? "bg-gray-700/90 hover:bg-gray-600/90 text-white"
                              : "bg-red-50/90 hover:bg-red-100/90 text-red-600 border-2 border-red-200/50"
                              } backdrop-blur-sm shadow-md`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                          >
                            <FaTrash size={12} />
                            Clear Beaker
                          </motion.button>
                        </div>
                      )}
                    </DroppableBeaker>
                  </div>

                  {/* Reaction information panel */}
                  <div className={`w-full flex justify-center transition-all duration-300 ${
                    showInfo && reaction 
                      ? 'mt-16 sm:mt-20 min-h-[180px] sm:min-h-[200px]' 
                      : beaker.length > 0 
                        ? 'mt-10 sm:mt-12' 
                        : 'mt-6 sm:mt-8'
                  }`}>
                    <AnimatePresence mode="wait" initial={false}>
                      {showInfo && reaction && (
                        <motion.div
                          key="reaction-info"
                          className={`w-full max-w-sm sm:max-w-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 ${theme === "dark" ? "bg-gray-800/95 border border-gray-700/50" : "bg-[#f2eadb]/95 border border-[#d6cfb8]/50"
                            } shadow-2xl backdrop-blur-sm relative overflow-hidden`}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            boxShadow: reaction ? [
                              theme === "dark"
                                ? "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2)"
                                : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
                              theme === "dark"
                                ? `0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2), 0 0 25px ${getReactionGlowColor(reaction.color, 0.6)}`
                                : `0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05), 0 0 25px ${getReactionGlowColor(reaction.color, 0.5)}`,
                              theme === "dark"
                                ? "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2)"
                                : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)"
                            ] : []
                          }}
                          exit={{ opacity: 0, y: 30 }}
                          transition={{
                            duration: 0.5,
                            ease: "easeOut",
                            boxShadow: { duration: 2.5, repeat: Infinity, repeatType: "reverse" }
                          }}
                        >
                          {/* Glowing background effects */}
                          <div className="absolute -right-8 sm:-right-12 -top-8 sm:-top-12 w-32 sm:w-48 h-32 sm:h-48 rounded-full blur-3xl opacity-20"
                            style={{
                              background: `radial-gradient(circle, ${getReactionGlowColor(reaction.color, 0.8)} 0%, transparent 70%)`,
                              animation: 'pulse 10s infinite alternate'
                            }}>
                          </div>
                          <div className="absolute -left-6 sm:-left-8 -bottom-6 sm:-bottom-8 w-16 sm:w-24 h-16 sm:h-24 rounded-full blur-2xl opacity-15"
                            style={{
                              background: `radial-gradient(circle, ${getReactionGlowColor(reaction.color, 0.6)} 0%, transparent 70%)`,
                              animation: 'pulse 8s infinite alternate-reverse'
                            }}>
                          </div>

                          {/* Reaction info content */}
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 relative z-10 gap-2 sm:gap-4">
                            <motion.h3
                              className={`text-lg sm:text-2xl font-bold ${theme === "dark" ? "text-teal-300" : "text-teal-700"} flex-1`}
                              initial={{ opacity: 0, x: -15 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              {reaction.name}
                            </motion.h3>
                            <motion.div
                              className={`px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full self-start sm:flex-shrink-0 ${reaction.effect === "none" ? "bg-gray-100/90 text-gray-500" :
                                reaction.effect === "bubbling" || reaction.effect === "fizzing" ? "bg-blue-100/90 text-blue-600" :
                                  reaction.effect === "heat" ? "bg-red-100/90 text-red-600" :
                                    reaction.effect === "smoke" ? "bg-gray-100/90 text-gray-600" :
                                      reaction.effect === "aroma" ? "bg-pink-100/90 text-pink-600" :
                                        reaction.effect === "foam" ? "bg-yellow-100/90 text-yellow-600" :
                                          reaction.effect === "complex" || reaction.effect === "synthesis" ? "bg-purple-100/90 text-purple-600" :
                                            "bg-teal-100/90 text-teal-600"
                                } backdrop-blur-sm shadow-md`}
                              initial={{ opacity: 0, scale: 0.7 }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                                boxShadow: [
                                  "0 2px 4px rgba(0, 0, 0, 0.1)",
                                  `0 2px 4px rgba(0, 0, 0, 0.1), 0 0 8px ${getReactionGlowColor(reaction.color, 0.4)}`,
                                  "0 2px 4px rgba(0, 0, 0, 0.1)"
                                ]
                              }}
                              transition={{
                                delay: 0.3,
                                type: "spring",
                                boxShadow: {
                                  repeat: Infinity,
                                  duration: 2.5,
                                  repeatType: "reverse"
                                }
                              }}
                            >
                              {reaction.effect.charAt(0).toUpperCase() + reaction.effect.slice(1)}
                            </motion.div>
                          </div>

                          <motion.p
                            className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"} text-sm sm:text-base leading-relaxed mb-4 sm:mb-6`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            {reaction.description}
                          </motion.p>

                          <motion.div
                            className={`mb-4 sm:mb-6 p-3 sm:p-4 ${theme === "dark" ? "bg-gray-700/80 border-gray-600/50" : "bg-white/80 border-gray-100/50"} rounded-lg sm:rounded-xl font-mono text-xs sm:text-sm text-center border-2 backdrop-blur-sm relative group`}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              boxShadow: [
                                "inset 0 2px 4px rgba(0,0,0,0.05)",
                                `inset 0 2px 4px rgba(0,0,0,0.05), 0 0 12px ${getReactionGlowColor(reaction.color, 0.3)}`,
                                "inset 0 2px 4px rgba(0,0,0,0.05)"
                              ]
                            }}
                            transition={{
                              delay: 0.5,
                              boxShadow: { duration: 3, repeat: Infinity, repeatType: "mirror" }
                            }}
                            whileHover={{
                              scale: 1.02,
                              boxShadow: `inset 0 2px 4px rgba(0,0,0,0.05), 0 0 16px ${getReactionGlowColor(reaction.color, 0.5)}`
                            }}
                          >
                            <span className="relative z-10 font-semibold leading-relaxed break-words">{reaction.formula}</span>
                          </motion.div>

                          <div className="flex justify-end">
                            <motion.button
                              onClick={resetExperiment}
                              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${theme === "dark"
                                ? "bg-teal-500/25 hover:bg-teal-500/35 text-teal-300"
                                : "bg-teal-500 hover:bg-teal-600 text-white"
                                } backdrop-blur-sm shadow-lg hover:shadow-xl`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6 }}
                            >
                              New Experiment
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </DndContext>

        {/* Drag overlay for dragging animation */}
        <DragOverlay zIndex={1000} dropAnimation={{
          duration: 500,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: '0.5',
              },
            },
          }),
        }}>
          {activeId ? (
            <div className="shadow-2xl" id={activeId}>
              {chemicals.find(c => c.id === activeId) && (
                <motion.div
                  className={`p-5 rounded-xl flex flex-col items-center justify-center ${theme === "dark" ? "bg-gray-700/95" : "bg-[#f0f5f5]/95"
                    } relative border-3 border-teal-500 backdrop-blur-sm`}
                  style={{
                    boxShadow: `0 15px 40px -5px ${chemicals.find(c => c.id === activeId)?.id === "acid"
                      ? "rgba(16, 185, 129, 0.5)"
                      : chemicals.find(c => c.id === activeId)?.id === "base"
                        ? "rgba(59, 130, 246, 0.5)"
                        : chemicals.find(c => c.id === activeId)?.id === "salt"
                          ? "rgba(245, 158, 11, 0.5)"
                          : chemicals.find(c => c.id === activeId)?.id === "catalyst"
                            ? "rgba(139, 92, 246, 0.5)"
                            : chemicals.find(c => c.id === activeId)?.id === "alcohol"
                              ? "rgba(96, 165, 250, 0.5)"
                              : "rgba(120, 53, 15, 0.5)"
                      }`
                  }}
                  initial={{ scale: 0.9, y: 0 }}
                  animate={{
                    scale: 1.1,
                    y: -15,
                    rotate: [0, 3, -3, 0]
                  }}
                  transition={{
                    duration: 0.3,
                    rotate: {
                      repeat: Infinity,
                      duration: 3
                    }
                  }}
                >
                  <div className="absolute -top-3 -right-3 bg-teal-500 text-white text-sm font-bold rounded-full flex items-center justify-center px-2 py-1">
                    {isMultiDragging ? (
                      <span>{selectedChemicals.length}</span>
                    ) : (
                      <span className="text-sm">+</span>
                    )}
                  </div>
                  <div
                    className="w-16 h-16 rounded-full mb-3 flex items-center justify-center"
                    style={{
                      backgroundColor: theme === "dark"
                        ? `rgba(100, 100, 100, 0.8)`
                        : `rgba(240, 240, 240, 0.9)`,
                      border: `3px solid ${chemicals.find(c => c.id === activeId)?.id === "acid"
                        ? "#10B981"
                        : chemicals.find(c => c.id === activeId)?.id === "base"
                          ? "#3B82F6"
                          : chemicals.find(c => c.id === activeId)?.id === "salt"
                            ? "#F59E0B"
                            : chemicals.find(c => c.id === activeId)?.id === "catalyst"
                              ? "#8B5CF6"
                              : chemicals.find(c => c.id === activeId)?.id === "alcohol"
                                ? "#60A5FA"
                                : "#78350F"
                        }`,
                      color: chemicals.find(c => c.id === activeId)?.id === "acid"
                        ? "#10B981"
                        : chemicals.find(c => c.id === activeId)?.id === "base"
                          ? "#3B82F6"
                          : chemicals.find(c => c.id === activeId)?.id === "salt"
                            ? "#F59E0B"
                            : chemicals.find(c => c.id === activeId)?.id === "catalyst"
                              ? "#8B5CF6"
                              : chemicals.find(c => c.id === activeId)?.id === "alcohol"
                                ? "#60A5FA"
                                : "#78350F"
                    }}
                  >
                    <div className="text-3xl">
                      {chemicals.find(c => c.id === activeId)?.icon}
                    </div>
                  </div>
                  <span className="font-bold text-lg">
                    {chemicals.find(c => c.id === activeId)?.name}
                  </span>
                </motion.div>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </div>

      {/* Footer */}
      <footer className="py-8 mt-16 text-center relative z-10">
        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          ChemLab Simulator - A Fun Chemistry Simulation Experience
        </p>
      </footer>
    </div>
  );
}
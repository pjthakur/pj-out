"use client"
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSettings, 
  FiHeart, 
  FiStar, 
  FiEye, 
  FiZap, 
  FiTrendingUp,
  FiPlay,
  FiPause,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
  FiInfo,
  FiSun,
  FiMoon,
  FiActivity,
  FiGitBranch,
  FiVolume2,
  FiVolumeX,
  FiX,
  FiMousePointer,
  FiSearch,
  FiSmartphone,
  FiTarget,
  FiCommand,
  FiCheck
} from "react-icons/fi";
import { 
  HiSparkles, 
  HiLightningBolt, 
  HiColorSwatch,
  HiBeaker,
  HiCog
} from "react-icons/hi";
import { GiDoubleDragon, GiSpikedDragonHead, GiSniffingDog, GiMonkey, GiHummingbird, GiSnake } from "react-icons/gi";
import { FaDragon, FaFire } from "react-icons/fa";
interface Trait {
  id: string;
  name: string;
  type: 'color' | 'pattern' | 'size' | 'ability' | 'special';
  value: string;
  dominance: 'dominant' | 'recessive' | 'codominant';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  iconType: string;
}
interface Pet {
  id: string;
  name: string;
  species: 'dragon' | 'unicorn' | 'phoenix' | 'griffin' | 'dog' | 'monkey' | 'hummingbird' | 'snake';
  generation: number;
  traits: Trait[];
  parents?: [string, string];
  birthTime: number;
  happiness: number;
  energy: number;
  image: string;
}
interface BreedingState {
  isBreeding: boolean;
  progress: number;
  stage: 'selecting' | 'mixing' | 'incubating' | 'hatching' | 'complete';
  selectedParents: [Pet | null, Pet | null];
  offspring: Pet | null;
}
interface TreeNode {
  pet: Pet;
  x: number;
  y: number;
  level: number;
  children: TreeNode[];
  parent?: TreeNode;
}
const TRAIT_LIBRARY: Trait[] = [
  { id: 'red', name: 'Crimson', type: 'color', value: '#DC2626', dominance: 'dominant', rarity: 'common', iconType: 'color' },
  { id: 'blue', name: 'Azure', type: 'color', value: '#2563EB', dominance: 'dominant', rarity: 'common', iconType: 'color' },
  { id: 'gold', name: 'Golden', type: 'color', value: '#F59E0B', dominance: 'recessive', rarity: 'rare', iconType: 'sparkles' },
  { id: 'violet', name: 'Violet', type: 'color', value: '#7C3AED', dominance: 'recessive', rarity: 'legendary', iconType: 'sparkles' },
  { id: 'stripes', name: 'Striped', type: 'pattern', value: 'stripes', dominance: 'dominant', rarity: 'common', iconType: 'eye' },
  { id: 'spots', name: 'Spotted', type: 'pattern', value: 'spots', dominance: 'codominant', rarity: 'uncommon', iconType: 'eye' },
  { id: 'gradient', name: 'Gradient', type: 'pattern', value: 'gradient', dominance: 'recessive', rarity: 'rare', iconType: 'sparkles' },
  { id: 'tiny', name: 'Tiny', type: 'size', value: 'tiny', dominance: 'recessive', rarity: 'uncommon', iconType: 'star' },
  { id: 'normal', name: 'Normal', type: 'size', value: 'normal', dominance: 'dominant', rarity: 'common', iconType: 'star' },
  { id: 'large', name: 'Large', type: 'size', value: 'large', dominance: 'dominant', rarity: 'uncommon', iconType: 'star' },
  { id: 'giant', name: 'Giant', type: 'size', value: 'giant', dominance: 'recessive', rarity: 'rare', iconType: 'trending' },
  { id: 'fire', name: 'Fire Breath', type: 'ability', value: 'fire', dominance: 'dominant', rarity: 'uncommon', iconType: 'zap' },
  { id: 'ice', name: 'Ice Shard', type: 'ability', value: 'ice', dominance: 'dominant', rarity: 'uncommon', iconType: 'zap' },
  { id: 'lightning', name: 'Lightning', type: 'ability', value: 'lightning', dominance: 'recessive', rarity: 'rare', iconType: 'lightning' },
  { id: 'healing', name: 'Healing', type: 'ability', value: 'healing', dominance: 'recessive', rarity: 'legendary', iconType: 'heart' },
  { id: 'glow', name: 'Bioluminescent', type: 'special', value: 'glow', dominance: 'recessive', rarity: 'rare', iconType: 'sun' },
  { id: 'invisible', name: 'Invisibility', type: 'special', value: 'invisible', dominance: 'recessive', rarity: 'legendary', iconType: 'eye' },
];
class SoundManager {
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.3;
  constructor() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }
  private async initializeAudio() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }
  setMuted(muted: boolean) {
    this.isMuted = muted;
  }
  setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }
  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 1) {
    if (!this.audioContext || this.isMuted) return;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * this.masterVolume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }
  private createChord(frequencies: number[], duration: number, type: OscillatorType = 'sine', volume: number = 1) {
    frequencies.forEach(freq => {
      this.createTone(freq, duration, type, volume / frequencies.length);
    });
  }
  async playSuccess() {
    await this.initializeAudio();
    this.createChord([523.25, 659.25, 783.99], 0.3, 'sine', 0.4); 
    setTimeout(() => {
      this.createChord([587.33, 739.99, 880.00], 0.4, 'sine', 0.3); 
    }, 200);
  }
  async playFailure() {
    await this.initializeAudio();
    this.createTone(400, 0.2, 'sine', 0.3);
    setTimeout(() => this.createTone(350, 0.2, 'sine', 0.3), 150);
    setTimeout(() => this.createTone(300, 0.3, 'sine', 0.3), 300);
  }
  async playClick() {
    await this.initializeAudio();
    this.createTone(800, 0.05, 'square', 0.1);
  }
  async playSelect() {
    await this.initializeAudio();
    this.createTone(600, 0.1, 'sine', 0.2);
    setTimeout(() => this.createTone(800, 0.1, 'sine', 0.15), 50);
  }
  async playBreedingStart() {
    await this.initializeAudio();
    this.createTone(440, 0.15, 'sine', 0.2);
    setTimeout(() => this.createTone(554.37, 0.15, 'sine', 0.2), 100);
    setTimeout(() => this.createTone(659.25, 0.2, 'sine', 0.2), 200);
  }
  async playMutation() {
    await this.initializeAudio();
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.createTone(800 + Math.random() * 400, 0.1, 'sine', 0.15);
      }, i * 50);
    }
  }
  async playRareDiscovery() {
    await this.initializeAudio();
    this.createChord([523.25, 659.25, 783.99, 987.77], 0.5, 'sine', 0.3);
    setTimeout(() => {
      this.createChord([587.33, 739.99, 880.00, 1108.73], 0.6, 'sine', 0.25);
    }, 300);
  }
  async playProgress() {
    await this.initializeAudio();
    this.createTone(1000, 0.03, 'square', 0.08);
  }
}
const soundManager = new SoundManager();
const DNAHelix: React.FC<{
  pet: Pet;
  isDarkMode: boolean;
  onTraitHover?: (trait: Trait | null, event?: React.MouseEvent) => void;
}> = ({ pet, isDarkMode, onTraitHover }) => {
  const [hoveredTrait, setHoveredTrait] = useState<string | null>(null);
  const [selectedTrait, setSelectedTrait] = useState<string | null>(null);
  const petSeed = pet.id.split('_').reduce((acc, part) => acc + part.length, 0) + pet.birthTime;
  const speciesSeed = pet.species.length * 7;
  const traitSeed = pet.traits.reduce((acc, trait) => acc + trait.name.length + trait.rarity.length, 0);
  const helixHeight = 300 + (petSeed % 60); 
  const helixWidth = 180 + (speciesSeed % 40); 
  const centerX = helixWidth / 2;
  const helixRadius = 35 + (traitSeed % 20); 
  const turns = 3 + (pet.traits.length % 3); 
  const pointsPerTurn = 20 + (petSeed % 12); 
  const totalPoints = turns * pointsPerTurn;
  const baseStrokeWidth = 4 + (pet.traits.length % 4); 
  const speciesMultiplier = pet.species === 'dragon' ? 1.5 : pet.species === 'phoenix' ? 1.3 : pet.species === 'unicorn' ? 1.2 : 1;
  const rarityBonus = pet.traits.some(t => t.rarity === 'legendary') ? 2 : pet.traits.some(t => t.rarity === 'rare') ? 1 : 0;
  const backboneWidth = Math.floor(baseStrokeWidth * speciesMultiplier + rarityBonus); 
  const connectionWidth = Math.max(1, backboneWidth - 2); 
  const basePairs = ['A-T', 'T-A', 'G-C', 'C-G'];
  const getTraitBasePairs = () => {
    const traitInfluence = pet.traits.map(trait => {
      switch (trait.type) {
        case 'color': return 'G-C';
        case 'pattern': return 'A-T';
        case 'size': return 'C-G';
        case 'ability': return 'T-A';
        default: return basePairs[Math.floor(Math.random() * basePairs.length)];
      }
    });
    return [...basePairs, ...traitInfluence];
  };
  const petBasePairs = getTraitBasePairs();
  const generateHelixPoints = (offset: number = 0) => {
    const points: { x: number; y: number; angle: number; depth: number }[] = [];
    const twistVariation = (traitSeed % 10) / 100; 
    for (let i = 0; i <= totalPoints; i++) {
      const t = i / totalPoints;
      const baseAngle = (i / pointsPerTurn) * Math.PI * 2 + offset;
      const traitInfluence = pet.traits.length > 0 ? Math.sin(t * pet.traits.length * Math.PI) * twistVariation : 0;
      const angle = baseAngle + traitInfluence;
      const y = t * (helixHeight - 40) + 20;
      const radiusVariation = helixRadius + Math.sin(t * turns * Math.PI) * (petSeed % 5);
      const x = centerX + Math.cos(angle) * radiusVariation;
      const depth = Math.sin(angle); 
      points.push({ x, y, angle, depth });
    }
    return points;
  };
  const leftStrand = generateHelixPoints(0);
  const rightStrand = generateHelixPoints(Math.PI);
  const generateBasePairs = () => {
    const pairs = [];
    const pairSpacing = Math.max(2, Math.floor(totalPoints / (40 + (pet.traits.length * 2)))); 
    for (let i = 0; i < totalPoints; i += pairSpacing) {
      if (i < leftStrand.length && i < rightStrand.length) {
        const left = leftStrand[i];
        const right = rightStrand[i];
        const basePairIndex = (i + petSeed) % petBasePairs.length;
        const basePair = petBasePairs[basePairIndex];
        pairs.push({
          left,
          right,
          basePair,
          index: i
        });
      }
    }
    return pairs;
  };
  const basePairConnections = generateBasePairs();
  const traitSegments = pet.traits.map((trait, index) => {
    const segmentSize = Math.floor(totalPoints / pet.traits.length);
    const startIndex = index * segmentSize;
    const endIndex = Math.min(startIndex + segmentSize, totalPoints - 1);
    const leftPoints = leftStrand.slice(startIndex, endIndex + 1);
    const rightPoints = rightStrand.slice(startIndex, endIndex + 1);
    return {
      trait,
      startIndex,
      endIndex,
      leftPoints,
      rightPoints,
      midY: leftPoints.length > 0 ? leftPoints[Math.floor(leftPoints.length / 2)].y : 0
    };
  });
  const getTraitColor = (trait: Trait) => {
    if (trait.type === 'color') return trait.value;
    switch (trait.rarity) {
      case 'legendary': return '#a855f7';
      case 'rare': return '#3b82f6';
      case 'uncommon': return '#10b981';
      default: return '#6b7280';
    }
  };
  const getBasePairColor = (basePair: string) => {
    switch (basePair) {
      case 'A-T': return '#ff6b6b';
      case 'T-A': return '#ff6b6b';
      case 'G-C': return '#4ecdc4';
      case 'C-G': return '#4ecdc4';
      default: return '#95a5a6';
    }
  };
  const handleTraitInteraction = (trait: Trait, event: React.MouseEvent) => {
    setSelectedTrait(selectedTrait === trait.id ? null : trait.id);
    onTraitHover?.(trait, event);
  };
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 relative bg-gradient-to-b from-slate-900 via-blue-950 to-indigo-900 rounded-lg border border-blue-300/20 overflow-hidden">
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${helixWidth} ${helixHeight}`}
          className="absolute inset-0 drop-shadow-lg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id={`dnaStrand-${pet.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={pet.traits.some(t => t.type === 'color') ? pet.traits.find(t => t.type === 'color')?.value || "#e1f5fe" : "#e1f5fe"} />
              <stop offset="50%" stopColor="#b3e5fc" />
              <stop offset="100%" stopColor={pet.traits.some(t => t.rarity === 'legendary') ? "#c084fc" : "#81d4fa"} />
            </linearGradient>
            <linearGradient id="traitHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffd700" />
              <stop offset="100%" stopColor="#ff8c00" />
            </linearGradient>
            <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <linearGradient id={`phosphateGradient-${pet.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={pet.traits.some(t => t.rarity === 'rare') ? "#6366f1" : "#4dd0e1"} />
              <stop offset="50%" stopColor="#26c6da" />
              <stop offset="100%" stopColor={pet.species === 'dragon' ? "#ef4444" : pet.species === 'phoenix' ? "#f59e0b" : "#00bcd4"} />
            </linearGradient>
          </defs>
          {basePairConnections.map((pair, i) => {
            const isInSelectedSegment = selectedTrait && traitSegments.find(seg => 
              seg.trait.id === selectedTrait && 
              pair.index >= seg.startIndex && 
              pair.index <= seg.endIndex
            );
            return (
              <g key={`base-pair-${i}`}>
                <line
                  x1={pair.left.x}
                  y1={pair.left.y}
                  x2={pair.right.x}
                  y2={pair.right.y}
                  stroke={isInSelectedSegment ? getTraitColor(traitSegments.find(seg => seg.trait.id === selectedTrait)!.trait) : getBasePairColor(pair.basePair)}
                  strokeWidth={isInSelectedSegment ? connectionWidth + 1 : connectionWidth}
                  strokeDasharray={isInSelectedSegment ? "none" : "2,1"}
                  opacity={isInSelectedSegment ? "1" : "0.6"}
                />
                <circle
                  cx={pair.left.x}
                  cy={pair.left.y}
                  r={3 + (pair.index % 3)}
                  fill={getBasePairColor(pair.basePair)}
                  stroke={pet.traits.some(t => t.rarity === 'legendary') ? "#ffd700" : "#ffffff"}
                  strokeWidth={Math.max(1, Math.floor(connectionWidth / 2))}
                />
                <circle
                  cx={pair.right.x}
                  cy={pair.right.y}
                  r={3 + (pair.index % 3)}
                  fill={getBasePairColor(pair.basePair)}
                  stroke={pet.traits.some(t => t.rarity === 'legendary') ? "#ffd700" : "#ffffff"}
                  strokeWidth={Math.max(1, Math.floor(connectionWidth / 2))}
                />
                <text
                  x={pair.left.x}
                  y={pair.left.y + 2}
                  textAnchor="middle"
                  fontSize="6"
                  fill="#ffffff"
                  fontWeight="bold"
                >
                  {pair.basePair.split('-')[0]}
                </text>
                <text
                  x={pair.right.x}
                  y={pair.right.y + 2}
                  textAnchor="middle"
                  fontSize="6"
                  fill="#ffffff"
                  fontWeight="bold"
                >
                  {pair.basePair.split('-')[1]}
                </text>
              </g>
            );
          })}
          <path
            d={`M ${leftStrand.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}`}
            fill="none"
            stroke={`url(#phosphateGradient-${pet.id})`}
            strokeWidth={backboneWidth}
            strokeLinecap="round"
          />
          <path
            d={`M ${rightStrand.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}`}
            fill="none"
            stroke={`url(#phosphateGradient-${pet.id})`}
            strokeWidth={backboneWidth}
            strokeLinecap="round"
          />
          {traitSegments.map((segment, segmentIndex) => {
            const isHovered = hoveredTrait === segment.trait.id;
            const isSelected = selectedTrait === segment.trait.id;
            if (!isHovered && !isSelected) return null;
            return (
              <g key={segment.trait.id}>
                <path
                  d={`M ${segment.leftPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}`}
                  fill="none"
                  stroke={getTraitColor(segment.trait)}
                  strokeWidth={backboneWidth + 2}
                  strokeLinecap="round"
                  filter="url(#glowFilter)"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => {
                    setHoveredTrait(segment.trait.id);
                    onTraitHover?.(segment.trait, e);
                  }}
                  onMouseLeave={() => {
                    setHoveredTrait(null);
                    onTraitHover?.(null);
                  }}
                  onClick={(e) => handleTraitInteraction(segment.trait, e)}
                />
                <path
                  d={`M ${segment.rightPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}`}
                  fill="none"
                  stroke={getTraitColor(segment.trait)}
                  strokeWidth={backboneWidth + 2}
                  strokeLinecap="round"
                  filter="url(#glowFilter)"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => {
                    setHoveredTrait(segment.trait.id);
                    onTraitHover?.(segment.trait, e);
                  }}
                  onMouseLeave={() => {
                    setHoveredTrait(null);
                    onTraitHover?.(null);
                  }}
                  onClick={(e) => handleTraitInteraction(segment.trait, e)}
                />
                <g>
                  <rect
                    x={helixWidth - 85}
                    y={segment.midY - 10}
                    width={80}
                    height={20}
                    rx="10"
                    fill="rgba(0,0,0,0.8)"
                    stroke={getTraitColor(segment.trait)}
                    strokeWidth="2"
                  />
                  <text
                    x={helixWidth - 45}
                    y={segment.midY + 4}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#ffffff"
                    fontWeight="bold"
                  >
                    {segment.trait.name}
                  </text>
                </g>
              </g>
            );
          })}
          {traitSegments.map((segment) => (
            <g key={`interaction-${segment.trait.id}`}>
              <path
                d={`M ${segment.leftPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}`}
                fill="none"
                stroke="transparent"
                strokeWidth={backboneWidth + 6}
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  setHoveredTrait(segment.trait.id);
                  onTraitHover?.(segment.trait, e);
                }}
                onMouseLeave={() => {
                  setHoveredTrait(null);
                  onTraitHover?.(null);
                }}
                onClick={(e) => handleTraitInteraction(segment.trait, e)}
              />
              <path
                d={`M ${segment.rightPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}`}
                fill="none"
                stroke="transparent"
                strokeWidth={backboneWidth + 6}
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  setHoveredTrait(segment.trait.id);
                  onTraitHover?.(segment.trait, e);
                }}
                onMouseLeave={() => {
                  setHoveredTrait(null);
                  onTraitHover?.(null);
                }}
                onClick={(e) => handleTraitInteraction(segment.trait, e)}
              />
            </g>
          ))}
        </svg>
      </div>
      <div className={`mt-3 p-3 rounded-lg border ${
        isDarkMode 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <h5 className={`text-xs font-semibold mb-2 text-center ${
          isDarkMode ? 'text-slate-200' : 'text-slate-800'
        }`}>Genetic Traits</h5>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {pet.traits.map((trait) => (
            <div
              key={trait.id}
              className={`flex items-center space-x-2 cursor-pointer p-2 rounded transition-colors ${
                selectedTrait === trait.id 
                  ? (isDarkMode ? 'bg-slate-700 border border-slate-600' : 'bg-slate-100 border border-slate-300') 
                  : (isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50')
              }`}
              onClick={() => setSelectedTrait(selectedTrait === trait.id ? null : trait.id)}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: getTraitColor(trait) }}
              />
              <span className={`truncate text-xs font-medium ${
                isDarkMode ? 'text-slate-200' : 'text-slate-800'
              }`}>{trait.name}</span>
            </div>
          ))}
        </div>
        <div className={`mt-2 text-center text-xs ${
          isDarkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Click traits to highlight • A-T & G-C base pairs shown
        </div>
      </div>
    </div>
  );
};
const getSpeciesIcon = (species: string) => {
  switch (species) {
    case 'dragon': return GiDoubleDragon;
    case 'unicorn': return FaDragon;
    case 'phoenix': return FaFire;
    case 'griffin': return GiSpikedDragonHead;
    case 'dog': return GiSniffingDog;
    case 'monkey': return GiMonkey;
    case 'hummingbird': return GiHummingbird;
    case 'snake': return GiSnake;
    default: return GiDoubleDragon;
  }
};
const generateRandomPet = (generation: number = 1): Pet => {
  const speciesList = ['dragon', 'unicorn', 'phoenix', 'griffin', 'dog', 'monkey', 'hummingbird', 'snake'] as const;
  const species = speciesList[Math.floor(Math.random() * speciesList.length)] as Pet['species'];
  const names: Record<string, string[]> = {
    dragon: ['Pyro', 'Ember', 'Flame', 'Blaze', 'Inferno'],
    unicorn: ['Stardust', 'Moonbeam', 'Crystal', 'Aurora', 'Prism'],
    phoenix: ['Phoenix', 'Ash', 'Cinder', 'Dawn', 'Rebirth'],
    griffin: ['Thunder', 'Storm', 'Wing', 'Talon', 'Majesty'],
    dog: ['Buddy', 'Rex', 'Shadow', 'Luna', 'Max'],
    monkey: ['Chico', 'Bongo', 'Milo', 'Simba', 'George'],
    hummingbird: ['Zippy', 'Flash', 'Jewel', 'Iris', 'Buzz'],
    snake: ['Slither', 'Viper', 'Cobra', 'Aspen', 'Twist']
  };
  const numTraits = 3 + Math.floor(Math.random() * 3);
  const selectedTraits: Trait[] = [];
  const traitTypes = ['color', 'pattern', 'size', 'ability'];
  traitTypes.forEach(type => {
    const traitsOfType = TRAIT_LIBRARY.filter(t => t.type === type);
    if (traitsOfType.length > 0) {
      selectedTraits.push(traitsOfType[Math.floor(Math.random() * traitsOfType.length)]);
    }
  });
  if (Math.random() < 0.3) {
    const specialTraits = TRAIT_LIBRARY.filter(t => t.type === 'special');
    selectedTraits.push(specialTraits[Math.floor(Math.random() * specialTraits.length)]);
  }
  return {
    id: `pet_${Date.now()}_${Math.random()}`,
    name: names[species][Math.floor(Math.random() * names[species].length)],
    species,
    generation,
    traits: selectedTraits,
    birthTime: Date.now(),
    happiness: 80 + Math.floor(Math.random() * 20),
    energy: 70 + Math.floor(Math.random() * 30),
    image: `https://images.unsplash.com/photo-${Math.floor(1600000000000 + Math.random() * 100000000)}?w=300&h=300&fit=crop&auto=format`
  };
};
const breedPets = (parent1: Pet, parent2: Pet): Pet => {
  const offspring: Pet = {
    id: `pet_${Date.now()}_${Math.random()}`,
    name: `${parent1.name}-${parent2.name}`,
    species: Math.random() < 0.5 ? parent1.species : parent2.species,
    generation: Math.max(parent1.generation, parent2.generation) + 1,
    traits: [],
    parents: [parent1.id, parent2.id],
    birthTime: Date.now(),
    happiness: 100,
    energy: 100,
    image: `https://images.unsplash.com/photo-${Math.floor(1600000000000 + Math.random() * 100000000)}?w=300&h=300&fit=crop&auto=format`
  };
  let hasMutation = false;
  let hasRareTraits = false;
  const allTraitTypes = ['color', 'pattern', 'size', 'ability', 'special'];
  allTraitTypes.forEach(traitType => {
    const parent1Traits = parent1.traits.filter(t => t.type === traitType);
    const parent2Traits = parent2.traits.filter(t => t.type === traitType);
    if (parent1Traits.length > 0 || parent2Traits.length > 0) {
      const allTraits = [...parent1Traits, ...parent2Traits];
      const dominantTraits = allTraits.filter(t => t.dominance === 'dominant');
      const recessiveTraits = allTraits.filter(t => t.dominance === 'recessive');
      const codominantTraits = allTraits.filter(t => t.dominance === 'codominant');
      let inheritedTrait: Trait;
      if (dominantTraits.length > 0 && Math.random() < 0.6) {
        inheritedTrait = dominantTraits[Math.floor(Math.random() * dominantTraits.length)];
      } else if (codominantTraits.length > 0 && Math.random() < 0.4) {
        inheritedTrait = codominantTraits[Math.floor(Math.random() * codominantTraits.length)];
      } else if (recessiveTraits.length > 0) {
        inheritedTrait = recessiveTraits[Math.floor(Math.random() * recessiveTraits.length)];
      } else {
        inheritedTrait = allTraits[Math.floor(Math.random() * allTraits.length)];
      }
      offspring.traits.push(inheritedTrait);
      if (inheritedTrait.rarity === 'rare' || inheritedTrait.rarity === 'legendary') {
        hasRareTraits = true;
      }
    }
  });
  if (Math.random() < 0.15) {
    const rareTraits = TRAIT_LIBRARY.filter(t => t.rarity === 'rare' || t.rarity === 'legendary');
    if (rareTraits.length > 0) {
      const bonusRareTrait = rareTraits[Math.floor(Math.random() * rareTraits.length)];
      if (!offspring.traits.find(t => t.id === bonusRareTrait.id)) {
        offspring.traits.push(bonusRareTrait);
        hasRareTraits = true;
      }
    }
  }
  if (Math.random() < 0.3) {
    const mutationTrait = TRAIT_LIBRARY[Math.floor(Math.random() * TRAIT_LIBRARY.length)];
    if (!offspring.traits.find(t => t.id === mutationTrait.id)) {
      offspring.traits.push(mutationTrait);
      hasMutation = true;
    }
  }
  (offspring as any).breedingResult = {
    hasMutation,
    hasRareTraits,
    traitCount: offspring.traits.length
  };
  return offspring;
};
const buildGenerationTree = (pets: Pet[]): TreeNode[] => {
  const nodeMap = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];
  pets.forEach(pet => {
    nodeMap.set(pet.id, {
      pet,
      x: 0,
      y: 0,
      level: pet.generation,
      children: []
    });
  });
  pets.forEach(pet => {
    const node = nodeMap.get(pet.id);
    if (node && pet.parents) {
      const parent1 = nodeMap.get(pet.parents[0]);
      const parent2 = nodeMap.get(pet.parents[1]);
      if (parent1) {
        parent1.children.push(node);
        node.parent = parent1;
      }
      if (parent2 && parent2 !== parent1) {
        parent2.children.push(node);
      }
    }
  });
  pets.forEach(pet => {
    if (!pet.parents) {
      const node = nodeMap.get(pet.id);
      if (node) {
        roots.push(node);
      }
    }
  });
  const nodeSpacing = 160;
  const levelSpacing = 120;
  const generations = Math.max(...pets.map(p => p.generation));
  for (let gen = 1; gen <= generations; gen++) {
    const genNodes = Array.from(nodeMap.values()).filter(n => n.level === gen);
    genNodes.forEach((node, index) => {
      node.x = (index - (genNodes.length - 1) / 2) * nodeSpacing;
      node.y = (gen - 1) * levelSpacing;
    });
  }
  return Array.from(nodeMap.values());
};
const GenerationTree: React.FC<{
  pets: Pet[];
  selectedPet: Pet | null;
  onPetSelect: (pet: Pet) => void;
  isDarkMode: boolean;
}> = ({ pets, selectedPet, onPetSelect, isDarkMode }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 800, height: 600 });
  const [scale, setScale] = useState(1);
  const [drag, setDrag] = useState<{ dragging: boolean; startX: number; startY: number; origX: number; origY: number }>({ dragging: false, startX: 0, startY: 0, origX: 0, origY: 0 });
  const [lastPinchDistance, setLastPinchDistance] = useState<number | null>(null);
  const treeNodes = useMemo(() => buildGenerationTree(pets), [pets]);
  useEffect(() => {
    if (treeNodes.length > 0) {
      const minX = Math.min(...treeNodes.map(n => n.x)) - 100;
      const maxX = Math.max(...treeNodes.map(n => n.x)) + 100;
      const minY = Math.min(...treeNodes.map(n => n.y)) - 50;
      const maxY = Math.max(...treeNodes.map(n => n.y)) + 100;
      setViewBox({
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      });
    }
  }, [treeNodes]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'r' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        resetZoom();
      } else if (e.key === '=' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        zoomIn();
      } else if (e.key === '-' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        zoomOut();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    setDrag({ dragging: true, startX: e.clientX, startY: e.clientY, origX: viewBox.x, origY: viewBox.y });
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!drag.dragging) return;
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const dx = (e.clientX - drag.startX) * (viewBox.width / rect.width);
    const dy = (e.clientY - drag.startY) * (viewBox.height / rect.height);
    setViewBox(vb => ({ ...vb, x: drag.origX - dx, y: drag.origY - dy }));
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    setDrag(d => ({ ...d, dragging: false }));
    (e.target as Element).releasePointerCapture(e.pointerId);
  };
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey) {
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      zoomToPoint(e.clientX, e.clientY, zoomFactor);
      return;
    }
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    zoomToPoint(e.clientX, e.clientY, zoomFactor);
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      setLastPinchDistance(distance);
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastPinchDistance !== null) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;
      const zoomFactor = distance / lastPinchDistance;
      zoomToPoint(centerX, centerY, zoomFactor);
      setLastPinchDistance(distance);
    }
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      setLastPinchDistance(null);
    }
  };
  const zoomToPoint = (clientX: number, clientY: number, zoomFactor: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;
    const svgX = viewBox.x + (mouseX / rect.width) * viewBox.width;
    const svgY = viewBox.y + (mouseY / rect.height) * viewBox.height;
    const newScale = Math.max(0.1, Math.min(5, scale * zoomFactor));
    const scaleDiff = newScale / scale;
    if (scaleDiff !== 1) {
      setScale(newScale);
      const newViewBoxWidth = viewBox.width / scaleDiff;
      const newViewBoxHeight = viewBox.height / scaleDiff;
      const newViewBoxX = svgX - (mouseX / rect.width) * newViewBoxWidth;
      const newViewBoxY = svgY - (mouseY / rect.height) * newViewBoxHeight;
      setViewBox({
        x: newViewBoxX,
        y: newViewBoxY,
        width: newViewBoxWidth,
        height: newViewBoxHeight
      });
    }
  };
  const zoomIn = () => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    zoomToPoint(rect.width / 2, rect.height / 2, 1.2);
  };
  const zoomOut = () => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    zoomToPoint(rect.width / 2, rect.height / 2, 0.8);
  };
  const resetZoom = () => {
    setScale(1);
    if (treeNodes.length > 0) {
      const minX = Math.min(...treeNodes.map(n => n.x)) - 100;
      const maxX = Math.max(...treeNodes.map(n => n.x)) + 100;
      const minY = Math.min(...treeNodes.map(n => n.y)) - 50;
      const maxY = Math.max(...treeNodes.map(n => n.y)) + 100;
      setViewBox({
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      });
    }
  };
  const getRarityGlow = (pet: Pet) => {
    const hasLegendary = pet.traits.some(t => t.rarity === 'legendary');
    const hasRare = pet.traits.some(t => t.rarity === 'rare');
    if (hasLegendary) return 'url(#legendaryGlow)';
    if (hasRare) return 'url(#rareGlow)';
    return 'none';
  };
  return (
    <div 
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden select-none ${
        drag.dragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    >
      <div className="absolute top-4 left-4 z-10 flex space-x-2">
        <button
          onClick={zoomIn}
          className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:opacity-80 ${
            isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-900 hover:bg-gray-50'
          } shadow-lg`}
        >
          +
        </button>
        <button
          onClick={zoomOut}
          className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:opacity-80 ${
            isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-900 hover:bg-gray-50'
          } shadow-lg`}
        >
          -
        </button>
        <button
          onClick={resetZoom}
          className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:opacity-80 ${
            isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-900 hover:bg-gray-50'
          } shadow-lg`}
        >
          Reset
        </button>
        <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        } shadow-lg`}>
          {Math.round(scale * 100)}%
        </div>
      </div>
      <div className="absolute bottom-4 left-4 z-10">
        <div className={`px-3 py-2 rounded-lg text-xs ${
          isDarkMode ? 'bg-gray-800/90 text-gray-300' : 'bg-white/90 text-gray-600'
        } shadow-lg backdrop-blur-sm`}>
          <div className="flex items-center space-x-2">
            <FiMousePointer className="w-3 h-3" />
            <span>Drag to pan</span>
            <span>•</span>
            <FiSearch className="w-3 h-3" />
            <span>Scroll to zoom</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <FiSmartphone className="w-3 h-3" />
            <span>Pinch to zoom</span>
            <span>•</span>
            <FiTarget className="w-3 h-3" />
            <span>Click pets to select</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <FiCommand className="w-3 h-3" />
            <span>Ctrl + R: Reset</span>
            <span>•</span>
            <FiCommand className="w-3 h-3" />
            <span>Ctrl ±: Zoom</span>
          </div>
        </div>
      </div>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        className="w-full h-full"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      >
        <defs>
          <radialGradient id="legendaryGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="rareGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          {Array.from({ length: 10 }, (_, i) => {
            const generation = i + 1;
            const colors = getGenerationColors(generation);
            const colorValues = colors.bg.includes('slate') ? ['#64748b', '#475569'] :
                              colors.bg.includes('emerald') ? ['#10b981', '#059669'] :
                              colors.bg.includes('blue') ? ['#3b82f6', '#2563eb'] :
                              colors.bg.includes('purple') ? ['#8b5cf6', '#7c3aed'] :
                              colors.bg.includes('pink') ? ['#ec4899', '#db2777'] :
                              colors.bg.includes('orange') ? ['#f97316', '#ea580c'] :
                              colors.bg.includes('red') ? ['#ef4444', '#dc2626'] :
                              colors.bg.includes('yellow') ? ['#eab308', '#ca8a04'] :
                              colors.bg.includes('indigo') ? ['#6366f1', '#4f46e5'] :
                              ['#06b6d4', '#0891b2']; 
            return (
              <linearGradient key={generation} id={`generationGradient-${generation}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colorValues[0]} />
                <stop offset="100%" stopColor={colorValues[1]} />
              </linearGradient>
            );
          })}
        </defs>
        {treeNodes.map(node => 
          node.children.map(child => (
            <motion.line
              key={`${node.pet.id}-${child.pet.id}`}
              x1={node.x}
              y1={node.y + 30}
              x2={child.x}
              y2={child.y - 30}
              stroke={isDarkMode ? '#6b7280' : '#9ca3af'}
              strokeWidth="2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          ))
        )}
        {treeNodes.map((node, index) => (
          <motion.g
            key={node.pet.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              onPetSelect(node.pet);
            }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r="35"
              fill={getRarityGlow(node.pet)}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r="30"
              fill={selectedPet?.id === node.pet.id 
                ? (isDarkMode ? '#3b82f6' : '#2563eb')
                : (isDarkMode ? '#374151' : '#f9fafb')
              }
              stroke={selectedPet?.id === node.pet.id 
                ? (isDarkMode ? '#60a5fa' : '#3b82f6')
                : (isDarkMode ? '#6b7280' : '#d1d5db')
              }
              strokeWidth="3"
              filter={selectedPet?.id === node.pet.id ? 'url(#glow)' : 'none'}
            />
            <foreignObject
              x={node.x - 10}
              y={node.y - 10}
              width="20"
              height="20"
            >
              <div className="flex items-center justify-center w-full h-full">
                {React.createElement(getSpeciesIcon(node.pet.species), {
                  className: "w-5 h-5 text-white",
                  style: { filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }
                })}
              </div>
            </foreignObject>
            <circle
              cx={node.x + 20}
              cy={node.y - 20}
              r="10"
              fill={`url(#generationGradient-${node.pet.generation})`}
              stroke={`url(#generationGradient-${node.pet.generation})`}
              strokeWidth="2"
            />
            <text
              x={node.x + 20}
              y={node.y - 16}
              textAnchor="middle"
              fontSize="10"
              fill="#ffffff"
              fontWeight="bold"
            >
              {node.pet.generation}
            </text>
            <text
              x={node.x}
              y={node.y + 50}
              textAnchor="middle"
              fontSize="12"
              fill={isDarkMode ? '#ffffff' : '#374151'}
              fontWeight="500"
            >
              {node.pet.name}
            </text>
            {node.pet.traits.slice(0, 3).map((trait, traitIndex) => (
              <circle
                key={trait.id}
                cx={node.x - 15 + traitIndex * 15}
                cy={node.y + 65}
                r="4"
                fill={trait.type === 'color' ? trait.value : 
                      trait.rarity === 'legendary' ? '#a855f7' :
                      trait.rarity === 'rare' ? '#3b82f6' :
                      trait.rarity === 'uncommon' ? '#10b981' : '#6b7280'}
                stroke={isDarkMode ? '#374151' : '#ffffff'}
                strokeWidth="1"
              />
            ))}
          </motion.g>
        ))}
      </svg>
    </div>
  );
};
const getGenerationColors = (generation: number) => {
  const colors = [
    { bg: 'from-slate-500 to-slate-600', text: 'text-white', border: 'border-slate-400' }, 
    { bg: 'from-emerald-500 to-emerald-600', text: 'text-white', border: 'border-emerald-400' }, 
    { bg: 'from-blue-500 to-blue-600', text: 'text-white', border: 'border-blue-400' }, 
    { bg: 'from-purple-500 to-purple-600', text: 'text-white', border: 'border-purple-400' }, 
    { bg: 'from-pink-500 to-pink-600', text: 'text-white', border: 'border-pink-400' }, 
    { bg: 'from-orange-500 to-orange-600', text: 'text-white', border: 'border-orange-400' }, 
    { bg: 'from-red-500 to-red-600', text: 'text-white', border: 'border-red-400' }, 
    { bg: 'from-yellow-500 to-yellow-600', text: 'text-white', border: 'border-yellow-400' }, 
    { bg: 'from-indigo-500 to-indigo-600', text: 'text-white', border: 'border-indigo-400' }, 
    { bg: 'from-cyan-500 to-cyan-600', text: 'text-white', border: 'border-cyan-400' }, 
  ];
  const index = Math.min(generation - 1, colors.length - 1);
  return colors[index];
};
export default function PetBreedingSimulator() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [breedingState, setBreedingState] = useState<BreedingState>({
    isBreeding: false,
    progress: 0,
    stage: 'selecting',
    selectedParents: [null, null],
    offspring: null
  });
  const [generationTree, setGenerationTree] = useState<Pet[]>([]);
  const [showDNA, setShowDNA] = useState(false);
  const [showTree, setShowTree] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [tooltip, setTooltip] = useState<{ 
    show: boolean; 
    content: string; 
    x: number; 
    y: number;
    type: 'basic' | 'comparison';
    comparisonData?: {
      pet: Pet;
      selectedParents: Pet[];
    };
  }>({
    show: false, content: '', x: 0, y: 0, type: 'basic'
  });
  const [orbs, setOrbs] = useState<Array<{
    width: number;
    height: number;
    left: number;
    top: number;
    duration: number;
    delay: number;
  }>>([]);
  const breedingTimer = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const initialPets = Array.from({ length: 8 }, () => generateRandomPet());
    setPets(initialPets);
    setGenerationTree(initialPets);
    setSelectedPet(initialPets[0]);
    soundManager.setMuted(isMuted);
    setOrbs(
      Array.from({ length: 6 }).map(() => ({
        width: Math.random() * 300 + 100,
        height: Math.random() * 300 + 100,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 2,
      }))
    );
  }, []);
  useEffect(() => {
    document.body.style.fontFamily = '"Poppins", sans-serif';
  }, []);
  useEffect(() => {
    soundManager.setMuted(isMuted);
  }, [isMuted]);
  const handleParentSelection = (pet: Pet) => {
    soundManager.playSelect();
    setSelectedPet(pet);
    if (breedingState.stage === 'complete') {
      return;
    }
    if (breedingState.stage !== 'selecting') {
      return;
    }
    const [parentA, parentB] = breedingState.selectedParents;
    if (parentA && parentA.id === pet.id) {
      setBreedingState(prev => ({
        ...prev,
        selectedParents: [null, parentB]
      }));
      return;
    }
    if (parentB && parentB.id === pet.id) {
      setBreedingState(prev => ({
        ...prev,
        selectedParents: [parentA, null]
      }));
      return;
    }
    if (parentA === null) {
      setBreedingState(prev => ({
        ...prev,
        selectedParents: [pet, null]
      }));
    } else if (parentB === null && parentA.id !== pet.id) {
      setBreedingState(prev => ({
        ...prev,
        selectedParents: [parentA, pet]
      }));
    } else {
      setBreedingState(prev => ({
        ...prev,
        selectedParents: [pet, null]
      }));
    }
  };
  const startBreeding = () => {
    if (breedingState.selectedParents[0] && breedingState.selectedParents[1]) {
      soundManager.playBreedingStart();
      setBreedingState(prev => ({
        ...prev,
        isBreeding: true,
        stage: 'mixing',
        progress: 0
      }));
      let progress = 0;
      breedingTimer.current = setInterval(() => {
        progress += 2;
        setBreedingState(prev => ({ ...prev, progress }));
        if (progress % 20 === 0 && progress < 100) {
          soundManager.playProgress();
        }
        if (progress >= 100) {
          if (breedingTimer.current) {
            clearInterval(breedingTimer.current);
          }
          const newOffspring = breedPets(
            breedingState.selectedParents[0]!,
            breedingState.selectedParents[1]!
          );
          const result = (newOffspring as any).breedingResult;
          if (result.hasMutation) {
            soundManager.playMutation();
          } else if (result.hasRareTraits) {
            soundManager.playRareDiscovery();
          } else {
            soundManager.playSuccess();
          }
          setBreedingState(prev => ({
            ...prev,
            stage: 'complete',
            offspring: newOffspring,
            isBreeding: false
          }));
          setPets(prevPets => [...prevPets, newOffspring]);
          setGenerationTree(prev => [...prev, newOffspring]);
          setSelectedPet(newOffspring);
        }
      }, 50);
    }
  };
  const resetBreeding = () => {
    soundManager.playClick();
    setBreedingState({
      isBreeding: false,
      progress: 0,
      stage: 'selecting',
      selectedParents: [null, null],
      offspring: null
    });
  };
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return isDarkMode ? 'text-slate-400' : 'text-slate-600';
      case 'uncommon': return 'text-emerald-500';
      case 'rare': return 'text-blue-500';
      case 'legendary': return 'text-purple-500';
      default: return isDarkMode ? 'text-slate-400' : 'text-slate-600';
    }
  };
  const showTooltip = (content: string, event: React.MouseEvent) => {
    setTooltip({
      show: true,
      content,
      x: event.clientX,
      y: event.clientY,
      type: 'basic'
    });
  };

  const showComparisonTooltip = (pet: Pet, selectedParents: Pet[], event: React.MouseEvent) => {
    setTooltip({
      show: true,
      content: '',
      x: event.clientX,
      y: event.clientY,
      type: 'comparison',
      comparisonData: {
        pet,
        selectedParents
      }
    });
  };
  const hideTooltip = () => {
    setTooltip(prev => ({ ...prev, show: false }));
  };
  return (
    <div className={`min-h-screen transition-all duration-500 relative overflow-hidden ${
      isDarkMode 
        ? 'bg-slate-900 text-slate-50' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-slate-900'
    }`}>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <div className="fixed inset-0 -z-10">
        <div className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
            : 'bg-gradient-to-br from-violet-100 via-sky-50 to-purple-100'
        }`} />
        <div className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/20' 
            : 'bg-gradient-to-tr from-purple-200/30 via-transparent to-blue-200/30'
        }`} />
        {orbs.map((orb, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10' 
                : 'bg-gradient-to-r from-purple-300/20 to-blue-300/20'
            } backdrop-blur-3xl`}
            style={{
              width: `${orb.width}px`,
              height: `${orb.height}px`,
              left: `${orb.left}%`,
              top: `${orb.top}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: orb.delay,
            }}
          />
        ))}
      </div>
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-500 ${
          isDarkMode 
            ? 'bg-slate-900/95 border-slate-700/60' 
            : 'bg-white/95 border-slate-200/60'
        }`}
      >
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <motion.div 
                whileHover={{ opacity: 0.8 }}
                className="flex items-center space-x-3"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <HiBeaker className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    PetLab
                  </h1>
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>Genetic Engineering Lab</p>
                </div>
              </motion.div>
              <div className={`px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${
                getGenerationColors(Math.max(...generationTree.map(p => p.generation), 1)).bg
              } ${getGenerationColors(Math.max(...generationTree.map(p => p.generation), 1)).text} shadow-lg`}>
                Generation {Math.max(...generationTree.map(p => p.generation), 1)}
              </div>
              {!isMuted && (
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="px-4 py-2 rounded-full flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold"
                >
                  <FiVolume2 className="w-4 h-4" />
                  <span>Audio On</span>
                </motion.div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ opacity: 0.8 }}
                whileTap={{ opacity: 0.6 }}
                onClick={() => {
                  soundManager.playClick();
                  setShowTree(!showTree);
                }}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 cursor-pointer ${
                  showTree 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/25'
                }`}
              >
                <FiGitBranch className="w-4 h-4" />
                <span>Family Tree</span>
              </motion.button>
              <motion.button
                whileHover={{ opacity: 0.8 }}
                whileTap={{ opacity: 0.6 }}
                onClick={() => {
                  soundManager.playClick();
                  setShowDNA(!showDNA);
                }}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 cursor-pointer ${
                  showDNA 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/25'
                }`}
              >
                <FiActivity className="w-4 h-4" />
                <span>{showDNA ? 'Pet Statistics' : 'DNA Analysis'}</span>
              </motion.button>
              <motion.button
                whileHover={{ opacity: 0.8 }}
                whileTap={{ opacity: 0.6 }}
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (!isMuted) {
                    soundManager.playClick();
                  }
                }}
                className={`flex items-center p-4 cursor-pointer rounded-xl font-semibold transition-all duration-200 ${
                  isMuted 
                    ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-500/25' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/25'
                }`}
              >
                {isMuted ? <FiVolumeX className="w-4 h-4" /> : <FiVolume2 className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>
      <div className="flex h-[calc(100vh-120px)] gap-6 p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className={`w-96 rounded-2xl backdrop-blur-xl border shadow-xl overflow-hidden ${
            isDarkMode 
              ? 'bg-slate-900/95 border-slate-700/60' 
              : 'bg-white/95 border-slate-200/60'
          }`}
        >
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FiHeart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Parent Selection</h2>
                <p className={`text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>Choose parents for breeding</p>
              </div>
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] pr-2" style={{
              scrollbarWidth: 'thin',
              scrollbarColor: isDarkMode ? '#475569 #1e293b' : '#cbd5e1 #f1f5f9'
            }}>
              {pets.map((pet) => (
                <motion.div
                  key={pet.id}
                  onClick={() => handleParentSelection(pet)}
                  onMouseEnter={(e) => {
                    const selectedParents = breedingState.selectedParents.filter(p => p !== null) as Pet[];
                    if (selectedParents.length > 0) {
                      showComparisonTooltip(pet, selectedParents, e);
                    } else {
                      showTooltip(`${pet.name} - Gen ${pet.generation}`, e);
                    }
                  }}
                  onMouseLeave={hideTooltip}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                    breedingState.selectedParents.includes(pet)
                      ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 shadow-lg shadow-blue-500/25'
                      : isDarkMode 
                        ? `border-slate-600/60 bg-slate-800/70 hover:border-slate-500 hover:bg-slate-800/90 hover:shadow-lg hover:shadow-${getGenerationColors(pet.generation).bg.split('-')[1]}-500/20` 
                        : `border-slate-200/60 bg-white/70 hover:border-slate-300 hover:bg-white/90 hover:shadow-lg hover:shadow-${getGenerationColors(pet.generation).bg.split('-')[1]}-500/20`
                  } cursor-pointer`}
                  style={{
                    borderLeftColor: breedingState.selectedParents.includes(pet) ? undefined : 
                      getGenerationColors(pet.generation).bg.includes('slate') ? '#64748b' :
                      getGenerationColors(pet.generation).bg.includes('emerald') ? '#10b981' :
                      getGenerationColors(pet.generation).bg.includes('blue') ? '#3b82f6' :
                      getGenerationColors(pet.generation).bg.includes('purple') ? '#8b5cf6' :
                      getGenerationColors(pet.generation).bg.includes('pink') ? '#ec4899' :
                      getGenerationColors(pet.generation).bg.includes('orange') ? '#f97316' :
                      getGenerationColors(pet.generation).bg.includes('red') ? '#ef4444' :
                      getGenerationColors(pet.generation).bg.includes('yellow') ? '#eab308' :
                      getGenerationColors(pet.generation).bg.includes('indigo') ? '#6366f1' :
                      '#06b6d4',
                    borderLeftWidth: '4px'
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      {React.createElement(getSpeciesIcon(pet.species), {
                        className: "w-8 h-8 text-white"
                      })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">{pet.name}</h3>
                      <div className="flex items-center justify-between">
                        <p className={`text-sm capitalize font-medium ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {pet.species}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold bg-gradient-to-r ${
                          getGenerationColors(pet.generation).bg
                        } ${getGenerationColors(pet.generation).text} shadow-sm`}>
                          Gen {pet.generation}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {pet.traits.slice(0, 3).map((trait) => (
                          <span
                            key={trait.id}
                            className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all duration-200 ${
                              trait.rarity === 'common' 
                                ? 'bg-slate-100 text-slate-700 border-slate-300' 
                                : trait.rarity === 'uncommon'
                                ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                                : trait.rarity === 'rare'
                                ? 'bg-blue-100 text-blue-700 border-blue-300'
                                : 'bg-purple-100 text-purple-700 border-purple-300'
                            } ${isDarkMode ? 
                              trait.rarity === 'common' 
                                ? 'dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600' 
                                : trait.rarity === 'uncommon'
                                ? 'dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-600'
                                : trait.rarity === 'rare'
                                ? 'dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-600'
                                : 'dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-600'
                              : ''
                            }`}
                          >
                            {trait.name}
                          </span>
                        ))}
                        {pet.traits.length > 3 && (
                          <span className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${
                            isDarkMode 
                              ? 'bg-slate-700 text-slate-300 border-slate-600' 
                              : 'bg-slate-200 text-slate-600 border-slate-300'
                          }`}>
                            +{pet.traits.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className={`flex-1 rounded-2xl backdrop-blur-xl border shadow-xl overflow-hidden ${
            isDarkMode 
              ? 'bg-slate-900/95 border-slate-700/60' 
              : 'bg-white/95 border-slate-200/60'
          }`}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              {showTree ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <FiGitBranch className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Family Tree</h2>
                      <p className={`text-sm ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>Generational lineage</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ opacity: 0.8 }}
                    whileTap={{ opacity: 0.6 }}
                    onClick={() => {
                      soundManager.playClick();
                      setShowTree(false);
                    }}
                    className={`p-2 rounded-lg transition-all cursor-pointer duration-200 ${
                      isDarkMode 
                        ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    <FiX className="w-4 h-4" />
                  </motion.button>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <HiBeaker className="w-5 h-5 text-white" />
                </div>
                  <div>
                    <h2 className="text-xl font-bold">Breeding Chamber</h2>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>Create new generations</p>
                  </div>
                </div>
              )}
            </div>
            {showTree ? (
              <div className="flex-1 rounded-xl overflow-hidden border" style={{
                backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9'
              }}>
                <GenerationTree
                  pets={generationTree}
                  selectedPet={selectedPet}
                  onPetSelect={(pet) => {
                    soundManager.playSelect();
                    setSelectedPet(pet);
                  }}
                  isDarkMode={isDarkMode}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center">
                {breedingState.stage === 'selecting' ? (
                  <div className="text-center">
                    <div className="flex justify-center mb-8">
                      <motion.div
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`w-32 h-32 rounded-full border-4 border-dashed flex items-center justify-center ${
                          isDarkMode ? 'border-slate-600' : 'border-slate-400'
                        }`}
                      >
                        <HiBeaker className={`w-16 h-16 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                      </motion.div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Ready to Breed</h3>
                    <p className={`text-lg mb-8 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Select two parents to begin the genetic process
                    </p>
                    <div className="flex justify-center space-x-6 mb-8">
                      {breedingState.selectedParents.map((parent, index) => (
                        <div
                          key={index}
                          className={`w-24 h-24 rounded-2xl border-2 border-dashed flex items-center justify-center transition-all duration-300 ${
                            parent 
                              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 shadow-lg' 
                              : isDarkMode ? 'border-slate-600' : 'border-slate-400'
                          }`}
                        >
                          {parent ? (
                            <div className="flex items-center justify-center">
                              {React.createElement(getSpeciesIcon(parent.species), {
                                className: "w-8 h-8 text-blue-500"
                              })}
                            </div>
                          ) : (
                            <span className={`text-2xl ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>?</span>
                          )}
                        </div>
                      ))}
                    </div>
                    {breedingState.selectedParents[0] && breedingState.selectedParents[1] && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ opacity: 0.8 }}
                        whileTap={{ opacity: 0.6 }}
                        onClick={startBreeding}
                        className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                      >
                        Start Breeding Process
                      </motion.button>
                    )}
                  </div>
                ) : breedingState.stage === 'mixing' ? (
                  <div className="text-center">
                    <div className="flex justify-center mb-8">
                      <motion.div
                        animate={{ 
                          opacity: [0.5, 1, 0.5],
                          rotate: [0, 180, 360] 
                        }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-32 h-32 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 flex items-center justify-center shadow-xl"
                      >
                        <FiActivity className="w-16 h-16 text-white" />
                      </motion.div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Genetic Fusion</h3>
                    <p className={`text-lg mb-8 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>Mixing genetic sequences...</p>
                    <div className={`w-80 h-3 rounded-full overflow-hidden mb-4 ${
                      isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                    }`}>
                      <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${breedingState.progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    <p className={`text-sm font-semibold ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {breedingState.progress}% Complete
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      className="mb-8 flex justify-center"
                    >
                      <div className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 flex items-center justify-center shadow-2xl">
                        <motion.div 
                          className="flex items-center justify-center"
                          animate={{ 
                            opacity: [0.8, 1, 0.8]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {breedingState.offspring && React.createElement(getSpeciesIcon(breedingState.offspring.species), {
                            className: "w-20 h-20 text-white"
                          })}
                        </motion.div>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <h3 className="text-3xl font-bold mb-2">{breedingState.offspring?.name}</h3>
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        <p className={`text-lg capitalize ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {breedingState.offspring?.species}
                        </p>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${
                          breedingState.offspring ? getGenerationColors(breedingState.offspring.generation).bg : 'from-slate-500 to-slate-600'
                        } ${breedingState.offspring ? getGenerationColors(breedingState.offspring.generation).text : 'text-white'} shadow-lg`}>
                          Generation {breedingState.offspring?.generation}
                        </span>
                      </div>
                      {breedingState.offspring && (breedingState.offspring as any).breedingResult && (
                        <div className="mt-6 space-y-3">
                          {(breedingState.offspring as any).breedingResult.hasMutation && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1, duration: 0.5 }}
                              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full text-sm font-bold flex items-center justify-center space-x-2 shadow-lg"
                            >
                              <HiSparkles className="w-4 h-4" />
                              <span>MUTATION DETECTED!</span>
                              <HiSparkles className="w-4 h-4" />
                            </motion.div>
                          )}
                          {(breedingState.offspring as any).breedingResult.hasRareTraits && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.2, duration: 0.5 }}
                              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-bold flex items-center justify-center space-x-2 shadow-lg"
                            >
                              <FiStar className="w-4 h-4" />
                              <span>RARE TRAITS DISCOVERED!</span>
                              <FiStar className="w-4 h-4" />
                            </motion.div>
                          )}
                        </div>
                      )}
                      <div className="mt-6 flex justify-center space-x-4">
                        <motion.button
                          whileHover={{ opacity: 0.8 }}
                          whileTap={{ opacity: 0.6 }}
                          onClick={resetBreeding}
                          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:shadow-lg transition-all duration-200 cursor-pointer"
                        >
                          Breed Again
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className={`w-96 rounded-2xl backdrop-blur-xl border shadow-xl overflow-hidden ${
            isDarkMode 
              ? 'bg-slate-900/95 border-slate-700/60' 
              : 'bg-white/95 border-slate-200/60'
          }`}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {showDNA ? 'DNA Analysis' : 'Pet Statistics'}
                </h2>
                <p className={`text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {showDNA ? 'Genetic structure' : 'Detailed information'}
                </p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto pr-2" style={{
              scrollbarWidth: 'thin',
              scrollbarColor: isDarkMode ? '#475569 #1e293b' : '#cbd5e1 #f1f5f9'
            }}>
              {selectedPet ? (
                <div className="space-y-6">
                  <div className={`p-4 rounded-xl ${
                    isDarkMode ? 'bg-slate-800/70' : 'bg-slate-50/70'
                  }`}>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        {React.createElement(getSpeciesIcon(selectedPet.species), {
                          className: "w-8 h-8 text-white"
                        })}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{selectedPet.name}</h3>
                        <div className="flex items-center space-x-3">
                          <p className={`text-sm capitalize font-medium ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            {selectedPet.species}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold bg-gradient-to-r ${
                            getGenerationColors(selectedPet.generation).bg
                          } ${getGenerationColors(selectedPet.generation).text} shadow-sm`}>
                            Gen {selectedPet.generation}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className={`text-sm font-medium ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-600'
                          }`}>Happiness</p>
                          <p className="text-sm font-bold">{selectedPet.happiness}%</p>
                        </div>
                        <div className={`w-full h-2 rounded-full overflow-hidden ${
                          isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                        }`}>
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                            style={{ width: `${selectedPet.happiness}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className={`text-sm font-medium ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-600'
                          }`}>Energy</p>
                          <p className="text-sm font-bold">{selectedPet.energy}%</p>
                        </div>
                        <div className={`w-full h-2 rounded-full overflow-hidden ${
                          isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                        }`}>
                          <div 
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${selectedPet.energy}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {showDNA ? (
                    <div className={`p-4 rounded-xl ${
                      isDarkMode ? 'bg-slate-800/70' : 'bg-slate-50/70'
                    }`}>
                      <div className="flex items-center space-x-2 mb-4">
                        <FiActivity className="w-4 h-4 text-purple-500" />
                        <h4 className="font-bold">DNA Helix Structure</h4>
                      </div>
                      <div className="h-[400px] relative overflow-hidden rounded-lg">
                        <DNAHelix
                          pet={selectedPet}
                          isDarkMode={isDarkMode}
                          onTraitHover={(trait, event) => {
                            if (trait && event) {
                              showTooltip(`${trait.name} - ${trait.rarity} ${trait.dominance}`, event);
                            } else {
                              hideTooltip();
                            }
                          }}
                        />
                      </div>
                      <div className="mt-4 text-xs text-center">
                        <p className={`${
                          isDarkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          Interactive DNA visualization • Click segments to analyze
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className={`p-4 rounded-xl ${
                      isDarkMode ? 'bg-slate-800/70' : 'bg-slate-50/70'
                    }`}>
                      <h4 className="font-bold mb-4">Genetic Traits</h4>
                      <div className="space-y-3">
                        {selectedPet.traits.map((trait) => (
                          <div key={trait.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                            isDarkMode 
                              ? 'bg-slate-700 border-slate-600' 
                              : 'bg-white border-slate-200 shadow-sm'
                          }`}>
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full ${
                                trait.rarity === 'legendary' ? 'bg-purple-500' :
                                trait.rarity === 'rare' ? 'bg-blue-500' :
                                trait.rarity === 'uncommon' ? 'bg-emerald-500' : 'bg-slate-400'
                              }`} />
                              <span className={`text-sm font-medium ${
                                isDarkMode ? 'text-slate-100' : 'text-slate-800'
                              }`}>{trait.name}</span>
                            </div>
                            <span className={`text-xs px-3 py-1 rounded-full font-semibold border transition-all duration-200 ${
                              trait.rarity === 'legendary' 
                                ? isDarkMode 
                                  ? 'bg-purple-800 text-purple-200 border-purple-600' 
                                  : 'bg-purple-100 text-purple-800 border-purple-300'
                                : trait.rarity === 'rare' 
                                ? isDarkMode 
                                  ? 'bg-blue-800 text-blue-200 border-blue-600' 
                                  : 'bg-blue-100 text-blue-800 border-blue-300'
                                : trait.rarity === 'uncommon' 
                                ? isDarkMode 
                                  ? 'bg-emerald-800 text-emerald-200 border-emerald-600' 
                                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : isDarkMode 
                                  ? 'bg-slate-600 text-slate-200 border-slate-500' 
                                  : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}>
                              {trait.rarity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedPet.parents && (
                    <div className={`p-4 rounded-xl ${
                      isDarkMode ? 'bg-slate-800/70' : 'bg-slate-50/70'
                    }`}>
                      <h4 className="font-bold mb-4">Genetic Lineage</h4>
                      <div className="space-y-3">
                        {selectedPet.parents.map((parentId, index) => {
                          const parent = [...pets, ...generationTree].find(p => p.id === parentId);
                          return parent ? (
                            <div key={parentId} className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                              isDarkMode 
                                ? 'bg-slate-700 border-slate-600' 
                                : 'bg-white border-slate-200 shadow-sm'
                            }`}>
                              <div className="flex items-center space-x-3">
                                <span className={`text-sm font-medium ${
                                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                                }`}>
                                  {index === 0 ? 'Parent A:' : 'Parent B:'}
                                </span>
                                <span className={`text-sm font-semibold ${
                                  isDarkMode ? 'text-slate-100' : 'text-slate-800'
                                }`}>{parent.name}</span>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                                isDarkMode 
                                  ? 'bg-slate-600 text-slate-200 border border-slate-500' 
                                  : 'bg-slate-100 text-slate-700 border border-slate-300'
                              }`}>{parent.species}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center">
                      <FiInfo className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">No Pet Selected</h3>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Select a pet to view detailed statistics and genetic information
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      <AnimatePresence>
        {tooltip.show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`fixed z-50 pointer-events-none shadow-xl backdrop-blur-sm ${
              tooltip.type === 'comparison' ? 'max-w-md' : ''
            } ${
              isDarkMode 
                ? 'bg-slate-800/95 text-slate-100 border border-slate-700' 
                : 'bg-white/95 text-slate-900 border border-slate-200'
            } rounded-xl`}
            style={{
              left: tooltip.type === 'comparison' ? Math.min(tooltip.x + 10, window.innerWidth - 400) : tooltip.x + 10,
              top: tooltip.type === 'comparison' ? Math.max(tooltip.y - 200, 10) : tooltip.y - 40
            }}
          >
            {tooltip.type === 'basic' ? (
              <div className="px-4 py-2 text-sm">
                {tooltip.content}
              </div>
            ) : tooltip.comparisonData ? (
              <div className="p-4">
                <div className="mb-3">
                  <h4 className="font-bold text-sm mb-1">Genetic Comparison</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full"></div>
                    <span className="text-xs font-medium">{tooltip.comparisonData.pet.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${
                      getGenerationColors(tooltip.comparisonData.pet.generation).bg
                    } ${getGenerationColors(tooltip.comparisonData.pet.generation).text}`}>
                      Gen {tooltip.comparisonData.pet.generation}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="text-xs font-semibold mb-2 text-purple-500">Trait Compatibility</h5>
                    <div className="space-y-1">
                      {tooltip.comparisonData.pet.traits.map((trait) => {
                        const parentTraits = tooltip.comparisonData!.selectedParents.flatMap(p => p.traits);
                        const compatibility = parentTraits.filter(pt => 
                          pt.type === trait.type && pt.dominance === trait.dominance
                        ).length;
                        const hasCompatible = parentTraits.some(pt => pt.type === trait.type);
                        
                        return (
                          <div key={trait.id} className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                trait.rarity === 'legendary' ? 'bg-purple-500' :
                                trait.rarity === 'rare' ? 'bg-blue-500' :
                                trait.rarity === 'uncommon' ? 'bg-emerald-500' : 'bg-slate-400'
                              }`}></div>
                              <span className="font-medium">{trait.name}</span>
                            </div>
                                                         <div className="flex items-center space-x-1">
                               {hasCompatible ? (
                                 <FiCheck className="w-3 h-3 text-emerald-500" />
                               ) : (
                                 <span className="text-orange-500 font-medium">NEW</span>
                               )}
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                trait.rarity === 'legendary' ? 'bg-purple-100 text-purple-700' :
                                trait.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                                trait.rarity === 'uncommon' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {trait.rarity}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-xs font-semibold mb-2 text-indigo-500">Breeding Potential</h5>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span>Mutation Chance:</span>
                        <span className="font-medium text-purple-500">30%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rare Traits:</span>
                        <span className="font-medium text-blue-500">
                          {tooltip.comparisonData.pet.traits.filter(t => t.rarity === 'rare' || t.rarity === 'legendary').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Generation:</span>
                        <span className="font-medium">
                          {Math.max(...tooltip.comparisonData.selectedParents.map(p => p.generation), tooltip.comparisonData.pet.generation) + 1}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Trait Count:</span>
                        <span className="font-medium text-emerald-500">{tooltip.comparisonData.pet.traits.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx>{`
        ::-webkit-scrollbar {
          display: none !important;
        }
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }

        html, body, #__next, .min-h-screen {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        html::-webkit-scrollbar, body::-webkit-scrollbar, #__next::-webkit-scrollbar, .min-h-screen::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
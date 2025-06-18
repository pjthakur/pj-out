"use client"
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSpring, animated, config } from '@react-spring/web';
import Head from 'next/head';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Palette, 
  Download, 
  Share2, 
  Layers, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Copy, 
  Trash2,
  Play,
  Pause,
  Square,
  Circle,
  Brush,
  Eraser,
  Grid,
  Zap,
  Crown,
  Heart,
  Star,
  Smile,
  Plus,
  Gamepad2,
  Monitor,
  Smartphone,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

// TypeScript interfaces
interface Layer {
  id: number;
  name: string;
  visible: boolean;
  data: (string | null)[];
}

interface Template {
  name: string;
  icon: React.ElementType;
  data: (string | null)[];
}

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

interface ExportOptions {
  format: 'png';
  scale: number;
  platform: 'discord' | 'twitch' | 'general';
}

interface SocialMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
}

// Constants
const GRID_SIZE = 16;
const DESKTOP_CELL_SIZE = 24;
const PREVIEW_CELL_SIZE = 12;

const defaultColors: string[] = [
  '#000000', '#1a1a2e', '#16213e', '#0f3460', '#e94560', '#f39c12',
  '#2ecc71', '#3498db', '#9b59b6', '#e67e22', '#1abc9c', '#34495e',
  '#ffffff', '#ecf0f1', '#bdc3c7', '#95a5a6', '#7f8c8d', '#2c3e50',
  '#f1c40f', '#e74c3c', '#8e44ad', '#c0392b', '#d35400', '#27ae60',
  '#2980b9', '#8e44ad', '#2c3e50', '#f39c12', '#d35400', '#c0392b',
  '#a569bd', '#5dade2', '#58d68d', '#f7dc6f', '#f8c471', '#ec7063'
];

const presetTemplates: Template[] = [
  {
    name: 'Hero Face',
    icon: Smile,
    data: Array(256).fill(null).map((_, i) => {
      const x = i % 16;
      const y = Math.floor(i / 16);
      // Face outline
      if (x >= 4 && x <= 11 && y >= 3 && y <= 13) {
        if (y >= 4 && y <= 12 && x >= 5 && x <= 10) return '#FFDBAC';
        if ((y === 3 || y === 13) && x >= 5 && x <= 10) return '#FFDBAC';
        if ((x === 4 || x === 11) && y >= 4 && y <= 12) return '#FFDBAC';
      }
      // Eyes
      if ((x === 6 || x === 9) && y === 7) return '#000000';
      // Nose
      if (x === 7 && y === 9) return '#E6A876';
      // Mouth
      if (x >= 6 && x <= 9 && y === 11) return '#000000';
      // Hair
      if (y >= 2 && y <= 5 && x >= 4 && x <= 11) {
        if (y === 2 && x >= 5 && x <= 10) return '#8B4513';
        if (y >= 3 && y <= 4 && x >= 4 && x <= 11) return '#8B4513';
      }
      return null;
    })
  },
  {
    name: 'Royal Crown',
    icon: Crown,
    data: Array(256).fill(null).map((_, i) => {
      const x = i % 16;
      const y = Math.floor(i / 16);
      // Crown base
      if (y >= 5 && y <= 7 && x >= 3 && x <= 12) return '#FFD700';
      // Crown spikes
      if (y >= 2 && y <= 4) {
        if ((x === 4 || x === 7 || x === 10) && y >= 2) return '#FFD700';
        if ((x === 5 || x === 8 || x === 11) && y >= 3) return '#FFD700';
      }
      // Gems
      if ((x === 5 || x === 8 || x === 11) && y === 6) return '#FF0000';
      return null;
    })
  },
  {
    name: 'Love Heart',
    icon: Heart,
    data: Array(256).fill(null).map((_, i) => {
      const x = i % 16;
      const y = Math.floor(i / 16);
      // Heart shape
      if (y >= 5 && y <= 13) {
        if (((x >= 4 && x <= 6) || (x >= 9 && x <= 11)) && y >= 5 && y <= 7) return '#FF69B4';
        if (x >= 5 && x <= 10 && y >= 8 && y <= 11) return '#FF69B4';
        if (x >= 6 && x <= 9 && y >= 12 && y <= 13) return '#FF69B4';
        if ((x === 7 || x === 8) && y === 14) return '#FF69B4';
      }
      return null;
    })
  },
  {
    name: 'Power Star',
    icon: Star,
    data: Array(256).fill(null).map((_, i) => {
      const x = i % 16;
      const y = Math.floor(i / 16);
      // Star center
      if ((x === 7 || x === 8) && y >= 6 && y <= 9) return '#FFFF00';
      if (y >= 7 && y <= 8 && x >= 6 && x <= 9) return '#FFFF00';
      // Star points
      if ((x === 7 || x === 8) && (y === 4 || y === 5)) return '#FFFF00';
      if ((x === 7 || x === 8) && (y === 10 || y === 11)) return '#FFFF00';
      if ((y === 7 || y === 8) && (x === 4 || x === 5)) return '#FFFF00';
      if ((y === 7 || y === 8) && (x === 10 || x === 11)) return '#FFFF00';
      // Diagonal points
      if ((x === 5 && y === 5) || (x === 10 && y === 5)) return '#FFFF00';
      if ((x === 5 && y === 10) || (x === 10 && y === 10)) return '#FFFF00';
      return null;
    })
  },
  {
    name: 'Game Controller',
    icon: Gamepad2,
    data: Array(256).fill(null).map((_, i) => {
      const x = i % 16;
      const y = Math.floor(i / 16);
      // Controller body
      if (y >= 6 && y <= 10 && x >= 2 && x <= 13) return '#4A4A4A';
      // D-pad
      if ((x === 4 || x === 5) && y === 8) return '#000000';
      if (x === 4 && (y === 7 || y === 9)) return '#000000';
      // Buttons
      if ((x === 10 || x === 11) && y === 7) return '#FF0000';
      if ((x === 10 || x === 11) && y === 9) return '#00FF00';
      return null;
    })
  },
  {
    name: 'Retro Skull',
    icon: Circle,
    data: Array(256).fill(null).map((_, i) => {
      const x = i % 16;
      const y = Math.floor(i / 16);
      // Skull outline
      if (x >= 4 && x <= 11 && y >= 3 && y <= 12) {
        if (y >= 4 && y <= 11 && x >= 5 && x <= 10) return '#F0F0F0';
        if ((y === 3 || y === 12) && x >= 5 && x <= 10) return '#F0F0F0';
        if ((x === 4 || x === 11) && y >= 4 && y <= 11) return '#F0F0F0';
      }
      // Eye sockets
      if ((x >= 6 && x <= 7) && (y >= 6 && y <= 7)) return '#000000';
      if ((x >= 8 && x <= 9) && (y >= 6 && y <= 7)) return '#000000';
      // Nose
      if (x === 7 && y === 9) return '#000000';
      // Mouth
      if (y === 11 && x >= 6 && x <= 9) return '#000000';
      return null;
    })
  }
];

const tools = [
  { name: 'brush', icon: Brush, label: 'Brush', shortcut: 'B' },
  { name: 'eraser', icon: Eraser, label: 'Eraser', shortcut: 'E' },
  { name: 'fill', icon: Square, label: 'Fill', shortcut: 'F' }
] as const;

type ToolType = typeof tools[number]['name'];

const PixelAvatarStudio: React.FC = () => {
  // State management
  const [currentTool, setCurrentTool] = useState<ToolType>('brush');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [layers, setLayers] = useState<Layer[]>([
    { id: 1, name: 'Base Layer', visible: true, data: Array(256).fill(null) }
  ]);
  const [activeLayer, setActiveLayer] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [rgbColor, setRgbColor] = useState<RGBColor>({ r: 0, g: 0, b: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'png',
    scale: 10,
    platform: 'general'
  });
  const [cellSize, setCellSize] = useState(DESKTOP_CELL_SIZE);
  const [previewCellSize, setPreviewCellSize] = useState(PREVIEW_CELL_SIZE);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [bottomSheetOffset, setBottomSheetOffset] = useState(0);

  // React Spring Animations
  const toolsSpring = useSpring({
    transform: 'translateX(0px)',
    opacity: 1,
    from: { transform: 'translateX(-20px)', opacity: 0 },
    config: config.wobbly
  });

  const bottomSheetSpring = useSpring({
    y: isBottomSheetOpen ? 0 : bottomSheetOffset,
    config: config.gentle
  });

  // Handle window resize and set initial cell size
  useEffect(() => {
    const updateCellSize = () => {
      const isMobile = window.innerWidth < 768;
      setCellSize(isMobile ? 16 : DESKTOP_CELL_SIZE);
      setPreviewCellSize(isMobile ? 8 : PREVIEW_CELL_SIZE);
      
      // Set bottom sheet offset for mobile
      if (isMobile) {
        setBottomSheetOffset(window.innerHeight * 0.8 - 80);
      }
    };

    // Set initial size
    updateCellSize();

    // Add resize listener
    window.addEventListener('resize', updateCellSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateCellSize);
  }, []);

  // Prevent background scroll when bottom sheet is open on mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isBottomSheetOpen && window.innerWidth < 768) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
      } else {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      }
    };
  }, [isBottomSheetOpen]);

  // Color conversion utilities
  const hexToRgb = useCallback((hex: string): RGBColor => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }, []);

  const rgbToHex = useCallback((r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }, []);

  // Update RGB when hex color changes
  useEffect(() => {
    setRgbColor(hexToRgb(currentColor));
  }, [currentColor, hexToRgb]);



  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      
      const toolMap: Record<string, ToolType> = {
        'b': 'brush',
        'e': 'eraser',
        'f': 'fill'
      };

      const tool = toolMap[e.key.toLowerCase()];
      if (tool) {
        setCurrentTool(tool);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleRgbChange = (component: keyof RGBColor, value: string) => {
    const numValue = parseInt(value);
    const newRgb = { ...rgbColor, [component]: numValue };
    setRgbColor(newRgb);
    setCurrentColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const getCurrentLayerData = (): (string | null)[] => {
    return layers[activeLayer]?.data || Array(256).fill(null);
  };

  const updateLayerData = (newData: (string | null)[]) => {
    const newLayers = [...layers];
    newLayers[activeLayer] = { ...newLayers[activeLayer], data: newData };
    setLayers(newLayers);
  };

  const floodFill = (data: (string | null)[], startIndex: number, targetColor: string | null, fillColor: string) => {
    if (targetColor === fillColor) return;
    
    const stack = [startIndex];
    const visited = new Set<number>();

    while (stack.length > 0) {
      const index = stack.pop()!;
      if (visited.has(index)) continue;
      
      const x = index % GRID_SIZE;
      const y = Math.floor(index / GRID_SIZE);
      
      if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) continue;
      if (data[index] !== targetColor) continue;
      
      visited.add(index);
      data[index] = fillColor;
      
      // Add adjacent cells
      if (x > 0) stack.push(index - 1);
      if (x < GRID_SIZE - 1) stack.push(index + 1);
      if (y > 0) stack.push(index - GRID_SIZE);
      if (y < GRID_SIZE - 1) stack.push(index + GRID_SIZE);
    }
  };

  const handleCellClick = (index: number) => {
    const currentData = getCurrentLayerData();
    const newData = [...currentData];

    switch (currentTool) {
      case 'brush':
        newData[index] = currentColor;
        playSound('paint');
        break;
      case 'eraser':
        newData[index] = null;
        playSound('erase');
        break;
      case 'fill':
        floodFill(newData, index, currentData[index], currentColor);
        playSound('paint');
        break;
    }

    updateLayerData(newData);
  };

  const handleMouseDown = (index: number) => {
    setIsDrawing(true);
    handleCellClick(index);
  };

  const handleMouseEnter = (index: number) => {
    if (isDrawing && (currentTool === 'brush' || currentTool === 'eraser')) {
      handleCellClick(index);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const addLayer = () => {
    playSound('click');
    const newLayer: Layer = {
      id: Date.now(),
      name: `Layer ${layers.length + 1}`,
      visible: true,
      data: Array(256).fill(null)
    };
    setLayers([...layers, newLayer]);
    setActiveLayer(layers.length);
  };

  const deleteLayer = (index: number) => {
    // Prevent deleting the base layer (index 0) and ensure at least one layer exists
    if (layers.length > 1 && index !== 0) {
      playSound('erase');
      const newLayers = layers.filter((_, i) => i !== index);
      setLayers(newLayers);
      setActiveLayer(Math.max(0, Math.min(activeLayer, newLayers.length - 1)));
    }
  };

  const toggleLayerVisibility = (index: number) => {
    playSound('click');
    const newLayers = [...layers];
    newLayers[index].visible = !newLayers[index].visible;
    setLayers(newLayers);
  };

  const loadTemplate = (template: Template) => {
    playSound('click');
    updateLayerData([...template.data]);
  };

  const clearCanvas = () => {
    playSound('clear');
    updateLayerData(Array(256).fill(null));
  };

  const getFinalPixelData = useMemo((): (string | null)[] => {
    const final = Array(256).fill(null);
    layers.forEach(layer => {
      if (layer.visible) {
        layer.data.forEach((color, index) => {
          if (color) {
            final[index] = color;
          }
        });
      }
    });
    return final;
  }, [layers]);

  const generateSocialMetadata = (imageDataUrl: string): SocialMetadata => {
    return {
      title: 'My Pixel Avatar - Created with Pixel Avatar Studio',
      description: `Check out my custom 16x16 pixel avatar! Created with the Pixel Avatar Studio - a retro-style editor perfect for Discord, Twitch, and gaming profiles. #PixelArt #Avatar #Retro`,
      image: imageDataUrl,
      url: ''
    };
  };

  const exportAvatar = (options: ExportOptions = exportOptions) => {
    playSound('export');
    const canvas = document.createElement('canvas');
    let size: number;
    
    // Platform-specific sizing
    switch (options.platform) {
      case 'discord':
        size = 128; // Discord avatar size
        break;
      case 'twitch':
        size = 300; // Twitch profile image size
        break;
      default:
        size = GRID_SIZE * options.scale;
    }
    
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Enable crisp pixel rendering
    ctx.imageSmoothingEnabled = false;

    // Render all visible layers
    const pixelSize = size / GRID_SIZE;
    layers.forEach(layer => {
      if (layer.visible) {
        layer.data.forEach((color, index) => {
          if (color) {
            const x = (index % GRID_SIZE) * pixelSize;
            const y = Math.floor(index / GRID_SIZE) * pixelSize;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, pixelSize, pixelSize);
          }
        });
      }
    });

    // Create download link with platform-specific naming
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pixel-avatar-${options.platform}-${size}x${size}.${options.format}`;
        a.click();
        URL.revokeObjectURL(url);
        
        // Show success toast with platform-specific message
        const platformMessages = {
          discord: 'Perfect for Discord profiles! ⚡',
          twitch: 'Ready for your Twitch channel! 🎮',
          general: 'Avatar exported successfully! 🎨'
        };
        toast.success(`${platformMessages[options.platform]} (${size}x${size})`);
      }
    });
  };

  const copyToClipboard = async () => {
    const canvas = document.createElement('canvas');
    const size = GRID_SIZE * 10;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    layers.forEach(layer => {
      if (layer.visible) {
        layer.data.forEach((color, index) => {
          if (color) {
            const x = (index % GRID_SIZE) * 10;
            const y = Math.floor(index / GRID_SIZE) * 10;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 10, 10);
          }
        });
      }
    });

    // Try to copy image to clipboard
    try {
      canvas.toBlob(async (blob) => {
        if (blob && navigator.clipboard && window.ClipboardItem) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            toast.success('Avatar copied to clipboard!');
            playSound('export');
          } catch (err) {
            console.error('Failed to copy image to clipboard:', err);
            // Fallback: copy data URL as text
            const dataUrl = canvas.toDataURL();
            if (navigator.clipboard && navigator.clipboard.writeText) {
              await navigator.clipboard.writeText(dataUrl);
              toast.success('Avatar data URL copied to clipboard!');
              playSound('export');
            } else {
              toast.error('Clipboard not supported in this browser');
            }
          }
        } else {
          // Fallback: copy data URL as text
          const dataUrl = canvas.toDataURL();
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(dataUrl);
            toast.success('Avatar data URL copied to clipboard!');
            playSound('export');
          } else {
            // Final fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = dataUrl;
            document.body.appendChild(textArea);
            textArea.select();
            try {
              document.execCommand('copy');
              toast.success('Avatar data URL copied to clipboard!');
              playSound('export');
            } catch (err) {
              toast.error('Failed to copy to clipboard');
            }
            document.body.removeChild(textArea);
          }
        }
      });
    } catch (err) {
      console.error('Failed to create canvas blob:', err);
      toast.error('Failed to copy avatar');
    }
  };



  const shareToSocial = (platform: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = GRID_SIZE * 10;
    canvas.height = GRID_SIZE * 10;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    layers.forEach(layer => {
      if (layer.visible) {
        layer.data.forEach((color, index) => {
          if (color) {
            const x = (index % GRID_SIZE) * 10;
            const y = Math.floor(index / GRID_SIZE) * 10;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 10, 10);
          }
        });
      }
    });

    canvas.toBlob((blob) => {
      if (blob) {
        const imageDataUrl = canvas.toDataURL();
        const metadata = generateSocialMetadata(imageDataUrl);
        
        let shareUrl = '';
        let message = '';
        
        switch (platform) {
          case 'twitter':
            shareUrl = `${metadata.title}\n\n${metadata.description}`;
            message = 'Chirper share text copied to clipboard!';
            break;
          case 'facebook':
            shareUrl = `${metadata.title}\n\n${metadata.description}`;
            message = 'SocialBook share text copied to clipboard!';
            break;
          case 'discord':
            shareUrl = `${metadata.title}\n${metadata.description}`;
            message = 'PixelCord share text copied to clipboard!';
            break;
          case 'reddit':
            shareUrl = `${metadata.title}\n\n${metadata.description}`;
            message = 'NetBoard share text copied to clipboard!';
            break;
        }
        
        // Copy to clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(shareUrl).then(() => {
            toast.success(message);
            playSound('export');
          }).catch(() => {
            toast.error('Failed to copy to clipboard');
          });
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = shareUrl;
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand('copy');
            toast.success(message);
            playSound('export');
          } catch (err) {
            toast.error('Failed to copy to clipboard');
          }
          document.body.removeChild(textArea);
        }
      }
    });
  };

  // Sound Effects
  const playSound = useCallback((type: 'click' | 'paint' | 'erase' | 'export' | 'clear') => {
    if (!isSoundEnabled) return;
    
    // Create simple sound effects using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'click':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        break;
      case 'paint':
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        break;
      case 'erase':
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        break;
      case 'export':
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        break;
      case 'clear':
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(100, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        break;
    }
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }, [isSoundEnabled]);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Mono:wght@400;700&family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />

      </Head>
      
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Retro CRT Scanlines */}
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-transparent animate-pulse"></div>
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(255, 0, 128, 0.03) 2px,
                rgba(255, 0, 128, 0.03) 4px
              )`
            }}
          />
        </div>

        {/* Retro Grid Background */}
        <div className="fixed inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255, 0, 128, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Neon Border Effect */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 border-4 border-pink-500/30 shadow-[inset_0_0_50px_rgba(255,0,128,0.1)]"></div>
        </div>

        <div className="relative z-10 h-screen flex flex-col">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/80 backdrop-blur-lg border-b-2 border-pink-500/50 px-4 py-3 md:px-6 md:py-4 shadow-[0_0_20px_rgba(255,0,128,0.3)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-pink-400 to-cyan-400 rounded border-2 border-pink-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,128,0.5)] flex-shrink-0">
                  <Gamepad2 className="w-4 h-4 md:w-5 md:h-5 text-black" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-sm md:text-2xl font-black bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,0,128,0.5)] truncate" style={{ fontFamily: 'Orbitron, monospace' }}>
                    PIXEL AVATAR STUDIO
                  </h1>
                  <p className="text-xs text-pink-300 tracking-wider hidden md:block" style={{ fontFamily: "'Press Start 2P', monospace" }}>RETRO EDITION v2.0</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Sound Toggle */}
                <button
                  onClick={() => {
                    setIsSoundEnabled(!isSoundEnabled);
                    playSound('click');
                  }}
                  className={`p-2 rounded border border-purple-500/50 transition-all cursor-pointer ${
                    isSoundEnabled 
                      ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(139,0,255,0.3)]' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.header>

          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Desktop: Tools Sidebar */}
            <animated.aside
              style={toolsSpring}
              className="hidden md:block w-64 bg-black/80 backdrop-blur-lg border-r-2 border-purple-500/30 p-4 overflow-y-auto shadow-[0_0_20px_rgba(139,0,255,0.1)] pt-6"
            >
              {/* Tools */}
              <div className="mb-6">
                <h3 className="text-pink-300 font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                  <Brush className="w-4 h-4" />
                  TOOLS
                </h3>
                <div className="space-y-2">
                  {tools.map((tool) => (
                    <motion.button
                      key={tool.name}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ type: "tween", duration: 0.1 }}
                      onClick={() => {
                        setCurrentTool(tool.name);
                        playSound('click');
                      }}
                      className={`w-full p-3 rounded border-2 flex items-center justify-between transition-all duration-150 font-mono cursor-pointer ${
                        currentTool === tool.name
                          ? 'bg-pink-500/30 text-pink-200 border-pink-400 shadow-[0_0_15px_rgba(255,0,128,0.4)]'
                          : 'bg-black/50 text-purple-300 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-400/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <tool.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{tool.label}</span>
                      </div>
                      <span className="text-xs opacity-60 font-bold">{tool.shortcut}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Grid Toggle */}
              <div className="mb-6">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "tween", duration: 0.1 }}
                  onClick={() => {
                    setShowGrid(!showGrid);
                    playSound('click');
                  }}
                  className={`w-full p-3 rounded border-2 flex items-center gap-3 transition-all duration-150 font-mono cursor-pointer ${
                    showGrid
                      ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.4)]'
                      : 'bg-black/50 text-purple-300 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-400/60'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  <span className="text-sm font-medium">GRID</span>
                </motion.button>
              </div>

              {/* Templates */}
              <div className="mb-6">
                <h3 className="text-cyan-300 font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                  <Zap className="w-4 h-4" />
                  TEMPLATES
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {presetTemplates.map((template, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => loadTemplate(template)}
                      className="p-3 bg-black/50 hover:bg-purple-500/10 rounded border border-purple-500/30 hover:border-purple-400/50 text-purple-300 transition-all group cursor-pointer"
                    >
                      <template.icon className="w-5 h-5 mx-auto mb-1 group-hover:text-purple-400 transition-colors" />
                      <span className="text-xs font-mono">{template.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-pink-300 font-bold mb-3 text-sm uppercase tracking-wider" style={{ fontFamily: 'Orbitron, monospace' }}>
                  ACTIONS
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={clearCanvas}
                    className="w-full p-2 bg-pink-500/20 hover:bg-pink-500/30 rounded border border-pink-500/30 text-pink-300 transition-all flex items-center gap-2 text-sm font-mono shadow-[0_0_10px_rgba(255,0,128,0.3)] cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    CLEAR
                  </button>
                </div>
              </div>
            </animated.aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Canvas Section */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Canvas */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex items-center justify-center p-2 md:p-8 pb-24 md:pb-8"
                >
                  <div className="relative w-full flex items-center justify-center">
                    {/* Canvas Container */}
                    <div className="relative bg-black/50 backdrop-blur-sm rounded-lg p-3 md:p-6 border-2 border-pink-500/40 shadow-[0_0_30px_rgba(255,0,128,0.2)] w-full max-w-sm md:max-w-none">
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-lg" />
                      
                      <div className="relative">
                        <div 
                          className="grid gap-0 bg-black/80 p-2 rounded border border-pink-400/40 shadow-[inset_0_0_20px_rgba(255,0,128,0.1)] mx-auto"
                          style={{ 
                            gridTemplateColumns: `repeat(${GRID_SIZE}, ${cellSize}px)`,
                            width: 'fit-content'
                          }}
                        >
                          {getFinalPixelData.map((color, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.1 }}
                              className={`cursor-crosshair transition-all duration-100 ${
                                showGrid ? 'border border-pink-400/20' : ''
                              }`}
                              style={{
                                width: `${cellSize}px`,
                                height: `${cellSize}px`,
                                backgroundColor: color || 'transparent',
                                boxShadow: color ? '0 0 3px rgba(255,0,128,0.5)' : 'none'
                              }}
                              onMouseDown={() => handleMouseDown(index)}
                              onMouseEnter={() => handleMouseEnter(index)}
                              onMouseUp={handleMouseUp}
                            />
                          ))}
                        </div>
                        
                        {/* Canvas Info */}
                        <div className="mt-3 md:mt-4 text-xs text-pink-300 font-mono">
                          <div className="flex items-center justify-between px-1">
                            <span className="font-bold tracking-wider">16×16 GRID</span>
                            <span className="font-bold tracking-wider">TOOL: {currentTool.toUpperCase()}</span>
                          </div>
                          <div className="flex items-center justify-center mt-2 md:hidden">
                            <span className="text-purple-300 bg-purple-500/20 px-3 py-1.5 rounded border border-purple-500/30 font-bold tracking-wider">
                              LAYER: {layers[activeLayer]?.name}
                            </span>
                          </div>
                          <div className="hidden md:block text-center mt-2">
                            <span className="font-bold tracking-wider">LAYER: {layers[activeLayer]?.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Desktop: Right Sidebar */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="hidden md:block w-80 bg-black/80 backdrop-blur-lg border-l-2 border-purple-500/30 p-6 overflow-y-auto shadow-[0_0_20px_rgba(139,0,255,0.1)]"
                >
                  {/* Desktop Preview Window */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-cyan-300 font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                        <Monitor className="w-4 h-4" />
                        PREVIEW
                      </h3>
                      <button
                        onClick={() => setIsAnimating(!isAnimating)}
                        className={`p-2 rounded border-2 transition-all cursor-pointer ${
                          isAnimating
                            ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.4)]'
                            : 'bg-black/50 text-purple-300 border-purple-500/30 hover:bg-purple-500/10'
                        }`}
                      >
                        {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    <div className="bg-black/60 rounded border-2 border-purple-400/40 p-4 shadow-[inset_0_0_20px_rgba(139,0,255,0.1)]">
                      <div className="flex justify-center">
                        <motion.div
                          animate={isAnimating ? {
                            x: [0, 2, 0, -2, 0],
                            y: [0, -1, 0, 1, 0]
                          } : {}}
                          transition={{
                            duration: 2,
                            repeat: isAnimating ? Infinity : 0,
                            ease: "easeInOut"
                          }}
                          className="grid gap-0"
                          style={{
                            gridTemplateColumns: `repeat(${GRID_SIZE}, ${previewCellSize}px)`,
                          }}
                        >
                          {getFinalPixelData.map((color, index) => (
                            <div
                              key={index}
                              style={{
                                width: `${previewCellSize}px`,
                                height: `${previewCellSize}px`,
                                backgroundColor: color || 'transparent'
                              }}
                            />
                          ))}
                        </motion.div>
                      </div>
                      
                      <div className="mt-3 text-center">
                        <span className="text-xs text-cyan-400 font-mono font-bold">
                          {isAnimating ? 'ANIMATING' : 'STATIC'} • {GRID_SIZE}×{GRID_SIZE}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Color Picker */}
                  <div className="mb-6">
                    <h3 className="text-pink-300 font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                      <Palette className="w-4 h-4" />
                      COLORS
                    </h3>
                    
                    {/* Current Color */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-12 h-12 rounded border-2 border-pink-400/50 shadow-[0_0_10px_rgba(255,0,128,0.3)]"
                          style={{ backgroundColor: currentColor }}
                        />
                        <div className="flex-1">
                          <input
                            type="color"
                            value={currentColor}
                            onChange={(e) => setCurrentColor(e.target.value)}
                            className="w-full h-8 rounded border-2 border-pink-400/40 bg-transparent cursor-pointer"
                          />
                          <div className="text-xs text-pink-300 mt-1 font-mono font-bold">
                            {currentColor.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RGB Sliders */}
                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="flex justify-between text-xs text-pink-300 mb-1 font-mono">
                          <span>RED</span>
                          <span>{rgbColor.r}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="255"
                          value={rgbColor.r}
                          onChange={(e) => handleRgbChange('r', e.target.value)}
                          className="w-full h-3 rounded appearance-none cursor-pointer slider-red"
                          style={{
                            background: `linear-gradient(to right, #000000, #ff0000)`,
                            border: '1px solid rgba(255, 0, 0, 0.5)'
                          }}
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-pink-300 mb-1 font-mono">
                          <span>GREEN</span>
                          <span>{rgbColor.g}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="255"
                          value={rgbColor.g}
                          onChange={(e) => handleRgbChange('g', e.target.value)}
                          className="w-full h-3 rounded appearance-none cursor-pointer slider-green"
                          style={{
                            background: `linear-gradient(to right, #000000, #00ff00)`,
                            border: '1px solid rgba(0, 255, 0, 0.5)'
                          }}
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-pink-300 mb-1 font-mono">
                          <span>BLUE</span>
                          <span>{rgbColor.b}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="255"
                          value={rgbColor.b}
                          onChange={(e) => handleRgbChange('b', e.target.value)}
                          className="w-full h-3 rounded appearance-none cursor-pointer slider-blue"
                          style={{
                            background: `linear-gradient(to right, #000000, #0000ff)`,
                            border: '1px solid rgba(0, 0, 255, 0.5)'
                          }}
                        />
                      </div>
                    </div>

                    {/* Color Palette */}
                    <div className="grid grid-cols-6 gap-1">
                      {defaultColors.map((color, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setCurrentColor(color)}
                          className={`w-8 h-8 rounded border-2 transition-all cursor-pointer ${
                            currentColor === color 
                              ? 'border-pink-400 shadow-[0_0_10px_rgba(255,0,128,0.5)]' 
                              : 'border-purple-500/30 hover:border-purple-400/60'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Layers */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-cyan-300 font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                        <Layers className="w-4 h-4" />
                        LAYERS
                      </h3>
                      <button
                        onClick={addLayer}
                        className="p-1 bg-cyan-500/20 hover:bg-cyan-500/30 rounded border border-cyan-500/30 text-cyan-300 transition-all shadow-[0_0_10px_rgba(0,255,255,0.3)] cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-2 max-h-40 overflow-y-auto overflow-x-hidden">
                      {layers.map((layer, index) => (
                        <motion.div
                          key={layer.id}
                          className={`p-3 rounded border-2 transition-all cursor-pointer font-mono ${
                            activeLayer === index
                              ? 'bg-purple-500/20 border-purple-400 shadow-[0_0_10px_rgba(139,0,255,0.3)]'
                              : 'bg-black/50 border-purple-500/30 hover:bg-purple-500/10'
                          }`}
                        >
                          <div className="flex items-center justify-between min-w-0">
                            <button
                              onClick={() => setActiveLayer(index)}
                              className="text-purple-200 text-sm font-medium flex-1 text-left truncate mr-2 cursor-pointer"
                            >
                              {layer.name}
                            </button>
                            <div className="flex gap-1 flex-shrink-0">
                              <button
                                onClick={() => toggleLayerVisibility(index)}
                                className="p-1 text-purple-300/60 hover:text-purple-300 transition-all cursor-pointer"
                              >
                                {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              </button>
                              {layers.length > 1 && index !== 0 && (
                                <button
                                  onClick={() => deleteLayer(index)}
                                  className="p-1 text-purple-300/60 hover:text-orange-400 transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Export Options */}
                  <div>
                    <h3 className="text-cyan-300 font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                      <Share2 className="w-4 h-4" />
                      EXPORT
                    </h3>
                    
                    {/* Platform Selection */}
                    <div className="mb-3">
                      <div className="text-xs text-cyan-300 mb-2 font-mono">PLATFORM</div>
                      <div className="grid grid-cols-3 gap-1">
                        {(['discord', 'twitch', 'general'] as const).map((platform) => (
                          <button
                            key={platform}
                            onClick={() => {
                              setExportOptions(prev => ({ ...prev, platform }));
                              playSound('click');
                            }}
                            className={`p-2 rounded border-2 text-xs transition-all font-mono cursor-pointer ${
                              exportOptions.platform === platform
                                ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                                : 'bg-black/50 text-purple-300 border-purple-500/30 hover:bg-purple-500/10'
                            }`}
                          >
                            {platform === 'discord' && <Monitor className="w-3 h-3 mx-auto mb-1" />}
                            {platform === 'twitch' && <Gamepad2 className="w-3 h-3 mx-auto mb-1" />}
                            {platform === 'general' && <Smartphone className="w-3 h-3 mx-auto mb-1" />}
                            <div>{platform.toUpperCase()}</div>
                            <div className="text-xs opacity-60">
                              {platform === 'discord' && '128px'}
                              {platform === 'twitch' && '300px'}
                              {platform === 'general' && 'Custom'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Export Scale */}
                    {exportOptions.platform === 'general' && (
                      <div className="mb-4">
                        <div className="text-xs text-cyan-300 mb-2 font-mono">SCALE: {exportOptions.scale}X</div>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          value={exportOptions.scale}
                          onChange={(e) => setExportOptions(prev => ({ ...prev, scale: parseInt(e.target.value) }))}
                          className="w-full h-3 rounded appearance-none cursor-pointer slider-cyan"
                          style={{
                            background: `linear-gradient(to right, #0891b2, #06b6d4)`,
                            border: '1px solid rgba(0, 255, 255, 0.5)'
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Export Buttons */}
                    <div className="space-y-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => exportAvatar()}
                        className="w-full p-3 bg-gradient-to-r from-pink-500/50 to-cyan-500/50 hover:from-pink-500/70 hover:to-cyan-500/70 rounded border-2 border-pink-400/50 text-pink-200 transition-all flex items-center gap-2 justify-center font-mono font-bold shadow-[0_0_15px_rgba(255,0,128,0.3)] cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        DOWNLOAD PNG
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={copyToClipboard}
                        className="w-full p-3 bg-gradient-to-r from-cyan-500/50 to-purple-500/50 hover:from-cyan-500/70 hover:to-purple-500/70 rounded border-2 border-cyan-400/50 text-cyan-200 transition-all flex items-center gap-2 justify-center font-mono font-bold shadow-[0_0_15px_rgba(0,255,255,0.3)] cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                        COPY TO CLIPBOARD
                      </motion.button>

                      <div className="text-xs text-center text-cyan-300 mt-2 font-mono">
                        {exportOptions.platform === 'general' 
                          ? `EXPORT SIZE: ${GRID_SIZE * exportOptions.scale}×${GRID_SIZE * exportOptions.scale}PX`
                          : exportOptions.platform === 'discord'
                          ? 'OPTIMIZED FOR DISCORD (128×128PX)'
                          : 'OPTIMIZED FOR TWITCH (300×300PX)'
                        }
                      </div>
                    </div>

                    {/* Social Sharing */}
                    <div className="mt-4 pt-4 border-t border-purple-500/20">
                      <div className="text-xs text-purple-300 mb-2 font-mono">SHARE WITH METADATA</div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => shareToSocial('discord')}
                          className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded border border-purple-500/30 text-xs text-purple-300 transition-all font-mono cursor-pointer"
                        >
                          PIXELCORD
                        </button>
                        <button
                          onClick={() => shareToSocial('twitter')}
                          className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded border border-cyan-500/30 text-xs text-cyan-300 transition-all font-mono cursor-pointer"
                        >
                          CHIRPER
                        </button>
                        <button
                          onClick={() => shareToSocial('reddit')}
                          className="p-2 bg-pink-500/20 hover:bg-pink-500/30 rounded border border-pink-500/30 text-xs text-pink-300 transition-all font-mono cursor-pointer"
                        >
                          NETBOARD
                        </button>
                        <button
                          onClick={() => shareToSocial('facebook')}
                          className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded border border-purple-500/30 text-xs text-purple-300 transition-all font-mono cursor-pointer"
                        >
                          SOCIALBOOK
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Mobile: Draggable Bottom Sheet */}
            <animated.div
              className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t-2 border-purple-500/30 rounded-t-3xl shadow-[0_-10px_30px_rgba(139,0,255,0.2)] z-10"
              style={{ 
                height: '80vh',
                transform: bottomSheetSpring.y.to(y => `translateY(${y}px)`)
              }}
            >
              {/* Draggable Handle Area */}
              <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.1}
                onDragEnd={(event, info) => {
                  const threshold = 100;
                  if (info.offset.y > threshold) {
                    setIsBottomSheetOpen(false);
                  } else if (info.offset.y < -threshold) {
                    setIsBottomSheetOpen(true);
                  }
                }}
                className="cursor-grab active:cursor-grabbing"
              >
                {/* Drag Handle */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-12 h-1 bg-purple-400/60 rounded-full shadow-[0_0_10px_rgba(139,0,255,0.4)]"></div>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-4 pb-4 border-b border-purple-500/20">
                  <h3 className="text-pink-300 font-bold text-lg uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                    <Gamepad2 className="w-5 h-5" />
                    CONTROLS
                  </h3>
                  <button
                    onClick={() => {
                      setIsBottomSheetOpen(!isBottomSheetOpen);
                      playSound('click');
                    }}
                    className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-full border border-purple-500/30 text-purple-300 transition-all shadow-[0_0_10px_rgba(139,0,255,0.3)] cursor-pointer"
                  >
                    {isBottomSheetOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Scrollable Controls Content */}
              <div 
                className="flex-1 overflow-y-auto overscroll-contain pb-8"
                style={{
                  touchAction: 'pan-y',
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'smooth',
                  maxHeight: 'calc(80vh - 120px)' // Account for header height
                }}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                <div className="p-4 space-y-6">
                  {/* Mobile Tools */}
                  <div>
                    <h3 className="text-pink-300 font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                      <Brush className="w-4 h-4" />
                      TOOLS
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {tools.map((tool) => (
                        <motion.button
                          key={tool.name}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setCurrentTool(tool.name);
                            playSound('click');
                          }}
                          className={`p-3 rounded border-2 flex items-center justify-center gap-2 transition-all duration-200 font-mono cursor-pointer ${
                            currentTool === tool.name
                              ? 'bg-pink-500/30 text-pink-200 border-pink-400 shadow-[0_0_15px_rgba(255,0,128,0.4)]'
                              : 'bg-black/50 text-purple-300 border-purple-500/30 active:bg-purple-500/10'
                          }`}
                        >
                          <tool.icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{tool.label}</span>
                        </motion.button>
                      ))}
                      
                      {/* Clear button in 2x2 layout */}
                      <button
                        onClick={clearCanvas}
                        className="p-3 bg-pink-500/20 active:bg-pink-500/30 rounded border-2 border-pink-500/30 text-pink-300 transition-all flex items-center justify-center gap-2 text-sm font-mono shadow-[0_0_10px_rgba(255,0,128,0.3)] cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        CLEAR
                      </button>
                    </div>
                    
                    {/* Grid Toggle - Full Width */}
                    <div className="mt-2">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setShowGrid(!showGrid);
                          playSound('click');
                        }}
                        className={`w-full p-3 rounded border-2 flex items-center justify-center gap-2 transition-all font-mono cursor-pointer ${
                          showGrid
                            ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.4)]'
                            : 'bg-black/50 text-purple-300 border-purple-500/30 active:bg-purple-500/10'
                        }`}
                      >
                        <Grid className="w-4 h-4" />
                        <span className="text-sm font-medium">GRID</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Mobile Preview */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-cyan-300 font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                        <Monitor className="w-4 h-4" />
                        PREVIEW
                      </h3>
                      <button
                        onClick={() => {
                          setIsAnimating(!isAnimating);
                          playSound('click');
                        }}
                        className={`p-2 rounded border-2 transition-all cursor-pointer ${
                          isAnimating
                            ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.4)]'
                            : 'bg-black/50 text-purple-300 border-purple-500/30 hover:bg-purple-500/10'
                        }`}
                      >
                        {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    <div className="bg-black/60 rounded border-2 border-purple-400/40 p-2 shadow-[inset_0_0_20px_rgba(139,0,255,0.1)]">
                      <div className="flex justify-center">
                        <motion.div
                          animate={isAnimating ? {
                            x: [0, 2, 0, -2, 0],
                            y: [0, -1, 0, 1, 0]
                          } : {}}
                          transition={{
                            duration: 2,
                            repeat: isAnimating ? Infinity : 0,
                            ease: "easeInOut"
                          }}
                          className="grid gap-0"
                          style={{
                            gridTemplateColumns: `repeat(${GRID_SIZE}, ${previewCellSize}px)`,
                          }}
                        >
                          {getFinalPixelData.map((color, index) => (
                            <div
                              key={index}
                              style={{
                                width: `${previewCellSize}px`,
                                height: `${previewCellSize}px`,
                                backgroundColor: color || 'transparent'
                              }}
                            />
                          ))}
                        </motion.div>
                      </div>
                      
                      <div className="mt-2 text-center">
                        <span className="text-xs text-cyan-400 font-mono font-bold">
                          {isAnimating ? 'ANIMATING' : 'STATIC'} • {GRID_SIZE}×{GRID_SIZE}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Templates */}
                  <div>
                    <h3 className="text-cyan-300 font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                      <Zap className="w-4 h-4" />
                      TEMPLATES
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {presetTemplates.map((template, index) => (
                        <motion.button
                          key={index}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => loadTemplate(template)}
                          className="p-3 bg-black/50 active:bg-purple-500/10 rounded border border-purple-500/30 text-purple-300 transition-all group cursor-pointer"
                        >
                          <template.icon className="w-5 h-5 mx-auto mb-1 group-active:text-purple-400 transition-colors" />
                          <span className="text-xs font-mono">{template.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Colors */}
                  <div>
                    <h3 className="text-pink-300 font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                      <Palette className="w-4 h-4" />
                      COLORS
                    </h3>
                    
                    {/* Current Color */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-12 h-12 rounded border-2 border-pink-400/50 shadow-[0_0_10px_rgba(255,0,128,0.3)]"
                          style={{ backgroundColor: currentColor }}
                        />
                        <div className="flex-1">
                          <input
                            type="color"
                            value={currentColor}
                            onChange={(e) => setCurrentColor(e.target.value)}
                            className="w-full h-10 rounded border-2 border-pink-400/40 bg-transparent cursor-pointer"
                          />
                          <div className="text-xs text-pink-300 mt-1 font-mono font-bold">
                            {currentColor.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RGB Sliders */}
                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="flex justify-between text-xs text-pink-300 mb-1 font-mono">
                          <span>RED</span>
                          <span>{rgbColor.r}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="255"
                          value={rgbColor.r}
                          onChange={(e) => handleRgbChange('r', e.target.value)}
                          className="w-full h-4 rounded appearance-none cursor-pointer slider-red"
                          style={{
                            background: `linear-gradient(to right, #000000, #ff0000)`,
                            border: '1px solid rgba(255, 0, 0, 0.5)'
                          }}
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-pink-300 mb-1 font-mono">
                          <span>GREEN</span>
                          <span>{rgbColor.g}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="255"
                          value={rgbColor.g}
                          onChange={(e) => handleRgbChange('g', e.target.value)}
                          className="w-full h-4 rounded appearance-none cursor-pointer slider-green"
                          style={{
                            background: `linear-gradient(to right, #000000, #00ff00)`,
                            border: '1px solid rgba(0, 255, 0, 0.5)'
                          }}
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-pink-300 mb-1 font-mono">
                          <span>BLUE</span>
                          <span>{rgbColor.b}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="255"
                          value={rgbColor.b}
                          onChange={(e) => handleRgbChange('b', e.target.value)}
                          className="w-full h-4 rounded appearance-none cursor-pointer slider-blue"
                          style={{
                            background: `linear-gradient(to right, #000000, #0000ff)`,
                            border: '1px solid rgba(0, 0, 255, 0.5)'
                          }}
                        />
                      </div>
                    </div>

                    {/* Color Palette */}
                    <div className="grid grid-cols-8 gap-2 mb-4">
                      {defaultColors.map((color, index) => (
                        <motion.button
                          key={index}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setCurrentColor(color)}
                          className={`w-8 h-8 rounded border-2 transition-all cursor-pointer ${
                            currentColor === color 
                              ? 'border-pink-400 shadow-[0_0_10px_rgba(255,0,128,0.5)]' 
                              : 'border-purple-500/30 active:border-purple-400/60'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Mobile Layers */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-cyan-300 font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                        <Layers className="w-4 h-4" />
                        LAYERS
                      </h3>
                      <button
                        onClick={addLayer}
                        className="p-1 bg-cyan-500/20 active:bg-cyan-500/30 rounded border border-cyan-500/30 text-cyan-300 transition-all shadow-[0_0_10px_rgba(0,255,255,0.3)] cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-2 max-h-32 overflow-y-auto overflow-x-hidden">
                      {layers.map((layer, index) => (
                        <motion.div
                          key={layer.id}
                          whileTap={{ scale: 0.98 }}
                          className={`p-3 rounded border-2 transition-all cursor-pointer font-mono ${
                            activeLayer === index
                              ? 'bg-purple-500/20 border-purple-400 shadow-[0_0_10px_rgba(139,0,255,0.3)]'
                              : 'bg-black/50 border-purple-500/30 active:bg-purple-500/10'
                          }`}
                        >
                          <div className="flex items-center justify-between min-w-0">
                            <button
                              onClick={() => {
                                setActiveLayer(index);
                                playSound('click');
                              }}
                              className="text-purple-200 text-sm font-medium flex-1 text-left truncate mr-2 cursor-pointer"
                            >
                              {layer.name}
                            </button>
                            <div className="flex gap-1 flex-shrink-0">
                                                             <button
                                 onClick={() => {
                                   toggleLayerVisibility(index);
                                   playSound('click');
                                 }}
                                 className="p-1 text-purple-300/60 active:text-purple-300 transition-all cursor-pointer"
                               >
                                 {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                               </button>
                               {layers.length > 1 && index !== 0 && (
                                 <button
                                   onClick={() => {
                                     deleteLayer(index);
                                     playSound('erase');
                                   }}
                                   className="p-1 text-purple-300/60 active:text-pink-400 transition-all cursor-pointer"
                                 >
                                   <Trash2 className="w-3 h-3" />
                                 </button>
                               )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Export */}
                  <div>
                    <h3 className="text-cyan-300 font-bold mb-3 text-sm uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                      <Share2 className="w-4 h-4" />
                      EXPORT
                    </h3>
                    
                    {/* Platform Selection */}
                    <div className="mb-3">
                      <div className="text-xs text-cyan-300 mb-2 font-mono">PLATFORM</div>
                      <div className="grid grid-cols-3 gap-1">
                        {(['discord', 'twitch', 'general'] as const).map((platform) => (
                          <button
                            key={platform}
                            onClick={() => {
                              setExportOptions(prev => ({ ...prev, platform }));
                              playSound('click');
                            }}
                            className={`p-2 rounded border-2 text-xs transition-all font-mono cursor-pointer ${
                              exportOptions.platform === platform
                                ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                                : 'bg-black/50 text-purple-300 border-purple-500/30 hover:bg-purple-500/10'
                            }`}
                          >
                            {platform === 'discord' && <Monitor className="w-3 h-3 mx-auto mb-1" />}
                            {platform === 'twitch' && <Gamepad2 className="w-3 h-3 mx-auto mb-1" />}
                            {platform === 'general' && <Smartphone className="w-3 h-3 mx-auto mb-1" />}
                            <div>{platform.toUpperCase()}</div>
                            <div className="text-xs opacity-60">
                              {platform === 'discord' && '128px'}
                              {platform === 'twitch' && '300px'}
                              {platform === 'general' && 'Custom'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Export Scale */}
                    {exportOptions.platform === 'general' && (
                      <div className="mb-4">
                        <div className="text-xs text-cyan-300 mb-2 font-mono">SCALE: {exportOptions.scale}X</div>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          value={exportOptions.scale}
                          onChange={(e) => setExportOptions(prev => ({ ...prev, scale: parseInt(e.target.value) }))}
                          className="w-full h-4 rounded appearance-none cursor-pointer slider-cyan"
                          style={{
                            background: `linear-gradient(to right, #0891b2, #06b6d4)`,
                            border: '1px solid rgba(0, 255, 255, 0.5)'
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Export Buttons */}
                    <div className="space-y-3">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => exportAvatar()}
                        className="w-full p-4 bg-gradient-to-r from-pink-500/50 to-cyan-500/50 active:from-pink-500/70 active:to-cyan-500/70 rounded border-2 border-pink-400/50 text-pink-200 transition-all flex items-center gap-2 justify-center font-mono font-bold shadow-[0_0_15px_rgba(255,0,128,0.3)] cursor-pointer"
                      >
                        <Download className="w-5 h-5" />
                        DOWNLOAD PNG
                      </motion.button>
                      
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={copyToClipboard}
                        className="w-full p-4 bg-gradient-to-r from-cyan-500/50 to-purple-500/50 active:from-cyan-500/70 active:to-purple-500/70 rounded border-2 border-cyan-400/50 text-cyan-200 transition-all flex items-center gap-2 justify-center font-mono font-bold shadow-[0_0_15px_rgba(0,255,255,0.3)] cursor-pointer"
                      >
                        <Copy className="w-5 h-5" />
                        COPY TO CLIPBOARD
                      </motion.button>

                      <div className="text-xs text-center text-cyan-300 mt-2 font-mono">
                        {exportOptions.platform === 'general' 
                          ? `EXPORT SIZE: ${GRID_SIZE * exportOptions.scale}×${GRID_SIZE * exportOptions.scale}PX`
                          : exportOptions.platform === 'discord'
                          ? 'OPTIMIZED FOR DISCORD (128×128PX)'
                          : 'OPTIMIZED FOR TWITCH (300×300PX)'
                        }
                      </div>
                    </div>

                    {/* Social Sharing */}
                    <div className="mt-4 pt-4 border-t border-purple-500/20">
                      <div className="text-xs text-purple-300 mb-2 font-mono">SHARE WITH METADATA</div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => shareToSocial('discord')}
                          className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded border border-purple-500/30 text-xs text-purple-300 transition-all font-mono cursor-pointer"
                        >
                          PIXELCORD
                        </button>
                        <button
                          onClick={() => shareToSocial('twitter')}
                          className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded border border-cyan-500/30 text-xs text-cyan-300 transition-all font-mono cursor-pointer"
                        >
                          CHIRPER
                        </button>
                        <button
                          onClick={() => shareToSocial('reddit')}
                          className="p-2 bg-pink-500/20 hover:bg-pink-500/30 rounded border border-pink-500/30 text-xs text-pink-300 transition-all font-mono cursor-pointer"
                        >
                          NETBOARD
                        </button>
                        <button
                          onClick={() => shareToSocial('facebook')}
                          className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded border border-purple-500/30 text-xs text-purple-300 transition-all font-mono cursor-pointer"
                        >
                          SOCIALBOOK
                        </button>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </animated.div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Mono:wght@400;700&family=Press+Start+2P&display=swap');
        
        /* Hide scrollbars for all browsers */
        * {
          scrollbar-width: none !important; /* Firefox */
          -ms-overflow-style: none !important; /* Internet Explorer 10+ */
        }
        
        *::-webkit-scrollbar {
          display: none !important; /* Safari and Chrome */
          width: 0px !important;
          height: 0px !important;
          background: transparent !important;
        }
        
        *::-webkit-scrollbar-track {
          display: none !important;
          background: transparent !important;
        }
        
        *::-webkit-scrollbar-thumb {
          display: none !important;
          background: transparent !important;
        }
        
        *::-webkit-scrollbar-corner {
          display: none !important;
          background: transparent !important;
        }
        
        html, body {
          overflow: auto !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        
        html::-webkit-scrollbar, 
        body::-webkit-scrollbar,
        div::-webkit-scrollbar,
        aside::-webkit-scrollbar {
          display: none !important;
          width: 0px !important;
          height: 0px !important;
          background: transparent !important;
        }
        
        /* Ensure all scrollable elements hide scrollbars */
        .overflow-y-auto::-webkit-scrollbar,
        .overflow-x-auto::-webkit-scrollbar,
        .overflow-auto::-webkit-scrollbar {
          display: none !important;
          width: 0px !important;
          height: 0px !important;
        }
        
        .overflow-y-auto,
        .overflow-x-auto,
        .overflow-auto {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
          height: 12px;
          border-radius: 6px;
        }
        
        input[type="range"]::-webkit-slider-track {
          height: 12px;
          border-radius: 6px;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff0080, #00ffff);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 0, 128, 0.5);
          margin-top: -1px;
        }
        
        input[type="range"]::-moz-range-track {
          height: 12px;
          border-radius: 6px;
          border: none;
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff0080, #00ffff);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 0, 128, 0.5);
          margin-top: -1px;
        }

        .slider-red::-webkit-slider-thumb {
          background: linear-gradient(135deg, #ff0000, #ff6666);
          border: 2px solid #ff0000;
          box-shadow: 0 0 10px rgba(255, 0, 0, 0.7);
          margin-top: -1px;
        }

        .slider-green::-webkit-slider-thumb {
          background: linear-gradient(135deg, #00ff00, #66ff66);
          border: 2px solid #00ff00;
          box-shadow: 0 0 10px rgba(0, 255, 0, 0.7);
          margin-top: -1px;
        }

        .slider-blue::-webkit-slider-thumb {
          background: linear-gradient(135deg, #0000ff, #6666ff);
          border: 2px solid #0000ff;
          box-shadow: 0 0 10px rgba(0, 0, 255, 0.7);
          margin-top: -1px;
        }

        .slider-red::-moz-range-thumb {
          background: linear-gradient(135deg, #ff0000, #ff6666);
          border: 2px solid #ff0000;
          box-shadow: 0 0 10px rgba(255, 0, 0, 0.7);
          margin-top: -1px;
        }

        .slider-green::-moz-range-thumb {
          background: linear-gradient(135deg, #00ff00, #66ff66);
          border: 2px solid #00ff00;
          box-shadow: 0 0 10px rgba(0, 255, 0, 0.7);
          margin-top: -1px;
        }

        .slider-blue::-moz-range-thumb {
          background: linear-gradient(135deg, #0000ff, #6666ff);
          border: 2px solid #0000ff;
          box-shadow: 0 0 10px rgba(0, 0, 255, 0.7);
          margin-top: -1px;
        }

        .slider-orange::-webkit-slider-thumb {
          background: linear-gradient(135deg, #ff6600, #ff9900);
          border: 2px solid #ff6600;
          box-shadow: 0 0 10px rgba(255, 165, 0, 0.7);
          margin-top: -1px;
        }

        .slider-orange::-moz-range-thumb {
          background: linear-gradient(135deg, #ff6600, #ff9900);
          border: 2px solid #ff6600;
          box-shadow: 0 0 10px rgba(255, 165, 0, 0.7);
          margin-top: -1px;
        }

        .slider-cyan::-webkit-slider-thumb {
          background: linear-gradient(135deg, #0891b2, #06b6d4);
          border: 2px solid #0891b2;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
          margin-top: -1px;
        }

        .slider-cyan::-moz-range-thumb {
          background: linear-gradient(135deg, #0891b2, #06b6d4);
          border: 2px solid #0891b2;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
          margin-top: -1px;
        }
      `}</style>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#ff0080',
            border: '1px solid rgba(255, 0, 128, 0.5)',
            borderRadius: '8px',
            boxShadow: '0 0 20px rgba(255, 0, 128, 0.3)',
            fontFamily: 'monospace',
            fontSize: '14px',
            backdropFilter: 'blur(10px)',
          },
          success: {
            iconTheme: {
              primary: '#00ff00',
              secondary: '#000000',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff0000',
              secondary: '#000000',
            },
          },
        }}
      />
    </>
  );
};

export default PixelAvatarStudio;
"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  Download,
  Type,
  Square,
  Circle,
  Triangle,
  Palette,
  Move,
  RotateCw,
  Zap,
  Image,
  Layers,
  Settings,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  ChevronDown,
  Sparkles,
  Undo2,
  Redo2,
  Grid3X3,
  Lock,
  Unlock,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Upload,
  Star,
  Users,
  Shield,
  Check,
  Menu,
  X,
  ArrowRight,
  PlayCircle,
  ChevronRight,
  Hexagon,
  PenTool,
} from "lucide-react";

interface CanvasElement {
  id: string;
  type: "text" | "shape" | "image";
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  textDecoration?: "none" | "underline";
  textAlign?: "left" | "center" | "right";
  color: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  shapeType?:
    | "rectangle"
    | "circle"
    | "triangle"
    | "hexagon"
    | "star"
    | "diamond";
  rotation: number;
  opacity: number;
  animation?:
    | "none"
    | "pulse"
    | "rotate"
    | "bounce"
    | "fade"
    | "slide"
    | "scale"
    | "float";
  animationSpeed: number;
  animationDelay?: number;
  visible: boolean;
  locked: boolean;
  zIndex: number;
  shadow?: {
    x: number;
    y: number;
    blur: number;
    color: string;
  };
}

interface Template {
  id: string;
  name: string;
  category: string;
  elements: Omit<CanvasElement, "id">[];
  background: string;
  preview: string;
}

const PosterDesigner: React.FC = () => {
  const [currentView, setCurrentView] = useState<"landing" | "designer">(
    "landing"
  );
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [tool, setTool] = useState<"select" | "text" | "shape" | "draw">(
    "select"
  );
  const [isAnimating, setIsAnimating] = useState(true);
  const [canvasBackground, setCanvasBackground] = useState("#ffffff");
  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [history, setHistory] = useState<CanvasElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [exportFormat, setExportFormat] = useState<"png" | "jpg">("png");
  const [exportQuality, setExportQuality] = useState<
    "standard" | "high" | "ultra"
  >("high");

  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize] = useState({ width: 900, height: 800 });
  const [windowSize, setWindowSize] = useState({ width: 900, height: 800 });

  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    elementId: string | null;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
  }>({
    isDragging: false,
    elementId: null,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  });

  const fonts = [
    "Inter",
    "Roboto",
    "Poppins",
    "Montserrat",
    "Playfair Display",
    "Source Sans Pro",
    "Open Sans",
    "Lato",
    "Nunito",
    "Raleway",
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Georgia",
    "Verdana",
  ];

  const colors = [
    "#000000",
    "#1f2937",
    "#374151",
    "#6b7280",
    "#9ca3af",
    "#d1d5db",
    "#f3f4f6",
    "#ffffff",
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#dc2626",
    "#ea580c",
    "#ca8a04",
    "#16a34a",
    "#2563eb",
    "#7c3aed",
    "#db2777",
    "#0f766e",
    "#7f1d1d",
    "#9a3412",
    "#a16207",
    "#14532d",
    "#1e3a8a",
    "#581c87",
    "#831843",
    "#134e4a",
  ];

  const backgroundGradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    "linear-gradient(135deg, #667db6 0%, #0082c8 100%)",
    "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
    "linear-gradient(135deg, #833ab4 0%, #fd1d1d 100%)",
    "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
  ];

  const templates = [
    {
      id: "modern-minimal",
      name: "Modern Minimal",
      category: "Business",
      preview: "#f8fafc",
      background: "linear-gradient(135deg, #421a2e 0%, #64213e 100%)",
      elements: [
        {
          type: "text",
          x: 100,
          y: 150,
          width: 800,
          height: 120,
          content: "INNOVATE",
          fontSize: 84,
          fontFamily: "Inter",
          fontWeight: "bold",
          color: "#ffffff",
          textAlign: "center",
          rotation: 0,
          opacity: 1,
          animation: "none",
          animationSpeed: 1,
          visible: true,
          locked: false,
          zIndex: 1,
        },
        {
          type: "text",
          x: 100,
          y: 280,
          width: 800,
          height: 60,
          content: "Transform your ideas into reality",
          fontSize: 24,
          fontFamily: "Inter",
          color: "#64748b",
          textAlign: "center",
          rotation: 0,
          opacity: 1,
          animation: "none",
          animationSpeed: 1,
          visible: true,
          locked: false,
          zIndex: 2,
        },
        {
          type: "shape",
          x: 500,
          y: 400,
          width: 200,
          height: 8,
          shapeType: "rectangle",
          backgroundColor: "#3b82f6",
          rotation: 0,
          opacity: 1,
          animation: "none",
          animationSpeed: 1,
          visible: true,
          locked: false,
          zIndex: 3,
          color: "#3b82f6",
        },
      ],
    },
    {
      id: "creative-burst",
      name: "Creative Burst",
      category: "Creative",
      preview: "#1a1a2e",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      elements: [
        {
          type: "shape",
          x: 200,
          y: 100,
          width: 150,
          height: 150,
          shapeType: "circle",
          backgroundColor: "#ff6b6b",
          visible: true,
          locked: false,
          zIndex: 1,
          color: "#ff6b6b",
        },
        {
          type: "text",
          x: 400,
          y: 200,
          width: 600,
          height: 200,
          content: "CREATE\nAMAZING\nDESIGNS",
          fontSize: 48,
          fontFamily: "Montserrat",
          fontWeight: "bold",
          color: "#ffffff",
          textAlign: "left",
          rotation: 0,
          opacity: 1,
          animation: "none",
          animationSpeed: 1,
          visible: true,
          locked: false,
          zIndex: 2,
        },
        {
          type: "shape",
          x: 900,
          y: 450,
          width: 100,
          height: 100,
          shapeType: "triangle",
          backgroundColor: "#4ecdc4",
          opacity: 0.7,
          visible: true,
          locked: false,
          zIndex: 3,
          color: "#4ecdc4",
        },
      ],
    },
  ];

  function parseGradientStops(
    cssGradient: string
  ): { angle: number; stops: [number, string][] } | null {
    // This regex only handles “linear-gradient(123deg, #rrggbb 0%, #rrggbb 100%)” etc.
    const match = cssGradient.match(
      /linear-gradient\(\s*([0-9]+)deg\s*,\s*(#[0-9a-fA-F]{3,6})\s*([0-9]{1,3})%?\s*,\s*(#[0-9a-fA-F]{3,6})\s*([0-9]{1,3})%?(?:\s*,\s*(#[0-9a-fA-F]{3,6})\s*([0-9]{1,3})%?)*\s*\)/
    );
    if (!match) return null;
    const angle = parseInt(match[1], 10);
    const stops: [number, string][] = [];
    // match[2]=firstColor, match[3]=firstPos, match[4]=secondColor, match[5]=secondPos, etc.
    for (let i = 2; i + 1 < match.length; i += 2) {
      const color = match[i];
      const posRaw = match[i + 1];
      if (!color || !posRaw) continue;
      const pos = parseInt(posRaw, 10) / 100;
      stops.push([pos, color]);
    }
    return { angle, stops };
  }

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addToHistory = useCallback(
    (newElements: CanvasElement[]) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        return [...newHistory, JSON.parse(JSON.stringify(newElements))];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setElements(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setElements(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const addElement = useCallback(
    (type: "text" | "shape", shapeType?: string) => {
      setElements((prev) => {
        const newElement: CanvasElement = {
          id: generateId(),
          type,
          x: canvasSize.width / 2 - 100,
          y: canvasSize.height / 2 - 50,
          width: type === "text" ? 200 : 100,
          height: type === "text" ? 50 : 100,
          content: type === "text" ? "Your Text Here" : undefined,
          fontSize: 24,
          fontFamily: "Inter",
          fontWeight: "normal",
          fontStyle: "normal",
          textDecoration: "none",
          textAlign: "center",
          color: "#000000",
          backgroundColor: type === "shape" ? "#3b82f6" : undefined,
          borderColor: "#000000",
          borderWidth: 0,
          borderRadius: 0,
          shapeType: (shapeType as any) || "rectangle",
          rotation: 0,
          opacity: 1,
          animation: "none",
          animationSpeed: 1,
          animationDelay: 0,
          visible: true,
          locked: false,
          zIndex: prev.length,
          shadow: {
            x: 0,
            y: 0,
            blur: 0,
            color: "#000000",
          },
        };

        const newElements = [...prev, newElement];
        addToHistory(newElements);
        setSelectedElement(newElement.id);
        setTool("select");
        return newElements;
      });
    },
    [canvasSize, addToHistory]
  );

  const updateElement = useCallback(
    (id: string, updates: Partial<CanvasElement>) => {
      setElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
      );
    },
    []
  );

  const deleteElement = useCallback(
    (id: string) => {
      setElements((prev) => {
        const newElements = prev.filter((el) => el.id !== id);
        addToHistory(newElements);
        return newElements;
      });
      setSelectedElement(null);
    },
    [addToHistory]
  );

  const duplicateElement = useCallback(
    (id: string) => {
      setElements((prev) => {
        const element = prev.find((el) => el.id === id);
        if (element) {
          const newElement = {
            ...element,
            id: generateId(),
            x: element.x + 20,
            y: element.y + 20,
            zIndex: prev.length,
          };
          const newElements = [...prev, newElement];
          addToHistory(newElements);
          setSelectedElement(newElement.id);
          return newElements;
        }
        return prev;
      });
    },
    [addToHistory]
  );

  const loadTemplate = useCallback(
    (template: Template) => {
      const newElements = template.elements.map((el, index) => ({
        ...el,
        id: generateId(),
        zIndex: index,
      }));
      setElements(newElements);
      setCanvasBackground(template.background);
      addToHistory(newElements);
      setSelectedTemplate(template);
      setSelectedElement(null);
    },
    [addToHistory]
  );

  const exportAsImage = useCallback(async () => {
    // 1) Wait for all fonts to be loaded so text renders correctly
    await document.fonts.ready;

    // 2) Create a new <canvas> sized to (canvasSize.width × scale) × (canvasSize.height × scale)
    const scale =
      exportQuality === "ultra" ? 4 : exportQuality === "high" ? 3 : 2;
    const canvas = document.createElement("canvas");
    canvas.width = canvasSize.width * scale;
    canvas.height = canvasSize.height * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Scale everything so 1 CSS pixel = 1 logical unit
    ctx.scale(scale, scale);

    // 3) Draw the background (solid color or parsed gradient)
    if (canvasBackground.startsWith("linear-gradient")) {
      const parsed = parseGradientStops(canvasBackground);
      if (parsed) {
        const rad = (parsed.angle * Math.PI) / 180;
        // Compute gradient vector from angle
        const x0 = canvasSize.width * 0.5 * (1 - Math.cos(rad));
        const y0 = canvasSize.height * 0.5 * (1 - Math.sin(rad));
        const x1 = canvasSize.width * 0.5 * (1 + Math.cos(rad));
        const y1 = canvasSize.height * 0.5 * (1 + Math.sin(rad));
        const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
        parsed.stops.forEach(([pos, color]) => {
          gradient.addColorStop(pos, color);
        });
        ctx.fillStyle = gradient;
      } else {
        // Fallback if parsing fails
        ctx.fillStyle = "#ffffff";
      }
    } else {
      // Solid color
      ctx.fillStyle = canvasBackground;
    }
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    // 4) Draw each element (sorted by zIndex)
    const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
    sorted.forEach((element) => {
      if (!element.visible) return;
      ctx.save();
      ctx.globalAlpha = element.opacity;

      // Apply shadow if any
      if (element.shadow && element.shadow.blur > 0) {
        ctx.shadowOffsetX = element.shadow.x;
        ctx.shadowOffsetY = element.shadow.y;
        ctx.shadowBlur = element.shadow.blur;
        ctx.shadowColor = element.shadow.color;
      }

      // Move origin to element’s center, then rotate
      const centerX = element.x + element.width / 2;
      const centerY = element.y + element.height / 2;
      ctx.translate(centerX, centerY);
      ctx.rotate((element.rotation * Math.PI) / 180);

      // Draw text
      if (element.type === "text" && element.content) {
        ctx.fillStyle = element.color;
        // Build font string: "<fontStyle> <fontWeight> <fontSize>px <fontFamily>"
        const stylePart = element.fontStyle === "italic" ? "italic " : "";
        const weightPart = element.fontWeight === "bold" ? "bold " : "";
        const sizePart = `${element.fontSize}px`;
        ctx.font = `${stylePart}${weightPart}${sizePart} ${element.fontFamily}`;
        ctx.textAlign = (element.textAlign as CanvasTextAlign) || "center";
        ctx.textBaseline = "middle";

        const lines = element.content.split("\n");
        const lineHeight = (element.fontSize as number) * 1.2;
        // Vertical offset so multi-line is centered
        const startY = -((lines.length - 1) * lineHeight) / 2;
        lines.forEach((line, i) => {
          ctx.fillText(line, 0, startY + i * lineHeight);
        });
      } else if (element.type === "shape") {
        // Draw shapes
        const fillColor = element.backgroundColor ?? element.color;
        ctx.fillStyle = fillColor;
        if (element.borderWidth && element.borderWidth > 0) {
          ctx.strokeStyle = element.borderColor ?? "#000000";
          ctx.lineWidth = element.borderWidth;
        }

        switch (element.shapeType) {
          case "rectangle":
            if (element.borderRadius && element.borderRadius > 0) {
              // Rounded rectangle
              const r = Math.min(
                element.borderRadius,
                element.width / 2,
                element.height / 2
              );
              // Path for a rounded rect
              ctx.beginPath();
              ctx.moveTo(-element.width / 2 + r, -element.height / 2);
              ctx.lineTo(element.width / 2 - r, -element.height / 2);
              ctx.quadraticCurveTo(
                element.width / 2,
                -element.height / 2,
                element.width / 2,
                -element.height / 2 + r
              );
              ctx.lineTo(element.width / 2, element.height / 2 - r);
              ctx.quadraticCurveTo(
                element.width / 2,
                element.height / 2,
                element.width / 2 - r,
                element.height / 2
              );
              ctx.lineTo(-element.width / 2 + r, element.height / 2);
              ctx.quadraticCurveTo(
                -element.width / 2,
                element.height / 2,
                -element.width / 2,
                element.height / 2 - r
              );
              ctx.lineTo(-element.width / 2, -element.height / 2 + r);
              ctx.quadraticCurveTo(
                -element.width / 2,
                -element.height / 2,
                -element.width / 2 + r,
                -element.height / 2
              );
              ctx.closePath();
              ctx.fill();
              if (element.borderWidth && element.borderWidth > 0) ctx.stroke();
            } else {
              // Normal rectangle
              ctx.fillRect(
                -element.width / 2,
                -element.height / 2,
                element.width,
                element.height
              );
              if (element.borderWidth && element.borderWidth > 0) {
                ctx.strokeRect(
                  -element.width / 2,
                  -element.height / 2,
                  element.width,
                  element.height
                );
              }
            }
            break;

          case "circle":
            ctx.beginPath();
            ctx.arc(0, 0, element.width / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            if (element.borderWidth && element.borderWidth > 0) ctx.stroke();
            break;

          case "triangle":
            ctx.beginPath();
            ctx.moveTo(0, -element.height / 2);
            ctx.lineTo(-element.width / 2, element.height / 2);
            ctx.lineTo(element.width / 2, element.height / 2);
            ctx.closePath();
            ctx.fill();
            if (element.borderWidth && element.borderWidth > 0) ctx.stroke();
            break;

          case "hexagon":
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
              const theta = (Math.PI / 3) * i - Math.PI / 2;
              const x = (element.width / 2) * Math.cos(theta);
              const y = (element.height / 2) * Math.sin(theta);
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            if (element.borderWidth && element.borderWidth > 0) ctx.stroke();
            break;

          case "star":
            // 5-point star
            const outerR = element.width / 2;
            const innerR = outerR * 0.5;
            ctx.beginPath();
            for (let i = 0; i < 10; i++) {
              const r = i % 2 === 0 ? outerR : innerR;
              const theta = ((Math.PI * 2) / 10) * i - Math.PI / 2;
              const x = r * Math.cos(theta);
              const y = r * Math.sin(theta);
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            if (element.borderWidth && element.borderWidth > 0) ctx.stroke();
            break;

          case "diamond":
            ctx.beginPath();
            ctx.moveTo(0, -element.height / 2);
            ctx.lineTo(element.width / 2, 0);
            ctx.lineTo(0, element.height / 2);
            ctx.lineTo(-element.width / 2, 0);
            ctx.closePath();
            ctx.fill();
            if (element.borderWidth && element.borderWidth > 0) ctx.stroke();
            break;

          default:
            break;
        }
      }

      ctx.restore();
    });

    // 5) Download as PNG or JPG
    const link = document.createElement("a");
    link.download = `poster-design.${exportFormat}`;
    link.href = canvas.toDataURL(
      `image/${exportFormat}`,
      exportFormat === "jpg" ? 0.9 : undefined
    );
    link.click();
  }, [elements, canvasBackground, canvasSize, exportFormat, exportQuality]);

  const handleExport = useCallback(() => {
    if (exportFormat === "png" || exportFormat === "jpg") {
      exportAsImage();
    }
  }, [exportFormat, exportAsImage]);

  const selectedElementData = selectedElement
    ? elements.find((el) => el.id === selectedElement)
    : null;

  const getAnimationClass = (animation: string, speed: number) => {
    const speedClass =
      speed === 0.5
        ? "duration-[4s]"
        : speed === 2
        ? "duration-[0.5s]"
        : "duration-[2s]";
    switch (animation) {
      case "pulse":
        return `animate-pulse ${speedClass}`;
      case "rotate":
        return `animate-spin ${speedClass}`;
      case "bounce":
        return `animate-bounce ${speedClass}`;
      case "fade":
        return `animate-pulse ${speedClass}`;
      case "scale":
        return `animate-ping ${speedClass}`;
      default:
        return "";
    }
  };

  // Landing Page Component
  const LandingPage = () => (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Sparkles className="w-10 h-10 text-blue-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PosterCraft Pro
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
              >
                Features
              </a>
              <a
                href="#templates"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
              >
                Templates
              </a>
            
              <button
                onClick={() => setCurrentView("designer")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                Launch App
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <a
                href="#features"
                className="block text-gray-600 hover:text-gray-900 font-medium cursor-pointer"
              >
                Features
              </a>
              <a
                href="#templates"
                className="block text-gray-600 hover:text-gray-900 font-medium cursor-pointer"
              >
                Templates
              </a>
              <button
                onClick={() => setCurrentView("designer")}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold cursor-pointer"
              >
                Launch App
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-grid-gray-100 opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fadeIn">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Design
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}
                Stunning{" "}
              </span>
              Posters
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Professional-grade poster design platform trusted by Fortune 500
              companies. Create, animate, and export beautiful designs in
              minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <button
                onClick={() => setCurrentView("designer")}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 cursor-pointer"
              >
                <PlayCircle className="w-6 h-6" />
                <span>Start Creating</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center space-x-8 opacity-60">
              <div className="flex items-center space-x-2 mb-4">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">500K+ Users</span>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Enterprise Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-20 animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-20 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 animate-float delay-2000"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Professionals
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create stunning posters, from advanced
              design tools to professional export options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <PenTool className="w-8 h-8 text-blue-600" />,
                title: "Advanced Design Tools",
                description:
                  "Professional vector tools, text formatting, shapes, and drawing capabilities with pixel-perfect precision.",
              },
              {
                icon: <Zap className="w-8 h-8 text-purple-600" />,
                title: "Smooth Animations",
                description:
                  "Add life to your designs with 8+ animation types, custom timing, and hardware-accelerated rendering.",
              },
              {
                icon: <Layers className="w-8 h-8 text-green-600" />,
                title: "Layer Management",
                description:
                  "Organize complex designs with advanced layer controls, grouping, locking, and visibility management.",
              },
              {
                icon: <Palette className="w-8 h-8 text-pink-600" />,
                title: "Color & Typography",
                description:
                  "15+ professional fonts, unlimited colors, gradients, and advanced typography controls.",
              },
              {
                icon: <Download className="w-8 h-8 text-indigo-600" />,
                title: "Export Options",
                description:
                  "Export in PNG, JPG, SVG formats with ultra-high resolution up to 4K quality.",
              },
              {
                icon: <Grid3X3 className="w-8 h-8 text-teal-600" />,
                title: "Precision Controls",
                description:
                  "Grid snapping, alignment tools, rulers, and precise positioning for pixel-perfect designs.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section
        id="templates"
        className="py-24 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Professional
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Templates
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start with our curated collection of professional templates
              designed by experts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <div key={template.id} className="group cursor-pointer">
                <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div
                    className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center"
                    style={{ background: template.background }}
                  >
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {template.name}
                      </h3>
                      <span className="text-sm text-white/80 px-3 py-1 bg-white/20 rounded-full">
                        {template.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {template.name}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      Perfect for {template.category.toLowerCase()} designs
                    </p>
                    <button
                      onClick={() => {
                        loadTemplate(template as Template);
                        setCurrentView("designer");
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 cursor-pointer"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-8 h-8 text-blue-400" />
                <span className="text-xl font-bold">PosterCraft Pro</span>
              </div>
              <p className="text-gray-400">
                Professional poster design platform for modern creators and
                businesses.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-8 h-8 bg-gray-700 hover:bg-blue-600 text-gray-400 hover:text-white rounded-full flex items-center justify-center font-semibold transition-colors cursor-pointer">
                  F
                </a>
                <a href="#" className="w-8 h-8 bg-gray-700 hover:bg-blue-600 text-gray-400 hover:text-white rounded-full flex items-center justify-center font-semibold transition-colors cursor-pointer">
                  T
                </a>
                <a href="#" className="w-8 h-8 bg-gray-700 hover:bg-blue-600 text-gray-400 hover:text-white rounded-full flex items-center justify-center font-semibold transition-colors cursor-pointer">
                  P
                </a>
                <a href="#" className="w-8 h-8 bg-gray-700 hover:bg-blue-600 text-gray-400 hover:text-white rounded-full flex items-center justify-center font-semibold transition-colors cursor-pointer">
                  A
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Templates
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Status
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 PosterCraft Pro. All rights reserved. Built with ❤️ for
              creators worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      e.stopPropagation();
      e.preventDefault();
      const element = elements.find((el) => el.id === elementId);
      if (!element || element.locked) return;

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      setSelectedElement(elementId);
      setDragState({
        isDragging: true,
        elementId,
        startX: e.clientX - rect.left,
        startY: e.clientY - rect.top,
        offsetX: e.clientX - rect.left - element.x,
        offsetY: e.clientY - rect.top - element.y,
      });
    },
    [elements]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragState.isDragging || !dragState.elementId) return;

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      let x = e.clientX - rect.left - dragState.offsetX;
      let y = e.clientY - rect.top - dragState.offsetY;

      if (snapToGrid) {
        x = Math.round(x / 20) * 20;
        y = Math.round(y / 20) * 20;
      }

      x = Math.max(0, Math.min(canvasSize.width - 50, x));
      y = Math.max(0, Math.min(canvasSize.height - 50, y));

      updateElement(dragState.elementId, { x, y });
    },
    [dragState, updateElement, canvasSize, snapToGrid]
  );

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    // Only clear selection if clicking directly on canvas background
    if (e.target === e.currentTarget) {
      setSelectedElement(null);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    if (dragState.isDragging) {
      addToHistory(elements);
    }
    setDragState((prev) => ({ ...prev, isDragging: false, elementId: null }));
  }, [dragState.isDragging, elements, addToHistory]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentView !== "designer") return;

      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        if (selectedElement) duplicateElement(selectedElement);
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedElement) deleteElement(selectedElement);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentView,
    selectedElement,
    undo,
    redo,
    duplicateElement,
    deleteElement,
  ]);

  if (currentView === "landing") {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 z-40">
        <div className="max-w-full mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-6">
            {/* Mobile Tools Toggle */}
            <button
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              title="Toggle Tools"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCurrentView("landing")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 hidden sm:block">
                PosterCraft Pro
              </h1>
            </button>

            <div className="hidden lg:flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setTool("select")}
                className={`p-2 rounded-md transition-all cursor-pointer ${
                  tool === "select"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                title="Select Tool (V)"
              >
                <Move className="w-4 h-4" />
              </button>
              <button
                onClick={() => addElement("text")}
                className={`p-2 rounded-md transition-all cursor-pointer ${
                  tool === "text"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                title="Add Text (T)"
              >
                <Type className="w-4 h-4" />
              </button>
            </div>

            <div className="hidden lg:flex items-center space-x-2">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-2 rounded-md transition-all cursor-pointer ${
                  showGrid
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                title="Toggle Grid"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as any)}
                className="text-xs sm:text-sm border border-gray-300 rounded-md px-1 sm:px-2 py-1 cursor-pointer"
              >
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
              </select>
              <button
                onClick={handleExport}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span className="font-medium hidden sm:inline">Export</span>
              </button>
            </div>

            {/* Mobile Properties Toggle */}
            <button
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              title="Toggle Properties"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden h-full relative">
        {/* Mobile Overlay */}
        {(leftSidebarOpen || rightSidebarOpen) && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => {
              setLeftSidebarOpen(false);
              setRightSidebarOpen(false);
            }}
          />
        )}

        {/* Left Sidebar */}
        <div className={`${
          leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:relative top-16 lg:top-0 left-0 z-30 w-80 h-full lg:h-auto bg-white shadow-lg lg:shadow-sm border-r border-gray-200 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out`}>
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Design Tools
                </h2>
                <button
                  onClick={() => setLeftSidebarOpen(false)}
                  className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3 mb-8">
                <button
                  onClick={() => addElement("text")}
                  className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group cursor-pointer"
                >
                  <Type className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Add Text</span>
                </button>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { shape: "rectangle", icon: Square, name: "Rectangle" },
                    { shape: "circle", icon: Circle, name: "Circle" },
                    { shape: "triangle", icon: Triangle, name: "Triangle" },
                    { shape: "hexagon", icon: Hexagon, name: "Hexagon" },
                    { shape: "star", icon: Star, name: "Star" },
                    { shape: "diamond", icon: Sparkles, name: "Diamond" },
                  ].map(({ shape, icon: Icon, name }) => (
                    <button
                      key={shape}
                      onClick={() => addElement("shape", shape)}
                      className="flex flex-col items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group cursor-pointer"
                      title={name}
                    >
                      <Icon className="w-4 h-4 text-gray-600 mb-1 group-hover:text-gray-900" />
                      <span className="text-xs text-gray-600 group-hover:text-gray-900">
                        {name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Templates */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Templates
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => loadTemplate(template as Template)}
                      className="group p-3 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <div
                        className="h-16 rounded-md mb-2 flex items-center justify-center"
                        style={{ background: template.background }}
                      >
                        <span className="text-xs font-medium text-white/80">
                          {template.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 text-center">
                        {template.category}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Controls */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Canvas Background
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
                  {colors.slice(0, 12).map((color) => (
                    <button
                      key={color}
                      onClick={() => setCanvasBackground(color)}
                                              className={`w-10 h-10 sm:w-8 sm:h-8 rounded-lg border-2 transition-all hover:scale-110 cursor-pointer ${
                        canvasBackground === color
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {backgroundGradients.slice(0, 6).map((gradient, index) => (
                    <button
                      key={index}
                      onClick={() => setCanvasBackground(gradient)}
                      className={`h-8 rounded-lg border-2 transition-all hover:scale-105 cursor-pointer ${
                        canvasBackground === gradient
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      style={{ background: gradient }}
                      title={`Gradient ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* View Controls */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  View Options
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={showGrid}
                      onChange={(e) => setShowGrid(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show Grid</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={snapToGrid}
                      onChange={(e) => setSnapToGrid(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Snap to Grid</span>
                  </label>
                </div>
              </div>

              {/* Layers */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Layers ({elements.length})
                </h3>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {[...elements]
                    .sort((a, b) => b.zIndex - a.zIndex)
                    .map((element) => (
                      <div
                        key={element.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElement(element.id);
                        }}
                        className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedElement === element.id
                            ? "bg-blue-50 border border-blue-200"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateElement(element.id, {
                              visible: !element.visible,
                            });
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors cursor-pointer"
                        >
                          {element.visible ? (
                            <Eye className="w-4 h-4 text-gray-600" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateElement(element.id, {
                              locked: !element.locked,
                            });
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors cursor-pointer"
                        >
                          {element.locked ? (
                            <Lock className="w-4 h-4 text-red-500" />
                          ) : (
                            <Unlock className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {element.type === "text"
                              ? element.content || "Text"
                              : `${element.shapeType || "Shape"}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {element.type} • Layer {element.zIndex + 1}
                          </p>
                        </div>
                        {selectedElement === element.id && (
                          <ChevronRight className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col bg-gray-100 min-h-0 lg:mx-0">
          <div className="flex-1 flex items-center justify-center p-2 sm:p-4 lg:p-8 overflow-auto min-h-0">
            <div className="relative">
                              <div
                  ref={canvasRef}
                  className="relative bg-white shadow-2xl rounded-xl overflow-hidden cursor-crosshair border border-gray-200"
                  style={{
                    width: Math.min(canvasSize.width, windowSize.width - 32),
                    height: Math.min(canvasSize.height, windowSize.height - 200),
                    maxWidth: '100vw',
                    maxHeight: '100vh',
                    background: canvasBackground.startsWith("linear-gradient")
                      ? canvasBackground
                      : canvasBackground,
                  }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={handleCanvasClick}
              >
                {/* Grid */}
                {showGrid && (
                  <div className="absolute inset-0 pointer-events-none opacity-30">
                    <svg width="100%" height="100%">
                      <defs>
                        <pattern
                          id="grid"
                          width="20"
                          height="20"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 20 0 L 0 0 0 20"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="1"
                          />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>
                )}

                {/* Elements */}
                {elements.map((element) => (
                  <div
                    key={element.id}
                    className={`absolute select-none transition-all duration-200 ${
                      !element.locked ? "cursor-move" : "cursor-default"
                    } ${
                      selectedElement === element.id
                        ? "ring-2 ring-blue-500 ring-opacity-75"
                        : ""
                    } ${
                      isAnimating &&
                      element.animation &&
                      element.animation !== "none"
                        ? getAnimationClass(
                            element.animation,
                            element.animationSpeed
                          )
                        : ""
                    }`}
                    style={{
                      left: element.x,
                      top: element.y,
                      width: element.width,
                      height: element.height,
                      transform: `rotate(${element.rotation}deg)`,
                      opacity: element.opacity,
                      zIndex: element.zIndex,
                      display: element.visible ? "block" : "none",
                      filter:
                        element.shadow && element.shadow.blur > 0
                          ? `drop-shadow(${element.shadow.x}px ${element.shadow.y}px ${element.shadow.blur}px ${element.shadow.color})`
                          : "none",
                    }}
                    onMouseDown={(e) => handleMouseDown(e, element.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedElement(element.id);
                    }}
                  >
                    {element.type === "text" ? (
                      <div
                        className="w-full h-full flex items-center justify-center p-2 leading-tight"
                        style={{
                          color: element.color,
                          fontSize: element.fontSize,
                          fontFamily: element.fontFamily,
                          fontWeight: element.fontWeight,
                          fontStyle: element.fontStyle,
                          textDecoration: element.textDecoration,
                          textAlign: element.textAlign,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {element.content}
                      </div>
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundColor:
                            element.backgroundColor || element.color,
                          border:
                            element.borderWidth && element.borderWidth > 0
                              ? `${element.borderWidth}px solid ${element.borderColor}`
                              : "none",
                          borderRadius:
                            element.shapeType === "circle"
                              ? "50%"
                              : element.borderRadius
                              ? `${element.borderRadius}px`
                              : "0",
                          clipPath:
                            element.shapeType === "triangle"
                              ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                              : element.shapeType === "hexagon"
                              ? "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)"
                              : element.shapeType === "star"
                              ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
                              : element.shapeType === "diamond"
                              ? "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
                              : "none",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className={`${
          rightSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 fixed lg:relative top-16 lg:top-0 right-0 z-30 w-80 h-full lg:h-auto bg-white shadow-lg lg:shadow-sm border-l border-gray-200 flex flex-col min-h-0 transition-transform duration-300 ease-in-out`}>
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-4 sm:p-6">
                              <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Properties
                  </h2>
                  <div className="flex items-center space-x-2">
                    {selectedElementData && (
                      <>
                        <button
                          onClick={() => duplicateElement(selectedElementData.id)}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                          title="Duplicate (Ctrl+D)"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteElement(selectedElementData.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          title="Delete (Del)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setRightSidebarOpen(false)}
                      className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

              {selectedElementData ? (
                <div className="space-y-6">
                  {/* Element Type Badge */}
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {selectedElementData.type === "text" ? (
                      <Type className="w-3 h-3 mr-1" />
                    ) : (
                      <Square className="w-3 h-3 mr-1" />
                    )}
                    {selectedElementData.type.charAt(0).toUpperCase() +
                      selectedElementData.type.slice(1)}
                  </div>

                  {/* Text Properties */}
                  {selectedElementData.type === "text" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content
                        </label>
                        <textarea
                          value={selectedElementData.content || ""}
                          onChange={(e) =>
                            updateElement(selectedElementData.id, {
                              content: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                          rows={3}
                          placeholder="Enter your text..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Font Family
                        </label>
                        <select
                          value={selectedElementData.fontFamily}
                          onChange={(e) =>
                            updateElement(selectedElementData.id, {
                              fontFamily: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                        >
                          {fonts.map((font) => (
                            <option
                              key={font}
                              value={font}
                              style={{ fontFamily: font }}
                            >
                              {font}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Font Size: {selectedElementData.fontSize}px
                        </label>
                        <input
                          type="range"
                          min="8"
                          max="120"
                          value={selectedElementData.fontSize}
                          onChange={(e) =>
                            updateElement(selectedElementData.id, {
                              fontSize: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Text Formatting */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Formatting
                        </label>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateElement(selectedElementData.id, {
                                fontWeight:
                                  selectedElementData.fontWeight === "bold"
                                    ? "normal"
                                    : "bold",
                              })
                            }
                            className={`p-2 rounded-md border transition-colors cursor-pointer ${
                              selectedElementData.fontWeight === "bold"
                                ? "bg-blue-100 border-blue-300 text-blue-700"
                                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <Bold className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              updateElement(selectedElementData.id, {
                                fontStyle:
                                  selectedElementData.fontStyle === "italic"
                                    ? "normal"
                                    : "italic",
                              })
                            }
                            className={`p-2 rounded-md border transition-colors cursor-pointer ${
                              selectedElementData.fontStyle === "italic"
                                ? "bg-blue-100 border-blue-300 text-blue-700"
                                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <Italic className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              updateElement(selectedElementData.id, {
                                textDecoration:
                                  selectedElementData.textDecoration ===
                                  "underline"
                                    ? "none"
                                    : "underline",
                              })
                            }
                            className={`p-2 rounded-md border transition-colors cursor-pointer ${
                              selectedElementData.textDecoration === "underline"
                                ? "bg-blue-100 border-blue-300 text-blue-700"
                                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <Underline className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Text Alignment */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Alignment
                        </label>
                        <div className="flex items-center space-x-2">
                          {[
                            { align: "left", icon: AlignLeft },
                            { align: "center", icon: AlignCenter },
                            { align: "right", icon: AlignRight },
                          ].map(({ align, icon: Icon }) => (
                            <button
                              key={align}
                              onClick={() =>
                                updateElement(selectedElementData.id, {
                                  textAlign: align as any,
                                })
                              }
                              className={`p-2 rounded-md border transition-colors cursor-pointer ${
                                selectedElementData.textAlign === align
                                  ? "bg-blue-100 border-blue-300 text-blue-700"
                                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Shape Properties */}
                  {selectedElementData.type === "shape" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Shape Type
                        </label>
                        <select
                          value={selectedElementData.shapeType}
                          onChange={(e) =>
                            updateElement(selectedElementData.id, {
                              shapeType: e.target.value as any,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                        >
                          <option value="rectangle">Rectangle</option>
                          <option value="circle">Circle</option>
                          <option value="triangle">Triangle</option>
                          <option value="hexagon">Hexagon</option>
                          <option value="star">Star</option>
                          <option value="diamond">Diamond</option>
                        </select>
                      </div>

                      {selectedElementData.shapeType === "rectangle" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Border Radius:{" "}
                            {selectedElementData.borderRadius || 0}px
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={selectedElementData.borderRadius || 0}
                            onChange={(e) =>
                              updateElement(selectedElementData.id, {
                                borderRadius: parseInt(e.target.value),
                              })
                            }
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Border Width: {selectedElementData.borderWidth || 0}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={selectedElementData.borderWidth || 0}
                          onChange={(e) =>
                            updateElement(selectedElementData.id, {
                              borderWidth: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {selectedElementData.borderWidth &&
                        selectedElementData.borderWidth > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Border Color
                            </label>
                            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                              {colors.map((color) => (
                                                              <button
                                key={color}
                                onClick={() =>
                                  updateElement(selectedElementData.id, {
                                    borderColor: color,
                                  })
                                }
                                className={`w-8 h-8 sm:w-6 sm:h-6 rounded-md border-2 transition-all hover:scale-110 cursor-pointer ${
                                  selectedElementData.borderColor === color
                                    ? "border-blue-500 ring-2 ring-blue-200"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                style={{ backgroundColor: color }}
                              />
                              ))}
                            </div>
                          </div>
                        )}
                    </>
                  )}

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {selectedElementData.type === "text"
                        ? "Text Color"
                        : "Fill Color"}
                    </label>
                    <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() =>
                            selectedElementData.type === "text"
                              ? updateElement(selectedElementData.id, { color })
                              : updateElement(selectedElementData.id, {
                                  backgroundColor: color,
                                })
                          }
                          className={`w-8 h-8 sm:w-6 sm:h-6 rounded-md border-2 transition-all hover:scale-110 cursor-pointer ${
                            (selectedElementData.type === "text"
                              ? selectedElementData.color
                              : selectedElementData.backgroundColor) === color
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Transform */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Width
                      </label>
                      <input
                        type="number"
                        value={selectedElementData.width}
                        onChange={(e) =>
                          updateElement(selectedElementData.id, {
                            width: Math.max(10, parseInt(e.target.value) || 10),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        min="10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Height
                      </label>
                      <input
                        type="number"
                        value={selectedElementData.height}
                        onChange={(e) =>
                          updateElement(selectedElementData.id, {
                            height: Math.max(
                              10,
                              parseInt(e.target.value) || 10
                            ),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        min="10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        X Position
                      </label>
                      <input
                        type="number"
                        value={Math.round(selectedElementData.x)}
                        onChange={(e) =>
                          updateElement(selectedElementData.id, {
                            x: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Y Position
                      </label>
                      <input
                        type="number"
                        value={Math.round(selectedElementData.y)}
                        onChange={(e) =>
                          updateElement(selectedElementData.id, {
                            y: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rotation: {selectedElementData.rotation}°
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={selectedElementData.rotation}
                      onChange={(e) =>
                        updateElement(selectedElementData.id, {
                          rotation: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opacity: {Math.round(selectedElementData.opacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={selectedElementData.opacity}
                      onChange={(e) =>
                        updateElement(selectedElementData.id, {
                          opacity: parseFloat(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Shadow */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Drop Shadow
                    </label>
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            X Offset
                          </label>
                          <input
                            type="number"
                            value={selectedElementData.shadow?.x || 0}
                            onChange={(e) =>
                              updateElement(selectedElementData.id, {
                                shadow: {
                                  ...selectedElementData.shadow,
                                  x: parseInt(e.target.value) || 0,
                                } as any,
                              })
                            }
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Y Offset
                          </label>
                          <input
                            type="number"
                            value={selectedElementData.shadow?.y || 0}
                            onChange={(e) =>
                              updateElement(selectedElementData.id, {
                                shadow: {
                                  ...selectedElementData.shadow,
                                  y: parseInt(e.target.value) || 0,
                                } as any,
                              })
                            }
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Blur
                          </label>
                          <input
                            type="number"
                            value={selectedElementData.shadow?.blur || 0}
                            onChange={(e) =>
                              updateElement(selectedElementData.id, {
                                shadow: {
                                  ...selectedElementData.shadow,
                                  blur: Math.max(
                                    0,
                                    parseInt(e.target.value) || 0
                                  ),
                                } as any,
                              })
                            }
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Element Controls */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedElementData.locked}
                          onChange={(e) =>
                            updateElement(selectedElementData.id, {
                              locked: e.target.checked,
                            })
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          Lock Element
                        </span>
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateElement(selectedElementData.id, {
                              zIndex: selectedElementData.zIndex + 1,
                            })
                          }
                          className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                          title="Bring Forward"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() =>
                            updateElement(selectedElementData.id, {
                              zIndex: Math.max(
                                0,
                                selectedElementData.zIndex - 1
                              ),
                            })
                          }
                          className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                          title="Send Backward"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Settings className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Element Selected
                  </h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    Select an element on the canvas to view and edit its
                    properties
                  </p>
                  <div className="mt-6 space-y-2 text-xs text-gray-400">
                    <p>💡 Tips:</p>
                    <p>• Click any element to select it</p>
                    <p>• Use tools to add new elements</p>
                    <p>• Drag elements to move them</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Quick Tools */}
        <div className="lg:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
          <div className="flex items-center space-x-2 bg-white rounded-full shadow-lg border border-gray-200 px-4 py-2">
            <button
              onClick={() => addElement("text")}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              title="Add Text"
            >
              <Type className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-gray-200"></div>
            <button
              onClick={() => addElement("shape", "rectangle")}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              title="Add Rectangle"
            >
              <Square className="w-5 h-5" />
            </button>
            <button
              onClick={() => addElement("shape", "circle")}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              title="Add Circle"
            >
              <Circle className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-gray-200"></div>
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Undo"
            >
              <Undo2 className="w-5 h-5" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Redo"
            >
              <Redo2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");
        body {
          font-family: "Roboto", sans-serif !important;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-2000 {
          animation-delay: 2s;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
        .bg-grid-gray-100 {
          background-image: radial-gradient(
            circle,
            #f3f4f6 1px,
            transparent 1px
          );
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default PosterDesigner;


// Zod Schema
export const Schema = {
    "commentary": "A poster designer website that lets users create poster-style graphics using text, backgrounds, and animated shapes. Users can drag and place elements, pick fonts and colors, and preview a subtle animation. The final design can be exported as a static image.",
    "template": "nextjs-developer",
    "title": "Poster Designer",
    "description": "A website that lets users create poster-style graphics using text, backgrounds, and animated shapes.",
    "additional_dependencies": [
        "lucide-react"
    ],
    "has_additional_dependencies": true,
    "install_dependencies_command": "npm install lucide-react",
    "port": 3000,
    "file_path": "pages/index.tsx",
    "code": "<see code above>"
}
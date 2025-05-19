"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Move,
  Type,
  Image,
  Square,
  Circle,
  ChevronRight,
  ChevronLeft,
  Undo,
  Redo,
  Download,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  Minus,
  Trash2,
  Maximize2,
  Layers,
  X,
  Menu,
  Settings,
  Home,
  RotateCcwSquare,
  Play,
  ArrowRight,
  Star,
  Layout,
  Mail,
  Phone,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";

// Types
type ElementType = "text" | "image" | "rectangle" | "circle";
type ScreenSize = "mobile" | "tablet" | "desktop";
type AppView = "landing" | "editor";

interface DesignElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  imageUrl?: string;
  zIndex: number;
}

interface HistoryState {
  elements: DesignElement[];
  selectedElementId: string | null;
}

// Default elements for new items
const defaultTextElement: Omit<DesignElement, "id" | "x" | "y" | "zIndex"> = {
  type: "text",
  width: 200,
  height: 60,
  rotation: 0,
  content: "Add your text here",
  fontSize: 20,
  fontFamily: "Inter",
  fontWeight: "normal",
  fontStyle: "normal",
  textAlign: "left",
  color: "#000000",
  backgroundColor: "transparent",
};

const defaultRectangleElement: Omit<
  DesignElement,
  "id" | "x" | "y" | "zIndex"
> = {
  type: "rectangle",
  width: 150,
  height: 100,
  rotation: 0,
  backgroundColor: "#e2e8f0",
  borderColor: "#94a3b8",
  borderWidth: 1,
};

const defaultCircleElement: Omit<DesignElement, "id" | "x" | "y" | "zIndex"> = {
  type: "circle",
  width: 100,
  height: 100,
  rotation: 0,
  backgroundColor: "#93c5fd",
  borderColor: "#3b82f6",
  borderWidth: 1,
};

const defaultImageElement: Omit<DesignElement, "id" | "x" | "y" | "zIndex"> = {
  type: "image",
  width: 200,
  height: 150,
  rotation: 0,
  imageUrl: "/api/placeholder/200/150",
};

// Font options
const fontFamilies = [
  "Inter",
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Verdana",
  "Roboto",
  "Montserrat",
  "Playfair Display",
];

// Color options
const colorOptions = [
  "#000000",
  "#ffffff",
  "#f87171",
  "#fb923c",
  "#facc15",
  "#4ade80",
  "#38bdf8",
  "#818cf8",
  "#c084fc",
  "#f472b6",
];

// Features for the landing page
const features = [
  {
    title: "Drag & Drop Design",
    description:
      "Easily position and arrange elements on your poster with our intuitive drag and drop interface.",
    icon: <Move className="w-8 h-8 text-blue-500" />,
  },
  {
    title: "Text Formatting",
    description:
      "Customize your text with various fonts, sizes, colors, and styles to create eye-catching designs.",
    icon: <Type className="w-8 h-8 text-blue-500" />,
  },
  {
    title: "Shape Library",
    description:
      "Add rectangles, circles, and other shapes to enhance your poster's visual impact.",
    icon: <Square className="w-8 h-8 text-blue-500" />,
  },
  {
    title: "Image Upload",
    description:
      "Incorporate your own images into your designs for a personalized touch.",
    icon: <Image className="w-8 h-8 text-blue-500" />,
  },
  {
    title: "Export Options",
    description:
      "Download your finished poster as a high-quality image file ready for printing or sharing.",
    icon: <Download className="w-8 h-8 text-blue-500" />,
  },
  {
    title: "Revision History",
    description:
      "Easily undo and redo changes with our comprehensive history tracking system.",
    icon: <Undo className="w-8 h-8 text-blue-500" />,
  },
];

// Testimonials for the landing page
const testimonials = [
  {
    quote:
      "This tool completely transformed how we create event posters. So intuitive and professional!",
    author: "Sarah J.",
    role: "Marketing Director",
  },
  {
    quote:
      "I've tried many design tools, but this one strikes the perfect balance between power and simplicity.",
    author: "Michael T.",
    role: "Graphic Designer",
  },
  {
    quote:
      "As a non-designer, I was able to create stunning posters for our school events in minutes.",
    author: "David L.",
    role: "Teacher",
  },
];

// Main component
export default function PosterDesignApp() {
  // App view state (landing page or editor)
  const [appView, setAppView] = useState<AppView>("landing");

  // Only render the relevant view based on appView state
  return (
    <div
      style={{ fontFamily: "var(--font-roboto), sans-serif" }}
      className="font-sans text-gray-900"
    >
      {appView === "landing" ? (
        <LandingPage onStartDesigning={() => setAppView("editor")} />
      ) : (
        <PosterDesignTool onBackToHome={() => setAppView("landing")} />
      )}
    </div>
  );
}

// Landing Page Component
interface LandingPageProps {
  onStartDesigning: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartDesigning }) => {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-blue-600 font-bold text-xl">
                PosterCraft
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Testimonials
              </a>
              <button
                onClick={onStartDesigning}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Start Designing
              </button>
            </div>
            <div className="flex md:hidden items-center">
              <button
                onClick={onStartDesigning}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Start Designing
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                Create Stunning Posters{" "}
                <span className="text-blue-600">In Minutes</span>
              </h1>
              <p className="text-xl text-gray-600">
                Our powerful yet simple design tool helps you create
                professional-looking posters for any occasion, no design
                experience required.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  onClick={onStartDesigning}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Start Designing Now</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a
                  href="#how-it-works"
                  className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-colors flex items-center justify-center space-x-2"
                >
                  <Play className="w-5 h-5 text-blue-600" />
                  <span>See How It Works</span>
                </a>
              </div>
            </div>
            <div className="rounded-xl shadow-2xl overflow-hidden bg-white border border-gray-200">
              <div className="aspect-w-16 aspect-h-12">
                <div className="w-full h-full bg-gradient-to-r from-blue-100 to-indigo-100 relative">
                  {/* Design Tool Preview */}
                  <img
                    src={
                      "https://i.postimg.cc/XNt2P1Ng/Screenshot-2025-05-15-225551.png"
                    }
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
              <div className="bg-gray-50 p-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-xs text-gray-500">Design Preview</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Powerful Design Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create eye-catching posters that get
              noticed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="p-3 bg-blue-50 rounded-lg inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create professional posters in just three simple steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div className="p-4 flex justify-center">
                <Layout className="w-16 h-16 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Choose Your Elements
              </h3>
              <p className="text-gray-600">
                Select from text, images, shapes, and more to build your poster.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div className="p-4 flex justify-center">
                <Move className="w-16 h-16 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Arrange & Customize
              </h3>
              <p className="text-gray-600">
                Drag, resize, and style your elements until your design is
                perfect.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div className="p-4 flex justify-center">
                <Download className="w-16 h-16 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Export & Share
              </h3>
              <p className="text-gray-600">
                Download your finished poster and share it with the world.
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <button
              onClick={onStartDesigning}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors inline-flex items-center space-x-2"
            >
              <span>Try It Yourself</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied users creating amazing posters with
              our tool.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl border border-gray-200"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-medium text-gray-900">
                    {testimonial.author}
                  </p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-6">
            Ready to Create Your Own Amazing Poster?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Start designing now – no account required, completely free to use.
          </p>
          <button
            onClick={onStartDesigning}
            className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-8 rounded-lg transition-colors inline-flex items-center space-x-2 shadow-lg"
          >
            <span>Start Designing Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">PosterCraft</h3>
              <p className="text-gray-400">
                Professional poster design made simple.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Drag & Drop Editor
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Text Formatting
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Image Upload
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Export Options
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Templates
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>support@postercraft.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </li>
              </ul>
              <div className="flex space-x-4 mt-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center sm:text-left">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} PosterCraft. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Main component
const PosterDesignTool: React.FC<{ onBackToHome: () => void }> = ({
  onBackToHome,
}) => {
  // Refs
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // State for elements, selected element, and history
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [history, setHistory] = useState<HistoryState[]>([
    { elements: [], selectedElementId: null },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [isRotating, setIsRotating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [screenSize, setScreenSize] = useState<ScreenSize>("desktop");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Track highest z-index
  const [highestZIndex, setHighestZIndex] = useState(1);

  // Get selected element
  const selectedElement = elements.find((el) => el.id === selectedElementId);

  // Determine screen size based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScreenSize("mobile");
        setIsSidebarOpen(false);
        setIsPanelOpen(false);
      } else if (window.innerWidth < 1024) {
        setScreenSize("tablet");
        setIsSidebarOpen(true);
        setIsPanelOpen(false);
      } else {
        setScreenSize("desktop");
        setIsSidebarOpen(true);
        setIsPanelOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Save to history
  const saveToHistory = (
    newElements: DesignElement[],
    newSelectedElementId: string | null
  ) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      elements: newElements,
      selectedElementId: newSelectedElementId,
    });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Handle undo/redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const { elements: newElements, selectedElementId: newSelectedElementId } =
        history[newIndex];
      setElements(newElements);
      setSelectedElementId(newSelectedElementId);
      setHistoryIndex(newIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const { elements: newElements, selectedElementId: newSelectedElementId } =
        history[newIndex];
      setElements(newElements);
      setSelectedElementId(newSelectedElementId);
      setHistoryIndex(newIndex);
    }
  };

  // Generate unique ID
  const generateId = () =>
    `element-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Add element handlers
  const addTextElement = () => {
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const newElement: DesignElement = {
      ...defaultTextElement,
      id: generateId(),
      x: (canvasSize.width - defaultTextElement.width) / 2,
      y: (canvasSize.height - defaultTextElement.height) / 2,
      zIndex: highestZIndex + 1,
    };

    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElementId(newElement.id);
    setHighestZIndex(highestZIndex + 1);
    saveToHistory(newElements, newElement.id);

    // Close drawer on mobile after adding element
    if (screenSize === "mobile") {
      setIsDrawerOpen(false);
    }
  };

  const addRectangleElement = () => {
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const newElement: DesignElement = {
      ...defaultRectangleElement,
      id: generateId(),
      x: (canvasSize.width - defaultRectangleElement.width) / 2,
      y: (canvasSize.height - defaultRectangleElement.height) / 2,
      zIndex: highestZIndex + 1,
    };

    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElementId(newElement.id);
    setHighestZIndex(highestZIndex + 1);
    saveToHistory(newElements, newElement.id);

    // Close drawer on mobile after adding element
    if (screenSize === "mobile") {
      setIsDrawerOpen(false);
    }
  };

  const addCircleElement = () => {
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const newElement: DesignElement = {
      ...defaultCircleElement,
      id: generateId(),
      x: (canvasSize.width - defaultCircleElement.width) / 2,
      y: (canvasSize.height - defaultCircleElement.height) / 2,
      zIndex: highestZIndex + 1,
    };

    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElementId(newElement.id);
    setHighestZIndex(highestZIndex + 1);
    saveToHistory(newElements, newElement.id);

    // Close drawer on mobile after adding element
    if (screenSize === "mobile") {
      setIsDrawerOpen(false);
    }
  };

  const addImageElement = () => {
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    // Clear any current selection to ensure we're adding a new image
    setSelectedElementId(null);

    // Trigger file input dialog
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      // If file input isn't available, use placeholder
      const newElement: DesignElement = {
        ...defaultImageElement,
        id: generateId(),
        x: (canvasSize.width - defaultImageElement.width) / 2,
        y: (canvasSize.height - defaultImageElement.height) / 2,
        zIndex: highestZIndex + 1,
      };

      const newElements = [...elements, newElement];
      setElements(newElements);
      setSelectedElementId(newElement.id);
      setHighestZIndex(highestZIndex + 1);
      saveToHistory(newElements, newElement.id);

      // Close drawer on mobile after adding element
      if (screenSize === "mobile") {
        setIsDrawerOpen(false);
      }
    }
  };

  // Single handler for file selection (both new and updates)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use a try-catch block to handle any errors during file reading
    try {
      const reader = new FileReader();

      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;

        if (selectedElement && selectedElement.type === "image") {
          // Update existing image
          console.log("Updating existing image");
          const newElements = elements.map((el) => {
            if (el.id === selectedElement.id) {
              return { ...el, imageUrl };
            }
            return el;
          });

          setElements(newElements);
          saveToHistory(newElements, selectedElement.id);
        } else {
          // Add new image
          console.log("Adding new image");
          const newElement: DesignElement = {
            ...defaultImageElement,
            id: generateId(),
            x: (canvasSize.width - defaultImageElement.width) / 2,
            y: (canvasSize.height - defaultImageElement.height) / 2,
            zIndex: highestZIndex + 1,
            imageUrl,
          };

          const newElements = [...elements, newElement];
          setElements(newElements);
          setSelectedElementId(newElement.id);
          setHighestZIndex(highestZIndex + 1);
          saveToHistory(newElements, newElement.id);
        }

        // Close drawer on mobile after adding/updating element
        if (screenSize === "mobile") {
          setIsDrawerOpen(false);
        }
      };

      reader.onerror = () => {
        console.error("Error reading file");
        alert(
          "There was an error reading the selected image file. Please try again."
        );
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing file:", error);
      alert(
        "There was an error processing the selected image. Please try a different file."
      );
    }

    // Reset file input
    e.target.value = "";
  };

  // Trigger file selector for image
  const updateImageElement = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Mouse event handlers
  const handleMouseDown = (
    e: React.MouseEvent,
    elementId: string,
    action: "drag" | "resize" | "rotate",
    handle?: string
  ) => {
    if (action === "drag") {
      setIsDragging(true);
      setSelectedElementId(elementId);
    } else if (action === "resize" && handle) {
      setIsResizing(true);
      setResizeHandle(handle);
      setSelectedElementId(elementId);
    } else if (action === "rotate") {
      setIsRotating(true);
      setSelectedElementId(elementId);
    }

    setStartPoint({ x: e.clientX, y: e.clientY });
    e.stopPropagation();
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if clicking directly on the canvas, not on an element
    if (e.target === canvasRef.current) {
      setSelectedElementId(null);
    }
  };

  // Update element properties
  const updateElementProperty = <K extends keyof DesignElement>(
    elementId: string,
    property: K,
    value: DesignElement[K]
  ) => {
    const newElements = elements.map((el) => {
      if (el.id === elementId) {
        return { ...el, [property]: value };
      }
      return el;
    });

    setElements(newElements);
    saveToHistory(newElements, selectedElementId);
  };

  // Delete selected element
  const deleteSelectedElement = () => {
    if (!selectedElementId) return;

    const newElements = elements.filter((el) => el.id !== selectedElementId);
    setElements(newElements);
    setSelectedElementId(null);
    saveToHistory(newElements, null);

    // Close panel on mobile after deleting
    if (screenSize === "mobile") {
      setIsDrawerOpen(false);
    }
  };

  // Mouse move handler for dragging, resizing, and rotating
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!selectedElementId) return;

      const selectedElementIndex = elements.findIndex(
        (el) => el.id === selectedElementId
      );
      if (selectedElementIndex === -1) return;

      const element = { ...elements[selectedElementIndex] };

      if (isDragging) {
        // Calculate new position
        const dx = e.clientX - startPoint.x;
        const dy = e.clientY - startPoint.y;

        const newElements = [...elements];
        newElements[selectedElementIndex] = {
          ...element,
          x: element.x + dx,
          y: element.y + dy,
        };

        setElements(newElements);
        setStartPoint({ x: e.clientX, y: e.clientY });
      } else if (isResizing && resizeHandle) {
        const dx = e.clientX - startPoint.x;
        const dy = e.clientY - startPoint.y;

        const newElements = [...elements];
        const newElement = { ...element };

        // Handle different resize handles
        if (resizeHandle.includes("n")) {
          newElement.y += dy;
          newElement.height -= dy;
        }
        if (resizeHandle.includes("s")) {
          newElement.height += dy;
        }
        if (resizeHandle.includes("w")) {
          newElement.x += dx;
          newElement.width -= dx;
        }
        if (resizeHandle.includes("e")) {
          newElement.width += dx;
        }

        // Ensure minimum size
        if (newElement.width < 20) newElement.width = 20;
        if (newElement.height < 20) newElement.height = 20;

        newElements[selectedElementIndex] = newElement;
        setElements(newElements);
        setStartPoint({ x: e.clientX, y: e.clientY });
      } else if (isRotating) {
        // Calculate the center of the element
        const elementCenterX = element.x + element.width / 2;
        const elementCenterY = element.y + element.height / 2;

        // Calculate angle from center to cursor
        const angle =
          Math.atan2(e.clientY - elementCenterY, e.clientX - elementCenterX) *
          (180 / Math.PI);

        const newElements = [...elements];
        newElements[selectedElementIndex] = {
          ...element,
          rotation: angle + 90, // Add 90 degrees to make top = 0 degrees
        };

        setElements(newElements);
      }
    };

    const handleMouseUp = () => {
      if (isDragging || isResizing || isRotating) {
        // Save state to history when operation completes
        saveToHistory(elements, selectedElementId);
      }

      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);
      setIsRotating(false);
    };

    // Add touch handlers for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;

      const touch = e.touches[0];
      const mouseEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
      } as MouseEvent;

      handleMouseMove(mouseEvent);
    };

    const handleTouchEnd = () => {
      handleMouseUp();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    isDragging,
    isResizing,
    isRotating,
    elements,
    selectedElementId,
    startPoint,
    resizeHandle,
  ]);

  // Bring selected element to front
  const bringToFront = () => {
    if (!selectedElementId) return;

    const newZIndex = highestZIndex + 1;

    const newElements = elements.map((el) => {
      if (el.id === selectedElementId) {
        return { ...el, zIndex: newZIndex };
      }
      return el;
    });

    setElements(newElements);
    setHighestZIndex(newZIndex);
    saveToHistory(newElements, selectedElementId);
  };

  // Send selected element to back (lowest zIndex)
  const sendToBack = () => {
    if (!selectedElementId) return;

    const newZIndex = 1;

    const newElements = elements.map((el) => {
      if (el.id === selectedElementId) {
        return { ...el, zIndex: newZIndex };
      }
      return el;
    });

    // Normalize all zIndexes to ensure correct stacking
    const sorted = newElements.sort((a, b) => a.zIndex - b.zIndex);
    const normalized = sorted.map((el, index) => ({
      ...el,
      zIndex: index + 1,
    }));

    setElements(normalized);
    setHighestZIndex(normalized.length);
    saveToHistory(normalized, selectedElementId);
  };

  // Export as image - FIXED IMPLEMENTATION
  // Fixed export function
  const exportAsImage = () => {
    if (!canvasRef.current) return;

    // Temporarily hide selection UI for screenshot
    const prevSelectedId = selectedElementId;
    setSelectedElementId(null);

    // Use setTimeout to ensure UI is updated before capture
    setTimeout(() => {
      try {
        // Get the canvas DOM element
        const canvasElement = canvasRef.current;

        // In a real implementation using html2canvas:
        // html2canvas(canvasElement).then(canvas => {
        //    const dataUrl = canvas.toDataURL('image/png');
        //    // download code...
        // });

        // Simulating html2canvas for this demo by creating a canvas with visible content
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          throw new Error("Could not create canvas context");
        }

        // Set canvas dimensions
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;

        // Fill background with the canvas background color
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw a representation of the elements (simplified for demo)
        elements.forEach((element) => {
          ctx.save();

          // Apply element position and rotation
          ctx.translate(
            element.x + element.width / 2,
            element.y + element.height / 2
          );
          ctx.rotate((element.rotation * Math.PI) / 180);
          ctx.translate(
            -(element.x + element.width / 2),
            -(element.y + element.height / 2)
          );

          // Draw based on element type
          if (element.type === "rectangle") {
            ctx.fillStyle = element.backgroundColor || "#ffffff";
            ctx.fillRect(element.x, element.y, element.width, element.height);
            if (element.borderWidth) {
              ctx.strokeStyle = element.borderColor || "#000000";
              ctx.lineWidth = element.borderWidth;
              ctx.strokeRect(
                element.x,
                element.y,
                element.width,
                element.height
              );
            }
          } else if (element.type === "circle") {
            ctx.beginPath();
            ctx.ellipse(
              element.x + element.width / 2,
              element.y + element.height / 2,
              element.width / 2,
              element.height / 2,
              0,
              0,
              2 * Math.PI
            );
            ctx.fillStyle = element.backgroundColor || "#ffffff";
            ctx.fill();
            if (element.borderWidth) {
              ctx.strokeStyle = element.borderColor || "#000000";
              ctx.lineWidth = element.borderWidth;
              ctx.stroke();
            }
          } else if (element.type === "text") {
            ctx.font = `${element.fontStyle === "italic" ? "italic " : ""}${
              element.fontWeight === "bold" ? "bold " : ""
            }${element.fontSize}px ${element.fontFamily}`;
            ctx.fillStyle = element.color || "#000000";
            ctx.textAlign = (element.textAlign as CanvasTextAlign) || "left";
            ctx.textBaseline = "middle";

            // Simple text rendering (doesn't handle wrapping)
            ctx.fillText(
              element.content || "",
              element.x + element.width / 2,
              element.y + element.height / 2
            );
          } else if (element.type === "image" && element.imageUrl) {
            // For images, we would normally load them and draw them
            // This is simplified for the demo
            ctx.fillStyle = "#f0f0f0";
            ctx.fillRect(element.x, element.y, element.width, element.height);
            ctx.strokeStyle = "#cccccc";
            ctx.lineWidth = 1;
            ctx.strokeRect(element.x, element.y, element.width, element.height);

            // Draw an image placeholder
            ctx.beginPath();
            ctx.moveTo(element.x, element.y);
            ctx.lineTo(element.x + element.width, element.y + element.height);
            ctx.moveTo(element.x + element.width, element.y);
            ctx.lineTo(element.x, element.y + element.height);
            ctx.stroke();
          }

          ctx.restore();
        });

        // Generate data URL and download
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "poster-design.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Show success message
        alert("Your poster has been exported successfully!");

        // Restore selection
        setSelectedElementId(prevSelectedId);
      } catch (error) {
        console.error("Error exporting canvas:", error);
        alert("There was an error exporting your design. Please try again.");
        // Restore selection on error too
        setSelectedElementId(prevSelectedId);
      }
    }, 100);
  };
  // Handle zoom
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
  };

  // Render element based on type
  const renderElement = (element: DesignElement) => {
    const isSelected = element.id === selectedElementId;

    const elementStyle: React.CSSProperties = {
      position: "absolute",
      left: `${element.x}px`,
      top: `${element.y}px`,
      width: `${element.width}px`,
      height: `${element.height}px`,
      transform: `rotate(${element.rotation}deg)`,
      zIndex: element.zIndex,
      transition: "box-shadow 0.2s ease-in-out",
      boxShadow: isSelected ? "0 0 0 2px #3b82f6" : "none",
    };

    const handleMouseDownWrapper = (
      e: React.MouseEvent,
      action: "drag" | "resize" | "rotate",
      handle?: string
    ) => {
      handleMouseDown(e, element.id, action, handle);
    };

    // Touch handlers for mobile
    const handleTouchStart = (
      e: React.TouchEvent,
      action: "drag" | "resize" | "rotate",
      handle?: string
    ) => {
      if (e.touches.length !== 1) return;

      const touch = e.touches[0];
      const mouseEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
        stopPropagation: () => e.stopPropagation(),
      } as unknown as React.MouseEvent;

      handleMouseDown(mouseEvent, element.id, action, handle);
    };

    // Handle element click (for image selection)
    const handleElementClick = (e: React.MouseEvent) => {
      // Prevent event bubbling
      e.stopPropagation();

      // If it's an image and already selected, open file selector
      if (element.type === "image" && isSelected) {
        updateImageElement();
      }

      // Set as selected element if not already selected
      if (!isSelected) {
        setSelectedElementId(element.id);
      }
    };

    // Resize handles for selected element
    const renderResizeHandles = () => {
      if (!isSelected) return null;

      const handles = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

      return handles.map((handle) => {
        const handleStyle: React.CSSProperties = {
          position: "absolute",
          width: "12px",
          height: "12px",
          backgroundColor: "#3b82f6",
          borderRadius: "50%",
          cursor: `${handle}-resize`,
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: "#ffffff",
        };

        // Position handle based on location
        switch (handle) {
          case "nw":
            handleStyle.top = "-6px";
            handleStyle.left = "-6px";
            break;
          case "n":
            handleStyle.top = "-6px";
            handleStyle.left = "calc(50% - 6px)";
            break;
          case "ne":
            handleStyle.top = "-6px";
            handleStyle.right = "-6px";
            break;
          case "e":
            handleStyle.top = "calc(50% - 6px)";
            handleStyle.right = "-6px";
            break;
          case "se":
            handleStyle.bottom = "-6px";
            handleStyle.right = "-6px";
            break;
          case "s":
            handleStyle.bottom = "-6px";
            handleStyle.left = "calc(50% - 6px)";
            break;
          case "sw":
            handleStyle.bottom = "-6px";
            handleStyle.left = "-6px";
            break;
          case "w":
            handleStyle.top = "calc(50% - 6px)";
            handleStyle.left = "-6px";
            break;
        }

        return (
          <div
            key={handle}
            style={handleStyle}
            onMouseDown={(e) => handleMouseDownWrapper(e, "resize", handle)}
            onTouchStart={(e) => handleTouchStart(e, "resize", handle)}
          />
        );
      });
    };

    // Rotation handle
    const renderRotationHandle = () => {
      if (!isSelected) return null;

      const handleStyle: React.CSSProperties = {
        position: "absolute",
        top: "-30px",
        left: "calc(50% - 6px)",
        width: "12px",
        height: "12px",
        backgroundColor: "#3b82f6",
        borderRadius: "50%",
        cursor: "grab",
        zIndex: 1000,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: "#ffffff",
      };

      return (
        <div
          style={handleStyle}
          onMouseDown={(e) => handleMouseDownWrapper(e, "rotate")}
          onTouchStart={(e) => handleTouchStart(e, "rotate")}
        />
      );
    };

    // Different element types
    switch (element.type) {
      case "text":
        return (
          <div
            style={{
              ...elementStyle,
              color: element.color,
              backgroundColor: element.backgroundColor,
              fontFamily: element.fontFamily,
              fontSize: `${element.fontSize}px`,
              fontWeight: element.fontWeight,
              fontStyle: element.fontStyle,
              textAlign: element.textAlign as any,
              display: "flex",
              alignItems: "center",
              padding: "4px",
              cursor: isSelected ? "move" : "pointer",
              userSelect: "none",
              overflow: "hidden",
            }}
            onMouseDown={(e) => handleMouseDownWrapper(e, "drag")}
            onTouchStart={(e) => handleTouchStart(e, "drag")}
            onClick={handleElementClick}
          >
            {element.content}
            {renderResizeHandles()}
            {renderRotationHandle()}
          </div>
        );

      case "rectangle":
        return (
          <div
            style={{
              ...elementStyle,
              backgroundColor: element.backgroundColor,
              border: `${element.borderWidth}px solid ${element.borderColor}`,
              cursor: isSelected ? "move" : "pointer",
            }}
            onMouseDown={(e) => handleMouseDownWrapper(e, "drag")}
            onTouchStart={(e) => handleTouchStart(e, "drag")}
            onClick={handleElementClick}
          >
            {renderResizeHandles()}
            {renderRotationHandle()}
          </div>
        );

      case "circle":
        return (
          <div
            style={{
              ...elementStyle,
              backgroundColor: element.backgroundColor,
              border: `${element.borderWidth}px solid ${element.borderColor}`,
              borderRadius: "50%",
              cursor: isSelected ? "move" : "pointer",
            }}
            onMouseDown={(e) => handleMouseDownWrapper(e, "drag")}
            onTouchStart={(e) => handleTouchStart(e, "drag")}
            onClick={handleElementClick}
          >
            {renderResizeHandles()}
            {renderRotationHandle()}
          </div>
        );

      case "image":
        return (
          <div
            style={{
              ...elementStyle,
              overflow: "hidden",
              cursor: isSelected ? "move" : "pointer",
              border: isSelected ? "none" : "1px dashed #e2e8f0",
            }}
            onMouseDown={(e) => handleMouseDownWrapper(e, "drag")}
            onTouchStart={(e) => handleTouchStart(e, "drag")}
            onClick={(e) => {
              e.stopPropagation(); // This ensures canvas click doesn't deselect
              setSelectedElementId(element.id);
            }}
          >
            <img
              src={element.imageUrl}
              alt="Design element"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              draggable={false}
            />

            {renderResizeHandles()}
            {renderRotationHandle()}
          </div>
        );

      default:
        return null;
    }
  };

  // Responsiveness - adjust canvas size
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        let containerWidth, containerHeight;
        let aspectRatio: number;

        if (screenSize === "mobile") {
          containerWidth = window.innerWidth - 32;
          containerHeight = window.innerHeight - 180;
          aspectRatio = 4 / 3; // or keep same as desktop if preferred
        } else if (screenSize === "tablet") {
          containerWidth = window.innerWidth - (isSidebarOpen ? 240 : 60) - 200;
          containerHeight = window.innerHeight - 100;
          aspectRatio = 3 / 4; // Portrait-ish for tablet
        } else {
          containerWidth =
            window.innerWidth -
            (isSidebarOpen ? 240 : 60) -
            (isPanelOpen && selectedElement ? 260 : 0) -
            32;
          containerHeight = window.innerHeight - 100;
          aspectRatio = 3 / 4; // Landscape for desktop
        }

        let width, height;

        if (containerWidth / containerHeight > aspectRatio) {
          // Container is wider than needed
          height = Math.min(containerHeight, 800);
          width = height * aspectRatio;
        } else {
          // Container is taller than needed
          width = Math.min(containerWidth, 1000);
          height = width / aspectRatio;
        }

        setCanvasSize({ width, height });
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [isSidebarOpen, isPanelOpen, selectedElement, screenSize]);

  // Drawer for mobile
  const renderDrawer = () => {
    if (screenSize !== "mobile" || !isDrawerOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 bg-opacity-50"
          onClick={() => setIsDrawerOpen(false)}
        />

        {/* Drawer content */}
        <div className="absolute right-0 top-0 h-full w-4/5 max-w-xs bg-white shadow-xl flex flex-col">
          {/* Drawer header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">
              {selectedElement ? "Properties" : "Elements"}
            </h2>
            <button
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => setIsDrawerOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer content */}
          <div className="flex-1 overflow-y-auto p-4">
            {selectedElement ? (
              // Properties panel
              <div className="space-y-4">
                {/* Position and size */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">
                    Position & Size
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500 block">X</label>
                      <input
                        type="number"
                        value={Math.round(selectedElement.x)}
                        onChange={(e) =>
                          updateElementProperty(
                            selectedElement.id,
                            "x",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full border border-gray-300 rounded p-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block">Y</label>
                      <input
                        type="number"
                        value={Math.round(selectedElement.y)}
                        onChange={(e) =>
                          updateElementProperty(
                            selectedElement.id,
                            "y",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full border border-gray-300 rounded p-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block">
                        Width
                      </label>
                      <input
                        type="number"
                        min="20"
                        value={Math.round(selectedElement.width)}
                        onChange={(e) =>
                          updateElementProperty(
                            selectedElement.id,
                            "width",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full border border-gray-300 rounded p-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block">
                        Height
                      </label>
                      <input
                        type="number"
                        min="20"
                        value={Math.round(selectedElement.height)}
                        onChange={(e) =>
                          updateElementProperty(
                            selectedElement.id,
                            "height",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full border border-gray-300 rounded p-1 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block">
                      Rotation
                    </label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={Math.round(
                          (selectedElement.rotation + 360) % 360
                        )}
                        onChange={(e) =>
                          updateElementProperty(
                            selectedElement.id,
                            "rotation",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full"
                      />
                      <span className="text-xs ml-2 w-8">
                        {Math.round((selectedElement.rotation + 360) % 360)}°
                      </span>
                    </div>
                  </div>
                </div>

                {/* Text properties */}
                {selectedElement.type === "text" && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700">Text</h3>

                    <div>
                      <label className="text-xs text-gray-500 block">
                        Content
                      </label>
                      <textarea
                        value={selectedElement.content}
                        onChange={(e) =>
                          updateElementProperty(
                            selectedElement.id,
                            "content",
                            e.target.value
                          )
                        }
                        className="w-full border border-gray-300 rounded p-1 text-sm h-20"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 block">
                        Font
                      </label>
                      <select
                        value={selectedElement.fontFamily}
                        onChange={(e) =>
                          updateElementProperty(
                            selectedElement.id,
                            "fontFamily",
                            e.target.value
                          )
                        }
                        className="w-full border border-gray-300 rounded p-1 text-sm"
                      >
                        {fontFamilies.map((font) => (
                          <option key={font} value={font}>
                            {font}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 block">
                          Size
                        </label>
                        <input
                          type="number"
                          min="8"
                          max="200"
                          value={selectedElement.fontSize}
                          onChange={(e) =>
                            updateElementProperty(
                              selectedElement.id,
                              "fontSize",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full border border-gray-300 rounded p-1 text-sm"
                        />
                      </div>

                      <div className="flex pt-4">
                        <button
                          className={`p-2 border border-gray-300 ${
                            selectedElement.fontWeight === "bold"
                              ? "bg-blue-100"
                              : "bg-white"
                          }`}
                          onClick={() =>
                            updateElementProperty(
                              selectedElement.id,
                              "fontWeight",
                              selectedElement.fontWeight === "bold"
                                ? "normal"
                                : "bold"
                            )
                          }
                        >
                          <Bold className="w-4 h-4" />
                        </button>
                        <button
                          className={`p-2 border border-gray-300 border-l-0 ${
                            selectedElement.fontStyle === "italic"
                              ? "bg-blue-100"
                              : "bg-white"
                          }`}
                          onClick={() =>
                            updateElementProperty(
                              selectedElement.id,
                              "fontStyle",
                              selectedElement.fontStyle === "italic"
                                ? "normal"
                                : "italic"
                            )
                          }
                        >
                          <Italic className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 block">
                        Alignment
                      </label>
                      <div className="flex">
                        <button
                          className={`flex-1 p-2 border border-gray-300 ${
                            selectedElement.textAlign === "left"
                              ? "bg-blue-100"
                              : "bg-white"
                          }`}
                          onClick={() =>
                            updateElementProperty(
                              selectedElement.id,
                              "textAlign",
                              "left"
                            )
                          }
                        >
                          <AlignLeft className="w-4 h-4 mx-auto" />
                        </button>
                        <button
                          className={`flex-1 p-2 border border-gray-300 border-l-0 ${
                            selectedElement.textAlign === "center"
                              ? "bg-blue-100"
                              : "bg-white"
                          }`}
                          onClick={() =>
                            updateElementProperty(
                              selectedElement.id,
                              "textAlign",
                              "center"
                            )
                          }
                        >
                          <AlignCenter className="w-4 h-4 mx-auto" />
                        </button>
                        <button
                          className={`flex-1 p-2 border border-gray-300 border-l-0 ${
                            selectedElement.textAlign === "right"
                              ? "bg-blue-100"
                              : "bg-white"
                          }`}
                          onClick={() =>
                            updateElementProperty(
                              selectedElement.id,
                              "textAlign",
                              "right"
                            )
                          }
                        >
                          <AlignRight className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Color properties */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">Colors</h3>

                  {selectedElement.type === "text" && (
                    <div>
                      <label className="text-xs text-gray-500 block">
                        Text Color
                      </label>
                      <div className="grid grid-cols-5 gap-1 mt-1">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            className={`w-6 h-6 rounded-full border ${
                              selectedElement.color === color
                                ? "ring-2 ring-blue-500"
                                : "border-gray-300"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() =>
                              updateElementProperty(
                                selectedElement.id,
                                "color",
                                color
                              )
                            }
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {(selectedElement.type === "rectangle" ||
                    selectedElement.type === "circle" ||
                    selectedElement.type === "text") && (
                    <div>
                      <label className="text-xs text-gray-500 block">
                        {selectedElement.type === "text"
                          ? "Background"
                          : "Fill"}
                      </label>
                      <div className="grid grid-cols-5 gap-1 mt-1 px-1 ">
                        <button
                          className={`w-6 h-6 rounded-full border border-gray-300 ${
                            selectedElement.backgroundColor === "transparent"
                              ? "ring-2 ring-blue-500"
                              : ""
                          }`}
                          style={{
                            backgroundImage:
                              "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)",
                            backgroundSize: "8px 8px",
                            backgroundPosition: "0 0, 4px 4px",
                          }}
                          onClick={() =>
                            updateElementProperty(
                              selectedElement.id,
                              "backgroundColor",
                              "transparent"
                            )
                          }
                          title="Transparent"
                        />
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            className={`w-6 h-6 rounded-full border ${
                              selectedElement.backgroundColor === color
                                ? "ring-2 ring-blue-500"
                                : "border-gray-300"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() =>
                              updateElementProperty(
                                selectedElement.id,
                                "backgroundColor",
                                color
                              )
                            }
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {(selectedElement.type === "rectangle" ||
                    selectedElement.type === "circle") && (
                    <>
                      <div>
                        <label className="text-xs text-gray-500 block">
                          Border Color
                        </label>
                        <div className="grid grid-cols-5 gap-1 mt-1">
                          {colorOptions.map((color) => (
                            <button
                              key={color}
                              className={`w-6 h-6 rounded-full border ${
                                selectedElement.borderColor === color
                                  ? "ring-2 ring-blue-500"
                                  : "border-gray-300"
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() =>
                                updateElementProperty(
                                  selectedElement.id,
                                  "borderColor",
                                  color
                                )
                              }
                              title={color}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 block">
                          Border Width
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={selectedElement.borderWidth}
                          onChange={(e) =>
                            updateElementProperty(
                              selectedElement.id,
                              "borderWidth",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full"
                        />
                        <div className="text-right text-xs">
                          {selectedElement.borderWidth}px
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="grid gap-2">
                    <button
                      className="flex items-center justify-center space-x-2 p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                      onClick={bringToFront}
                    >
                      <Layers className="w-5 h-5" />
                      <span>Bring to Front</span>
                    </button>
                    <button
                      className="flex items-center justify-center space-x-2 p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                      onClick={sendToBack}
                    >
                      <Layers className="w-5 h-5" />
                      <span>Bring to Back</span>
                    </button>

                    <button
                      className="flex items-center justify-center space-x-2 p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                      onClick={deleteSelectedElement}
                    >
                      <Trash2 className="w-5 h-5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Elements panel
              <div className="space-y-4">
                <button
                  className="w-full flex items-center space-x-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={addTextElement}
                >
                  <Type className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Add Text</span>
                </button>

                <button
                  className="w-full flex items-center space-x-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={addImageElement}
                >
                  <Image className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Add Image</span>
                </button>

                <button
                  className="w-full flex items-center space-x-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={addRectangleElement}
                >
                  <Square className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Add Rectangle</span>
                </button>

                <button
                  className="w-full flex items-center space-x-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={addCircleElement}
                >
                  <Circle className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Add Circle</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col h-screen bg-gray-100 text-gray-900 overflow-hidden">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <button
            className="p-1 rounded text-blue-600 hover:bg-blue-50"
            onClick={onBackToHome}
            title="Back to Home"
          >
            <ArrowRight className="w-5 h-5 transform rotate-180" />
          </button>
          <h1 className="text-xl font-semibold hidden md:block">
            Poster Design Tool
          </h1>

          {/* Show menu toggle on mobile */}
          {screenSize === "mobile" && (
            <button
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => setIsDrawerOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center space-x-1">
            <button
              className="p-2 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="Undo"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button
              className="p-2 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Redo"
            >
              <Redo className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Zoom controls */}
          <div className="hidden md:flex items-center space-x-1 bg-gray-50 rounded-lg p-1">
            <button
              className="p-1 rounded hover:bg-gray-200 transition-colors"
              onClick={handleZoomOut}
              title="Zoom Out"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium px-1">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              className="p-1 rounded hover:bg-gray-200 transition-colors"
              onClick={handleZoomIn}
              title="Zoom In"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              className="p-1 rounded hover:bg-gray-200 transition-colors ml-1"
              onClick={handleZoomReset}
              title="Reset Zoom"
            >
              <RotateCcwSquare className="w-4 h-4" />
            </button>
          </div>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm"
            onClick={exportAsImage}
          >
            <Download className="w-4 h-4 pr-0 mr-0 md:mr-1" />
            <span className="hidden md:inline">Export</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar - hidden on mobile */}
        {screenSize !== "mobile" && (
          <aside
            className={`bg-white border-r border-gray-200 transition-all duration-300 ${
              isSidebarOpen ? "w-60" : "w-14"
            }`}
          >
            <div className="p-2 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2
                  className={`font-medium ${
                    isSidebarOpen ? "block" : "hidden"
                  }`}
                >
                  Elements
                </h2>
                <button
                  className="p-1 rounded hover:bg-gray-100"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  {isSidebarOpen ? (
                    <ChevronLeft className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="grid gap-2">
                <button
                  className={`flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                    isSidebarOpen ? "justify-start space-x-2" : "justify-center"
                  }`}
                  onClick={addTextElement}
                  title="Add Text"
                >
                  <Type className="w-5 h-5 text-blue-600" />
                  {isSidebarOpen && <span>Text</span>}
                </button>

                <button
                  className={`flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                    isSidebarOpen ? "justify-start space-x-2" : "justify-center"
                  }`}
                  onClick={addImageElement}
                  title="Add Image"
                >
                  <Image className="w-5 h-5 text-blue-600" />
                  {isSidebarOpen && <span>Image</span>}
                </button>

                <button
                  className={`flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                    isSidebarOpen ? "justify-start space-x-2" : "justify-center"
                  }`}
                  onClick={addRectangleElement}
                  title="Add Rectangle"
                >
                  <Square className="w-5 h-5 text-blue-600" />
                  {isSidebarOpen && <span>Rectangle</span>}
                </button>

                <button
                  className={`flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                    isSidebarOpen ? "justify-start space-x-2" : "justify-center"
                  }`}
                  onClick={addCircleElement}
                  title="Add Circle"
                >
                  <Circle className="w-5 h-5 text-blue-600" />
                  {isSidebarOpen && <span>Circle</span>}
                </button>
              </div>

              {isSidebarOpen && selectedElement && (
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h3 className="font-medium mb-2">Actions</h3>
                  <div className="grid gap-2">
                    <button
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                      onClick={bringToFront}
                    >
                      <Layers className="w-5 h-5" />
                      <span>Bring to Front</span>
                    </button>
                    <button
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                      onClick={sendToBack}
                    >
                      <Layers className="w-5 h-5" />
                      <span>Bring to Back</span>
                    </button>

                    <button
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                      onClick={deleteSelectedElement}
                    >
                      <Trash2 className="w-5 h-5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 flex flex-col">
          <div
            className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50 flex justify-center items-center"
            style={{
              backgroundImage:
                "radial-gradient(#ddd 1px, transparent 1px), radial-gradient(#ddd 1px, transparent 1px)",
              backgroundPosition: "0 0, 25px 25px",
              backgroundSize: "50px 50px",
            }}
          >
            {/* Canvas */}
            <div
              ref={canvasRef}
              className="bg-white shadow-lg rounded-lg border border-gray-300"
              style={{
                width: `${canvasSize.width}px`,
                height: `${canvasSize.height}px`,
                position: "relative",
                overflow: "hidden",
                transition: "width 0.3s, height 0.3s",
                transform: `scale(${zoomLevel})`,
                transformOrigin: "center",
              }}
              onClick={handleCanvasClick}
            >
              {elements.map((element) => (
                <React.Fragment key={element.id}>
                  {renderElement(element)}
                </React.Fragment>
              ))}{" "}
            </div>
          </div>

          {/* Mobile zoom controls */}
          {screenSize === "mobile" && (
            <div className="flex items-center justify-center space-x-2 p-2 bg-white border-t border-gray-200">
              <button
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={handleZoomOut}
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium mx-2">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={handleZoomIn}
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors ml-2"
                onClick={handleZoomReset}
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </main>

        {/* Properties panel - hidden on mobile */}
        {screenSize !== "mobile" && (
          <aside
            className={`bg-white border-l border-gray-200 transition-all duration-300 ${
              isPanelOpen ? "w-64" : "w-14"
            }`}
          >
            <div className="p-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2
                  className={`font-medium ${isPanelOpen ? "block" : "hidden"}`}
                >
                  Properties
                </h2>
                <button
                  className="p-1 rounded hover:bg-gray-100"
                  onClick={() => setIsPanelOpen(!isPanelOpen)}
                >
                  {isPanelOpen ? (
                    <ChevronRight className="w-5 h-5" />
                  ) : (
                    <ChevronLeft className="w-5 h-5" />
                  )}
                </button>
              </div>

              {isPanelOpen && (
                <div className="space-y-4 overflow-y-auto">
                  {selectedElement ? (
                    <>
                      <h3 className="text-sm font-medium text-gray-700">
                        Position & Size
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-gray-500 block">
                            X
                          </label>
                          <input
                            type="number"
                            value={Math.round(selectedElement.x)}
                            onChange={(e) =>
                              updateElementProperty(
                                selectedElement.id,
                                "x",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full border border-gray-300 rounded p-1 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block">
                            Y
                          </label>
                          <input
                            type="number"
                            value={Math.round(selectedElement.y)}
                            onChange={(e) =>
                              updateElementProperty(
                                selectedElement.id,
                                "y",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full border border-gray-300 rounded p-1 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block">
                            Width
                          </label>
                          <input
                            type="number"
                            min="20"
                            value={Math.round(selectedElement.width)}
                            onChange={(e) =>
                              updateElementProperty(
                                selectedElement.id,
                                "width",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full border border-gray-300 rounded p-1 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block">
                            Height
                          </label>
                          <input
                            type="number"
                            min="20"
                            value={Math.round(selectedElement.height)}
                            onChange={(e) =>
                              updateElementProperty(
                                selectedElement.id,
                                "height",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full border border-gray-300 rounded p-1 text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block">
                          Rotation
                        </label>
                        <div className="flex items-center">
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={Math.round(
                              (selectedElement.rotation + 360) % 360
                            )}
                            onChange={(e) =>
                              updateElementProperty(
                                selectedElement.id,
                                "rotation",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full"
                          />
                          <span className="text-xs ml-2 w-8">
                            {Math.round((selectedElement.rotation + 360) % 360)}
                            °
                          </span>
                        </div>
                      </div>

                      {/* Text properties */}
                      {selectedElement.type === "text" && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-gray-700">
                            Text
                          </h3>

                          <div>
                            <label className="text-xs text-gray-500 block">
                              Content
                            </label>
                            <textarea
                              value={selectedElement.content}
                              onChange={(e) =>
                                updateElementProperty(
                                  selectedElement.id,
                                  "content",
                                  e.target.value
                                )
                              }
                              className="w-full border border-gray-300 rounded p-1 text-sm h-20"
                            />
                          </div>

                          <div>
                            <label className="text-xs text-gray-500 block">
                              Font
                            </label>
                            <select
                              value={selectedElement.fontFamily}
                              onChange={(e) =>
                                updateElementProperty(
                                  selectedElement.id,
                                  "fontFamily",
                                  e.target.value
                                )
                              }
                              className="w-full border border-gray-300 rounded p-1 text-sm"
                            >
                              {fontFamilies.map((font) => (
                                <option key={font} value={font}>
                                  {font}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="flex-1">
                              <label className="text-xs text-gray-500 block">
                                Size
                              </label>
                              <input
                                type="number"
                                min="8"
                                max="200"
                                value={selectedElement.fontSize}
                                onChange={(e) =>
                                  updateElementProperty(
                                    selectedElement.id,
                                    "fontSize",
                                    parseInt(e.target.value)
                                  )
                                }
                                className="w-full border border-gray-300 rounded p-1 text-sm"
                              />
                            </div>

                            <div className="flex pt-4">
                              <button
                                className={`p-2 border border-gray-300 ${
                                  selectedElement.fontWeight === "bold"
                                    ? "bg-blue-100"
                                    : "bg-white"
                                }`}
                                onClick={() =>
                                  updateElementProperty(
                                    selectedElement.id,
                                    "fontWeight",
                                    selectedElement.fontWeight === "bold"
                                      ? "normal"
                                      : "bold"
                                  )
                                }
                              >
                                <Bold className="w-4 h-4" />
                              </button>
                              <button
                                className={`p-2 border border-gray-300 border-l-0 ${
                                  selectedElement.fontStyle === "italic"
                                    ? "bg-blue-100"
                                    : "bg-white"
                                }`}
                                onClick={() =>
                                  updateElementProperty(
                                    selectedElement.id,
                                    "fontStyle",
                                    selectedElement.fontStyle === "italic"
                                      ? "normal"
                                      : "italic"
                                  )
                                }
                              >
                                <Italic className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs text-gray-500 block">
                              Alignment
                            </label>
                            <div className="flex">
                              <button
                                className={`flex-1 p-2 border border-gray-300 ${
                                  selectedElement.textAlign === "left"
                                    ? "bg-blue-100"
                                    : "bg-white"
                                }`}
                                onClick={() =>
                                  updateElementProperty(
                                    selectedElement.id,
                                    "textAlign",
                                    "left"
                                  )
                                }
                              >
                                <AlignLeft className="w-4 h-4 mx-auto" />
                              </button>
                              <button
                                className={`flex-1 p-2 border border-gray-300 border-l-0 ${
                                  selectedElement.textAlign === "center"
                                    ? "bg-blue-100"
                                    : "bg-white"
                                }`}
                                onClick={() =>
                                  updateElementProperty(
                                    selectedElement.id,
                                    "textAlign",
                                    "center"
                                  )
                                }
                              >
                                <AlignCenter className="w-4 h-4 mx-auto" />
                              </button>
                              <button
                                className={`flex-1 p-2 border border-gray-300 border-l-0 ${
                                  selectedElement.textAlign === "right"
                                    ? "bg-blue-100"
                                    : "bg-white"
                                }`}
                                onClick={() =>
                                  updateElementProperty(
                                    selectedElement.id,
                                    "textAlign",
                                    "right"
                                  )
                                }
                              >
                                <AlignRight className="w-4 h-4 mx-auto" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Color properties */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-700">
                          Colors
                        </h3>

                        {selectedElement.type === "text" && (
                          <div>
                            <label className="text-xs text-gray-500 block">
                              Text Color
                            </label>
                            <div className="grid grid-cols-5 gap-1 mt-1 px-2">
                              {colorOptions.map((color) => (
                                <button
                                  key={color}
                                  className={`w-6 h-6 rounded-full border ${
                                    selectedElement.color === color
                                      ? "ring-2 ring-blue-500"
                                      : "border-gray-300"
                                  }`}
                                  style={{ backgroundColor: color }}
                                  onClick={() =>
                                    updateElementProperty(
                                      selectedElement.id,
                                      "color",
                                      color
                                    )
                                  }
                                  title={color}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {(selectedElement.type === "rectangle" ||
                          selectedElement.type === "circle" ||
                          selectedElement.type === "text") && (
                          <div>
                            <label className="text-xs text-gray-500 block">
                              {selectedElement.type === "text"
                                ? "Background"
                                : "Fill"}
                            </label>
                            <div className="grid grid-cols-5 gap-1 mt-1 px-2">
                              <button
                                className={`w-6 h-6 rounded-full border border-gray-300 ${
                                  selectedElement.backgroundColor ===
                                  "transparent"
                                    ? "ring-2 ring-blue-500"
                                    : ""
                                }`}
                                style={{
                                  backgroundImage:
                                    "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)",
                                  backgroundSize: "8px 8px",
                                  backgroundPosition: "0 0, 4px 4px",
                                }}
                                onClick={() =>
                                  updateElementProperty(
                                    selectedElement.id,
                                    "backgroundColor",
                                    "transparent"
                                  )
                                }
                                title="Transparent"
                              />
                              {colorOptions.map((color) => (
                                <button
                                  key={color}
                                  className={`w-6 h-6 rounded-full border ${
                                    selectedElement.backgroundColor === color
                                      ? "ring-2 ring-blue-500"
                                      : "border-gray-300"
                                  }`}
                                  style={{ backgroundColor: color }}
                                  onClick={() =>
                                    updateElementProperty(
                                      selectedElement.id,
                                      "backgroundColor",
                                      color
                                    )
                                  }
                                  title={color}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {(selectedElement.type === "rectangle" ||
                          selectedElement.type === "circle") && (
                          <>
                            <div>
                              <label className="text-xs text-gray-500 block">
                                Border Color
                              </label>
                              <div className="grid grid-cols-5 gap-1 mt-1">
                                {colorOptions.map((color) => (
                                  <button
                                    key={color}
                                    className={`w-6 h-6 rounded-full border ${
                                      selectedElement.borderColor === color
                                        ? "ring-2 ring-blue-500"
                                        : "border-gray-300"
                                    }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() =>
                                      updateElementProperty(
                                        selectedElement.id,
                                        "borderColor",
                                        color
                                      )
                                    }
                                    title={color}
                                  />
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="text-xs text-gray-500 block">
                                Border Width
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="10"
                                value={selectedElement.borderWidth}
                                onChange={(e) =>
                                  updateElementProperty(
                                    selectedElement.id,
                                    "borderWidth",
                                    parseInt(e.target.value)
                                  )
                                }
                                className="w-full"
                              />
                              <div className="text-right text-xs">
                                {selectedElement.borderWidth}px
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    // 📝 Show this when nothing is selected
                    <div className="text-gray-500 text-sm p-4">
                      No element selected. Click on an element to edit its
                      properties.
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Mobile bottom navigation */}
      {screenSize === "mobile" && (
        <nav className="flex items-center justify-around bg-white border-t border-gray-200 py-2">
          {!selectedElement ? (
            <button
              className="flex flex-col items-center p-2 text-blue-600"
              onClick={() => setIsDrawerOpen(true)}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Elements</span>
            </button>
          ) : (
            <button
              className="flex flex-col items-center p-2 text-gray-400"
              onClick={() => setIsDrawerOpen(true)}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Elements</span>
            </button>
          )}
          {selectedElement ? (
            <button
              className="flex flex-col items-center p-2 text-blue-600"
              onClick={() => setIsDrawerOpen(true)}
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs mt-1">Properties</span>
            </button>
          ) : (
            <button
              className="flex flex-col items-center p-2 text-gray-400"
              disabled
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs mt-1">Properties</span>
            </button>
          )}

          <button
            className="flex flex-col items-center p-2 text-blue-600"
            onClick={exportAsImage}
          >
            <Download className="w-6 h-6" />
            <span className="text-xs mt-1">Export</span>
          </button>
        </nav>
      )}

      {/* Mobile drawer */}
      {renderDrawer()}
    </div>
  );
};

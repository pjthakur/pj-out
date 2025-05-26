"use client";
import { useState, useRef, useEffect } from "react";
import {
  Download,
  Image as ImageIcon,
  Type,
  Filter,
  RotateCw,
  Trash2,
  ChevronUp,
  ChevronDown,
  Zap,
  Share2,
  Grid3X3,
  X,
  Save,
  Edit3,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  ChevronRight,
  Search,
  Undo,
  Redo,
  Layers,
  Settings,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";

type ElementType = "image" | "text";

interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
}

interface ImageElement extends BaseElement {
  type: "image";
  src: string;
}

interface TextElement extends BaseElement {
  type: "text";
  content: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  fontWeight: string;
}

type CollageElement = ImageElement | TextElement;

type ResizeDirection = "nw" | "ne" | "sw" | "se" | "";

interface SavedCollage {
  id: string;
  name: string;
  thumbnail: string;
  elements: CollageElement[];
  createdAt: string;
  canvasFilter: string;
}

interface HistoryState {
  elements: CollageElement[];
  canvasFilter: string;
}

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

const compressData = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data);
    return btoa(jsonString);
  } catch (error) {
    console.error("Compression error:", error);
    return JSON.stringify(data);
  }
};

const decompressData = (compressedData: string): any => {
  try {
    const jsonString = atob(compressedData);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Decompression error:", error);
    return JSON.parse(compressedData);
  }
};

const estimateStorageSize = (data: any): number => {
  return new Blob([JSON.stringify(data)]).size;
};

//rotation function
const rotateElement = (
  element: CollageElement,
  direction: "clockwise" | "counterclockwise"
): CollageElement => {
  const rotation = direction === "clockwise" ? 90 : -90;
  return {
    ...element,
    rotation: (element.rotation + rotation) % 360,
  };
};

export default function Home() {
  const [elements, setElements] = useState<CollageElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [canvasFilter, setCanvasFilter] = useState<string>("none");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [resizeDirection, setResizeDirection] = useState<ResizeDirection>("");
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [rotationCenter, setRotationCenter] = useState({ x: 0, y: 0 });
  const [rotationStartAngle, setRotationStartAngle] = useState(0);
  const [showTextInput, setShowTextInput] = useState<boolean>(false);
  const [textValue, setTextValue] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("#000000");
  const [fontSize, setFontSize] = useState<number>(24);
  const [fontFamily, setFontFamily] = useState<string>("Poppins");
  const [fontWeight, setFontWeight] = useState<string>("normal");
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  const [activeView, setActiveView] = useState<"canvas" | "gallery">(
    "canvas"
  );
  const [savedCollages, setSavedCollages] = useState<SavedCollage[]>([]);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [collageName, setCollageName] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [history, setHistory] = useState<HistoryState[]>([
    { elements: [], canvasFilter: "none" },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filters: Record<string, string> = {
    none: "None",
    "grayscale(100%)": "Grayscale",
    "sepia(100%)": "Sepia",
    "invert(100%)": "Invert",
    "brightness(130%)": "Bright",
    "contrast(150%)": "High Contrast",
    "blur(2px)": "Blur",
    "hue-rotate(90deg)": "Color Shift",
    "saturate(200%)": "Vibrant",
    "hue-rotate(180deg) saturate(250%)": "Surreal",
  };

  const fontFamilies = [
    "Poppins",
    "Inter",
    "Roboto",
    "Playfair Display",
    "Montserrat",
    "Lora",
    "Oswald",
    "Merriweather",
    "Source Sans Pro",
    "Nunito",
  ];

  const fontWeights = ["300", "400", "500", "600", "700", "800"];

  // Notification functions
  const showNotification = (
    type: Notification["type"],
    message: string,
    duration: number = 4000
  ) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 9);
    const notification: Notification = { id, type, message, duration };

    setNotifications((prev) => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // History management for redo/undo
  const saveToHistory = (
    newElements: CollageElement[],
    newFilter: string = canvasFilter
  ) => {
    const newState: HistoryState = {
      elements: [...newElements],
      canvasFilter: newFilter,
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);

    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }

    setHistory(newHistory);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const state = history[newIndex];
      setElements(state.elements);
      setCanvasFilter(state.canvasFilter);
      showNotification("info", "Action undone", 2000);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const state = history[newIndex];
      setElements(state.elements);
      setCanvasFilter(state.canvasFilter);
      showNotification("info", "Action redone", 2000);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
          e.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [historyIndex, history]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("artcanvas-collages");
      if (saved) {
        try {
          const parsedCollages = decompressData(saved);
          setSavedCollages(Array.isArray(parsedCollages) ? parsedCollages : []);
        } catch (parseError) {
          console.error("Error parsing saved collages:", parseError);
          const parsedCollages = JSON.parse(saved);
          setSavedCollages(Array.isArray(parsedCollages) ? parsedCollages : []);
        }
      }
    } catch (error) {
      console.error("Error loading saved collages:", error);
      showNotification("error", "Failed to load saved collages");
    }
  }, []);

  useEffect(() => {
    if (savedCollages.length === 0) return;

    try {
      const compressedData = compressData(savedCollages);
      const estimatedSize = estimateStorageSize(compressedData);
      const maxSize = 4 * 1024 * 1024;

      if (estimatedSize > maxSize) {
        const reducedCollages = savedCollages.slice(0, 5);
        const compressedReduced = compressData(reducedCollages);

        try {
          localStorage.setItem("artcanvas-collages", compressedReduced);
          if (savedCollages.length > 5) {
            setSavedCollages(reducedCollages);
            showNotification(
              "warning",
              "Storage optimized. Keeping 5 most recent collages."
            );
          }
        } catch (fallbackError) {
          console.error("Failed to save reduced collages:", fallbackError);
        }
      } else {
        try {
          localStorage.setItem("artcanvas-collages", compressedData);
        } catch (error) {
          console.error("Failed to save to localStorage:", error);
          showNotification(
            "error",
            "Failed to save. Please try deleting some collages first."
          );
        }
      }
    } catch (error) {
      console.error("Storage error:", error);
      showNotification(
        "error",
        "Failed to save collages. Please try again later."
      );
    }
  }, [savedCollages.length]);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  const generateThumbnail = async (
    elementsToRender: CollageElement[],
    filter: string
  ): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!canvasRef.current || !ctx) {
        resolve("");
        return;
      }

      const thumbnailSize = 200;
      const { width, height } = canvasRef.current.getBoundingClientRect();
      const scale = thumbnailSize / Math.max(width, height);

      canvas.width = thumbnailSize;
      canvas.height = (height / width) * thumbnailSize;

      ctx.fillStyle = darkMode ? "#1a1a1a" : "#f8fafc";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const sortedElements = [...elementsToRender].sort(
        (a, b) => a.zIndex - b.zIndex
      );

      const imageElements = sortedElements.filter((el) => el.type === "image");
      let loadedImages = 0;

      if (imageElements.length === 0) {
        drawTextElements();
        finish();
        return;
      }

      imageElements.forEach((element) => {
        const imageElement = element as ImageElement;
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
          ctx.save();
          ctx.translate(
            (element.x + element.width / 2) * scale,
            (element.y + element.height / 2) * scale
          );
          ctx.rotate((element.rotation * Math.PI) / 180);
          ctx.drawImage(
            img,
            (-element.width / 2) * scale,
            (-element.height / 2) * scale,
            element.width * scale,
            element.height * scale
          );
          ctx.restore();

          loadedImages++;
          if (loadedImages === imageElements.length) {
            drawTextElements();
            finish();
          }
        };

        img.onerror = () => {
          loadedImages++;
          if (loadedImages === imageElements.length) {
            drawTextElements();
            finish();
          }
        };

        img.src = imageElement.src;
      });

      function drawTextElements() {
        if (!ctx) return;

        const textElements = sortedElements.filter((el) => el.type === "text");

        textElements.forEach((element) => {
          const textElement = element as TextElement;

          ctx.save();
          ctx.translate(
            element.x + element.width / 2,
            element.y + element.height / 2
          );
          ctx.rotate((element.rotation * Math.PI) / 180);

          ctx.font = `${textElement.fontWeight} ${textElement.fontSize}px ${textElement.fontFamily}`;
          ctx.fillStyle = textElement.color;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(textElement.content, 0, 0);

          ctx.restore();
        });
      }

      function finish() {
        const thumbnail = canvas.toDataURL("image/jpeg", 0.7);
        resolve(thumbnail);
      }
    });
  };

  const cleanupOldCollages = () => {
    if (savedCollages.length > 10) {
      const recentCollages = savedCollages.slice(0, 10);
      setSavedCollages(recentCollages);
      showNotification(
        "success",
        `Cleaned up old collages. Keeping ${recentCollages.length} most recent ones.`
      );
    } else {
      showNotification(
        "info",
        "No cleanup needed. You have less than 10 collages."
      );
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      if (files.length > 10) {
        showNotification("error", "Maximum 10 images can be uploaded at once");
        return;
      }

      const currentElements = [...elements];
      let processedFiles = 0;

      Array.from(files).forEach((file) => {
        if (file.size > 10 * 1024 * 1024) {
          showNotification("error", `${file.name} exceeds 10MB size limit`);
          processedFiles++;
          if (processedFiles === files.length) {
            if (e.target) e.target.value = "";
          }
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result;
          const canvas = canvasRef.current;

          if (result && typeof result === "string" && canvas) {
            const img = new Image();
            img.src = result;

            img.onload = () => {
              let width = img.width;
              let height = img.height;
              const maxSize = 300;

              if (width > height && width > maxSize) {
                height = (height / width) * maxSize;
                width = maxSize;
              } else if (height > maxSize) {
                width = (width / height) * maxSize;
                height = maxSize;
              }

              const newElement: ImageElement = {
                id:
                  Date.now().toString() +
                  Math.random().toString(36).slice(2, 9),
                type: "image",
                src: result,
                x: Math.random() * Math.max(0, canvas.clientWidth - width),
                y: Math.random() * Math.max(0, canvas.clientHeight - height),
                width,
                height,
                rotation: 0,
                zIndex: currentElements.length + processedFiles,
              };

              currentElements.push(newElement);
              processedFiles++;

              if (processedFiles === files.length) {
                setElements(currentElements);
                saveToHistory(currentElements);
                showNotification(
                  "success",
                  `Added ${files.length} image${
                    files.length > 1 ? "s" : ""
                  } successfully`
                );
                if (e.target) e.target.value = "";
              }
            };

            img.onerror = () => {
              processedFiles++;
              if (processedFiles === files.length) {
                if (e.target) e.target.value = "";
              }
              showNotification(
                "error",
                "Failed to load image. Please try another file."
              );
            };
          }
        };

        reader.onerror = () => {
          processedFiles++;
          if (processedFiles === files.length) {
            if (e.target) e.target.value = "";
          }
          showNotification("error", "Error reading file. Please try again.");
        };

        reader.readAsDataURL(file);
      });
    }
  };

  const handleAddText = () => {
    setEditingTextId(null);
    setTextValue("");
    setShowTextInput(true);
  };
  //edit text function
  const handleEditText = (textElement: TextElement) => {
    setEditingTextId(textElement.id);
    setTextValue(textElement.content);
    setTextColor(textElement.color);
    setFontSize(textElement.fontSize);
    setFontFamily(textElement.fontFamily);
    setFontWeight(textElement.fontWeight);
    setShowTextInput(true);
  };
  //text input function
  const handleTextInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textValue.trim() && canvasRef.current) {
      let newElements: CollageElement[];

      if (editingTextId) {
        newElements = elements.map((el) => {
          if (el.id === editingTextId && el.type === "text") {
            return {
              ...el,
              content: textValue,
              fontSize: fontSize,
              color: textColor,
              fontFamily: fontFamily,
              fontWeight: fontWeight,
            } as TextElement;
          }
          return el;
        });
        showNotification("success", "Text updated successfully");
      } else {
        const newText: TextElement = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          type: "text",
          content: textValue,
          x: Math.random() * Math.max(0, canvasRef.current.clientWidth - 200),
          y: Math.random() * Math.max(0, canvasRef.current.clientHeight - 50),
          width: 200,
          height: 50,
          rotation: 0,
          zIndex: elements.length,
          fontSize: fontSize,
          color: textColor,
          fontFamily: fontFamily,
          fontWeight: fontWeight,
        };
        newElements = [...elements, newText];
        showNotification("success", "Text added successfully");
      }

      setElements(newElements);
      saveToHistory(newElements);
      setTextValue("");
      setShowTextInput(false);
      setEditingTextId(null);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedId(null);
      return;
    }

    let target = e.target as HTMLElement;
    let elementId: string | null = null;

    while (target && !elementId) {
      if (target.dataset.id) {
        elementId = target.dataset.id;
      }
      if (target.parentElement) {
        target = target.parentElement;
      } else {
        break;
      }
    }

    if (elementId) {
      const currentTarget = e.target as HTMLElement;
      const isRotateHandle =
        currentTarget.classList.contains("rotate-handle") ||
        (currentTarget.parentElement &&
          currentTarget.parentElement.classList.contains("rotate-handle"));

      if (currentTarget.classList.contains("resize-handle")) {
        const direction = currentTarget.dataset.direction as ResizeDirection;
        setIsResizing(true);
        setResizeDirection(direction);
        setSelectedId(elementId);
        e.preventDefault();
        e.stopPropagation();
      } else if (isRotateHandle) {
        const element = elements.find((el) => el.id === elementId);
        if (element && canvasRef.current) {
          setIsRotating(true);
          setSelectedId(elementId);

          const rect = canvasRef.current.getBoundingClientRect();
          const centerX = element.x + element.width / 2;
          const centerY = element.y + element.height / 2;
          setRotationCenter({ x: centerX, y: centerY });

          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          const initialAngle =
            Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
          setRotationStartAngle(initialAngle - element.rotation);
        }
        e.preventDefault();
        e.stopPropagation();
      } else {
        const element = elements.find((el) => el.id === elementId);
        if (element) {
          e.preventDefault();
          setSelectedId(elementId);
          setIsDragging(true);

          if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            setDragOffset({
              x: e.clientX - rect.left - element.x,
              y: e.clientY - rect.top - element.y,
            });
          }

          const newElements = elements.map((el) => {
            if (el.id === elementId) {
              return {
                ...el,
                zIndex: Math.max(...elements.map((e) => e.zIndex)) + 1,
              };
            }
            return el;
          });
          setElements(newElements);
        }
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!selectedId || !canvasRef.current) return;

    const selectedElement = elements.find((el) => el.id === selectedId);
    if (!selectedElement) return;

    const rect = canvasRef.current.getBoundingClientRect();

    if (isDragging) {
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;

      const boundedX = Math.max(
        0,
        Math.min(newX, rect.width - selectedElement.width)
      );
      const boundedY = Math.max(
        0,
        Math.min(newY, rect.height - selectedElement.height)
      );

      const newElements = elements.map((el) => {
        if (el.id === selectedId) {
          return { ...el, x: boundedX, y: boundedY };
        }
        return el;
      });
      setElements(newElements);
    } else if (isResizing) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let newWidth = selectedElement.width;
      let newHeight = selectedElement.height;
      let newX = selectedElement.x;
      let newY = selectedElement.y;

      if (selectedElement.type === "text") {
        const textElement = selectedElement as TextElement;
        const originalRatio = selectedElement.width / selectedElement.height;

        if (resizeDirection.includes("e")) {
          newWidth = mouseX - selectedElement.x;
          newHeight = newWidth / originalRatio;
        }
        if (resizeDirection.includes("w")) {
          newWidth = selectedElement.width + (selectedElement.x - mouseX);
          newX = mouseX;
          newHeight = newWidth / originalRatio;
        }
        if (resizeDirection.includes("s")) {
          newHeight = mouseY - selectedElement.y;
          newWidth = newHeight * originalRatio;
        }
        if (resizeDirection.includes("n")) {
          newHeight = selectedElement.height + (selectedElement.y - mouseY);
          newY = mouseY;
          newWidth = newHeight * originalRatio;
        }

        // Scale font size based on width change
        const widthScale = newWidth / selectedElement.width;
        const newFontSize = Math.max(
          8,
          Math.min(120, textElement.fontSize * widthScale)
        );

        const newElements = elements.map((el) => {
          if (el.id === selectedId) {
            return {
              ...el,
              width: Math.max(50, newWidth),
              height: Math.max(20, newHeight),
              x: newX,
              y: newY,
              fontSize: newFontSize,
            } as TextElement;
          }
          return el;
        });
        setElements(newElements);
      } else {
        if (resizeDirection.includes("e")) {
          newWidth = mouseX - selectedElement.x;
        }
        if (resizeDirection.includes("w")) {
          newWidth = selectedElement.width + (selectedElement.x - mouseX);
          newX = mouseX;
        }
        if (resizeDirection.includes("s")) {
          newHeight = mouseY - selectedElement.y;
        }
        if (resizeDirection.includes("n")) {
          newHeight = selectedElement.height + (selectedElement.y - mouseY);
          newY = mouseY;
        }

        const newElements = elements.map((el) => {
          if (el.id === selectedId) {
            return {
              ...el,
              width: Math.max(20, newWidth),
              height: Math.max(20, newHeight),
              x: newX,
              y: newY,
            };
          }
          return el;
        });
        setElements(newElements);
      }
    } else if (isRotating) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const currentAngle =
        Math.atan2(mouseY - rotationCenter.y, mouseX - rotationCenter.x) *
        (180 / Math.PI);
      const newRotation = currentAngle - rotationStartAngle;

      const newElements = elements.map((el) => {
        if (el.id === selectedId) {
          return { ...el, rotation: newRotation };
        }
        return el;
      });
      setElements(newElements);
    }
  };

  const handleCanvasMouseUp = () => {
    if (isDragging || isResizing || isRotating) {
      saveToHistory(elements);
    }

    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
  };

  const moveElementLayer = (direction: "up" | "down") => {
    if (!selectedId) return;

    const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);
    const selectedIndex = sortedElements.findIndex(
      (el) => el.id === selectedId
    );

    let newElements = [...elements];

    if (direction === "up" && selectedIndex < sortedElements.length - 1) {
      const nextElement = sortedElements[selectedIndex + 1];
      newElements = elements.map((el) => {
        if (el.id === selectedId) {
          return { ...el, zIndex: nextElement.zIndex };
        }
        if (el.id === nextElement.id) {
          return { ...el, zIndex: sortedElements[selectedIndex].zIndex };
        }
        return el;
      });
      showNotification("info", "Element moved forward", 1500);
    } else if (direction === "down" && selectedIndex > 0) {
      const prevElement = sortedElements[selectedIndex - 1];
      newElements = elements.map((el) => {
        if (el.id === selectedId) {
          return { ...el, zIndex: prevElement.zIndex };
        }
        if (el.id === prevElement.id) {
          return { ...el, zIndex: sortedElements[selectedIndex].zIndex };
        }
        return el;
      });
      showNotification("info", "Element moved backward", 1500);
    }

    setElements(newElements);
    saveToHistory(newElements);
  };

  const removeElement = () => {
    if (!selectedId) return;

    const newElements = elements.filter((el) => el.id !== selectedId);
    setElements(newElements);
    saveToHistory(newElements);
    setSelectedId(null);
    showNotification("success", "Element removed");
  };
  //save collage function
  const saveCollage = async () => {
    if (!canvasRef.current || elements.length === 0) {
      showNotification("warning", "Nothing to save. Add some elements first.");
      return;
    }

    try {
      const thumbnail = await generateThumbnail(elements, canvasFilter);

      const newCollage: SavedCollage = {
        id: Date.now().toString(),
        name: collageName || `Collage ${savedCollages.length + 1}`,
        thumbnail,
        elements: [...elements],
        createdAt: new Date().toISOString(),
        canvasFilter,
      };

      setSavedCollages((prev) => [newCollage, ...prev]);
      setShowSaveModal(false);
      setCollageName("");
      showNotification("success", "Collage saved successfully!");
    } catch (error) {
      console.error("Error saving collage:", error);
      showNotification("error", "Failed to save collage. Please try again.");
    }
  };

  const loadCollage = (collage: SavedCollage) => {
    setElements(collage.elements);
    setCanvasFilter(collage.canvasFilter);
    saveToHistory(collage.elements, collage.canvasFilter);
    setActiveView("canvas");
    setSelectedId(null);
    showNotification("success", `Loaded "${collage.name}"`);
  };

  const deleteCollage = (id: string) => {
    setSavedCollages((prev) => prev.filter((c) => c.id !== id));
    showNotification("success", "Collage deleted");
  };
  //share collage function
  const shareCollage = (platform: string) => {
    const url = window.location.href;
    const text = "Check out my amazing collage created with ArtCanvas!";

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        showNotification("success", "Link copied to clipboard!");
        break;
    }
    setShowShareModal(false);
  };
  //download collage function
  const downloadCollage = () => {
    if (!canvasRef.current) return;

    if (elements.length === 0) {
      showNotification(
        "warning",
        "Nothing to download. Add some elements first."
      );
      return;
    }

    setIsDownloading(true);

    setTimeout(() => {
      try {
        if (!canvasRef.current) {
          setIsDownloading(false);
          return;
        }

        const { width, height } = canvasRef.current.getBoundingClientRect();
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          showNotification("error", "Failed to create canvas context.");
          setIsDownloading(false);
          return;
        }

        const scale = 2;
        canvas.width = width * scale;
        canvas.height = height * scale;
        ctx.scale(scale, scale);

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = darkMode ? "#1a1a1a" : "#ffffff";
        ctx.fillRect(0, 0, width, height);

        const sortedElements = [...elements].sort(
          (a, b) => a.zIndex - b.zIndex
        );

        let loadedImages = 0;
        const imageElements = sortedElements.filter(
          (el) => el.type === "image"
        );
        const totalImages = imageElements.length;

        if (totalImages === 0) {
          drawTextElements();
          finishDownload();
          return;
        }

        imageElements.forEach((element) => {
          const imageElement = element as ImageElement;
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = imageElement.src;

          img.onload = () => {
            drawElement(element, img);
            loadedImages++;

            if (loadedImages === totalImages) {
              drawTextElements();
              finishDownload();
            }
          };

          img.onerror = () => {
            loadedImages++;
            if (loadedImages === totalImages) {
              drawTextElements();
              finishDownload();
            }
          };
        });

        function drawElement(element: CollageElement, img?: HTMLImageElement) {
          if (!ctx) return;

          ctx.save();
          ctx.translate(
            element.x + element.width / 2,
            element.y + element.height / 2
          );
          ctx.rotate((element.rotation * Math.PI) / 180);

          if (element.type === "image" && img) {
            ctx.drawImage(
              img,
              -element.width / 2,
              -element.height / 2,
              element.width,
              element.height
            );
          }

          ctx.restore();
        }

        function drawTextElements() {
          if (!ctx) return;

          const textElements = sortedElements.filter(
            (el) => el.type === "text"
          );

          textElements.forEach((element) => {
            const textElement = element as TextElement;

            ctx.save();
            ctx.translate(
              element.x + element.width / 2,
              element.y + element.height / 2
            );
            ctx.rotate((element.rotation * Math.PI) / 180);

            ctx.font = `${textElement.fontWeight} ${textElement.fontSize}px ${textElement.fontFamily}`;
            ctx.fillStyle = textElement.color;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(textElement.content, 0, 0);

            ctx.restore();
          });
        }

        function finishDownload() {
          try {
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext("2d");

            if (tempCtx) {
              tempCtx.fillStyle = darkMode ? "#1a1a1a" : "#ffffff";
              tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

              tempCtx.drawImage(canvas, 0, 0);

              if (canvasFilter !== "none") {
                const filterCanvas = document.createElement("canvas");
                filterCanvas.width = tempCanvas.width;
                filterCanvas.height = tempCanvas.height;
                const filterCtx = filterCanvas.getContext("2d");

                if (filterCtx) {
                  filterCtx.filter = canvasFilter;
                  filterCtx.drawImage(tempCanvas, 0, 0);

                  const link = document.createElement("a");
                  link.download = `artcanvas-${new Date()
                    .toISOString()
                    .slice(0, 10)}.png`;
                  link.href = filterCanvas.toDataURL("image/png", 1.0);
                  link.click();
                } else {
                  const link = document.createElement("a");
                  link.download = `artcanvas-${new Date()
                    .toISOString()
                    .slice(0, 10)}.png`;
                  link.href = tempCanvas.toDataURL("image/png", 1.0);
                  link.click();
                }
              } else {
                const link = document.createElement("a");
                link.download = `artcanvas-${new Date()
                  .toISOString()
                  .slice(0, 10)}.png`;
                link.href = tempCanvas.toDataURL("image/png", 1.0);
                link.click();
              }
            } else {
              const link = document.createElement("a");
              link.download = `artcanvas-${new Date()
                .toISOString()
                .slice(0, 10)}.png`;
              link.href = canvas.toDataURL("image/png", 1.0);
              link.click();
            }

            setIsDownloading(false);
            showNotification("success", "Collage downloaded successfully!");
          } catch (error) {
            console.error("Download error:", error);
            showNotification(
              "error",
              "Failed to download collage. Please try again."
            );
            setIsDownloading(false);
          }
        }
      } catch (error) {
        console.error("Canvas processing error:", error);
        showNotification(
          "error",
          "An error occurred while processing the canvas. Please try again."
        );
        setIsDownloading(false);
      }
    }, 100);
  };
  // theme toggle function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    showNotification(
      "info",
      `Switched to ${!darkMode ? "dark" : "light"} mode`,
      2000
    );
  };
  //reset collage function
  const resetCollage = () => {
    if (
      window.confirm(
        "Are you sure you want to clear the collage? This action cannot be undone."
      )
    ) {
      setElements([]);
      setSelectedId(null);
      setHistory([{ elements: [], canvasFilter: "none" }]);
      setHistoryIndex(0);
      showNotification("success", "Canvas cleared successfully");
    }
  };
  //filter change function
  const handleFilterChange = (newFilter: string) => {
    setCanvasFilter(newFilter);
    saveToHistory(elements, newFilter);
    showNotification("info", `Applied ${filters[newFilter]} filter`, 2000);
  };

  const filteredCollages = savedCollages.filter((collage) =>
    collage.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Notification Component
  const NotificationContainer = () => (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-300 transform animate-slideIn ${
            notification.type === "success"
              ? darkMode
                ? "bg-green-900/80 border-green-700/50 text-green-100"
                : "bg-green-50/90 border-green-200 text-green-800"
              : notification.type === "error"
              ? darkMode
                ? "bg-red-900/80 border-red-700/50 text-red-100"
                : "bg-red-50/90 border-red-200 text-red-800"
              : notification.type === "warning"
              ? darkMode
                ? "bg-yellow-900/80 border-yellow-700/50 text-yellow-100"
                : "bg-yellow-50/90 border-yellow-200 text-yellow-800"
              : darkMode
              ? "bg-blue-900/80 border-blue-700/50 text-blue-100"
              : "bg-blue-50/90 border-blue-200 text-blue-800"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {notification.type === "success" && <CheckCircle size={20} />}
              {notification.type === "error" && <AlertCircle size={20} />}
              {notification.type === "warning" && <AlertCircle size={20} />}
              {notification.type === "info" && <Info size={20} />}
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
  //canvas function
  const renderCanvas = () => (
    <div
      className={`rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 backdrop-blur-xl min-h-[600px] md:h-full flex flex-col ${
        darkMode
          ? "bg-gray-800/95 border border-gray-700/60 shadow-gray-900/50"
          : "bg-white/95 border border-violet-200/80 shadow-violet-500/15"
      }`}
    >
      <div
        className={`p-3 border-b transition-all duration-300 backdrop-blur-sm flex-shrink-0 ${
          darkMode
            ? "bg-gray-800/60 border-gray-700/60"
            : "bg-gradient-to-r from-violet-50/90 to-indigo-50/90 border-violet-200/60"
        }`}
      >
        {/* Primary Actions Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          {/* Mobile Layout - 3 Rows */}
          <div className="flex flex-col gap-2 sm:hidden">
            {/* Row 1: Add Images + Add Text */}
            <div className="flex gap-2">
              <button
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
                  darkMode
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-500/30"
                    : "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-violet-500/30"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon size={16} />
                <span>Add Images</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                multiple
                className="hidden"
              />

              <button
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
                  darkMode
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-purple-500/30"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-purple-500/30"
                }`}
                onClick={handleAddText}
              >
                <Type size={16} />
                <span>Add Text</span>
              </button>
            </div>

            {/* Row 2: Save + Share */}
            <div className="flex gap-2">
              <button
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg text-sm ${
                  elements.length > 0
                    ? darkMode
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/30 transform hover:scale-105"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/30 transform hover:scale-105"
                    : darkMode
                    ? "bg-gray-700/60 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200/60 text-gray-400 cursor-not-allowed"
                }`}
                onClick={() => setShowSaveModal(true)}
                disabled={elements.length === 0}
              >
                <Save size={14} />
                <span>Save</span>
              </button>

              <button
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg text-sm ${
                  elements.length > 0
                    ? darkMode
                      ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-emerald-500/30 transform hover:scale-105"
                      : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-emerald-500/30 transform hover:scale-105"
                    : darkMode
                    ? "bg-gray-700/60 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200/60 text-gray-400 cursor-not-allowed"
                }`}
                onClick={() => setShowShareModal(true)}
                disabled={elements.length === 0}
              >
                <Share2 size={14} />
                <span>Share</span>
              </button>
            </div>

            {/* Row 3: Download (full width) */}
            <button
              className={`w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg text-sm ${
                isDownloading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : elements.length > 0
                  ? darkMode
                    ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-orange-500/30 transform hover:scale-105"
                    : "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-orange-500/30 transform hover:scale-105"
                  : darkMode
                  ? "bg-gray-700/60 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200/60 text-gray-400 cursor-not-allowed"
              }`}
              onClick={downloadCollage}
              disabled={elements.length === 0 || isDownloading}
            >
              {isDownloading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download size={14} />
                  <span>Download</span>
                </>
              )}
            </button>
          </div>

          {/* Desktop Layout - Original (hidden on mobile) */}
          <div className="hidden sm:flex sm:items-center sm:gap-3">
            <button
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
                darkMode
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-500/30"
                  : "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-violet-500/30"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon size={16} />
              <span>Add Images</span>
            </button>

            <button
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
                darkMode
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-purple-500/30"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-purple-500/30"
              }`}
              onClick={handleAddText}
            >
              <Type size={16} />
              <span>Add Text</span>
            </button>
          </div>

          <div className="hidden sm:flex sm:items-center sm:gap-2">
            <button
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg text-sm ${
                elements.length > 0
                  ? darkMode
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/30 transform hover:scale-105"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/30 transform hover:scale-105"
                  : darkMode
                  ? "bg-gray-700/60 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200/60 text-gray-400 cursor-not-allowed"
              }`}
              onClick={() => setShowSaveModal(true)}
              disabled={elements.length === 0}
            >
              <Save size={14} />
              <span>Save</span>
            </button>

            <button
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg text-sm ${
                elements.length > 0
                  ? darkMode
                    ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-emerald-500/30 transform hover:scale-105"
                    : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-emerald-500/30 transform hover:scale-105"
                  : darkMode
                  ? "bg-gray-700/60 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200/60 text-gray-400 cursor-not-allowed"
              }`}
              onClick={() => setShowShareModal(true)}
              disabled={elements.length === 0}
            >
              <Share2 size={14} />
              <span>Share</span>
            </button>

            <button
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg text-sm ${
                isDownloading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : elements.length > 0
                  ? darkMode
                    ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-orange-500/30 transform hover:scale-105"
                    : "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-orange-500/30 transform hover:scale-105"
                  : darkMode
                  ? "bg-gray-700/60 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200/60 text-gray-400 cursor-not-allowed"
              }`}
              onClick={downloadCollage}
              disabled={elements.length === 0 || isDownloading}
            >
              {isDownloading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download size={14} />
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Secondary Controls Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-4">
          {/* Left Section - History & Layer Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            {/* History Controls */}
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium whitespace-nowrap ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                History:
              </span>
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-lg p-1 flex-1 sm:flex-initial">
                <button
                  className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-300 flex-1 sm:flex-initial ${
                    historyIndex > 0
                      ? darkMode
                        ? "bg-gray-700/80 hover:bg-gray-600 text-white"
                        : "bg-white/90 hover:bg-white text-gray-700 shadow-sm"
                      : darkMode
                      ? "text-gray-600 cursor-not-allowed"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  title="Undo (Ctrl+Z)"
                >
                  <Undo size={12} />
                  <span>Undo</span>
                </button>

                <button
                  className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-300 flex-1 sm:flex-initial ${
                    historyIndex < history.length - 1
                      ? darkMode
                        ? "bg-gray-700/80 hover:bg-gray-600 text-white"
                        : "bg-white/90 hover:bg-white text-gray-700 shadow-sm"
                      : darkMode
                      ? "text-gray-600 cursor-not-allowed"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  title="Redo (Ctrl+Y)"
                >
                  <Redo size={12} />
                  <span>Redo</span>
                </button>
              </div>
            </div>

            {/* Separator - Hidden on mobile */}
            <div className={`hidden sm:block h-6 w-px ${darkMode ? "bg-gray-600/50" : "bg-gray-300/50"}`}></div>

            {/* Layer Controls */}
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium whitespace-nowrap ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Layers:
              </span>
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-lg p-1 flex-1 sm:flex-initial">
                <button
                  className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-300 flex-1 sm:flex-initial ${
                    selectedId
                      ? darkMode
                        ? "bg-gray-700/80 hover:bg-gray-600 text-white"
                        : "bg-white/90 hover:bg-white text-gray-700 shadow-sm"
                      : darkMode
                      ? "text-gray-600 cursor-not-allowed"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={() => moveElementLayer("up")}
                  disabled={!selectedId}
                >
                  <ChevronUp size={12} />
                  <span className="hidden sm:inline">Forward</span>
                  <span className="sm:hidden">Fwd</span>
                </button>

                <button
                  className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-300 flex-1 sm:flex-initial ${
                    selectedId
                      ? darkMode
                        ? "bg-gray-700/80 hover:bg-gray-600 text-white"
                        : "bg-white/90 hover:bg-white text-gray-700 shadow-sm"
                      : darkMode
                      ? "text-gray-600 cursor-not-allowed"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={() => moveElementLayer("down")}
                  disabled={!selectedId}
                >
                  <ChevronDown size={12} />
                  <span className="hidden sm:inline">Backward</span>
                  <span className="sm:hidden">Back</span>
                </button>

                {/* Separator within layer controls */}
                <div className={`h-4 w-px mx-1 ${darkMode ? "bg-gray-600/50" : "bg-gray-300/50"}`}></div>

                <button
                  className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-300 flex-1 sm:flex-initial ${
                    selectedId
                      ? "bg-red-500/80 hover:bg-red-600 text-white"
                      : darkMode
                      ? "text-gray-600 cursor-not-allowed"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={removeElement}
                  disabled={!selectedId}
                >
                  <Trash2 size={12} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>

          {/* Center Section - Element Actions */}
          <div className="flex items-center justify-center gap-3">
            {selectedId &&
              elements.find((el) => el.id === selectedId)?.type === "text" && (
                <button
                  className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 shadow-sm w-full sm:w-auto ${
                    darkMode
                      ? "bg-blue-600/80 hover:bg-blue-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  onClick={() => {
                    const textElement = elements.find(
                      (el) => el.id === selectedId
                    ) as TextElement;
                    if (textElement) handleEditText(textElement);
                  }}
                >
                  <Edit3 size={12} />
                  <span>Edit Text</span>
                </button>
              )}
          </div>

          {/* Right Section - Filter Controls */}
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium whitespace-nowrap ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Filter:
            </span>
            <select
              className={`border-2 rounded-lg px-3 py-1.5 text-xs cursor-pointer transition-all duration-300 shadow-sm backdrop-blur-sm w-full sm:min-w-[120px] ${
                darkMode
                  ? "bg-gray-700/60 border-gray-600/50 text-white focus:border-indigo-500"
                  : "bg-white/80 border-violet-300/60 text-gray-700 focus:border-indigo-500"
              }`}
              value={canvasFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              {Object.entries(filters).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div
        ref={canvasRef}
        className={`relative flex-grow transition-colors duration-300 md:overflow-hidden md:min-h-0 ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-violet-50 to-indigo-50"
        }`}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        style={{ 
          filter: canvasFilter,
          minHeight: '400px' // Ensure adequate height on mobile
        }}
      >
        {elements.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className={`p-6 rounded-2xl backdrop-blur-xl shadow-2xl ${
                darkMode
                  ? "bg-gray-800/60 border border-gray-700/60"
                  : "bg-white/80 border border-violet-200/80"
              }`}
            >
              <ImageIcon
                size={64}
                className={`mb-4 mx-auto ${
                  darkMode ? "text-gray-500" : "text-violet-400"
                }`}
              />
              <p
                className={`text-xl font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-800"
                }`}
              >
                Your canvas awaits
              </p>
              <p
                className={`text-sm mb-6 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Start creating your masterpiece
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 text-sm font-medium transform hover:scale-105"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon size={16} />
                  <span>Add Images</span>
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all duration-300 text-sm font-medium transform hover:scale-105"
                  onClick={handleAddText}
                >
                  <Type size={16} />
                  <span>Add Text</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {elements.map((element) => (
          <div
            key={element.id}
            data-id={element.id}
            className={`absolute touch-none group ${
              selectedId === element.id
                ? "ring-2 ring-indigo-500 shadow-xl shadow-indigo-500/25"
                : ""
            }`}
            style={{
              left: `${element.x}px`,
              top: `${element.y}px`,
              width: `${element.width}px`,
              height: `${element.height}px`,
              transform: `rotate(${element.rotation}deg)`,
              zIndex: element.zIndex,
              cursor: "move",
              userSelect: "none",
              transition: "box-shadow 0.3s ease-in-out",
            }}
          >
            {element.type === "image" ? (
              <img
                src={(element as ImageElement).src}
                alt="Collage element"
                className="w-full h-full object-cover pointer-events-none rounded-lg shadow-lg"
                draggable="false"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center pointer-events-none">
                <span
                  style={{
                    fontSize: `${(element as TextElement).fontSize}px`,
                    color: (element as TextElement).color,
                    fontFamily: (element as TextElement).fontFamily,
                    fontWeight: (element as TextElement).fontWeight,
                  }}
                  className="text-center px-2 py-1 drop-shadow-lg break-words"
                >
                  {(element as TextElement).content}
                </span>
              </div>
            )}

            {selectedId === element.id && (
              <>
                <div
                  className={`absolute -top-1 -left-1 w-4 h-4 resize-handle cursor-nw-resize rounded-full ${
                    darkMode
                      ? "bg-indigo-500 border-2 border-white"
                      : "bg-white border-2 border-indigo-500"
                  } shadow-lg transition-all duration-200 hover:scale-110`}
                  data-direction="nw"
                  data-id={element.id}
                ></div>
                <div
                  className={`absolute -top-1 -right-1 w-4 h-4 resize-handle cursor-ne-resize rounded-full ${
                    darkMode
                      ? "bg-indigo-500 border-2 border-white"
                      : "bg-white border-2 border-indigo-500"
                  } shadow-lg transition-all duration-200 hover:scale-110`}
                  data-direction="ne"
                  data-id={element.id}
                ></div>
                <div
                  className={`absolute -bottom-1 -left-1 w-4 h-4 resize-handle cursor-sw-resize rounded-full ${
                    darkMode
                      ? "bg-indigo-500 border-2 border-white"
                      : "bg-white border-2 border-indigo-500"
                  } shadow-lg transition-all duration-200 hover:scale-110`}
                  data-direction="sw"
                  data-id={element.id}
                ></div>
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 resize-handle cursor-se-resize rounded-full ${
                    darkMode
                      ? "bg-indigo-500 border-2 border-white"
                      : "bg-white border-2 border-indigo-500"
                  } shadow-lg transition-all duration-200 hover:scale-110`}
                  data-direction="se"
                  data-id={element.id}
                ></div>

                <div className="absolute left-1/2 -top-10 transform -translate-x-1/2 flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newElements = elements.map((el) => {
                        if (el.id === element.id) {
                          return rotateElement(el, "counterclockwise");
                        }
                        return el;
                      });
                      setElements(newElements);
                      saveToHistory(newElements);
                    }}
                    className={`p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 ${
                      darkMode
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-indigo-600 shadow-xl"
                    }`}
                    title="Rotate 90° Counterclockwise"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                    </svg>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newElements = elements.map((el) => {
                        if (el.id === element.id) {
                          return rotateElement(el, "clockwise");
                        }
                        return el;
                      });
                      setElements(newElements);
                      saveToHistory(newElements);
                    }}
                    className={`p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 ${
                      darkMode
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-indigo-600 shadow-xl"
                    }`}
                    title="Rotate 90° Clockwise"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                      <path d="M21 3v5h-5" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {showTextInput && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div
              className={`p-8 rounded-3xl shadow-2xl max-w-lg w-full mx-4 backdrop-blur-xl ${
                darkMode
                  ? "bg-gray-800/95 border border-gray-700/60"
                  : "bg-white/95 border border-violet-200/80"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  {editingTextId ? "Edit Text" : "Add Text"}
                </h3>
                <button
                  onClick={() => {
                    setShowTextInput(false);
                    setTextValue("");
                    setEditingTextId(null);
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    darkMode
                      ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                      : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleTextInputSubmit}>
                <div className="mb-6">
                  <input
                    type="text"
                    className={`w-full border-2 rounded-2xl p-4 text-lg transition-all duration-300 ${
                      darkMode
                        ? "bg-gray-700/60 border-gray-600/60 text-white focus:border-indigo-500 backdrop-blur-sm"
                        : "bg-white/80 border-violet-300/60 text-gray-700 focus:border-indigo-500 backdrop-blur-sm"
                    }`}
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)}
                    placeholder="Enter your text here..."
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-800"
                      }`}
                    >
                      Font Family
                    </label>
                    <select
                      className={`w-full border-2 rounded-xl p-3 cursor-pointer transition-all duration-300 ${
                        darkMode
                          ? "bg-gray-700/60 border-gray-600/60 text-white focus:border-indigo-500 backdrop-blur-sm"
                          : "bg-white/80 border-violet-300/60 text-gray-700 focus:border-indigo-500 backdrop-blur-sm"
                      }`}
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                    >
                      {fontFamilies.map((font) => (
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
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-800"
                      }`}
                    >
                      Font Weight
                    </label>
                    <select
                      className={`w-full border-2 rounded-xl p-3 cursor-pointer transition-all duration-300 ${
                        darkMode
                          ? "bg-gray-700/60 border-gray-600/60 text-white focus:border-indigo-500 backdrop-blur-sm"
                          : "bg-white/80 border-violet-300/60 text-gray-700 focus:border-indigo-500 backdrop-blur-sm"
                      }`}
                      value={fontWeight}
                      onChange={(e) => setFontWeight(e.target.value)}
                    >
                      {fontWeights.map((weight) => (
                        <option key={weight} value={weight}>
                          {weight === "300"
                            ? "Light"
                            : weight === "400"
                            ? "Regular"
                            : weight === "500"
                            ? "Medium"
                            : weight === "600"
                            ? "Semi Bold"
                            : weight === "700"
                            ? "Bold"
                            : "Extra Bold"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-800"
                      }`}
                    >
                      Font Size
                    </label>
                    <input
                      type="number"
                      min="8"
                      max="120"
                      className={`w-full border-2 rounded-xl p-3 transition-all duration-300 ${
                        darkMode
                          ? "bg-gray-700/60 border-gray-600/60 text-white focus:border-indigo-500 backdrop-blur-sm"
                          : "bg-white/80 border-violet-300/60 text-gray-700 focus:border-indigo-500 backdrop-blur-sm"
                      }`}
                      value={fontSize}
                      onChange={(e) =>
                        setFontSize(parseInt(e.target.value) || 24)
                      }
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-800"
                      }`}
                    >
                      Text Color
                    </label>
                    <input
                      type="color"
                      className="w-full h-12 p-1 rounded-xl border-2 cursor-pointer"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    type="button"
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      darkMode
                        ? "bg-gray-700/60 hover:bg-gray-600 text-gray-300 backdrop-blur-sm"
                        : "bg-gray-200/80 hover:bg-gray-300 text-gray-700 backdrop-blur-sm"
                    }`}
                    onClick={() => {
                      setShowTextInput(false);
                      setTextValue("");
                      setEditingTextId(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg"
                    disabled={!textValue.trim()}
                  >
                    {editingTextId ? "Update Text" : "Add Text"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <div
        className={`px-4 py-3 flex justify-between items-center text-sm transition-all duration-300 backdrop-blur-sm flex-shrink-0 ${
          darkMode
            ? "bg-gray-800/60 text-gray-300"
            : "bg-gradient-to-r from-violet-50/90 to-indigo-50/90 text-gray-700"
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="font-medium text-xs sm:text-sm">
            {elements.length} element{elements.length !== 1 ? "s" : ""} in
            collage
          </span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            <span className="hidden sm:inline">{history.length} states • </span>
            {historyIndex + 1}/{history.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              selectedId ? "bg-green-500" : "bg-blue-500"
            }`}
          ></div>
          <span className="text-xs sm:text-sm">
            <span className="hidden sm:inline">{selectedId ? "Element selected" : "Ready to create"}</span>
            <span className="sm:hidden">{selectedId ? "Selected" : "Ready"}</span>
          </span>
        </div>
      </div>
    </div>
  );

  const renderGallery = () => (
    <div
      className={`rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 backdrop-blur-xl h-full md:h-full flex flex-col ${
        darkMode
          ? "bg-gray-800/95 border border-gray-700/60"
          : "bg-white/95 border border-violet-200/80 shadow-violet-500/15"
      }`}
    >
      <div
        className={`p-3 border-b backdrop-blur-sm flex-shrink-0 ${
          darkMode
            ? "bg-gray-800/60 border-gray-700/60"
            : "bg-gradient-to-r from-violet-50/90 to-indigo-50/90 border-violet-200/60"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold mb-1">Your Gallery</h2>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {savedCollages.length} saved collage
              {savedCollages.length !== 1 ? "s" : ""}
              {savedCollages.length > 10 && (
                <span className="text-orange-500 ml-2">
                  (Storage limit: max 15)
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {savedCollages.length > 10 && (
              <button
                onClick={cleanupOldCollages}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                  darkMode
                    ? "bg-orange-600 hover:bg-orange-700 text-white"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                Cleanup Old
              </button>
            )}
            <div className="relative">
              <Search
                size={16}
                className={`absolute left-2.5 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="text"
                placeholder="Search collages..."
                className={`pl-8 pr-3 py-1.5 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm text-sm ${
                  darkMode
                    ? "bg-gray-700/60 border-gray-600/60 text-white focus:border-indigo-500"
                    : "bg-white/80 border-violet-300/60 text-gray-700 focus:border-indigo-500"
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow md:overflow-y-auto p-3">
        {filteredCollages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
            <Grid3X3
              size={48}
              className={`mb-3 ${
                darkMode ? "text-gray-500" : "text-violet-400"
              }`}
            />
            <p
              className={`text-lg font-semibold mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-800"
              }`}
            >
              {searchTerm ? "No matching collages" : "No saved collages yet"}
            </p>
            <p
              className={`text-sm mb-4 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {searchTerm
                ? "Try a different search term"
                : "Create your first masterpiece!"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setActiveView("canvas")}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 text-sm"
              >
                Start Creating
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredCollages.map((collage) => (
              <div
                key={collage.id}
                className={`group relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl transform hover:scale-105 backdrop-blur-sm ${
                  darkMode
                    ? "bg-gray-700/60 border border-gray-600/60"
                    : "bg-white/80 border border-violet-200/80"
                }`}
              >
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  {collage.thumbnail ? (
                    <img
                      src={collage.thumbnail}
                      alt={collage.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={24} className="text-gray-400" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 backdrop-blur-sm">
                    <button
                      onClick={() => loadCollage(collage)}
                      className="px-2.5 py-1.5 bg-white/95 text-gray-900 rounded-lg font-semibold transition-all duration-200 hover:bg-white backdrop-blur-sm text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCollage(collage.id)}
                      className="px-2.5 py-1.5 bg-red-500/95 text-white rounded-lg font-semibold transition-all duration-200 hover:bg-red-600 backdrop-blur-sm text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="p-2.5">
                  <h3 className="font-semibold mb-1 truncate text-sm">
                    {collage.name}
                  </h3>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {new Date(collage.createdAt).toLocaleDateString()}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {collage.elements.length} element
                    {collage.elements.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const handleRotation = (direction: "clockwise" | "counterclockwise") => {
    if (!selectedId) return;

    const newElements = elements.map((el) => {
      if (el.id === selectedId) {
        return rotateElement(el, direction);
      }
      return el;
    });

    setElements(newElements);
    saveToHistory(newElements);
    showNotification(
      "info",
      `Rotated ${direction === "clockwise" ? "clockwise" : "counterclockwise"}`,
      1500
    );
  };

  return (
    <div
      className={`flex flex-col min-h-screen md:h-screen transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50 text-gray-900"
      }`}
    >
      {/* Notification Container */}
      <NotificationContainer />

      {/* Compact Header */}
      <header
        className={`backdrop-blur-xl transition-all duration-500 flex-shrink-0 ${
          darkMode
            ? "bg-gray-900/90 text-white border-b border-gray-700/60 shadow-2xl"
            : "bg-white/90 text-gray-900 border-b border-violet-200/60 shadow-xl shadow-violet-100/60"
        }`}
      >
        <div className="container mx-auto py-2 px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur opacity-75 animate-pulse"></div>
                <div className="relative p-1.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl shadow-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight relative">
                  ArtCanvas
                </h1>
                <p className="text-xs font-light opacity-80 hidden sm:block">
                  Professional Collage Creator
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <nav className="flex">
                <ul className="flex space-x-1 text-sm font-medium">
                  <li>
                    <button
                      onClick={() => setActiveView("canvas")}
                      className={`px-2.5 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1 ${
                        activeView === "canvas"
                          ? darkMode
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                            : "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                          : darkMode
                          ? "hover:bg-gray-700 text-gray-300"
                          : "hover:bg-violet-100 text-gray-600"
                      }`}
                    >
                      <Settings size={12} />
                      Canvas
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveView("gallery")}
                      className={`px-2.5 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1 ${
                        activeView === "gallery"
                          ? darkMode
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                            : "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                          : darkMode
                          ? "hover:bg-gray-700 text-gray-300"
                          : "hover:bg-violet-100 text-gray-600"
                      }`}
                    >
                      <Grid3X3 size={12} />
                      Gallery
                    </button>
                  </li>
                </ul>
              </nav>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleDarkMode}
                  className={`p-1.5 rounded-xl transition-all duration-300 shadow-lg ${
                    darkMode
                      ? "bg-gray-700/60 hover:bg-gray-600 text-yellow-400 backdrop-blur-sm"
                      : "bg-white/80 hover:bg-white text-gray-700 backdrop-blur-sm shadow-violet-100/60"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {darkMode ? (
                      <>
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line
                          x1="18.36"
                          y1="18.36"
                          x2="19.78"
                          y2="19.78"
                        ></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                      </>
                    ) : (
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    )}
                  </svg>
                </button>

                <button
                  onClick={resetCollage}
                  className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-all duration-300 shadow-lg backdrop-blur-sm ${
                    darkMode
                      ? "bg-red-900/60 hover:bg-red-800 text-red-300 hover:text-white border border-red-700/60"
                      : "bg-red-50/80 hover:bg-red-100 text-red-600 border border-red-200/60"
                  }`}
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="md:hidden flex items-center gap-1.5">
              <button
                onClick={toggleDarkMode}
                className={`p-1.5 rounded-xl transition-all duration-300 shadow-lg ${
                  darkMode
                    ? "bg-gray-700/60 hover:bg-gray-600 text-yellow-400 backdrop-blur-sm"
                    : "bg-white/80 hover:bg-white text-gray-700 backdrop-blur-sm shadow-violet-100/60"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {darkMode ? (
                    <>
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </>
                  ) : (
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  )}
                </svg>
              </button>

              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`p-1.5 rounded-xl transition-all duration-300 shadow-lg ${
                  darkMode
                    ? "bg-gray-700/60 hover:bg-gray-600 text-white backdrop-blur-sm"
                    : "bg-white/80 hover:bg-white text-gray-700 backdrop-blur-sm shadow-violet-100/60"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          {showMobileMenu && (
            <div
              className={`md:hidden mt-3 py-3 px-3 rounded-xl backdrop-blur-xl ${
                darkMode
                  ? "bg-gray-800/95 border border-gray-700/60"
                  : "bg-white/95 border border-violet-200/80"
              }`}
            >
              <nav className="space-y-1.5">
                <button
                  onClick={() => {
                    setActiveView("canvas");
                    setShowMobileMenu(false);
                  }}
                  className={`w-full px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm ${
                    activeView === "canvas"
                      ? darkMode
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                        : "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                      : darkMode
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-violet-100 text-gray-600"
                  }`}
                >
                  <Settings size={16} />
                  <span>Canvas</span>
                </button>

                <button
                  onClick={() => {
                    setActiveView("gallery");
                    setShowMobileMenu(false);
                  }}
                  className={`w-full px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm ${
                    activeView === "gallery"
                      ? darkMode
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                        : "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                      : darkMode
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-violet-100 text-gray-600"
                  }`}
                >
                  <Grid3X3 size={16} />
                  <span>Gallery</span>
                </button>

                <button
                  onClick={() => {
                    resetCollage();
                    setShowMobileMenu(false);
                  }}
                  className={`w-full px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm ${
                    darkMode
                      ? "bg-red-900/60 hover:bg-red-800 text-red-300 hover:text-white border border-red-700/60"
                      : "bg-red-50/80 hover:bg-red-100 text-red-600 border border-red-200/60"
                  }`}
                >
                  <Trash2 size={16} />
                  <span>Reset</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main content - responsive height management */}
      <main className="flex-grow container mx-auto p-1 sm:p-2 md:p-3 md:min-h-0 md:overflow-hidden">
        {activeView === "canvas" && renderCanvas()}
        {activeView === "gallery" && renderGallery()}
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-3xl shadow-2xl max-w-md w-full mx-4 backdrop-blur-xl ${
              darkMode
                ? "bg-gray-800/95 border border-gray-700/60"
                : "bg-white/95 border border-violet-200/80"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Share Your Collage</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className={`p-2 rounded-full transition-colors ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                }`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => shareCollage("twitter")}
                className="flex items-center justify-center gap-2 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl transition-all duration-300"
              >
                <Twitter size={18} />
                <span>Twitter</span>
              </button>

              <button
                onClick={() => shareCollage("facebook")}
                className="flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all duration-300"
              >
                <Facebook size={18} />
                <span>Facebook</span>
              </button>

              <button
                onClick={() => shareCollage("linkedin")}
                className="flex items-center justify-center gap-2 p-3 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl transition-all duration-300"
              >
                <Linkedin size={18} />
                <span>LinkedIn</span>
              </button>

              <button
                onClick={() => shareCollage("copy")}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl transition-all duration-300 backdrop-blur-sm ${
                  darkMode
                    ? "bg-gray-700/60 hover:bg-gray-600 text-white"
                    : "bg-gray-200/80 hover:bg-gray-300 text-gray-800"
                }`}
              >
                <Copy size={18} />
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-3xl shadow-2xl max-w-md w-full mx-4 backdrop-blur-xl ${
              darkMode
                ? "bg-gray-800/95 border border-gray-700/60"
                : "bg-white/95 border border-violet-200/80"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Save Collage</h3>
              <button
                onClick={() => setShowSaveModal(false)}
                className={`p-2 rounded-full transition-colors ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                }`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <label
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-800"
                }`}
              >
                Collage Name
              </label>
              <input
                type="text"
                className={`w-full border-2 rounded-2xl p-3 transition-all duration-300 backdrop-blur-sm ${
                  darkMode
                    ? "bg-gray-700/60 border-gray-600/60 text-white focus:border-indigo-500"
                    : "bg-white/80 border-violet-300/60 text-gray-700 focus:border-indigo-500"
                }`}
                value={collageName}
                onChange={(e) => setCollageName(e.target.value)}
                placeholder="Enter a name for your collage"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className={`px-4 py-2 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm ${
                  darkMode
                    ? "bg-gray-700/60 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-200/80 hover:bg-gray-300 text-gray-700"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={saveCollage}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg"
              >
                Save Collage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Improved Mobile Footer */}
      <footer
        className={`py-3 transition-all duration-500 backdrop-blur-xl flex-shrink-0 ${
          darkMode
            ? "bg-gray-900/90 text-gray-300 border-t border-gray-800/60"
            : "bg-white/90 text-gray-600 border-t border-violet-200/60"
        }`}
      >
        <div className="container mx-auto px-3">
          {/* Mobile: 3-row layout, Desktop: 1-row layout */}
          <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between md:items-center">
            {/* Row 1 on mobile, Left on desktop */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 order-1 md:order-1">
              <p className="text-xs opacity-70 text-center sm:text-left">
                © {new Date().getFullYear()} ArtCanvas Pro. All rights reserved.
              </p>
            </div>
            
            {/* Row 2 on mobile, Center on desktop */}
            <div className="flex justify-center order-2 md:order-2">
              <span className="text-xs opacity-70 text-center">
                <span className="hidden sm:inline">Made with ❤️ for creative professionals</span>
                <span className="sm:hidden">Made with ❤️ for creators</span>
              </span>
            </div>
            
            {/* Row 3 on mobile, Right on desktop */}
            <div className="flex items-center justify-center md:justify-end gap-2 order-3 md:order-3">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs opacity-70">
                  <span className="hidden sm:inline">All systems operational</span>
                  <span className="sm:hidden">Online</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Playfair+Display:wght@400;500;600;700;800&family=Montserrat:wght@300;400;500;600;700;800&family=Lora:wght@400;500;600;700&family=Oswald:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700;900&family=Source+Sans+Pro:wght@300;400;600;700&family=Nunito:wght@300;400;500;600;700;800&display=swap");

        * {
          touch-action: none;
        }

        body {
          font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI",
            sans-serif;
          font-feature-settings: "kern" 1, "liga" 1;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .resize-handle {
          pointer-events: auto;
          z-index: 10;
          transition: all 0.2s ease;
        }

        .resize-handle:hover {
          transform: scale(1.2);
        }

        .rotate-handle {
          pointer-events: auto;
          z-index: 10;
          transition: all 0.2s ease;
        }

        .rotate-handle:hover {
          transform: translateY(-4px) scale(1.1);
        }

        .rotate-handle:active {
          cursor: grabbing;
        }

        button,
        input[type="color"],
        select {
          cursor: pointer !important;
        }

        button:focus-visible,
        input:focus-visible,
        select:focus-visible {
          outline: 2px solid #8b5cf6;
          outline-offset: 2px;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #7c3aed, #9333ea);
        }

        /* Selection styles */
        ::selection {
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          color: white;
        }

        /* Enhanced animations */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }

        /* Text wrapping for text elements */
        .text-element {
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
        }
      `}</style>
    </div>
  );
}
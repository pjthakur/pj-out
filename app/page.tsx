"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  HiMagnifyingGlass,
  HiPlus,
  HiClock,
  HiClipboard,
  HiPencil,
  HiCheck,
  HiXMark,
  HiTrash,
  HiArrowDownTray,
  HiArrowUpTray,
  HiFolder,
  HiTag,
  HiChevronLeft,
  HiChevronRight,
  HiDocumentText,
  HiSquares2X2
} from "react-icons/hi2";
interface Clip {
  id: string;
  content: string;
  categoryId: string;
  timestamp: number;
  tags: string[];
  title?: string;
}
interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}
const DEFAULT_CATEGORIES: Category[] = [
  { id: "general", name: "General", color: "#3B82F6", createdAt: Date.now() },
  {
    id: "code",
    name: "Code Snippets",
    color: "#10B981",
    createdAt: Date.now(),
  },
  { id: "personal", name: "Personal", color: "#F59E0B", createdAt: Date.now() },
];
const PREDEFINED_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#F97316",
  "#06B6D4",
  "#84CC16",
  "#EC4899",
  "#6B7280",
];
const ClipboardManager: React.FC = () => {
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [clips, setClips] = useState<Clip[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [draggedClip, setDraggedClip] = useState<Clip | null>(null);
  const [showQuickSave, setShowQuickSave] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [categoryDraft, setCategoryDraft] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showQuickSaveModal, setShowQuickSaveModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#3B82F6");
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editingCategoryData, setEditingCategoryData] = useState<Category | null>(null);
  const [quickSaveClicked, setQuickSaveClicked] = useState(false);
  const [quickSaveSelectedCategory, setQuickSaveSelectedCategory] = useState("general");
  const [showNewClipModal, setShowNewClipModal] = useState(false);
  const [newClipSelectedCategory, setNewClipSelectedCategory] = useState("general");
  const [categoryBeforeSearch, setCategoryBeforeSearch] = useState<string>("all");
  const isModalOpenRef = useRef(false);
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const toggleLeft = () => setIsLeftOpen((v) => !v);
  const toggleRight = () => setIsRightOpen((v) => !v);
  const handleAddCategory = () => {
    if (!categoryDraft.trim()) return;
    if (isEditingCategory && editingCategoryData) {
      const updated = categories.map((c) =>
        c.id === editingCategoryData.id
          ? { ...c, name: categoryDraft.trim(), color: selectedColor }
          : c
      );
      setCategories(updated);
      saveToIndexedDB(clips, updated);
    } else {
      const newCat: Category = {
        id: Date.now().toString(),
        name: categoryDraft.trim(),
        color: selectedColor,
        createdAt: Date.now(),
      };
      const updated = [...categories, newCat];
      setCategories(updated);
      saveToIndexedDB(clips, updated);
    }
    setCategoryDraft("");
    setSelectedColor("#3B82F6");
    setShowCategoryModal(false);
    setIsEditingCategory(false);
    setEditingCategoryData(null);
  };
  const handleOpenCategoryModal = () => {
    setCategoryDraft("");
    setSelectedColor("#3B82F6");
    setIsEditingCategory(false);
    setEditingCategoryData(null);
    setShowCategoryModal(true);
  };
  const handleEditCategory = (category: Category) => {
    setCategoryDraft(category.name);
    setSelectedColor(category.color);
    setIsEditingCategory(true);
    setEditingCategoryData(category);
    setShowCategoryModal(true);
  };
  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setCategoryDraft("");
    setSelectedColor("#3B82F6");
    setIsEditingCategory(false);
    setEditingCategoryData(null);
  };
  const handleStartEditCategory = (id: string, currentName: string) => {
    const category = categories.find(c => c.id === id);
    if (category) {
      handleEditCategory(category);
    }
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dbRef = useRef<IDBDatabase | null>(null);
  useEffect(() => {
    if (showLandingPage) return;
    const initDB = async () => {
      const request = indexedDB.open("ClipboardManagerDB", 1);
      request.onerror = () => {
        console.error("Failed to open IndexedDB");
      };
      request.onsuccess = () => {
        dbRef.current = request.result;
        loadData();
      };
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("clips")) {
          db.createObjectStore("clips", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("categories")) {
          db.createObjectStore("categories", { keyPath: "id" });
        }
      };
    };
    initDB();
  }, [showLandingPage]);
  const loadData = async () => {
    if (!dbRef.current) return;
    const transaction = dbRef.current.transaction(
      ["clips", "categories"],
      "readonly"
    );
    const clipsStore = transaction.objectStore("clips");
    const categoriesStore = transaction.objectStore("categories");
    const clipsRequest = clipsStore.getAll();
    const categoriesRequest = categoriesStore.getAll();
    clipsRequest.onsuccess = () => {
      setClips(clipsRequest.result || []);
    };
    categoriesRequest.onsuccess = () => {
      const loadedCategories = categoriesRequest.result;
      if (loadedCategories && loadedCategories.length > 0) {
        setCategories(loadedCategories);
      }
    };
  };
  const saveToIndexedDB = useCallback(
    (clips: Clip[], categories: Category[]) => {
      if (!dbRef.current) return;
      const transaction = dbRef.current.transaction(
        ["clips", "categories"],
        "readwrite"
      );
      const clipsStore = transaction.objectStore("clips");
      const categoriesStore = transaction.objectStore("categories");
      clipsStore.clear();
      categoriesStore.clear();
      clips.forEach((clip) => clipsStore.add(clip));
      categories.forEach((category) => categoriesStore.add(category));
    },
    []
  );
  useEffect(() => {
    if (showLandingPage) return;
    let clipboardCheckInterval: NodeJS.Timeout;
    let lastClipboardContent = '';
    const checkClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText();
        console.log("Clipboard check - found text:", text ? `${text.length} characters` : "empty");
        if (text && text.trim() && text !== lastClipboardContent) {
          const isDuplicate = clips.some(clip => clip.content === text);
          console.log("Clipboard check - is duplicate:", isDuplicate);
          if (!isDuplicate) {
            lastClipboardContent = text;
            handleAutoSave(text);
          } else {
            console.log("Clipboard content already exists in clips");
          }
        } else {
          console.log("Clipboard check - no new content");
        }
      } catch (err) {
        console.log("Clipboard access denied:", err);
      }
    };
    const handleWindowBlur = () => {
      clipboardCheckInterval = setInterval(checkClipboard, 2000);
    };
    const handleWindowFocus = () => {
      if (clipboardCheckInterval) {
        clearInterval(clipboardCheckInterval);
      }
      checkClipboard();
    };
    const handlePaste = (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData("text");
      if (text && text.trim()) {
        handleAutoSave(text);
      }
    };
    const handleCopy = () => {
      const selection = window.getSelection()?.toString();
      if (selection && selection.trim()) {
        handleAutoSave(selection);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        setTimeout(() => {
          const selection = window.getSelection()?.toString();
          if (selection && selection.trim()) {
            handleAutoSave(selection);
          }
        }, 100);
      }
    };
    const initialClipboardCheck = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (navigator.permissions) {
          const permission = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });
          if (permission.state === 'granted' || permission.state === 'prompt') {
            checkClipboard();
          }
        } else {
          checkClipboard();
        }
      } catch (err) {
        console.log("Initial clipboard check failed:", err);
        setTimeout(() => {
          if (document.hasFocus()) {
            checkClipboard();
          }
        }, 2000);
      }
    };
    document.addEventListener("paste", handlePaste);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("blur", handleWindowBlur);
    initialClipboardCheck();
    if (document.hasFocus()) {
      setTimeout(checkClipboard, 100);
    }
    return () => {
      if (clipboardCheckInterval) {
        clearInterval(clipboardCheckInterval);
      }
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [clips, showLandingPage]);
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768;
      const isMobileDevice = window.innerWidth < 768;
      setIsMobile(isMobileDevice);
      if (!showLandingPage) {
        setIsLeftOpen(isDesktop);
        setIsRightOpen(isDesktop);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showLandingPage]);
  useEffect(() => {
    const isAnyModalOpen = showCategoryModal || showQuickSaveModal || showNewClipModal;
    document.body.style.overflow = isAnyModalOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCategoryModal, showQuickSaveModal, showNewClipModal]);
  useEffect(() => {
    if (!searchQuery.trim() && categoryBeforeSearch) {
      setSelectedCategory(categoryBeforeSearch);
    }
  }, [searchQuery, categoryBeforeSearch]);
  const prevSearchQuery = useRef(searchQuery);
  useEffect(() => {
    if (!prevSearchQuery.current.trim() && searchQuery.trim()) {
      setCategoryBeforeSearch(selectedCategory);
    }
    prevSearchQuery.current = searchQuery;
  }, [searchQuery, selectedCategory]);
  useEffect(() => {
    if (showLandingPage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "n":
            e.preventDefault();
            if (autoSaveTimer) {
              clearTimeout(autoSaveTimer);
              setAutoSaveTimer(null);
            }
            handleQuickSave();
            break;
          case "f":
            e.preventDefault();
            document.getElementById("search-input")?.focus();
            break;
          case "s":
            e.preventDefault();
            if (selectedClip && isEditing) {
              handleSaveEdit();
            }
            break;
          case "e":
            e.preventDefault();
            if (selectedClip && !isEditing) {
              handleEdit();
            }
            break;
          case "d":
            e.preventDefault();
            if (selectedClip) {
              handleDeleteClip(selectedClip.id);
            }
            break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedClip, isEditing, editContent, autoSaveTimer, showLandingPage]);
  const filteredClips = useMemo(() => {
    return clips
      .filter((clip) => {
        if (searchQuery.trim()) {
          return (
            clip.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            clip.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            clip.tags.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            )
          );
        }
        const matchesCategory =
          selectedCategory === "all" || clip.categoryId === selectedCategory;
        return matchesCategory;
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [clips, selectedCategory, searchQuery]);
  const handleQuickSave = () => {
    if (copiedText) {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
        setAutoSaveTimer(null);
      }
      setQuickSaveClicked(true);
      isModalOpenRef.current = true;
      setQuickSaveSelectedCategory("general");
      setShowQuickSaveModal(true);
    }
  };
  const handleQuickSaveConfirm = () => {
    if (copiedText) {
      const isDuplicate = clips.some(clip => clip.content === copiedText);
      if (isDuplicate) {
        showNotification("This content is already saved", "error");
        setQuickSaveClicked(false);
        isModalOpenRef.current = false;
        setShowQuickSaveModal(false);
        setQuickSaveSelectedCategory("general");
        setCopiedText("");
        if (autoSaveTimer) {
          clearTimeout(autoSaveTimer);
          setAutoSaveTimer(null);
        }
        return;
      }
      const newClip: Clip = {
        id: Date.now().toString(),
        content: copiedText,
        categoryId: quickSaveSelectedCategory,
        timestamp: Date.now(),
        tags: [],
        title:
          copiedText.substring(0, 50) + (copiedText.length > 50 ? "..." : ""),
      };
      const newClips = [newClip, ...clips];
      setClips(newClips);
      setSelectedClip(newClip);
      setSelectedCategory("all");
      saveToIndexedDB(newClips, categories);
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
        setAutoSaveTimer(null);
      }
      setCopiedText("");
      setQuickSaveClicked(false);
      isModalOpenRef.current = false;
      setShowQuickSaveModal(false);
      setQuickSaveSelectedCategory("general");
      showNotification("Clip saved successfully!", "success");
      if (isMobile) {
        setIsRightOpen(true);
        setIsLeftOpen(false);
      }
    }
  };
  const handleQuickSaveCancel = () => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
      setAutoSaveTimer(null);
    }
    setCopiedText("");
    setQuickSaveClicked(false);
    isModalOpenRef.current = false;
    setShowQuickSaveModal(false);
    setQuickSaveSelectedCategory("general");
  };
  const handleAutoSave = (text: string) => {
    console.log("Auto-save triggered with text:", text.substring(0, 50) + "...");
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }
    setCopiedText(text);
    setQuickSaveClicked(false);
    setShowQuickSave(false);
    setCountdown(0);
    const timer = setTimeout(() => {
      if (!isModalOpenRef.current) {
        setCopiedText("");
      }
    }, 10000);
    setAutoSaveTimer(timer);
    showNotification(`Clipboard content ready to save`, "success");
  };
  const handleCreateClip = () => {
    setNewClipSelectedCategory(selectedCategory === "all" ? "general" : selectedCategory);
    setShowNewClipModal(true);
  };
  const handleConfirmNewClip = () => {
    const newClip: Clip = {
      id: Date.now().toString(),
      content: "New clip content",
      categoryId: newClipSelectedCategory,
      timestamp: Date.now(),
      tags: [],
      title: "New Clip",
    };
    const newClips = [newClip, ...clips];
    setClips(newClips);
    setSelectedClip(newClip);
    setIsEditing(true);
    setEditContent(newClip.content);
    saveToIndexedDB(newClips, categories);
    setShowNewClipModal(false);
    if (isMobile) {
      setIsRightOpen(true);
      setIsLeftOpen(false);
    }
  };
  const handleCancelNewClip = () => {
    setShowNewClipModal(false);
    setNewClipSelectedCategory("general");
  };
  const handleDeleteClip = (clipId: string) => {
    const newClips = clips.filter((c) => c.id !== clipId);
    setClips(newClips);
    saveToIndexedDB(newClips, categories);
    if (selectedClip?.id === clipId) {
      setSelectedClip(null);
      if (isMobile) {
        setIsRightOpen(false);
      }
    }
    showNotification("Clip deleted", "success");
  };
  const handleEdit = () => {
    if (selectedClip) {
      setIsEditing(true);
      setEditContent(selectedClip.content);
    }
  };
  const handleSaveEdit = () => {
    if (selectedClip) {
      const newTitle = editContent.trim().split(/\s+/).slice(0, 5).join(" ");
      const updatedClips = clips.map((c) =>
        c.id === selectedClip.id
          ? {
            ...c,
            content: editContent,
            timestamp: Date.now(),
            title: newTitle,
          }
          : c
      );
      setClips(updatedClips);
      setSelectedClip({
        ...selectedClip,
        content: editContent,
        title: newTitle,
      });
      setIsEditing(false);
      saveToIndexedDB(updatedClips, categories);
      showNotification("Clip updated", "success");
    }
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent("");
  };
  const handleCopyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      showNotification("Copied to clipboard!", "success");
    } catch (err) {
      showNotification("Failed to copy", "error");
    }
  };
  const handleDragStart = (clip: Clip) => {
    setDraggedClip(clip);
  };
  const handleDragEnd = () => {
    setDraggedClip(null);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleDrop = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    if (draggedClip && draggedClip.categoryId !== categoryId) {
      const updatedClips = clips.map((c) =>
        c.id === draggedClip.id ? { ...c, categoryId } : c
      );
      setClips(updatedClips);
      saveToIndexedDB(updatedClips, categories);
      const targetCategory = categories.find(cat => cat.id === categoryId);
      const categoryName = targetCategory ? targetCategory.name : "Unknown";
      showNotification(`Clip moved to "${categoryName}"`, "success");
    }
  };
  const handleExport = () => {
    const data = {
      clips,
      categories,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clipboard-backup-${new Date().toISOString().split("T")[0]
      }.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification("Data exported successfully", "success");
  };
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.clips && data.categories) {
            setClips(data.clips);
            setCategories(data.categories);
            saveToIndexedDB(data.clips, data.categories);
            showNotification("Data imported successfully", "success");
          }
        } catch (err) {
          showNotification("Failed to import data", "error");
        }
      };
      reader.readAsText(file);
    }
  };
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes === 0 ? "Just now" : `${minutes}m ago`;
      }
      return `${hours}h ago`;
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  const LandingPage = () => (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-poppins mobile-safe-area">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/8 rounded-full blur-3xl" style={{ animation: 'float 20s ease-in-out infinite' }}></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-purple-400/8 to-blue-400/10 rounded-full blur-3xl" style={{ animation: 'floatReverse 25s ease-in-out infinite', animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-indigo-400/6 to-slate-400/5 rounded-full blur-2xl" style={{ animation: 'float 18s ease-in-out infinite', animationDelay: '5s' }}></div>
      </div>
      <div className="relative z-10 min-h-screen flex flex-col">
        <nav className="p-4 sm:p-6 lg:p-8 backdrop-blur-sm bg-slate-950/80 border-b border-slate-800/30">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <HiClipboard className="text-white text-lg sm:text-xl" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ClipVault
              </h1>
            </div>
            <button
              onClick={() => setShowLandingPage(false)}
              className="px-4 py-2 sm:px-6 sm:py-3 glass-morphism hover:bg-slate-800/60 text-blue-400 hover:text-blue-300 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer touch-target mobile-touch"
            >
              <span className="text-sm sm:text-base font-medium">Launch App</span>
            </button>
          </div>
        </nav>
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-12 sm:mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl mb-6 sm:mb-8 backdrop-blur-sm border border-blue-500/20 shadow-2xl fade-in-up">
                <HiClipboard className="text-3xl sm:text-4xl text-blue-400" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Smart Clipboard
                </span>
                <br />
                <span className="text-slate-100">Management</span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
                Effortlessly organize, search, and manage your clipboard history with intelligent categorization and seamless synchronization.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 max-w-4xl mx-auto">
              <div className="p-6 sm:p-8 glass-morphism rounded-2xl hover:border-blue-500/30 hover:shadow-blue-500/10 hover:shadow-xl transition-all duration-300 mobile-touch group text-center cursor-pointer">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-blue-500/30 transition-colors duration-300 shadow-lg mx-auto">
                  <HiClock className="text-2xl sm:text-3xl text-blue-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-slate-100">Auto-Save</h3>
                <p className="text-base sm:text-lg text-slate-400 leading-relaxed">Automatically captures and saves your clipboard content in real-time without interruption.</p>
              </div>
              <div className="p-6 sm:p-8 glass-morphism rounded-2xl hover:border-purple-500/30 hover:shadow-purple-500/10 hover:shadow-xl transition-all duration-300 mobile-touch group text-center cursor-pointer">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-purple-500/30 transition-colors duration-300 shadow-lg mx-auto">
                  <HiFolder className="text-2xl sm:text-3xl text-purple-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-slate-100">Smart Categories</h3>
                <p className="text-base sm:text-lg text-slate-400 leading-relaxed">Organize clips into custom categories with drag-and-drop simplicity and color coding.</p>
              </div>
              <div className="p-6 sm:p-8 glass-morphism rounded-2xl hover:border-green-500/30 hover:shadow-green-500/10 hover:shadow-xl transition-all duration-300 mobile-touch group text-center sm:col-span-2 lg:col-span-1 cursor-pointer">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-green-500/30 transition-colors duration-300 shadow-lg mx-auto">
                  <HiMagnifyingGlass className="text-2xl sm:text-3xl text-green-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-slate-100">Instant Search</h3>
                <p className="text-base sm:text-lg text-slate-400 leading-relaxed">Find any clip instantly with powerful search across content, titles, and tags.</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-6 sm:gap-8">
              <button
                onClick={() => setShowLandingPage(false)}
                className="w-full sm:w-auto px-8 py-4 sm:px-12 sm:py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 cursor-pointer touch-target mobile-touch"
              >
                Get Started Free
              </button>
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-slate-400">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm sm:text-base font-medium">No signup required</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-slate-600 rounded-full"></div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm sm:text-base font-medium">Works offline</span>
                </div>
              </div>
            </div>
          </div>
        </main>
        <footer className="mt-16 sm:mt-20 p-6 sm:p-8 lg:p-12 border-t border-slate-800/30 bg-slate-900/20 w-full">
          <div className="w-full">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                  <HiClipboard className="text-white text-sm" />
                </div>
                <span className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ClipVault
                </span>
              </div>
              <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-6">
                Built with modern web technologies for optimal performance and privacy.
              </p>
              <div className="pt-6 border-t border-slate-800/30">
                <p className="text-slate-500 text-xs sm:text-sm">
                  2024 ClipVault. All data stays on your device.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
  if (showLandingPage) {
    return (
      <div className="font-poppins">
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
            .font-poppins { font-family: 'Poppins', sans-serif; }
            html, body {
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
              text-size-adjust: 100%;
              -webkit-tap-highlight-color: transparent;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              33% { transform: translateY(-20px) rotate(1deg); }
              66% { transform: translateY(10px) rotate(-1deg); }
            }
                         @keyframes floatReverse {
               0%, 100% { transform: translateY(0px) rotate(0deg); }
               33% { transform: translateY(15px) rotate(-1deg); }
               66% { transform: translateY(-10px) rotate(1deg); }
             }
             @keyframes fadeInUp {
               from {
                 opacity: 0;
                 transform: translateY(30px);
               }
               to {
                 opacity: 1;
                 transform: translateY(0);
               }
             }
             .fade-in-up {
               animation: fadeInUp 0.6s ease-out;
             }
             .glass-morphism {
               background: rgba(15, 23, 42, 0.8);
               backdrop-filter: blur(16px);
               -webkit-backdrop-filter: blur(16px);
               border: 1px solid rgba(71, 85, 105, 0.3);
               box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
             }
             @media (max-width: 768px) {
               .mobile-touch:active {
                 transform: scale(0.98);
                 transition: transform 0.1s ease-out;
               }
               .mobile-safe-area {
                 padding-bottom: env(safe-area-inset-bottom);
                 padding-left: env(safe-area-inset-left);
                 padding-right: env(safe-area-inset-right);
               }
               .touch-target {
                 min-height: 44px;
                 min-width: 44px;
               }
             }
          `}
        </style>
        <LandingPage />
      </div>
    );
  }
  return (
    <div className="font-poppins bg-slate-950 text-slate-100 flex h-screen w-full overflow-hidden relative mobile-safe-area">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          .font-poppins { font-family: 'Poppins', sans-serif; }
          html, body {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            text-size-adjust: 100%;
            -webkit-tap-highlight-color: transparent;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-20px) rotate(1deg); }
            66% { transform: translateY(10px) rotate(-1deg); }
          }
          @keyframes floatReverse {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(15px) rotate(-1deg); }
            66% { transform: translateY(-10px) rotate(1deg); }
          }
          .glass-card:hover {
            background: rgba(30, 41, 59, 0.6);
            box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.15);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
          }
          @media (max-width: 768px) {
            .glass-card:hover {
              transform: none;
            }
            .mobile-touch:active {
              transform: scale(0.98);
              transition: transform 0.1s ease-out;
            }
            .mobile-safe-area {
              padding-bottom: env(safe-area-inset-bottom);
              padding-left: env(safe-area-inset-left);
              padding-right: env(safe-area-inset-right);
            }
            .touch-target {
              min-height: 44px;
              min-width: 44px;
            }
            .prevent-zoom {
              font-size: 16px;
            }
          }
          * {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          *::-webkit-scrollbar {
            display: none;
          }
          @keyframes slideInFromTop {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-in {
            animation: slideInFromTop 0.3s ease-out;
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}
      </style>
      {(isLeftOpen || isRightOpen) && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-10 cursor-pointer"
          onClick={() => {
            setIsLeftOpen(false);
            setIsRightOpen(false);
          }}
        />
      )}
      <div className={`w-72 sm:w-80 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 flex flex-col transition-transform duration-300 ${isLeftOpen ? 'translate-x-0' : '-translate-x-full'} md:relative absolute top-0 left-0 z-20 h-screen`}>
        <div className="p-4 sm:p-7 border-b border-slate-800/50 glass-morphism flex items-center justify-between min-h-[80px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <HiFolder className="text-xl text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-100">Categories</h2>
              <p className="text-xs text-slate-400 font-medium h-4.5">
                Organize your clips
              </p>
            </div>
          </div>
          <button
            className="md:hidden p-2 glass-morphism hover:bg-slate-700/80 text-slate-400 hover:text-slate-100 rounded-lg transition-all duration-300 cursor-pointer touch-target mobile-touch"
            onClick={() => setIsLeftOpen(false)}
            title="Close"
          >
            <HiXMark className="text-lg" />
          </button>
        </div>
        <div className="p-4 sm:p-6">
          <button
            onClick={handleOpenCategoryModal}
            className="w-full px-4 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-3 cursor-pointer touch-target mobile-touch"
          >
            <HiPlus className="text-lg" />
            <span className="text-sm sm:text-base">New Category</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
          <div
            className={`p-4 mb-3 rounded-xl cursor-pointer flex items-center gap-3 transition-all duration-300 group min-h-[72px] ${selectedCategory === "all"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                : "glass-morphism hover:bg-slate-800/60 text-slate-300 hover:text-slate-100"
              }`}
            onClick={() => {
              setSelectedCategory("all");
              if (!searchQuery.trim()) {
                setCategoryBeforeSearch("all");
              }
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#3B82F630' }}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: '#3B82F6' }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">All Clips</div>
              <div className="text-xs opacity-75 mt-0.5 truncate">View all your clips</div>
            </div>
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              {/* Empty spacer to match other categories */}
            </div>
            <div className={`text-xs px-3 py-1.5 rounded-lg font-semibold min-w-[40px] text-center flex items-center justify-center flex-shrink-0 ${selectedCategory === "all"
                ? "bg-white/20 text-white"
                : "bg-slate-700/60 text-slate-300"
              }`}>
              {clips.length}
            </div>
          </div>
          {categories.map((category) => (
            <div
              key={category.id}
              className={`p-4 mb-3 rounded-xl cursor-pointer flex items-center gap-3 transition-all duration-300 group min-h-[72px] ${selectedCategory === category.id
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "glass-morphism hover:bg-slate-800/60 text-slate-300 hover:text-slate-100"
                }`}
              onClick={() => {
                setSelectedCategory(category.id);
                if (!searchQuery.trim()) {
                  setCategoryBeforeSearch(category.id);
                }
              }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, category.id)}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${category.color}30` }}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="text-sm font-semibold truncate cursor-pointer"
                  onDoubleClick={() =>
                    handleStartEditCategory(category.id, category.name)
                  }
                >
                  {category.name}
                </div>
                <div className="text-xs opacity-75 mt-0.5 truncate">
                  {clips.filter((c) => c.categoryId === category.id).length} clips
                </div>
              </div>
              <button
                className={`w-8 h-8 p-2 rounded-lg transition-all flex-shrink-0 cursor-pointer flex items-center justify-center ${selectedCategory === category.id
                    ? "opacity-0 group-hover:opacity-100 hover:bg-white/20"
                    : "opacity-0 group-hover:opacity-100 hover:bg-slate-700/50"
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartEditCategory(category.id, category.name);
                }}
                title="Edit category"
              >
                <HiPencil className="text-sm" />
              </button>
              <div className={`text-xs px-3 py-1.5 rounded-lg font-semibold min-w-[40px] text-center flex items-center justify-center flex-shrink-0 ${selectedCategory === category.id
                  ? "bg-white/20 text-white"
                  : "bg-slate-700/60 text-slate-300"
                }`}>
                {clips.filter((c) => c.categoryId === category.id).length}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 sm:p-6 border-t border-slate-800/50 glass-morphism">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-400 mb-4">
              <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
                <HiArrowDownTray className="text-slate-400 text-sm" />
              </div>
              <div>
                <div className="font-medium">Data Management</div>
                <div className="text-xs text-slate-500">Backup and restore your clips</div>
              </div>
            </div>
            <div className="flex gap-3 w-full">
              <button
                className="flex-1 px-3 py-3 glass-morphism hover:bg-slate-700/80 border border-slate-700/50 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer touch-target mobile-touch text-green-400 hover:text-green-300 group"
                onClick={handleExport}
              >
                <HiArrowDownTray className="text-base group-hover:scale-110 transition-transform" />
                <span>Export</span>
              </button>
              <button
                className="flex-1 px-3 py-3 glass-morphism hover:bg-slate-700/80 border border-slate-700/50 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer touch-target mobile-touch text-blue-400 hover:text-blue-300 group"
                onClick={() => fileInputRef.current?.click()}
              >
                <HiArrowUpTray className="text-base group-hover:scale-110 transition-transform" />
                <span>Import</span>
              </button>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden min-w-0 h-screen">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400/8 to-purple-400/6 rounded-full blur-3xl" style={{ animation: 'float 20s ease-in-out infinite' }}></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-purple-400/6 to-blue-400/8 rounded-full blur-3xl" style={{ animation: 'floatReverse 25s ease-in-out infinite', animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-indigo-400/5 to-slate-400/4 rounded-full blur-2xl" style={{ animation: 'float 18s ease-in-out infinite', animationDelay: '5s' }}></div>
          <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-gradient-to-bl from-cyan-400/5 to-violet-400/6 rounded-full blur-3xl" style={{ animation: 'floatReverse 22s ease-in-out infinite', animationDelay: '7s' }}></div>
          <div className="absolute top-10 right-1/3 w-48 h-48 bg-gradient-to-tr from-slate-400/4 to-gray-400/3 rounded-full blur-2xl" style={{ animation: 'float 15s ease-in-out infinite', animationDelay: '3s' }}></div>
          <div className="absolute bottom-10 left-1/2 w-56 h-56 bg-gradient-to-bl from-emerald-400/4 to-teal-400/5 rounded-full blur-3xl" style={{ animation: 'floatReverse 28s ease-in-out infinite', animationDelay: '8s' }}></div>
        </div>
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm">
          <div className="absolute inset-0 opacity-3" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="relative z-10 p-3 sm:p-4 md:p-6 border-b border-slate-800/50 bg-slate-950/60 backdrop-blur-md min-h-[80px] flex items-center w-full">
          <div className="flex items-center justify-between w-full max-w-none">
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => setShowLandingPage(true)}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 text-slate-300 hover:text-slate-100 rounded-lg transition-all duration-300 cursor-pointer touch-target mobile-touch"
                title="Back to Home"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                  <HiClipboard className="text-white text-sm sm:text-base" />
                </div>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">ClipVault</span>
              </button>
            </div>
            <div className="flex-1 max-w-md mx-4 sm:mx-8 relative">
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg sm:text-xl" />
              <input
                id="search-input"
                type="text"
                className="w-full pl-10 pr-4 py-3 sm:py-3 bg-slate-900/60 border border-slate-800/30 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent backdrop-blur-sm prevent-zoom touch-target cursor-text"
                placeholder={isMobile ? "Search all clips..." : "Search all clips... (Ctrl+F)"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center flex-shrink-0">
              <button
                className={`px-4 md:px-6 py-3 text-white rounded-lg font-medium transition-all transform flex items-center justify-center gap-2 backdrop-blur-sm touch-target mobile-touch ${isEditing
                    ? "bg-blue-600/30 cursor-not-allowed"
                    : "bg-blue-600/70 hover:bg-blue-600/90 hover:-translate-y-0.5 cursor-pointer"
                  }`}
                onClick={() => {
                  if (isEditing) {
                    showNotification("Please save or cancel your current edit before creating a new clip", "error");
                    return;
                  }
                  handleCreateClip();
                }}
                disabled={isEditing}
              >
                <HiPlus className="text-lg sm:text-xl" />
                <span className="text-sm sm:text-base">{isMobile ? "New" : "New Clip"}</span>
              </button>
            </div>
          </div>
        </div>
        <div className="relative z-10 flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          {filteredClips.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center px-4">
              <HiClipboard className="text-4xl md:text-6xl mb-4 opacity-30" />
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-slate-400">No clips found</h3>
              <p className="text-sm max-w-sm">Create a new clip or copy some text to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3 sm:gap-4">
              {filteredClips.map((clip) => (
                <div
                  key={clip.id}
                  className={`glass-card bg-slate-900/60 border rounded-xl p-4 sm:p-5 transition-all transform backdrop-blur-sm mobile-touch touch-target relative h-36 sm:h-40 flex flex-col ${selectedClip?.id === clip.id
                      ? "border-blue-400/40 bg-slate-800/70 shadow-blue-400/10"
                      : "border-slate-800/30"
                    } ${draggedClip?.id === clip.id ? "opacity-50" : ""} ${isEditing && selectedClip?.id !== clip.id
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-slate-700/50"
                    }`}
                  onClick={() => {
                    if (isEditing) {
                      showNotification("Please save or cancel your current edit before selecting another clip", "error");
                      return;
                    }
                    const isSelecting = selectedClip?.id !== clip.id;
                    setSelectedClip(isSelecting ? clip : null);
                    if (isSelecting) {
                      setSelectedCategory(clip.categoryId);
                    }
                    if (isMobile) {
                      if (isSelecting) {
                        setIsRightOpen(true);
                        setIsLeftOpen(false);
                      } else {
                        setIsRightOpen(false);
                      }
                    }
                  }}
                  draggable={!isMobile}
                  onDragStart={!isMobile ? () => handleDragStart(clip) : undefined}
                  onDragEnd={!isMobile ? handleDragEnd : undefined}
                >
                  <div className="flex justify-between items-start mb-2 flex-shrink-0">
                    <h3 className="font-medium text-slate-100 truncate flex-1 text-sm sm:text-base">
                      {clip.title || "Untitled"}
                    </h3>
                    <span className="text-xs text-slate-400 flex items-center gap-1 ml-2 flex-shrink-0">
                      <HiClock className="text-xs sm:text-sm" />
                      <span className="hidden sm:inline">{formatDate(clip.timestamp)}</span>
                      <span className="sm:hidden">{formatDate(clip.timestamp).replace(/\s+ago$/, "")}</span>
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-300 line-clamp-3 mb-2 leading-relaxed break-words flex-grow overflow-hidden">
                    {clip.content}
                  </div>
                  {clip.tags.length > 0 ? (
                    <div className="flex gap-1 sm:gap-2 flex-wrap flex-shrink-0 pb-4">
                      {clip.tags.slice(0, isMobile ? 2 : 4).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                      {((isMobile && clip.tags.length > 2) || (!isMobile && clip.tags.length > 4)) && (
                        <span className="text-xs px-2 py-1 bg-slate-500/20 text-slate-400 rounded-md">
                          +{clip.tags.length - (isMobile ? 2 : 4)}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="pb-4"></div>
                  )}
                  {!isMobile && (
                    <div
                      className="absolute bottom-2 right-2 flex items-center justify-center w-6 h-6 text-slate-500 hover:text-slate-300 transition-colors duration-200 cursor-grab active:cursor-grabbing"
                      title="Drag and drop"
                    >
                      <HiSquares2X2 className="text-sm" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={`w-full sm:w-80 md:w-96 bg-slate-900 border-l border-slate-800 flex flex-col transition-transform duration-300 ${isRightOpen ? 'translate-x-0' : 'translate-x-full'} md:relative absolute top-0 right-0 z-20 h-screen max-w-sm sm:max-w-md md:max-w-none`}>
        <div className="p-4 sm:p-7.5 border-b border-slate-800/50 glass-morphism flex justify-between items-center min-h-[80px]">
          <div className="flex flex-col">
            <h2 className="text-lg sm:text-xl font-bold text-slate-100">Preview</h2>
          </div>
          <div className="flex gap-2">
            <button
              className="md:hidden p-2 glass-morphism hover:bg-slate-700/80 text-slate-400 hover:text-slate-100 rounded-lg transition-all duration-300 cursor-pointer touch-target mobile-touch"
              onClick={() => setIsRightOpen(false)}
              title="Close"
            >
              <HiXMark className="text-lg" />
            </button>
            {selectedClip && isEditing ? (
              <>
                <button
                  className="p-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer touch-target mobile-touch"
                  onClick={handleSaveEdit}
                  title="Save (Ctrl+S)"
                >
                  <HiCheck className="text-lg" />
                </button>
                <button
                  className="p-3 glass-morphism hover:bg-slate-700/80 text-slate-300 hover:text-slate-100 rounded-xl transition-all duration-300 cursor-pointer touch-target mobile-touch"
                  onClick={handleCancelEdit}
                  title="Cancel"
                >
                  <HiXMark className="text-lg" />
                </button>
              </>
            ) : (
              <>
                <button
                  className={`p-3 glass-morphism rounded-xl transition-all duration-300 touch-target mobile-touch group ${selectedClip && !isEditing
                      ? 'hover:bg-slate-700/80 text-blue-400 hover:text-blue-300 cursor-pointer'
                      : 'text-slate-600 cursor-not-allowed opacity-50'
                    }`}
                  onClick={selectedClip && !isEditing ? handleEdit : undefined}
                  disabled={!selectedClip || isEditing}
                  title={isMobile ? "Edit" : "Edit (Ctrl+E)"}
                >
                  <HiPencil className="text-lg group-hover:scale-110 transition-transform" />
                </button>
                <button
                  className={`p-3 glass-morphism rounded-xl transition-all duration-300 touch-target mobile-touch group ${selectedClip && !isEditing
                      ? 'hover:bg-slate-700/80 text-green-400 hover:text-green-300 cursor-pointer'
                      : 'text-slate-600 cursor-not-allowed opacity-50'
                    }`}
                  onClick={selectedClip && !isEditing ? () => handleCopyToClipboard(selectedClip.content) : undefined}
                  disabled={!selectedClip || isEditing}
                  title="Copy"
                >
                  <HiClipboard className="text-lg group-hover:scale-110 transition-transform" />
                </button>
                <button
                  className={`p-3 rounded-xl transition-all duration-300 transform touch-target mobile-touch ${selectedClip && !isEditing
                      ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white hover:scale-105 shadow-lg cursor-pointer'
                      : 'bg-slate-700/50 text-slate-600 cursor-not-allowed opacity-50'
                    }`}
                  onClick={selectedClip && !isEditing ? () => handleDeleteClip(selectedClip.id) : undefined}
                  disabled={!selectedClip || isEditing}
                  title={isMobile ? "Delete" : "Delete (Ctrl+D)"}
                >
                  <HiTrash className="text-lg" />
                </button>
              </>
            )}
          </div>
        </div>
        {selectedClip ? (
          <>
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-950/30">
              {isEditing ? (
                <div className="h-full">
                  <textarea
                    className="w-full h-full bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 text-slate-100 font-mono text-sm sm:text-base leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm prevent-zoom transition-all duration-300 cursor-text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    autoFocus={!isMobile}
                    placeholder="Start typing your content..."
                  />
                </div>
              ) : (
                <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 sm:p-6 min-h-full shadow-lg">
                  <pre className="text-sm sm:text-base text-slate-100 whitespace-pre-wrap break-words leading-relaxed font-mono selection:bg-blue-500/30">
                    {selectedClip.content}
                  </pre>
                </div>
              )}
            </div>
            <div className="p-4 sm:p-6 border-t border-slate-800/50 glass-morphism">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <HiClock className="text-blue-400 text-sm" />
                  </div>
                  <div>
                    <div className="font-medium">Created</div>
                    <div className="text-xs text-slate-400">
                      {new Date(selectedClip.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                    backgroundColor: `${categories.find((c) => c.id === selectedClip.categoryId)?.color || "#3B82F6"}20`
                  }}>
                    <HiFolder className="text-sm" style={{
                      color: categories.find((c) => c.id === selectedClip.categoryId)?.color || "#3B82F6"
                    }} />
                  </div>
                  <div>
                    <div className="font-medium">Category</div>
                    <div className="text-xs text-slate-400">
                      {categories.find((c) => c.id === selectedClip.categoryId)?.name || "Unknown"}
                    </div>
                  </div>
                </div>
                {selectedClip.tags.length > 0 && (
                  <div className="flex items-start gap-3 text-sm text-slate-300">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0">
                      <HiTag className="text-purple-400 text-sm" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium mb-2">Tags</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedClip.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-md text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center p-6 bg-slate-950/30">
              <div className="glass-morphism rounded-2xl p-8 sm:p-12 max-w-sm mx-auto">
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <HiDocumentText className="text-3xl text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-300">Select a clip to preview</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Click on any clip to view its contents and details in this panel
                </p>
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-slate-800/50 glass-morphism">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
                  <HiClock className="text-slate-500 text-sm" />
                </div>
                <div>
                  <div className="font-medium">Ready to preview</div>
                  <div className="text-xs text-slate-600">Select any clip to get started</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {copiedText && (
        <button
          className={`fixed ${isMobile ? 'bottom-20 right-4' : 'bottom-6 right-6'} z-[1000] bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer touch-target mobile-touch ${quickSaveClicked ? '' : 'animate-bounce'
            } px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 whitespace-nowrap`}
          onClick={handleQuickSave}
          title={`Save clipboard content (${copiedText.length} characters)`}
        >
          <HiClipboard className="text-base sm:text-lg md:text-xl group-hover:scale-110 transition-transform duration-300" />
          <span className="text-xs sm:text-sm md:text-base font-semibold">{isMobile ? 'Save' : 'Quick Save'}</span>
          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
            <HiPlus className="text-xs text-white" />
          </div>
        </button>
      )}
      {notification && (
        <div className={`fixed ${isMobile ? 'top-20 left-4 right-4' : 'top-6 right-6'} z-[1001] max-w-sm ${isMobile ? 'max-w-none' : ''} animate-in rounded-lg px-4 py-3 shadow-lg backdrop-blur-md border transform transition-all duration-300 ${notification.type === "success"
            ? "bg-emerald-950/90 border-emerald-500/30 shadow-emerald-500/20"
            : "bg-red-950/90 border-red-500/30 shadow-red-500/20"
          }`}>
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${notification.type === "success"
                ? "bg-emerald-500 text-white"
                : "bg-red-500 text-white"
              }`}>
              {notification.type === "success" ? (
                <HiCheck className="text-xs font-bold" />
              ) : (
                <HiXMark className="text-xs font-bold" />
              )}
            </div>
            <p className={`text-sm font-medium ${notification.type === "success"
                ? "text-emerald-100"
                : "text-red-100"
              }`}>
              {notification.message}
            </p>
          </div>
        </div>
      )}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-8">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md shadow-2xl mobile-safe-area">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full mb-4">
                <HiFolder className="text-2xl text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-100 mb-2">
                {isEditingCategory ? "Edit Category" : "Create New Category"}
              </h3>
              <p className="text-slate-400 text-sm">
                {isEditingCategory ? "Update your category details" : "Organize your clips with a new category"}
              </p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryDraft}
                  onChange={(e) => setCategoryDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                  placeholder="Enter category name..."
                  className="w-full px-3 sm:px-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm prevent-zoom touch-target cursor-text"
                  autoFocus={!isMobile}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Category Color
                </label>
                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                  {PREDEFINED_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl transition-all transform hover:scale-110 cursor-pointer touch-target mobile-touch ${selectedColor === color
                          ? "ring-2 sm:ring-3 ring-white/70 ring-offset-1 sm:ring-offset-2 ring-offset-slate-900/50 scale-105"
                          : "hover:shadow-lg"
                        }`}
                      style={{
                        backgroundColor: color,
                        boxShadow: selectedColor === color ? `0 0 20px ${color}40` : undefined
                      }}
                      title={`Select ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3 mt-6 sm:mt-8">
              <button
                onClick={handleCloseCategoryModal}
                className="flex-1 px-4 sm:px-6 py-3 bg-slate-700/60 hover:bg-slate-600/80 text-slate-100 rounded-xl font-medium transition-all transform hover:scale-[1.02] backdrop-blur-sm cursor-pointer touch-target mobile-touch"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                disabled={!categoryDraft.trim()}
                className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all transform hover:scale-[1.02] shadow-lg disabled:shadow-none cursor-pointer touch-target mobile-touch"
              >
                {isEditingCategory ? (isMobile ? "Save" : "Save Changes") : (isMobile ? "Create" : "Create Category")}
              </button>
            </div>
            <button
              onClick={handleCloseCategoryModal}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 sm:p-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all cursor-pointer touch-target mobile-touch"
            >
              <HiXMark className="text-lg sm:text-xl" />
            </button>
          </div>
        </div>
      )}
      {showQuickSaveModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4 md:p-8">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-lg shadow-2xl mobile-safe-area">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full mb-4">
                <HiClipboard className="text-2xl text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-100 mb-2">
                Quick Save Clipboard
              </h3>
              <p className="text-slate-400 text-sm">
                Preview and save your clipboard content
              </p>
            </div>
            <div className="mb-4 sm:mb-6">
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2 sm:mb-3">
                Category
              </label>
              <select
                value={quickSaveSelectedCategory}
                onChange={(e) => setQuickSaveSelectedCategory(e.target.value)}
                className="w-full px-3 sm:px-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm prevent-zoom touch-target cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id} className="bg-slate-800 text-slate-100">
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4 sm:mb-6">
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2 sm:mb-3">
                Content to Save ({copiedText.length} characters)
              </label>
              <div className="w-full max-h-48 sm:max-h-64 bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 sm:p-4 overflow-y-auto">
                <pre className="text-xs sm:text-sm text-slate-100 whitespace-pre-wrap break-words leading-relaxed">
                  {copiedText}
                </pre>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleQuickSaveCancel}
                className="flex-1 px-4 sm:px-6 py-3 bg-slate-700/60 hover:bg-slate-600/80 text-slate-100 rounded-xl font-medium transition-all transform hover:scale-[1.02] backdrop-blur-sm cursor-pointer touch-target mobile-touch"
              >
                Cancel
              </button>
              <button
                onClick={handleQuickSaveConfirm}
                className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-medium transition-all transform hover:scale-[1.02] shadow-lg cursor-pointer touch-target mobile-touch"
              >
                {isMobile ? "Save" : "Save Clip"}
              </button>
            </div>
            <button
              onClick={handleQuickSaveCancel}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 sm:p-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all cursor-pointer touch-target mobile-touch"
            >
              <HiXMark className="text-lg sm:text-xl" />
            </button>
          </div>
        </div>
      )}
      {showNewClipModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4 md:p-8">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md shadow-2xl mobile-safe-area">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full mb-4">
                <HiPlus className="text-2xl text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-100 mb-2">
                Create New Clip
              </h3>
              <p className="text-slate-400 text-sm">
                Choose a category for your new clip
              </p>
            </div>
            <div className="mb-6">
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-3">
                Category
              </label>
              <select
                value={newClipSelectedCategory}
                onChange={(e) => setNewClipSelectedCategory(e.target.value)}
                className="w-full px-3 sm:px-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm prevent-zoom touch-target cursor-pointer"
                autoFocus={!isMobile}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id} className="bg-slate-800 text-slate-100">
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleCancelNewClip}
                className="flex-1 px-4 sm:px-6 py-3 bg-slate-700/60 hover:bg-slate-600/80 text-slate-100 rounded-xl font-medium transition-all transform hover:scale-[1.02] backdrop-blur-sm cursor-pointer touch-target mobile-touch"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmNewClip}
                className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all transform hover:scale-[1.02] shadow-lg cursor-pointer touch-target mobile-touch"
              >
                Create
              </button>
            </div>
            <button
              onClick={handleCancelNewClip}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 sm:p-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all cursor-pointer touch-target mobile-touch"
            >
              <HiXMark className="text-lg sm:text-xl" />
            </button>
          </div>
        </div>
      )}
      {!isLeftOpen && !isRightOpen && (
        <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-slate-900/20 backdrop-blur-2xl border border-slate-700/30 rounded-2xl shadow-2xl mobile-safe-area">
          <div className="flex items-center justify-center px-2 py-2">
            <button
              onClick={toggleLeft}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 cursor-pointer touch-target mobile-touch ${isLeftOpen
                  ? 'bg-blue-500/30 text-blue-400 shadow-lg'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
            >
              <HiFolder className="text-lg mb-1" />
              <span className="text-xs font-medium">Categories</span>
            </button>
            <button
              onClick={() => {
                setIsLeftOpen(false);
                setIsRightOpen(false);
              }}
              className="flex flex-col items-center justify-center p-3 mx-2 rounded-xl text-slate-300 hover:text-slate-100 hover:bg-slate-800/30 transition-all duration-300 cursor-pointer touch-target mobile-touch"
            >
              <HiClipboard className="text-lg mb-1" />
              <span className="text-xs font-medium">Clips</span>
            </button>
            <button
              onClick={toggleRight}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 cursor-pointer touch-target mobile-touch ${isRightOpen
                  ? 'bg-purple-500/30 text-purple-400 shadow-lg'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
            >
              <HiDocumentText className="text-lg mb-1" />
              <span className="text-xs font-medium">Preview</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ClipboardManager;
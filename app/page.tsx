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
  HiDocumentText
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
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#F97316", // Orange
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#EC4899", // Pink
  "#6B7280", // Gray
];

const ClipboardManager: React.FC = () => {
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


  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);

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
  }, []);


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
    let clipboardCheckInterval: NodeJS.Timeout;
    let lastClipboardContent = '';

    const checkClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText();
        console.log("Clipboard check - found text:", text ? `${text.length} characters` : "empty");
        
        if (text && text.trim() && text !== lastClipboardContent) {
          // Check if this text is already in our clips to avoid duplicates
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
        // Try again after user interaction
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

    // Check clipboard immediately on page load
    initialClipboardCheck();

    // Also check if window is already focused
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
  }, [clips]);

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768;
      setIsLeftOpen(isDesktop);
      setIsRightOpen(isDesktop);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const isAnyModalOpen = showCategoryModal || showQuickSaveModal;
    document.body.style.overflow = isAnyModalOpen ? 'hidden' : 'unset';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCategoryModal, showQuickSaveModal]);

  // Keyboard shortcuts
  useEffect(() => {
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
          case "l":
            e.preventDefault();
            handleManualSave();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedClip, isEditing, editContent, autoSaveTimer]);

  // Filter clips based on search and category
  const filteredClips = useMemo(() => {
    return clips
      .filter((clip) => {
        const matchesCategory =
          selectedCategory === "all" || clip.categoryId === selectedCategory;
        const matchesSearch =
          searchQuery === "" ||
          clip.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          clip.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          clip.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          );

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [clips, selectedCategory, searchQuery]);

  const handleQuickSave = () => {
    if (copiedText) {
      setShowQuickSaveModal(true);
    }
  };

  const handleQuickSaveConfirm = () => {
    if (copiedText) {
      const isDuplicate = clips.some(clip => clip.content === copiedText);
      if (isDuplicate) {
        showNotification("This content is already saved", "error");
        setShowQuickSaveModal(false);
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
        categoryId: "general",
        timestamp: Date.now(),
        tags: [],
        title:
          copiedText.substring(0, 50) + (copiedText.length > 50 ? "..." : ""),
      };

      const newClips = [newClip, ...clips];
      setClips(newClips);
      saveToIndexedDB(newClips, categories);
      
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
        setAutoSaveTimer(null);
      }
      
      setCopiedText("");
      setShowQuickSaveModal(false);
      showNotification("Clip saved successfully!", "success");
    }
  };

  const handleQuickSaveCancel = () => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
      setAutoSaveTimer(null);
    }
    setCopiedText("");
    setShowQuickSaveModal(false);
  };

  const handleAutoSave = (text: string) => {
    console.log("Auto-save triggered with text:", text.substring(0, 50) + "...");
    
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
      clearInterval(autoSaveTimer);
    }

    setCopiedText(text);
    setShowQuickSave(false);
    setCountdown(0);
    
    const timer = setTimeout(() => {
      setCopiedText("");
    }, 10000);
    setAutoSaveTimer(timer);
    
    showNotification(`Clipboard content ready to save`, "success");
  };

  const handleManualSave = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        // Check if this text is already in our clips
        const isDuplicate = clips.some(clip => clip.content === text);
        if (isDuplicate) {
          showNotification("This content is already saved", "error");
          return;
        }
        
        // Save immediately without asking
        const newClip: Clip = {
          id: Date.now().toString(),
          content: text,
          categoryId: "general",
          timestamp: Date.now(),
          tags: [],
          title: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
        };

        const newClips = [newClip, ...clips];
        setClips(newClips);
        saveToIndexedDB(newClips, categories);
        showNotification("Clip saved successfully!", "success");
      } else {
        showNotification("No text found in clipboard", "error");
      }
    } catch (err) {
      showNotification("Cannot access clipboard. Try copying something first.", "error");
    }
  };

  const handleCancelAutoSave = () => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
      setAutoSaveTimer(null);
    }
    setShowQuickSave(false);
    setCountdown(0);
  };

  const handleSyncClipboard = async () => {
    await handleManualSave();
  };

  const handleCreateClip = () => {
    const newClip: Clip = {
      id: Date.now().toString(),
      content: "New clip content",
      categoryId: selectedCategory === "all" ? "general" : selectedCategory,
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
  };

  const handleDeleteClip = (clipId: string) => {
    const newClips = clips.filter((c) => c.id !== clipId);
    setClips(newClips);
    saveToIndexedDB(newClips, categories);
    if (selectedClip?.id === clipId) {
      setSelectedClip(null);
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
              title: newTitle, // ← update title here
            }
          : c
      );
      setClips(updatedClips);
      setSelectedClip({
        ...selectedClip,
        content: editContent,
        title: newTitle, // ← keep selectedClip in sync
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
      
      // Find the category name for the notification
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
    a.download = `clipboard-backup-${
      new Date().toISOString().split("T")[0]
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

  return (
    <div className="font-poppins bg-slate-950 text-slate-100 flex h-screen w-full overflow-hidden relative">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          .font-poppins { font-family: 'Poppins', sans-serif; }
          

          
          /* Background Animation */
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
          
          /* Glass morphism hover effects */
          .glass-card:hover {
            background: rgba(30, 41, 59, 0.6);
            box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.15);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
          }
          
          /* Hide scrollbars */
          * {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* Internet Explorer 10+ */
          }
          
          *::-webkit-scrollbar {
            display: none; /* WebKit */
          }
          
          /* Toast notification animations */
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
        `}
      </style>

      {/* Mobile Backdrop */}
      {(isLeftOpen || isRightOpen) && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-10"
          onClick={() => {
            setIsLeftOpen(false);
            setIsRightOpen(false);
          }}
        />
      )}

      {/* Left Pane - Categories */}
      <div className={`w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ${isLeftOpen ? 'translate-x-0' : '-translate-x-full'} md:relative absolute top-0 left-0 z-20 h-full`}>
        <div className="p-4 md:p-6 border-b border-slate-800 h-20 md:h-24 flex items-center">
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-3">
            <HiFolder className="text-xl" />
            Categories
          </h2>
        </div>
        
        <div className="p-4">
          <button
            onClick={handleOpenCategoryModal}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mb-4 cursor-pointer"
          >
            <HiPlus className="text-lg" />
            New Category
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <div
            className={`p-3 mb-2 rounded-lg cursor-pointer flex items-center gap-3 transition-all ${
              selectedCategory === "all" ? "bg-blue-600 text-white" : "hover:bg-slate-800"
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
            <span className="text-sm font-medium">All Clips</span>
            <span className="ml-auto text-xs bg-slate-700/80 text-slate-300 px-2.5 py-1 rounded-full font-medium min-w-[24px] text-center">{clips.length}</span>
          </div>
          
          {categories.map((category) => (
            <div
              key={category.id}
              className={`p-3 mb-2 rounded-lg cursor-pointer flex items-center gap-3 transition-all group ${
                selectedCategory === category.id ? "bg-blue-600 text-white" : "hover:bg-slate-800"
              }`}
              onClick={() => setSelectedCategory(category.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, category.id)}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: category.color }}
              />

              <span
                className="flex-1 text-sm font-medium truncate"
                onDoubleClick={() =>
                  handleStartEditCategory(category.id, category.name)
                }
              >
                {category.name}
              </span>

              <button
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-700 rounded transition-all flex-shrink-0 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartEditCategory(category.id, category.name);
                }}
                title="Edit category"
              >
                <HiPencil className="text-sm" />
              </button>

              <span className="text-xs bg-slate-700/80 text-slate-300 px-2.5 py-1 rounded-full font-medium min-w-[24px] text-center flex-shrink-0">
                {clips.filter((c) => c.categoryId === category.id).length}
              </span>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-slate-800 h-20 md:h-24 flex items-center">
          <div className="flex gap-2 w-full">
            <button 
              className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              onClick={handleExport}
            >
              <HiArrowDownTray className="text-lg" />
              Export
            </button>
            <button
              className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <HiArrowUpTray className="text-lg" />
              Import
            </button>
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

      {/* Center Pane - Clips Grid */}
      <div className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden min-w-0">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400/8 to-purple-400/6 rounded-full blur-3xl" style={{ animation: 'float 20s ease-in-out infinite' }}></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-purple-400/6 to-blue-400/8 rounded-full blur-3xl" style={{ animation: 'floatReverse 25s ease-in-out infinite', animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-indigo-400/5 to-slate-400/4 rounded-full blur-2xl" style={{ animation: 'float 18s ease-in-out infinite', animationDelay: '5s' }}></div>
          <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-gradient-to-bl from-cyan-400/5 to-violet-400/6 rounded-full blur-3xl" style={{ animation: 'floatReverse 22s ease-in-out infinite', animationDelay: '7s' }}></div>
          <div className="absolute top-10 right-1/3 w-48 h-48 bg-gradient-to-tr from-slate-400/4 to-gray-400/3 rounded-full blur-2xl" style={{ animation: 'float 15s ease-in-out infinite', animationDelay: '3s' }}></div>
          <div className="absolute bottom-10 left-1/2 w-56 h-56 bg-gradient-to-bl from-emerald-400/4 to-teal-400/5 rounded-full blur-3xl" style={{ animation: 'floatReverse 28s ease-in-out infinite', animationDelay: '8s' }}></div>
        </div>
        
        {/* Blurred Overlay with Grid Pattern */}
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm">
          <div className="absolute inset-0 opacity-3" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Mobile Toggle Buttons */}
        <button 
          className="md:hidden fixed top-4 left-4 z-30 p-3 bg-slate-800/90 hover:bg-slate-700 rounded-xl transition-colors shadow-lg backdrop-blur-sm cursor-pointer"
          onClick={toggleLeft}
        >
          <HiChevronLeft className="text-xl" />
        </button>
        
        <div className="relative z-10 p-4 md:p-6 border-b border-slate-800/30 bg-slate-950/60 backdrop-blur-md h-20 md:h-24 flex items-center">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex-1 relative">
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
              <input
                id="search-input"
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-800/30 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent backdrop-blur-sm"
                placeholder="Search clips... (Ctrl+F)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <button 
                className={`flex-1 sm:flex-initial px-4 md:px-6 py-3 text-white rounded-lg font-medium transition-all transform flex items-center justify-center gap-2 backdrop-blur-sm ${
                  isEditing 
                    ? "bg-blue-600/30 cursor-not-allowed" 
                    : "bg-blue-600/70 hover:bg-blue-600/90 hover:-translate-y-0.5"
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
                <HiPlus className="text-xl" />
                <span className="hidden sm:inline">New Clip</span>
              </button>
              <button 
                className="flex-1 sm:flex-initial px-4 py-3 bg-green-600/70 hover:bg-green-600/90 text-white rounded-lg font-medium transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 backdrop-blur-sm"
                onClick={handleManualSave}
                title="Auto-save clipboard content"
              >
                <HiClipboard className="text-xl" />
                <span className="hidden sm:inline">Auto-Save</span>
              </button>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto p-4 md:p-6">
          {filteredClips.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center px-4">
              <HiClipboard className="text-4xl md:text-6xl mb-4 opacity-30" />
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-slate-400">No clips found</h3>
              <p className="text-sm max-w-sm">Create a new clip or copy some text to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredClips.map((clip) => (
                <div
                  key={clip.id}
                  className={`glass-card bg-slate-900/60 border rounded-xl p-5 transition-all transform backdrop-blur-sm ${
                    selectedClip?.id === clip.id 
                      ? "border-blue-400/40 bg-slate-800/70 shadow-blue-400/10" 
                      : "border-slate-800/30"
                  } ${draggedClip?.id === clip.id ? "opacity-50" : ""} ${
                    isEditing && selectedClip?.id !== clip.id
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-slate-700/50"
                  }`}
                  onClick={() => {
                    if (isEditing) {
                      showNotification("Please save or cancel your current edit before selecting another clip", "error");
                      return;
                    }
                    setSelectedClip(selectedClip?.id === clip.id ? null : clip);
                  }}
                  draggable
                  onDragStart={() => handleDragStart(clip)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-slate-100 truncate flex-1 text-sm md:text-base">
                      {clip.title || "Untitled"}
                    </h3>
                    <span className="text-xs text-slate-400 flex items-center gap-1 ml-2 flex-shrink-0">
                      <HiClock className="text-sm" />
                      {formatDate(clip.timestamp)}
                    </span>
                  </div>
                  
                  <div className="text-xs md:text-sm text-slate-300 line-clamp-3 mb-3 leading-relaxed break-words">
                    {clip.content}
                  </div>
                  
                  {clip.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {clip.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button 
          className="md:hidden fixed top-4 right-4 z-30 p-3 bg-slate-800/90 hover:bg-slate-700 rounded-xl transition-colors shadow-lg backdrop-blur-sm cursor-pointer"
          onClick={toggleRight}
        >
          <HiChevronRight className="text-xl" />
        </button>
      </div>

      {/* Right Pane - Preview/Edit */}
      <div className={`w-full md:w-96 bg-slate-900 border-l border-slate-800 flex flex-col transition-transform duration-300 ${isRightOpen ? 'translate-x-0' : 'translate-x-full'} md:relative absolute top-0 right-0 z-20 h-full max-w-md md:max-w-none`}>
        {selectedClip ? (
          <>
            <div className="p-4 md:p-6 border-b border-slate-800 h-20 md:h-24 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-100">Preview</h2>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors cursor-pointer"
                      onClick={handleSaveEdit}
                      title="Save (Ctrl+S)"
                    >
                      <HiCheck className="text-xl" />
                    </button>
                    <button
                      className="p-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg transition-colors cursor-pointer"
                      onClick={handleCancelEdit}
                      title="Cancel"
                    >
                      <HiXMark className="text-xl" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="p-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg transition-colors cursor-pointer"
                      onClick={handleEdit}
                      title="Edit (Ctrl+E)"
                    >
                      <HiPencil className="text-xl" />
                    </button>
                    <button
                      className="p-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg transition-colors cursor-pointer"
                      onClick={() => handleCopyToClipboard(selectedClip.content)}
                      title="Copy"
                    >
                      <HiClipboard className="text-xl" />
                    </button>
                    <button
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
                      onClick={() => handleDeleteClip(selectedClip.id)}
                      title="Delete (Ctrl+D)"
                    >
                      <HiTrash className="text-xl" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              {isEditing ? (
                <textarea
                  className="w-full h-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-100 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  autoFocus
                />
              ) : (
                <pre className="text-sm text-slate-100 whitespace-pre-wrap break-words leading-relaxed">
                  {selectedClip.content}
                </pre>
              )}
            </div>

            <div className="p-4 md:p-6 border-t border-slate-800 h-20 md:h-24 flex flex-col justify-center">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs md:text-sm text-slate-400">
                  <HiClock className="text-sm md:text-lg" />
                  Created: {new Date(selectedClip.timestamp).toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-slate-400">
                  <HiFolder className="text-sm md:text-lg" />
                  Category:{" "}
                  {categories.find((c) => c.id === selectedClip.categoryId)?.name || "Unknown"}
                </div>
                {selectedClip.tags.length > 0 && (
                  <div className="flex items-center gap-2 text-xs md:text-sm text-slate-400 truncate">
                    <HiTag className="text-sm md:text-lg flex-shrink-0" />
                    <span className="truncate">Tags: {selectedClip.tags.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 md:p-6 border-b border-slate-800 h-20 md:h-24 flex items-center">
              <h2 className="text-lg font-semibold text-slate-100">Preview</h2>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center p-6">
              <HiDocumentText className="text-5xl mb-4 opacity-30" />
              <h3 className="text-xl font-semibold mb-2 text-slate-400">Select a clip to preview</h3>
              <p className="text-sm">Click on any clip to view its contents and details</p>
            </div>
            <div className="p-4 md:p-6 border-t border-slate-800 h-20 md:h-24 flex items-center">
              <div className="text-xs md:text-sm text-slate-500">
                No clip selected
              </div>
            </div>
          </>
        )}
      </div>

      {/* Floating Quick Save Button - Only show when clipboard content is available */}
      {copiedText && (
        <button
          className="fixed bottom-6 right-6 z-[1000] bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer animate-bounce px-4 py-3 md:px-6 md:py-4 whitespace-nowrap"
          onClick={handleQuickSave}
          title={`Save clipboard content (${copiedText.length} characters)`}
        >
          <HiClipboard className="text-lg md:text-xl group-hover:scale-110 transition-transform duration-300" />
          <span className="text-sm md:text-base font-semibold">Quick Save</span>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
            <HiPlus className="text-xs text-white" />
          </div>
        </button>
      )}





      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[1001] max-w-sm animate-in ${
          notification.type === "success" 
            ? "bg-gradient-to-r from-green-500/90 to-emerald-500/90 border-green-400/30" 
            : "bg-gradient-to-r from-red-500/90 to-rose-500/90 border-red-400/30"
        } backdrop-blur-xl border rounded-xl p-4 shadow-2xl text-white`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              notification.type === "success" 
                ? "bg-green-400/20" 
                : "bg-red-400/20"
            }`}>
              {notification.type === "success" ? (
                <HiCheck className="text-lg text-green-200" />
              ) : (
                <HiXMark className="text-lg text-red-200" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold leading-tight">
                {notification.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-8">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl">
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
                  className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Category Color
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {PREDEFINED_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-xl transition-all transform hover:scale-110 cursor-pointer ${
                        selectedColor === color 
                          ? "ring-3 ring-white/70 ring-offset-2 ring-offset-slate-900/50 scale-105" 
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
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={handleCloseCategoryModal}
                className="flex-1 px-6 py-3 bg-slate-700/60 hover:bg-slate-600/80 text-slate-100 rounded-xl font-medium transition-all transform hover:scale-[1.02] backdrop-blur-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                disabled={!categoryDraft.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all transform hover:scale-[1.02] shadow-lg disabled:shadow-none cursor-pointer"
              >
                {isEditingCategory ? "Save Changes" : "Create Category"}
              </button>
            </div>
            
            {/* Close button */}
            <button
              onClick={handleCloseCategoryModal}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all cursor-pointer"
            >
              <HiXMark className="text-xl" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Save Modal */}
      {showQuickSaveModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-8">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl">
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
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Content to Save ({copiedText.length} characters)
              </label>
              <div className="w-full max-h-64 bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 overflow-y-auto">
                <pre className="text-sm text-slate-100 whitespace-pre-wrap break-words leading-relaxed">
                  {copiedText}
                </pre>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleQuickSaveCancel}
                className="flex-1 px-6 py-3 bg-slate-700/60 hover:bg-slate-600/80 text-slate-100 rounded-xl font-medium transition-all transform hover:scale-[1.02] backdrop-blur-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleQuickSaveConfirm}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-medium transition-all transform hover:scale-[1.02] shadow-lg cursor-pointer"
              >
                Save Clip
              </button>
            </div>
            
            <button
              onClick={handleQuickSaveCancel}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all cursor-pointer"
            >
              <HiXMark className="text-xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClipboardManager;
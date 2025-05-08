"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  Star,
  Copy,
  Trash2,
  Edit,
  Clock,
  X,
  Check,
  ChevronDown,
  Clipboard,
  Info,
  SlidersHorizontal,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Define types
interface Snippet {
  id: string;
  title: string;
  content: string;
  description?: string;
  timestamp: number;
  categoryId: string | null;
  isFavorite: boolean;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

// Utility functions
const generateId = () => Math.random().toString(36).substring(2, 9);
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
};

// Sample data
const initialCategories: Category[] = [
  { id: "cat1", name: "JavaScript", color: "bg-yellow-500" },
  { id: "cat2", name: "React", color: "bg-blue-500" },
  { id: "cat3", name: "CSS", color: "bg-pink-500" },
  { id: "cat4", name: "Node.js", color: "bg-green-500" },
];

const initialSnippets: Snippet[] = [
  {
    id: "snip1",
    title: "Managing State in React with useState Hook",
    content: `import { useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}`,
    description:
      "A full example demonstrating how to manage state using React's useState hook, including a button to increment a counter.",
    timestamp: Date.now() - 3600000 * 24 * 2,
    categoryId: "cat2",
    isFavorite: true,
  },
  {
    id: "snip2",
    title: "Centering Elements Using CSS Flexbox",
    content: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.child {
  width: 200px;
  height: 100px;
  background-color: #4CAF50;
  text-align: center;
  line-height: 100px;
  color: white;
  font-size: 20px;
}`,
    description:
      "CSS snippet to perfectly center an element horizontally and vertically using Flexbox, including full container and child element setup.",
    timestamp: Date.now() - 3600000 * 12,
    categoryId: "cat3",
    isFavorite: false,
  },
  {
    id: "snip5",
    title: "Fetching Data from an API with async/await in JavaScript",
    content: `async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }
  
  fetchData('https://api.example.com/data');`,
    description:
      "Demonstrates how to perform an API request using async/await syntax in JavaScript, including basic error handling.",
    timestamp: Date.now() - 3600000 * 5,
    categoryId: "cat1",
    isFavorite: true,
  },
  {
    id: "snip7",
    title: "Creating a Simple Express.js Server",
    content: `const express = require('express');
  const app = express();
  const PORT = 3000;
  
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  
  app.listen(PORT, () => {
    console.log(\`Server is running on http://localhost:\${PORT}\`);
  });`,
    description:
      "A basic example of setting up an Express.js server in Node.js to handle HTTP GET requests on the root URL.",
    timestamp: Date.now() - 3600000 * 36,
    categoryId: "cat4",
    isFavorite: true,
  },
  {
    id: "snip8",
    title: "Debouncing Input Events in JavaScript",
    content: `function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
  
  const handleInput = debounce((event) => {
    console.log('Input value:', event.target.value);
  }, 300);
  
  document.getElementById('searchInput').addEventListener('input', handleInput);`,
    description:
      "Shows how to debounce input event handling in JavaScript to optimize performance and avoid excessive function calls.",
    timestamp: Date.now() - 3600000 * 8,
    categoryId: "cat1",
    isFavorite: false,
  },
];

const ClipboardManager = () => {
  // States
  const [snippets, setSnippets] = useState<Snippet[]>(() => {
    const saved = window.localStorage.getItem("snippets");
    return saved ? JSON.parse(saved) : initialSnippets;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem("categories");
    return saved ? JSON.parse(saved) : initialCategories;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("bg-blue-500");
  const [activeSnippet, setActiveSnippet] = useState<Snippet | null>(null);
  const [showInlineCategoryForm, setShowInlineCategoryForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit"); // Add this with other state variables
  const [editActiveTab, setEditActiveTab] = useState<"edit" | "preview">(
    "edit"
  );
  const [newSnippet, setNewSnippet] = useState<Partial<Snippet>>({
    title: "",
    content: "",
    description: "",
    categoryId: null,
    isFavorite: false,
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("snippets", JSON.stringify(snippets));
  }, [snippets]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Reset copy indicator after 2 seconds
  useEffect(() => {
    if (copiedId) {
      const timer = setTimeout(() => {
        setCopiedId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedId]);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + F for search
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key === "f" &&
        !showAddForm &&
        !showEditForm
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // Esc to close modals
      if (e.key === "Escape") {
        if (showAddForm) setShowAddForm(false);
        if (showEditForm) setShowEditForm(false);
        if (showAddCategory) setShowAddCategory(false);
      }

      // Ctrl/Cmd + N for new snippet
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        if (!showAddForm && !showEditForm) {
          setShowAddForm(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showAddForm, showEditForm, showAddCategory]);

  // Prevent background scrolling when a modal is open
  useEffect(() => {
    const isModalOpen = showAddForm || showEditForm || showViewModal || showAddCategory;
    
    if (isModalOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [showAddForm, showEditForm, showViewModal, showAddCategory]);

  // Filter snippets based on search term and selected filters
  const filteredSnippets = snippets
    .filter((snippet) => {
      const matchesSearch =
        searchTerm === "" ||
        snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (snippet.description &&
          snippet.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (snippet.categoryId &&
          categories
            .find((c) => c.id === snippet.categoryId)
            ?.name.toLowerCase()
            .includes(searchTerm.toLowerCase()));

      const matchesCategory =
        currentFilter === null || snippet.categoryId === currentFilter;
      const matchesFavorites = !showFavoritesOnly || snippet.isFavorite;

      return matchesSearch && matchesCategory && matchesFavorites;
    })
    .sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return b.timestamp - a.timestamp;
    });

  // Handlers
  const handleAddSnippet = () => {
    if (!newSnippet.title || !newSnippet.content) {
      setNotification({
        message: "Title and content are required",
        type: "error",
      });
      return;
    }

    const snippet: Snippet = {
      id: generateId(),
      title: newSnippet.title,
      content: newSnippet.content,
      description: newSnippet.description || "",
      timestamp: Date.now(),
      categoryId: newSnippet.categoryId || null,
      isFavorite: newSnippet.isFavorite || false,
    };

    setSnippets([snippet, ...snippets]);
    setNewSnippet({
      title: "",
      content: "",
      description: "",
      categoryId: null,
      isFavorite: false,
    });
    setShowAddForm(false);
    setNotification({ message: "Snippet added successfully", type: "success" });
  };

  // Add this function with other handlers
  const handleInlineAddCategory = () => {
    if (!newCategoryName.trim()) {
      setNotification({ message: "Category name is required", type: "error" });
      return;
    }

    const newCategory = {
      id: generateId(),
      name: newCategoryName.trim(),
      color: newCategoryColor,
    };

    // Add the new category and select it for the snippet
    setCategories([...categories, newCategory]);
    setNewSnippet({
      ...newSnippet,
      categoryId: newCategory.id,
    });

    // Clean up
    setNewCategoryName("");
    setNewCategoryColor("bg-blue-500");
    setShowInlineCategoryForm(false);
    setNotification({
      message: "Category added successfully",
      type: "success",
    });
  };

  const handleEditSnippet = () => {
    if (!activeSnippet || !activeSnippet.title || !activeSnippet.content) {
      setNotification({
        message: "Title and content are required",
        type: "error",
      });
      return;
    }

    setSnippets(
      snippets.map((s) => (s.id === activeSnippet.id ? activeSnippet : s))
    );
    setShowEditForm(false);
    setActiveSnippet(null);
    setNotification({
      message: "Snippet updated successfully",
      type: "success",
    });
  };

  const handleDeleteSnippet = (id: string) => {
    setSnippets(snippets.filter((s) => s.id !== id));
    setNotification({
      message: "Snippet deleted successfully",
      type: "success",
    });
  };

  const handleFavoriteToggle = (id: string) => {
    setSnippets(
      snippets.map((s) =>
        s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
      )
    );
  };

  const handleCopyToClipboard = (content: string, id: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopiedId(id);
        setNotification({ message: "Copied to clipboard", type: "success" });
      })
      .catch(() => {
        setNotification({
          message: "Failed to copy to clipboard",
          type: "error",
        });
      });
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      setNotification({ message: "Category name is required", type: "error" });
      return;
    }

    const newCategory: Category = {
      id: generateId(),
      name: newCategoryName.trim(),
      color: newCategoryColor,
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    setNewCategoryColor("bg-blue-500");
    setShowAddCategory(false);
    setNotification({
      message: "Category added successfully",
      type: "success",
    });
  };

  const handleDeleteCategory = (id: string) => {
    // Update snippets that used this category
    setSnippets(
      snippets.map((s) =>
        s.categoryId === id ? { ...s, categoryId: null } : s
      )
    );

    // Remove the category
    setCategories(categories.filter((c) => c.id !== id));

    // Reset filter if it was set to this category
    if (currentFilter === id) {
      setCurrentFilter(null);
    }
  };

  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-sky-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-fuchsia-500",
    "bg-pink-500",
    "bg-rose-500",
  ];

  // Determine theme classes
  const themeClasses = darkMode
    ? "bg-gray-900 text-gray-100"
    : "bg-gray-50 text-gray-900";

  const cardBgClasses = darkMode
    ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
    : "bg-white border-gray-200 hover:bg-gray-50";

  const inputBgClasses = darkMode
    ? "bg-gray-800 border-gray-700 text-gray-200 focus:border-indigo-500"
    : "bg-white border-gray-300 text-gray-700 focus:border-indigo-500";

  const buttonClasses =
    "px-4 py-2 rounded-md font-medium transition-colors duration-200 cursor-pointer";
  const primaryButtonClasses = `${buttonClasses} bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`;
  const secondaryButtonClasses = darkMode
    ? `${buttonClasses} bg-gray-700 text-gray-200 hover:bg-gray-600`
    : `${buttonClasses} bg-gray-200 text-gray-700 hover:bg-gray-300`;

  const dangerButtonClasses = `${buttonClasses} bg-red-600 text-white hover:bg-red-700`;

  const modalBgClasses = darkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }
  return (
    <div
      className={`min-h-screen p-4 md:p-6 transition-colors duration-300 ${themeClasses}`}
      style={{ fontFamily: "var(--font-roboto), sans-serif" }}
    >
      {/* Header */}
      <div className="mx-auto mb-6 max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
          <a href="#">
            <div className="flex items-center gap-2">
              <Clipboard className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold">DevClipboard</h1>
            </div>
          </a>

          <div className="flex items-center w-full gap-3 sm:w-auto">
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative flex-1 sm:w-64"
            >
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-500" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search snippets..."
                className={`pl-10 pr-4 py-2 w-full rounded-md border ${inputBgClasses} focus:outline-none`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <kbd
                  className={`hidden sm:flex px-2 py-0.5 text-xs rounded ${
                    darkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  Ctrl+F
                </kbd>
              </div>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${buttonClasses} py-3 ${
                darkMode
                  ? "bg-gray-800 text-gray-200"
                  : "bg-gray-200 text-gray-700"
              } rounded-md p-2`}
              onClick={() => setDarkMode(!darkMode)}
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </motion.button>

            <button
              className="p-3 bg-gray-200 rounded sm:hidden dark:bg-gray-800 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile filters */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 overflow-hidden sm:hidden"
            >
              <div className="flex flex-col gap-3 p-3 border border-gray-200 rounded-md dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Filters</p>
                  <button
                    className="cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Show Favorites Only</span>
                  <button
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                      showFavoritesOnly
                        ? "bg-indigo-600"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  >
                    <motion.div
                      initial={false}
                      animate={{ x: showFavoritesOnly ? 24 : 0 }}
                      className="w-4 h-4 bg-white rounded-full shadow-md"
                    />
                  </button>
                </div>
                <div>
                  <p className="mb-2">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={`px-3 py-1 rounded-md text-sm cursor-pointer ${
                        currentFilter === null
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                      onClick={() => setCurrentFilter(null)}
                    >
                      All
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 cursor-pointer ${
                          currentFilter === category.id
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                        onClick={() => setCurrentFilter(category.id)}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${category.color}`}
                        ></span>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="items-center hidden mb-6 space-x-4 sm:flex">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Categories:</span>
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 cursor-pointer ${
                currentFilter === null
                  ? "bg-indigo-600 text-white"
                  : darkMode
                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setCurrentFilter(null)}
            >
              All
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 flex items-center gap-1 cursor-pointer ${
                  currentFilter === category.id
                    ? "bg-indigo-600 text-white"
                    : darkMode
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setCurrentFilter(category.id)}
              >
                <div className={`w-2 h-2 rounded-full ${category.color}`}></div>
                {category.name}
              </button>
            ))}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-1 rounded-md cursor-pointer ${
                darkMode
                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setShowAddCategory(true)}
              title="Add Category"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="flex items-center">
            <button
              className="flex items-center space-x-2 text-sm cursor-pointer"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              <div
                className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                  showFavoritesOnly
                    ? "bg-indigo-600"
                    : darkMode
                    ? "bg-gray-700"
                    : "bg-gray-300"
                } relative`}
              >
                <motion.div
                  className="absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow-sm"
                  animate={{ x: showFavoritesOnly ? 20 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </div>
              <span>Show Favorites Only</span>
            </button>
          </div>
        </div>
      </div>
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden mb-8">
          <div
            className={`py-8 px-4 sm:px-6 lg:px-8 rounded-xl ${
              darkMode ? "bg-gray-800/50" : "bg-indigo-50"
            }`}
          >
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center gap-6 w-full">
                <div className="flex-1 w-full max-w-full">
                  <div className="flex items-center mb-4">
                    <Clipboard className="w-10 h-10 text-indigo-600 mr-3" />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      DevClipboard
                    </h1>
                  </div>
                  <p
                    className={`text-lg mb-6 ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Your personal library for storing, organizing, and
                    retrieving code snippets. Save time by reusing your most
                    valuable code.
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`${primaryButtonClasses} flex items-center gap-2 px-5 py-2.5`}
                      onClick={() => setShowAddForm(true)}
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add New Snippet</span>
                    </motion.button>
                    <div className="hidden md:flex items-center">
                      <span
                        className={`mr-2 text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <span>Press</span>{" "}
                        <kbd
                          className={`px-2 py-1 text-xs rounded ${
                            darkMode ? "bg-gray-700" : "bg-gray-200"
                          }`}
                        >
                          Ctrl+N
                        </kbd>{" "}
                        <span>
                          for new snippet
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Abstract decorative background elements */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 hidden md:block">
              <div
                className={`w-64 h-64 rounded-full ${
                  darkMode ? "bg-indigo-900/10" : "bg-indigo-200/50"
                }`}
              ></div>
            </div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 hidden md:block">
              <div
                className={`w-40 h-40 rounded-full ${
                  darkMode ? "bg-indigo-900/10" : "bg-indigo-200/50"
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="mx-auto max-w-7xl">
        {filteredSnippets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`rounded-lg p-10 text-center border ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <Clipboard className="w-full h-full" />
            </div>
            <h3 className="mb-2 text-lg font-medium">No snippets found</h3>
            <p
              className={`${darkMode ? "text-gray-400" : "text-gray-500"} mb-4`}
            >
              {searchTerm || currentFilter || showFavoritesOnly
                ? "No snippets match your current filters"
                : "Add your first snippet to get started"}
            </p>
            <button
              className={`${primaryButtonClasses}`}
              onClick={() => {
                if (searchTerm || currentFilter || showFavoritesOnly) {
                  setSearchTerm("");
                  setCurrentFilter(null);
                  setShowFavoritesOnly(false);
                } else {
                  setShowAddForm(true);
                }
              }}
            >
              {searchTerm || currentFilter || showFavoritesOnly
                ? "Clear Filters"
                : "Add Snippet"}
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredSnippets.map((snippet, index) => (
              <motion.div
                key={snippet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow ${cardBgClasses} flex flex-col h-full`}
              >
                <div className="p-4 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      onClick={() => {
                        setActiveSnippet(snippet);
                        setShowViewModal(true);
                      }}
                      className="text-lg font-medium cursor-pointer line-clamp-1"
                    >
                      {snippet.title}
                    </h3>
                    <div className="flex space-x-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleFavoriteToggle(snippet.id)}
                        className={`p-1 rounded cursor-pointer ${
                          snippet.isFavorite
                            ? "text-yellow-500"
                            : "text-gray-400 hover:text-yellow-500"
                        }`}
                        title={
                          snippet.isFavorite
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        <Star
                          className="w-5 h-5"
                          fill={snippet.isFavorite ? "currentColor" : "none"}
                        />
                      </motion.button>
                    </div>
                  </div>

                  <div className="flex items-center mb-3 space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    {snippet.categoryId && (
                      <div className="flex items-center space-x-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            categories.find((c) => c.id === snippet.categoryId)
                              ?.color || "bg-gray-400"
                          }`}
                        ></div>
                        <span>
                          {categories.find((c) => c.id === snippet.categoryId)
                            ?.name || "Uncategorized"}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(snippet.timestamp)}</span>
                    </div>
                  </div>

                  <div className="flex-grow mb-3">
                    <pre
                      onClick={() => {
                        setActiveSnippet(snippet);
                        setShowViewModal(true);
                      }}
                      className={`p-3 rounded overflow-x-auto text-sm cursor-pointer ${
                        darkMode ? "bg-gray-900" : "bg-gray-100"
                      } h-36 flex flex-col`}
                    >
                      <code className="break-all whitespace-pre-wrap overflow-hidden">
                        {snippet.content.split("\n").slice(0, 5).join("\n")}
                        {snippet.content.split("\n").length > 5 && "..."}
                      </code>
                    </pre>

                    <div className="h-12 mt-3">
                      {snippet.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {snippet.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between mt-auto pt-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center space-x-1 px-3 py-1 rounded text-sm cursor-pointer ${
                        copiedId === snippet.id
                          ? "bg-green-600 text-white"
                          : darkMode
                          ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      onClick={() =>
                        handleCopyToClipboard(snippet.content, snippet.id)
                      }
                    >
                      {copiedId === snippet.id ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </motion.button>

                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1 text-gray-500 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => {
                          setActiveSnippet(snippet);
                          setShowViewModal(true);
                        }}
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1 text-gray-500 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => {
                          setActiveSnippet(snippet);
                          setShowEditForm(true);
                        }}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1 text-gray-500 rounded hover:bg-gray-200 hover:text-red-500 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleDeleteSnippet(snippet.id)}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Add Snippet Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 bg-opacity-50 md:p-4"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${modalBgClasses} p-3 md:p-6`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h2 className="text-xl font-bold">Add New Snippet</h2>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer p-1"
                  onClick={() => setShowAddForm(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex mb-3 md:mb-4 border-b dark:border-gray-700">
                <button
                  className={`px-3 md:px-4 py-2 font-medium cursor-pointer ${
                    activeTab === "edit"
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                  onClick={() => setActiveTab("edit")}
                >
                  Edit
                </button>
                <button
                  className={`px-3 md:px-4 py-2 font-medium cursor-pointer ${
                    activeTab === "preview"
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                  onClick={() => setActiveTab("preview")}
                >
                  Preview
                </button>
              </div>

              {activeTab === "edit" ? (
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Title *
                    </label>
                    <input
                      type="text"
                      className={`w-full p-2 rounded-md border ${inputBgClasses}`}
                      value={newSnippet.title}
                      onChange={(e) =>
                        setNewSnippet({ ...newSnippet, title: e.target.value })
                      }
                      placeholder="E.g., React useEffect Hook"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Content *
                    </label>
                    <textarea
                      ref={contentRef}
                      className={`w-full p-2 rounded-md border font-mono ${inputBgClasses}`}
                      rows={5}
                      value={newSnippet.content}
                      onChange={(e) =>
                        setNewSnippet({
                          ...newSnippet,
                          content: e.target.value,
                        })
                      }
                      placeholder="Paste your code or text here"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Description (Optional)
                    </label>
                    <textarea
                      className={`w-full p-2 rounded-md border ${inputBgClasses}`}
                      rows={2}
                      value={newSnippet.description}
                      onChange={(e) =>
                        setNewSnippet({
                          ...newSnippet,
                          description: e.target.value,
                        })
                      }
                      placeholder="Add a brief description or note"
                    />
                  </div>

                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="w-full md:w-auto">
                      <label className="block mb-1 text-sm font-medium">
                        Category
                      </label>
                      <div className="relative">
                        <select
                          className={`w-full p-2 pr-8 rounded-md border appearance-none ${inputBgClasses}`}
                          value={newSnippet.categoryId || ""}
                          onChange={(e) => {
                            if (e.target.value === "new_category") {
                              setShowInlineCategoryForm(true);
                            } else {
                              setNewSnippet({
                                ...newSnippet,
                                categoryId: e.target.value || null,
                              });
                            }
                          }}
                        >
                          <option value="">Uncategorized</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                          <option value="new_category">
                            + Add New Category
                          </option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        </div>
                      </div>

                      {/* Inline Category Form */}
                      {showInlineCategoryForm && (
                        <div className="p-3 mt-2 border rounded-md dark:border-gray-700">
                          <div className="mb-2">
                            <label className="block mb-1 text-sm font-medium">
                              New Category Name
                            </label>
                            <input
                              type="text"
                              className={`w-full p-2 rounded-md border ${inputBgClasses}`}
                              value={newCategoryName}
                              onChange={(e) =>
                                setNewCategoryName(e.target.value)
                              }
                              placeholder="E.g., TypeScript"
                            />
                          </div>
                          <div className="mb-2">
                            <label className="block mb-1 text-sm font-medium">
                              Color
                            </label>
                            <div className="flex flex-wrap gap-1">
                              {colors.slice(0, 8).map((color) => (
                                <button
                                  key={color}
                                  className={`w-5 h-5 rounded-full cursor-pointer ${color} ${
                                    newCategoryColor === color
                                      ? "ring-2 ring-offset-1 ring-indigo-600"
                                      : ""
                                  }`}
                                  onClick={() => setNewCategoryColor(color)}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              className="px-2 py-1 text-sm bg-gray-200 rounded dark:bg-gray-700 cursor-pointer"
                              onClick={() => {
                                setShowInlineCategoryForm(false);
                                setNewCategoryName("");
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              className="px-2 py-1 text-sm text-white bg-indigo-600 rounded cursor-pointer"
                              onClick={() => handleInlineAddCategory()}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-indigo-600 rounded form-checkbox focus:ring-indigo-500"
                          checked={newSnippet.isFavorite}
                          onChange={(e) =>
                            setNewSnippet({
                              ...newSnippet,
                              isFavorite: e.target.checked,
                            })
                          }
                        />
                        <span>Add to Favorites</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 space-x-3">
                    <button
                      className={secondaryButtonClasses}
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className={primaryButtonClasses}
                      onClick={handleAddSnippet}
                    >
                      Save Snippet
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Preview Tab */}
                  <div
                    className={`rounded-lg border shadow ${cardBgClasses} p-4`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-medium line-clamp-1">
                        {newSnippet.title || "Snippet Title"}
                      </h3>
                      <div className="flex space-x-1">
                        {newSnippet.isFavorite && (
                          <Star
                            className="w-5 h-5 text-yellow-500"
                            fill="currentColor"
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center mb-3 space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      {newSnippet.categoryId && (
                        <div className="flex items-center space-x-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              categories.find(
                                (c) => c.id === newSnippet.categoryId
                              )?.color || "bg-gray-400"
                            }`}
                          ></div>
                          <span>
                            {categories.find(
                              (c) => c.id === newSnippet.categoryId
                            )?.name || "Uncategorized"}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(Date.now())}</span>
                      </div>
                    </div>

                    <pre
                      className={`p-3 rounded overflow-x-auto text-sm mb-3 ${
                        darkMode ? "bg-gray-900" : "bg-gray-100"
                      }`}
                    >
                      <code className="break-all whitespace-pre-wrap">
                        {newSnippet.content
                          ? newSnippet.content
                              .split("\n")
                              .slice(0, 5)
                              .join("\n") +
                            (newSnippet.content.split("\n").length > 5
                              ? "..."
                              : "")
                          : "// Your code will appear here"}
                      </code>
                    </pre>

                    {newSnippet.description && (
                      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {newSnippet.description}
                      </p>
                    )}

                    <div className="flex justify-between mt-4">
                      <button className="flex items-center px-3 py-1 space-x-1 text-sm bg-gray-200 rounded dark:bg-gray-700 cursor-pointer">
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </button>

                      <div className="flex space-x-2">
                        <Eye className="w-4 h-4 text-gray-500" />
                        <Edit className="w-4 h-4 text-gray-500" />
                        <Trash2 className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end gap-3 pt-4 md:flex-row">
                    <button
                      className={secondaryButtonClasses}
                      onClick={() => setActiveTab("edit")}
                    >
                      Back to Edit
                    </button>
                    <button
                      className={primaryButtonClasses}
                      onClick={handleAddSnippet}
                    >
                      Save Snippet
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Edit Snippet Modal */}
      <AnimatePresence>
        {showEditForm && activeSnippet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 bg-opacity-50 md:p-4"
            onClick={() => setShowEditForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-2xl rounded-lg shadow-xl ${modalBgClasses} md:p-6 p-3`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Edit Snippet</h2>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                  onClick={() => setShowEditForm(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex mb-4 border-b dark:border-gray-700">
                <button
                  className={`px-4 py-2 font-medium cursor-pointer ${
                    editActiveTab === "edit"
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                  onClick={() => setEditActiveTab("edit")}
                >
                  Edit
                </button>
                <button
                  className={`px-4 py-2 font-medium cursor-pointer ${
                    editActiveTab === "preview"
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                  onClick={() => setEditActiveTab("preview")}
                >
                  Preview
                </button>
              </div>

              {editActiveTab === "edit" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Title *
                    </label>
                    <input
                      type="text"
                      className={`w-full p-2 rounded-md border ${inputBgClasses}`}
                      value={activeSnippet.title}
                      onChange={(e) =>
                        setActiveSnippet({
                          ...activeSnippet,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Content *
                    </label>
                    <textarea
                      className={`w-full p-2 rounded-md border font-mono ${inputBgClasses}`}
                      rows={6}
                      value={activeSnippet.content}
                      onChange={(e) =>
                        setActiveSnippet({
                          ...activeSnippet,
                          content: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Description (Optional)
                    </label>
                    <textarea
                      className={`w-full p-2 rounded-md border ${inputBgClasses}`}
                      rows={2}
                      value={activeSnippet.description}
                      onChange={(e) =>
                        setActiveSnippet({
                          ...activeSnippet,
                          description: e.target.value || "",
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Category
                      </label>
                      <div className="relative">
                        <select
                          className={`w-full p-2 pr-8 rounded-md border appearance-none ${inputBgClasses}`}
                          value={activeSnippet.categoryId || ""}
                          onChange={(e) =>
                            setActiveSnippet({
                              ...activeSnippet,
                              categoryId: e.target.value || null,
                            })
                          }
                        >
                          <option value="">Uncategorized</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-indigo-600 rounded form-checkbox focus:ring-indigo-500"
                          checked={activeSnippet.isFavorite}
                          onChange={(e) =>
                            setActiveSnippet({
                              ...activeSnippet,
                              isFavorite: e.target.checked,
                            })
                          }
                        />
                        <span>Add to Favorites</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 space-x-3">
                    <button
                      className={secondaryButtonClasses}
                      onClick={() => setShowEditForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className={primaryButtonClasses}
                      onClick={handleEditSnippet}
                    >
                      Update Snippet
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Preview Tab */}
                  <div
                    className={`rounded-lg border shadow ${cardBgClasses} p-4`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-medium line-clamp-1">
                        {activeSnippet.title || "Snippet Title"}
                      </h3>
                      <div className="flex space-x-1">
                        {activeSnippet.isFavorite && (
                          <Star
                            className="w-5 h-5 text-yellow-500"
                            fill="currentColor"
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center mb-3 space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      {activeSnippet.categoryId && (
                        <div className="flex items-center space-x-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              categories.find(
                                (c) => c.id === activeSnippet.categoryId
                              )?.color || "bg-gray-400"
                            }`}
                          ></div>
                          <span>
                            {categories.find(
                              (c) => c.id === activeSnippet.categoryId
                            )?.name || "Uncategorized"}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(activeSnippet.timestamp)}</span>
                      </div>
                    </div>

                    <pre
                      className={`p-3 rounded overflow-x-auto text-sm mb-3 ${
                        darkMode ? "bg-gray-900" : "bg-gray-100"
                      }`}
                    >
                      <code className="break-all whitespace-pre-wrap">
                        {activeSnippet.content
                          ? activeSnippet.content
                              .split("\n")
                              .slice(0, 5)
                              .join("\n") +
                            (activeSnippet.content.split("\n").length > 5
                              ? "..."
                              : "")
                          : "// Your code will appear here"}
                      </code>
                    </pre>

                    {activeSnippet.description && (
                      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {activeSnippet.description}
                      </p>
                    )}

                    <div className="flex justify-between mt-4">
                      <button className="flex items-center px-3 py-1 space-x-1 text-sm bg-gray-200 rounded dark:bg-gray-700 cursor-pointer">
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </button>

                      <div className="flex space-x-2">
                        <Eye className="w-4 h-4 text-gray-500" />
                        <Edit className="w-4 h-4 text-gray-500" />
                        <Trash2 className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end gap-3 pt-4 md:flex-row">
                    <button
                      className={secondaryButtonClasses}
                      onClick={() => setEditActiveTab("edit")}
                    >
                      Back to Edit
                    </button>
                    <button
                      className={primaryButtonClasses}
                      onClick={handleEditSnippet}
                    >
                      Update Snippet
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* View Snippet Modal */}
      <AnimatePresence>
        {showViewModal && activeSnippet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 bg-opacity-50 md:p-4"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${modalBgClasses} md:p-6 p-3`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{activeSnippet.title}</h2>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                  onClick={() => setShowViewModal(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center mb-3 space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  {activeSnippet.categoryId && (
                    <div className="flex items-center space-x-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          categories.find(
                            (c) => c.id === activeSnippet.categoryId
                          )?.color || "bg-gray-400"
                        }`}
                      ></div>
                      <span>
                        {categories.find(
                          (c) => c.id === activeSnippet.categoryId
                        )?.name || "Uncategorized"}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(activeSnippet.timestamp)}</span>
                  </div>

                  {activeSnippet.isFavorite && (
                    <div className="flex items-center space-x-1">
                      <Star
                        className="w-3 h-3 text-yellow-500"
                        fill="currentColor"
                      />
                      <span>Favorite</span>
                    </div>
                  )}
                </div>

                {activeSnippet.description && (
                  <div>
                    <h3 className="mb-1 text-sm font-medium">Description</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activeSnippet.description}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="mb-1 text-sm font-medium">Code</h3>
                  <pre
                    className={`p-3 rounded overflow-x-auto text-sm ${
                      darkMode ? "bg-gray-900" : "bg-gray-100"
                    }`}
                  >
                    <code className="whitespace-pre-wrap">
                      {activeSnippet.content}
                    </code>
                  </pre>
                </div>

                <div className="flex justify-between pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center space-x-1 px-3 py-1 rounded text-sm cursor-pointer ${
                      copiedId === activeSnippet.id
                        ? "bg-green-600 text-white"
                        : darkMode
                        ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() =>
                      handleCopyToClipboard(
                        activeSnippet.content,
                        activeSnippet.id
                      )
                    }
                  >
                    {copiedId === activeSnippet.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </motion.button>

                  <button
                    className={secondaryButtonClasses}
                    onClick={() => setShowViewModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Category Modal */}
      <AnimatePresence>
        {showAddCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 bg-opacity-50 md:p-4"
            onClick={() => setShowAddCategory(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-md rounded-lg shadow-xl ${modalBgClasses} md:p-6 p-3`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Add New Category</h2>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                  onClick={() => setShowAddCategory(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    className={`w-full p-2 rounded-md border ${inputBgClasses}`}
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="E.g., TypeScript"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Color
                  </label>
                  <div className="grid grid-cols-6 gap-4 md:grid-cols-8">
                    {colors.map((color) => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-8 h-8 rounded-full cursor-pointer ${color} ${
                          newCategoryColor === color
                            ? "ring-1 ring-offset-1 ring-indigo-600"
                            : ""
                        }`}
                        onClick={() => setNewCategoryColor(color)}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4 space-x-3">
                  <button
                    className={secondaryButtonClasses}
                    onClick={() => setShowAddCategory(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className={primaryButtonClasses}
                    onClick={handleAddCategory}
                  >
                    Add Category
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Category Modal */}
      {categories.length > 0 && (
        <div className="hidden">
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div
              className={`w-full max-w-md rounded-lg shadow-xl ${modalBgClasses} p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Manage Categories</h2>
                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  Delete categories you no longer need. Snippets in deleted
                  categories will become uncategorized.
                </p>

                <div className="overflow-y-auto max-h-60">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between py-2 border-b last:border-b-0 dark:border-gray-700"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${category.color}`}
                        ></div>
                        <span>{category.name}</span>
                      </div>
                      <button
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button className={secondaryButtonClasses}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 right-4 md:px-4 px-3 py-3 rounded-md shadow-lg flex items-center space-x-2 ${
              notification.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {notification.type === "success" ? (
              <Check className="w-5 h-5" />
            ) : (
              <X className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard shortcuts info */}
      <div className="fixed hidden bottom-4 left-4 md:block">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2 rounded-full cursor-pointer ${
            darkMode
              ? "bg-gray-800 text-gray-400 hover:text-gray-200"
              : "bg-gray-200 text-gray-600 hover:text-gray-800"
          }`}
          title="Keyboard Shortcuts"
        >
          <Info className="w-5 h-5" />
          <span className="sr-only">Keyboard Shortcuts</span>
        </motion.button>
      </div>
      <footer
        className={`mt-8 pt-6 pb-4 ${
          darkMode ? "bg-gray-850 text-gray-300" : "bg-gray-50 text-gray-600"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* App Info */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-3">
                <Clipboard className="w-6 h-6 text-indigo-600 mr-2" />
                <h3 className="text-lg font-semibold">DevClipboard</h3>
              </div>
              <p className="mb-3 text-sm">
                A personal code snippet manager designed for developers to
                store, organize, and quickly access their most-used code
                snippets across different programming languages.
              </p>
              <p className="text-sm">
                &copy; {new Date().getFullYear()} DevClipboard. All rights
                reserved.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase mb-3">FEATURES</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    className="hover:text-indigo-600 transition-colors duration-200"
                    onClick={() => setShowAddForm(true)}
                  >
                    Add Snippet
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-indigo-600 transition-colors duration-200"
                    onClick={() => setShowAddCategory(true)}
                  >
                    Manage Categories
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-indigo-600 transition-colors duration-200"
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  >
                    Toggle Favorites
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-indigo-600 transition-colors duration-200"
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </button>
                </li>
              </ul>
            </div>

            {/* Keyboard Shortcuts */}
            <div>
              <h3 className="text-sm font-semibold uppercase mb-3">
                Keyboard Shortcuts
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <kbd
                    className={`inline-flex items-center justify-center px-2 py-1 mr-2 text-xs rounded ${
                      darkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  >
                    Ctrl+N
                  </kbd>
                  <span>New Snippet</span>
                </li>
                <li className="flex items-center">
                  <kbd
                    className={`inline-flex items-center justify-center px-2 py-1 mr-2 text-xs rounded ${
                      darkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  >
                    Ctrl+F
                  </kbd>
                  <span>Search</span>
                </li>
                <li className="flex items-center">
                  <kbd
                    className={`inline-flex items-center justify-center px-2 py-1 mr-2 text-xs rounded ${
                      darkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  >
                    Esc
                  </kbd>
                  <span>Close Modal</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            className={`mt-6 pt-4 border-t ${
              darkMode ? "border-gray-700" : "border-gray-200"
            } flex flex-col sm:flex-row justify-between items-center text-sm`}
          >
            <p className="mb-3 sm:mb-0">Built with React and Tailwind CSS</p>

            {/* Social Icons - Add your actual links here */}
            <div className="flex space-x-4">
              {/* GitHub */}
              <a
                href="#"
                className="hover:text-indigo-600 transition-colors duration-200"
                aria-label="GitHub"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>

              {/* Twitter/X */}
              <a
                href="#"
                className="hover:text-indigo-600 transition-colors duration-200"
                aria-label="Twitter"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                className="hover:text-indigo-600 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>

            {/* Back to top button */}
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className={`flex items-center space-x-1 text-sm ${
                  darkMode ? "hover:text-indigo-400" : "hover:text-indigo-600"
                } transition-colors duration-200`}
              >
                <span>Back to top</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ClipboardMangerWrapper = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <ClipboardManager />;
};

export default ClipboardMangerWrapper;
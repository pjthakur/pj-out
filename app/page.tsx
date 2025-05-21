"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  LogIn,
  Save,
  ArrowRight,
  DollarSign,
  Package,
  TrendingUp,
  Users,
  Clock,
  ChevronUp,
  Star,
  MessageCircle,
  HelpCircle,
  Info,
} from "lucide-react";

// TypeScript interfaces
interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  username: string;
  password: string;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatarUrl: string;
  rating: number;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  isOpen?: boolean;
}

// Sample testimonials
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sophie Turner",
    role: "E-commerce Director",
    company: "Fashion Forward",
    content:
      "StyleStock has completely transformed how we manage our inventory. The intuitive interface and real-time updates have increased our operational efficiency by 40%.",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "James Wilson",
    role: "Operations Manager",
    company: "Urban Threads",
    content:
      "We tried multiple inventory systems before finding StyleStock. Nothing else compares in terms of ease of use and comprehensive features. Our stock discrepancies have dropped to nearly zero.",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Small Business Owner",
    company: "Elegant Styles",
    content:
      "As a small business owner, I needed an affordable solution that wouldn't compromise on features. StyleStock delivers everything I need without the enterprise price tag.",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 4,
  },
  {
    id: 4,
    name: "Michael Chen",
    role: "IT Manager",
    company: "TrendSetters Apparel",
    content:
      "The analytics and reporting features have given us insights we never had before. Now we can make data-driven decisions that have increased our revenue by 25% year over year.",
    avatarUrl: "https://randomuser.me/api/portraits/men/15.jpg",
    rating: 5,
  },
];

// Sample FAQs
const faqs: FAQ[] = [
  {
    id: 1,
    question: "How does StyleStock handle multiple store locations?",
    answer:
      "StyleStock provides comprehensive multi-location support, allowing you to track inventory across all your stores from a single dashboard. You can transfer stock between locations, set location-specific pricing, and generate reports filtered by location.",
  },
  {
    id: 2,
    question: "Can I integrate StyleStock with my e-commerce platform?",
    answer:
      "Yes! StyleStock offers seamless integration with all major e-commerce platforms including Shopify, WooCommerce, Magento, and BigCommerce. Our API also allows for custom integrations with other systems you may be using.",
  },
  {
    id: 3,
    question: "Is there a mobile app available?",
    answer:
      "Absolutely. StyleStock offers native mobile apps for both iOS and Android devices, giving you the flexibility to manage your inventory on the go. The mobile apps include barcode scanning capabilities for quick stock checks and updates.",
  },
  {
    id: 4,
    question: "How does the pricing structure work?",
    answer:
      "StyleStock offers tiered pricing based on your business needs. Our plans start with a basic package for small businesses and scale up to enterprise solutions. All plans include core inventory management features, with premium features available in higher tiers.",
  },
  {
    id: 5,
    question: "Do you offer training and support?",
    answer:
      "Yes, all StyleStock plans include access to our comprehensive knowledge base and email support. Our Premium and Enterprise plans also include personalized onboarding, training sessions, and priority phone support to ensure you get the most out of our platform.",
  },
  {
    id: 6,
    question: "How secure is my data with StyleStock?",
    answer:
      "Security is our top priority. StyleStock implements bank-level encryption, regular security audits, and strict access controls. We are GDPR compliant and follow industry best practices for data protection. Your data is backed up daily to prevent any loss.",
  },
];

// Sample data
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    category: "Tops",
    stock: 60,
    price: 29.99,
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    createdAt: new Date(2025, 2, 15),
    updatedAt: new Date(2025, 4, 10),
  },
  {
    id: "2",
    name: "Slim Fit Jeans",
    category: "Bottoms",
    stock: 100,
    price: 59.99,
    imageUrl:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    createdAt: new Date(2025, 1, 20),
    updatedAt: new Date(2025, 4, 12),
  },
  {
    id: "3",
    name: "Summer Floral Dress",
    category: "Dresses",
    stock: 75,
    price: 79.99,
    imageUrl:
      "https://images.unsplash.com/photo-1612336307429-8a898d10e223?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    createdAt: new Date(2025, 3, 5),
    updatedAt: new Date(2025, 4, 11),
  },
  {
    id: "4",
    name: "Leather Jacket",
    category: "Outerwear",
    stock: 50,
    price: 199.99,
    imageUrl:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    createdAt: new Date(2024, 11, 10),
    updatedAt: new Date(2025, 4, 5),
  },
  {
    id: "5",
    name: "Wool Sweater",
    category: "Tops",
    stock: 80,
    price: 89.99,
    imageUrl:
      "https://images.unsplash.com/photo-1624379018909-4d69b93291dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    createdAt: new Date(2024, 10, 15),
    updatedAt: new Date(2025, 3, 20),
  },
  {
    id: "6",
    name: "Ankle Boots",
    category: "Footwear",
    stock: 60,
    price: 129.99,
    imageUrl:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    createdAt: new Date(2024, 9, 25),
    updatedAt: new Date(2025, 2, 15),
  },
  {
    id: "7",
    name: "Silk Scarf",
    category: "Accessories",
    stock: 120,
    price: 39.99,
    imageUrl:
      "https://images.unsplash.com/photo-1550639525-c97d455acf70?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    createdAt: new Date(2025, 1, 5),
    updatedAt: new Date(2025, 4, 7),
  },
  {
    id: "8",
    name: "Athletic Shorts",
    category: "Bottoms",
    stock: 90,
    price: 34.99,
    imageUrl:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    createdAt: new Date(2025, 2, 20),
    updatedAt: new Date(2025, 4, 9),
  },
];

// Sample users
const users: User[] = [
  { username: "admin", password: "password123" },
  { username: "demo", password: "demo123" },
];

// Helper functions
const generateId = () => Math.random().toString(36).substring(2, 9);
const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

// Main component
export default function InventoryManager() {
  // State variables
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newProduct, setNewProduct] = useState<
    Omit<Product, "id" | "createdAt" | "updatedAt">
  >({
    name: "",
    category: "",
    stock: 0,
    price: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loginCredentials, setLoginCredentials] = useState<User>({
    username: "demo",
    password: "demo123",
  });
  const [loginError, setLoginError] = useState<string>("");
  const [activePage, setActivePage] = useState<"home" | "dashboard">("home");
  const [activeTab, setActiveTab] = useState<"inventory" | "insights">(
    "inventory"
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] =
    useState<number>(0);
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [chartHovered, setChartHovered] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const testimonialSliderRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const body = document.body;
    const originalStyle = body.style.overflow;

    if (isLoginModalOpen || isAddModalOpen || isDeleteModalOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = originalStyle;
    }

    return () => {
      body.style.overflow = originalStyle;
    };
  }, [isLoginModalOpen, isAddModalOpen, isDeleteModalOpen]);

  // Initialize categories from products and set up event listeners
  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((product) => product.category))
    );
    setCategories(uniqueCategories);

    // Add resize event listener
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [products]);

  // Filter products based on category and search term
  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term)
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  // Testimonial auto-rotate effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Update testimonial slider position when index changes
  useEffect(() => {
    if (testimonialSliderRef.current) {
      testimonialSliderRef.current.style.transform = `translateX(-${
        currentTestimonialIndex * 100
      }%)`;
    }
  }, [currentTestimonialIndex]);

  // Calculate summary data
  const calculateSummary = () => {
    const totalItems = filteredProducts.reduce(
      (sum, product) => sum + product.stock,
      0
    );
    const totalValue = filteredProducts.reduce(
      (sum, product) => sum + product.stock * product.price,
      0
    );
    const averagePrice = totalValue / totalItems || 0;

    return {
      totalProducts: filteredProducts.length,
      totalItems,
      totalValue,
      averagePrice,
    };
  };

  // Calculate chart data
  const calculateChartData = () => {
    // Category distribution data
    const categoryData = categories.map((category) => {
      const categoryProducts = products.filter(
        (product) => product.category === category
      );
      const totalStock = categoryProducts.reduce(
        (sum, product) => sum + product.stock,
        0
      );
      const totalValue = categoryProducts.reduce(
        (sum, product) => sum + product.stock * product.price,
        0
      );

      return {
        name: category,
        stock: totalStock,
        value: totalValue,
      };
    });

    // Stock level data for bar chart
    const stockData = filteredProducts.map((product) => ({
      name:
        product.name.length > 15
          ? product.name.substring(0, 15) + "..."
          : product.name,
      stock: product.stock,
    }));

    // Monthly sales trend (simulated)
    const monthlyData = [
      { month: "Jan", sales: 45000 },
      { month: "Feb", sales: 52000 },
      { month: "Mar", sales: 49000 },
      { month: "Apr", sales: 58000 },
      { month: "May", sales: 63000 },
    ];

    return {
      categoryData,
      stockData: stockData.slice(0, 5), // Limit to prevent chart overcrowding
      monthlyData,
    };
  };

  // Event handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(
      (u) =>
        u.username === loginCredentials.username &&
        u.password === loginCredentials.password
    );

    if (user) {
      setIsLoggedIn(true);
      setIsLoginModalOpen(false);
      setLoginError("");
      setActivePage("dashboard");
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActivePage("home");
  };

  const validateProductForm = () => {
    const errors: { [key: string]: string } = {};

    if (!newProduct.name.trim()) {
      errors.name = "Product name is required";
    }

    if (!newProduct.category.trim()) {
      errors.category = "Category is required";
    }

    if (newProduct.stock < 0) {
      errors.stock = "Stock cannot be negative";
    }

    if (newProduct.price <= 0) {
      errors.price = "Price must be greater than zero";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProductForm()) {
      return;
    }

    const newProductEntry: Product = {
      id: generateId(),
      ...newProduct,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProducts([...products, newProductEntry]);
    setIsAddModalOpen(false);
    setNewProduct({
      name: "",
      category: "",
      stock: 0,
      price: 0,
      imageUrl:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    });
    setValidationErrors({});
  };

  const handleStartEdit = (
    id: string,
    field: string,
    value: string | number
  ) => {
    setEditingId(id);
    setEditingField(field);
    setEditingValue(value.toString());
  };

  const handleSaveEdit = () => {
    if (!editingId || !editingField) return;

    const updatedProducts = products.map((product) => {
      if (product.id === editingId) {
        const updatedProduct = { ...product, updatedAt: new Date() };

        if (editingField === "stock" || editingField === "price") {
          updatedProduct[editingField] = parseFloat(editingValue) || 0;
        } else {
          updatedProduct[editingField as keyof Product] = editingValue as never;
        }

        return updatedProduct;
      }
      return product;
    });

    setProducts(updatedProducts);
    setEditingId(null);
    setEditingField(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingField(null);
  };

  const confirmDelete = (id: string) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (!productToDelete) return;

    const updatedProducts = products.filter(
      (product) => product.id !== productToDelete
    );
    setProducts(updatedProducts);
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const changeTestimonial = (index: number) => {
    setCurrentTestimonialIndex(index);
  };

  const toggleFaq = (id: number) => {
    setExpandedFaqs((prev) => {
      if (prev.includes(id)) {
        return prev.filter((faqId) => faqId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle key press for editing and input fields
  const handleKeyPress = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === "Enter") {
      callback();
    }
  };

  // Render login modal
  const renderLoginModal = () => {
    return (
      <div className="fixed inset-0  backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all duration-300 ease-in-out">
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Login to Inventory Manager
            </h2>
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleLogin} className="p-4 sm:p-6">
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={loginCredentials.username}
                onChange={(e) =>
                  setLoginCredentials({
                    ...loginCredentials,
                    username: e.target.value,
                  })
                }
                onKeyPress={(e) =>
                  handleKeyPress(e, () => handleLogin(e as any))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={loginCredentials.password}
                onChange={(e) =>
                  setLoginCredentials({
                    ...loginCredentials,
                    password: e.target.value,
                  })
                }
                onKeyPress={(e) =>
                  handleKeyPress(e, () => handleLogin(e as any))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
              {loginError && (
                <p className="mt-2 text-sm text-red-600">{loginError}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Demo credentials: username: "demo", password: "demo123"
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
            >
              <LogIn size={18} className="mr-2" />
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  };

  // Render add product modal
  const renderAddProductModal = () => {
    return (
      <div className="fixed inset-0  backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden transform transition-all duration-300 ease-in-out max-h-[90vh] overflow-y-auto">
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center sticky top-0 z-10">
            <h2 className="text-xl font-semibold">Add New Product</h2>
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setValidationErrors({});
              }}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={handleAddProduct}
            className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
          >
            <div className="col-span-2 md:col-span-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Name
              </label>
              <input
                type="text"
                id="name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className={`w-full px-3 py-2 border ${
                  validationErrors.name ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter product name"
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div className="col-span-2 md:col-span-1">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                list="categories"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                className={`w-full px-3 py-2 border ${
                  validationErrors.category
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter or select category"
              />
              <datalist id="categories">
                {categories.map((category, index) => (
                  <option key={index} value={category} />
                ))}
              </datalist>
              {validationErrors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.category}
                </p>
              )}
            </div>

            <div className="col-span-2 md:col-span-1">
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Stock Quantity
              </label>
              <input
                type="number"
                id="stock"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    stock: parseInt(e.target.value) || 0,
                  })
                }
                className={`w-full px-3 py-2 border ${
                  validationErrors.stock ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                min="0"
              />
              {validationErrors.stock && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.stock}
                </p>
              )}
            </div>

            <div className="col-span-2 md:col-span-1">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price (USD)
              </label>
              <input
                type="number"
                id="price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                className={`w-full px-3 py-2 border ${
                  validationErrors.price ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                min="0"
                step="0.01"
              />
              {validationErrors.price && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.price}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Image URL
              </label>
              <input
                type="text"
                id="imageUrl"
                value={newProduct.imageUrl}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, imageUrl: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter image URL"
              />
              {newProduct.imageUrl && (
                <div className="mt-2">
                  <img
                    src={newProduct.imageUrl}
                    alt="Product preview"
                    className="h-20 w-20 object-cover rounded-md border border-gray-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setValidationErrors({});
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus size={18} className="inline mr-1" /> Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Render delete confirmation modal
  const renderDeleteModal = () => {
    const productName =
      products.find((p) => p.id === productToDelete)?.name || "";

    return (
      <div className="fixed inset-0  backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all duration-300 ease-in-out">
          <div className="bg-red-600 p-4 text-white flex justify-between items-center">
            <h2 className="text-xl font-semibold">Confirm Deletion</h2>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4 sm:p-6">
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{productName}</span>? This action
              cannot be undone.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <Trash2 size={18} className="inline mr-1" /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render navbar
  const renderNavbar = () => {
    return (
      <nav className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">StyleStock</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setActivePage("home")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activePage === "home" ? "bg-blue-900" : "hover:bg-blue-700"
                } transition-colors`}
              >
                Home
              </button>

              {isLoggedIn && (
                <button
                  onClick={() => setActivePage("dashboard")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activePage === "dashboard"
                      ? "bg-blue-900"
                      : "hover:bg-blue-700"
                  } transition-colors`}
                >
                  Dashboard
                </button>
              )}

              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-white text-blue-600 hover:bg-gray-100 transition-colors"
                >
                  <LogIn size={16} className="inline mr-1" /> Login
                </button>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">
                  {isMenuOpen ? "Close menu" : "Open menu"}
                </span>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button
                onClick={() => {
                  setActivePage("home");
                  setIsMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                  activePage === "home" ? "bg-blue-900" : "hover:bg-blue-800"
                } transition-colors`}
              >
                Home
              </button>

              {isLoggedIn && (
                <button
                  onClick={() => {
                    setActivePage("dashboard");
                    setIsMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                    activePage === "dashboard"
                      ? "bg-blue-900"
                      : "hover:bg-blue-800"
                  } transition-colors`}
                >
                  Dashboard
                </button>
              )}

              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block px-3 py-2 rounded-md text-base font-medium w-full text-left hover:bg-blue-800 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="block px-3 py-2 rounded-md text-base font-medium w-full text-left bg-white text-blue-600 hover:bg-gray-100 transition-colors"
                >
                  <LogIn size={16} className="inline mr-1" /> Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    );
  };

  // Render testimonials section
  const renderTestimonials = () => {
    return (
      <section className="py-12 sm:py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
              What Our Customers Say
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from businesses that have transformed their inventory
              management with StyleStock.
            </p>
          </div>

          <div className="relative">
            {/* Mobile Testimonials (Single View) */}
            <div className="sm:hidden">
              <div className="bg-white rounded-lg shadow-lg p-6 relative mx-4">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonials[currentTestimonialIndex].avatarUrl}
                    alt={testimonials[currentTestimonialIndex].name}
                    className="h-14 w-14 rounded-full object-cover border-2 border-blue-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://randomuser.me/api/portraits/lego/1.jpg";
                    }}
                  />
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {testimonials[currentTestimonialIndex].name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {testimonials[currentTestimonialIndex].role},{" "}
                      {testimonials[currentTestimonialIndex].company}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={
                          i < testimonials[currentTestimonialIndex].rating
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 text-base italic leading-relaxed">
                    "{testimonials[currentTestimonialIndex].content}"
                  </p>
                </div>
                <MessageCircle
                  size={36}
                  className="absolute bottom-4 right-4 text-blue-100"
                />
              </div>
            </div>

            {/* Desktop Testimonials (Slider) */}
            <div className="hidden sm:block">
              <div className="overflow-hidden">
                <div
                  ref={testimonialSliderRef}
                  className="flex transition-transform duration-500 ease-in-out"
                >
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={testimonial.id}
                      className="w-full flex-shrink-0 px-4"
                    >
                      <div className="bg-white rounded-lg shadow-lg p-8 md:p-10 relative">
                        <div className="flex items-center mb-6">
                          <img
                            src={testimonial.avatarUrl}
                            alt={testimonial.name}
                            className="h-16 w-16 rounded-full object-cover border-2 border-blue-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://randomuser.me/api/portraits/lego/1.jpg";
                            }}
                          />
                          <div className="ml-4">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {testimonial.name}
                            </h3>
                            <p className="text-gray-600">
                              {testimonial.role}, {testimonial.company}
                            </p>
                          </div>
                        </div>
                        <div className="mb-6">
                          <div className="flex text-yellow-400 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={20}
                                fill={
                                  i < testimonial.rating
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            ))}
                          </div>
                          <p className="text-gray-700 text-lg italic leading-relaxed">
                            "{testimonial.content}"
                          </p>
                        </div>
                        <MessageCircle
                          size={48}
                          className="absolute bottom-6 right-6 text-blue-100"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => changeTestimonial(index)}
                  className={`h-2 sm:h-3 w-2 sm:w-3 rounded-full ${
                    currentTestimonialIndex === index
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  } transition-colors`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Render FAQs section
  const renderFaqs = () => {
    return (
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Get answers to common questions about StyleStock.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="flex justify-between items-center w-full px-4 sm:px-6 py-3 sm:py-4 text-left focus:outline-none"
                >
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 pr-6">
                    {faq.question}
                  </h3>
                  {expandedFaqs.includes(faq.id) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>

                <div
                  className={`px-4 sm:px-6 transition-all duration-300 ease-in-out overflow-hidden ${
                    expandedFaqs.includes(faq.id)
                      ? "max-h-96 opacity-100 pb-4 sm:pb-6"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-gray-600 text-sm sm:text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Render bar chart
  const renderBarChart = (data: { name: string; stock: number }[]) => {
    if (!data.length) return null;

    const maxValue = Math.max(...data.map((item) => item.stock), 1);
    const barMaxHeight = 160; // px height reference

    return (
      <div className="w-full h-full flex relative z-10 pt-6">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between py-4 text-xs text-gray-500">
          <div>{maxValue}</div>
          <div>{Math.round(maxValue / 2)}</div>
          <div>0</div>
        </div>

        {/* Bars */}
        <div className="ml-4 flex-1 flex items-end overflow-visible relative">
          {data.map((item, index) => {
            const height = (item.stock / maxValue) * barMaxHeight;

            return (
              <div
                key={index}
                className="flex-1 mx-1 flex flex-col items-center group relative"
                onMouseEnter={() => setChartHovered(`bar-${index}`)}
                onMouseLeave={() => setChartHovered(null)}
              >
                {/* Bar */}
                <div
                  className="w-4 sm:w-5 bg-blue-500 rounded-t-md transition-all duration-300 group-hover:bg-blue-600"
                  style={{ height: `${height}px`, minHeight: "4px" }}
                />

                {/* Label */}
                <div className="mt-2 text-xs font-medium text-gray-700 truncate w-full text-center px-1">
                  {isMobileView
                    ? item.name.slice(0, 6) +
                      (item.name.length > 6 ? "..." : "")
                    : item.name.slice(0, 15) +
                      (item.name.length > 15 ? "..." : "")}
                </div>

                {/* Tooltip */}
                {chartHovered === `bar-${index}` && (
                  <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-800 text-white rounded text-xs shadow z-50 whitespace-nowrap left-1/2 -translate-x-1/2">
                    {item.stock} items
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render pie chart
  const renderPieChart = (
    data: { name: string; stock: number; value: number }[]
  ) => {
    // Make sure we have data to display
    if (data.length === 0) {
      return (
        <div className="h-full flex flex-col items-center justify-center">
          <Info size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 text-center">
            No category data available
          </p>
        </div>
      );
    }

    const total = data.reduce((acc, item) => acc + item.stock, 0);
    const colors = [
      "#3b82f6",
      "#10b981",
      "#8b5cf6",
      "#ef4444",
      "#f59e0b",
      "#6366f1",
    ];

    // Calculate the segments
    let currentAngle = 0;
    const segments = data.map((item, index) => {
      const startAngle = currentAngle;
      const percentage = (item.stock / total) * 100;
      const sliceAngle = (percentage / 100) * 360;
      currentAngle += sliceAngle;

      return {
        name: item.name,
        stock: item.stock,
        value: item.value,
        percentage,
        startAngle,
        endAngle: currentAngle,
        color: colors[index % colors.length],
      };
    });

    const polarToCartesian = (
      centerX: number,
      centerY: number,
      radius: number,
      angleInDegrees: number
    ) => {
      const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
      };
    };

    const createArc = (startAngle: number, endAngle: number) => {
      const center = 50;
      const radius = 40;

      const start = polarToCartesian(center, center, radius, endAngle);
      const end = polarToCartesian(center, center, radius, startAngle);

      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

      return [
        "M",
        center,
        center,
        "L",
        start.x,
        start.y,
        "A",
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        end.x,
        end.y,
        "Z",
      ].join(" ");
    };

    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div
          className="relative w-full max-w-[200px] mx-auto"
          style={{ height: "min(200px, 100%)" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {segments.map((segment, index) => (
              <path
                key={index}
                d={createArc(segment.startAngle, segment.endAngle)}
                fill={segment.color}
                className="transition-opacity duration-200 hover:opacity-80"
                onMouseEnter={() => setChartHovered(`pie-${index}`)}
                onMouseLeave={() => setChartHovered(null)}
                stroke="#fff"
                strokeWidth="0.5"
              />
            ))}
          </svg>

          {chartHovered && chartHovered.startsWith("pie-") && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded shadow-lg text-xs z-10">
              {(() => {
                const index = parseInt(chartHovered.split("-")[1]);
                const segment = segments[index];
                return (
                  <div className="whitespace-nowrap">
                    <div className="font-semibold">{segment.name}</div>
                    <div>
                      Items: {segment.stock} ({segment.percentage.toFixed(1)}%)
                    </div>
                    <div>Value: {formatCurrency(segment.value)}</div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:text-sm w-full max-w-[300px] mx-auto">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center">
              <div
                className="h-3 w-3 rounded-sm mr-1 flex-shrink-0"
                style={{ backgroundColor: segment.color }}
              ></div>
              <span className="truncate">
                {segment.name} ({segment.percentage.toFixed(0)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render line chart
  const renderLineChart = (data: { month: string; sales: number }[]) => {
    if (data.length === 0) return null;

    const padding = 40;

    const maxValue = Math.max(...data.map((d) => d.sales));
    const minValue = Math.min(...data.map((d) => d.sales));
    const range = maxValue - minValue || 1;

    // Width/height defined via viewBox for responsiveness
    const viewBoxWidth = 600;
    const viewBoxHeight = 250;

    const chartWidth = viewBoxWidth - 2 * padding;
    const chartHeight = viewBoxHeight - 2 * padding;

    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = padding + ((maxValue - d.sales) / range) * chartHeight;
      return { ...d, x, y };
    });

    const path = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`)
      .join(" ");

    return (
      <div className="w-full flex justify-center">
        <div className="w-full max-w-3xl px-4">
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <svg
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                className="w-full h-auto"
              >
                {/* Grid lines */}
                <line
                  x1={padding}
                  y1={padding}
                  x2={padding}
                  y2={viewBoxHeight - padding}
                  stroke="#e5e7eb"
                />
                <line
                  x1={padding}
                  y1={viewBoxHeight - padding}
                  x2={viewBoxWidth - padding}
                  y2={viewBoxHeight - padding}
                  stroke="#e5e7eb"
                />

                {/* Line path */}
                <path d={path} fill="none" stroke="#3b82f6" strokeWidth="2" />

                {/* Points */}
                {points.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="3" fill="#3b82f6" />
                ))}

                {/* X-axis labels */}
                {points.map((p, i) => (
                  <text
                    key={i}
                    x={p.x}
                    y={viewBoxHeight - 10}
                    fontSize="10"
                    textAnchor="middle"
                    className="fill-gray-600"
                  >
                    {p.month}
                  </text>
                ))}

                {/* Y-axis labels */}
                <text
                  x={padding - 10}
                  y={padding}
                  fontSize="10"
                  textAnchor="end"
                  className="fill-gray-600"
                >
                  {maxValue}
                </text>
                <text
                  x={padding - 10}
                  y={viewBoxHeight / 2}
                  fontSize="10"
                  textAnchor="end"
                  className="fill-gray-600"
                >
                  {(maxValue + minValue) / 2}
                </text>
                <text
                  x={padding - 10}
                  y={viewBoxHeight - padding}
                  fontSize="10"
                  textAnchor="end"
                  className="fill-gray-600"
                >
                  {minValue}
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render landing page
  const renderLandingPage = () => {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Hero section */}
        <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                  Streamline Your Inventory Management
                </h1>
                <p className="text-base sm:text-xl leading-relaxed opacity-90">
                  Powerful tools to manage your product inventory, track stock
                  levels, and gain valuable insights for your e-commerce
                  business.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-blue-600 rounded-md font-medium shadow-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                  >
                    Get Started <ArrowRight size={18} className="inline ml-1" />
                  </button>
                </div>
              </div>
              <div className="hidden md:block">
                <img
                  src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  alt="Inventory Dashboard"
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-12 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Powerful Features for Your Business
              </h2>
              <p className="mt-3 sm:mt-4 text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to efficiently manage your inventory and
                make data-driven decisions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-blue-50 p-5 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-3 bg-blue-100 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-4 sm:mb-5">
                  <Package className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">
                  Inventory Tracking
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Keep track of your product inventory in real-time with
                  easy-to-use management tools.
                </p>
              </div>

              <div className="bg-blue-50 p-5 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-3 bg-blue-100 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-4 sm:mb-5">
                  <DollarSign className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">
                  Financial Insights
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Get valuable financial insights with automatic calculations of
                  inventory value and sales data.
                </p>
              </div>

              <div className="bg-blue-50 p-5 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-3 bg-blue-100 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-4 sm:mb-5">
                  <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">
                  Performance Analytics
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Visualize your business performance with interactive charts
                  and comprehensive reports.
                </p>
              </div>

              <div className="bg-blue-50 p-5 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-3 bg-blue-100 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-4 sm:mb-5">
                  <Users className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">
                  User-Friendly Interface
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Enjoy a clean, intuitive interface designed for efficiency and
                  ease of use.
                </p>
              </div>

              <div className="bg-blue-50 p-5 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-3 bg-blue-100 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-4 sm:mb-5">
                  <Filter className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">
                  Advanced Filtering
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Quickly find what you're looking for with powerful filtering
                  and search capabilities.
                </p>
              </div>

              <div className="bg-blue-50 p-5 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-3 bg-blue-100 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-4 sm:mb-5">
                  <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">
                  Real-Time Updates
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Make quick inventory adjustments with inline editing and see
                  changes reflected instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {renderTestimonials()}

        {/* FAQs Section */}
        {renderFaqs()}

        {/* CTA section */}
        <section className="py-12 sm:py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-6">
              Ready to Transform Your Inventory Management?
            </h2>
            <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-10">
              Join thousands of businesses that trust StyleStock for their
              inventory management needs.
            </p>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 text-white rounded-md font-medium shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Start Managing Your Inventory
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <ShoppingBag className="h-6 w-6 mr-2" />
                  <span className="font-bold text-lg">StyleStock</span>
                </div>
                <p className="text-gray-400 text-sm sm:text-base">
                  Powerful inventory management for clothing e-commerce
                  businesses.
                </p>
              </div>

              <div className="sm:mt-0 mt-2">
                <h3 className="font-semibold text-lg mb-3 sm:mb-4">
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  <li>
                    <button 
                      onClick={() => window.scrollTo(0, 0)} 
                      className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                      Features
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => window.scrollTo(0, 0)} 
                      className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                      Pricing
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => window.scrollTo(0, 0)} 
                      className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                      Resources
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => window.scrollTo(0, 0)} 
                      className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                      Contact
                    </button>
                  </li>
                </ul>
              </div>

              <div className="sm:mt-0 mt-2">
                <h3 className="font-semibold text-lg mb-3 sm:mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <button 
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                      Terms of Service
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                      Cookie Policy
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400">
              <p className="text-sm">
                &copy; {new Date().getFullYear()} StyleStock. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  };

  // Render dashboard
  const renderDashboard = () => {
    const summary = calculateSummary();
    console.log("filteredProducts", filteredProducts);

    const chartData = calculateChartData();
    console.log("stockData", chartData.stockData);

    return (
      <div className="bg-gray-50 min-h-screen">
        {/* Dashboard header */}
        <header className="bg-white shadow sticky top-16 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Inventory Dashboard
              </h1>
              <div className="mt-3 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus size={18} className="mr-1.5" /> Add Product
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500">
                    Total Products
                  </p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {summary.totalProducts}
                  </p>
                </div>
                <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-6 transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500">
                    Total Stock Items
                  </p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {summary.totalItems}
                  </p>
                </div>
                <div className="bg-green-100 p-2 sm:p-3 rounded-full">
                  <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-6 transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500">
                    Inventory Value
                  </p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {formatCurrency(summary.totalValue)}
                  </p>
                </div>
                <div className="bg-purple-100 p-2 sm:p-3 rounded-full">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 sm:p-6 transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500">
                    Average Price
                  </p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                    {formatCurrency(summary.averagePrice)}
                  </p>
                </div>
                <div className="bg-yellow-100 p-2 sm:p-3 rounded-full">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow mb-6 sm:mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab("inventory")}
                  className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium ${
                    activeTab === "inventory"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Inventory
                </button>
                <button
                  onClick={() => setActiveTab("insights")}
                  className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium ${
                    activeTab === "insights"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Insights
                </button>
              </nav>
            </div>

            <div className="p-4 sm:p-6">
              {activeTab === "inventory" ? (
                <>
                  {/* Category filter */}
                  <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      Filter by category:
                    </span>
                    <button
                      onClick={() => handleCategoryChange("All")}
                      className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full ${
                        selectedCategory === "All"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      } transition-colors`}
                    >
                      All
                    </button>
                    {categories.map((category, index) => (
                      <button
                        key={index}
                        onClick={() => handleCategoryChange(category)}
                        className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full ${
                          selectedCategory === category
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        } transition-colors`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {/* Products table - Responsive version */}
                  <div className="block sm:hidden">
                    <div className="space-y-4">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <div
                            key={product.id}
                            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                          >
                            <div className="p-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-14 w-14">
                                  <img
                                    className="h-14 w-14 rounded-md object-cover"
                                    src={product.imageUrl}
                                    alt={product.name}
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src =
                                        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80";
                                    }}
                                  />
                                </div>
                                <div className="ml-3 flex-1">
                                  {editingId === product.id &&
                                  editingField === "name" ? (
                                    <div className="flex items-center">
                                      <input
                                        type="text"
                                        value={editingValue}
                                        onChange={(e) =>
                                          setEditingValue(e.target.value)
                                        }
                                        className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1 w-full"
                                        autoFocus
                                      />
                                      <div className="ml-2 flex">
                                        <button
                                          onClick={handleSaveEdit}
                                          className="text-green-600 hover:text-green-800 mr-1"
                                        >
                                          <CheckCircle size={18} />
                                        </button>
                                        <button
                                          onClick={handleCancelEdit}
                                          className="text-red-600 hover:text-red-800"
                                        >
                                          <XCircle size={18} />
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-between">
                                      <div className="text-sm font-medium text-gray-900">
                                        {product.name}
                                      </div>
                                      <button
                                        onClick={() =>
                                          handleStartEdit(
                                            product.id,
                                            "name",
                                            product.name
                                          )
                                        }
                                        className="text-gray-400 hover:text-blue-600"
                                      >
                                        <Edit size={14} />
                                      </button>
                                    </div>
                                  )}

                                  <div className="flex items-center mt-1">
                                    <div
                                      className={`text-xs text-gray-500 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full`}
                                    >
                                      {product.category}
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleStartEdit(
                                          product.id,
                                          "category",
                                          product.category
                                        )
                                      }
                                      className="ml-1 text-gray-400 hover:text-blue-600"
                                    >
                                      <Edit size={12} />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2 mt-4">
                                <div>
                                  <p className="text-xs text-gray-500">Stock</p>
                                  {editingId === product.id &&
                                  editingField === "stock" ? (
                                    <div className="flex items-center">
                                      <input
                                        type="number"
                                        value={editingValue}
                                        onChange={(e) =>
                                          setEditingValue(e.target.value)
                                        }
                                        className="text-sm text-gray-900 border border-gray-300 rounded px-2 py-1 w-20"
                                        min="0"
                                        autoFocus
                                      />
                                      <div className="ml-2 flex">
                                        <button
                                          onClick={handleSaveEdit}
                                          className="text-green-600 hover:text-green-800 mr-1"
                                        >
                                          <CheckCircle size={16} />
                                        </button>
                                        <button
                                          onClick={handleCancelEdit}
                                          className="text-red-600 hover:text-red-800"
                                        >
                                          <XCircle size={16} />
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center">
                                      <div
                                        className={`text-sm font-medium ${
                                          product.stock > 50
                                            ? "text-green-600"
                                            : product.stock > 20
                                            ? "text-yellow-600"
                                            : "text-red-600"
                                        }`}
                                      >
                                        {product.stock}
                                      </div>
                                      <button
                                        onClick={() =>
                                          handleStartEdit(
                                            product.id,
                                            "stock",
                                            product.stock
                                          )
                                        }
                                        className="ml-1 text-gray-400 hover:text-blue-600"
                                      >
                                        <Edit size={12} />
                                      </button>
                                    </div>
                                  )}
                                </div>

                                <div>
                                  <p className="text-xs text-gray-500">Price</p>
                                  {editingId === product.id &&
                                  editingField === "price" ? (
                                    <div className="flex items-center">
                                      <input
                                        type="number"
                                        value={editingValue}
                                        onChange={(e) =>
                                          setEditingValue(e.target.value)
                                        }
                                        className="text-sm text-gray-900 border border-gray-300 rounded px-2 py-1 w-24"
                                        min="0"
                                        step="0.01"
                                        autoFocus
                                      />
                                      <div className="ml-2 flex">
                                        <button
                                          onClick={handleSaveEdit}
                                          className="text-green-600 hover:text-green-800 mr-1"
                                        >
                                          <CheckCircle size={16} />
                                        </button>
                                        <button
                                          onClick={handleCancelEdit}
                                          className="text-red-600 hover:text-red-800"
                                        >
                                          <XCircle size={16} />
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center">
                                      <div className="text-sm font-medium text-gray-900">
                                        {formatCurrency(product.price)}
                                      </div>
                                      <button
                                        onClick={() =>
                                          handleStartEdit(
                                            product.id,
                                            "price",
                                            product.price
                                          )
                                        }
                                        className="ml-1 text-gray-400 hover:text-blue-600"
                                      >
                                        <Edit size={12} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                                <div className="text-xs text-gray-500">
                                  Updated: {formatDate(product.updatedAt)}
                                </div>
                                <button
                                  onClick={() => confirmDelete(product.id)}
                                  className="text-red-600 hover:text-red-900 transition-colors p-1"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No products found.{" "}
                          {searchTerm && "Try adjusting your search."}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Products table - Desktop version */}
                  <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Product
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Category
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Stock
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Last Updated
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <tr
                              key={product.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <img
                                      className="h-10 w-10 rounded-md object-cover"
                                      src={product.imageUrl}
                                      alt={product.name}
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80";
                                      }}
                                    />
                                  </div>
                                  <div className="ml-4">
                                    {editingId === product.id &&
                                    editingField === "name" ? (
                                      <div className="flex items-center">
                                        <input
                                          type="text"
                                          value={editingValue}
                                          onChange={(e) =>
                                            setEditingValue(e.target.value)
                                          }
                                          className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1 w-48"
                                          autoFocus
                                          onKeyPress={(e) =>
                                            handleKeyPress(e, handleSaveEdit)
                                          }
                                        />
                                        <div className="ml-2 flex">
                                          <button
                                            onClick={handleSaveEdit}
                                            className="text-green-600 hover:text-green-800 mr-1"
                                          >
                                            <CheckCircle size={18} />
                                          </button>
                                          <button
                                            onClick={handleCancelEdit}
                                            className="text-red-600 hover:text-red-800"
                                          >
                                            <XCircle size={18} />
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center">
                                        <div className="text-sm font-medium text-gray-900">
                                          {product.name}
                                        </div>
                                        <button
                                          onClick={() =>
                                            handleStartEdit(
                                              product.id,
                                              "name",
                                              product.name
                                            )
                                          }
                                          className="ml-2 text-gray-400 hover:text-blue-600"
                                        >
                                          <Edit size={14} />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {editingId === product.id &&
                                editingField === "category" ? (
                                  <div className="flex items-center">
                                    <input
                                      type="text"
                                      value={editingValue}
                                      onChange={(e) =>
                                        setEditingValue(e.target.value)
                                      }
                                      className="text-sm text-gray-500 border border-gray-300 rounded px-2 py-1 w-32"
                                      list="edit-categories"
                                      autoFocus
                                      onKeyPress={(e) =>
                                        handleKeyPress(e, handleSaveEdit)
                                      }
                                    />
                                    <datalist id="edit-categories">
                                      {categories.map((category, index) => (
                                        <option key={index} value={category} />
                                      ))}
                                    </datalist>
                                    <div className="ml-2 flex">
                                      <button
                                        onClick={handleSaveEdit}
                                        className="text-green-600 hover:text-green-800 mr-1"
                                      >
                                        <CheckCircle size={18} />
                                      </button>
                                      <button
                                        onClick={handleCancelEdit}
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        <XCircle size={18} />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <div className="text-sm text-gray-500 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                                      {product.category}
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleStartEdit(
                                          product.id,
                                          "category",
                                          product.category
                                        )
                                      }
                                      className="ml-2 text-gray-400 hover:text-blue-600"
                                    >
                                      <Edit size={14} />
                                    </button>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {editingId === product.id &&
                                editingField === "stock" ? (
                                  <div className="flex items-center">
                                    <input
                                      type="number"
                                      value={editingValue}
                                      onChange={(e) =>
                                        setEditingValue(e.target.value)
                                      }
                                      className="text-sm text-gray-900 border border-gray-300 rounded px-2 py-1 w-20"
                                      min="0"
                                      autoFocus
                                      onKeyPress={(e) =>
                                        handleKeyPress(e, handleSaveEdit)
                                      }
                                    />
                                    <div className="ml-2 flex">
                                      <button
                                        onClick={handleSaveEdit}
                                        className="text-green-600 hover:text-green-800 mr-1"
                                      >
                                        <CheckCircle size={18} />
                                      </button>
                                      <button
                                        onClick={handleCancelEdit}
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        <XCircle size={18} />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <div
                                      className={`text-sm font-medium ${
                                        product.stock > 50
                                          ? "text-green-600"
                                          : product.stock > 20
                                          ? "text-yellow-600"
                                          : "text-red-600"
                                      }`}
                                    >
                                      {product.stock}
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleStartEdit(
                                          product.id,
                                          "stock",
                                          product.stock
                                        )
                                      }
                                      className="ml-2 text-gray-400 hover:text-blue-600"
                                    >
                                      <Edit size={14} />
                                    </button>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {editingId === product.id &&
                                editingField === "price" ? (
                                  <div className="flex items-center">
                                    <input
                                      type="number"
                                      value={editingValue}
                                      onChange={(e) =>
                                        setEditingValue(e.target.value)
                                      }
                                      className="text-sm text-gray-900 border border-gray-300 rounded px-2 py-1 w-24"
                                      min="0"
                                      step="0.01"
                                      autoFocus
                                      onKeyPress={(e) =>
                                        handleKeyPress(e, handleSaveEdit)
                                      }
                                    />
                                    <div className="ml-2 flex">
                                      <button
                                        onClick={handleSaveEdit}
                                        className="text-green-600 hover:text-green-800 mr-1"
                                      >
                                        <CheckCircle size={18} />
                                      </button>
                                      <button
                                        onClick={handleCancelEdit}
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        <XCircle size={18} />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <div className="text-sm text-gray-900">
                                      {formatCurrency(product.price)}
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleStartEdit(
                                          product.id,
                                          "price",
                                          product.price
                                        )
                                      }
                                      className="ml-2 text-gray-400 hover:text-blue-600"
                                    >
                                      <Edit size={14} />
                                    </button>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(product.updatedAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => confirmDelete(product.id)}
                                  className="text-red-600 hover:text-red-900 transition-colors"
                                  aria-label="Delete product"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-6 py-4 text-center text-sm text-gray-500"
                            >
                              No products found.{" "}
                              {searchTerm && "Try adjusting your search."}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <>
                  {/* Charts and insights */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Stock level chart */}
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                        Stock Levels
                      </h3>
                      <div
                        className="h-60 sm:h-64 overflow-x-auto   pb-3"
                        ref={chartContainerRef}
                      >
                        <div className="min-w-[370px] h-full">
                          {renderBarChart(chartData.stockData)}
                        </div>
                      </div>
                    </div>

                    {/* Category distribution */}
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6 pb-8">
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                        Category Distribution
                      </h3>
                      <div className="h-60 sm:h-64">
                        {renderPieChart(chartData.categoryData)}
                      </div>
                    </div>

                    {/* Monthly sales trend */}
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:col-span-2">
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                        Monthly Revenue Trend
                      </h3>
                      <div className="h-60 sm:h-72">
                        {renderLineChart(chartData.monthlyData)}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  };

  return (
    <div
      className="font-sans antialiased"
      style={{ fontFamily: "var(--font-roboto), sans-serif" }}
    >
      {/* Navbar */}
      {renderNavbar()}

      {/* Main content */}
      {activePage === "home" ? renderLandingPage() : renderDashboard()}

      {/* Modals */}
      {isLoginModalOpen && renderLoginModal()}
      {isAddModalOpen && renderAddProductModal()}
      {isDeleteModalOpen && renderDeleteModal()}
    </div>
  );
}

// Zod Schema
export const Schema = {
    "commentary": "",
    "template": "nextjs-developer",
    "title": "Product Inventory Manager",
    "description": "A modern inventory management application",
    "additional_dependencies": [
        "lucide-react",
        "recharts"
    ],
    "has_additional_dependencies": true,
    "install_dependencies_command": "npm install lucide-react recharts",
    "port": 3000,
    "file_path": "app/page.tsx",
    "code": "<see code above>"
}
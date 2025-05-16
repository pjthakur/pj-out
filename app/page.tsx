"use client"
import { useState, useEffect, useRef, useCallback } from "react";
import { FaStar, FaCartPlus, FaShoppingBag, FaCheckCircle, FaRegEye, FaCheckSquare, FaMoon, FaSun, FaThumbsUp, FaRegThumbsUp, FaThumbsDown, FaRegThumbsDown, FaExclamationCircle, FaBars, FaTimes, FaLaptop, FaMobile, FaHeadphones, FaTabletAlt, FaClock } from 'react-icons/fa';
import { Inter, Poppins, Montserrat } from 'next/font/google';
import { motion, AnimatePresence, useAnimation, Variants } from 'framer-motion';
import React from 'react';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
});

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

interface ReviewAction {
  reviewId: string;
  action: 'helpful' | 'notHelpful';
}

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  storage: string;
  ram: string;
  processor: string;
  camera: string;
  battery: string;
  display: string;
  warranty: string;
  colors: string[];
  availability: string;
  features: {
    os: string;
    screenSize: string;
    waterResistant: boolean;
    dustResistant: boolean;
    cpuCores: number;
    frontCamera: string;
    storageOptions: string;
    value: number;
    quality: number;
    popularity: number;
  };
}

const mockReviews: Record<string, { id: string; user: string; rating: number; title: string; text: string; date: string; helpful: number; notHelpful: number; }[]> = {
  "iphone-15-pro": [
    { id: "ip-rev-1", user: "Amit S.", rating: 5, title: "Amazing Camera", text: "The camera quality is top-notch. Battery lasts all day.", date: "2 days ago", helpful: 12, notHelpful: 1 },
    { id: "ip-rev-2", user: "Priya R.", rating: 4, title: "Great but Pricey", text: "Performance is smooth, but a bit expensive.", date: "1 week ago", helpful: 8, notHelpful: 2 },
    { id: "ip-rev-3", user: "Rahul K.", rating: 5, title: "Best iPhone Yet", text: "Loving the new design and features.", date: "3 weeks ago", helpful: 15, notHelpful: 0 }
  ],
  "samsung-s24-ultra": [
    { id: "s24-rev-1", user: "Sneha M.", rating: 5, title: "Superb Display", text: "The display is vibrant and the battery is solid.", date: "1 day ago", helpful: 10, notHelpful: 1 },
    { id: "s24-rev-2", user: "Vikram D.", rating: 4, title: "Feature Packed", text: "Camera zoom is incredible. UI could be better.", date: "5 days ago", helpful: 7, notHelpful: 1 },
    { id: "s24-rev-3", user: "Anjali P.", rating: 5, title: "Loving It!", text: "Best Android phone I have used so far.", date: "2 weeks ago", helpful: 11, notHelpful: 0 }
  ],
  "oneplus-12": [
    { id: "op-rev-1", user: "Karan J.", rating: 4, title: "Value for Money", text: "Great specs for the price. Fast charging is awesome.", date: "3 days ago", helpful: 9, notHelpful: 1 },
    { id: "op-rev-2", user: "Megha S.", rating: 5, title: "Excellent Performance", text: "No lags, smooth UI, and good battery.", date: "1 week ago", helpful: 6, notHelpful: 0 },
    { id: "op-rev-3", user: "Deepak T.", rating: 4, title: "Solid Build", text: "Feels premium in hand. Camera is decent.", date: "2 weeks ago", helpful: 5, notHelpful: 2 }
  ]
};

const mockSellers: Record<string, { name: string; rating: number; reviews: number; delivery: string; warranty: string; location: string; }[]> = {
  "iphone-15-pro": [
    { name: "TrustedConfidant", rating: 4.8, reviews: 1200, delivery: "Free, 1-2 days", warranty: "1 Year", location: "Mumbai" },
    { name: "iStore India", rating: 4.7, reviews: 900, delivery: "Free, 2-3 days", warranty: "1 Year", location: "Delhi" }
  ],
  "samsung-s24-ultra": [
    { name: "APTHANGLORetail", rating: 4.7, reviews: 1100, delivery: "Free, 1-2 days", warranty: "1 Year", location: "Bangalore" },
    { name: "MobileHub", rating: 4.6, reviews: 800, delivery: "Free, 2-3 days", warranty: "1 Year", location: "Hyderabad" }
  ],
  "oneplus-12": [
    { name: "OnePlus Official", rating: 4.8, reviews: 1000, delivery: "Free, 1-2 days", warranty: "1 Year", location: "Pune" },
    { name: "GadgetWorld", rating: 4.5, reviews: 700, delivery: "Free, 2-3 days", warranty: "1 Year", location: "Chennai" }
  ]
};

const suggestions = [
  {
    id: "pixel-8-pro",
    name: "Google Pixel 8 Pro",
    image: "https://images.unsplash.com/photo-1706412703794-d944cd3625b3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8UElYRUwlMjA4JTIwUFJPfGVufDB8fDB8fHww",
    price: 89999,
    rating: 4.6
  },
  {
    id: "xiaomi-14-pro",
    name: "Xiaomi 14 Pro",
    image: "https://images.unsplash.com/photo-1653674359178-57dd04935bf6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dml2byUyMHBob25lfGVufDB8fDB8fHww",
    price: 69999,
    rating: 4.5
  },
  {
    id: "vivo-x100",
    name: "Vivo X100 Pro",
    image: "https://images.unsplash.com/photo-1655356392708-c675781f1748?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8eGlhb21pJTIwcGhvbmV8ZW58MHx8MHx8fDA%3D",
    price: 79999,
    rating: 4.4
  }
];

// Mock full specification data for suggested products
const suggestedProductSpecs: Record<string, { title: string; value: string }[]> = {
  "pixel-8-pro": [
    { title: "Brand", value: "Google" },
    { title: "Model", value: "Pixel 8 Pro" },
    { title: "Color", value: "Obsidian" },
    { title: "Display", value: "6.7-inch LTPO OLED" },
    { title: "Processor", value: "Google Tensor G3" },
    { title: "RAM", value: "12 GB" },
    { title: "Storage", value: "256 GB" },
    { title: "Camera", value: "50MP + 48MP + 48MP" },
    { title: "Battery", value: "4950 mAh" },
    { title: "OS", value: "Android 14" },
    { title: "Water Resistant", value: "IP68" },
    { title: "Wireless Charging", value: "Yes" },
    { title: "Fast Charging", value: "30W" }
  ],
  "xiaomi-14-pro": [
    { title: "Brand", value: "Xiaomi" },
    { title: "Model", value: "14 Pro" },
    { title: "Color", value: "Titanium Black" },
    { title: "Display", value: "6.73-inch LTPO AMOLED" },
    { title: "Processor", value: "Snapdragon 8 Gen 3" },
    { title: "RAM", value: "12 GB" },
    { title: "Storage", value: "256 GB" },
    { title: "Camera", value: "50MP + 50MP + 50MP" },
    { title: "Battery", value: "4880 mAh" },
    { title: "OS", value: "HyperOS based on Android 14" },
    { title: "Water Resistant", value: "IP68" },
    { title: "Wireless Charging", value: "50W" },
    { title: "Fast Charging", value: "120W" }
  ],
  "vivo-x100": [
    { title: "Brand", value: "Vivo" },
    { title: "Model", value: "X100 Pro" },
    { title: "Color", value: "Asteroid Black" },
    { title: "Display", value: "6.78-inch AMOLED" },
    { title: "Processor", value: "MediaTek Dimensity 9300" },
    { title: "RAM", value: "16 GB" },
    { title: "Storage", value: "512 GB" },
    { title: "Camera", value: "50MP + 50MP + 64MP" },
    { title: "Battery", value: "5400 mAh" },
    { title: "OS", value: "Funtouch OS 14 based on Android 14" },
    { title: "Water Resistant", value: "IP68" },
    { title: "Wireless Charging", value: "50W" },
    { title: "Fast Charging", value: "100W" }
  ]
};

export default function Home() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);
  const [product1, setProduct1] = useState<string | null>('iphone-15-pro');
  const [product2, setProduct2] = useState<string | null>('samsung-s24-ultra');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeTab, setActiveTab] = useState("highlights");
  const headerRef = useRef<HTMLDivElement>(null);
  const [showSpecModal, setShowSpecModal] = useState<null | string>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [reviewActions, setReviewActions] = useState<ReviewAction[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const products: Product[] = [
    {
      id: "iphone-15-pro",
      name: "Apple iPhone 15 Pro  (Black Titanium, 128 GB",
      image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aXBob25lfGVufDB8fDB8fHww",
      price: 112900,
      originalPrice: 119900,
      discount: 5,
      rating: 4.7,
      reviews: 198,
      storage: "128 GB ROM",
      ram: "8 GB",
      processor: "A17 Pro Chip, 6 Core Processor",
      camera: "48MP Primary Camera",
      battery: "1 Year Warranty for Phone and 6 Months for Accessories",
      display: "Super Retina XDR Display, 2532 x 1170 Pixels",
      warranty: "1 Year Warranty",
      colors: ["Black Titanium", "White Titanium", "Natural Titanium", "Desert Titanium"],
      availability: "Available with 1 seller(s)",
      features: {
        os: "iOS 16",
        screenSize: "6.1 inches",
        waterResistant: true,
        dustResistant: true,
        cpuCores: 6,
        frontCamera: "12 MP",
        storageOptions: "128GB, 256GB, 512GB, 1TB",
        value: 85,
        quality: 90,
        popularity: 88
      }
    },
    {
      id: "samsung-s24-ultra",
      name: "SAMSUNG Galaxy S24 (Titanium Gray, 256 GB",
      image: "https://images.unsplash.com/photo-1610792516775-01de03eae630?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHNhbXN1bmclMjB1bHRyYXxlbnwwfHwwfHx8MA%3D%3D",
      price: 119999,
      originalPrice: 134999,
      discount: 11,
      rating: 4.6,
      reviews: 156,
      storage: "256 GB ROM",
      ram: "12 GB",
      processor: "Snapdragon 8 Gen 3 Octa Core 3.39 GHz",
      camera: "200 MP Primary Camera",
      battery: "5 Years Warranty for Device and 6 Months for Accessories",
      display: "Quad HD+, 3120 x 1440 Pixels",
      warranty: "1 Year Warranty",
      colors: ["Titanium Gray", "Titanium Black", "Titanium Violet", "Titanium Yellow"],
      availability: "Available with 2 seller(s)",
      features: {
        os: "Android 14",
        screenSize: "6.8 inches",
        waterResistant: true,
        dustResistant: true,
        cpuCores: 8,
        frontCamera: "12 MP",
        storageOptions: "256GB, 512GB, 1TB",
        value: 82,
        quality: 92,
        popularity: 85
      }
    },
  ];

  // Mock full specification data
  const mockFullSpecs: Record<string, { title: string; value: string }[]> = {
    "iphone-15-pro": [
      { title: "Brand", value: "Apple" },
      { title: "Model", value: "iPhone 15 Pro" },
      { title: "Color", value: "Black Titanium" },
      { title: "Display", value: "6.1-inch Super Retina XDR" },
      { title: "Processor", value: "A17 Pro Chip" },
      { title: "RAM", value: "8 GB" },
      { title: "Storage", value: "128 GB" },
      { title: "Camera", value: "48MP + 12MP + 12MP" },
      { title: "Battery", value: "3200 mAh" },
      { title: "OS", value: "iOS 16" },
      { title: "Water Resistant", value: "Yes" },
      { title: "Wireless Charging", value: "Yes" },
      { title: "Face ID", value: "Yes" }
    ],
    "samsung-s24-ultra": [
      { title: "Brand", value: "Samsung" },
      { title: "Model", value: "Galaxy S24 Ultra" },
      { title: "Color", value: "Titanium Gray" },
      { title: "Display", value: "6.8-inch Quad HD+" },
      { title: "Processor", value: "Snapdragon 8 Gen 3" },
      { title: "RAM", value: "12 GB" },
      { title: "Storage", value: "256 GB" },
      { title: "Camera", value: "200MP + 12MP + 50MP + 10MP" },
      { title: "Battery", value: "5000 mAh" },
      { title: "OS", value: "Android 14" },
      { title: "Water Resistant", value: "Yes" },
      { title: "Wireless Charging", value: "Yes" },
      { title: "Face Recognition", value: "Yes" }
    ],
    "oneplus-12": [
      { title: "Brand", value: "OnePlus" },
      { title: "Model", value: "12" },
      { title: "Color", value: "Flowy Emerald" },
      { title: "Display", value: "6.82-inch 2K AMOLED" },
      { title: "Processor", value: "Snapdragon 8 Gen 3" },
      { title: "RAM", value: "12 GB" },
      { title: "Storage", value: "256 GB" },
      { title: "Camera", value: "50MP + 48MP + 64MP" },
      { title: "Battery", value: "5400 mAh" },
      { title: "OS", value: "OxygenOS 14" },
      { title: "Water Resistant", value: "Yes" },
      { title: "Wireless Charging", value: "No" },
      { title: "Face Recognition", value: "Yes" }
    ]
  };

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    if (products.length >= 2) {
      setProduct1(products[0].id);
      setProduct2(products[1].id);
    }

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect to handle body scrolling when modal or mobile menu is open
  useEffect(() => {
    if (showSpecModal || mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showSpecModal, mobileMenuOpen]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const handleAddToCart = (product: Product) => {
    addToast(`Added ${product.name.split('(')[0].trim()} to cart`, 'success');
  };

  const handleBuyNow = (product: Product) => {
    addToast(`Proceeding to checkout with ${product.name.split('(')[0].trim()}`, 'success');
  };

  const handleReviewAction = useCallback((reviewId: string, action: 'helpful' | 'notHelpful') => {
    setReviewActions(prev => {
      // Check if user already performed this action
      const existingAction = prev.find(a => a.reviewId === reviewId && a.action === action);
      
      if (existingAction) {
        // If the action already exists, remove it (toggle off)
        return prev.filter(a => !(a.reviewId === reviewId && a.action === action));
      } else {
        // Remove opposite action if it exists
        const withoutOpposite = prev.filter(a => !(a.reviewId === reviewId && a.action !== action));
        // Add the new action
        return [...withoutOpposite, { reviewId, action }];
      }
    });
    
    // Show toast notification
    addToast(`You marked this review as ${action === 'helpful' ? 'helpful' : 'not helpful'}`, 'success');
  }, []);

  const isActionActive = useCallback((reviewId: string, action: 'helpful' | 'notHelpful') => {
    return reviewActions.some(a => a.reviewId === reviewId && a.action === action);
  }, [reviewActions]);

  const getAdjustedCount = useCallback((reviewId: string, originalCount: number, action: 'helpful' | 'notHelpful') => {
    const isActive = isActionActive(reviewId, action);
    return isActive ? originalCount + 1 : originalCount;
  }, [isActionActive]);

  const handleViewSuggestedDetails = (productId: string) => {
    // Find product specs
    if (suggestedProductSpecs[productId]) {
      setShowSpecModal(productId);
    } else {
      addToast(`Specifications not available`, 'error');
    }
  };

  if (!mounted) return null;

  const headerStyle = {
    transform: `translateY(${Math.min(0, -scrollPosition / 10)}px)`,
    opacity: 1 - (scrollPosition / 500),
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-gradient-to-br from-indigo-950 via-violet-950 to-indigo-900 text-white" : "bg-gradient-to-br from-violet-50 via-indigo-50 to-violet-100 text-indigo-950"
      } ${poppins.variable} ${montserrat.variable} font-sans`}>
      <style>{`
        :root {
          --font-poppins: ${poppins.style.fontFamily};
          --font-montserrat: ${montserrat.style.fontFamily};
        }
        
        .font-poppins {
          font-family: var(--font-poppins);
        }
        
        .font-montserrat {
          font-family: var(--font-montserrat);
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: var(--font-poppins);
          letter-spacing: -0.02em;
        }
        
        body {
          font-family: var(--font-montserrat);
          letter-spacing: -0.01em;
        }

        /* Glass morphism */
        .glass-light {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 8px 32px rgba(100, 100, 168, 0.07);
        }
        
        .glass-dark {
          background: rgba(30, 27, 75, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(132, 100, 247, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .glass-card-light {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 4px 24px rgba(100, 100, 168, 0.15);
        }
        
        .glass-card-dark {
          background: rgba(50, 47, 95, 0.6);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(132, 100, 247, 0.2);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
        }
        
        .product-title {
          font-family: var(--font-poppins);
          font-weight: 600;
          letter-spacing: -0.03em;
          line-height: 1.3;
        }
        
        .price-tag {
          font-family: var(--font-poppins);
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        
        .button-text {
          font-family: var(--font-montserrat);
          font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer;
        }
        
        .section-title {
          font-family: var(--font-poppins);
          font-weight: 600;
          letter-spacing: -0.01em;
        }
      `}</style>
      <header
        ref={headerRef}
        style={headerStyle}
        className={`top-0 z-50 flex justify-between items-center py-5 px-6 shadow-lg transition-all duration-300 relative overflow-hidden ${theme === "dark" ? "glass-dark border-b border-violet-800/20" : "glass-light border-b border-violet-200/30"}`}
      >
        {/* Decorative header elements */}
        <motion.div
          className="absolute top-0 left-0 w-20 h-20 bg-violet-400/10 rounded-full -ml-10 -mt-10"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        <motion.div
          className="absolute bottom-0 right-0 w-16 h-16 bg-fuchsia-400/10 rounded-full -mr-8 -mb-8"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        ></motion.div>

        <div className="flex items-center relative z-10">
          <motion.h1
            className="font-poppins text-2xl sm:text-3xl lg:text-4xl font-bold relative group tracking-tight cursor-pointer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => addToast("Home page is not available yet", 'error')}
          >
            <span className="relative z-10 inline-block bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
              Tech
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-violet-500 to-fuchsia-500"
              />
            </span>
            <span className="relative z-10 inline-block bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
              Compare
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-fuchsia-500 to-indigo-500"
              />
            </span>
            <span className={`absolute -bottom-1 left-0 w-full h-2 bg-gradient-to-r ${theme === "dark"
                ? "from-violet-500/20 via-fuchsia-500/20 to-indigo-500/20"
                : "from-violet-400/20 via-fuchsia-400/20 to-indigo-400/20"
              } rounded-full blur-sm group-hover:blur-md transition-all duration-300`}></span>
          </motion.h1>
          <div className="ml-4 hidden sm:flex space-x-5 text-sm">
            {["Electronics", "Computers", "Phones", "Accessories", "Wearables"].map((item, index) => (
              <motion.span
                key={item}
                className="font-montserrat hover:text-violet-600 dark:hover:text-violet-400 cursor-pointer transition-colors duration-200 px-3 py-1 rounded-full hover:bg-violet-50 dark:hover:bg-violet-900/20"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addToast(`${item} section is not available yet`, 'error')}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </div>
        <motion.div
          className="flex items-center space-x-4 relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* Mobile menu button */}
          <motion.button
            className="sm:hidden p-2 rounded-full transition-all duration-300 cursor-pointer"
            style={{ 
              backgroundColor: theme === "dark" ? "rgba(79, 70, 229, 0.4)" : "rgba(139, 92, 246, 0.2)",
              color: theme === "dark" ? "#A5B4FC" : "#6D28D9" 
            }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </motion.button>
          
          <motion.button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 cursor-pointer ${theme === "dark"
              ? "bg-indigo-800/40 text-indigo-200 hover:bg-indigo-700/60 backdrop-blur-md border border-indigo-700/50"
              : "bg-violet-200/80 text-violet-800 hover:bg-violet-300/80 backdrop-blur-md border border-violet-300/80"
              } shadow-lg hover:shadow-xl`}
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
          >
            {theme === "dark" ? <FaMoon /> : <FaSun />}
          </motion.button>
        </motion.div>
      </header>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div 
              className="sm:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            
            <motion.div 
              className={`sm:hidden fixed top-[70px] inset-x-0 z-40 shadow-xl ${
                theme === "dark" 
                  ? "bg-gradient-to-b from-indigo-900/95 to-violet-900/95 border-b border-indigo-800/50" 
                  : "bg-gradient-to-b from-white/95 to-violet-50/95 border-b border-violet-100/80"
              } backdrop-blur-md overflow-hidden`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-4 py-4">
                <motion.div 
                  className="w-16 h-16 rounded-full bg-violet-400/10 absolute top-0 right-0 -mr-8 -mt-8 z-0"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                ></motion.div>
                
                <motion.div 
                  className="w-20 h-20 rounded-full bg-fuchsia-400/10 absolute bottom-0 left-0 -ml-10 -mb-10 z-0"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                ></motion.div>
                
                <div className="relative z-10 space-y-1">
                  {[
                    { name: "Electronics", icon: <FaTabletAlt /> },
                    { name: "Computers", icon: <FaLaptop /> },
                    { name: "Phones", icon: <FaMobile /> },
                    { name: "Accessories", icon: <FaHeadphones /> },
                    { name: "Wearables", icon: <FaClock /> }
                  ].map((item, index) => (
                    <motion.div
                      key={item.name}
                      className={`font-montserrat py-3.5 px-5 cursor-pointer rounded-xl flex items-center gap-3 ${
                        theme === "dark"
                          ? "hover:bg-indigo-800/60 hover:text-violet-300 text-white"
                          : "hover:bg-violet-100/80 hover:text-violet-700 text-gray-800"
                      } transition-all duration-200`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index, duration: 0.3 }}
                      onClick={() => {
                        addToast(`${item.name} section is not available yet`, 'error');
                        setMobileMenuOpen(false);
                      }}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`${
                        theme === "dark" 
                          ? "bg-indigo-800/60 text-violet-300" 
                          : "bg-violet-100 text-violet-600"
                      } p-2 rounded-lg`}>
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 gap-8 sm:gap-12">
        {/* Suggestions sidebar */}
        <aside className="hidden md:block w-72 flex-shrink-0">
          <div>
            <div className={`mb-8 font-poppins text-xl font-semibold ${theme === 'dark' ? 'text-violet-300' : 'text-violet-700'} flex items-center border-b pb-3 border-violet-500/20`}>
              <span className="relative flex items-center gap-2">
                <span className={`p-1.5 rounded-full ${theme === 'dark' ? 'bg-violet-900/50' : 'bg-violet-100'}`}>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${theme === 'dark' ? 'text-violet-400' : 'text-violet-600'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                </span>
                Suggestions
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full"></span>
              </span>
            </div>
            <div className="space-y-8">
              {suggestions.map(s => (
                <motion.div
                  key={s.id}
                  className={`group relative flex flex-col p-6 rounded-2xl cursor-pointer ${theme === 'dark'
                    ? 'bg-indigo-900/40 shadow-gray-900/30 border border-violet-800/30 hover:border-violet-700/40'
                    : 'bg-white/95 shadow-xl hover:shadow-2xl border border-violet-200/40 hover:border-violet-300/60'
                    } backdrop-blur-md transition-all duration-500 overflow-hidden`}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => addToast(`${s.name} has been added to your wishlist`, 'success')}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-violet-400/5 rounded-full -mr-8 -mt-8 group-hover:bg-violet-400/10 transition-colors duration-300"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-fuchsia-400/5 rounded-full -ml-8 -mb-8 group-hover:bg-fuchsia-400/10 transition-colors duration-300"></div>
                  
                  <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 group-hover:shadow-lg transition-all duration-500">
                      <img
                        src={s.image}
                        alt={s.name}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-700"
                      />
                    <motion.div
                      className="absolute top-3 left-3 px-3 py-1.5 bg-violet-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="tracking-wider">NEW</span>
                    </motion.div>
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center ${theme === 'dark' ? 'bg-indigo-900/60' : 'bg-violet-500/30'} backdrop-blur-sm`}>
                      <div 
                        className={`px-4 py-2.5 rounded-full ${theme === 'dark' ? 'bg-violet-500/90' : 'bg-violet-600/90'} text-white font-semibold flex items-center gap-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300`}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the parent onClick
                          handleViewSuggestedDetails(s.id);
                        }}
                      >
                        <FaRegEye className="text-sm" />
                        <span className="text-sm tracking-wide">View details</span>
                  </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 relative z-10">
                    <h3 className={`font-poppins font-semibold text-lg mb-2 ${theme === 'dark' ? 'text-white group-hover:text-violet-300' : 'text-gray-800 group-hover:text-violet-700'} transition-colors duration-300`}>{s.name}</h3>
                    <div className={`text-xl font-bold ${theme === 'dark' ? 'bg-gradient-to-r from-violet-400 to-fuchsia-300' : 'bg-gradient-to-r from-violet-600 to-fuchsia-500'} bg-clip-text text-transparent mt-1 mb-3 font-poppins`}>₹{s.price?.toLocaleString()}</div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <motion.span
                            key={i}
                            className={`text-lg ${i < Math.floor(s.rating) ? (theme === 'dark' ? 'text-yellow-300' : 'text-yellow-400') : (theme === 'dark' ? 'text-gray-600' : 'text-gray-300')}`}
                            initial={false}
                            animate={i < Math.floor(s.rating) ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                          >
                            ★
                          </motion.span>
                        ))}
                      </div>
                      <span className={`font-medium px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-violet-900/50 text-violet-300' : 'bg-violet-100 text-violet-700'} text-sm`}>{s.rating}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </aside>
        {/* Main content (comparison, tabs, etc.) goes here, wrapped in a flex-1 div */}
        <div className="flex-1 relative">
          {/* Decorative background elements */}
          <motion.div
            className="hidden lg:block absolute -top-20 -right-20 w-64 h-64 bg-violet-400/5 dark:bg-violet-400/5 rounded-full"
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          ></motion.div>
          <motion.div
            className="hidden lg:block absolute top-40 -left-24 w-48 h-48 bg-fuchsia-400/5 dark:bg-fuchsia-400/5 rounded-full"
            animate={{
              y: [0, 15, 0],
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          ></motion.div>
          <motion.div
            className="hidden lg:block absolute bottom-20 right-10 w-40 h-40 bg-indigo-400/5 dark:bg-indigo-400/5 rounded-full"
            animate={{
              y: [0, -10, 0],
              x: [0, 5, 0],
              scale: [1, 1.08, 1],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          ></motion.div>

          <div className="mb-6 sm:mb-10 relative z-10">
            <div className="flex flex-col items-start">
              <h2 className="font-poppins text-xl sm:text-2xl font-bold mb-3 tracking-tight">
                <span className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>Premium Smartphone Comparison</span>
            </h2>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full ${theme === "dark" ? "bg-violet-500" : "bg-violet-600"} mr-2`}></span>
                  <span className={`font-medium ${theme === "dark" ? "text-violet-300" : "text-violet-700"}`}>Apple iPhone 15 Pro</span>
                  <span className="text-xs font-medium opacity-60 ml-1">
                    (Black Titanium, 128 GB)
                  </span>
                </div>
                
                <span className="hidden sm:inline-block text-gray-400">vs</span>
                
                <div className="flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full ${theme === "dark" ? "bg-indigo-500" : "bg-indigo-600"} mr-2`}></span>
                  <span className={`font-medium ${theme === "dark" ? "text-indigo-300" : "text-indigo-700"}`}>SAMSUNG Galaxy S24 5G</span>
                  <span className="text-xs font-medium opacity-60 ml-1">
                    (Titanium Gray, 256 GB)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">

            {product1 && product2 && (
              <>
                {[product1, product2].map((productId, index) => {
                  const product = products.find(p => p.id === productId);
                  if (!product) return null;

                  return (
                    <motion.div
                      key={product.id}
                      className={`p-0 rounded-2xl ${theme === "dark"
                        ? "bg-indigo-900/40 backdrop-blur-sm border border-indigo-800/50"
                        : "bg-white/95 backdrop-blur-sm border border-violet-100/50"
                        } relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.1 * index,
                        duration: 0.5,
                        ease: "easeOut"
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-violet-400/5 rounded-full -mr-20 -mt-20 z-0"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-400/5 rounded-full -ml-16 -mb-16 z-0"></div>
                    
                      <div className="flex flex-col relative z-10 h-full">
                          <motion.div
                          className="w-full"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4 + (0.1 * index) }}
                          >
                          <div className="relative w-full pt-[75%] overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="absolute inset-0 w-full h-full object-cover rounded-t-2xl"
                            />
                            {product.discount && (
                              <motion.div 
                                className="absolute top-4 left-4 px-3 py-1.5 bg-violet-600 text-white text-sm font-semibold rounded-full shadow-md"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.5 + (0.1 * index) }}
                              >
                                {product.discount}% OFF
                          </motion.div>
                            )}
                          </div>
                        </motion.div>
                        
                        <div className="p-6 flex flex-col flex-1">
                          <motion.h2
                            className="product-title text-xl mb-3 text-left leading-tight"
                            style={{ color: theme === "dark" ? "#F5F3FF" : "#1F1646" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 + (0.1 * index) }}
                          >
                            {product.name.split('(')[0].trim()} 
                            <span className="text-sm font-medium opacity-60" style={{ color: theme === "dark" ? "#A78BFA" : "#6D28D9" }}>
                              ({product.name.split('(')[1]?.trim() || ""})
                            </span>
                          </motion.h2>
                          
                          <div className="mb-4 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-lg p-2.5">
                            <div className="flex items-baseline gap-2">
                              <span className="price-tag text-2xl" style={{ color: theme === "dark" ? "#A78BFA" : "#6D28D9" }}>
                                ₹{product.price.toLocaleString()}
                              </span>
                              {product.originalPrice && (
                                <span className="ml-2 text-sm line-through font-medium opacity-60" style={{ color: theme === "dark" ? "#9CA3AF" : "#6B7280" }}>
                                  ₹{product.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-5">
                            <div className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ 
                              backgroundColor: theme === "dark" ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.1)",
                              color: theme === "dark" ? "#C4B5FD" : "#6D28D9" 
                            }}>
                              <FaStar className="text-sm" />
                              <span className="font-medium">{product.rating}</span>
                            </div>
                            <span className="text-sm" style={{ color: theme === "dark" ? "#9CA3AF" : "#6B7280" }}>
                              ({product.reviews} Reviews)
                            </span>
                          </div>
                          
                          <div className="mb-6 flex-1">
                            <h3 className="section-title flex items-center gap-2 mb-4 text-violet-500 font-semibold">
                              <span className="text-lg">✓</span> Highlights
                            </h3>
                            
                            <div className="grid grid-cols-[1fr_2fr] gap-y-3" style={{ color: theme === "dark" ? "#D1D5DB" : "#4B5563" }}>
                              <div className="font-medium">Storage:</div>
                              <div>{product.storage}</div>
                              <div className="font-medium">RAM:</div>
                              <div>{product.ram}</div>
                              <div className="font-medium">Processor:</div>
                              <div>{product.processor}</div>
                              <div className="font-medium">Camera:</div>
                              <div>{product.camera}</div>
                              <div className="font-medium">Display:</div>
                              <div>{product.display}</div>
                              <div className="font-medium">Warranty:</div>
                              <div>{product.warranty}</div>
                            </div>
                            </div>
                          
                          <div className="flex flex-col gap-3 mt-auto">
                          <motion.button
                              className="button-text w-full py-3.5 rounded-lg text-white flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
                              style={{ 
                                background: theme === "dark" 
                                  ? "linear-gradient(90deg, rgb(124, 58, 237) 0%, rgb(99, 102, 241) 100%)" 
                                  : "linear-gradient(90deg, rgb(124, 58, 237) 0%, rgb(99, 102, 241) 100%)",
                                boxShadow: theme === "dark" 
                                  ? "0 4px 10px rgba(124, 58, 237, 0.3)" 
                                  : "0 4px 10px rgba(124, 58, 237, 0.15)" 
                              }}
                            onClick={() => handleAddToCart(product)}
                              whileHover={{ scale: 1.02, boxShadow: "0 6px 15px rgba(124, 58, 237, 0.4)" }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FaCartPlus />
                            <span>Add to Cart</span>
                          </motion.button>
                            
                          <motion.button
                              className="button-text w-full py-3.5 rounded-lg text-white flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
                              style={{ 
                                background: theme === "dark" 
                                  ? "linear-gradient(90deg, rgb(109, 40, 217) 0%, rgb(91, 33, 182) 100%)" 
                                  : "linear-gradient(90deg, rgb(109, 40, 217) 0%, rgb(91, 33, 182) 100%)",
                                boxShadow: theme === "dark" 
                                  ? "0 4px 10px rgba(109, 40, 217, 0.3)" 
                                  : "0 4px 10px rgba(109, 40, 217, 0.15)" 
                              }}
                            onClick={() => handleBuyNow(product)}
                              whileHover={{ scale: 1.02, boxShadow: "0 6px 15px rgba(109, 40, 217, 0.4)" }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FaShoppingBag />
                            <span>Buy Now</span>
                          </motion.button>
                            
                          <motion.button
                              className="button-text w-full py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
                              style={{ 
                                backgroundColor: theme === "dark" ? "rgba(55, 65, 81, 0.6)" : "rgba(243, 244, 246, 0.9)",
                                color: theme === "dark" ? "#E5E7EB" : "#374151",
                                boxShadow: theme === "dark" ? "0 2px 5px rgba(0, 0, 0, 0.2)" : "0 2px 5px rgba(0, 0, 0, 0.05)"
                              }}
                            onClick={() => setShowSpecModal(product.id)}
                              whileHover={{ 
                                scale: 1.02,
                                backgroundColor: theme === "dark" ? "rgba(75, 85, 99, 0.6)" : "rgba(229, 231, 235, 0.9)"
                              }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FaRegEye />
                            <span>View Full Specification</span>
                          </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </>
            )}
          </div>

          <div
            className="mt-10 opacity-0 animate-fadeIn rounded-xl overflow-hidden shadow-xl"
            style={{
              animationDelay: '0.8s',
              animationFillMode: 'forwards',
              borderWidth: '1px',
              borderColor: theme === "dark" ? 'rgba(109, 40, 217, 0.2)' : 'rgba(139, 92, 246, 0.1)'
            }}
          >
            <div className={`${theme === "dark"
              ? "glass-dark"
              : "glass-light"
              }`}>
              <div className="flex border-b overflow-x-auto scrollbar-hide relative">
                {[
                  { id: "highlights", label: "Highlights" },
                  { id: "ratings", label: "Ratings & Reviews" },
                  { id: "general", label: "General Features" },
                  { id: "seller", label: "Seller" },
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium transition-colors whitespace-nowrap relative font-poppins cursor-pointer ${activeTab === tab.id
                      ? theme === "dark"
                        ? "text-violet-300"
                        : "text-violet-700"
                      : theme === "dark"
                        ? "text-gray-400 hover:text-violet-400"
                        : "text-gray-600 hover:text-violet-600"
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {activeTab === tab.id && (
                      <motion.span
                        className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-violet-500 to-fuchsia-400"
                        layoutId="activeTab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      ></motion.span>
                    )}
                    {tab.label}
                  </motion.button>
                ))}
              </div>

              {/* Highlights Tab */}
              {activeTab === "highlights" && (
                <div className="p-6 md:p-8">
                  <div className={`text-xl font-semibold mb-8 font-poppins ${theme === "dark" ? "text-violet-300" : "text-violet-700"}`}>Key Features</div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {product1 && product2 && (
                      <>
                        {[product1, product2].map((productId, idx) => {
                          const product = products.find(p => p.id === productId);
                          if (!product) return null;

                          return (
                            <div key={product.id}>
                              <div className="md:hidden text-lg font-semibold text-left mb-4 font-poppins">
                                <h3 className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                                  {product.name.split('(')[0].trim()}
                                  <span className="text-sm font-medium opacity-60 ml-1">
                                    ({product.name.split('(')[1]?.trim() || ""})
                                  </span>
                                </h3>
                              </div>

                              <div className="space-y-4">
                                <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-indigo-900/30" : "bg-indigo-50/70"} border ${theme === "dark" ? "border-violet-800/20" : "border-violet-100"}`}>
                                  <div className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"} font-montserrat`}>Storage</div>
                                  <div className={`text-base font-semibold mt-1 ${theme === "dark" ? "text-white" : "text-gray-900"} font-poppins`}>{product.storage}</div>
                                </div>

                                <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-indigo-900/30" : "bg-indigo-50/70"} border ${theme === "dark" ? "border-violet-800/20" : "border-violet-100"}`}>
                                  <div className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"} font-montserrat`}>RAM</div>
                                  <div className={`text-base font-semibold mt-1 ${theme === "dark" ? "text-white" : "text-gray-900"} font-poppins`}>{product.ram}</div>
                                </div>

                                <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-indigo-900/30" : "bg-indigo-50/70"} border ${theme === "dark" ? "border-violet-800/20" : "border-violet-100"}`}>
                                  <div className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"} font-montserrat`}>Processor</div>
                                  <div className={`text-base font-semibold mt-1 ${theme === "dark" ? "text-white" : "text-gray-900"} font-poppins`}>{product.processor}</div>
                                </div>

                                <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-indigo-900/30" : "bg-indigo-50/70"} border ${theme === "dark" ? "border-violet-800/20" : "border-violet-100"}`}>
                                  <div className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"} font-montserrat`}>Camera</div>
                                  <div className={`text-base font-semibold mt-1 ${theme === "dark" ? "text-white" : "text-gray-900"} font-poppins`}>{product.camera}</div>
                                </div>

                                <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-indigo-900/30" : "bg-indigo-50/70"} border ${theme === "dark" ? "border-violet-800/20" : "border-violet-100"}`}>
                                  <div className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"} font-montserrat`}>Display</div>
                                  <div className={`text-base font-semibold mt-1 ${theme === "dark" ? "text-white" : "text-gray-900"} font-poppins`}>{product.display}</div>
                                </div>

                                <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-indigo-900/30" : "bg-indigo-50/70"} border ${theme === "dark" ? "border-violet-800/20" : "border-violet-100"}`}>
                                  <div className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"} font-montserrat`}>Battery</div>
                                  <div className={`text-base font-semibold mt-1 ${theme === "dark" ? "text-white" : "text-gray-900"} font-poppins`}>{product.battery}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>

                  <div className="mt-12">
                    <div className={`text-xl font-semibold mb-8 font-poppins ${theme === "dark" ? "text-violet-300" : "text-violet-700"}`}>Comparison Metrics</div>

                    <div className="space-y-8">
                      <div className="grid grid-cols-[1fr_1fr_1fr] gap-6 items-center">
                        <div className={`text-base font-medium font-poppins ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Value for Money</div>

                        {product1 && product2 && (
                          <>
                            {[product1, product2].map(productId => {
                              const product = products.find(p => p.id === productId);
                              if (!product) return null;

                              return (
                                <div key={`value-${product.id}`}>
                                  <div className={`w-full h-7 rounded-full overflow-hidden ${theme === "dark" ? "bg-indigo-900/50 backdrop-blur-sm" : "bg-indigo-100/50 backdrop-blur-sm"}`}>
                                    <div
                                      className={`h-7 rounded-full ${theme === "dark" ? "bg-gradient-to-r from-violet-600/90 to-indigo-600/90" : "bg-gradient-to-r from-violet-500 to-indigo-500"} flex items-center justify-start pl-3 text-sm font-medium text-white font-montserrat`}
                                      style={{ width: `${product.features.value}%` }}
                                    >
                                      {product.features.value}%
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        )}
                      </div>

                      <div className="grid grid-cols-[1fr_1fr_1fr] gap-6 items-center">
                        <div className={`text-base font-medium font-poppins ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Build Quality</div>

                        {product1 && product2 && (
                          <>
                            {[product1, product2].map(productId => {
                              const product = products.find(p => p.id === productId);
                              if (!product) return null;

                              return (
                                <div key={`quality-${product.id}`}>
                                  <div className={`w-full h-7 rounded-full overflow-hidden ${theme === "dark" ? "bg-indigo-900/50 backdrop-blur-sm" : "bg-indigo-100/50 backdrop-blur-sm"}`}>
                                    <div
                                      className={`h-7 rounded-full ${theme === "dark" ? "bg-gradient-to-r from-violet-600/90 to-indigo-600/90" : "bg-gradient-to-r from-violet-500 to-indigo-500"} flex items-center justify-start pl-3 text-sm font-medium text-white font-montserrat`}
                                      style={{ width: `${product.features.quality}%` }}
                                    >
                                      {product.features.quality}%
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        )}
                      </div>

                      <div className="grid grid-cols-[1fr_1fr_1fr] gap-6 items-center">
                        <div className={`text-base font-medium font-poppins ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Market Share</div>

                        {product1 && product2 && (
                          <>
                            {[product1, product2].map(productId => {
                              const product = products.find(p => p.id === productId);
                              if (!product) return null;

                              return (
                                <div key={`popularity-${product.id}`}>
                                  <div className={`w-full h-7 rounded-full overflow-hidden ${theme === "dark" ? "bg-indigo-900/50 backdrop-blur-sm" : "bg-indigo-100/50 backdrop-blur-sm"}`}>
                                    <div
                                      className={`h-7 rounded-full ${theme === "dark" ? "bg-gradient-to-r from-violet-600/90 to-indigo-600/90" : "bg-gradient-to-r from-violet-500 to-indigo-500"} flex items-center justify-start pl-3 text-sm font-medium text-white font-montserrat`}
                                      style={{ width: `${product.features.popularity}%` }}
                                    >
                                      {product.features.popularity}%
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Ratings & Reviews Tab */}
              {activeTab === "ratings" && (
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {product1 && product2 && (
                      <>
                        {[product1, product2].map(productId => {
                          const product = products.find(p => p.id === productId);
                          if (!product) return null;
                          const reviews = mockReviews[productId] || [];
                          return (
                            <div key={product.id} className="text-left">
                              <div className={`font-poppins font-semibold text-lg mb-4 ${theme === "dark" ? "text-violet-300" : "text-violet-700"}`}>
                                {product.name.split('(')[0].trim()}
                                <span className="text-sm font-medium opacity-60 ml-1">
                                  ({product.name.split('(')[1]?.trim() || ""})
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-opacity-30" style={{
                                backgroundColor: theme === "dark" ? "rgba(79, 70, 229, 0.1)" : "rgba(124, 58, 237, 0.05)",
                                borderLeft: `3px solid ${theme === "dark" ? "#8B5CF6" : "#7C3AED"}`
                              }}>
                                <div className="text-4xl font-poppins font-bold" style={{ color: theme === "dark" ? "#A78BFA" : "#7C3AED" }}>
                                  {product.rating}
                                </div>
                                <div>
                                  <div className="flex text-amber-400 mb-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <span key={star} className={star <= Math.floor(product.rating) ? "text-amber-400" : "text-gray-300"}>★</span>
                                    ))}
                                  </div>
                                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Based on {product.reviews} reviews
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-5">
                                {reviews.map((review, idx) => (
                                  <div key={idx} className={`p-5 rounded-lg ${theme === "dark" ? "bg-indigo-900/20 border border-indigo-900/40" : "bg-white border border-violet-100"} shadow-sm text-left`}>
                                    <div className="flex justify-between mb-3">
                                      <div className="flex items-center">
                                        <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${review.rating >= 4
                                          ? theme === "dark"
                                            ? 'bg-violet-900/60 text-violet-200'
                                            : 'bg-violet-100 text-violet-800'
                                          : theme === "dark"
                                            ? 'bg-amber-900/60 text-amber-200'
                                            : 'bg-amber-100 text-amber-800'
                                          }`}>
                                          {review.rating}
                                          <span className="ml-1 text-amber-400">★</span>
                                        </div>
                                        <div className="ml-3 font-poppins font-medium text-base">{review.title}</div>
                                      </div>
                                      <div className="text-xs font-medium opacity-70 font-montserrat">{review.date}</div>
                                    </div>
                                    <div className="text-xs mb-2 opacity-60 font-montserrat">by {review.user}</div>
                                    <p className="text-sm mb-3 font-montserrat leading-relaxed opacity-90">{review.text}</p>
                                    <div className="flex mt-3 text-xs font-medium">
                                      <div 
                                        className="mr-5 flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                                        style={{ color: theme === "dark" ? "#A78BFA" : "#7C3AED" }}
                                        onClick={() => handleReviewAction(review.id, 'helpful')}
                                      >
                                        {isActionActive(review.id, 'helpful') ? (
                                          <FaThumbsUp className="h-4 w-4 mr-1" />
                                        ) : (
                                          <FaRegThumbsUp className="h-4 w-4 mr-1" />
                                        )}
                                        Helpful ({getAdjustedCount(review.id, review.helpful, 'helpful')})
                                      </div>
                                      <div 
                                        className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                                        style={{ color: theme === "dark" ? "#A78BFA" : "#7C3AED" }}
                                        onClick={() => handleReviewAction(review.id, 'notHelpful')}
                                      >
                                        {isActionActive(review.id, 'notHelpful') ? (
                                          <FaThumbsDown className="h-4 w-4 mr-1" />
                                        ) : (
                                          <FaRegThumbsDown className="h-4 w-4 mr-1" />
                                        )}
                                        Not Helpful ({getAdjustedCount(review.id, review.notHelpful, 'notHelpful')})
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* General Features Tab */}
              {activeTab === "general" && (
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    

                    {/* --- NEW TABLE-STYLE GRID --- */}
                    <div className="col-span-1 sm:col-span-3 w-full">
                      <div className="overflow-x-auto">
                        <div className="grid grid-cols-3 min-w-[600px] rounded-xl overflow-hidden border border-violet-500/10">
                          {/* Header Row */}
                          <div className={`p-4 font-semibold text-base ${theme === "dark" ? "bg-violet-900/40 text-violet-300" : "bg-violet-50 text-violet-700"}`}>Specifications</div>
                          {product1 && (
                            <div className={`p-4 font-semibold text-base ${theme === "dark" ? "bg-violet-900/40 text-white" : "bg-violet-50 text-violet-700"}`}>
                              {products.find(p => p.id === product1)?.name.split('(')[0].trim()} <span className="font-normal opacity-60">({products.find(p => p.id === product1)?.name.split('(')[1]?.trim()})</span>
                            </div>
                          )}
                          {product2 && (
                            <div className={`p-4 font-semibold text-base ${theme === "dark" ? "bg-violet-900/40 text-white" : "bg-violet-50 text-violet-700"}`}>
                              {products.find(p => p.id === product2)?.name.split('(')[0].trim()} <span className="font-normal opacity-60">({products.find(p => p.id === product2)?.name.split('(')[1]?.trim()})</span>
                            </div>
                          )}

                          {/* Data Rows */}
                          {[
                            { label: "SIM Type", v1: "Dual SIM (Nano)", v2: "Dual SIM (Nano)" },
                            { label: "OS", v1: products.find(p => p.id === product1)?.features.os, v2: products.find(p => p.id === product2)?.features.os },
                            { label: "Network Type", v1: "5G, 4G VOLTE, 4G, 3G", v2: "5G, 4G VOLTE, 4G, 3G" },
                            { label: "Screen Size", v1: products.find(p => p.id === product1)?.features.screenSize, v2: products.find(p => p.id === product2)?.features.screenSize },
                            { label: "Resolution", v1: products.find(p => p.id === product1)?.display, v2: products.find(p => p.id === product2)?.display },
                            { label: "Internal Storage", v1: products.find(p => p.id === product1)?.storage, v2: products.find(p => p.id === product2)?.storage },
                            { label: "RAM", v1: products.find(p => p.id === product1)?.ram, v2: products.find(p => p.id === product2)?.ram },
                            { label: "Primary Camera", v1: products.find(p => p.id === product1)?.camera, v2: products.find(p => p.id === product2)?.camera },
                            { label: "Front Camera", v1: products.find(p => p.id === product1)?.features.frontCamera, v2: products.find(p => p.id === product2)?.features.frontCamera },
                          ].map((row, idx) => (
                            <React.Fragment key={row.label || idx}>
                              <div className={`p-4 font-medium ${theme === "dark" ? "bg-violet-950/40 text-violet-200" : "bg-violet-50/60 text-violet-700"}`}>{row.label}</div>
                              <div className={`p-4 ${theme === "dark" ? "bg-indigo-900/40 text-white" : "bg-white text-gray-900"}`}>{row.v1}</div>
                              <div className={`p-4 ${theme === "dark" ? "bg-indigo-900/40 text-white" : "bg-white text-gray-900"}`}>{row.v2}</div>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Seller Tab */}
              {activeTab === "seller" && (
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:block hidden">
                      <div className={`p-5 rounded-xl ${theme === "dark" ? "glass-card-dark" : "glass-card-light"} h-full flex flex-col justify-between relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-violet-400/10 rounded-full -mr-8 -mt-8 z-0"></div>
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-fuchsia-400/10 rounded-full -ml-10 -mb-10 z-0"></div>
                        <div className="relative z-10">
                          <div className="font-medium text-lg mb-4 pb-2 border-b border-violet-500/20">About Our Sellers</div>
                          <div className="text-sm mb-8">
                          All sellers on TechCompare are verified and must meet our quality standards. You can choose your preferred seller based on ratings, price, and service options.
                        </div>
                        </div>
                        <div className="space-y-4 mt-auto relative z-10">
                          <div className="flex items-center">
                            <div className={`p-2 ${theme === "dark" ? "bg-violet-800/50" : "bg-violet-100"} rounded-full mr-3`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${theme === "dark" ? "text-violet-300" : "text-violet-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            </div>
                            <span className="text-sm">7-day Replacement Guarantee</span>
                          </div>
                          <div className="flex items-center">
                            <div className={`p-2 ${theme === "dark" ? "bg-violet-800/50" : "bg-violet-100"} rounded-full mr-3`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${theme === "dark" ? "text-violet-300" : "text-violet-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            </div>
                            <span className="text-sm">Genuine Products</span>
                          </div>
                          <div className="flex items-center">
                            <div className={`p-2 ${theme === "dark" ? "bg-violet-800/50" : "bg-violet-100"} rounded-full mr-3`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${theme === "dark" ? "text-violet-300" : "text-violet-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            </div>
                            <span className="text-sm">Secure Payments</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {product1 && product2 && (
                      <>
                        {[product1, product2].map(productId => {
                          const product = products.find(p => p.id === productId);
                          if (!product) return null;
                          const sellers = mockSellers[productId] || [];
                          return (
                            <div key={product.id} className="space-y-4">
                              {sellers.map((seller, idx) => (
                                <div key={idx} className={`p-5 rounded-xl ${theme === "dark" ? "glass-card-dark" : "glass-card-light"} mb-4 h-[calc(50%-8px)] relative overflow-hidden`}>
                                  {idx === 0 && <div className="absolute top-0 right-0 w-16 h-16 bg-violet-400/10 rounded-full -mr-6 -mt-6 z-0"></div>}
                                  {idx === 1 && <div className="absolute bottom-0 left-0 w-16 h-16 bg-fuchsia-400/10 rounded-full -ml-6 -mb-6 z-0"></div>}
                                  <div className="relative z-10">
                                    <div className="flex items-center mb-4">
                                      <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center mr-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${theme === "dark" ? "text-violet-400" : "text-violet-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                      </svg>
                                    </div>
                                    <div>
                                        <div className={`font-medium text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{seller.name}</div>
                                      <div className="flex items-center">
                                        <div className={`${theme === "dark" ? "bg-violet-900 text-violet-200" : "bg-violet-100 text-violet-800"} text-xs px-1.5 py-0.5 rounded`}>
                                          {seller.rating} ★
                                        </div>
                                        <div className={`text-xs ml-2 ${theme === "dark" ? "text-violet-300" : "text-violet-500"}`}>{seller.reviews} reviews</div>
                                      </div>
                                      <div className={`text-xs ${theme === "dark" ? "text-violet-300" : "text-violet-400"}`}>{seller.location}</div>
                                    </div>
                                  </div>
                                    <div className="flex justify-between text-sm mb-3 pt-3 border-t border-violet-500/10">
                                    <span>Delivery</span>
                                      <span className="font-medium text-green-500">{seller.delivery}</span>
                                  </div>
                                    <div className="flex justify-between text-sm">
                                    <span>Warranty</span>
                                    <span className="font-medium">{seller.warranty}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
              )}


            </div>
          </div>
        </div>
      </main>


      {/* Modal component */}
      <AnimatePresence>
        {showSpecModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`w-full max-w-xl mx-auto bg-white/90 dark:bg-indigo-900/80 backdrop-blur-lg rounded-xl shadow-2xl p-4 sm:p-6 relative border border-white/30 dark:border-indigo-700/50`}
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-400/10 dark:bg-violet-600/10 rounded-full -mr-16 -mt-16 z-0"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-fuchsia-400/10 dark:bg-fuchsia-600/10 rounded-full -ml-12 -mb-12 z-0"></div>

              <motion.button
                className="absolute top-3 right-3 text-violet-400 hover:text-violet-600 dark:hover:text-violet-400 text-2xl cursor-pointer"
                onClick={() => setShowSpecModal(null)}
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.8 }}
              >
                ×
              </motion.button>
              <div className="relative z-10">
                <motion.h2
                  className="text-xl font-bold mb-4 text-violet-600 dark:text-violet-400 pr-6 flex items-center gap-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.span
                    className="p-1.5 bg-violet-100 dark:bg-violet-900/50 rounded-md"
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  >
                    <FaRegEye className="text-violet-500 dark:text-violet-400" />
                  </motion.span>
                  Full Specifications
                </motion.h2>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {(suggestedProductSpecs[showSpecModal] || mockFullSpecs[showSpecModal])?.map((spec, idx) => (
                    <motion.div
                      key={idx}
                      className="flex justify-between py-2 text-sm hover:bg-violet-50/50 dark:hover:bg-violet-900/20 px-2 rounded-md transition-colors group"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + (idx * 0.03) }}
                      whileHover={{ x: 5 }}
                    >
                      <span className="font-medium text-indigo-700 dark:text-violet-200 flex items-center gap-1.5">
                        <motion.span
                          className="w-1.5 h-1.5 bg-violet-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        ></motion.span>
                        {spec.title}
                      </span>
                      <span className="text-violet-600 dark:text-violet-300">{spec.value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast notifications */}
      <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col items-end space-y-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              className={`px-4 py-3 rounded-lg shadow-lg max-w-xs backdrop-blur-lg flex items-center space-x-2 border ${
                toast.type === 'success'
                  ? 'bg-violet-600/90 text-white border-violet-500/30'
                  : 'bg-red-600/90 text-white border-red-500/30'
                }`}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                {toast.type === 'success' && <FaCheckSquare className="text-white text-lg" />}
                {toast.type === 'error' && (
                  <FaExclamationCircle className="text-white text-lg" />
                )}
              </motion.div>
              <span className="font-medium">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <style jsx global>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes zoomIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
      }
      
      @keyframes growWidth {
        from { width: 0; }
        to { width: var(--final-width); }
      }
      
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
      
      @keyframes pulse {
        0% { opacity: 0.6; transform: scale(0.98); }
        50% { opacity: 1; transform: scale(1.02); }
        100% { opacity: 0.6; transform: scale(0.98); }
      }
      
      .animate-fadeIn {
        animation: fadeIn 0.5s ease-out;
      }
      
      .animate-zoomIn {
        animation: zoomIn 0.5s ease-out;
      }
      
      .animate-growWidth {
        animation: growWidth 1s ease-out;
      }
      
      .animate-float {
        animation: float 3s ease-in-out infinite;
      }
      
      .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      
      .shimmer {
        background: linear-gradient(90deg, 
                    rgba(255,255,255,0) 0%, 
                    rgba(255,255,255,0.2) 25%, 
                    rgba(255,255,255,0.2) 50%, 
                    rgba(255,255,255,0) 100%);
        background-size: 200% 100%;
        animation: shimmer 2s infinite;
      }
      
      .dark .shimmer {
        background: linear-gradient(90deg, 
                    rgba(0,0,0,0) 0%, 
                    rgba(255,255,255,0.1) 25%, 
                    rgba(255,255,255,0.1) 50%, 
                    rgba(0,0,0,0) 100%);
        background-size: 200% 100%;
        animation: shimmer 2s infinite;
      }
      
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      
      /* Glass morphism */
      .glass {
        background: rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        border: 1px solid rgba(255, 255, 255, 0.18);
      }
      
      .dark .glass {
        background: rgba(17, 25, 40, 0.75);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
    `}</style>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { FaStar, FaStarHalfAlt, FaMoon, FaSun, FaCheck, FaTimes, FaArrowRight, FaShoppingCart, FaHeart, FaTruck, FaShieldAlt, FaInfoCircle, FaVolumeUp, FaHeadphones, FaBatteryFull, FaDollarSign, FaCircle, FaWaveSquare, FaRandom, FaBolt, FaWeightHanging, FaWifi, FaPalette, FaInfo, FaUser, FaCalendarAlt, FaThumbsUp, FaSortAmountDown, FaFilter, FaBars } from "react-icons/fa";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

type Theme = "light" | "dark";

type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  description: string;
  inStock: boolean;
  delivery: string;
  warranty: string;
  features: {
    name: string;
    included: boolean;
  }[];
  specs: {
    [key: string]: string;
  };
  inWishlist?: boolean;
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const containerAnimation = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
      ease: "easeOut",
      duration: 0.5,
    },
  },
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const Rating = ({ value, reviewCount }: { value: number; reviewCount: number }) => {
  const stars = [];
  const fullStars = Math.floor(value);
  const hasHalfStar = value - fullStars >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<FaStar key={i} className="text-yellow-500" />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
    } else {
      stars.push(<FaStar key={i} className="text-gray-300" />);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      <span className="text-sm ml-1">({reviewCount})</span>
    </div>
  );
};
const FeatureItem = ({ feature, included }: { feature: string; included: boolean }) => (
  <div className="flex items-center gap-2 mb-2">
    {included ? (
      <FaCheck className="text-green-500 shrink-0" />
    ) : (
      <FaTimes className="text-red-500 shrink-0" />
    )}
    <span className="text-sm">{feature}</span>
  </div>
);

const Header = ({
  theme,
  onNavClick,
  onCartClick,
  cartCount,
  wishlistCount,
  isCartOpen,
  onToggleTheme,
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
  onMobileMenuToggle
}: {
  theme: Theme;
  onNavClick: (name: string) => void;
  onCartClick: () => void;
  cartCount: number;
  wishlistCount: number;
  isCartOpen: boolean;
  onToggleTheme: () => void;
  cartItems: { id: number, name: string, price: number, quantity: number }[];
  onRemoveItem: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onCheckout: () => void;
  onMobileMenuToggle: () => void;
}) => (
  <header className={`sticky top-0 z-20 px-4 py-3 font-sans shadow-md ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-bold text-xl brand-text">TechCompare</span>
      </div>
      <div className="hidden md:flex items-center gap-6 text-sm">
        <a href="#" onClick={(e) => { e.preventDefault(); onNavClick("Home"); }} className="hover:text-blue-600 transition-colors">Home</a>
        <a href="#" onClick={(e) => { e.preventDefault(); onNavClick("Categories"); }} className="hover:text-blue-600 transition-colors">Categories</a>
        <a href="#" onClick={(e) => { e.preventDefault(); onNavClick("Deals"); }} className="hover:text-blue-600 transition-colors">Deals</a>
        <a href="#" onClick={(e) => { e.preventDefault(); onNavClick("Compare Products"); }} className="hover:text-blue-600 transition-colors font-medium">Compare Products</a>
        <a href="#" onClick={(e) => { e.preventDefault(); onNavClick("Support"); }} className="hover:text-blue-600 transition-colors">Support</a>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <button onClick={onCartClick} className="relative p-2 cursor-pointer">
            <FaShoppingCart className={theme === "dark" ? "text-gray-300" : "text-gray-600"} />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-600 rounded-full text-white text-[10px] flex items-center justify-center">{cartCount}</span>
          </button>
          <AnimatePresence>
            {isCartOpen && (
              <CartDropdown
                items={cartItems}
                isOpen={isCartOpen}
                onClose={onCartClick}
                theme={theme}
                onRemoveItem={onRemoveItem}
                onUpdateQuantity={onUpdateQuantity}
                onCheckout={onCheckout}
              />
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-3">

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onMobileMenuToggle}
            className={`md:hidden p-2 rounded-full flex items-center justify-center cursor-pointer ${theme === "dark" ? "glass-dark" : "glass"}`}
          >
            <FaBars className={theme === "dark" ? "text-gray-200" : "text-gray-700"} size={16} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onToggleTheme}
            className={`p-2 rounded-full flex items-center justify-center cursor-pointer ${theme === "dark" ? "glass-dark" : "glass"}`}
          >
            {theme === "dark" ? (
              <FaSun className="text-gray-200" size={14} />
            ) : (
              <FaMoon className="text-gray-700" size={14} />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  </header>
);

const Breadcrumbs = ({ theme, onNavClick }: { theme: Theme; onNavClick: (name: string) => void }) => (
  <div className={`flex items-center gap-2 text-xs mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
    <a href="#" onClick={(e) => { e.preventDefault(); onNavClick("Home"); }} className="hover:underline">Home</a>
    <span>/</span>
    <a href="#" onClick={(e) => { e.preventDefault(); onNavClick("Electronics"); }} className="hover:underline">Electronics</a>
    <span>/</span>
    <a href="#" onClick={(e) => { e.preventDefault(); onNavClick("Audio"); }} className="hover:underline">Audio</a>
    <span>/</span>
    <span className={theme === "dark" ? "text-white" : "text-gray-800"}>Product Comparison</span>
  </div>
);

const Price = ({ price, originalPrice }: { price: number; originalPrice?: number }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className="text-2xl sm:text-3xl font-bold text-blue-600">${price}</span>
      {originalPrice && (
        <span className="text-base sm:text-lg line-through text-gray-500">${originalPrice}</span>
      )}
    </div>
    {originalPrice && (
      <div className="flex items-center gap-2">
        <span className="text-xs sm:text-sm px-2 py-1 bg-red-500/90 text-white rounded-lg font-semibold shadow-sm">
          {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
        </span>
        <span className="text-xs sm:text-sm text-gray-500 font-medium">
          Save ${(originalPrice - price).toFixed(2)}
        </span>
      </div>
    )}
  </div>
);

const SpecRow = ({
  label,
  value1,
  value2,
  highlight = false,
  theme
}: {
  label: string;
  value1: string;
  value2: string;
  highlight?: boolean;
  theme: Theme;
}) => (
  <div className={`grid grid-cols-3 gap-4 py-2 ${highlight ? (theme === "dark" ? "bg-gray-700/50" : "bg-blue-50/50") : ""}`}>
    <div className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
      {label}
    </div>
    <div className="text-sm">
      {value1}
    </div>
    <div className="text-sm">
      {value2}
    </div>
  </div>
);

const CartDropdown = ({
  items,
  isOpen,
  onClose,
  theme,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout
}: {
  items: { id: number, name: string, price: number, quantity: number }[];
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onRemoveItem: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onCheckout: () => void;
}) => {
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`absolute top-0 right-0 w-full max-w-md h-full ${theme === "dark" ? "bg-gray-900" : "bg-white"} overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className={`p-6 ${theme === "dark" ? "bg-gray-900" : "bg-white"} flex-shrink-0`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-2xl font-light tracking-wide ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Cart</h2>
              <p className={`text-sm font-medium mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                {items.reduce((sum, item) => sum + item.quantity, 0)} {items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'item' : 'items'}
              </p>
            </div>
            <button 
              onClick={onClose} 
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${theme === "dark" ? "hover:bg-gray-800 text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"}`}
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
                <FaShoppingCart className={`text-3xl ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`} />
              </div>
              <h3 className={`text-xl font-medium mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Your cart is empty</h3>
              <p className={`text-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                Start shopping to add products to your cart
              </p>
            </div>
          ) : (
            <div className="px-6 py-2">
              {items.map((item, index) => (
                <div key={item.id} className={`py-6 ${index !== items.length - 1 ? `border-b ${theme === "dark" ? "border-gray-800" : "border-gray-100"}` : ""}`}>
                  <div className="space-y-4">
                    {/* Product Info */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0 pr-4">
                        <h3 className={`font-medium text-lg leading-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          {item.name}
                        </h3>
                        <p className={`text-sm mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          Quantity
                        </span>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
                          >
                            -
                          </button>
                          <span className={`w-8 text-center font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${theme === "dark" ? "text-red-400 hover:bg-red-900/20" : "text-red-600 hover:bg-red-50"}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Footer */}
        {total > 0 && (
          <div className={`p-6 ${theme === "dark" ? "bg-gray-900 border-t border-gray-800" : "bg-white border-t border-gray-100"} flex-shrink-0`}>
            <div className="space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <span className={`text-lg font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  Subtotal
                </span>
                <span className={`text-2xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  ${total.toFixed(2)}
                </span>
              </div>
              
              {/* Checkout Button */}
              <button
                onClick={onCheckout}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors ${theme === "dark" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
              >
                Checkout
              </button>
              
              {/* Continue Shopping */}
              <button
                onClick={onClose}
                className={`w-full py-3 rounded-xl font-medium transition-colors ${theme === "dark" ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const MobileMenu = ({
  theme,
  isOpen,
  onClose,
  onNavClick
}: {
  theme: Theme;
  isOpen: boolean;
  onClose: () => void;
  onNavClick: (name: string) => void;
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`absolute top-0 right-0 w-80 max-w-[85vw] h-full ${theme === "dark" ? "bg-gray-900" : "bg-white"} shadow-2xl overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className={`p-6 ${theme === "dark" ? "bg-gray-900 border-b border-gray-800" : "bg-white border-b border-gray-100"} flex-shrink-0`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Menu</h2>
            <button
              onClick={onClose}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${theme === "dark" ? "hover:bg-gray-800 text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"}`}
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-6">
            <div className="space-y-2">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNavClick("Home");
                  onClose();
                }}
                className={`block py-3 px-4 rounded-lg font-medium transition-colors ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-gray-800" : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"}`}
              >
                Home
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNavClick("Categories");
                  onClose();
                }}
                className={`block py-3 px-4 rounded-lg font-medium transition-colors ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-gray-800" : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"}`}
              >
                Categories
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNavClick("Deals");
                  onClose();
                }}
                className={`block py-3 px-4 rounded-lg font-medium transition-colors ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-gray-800" : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"}`}
              >
                Deals
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNavClick("Compare Products");
                  onClose();
                }}
                className={`block py-3 px-4 rounded-lg font-semibold transition-colors ${theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-600 text-white"}`}
              >
                Compare Products
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNavClick("Support");
                  onClose();
                }}
                className={`block py-3 px-4 rounded-lg font-medium transition-colors ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-gray-800" : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"}`}
              >
                Support
              </a>
            </div>
          </nav>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Home() {
  const [theme, setTheme] = useState<Theme>("light");
  const [selectedTab, setSelectedTab] = useState<"overview" | "specs" | "reviews">("overview");
  const [cartCount, setCartCount] = useState(3);
  const [wishlistCount, setWishlistCount] = useState(2);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [productsData, setProductsData] = useState<Product[]>([
    {
      id: 1,
      name: "Premium Wireless Headphones",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      price: 199.99,
      originalPrice: 249.99,
      rating: 4.5,
      reviewCount: 128,
      description: "Experience superior sound quality with active noise cancellation and premium comfort for extended listening sessions.",
      inStock: true,
      delivery: "Free delivery by Jun 24",
      warranty: "2-year warranty",
      inWishlist: false,
      features: [
        { name: "Active Noise Cancellation", included: true },
        { name: "Bluetooth 5.0", included: true },
        { name: "40h Battery Life", included: true },
        { name: "Water Resistant (IPX4)", included: false },
        { name: "Built-in Microphone", included: true },
        { name: "Voice Assistant", included: true },
        { name: "Foldable Design", included: true },
      ],
      specs: {
        "Driver Size": "40mm",
        "Frequency Response": "20Hz - 20kHz",
        "Impedance": "32 Ohm",
        "Battery Life": "40 hours",
        "Charging Time": "2 hours",
        "Weight": "250g",
        "Connectivity": "Bluetooth 5.0, 3.5mm jack",
        "Color": "Midnight Black"
      }
    },
    {
      id: 2,
      name: "Sport True Wireless Earbuds",
      image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46",
      price: 149.99,
      originalPrice: 179.99,
      rating: 4.0,
      reviewCount: 94,
      description: "Engineered for sports and active lifestyles with secure fit, sweat resistance, and powerful sound.",
      inStock: true,
      delivery: "Free delivery by Jun 22",
      warranty: "1-year warranty",
      inWishlist: false,
      features: [
        { name: "Active Noise Cancellation", included: false },
        { name: "Bluetooth 5.0", included: true },
        { name: "20h Battery Life", included: true },
        { name: "Water Resistant (IPX7)", included: true },
        { name: "Built-in Microphone", included: true },
        { name: "Voice Assistant", included: true },
        { name: "Foldable Design", included: false },
      ],
      specs: {
        "Driver Size": "8mm",
        "Frequency Response": "20Hz - 20kHz",
        "Impedance": "16 Ohm",
        "Battery Life": "8 hours (20 with case)",
        "Charging Time": "1.5 hours",
        "Weight": "6g per earbud, 45g case",
        "Connectivity": "Bluetooth 5.0",
        "Color": "Teal Green"
      }
    }
  ]);
  const [cartItems, setCartItems] = useState<{ id: number, name: string, price: number, quantity: number }[]>([
    { id: 1, name: "Premium Wireless Headphones", price: 199.99, quantity: 2 },
    { id: 2, name: "Sport True Wireless Earbuds", price: 149.99, quantity: 1 }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addToCartAnimation, setAddToCartAnimation] = useState<number | null>(null);
  const [showFeatureNotification, setShowFeatureNotification] = useState(false);
  const [featureMessage, setFeatureMessage] = useState("");
  const [visibleReviews, setVisibleReviews] = useState<number>(2);
  const [hasMoreReviews, setHasMoreReviews] = useState<boolean>(true);

  const headphoneReviews = [
    {
      id: 1,
      name: "Michael T.",
      date: "May 15, 2023",
      rating: 5,
      content: "These headphones have amazing sound quality and the noise cancellation is top-notch. Battery life is excellent - I can use them for days before recharging.",
      helpful: 24,
    },
    {
      id: 2,
      name: "Sarah L.",
      date: "April 3, 2023",
      rating: 4,
      content: "Great sound and very comfortable, even for long periods. The only downside is they're a bit bulky for travel.",
      helpful: 16,
    },
    {
      id: 3,
      name: "David R.",
      date: "March 17, 2023",
      rating: 5,
      content: "Best headphones I've ever owned. The audio quality is stellar and they're so comfortable I forget I'm wearing them. The noise cancellation is perfect for my commute.",
      helpful: 32,
    },
    {
      id: 4,
      name: "Emma K.",
      date: "February 28, 2023",
      rating: 4,
      content: "Really good for the price, though I wish they had a bit more bass. The build quality is excellent and I love the battery life.",
      helpful: 8,
    },
    {
      id: 5,
      name: "Omar J.",
      date: "January 15, 2023",
      rating: 3,
      content: "Decent headphones but there are some connectivity issues occasionally. Sound quality is good when they work properly.",
      helpful: 19,
    }
  ];

  const earbudReviews = [
    {
      id: 1,
      name: "Alex W.",
      date: "June 2, 2023",
      rating: 5,
      content: "Perfect for workouts! They stay in place even during intense runs, and the water resistance is a must-have feature. Sound quality is also impressive for the size.",
      helpful: 32,
    },
    {
      id: 2,
      name: "Jamie K.",
      date: "May 19, 2023",
      rating: 2,
      content: "Battery life is shorter than advertised. They also don't fit my ears well and fall out during workouts. Sound quality is okay but nothing special.",
      helpful: 8,
    },
    {
      id: 3,
      name: "Taylor B.",
      date: "April 25, 2023",
      rating: 4,
      content: "Great for running and gym workouts. The IPX7 water resistance means I don't worry about sweat. Sound is cleaner than I expected from earbuds.",
      helpful: 14,
    },
    {
      id: 4,
      name: "Priya M.",
      date: "March 7, 2023",
      rating: 5,
      content: "Exactly what I needed! Comfortable, great sound, and they don't budge during workouts. The battery life is enough for a full week of gym sessions.",
      helpful: 22,
    },
    {
      id: 5,
      name: "Jackson L.",
      date: "February 12, 2023",
      rating: 1,
      content: "Very disappointed. One earbud stopped working after three weeks, and customer service was slow to respond. Would not recommend.",
      helpful: 41,
    }
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (showFeatureNotification) {
      const timer = setTimeout(() => {
        setShowFeatureNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showFeatureNotification]);

  // Prevent body scrolling when cart or mobile menu is open
  useEffect(() => {
    if (isCartOpen || isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup function to ensure overflow is reset when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen, isMobileMenuOpen]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleWishlistToggle = (productId: number) => {
    setProductsData(products =>
      products.map(product => {
        if (product.id === productId) {
          const newWishlistState = !product.inWishlist;
          if (newWishlistState) {
            setWishlistCount(prev => prev + 1);
          } else {
            setWishlistCount(prev => Math.max(0, prev - 1));
          }
          return { ...product, inWishlist: newWishlistState };
        }
        return product;
      })
    );
  };

  const handleRemoveFromCart = (productId: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);

      if (!existingItem) return prevItems;

      const updatedItems = prevItems.filter(item => item.id !== productId);

      setCartCount(prev => Math.max(0, prev - existingItem.quantity));

      return updatedItems;
    });
  };

  const handleAddToCart = (productId: number) => {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    setAddToCartAnimation(productId);

    setTimeout(() => {
      setAddToCartAnimation(null);
    }, 700);

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);

      if (existingItem) {
        return prevItems.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { id: productId, name: product.name, price: product.price, quantity: 1 }];
      }
    });

    setCartCount(prev => prev + 1);

    setIsCartOpen(true);
  };

  const handleCartClick = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavLinkClick = (linkName: string) => {
    // Don't show notification for Compare Products since we're already on that page
    if (linkName === "Compare Products") {
      return;
    }
    
    setFeatureMessage(`${linkName} feature coming soon!`);
    setShowFeatureNotification(true);
  };

  const comparisonData = [
    { category: "Sound Quality", product1: 9, product2: 7 },
    { category: "Comfort", product1: 9, product2: 6 },
    { category: "Battery Life", product1: 8, product2: 7 },
    { category: "Durability", product1: 7, product2: 9 },
    { category: "Value", product1: 8, product2: 9 },
    { category: "Popularity", product1: 8, product2: 7 },
  ];
  const handleUpdateCartQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);

      if (!existingItem) return prevItems;

      const quantityDifference = newQuantity - existingItem.quantity;

      setCartCount(prev => prev + quantityDifference);

      return prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const handleLoadMoreReviews = () => {
    if (visibleReviews >= 5) {
      setHasMoreReviews(false);
      setFeatureMessage("All reviews loaded");
      setShowFeatureNotification(true);
    } else {
      setVisibleReviews(prev => Math.min(prev + 2, 5));
      if (visibleReviews + 2 >= 5) {
        setHasMoreReviews(false);
      }
    }
  };

  const handleCheckout = () => {
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cartItems.length;
    
    // Clear the cart after checkout
    setCartItems([]);
    setCartCount(0);
    
    // Show success message and close cart
    setFeatureMessage(`Checkout successful! ${itemCount} items totaling $${totalAmount.toFixed(2)} have been ordered.`);
    setShowFeatureNotification(true);
    setIsCartOpen(false);
  };

  // Add after the comparisonData array

  return (
    <MotionConfig
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 100,
      }}
    >
      <style jsx global>{`
        body, button, a, input, p, span, div, h1, h2, h3, h4, h5, h6 {
          font-family: inherit;
        }
        
        h1, h2, h3, h4, h5, h6 {
          letter-spacing: -0.025em;
        }
        
        .brand-text {
          letter-spacing: -0.02em;
        }
        
        .heading-text {
          letter-spacing: -0.025em;
        }
        
        /* Glassmorphism styles */
        .glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
        }
        
        .glass-dark {
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
        }
        
        .glass-card {
          transition: all 0.3s ease;
        }
        
        .glass-card:hover {
          box-shadow: 0 15px 30px 0 rgba(31, 38, 135, 0.2);
          transform: translateY(-5px);
        }
        
        /* Enhanced modern shadows */
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
        
        /* Enhanced backdrop blur for better glassmorphism */
        .backdrop-blur-xl {
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
        
        /* Modern card transitions */
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Enhanced gradients for modern look */
        .bg-gradient-to-br {
          background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
        }
        
        .bg-gradient-to-t {
          background-image: linear-gradient(to top, var(--tw-gradient-stops));
        }
        
        /* Line clamp utility for text truncation */
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className={`${inter.className} min-h-screen font-sans ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}
      >
        <Header
          theme={theme}
          onNavClick={handleNavLinkClick}
          onCartClick={handleCartClick}
          cartCount={cartCount}
          wishlistCount={wishlistCount}
          isCartOpen={isCartOpen}
          onToggleTheme={toggleTheme}
          cartItems={cartItems}
          onRemoveItem={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onCheckout={handleCheckout}
          onMobileMenuToggle={handleMobileMenuToggle}
        />

        <AnimatePresence>
          {isMobileMenuOpen && (
            <MobileMenu
              theme={theme}
              isOpen={isMobileMenuOpen}
              onClose={handleMobileMenuToggle}
              onNavClick={handleNavLinkClick}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showFeatureNotification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
            >
              <div className={`text-sm py-2 px-4 rounded-lg ${theme === "dark" ? "glass-dark text-white" : "glass text-gray-800"} flex items-center gap-2`}>
                <FaInfoCircle className="text-blue-500" />
                <span>{featureMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          variants={containerAnimation}
          className="max-w-7xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8"
        >
          <motion.div variants={itemAnimation} className="overflow-x-auto">
            <Breadcrumbs theme={theme} onNavClick={handleNavLinkClick} />
          </motion.div>

          <motion.div variants={itemAnimation}>
            <h1 className={`text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 heading-text ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
              Product Comparison
            </h1>
            <p className={`mb-6 sm:mb-8 text-sm sm:text-base font-sans ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Compare features and prices to make the best choice for your needs
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {productsData.map((product, index) => (
              <motion.div
                key={product.id}
                variants={itemAnimation}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" } 
                }}
                className={`group rounded-2xl overflow-hidden backdrop-blur-xl border transition-all duration-500 ${theme === "dark"
                  ? "bg-white/5 border-white/10 shadow-2xl shadow-black/20 hover:bg-white/8 hover:border-white/20 hover:shadow-3xl hover:shadow-black/30"
                  : "bg-white/80 border-white/30 shadow-2xl shadow-black/5 hover:bg-white/90 hover:border-white/50 hover:shadow-3xl hover:shadow-black/10"
                }`}
              >
                <div className="relative h-48 sm:h-64 overflow-hidden">
                  {/* Background image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Dark overlay for better text contrast */}
                  <div className="absolute inset-0 bg-black/40"></div>
                  
                  {/* Colored gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${index === 0
                    ? "from-blue-600/70 via-blue-500/50 to-blue-400/30"
                    : "from-blue-500/70 via-blue-400/50 to-blue-300/30"
                    } group-hover:opacity-90 transition-opacity duration-300`}></div>
                  
                  {/* Bottom gradient for extra text definition */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Text content */}
                  <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 z-10">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center drop-shadow-2xl tracking-tight leading-tight">{product.name}</h2>
                  </div>
                  {!product.inStock && (
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-xl border border-red-400/30 z-20">
                      Out of Stock
                    </div>
                  )}
                  {product.originalPrice && (
                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-xl border border-red-400/30 z-20">
                      SALE
                    </div>
                  )}
                </div>

                <div className="p-5 sm:p-7">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col gap-4 sm:gap-5 mb-5 sm:mb-7"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <Price price={product.price} originalPrice={product.originalPrice} />
                      </div>
                      <div className="flex-shrink-0">
                        <Rating value={product.rating} reviewCount={product.reviewCount} />
                      </div>
                    </div>

                    <p className={`text-sm sm:text-base leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      {product.description}
                    </p>

                    <div className={`flex flex-col gap-2 p-4 rounded-xl ${theme === "dark" ? "bg-white/5 border border-white/10" : "bg-gray-50/80 border border-gray-200/50"}`}>
                      {product.inStock ? (
                        <div className="flex items-center text-emerald-500 text-sm sm:text-base font-medium">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                          In Stock
                        </div>
                      ) : (
                        <div className="flex items-center text-red-500 text-sm sm:text-base font-medium">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                          Out of Stock
                        </div>
                      )}
                      <div className="flex items-center text-sm sm:text-base">
                        <FaTruck className="mr-2 text-blue-500" size={16} /> 
                        <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>{product.delivery}</span>
                      </div>
                      <div className="flex items-center text-sm sm:text-base">
                        <FaShieldAlt className="mr-2 text-blue-500" size={16} /> 
                        <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>{product.warranty}</span>
                      </div>
                    </div>
                  </motion.div>

                  <div className="mb-6 sm:mb-8">
                    <h3 className={`text-lg sm:text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                      Key Features
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                      {product.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                          {feature.included ? (
                            <div className="flex-shrink-0 w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center">
                              <FaCheck className="text-emerald-500 text-xs" />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center">
                              <FaTimes className="text-red-500 text-xs" />
                            </div>
                          )}
                          <span className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{feature.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ 
                        scale: 1.05, 
                        boxShadow: theme === "dark" 
                          ? "0 20px 40px -10px rgba(59,130,246,0.4)" 
                          : "0 20px 40px -10px rgba(59,130,246,0.3)" 
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddToCart(product.id)}
                      className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r cursor-pointer ${index === 0
                        ? "from-blue-600 via-blue-500 to-blue-400"
                        : "from-blue-500 via-blue-400 to-blue-300"
                        } text-white rounded-xl font-semibold flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group/btn`}
                    >
                      {addToCartAnimation === product.id && (
                        <motion.div
                          initial={{ scale: 0, opacity: 1 }}
                          animate={{ scale: 2, opacity: 0 }}
                          transition={{ duration: 0.7 }}
                          className="absolute inset-0 bg-white rounded-xl"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      <span className="z-10 relative">Add to Cart</span> 
                      <FaShoppingCart className="z-10 relative" size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleWishlistToggle(product.id)}
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${theme === "dark"
                        ? product.inWishlist 
                          ? "border-pink-500 bg-pink-500/20 text-pink-400 shadow-lg shadow-pink-500/25" 
                          : "border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30"
                        : product.inWishlist 
                          ? "border-pink-500 bg-pink-50 text-pink-500 shadow-lg shadow-pink-500/25" 
                          : "border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400"
                        } flex items-center justify-center`}
                    >
                      <FaHeart className={product.inWishlist ? "text-pink-500" : ""} size={18} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={slideUp}
            className="mb-6 sm:mb-8"
          >
            <div className={`flex mb-4 sm:mb-6 border-b overflow-x-auto pb-1 ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
              <motion.button
                whileHover={{ backgroundColor: theme === "dark" ? "rgba(30, 41, 59, 0.5)" : "rgba(243, 244, 246, 0.8)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSelectedTab("overview");
                }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 font-medium text-xs sm:text-sm whitespace-nowrap tracking-wide cursor-pointer ${selectedTab === "overview"
                  ? theme === "dark"
                    ? "text-white border-b-2 border-blue-500"
                    : "text-blue-600 border-b-2 border-blue-500"
                  : theme === "dark"
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                Overview
              </motion.button>
              <motion.button
                whileHover={{ backgroundColor: theme === "dark" ? "rgba(30, 41, 59, 0.5)" : "rgba(243, 244, 246, 0.8)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSelectedTab("specs");
                }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 font-medium text-xs sm:text-sm whitespace-nowrap tracking-wide cursor-pointer ${selectedTab === "specs"
                  ? theme === "dark"
                    ? "text-white border-b-2 border-blue-500"
                    : "text-blue-600 border-b-2 border-blue-500"
                  : theme === "dark"
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                Technical Specs
              </motion.button>
              <motion.button
                whileHover={{ backgroundColor: theme === "dark" ? "rgba(30, 41, 59, 0.5)" : "rgba(243, 244, 246, 0.8)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSelectedTab("reviews");
                }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 font-medium text-xs sm:text-sm whitespace-nowrap tracking-wide cursor-pointer ${selectedTab === "reviews"
                  ? theme === "dark"
                    ? "text-white border-b-2 border-blue-500"
                    : "text-blue-600 border-b-2 border-blue-500"
                  : theme === "dark"
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                Reviews
              </motion.button>
            </div>

            <motion.div
              className={`rounded-xl ${theme === "dark"
                ? "glass-dark"
                : "glass"} mb-8 sm:mb-12 overflow-hidden`}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {selectedTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 sm:p-6"
                  >
                    <h2 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-5 tracking-tight ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                      Performance Comparison
                    </h2>
                    <p className={`mb-4 sm:mb-6 text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      Our experts have rated these products across key performance metrics. Ratings are on a scale of 1-10, with 10 being excellent.
                    </p>
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                      <div className="min-w-full px-4 sm:px-0">
                        <div className={`grid grid-cols-3 gap-4 mb-4 p-3 rounded-lg ${theme === "dark" ? "bg-gray-700/30" : "bg-blue-50/60"}`}>
                          <div className={`font-semibold text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Category</div>
                          <div className="font-semibold text-blue-600 flex items-center gap-1 text-xs sm:text-sm">
                            <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-blue-600"></div>
                            Premium Headphones
                          </div>
                          <div className="font-semibold text-blue-500 flex items-center gap-1 text-xs sm:text-sm">
                            <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-blue-500"></div>
                            Sport Earbuds
                          </div>
                        </div>

                        {comparisonData.map((item, index) => {
                          const getCategoryIcon = (category: string) => {
                            switch (category) {
                              case "Sound Quality": return <FaVolumeUp className="text-blue-500" />;
                              case "Comfort": return <FaHeadphones className="text-purple-500" />;
                              case "Battery Life": return <FaBatteryFull className="text-green-500" />;
                              case "Durability": return <FaShieldAlt className="text-orange-500" />;
                              case "Value": return <FaDollarSign className="text-yellow-500" />;
                              default: return <FaInfoCircle className="text-gray-500" />;
                            }
                          };

                          const getBgColor = (index: number) => {
                            if (index % 2 === 0) {
                              return theme === "dark" ? "bg-gray-800/60" : "bg-white";
                            }
                            return theme === "dark" ? "bg-gray-700/30" : "bg-gray-50/80";
                          };

                          return (
                            <div key={index} className={`grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4 ${getBgColor(index)} p-3 sm:p-4 rounded-lg border ${theme === "dark" ? "border-gray-700/50" : "border-gray-200/50"} ${theme === "dark" ? "" : "shadow-sm"}`}>
                              <div className={`font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                {getCategoryIcon(item.category)}
                                {item.category}
                              </div>
                              <div>
                                <div className="relative pt-1">
                                  <div className={`overflow-hidden h-2.5 sm:h-3 text-xs flex rounded-full ${theme === "dark" ? "bg-gray-700/80" : "bg-gray-200/80"} backdrop-blur-sm`}>
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${item.product1 * 10}%` }}
                                      transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full relative overflow-hidden ${theme === "dark"
                                        ? "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                                        : "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                                        }`}
                                    >
                                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse opacity-50"></div>
                                    </motion.div>
                                  </div>
                                  <div className="flex justify-between items-center mt-1 sm:mt-2">
                                    <div className="flex items-center gap-1">
                                      <div className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${item.product1 < 5 ? "bg-red-500" : item.product1 < 8 ? "bg-yellow-500" : "bg-green-500"}`}></div>
                                      <span className={`text-[10px] sm:text-xs font-semibold ${item.product1 < 5 ? "text-red-500" : item.product1 < 8 ? "text-yellow-500" : "text-green-500"}`}>{item.product1}/10</span>
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-right">
                                      <span className={`font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                        {item.product1 < 5 ? "Poor" : item.product1 < 7 ? "Average" : item.product1 < 9 ? "Good" : "Excellent"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="relative pt-1">
                                  <div className={`overflow-hidden h-2.5 sm:h-3 text-xs flex rounded-full ${theme === "dark" ? "bg-gray-700/80" : "bg-gray-200/80"} backdrop-blur-sm`}>
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${item.product2 * 10}%` }}
                                      transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full relative overflow-hidden ${theme === "dark"
                                        ? "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                                        : "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                                        }`}
                                    >
                                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse opacity-50"></div>
                                    </motion.div>
                                  </div>
                                  <div className="flex justify-between items-center mt-1 sm:mt-2">
                                    <div className="flex items-center gap-1">
                                      <div className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${item.product2 < 5 ? "bg-red-500" : item.product2 < 8 ? "bg-yellow-500" : "bg-green-500"}`}></div>
                                      <span className={`text-[10px] sm:text-xs font-semibold ${item.product2 < 5 ? "text-red-500" : item.product2 < 8 ? "text-yellow-500" : "text-green-500"}`}>{item.product2}/10</span>
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-right">
                                      <span className={`font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                        {item.product2 < 5 ? "Poor" : item.product2 < 7 ? "Average" : item.product2 < 9 ? "Good" : "Excellent"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
    </div>
  );
                        })}

                        <div className={`mt-4 p-3 sm:p-4 rounded-lg border ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-blue-50/30 border-blue-100"} ${theme === "dark" ? "" : "shadow-sm"}`}>
                          <h3 className={`text-sm sm:text-base font-semibold mb-1 sm:mb-2 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                            <FaInfoCircle className="inline mr-1 sm:mr-2 text-blue-500" />
                            Expert Recommendation
                          </h3>
                          <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            For superior sound quality and comfort during long listening sessions, choose the Premium Headphones.
                            If you need durability and water resistance for an active lifestyle, the Sport Earbuds are the better option.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {selectedTab === "specs" && (
                  <motion.div
                    key="specs"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 sm:p-6"
                  >
                    <h2 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-5 tracking-tight ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                      Technical Specifications
                    </h2>
                    <p className={`mb-4 sm:mb-6 text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      Compare detailed technical specifications between products. Key differences are highlighted for easier comparison.
                    </p>
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                      <div className="min-w-full px-4 sm:px-0">
                        <div className={`grid grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6 pb-3 sm:pb-3 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                          <div className={`font-semibold text-sm sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Specification</div>
                          <div className="font-semibold text-blue-600 flex items-center gap-1 text-sm sm:text-sm">
                            <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-blue-600"></div>
                            <span className="hidden sm:inline">Premium Headphones</span>
                            <span className="sm:hidden">Premium</span>
                          </div>
                          <div className="font-semibold text-blue-500 flex items-center gap-1 text-sm sm:text-sm">
                            <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-blue-500"></div>
                            <span className="hidden sm:inline">Sport Earbuds</span>
                            <span className="sm:hidden">Sport</span>
                          </div>
                        </div>

                        {Object.keys(productsData[0].specs).map((key, index) => {
                          const value1 = productsData[0].specs[key];
                          const value2 = productsData[1].specs[key];
                          const isDifferent = value1 !== value2;
                          const isSignificantDifference =
                            isDifferent &&
                            !(key === "Color");

                          const getBgColor = (index: number) => {
                            if (index % 2 === 0) {
                              return theme === "dark" ? "bg-gray-800/60" : "bg-white";
                            }
                            return theme === "dark" ? "bg-gray-700/30" : "bg-gray-50/80";
                          };

                          const getSpecIcon = (specName: string) => {
                            switch (specName.toLowerCase()) {
                              case "driver size": return <FaCircle className="text-blue-500" size={12} />;
                              case "frequency response": return <FaWaveSquare className="text-purple-500" />;
                              case "impedance": return <FaRandom className="text-orange-500" />;
                              case "battery life": return <FaBatteryFull className="text-green-500" />;
                              case "charging time": return <FaBolt className="text-yellow-500" />;
                              case "weight": return <FaWeightHanging className="text-red-500" />;
                              case "connectivity": return <FaWifi className="text-blue-400" />;
                              case "color": return <FaPalette className="text-pink-500" />;
                              default: return <FaInfo className="text-gray-500" size={12} />;
                            }
                          };

                          return (
                            <div
                              key={key}
                              className={`grid grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-2 ${getBgColor(index)} p-3 sm:p-3 rounded-lg border border-transparent ${theme === "dark" ? "" : "shadow-sm"}`}
                            >
                              <div className={`text-sm sm:text-sm font-medium flex items-center gap-2 sm:gap-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                <span className="hidden sm:inline">{getSpecIcon(key)}</span>
                                <span className="text-xs sm:text-sm leading-tight">{key}</span>
                              </div>
                              <div className={`text-sm sm:text-sm break-words ${isSignificantDifference ? theme === "dark" ? "text-blue-400 font-medium" : "text-blue-700 font-medium" : ""}`}>
                                <span className="block leading-tight">{value1}</span>
                                {isSignificantDifference && key === "Battery Life" && (
                                  <span className="block mt-1 text-[10px] sm:text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 w-fit">Better</span>
                                )}
                              </div>
                              <div className={`text-sm sm:text-sm break-words ${isSignificantDifference ? theme === "dark" ? "text-blue-300 font-medium" : "text-blue-600 font-medium" : ""}`}>
                                <span className="block leading-tight">{value2}</span>
                                {isSignificantDifference && key === "Weight" && (
                                  <span className="block mt-1 text-[10px] sm:text-xs px-2 py-1 rounded-full bg-blue-400/20 text-blue-600 dark:text-blue-300 w-fit">Better</span>
                                )}
                                {isSignificantDifference && key === "Water Resistant" && (
                                  <span className="block mt-1 text-[10px] sm:text-xs px-2 py-1 rounded-full bg-blue-400/20 text-blue-600 dark:text-blue-300 w-fit">Better</span>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg border ${theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-blue-50/30 border-blue-100"} ${theme === "dark" ? "" : "shadow-sm"}`}>
                          <h3 className={`text-sm sm:text-base font-semibold mb-1 sm:mb-2 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                            <FaInfoCircle className="inline mr-1 sm:mr-2 text-blue-500" />
                            Technical Analysis
                          </h3>
                          <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            The Premium Headphones offer larger drivers and longer battery life, making them ideal for extended listening sessions.
                            The Sport Earbuds excel with their IPX7 water resistance rating and lightweight design, perfect for workouts and active use.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {selectedTab === "reviews" && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 sm:p-6"
                  >
                    <h2 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-5 heading-text ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                      Customer Reviews
                    </h2>

                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                      <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                        See what our customers are saying about these products.
                      </p>
                    </div>

                    <div className="flex gap-4 sm:gap-6 mb-6 sm:mb-8 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible md:pb-0">
                      <div className={`flex-shrink-0 w-77 md:w-auto p-3 sm:p-5 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-blue-50"}`}>
                        <div className="flex justify-between items-center mb-3 sm:mb-4">
                          <div>
                            <h3 className="font-semibold text-base sm:text-lg">Premium Headphones</h3>
                            <div className="flex items-center">
                              <Rating value={4.5} reviewCount={0} />
                              <span className={`ml-1 sm:ml-2 text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{productsData[0].reviewCount} reviews</span>
                            </div>
                          </div>
                          <span className={`text-2xl sm:text-3xl font-bold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>4.5</span>
                        </div>

                        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm mb-3 sm:mb-4">
                          {[5, 4, 3, 2, 1].map(stars => {
                            const percentage = stars === 5 ? 65 :
                              stars === 4 ? 25 :
                                stars === 3 ? 7 :
                                  stars === 2 ? 2 : 1;
                            return (
                              <div key={stars} className="flex items-center gap-1 sm:gap-2">
                                <span className="w-8 sm:w-10 text-right">{stars} stars</span>
                                <div className={`flex-1 h-2 sm:h-2.5 mx-1 sm:mx-2 rounded-full ${theme === "dark" ? "bg-gray-700/80" : "bg-gray-200/80"} backdrop-blur-sm`}>
                                  <div
                                    className={`h-2 sm:h-2.5 rounded-full relative overflow-hidden ${stars >= 4
                                      ? theme === "dark"
                                        ? "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                                        : "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                                      : stars >= 3
                                        ? theme === "dark"
                                          ? "bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 shadow-[0_0_10px_rgba(202,138,4,0.6)]"
                                          : "bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 shadow-[0_0_12px_rgba(202,138,4,0.4)]"
                                        : theme === "dark"
                                          ? "bg-gradient-to-r from-red-600 via-red-500 to-red-400 shadow-[0_0_10px_rgba(220,38,38,0.6)]"
                                          : "bg-gradient-to-r from-red-600 via-red-500 to-red-400 shadow-[0_0_12px_rgba(220,38,38,0.4)]"
                                      }`}
                                    style={{ width: `${percentage}%` }}
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-pulse opacity-50"></div>
                                  </div>
                                </div>
                                <span className="w-6 sm:w-10 text-[10px] sm:text-xs">{percentage}%</span>
                              </div>
                            );
                          })}
                        </div>

                        {headphoneReviews.slice(0, visibleReviews).map((review) => (
                          <div key={review.id} className={`h-48 sm:h-52 p-3 sm:p-4 rounded-lg mb-2 sm:mb-4 flex flex-col ${theme === "dark" ? "bg-gray-700" : "bg-white shadow-sm"}`}>
                            <div className="flex items-start gap-2 sm:gap-3 flex-1">
                              <div className={`shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-blue-500" : "bg-blue-100"}`}>
                                <FaUser className={theme === "dark" ? "text-white" : "text-blue-500"} size={10} />
                              </div>
                              <div className="flex-1 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-medium text-xs sm:text-sm">{review.name}</h4>
                                  <span className={`text-[10px] sm:text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                    <FaCalendarAlt className="inline mr-1" size={8} />{review.date}
                                  </span>
                                </div>
                                <div className="mb-2 scale-75 sm:scale-100 origin-left">
                                  <Rating value={review.rating} reviewCount={0} />
                                </div>
                                <p className={`text-[11px] sm:text-sm flex-1 ${theme === "dark" ? "text-gray-300" : "text-gray-600"} line-clamp-4`}>
                                  {review.content}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className={`text-[10px] sm:text-xs ${theme === "dark" ? "text-blue-300" : "text-blue-500"}`}>Verified Purchase</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className={`flex-shrink-0 w-77 md:w-auto p-3 sm:p-5 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-blue-50/60"}`}>
                        <div className="flex justify-between items-center mb-3 sm:mb-4">
                          <div>
                            <h3 className="font-semibold text-base sm:text-lg">Sport Earbuds</h3>
                            <div className="flex items-center">
                              <Rating value={4.0} reviewCount={0} />
                              <span className={`ml-1 sm:ml-2 text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{productsData[1].reviewCount} reviews</span>
                            </div>
                          </div>
                          <span className={`text-2xl sm:text-3xl font-bold ${theme === "dark" ? "text-blue-300" : "text-blue-500"}`}>4.0</span>
                        </div>

                        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm mb-3 sm:mb-4">
                          {[5, 4, 3, 2, 1].map(stars => {
                            const percentage = stars === 5 ? 40 :
                              stars === 4 ? 35 :
                                stars === 3 ? 15 :
                                  stars === 2 ? 5 : 5;
                            return (
                              <div key={stars} className="flex items-center gap-1 sm:gap-2">
                                <span className="w-8 sm:w-10 text-right">{stars} stars</span>
                                <div className={`flex-1 h-2 sm:h-2.5 mx-1 sm:mx-2 rounded-full ${theme === "dark" ? "bg-gray-700/80" : "bg-gray-200/80"} backdrop-blur-sm`}>
                                  <div
                                    className={`h-2 sm:h-2.5 rounded-full relative overflow-hidden ${stars >= 4
                                      ? theme === "dark"
                                        ? "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                                        : "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                                      : stars >= 3
                                        ? theme === "dark"
                                          ? "bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 shadow-[0_0_10px_rgba(202,138,4,0.6)]"
                                          : "bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 shadow-[0_0_12px_rgba(202,138,4,0.4)]"
                                        : theme === "dark"
                                          ? "bg-gradient-to-r from-red-600 via-red-500 to-red-400 shadow-[0_0_10px_rgba(220,38,38,0.6)]"
                                          : "bg-gradient-to-r from-red-600 via-red-500 to-red-400 shadow-[0_0_12px_rgba(220,38,38,0.4)]"
                                      }`}
                                    style={{ width: `${percentage}%` }}
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-pulse opacity-50"></div>
                                  </div>
                                </div>
                                <span className="w-6 sm:w-10 text-[10px] sm:text-xs">{percentage}%</span>
                              </div>
                            );
                          })}
                        </div>

                        {earbudReviews.slice(0, visibleReviews).map((review) => (
                          <div key={review.id} className={`h-48 sm:h-52 p-3 sm:p-4 rounded-lg mb-2 sm:mb-4 flex flex-col ${theme === "dark" ? "bg-gray-700" : "bg-white shadow-sm"}`}>
                            <div className="flex items-start gap-2 sm:gap-3 flex-1">
                              <div className={`shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-green-600" : "bg-green-100"}`}>
                                <FaUser className={theme === "dark" ? "text-white" : "text-green-600"} size={10} />
                              </div>
                              <div className="flex-1 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-medium text-xs sm:text-sm">{review.name}</h4>
                                  <span className={`text-[10px] sm:text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                    <FaCalendarAlt className="inline mr-1" size={8} />{review.date}
                                  </span>
                                </div>
                                <div className="mb-2 scale-75 sm:scale-100 origin-left">
                                  <Rating value={review.rating} reviewCount={0} />
                                </div>
                                <p className={`text-[11px] sm:text-sm flex-1 ${theme === "dark" ? "text-gray-300" : "text-gray-600"} line-clamp-4`}>
                                  {review.content}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className={`text-[10px] sm:text-xs ${theme === "dark" ? "text-blue-300" : "text-blue-500"}`}>Verified Purchase</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {hasMoreReviews && <div className="flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleLoadMoreReviews}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium cursor-pointer ${hasMoreReviews ? (theme === "dark" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-500 text-white hover:bg-blue-600") : (theme === "dark" ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500")}`}
                        disabled={!hasMoreReviews}
                      >
                        {hasMoreReviews ? "Load More Reviews" : "All Reviews Loaded"}
                      </motion.button>
                    </div>}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
}
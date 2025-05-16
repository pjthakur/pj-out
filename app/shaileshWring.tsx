"use client"
import { useState, useEffect, useRef } from "react";
import { FaStar, FaCartPlus, FaShoppingBag, FaCheckCircle, FaRegEye, FaCheckSquare, FaMoon, FaSun } from 'react-icons/fa';
import { Inter, Poppins, Montserrat } from 'next/font/google';
import { motion, AnimatePresence, useAnimation, Variants } from 'framer-motion';

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

const mockReviews: Record<string, { user: string; rating: number; title: string; text: string; date: string; helpful: number; notHelpful: number; }[]> = {
  "iphone-15-pro": [
    { user: "Amit S.", rating: 5, title: "Amazing Camera", text: "The camera quality is top-notch. Battery lasts all day.", date: "2 days ago", helpful: 12, notHelpful: 1 },
    { user: "Priya R.", rating: 4, title: "Great but Pricey", text: "Performance is smooth, but a bit expensive.", date: "1 week ago", helpful: 8, notHelpful: 2 },
    { user: "Rahul K.", rating: 5, title: "Best iPhone Yet", text: "Loving the new design and features.", date: "3 weeks ago", helpful: 15, notHelpful: 0 }
  ],
  "samsung-s24-ultra": [
    { user: "Sneha M.", rating: 5, title: "Superb Display", text: "The display is vibrant and the battery is solid.", date: "1 day ago", helpful: 10, notHelpful: 1 },
    { user: "Vikram D.", rating: 4, title: "Feature Packed", text: "Camera zoom is incredible. UI could be better.", date: "5 days ago", helpful: 7, notHelpful: 1 },
    { user: "Anjali P.", rating: 5, title: "Loving It!", text: "Best Android phone I have used so far.", date: "2 weeks ago", helpful: 11, notHelpful: 0 }
  ],
  "oneplus-12": [
    { user: "Karan J.", rating: 4, title: "Value for Money", text: "Great specs for the price. Fast charging is awesome.", date: "3 days ago", helpful: 9, notHelpful: 1 },
    { user: "Megha S.", rating: 5, title: "Excellent Performance", text: "No lags, smooth UI, and good battery.", date: "1 week ago", helpful: 6, notHelpful: 0 },
    { user: "Deepak T.", rating: 4, title: "Solid Build", text: "Feels premium in hand. Camera is decent.", date: "2 weeks ago", helpful: 5, notHelpful: 2 }
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
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    price: 89999,
    rating: 4.6
  },
  {
    id: "xiaomi-14-pro",
    name: "Xiaomi 14 Pro",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    price: 69999,
    rating: 4.5
  },
  {
    id: "vivo-x100",
    name: "Vivo X100",
    image: "https://images.unsplash.com/photo-1687168593635-370120784edc?auto=format&fit=crop&w=400&q=80",
    price: 59999,
    rating: 4.4
  }
];

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

  const products: Product[] = [
    {
      id: "iphone-15-pro",
      name: "Apple iPhone 15 Pro (Black Titanium, 128 GB)",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
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
      name: "SAMSUNG Galaxy S24 5G (Titanium Gray, 256 GB)",
      image: "https://images.unsplash.com/photo-1709744722656-9b850470293f?auto=format&fit=crop&w=400&q=80",
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

  // Effect to handle body scrolling when modal is open
  useEffect(() => {
    if (showSpecModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showSpecModal]);

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
        }
        
        body {
          font-family: var(--font-montserrat);
        }

        /* Glass morphism */
        .glass-light {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(100, 100, 168, 0.07);
        }
        
        .glass-dark {
          background: rgba(30, 27, 75, 0.6);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(132, 100, 247, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .glass-card-light {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 4px 24px rgba(100, 100, 168, 0.1);
        }
        
        .glass-card-dark {
          background: rgba(50, 47, 95, 0.5);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(132, 100, 247, 0.15);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
        }
      `}</style>
      <header
        ref={headerRef}
        style={headerStyle}
        className={`top-0 z-50 flex justify-between items-center p-4 shadow-lg transition-all duration-300 relative overflow-hidden ${theme === "dark" ? "glass-dark border-b border-violet-800/20" : "glass-light border-b border-violet-200/30"}`}
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
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r ${theme === "dark"
                ? "from-violet-400 via-fuchsia-400 to-indigo-400"
                : "from-violet-600 via-fuchsia-600 to-indigo-600"
              } bg-clip-text text-transparent font-poppins relative group`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.02 }}
          >
            <span className="relative z-10 inline-block bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
              Tech
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-violet-500 to-fuchsia-500"
              />
            </span>
            <span className="relative z-10 inline-block bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
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
                className="hover:text-violet-600 dark:hover:text-violet-400 cursor-pointer transition-colors duration-200 px-3 py-1 rounded-full hover:bg-violet-50 dark:hover:bg-violet-900/20"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
          <motion.button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 ${theme === "dark"
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

      <main className="flex flex-col md:flex-row max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 gap-4 sm:gap-8">
        {/* Suggestions sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <div className={`mb-6 text-lg font-bold ${theme === 'dark' ? 'text-violet-700' : 'text-violet-600'} flex items-center`}>
              <span className="relative">
                Suggestions
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full"></span>
              </span>
            </div>
            <div className="space-y-6">
              {suggestions.map(s => (
                <motion.div
                  key={s.id}
                  className={`group relative flex items-center gap-5 p-5 rounded-2xl ${theme === 'dark'
                    ? 'bg-gray-800/50 shadow-gray-900/20 hover:shadow-gray-900/30 border-violet-400/20 hover:border-violet-400/30'
                    : 'bg-white/80 shadow-lg hover:shadow-2xl border-violet-100/30 hover:border-violet-300'
                    } backdrop-blur-lg transition-all duration-500 cursor-pointer`}
                  whileHover={{ scale: 1.02, y: -4 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br ${theme === 'dark' ? 'from-violet-900 to-violet-800' : 'from-violet-100 to-violet-200'} p-0.5`}>
                      <img
                        src={s.image}
                        alt={s.name}
                        className="mr-2 w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <motion.div
                      className="absolute -bottom-2 -right-2 px-2 py-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center shadow-lg"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-[10px] text-white font-bold tracking-wider">NEW</span>
                    </motion.div>
                  </div>
                  <div className="flex-1 relative">
                    <h3 className={`font-semibold text-sm ${theme === 'dark' ? 'text-violet-50 group-hover:text-violet-300' : 'text-gray-900 group-hover:text-violet-700'} transition-colors duration-300`}>{s.name}</h3>
                    <div className={`text-sm font-bold ${theme === 'dark' ? 'bg-gradient-to-r from-violet-400 to-fuchsia-300' : 'bg-gradient-to-r from-violet-600 to-fuchsia-500'} bg-clip-text text-transparent mt-1`}>₹{s.price.toLocaleString()}</div>
                    <div className="flex items-center gap-3 text-xs mt-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <motion.span
                            key={i}
                            className={`${i < Math.floor(s.rating) ? (theme === 'dark' ? 'text-yellow-300' : 'text-yellow-400') : (theme === 'dark' ? 'text-gray-600' : 'text-gray-300')}`}
                            initial={false}
                            animate={i < Math.floor(s.rating) ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                          >
                            ★
                          </motion.span>
                        ))}
                      </div>
                      <span className={`font-medium px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-violet-900/50 text-violet-300' : 'bg-violet-100 text-violet-700'}`}>{s.rating}</span>
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

          <div className="mb-4 sm:mb-8 relative z-10">
            <h2 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${theme === "dark" ? "text-violet-400" : "text-violet-700"} inline-flex items-center`}>
              Compare Apple iPhone 15 Pro vs SAMSUNG Galaxy S24 5G
              <span className="ml-2 inline-block w-2 h-2 bg-violet-400 rounded-full animate-pulse"></span>
            </h2>


          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

            {product1 && product2 && (
              <>
                {[product1, product2].map((productId, index) => {
                  const product = products.find(p => p.id === productId);
                  if (!product) return null;

                  return (
                    <motion.div
                      key={product.id}
                      className={`p-3 sm:p-6 rounded-2xl ${theme === "dark"
                        ? "glass-card-dark"
                        : "glass-card-light"
                        } relative overflow-hidden`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.1 * index,
                        duration: 0.5,
                        ease: "easeOut"
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex flex-col items-center relative z-10">
                        <div className={`w-full pb-4 mb-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"
                          }`}>
                          <motion.h2
                            className={`text-xl font-bold mb-2 text-center flex items-center justify-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-800"
                              }`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 + (0.1 * index) }}
                          >
                            <FaShoppingBag className="text-violet-500" />
                            {product.name}
                          </motion.h2>
                          <motion.div
                            className="flex justify-center"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4 + (0.1 * index) }}
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className={`h-56 object-contain my-4 rounded-xl shadow border ${theme === "dark" ? "border-gray-700" : "border-gray-200"
                                }`}
                            />
                          </motion.div>
                          <div className="flex flex-col items-center mb-4">
                            <div className="flex items-baseline gap-2">
                              <span className={`text-2xl font-bold ${theme === "dark" ? "text-violet-400" : "text-violet-600"}`}>₹{product.price.toLocaleString()}</span>
                              {product.originalPrice && (
                                <span className={`ml-2 text-sm line-through ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                                  }`}>
                                  ₹{product.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            {product.discount && (
                              <motion.span
                                className="mt-1 px-2 py-1 text-xs font-semibold text-violet-700 bg-violet-100 rounded-full"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.5 + (0.1 * index) }}
                              >
                                {product.discount}% off
                              </motion.span>
                            )}
                          </div>
                          <div className="flex justify-center items-center gap-2">
                            <div className={`px-2 py-1 rounded text-sm font-semibold inline-flex items-center ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                              }`}>
                              <FaStar className={`mr-1 ${theme === "dark" ? "text-violet-400" : "text-violet-500"}`} />
                              {product.rating}
                            </div>
                            <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                              }`}>
                              ({product.reviews} Reviews)
                            </span>
                          </div>
                        </div>
                        <div className="w-full space-y-3">
                          <div className={`grid grid-cols-1 gap-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"
                            }`}>
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                              <FaCheckCircle className="text-violet-500" /> Highlights
                            </h3>
                            <div className="grid grid-cols-[120px_1fr] gap-1">
                              <span className="font-medium">Storage:</span>
                              <span>{product.storage}</span>
                            </div>
                            <div className="grid grid-cols-[120px_1fr] gap-1">
                              <span className="font-medium">RAM:</span>
                              <span>{product.ram}</span>
                            </div>
                            <div className="grid grid-cols-[120px_1fr] gap-1">
                              <span className="font-medium">Processor:</span>
                              <span>{product.processor}</span>
                            </div>
                            <div className="grid grid-cols-[120px_1fr] gap-1">
                              <span className="font-medium">Camera:</span>
                              <span>{product.camera}</span>
                            </div>
                            <div className="grid grid-cols-[120px_1fr] gap-1">
                              <span className="font-medium">Display:</span>
                              <span>{product.display}</span>
                            </div>
                            <div className="grid grid-cols-[120px_1fr] gap-1">
                              <span className="font-medium">Warranty:</span>
                              <span>{product.warranty}</span>
                            </div>
                          </div>
                        </div>
                        <div className="w-full mt-6 flex flex-col gap-2">
                          <motion.button
                            className={`w-full py-3 rounded-lg font-medium text-white shadow-md flex items-center justify-center gap-2 ${theme === "dark" ? "bg-violet-600" : "bg-violet-500"
                              }`}
                            onClick={() => handleAddToCart(product)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FaCartPlus />
                            <span>Add to Cart</span>
                          </motion.button>
                          <motion.button
                            className={`w-full py-3 rounded-lg font-medium text-white shadow-md flex items-center justify-center gap-2 ${theme === "dark" ? "bg-violet-700" : "bg-violet-600"
                              }`}
                            onClick={() => handleBuyNow(product)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FaShoppingBag />
                            <span>Buy Now</span>
                          </motion.button>
                          <motion.button
                            className={`w-full py-2 mt-1 rounded-lg font-medium shadow-sm flex items-center justify-center gap-2 ${theme === "dark"
                              ? "bg-gray-700 text-gray-200"
                              : "bg-gray-100 text-gray-700"
                              }`}
                            onClick={() => setShowSpecModal(product.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FaRegEye />
                            <span>View Full Specification</span>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </>
            )}
          </div>

          <div
            className="mt-8 opacity-0 animate-fadeIn rounded-lg overflow-hidden"
            style={{
              animationDelay: '0.8s',
              animationFillMode: 'forwards'
            }}
          >
            <div className={`${theme === "dark"
              ? "glass-dark"
              : "glass-light"
              }`}>
              <div className="flex border-b overflow-x-auto scrollbar-hide relative">
                <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white dark:from-gray-800 to-transparent pointer-events-none z-10"></div>
                {[
                  { id: "highlights", label: "Highlights" },
                  { id: "ratings", label: "Ratings & Reviews" },
                  { id: "general", label: "General Features" },
                  { id: "seller", label: "Seller" },
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap relative ${activeTab === tab.id
                      ? theme === "dark"
                        ? "text-violet-400"
                        : "text-violet-600"
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
                <div className="p-5">
                  <div className={`text-xl font-semibold mb-6 ${theme === "dark" ? "text-violet-300" : "text-violet-700"}`}>Key Features</div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {product1 && product2 && (
                      <>
                        {[product1, product2].map((productId, idx) => {
                          const product = products.find(p => p.id === productId);
                          if (!product) return null;

                          return (
                            <div key={product.id}>
                              <div className="md:hidden text-lg font-semibold text-center mb-4">
                                <h3 className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                                  {product.name.split('(')[0].trim()}
                                </h3>
                              </div>

                              <div className="space-y-4">
                                <div className={`p-4 rounded-lg ${theme === "dark" ? "" : "bg-gray-50"} border ${theme === "dark" ? "border-violet-800/20" : "border-violet-100"}`}>
                                  <div className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Storage</div>
                                  <div className={`text-base font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{product.storage}</div>
                                </div>

                                <div className={`p-4 rounded-lg ${theme === "dark" ? "" : "bg-gray-50"} border ${theme === "dark" ? "border-violet-800/20" : "border-violet-100"}`}>
                                  <div className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>RAM</div>
                                  <div className={`text-base font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{product.ram}</div>
                                </div>

                                <div className={`p-4 rounded-lg ${theme === "dark" ? "" : "bg-gray-50"} border ${theme === "dark" ? "border-violet-800/20" : "border-violet-100"}`}>
                                  <div className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Processor</div>
                                  <div className={`text-base font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{product.processor}</div>
                                </div>

                                <div className={`p-4 rounded-lg ${theme === "dark" ? "" : "bg-gray-50"} border ${theme === "dark" ? "border-violet-800/20" : "border-violet-100"}`}>
                                  <div className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Camera</div>
                                  <div className={`text-base font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{product.camera}</div>
                                </div>

                                <div className={`p-4 rounded-lg ${theme === "dark" ? "" : "bg-gray-50"} border ${theme === "dark" ? "border-violet-800/20" : "border-violet-100"}`}>
                                  <div className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Display</div>
                                  <div className={`text-base font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{product.display}</div>
                                </div>

                                <div className={`p-4 rounded-lg ${theme === "dark" ? "" : "bg-gray-50"} border ${theme === "dark" ? "border-violet-800/20" : "border-violet-100"}`}>
                                  <div className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Battery</div>
                                  <div className={`text-base font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{product.battery}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>

                  <div className="mt-12">
                    <div className={`text-xl font-semibold mb-6 ${theme === "dark" ? "text-violet-300" : "text-violet-700"}`}>Comparison Metrics</div>

                    <div className="space-y-8">
                      <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 items-center">
                        <div className={`text-base font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Value for Money</div>

                        {product1 && product2 && (
                          <>
                            {[product1, product2].map(productId => {
                              const product = products.find(p => p.id === productId);
                              if (!product) return null;

                              return (
                                <div key={`value-${product.id}`}>
                                  <div className={`w-full h-6 rounded-full ${theme === "dark" ? "bg-indigo-900/50 backdrop-blur-sm" : "bg-indigo-100/50 backdrop-blur-sm"}`}>
                                    <div
                                      className={`h-6 rounded-full ${theme === "dark" ? "bg-gradient-to-r from-violet-600 to-indigo-600" : "bg-gradient-to-r from-violet-500 to-indigo-500"} flex items-center justify-center text-sm font-medium text-white`}
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

                      <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 items-center">
                        <div className={`text-base font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Build Quality</div>

                        {product1 && product2 && (
                          <>
                            {[product1, product2].map(productId => {
                              const product = products.find(p => p.id === productId);
                              if (!product) return null;

                              return (
                                <div key={`quality-${product.id}`}>
                                  <div className={`w-full h-6 rounded-full ${theme === "dark" ? "bg-indigo-900/50 backdrop-blur-sm" : "bg-indigo-100/50 backdrop-blur-sm"}`}>
                                    <div
                                      className={`h-6 rounded-full ${theme === "dark" ? "bg-gradient-to-r from-violet-600 to-indigo-600" : "bg-gradient-to-r from-violet-500 to-indigo-500"} flex items-center justify-center text-sm font-medium text-white`}
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

                      <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 items-center">
                        <div className={`text-base font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Market Share</div>

                        {product1 && product2 && (
                          <>
                            {[product1, product2].map(productId => {
                              const product = products.find(p => p.id === productId);
                              if (!product) return null;

                              return (
                                <div key={`popularity-${product.id}`}>
                                  <div className={`w-full h-6 rounded-full ${theme === "dark" ? "bg-indigo-900/50 backdrop-blur-sm" : "bg-indigo-100/50 backdrop-blur-sm"}`}>
                                    <div
                                      className={`h-6 rounded-full ${theme === "dark" ? "bg-gradient-to-r from-violet-600 to-indigo-600" : "bg-gradient-to-r from-violet-500 to-indigo-500"} flex items-center justify-center text-sm font-medium text-white`}
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
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {product1 && product2 && (
                      <>
                        {[product1, product2].map(productId => {
                          const product = products.find(p => p.id === productId);
                          if (!product) return null;
                          const reviews = mockReviews[productId] || [];
                          return (
                            <div key={product.id} className="text-center">
                              <div className={`font-semibold ${theme === "dark" ? "text-violet-400" : "text-violet-600"}`}>{product.name.split('(')[0].trim()}</div>
                              <div className="mt-6 space-y-6">
                                {reviews.map((review, idx) => (
                                  <div key={idx} className={`p-4 rounded-lg ${theme === "dark" ? "glass-card-dark" : "glass-card-light"} text-left`}>
                                    <div className="flex justify-between mb-2">
                                      <div className="flex items-center">
                                        <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${review.rating >= 4
                                          ? theme === "dark"
                                            ? 'bg-violet-900 text-violet-200'
                                            : 'bg-violet-100 text-violet-800'
                                          : theme === "dark"
                                            ? 'bg-yellow-900 text-yellow-200'
                                            : 'bg-yellow-100 text-yellow-800'
                                          }`}>
                                          {review.rating}
                                          <span className={`ml-1 ${theme === "dark" ? "text-violet-300" : "text-violet-500"}`}>★</span>
                                        </div>
                                        <div className="ml-2 font-medium">{review.title}</div>
                                      </div>
                                      <div className={`text-xs ${theme === "dark" ? "text-violet-300" : "text-violet-500"}`}>{review.date}</div>
                                    </div>
                                    <div className={`text-xs ${theme === "dark" ? "text-violet-300" : "text-violet-500"} mb-1`}>by {review.user}</div>
                                    <p className="text-sm">{review.text}</p>
                                    <div className="flex mt-3 text-xs">
                                      <div className={`mr-4 flex items-center ${theme === "dark" ? "text-violet-300" : "text-violet-500"}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                        </svg>
                                        Helpful ({review.helpful})
                                      </div>
                                      <div className={`flex items-center ${theme === "dark" ? "text-violet-300" : "text-violet-500"}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2" />
                                        </svg>
                                        Not Helpful ({review.notHelpful})
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4">
                                <button className={`text-sm font-medium ${theme === "dark" ? "text-violet-400 hover:text-violet-300" : "text-violet-600 hover:text-violet-800"}`}>View all {reviews.length} reviews →</button>
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
                <div className="p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="hidden sm:block space-y-4 rounded-lg overflow-hidden">
                      <div className={`p-3 sticky top-0 z-10 ${theme === "dark" ? "glass-dark" : "glass-light"
                        }`}>
                        <div className={`font-semibold ${theme === "dark" ? "text-violet-400" : "text-violet-600"}`}>Specifications</div>
                      </div>

                      <div className="space-y-4 px-3">
                        <div className="font-medium">SIM Type</div>
                        <div className="font-medium">OS</div>
                        <div className="font-medium">Network Type</div>
                        <div className="font-medium">Screen Size</div>
                        <div className="font-medium">Resolution</div>
                        <div className="font-medium">Internal Storage</div>
                        <div className="font-medium">RAM</div>
                        <div className="font-medium">Primary Camera</div>
                        <div className="font-medium">Front Camera</div>
                      </div>
                    </div>

                    {product1 && product2 && (
                      <>
                        {[product1, product2].map(productId => {
                          const product = products.find(p => p.id === productId);
                          if (!product) return null;

                          return (
                            <div key={product.id} className="space-y-4">
                              <div className={`p-3 sticky top-0 z-10 text-center ${theme === "dark" ? "glass-dark" : "glass-light"
                                }`}>
                                <div className={`font-semibold ${theme === "dark" ? "text-violet-400" : "text-violet-600"}`}>{product.name.split('(')[0].trim()}</div>
                              </div>

                              <div className="space-y-4 px-3">
                                <div className={`p-2 rounded-lg ${theme === "dark" ? "glass-card-dark" : "glass-card-light"} transition-all hover:shadow-md`}>Dual SIM (Nano)</div>
                                <div className={`p-2 rounded-lg ${theme === "dark" ? "glass-card-dark" : "glass-card-light"} transition-all hover:shadow-md`}>{product.features.os}</div>
                                <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-violet-900/20" : "bg-violet-50"} transition-all hover:shadow-md`}>5G, 4G VOLTE, 4G, 3G</div>
                                <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-violet-900/20" : "bg-violet-50"} transition-all hover:shadow-md`}>{product.features.screenSize}</div>
                                <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-violet-900/20" : "bg-violet-50"} transition-all hover:shadow-md`}>{product.display}</div>
                                <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-violet-900/20" : "bg-violet-50"} transition-all hover:shadow-md`}>{product.storage}</div>
                                <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-violet-900/20" : "bg-violet-50"} transition-all hover:shadow-md`}>{product.ram}</div>
                                <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-violet-900/20" : "bg-violet-50"} transition-all hover:shadow-md`}>{product.camera}</div>
                                <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-violet-900/20" : "bg-violet-50"} transition-all hover:shadow-md`}>{product.features.frontCamera}</div>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>

                  {product1 && product2 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4 text-violet-600 dark:text-violet-400">Additional Features</h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          { title: "Water Resistant", value: "Yes", icon: "💧" },
                          { title: "Dust Resistant", value: "Yes", icon: "🛡️" },
                          { title: "Fast Charging", value: "Yes", icon: "⚡" },
                          { title: "Wireless Charging", value: product1 && product1.includes('iphone') ? "Yes" : "No", icon: "🔋" },
                          { title: "NFC", value: "Yes", icon: "📱" },
                          { title: "Face Recognition", value: "Yes", icon: "👤" }
                        ].map((feature, idx) => (
                          <div
                            key={idx}
                            className={`p-4 rounded-lg flex items-center ${theme === "dark"
                              ? "glass-card-dark hover:bg-indigo-800/60"
                              : "glass-card-light hover:bg-white/90"
                              } transition-all`}
                          >
                            <div className="text-2xl mr-3">{feature.icon}</div>
                            <div>
                              <div className="font-medium">{feature.title}</div>
                              <div className={`text-sm ${feature.value === "Yes" ? "text-green-500" : "text-red-500"}`}>
                                {feature.value}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}


                </div>
              )}

              {/* Seller Tab */}
              {activeTab === "seller" && (
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:block hidden">
                      <div className="font-semibold mb-4 text-violet-600 dark:text-violet-400">Seller Information</div>
                      <div className={`p-4 rounded-lg ${theme === "dark" ? "glass-card-dark" : "glass-card-light"}`}>
                        <div className="text-sm mb-6">
                          All sellers on TechCompare are verified and must meet our quality standards. You can choose your preferred seller based on ratings, price, and service options.
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm">7-day Replacement Guarantee</span>
                          </div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm">Genuine Products</span>
                          </div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
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
                                <div key={idx} className={`p-4 rounded-lg ${theme === "dark" ? "glass-card-dark" : "glass-card-light"} mb-4`}>
                                  <div className="flex items-center mb-2">
                                    <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center mr-3">
                                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${theme === "dark" ? "text-violet-400" : "text-violet-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{seller.name}</div>
                                      <div className="flex items-center">
                                        <div className={`${theme === "dark" ? "bg-violet-900 text-violet-200" : "bg-violet-100 text-violet-800"} text-xs px-1.5 py-0.5 rounded`}>
                                          {seller.rating} ★
                                        </div>
                                        <div className={`text-xs ml-2 ${theme === "dark" ? "text-violet-300" : "text-violet-500"}`}>{seller.reviews} reviews</div>
                                      </div>
                                      <div className={`text-xs ${theme === "dark" ? "text-violet-300" : "text-violet-400"}`}>{seller.location}</div>
                                    </div>
                                  </div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Delivery</span>
                                    <span className="font-medium text-green-600">{seller.delivery}</span>
                                  </div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Warranty</span>
                                    <span className="font-medium">{seller.warranty}</span>
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
                className="absolute top-3 right-3 text-violet-400 hover:text-violet-600 dark:hover:text-violet-400 text-2xl"
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
                  {mockFullSpecs[showSpecModal]?.map((spec, idx) => (
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
              className={`px-4 py-3 rounded-lg shadow-lg max-w-xs backdrop-blur-lg flex items-center space-x-2 border border-white/20 ${toast.type === 'success'
                ? 'bg-violet-600/90 text-white'
                : 'bg-red-600/90 text-white'
                }`}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                {toast.type === 'success' && <FaCheckSquare className="text-white" />}
                {toast.type === 'error' && (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </motion.div>
              <span>{toast.message}</span>
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
"use client";

import React, { useState, useEffect } from "react";
import { Open_Sans } from "next/font/google";
import {
  Coffee,
  ShoppingCart,
  Star,
  X,
  Clock,
  MapPin,
  Phone,
  Heart,
  Plus,
  Minus,
  CheckCircle,
  Menu as MenuIcon,
  Send,
  Award,
  Users,
  Zap,
  ChevronRight,
  Eye,
  Filter,
  Info,
} from "lucide-react";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: "coffee" | "pastry";
  rating: number;
  isSpecial?: boolean;
  ingredients?: string[];
  calories?: number;
  caffeine?: string;
  size?: string[];
}

interface CartItem extends MenuItem {
  quantity: number;
  selectedSize?: string;
}

interface Feedback {
  id: number;
  itemId: number;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  verified?: boolean;
}

const CoffeeShopWebsite: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  const [showOrderConfirm, setShowOrderConfirm] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [newFeedback, setNewFeedback] = useState({
    rating: 5,
    comment: "",
    customerName: "",
  });
  const [activeCategory, setActiveCategory] = useState<
    "all" | "coffee" | "pastry"
  >("all");
  const [addedToCartItems, setAddedToCartItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const isLocked = drawerOpen || showAbout || selectedItem !== null;
    if (isLocked) {
      // Save current scroll position
      const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
      const body = document.body;
      body.style.position = 'fixed';
      body.style.top = `-${window.scrollY}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const body = document.body;
      const scrollY = body.style.top;
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    
    return () => {
      // Cleanup on unmount
      const body = document.body;
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.overflow = '';
    };
  }, [drawerOpen, showAbout, selectedItem]);

  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: "Quantum Espresso",
      price: 4.5,
      description:
        "An intense, revolutionary espresso shot that transcends ordinary coffee experiences. Crafted with precision-roasted Ethiopian and Colombian beans using molecular gastronomy techniques.",
      image:
        "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=500&h=400&fit=crop",
      category: "coffee",
      rating: 4.9,
      isSpecial: true,
      ingredients: ["Ethiopian beans", "Colombian beans", "Nitrogen infusion"],
      calories: 5,
      caffeine: "High",
      size: ["Single", "Double"],
    },
    {
      id: 2,
      name: "Neon Vanilla Latte",
      price: 5.75,
      description:
        "A luminescent blend of espresso and steamed milk with premium Madagascar vanilla and edible glitter that creates a magical drinking experience.",
      image:
        "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=400&fit=crop",
      category: "coffee",
      rating: 4.7,
      ingredients: [
        "Espresso",
        "Steamed milk",
        "Madagascar vanilla",
        "Edible glitter",
      ],
      calories: 180,
      caffeine: "Medium",
      size: ["12oz", "16oz", "20oz"],
    },
    {
      id: 3,
      name: "Cyber Caramel Macchiato",
      price: 6.25,
      description:
        "Futuristic layered beverage with smart-temperature espresso, quantum foam milk, and programmable caramel drizzle that changes flavor as you drink.",
      image:
        "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500&h=400&fit=crop",
      category: "coffee",
      rating: 4.8,
      ingredients: [
        "Smart espresso",
        "Quantum foam",
        "Programmable caramel",
        "Vanilla syrup",
      ],
      calories: 220,
      caffeine: "High",
      size: ["12oz", "16oz", "20oz"],
    },
    {
      id: 4,
      name: "Holographic Croissant",
      price: 4.25,
      description:
        "Bio-engineered pastry with 47 layers of molecular butter, creating an iridescent appearance that shifts colors as you eat.",
      image:
        "https://elements-resized.envatousercontent.com/elements-video-cover-images/7ee889f4-24ba-4070-97e7-dfda7b17bc65/video_preview/video_preview_0000.jpg?w=500&cf_fit=cover&q=85&format=auto&s=ab3e53acbf9abc0f701f2016f217bbe956bf624d33f0cf44c636045ecd419279",
      category: "pastry",
      rating: 4.6,
      isSpecial: true,
      ingredients: [
        "Molecular butter",
        "Organic flour",
        "Crystalline salt",
        "Holographic dust",
      ],
      calories: 280,
      size: ["Regular"],
    },
    {
      id: 5,
      name: "Matrix Chocolate Muffin",
      price: 3.95,
      description:
        "Reality-bending muffin infused with Belgian dark chocolate neurons that create synaptic flavor explosions with each bite.",
      image:
        "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=500&h=400&fit=crop",
      category: "pastry",
      rating: 4.5,
      ingredients: [
        "Belgian chocolate neurons",
        "Quantum flour",
        "Organic eggs",
        "Neural sugar",
      ],
      calories: 320,
      size: ["Regular", "Large"],
    },
    {
      id: 6,
      name: "Arctic Cold Brew",
      price: 5.0,
      description:
        "Cryogenically brewed coffee using sub-zero extraction methods, served in a self-cooling vessel that maintains perfect temperature for 2 hours.",
      image:
        "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&h=400&fit=crop",
      category: "coffee",
      rating: 4.8,
      ingredients: [
        "Cryogenic beans",
        "Nitrogen",
        "Ice crystals",
        "Molecular sweetener",
      ],
      calories: 10,
      caffeine: "Very High",
      size: ["12oz", "16oz", "20oz"],
    },
    {
      id: 7,
      name: "Neural Network Americano",
      price: 4.0,
      description:
        "AI-optimized coffee blend that adapts to your taste preferences using bio-sensors in the cup.",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=400&fit=crop",
      category: "coffee",
      rating: 4.6,
      ingredients: ["AI-optimized beans", "Smart water", "Adaptive compounds"],
      calories: 8,
      caffeine: "Medium",
      size: ["12oz", "16oz"],
    },
    {
      id: 8,
      name: "Plasma Energy Smoothie",
      price: 6.5,
      description:
        "Supercharged smoothie with ionized fruits and energy-boosting plasma particles for maximum vitality.",
      image:
        "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&h=400&fit=crop",
      category: "coffee",
      rating: 4.7,
      ingredients: [
        "Ionized berries",
        "Plasma particles",
        "Quantum protein",
        "Energy crystals",
      ],
      calories: 250,
      caffeine: "Low",
      size: ["16oz", "20oz"],
    },
  ];

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: 1,
      itemId: 1,
      customerName: "Alex Chen",
      rating: 5,
      comment:
        "This espresso is from another dimension! The molecular gastronomy techniques create an incredible depth of flavor.",
      date: "2024-05-28",
      verified: true,
    },
    {
      id: 2,
      itemId: 1,
      customerName: "Sarah M.",
      rating: 5,
      comment:
        "Best espresso in the galaxy! The nitrogen infusion adds a whole new level.",
      date: "2024-05-27",
      verified: true,
    },
    {
      id: 3,
      itemId: 2,
      customerName: "Mike R.",
      rating: 4,
      comment:
        "The edible glitter is mind-blowing! Tastes amazing and looks incredible.",
      date: "2024-05-26",
      verified: false,
    },
    {
      id: 4,
      itemId: 4,
      customerName: "Emma L.",
      rating: 5,
      comment:
        "Watching this croissant change colors while eating it is surreal. Tastes even better!",
      date: "2024-05-25",
      verified: true,
    },
    {
      id: 5,
      itemId: 6,
      customerName: "David K.",
      rating: 5,
      comment:
        "The self-cooling vessel is genius! Coffee stayed perfect for my entire 2-hour meeting.",
      date: "2024-05-24",
      verified: true,
    },
  ]);

  useEffect(() => {
    const specialItems = menuItems.filter((item) => item.isSpecial);
    const interval = setInterval(() => {
      setCurrentRotation((prev) => (prev + 1) % specialItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const addToCart = (item: MenuItem, selectedSize?: string) => {
    const cartItem = { ...item, selectedSize: selectedSize || item.size?.[0] };
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) =>
          cartItem.id === item.id && cartItem.selectedSize === selectedSize
      );
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id && cartItem.selectedSize === selectedSize
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...cartItem, quantity: 1 }];
      }
    });
    
    // Show button indication
    setAddedToCartItems(prev => new Set(prev).add(item.id));
    
    // Clear button indication after 2 seconds
    setTimeout(() => {
      setAddedToCartItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }, 2000);
  };

  const updateQuantity = (
    id: number,
    change: number,
    selectedSize?: string
  ) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id && item.selectedSize === selectedSize) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const placeOrder = () => {
    if (cart.length > 0) {
      setShowOrderConfirm(true);
      setDrawerOpen(false);
      setTimeout(() => {
        setCart([]);
        setShowOrderConfirm(false);
      }, 3000);
    }
  };

  const submitFeedback = () => {
    if (newFeedback.customerName && newFeedback.comment && selectedItem) {
      const feedback: Feedback = {
        id: feedbacks.length + 1,
        itemId: selectedItem.id,
        customerName: newFeedback.customerName,
        rating: newFeedback.rating,
        comment: newFeedback.comment,
        date: new Date().toISOString().split("T")[0],
        verified: false,
      };
      setFeedbacks([feedback, ...feedbacks]);
      setNewFeedback({ rating: 5, comment: "", customerName: "" });
    }
  };

  const getItemFeedbacks = (itemId: number) => {
    return feedbacks.filter((feedback) => feedback.itemId === itemId);
  };

  const getSimilarItems = (currentItem: MenuItem) => {
    return menuItems
      .filter(
        (item) =>
          item.id !== currentItem.id && item.category === currentItem.category
      )
      .slice(0, 3);
  };

  const filteredItems = menuItems.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  const specialItems = menuItems.filter((item) => item.isSpecial);

  return (
    <div className={`min-h-screen bg-amber-50 text-gray-800 overflow-hidden ${openSans.className}`}>
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl">
        <div className="container mx-auto px-3 lg:px-6 py-2 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative">
                <div className="bg-amber-600 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                  <Coffee className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-black text-amber-800">
                  Brew Haven
                </h1>
                <p className="text-xs sm:text-sm font-bold text-amber-700 tracking-wider">
                  ARTISAN COFFEE
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-6">
              <button
                onClick={() => setShowAbout(true)}
                className="cursor-pointer px-3 sm:px-6 py-1.5 sm:py-2 font-bold text-amber-700 bg-amber-100 rounded-lg sm:rounded-xl hover:bg-amber-200 transition-all duration-300 flex items-center justify-center"
              >
                <Info className="h-5 w-5 sm:h-5 sm:w-5 block sm:hidden" />
                <span className="hidden sm:inline">About</span>
              </button>
              <button
                onClick={() => setDrawerOpen(true)}
                className="relative p-2 sm:p-3 bg-amber-600 rounded-lg sm:rounded-xl hover:bg-amber-700 transition-all duration-300 cursor-pointer"
              >
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center font-bold">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row pt-16 sm:pt-20 min-h-screen">
        {/* Left Content Area */}
        <div className="flex-1 p-4 lg:p-6 lg:pr-0">
          <div className="relative mb-8 lg:mb-12 h-48 lg:h-80 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-amber-900/10"></div>
            <img
              src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&h=400&fit=crop"
              alt="Cozy coffee shop"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div>
                <h2 className="text-5xl font-black mb-4 text-white drop-shadow-lg">
                  Welcome to Brew Haven
                </h2>
                <p className="text-xl text-white font-bold drop-shadow-md">
                  Experience artisan coffee perfection
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Award className="h-8 w-8 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-800">99.9%</h3>
                  <p className="text-amber-700 font-bold">
                    Customer Satisfaction
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Users className="h-8 w-8 text-orange-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-800">50K+</h3>
                  <p className="text-orange-700 font-bold">Happy Customers</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Zap className="h-8 w-8 text-yellow-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-800">24/7</h3>
                  <p className="text-yellow-700 font-bold">Premium Service</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            {/* Menu Heading */}
            <div>
              <h2 className="text-4xl font-black text-gray-800 mb-2">Our Menu</h2>
              <p className="text-gray-600 text-lg">Discover our handcrafted beverages and artisan pastries</p>
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              {[
                { key: "all", label: "All Items", icon: <Star className="h-4 w-4" /> },
                { key: "coffee", label: "Coffee", icon: <Coffee className="h-4 w-4" /> },
                { key: "pastry", label: "Pastries", icon: <Heart className="h-4 w-4" /> },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveCategory(filter.key as any)}
                  className={`cursor-pointer px-3 py-2 sm:px-6 sm:py-3 rounded-xl font-bold transition-all duration-300 flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base whitespace-nowrap flex-shrink-0 ${
                    activeCategory === filter.key
                      ? "bg-amber-600 text-white"
                      : "bg-white text-gray-700 hover:bg-amber-50"
                  }`}
                >
                  {filter.icon}
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-500 cursor-pointer transform hover:scale-105"
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  {item.isSpecial && (
                    <div className="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      SPECIAL
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-black text-white mb-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-amber-300">
                        ${item.price.toFixed(2)}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-white font-bold">
                          {item.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                      className={`cursor-pointer px-4 py-2 rounded-xl transition-all duration-300 font-bold flex items-center space-x-2 ${
                        addedToCartItems.has(item.id)
                          ? "bg-green-600 text-white"
                          : "bg-amber-600 text-white hover:bg-amber-700"
                      }`}
                    >
                      {addedToCartItems.has(item.id) ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                    <button className="cursor-pointer text-amber-700 hover:text-amber-600 transition-colors duration-300 flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-bold">Details</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content Area - Desktop */}
        <div className="hidden lg:block w-80 p-6 pl-6">
          <div className="h-full">
            <div className="sticky top-20 pb-24">
              <div className="space-y-6">
                <div className="bg-white rounded-2xl overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-black mb-4 text-amber-800 flex items-center">
                      <Star className="h-5 w-5 mr-2" />
                      Today's Special
                    </h3>
                    {specialItems.length > 0 && (
                      <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                        <div
                          className="flex transition-transform duration-1000 ease-in-out h-full"
                          style={{
                            transform: `translateX(-${currentRotation * 100}%)`,
                          }}
                        >
                          {specialItems.map((item) => (
                            <div
                              key={item.id}
                              className="min-w-full h-full relative cursor-pointer"
                              onClick={() => setSelectedItem(item)}
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                              <div className="absolute bottom-3 left-3 right-3 text-white">
                                <h4 className="font-black text-lg">{item.name}</h4>
                                <p className="text-amber-300 font-bold">
                                  ${item.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h3 className="text-xl font-black mb-4 text-amber-800">
                    Visit Our Café
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-amber-700 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-gray-800">123 Coffee Street</p>
                        <p className="text-gray-600">Downtown District</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-amber-700 flex-shrink-0" />
                      <span className="font-bold text-gray-800">(555) BREW-CAFE</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-amber-700 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-gray-800">Mon-Sun 6AM-10PM</p>
                        <p className="text-gray-600">Always Fresh</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h3 className="text-xl font-black mb-4 text-amber-800">
                    Other Locations
                  </h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-amber-50 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 text-amber-700 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-gray-800 text-sm">Brew Haven Mall</p>
                          <p className="text-gray-600 text-xs">Central Shopping Mall, Level 2</p>
                          <p className="text-amber-700 text-xs font-medium">7AM-11PM Daily</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-amber-50 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 text-amber-700 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-gray-800 text-sm">Brew Haven Express</p>
                          <p className="text-gray-600 text-xs">Airport Terminal A, Gate 15</p>
                          <p className="text-amber-700 text-xs font-medium">5AM-12AM Daily</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-amber-50 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 text-amber-700 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-gray-800 text-sm">Brew Haven Campus</p>
                          <p className="text-gray-600 text-xs">University Square, Building C</p>
                          <p className="text-amber-700 text-xs font-medium">6AM-10PM Mon-Fri</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 text-amber-700 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-gray-800 text-sm">Brew Haven Station</p>
                          <p className="text-gray-600 text-xs">Grand Central Station, Platform 7</p>
                          <p className="text-amber-700 text-xs font-medium">5:30AM-11PM Daily</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 text-amber-700 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-gray-800 text-sm">Brew Haven Tech</p>
                          <p className="text-gray-600 text-xs">Silicon Valley Business Park</p>
                          <p className="text-amber-700 text-xs font-medium">6AM-9PM Weekdays</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 text-amber-700 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-gray-800 text-sm">Brew Haven Waterfront</p>
                          <p className="text-gray-600 text-xs">Marina Bay Promenade, Pier 9</p>
                          <p className="text-amber-700 text-xs font-medium">7AM-10PM Daily</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 text-amber-700 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-gray-800 text-sm">Brew Haven Medical</p>
                          <p className="text-gray-600 text-xs">City Hospital, Main Lobby</p>
                          <p className="text-amber-700 text-xs font-medium">24/7 Service</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 text-amber-700 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-gray-800 text-sm">Brew Haven Drive-Thru</p>
                          <p className="text-gray-600 text-xs">Highway 101, Exit 15</p>
                          <p className="text-amber-700 text-xs font-medium">5AM-11PM Daily</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-amber-100">
                      <p className="text-xs text-gray-500 text-center">
                        8 locations and growing! More opening soon.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area - Mobile */}
        <div className="lg:hidden p-4 space-y-4 mb-20">
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="p-4">
              <h3 className="text-xl font-black mb-4 text-amber-800 flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Today's Special
              </h3>
              {specialItems.length > 0 && (
                <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                  <div
                    className="flex transition-transform duration-1000 ease-in-out h-full"
                    style={{
                      transform: `translateX(-${currentRotation * 100}%)`,
                    }}
                  >
                    {specialItems.map((item) => (
                      <div
                        key={item.id}
                        className="min-w-full h-full relative cursor-pointer"
                        onClick={() => setSelectedItem(item)}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <h4 className="font-black text-lg">{item.name}</h4>
                          <p className="text-amber-300 font-bold">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4">
            <h3 className="text-xl font-black mb-4 text-amber-800">
              Visit Our Café
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-amber-700 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-800">123 Coffee Street</p>
                  <p className="text-gray-600">Downtown District</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-amber-700 flex-shrink-0" />
                <span className="font-bold text-gray-800">(555) BREW-CAFE</span>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-amber-700 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-800">Mon-Sun 6AM-10PM</p>
                  <p className="text-gray-600">Always Fresh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Artisan Craftsmanship - Full Width Section */}
      <div className="w-full relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-amber-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl mb-6 shadow-xl">
              <Coffee className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-800 via-orange-700 to-yellow-700">
              Artisan Craftsmanship
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Where tradition meets innovation in every cup and every bite
            </p>
          </div>

          {/* Content Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Precision Brewing Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/50 group-hover:transform group-hover:scale-105 transition-all duration-500">
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg mr-6">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mb-2">
                      Precision Brewing
                    </h3>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Our master baristas use traditional techniques combined with modern precision to create the perfect cup every time.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">Traditional Methods</span>
                  <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">Expert Baristas</span>
                  <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">Perfect Temperature</span>
                </div>
              </div>
            </div>

            {/* Artisan Pastries Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/50 group-hover:transform group-hover:scale-105 transition-all duration-500">
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg mr-6">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mb-2">
                      Artisan Pastries
                    </h3>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"></div>
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Experience handcrafted pastries made with premium ingredients and traditional baking methods.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">Fresh Daily</span>
                  <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">Premium Ingredients</span>
                  <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold">Handcrafted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Statistics */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-amber-800 mb-2">15+</div>
              <div className="text-gray-600 font-semibold">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-orange-800 mb-2">50+</div>
              <div className="text-gray-600 font-semibold">Unique Blends</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-yellow-800 mb-2">100%</div>
              <div className="text-gray-600 font-semibold">Organic Beans</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-red-800 mb-2">24/7</div>
              <div className="text-gray-600 font-semibold">Fresh Baking</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-amber-900 py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-black text-lg mb-4 text-amber-200">
                Brew Haven
              </h4>
              <p className="text-amber-100/80 text-sm">
                Crafting exceptional coffee experiences since 2024.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <a
                  href="#"
                  className="block text-amber-200/80 hover:text-amber-200 transition-colors"
                >
                  Menu
                </a>
                <a
                  href="#"
                  className="block text-amber-200/80 hover:text-amber-200 transition-colors"
                >
                  About
                </a>
                <a
                  href="#"
                  className="block text-amber-200/80 hover:text-amber-200 transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Our Craft</h4>
              <div className="space-y-2 text-sm">
                <a
                  href="#"
                  className="block text-amber-200/80 hover:text-amber-200 transition-colors"
                >
                  Single Origin
                </a>
                <a
                  href="#"
                  className="block text-amber-200/80 hover:text-amber-200 transition-colors"
                >
                  House Blends
                </a>
                <a
                  href="#"
                  className="block text-amber-200/80 hover:text-amber-200 transition-colors"
                >
                  Fresh Pastries
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center hover:bg-amber-500 transition-all duration-300 group"
                >
                  <span className="text-white font-black text-lg group-hover:scale-110 transition-transform duration-200">
                    F
                  </span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center hover:bg-orange-500 transition-all duration-300 group"
                >
                  <span className="text-white font-black text-lg group-hover:scale-110 transition-transform duration-200">
                    P
                  </span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-yellow-600 rounded-xl flex items-center justify-center hover:bg-yellow-500 transition-all duration-300 group"
                >
                  <span className="text-white font-black text-lg group-hover:scale-110 transition-transform duration-200">
                    T
                  </span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center hover:bg-red-500 transition-all duration-300 group"
                >
                  <span className="text-white font-black text-lg group-hover:scale-110 transition-transform duration-200">
                    I
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 text-center">
            <p className="text-amber-200/80 text-sm">
              © 2024 Brew Haven. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          ></div>
          <div className="absolute right-0 top-0 h-full w-full sm:max-w-md bg-white p-4 lg:p-6 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-800 flex items-center">
                <ShoppingCart className="h-6 w-6 mr-3 text-amber-700" />
                Your Cart
              </h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="cursor-pointer p-2 hover:bg-amber-100 rounded-xl transition-colors duration-200"
              >
                <X className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="p-6 bg-amber-100 rounded-full mb-4">
                  <Coffee className="h-16 w-16 text-amber-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Cart is Empty
                </h3>
                <p className="text-gray-600 text-center">
                  Add some delicious items to get started!
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-4">
                  {cart.map((item, index) => (
                    <div
                      key={`${item.id}-${item.selectedSize}-${index}`}
                      className="bg-amber-50 rounded-xl p-4"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800">{item.name}</h4>
                          {item.selectedSize && (
                            <p className="text-amber-700 text-sm">
                              {item.selectedSize}
                            </p>
                          )}
                          <p className="text-gray-600 text-sm">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, -1, item.selectedSize)
                            }
                            className="cursor-pointer p-1 hover:bg-amber-200 rounded-lg transition-colors duration-200"
                          >
                            <Minus className="h-4 w-4 text-gray-700" />
                          </button>
                          <span className="w-8 text-center font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, 1, item.selectedSize)
                            }
                            className="cursor-pointer p-1 hover:bg-amber-200 rounded-lg transition-colors duration-200"
                          >
                            <Plus className="h-4 w-4 text-gray-700" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 flex-none">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-bold text-gray-800">Total:</span>
                    <span className="text-3xl font-black text-amber-700">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={placeOrder}
                    className="cursor-pointer w-full bg-amber-600 text-white py-4 rounded-xl font-black text-lg hover:bg-amber-700 transition-all duration-300"
                  >
                    Place Order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onWheel={(e) => e.preventDefault()}
          onTouchMove={(e) => e.preventDefault()}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
            onWheel={(e) => e.preventDefault()}
            onTouchMove={(e) => e.preventDefault()}
          ></div>
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden">
            <div className="relative h-60 sm:h-64 lg:h-80 overflow-hidden">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 cursor-pointer right-4 p-3 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-colors duration-200 z-10 shadow-lg"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
              </button>

              <div className="absolute inset-x-4 bottom-4">
                <div className="space-y-3">
                  <div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 drop-shadow-lg leading-tight">
                      {selectedItem.name}
                    </h2>
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-300 drop-shadow-lg">
                        ${selectedItem.price.toFixed(2)}
                      </span>
                      <div className="flex items-center space-x-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 sm:h-6 sm:w-6 ${
                              i < Math.floor(selectedItem.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-400"
                            } drop-shadow-sm`}
                          />
                        ))}
                        <span className="text-white font-bold text-lg sm:text-xl drop-shadow-lg">
                          ({selectedItem.rating})
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      addToCart(selectedItem);
                      setSelectedItem(null);
                    }}
                    className="bg-amber-600 cursor-pointer text-white px-6 py-3 rounded-xl font-black text-base sm:text-lg hover:bg-amber-700 transition-all duration-300 w-full shadow-lg"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="w-12 h-1 bg-amber-300 rounded-full"></div>
              </div>

              <div
                className="max-h-96 overflow-y-auto scroll-smooth"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#06b6d4 #1e293b",
                }}
              >
                <div className="p-8 pt-12">
                  <div className="mb-8 group">
                    <h3 className="text-2xl font-bold text-amber-800 mb-4 flex items-center">
                      <div className="w-1 h-6 bg-amber-600 rounded-full mr-3"></div>
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-lg bg-amber-50 rounded-2xl p-6">
                      {selectedItem.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-amber-50 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center">
                        <Zap className="h-5 w-5 mr-2" />
                        Specifications
                      </h3>
                      <div className="space-y-3">
                        {selectedItem.calories && (
                          <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                            <span className="text-gray-600 font-medium">
                              Calories:
                            </span>
                            <span className="text-gray-800 font-bold bg-amber-100 px-3 py-1 rounded-full text-sm">
                              {selectedItem.calories}
                            </span>
                          </div>
                        )}
                        {selectedItem.caffeine && (
                          <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                            <span className="text-gray-600 font-medium">
                              Caffeine:
                            </span>
                            <span className="text-gray-800 font-bold bg-orange-100 px-3 py-1 rounded-full text-sm">
                              {selectedItem.caffeine}
                            </span>
                          </div>
                        )}
                        {selectedItem.size && (
                          <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                            <span className="text-gray-600 font-medium">
                              Sizes:
                            </span>
                            <span className="text-gray-800 font-bold bg-yellow-100 px-3 py-1 rounded-full text-sm">
                              {selectedItem.size.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center">
                        <Coffee className="h-5 w-5 mr-2" />
                        Ingredients
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.ingredients?.map((ingredient, index) => (
                          <span
                            key={index}
                            className="px-3 py-2 bg-amber-200 text-amber-800 rounded-xl text-sm font-bold"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-8 group">
                    <h3 className="text-2xl font-bold text-amber-800 mb-6 flex items-center">
                      <div className="w-1 h-6 bg-amber-600 rounded-full mr-3"></div>
                      Similar Products
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {getSimilarItems(selectedItem).map((item) => (
                        <div
                          key={item.id}
                          className="group/item bg-white rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all duration-300"
                          onClick={() => setSelectedItem(item)}
                        >
                          <div className="relative overflow-hidden rounded-xl mb-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-28 object-cover group-hover/item:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <Eye className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <h4 className="font-bold text-gray-800 text-sm mb-1">
                            {item.name}
                          </h4>
                          <p className="text-amber-700 font-bold">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8 group">
                    <h3 className="text-2xl font-bold text-amber-800 mb-6 flex items-center">
                      <div className="w-1 h-6 bg-amber-600 rounded-full mr-3"></div>
                      Customer Reviews
                    </h3>
                    <div className="space-y-4">
                      {getItemFeedbacks(selectedItem.id).map((feedback) => (
                        <div
                          key={feedback.id}
                          className="bg-amber-50 rounded-2xl p-6"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {feedback.customerName.charAt(0)}
                              </div>
                              <div>
                                <span className="font-bold text-gray-800 text-lg">
                                  {feedback.customerName}
                                </span>
                                {feedback.verified && (
                                  <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                    ✓ VERIFIED
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-gray-500 text-sm">
                              {feedback.date}
                            </span>
                          </div>
                          <div className="flex items-center mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < feedback.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-400"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            {feedback.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                      <Send className="h-5 w-5 mr-2 text-amber-700" />
                      Add Your Review
                    </h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Your name"
                        value={newFeedback.customerName}
                        onChange={(e) =>
                          setNewFeedback({
                            ...newFeedback,
                            customerName: e.target.value,
                          })
                        }
                        className="w-full p-4 bg-white rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all duration-300"
                      />
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-800 font-bold">Rating:</span>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-7 w-7 cursor-pointer transition-all duration-200 ${
                              i < newFeedback.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-400"
                            } hover:scale-110`}
                            onClick={() =>
                              setNewFeedback({ ...newFeedback, rating: i + 1 })
                            }
                          />
                        ))}
                      </div>
                      <textarea
                        placeholder="Share your experience..."
                        value={newFeedback.comment}
                        onChange={(e) =>
                          setNewFeedback({
                            ...newFeedback,
                            comment: e.target.value,
                          })
                        }
                        className="w-full p-4 bg-white rounded-xl h-32 resize-none text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all duration-300"
                      />
                      <button
                        onClick={submitFeedback}
                        className="w-full cursor-pointer bg-amber-600 text-white py-4 rounded-xl font-bold hover:bg-amber-700 transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <Send className="h-5 w-5" />
                        <span>Submit Review</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation */}
      {showOrderConfirm && (
        <div className="fixed inset-0 bg-white flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-black mb-4 text-gray-800">
                Order Confirmed!
              </h2>
              <p className="text-xl mb-2 font-bold text-gray-700">
                Thank you for your order!
              </p>
              <p className="text-gray-600 mb-6">
                Your order will be ready for pickup in 10-15 minutes.
              </p>
              <p className="text-lg text-amber-700 font-black">
                Order Total: ${getTotalPrice().toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black text-gray-800">
                About Brew Haven
              </h2>
              <button
                onClick={() => setShowAbout(false)}
                className="cursor-pointer p-2 hover:bg-amber-100 rounded-xl transition-colors duration-200"
              >
                <X className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            <div className="space-y-6">
              <img
                src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=300&fit=crop"
                alt="Cozy coffee shop interior"
                className="w-full h-64 object-cover rounded-2xl"
              />

              <p className="text-gray-700 leading-relaxed text-lg">
                Welcome to Brew Haven, where we've perfected the art of coffee 
                craftsmanship using traditional methods and premium ingredients. 
                Founded in 2024, we're dedicated to creating exceptional coffee experiences.
              </p>

              <p className="text-gray-700 leading-relaxed text-lg">
                Our skilled baristas and artisan bakers work together to create 
                beverages and pastries that celebrate the rich traditions of coffee culture,
                delivering warmth and comfort in every cup.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoffeeShopWebsite;
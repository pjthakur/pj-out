"use client";

import { useState, useEffect, useRef, createContext } from "react";
import {  Montserrat } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  X,
  Sun,
  Moon,
  Star,
  StarHalf,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Eye,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

type ThemeType = "light" | "dark";

interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  muted: string;
  border: string;
  card: string;
  cardHover: string;
}

interface ThemeConfig {
  light: ThemeColors;
  dark: ThemeColors;
}

const themeConfig: ThemeConfig = {
  light: {
    background: "bg-gray-50",
    foreground: "text-gray-900",
    primary: "bg-rose-600",
    primaryHover: "hover:bg-rose-700",
    secondary: "bg-indigo-600",
    accent: "text-rose-600",
    muted: "text-gray-500",
    border: "border-gray-200",
    card: "bg-white",
    cardHover: "hover:bg-gray-50",
  },
  dark: {
    background: "bg-gray-950",
    foreground: "text-gray-100",
    primary: "bg-rose-500",
    primaryHover: "hover:bg-rose-600",
    secondary: "bg-indigo-500",
    accent: "text-rose-400",
    muted: "text-gray-400",
    border: "border-gray-800",
    card: "bg-gray-900",
    cardHover: "hover:bg-gray-800",
  },
};

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  rating: number;
  category: string;
  franchise: string;
  genre: string[];
  rarity: "Common" | "Uncommon" | "Rare" | "Ultra Rare" | "Limited Edition";
  inStock: boolean;
  releaseDate: string;
  featured?: boolean;
  newArrival?: boolean;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  products: string[];
}

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface FilterOptions {
  franchise: string[];
  genre: string[];
  priceRange: [number, number];
  rarity: string[];
}

interface SortOption {
  label: string;
  value: string;
}

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  colors: themeConfig.light,
});

const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Iron Man Mark XLII Helmet",
    description:
      "Limited edition 1:1 scale Iron Man helmet with light-up eyes and detailed paint job. Perfect for display or cosplay.",
    price: 299.99,
    images: [
      "https://images.unsplash.com/photo-1636840438199-9125cd03c3b0?q=80&w=1000",
      "https://images.unsplash.com/photo-1593085260707-5377ba37f868?q=80&w=1000",
    ],
    rating: 4.8,
    category: "Prop Replicas",
    franchise: "Marvel",
    genre: ["Superhero", "Action"],
    rarity: "Limited Edition",
    inStock: true,
    releaseDate: "2023-05-15",
    featured: true,
  },
  {
    id: "p2",
    name: "Star Wars: The Mandalorian Poster",
    description:
      "Official movie poster from The Mandalorian series, featuring Din Djarin and Grogu. Printed on premium paper with vibrant colors.",
    price: 24.99,
    images: [
      "https://images.unsplash.com/photo-1608346128025-1896b97a6fa7?q=80&w=1000",
      "https://images.unsplash.com/photo-1596727147705-61a532a659bd?q=80&w=1000",
    ],
    rating: 4.5,
    category: "Posters",
    franchise: "Star Wars",
    genre: ["Sci-Fi", "Adventure"],
    rarity: "Common",
    inStock: true,
    releaseDate: "2022-11-30",
    featured: true,
  },
  {
    id: "p3",
    name: "Harry Potter Wand Collection",
    description:
      "Set of 5 character wands from the Harry Potter series, including Harry, Hermione, Ron, Dumbledore, and Voldemort. Each wand comes with a display stand.",
    price: 149.99,
    images: [
      "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?q=80&w=1000",
      "https://images.unsplash.com/photo-1535666669445-e8c15cd2e7d9?q=80&w=1000",
    ],
    rating: 4.7,
    category: "Prop Replicas",
    franchise: "Harry Potter",
    genre: ["Fantasy", "Adventure"],
    rarity: "Uncommon",
    inStock: true,
    releaseDate: "2023-01-10",
    newArrival: true,
  },
  {
    id: "p4",
    name: "Stranger Things Demogorgon Figure",
    description:
      "Highly detailed 12-inch Demogorgon action figure with multiple points of articulation and interchangeable heads.",
    price: 59.99,
    images: [
      "https://images.unsplash.com/photo-1626379616459-b2ce1d9decbc?q=80&w=1000",
      "https://images.unsplash.com/photo-1608346128025-1896b97a6fa7?q=80&w=1000",
    ],
    rating: 4.3,
    category: "Action Figures",
    franchise: "Stranger Things",
    genre: ["Horror", "Sci-Fi"],
    rarity: "Rare",
    inStock: false,
    releaseDate: "2022-08-22",
    featured: true,
  },
  {
    id: "p5",
    name: "Jurassic Park Amber Collection",
    description:
      "Authentic replica of the amber-encased mosquito from Jurassic Park. Comes with a wooden display case and certificate of authenticity.",
    price: 199.99,
    images: [
      "https://images.pexels.com/photos/1369466/pexels-photo-1369466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.unsplash.com/photo-1620336655055-088d06e36bf0?q=80&w=1000",
    ],
    rating: 4.9,
    category: "Prop Replicas",
    franchise: "Jurassic Park",
    genre: ["Sci-Fi", "Adventure"],
    rarity: "Ultra Rare",
    inStock: true,
    releaseDate: "2023-03-05",
    newArrival: true,
  },
  {
    id: "p6",
    name: "The Godfather Movie Poster",
    description:
      "Classic poster from the 1972 film The Godfather. Features Marlon Brando as Don Vito Corleone.",
    price: 34.99,
    images: [
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000",
      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000",
    ],
    rating: 4.6,
    category: "Posters",
    franchise: "The Godfather",
    genre: ["Crime", "Drama"],
    rarity: "Uncommon",
    inStock: true,
    releaseDate: "2022-10-15",
  },
  {
    id: "p7",
    name: "Batman Batarang Replica",
    description:
      "Screen-accurate replica of Batman's Batarang from The Dark Knight trilogy. Made of die-cast metal with a matte black finish.",
    price: 79.99,
    images: [
      "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=1000",
      "https://images.unsplash.com/photo-1600480505021-e9cfb05527f1?q=80&w=1000",
    ],
    rating: 4.7,
    category: "Prop Replicas",
    franchise: "DC",
    genre: ["Superhero", "Action"],
    rarity: "Rare",
    inStock: true,
    releaseDate: "2023-02-18",
    newArrival: true,
  },
  {
    id: "p8",
    name: "Lord of the Rings: One Ring",
    description:
      "Replica of the One Ring from The Lord of the Rings. Made of gold-plated tungsten with Elvish inscription.",
    price: 129.99,
    images: [
      "https://images.unsplash.com/photo-1610296669228-602fa827fc1f?q=80&w=1000",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000",
    ],
    rating: 4.9,
    category: "Prop Replicas",
    franchise: "Lord of the Rings",
    genre: ["Fantasy", "Adventure"],
    rarity: "Limited Edition",
    inStock: true,
    releaseDate: "2022-12-25",
    featured: true,
  },
];

const mockCollections: Collection[] = [
  {
    id: "c1",
    name: "Marvel Vault",
    description: "Exclusive collectibles from the Marvel Cinematic Universe",
    image:
      "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=1000",
    products: ["p1", "p4"],
  },
  {
    id: "c2",
    name: "Sci-Fi Legends",
    description: "Iconic items from the greatest sci-fi franchises",
    image:
      "https://images.unsplash.com/photo-1608346128025-1896b97a6fa7?q=80&w=1000",
    products: ["p2", "p5"],
  },
  {
    id: "c3",
    name: "Oscar Winners",
    description: "Collectibles from Academy Award-winning films",
    image:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1000",
    products: ["p6", "p8"],
  },
];

const mockBanners: Banner[] = [
  {
    id: "b1",
    title: "Marvel Cinematic Universe Collection",
    subtitle: "Exclusive collectibles from your favorite superhero films",
    image:
      "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=1000",
    link: "/collections/marvel",
  },
  {
    id: "b2",
    title: "Star Wars: The Mandalorian",
    subtitle: "This is the way. New items from the hit series",
    image:
      "https://images.unsplash.com/photo-1608346128025-1896b97a6fa7?q=80&w=1000",
    link: "/collections/star-wars",
  },
  {
    id: "b3",
    title: "Limited Edition Collectibles",
    subtitle: "One-of-a-kind items for the serious collector",
    image:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1000",
    link: "/collections/limited-edition",
  },
];

const sortOptions: SortOption[] = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
  { label: "Rating", value: "rating" },
];

export default function Home() {
  const [theme, setTheme] = useState<ThemeType>("light");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeType;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }

    const bannerInterval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % mockBanners.length);
    }, 5000);

    return () => clearInterval(bannerInterval);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);

    if (isProductModalOpen || isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [theme, isProductModalOpen, isCartOpen]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const colors = themeConfig[theme];

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { product, quantity }];
      }
    });

    showToastMessage(`Added ${product.name} to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
    showToastMessage("Item removed from cart");
  };

  const updateCartItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const sortedProducts = [...mockProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "newest":
        return (
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        );
      case "rating":
        return b.rating - a.rating;
      case "featured":
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  const featuredProducts = mockProducts.filter((product) => product.featured);

  const newArrivals = mockProducts.filter((product) => product.newArrival);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const openProductModal = (product: Product) => {
    setActiveProduct(product);
    setIsProductModalOpen(true);
    setActiveImageIndex(0);
  };

  const uniqueFranchises = Array.from(
    new Set(mockProducts.map((p) => p.franchise))
  );
  const uniqueGenres = Array.from(
    new Set(mockProducts.flatMap((p) => p.genre))
  );
  const uniqueRarities = Array.from(new Set(mockProducts.map((p) => p.rarity)));

  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half-star"
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-star-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return <div className="flex">{stars}</div>;
  };

  const renderRarityBadge = (rarity: string) => {
    let bgColor = "";

    switch (rarity) {
      case "Common":
        bgColor = "bg-gray-500";
        break;
      case "Uncommon":
        bgColor = "bg-green-500";
        break;
      case "Rare":
        bgColor = "bg-blue-500";
        break;
      case "Ultra Rare":
        bgColor = "bg-purple-500";
        break;
      case "Limited Edition":
        bgColor = "bg-amber-500";
        break;
      default:
        bgColor = "bg-gray-500";
    }

    return (
      <span
        className={`${bgColor} text-white text-xs font-semibold px-2 py-1 rounded-full`}
      >
        {rarity}
      </span>
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      <div
        className={`${montserrat.variable} font-sans min-h-screen ${colors.background} ${colors.foreground} transition-colors duration-300`}
      >
        <header
          ref={headerRef}
          className={`sticky top-0 z-40 ${colors.card} ${colors.border} border-b shadow-sm`}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h1
                  className={`text-2xl font-bold ${colors.accent} font-heading`}
                >
                  CineCollect
                </h1>
              </div>

              <nav className="hidden md:flex items-center space-x-8">
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`font-medium hover:${colors.accent} transition-colors`}
                >
                  Home
                </a>
                <a
                  href="#collections"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector("#collections")
                      ?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className={`font-medium hover:${colors.accent} transition-colors`}
                >
                  Collections
                </a>
                <a
                  href="#new-arrivals"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector("#new-arrivals")
                      ?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className={`font-medium hover:${colors.accent} transition-colors`}
                >
                  New Arrivals
                </a>
                <a
                  href="#all-products"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector("#all-products")
                      ?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className={`font-medium hover:${colors.accent} transition-colors`}
                >
                  All Products
                </a>
              </nav>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full transition-colors cursor-pointer"
                  aria-label="Toggle theme"
                >
                  {theme === "light" ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="p-2 rounded-full transition-colors relative cursor-pointer"
                  aria-label="Open cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span
                      className={`absolute -top-1 -right-1 ${colors.primary} text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center`}
                    >
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence>
          {isCartOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-opacity-50 backdrop-blur-sm"
              onClick={() => setIsCartOpen(false)}
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className={`fixed right-0 top-0 h-full w-full sm:w-96 ${colors.card} shadow-xl`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 flex justify-between items-center border-b">
                  <h2 className="text-xl font-bold">Your Cart</h2>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 flex flex-col h-[calc(100%-8rem)]">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                      <p className="text-lg font-medium mb-2">
                        Your cart is empty
                      </p>
                      <p className={`${colors.muted} text-center mb-6`}>
                        Looks like you haven't added any items to your cart yet.
                      </p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className={`${colors.primary} ${colors.primaryHover} text-white px-6 py-2 rounded-full transition-colors cursor-pointer`}
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full">
                      <div className="flex-1 overflow-y-auto space-y-4">
                        {cart.map((item) => (
                          <div
                            key={item.product.id}
                            className={`flex items-center space-x-4 p-3 rounded-lg ${colors.cardHover} transition-colors`}
                          >
                            <img
                              src={item.product.images[0] || "/placeholder.svg"}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium">
                                {item.product.name}
                              </h3>
                              <p className={`${colors.muted} text-sm`}>
                                ${item.product.price.toFixed(2)}
                              </p>
                              <div className="flex items-center mt-1">
                                <button
                                  onClick={() =>
                                    updateCartItemQuantity(
                                      item.product.id,
                                      item.quantity - 1
                                    )
                                  }
                                  className={`${colors.border} border rounded-full p-1 cursor-pointer`}
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="mx-2">{item.quantity}</span>
                                <button
                                  onClick={() =>
                                    updateCartItemQuantity(
                                      item.product.id,
                                      item.quantity + 1
                                    )
                                  }
                                  className={`${colors.border} border rounded-full p-1 cursor-pointer`}
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                $
                                {(item.product.price * item.quantity).toFixed(
                                  2
                                )}
                              </p>
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-red-500 hover:text-red-700 transition-colors mt-1 cursor-pointer"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className={`mt-4 pt-4 border-t ${colors.border}`}>
                        <div className="flex justify-between mb-2">
                          <span>Subtotal</span>
                          <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-4">
                          <span>Shipping</span>
                          <span>Calculated at checkout</span>
                        </div>
                        <button
                          onClick={() => {
                            setCart([]);
                            setIsCartOpen(false);
                            showToastMessage(
                              "Order placed successfully! Thank you for shopping with us."
                            );
                          }}
                          className={`${colors.primary} ${colors.primaryHover} text-white w-full py-3 rounded-full font-medium transition-colors cursor-pointer`}
                        >
                          Checkout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isProductModalOpen && activeProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-opacity-50 backdrop-blur-sm overflow-y-auto"
              onClick={() => setIsProductModalOpen(false)}
            >
              <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className={`${colors.card} rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative">
                    <button
                      onClick={() => setIsProductModalOpen(false)}
                      className="absolute top-4 right-4 z-50 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors cursor-pointer"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-6">
                        <div className="aspect-square overflow-hidden rounded-lg mb-4">
                          <img
                            src={
                              activeProduct.images[activeImageIndex] ||
                              "/placeholder.svg"
                            }
                            alt={activeProduct.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex space-x-2 overflow-x-auto pb-2">
                          {activeProduct.images.map((image, index) => (
                            <div
                              key={index}
                              onClick={() => setActiveImageIndex(index)}
                              className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 cursor-pointer ${
                                colors.border
                              } border-2 ${
                                index === activeImageIndex
                                  ? "border-rose-500"
                                  : ""
                              }`}
                            >
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`${activeProduct.name} - Image ${
                                  index + 1
                                }`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex flex-wrap items-center justify-between mb-2">
                          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                            {renderRarityBadge(activeProduct.rarity)}
                            {activeProduct.newArrival && (
                              <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                New Arrival
                              </span>
                            )}
                          </div>

                          <div className="flex items-center overflow-hidden sm:pr-8">
                            {renderRating(activeProduct.rating)}
                            <span className="ml-1 text-sm">
                              ({activeProduct.rating.toFixed(1)})
                            </span>
                          </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-2">
                          {activeProduct.name}
                        </h2>

                        <p className="text-3xl font-bold mb-4">
                          ${activeProduct.price.toFixed(2)}
                        </p>

                        <div className="mb-6">
                          <h3 className="font-semibold mb-2">Description</h3>
                          <p className={`${colors.muted} mb-4`}>
                            {activeProduct.description}
                          </p>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-semibold">
                                Franchise
                              </h4>
                              <p>{activeProduct.franchise}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold">
                                Category
                              </h4>
                              <p>{activeProduct.category}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold">Genre</h4>
                              <p>{activeProduct.genre.join(", ")}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold">
                                Release Date
                              </h4>
                              <p>
                                {new Date(
                                  activeProduct.releaseDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="mb-6">
                            <h4 className="text-sm font-semibold mb-1">
                              Availability
                            </h4>
                            {activeProduct.inStock ? (
                              <span className="text-green-500 font-medium">
                                In Stock
                              </span>
                            ) : (
                              <span className="text-red-500 font-medium">
                                Out of Stock
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex space-x-4">
                          <button
                            onClick={() => {
                              addToCart(activeProduct);
                              setIsProductModalOpen(false);
                            }}
                            disabled={!activeProduct.inStock}
                            className={`flex-1 ${
                              activeProduct.inStock
                                ? `${colors.primary} ${colors.primaryHover}`
                                : "bg-gray-400"
                            } text-white py-3 rounded-full font-medium transition-colors cursor-pointer`}
                          >
                            {activeProduct.inStock
                              ? "Add to Cart"
                              : "Out of Stock"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="container mx-auto px-4 py-8">
          <section className="mb-12">
            <div className="relative h-[80vh] rounded-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentBanner}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <img
                    src={mockBanners[currentBanner].image || "/placeholder.svg"}
                    alt={mockBanners[currentBanner].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                    <div className="p-8 md:p-12 max-w-lg">
                      <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 font-heading"
                      >
                        {mockBanners[currentBanner].title}
                      </motion.h2>
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-white text-lg mb-6"
                      >
                        {mockBanners[currentBanner].subtitle}
                      </motion.p>
                      <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        onClick={() => {
                          document
                            .querySelector("#collections")
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                        }}
                        className={`${colors.primary} ${colors.primaryHover} text-white px-6 py-3 rounded-full font-medium transition-colors cursor-pointer`}
                      >
                        Explore Collection
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {mockBanners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBanner(index)}
                    className={`w-2 h-2 rounded-full ${
                      currentBanner === index ? "bg-white" : "bg-white/50"
                    } transition-colors cursor-pointer`}
                    aria-label={`Go to slide ${index + 1}`}
                  ></button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentBanner(
                    (currentBanner - 1 + mockBanners.length) %
                      mockBanners.length
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={() =>
                  setCurrentBanner((currentBanner + 1) % mockBanners.length)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </section>

          <section id="collections" className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold font-heading">
                Curated Collections
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockCollections.map((collection) => (
                <motion.div
                  key={collection.id}
                  whileHover={{ y: -5 }}
                  className={`${colors.card} rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl`}
                >
                  <div className="relative h-48">
                    <img
                      src={collection.image || "/placeholder.svg"}
                      alt={collection.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-white mb-1">
                          {collection.name}
                        </h3>
                        <p className="text-white/80 text-sm">
                          {collection.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold font-heading">
                Featured Products
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -5 }}
                  className={`${colors.card} rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl`}
                >
                  <div
                    className="relative cursor-pointer"
                    onClick={() => openProductModal(product)}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        {product.newArrival && (
                          <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                        {renderRarityBadge(product.rarity)}
                      </div>
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className={`${colors.primary} ${colors.primaryHover} text-white px-4 py-2 rounded-full font-medium transition-colors mr-2 cursor-pointer`}
                          disabled={!product.inStock}
                        >
                          {product.inStock ? "Add to Cart" : "Out of Stock"}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openProductModal(product);
                          }}
                          className="bg-white text-gray-900 p-2 rounded-full transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex">
                          {renderRating(product.rating)}
                        </div>
                        <span
                          className={`${
                            product.inStock ? "text-green-500" : "text-red-500"
                          } text-sm font-medium`}
                        >
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                      <p
                        className={`${colors.muted} text-sm mb-2 line-clamp-2`}
                      >
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section id="new-arrivals" className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold font-heading">
                New Arrivals
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -5 }}
                  className={`${colors.card} rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl`}
                >
                  <div
                    className="relative cursor-pointer"
                    onClick={() => openProductModal(product)}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                          New
                        </span>
                        {renderRarityBadge(product.rarity)}
                      </div>
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className={`${colors.primary} ${colors.primaryHover} text-white px-4 py-2 rounded-full font-medium transition-colors mr-2 cursor-pointer`}
                          disabled={!product.inStock}
                        >
                          {product.inStock ? "Add to Cart" : "Out of Stock"}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openProductModal(product);
                          }}
                          className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex">
                          {renderRating(product.rating)}
                        </div>
                        <span
                          className={`${
                            product.inStock ? "text-green-500" : "text-red-500"
                          } text-sm font-medium`}
                        >
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                      <p
                        className={`${colors.muted} text-sm mb-2 line-clamp-2`}
                      >
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section id="all-products">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h2 className="text-2xl md:text-3xl font-bold font-heading">
                All Products
              </h2>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`appearance-none ${colors.border} border rounded-lg px-4 py-2 pr-10 ${colors.card} cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500 w-full`}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -5 }}
                  className={`${colors.card} rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl`}
                >
                  <div
                    className="relative cursor-pointer"
                    onClick={() => openProductModal(product)}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        {product.newArrival && (
                          <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                        {renderRarityBadge(product.rarity)}
                      </div>
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className={`${colors.primary} ${colors.primaryHover} text-white px-4 py-2 rounded-full font-medium transition-colors mr-2 cursor-pointer`}
                          disabled={!product.inStock}
                        >
                          {product.inStock ? "Add to Cart" : "Out of Stock"}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openProductModal(product);
                          }}
                          className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex">
                          {renderRating(product.rating)}
                        </div>
                        <span
                          className={`${
                            product.inStock ? "text-green-500" : "text-red-500"
                          } text-sm font-medium`}
                        >
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                      <p
                        className={`${colors.muted} text-sm mb-2 line-clamp-2`}
                      >
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </main>

        <footer className={`mt-16 ${colors.card} ${colors.border} border-t`}>
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <h3
                  className={`text-xl font-bold ${colors.accent} mb-2 font-heading`}
                >
                  CineCollect
                </h3>
                <p className={`${colors.muted}`}>
                  Your premier destination for movie collectibles
                </p>
              </div>
              <div className={`${colors.muted} text-center md:text-right`}>
                <p>© 2025 CineCollect. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>

        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 right-4 z-50"
            >
              <div
                className={`${colors.card} shadow-lg rounded-lg px-4 py-3 flex items-center`}
              >
                <div className={`${colors.accent} mr-3`}>
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <p>{toastMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeContext.Provider>
  );
}
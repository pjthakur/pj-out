"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { Montserrat, Orbitron } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Star, Sun, Moon, Plus, Minus, Check, AlertTriangle, Info } from "lucide-react";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

type ThemeType = "light" | "dark";
type ThemeContextType = {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: (typeof themeColors)[ThemeType];
};

const themeColors = {
  light: {
    background: "bg-gray-50",
    text: "text-gray-900",
    primary: "bg-purple-600",
    primaryHover: "hover:bg-purple-700",
    primaryText: "text-white",
    secondary: "bg-cyan-500",
    secondaryHover: "hover:bg-cyan-600",
    secondaryText: "text-white",
    accent: "bg-pink-500",
    accentHover: "hover:bg-pink-600",
    card: "bg-white",
    cardHover: "hover:bg-gray-100",
    border: "border-gray-200",
    input: "bg-white border-gray-300",
    buttonText: "text-white",
    navBackground: "bg-white",
    modalOverlay: "bg-black/50",
    modalContent: "bg-white",
    shadow: "shadow-lg",
    toastSuccess: "bg-green-100 border-green-500 text-green-800",
    toastError: "bg-red-100 border-red-500 text-red-800",
    toastInfo: "bg-blue-100 border-blue-500 text-blue-800",
  },
  dark: {
    background: "bg-gray-900",
    text: "text-gray-100",
    primary: "bg-purple-700",
    primaryHover: "hover:bg-purple-800",
    primaryText: "text-white",
    secondary: "bg-cyan-600",
    secondaryHover: "hover:bg-cyan-700",
    secondaryText: "text-white",
    accent: "bg-pink-600",
    accentHover: "hover:bg-pink-700",
    card: "bg-gray-800",
    cardHover: "hover:bg-gray-700",
    border: "border-gray-700",
    input: "bg-gray-800 border-gray-600",
    buttonText: "text-white",
    navBackground: "bg-gray-800",
    modalOverlay: "bg-black/70",
    modalContent: "bg-gray-800",
    shadow: "shadow-xl shadow-purple-900/20",
    toastSuccess: "bg-green-900 border-green-600 text-green-100",
    toastError: "bg-red-900 border-red-600 text-red-100",
    toastInfo: "bg-blue-900 border-blue-600 text-blue-100",
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

type ToastType = "success" | "error" | "info";
type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ProductCategory = "console" | "accessory" | "game";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: ProductCategory;
  description: string;
  rating: number;
  inStock: boolean;
  featured?: boolean;
  discount?: number;
  releaseDate?: string;
}

interface CartItem extends Product {
  quantity: number;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "PlayStation 5",
    price: 499.99,
    image:
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "console",
    description:
      "Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio.",
    rating: 4.8,
    inStock: true,
    featured: true,
  },
  {
    id: 2,
    name: "Xbox Series X",
    price: 499.99,
    image:
      "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "console",
    description:
      "The fastest, most powerful Xbox ever. Explore rich new worlds with 12 teraflops of raw graphic processing power, DirectX ray tracing, and 4K gaming.",
    rating: 4.7,
    inStock: true,
    featured: true,
  },
  {
    id: 3,
    name: "Nintendo Switch OLED",
    price: 349.99,
    image:
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "console",
    description:
      "Featuring a vibrant 7-inch OLED screen, a wide adjustable stand, a dock with a wired LAN port, 64 GB of internal storage, and enhanced audio.",
    rating: 4.6,
    inStock: true,
    featured: true,
  },
  {
    id: 4,
    name: "DualSense Wireless Controller",
    price: 69.99,
    image:
      "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "accessory",
    description:
      "Discover a deeper, highly immersive gaming experience with the innovative new PS5 controller, featuring haptic feedback and dynamic trigger effects.",
    rating: 4.9,
    inStock: true,
    discount: 10,
  },
  {
    id: 5,
    name: "Xbox Elite Wireless Controller Series 2",
    price: 179.99,
    image:
      "https://images.unsplash.com/photo-1605901309584-818e25960a8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "accessory",
    description:
      "The world's most advanced controller. Adjust the tension of the thumbsticks, shorter hair trigger locks, and wrap-around rubberized grip.",
    rating: 4.7,
    inStock: true,
    discount: 15,
  },
  {
    id: 6,
    name: "Razer BlackShark V2 Pro",
    price: 179.99,
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "accessory",
    description:
      "THX Spatial Audio, TriForce Titanium 50mm Drivers, Detachable Mic, for PC, Mac, PS4, PS5, Switch, Xbox One, Xbox Series X & S.",
    rating: 4.5,
    inStock: true,
  },
  {
    id: 7,
    name: "Cyberpunk 2077",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "game",
    description:
      "An open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.",
    rating: 4.0,
    inStock: true,
    discount: 50,
  },
  {
    id: 8,
    name: "Elden Ring",
    price: 59.99,
    image:
      "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "game",
    description:
      "A fantasy action-RPG adventure set within a world created by Hidetaka Miyazaki and George R. R. Martin.",
    rating: 4.9,
    inStock: true,
  },
  {
    id: 9,
    name: "God of War Ragnarök",
    price: 69.99,
    image:
      "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "game",
    description:
      "Embark on a mythic journey for answers and allies before Ragnarök arrives. Together, Kratos and Atreus venture deep into the Nine Realms.",
    rating: 4.8,
    inStock: true,
    releaseDate: "2022-11-09",
  },
  {
    id: 10,
    name: "Logitech G Pro X Superlight",
    price: 149.99,
    image:
      "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "accessory",
    description:
      "Ultra-lightweight wireless gaming mouse with HERO 25K sensor, less than 63 grams, and up to 70 hours of battery life.",
    rating: 4.7,
    inStock: true,
  },
  {
    id: 12,
    name: "Oculus Quest 2",
    price: 299.99,
    image:
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "console",
    description:
      "Advanced all-in-one virtual reality headset, no PC or console needed. Immerse in entertainment with redesigned controllers and 3D cinematic sound.",
    rating: 4.7,
    inStock: true,
  },
];

export default function GamingEcommerce() {
  const [theme, setTheme] = useState<ThemeType>("dark");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastIdCounter, setToastIdCounter] = useState(0);
  const [isScrollingDisabled, setIsScrollingDisabled] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const addToast = (message: string, type: ToastType = "success") => {
    const id = toastIdCounter;
    setToastIdCounter((prev) => prev + 1);

    setToasts((prev) => {
      const newToasts = [...prev, { id, message, type }];
      return newToasts.slice(-3);
    });

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
    addToast(`Added ${product.name} to cart`);
  };

  const removeFromCart = (productId: number) => {
    const product = cart.find((item) => item.id === productId);
    setCart((prev) => prev.filter((item) => item.id !== productId));
    if (product) {
      addToast(`Removed ${product.name} from cart`, "info");
    }
  };

  const updateCartItemQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const cartTotal = cart.reduce((total, item) => {
    const price = item.discount
      ? item.price * (1 - item.discount / 100)
      : item.price;
    return total + price * item.quantity;
  }, 0);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
    setIsScrollingDisabled(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setIsScrollingDisabled(false);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsScrollingDisabled(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setIsScrollingDisabled(false);
  };

  const openCart = () => {
    setIsCartOpen(true);
    setIsScrollingDisabled(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
    setIsScrollingDisabled(false);
  };

  const featuredProducts = PRODUCTS.filter((product) => product.featured);

  const getProductsByCategory = (category: ProductCategory) => {
    return PRODUCTS.filter((product) => product.category === category);
  };

  const discountedProducts = PRODUCTS.filter((product) => product.discount);

  useEffect(() => {
    if (isScrollingDisabled) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isScrollingDisabled]);

  const themeContextValue = {
    theme,
    toggleTheme,
    colors: themeColors[theme],
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <div
        className={`${montserrat.variable} ${orbitron.variable} font-sans min-h-screen ${themeColors[theme].background} ${themeColors[theme].text} transition-colors duration-300`}
      >
        <nav
          className={`fixed top-0 left-0 right-0 z-50 ${themeColors[theme].navBackground} ${themeColors[theme].border} border-b ${themeColors[theme].shadow}`}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-2xl md:text-3xl font-bold font-orbitron bg-gradient-to-r from-purple-500 to-cyan-400 text-transparent bg-clip-text">
                  Gaming Galaxy
                </h1>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <a
                  onClick={() => scrollToSection("featured")}
                  className="hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Featured
                </a>
                <a
                  onClick={() => scrollToSection("consoles")}
                  className="hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Consoles
                </a>
                <a
                  onClick={() => scrollToSection("accessories")}
                  className="hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Accessories
                </a>
                <a
                  onClick={() => scrollToSection("games")}
                  className="hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Games
                </a>
                <a
                  onClick={() => scrollToSection("deals")}
                  className="hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Deals
                </a>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  className="relative cursor-pointer"
                  onClick={openCart}
                  aria-label="Open cart"
                >
                  <ShoppingCart size={24} />
                  {cartItemCount > 0 && (
                    <span
                      className={`absolute -top-2 -right-2 w-5 h-5 rounded-full ${themeColors[theme].accent} ${themeColors[theme].buttonText} text-xs flex items-center justify-center`}
                    >
                      {cartItemCount}
                    </span>
                  )}
                </button>

                <button
                  className="cursor-pointer"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                >
                  {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 pt-24 pb-16">
          <section className="mb-16">
            <div
              className={`relative rounded-2xl overflow-hidden ${themeColors[theme].shadow}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-cyan-900/80 z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Gaming setup with neon lights"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-orbitron text-white mb-4">
                    Level Up Your <span className="text-cyan-400">Gaming</span>{" "}
                    Experience
                  </h2>
                  <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
                    Discover the latest gaming consoles, accessories, and games.
                    Elevate your gameplay with cutting-edge technology and
                    immersive experiences.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => scrollToSection("featured")}
                      className={`px-8 py-3 rounded-full ${themeColors[theme].primary} ${themeColors[theme].primaryHover} ${themeColors[theme].buttonText} font-medium transition-colors cursor-pointer`}
                    >
                      Shop Now
                    </button>
                    <button
                      onClick={() => scrollToSection("deals")}
                      className={`px-8 py-3 rounded-full bg-transparent hover:bg-white/10 text-white border border-white font-medium transition-colors cursor-pointer`}
                    >
                      View Deals
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <section id="featured" className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold font-orbitron">
                Featured Products
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onViewDetails={() => openProductModal(product)}
                />
              ))}
            </div>
          </section>

          <section id="consoles" className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold font-orbitron mb-8">
              Gaming Consoles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getProductsByCategory("console").map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onViewDetails={() => openProductModal(product)}
                  compact
                />
              ))}
            </div>
          </section>

          <section className="mb-16">
            <div
              className={`relative rounded-2xl overflow-hidden ${themeColors[theme].shadow}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-900/80 to-purple-900/80 z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                alt="Gaming accessories"
                className="w-full h-[300px] object-cover"
              />
              <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-16">
                <div className="max-w-xl">
                  <h2 className="text-2xl md:text-4xl font-bold font-orbitron text-white mb-4">
                    Premium Gaming Accessories
                  </h2>
                  <p className="text-lg text-gray-200 mb-6">
                    Enhance your gaming setup with our premium selection of
                    accessories. From controllers to headsets, we've got
                    everything you need.
                  </p>
                  <button
                    onClick={() => scrollToSection("accessories")}
                    className={`inline-block px-6 py-2 rounded-full ${themeColors[theme].accent} ${themeColors[theme].accentHover} ${themeColors[theme].buttonText} font-medium transition-colors cursor-pointer`}
                  >
                    Shop Accessories
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section id="accessories" className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold font-orbitron mb-8">
              Gaming Accessories
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getProductsByCategory("accessory").map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onViewDetails={() => openProductModal(product)}
                  compact
                />
              ))}
            </div>
          </section>

          <section id="games" className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold font-orbitron mb-8">
              Latest Games
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getProductsByCategory("game").map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onViewDetails={() => openProductModal(product)}
                />
              ))}
            </div>
          </section>

          <section id="deals" className="mb-16">
            <div
              className={`p-6 md:p-8 rounded-2xl ${themeColors[theme].card} ${themeColors[theme].border} border ${themeColors[theme].shadow} mb-8`}
            >
              <h2 className="text-2xl md:text-3xl font-bold font-orbitron mb-4">
                Hot Deals & Discounts
              </h2>
              <p className="text-lg opacity-80 mb-6">
                Limited-time offers on popular gaming products. Don't miss out
                on these incredible savings!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {discountedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    onViewDetails={() => openProductModal(product)}
                    highlight
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="mb-16">
            <div
              className={`p-8 md:p-12 rounded-2xl ${themeColors[theme].card} ${themeColors[theme].border} border ${themeColors[theme].shadow} text-center`}
            >
              <h2 className="text-2xl md:text-3xl font-bold font-orbitron mb-4">
                Join Our Gaming Community
              </h2>
              <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter for exclusive deals, gaming news,
                and early access to new releases.
              </p>

              <form
                className="max-w-md mx-auto flex flex-col sm:flex-row gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const email = (
                    form.elements.namedItem("email") as HTMLInputElement
                  ).value;
                  if (email) {
                    addToast(`Subscribed with ${email}`, "success");
                    form.reset();
                  }
                }}
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  className={`flex-grow px-4 py-3 rounded-full ${themeColors[theme].input} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  required
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  title="Please enter a valid email address"
                />
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-full ${themeColors[theme].primary} ${themeColors[theme].primaryHover} ${themeColors[theme].buttonText} font-medium transition-colors cursor-pointer`}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </section>
        </main>

        <footer
          className={`${themeColors[theme].card} ${themeColors[theme].border} border-t`}
        >
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold font-orbitron mb-4">
                  Gaming Galaxy
                </h3>
                <p className="opacity-80 mb-4">
                  Your one-stop destination for all gaming needs. Quality
                  products, competitive prices, and exceptional service.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors cursor-pointer"
                  >
                    <span className="sr-only">Facebook</span>
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors cursor-pointer"
                  >
                    <span className="sr-only">Instagram</span>
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors cursor-pointer"
                  >
                    <span className="sr-only">Twitter</span>
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Shop</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      onClick={() => scrollToSection("consoles")}
                      className="opacity-80 hover:opacity-100 hover:text-purple-400 transition-colors cursor-pointer"
                    >
                      Consoles
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => scrollToSection("accessories")}
                      className="opacity-80 hover:opacity-100 hover:text-purple-400 transition-colors cursor-pointer"
                    >
                      Accessories
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => scrollToSection("games")}
                      className="opacity-80 hover:opacity-100 hover:text-purple-400 transition-colors cursor-pointer"
                    >
                      Games
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => scrollToSection("deals")}
                      className="opacity-80 hover:opacity-100 hover:text-purple-400 transition-colors cursor-pointer"
                    >
                      Deals
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="opacity-80 hover:opacity-100 hover:text-purple-400 transition-colors cursor-pointer"
                    >
                      New Releases
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Support</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="opacity-80 hover:opacity-100 hover:text-purple-400 transition-colors cursor-pointer"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="opacity-80 hover:opacity-100 hover:text-purple-400 transition-colors cursor-pointer"
                    >
                      FAQs
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="opacity-80 hover:opacity-100 hover:text-purple-400 transition-colors cursor-pointer"
                    >
                      Shipping & Returns
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="opacity-80 hover:opacity-100 hover:text-purple-400 transition-colors cursor-pointer"
                    >
                      Warranty
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="opacity-80 hover:opacity-100 hover:text-purple-400 transition-colors cursor-pointer"
                    >
                      Track Order
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="opacity-80 hover:opacity-100 hover:text-purple-400 transition-colors cursor-pointer"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="opacity-80 hover:opacity-100 hover:text-purple-400 transition-colors cursor-pointer"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="opacity-80 hover:opacity-100 hover:text-purple-400 transition-colors cursor-pointer"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="opacity-80 hover:opacity-100 hover:text-purple-400 transition-colors cursor-pointer"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="opacity-80 hover:opacity-100 hover:text-purple-400 transition-colors cursor-pointer"
                    >
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-700 text-center">
              <p className="opacity-60">
                &copy; {new Date().getFullYear()} Gaming Galaxy. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>

        <AnimatePresence>
          {isCartOpen && (
            <>
              <motion.div
                className={`fixed inset-0 ${themeColors[theme].modalOverlay} z-50`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeCart}
              />

              <motion.div
                className={`fixed top-0 right-0 h-full w-full sm:w-96 ${themeColors[theme].card} ${themeColors[theme].shadow} z-50 overflow-hidden flex flex-col`}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3 }}
              >
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                  <h3 className="text-xl font-bold font-orbitron">Your Cart</h3>
                  <button
                    onClick={closeCart}
                    className={`p-1 rounded-full hover:${themeColors[theme].cardHover} transition-colors cursor-pointer`}
                    aria-label="Close cart"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-grow overflow-y-auto p-4">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <ShoppingCart size={64} className="opacity-20 mb-4" />
                      <p className="text-lg mb-6">Your cart is empty</p>
                      <button
                        onClick={closeCart}
                        className={`px-6 py-2 rounded-full ${themeColors[theme].primary} ${themeColors[theme].primaryHover} ${themeColors[theme].buttonText} font-medium transition-colors cursor-pointer`}
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className={`p-4 rounded-lg ${themeColors[theme].border} border flex gap-4`}
                        >
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-md"
                          />

                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{item.name}</h4>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className={`text-gray-400 hover:text-red-500 transition-colors cursor-pointer`}
                                aria-label="Remove item"
                              >
                                <X size={18} />
                              </button>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              <div
                                className={`flex items-center border ${themeColors[theme].border} rounded-md`}
                              >
                                <button
                                  onClick={() =>
                                    updateCartItemQuantity(
                                      item.id,
                                      item.quantity - 1
                                    )
                                  }
                                  className={`px-2 py-1 hover:${themeColors[theme].cardHover} transition-colors cursor-pointer`}
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="px-2 py-1">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateCartItemQuantity(
                                      item.id,
                                      item.quantity + 1
                                    )
                                  }
                                  className={`px-2 py-1 hover:${themeColors[theme].cardHover} transition-colors cursor-pointer`}
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className={`p-4 border-t ${themeColors[theme].border}`}>
                    <div className="flex justify-between mb-4">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-bold">${cartTotal.toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() => {
                        addToast("Products ordered successfully!", "success");
                        setCart([]);
                        closeCart();
                      }}
                      className={`w-full py-3 rounded-full ${themeColors[theme].primary} ${themeColors[theme].primaryHover} ${themeColors[theme].buttonText} font-medium transition-colors cursor-pointer mb-2`}
                    >
                      Checkout
                    </button>

                    <button
                      onClick={closeCart}
                      className={`w-full py-3 rounded-full bg-transparent hover:${themeColors[theme].cardHover} border ${themeColors[theme].border} font-medium transition-colors cursor-pointer`}
                    >
                      Continue Shopping
                    </button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isLoginModalOpen && (
            <>
              <motion.div
                className={`fixed inset-0 ${themeColors[theme].modalOverlay} backdrop-blur-sm z-50`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeLoginModal}
              />

              <motion.div
                className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md ${themeColors[theme].card} ${themeColors[theme].shadow} rounded-2xl z-50 overflow-hidden`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold font-orbitron">
                      Sign In
                    </h3>
                    <button
                      onClick={closeLoginModal}
                      className="p-1 rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
                      aria-label="Close modal"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <form className="space-y-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-1"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className={`w-full px-4 py-3 rounded-lg ${themeColors[theme].input} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium mb-1"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        className={`w-full px-4 py-3 rounded-lg ${themeColors[theme].input} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        placeholder="••••••••"
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="remember"
                          className="rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <label
                          htmlFor="remember"
                          className="ml-2 text-sm cursor-pointer"
                        >
                          Remember me
                        </label>
                      </div>

                      <a
                        href="#"
                        className="text-sm text-purple-400 hover:text-purple-300 cursor-pointer"
                      >
                        Forgot password?
                      </a>
                    </div>

                    <button
                      type="submit"
                      className={`w-full py-3 rounded-lg ${themeColors[theme].primary} ${themeColors[theme].primaryHover} ${themeColors[theme].buttonText} font-medium transition-colors cursor-pointer`}
                    >
                      Sign In
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm">
                      Don't have an account?{" "}
                      <a
                        href="#"
                        className="text-purple-400 hover:text-purple-300 cursor-pointer"
                      >
                        Sign up
                      </a>
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isProductModalOpen && selectedProduct && (
            <>
              <motion.div
                className={`fixed inset-0 ${themeColors[theme].modalOverlay} backdrop-blur-sm z-50`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeProductModal}
              />

              <motion.div
                className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl ${themeColors[theme].card} ${themeColors[theme].shadow} rounded-2xl z-50 overflow-hidden max-h-[90vh] overflow-y-auto`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <button
                    onClick={closeProductModal}
                    className={`absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors cursor-pointer z-10`}
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative">
                      <img
                        src={selectedProduct.image || "/placeholder.svg"}
                        alt={selectedProduct.name}
                        className="w-full h-[300px] md:h-[400px] object-cover"
                      />
                      {selectedProduct.discount && (
                        <div
                          className={`absolute top-4 left-4 ${themeColors[theme].accent} ${themeColors[theme].buttonText} px-3 py-1 rounded-full text-sm font-medium`}
                        >
                          {selectedProduct.discount}% OFF
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-2">
                        {selectedProduct.name}
                      </h3>

                      <div className="flex items-center mb-4">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={18}
                              className={
                                i < Math.floor(selectedProduct.rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-400"
                              }
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm">
                          {selectedProduct.rating.toFixed(1)}
                        </span>
                      </div>

                      <div className="mb-6">
                        {selectedProduct.discount ? (
                          <div className="flex items-center">
                            <span className="line-through text-lg opacity-60 mr-2">
                              ${selectedProduct.price.toFixed(2)}
                            </span>
                            <span className="text-2xl font-bold">
                              $
                              {(
                                selectedProduct.price *
                                (1 - selectedProduct.discount / 100)
                              ).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-2xl font-bold">
                            ${selectedProduct.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <p className="mb-6 opacity-80">
                        {selectedProduct.description}
                      </p>

                      <div className="mb-6">
                        <div className="flex items-center mb-2">
                          <span
                            className={`w-3 h-3 rounded-full ${
                              selectedProduct.inStock
                                ? "bg-green-500"
                                : "bg-red-500"
                            } mr-2`}
                          ></span>
                          <span>
                            {selectedProduct.inStock
                              ? "In Stock"
                              : "Out of Stock"}
                          </span>
                        </div>

                        {selectedProduct.releaseDate && (
                          <div className="text-sm opacity-70">
                            Release Date: {selectedProduct.releaseDate}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => {
                            addToCart(selectedProduct);
                            closeProductModal();
                          }}
                          className={`flex-1 py-3 rounded-lg ${themeColors[theme].primary} ${themeColors[theme].primaryHover} ${themeColors[theme].buttonText} font-medium transition-colors cursor-pointer`}
                          disabled={!selectedProduct.inStock}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-xs px-4">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                className={`px-4 py-3 rounded-lg shadow-lg ${
                  toast.type === "success"
                    ? "bg-green-500"
                    : toast.type === "error"
                    ? "bg-red-500"
                    : "bg-blue-500"
                } text-white w-full`}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              >
                <div className="flex items-center space-x-2 w-full">
                  <div className="flex-shrink-0">
                    {toast.type === "success" && (
                      <Check size={18} />
                    )}
                    {toast.type === "error" && (
                      <AlertTriangle size={18} />
                    )}
                    {toast.type === "info" && (
                      <Info size={18} />
                    )}
                  </div>
                  <p className="text-sm truncate overflow-hidden">{toast.message}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: () => void;
  compact?: boolean;
  highlight?: boolean;
}

function ProductCard({
  product,
  onAddToCart,
  onViewDetails,
  compact = false,
  highlight = false,
}: ProductCardProps) {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("ProductCard must be used within a ThemeProvider");
  }

  const { colors } = themeContext;

  return (
    <motion.div
      className={`rounded-xl overflow-hidden ${colors.card} ${
        colors.border
      } border ${
        highlight
          ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-900"
          : ""
      } ${colors.shadow} transition-all duration-300 h-full flex flex-col`}
      whileHover={{
        y: -5,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="relative">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className={`w-full ${compact ? "h-48" : "h-64"} object-cover`}
        />

        {product.discount && (
          <div
            className={`absolute top-3 left-3 ${colors.accent} ${colors.buttonText} px-3 py-1 rounded-full text-sm font-medium`}
          >
            {product.discount}% OFF
          </div>
        )}

        <button
          onClick={onViewDetails}
          className="absolute inset-0 w-full h-full bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer"
          aria-label="View details"
        >
          <span className="px-4 py-2 bg-white/90 text-black rounded-full font-medium">
            View Details
          </span>
        </button>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <h3 className={`font-bold ${compact ? "text-lg" : "text-xl"} mb-2`}>
          {product.name}
        </h3>

        {!compact && (
          <div className="flex items-center mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-400"
                  }
                />
              ))}
            </div>
            <span className="ml-2 text-sm">{product.rating.toFixed(1)}</span>
          </div>
        )}

        {!compact && (
          <p className="text-sm opacity-70 mb-4 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              {product.discount ? (
                <div className="flex flex-col">
                  <span className="line-through text-sm opacity-60">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="font-bold text-lg">
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="font-bold text-lg">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex items-center">
              <span
                className={`w-2 h-2 rounded-full ${
                  product.inStock ? "bg-green-500" : "bg-red-500"
                } mr-1`}
              ></span>
              <span className="text-xs opacity-70">
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className={`w-full py-2 rounded-lg ${colors.primary} ${
              product.inStock
                ? colors.primaryHover
                : "opacity-50 cursor-not-allowed"
            } ${
              colors.buttonText
            } font-medium transition-colors cursor-pointer`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

function Modal({ title, children, onClose }: ModalProps) {
  const { colors } = useTheme();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${colors.modalOverlay}`}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`w-full max-w-md max-h-[90vh] rounded-xl ${colors.modalContent} ${colors.shadow} overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-70px)]">{children}</div>
      </motion.div>
    </motion.div>
  );
}

interface ToastProps {
  toast: Toast;
}

function Toast({ toast }: ToastProps) {
  const { colors } = useTheme();

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return colors.toastSuccess;
      case "error":
        return colors.toastError;
      case "info":
        return colors.toastInfo;
      default:
        return colors.toastInfo;
    }
  };

  const getToastIcon = () => {
    switch (toast.type) {
      case "success":
        return <Check size={18} />;
      case "error":
        return <AlertTriangle size={18} />;
      case "info":
        return <Info size={18} />;
      default:
        return <Info size={18} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${getToastStyles()} border-l-4 rounded-lg p-3 ${colors.shadow} w-full`}
    >
      <div className="flex items-center space-x-2 w-full">
        <div className="flex-shrink-0">
          {getToastIcon()}
        </div>
        <p className="text-sm truncate overflow-hidden">{toast.message}</p>
      </div>
    </motion.div>
  );
}
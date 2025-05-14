"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShoppingCart,
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Filter,
  Search,
  Check,
} from "lucide-react";
import { Bangers, Bubblegum_Sans } from "next/font/google";

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
});

const bubblegum = Bubblegum_Sans({
  weight: "400",
  subsets: ["latin"],
});

type ThemeType = "light" | "dark";
type ThemeColors = {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  card: string;
  cardHover: string;
  border: string;
};

const themeColors: Record<ThemeType, ThemeColors> = {
  light: {
    background: "bg-gradient-to-b from-purple-50 to-blue-50",
    foreground: "text-slate-800",
    primary: "bg-purple-600 text-white hover:bg-purple-700",
    secondary: "bg-amber-500 text-white hover:bg-amber-600",
    accent: "text-pink-600",
    muted: "text-slate-500",
    card: "bg-white",
    cardHover: "hover:shadow-xl hover:scale-[1.02]",
    border: "border-slate-200",
  },
  dark: {
    background: "bg-gradient-to-b from-slate-900 to-purple-950",
    foreground: "text-slate-100",
    primary: "bg-purple-700 text-white hover:bg-purple-600",
    secondary: "bg-amber-600 text-white hover:bg-amber-500",
    accent: "text-pink-400",
    muted: "text-slate-400",
    card: "bg-slate-800",
    cardHover: "hover:shadow-xl hover:shadow-purple-900/20 hover:scale-[1.02]",
    border: "border-slate-700",
  },
};

type AgeGroup = "0-2" | "3-5" | "6-8" | "9-12" | "12+";
type Category = "Educational" | "Action" | "Puzzles" | "Creative" | "Outdoor";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  ageGroup: AgeGroup;
  category: Category;
  rating: number;
  reviews: number;
  inStock: boolean;
  featured: boolean;
  safetyFeatures: string[];
  new: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface FilterState {
  ageGroups: AgeGroup[];
  categories: Category[];
  priceRange: [number, number];
  searchQuery: string;
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wooden Building Blocks",
    description:
      "Eco-friendly wooden blocks for creative play. These premium blocks are made from sustainable wood sources and finished with non-toxic paints, making them safe for children of all ages.",
    price: 34.99,
    images: [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560859251-d563a49c5e4a?q=80&w=500&auto=format&fit=crop",
    ],
    ageGroup: "3-5",
    category: "Educational",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    featured: true,
    safetyFeatures: ["Non-toxic paint", "Smooth edges", "Sustainably sourced"],
    new: false,
  },
  {
    id: "2",
    name: "Interactive Talking Teddy",
    description:
      "A cuddly companion that responds to your child's voice. This premium teddy uses advanced voice recognition technology to create a personalized experience while maintaining the highest safety standards.",
    price: 49.99,
    discountPrice: 39.99,
    images: [
      "https://images.unsplash.com/photo-1562040506-a9b32cb51b94?q=80&w=500&auto=format&fit=crop",
      "https://images.pexels.com/photos/869517/pexels-photo-869517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    ageGroup: "0-2",
    category: "Action",
    rating: 4.5,
    reviews: 89,
    inStock: true,
    featured: false,
    safetyFeatures: [
      "Machine washable",
      "No small parts",
      "Hypoallergenic materials",
    ],
    new: true,
  },
  {
    id: "3",
    name: "Science Lab Kit",
    description:
      "Explore the wonders of science with this comprehensive lab kit. Designed by educators, this kit introduces fundamental scientific concepts through safe, engaging experiments.",
    price: 59.99,
    images: [
      "https://images.pexels.com/photos/8471835/pexels-photo-8471835.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/8923574/pexels-photo-8923574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    ageGroup: "9-12",
    category: "Educational",
    rating: 4.9,
    reviews: 56,
    inStock: true,
    featured: true,
    safetyFeatures: [
      "Child-safe chemicals",
      "Detailed instructions",
      "Protective gear included",
    ],
    new: false,
  },
  {
    id: "4",
    name: "Dinosaur Puzzle Set",
    description:
      "A collection of wooden puzzles featuring different dinosaur species. Each puzzle is crafted with precision to ensure a perfect fit and durability through years of play.",
    price: 24.99,
    images: [
      "https://images.pexels.com/photos/7605993/pexels-photo-7605993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/3852577/pexels-photo-3852577.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    ageGroup: "6-8",
    category: "Puzzles",
    rating: 4.6,
    reviews: 78,
    inStock: false,
    featured: false,
    safetyFeatures: [
      "Rounded corners",
      "Non-toxic materials",
      "Choking hazard tested",
    ],
    new: false,
  },
  {
    id: "5",
    name: "Art Studio Easel",
    description:
      "A double-sided easel with chalkboard, whiteboard, and paper roll. This premium art station is designed to grow with your child, encouraging artistic expression from toddler to teen years.",
    price: 79.99,
    discountPrice: 69.99,
    images: [
      "https://images.pexels.com/photos/7869446/pexels-photo-7869446.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/6941096/pexels-photo-6941096.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    ageGroup: "3-5",
    category: "Creative",
    rating: 4.7,
    reviews: 42,
    inStock: true,
    featured: true,
    safetyFeatures: [
      "Stable base",
      "Washable surfaces",
      "Storage for supplies",
    ],
    new: true,
  },
  {
    id: "6",
    name: "Outdoor Adventure Set",
    description:
      "Explore the great outdoors with this complete adventure kit. Includes a compass, magnifying glass, binoculars, and field guide to inspire curiosity about nature.",
    price: 44.99,
    images: [
      "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=500&auto=format&fit=crop",
    ],
    ageGroup: "6-8",
    category: "Outdoor",
    rating: 4.4,
    reviews: 35,
    inStock: true,
    featured: false,
    safetyFeatures: [
      "Shatterproof lenses",
      "Neck straps included",
      "Water-resistant case",
    ],
    new: false,
  },
  {
    id: "7",
    name: "Musical Xylophone",
    description:
      "A colorful xylophone that produces perfect pitch tones. Crafted by musical instrument experts to introduce children to music through play.",
    price: 29.99,
    images: [
      "https://images.pexels.com/photos/6743155/pexels-photo-6743155.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/6274908/pexels-photo-6274908.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    ageGroup: "0-2",
    category: "Educational",
    rating: 4.3,
    reviews: 67,
    inStock: true,
    featured: false,
    safetyFeatures: [
      "Rounded mallets",
      "Non-toxic finishes",
      "Durable construction",
    ],
    new: false,
  },
  {
    id: "8",
    name: "Robot Building Kit",
    description:
      "Build and program your own robot with this comprehensive STEM kit. Designed by engineers to introduce coding concepts through hands-on building.",
    price: 89.99,
    images: [
      "https://images.pexels.com/photos/8294803/pexels-photo-8294803.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.unsplash.com/photo-1535378620166-273708d44e4c?q=80&w=500&auto=format&fit=crop",
    ],
    ageGroup: "9-12",
    category: "Educational",
    rating: 4.9,
    reviews: 29,
    inStock: true,
    featured: true,
    safetyFeatures: [
      "Age-appropriate components",
      "UL certified electronics",
      "Detailed instructions",
    ],
    new: true,
  },
];

export default function ToyStore() {
  const [theme, setTheme] = useState<ThemeType>("light");
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const featuredProducts = products.filter((product) => product.featured);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const productSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prev) =>
        prev === featuredProducts.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    if (selectedProduct || isCartOpen || isWishlistOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProduct, isCartOpen, isWishlistOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
    setToastMessage(`${product.name} added to cart!`);
  };

  const addToCartFromWishlist = (product: Product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
    
    setWishlist(prev => prev.filter(id => id !== product.id));
    
    setToastMessage(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        setToastMessage("Removed from wishlist");
        return prev.filter((id) => id !== productId);
      } else {
        setToastMessage("Added to wishlist");
        return [...prev, productId];
      }
    });
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsWishlistOpen(false);
  };

  const validateEmail = (emailToValidate: string) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(emailToValidate);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError(null);
    }
  };

  const handleSubscribe = () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError(null);
      setToastMessage("Subscribed successfully!");
      setEmail("");
    }
  };

  const handleCheckout = () => {
    setCart([]);
    setToastMessage("Order placed successfully!");
    closeModal();
  };

  const handleScrollToProducts = () => {
    productSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  const currentFeatured = featuredProducts[currentFeaturedIndex];

  const t = themeColors[theme];

  return (
    <div
      className={`min-h-screen ${t.background} ${t.foreground} transition-colors duration-300`}
    >
      <header className={`sticky top-0 z-10 ${t.card} shadow-md`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1
              className={`text-3xl md:text-4xl ${t.accent} ${bangers.className}`}
            >
              ToyWonderland
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                theme === "light" ? "hover:bg-slate-100" : "hover:bg-slate-700"
              } transition-colors cursor-pointer`}
              aria-label={`Switch to ${
                theme === "light" ? "dark" : "light"
              } mode`}
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button
              onClick={() => setIsWishlistOpen(true)}
              className={`p-2 rounded-full ${
                theme === "light" ? "hover:bg-slate-100" : "hover:bg-slate-700"
              } transition-colors cursor-pointer relative`}
              aria-label="Open wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span
                  className={`absolute -top-1 -right-1 w-5 h-5 rounded-full ${t.secondary} text-xs flex items-center justify-center`}
                >
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className={`p-2 rounded-full ${
                theme === "light" ? "hover:bg-slate-100" : "hover:bg-slate-700"
              } transition-colors cursor-pointer relative`}
              aria-label="Open cart"
            >
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span
                  className={`absolute -top-1 -right-1 w-5 h-5 rounded-full ${t.secondary} text-xs flex items-center justify-center`}
                >
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4">
        <section className="mb-12">
          <div className={`rounded-2xl overflow-hidden ${t.card} shadow-lg`}>
            <div className="relative aspect-[16/12] sm:aspect-[16/9] md:aspect-[21/7] max-h-[60vh] md:max-h-[85vh]">
              <img
                src="https://images.pexels.com/photos/7174515/pexels-photo-7174515.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Happy children playing with toys"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-transparent flex items-center">
                <div className="p-4 md:p-12 max-w-xl">
                  <h2
                    className={`text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4 ${bubblegum.className}`}
                  >
                    Premium Toys for Curious Minds
                  </h2>
                  <p className="text-white text-sm sm:text-base md:text-lg mb-4 md:mb-6">
                    Safe, educational, and incredibly fun toys that inspire
                    creativity and growth.
                  </p>
                  <button
                    onClick={handleScrollToProducts}
                    className={`px-4 py-2 md:px-6 md:py-3 rounded-full text-base md:text-lg font-semibold ${t.secondary} transition-transform hover:scale-105 cursor-pointer`}
                  >
                    Explore Collection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {currentFeatured && (
          <section className="mb-12">
            <h2
              className={`text-2xl md:text-3xl font-bold mb-6 ${bubblegum.className}`}
            >
              Toys of the Week
            </h2>
            <div
              className={`rounded-xl overflow-hidden ${t.card} shadow-lg ${t.border} border`}
            >
              <div className="flex flex-col md:grid md:grid-cols-2 h-auto md:h-[70vh]">
                <div className="relative h-[40vh] md:h-full overflow-hidden">
                  <img
                    src={currentFeatured.images[0] || "/placeholder.svg"}
                    alt={currentFeatured.name}
                    className="w-full h-full object-cover object-center"
                  />
                  {currentFeatured.discountPrice && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      SALE
                    </div>
                  )}
                  {currentFeatured.new && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      NEW
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <button
                      onClick={() =>
                        setCurrentFeaturedIndex((prev) =>
                          prev === 0 ? featuredProducts.length - 1 : prev - 1
                        )
                      }
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${
                        theme === "light"
                          ? "bg-white/80 hover:bg-white"
                          : "bg-slate-700/80 hover:bg-slate-600"
                      } flex items-center justify-center transition-colors cursor-pointer`}
                      aria-label="Previous featured toy"
                    >
                      <ChevronLeft
                        size={16}
                        className={`${
                          theme === "light"
                            ? "text-slate-800"
                            : "text-slate-100"
                        }`}
                      />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentFeaturedIndex((prev) =>
                          prev === featuredProducts.length - 1 ? 0 : prev + 1
                        )
                      }
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${
                        theme === "light"
                          ? "bg-white/80 hover:bg-white"
                          : "bg-slate-700/80 hover:bg-slate-600"
                      } flex items-center justify-center transition-colors cursor-pointer`}
                      aria-label="Next featured toy"
                    >
                      <ChevronRight
                        size={16}
                        className={`${
                          theme === "light"
                            ? "text-slate-800"
                            : "text-slate-100"
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <div className="p-4 md:p-6 flex flex-col overflow-y-auto max-h-[50vh] md:max-h-none">
                  <div className="mb-1 flex flex-wrap gap-2">
                    <span
                      className={`text-xs md:text-sm px-2 py-1 rounded-full ${t.border} border ${t.muted}`}
                    >
                      {currentFeatured.category}
                    </span>
                    <span
                      className={`text-xs md:text-sm px-2 py-1 rounded-full ${t.border} border ${t.muted}`}
                    >
                      Ages {currentFeatured.ageGroup}
                    </span>
                  </div>
                  <h3
                    className={`text-xl font-bold mb-1 ${bubblegum.className}`}
                  >
                    {currentFeatured.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < Math.floor(currentFeatured.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className={`ml-2 text-xs ${t.muted}`}>
                      {currentFeatured.rating} ({currentFeatured.reviews}{" "}
                      reviews)
                    </span>
                  </div>
                  <p
                    className={`mb-3 text-sm ${t.muted} line-clamp-4 md:line-clamp-6`}
                  >
                    {currentFeatured.description}
                  </p>
                  <div className="mt-auto">
                    <div className="flex items-center mb-2">
                      {currentFeatured.discountPrice ? (
                        <>
                          <span className="text-xl md:text-2xl font-bold">
                            ${currentFeatured.discountPrice.toFixed(2)}
                          </span>
                          <span
                            className={`ml-2 text-base md:text-lg line-through ${t.muted}`}
                          >
                            ${currentFeatured.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-xl md:text-2xl font-bold">
                          ${currentFeatured.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!currentFeatured.inStock && (
                        <span className="text-red-500 font-semibold text-sm md:text-base self-center">
                          SOLD OUT
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (currentFeatured.inStock) {
                            addToCart(currentFeatured);
                          }
                        }}
                        disabled={!currentFeatured.inStock}
                        className={`flex-1 py-2 px-2 md:px-3 rounded-lg font-medium md:font-semibold text-sm md:text-base flex items-center justify-center gap-1 md:gap-2 cursor-pointer ${
                          currentFeatured.inStock
                            ? t.primary
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <ShoppingCart size={16} />
                        {currentFeatured.inStock ? "Add to Cart" : "Out of Stock"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(currentFeatured.id);
                        }}
                        className={`p-2 rounded-lg ${t.border} border ${
                          theme === "light"
                            ? "hover:bg-slate-100"
                            : "hover:bg-slate-700"
                        } transition-colors cursor-pointer`}
                        aria-label={
                          wishlist.includes(currentFeatured.id)
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >
                        <Heart
                          size={16}
                          className={`
                            ${
                              wishlist.includes(currentFeatured.id)
                                ? "fill-red-500 text-red-500"
                                : theme === "light"
                                ? "text-slate-400"
                                : "text-slate-500"
                            }
                          `}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section ref={productSectionRef}>
          <div className="flex justify-between items-center mb-6">
            <h2
              className={`text-2xl md:text-3xl font-bold ${bubblegum.className}`}
            >
              Our Products
            </h2>
          </div>

          {products.length === 0 ? (
            <div
              className={`text-center py-12 ${t.card} rounded-xl ${t.border} border`}
            >
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className={`${t.muted} mb-4`}>
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-xl overflow-hidden ${t.card} ${t.border} border shadow-md ${t.cardHover} transition-all duration-300 cursor-pointer`}
                  onClick={() => openProductModal(product)}
                >
                  <div className="relative aspect-square">
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.discountPrice && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                        SALE
                      </div>
                    )}
                    {product.new && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                        NEW
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                      aria-label={
                        wishlist.includes(product.id)
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                    >
                      <Heart
                        size={16}
                        className={` 
                          ${
                            wishlist.includes(product.id)
                              ? "fill-red-500 text-red-500"
                              : theme === "light"
                              ? "text-slate-400"
                              : "text-slate-500"
                          }
                        `}
                      />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center">
                        <Star
                          size={14}
                          className="fill-amber-400 text-amber-400"
                        />
                        <span className="text-xs ml-1">{product.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        {product.discountPrice ? (
                          <div className="flex items-center">
                            <span className="font-bold">
                              ${product.discountPrice.toFixed(2)}
                            </span>
                            <span
                              className={`ml-2 text-sm line-through ${t.muted}`}
                            >
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!product.inStock && (
                          <span className="text-red-500 font-semibold text-xs">
                            SOLD OUT
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (product.inStock) {
                              addToCart(product);
                            }
                          }}
                          disabled={!product.inStock}
                          className={`p-2 rounded-full cursor-pointer ${
                            product.inStock
                              ? t.primary
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                          aria-label={
                            product.inStock ? "Add to cart" : "Out of stock"
                          }
                        >
                          <ShoppingCart size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className={`mt-16 py-8 ${t.card} ${t.border} border-t`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className={`text-xl font-bold mb-4 ${bangers.className}`}>
                ToyWonderland
              </h3>
              <p className={`${t.muted} mb-4`}>
                Premium toys that inspire creativity, learning, and joy while
                maintaining the highest safety standards.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className={`p-2 rounded-full ${t.border} border ${
                    theme === "light"
                      ? "hover:bg-slate-100"
                      : "hover:bg-slate-700"
                  } transition-colors cursor-pointer`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className={`p-2 rounded-full ${t.border} border ${
                    theme === "light"
                      ? "hover:bg-slate-100"
                      : "hover:bg-slate-700"
                  } transition-colors cursor-pointer`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                    ></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a
                  href="#"
                  className={`p-2 rounded-full ${t.border} border ${
                    theme === "light"
                      ? "hover:bg-slate-100"
                      : "hover:bg-slate-700"
                  } transition-colors cursor-pointer`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className={`${t.muted} mb-4`}>
                Subscribe to our newsletter for new product alerts and exclusive
                offers.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className={`flex-1 px-4 py-2 rounded-l-lg ${t.card} ${
                    t.border
                  } border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    emailError ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  value={email}
                  onChange={handleEmailChange}
                />
                <button
                  onClick={handleSubscribe}
                  className={`px-4 py-2 rounded-r-lg ${t.primary} cursor-pointer`}
                >
                  Subscribe
                </button>
              </div>
              {emailError && (
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
              )}
            </div>
          </div>
          <div
            className={`mt-8 pt-6 ${t.border} border-t text-center ${t.muted}`}
          >
            <p>© 2025 ToyWonderland. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl ${t.card} shadow-xl`}
            >
              <button
                onClick={closeModal}
                className={`absolute top-4 right-4 z-10 p-2 rounded-full ${
                  theme === "light"
                    ? "bg-white/80 hover:bg-white"
                    : "bg-slate-700/80 hover:bg-slate-600"
                } transition-colors cursor-pointer`}
                aria-label="Close modal"
              >
                <X
                  size={20}
                  className={`${
                    theme === "light" ? "text-slate-800" : "text-slate-100"
                  }`}
                />
              </button>

              <div className="grid md:grid-cols-2 max-h-[calc(90vh-4rem)] md:max-h-none">
                <div className="p-6 overflow-y-auto md:overflow-visible">
                  <div className="aspect-square mb-4 rounded-lg overflow-hidden">
                    <img
                      src={selectedProduct.images[0] || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedProduct.images.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden"
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`${selectedProduct.name} view ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-2">
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${t.border} border ${t.muted}`}
                    >
                      {selectedProduct.category}
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${t.border} border ${t.muted} ml-2`}
                    >
                      Ages {selectedProduct.ageGroup}
                    </span>
                  </div>

                  <h2
                    className={`text-2xl font-bold mb-2 ${bubblegum.className}`}
                  >
                    {selectedProduct.name}
                  </h2>

                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.floor(selectedProduct.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className={`ml-2 text-sm ${t.muted}`}>
                      {selectedProduct.rating} ({selectedProduct.reviews}{" "}
                      reviews)
                    </span>
                  </div>

                  <p className={`mb-6 ${t.muted}`}>
                    {selectedProduct.description}
                  </p>

                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Safety Features:</h3>
                    <ul className="space-y-1">
                      {selectedProduct.safetyFeatures.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check size={16} className="text-green-500 mr-2" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center mb-6">
                    {selectedProduct.discountPrice ? (
                      <>
                        <span className="text-3xl font-bold">
                          ${selectedProduct.discountPrice.toFixed(2)}
                        </span>
                        <span
                          className={`ml-2 text-xl line-through ${t.muted}`}
                        >
                          ${selectedProduct.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold">
                        ${selectedProduct.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {!selectedProduct.inStock && (
                      <span className="text-red-500 font-semibold text-base self-center">
                        SOLD OUT
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(selectedProduct);
                        closeModal();
                      }}
                      disabled={!selectedProduct.inStock}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                        selectedProduct.inStock
                          ? t.primary
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <ShoppingCart size={18} />
                      {selectedProduct.inStock ? "Add to Cart" : "Out of Stock"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(selectedProduct.id);
                      }}
                      className={`p-3 rounded-lg ${t.border} border ${
                        theme === "light"
                          ? "hover:bg-slate-100"
                          : "hover:bg-slate-700"
                      } transition-colors cursor-pointer`}
                      aria-label={
                        wishlist.includes(selectedProduct.id)
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                    >
                      <Heart
                        size={18}
                        className={`
                          ${
                            wishlist.includes(selectedProduct.id)
                              ? "fill-red-500 text-red-500"
                              : theme === "light"
                              ? "text-slate-400"
                              : "text-slate-500"
                          }
                        `}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`absolute top-0 right-0 h-full w-full max-w-md ${t.card} shadow-xl`}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className={`text-xl font-bold ${bubblegum.className}`}>
                    Your Cart
                  </h2>
                  <button
                    onClick={closeModal}
                    className={`p-2 rounded-full ${
                      theme === "light"
                        ? "hover:bg-slate-100"
                        : "hover:bg-slate-700"
                    } transition-colors cursor-pointer`}
                    aria-label="Close cart"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart
                        size={48}
                        className="mx-auto mb-4 text-gray-300"
                      />
                      <h3 className="text-xl font-semibold mb-2">
                        Your cart is empty
                      </h3>
                      <p className={`${t.muted} mb-4`}>
                        Add some toys to get started!
                      </p>
                      <button
                        onClick={closeModal}
                        className={`px-4 py-2 rounded-lg ${t.primary} cursor-pointer`}
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div
                          key={item.product.id}
                          className={`flex gap-4 p-4 rounded-lg ${t.border} border`}
                        >
                          <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                            <img
                              src={item.product.images[0] || "/placeholder.svg"}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {item.product.name}
                            </h3>
                            <p className={`text-sm ${t.muted}`}>
                              $
                              {(
                                item.product.discountPrice || item.product.price
                              ).toFixed(2)}{" "}
                              each
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center">
                                <button
                                  onClick={() =>
                                    updateCartQuantity(
                                      item.product.id,
                                      item.quantity - 1
                                    )
                                  }
                                  className={`w-8 h-8 flex items-center justify-center rounded-l-md ${t.border} border cursor-pointer`}
                                >
                                  -
                                </button>
                                <span
                                  className={`w-10 h-8 flex items-center justify-center ${t.border} border-t border-b`}
                                >
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateCartQuantity(
                                      item.product.id,
                                      item.quantity + 1
                                    )
                                  }
                                  className={`w-8 h-8 flex items-center justify-center rounded-r-md ${t.border} border cursor-pointer`}
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                aria-label="Remove from cart"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className={`p-6 ${t.border} border-t`}>
                    <div className="flex justify-between mb-4">
                      <span className="font-semibold">Subtotal:</span>
                      <span className="font-bold">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className={`w-full py-3 rounded-lg font-semibold ${t.primary} cursor-pointer`}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isWishlistOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`absolute top-0 right-0 h-full w-full max-w-md ${t.card} shadow-xl`}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className={`text-xl font-bold ${bubblegum.className}`}>
                    Your Wishlist
                  </h2>
                  <button
                    onClick={closeModal}
                    className={`p-2 rounded-full ${
                      theme === "light"
                        ? "hover:bg-slate-100"
                        : "hover:bg-slate-700"
                    } transition-colors cursor-pointer`}
                    aria-label="Close wishlist"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {wishlist.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart
                        size={48}
                        className="mx-auto mb-4 text-gray-300"
                      />
                      <h3 className="text-xl font-semibold mb-2">
                        Your wishlist is empty
                      </h3>
                      <p className={`${t.muted} mb-4`}>
                        Save your favorite toys to wishlist!
                      </p>
                      <button
                        onClick={closeModal}
                        className={`px-4 py-2 rounded-lg ${t.primary} cursor-pointer`}
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {products
                        .filter((product) => wishlist.includes(product.id))
                        .map((product) => (
                          <div
                            key={product.id}
                            className={`flex gap-4 p-4 rounded-lg ${t.border} border`}
                          >
                            <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={product.images[0] || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{product.name}</h3>
                              <p className={`text-sm ${t.muted}`}>
                                ${(product.discountPrice || product.price).toFixed(2)}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  {!product.inStock && (
                                    <span className="text-red-500 font-semibold text-xs">
                                      SOLD OUT
                                    </span>
                                  )}
                                  <button
                                    onClick={(e) => {
                                      if (product.inStock) {
                                        addToCartFromWishlist(product);
                                      }
                                    }}
                                    disabled={!product.inStock}
                                    className={`px-3 py-1 rounded-md text-sm ${
                                      product.inStock
                                        ? t.primary
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                  >
                                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                                  </button>
                                </div>
                                <button
                                  onClick={() => toggleWishlist(product.id)}
                                  className="text-red-500 hover:text-red-700 cursor-pointer"
                                  aria-label="Remove from wishlist"
                                >
                                  <X size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg ${t.card} ${t.border} border z-50`}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
"use client";

import { useState, useEffect, useRef } from "react";
import { Playfair_Display, Raleway } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Moon,
  Sun,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingBag,
} from "lucide-react";
import type { JSX } from "react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

const theme = {
  light: {
    background: "#f8f5f2",
    foreground: "#2d2d2d",
    primary: "#FF6B6B",
    secondary: "#4ECDC4",
    accent: "#FFD166",
    muted: "#e5e5e5",
    card: "#ffffff",
    border: "#e2e2e2",
  },
  dark: {
    background: "#1a1a1a",
    foreground: "#f8f5f2",
    primary: "#FF6B6B",
    secondary: "#4ECDC4",
    accent: "#FFD166",
    muted: "#2d2d2d",
    card: "#252525",
    border: "#333333",
  },
};

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  rating: number;
  featured: boolean;
  images: string[];
  tags: string[];
};

type CartItem = {
  product: Product;
  quantity: number;
};

type WishlistItem = Product;

type Category = {
  id: string;
  name: string;
  icon: JSX.Element;
};

type Toast = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};

const products: Product[] = [
  {
    id: 1,
    name: "Handcrafted Ceramic Vase",
    price: 49.99,
    category: "Handmade Crafts",
    description:
      "A beautiful handcrafted ceramic vase perfect for any room. Each piece is unique with subtle variations in glaze and form, making it a true artisanal treasure. The neutral tones complement any decor style, from minimalist to bohemian.",
    rating: 4.8,
    featured: true,
    images: [
      "https://images.pexels.com/photos/220987/pexels-photo-220987.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578500351865-d6c3706f46bc?q=80&w=800&auto=format&fit=crop",
    ],
    tags: ["ceramic", "vase", "handmade", "home decor"],
  },
  {
    id: 2,
    name: "Macramé Wall Hanging",
    price: 35.99,
    category: "Wall Art",
    description:
      "Add texture and warmth to your walls with this handmade macramé wall hanging. Crafted from 100% cotton rope with a natural wooden dowel, this bohemian-inspired piece brings organic elegance to any space.",
    rating: 4.5,
    featured: true,
    images: [
      "https://images.pexels.com/photos/2065650/pexels-photo-2065650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618220048045-10a6dbdf83e0?q=80&w=800&auto=format&fit=crop",
    ],
    tags: ["macrame", "wall hanging", "boho", "handmade"],
  },
  {
    id: 3,
    name: "Autumn Wreath",
    price: 42.99,
    category: "Seasonal Decor",
    description:
      "Welcome fall with this gorgeous autumn wreath. Featuring preserved maple leaves, pinecones, and berries on a natural grapevine base, this wreath brings the beauty of the season to your door or interior walls.",
    rating: 4.7,
    featured: true,
    images: [
      "https://images.pexels.com/photos/29859094/pexels-photo-29859094/free-photo-of-elegant-beach-wedding-setup-with-floral-arch.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/6692152/pexels-photo-6692152.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.unsplash.com/photo-1511649475669-e288648b2339?q=80&w=800&auto=format&fit=crop",
    ],
    tags: ["wreath", "autumn", "fall", "seasonal"],
  },
  {
    id: 4,
    name: "Rattan Pendant Light",
    price: 89.99,
    category: "Lighting",
    description:
      "This natural rattan pendant light casts beautiful shadows while providing warm, ambient lighting. The handwoven shade creates a cozy atmosphere perfect for dining areas or living rooms. Each fixture includes adjustable cord length and compatible with standard E26 bulbs.",
    rating: 4.6,
    featured: true,
    images: [
      "https://images.pexels.com/photos/132340/pexels-photo-132340.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?q=80&w=800&auto=format&fit=crop",
    ],
    tags: ["pendant", "light", "rattan", "lighting"],
  },
  {
    id: 5,
    name: "Abstract Canvas Print",
    price: 75.99,
    category: "Wall Art",
    description:
      "Add a touch of modern elegance with this abstract canvas print. The soft neutral palette with gold accents complements any interior design style. Printed on premium canvas and stretched over a solid wood frame, ready to hang.",
    rating: 4.4,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=800&auto=format&fit=crop",
      "https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    tags: ["canvas", "abstract", "wall art", "modern"],
  },
  {
    id: 6,
    name: "Scented Soy Candle Set",
    price: 32.99,
    category: "Handmade Crafts",
    description:
      "This set of three hand-poured soy candles brings delightful seasonal scents to your home. Featuring Warm Vanilla, Cinnamon Apple, and Pine Forest fragrances in reusable glass containers with wooden lids.",
    rating: 4.9,
    featured: false,
    images: [
      "https://images.pexels.com/photos/7309744/pexels-photo-7309744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop",
      "https://images.pexels.com/photos/4992657/pexels-photo-4992657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    tags: ["candles", "soy", "scented", "handmade"],
  },
  {
    id: 7,
    name: "Brass Table Lamp",
    price: 129.99,
    category: "Lighting",
    description:
      "This elegant brass table lamp combines vintage charm with modern design. The adjustable arm and swivel shade provide directional lighting perfect for reading or ambient illumination. Features a marble base for stability and sophistication.",
    rating: 4.7,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop",
    ],
    tags: ["lamp", "brass", "lighting", "table lamp"],
  },
  {
    id: 8,
    name: "Holiday Garland",
    price: 28.99,
    category: "Seasonal Decor",
    description:
      "Drape this lush evergreen garland across mantels, staircases, or doorways for instant holiday cheer. Adorned with pinecones, red berries, and subtle gold accents, this 6-foot garland brings the magic of the season to your home.",
    rating: 4.5,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1606946184955-a8cb11e66336?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1607262807149-dfd4c39320a6?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608755728617-aefab37d2edd?q=80&w=800&auto=format&fit=crop",
    ],
    tags: ["garland", "holiday", "christmas", "seasonal"],
  },
  {
    id: 9,
    name: "Wooden Wall Clock",
    price: 59.99,
    category: "Wall Art",
    description:
      "This minimalist wooden wall clock adds a touch of Scandinavian simplicity to any room. Crafted from sustainable oak with silent movement mechanism, it's both functional and decorative. The clean design features simple line markers and contrasting hands.",
    rating: 4.6,
    featured: true,
    images: [
      "https://images.pexels.com/photos/3257927/pexels-photo-3257927.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.unsplash.com/photo-1507646227500-4d389b0012be?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1488229297570-58520851e868?q=80&w=800&auto=format&fit=crop",
    ],
    tags: ["clock", "wooden", "wall art", "minimalist"],
  },
  {
    id: 10,
    name: "Ceramic Planter Set",
    price: 45.99,
    category: "Handmade Crafts",
    description:
      "This set of three geometric ceramic planters in complementary sizes is perfect for displaying your favorite succulents or small houseplants. Each planter features a drainage hole and bamboo saucer to protect surfaces.",
    rating: 4.8,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=800&auto=format&fit=crop",
    ],
    tags: ["planter", "ceramic", "handmade", "home decor"],
  },
  {
    id: 11,
    name: "String Light Curtain",
    price: 39.99,
    category: "Lighting",
    description:
      "Transform any space with this magical curtain of warm LED string lights. Perfect for windows, walls, or as a room divider, these lights create a cozy, enchanting atmosphere. Features 8 lighting modes and a timer function.",
    rating: 4.7,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop",
      "https://images.pexels.com/photos/68084/pexels-photo-68084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    tags: ["string lights", "curtain", "lighting", "LED"],
  },
  {
    id: 12,
    name: "Pressed Flower Frame",
    price: 34.99,
    category: "Wall Art",
    description:
      "Bring nature's beauty indoors with this elegant pressed flower frame. Real wildflowers and botanicals are carefully preserved between glass in a minimalist wooden frame. Each piece is unique and makes a thoughtful gift or personal keepsake.",
    rating: 4.9,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?q=80&w=800&auto=format&fit=crop",
      "https://images.pexels.com/photos/4041193/pexels-photo-4041193.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/7763905/pexels-photo-7763905.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    tags: ["pressed flowers", "frame", "wall art", "botanical"],
  },
];

const categories: Category[] = [
  {
    id: "wall-art",
    name: "Wall Art",
    icon: <div className="w-6 h-6 flex items-center justify-center">🖼️</div>,
  },
  {
    id: "lighting",
    name: "Lighting",
    icon: <div className="w-6 h-6 flex items-center justify-center">💡</div>,
  },
  {
    id: "seasonal-decor",
    name: "Seasonal Decor",
    icon: <div className="w-6 h-6 flex items-center justify-center">🍂</div>,
  },
  {
    id: "handmade-crafts",
    name: "Handmade Crafts",
    icon: <div className="w-6 h-6 flex items-center justify-center">🧶</div>,
  },
];

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(theme.light);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const featuredProducts = products.filter((product) => product.featured);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--background",
      currentTheme.background
    );
    document.documentElement.style.setProperty(
      "--foreground",
      currentTheme.foreground
    );
    document.documentElement.style.setProperty(
      "--primary",
      currentTheme.primary
    );
    document.documentElement.style.setProperty(
      "--secondary",
      currentTheme.secondary
    );
    document.documentElement.style.setProperty("--accent", currentTheme.accent);
    document.documentElement.style.setProperty("--muted", currentTheme.muted);
    document.documentElement.style.setProperty("--card", currentTheme.card);
    document.documentElement.style.setProperty("--border", currentTheme.border);

    document.body.style.backgroundColor = currentTheme.background;
    document.body.style.color = currentTheme.foreground;
  }, [currentTheme]);

  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) =>
          product.category.toLowerCase() ===
          selectedCategory.toLowerCase().replace("-", " ")
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    setCurrentTheme(isDarkMode ? theme.light : theme.dark);
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
    document.body.style.overflow = "hidden";
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
    document.body.style.overflow = "auto";
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }

    showToast(`${product.name} added to cart`, "success");
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.product.id !== productId));
    showToast("Item removed from cart", "info");
  };

  const toggleWishlist = (product: Product) => {
    const isInWishlist = wishlist.some((item) => item.id === product.id);

    if (isInWishlist) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));
      showToast(`${product.name} removed from wishlist`, "info");
    } else {
      setWishlist([...wishlist, product]);
      showToast(`${product.name} added to wishlist`, "success");
    }
  };

  const addToCartFromWishlist = (product: Product) => {
    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }

    // Remove from wishlist
    setWishlist(wishlist.filter((item) => item.id !== product.id));
    
    showToast(`${product.name} moved from wishlist to cart`, "success");
  };

  const showToast = (message: string, type: "success" | "error" | "info") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const nextCarouselSlide = () => {
    setCarouselIndex((prevIndex) =>
      prevIndex === featuredProducts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevCarouselSlide = () => {
    setCarouselIndex((prevIndex) =>
      prevIndex === 0 ? featuredProducts.length - 1 : prevIndex - 1
    );
  };

  const selectCategory = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < Math.floor(rating)
            ? "text-yellow-500 fill-yellow-500"
            : index < rating
            ? "text-yellow-500 fill-yellow-500 opacity-50"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const DecorativeDivider = ({ color = currentTheme.primary }) => (
    <div className="flex items-center justify-center my-8">
      <div className="h-px w-16 bg-current" style={{ color }}></div>
      <div className="mx-2">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22L3 17V7L12 2L21 7V17L12 22Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="currentColor"
            fillOpacity="0.2"
          />
        </svg>
      </div>
      <div className="h-px w-16 bg-current" style={{ color }}></div>
    </div>
  );

  const renderProductCard = (product: Product) => {
    const isInWishlist = wishlist.some((item) => item.id === product.id);

    return (
      <motion.div
        key={product.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="group relative rounded-lg overflow-hidden shadow-md border transition-all duration-300 group hover:shadow-xl"
        style={{
          backgroundColor: currentTheme.card,
          borderColor: currentTheme.border,
        }}
      >
        <div className="relative overflow-hidden h-64">
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-300 cursor-pointer z-10"
          >
            <Heart
              size={20}
              className={`transition-colors duration-300 ${
                isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>
        </div>

        <div
          className="p-4 cursor-pointer"
          onClick={() => openProductDetail(product)}
        >
          <div className="flex justify-between items-start mb-2">
            <h3
              className="font-medium text-lg truncate"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {product.name}
            </h3>
          </div>

          <div className="flex items-center mb-2">
            {renderStars(product.rating)}
            <span className="ml-1 text-sm text-gray-500">
              ({product.rating})
            </span>
          </div>

          <p
            className="text-sm mb-3 line-clamp-2 text-gray-600"
            style={{ color: `${currentTheme.foreground}99` }}
          >
            {product.description}
          </p>

          <div className="flex justify-between items-center">
            <span
              className="font-bold text-lg"
              style={{ color: currentTheme.accent }}
            >
              ${product.price.toFixed(2)}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="p-2 rounded-full transition-colors duration-300 hover:bg-opacity-90 cursor-pointer"
              style={{ backgroundColor: currentTheme.primary, color: "#fff" }}
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderProductDetail = () => {
    if (!selectedProduct) return null;

    const isInWishlist = wishlist.some(
      (item) => item.id === selectedProduct.id
    );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closeProductDetail}
        ></div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-6xl max-h-[90vh] overflow-auto rounded-xl shadow-2xl"
          style={{ backgroundColor: currentTheme.card }}
        >
          <button
            onClick={closeProductDetail}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/10 hover:bg-black/20 transition-colors duration-300 cursor-pointer"
          >
            <X size={24} className="text-white" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-lg h-80 md:h-96">
                <img
                  src={
                    selectedProduct.images[activeImageIndex] ||
                    "/placeholder.svg"
                  }
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex space-x-2 overflow-x-auto pb-2">
                {selectedProduct.images.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                      activeImageIndex === index
                        ? "border-primary ring-2 ring-primary ring-opacity-50"
                        : "border-transparent"
                    }`}
                    style={{
                      borderColor:
                        activeImageIndex === index
                          ? currentTheme.primary
                          : "transparent",
                    }}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${selectedProduct.name} - view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2
                  className="text-2xl md:text-3xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {selectedProduct.name}
                </h2>

                <div className="flex items-center mb-4">
                  {renderStars(selectedProduct.rating)}
                  <span
                    className="ml-2 text-sm"
                    style={{ color: `${currentTheme.foreground}99` }}
                  >
                    ({selectedProduct.rating} rating)
                  </span>
                </div>

                <p
                  className="text-xl font-bold mb-4"
                  style={{ color: currentTheme.accent }}
                >
                  ${selectedProduct.price.toFixed(2)}
                </p>

                <div
                  className="h-px w-full my-4"
                  style={{ backgroundColor: currentTheme.border }}
                ></div>

                <p className="mb-6" style={{ color: currentTheme.foreground }}>
                  {selectedProduct.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedProduct.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-sm"
                      style={{
                        backgroundColor: `${currentTheme.muted}`,
                        color: currentTheme.foreground,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => addToCart(selectedProduct)}
                    className="flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-300 hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: currentTheme.primary,
                      color: "#fff",
                    }}
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>

                  <button
                    onClick={() => toggleWishlist(selectedProduct)}
                    className="flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-300 cursor-pointer"
                    style={{
                      backgroundColor: isInWishlist
                        ? currentTheme.accent
                        : "transparent",
                      color: isInWishlist ? "#fff" : currentTheme.foreground,
                      borderWidth: "1px",
                      borderColor: isInWishlist
                        ? currentTheme.accent
                        : currentTheme.border,
                    }}
                  >
                    <Heart
                      size={20}
                      className={isInWishlist ? "fill-white" : ""}
                    />
                    {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const renderCart = () => {
    return (
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isCartOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-0 right-0 h-full w-full sm:w-96 z-40 shadow-xl"
        style={{ backgroundColor: currentTheme.card }}
      >
        <div
          className="p-4 border-b flex justify-between items-center"
          style={{ borderColor: currentTheme.border }}
        >
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Your Cart
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
            style={{
              color: currentTheme.foreground,
              backgroundColor: `${currentTheme.muted}50`,
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 h-[calc(100vh-180px)] overflow-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart size={64} className="mb-4 opacity-20" />
              <p className="text-lg mb-2">Your cart is empty</p>
              <p
                className="text-sm mb-6"
                style={{ color: `${currentTheme.foreground}99` }}
              >
                Add some products to your cart to see them here
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-4 py-2 rounded-lg transition-colors duration-300 cursor-pointer"
                style={{ backgroundColor: currentTheme.primary, color: "#fff" }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 rounded-lg"
                  style={{ backgroundColor: `${currentTheme.muted}50` }}
                >
                  <img
                    src={item.product.images[0] || "/placeholder.svg"}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />

                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p
                      className="text-sm"
                      style={{ color: `${currentTheme.foreground}99` }}
                    >
                      Qty: {item.quantity}
                    </p>
                    <p
                      className="font-bold"
                      style={{ color: currentTheme.accent }}
                    >
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="self-center p-2 rounded-full hover:bg-gray-200 transition-colors duration-300 cursor-pointer"
                    style={{ backgroundColor: `${currentTheme.muted}80` }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div
            className="absolute bottom-0 left-0 right-0 p-4 border-t"
            style={{
              backgroundColor: currentTheme.card,
              borderColor: currentTheme.border,
            }}
          >
            <div className="flex justify-between mb-4">
              <span className="font-medium">Total:</span>
              <span
                className="font-bold"
                style={{ color: currentTheme.accent }}
              >
                $
                {cart
                  .reduce(
                    (total, item) => total + item.product.price * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => {
                showToast("Order placed successfully!", "success");
                setCart([]);
                setIsCartOpen(false);
              }}
              className="w-full py-3 rounded-lg font-medium transition-colors duration-300 hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: currentTheme.primary, color: "#fff" }}
            >
              Checkout
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  const renderWishlist = () => {
    return (
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isWishlistOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-0 right-0 h-full w-full sm:w-96 z-40 shadow-xl"
        style={{ backgroundColor: currentTheme.card }}
      >
        <div
          className="p-4 border-b flex justify-between items-center"
          style={{ borderColor: currentTheme.border }}
        >
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Your Wishlist
          </h2>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
            style={{
              color: currentTheme.foreground,
              backgroundColor: `${currentTheme.muted}50`,
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 h-[calc(100vh-180px)] overflow-auto">
          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Heart size={64} className="mb-4 opacity-20" />
              <p className="text-lg mb-2">Your wishlist is empty</p>
              <p
                className="text-sm mb-6"
                style={{ color: `${currentTheme.foreground}99` }}
              >
                Add some products to your wishlist to see them here
              </p>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="px-4 py-2 rounded-lg transition-colors duration-300 cursor-pointer"
                style={{ backgroundColor: currentTheme.primary, color: "#fff" }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlist.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 rounded-lg"
                  style={{ backgroundColor: `${currentTheme.muted}50` }}
                >
                  <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />

                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <p
                      className="font-bold"
                      style={{ color: currentTheme.accent }}
                    >
                      ${product.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        addToCartFromWishlist(product);
                      }}
                      className="p-2 rounded-full transition-colors duration-300 cursor-pointer"
                      style={{ backgroundColor: `${currentTheme.primary}80` }}
                    >
                      <ShoppingCart size={16} color="#fff" />
                    </button>
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-300 cursor-pointer"
                      style={{ backgroundColor: `${currentTheme.muted}80` }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderToasts = () => {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="p-3 rounded-lg shadow-lg whitespace-nowrap sm:whitespace-normal text-center max-w-[90vw] sm:max-w-md overflow-hidden text-ellipsis"
            style={{
              backgroundColor:
                toast.type === "success"
                  ? "#10b981"
                  : toast.type === "error"
                  ? "#ef4444"
                  : "#3b82f6",
              color: "#fff",
            }}
          >
            {toast.message}
          </motion.div>
        ))}
      </div>
    );
  };

  const renderFeaturedCarousel = () => {
    return (
      <div className="relative overflow-hidden mb-4 rounded-xl">
        <div ref={carouselRef} className="relative h-[500px] md:h-[600px]">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{
                opacity: carouselIndex === index ? 1 : 0,
                zIndex: carouselIndex === index ? 10 : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative w-full h-full">
                <img
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 flex flex-col justify-end p-6 md:p-12"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
                  }}
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{
                      y: carouselIndex === index ? 0 : 20,
                      opacity: carouselIndex === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h2
                      className="text-3xl md:text-4xl font-bold text-white mb-2"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {product.name}
                    </h2>
                    <p className="text-white/80 mb-4 max-w-lg">
                      {product.description.substring(0, 120)}...
                    </p>
                    <button
                      onClick={() => openProductDetail(product)}
                      className="px-6 py-3 rounded-lg font-medium transition-colors duration-300 hover:opacity-90 cursor-pointer"
                      style={{
                        backgroundColor: currentTheme.primary,
                        color: "#fff",
                      }}
                    >
                      View Details
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          onClick={prevCarouselSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 hover:bg-white/50 transition-colors duration-300 z-10 cursor-pointer"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>

        <button
          onClick={nextCarouselSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 hover:bg-white/50 transition-colors duration-300 z-10 cursor-pointer"
        >
          <ChevronRight size={24} className="text-white" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {featuredProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCarouselIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                carouselIndex === index ? "w-6 bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <main
      className={`min-h-screen ${playfair.variable} ${raleway.variable}`}
      style={{ fontFamily: "var(--font-raleway)" }}
    >
      <header
        className="sticky top-0 z-20 shadow-sm"
        style={{ backgroundColor: currentTheme.card }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Elegant Decor
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
                style={{ backgroundColor: `${currentTheme.muted}50` }}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                onClick={() => {
                  setIsWishlistOpen(true);
                  setIsCartOpen(false);
                }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300 cursor-pointer relative"
                style={{ backgroundColor: `${currentTheme.muted}50` }}
              >
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center"
                    style={{
                      backgroundColor: currentTheme.primary,
                      color: "#fff",
                    }}
                  >
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setIsCartOpen(true);
                  setIsWishlistOpen(false);
                }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300 cursor-pointer relative"
                style={{ backgroundColor: `${currentTheme.muted}50` }}
              >
                <ShoppingBag size={20} />
                {cart.length > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center"
                    style={{
                      backgroundColor: currentTheme.primary,
                      color: "#fff",
                    }}
                  >
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {renderFeaturedCarousel()}

        <div className="my-8">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => selectCategory(category.id)}
                className={`p-4 rounded-lg flex flex-col items-center justify-center gap-3 transition-all duration-300 cursor-pointer h-32`}
                style={{
                  backgroundColor:
                    selectedCategory === category.id
                      ? currentTheme.primary
                      : currentTheme.muted,
                  color:
                    selectedCategory === category.id
                      ? "#fff"
                      : currentTheme.foreground,
                }}
              >
                <div className="text-2xl">{category.icon}</div>
                <span className="font-medium">{category.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="my-8">
          <div className="flex justify-between items-center mb-6">
            <h2
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {selectedCategory
                ? `${categories.find((c) => c.id === selectedCategory)?.name}`
                : searchQuery
                ? `Search Results for "${searchQuery}"`
                : "All Products"}
            </h2>

            {(selectedCategory || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
                className="text-sm font-medium cursor-pointer"
                style={{ color: currentTheme.primary }}
              >
                Clear Filters
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div
              className="p-8 rounded-lg text-center"
              style={{ backgroundColor: `${currentTheme.muted}50` }}
            >
              <p className="text-lg mb-2">No products found</p>
              <p
                className="text-sm mb-4"
                style={{ color: `${currentTheme.foreground}99` }}
              >
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
                className="px-4 py-2 rounded-lg transition-colors duration-300 cursor-pointer"
                style={{ backgroundColor: currentTheme.primary, color: "#fff" }}
              >
                View All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => renderProductCard(product))}
            </div>
          )}
        </div>
        <section className="my-16">
          <h2
            className="text-2xl font-bold text-center mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Why Decorate Your Space?
          </h2>
          <p
            className="text-center mb-10 max-w-2xl mx-auto"
            style={{ color: `${currentTheme.foreground}99` }}
          >
            Discover how thoughtful decoration can transform your living
            environment and enhance your wellbeing
          </p>

          <DecorativeDivider />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div
              className="text-center p-6 rounded-lg transition-transform duration-300 hover:scale-105"
              style={{ backgroundColor: `${currentTheme.primary}15` }}
            >
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: currentTheme.primary }}
              >
                <div className="text-2xl text-white">🧠</div>
              </div>
              <h3
                className="text-xl font-bold mb-3"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Improves Mood
              </h3>
              <p>
                Colors, textures, and patterns can significantly impact your
                emotional wellbeing, reducing stress and anxiety.
              </p>
            </div>

            <div
              className="text-center p-6 rounded-lg transition-transform duration-300 hover:scale-105"
              style={{ backgroundColor: `${currentTheme.secondary}15` }}
            >
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: currentTheme.secondary }}
              >
                <div className="text-2xl text-white">✨</div>
              </div>
              <h3
                className="text-xl font-bold mb-3"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Enhances Productivity
              </h3>
              <p>
                A well-decorated space can boost focus, creativity, and
                efficiency in your daily activities.
              </p>
            </div>

            <div
              className="text-center p-6 rounded-lg transition-transform duration-300 hover:scale-105"
              style={{ backgroundColor: `${currentTheme.accent}15` }}
            >
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: currentTheme.accent }}
              >
                <div className="text-2xl text-white">🏠</div>
              </div>
              <h3
                className="text-xl font-bold mb-3"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Creates Harmony
              </h3>
              <p>
                Thoughtful decoration creates a sense of balance and harmony,
                making your space feel more cohesive and inviting.
              </p>
            </div>
          </div>
        </section>

        <div className="relative h-24 my-16 overflow-hidden">
          <svg
            className="absolute bottom-0 left-0 w-full"
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 120L48 105C96 90 192 60 288 50C384 40 480 50 576 55C672 60 768 60 864 65C960 70 1056 80 1152 75C1248 70 1344 50 1392 40L1440 30V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
              fill={currentTheme.primary}
              fillOpacity="0.2"
            />
            <path
              d="M0 120L48 110C96 100 192 80 288 75C384 70 480 80 576 85C672 90 768 90 864 85C960 80 1056 70 1152 65C1248 60 1344 60 1392 60L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
              fill={currentTheme.secondary}
              fillOpacity="0.2"
            />
          </svg>
        </div>

        <section
          id="about"
          className="my-16 py-16 px-4 rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.primary}15, ${currentTheme.secondary}15)`,
            borderLeft: `4px solid ${currentTheme.primary}`,
          }}
        >
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2
                  className="text-3xl font-bold mb-6"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  About Elegant Decor
                </h2>

                <DecorativeDivider color={currentTheme.secondary} />

                <p className="mb-4">
                  Founded in 2015, Elegant Decor was born from a passion for
                  beautiful spaces and handcrafted items. We believe that your
                  surroundings significantly impact your wellbeing, creativity,
                  and happiness.
                </p>

                <p className="mb-4">
                  Our mission is to provide unique, high-quality decorative
                  pieces that transform ordinary spaces into extraordinary
                  environments. Each item in our collection is carefully
                  selected or handcrafted by artisans who share our commitment
                  to quality and sustainability.
                </p>

                <p className="mb-6">
                  We work directly with artisans around the world, ensuring fair
                  trade practices and supporting traditional craftsmanship while
                  bringing you unique pieces with stories behind them.
                </p>

                <div className="flex flex-wrap gap-4">
                  <div
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: currentTheme.primary,
                      color: "#fff",
                    }}
                  >
                    Sustainable Materials
                  </div>
                  <div
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: currentTheme.secondary,
                      color: "#fff",
                    }}
                  >
                    Artisan Crafted
                  </div>
                  <div
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: currentTheme.accent,
                      color: "#fff",
                    }}
                  >
                    Fair Trade
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&auto=format&fit=crop"
                    alt="Artisan crafting"
                    className="rounded-lg h-48 w-full object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=800&auto=format&fit=crop"
                    alt="Workshop"
                    className="rounded-lg h-64 w-full object-cover"
                  />
                </div>
                <div className="space-y-4 pt-8">
                  <img
                    src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop"
                    alt="Materials"
                    className="rounded-lg h-64 w-full object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=800&auto=format&fit=crop"
                    alt="Finished product"
                    className="rounded-lg h-48 w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="relative my-16">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-24 h-24 opacity-10">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke={currentTheme.primary}
                strokeWidth="2"
              />
              <circle
                cx="50"
                cy="50"
                r="35"
                stroke={currentTheme.secondary}
                strokeWidth="2"
              />
              <circle
                cx="50"
                cy="50"
                r="25"
                stroke={currentTheme.accent}
                strokeWidth="2"
              />
            </svg>
          </div>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-24 opacity-10">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="10"
                y="10"
                width="80"
                height="80"
                stroke={currentTheme.primary}
                strokeWidth="2"
              />
              <rect
                x="25"
                y="25"
                width="50"
                height="50"
                stroke={currentTheme.secondary}
                strokeWidth="2"
              />
              <rect
                x="40"
                y="40"
                width="20"
                height="20"
                stroke={currentTheme.accent}
                strokeWidth="2"
              />
            </svg>
          </div>

          <div className="container mx-auto px-4 py-12 text-center relative z-10">
            <h2
              className="text-3xl font-bold mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Our Design Philosophy
            </h2>

            <DecorativeDivider />

            <p className="max-w-3xl mx-auto text-lg mb-8">
              We believe that beautiful spaces should be accessible to everyone.
              Our curated collections blend timeless elegance with contemporary
              trends, allowing you to create a space that reflects your unique
              personality and style.
            </p>

            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="flex flex-col items-center max-w-xs">
                <div
                  className="w-20 h-20 rounded-full mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${currentTheme.primary}20` }}
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke={currentTheme.primary}
                      strokeWidth="2"
                    />
                    <path
                      d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"
                      stroke={currentTheme.primary}
                      strokeWidth="2"
                    />
                    <path
                      d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                      stroke={currentTheme.primary}
                      strokeWidth="2"
                      fill={currentTheme.primary}
                    />
                  </svg>
                </div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Harmony
                </h3>
                <p>
                  We create pieces that work together harmoniously while making
                  a statement on their own.
                </p>
              </div>

              <div className="flex flex-col items-center max-w-xs">
                <div
                  className="w-20 h-20 rounded-full mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${currentTheme.secondary}20` }}
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 2H15L19 6V18L15 22H9L5 18V6L9 2Z"
                      stroke={currentTheme.secondary}
                      strokeWidth="2"
                    />
                    <path
                      d="M12 8V16"
                      stroke={currentTheme.secondary}
                      strokeWidth="2"
                    />
                    <path
                      d="M8 12H16"
                      stroke={currentTheme.secondary}
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Quality
                </h3>
                <p>
                  We never compromise on materials or craftsmanship, ensuring
                  each piece stands the test of time.
                </p>
              </div>

              <div className="flex flex-col items-center max-w-xs">
                <div
                  className="w-20 h-20 rounded-full mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${currentTheme.accent}20` }}
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke={currentTheme.accent}
                      strokeWidth="2"
                    />
                    <path
                      d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14"
                      stroke={currentTheme.accent}
                      strokeWidth="2"
                    />
                    <path
                      d="M9 9H9.01"
                      stroke={currentTheme.accent}
                      strokeWidth="2"
                    />
                    <path
                      d="M15 9H15.01"
                      stroke={currentTheme.accent}
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Joy
                </h3>
                <p>
                  We believe your surroundings should bring you joy and reflect
                  your unique personality.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section id="contact" className="my-16">
          <div className="container mx-auto px-4">
            <h2
              className="text-3xl font-bold text-center mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Get In Touch
            </h2>

            <DecorativeDivider />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
              <div>
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    showToast("Message sent successfully!", "success");
                    e.currentTarget.reset();
                  }}
                >
                  <div>
                    <label htmlFor="name" className="block mb-2 font-medium">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-colors duration-300"
                      style={{
                        borderColor: currentTheme.border,
                        backgroundColor: currentTheme.card,
                        color: currentTheme.foreground,
                      }}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block mb-2 font-medium">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-colors duration-300"
                      style={{
                        borderColor: currentTheme.border,
                        backgroundColor: currentTheme.card,
                        color: currentTheme.foreground,
                      }}
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block mb-2 font-medium">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-colors duration-300"
                      style={{
                        borderColor: currentTheme.border,
                        backgroundColor: currentTheme.card,
                        color: currentTheme.foreground,
                      }}
                      placeholder="How can we help you?"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg font-medium transition-colors duration-300 hover:opacity-90 w-full cursor-pointer"
                    style={{
                      backgroundColor: currentTheme.primary,
                      color: "#fff",
                    }}
                  >
                    Send Message
                  </button>
                </form>
              </div>

              <div className="space-y-8">
                <div>
                  <h3
                    className="text-xl font-bold mb-4"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Visit Our Store
                  </h3>

                  <div className="rounded-lg overflow-hidden h-64 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?q=80&w=800&auto=format&fit=crop"
                      alt="Store location"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z"
                          stroke={currentTheme.primary}
                          strokeWidth="2"
                        />
                        <path
                          d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                          stroke={currentTheme.primary}
                          strokeWidth="2"
                        />
                      </svg>
                      <span>123 Decor Street, Design District, NY 10001</span>
                    </p>

                    <p className="flex items-center gap-2">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22 12H2"
                          stroke={currentTheme.primary}
                          strokeWidth="2"
                        />
                        <path
                          d="M12 2V22"
                          stroke={currentTheme.primary}
                          strokeWidth="2"
                        />
                        <path
                          d="M17 7L7 17"
                          stroke={currentTheme.primary}
                          strokeWidth="2"
                        />
                        <path
                          d="M7 7L17 17"
                          stroke={currentTheme.primary}
                          strokeWidth="2"
                        />
                      </svg>
                      <span>Monday - Saturday: 10am - 8pm</span>
                    </p>

                    <p className="flex items-center gap-2">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22 16.92V19.92C22 20.4704 21.7893 20.9996 21.4142 21.3747C21.0391 21.7498 20.5099 21.9605 19.96 21.96C18.14 21.96 16.36 21.58 14.68 20.84C13.1336 20.1539 11.7334 19.1929 10.54 18C9.34712 16.8066 8.38615 15.4064 7.7 13.86C6.96 12.18 6.58 10.4 6.58 8.58C6.57955 8.03011 6.79021 7.50094 7.16531 7.12584C7.54042 6.75073 8.06959 6.54007 8.62 6.54H11.62C12.0917 6.53872 12.5471 6.70379 12.9071 7.00817C13.2672 7.31255 13.5099 7.73573 13.59 8.2C13.7 8.86 13.85 9.5 14.04 10.12C14.1521 10.4627 14.1612 10.8342 14.0659 11.1825C13.9705 11.5308 13.7752 11.8393 13.51 12.07L12.21 13.37C13.2625 14.9767 14.6833 16.3975 16.29 17.45L17.59 16.15C17.8207 15.8848 18.1292 15.6895 18.4775 15.5941C18.8258 15.4988 19.1973 15.5079 19.54 15.62C20.16 15.81 20.8 15.96 21.46 16.07C21.9243 16.1501 22.3475 16.3928 22.6519 16.7528C22.9562 17.1129 23.1213 17.5683 23.12 18.04L22 16.92Z"
                          stroke={currentTheme.primary}
                          strokeWidth="2"
                        />
                      </svg>
                      <span>(555) 123-4567</span>
                    </p>

                    <p className="flex items-center gap-2">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                          stroke={currentTheme.primary}
                          strokeWidth="2"
                        />
                        <path
                          d="M22 6L12 13L2 6"
                          stroke={currentTheme.primary}
                          strokeWidth="2"
                        />
                      </svg>
                      <span>contact@elegantdecor.com</span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3
                    className="text-xl font-bold mb-4"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Connect With Us
                  </h3>

                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
                      style={{
                        backgroundColor: currentTheme.primary,
                        color: "#fff",
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>

                    <a
                      href="#"
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
                      style={{
                        backgroundColor: currentTheme.secondary,
                        color: "#fff",
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M23 3.00005C22.0424 3.67552 20.9821 4.19216 19.86 4.53005C19.2577 3.83756 18.4573 3.34674 17.567 3.12397C16.6767 2.90121 15.7395 2.95724 14.8821 3.2845C14.0247 3.61176 13.2884 4.19445 12.773 4.95376C12.2575 5.71308 11.9877 6.61238 12 7.53005V8.53005C10.2426 8.57561 8.50127 8.18586 6.93101 7.39549C5.36074 6.60513 4.01032 5.43868 3 4.00005C3 4.00005 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.50005C20.9991 7.2215 20.9723 6.94364 20.92 6.67005C21.9406 5.66354 22.6608 4.39276 23 3.00005Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>

                    <a
                      href="#"
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
                      style={{
                        backgroundColor: currentTheme.accent,
                        color: "#fff",
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61991 14.1902 8.22773 13.4229 8.09406 12.5922C7.9604 11.7615 8.09206 10.9099 8.47032 10.1584C8.84858 9.40685 9.45418 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87658 12.63 8C13.4789 8.12588 14.2648 8.52146 14.8717 9.12831C15.4785 9.73515 15.8741 10.5211 16 11.37Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17.5 6.5H17.51"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>

                    <a
                      href="#"
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
                      style={{
                        backgroundColor: currentTheme.primary,
                        color: "#fff",
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6 9H2V21H6V9Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer
        className="py-12 mt-12"
        style={{ backgroundColor: currentTheme.muted }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3
                className="text-xl font-bold mb-4"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Elegant Decor
              </h3>
              <p
                className="mb-4"
                style={{ color: `${currentTheme.foreground}99` }}
              >
                Transforming spaces with beautiful, handcrafted decor items for
                every season and occasion.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Shop</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Best Sellers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Sale Items
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Gift Cards
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">About</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Artisans
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Sustainability
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Customer Service</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:underline">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Shipping & Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="mt-12 pt-6 text-center"
            style={{ borderTopWidth: "1px", borderColor: currentTheme.border }}
          >
            <p style={{ color: `${currentTheme.foreground}99` }}>
              © {new Date().getFullYear()} Elegant Decor. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {selectedProduct && renderProductDetail()}
      </AnimatePresence>

      {renderCart()}
      {renderWishlist()}
      {renderToasts()}
    </main>
  );
}
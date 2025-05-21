"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  Search,
  X,
  ChevronDown,
  CreditCard,
  Check,
  Star,
  Heart,
  Menu,
  ArrowRight,
  User,
  RefreshCw,
  TrendingUp,
  Clock,
  Mail,
  Send,
  ChevronRight,
  Filter,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  featured: boolean;
  description: string;
  inStock: boolean;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type CustomerInfo = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVC: string;
};

type UserInfo = {
  username: string;
  fullName: string;
  email: string;
  isLoggedIn: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => void;
  username: string;
  password: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

// Main component
export default function FlowerShop() {
  // Products data
  const products: Product[] = [
    {
      id: 1,
      name: "Classic Rose Bouquet",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "bouquets",
      rating: 4.8,
      featured: true,
      description:
        "A timeless arrangement of premium red roses, perfect for expressing love and appreciation.",
      inStock: true,
    },
    {
      id: 2,
      name: "Meadow Collection",
      price: 59.99,
      image:
        "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "arrangements",
      rating: 4.7,
      featured: true,
      description:
        "Vibrant tulips, daisies, and wildflowers that capture the essence of springtime.",
      inStock: true,
    },
    {
      id: 3,
      name: "Elegant Orchid Plant",
      price: 69.99,
      image:
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "plants",
      rating: 4.9,
      featured: true,
      description:
        "A sophisticated double-stem orchid plant that brings subtle elegance to any space.",
      inStock: true,
    },
    {
      id: 4,
      name: "Tropical Paradise",
      price: 79.99,
      image:
        "https://images.unsplash.com/photo-1567748157439-651aca2ff064?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "exotic",
      rating: 4.6,
      featured: false,
      description:
        "Exotic blooms including bird of paradise, protea, and tropical greens.",
      inStock: true,
    },
    {
      id: 5,
      name: "Zen Succulent Garden",
      price: 179.99,
      image:
        "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "plants",
      rating: 4.5,
      featured: false,
      description:
        "A modern arrangement of premium succulents in a contemporary container.",
      inStock: true,
    },
    {
      id: 6,
      name: "Lavender Dreams",
      price: 54.99,
      image:
        "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "bouquets",
      rating: 4.7,
      featured: false,
      description:
        "Fragrant lavender stems paired with white roses and eucalyptus.",
      inStock: true,
    },
    {
      id: 7,
      name: "Seasonal Sunflower Mix",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "bouquets",
      rating: 4.8,
      featured: false,
      description:
        "Bright and cheerful sunflowers combined with seasonal complementary blooms.",
      inStock: true,
    },
    {
      id: 8,
      name: "White Rose",
      price: 89.99,
      image:
        "https://images.unsplash.com/photo-1495231916356-a86217efff12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "plants",
      rating: 4.9,
      featured: false,
      description:
        "A carefully cultivated miniature tree, representing harmony and balance.",
      inStock: true,
    },
    {
      id: 9,
      name: "Luxury Rose Box",
      price: 129.99,
      image:
        "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "premium",
      rating: 5.0,
      featured: true,
      description:
        "Two dozen premium preserved roses in an elegant keepsake box.",
      inStock: true,
    },
    {
      id: 10,
      name: "Sympathy Peace Lily",
      price: 64.99,
      image:
        "https://images.unsplash.com/photo-1567748157439-651aca2ff064?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "plants",
      rating: 4.8,
      featured: false,
      description:
        "A meaningful peace lily plant symbolizing tranquility and remembrance.",
      inStock: true,
    },
    {
      id: 11,
      name: "Birthday Celebration",
      price: 59.99,
      image:
        "https://images.unsplash.com/photo-1452827073306-6e6e661baf57?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "arrangements",
      rating: 4.7,
      featured: false,
      description:
        "A festive mix of colorful gerbera daisies, carnations, and accent flowers.",
      inStock: true,
    },
    {
      id: 12,
      name: "Rainbow Tulip Collection",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "bouquets",
      rating: 4.6,
      featured: false,
      description:
        "A vibrant array of multicolored tulips symbolizing perfect happiness.",
      inStock: true,
    },
  ];

  // State management
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<
    "products" | "cart" | "checkout" | "success"
  >("products");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
  });
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] =
    useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: "",
    fullName: "",
    email: "",
    isLoggedIn: false,
  });
  const [loginCredentials, setLoginCredentials] = useState({
    username: "user",
    password: "password",
  });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Refs
  const headerRef = useRef<HTMLDivElement>(null);
  const productGridRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  // Calculate cart totals
  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Filter and search products
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesPrice && matchesSearch;
  });

  // Featured products
  const featuredProducts = products.filter((product) => product.featured);

  // Categories
  const categories = [
    "all",
    ...Array.from(new Set(products.map((product) => product.category))),
  ];

  // Check if product is in cart
  const isProductInCart = (productId: number): boolean => {
    return cart.some((item) => item.product.id === productId);
  };

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation - in a real app, you would authenticate with an API
    if (
      loginCredentials.username === "user" &&
      loginCredentials.password === "password"
    ) {
      setUserInfo({
        username: loginCredentials.username,
        fullName: "John Doe",
        email: "john.doe@example.com",
        isLoggedIn: true,
      });
      setLoginModalOpen(false);
      // Reset login form
      setLoginCredentials({ username: "", password: "" });
    } else {
      alert("Invalid credentials. Try username: user, password: password");
    }
  };

  // Handle logout
  const handleLogout = () => {
    setUserInfo({
      username: "",
      fullName: "",
      email: "",
      isLoggedIn: false,
    });
  };

  // Handle login credential changes
  const handleLoginCredentialChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setLoginCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle adding product to cart
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingItemIndex !== -1) {
        // Item already in cart, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Item not in cart, add it
        return [...prevCart, { product, quantity }];
      }
    });

    setCartOpen(true);
  };

  // Update cart item quantity
  const updateCartItemQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
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

  // Remove item from cart
  const removeFromCart = (productId: number) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  };

  // Handle checkout
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setView("success");
    // In a real app, you would handle payment processing here

    // Clear cart after successful checkout
    setTimeout(() => {
      setCart([]);
    }, 500);
  };

  // Handle customer info changes
  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // Subscribe to newsletter
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNewsletterSubscribed(true);
    // In a real app, you would send this to your API
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Prevent scrolling when any sidebar is open
    if (cartOpen || menuOpen || showFilters || loginModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Clean up on unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [cartOpen, menuOpen, showFilters, loginModalOpen]);

  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll(".animate-on-scroll");
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, [view]);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // Handle sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        if (window.scrollY > 50) {
          headerRef.current.classList.add("sticky-header");
        } else {
          headerRef.current.classList.remove("sticky-header");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Navigation */}
      <header
        ref={headerRef}
        className="fixed w-full bg-white z-50 transition-all duration-300 border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div
                className="flex-shrink-0 flex items-center cursor-pointer"
                onClick={() => setView("products")}
              >
                <span className="text-2xl font-bold text-emerald-600">
                  Bloom & Co.
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <div
                className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors"
                onClick={() => setView("products")}
              >
                Home
              </div>
              <div
                className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors"
                onClick={() => {
                  setView("products");
                  setTimeout(() => {
                    const element = document.getElementById("shop-section");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              >
                Shop
              </div>
              <div
                className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors"
                onClick={() => {
                  setView("products");
                  setTimeout(() => {
                    const element = document.getElementById("featured-section");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              >
                Featured
              </div>
              <div
                className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors"
                onClick={() => {
                  setView("products");
                  setTimeout(() => {
                    const element = document.getElementById("join");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              >
                Join
              </div>
            </nav>

            {/* Right side icons */}
            <div className="flex items-center">
              {/* loveleen */}
              {/* User */}
              {userInfo.isLoggedIn ? (
                <div className="ml-4 md:ml-6 relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="p-1 hidden md:flex rounded-full text-gray-500 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors cursor-pointer"
                  >
                    <User className="h-6 w-6" />
                  </button>

                  {isOpen && (
                    <div className="ml-3 absolute top-10 left-0 bg-white shadow-md rounded-md p-3 w-48 z-10">
                      <p className="text-sm font-medium text-gray-700">
                        {userInfo.fullName}
                      </p>
                      <p className="text-xs text-gray-500">{userInfo.email}</p>
                      <button
                        onClick={handleLogout}
                        className="mt-1 text-xs cursor-pointer text-emerald-600 hover:text-emerald-700"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setCartOpen(false);
                    setLoginModalOpen(true);
                  }}
                  className="hidden md:flex w-full bg-emerald-600 border border-transparent rounded-md py-2 px-4 items-center justify-center text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors cursor-pointer"
                >
                  Sign in
                </button>
              )}

              {/* Cart */}
              <div className="ml-4 md:ml-6 relative">
                <button
                  className="p-1 rounded-full text-gray-500 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors cursor-pointer"
                  onClick={() => setCartOpen(true)}
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 -right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-emerald-600 rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="ml-4 md:hidden">
                <button
                  onClick={() => setMenuOpen(true)}
                  className="p-2 rounded-md text-gray-500 hover:text-emerald-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors cursor-pointer"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 flex z-50 md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setMenuOpen(false)}
          />

          {/* Menu panel */}
          <div className="relative max-w-xs w-full bg-white shadow-xl pb-12 flex flex-col overflow-y-auto transform transition-transform duration-300 ease-in-out">
            <div className="px-4 pt-5 pb-2 flex justify-between items-center border-b border-gray-100">
              <span className="text-xl font-bold text-emerald-600">Menu</span>
              <button
                type="button"
                className="-m-2 p-2 rounded-md inline-flex items-center justify-center text-gray-400"
                onClick={() => setMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* User section mobile */}
            <div className="px-4 py-4 border-b border-gray-100">
              {userInfo.isLoggedIn ? (
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">
                    {userInfo.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">
                      {userInfo.fullName}
                    </p>
                    <p className="text-xs text-gray-500">{userInfo.email}</p>
                    <button
                      onClick={handleLogout}
                      className="mt-1 text-xs text-emerald-600 hover:text-emerald-700"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setLoginModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  Sign in
                </button>
              )}
            </div>

            {/* Links */}
            <div className="mt-6 px-4 space-y-2">
              <div
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setMenuOpen(false);
                  setView("products");
                }}
              >
                Home
              </div>
              <div
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setMenuOpen(false);
                  setView("products");
                  setTimeout(() => {
                    const element = document.getElementById("shop-section");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              >
                Shop
              </div>
              <div
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setMenuOpen(false);
                  setView("products");
                  setTimeout(() => {
                    const element = document.getElementById("featured-section");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              >
                Featured
              </div>
            
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 py-6 px-4 space-y-6">
              <div className="flex items-center space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
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
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-6 w-6"
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
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
              <div className="text-sm text-gray-500">
                &copy; 2025 Bloom & Co. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Mobile filter panel */}
      {showFilters && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            {/* Background overlay */}
            <div
              className="absolute inset-0 bg-white bg-opacity-50 backdrop-blur-md transition-opacity duration-300"
              onClick={() => setShowFilters(false)}
            />

            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              {/* Slide-in panel */}
              <div className="w-screen max-w-md transform transition-transform duration-300 ease-in-out translate-x-0">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                  <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900 flex items-center">
                        <Filter className="h-5 w-5 text-emerald-500 mr-2" />
                        Filters
                      </h2>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="-m-2 p-2 text-gray-400 hover:text-gray-500 transition-colors"
                          onClick={() => setShowFilters(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-8 space-y-6">
                      {/* Categories */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Categories
                        </h3>
                        <ul className="mt-4 space-y-2">
                          {categories.map((category) => (
                            <li key={category} className="flex items-center">
                              <button
                                onClick={() => {
                                  setSelectedCategory(category);
                                  setShowFilters(false);
                                }}
                                className={`group flex items-center text-sm ${
                                  selectedCategory === category
                                    ? "font-medium text-emerald-600"
                                    : "text-gray-600 hover:text-emerald-600"
                                }`}
                              >
                                <span
                                  className={`mr-3 h-5 w-5 border rounded-full flex items-center justify-center ${
                                    selectedCategory === category
                                      ? "border-emerald-600"
                                      : "border-gray-300 group-hover:border-emerald-600"
                                  }`}
                                >
                                  {selectedCategory === category && (
                                    <span className="h-3 w-3 rounded-full bg-emerald-600" />
                                  )}
                                </span>
                                <span className="capitalize">{category}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Price Range */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Price Range
                        </h3>
                        <div className="mt-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              ${priceRange[0]}
                            </span>
                            <span className="text-sm text-gray-500">
                              ${priceRange[1]}
                            </span>
                          </div>
                          <div className="relative">
                            <input
                              type="range"
                              min="0"
                              max="200"
                              step="10"
                              value={priceRange[1]}
                              onChange={(e) =>
                                setPriceRange([
                                  priceRange[0],
                                  parseInt(e.target.value),
                                ])
                              }
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setPriceRange([0, 50])}
                              className={`px-3 py-1 text-xs rounded cursor-pointer ${
                                priceRange[1] === 50
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }`}
                            >
                              Under $50
                            </button>
                            <button
                              onClick={() => setPriceRange([50, 100])}
                              className={`px-3 py-1 text-xs rounded cursor-pointer ${
                                priceRange[0] === 50 && priceRange[1] === 100
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }`}
                            >
                              $50 - $100
                            </button>
                            <button
                              onClick={() => setPriceRange([100, 200])}
                              className={`px-3 py-1 text-xs rounded cursor-pointer ${
                                priceRange[0] === 100
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }`}
                            >
                              $100+
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Apply filters button */}
                    <div className="mt-8">
                      <button
                        onClick={() => setShowFilters(false)}
                        className="w-full bg-emerald-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors cursor-pointer"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Cart sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 overflow-hidden z-50">
          <div className="absolute inset-0 overflow-hidden">
            {/* Background overlay */}
            <div
              className="absolute inset-0 bg-white bg-opacity-50 backdrop-blur-md transition-opacity duration-300"
              onClick={() => setCartOpen(false)}
            />

            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              {/* Slide-in panel */}
              <div className="w-screen max-w-md transform transition-transform duration-300 ease-in-out translate-x-0">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                  <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900 flex items-center">
                        <ShoppingCart className="h-5 w-5 text-emerald-500 mr-2" />
                        Your Shopping Cart
                      </h2>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="-m-2 p-2 text-gray-400 hover:text-gray-500 transition-colors"
                          onClick={() => setCartOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flow-root">
                        {cart.length === 0 ? (
                          <div className="text-center py-12">
                            <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center">
                              <ShoppingCart className="h-10 w-10 text-gray-300" />
                            </div>
                            <h3 className="mt-6 text-lg font-medium text-gray-900">
                              Your cart is empty
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                              Add beautiful flowers to your cart to get started.
                            </p>
                            <div className="mt-6">
                              <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors cursor-pointer"
                                onClick={() => {
                                  setCartOpen(false);
                                  setView("products");
                                }}
                              >
                                Continue Shopping
                              </button>
                            </div>
                          </div>
                        ) : (
                          <ul className="-my-6 divide-y divide-gray-200">
                            {cart.map((item) => (
                              <li
                                key={item.product.id}
                                className="py-6 flex animate-fade-in"
                              >
                                <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                  <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-full h-full object-center object-cover"
                                  />
                                </div>

                                <div className="ml-4 flex-1 flex flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <a
                                          href="#"
                                          className="hover:text-emerald-600 transition-colors"
                                        >
                                          {item.product.name}
                                        </a>
                                      </h3>
                                      <p className="ml-4">
                                        $
                                        {(
                                          item.product.price * item.quantity
                                        ).toFixed(2)}
                                      </p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500 capitalize">
                                      {item.product.category}
                                    </p>
                                  </div>
                                  <div className="flex-1 flex items-end justify-between text-sm">
                                    <div className="flex w-fit items-center border rounded-md shadow-sm bg-gray-50">
                                      <button
                                        type="button"
                                        className="px-3 py-1 text-gray-600 hover:text-gray-700 focus:outline-none transition-colors cursor-pointer"
                                        onClick={() =>
                                          updateCartItemQuantity(
                                            item.product.id,
                                            item.quantity - 1
                                          )
                                        }
                                      >
                                        -
                                      </button>
                                      <span className="px-3 py-1 text-gray-700">
                                        {item.quantity}
                                      </span>
                                      <button
                                        type="button"
                                        className="px-3 py-1 text-gray-600 hover:text-gray-700 focus:outline-none transition-colors cursor-pointer"
                                        onClick={() =>
                                          updateCartItemQuantity(
                                            item.product.id,
                                            item.quantity + 1
                                          )
                                        }
                                      >
                                        +
                                      </button>
                                    </div>

                                    <div className="flex">
                                      <button
                                        type="button"
                                        className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors cursor-pointer"
                                        onClick={() =>
                                          removeFromCart(item.product.id)
                                        }
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  {cart.length > 0 && (
                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6 bg-gray-50">
                      <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                        <p>Subtotal</p>
                        <p>${cartTotal.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <p>Shipping</p>
                        <p>Calculated at checkout</p>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mb-4">
                        <p>Tax</p>
                        <p>Calculated at checkout</p>
                      </div>
                      <div className="mt-6">
                        <button
                          onClick={() => {
                            setCartOpen(false);
                            setView("checkout");
                          }}
                          className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 w-full transition-colors cursor-pointer"
                        >
                          Checkout
                        </button>
                      </div>
                      <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                        <p>
                          or{" "}
                          <button
                            type="button"
                            className="text-emerald-600 font-medium hover:text-emerald-500 transition-colors cursor-pointer"
                            onClick={() => setCartOpen(false)}
                          >
                            Continue Shopping<span aria-hidden="true"> →</span>
                          </button>
                        </p>
                      </div>
                      {userInfo.isLoggedIn ? (
                        <div className="mt-6 flex items-center justify-center bg-emerald-50 p-3 rounded-md">
                          <Check className="h-5 w-5 text-emerald-500 mr-2" />
                          <p className="text-sm text-emerald-800">
                            Signed in as {userInfo.username}
                          </p>
                        </div>
                      ) : (
                        <div className="mt-6 flex items-center justify-center bg-gray-100 p-3 rounded-md">
                          <button
                            onClick={() => {
                              setCartOpen(false);
                              setLoginModalOpen(true);
                            }}
                            className="text-sm text-gray-700 hover:text-emerald-600 cursor-pointer"
                          >
                            Sign in for a faster checkout
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="w-full">
        {view === "products" && (
          <>
            {/* Hero Section */}
            <section className="pt-4 md:pt-0 relative bg-gradient-to-r from-emerald-50 to-emerald-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-36">
                <div className="md:flex md:items-center">
                  <div className="md:w-1/2 md:pr-12 animate-on-scroll opacity-0">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
                      Beautiful Blooms,{" "}
                      <span className="text-emerald-600">Delivered</span>
                    </h1>
                    <p className="mt-6 text-xl text-gray-600">
                      From garden fresh blooms to artisanal arrangements,
                      discover nature's finest at Bloom & Co.
                    </p>
                    <div className="mt-8 flex flex-row">
                      <div className="rounded-md shadow w-fit">
                        <button
                          onClick={() => {
                            const element =
                              document.getElementById("shop-section");
                            element?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 md:py-4 md:text-lg md:px-10 transition-colors cursor-pointer"
                        >
                          Shop Now
                        </button>
                      </div>
                      <div className="ml-3">
                        <button
                          className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 md:py-4 md:text-lg md:px-10 transition-colors cursor-pointer"
                          onClick={() => {
                            const element =
                              document.getElementById("featured-section");
                            element?.scrollIntoView({ behavior: "smooth" });
                          }}
                        >
                          Featured
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-12 md:mt-0 md:w-1/2 animate-on-scroll opacity-0">
                    {/* loveleen */}
                    <img
                      className="rounded-lg shadow-xl transform  transition-transform hover:scale-105 duration-500"
                      src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=480"
                      alt="Beautiful flower bouquet"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="bg-white py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md animate-on-scroll opacity-0">
                    <RefreshCw className="h-10 w-10 text-emerald-500" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      Always Fresh
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      Our flowers are sourced daily from local growers to ensure
                      maximum freshness and longevity.
                    </p>
                  </div>
                  <div
                    className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md animate-on-scroll opacity-0"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <TrendingUp className="h-10 w-10 text-emerald-500" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      Artisan Quality
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      Each arrangement is handcrafted by our expert florists
                      with an eye for detail and beauty.
                    </p>
                  </div>
                  <div
                    className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md animate-on-scroll opacity-0"
                    style={{ animationDelay: "0.4s" }}
                  >
                    <Clock className="h-10 w-10 text-emerald-500" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      Fast Delivery
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      Same-day delivery available for orders placed before 1pm
                      in most service areas.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Products */}
            <section
              id="featured-section"
              ref={featuredRef}
              className="bg-gray-50 py-16"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl animate-on-scroll opacity-0">
                    Featured Collections
                  </h2>
                  <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 animate-on-scroll opacity-0">
                    Our most popular arrangements, handpicked by our expert
                    florists.
                  </p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                  {featuredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="relative bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-md animate-on-scroll opacity-0"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="aspect-[1/1]">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-center object-cover group-hover:opacity-75"
                        />
                        <div className="absolute top-2 right-2">
                          <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Featured
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {product.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 capitalize">
                              {product.category}
                            </p>
                          </div>
                          <p className="text-lg font-medium text-gray-900">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-200"
                              }`}
                              fill={
                                i < Math.floor(product.rating)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          ))}
                          <span className="ml-1 text-sm text-gray-500">
                            {product.rating}
                          </span>
                        </div>
                        <button
                          onClick={() => addToCart(product)}
                          className="mt-4 w-full bg-emerald-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors cursor-pointer"
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Shop Section with Filters */}
            <section id="shop-section" className="py-16" ref={productGridRef}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl animate-on-scroll opacity-0">
                    Our Collection
                  </h2>
                  <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 animate-on-scroll opacity-0">
                    Browse our extensive selection of beautiful blooms and
                    arrangements.
                  </p>
                </div>

                {/* Mobile filter dialog */}
                <div className="flex items-center justify-between mt-8 md:hidden">
                  <button
                    type="button"
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-emerald-700 cursor-pointer"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="flex-shrink-0 mr-1 h-5 w-5" />
                    <span>Filters</span>
                  </button>
                </div>

                {/* Responsive search bar for Our Collection */}
                <div className="mt-8 max-w-md mx-auto">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      placeholder="Search our collection..."
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-8 md:grid md:grid-cols-4 md:gap-x-8 md:gap-y-10">
                  {/* Filters (desktop) */}
                  <div className="hidden md:block md:col-span-1">
                    <div className="space-y-6">
                      {/* Categories */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Categories
                        </h3>
                        <ul className="mt-4 space-y-2">
                          {categories.map((category) => (
                            <li key={category} className="flex items-center">
                                                              <button
                                  onClick={() => setSelectedCategory(category)}
                                  className={`group flex items-center text-sm cursor-pointer ${
                                    selectedCategory === category
                                      ? "font-medium text-emerald-600"
                                      : "text-gray-600 hover:text-emerald-600"
                                  }`}
                              >
                                <span
                                  className={`mr-3 h-5 w-5 border rounded-full flex items-center justify-center ${
                                    selectedCategory === category
                                      ? "border-emerald-600"
                                      : "border-gray-300 group-hover:border-emerald-600"
                                  }`}
                                >
                                  {selectedCategory === category && (
                                    <span className="h-3 w-3 rounded-full bg-emerald-600" />
                                  )}
                                </span>
                                <span className="capitalize">{category}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Price Range */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Price Range
                        </h3>
                        <div className="mt-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              ${priceRange[0]}
                            </span>
                            <span className="text-sm text-gray-500">
                              ${priceRange[1]}
                            </span>
                          </div>
                          <div className="relative">
                            <input
                              type="range"
                              min="0"
                              max="200"
                              step="10"
                              value={priceRange[1]}
                              onChange={(e) =>
                                setPriceRange([
                                  priceRange[0],
                                  parseInt(e.target.value),
                                ])
                              }
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setPriceRange([0, 50])}
                              className={`px-3 py-1 text-xs rounded cursor-pointer ${
                                priceRange[1] === 50
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }`}
                            >
                              Under $50
                            </button>
                            <button
                              onClick={() => setPriceRange([50, 100])}
                              className={`px-3 py-1 text-xs rounded cursor-pointer ${
                                priceRange[0] === 50 && priceRange[1] === 100
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }`}
                            >
                              $50 - $100
                            </button>
                            <button
                              onClick={() => setPriceRange([100, 200])}
                              className={`px-3 py-1 text-xs rounded cursor-pointer ${
                                priceRange[0] === 100
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }`}
                            >
                              $100+
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Login Modal */}
                  {loginModalOpen && (
                    <div className="fixed inset-0 overflow-y-auto z-50">
                      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                          className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-md transition-opacity z-40"
                          onClick={() => setLoginModalOpen(false)}
                        />

                        <span
                          className="hidden sm:inline-block sm:align-middle sm:h-screen"
                          aria-hidden="true"
                        >
                          &#8203;
                        </span>

                        <div className=" inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left z-50 relative overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
                          <div className="absolute top-0 right-0 pt-4 pr-4">
                            <button
                              type="button"
                              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                              onClick={() => setLoginModalOpen(false)}
                            >
                              <span className="sr-only">Close</span>
                              <X className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>

                          <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                              <h3 className="text-lg leading-6 font-medium text-gray-900 text-center mb-6">
                                Sign in to your account
                              </h3>

                              <form
                                className="space-y-6"
                                onSubmit={handleLogin}
                              >
                                <div>
                                  <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Username
                                  </label>
                                  <div className="mt-1">
                                    <input
                                      id="username"
                                      name="username"
                                      type="text"
                                      autoComplete="username"
                                      required
                                      value={loginCredentials.username}
                                      onChange={handleLoginCredentialChange}
                                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                      placeholder="Enter your username"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Password
                                  </label>
                                  <div className="mt-1">
                                    <input
                                      id="password"
                                      name="password"
                                      type="password"
                                      autoComplete="current-password"
                                      required
                                      value={loginCredentials.password}
                                      onChange={handleLoginCredentialChange}
                                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                      placeholder="Enter your password"
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <input
                                      id="remember-me"
                                      name="remember-me"
                                      type="checkbox"
                                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                    />
                                    <label
                                      htmlFor="remember-me"
                                      className="ml-2 block text-sm text-gray-900"
                                    >
                                      Remember me
                                    </label>
                                  </div>
                                </div>

                                <div>
                                  <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 cursor-pointer"
                                  >
                                    Sign in
                                  </button>
                                </div>
                              </form>

                              <div className="mt-6"></div>

                              <div className="mt-6 text-center text-sm">
                                <p className="mt-2 text-xs text-gray-500">
                                  For demo, use: username: "user", password:
                                  "password"
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Product Grid */}
                  <div className="md:col-span-3">
                    {filteredProducts.length === 0 ? (
                      <div className="text-center py-16">
                        <h3 className="text-lg font-medium text-gray-900">
                          No products found
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Try adjusting your filters to find what you're looking
                          for.
                        </p>
                        <button
                          onClick={() => {
                            setSelectedCategory("all");
                            setPriceRange([0, 200]);
                            setSearchQuery("");
                          }}
                          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 cursor-pointer"
                        >
                          Reset Filters
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredProducts.map((product, index) => (
                          <div key={product.id} className="group relative ">
                            <div className="relative w-full h-60 bg-gray-100 rounded-lg overflow-hidden group-hover:opacity-75 transition-opacity">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-center object-cover"
                              />
                              <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                <div className="transform opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                  <button
                                    onClick={() => addToCart(product)}
                                    className="bg-white bg-opacity-90 rounded-full p-3 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
                                  >
                                    <ShoppingCart className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                              {product.featured && (
                                <div className="absolute top-2 right-2">
                                  <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                    Featured
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="mt-4 flex justify-between">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                  {product.name}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 capitalize">
                                  {product.category}
                                </p>
                                <div className="mt-1 flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < Math.floor(product.rating)
                                          ? "text-yellow-400"
                                          : "text-gray-200"
                                      }`}
                                      fill={
                                        i < Math.floor(product.rating)
                                          ? "currentColor"
                                          : "none"
                                      }
                                    />
                                  ))}
                                  <span className="ml-1 text-sm text-gray-500">
                                    {product.rating}
                                  </span>
                                </div>
                              </div>
                              <p className="text-lg font-medium text-gray-900">
                                ${product.price.toFixed(2)}
                              </p>
                            </div>
                            <button
                              onClick={() => addToCart(product)}
                              className="mt-4 w-full bg-emerald-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors cursor-pointer"
                            >
                              Add to cart
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Newsletter */}
            <section className="bg-emerald-700 py-16" id="join">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:flex lg:items-center lg:justify-between">
                  <div className="lg:w-1/2 animate-on-scroll opacity-0">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                      Join our floral community
                    </h2>
                    <p className="mt-3 max-w-3xl text-lg text-emerald-100">
                      Subscribe to our newsletter for seasonal tips, exclusive
                      offers, and early access to special collections.
                    </p>
                  </div>
                  <div
                    className="mt-8 lg:mt-0 lg:w-1/2 animate-on-scroll opacity-0"
                    style={{ animationDelay: "0.2s" }}
                  >
                    {isNewsletterSubscribed ? (
                      <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                        <div className="flex items-center text-green-600">
                          <Check className="h-6 w-6 mr-2" />
                          <p>Thank you for subscribing to our newsletter!</p>
                        </div>
                      </div>
                    ) : (
                      <form
                        onSubmit={handleNewsletterSubmit}
                        className="sm:flex"
                      >
                        <label htmlFor="email-address" className="sr-only">
                          Email address
                        </label>
                        <input
                          id="email-address"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          className="w-full px-5 py-3 border bg-white border-transparent placeholder-gray-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-emerald-700 focus:ring-white focus:border-white sm:max-w-xs rounded-md"
                          placeholder="Enter your email"
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                        />
                        <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                          <button
                            type="submit"
                            className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-emerald-600 bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emerald-700 focus:ring-white cursor-pointer"
                          >
                            Subscribe
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {view === "checkout" && (
          <div className="pt-16 pb-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl mx-auto lg:max-w-none">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Checkout
                </h1>

                <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
                  <section
                    aria-labelledby="cart-heading"
                    className="lg:col-span-7"
                  >
                    <h2 id="cart-heading" className="sr-only">
                      Items in your shopping cart
                    </h2>

                    <ul className="border-t border-b border-gray-200 divide-y divide-gray-200">
                      {cart.map((item, itemIdx) => (
                        <li
                          key={item.product.id}
                          className="flex py-6 sm:py-10"
                        >
                          <div className="flex-shrink-0">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-24 h-24 rounded-md object-center object-cover sm:w-32 sm:h-32"
                            />
                          </div>

                          <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                            <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                              <div>
                                <div className="flex justify-between">
                                  <h3 className="text-sm">
                                    <a
                                      href="#"
                                      className="font-medium text-gray-700 hover:text-gray-800"
                                    >
                                      {item.product.name}
                                    </a>
                                  </h3>
                                </div>
                                <div className="mt-1 flex text-sm">
                                  <p className="text-gray-500 capitalize">
                                    {item.product.category}
                                  </p>
                                </div>
                                <p className="mt-1 text-sm font-medium text-gray-900">
                                  ${item.product.price.toFixed(2)}
                                </p>
                              </div>

                              <div className="mt-4 sm:mt-0 sm:pr-9">
                                <div className="flex w-fit items-center border rounded">
                                  <button
                                    type="button"
                                    className="px-3 py-1 text-gray-600 hover:text-gray-700 focus:outline-none transition-colors cursor-pointer"
                                    onClick={() =>
                                      updateCartItemQuantity(
                                        item.product.id,
                                        item.quantity - 1
                                      )
                                    }
                                  >
                                    -
                                  </button>
                                  <span className="px-3 py-1 text-gray-700">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    className="px-3 py-1 text-gray-600 hover:text-gray-700 focus:outline-none transition-colors cursor-pointer"
                                    onClick={() =>
                                      updateCartItemQuantity(
                                        item.product.id,
                                        item.quantity + 1
                                      )
                                    }
                                  >
                                    +
                                  </button>
                                </div>

                                <div className="absolute top-0 right-0">
                                  <button
                                    type="button"
                                    className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500 cursor-pointer"
                                    onClick={() =>
                                      removeFromCart(item.product.id)
                                    }
                                  >
                                    <span className="sr-only">Remove</span>
                                    <X className="h-5 w-5" aria-hidden="true" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            <p className="mt-4 flex text-sm text-gray-700 space-x-2">
                              <Check
                                className="flex-shrink-0 h-5 w-5 text-green-500"
                                aria-hidden="true"
                              />
                              <span>In stock and ready to ship</span>
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Order summary */}
                  <section
                    aria-labelledby="summary-heading"
                    className="mt-16 bg-white rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
                  >
                    <h2
                      id="summary-heading"
                      className="text-lg font-medium text-gray-900"
                    >
                      Order summary
                    </h2>

                    <dl className="mt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <dt className="text-sm text-gray-600">Subtotal</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          ${cartTotal.toFixed(2)}
                        </dd>
                      </div>
                      <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                        <dt className="text-sm text-gray-600">
                          Shipping estimate
                        </dt>
                        <dd className="text-sm font-medium text-gray-900">
                          $5.99
                        </dd>
                      </div>
                      <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                        <dt className="text-sm text-gray-600">Tax estimate</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          ${(cartTotal * 0.07).toFixed(2)}
                        </dd>
                      </div>
                      <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                        <dt className="text-base font-medium text-gray-900">
                          Order total
                        </dt>
                        <dd className="text-base font-medium text-gray-900">
                          ${(cartTotal + 5.99 + cartTotal * 0.07).toFixed(2)}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-6">
                      <form onSubmit={handleCheckout}>
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                              Contact Information
                            </h3>
                            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                              <div>
                                <label
                                  htmlFor="firstName"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  First name
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    autoComplete="given-name"
                                    required
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 py-2 px-3 sm:text-sm"
                                    value={customerInfo.firstName}
                                    onChange={handleCustomerInfoChange}
                                  />
                                </div>
                              </div>

                              <div>
                                <label
                                  htmlFor="lastName"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Last name
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    autoComplete="family-name"
                                    required
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 py-2 px-3 sm:text-sm"
                                    value={customerInfo.lastName}
                                    onChange={handleCustomerInfoChange}
                                  />
                                </div>
                              </div>

                              <div className="sm:col-span-2">
                                <label
                                  htmlFor="email"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Email address
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 py-2 px-3 sm:text-sm"
                                    value={customerInfo.email}
                                    onChange={handleCustomerInfoChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                              Shipping Information
                            </h3>

                            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                              <div className="sm:col-span-2">
                                <label
                                  htmlFor="address"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Address
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    autoComplete="street-address"
                                    required
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 py-2 px-3 sm:text-sm"
                                    value={customerInfo.address}
                                    onChange={handleCustomerInfoChange}
                                  />
                                </div>
                              </div>

                              <div>
                                <label
                                  htmlFor="city"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  City
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    autoComplete="address-level2"
                                    required
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 py-2 px-3 sm:text-sm"
                                    value={customerInfo.city}
                                    onChange={handleCustomerInfoChange}
                                  />
                                </div>
                              </div>

                              <div>
                                <label
                                  htmlFor="zipCode"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Zip / Postal code
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="text"
                                    id="zipCode"
                                    name="zipCode"
                                    autoComplete="postal-code"
                                    required
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 py-2 px-3 sm:text-sm"
                                    value={customerInfo.zipCode}
                                    onChange={handleCustomerInfoChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                              Payment Information
                            </h3>

                            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                              <div className="sm:col-span-2">
                                <label
                                  htmlFor="cardNumber"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Card number
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CreditCard
                                      className="h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <input
                                    type="text"
                                    id="cardNumber"
                                    name="cardNumber"
                                    autoComplete="cc-number"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                    placeholder="**** **** **** ****"
                                    value={customerInfo.cardNumber}
                                    onChange={handleCustomerInfoChange}
                                  />
                                </div>
                              </div>

                              <div>
                                <label
                                  htmlFor="cardExpiry"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Expiration date (MM/YY)
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="text"
                                    id="cardExpiry"
                                    name="cardExpiry"
                                    autoComplete="cc-exp"
                                    required
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 py-2 px-3 sm:text-sm"
                                    placeholder="MM/YY"
                                    value={customerInfo.cardExpiry}
                                    onChange={handleCustomerInfoChange}
                                  />
                                </div>
                              </div>

                              <div>
                                <label
                                  htmlFor="cardCVC"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  CVC
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="text"
                                    id="cardCVC"
                                    name="cardCVC"
                                    autoComplete="cc-csc"
                                    required
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 py-2 px-3 sm:text-sm"
                                    placeholder="***"
                                    value={customerInfo.cardCVC}
                                    onChange={handleCustomerInfoChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8">
                          <button
                            type="submit"
                            className="w-full bg-emerald-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 cursor-pointer"
                          >
                            Complete order
                          </button>
                        </div>
                      </form>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "success" && (
          <div className="pt-24 pb-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-6">
                  <Check className="h-8 w-8 text-emerald-600" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Order Successful!
                </h1>
                <p className="mt-4 text-lg text-gray-500">
                  Thank you for your purchase. Your order confirmation has been
                  sent to your email.
                </p>
                <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-left">
                    <h2 className="text-lg font-medium text-gray-900 border-b pb-2">
                      Order Summary
                    </h2>
                    <dl className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Order number</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          BC-{Math.floor(Math.random() * 10000)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Order date</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {new Date().toLocaleDateString()}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Items</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {cartItemCount}
                        </dd>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                        <dt className="text-sm font-medium text-gray-900">
                          Total
                        </dt>
                        <dd className="text-sm font-medium text-gray-900">
                          ${(cartTotal + 5.99 + cartTotal * 0.07).toFixed(2)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                <div className="mt-8">
                  <button
                    onClick={() => setView("products")}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-16">
            <div className="space-y-8 xl:col-span-1">
              <div className="text-white text-2xl font-bold">Bloom & Co.</div>
              <p className="text-gray-300 text-base">
                Bringing nature's beauty to your doorstep since 2010.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
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
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-6 w-6"
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
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8 ">
                <div>
                  <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                    Shop
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a
                        href="#"
                        className="text-base text-gray-400 hover:text-gray-300"
                      >
                        Bouquets
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base text-gray-400 hover:text-gray-300"
                      >
                        Plants
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base text-gray-400 hover:text-gray-300"
                      >
                        Gifts
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base text-gray-400 hover:text-gray-300"
                      >
                        Occasions
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                    Support
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a
                        href="#"
                        className="text-base text-gray-400 hover:text-gray-300"
                      >
                        Flower Care
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base text-gray-400 hover:text-gray-300"
                      >
                        Delivery
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base text-gray-400 hover:text-gray-300"
                      >
                        Returns
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base text-gray-400 hover:text-gray-300"
                      >
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                    Company
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a
                        href="#"
                        className="text-base text-gray-400 hover:text-gray-300"
                      >
                        About
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base text-gray-400 hover:text-gray-300"
                      >
                        Blog
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base text-gray-400 hover:text-gray-300"
                      >
                        Careers
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base text-gray-400 hover:text-gray-300"
                      >
                        Press
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-base text-gray-400 md:flex md:justify-between">
              <span>&copy; 2025 Bloom & Co. All rights reserved.</span>
              <span className="mt-2 md:mt-0 block md:inline">
                <a href="#" className="text-gray-400 hover:text-gray-300 mr-4">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300 mr-4">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  Accessibility
                </a>
              </span>
            </p>
          </div>
        </div>
      </footer>

      {/* Custom styles */}
      <style jsx global>{`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Open+Sans:wght@300;400;600;700&display=swap');

        body {
          font-family: "Roboto", sans-serif;
        }

        .sticky-header {
          background-color: rgba(255, 255, 255, 0.98);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(5px);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-on-scroll {
          transition: opacity 0.4s ease-out, transform 0.4s ease-out;
        }

        /* Enhanced Responsive Styling */
        @media (max-width: 640px) {
          .responsive-grid {
            grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
          }
        }

        /* Custom search input styling */
        input[type="search"]::-webkit-search-decoration,
        input[type="search"]::-webkit-search-cancel-button,
        input[type="search"]::-webkit-search-results-button,
        input[type="search"]::-webkit-search-results-decoration {
          display: none;
        }

        /* Smooth transitions */
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 300ms;
        }

        /* Improved button hover effects */
        .btn-hover-effect:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
      `}</style>
    </div>
  );
}
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
  Truck,
  Clock,
  Shield,
  Mail,
  Send,
  ChevronRight,
  Filter,
  Tag,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  mainCategory: string;
  subCategory: string;
  rating: number;
  featured: boolean;
  description: string;
  inStock: boolean;
  colors?: string[];
  sizes?: string[];
  discount?: number;
};

type CartItem = {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
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

// Main component
export default function ClotheShop() {
  // Products data
  const products: Product[] = [
    {
      id: 1,
      name: "Premium  T-Shirt",
      price: 29.99,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500",
      mainCategory: "male",
      subCategory: "t-shirts",
      rating: 4.8,
      featured: true,
      description:
        "Ultra-soft premium cotton t-shirt with a modern fit. Perfect for everyday wear.",
      inStock: true,
      colors: ["Black", "White", "Navy"],
      sizes: ["S", "M", "L", "XL"],
      discount: 0,
    },
    {
      id: 2,
      name: "Slim Fit Denim Jeans",
      price: 59.99,
      image:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500",
      mainCategory: "male",
      subCategory: "jeans",
      rating: 4.7,
      featured: true,
      description:
        "Classic slim-fit jeans in premium denim with just the right amount of stretch for comfort.",
      inStock: true,
      colors: ["Dark Blue", "Black", "Light Blue"],
      sizes: ["30", "32", "34", "36"],
      discount: 15,
    },
    {
      id: 3,
      name: "Structured Blazer",
      price: 89.99,
      image:
        "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500",
      mainCategory: "male",
      subCategory: "outerwear",
      rating: 4.9,
      featured: true,
      description:
        "A timeless structured blazer that transitions perfectly from office to evening events.",
      inStock: true,
      colors: ["Navy", "Charcoal", "Black"],
      sizes: ["S", "M", "L", "XL"],
      discount: 0,
    },
    {
      id: 4,
      name: "Casual Linen Shirt",
      price: 45.99,
      image:
        "https://images.unsplash.com/photo-1626497764746-6dc36546b388?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500",
      mainCategory: "male",
      subCategory: "shirts",
      rating: 4.6,
      featured: false,
      description:
        "Breathable linen shirt with a relaxed fit, perfect for warm weather and casual occasions.",
      inStock: true,
      colors: ["White", "Beige", "Light Blue"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      discount: 10,
    },
    {
      id: 5,
      name: "Leather Minimalist Wallet",
      price: 39.99,
      image:
        "https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500",
      mainCategory: "male",
      subCategory: "accessories",
      rating: 4.5,
      featured: false,
      description:
        "Sleek, genuine leather wallet with RFID protection and smart storage for your essentials.",
      inStock: true,
      colors: ["Brown", "Black", "Tan"],
      sizes: ["M"],
      discount: 0,
    },
    {
      id: 6,
      name: "Technical Running Jacket",
      price: 79.99,
      image:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500",
      mainCategory: "male",
      subCategory: "outerwear",
      rating: 4.7,
      featured: false,
      description:
        "Waterproof, breathable jacket with reflective details, perfect for outdoor activities in any weather.",
      inStock: true,
      colors: ["Black", "Blue", "Red"],
      sizes: ["S", "M", "L", "XL"],
      discount: 20,
    },
    {
      id: 7,
      name: "Floral Summer Dress",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1630955110816-6fbcd2b87de4?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500",
      mainCategory: "female",
      subCategory: "dresses",
      rating: 4.8,
      featured: true,
      description:
        "Light and flowy floral dress, perfect for summer days and special occasions.",
      inStock: true,
      colors: ["Floral Print", "Blue Floral", "Pink Floral"],
      sizes: ["XS", "S", "M", "L"],
      discount: 0,
    },
    {
      id: 8,
      name: "High-Waisted Skinny Jeans",
      price: 54.99,
      image:
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500",
      mainCategory: "female",
      subCategory: "jeans",
      rating: 4.9,
      featured: false,
      description:
        "Flattering high-waisted skinny jeans with the perfect amount of stretch for all-day comfort.",
      inStock: true,
      colors: ["Dark Wash", "Black", "Medium Wash"],
      sizes: ["24", "26", "28", "30", "32"],
      discount: 0,
    },
    {
      id: 9,
      name: "Silk Blouse",
      price: 69.99,
      image:
        "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500",
      mainCategory: "female",
      subCategory: "tops",
      rating: 5.0,
      featured: true,
      description:
        "Luxurious silk blouse with a relaxed fit and elegant drape. Perfect for work or evenings out.",
      inStock: true,
      colors: ["Ivory", "Black", "Blush"],
      sizes: ["XS", "S", "M", "L", "XL"],
      discount: 10,
    },
    {
      id: 10,
      name: "Leather Tote Bag",
      price: 129.99,
      image:
        "https://images.unsplash.com/photo-1591561954557-26941169b49e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500",
      mainCategory: "female",
      subCategory: "accessories",
      rating: 4.8,
      featured: true,
      description:
        "Spacious genuine leather tote with interior organization pockets and durable hardware.",
      inStock: true,
      colors: ["Tan", "Black", "Brown"],
      sizes: ["M"],
      discount: 15,
    },
    {
      id: 11,
      name: "Wrap Midi Dress",
      price: 59.99,
      image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500",
      mainCategory: "female",
      subCategory: "dresses",
      rating: 4.7,
      featured: false,
      description:
        "Flattering wrap style midi dress in a lightweight fabric, suitable for multiple occasions.",
      inStock: true,
      colors: ["Navy", "Emerald", "Burgundy"],
      sizes: ["XS", "S", "M", "L", "XL"],
      discount: 0,
    },
    {
      id: 12,
      name: "Wool-Blend Cardigan",
      price: 64.99,
      image:
        "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500",
      mainCategory: "female",
      subCategory: "outerwear",
      rating: 4.6,
      featured: false,
      description:
        "Cozy yet elegant wool-blend cardigan, perfect for layering during cooler months.",
      inStock: true,
      colors: ["Gray", "Camel", "Black"],
      sizes: ["S", "M", "L", "XL"],
      discount: 0,
    },
    {
      id: 13,
      name: "Graphic Print T-Shirt",
      price: 24.99,
      image:
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500",
      mainCategory: "male",
      subCategory: "t-shirts",
      rating: 4.5,
      featured: false,
      description:
        "Bold graphic t-shirt made from organic cotton with a comfortable relaxed fit.",
      inStock: true,
      colors: ["White", "Black", "Gray"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      discount: 0,
    },
    {
      id: 14,
      name: "Cropped Denim Jacket",
      price: 69.99,
      image:
        "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500",
      mainCategory: "female",
      subCategory: "outerwear",
      rating: 4.7,
      featured: false,
      description:
        "Versatile cropped denim jacket with slight distressing for an effortlessly cool look.",
      inStock: true,
      colors: ["Light Wash", "Dark Wash", "Black"],
      sizes: ["XS", "S", "M", "L"],
      discount: 0,
    },
    {
      id: 15,
      name: "Patterned Button-Up Shirt",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500",
      mainCategory: "male",
      subCategory: "shirts",
      rating: 4.4,
      featured: false,
      description:
        "Modern fit button-up shirt with subtle pattern, perfect for casual and semi-formal occasions.",
      inStock: true,
      colors: ["Navy Pattern", "White Pattern", "Gray Pattern"],
      sizes: ["S", "M", "L", "XL"],
      discount: 5,
    },
    {
      id: 16,
      name: "Pleated Midi Skirt",
      price: 45.99,
      image:
        "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=500",
      mainCategory: "female",
      subCategory: "bottoms",
      rating: 4.6,
      featured: false,
      description:
        "Elegant pleated midi skirt with fluid movement, easily dressed up or down.",
      inStock: true,
      colors: ["Black", "Cream", "Burgundy"],
      sizes: ["XS", "S", "M", "L", "XL"],
      discount: 0,
    },
  ];

  // State management
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<
    "products" | "cart" | "checkout" | "success"
  >("products");
  const [selectedMainCategory, setSelectedMainCategory] =
    useState<string>("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");
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
    username: "sarah@gmail.com",
    password: "password",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState<{[key: number]: string}>({});
  const [selectedSizes, setSelectedSizes] = useState<{[key: number]: string}>({});

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Refs
  const headerRef = useRef<HTMLDivElement>(null);
  const productGridRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  // Calculate cart totals
  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      item.product.price *
        (1 - (item.product.discount || 0) / 100) *
        item.quantity,
    0
  );
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Filter and search products
  const filteredProducts = products.filter((product) => {
    const matchesMainCategory =
      selectedMainCategory === "all" ||
      product.mainCategory === selectedMainCategory;
    const matchesSubCategory =
      selectedSubCategory === "all" ||
      product.subCategory === selectedSubCategory;
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.mainCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.subCategory.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      matchesMainCategory && matchesSubCategory && matchesPrice && matchesSearch
    );
  });

  // Featured products
  const featuredProducts = products.filter((product) => product.featured);

  // Get unique main categories and subcategories
  const mainCategories = [
    "all",
    ...Array.from(new Set(products.map((product) => product.mainCategory))),
  ];

  // Get subcategories based on selected main category
  const getSubCategories = () => {
    if (selectedMainCategory === "all") {
      return [
        "all",
        ...Array.from(new Set(products.map((product) => product.subCategory))),
      ];
    }
    return [
      "all",
      ...Array.from(
        new Set(
          products
            .filter((product) => product.mainCategory === selectedMainCategory)
            .map((product) => product.subCategory)
        )
      ),
    ];
  };

  const subCategories = getSubCategories();

  // Check if product is in cart
  const isProductInCart = (productId: number): boolean => {
    return cart.some((item) => item.product.id === productId);
  };

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation - in a real app, you would authenticate with an API
    if (loginCredentials.username && loginCredentials.password) {
      // Extract name from email (everything before @)
      const emailParts = loginCredentials.username.split('@');
      const name = emailParts[0];
      // Capitalize first letter
      const fullName = name.charAt(0).toUpperCase() + name.slice(1);
      
      setUserInfo({
        username: loginCredentials.username,
        fullName: fullName,
        email: loginCredentials.username,
        isLoggedIn: true,
      });
      setLoginModalOpen(false);
      // Reset login form
      setLoginCredentials({ username: "", password: "" });
    } else {
      alert("Please enter both email and password");
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
  const addToCart = (product: Product) => {
    let color = selectedColors[product.id] || product.colors?.[0];
    let size = selectedSizes[product.id] || product.sizes?.[0];

    // If no color is selected but product has colors, select the first one
    if (!color && product.colors && product.colors.length > 0) {
      color = product.colors[0];
    }

    // If no size is selected but product has sizes, select the first one
    if (!size && product.sizes && product.sizes.length > 0) {
      size = product.sizes[0];
    }

    setCart((prevCart) => {
      // Check if item with same product, color and size already exists
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedSize === size
      );

      if (existingItemIndex !== -1) {
        // Item already in cart, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        // Item not in cart, add it
        return [
          ...prevCart,
          {
            product,
            quantity: 1,
            selectedColor: color,
            selectedSize: size,
          },
        ];
      }
    });

    setCartOpen(true);
    // Reset selections
    setSelectedColors({});
    setSelectedSizes({});
  };

  // Update cart item quantity
  const updateCartItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
      return;
    }

    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart[index].quantity = newQuantity;
      return updatedCart;
    });
  };

  // Remove item from cart
  const removeFromCart = (index: number) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
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

  // Effect Hooks
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

  // Reset subcategory when main category changes
  useEffect(() => {
    setSelectedSubCategory("all");
  }, [selectedMainCategory]);

  // Helper functions
  const getDiscountedPrice = (price: number, discount?: number) => {
    if (!discount) return price;
    return price * (1 - discount / 100);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans"
          style={{ fontFamily: "var(--font-roboto), sans-serif" }}
    >
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
                <span className="text-2xl font-bold text-indigo-600">
                  Urban Threads
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <div
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors"
                onClick={() => setView("products")}
              >
                Home
              </div>
              <div
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors"
                onClick={() => {
                  setView("products");
                  setSelectedMainCategory("male");
                  setSelectedSubCategory("all");
                  setTimeout(() => {
                    const element = document.getElementById("shop-section");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              >
                Men
              </div>
              <div
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors"
                onClick={() => {
                  setView("products");
                  setSelectedMainCategory("female");
                  setSelectedSubCategory("all");
                  setTimeout(() => {
                    const element = document.getElementById("shop-section");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              >
                Women
              </div>
              <div
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors"
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
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors"
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
              {/* User */}
              {userInfo.isLoggedIn ? (
                <div className="ml-4 md:ml-6 relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="p-1 hidden md:flex rounded-full text-gray-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors cursor-pointer"
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
                        className="mt-1 text-xs cursor-pointer text-indigo-600 hover:text-indigo-700"
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
                  className="hidden md:flex items-center ml-4 bg-indigo-600 border border-transparent rounded-md py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors cursor-pointer"
                >
                  Sign in
                </button>
              )}

              {/* Cart */}
              <div className="ml-4 md:ml-6 relative">
                <button
                  className="p-1 rounded-full text-gray-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors cursor-pointer"
                  onClick={() => setCartOpen(true)}
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 -right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-600 rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="ml-4 md:hidden">
                <button
                  onClick={() => setMenuOpen(true)}
                  className="p-2 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors cursor-pointer"
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
            className="fixed inset-0  bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 cursor-pointer"
            onClick={() => setMenuOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            {/* Menu panel */}
            <div className="w-screen max-w-xs bg-white shadow-xl pb-12 flex flex-col overflow-y-auto transform transition-transform duration-300 ease-in-out">
              <div className="px-4 pt-5 pb-2 flex justify-between items-center border-b border-gray-100">
                <span className="text-xl font-bold text-indigo-600">Menu</span>
                <button
                  type="button"
                  className="-m-2 p-2 rounded-md inline-flex items-center justify-center text-gray-400 cursor-pointer"
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
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                      {userInfo.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">
                        {userInfo.fullName}
                      </p>
                      <p className="text-xs text-gray-500">{userInfo.email}</p>
                      <button
                        onClick={handleLogout}
                        className="mt-1 text-xs text-indigo-600 hover:text-indigo-700 cursor-pointer"
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
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                  >
                    Sign in
                  </button>
                )}
              </div>

              {/* Links */}
              <div className="mt-6 px-4 space-y-2">
                <div
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setMenuOpen(false);
                    setView("products");
                    setSelectedMainCategory("all");
                    setTimeout(() => {
                      const element = document.getElementById("home");
                      element?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                >
                  Home
                </div>
                <div
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setMenuOpen(false);
                    setView("products");
                    setSelectedMainCategory("male");
                    setSelectedSubCategory("all");
                    setTimeout(() => {
                      const element = document.getElementById("shop-section");
                      element?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                >
                  Men
                </div>
                <div
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setMenuOpen(false);
                    setView("products");
                    setSelectedMainCategory("female");
                    setSelectedSubCategory("all");
                    setTimeout(() => {
                      const element = document.getElementById("shop-section");
                      element?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                >
                  Women
                </div>
                <div
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 cursor-pointer"
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
                <div
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setMenuOpen(false);
                    setView("products");
                    setTimeout(() => {
                      const element = document.getElementById("join");
                      element?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                >
                  Join
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 py-6 px-4 space-y-6">
                <div className="flex items-center space-x-6">
                  <a href="#" className="text-gray-400 hover:text-gray-300 cursor-pointer">
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
                  <a href="#" className="text-gray-400 hover:text-gray-300 cursor-pointer">
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
                  <a href="#" className="text-gray-400 hover:text-gray-300 cursor-pointer">
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
                  &copy; 2025 Urban Threads. All rights reserved.
                </div>
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
              className="absolute inset-0   bg-opacity-75 backdrop-blur-md transition-opacity duration-300 cursor-pointer"
              onClick={() => setShowFilters(false)}
            />

            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              {/* Slide-in panel */}
              <div className="w-screen max-w-md transform transition-transform duration-300 ease-in-out translate-x-0">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                  <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900 flex items-center">
                        <Filter className="h-5 w-5 text-indigo-500 mr-2" />
                        Filters
                      </h2>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="-m-2 p-2 text-gray-400 hover:text-gray-500 transition-colors cursor-pointer"
                          onClick={() => setShowFilters(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-8 space-y-6">
                      {/* Main Categories */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Main Categories
                        </h3>
                        <ul className="mt-4 space-y-2">
                          {mainCategories.map((category) => (
                            <li key={category} className="flex items-center">
                              <button
                                onClick={() => {
                                  setSelectedMainCategory(category);
                                }}
                                className={`group flex items-center text-sm cursor-pointer ${
                                  selectedMainCategory === category
                                    ? "font-medium text-indigo-600"
                                    : "text-gray-600 hover:text-indigo-600"
                                }`}
                              >
                                <span
                                  className={`mr-3 h-5 w-5 border rounded-full flex items-center justify-center ${
                                    selectedMainCategory === category
                                      ? "border-indigo-600"
                                      : "border-gray-300 group-hover:border-indigo-600"
                                  }`}
                                >
                                  {selectedMainCategory === category && (
                                    <span className="h-3 w-3 rounded-full bg-indigo-600" />
                                  )}
                                </span>
                                <span className="capitalize">{category}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Sub Categories */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Sub Categories
                        </h3>
                        <ul className="mt-4 space-y-2">
                          {subCategories.map((category) => (
                            <li key={category} className="flex items-center">
                              <button
                                onClick={() => {
                                  setSelectedSubCategory(category);
                                }}
                                className={`group flex items-center text-sm cursor-pointer ${
                                  selectedSubCategory === category
                                    ? "font-medium text-indigo-600"
                                    : "text-gray-600 hover:text-indigo-600"
                                }`}
                              >
                                <span
                                  className={`mr-3 h-5 w-5 border rounded-full flex items-center justify-center ${
                                    selectedSubCategory === category
                                      ? "border-indigo-600"
                                      : "border-gray-300 group-hover:border-indigo-600"
                                  }`}
                                >
                                  {selectedSubCategory === category && (
                                    <span className="h-3 w-3 rounded-full bg-indigo-600" />
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
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setPriceRange([0, 50])}
                              className={`px-3 py-1 text-xs rounded cursor-pointer ${
                                priceRange[1] === 50
                                  ? "bg-indigo-100 text-indigo-800"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }`}
                            >
                              Under $50
                            </button>
                            <button
                              onClick={() => setPriceRange([50, 100])}
                              className={`px-3 py-1 text-xs rounded cursor-pointer ${
                                priceRange[0] === 50 && priceRange[1] === 100
                                  ? "bg-indigo-100 text-indigo-800"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }`}
                            >
                              $50 - $100
                            </button>
                            <button
                              onClick={() => setPriceRange([100, 200])}
                              className={`px-3 py-1 text-xs rounded cursor-pointer ${
                                priceRange[0] === 100
                                  ? "bg-indigo-100 text-indigo-800"
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
                        className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors cursor-pointer"
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
              className="absolute inset-0  bg-opacity-75 backdrop-blur-md transition-opacity duration-300 cursor-pointer"
              onClick={() => setCartOpen(false)}
            />

            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              {/* Slide-in panel */}
              <div className="w-screen max-w-md transform transition-transform duration-300 ease-in-out translate-x-0">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                  <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900 flex items-center">
                        <ShoppingCart className="h-5 w-5 text-indigo-500 mr-2" />
                        Your Shopping Bag
                      </h2>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="-m-2 p-2 text-gray-400 hover:text-gray-500 transition-colors cursor-pointer"
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
                              Your bag is empty
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                              Add stylish items to your bag to get started.
                            </p>
                            <div className="mt-6">
                              <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors cursor-pointer"
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
                            {cart.map((item, index) => (
                              <li
                                key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
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
                                          className="hover:text-indigo-600 transition-colors cursor-pointer"
                                        >
                                          {item.product.name}
                                        </a>
                                      </h3>
                                      <p className="ml-4">
                                        $
                                        {(
                                          getDiscountedPrice(
                                            item.product.price,
                                            item.product.discount
                                          ) * item.quantity
                                        ).toFixed(2)}
                                      </p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                      {item.selectedColor &&
                                        `Color: ${item.selectedColor}`}
                                      {item.selectedSize &&
                                        item.selectedColor &&
                                        " / "}
                                      {item.selectedSize &&
                                        `Size: ${item.selectedSize}`}
                                    </p>
                                  </div>
                                  <div className="flex-1 flex items-end justify-between text-sm">
                                    <div className="flex w-fit items-center border rounded-md shadow-sm bg-gray-50">
                                      <button
                                        type="button"
                                        className="px-3 py-1 text-gray-600 hover:text-gray-700 focus:outline-none transition-colors cursor-pointer"
                                        onClick={() =>
                                          updateCartItemQuantity(
                                            index,
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
                                            index,
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
                                        className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors cursor-pointer"
                                        onClick={() => removeFromCart(index)}
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
                          className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 w-full transition-colors cursor-pointer"
                        >
                          Checkout
                        </button>
                      </div>
                      <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                        <p>
                          or{" "}
                          <button
                            type="button"
                            className="text-indigo-600 font-medium hover:text-indigo-500 transition-colors cursor-pointer"
                            onClick={() => setCartOpen(false)}
                          >
                            Continue Shopping<span aria-hidden="true"> →</span>
                          </button>
                        </p>
                      </div>
                      {userInfo.isLoggedIn ? (
                        <div className="mt-6 flex items-center justify-center bg-indigo-50 p-3 rounded-md">
                          <Check className="h-5 w-5 text-indigo-500 mr-2" />
                          <p className="text-sm text-indigo-800">
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
                            className="text-sm text-gray-700 hover:text-indigo-600 cursor-pointer"
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

      {/* Login Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-white bg-opacity-10 backdrop-blur-xl transition-opacity z-40 cursor-pointer"
              onClick={() => setLoginModalOpen(false)}
            />

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left z-50 relative overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
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

                  <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
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
                          className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Enter your email or username"
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
                          className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                        />
                        <label
                          htmlFor="remember-me"
                          className="ml-2 block text-sm text-gray-900 cursor-pointer"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                      >
                        Sign in
                      </button>
                    </div>
                  </form>

                  <div className="mt-6 text-center text-sm">
                    <p className="text-xs text-gray-500">
                      Sign in with any email and password to access your account.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="w-full" id="home">
        {view === "products" && (
          <>
            {/* Hero Section */}
            <section className="pt-4 md:pt-0 relative bg-gradient-to-r from-gray-50 to-indigo-50 md:min-h-screen md:flex md:items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-0 w-full">
                <div className="md:flex md:items-center">
                  <div className="md:w-1/2 md:pr-12 animate-on-scroll opacity-0">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
                      Elevate Your{" "}
                      <span className="text-indigo-600">Style</span>
                    </h1>
                    <p className="mt-6 text-xl text-gray-600">
                      Discover modern, sustainable fashion for every occasion at
                      Urban Threads.
                    </p>
                    <div className="mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                      <div className="rounded-md shadow w-full sm:w-fit">
                        <button
                          onClick={() => {
                            const element =
                              document.getElementById("shop-section");
                            element?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="flex items-center justify-center w-full px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-colors cursor-pointer"
                        >
                          Shop Now
                        </button>
                      </div>
                      <div className="w-full sm:w-fit">
                        <button
                          className="flex items-center justify-center w-full px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-colors cursor-pointer"
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
                    <img
                      className="rounded-lg shadow-xl transform transition-transform hover:scale-105 duration-500"
                      src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80"
                      alt="Fashion collection display"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="bg-white py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl border border-gray-50 transition-all duration-300 hover:border-gray-200 hover:bg-gray-50 animate-on-scroll opacity-0">
                    <Truck className="h-10 w-10 text-indigo-500" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      Free Shipping
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      Enjoy free shipping on all orders over $75. Fast delivery
                      straight to your door.
                    </p>
                  </div>
                  <div
                    className="flex flex-col items-center text-center p-8 bg-white rounded-xl border border-gray-50 transition-all duration-300 hover:border-gray-200 hover:bg-gray-50 animate-on-scroll opacity-0"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <Shield className="h-10 w-10 text-indigo-500" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      Quality Guarantee
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      All our products are made from premium materials for
                      lasting quality and style.
                    </p>
                  </div>
                  <div
                    className="flex flex-col items-center text-center p-8 bg-white rounded-xl border border-gray-50 transition-all duration-300 hover:border-gray-200 hover:bg-gray-50 animate-on-scroll opacity-0"
                    style={{ animationDelay: "0.4s" }}
                  >
                    <Clock className="h-10 w-10 text-indigo-500" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      Easy Returns
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      Not the right fit? Send items back within 30 days for a
                      full refund or exchange.
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
                    Our most popular styles, hand-selected by our fashion
                    experts.
                  </p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                  {featuredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="relative bg-white rounded-xl overflow-hidden border border-gray-50 transition-all duration-300 hover:border-gray-200 hover:bg-gray-50 animate-on-scroll opacity-0"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="aspect-[1/1]">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-center object-cover group-hover:opacity-75"
                        />
                        <div className="absolute top-2 right-2">
                          <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Featured
                          </div>
                        </div>
                        {(product.discount ?? 0) > 0 && (
                          <div className="absolute top-2 left-2">
                            <div className="bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              {product.discount}% OFF
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {product.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 capitalize">
                              {product.mainCategory} / {product.subCategory}
                            </p>
                          </div>
                          <div className="text-right">
                            {(product.discount ?? 0) > 0 ? (
                              <>
                                <p className="text-sm line-through text-gray-400">
                                  ${product.price.toFixed(2)}
                                </p>
                                <p className="text-lg font-medium text-rose-500">
                                  $
                                  {getDiscountedPrice(
                                    product.price,
                                    product.discount
                                  ).toFixed(2)}
                                </p>
                              </>
                            ) : (
                              <p className="text-lg font-medium text-gray-900">
                                ${product.price.toFixed(2)}
                              </p>
                            )}
                          </div>
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
                          className="mt-4 w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors cursor-pointer"
                        >
                          Add to bag
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
                    Browse our curated collection of stylish clothing and
                    accessories.
                  </p>
                </div>

                {/* Mobile filter dialog */}
                <div className="flex items-center justify-between mt-8 md:hidden">
                  <button
                    type="button"
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-700"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="flex-shrink-0 mr-1 h-5 w-5" />
                    <span>Filters</span>
                  </button>
                </div>

                <div className="mt-8 md:grid md:grid-cols-4 md:gap-x-8 md:gap-y-10">
                  {/* Filters (desktop) */}
                  <div className="hidden md:block md:col-span-1">
                    <div className="space-y-6">
                      {/* Main Categories */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Main Categories
                        </h3>
                        <ul className="mt-4 space-y-2">
                          {mainCategories.map((category) => (
                            <li key={category} className="flex items-center">
                              <button
                                onClick={() =>
                                  setSelectedMainCategory(category)
                                }
                                className={`group flex items-center text-sm ${
                                  selectedMainCategory === category
                                    ? "font-medium text-indigo-600"
                                    : "text-gray-600 hover:text-indigo-600"
                                }`}
                              >
                                <span
                                  className={`mr-3 h-5 w-5 border rounded-full flex items-center justify-center ${
                                    selectedMainCategory === category
                                      ? "border-indigo-600"
                                      : "border-gray-300 group-hover:border-indigo-600"
                                  }`}
                                >
                                  {selectedMainCategory === category && (
                                    <span className="h-3 w-3 rounded-full bg-indigo-600" />
                                  )}
                                </span>
                                <span className="capitalize">{category}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Sub Categories */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Sub Categories
                        </h3>
                        <ul className="mt-4 space-y-2">
                          {subCategories.map((category) => (
                            <li key={category} className="flex items-center">
                              <button
                                onClick={() => setSelectedSubCategory(category)}
                                className={`group flex items-center text-sm ${
                                  selectedSubCategory === category
                                    ? "font-medium text-indigo-600"
                                    : "text-gray-600 hover:text-indigo-600"
                                }`}
                              >
                                <span
                                  className={`mr-3 h-5 w-5 border rounded-full flex items-center justify-center ${
                                    selectedSubCategory === category
                                      ? "border-indigo-600"
                                      : "border-gray-300 group-hover:border-indigo-600"
                                  }`}
                                >
                                  {selectedSubCategory === category && (
                                    <span className="h-3 w-3 rounded-full bg-indigo-600" />
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
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setPriceRange([0, 50])}
                              className={`px-3 py-1 text-xs rounded cursor-pointer ${
                                priceRange[1] === 50
                                  ? "bg-indigo-100 text-indigo-800"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }`}
                            >
                              Under $50
                            </button>
                            <button
                              onClick={() => setPriceRange([50, 100])}
                              className={`px-3 py-1 text-xs rounded cursor-pointer ${
                                priceRange[0] === 50 && priceRange[1] === 100
                                  ? "bg-indigo-100 text-indigo-800"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }`}
                            >
                              $50 - $100
                            </button>
                            <button
                              onClick={() => setPriceRange([100, 200])}
                              className={`px-3 py-1 text-xs rounded cursor-pointer ${
                                priceRange[0] === 100
                                  ? "bg-indigo-100 text-indigo-800"
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

                  {/* Product Grid */}
                  <div className="md:col-span-3">
                    <div className="mb-8 w-full mx-auto">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Search our collection..."
                          type="search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
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
                            setSelectedMainCategory("all");
                            setSelectedSubCategory("all");
                            setPriceRange([0, 200]);
                            setSearchQuery("");
                          }}
                          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                        >
                          Reset Filters
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredProducts.map((product, index) => (
                          <div
                            key={product.id}
                            className="group relative flex flex-col h-[500px] w-full border border-gray-50 rounded-xl overflow-hidden hover:border-gray-200 hover:bg-gray-50 transition-all duration-300"
                          >
                            <div className="relative w-full h-[260px] bg-gray-100 overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-[260px] object-cover object-center transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                <div className="transform opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                  <button
                                    onClick={() => addToCart(product)}
                                    className="bg-white bg-opacity-90 rounded-full p-3 hover:bg-indigo-500 hover:text-white transition-colors shadow-md"
                                  >
                                    <ShoppingCart className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                              {product.featured && (
                                <div className="absolute top-2 right-2">
                                  <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                                    Featured
                                  </div>
                                </div>
                              )}
                              {(product.discount ?? 0) > 0 && (
                                <div className="absolute top-2 left-2">
                                  <div className="bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                                    {product.discount}% OFF
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex-grow p-4 flex flex-col">
                              <div className="flex justify-between mb-2">
                                <div className="flex-1 min-h-[60px]">
                                  <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                                    {product.name}
                                  </h3>
                                  <p className="text-sm text-gray-500 capitalize">
                                    {product.mainCategory} /{" "}
                                    {product.subCategory}
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
                                <div className="text-right ml-4">
                                  {(product.discount ?? 0) > 0 ? (
                                    <>
                                      <p className="text-sm line-through text-gray-400">
                                        ${product.price.toFixed(2)}
                                      </p>
                                      <p className="text-lg font-medium text-rose-500">
                                        $
                                        {getDiscountedPrice(
                                          product.price,
                                          product.discount
                                        ).toFixed(2)}
                                      </p>
                                    </>
                                  ) : (
                                    <p className="text-lg font-medium text-gray-900">
                                      ${product.price.toFixed(2)}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Product options - color and size selectors */}
                              <div className="space-y-3 mt-2 flex-grow">
                                {product.colors &&
                                  product.colors.length > 0 && (
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-900">
                                        Colors
                                      </h4>
                                      <div className="flex space-x-2 mt-1">
                                        {product.colors.map((color) => (
                                          <button
                                            key={color}
                                            onClick={() =>
                                              setSelectedColors({
                                                ...selectedColors,
                                                [product.id]: color,
                                              })
                                            }
                                            className={`w-6 h-6 rounded-full border cursor-pointer ${
                                              selectedColors[product.id] === color
                                                ? "ring-2 ring-indigo-500 ring-offset-1"
                                                : "border-gray-300"
                                            }`}
                                            title={color}
                                            style={{
                                              backgroundColor: color
                                                .toLowerCase()
                                                .includes("black")
                                                ? "#000000"
                                                : color
                                                    .toLowerCase()
                                                    .includes("white")
                                                ? "#ffffff"
                                                : color
                                                    .toLowerCase()
                                                    .includes("navy")
                                                ? "#000080"
                                                : color
                                                    .toLowerCase()
                                                    .includes("blue")
                                                ? "#3182ce"
                                                : color
                                                    .toLowerCase()
                                                    .includes("red")
                                                ? "#e53e3e"
                                                : color
                                                    .toLowerCase()
                                                    .includes("light blue")
                                                ? "#63b3ed"
                                                : color
                                                    .toLowerCase()
                                                    .includes("dark blue")
                                                ? "#2c5282"
                                                : color
                                                    .toLowerCase()
                                                    .includes("brown")
                                                ? "#a0522d"
                                                : color
                                                    .toLowerCase()
                                                    .includes("tan")
                                                ? "#d2b48c"
                                                : color
                                                    .toLowerCase()
                                                    .includes("beige")
                                                ? "#f5f5dc"
                                                : color
                                                    .toLowerCase()
                                                    .includes("gray")
                                                ? "#718096"
                                                : color
                                                    .toLowerCase()
                                                    .includes("ivory")
                                                ? "#fffff0"
                                                : color
                                                    .toLowerCase()
                                                    .includes("blush")
                                                ? "#ffb6c1"
                                                : color
                                                    .toLowerCase()
                                                    .includes("emerald")
                                                ? "#2ecc71"
                                                : color
                                                    .toLowerCase()
                                                    .includes("burgundy")
                                                ? "#800020"
                                                : color
                                                    .toLowerCase()
                                                    .includes("camel")
                                                ? "#c19a6b"
                                                : color
                                                    .toLowerCase()
                                                    .includes("charcoal")
                                                ? "#36454f"
                                                : color
                                                    .toLowerCase()
                                                    .includes("cream")
                                                ? "#fffdd0"
                                                : color
                                                    .toLowerCase()
                                                    .includes("pink")
                                                ? "#f687b3"
                                                : color
                                                    .toLowerCase()
                                                    .includes("floral")
                                                ? "#f687b3"
                                                : "#cbd5e0",
                                            }}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                {product.sizes && product.sizes.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900">
                                      Sizes
                                    </h4>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {product.sizes.map((size) => (
                                        <button
                                          key={size}
                                          onClick={() =>
                                            setSelectedSizes({
                                              ...selectedSizes,
                                              [product.id]: size,
                                            })
                                          }
                                          className={`px-2 py-1 text-xs font-medium rounded border cursor-pointer ${
                                            selectedSizes[product.id] === size
                                              ? "bg-indigo-600 text-white border-indigo-600"
                                              : "bg-white text-gray-700 border-gray-300 hover:border-indigo-300"
                                          }`}
                                        >
                                          {size}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <button
                                onClick={() => addToCart(product)}
                                className="mt-4 w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors cursor-pointer"
                              >
                                Add to bag
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Newsletter */}
            <section className="bg-indigo-700 py-16" id="join">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:flex lg:items-center lg:justify-between">
                  <div className="lg:w-1/2 animate-on-scroll opacity-0">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                      Join our style community
                    </h2>
                    <p className="mt-3 max-w-3xl text-lg text-indigo-100 pr-5">
                      Subscribe to our newsletter for exclusive offers, style
                      tips, and early access to new collections.
                    </p>
                  </div>
                  <div
                    className="mt-8 lg:mt-0 lg:w-1/2 animate-on-scroll opacity-0"
                    style={{ animationDelay: "0.2s" }}
                  >
                    {isNewsletterSubscribed ? (
                      <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                        <div className="flex items-center text-green-500">
                          <Check className="h-6 w-6 mr-2" />
                          <p className="text-green-500">
                            Thank you for subscribing to our newsletter!
                          </p>
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
                          className="w-full px-5 py-3 border bg-white border-transparent placeholder-gray-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white focus:border-white sm:max-w-xs rounded-md"
                          placeholder="Enter your email"
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                        />
                        <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                          <button
                            type="submit"
                            className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white cursor-pointer"
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
          <div className="pt-24 pb-24 bg-gray-50">
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
                      Items in your shopping bag
                    </h2>

                    <ul className="border-t border-b border-gray-200 divide-y divide-gray-200">
                      {cart.map((item, index) => (
                        <li
                          key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
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
                                      className="font-medium text-gray-700 hover:text-gray-800 cursor-pointer"
                                    >
                                      {item.product.name}
                                    </a>
                                  </h3>
                                </div>
                                <div className="mt-1 flex text-sm">
                                  <p className="text-gray-500 capitalize">
                                    {item.product.mainCategory} /{" "}
                                    {item.product.subCategory}
                                  </p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                  {item.selectedColor &&
                                    `Color: ${item.selectedColor}`}
                                  {item.selectedSize &&
                                    item.selectedColor &&
                                    " / "}
                                  {item.selectedSize &&
                                    `Size: ${item.selectedSize}`}
                                </p>
                                <div className="flex items-end mt-2">
                                  {(item.product.discount ?? 0) > 0 ? (
                                    <>
                                      <p className="text-xs line-through text-gray-400 mr-1">
                                        ${item.product.price.toFixed(2)}
                                      </p>
                                      <p className="text-sm font-medium text-rose-500">
                                        $
                                        {getDiscountedPrice(
                                          item.product.price,
                                          item.product.discount
                                        ).toFixed(2)}
                                      </p>
                                    </>
                                  ) : (
                                    <p className="text-sm font-medium text-gray-900">
                                      ${item.product.price.toFixed(2)}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="mt-4 sm:mt-0 sm:pr-9">
                                <div className="flex w-fit items-center border rounded">
                                  <button
                                    type="button"
                                    className="px-3 py-1 text-gray-600 hover:text-gray-700 focus:outline-none"
                                    onClick={() =>
                                      updateCartItemQuantity(
                                        index,
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
                                    className="px-3 py-1 text-gray-600 hover:text-gray-700 focus:outline-none"
                                    onClick={() =>
                                      updateCartItemQuantity(
                                        index,
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
                                    className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500"
                                    onClick={() => removeFromCart(index)}
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
                    className="mt-16 bg-white rounded-xl border border-gray-50 px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
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
                                    className="block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                                    className="block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                                    className="block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                                    className="block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                                    className="block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                                    className="block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                                    className="block w-full pl-10 pr-4 py-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                                    className="block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                                    className="block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                            className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors cursor-pointer"
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
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-6">
                  <Check className="h-8 w-8 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Order Successful!
                </h1>
                <p className="mt-4 text-lg text-gray-500">
                  Thank you for your purchase. Your order confirmation has been
                  sent to your email.
                </p>
                <div className="mt-8 bg-white p-8 rounded-xl border border-gray-50">
                  <div className="text-left">
                    <h2 className="text-lg font-medium text-gray-900 border-b pb-2">
                      Order Summary
                    </h2>
                    <dl className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Order number</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          UT-{Math.floor(Math.random() * 10000)}
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
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors cursor-pointer"
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
              <div className="text-white text-2xl font-bold">Urban Threads</div>
              <p className="text-gray-300 text-base">
                Premium clothing for the modern lifestyle, ethically made and
                designed to last.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-300 cursor-pointer">
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
                <a href="#" className="text-gray-400 hover:text-gray-300 cursor-pointer">
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
                <a href="#" className="text-gray-400 hover:text-gray-300 cursor-pointer">
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
                        className="text-base text-gray-400 hover:text-gray-300 cursor-pointer"
                      >
                        Men
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base text-gray-400 hover:text-gray-300 cursor-pointer"
                      >
                        Women
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base text-gray-400 hover:text-gray-300 cursor-pointer"
                      >
                        Accessories
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base text-gray-400 hover:text-gray-300 cursor-pointer"
                      >
                        New Arrivals
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
                        className="text-base text-gray-400 hover:text-gray-300 cursor-pointer"
                      >
                        Sizing Guides
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base text-gray-400 hover:text-gray-300 cursor-pointer"
                      >
                        Shipping
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
                        Sustainability
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
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                    Legal
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a
                        href="#"
                        className="text-base text-gray-400 hover:text-gray-300"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base text-gray-400 hover:text-gray-300"
                      >
                        Terms of Service
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-base text-gray-400 hover:text-gray-300"
                      >
                        Cookie Policy
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-base text-gray-400 md:flex md:justify-between">
              <span>&copy; 2025 Urban Threads. All rights reserved.</span>
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
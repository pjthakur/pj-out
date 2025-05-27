"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ShoppingCart, X, Plus, Minus, ChevronRight, Menu, Search, CheckCircle } from "lucide-react"
import Link from "next/link"

// Types
interface Product {
  id: number
  name: string
  category: string
  price: number
  image: string
  description: string
  featured?: boolean
}

interface CartItem extends Product {
  quantity: number
}

interface Toast {
  id: string
  title: string
  description: string
  type: "success" | "error" | "info"
}

// Custom Toast component
const ToastContainer = ({
  toasts,
  removeToast,
}: {
  toasts: Toast[]
  removeToast: (id: string) => void
}) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg flex items-start gap-3 w-full transform transition-all duration-300 animate-slide-up ${
            toast.type === "success"
              ? "bg-gray-900 text-white"
              : toast.type === "error"
                ? "bg-red-600 text-white"
                : "bg-gray-800 text-white"
          }`}
        >
          {toast.type === "success" && <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium">{toast.title}</h4>
            <p className="text-sm opacity-90 break-words">{toast.description}</p>
          </div>
          <button onClick={() => removeToast(toast.id)} className="text-white/80 hover:text-white flex-shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

// Custom hook for toast
const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return { toasts, addToast, removeToast }
}

export default function SportsEquipmentStore() {
  // Toast
  const { toasts, addToast, removeToast } = useToast()

  // State
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [scrollY, setScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isMessageSent, setIsMessageSent] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const lastAddToCartRef = useRef<{ productId: number; timestamp: number } | null>(null)

  // Refs for scrolling
  const heroRef = useRef<HTMLDivElement>(null)
  const featuredRef = useRef<HTMLElement>(null)
  const productsRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)

  
  useEffect(() => {
 
    document.documentElement.classList.remove("dark")
  }, [])

  // Scroll to section function
  const scrollToSection = (elementRef: React.RefObject<HTMLElement | null>) => {
    if (elementRef.current) {
      window.scrollTo({
        top: elementRef.current.offsetTop - 80, // Adjust for header height
        behavior: "smooth",
      })
      setMobileMenuOpen(false)
    }
  }

  //products
  useEffect(() => {
    // Mock products data with Unsplash images
    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Pro Basketball",
        category: "basketball",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=2787&auto=format&fit=crop",
        description: "Professional grade basketball with superior grip and durability.",
        featured: true,
      },
      {
        id: 2,
        name: "Tennis Racket Elite",
        category: "tennis",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=2940&auto=format&fit=crop",
        description: "Lightweight carbon fiber tennis racket for professional players.",
        featured: true,
      },
      {
        id: 3,
        name: "Running Shoes Air",
        category: "running",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=2787&auto=format&fit=crop",
        description: "Breathable running shoes with advanced cushioning technology.",
        featured: true,
      },
      {
        id: 4,
        name: "Soccer Ball Pro",
        category: "soccer",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?q=80&w=2787&auto=format&fit=crop",
        description: "Match-quality soccer ball with water-resistant exterior.",
      },
      {
        id: 5,
        name: "Yoga Mat Premium",
        category: "yoga",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=2787&auto=format&fit=crop",
        description: "Extra thick yoga mat with non-slip surface and carrying strap.",
      },
      {
        id: 6,
        name: "Dumbbells Set",
        category: "fitness",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2787&auto=format&fit=crop",
        description: "Adjustable dumbbells set with storage rack, 5-25kg per hand.",
      },
      {
        id: 7,
        name: "Swimming Goggles Pro",
        category: "swimming",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?q=80&w=2787&auto=format&fit=crop",
        description: "Anti-fog swimming goggles with UV protection and adjustable strap.",
      },
      {
        id: 9,
        name: "Golf Club Set",
        category: "golf",
        price: 499.99,
        image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2787&auto=format&fit=crop",
        description: "Complete set of golf clubs for beginners and intermediate players.",
      },
      {
        id: 10,
        name: "Badminton Racket Pair",
        category: "badminton",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=2787&auto=format&fit=crop",
        description: "Pair of lightweight badminton rackets with carrying case.",
      },
      {
        id: 11,
        name: "Hiking Backpack",
        category: "hiking",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1501554728187-ce583db33af7?q=80&w=2787&auto=format&fit=crop",
        description: "Waterproof hiking backpack with multiple compartments and hydration system.",
      },
      {
        id: 12,
        name: "Boxing Gloves",
        category: "boxing",
        price: 69.99,
        image: "https://images.unsplash.com/photo-1593352216894-89108a0d2653?q=80&w=2787&auto=format&fit=crop",
        description: "Professional boxing gloves with wrist support and padding.",
      },
    ]

    setProducts(mockProducts)
    setSearchResults(mockProducts)
  }, [])

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults(products)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query),
    )

    setSearchResults(filtered)

    // If we're searching and have results, scroll to products section
    if (filtered.length > 0 && query.length > 2) {
      scrollToSection(productsRef)
      setActiveCategory("all")
    }
  }, [searchQuery, products])

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Body scroll lock when cart is open
  useEffect(() => {
    if (isCartOpen) {
      // Save current scroll position
      const scrollY = window.scrollY
      // Lock body scroll
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
    } else {
      // Get the scroll position from the body top value
      const scrollY = document.body.style.top
      // Restore body scroll
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }

    // Cleanup function to restore scroll on unmount
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
    }
  }, [isCartOpen])

  // Cart functions
  const addToCart = (product: Product) => {
    const now = Date.now()
    
    // Check if this is a duplicate call within 500ms for the same product
    if (
      lastAddToCartRef.current &&
      lastAddToCartRef.current.productId === product.id &&
      now - lastAddToCartRef.current.timestamp < 500
    ) {
      return // Ignore duplicate calls
    }

    // Update the ref with current action
    lastAddToCartRef.current = { productId: product.id, timestamp: now }

    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      // Item already exists, increase quantity
      setCart((prevCart) => 
        prevCart.map((item) => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      )
      addToast({
        title: "Added to cart",
        description: `${product.name} quantity increased in your cart.`,
        type: "success",
      })
    } else {
      // New item, add to cart
      setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }])
      addToast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
        type: "success",
      })
    }
  }

  const removeFromCart = (productId: number) => {
    const productToRemove = cart.find((item) => item.id === productId)
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))

    if (productToRemove) {
      addToast({
        title: "Removed from cart",
        description: `${productToRemove.name} has been removed from your cart.`,
        type: "info",
      })
    }
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))
  }

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0)

  // Filter products by category
  const filteredProducts =
    activeCategory === "all" ? searchResults : searchResults.filter((product) => product.category === activeCategory)

  // Get unique categories
  const categories = ["all", ...new Set(products.map((product) => product.category))]

  // Featured products
  const featuredProducts = products.filter((product) => product.featured)

  // Handle newsletter subscription
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      addToast({
        title: "Subscribed!",
        description: "You've been successfully subscribed to our newsletter.",
        type: "success",
      })
      setEmail("")
    }
  }

  // Handle contact form submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (contactForm.name && contactForm.email && contactForm.message) {
      setIsMessageSent(true)
      addToast({
        title: "Message sent!",
        description: "Thank you for your message. We'll get back to you soon.",
        type: "success",
      })
      setContactForm({ name: "", email: "", message: "" })
      setTimeout(() => setIsMessageSent(false), 3000)
    }
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already handled by the useEffect
  }

  return (
    <div className="min-h-screen flex flex-col font-['Poppins',sans-serif]">
      {/* Custom CSS for fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Poppins', sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white shadow-md backdrop-blur-md bg-opacity-90 transition-colors duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                className="md:hidden mr-4 text-gray-700 cursor-pointer"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 text-transparent bg-clip-text">
                  BeSporty
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection(featuredRef)}
                className="text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Featured
              </button>
              <button
                onClick={() => scrollToSection(productsRef)}
                className="text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Products
              </button>
              <button
                onClick={() => scrollToSection(aboutRef)}
                className="text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection(contactRef)}
                className="text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Contact
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="hidden md:flex relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </form>

              <button className="relative text-gray-700 cursor-pointer" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => scrollToSection(featuredRef)}
                  className="text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Featured
                </button>
                <button
                  onClick={() => scrollToSection(productsRef)}
                  className="text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Products
                </button>
                <button
                  onClick={() => scrollToSection(aboutRef)}
                  className="text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection(contactRef)}
                  className="text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Contact
                </button>
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </form>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero section*/} 
      <div ref={heroRef} className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=3270&auto=format&fit=crop')",
            transform: `translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0005})`,
            transition: "transform 0.1s ease-out",
          }}
        ></div>
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/90 to-gray-800/90"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        ></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            style={{
              transform: `translateY(${scrollY * -0.2}px)`,
              opacity: 1 - scrollY * 0.001,
            }}
          >
            <span className="block">Elevate Your Game</span>
            <span className="bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
              With Premium Gear
            </span>
          </h1>
          <p
            className="text-xl md:text-2xl text-white mb-10 max-w-2xl mx-auto"
            style={{
              transform: `translateY(${scrollY * -0.1}px)`,
              opacity: 1 - scrollY * 0.002,
            }}
          >
            Professional sports equipment for athletes who demand excellence at every level
          </p>
          <button
            onClick={() => scrollToSection(productsRef)}
            className="inline-block bg-gray-900 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg cursor-pointer"
            style={{
              transform: `translateY(${scrollY * -0.05}px)`,
            }}
          >
            Explore Collection
          </button>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"
          style={{
            transform: `translateY(${Math.min(scrollY * 0.2, 0)}px)`,
          }}
        ></div>
      </div>

      {/* Featured products */}
      <section ref={featuredRef} id="featured" className="py-20 bg-gray-50 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Featured Collection</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-900 to-gray-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Discover our handpicked selection of premium sports equipment designed for peak performance
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-80 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${product.image})` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <button
                    onClick={() => addToCart(product)}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-900 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 shadow-lg cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="capitalize mr-2">{product.category}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-400 mr-2"></span>
                    <span className="text-gray-900">Premium Quality</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products section */}
      <section ref={productsRef} id="products" className="py-20 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Our Products</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-900 to-gray-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Browse our complete collection of high-quality sports equipment for every athlete
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full capitalize transition-all duration-300 cursor-pointer ${
                  activeCategory === category
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search results info */}
          {searchQuery && (
            <div className="text-center mb-8">
              <p className="text-gray-600">
                {filteredProducts.length === 0
                  ? `No results found for "${searchQuery}"`
                  : `Showing ${filteredProducts.length} results for "${searchQuery}"`}
              </p>
            </div>
          )}

          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative h-64 overflow-hidden flex-shrink-0">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${product.image})` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold flex-grow pr-2">{product.name}</h3>
                      <span className="text-lg font-bold text-gray-900 flex-shrink-0">${product.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-3 capitalize">{product.category}</p>
                    <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">{product.description}</p>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-gray-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all transform hover:scale-[1.02] cursor-pointer mt-auto"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No products found. Try a different search or category.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About section */}
      <section ref={aboutRef} id="about" className="py-24 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=3456&auto=format&fit=crop')",
            transform: `translateY(${(scrollY - 1500) * 0.1}px)`,
            backgroundAttachment: "fixed",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-gray-800/90"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">About BeSporty</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-300 to-gray-500 mx-auto mb-8"></div>
            <p className="text-lg mb-10 leading-relaxed">
              Founded in 2010, BeSporty has been providing high-quality sports equipment to athletes of all levels. Our
              mission is to help you achieve your athletic goals with the best gear on the market, designed for
              performance, durability, and style.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 transform transition-transform hover:scale-105">
                <div className="text-5xl font-bold mb-3 text-gray-200">1000+</div>
                <div className="text-gray-300 font-medium">Premium Products</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 transform transition-transform hover:scale-105">
                <div className="text-5xl font-bold mb-3 text-gray-200">50k+</div>
                <div className="text-gray-300 font-medium">Happy Athletes</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 transform transition-transform hover:scale-105">
                <div className="text-5xl font-bold mb-3 text-gray-200">20+</div>
                <div className="text-gray-300 font-medium">Sports Categories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section ref={contactRef} id="contact" className="py-20 bg-gray-50 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Contact Us</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-900 to-gray-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Have questions about our products? Our team is here to help you
            </p>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">Get in Touch</h3>
              <p className="text-gray-600 mb-8">
                Have questions about our products or need assistance with your order? Our customer service team is here
                to help you find the perfect equipment for your needs.
              </p>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-1">Address</h4>
                    <p className="text-gray-600">123 Sports Avenue, Athleticville, SP 12345</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-1">Phone</h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-1">Email</h4>
                    <p className="text-gray-600">info@besporty.example</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">Send a Message</h3>
              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-all transform hover:scale-[1.02] flex items-center justify-center cursor-pointer"
                >
                  {isMessageSent ? (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" /> Message Sent!
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-300">BeSporty</h3>
              <p className="text-gray-400 mb-6">
                Your one-stop shop for high-quality sports equipment and accessories designed for champions.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="text-gray-400 hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(featuredRef)}
                    className="text-gray-400 hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    Featured
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(productsRef)}
                    className="text-gray-400 hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    Products
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(aboutRef)}
                    className="text-gray-400 hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(contactRef)}
                    className="text-gray-400 hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Categories</h4>
              <ul className="space-y-3">
                {categories.slice(1, 7).map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => {
                        scrollToSection(productsRef)
                        setActiveCategory(category)
                      }}
                      className="text-gray-400 hover:text-gray-300 transition-colors capitalize cursor-pointer"
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Newsletter</h4>
              <p className="text-gray-400 mb-6">
                Subscribe to our newsletter for the latest updates and exclusive offers.
              </p>
              <form className="flex flex-col space-y-4" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-3 rounded-lg w-full border border-gray-700 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent shadow-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center cursor-pointer"
                >
                  {isSubscribed ? (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" /> Subscribed!
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} BeSporty. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Shopping Cart Sidebar */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity ${isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Your Cart ({cartItemCount})</h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700 cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(100vh-250px)]">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-6">Your cart is empty</p>
                <button
                  onClick={() => {
                    setIsCartOpen(false)
                    scrollToSection(productsRef)
                  }}
                  className="bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex border-b pb-6">
                    <div
                      className="w-24 h-24 rounded-lg overflow-hidden bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${item.image})` }}
                    ></div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.name}</h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 cursor-pointer"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-gray-500 text-sm">${item.price.toFixed(2)}</p>
                      <div className="flex items-center mt-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-md border border-gray-300 hover:bg-gray-100 text-gray-700 cursor-pointer"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="mx-3 w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-md border border-gray-300 hover:bg-gray-100 text-gray-700 cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <span className="ml-auto font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t p-6 bg-gray-50 absolute bottom-0 left-0 right-0">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="font-medium">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">${cartTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false)
                  addToast({
                    title: "Order placed!",
                    description: "Thank you for your purchase. Your order has been placed successfully.",
                    type: "success",
                  })
                  setCart([])
                }}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all transform hover:scale-[1.02] flex items-center justify-center cursor-pointer"
              >
                Checkout <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}
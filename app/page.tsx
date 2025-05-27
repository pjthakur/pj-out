"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ShoppingCart, X, Plus, Minus, ChevronRight, Menu, Search, CheckCircle, Heart, ChevronLeft } from "lucide-react"
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
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg flex items-start gap-3 max-w-md transform transition-all duration-300 animate-slide-up ${
            toast.type === "success"
              ? "bg-black text-white"
              : toast.type === "error"
                ? "bg-red-600 text-white"
                : "bg-gray-800 text-white"
          }`}
        >
          {toast.type === "success" && <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />}
          <div className="flex-1">
            <h4 className="font-medium">{toast.title}</h4>
            <p className="text-sm opacity-90">{toast.description}</p>
          </div>
          <button onClick={() => removeToast(toast.id)} className="text-white/80 hover:text-white">
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

export default function StationeryStore() {
  // Toast
  const { toasts, addToast, removeToast } = useToast()

  // State
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
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
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

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
        name: "Premium Fountain Pen",
        category: "pens",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=2787&auto=format&fit=crop",
        description: "Elegant fountain pen with smooth ink flow and ergonomic grip.",
        featured: true,
      },
      {
        id: 2,
        name: "Leather-Bound Journal",
        category: "notebooks",
        price: 35.99,
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=2787&auto=format&fit=crop",
        description: "Handcrafted leather journal with premium paper for writing and sketching.",
        featured: true,
      },
      {
        id: 3,
        name: "Watercolor Set",
        category: "art",
        price: 28.99,
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2942&auto=format&fit=crop",
        description: "Professional-grade watercolor set with 24 vibrant colors.",
        featured: true,
      },
     
      {
        id: 5,
        name: "Washi Tape Collection",
        category: "decoration",
        price: 15.99,
        image: "https://images.unsplash.com/photo-1612444530582-fc66183b16f7?q=80&w=2940&auto=format&fit=crop",
        description: "Set of 10 decorative washi tapes in various patterns and colors.",
      },
      {
        id: 6,
        name: "Mechanical Pencil Set",
        category: "pencils",
        price: 18.99,
        image: "https://images.unsplash.com/photo-1568205612837-017257d2310a?q=80&w=2787&auto=format&fit=crop",
        description: "Precision mechanical pencils in various lead sizes for technical drawing and writing.",
      },
      {
        id: 7,
        name: "Calligraphy Starter Kit",
        category: "calligraphy",
        price: 42.99,
        image: "https://images.unsplash.com/photo-1620783770629-122b7f187703?q=80&w=2787&auto=format&fit=crop",
        description: "Complete calligraphy kit with nibs, ink, and instructional guide for beginners.",
      },
      {
        id: 8,
        name: "Sticky Note Collection",
        category: "notes",
        price: 9.99,
        image: "https://images.unsplash.com/photo-1586282391129-76a6df230234?q=80&w=2940&auto=format&fit=crop",
        description: "Assorted sticky notes in various sizes, colors, and shapes for organization.",
      },
      {
        id: 9,
        name: "Handmade Paper Set",
        category: "paper",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1598620617148-c9e8ddee6711?q=80&w=2940&auto=format&fit=crop",
        description: "Artisanal handmade paper with natural fibers, perfect for special projects.",
      },
      
      {
        id: 11,
        name: "Vintage Stamp Set",
        category: "decoration",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1605496036006-fa36378ca4ab?q=80&w=2787&auto=format&fit=crop",
        description: "Collection of vintage-inspired rubber stamps with wooden handles.",
      },
      {
        id: 12,
        name: "Planner System",
        category: "organization",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=2940&auto=format&fit=crop",
        description: "Comprehensive planner system with monthly, weekly, and daily layouts.",
      },
    ]

    setProducts(mockProducts)
    setSearchResults(mockProducts)
  }, [])

  // Search functionality with debounce
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

    // Debounced search functionality - wait 3 seconds and require at least 4 characters
    const timeoutId = setTimeout(() => {
      if (filtered.length > 0 && query.length >= 4) {
        scrollToSection(productsRef)
        setActiveCategory("all")
      }
    }, 3000)

    // Cleanup timeout on new search query
    return () => clearTimeout(timeoutId)
  }, [searchQuery, products])

   
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Featured products carousel
  useEffect(() => {
    const interval = setInterval(() => {
      const featuredCount = products.filter((p) => p.featured).length
      if (featuredCount > 0 && !isAnimating) {
        changeSlide((currentSlide + 1) % featuredCount)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [products, currentSlide, isAnimating])

  // Prevent body scroll when cart or wishlist is open
  useEffect(() => {
    if (isCartOpen || isWishlistOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isCartOpen, isWishlistOpen])

  // Change slid 
  const changeSlide = (newSlide: number) => {
    if (isAnimating) return

    setIsAnimating(true)
    setCurrentSlide(newSlide)

     
    setTimeout(() => {
      setIsAnimating(false)
    }, 600)
  }

  // Cart functions
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)

      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
     
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))
  }

  // Wishlist functions
  const toggleWishlist = (product: Product) => {
    const isInWishlist = wishlist.some((item) => item.id === product.id)

    if (isInWishlist) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id))
      // No toast notification for removing from wishlist
    } else {
      setWishlist((prev) => [...prev, product])
      // No toast notification for adding to wishlist
    }
  }

  const isInWishlist = (productId: number) => {
    return wishlist.some((item) => item.id === productId)
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

  // Handle checkout
  const handleCheckout = () => {
    setIsCartOpen(false)
    addToast({
      title: "Order placed!",
      description: "Thank you for your purchase. Your order has been placed successfully.",
      type: "success",
    })
    setCart([])
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // search is already handled by the useEffect 
  }

  return (
    <div className="min-h-screen flex flex-col font-['Poppins',sans-serif] bg-gray-50">
      {/* Custom CSS for fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&display=swap');
      
        body {
          font-family: 'Raleway', sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Montserrat', sans-serif;
        }
        
        /* Line clamp utilities */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Carousel animation */
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .carousel-item {
          opacity: 0;
          position: absolute;
          transition: opacity 0.6s ease-in-out, transform 0.6s ease-in-out;
          width: 100%;
        }
        
        .carousel-item.active {
          opacity: 1;
          position: relative;
          animation: fadeIn 0.6s ease-in-out;
        }

        /*   */ 
        button, 
        a,
        [role="button"],
        .cursor-pointer,
        input[type="submit"],
        input[type="button"] {
          cursor: pointer;
        }

         
        .hover\:bg-gray-100:hover,
        .hover\:bg-gray-200:hover,
        .hover\:bg-gray-800:hover,
        .hover\:text-white:hover,
        .hover\:text-black:hover,
        .hover\:bg-red-100:hover,
        .hover\:text-red-500:hover,
        .hover\:text-red-600:hover,
        .hover\:scale-105:hover,
        .hover\:shadow-xl:hover {
          cursor: pointer;
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
                  PenPal
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection(featuredRef)}
                className="text-gray-700 hover:text-black transition-colors cursor-pointer"
              >
                Featured
              </button>
              <button
                onClick={() => scrollToSection(productsRef)}
                className="text-gray-700 hover:text-black transition-colors cursor-pointer"
              >
                Products
              </button>
              <button
                onClick={() => scrollToSection(aboutRef)}
                className="text-gray-700 hover:text-black transition-colors cursor-pointer"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection(contactRef)}
                className="text-gray-700 hover:text-black transition-colors cursor-pointer"
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

              <button className="relative text-gray-700 cursor-pointer" onClick={() => setIsWishlistOpen(true)}>
                <Heart className={`h-6 w-6 ${wishlist.length > 0 ? "fill-red-500 text-red-500" : ""}`} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button className="relative text-gray-700 cursor-pointer" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
                  className="text-gray-700 hover:text-black transition-colors cursor-pointer"
                >
                  Featured
                </button>
                <button
                  onClick={() => scrollToSection(productsRef)}
                  className="text-gray-700 hover:text-black transition-colors cursor-pointer"
                >
                  Products
                </button>
                <button
                  onClick={() => scrollToSection(aboutRef)}
                  className="text-gray-700 hover:text-black transition-colors cursor-pointer"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection(contactRef)}
                  className="text-gray-700 hover:text-black transition-colors cursor-pointer"
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
      <div ref={heroRef} className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Elevate Your Creativity with Premium Stationery
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Discover our curated collection of high-quality stationery for writers, artists, and creative
                professionals.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => scrollToSection(productsRef)}
                  className="bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-all cursor-pointer"
                >
                  Shop Now
                </button>
                <button
                  onClick={() => scrollToSection(featuredRef)}
                  className="bg-white text-black px-8 py-3 rounded-md font-medium border border-gray-300 hover:bg-gray-100 transition-all cursor-pointer"
                >
                  Featured Items
                </button>
              </div>
            </div>
            <div className="order-1 md:order-2 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-40 md:h-48 rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=2787&auto=format&fit=crop"
                    alt="Fountain pen"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-40 md:h-48 rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=2787&auto=format&fit=crop"
                    alt="Leather journal"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="h-full">
                <div className="h-full rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2942&auto=format&fit=crop"
                    alt="Art supplies"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured products */}
      <section ref={featuredRef} id="featured" className="py-20 bg-gray-100 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Featured Collection</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-900 to-gray-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Discover our handpicked selection of premium stationery designed for creativity and productivity
            </p>
          </div>

          {/*carousel */}
          <div className="relative max-w-4xl mx-auto">
            {/* Carousel items */}
            <div className="relative min-h-[500px]">
              {featuredProducts.map((product, index) => (
                <div key={product.id} className={`carousel-item ${currentSlide === index ? "active" : ""}`}>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/2">
                        <div className="h-64 md:h-96 overflow-hidden">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                          />
                        </div>
                      </div>
                      <div className="md:w-1/2 p-8 flex flex-col justify-between">
                        <div>
                          <div className="mb-2 text-gray-500 text-sm uppercase tracking-wider">{product.category}</div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                          <p className="text-gray-600 mb-6">{product.description}</p>
                          <div className="text-2xl font-bold text-gray-900 mb-6">${product.price.toFixed(2)}</div>
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={() => addToCart(product)}
                            className="flex-1 bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-all cursor-pointer"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => toggleWishlist(product)}
                            className={`p-3 rounded-md cursor-pointer ${
                              isInWishlist(product.id)
                                ? "bg-red-100 text-red-500"
                                : "bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500"
                            } transition-colors`}
                          >
                            <Heart className={`h-6 w-6 ${isInWishlist(product.id) ? "fill-red-500" : ""}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel controls */}
            <div className="absolute inset-0 flex justify-between items-center pointer-events-none z-20">
              <button
                onClick={() => changeSlide((currentSlide - 1 + featuredProducts.length) % featuredProducts.length)}
                className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 cursor-pointer pointer-events-auto ml-6"
                disabled={isAnimating}
                style={{ marginTop: '-160px' }}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => changeSlide((currentSlide + 1) % featuredProducts.length)}
                className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 cursor-pointer pointer-events-auto mr-6"
                disabled={isAnimating}
                style={{ marginTop: '-160px' }}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Carousel indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => changeSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
                    currentSlide === index ? "bg-gray-900" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  disabled={isAnimating}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products section */}
      <section ref={productsRef} id="products" className="py-20 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Our Products</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-900 to-gray-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Browse our complete collection of high-quality stationery for every creative need
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-md capitalize transition-all duration-300 cursor-pointer ${
                  activeCategory === category
                    ? "bg-black text-white shadow-md"
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
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-3 right-3 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleWishlist(product)
                        }}
                        className={`p-2 rounded-full ${
                          isInWishlist(product.id)
                            ? "bg-red-100 text-red-500"
                            : "bg-white/80 text-gray-500 hover:bg-red-100 hover:text-red-500"
                        } transition-colors`}
                      >
                        <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-red-500" : ""}`} />
                      </button>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="mb-1 text-gray-500 text-xs uppercase tracking-wider">{product.category}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Free shipping
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-black text-white py-3 rounded-md text-sm font-medium hover:bg-gray-800 transition-all cursor-pointer mt-auto"
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
      <section ref={aboutRef} id="about" className="py-24 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">About PenPal</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-900 to-gray-600 mx-auto mb-8"></div>
            <p className="text-lg mb-10 leading-relaxed text-gray-600">
              Founded in 2015, PenPal has been providing high-quality stationery to writers, artists, and creative
              professionals. Our mission is to help you express your creativity with the finest tools and materials,
              designed for performance, durability, and style.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
              <div className="bg-white rounded-lg p-8 shadow-md transform transition-transform hover:scale-105">
                <div className="text-5xl font-bold mb-3 text-gray-900">1000+</div>
                <div className="text-gray-600 font-medium">Premium Products</div>
              </div>
              <div className="bg-white rounded-lg p-8 shadow-md transform transition-transform hover:scale-105">
                <div className="text-5xl font-bold mb-3 text-gray-900">30k+</div>
                <div className="text-gray-600 font-medium">Happy Customers</div>
              </div>
              <div className="bg-white rounded-lg p-8 shadow-md transform transition-transform hover:scale-105">
                <div className="text-5xl font-bold mb-3 text-gray-900">15+</div>
                <div className="text-gray-600 font-medium">Product Categories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section ref={contactRef} id="contact" className="py-20 bg-white transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Contact Us</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-900 to-gray-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Have questions about our products? Our team is here to help you
            </p>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">Get in Touch</h3>
              <p className="text-gray-600 mb-8">
                Have questions about our products or need assistance with your order? Our customer service team is here
                to help you find the perfect stationery for your needs.
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
                    <p className="text-gray-600">123 Stationery Street, Creativeville, CP 12345</p>
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
                    <p className="text-gray-600">info@penpal.example</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-all cursor-pointer"
                >
                  {isMessageSent ? (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5 inline" /> Message Sent!
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

      {/* Newsletter section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Join Our Newsletter</h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter for the latest product updates, creative inspiration, and exclusive offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-6 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent flex-grow max-w-md"
                required
              />
              <button
                type="submit"
                className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                {isSubscribed ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5 inline" /> Subscribed!
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-gray-300 to-gray-500 text-transparent bg-clip-text">
                PenPal
              </h3>
              <p className="text-gray-300 mb-6">
                Your one-stop shop for high-quality stationery and creative supplies designed for inspiration.
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
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(featuredRef)}
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Featured
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(productsRef)}
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Products
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(aboutRef)}
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(contactRef)}
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
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
                      className="text-gray-300 hover:text-white transition-colors capitalize cursor-pointer"
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Customer Service</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Shipping Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Returns & Refunds
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} PenPal. All rights reserved.</p>
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
                  className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex border-b pb-6">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-cover bg-center flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
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
                onClick={handleCheckout}
                className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition-all cursor-pointer"
              >
                Checkout <ChevronRight className="ml-2 h-5 w-5 inline" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Wishlist Sidebar */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity ${isWishlistOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform ${isWishlistOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Your Wishlist ({wishlist.length})</h2>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700 cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(100vh-180px)]">
            {wishlist.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Heart className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-6">Your wishlist is empty</p>
                <button
                  onClick={() => {
                    setIsWishlistOpen(false)
                    scrollToSection(productsRef)
                  }}
                  className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {wishlist.map((item) => (
                  <div key={item.id} className="flex border-b pb-6">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-cover bg-center flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.name}</h3>
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="text-red-500 hover:text-red-600 cursor-pointer"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-gray-500 text-sm">${item.price.toFixed(2)}</p>
                      <div className="flex items-center mt-3">
                        <button
                          onClick={() => {
                            addToCart(item)
                            toggleWishlist(item)
                          }}
                          className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}
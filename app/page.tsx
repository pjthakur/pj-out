"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
ShoppingCart, X, Plus, Minus, ChevronRight, Menu, Search, CheckCircle, Heart, ChevronLeft, Leaf, Recycle, TreePine, } from "lucide-react"
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
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-3 sm:p-4 rounded-lg shadow-lg flex items-start gap-3 w-full transform transition-all duration-300 animate-slide-up border ${
            toast.type === "success"
              ? "bg-emerald-800 text-white border-emerald-700"
              : toast.type === "error"
                ? "bg-red-700 text-white border-red-600"
                : "bg-emerald-800 text-white border-emerald-700"
          }`}
        >
          {toast.type === "success" && <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5 text-emerald-200" />}
          <div className="flex-1">
            <h4 className="font-semibold !text-white text-sm sm:text-base">{toast.title}</h4>
            <p className="text-xs sm:text-sm text-emerald-100">{toast.description}</p>
          </div>
          <button onClick={() => removeToast(toast.id)} className="text-white hover:text-emerald-200 transition-colors">
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

// Product Modal component
const ProductModal = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  recentlyAdded,
}: {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (product: Product) => void
  onToggleWishlist: (product: Product) => void
  isInWishlist: (productId: number) => boolean
  recentlyAdded: Set<number>
}) => {
  if (!product || !isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg hover:bg-white transition-colors text-stone-700 hover:text-stone-900"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          
          {/* Product Image */}
          <div className="h-48 sm:h-64 lg:h-64 overflow-hidden bg-gradient-to-br from-emerald-50 to-stone-100">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto max-h-[calc(95vh-12rem)] sm:max-h-[calc(90vh-16rem)] lg:max-h-[calc(90vh-16rem)]">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Product Header */}
            <div className="mb-6 lg:mb-8">
              <div className="lg:flex lg:items-start lg:justify-between lg:gap-8">
                <div className="flex-1">
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider bg-emerald-100 text-emerald-700 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 mb-3 sm:mb-4 leading-tight">
                    {product.name}
                  </h1>
                  
                  <div className="prose prose-stone max-w-none mb-6">
                    <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>
                
                {/* Desktop Price Card */}
                <div className="hidden lg:block lg:w-80 lg:ml-8">
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 sticky top-0">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-emerald-700 mb-2">
                        ${product.price.toFixed(2)}
                      </div>
                      <p className="text-emerald-600 text-sm font-medium">Free carbon-neutral shipping</p>
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={() => onAddToCart(product)}
                        className={`w-full py-4 rounded-xl font-semibold transition-all shadow-lg ${
                          recentlyAdded.has(product.id)
                            ? "bg-green-600 text-white"
                            : "bg-emerald-700 text-white hover:bg-emerald-800 hover:shadow-xl transform hover:scale-[1.02]"
                        }`}
                      >
                        {recentlyAdded.has(product.id) ? (
                          <span className="flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Added to Cart!
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Add to Cart
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => onToggleWishlist(product)}
                        className={`w-full py-4 rounded-xl font-semibold transition-all shadow-lg border-2 ${
                          isInWishlist(product.id)
                            ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                            : "bg-white border-emerald-200 text-stone-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                        }`}
                      >
                        <span className="flex items-center justify-center">
                          <Heart 
                            className={`h-5 w-5 mr-2 ${
                              isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""
                            }`} 
                          />
                          {isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Price and Buttons */}
              <div className="lg:hidden">
                <div className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-6">
                  ${product.price.toFixed(2)}
                </div>

                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => onAddToCart(product)}
                    className={`w-full py-3 sm:py-4 rounded-xl font-semibold transition-all shadow-lg ${
                      recentlyAdded.has(product.id)
                        ? "bg-green-600 text-white"
                        : "bg-emerald-700 text-white hover:bg-emerald-800"
                    }`}
                  >
                    {recentlyAdded.has(product.id) ? (
                      <span className="flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Added to Cart!
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => onToggleWishlist(product)}
                    className={`w-full py-3 sm:py-4 rounded-xl font-semibold transition-all shadow-lg border-2 ${
                      isInWishlist(product.id)
                        ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                        : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                    }`}
                  >
                    <span className="flex items-center justify-center">
                      <Heart 
                        className={`h-5 w-5 mr-2 ${
                          isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""
                        }`} 
                      />
                      {isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Eco Features */}
              <div className="bg-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-100">
                <h3 className="text-base sm:text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                  <Leaf className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Eco-Friendly Features
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-emerald-700">
                    <CheckCircle className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span className="text-sm">Sustainable Materials</span>
                  </div>
                  <div className="flex items-center text-emerald-700">
                    <CheckCircle className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span className="text-sm">Carbon Neutral Shipping</span>
                  </div>
                  <div className="flex items-center text-emerald-700">
                    <CheckCircle className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span className="text-sm">Plastic-Free Packaging</span>
                  </div>
                  <div className="flex items-center text-emerald-700">
                    <CheckCircle className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span className="text-sm">Ethically Sourced</span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-stone-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-stone-200">
                <h3 className="text-base sm:text-lg font-semibold text-stone-800 mb-4">
                  Shipping & Returns
                </h3>
                <div className="space-y-3 text-stone-600">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm">Free carbon-neutral shipping on all orders</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm">30-day satisfaction guarantee</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm">Plastic-free, recyclable packaging</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
              <h4 className="text-lg font-semibold text-stone-800 mb-6 text-center">Why Choose Eco Products?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Recycle className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div className="text-sm font-semibold text-stone-800 mb-2">Eco-Friendly</div>
                  <div className="text-xs text-stone-600">Made with sustainable materials that protect our planet</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div className="text-sm font-semibold text-stone-800 mb-2">Quality Certified</div>
                  <div className="text-xs text-stone-600">Rigorously tested and certified for quality assurance</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TreePine className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div className="text-sm font-semibold text-stone-800 mb-2">Tree Planted</div>
                  <div className="text-xs text-stone-600">One tree planted with every purchase you make</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EcoStore() {
  // Toast
  const { toasts, addToast, removeToast } = useToast()

  // State
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
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

  // Track recently added items for button feedback
  const [recentlyAdded, setRecentlyAdded] = useState<Set<number>>(new Set())

  // Refs for scrolling
  const heroRef = useRef<HTMLDivElement>(null)
  const featuredRef = useRef<HTMLElement>(null)
  const productsRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)

  // Ensure light mode only
  useEffect(() => {
    // Remove dark mode class if it exists
    document.documentElement.classList.remove("dark")
  }, [])

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (isCartOpen || isWishlistOpen || mobileMenuOpen || isProductModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isCartOpen, isWishlistOpen, mobileMenuOpen, isProductModalOpen])

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

  // Load products
  useEffect(() => {
    // data 
    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Bamboo Fiber Dinnerware Set",
        category: "kitchenware",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2940&auto=format&fit=crop",
        description:
          "Complete 16-piece dinnerware set made from sustainable bamboo fiber. Dishwasher safe, lightweight, and naturally antibacterial.",
        featured: true,
      },
      {
        id: 2,
        name: "Organic Cotton Reusable Bags",
        category: "bags",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=2787&auto=format&fit=crop",
        description:
          "Set of 5 organic cotton mesh bags perfect for grocery shopping. Machine washable and comes in various sizes.",
        featured: true,
      },
      {
        id: 3,
        name: "Solar-Powered LED Lantern",
        category: "lighting",
        price: 45.99,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2940&auto=format&fit=crop",
        description:
          "Portable solar lantern with USB charging port. Perfect for camping, emergencies, or outdoor gatherings. 12-hour battery life.",
        featured: true,
      },
      {
        id: 4,
        name: "Stainless Steel Water Bottle",
        category: "drinkware",
        price: 32.99,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=2787&auto=format&fit=crop",
        description:
          "Double-walled insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and leak-proof.",
      },
     
      {
        id: 6,
        name: "Recycled Plastic Outdoor Rug",
        category: "home",
        price: 78.99,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2858&auto=format&fit=crop",
        description:
          "Weather-resistant outdoor rug made from 100% recycled plastic bottles. Easy to clean and fade-resistant.",
      },
      {
        id: 7,
        name: "Compost Bin with Charcoal Filter",
        category: "gardening",
        price: 56.99,
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=2940&auto=format&fit=crop",
        description:
          "Countertop compost bin with activated charcoal filter to eliminate odors. Includes compostable bags.",
      },
      {
        id: 8,
        name: "Hemp Fiber Yoga Mat",
        category: "fitness",
        price: 67.99,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2820&auto=format&fit=crop",
        description:
          "Non-slip yoga mat made from natural hemp fiber. Biodegradable, antimicrobial, and provides excellent grip.",
      },
      {
        id: 9,
        name: "Seed Paper Notebook Set",
        category: "stationery",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2874&auto=format&fit=crop",
        description:
          "Set of 3 notebooks made from seed paper. When you're done writing, plant the pages to grow wildflowers.",
      },
      {
        id: 10,
        name: "Wooden Phone Stand",
        category: "accessories",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2940&auto=format&fit=crop",
        description:
          "Handcrafted phone stand made from sustainably sourced bamboo. Compatible with all phone sizes and tablets.",
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

  // Change slide with animation
  const changeSlide = (newSlide: number) => {
    if (isAnimating) return

    setIsAnimating(true)
    setCurrentSlide(newSlide)

    // Reset animation state after transition completes
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

    // Add to recently added items
    setRecentlyAdded((prev) => new Set(prev).add(product.id))

    // Remove from recently added after 2 seconds
    setTimeout(() => {
      setRecentlyAdded((prev) => {
        const newSet = new Set(prev)
        newSet.delete(product.id)
        return newSet
      })
    }, 2000)
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
    } else {
      setWishlist((prev) => [...prev, product])
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
        description: "You've been successfully subscribed to our eco-newsletter.",
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
      description: "Thank you for choosing sustainable products. Your order has been placed successfully.",
      type: "success",
    })
    setCart([])
  }

  // Open product modal
  const openProductModal = (product: Product) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  // Close product modal
  const closeProductModal = () => {
    setIsProductModalOpen(false)
    setSelectedProduct(null)
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already handled by the useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {/* Custom CSS for fonts and animations */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700&display=swap');

        body {
          font-family: 'Inter', sans-serif;
          color: #1c1917;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Merriweather', serif;
          color: #0f172a;
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

        /* Parallax effect */
        .parallax {
          background-attachment: fixed;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }
        
        /* Add cursor styles */
        button, 
        a,
        [role="button"],
        .cursor-pointer,
        input[type="submit"],
        input[type="button"] {
          cursor: pointer;
        }

        /* New hero animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(8deg); }
        }
        
        @keyframes float-reverse {
          0%, 100% { transform: translateY(-10px) rotate(0deg); }
          50% { transform: translateY(10px) rotate(-5deg); }
        }
        
        @keyframes scale-in {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite 2s;
        }
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite 1s;
        }
        
        .animate-float-reverse {
          animation: float-reverse 7s ease-in-out infinite 3s;
        }
        
        .animate-scale-in {
          animation: scale-in 2s ease-out 1s forwards;
        }

        
      `}</style>

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo */}
            <div className="flex items-center min-w-0 flex-1">
              <button
                className="md:hidden mr-4 text-emerald-700 cursor-pointer"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link href="/" className="flex items-center space-x-2">
                <Leaf className="h-8 w-8 text-emerald-600" />
                <span className="text-2xl font-bold text-emerald-800">EcoVibe</span>
              </Link>
            </div>

            {/* Center - Navigation */}
            <div className="hidden md:flex items-center justify-center space-x-8 flex-1">
              <button
                onClick={() => scrollToSection(featuredRef)}
                className="text-stone-700 hover:text-emerald-700 transition-colors cursor-pointer font-medium px-3 py-2 rounded-lg hover:bg-stone-50"
              >
                Featured
              </button>
              <button
                onClick={() => scrollToSection(productsRef)}
                className="text-stone-700 hover:text-emerald-700 transition-colors cursor-pointer font-medium px-3 py-2 rounded-lg hover:bg-stone-50"
              >
                Products
              </button>
              <button
                onClick={() => scrollToSection(aboutRef)}
                className="text-stone-700 hover:text-emerald-700 transition-colors cursor-pointer font-medium px-3 py-2 rounded-lg hover:bg-stone-50"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection(contactRef)}
                className="text-stone-700 hover:text-emerald-700 transition-colors cursor-pointer font-medium px-3 py-2 rounded-lg hover:bg-stone-50"
              >
                Contact
              </button>
            </div>

            {/* Right side - Search and Actions */}
            <div className="flex items-center justify-end space-x-2 min-w-0 flex-1">
              <form onSubmit={handleSearch} className="hidden lg:flex relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-48 border border-stone-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-stone-700 text-sm"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              </form>

              <button className="relative text-stone-700 cursor-pointer p-2 hover:bg-stone-100 rounded-full transition-colors" onClick={() => setIsWishlistOpen(true)}>
                <Heart className={`h-5 w-5 ${wishlist.length > 0 ? "fill-red-500 text-red-500" : ""}`} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-xs">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button className="relative text-stone-700 cursor-pointer p-2 hover:bg-stone-100 rounded-full transition-colors" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-xs">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-stone-200">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => scrollToSection(featuredRef)}
                  className="text-stone-700 hover:text-emerald-700 transition-colors cursor-pointer font-medium text-left px-2 py-1 rounded hover:bg-stone-50"
                >
                  Featured
                </button>
                <button
                  onClick={() => scrollToSection(productsRef)}
                  className="text-stone-700 hover:text-emerald-700 transition-colors cursor-pointer font-medium text-left px-2 py-1 rounded hover:bg-stone-50"
                >
                  Products
                </button>
                <button
                  onClick={() => scrollToSection(aboutRef)}
                  className="text-stone-700 hover:text-emerald-700 transition-colors cursor-pointer font-medium text-left px-2 py-1 rounded hover:bg-stone-50"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection(contactRef)}
                  className="text-stone-700 hover:text-emerald-700 transition-colors cursor-pointer font-medium text-left px-2 py-1 rounded hover:bg-stone-50"
                >
                  Contact
                </button>
                <form onSubmit={handleSearch} className="relative mt-2">
                  <input
                    type="text"
                    placeholder="Search eco products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-stone-400" />
                </form>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero section*/}
      {!searchQuery && (
        <div
          ref={heroRef}
          className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-stone-50 via-emerald-50 to-stone-100 pt-20"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2940&auto=format&fit=crop)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          {/* Animated floating elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              {/* Main content centered */}
              <div className="text-center mb-16">
                

                <h1 className="text-5xl md:text-7xl font-bold mb-8 text-stone-900 leading-tight">
                  <span className="block">Transform Your</span>
                  <span className="block text-emerald-700 relative">
                    Lifestyle
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-emerald-300 rounded-full transform scale-x-0 animate-scale-in"></div>
                  </span>
                </h1>

                <p className="text-xl text-stone-600 mb-12 leading-relaxed max-w-3xl mx-auto">
                  Discover thoughtfully curated eco-friendly products that help you live sustainably without compromising
                  on quality or style. Join thousands making a positive environmental impact.
                </p>

                {/* Action buttons*/}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                  <button
                    onClick={() => scrollToSection(productsRef)}
                    className="group bg-emerald-700 text-white px-10 py-4 rounded-full font-semibold hover:bg-emerald-800 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center space-x-2"
                  >
                    <span>Explore Products</span>
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => scrollToSection(featuredRef)}
                    className="group bg-white/90 backdrop-blur-sm text-emerald-700 px-10 py-4 rounded-full font-semibold border-2 border-emerald-200 hover:bg-emerald-50 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    Featured Collection
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured products */}
      {!searchQuery && (
        <section ref={featuredRef} id="featured" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Leaf className="h-6 w-6 text-emerald-600" />
                <span className="text-emerald-700 font-medium">Featured Collection</span>
              </div>
              <h2 className="text-4xl font-bold mb-4 text-stone-900">Eco Essentials</h2>
              <div className="w-24 h-1 bg-emerald-600 mx-auto mb-6"></div>
              <p className="text-stone-600 max-w-2xl mx-auto">
                Handpicked sustainable products that make a difference. Each item is carefully selected for its
                environmental impact and quality.
              </p>
            </div>

            {/* Full-width carousel */}
            <div className="relative max-w-6xl mx-auto">
              {/* Carousel items */}
              <div className="relative min-h-[400px] sm:min-h-[450px] md:min-h-[500px]">
                {featuredProducts.map((product, index) => (
                  <div key={product.id} className={`carousel-item ${currentSlide === index ? "active" : ""}`}>
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-stone-100 cursor-pointer" onClick={() => openProductModal(product)}>
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/2">
                          <div className="h-48 sm:h-56 md:h-96 overflow-hidden">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                            />
                          </div>
                        </div>
                        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-between">
                          <div>
                            <div className="mb-2 sm:mb-3 text-emerald-600 text-xs sm:text-sm uppercase tracking-wider font-medium">
                              {product.category}
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2 sm:mb-3 leading-tight">{product.name}</h3>
                            <p className="text-stone-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base line-clamp-3">{product.description}</p>
                            <div className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-4 sm:mb-6">${product.price.toFixed(2)}</div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                addToCart(product)
                              }}
                              className={`flex-1 py-3 sm:py-3 rounded-lg font-medium transition-all cursor-pointer shadow-lg text-sm sm:text-base ${
                                recentlyAdded.has(product.id)
                                  ? "bg-green-600 text-white"
                                  : "bg-emerald-700 text-white hover:bg-emerald-800"
                              }`}
                            >
                              {recentlyAdded.has(product.id) ? (
                                <span className="flex items-center justify-center">
                                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                  Added to Cart!
                                </span>
                              ) : (
                                "Add to Cart"
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleWishlist(product)
                              }}
                              className={`w-full sm:w-auto px-4 sm:px-3 py-3 sm:py-3 rounded-lg cursor-pointer shadow-lg flex items-center justify-center sm:block text-sm sm:text-base ${
                                isInWishlist(product.id)
                                  ? "bg-red-100 text-red-500"
                                  : "bg-stone-100 text-stone-500 hover:bg-red-100 hover:text-red-500"
                              } transition-colors`}
                            >
                              <Heart className={`h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-0 ${isInWishlist(product.id) ? "fill-red-500" : ""}`} />
                              <span className="sm:hidden">{isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel indicators */}
              <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
                {featuredProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => changeSlide(index)}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors cursor-pointer ${
                      currentSlide === index ? "bg-emerald-700" : "bg-stone-300"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                    disabled={isAnimating}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products section */}
      <section ref={productsRef} id="products" className="py-20 bg-stone-50 leaf-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Recycle className="h-6 w-6 text-emerald-600" />
              <span className="text-emerald-700 font-medium">Sustainable Products</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 text-stone-900">Our Eco Collection</h2>
            <div className="w-24 h-1 bg-emerald-600 mx-auto mb-6"></div>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Browse our complete range of environmentally conscious products designed for modern sustainable living.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full capitalize transition-all duration-300 cursor-pointer font-medium ${
                  activeCategory === category
                    ? "bg-emerald-700 text-white shadow-lg"
                    : "bg-white text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 shadow-md"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search results info */}
          {searchQuery && (
            <div className="text-center mb-8">
              <p className="text-stone-600">
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
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-stone-100 cursor-pointer"
                  onClick={() => openProductModal(product)}
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
                            : "bg-white/80 text-stone-500 hover:bg-red-100 hover:text-red-500"
                        } transition-colors shadow-lg`}
                      >
                        <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-red-500" : ""}`} />
                      </button>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-stone-800 font-medium text-sm shadow-lg">
                        Click to view details
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-2 text-emerald-600 text-xs uppercase tracking-wider font-medium">
                      {product.category}
                    </div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-stone-900 leading-tight">{product.name}</h3>
                      <span className="text-xl font-bold text-emerald-700">${product.price.toFixed(2)}</span>
                    </div>
                    <p className="text-stone-600 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
                    <div className="flex gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart(product)
                        }}
                        className={`flex-1 py-3 rounded-lg font-medium transition-all cursor-pointer shadow-lg ${
                          recentlyAdded.has(product.id)
                            ? "bg-green-600 text-white"
                            : "bg-emerald-700 text-white hover:bg-emerald-800"
                        }`}
                      >
                        {recentlyAdded.has(product.id) ? (
                          <span className="flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Added to Cart!
                          </span>
                        ) : (
                          "Add to Cart"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-stone-500 text-lg">No products found. Try a different search or category.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About section */}
      <section ref={aboutRef} id="about" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <TreePine className="h-6 w-6 text-emerald-600" />
                <span className="text-emerald-700 font-medium">Our Mission</span>
              </div>
              <h2 className="text-4xl font-bold mb-6 text-stone-900">Sustainable Future Starts Here</h2>
              <div className="w-24 h-1 bg-emerald-600 mx-auto mb-8"></div>
              <p className="text-lg mb-10 leading-relaxed text-stone-600">
                At EcoVibe, we believe that small changes can make a big difference. Founded in 2020, we've been
                committed to providing high-quality, sustainable products that help reduce environmental impact without
                compromising on style or functionality. Every product in our collection is carefully vetted for its
                eco-credentials and ethical sourcing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
                <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Recycle className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-3 text-emerald-700">500K+</div>
                <div className="text-stone-600 font-medium">Plastic Items Replaced</div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
                <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TreePine className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-3 text-emerald-700">10K+</div>
                <div className="text-stone-600 font-medium">Trees Planted</div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
                <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-3 text-emerald-700">100%</div>
                <div className="text-stone-600 font-medium">Carbon Neutral Shipping</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section ref={contactRef} id="contact" className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Leaf className="h-6 w-6 text-emerald-600" />
              <span className="text-emerald-700 font-medium">Get in Touch</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 text-stone-900">Contact Us</h2>
            <div className="w-24 h-1 bg-emerald-600 mx-auto mb-6"></div>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Have questions about our sustainable products or need help choosing the right eco-friendly alternatives?
              We're here to help.
            </p>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-100">
              <h3 className="text-2xl font-semibold mb-6 text-stone-900">Let's Talk Sustainability</h3>
              <p className="text-stone-600 mb-8">
                Whether you're looking for specific eco-friendly products or want to learn more about sustainable
                living, our team is here to guide you on your green journey.
              </p>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-emerald-700"
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
                    <h4 className="font-medium text-lg mb-1 text-stone-900">Address</h4>
                    <p className="text-stone-600">123 Green Street, Eco City, EC 12345</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-emerald-700"
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
                    <h4 className="font-medium text-lg mb-1 text-stone-900">Phone</h4>
                    <p className="text-stone-600">+1 (555) ECO-VIBE</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-emerald-700"
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
                    <h4 className="font-medium text-lg mb-1 text-stone-900">Email</h4>
                    <p className="text-stone-600">hello@ecovibe.example</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-100">
              <h3 className="text-2xl font-semibold mb-6 text-stone-900">Send a Message</h3>
              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-700 text-white py-3 rounded-lg font-medium hover:bg-emerald-800 transition-all cursor-pointer shadow-lg"
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
      <section className="py-16 bg-emerald-700">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Leaf className="h-6 w-6 text-emerald-200" />
              <span className="text-emerald-200 font-medium">Stay Updated</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 !text-white">Join Our Green Community</h2>
            <p className="text-emerald-100 mb-8">
              Subscribe to our newsletter for eco-tips, sustainable product updates, and exclusive green living content.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-6 py-3 rounded-lg border-0 focus:ring-2 focus:ring-emerald-300 focus:outline-none flex-grow max-w-md bg-white text-stone-700 shadow-lg"
                required
              />
              <button
                type="submit"
                className="bg-white text-emerald-700 px-8 py-3 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer whitespace-nowrap font-medium shadow-lg"
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
      <footer className="bg-stone-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Leaf className="h-8 w-8 text-emerald-400" />
                <h3 className="text-2xl font-bold !text-white">EcoVibe</h3>
              </div>
              <p className="text-stone-300 mb-6">
                Your trusted partner in sustainable living. We curate eco-friendly products that help you reduce your
                environmental footprint while maintaining a modern lifestyle.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-emerald-700 transition-colors"
                >
                  <span className="text-white font-bold text-lg">F</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-emerald-700 transition-colors"
                >
                  <span className="text-white font-bold text-lg">I</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-emerald-700 transition-colors"
                >
                  <span className="text-white font-bold text-lg">T</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 !text-white">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="text-stone-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(featuredRef)}
                    className="text-stone-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Featured Products
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(productsRef)}
                    className="text-stone-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Products
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(aboutRef)}
                    className="text-stone-300 hover:text-white transition-colors cursor-pointer"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(contactRef)}
                    className="text-stone-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 !text-white">Categories</h4>
              <ul className="space-y-3">
                {categories.slice(1, 7).map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => {
                        scrollToSection(productsRef)
                        setActiveCategory(category)
                      }}
                      className="text-stone-300 hover:text-white transition-colors capitalize cursor-pointer"
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 !text-white">Sustainability</h4>
              <ul className="space-y-3">
                <li className="text-stone-300">Carbon Neutral Shipping</li>
                <li className="text-stone-300">Plastic-Free Packaging</li>
                <li className="text-stone-300">Tree Planting Program</li>
                <li className="mt-6">
                  <a href="#" className="text-stone-300 hover:text-white transition-colors">
                    Sustainability Report
                  </a>
                </li>
                <li>
                  <a href="#" className="text-stone-300 hover:text-white transition-colors">
                    Eco Certifications
                  </a>
                </li>
                <li>
                  <a href="#" className="text-stone-300 hover:text-white transition-colors">
                    Green Initiatives
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-12 pt-8 text-center text-stone-400">
            <p>
              &copy; {new Date().getFullYear()} EcoVibe. All rights reserved. | Making the world greener, one product at
              a time.
            </p>
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
          <div className="flex items-center justify-between p-6 border-b border-stone-200">
            <h2 className="text-xl font-semibold text-stone-900">Your Cart ({cartItemCount})</h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-stone-100 transition-colors text-stone-700 cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(100vh-250px)]">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-stone-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-12 w-12 text-stone-400" />
                </div>
                <p className="text-stone-500 mb-6">Your cart is empty</p>
                <button
                  onClick={() => {
                    setIsCartOpen(false)
                    scrollToSection(productsRef)
                  }}
                  className="bg-emerald-700 text-white px-6 py-3 rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer shadow-lg"
                >
                  Browse Eco Products
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex border-b border-stone-200 pb-6">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-cover bg-center flex-shrink-0 shadow-md">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-stone-900">{item.name}</h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-red-500 cursor-pointer"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-stone-600 text-sm">${item.price.toFixed(2)}</p>
                      <div className="flex items-center mt-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-md border border-stone-300 hover:bg-stone-100 text-stone-700 cursor-pointer"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="mx-3 w-8 text-center text-stone-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-md border border-stone-300 hover:bg-stone-100 text-stone-700 cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <span className="ml-auto font-medium text-stone-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-stone-200 p-6 bg-stone-50 absolute bottom-0 left-0 right-0">
              <div className="flex justify-between mb-4">
                <span className="font-medium text-stone-900">Subtotal</span>
                <span className="font-bold text-stone-900">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="font-medium text-stone-900">Shipping</span>
                <span className="font-medium text-emerald-700">Carbon Neutral - Free</span>
              </div>
              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold text-stone-900">Total</span>
                <span className="text-lg font-bold text-stone-900">${cartTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-emerald-700 text-white py-3 rounded-lg font-semibold hover:bg-emerald-800 transition-all cursor-pointer shadow-lg"
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
          <div className="flex items-center justify-between p-6 border-b border-stone-200">
            <h2 className="text-xl font-semibold text-stone-900">Your Wishlist ({wishlist.length})</h2>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 rounded-full hover:bg-stone-100 transition-colors text-stone-700 cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(100vh-180px)]">
            {wishlist.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-stone-100 rounded-full flex items-center justify-center">
                  <Heart className="h-12 w-12 text-stone-400" />
                </div>
                <p className="text-stone-500 mb-6">Your wishlist is empty</p>
                <button
                  onClick={() => {
                    setIsWishlistOpen(false)
                    scrollToSection(productsRef)
                  }}
                  className="bg-emerald-700 text-white px-6 py-3 rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer shadow-lg"
                >
                  Explore Eco Products
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {wishlist.map((item) => (
                  <div key={item.id} className="flex border-b border-stone-200 pb-6">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-cover bg-center flex-shrink-0 shadow-md">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-stone-900">{item.name}</h3>
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="text-red-500 hover:text-red-600 cursor-pointer"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-stone-600 text-sm">${item.price.toFixed(2)}</p>
                      <div className="flex items-center mt-3">
                        <button
                          onClick={() => {
                            addToCart(item)
                            toggleWishlist(item)
                          }}
                          className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-800 transition-colors cursor-pointer shadow-lg"
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

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        onAddToCart={addToCart}
        onToggleWishlist={toggleWishlist}
        isInWishlist={isInWishlist}
        recentlyAdded={recentlyAdded}
      />
    </div>
  )
}
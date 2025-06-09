"use client"
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { Leaf, Handshake, Globe, Award, Sparkles, Zap } from 'lucide-react';


interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  size?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  badge?: string;
}

interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

const PRODUCT_DATA: Product[] = [
  {
    id: 1,
    name: 'Essential Hoodie',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://i.ibb.co/wN8Dpb82/photo-1556821840-3a63f95609a7.jpg', 
    category: 'Hoodies',
    size: 'S-M-L-XL',
    description: 'Minimalist cotton hoodie with clean lines and premium construction.',
    rating: 4.8,
    reviews: 124,
    badge: 'Best Seller'
  },
  {
    id: 2,
    name: 'Classic Tee',
    price: 24.99,
    image: 'https://i.ibb.co/QF4HKVW1/photo-1521572163474-6864f9cf17ab.jpg', 
    category: 'T-Shirts',
    size: 'XS-S-M-L-XL',
    description: 'Timeless t-shirt crafted from 100% organic cotton with perfect fit.',
    rating: 4.6,
    reviews: 89
  },
  {
    id: 3,
    name: 'Tailored Trousers',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://i.ibb.co/C5mvqDK4/photo-1594633312681-425c7b97ccd1.jpg', 
    category: 'Pants',
    size: '28-30-32-34-36',
    description: 'Modern tailored trousers with clean silhouette and premium fabric.',
    rating: 4.7,
    reviews: 156
  },
  {
    id: 4,
    name: 'Minimal Sneakers',
    price: 129.99,
    image: 'https://i.ibb.co/6pqnH5s/photo-1549298916-b41d501d3772.jpg', 
    category: 'Footwear',
    size: 'US 7-11',
    description: 'Clean white sneakers with premium leather and minimalist design.',
    rating: 4.9,
    reviews: 203,
    badge: 'New'
  },
  {
    id: 5,
    name: 'Wool Coat',
    price: 249.99,
    image: 'https://i.ibb.co/27hw72kW/photo-1539533018447-63fcce2678e3.jpg', 
    category: 'Outerwear',
    size: 'S-M-L-XL',
    description: 'Elegant wool coat with timeless cut and luxurious finish.',
    rating: 4.8,
    reviews: 67
  },
  {
    id: 6,
    name: 'Silk Dress',
    price: 159.99,
    originalPrice: 199.99,
    image: 'https://i.ibb.co/nsKf9zjf/photo-1595777457583-95e059d581b8.jpg', 
    category: 'Dresses',
    size: 'XS-S-M-L',
    description: 'Flowing silk dress with modern silhouette and refined details.',
    rating: 4.5,
    reviews: 92
  },
  {
    id: 7,
    name: 'Denim Jacket',
    price: 89.99,
    image: 'https://i.ibb.co/XffsgQB1/photo-1551698618-1dfe5d97d256.jpg', 
    category: 'Outerwear',
    size: 'S-M-L-XL',
    description: 'Classic denim jacket with modern fit and premium wash.',
    rating: 4.6,
    reviews: 78
  },
  {
    id: 8,
    name: 'Knit Sweater',
    price: 69.99,
    image: 'https://i.ibb.co/S7yf1scw/photo-1576566588028-4147f3842f27.jpg', 
    category: 'Sweaters',
    size: 'S-M-L-XL',
    description: 'Cozy knit sweater perfect for layering and everyday wear.',
    rating: 4.7,
    reviews: 134
  }
];

const FEATURED_COLLECTIONS = [
  {
    id: 1,
    title: 'ESSENTIALS',
    description: 'Timeless pieces for everyday elegance',
    image: 'https://i.ibb.co/spS3g5VX/photo-1441986300917-64674bd600d8.jpg'
  },
  {
    id: 2,
    title: 'MINIMALIST',
    description: 'Clean lines and refined simplicity',
    image: 'https://i.ibb.co/k2Pv7Z3r/photo-1469334031218-e382a71b716b.jpg'
  }
];

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const buttonVariants = {
  hover: { 
    scale: 1.05,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
  },
  tap: { scale: 0.95 }
};

const cardVariants = {
  hover: { 
    y: -8,
    scale: 1.02,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
  }
};

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.4 }
  }
};

const ShoppingApp = () => {
  const [products] = useState<Product[]>(PRODUCT_DATA);
  const [collections] = useState(FEATURED_COLLECTIONS);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(PRODUCT_DATA);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showQuickView, setShowQuickView] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [showCheckoutSuccessNotification, setShowCheckoutSuccessNotification] = useState<boolean>(false);
  const [checkoutSuccessMessage, setCheckoutSuccessMessage] = useState<string>('');
  const [favoriteItems, setFavoriteItems] = useState<number[]>([]);
  const [showSubscribeNotification, setShowSubscribeNotification] = useState<boolean>(false);
  const [subscribeMessage, setSubscribeMessage] = useState<string>('');
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [showFeatureNotification, setShowFeatureNotification] = useState<boolean>(false);
  const [featureNotificationMessage, setFeatureNotificationMessage] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactErrors, setContactErrors] = useState({ name: '', email: '', message: '' });

  
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeError, setSubscribeError] = useState('');

  const productsRef = useRef<HTMLDivElement>(null);
  const allProductsSectionRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  
  const categories = ['All', ...new Set(products.map(product => product.category))];
  const featuredProducts = products.slice(0, 4);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring', 
        stiffness: 100,
        damping: 12
      }
    }
  };

  const filterProducts = (category: string, query: string = '') => {
    setActiveCategory(category);
    setSearchQuery(query);
    
    // Auto-switch to products page when search is performed
    if (query.trim()) {
      setCurrentPage('products');
    }
    
    let filtered = [...products];
    
    if (category !== 'All') {
      filtered = filtered.filter(product => product.category === category);
    }
    
    if (query) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) || 
        product.description?.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  };

  const addToCart = (product: Product, size?: string) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.id === product.id && item.selectedSize === size
      );
      
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1, selectedSize: size }];
      }
    });
    
    const sizeText = size ? ` (Size: ${size})` : '';
    setNotificationMessage(`${product.name}${sizeText} added to cart!`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const removeFromCart = (productId: number, size?: string) => {
    setCartItems(prevItems => 
      prevItems.filter(item => !(item.id === productId && item.selectedSize === size))
    );
  };

  const updateQuantity = (productId: number, newQuantity: number, size?: string) => {
    if (newQuantity < 1) {
      removeFromCart(productId, size);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId && item.selectedSize === size
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  useEffect(() => {
    setIsMounted(true);
    
    const newTotalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const newTotalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    setTotalItems(newTotalItems);
    setTotalPrice(newTotalPrice);
  }, [cartItems]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Prevent background scrolling when sidebars or modals are open
  useEffect(() => {
    if (showCart || showFavorites || showQuickView) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCart, showFavorites, showQuickView]);

  // Initialize filtered products on component mount
  useEffect(() => {
    setFilteredProducts(PRODUCT_DATA);
  }, []);

  const scrollToAllProducts = () => {
    allProductsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const exploreCollection = (collectionTitle: string) => {
    const categoryMap: { [key: string]: string } = {
      'ESSENTIALS': 'T-Shirts',
      'MINIMALIST': 'Outerwear'
    };
    
    const category = categoryMap[collectionTitle] || 'All';
    filterProducts(category);
    setTimeout(() => {
      allProductsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  const viewProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize('');
    setQuantity(1);
    setShowQuickView(true);
  };

  const handleQuickViewAddToCart = () => {
    if (selectedProduct && selectedSize) {
      for (let i = 0; i < quantity; i++) {
        addToCart(selectedProduct, selectedSize);
      }
      setShowQuickView(false);
      setSelectedSize('');
      setQuantity(1);
    }
  };

  const toggleFavorite = (productId: number) => {
    setFavoriteItems(prevFavorites => {
      if (prevFavorites.includes(productId)) {
        return prevFavorites.filter(id => id !== productId);
      } else {
        return [...prevFavorites, productId];
      }
    });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    let error = '';
    if (!subscribeEmail.trim()) {
      error = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(subscribeEmail)) {
      error = 'Email address is invalid.';
    }

    if (error) {
      setSubscribeError(error);
      setShowSubscribeNotification(false); 
    } else {
      setSubscribeError('');
      
    setSubscribeMessage('Successfully subscribed to our newsletter!');
    setShowSubscribeNotification(true);
    setTimeout(() => setShowSubscribeNotification(false), 4000);
      setSubscribeEmail(''); 
    }
  };

  const showComingSoonNotification = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, featureName: string) => {
    event.preventDefault();
    setFeatureNotificationMessage(`${featureName} feature is under development.`);
    setShowFeatureNotification(true);
    setTimeout(() => setShowFeatureNotification(false), 4000);
  };

  const validateContactForm = () => {
    const errors = { name: '', email: '', message: '' };
    let isValid = true;

    if (!contactForm.name.trim()) {
      errors.name = 'Name is required.';
      isValid = false;
    }

    if (!contactForm.email.trim()) {
      errors.email = 'Email is required.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(contactForm.email)) {
      errors.email = 'Email address is invalid.';
      isValid = false;
    }

    if (!contactForm.message.trim()) {
      errors.message = 'Message is required.';
      isValid = false;
    }

    setContactErrors(errors);
    return isValid;
  };

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
    
    
    if (contactErrors[name as keyof typeof contactErrors]) {
      setContactErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateContactForm()) {
      console.log('Form submitted successfully:', contactForm);
      
      
      setNotificationMessage('Your message has been sent successfully!');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 4000);

      
      setContactForm({ name: '', email: '', message: '' });
      setContactErrors({ name: '', email: '', message: '' });
    } else {
      console.log('Form validation failed');
      
      
      
      
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Head>
        <title>UrbanThreads | Premium Fashion</title>
        <meta name="description" content="Elegant clothing store built with Next.js and TypeScript" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full filter blur-3xl opacity-20 ${
          isDarkMode ? 'bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600' : 'bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200'
        }`}></div>
        <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full filter blur-3xl opacity-20 ${
          isDarkMode ? 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600' : 'bg-gradient-to-tr from-blue-200 via-indigo-200 to-purple-200'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full filter blur-3xl opacity-10 ${
          isDarkMode ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600' : 'bg-gradient-to-r from-violet-200 via-purple-200 to-pink-200'
        }`}></div>
        
        <div className={`absolute inset-0 pattern-dots opacity-30 ${isDarkMode ? '' : 'hidden'}`}></div>
      </div>

      <nav className={`fixed w-full backdrop-blur-xl z-50 border-b transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-900/90 border-gray-700/50 shadow-lg shadow-gray-900/20' 
          : 'bg-white/90 border-gray-200/50 shadow-lg shadow-gray-900/10'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="cursor-pointer"
                whileHover={{ scale: 1.02 }}
              onClick={() => {
                setCurrentPage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              >
                <span className={`text-2xl font-bold tracking-tight text-gradient`}>UrbanThreads</span>
              </motion.div>
              
            <div className="flex items-center">
              <div className="hidden md:flex items-center space-x-6 mr-6"> 
              <motion.button 
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCurrentPage('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                className={`transition-all duration-200 font-medium cursor-pointer ${
                    currentPage === 'home' 
                      ? (isDarkMode ? 'text-white' : 'text-gray-900')
                      : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                  }`}
                >
                  Home
                </motion.button>
                
                <motion.button 
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCurrentPage('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`transition-all duration-200 font-medium cursor-pointer ${
                    currentPage === 'about' 
                      ? (isDarkMode ? 'text-white' : 'text-gray-900')
                      : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                  }`}
                >
                  About
                </motion.button>
                
                <motion.button 
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCurrentPage('products');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`transition-all duration-200 font-medium cursor-pointer ${
                    currentPage === 'products' 
                      ? (isDarkMode ? 'text-white' : 'text-gray-900')
                      : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                  }`}
                >
                  Products
                </motion.button>
                
                <motion.button 
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCurrentPage('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`transition-all duration-200 font-medium cursor-pointer ${
                    currentPage === 'contact' 
                      ? (isDarkMode ? 'text-white' : 'text-gray-900')
                      : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                }`}
              >
                Contact
              </motion.button>
            </div>
            
              
              <div className="hidden md:flex items-center space-x-4"> 
                
              <div className="hidden lg:flex items-center">
                <div className={`relative ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      filterProducts(activeCategory, e.target.value);
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        setCurrentPage('products');
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    className={`w-full pl-10 pr-4 py-3 rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

                
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-3 rounded-full transition-all duration-200 cursor-pointer ${
                  isDarkMode 
                    ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </motion.button>

                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFavorites(true)}
                  className={`p-3 rounded-full transition-all duration-200 cursor-pointer relative ${
                  isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900'
                  }`}
                >
                    <svg className="w-5 h-5" fill={favoriteItems.length > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {favoriteItems.length > 0 && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`absolute -top-1 -right-1 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold ${
                          isDarkMode ? 'bg-pink-500' : 'bg-red-500'
                        }`}
                      >
                        {favoriteItems.length}
                      </motion.span>
                  )}
                </motion.button>

                
              <motion.div 
                className="relative cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  onClick={() => setShowCart(true)}
                    className={`p-3 rounded-full transition-all duration-200 cursor-pointer ${ 
                    isDarkMode 
                        ? 'bg-gray-700 text-white hover:bg-gray-600' 
                        : 'bg-gray-900 text-white hover:bg-gray-800 minimal-shadow hover:modern-shadow'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7a2 2 0 01-2 2H8a2 2 0 01-2-2L5 9z" />
                  </svg>
                </motion.div>
                {totalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`absolute -top-2 -right-2 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 ${
                      isDarkMode 
                        ? 'bg-red-500 border-gray-900' 
                        : 'bg-red-500 border-white'
                    }`}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.div>
              </div> 

              
              <div className="md:hidden flex items-center ml-auto"> 
                <motion.button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`p-2 rounded-md transition-all duration-200 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  aria-label="Toggle menu"
                  whileTap={{ scale: 0.90 }}
                >
                  {isMobileMenuOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`fixed top-20 left-0 right-0 z-40 shadow-lg md:hidden ${isDarkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'}`}
          >
            <div className="px-6 py-6 space-y-1">

              {[ 'Home', 'About', 'Products', 'Contact' ].map((item) => (
                <motion.button
                  key={item}
                  onClick={() => {
                    setCurrentPage(item.toLowerCase());
                    setIsMobileMenuOpen(false); 
                  }}
                  className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium transition-colors ${
                    currentPage === item.toLowerCase()
                      ? (isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900')
                      : (isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900')
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {item}
                </motion.button>
              ))}

              
              <div className={`pt-4 mt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <motion.button
                  onClick={() => {
                    setIsDarkMode(!isDarkMode);
                    
                  }}
                  className={`flex items-center w-full text-left px-3 py-3 rounded-md text-base font-medium transition-colors ${
                    isDarkMode ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {isDarkMode ? (
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
                  ) : (
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                  )}
                  Dark Mode
                </motion.button>

                <motion.button
                  onClick={() => {
                    setShowFavorites(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full text-left px-3 py-3 rounded-md text-base font-medium transition-colors relative ${
                    isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-5 h-5 mr-3" fill={favoriteItems.length > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  Favorites
                  {favoriteItems.length > 0 && (
                    <span className={`ml-auto text-xs font-bold px-2 py-1 rounded-full ${isDarkMode ? 'bg-pink-500 text-white' : 'bg-red-500 text-white'}`}>{favoriteItems.length}</span>
                  )}
                </motion.button>

                <motion.button
                  onClick={() => {
                    setShowCart(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full text-left px-3 py-3 rounded-md text-base font-medium transition-colors relative ${
                    isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7a2 2 0 01-2 2H8a2 2 0 01-2-2L5 9z" /></svg>
                  Cart
                  {totalItems > 0 && (
                    <span className={`ml-auto text-xs font-bold px-2 py-1 rounded-full ${isDarkMode ? 'bg-red-500 text-white' : 'bg-red-500 text-white'}`}>{totalItems}</span>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-16 md:pt-24">
        
        {currentPage === 'home' && (
          <>
            
        <motion.section 
          initial="hidden"
          animate={isMounted ? "visible" : "hidden"}
          variants={variants}
          className={`relative min-h-screen flex items-center overflow-hidden transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}
        >
          
          <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full filter blur-3xl opacity-20 ${
                  isDarkMode ? 'bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600' : 'bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200'
            }`}></div>
                <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full filter blur-3xl opacity-20 ${
                  isDarkMode ? 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600' : 'bg-gradient-to-tr from-blue-200 via-indigo-200 to-purple-200'
            }`}></div>
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full filter blur-3xl opacity-10 ${
                  isDarkMode ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600' : 'bg-gradient-to-r from-violet-200 via-purple-200 to-pink-200'
            }`}></div>
                
                <div className={`absolute inset-0 pattern-dots opacity-30 ${isDarkMode ? '' : 'hidden'}`}></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32 flex flex-col lg:flex-row items-center gap-20 relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="lg:w-1/2 relative"
                >
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <div className="relative">
                      
                      <div className={`absolute -top-4 -left-4 w-24 h-24 rounded-full filter blur-xl opacity-60 ${
                        isDarkMode ? 'bg-purple-500' : 'bg-purple-200'
                      }`}></div>
                      <div className={`absolute -bottom-4 -right-4 w-32 h-32 rounded-full filter blur-xl opacity-60 ${
                        isDarkMode ? 'bg-blue-500' : 'bg-blue-200'
                      }`}></div>
                      
                      <img 
                        src="https://i.ibb.co/1tg7V22y/photo-1515886657613-9f3515b0c78f.jpg" 
                        alt="Minimalist fashion model" 
                        className={`rounded-3xl max-h-[700px] w-auto mx-auto relative z-10 ${
                          isDarkMode ? 'shadow-2xl shadow-gray-900/50' : 'shadow-2xl shadow-gray-900/20'
                        }`}
                      />
                    </div>
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:w-1/2"
            >
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mb-12"
              >
                <motion.h1 
                  className={`text-5xl md:text-6xl lg:text-7xl font-bold font-heading mb-8 leading-[0.9] tracking-tight ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  Minimalist{' '}
                  <span className="text-gradient">
                    Fashion
                  </span>
                </motion.h1>
                <motion.p 
                  className={`text-xl mb-12 leading-relaxed max-w-lg font-light ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  Curated collections that embody simplicity, quality, and timeless design for the modern wardrobe.
                </motion.p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex flex-col sm:flex-row gap-6"
              >
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setCurrentPage('products')}
                  className={`px-12 py-4 font-medium rounded-full transition-all duration-200 glow-effect cursor-pointer ${
                    isDarkMode 
                      ? 'bg-white hover:opacity-90 text-black' 
                      : 'bg-gray-900 hover:bg-gray-800 text-white minimal-shadow hover:modern-shadow'
                  }`}
                >
                  Explore Collection
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                      onClick={() => setCurrentPage('about')}
                  className={`px-12 py-4 font-medium rounded-full transition-all duration-200 cursor-pointer ${
                    isDarkMode 
                      ? 'border border-gray-600 hover:border-gray-500 text-gray-300 hover:bg-gray-800' 
                      : 'border border-gray-300 hover:border-gray-400 text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Learn More
                </motion.button>
              </motion.div>
            </motion.div>
              </div>
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
            >
              <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg className={`w-8 h-8 mx-auto ${
                    isDarkMode ? 'text-white/70' : 'text-gray-600/80'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </motion.div>
              </motion.div>
            </motion.section>

            
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }} 
              variants={SECTION_VARIANTS}
              className={`py-20 transition-colors duration-300 ${
                isDarkMode ? '' : '' 
              }`}
            >
              <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                <motion.div
                  variants={itemVariants}
                  className="space-y-8"
                >
                  <motion.h2 
                    className={`text-3xl md:text-4xl font-bold font-heading tracking-tight ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Crafted for the Modern Individual
                  </motion.h2>
                  <motion.p 
                    className={`text-lg md:text-xl leading-relaxed font-light max-w-3xl mx-auto ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    At UrbanThreads, we believe in the power of simplicity. Our carefully curated collection features 
                    timeless pieces that transcend seasonal trends, focusing on quality craftsmanship, sustainable materials, 
                    and designs that effortlessly complement your lifestyle.
                  </motion.p>
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
                    variants={containerVariants}
                  >
                    {[
                      { 
                        icon: <Award size={48} className="mb-4 mx-auto" />,
                        title: "Premium Quality", 
                        description: "Handpicked materials and meticulous craftsmanship in every piece" 
                      },
                      { 
                        icon: <Sparkles size={48} className="mb-4 mx-auto" />,
                        title: "Sustainable Fashion", 
                        description: "Environmentally conscious production with ethical sourcing" 
                      },
                      { 
                        icon: <Zap size={48} className="mb-4 mx-auto" />,
                        title: "Timeless Design", 
                        description: "Classic aesthetics that remain relevant season after season" 
                      }
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className={`p-6 rounded-2xl glass-morphism transition-all duration-300 hover:scale-105 ${
                          isDarkMode
                            ? 'bg-gray-800/70 backdrop-blur-lg border border-gray-700/50 shadow-lg hover:bg-gray-700/90'
                            : 'bg-gray-100/85 backdrop-blur-lg border border-gray-300 shadow-lg hover:bg-gray-200/85'
                        }`}
                      >
                        <div className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{feature.icon}</div>
                        <h3 className={`text-xl font-semibold font-heading mb-3 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {feature.title}
                        </h3>
                        <p className={`text-sm leading-relaxed ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {feature.description}
                        </p>
                      </motion.div>
                    ))}
              </motion.div>
            </motion.div>
          </div>
            </motion.section>

            
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }} 
              variants={containerVariants}
              className={`py-24 transition-colors duration-300 ${
                isDarkMode ? '' : '' 
              }`}
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div variants={itemVariants} className="text-center mb-16">
                  <h2 className={`text-4xl md:text-5xl font-bold font-heading tracking-tight mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Featured Products
                  </h2>
                  <p className={`text-lg max-w-2xl mx-auto leading-relaxed font-light ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Discover our handpicked selection of must-have pieces that define contemporary style
                  </p>
                </motion.div>
          
          <motion.div 
                  variants={containerVariants}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
                >
                  {featuredProducts.map((product, index) => (
            <motion.div
                      key={product.id}
                      variants={itemVariants}
                      className={`rounded-3xl overflow-hidden group relative cursor-pointer card-hover flex flex-col min-h-[500px] ${
                        isDarkMode 
                          ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/70' 
                          : 'bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:border-gray-300/70 minimal-shadow'
                      }`}
                      onClick={() => viewProductDetails(product)}
                    >
                      <div className="relative aspect-square overflow-hidden">
                        {product.badge && (
                          <div className="absolute top-3 left-3 z-10">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              product.badge === 'Best Seller' 
                                ? (isDarkMode 
                                    ? 'bg-gray-700 text-gray-200 border border-gray-500'
                                    : 'bg-gray-800 text-white border border-gray-600')
                                : (isDarkMode 
                                    ? 'bg-gray-600 text-gray-300 border border-gray-500'
                                    : 'bg-gray-200 text-gray-700 border border-gray-300')
                            }`}>
                              {product.badge}
                            </span>
                          </div>
                        )}
                        
                        <div className="absolute top-4 right-4 z-10 transition-all duration-300">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-3 rounded-full backdrop-blur-md transition-all duration-200 shadow-lg cursor-pointer ${
                              favoriteItems.includes(product.id)
                                ? (isDarkMode 
                                    ? 'bg-red-500 text-white border border-red-400' 
                                    : 'bg-red-500 text-white border border-red-400')
                                : (isDarkMode 
                                    ? 'bg-gray-900/80 text-white hover:bg-gray-800 border border-gray-700/50' 
                                    : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 border border-gray-200/50')
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(product.id);
                            }}
                          >
                            <svg className="w-5 h-5" fill={favoriteItems.includes(product.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
                          </motion.button>
                        </div>
                        
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                </div>
                      
                      <div className="p-6 flex flex-col flex-1">
                        {/* Header Section */}
                        <div className="mb-3">
                          <h3 className={`text-lg font-semibold font-heading mb-2 tracking-tight ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>{product.name}</h3>
                          <p className={`text-sm font-medium uppercase tracking-wider ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>{product.category}</p>
                        </div>
                        
                        {/* Price Section */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xl font-bold ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              ${product.price.toFixed(2)}
                            </span>
                            {product.originalPrice && (
                              <span className={`text-sm line-through ${
                                isDarkMode ? 'text-gray-500' : 'text-gray-400'
                              }`}>
                                ${product.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          {/* Fixed height container for discount tag */}
                          <div className="h-5 flex items-center">
                            {product.originalPrice && (
                              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                isDarkMode 
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                                  : 'bg-red-50 text-red-600 border border-red-200'
                              }`}>
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Rating Section */}
                        {product.rating && (
                          <div className="flex items-center gap-1 justify-end mb-4">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className={`text-sm font-medium ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {product.rating}
                            </span>
                          </div>
                        )}
                        
                        {/* Spacer to push button to bottom */}
                        <div className="flex-grow"></div>
                        
                        {/* Add to Cart Button - Always at bottom */}
                        <motion.button
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={(e) => {
                            e.stopPropagation();
                            const defaultSize = product.size?.split('-')[0];
                            addToCart(product, defaultSize);
                          }}
                          className={`w-full px-4 py-3 font-semibold rounded-xl transition-all duration-200 text-sm cursor-pointer ${
                            isDarkMode 
                              ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl' 
                              : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                          }`}
                        >
                          Add to Cart
                        </motion.button>
                      </div>
              </motion.div>
                  ))}
          </motion.div>

                <motion.div variants={itemVariants} className="text-center">
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setCurrentPage('products')}
                    className={`px-12 py-4 font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                      isDarkMode 
                        ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl' 
                        : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    Explore All Products
                  </motion.button>
            </motion.div>
          </div>
        </motion.section>

            
            <motion.section 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }} 
              variants={SECTION_VARIANTS}
              className={`py-20 transition-colors duration-300 ${
                isDarkMode ? '' : '' 
              }`}
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                <motion.h2 
                  variants={itemVariants}
                  className={`text-3xl md:text-4xl font-bold font-heading mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Stay Updated
                </motion.h2>
                <motion.p
                  variants={itemVariants}
                  className={`text-lg mb-8 max-w-2xl mx-auto ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Subscribe to our newsletter and be the first to know about new collections, exclusive offers, and style tips.
                </motion.p>
                <motion.form
                  variants={itemVariants}
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                  noValidate
                >
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      required
                      value={subscribeEmail}
                      onChange={(e) => {
                        setSubscribeEmail(e.target.value);
                        if (subscribeError) setSubscribeError('');
                      }}
                      className={`w-full px-6 py-3 rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 ${subscribeError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500'} ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                    {subscribeError && (
                      <p className="text-sm text-red-500 mt-1 absolute left-2 whitespace-nowrap">
                        {subscribeError}
                      </p>
                    )}
                  </div>
                  <motion.button
                    type="submit"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className={`px-8 py-3 font-semibold rounded-full transition-all duration-200 cursor-pointer self-start ${
                      isDarkMode 
                        ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl' 
                        : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    Subscribe
                  </motion.button>
                </motion.form>
              </div>
            </motion.section>
          </>
        )}

        
        {currentPage === 'about' && (
        <motion.section 
          initial="hidden"
            animate="visible"
            exit="hidden"
            variants={pageTransition}
            className={`min-h-screen pt-24 pb-20 transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-900' : 'bg-white'
            }`}
          >
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
              <motion.div variants={containerVariants} className="space-y-20">
                <motion.div variants={itemVariants} className="text-center">
                  <h1 className={`text-5xl md:text-6xl font-bold font-heading mb-6 tracking-tight ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    About UrbanThreads
                  </h1>
                  <p className={`text-xl leading-relaxed max-w-3xl mx-auto font-light ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    We're redefining fashion through minimalist design, sustainable practices, and uncompromising quality.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-16 items-center">
                  <div>
                    <h2 className={`text-3xl font-bold font-heading mb-6 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Our Story
                    </h2>
                    <p className={`text-lg leading-relaxed mb-6 font-light ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Founded in 2020, UrbanThreads emerged from a simple belief: fashion should be timeless, sustainable, and accessible. Our founders, frustrated with fast fashion's environmental impact and poor quality, set out to create a brand that prioritizes craftsmanship over trends.
                    </p>
                    <p className={`text-lg leading-relaxed font-light ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Today, we partner with ethical manufacturers worldwide, using only sustainable materials and ensuring fair labor practices throughout our supply chain.
                    </p>
          </div>
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3" 
                      alt="Our story" 
                      className="rounded-3xl shadow-2xl"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Sustainable Materials",
                      description: "We source only organic, recycled, and renewable materials for all our products.",
                      icon: <Leaf size={48} className="text-5xl mb-6 mx-auto" /> 
                    },
                    {
                      title: "Ethical Production",
                      description: "Fair wages, safe working conditions, and transparent supply chains are non-negotiable.",
                      icon: <Handshake size={48} className="text-5xl mb-6 mx-auto" /> 
                    },
                    {
                      title: "Carbon Neutral",
                      description: "We offset 100% of our carbon footprint through verified environmental projects.",
                      icon: <Globe size={48} className="text-5xl mb-6 mx-auto" /> 
                    }
                  ].map((value, index) => (
          <motion.div 
                      key={index}
                      variants={itemVariants}
                      className={`p-8 rounded-3xl text-center glass-morphism hover:scale-105 transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gray-800/70 backdrop-blur-lg border border-gray-700/50 shadow-lg hover:bg-gray-700/90'
                          : 'bg-gray-100/85 backdrop-blur-lg border border-gray-300 shadow-lg hover:bg-gray-200/85'
                      }`}
                    >
                      <div className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value.icon}</div>
                      <h3 className={`text-xl font-semibold font-heading mb-4 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {value.title}
                      </h3>
                      <p className={`leading-relaxed font-light ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {value.description}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div variants={itemVariants} className="text-center">
                  <h2 className={`text-3xl font-bold font-heading mb-8 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Our Impact
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {[
                      { number: "50K+", label: "Happy Customers" },
                      { number: "1M+", label: "Trees Planted" },
                      { number: "100%", label: "Carbon Neutral" }
                    ].map((stat, index) => (
            <motion.div
                        key={index}
                        variants={itemVariants}
                        className="text-center"
                      >
                        <div className={`text-4xl font-bold font-heading mb-2 text-gradient`}>
                          {stat.number}
                        </div>
                        <div className={`text-lg ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="text-center">
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setCurrentPage('home')}
                    className={`px-12 py-4 font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                      isDarkMode 
                        ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl' 
                        : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    Back to Home
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </motion.section>
        )}

        
        {currentPage === 'contact' && (
          <motion.section
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={pageTransition}
            className={`min-h-screen pt-24 pb-20 transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-900' : 'bg-white'
            }`}
          >
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
              <motion.div variants={containerVariants} className="space-y-16">
                <motion.div variants={itemVariants} className="text-center">
                  <h1 className={`text-5xl md:text-6xl font-bold font-heading mb-6 tracking-tight ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Contact Us
                  </h1>
                  <p className={`text-xl leading-relaxed max-w-2xl mx-auto font-light ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    We'd love to hear from you. Get in touch with us for any questions, feedback, or just to say hello.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-12">
                  <div className={`p-8 rounded-3xl glass-morphism ${
                    isDarkMode
                      ? 'bg-gray-800/70 backdrop-blur-lg border border-gray-700/50 shadow-lg'
                      : 'bg-gray-100/85 backdrop-blur-lg border border-gray-300 shadow-lg'
                  }`}>
                    <h3 className={`text-2xl font-bold font-heading mb-6 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Get in Touch
                    </h3>
                <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <svg className={`w-6 h-6 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
                    </div>
                        <div>
                          <p className={`font-semibold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>Phone</p>
                          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>+1 (555) 123-4567</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <svg className={`w-6 h-6 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                        <div>
                          <p className={`font-semibold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>Email</p>
                          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>info@urbanthreads.com</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <svg className={`w-6 h-6 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                        <div>
                          <p className={`font-semibold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>Address</p>
                          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>123 Fashion Street, Style City, SC 98765</p>
                </div>
                      </div>
                    </div>
                  </div>

                  <div className={`p-8 rounded-3xl glass-morphism ${
                    isDarkMode
                      ? 'bg-gray-800/70 backdrop-blur-lg border border-gray-700/50 shadow-lg'
                      : 'bg-gray-100/85 backdrop-blur-lg border border-gray-300 shadow-lg'
                  }`}>
                    <h3 className={`text-2xl font-bold font-heading mb-6 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Send Message
                    </h3>
                <form onSubmit={handleContactSubmit} className="space-y-6" noValidate> 
                  <div>
                    <input 
                      type="text" 
                      name="name" 
                          placeholder="Your Name"
                      value={contactForm.name} 
                      onChange={handleContactFormChange} 
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 ${contactErrors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500'} ${
                            isDarkMode 
                              ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                    />
                    {contactErrors.name && <p className="text-sm text-red-500 mt-1">{contactErrors.name}</p>} 
                  </div>
                  <div>
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Your Email"
                      value={contactForm.email}
                      onChange={handleContactFormChange}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 ${contactErrors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500'} ${
                        isDarkMode 
                          ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                    {contactErrors.email && (
                      <div className="mb-4">
                        <p className="text-sm text-red-500 mt-1">{contactErrors.email}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <textarea 
                      rows={4} 
                      name="message" 
                          placeholder="Your Message"
                      value={contactForm.message} 
                      onChange={handleContactFormChange} 
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 ${contactErrors.message ? 'border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500'} resize-none ${
                            isDarkMode 
                              ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                    ></textarea>
                    {contactErrors.message && <p className="text-sm text-red-500 mt-1">{contactErrors.message}</p>} 
                  </div>
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    type="submit"
                        className="w-full px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-xl transition-all duration-300 shadow-xl cursor-pointer"
                  >
                    Send Message
                  </motion.button>
                </form>
                  </div>
            </motion.div>

                <motion.div variants={itemVariants} className="text-center">
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setCurrentPage('home')}
                    className={`px-12 py-4 font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                      isDarkMode 
                        ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600' 
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
                    }`}
                  >
                    Back to Home
                  </motion.button>
          </motion.div>
              </motion.div>
          </div>
        </motion.section>
        )}

        
        {currentPage === 'products' && (
          <>
            
        <motion.section 
          ref={productsRef}
          initial="hidden"
            animate="visible"
            exit="hidden"
          viewport={{ once: true, amount: 0.2 }} 
          variants={containerVariants}
          className={`pt-8 md:pt-16 pb-16 md:pb-32 relative overflow-hidden transition-colors duration-300 ${
                isDarkMode ? '' : '' 
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            {/* Hide Collections section when search is active */}
            {!searchQuery && (
              <>
                <motion.h2 
                  variants={itemVariants}
                  className={`text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-center mb-3 md:mb-4 tracking-tight ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Collections
                </motion.h2>
                <motion.p
                  variants={itemVariants}
                  className={`text-center mb-12 md:mb-24 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Carefully curated pieces that embody timeless design and modern simplicity
                </motion.p>
                
                <div className="grid md:grid-cols-2 gap-12 mb-32">
              {collections.map((collection, index) => (
                <motion.div 
                  key={collection.id}
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-3xl group cursor-pointer card-hover"
                >
                  <div className="aspect-[4/5] relative">
                    <img 
                      src={collection.image} 
                      alt={collection.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30"></div>
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <motion.h3 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      className="text-2xl font-bold font-heading text-white mb-2 tracking-tight"
                    >
                      {collection.title}
                    </motion.h3>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className="text-white/90 mb-6 font-light"
                    >
                      {collection.description}
                    </motion.p>
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => exploreCollection(collection.title)}
                      className="px-8 py-4 bg-white/95 backdrop-blur-sm text-gray-900 font-semibold rounded-2xl transition-all duration-200 w-fit shadow-lg hover:shadow-xl border border-white/20 cursor-pointer"
                    >
                      Explore Collection
                    </motion.button>
                  </div>
                </motion.div>
              ))}
                </div>
              </>
            )}

            <div ref={allProductsSectionRef} className="pt-8 md:pt-16"></div> 

            <motion.h2 
              variants={itemVariants}
              className={`text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-center mb-3 md:mb-4 tracking-tight ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              {searchQuery ? 'Search Results' : 'Products'}
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className={`text-center mb-12 md:mb-20 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Essential pieces designed for the modern lifestyle
            </motion.p>

            {/* Mobile Search Section */}
            <motion.div 
              variants={itemVariants}
              className="block lg:hidden mb-8 px-4"
            >
              <div className={`relative ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    filterProducts(activeCategory, e.target.value);
                  }}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-400'
                  }`}
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12 md:mb-20 px-4 md:px-0"
            >
              {categories.map((category) => (
                <motion.button
                  key={category}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => filterProducts(category)}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-medium text-sm md:text-base transition-all duration-200 cursor-pointer ${
                    activeCategory === category 
                      ? (isDarkMode ? 'bg-white text-gray-900 shadow-lg' : 'bg-gray-900 text-white shadow-lg')
                      : (isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </motion.div>
            
            {searchQuery && (
              <motion.div 
                variants={itemVariants}
                className="text-center mb-8"
              >
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Showing results for: <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{searchQuery}</span>
                </p>
              </motion.div>
            )}
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeCategory + searchQuery}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0"
              >
                {filteredProducts.map((product) => (
                                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  className={`rounded-3xl overflow-hidden group relative cursor-pointer card-hover flex flex-col min-h-[500px] md:min-h-[600px] ${
                    isDarkMode 
                      ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/70' 
                      : 'bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:border-gray-300/70 minimal-shadow'
                  }`}
                  onClick={() => viewProductDetails(product)}
                >
                  <div className="relative aspect-square overflow-hidden">
                    
                    {product.badge && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          product.badge === 'Best Seller' 
                            ? (isDarkMode 
                                ? 'bg-gray-700 text-gray-200 border border-gray-500'
                                : 'bg-gray-800 text-white border border-gray-600')
                            : (isDarkMode 
                                ? 'bg-gray-600 text-gray-300 border border-gray-500'
                                : 'bg-gray-200 text-gray-700 border border-gray-300')
                        }`}>
                          {product.badge}
                        </span>
                      </div>
                    )}
                    
                    
                    <div className="absolute top-4 right-4 z-10 transition-all duration-300">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-3 rounded-full backdrop-blur-md transition-all duration-200 shadow-lg cursor-pointer ${
                          favoriteItems.includes(product.id)
                            ? (isDarkMode 
                                ? 'bg-red-500 text-white border border-red-400' 
                                : 'bg-red-500 text-white border border-red-400')
                            : (isDarkMode 
                                ? 'bg-gray-900/80 text-white hover:bg-gray-800 border border-gray-700/50' 
                                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 border border-gray-200/50')
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                      >
                        <svg className="w-5 h-5" fill={favoriteItems.includes(product.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </motion.button>
                    </div>
                    
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  </div>
                  
                  <div className="p-4 md:p-8 flex flex-col flex-1">
                    {/* Header Section */}
                    <div className="mb-4">
                      <h3 className={`text-xl font-semibold font-heading mb-2 tracking-tight ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>{product.name}</h3>
                      <p className={`text-sm font-medium uppercase tracking-wider ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>{product.category}</p>
                    </div>
                    
                    {/* Rating Section */}
                    {product.rating && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating!) 
                                  ? 'text-yellow-400' 
                                  : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                    )}
                    
                    {/* Price Section */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-2xl font-bold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className={`text-lg line-through ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {/* Fixed height container for discount tag */}
                      <div className="h-6 flex items-center">
                        {product.originalPrice && (
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                            isDarkMode 
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                              : 'bg-red-50 text-red-600 border border-red-200'
                          }`}>
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Info Section */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex flex-col gap-2">
                        <span className={`text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Sizes Available
                        </span>
                        <span className={`text-sm px-4 py-2 rounded-xl font-medium ${
                          isDarkMode ? 'text-gray-300 bg-gray-700/50 border border-gray-600/50' : 'text-gray-700 bg-gray-100/80 border border-gray-200/50'
                        }`}>
                          {product.size}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1">
                          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className={`text-lg font-bold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {product.rating}
                          </span>
                        </div>
                        <span className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          ({product.reviews} reviews)
                        </span>
                      </div>
                    </div>
                    
                    {/* Spacer to push button to bottom */}
                    <div className="flex-grow"></div>
                    
                    {/* Add to Cart Button - Always at bottom */}
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={(e) => {
                        e.stopPropagation();
                        const defaultSize = product.size?.split('-')[0];
                        addToCart(product, defaultSize);
                      }}
                      className={`w-full px-6 py-4 font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                        isDarkMode 
                          ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl' 
                          : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
            
            {filteredProducts.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="mb-6">
                  <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V4a2 2 0 00-2-2h-2a2 2 0 00-2 2v2.306" />
                  </svg>
                </div>
                <p className="text-xl mb-6
                ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                ">No products found matching "{searchQuery}" in {activeCategory}.</p>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => filterProducts('All', '')}
                  className={`px-8 py-3 font-semibold rounded-xl cursor-pointer transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  Clear Search
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.section>
          </>
        )}
      </main>

      
      <footer className={`transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      } border-t`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="lg:col-span-1">
              <div className="mb-6">
                <span className="text-2xl font-bold tracking-tight text-gradient">UrbanThreads</span>
              </div>
              <p className={`text-sm leading-relaxed mb-6 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Curating minimalist fashion for the modern lifestyle. Quality pieces that embody simplicity and timeless design.
              </p>
              <div className="flex space-x-4">
                {[
                  { name: 'F', href: '#' },
                  { name: 'T', href: '#' },
                  { name: 'I', href: '#' },
                  { name: 'Y', href: '#' }
                ].map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200 cursor-pointer ${
                      isDarkMode 
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                  >
                    {social.name}
                  </motion.a>
                ))}
              </div>
            </div>

            
            <div>
              <h3 className={`text-lg font-semibold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Shop</h3>
              <ul className="space-y-4">
                {['New Arrivals', 'Best Sellers', 'Sale', 'Collections', 'Gift Cards'].map((item) => (
                  <li key={item}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 4 }}
                      className={`text-sm transition-all duration-200 cursor-pointer ${
                        isDarkMode 
                          ? 'text-gray-400 hover:text-white' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>

            
            <div>
              <h3 className={`text-lg font-semibold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Customer Care</h3>
              <ul className="space-y-4">
                {['Contact Us', 'Size Guide', 'Shipping & Returns', 'FAQ', 'Track Your Order'].map((item) => (
                  <li key={item}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 4 }}
                      className={`text-sm transition-all duration-200 cursor-pointer ${
                        isDarkMode 
                          ? 'text-gray-400 hover:text-white' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>

            
            <div>
              <h3 className={`text-lg font-semibold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Company</h3>
              <ul className="space-y-4">
                {['About Us', 'Careers', 'Press', 'Sustainability', 'Privacy Policy'].map((item) => (
                  <li key={item}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 4 }}
                      className={`text-sm transition-all duration-200 cursor-pointer ${
                        isDarkMode 
                          ? 'text-gray-400 hover:text-white' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          
          <div className={`mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                © 2024 UrbanThreads. All rights reserved.
              </p>

            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setShowCart(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className={`absolute top-0 right-0 h-full w-full sm:w-[500px] lg:w-[600px] border-l shadow-2xl overflow-hidden flex flex-col ${
                isDarkMode 
                  ? 'bg-gray-900 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`flex items-center justify-between p-6 border-b ${
                isDarkMode 
                  ? 'border-gray-700 bg-gray-800' 
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <h2 className={`text-2xl font-bold font-heading ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Your Cart</h2>
                                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowCart(false)}
                    className={`p-2 rounded-full transition-all duration-300 cursor-pointer ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              {cartItems.length === 0 ? (
                <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                                      <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className={`p-6 rounded-full mb-6 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </motion.div>
                                      <h3 className={`text-xl font-bold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Your cart is empty</h3>
                    <p className={`mb-6 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Add some items to get started</p>
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => {
                      setShowCart(false);
                      setCurrentPage('products');
                    }}
                    className={`px-8 py-3 font-bold rounded-2xl transition-all duration-300 shadow-xl cursor-pointer ${ 
                      isDarkMode
                        ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    Continue Shopping
                  </motion.button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-6 cart-scrollbar">
                    <div className="space-y-6">
                      {cartItems.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className={`flex gap-4 border-b pb-6 last:border-b-0 p-4 rounded-2xl mb-4 shadow-sm ${
                            isDarkMode 
                              ? 'border-gray-700 bg-gray-800' 
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="relative">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-24 h-24 object-cover rounded-2xl shadow-md" 
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-bold font-heading text-lg ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>{item.name}</h3>
                            {item.selectedSize && (
                              <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${
                                isDarkMode ? 'text-gray-500' : 'text-gray-500'
                              }`}>Size: {item.selectedSize}</p>
                            )}
                            <p className={`text-sm mb-3 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>${item.price.toFixed(2)} x {item.quantity}</p>
                            <div className="flex items-center gap-3">
                                                              <div className={`flex items-center gap-2 rounded-xl p-1 ${
                                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                                }`}>
                                <motion.button
                                  variants={buttonVariants}
                                  whileHover="hover"
                                  whileTap="tap"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}
                                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors font-bold cursor-pointer ${
                                    isDarkMode 
                                      ? 'text-gray-300 hover:bg-gray-600' 
                                      : 'text-gray-700 hover:bg-gray-200'
                                  }`}
                                >
                                  −
                                </motion.button>
                                <span className={`w-8 text-center font-bold ${
                                  isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>{item.quantity}</span>
                                <motion.button
                                  variants={buttonVariants}
                                  whileHover="hover"
                                  whileTap="tap"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}
                                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors font-bold cursor-pointer ${
                                    isDarkMode 
                                      ? 'text-gray-300 hover:bg-gray-600' 
                                      : 'text-gray-700 hover:bg-gray-200'
                                  }`}
                                >
                                  +
                                </motion.button>
                              </div>
                              <motion.button
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={() => removeFromCart(item.id, item.selectedSize)}
                                className={`ml-auto p-2 rounded-xl transition-all duration-300 cursor-pointer ${
                                  isDarkMode 
                                    ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:text-red-300' 
                                    : 'bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700'
                                }`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className={`p-6 border-t ${
                    isDarkMode 
                      ? 'border-gray-700 bg-gray-800' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="space-y-4 mb-6">
                                              <div className="flex justify-between">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Subtotal:</span>
                          <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Shipping:</span>
                          <span className="font-bold text-green-600">Free</span>
                        </div>
                        <div className={`h-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                        <div className="flex justify-between text-xl font-bold">
                          <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Total:</span>
                          <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => {
                          
                          setShowCart(false);
                          setCartItems([]);
                          setCheckoutSuccessMessage('Checkout Successful! Your order is being processed.');
                          setShowCheckoutSuccessNotification(true);
                          setTimeout(() => setShowCheckoutSuccessNotification(false), 5000);
                        }}
                        className={`w-full px-6 py-4 font-bold text-lg rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer border-2 ${
                          isDarkMode 
                            ? 'bg-white text-gray-900 border-white hover:bg-gray-100 hover:text-gray-800 shadow-white/20' 
                            : 'bg-gray-900 text-white border-gray-900 hover:bg-gray-800 hover:border-gray-800 shadow-gray-900/30'
                        }`}
                      >
                        Proceed to Checkout
                      </motion.button>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setShowCart(false)}
                        className={`w-full px-6 py-3 border-2 font-semibold rounded-2xl transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg ${
                          isDarkMode 
                            ? 'border-gray-400 hover:bg-gray-700 text-gray-200 hover:text-white hover:border-gray-300' 
                            : 'border-gray-400 hover:bg-gray-100 text-gray-700 hover:text-gray-900 hover:border-gray-500'
                        }`}
                      >
                        Continue Shopping
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 bg-white border border-gray-200 text-gray-900 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm z-100"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="p-2 bg-green-100 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">{notificationMessage}</p>
              <p className="text-sm text-gray-600">Item added successfully</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCheckoutSuccessNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-20 right-6 bg-white border border-gray-200 text-gray-900 px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3 max-w-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="p-2 bg-blue-100 rounded-full" 
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /> 
              </svg>
            </motion.div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">{checkoutSuccessMessage}</p>
              <p className="text-sm text-gray-600">Thank you for your purchase!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSubscribeNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-6 left-6 px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3 max-w-sm ${
              isDarkMode 
                ? 'bg-gray-800 border border-gray-700 text-white' 
                : 'bg-white border border-gray-200 text-gray-900'
            }`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="p-2 bg-purple-100 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </motion.div>
            <div className="flex-1">
              <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{subscribeMessage}</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Welcome to our community!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showQuickView && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowQuickView(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className={`rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto premium-shadow ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 relative">
                  <img 
                    src={selectedProduct?.image} 
                    alt={selectedProduct?.name} 
                    className="w-full h-full object-cover rounded-l-3xl md:rounded-r-none rounded-r-3xl md:rounded-br-none" 
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className={`text-2xl font-bold font-heading mb-2 tracking-tight ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>{selectedProduct?.name}</h2>
                      <p className={`text-sm font-light ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>{selectedProduct?.category}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowQuickView(false)}
                      className={`p-2 rounded-full transition-all duration-200 cursor-pointer ${
                        isDarkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                  
                  <p className={`text-3xl font-bold mb-6 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>${selectedProduct?.price?.toFixed(2)}</p> 
                  
                  <p className={`mb-8 leading-relaxed font-light ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>{selectedProduct?.description}</p> 
                  
                  <div className="mb-8">
                    <h3 className={`text-lg font-semibold mb-4 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Size</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedProduct?.size?.split('-').map(size => ( 
                        <motion.button
                          key={size}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                            selectedSize === size 
                              ? (isDarkMode ? 'bg-white text-gray-900' : 'bg-gray-900 text-white')
                              : (isDarkMode 
                                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                          }`}
                        >
                          {size}
                        </motion.button>
                      ))}
                    </div>
                    {!selectedSize && (
                      <p className="text-red-500 text-sm mt-2 font-light">Please select a size</p>
                    )}
                  </div>

                  <div className="mb-8">
                    <h3 className={`text-lg font-semibold mb-4 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Quantity</h3>
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center rounded-xl ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className={`p-3 rounded-l-xl transition-colors cursor-pointer ${
                            isDarkMode 
                              ? 'text-gray-300 hover:bg-gray-600' 
                              : 'text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </motion.button>
                        <span className={`px-6 py-3 font-semibold min-w-[60px] text-center ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>{quantity}</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setQuantity(quantity + 1)}
                          className={`p-3 rounded-r-xl transition-colors cursor-pointer ${
                            isDarkMode 
                              ? 'text-gray-300 hover:bg-gray-600' 
                              : 'text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mb-8">
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={handleQuickViewAddToCart}
                      disabled={!selectedSize}
                      className={`flex-1 px-8 py-4 font-semibold rounded-2xl transition-all duration-200 ${
                        selectedSize 
                          ? (isDarkMode 
                              ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl cursor-pointer' 
                              : 'bg-gray-900 hover:bg-gray-800 text-white minimal-shadow hover:modern-shadow cursor-pointer')
                          : (isDarkMode 
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed')
                      }`}
                    >
                      Add to Cart • ${(selectedProduct?.price * quantity).toFixed(2)} 
                    </motion.button>
                  </div>
                  
                  <div className={`border-t pt-6 ${
                    isDarkMode ? 'border-gray-600' : 'border-gray-200'
                  }`}>
                    <h3 className={`text-lg font-semibold mb-4 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Details</h3>
                    <ul className={`space-y-3 font-light ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <li className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          isDarkMode ? 'bg-gray-500' : 'bg-gray-400'
                        }`}></div>
                        Premium quality materials
                      </li>
                      <li className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          isDarkMode ? 'bg-gray-500' : 'bg-gray-400'
                        }`}></div>
                        Sustainable production
                      </li>
                      <li className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          isDarkMode ? 'bg-gray-500' : 'bg-gray-400'
                        }`}></div>
                        Machine washable
                      </li>
                      <li className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          isDarkMode ? 'bg-gray-500' : 'bg-gray-400'
                        }`}></div>
                        Free shipping & returns
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFavorites && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setShowFavorites(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className={`absolute top-0 right-0 h-full w-full sm:w-[500px] lg:w-[600px] border-l shadow-2xl overflow-hidden flex flex-col ${
                isDarkMode 
                  ? 'bg-gray-900 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`flex items-center justify-between p-6 border-b ${
                isDarkMode 
                  ? 'border-gray-700 bg-gray-800' 
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <h2 className={`text-2xl font-bold font-heading ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Your Favorites</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowFavorites(false)}
                  className={`p-2 rounded-full transition-all duration-300 cursor-pointer ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              {favoriteItems.length === 0 ? (
                <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className={`p-6 rounded-full mb-6 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </motion.div>
                  <h3 className={`text-xl font-bold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>No favorites yet</h3>
                  <p className={`mb-6 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Add some items to your wishlist</p>
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => {
                      setShowFavorites(false);
                      setCurrentPage('products');
                    }}
                    className={`px-8 py-3 font-bold rounded-2xl transition-all duration-300 shadow-xl cursor-pointer ${ 
                      isDarkMode
                        ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    Browse Products
                  </motion.button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-6 cart-scrollbar">
                    <div className="space-y-6">
                      {products.filter(product => favoriteItems.includes(product.id)).map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className={`flex gap-4 border-b pb-6 last:border-b-0 p-4 rounded-2xl mb-4 shadow-sm ${
                            isDarkMode 
                              ? 'border-gray-700 bg-gray-800' 
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="relative">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-24 h-24 object-cover rounded-2xl shadow-md" 
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-bold font-heading text-lg ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>{item.name}</h3>
                            <p className={`text-sm mb-3 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>${item.price.toFixed(2)}</p>
                            <div className="flex items-center gap-3">
                              <motion.button
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={() => {
                                  const defaultSize = item.size?.split('-')[0];
                                  addToCart(item, defaultSize);
                                  toggleFavorite(item.id); // Remove from favorites when added to cart
                                }}
                                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
                                  isDarkMode 
                                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                                    : 'bg-gray-900 text-white hover:bg-gray-800'
                                }`}
                              >
                                Add to Cart
                              </motion.button>
                              <motion.button
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={() => toggleFavorite(item.id)}
                                className={`ml-auto p-2 rounded-xl transition-all duration-300 cursor-pointer ${
                                  isDarkMode 
                                    ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:text-red-300' 
                                    : 'bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700'
                                }`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className={`p-6 border-t ${
                    isDarkMode 
                      ? 'border-gray-700 bg-gray-800' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="space-y-3">
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => {
                          
                          products
                            .filter(product => favoriteItems.includes(product.id))
                            .forEach(product => {
                              const defaultSize = product.size?.split('-')[0];
                              addToCart(product, defaultSize);
                            });
                          // Clear all favorites after adding to cart
                          setFavoriteItems([]);
                          setShowFavorites(false);
                        }}
                        className={`w-full px-6 py-4 font-bold text-lg rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer border-2 ${
                          isDarkMode 
                            ? 'bg-white text-gray-900 border-white hover:bg-gray-100 hover:text-gray-800 shadow-white/20' 
                            : 'bg-gray-900 text-white border-gray-900 hover:bg-gray-800 hover:border-gray-800 shadow-gray-900/30'
                        }`}
                      >
                        Add All to Cart
                      </motion.button>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setShowFavorites(false)}
                        className={`w-full px-6 py-3 border-2 font-semibold rounded-2xl transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg ${
                          isDarkMode 
                            ? 'border-gray-400 hover:bg-gray-700 text-gray-200 hover:text-white hover:border-gray-300' 
                            : 'border-gray-400 hover:bg-gray-100 text-gray-700 hover:text-gray-900 hover:border-gray-500'
                        }`}
                      >
                        Continue Shopping
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      
      <AnimatePresence>
        {showFeatureNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3 max-w-sm ${
              isDarkMode 
                ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-300' 
                : 'bg-yellow-50 border border-yellow-200 text-yellow-700'
            }`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="p-2 bg-yellow-400/30 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </motion.div>
            <div className="flex-1">
              <p className="font-bold">{featureNotificationMessage}</p>
              <p className="text-sm">This feature is coming soon!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShoppingApp;
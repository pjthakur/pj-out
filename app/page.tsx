"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ShoppingCart, 
  X, 
  Filter, 
  ChevronDown, 
  Plus, 
  Minus, 
  Star, 
  Heart, 
  Shield, 
  Truck, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight, 
  MessageSquare, 
  CheckCircle, 
  User, 
  ChevronUp,
  Menu,
  Pill,
  Stethoscope,
  Building2,
  Microscope,
  Sparkles,
} from "lucide-react";

// Professional Medical Color Scheme
const medicalColors = {
  primary: '#0066CC',        // Medical Blue
  primaryDark: '#004C99',    // Darker Medical Blue
  primaryLight: '#E6F2FF',   // Light Medical Blue
  secondary: '#00A651',      // Medical Green
  secondaryDark: '#008542',  // Darker Medical Green
  secondaryLight: '#E6F7EE', // Light Medical Green
  accent: '#FF6B6B',         // Medical Red/Alert
  warning: '#FFA726',        // Medical Orange
  gray: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A'
  }
};

// Add these styles to the document
const medicalStyles = `
  .medical-blue { color: ${medicalColors.primary}; }
  .bg-medical-blue { background-color: ${medicalColors.primary}; }
  .border-medical-blue { border-color: ${medicalColors.primary}; }
  .medical-blue-dark { color: ${medicalColors.primaryDark}; }
  .bg-medical-blue-dark { background-color: ${medicalColors.primaryDark}; }
  .medical-blue-light { color: ${medicalColors.primaryLight}; }
  .bg-medical-blue-light { background-color: ${medicalColors.primaryLight}; }
  .medical-green { color: ${medicalColors.secondary}; }
  .bg-medical-green { background-color: ${medicalColors.secondary}; }
  .medical-red { color: ${medicalColors.accent}; }
  .bg-medical-red { background-color: ${medicalColors.accent}; }
  .medical-gradient { background: linear-gradient(135deg, ${medicalColors.primary} 0%, ${medicalColors.primaryDark} 100%); }
  .medical-green-gradient { background: linear-gradient(135deg, ${medicalColors.secondary} 0%, ${medicalColors.secondaryDark} 100%); }
  
  /* Hide scrollbars */
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
  
  /* Hide scrollbars on mobile only */
  @media (max-width: 768px) {
    .scrollbar-hide-mobile {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
    .scrollbar-hide-mobile::-webkit-scrollbar {
      display: none;  /* Chrome, Safari and Opera */
    }
  }
`;

// Add styles to document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = medicalStyles;
  document.head.appendChild(styleSheet);
}

interface Medicine {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  manufacturer: string;
  dosage: string;
  description: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  prescription: boolean;
  tags: string[];
}

const medicines: Medicine[] = [
  { 
    id: 1, 
    name: "Aspirin", 
    price: 12.99, 
    originalPrice: 15.99,
    manufacturer: "Bayer Healthcare", 
    dosage: "81mg", 
    description: "Low-dose aspirin for cardiovascular protection and pain relief. Reduces risk of heart attack and stroke when taken daily as directed by healthcare provider.", 
    category: "Pain Relief", 
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=400&fit=crop&crop=center",
    rating: 4.5,
    reviews: 324,
    inStock: true,
    prescription: false,
    tags: ["heart health", "pain relief", "anti-inflammatory"]
  },
  { 
    id: 2, 
    name: "Ibuprofen", 
    price: 9.99, 
    manufacturer: "Advil", 
    dosage: "200mg", 
    description: "Fast-acting pain reliever and fever reducer. Effective for headaches, muscle aches, and inflammation.", 
    category: "Pain Relief", 
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&h=400&fit=crop&crop=center",
    rating: 4.7,
    reviews: 189,
    inStock: true,
    prescription: false,
    tags: ["pain relief", "fever reducer", "anti-inflammatory"]
  },
  { 
    id: 3, 
    name: "Lisinopril", 
    price: 24.99, 
    originalPrice: 29.99,
    manufacturer: "Zestril Pharma", 
    dosage: "10mg", 
    description: "ACE inhibitor for high blood pressure and heart failure management. Helps protect kidney function in diabetic patients.", 
    category: "Cardiovascular", 
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=400&fit=crop&crop=center",
    rating: 4.3,
    reviews: 156,
    inStock: true,
    prescription: true,
    tags: ["blood pressure", "heart health", "prescription"]
  },
  { 
    id: 4, 
    name: "Atorvastatin", 
    price: 34.99, 
    manufacturer: "Lipitor Labs", 
    dosage: "20mg", 
    description: "Cholesterol-lowering medication that reduces LDL (bad cholesterol) and triglycerides while increasing HDL (good cholesterol).", 
    category: "Cardiovascular", 
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500&h=400&fit=crop&crop=center",
    rating: 4.6,
    reviews: 203,
    inStock: true,
    prescription: true,
    tags: ["cholesterol", "heart health", "prescription"]
  },
  { 
    id: 5, 
    name: "Metformin", 
    price: 18.99, 
    manufacturer: "Glucophage Inc", 
    dosage: "500mg", 
    description: "First-line treatment for type 2 diabetes. Helps control blood sugar levels and improves insulin sensitivity.", 
    category: "Endocrine", 
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=400&fit=crop&crop=center",
    rating: 4.4,
    reviews: 278,
    inStock: true,
    prescription: true,
    tags: ["diabetes", "blood sugar", "prescription"]
  },
  { 
    id: 6, 
    name: "Omeprazole", 
    price: 16.99, 
    manufacturer: "Prilosec Pro", 
    dosage: "20mg", 
    description: "Proton pump inhibitor for acid reflux, heartburn, and stomach ulcer treatment. Reduces stomach acid production.", 
    category: "Gastrointestinal", 
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&h=400&fit=crop&crop=center",
    rating: 4.2,
    reviews: 167,
    inStock: true,
    prescription: false,
    tags: ["acid reflux", "heartburn", "stomach health"]
  },
  { 
    id: 7, 
    name: "Vitamin D3", 
    price: 14.99, 
    originalPrice: 19.99,
    manufacturer: "Nature's Plus", 
    dosage: "2000 IU", 
    description: "High-potency vitamin D supplement for bone health, immune system support, and overall wellness.", 
    category: "Vitamins", 
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop&crop=center",
    rating: 4.8,
    reviews: 445,
    inStock: true,
    prescription: false,
    tags: ["vitamin", "bone health", "immunity"]
  },
  { 
    id: 8, 
    name: "Levothyroxine", 
    price: 22.99, 
    manufacturer: "Synthroid", 
    dosage: "50mcg", 
    description: "Synthetic thyroid hormone replacement therapy for hypothyroidism and thyroid hormone deficiency.", 
    category: "Endocrine", 
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500&h=400&fit=crop&crop=center",
    rating: 4.5,
    reviews: 134,
    inStock: false,
    prescription: true,
    tags: ["thyroid", "hormone", "prescription"]
  }
];

interface CartItem {
  medicine: Medicine;
  quantity: number;
}

interface Category {
  name: string;
  icon: React.ReactNode;
  gradient: string;
}

const categories: Category[] = [
  { name: "Pain Relief", icon: <Pill className="w-5 h-5" />, gradient: "from-red-400 to-pink-400" },
  { name: "Cardiovascular", icon: <Stethoscope className="w-5 h-5" />, gradient: "from-blue-400 to-cyan-400" },
  { name: "Endocrine", icon: <Building2 className="w-5 h-5" />, gradient: "from-green-400 to-emerald-400" },
  { name: "Gastrointestinal", icon: <Microscope className="w-5 h-5" />, gradient: "from-purple-400 to-indigo-400" },
  { name: "Vitamins", icon: <Sparkles className="w-5 h-5" />, gradient: "from-yellow-400 to-orange-400" },
];

interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    rating: 5,
    text: "MediCare Plus has completely transformed how I manage my medications. The delivery is always prompt, and their customer service is exceptional. I can't imagine going back to traditional pharmacies!",
    date: "May 15, 2024"
  },
  {
    id: 2,
    name: "David Thompson",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4,
    text: "As someone who needs regular prescriptions, I've found MediCare Plus to be a lifesaver. The reminders and refill system make sure I never miss a dose. Their pricing is also very competitive.",
    date: "April 28, 2024"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    rating: 5,
    text: "The convenience of having my medications delivered directly to my door cannot be overstated. Their app is intuitive, and the pharmacists are always available to answer my questions.",
    date: "April 10, 2024"
  }
];

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const features: FeatureCard[] = [
  {
    title: "24/7 Pharmacist Support",
    description: "Connect with certified pharmacists anytime via chat or phone for medication guidance and advice.",
    icon: <Shield className="w-8 h-8" />,
    color: "from-blue-500 to-indigo-600"
  },
  {
    title: "Free Same-Day Delivery",
    description: "Enjoy complimentary same-day delivery for all orders placed before 2 PM in select locations.",
    icon: <Truck className="w-8 h-8" />,
    color: "from-green-500 to-emerald-600"
  },
  {
    title: "Automatic Refills",
    description: "Never run out of essential medications with our smart refill system that tracks your usage.",
    icon: <Clock className="w-8 h-8" />,
    color: "from-amber-500 to-orange-600"
  }
];

interface TeamMember {
  name: string;
  position: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Dr. James Wilson",
    position: "Chief Pharmacist",
    image: "https://randomuser.me/api/portraits/men/42.jpg"
  },
  {
    name: "Dr. Lisa Chen",
    position: "Medical Director",
    image: "https://randomuser.me/api/portraits/women/33.jpg"
  },
  {
    name: "Michael Brown",
    position: "Customer Relations",
    image: "https://randomuser.me/api/portraits/men/91.jpg"
  }
];

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How does the prescription delivery process work?",
    answer: "Once you upload your prescription through our website or app, our pharmacists verify it with your doctor if needed. After verification, we process your order, and it's delivered to your doorstep within the same day (for orders before 2 PM) or next day. You'll receive real-time updates throughout the process."
  },
  {
    question: "Is my medical information secure?",
    answer: "Absolutely. We use industry-leading encryption and security protocols to protect your personal and medical information. Our systems comply with all healthcare privacy regulations, including HIPAA, ensuring your data remains confidential at all times."
  },
  {
    question: "How do I transfer my existing prescriptions?",
    answer: "Transferring prescriptions is simple. You can either provide your current pharmacy's information through our app/website, or our pharmacists can contact them directly on your behalf. We handle all the paperwork and coordination to ensure a seamless transition."
  },
  {
    question: "What if I need to speak with a pharmacist?",
    answer: "Our certified pharmacists are available 24/7 through our secure messaging system, video consultation, or by phone. You can easily schedule a consultation or reach out anytime you have questions about your medications, potential interactions, or side effects."
  }
];

export default function PremiumPharmacy() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("name");
  const [activeSection, setActiveSection] = useState("hero");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  
  const cartRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const shopRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement | null>, sectionName: string) => {
    if (sectionRef.current) {
      const yOffset = -80;
      const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(sectionName);
      setMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // Update active section
      if (heroRef.current && scrollPosition < heroRef.current.offsetTop + heroRef.current.offsetHeight - 100) {
        setActiveSection("hero");
      } else if (shopRef.current && scrollPosition < shopRef.current.offsetTop + shopRef.current.offsetHeight - 100) {
        setActiveSection("shop");
      } else if (aboutRef.current && scrollPosition < aboutRef.current.offsetTop + aboutRef.current.offsetHeight - 100) {
        setActiveSection("about");
      } else if (contactRef.current) {
        setActiveSection("contact");
      }

      // Set sticky header
      if (scrollPosition > 20) {
        setIsHeaderSticky(true);
      } else {
        setIsHeaderSticky(false);
      }

      // Show scroll to top button when scrolled down 300px or more
      setShowScrollToTop(scrollPosition > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setShowCartModal(false);
      }
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowMedicineModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Prevent background scrolling when modals are open
  useEffect(() => {
    if (showMedicineModal || showCartModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMedicineModal, showCartModal]);

  const handleAddToCart = (medicine: Medicine) => {
    if (!medicine.inStock) return;
    
    const existingItemIndex = cartItems.findIndex((item) => item.medicine.id === medicine.id);

    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += 1;
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { medicine, quantity: 1 }]);
    }
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedCartItems = [...cartItems];
    updatedCartItems[index].quantity = newQuantity;
    setCartItems(updatedCartItems);
  };

  const removeFromCart = (index: number) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems.splice(index, 1);
    setCartItems(updatedCartItems);
  };

  const toggleFavorite = (medicineId: number) => {
    setFavorites(prev => 
      prev.includes(medicineId) 
        ? prev.filter(id => id !== medicineId)
        : [...prev, medicineId]
    );
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setCartItems([]);
    setShowCartModal(false);
    setTimeout(() => setOrderPlaced(false), 4000);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  // Form submit function
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    if (!formState.name || !formState.email || !formState.message) {
      setFormError("Please fill in all fields");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formState.email)) {
      setFormError("Please enter a valid email address");
      return;
    }

    setFormSubmitted(true);
    setFormState({ name: "", email: "", message: "" });
    
    setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
  };

  const getFilteredMedicines = () => {
    let filtered = [...medicines];

    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter((med) => 
        med.name.toLowerCase().includes(searchTermLower) || 
        med.category.toLowerCase().includes(searchTermLower) ||
        med.manufacturer.toLowerCase().includes(searchTermLower) ||
        med.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((med) => med.category === selectedCategory);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalAmount = cartItems.reduce((total, item) => total + item.medicine.price * item.quantity, 0);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div 
      className="min-h-screen relative font-sans overflow-x-hidden"
      style={{
        background: `
          linear-gradient(135deg, rgba(0, 102, 204, 0.03) 0%, rgba(0, 166, 81, 0.03) 50%, rgba(248, 250, 252, 1) 100%),
          radial-gradient(circle at 20% 50%, rgba(0, 102, 204, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(0, 166, 81, 0.05) 0%, transparent 50%),
          linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)
        `
      }}
    >
      {/* Header */}
      <div 
        ref={navRef} 
        className={`w-full transition-all duration-500 z-50 fixed top-0 left-0 right-0 ${
          isHeaderSticky ? "bg-white shadow-lg border-b border-gray-200" : "bg-white/95 backdrop-blur-sm"
        }`}
      >
        <motion.header 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`${isHeaderSticky ? "py-2 md:py-3" : "py-3 md:py-4"} transition-all duration-300`}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2 md:space-x-3"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-medical-blue to-medical-blue-dark rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="text-black text-lg md:text-2xl" />
                </div>
                <div>
                  <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-800">
                    MediCare Plus
                  </h1>
                  <p className="text-xs md:text-sm text-gray-600 font-medium">Premium Online Pharmacy</p>
                </div>
              </motion.div>

              <motion.nav 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden lg:flex items-center justify-center space-x-8 flex-1 mx-8"
              >
                <button 
                  onClick={() => scrollToSection(heroRef, "hero")}
                  className={`font-semibold transition-colors duration-300 cursor-pointer px-4 py-2 rounded-lg ${activeSection === "hero" ? "text-white bg-medical-blue shadow-md" : "text-gray-700 hover:text-medical-blue hover:bg-gray-50"}`}
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection(shopRef, "shop")}
                  className={`font-semibold transition-colors duration-300 cursor-pointer px-4 py-2 rounded-lg ${activeSection === "shop" ? "text-white bg-medical-blue shadow-md" : "text-gray-700 hover:text-medical-blue hover:bg-gray-50"}`}
                >
                  Shop
                </button>
                <button 
                  onClick={() => scrollToSection(aboutRef, "about")}
                  className={`font-semibold transition-colors duration-300 cursor-pointer px-4 py-2 rounded-lg ${activeSection === "about" ? "text-white bg-medical-blue shadow-md" : "text-gray-700 hover:text-medical-blue hover:bg-gray-50"}`}
                >
                  About Us
                </button>
                <button 
                  onClick={() => scrollToSection(contactRef, "contact")}
                  className={`font-medium transition-colors duration-300 cursor-pointer ${activeSection === "contact" ? "text-medical-blue" : "text-gray-700 hover:text-medical-blue"}`}
                >
                  Contact
                </button>
              </motion.nav>

              <div className="flex items-center space-x-2 md:space-x-4">
                {/* Mobile Menu Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="lg:hidden relative group cursor-pointer"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <div className="bg-white border border-gray-200 rounded-lg md:rounded-xl p-2 md:p-3 shadow-md hover:shadow-lg transition-all duration-300">
                    {mobileMenuOpen ? (
                      <X className="text-lg md:text-xl text-gray-700" />
                    ) : (
                      <Menu className="text-lg md:text-xl text-gray-700" />
                    )}
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group cursor-pointer"
                  onClick={() => setShowCartModal(!showCartModal)}
                >
                  <div className="bg-white border border-gray-200 rounded-lg md:rounded-xl p-2 md:p-3 shadow-md hover:shadow-lg transition-all duration-300">
                    <ShoppingCart className="text-lg md:text-xl text-gray-700" />
                    {totalItems > 0 && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-medical-red text-white text-xs rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center font-bold shadow-lg"
                      >
                        {totalItems}
                      </motion.span>
                    )}
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-b border-gray-100 shadow-lg overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
                <nav className="flex flex-col space-y-2 md:space-y-4">
                  <button 
                    onClick={() => scrollToSection(heroRef, "hero")}
                    className={`py-3 px-4 rounded-xl font-medium transition-colors duration-300 cursor-pointer text-left ${activeSection === "hero" ? "bg-medical-blue-light text-medical-blue" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => scrollToSection(shopRef, "shop")}
                    className={`py-3 px-4 rounded-xl font-medium transition-colors duration-300 cursor-pointer text-left ${activeSection === "shop" ? "bg-medical-blue-light text-medical-blue" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    Shop
                  </button>
                  <button 
                    onClick={() => scrollToSection(aboutRef, "about")}
                    className={`py-3 px-4 rounded-xl font-medium transition-colors duration-300 cursor-pointer text-left ${activeSection === "about" ? "bg-medical-blue-light text-medical-blue" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    About Us
                  </button>
                  <button 
                    onClick={() => scrollToSection(contactRef, "contact")}
                    className={`py-3 px-4 rounded-xl font-medium transition-colors duration-300 cursor-pointer text-left ${activeSection === "contact" ? "bg-medical-blue-light text-medical-blue" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    Contact
                  </button>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden pb-12 md:pb-20 pt-20 md:pt-24 lg:pt-28 bg-gradient-to-br from-white to-gray-50">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-10 pb-16 md:pb-24 lg:pt-20 lg:pb-32 flex flex-col lg:flex-row items-center"
        >
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="w-full lg:w-1/2 mb-8 md:mb-12 lg:mb-0 lg:pr-12 z-10"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-gradient-to-r from-medical-blue to-medical-green bg-clip-text text-transparent mb-4 md:mb-6"
            >
              <h2 className="text-sm md:text-lg font-bold uppercase tracking-wider">Your Trusted Health Partner</h2>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-2xl md:text-4xl lg:text-6xl font-extrabold mb-4 md:mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600"
            >
              Modern Healthcare at Your Fingertips
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-base md:text-lg text-gray-600 mb-6 md:mb-10 max-w-xl"
            >
              Experience the convenience of a premium online pharmacy with 24/7 support, 
              expert consultation, and lightning-fast delivery right to your doorstep.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(shopRef, "shop")}
                className="px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold shadow-lg medical-gradient text-white hover:shadow-xl transition-all cursor-pointer text-sm md:text-base"
              >
                Shop Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(contactRef, "contact")}
                className="px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold shadow-lg bg-white text-gray-800 hover:bg-gray-50 border border-gray-200 transition-all cursor-pointer text-sm md:text-base"
              >
                Contact Us
              </motion.button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-8 md:mt-12"
            >
              <div className="flex flex-wrap gap-4 md:gap-6 items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                    <Truck className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                  </div>
                  <span className="text-xs md:text-sm font-medium text-gray-700">Free Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center">
                    <Shield className="w-4 h-4 md:w-5 md:h-5 medical-blue" />
                  </div>
                  <span className="text-xs md:text-sm font-medium text-gray-700">Secure Payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                  </div>
                  <span className="text-xs md:text-sm font-medium text-gray-700">24/7 Support</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="w-full lg:w-1/2 relative z-10"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-medical-blue/10 to-medical-green/10 rounded-3xl blur-xl"></div>
              <img
                src="https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Online Pharmacy"
                className="relative z-10 rounded-3xl shadow-2xl w-full object-cover border border-gray-100"
              />
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -bottom-10 -left-10 z-20 md:block hidden sm:block"
              >
                <div className="bg-white shadow-xl rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Trusted by</p>
                      <p className="font-bold text-gray-800">10,000+ Customers</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -top-10 -right-5 z-20 md:block hidden"
              >
                <div className="bg-white shadow-xl rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center">
                      <Shield className="w-6 h-6 medical-blue" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Licensed</p>
                      <p className="font-bold text-gray-800">Pharmacy</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path 
              fill="#ffffff" 
              fillOpacity="1" 
              d="M0,64L60,80C120,96,240,128,360,128C480,128,600,96,720,80C840,64,960,64,1080,69.3C1200,75,1320,85,1380,90.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
              Why Choose MediCare Plus
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine technology, expertise, and care to provide you with an exceptional pharmacy experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 p-8 cursor-pointer group"
              >
                <div className={`w-16 h-16 rounded-xl ${feature.color === 'from-blue-500 to-indigo-600' ? 'bg-medical-blue' : 
                  feature.color === 'from-green-500 to-emerald-600' ? 'bg-medical-green' : 
                  'bg-gray-500'} flex items-center justify-center mb-6 shadow-md text-white group-hover:shadow-lg transition-shadow`}>
                  {feature.icon}
                </div>
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.2 }}
                  className="text-xl font-bold text-gray-800 mb-3"
                >
                  {feature.title}
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.2 }}
                  className="text-gray-600"
                >
                  {feature.description}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop */}
      <section ref={shopRef} className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 md:mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
              Browse Our Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the medications and health products you need from our curated selection.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 md:mb-8 lg:mb-10"
          >
            <div className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-lg">
              <div className="flex flex-col lg:flex-row gap-3 md:gap-6">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 md:left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg md:text-xl" />
                  <input
                    type="text"
                    placeholder="Search medicines, brands, or conditions..."
                    className="w-full pl-10 md:pl-14 pr-4 md:pr-6 py-3 md:py-5 bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 md:focus:ring-3 focus:ring-medical-blue/20 focus:border-medical-blue transition-all duration-300 text-gray-700 placeholder-gray-500 cursor-text text-sm md:text-base font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-5 pr-10 md:pr-12 focus:outline-none focus:ring-2 md:focus:ring-3 focus:ring-medical-blue/20 focus:border-medical-blue text-gray-700 cursor-pointer text-sm md:text-base font-medium min-w-[160px] w-full md:min-w-[200px]"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <ChevronDown className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="mt-4 md:mt-8 overflow-x-auto scrollbar-hide">
                <div className="flex flex-nowrap md:flex-wrap gap-2 md:gap-4 pb-2 md:pb-0">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory("All")}
                    className={`px-4 py-2 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all duration-300 cursor-pointer shadow-md flex-shrink-0 text-xs md:text-sm ${
                      selectedCategory === "All"
                        ? "medical-gradient text-white shadow-blue-500/25"
                        : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                    }`}
                  >
                    All Categories
                  </motion.button>
                  {categories.map((category) => (
                    <motion.button
                      key={category.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`px-4 py-2 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all duration-300 cursor-pointer shadow-md flex items-center space-x-1 md:space-x-3 flex-shrink-0 text-xs md:text-sm ${
                        selectedCategory === category.name
                          ? category.name === "Pain Relief" ? "bg-red-500 text-white shadow-red-500/25" :
                            category.name === "Cardiovascular" ? "medical-gradient text-white shadow-blue-500/25" :
                            category.name === "Endocrine" ? "medical-green-gradient text-white shadow-green-500/25" :
                            category.name === "Gastrointestinal" ? "bg-purple-500 text-white shadow-purple-500/25" :
                            "bg-yellow-500 text-white shadow-yellow-500/25"
                          : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                      }`}
                    >
                      <span className="flex items-center justify-center text-sm md:text-base">{category.icon}</span>
                      <span className="hidden sm:inline md:inline">{category.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {getFilteredMedicines().map((medicine, index) => (
              <motion.div
                key={medicine.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => {
                  setSelectedMedicine(medicine);
                  setShowMedicineModal(true);
                }}
                className="group relative bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-gray-200 transition-all duration-500 cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={medicine.image}
                    alt={medicine.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {medicine.prescription && (
                      <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        Prescription
                      </span>
                    )}
                    {medicine.originalPrice && (
                      <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        SALE
                      </span>
                    )}
                    {!medicine.inStock && (
                      <span className="bg-gray-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(medicine.id);
                      }}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                        favorites.includes(medicine.id)
                          ? "bg-red-500 text-white border-red-500"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-red-50 hover:border-red-200"
                      }`}
                    >
                      <Heart className={favorites.includes(medicine.id) ? "fill-current" : ""} />
                    </motion.button>
                  </div>
                </div>

                <div className="p-5">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="flex items-start justify-between mb-3"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">{medicine.name}</h3>
                      <p className="text-sm text-gray-600 font-medium">{medicine.manufacturer}</p>
                      <p className="text-xs text-gray-500 mt-1">{medicine.dosage}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">${medicine.price}</p>
                      {medicine.originalPrice && (
                        <p className="text-sm text-gray-400 line-through font-medium">${medicine.originalPrice}</p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-2 mb-4"
                  >
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(medicine.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {medicine.rating} ({medicine.reviews})
                    </span>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(medicine);
                    }}
                    disabled={!medicine.inStock}
                    className={`w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${
                      medicine.inStock
                        ? cartItems.some(item => item.medicine.id === medicine.id)
                          ? "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                          : "medical-gradient text-white hover:shadow-lg cursor-pointer"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingCart />
                    {medicine.inStock 
                      ? cartItems.some(item => item.medicine.id === medicine.id)
                        ? "Added to Cart"
                        : "Add to Cart"
                      : "Out of Stock"}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {getFilteredMedicines().length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="bg-white/30 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-xl">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="text-3xl text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No medicines found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from people who have experienced our service and care.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white border border-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer"
              >
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.2 }}
                  className="flex items-center mb-6"
                >
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                  />
                  <div className="ml-4">
                    <h3 className="font-bold text-gray-800">{testimonial.name}</h3>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.2 }}
                  className="text-gray-600 mb-4 italic"
                >
                  "{testimonial.text}"
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.2 }}
                  className="text-sm text-gray-500"
                >
                  {testimonial.date}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us */}
      <section ref={aboutRef} className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
              About MediCare Plus
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're on a mission to make healthcare more accessible, affordable, and convenient for everyone.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-3xl blur-xl"></div>
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Our Pharmacy"
                  className="relative z-10 rounded-3xl shadow-2xl w-full object-cover"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-800 mb-6"
              >
                Our Story
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-6"
              >
                Founded in 2020, MediCare Plus was born from a simple idea: healthcare should be accessible to everyone, 
                anywhere, anytime. We recognized the challenges people faced with traditional pharmacies – long wait times, 
                limited hours, and inconsistent availability of medications.
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 mb-6"
              >
                Our team of healthcare professionals and technology experts came together to create a modern pharmacy 
                experience that leverages the latest digital innovations while maintaining the personal care and attention 
                that patients deserve.
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-gray-600 mb-10"
              >
                Today, we serve thousands of customers nationwide, providing not just medications, but peace of mind. 
                Our commitment to quality, convenience, and care guides everything we do as we continue to revolutionize 
                the pharmacy experience.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-6 mt-4"
              >
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">5,000+</div>
                  <p className="text-gray-600">Daily Customers</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-purple-600 mb-2">99.8%</div>
                  <p className="text-gray-600">Delivery Accuracy</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
                  <p className="text-gray-600">Expert Support</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Team */}
          <div className="mt-16 md:mt-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8 md:mb-16"
            >
              <h3 className="text-2xl lg:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                Meet Our Team
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Dedicated professionals committed to your health and wellbeing.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-white/40 backdrop-blur-xl border border-white/30 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 text-center cursor-pointer"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.2 }}
                      className="absolute bottom-0 left-0 right-0 p-6 text-white"
                    >
                      <h4 className="font-bold text-xl">{member.name}</h4>
                      <p className="text-white/80">{member.position}</p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* FAQs */}
          <div className="mt-16 md:mt-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8 md:mb-16"
            >
              <h3 className="text-2xl lg:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                Frequently Asked Questions
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about our services.
              </p>
            </motion.div>
            
            <div className="max-w-3xl mx-auto">
              {faqs.map((faq, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="mb-4"
                >
                  <div 
                    className={`bg-white/40 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg transition-all duration-300 overflow-hidden ${
                      expandedFaq === index ? "shadow-xl" : ""
                    }`}
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full p-6 text-left flex justify-between items-center cursor-pointer"
                    >
                      <motion.h4 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="font-bold text-gray-800"
                      >
                        {faq.question}
                      </motion.h4>
                      {expandedFaq === index ? (
                        <ChevronUp className="text-gray-600 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="text-gray-600 flex-shrink-0" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {expandedFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-6"
                        >
                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-600"
                          >
                            {faq.answer}
                          </motion.p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section ref={contactRef} className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
              Contact Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions or need assistance? We're here to help.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-lg">
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-gray-800 mb-6"
                >
                  Send Us a Message
                </motion.h3>
                
                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-6 text-center"
                  >
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h4 className="text-xl font-bold mb-2">Message Sent Successfully!</h4>
                    <p>Thank you for reaching out. We'll get back to you as soon as possible.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit}>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mb-6"
                    >
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleFormChange}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-blue/50 focus:border-medical-blue transition-all duration-300 text-gray-700 cursor-text"
                          placeholder="Your Name"
                        />
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mb-6"
                    >
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formState.email}
                          onChange={handleFormChange}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-blue/50 focus:border-medical-blue transition-all duration-300 text-gray-700 cursor-text"
                          placeholder="Your Email"
                        />
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mb-6"
                    >
                      <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-6 text-gray-400" />
                        <textarea
                          id="message"
                          name="message"
                          value={formState.message}
                          onChange={handleFormChange}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-blue/50 focus:border-medical-blue transition-all duration-300 text-gray-700 min-h-[150px] cursor-text"
                          placeholder="Your Message"
                        ></textarea>
                      </div>
                    </motion.div>
                    
                    {formError && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-6 text-red-500 bg-red-50 border border-red-200 p-3 rounded-xl text-sm"
                      >
                        {formError}
                      </motion.div>
                    )}
                    
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-4 rounded-xl font-bold transition-all duration-300 medical-gradient text-white shadow-lg hover:shadow-xl cursor-pointer"
                    >
                      Send Message
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-lg h-full">
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-gray-800 mb-6"
                >
                  Get in Touch
                </motion.h3>
                
                <div className="space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 medical-blue" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Our Location</h4>
                      <p className="text-gray-600">123 Healthcare Avenue<br />Wellness District, CA 90210</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Phone Number</h4>
                      <p className="text-gray-600">Customer Support: (800) 123-4567<br />Pharmacy Direct: (800) 987-6543</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Email Address</h4>
                      <p className="text-gray-600">info@medicareplus.com<br />support@medicareplus.com</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Business Hours</h4>
                      <p className="text-gray-600">
                        Monday - Friday: 8:00 AM - 8:00 PM<br />
                        Saturday: 9:00 AM - 6:00 PM<br />
                        Sunday: 10:00 AM - 4:00 PM
                      </p>
                      <p className="text-sm medical-blue mt-2 font-medium">* Online support available 24/7</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 medical-gradient rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">MediCare Plus</h2>
                  <p className="text-sm text-gray-300">Premium Online Pharmacy</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6">
                Making healthcare accessible, affordable, and convenient for everyone, everywhere.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-xl">🔵</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-xl">🐦</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-xl">📸</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-xl">🔗</span>
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h3 className="text-lg font-bold mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li><button onClick={() => scrollToSection(heroRef, "hero")} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Home</button></li>
                <li><button onClick={() => scrollToSection(shopRef, "shop")} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Shop</button></li>
                <li><button onClick={() => scrollToSection(aboutRef, "about")} className="text-gray-400 hover:text-white transition-colors cursor-pointer">About Us</button></li>
                <li><button onClick={() => scrollToSection(contactRef, "contact")} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Contact</button></li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h3 className="text-lg font-bold mb-6">Categories</h3>
              <ul className="space-y-4">
                {categories.map((category) => (
                  <li key={category.name}>
                    <button 
                      onClick={() => {
                        scrollToSection(shopRef, "shop");
                        setSelectedCategory(category.name);
                      }}
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-16 pt-8 border-t border-gray-700 text-center"
          >
            <p className="text-gray-400">
              © {new Date().getFullYear()} MediCare Plus. All rights reserved.
            </p>
          </motion.div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full medical-gradient text-white flex items-center justify-center shadow-lg hover:shadow-xl z-40 cursor-pointer"
          >
            <ChevronUp />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Shopping Cart */}
      <AnimatePresence>
        {showCartModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/50 backdrop-blur-sm overflow-hidden"
          >
            <motion.div
              ref={cartRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-sm md:max-w-lg max-h-[95vh] md:max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Enhanced Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 md:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 medical-gradient rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-gray-800">Shopping Cart</h2>
                      <p className="text-xs md:text-sm text-gray-600">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCartModal(false)}
                    className="w-8 h-8 md:w-10 md:h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 cursor-pointer shadow-sm"
                  >
                    <X className="w-4 h-4 md:w-5 md:h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Cart Content */}
              <div className="flex-1 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 md:py-16 px-4 md:px-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 md:mb-6">
                      <ShoppingCart className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
                    <p className="text-sm md:text-base text-gray-600 text-center mb-4 md:mb-6">Discover our wide range of medicines and health products</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowCartModal(false);
                        scrollToSection(shopRef, "shop");
                      }}
                      className="px-4 py-2 md:px-6 md:py-3 medical-gradient text-white rounded-lg md:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer text-sm md:text-base"
                    >
                      Start Shopping
                    </motion.button>
                  </div>
                ) : (
                  <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={`${item.medicine.id}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border border-gray-200 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-start gap-3 md:gap-4">
                          {/* Product Image */}
                          <div className="relative flex-shrink-0">
                            <img
                              src={item.medicine.image}
                              alt={item.medicine.name}
                              className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg md:rounded-xl border border-gray-100"
                            />
                            {item.medicine.prescription && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-bold">Rx</span>
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 mb-1 truncate text-sm md:text-base">{item.medicine.name}</h3>
                            <p className="text-xs md:text-sm text-gray-600 mb-1">{item.medicine.manufacturer}</p>
                            <p className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md inline-block">
                              {item.medicine.dosage}
                            </p>
                            <div className="flex items-center justify-between mt-2 md:mt-3">
                              <div className="text-base md:text-lg font-bold medical-blue">${item.medicine.price}</div>
                              <div className="text-xs md:text-sm text-gray-600">
                                Subtotal: <span className="font-semibold">${(item.medicine.price * item.quantity).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromCart(index)}
                            className="w-6 h-6 md:w-8 md:h-8 bg-red-50 border border-red-200 rounded-full flex items-center justify-center text-red-600 hover:bg-red-100 hover:border-red-300 transition-all duration-300 cursor-pointer"
                          >
                            <X className="w-3 h-3 md:w-4 md:h-4" />
                          </motion.button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-3 md:mt-4 pt-2 md:pt-3 border-t border-gray-100">
                          <span className="text-xs md:text-sm font-medium text-gray-700">Quantity:</span>
                          <div className="flex items-center gap-2 md:gap-3 bg-gray-50 rounded-lg md:rounded-xl p-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                              className="w-7 h-7 md:w-8 md:h-8 bg-white border border-gray-200 rounded-md md:rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 cursor-pointer shadow-sm"
                            >
                              <Minus className="w-3 h-3 md:w-4 md:h-4" />
                            </motion.button>
                            <span className="w-6 md:w-8 text-center font-bold text-gray-900 text-sm md:text-base">{item.quantity}</span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                              className="w-7 h-7 md:w-8 md:h-8 bg-white border border-gray-200 rounded-md md:rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 cursor-pointer shadow-sm"
                            >
                              <Plus className="w-3 h-3 md:w-4 md:h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Enhanced Checkout Section */}
              {cartItems.length > 0 && (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 p-6">
                  {/* Order Summary */}
                  <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Subtotal ({totalItems} items):</span>
                      <span className="font-semibold text-gray-800">${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Delivery:</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total:</span>
                        <span className="text-2xl font-bold medical-blue">${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePlaceOrder}
                      className="w-full medical-green-gradient text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Place Order
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowCartModal(false);
                        scrollToSection(shopRef, "shop");
                      }}
                      className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 cursor-pointer"
                    >
                      Continue Shopping
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Medicine Detail */}
      <AnimatePresence>
        {showMedicineModal && selectedMedicine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-hidden"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border border-gray-100 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Fixed Header with Image */}
              <div className="relative flex-shrink-0">
                <img
                  src={selectedMedicine.image}
                  alt={selectedMedicine.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowMedicineModal(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                >
                  <X className="text-xl" />
                </motion.button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedMedicine.name}</h2>
                    <p className="text-gray-600 font-medium mb-1">{selectedMedicine.manufacturer}</p>
                    <p className="text-sm text-gray-500 mb-3">{selectedMedicine.dosage}</p>
                    
                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedMedicine.prescription && (
                        <span className="bg-red-50 border border-red-200 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Prescription Required
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedMedicine.inStock 
                          ? "bg-green-50 border border-green-200 text-green-700" 
                          : "bg-red-50 border border-red-200 text-red-700"
                      }`}>
                        {selectedMedicine.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                      {selectedMedicine.originalPrice && (
                        <span className="bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                          On Sale
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-gray-900">${selectedMedicine.price}</p>
                    {selectedMedicine.originalPrice && (
                      <p className="text-sm text-gray-400 line-through font-medium">${selectedMedicine.originalPrice}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(selectedMedicine.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {selectedMedicine.rating} ({selectedMedicine.reviews} reviews)
                  </span>
                </div>

                {/* Enhanced Information Sections */}
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                      <div className="w-2 h-6 bg-medical-blue rounded-full"></div>
                      Description
                    </h3>
                    <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">
                      {selectedMedicine.description}
                    </p>
                  </div>

                  {/* Medicine Details */}
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                      <div className="w-2 h-6 bg-medical-green rounded-full"></div>
                      Medicine Information
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Manufacturer:</span>
                        <span className="text-gray-800 font-semibold">{selectedMedicine.manufacturer}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Dosage:</span>
                        <span className="text-gray-800 font-semibold">{selectedMedicine.dosage}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Category:</span>
                        <span className="inline-block bg-blue-50 border border-blue-200 medical-blue px-3 py-1 rounded-full text-sm font-semibold">
                          {selectedMedicine.category}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Prescription:</span>
                        <span className={`font-semibold ${selectedMedicine.prescription ? 'text-red-600' : 'text-green-600'}`}>
                          {selectedMedicine.prescription ? 'Required' : 'Not Required'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {selectedMedicine.tags && selectedMedicine.tags.length > 0 && (
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                        <div className="w-2 h-6 bg-gray-400 rounded-full"></div>
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedMedicine.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddToCart(selectedMedicine)}
                    disabled={!selectedMedicine.inStock}
                    className={`flex-1 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                      selectedMedicine.inStock
                        ? cartItems.some(item => item.medicine.id === selectedMedicine.id)
                          ? "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                          : "medical-gradient text-white hover:shadow-xl cursor-pointer"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingCart />
                    {selectedMedicine.inStock 
                      ? cartItems.some(item => item.medicine.id === selectedMedicine.id)
                        ? "Added to Cart"
                        : "Add to Cart"
                      : "Out of Stock"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleFavorite(selectedMedicine.id)}
                    className={`px-6 py-4 rounded-xl font-bold transition-all duration-300 cursor-pointer shadow-lg ${
                      favorites.includes(selectedMedicine.id)
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Heart className={favorites.includes(selectedMedicine.id) ? "fill-current" : ""} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Success Notification */}
      <AnimatePresence>
        {orderPlaced && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className="bg-green-500 text-white px-8 py-4 rounded-xl shadow-2xl border border-green-400">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    ✓
                  </motion.div>
                </div>
                <div>
                  <p className="font-bold">Order Placed Successfully!</p>
                  <p className="text-sm opacity-90">Thank you for your purchase</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Success Notification */}
      <AnimatePresence>
        {formSubmitted && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className="medical-gradient text-white px-8 py-4 rounded-xl shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    ✓
                  </motion.div>
                </div>
                <div>
                  <p className="font-bold">Message Sent Successfully!</p>
                  <p className="text-sm opacity-90">We'll get back to you soon</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
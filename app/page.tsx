"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Scholarship {
  id: number;
  title: string;
  category: string;
  amount: string;
  duration: string;
  eligibility: string;
  description: string;
  posterUrl: string;
  cartId?: string;
}

interface Beneficiary {
  id: number;
  name: string;
  scholarship: string;
  year: string;
  currentStatus: string;
  photoUrl: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const scholarships: Scholarship[] = [
  {
    id: 1,
    title: "Merit-Cum-Means Scholarship",
    category: "Undergraduate",
    amount: "₹50,000 per year",
    duration: "4 years",
    eligibility: "Students from economically weaker sections with excellent.",
    description: "This scholarship aims to support deserving students who excel academically but come from financially challenged backgrounds. It covers tuition fees and provides a stipend for books and living expenses.",
    posterUrl: "https://images.unsplash.com/photo-1746950862786-c13d07b85bff?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 2,
    title: "Women Empowerment Scholarship",
    category: "Graduate",
    amount: "₹75,000 per year",
    duration: "2 years",
    eligibility: "Female students pursuing higher education in STEM fields",
    description: "Empowering women through education is our priority. This scholarship encourages more girls to take up careers in science, technology, engineering, and mathematics by providing financial assistance and mentorship opportunities.",
    posterUrl: "https://plus.unsplash.com/premium_photo-1732473760222-389820a18261?q=80&w=2080&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Sports Excellence Scholarship",
    category: "Undergraduate",
    amount: "₹1,00,000 per year",
    duration: "4 years",
    eligibility: "Students who have represented state/national teams.",
    description: "Recognizing the importance of sports in shaping young talent, this scholarship supports promising athletes by covering their educational expenses and providing training support.",
    posterUrl: "https://images.unsplash.com/photo-1747171232978-0e1cbcbcbdf8?q=80&w=2944&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 4,
    title: "Research Excellence Scholarship",
    category: "PhD",
    amount: "₹1,50,000 per year",
    duration: "3-5 years",
    eligibility: "Students pursuing PhD in recognized institutions.",
    description: "Fostering research and innovation is crucial for national progress. This scholarship provides substantial support to PhD students working on cutting-edge research projects, covering tuition fees and providing a generous stipend.",
    posterUrl: "https://images.unsplash.com/photo-1747134392291-33541db5f30f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 5,
    title: "SC/ST Student Support Scholarship",
    category: "Undergraduate",
    amount: "₹40,000 per year",
    duration: "4 years",
    eligibility: "Students belonging to SC/ST categories pursuing higher education",
    description: "Ensuring equal opportunities for all, this scholarship provides financial assistance to SC/ST students, covering tuition fees, accommodation, and study materials.",
    posterUrl: "https://images.unsplash.com/photo-1713769931183-1537d9a8126b?q=80&w=1932&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Minority Community Scholarship",
    category: "Graduate",
    amount: "₹60,000 per year",
    duration: "2 years",
    eligibility: "Students from minority communities pursuing education",
    description: "Promoting educational inclusivity, this scholarship supports students from minority communities by providing financial aid and cultural exchange opportunities.",
    posterUrl: "https://plus.unsplash.com/premium_photo-1690297853326-e127726588ac?q=80&w=2080&auto=format&fit=crop"
  }
];

const beneficiaries: Beneficiary[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    scholarship: "Merit-Cum-Means Scholarship",
    year: "2023-24",
    currentStatus: "Pursuing MBBS at AIIMS Delhi",
    photoUrl: "https://images.unsplash.com/photo-1746933156614-54eeb2dfaf3c?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 2,
    name: "Priya Verma",
    scholarship: "Women Empowerment Scholarship",
    year: "2022-23",
    currentStatus: "Completed B.Tech in Computer Science from IIT Bombay",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2080&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Rohan Mehta",
    scholarship: "Sports Excellence Scholarship",
    year: "2023-24",
    currentStatus: "Pursuing B.A. in Physical Education from Delhi University",
    photoUrl: "https://images.unsplash.com/photo-1746956709021-54be7fcc763b?q=80&w=3133&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 4,
    name: "Ananya Singh",
    scholarship: "Research Excellence Scholarship",
    year: "2022-23",
    currentStatus: "Pursuing PhD in Environmental Science at IIT Kanpur",
    photoUrl: "https://images.unsplash.com/photo-1568743296270-9cc798164b3b?q=80&w=2053&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Vijay Kumar",
    scholarship: "SC/ST Student Support Scholarship",
    year: "2023-24",
    currentStatus: "Pursuing B.Com from St. Stephen's College, Delhi",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Fatima Khan",
    scholarship: "Minority Community Scholarship",
    year: "2022-23",
    currentStatus: "Completed M.A. in Economics from Jamia Millia Islamia",
    photoUrl: "https://images.unsplash.com/photo-1746950862786-c13d07b85bff?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }
];

const faqs: FAQ[] = [
  {
    question: "What is the eligibility criteria for these scholarships?",
    answer: "Eligibility varies by scholarship. Generally, we consider academic performance, financial need, and specific criteria for each category. Please check individual scholarship details for precise requirements."
  },
  {
    question: "How can I apply for these scholarships?",
    answer: "You can apply through our online portal on the website. Create an account, fill out the application form, and submit required documents. The portal opens typically in January every year."
  },
  {
    question: "What documents are required for the application?",
    answer: "Commonly required documents include proof of identity, income certificate, mark sheets, and a personal statement. Some scholarships may require additional documents. Check the specific scholarship page for a complete list."
  },
  {
    question: "When will the scholarship money be disbursed?",
    answer: "Scholarship funds are typically disbursed directly to the educational institution at the beginning of each academic year. In some cases, stipends are also provided directly to students."
  },
  {
    question: "Can I continue the scholarship for multiple years?",
    answer: "Yes, most scholarships can be renewed annually provided you maintain the required academic performance and submit a renewal application each year."
  }
];

function Home() {
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [scrollY, setScrollY] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [beneficiaryModalOpen, setBeneficiaryModalOpen] = useState<boolean>(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [cart, setCart] = useState<Scholarship[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [showCheckoutToast, setShowCheckoutToast] = useState<boolean>(false);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scrolling when modals are open
  useEffect(() => {
    const preventScroll = modalOpen || beneficiaryModalOpen || isCartOpen;
    if (preventScroll) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalOpen, beneficiaryModalOpen, isCartOpen]);

  const handleViewDetails = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedScholarship(null);
  };

  const handleViewBeneficiary = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setBeneficiaryModalOpen(true);
  };

  const handleCloseBeneficiaryModal = () => {
    setBeneficiaryModalOpen(false);
    setSelectedBeneficiary(null);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  const addToCart = (scholarship: Scholarship) => {
    const cartItem = {
      ...scholarship,
      cartId: `${scholarship.id}_${Date.now()}`
    };
    setCart([...cart, cartItem]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.cartId && item.cartId !== id));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  const handleCheckout = () => {
    setShowCheckoutToast(true);
    setIsCartOpen(false);
    setTimeout(() => setShowCheckoutToast(false), 3000);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const navVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-white font-sans`}>
      <header
        className={`sticky top-0 z-50 w-full border-b border-transparent backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 transition-all duration-300 ${scrollY > 50
          ? "border-gray-200 dark:border-gray-800 shadow-sm"
          : "border-transparent"
          }`}
      >
        <motion.div
          className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16"
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex items-center"
            variants={navVariants}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 font-serif">
                  Scholarships
                </span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-8">
                  {[
                    { id: "home", label: "Home" },
                    { id: "scholarships", label: "Scholarships" },
                    { id: "beneficiaries", label: "Beneficiaries" },
                    { id: "faq", label: "FAQ" },
                    { id: "contact", label: "Contact" },
                  ].map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                    >
                      <button
                        onClick={() => scrollToSection(item.id)}
                        className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 cursor-pointer ${activeSection === item.id
                          ? "text-blue-600 dark:text-blue-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 after:transition-all after:duration-300"
                          : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                          }`}
                      >
                        {item.label}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          <div className="flex items-center gap-4">
            <motion.button 
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </motion.button>

            <div className="hidden md:block">
              <motion.a
                href="#scholarships"
                className="ml-4 px-4 py-2 rounded-md bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium transition-colors duration-300 shadow-md hover:shadow-blue-500/30 dark:hover:shadow-blue-700/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Apply Now
              </motion.a>
            </div>

            <div className="md:hidden">
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300 cursor-pointer"
                whileTap={{ scale: 0.9 }}
              >
                {mobileMenuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {[
                  { id: "home", label: "Home" },
                  { id: "scholarships", label: "Scholarships" },
                  { id: "beneficiaries", label: "Beneficiaries" },
                  { id: "faq", label: "FAQ" },
                  { id: "contact", label: "Contact" },
                ].map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 w-full text-left cursor-pointer ${activeSection === item.id
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                    >
                      {item.label}
                    </button>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <a
                    href="#scholarships"
                    className="block px-3 py-2 rounded-md bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium transition-colors duration-300 w-full text-center shadow-md hover:shadow-blue-500/30 dark:hover:shadow-blue-700/30 cursor-pointer"
                  >
                    Apply Now
                  </a>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {isCartOpen && (
          <motion.div 
            className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="relative w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Applications</h3>
                    <button 
                      onClick={() => setIsCartOpen(false)} 
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="p-5">
                  {cart.length === 0 ? (
                    <div className="py-8 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="mt-4 text-gray-500 dark:text-gray-400">Your cart is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cart.map(item => (
                        <div key={item.cartId} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">{item.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.amount}</p>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.cartId!)}
                            className="ml-2 p-1.5 text-red-500 hover:text-red-700 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                            aria-label="Remove item"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {cart.length > 0 && (
                  <div className="p-5 border-t border-gray-200 dark:border-gray-700">
                    <motion.button 
                      className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium shadow-md hover:shadow-blue-500/30 dark:hover:shadow-blue-700/30 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout}
                    >
                      Submit Application
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <section
          id="home"
          className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-500 dark:from-blue-800 dark:to-blue-700"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiPjxwYXRoIGQ9Ik0xNSA0MGMwIDQuMTQyLTEuNzQ4IDYtMyA2bDMgMTQgNy4zNzUtMy4wNjJBMTAuOTY3IDEwLjk2NyAwIDAxMjcgNTJjMCA1LjIzNy0zIDYtNiA2cy02LTEuNDE0LTYtNiAwIDQgNCA0YzQuNTQ2IDAgNC0xLjQxNCA0LTRzLTEuNDE0LTYtNi02Yy00LjU0NiAwLTYgMS40NTQtNiA2eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat opacity-20"></div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 dark:from-gray-100 dark:to-blue-300 leading-tight">
                  Empowering Education Through Scholarships
                </h1>
                <p className="text-lg md:text-xl text-blue-100 dark:text-blue-200 font-medium leading-relaxed">
                  Discover scholarship opportunities that can transform your educational journey and unlock your full potential.
                </p>
                <div className="flex flex-wrap gap-3">
                  <motion.a
                    href="#scholarships"
                    className="px-6 py-3 rounded-md bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-700/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore Scholarships
                  </motion.a>
                  <motion.button
                    onClick={() => scrollToSection("beneficiaries")}
                    className="px-6 py-3 rounded-md border-2 border-white dark:border-gray-700 text-white dark:text-gray-300 font-medium transition-all duration-300 hover:bg-white/10 dark:hover:bg-gray-700/30 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Success Stories
                  </motion.button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative hidden lg:block"
              >
                <div className="relative">
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-xl"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full border border-white/10 dark:border-gray-800"></div>
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop"
                    alt="Students celebrating success"
                    className="relative rounded-lg shadow-2xl w-full h-[500px] object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-700/20 dark:from-blue-900/20 to-transparent"></div>
        </section>

        <section id="scholarships" className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 font-serif">
                Our Scholarship Programs
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 font-medium">
                Empowering students through various scholarship programs
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={container}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {scholarships.map((scholarship, index) => (
                <motion.div
                  key={scholarship.id}
                  variants={item}
                  custom={index}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative pb-4 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      src={scholarship.posterUrl}
                      alt={scholarship.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 px-3 py-1 rounded-full text-sm font-medium text-blue-600 dark:text-blue-400 z-10">
                      {scholarship.category}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-black/50 z-10">
                      <h3 className="text-xl font-bold text-white mb-2">{scholarship.title}</h3>
                      <p className="text-lg font-medium text-blue-200 dark:text-blue-300">
                        {scholarship.amount}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-rows-[1fr_auto] h-64 p-6">
                    <div className="space-y-4 mb-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                          Duration: {scholarship.duration}
                        </span>
                        <span className="px-3 py-1 bg-gray-50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium">
                          Eligibility: {scholarship.eligibility}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                        {scholarship.description}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => handleViewDetails(scholarship)}
                      className="px-4 py-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-md transition-colors duration-300 w-full font-medium shadow-md hover:shadow-blue-500/30 dark:hover:shadow-blue-700/30 cursor-pointer self-end"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      View Details
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="beneficiaries" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400 dark:from-blue-400 dark:to-indigo-300 font-serif">
                Success Stories
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 font-medium">
                Real-life success stories of our scholarship beneficiaries
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={container}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {beneficiaries.map((beneficiary, index) => (
                <motion.div
                  key={beneficiary.id}
                  variants={item}
                  custom={index}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    <img
                      src={beneficiary.photoUrl}
                      alt={beneficiary.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-black/50">
                      <h3 className="text-xl font-bold text-white mb-2">{beneficiary.name}</h3>
                      <p className="text-lg font-medium text-blue-200 dark:text-blue-300">
                        {beneficiary.scholarship}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-rows-[1fr_auto] h-64 p-6">
                    <div className="space-y-4 mb-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                          Year: {beneficiary.year}
                        </span>
                        <span className="px-3 py-1 bg-gray-50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium">
                          Status: {beneficiary.currentStatus}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                        {beneficiary.currentStatus}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => handleViewBeneficiary(beneficiary)}
                      className="px-4 py-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-md transition-colors duration-300 w-full font-medium shadow-md hover:shadow-blue-500/30 dark:hover:shadow-blue-700/30 cursor-pointer self-end"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      View Story
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="faq" className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 font-serif">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 font-medium">
                Find answers to common questions about our scholarships
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={container}
              className="max-w-3xl mx-auto space-y-4"
            >
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  custom={index}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <button
                    className={`w-full flex justify-between items-center p-5 focus:outline-none transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer`}
                    onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                  >
                    <span className="text-lg font-medium text-gray-900 dark:text-white text-left">
                      {faq.question}
                    </span>
                    <svg
                      className={`w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform duration-300 ${faqOpen === index ? "transform rotate-180" : ""
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {faqOpen === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                      >
                        <p className="text-gray-600 dark:text-gray-300 text-left">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="contact" className="py-16 bg-gradient-to-br from-blue-600 to-blue-500 dark:from-blue-800 dark:to-blue-700 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-extrabold text-white font-serif">
                Get in Touch
              </h2>
              <p className="mt-4 text-lg text-blue-100 dark:text-blue-200 font-medium">
                Have questions? We'd love to hear from you.
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={container}
              className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8"
            >
              <motion.div
                variants={item}
                className="md:col-span-2 space-y-8"
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">Contact Information</h3>
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white/90">123 Education Street, Knowledge City, India</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 01-2-2V7a2 2 0 012-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white/90">contact@scholarships.gov.in</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white/90">+91 12345 67890</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">Follow Us</h3>
                  <div className="flex space-x-4">
                    <motion.a
                      href="#"
                      className="bg-white/10 p-3 rounded-lg text-white hover:bg-white/20 transition-colors duration-300 cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </motion.a>
                    <motion.a
                      href="#"
                      className="bg-white/10 p-3 rounded-lg text-white hover:bg-white/20 transition-colors duration-300 cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </motion.a>
                    <motion.a
                      href="#"
                      className="bg-white/10 p-3 rounded-lg text-white hover:bg-white/20 transition-colors duration-300 cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 01-2-2V7a2 2 0 012-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </motion.a>
                  </div>
                </div>
              </motion.div>
              <motion.div
                variants={item}
                className="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Send us a message</h3>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 cursor-text"
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 cursor-text"
                          placeholder="Your email"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 cursor-text"
                        placeholder="Subject"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 cursor-text"
                        placeholder="Your message"
                        required
                      ></textarea>
                    </div>

                    {formSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md"
                      >
                        Your message has been sent. We'll contact you soon!
                      </motion.div>
                    )}

                    <motion.button
                      type="submit"
                      className="w-full px-6 py-3 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-300 font-medium shadow-md hover:shadow-blue-500/30 dark:hover:shadow-blue-700/30 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Send Message
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {modalOpen && selectedScholarship && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative h-48 sm:h-64 w-full">
                <img
                  src={selectedScholarship.posterUrl || "/placeholder.svg"}
                  alt={selectedScholarship.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 bg-white/20 dark:bg-gray-900/20 p-2 rounded-full text-white hover:bg-white/30 dark:hover:bg-gray-900/30 transition-colors duration-300 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedScholarship.title}
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4">
                    {selectedScholarship.category}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1 sm:mb-2">
                        Scholarship Amount
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {selectedScholarship.amount}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1 sm:mb-2">
                        Duration
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {selectedScholarship.duration}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1 sm:mb-2">
                        Eligibility
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {selectedScholarship.eligibility}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1 sm:mb-2">
                        Description
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {selectedScholarship.description}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1 sm:mb-2">
                        Application Process
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Applications are accepted online through our portal. Please create an account, fill out the application form, and submit required documents.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
                  <motion.button
                    onClick={() => {
                      addToCart(selectedScholarship);
                      handleCloseModal();
                    }}
                    className="px-6 py-3 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-md transition-colors duration-300 font-medium shadow-md hover:shadow-blue-500/30 dark:hover:shadow-blue-700/30 w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {beneficiaryModalOpen && selectedBeneficiary && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative h-48 sm:h-64 w-full">
                <img
                  src={selectedBeneficiary.photoUrl || "/placeholder.svg"}
                  alt={selectedBeneficiary.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                <button
                  onClick={handleCloseBeneficiaryModal}
                  className="absolute top-4 right-4 bg-white/20 dark:bg-gray-900/20 p-2 rounded-full text-white hover:bg-white/30 dark:hover:bg-gray-900/30 transition-colors duration-300 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedBeneficiary.name}
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4">
                    {selectedBeneficiary.scholarship}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1 sm:mb-2">
                        Year
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {selectedBeneficiary.year}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1 sm:mb-2">
                        Current Status
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {selectedBeneficiary.currentStatus}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1 sm:mb-2">
                        Success Story
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {selectedBeneficiary.currentStatus}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1 sm:mb-2">
                        Career Aspirations
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Pursuing higher studies and aiming for a successful career in {selectedBeneficiary.scholarship.includes("Science") ? "research" : "technology"}.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
                  <div className="hidden">
                    {/* Placeholder for future buttons */}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCheckoutToast && (
          <motion.div 
            className="fixed bottom-6 right-6 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Application submitted successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 font-serif">
                Scholarships
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-md">
                Empowering students to achieve their educational goals through various scholarship programs.
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} Scholarships. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
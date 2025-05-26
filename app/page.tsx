"use client"
import React, { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  X, 
  ChevronDown, 
  Moon, 
  Sun, 
  Sparkles, 
  Zap,
  Shield,
  Users,
  HeadphonesIcon,
  ArrowUp,
  ArrowDown,
  Star,
  Menu,
  Plus
} from 'lucide-react';

// --------- Data Models ---------
type Plan = {
  id: string;
  name: string;
  price: number;
  color: string;
  gradient: string;
  popular?: boolean;
  description: string;
};

type Feature = {
  id: string;
  name: string;
  description: string;
  plans: string[];
  icon?: React.ReactNode;
};

type FeatureCategory = {
  id: string;
  name: string;
  features: Feature[];
  icon: React.ReactNode;
  color: string;
};

// --------- Demo Data ---------
const plans: Plan[] = [
  { 
    id: 'basic', 
    name: 'Basic', 
    price: 15, 
    color: '#3b82f6',
    gradient: 'from-blue-500 to-blue-600',
    description: 'Perfect for small teams getting started'
  },
  { 
    id: 'pro', 
    name: 'Pro', 
    price: 35, 
    color: '#8b5cf6',
    gradient: 'from-purple-500 to-purple-600',
    popular: true,
    description: 'Most popular choice for growing businesses'
  },
  { 
    id: 'business', 
    name: 'Business', 
    price: 60, 
    color: '#10b981',
    gradient: 'from-emerald-500 to-emerald-600',
    description: 'Advanced features for enterprise teams'
  },
];

const featureCategories: FeatureCategory[] = [
  {
    id: 'collab',
    name: 'Collaboration',
    icon: <Users className="w-5 h-5" />,
    color: '#3b82f6',
    features: [
      { 
        id: 'chat', 
        name: 'Team Chat', 
        description: 'Real-time messaging with your team members, file sharing, and emoji reactions.', 
        plans: ['basic', 'pro', 'business'],
        icon: <Users className="w-4 h-4" />
      },
      { 
        id: 'share', 
        name: 'File Sharing', 
        description: 'Share files of any size with advanced version control and collaboration tools.', 
        plans: ['pro', 'business'],
        icon: <Sparkles className="w-4 h-4" />
      },
      { 
        id: 'tasks', 
        name: 'Task Assignment', 
        description: 'Assign and track tasks with deadlines, priorities, and progress monitoring.', 
        plans: ['business'],
        icon: <Zap className="w-4 h-4" />
      },
    ],
  },
  {
    id: 'security',
    name: 'Security',
    icon: <Shield className="w-5 h-5" />,
    color: '#8b5cf6',
    features: [
      { 
        id: '2fa', 
        name: '2FA', 
        description: 'Two-factor authentication with SMS, email, or authenticator app support.', 
        plans: ['pro', 'business'],
        icon: <Shield className="w-4 h-4" />
      },
      { 
        id: 'sso', 
        name: 'Single Sign-On', 
        description: 'Enterprise SSO integration with Google, Microsoft, Okta, and more.', 
        plans: ['business'],
        icon: <Zap className="w-4 h-4" />
      },
      { 
        id: 'encryption', 
        name: 'Encryption', 
        description: 'End-to-end AES-256 encryption for all your data and communications.', 
        plans: ['basic', 'pro', 'business'],
        icon: <Shield className="w-4 h-4" />
      },
    ],
  },
  {
    id: 'support',
    name: 'Support',
    icon: <HeadphonesIcon className="w-5 h-5" />,
    color: '#10b981',
    features: [
      { 
        id: 'email', 
        name: 'Email Support', 
        description: '24/7 email support with guaranteed response times and priority handling.', 
        plans: ['basic', 'pro', 'business'],
        icon: <HeadphonesIcon className="w-4 h-4" />
      },
      { 
        id: 'phone', 
        name: 'Phone Support', 
        description: 'Direct phone line to our support team during business hours.', 
        plans: ['business'],
        icon: <HeadphonesIcon className="w-4 h-4" />
      },
      { 
        id: 'chat_support', 
        name: 'Live Chat', 
        description: 'Instant chat support with real agents, not bots, available 24/7.', 
        plans: ['pro', 'business'],
        icon: <Users className="w-4 h-4" />
      },
    ],
  },
];

// --------- Lazy-Loaded Feature Description Component ---------
const FeatureDescription = React.lazy(() =>
  new Promise<{ default: React.FC<{ description: string; isDarkMode: boolean }> }>((resolve) => {
    setTimeout(() => {
      resolve({
        default: ({ description, isDarkMode }) => (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`mt-3 p-3 rounded-lg text-sm leading-relaxed ${
              isDarkMode 
                ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                : 'bg-gray-50 text-gray-600 border border-gray-200'
            }`}
          >
            {description}
          </motion.div>
        ),
      });
    }, 300);
  })
);

// --------- Main Component ---------
const SaaSFeatureMatrix: React.FC = () => {
  // State
  const [selectedPlans, setSelectedPlans] = useState<string[]>(['pro']);
  const [openCategories, setOpenCategories] = useState<string[]>(['collab']);
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCtaBar, setShowCtaBar] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isTrialMode, setIsTrialMode] = useState(false);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Refs for scroll navigation
  const heroRef = useRef<HTMLDivElement>(null);
  const plansRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  // Responsive and scroll handling
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      setShowScrollButtons(window.scrollY > 200);
    };
    
    handleResize();
    handleScroll();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  // Pricing calculation
  const totalPrice = selectedPlans.reduce((sum, planId) => {
    const plan = plans.find(p => p.id === planId);
    return sum + (plan?.price || 0);
  }, 0);

  const highestPlan = selectedPlans
    .map(pid => plans.find(p => p.id === pid)!)
    .filter(Boolean)
    .sort((a, b) => b.price - a.price)[0];

  // Handlers
  const togglePlan = (planId: string) => {
    if (isTrialMode) {
      // In trial mode, only allow single selection
      setSelectedPlans([planId]);
    } else {
      // In comparison mode, allow multiple selections
      setSelectedPlans(prev => 
        prev.includes(planId) 
          ? prev.filter(id => id !== planId)
          : [...prev, planId]
      );
    }
  };

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleFeatureExpand = (featureId: string) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [featureId]: !prev[featureId]
    }));
  };

  const handleStartFreeTrial = () => {
    setShowModal(true);
  };

  // Scroll navigation functions
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start',
      inline: 'nearest'
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50'
    }`}>
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? `${isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-md shadow-lg` 
            : `${isDarkMode ? 'bg-gray-900' : 'bg-transparent'}`
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                SaaSify
              </h1>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isDarkMode 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className={`pt-24 ${
        isMobile 
          ? showCtaBar 
            ? 'pb-48' 
            : 'pb-32'
          : 'pb-40'
      } px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Choose Your{' '}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Perfect Plan
              </span>
            </h1>
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto mb-4 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Compare features across our plans to find the perfect fit for your team.
              Start with a 14-day free trial, no credit card required.
            </p>
          </motion.div>

          {/* Mode Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className={`inline-flex rounded-xl p-1 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border border-gray-200'
            }`}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsTrialMode(false);
                  if (selectedPlans.length > 1) {
                    setSelectedPlans([selectedPlans[0]]); // Keep only first plan when switching to trial mode
                  }
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-all cursor-pointer ${
                  !isTrialMode
                    ? `${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} shadow-sm`
                    : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}`
                }`}
              >
                Compare Plans
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsTrialMode(true);
                  if (selectedPlans.length > 1) {
                    setSelectedPlans([selectedPlans[0]]); // Keep only first plan when switching to trial mode
                  }
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-all cursor-pointer ${
                  isTrialMode
                    ? `${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} shadow-sm`
                    : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}`
                }`}
              >
                Start Trial
              </motion.button>
            </div>
          </motion.div>

          {/* Plan Selection Cards */}
          <motion.div
            ref={plansRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-3 gap-6'} mb-12`}
          >
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: isMobile ? 0 : -5 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}
                
                <div
                  onClick={() => togglePlan(plan.id)}
                  className={`relative cursor-pointer ${isMobile ? 'p-4' : 'p-6'} rounded-2xl border-2 transition-all duration-300 ${
                    selectedPlans.includes(plan.id)
                      ? `${plan.id === 'basic' ? 'border-blue-500' : plan.id === 'pro' ? 'border-purple-500' : 'border-emerald-500'} ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`
                      : `${isDarkMode ? 'border-gray-700 bg-gray-800 hover:border-gray-600' : 'border-gray-200 bg-white hover:border-gray-300'} shadow-lg hover:shadow-xl`
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center`}>
                      <Sparkles className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPlans.includes(plan.id)
                        ? `${plan.id === 'basic' ? 'border-blue-500 bg-blue-500' : plan.id === 'pro' ? 'border-purple-500 bg-purple-500' : 'border-emerald-500 bg-emerald-500'}`
                        : `${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`
                    }`}>
                      {selectedPlans.includes(plan.id) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                  
                  <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                  
                  <div className="flex items-baseline">
                    <span className={`${isMobile ? 'text-3xl' : 'text-4xl'} font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${plan.price}
                    </span>
                    <span className={`text-lg ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      /month
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Feature Matrix */}
          <motion.div
            ref={featuresRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`rounded-2xl shadow-xl overflow-hidden ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
          >
            {/* Table Header */}
            <div className={`${
              isMobile 
                ? 'flex flex-col space-y-4 p-4' 
                : 'grid grid-cols-4 gap-4 p-6'
            } border-b ${
              isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className={`font-semibold ${isMobile ? 'text-center text-xl' : 'text-lg'} ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Features
              </div>
              {isMobile ? (
                <div className="flex justify-center space-x-4 overflow-x-auto pb-2">
                  {selectedPlans.map(planId => {
                    const plan = plans.find(p => p.id === planId);
                    return plan ? (
                      <div key={planId} className="text-center flex-shrink-0">
                        <div className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {plan.name}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          ${plan.price}/mo
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                selectedPlans.map(planId => {
                  const plan = plans.find(p => p.id === planId);
                  return plan ? (
                    <div key={planId} className="text-center">
                      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {plan.name}
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        ${plan.price}/mo
                      </div>
                    </div>
                  ) : null;
                })
              )}
            </div>

            {/* Feature Categories */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {featureCategories.map((category, categoryIndex) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 * categoryIndex }}
                >
                  {/* Category Header */}
                  <motion.div
                    whileHover={{ backgroundColor: isDarkMode ? '#374151' : '#f9fafb' }}
                    onClick={() => toggleCategory(category.id)}
                    className={`cursor-pointer ${isMobile ? 'p-4' : 'p-6'} flex items-center justify-between transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-lg flex items-center justify-center`} style={{ backgroundColor: `${category.color}20` }}>
                        <div style={{ color: category.color }}>
                          {category.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {category.name}
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {category.features.length} features
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: openCategories.includes(category.id) ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    </motion.div>
                  </motion.div>

                  {/* Category Features */}
                  <AnimatePresence>
                    {openCategories.includes(category.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        {category.features.map((feature, featureIndex) => (
                          <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * featureIndex }}
                            className={`border-t ${
                              isDarkMode ? 'border-gray-700' : 'border-gray-100'
                            }`}
                          >
                            {isMobile ? (
                              // Mobile Layout - Card Style
                              <div className="p-4">
                                <div className="flex items-start space-x-3 mb-3">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                    isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                                  }`}>
                                    {feature.icon}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <h4 className={`font-semibold text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {feature.name}
                                      </h4>
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => toggleFeatureExpand(feature.id)}
                                        className={`p-1 rounded cursor-pointer ${
                                          isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                      >
                                        <motion.div
                                          animate={{ rotate: expandedFeatures[feature.id] ? 180 : 0 }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          <ChevronDown className="w-4 h-4" />
                                        </motion.div>
                                      </motion.button>
                                    </div>
                                    
                                    <AnimatePresence>
                                      {expandedFeatures[feature.id] && (
                                        <Suspense fallback={
                                          <div className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Loading...
                                          </div>
                                        }>
                                          <FeatureDescription 
                                            description={feature.description} 
                                            isDarkMode={isDarkMode}
                                          />
                                        </Suspense>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>
                                
                                {/* Plan Availability - Mobile Grid */}
                                <div className={`grid grid-cols-3 gap-3 mt-4 p-3 rounded-lg ${
                                  isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'
                                }`}>
                                  {selectedPlans.map(planId => {
                                    const plan = plans.find(p => p.id === planId);
                                    const isAvailable = feature.plans.includes(planId);
                                    
                                    return plan ? (
                                      <div key={planId} className="flex flex-col items-center space-y-2">
                                        <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                          {plan.name}
                                        </div>
                                        <motion.div
                                          whileHover={{ scale: 1.1 }}
                                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            isAvailable
                                              ? `bg-gradient-to-r ${plan.gradient} shadow-lg`
                                              : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`
                                          }`}
                                        >
                                          {isAvailable ? (
                                            <Check className="w-4 h-4 text-white" />
                                          ) : (
                                            <X className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                          )}
                                        </motion.div>
                                      </div>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            ) : (
                              // Desktop Layout - Table Style
                              <div className="grid grid-cols-4 gap-4 p-6">
                                {/* Feature Name */}
                                <div className="flex items-center space-x-3">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                                  }`}>
                                    {feature.icon}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <span className={`font-medium text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {feature.name}
                                      </span>
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => toggleFeatureExpand(feature.id)}
                                        className={`p-1 rounded cursor-pointer ${
                                          isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                      >
                                        <motion.div
                                          animate={{ rotate: expandedFeatures[feature.id] ? 180 : 0 }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          <ChevronDown className="w-4 h-4" />
                                        </motion.div>
                                      </motion.button>
                                    </div>
                                    <AnimatePresence>
                                      {expandedFeatures[feature.id] && (
                                        <Suspense fallback={
                                          <div className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Loading...
                                          </div>
                                        }>
                                          <FeatureDescription 
                                            description={feature.description} 
                                            isDarkMode={isDarkMode}
                                          />
                                        </Suspense>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>

                                {/* Plan Availability */}
                                {selectedPlans.map(planId => {
                                  const plan = plans.find(p => p.id === planId);
                                  const isAvailable = feature.plans.includes(planId);
                                  
                                  return plan ? (
                                    <div key={planId} className="flex justify-center">
                                      <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                          isAvailable
                                            ? `bg-gradient-to-r ${plan.gradient} shadow-lg`
                                            : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`
                                        }`}
                                      >
                                        {isAvailable ? (
                                          <Check className="w-5 h-5 text-white" />
                                        ) : (
                                          <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                        )}
                                      </motion.div>
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Navigation Buttons */}
      <AnimatePresence>
        {showScrollButtons && (
          <>
            {/* Floating Button Overlay - Completely isolated from layout */}
            <div className={`fixed ${
              isMobile 
                ? showCtaBar 
                  ? 'bottom-40' 
                  : 'bottom-6'
                : showCtaBar ? 'bottom-25' : 'bottom-6'
            } right-4 z-40 pointer-events-none`}>
              
              {isMobile ? (
                // Mobile: Isolated floating system
                <div className="relative pointer-events-auto">
                  {/* Expanded Action Buttons - Fixed positions */}
                  {showMobileMenu && (
                    <div className="absolute bottom-20 right-0 flex flex-col items-center space-y-3">
                      {/* Scroll to Top */}
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: 0.1, type: "spring", damping: 20, stiffness: 300 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          scrollToTop();
                          setShowMobileMenu(false);
                        }}
                        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600' 
                            : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 border border-gray-200'
                        }`}
                        title="Scroll to top"
                      >
                        <ArrowUp className="w-5 h-5" />
                      </motion.button>

                      {/* Go to Plans */}
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: 0.2, type: "spring", damping: 20, stiffness: 300 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          scrollToSection(plansRef);
                          setShowMobileMenu(false);
                        }}
                        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600' 
                            : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 border border-gray-200'
                        }`}
                        title="Go to plans"
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.button>

                      {/* Go to Features */}
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: 0.3, type: "spring", damping: 20, stiffness: 300 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          scrollToSection(featuresRef);
                          setShowMobileMenu(false);
                        }}
                        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600' 
                            : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 border border-gray-200'
                        }`}
                        title="Go to features"
                      >
                        <Users className="w-5 h-5" />
                      </motion.button>

                      {/* Toggle Trial Section */}
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: 0.4, type: "spring", damping: 20, stiffness: 300 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setShowCtaBar(!showCtaBar);
                          setShowMobileMenu(false);
                        }}
                        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600' 
                            : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 border border-gray-200'
                        }`}
                        title={showCtaBar ? "Hide trial section" : "Show trial section"}
                      >
                        <motion.div
                          animate={{ rotate: showCtaBar ? 0 : 180 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowDown className="w-5 h-5" />
                        </motion.div>
                      </motion.button>
                    </div>
                  )}

                  {/* Main Floating Action Button */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className={`w-16 h-16 rounded-full shadow-xl flex items-center justify-center cursor-pointer transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700' 
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                    }`}
                    title={showMobileMenu ? "Close menu" : "Open menu"}
                  >
                    <motion.div
                      animate={{ rotate: showMobileMenu ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {showMobileMenu ? (
                        <X className="w-7 h-7 text-white" />
                      ) : (
                        <Plus className="w-7 h-7 text-white" />
                      )}
                    </motion.div>
                  </motion.button>
                </div>
              ) : (
                // Desktop: Clean vertical layout
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col space-y-3 pointer-events-auto"
                >
                  {/* Scroll to Top */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700' 
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                    }`}
                    title="Scroll to top"
                  >
                    <ArrowUp className="w-6 h-6 text-white" />
                  </motion.button>

                  {/* Quick Navigation Menu */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col space-y-2"
                  >
                    {/* Plans Section */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => scrollToSection(plansRef)}
                      className={`w-12 h-12 rounded-full shadow-md flex items-center justify-center cursor-pointer transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white' 
                          : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 border border-gray-200'
                      }`}
                      title="Go to plans"
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.button>

                    {/* Features Section */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => scrollToSection(featuresRef)}
                      className={`w-12 h-12 rounded-full shadow-md flex items-center justify-center cursor-pointer transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white' 
                          : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 border border-gray-200'
                      }`}
                      title="Go to features"
                    >
                      <Users className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Sticky CTA Bar */}
      <AnimatePresence>
        {(showCtaBar || !isMobile) && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed bottom-0 left-0 right-0 z-30 ${
              isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'
            } backdrop-blur-md border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              {isMobile ? (
                <div className="flex flex-col space-y-3 pb-2">
                  {selectedPlans.length > 0 ? (
                    <>
                      <div className="flex justify-center">
                        <div className="flex items-center space-x-2 flex-wrap justify-center">
                          {selectedPlans.map(planId => {
                            const plan = plans.find(p => p.id === planId);
                            return plan ? (
                              <motion.div
                                key={planId}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${plan.gradient}`}
                              >
                                {plan.name}
                              </motion.div>
                            ) : null;
                          })}
                        </div>
                      </div>
                      <div className={`text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <div className="text-sm">
                          {isTrialMode ? 'Free trial for 14 days, then' : 'Compare features across plans'}
                        </div>
                        {isTrialMode && (
                          <div className="text-xl font-bold">
                            ${highestPlan?.price || totalPrice}/mo
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Select a plan to get started
                    </div>
                  )}
                  
                  <div className="">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={selectedPlans.length === 0 || !isTrialMode}
                      onClick={handleStartFreeTrial}
                      className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
                        selectedPlans.length > 0 && isTrialMode
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg cursor-pointer'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isTrialMode ? 'Start Free Trial' : 'Switch to Trial Mode'}
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {selectedPlans.length > 0 ? (
                      <>
                        <div className="flex items-center space-x-2">
                          {selectedPlans.map(planId => {
                            const plan = plans.find(p => p.id === planId);
                            return plan ? (
                              <motion.div
                                key={planId}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${plan.gradient}`}
                              >
                                {plan.name}
                              </motion.div>
                            ) : null;
                          })}
                        </div>
                        <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {isTrialMode ? 'Free trial for 14 days, then' : 'Compare features across plans'}
                          {isTrialMode && (
                            <span className="text-2xl font-bold ml-2">
                              ${highestPlan?.price || totalPrice}/mo
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Select a plan to get started
                      </div>
                    )}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={selectedPlans.length === 0 || !isTrialMode}
                    onClick={handleStartFreeTrial}
                    className={`px-8 py-3 rounded-xl font-semibold text-white transition-all ${
                      selectedPlans.length > 0 && isTrialMode
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg cursor-pointer'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isTrialMode ? 'Start Free Trial' : 'Switch to Trial Mode'}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setShowModal(false)}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-md rounded-2xl shadow-2xl cursor-default ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowModal(false)}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors cursor-pointer ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Modal Body */}
              <div className="p-8">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", damping: 15 }}
                    >
                      <Check className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>
                </div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`text-2xl font-bold text-center mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Free Trial Started!
                </motion.h2>

                {/* Message */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`text-center mb-6 leading-relaxed ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Thank you for choosing SaaSify! An email with your trial details and setup instructions will be sent to you shortly.
                </motion.p>

                {/* Selected Plans */}
                {selectedPlans.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`p-4 rounded-lg mb-6 ${
                      isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                    }`}
                  >
                    <p className={`text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Selected Plan:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlans.map(planId => {
                        const plan = plans.find(p => p.id === planId);
                        return plan ? (
                          <div
                            key={planId}
                            className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${plan.gradient}`}
                          >
                            {plan.name} - ${plan.price}/mo
                          </div>
                        ) : null;
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Action Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowModal(false)}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg cursor-pointer"
                >
                  Got it!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SaaSFeatureMatrix;
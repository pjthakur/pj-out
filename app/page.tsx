"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  CloudIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  RocketLaunchIcon,
  StarIcon,
  BoltIcon,
  GlobeAltIcon,
  CogIcon,
  CalendarIcon,
  UserGroupIcon,
  TrophyIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

interface PricingTier {
  name: string;
  description: string;
  pricePerGB: number;
  minStorage: number;
  maxStorage: number;
  features: string[];
  caseStudy: {
    company: string;
    industry: string;
    savings: string;
    description: string;
    image: string;
    fullStory: {
      challenge: string;
      solution: string;
      results: string[];
      testimonial: {
        quote: string;
        author: string;
        title: string;
      };
      metrics: {
        label: string;
        value: string;
        description: string;
      }[];
    };
  };
}

interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
}

const CloudVault: React.FC = () => {
  // Independent state management to prevent re-renders
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("cloudvault-theme");
      if (savedTheme) {
        return savedTheme === "dark";
      }
      // Check system preference if no saved preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState(1000);
  const [billingModel, setBillingModel] = useState<"pay-as-go" | "prepay">(
    "pay-as-go"
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [showCaseStudyModal, setShowCaseStudyModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setisClient] = useState(false);
  // Pricing tiers data
  const pricingTiers: PricingTier[] = useMemo(
    () => [
      {
        name: "Starter",
        description: "Perfect for small teams and startups",
        pricePerGB: 0.025,
        minStorage: 1,
        maxStorage: 1000,
        features: [
          "99.9% Uptime SLA",
          "Basic Support",
          "Standard Encryption",
          "API Access",
          "Dashboard Analytics",
        ],
        caseStudy: {
          company: "TechStart Inc.",
          industry: "Software Development",
          savings: "40%",
          description:
            "Reduced infrastructure costs while scaling from 10 to 100 employees with seamless data management",
          image:
            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&auto=format",
          fullStory: {
            challenge:
              "TechStart Inc. was struggling with exponentially growing storage costs as their development team expanded. Their previous solution charged premium rates for peak usage, making budgeting unpredictable.",
            solution:
              "By implementing CloudVault Pro's Starter tier with usage-based pricing, TechStart gained predictable costs and automatic scaling. The pay-as-you-go model eliminated overpayment during low-usage periods.",
            results: [
              "Reduced monthly storage costs by 40%",
              "Eliminated surprise bills during traffic spikes",
              "Improved deployment speed by 60%",
              "Zero downtime during scaling events",
            ],
            testimonial: {
              quote:
                "CloudVault Pro transformed our cost structure. We went from unpredictable bills to clear, usage-based pricing that scales with our growth.",
              author: "Sarah Chen",
              title: "CTO, TechStart Inc.",
            },
            metrics: [
              {
                label: "Cost Reduction",
                value: "40%",
                description: "Monthly savings compared to previous solution",
              },
              {
                label: "Team Growth",
                value: "900%",
                description: "Scaled from 10 to 100 employees seamlessly",
              },
              {
                label: "Deployment Speed",
                value: "60%",
                description: "Faster deployment and development cycles",
              },
            ],
          },
        },
      },
      {
        name: "Professional",
        description: "Ideal for growing businesses",
        pricePerGB: 0.02,
        minStorage: 1000,
        maxStorage: 10000,
        features: [
          "99.95% Uptime SLA",
          "Priority Support",
          "Advanced Encryption",
          "Full API Access",
          "Advanced Analytics",
          "Team Collaboration",
        ],
        caseStudy: {
          company: "GrowthCorp Ltd.",
          industry: "E-commerce",
          savings: "55%",
          description:
            "Optimized storage costs during peak shopping seasons with intelligent auto-scaling and predictive analytics",
          image:
            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&auto=format",
          fullStory: {
            challenge:
              "GrowthCorp faced massive storage spikes during holiday seasons, leading to performance issues and costly over-provisioning. Manual scaling was slow and error-prone.",
            solution:
              "CloudVault Pro's Professional tier provided intelligent auto-scaling and predictive analytics. The system automatically adjusted capacity based on traffic patterns and seasonal trends.",
            results: [
              "Achieved 55% cost reduction during peak seasons",
              "Eliminated manual scaling interventions",
              "Improved site performance during Black Friday",
              "Gained real-time insights into usage patterns",
            ],
            testimonial: {
              quote:
                "The auto-scaling feature saved us during our biggest Black Friday ever. What used to be a nightmare is now completely automated.",
              author: "Michael Rodriguez",
              title: "Head of Infrastructure, GrowthCorp Ltd.",
            },
            metrics: [
              {
                label: "Peak Season Savings",
                value: "55%",
                description: "Cost reduction during high-traffic periods",
              },
              {
                label: "Auto-scaling Events",
                value: "2,500+",
                description: "Automatic capacity adjustments in Q4",
              },
              {
                label: "Performance Improvement",
                value: "45%",
                description: "Faster page load times during peaks",
              },
            ],
          },
        },
      },
      {
        name: "Enterprise",
        description: "Built for large-scale operations",
        pricePerGB: 0.015,
        minStorage: 10000,
        maxStorage: 100000,
        features: [
          "99.99% Uptime SLA",
          "24/7 Dedicated Support",
          "Military-Grade Encryption",
          "Complete API Suite",
          "AI-Powered Analytics",
          "Custom Integrations",
          "White-label Options",
        ],
        caseStudy: {
          company: "MegaCorp Industries",
          industry: "Manufacturing",
          savings: "65%",
          description:
            "Achieved global data synchronization with 99.99% reliability across 50+ locations while maintaining compliance",
          image:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop&auto=format",
          fullStory: {
            challenge:
              "MegaCorp needed to synchronize critical manufacturing data across 50+ global facilities while maintaining strict compliance requirements. Their legacy system was expensive and unreliable.",
            solution:
              "CloudVault Pro's Enterprise tier delivered military-grade security, global CDN, and real-time synchronization. Custom integrations ensured seamless connectivity with existing manufacturing systems.",
            results: [
              "Reduced global infrastructure costs by 65%",
              "Achieved 99.99% uptime across all facilities",
              "Accelerated data sync from hours to seconds",
              "Maintained 100% compliance across all regions",
            ],
            testimonial: {
              quote:
                "CloudVault Pro enabled our global digital transformation. We now have real-time visibility across all our manufacturing operations worldwide.",
              author: "Dr. Emma Thompson",
              title: "Chief Digital Officer, MegaCorp Industries",
            },
            metrics: [
              {
                label: "Global Cost Savings",
                value: "65%",
                description: "Infrastructure cost reduction worldwide",
              },
              {
                label: "Facility Coverage",
                value: "50+",
                description: "Manufacturing locations synchronized",
              },
              {
                label: "Sync Speed",
                value: "99.9%",
                description: "Faster than previous solution",
              },
            ],
          },
        },
      },
    ],
    []
  );

  // Calculate current tier based on selected storage
  const currentTier = useMemo(() => {
    return (
      pricingTiers.find(
        (tier) =>
          selectedStorage >= tier.minStorage &&
          selectedStorage <= tier.maxStorage
      ) || pricingTiers[0]
    );
  }, [selectedStorage, pricingTiers]);

  // Calculate pricing
  const pricing = useMemo(() => {
    const basePrice = selectedStorage * currentTier.pricePerGB;
    const discount = billingModel === "prepay" ? 0.15 : 0;
    const discountedPrice = basePrice * (1 - discount);

    return {
      basePrice,
      discount,
      discountedPrice,
      annualPrice: discountedPrice * 12,
      savings: basePrice - discountedPrice,
    };
  }, [selectedStorage, currentTier, billingModel]);

  useEffect(() => {
    if (!isClient) {
      setisClient(true);
    }
  }, []);

  // Scroll handler for floating panel
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cloudvault-theme", isDark ? "dark" : "light");

      // Optional: Also set data attribute on html element for other styling needs
      document.documentElement.setAttribute(
        "data-theme",
        isDark ? "dark" : "light"
      );
    }
  }, [isDark]);
  // Prevent body scroll when mobile menu or modal is open
  useEffect(() => {
    if (isMobileMenuOpen || showCaseStudyModal || showEmailModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen, showCaseStudyModal, showEmailModal]);

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setIsMobileMenuOpen(false);
  }, []);

  // Toast management
  const addToast = useCallback(
    (type: ToastMessage["type"], message: string) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Handle storage slider change with calculation simulation
  const handleStorageChange = useCallback((value: number) => {
    setIsCalculating(true);
    setSelectedStorage(value);
    setTimeout(() => setIsCalculating(false), 300);
  }, []);

  // Handle billing model change
  const handleBillingModelChange = useCallback(
    (model: "pay-as-go" | "prepay") => {
      setBillingModel(model);
      addToast(
        "info",
        `Switched to ${model === "prepay" ? "Prepay" : "Pay-as-you-go"} model`
      );
    },
    [addToast]
  );

  // Handle theme toggle
  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const newTheme = !prev;
      //   addToast("success", `Switched to ${newTheme ? "dark" : "light"} theme`);
      return newTheme;
    });
  }, [addToast]);

  const resetToSystemTheme = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cloudvault-theme");
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDark(systemPrefersDark);
      addToast("info", "Theme reset to system preference");
    }
  }, [addToast]);
  // Close mobile menu when clicking outside
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Email validation
  const validateEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  }, []);

  // Handle email modal
  const openEmailModal = useCallback(() => {
    setShowEmailModal(true);
    setEmail("");
    setEmailError("");
  }, []);

  const closeEmailModal = useCallback(() => {
    setShowEmailModal(false);
    setEmail("");
    setEmailError("");
    setIsSubmitting(false);
  }, []);

  // Handle email submission
  const handleEmailSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const error = validateEmail(email);
      if (error) {
        setEmailError(error);
        return;
      }

      setIsSubmitting(true);
      setEmailError("");

      // Simulate API call
      setTimeout(() => {
        closeEmailModal();
        addToast(
          "success",
          `Welcome aboard! We've sent setup instructions to ${email}`
        );

        setTimeout(() => {
          addToast(
            "info",
            "Check your email for your free trial activation link"
          );
        }, 2000);

        setTimeout(() => {
          addToast(
            "info",
            `Your ${currentTier.name} plan is being prepared...`
          );
        }, 4000);

        setIsSubmitting(false);
      }, 1500);
    },
    [email, validateEmail, closeEmailModal, addToast, currentTier.name]
  );

  // Handle start plan action
  const handleStartPlan = useCallback(() => {
    openEmailModal();
  }, [openEmailModal]);

  // Handle case study modal
  const openCaseStudyModal = useCallback(() => {
    setShowCaseStudyModal(true);
  }, []);

  const closeCaseStudyModal = useCallback(() => {
    setShowCaseStudyModal(false);
  }, []);

  // Get capacity percentage for animation
  const capacityPercentage = useMemo(() => {
    const maxCapacity = currentTier.maxStorage;
    return Math.min((selectedStorage / maxCapacity) * 100, 100);
  }, [selectedStorage, currentTier.maxStorage]);

  if (!isClient) {
    return "";
  }

  return (
    <div
      className={`min-h-screen font-sans transition-all duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]"
              : "bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.05),transparent_50%)]"
          }`}
        />
      </div>

      {/* Email Signup Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeEmailModal}
          />
          <div
            className={`relative w-full max-w-md rounded-2xl ${
              isDark
                ? "bg-gray-900 border border-gray-700"
                : "bg-white border border-gray-200"
            } shadow-2xl p-2 sm:p-8 mx-4`}
          >
            {/* Modal Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <RocketLaunchIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                Start Your Free Trial
              </h2>
              <p
                className={`text-sm sm:text-base ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Get started with {currentTier.name} plan today
              </p>
            </div>

            {/* Email Form */}
            <form
              onSubmit={handleEmailSubmit}
              className="space-y-4 sm:space-y-6"
            >
              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Work Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  placeholder="you@company.com"
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 text-base ${
                    emailError
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : isDark
                      ? "border-gray-600 bg-gray-800 text-gray-100 focus:border-blue-500 focus:ring-blue-500/20"
                      : "border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500/20"
                  } focus:outline-none focus:ring-4`}
                  disabled={isSubmitting}
                />
                {emailError && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                    {emailError}
                  </p>
                )}
              </div>

              {/* Benefits */}
              <div
                className={`p-4 rounded-xl ${
                  isDark
                    ? "bg-gray-800/50 border border-gray-700"
                    : "bg-blue-50 border border-blue-200"
                }`}
              >
                <h4 className="font-semibold mb-3 flex items-center text-sm sm:text-base">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  What you'll get:
                </h4>
                <ul
                  className={`space-y-2 text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 flex-shrink-0" />
                    14-day free trial with full access
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 flex-shrink-0" />
                    {selectedStorage.toLocaleString()} GB storage included
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 shadow-lg"
                } text-white cursor-pointer`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Creating your account...
                  </div>
                ) : (
                  `Start ${currentTier.name} Free Trial`
                )}
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={closeEmailModal}
                disabled={isSubmitting}
                className={`w-full py-3 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
                  isDark
                    ? "text-gray-300 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Case Study Modal */}
      {showCaseStudyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 lg:p-6">
          {/* Enhanced Backdrop */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md"
            onClick={closeCaseStudyModal}
          />
          
          {/* Modal Container with improved animations */}
          <div
            className={`relative w-full max-w-6xl max-h-[95vh] rounded-2xl sm:rounded-3xl overflow-hidden ${
              isDark
                ? "bg-gray-900/95 border border-gray-700/50 shadow-2xl shadow-black/40"
                : "bg-white/95 border border-gray-200/50 shadow-2xl shadow-black/20"
            } backdrop-blur-xl transform transition-all duration-300 animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-8`}
          >
            {/* Enhanced Modal Header with better gradient */}
            <div className="sticky top-0 z-10 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <TrophyIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold truncate">
                      {currentTier.caseStudy.company}
                    </h2>
                  </div>
                  <p className="text-sm sm:text-lg lg:text-xl opacity-90 font-medium">
                    {currentTier.caseStudy.industry}
                  </p>
                </div>
                <button
                  onClick={closeCaseStudyModal}
                  className="flex-shrink-0 p-2 sm:p-3 rounded-xl hover:bg-white/20 transition-all duration-200 cursor-pointer group"
                >
                  <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-200" />
                </button>
              </div>
            </div>

            {/* Enhanced Modal Content with better scroll */}
            <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent max-h-[calc(95vh-120px)]">
              <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 lg:space-y-10">
                {/* Hero Image and Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
                  {/* Enhanced Hero Image */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                    <img
                      src={currentTier.caseStudy.image}
                      alt={currentTier.caseStudy.company}
                      className="relative w-full h-56 sm:h-72 lg:h-80 object-cover rounded-2xl shadow-2xl group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                          />
                        ))}
                        <span className="ml-2 font-medium text-sm">5.0 rating</span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Company Info */}
                  <div className="space-y-6">
                    {/* Tier Badge */}
                    <div>
                      <span
                        className={`inline-flex items-center px-4 py-3 rounded-2xl text-sm sm:text-base font-bold shadow-xl ${
                          currentTier.name === "Starter"
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                            : currentTier.name === "Professional"
                            ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                            : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        } hover:scale-105 transition-transform duration-200`}
                      >
                        <TrophyIcon className="w-5 h-5 mr-2" />
                        {currentTier.name} Success Story
                      </span>
                    </div>

                    {/* Company Details */}
                    <div className="space-y-4">
                      <div className={`flex items-center p-4 rounded-xl ${
                        isDark ? "bg-gray-800/50 border border-gray-700/50" : "bg-gray-50/80 border border-gray-200/50"
                      } backdrop-blur-sm`}>
                        <div className="p-2 bg-blue-500/20 rounded-lg mr-4">
                          <CalendarIcon className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Implementation Time</div>
                          <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                            6 months
                          </div>
                        </div>
                      </div>

                      <div className={`flex items-center p-4 rounded-xl ${
                        isDark ? "bg-gray-800/50 border border-gray-700/50" : "bg-gray-50/80 border border-gray-200/50"
                      } backdrop-blur-sm`}>
                        <div className="p-2 bg-green-500/20 rounded-lg mr-4">
                          <UserGroupIcon className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Team Size</div>
                          <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                            50-500 employees
                          </div>
                        </div>
                      </div>

                      <div className={`flex items-center p-4 rounded-xl ${
                        isDark ? "bg-gray-800/50 border border-gray-700/50" : "bg-gray-50/80 border border-gray-200/50"
                      } backdrop-blur-sm`}>
                        <div className="p-2 bg-purple-500/20 rounded-lg mr-4">
                          <ShieldCheckIcon className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">Industry</div>
                          <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                            {currentTier.caseStudy.industry}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Key Metrics */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                      <ChartBarIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Key Results
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {currentTier.caseStudy.fullStory.metrics.map(
                      (metric, index) => (
                        <div
                          key={index}
                          className={`group relative p-6 sm:p-8 rounded-2xl text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                            isDark
                              ? "bg-gray-800/70 border border-gray-700/50 hover:border-blue-500/50 backdrop-blur-sm"
                              : "bg-white/80 border border-gray-200/50 hover:border-blue-500/50 backdrop-blur-sm shadow-lg"
                          }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative">
                            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                              {metric.value}
                            </div>
                            <div className="font-bold text-lg mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                              {metric.label}
                            </div>
                            <div
                              className={`text-sm leading-relaxed ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {metric.description}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Enhanced Challenge Section */}
                <div className={`p-6 sm:p-8 rounded-2xl border-l-4 border-l-red-500 ${
                  isDark ? "bg-red-900/20 border border-red-800/30" : "bg-red-50/80 border border-red-200/50"
                } backdrop-blur-sm`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-red-500/20 rounded-xl">
                      <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
                      The Challenge
                    </h3>
                  </div>
                  <p
                    className={`text-base sm:text-lg leading-relaxed ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {currentTier.caseStudy.fullStory.challenge}
                  </p>
                </div>

                {/* Enhanced Solution Section */}
                <div className={`p-6 sm:p-8 rounded-2xl border-l-4 border-l-blue-500 ${
                  isDark ? "bg-blue-900/20 border border-blue-800/30" : "bg-blue-50/80 border border-blue-200/50"
                } backdrop-blur-sm`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                      <CogIcon className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      The Solution
                    </h3>
                  </div>
                  <p
                    className={`text-base sm:text-lg leading-relaxed ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {currentTier.caseStudy.fullStory.solution}
                  </p>
                </div>

                {/* Enhanced Results Section */}
                <div className={`p-6 sm:p-8 rounded-2xl border-l-4 border-l-green-500 ${
                  isDark ? "bg-green-900/20 border border-green-800/30" : "bg-green-50/80 border border-green-200/50"
                } backdrop-blur-sm`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-green-500/20 rounded-xl">
                      <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                      The Results
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentTier.caseStudy.fullStory.results.map(
                      (result, index) => (
                        <div key={index} className="flex items-start group">
                          <div className="flex-shrink-0 w-6 h-6 mt-0.5 mr-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                            <CheckCircleIcon className="w-4 h-4 text-white" />
                          </div>
                          <span
                            className={`text-base leading-relaxed group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200 ${
                              isDark ? "text-gray-200" : "text-gray-700"
                            }`}
                          >
                            {result}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                              {/* Enhanced Testimonial */}
                <div
                  className={`relative p-8 sm:p-10 rounded-2xl overflow-hidden ${
                    isDark
                      ? "bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50"
                      : "bg-gradient-to-br from-blue-50/80 to-purple-50/80 border border-blue-200/50"
                  } backdrop-blur-sm shadow-2xl`}
                >
                  {/* Decorative background elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-500/10 to-orange-500/10 rounded-full blur-xl" />
                  
                  <div className="relative">
                    {/* Rating Stars */}
                    <div className="flex items-center justify-center mb-6">
                      <div className="flex items-center gap-1 p-3 bg-yellow-500/20 rounded-2xl backdrop-blur-sm">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className="w-5 h-5 text-yellow-500 fill-current hover:scale-110 transition-transform duration-200"
                          />
                        ))}
                        <span className="ml-2 font-bold text-yellow-600 dark:text-yellow-400">5.0</span>
                      </div>
                    </div>

                    {/* Quote */}
                    <div className="text-center mb-8">
                      <div className="text-4xl sm:text-5xl text-blue-500/30 mb-4">"</div>
                      <blockquote className="text-lg sm:text-xl lg:text-2xl font-medium italic leading-relaxed mb-4">
                        {currentTier.caseStudy.fullStory.testimonial.quote}
                      </blockquote>
                      <div className="text-4xl sm:text-5xl text-blue-500/30 rotate-180">"</div>
                    </div>

                    {/* Author */}
                    <div className="flex items-center justify-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl">
                          {currentTier.caseStudy.fullStory.testimonial.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
                          <CheckCircleIcon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg">
                          {currentTier.caseStudy.fullStory.testimonial.author}
                        </div>
                        <div
                          className={`text-sm font-medium ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {currentTier.caseStudy.fullStory.testimonial.title}
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
                          Verified Customer
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <div className="fixed top-20 right-4 z-200 space-y-2 max-w-[270px]  sm:max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start p-3 sm:p-4 rounded-xl shadow-2xl backdrop-blur-md transform transition-all duration-300 ${
              isDark
                ? "bg-gray-800/90 border border-gray-700 text-gray-100"
                : "bg-white/90 border border-gray-200 text-gray-900"
            } ${
              toast.type === "success"
                ? "border-l-4 border-l-green-500"
                : toast.type === "error"
                ? "border-l-4 border-l-red-500"
                : toast.type === "warning"
                ? "border-l-4 border-l-yellow-500"
                : "border-l-4 border-l-blue-500"
            }`}
          >
            <div className="flex items-start flex-1">
              <div className="flex-shrink-0 mr-2">
                {toast.type === "success" && (
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                )}
                {toast.type === "error" && (
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                )}
                {toast.type === "warning" && (
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
                )}
                {toast.type === "info" && (
                  <InformationCircleIcon className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <span className="text-sm font-medium leading-relaxed">
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className={`ml-2 transition-colors cursor-pointer flex-shrink-0 ${
                isDark
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrollY > 50
            ? isDark
              ? "bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-gray-800"
              : "bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-200"
            : isDark
            ? "bg-gray-900/80 backdrop-blur-sm"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <div
              className="flex items-center group cursor-pointer"
              onClick={() => scrollToSection("hero")}
            >
              <div className="relative">
                <CloudIcon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse" />
              </div>
              <span className="ml-2 sm:ml-3 text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                <span className="hidden sm:inline">CloudVault Pro</span>
                <span className="sm:hidden">CloudVault</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("pricing")}
                className={`hover:text-blue-500 transition-all duration-300 font-medium cursor-pointer relative group ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
              </button>
              <button
                onClick={() => scrollToSection("case-studies")}
                className={`hover:text-blue-500 transition-all duration-300 font-medium cursor-pointer relative group ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Success Stories
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className={`hover:text-blue-500 transition-all duration-300 font-medium cursor-pointer relative group ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className={`hover:text-blue-500 transition-all duration-300 font-medium cursor-pointer relative group ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
              </button>
              <button
                onClick={toggleTheme}
                className={`p-2 sm:p-3 rounded-xl transition-all duration-300 cursor-pointer ${
                  isDark
                    ? "hover:bg-gray-800 text-gray-200 hover:text-white"
                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                }`}
              >
                {isDark ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={handleStartPlan}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer font-medium text-sm sm:text-base"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className={`p-2 sm:p-3 rounded-xl transition-all duration-300 cursor-pointer ${
                  isDark
                    ? "hover:bg-gray-800 text-gray-200"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                {isDark ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`p-2 sm:p-3 rounded-xl transition-all duration-300 cursor-pointer ${
                  isDark
                    ? "hover:bg-gray-800 text-gray-200"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Modern Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeMobileMenu}
            />
            <div
              className={`absolute inset-x-0 top-0 ${
                isDark ? "bg-gray-900/95" : "bg-white/95"
              } backdrop-blur-xl shadow-2xl`}
            >
              {/* Mobile Header */}
              <div
                className={`flex justify-between items-center p-4 sm:p-6 border-b ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-center">
                  <CloudIcon className="w-8 h-8 text-blue-500 mr-3" />
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    CloudVault Pro
                  </span>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    isDark
                      ? "hover:bg-gray-800 text-gray-200"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Navigation Items */}
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => scrollToSection("pricing")}
                    className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                      isDark
                        ? "hover:bg-gray-800 text-gray-200"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <CurrencyDollarIcon className="w-8 h-8 text-blue-500 mb-2" />
                    <span className="font-medium text-sm">Pricing</span>
                  </button>

                  <button
                    onClick={() => scrollToSection("features")}
                    className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                      isDark
                        ? "hover:bg-gray-800 text-gray-200"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <BoltIcon className="w-8 h-8 text-purple-500 mb-2" />
                    <span className="font-medium text-sm">Features</span>
                  </button>

                  <button
                    onClick={() => scrollToSection("case-studies")}
                    className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                      isDark
                        ? "hover:bg-gray-800 text-gray-200"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <TrophyIcon className="w-8 h-8 text-green-500 mb-2" />
                    <span className="font-medium text-sm">Case Studies</span>
                  </button>

                  <button
                    onClick={() => scrollToSection("contact")}
                    className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                      isDark
                        ? "hover:bg-gray-800 text-gray-200"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <PhoneIcon className="w-8 h-8 text-cyan-500 mb-2" />
                    <span className="font-medium text-sm">Contact</span>
                  </button>
                </div>

                {/* Call to Action */}
                <button
                  onClick={handleStartPlan}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 cursor-pointer font-semibold text-lg shadow-lg"
                >
                  Start Free Trial
                </button>

                {/* Quick Stats */}
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div
                    className={`p-3 rounded-xl ${
                      isDark ? "bg-gray-800/50" : "bg-gray-50"
                    }`}
                  >
                    <div className="text-lg font-bold text-blue-500">10K+</div>
                    <div
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Companies
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-xl ${
                      isDark ? "bg-gray-800/50" : "bg-gray-50"
                    }`}
                  >
                    <div className="text-lg font-bold text-green-500">
                      99.99%
                    </div>
                    <div
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Uptime
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-xl ${
                      isDark ? "bg-gray-800/50" : "bg-gray-50"
                    }`}
                  >
                    <div className="text-lg font-bold text-purple-500">
                      24/7
                    </div>
                    <div
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Support
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="pt-24 sm:pt-32 lg:pt-40 pb-16 sm:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative"
      >
        <div className="text-center">
          <div className="flex justify-center mb-6 sm:mb-8">
            <div
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full ${
                isDark
                  ? "bg-gray-800/50 border border-gray-700"
                  : "bg-white/50 border border-gray-200"
              } backdrop-blur-sm`}
            >
              <RocketLaunchIcon className="w-4 h-4 text-blue-500" />
              <span
                className={`text-xs sm:text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Trusted by 10,000+ companies worldwide
              </span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Enterprise Cloud
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              Storage Reimagined
            </span>
          </h1>

          <p
            className={`text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Revolutionary usage-based pricing with enterprise-grade security,
            <br className="hidden sm:block" />
            transparent costs, and infinite scalability for modern businesses
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
            <button
              onClick={handleStartPlan}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 cursor-pointer text-base sm:text-lg font-medium flex items-center w-full sm:w-auto justify-center"
            >
              <RocketLaunchIcon className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Start Free Trial
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 sm:mt-16 flex flex-wrap justify-center items-center gap-6 sm:gap-8   px-4">
            <div className="flex items-center">
              <StarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mr-1" />
              <span
                className={`text-xs sm:text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                4.9/5 Rating
              </span>
            </div>
            <div className="flex items-center">
              <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-1" />
              <span
                className={`text-xs sm:text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                SOC 2 Certified
              </span>
            </div>
            <div className="flex items-center">
              <GlobeAltIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-1" />
              <span
                className={`text-xs sm:text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Global CDN
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Calculator Section */}
      <section
        id="pricing"
        className="py-16 sm:py-16 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative"
      >
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Calculate Your Perfect Plan
            </span>
          </h2>
          <p
            className={`text-lg sm:text-xl ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Transparent pricing that scales with your growth
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Storage Slider */}
          <div
            className={`p-6 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl backdrop-blur-sm ${
              isDark
                ? "bg-gray-800/50 border border-gray-700/50 shadow-2xl"
                : "bg-white/70 border border-gray-200/50 shadow-2xl"
            }`}
          >
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center">
              <CogIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mr-3" />
              Storage Configuration
            </h3>

            {/* Current Tier Badge */}
            <div className="mb-6 sm:mb-8">
              <span
                className={`inline-flex items-center px-3 sm:px-4 py-2 rounded-xl sm:rounded-xl text-base sm:text-lg font-bold ${
                  currentTier.name === "Starter"
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    : currentTier.name === "Professional"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                } shadow-lg`}
              >
                {currentTier.name} Tier
              </span>
            </div>

            {/* Storage Amount Display */}
            <div className="mb-8 sm:mb-10">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-4 space-y-2 sm:space-y-0">
                <span
                  className={`text-base sm:text-lg font-medium ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Storage Amount
                </span>
                <div className="text-left sm:text-right">
                  <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {selectedStorage.toLocaleString()}
                  </span>
                  <span
                    className={`text-lg sm:text-xl ml-2 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    GB
                  </span>
                </div>
              </div>

              {/* Capacity Meter */}
              <div
                className={`w-full h-3 sm:h-4 rounded-full overflow-hidden ${
                  isDark ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-700 ease-out relative"
                  style={{ width: `${capacityPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
              <div
                className={`flex justify-between text-xs sm:text-sm mt-2 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <span>{currentTier.minStorage} GB</span>
                <span>{currentTier.maxStorage.toLocaleString()} GB</span>
              </div>
            </div>

            {/* Storage Slider */}
            <div className="mb-8 sm:mb-10">
              <input
                type="range"
                min={1}
                max={100000}
                value={selectedStorage}
                onChange={(e) => handleStorageChange(Number(e.target.value))}
                className="w-full h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #8b5cf6 ${
                    (selectedStorage / 100000) * 100
                  }%, ${isDark ? "#374151" : "#e5e7eb"} ${
                    (selectedStorage / 100000) * 100
                  }%, ${isDark ? "#374151" : "#e5e7eb"} 100%)`,
                }}
              />
            </div>

            {/* Billing Model Toggle */}
            <div className="mb-8 sm:mb-10">
              <h4 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center">
                <BoltIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mr-2" />
                Billing Model
              </h4>
              <div
                className={`flex rounded-xl sm:rounded-xl p-1 sm:p-2 ${
                  isDark ? "bg-gray-700/50" : "bg-gray-100"
                }`}
              >
                <button
                  onClick={() => handleBillingModelChange("pay-as-go")}
                  className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 cursor-pointer font-medium text-sm sm:text-base ${
                    billingModel === "pay-as-go"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                      : isDark
                      ? "text-gray-300 hover:text-white hover:bg-gray-600/50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Pay-as-you-go
                </button>
                <button
                  onClick={() => handleBillingModelChange("prepay")}
                  className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 cursor-pointer font-medium relative text-sm sm:text-base ${
                    billingModel === "prepay"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                      : isDark
                      ? "text-gray-300 hover:text-white hover:bg-gray-600/50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Prepay
                  <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    15% OFF
                  </span>
                </button>
              </div>
            </div>

            {/* Tier Features */}
            <div>
              <h4 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center">
                <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mr-2" />
                Included Features
              </h4>
              <div className="space-y-3 sm:space-y-4">
                {currentTier.features.map((feature, index) => (
                  <div key={index} className="flex items-center group">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 sm:mr-4 group-hover:scale-150 transition-transform duration-300 flex-shrink-0" />
                    <span
                      className={`font-medium text-sm sm:text-base ${
                        isDark ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div
            className={`p-6 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl backdrop-blur-sm h-fit lg:sticky lg:top-28 ${
              isDark
                ? "bg-gray-800/50 border border-gray-700/50 shadow-2xl"
                : "bg-white/70 border border-gray-200/50 shadow-2xl"
            }`}
          >
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center">
              <ChartBarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mr-3" />
              Price Breakdown
            </h3>

            {isCalculating ? (
              <div className="space-y-6 sm:space-y-8">
                {/* Base Price Skeleton */}
                <div
                  className={`flex justify-between items-center pb-4 sm:pb-6 border-b ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div
                    className={`h-4 sm:h-5 w-48 rounded-lg animate-pulse ${
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  />
                  <div
                    className={`h-5 sm:h-6 w-20 rounded-lg animate-pulse ${
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  />
                </div>

                {/* Prepay Discount Skeleton (always show for consistent height) */}
                <div
                  className={`flex justify-between items-center pb-4 sm:pb-6 border-b ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div
                    className={`h-4 sm:h-5 w-44 rounded-lg animate-pulse ${
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  />
                  <div
                    className={`h-5 sm:h-6 w-24 rounded-lg animate-pulse ${
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  />
                </div>

                {/* Monthly Total Skeleton */}
                <div
                  className={`p-4 sm:p-6 rounded-xl ${
                    isDark
                      ? "bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/30"
                      : "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div
                      className={`h-6 sm:h-7 w-32 rounded-lg animate-pulse ${
                        isDark ? "bg-gray-700" : "bg-gray-300"
                      }`}
                    />
                    <div
                      className={`h-6 sm:h-7 w-28 rounded-lg animate-pulse ${
                        isDark ? "bg-gray-700" : "bg-gray-300"
                      }`}
                    />
                  </div>
                </div>

                {/* Annual Total Skeleton */}
                <div className="flex justify-between items-center">
                  <div
                    className={`h-5 sm:h-6 w-28 rounded-lg animate-pulse ${
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  />
                  <div
                    className={`h-5 sm:h-6 w-24 rounded-lg animate-pulse ${
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  />
                </div>

                {/* Pricing Details Skeleton */}
                <div
                  className={`p-4 sm:p-6 rounded-xl ${
                    isDark
                      ? "bg-blue-900/20 border border-blue-700/30"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <div className="flex items-center mb-2 sm:mb-3">
                    <div
                      className={`h-5 sm:h-6 w-5 sm:w-6 mr-2 rounded animate-pulse ${
                        isDark ? "bg-gray-700" : "bg-gray-300"
                      }`}
                    />
                    <div
                      className={`h-4 sm:h-5 w-32 rounded-lg animate-pulse ${
                        isDark ? "bg-gray-700" : "bg-gray-300"
                      }`}
                    />
                  </div>
                  <div className="space-y-2">
                    <div
                      className={`h-4 w-full rounded-lg animate-pulse ${
                        isDark ? "bg-gray-700" : "bg-gray-300"
                      }`}
                    />
                    <div
                      className={`h-4 w-3/4 rounded-lg animate-pulse ${
                        isDark ? "bg-gray-700" : "bg-gray-300"
                      }`}
                    />
                  </div>
                </div>

                {/* Button Skeleton */}
                <div
                  className={`w-full h-12 sm:h-14 rounded-xl animate-pulse ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  }`}
                />
              </div>
            ) : (
              <div className="space-y-6 sm:space-y-8">
                {/* Monthly Cost */}
                <div
                  className={`flex justify-between items-center pb-4 sm:pb-6 border-b ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <span
                    className={`text-base sm:text-lg ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Base Price ({selectedStorage.toLocaleString()} GB)
                  </span>
                  <span className="text-lg sm:text-xl font-bold">
                    ${pricing.basePrice.toFixed(2)}
                  </span>
                </div>

                {billingModel === "prepay" && (
                  <div
                    className={`flex justify-between items-center pb-4 sm:pb-6 border-b ${
                      isDark ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <span className="text-base sm:text-lg text-green-500 font-medium">
                      Prepay Discount (15%)
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-green-500">
                      -${pricing.savings.toFixed(2)}
                    </span>
                  </div>
                )}

                <div
                  className={`p-4 sm:p-6 rounded-xl sm:rounded-xl ${
                    isDark
                      ? "bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/30"
                      : "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200"
                  }`}
                >
                  <div className="flex justify-between items-center text-xl sm:text-2xl font-bold">
                    <span>Monthly Total</span>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ${pricing.discountedPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-lg sm:text-xl">
                  <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                    Annual Total
                  </span>
                  <span className="font-bold">
                    ${pricing.annualPrice.toFixed(2)}
                  </span>
                </div>

                <div
                  className={`p-4 sm:p-6 rounded-xl sm:rounded-xl ${
                    isDark
                      ? "bg-blue-900/20 border border-blue-700/30"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <div className="flex items-center mb-2 sm:mb-3">
                    <InformationCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mr-2" />
                    <span className="font-bold text-blue-600 dark:text-blue-400 text-sm sm:text-base">
                      Pricing Details
                    </span>
                  </div>
                  <p
                    className={`text-sm sm:text-base ${
                      isDark ? "text-blue-300" : "text-blue-700"
                    }`}
                  >
                    ${currentTier.pricePerGB.toFixed(3)} per GB •{" "}
                    {currentTier.description}
                  </p>
                </div>

                <button
                  onClick={handleStartPlan}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 sm:py-5 rounded-xl sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 cursor-pointer text-base sm:text-lg font-bold"
                >
                  Start Using {currentTier.name} Plan
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section
        id="case-studies"
        className={`py-16 sm:py-24 lg:py-16 px-4 sm:px-6 lg:px-8 ${
          isDark ? "bg-gray-800/30" : "bg-gray-50/50"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Success Stories
              </span>
            </h2>
            <p
              className={`text-lg sm:text-xl ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Real companies achieving extraordinary results
            </p>
          </div>

          <div
            className={`p-6 sm:p-8 lg:p-12 rounded-xl sm:rounded-2xl backdrop-blur-sm ${
              isDark
                ? "bg-gray-800/50 border border-gray-700/50 shadow-2xl"
                : "bg-white/70 border border-gray-200/50 shadow-2xl"
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="mb-4 sm:mb-6">
                  <span
                    className={`inline-flex items-center px-3 sm:px-4 py-2 rounded-xl sm:rounded-xl text-xs sm:text-sm font-bold ${
                      currentTier.name === "Starter"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                        : currentTier.name === "Professional"
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                        : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    } shadow-lg`}
                  >
                    {currentTier.name} Tier Success Story
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">
                  {currentTier.caseStudy.company}
                </h3>
                <p
                  className={`text-lg sm:text-xl mb-6 sm:mb-8 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {currentTier.caseStudy.industry}
                </p>

                <div className="mb-6 sm:mb-8">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="relative">
                      <ChartBarIcon className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 mr-3 sm:mr-4" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse" />
                    </div>
                    <div>
                      <span className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                        {currentTier.caseStudy.savings}
                      </span>
                      <span
                        className={`text-lg sm:text-xl ml-2 sm:ml-3 ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        cost reduction
                      </span>
                    </div>
                  </div>
                </div>

                <p
                  className={`text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {currentTier.caseStudy.description}
                </p>

                <button
                  onClick={openCaseStudyModal}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-xl cursor-pointer font-medium flex items-center text-sm sm:text-base"
                >
                  <DocumentTextIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Read Full Case Study →
                </button>
              </div>

              <div className="order-1 lg:order-2">
                <div className="relative">
                  <img
                    src={currentTier.caseStudy.image}
                    alt={currentTier.caseStudy.company}
                    className="w-full h-64 sm:h-80 object-cover rounded-xl sm:rounded-xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl sm:rounded-xl" />
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400"
                        />
                      ))}
                      <span className="ml-1 sm:ml-2 font-medium text-sm sm:text-base">
                        5.0 rating
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 sm:py-24 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Enterprise-Grade Features
            </span>
          </h2>
          <p
            className={`text-lg sm:text-xl ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Everything you need to scale securely and efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div
            className={`group p-6 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 sm:hover:-translate-y-4 cursor-pointer ${
              isDark
                ? "bg-gray-800/50 border border-gray-700/50 shadow-2xl hover:shadow-blue-500/20"
                : "bg-white/70 border border-gray-200/50 shadow-2xl hover:shadow-blue-500/20"
            }`}
          >
            <div className="relative mb-6 sm:mb-8">
              <ShieldCheckIcon className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              Military-Grade Security
            </h3>
            <p
              className={`text-base sm:text-lg leading-relaxed ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              AES-256 encryption, SOC 2 Type II compliance, zero-trust
              architecture, and advanced threat protection
            </p>
          </div>

          <div
            className={`group p-6 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 sm:hover:-translate-y-4 cursor-pointer ${
              isDark
                ? "bg-gray-800/50 border border-gray-700/50 shadow-2xl hover:shadow-purple-500/20"
                : "bg-white/70 border border-gray-200/50 shadow-2xl hover:shadow-purple-500/20"
            }`}
          >
            <div className="relative mb-6 sm:mb-8">
              <CpuChipIcon className="w-12 h-12 sm:w-16 sm:h-16 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              Intelligent Auto-Scaling
            </h3>
            <p
              className={`text-base sm:text-lg leading-relaxed ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              AI-powered auto-scaling that predicts demand patterns and
              optimizes storage allocation in real-time
            </p>
          </div>

          <div
            className={`group p-6 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 sm:hover:-translate-y-4 cursor-pointer md:col-span-2 lg:col-span-1 ${
              isDark
                ? "bg-gray-800/50 border border-gray-700/50 shadow-2xl hover:shadow-green-500/20"
                : "bg-white/70 border border-gray-200/50 shadow-2xl hover:shadow-green-500/20"
            }`}
          >
            <div className="relative mb-6 sm:mb-8">
              <ChartBarIcon className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              Advanced Analytics
            </h3>
            <p
              className={`text-base sm:text-lg leading-relaxed ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Real-time insights, predictive analytics, cost optimization
              recommendations, and custom dashboards
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="py-16 sm:py-24 lg:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />

        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">
            Ready to Transform Your Storage?
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 opacity-90 leading-relaxed">
            Join 10,000+ companies already saving with CloudVault Pro's
            intelligent storage solutions
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <button
              onClick={handleStartPlan}
              className="group bg-white text-blue-600 px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl cursor-pointer text-base sm:text-lg font-bold flex items-center w-full sm:w-auto justify-center"
            >
              <RocketLaunchIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 group-hover:animate-bounce" />
              Start Free Trial
            </button>
          </div>

          <div className="mt-8 sm:mt-12 flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 text-white/80">
            <div className="flex items-center">
              <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">No setup fees</span>
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">Cancel anytime</span>
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">24/7 support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`py-8 px-4 sm:px-6 lg:px-8 ${
          isDark
            ? "bg-gray-900 border-t border-gray-800"
            : "bg-gray-50 border-t border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12">
            <div className="sm:col-span-2">
              <div className="flex items-center mb-4 sm:mb-6">
                <CloudIcon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 mr-2 sm:mr-3" />
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CloudVault Pro
                </span>
              </div>
              <p
                className={`text-base sm:text-lg mb-4 sm:mb-6 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Enterprise cloud storage that scales with your business. Trusted
                by companies worldwide for secure, reliable, and cost-effective
                data management.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                <a
                  href="#"
                  className={`p-2 sm:p-3 rounded-xl cursor-pointer transition-colors ${
                    isDark
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <GlobeAltIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a
                  href="#"
                  className={`p-2 sm:p-3 rounded-xl cursor-pointer transition-colors ${
                    isDark
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a
                  href="#"
                  className={`p-2 sm:p-3 rounded-xl cursor-pointer transition-colors ${
                    isDark
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <BoltIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">
                Product
              </h3>
              <ul
                className={`space-y-3 sm:space-y-4 text-sm sm:text-base ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <li>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="hover:text-blue-500 transition-colors cursor-pointer text-left"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("pricing")}
                    className="hover:text-blue-500 transition-colors cursor-pointer text-left"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    API
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">
                Company
              </h3>
              <ul
                className={`space-y-3 sm:space-y-4 text-sm sm:text-base ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    Press
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="hover:text-blue-500 transition-colors cursor-pointer text-left"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">
                Support
              </h3>
              <ul
                className={`space-y-3 sm:space-y-4 text-sm sm:text-base ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    Status Page
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    Partners
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div
            className={`border-t mt-12 sm:mt-16 pt-6 sm:pt-8 ${
              isDark ? "border-gray-800" : "border-gray-200"
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p
                className={`text-sm sm:text-base ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                &copy; 2024 CloudVault Pro. All rights reserved.
              </p>
              <div
                className={`flex flex-wrap justify-center md:justify-end space-x-4 sm:space-x-6 text-sm sm:text-base ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <a
                  href="#"
                  className="hover:text-blue-500 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="hover:text-blue-500 transition-colors cursor-pointer"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="hover:text-blue-500 transition-colors cursor-pointer"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          border: 2px solid white;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        @media (min-width: 640px) {
          .slider::-webkit-slider-thumb {
            height: 24px;
            width: 24px;
          }
          .slider::-moz-range-thumb {
            height: 24px;
            width: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default CloudVault;
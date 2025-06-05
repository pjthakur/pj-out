"use client";
import React, { useState, useEffect } from "react";
import {
  Coffee,
  Truck,
  Shield,
  Star,
  Check,
  Menu,
  X,
  ArrowRight,
  Award,
  Globe,
  Heart,
  Clock,
  Leaf,
  Users,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

const CoffeeSubscriptionWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("premium");
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionStep, setSubscriptionStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [subscriptionData, setSubscriptionData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });

  const plans = [
    {
      id: "basic",
      name: "Essential",
      price: 24,
      originalPrice: 32,
      bags: 1,
      features: [
        "Premium single-origin beans",
        "Free shipping",
        "Cancel anytime",
        "Monthly delivery",
      ],
      popular: false,
    },
    {
      id: "premium",
      name: "Connoisseur",
      price: 42,
      originalPrice: 56,
      bags: 2,
      features: [
        "2 premium coffee varieties",
        "Tasting notes included",
        "Free shipping",
        "Priority support",
        "Monthly delivery",
        "Exclusive blends",
      ],
      popular: true,
    },
    {
      id: "family",
      name: "Family Reserve",
      price: 68,
      originalPrice: 84,
      bags: 4,
      features: [
        "4 premium coffee varieties",
        "Family-sized portions",
        "Tasting notes & brewing guide",
        "Free express shipping",
        "24/7 premium support",
        "Monthly delivery",
        "Exclusive access to limited editions",
      ],
      popular: false,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Director",
      company: "TechFlow Inc.",
      content:
        "The quality is exceptional. Every morning starts with the perfect cup. The variety keeps me excited for each delivery.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      name: "Michael Rodriguez",
      role: "Creative Director",
      company: "Design Studio Pro",
      content:
        "I've tried many coffee subscriptions, but this one stands out. The curation is impeccable and the taste is consistently amazing.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      name: "Emily Watson",
      role: "Startup Founder",
      company: "InnovateLab",
      content:
        "The convenience and quality have transformed our office coffee culture. Our team looks forward to trying new blends every month.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/30.jpg",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showSubscriptionModal) {
      // Prevent scrolling on body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scrolling
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [showSubscriptionModal]);

  const handleSubscribe = () => {
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail("");
    }
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setShowSubscriptionModal(true);
    setSubscriptionStep(1);
    setValidationErrors({});
  };

  const validateStep = (step: number) => {
    const errors: { [key: string]: string } = {};

    if (step === 1) {
      if (!subscriptionData.firstName.trim())
        errors.firstName = "Please enter your first name";
      if (!subscriptionData.lastName.trim())
        errors.lastName = "Please enter your last name";
      if (!subscriptionData.email.trim()) 
        errors.email = "Please enter your email address";
      else if (!/\S+@\S+\.\S+/.test(subscriptionData.email))
        errors.email = "Please enter a valid email address";
      if (!subscriptionData.phone.trim())
        errors.phone = "Please enter your phone number";
      else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(subscriptionData.phone))
        errors.phone = "Please enter a valid phone number (at least 10 digits)";
    }

    if (step === 2) {
      if (!subscriptionData.address.trim())
        errors.address = "Please enter your street address";
      if (!subscriptionData.city.trim()) 
        errors.city = "Please enter your city";
      if (!subscriptionData.state.trim()) 
        errors.state = "Please enter your state";
      if (!subscriptionData.zipCode.trim())
        errors.zipCode = "Please enter your ZIP code";
      else if (!/^\d{5}(-\d{4})?$/.test(subscriptionData.zipCode))
        errors.zipCode = "Please enter a valid 5 digit ZIP code";
    }

    if (step === 3) {
      if (!subscriptionData.nameOnCard.trim())
        errors.nameOnCard = "Please enter name on card";
      if (!subscriptionData.cardNumber.trim())
        errors.cardNumber = "Please enter your card number";
      else if (
        !/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(
          subscriptionData.cardNumber.replace(/\s/g, "")
        )
      )
        errors.cardNumber = "Please enter a valid 16-digit card number";
      if (!subscriptionData.expiryDate.trim())
        errors.expiryDate = "Please enter expiry date";
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(subscriptionData.expiryDate))
        errors.expiryDate = "Please enter valid date (MM/YY)";
      if (!subscriptionData.cvv.trim()) 
        errors.cvv = "Please enter CVV";
      else if (!/^\d{3,4}$/.test(subscriptionData.cvv))
        errors.cvv = "Please enter a valid CVV (3 or 4 digits)";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubscriptionSubmit = async () => {
    if (!validateStep(subscriptionStep)) return;

    if (subscriptionStep < 3) {
      setSubscriptionStep(subscriptionStep + 1);
    } else {
      setIsProcessing(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubscriptionStep(4); // Success step
      setIsProcessing(false);
    }
  };

  const resetSubscriptionModal = () => {
    setShowSubscriptionModal(false);
    setSubscriptionStep(1);
    setValidationErrors({});
    setIsProcessing(false);
    setSubscriptionData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      nameOnCard: "",
    });
  };

  const updateSubscriptionData = (field: string, value: string) => {
    setSubscriptionData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error for this field if the value becomes valid
    if (validationErrors[field]) {
      const newErrors = { ...validationErrors };

      // Check if the new value is valid and clear error if so
      let isValid = false;
      switch (field) {
        case "firstName":
        case "lastName":
        case "address":
        case "city":
        case "state":
        case "nameOnCard":
          isValid = value.trim().length > 0;
          break;
        case "email":
          isValid = value.trim().length > 0 && /\S+@\S+\.\S+/.test(value);
          break;
        case "phone":
          isValid =
            value.trim().length > 0 && /^\+?[\d\s\-\(\)]{10,}$/.test(value);
          break;
        case "zipCode":
          isValid = value.trim().length > 0 && /^\d{5}(-\d{4})?$/.test(value);
          break;
        case "cardNumber":
          isValid =
            value.trim().length > 0 &&
            /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(value.replace(/\s/g, ""));
          break;
        case "expiryDate":
          isValid =
            value.trim().length > 0 && /^(0[1-9]|1[0-2])\/\d{2}$/.test(value);
          break;
        case "cvv":
          isValid = value.trim().length > 0 && /^\d{3,4}$/.test(value);
          break;
      }

      if (isValid) {
        delete newErrors[field];
        setValidationErrors(newErrors);
      }
    }
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 font-[Roboto]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-amber-100 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-2 rounded-xl">
                <Coffee className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">BrewCraft</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("home")}
                className="text-gray-700 hover:text-amber-600 transition-colors cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-700 hover:text-amber-600 transition-colors cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("plans")}
                className="text-gray-700 hover:text-amber-600 transition-colors cursor-pointer"
              >
                Plans
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-gray-700 hover:text-amber-600 transition-colors cursor-pointer"
              >
                Reviews
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-700 hover:text-amber-600 transition-colors cursor-pointer"
              >
                Contact
              </button>
              <button
                onClick={() => scrollToSection("plans")}
                className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                Get Started
              </button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 animate-in slide-in-from-top duration-200">
            <div className="px-4 py-3 space-y-3">
              <button
                onClick={() => scrollToSection("home")}
                className="block w-full text-left py-2 text-gray-700 hover:text-amber-600 transition-colors cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="block w-full text-left py-2 text-gray-700 hover:text-amber-600 transition-colors cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("plans")}
                className="block w-full text-left py-2 text-gray-700 hover:text-amber-600 transition-colors cursor-pointer"
              >
                Plans
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="block w-full text-left py-2 text-gray-700 hover:text-amber-600 transition-colors cursor-pointer"
              >
                Reviews
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block w-full text-left py-2 text-gray-700 hover:text-amber-600 transition-colors cursor-pointer"
              >
                Contact
              </button>
              <button
                onClick={() => scrollToSection("plans")}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in slide-in-from-left duration-700">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">
                  <Award className="h-4 w-4" />
                  <span>Award-winning coffee experiences</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Premium Coffee
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {" "}
                    Delivered
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Experience the world's finest coffee beans, carefully curated
                  and delivered fresh to your door every month. From
                  single-origin to artisan blends, discover your perfect cup.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => scrollToSection("plans")}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 cursor-pointer">
                  Learn More
                </button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600">Happy Subscribers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">4.9★</div>
                  <div className="text-sm text-gray-600">Customer Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">100+</div>
                  <div className="text-sm text-gray-600">Coffee Varieties</div>
                </div>
              </div>
            </div>

            <div className="relative animate-in slide-in-from-right duration-700 delay-200">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=600&fit=crop&crop=center"
                  alt="Premium Coffee Setup"
                  className="rounded-3xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Truck className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Free Delivery
                      </div>
                      <div className="text-sm text-gray-600">
                        Direct to your door
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center space-x-3">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <Coffee className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Fresh Roasted
                      </div>
                      <div className="text-sm text-gray-600">
                        Within 48 hours
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16 animate-in fade-in duration-700">
            <h2 className="text-4xl font-bold text-gray-900">
              Why Choose BrewCraft?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just another coffee subscription. We're your gateway to
              extraordinary coffee experiences from around the world.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Global Sourcing",
                description:
                  "Direct relationships with farmers across 20+ countries ensure ethical sourcing and exceptional quality.",
              },
              {
                icon: Heart,
                title: "Expert Curation",
                description:
                  "Our master roasters personally select each bean, ensuring only the finest coffees reach your cup.",
              },
              {
                icon: Clock,
                title: "Fresh Roasted",
                description:
                  "Beans are roasted to order and shipped within 48 hours for peak freshness and flavor.",
              },
              {
                icon: Leaf,
                title: "Sustainable Practice",
                description:
                  "100% sustainable sourcing with carbon-neutral shipping and eco-friendly packaging.",
              },
              {
                icon: Users,
                title: "Community Driven",
                description:
                  "Join thousands of coffee lovers sharing experiences, recipes, and discoveries.",
              },
              {
                icon: Shield,
                title: "Quality Guarantee",
                description:
                  "Not satisfied? We'll refund or replace your order with no questions asked.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:border-amber-200 transition-all duration-300 group animate-in fade-in-up duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16 animate-in fade-in duration-700">
            <h2 className="text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="text-xl text-gray-600">
              Simple steps to coffee perfection
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Choose Your Plan",
                description:
                  "Select from our carefully crafted subscription plans designed to match your coffee preferences and consumption.",
                icon: Coffee,
              },
              {
                step: "02",
                title: "We Curate & Roast",
                description:
                  "Our experts select premium beans from our global network and roast them to perfection just for you.",
                icon: Award,
              },
              {
                step: "03",
                title: "Delivered Fresh",
                description:
                  "Receive your freshly roasted coffee with detailed tasting notes and brewing recommendations.",
                icon: Truck,
              },
            ].map((step, index) => (
              <div
                key={index}
                className="text-center space-y-6 animate-in fade-in-up duration-700"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative">
                  <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg border-4 border-amber-100">
                    <step.icon className="h-8 w-8 text-amber-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                    {step.step}
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section id="plans" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16 animate-in fade-in duration-700">
            <h2 className="text-4xl font-bold text-gray-900">
              Choose Your Perfect Plan
            </h2>
            <p className="text-xl text-gray-600">
              Flexible subscriptions designed for every coffee lover
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl border-2 p-8 transition-all duration-300 hover:shadow-2xl animate-in fade-in-up duration-700 flex flex-col h-full ${
                  plan.popular
                    ? "border-amber-400 shadow-xl scale-105 bg-gradient-to-br from-amber-50 to-orange-50"
                    : "border-gray-200 hover:border-amber-200"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center space-y-6 flex-grow flex flex-col">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mt-2">
                      {plan.bags} premium coffee bag{plan.bags > 1 ? "s" : ""}{" "}
                      monthly
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-4xl font-bold text-gray-900">
                        ${plan.price}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        ${plan.originalPrice}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">per month</p>
                  </div>

                  <ul className="space-y-3 text-left flex-grow">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <div className="bg-green-100 rounded-full p-1">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 mt-auto cursor-pointer ${
                      plan.popular
                        ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:shadow-lg transform hover:scale-105"
                        : "border-2 border-gray-300 text-gray-700 hover:border-amber-400 hover:text-amber-600"
                    }`}
                  >
                    Subscribe Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              All plans include free shipping • Cancel anytime • No commitments
            </p>
            <button
              onClick={() => scrollToSection("contact")}
              className="inline-flex items-center space-x-2 text-amber-600 hover:text-amber-700 font-semibold transition-colors cursor-pointer"
            >
              <span>Need a custom plan?</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="py-20 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16 animate-in fade-in duration-700">
            <h2 className="text-4xl font-bold text-gray-900">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied coffee lovers
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-in fade-in duration-700">
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1 text-center md:text-left">
                  <div className="flex justify-center md:justify-start mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-amber-400 fill-current"
                        />
                      )
                    )}
                  </div>
                  <p className="text-lg text-gray-700 italic mb-4">
                    "{testimonials[currentTestimonial].content}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-gray-600">
                      {testimonials[currentTestimonial].role} at{" "}
                      {testimonials[currentTestimonial].company}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 cursor-pointer ${
                    index === currentTestimonial
                      ? "bg-amber-600 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-in fade-in duration-700">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Stay Updated with Coffee Trends
            </h2>
            <p className="text-xl text-amber-100">
              Get weekly insights, brewing tips, and exclusive offers delivered
              to your inbox
            </p>

            <div className="max-w-lg mx-auto">
              <form
                className="flex flex-col sm:flex-row gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubscribe();
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-6 py-4 rounded-full text-white placeholder-gray-200 focus:outline-none focus:ring-4 focus:ring-white/20"
                />
                <button
                  type="submit"
                  className="bg-white text-amber-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Subscribe</span>
                  <Mail className="h-5 w-5" />
                </button>
              </form>
            </div>

            {isSubscribed && (
              <div className="animate-in fade-in duration-300">
                <p className="text-white font-semibold">
                  Thank you for subscribing! Check your email for confirmation.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-2 rounded-xl">
                  <Coffee className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">BrewCraft</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Bringing you the world's finest coffee experiences, one cup at a
                time. Premium quality, sustainable sourcing, exceptional
                service.
              </p>
              <div className="flex space-x-4">
                <button onClick={() => window.location.href = "#"} className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors group cursor-pointer">
                  <span className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors font-bold text-lg flex items-center justify-center">F</span>
                </button>
                <button onClick={() => window.location.href = "#"} className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors group cursor-pointer">
                  <span className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors font-bold text-lg flex items-center justify-center">T</span>
                </button>
                <button onClick={() => window.location.href = "#"} className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors group cursor-pointer">
                  <span className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors font-bold text-lg flex items-center justify-center">I</span>
                </button>
                <button onClick={() => window.location.href = "#"} className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors group cursor-pointer">
                  <span className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors font-bold text-lg flex items-center justify-center">L</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-6">Products</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors cursor-pointer">
                    Coffee Subscriptions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors cursor-pointer">
                    Single Origin
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors cursor-pointer">
                    Signature Blends
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors cursor-pointer">
                    Gift Cards
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors cursor-pointer">
                    Brewing Equipment
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-6">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors cursor-pointer">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors cursor-pointer">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors cursor-pointer">
                    Sustainability
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors cursor-pointer">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors cursor-pointer">
                    Press
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-6">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-amber-400" />
                  <span className="text-gray-400">hello@brewcraft.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-amber-400" />
                  <span className="text-gray-400">+1 (555) 123-BREW</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-amber-400" />
                  <span className="text-gray-400">San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                © 2025 BrewCraft. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-white transition-colors cursor-pointer">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onTouchMove={(e) => e.preventDefault()}
          onWheel={(e) => e.preventDefault()}
          style={{ touchAction: 'none' }}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
            onTouchMove={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            style={{ touchAction: 'auto' }}
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Complete Your Subscription
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {plans.find((p) => p.id === selectedPlan)?.name} Plan - $
                    {plans.find((p) => p.id === selectedPlan)?.price}/month
                  </p>
                </div>
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-center mb-8">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                        step <= subscriptionStep
                          ? "bg-amber-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step < subscriptionStep ? (
                        <Check className="h-4 w-4" />
                      ) : step === subscriptionStep && step === 4 ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        step
                      )}
                    </div>
                    {step < 4 && (
                      <div
                        className={`w-12 h-1 mx-2 transition-all duration-200 ${
                          step < subscriptionStep
                            ? "bg-amber-600"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Content */}
              {subscriptionStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={subscriptionData.firstName}
                        onChange={(e) =>
                          updateSubscriptionData("firstName", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 transition-colors ${
                          validationErrors.firstName
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-amber-500"
                        }`}
                        placeholder="Enter your first name"
                      />
                      {validationErrors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {validationErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={subscriptionData.lastName}
                        onChange={(e) =>
                          updateSubscriptionData("lastName", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 transition-colors ${
                          validationErrors.lastName
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-amber-500"
                        }`}
                        placeholder="Enter your last name"
                      />
                      {validationErrors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {validationErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={subscriptionData.email}
                      onChange={(e) =>
                        updateSubscriptionData("email", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 transition-colors ${
                        validationErrors.email
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-amber-500"
                      }`}
                      placeholder="Enter your email address"
                    />
                    {validationErrors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={subscriptionData.phone}
                      onChange={(e) =>
                        updateSubscriptionData("phone", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 transition-colors ${
                        validationErrors.phone
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-amber-500"
                      }`}
                      placeholder="Enter your phone number"
                    />
                    {validationErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {validationErrors.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {subscriptionStep === 4 && (
                <div className="text-center space-y-6 py-8">
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="h-10 w-10 text-green-600" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Welcome to BrewCraft!
                    </h3>
                    <p className="text-lg text-gray-600">
                      Your {plans.find((p) => p.id === selectedPlan)?.name}{" "}
                      subscription is confirmed!
                    </p>
                  </div>

                  <div className="bg-amber-50 rounded-xl p-6 text-left space-y-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      What happens next?
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                          1
                        </div>
                        <p className="text-gray-700">
                          You'll receive a confirmation email within the next
                          few minutes
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                          2
                        </div>
                        <p className="text-gray-700">
                          Your first coffee shipment will arrive within 3-5
                          business days
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                          3
                        </div>
                        <p className="text-gray-700">
                          Future deliveries will arrive on the same date each
                          month
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                          4
                        </div>
                        <p className="text-gray-700">
                          You can manage your subscription anytime in your
                          account dashboard
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Your Subscription Details
                    </h4>
                    <div className="space-y-2 text-left">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plan:</span>
                        <span className="text-gray-900 font-medium">
                          {plans.find((p) => p.id === selectedPlan)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Cost:</span>
                        <span className="text-gray-900 font-medium">
                          ${plans.find((p) => p.id === selectedPlan)?.price}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Next Billing:</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(
                            Date.now() + 30 * 24 * 60 * 60 * 1000
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Address:</span>
                        <span className="text-gray-900 font-medium">
                          {subscriptionData.city}, {subscriptionData.state}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {subscriptionStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Shipping Address
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={subscriptionData.address}
                      onChange={(e) =>
                        updateSubscriptionData("address", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 transition-colors ${
                        validationErrors.address
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-amber-500"
                      }`}
                      placeholder="Enter your street address"
                    />
                    {validationErrors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {validationErrors.address}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={subscriptionData.city}
                        onChange={(e) =>
                          updateSubscriptionData("city", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 transition-colors ${
                          validationErrors.city
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-amber-500"
                        }`}
                        placeholder="City"
                      />
                      {validationErrors.city && (
                        <p className="text-red-500 text-sm mt-1">
                          {validationErrors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={subscriptionData.state}
                        onChange={(e) =>
                          updateSubscriptionData("state", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 transition-colors ${
                          validationErrors.state
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-amber-500"
                        }`}
                        placeholder="State"
                      />
                      {validationErrors.state && (
                        <p className="text-red-500 text-sm mt-1">
                          {validationErrors.state}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={subscriptionData.zipCode}
                        onChange={(e) =>
                          updateSubscriptionData("zipCode", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 transition-colors ${
                          validationErrors.zipCode
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-amber-500"
                        }`}
                        placeholder="ZIP"
                      />
                      {validationErrors.zipCode && (
                        <p className="text-red-500 text-sm mt-1">
                          {validationErrors.zipCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {subscriptionStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Payment Information
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      value={subscriptionData.nameOnCard}
                      onChange={(e) =>
                        updateSubscriptionData("nameOnCard", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 transition-colors ${
                        validationErrors.nameOnCard
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-amber-500"
                      }`}
                      placeholder="Enter name as it appears on card"
                    />
                    {validationErrors.nameOnCard && (
                      <p className="text-red-500 text-sm mt-1">
                        {validationErrors.nameOnCard}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={subscriptionData.cardNumber}
                      onChange={(e) =>
                        updateSubscriptionData("cardNumber", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 transition-colors ${
                        validationErrors.cardNumber
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-amber-500"
                      }`}
                      placeholder="1234 5678 9012 3456"
                    />
                    {validationErrors.cardNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {validationErrors.cardNumber}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={subscriptionData.expiryDate}
                        onChange={(e) =>
                          updateSubscriptionData("expiryDate", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 transition-colors ${
                          validationErrors.expiryDate
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-amber-500"
                        }`}
                        placeholder="MM/YY"
                      />
                      {validationErrors.expiryDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {validationErrors.expiryDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={subscriptionData.cvv}
                        onChange={(e) =>
                          updateSubscriptionData("cvv", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 transition-colors ${
                          validationErrors.cvv
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-amber-500"
                        }`}
                        placeholder="123"
                      />
                      {validationErrors.cvv && (
                        <p className="text-red-500 text-sm mt-1">
                          {validationErrors.cvv}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-xl p-6 mt-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Order Summary
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {plans.find((p) => p.id === selectedPlan)?.name} Plan
                        </span>
                        <span className="text-gray-900">
                          ${plans.find((p) => p.id === selectedPlan)?.price}
                          /month
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-green-600">Free</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total</span>
                          <span>
                            ${plans.find((p) => p.id === selectedPlan)?.price}
                            /month
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {subscriptionStep < 4 && (
                <div className="flex flex-col sm:flex-row gap-4 sm:justify-between mt-8">
                  <button
                    onClick={() =>
                      subscriptionStep > 1
                        ? setSubscriptionStep(subscriptionStep - 1)
                        : setShowSubscriptionModal(false)
                    }
                    className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer order-2 sm:order-1"
                    disabled={isProcessing}
                  >
                    {subscriptionStep > 1 ? "Previous" : "Cancel"}
                  </button>
                  <button
                    onClick={handleSubscriptionSubmit}
                    disabled={isProcessing}
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer order-1 sm:order-2 ${
                      isProcessing
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-amber-600 to-orange-600 hover:shadow-lg transform hover:scale-105"
                    } text-white`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {subscriptionStep === 3
                            ? "Complete"
                            : "Continue"}
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {subscriptionStep === 4 && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={resetSubscriptionModal}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer"
                  >
                    Start Your Coffee Journey
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");
      `}</style>
    </div>
  );
};

export default CoffeeSubscriptionWebsite;
// Zod Schema
export const Schema = {
    "commentary": "",
    "template": "nextjs-developer",
    "title": "",
    "description": "",
    "additional_dependencies": [
        "lucide-react"
    ],
    "has_additional_dependencies": true,
    "install_dependencies_command": "npm install lucide-react",
    "port": 3000,
    "file_path": "pages/index.tsx",
    "code": "<see code above>"
}
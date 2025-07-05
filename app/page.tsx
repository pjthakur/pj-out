'use client';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import QRCode from 'qrcode';
import {
  FiGift,
  FiTrendingUp,
  FiUser,
  FiCreditCard,
  FiCheck,
  FiClock,
  FiAward,
  FiShoppingBag,
  FiCalendar,
  FiChevronRight,
  FiTarget,
  FiZap,
  FiHeart,
  FiRefreshCw,
  FiDownload,
  FiSearch,
  FiSettings,
  FiBell,
  FiArrowUp,
  FiMenu,
  FiX,
  FiShield,
  FiDollarSign,
} from 'react-icons/fi';
import {
  HiSparkles,
  HiLightningBolt,
  HiTrendingUp as HiTrendingUpSolid,
  HiCash,
  HiGift as HiGiftSolid,
  HiStar as HiStarSolid,
} from 'react-icons/hi';
import { RiVipCrownFill } from 'react-icons/ri';
import { MdDiamond, MdCoffee } from 'react-icons/md';

import { IoRestaurant } from 'react-icons/io5';

const poppinsFont = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');
`;

const hideScrollbarStyles = `
  /* Hide scrollbars for webkit browsers */
  ::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbars for Firefox */
  * {
    scrollbar-width: none;
  }
  
  /* Hide scrollbars for IE and Edge */
  * {
    -ms-overflow-style: none;
  }
  
  /* Ensure scrolling still works */
  .scrollable {
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .scrollable::-webkit-scrollbar {
    display: none;
  }
`;

if (typeof document !== 'undefined') {
  const fontStyle = document.createElement('style');
  fontStyle.textContent = poppinsFont;
  document.head.appendChild(fontStyle);
  
  const scrollbarStyle = document.createElement('style');
  scrollbarStyle.textContent = hideScrollbarStyles;
  document.head.appendChild(scrollbarStyle);
}

interface Offer {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: string;
  expiryDate: string;
  featured?: boolean;
  discount?: number;
  originalPrice?: number;
  imageUrl?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  estimatedValue?: number;
  redeemCount?: number;
}

interface RewardTier {
  name: string;
  minPoints: number;
  benefits: string[];
  gradient: string;
  icon: React.ReactNode;
  multiplier: number;
  description: string;
}

interface Transaction {
  id: string;
  type: 'earned' | 'redeemed' | 'bonus' | 'expired';
  points: number;
  description: string;
  date: string;
  category?: string;
  merchant?: string;
}

interface Analytics {
  totalEarned: number;
  totalRedeemed: number;
  averageMonthly: number;
  streak: number;
  nextMilestone: number;
  efficiency: number;
}

const LoyaltyDashboard: React.FC = () => {
  const [customerPoints, setCustomerPoints] = useState(15000);
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rewards' | 'analytics' | 'profile'>(
    'dashboard'
  );
  const [animatedPoints, setAnimatedPoints] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showBuyPointsModal, setShowBuyPointsModal] = useState(false);
  const [selectedPointPackage, setSelectedPointPackage] = useState<string | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
  });
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showRedeemConfirmModal, setShowRedeemConfirmModal] = useState(false);
  const [confirmRedeemOffer, setConfirmRedeemOffer] = useState<Offer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'earned',
      points: 125,
      description: 'Purchase at Artisan Coffee Co.',
      date: '2025-06-07',
      category: 'Shopping',
      merchant: 'Artisan Coffee Co.',
    },
    {
      id: '2',
      type: 'redeemed',
      points: -2500,
      description: 'Premium Coffee Subscription',
      date: '2025-06-05',
      category: 'Redemption',
    },
    {
      id: '3',
      type: 'bonus',
      points: 500,
      description: 'Monthly streak bonus',
      date: '2025-06-01',
      category: 'Bonus',
    },
    {
      id: '4',
      type: 'earned',
      points: 89,
      description: 'Online purchase',
      date: '2025-05-28',
      category: 'Shopping',
      merchant: 'StyleHub',
    },
  ]);

  // Point packages for purchase
  const pointPackages = [
    {
      id: 'starter',
      name: 'Starter Pack',
      points: 1000,
      price: 9.99,
      bonus: 0,
      popular: false,
      description: 'Perfect for getting started'
    },
    {
      id: 'popular',
      name: 'Popular Pack',
      points: 2500,
      price: 19.99,
      bonus: 500,
      popular: true,
      description: 'Most popular choice'
    },
    {
      id: 'premium',
      name: 'Premium Pack',
      points: 5000,
      price: 34.99,
      bonus: 1500,
      popular: false,
      description: 'Best value for money'
    },
    {
      id: 'ultimate',
      name: 'Ultimate Pack',
      points: 10000,
      price: 59.99,
      bonus: 3000,
      popular: false,
      description: 'Maximum rewards'
    }
  ];

  const maxPoints = 10000;
  const pointsPercentage = Math.min((customerPoints / maxPoints) * 100, 100);

  const rewardTiers: RewardTier[] = [
    {
      name: 'Explorer',
      minPoints: 0,
      benefits: ['5% cashback', 'Standard support', 'Basic rewards access'],
      gradient: 'from-slate-500 via-slate-600 to-slate-700',
      icon: <FiUser className="w-5 h-5" />,
      multiplier: 1.0,
      description: 'Start your loyalty journey',
    },
    {
      name: 'Adventurer',
      minPoints: 1500,
      benefits: ['8% cashback', 'Priority support', 'Early access', 'Free shipping'],
      gradient: 'from-emerald-400 via-emerald-500 to-emerald-600',
      icon: <FiTrendingUp className="w-5 h-5" />,
      multiplier: 1.2,
      description: 'Unlock enhanced benefits',
    },
    {
      name: 'Champion',
      minPoints: 4000,
      benefits: ['12% cashback', 'VIP support', 'Exclusive events', 'Personal concierge'],
      gradient: 'from-blue-400 via-blue-500 to-blue-600',
      icon: <FiAward className="w-5 h-5" />,
      multiplier: 1.5,
      description: 'Premium member experience',
    },
    {
      name: 'Legend',
      minPoints: 8000,
      benefits: ['15% cashback', 'Dedicated manager', 'Unlimited perks', 'Annual bonus'],
      gradient: 'from-purple-500 via-purple-600 to-purple-700',
      icon: <RiVipCrownFill className="w-5 h-5" />,
      multiplier: 2.0,
      description: 'Elite status with maximum rewards',
    },
  ];

  const analytics: Analytics = useMemo(() => {
    const totalRedeemed = transactions
      .filter(t => t.type === 'redeemed')
      .reduce((sum, t) => sum + Math.abs(t.points), 0);

    const totalEarned = transactions
      .filter(t => t.type === 'earned' || t.type === 'bonus')
      .reduce((sum, t) => sum + t.points, 0);

    // Calculate next milestone with progressive 5000-point increments
    // Milestones: 5000, 10000, 15000, 20000, 25000, etc.
    const nextMilestone = Math.floor(customerPoints / 5000) * 5000 + 5000;

    return {
      totalEarned: totalEarned + customerPoints, // Include current points
      totalRedeemed,
      averageMonthly: 485,
      streak: 14,
      nextMilestone,
      efficiency: Math.round((totalRedeemed / (totalEarned + customerPoints)) * 100) || 87,
    };
  }, [transactions, customerPoints]);

  const [offers, setOffers] = useState<Offer[]>([
    {
      id: '1',
      title: 'Premium Coffee Subscription',
      description: 'Monthly delivery of artisan coffee blends from around the world',
      pointsCost: 2500,
      category: 'Beverages',
      expiryDate: '2025-08-15',
      featured: true,
      rarity: 'epic',
      estimatedValue: 89.99,
      redeemCount: 234,
      imageUrl:
        'https://live.staticflickr.com/5205/5327101981_fdeea443e9_b.jpg',
    },
    {
      id: '2',
      title: 'VIP Shopping Experience',
      description: 'Personal shopping session with style consultant and exclusive access',
      pointsCost: 5000,
      category: 'Experiences',
      expiryDate: '2025-07-30',
      featured: true,
      rarity: 'legendary',
      estimatedValue: 299.99,
      redeemCount: 47,
      discount: 25,
      imageUrl:
        'https://live.staticflickr.com/73/204839010_0c7d7aec28_b.jpg',
    },
    {
      id: '3',
      title: 'Gourmet Dining Credit',
      description: '$50 credit at participating premium restaurants',
      pointsCost: 1200,
      category: 'Dining',
      expiryDate: '2025-09-01',
      rarity: 'rare',
      estimatedValue: 50.0,
      redeemCount: 412,
      imageUrl:
        'https://live.staticflickr.com/5344/17711628110_ef9dcc20c1_b.jpg',
    },
    {
      id: '4',
      title: 'Tech Gadget Bundle',
      description: 'Latest wireless earbuds and premium accessories',
      pointsCost: 3800,
      category: 'Electronics',
      expiryDate: '2025-07-20',
      rarity: 'epic',
      estimatedValue: 199.99,
      redeemCount: 89,
      imageUrl:
        'https://live.staticflickr.com/2/1448851_b7545b5e6e.jpg',
    },
    {
      id: '5',
      title: 'Wellness Retreat Package',
      description: 'Day spa experience with massage and wellness treatments',
      pointsCost: 4200,
      category: 'Wellness',
      expiryDate: '2025-08-30',
      featured: true,
      rarity: 'epic',
      estimatedValue: 250.0,
      redeemCount: 156,
      imageUrl:
        'https://live.staticflickr.com/112/306002914_70c6f8b6e2_b.jpg',
    },
    {
      id: '6',
      title: 'Instant Cashback',
      description: '$25 instant cashback to your account',
      pointsCost: 800,
      category: 'Cashback',
      expiryDate: '2025-12-31',
      rarity: 'common',
      estimatedValue: 25.0,
      redeemCount: 1247,
      imageUrl:
        'https://live.staticflickr.com/38/83115702_61ec628391_b.jpg',
    },
  ]);

  const currentTier = rewardTiers.reduce((prev, curr) =>
    customerPoints >= curr.minPoints ? curr : prev
  );

  const nextTier = rewardTiers.find(tier => tier.minPoints > customerPoints);

  const categoryIcons: { [key: string]: React.ReactNode } = {
    Beverages: <MdCoffee className="w-4 h-4 text-white" />,
    Experiences: <HiSparkles className="w-4 h-4 text-white" />,
    Dining: <IoRestaurant className="w-4 h-4 text-white" />,
    Electronics: <FiZap className="w-4 h-4 text-white" />,
    Wellness: <FiHeart className="w-4 h-4 text-white" />,
    Cashback: <HiCash className="w-4 h-4 text-white" />,
    Shopping: <FiShoppingBag className="w-4 h-4 text-white" />,
  };

  const rarityConfig = {
    common: { color: 'from-gray-500 to-gray-600', glow: 'shadow-gray-800' },
    rare: { color: 'from-blue-400 to-blue-500', glow: 'shadow-blue-900' },
    epic: { color: 'from-purple-400 to-purple-500', glow: 'shadow-purple-900' },
    legendary: {
      color: 'from-amber-400 to-amber-500',
      glow: 'shadow-amber-900',
    },
  };

  // Smooth points animation
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = customerPoints / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= customerPoints) {
        setAnimatedPoints(customerPoints);
        clearInterval(timer);
      } else {
        setAnimatedPoints(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [customerPoints]);

  // Professional QR code generator using qrcode library
  const generateQRCode = useCallback(async (text: string) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // Generate actual scannable QR code
      const qrCodeDataURL = await QRCode.toDataURL(text, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1F2937',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      });

      // Create image from data URL
      const img = new Image();
      img.onload = () => {
        canvas.width = 200;
        canvas.height = 200;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 200, 200);
        ctx.drawImage(img, 0, 0, 200, 200);
      };
      img.src = qrCodeDataURL;
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      
      // Fallback: display error message
      canvas.width = 200;
      canvas.height = 200;
    ctx.fillStyle = '#1F2937';
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('QR Code', 100, 90);
      ctx.fillText('Generation Error', 100, 110);
    }
  }, []);

  useEffect(() => {
    if (selectedOffer) {
      const offer = offers.find(o => o.id === selectedOffer);
      if (offer) {
        const redemptionData = JSON.stringify({
          type: 'LOYALTY_REDEMPTION',
          offerId: offer.id,
          offerTitle: offer.title,
          pointsCost: offer.pointsCost,
          redemptionId: `RDM-${Date.now()}`,
          timestamp: new Date().toISOString(),
          customerId: 'CUST-12345', // In real app, this would be actual customer ID
        });
        generateQRCode(redemptionData);
      }
    }
  }, [selectedOffer, generateQRCode, offers]);



  // Handle scroll lock for all modals
  useEffect(() => {
    const isAnyModalOpen = showRedeemConfirmModal || showBuyPointsModal || showLoadingOverlay || selectedOffer || isMobileSidebarOpen;
    
    if (isAnyModalOpen) {
      // Prevent body scroll when any modal is open
      document.body.style.overflow = 'hidden';
      
      // Handle escape key for modals
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (showRedeemConfirmModal) {
            setShowRedeemConfirmModal(false);
            setConfirmRedeemOffer(null);
          } else if (showBuyPointsModal) {
            setShowBuyPointsModal(false);
            setSelectedPointPackage(null);
            setPaymentForm({
              cardNumber: '',
              expiryDate: '',
              cvv: '',
              cardholderName: '',
              email: '',
            });
            setPaymentErrors({});
          } else if (selectedOffer) {
            setSelectedOffer(null);
            setShowLoadingOverlay(false);
          } else if (isMobileSidebarOpen) {
            setIsMobileSidebarOpen(false);
          }
          // Note: loading overlay doesn't close on escape
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showRedeemConfirmModal, showBuyPointsModal, showLoadingOverlay, selectedOffer, isMobileSidebarOpen]);

  const handleRedeemOffer = async (offer: Offer) => {
    if (customerPoints < offer.pointsCost) return;

    // Show confirmation modal instead of directly processing
    setConfirmRedeemOffer(offer);
    setShowRedeemConfirmModal(true);
  };

  const processRedemption = async () => {
    if (!confirmRedeemOffer) return;

    // Close confirmation modal
    setShowRedeemConfirmModal(false);
    setConfirmRedeemOffer(null);

    setIsLoading(true);
    setShowLoadingOverlay(true);

    setTimeout(async () => {
      // Update points
      setCustomerPoints(prev => prev - confirmRedeemOffer.pointsCost);

      // Update redeemed count for the specific offer
      setOffers(prevOffers => 
        prevOffers.map(o => 
          o.id === confirmRedeemOffer.id 
            ? { ...o, redeemCount: (o.redeemCount || 0) + 1 }
            : o
        )
      );

      // Add new transaction to the beginning of the array
      const newTransaction: Transaction = {
        id: `txn-${Date.now()}`,
        type: 'redeemed',
        points: -confirmRedeemOffer.pointsCost,
        description: confirmRedeemOffer.title,
        date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        category: 'Redemption',
      };

      setTransactions(prev => [newTransaction, ...prev]);

      // Hide loading overlay and show redemption modal
      setShowLoadingOverlay(false);
      setSelectedOffer(confirmRedeemOffer.id);
      setIsLoading(false);
      setShowSuccess(true);

      // Generate professional QR code with redemption data
      const redemptionData = JSON.stringify({
        type: 'LOYALTY_REDEMPTION',
        offerId: confirmRedeemOffer.id,
        offerTitle: confirmRedeemOffer.title,
        pointsCost: confirmRedeemOffer.pointsCost,
        redemptionId: `RDM-${Date.now()}`,
        timestamp: new Date().toISOString(),
        customerId: 'CUST-12345', // In real app, this would be actual customer ID
      });

      setTimeout(() => {
        generateQRCode(redemptionData);
      }, 100);

      setTimeout(() => setShowSuccess(false), 4000);
    }, 1500);
  };

  const handleTransactionClick = (transaction: Transaction) => {
    if (transaction.type === 'redeemed') {
      // Find the matching offer by title
      const matchingOffer = offers.find(offer => offer.title === transaction.description);
      if (matchingOffer) {
        setSelectedOffer(matchingOffer.id);
      }
    }
  };

  // Payment form validation
  const validatePaymentForm = () => {
    const errors: Record<string, string> = {};

    // Card number validation (16 digits)
    const cardNumber = paymentForm.cardNumber.replace(/\s/g, '');
    if (!cardNumber) {
      errors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(cardNumber)) {
      errors.cardNumber = 'Card number must be 16 digits';
    }

    // Expiry date validation (MM/YY format)
    if (!paymentForm.expiryDate) {
      errors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentForm.expiryDate)) {
      errors.expiryDate = 'Invalid format (MM/YY)';
    } else {
      const [month, year] = paymentForm.expiryDate.split('/');
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      if (expiry < new Date()) {
        errors.expiryDate = 'Card has expired';
      }
    }

    // CVV validation (3-4 digits)
    if (!paymentForm.cvv) {
      errors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(paymentForm.cvv)) {
      errors.cvv = 'CVV must be 3-4 digits';
    }

    // Cardholder name validation
    if (!paymentForm.cardholderName.trim()) {
      errors.cardholderName = 'Cardholder name is required';
    } else if (paymentForm.cardholderName.trim().length < 2) {
      errors.cardholderName = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!paymentForm.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(paymentForm.email)) {
      errors.email = 'Invalid email format';
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Handle payment form changes
  const handlePaymentInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      if (formattedValue.replace(/\s/g, '').length > 16) return;
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
      if (formattedValue.length > 5) return;
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '');
      if (formattedValue.length > 4) return;
    } else if (field === 'cardholderName') {
      formattedValue = value.replace(/[^a-zA-Z\s]/g, '');
    }

    setPaymentForm(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error when user starts typing
    if (paymentErrors[field]) {
      setPaymentErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Process payment
  const handlePurchasePoints = async () => {
    if (!selectedPointPackage || !validatePaymentForm()) {
      return;
    }

    const selectedPackage = pointPackages.find(pkg => pkg.id === selectedPointPackage);
    if (!selectedPackage) return;

    setIsProcessingPayment(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate random payment failure (10% chance)
      if (Math.random() < 0.1) {
        throw new Error('Payment declined. Please try a different card.');
      }

      // Calculate total points including bonus
      const totalPoints = selectedPackage.points + selectedPackage.bonus;

      // Update customer points
      setCustomerPoints(prev => prev + totalPoints);

      // Add transaction record
      const newTransaction: Transaction = {
        id: `purchase-${Date.now()}`,
        type: 'earned',
        points: totalPoints,
        description: `${selectedPackage.name} Purchase`,
        date: new Date().toISOString().split('T')[0],
        category: 'Purchase',
        merchant: 'Loyalty Store',
      };

      setTransactions(prev => [newTransaction, ...prev]);

      // Reset form and close modal
      setPaymentForm({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        email: '',
      });
      setPaymentErrors({});
      setSelectedPointPackage(null);
      setShowBuyPointsModal(false);
      setIsProcessingPayment(false);

      // Show success notification
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);

    } catch (error) {
      setIsProcessingPayment(false);
      setPaymentErrors({ 
        general: error instanceof Error ? error.message : 'Payment failed. Please try again.' 
      });
    }
  };

  const filteredOffers = offers.filter(offer => {
    const matchesCategory = filterCategory === 'all' || offer.category === filterCategory;
    const matchesSearch =
      offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const ProgressRing = ({
    percentage,
    size = 280,
    strokeWidth = 24,
  }: {
    percentage: number;
    size?: number;
    strokeWidth?: number;
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Generate deterministic ID based on size to avoid hydration mismatch
    const gradientId = `progressGradient-${size}-${strokeWidth}`;

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#374151"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-2000 ease-out"
          />

          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-1 sm:mb-2 tracking-tight">
              {animatedPoints.toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wide">
              Points
            </div>
            <div className="mt-1 sm:mt-2 w-8 sm:w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
        </div>
      </div>
    );
  };

  const RewardCard = ({ offer }: { offer: Offer }) => {
    const canRedeem = customerPoints >= offer.pointsCost;
    const rarity = rarityConfig[offer.rarity || 'common'];
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <div
        className={`group relative bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-gray-600 ${rarity.glow} hover:shadow-lg flex flex-col h-full`}
      >
        {offer.featured && (
          <div className="absolute top-3 left-3 z-10">
            <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
              <HiStarSolid className="w-3 h-3" />
              Featured
            </div>
          </div>
        )}

        {offer.rarity && offer.rarity !== 'common' && (
          <div className="absolute top-3 right-3 z-10">
            <div
              className={`px-2 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${rarity.color} capitalize`}
            >
              {offer.rarity}
            </div>
          </div>
        )}

        {/* Image Section */}
        <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 relative overflow-hidden">
          {offer.imageUrl ? (
            <img
              src={offer.imageUrl}
              alt={offer.title}
              className="w-full h-full object-cover"
              onError={e => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}

          <div
            className={`absolute inset-0 flex items-center justify-center ${
              offer.imageUrl ? 'hidden' : 'flex'
            }`}
          >
            <div className="text-4xl text-white">{categoryIcons[offer.category] || <FiGift />}</div>
          </div>

          {offer.imageUrl && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          )}

          {offer.discount && (
            <div className="absolute bottom-3 left-3">
              <div className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold shadow-lg">
                -{offer.discount}%
              </div>
            </div>
          )}
        </div>

        {/* Content Section - Flex column to push button to bottom */}
        <div className="p-4 sm:p-6 flex flex-col flex-1">
          {/* Header - Always Visible */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 flex-1 mr-2">
              {offer.title}
            </h3>
            <div className="text-right flex-shrink-0">
              <div className="text-lg font-bold text-blue-400">
                {offer.pointsCost.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">points</div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            {categoryIcons[offer.category]}
            <span className="text-xs font-medium text-gray-400">{offer.category}</span>
            {offer.discount && (
              <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-xs font-bold">
                {offer.discount}% OFF
              </span>
            )}
          </div>

          {/* Mobile Accordion Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-xl mb-4 hover:bg-gray-600 transition-colors md:hidden cursor-pointer"
          >
            <span className="font-medium text-gray-200">View Details</span>
            <FiChevronRight
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isExpanded ? 'rotate-90' : ''
              }`}
            />
          </button>

          {/* Collapsible Content */}
          <div className={`space-y-4 flex-1 ${isExpanded ? 'block' : 'hidden md:block'}`}>
            <p className="text-gray-300 text-sm">{offer.description}</p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-400">Value:</span>
                <span className="font-semibold text-white ml-1">
                  ${offer.estimatedValue?.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Redeemed:</span>
                <span className="font-semibold text-white ml-1">{offer.redeemCount}</span>
              </div>
            </div>

            <div className="text-xs text-gray-400">
              Expires:{' '}
              {new Date(offer.expiryDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>

          {/* Button - Always at bottom */}
          <button
            onClick={() => handleRedeemOffer(offer)}
            disabled={!canRedeem || isLoading}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 mt-4 ${
              canRedeem
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading && selectedOffer === offer.id ? (
              <div className="flex items-center justify-center gap-2">
                <FiRefreshCw className="w-4 h-4 animate-spin" />
                Processing...
              </div>
            ) : canRedeem ? (
              'Redeem Now'
            ) : (
              `Need ${(offer.pointsCost - customerPoints).toLocaleString()} more points`
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 scrollable" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Professional Success Toast */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 bg-gray-800 border border-green-600 rounded-xl shadow-2xl p-5 transform transition-all duration-500 animate-in slide-in-from-right max-w-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <FiCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-lg mb-1">
                {selectedOffer ? 'Redemption Successful!' : 'Purchase Complete!'}
            </div>
              <div className="text-sm text-gray-300 mb-2">
                {selectedOffer 
                  ? 'Your reward has been activated and is ready for use'
                  : 'Points have been added to your account successfully'
                }
          </div>
              <div className="text-xs text-green-300 bg-green-900/30 px-2 py-1 rounded-full inline-block">
                {selectedOffer ? '✓ QR Code Generated' : '✓ Points Added'}
        </div>
              </div>
              </div>
            </div>
      )}

      {/* Professional Responsive Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Left Section - Mobile Hamburger & Logo */}
            <div className="flex items-center gap-3 sm:gap-4 justify-start">
              {/* Mobile Hamburger Menu */}
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="md:hidden w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all duration-200 cursor-pointer border border-gray-600"
              >
                <FiMenu className="w-5 h-5 text-white" />
              </button>
              
              {/* Logo */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <MdDiamond className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
              
              {/* Logo Text - Hidden on mobile */}
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl font-bold text-white">Loyalty Rewards</h1>
                <p className="text-xs sm:text-sm text-gray-300 font-medium">Premium Member Portal</p>
          </div>
        </div>

            {/* Center Navigation - Desktop Only - Perfectly Centered */}
            <div className="flex justify-center">
              <nav className="hidden md:flex items-center gap-2 bg-gray-700/50 rounded-xl p-1 border border-gray-600">
              {[
                {
                  key: 'dashboard',
                  label: 'Dashboard',
                  icon: <FiTrendingUp className="w-4 h-4" />,
                },
                {
                  key: 'rewards',
                  label: 'Rewards',
                  icon: <FiGift className="w-4 h-4" />,
                },
                {
                  key: 'analytics',
                  label: 'Analytics',
                  icon: <HiTrendingUpSolid className="w-4 h-4" />,
                },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-gray-600'
                  }`}
                >
                  {tab.icon}
                    <span className="hidden lg:inline">{tab.label}</span>
                </button>
              ))}
              </nav>
            </div>

            {/* Right Section - Account Status & Profile */}
            <div className="flex items-center gap-3 sm:gap-4 justify-end">
              {/* Account Status */}
              <div className="hidden sm:flex items-center gap-2 bg-gray-700 px-3 sm:px-4 py-2 rounded-xl border border-gray-600">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-medium text-gray-200">Active</span>
          </div>

              {/* Profile Icon */}
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-10 h-10 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg'
                    : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-blue-500 hover:to-purple-500'
                }`}
              >
                <FiUser className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
              </header>

        {/* Mobile Sidebar */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileSidebarOpen(false)}
            ></div>
            
            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-gray-800 border-r border-gray-700 shadow-2xl transform transition-transform duration-300 ease-out scrollable ${
              isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
              <div className="flex flex-col h-full">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <MdDiamond className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Loyalty Rewards</h2>
                      <p className="text-xs text-gray-300">Premium Portal</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <FiX className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Navigation Menu */}
                <div className="flex-1 p-6">
                  <nav className="space-y-2">
                    {[
                      {
                        key: 'dashboard',
                        label: 'Dashboard',
                        icon: <FiTrendingUp className="w-5 h-5" />,
                        description: 'Overview & stats'
                      },
                      {
                        key: 'rewards',
                        label: 'Rewards',
                        icon: <FiGift className="w-5 h-5" />,
                        description: 'Browse & redeem'
                      },
                      {
                        key: 'analytics',
                        label: 'Analytics',
                        icon: <HiTrendingUpSolid className="w-5 h-5" />,
                        description: 'Points history'
                      },
                    ].map(item => (
                      <button
                        key={item.key}
                        onClick={() => {
                          setActiveTab(item.key as any);
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                          activeTab === item.key
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                        }`}
                      >
                        <div className={`flex-shrink-0 ${
                          activeTab === item.key ? 'text-white' : 'text-gray-400'
                        }`}>
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold ${
                            activeTab === item.key ? 'text-white' : 'text-gray-200'
                          }`}>
                            {item.label}
                          </div>
                          <div className={`text-xs ${
                            activeTab === item.key ? 'text-blue-100' : 'text-gray-400'
                          }`}>
                            {item.description}
                          </div>
                        </div>
                        {activeTab === item.key && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </button>
                    ))}
        </nav>
                </div>

                {/* Sidebar Footer */}
                <div className="p-6 border-t border-gray-700">
                  <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-xl">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-200">Account Active</span>
                  </div>
                  <div className="mt-3 text-xs text-gray-400 text-center">
                    Version 2.1.0 • Premium Member
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Mobile-First Hero Section */}
            <div className="relative bg-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-gray-700 mx-2 sm:mx-0">
              {/* Background Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-blue-900/20 to-purple-900/20"></div>
              <div className="absolute top-0 right-0 w-40 sm:w-96 h-40 sm:h-96 bg-gradient-to-bl from-blue-900/30 to-transparent rounded-full blur-2xl sm:blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 sm:w-72 h-32 sm:h-72 bg-gradient-to-tr from-purple-900/20 to-transparent rounded-full blur-xl sm:blur-2xl"></div>

              <div className="relative z-10 p-4 sm:p-6 lg:p-12">
                {/* Mobile: Stack Vertically, Desktop: Side by Side */}
                <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
                  {/* Content Section - Mobile Full Width */}
                  <div className="lg:col-span-7 space-y-4 sm:space-y-6">
                    {/* Tier Badge - Mobile Optimized */}
                    <div className="bg-gray-700 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-600">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div
                          className={`p-3 sm:p-4 rounded-xl bg-gradient-to-r ${currentTier.gradient} shadow-lg flex-shrink-0`}
                        >
                          <div className="text-white text-lg sm:text-xl">{currentTier.icon}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white truncate">
                            {currentTier.name} Member
                          </h2>
                          <p className="text-sm sm:text-base text-gray-300 font-medium">
                            {currentTier.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Ring - Mobile Centered */}
                    <div className="lg:hidden flex justify-center py-4">
                      <div className="relative">
                        <ProgressRing percentage={pointsPercentage} size={200} strokeWidth={16} />
                      </div>
                    </div>

                    {/* Progress to Next Tier - Mobile Full Width */}
                    {nextTier && (
                      <div className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-600 shadow-sm">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <span className="text-base sm:text-lg font-bold text-white">
                            Progress to {nextTier.name}
                          </span>
                          <span className="text-xl sm:text-2xl font-black text-blue-400">
                            {Math.round(
                              ((customerPoints - currentTier.minPoints) /
                                (nextTier.minPoints - currentTier.minPoints)) *
                                100
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-3 sm:h-4 mb-3 sm:mb-4 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 h-full rounded-full transition-all duration-2000 relative"
                            style={{
                              width: `${Math.min(
                                ((customerPoints - currentTier.minPoints) /
                                  (nextTier.minPoints - currentTier.minPoints)) *
                                  100,
                                100
                              )}%`,
                            }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-gray-200 font-semibold">
                          <span className="text-blue-400 font-black">
                            {(nextTier.minPoints - customerPoints).toLocaleString()}
                          </span>{' '}
                          points to unlock {nextTier.name}
                        </p>
                      </div>
                    )}

                    {/* Benefits Grid - Mobile 1 Column, Tablet 2 Columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {currentTier.benefits.slice(0, 4).map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 bg-gray-700/40 rounded-xl p-3 sm:p-4 border border-gray-600"
                        >
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                            <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                          </div>
                          <span className="font-semibold text-gray-200 text-sm sm:text-base">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Progress Ring - Desktop Only */}
                  <div className="hidden lg:flex lg:col-span-5 justify-center">
                    <div className="relative">
                      <ProgressRing percentage={pointsPercentage} size={280} strokeWidth={24} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards - Fully Mobile Responsive */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 px-2 sm:px-0">
              {/* Total Earned */}
              <div className="group relative bg-gray-800 rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-gray-700 hover:shadow-2xl hover:border-blue-600 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent rounded-xl lg:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
                    <div className="p-2 sm:p-3 lg:p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl lg:rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <HiTrendingUpSolid className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-green-400 text-xs sm:text-sm font-bold bg-green-900/30 px-2 py-1 rounded-full">
                      <FiArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">+12%</span>
                      <span className="sm:hidden flex items-center gap-1">
                        <FiArrowUp className="w-3 h-3" />
                        <span>12%</span>
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="text-lg sm:text-2xl lg:text-4xl font-black text-white tracking-tight">
                      {analytics.totalEarned >= 1000
                        ? `${(analytics.totalEarned / 1000).toFixed(1)}k`
                        : analytics.totalEarned.toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-gray-300 uppercase tracking-wider">
                      <span className="hidden sm:inline">Total Earned</span>
                      <span className="sm:hidden">Earned</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-1.5 sm:h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-1000 relative"
                        style={{ width: '75%' }}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Points Redeemed */}
              <div className="group relative bg-gray-800 rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-gray-700 hover:shadow-2xl hover:border-purple-600 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent rounded-xl lg:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
                    <div className="p-2 sm:p-3 lg:p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl lg:rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <HiGiftSolid className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <div className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                      <span className="hidden sm:inline">87% efficiency</span>
                      <span className="sm:hidden">87%</span>
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="text-lg sm:text-2xl lg:text-4xl font-black text-white tracking-tight">
                      {analytics.totalRedeemed >= 1000
                        ? `${(analytics.totalRedeemed / 1000).toFixed(1)}k`
                        : analytics.totalRedeemed.toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-gray-300 uppercase tracking-wider">
                      <span className="hidden sm:inline">Points Redeemed</span>
                      <span className="sm:hidden">Redeemed</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-1.5 sm:h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full transition-all duration-1000 relative"
                        style={{ width: '87%' }}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day Streak */}
              <div className="group relative bg-gray-800 rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-gray-700 hover:shadow-2xl hover:border-green-600 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-transparent rounded-xl lg:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
                    <div className="p-2 sm:p-3 lg:p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl lg:rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <FiTarget className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <div className="text-amber-400 animate-pulse">
                      <HiLightningBolt className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="text-lg sm:text-2xl lg:text-4xl font-black text-white tracking-tight">
                      {analytics.streak}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-gray-300 uppercase tracking-wider">
                      <span className="hidden sm:inline">Day Streak</span>
                      <span className="sm:hidden">Streak</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-1.5 sm:h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-1000 relative"
                        style={{ width: '47%' }}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Value Saved */}
              <div className="group relative bg-gray-800 rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-gray-700 hover:shadow-2xl hover:border-amber-600 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-transparent rounded-xl lg:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
                    <div className="p-2 sm:p-3 lg:p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl lg:rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <HiCash className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <div className="text-blue-400">
                      <FiTrendingUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="text-lg sm:text-2xl lg:text-4xl font-black text-white tracking-tight">
                      ${(analytics.totalRedeemed * 0.05).toFixed(0)}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-gray-300 uppercase tracking-wider">
                      <span className="hidden sm:inline">Value Saved</span>
                      <span className="sm:hidden">Saved</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-1.5 sm:h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-1000 relative"
                        style={{ width: '67%' }}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-700 overflow-hidden mx-2 sm:mx-0">
              <div className="bg-gradient-to-r from-gray-700 to-blue-900/30 p-4 sm:p-6 lg:p-8 border-b border-gray-600">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-1 sm:mb-2">
                      Featured Rewards
                    </h3>
                    <p className="text-sm sm:text-base text-gray-300 font-medium">
                      Exclusive offers curated just for you
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('rewards')}
                    className="group flex items-center justify-center sm:justify-start gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl self-start sm:self-auto cursor-pointer"
                  >
                    <span>View All</span>
                    <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {offers
                    .filter(offer => offer.featured)
                    .map(offer => (
                      <RewardCard key={offer.id} offer={offer} />
                    ))}
                </div>
              </div>
            </div>

            {/* Recent Activity - Enhanced */}
            <div className="bg-gray-800 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-700 overflow-hidden mx-2 sm:mx-0">
              <div className="bg-gradient-to-r from-gray-700 to-purple-900/30 p-4 sm:p-6 lg:p-8 border-b border-gray-600">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-1 sm:mb-2">
                  Recent Activity
                </h3>
                <p className="text-sm sm:text-base text-gray-300 font-medium">
                  Your latest points transactions
                </p>
              </div>

              <div className="p-4 sm:p-6 lg:p-8">
                <div className="space-y-3 sm:space-y-4">
                  {transactions.slice(0, 4).map(transaction => (
                    <div
                      key={transaction.id}
                      onClick={() => handleTransactionClick(transaction)}
                      className={`group flex items-center justify-between p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl border border-gray-700 hover:border-blue-600 hover:shadow-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-blue-900/30 cursor-pointer ${
                        transaction.type === 'redeemed' ? 'hover:border-green-600 hover:to-green-900/30' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 flex-1 min-w-0">
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0 ${
                            transaction.type === 'earned'
                              ? 'bg-gradient-to-br from-green-800 to-green-900 text-green-400'
                              : transaction.type === 'bonus'
                                ? 'bg-gradient-to-br from-blue-800 to-blue-900 text-blue-400'
                                : 'bg-gradient-to-br from-red-800 to-red-900 text-red-400'
                          }`}
                        >
                          {transaction.type === 'earned' ? (
                            <FiTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                          ) : transaction.type === 'bonus' ? (
                            <HiSparkles className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                          ) : (
                            <FiGift className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold sm:font-black text-sm sm:text-lg lg:text-xl text-white group-hover:text-blue-400 transition-colors truncate">
                            {transaction.description}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">
                            <div className="flex items-center gap-1 sm:gap-2 font-medium">
                              <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">
                                {new Date(transaction.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            {transaction.merchant && (
                              <>
                                <span className="w-1 h-1 bg-gray-500 rounded-full hidden sm:block"></span>
                                <span className="font-bold text-gray-300 truncate">
                                  {transaction.merchant}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <div
                          className={`text-lg sm:text-2xl lg:text-3xl font-black tracking-tight ${
                            transaction.points > 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {transaction.points > 0 ? '+' : ''}
                          {Math.abs(transaction.points) >= 1000
                            ? `${(transaction.points / 1000).toFixed(1)}k`
                            : transaction.points.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-gray-400 uppercase tracking-wide mt-1 bg-gray-700 px-2 py-1 rounded-full text-center">
                          {transaction.type === 'earned'
                            ? 'EARNED'
                            : transaction.type === 'bonus'
                              ? 'BONUS'
                              : 'REDEEMED'}
                          {transaction.type === 'redeemed' && (
                            <div className="w-3 h-3 bg-green-500 rounded-sm flex items-center justify-center ml-1">
                              <div className="w-2 h-2 bg-white rounded-xs"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            {/* Filters and Search - Professional Single Row */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-4 sm:p-6 mx-2 sm:mx-0">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 min-w-0">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search rewards..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base placeholder-gray-400 cursor-pointer"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative w-full sm:w-48">
                  <select
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value)}
                    className="w-full appearance-none bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base font-medium cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {Object.keys(categoryIcons).map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiChevronRight className="w-4 h-4 text-gray-400 transform rotate-90" />
                  </div>
                </div>


              </div>
            </div>

            {/* Rewards Grid */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-2 sm:px-0">
              {filteredOffers.map(offer => (
                <RewardCard key={offer.id} offer={offer} />
              ))}
            </div>

            {filteredOffers.length === 0 && (
              <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-12 text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiSearch className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No rewards found</h3>
                <p className="text-gray-300">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-white">Earning Rate</h4>
                  <div className="p-2 bg-green-900/30 rounded-lg">
                    <FiTrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{analytics.averageMonthly}</div>
                <div className="text-sm text-gray-300">Points per month</div>
                <div className="mt-3 flex items-center text-sm text-green-400">
                  <FiArrowUp className="w-4 h-4 mr-1" />
                  12% from last month
                </div>
              </div>

              <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-white">Redemption Efficiency</h4>
                  <div className="p-2 bg-blue-900/30 rounded-lg">
                    <FiTarget className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{analytics.efficiency}%</div>
                <div className="text-sm text-gray-300 mb-3">Points utilized</div>
                <div className="w-full bg-gray-600 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(analytics.efficiency, 100)}%` }}
                  />
                </div>
              </div>

              <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-white">Streak Bonus</h4>
                  <div className="p-2 bg-amber-900/30 rounded-lg">
                    <HiLightningBolt className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{analytics.streak}</div>
                <div className="text-sm text-gray-300">Days active</div>
                <div className="mt-3 text-sm text-amber-400 font-medium">
                  Next bonus in {30 - (analytics.streak % 30)} days
                </div>
              </div>

              <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-white">Next Milestone</h4>
                  <div className="p-2 bg-purple-900/30 rounded-lg">
                    <FiAward className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {analytics.nextMilestone.toLocaleString()}
                </div>
                <div className="text-sm text-gray-300">Points target</div>
                <div className="mt-3 text-sm text-purple-400 font-medium">
                  {analytics.nextMilestone - customerPoints} points to go
                </div>
              </div>
            </div>

            {/* Detailed Analytics */}
            {/* Points History - Mobile Optimized */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-4 sm:p-6 mx-2 sm:mx-0">
              <h3 className="text-xl font-bold text-white mb-6">Points History</h3>
              <div className="space-y-3 sm:space-y-6">
                {transactions.map(transaction => (
                  <div
                    key={transaction.id}
                    onClick={() => handleTransactionClick(transaction)}
                    className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-gray-700 hover:border-blue-500/50 hover:bg-gray-700/30 transition-all duration-300 cursor-pointer ${
                      transaction.type === 'redeemed' ? 'hover:border-green-500/50 hover:bg-green-900/20' : ''
                    }`}
                  >
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ${
                        transaction.type === 'earned'
                          ? 'bg-gradient-to-br from-green-800 to-green-900 text-green-400'
                          : transaction.type === 'bonus'
                            ? 'bg-gradient-to-br from-blue-800 to-blue-900 text-blue-400'
                            : transaction.type === 'expired'
                              ? 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-400'
                              : 'bg-gradient-to-br from-red-800 to-red-900 text-red-400'
                      }`}
                    >
                      {transaction.type === 'earned' ? (
                        <FiTrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : transaction.type === 'bonus' ? (
                        <HiSparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : transaction.type === 'expired' ? (
                        <FiClock className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <FiGift className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold sm:font-bold text-white text-sm sm:text-lg truncate">
                        {transaction.description}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-gray-400 mt-1">
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        {transaction.category && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className="text-gray-300 font-medium">
                              {transaction.category}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div
                        className={`text-lg sm:text-xl font-bold ${
                          transaction.points > 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {transaction.points > 0 ? '+' : ''}
                        {transaction.points.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wide mt-1 capitalize">
                        {transaction.type}
                        {transaction.type === 'redeemed' && (
                          <div className="w-3 h-3 bg-green-500 rounded-sm flex items-center justify-center ml-1">
                            <div className="w-2 h-2 bg-white rounded-xs"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab - Redesigned for Visual Excellence */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Hero Profile Section */}
            <div className="relative bg-gradient-to-br from-gray-800 via-blue-900/20 to-purple-900/20 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden mx-2 sm:mx-0">
              {/* Background Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-900/30 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-900/20 to-transparent rounded-full blur-2xl"></div>

              <div className="relative z-10 p-6 sm:p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
                  {/* Profile Avatar */}
                  <div className="relative group">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-1 shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500">
                      <div className="w-full h-full bg-gray-800 rounded-3xl flex items-center justify-center relative overflow-hidden">
                        <FiUser className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-white" />
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </div>
                    {/* Status Indicator */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-800 shadow-lg animate-pulse">
                      <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="text-center lg:text-left flex-1">
                    <div className="mb-4">
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 tracking-tight">
                        Alex Johnson
                      </h2>
                      <p className="text-gray-300 text-sm sm:text-base font-medium">
                        Premium Member since January 2024
                      </p>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                      <div
                        className={`px-4 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r ${currentTier.gradient} text-white shadow-lg border border-white/10`}
                      >
                        {currentTier.name} Status
                      </div>
                      <div className="px-4 py-2 bg-green-900/40 text-green-400 rounded-2xl text-sm font-bold border border-green-500/30 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          Verified
                        </div>
                      </div>
                      <div className="px-4 py-2 bg-blue-900/40 text-blue-400 rounded-2xl text-sm font-bold border border-blue-500/30 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                          <HiLightningBolt className="w-4 h-4" />
                          Active
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-0">
                      <div className="group bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 min-w-0">
                        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white mb-1 group-hover:text-blue-400 transition-colors leading-tight truncate">
                          {customerPoints.toLocaleString()}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-400 font-semibold uppercase tracking-wider leading-tight">
                          <span className="hidden sm:inline">Current Points</span>
                          <span className="sm:hidden">Current</span>
                        </div>
                      </div>
                      <div className="group bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 min-w-0">
                        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white mb-1 group-hover:text-purple-400 transition-colors leading-tight truncate">
                          {analytics.totalEarned >= 1000 
                            ? `${Math.floor(analytics.totalEarned / 1000)}k` 
                            : analytics.totalEarned.toLocaleString()}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-400 font-semibold uppercase tracking-wider leading-tight">
                          <span className="hidden sm:inline">Lifetime Earned</span>
                          <span className="sm:hidden">Lifetime</span>
                        </div>
                      </div>
                      <div className="group bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 min-w-0">
                        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white mb-1 group-hover:text-green-400 transition-colors leading-tight truncate">
                          {currentTier.multiplier}x
                        </div>
                        <div className="text-xs sm:text-sm text-gray-400 font-semibold uppercase tracking-wider leading-tight">
                          Multiplier
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tier Progress & Benefits */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tier Progress */}
              <div className="bg-gray-800 rounded-3xl shadow-xl border border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-700 to-blue-900/30 p-6 border-b border-gray-600">
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Tier Progress</h3>
                  <p className="text-gray-300 font-medium">Unlock exclusive benefits and rewards</p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Current Tier */}
                  <div className="bg-gradient-to-r from-gray-700/50 to-blue-900/20 rounded-2xl p-4 border border-gray-600">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-r ${currentTier.gradient} shadow-lg`}
                      >
                        {currentTier.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">{currentTier.name}</h4>
                        <p className="text-sm text-gray-300">{currentTier.description}</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000 relative"
                        style={{ width: `${pointsPercentage}%` }}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      {customerPoints.toLocaleString()} / {maxPoints.toLocaleString()} points
                    </p>
                  </div>

                  {/* Next Tier Preview */}
                  {nextTier && (
                    <div className="bg-gray-700/30 rounded-2xl p-4 border border-gray-600">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 rounded-xl bg-gray-600 opacity-50">{nextTier.icon}</div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-300">{nextTier.name}</h4>
                          <p className="text-sm text-gray-400">{nextTier.description}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        <span className="text-blue-400 font-bold">
                          {(nextTier.minPoints - customerPoints).toLocaleString()}
                        </span>{' '}
                        points to unlock
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Current Benefits */}
              <div className="bg-gray-800 rounded-3xl shadow-xl border border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-700 to-purple-900/30 p-6 border-b border-gray-600">
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Your Benefits</h3>
                  <p className="text-gray-300 font-medium">Active perks and privileges</p>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {currentTier.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="group flex items-center gap-4 p-4 bg-gray-700/30 rounded-2xl border border-gray-600 hover:border-green-500/50 hover:bg-gray-700/50 transition-all duration-300"
                      >
                        <div className="w-10 h-10 bg-green-900/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <FiCheck className="w-5 h-5 text-green-400" />
                        </div>
                        <span className="font-semibold text-white text-sm sm:text-base group-hover:text-green-400 transition-colors">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>



            {/* Activity Summary */}
            <div className="bg-gray-800 rounded-3xl shadow-xl border border-gray-700 overflow-hidden mx-2 sm:mx-0">
              <div className="bg-gradient-to-r from-gray-700 to-pink-900/30 p-6 border-b border-gray-600">
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Recent Activity</h3>
                <p className="text-gray-300 font-medium">Your latest loyalty actions</p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {transactions.slice(0, 3).map(transaction => (
                    <div
                      key={transaction.id}
                      onClick={() => handleTransactionClick(transaction)}
                      className={`flex items-center gap-4 p-4 bg-gray-700/30 rounded-2xl border border-gray-600 hover:border-blue-500/50 hover:bg-gray-700/50 transition-all duration-300 cursor-pointer ${
                        transaction.type === 'redeemed' ? 'hover:border-green-500/50 hover:bg-green-900/20' : ''
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                          transaction.type === 'earned'
                            ? 'bg-gradient-to-br from-green-800 to-green-900 text-green-400'
                            : transaction.type === 'bonus'
                              ? 'bg-gradient-to-br from-blue-800 to-blue-900 text-blue-400'
                              : 'bg-gradient-to-br from-red-800 to-red-900 text-red-400'
                        }`}
                      >
                        {transaction.type === 'earned' ? (
                          <FiTrendingUp className="w-6 h-6" />
                        ) : transaction.type === 'bonus' ? (
                          <HiSparkles className="w-6 h-6" />
                        ) : (
                          <FiGift className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(transaction.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-lg font-bold ${
                            transaction.points > 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {transaction.points > 0 ? '+' : ''}
                          {transaction.points.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 uppercase tracking-wide">
                          {transaction.type}
                          {transaction.type === 'redeemed' && (
                            <div className="w-3 h-3 bg-green-500 rounded-sm flex items-center justify-center ml-1">
                              <div className="w-2 h-2 bg-white rounded-xs"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Redeem Confirmation Modal */}
        {showRedeemConfirmModal && confirmRedeemOffer && (
          <div 
            className="fixed inset-0 bg-gray-900/90 backdrop-blur-lg flex items-center justify-center p-3 sm:p-4 z-[65]"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowRedeemConfirmModal(false);
                setConfirmRedeemOffer(null);
              }
            }}
          >
            <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[95vh] overflow-y-auto scrollable border border-gray-700">
              <div className="p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center justify-end mb-3 sm:mb-4">
                  <button
                    onClick={() => {
                      setShowRedeemConfirmModal(false);
                      setConfirmRedeemOffer(null);
                    }}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <FiX className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </button>
                  </div>
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                    <FiGift className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 px-2">Confirm Redemption</h3>
                  <p className="text-gray-300 text-sm sm:text-base px-2">
                    Are you sure you want to redeem this reward?
                  </p>
                </div>

                {/* Offer Details */}
                <div className="bg-gray-700/50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-600">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                      {categoryIcons[confirmRedeemOffer.category] || <FiGift className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white mb-1 text-sm sm:text-base leading-tight">{confirmRedeemOffer.title}</h4>
                      <p className="text-gray-300 text-xs sm:text-sm mb-2 line-clamp-2 leading-relaxed">{confirmRedeemOffer.description}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm">
                        <span className="px-2 py-1 bg-gray-600 text-gray-200 rounded-lg font-medium inline-block w-fit">
                          {confirmRedeemOffer.category}
                        </span>
                        {confirmRedeemOffer.estimatedValue && (
                          <span className="text-green-400 font-semibold">
                            ${confirmRedeemOffer.estimatedValue.toFixed(2)} value
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Points Summary */}
                <div className="bg-gray-700/30 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-600">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium text-sm sm:text-base">Your Current Points:</span>
                      <span className="text-lg sm:text-2xl font-bold text-blue-400">
                        {customerPoints.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium text-sm sm:text-base">Redemption Cost:</span>
                      <span className="text-lg sm:text-2xl font-bold text-red-400">
                        -{confirmRedeemOffer.pointsCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t border-gray-600 pt-2 sm:pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-bold text-sm sm:text-base">Points After Redemption:</span>
                        <span className="text-lg sm:text-2xl font-bold text-green-400">
                          {(customerPoints - confirmRedeemOffer.pointsCost).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warning for Low Points */}
                {(customerPoints - confirmRedeemOffer.pointsCost) < 1000 && (
                  <div className="bg-amber-900/30 border border-amber-600/50 rounded-lg p-3 mb-4 sm:mb-6">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <FiTarget className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-amber-300 text-xs sm:text-sm leading-relaxed">
                        This redemption will leave you with fewer than 1,000 points. Consider purchasing more points to continue earning rewards.
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setShowRedeemConfirmModal(false);
                      setConfirmRedeemOffer(null);
                    }}
                    className="flex-1 py-2.5 sm:py-3 px-4 sm:px-6 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl font-semibold transition-colors cursor-pointer border border-gray-600 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={processRedemption}
                    className="flex-1 py-2.5 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all cursor-pointer shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    <span className="hidden sm:inline">Confirm Redemption</span>
                    <span className="sm:hidden">Confirm</span>
                  </button>
                </div>

                {/* Additional Info */}
                <div className="mt-3 sm:mt-4 text-center">
                  <p className="text-xs sm:text-sm text-gray-400 px-2 leading-relaxed">
                    You'll receive a QR code after redemption that can be used at participating locations
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buy Points Modal */}
        {showBuyPointsModal && (
          <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-lg flex items-center justify-center p-3 sm:p-4 z-[60]">
            <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto scrollable border border-gray-700">
              <div className="p-4 sm:p-6 lg:p-8">
                                {/* Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <FiDollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl sm:text-2xl font-bold text-white truncate">Buy Points</h2>
                      <p className="text-gray-300 text-xs sm:text-sm">Choose a package and complete your purchase</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowBuyPointsModal(false);
                      setSelectedPointPackage(null);
                      setPaymentForm({
                        cardNumber: '',
                        expiryDate: '',
                        cvv: '',
                        cardholderName: '',
                        email: '',
                      });
                      setPaymentErrors({});
                    }}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ml-3"
                  >
                    <FiX className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  {/* Point Packages */}
                    <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Select a Package</h3>
                    <div className="space-y-3">
                      {pointPackages.map((pkg) => (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPointPackage(pkg.id)}
                          className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            selectedPointPackage === pkg.id
                              ? 'border-blue-500 bg-blue-900/20'
                              : 'border-gray-600 bg-gray-700/30 hover:border-gray-500'
                          } ${pkg.popular ? 'ring-2 ring-amber-500/50' : ''}`}
                        >
                          {pkg.popular && (
                            <div className="absolute -top-2 left-4">
                              <span className="bg-amber-500 text-black px-2 py-1 rounded-lg text-xs font-bold">
                                MOST POPULAR
                              </span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-white">{pkg.name}</h4>
                                {selectedPointPackage === pkg.id && (
                                  <FiCheck className="w-4 h-4 text-blue-400" />
                                )}
                              </div>
                              <p className="text-gray-300 text-sm mb-2">{pkg.description}</p>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-blue-400 font-semibold">
                                  {pkg.points.toLocaleString()} points
                                </span>
                                {pkg.bonus > 0 && (
                                  <span className="text-green-400 font-semibold">
                                    + {pkg.bonus.toLocaleString()} bonus
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-2xl font-bold text-white">${pkg.price}</div>
                              {pkg.bonus > 0 && (
                                <div className="text-xs text-gray-400">
                                  {((pkg.points + pkg.bonus) / pkg.price).toFixed(0)} pts/$
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Form */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Payment Details</h3>
                    <div className="space-y-4">
                      {/* General Error */}
                      {paymentErrors.general && (
                        <div className="p-3 bg-red-900/30 border border-red-600/50 rounded-lg">
                          <p className="text-red-300 text-sm">{paymentErrors.general}</p>
                        </div>
                      )}

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={paymentForm.email}
                          onChange={(e) => handlePaymentInputChange('email', e.target.value)}
                          className={`w-full p-3 rounded-lg border bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            paymentErrors.email ? 'border-red-500' : 'border-gray-600'
                          }`}
                          placeholder="your@email.com"
                        />
                        {paymentErrors.email && (
                          <p className="text-red-400 text-xs mt-1">{paymentErrors.email}</p>
                        )}
                      </div>

                      {/* Cardholder Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={paymentForm.cardholderName}
                          onChange={(e) => handlePaymentInputChange('cardholderName', e.target.value)}
                          className={`w-full p-3 rounded-lg border bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            paymentErrors.cardholderName ? 'border-red-500' : 'border-gray-600'
                          }`}
                          placeholder="John Doe"
                        />
                        {paymentErrors.cardholderName && (
                          <p className="text-red-400 text-xs mt-1">{paymentErrors.cardholderName}</p>
                        )}
                      </div>

                      {/* Card Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={paymentForm.cardNumber}
                            onChange={(e) => handlePaymentInputChange('cardNumber', e.target.value)}
                            className={`w-full p-3 rounded-lg border bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              paymentErrors.cardNumber ? 'border-red-500' : 'border-gray-600'
                            }`}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                          <FiCreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                        {paymentErrors.cardNumber && (
                          <p className="text-red-400 text-xs mt-1">{paymentErrors.cardNumber}</p>
                        )}
                      </div>

                      {/* Expiry Date and CVV */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            value={paymentForm.expiryDate}
                            onChange={(e) => handlePaymentInputChange('expiryDate', e.target.value)}
                            className={`w-full p-3 rounded-lg border bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              paymentErrors.expiryDate ? 'border-red-500' : 'border-gray-600'
                            }`}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                          {paymentErrors.expiryDate && (
                            <p className="text-red-400 text-xs mt-1">{paymentErrors.expiryDate}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={paymentForm.cvv}
                            onChange={(e) => handlePaymentInputChange('cvv', e.target.value)}
                            className={`w-full p-3 rounded-lg border bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              paymentErrors.cvv ? 'border-red-500' : 'border-gray-600'
                            }`}
                            placeholder="123"
                            maxLength={4}
                          />
                          {paymentErrors.cvv && (
                            <p className="text-red-400 text-xs mt-1">{paymentErrors.cvv}</p>
                          )}
                        </div>
                      </div>

                      {/* Security Notice */}
                      <div className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                        <FiShield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-gray-300 text-sm">
                            Your payment information is secure and encrypted. We use industry-standard security measures to protect your data.
                          </p>
                        </div>
                      </div>

                      {/* Purchase Summary */}
                      {selectedPointPackage && (
                        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                          <h4 className="font-semibold text-white mb-2">Purchase Summary</h4>
                          {(() => {
                            const pkg = pointPackages.find(p => p.id === selectedPointPackage);
                            if (!pkg) return null;
                            return (
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between text-gray-300">
                                  <span>{pkg.name}</span>
                                  <span>${pkg.price}</span>
                                </div>
                                <div className="flex justify-between text-blue-400">
                                  <span>Base Points</span>
                                  <span>{pkg.points.toLocaleString()}</span>
                                </div>
                                {pkg.bonus > 0 && (
                                  <div className="flex justify-between text-green-400">
                                    <span>Bonus Points</span>
                                    <span>+{pkg.bonus.toLocaleString()}</span>
                                  </div>
                                )}
                                <div className="border-t border-gray-600 pt-2 mt-2">
                                  <div className="flex justify-between text-white font-semibold">
                                    <span>Total Points</span>
                                    <span>{(pkg.points + pkg.bonus).toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {/* Purchase Button */}
                      <button
                        onClick={handlePurchasePoints}
                        disabled={!selectedPointPackage || isProcessingPayment}
                        className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                          selectedPointPackage && !isProcessingPayment
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl cursor-pointer'
                            : 'bg-gray-600 cursor-not-allowed'
                        }`}
                      >
                        {isProcessingPayment ? (
                          <div className="flex items-center justify-center gap-2">
                            <FiRefreshCw className="w-4 h-4 animate-spin" />
                            Processing Payment...
                          </div>
                        ) : selectedPointPackage ? (
                          `Purchase ${pointPackages.find(p => p.id === selectedPointPackage)?.name || 'Package'}`
                        ) : (
                          'Select a Package'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

                {/* Loading Overlay for Redemption Process */}
        {showLoadingOverlay && (
          <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-lg flex items-center justify-center p-3 sm:p-4 z-[60]">
            <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700 max-w-sm w-full">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                  <FiRefreshCw className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-spin" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Processing Redemption</h3>
                <p className="text-gray-300 text-sm mb-3 sm:mb-4 px-2 leading-relaxed">
                  Generating your QR code and activating your reward...
                </p>
                  <div className="flex justify-center">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile-Responsive QR Code Modal - Dark Theme */}
        {selectedOffer && (
          <div 
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-lg flex items-center justify-center p-3 sm:p-4 z-[55]"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedOffer(null);
                setShowLoadingOverlay(false);
              }
            }}
          >
            <div className="bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto scrollable transform transition-all border border-gray-700">
              <div className="p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                    <FiCheck className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                    Redemption Successful
                  </h3>
                  <p className="text-gray-300 text-base sm:text-lg px-2">
                    {offers.find(o => o.id === selectedOffer)?.title}
                  </p>
                </div>

                {/* QR Code Section */}
                <div className="bg-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 border border-gray-600">
                  <div className="text-center mb-3 sm:mb-4">
                    <h4 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
                      Scan to Redeem
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-300 px-2">
                      Present this code at any participating location
                    </p>
                  </div>
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className="bg-white p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl shadow-inner border border-gray-300">
                      <canvas ref={canvasRef} className="rounded-md sm:rounded-lg max-w-full h-auto" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 font-mono">
                      ID: RDM-{Date.now().toString().slice(-8)}
                    </p>
                  </div>
                </div>

                {/* Validity Info */}
                <div className="bg-blue-900/30 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-blue-700/50 backdrop-blur-sm">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-800/50 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                      <FiClock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-blue-200 mb-1 text-sm sm:text-base">
                        Validity Period
                      </p>
                      <p className="text-xs sm:text-sm text-blue-300 leading-relaxed">
                        Valid until {new Date(
                          offers.find(o => o.id === selectedOffer)?.expiryDate || ''
                        ).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-blue-400 mt-1 sm:mt-2 leading-relaxed">
                        This QR code contains encrypted redemption data for secure processing
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-amber-900/30 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-amber-700/50 backdrop-blur-sm">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-amber-800/50 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                      <FiTarget className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-amber-200 mb-1 sm:mb-2 text-sm sm:text-base">
                        How to Redeem
                      </p>
                      <ul className="text-xs sm:text-sm text-amber-300 space-y-0.5 sm:space-y-1 leading-relaxed">
                        <li>• Visit any participating store or location</li>
                        <li>• Show this QR code to the cashier</li>
                        <li>• Wait for confirmation and enjoy your reward</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={() => {
                      setSelectedOffer(null);
                      setShowLoadingOverlay(false);
                    }}
                    className="flex-1 py-2.5 sm:py-3 px-4 sm:px-6 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg sm:rounded-xl font-semibold transition-colors cursor-pointer border border-gray-600 text-sm sm:text-base"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      // In a real app, this would trigger download or share functionality
                      window.print();
                    }}
                    className="flex-1 py-2.5 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg sm:rounded-xl font-semibold transition-all cursor-pointer shadow-lg text-sm sm:text-base"
                  >
                    <span className="hidden sm:inline">Save/Print</span>
                    <span className="sm:hidden">Save</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoyaltyDashboard;
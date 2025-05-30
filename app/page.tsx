"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import {
  AiOutlineSearch,
  AiOutlineStar,
  AiFillStar,
  AiOutlineGlobal,
  AiOutlineInfoCircle,
  AiOutlineLock,
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineClose,
  AiOutlinePhone,
  AiOutlineMail,
  AiOutlineEdit,
  AiOutlineHeart,
  AiOutlineMenu,
  AiOutlineTag,
} from "react-icons/ai";
import {
  BsChevronRight,
  BsStarHalf,
  BsTelephoneFill,
  BsPeopleFill,
  BsDot,
} from "react-icons/bs";
import {
  FaRegHeart,
  FaHeart,
  FaRegSmileWink,
  FaGlassCheers,
  FaParking,
  FaWifi,
  FaUtensils,
  FaLeaf,
  FaDog,
  FaMusic,
  FaWheelchair,
  FaChild,
  FaCreditCard,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcPaypal,
  FaApple,
  FaGoogle,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaCheckCircle,
} from "react-icons/fa";
import {
  MdClose,
  MdRestaurantMenu,
  MdDeliveryDining,
  MdOutlineVerified,
  MdOutlineLocalOffer,
  MdOutlinePalette,
  MdOutlineSettingsSuggest,
} from "react-icons/md";
import {
  IoLocationSharp,
  IoRestaurant,
  IoChatbubblesOutline,
} from "react-icons/io5";
import {
  RiEBike2Fill,
  RiRestaurantLine,
  RiShieldStarLine,
  RiMoneyDollarCircleLine,
  RiServiceLine,
  RiEmotionHappyLine,
  RiUserStarLine,
} from "react-icons/ri";

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  text: string;
  likes: number;
  likedByUser?: boolean;
  userAvatar?: string;
  photos?: string[];
  responded?: boolean;
  responseText?: string;
  responseDate?: string;
  helpfulCount?: number;
  notHelpfulCount?: number;
  votedHelpfulByUser?: boolean;
}

interface Restaurant {
  id: number;
  name: string;
  rating: number;
  reviewsCount: number;
  priceRange: string;
  cuisine: string;
  location: string;
  image: string;
  images?: string[];
  description?: string;
  photos?: string[];
  reviews?: Review[];
  claimed?: boolean;
  openNow?: boolean;
  openingHours?: string[];
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  phone?: string;
  email?: string;
  website?: string;
  amenities?: string[];
  owner?: {
    name: string;
    photoUrl: string;
    bio: string;
  };
  isFavorite?: boolean;
  specialOffer?: string;
  ambiance?: string;
  dressCode?: string;
  paymentOptions?: string[];
  chefName?: string;
  signatureDish?: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
}

const initialRestaurants: Restaurant[] = [
  {
    id: 1,
    name: "The Crimson Plate",
    rating: 4.7,
    reviewsCount: 235,
    priceRange: "$$$",
    cuisine: "Modern European",
    location: "Financial District, Metropolis",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudCUyMGludGVyaW9yfGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    ],
    description:
      "An upscale dining experience featuring innovative European dishes with a contemporary twist. Perfect for special occasions and corporate dinners.",
    claimed: true,
    openNow: true,
    openingHours: [
      "Mon-Fri: 12pm - 3pm, 6pm - 11pm",
      "Sat: 6pm - 12am",
      "Sun: Closed",
    ],
    contactInfo: {
      phone: "+1 555-0101",
      email: "info@crimsonplate.com",
      website: "www.crimsonplate.com",
    },
    amenities: [
      "Valet Parking",
      "Full Bar",
      "Private Dining",
      "Outdoor Seating",
      "WiFi",
    ],
    specialOffer:
      "Complimentary glass of champagne with any main course on Tuesdays.",
    ambiance: "Elegant & Sophisticated",
    dressCode: "Smart Casual",
    paymentOptions: ["Visa", "Mastercard", "Amex"],
    chefName: "Chef Antoine Dubois",
    signatureDish: "Pan-Seared Scallops with Truffle Risotto",
    tags: ["Fine Dining", "European", "Romantic", "Business Lunch"],
    isFavorite: true,
  },
  {
    id: 2,
    name: "Verdant Vegan Eatery",
    rating: 4.9,
    reviewsCount: 312,
    priceRange: "$$",
    cuisine: "Vegan",
    location: "Greenwood Avenue, Oasis City",
    image:
      "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudCUyMGludGVyaW9yfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    ],
    description:
      "A vibrant and innovative plant-based restaurant committed to sustainability and flavor. Discover the art of vegan cuisine.",
    claimed: true,
    openNow: false,
    openingHours: ["Tue-Sun: 11am - 9pm", "Mon: Closed"],
    contactInfo: {
      phone: "+1 555-0102",
      email: "hello@verdantvegan.com",
      website: "www.verdantvegan.com",
    },
    amenities: [
      "Pet Friendly",
      "Gluten-Free Options",
      "Organic Ingredients",
      "WiFi",
      "Takeaway",
    ],
    ambiance: "Bright & Casual",
    dressCode: "Casual",
    paymentOptions: ["Visa", "Mastercard", "Apple Pay", "Google Pay"],
    chefName: "Chef Maya Green",
    signatureDish: 'Jackfruit "Pulled Pork" Burger',
    tags: ["Vegan", "Healthy", "Sustainable", "Plant-Based", "Casual"],
    isFavorite: false,
  },
  {
    id: 3,
    name: "Spice Symphony",
    rating: 4.5,
    reviewsCount: 189,
    priceRange: "$$",
    cuisine: "Indian",
    location: "Silk Road Plaza, Metropolis",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    description:
      "Authentic Indian flavors with a modern presentation. Our chefs use traditional spices and techniques to create a memorable culinary journey.",
    claimed: false,
    openNow: true,
    openingHours: ["Daily: 12pm - 10:30pm"],
    contactInfo: {
      phone: "+1 555-0103",
      email: "contact@spicesymphony.com",
      website: "www.spicesymphony.com",
    },
    amenities: [
      "Delivery Available",
      "Vegetarian Options",
      "Halal",
      "Catering",
    ],
    specialOffer: "15% off on all takeaway orders over $50.",
    ambiance: "Warm & Inviting",
    dressCode: "Casual",
    paymentOptions: ["Visa", "Mastercard", "Cash"],
    chefName: "Chef Rohan Patel",
    signatureDish: "Butter Chicken with Garlic Naan",
    tags: ["Indian", "Authentic", "Spicy", "Family Friendly"],
    isFavorite: true,
  },
  {
    id: 4,
    name: "Azure Sushi & Grill",
    rating: 4.6,
    reviewsCount: 205,
    priceRange: "$$$",
    cuisine: "Japanese",
    location: "Oceanview Drive, Coastal City",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    description:
      "Exquisite sushi and grilled specialties crafted from the freshest seafood. Enjoy stunning ocean views in a serene atmosphere.",
    claimed: true,
    openNow: true,
    openingHours: ["Wed-Sun: 5pm - 11pm", "Mon-Tue: Closed"],
    contactInfo: {
      phone: "+1 555-0104",
      email: "reservations@azuresushi.com",
      website: "www.azuresushi.com",
    },
    amenities: ["Ocean View", "Full Bar", "Omakase Menu", "Fresh Seafood"],
    ambiance: "Modern & Serene",
    dressCode: "Smart Casual",
    paymentOptions: ["Visa", "Mastercard", "Amex", "JCB"],
    chefName: "Chef Kenji Tanaka",
    signatureDish: "Dragon Roll Deluxe",
    tags: ["Japanese", "Sushi", "Seafood", "Ocean View", "Date Night"],
    isFavorite: false,
  },
  {
    id: 5,
    name: "La Piazza Trattoria",
    rating: 4.3,
    reviewsCount: 150,
    priceRange: "$$",
    cuisine: "Italian",
    location: "Cobblestone Square, Old Town",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    description:
      "Classic Italian comfort food served in a rustic and lively setting. Experience the taste of Italy in the heart of Old Town.",
    claimed: true,
    openNow: false,
    openingHours: ["Tue-Sun: 12pm - 10pm", "Mon: Closed"],
    contactInfo: {
      phone: "+1 555-0105",
      email: "ciao@lapiazza.com",
      website: "www.lapiazza.com",
    },
    amenities: [
      "Outdoor Patio",
      "Wood-Fired Pizza",
      "Family Friendly",
      "BYOB (Wine Only)",
    ],
    ambiance: "Rustic & Lively",
    dressCode: "Casual",
    paymentOptions: ["Visa", "Mastercard", "Cash"],
    chefName: "Mama Sofia Rossi",
    signatureDish: "Margherita Pizza Napoletana",
    tags: ["Italian", "Pizza", "Pasta", "Casual", "Family"],
    isFavorite: true,
  },
  {
    id: 6,
    name: "El Sol Taqueria",
    rating: 4.8,
    reviewsCount: 288,
    priceRange: "$",
    cuisine: "Mexican",
    location: "Calle Fiesta, Barrio Logan",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    description:
      "Authentic street-style tacos and Mexican favorites. A vibrant spot with bold flavors and a festive atmosphere.",
    claimed: false,
    openNow: true,
    openingHours: ["Daily: 10am - 10pm"],
    contactInfo: { phone: "+1 555-0106", website: "elsoltaqueria.food" },
    amenities: [
      "Fast Service",
      "Outdoor Seating",
      "Spicy Options",
      "Affordable",
    ],
    specialOffer: "Taco Tuesday: 3 Tacos for $5!",
    ambiance: "Vibrant & Festive",
    dressCode: "Casual",
    paymentOptions: ["Cash", "Card"],
    chefName: "Carlos Hernandez",
    signatureDish: "Al Pastor Tacos",
    tags: ["Mexican", "Tacos", "Street Food", "Affordable", "Quick Bites"],
    isFavorite: false,
  },
  {
    id: 7,
    name: "Golden Dragon",
    rating: 3.0,
    reviewsCount: 95,
    priceRange: "$$",
    cuisine: "Chinese",
    location: "Chinatown District, Metropolis",
    image:
      "https://images.unsplash.com/photo-1669410647983-ef742ccdfe6d?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
    images: [
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2hpbmVzZSUyMGZvb2R8ZW58MHx8MHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1710378442522-a973b4375e87?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
    ],
    description:
      "Traditional Chinese cuisine in a family-run establishment. Generous portions and classic dishes at reasonable prices.",
    claimed: false,
    openNow: true,
    openingHours: ["Mon-Sun: 11am - 9:30pm"],
    contactInfo: {
      phone: "+1 555-0107",
      email: "info@goldendragon.com",
      website: "www.goldendragon.com",
    },
    amenities: [
      "Family Friendly",
      "Large Groups",
      "Takeaway",
      "Delivery Available",
    ],
    ambiance: "Traditional & Casual",
    dressCode: "Casual",
    paymentOptions: ["Visa", "Mastercard", "Cash"],
    chefName: "Chef Li Wei",
    signatureDish: "Sweet and Sour Pork",
    tags: ["Chinese", "Traditional", "Family", "Affordable"],
    isFavorite: false,
  },
  {
    id: 8,
    name: "Main Street Diner",
    rating: 3.0,
    reviewsCount: 127,
    priceRange: "$",
    cuisine: "American",
    location: "Downtown Main Street, Riverside",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGluZXJ8ZW58MHx8MHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YW1lcmljYW4lMjBmb29kfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YnVyZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    ],
    description:
      "Classic American diner serving comfort food favorites. A nostalgic atmosphere with hearty portions and friendly service.",
    claimed: true,
    openNow: false,
    openingHours: ["Mon-Fri: 6am - 9pm", "Sat-Sun: 7am - 10pm"],
    contactInfo: {
      phone: "+1 555-0108",
      email: "hello@mainstreetdiner.com",
      website: "www.mainstreetdiner.com",
    },
    amenities: ["All Day Breakfast", "Free Parking", "WiFi", "Counter Seating"],
    specialOffer: "Free coffee refills with any breakfast order!",
    ambiance: "Nostalgic & Cozy",
    dressCode: "Casual",
    paymentOptions: ["Visa", "Mastercard", "Cash"],
    chefName: "Chef Bobby Johnson",
    signatureDish: "Classic Cheeseburger & Fries",
    tags: ["American", "Diner", "Comfort Food", "Breakfast", "Classic"],
    isFavorite: false,
  },
];

const cuisines = [
  { name: "All", icon: <MdRestaurantMenu /> },
  { name: "Modern European", icon: <FaUtensils /> },
  { name: "Vegan", icon: <FaLeaf /> },
  { name: "Indian", icon: <RiRestaurantLine /> },
  { name: "Japanese", icon: <IoRestaurant /> },
  { name: "Italian", icon: <MdDeliveryDining /> },
  { name: "Mexican", icon: <RiRestaurantLine /> },
];

const priceRanges = ["All", "$", "$$", "$$$", "$$$$"];
const ratings = ["All", "4.5", "4", "3.5", "3"];

const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}) => {
  const toastColors = {
    success: "from-green-500 to-emerald-600",
    error: "from-red-500 to-rose-600",
    info: "from-sky-500 to-blue-600",
  };
  const Icon =
    type === "success"
      ? FaCheckCircle
      : type === "error"
        ? MdClose
        : AiOutlineInfoCircle;

  return (
    <div className="fixed bottom-5 right-5 z-[99999] animate-slideInUp">
      <div
        className={`flex items-center p-4 rounded-xl shadow-2xl bg-gradient-to-br ${toastColors[type]} text-white min-w-[300px]`}
      >
        <Icon className="mr-3 text-2xl flex-shrink-0" />
        <p className="font-semibold text-sm">{message}</p>
        <button
          onClick={onClose}
          className="ml-auto text-white/70 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/20 cursor-pointer"
          aria-label="Close notification"
        >
          <MdClose size={18} />
        </button>
      </div>
    </div>
  );
};

const generateDummyReviews = (
  restaurantName: string,
  count: number = 3
): Review[] => {
  const reviewTexts = [
    `${restaurantName} was an absolute delight! The flavors were incredible, and the presentation was art.`,
    `A truly memorable dining experience at ${restaurantName}. The staff were attentive and the ambiance was perfect.`,
    `I highly recommend ${restaurantName}. Their signature dish is a must-try!`,
    `We celebrated our anniversary at ${restaurantName} and it couldn't have been better. Exceptional food and service.`,
    `The best European food I've had in the city. ${restaurantName} is a gem!`,
    `Service was prompt and friendly. The food at ${restaurantName} was fresh and flavorful.`,
    `Cozy atmosphere and delicious food. ${restaurantName} is perfect for a relaxed evening out.`,
  ];
  const names = [
    "Alex P.",
    "Jordan B.",
    "Casey L.",
    "Morgan S.",
    "Taylor K.",
    "Riley M.",
    "Jamie W.",
  ];

  // Create a simple hash function for consistent but pseudo-random values
  const simpleHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  const baseHash = simpleHash(restaurantName);

  return Array(count)
    .fill(null)
    .map((_, index) => {
      const seed = baseHash + index;
      const nameIndex = seed % names.length;
      const textIndex = seed % reviewTexts.length;
      const rating = 3.5 + (seed % 3) * 0.5; // Will be 3.5, 4.0, or 4.5
      const likes = seed % 50;
      const helpfulCount = seed % 20;
      const daysAgo = (seed % 60) + 1;

      // Create a deterministic date based on a fixed base date
      const baseDate = new Date("2024-01-01");
      const reviewDate = new Date(baseDate);
      reviewDate.setDate(baseDate.getDate() - daysAgo);

      return {
        id: 1000000 + seed, // Use seed-based ID instead of Date.now()
        author: names[nameIndex],
        rating: rating,
        date: reviewDate.toLocaleDateString("en-GB"),
        text: reviewTexts[textIndex],
        likes: likes,
        likedByUser: seed % 10 > 7,
        votedHelpfulByUser: seed % 10 > 6,
        userAvatar: `https://i.pravatar.cc/150?u=user${seed}`,
        helpfulCount: helpfulCount,
        notHelpfulCount: seed % 5,
        photos:
          seed % 2 === 0
            ? [
              `https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&w=400&h=300&fit=crop&auto=format&q=60&seed=${seed}`,
              `https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&w=400&h=300&fit=crop&auto=format&q=60&seed=${seed + 1
              }`,
            ]
            : undefined,
        responded: seed % 5 > 2,
        responseText:
          "Thank you for your wonderful feedback! We're thrilled you enjoyed your experience and hope to see you again soon.",
        responseDate: new Date(
          reviewDate.getTime() + 3 * 24 * 60 * 60 * 1000
        ).toLocaleDateString("en-GB"),
      };
    });
};

const renderStars = (rating: number, starSize = "text-lg") => {
  const roundedRating = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const hasHalfStar = roundedRating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <AiFillStar
          key={`full-${i}`}
          className={`text-yellow-400 ${starSize}`}
        />
      ))}
      {hasHalfStar && (
        <BsStarHalf key="half" className={`text-yellow-400 ${starSize}`} />
      )}
      {[...Array(Math.max(0, emptyStars))].map((_, i) => (
        <AiOutlineStar
          key={`empty-${i}`}
          className={`text-yellow-400/60 ${starSize}`}
        />
      ))}
    </div>
  );
};

const renderAmenityIcon = (amenity: string) => {
  const lowerAmenity = amenity.toLowerCase();
  if (lowerAmenity.includes("parking"))
    return <FaParking className="mr-2 text-red-400" />;
  if (lowerAmenity.includes("bar"))
    return <FaGlassCheers className="mr-2 text-red-400" />;
  if (lowerAmenity.includes("wifi"))
    return <FaWifi className="mr-2 text-red-400" />;
  if (lowerAmenity.includes("outdoor"))
    return <FaLeaf className="mr-2 text-red-400" />;
  if (lowerAmenity.includes("pet friendly"))
    return <FaDog className="mr-2 text-red-400" />;
  if (lowerAmenity.includes("music"))
    return <FaMusic className="mr-2 text-red-400" />;
  if (
    lowerAmenity.includes("accessible") ||
    lowerAmenity.includes("wheelchair")
  )
    return <FaWheelchair className="mr-2 text-red-400" />;
  if (lowerAmenity.includes("family") || lowerAmenity.includes("kids"))
    return <FaChild className="mr-2 text-red-400" />;
  if (lowerAmenity.includes("delivery"))
    return <MdDeliveryDining className="mr-2 text-red-400" />;
  if (lowerAmenity.includes("takeaway"))
    return <RiEBike2Fill className="mr-2 text-red-400" />;
  return <RiShieldStarLine className="mr-2 text-red-400" />;
};

const renderPaymentIcon = (option: string) => {
  const lowerOption = option.toLowerCase();
  if (lowerOption.includes("visa"))
    return <FaCcVisa className="text-xl text-blue-600" />;
  if (lowerOption.includes("mastercard"))
    return <FaCcMastercard className="text-xl text-orange-500" />;
  if (lowerOption.includes("amex"))
    return <FaCcAmex className="text-xl text-sky-500" />;
  if (lowerOption.includes("paypal"))
    return <FaCcPaypal className="text-xl text-blue-700" />;
  if (lowerOption.includes("apple"))
    return <FaApple className="text-xl text-zinc-500" />;
  if (lowerOption.includes("google"))
    return <FaGoogle className="text-xl text-red-500" />;
  return <FaCreditCard className="text-xl text-zinc-400" />;
};

const RestaurantModalScrollableContent: React.FC<{
  restaurant: Restaurant;
  handleLikeReview: (reviewId: number, restaurantId: number) => void;
  handleHelpfulClick: (reviewId: number, restaurantId: number) => void;
  onLoadMoreReviews: () => void;
  onSubmitReview: (e: React.FormEvent<HTMLFormElement>) => void;
  newReviewRating: number;
  setNewReviewRating: (rating: number) => void;
  visibleReviewsCount: number;
}> = React.memo(
  ({
    restaurant,
    handleLikeReview,
    handleHelpfulClick,
    onLoadMoreReviews,
    onSubmitReview,
    newReviewRating,
    setNewReviewRating,
    visibleReviewsCount,
  }) => {
    const handleButtonClick = useCallback((callback: () => void) => {
      return (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        callback();
      };
    }, []);

    const handleFormSubmit = useCallback(
      (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onSubmitReview(e);
      },
      [onSubmitReview]
    );

    if (!restaurant) return null;

    const {
      name,
      description,
      reviews,
      contactInfo,
      openingHours,
      amenities,
      owner,
      ambiance,
      dressCode,
      paymentOptions,
      chefName,
      signatureDish,
      tags,
    } = restaurant;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {description && (
            <div>
              <h2 className="text-xl font-semibold text-red-400 mb-3 flex items-center">
                <AiOutlineInfoCircle className="mr-2" />
                About {name}
              </h2>
              <p className="text-zinc-300 leading-relaxed text-sm">
                {description}
              </p>
            </div>
          )}

          {signatureDish && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                <RiUserStarLine className="mr-2 text-yellow-400" />
                Chef&apos;s Special
              </h3>
              <p className="text-zinc-300 text-sm italic">
                &quot;{signatureDish}&quot; -{" "}
                {chefName && `by Chef ${chefName}`}
              </p>
            </div>
          )}

          {amenities && amenities.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-red-400 mb-3 flex items-center">
                <RiServiceLine className="mr-2" />
                Amenities
              </h2>
              <div className="flex flex-wrap gap-3">
                {amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="flex items-center text-sm px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-full border border-zinc-700"
                  >
                    {renderAmenityIcon(amenity)} {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {tags && tags.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-red-400 mb-3 flex items-center">
                <AiOutlineTag className="mr-2" />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full border border-blue-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-red-400 mb-4 flex items-center">
              <IoChatbubblesOutline className="mr-2" />
              Reviews ({reviews?.length || 0})
            </h2>
            {reviews && reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.slice(0, visibleReviewsCount).map((review) => (
                  <div
                    key={review.id}
                    className="p-5 bg-zinc-800/70 rounded-lg border border-zinc-700/50"
                  >
                    <div className="flex items-start mb-3">
                      <img
                        src={review.userAvatar}
                        alt={review.author}
                        className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-red-500/70"
                        onError={(e) =>
                          (e.currentTarget.src = `https://i.pravatar.cc/150?u=default`)
                        }
                      />
                      <div>
                        <h5 className="font-semibold text-white text-sm">
                          {review.author}
                        </h5>
                        <p className="text-xs text-zinc-400">{review.date}</p>
                      </div>
                      <div className="ml-auto flex items-center text-xs text-yellow-400">
                        {renderStars(review.rating, "text-xs")}
                        <span className="ml-1 font-bold">
                          ({review.rating.toFixed(1)})
                        </span>
                      </div>
                    </div>
                    <p className="text-zinc-300 text-sm mb-3 leading-relaxed">
                      {review.text}
                    </p>
                    {review.photos && review.photos.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                        {review.photos.map((photoUrl, idx) => (
                          <img
                            key={idx}
                            src={photoUrl}
                            alt={`Review photo ${idx + 1}`}
                            className="w-full h-24 object-cover rounded-md border border-zinc-700"
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            }
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-700/50">
                      <div className="flex gap-3">
                        <button
                          onClick={handleButtonClick(() =>
                            handleLikeReview(review.id, restaurant.id)
                          )}
                          onMouseDown={(e) => e.preventDefault()}
                          className={`flex cursor-pointer items-center hover:text-red-400 modal-button ${review.likedByUser
                            ? "text-red-500"
                            : "text-zinc-500"
                            }`}
                        >
                          <AiOutlineHeart className="mr-1" /> {review.likes}
                        </button>
                        <button
                          onClick={handleButtonClick(() =>
                            handleHelpfulClick(review.id, restaurant.id)
                          )}
                          onMouseDown={(e) => e.preventDefault()}
                          className={`flex cursor-pointer items-center modal-button ${review.votedHelpfulByUser
                            ? "text-green-500"
                            : "text-zinc-500 hover:text-green-400"
                            }`}
                        >
                          <FaRegSmileWink className="mr-1" />
                          {review.helpfulCount || 0}
                        </button>
                      </div>
                    </div>
                    {review.responded && review.responseText && (
                      <div className="mt-3 pt-3 pl-4 border-l-2 border-red-500/70 bg-zinc-700/30 rounded-r-md">
                        <p className="text-xs font-semibold text-red-400 mb-1">
                          Response from owner:
                        </p>
                        <p className="text-xs text-zinc-300 italic">
                          &quot;{review.responseText}&quot;
                        </p>
                        {review.responseDate && (
                          <p className="text-xs text-zinc-500 mt-1">
                            Responded on: {review.responseDate}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {reviews.length > visibleReviewsCount && (
                  <button
                    onClick={handleButtonClick(onLoadMoreReviews)}
                    onMouseDown={(e) => e.preventDefault()}
                    className="w-full cursor-pointer py-2.5 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium modal-button"
                  >
                    Load More Reviews
                  </button>
                )}
              </div>
            ) : (
              <p className="text-zinc-400 text-sm">
                No reviews yet. Be the first!
              </p>
            )}
          </div>

          <div className="modal-form-element">
            <h2 className="text-xl font-semibold text-red-400 mb-3 flex items-center">
              <AiOutlineEdit className="mr-2" />
              Write a Review
            </h2>
            <form
              onSubmit={handleFormSubmit}
              className="space-y-4 p-5 bg-zinc-800/70 rounded-lg border border-zinc-700/50"
              onClick={(e) => e.stopPropagation()}
            >
              <input type="hidden" name="restaurantId" value={restaurant.id} />

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-zinc-300 mb-1"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-3 py-2.5 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white placeholder-zinc-400 text-sm"
                  placeholder="John Doe"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={handleButtonClick(() =>
                        setNewReviewRating(star)
                      )}
                      onMouseDown={(e) => e.preventDefault()}
                      className="focus:outline-none cursor-pointer modal-button"
                    >
                      {star <= newReviewRating ? (
                        <AiFillStar className="text-yellow-400 text-2xl" />
                      ) : (
                        <AiOutlineStar className="text-zinc-400 text-2xl hover:text-yellow-400/70" />
                      )}
                    </button>
                  ))}
                </div>
                <input type="hidden" name="rating" value={newReviewRating} />
              </div>

              <div>
                <label
                  htmlFor="review"
                  className="block text-sm font-medium text-zinc-300 mb-1"
                >
                  Your Review
                </label>
                <textarea
                  id="review"
                  name="review"
                  rows={4}
                  required
                  minLength={10}
                  className="w-full px-3 py-2.5 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white placeholder-zinc-400 text-sm resize-none"
                  placeholder="Share your experience..."
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 cursor-pointer bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm modal-button"
                onMouseDown={(e) => e.preventDefault()}
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
        <div className="lg:col-span-1 space-y-6">
          {contactInfo && (
            <div className="p-5 bg-zinc-800/70 rounded-lg border border-zinc-700/50">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <BsTelephoneFill className="mr-2 text-red-400" />
                Contact
              </h3>
              <ul className="space-y-2 text-sm">
                {contactInfo.phone && (
                  <li>
                    <a
                      className="text-zinc-300 hover:text-red-400 flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <AiOutlinePhone className="mr-2" /> {contactInfo.phone}
                    </a>
                  </li>
                )}
                {contactInfo.email && (
                  <li>
                    <a
                      className="text-zinc-300 hover:text-red-400 flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <AiOutlineMail className="mr-2" /> {contactInfo.email}
                    </a>
                  </li>
                )}
                {contactInfo.website && (
                  <li>
                    <a
                      rel="noopener noreferrer"
                      className="text-zinc-300 hover:text-red-400 flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <AiOutlineGlobal className="mr-2" /> Visit Website
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
          {openingHours && openingHours.length > 0 && (
            <div className="p-5 bg-zinc-800/70 rounded-lg border border-zinc-700/50">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <AiOutlineLock className="mr-2 text-red-400" />
                Opening Hours
              </h3>
              <ul className="space-y-1 text-sm text-zinc-300">
                {openingHours.map((hours, index) => (
                  <li key={index}>{hours}</li>
                ))}
              </ul>
            </div>
          )}
          {paymentOptions && paymentOptions.length > 0 && (
            <div className="p-5 bg-zinc-800/70 rounded-lg border border-zinc-700/50">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <RiMoneyDollarCircleLine className="mr-2 text-red-400" />
                Payment Options
              </h3>
              <div className="flex flex-wrap gap-3">
                {paymentOptions.map((option) => (
                  <span
                    key={option}
                    title={option}
                    className="p-1.5 bg-zinc-700 rounded-md"
                  >
                    {renderPaymentIcon(option)}
                  </span>
                ))}
              </div>
            </div>
          )}
          {owner && (
            <div className="p-5 bg-zinc-800/70 rounded-lg border border-zinc-700/50 text-center">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center justify-center">
                <BsPeopleFill className="mr-2 text-red-400" />
                Meet The Owner
              </h3>
              <img
                src={owner.photoUrl}
                alt={owner.name}
                className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-red-500/70"
                onError={(e) =>
                  (e.currentTarget.src = `https://i.pravatar.cc/150?u=owner`)
                }
              />
              <h4 className="font-semibold text-white text-md">{owner.name}</h4>
              <p className="text-xs text-zinc-400 mb-2">{owner.bio}</p>
            </div>
          )}
          {ambiance && dressCode && (
            <div className="p-5 bg-zinc-800/70 rounded-lg border border-zinc-700/50">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <MdOutlinePalette className="mr-2 text-red-400" />
                Ambiance & Dress Code
              </h3>
              <p className="text-sm text-zinc-300 mb-1">
                <strong className="text-zinc-200">Ambiance:</strong> {ambiance}
              </p>
              <p className="text-sm text-zinc-300">
                <strong className="text-zinc-200">Dress Code:</strong>{" "}
                {dressCode}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
);
RestaurantModalScrollableContent.displayName =
  "RestaurantModalScrollableContent";

const HeroSection = React.memo(
  ({
    searchTerm,
    handleSearch,
    isSearchFocused,
    setIsSearchFocused,
    allRestaurants,
    handleRestaurantClick,
    searchContainerRef,
    suggestionsRef,
  }: {
    searchTerm: string;
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isSearchFocused: boolean;
    setIsSearchFocused: (isFocused: boolean) => void;
    allRestaurants: Restaurant[];
    handleRestaurantClick: (id: number) => void;
    searchContainerRef: React.RefObject<HTMLDivElement | null>;
    suggestionsRef: React.RefObject<HTMLDivElement | null>;
  }) => {
    const suggestions = searchTerm
      ? allRestaurants
        .filter(
          (r) =>
            r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r.tags &&
              r.tags.some((tag) =>
                tag.toLowerCase().includes(searchTerm.toLowerCase())
              ))
        )
        .slice(0, 5)
      : [];

    return (
      <div className="relative h-[calc(100vh-5rem)] md:h-[85vh] flex items-center justify-center text-center overflow-visible pt-4 md:pt-0">
        {/* Enhanced Background with Multiple Layers */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1920&h=1080"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          {/* Multiple gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-transparent to-orange-900/20"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 bg-orange-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-500/10 rounded-full blur-lg animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 p-6 max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold mb-6 font-display leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-red-500 to-orange-500 drop-shadow-2xl">
                Discover
              </span>
              <br />
              <span className="text-white drop-shadow-2xl">Your Next</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-yellow-400 to-yellow-500 drop-shadow-2xl">
                Culinary
              </span>{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500 drop-shadow-2xl">
                Adventure
              </span>
            </h1>
            {/* <p className="text-xl md:text-2xl text-zinc-200 mb-12 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-lg">
              Explore extraordinary restaurants, read authentic reviews from real food lovers, and embark on unforgettable dining experiences that will ignite your passion for great food.
            </p> */}
          </div>

          <div ref={searchContainerRef} className="relative max-w-2xl mx-auto">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search restaurants, cuisines, or locations..."
                className="w-full h-14 md:h-16 pl-14 md:pl-16 pr-6 text-base md:text-lg bg-white/95 backdrop-blur-sm text-gray-900 rounded-2xl border-2 border-transparent focus:border-red-500 focus:ring-4 focus:ring-red-500/30 outline-none transition-all duration-300 shadow-2xl placeholder-gray-500 group-hover:bg-white"
                value={searchTerm}
                onChange={handleSearch}
                onFocus={() => setIsSearchFocused(true)}
              />
              <div className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl md:text-2xl group-hover:text-red-500 transition-colors duration-300">
                <AiOutlineSearch />
              </div>
            </div>

            {isSearchFocused && searchTerm && (
              <div
                ref={suggestionsRef}
                className="absolute mt-3 top-full w-full bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl z-20 max-h-80 overflow-y-auto text-left styled-scrollbar"
              >
                {suggestions.length > 0 ? (
                  suggestions.map((restaurant) => (
                    <div
                      key={restaurant.id}
                      className="p-4 hover:bg-red-50 cursor-pointer transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                      onClick={() => handleRestaurantClick(restaurant.id)}
                    >
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-12 h-12 object-cover rounded-lg shadow-md"
                        onError={(e) =>
                        (e.currentTarget.src =
                          "https://placehold.co/48x48/222/fff?text=N/A")
                        }
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {restaurant.name}
                        </h4>
                        <p className="text-sm text-gray-600 flex items-center">
                          {restaurant.cuisine}{" "}
                          <BsDot className="mx-1 text-gray-400" />{" "}
                          {restaurant.location}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No results found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="mt-16 flex flex-wrap justify-center gap-4">
            <div className="flex items-center text-white/80 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span>1000+ Restaurants</span>
            </div>
            <div className="flex items-center text-white/80 text-sm">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
              <span>50,000+ Reviews</span>
            </div>
            <div className="flex items-center text-white/80 text-sm">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></div>
              <span>Trusted by Food Lovers</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
HeroSection.displayName = "HeroSection";

const App = () => {
  const [restaurantsData, setRestaurantsData] = useState<Restaurant[]>(
    initialRestaurants.map((r) => ({
      ...r,
      reviews: generateDummyReviews(
        r.name,
        r.reviewsCount || Math.floor(Math.random() * 5) + 3
      ),
    }))
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");
  const [showFavorites, setShowFavorites] = useState(false);

  const [tempSearchTermInPanel, setTempSearchTermInPanel] = useState("");
  const [tempSelectedCuisine, setTempSelectedCuisine] = useState("All");
  const [tempSelectedPrice, setTempSelectedPrice] = useState("All");
  const [tempSelectedRating, setTempSelectedRating] = useState("All");
  const [tempShowFavorites, setTempShowFavorites] = useState(false);

  const [filteredRestaurants, setFilteredRestaurants] =
    useState(restaurantsData);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [visibleReviews, setVisibleReviews] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({ show: false, message: "", type: "success" });

  const [currentSection, setCurrentSection] = useState("home");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [scrollToSectionId, setScrollToSectionId] = useState<string | null>(
    null
  );

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 6;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [claimedOffers, setClaimedOffers] = useState<Set<number>>(new Set());

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (isMobileMenuOpen || isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow || "";
    }
    return () => {
      document.body.style.overflow = originalOverflow || "";
    };
  }, [isMobileMenuOpen, isModalOpen]);

  useEffect(() => {
    if (isFilterOpen) {
      setTempSearchTermInPanel(searchTerm);
      setTempSelectedCuisine(selectedCuisine);
      setTempSelectedPrice(selectedPrice);
      setTempSelectedRating(selectedRating);
      setTempShowFavorites(showFavorites);
    }
  }, [
    isFilterOpen,
    searchTerm,
    selectedCuisine,
    selectedPrice,
    selectedRating,
    showFavorites,
  ]);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info") => {
      setToast({ show: true, message, type });
      setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 4000);
    },
    []
  );

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  useEffect(() => {
    setIsLoading(true);
    let filtered = [...restaurantsData];

    if (showFavorites) {
      filtered = filtered.filter((r) => r.isFavorite);
    }

    if (debouncedSearchTerm) {
      const lowerSearchTerm = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(lowerSearchTerm) ||
          r.cuisine.toLowerCase().includes(lowerSearchTerm) ||
          r.location.toLowerCase().includes(lowerSearchTerm) ||
          (r.tags &&
            r.tags.some((tag) => tag.toLowerCase().includes(lowerSearchTerm)))
      );
    }

    if (selectedCuisine !== "All") {
      filtered = filtered.filter((r) => r.cuisine === selectedCuisine);
    }

    if (selectedPrice !== "All") {
      filtered = filtered.filter((r) => r.priceRange === selectedPrice);
    }

    if (selectedRating !== "All") {
      const ratingValue = parseFloat(selectedRating);
      filtered = filtered.filter((r) => r.rating >= ratingValue);
    }

    setFilteredRestaurants(filtered);
    setIsLoading(false);

    const activeFilters = [
      selectedCuisine !== "All",
      selectedPrice !== "All",
      selectedRating !== "All",
      showFavorites,
      debouncedSearchTerm !== "",
    ].filter(Boolean).length;
    setActiveFilterCount(activeFilters);
  }, [
    debouncedSearchTerm,
    selectedCuisine,
    selectedPrice,
    selectedRating,
    showFavorites,
    restaurantsData,
  ]);

  useEffect(() => {
    if (currentSection === "home" && scrollToSectionId) {
      const el = document.getElementById(scrollToSectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setScrollToSectionId(null);
    }
  }, [currentSection, scrollToSectionId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        (!suggestionsRef.current ||
          !suggestionsRef.current.contains(event.target as Node))
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAllActiveFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCuisine("All");
    setSelectedPrice("All");
    setSelectedRating("All");
    setShowFavorites(false);
    setCurrentPage(1);

    setTempSearchTermInPanel("");
    setTempSelectedCuisine("All");
    setTempSelectedPrice("All");
    setTempSelectedRating("All");
    setTempShowFavorites(false);

    showToast("All active filters cleared!", "info");
  }, [showToast]);

  const handleApplyFilters = () => {
    setSearchTerm(tempSearchTermInPanel);
    setSelectedCuisine(tempSelectedCuisine);
    setSelectedPrice(tempSelectedPrice);
    setSelectedRating(tempSelectedRating);
    setShowFavorites(tempShowFavorites);
    setCurrentPage(1);
    setIsFilterOpen(false);
    showToast("Filters applied!", "info");
  };

  const handleRestaurantClick = useCallback(
    (restaurantId: number) => {
      const restaurant = restaurantsData.find((r) => r.id === restaurantId);
      if (restaurant) {
        if (!restaurant.reviews || restaurant.reviews.length < 2) {
          const reviewCount =
            restaurant.reviewsCount > 1
              ? restaurant.reviewsCount
              : Math.max(3, (restaurant.id % 5) + 2); // Deterministic based on restaurant ID
          const dummyReviews = generateDummyReviews(
            restaurant.name,
            reviewCount
          );
          const combinedReviews = restaurant.reviews
            ? [
              ...restaurant.reviews,
              ...dummyReviews.slice(restaurant.reviews.length),
            ]
            : dummyReviews;

          const avgRating =
            combinedReviews.length > 0
              ? parseFloat(
                (
                  combinedReviews.reduce(
                    (sum, review) => sum + review.rating,
                    0
                  ) / combinedReviews.length
                ).toFixed(1)
              )
              : restaurant.rating;

          const restaurantWithReviews = {
            ...restaurant,
            reviews: combinedReviews,
            reviewsCount: combinedReviews.length,
            rating: avgRating,
          };
          const updatedRestaurants = restaurantsData.map((r) =>
            r.id === restaurantId ? restaurantWithReviews : r
          );
          setRestaurantsData(updatedRestaurants);
          setSelectedRestaurant(restaurantWithReviews);
        } else {
          setSelectedRestaurant(restaurant);
        }
        setIsModalOpen(true);
        setVisibleReviews(3);
        setNewReviewRating(5);
        setActiveImageIndex(0);
        setIsSearchFocused(false);
      }
    },
    [restaurantsData]
  );

  const handleSubmitReview = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!selectedRestaurant) return;

      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const authorName = ((formData.get("name") as string) || "").trim();
      const reviewText = ((formData.get("review") as string) || "").trim();
      const ratingValue = formData.get("rating") as string;

      if (!authorName) {
        showToast("Please enter your name.", "error");
        return;
      }
      if (!reviewText) {
        showToast("Please enter your review text.", "error");
        return;
      }
      if (reviewText.length < 10) {
        showToast(
          "Review too short. Please provide more details (min 10 characters).",
          "error"
        );
        return;
      }
      if (
        !ratingValue ||
        parseInt(ratingValue) < 1 ||
        parseInt(ratingValue) > 5
      ) {
        showToast("Please select a valid rating (1-5 stars).", "error");
        return;
      }

      const newReview: Review = {
        id: Date.now(),
        author: authorName,
        rating: parseInt(ratingValue),
        date: new Date().toLocaleDateString("en-GB"),
        text: reviewText,
        likes: 0,
        likedByUser: false,
        votedHelpfulByUser: false,
        userAvatar: `https://i.pravatar.cc/150?u=${authorName
          .replace(/\s+/g, "")
          .toLowerCase()}`,
        helpfulCount: 0,
        notHelpfulCount: 0,
      };

      const updatedRestaurants = restaurantsData.map((restaurant) => {
        if (restaurant.id === selectedRestaurant.id) {
          const currentReviews = restaurant.reviews || [];
          const updatedReviews = [newReview, ...currentReviews];

          const newTotalRating = updatedReviews.reduce(
            (sum, rev) => sum + rev.rating,
            0
          );
          const newAvgRating = parseFloat(
            (newTotalRating / updatedReviews.length).toFixed(1)
          );

          const updatedRestaurant = {
            ...restaurant,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: newAvgRating,
          };
          setSelectedRestaurant(updatedRestaurant);
          return updatedRestaurant;
        }
        return restaurant;
      });

      setRestaurantsData(updatedRestaurants);
      form.reset();
      setNewReviewRating(5);
      showToast("Review submitted successfully!", "success");
      setVisibleReviews((prev) => prev + 1);
    },
    [selectedRestaurant, restaurantsData, showToast]
  );

  const handleLikeReview = useCallback(
    (reviewId: number, restaurantId: number) => {
      const updatedRestaurants = restaurantsData.map((restaurant) => {
        if (restaurant.id === restaurantId && restaurant.reviews) {
          const updatedReviews = restaurant.reviews.map((review) => {
            if (review.id === reviewId) {
              return {
                ...review,
                likes: review.likedByUser ? review.likes - 1 : review.likes + 1,
                likedByUser: !review.likedByUser,
              };
            }
            return review;
          });
          if (selectedRestaurant && selectedRestaurant.id === restaurantId) {
            setSelectedRestaurant((prevSelected) =>
              prevSelected
                ? {
                  ...prevSelected,
                  reviews: updatedReviews,
                }
                : null
            );
          }
          return { ...restaurant, reviews: updatedReviews };
        }
        return restaurant;
      });
      setRestaurantsData(updatedRestaurants);
    },
    [restaurantsData, selectedRestaurant]
  );

  const handleHelpfulClick = useCallback(
    (reviewId: number, restaurantId: number) => {
      const updatedRestaurants = restaurantsData.map((restaurant) => {
        if (restaurant.id === restaurantId && restaurant.reviews) {
          const updatedReviews = restaurant.reviews.map((review) => {
            if (review.id === reviewId) {
              const newVotedHelpfulStatus = !review.votedHelpfulByUser;
              return {
                ...review,
                helpfulCount: newVotedHelpfulStatus
                  ? (review.helpfulCount || 0) + 1
                  : Math.max(0, (review.helpfulCount || 0) - 1),
                votedHelpfulByUser: newVotedHelpfulStatus,
              };
            }
            return review;
          });
          if (selectedRestaurant && selectedRestaurant.id === restaurantId) {
            setSelectedRestaurant((prevSelected) =>
              prevSelected
                ? {
                  ...prevSelected,
                  reviews: updatedReviews,
                }
                : null
            );
          }
          return { ...restaurant, reviews: updatedReviews };
        }
        return restaurant;
      });
      setRestaurantsData(updatedRestaurants);
    },
    [restaurantsData, selectedRestaurant]
  );

  const toggleFavorite = useCallback(
    (restaurantId: number) => {
      const updatedRestaurants = restaurantsData.map((restaurant) => {
        if (restaurant.id === restaurantId) {
          const newFavoriteStatus = !restaurant.isFavorite;
          if (selectedRestaurant && selectedRestaurant.id === restaurantId) {
            setSelectedRestaurant((prevSelected) =>
              prevSelected
                ? {
                  ...prevSelected,
                  isFavorite: newFavoriteStatus,
                }
                : null
            );
          }
          showToast(
            newFavoriteStatus
              ? `${restaurant.name} added to favorites!`
              : `${restaurant.name} removed from favorites.`,
            "info"
          );
          return { ...restaurant, isFavorite: newFavoriteStatus };
        }
        return restaurant;
      });
      setRestaurantsData(updatedRestaurants);
    },
    [restaurantsData, selectedRestaurant, showToast]
  );

  const handleLoadMoreReviews = useCallback(() => {
    if (selectedRestaurant && selectedRestaurant.reviews) {
      setVisibleReviews((prev) =>
        Math.min(prev + 3, selectedRestaurant.reviews?.length || 0)
      );
    }
  }, [selectedRestaurant]);

  const handleClaimOffer = useCallback(
    (restaurantId: number, restaurantName: string) => {
      if (claimedOffers.has(restaurantId)) {
        showToast("You have already claimed this offer!", "info");
        return;
      }

      setClaimedOffers((prev) => new Set([...prev, restaurantId]));
      showToast(
        `🎉 Offer claimed successfully for ${restaurantName}! Check your email for details.`,
        "success"
      );
    },
    [claimedOffers, showToast]
  );

  const CuisineIcon = ({ cuisine }: { cuisine: string }) => {
    const icons: { [key: string]: React.ReactElement } = {
      "Modern European": <FaUtensils className="text-red-500" />,
      Vegan: <FaLeaf className="text-green-500" />,
      Indian: <RiRestaurantLine className="text-orange-500" />,
      Japanese: <IoRestaurant className="text-blue-500" />,
      Italian: <MdDeliveryDining className="text-purple-500" />,
      Mexican: <RiRestaurantLine className="text-yellow-500" />,
      All: <MdRestaurantMenu className="text-gray-500" />,
    };
    return icons[cuisine] || <MdRestaurantMenu className="text-gray-500" />;
  };

  const RestaurantCard = React.memo(
    ({ restaurant, index }: { restaurant: Restaurant; index: number }) => (
      <div
        key={restaurant.id}
        className="group cursor-pointer bg-zinc-800/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/30 border border-zinc-700/50 hover:border-red-500/50 flex flex-col"
        onClick={() => handleRestaurantClick(restaurant.id)}
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div className="relative h-56 overflow-hidden">
          <img
            src={
              restaurant.image ||
              "https://placehold.co/600x400/222/fff?text=Restaurant"
            }
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) =>
            (e.currentTarget.src =
              "https://placehold.co/600x400/222/fff?text=No+Image")
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(restaurant.id);
            }}
            className="absolute top-3 right-3 cursor-pointer p-2 bg-black/50 rounded-full text-white hover:text-red-400 transition-colors z-10 backdrop-blur-sm"
            aria-label={
              restaurant.isFavorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            {restaurant.isFavorite ? (
              <FaHeart className="text-red-500 text-xl" />
            ) : (
              <FaRegHeart className="text-xl" />
            )}
          </button>
          {restaurant.specialOffer && (
            <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              <MdOutlineLocalOffer className="inline mr-1" /> Special Offer
            </div>
          )}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-xl font-bold text-white truncate group-hover:text-red-400 transition-colors">
              {restaurant.name}
            </h3>
            <div className="flex items-center text-sm text-zinc-300 mt-1">
              <CuisineIcon cuisine={restaurant.cuisine} />
              <span className="ml-1.5">{restaurant.cuisine}</span>
              <BsDot className="mx-1 text-zinc-500" />
              <span>{restaurant.priceRange}</span>
            </div>
          </div>
        </div>
        <div className="p-5 flex-grow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              {renderStars(restaurant.rating, "text-base")}
              <span className="text-sm text-zinc-400">
                {restaurant.reviewsCount} reviews
              </span>
            </div>
            <p className="text-sm text-zinc-400 mb-3 line-clamp-2 h-10">
              {restaurant.description}
            </p>
            <div className="flex items-center text-sm text-zinc-400 mb-3">
              <IoLocationSharp className="mr-1.5 text-red-500 flex-shrink-0" />
              <span className="truncate">{restaurant.location}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-700/50">
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${restaurant.openNow
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
                }`}
            >
              {restaurant.openNow ? "Open Now" : "Closed"}
            </span>
            <button className="text-sm cursor-pointer text-red-400 hover:text-red-300 font-medium transition-colors">
              View Details <BsChevronRight className="inline ml-1" />
            </button>
          </div>
        </div>
      </div>
    )
  );
  RestaurantCard.displayName = "RestaurantCard";

  const Pagination = () => {
    const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-2 my-12">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-3 rounded-lg bg-zinc-800 hover:bg-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Previous page"
        >
          <AiOutlineLeft />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-5 py-3 rounded-lg text-sm font-medium bg-zinc-800 hover:bg-red-500/50 transition-colors cursor-pointer"
            >
              1
            </button>
            {startPage > 2 && <span className="text-zinc-500">...</span>}
          </>
        )}

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => handlePageChange(num)}
            className={`px-5 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${currentPage === num
              ? "bg-red-500 text-white"
              : "bg-zinc-800 hover:bg-red-500/50"
              }`}
          >
            {num}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-zinc-500">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-5 py-3 rounded-lg text-sm font-medium bg-zinc-800 hover:bg-red-500/50 transition-colors cursor-pointer"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-3 rounded-lg cursor-pointer bg-zinc-800 hover:bg-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <AiOutlineRight />
        </button>
      </div>
    );
  };

  const galleryImages =
    selectedRestaurant?.photos ||
    selectedRestaurant?.images ||
    (selectedRestaurant ? [selectedRestaurant.image] : []);

  const FeaturedRestaurantsSection = () => {
    const featured = restaurantsData.filter((r) => r.rating >= 4.5).slice(0, 3);
    if (featured.length === 0 && restaurantsData.length > 0) {
      featured.push(
        ...restaurantsData.slice(0, Math.min(3, restaurantsData.length))
      );
    }
    if (featured.length === 0) return null;

    return (
      <section className="py-16 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-white">
              Featured Restaurants
            </h2>
            <button
              onClick={() => {
                setSelectedRating("4.5");

                setSelectedCuisine("All");
                setSelectedPrice("All");
                setSearchTerm("");
                setShowFavorites(false);

                setCurrentSection("restaurants");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-red-400 cursor-pointer hover:text-red-300 font-medium transition-colors flex items-center"
            >
              View All Highly Rated <BsChevronRight className="ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((restaurant, idx) => (
              <RestaurantCard
                restaurant={restaurant}
                index={idx}
                key={restaurant.id}
              />
            ))}
          </div>
        </div>
      </section>
    );
  };

  const DiscoverByCuisineSection = () => (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Discover by Cuisine
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine.name}
              onClick={() => {
                setSelectedCuisine(cuisine.name);

                setSelectedPrice("All");
                setSelectedRating("All");
                setSearchTerm("");
                setShowFavorites(false);

                setCurrentSection("restaurants");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group flex cursor-pointer flex-col items-center p-6 bg-zinc-800/60 rounded-xl hover:bg-red-500/30 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-red-500/20 border border-zinc-700/50 hover:border-red-500/50"
            >
              <div className="text-4xl mb-3 text-red-400 group-hover:text-white transition-colors">
                {cuisine.icon}
              </div>
              <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                {cuisine.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );

  const MemoizedLatestReviewsSection = React.memo(
    ({
      reviews,
      onLike,
      onHelpful,
      onRestaurantClick,
    }: {
      reviews: (Review & {
        restaurantName: string;
        restaurantImage?: string;
        restaurantId: number;
      })[];
      onLike: (
        reviewId: number,
        restaurantId: number,
        event: React.MouseEvent
      ) => void;
      onHelpful: (
        reviewId: number,
        restaurantId: number,
        event: React.MouseEvent
      ) => void;
      onRestaurantClick: (restaurantId: number) => void;
    }) => {
      if (reviews.length === 0) return null;
      return (
        <section className="py-16 bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-zinc-800/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Latest Buzz
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-gradient-to-br from-zinc-800/90 via-zinc-800/70 to-zinc-700/50 p-6 rounded-2xl shadow-2xl border border-zinc-600/30 transform transition-all duration-300 hover:shadow-red-500/20 hover:border-red-500/50 hover:-translate-y-2 backdrop-blur-sm"
                >
                  <div className="flex items-start mb-4">
                    <img
                      src={review.userAvatar}
                      alt={review.author}
                      className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-red-500/70 shadow-lg"
                      onError={(e) =>
                        (e.currentTarget.src = `https://i.pravatar.cc/150?u=defaultReviewer`)
                      }
                    />
                    <div>
                      <h4 className="font-semibold text-white">
                        {review.author}
                      </h4>
                      <p className="text-xs text-zinc-400">
                        Reviewed{" "}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (review.restaurantId)
                              onRestaurantClick(review.restaurantId);
                          }}
                          className="text-red-400 cursor-pointer hover:underline font-medium"
                        >
                          {review.restaurantName}
                        </button>{" "}
                        on {review.date}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center text-sm text-yellow-400">
                      {renderStars(review.rating, "text-sm")}
                      <span className="ml-1 font-bold">
                        ({review.rating.toFixed(1)})
                      </span>
                    </div>
                  </div>
                  <p className="text-zinc-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {review.text}
                  </p>
                  <div className="flex justify-between items-center text-xs text-zinc-400">
                    <div className="flex gap-4">
                      <button
                        onClick={(e) =>
                          review.restaurantId &&
                          onLike(review.id, review.restaurantId, e)
                        }
                        className={`flex items-center cursor-pointer hover:text-red-400 transition-colors ${review.likedByUser ? "text-red-500" : "text-zinc-500"
                          }`}
                        aria-label="Like review"
                      >
                        <FaHeart className="mr-1" /> {review.likes}
                      </button>
                      <button
                        onClick={(e) =>
                          review.restaurantId &&
                          onHelpful(review.id, review.restaurantId, e)
                        }
                        className={`flex items-center cursor-pointer transition-colors ${review.votedHelpfulByUser
                          ? "text-green-500"
                          : "text-zinc-500 hover:text-green-400"
                          }`}
                        aria-label="Mark as helpful"
                      >
                        <FaRegSmileWink className="mr-1" />{" "}
                        {review.helpfulCount || 0}
                      </button>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (review.restaurantId)
                          onRestaurantClick(review.restaurantId);
                      }}
                      className="text-red-400 cursor-pointer hover:text-red-300 font-medium transition-colors"
                    >
                      Read Full Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
  );
  MemoizedLatestReviewsSection.displayName = "MemoizedLatestReviewsSection";

  const SpecialOffersSection = () => {
    const offers = restaurantsData.filter((r) => r.specialOffer).slice(0, 3);
    if (offers.length === 0) return null;

    return (
      <section className="py-16 relative overflow-hidden">
        {/* Background with floating elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-yellow-500/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              🔥 Hot Deals & Exclusive Offers
            </h2>
            <p className="text-zinc-400 text-lg">
              Limited time offers you don't want to miss!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offers.map((restaurant) => {
              const isClaimed = claimedOffers.has(restaurant.id);
              return (
                <div
                  key={restaurant.id}
                  className="group bg-gradient-to-br from-red-600/90 via-red-500/80 to-orange-500/90 p-8 rounded-2xl shadow-2xl text-white relative overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-red-500/50 h-full flex flex-col"
                >
                  {/* Animated background elements */}
                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-700"></div>
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full opacity-30 group-hover:scale-110 transition-transform duration-500"></div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center mb-4">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-20 h-20 rounded-xl object-cover mr-4 border-3 border-white/50 shadow-lg group-hover:border-white transition-colors duration-300"
                        onError={(e) =>
                        (e.currentTarget.src =
                          "https://placehold.co/80x80/fff/e04040?text=Offer")
                        }
                      />
                      <div>
                        <h3 className="text-2xl font-bold mb-1">
                          {restaurant.name}
                        </h3>
                        <p className="text-white/80 text-sm font-medium">
                          {restaurant.cuisine} • {restaurant.location}
                        </p>
                      </div>
                    </div>
                    <div className="mb-6 flex-grow flex flex-col">
                      <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-3 w-fit">
                        <span className="text-sm font-bold text-white">🎉 SPECIAL OFFER</span>
                      </div>
                      <div className="flex-grow flex items-center">
                        <p className="text-xl font-semibold leading-relaxed">
                          {restaurant.specialOffer}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClaimOffer(restaurant.id, restaurant.name);
                      }}
                      disabled={isClaimed}
                      className={`w-full cursor-pointer font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg text-lg mt-auto ${isClaimed
                        ? "bg-green-500/90 text-white cursor-not-allowed transform scale-95"
                        : "bg-white/95 text-red-600 hover:bg-white hover:scale-105 hover:shadow-xl active:scale-95"
                        }`}
                    >
                      {isClaimed ? (
                        <span className="flex items-center justify-center">
                          <FaCheckCircle className="mr-2 text-xl" />
                          Offer Claimed Successfully!
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <MdOutlineLocalOffer className="mr-2 text-xl" />
                          Claim This Amazing Offer
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  const latestReviewsForMemo = React.useMemo(() => {
    return restaurantsData
      .flatMap((r) =>
        r.reviews
          ? r.reviews.map((review) => ({
            ...review,
            restaurantName: r.name,
            restaurantImage: r.image,
            restaurantId: r.id,
          }))
          : []
      )
      .sort((a, b) => {
        const dateA = new Date(a.date.split("/").reverse().join("-")).getTime();
        const dateB = new Date(b.date.split("/").reverse().join("-")).getTime();
        return dateB - dateA;
      })
      .slice(0, 4);
  }, [restaurantsData]);

  const handleLikeReviewLatestBuzz = useCallback(
    (reviewId: number, restaurantId: number, event: React.MouseEvent) => {
      event.stopPropagation();
      handleLikeReview(reviewId, restaurantId);
    },
    [handleLikeReview]
  );

  const handleHelpfulClickLatestBuzz = useCallback(
    (reviewId: number, restaurantId: number, event: React.MouseEvent) => {
      event.stopPropagation();
      handleHelpfulClick(reviewId, restaurantId);
    },
    [handleHelpfulClick]
  );

  return (
    <>
      <Head>
        <title>
          PlateKing - Discover & Review Restaurants | Best Restaurant Discovery
          Platform
        </title>
        <meta
          name="description"
          content="Discover top-rated restaurants, read authentic reviews, and find your next favorite dining experience. From fine dining to casual eats, explore the best restaurants near you."
        />
        <meta
          name="keywords"
          content="restaurants, dining, food, cuisine, restaurant reviews, food discovery, dining experience, restaurant booking, food ratings"
        />
        <meta name="author" content="PlateKing" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#ef4444" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="PlateKing - Your Ultimate Restaurant Discovery Platform"
        />
        <meta
          property="og:description"
          content="Find and review the best restaurants near you. Get personalized recommendations, read authentic reviews, and discover culinary gems."
        />
        <meta
          property="og:image"
          content="https://plateking.com/og-image.jpg"
        />
        <meta property="og:url" content="https://plateking.com" />
        <meta property="og:site_name" content="PlateKing" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="PlateKing - Discover Amazing Restaurants"
        />
        <meta
          name="twitter:description"
          content="Your personal guide to finding the perfect dining experience. Browse restaurants, read reviews, and discover culinary delights."
        />
        <meta
          name="twitter:image"
          content="https://plateking.com/twitter-image.jpg"
        />
        <meta name="twitter:creator" content="@plateking" />

        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href="https://plateking.com" />
        <meta name="application-name" content="PlateKing" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="PlateKing" />
      </Head>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}

      <main
        className={`min-h-screen bg-black text-white selection:bg-red-500 selection:text-white`}
        style={{
          fontFamily: "'Poppins', system-ui, -apple-system, sans-serif",
        }}
      >
        <style jsx global>{`
          * {
            font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont,
              "Segoe UI", Roboto, sans-serif;
          }

          body {
            font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont,
              "Segoe UI", Roboto, sans-serif;
            font-weight: 400;
            letter-spacing: -0.01em;
          }

          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont,
              "Segoe UI", Roboto, sans-serif;
            font-weight: 600;
            letter-spacing: -0.02em;
          }

          .font-display {
            font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont,
              "Segoe UI", Roboto, sans-serif;
            font-weight: 700;
            letter-spacing: -0.03em;
          }

          @keyframes slideInRight {
            0% {
              opacity: 0;
              transform: translateX(100%);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .animate-slideInRight {
            animation: slideInRight 0.3s ease-out forwards;
          }

          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(-10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }

          @keyframes slideInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slideInUp {
            animation: slideInUp 0.5s ease-out forwards;
          }

          .shadow-text {
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          }

          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
          }
          .modal-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow-y: auto;
            overflow-x: hidden;
          }
          .modal-content {
            position: relative;
            margin: 2vh auto;
            max-height: 96vh;
            overflow: hidden;
          }
          .modal-scroll-area {
            overflow-y: auto;
            overflow-x: hidden;
            max-height: calc(96vh - 200px);
            scroll-behavior: smooth;
          }
          .modal-scroll-area::-webkit-scrollbar {
            width: 8px;
          }
          .modal-scroll-area::-webkit-scrollbar-track {
            background: rgba(55, 65, 81, 0.5);
            border-radius: 10px;
          }
          .modal-scroll-area::-webkit-scrollbar-thumb {
            background: #ef4444;
            border-radius: 10px;
          }
          .modal-scroll-area::-webkit-scrollbar-thumb:hover {
            background: #dc2626;
          }

          .modal-form-element {
            scroll-margin-top: 100px;
          }

          .modal-button {
            outline: none !important;
            user-select: none;
          }
          .modal-button:focus {
            outline: none !important;
            box-shadow: none !important;
          }

          .styled-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .styled-scrollbar::-webkit-scrollbar-track {
            background: transparent;
            border-radius: 10px;
          }
          .styled-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(107, 114, 128, 0.5);
            border-radius: 10px;
          }
          .styled-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(156, 163, 175, 0.7);
          }
        `}</style>

        <header className="py-4 px-4 sticky top-0 z-[1000] border-b border-zinc-800/70 bg-black/90 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto flex items-center h-12">
            <div className="flex-1 flex justify-start">
              <div
                className="flex items-center cursor-pointer group"
                onClick={() => {
                  setCurrentSection("home");
                  setIsMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <RiRestaurantLine className="text-3xl text-red-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <h1 className="text-2xl font-extrabold tracking-tight font-display">
                  <span className="text-white group-hover:text-zinc-200 transition-colors duration-300">Plate</span>
                  <span className="text-red-500 group-hover:text-red-400 transition-colors duration-300">King</span>
                </h1>
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <nav className="hidden md:flex items-center space-x-2">
                {["Home", "Restaurants", "Favorites"].map(
                  (item) => {
                    const lowerItem = item.toLowerCase();

                    const isSelected = (() => {
                      // Check most specific conditions first
                      if (lowerItem === "favorites" && showFavorites) return true;
                      if (lowerItem === "restaurants" && currentSection === "restaurants" && !showFavorites) return true;
                      if (lowerItem === "home" && currentSection === "home" && !showFavorites && !scrollToSectionId) return true;
                      return false;
                    })();

                    return (
                      <button
                        key={item}
                        onClick={() => {
                          if (lowerItem === "home") {
                            setCurrentSection("home");
                            setScrollToSectionId(null);
                            setShowFavorites(false); // Clear favorites state
                            window.history.replaceState(null, '', window.location.pathname);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          } else if (lowerItem === "restaurants") {
                            setSearchTerm("");
                            setSelectedCuisine("All");
                            setSelectedPrice("All");
                            setSelectedRating("All");
                            setShowFavorites(false);
                            setCurrentPage(1);
                            setCurrentSection("restaurants");
                            setScrollToSectionId(null);
                            window.history.replaceState(null, '', window.location.pathname);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          } else if (lowerItem === "favorites") {
                            setShowFavorites(true);
                            setSelectedCuisine("All");
                            setSelectedPrice("All");
                            setSelectedRating("All");
                            setSearchTerm("");
                            setCurrentPage(1);
                            setCurrentSection("restaurants");
                            setScrollToSectionId(null);
                            window.history.replaceState(null, '', window.location.pathname);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        }}
                        className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 cursor-pointer rounded-lg group overflow-hidden ${isSelected
                          ? "text-white bg-white/10"
                          : "text-zinc-300 hover:text-white hover:bg-white/5"
                          }`}
                      >
                        <span className="relative z-10">{item}</span>
                        <div className={`absolute inset-0 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-lg transition-transform duration-300 origin-left ${isSelected
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100 group-hover:from-red-500/20 group-hover:to-orange-500/20"
                          }`}></div>
                        {isSelected && (
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
                        )}
                      </button>
                    );
                  }
                )}
              </nav>
            </div>

            <div className="flex-1 flex justify-end items-center space-x-3">
              {currentSection === "restaurants" && (
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="hidden md:flex relative cursor-pointer items-center h-10 space-x-2 text-sm py-0 px-4 rounded-full bg-zinc-800/80 backdrop-blur-sm border border-zinc-700 hover:border-red-500 transition-all group"
                >
                  <MdOutlineSettingsSuggest className="text-zinc-400 group-hover:text-red-400 transition-colors" />
                  <span className="text-zinc-300 group-hover:text-white transition-colors">
                    Filters
                  </span>
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden cursor-pointer p-2 text-zinc-300 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <AiOutlineClose size={24} />
                ) : (
                  <AiOutlineMenu size={24} />
                )}
              </button>
            </div>
          </div>

          {isFilterOpen && currentSection === "restaurants" && (
            <div className="absolute top-full left-0 right-0 mt-px bg-black/95 backdrop-blur-xl border-b border-zinc-800/70 shadow-2xl z-[999] animate-fadeIn">
              <div className="max-w-7xl mx-auto p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-white">
                    Filter Options
                  </h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
                    aria-label="Close filter panel"
                  >
                    <AiOutlineClose size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-red-400 mb-2">
                      Search Term
                    </h3>
                    <input
                      type="text"
                      value={tempSearchTermInPanel}
                      onChange={(e) => setTempSearchTermInPanel(e.target.value)}
                      placeholder="Name, cuisine, location..."
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:border-red-500 text-white text-sm"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-red-400 mb-2">
                      Cuisine
                    </h3>
                    <select
                      value={tempSelectedCuisine}
                      onChange={(e) => setTempSelectedCuisine(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:border-red-500 text-white text-sm"
                    >
                      {cuisines.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-red-400 mb-2">
                      Price Range
                    </h3>
                    <select
                      value={tempSelectedPrice}
                      onChange={(e) => setTempSelectedPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:border-red-500 text-white text-sm"
                    >
                      {priceRanges.map((p) => (
                        <option key={p} value={p}>
                          {p === "All" ? "Any Price" : p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-red-400 mb-2">
                      Min. Rating
                    </h3>
                    <select
                      value={tempSelectedRating}
                      onChange={(e) => setTempSelectedRating(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:border-red-500 text-white text-sm"
                    >
                      {ratings.map((r) => (
                        <option key={r} value={r}>
                          {r === "All" ? "Any Rating" : `${r}+ Stars`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="flex items-center text-sm text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempShowFavorites}
                      onChange={(e) => setTempShowFavorites(e.target.checked)}
                      className="mr-2 h-4 w-4 rounded text-red-500 focus:ring-red-500/50 border-zinc-600 bg-zinc-700"
                    />
                    Show Favorites Only
                  </label>
                </div>
                <div className="flex flex-col md:flex-row justify-end items-center mt-6 space-y-3 md:space-y-0 md:space-x-3">
                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => {
                        clearAllActiveFilters();
                        setIsFilterOpen(false);
                      }}
                      className="w-full md:w-auto px-4 py-2 text-sm text-red-400 hover:text-red-300 rounded-md transition-colors cursor-pointer"
                    >
                      Clear All Filters ({activeFilterCount})
                    </button>
                  )}
                  <button
                    onClick={handleApplyFilters}
                    className="w-full md:w-auto px-6 py-2 text-sm bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors cursor-pointer"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[1001] md:hidden">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <div className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-zinc-900 border-l border-zinc-800/70 shadow-2xl animate-slideInRight flex flex-col">
              <div className="flex-shrink-0 flex justify-between items-center p-6 border-b border-zinc-800/70">
                <div className="flex items-center">
                  <RiRestaurantLine className="text-2xl text-red-500 mr-2" />
                  <span className="text-lg font-bold text-white font-display">
                    PlateKing
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close mobile menu"
                >
                  <AiOutlineClose size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto styled-scrollbar">
                <nav className="p-6">
                  <ul className="space-y-1">
                    {[
                      "Home",
                      "Restaurants",
                      "Cuisines",
                      "Offers",
                      "Favorites",
                    ].map((item) => (
                      <li key={item}>
                        <button
                          onClick={() => {
                            const lowerItem = item.toLowerCase();
                            setIsMobileMenuOpen(false);

                            if (lowerItem === "home") {
                              setCurrentSection("home");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            } else if (lowerItem === "restaurants") {
                              setSearchTerm("");
                              setSelectedCuisine("All");
                              setSelectedPrice("All");
                              setSelectedRating("All");
                              setShowFavorites(false);
                              setCurrentPage(1);
                              setCurrentSection("restaurants");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            } else if (lowerItem === "cuisines") {
                              if (currentSection === "home") {
                                document
                                  .getElementById("discover-cuisine")
                                  ?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                  });
                              } else {
                                setCurrentSection("home");
                                setScrollToSectionId("discover-cuisine");
                              }
                            } else if (lowerItem === "offers") {
                              if (currentSection === "home") {
                                document
                                  .getElementById("special-offers")
                                  ?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                  });
                              } else {
                                setCurrentSection("home");
                                setScrollToSectionId("special-offers");
                              }
                            } else if (lowerItem === "favorites") {
                              setShowFavorites(true);
                              setSelectedCuisine("All");
                              setSelectedPrice("All");
                              setSelectedRating("All");
                              setSearchTerm("");
                              setCurrentPage(1);
                              setCurrentSection("restaurants");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }
                          }}
                          className="w-full text-left px-4 py-3 text-zinc-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 flex items-center cursor-pointer"
                        >
                          <span className="font-medium">{item}</span>
                          <BsChevronRight
                            className="ml-auto text-zinc-500"
                            size={16}
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>

                {currentSection === "restaurants" && (
                  <div className="border-t border-zinc-800/70 p-6 mt-auto">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Filter Options
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          setIsFilterOpen(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full cursor-pointer bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
                      >
                        <MdOutlineSettingsSuggest className="mr-2" />
                        Open Filter Panel
                      </button>

                      {activeFilterCount > 0 && (
                        <button
                          onClick={() => {
                            clearAllActiveFilters();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                          Clear All Applied Filters ({activeFilterCount})
                        </button>
                      )}
                    </div>
                  </div>
                )}
                <div className="h-6"></div>
              </div>
            </div>
          </div>
        )}

        {currentSection === "home" && (
          <>
            <HeroSection
              searchTerm={searchTerm}
              handleSearch={handleSearch}
              isSearchFocused={isSearchFocused}
              setIsSearchFocused={setIsSearchFocused}
              allRestaurants={restaurantsData}
              handleRestaurantClick={handleRestaurantClick}
              searchContainerRef={searchContainerRef}
              suggestionsRef={suggestionsRef}
            />
            <div id="discover-cuisine">
              <DiscoverByCuisineSection />
            </div>
            <FeaturedRestaurantsSection />
            <div id="special-offers">
              <SpecialOffersSection />
            </div>
            <MemoizedLatestReviewsSection
              reviews={latestReviewsForMemo}
              onLike={handleLikeReviewLatestBuzz}
              onHelpful={handleHelpfulClickLatestBuzz}
              onRestaurantClick={handleRestaurantClick}
            />
          </>
        )}

        {(currentSection === "restaurants" ||
          (currentSection === "home" && searchTerm)) && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <h2 className="text-3xl font-bold text-white mb-2">
                {showFavorites
                  ? "My Favorite Restaurants"
                  : "Explore Restaurants"}
              </h2>
              <p className="text-zinc-400 mb-8 text-sm">
                {filteredRestaurants.length} restaurant
                {filteredRestaurants.length !== 1 && "s"} found.
                {(selectedCuisine !== "All" ||
                  selectedPrice !== "All" ||
                  selectedRating !== "All" ||
                  debouncedSearchTerm ||
                  showFavorites) &&
                  " (Based on your filters)"}
              </p>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(itemsPerPage)].map((_, index) => (
                    <div
                      key={index}
                      className="bg-zinc-800/50 rounded-xl overflow-hidden animate-pulse border border-zinc-700/50"
                    >
                      <div className="h-56 bg-zinc-700"></div>
                      <div className="p-5">
                        <div className="h-6 bg-zinc-700 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-zinc-700 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-zinc-700 rounded w-full mb-2"></div>
                        <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {filteredRestaurants.length === 0 &&
                    (debouncedSearchTerm || activeFilterCount > 0) ? (
                    <div className="text-center py-16 bg-zinc-800/30 rounded-xl border border-dashed border-zinc-700/50">
                      <RiEmotionHappyLine className="text-6xl text-red-500/70 mx-auto mb-4" />
                      <p className="text-xl font-semibold text-zinc-300 mb-2">
                        No Restaurants Found{" "}
                        {debouncedSearchTerm && `for "${debouncedSearchTerm}"`}
                      </p>
                      <p className="text-zinc-400 text-sm">
                        Try adjusting your search or filters.
                      </p>
                      {activeFilterCount > 0 && (
                        <button
                          onClick={clearAllActiveFilters}
                          className="mt-6 px-5 py-2.5 cursor-pointer text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                        >
                          Clear Applied Filters
                        </button>
                      )}
                    </div>
                  ) : filteredRestaurants.length === 0 ? (
                    <div className="text-center py-16 bg-zinc-800/30 rounded-xl border border-dashed border-zinc-700/50">
                      <RiRestaurantLine className="text-6xl text-red-500/70 mx-auto mb-4" />
                      <p className="text-xl font-semibold text-zinc-300 mb-2">
                        No Restaurants Available
                      </p>
                      <p className="text-zinc-400 text-sm">
                        Check back later or try a different search.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredRestaurants
                        .slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage
                        )
                        .map((restaurant, idx) => (
                          <RestaurantCard
                            restaurant={restaurant}
                            index={idx}
                            key={restaurant.id}
                          />
                        ))}
                    </div>
                  )}
                  <Pagination />
                </>
              )}
            </div>
          )}

        {isModalOpen && selectedRestaurant && (
          <>
            <div
              className="modal-overlay z-[2000] flex items-center justify-center backdrop-blur-md animate-fadeIn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsModalOpen(false);
              }}
            >
              <div
                className="modal-container"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content w-full max-w-5xl bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-700/70 flex flex-col mx-4 animate-slideInUp">
                  <button
                    className="absolute cursor-pointer top-5 right-5 p-2.5 text-zinc-400 hover:text-white bg-black/50 rounded-full transition-colors z-50 backdrop-blur-sm modal-button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsModalOpen(false);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    aria-label="Close restaurant details"
                  >
                    <AiOutlineClose size={20} />
                  </button>

                  <div className="flex-shrink-0 h-[35vh] md:h-[45vh] relative overflow-hidden">
                    {galleryImages.map((imgUrl, index) => (
                      <img
                        key={index}
                        src={
                          imgUrl ||
                          "https://placehold.co/1200x600/222/fff?text=Restaurant"
                        }
                        alt={`${selectedRestaurant.name} gallery image ${index + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${index === activeImageIndex
                          ? "opacity-100"
                          : "opacity-0"
                          }`}
                        onError={(e) =>
                        (e.currentTarget.src =
                          "https://placehold.co/1200x600/222/fff?text=No+Image")
                        }
                      />
                    ))}

                    {/* Enhanced gradient overlay - darker in bottom half for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/95 via-zinc-900/70 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-900/80"></div>

                    {galleryImages.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveImageIndex(
                              (prevIndex) =>
                                (prevIndex - 1 + galleryImages.length) %
                                galleryImages.length
                            );
                          }}
                          onMouseDown={(e) => e.preventDefault()}
                          className="absolute cursor-pointer left-2 md:left-4 top-1/3 -translate-y-1/2 p-2 md:p-3 bg-black/40 text-white rounded-full hover:bg-black/70 transition-colors z-20 backdrop-blur-sm modal-button"
                          aria-label="Previous image"
                        >
                          <AiOutlineLeft size={20} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveImageIndex(
                              (prevIndex) =>
                                (prevIndex + 1) % galleryImages.length
                            );
                          }}
                          onMouseDown={(e) => e.preventDefault()}
                          className="absolute right-2 md:right-4 top-1/ -translate-y-1/2 p-2 md:p-3 bg-black/40 text-white rounded-full hover:bg-black/70 transition-colors z-20 backdrop-blur-sm modal-button cursor-pointer"
                          aria-label="Next image"
                        >
                          <AiOutlineRight size={20} />
                        </button>
                        <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                          {galleryImages.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2.5 h-2.5 rounded-full transition-all ${index === activeImageIndex
                                ? "bg-red-500 scale-125"
                                : "bg-white/50"
                                }`}
                            ></div>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="absolute top-4 left-4 right-20 p-4 z-10">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="px-3 py-1.5 bg-red-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow-lg">
                          {selectedRestaurant.cuisine}
                        </span>
                        <span className="px-3 py-1.5 bg-zinc-700/90 backdrop-blur-sm text-zinc-200 text-xs font-semibold rounded-full shadow-lg">
                          {selectedRestaurant.priceRange}
                        </span>
                        {selectedRestaurant.openNow !== undefined && (
                          <span
                            className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm ${selectedRestaurant.openNow
                              ? "bg-green-600/90 text-white"
                              : "bg-orange-600/90 text-white"
                              }`}
                          >
                            {selectedRestaurant.openNow ? "Open Now" : "Closed"}
                          </span>
                        )}
                        {selectedRestaurant.claimed && (
                          <span className="px-3 py-1.5 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow-lg flex items-center">
                            <MdOutlineVerified className="mr-1" /> Claimed
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="absolute top-1/2 left-0 right-0 bottom-0 p-6 md:p-8 z-10 flex flex-col justify-end bg-gradient-to-n from-zinc-900/95 via-zinc-900/80 to-transparent">
                      <div className="space-y-4">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 shadow-text leading-tight">
                          {selectedRestaurant.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-300">
                          <div className="flex items-center">
                            {renderStars(selectedRestaurant.rating)}
                            <span className="ml-1.5 font-semibold">
                              ({selectedRestaurant.rating.toFixed(1)})
                            </span>
                            <span className="ml-1 text-zinc-400">
                              ({selectedRestaurant.reviewsCount} reviews)
                            </span>
                          </div>
                          <div className="flex items-center">
                            <IoLocationSharp className="mr-1 text-red-400" />
                            {selectedRestaurant.location}
                          </div>
                        </div>
                        {selectedRestaurant.description && (
                          <p className="text-zinc-300 text-sm leading-relaxed line-clamp-2 max-w-3xl">
                            {selectedRestaurant.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(selectedRestaurant.id);
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      className="absolute cursor-pointer top-5 right-20 p-2.5 bg-black/50 rounded-full text-white hover:text-red-400 transition-colors z-50 backdrop-blur-sm modal-button"
                      aria-label={
                        selectedRestaurant.isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      {selectedRestaurant.isFavorite ? (
                        <FaHeart className="text-red-500 text-xl" />
                      ) : (
                        <FaRegHeart className="text-xl" />
                      )}
                    </button>
                  </div>

                  <div className="modal-scroll-area p-6 md:p-8">
                    <RestaurantModalScrollableContent
                      restaurant={selectedRestaurant}
                      handleLikeReview={handleLikeReview}
                      handleHelpfulClick={handleHelpfulClick}
                      onLoadMoreReviews={handleLoadMoreReviews}
                      onSubmitReview={handleSubmitReview}
                      newReviewRating={newReviewRating}
                      setNewReviewRating={setNewReviewRating}
                      visibleReviewsCount={visibleReviews}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="bg-zinc-900 border-t border-zinc-800/70 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-3">
                <RiRestaurantLine className="text-3xl text-red-500 mr-2" />
                <h3 className="text-xl font-bold text-white font-display">
                  PlateKing
                </h3>
              </div>
              <p className="text-sm text-zinc-400">
                Your ultimate guide to discovering amazing dining experiences.
              </p>
              <div className="flex space-x-4 mt-4">
                {[FaFacebook, FaTwitter, FaInstagram].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                    aria-label={`Follow us on ${Icon === FaFacebook
                      ? "Facebook"
                      : Icon === FaTwitter
                        ? "Twitter"
                        : "Instagram"
                      }`}
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-md font-semibold text-white mb-3">
                Quick Links
              </h4>
              <ul className="space-y-2 text-sm">
                {["Home", "Restaurants", "Cuisines", "Offers", "Favorites"].map(
                  (item) => (
                    <li key={item}>
                      <button
                        onClick={() => {
                          const lowerItem = item.toLowerCase();
                          if (lowerItem === "home") {
                            setCurrentSection("home");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          } else if (lowerItem === "restaurants") {
                            setSearchTerm("");
                            setSelectedCuisine("All");
                            setSelectedPrice("All");
                            setSelectedRating("All");
                            setShowFavorites(false);
                            setCurrentPage(1);
                            setCurrentSection("restaurants");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          } else if (lowerItem === "cuisines") {
                            if (currentSection === "home") {
                              document
                                .getElementById("discover-cuisine")
                                ?.scrollIntoView({
                                  behavior: "smooth",
                                  block: "start",
                                });
                            } else {
                              setCurrentSection("home");
                              setScrollToSectionId("discover-cuisine");
                            }
                          } else if (lowerItem === "offers") {
                            if (currentSection === "home") {
                              document
                                .getElementById("special-offers")
                                ?.scrollIntoView({
                                  behavior: "smooth",
                                  block: "start",
                                });
                            } else {
                              setCurrentSection("home");
                              setScrollToSectionId("special-offers");
                            }
                          } else if (lowerItem === "favorites") {
                            setShowFavorites(true);
                            setSelectedCuisine("All");
                            setSelectedPrice("All");
                            setSelectedRating("All");
                            setSearchTerm("");
                            setCurrentPage(1);
                            setCurrentSection("restaurants");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        }}
                        className="text-zinc-400 cursor-pointer hover:text-red-400 transition-colors"
                      >
                        {item}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold text-white mb-3">
                Contact Us
              </h4>
              <p className="text-sm text-zinc-400 mb-1">
                123 Culinary Ave, Foodie City
              </p>
              <p className="text-sm text-zinc-400 mb-1">
                Email:{" "}
                <a className="hover:text-red-400 cursor-pointer">info@plateking.example</a>
              </p>
              <p className="text-sm text-zinc-400">
                Phone: <a className="hover:text-red-400 cursor-pointer">+1 (234) 567-890</a>
              </p>
            </div>
          </div>
          <div className="border-t border-zinc-700/50 pt-8 text-center">
            <p className="text-sm text-zinc-500">
              &copy; {new Date().getFullYear()} PlateKing. All rights reserved.
              Crafted with <FaHeart className="inline text-red-500" /> by AI.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default App;


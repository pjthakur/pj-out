"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Star,
  StarHalf,
  MapPin,
  Clock,
  X,
  Moon,
  Sun,
  Camera,
  Send,
  Menu,
} from "lucide-react";
import { Playfair_Display, Montserrat } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

type ThemeType = "light" | "dark";
type ThemeColors = {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  card: string;
  border: string;
  input: string;
  rating: string;
  success: string;
  warning: string;
  error: string;
  overlay: string;
};

const themeConfig: Record<ThemeType, ThemeColors> = {
  light: {
    background: "bg-[#f8f9fa]",
    foreground: "text-[#212529]",
    primary: "bg-[#e63946]",
    secondary: "bg-[#457b9d]",
    accent: "text-[#e63946]",
    muted: "text-[#6c757d]",
    card: "bg-white",
    border: "border-[#dee2e6]",
    input: "bg-white",
    rating: "text-[#ffc107]",
    success: "bg-[#28a745]",
    warning: "bg-[#ffc107]",
    error: "bg-[#dc3545]",
    overlay: "bg-black/50",
  },
  dark: {
    background: "bg-[#121212]",
    foreground: "text-[#f8f9fa]",
    primary: "bg-[#e63946]",
    secondary: "bg-[#457b9d]",
    accent: "text-[#e63946]",
    muted: "text-[#adb5bd]",
    card: "bg-[#1e1e1e]",
    border: "border-[#2d2d2d]",
    input: "bg-[#2d2d2d]",
    rating: "text-[#ffc107]",
    success: "bg-[#28a745]",
    warning: "bg-[#ffc107]",
    error: "bg-[#dc3545]",
    overlay: "bg-black/70",
  },
};

type Cuisine =
  | "Italian"
  | "Japanese"
  | "Mexican"
  | "Indian"
  | "American"
  | "Thai"
  | "French"
  | "Chinese"
  | "Mediterranean"
  | "Korean";
type PriceRange = "$" | "$$" | "$$$" | "$$$$";
type Category =
  | "Trending"
  | "Budget-friendly"
  | "Family spots"
  | "Late-night eats"
  | "Date night"
  | "Healthy options";
type Location =
  | "Downtown"
  | "Uptown"
  | "Midtown"
  | "West End"
  | "East Side"
  | "Waterfront"
  | "Suburbs";

interface Dish {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  popular: boolean;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  images: string[];
  likes: number;
  dishes: string[];
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: Cuisine;
  priceRange: PriceRange;
  location: Location;
  address: string;
  phone: string;
  website: string;
  hours: {
    open: string;
    close: string;
  };
  rating: number;
  reviewCount: number;
  images: string[];
  categories: Category[];
  dishes: Dish[];
  reviews: Review[];
  featured: boolean;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  reviewCount: number;
  favoriteRestaurants: string[];
}

const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Bella Napoli",
    description:
      "Authentic Neapolitan pizzas and traditional Italian dishes in a cozy, rustic setting with a wood-fired oven.",
    cuisine: "Italian",
    priceRange: "$$",
    location: "Downtown",
    address: "123 Main St, Cityville",
    phone: "(555) 123-4567",
    website: "www.bellanapoli.com",
    hours: {
      open: "11:00 AM",
      close: "10:00 PM",
    },
    rating: 4.7,
    reviewCount: 342,
    images: [
      "https://images.unsplash.com/photo-1579684947550-22e945225d9a?q=80&w=2574&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2681&auto=format&fit=crop",
    ],
    categories: ["Trending", "Family spots"],
    dishes: [
      {
        id: "d1",
        name: "Margherita Pizza",
        price: 14.99,
        description:
          "Classic pizza with tomato sauce, fresh mozzarella, and basil",
        image:
          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=2669&auto=format&fit=crop",
        popular: true,
      },
      {
        id: "d2",
        name: "Spaghetti Carbonara",
        price: 16.99,
        description:
          "Pasta with pancetta, eggs, Pecorino Romano, and black pepper",
        image:
          "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=2671&auto=format&fit=crop",
        popular: true,
      },
    ],
    reviews: [
      {
        id: "r1",
        userId: "u1",
        userName: "Emma Wilson",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
        rating: 5,
        comment:
          "The pizza here is absolutely amazing! Authentic Italian flavors that transported me straight to Naples. The crust was perfectly crispy yet chewy. Will definitely be back!",
        date: "2023-11-15",
        images: [
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2681&auto=format&fit=crop",
        ],
        likes: 24,
        dishes: ["Margherita Pizza"],
      },
    ],
    featured: true,
  },
  {
    id: "2",
    name: "Sakura Sushi",
    description:
      "Premium Japanese sushi restaurant offering the freshest fish and traditional dishes in an elegant atmosphere.",
    cuisine: "Japanese",
    priceRange: "$$$",
    location: "Waterfront",
    address: "456 Ocean Ave, Cityville",
    phone: "(555) 987-6543",
    website: "www.sakurasushi.com",
    hours: {
      open: "12:00 PM",
      close: "11:00 PM",
    },
    rating: 4.9,
    reviewCount: 528,
    images: [
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=2625&auto=format&fit=crop",
    ],
    categories: ["Trending", "Date night"],
    dishes: [
      {
        id: "d3",
        name: "Omakase Set",
        price: 89.99,
        description: "Chef's selection of premium sushi and sashimi",
        image:
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=2688&auto=format&fit=crop",
        popular: true,
      },
      {
        id: "d4",
        name: "Dragon Roll",
        price: 18.99,
        description: "Eel, avocado, and cucumber roll topped with avocado",
        image:
          "https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=2670&auto=format&fit=crop",
        popular: false,
      },
    ],
    reviews: [
      {
        id: "r2",
        userId: "u2",
        userName: "James Chen",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop",
        rating: 5,
        comment:
          "Best sushi in town! The fish is incredibly fresh and the presentation is beautiful. The omakase experience is worth every penny.",
        date: "2023-12-03",
        images: [
          "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2670&auto=format&fit=crop",
        ],
        likes: 42,
        dishes: ["Omakase Set"],
      },
    ],
    featured: true,
  },
  {
    id: "3",
    name: "El Camino",
    description:
      "Vibrant Mexican cantina serving authentic tacos, enchiladas, and margaritas in a colorful, festive environment.",
    cuisine: "Mexican",
    priceRange: "$$",
    location: "Midtown",
    address: "789 Central Blvd, Cityville",
    phone: "(555) 456-7890",
    website: "www.elcamino.com",
    hours: {
      open: "11:30 AM",
      close: "12:00 AM",
    },
    rating: 4.5,
    reviewCount: 287,
    images: [
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=2680&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1613514785940-daed07799d9b?q=80&w=2680&auto=format&fit=crop",
    ],
    categories: ["Budget-friendly", "Late-night eats"],
    dishes: [
      {
        id: "d5",
        name: "Street Tacos",
        price: 12.99,
        description:
          "Three authentic corn tortilla tacos with your choice of meat",
        image:
          "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=2670&auto=format&fit=crop",
        popular: true,
      },
      {
        id: "d6",
        name: "Enchiladas Verdes",
        price: 15.99,
        description:
          "Chicken enchiladas with green tomatillo sauce and queso fresco",
        image:
          "https://images.unsplash.com/photo-1534352956036-cd81e27dd615?q=80&w=2670&auto=format&fit=crop",
        popular: false,
      },
    ],
    reviews: [
      {
        id: "r3",
        userId: "u3",
        userName: "Sophia Rodriguez",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop",
        rating: 4,
        comment:
          "Great tacos and the margaritas are fantastic! The atmosphere is lively and fun. Only giving 4 stars because it can get pretty loud on weekends.",
        date: "2023-10-22",
        images: [
          "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=2680&auto=format&fit=crop",
        ],
        likes: 18,
        dishes: ["Street Tacos"],
      },
    ],
    featured: false,
  },
  {
    id: "4",
    name: "Spice Route",
    description:
      "Authentic Indian cuisine featuring flavorful curries, tandoori specialties, and fresh-baked naan in a warm, inviting space.",
    cuisine: "Indian",
    priceRange: "$$",
    location: "East Side",
    address: "321 Curry Lane, Cityville",
    phone: "(555) 789-0123",
    website: "www.spiceroute.com",
    hours: {
      open: "12:00 PM",
      close: "10:30 PM",
    },
    rating: 4.6,
    reviewCount: 203,
    images: [
      "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.unsplash.com/photo-1631515242808-497c3fbd3972?q=80&w=2788&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=2645&auto=format&fit=crop",
    ],
    categories: ["Family spots", "Budget-friendly"],
    dishes: [
      {
        id: "d7",
        name: "Butter Chicken",
        price: 17.99,
        description: "Tender chicken in a rich, creamy tomato sauce",
        image:
          "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=2670&auto=format&fit=crop",
        popular: true,
      },
      {
        id: "d8",
        name: "Vegetable Biryani",
        price: 15.99,
        description:
          "Fragrant basmati rice with mixed vegetables and aromatic spices",
        image:
          "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=2788&auto=format&fit=crop",
        popular: false,
      },
    ],
    reviews: [
      {
        id: "r4",
        userId: "u4",
        userName: "Raj Patel",
        userAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2787&auto=format&fit=crop",
        rating: 5,
        comment:
          "Absolutely delicious and authentic Indian food! The butter chicken is to die for, and the naan bread is perfectly baked. Generous portions too!",
        date: "2023-11-05",
        images: [
          "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        ],
        likes: 31,
        dishes: ["Butter Chicken"],
      },
    ],
    featured: false,
  },
  {
    id: "5",
    name: "The Burger Joint",
    description:
      "Classic American diner serving gourmet burgers, hand-cut fries, and creamy milkshakes in a nostalgic 50s-inspired setting.",
    cuisine: "American",
    priceRange: "$",
    location: "West End",
    address: "555 Patty Ave, Cityville",
    phone: "(555) 234-5678",
    website: "www.burgerjoint.com",
    hours: {
      open: "11:00 AM",
      close: "11:00 PM",
    },
    rating: 4.4,
    reviewCount: 412,
    images: [
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2899&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2565&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=2670&auto=format&fit=crop",
    ],
    categories: ["Budget-friendly", "Late-night eats"],
    dishes: [
      {
        id: "d9",
        name: "Classic Cheeseburger",
        price: 9.99,
        description:
          "Angus beef patty with cheddar, lettuce, tomato, and special sauce",
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2899&auto=format&fit=crop",
        popular: true,
      },
      {
        id: "d10",
        name: "Loaded Fries",
        price: 7.99,
        description:
          "Hand-cut fries topped with cheese, bacon, and green onions",
        image:
          "https://images.unsplash.com/photo-1585109649139-366815a0d713?q=80&w=2670&auto=format&fit=crop",
        popular: true,
      },
    ],
    reviews: [
      {
        id: "r5",
        userId: "u5",
        userName: "Mike Johnson",
        userAvatar:
          "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2787&auto=format&fit=crop",
        rating: 4,
        comment:
          "Great burgers at a reasonable price! The loaded fries are amazing too. Service can be a bit slow during peak hours, but the food is worth the wait.",
        date: "2023-12-10",
        images: [
          "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2565&auto=format&fit=crop",
        ],
        likes: 15,
        dishes: ["Classic Cheeseburger", "Loaded Fries"],
      },
    ],
    featured: true,
  },
  {
    id: "6",
    name: "Bangkok Kitchen",
    description:
      "Authentic Thai restaurant offering flavorful curries, noodle dishes, and stir-fries with fresh ingredients and aromatic spices.",
    cuisine: "Thai",
    priceRange: "$$",
    location: "Uptown",
    address: "888 Spice Street, Cityville",
    phone: "(555) 345-6789",
    website: "www.bangkokkitchen.com",
    hours: {
      open: "11:30 AM",
      close: "10:00 PM",
    },
    rating: 4.8,
    reviewCount: 176,
    images: [
      "https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?q=80&w=2532&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?q=80&w=2574&auto=format&fit=crop",
    ],
    categories: ["Healthy options", "Date night"],
    dishes: [
      {
        id: "d11",
        name: "Pad Thai",
        price: 14.99,
        description:
          "Stir-fried rice noodles with egg, tofu, bean sprouts, and peanuts",
        image:
          "https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=2670&auto=format&fit=crop",
        popular: true,
      },
      {
        id: "d12",
        name: "Green Curry",
        price: 16.99,
        description:
          "Spicy coconut curry with bamboo shoots, bell peppers, and basil",
        image:
          "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=2670&auto=format&fit=crop",
        popular: false,
      },
    ],
    reviews: [
      {
        id: "r6",
        userId: "u6",
        userName: "Lisa Wong",
        userAvatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2688&auto=format&fit=crop",
        rating: 5,
        comment:
          "The most authentic Thai food I've had outside of Thailand! The Pad Thai is perfectly balanced and the curry has just the right amount of spice. Highly recommend!",
        date: "2023-11-28",
        images: [
          "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?q=80&w=2532&auto=format&fit=crop",
        ],
        likes: 27,
        dishes: ["Pad Thai", "Green Curry"],
      },
    ],
    featured: false,
  },
  {
    id: "7",
    name: "Bistro Parisienne",
    description:
      "Charming French bistro offering classic dishes like coq au vin, beef bourguignon, and crème brûlée in an intimate, romantic setting.",
    cuisine: "French",
    priceRange: "$$$",
    location: "Downtown",
    address: "777 Rue de Paris, Cityville",
    phone: "(555) 567-8901",
    website: "www.bistroparisienne.com",
    hours: {
      open: "5:00 PM",
      close: "11:00 PM",
    },
    rating: 4.9,
    reviewCount: 231,
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=2670&auto=format&fit=crop",
    ],
    categories: ["Date night", "Trending"],
    dishes: [
      {
        id: "d13",
        name: "Coq au Vin",
        price: 28.99,
        description: "Chicken braised with wine, mushrooms, and pearl onions",
        image:
          "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=2670&auto=format&fit=crop",
        popular: true,
      },
      {
        id: "d14",
        name: "Crème Brûlée",
        price: 10.99,
        description: "Classic vanilla custard with caramelized sugar top",
        image:
          "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?q=80&w=2670&auto=format&fit=crop",
        popular: true,
      },
    ],
    reviews: [
      {
        id: "r7",
        userId: "u7",
        userName: "Pierre Dubois",
        userAvatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2787&auto=format&fit=crop",
        rating: 5,
        comment:
          "Magnifique! The atmosphere is truly Parisian and the food is exceptional. The coq au vin transported me straight to France. Perfect for a special occasion.",
        date: "2023-12-15",
        images: [
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2670&auto=format&fit=crop",
        ],
        likes: 39,
        dishes: ["Coq au Vin", "Crème Brûlée"],
      },
    ],
    featured: true,
  },
  {
    id: "8",
    name: "Golden Dragon",
    description:
      "Traditional Chinese restaurant specializing in dim sum, Peking duck, and regional specialties from Sichuan, Cantonese, and Hunan cuisines.",
    cuisine: "Chinese",
    priceRange: "$$",
    location: "Suburbs",
    address: "999 Dragon Street, Cityville",
    phone: "(555) 678-9012",
    website: "www.goldendragon.com",
    hours: {
      open: "11:00 AM",
      close: "10:30 PM",
    },
    rating: 4.5,
    reviewCount: 318,
    images: [
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=2729&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526318896980-cf78c088247c?q=80&w=2574&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=2670&auto=format&fit=crop",
    ],
    categories: ["Family spots", "Budget-friendly"],
    dishes: [
      {
        id: "d15",
        name: "Peking Duck",
        price: 32.99,
        description:
          "Roasted duck with thin pancakes, scallions, and hoisin sauce",
        image:
          "https://images.unsplash.com/photo-1518983546435-91f8b87fe561?q=80&w=2670&auto=format&fit=crop",
        popular: true,
      },
      {
        id: "d16",
        name: "Dim Sum Platter",
        price: 18.99,
        description: "Assortment of steamed dumplings, buns, and small bites",
        image:
          "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=2729&auto=format&fit=crop",
        popular: true,
      },
    ],
    reviews: [
      {
        id: "r8",
        userId: "u8",
        userName: "David Lee",
        userAvatar:
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2787&auto=format&fit=crop",
        rating: 4,
        comment:
          "Great dim sum and the Peking duck is excellent! The restaurant can get very busy on weekends, so I recommend making a reservation. Good value for the quality.",
        date: "2023-10-30",
        images: [
          "https://images.unsplash.com/photo-1526318896980-cf78c088247c?q=80&w=2574&auto=format&fit=crop",
        ],
        likes: 22,
        dishes: ["Dim Sum Platter", "Peking Duck"],
      },
    ],
    featured: false,
  },
];

const currentUser: User = {
  id: "current",
  name: "Alex Morgan",
  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2680&auto=format&fit=crop",
  reviewCount: 28,
  favoriteRestaurants: ["1", "2", "7"],
};

export default function RestaurantReviewPlatform() {
  const [theme, setTheme] = useState<ThemeType>("light");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<Cuisine | "All">(
    "All"
  );
  const [selectedLocation, setSelectedLocation] = useState<Location | "All">(
    "All"
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">(
    "All"
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<
    PriceRange | "All"
  >("All");
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mockRestaurantsState, setMockRestaurantsState] =
    useState(mockRestaurants);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
    images: [] as string[],
    dishes: [] as string[],
    restaurantId: "",
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const reviewModalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const allRestaurantsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isModalOpen || isReviewModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen, isReviewModalOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
      if (
        reviewModalRef.current &&
        !reviewModalRef.current.contains(event.target as Node)
      ) {
        setIsReviewModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const filteredRestaurants = mockRestaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine =
      selectedCuisine === "All" || restaurant.cuisine === selectedCuisine;
    const matchesLocation =
      selectedLocation === "All" || restaurant.location === selectedLocation;
    const matchesCategory =
      selectedCategory === "All" ||
      restaurant.categories.includes(selectedCategory);
    const matchesPriceRange =
      selectedPriceRange === "All" ||
      restaurant.priceRange === selectedPriceRange;

    return (
      matchesSearch &&
      matchesCuisine &&
      matchesLocation &&
      matchesCategory &&
      matchesPriceRange
    );
  });

  const trendingRestaurants = mockRestaurants
    .filter((restaurant) => restaurant.categories.includes("Trending"))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  const featuredReviews = mockRestaurants
    .flatMap((restaurant) =>
      restaurant.reviews.map((review) => ({
        ...review,
        restaurantName: restaurant.name,
        restaurantId: restaurant.id,
        restaurantImage: restaurant.images[0],
      }))
    )
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setNewReview((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const removeImage = (indexToRemove: number) => {
    setNewReview((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
    URL.revokeObjectURL(newReview.images[indexToRemove]);
  };

  const handleRestaurantSelect = (restaurantId: string) => {
    const restaurant = mockRestaurantsState.find((r) => r.id === restaurantId);
    setSelectedRestaurant(restaurant || null);
    setNewReview((prev) => ({
      ...prev,
      restaurantId,
      dishes: [],
    }));
  };

  const calculateNewRating = (
    currentRating: number,
    currentCount: number,
    newRatingValue: number
  ): number => {
    const totalRating = currentRating * currentCount + newRatingValue;
    return Number((totalRating / (currentCount + 1)).toFixed(1));
  };

  const handleSubmitReview = () => {
    if (newReview.rating === 0) {
      showToastMessage("Please select a rating");
      return;
    }

    if (newReview.comment.trim() === "") {
      showToastMessage("Please add a comment");
      return;
    }

    if (!newReview.restaurantId) {
      showToastMessage("Please select a restaurant");
      return;
    }

    const targetRestaurant = mockRestaurantsState.find(
      (r) => r.id === newReview.restaurantId
    );
    if (!targetRestaurant) {
      showToastMessage("Selected restaurant not found");
      return;
    }

    const newReviewObj: Review = {
      id: `r${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split("T")[0],
      images: newReview.images,
      likes: 0,
      dishes: newReview.dishes,
    };

    const updatedRestaurants = mockRestaurantsState.map((restaurant) => {
      if (restaurant.id === newReview.restaurantId) {
        const updatedRestaurant = {
          ...restaurant,
          reviews: [newReviewObj, ...restaurant.reviews],
          rating: calculateNewRating(
            restaurant.rating,
            restaurant.reviewCount,
            newReview.rating
          ),
          reviewCount: restaurant.reviewCount + 1,
        };
        if (selectedRestaurant?.id === restaurant.id) {
          setSelectedRestaurant(updatedRestaurant);
        }
        return updatedRestaurant;
      }
      return restaurant;
    });

    setMockRestaurantsState(updatedRestaurants);
    showToastMessage(
      "Review submitted successfully! Please wait for it to be approved."
    );
    setIsReviewModalOpen(false);
    setNewReview({
      rating: 0,
      comment: "",
      images: [],
      dishes: [],
      restaurantId: "",
    });
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const colors = themeConfig[theme];

  const getPriceRangeText = (priceRange: PriceRange): string => {
    switch (priceRange) {
      case "$":
        return "$10-30";
      case "$$":
        return "$30-60";
      case "$$$":
        return "$60-100";
      case "$$$$":
        return "$100+";
      default:
        return priceRange;
    }
  };

  const scrollToRestaurants = () => {
    allRestaurantsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const nextImage = () => {
    if (selectedRestaurant) {
      setCurrentImageIndex((prev) =>
        prev === selectedRestaurant.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedRestaurant) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedRestaurant.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div
      className={`min-h-screen ${colors.background} ${colors.foreground} ${playfair.variable} ${montserrat.variable} font-sans transition-colors duration-300`}
    >
      <header
        className={`sticky top-0 z-10 ${colors.card} border-b ${colors.border} shadow-sm`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold font-playfair">
              <span className={colors.accent}>Taste</span> Explorer
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button
              className={`px-4 py-2 rounded-full ${colors.primary} text-white font-medium transition-transform hover:scale-105 cursor-pointer`}
              onClick={() => setIsReviewModalOpen(true)}
            >
              Write a Review
            </button>

            <button
              className="p-2 rounded-full transition-colors cursor-pointer"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <div className="flex items-center space-x-2">
              <img
                src={currentUser.avatar || "/placeholder.svg"}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-medium">{currentUser.name}</span>
            </div>
          </div>

          <button
            className="md:hidden p-2 cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden ${colors.card} border-b ${colors.border}`}
            >
              <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <img
                    src={currentUser.avatar || "/placeholder.svg"}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-medium">{currentUser.name}</span>
                </div>

                <button
                  className={`px-4 py-2 rounded-full ${colors.primary} text-white font-medium cursor-pointer`}
                  onClick={() => {
                    setIsReviewModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Write a Review
                </button>

                <button
                  className="flex items-center space-x-2 p-2 cursor-pointer"
                  onClick={toggleTheme}
                >
                  {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                  <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className={`rounded-xl overflow-hidden relative h-[80vh] mb-6`}>
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2670&auto=format&fit=crop"
              alt="Restaurant hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair text-center mb-4">
                Discover Your Next Favorite Spot
              </h2>
              <p className="text-lg md:text-xl text-center mb-6 max-w-2xl">
                Explore the best restaurants in your area with reviews from food
                lovers like you
              </p>
              <button
                onClick={scrollToRestaurants}
                className="px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-opacity-90 transition-all transform hover:scale-105 cursor-pointer"
              >
                Explore Restaurants
              </button>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold font-playfair">
              Trending Restaurants
            </h2>
            <button
              onClick={scrollToRestaurants}
              className={`text-sm font-medium ${colors.accent} cursor-pointer`}
            >
              View all
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingRestaurants.map((restaurant) => (
              <motion.div
                key={restaurant.id}
                whileHover={{ y: -5 }}
                className={`rounded-lg overflow-hidden shadow-md ${colors.card} border ${colors.border} cursor-pointer`}
                onClick={() => {
                  setSelectedRestaurant(restaurant);
                  setIsModalOpen(true);
                }}
              >
                <div className="relative h-48">
                  <img
                    src={restaurant.images[0] || "/placeholder.svg"}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 flex items-center">
                    <Star
                      className={`${colors.rating} fill-current`}
                      size={16}
                    />
                    <span className="ml-1 text-black font-medium text-sm">
                      {restaurant.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg mb-1">
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center text-sm mb-2">
                        <span className={`${colors.muted} mr-2`}>
                          {restaurant.cuisine}
                        </span>
                        <span className="mr-2">•</span>
                        <span className={colors.muted}>
                          {getPriceRangeText(restaurant.priceRange)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center mt-2">
                    <MapPin size={16} className={colors.muted} />
                    <span className="text-sm ml-1">{restaurant.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-6">
            Featured Reviews
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredReviews.map((review) => (
              <motion.div
                key={review.id}
                whileHover={{ y: -5 }}
                className={`rounded-lg overflow-hidden shadow-md ${colors.card} border ${colors.border}`}
              >
                <div className="relative h-48">
                  <img
                    src={review.images[0] || review.restaurantImage}
                    alt={review.restaurantName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <img
                        src={review.userAvatar || "/placeholder.svg"}
                        alt={review.userName}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <h4 className="font-medium">{review.userName}</h4>
                        <p className="text-sm">{review.restaurantName}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`${
                            i < review.rating
                              ? colors.rating + " fill-current"
                              : colors.muted
                          }`}
                          size={16}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm mb-3 line-clamp-3">{review.comment}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs">{review.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section ref={allRestaurantsRef}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl md:text-3xl font-bold font-playfair">
              All Restaurants
            </h2>
          </div>

          <div className="space-y-6 mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for restaurants, cuisines, or dishes..."
                className={`w-full px-4 py-3 pl-12 rounded-lg ${colors.card} border ${colors.border} focus:outline-none focus:ring-2 focus:ring-primary`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
            </div>

            <div
              className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg ${colors.card} border ${colors.border}`}
            >
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border cursor-pointer ${
                    colors.border
                  } ${
                    selectedCuisine === "All"
                      ? colors.primary + " text-white"
                      : ""
                  }`}
                  onClick={() => setSelectedCuisine("All")}
                >
                  All Cuisines
                </button>
                {(
                  [
                    "Italian",
                    "Japanese",
                    "Mexican",
                    "Indian",
                    "American",
                  ] as Cuisine[]
                ).map((cuisine) => (
                  <button
                    key={cuisine}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border cursor-pointer ${
                      colors.border
                    } ${
                      selectedCuisine === cuisine
                        ? colors.primary + " text-white"
                        : ""
                    }`}
                    onClick={() => setSelectedCuisine(cuisine)}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <select
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border ${colors.border} ${colors.foreground} cursor-pointer bg-transparent`}
                  value={selectedPriceRange}
                  onChange={(e) =>
                    setSelectedPriceRange(e.target.value as PriceRange)
                  }
                >
                  <option
                    value="All"
                    className={`${colors.card} ${colors.foreground}`}
                  >
                    All Prices
                  </option>
                  <option
                    value="$"
                    className={`${colors.card} ${colors.foreground}`}
                  >
                    $10-30
                  </option>
                  <option
                    value="$$"
                    className={`${colors.card} ${colors.foreground}`}
                  >
                    $30-60
                  </option>
                  <option
                    value="$$$"
                    className={`${colors.card} ${colors.foreground}`}
                  >
                    $60-100
                  </option>
                  <option
                    value="$$$$"
                    className={`${colors.card} ${colors.foreground}`}
                  >
                    $100+
                  </option>
                </select>

                <select
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border ${colors.border} ${colors.foreground} cursor-pointer bg-transparent`}
                  value={selectedLocation}
                  onChange={(e) =>
                    setSelectedLocation(e.target.value as Location)
                  }
                >
                  <option
                    value="All"
                    className={`${colors.card} ${colors.foreground}`}
                  >
                    All Locations
                  </option>
                  <option
                    value="Downtown"
                    className={`${colors.card} ${colors.foreground}`}
                  >
                    Downtown
                  </option>
                  <option
                    value="Uptown"
                    className={`${colors.card} ${colors.foreground}`}
                  >
                    Uptown
                  </option>
                  <option
                    value="Midtown"
                    className={`${colors.card} ${colors.foreground}`}
                  >
                    Midtown
                  </option>
                  <option
                    value="West End"
                    className={`${colors.card} ${colors.foreground}`}
                  >
                    West End
                  </option>
                  <option
                    value="East Side"
                    className={`${colors.card} ${colors.foreground}`}
                  >
                    East Side
                  </option>
                  <option
                    value="Waterfront"
                    className={`${colors.card} ${colors.foreground}`}
                  >
                    Waterfront
                  </option>
                </select>
              </div>
            </div>
          </div>

          {filteredRestaurants.length === 0 ? (
            <div
              className={`p-8 rounded-lg ${colors.card} border ${colors.border} text-center`}
            >
              <p className="text-lg">
                No restaurants found matching your criteria.
              </p>
              <button
                className={`mt-4 px-4 py-2 rounded-full ${colors.primary} text-white font-medium cursor-pointer`}
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCuisine("All");
                  setSelectedLocation("All");
                  setSelectedCategory("All");
                  setSelectedPriceRange("All");
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockRestaurantsState
                .filter((restaurant) => {
                  const matchesSearch =
                    restaurant.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    restaurant.description
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase());
                  const matchesCuisine =
                    selectedCuisine === "All" ||
                    restaurant.cuisine === selectedCuisine;
                  const matchesLocation =
                    selectedLocation === "All" ||
                    restaurant.location === selectedLocation;
                  const matchesCategory =
                    selectedCategory === "All" ||
                    restaurant.categories.includes(selectedCategory);
                  const matchesPriceRange =
                    selectedPriceRange === "All" ||
                    restaurant.priceRange === selectedPriceRange;

                  return (
                    matchesSearch &&
                    matchesCuisine &&
                    matchesLocation &&
                    matchesCategory &&
                    matchesPriceRange
                  );
                })
                .map((restaurant) => (
                  <motion.div
                    key={restaurant.id}
                    whileHover={{ y: -5 }}
                    className={`rounded-lg overflow-hidden shadow-md ${colors.card} border ${colors.border} cursor-pointer`}
                    onClick={() => {
                      setSelectedRestaurant(restaurant);
                      setIsModalOpen(true);
                    }}
                  >
                    <div className="relative h-48">
                      <img
                        src={restaurant.images[0] || "/placeholder.svg"}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 flex items-center">
                        <Star
                          className={`${colors.rating} fill-current`}
                          size={16}
                        />
                        <span className="ml-1 text-black font-medium text-sm">
                          {restaurant.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg mb-1">
                            {restaurant.name}
                          </h3>
                          <div className="flex items-center text-sm mb-2">
                            <span className={`${colors.muted} mr-2`}>
                              {restaurant.cuisine}
                            </span>
                            <span className="mr-2">•</span>
                            <span className={colors.muted}>
                              {getPriceRangeText(restaurant.priceRange)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm mb-3 line-clamp-2">
                        {restaurant.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {restaurant.categories.map((category) => (
                          <span
                            key={category}
                            className={`text-xs px-2 py-1 rounded-full ${colors.secondary} text-white`}
                          >
                            {category}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center">
                        <MapPin size={16} className={colors.muted} />
                        <span className="text-sm ml-1">
                          {restaurant.location}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </section>
      </main>

      <footer
        className={`${colors.card} border-t ${colors.border} mt-16 py-12`}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold font-playfair mb-2">
              <span className={colors.accent}>Taste</span> Explorer
            </h3>
            <p className={`${colors.muted} mb-6 max-w-md`}>
              Discover the best local restaurants and share your dining
              experiences with food lovers around the world.
            </p>
            <p className={`text-sm ${colors.muted}`}>
              © {new Date().getFullYear()} Taste Explorer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {isModalOpen && selectedRestaurant && (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${colors.overlay}`}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-xl ${colors.card} shadow-xl relative`}
            >
              <div className="relative w-full">
                <div className="relative h-64 md:h-80 w-full overflow-hidden">
                  <AnimatePresence initial={false} mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      className="absolute inset-0"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={selectedRestaurant.images[currentImageIndex]}
                        alt={`${selectedRestaurant.name} ${
                          currentImageIndex + 1
                        }`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all cursor-pointer"
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all cursor-pointer"
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {selectedRestaurant.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          index === currentImageIndex
                            ? "bg-white w-4"
                            : "bg-white/50 hover:bg-white/75"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  className="absolute top-4 right-4 bg-white rounded-full p-2 cursor-pointer"
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentImageIndex(0);
                  }}
                >
                  <X size={20} className="text-black" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-2">
                      {selectedRestaurant.name}
                    </h2>
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => {
                          const rating = selectedRestaurant.rating;
                          if (i < Math.floor(rating)) {
                            return (
                              <Star
                                key={i}
                                className={`${colors.rating} fill-current`}
                                size={18}
                              />
                            );
                          } else if (
                            i === Math.floor(rating) &&
                            rating % 1 >= 0.5
                          ) {
                            return (
                              <StarHalf
                                key={i}
                                className={`${colors.rating} fill-current`}
                                size={18}
                              />
                            );
                          } else {
                            return (
                              <Star
                                key={i}
                                className={colors.muted}
                                size={18}
                              />
                            );
                          }
                        })}
                      </div>
                      <span className="text-sm">
                        {selectedRestaurant.rating.toFixed(1)} (
                        {selectedRestaurant.reviewCount} reviews)
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                      <span className="text-sm">
                        {selectedRestaurant.cuisine}
                      </span>
                      <span className="text-sm">
                        {getPriceRangeText(selectedRestaurant.priceRange)}
                      </span>
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-1" />
                        <span className="text-sm">
                          {selectedRestaurant.location}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        <span className="text-sm">
                          {selectedRestaurant.hours.open} -{" "}
                          {selectedRestaurant.hours.close}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mb-6">{selectedRestaurant.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedRestaurant.categories.map((category) => (
                    <span
                      key={category}
                      className={`text-xs px-2 py-1 rounded-full ${colors.secondary} text-white`}
                    >
                      {category}
                    </span>
                  ))}
                </div>

                <div className={`p-4 rounded-lg border ${colors.border} mb-6`}>
                  <h3 className="font-bold text-lg mb-3">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm mb-1">
                        <span className="font-medium">Address:</span>{" "}
                        {selectedRestaurant.address}
                      </p>
                      <p className="text-sm mb-1">
                        <span className="font-medium">Phone:</span>{" "}
                        {selectedRestaurant.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm mb-1">
                        <span className="font-medium">Website:</span>{" "}
                        {selectedRestaurant.website}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Hours:</span>{" "}
                        {selectedRestaurant.hours.open} -{" "}
                        {selectedRestaurant.hours.close}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-bold text-lg mb-4">Popular Dishes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedRestaurant.dishes
                      .filter((dish) => dish.popular)
                      .map((dish) => (
                        <div
                          key={dish.id}
                          className={`flex rounded-lg overflow-hidden border ${colors.border}`}
                        >
                          <img
                            src={dish.image || "/placeholder.svg"}
                            alt={dish.name}
                            className="w-24 h-24 object-cover"
                          />
                          <div className="p-3">
                            <h4 className="font-medium mb-1">{dish.name}</h4>
                            <p className="text-sm mb-1 line-clamp-1">
                              {dish.description}
                            </p>
                            <p className="font-medium">
                              ${dish.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Reviews</h3>
                    <button
                      className={`px-4 py-2 rounded-full ${colors.primary} text-white font-medium cursor-pointer`}
                      onClick={() => {
                        setIsReviewModalOpen(true);
                        setIsModalOpen(false);
                        setNewReview((prev) => ({
                          ...prev,
                          restaurantId: selectedRestaurant.id,
                          dishes: [],
                        }));
                      }}
                    >
                      Write a Review
                    </button>
                  </div>

                  {selectedRestaurant.reviews.length === 0 ? (
                    <p className="text-center py-6">
                      No reviews yet. Be the first to review!
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {selectedRestaurant.reviews.map((review) => (
                        <div
                          key={review.id}
                          className={`p-4 rounded-lg border ${colors.border}`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <img
                                src={review.userAvatar || "/placeholder.svg"}
                                alt={review.userName}
                                className="w-10 h-10 rounded-full object-cover mr-3"
                              />
                              <div>
                                <h4 className="font-medium">
                                  {review.userName}
                                </h4>
                                <p className="text-xs">{review.date}</p>
                              </div>
                            </div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`${
                                    i < review.rating
                                      ? colors.rating + " fill-current"
                                      : colors.muted
                                  }`}
                                  size={16}
                                />
                              ))}
                            </div>
                          </div>

                          <p className="text-sm mb-4">{review.comment}</p>

                          {review.images.length > 0 && (
                            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                              {review.images.map((image, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={image}
                                    alt={`Review image ${index + 1}`}
                                    className="w-24 h-24 object-cover rounded-lg"
                                  />
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeImage(index);
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                                  >
                                    <X size={14} />
                                  </button>
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                                </div>
                              ))}
                            </div>
                          )}

                          {review.dishes.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {review.dishes.map((dish) => (
                                <span
                                  key={dish}
                                  className={`text-xs px-2 py-1 rounded-full `}
                                >
                                  {dish}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="text-xs">{review.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isReviewModalOpen && (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${colors.overlay}`}
          >
            <motion.div
              ref={reviewModalRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl ${colors.card} shadow-xl`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold font-playfair">
                    Write a Review
                  </h2>
                  <button
                    className="p-2 rounded-full cursor-pointer"
                    onClick={() => setIsReviewModalOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block font-medium mb-2">
                    Select Restaurant
                  </label>
                  <select
                    className={`w-full p-3 rounded-lg border ${colors.border} ${colors.input}`}
                    value={newReview.restaurantId}
                    onChange={(e) => {
                      const restaurantId = e.target.value;
                      setNewReview((prev) => ({
                        ...prev,
                        restaurantId,
                      }));
                      setSelectedRestaurant(
                        mockRestaurantsState.find(
                          (r) => r.id === restaurantId
                        ) || null
                      );
                    }}
                  >
                    <option value="">Select a restaurant</option>
                    {mockRestaurantsState.map((restaurant) => (
                      <option key={restaurant.id} value={restaurant.id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block font-medium mb-2">Rating</label>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`${
                          i < newReview.rating
                            ? colors.rating + " fill-current"
                            : colors.muted
                        }`}
                        size={20}
                        onClick={() =>
                          setNewReview({ ...newReview, rating: i + 1 })
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block font-medium mb-2">Comment</label>
                  <textarea
                    className={`w-full p-3 rounded-lg border ${colors.border} ${colors.input}`}
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="block font-medium mb-2">Add Photos</label>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-24 h-24 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed ${colors.border} hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer`}
                    >
                      <Camera size={24} />
                      <span className="text-xs">Add Photos</span>
                    </button>

                    {newReview.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10 cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                      </div>
                    ))}

                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  {newReview.images.length > 0 && (
                    <p className="text-sm mt-2 text-gray-500">
                      {newReview.images.length} photo
                      {newReview.images.length !== 1 ? "s" : ""} selected
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block font-medium mb-2">
                    Dishes You Tried
                  </label>
                  {selectedRestaurant && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {selectedRestaurant.dishes.map((dish) => (
                        <div
                          key={dish.id}
                          onClick={() => {
                            setNewReview((prev) => ({
                              ...prev,
                              dishes: prev.dishes.includes(dish.name)
                                ? prev.dishes.filter((d) => d !== dish.name)
                                : [...prev.dishes, dish.name],
                            }));
                          }}
                          className={`p-3 rounded-lg border ${
                            colors.border
                          } cursor-pointer transition-colors ${
                            newReview.dishes.includes(dish.name)
                              ? colors.primary + " text-white"
                              : colors.input
                          }`}
                        >
                          <p className="font-medium">{dish.name}</p>
                          <p className="text-sm opacity-75">
                            ${dish.price.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <button
                    className={`w-full px-4 py-3 rounded-full ${colors.primary} text-white font-medium cursor-pointer flex items-center justify-center gap-2`}
                    onClick={handleSubmitReview}
                  >
                    <Send size={20} />
                    Submit Review
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div
              className={`px-6 py-3 rounded-lg shadow-lg ${
                toastMessage.includes("successfully")
                  ? "bg-green-500"
                  : "bg-red-500"
              } text-white`}
            >
              {toastMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
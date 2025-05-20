"use client";

import React, { useState, useEffect } from "react";
import {
 Search,
 Star,
 StarHalf,
 Menu,
 X,
 User,
 ShoppingCart,
 Heart,
 ChevronDown,
 Filter,
 Upload,
 LogIn,
 LogOut,
 ArrowLeft,
 Share2,
 ThumbsUp,
 ThumbsDown,
 MessageCircle,
 Layers,
 Cpu,
 Smartphone,
 Clock,
 Gift,
 Shield,
 Link,
 Link2,
 Mail,
 Send,
} from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define TypeScript interfaces
interface Product {
 id: number;
 name: string;
 brand: string;
 category: string;
 price: number;
 rating: number;
 image: string;
 description: string;
 releaseDate: string;
 specifications?: {
   processor?: string;
   ram?: string;
   storage?: string;
   display?: string;
   battery?: string;
   camera?: string;
   os?: string;
   connectivity?: string;
   dimensions?: string;
   weight?: string;
 };
 features?: string[];
 availability?: string;
 warranty?: string;
}

interface Review {
 id: number;
 userId: number;
 productId: number;
 rating: number;
 title: string;
 content: string;
 pros: string[];
 cons: string[];
 date: string;
 helpfulCount: number;
 reviewImage?: string;
 userAvatar?: string;
 username?: string;
 verifiedPurchase?: boolean;
}

interface User {
 id: number;
 username: string;
 email: string;
 avatar: string;
 memberSince?: string;
 reviewCount?: number;
}

const Review = () => {
 // State management
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const [currentUser, setCurrentUser] = useState<User | null>(null);
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const [searchTerm, setSearchTerm] = useState("");
 const [products, setProducts] = useState<Product[]>([]);
 const [reviews, setReviews] = useState<Review[]>([]);
 const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
 const [filters, setFilters] = useState({
   brand: "",
   category: "",
   minRating: 0,
   minPrice: 0,
   maxPrice: 10000,
 });
 const [sorting, setSorting] = useState("newest");
 const [showLoginModal, setShowLoginModal] = useState(false);
 const [showReviewModal, setShowReviewModal] = useState(false);
 const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
 const [showProductDetails, setShowProductDetails] = useState(false);
 const [showAllReviews, setShowAllReviews] = useState(false);
 const [newReview, setNewReview] = useState({
   rating: 0,
   title: "",
   content: "",
   pros: [""],
   cons: [""],
   reviewImage: "",
 });
 // Add state to track if submit was attempted
 const [submitAttempted, setSubmitAttempted] = useState(false);
 // Add state to control shake animation for each field
 const [shakeTitle, setShakeTitle] = useState(false);
 const [shakeContent, setShakeContent] = useState(false);
 // Add touched state for each field
 const [touched, setTouched] = useState({ title: false, content: false, rating: false });

 // Mock user data
 const mockUser: User = {
   id: 1,
   username: "TechReviewer",
   email: "user@example.com",
   avatar: "https://randomuser.me/api/portraits/men/32.jpg",
   memberSince: "2023-05-12",
   reviewCount: 8,
 };

 // Login credentials
 const [loginForm, setLoginForm] = useState({
   email: "user@example.com",
   password: "password",
 });

 // Sample data - in a real app this would come from an API
 const sampleProducts: Product[] = [
   {
     id: 1,
     name: "SuperPhone Pro Max",
     brand: "SuperTech",
     category: "smartphones",
     price: 999,
     rating: 4.8,
     image:
       "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGhvbmV8ZW58MHx8MHx8fDA%3D",
     description:
       "The latest flagship smartphone with cutting-edge features and exceptional performance.",
     releaseDate: "2025-01-15",
     specifications: {
       processor: "Octa-core 3.0 GHz",
       ram: "12 GB",
       storage: "256 GB, expandable up to 1TB",
       display: "6.7-inch AMOLED, 120Hz, 1440 x 3088 pixels",
       battery: "5000 mAh, 45W fast charging",
       camera: "108MP main + 48MP wide + 12MP telephoto, 32MP front",
       os: "Android 14",
       connectivity: "5G, Wi-Fi 6E, Bluetooth 5.3, NFC",
       dimensions: "165.3 x 76.6 x 8.3 mm",
       weight: "208g",
     },
     features: [
       "Waterproof (IP68)",
       "Wireless charging",
       "Under-display fingerprint scanner",
       "AI-enhanced photography",
       "8K video recording",
       "Satellite connectivity",
     ],
     availability: "In stock",
     warranty: "2 year manufacturer warranty",
   },
   {
     id: 2,
     name: "UltraBook Thin 14",
     brand: "UltraTech",
     category: "laptops",
     price: 1299,
     rating: 4.6,
     image:
       "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wfGVufDB8fDB8fHww",
     description:
       "Ultra-thin and lightweight laptop with powerful performance and all-day battery life.",
     releaseDate: "2024-11-10",
     specifications: {
       processor: "Intel Core i7-1270P",
       ram: "16 GB LPDDR5",
       storage: "512 GB NVMe SSD",
       display: "14-inch IPS, 400 nits, 2880 x 1800 pixels",
       battery: "72 Wh, up to 18 hours",
       camera: "1080p FHD with privacy shutter",
       os: "Windows 11 Pro",
       connectivity: "Wi-Fi 6, Bluetooth 5.2, Thunderbolt 4",
       dimensions: "310 x 215 x 12.9 mm",
       weight: "1.2 kg",
     },
     features: [
       "Backlit keyboard",
       "Fingerprint reader",
       "Military-grade durability",
       "Dolby Atmos speakers",
       "Fast charging (80% in 1 hour)",
     ],
   },
   {
     id: 3,
     name: "SmartWatch Series 5",
     brand: "SuperTech",
     category: "wearables",
     price: 349,
     rating: 4.5,
     image:
       "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c21hcnR3YXRjaHxlbnwwfHwwfHx8MA%3D%3D",
     description:
       "Advanced smartwatch with health monitoring and seamless connectivity features.",
     releaseDate: "2024-12-05",
     specifications: {
       display: "1.4-inch AMOLED, 450x450 pixels",
       battery: "420 mAh, up to 2 days",
       connectivity: "Bluetooth 5.2, Wi-Fi, LTE optional, NFC",
       os: "WearOS 4.0",
       dimensions: "44 x 44 x 10.5 mm",
       weight: "32g",
     },
     features: [
       "ECG monitoring",
       "Blood oxygen sensor",
       "Sleep tracking",
       "GPS + GLONASS",
       "50m water resistance",
       "Wireless charging",
     ],
   },
   {
     id: 4,
     name: "AudioMax Pro Headphones",
     brand: "AudioTech",
     category: "audio",
     price: 249,
     rating: 2.4,
     image:
       "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhlYWRwaG9uZXN8ZW58MHx8MHx8fDA%3D",
     description:
       "Premium noise-canceling headphones with studio-quality sound.",
     releaseDate: "2025-02-20",
     specifications: {
       battery: "Up to a 36-hour battery life",
       connectivity: "Bluetooth 5.2, 3.5mm jack",
       weight: "254g",
     },
     features: [
       "Active noise cancellation",
       "Ambient sound mode",
       "Built-in voice assistant",
       "Touch controls",
       "Foldable design",
     ],
   },
   {
     id: 5,
     name: "GameStation Ultra",
     brand: "GameTech",
     category: "gaming",
     price: 499,
     rating: 4.9,
     image:
       "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z2FtaW5nJTIwY29uc29sZXxlbnwwfHwwfHx8MA%3D%3D",
     description:
       "Next-generation gaming console with 8K graphics and immersive gameplay.",
     releaseDate: "2024-10-30",
     specifications: {
       processor: "Custom AMD Zen 3, 8 cores at 3.5GHz",
       storage: "1 TB custom SSD",
       connectivity: "Wi-Fi 6, Bluetooth 5.2, Ethernet",
       dimensions: "300 x 240 x 65 mm",
       weight: "4.2 kg",
     },
     features: [
       "8K gaming support",
       "120fps gameplay",
       "Ray tracing",
       "3D audio",
       "Backward compatibility",
     ],
   },
   {
     id: 6,
     name: "SmartCam 4K Pro",
     brand: "SmartTech",
     category: "cameras",
     price: 399,
     rating: 4.4,
     image:
       "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FtZXJhfGVufDB8fDB8fHww",
     description:
       "Professional-grade 4K camera with advanced AI features and stabilization.",
     releaseDate: "2025-03-10",
     specifications: {
       processor: "X8 image processor",
       storage: "Dual SD card slots, UHS-II compatible",
       battery: "LP-E6NH, up to a 580-shot battery life",
       connectivity: "Wi-Fi, Bluetooth, USB-C",
       dimensions: "138 x 98 x 84 mm",
       weight: "680g",
     },
     features: [
       "4K 60fps video",
       "5-axis stabilization",
       "Weather sealed body",
       "AI subject tracking",
       "8-stop dynamic range",
     ],
   },
   {
     id: 7,
     name: "UltraPhone Lite",
     brand: "UltraTech",
     category: "smartphones",
     price: 599,
     rating: 4.3,
     image:
       "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNtYXJ0cGhvbmV8ZW58MHx8MHx8fDA%3D",
     description:
       "Mid-range smartphone with premium features at an affordable price.",
     releaseDate: "2025-04-05",
     specifications: {
       processor: "Octa-core 2.4 GHz",
       ram: "8 GB",
       storage: "128 GB, expandable",
       display: "6.5-inch AMOLED, 90Hz",
       battery: "4500 mAh, 33W fast charging",
       camera: "64MP main + 12MP wide, 16MP front",
       os: "Android 14",
       connectivity: "5G, Wi-Fi 6, Bluetooth 5.2, NFC",
       dimensions: "160.8 x 74.2 x 8.0 mm",
       weight: "189g",
     },
     features: [
       "Waterproof (IP68)",
       "Wireless charging",
       "Under-display fingerprint scanner",
       "AI-enhanced photography",
       "8K video recording",
       "Satellite connectivity",
     ],
   },
   {
     id: 8,
     name: "SuperTab Pro",
     brand: "SuperTech",
     category: "tablets",
     price: 799,
     rating: 1,
     image:
       "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGFibGV0fGVufDB8fDB8fHww",
     description:
       "High-performance tablet with stunning display and productivity features.",
     releaseDate: "2024-09-15",
     specifications: {
       processor: "A16X Bionic",
       ram: "8 GB",
       storage: "256 GB",
       display: "11-inch Liquid Retina, 120Hz, 2388 x 1668 pixels",
       battery: "10,900 mAh, up to a 10-hour battery life",
       camera: "12MP wide, 10MP ultra-wide",
       os: "iPadOS 18",
       connectivity: "Wi-Fi 6E, Bluetooth 5.3",
       dimensions: "247.6 x 178.5 x 5.9 mm",
       weight: "466g",
     },
     features: [
       "Apple Pencil support",
       "Face ID",
       "Four-speaker audio",
       "USB-C with Thunderbolt 4",
       "Magnetic keyboard attachment",
     ],
   },
 ];

 const sampleReviews: Review[] = [
   {
     id: 1,
     userId: 1,
     productId: 1,
     rating: 5,
     title: "Best smartphone I've ever owned",
     content:
       "This phone exceeds all expectations. The camera quality is outstanding, and the battery life is impressive. The display is vibrant and responsive, making everything from gaming to browsing a pleasure. The processor handles everything I throw at it without any lag. After using it for a month, I can confidently say it's worth every penny. The build quality is exceptional, and the new software features are genuinely useful rather than gimmicky.",
     pros: [
       "Excellent camera",
       "All-day battery",
       "Stunning display",
       "Fast performance",
       "Premium build quality",
     ],
     cons: ["Premium price", "No charger in box", "Glass back is slippery"],
     date: "2025-04-20",
     helpfulCount: 45,
     username: "TechReviewer",
     userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
     verifiedPurchase: true,
   },
   {
     id: 2,
     userId: 2,
     productId: 2,
     rating: 4.5,
     title: "Almost perfect ultrabook",
     content:
       "The UltraBook Thin 14 is exceptionally well-designed and performs admirably for most tasks. The build quality is top-notch, and the keyboard is a joy to type on. Battery life could be better though. I've been using this laptop for both work and personal use for about three weeks now. The display is crystal clear with excellent color accuracy, making it perfect for photo editing. The trackpad is responsive and large enough for comfortable navigation. My only real complaints are the battery life falling short of advertised specs and the limited port selection.",
     pros: [
       "Lightweight design",
       "Powerful performance",
       "Beautiful display",
       "Excellent keyboard",
       "Fast SSD",
     ],
     cons: [
       "Average battery life",
       "Limited ports",
       "Fans get loud under heavy load",
     ],
     date: "2025-03-15",
     helpfulCount: 32,
     username: "LaptopPro",
     userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
     verifiedPurchase: true,
   },
   {
     id: 3,
     userId: 3,
     productId: 4,
     rating: 5,
     title: "Audiophile approved",
     content:
       "These headphones deliver exceptional sound quality with impressive noise cancellation. The comfort level even during extended listening sessions is remarkable. Easily the best headphones in this price range. The bass response is deep and rich without overwhelming the mids and highs. I've worn these for 6+ hour flights with minimal discomfort. The build quality inspires confidence that these will last for years. The app offers useful customization options for EQ and noise cancellation levels. Battery life exceeds expectations - I'm getting about 38 hours with ANC on at moderate volume.",
     pros: [
       "Superior sound quality",
       "Effective noise cancellation",
       "Comfortable for long periods",
       "Exceptional battery life",
       "Intuitive controls",
     ],
     cons: [
       "Slightly bulky case",
       "App could be more intuitive",
       "No multipoint connection",
     ],
     date: "2025-05-01",
     helpfulCount: 28,
     username: "SoundExpert",
     userAvatar: "https://randomuser.me/api/portraits/men/22.jpg",
     verifiedPurchase: true,
   },
   {
     id: 4,
     userId: 4,
     productId: 1,
     rating: 4,
     title: "Great phone with minor flaws",
     content:
       "I've been using the SuperPhone Pro Max for about two weeks now, and it's mostly lived up to the hype. The camera system is truly exceptional - I've taken some of my best photos ever with this device. The display is gorgeous, and performance is snappy. However, I'm disappointed with the battery life, which doesn't quite last a full day of heavy use. Also, the phone gets noticeably warm during gaming sessions. Despite these issues, it's still one of the best smartphones currently available.",
     pros: [
       "Outstanding camera",
       "Beautiful display",
       "Snappy performance",
       "Premium design",
     ],
     cons: [
       "Battery life could be better",
       "Heats up during intensive tasks",
       "Expensive accessories",
     ],
     date: "2025-04-25",
     helpfulCount: 19,
     username: "TechEnthusiast",
     userAvatar: "https://randomuser.me/api/portraits/women/29.jpg",
     verifiedPurchase: true,
   },
   {
     id: 5,
     userId: 5,
     productId: 3,
     rating: 4.5,
     title: "Great smartwatch for fitness enthusiasts",
     content:
       "The SmartWatch Series 5 has become an essential part of my daily fitness routine. The health tracking features are comprehensive and surprisingly accurate. Sleep tracking has helped me improve my rest patterns, and the workout detection is seamless. Battery life is decent but not exceptional - I need to charge it every 1.5 days with normal use. The display is bright and clear, even in direct sunlight. The ecosystem integration works well if you're already using other products from this brand.",
     pros: [
       "Accurate health tracking",
       "Bright display",
       "Comfortable for 24/7 wear",
       "Useful smart features",
     ],
     cons: [
       "Battery life is just okay",
       "Limited third-party app selection",
       "Occasional connectivity issues",
     ],
     date: "2025-03-22",
     helpfulCount: 24,
     username: "FitnessFreak",
     userAvatar: "https://randomuser.me/api/portraits/men/55.jpg",
   },
   {
     id: 6,
     userId: 1,
     productId: 5,
     rating: 5,
     title: "Console gaming perfection",
     content:
       "The GameStation Ultra delivers on all its promises. The graphics are stunning, load times are practically non-existent, and the controller redesign is ergonomically perfect. I've been playing for hours without any performance issues or overheating. The backward compatibility works seamlessly with my older games, many of which look and perform better than on previous consoles. The new UI is intuitive and responsive. If you're serious about gaming, this is absolutely worth the investment.",
     pros: [
       "Incredible graphics",
       "Lightning-fast loading",
       "Excellent controller",
       "Whisper-quiet operation",
       "Great game selection",
     ],
     cons: ["Limited storage on base model", "Accessories are expensive"],
     date: "2024-12-10",
     helpfulCount: 57,
     username: "TechReviewer",
     userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
     verifiedPurchase: true,
   },
   {
     id: 7,
     userId: 6,
     productId: 8,
     rating: 4,
     title: "Powerful tablet for professionals",
     content:
       "I've been using the SuperTab Pro for work and creative projects for about a month now. The display is absolutely stunning - colors are vibrant, and the 120Hz refresh rate makes everything buttery smooth. Performance is stellar; it handles multiple apps, advanced photo editing, and even light video editing without breaking a sweat. The accessory keyboard (sold separately) is essential for productivity, but adds significantly to the already premium price. My only real complaint is that some professional software still isn't optimized for the tablet experience.",
     pros: [
       "Gorgeous display",
       "Desktop-class performance",
       "Excellent speakers",
       "Premium build quality",
     ],
     cons: [
       "Expensive accessories",
       "Software limitations for some pro tasks",
       "No headphone jack",
     ],
     date: "2025-02-11",
     helpfulCount: 31,
     username: "CreativePro",
     userAvatar: "https://randomuser.me/api/portraits/women/67.jpg",
   },
   {
     id: 8,
     userId: 7,
     productId: 6,
     rating: 3.2,
     title: "Professional quality at a reasonable price",
     content:
       "As a semi-professional photographer, I'm extremely impressed with the SmartCam 4K Pro. The image quality rivals cameras costing twice as much, and the autofocus system is lightning fast and accurate. The in-body stabilization works wonders for handheld shooting. Battery life is decent but not outstanding - I recommend picking up a spare. The menu system has a learning curve but becomes intuitive after some use. For the price point, this camera offers exceptional value for both still photography and video work.",
     pros: [
       "Excellent image quality",
       "Effective stabilization",
       "Fast autofocus",
       "Compact size",
       "Weather sealing",
     ],
     cons: [
       "Complex menu system",
       "Average battery life",
       "Limited lens selection currently",
     ],
     date: "2025-03-30",
     helpfulCount: 22,
     username: "PhotoPro",
     userAvatar: "https://randomuser.me/api/portraits/men/41.jpg",
     verifiedPurchase: true,
   },
 ];

 // Initialize data
 useEffect(() => {
   setProducts(sampleProducts);
   setReviews(sampleReviews);
   setFilteredProducts(sampleProducts);
 }, []);

 // Filter and sort products
 useEffect(() => {
   let filtered = [...products];

   // Apply filters
   if (filters.brand) {
     filtered = filtered.filter((product) => product.brand === filters.brand);
   }

   if (filters.category) {
     filtered = filtered.filter(
       (product) => product.category === filters.category
     );
   }

   if (filters.minRating > 0) {
     filtered = filtered.filter(
       (product) => product.rating >= filters.minRating
     );
   }

   filtered = filtered.filter(
     (product) =>
       product.price >= filters.minPrice && product.price <= filters.maxPrice
   );

   // Apply search
   if (searchTerm) {
     filtered = filtered.filter(
       (product) =>
         product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         product.description
           .toLowerCase()
           .includes(searchTerm.toLowerCase()) ||
         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
         product.category.toLowerCase().includes(searchTerm.toLowerCase())
     );
   }

   // Apply sorting
   switch (sorting) {
     case "newest":
       filtered.sort(
         (a, b) =>
           new Date(b.releaseDate).getTime() -
           new Date(a.releaseDate).getTime()
       );
       break;
     case "price-low-high":
       filtered.sort((a, b) => a.price - b.price);
       break;
     case "price-high-low":
       filtered.sort((a, b) => b.price - a.price);
       break;
     case "top-rated":
       filtered.sort((a, b) => b.rating - a.rating);
       break;
     default:
       break;
   }

   setFilteredProducts(filtered);
 }, [products, searchTerm, filters, sorting]);

 // Login handler
 const handleLogin = () => {
   // In a real app, this would validate against an API
   if (
     loginForm.email === "user@example.com" &&
     loginForm.password === "password"
   ) {
     setIsLoggedIn(true);
     setCurrentUser(mockUser);
     setShowLoginModal(false);
     toast.success('Logged in successfully!');
   } else {
     alert("Invalid credentials. Use user@example.com / password");
   }
 };

 // Logout handler
 const handleLogout = () => {
   setIsLoggedIn(false);
   setCurrentUser(null);
 };

 // Submit review handler
 const handleSubmitReview = () => {
   if (!selectedProduct || !isLoggedIn) return;

   const newReviewObj: Review = {
     id: reviews.length + 1,
     userId: currentUser!.id,
     productId: selectedProduct.id,
     rating: newReview.rating,
     title: newReview.title,
     content: newReview.content,
     pros: newReview.pros.filter((pro) => pro !== ""),
     cons: newReview.cons.filter((con) => con !== ""),
     date: new Date().toISOString().split("T")[0],
     helpfulCount: 0,
     reviewImage: newReview.reviewImage || undefined,
     username: currentUser!.username,
     userAvatar: currentUser!.avatar,
     verifiedPurchase: true,
   };

   setReviews([...reviews, newReviewObj]);
   setShowReviewModal(false);
   setNewReview({
     rating: 0,
     title: "",
     content: "",
     pros: [""],
     cons: [""],
     reviewImage: "",
   });
   toast.success('Review submitted successfully!');
 };

 // Handle image upload
 const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
   // In a real app, this would upload to a server
   // For this demo, we'll just set a placeholder
   if (e.target.files && e.target.files[0]) {
     const reader = new FileReader();
     reader.onload = () => {
       if (reader.result) {
         setNewReview({
           ...newReview,
           reviewImage:
             "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVjaHxlbnwwfHwwfHx8MA%3D%3D",
         });
       }
     };
     reader.readAsDataURL(e.target.files[0]);
   }
 };

 // View product details handler
 const handleViewProductDetails = (product: Product) => {
   setSelectedProduct(product);
   setShowProductDetails(true);
 };

 // Handle write review click
 const handleWriteReviewClick = (product: Product) => {
   setSelectedProduct(product);
   if (!isLoggedIn) {
     setShowLoginModal(true);
   } else {
     setShowReviewModal(true);
   }
 };

 // Toggle mobile filter view
 const [showMobileFilter, setShowMobileFilter] = useState(false);

 // Utility function to render star ratings
 const renderStars = (rating: number) => {
   const stars = [];
   const fullStars = Math.floor(rating);
   const hasHalfStar = rating % 1 >= 0.5;

   for (let i = 0; i < fullStars; i++) {
     stars.push(
       <Star
         key={`star-${i}`}
         className="inline-block text-yellow-400"
         size={16}
         fill="currentColor"
       />
     );
   }

   if (hasHalfStar) {
     stars.push(
       <StarHalf
         key="half-star"
         className="inline-block text-yellow-400"
         size={16}
         fill="currentColor"
       />
     );
   }

   const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
   for (let i = 0; i < emptyStars; i++) {
     stars.push(
       <Star
         key={`empty-star-${i}`}
         className="inline-block text-gray-300"
         size={16}
       />
     );
   }

   return stars;
 };

 // Get unique brands and categories for filters
 const brands = [...new Set(products.map((product) => product.brand))];
 const categories = [...new Set(products.map((product) => product.category))];

 // Additional user reviews for "Your Reviews" section
 const additionalUserReviews: Review[] = [
   {
     id: 101,
     userId: 1,
     productId: 7,
     rating: 4,
     title: "Great mid-range phone with a few compromises",
     content:
       "I've been using the UltraPhone Lite for about a month now, and I'm quite impressed with what you get for the price. The battery life is excellent, and the camera performs well in good lighting. The 90Hz display makes scrolling and animations much smoother than my previous phone. However, the night photography could be better, and it does occasionally lag when running multiple apps.",
     pros: [
       "Excellent battery life",
       "Smooth 90Hz display",
       "Good daytime camera",
       "Fast charging",
     ],
     cons: [
       "Mediocre night photography",
       "Occasional lag with heavy multitasking",
     ],
     date: "2025-04-10",
     helpfulCount: 12,
     username: "TechReviewer",
     userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
     verifiedPurchase: true,
   },
   {
     id: 102,
     userId: 1,
     productId: 2,
     rating: 4.5,
     title: "Perfect ultrabook for productivity",
     content:
       "This laptop has transformed my workflow. The keyboard is exceptionally comfortable for long typing sessions, and the trackpad is responsive and accurate. Battery life easily gets me through a full workday. The display is gorgeous with accurate colors, making it great for photo editing. My only complaint is that the fans can get a bit loud when pushing the system, but that's a small price to pay for the performance.",
     pros: [
       "All-day battery life",
       "Excellent keyboard",
       "Stunning display",
       "Lightweight design",
     ],
     cons: ["Fans get loud under load", "Limited port selection"],
     date: "2025-03-20",
     helpfulCount: 28,
     username: "TechReviewer",
     userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
     verifiedPurchase: true,
   },
   {
     id: 103,
     userId: 1,
     productId: 8,
     rating: 5,
     title: "Best tablet I've ever used",
     content:
       "The SuperTab Pro exceeds all expectations. The screen is absolutely gorgeous—colors pop, text is crisp, and the 120Hz refresh rate makes everything buttery smooth. I use it for note-taking with the compatible stylus (sold separately), and the writing experience feels almost like paper. The battery lasts me several days of moderate use, and the speakers are surprisingly good for such a slim device. It's replaced my laptop for most everyday tasks.",
     pros: [
       "Stunning display",
       "Excellent stylus support",
       "Great battery life",
       "Premium build quality",
       "Impressive speakers",
     ],
     cons: ["Expensive accessories", "No headphone jack"],
     date: "2025-02-15",
     helpfulCount: 34,
     username: "TechReviewer",
     userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
     verifiedPurchase: true,
   },
   {
     id: 104,
     userId: 1,
     productId: 3,
     rating: 4,
     title: "Great fitness tracker with smart features",
     content:
       "I've been wearing the SmartWatch Series 5 daily for fitness tracking and notifications. The health metrics seem accurate compared to gym equipment, and the sleep tracking has provided some interesting insights. Battery life is decent at about 2 days with moderate use. The notification system works well, though responding on the small screen can be cumbersome. Overall, it strikes a good balance between fitness tracking and smartwatch features.",
     pros: [
       "Accurate fitness tracking",
       "Good sleep analytics",
       "Durable design",
       "Useful notification system",
     ],
     cons: ["Battery life could be better", "Limited third-party app support"],
     date: "2025-01-30",
     helpfulCount: 19,
     username: "TechReviewer",
     userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
     verifiedPurchase: true,
   },
 ];

 // Get user's reviews with the additional ones
 const userReviews = isLoggedIn
   ? [
       ...reviews.filter((review) => review.userId === currentUser?.id),
       ...additionalUserReviews,
     ]
   : [];

 // Get product reviews
 const productReviews = selectedProduct
   ? reviews.filter((review) => review.productId === selectedProduct.id)
   : [];

 // Calculate average rating for selected product
 const averageRating = selectedProduct
   ? (() => {
       const productReviews = reviews.filter((r) => r.productId === selectedProduct.id);
       if (productReviews.length === 0) return 0;
       return (
         productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
       );
     })()
   : 0;

 // Helper to force reflow and trigger shake
 const triggerShake = (setShake: React.Dispatch<React.SetStateAction<boolean>>) => {
   setShake(false);
   // Force reflow
   void document.body.offsetHeight;
   setShake(true);
 };

 // Helper to get average rating for a product
 const getAverageRating = (productId: number) => {
   const productReviews = reviews.filter((r) => r.productId === productId);
   if (productReviews.length === 0) return 0;
   return productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
 };

 // Helper to get average rating and review count for a product
 const getAverageRatingAndCount = (productId: number) => {
   const productReviews = reviews.filter((r) => r.productId === productId);
   if (productReviews.length === 0) return { avg: 0, count: 0 };
   const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
   return { avg, count: productReviews.length };
 };

 // Place this before the return statement in the Review component
 const detailsAvgAndCount = selectedProduct ? getAverageRatingAndCount(selectedProduct.id) : { avg: 0, count: 0 };

 // Prevent background scroll when modal is open
 useEffect(() => {
   if (showLoginModal || showReviewModal) {
     document.body.classList.add('overflow-hidden');
   } else {
     document.body.classList.remove('overflow-hidden');
   }
   // Clean up on unmount
   return () => {
     document.body.classList.remove('overflow-hidden');
   };
 }, [showLoginModal, showReviewModal]);

 // Reset dirty fields when review modal is closed
 useEffect(() => {
   if (!showReviewModal) {
     setTouched({ title: false, content: false, rating: false });
     setSubmitAttempted(false);
   }
 }, [showReviewModal]);

 return (
   <>
     <style>
       {`
         html {
           scroll-behavior: smooth;
         }
         .shake {
           animation: shake 0.3s;
         }
         @keyframes shake {
           0% { transform: translateX(0); }
           20% { transform: translateX(-6px); }
           40% { transform: translateX(6px); }
           60% { transform: translateX(-4px); }
           80% { transform: translateX(4px); }
           100% { transform: translateX(0); }
         }
         /* Modal fade/slide animation - steady, professional */
         .modal-fade {
           animation: modalFadeIn 0.44s cubic-bezier(.33,1,.68,1) both;
         }
         @keyframes modalFadeIn {
           0% { opacity: 0; transform: translateY(32px); }
           100% { opacity: 1; transform: none; }
         }
         /* Fade-in on scroll or mount - steady, professional */
         .fade-in {
           opacity: 0;
           transform: translateY(24px);
           transition: opacity 0.85s cubic-bezier(.33,1,.68,1), transform 0.85s cubic-bezier(.33,1,.68,1);
         }
         .fade-in.visible {
           opacity: 1;
           transform: none;
         }
         /* Input focus glow */
         .input-glow:focus {
           box-shadow: 0 0 0 2px #2563eb33, 0 1px 2px 0 #0000000d;
           border-color: #2563eb !important;
         }
       `}
     </style>
     <div
       style={{ fontFamily: "var(--font-roboto), sans-serif" }}
       className="min-h-screen bg-gray-50 flex flex-col font-sans"
     >
       {/* Header */}
       <header className="bg-white shadow-sm sticky top-0 z-50">
         <div className="container mx-auto px-4">
           <div className="flex items-center justify-between h-16">
             {/* Logo */}
             <div className="flex items-center space-x-2">
               <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
                 <Star className="text-white" size={18} />
               </div>
               <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                 TechReview
               </span>
             </div>

             {/* Desktop Navigation */}
             <nav className="hidden md:flex space-x-8">
               <a
                 href="#"
                 className="text-gray-800 hover:text-blue-600 transition-colors text-sm font-medium"
                 onClick={() => setShowProductDetails(false)}
               >
                 Home
               </a>
               <a
                 href="#featured-products"
                 onClick={() => setShowProductDetails(false)}
                 className="text-gray-800 hover:text-blue-600 transition-colors text-sm font-medium"
               >
                 Products
               </a>
               {/* loveleen */}
               {isLoggedIn && (
                 <a
                   href="#reviews"
                   onClick={() => setShowProductDetails(false)}
                   className="text-gray-800 hover:text-blue-600 transition-colors text-sm font-medium"
                 >
                   Reviews
                 </a>
               )}
             </nav>

             {/* Search, User and Cart */}
             <div className="flex items-center space-x-4">
               {isLoggedIn ? (
                 <div className="relative flex gap-3">
                   <button
                     className="flex items-center space-x-1 text-sm"
                     // onClick={() => setIsMenuOpen(!isMenuOpen)}
                   >
                     <img
                       src={currentUser?.avatar}
                       alt="User"
                       className="w-8 h-8 rounded-full"
                     />
                     <span className="hidden md:inline font-medium">
                       {currentUser?.username}
                     </span>
                   </button>
                   {/* loveleen */}
                   {isLoggedIn && (
                     <button
                       onClick={handleLogout}
                       className="hidden md:flex text-red-600 hover:text-red-800 transition-colors text-sm font-medium items-center cursor-pointer"
                     >
                       <LogOut size={16} className="mr-1" />
                     </button>
                   )}
                 </div>
               ) : (
                 <button
                   className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                   onClick={() => setShowLoginModal(true)}
                 >
                   <User size={16} />
                   <span className="hidden md:inline">Sign In</span>
                 </button>
               )}

               {/* Mobile menu button */}
               <button
                 className="md:hidden text-gray-500 hover:text-gray-700 cursor-pointer"
                 onClick={() => setIsMenuOpen(!isMenuOpen)}
               >
                 {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
               </button>
             </div>
           </div>

           {/* Mobile search & navigation (expanded) */}
           {isMenuOpen && (
             <div className="md:hidden py-4 border-t border-gray-100 bg-white">
               <nav className="flex flex-col space-y-3">
                 <a
                   href="#"
                   className="text-gray-800 hover:text-blue-600 transition-colors"
                   onClick={() => setShowProductDetails(false)}
                 >
                   Home
                 </a>
                 <a
                   href="#featured-products"
                   className="text-gray-800 hover:text-blue-600 transition-colors"
                   onClick={() => {
                     setIsMenuOpen(false);
                     setShowProductDetails(false);
                   }}
                   // optional: auto-close mobile menu
                 >
                   Products
                 </a>
                 {isLoggedIn && (
                   <a
                     href="#reviews"
                     className="text-gray-800 hover:text-blue-600 transition-colors text-sm font-medium"
                     onClick={() => setShowProductDetails(false)}
                   >
                     Reviews
                   </a>
                 )}
                 {isLoggedIn ? (
                   <button
                     className="text-red-600 hover:text-red-800 transition-colors text-left flex items-center cursor-pointer"
                     onClick={handleLogout}
                   >
                     <LogOut size={16} className="mr-2" />
                     Sign Out
                   </button>
                 ) : (
                   <button
                     className="text-blue-600 hover:text-blue-800 transition-colors text-left cursor-pointer"
                     onClick={() => {
                       setShowLoginModal(true);
                       setIsMenuOpen(false);
                     }}
                   >
                     Sign In
                   </button>
                 )}
               </nav>
             </div>
           )}
         </div>
       </header>

       {/* Product Details View */}
       {showProductDetails && selectedProduct ? (
         <main className="flex-grow">
           <div className="container mx-auto px-4 py-8">
             {/* Back button */}
             <button
               className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors cursor-pointer"
               onClick={() => setShowProductDetails(false)}
             >
               <ArrowLeft size={18} className="mr-1" />
               Back to products
             </button>

             {/* Product information */}
             <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-8">
               <div className="flex flex-col md:flex-row">
                 {/* Product image */}
                 <div className="md:w-2/5 p-6 flex items-center justify-center bg-gray-50">
                   <img
                     src={selectedProduct.image}
                     alt={selectedProduct.name}
                     className="max-w-full h-auto max-h-96 object-contain"
                   />
                 </div>

                 {/* Product details */}
                 <div className="md:w-3/5 p-6 md:pl-8 md:border-l border-gray-100">
                   <div className="mb-2">
                     <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                       {selectedProduct.category.charAt(0).toUpperCase() +
                         selectedProduct.category.slice(1)}
                     </span>
                     <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full ml-2">
                       {selectedProduct.brand}
                     </span>
                   </div>

                   <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                     {selectedProduct.name}
                   </h1>

                   {/* In product details header, use live average and count */}
                   <div className="flex items-center mb-4">
                     <div className="flex mr-2">
                       {detailsAvgAndCount.count > 0 ? renderStars(detailsAvgAndCount.avg) : renderStars(0)}
                     </div>
                     <span className="text-sm text-gray-500">
                       {detailsAvgAndCount.count > 0
                         ? `${detailsAvgAndCount.avg.toFixed(1)} • ${detailsAvgAndCount.count} reviews`
                         : 'No reviews yet'}
                     </span>
                   </div>

                   <p className="text-gray-600 mb-6">
                     {selectedProduct.description}
                   </p>
                   <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-6">
                     <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                       ${selectedProduct.price}
                     </span>
                     {selectedProduct.price >= 299 && (
                       <span className="text-sm sm:text-base text-gray-500">
                         or ${Math.round(selectedProduct.price / 12)}/month
                         with financing
                       </span>
                     )}
                   </div>

                   <div className="mb-6">
                     <span
                       className={`inline-flex items-center ${
                         selectedProduct.availability === "In stock"
                           ? "text-green-600"
                           : "text-orange-600"
                       }`}
                     >
                       <span
                         className={`w-2 h-2 rounded-full mr-2 ${
                           selectedProduct.availability === "In stock"
                             ? "bg-green-600"
                             : "bg-orange-600"
                         }`}
                       ></span>
                       {selectedProduct.availability || "In stock"}
                     </span>
                     {selectedProduct.warranty && (
                       <span className="inline-flex items-center ml-6 text-gray-500">
                         <Shield size={16} className="mr-1" />
                         {selectedProduct.warranty}
                       </span>
                     )}
                   </div>

                   <div className="flex flex-col sm:flex-row gap-4 mb-6">
                     <button
                       disabled
                       className="px-6 py-3 bg-gray-300 text-gray-600 font-medium rounded-lg w-full sm:w-auto cursor-not-allowed"
                     >
                       Not Deliverable at Your Location
                     </button>
                   </div>
                   <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                     <div className="flex items-center">
                       <Clock size={16} className="mr-1 text-gray-400" />
                       Released:{" "}
                       {new Date(
                         selectedProduct.releaseDate
                       ).toLocaleDateString("en-US", {
                         year: "numeric",
                         month: "short",
                         day: "numeric",
                       })}
                     </div>

                     <div className="flex items-center">
                       <Gift size={16} className="mr-1 text-gray-400" />
                       Gift Options
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             {/* Specifications and features */}
             {(selectedProduct.specifications || selectedProduct.features) && (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
                 {/* Specifications */}
                 {selectedProduct.specifications && (
                   <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                     <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                       <Cpu size={20} className="mr-2 text-blue-600" />
                       Specifications
                     </h2>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                       {Object.entries(selectedProduct.specifications).map(
                         ([key, value]) => (
                           <div key={key} className="flex flex-col">
                             <span className="text-sm text-gray-500 mb-1">
                               {key.charAt(0).toUpperCase() + key.slice(1)}
                             </span>
                             <span className="text-gray-900">{value}</span>
                           </div>
                         )
                       )}
                     </div>
                   </div>
                 )}

                 {/* Features */}
                 {selectedProduct.features && (
                   <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                     <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                       <Layers size={20} className="mr-2 text-blue-600" />
                       Key Features
                     </h2>
                     <ul className="space-y-2">
                       {selectedProduct.features.map((feature, index) => (
                         <li key={index} className="flex items-start">
                           <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mt-2 mr-2"></span>
                           <span>{feature}</span>
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}
               </div>
             )}

             {/* Reviews section */}
             <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-8">
               <div className="p-6 border-b border-gray-100">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
                   <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                     <MessageCircle size={20} className="mr-2 text-blue-600" />
                     Customer Reviews
                   </h2>
                   {productReviews.length > 0 && (
                     <button
                       className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto cursor-pointer"
                       onClick={() => handleWriteReviewClick(selectedProduct)}
                     >
                       Write a Review
                     </button>
                   )}
                 </div>

                 <div className="flex flex-col md:flex-row md:items-center mt-4">
                   <div className="mb-4 md:mb-0 md:mr-8">
                     <div className="flex items-center">
                       <span className="text-5xl font-bold text-gray-900 mr-2">
                         {productReviews.length > 0 ? averageRating.toFixed(1) : '0.0'}
                       </span>
                       <div className="flex flex-col">
                         <div className="flex mb-1">
                           {productReviews.length > 0 ? renderStars(averageRating) : renderStars(0)}
                         </div>
                         <span className="text-sm text-gray-500">
                           {productReviews.length > 0 ? `${productReviews.length} reviews` : 'No reviews yet'}
                         </span>
                       </div>
                     </div>
                   </div>

                   <div className="flex-grow">
                     {[5, 4, 3, 2, 1].map((star) => {
                       const starCount = reviews.filter(
                         (r) =>
                           r.productId === selectedProduct.id &&
                           Math.floor(r.rating) === star
                       ).length;
                       const percentage =
                         reviews.filter(
                           (r) => r.productId === selectedProduct.id
                         ).length > 0
                           ? (starCount /
                               reviews.filter(
                                 (r) => r.productId === selectedProduct.id
                               ).length) *
                             100
                           : 0;

                       return (
                         <div
                           key={star}
                           className="flex items-center mb-1 last:mb-0"
                         >
                           <div className="flex items-center w-16">
                             <span className="mr-1">{star}</span>
                             <Star
                               size={12}
                               className="text-yellow-400"
                               fill="currentColor"
                             />
                           </div>
                           <div className="flex-grow mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                             <div
                               className="h-full bg-yellow-400 rounded-full"
                               style={{ width: `${percentage}%` }}
                             ></div>
                           </div>
                           <span className="text-sm text-gray-500 w-10 text-right">
                             {starCount}
                           </span>
                         </div>
                       );
                     })}
                   </div>
                 </div>
               </div>

               {/* Reviews list */}
               <div>
                 {productReviews.length > 0 ? (
                   <>
                     {(showAllReviews
                       ? productReviews
                       : productReviews.slice(0, 3)
                     ).map((review) => (
                       <div
                         key={review.id}
                         className="p-6 border-b border-gray-100 last:border-b-0"
                       >
                         <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2 sm:gap-0">
                           <div className="flex items-center gap-3">
                             <img
                               src={
                                 review.userAvatar ||
                                 "https://randomuser.me/api/portraits/lego/1.jpg"
                               }
                               alt={review.username || "User"}
                               className="w-10 h-10 rounded-full mr-3"
                             />
                             <div>
                               <div className="font-medium text-gray-900 flex flex-col sm:flex-row sm:items-center gap-1">
                                 <span>{review.username || "User"}</span>
                                 {review.verifiedPurchase && (
                                   <span className="text-green-600 flex items-center sm:ml-2">
                                     <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                                     Verified Purchase
                                   </span>
                                 )}
                                 <span>{review.date}</span>
                               </div>
                             </div>
                           </div>
                           <div className="flex">
                             {renderStars(review.rating)}
                           </div>
                         </div>

                         <h3 className="font-bold text-gray-900 mb-2">
                           {review.title}
                         </h3>
                         <p className="text-gray-700 mb-4">{review.content}</p>

                         {(review.pros.length > 0 ||
                           review.cons.length > 0) && (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                             {review.pros.length > 0 && (
                               <div>
                                 <h4 className="font-medium text-gray-900 mb-2">
                                   Pros
                                 </h4>
                                 <ul className="space-y-1">
                                   {review.pros.map((pro, index) => (
                                     <li
                                       key={index}
                                       className="text-gray-600 flex items-center"
                                     >
                                       <span className="text-green-500 mr-2">
                                         +
                                       </span>
                                       {pro}
                                     </li>
                                   ))}
                                 </ul>
                               </div>
                             )}

                             {review.cons.length > 0 && (
                               <div>
                                 <h4 className="font-medium text-gray-900 mb-2">
                                   Cons
                                 </h4>
                                 <ul className="space-y-1">
                                   {review.cons.map((con, index) => (
                                     <li
                                       key={index}
                                       className="text-gray-600 flex items-center"
                                     >
                                       <span className="text-red-500 mr-2">
                                         -
                                       </span>
                                       {con}
                                     </li>
                                   ))}
                                 </ul>
                               </div>
                             )}
                           </div>
                         )}

                         {review.reviewImage && (
                           <div className="mb-4">
                             <img
                               src={review.reviewImage}
                               alt="Review image"
                               className="h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                             />
                           </div>
                         )}

                         <div className="flex items-center justify-between text-sm">
                           <div className="text-gray-500">
                             <span>
                               {review.helpfulCount} people found this review
                               helpful
                             </span>
                           </div>
                         </div>
                       </div>
                     ))}

                     {productReviews.length > 3 && (
                       <div className="p-6 text-center">
                         <button
                           className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                           onClick={() => setShowAllReviews(!showAllReviews)}
                         >
                           {showAllReviews
                             ? "Show Less Reviews"
                             : `Show All Reviews (${productReviews.length})`}
                         </button>
                       </div>
                     )}
                   </>
                 ) : (
                   <div className="p-8 text-center">
                     <div className="text-gray-300 mb-3">
                       <MessageCircle size={48} className="mx-auto" />
                     </div>
                     <h3 className="text-xl font-medium text-gray-700 mb-2">
                       No reviews yet
                     </h3>
                     <p className="text-gray-500 mb-4">
                       Be the first to review this product
                     </p>
                     <button
                       className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                       onClick={() => handleWriteReviewClick(selectedProduct)}
                     >
                       Write a Review
                     </button>
                   </div>
                 )}
               </div>
             </div>
           </div>
         </main>
       ) : (
         /* Main content */
         <main className="flex-grow">
           {/* Hero Section */}
           <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 md:py-24">
             <div className="container mx-auto px-4">
               <div className="flex flex-col md:flex-row items-center">
                 <div className="md:w-1/2 mb-8 md:mb-0">
                   <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                     Discover the Best in Tech
                   </h1>
                   <p className="text-lg md:text-xl mb-6 text-blue-100">
                     Honest reviews from real tech enthusiasts and experts.
                     Find your perfect device today.
                   </p>
                   <div className="flex flex-col sm:flex-row gap-4">
                     <button
                       className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-md hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                       onClick={() => {
                         const section = document.getElementById("featured-products");
                         if (section) {
                           section.scrollIntoView({ behavior: "smooth" });
                         }
                       }}
                     >
                       Browse Products
                     </button>
                   </div>
                 </div>
                 <div className="md:w-1/2 flex justify-center">
                   <img
                     src="https://images.unsplash.com/photo-1707485122968-56916bd2c464?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVjaG5vbG9neXxlbnwwfHwwfHx8MA%3D%3D"
                     alt="Latest Tech Devices"
                     className="rounded-lg shadow-2xl max-w-full h-auto"
                   />
                 </div>
               </div>
             </div>
           </section>

           {/* User's Reviews Section (if logged in) */}
           {isLoggedIn && userReviews.length > 0 && (
             <section className="py-10 bg-blue-50" id="reviews">
               <div className="container mx-auto px-4">
                 <div className="flex justify-between items-center mb-6 w-full">
                   <h2 className="text-2xl font-bold text-gray-800 text-center w-full py-4">
                     Your Reviews
                   </h2>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {userReviews.slice(0, 6).map((review) => {
                     const product = products.find(
                       (p) => p.id === review.productId
                     );
                     return (
                       <div
                         key={review.id}
                         className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
                       >
                         <div className="p-4">
                           <div className="flex items-center mb-2">
                             <div className="flex mr-2">
                               {renderStars(review.rating)}
                             </div>
                             <span className="text-sm text-gray-500">
                               {review.date}
                             </span>
                           </div>
                           <h3 className="font-bold text-lg mb-1">
                             {product?.name}
                           </h3>
                           <h4 className="font-medium text-gray-800 mb-2">
                             {review.title}
                           </h4>
                           <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                             {review.content}
                           </p>
                           <div className="flex justify-between">
                          
                             <span className="text-sm text-gray-500">
                               {review.helpfulCount} found helpful
                             </span>
                           </div>
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </div>
             </section>
           )}

           {/* Product Listing Section */}
           <section id="featured-products" className="py-12">
             <div className="container mx-auto px-4 ">
               <h2 className="text-3xl font-bold text-center w-full py-4 text-gray-800 mb-8">
                 Featured Products
               </h2>

               {/* Mobile filters toggle */}
               <div className="md:hidden mb-6">
                 <button
                   className="w-full py-3 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium flex items-center justify-center shadow-sm cursor-pointer"
                   onClick={() => setShowMobileFilter(!showMobileFilter)}
                 >
                   <Filter size={18} className="mr-2" />
                   Filters & Sorting
                 </button>
               </div>

               {/* Mobile filters panel */}
               {showMobileFilter && (
                 <div className="md:hidden mb-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
                   <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-lg text-gray-800">
                       Filters
                     </h3>
                     <button
                       className="text-gray-500 hover:text-gray-700 cursor-pointer"
                       onClick={() => setShowMobileFilter(false)}
                     >
                       <X size={20} />
                     </button>
                   </div>

                   {/* Sort options */}
                   <div className="mb-4">
                     <label className="block text-gray-700 font-medium mb-2">
                       Sort by
                     </label>
                     <select
                       className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       value={sorting}
                       onChange={(e) => setSorting(e.target.value)}
                     >
                       <option value="newest">Newest</option>
                       <option value="price-low-high">
                         Price: Low to High
                       </option>
                       <option value="price-high-low">
                         Price: High to Low
                       </option>
                       <option value="top-rated">Highest Rated</option>
                     </select>
                   </div>

                   {/* Brand Filter */}
                   <div className="mb-4">
                     <label className="block text-gray-700 font-medium mb-2">
                       Brand
                     </label>
                     <select
                       className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       value={filters.brand}
                       onChange={(e) =>
                         setFilters({ ...filters, brand: e.target.value })
                       }
                     >
                       <option value="">All Brands</option>
                       {brands.map((brand) => (
                         <option key={brand} value={brand}>
                           {brand}
                         </option>
                       ))}
                     </select>
                   </div>

                   {/* Category Filter */}
                   <div className="mb-4">
                     <label className="block text-gray-700 font-medium mb-2">
                       Category
                     </label>
                     <select
                       className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       value={filters.category}
                       onChange={(e) =>
                         setFilters({ ...filters, category: e.target.value })
                       }
                     >
                       <option value="">All Categories</option>
                       {categories.map((category) => (
                         <option key={category} value={category}>
                           {category.charAt(0).toUpperCase() +
                             category.slice(1)}
                         </option>
                       ))}
                     </select>
                   </div>

                   {/* Rating Filter */}
                   <div className="mb-4">
                     <label className="block text-gray-700 font-medium mb-2">
                       Minimum Rating
                     </label>
                     <div className="flex items-center space-x-2">
                       {[0, 1, 2, 3, 4].map((rating) => (
                         <button
                           key={rating}
                           className={`p-1 rounded ${
                             filters.minRating > rating
                               ? "text-yellow-400"
                               : "text-gray-300"
                           } cursor-pointer`}
                           onClick={() =>
                             setFilters({ ...filters, minRating: rating + 1 })
                           }
                         >
                           <Star size={24} fill="currentColor" />
                         </button>
                       ))}
                     </div>
                   </div>

                   {/* Price Range Filter */}
                   <div className="mb-4">
                     <label className="block text-gray-700 font-medium mb-2">
                       Price Range
                     </label>
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-gray-500 text-sm mb-1">
                           Min
                         </label>
                         <input
                           type="number"
                           className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                           value={filters.minPrice}
                           onChange={(e) =>
                             setFilters({
                               ...filters,
                               minPrice: parseInt(e.target.value) || 0,
                             })
                           }
                         />
                       </div>
                       <div>
                         <label className="block text-gray-500 text-sm mb-1">
                           Max
                         </label>
                         <input
                           type="number"
                           className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                           value={filters.maxPrice}
                           onChange={(e) =>
                             setFilters({
                               ...filters,
                               maxPrice: parseInt(e.target.value) || 0,
                             })
                           }
                         />
                       </div>
                     </div>
                   </div>

                   <div className="flex space-x-2">
                     <button
                       className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                       onClick={() => {
                         setShowMobileFilter(false);
                       }}
                     >
                       Apply Filters
                     </button>
                     <button
                       className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                       onClick={() => {
                         setFilters({
                           brand: "",
                           category: "",
                           minRating: 0,
                           minPrice: 0,
                           maxPrice: 10000,
                         });
                         setSorting("newest");
                       }}
                     >
                       Clear All
                     </button>
                   </div>
                 </div>
               )}

               <div className="flex flex-col lg:flex-row">
                 {/* Filters Sidebar (Desktop) */}
                 <div className="hidden md:block lg:w-1/4 pr-8">
                   <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                     <h3 className="font-bold text-lg mb-4 text-gray-800">
                       Filters
                     </h3>

                     {/* Brand Filter */}
                     <div className="mb-6">
                       <label className="block text-gray-700 font-medium mb-2">
                         Brand
                       </label>
                       <select
                         className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         value={filters.brand}
                         onChange={(e) =>
                           setFilters({ ...filters, brand: e.target.value })
                         }
                       >
                         <option value="">All Brands</option>
                         {brands.map((brand) => (
                           <option key={brand} value={brand}>
                             {brand}
                           </option>
                         ))}
                       </select>
                     </div>

                     {/* Category Filter */}
                     <div className="mb-6">
                       <label className="block text-gray-700 font-medium mb-2">
                         Category
                       </label>
                       <select
                         className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         value={filters.category}
                         onChange={(e) =>
                           setFilters({ ...filters, category: e.target.value })
                         }
                       >
                         <option value="">All Categories</option>
                         {categories.map((category) => (
                           <option key={category} value={category}>
                             {category.charAt(0).toUpperCase() +
                               category.slice(1)}
                           </option>
                         ))}
                       </select>
                     </div>

                     {/* Rating Filter */}
                     <div className="mb-6">
                       <label className="block text-gray-700 font-medium mb-2">
                         Minimum Rating
                       </label>
                       <div className="flex items-center space-x-2">
                         {[0, 1, 2, 3, 4].map((rating) => (
                           <button
                             key={rating}
                             className={`p-1 rounded ${
                               filters.minRating > rating
                                 ? "text-yellow-400"
                                 : "text-gray-300"
                             } cursor-pointer`}
                             onClick={() =>
                               setFilters({ ...filters, minRating: rating + 1 })
                             }
                           >
                             <Star size={24} fill="currentColor" />
                           </button>
                         ))}
                       </div>
                     </div>

                     {/* Price Range Filter */}
                     <div className="mb-6">
                       <label className="block text-gray-700 font-medium mb-2">
                         Price Range
                       </label>
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-gray-500 text-sm mb-1">
                             Min
                           </label>
                           <input
                             type="number"
                             className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                             value={filters.minPrice}
                             onChange={(e) =>
                               setFilters({
                                 ...filters,
                                 minPrice: parseInt(e.target.value) || 0,
                               })
                             }
                           />
                         </div>
                         <div>
                           <label className="block text-gray-500 text-sm mb-1">
                             Max
                           </label>
                           <input
                             type="number"
                             className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                             value={filters.maxPrice}
                             onChange={(e) =>
                               setFilters({
                                 ...filters,
                                 maxPrice: parseInt(e.target.value) || 0,
                               })
                             }
                           />
                         </div>
                       </div>
                     </div>

                     <button
                       className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                       onClick={() =>
                         setFilters({
                           brand: "",
                           category: "",
                           minRating: 0,
                           minPrice: 0,
                           maxPrice: 10000,
                         })
                       }
                     >
                       Clear Filters
                     </button>
                   </div>
                 </div>

                 {/* Products Grid */}
                 <div className="lg:w-3/4">
                   {/* Sort options */}

                   <div className="mb-8">
                     <div className="relative w-full mx-auto">
                       <input
                         type="text"
                         placeholder="Search products by name, brand, or category..."
                         className="w-full pl-12 pr-4 py-3 rounded-lg text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                       />
                       <Search
                         className="absolute left-4 top-3.5 text-gray-400"
                         size={20}
                       />
                       {searchTerm && (
                         <button
                           className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                           onClick={() => setSearchTerm("")}
                         >
                           <X size={20} />
                         </button>
                       )}
                     </div>
                   </div>
                   <div className="flex justify-between items-center mb-6">
                     <p className="text-gray-600">
                       <span className="font-medium">
                         {filteredProducts.length}
                       </span>{" "}
                       products found
                     </p>
                     <div className="flex items-center space-x-2">
                       <label className="text-gray-700 hidden sm:inline">
                         Sort by:
                       </label>
                       <select
                         className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         value={sorting}
                         onChange={(e) => setSorting(e.target.value)}
                       >
                         <option value="newest">Newest</option>
                         <option value="price-low-high">
                           Price: Low to High
                         </option>
                         <option value="price-high-low">
                           Price: High to Low
                         </option>
                         <option value="top-rated">Highest Rated</option>
                       </select>
                     </div>
                   </div>

                   {/* Products grid */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                     {filteredProducts.length > 0 ? (
                       filteredProducts.map((product) => {
                         const { avg, count } = getAverageRatingAndCount(product.id);
                         return (
                           <div
                             key={product.id}
                             className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
                           >
                             <div className="relative">
                               <img
                                 src={product.image}
                                 alt={product.name}
                                 className="w-full h-48 object-cover"
                               />

                               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                 <div className="flex items-center">
                                   {count > 0 ? renderStars(avg) : renderStars(0)}
                                   <span className="text-white text-sm ml-1">
                                     {count > 0 ? avg.toFixed(1) : 'No reviews yet'}
                                   </span>
                                 </div>
                               </div>
                             </div>
                             <div className="p-4">
                               <div className="flex justify-between items-start mb-1">
                                 <h3 className="font-bold text-gray-900">
                                   {product.name}
                                 </h3>
                                 <span className="font-bold text-blue-600">
                                   ${product.price}
                                 </span>
                               </div>
                               <p className="text-gray-500 text-sm mb-2">
                                 {product.brand}
                               </p>
                               <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                 {product.description}
                               </p>
                               <div className="flex space-x-2">
                                 <button
                                   className="flex-grow px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                                   onClick={() =>
                                     handleWriteReviewClick(product)
                                   }
                                 >
                                   Write Review
                                 </button>
                                 <button
                                   className="flex-grow px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                   onClick={() =>
                                     handleViewProductDetails(product)
                                   }
                                 >
                                   View Details
                                 </button>
                               </div>
                             </div>
                           </div>
                         );
                       })
                     ) : (
                       <div className="col-span-full flex flex-col items-center justify-center py-12">
                         <div className="text-gray-300 mb-4">
                           <Search size={48} />
                         </div>
                         <h3 className="text-xl font-medium text-gray-700 mb-2">
                           No products found
                         </h3>
                         <p className="text-gray-500">
                           Try adjusting your filters or search term
                         </p>
                       </div>
                     )}
                   </div>
                 </div>
               </div>
             </div>
           </section>

           {/* Call to Action - Write a Review */}
           <section className="bg-gray-100 py-16">
             <div className="container mx-auto px-4 text-center">
               <h2 className="text-3xl font-bold text-gray-800 mb-4">
                 Share Your Experience
               </h2>
               <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                 Your honest feedback helps others make better purchasing
                 decisions. Join our community of tech enthusiasts and share
                 your insights.
               </p>
             </div>
           </section>
         </main>
       )}

       {/* Footer */}
       <footer className="bg-gray-800 text-white pt-12 pb-8">
         <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
             <div>
               <div className="flex items-center space-x-2 mb-4">
                 <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
                   <Star className="text-white" size={20} />
                 </div>
                 <span className="text-xl font-bold">TechReview</span>
               </div>
               <p className="text-gray-400 mb-4">
                 Honest reviews from real tech enthusiasts. Find your perfect
                 device with confidence.
               </p>
             </div>
             <div>
               <h3 className="text-lg font-bold mb-4 flex items-center">
                 <Smartphone className="mr-2 text-blue-400" size={16} />
                 Categories
               </h3>
               <ul className="space-y-3">
                 <li>
                   <a
                     href="#"
                     className="text-gray-400 hover:text-white transition-colors flex items-center"
                   >
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                     Smartphones
                   </a>
                 </li>
                 <li>
                   <a
                     href="#"
                     className="text-gray-400 hover:text-white transition-colors flex items-center"
                   >
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                     Laptops
                   </a>
                 </li>
                 <li>
                   <a
                     href="#"
                     className="text-gray-400 hover:text-white transition-colors flex items-center"
                   >
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                     Audio
                   </a>
                 </li>
                 <li>
                   <a
                     href="#"
                     className="text-gray-400 hover:text-white transition-colors flex items-center"
                   >
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                     Wearables
                   </a>
                 </li>
                 <li>
                   <a
                     href="#"
                     className="text-gray-400 hover:text-white transition-colors flex items-center"
                   >
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                     Gaming
                   </a>
                 </li>
                 <li>
                   <a
                     href="#"
                     className="text-gray-400 hover:text-white transition-colors flex items-center"
                   >
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                     Cameras
                   </a>
                 </li>
               </ul>
             </div>
             <div>
               <h3 className="text-lg font-bold mb-4 flex items-center">
                 <Link2 className="mr-2 text-blue-400" size={16} />
                 Quick Links
               </h3>
               <ul className="space-y-3">
                 <li>
                   <a
                     href="#"
                     className="text-gray-400 hover:text-white transition-colors flex items-center"
                   >
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                     About Us
                   </a>
                 </li>
                 <li>
                   <a
                     href="#"
                     className="text-gray-400 hover:text-white transition-colors flex items-center"
                   >
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                     Contact
                   </a>
                 </li>
                 <li>
                   <a
                     href="#"
                     className="text-gray-400 hover:text-white transition-colors flex items-center"
                   >
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                     Privacy Policy
                   </a>
                 </li>
                 <li>
                   <a
                     href="#"
                     className="text-gray-400 hover:text-white transition-colors flex items-center"
                   >
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                     Terms of Service
                   </a>
                 </li>
                 <li>
                   <a
                     href="#"
                     className="text-gray-400 hover:text-white transition-colors flex items-center"
                   >
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                     FAQs
                   </a>
                 </li>
                 <li>
                   <a
                     href="#"
                     className="text-gray-400 hover:text-white transition-colors flex items-center"
                   >
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                     Sitemap
                   </a>
                 </li>
               </ul>
             </div>
             <div>
               <h3 className="text-lg font-bold mb-4 flex items-center">
                 <Mail className="mr-2 text-blue-400" size={16} />
                 Follow Us
               </h3>
               <p className="text-gray-400 mb-4">
                 Stay connected for the latest updates, reviews, and tech
                 insights.
               </p>
               <div className="flex flex-wrap gap-3">
                 <a
                   href="#"
                   className="text-gray-400 hover:text-white transition-colors bg-gray-700 p-2 rounded-full"
                 >
                   <svg
                     className="w-5 h-5"
                     fill="currentColor"
                     viewBox="0 0 24 24"
                     aria-hidden="true"
                   >
                     <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                   </svg>
                 </a>
                 <a
                   href="#"
                   className="text-gray-400 hover:text-white transition-colors bg-gray-700 p-2 rounded-full"
                 >
                   <svg
                     className="w-5 h-5"
                     fill="currentColor"
                     viewBox="0 0 24 24"
                     aria-hidden="true"
                   >
                     <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                   </svg>
                 </a>
                 <a
                   href="#"
                   className="text-gray-400 hover:text-white transition-colors bg-gray-700 p-2 rounded-full"
                 >
                   <svg
                     className="w-5 h-5"
                     fill="currentColor"
                     viewBox="0 0 24 24"
                     aria-hidden="true"
                   >
                     <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                   </svg>
                 </a>
                 <a
                   href="#"
                   className="text-gray-400 hover:text-white transition-colors bg-gray-700 p-2 rounded-full"
                 >
                   <svg
                     className="w-5 h-5"
                     fill="currentColor"
                     viewBox="0 0 24 24"
                     aria-hidden="true"
                   >
                     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"></path>
                   </svg>
                 </a>
               </div>
             </div>
           </div>

           {/* App Download Section */}
           <div className="bg-gray-700 rounded-xl p-6 mb-8">
             <div className="flex flex-col md:flex-row items-center justify-between gap-6">
               <div>
                 <h3 className="text-xl font-bold mb-2">
                   Download Our Mobile App
                 </h3>
                 <p className="text-gray-400 mb-4 md:mb-0">
                   Get exclusive offers and write reviews on the go!
                 </p>
               </div>
               <div className="flex flex-wrap gap-4">
                 <a
                   href="#"
                   className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors flex items-center"
                 >
                   <svg
                     className="w-6 h-6 mr-2"
                     viewBox="0 0 24 24"
                     fill="currentColor"
                   >
                     <path d="M17.5,2H8.6C8.2,2,7.9,2.1,7.6,2.4l-5.1,5C2.2,7.8,2,8.2,2,8.6v6.9C2,16.4,2.6,17,3.5,17h3.7c0.4,0,0.7-0.1,1-0.4 l5.1-5c0.3-0.3,0.4-0.6,0.4-1V3.5C13.7,2.6,14.6,2,15.5,2"></path>
                     <path d="M13.7,15.5v2.9c0,0.9-0.7,1.6-1.6,1.6H8.6c-0.4,0-0.7-0.1-1-0.4l-5.1-5C2.2,14.2,2,13.8,2,13.4V8.6 C2,7.7,2.6,7,3.5,7h3.7c0.4,0,0.7,0.1,1,0.4l5.1,5C13.6,12.8,13.7,13.1,13.7,13.5"></path>
                     <path d="M20.5,7h-3.7c-0.4,0-0.7,0.1-1,0.4l-5.1,5c-0.3,0.3-0.4,0.6-0.4,1v6.9c0,0.9,0.7,1.6,1.6,1.6h3.7 c0.4,0,0.7-0.1,1-0.4l5.1-5c0.3-0.3,0.4-0.6,0.4-1V8.6C22,7.7,21.4,7,20.5,7"></path>
                     <path d="M22,15.5V18c0,2.2-1.8,4-4,4h-4c-2.2,0-4-1.8-4-4v-2.5c0-0.8,0.7-1.5,1.5-1.5h2c0.4,0,0.7,0.1,1,0.4 l1.5,1.5c0.3,0.3,0.6,0.4,1,0.4h2c0.4,0,0.7-0.1,1-0.4l1.5-1.5c0.3-0.3,0.6-0.4,1-0.4h2C21.3,14,22,14.7,22,15.5"></path>
                   </svg>
                   <div>
                     <div className="text-xs">Download on the</div>
                     <div className="text-sm font-bold">App Store</div>
                   </div>
                 </a>
                 <a
                   href="#"
                   className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors flex items-center"
                 >
                   <svg
                     className="w-6 h-6 mr-2"
                     viewBox="0 0 24 24"
                     fill="currentColor"
                   >
                     <path d="M3,20.5V3.5C3,2.7,3.7,2,4.5,2h15C20.3,2,21,2.7,21,3.5v17c0,0.8-0.7,1.5-1.5,1.5h-15C3.7,22,3,21.3,3,20.5z"></path>
                     <path
                       fill="#fff"
                       d="M12,17.8l4-2.3c0.5-0.3,0.6-0.9,0.4-1.4c-0.3-0.5-0.9-0.6-1.4-0.4L12,15.8l-3-1.8c-0.5-0.3-1.1-0.1-1.4,0.4 c-0.3,0.5-0.1,1.1,0.4,1.4L12,17.8z"
                     ></path>
                     <path
                       fill="#fff"
                       d="M7,12l3-1.8l0-3.5c0-0.6-0.4-1-1-1c-0.6,0-1,0.4-1,1l0,3.5L7,12z"
                     ></path>
                     <path
                       fill="#fff"
                       d="M17,12l-3-1.8V6.8c0-0.6,0.4-1,1-1c0.6,0,1,0.4,1,1v3.5L17,12z"
                     ></path>
                   </svg>
                   <div>
                     <div className="text-xs">GET IT ON</div>
                     <div className="text-sm font-bold">Google Play</div>
                   </div>
                 </a>
               </div>
             </div>
           </div>

           <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row md:items-center md:justify-between">
             <p className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
               © 2025 TechReview. All rights reserved.
             </p>
             <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm text-gray-500">
               <a href="#" className="hover:text-gray-300 transition-colors cursor-pointer">
                 Privacy Policy
               </a>
               <span className="hidden md:inline">•</span>
               <a href="#" className="hover:text-gray-300 transition-colors cursor-pointer">
                 Terms of Use
               </a>
               <span className="hidden md:inline">•</span>
               <a href="#" className="hover:text-gray-300 transition-colors cursor-pointer">
                 Cookie Policy
               </a>
               <span className="hidden md:inline">•</span>
               <a href="#" className="hover:text-gray-300 transition-colors cursor-pointer">
                 Accessibility
               </a>
             </div>
           </div>
         </div>
       </footer>

       {/* Login Modal */}
       {showLoginModal && (
         <div className="fixed inset-0 z-50 overflow-y-auto">
           <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
             <div
               className="fixed inset-0 bg-black/50  transition-opacity"
               onClick={() => setShowLoginModal(false)}
             ></div>

             <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full modal-fade">
               <div className="absolute top-3 right-3">
                 <button
                   className="text-gray-400 hover:text-gray-500 transition-colors cursor-pointer"
                   onClick={() => setShowLoginModal(false)}
                 >
                   <X size={24} />
                 </button>
               </div>

               <div className="p-6">
                 <div className="flex justify-center mb-6">
                   <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
                     <LogIn className="text-white" size={24} />
                   </div>
                 </div>
                 <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                   Sign In
                 </h2>

                 <form
                   onSubmit={(e) => {
                     e.preventDefault();
                     handleLogin();
                   }}
                 >
                   <div className="mb-4">
                     <label className="block text-gray-700 font-medium mb-2">
                       Email
                     </label>
                     <input
                       type="email"
                       className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="user@example.com"
                       value={loginForm.email}
                       onChange={(e) =>
                         setLoginForm({ ...loginForm, email: e.target.value })
                       }
                       required
                     />
                   </div>
                   <div className="mb-6">
                     <label className="block text-gray-700 font-medium mb-2">
                       Password
                     </label>
                     <input
                       type="password"
                       className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="••••••••"
                       value={loginForm.password}
                       onChange={(e) =>
                         setLoginForm({
                           ...loginForm,
                           password: e.target.value,
                         })
                       }
                       required
                     />
                   </div>

                   <button
                     type="submit"
                     className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                   >
                     Sign In
                   </button>
                 </form>

                 <div className="mt-4 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
                   <p>For demo, use: user@example.com / password</p>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Review Submission Modal */}
       {showReviewModal && selectedProduct && (
         <div className="fixed inset-0 z-50 overflow-y-auto">
           <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
             <div
               className="fixed inset-0 glass-modal-overlay"
               onClick={() => setShowReviewModal(false)}
             ></div>

             <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full modal-fade">
               <div className="absolute top-3 right-3">
                 <button
                   className="text-gray-400 hover:text-gray-500 transition-colors cursor-pointer"
                   onClick={() => setShowReviewModal(false)}
                 >
                   <X size={24} />
                 </button>
               </div>

               <div className="p-6">
                 <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                   Write a Review
                 </h2>

                 <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center mb-6">
                   <div className="w-full md:w-1/3 flex-shrink-0 flex justify-center items-center">
                     <img
                       src={selectedProduct.image}
                       alt={selectedProduct.name}
                       className="w-40 h-40 object-contain rounded-lg shadow-sm bg-gray-50"
                     />
                   </div>
                   <div className="w-full md:w-2/3 flex flex-col justify-center">
                     <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">
                       {selectedProduct.name}
                     </h3>
                     <div className="text-gray-500 text-sm mb-1 md:mb-2">
                       {selectedProduct.brand} &bull; {selectedProduct.category.charAt(0).toUpperCase() + selectedProduct.category.slice(1)}
                     </div>
                     <div className="flex items-center mb-2">
                       <div className="flex mr-2">
                         {renderStars(detailsAvgAndCount.avg)}
                       </div>
                       <span className="text-sm text-gray-500">
                         {detailsAvgAndCount.avg.toFixed(1)} out of 5
                       </span>
                     </div>
                     <p className="text-gray-600 text-sm line-clamp-2 mb-0">
                       {selectedProduct.description}
                     </p>
                   </div>
                 </div>

                 <form
                   onSubmit={(e) => {
                     e.preventDefault();
                     setSubmitAttempted(true);
                     let shouldSubmit = true;
                     if (!newReview.title) {
                       triggerShake(setShakeTitle);
                       shouldSubmit = false;
                     }
                     if (!newReview.content) {
                       triggerShake(setShakeContent);
                       shouldSubmit = false;
                     }
                     if (!newReview.rating) {
                       shouldSubmit = false;
                     }
                     if (!newReview.title || !newReview.content) {
                       toast.error('Please fill the title and description.');
                     }
                     if (shouldSubmit) {
                       handleSubmitReview();
                     }
                   }}
                 >
                   {/* General error message for required fields */}
                   {submitAttempted && (!newReview.title || !newReview.content || !newReview.rating) && (
                     <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                       Please fill in all required fields before submitting your review.
                     </div>
                   )}
                   {/* Rating */}
                   <div className="mb-6">
                     <label className="block text-gray-700 font-medium mb-2">
                       Your Rating <span className="text-red-500">*</span>
                     </label>
                     <div className="flex items-center space-x-1">
                       {[1, 2, 3, 4, 5].map((rating) => (
                         <button
                           type="button"
                           key={rating}
                           className={`p-1 ${newReview.rating >= rating ? "text-yellow-400" : "text-gray-300"} transition-colors hover:scale-110 transform cursor-pointer`}
                           onClick={() => {
                             setNewReview({ ...newReview, rating });
                             setTouched((prev) => ({ ...prev, rating: true }));
                           }}
                           onFocus={() => setTouched((prev) => ({ ...prev, rating: true }))}
                         >
                           <Star size={32} fill="currentColor" />
                         </button>
                       ))}
                     </div>
                     {(submitAttempted || touched.rating) && !newReview.rating && (
                       <p className="text-red-500 text-xs mt-1">Rating is required.</p>
                     )}
                   </div>

                   {/* Review Title */}
                   <div className="mb-4">
                     <label className="block text-gray-700 font-medium mb-2">
                       Review Title <span className="text-red-500">*</span>
                     </label>
                     <input
                       type="text"
                       className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${(submitAttempted || touched.title) && !newReview.title ? 'border-red-500' : 'border-gray-300'}${shakeTitle ? ' shake' : ''}`}
                       placeholder="Summarize your experience"
                       value={newReview.title}
                       onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                       onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
                       required
                       onAnimationEnd={() => setShakeTitle(false)}
                     />
                     {(submitAttempted || touched.title) && !newReview.title && (
                       <p className="text-red-500 text-xs mt-1">Review title is required.</p>
                     )}
                   </div>

                   {/* Review Content */}
                   <div className="mb-4">
                     <label className="block text-gray-700 font-medium mb-2">
                       Review <span className="text-red-500">*</span>
                     </label>
                     <textarea
                       className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 transition-shadow ${(submitAttempted || touched.content) && !newReview.content ? 'border-red-500' : 'border-gray-300'}${shakeContent ? ' shake' : ''}`}
                       placeholder="What did you like or think about this product?"
                       value={newReview.content}
                       onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                       onBlur={() => setTouched((prev) => ({ ...prev, content: true }))}
                       required
                       onAnimationEnd={() => setShakeContent(false)}
                     ></textarea>
                     {(submitAttempted || touched.content) && !newReview.content && (
                       <p className="text-red-500 text-xs mt-1">Review description is required.</p>
                     )}
                   </div>

                   {/* Pros and Cons */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                     <div>
                       <label className="block text-gray-700 font-medium mb-2 flex items-center">
                         <span className="inline-block mr-2 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center"></span>
                         Pros
                       </label>
                       {newReview.pros.map((pro, index) => (
                         <div key={`pro-${index}`} className="flex mb-2">
                           <input
                             type="text"
                             className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                             placeholder={`Pro ${index + 1}`}
                             value={pro}
                             onChange={(e) => {
                               const updatedPros = [...newReview.pros];
                               updatedPros[index] = e.target.value;
                               setNewReview({
                                 ...newReview,
                                 pros: updatedPros,
                               });
                             }}
                           />
                           <button
                             type="button"
                             className="ml-2 px-3 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                             onClick={() => {
                               if (newReview.pros.length > 1) {
                                 const updatedPros = newReview.pros.filter(
                                   (_, i) => i !== index
                                 );
                                 setNewReview({
                                   ...newReview,
                                   pros: updatedPros,
                                 });
                               }
                             }}
                           >
                             <X size={16} />
                           </button>
                         </div>
                       ))}
                       <button
                         type="button"
                         className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center cursor-pointer"
                         onClick={() => {
                           setNewReview({
                             ...newReview,
                             pros: [...newReview.pros, ""],
                           });
                         }}
                       >
                         <span className="mr-1">+</span> Add Another Pro
                       </button>
                     </div>

                     <div>
                       <label className="block text-gray-700 font-medium mb-2 flex items-center">
                         <span className="inline-block mr-2 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"></span>
                         Cons
                       </label>
                       {newReview.cons.map((con, index) => (
                         <div key={`con-${index}`} className="flex mb-2">
                           <input
                             type="text"
                             className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                             placeholder={`Con ${index + 1}`}
                             value={con}
                             onChange={(e) => {
                               const updatedCons = [...newReview.cons];
                               updatedCons[index] = e.target.value;
                               setNewReview({
                                 ...newReview,
                                 cons: updatedCons,
                               });
                             }}
                           />
                           <button
                             type="button"
                             className="ml-2 px-3 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                             onClick={() => {
                               if (newReview.cons.length > 1) {
                                 const updatedCons = newReview.cons.filter(
                                   (_, i) => i !== index
                                 );
                                 setNewReview({
                                   ...newReview,
                                   cons: updatedCons,
                                 });
                               }
                             }}
                           >
                             <X size={16} />
                           </button>
                         </div>
                       ))}
                       <button
                         type="button"
                         className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center cursor-pointer"
                         onClick={() => {
                           setNewReview({
                             ...newReview,
                             cons: [...newReview.cons, ""],
                           });
                         }}
                       >
                         <span className="mr-1">+</span> Add Another Con
                       </button>
                     </div>
                   </div>

                   {/* Image Upload */}
                   <div className="mb-6">
                     <label className="block text-gray-700 font-medium mb-2">
                       Add Images (Optional)
                     </label>
                     <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                       {newReview.reviewImage ? (
                         <div className="relative">
                           <img
                             src={newReview.reviewImage}
                             alt="Review upload"
                             className="max-h-48 mx-auto rounded"
                           />
                           <button
                             type="button"
                             className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-gray-500 hover:text-gray-700 cursor-pointer"
                             onClick={() =>
                               setNewReview({ ...newReview, reviewImage: "" })
                             }
                           >
                             <X size={16} />
                           </button>
                         </div>
                       ) : (
                         <div>
                           <Upload
                             className="mx-auto text-gray-400 mb-2"
                             size={32}
                           />
                           <p className="text-gray-500 mb-2">
                             Drag and drop an image here, or click to select
                           </p>
                           <input
                             type="file"
                             className="hidden"
                             id="image-upload"
                             accept="image/*"
                             onChange={handleImageUpload}
                           />
                           <label
                             htmlFor="image-upload"
                             className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                           >
                             Select Image
                           </label>
                         </div>
                       )}
                     </div>
                   </div>

                   <div className="flex justify-end space-x-4 mt-8">
                     <button
                       type="button"
                       className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                       onClick={() => setShowReviewModal(false)}
                     >
                       Cancel
                     </button>
                     <button
                       type="submit"
                       className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-md cursor-pointer"
                       disabled={
                         !newReview.rating ||
                         !newReview.title ||
                         !newReview.content
                       }
                     >
                       Submit Review
                     </button>
                   </div>
                 </form>
               </div>
             </div>
           </div>
         </div>
       )}
       {/* Toast Container for react-toastify */}
       <ToastContainer
         position="top-right"
         autoClose={2500}
         hideProgressBar={false}
         newestOnTop
         closeOnClick
         pauseOnFocusLoss
         draggable
         pauseOnHover
         toastClassName="custom-toast"
         className="custom-toast-body"
       />
       <style>{`
         .custom-toast {
           border-radius: 10px !important;
           box-shadow: none !important;
           background: #f5f7fa !important;
           color: #222 !important;
           border: 1px solid #e3e8ee !important;
           font-family: 'Inter', 'Roboto', sans-serif !important;
           padding: 14px 18px !important;
           min-height: 48px !important;
           display: flex;
           align-items: center;
         }
         .custom-toast-body {
           font-size: 1rem !important;
           font-weight: 500 !important;
           color: #222 !important;
         }
         .Toastify__toast--success.custom-toast {
           background: #2563eb !important;
           color: #fff !important;
           border: none !important;
         }
         .Toastify__progress-bar {
           background: #2563eb !important;
           height: 3px !important;
           border-radius: 2px !important;
         }
         .Toastify__close-button {
           color: #fff !important;
           opacity: 0.7 !important;
           transition: opacity 0.2s;
         }
         .Toastify__close-button:hover {
           opacity: 1 !important;
         }
         .glass-modal-overlay {
           background: rgba(30, 41, 59, 0.45) !important; /* dark blue-gray with opacity */
           backdrop-filter: blur(16px) saturate(1.2);
           -webkit-backdrop-filter: blur(16px) saturate(1.2);
           border: none;
           transition: background 0.3s;
         }
       `}</style>
     </div>
   </>
 );
};

export default Review;
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  BookOpen,
  ShoppingCart,
  User,
  Search,
  Moon,
  Sun,
  Home,
  Info,
  Mail,
  X,
  Menu,
  ChevronDown,
  ChevronUp,
  Star,
  Filter,
  ArrowRight,
  Sparkles,
  Clock,
  CreditCard,
  DollarSign,
  Gift,
  Bookmark,
  Share2,
} from "lucide-react";

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  coverImage: string;
  additionalImages: string[];
  description: string;
  genre: string[];
  rating: number;
  reviews: Review[];
  releaseDate?: string;
  pages?: number;
  featured?: boolean;
}

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

interface CartItem {
  book: Book;
  quantity: number;
}

const books: Book[] = [
  {
    id: 1,
    title: "The Silent Echo",
    author: "Elena Blackwood",
    price: 14.99,
    coverImage:
      "https://images.unsplash.com/photo-1748156783945-c8c585c403b3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D",
    additionalImages: [
      "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "A haunting tale of mystery and intrigue set in a small coastal town. When strange echoes begin to haunt the residents, a local journalist must uncover the town's dark past before it consumes them all.",
    genre: ["Mystery", "Thriller", "Supernatural"],
    rating: 4.7,
    releaseDate: "2025-03-15",
    pages: 342,
    featured: true,
    reviews: [
      {
        id: 1,
        userName: "BookLover42",
        rating: 5,
        comment:
          "Absolutely couldn't put it down! The atmosphere created is palpable and the characters feel so real.",
        date: "2025-04-15",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
      {
        id: 2,
        userName: "MysteryFan",
        rating: 4,
        comment:
          "Brilliant pacing and an unexpected ending. Would definitely recommend to any thriller fans.",
        date: "2025-04-02",
        avatar: "https://i.pravatar.cc/150?img=8",
      },
    ],
  },
  {
    id: 2,
    title: "Quantum Dreams",
    author: "Marcus Chen",
    price: 16.99,
    coverImage:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1748053902367-b62241fc263f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
    ],
    description:
      "A mind-bending science fiction novel exploring the intersection of quantum physics and human consciousness. When a brilliant physicist discovers she can manipulate reality through her dreams, the boundaries between worlds begin to collapse.",
    genre: ["Science Fiction", "Philosophical"],
    rating: 4.5,
    releaseDate: "2025-02-28",
    pages: 415,
    featured: true,
    reviews: [
      {
        id: 1,
        userName: "SciFiEnthusiast",
        rating: 5,
        comment:
          "Mind-blowing concepts presented in an accessible way. The philosophical implications kept me thinking for days.",
        date: "2025-03-28",
        avatar: "https://i.pravatar.cc/150?img=11",
      },
      {
        id: 2,
        userName: "PhysicsNerd",
        rating: 4,
        comment:
          "The quantum concepts are impressively accurate while the story remains engaging and emotionally resonant.",
        date: "2025-04-10",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
    ],
  },
  {
    id: 3,
    title: "Whispers Garden",
    author: "Sophia Rosewood",
    price: 12.99,
    coverImage:
      "https://images.unsplash.com/photo-1747863498866-e88b7ef50d3e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8",
    additionalImages: [
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "A tender and poignant tale of love, loss, and renewal. When a young widow inherits her grandmother's cottage with its mysterious garden, she discovers that the plants have secrets to share about both her past and future.",
    genre: ["Romance", "Contemporary", "Magical Realism"],
    rating: 4.8,
    releaseDate: "2025-01-20",
    pages: 298,
    reviews: [
      {
        id: 1,
        userName: "GreenThumb",
        rating: 5,
        comment:
          "The descriptions of the garden made me feel like I was there. Such a beautiful metaphor for grief and healing.",
        date: "2025-04-22",
        avatar: "https://i.pravatar.cc/150?img=23",
      },
      {
        id: 2,
        userName: "RomanceReader",
        rating: 5,
        comment:
          "Cried my eyes out and then felt uplifted. The perfect emotional journey.",
        date: "2025-04-05",
        avatar: "https://i.pravatar.cc/150?img=29",
      },
    ],
  },
  {
    id: 4,
    title: "Codebreaker",
    author: "Julian West",
    price: 18.99,
    coverImage:
      "https://images.unsplash.com/photo-1587613865763-4b8b0d19e8ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1546521343-4eb2c01aa44b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1510172951991-856a654063f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "A fast-paced techno-thriller set in the near future. When a brilliant cryptographer discovers a pattern in seemingly random terrorist attacks, she becomes the target of both the perpetrators and government agencies with their own agendas.",
    genre: ["Thriller", "Techno-thriller", "Espionage"],
    rating: 4.6,
    releaseDate: "2025-02-10",
    pages: 387,
    reviews: [
      {
        id: 1,
        userName: "TechGeek",
        rating: 5,
        comment:
          "The technical details are spot on without slowing down the plot. Edge-of-your-seat tension throughout!",
        date: "2025-03-15",
        avatar: "https://i.pravatar.cc/150?img=12",
      },
      {
        id: 2,
        userName: "ThrillerFan",
        rating: 4,
        comment:
          "Some great twists and turns. The protagonist is brilliantly written and relatable despite her genius-level intellect.",
        date: "2025-04-20",
        avatar: "https://i.pravatar.cc/150?img=19",
      },
    ],
  },
  {
    id: 5,
    title: "The Forgotten City",
    author: "Rafael Domingo",
    price: 15.99,
    coverImage:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "An archaeological adventure that spans centuries. When a team of researchers discovers an ancient city hidden beneath the Amazon rainforest, they unearth not only artifacts but also a legacy of power that threatens the modern world.",
    genre: ["Adventure", "Historical", "Mystery"],
    rating: 4.9,
    releaseDate: "2025-01-05",
    pages: 478,
    featured: false,
    reviews: [
      {
        id: 1,
        userName: "HistoryBuff",
        rating: 5,
        comment:
          "The historical research that went into this is impressive. I felt transported across time.",
        date: "2025-04-12",
        avatar: "https://i.pravatar.cc/150?img=16",
      },
      {
        id: 2,
        userName: "AdventureSeeker",
        rating: 5,
        comment:
          "Indiana Jones meets Dan Brown with a fresh, original twist. Couldn't stop reading!",
        date: "2025-03-30",
        avatar: "https://i.pravatar.cc/150?img=33",
      },
    ],
  },
  {
    id: 6,
    title: "Starlight Chronicles",
    author: "Aurora Wells",
    price: 19.99,
    coverImage:
      "https://images.unsplash.com/photo-1748201135959-8635c11aebdb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNHx8fGVufDB8fHx8fA%3D%3D",
    additionalImages: [
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1465101162946-4377e57745c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "An epic space opera spanning galaxies and generations. As humanity expands into the stars, ancient cosmic forces awaken, and the fate of multiple species rests in the hands of an unlikely alliance of misfits and rebels.",
    genre: ["Science Fiction", "Space Opera", "Epic"],
    rating: 4.7,
    releaseDate: "2025-03-25",
    pages: 542,
    reviews: [
      {
        id: 1,
        userName: "SpaceExplorer",
        rating: 5,
        comment:
          "World-building that rivals the greats of sci-fi. The alien cultures are particularly well-developed and unique.",
        date: "2025-04-08",
        avatar: "https://i.pravatar.cc/150?img=41",
      },
      {
        id: 2,
        userName: "SciFiClassicist",
        rating: 4,
        comment:
          "A fresh take on space opera that honors the classics while pushing the genre forward.",
        date: "2025-03-25",
        avatar: "https://i.pravatar.cc/150?img=50",
      },
    ],
  },
  {
    id: 7,
    title: "Midnight Alchemy",
    author: "Octavia Blackwood",
    price: 17.49,
    coverImage:
      "https://images.unsplash.com/photo-1600431521340-491eca880813?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1511108690759-009324a90311?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518281361980-b26bfd556770?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "In a world where alchemy is science and magic is real, a young apothecary's apprentice discovers a forbidden formula that could either save the fractured kingdom or plunge it into eternal darkness.",
    genre: ["Fantasy", "Historical Fantasy", "Young Adult"],
    rating: 4.8,
    releaseDate: "2025-02-18",
    pages: 368,
    reviews: [
      {
        id: 1,
        userName: "MagicSeeker",
        rating: 5,
        comment:
          "The magic system is intricate and fascinating. I was completely immersed in this world from page one.",
        date: "2025-03-20",
        avatar: "https://i.pravatar.cc/150?img=17",
      },
      {
        id: 2,
        userName: "FantasyReader",
        rating: 5,
        comment:
          "Such vivid writing! I could practically smell the herbs and potions in the apothecary.",
        date: "2025-04-02",
        avatar: "https://i.pravatar.cc/150?img=22",
      },
    ],
  },
  {
    id: 8,
    title: "The Last Algorithm",
    author: "Arjun Mehta",
    price: 16.99,
    coverImage:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    ],
    description:
      "When a brilliant but reclusive programmer creates an algorithm that can predict anyone's death with 100% accuracy, the world's most powerful people will stop at nothing to control it. But some secrets were never meant to be unlocked.",
    genre: ["Techno-thriller", "Science Fiction", "Suspense"],
    rating: 4.6,
    releaseDate: "2025-04-01",
    pages: 412,
    featured: true,
    reviews: [
      {
        id: 1,
        userName: "CodeMonkey",
        rating: 5,
        comment:
          "As someone who works in AI, I found the technical aspects surprisingly plausible. Terrifying and thought-provoking.",
        date: "2025-04-15",
        avatar: "https://i.pravatar.cc/150?img=52",
      },
      {
        id: 2,
        userName: "ThrillerJunkie",
        rating: 4,
        comment:
          "Fast-paced and incredibly tense. I was holding my breath during the final chapters!",
        date: "2025-04-18",
        avatar: "https://i.pravatar.cc/150?img=39",
      },
    ],
  },
];

const allGenres = Array.from(new Set(books.flatMap((book) => book.genre)));

const BookMarketplace = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [showGenreFilter, setShowGenreFilter] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [activeSection, setActiveSection] = useState("home");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookView, setBookView] = useState<"grid" | "list">("grid");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Checkout form states
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    nameOnCard: "",
    expiry: "",
    cvv: "",
  });

  const heroImages = [
    "https://images.unsplash.com/photo-1526243741027-444d633d7365?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1495640388908-05b31e524ef2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80",
  ];

  const homeRef = useRef<HTMLDivElement>(null);
  const booksRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre =
      selectedGenres.length === 0 ||
      book.genre.some((genre) => selectedGenres.includes(genre));
    const matchesPrice =
      book.price >= priceRange[0] && book.price <= priceRange[1];

    return matchesSearch && matchesGenre && matchesPrice;
  });

  const featuredBooks = books.filter((book) => book.featured);

  const getRelatedBooks = (book: Book) => {
    return books
      .filter(
        (b) =>
          b.id !== book.id &&
          b.genre.some((genre) => book.genre.includes(genre))
      )
      .slice(0, 3);
  };

  const addToCart = (book: Book) => {
    setLoading(true);

    setTimeout(() => {
      const existingItem = cart.find((item) => item.book.id === book.id);

      if (existingItem) {
        setCart(
          cart.map((item) =>
            item.book.id === book.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        setCart([...cart, { book, quantity: 1 }]);
      }

      setNotificationMessage(`${book.title} added to cart!`);
      setShowNotification(true);
      setLoading(false);

      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }, 600);
  };

  const removeFromCart = (bookId: number) => {
    setCart(cart.filter((item) => item.book.id !== bookId));
  };

  const updateCartItemQuantity = (bookId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }

    setCart(
      cart.map((item) =>
        item.book.id === bookId ? { ...item, quantity } : item
      )
    );
  };

  const toggleWishlist = (bookId: number) => {
    if (wishlist.includes(bookId)) {
      setWishlist(wishlist.filter((id) => id !== bookId));
      setNotificationMessage("Removed from wishlist");
    } else {
      setWishlist([...wishlist, bookId]);
      setNotificationMessage("Added to wishlist");
    }

    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleContactSubmit = () => {
    if (name && email && message) {
      setLoading(true);

      setTimeout(() => {
        setContactSubmitted(true);
        setLoading(false);

        setTimeout(() => {
          setName("");
          setEmail("");
          setMessage("");
          setContactSubmitted(false);
        }, 3000);
      }, 1000);
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setCheckoutStep(1);
  };

  const continueCheckout = () => {
    if (checkoutStep === 1) {
      if (
        shippingAddress.fullName &&
        shippingAddress.address &&
        shippingAddress.city &&
        shippingAddress.state &&
        shippingAddress.zip &&
        shippingAddress.country
      ) {
        setCheckoutStep(2);
      } else {
        setNotificationMessage("Please fill in all shipping fields");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    } else if (checkoutStep === 2) {
      if (
        paymentDetails.cardNumber &&
        paymentDetails.nameOnCard &&
        paymentDetails.expiry &&
        paymentDetails.cvv
      ) {
        setLoading(true);

        setTimeout(() => {
          setOrderComplete(true);
          setLoading(false);

          setTimeout(() => {
            setCart([]);
            setIsCheckingOut(false);
            setOrderComplete(false);
            setShowCart(false);

            setShippingAddress({
              fullName: "",
              address: "",
              city: "",
              state: "",
              zip: "",
              country: "",
            });
            setPaymentDetails({
              cardNumber: "",
              nameOnCard: "",
              expiry: "",
              cvv: "",
            });
          }, 5000);
        }, 2000);
      } else {
        setNotificationMessage("Please fill in all payment fields");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    }
  };

  const cancelCheckout = () => {
    setIsCheckingOut(false);
    setCheckoutStep(1);
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.book.price * item.quantity,
    0
  );

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress({
      ...shippingAddress,
      [name]: value,
    });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails({
      ...paymentDetails,
      [name]: value,
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Effect to handle body scrolling when a modal (cart or book details) is open
  useEffect(() => {
    const body = document.body;
    if (showCart || selectedBook) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      body.style.overflow = '';
    };
  }, [showCart, selectedBook]); // Re-run effect if showCart or selectedBook changes

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      if (homeRef.current && scrollPosition < homeRef.current.offsetHeight) {
        setActiveSection("home");
      } else if (
        booksRef.current &&
        scrollPosition <
          booksRef.current.offsetTop + booksRef.current.offsetHeight
      ) {
        setActiveSection("books");
      } else if (
        aboutRef.current &&
        scrollPosition <
          aboutRef.current.offsetTop + aboutRef.current.offsetHeight
      ) {
        setActiveSection("about");
      } else if (contactRef.current) {
        setActiveSection("contact");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleGenreFilter = () => {
    setShowGenreFilter(!showGenreFilter);
  };

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedGenres([]);
    setPriceRange([0, 50]);
  };

  const handlePriceChange = (value: number, index: number) => {
    const newRange = [...priceRange] as [number, number];
    newRange[index] = value;
    setPriceRange(newRange);
  };

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);

    let sectionRef;
    switch (sectionId) {
      case "home":
        sectionRef = homeRef;
        break;
      case "books":
        sectionRef = booksRef;
        break;
      case "about":
        sectionRef = aboutRef;
        break;
      case "contact":
        sectionRef = contactRef;
        break;
      default:
        sectionRef = null;
    }

    if (sectionRef && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-24 h-24">
              <motion.span
                className="absolute inset-0 rounded-full border-4 border-t-transparent border-b-transparent border-purple-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.span
                className="absolute inset-2 rounded-full border-4 border-l-transparent border-r-transparent border-purple-300"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            className={`fixed top-24 right-4 z-[9999] px-6 py-3 rounded-lg shadow-lg ${
              darkMode ? "bg-purple-800 text-white" : "bg-purple-600 text-white"
            }`}
            initial={{ opacity: 0, y: -50, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -50, x: 100 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {notificationMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-lg ${
          darkMode
            ? "bg-gray-900/70 border-gray-800"
            : "bg-white/70 border-gray-200"
        } border-b`}
      >
        <div className="container mx-auto px-3 md:px-4 py-4 md:py-4 flex justify-between items-center">
          <motion.div
            className="flex items-center gap-1 md:gap-2 font-bold text-lg md:text-xl cursor-pointer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => scrollToSection("home")}
          >
            <BookOpen
              className={`w-5 h-5 md:w-6 md:h-6 ${darkMode ? "text-purple-400" : "text-purple-600"}`}
            />
            <span
              className={`${
                darkMode ? "text-white" : "text-gray-900"
              } font-serif tracking-wide`}
            >
              <span className="text-purple-500">Indie</span>Page
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            className="hidden md:flex items-center gap-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.a
              href="#home"
              className={`font-medium transition-colors flex items-center gap-1 relative px-2 py-1 ${
                activeSection === "home"
                  ? "text-purple-500"
                  : darkMode
                  ? "text-gray-300 hover:text-purple-400"
                  : "text-gray-700 hover:text-purple-600"
              }`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("home");
              }}
              whileHover={{ scale: 1.05 }}
            >
              <Home size={18} />
              <span>Home</span>
              {activeSection === "home" && (
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full"
                  layoutId="navIndicator"
                />
              )}
            </motion.a>
            <motion.a
              href="#books"
              className={`font-medium transition-colors flex items-center gap-1 relative px-2 py-1 ${
                activeSection === "books"
                  ? "text-purple-500"
                  : darkMode
                  ? "text-gray-300 hover:text-purple-400"
                  : "text-gray-700 hover:text-purple-600"
              }`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("books");
              }}
              whileHover={{ scale: 1.05 }}
            >
              <BookOpen size={18} />
              <span>Books</span>
              {activeSection === "books" && (
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full"
                  layoutId="navIndicator"
                />
              )}
            </motion.a>
            <motion.a
              href="#about"
              className={`font-medium transition-colors flex items-center gap-1 relative px-2 py-1 ${
                activeSection === "about"
                  ? "text-purple-500"
                  : darkMode
                  ? "text-gray-300 hover:text-purple-400"
                  : "text-gray-700 hover:text-purple-600"
              }`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("about");
              }}
              whileHover={{ scale: 1.05 }}
            >
              <Info size={18} />
              <span>About</span>
              {activeSection === "about" && (
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full"
                  layoutId="navIndicator"
                />
              )}
            </motion.a>
            <motion.a
              href="#contact"
              className={`font-medium transition-colors flex items-center gap-1 relative px-2 py-1 ${
                activeSection === "contact"
                  ? "text-purple-500"
                  : darkMode
                  ? "text-gray-300 hover:text-purple-400"
                  : "text-gray-700 hover:text-purple-600"
              }`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
              }}
              whileHover={{ scale: 1.05 }}
            >
              <Mail size={18} />
              <span>Contact</span>
              {activeSection === "contact" && (
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full"
                  layoutId="navIndicator"
                />
              )}
            </motion.a>
          </motion.nav>

          {/* Actions */}
          <motion.div
            className="flex items-center gap-2 md:gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Dark mode toggle */}
            <motion.button
              onClick={toggleDarkMode}
              className={`p-1.5 md:p-2 rounded-full cursor-pointer ${
                darkMode
                  ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } transition-colors`}
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {darkMode ? <Sun size={18} className="md:w-5 md:h-5" /> : <Moon size={18} className="md:w-5 md:h-5" />}
            </motion.button>

            {/* Cart button */}
            <motion.button
              onClick={() => setShowCart(true)}
              className={`p-1.5 md:p-2 rounded-full relative cursor-pointer ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-200 hover:bg-gray-300"
              } transition-colors`}
              aria-label="Shopping cart"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingCart size={18} className="md:w-5 md:h-5" />
              {cart.length > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-purple-600 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </motion.span>
              )}
            </motion.button>

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-1.5 md:p-2 rounded-full md:hidden cursor-pointer ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-200 hover:bg-gray-300"
              } transition-colors`}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? <X size={18} className="md:w-5 md:h-5" /> : <Menu size={18} className="md:w-5 md:h-5" />}
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className={`absolute top-full left-0 right-0 ${
                darkMode ? "bg-gray-800/95" : "bg-white/95"
              } border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
              } md:hidden backdrop-blur-md`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="container mx-auto py-4 px-4 flex flex-col gap-4">
                <motion.a
                  href="#home"
                  className={`font-medium ${
                    activeSection === "home" ? "text-purple-500" : ""
                  } hover:text-purple-500 transition-colors py-2 flex items-center gap-2`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("home");
                  }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Home size={18} />
                  <span>Home</span>
                </motion.a>
                <motion.a
                  href="#books"
                  className={`font-medium ${
                    activeSection === "books" ? "text-purple-500" : ""
                  } hover:text-purple-500 transition-colors py-2 flex items-center gap-2`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("books");
                  }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <BookOpen size={18} />
                  <span>Books</span>
                </motion.a>
                <motion.a
                  href="#about"
                  className={`font-medium ${
                    activeSection === "about" ? "text-purple-500" : ""
                  } hover:text-purple-500 transition-colors py-2 flex items-center gap-2`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("about");
                  }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Info size={18} />
                  <span>About</span>
                </motion.a>
                <motion.a
                  href="#contact"
                  className={`font-medium ${
                    activeSection === "contact" ? "text-purple-500" : ""
                  } hover:text-purple-500 transition-colors py-2 flex items-center gap-2`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("contact");
                  }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Mail size={18} />
                  <span>Contact</span>
                </motion.a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main content */}
      <main className="pt-16">
        {/* Hero Section */}
        <section
          id="home"
          ref={homeRef}
          className="relative min-h-screen h-screen overflow-hidden"
        >
          {/* Hero Image Carousel */}
          {heroImages.map((image, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${image})` }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: index === currentHeroImage ? 1 : 0,
                scale: index === currentHeroImage ? 1 : 1.1,
              }}
              transition={{ duration: 1.5 }}
            />
          ))}

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />

          {/* Content */}
          <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center z-10 py-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-4 md:mb-6"
            >
              <span className="inline-block px-3 py-1 md:px-4 md:py-1 rounded-full text-xs md:text-sm font-medium bg-purple-600/20 text-purple-300 backdrop-blur-sm mb-3 md:mb-4">
                Direct from Authors to Readers
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 font-serif leading-tight">
                Discover <span className="text-purple-400">Independent</span>{" "}
                Voices
              </h1>
            </motion.div>

            <motion.p
              className="text-lg md:text-xl text-gray-200 mb-6 md:mb-8 max-w-2xl leading-relaxed px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Support creators who pour their heart and soul into every page.
              Find your next favorite book directly from the authors who bring
              worlds to life.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center mb-12 md:mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.a
                href="#books"
                className="group relative px-6 py-3 md:px-8 md:py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 text-white font-medium overflow-hidden w-full sm:w-auto text-center"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("books");
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Explore Books
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>

              <motion.a
                href="#about"
                className="px-6 py-3 md:px-8 md:py-3 rounded-full bg-transparent border-2 border-white/30 hover:border-white/60 text-white font-medium backdrop-blur-sm transition-colors w-full sm:w-auto text-center"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("about");
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                About IndiePage
              </motion.a>
            </motion.div>

            {/* New Release Notification - positioned in the flow */}
            <motion.div
              className="flex justify-center mb-8 md:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <div className="rounded-full px-4 py-2 md:px-6 md:py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white mx-4 max-w-sm md:max-w-none">
                <div className="flex items-center gap-2 md:gap-4">
                  <Sparkles size={16} className="text-purple-400 md:w-5 md:h-5 flex-shrink-0" />
                  <p className="text-xs md:text-sm">
                    <span className="font-bold text-purple-300">
                      New Release:
                    </span>{" "}
                    "The Last Algorithm" by Arjun Mehta
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown size={24} className="md:w-8 md:h-8" />
          </motion.div>
        </section>

        {/* Featured Books Section */}
        <section
          className={`py-20 ${
            darkMode ? "bg-gray-900/50" : "bg-white/50"
          } backdrop-blur-sm`}
        >
          <div className="container mx-auto px-4">
            <motion.div
              className="mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 mb-4">
                Featured Selections
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Handpicked for You
              </h2>
              <p
                className={`max-w-2xl mx-auto ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Discover these exceptional reads curated by our team of
                passionate bookworms
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {featuredBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  className={`group relative overflow-hidden rounded-xl cursor-pointer ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } shadow-xl`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  onClick={() => setSelectedBook(book)}
                >
                  <div className="relative h-96 overflow-hidden">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {book.title}
                      </h3>
                      <p className="text-gray-300 mb-3">by {book.author}</p>
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {book.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold truncate">
                          {book.title}
                        </h3>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          by {book.author}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          darkMode
                            ? "bg-purple-900/50 text-purple-200"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        ${book.price.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center mt-2 mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < Math.floor(book.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : i < book.rating
                                ? "text-yellow-400 fill-yellow-400 opacity-50"
                                : `${
                                    darkMode ? "text-gray-600" : "text-gray-300"
                                  }`
                            }
                          />
                        ))}
                      </div>
                      <span
                        className={`ml-2 text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        ({book.reviews.length})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {book.genre.slice(0, 1).map((genre) => (
                          <span
                            key={genre}
                            className={`text-xs px-2 py-1 rounded-full ${
                              darkMode
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {genre}
                          </span>
                        ))}
                        {book.genre.length > 1 && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              darkMode
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            +{book.genre.length - 1}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                

                        <motion.button
                          className={`p-2 rounded-full cursor-pointer ${
                            darkMode
                              ? "bg-purple-700 hover:bg-purple-600"
                              : "bg-purple-100 hover:bg-purple-200"
                          } transition-colors`}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(book);
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ShoppingCart
                            size={16}
                            className={
                              darkMode ? "text-white" : "text-purple-700"
                            }
                          />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <motion.button
                className={`px-6 py-3 rounded-full cursor-pointer ${
                  darkMode
                    ? "bg-purple-700 hover:bg-purple-600"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white font-medium transition-all inline-flex items-center gap-2`}
                onClick={() => scrollToSection("books")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                See All Books
                <ArrowRight size={18} />
              </motion.button>
            </div>
          </div>
        </section>

        {/* Books Section */}
        <section
          id="books"
          ref={booksRef}
          className={`py-10 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
        >
          <div className="container mx-auto px-4">
            <motion.div
              className="mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Our Indie Library
              </h2>
              <p
                className={`max-w-2xl mx-auto ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Discover handpicked stories from talented independent authors
              </p>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              className={`mb-10 p-6 rounded-2xl backdrop-blur-lg min-h-[120px] ${
                darkMode
                  ? "bg-gray-800/70 border-gray-700"
                  : "bg-white/70 border-gray-200"
              } border shadow-xl`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Search Input Div */}
                <div
                  className={`flex items-center gap-2 w-full md:w-auto md:min-w-[300px] p-4 rounded-lg ${
                    darkMode ? "bg-gray-700/70" : "bg-gray-100/70"
                  } backdrop-blur-sm`}
                >
                  <Search
                    size={20}
                    className={darkMode ? "text-gray-400" : "text-gray-500"}
                  />
                  <input
                    type="text"
                    placeholder="Search by title or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent outline-none w-full"
                  />
                </div>

                {/* All Controls Group (for desktop right alignment) */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-3">
                  {/* Mobile Row 2 / Part of Desktop Controls: Filters & Reset */}
                  <div className="flex flex-row gap-3 w-full md:w-auto">
                    <motion.button
                      onClick={toggleGenreFilter}
                      className={`flex-1 md:flex-initial flex items-center justify-center gap-1 px-4 py-2 rounded-lg cursor-pointer ${
                        darkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-200 hover:bg-gray-300"
                      } transition-colors backdrop-blur-sm`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Filter size={16} />
                      <span>Filters</span>
                      {showGenreFilter ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </motion.button>

                    <motion.button
                      onClick={resetFilters}
                      className={`flex-1 md:flex-initial px-4 py-2 rounded-lg cursor-pointer ${
                        darkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-200 hover:bg-gray-300"
                      } transition-colors backdrop-blur-sm`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Reset
                    </motion.button>
                  </div>

                  {/* Mobile Row 3 / Part of Desktop Controls: Grid/List Toggle */}
                  <div className="flex rounded-lg overflow-hidden w-full md:w-auto">
                    <motion.button
                      className={`flex-1 px-4 py-2 cursor-pointer ${
                        bookView === "grid"
                          ? darkMode
                            ? "bg-purple-700 text-white"
                            : "bg-purple-600 text-white"
                          : darkMode
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-200 text-gray-700"
                      } transition-colors`}
                      onClick={() => setBookView("grid")}
                      whileHover={{ scale: bookView !== "grid" ? 1.05 : 1 }}
                      whileTap={{ scale: bookView !== "grid" ? 0.95 : 1 }}
                    >
                      Grid
                    </motion.button>
                    <motion.button
                      className={`flex-1 px-4 py-2 cursor-pointer ${
                        bookView === "list"
                          ? darkMode
                            ? "bg-purple-700 text-white"
                            : "bg-purple-600 text-white"
                          : darkMode
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-200 text-gray-700"
                      } transition-colors`}
                      onClick={() => setBookView("list")}
                      whileHover={{ scale: bookView !== "list" ? 1.05 : 1 }}
                      whileTap={{ scale: bookView !== "list" ? 0.95 : 1 }}
                    >
                      List
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Genre filter dropdown */}
              <AnimatePresence>
                {showGenreFilter && (
                  <motion.div
                    className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <p className="font-medium">Price Range:</p>
                        <p
                          className={
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }
                        >
                          ${priceRange[0]} - ${priceRange[1]}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <div
                            className="absolute h-full bg-purple-500 rounded-full"
                            style={{
                              left: `${(priceRange[0] / 50) * 100}%`,
                              right: `${100 - (priceRange[1] / 50) * 100}%`,
                            }}
                          />
                          <input
                            type="range"
                            min="0"
                            max="50"
                            step="1"
                            value={priceRange[0]}
                            onChange={(e) =>
                              handlePriceChange(Number(e.target.value), 0)
                            }
                            className="absolute w-full h-full opacity-0 cursor-pointer"
                          />
                          <input
                            type="range"
                            min="0"
                            max="50"
                            step="1"
                            value={priceRange[1]}
                            onChange={(e) =>
                              handlePriceChange(Number(e.target.value), 1)
                            }
                            className="absolute w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium mb-3">Genres:</p>
                      <div className="flex flex-wrap gap-2">
                        {allGenres.map((genre) => (
                          <motion.button
                            key={genre}
                            onClick={() => toggleGenre(genre)}
                            className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                              selectedGenres.includes(genre)
                                ? "bg-purple-600 text-white"
                                : darkMode
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {genre}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Book Display */}
            {filteredBooks.length === 0 ? (
              <motion.div
                className={`text-center py-16 px-4 rounded-xl ${
                  darkMode
                    ? "bg-gray-800 text-gray-300"
                    : "bg-white text-gray-600"
                } shadow-lg`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 mb-6">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  No books match your filters
                </h3>
                <p className="mb-6 max-w-md mx-auto">
                  Try adjusting your search criteria or browse our full
                  collection
                </p>
                <motion.button
                  onClick={resetFilters}
                  className="px-6 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reset Filters
                </motion.button>
              </motion.div>
            ) : (
              <>
                {bookView === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredBooks.map((book, index) => (
                      <motion.div
                        key={book.id}
                        className={`rounded-xl overflow-hidden ${
                          darkMode ? "bg-gray-800" : "bg-white"
                        } shadow-xl hover:shadow-2xl transition-all cursor-pointer group`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.5,
                          delay: 0.05 * (index % 4),
                        }}
                        whileHover={{ y: -10 }}
                        onClick={() => setSelectedBook(book)}
                      >
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            

                          <motion.div
                            className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                          >
                            <motion.button
                              className="w-full py-2 cursor-pointer px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors flex items-center justify-center gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(book);
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <ShoppingCart size={16} />
                              Add to Cart
                            </motion.button>
                          </motion.div>
                        </div>

                        <div className="p-5">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-bold mb-1 leading-tight">
                                {book.title}
                              </h3>
                              <p
                                className={`text-sm ${
                                  darkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                by {book.author}
                              </p>
                            </div>
                            <div
                              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                darkMode
                                  ? "bg-purple-900/50 text-purple-200"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              ${book.price.toFixed(2)}
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center mt-3">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={
                                    i < Math.floor(book.rating)
                                      ? "text-yellow-400 fill-yellow-400"
                                      : i < book.rating
                                      ? "text-yellow-400 fill-yellow-400 opacity-50"
                                      : `${
                                          darkMode
                                            ? "text-gray-600"
                                            : "text-gray-300"
                                        }`
                                  }
                                />
                              ))}
                            </div>
                            <span
                              className={`ml-2 text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {book.rating.toFixed(1)}
                            </span>
                          </div>

                          {/* Genres */}
                          <div className="flex flex-wrap gap-1 mt-3">
                            {book.genre.slice(0, 2).map((genre) => (
                              <span
                                key={genre}
                                className={`text-xs px-2 py-1 rounded-full ${
                                  darkMode
                                    ? "bg-gray-700 text-gray-300"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {genre}
                              </span>
                            ))}
                            {book.genre.length > 2 && (
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  darkMode
                                    ? "bg-gray-700 text-gray-300"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                +{book.genre.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBooks.map((book, index) => (
                      <motion.div
                        key={book.id}
                        className={`rounded-xl overflow-hidden ${
                          darkMode ? "bg-gray-800" : "bg-white"
                        } shadow-lg hover:shadow-xl transition-all cursor-pointer`}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.05 * index }}
                        whileHover={{ x: 5 }}
                        onClick={() => setSelectedBook(book)}
                      >
                        {/* MODIFIED: Ensure flex-row on small screens for list, md:flex-row is for larger than mobile */}
                        <div className="flex flex-row">
                          {/* MODIFIED: Image container for list view - smaller on mobile */}
                          <div className="w-1/3 sm:w-1/4 md:w-48 flex-shrink-0 h-auto">
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* MODIFIED: Details container for list view */}
                          <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-md sm:text-lg font-bold mb-1 line-clamp-2 sm:line-clamp-none">
                                  {book.title}
                                </h3>
                                <p
                                  className={`text-xs sm:text-sm ${
                                    darkMode ? "text-gray-400" : "text-gray-600"
                                  } mb-2 sm:mb-3`}
                                >
                                  by {book.author}
                                </p>

                                {/* MODIFIED: Hide extended details on smallest screens for cleaner list */}
                                <div className="hidden sm:block">
                                  <div className="flex items-center mb-2 sm:mb-4">
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          size={16}
                                          className={
                                            i < Math.floor(book.rating)
                                              ? "text-yellow-400 fill-yellow-400"
                                              : i < book.rating
                                              ? "text-yellow-400 fill-yellow-400 opacity-50"
                                              : `${darkMode ? "text-gray-600" : "text-gray-300"}`
                                          }
                                        />
                                      ))}
                                    </div>
                                    <span
                                      className={`ml-2 text-xs sm:text-sm ${
                                        darkMode ? "text-gray-400" : "text-gray-500" 
                                      }`}
                                    >
                                      {book.rating.toFixed(1)} ({book.reviews.length} reviews)
                                    </span>
                                  </div>

                                  <p
                                    className={`text-xs sm:text-sm ${
                                      darkMode ? "text-gray-300" : "text-gray-700"
                                    } mb-2 sm:mb-4 line-clamp-2`}
                                  >
                                    {book.description}
                                  </p>
                                
                                  <div className="flex flex-wrap gap-1 mb-2 sm:mb-4">
                                    {book.genre.slice(0, 2).map((genre) => (
                                      <span
                                        key={genre}
                                        className={`text-xs px-2 py-1 rounded-full ${
                                          darkMode
                                            ? "bg-gray-700 text-gray-300"
                                            : "bg-gray-200 text-gray-700"
                                        }`}
                                      >
                                        {genre}
                                      </span>
                                    ))}
                                    {book.genre.length > 2 && (
                                       <span className={`text-xs px-2 py-1 rounded-full ${
                                        darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                                      }`}>+{book.genre.length - 2}</span>
                                    )}
                                  </div>

                                  <div className="hidden md:flex items-center gap-4 text-xs sm:text-sm">
                                      <div className="flex items-center gap-1">
                                          <Clock size={14} className={darkMode ? "text-gray-400" : "text-gray-500"} />
                                          <span>{book.releaseDate}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                          <BookOpen size={14} className={darkMode ? "text-gray-400" : "text-gray-500"} />
                                          <span>{book.pages} pages</span>
                                      </div>
                                  </div>
                              </div>
                            </div>

                            {/* Price and Add to Cart - Aligned to bottom right of details section */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-3 sm:mt-4 gap-2">
                              <div
                                className={`text-md sm:text-lg font-bold px-3 py-1 rounded-md self-start sm:self-center ${
                                  darkMode
                                    ? "bg-purple-900/30 text-purple-200"
                                    : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                ${book.price.toFixed(2)}
                              </div>
                              <motion.button
                                className={`w-full sm:w-auto px-4 py-2 rounded-lg cursor-pointer flex items-center justify-center gap-2 ${
                                  darkMode
                                    ? "bg-purple-700 hover:bg-purple-600"
                                    : "bg-purple-600 hover:bg-purple-700"
                                } text-white transition-colors`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(book);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <ShoppingCart size={16} />
                                <span className="text-sm sm:text-base">Add to Cart</span>
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          ref={aboutRef}
          className={`py-20 ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="container mx-auto px-4">
            <motion.div
              className="mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 mb-4">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                About IndiePage
              </h2>
              <p
                className={`max-w-2xl mx-auto ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Our mission and journey to empower independent authors
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div
                  className={`rounded-xl overflow-hidden shadow-xl ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <img
                    src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                    alt="Authors working together"
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3">Our Community</h3>
                    <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                      IndiePage was founded by a collective of independent
                      authors who faced the challenges of the traditional
                      publishing world. We understand the passion, dedication,
                      and creativity that goes into crafting a book, and we
                      believe authors deserve a platform that respects their
                      work and connects them directly to readers.
                    </p>
                  </div>
                </div>

                {/* Adding flex-grow to this container for Fair Compensation card */}
                <div className="mt-8 p-6 rounded-xl backdrop-blur-lg border border-purple-400/20 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 flex-grow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-purple-500/20">
                      <DollarSign size={24} className="text-purple-500" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1">
                        Fair Compensation
                      </h4>
                      <p
                        className={darkMode ? "text-gray-300" : "text-gray-700"}
                      >
                        Authors receive 85% of revenue from each sale, compared
                        to the industry standard of 10-15% with traditional
                        publishers.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Ensure flex-grow is on this div for the 'Our Mission' card */}
                <div
                  className={`p-8 rounded-xl ${
                    darkMode ? "bg-gray-900/50" : "bg-gray-50"
                  } backdrop-blur-lg border ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  } flex-grow`}
                >
                  <h3 className="text-xl font-bold mb-4">Our Mission</h3>
                  <div
                    className={`space-y-4 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <p>
                      We believe in creating a direct bridge between authors and
                      readers. By cutting out traditional middlemen, we ensure
                      that authors receive fair compensation for their hard work
                      while readers gain access to fresh, diverse voices at
                      reasonable prices.
                    </p>
                    <p>
                      IndiePage is committed to fostering a diverse literary
                      ecosystem that celebrates unique perspectives,
                      experimental genres, and stories that might not find a
                      home in the mainstream publishing world.
                    </p>
                    <p>
                      Our platform is designed to give independent authors
                      control over their creative and business decisions, from
                      pricing to presentation, allowing them to build
                      sustainable careers doing what they love.
                    </p>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-6">
                    <motion.div
                      className="text-center p-4 rounded-lg bg-purple-500/10 border border-purple-500/20"
                      whileHover={{ y: -5 }}
                    >
                      <div
                        className={`text-3xl font-bold ${
                          darkMode ? "text-purple-400" : "text-purple-600"
                        }`}
                      >
                        500+
                      </div>
                      <div
                        className={`mt-1 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Authors
                      </div>
                    </motion.div>
                    <motion.div
                      className="text-center p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
                      whileHover={{ y: -5 }}
                    >
                      <div
                        className={`text-3xl font-bold ${
                          darkMode ? "text-indigo-400" : "text-indigo-600"
                        }`}
                      >
                        2,500+
                      </div>
                      <div
                        className={`mt-1 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Books
                      </div>
                    </motion.div>
                    <motion.div
                      className="text-center p-4 rounded-lg bg-pink-500/10 border border-pink-500/20"
                      whileHover={{ y: -5 }}
                    >
                      <div
                        className={`text-3xl font-bold ${
                          darkMode ? "text-pink-400" : "text-pink-600"
                        }`}
                      >
                        85%
                      </div>
                      <div
                        className={`mt-1 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Revenue to Authors
                      </div>
                    </motion.div>
                    <motion.div
                      className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20"
                      whileHover={{ y: -5 }}
                    >
                      <div
                        className={`text-3xl font-bold ${
                          darkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      >
                        20+
                      </div>
                      <div
                        className={`mt-1 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Genres
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          ref={contactRef}
          className={`py-20 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
        >
          <div className="container mx-auto px-4">
            <motion.div
              className="mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 mb-4">
                Get In Touch
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Contact Us
              </h2>
              <p
                className={`max-w-2xl mx-auto ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Have questions? We're here to help
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              <motion.div
                className={`rounded-xl overflow-hidden backdrop-blur-lg ${
                  darkMode ? "bg-gray-800/70" : "bg-white/70"
                } border ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                } shadow-xl`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div
                    className={`p-6 ${
                      darkMode
                        ? "bg-gradient-to-br from-purple-900/30 to-indigo-900/30"
                        : "bg-gradient-to-br from-purple-50 to-indigo-50"
                    }`}
                  >
                    <h3 className="text-xl font-bold mb-4">Get In Touch</h3>
                    <div
                      className={`space-y-4 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <p>
                        Whether you're an author looking to join our platform or
                        a reader with questions, we'd love to hear from you.
                      </p>

                      <div className="flex items-start gap-3 mt-6">
                        <div className="p-2 rounded-full bg-purple-500/20">
                          <Mail
                            className={
                              darkMode ? "text-purple-400" : "text-purple-600"
                            }
                          />
                        </div>
                        <div>
                          <p className="font-medium">Email Us</p>
                          <a
                            href="mailto:hello@indiepage.com"
                            className="text-sm hover:underline"
                          >
                            hello@indiepage.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-purple-500/20">
                          <User
                            className={
                              darkMode ? "text-purple-400" : "text-purple-600"
                            }
                          />
                        </div>
                        <div>
                          <p className="font-medium">For Authors</p>
                          <a
                            href="mailto:authors@indiepage.com"
                            className="text-sm hover:underline"
                          >
                            authors@indiepage.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className={`block text-sm font-medium mb-1 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={`w-full px-4 py-2 rounded-lg ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                          } border focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors`}
                          placeholder="Your name"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className={`block text-sm font-medium mb-1 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full px-4 py-2 rounded-lg ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                          } border focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors`}
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className={`block text-sm font-medium mb-1 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className={`w-full px-4 py-2 rounded-lg ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                          } border focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors`}
                          placeholder="How can we help you?"
                        ></textarea>
                      </div>

                      <motion.button
                        onClick={handleContactSubmit}
                        className={`w-full py-3 px-4 rounded-lg cursor-pointer ${
                          darkMode
                            ? "bg-purple-700 hover:bg-purple-600"
                            : "bg-purple-600 hover:bg-purple-700"
                        } text-white font-medium transition-colors`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <motion.span
                              className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />
                            Processing...
                          </span>
                        ) : contactSubmitted ? (
                          "Message Sent!"
                        ) : (
                          "Send Message"
                        )}
                      </motion.button>

                      {contactSubmitted && (
                        <motion.p
                          className={`text-center text-sm ${
                            darkMode ? "text-green-400" : "text-green-600"
                          }`}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          Thank you for your message! We'll get back to you
                          shortly.
                        </motion.p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className={`py-12 border-t ${
          darkMode
            ? "bg-gray-800 border-gray-700 text-gray-300"
            : "bg-white border-gray-200 text-gray-600"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 font-bold text-xl mb-4">
                <BookOpen
                  className={`${
                    darkMode ? "text-purple-400" : "text-purple-600"
                  }`}
                />
                <span
                  className={`${
                    darkMode ? "text-white" : "text-gray-900"
                  } font-serif tracking-wide`}
                >
                  <span className="text-purple-500">Indie</span>Page
                </span>
              </div>
              <p className="mb-4 max-w-md">
                A marketplace connecting independent authors with readers who
                love to discover new voices and stories.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                    darkMode 
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                    darkMode 
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                    darkMode 
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-500 transition-colors"
                    onClick={() => scrollToSection("home")}
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-500 transition-colors"
                    onClick={() => scrollToSection("books")}
                  >
                    Books
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-500 transition-colors"
                    onClick={() => scrollToSection("about")}
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-500 transition-colors"
                    onClick={() => scrollToSection("contact")}
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Customer Service</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-500 transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-500 transition-colors"
                  >
                    Shipping & Returns
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-500 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-500 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p>
              &copy; {new Date().getFullYear()} IndiePage. All rights reserved.
            </p>
            <p className="text-sm mt-1">
              Empowering independent authors and readers worldwide.
            </p>
          </div>
        </div>
      </footer>

      {/* Book Details Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            className="fixed inset-0 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="min-h-screen px-4 py-4 md:px-4 md:py-8 flex items-center justify-center">
              {/* Enhanced Modern Backdrop */}
              <motion.div
                className="fixed inset-0 bg-gradient-to-br from-black/85 via-gray-900/75 to-black/90 backdrop-blur-xl"
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelectedBook(null)}
              />
              
              {/* Additional blur layer for depth */}
              <motion.div
                className="fixed inset-0 bg-black/25 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                onClick={() => setSelectedBook(null)}
              />

              {/* Subtle noise texture overlay for premium feel */}
              <motion.div
                className="fixed inset-0 opacity-[0.02] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.02 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />

              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedBook(null)}
              />

              {/* Modal Content */}
              <motion.div
                className={`relative max-w-7xl w-full mx-2 md:mx-2 rounded-xl shadow-2xl overflow-hidden ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } z-10`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Close button */}
                <motion.button
                  className={`absolute top-4 right-4 z-20 p-2 rounded-full cursor-pointer ${
                    darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  } transition-colors shadow-lg`}
                  onClick={() => setSelectedBook(null)}
                  aria-label="Close"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
                  {/* Left side - Images */}
                  <div className="relative">
                    {/* Main cover image - extends to edges */}
                    <motion.div
                      className="h-full min-h-[400px] lg:min-h-[600px] relative overflow-hidden"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img
                        src={selectedBook.coverImage}
                        alt={selectedBook.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Stronger gradient overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    </motion.div>

                    {/* Additional images overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="grid grid-cols-3 gap-2">
                        {selectedBook.additionalImages.map((image, index) => (
                          <motion.div
                            key={index}
                            className="rounded-lg overflow-hidden shadow-lg backdrop-blur-sm bg-black/20 border border-white/20"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                              duration: 0.5,
                              delay: 0.1 * (index + 1),
                            }}
                          >
                            <img
                              src={image}
                              alt={`${selectedBook.title} - additional view ${
                                index + 1
                              }`}
                              className="w-full h-16 md:h-20 object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right side - Details */}
                  <div className="p-6 md:p-8 py-8 md:py-12 overflow-y-auto">
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedBook.genre.map((genre) => (
                          <span
                            key={genre}
                            className={`text-xs px-3 py-1 rounded-full ${
                              darkMode
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {genre}
                          </span>
                        ))}
                      </div>

                      <h2 className="text-2xl md:text-3xl font-bold mb-3">
                        {selectedBook.title}
                      </h2>
                      <p
                        className={`text-lg mb-6 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        by {selectedBook.author}
                      </p>
                    </motion.div>

                    {/* Rating */}
                    <motion.div
                      className="flex items-center mb-6"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            className={
                              i < Math.floor(selectedBook.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : i < selectedBook.rating
                                ? "text-yellow-400 fill-yellow-400 opacity-50"
                                : `${
                                    darkMode ? "text-gray-600" : "text-gray-300"
                                  }`
                            }
                          />
                        ))}
                      </div>
                      <span
                        className={`ml-2 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {selectedBook.rating.toFixed(1)} (
                        {selectedBook.reviews.length} reviews)
                      </span>
                    </motion.div>

                    {/* Price and Add to Cart */}
                    <motion.div
                      className="flex items-center justify-between mb-8"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="text-2xl font-bold">
                        ${selectedBook.price.toFixed(2)}
                      </div>
                      <div className="flex gap-2">
                    
                        <motion.button
                          onClick={() => {
                            addToCart(selectedBook);
                          }}
                          className={`px-6 py-2 rounded-lg cursor-pointer ${
                            darkMode
                              ? "bg-purple-700 hover:bg-purple-600"
                              : "bg-purple-600 hover:bg-purple-700"
                          } text-white font-medium transition-colors flex items-center gap-2`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ShoppingCart size={18} />
                          Add to Cart
                        </motion.button>
                      </div>
                    </motion.div>

                    {/* Description */}
                    <motion.div
                      className="mb-8"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <h3 className="font-medium text-lg mb-3">Description</h3>
                      <p
                        className={`${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        } leading-relaxed`}
                      >
                        {selectedBook.description}
                      </p>
                    </motion.div>

                    {/* Reviews */}
                    <motion.div
                      className="mb-8"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <h3 className="font-medium text-lg mb-4">
                        Customer Reviews
                      </h3>
                      <div className="space-y-4">
                        {selectedBook.reviews.map((review) => (
                          <motion.div
                            key={review.id}
                            className={`p-4 rounded-lg ${
                              darkMode ? "bg-gray-700" : "bg-gray-100"
                            }`}
                            whileHover={{ x: 5 }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {review.avatar && (
                                  <img
                                    src={review.avatar}
                                    alt={review.userName}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                )}
                                <div className="font-medium">
                                  {review.userName}
                                </div>
                              </div>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className={
                                      i < review.rating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : `${
                                            darkMode
                                              ? "text-gray-600"
                                              : "text-gray-300"
                                          }`
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                            <p
                              className={`text-sm ${
                                darkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {review.comment}
                            </p>
                            <p
                              className={`text-xs mt-2 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {review.date}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Related Books */}
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <h3 className="font-medium text-lg mb-4">
                        You Might Also Like
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {getRelatedBooks(selectedBook).map((book, index) => (
                          <motion.div
                            key={book.id}
                            className={`rounded-lg overflow-hidden cursor-pointer ${
                              darkMode
                                ? "bg-gray-700 hover:bg-gray-600"
                                : "bg-gray-100 hover:bg-gray-200"
                            } transition-colors`}
                            onClick={() => setSelectedBook(book)}
                            whileHover={{ y: -5 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                          >
                            <div className="relative h-32 overflow-hidden">
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                className="w-full h-full object-cover transition-transform hover:scale-110 duration-700"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="p-3">
                              <p className="font-medium text-sm truncate">
                                {book.title}
                              </p>
                              <div className="flex justify-between items-center mt-1">
                                <p
                                  className={`text-xs ${
                                    darkMode ? "text-gray-400" : "text-gray-600"
                                  }`}
                                >
                                  by {book.author}
                                </p>
                                <p
                                  className={`text-xs font-medium ${
                                    darkMode
                                      ? "text-purple-400"
                                      : "text-purple-600"
                                  }`}
                                >
                                  ${book.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shopping Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Enhanced Modern Backdrop */}
            <motion.div
              className="fixed inset-0 bg-gradient-to-br from-black/85 via-gray-900/75 to-black/90 backdrop-blur-xl"
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.4 }}
              onClick={() => {
                if (!isCheckingOut) {
                  setShowCart(false);
                }
              }}
            />
            <motion.div // Additional blur layer for depth
              className="fixed inset-0 bg-black/25 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onClick={() => { 
                if (!isCheckingOut) {
                  setShowCart(false);
                }
              }}
            />
            <motion.div // Subtle noise texture
              className="fixed inset-0 opacity-[0.02] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.02 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />

            {/* Cart Content as a modal dialog */}
            <motion.div
              className={`relative max-w-md w-full rounded-xl shadow-2xl overflow-hidden ${
                darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
              } z-10 flex flex-col max-h-[90vh]`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div
                className={`p-4 border-b ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                } flex justify-between items-center flex-shrink-0`}
              >
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {isCheckingOut ? (
                    <>
                      {orderComplete ? (
                        <>
                          <Sparkles size={20} className="text-green-500" />
                          Order Complete
                        </>
                      ) : (
                        <>
                          <CreditCard size={20} />
                          {checkoutStep === 1 ? "Shipping" : "Payment"}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      Cart (
                      {cart.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}{" "}
                      items)
                    </>
                  )}
                </h2>
                {!isCheckingOut && (
                  <button
                    className={`p-2 rounded-full cursor-pointer ${
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                    } transition-colors`}
                    onClick={() => setShowCart(false)}
                    aria-label="Close cart"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Cart Content (Original and Corrected) */}
              {!isCheckingOut ? (
                <>
                  {/* Cart Items */}
                  <div className="flex-1 overflow-y-auto p-4">
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                          }}
                        >
                          <ShoppingCart
                            size={64}
                            className={`mb-4 ${
                              darkMode ? "text-gray-600" : "text-gray-300"
                            }`}
                          />
                        </motion.div>
                        <p className="text-lg font-medium mb-2">
                          Your cart is empty
                        </p>
                        <p
                          className={`mb-6 ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Add some books to get started!
                        </p>
                        <motion.button
                          onClick={() => {
                            setShowCart(false);
                            scrollToSection("books");
                          }}
                          className={`px-6 py-2 rounded-lg cursor-pointer ${
                            darkMode
                              ? "bg-purple-700 hover:bg-purple-600"
                              : "bg-purple-600 hover:bg-purple-700"
                          } text-white transition-colors`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Browse Books
                        </motion.button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <motion.div
                            key={item.book.id}
                            className={`p-4 rounded-lg ${
                              darkMode ? "bg-gray-700" : "bg-gray-100"
                            } flex gap-4`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            layout
                          >
                            {/* Book cover */}
                            <div className="w-20 h-24 flex-shrink-0 rounded-md overflow-hidden">
                              <img
                                src={item.book.coverImage}
                                alt={item.book.title}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Details */}
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <div>
                                  <h3 className="font-medium">
                                    {item.book.title}
                                  </h3>
                                  <p
                                    className={`text-sm ${
                                      darkMode
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    by {item.book.author}
                                  </p>
                                  <p className="font-bold mt-1">
                                    ${item.book.price.toFixed(2)}
                                  </p>
                                </div>

                                <motion.button
                                  onClick={() => removeFromCart(item.book.id)}
                                  className={`p-1 h-fit rounded-full cursor-pointer ${
                                    darkMode
                                      ? "text-gray-400 hover:bg-gray-600"
                                      : "text-gray-500 hover:bg-gray-200"
                                  } transition-colors`}
                                  aria-label="Remove item"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <X size={16} />
                                </motion.button>
                              </div>

                              {/* Quantity controls */}
                              <div className="flex items-center mt-2">
                                <motion.button
                                  onClick={() =>
                                    updateCartItemQuantity(
                                      item.book.id,
                                      item.quantity - 1
                                    )
                                  }
                                  className={`p-1 rounded cursor-pointer ${
                                    darkMode
                                      ? "bg-gray-600 hover:bg-gray-500"
                                      : "bg-gray-200 hover:bg-gray-300"
                                  } transition-colors`}
                                  aria-label="Decrease quantity"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  -
                                </motion.button>
                                <span className="w-8 text-center">
                                  {item.quantity}
                                </span>
                                <motion.button
                                  onClick={() =>
                                    updateCartItemQuantity(
                                      item.book.id,
                                      item.quantity + 1
                                    )
                                  }
                                  className={`p-1 rounded cursor-pointer ${
                                    darkMode
                                      ? "bg-gray-600 hover:bg-gray-500"
                                      : "bg-gray-200 hover:bg-gray-300"
                                  } transition-colors`}
                                  aria-label="Increase quantity"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  +
                                </motion.button>

                                <span className="ml-auto font-medium">
                                  $
                                  {(item.book.price * item.quantity).toFixed(
                                    2
                                  )}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  {cart.length > 0 && (
                    <div
                      className={`p-4 border-t flex-shrink-0 ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <div
                        className={`p-4 rounded-lg mb-4 ${
                          darkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        <div className="flex justify-between mb-2">
                          <span
                            className={
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            Subtotal:
                          </span>
                          <span className="font-medium">
                            ${cartTotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span
                            className={
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            Shipping:
                          </span>
                          <span className="font-medium">$0.00</span>
                        </div>
                        <div className="flex justify-between mb-4">
                          <span
                            className={
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            Tax:
                          </span>
                          <span className="font-medium">
                            ${(cartTotal * 0.08).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span>
                            ${(cartTotal + cartTotal * 0.08).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <motion.button
                        onClick={handleCheckout}
                        className={`w-full py-3 px-4 rounded-lg cursor-pointer ${
                          darkMode
                            ? "bg-purple-700 hover:bg-purple-600"
                            : "bg-purple-600 hover:bg-purple-700"
                        } text-white font-medium transition-colors flex items-center justify-center gap-2`}
                        whileHover={{ scale: 1.02 }}                        
                        whileTap={{ scale: 0.98 }}
                      >
                        Checkout
                      </motion.button>
                    </div>
                  )}
                </>
              ) : (
                // Checkout Flow Content (remains the same structure as before)
                <>
                  {orderComplete ? (
                    <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                        }}
                        className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6"
                      >
                        <Sparkles size={36} className="text-green-500" />
                      </motion.div>

                      <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                      <p
                        className={`mb-8 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Your order has been placed successfully. You will
                        receive a confirmation email shortly.
                      </p>

                      <div
                        className={`w-full p-4 rounded-lg ${
                          darkMode ? "bg-gray-700" : "bg-gray-100"
                        } mb-6`}
                      >
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Order Number:</span>
                          <span>
                            #IND
                            {Math.floor(Math.random() * 10000)
                              .toString()
                              .padStart(4, "0")}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Date:</span>
                          <span>{new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Total:</span>
                          <span>
                            ${(cartTotal + cartTotal * 0.08).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Payment Method:</span>
                          <span>Credit Card</span>
                        </div>
                      </div>

                      <motion.button
                        onClick={() => {
                          setCart([]);
                          setIsCheckingOut(false);
                          setOrderComplete(false);
                          setShowCart(false);
                        }}
                        className={`px-6 py-3 rounded-lg cursor-pointer ${
                          darkMode
                            ? "bg-purple-700 hover:bg-purple-600"
                            : "bg-purple-600 hover:bg-purple-700"
                        } text-white font-medium transition-colors`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Continue Shopping
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto">
                      {checkoutStep === 1 ? (
                        <div className="p-6">
                          <h3 className="text-lg font-bold mb-4">
                            Shipping Information
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <label
                                className={`block text-sm font-medium mb-1 ${
                                  darkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                Full Name
                              </label>
                              <input
                                type="text"
                                name="fullName"
                                value={shippingAddress.fullName}
                                onChange={handleShippingChange}
                                className={`w-full px-4 py-2 rounded-lg ${
                                  darkMode
                                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                } border focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors`}
                                placeholder="Your full name"
                              />
                            </div>

                            <div>
                              <label
                                className={`block text-sm font-medium mb-1 ${
                                  darkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                Address
                              </label>
                              <input
                                type="text"
                                name="address"
                                value={shippingAddress.address}
                                onChange={handleShippingChange}
                                className={`w-full px-4 py-2 rounded-lg ${
                                  darkMode
                                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                } border focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors`}
                                placeholder="Street address"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label
                                  className={`block text-sm font-medium mb-1 ${
                                    darkMode
                                      ? "text-gray-300"
                                      : "text-gray-700"
                                  }`}
                                >
                                  City
                                </label>
                                <input
                                  type="text"
                                  name="city"
                                  value={shippingAddress.city}
                                  onChange={handleShippingChange}
                                  className={`w-full px-4 py-2 rounded-lg ${
                                    darkMode
                                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                  } border focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors`}
                                  placeholder="City"
                                />
                              </div>

                              <div>
                                <label
                                  className={`block text-sm font-medium mb-1 ${
                                    darkMode
                                      ? "text-gray-300"
                                      : "text-gray-700"
                                  }`}
                                >
                                  State
                                </label>
                                <input
                                  type="text"
                                  name="state"
                                  value={shippingAddress.state}
                                  onChange={handleShippingChange}
                                  className={`w-full px-4 py-2 rounded-lg ${
                                    darkMode
                                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                  } border focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors`}
                                  placeholder="State/Province"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label
                                  className={`block text-sm font-medium mb-1 ${
                                    darkMode
                                      ? "text-gray-300"
                                      : "text-gray-700"
                                  }`}
                                >
                                  ZIP Code
                                </label>
                                <input
                                  type="text"
                                  name="zip"
                                  value={shippingAddress.zip}
                                  onChange={handleShippingChange}
                                  className={`w-full px-4 py-2 rounded-lg ${
                                    darkMode
                                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                  } border focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors`}
                                  placeholder="ZIP/Postal code"
                                />
                              </div>

                              <div>
                                <label
                                  className={`block text-sm font-medium mb-1 ${
                                    darkMode
                                      ? "text-gray-300"
                                      : "text-gray-700"
                                  }`}
                                >
                                  Country
                                </label>
                                <input
                                  type="text"
                                  name="country"
                                  value={shippingAddress.country}
                                  onChange={handleShippingChange}
                                  className={`w-full px-4 py-2 rounded-lg ${
                                    darkMode
                                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                  } border focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors`}
                                  placeholder="Country"
                                />
                              </div>
                            </div>
                          </div>

                          <div
                            className={`mt-8 p-4 rounded-lg ${
                              darkMode ? "bg-gray-700" : "bg-gray-100"
                            }`}
                          >
                            <h4 className="font-bold mb-2">Order Summary</h4>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">
                                {cart.reduce(
                                  (total, item) => total + item.quantity,
                                  0
                                )}{" "}
                                items
                              </span>
                              <span className="text-sm font-medium">
                                ${cartTotal.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Shipping</span>
                              <span className="text-sm font-medium">
                                $0.00
                              </span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Tax</span>
                              <span className="text-sm font-medium">
                                ${(cartTotal * 0.08).toFixed(2)}
                              </span>
                            </div>
                            <div className="border-t mt-2 pt-2 flex justify-between">
                              <span className="font-bold">Total</span>
                              <span className="font-bold">
                                ${(cartTotal + cartTotal * 0.08).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6">
                          <h3 className="text-lg font-bold mb-4">
                            Payment Information
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <label
                                className={`block text-sm font-medium mb-1 ${
                                  darkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                Card Number
                              </label>
                              <input
                                type="text"
                                name="cardNumber"
                                value={paymentDetails.cardNumber}
                                onChange={handlePaymentChange}
                                className={`w-full px-4 py-2 rounded-lg ${
                                  darkMode
                                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                } border focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors`}
                                placeholder="1234 5678 9012 3456"
                              />
                            </div>

                            <div>
                              <label
                                className={`block text-sm font-medium mb-1 ${
                                  darkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                Name on Card
                              </label>
                              <input
                                type="text"
                                name="nameOnCard"
                                value={paymentDetails.nameOnCard}
                                onChange={handlePaymentChange}
                                className={`w-full px-4 py-2 rounded-lg ${
                                  darkMode
                                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                } border focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors`}
                                placeholder="John Doe"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label
                                  className={`block text-sm font-medium mb-1 ${
                                    darkMode
                                      ? "text-gray-300"
                                      : "text-gray-700"
                                  }`}
                                >
                                  Expiry Date
                                </label>
                                <input
                                  type="text"
                                  name="expiry"
                                  value={paymentDetails.expiry}
                                  onChange={handlePaymentChange}
                                  className={`w-full px-4 py-2 rounded-lg ${
                                    darkMode
                                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                  } border focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors`}
                                  placeholder="MM/YY"
                                />
                              </div>

                              <div>
                                <label
                                  className={`block text-sm font-medium mb-1 ${
                                    darkMode
                                      ? "text-gray-300"
                                      : "text-gray-700"
                                  }`}
                                >
                                  CVV
                                </label>
                                <input
                                  type="text"
                                  name="cvv"
                                  value={paymentDetails.cvv}
                                  onChange={handlePaymentChange}
                                  className={`w-full px-4 py-2 rounded-lg ${
                                    darkMode
                                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                  } border focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors`}
                                  placeholder="123"
                                />
                              </div>
                            </div>
                          </div>

                          <div
                            className={`mt-8 p-4 rounded-lg ${
                              darkMode ? "bg-gray-700" : "bg-gray-100"
                            }`}
                          >
                            <h4 className="font-bold mb-2">
                              Shipping Address
                            </h4>
                            <p className="text-sm">
                              {shippingAddress.fullName}
                            </p>
                            <p className="text-sm">
                              {shippingAddress.address}
                            </p>
                            <p className="text-sm">
                              {shippingAddress.city}, {shippingAddress.state}{" "}
                              {shippingAddress.zip}
                            </p>
                            <p className="text-sm">
                              {shippingAddress.country}
                            </p>
                          </div>

                          <div
                            className={`mt-4 p-4 rounded-lg ${
                              darkMode ? "bg-gray-700" : "bg-gray-100"
                            }`}
                          >
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Subtotal</span>
                              <span className="text-sm font-medium">
                                ${cartTotal.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Shipping</span>
                              <span className="text-sm font-medium">
                                $0.00
                              </span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Tax</span>
                              <span className="text-sm font-medium">
                                ${(cartTotal * 0.08).toFixed(2)}
                              </span>
                            </div>
                            <div className="border-t mt-2 pt-2 flex justify-between">
                              <span className="font-bold">Total</span>
                              <span className="font-bold">
                                ${(cartTotal + cartTotal * 0.08).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Checkout Footer */}
                  {!orderComplete && (
                    <div
                      className={`p-4 border-t ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      } flex justify-between gap-4`}
                    >
                      <motion.button
                        onClick={cancelCheckout}
                        className={`flex-1 py-3 rounded-lg cursor-pointer ${
                          darkMode
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gray-200 hover:bg-gray-300"
                        } transition-colors`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                      >
                        {checkoutStep === 1 ? "Cancel" : "Back"}
                      </motion.button>

                      <motion.button
                        onClick={continueCheckout}
                        className={`flex-1 py-3 rounded-lg ${
                          darkMode
                            ? "bg-purple-700 hover:bg-purple-600"
                            : "bg-purple-600 hover:bg-purple-700"
                        } text-white transition-colors flex items-center justify-center gap-2`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <motion.span
                              className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full cursor-pointer"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />
                            Processing...
                          </>
                        ) : (
                          <>
                            {checkoutStep === 1 ? "Continue" : "Place Order"}
                            <ArrowRight size={16} />
                          </>
                        )}
                      </motion.button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookMarketplace;
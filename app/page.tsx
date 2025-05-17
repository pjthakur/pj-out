"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Sun, Moon, Filter, Package, MessageSquare, Heart, CheckCircle } from "lucide-react";

type Review = {
  id: string;
  rating: number;
  comment: string;
  date: Date;
  name: string;
};

const initialReviews: Review[] = [
  {
    id: "1",
    rating: 5,
    comment: "The noise cancellation on these headphones is incredible! I can't hear any background noise when I'm working or traveling. The battery life is also impressive - I only need to charge them about once a week with daily use.",
    date: new Date(Date.now() - 86400000 * 2),
    name: "Alex Johnson"
  },
  {
    id: "2",
    rating: 4,
    comment: "Very comfortable for long listening sessions. The sound quality is excellent for the price point. I'd give 5 stars if the app had more EQ customization options.",
    date: new Date(Date.now() - 86400000 * 7),
    name: "Samantha Chen"
  },
  {
    id: "3",
    rating: 5,
    comment: "These are by far the best headphones I've ever owned! The comfort level is outstanding, and I can wear them all day without any discomfort. Highly recommended!",
    date: new Date(Date.now() - 86400000 * 14),
    name: "Michael Garcia"
  },
  {
    id: "4",
    rating: 3,
    comment: "Good sound quality, but I was expecting better noise cancellation at this price point. The ear cushions are very comfortable though.",
    date: new Date(Date.now() - 86400000 * 30),
    name: "Taylor Kim"
  }
];

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"newest" | "highest">("newest");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showSubmitPopup, setShowSubmitPopup] = useState<boolean>(false);

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const averageRating = calculateAverageRating();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const glowVariants = {
    initial: {
      boxShadow: theme === 'dark'
        ? '0 0 20px rgba(139,92,246,0.2)'
        : '0 0 20px rgba(124,58,237,0.1)'
    },
    animate: {
      boxShadow: theme === 'dark'
        ? '0 0 40px rgba(139,92,246,0.4)'
        : '0 0 40px rgba(124,58,237,0.2)'
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !name.trim()) return;

    const newReview: Review = {
      id: Date.now().toString(),
      rating,
      comment,
      date: new Date(),
      name: name.trim()
    };

    setReviews([newReview, ...reviews]);
    setRating(0);
    setComment("");
    setName("");

    setShowSubmitPopup(true);

    setTimeout(() => {
      setShowSubmitPopup(false);
    }, 3000);
  };

  const getSortedReviews = () => {
    return [...reviews].sort((a, b) => {
      if (sortBy === "newest") {
        return b.date.getTime() - a.date.getTime();
      } else {
        return b.rating - a.rating;
      }
    });
  };

  const themeClass = theme === "dark" ? {
    bg: "bg-slate-950",
    text: "text-slate-100",
    subtext: "text-slate-300",
    cardBg: "bg-slate-900/80 backdrop-blur-md border-slate-800",
    inputBg: "bg-slate-900 border-slate-700",
    buttonBg: "bg-purple-600 hover:bg-purple-700",
    buttonText: "text-white",
    starFilled: "text-amber-400",
    starEmpty: "text-slate-600",
    gradientFrom: "from-purple-900",
    gradientTo: "to-indigo-900",
    shadowColor: "shadow-purple-900/30",
    formBg: "bg-gradient-to-br from-slate-900/90 to-slate-950/90",
    accent: "text-purple-400",
    highlight: "bg-purple-500/20",
    border: "border-slate-800",
    divider: "border-slate-800"
  } : {
    bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
    text: "text-slate-800",
    subtext: "text-slate-600",
    cardBg: "bg-white/70 backdrop-blur-md border-slate-200",
    inputBg: "bg-white border-slate-200",
    buttonBg: "bg-blue-600 hover:bg-blue-700",
    buttonText: "text-white",
    starFilled: "text-amber-500",
    starEmpty: "text-slate-300",
    gradientFrom: "from-blue-500",
    gradientTo: "to-indigo-500",
    shadowColor: "shadow-blue-500/30",
    formBg: "bg-gradient-to-br from-white/95 to-slate-50/95",
    accent: "text-blue-600",
    highlight: "bg-blue-50",
    border: "border-slate-200",
    divider: "border-slate-200"
  };

  return (
    <div className={`${themeClass.bg} ${themeClass.text} transition-colors duration-500 min-h-screen`}>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {theme === "dark" ? (
          <>

            <div className="absolute inset-0 bg-slate-950">
              <div className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: "url('https://source.unsplash.com/random?pattern,dark&w=1920&h=1080')",
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}></div>
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  background: "radial-gradient(circle at 15% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 40%), radial-gradient(circle at 85% 30%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)"
                }}
              ></div>
            </div>
          </>
        ) : (
          <>

            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.16'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                  backgroundSize: "60px 60px"
                }}
              ></div>
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  background: "radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 40%), radial-gradient(circle at 85% 30%, rgba(99, 102, 241, 0.2) 0%, transparent 50%)"
                }}
              ></div>
            </div>
          </>
        )}
      </div>


      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 z-50 p-3 rounded-full ${themeClass.cardBg} ${themeClass.border} shadow-lg transition-all duration-300`}
      >
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <div className="min-h-screen w-full flex flex-col md:flex-row">
        <div className="md:fixed md:top-0 md:left-0 md:bottom-0 md:w-[350px] md:min-w-[350px] md:z-40">
          <div
            className={`${themeClass.cardBg} ${themeClass.border} md:border-r md:h-screen`}
          >
            <div className="p-8 pt-20 h-full overflow-y-auto">
              <div className="max-w-md mx-auto">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className={`absolute -inset-10 ${themeClass.highlight} rounded-full opacity-50 blur-xl`}></div>
                    <div className={`w-32 h-32 rounded-2xl shadow-lg relative overflow-hidden`}>
                      <img
                        src="https://images.unsplash.com/photo-1746645297670-80e76130ceca?q=80&w=1974&auto=format&fit=crop"
                        alt="Product image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <h1 className="text-2xl font-bold mb-2">Ultra Comfort X1</h1>
                  <div className="flex justify-center items-center mb-2">
                    <div className="flex mx-auto">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={value}
                          size={18}
                          fill={value <= Math.round(averageRating) ? "currentColor" : "none"}
                          className={value <= Math.round(averageRating) ? themeClass.starFilled : themeClass.starEmpty}
                        />
                      ))}
                    </div>
                    <span className={`ml-2 ${themeClass.subtext} text-sm`}>({reviews.length})</span>
                  </div>
                  <div className={`text-sm ${themeClass.subtext} mt-1`}>
                    Average Rating: {averageRating.toFixed(1)} / 5.0
                  </div>
                </div>

                <div className={`mt-8 p-5 rounded-xl ${themeClass.highlight} ${themeClass.border}`}>
                  <div className="text-center mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${themeClass.accent} border ${themeClass.border}`}>
                      Premium Wireless Headphones
                    </span>
                  </div>
                  <p className={`text-sm ${themeClass.subtext} text-center mb-6`}>
                    Experience crystal-clear sound with our advanced Ultra Comfort X1 headphones, featuring 40 hours of battery life and active noise cancellation technology.
                  </p>

                  <div className="grid grid-cols-1 gap-3">
                    <div className={`p-3 rounded-lg border ${themeClass.border} ${themeClass.cardBg}`}>
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-md bg-gradient-to-br ${themeClass.gradientFrom} ${themeClass.gradientTo} flex items-center justify-center mr-3`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
                        </div>
                        <div>
                          <div className="font-semibold">Noise Cancellation</div>
                          <div className={`text-xs ${themeClass.subtext}`}>Advanced ANC technology</div>
                        </div>
                      </div>
                    </div>

                    <div className={`p-3 rounded-lg border ${themeClass.border} ${themeClass.cardBg}`}>
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-md bg-gradient-to-br ${themeClass.gradientFrom} ${themeClass.gradientTo} flex items-center justify-center mr-3`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="18" height="12" rx="2"></rect><path d="M20.4 9H23v6h-2.6"></path></svg>
                        </div>
                        <div>
                          <div className="font-semibold">40Hr Battery</div>
                          <div className={`text-xs ${themeClass.subtext}`}>Long-lasting performance</div>
                        </div>
                      </div>
                    </div>

                    <div className={`p-3 rounded-lg border ${themeClass.border} ${themeClass.cardBg}`}>
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-md bg-gradient-to-br ${themeClass.gradientFrom} ${themeClass.gradientTo} flex items-center justify-center mr-3`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17" y1="15" x2="9" y2="15"></line></svg>
                        </div>
                        <div>
                          <div className="font-semibold">Premium Comfort</div>
                          <div className={`text-xs ${themeClass.subtext}`}>Plush ear cushions</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`mt-8 text-center ${themeClass.subtext} text-sm`}>
                  <p className="italic">
                    Thank you for purchasing our premium headphones. Your feedback helps us improve our products.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-10 md:px-8 md:py-16 overflow-auto md:ml-[350px]">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
            >
              <motion.div
                className={`${themeClass.cardBg} ${themeClass.border} rounded-3xl shadow-xl overflow-hidden`}
                initial="initial"
                animate="animate"
                variants={glowVariants}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 2,
                  ease: "easeInOut"
                }}
              >
                <div className="relative">
                  <div className={`absolute -inset-0 opacity-60 bg-gradient-to-r ${themeClass.gradientFrom} ${themeClass.gradientTo}`} style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0% 100%)' }}></div>
                  <div className="relative pt-8 pb-16 px-6 md:px-10">
                    <div className="flex items-center">
                      <MessageSquare className="text-white mr-3" size={24} />
                      <h2 className="text-2xl font-bold text-white drop-shadow-sm">Share Your Experience</h2>
                    </div>
                    <p className={`mt-2 max-w-lg ${theme === 'dark' ? 'text-white/80' : 'text-white/90'} font-medium`}>
                      Your feedback helps us improve our products and assists other customers in making informed decisions.
                    </p>
                  </div>
                </div>

                <div className="p-6 md:p-10 -mt-10">
                  <form onSubmit={handleSubmit} className="space-y-8 relative">
                    <div>
                      <label className={`block mb-4 font-medium text-lg ${themeClass.text}`}>
                        How would you rate this product?
                      </label>
                      <div className="flex items-center justify-center bg-gradient-to-r from-transparent via-gray-200/10 to-transparent py-5 px-3 rounded-xl">
                        <div className="flex gap-3">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <motion.button
                              key={value}
                              type="button"
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRatingClick(value)}
                              onMouseEnter={() => setHoverRating(value)}
                              onMouseLeave={() => setHoverRating(0)}
                              className={`flex flex-col items-center focus:outline-none group`}
                            >
                              <Star
                                size={40}
                                fill={(hoverRating || rating) >= value ? "currentColor" : "none"}
                                strokeWidth={1.5}
                                className={(hoverRating || rating) >= value
                                  ? themeClass.starFilled
                                  : themeClass.starEmpty
                                }
                              />
                              <span className={`text-xs mt-1 transition-opacity ${(hoverRating || rating) >= value
                                ? "opacity-100" + " " + themeClass.accent
                                : "opacity-60" + " " + themeClass.subtext
                                }`}>
                                {value === 1 ? 'Poor' : value === 2 ? 'Fair' : value === 3 ? 'Good' : value === 4 ? 'Great' : 'Excellent'}
                              </span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="name" className={`block mb-3 font-medium text-lg ${themeClass.text}`}>
                        Your Name
                      </label>
                      <div className="relative">
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={`w-full rounded-xl ${themeClass.inputBg} border ${theme === 'dark' ? 'border-slate-600 focus:border-purple-500 shadow-[0_0_8px_rgba(139,92,246,0.15)]' : 'border-slate-300 focus:border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.1)]'} p-4 focus:ring-1 focus:ring-opacity-50 ${theme === 'dark' ? 'focus:ring-purple-500 focus:shadow-[0_0_15px_rgba(139,92,246,0.25)]' : 'focus:ring-blue-500 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)]'} outline-none transition-all duration-300 text-base ${theme === 'dark' ? 'placeholder:text-slate-400' : 'placeholder:text-slate-600'}`}
                          placeholder="Enter your name here..."
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="comment" className={`block mb-3 font-medium text-lg ${themeClass.text}`}>
                        Your Review
                      </label>
                      <div className="relative">
                        <textarea
                          id="comment"
                          rows={6}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className={`w-full rounded-xl ${themeClass.inputBg} border ${theme === 'dark' ? 'border-slate-600 focus:border-purple-500 shadow-[0_0_8px_rgba(139,92,246,0.15)]' : 'border-slate-300 focus:border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.1)]'} p-4 focus:ring-1 focus:ring-opacity-50 ${theme === 'dark' ? 'focus:ring-purple-500 focus:shadow-[0_0_15px_rgba(139,92,246,0.25)]' : 'focus:ring-blue-500 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)]'} outline-none transition-all duration-300 text-base ${theme === 'dark' ? 'placeholder:text-slate-400' : 'placeholder:text-slate-600'}`}
                          placeholder="Share your thoughts about this product..."
                        ></textarea>
                      </div>
                    </div>

                    <div className="pt-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={rating === 0}
                        className={`${themeClass.buttonBg} ${themeClass.buttonText} px-8 py-4 rounded-xl font-medium text-base w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                      >
                        <Heart size={18} className="mr-2" />
                        Submit Your Review
                      </motion.button>
                    </div>
                  </form>

                  <AnimatePresence>
                    {showSubmitPopup && (
                      <motion.div
                        initial={{ opacity: 0, y: 0, scale: 0.7 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} border rounded-xl shadow-xl py-6 px-10 flex items-center min-w-[300px] max-w-[90%]`}
                        style={{
                          boxShadow: theme === 'dark'
                            ? '0 0 30px rgba(139,92,246,0.4)'
                            : '0 0 30px rgba(59,130,246,0.3)'
                        }}
                      >
                        <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-purple-500' : 'bg-blue-500'} text-white`}>
                          <CheckCircle size={16} />
                        </div>
                        <div className="ml-2">
                          <h3 className="font-semibold text-lg">Thank you for your feedback!</h3>
                          <p className={`text-sm ${themeClass.subtext} mt-1`}>Your review has been successfully submitted.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>

            {reviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mt-12"
              >
                <motion.div
                  className={`rounded-2xl ${themeClass.cardBg} ${themeClass.border} shadow-lg overflow-hidden`}
                  initial={{ boxShadow: theme === 'dark' ? '0 0 15px rgba(139,92,246,0.1)' : '0 0 15px rgba(124,58,237,0.05)' }}
                  animate={{ boxShadow: theme === 'dark' ? '0 0 25px rgba(139,92,246,0.2)' : '0 0 25px rgba(124,58,237,0.1)' }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 3,
                    ease: "easeInOut",
                    delay: 1
                  }}>
                  <div className="p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold">Customer Reviews</h2>
                      <div className="relative">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowFilters(!showFilters)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${themeClass.cardBg} ${themeClass.border}`}
                        >
                          <Filter size={16} />
                          <span className="hidden sm:inline text-sm">Sort By</span>
                        </motion.button>

                        <AnimatePresence>
                          {showFilters && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className={`absolute right-0 mt-2 w-48 ${themeClass.cardBg} ${themeClass.border} rounded-lg shadow-lg z-10`}
                            >
                              <button
                                onClick={() => {
                                  setSortBy("newest");
                                  setShowFilters(false);
                                }}
                                className={`block w-full text-left px-4 py-2 hover:${themeClass.highlight} rounded-t-lg ${sortBy === "newest" ? "font-bold " + themeClass.accent : ""}`}
                              >
                                Newest First
                              </button>
                              <button
                                onClick={() => {
                                  setSortBy("highest");
                                  setShowFilters(false);
                                }}
                                className={`block w-full text-left px-4 py-2 hover:${themeClass.highlight} rounded-b-lg ${sortBy === "highest" ? "font-bold " + themeClass.accent : ""}`}
                              >
                                Highest Rated
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <AnimatePresence>
                        {getSortedReviews().map((review) => (
                          <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            layout
                            className={`p-4 rounded-xl ${themeClass.cardBg} ${themeClass.border} hover:shadow-md transition-shadow duration-300`}
                          >
                            <div className="flex flex-wrap justify-between items-center mb-3">
                              <div className="flex mb-2 md:mb-0">
                                {[1, 2, 3, 4, 5].map((value) => (
                                  <Star
                                    key={value}
                                    size={18}
                                    fill={review.rating >= value ? "currentColor" : "none"}
                                    className={review.rating >= value
                                      ? themeClass.starFilled
                                      : themeClass.starEmpty
                                    }
                                  />
                                ))}
                                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${themeClass.highlight} ${themeClass.accent}`}>
                                  {review.rating === 5 ? "Excellent" :
                                    review.rating === 4 ? "Great" :
                                      review.rating === 3 ? "Good" :
                                        review.rating === 2 ? "Fair" : "Poor"}
                                </span>
                              </div>
                              <span className={`text-sm ${themeClass.subtext}`}>
                                {new Date(review.date).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className={`pt-2 border-t ${themeClass.divider}`}>
                              <div className="flex items-center mb-2">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-blue-50'} mr-2`}>
                                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-purple-400' : 'text-blue-600'}`}>
                                    {review.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <span className={`font-medium ${themeClass.text}`}>{review.name}</span>
                              </div>
                              <p className="mt-2">{review.comment}</p>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
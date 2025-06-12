"use client";

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  memo,
  createContext,
  useContext,
  useRef,
} from "react";
import { Montserrat } from "next/font/google";
import {
  TrendingUp,
  MessageCircle,
  Heart,
  Plus,
  Sun,
  Moon,
  BarChart3,
  DollarSign,
  X,
  ArrowUp,
  ArrowDown,
  Filter,
  Rocket,
  TrendingDown,
  CircleDot,
  Newspaper,
  LineChart,
  Star,
  Share2,
  Upload,
  User,
  Settings,
  LogOut,
  Bell,
  Bookmark,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
});

const themes = {
  light: {
    primary: "#2563EB",
    secondary: "#0EA5E9",
    accent: "#8B5CF6",
    background: "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)",
    surface: "#FFFFFF",
    surfaceHover: "linear-gradient(135deg, #F8FAFC 0%, #F0F4F8 100%)",
    text: "#0F172A",
    textSecondary: "#475569",
    textMuted: "#64748B",
    border: "#E2E8F0",
    borderHover: "#CBD5E1",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    gradient: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
    cardShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    modalOverlay: "rgba(15, 23, 42, 0.5)",
    accentGradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
    successGradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    surfaceGradient: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
  },
  dark: {
    primary: "#60A5FA",
    secondary: "#34D399",
    accent: "#C084FC",
    background: "linear-gradient(135deg, #111827 0%, #1F2937 100%)",
    surface: "#1F2937",
    surfaceHover: "linear-gradient(135deg, #374151 0%, #4B5563 100%)",
    text: "#F9FAFB",
    textSecondary: "#E5E7EB",
    textMuted: "#9CA3AF",
    border: "#374151",
    borderHover: "#4B5563",
    success: "#34D399",
    warning: "#FBBF24",
    error: "#F87171",
    gradient: "linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)",
    cardShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)",
    modalOverlay: "rgba(17, 24, 39, 0.8)",
    accentGradient: "linear-gradient(135deg, #C084FC 0%, #A855F7 100%)",
    successGradient: "linear-gradient(135deg, #34D399 0%, #10B981 100%)",
    surfaceGradient: "linear-gradient(135deg, #1F2937 0%, #374151 100%)",
  },
};

interface UserType {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  followers: number;
}

interface Post {
  id: string;
  user: UserType;
  type: "query" | "content" | "poll";
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  poll?: {
    question: string;
    options: { text: string; votes: number; icon: string }[];
    totalVotes: number;
  };
  image?: string;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface Comment {
  id: string;
  user: UserType;
  content: string;
  timestamp: string;
  likes: number;
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
}

interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface MarketItem {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

const mockUsers: UserType[] = [
  {
    id: "1",
    name: "Sarah Chen",
    username: "sarahfinance",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    verified: true,
    followers: 15420,
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    username: "investormarc",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    verified: true,
    followers: 8930,
  },
  {
    id: "3",
    name: "Emily Watson",
    username: "creditexpert",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    verified: false,
    followers: 3240,
  },
];

const mockPosts: Post[] = [
  {
    id: "1",
    user: mockUsers[0],
    type: "query",
    content:
      "Looking for advice on the best credit cards for travel rewards in 2024. Currently considering Chase Sapphire vs. Capital One Venture. Any experiences to share?",
    timestamp: "2h ago",
    likes: 24,
    comments: 8,
    shares: 3,
    tags: ["CreditCards", "TravelRewards", "Advice"],
  },
  {
    id: "2",
    user: mockUsers[1],
    type: "content",
    content:
      "Federal Reserve signals potential rate cuts in Q2 2024. This could be a game-changer for mortgage rates and refinancing opportunities. Here's what to watch for...",
    timestamp: "4h ago",
    likes: 156,
    comments: 23,
    shares: 45,
    tags: ["FederalReserve", "InterestRates", "Mortgages"],
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=300&fit=crop",
  },
  {
    id: "3",
    user: mockUsers[2],
    type: "poll",
    content:
      "Market sentiment check: How do you feel about the current state of the stock market?",
    timestamp: "6h ago",
    likes: 89,
    comments: 34,
    shares: 12,
    tags: ["MarketSentiment", "Stocks", "Poll"],
    poll: {
      question: "Current market outlook?",
      options: [
        { text: "Very Bullish", votes: 145, icon: "rocket" },
        { text: "Moderately Bullish", votes: 234, icon: "trending-up" },
        { text: "Neutral", votes: 89, icon: "circle-dot" },
        { text: "Bearish", votes: 67, icon: "trending-down" },
      ],
      totalVotes: 535,
    },
  },
  {
    id: "4",
    user: mockUsers[1],
    type: "content",
    content:
      "Just analyzed the latest tech earnings reports. AI investments are driving massive growth in cloud services. Here's a breakdown of the key metrics and what they mean for investors...",
    timestamp: "8h ago",
    likes: 203,
    comments: 45,
    shares: 67,
    tags: ["TechStocks", "Earnings", "AI", "Investment"],
    image:
      "https://images.unsplash.com/photo-1651340981821-b519ad14da7c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "5",
    user: mockUsers[0],
    type: "query",
    content:
      "First-time homebuyer here! With mortgage rates trending down, is it better to go for a 15-year fixed or 30-year fixed rate? Need to make a decision in the next month.",
    timestamp: "12h ago",
    likes: 56,
    comments: 28,
    shares: 5,
    tags: ["Mortgage", "RealEstate", "Advice", "FirstTimeHomeBuyer"],
  },
  {
    id: "6",
    user: mockUsers[2],
    type: "poll",
    content: "Which investment strategy are you focusing on in 2024?",
    timestamp: "1d ago",
    likes: 167,
    comments: 42,
    shares: 23,
    tags: ["Investment", "Strategy", "Planning"],
    poll: {
      question: "Your primary investment focus?",
      options: [
        { text: "Growth Stocks", votes: 234, icon: "trending-up" },
        { text: "Dividend Income", votes: 189, icon: "circle-dot" },
        { text: "Index Funds", votes: 156, icon: "trending-up" },
        { text: "Real Estate", votes: 145, icon: "circle-dot" },
      ],
      totalVotes: 724,
    },
  },
  {
    id: "7",
    user: mockUsers[1],
    type: "content",
    content:
      "🚨 Important tax strategy reminder: Only 2 months left to maximize your retirement contributions for 2023. Here are 5 key things to consider for tax optimization...",
    timestamp: "1d ago",
    likes: 312,
    comments: 56,
    shares: 89,
    tags: ["Taxes", "Retirement", "Planning", "IRA"],
  },
  {
    id: "8",
    user: mockUsers[0],
    type: "query",
    content:
      "Looking at diversifying into international markets. Anyone have experience with emerging market ETFs? Particularly interested in Southeast Asian markets.",
    timestamp: "2d ago",
    likes: 78,
    comments: 31,
    shares: 12,
    tags: ["International", "ETFs", "EmergingMarkets", "Diversification"],
  },
];

const trendingTopics = [
  { tag: "FedRates", posts: 1240 },
  { tag: "CreditCards", posts: 890 },
  { tag: "Investing", posts: 2340 },
  { tag: "Mortgages", posts: 567 },
  { tag: "Crypto", posts: 1890 },
];

const initialMarketData = [
  { symbol: "SPY", price: 485.32, change: 2.45, changePercent: 0.51 },
  { symbol: "QQQ", price: 412.89, change: -1.23, changePercent: -0.3 },
  { symbol: "BTC", price: 67420, change: 1240, changePercent: 1.87 },
  { symbol: "10Y", price: 4.23, change: 0.05, changePercent: 1.2 },
];

const mockComments: { [postId: string]: Comment[] } = {
  "1": [
    {
      id: "c1",
      user: mockUsers[1],
      content:
        "Chase Sapphire has been great for me. The travel rewards are unmatched!",
      timestamp: "1h ago",
      likes: 5,
    },
    {
      id: "c2",
      user: mockUsers[2],
      content:
        "Consider Amex Platinum too. Their airport lounge access is a game changer.",
      timestamp: "30m ago",
      likes: 3,
    },
    {
      id: "c3",
      user: mockUsers[0],
      content:
        "Thanks for the suggestions! How's the reward redemption process with Amex?",
      timestamp: "15m ago",
      likes: 1,
    },
  ],
  "2": [
    {
      id: "c3",
      user: mockUsers[0],
      content:
        "This could significantly impact the housing market. Great analysis!",
      timestamp: "2h ago",
      likes: 8,
    },
    {
      id: "c4",
      user: mockUsers[2],
      content:
        "The key will be watching the inflation data in Q1. That'll likely drive the Fed's decisions.",
      timestamp: "1h ago",
      likes: 12,
    },
    {
      id: "c5",
      user: mockUsers[1],
      content:
        "Already seeing some lenders adjusting their rates in anticipation. Interesting times ahead!",
      timestamp: "30m ago",
      likes: 6,
    },
  ],
  "4": [
    {
      id: "c6",
      user: mockUsers[2],
      content:
        "The AI spending growth is insane! Any thoughts on which cloud providers will benefit most?",
      timestamp: "6h ago",
      likes: 15,
    },
    {
      id: "c7",
      user: mockUsers[1],
      content:
        "Azure and AWS are leading the pack, but Google Cloud is making interesting moves in AI infrastructure.",
      timestamp: "5h ago",
      likes: 11,
    },
  ],
  "5": [
    {
      id: "c8",
      user: mockUsers[1],
      content:
        "If you can afford the higher monthly payments, 15-year fixed will save you a ton in interest!",
      timestamp: "10h ago",
      likes: 9,
    },
    {
      id: "c9",
      user: mockUsers[2],
      content:
        "Consider your job stability and other financial goals. 30-year gives more flexibility.",
      timestamp: "9h ago",
      likes: 7,
    },
    {
      id: "c10",
      user: mockUsers[0],
      content:
        "Good points about flexibility. I'll need to run the numbers for both scenarios.",
      timestamp: "8h ago",
      likes: 4,
    },
  ],
  "7": [
    {
      id: "c11",
      user: mockUsers[2],
      content: "Don't forget about catch-up contributions if you're over 50!",
      timestamp: "20h ago",
      likes: 14,
    },
    {
      id: "c12",
      user: mockUsers[0],
      content: "Any specific recommendations for self-employed individuals?",
      timestamp: "18h ago",
      likes: 8,
    },
    {
      id: "c13",
      user: mockUsers[1],
      content:
        "Look into SEP IRA or Solo 401(k) - they have higher contribution limits.",
      timestamp: "17h ago",
      likes: 16,
    },
  ],
  "8": [
    {
      id: "c14",
      user: mockUsers[1],
      content:
        "VWO has been solid for broad emerging markets exposure. Low expense ratio too.",
      timestamp: "1d ago",
      likes: 11,
    },
    {
      id: "c15",
      user: mockUsers[2],
      content:
        "Consider country-specific ETFs for targeted exposure. ASEA for Southeast Asia specifically.",
      timestamp: "1d ago",
      likes: 9,
    },
  ],
};

const latestNews: NewsItem[] = [
  {
    id: "1",
    title: "Fed Signals Potential Rate Cuts in Coming Months",
    source: "Financial Times",
    time: "2h ago",
  },
  {
    id: "2",
    title: "Tech Stocks Rally on AI Developments",
    source: "Reuters",
    time: "3h ago",
  },
  {
    id: "3",
    title: "Global Markets React to Economic Data",
    source: "Bloomberg",
    time: "4h ago",
  },
];

const initialWatchlistItems: WatchlistItem[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 173.45,
    change: 2.34,
    changePercent: 1.37,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 402.12,
    change: -1.23,
    changePercent: -0.31,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 189.98,
    change: 5.67,
    changePercent: 3.07,
  },
];

const topAnalysts = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: mockUsers[0].avatar,
    specialty: "Tech Stocks",
    accuracy: "92%",
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    avatar: mockUsers[1].avatar,
    specialty: "Crypto",
    accuracy: "89%",
  },
  {
    id: "3",
    name: "Emily Watson",
    avatar: mockUsers[2].avatar,
    specialty: "Real Estate",
    accuracy: "87%",
  },
];

const HeartFill = ({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const MAX_TOASTS = 3;

const ThemeContext = createContext(themes.light);

const MemoizedPostCard = memo(
  ({
    post,
    onLike,
    onVote,
    onComment,
    onLikeComment,
    onShare,
    comments,
    likedPosts,
    likedComments,
    votedPolls,
    showComments,
    setShowComments,
  }: {
    post: Post;
    onLike: (postId: string) => void;
    onVote: (postId: string, optionIndex: number) => void;
    onComment: (postId: string, comment: string) => void;
    onLikeComment: (postId: string, commentId: string) => void;
    onShare: (postId: string) => void;
    comments: { [postId: string]: Comment[] };
    likedPosts: { [postId: string]: boolean };
    likedComments: { [commentId: string]: boolean };
    votedPolls: { [pollId: string]: number };
    showComments: { [postId: string]: boolean };
    setShowComments: React.Dispatch<
      React.SetStateAction<{ [postId: string]: boolean }>
    >;
  }) => {
    const [localComment, setLocalComment] = useState("");
    const theme = useContext(ThemeContext);

    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalComment(e.target.value);
    };

    const handleCommentSubmit = () => {
      if (!localComment.trim()) return;
      onComment(post.id, localComment);
      setLocalComment("");
    };

    const getPollIcon = (iconName: string) => {
      switch (iconName) {
        case "rocket":
          return <Rocket className="w-4 h-4" />;
        case "trending-up":
          return <TrendingUp className="w-4 h-4" />;
        case "circle-dot":
          return <CircleDot className="w-4 h-4" />;
        case "trending-down":
          return <TrendingDown className="w-4 h-4" />;
        default:
          return null;
      }
    };

    const getVotePercentageColor = () => {
      return theme === themes.dark
        ? "rgba(59, 130, 246, 0.3)"
        : "rgba(37, 99, 235, 0.2)";
    };

    return (
      <div
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          boxShadow: theme.cardShadow,
        }}
        className="rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 transition-all duration-200 hover:border-opacity-60"
      >
        <div className="flex items-start space-x-2 sm:space-x-4">
          <img
            src={post.user.avatar || "/placeholder.svg"}
            alt={post.user.name}
            className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <h3
                style={{ color: theme.text }}
                className="font-semibold truncate"
              >
                {post.user.name}
              </h3>
              {post.user.verified && (
                <div
                  style={{ backgroundColor: theme.primary }}
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              <span
                style={{ color: theme.textMuted }}
                className="text-sm truncate cursor-pointer hover:opacity-80"
              >
                @{post.user.username}
              </span>
              <span style={{ color: theme.textMuted }} className="text-sm">
                • {post.timestamp}
              </span>
            </div>

            <div className="mb-3">
              <span
                style={{
                  backgroundColor:
                    post.type === "query"
                      ? theme.accent
                      : post.type === "poll"
                      ? theme.secondary
                      : theme.primary,
                  color: "white",
                }}
                className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-block"
              >
                {post.type}
              </span>
            </div>

            <p
              style={{ color: theme.text }}
              className="mb-3 text-sm sm:text-base break-words"
            >
              {post.content}
            </p>

            {post.image && (
              <img
                src={post.image}
                alt="Post content"
                className="w-full h-48 sm:h-64 object-cover rounded-lg mb-3"
              />
            )}

            {post.poll && (
              <div className="mb-3 space-y-2">
                {post.poll.options.map((option, index) => {
                  const percentage =
                    post.poll!.totalVotes > 0
                      ? (option.votes / post.poll!.totalVotes) * 100
                      : 0;
                  const hasVoted = votedPolls[post.id] !== undefined;
                  const isSelectedOption = votedPolls[post.id] === index;

                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: hasVoted ? 1 : 1.01 }}
                      whileTap={{ scale: hasVoted ? 1 : 0.99 }}
                      onClick={() => onVote(post.id, index)}
                      style={{
                        backgroundColor: theme.surfaceHover,
                        border: `2px solid ${
                          isSelectedOption ? theme.primary : theme.border
                        }`,
                        color: theme.text,
                        cursor: hasVoted ? "default" : "pointer",
                        opacity: hasVoted && !isSelectedOption ? 0.7 : 1,
                      }}
                      className="w-full p-3 sm:p-4 rounded-xl text-left relative overflow-hidden transition-all duration-300 hover:border-opacity-70"
                      disabled={hasVoted}
                    >
                      <div
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: getVotePercentageColor(),
                        }}
                        className="absolute inset-0 transition-all duration-300"
                      />
                      <div className="relative flex justify-between items-center">
                        <div className="flex items-center space-x-2 text-sm sm:text-base">
                          {getPollIcon(option.icon)}
                          <span>{option.text}</span>
                          {isSelectedOption && (
                            <span className="text-xs font-medium text-blue-500 ml-2">
                              Your vote
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-sm sm:text-base whitespace-nowrap">
                          {option.votes} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
                <p
                  style={{ color: theme.textMuted }}
                  className="text-xs sm:text-sm"
                >
                  {post.poll.totalVotes} total votes
                  {votedPolls[post.id] !== undefined && " • Thanks for voting!"}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: theme.surfaceHover,
                    color: theme.primary,
                    border: `1px solid ${theme.border}`,
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer hover:opacity-80 transition-all duration-200"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onLike(post.id)}
                style={{
                  color: likedPosts[post.id] ? "#ef4444" : theme.textSecondary,
                }}
                className="flex items-center space-x-1 sm:space-x-2 transition-colors cursor-pointer"
              >
                {likedPosts[post.id] ? (
                  <HeartFill className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
                <span className="text-sm sm:text-base">{post.likes}</span>
              </motion.button>

              <button
                onClick={() =>
                  setShowComments((prev) => ({
                    ...prev,
                    [post.id]: !prev[post.id],
                  }))
                }
                style={{ color: theme.textSecondary }}
                className="flex items-center space-x-1 sm:space-x-2 hover:opacity-70 transition-opacity cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">{post.comments}</span>
              </button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onShare(post.id)}
                style={{ color: theme.textSecondary }}
                className="flex items-center space-x-1 sm:space-x-2 hover:opacity-70 transition-all duration-200 cursor-pointer"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">{post.shares}</span>
              </motion.button>
            </div>

            {showComments[post.id] && (
              <div className="mt-4 space-y-3">
                <div className="flex space-x-2">
                  <img
                    src={mockUsers[0].avatar}
                    alt="Your avatar"
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={localComment}
                      onChange={handleCommentChange}
                      placeholder="Write a comment..."
                      style={{
                        backgroundColor: theme.surfaceHover,
                        border: `1px solid ${theme.border}`,
                        color: theme.text,
                      }}
                      className="w-full px-4 py-2.5 sm:px-5 sm:py-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleCommentSubmit()
                      }
                    />
                  </div>
                  <button
                    onClick={handleCommentSubmit}
                    style={{ backgroundColor: theme.primary }}
                    className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-all duration-200 flex-shrink-0 cursor-pointer"
                  >
                    Post
                  </button>
                </div>

                <div className="space-y-3">
                  {(comments[post.id] || []).map((comment) => (
                    <div key={comment.id} className="flex space-x-2">
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.name}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div
                        style={{
                          backgroundColor: theme.surfaceHover,
                          border: `1px solid ${theme.border}`,
                        }}
                        className="flex-1 rounded-2xl p-3 sm:p-4 min-w-0"
                      >
                        <div className="flex items-center flex-wrap gap-1 mb-1">
                          <span className="font-medium text-sm truncate">
                            {comment.user.name}
                          </span>
                          {comment.user.verified && (
                            <div
                              style={{ backgroundColor: theme.primary }}
                              className="w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0"
                            >
                              <span className="text-white text-[8px]">✓</span>
                            </div>
                          )}
                          <span
                            style={{ color: theme.textMuted }}
                            className="text-xs"
                          >
                            {comment.timestamp}
                          </span>
                        </div>
                        <p
                          style={{ color: theme.text }}
                          className="text-sm mb-1 break-words"
                        >
                          {comment.content}
                        </p>
                        <button
                          onClick={() => onLikeComment(post.id, comment.id)}
                          style={{
                            color: likedComments[comment.id]
                              ? "#ef4444"
                              : theme.textSecondary,
                          }}
                          className="flex items-center space-x-1 text-xs transition-colors cursor-pointer"
                        >
                          {likedComments[comment.id] ? (
                            <HeartFill className="w-3 h-3 sm:w-4 sm:h-4" />
                          ) : (
                            <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                          <span>{comment.likes}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      JSON.stringify(prevProps.post) === JSON.stringify(nextProps.post) &&
      prevProps.likedPosts[prevProps.post.id] ===
        nextProps.likedPosts[nextProps.post.id] &&
      prevProps.votedPolls[prevProps.post.id] ===
        nextProps.votedPolls[prevProps.post.id] &&
      prevProps.showComments[prevProps.post.id] ===
        nextProps.showComments[prevProps.post.id] &&
      JSON.stringify(prevProps.comments[prevProps.post.id]) ===
        JSON.stringify(nextProps.comments[prevProps.post.id])
    );
  }
);

export default function FinanceSocialPlatform() {
  const [isDark, setIsDark] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "query" | "content" | "poll"
  >("all");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>(
    mockComments
  );
  const [showComments, setShowComments] = useState<{
    [postId: string]: boolean;
  }>({});
  const [likedPosts, setLikedPosts] = useState<{ [postId: string]: boolean }>(
    {}
  );
  const [likedComments, setLikedComments] = useState<{
    [commentId: string]: boolean;
  }>({});
  const [votedPolls, setVotedPolls] = useState<{ [pollId: string]: number }>(
    {}
  );
  const [selectedWatchlist, setSelectedWatchlist] = useState<string[]>([]);
  const [newPost, setNewPost] = useState({
    type: "query" as "query" | "content" | "poll",
    content: "",
    tags: "",
    pollOptions: ["", ""],
    imageUrl: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showQuickPost, setShowQuickPost] = useState(false);
  const [quickPostVisible, setQuickPostVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [marketData, setMarketData] = useState<MarketItem[]>(initialMarketData);
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>(initialWatchlistItems);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const quickPostRef = useRef<HTMLDivElement>(null);

  const theme = isDark ? themes.dark : themes.light;

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "success") => {
      const id = Date.now().toString();
      setToasts((prev) => {
        const newToasts = [...prev];
        if (newToasts.length >= MAX_TOASTS) {
          newToasts.splice(0, newToasts.length - MAX_TOASTS + 1);
        }
        return [...newToasts, { id, message, type }];
      });

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 3000);
    },
    []
  );

  const handleLike = useCallback(
    (postId: string) => {
      setLikedPosts((prev) => {
        const wasLiked = prev[postId];
        return { ...prev, [postId]: !wasLiked };
      });

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, likes: post.likes + (likedPosts[postId] ? -1 : 1) }
            : post
        )
      );
      showToast(likedPosts[postId] ? "Post unliked" : "Post liked!", "info");
    },
    [likedPosts, showToast]
  );

  const handleVote = useCallback(
    (postId: string, optionIndex: number) => {
      if (votedPolls[postId] !== undefined) {
        showToast("You have already voted in this poll!", "error");
        return;
      }

      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId && post.poll) {
            const updatedOptions = post.poll.options.map((option, index) =>
              index === optionIndex
                ? { ...option, votes: option.votes + 1 }
                : option
            );
            return {
              ...post,
              poll: {
                ...post.poll,
                options: updatedOptions,
                totalVotes: post.poll.totalVotes + 1,
              },
            };
          }
          return post;
        })
      );

      setVotedPolls((prev) => ({ ...prev, [postId]: optionIndex }));
      showToast("Vote recorded!", "success");
    },
    [votedPolls, showToast]
  );

  const handleComment = useCallback(
    (postId: string, content: string) => {
      const comment: Comment = {
        id: Date.now().toString(),
        user: mockUsers[0],
        content,
        timestamp: "just now",
        likes: 0,
      };

      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), comment],
      }));

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, comments: (p.comments || 0) + 1 } : p
        )
      );

      showToast("Comment added successfully!");
    },
    [showToast]
  );

  const handleLikeComment = useCallback(
    (postId: string, commentId: string) => {
      setLikedComments((prev) => {
        const wasLiked = prev[commentId];
        return { ...prev, [commentId]: !wasLiked };
      });

      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                likes: comment.likes + (likedComments[commentId] ? -1 : 1),
              }
            : comment
        ),
      }));

      showToast(
        likedComments[commentId] ? "Comment unliked" : "Comment liked!",
        "info"
      );
    },
    [likedComments, showToast]
  );

  const handleShare = useCallback(
    (postId: string) => {
      const post = posts.find((p) => p.id === postId);
      if (post) {
        // In a real app, this would open share options or copy link
        if (navigator.share) {
          navigator
            .share({
              title: `${post.user.name} on FinanceHub`,
              text: post.content,
              url: window.location.href,
            })
            .catch(() => {
              // Fallback to clipboard
              navigator.clipboard.writeText(window.location.href);
              showToast("Link copied to clipboard!", "success");
            });
        } else {
          // Fallback for browsers without Web Share API
          navigator.clipboard.writeText(window.location.href);
          showToast("Link copied to clipboard!", "success");
        }

        // Update share count
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, shares: p.shares + 1 } : p
          )
        );
      }
    },
    [posts, showToast]
  );

  const filteredPosts = useMemo(() => {
    if (selectedFilter === "all") return posts;
    return posts.filter((post) => post.type === selectedFilter);
  }, [posts, selectedFilter]);

  useEffect(() => {
    document.body.style.overflow = showCreateModal ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showCreateModal]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Realtime market data updates
  useEffect(() => {
    const updateMarketData = () => {
      setMarketData(prevData => 
        prevData.map(item => {
          // Generate realistic market movements (small percentage changes)
          const changePercent = (Math.random() - 0.5) * 0.8; // -0.4% to +0.4%
          const newPrice = item.price * (1 + changePercent / 100);
          const priceChange = newPrice - item.price;

          return {
            ...item,
            price: item.symbol === "BTC" 
              ? Math.round(newPrice) 
              : item.symbol === "10Y" 
                ? Math.round(newPrice * 100) / 100
                : Math.round(newPrice * 100) / 100,
            change: item.symbol === "BTC" 
              ? Math.round(priceChange) 
              : Math.round(priceChange * 100) / 100,
            changePercent: Math.round(changePercent * 100) / 100,
          };
        })
      );
    };

    const updateWatchlistData = () => {
      setWatchlistItems(prevData => 
        prevData.map(item => {
          // Generate realistic stock movements
          const changePercent = (Math.random() - 0.5) * 1.2; // -0.6% to +0.6%
          const newPrice = item.price * (1 + changePercent / 100);
          const priceChange = newPrice - item.price;

          return {
            ...item,
            price: Math.round(newPrice * 100) / 100,
            change: Math.round(priceChange * 100) / 100,
            changePercent: Math.round(changePercent * 100) / 100,
          };
        })
      );
    };

    const marketInterval = setInterval(updateMarketData, 2000);
    const watchlistInterval = setInterval(updateWatchlistData, 2000);
    
    return () => {
      clearInterval(marketInterval);
      clearInterval(watchlistInterval);
    };
  }, []);

  // Intersection Observer for quick post visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Add a small delay to ensure smooth transition
        setTimeout(() => {
          setQuickPostVisible(entry.isIntersecting);
        }, 50);
      },
      {
        threshold: 0.2, // Trigger when 20% of the element is visible
        rootMargin: '0px 0px -100px 0px' // Show button when section is 100px from bottom of viewport
      }
    );

    if (quickPostRef.current) {
      observer.observe(quickPostRef.current);
    }

    return () => {
      if (quickPostRef.current) {
        observer.unobserve(quickPostRef.current);
      }
    };
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showProfileDropdown) {
        const target = event.target as HTMLElement;
        const profileDropdown = document.querySelector('[data-profile-dropdown]');
        if (profileDropdown && !profileDropdown.contains(target)) {
          setShowProfileDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  const handleProfileAction = (action: string) => {
    setShowProfileDropdown(false);
    switch (action) {
      case 'profile':
        showToast("Profile page coming soon!", "info");
        break;
      case 'settings':
        showToast("Settings page coming soon!", "info");
        break;
      case 'notifications':
        showToast("Notifications page coming soon!", "info");
        break;
      case 'bookmarks':
        showToast("Bookmarks page coming soon!", "info");
        break;
      case 'help':
        showToast("Help center coming soon!", "info");
        break;
      case 'logout':
        showToast("Logged out successfully!", "success");
        break;
      default:
        break;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setNewPost((prev) => ({
            ...prev,
            imageUrl: result,
          }));
          showToast("Image uploaded successfully!", "success");
        };
        reader.readAsDataURL(file);
      } else {
        showToast("Please select a valid image file", "error");
      }
    }
  };

  const handleCreatePost = () => {
    if (!newPost.content.trim()) {
      showToast("Please enter some content", "error");
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      user: mockUsers[0],
      type: newPost.type,
      content: newPost.content,
      timestamp: "now",
      likes: 0,
      comments: 0,
      shares: 0,
      tags: newPost.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      ...(newPost.type === "poll" && {
        poll: {
          question: newPost.content,
          options: newPost.pollOptions
            .filter((opt) => opt.trim())
            .map((opt) => ({ text: opt, votes: 0, icon: "" })),
          totalVotes: 0,
        },
      }),
      ...(newPost.imageUrl && {
        image: newPost.imageUrl,
      }),
    };

    setPosts((prev) => [post, ...prev]);
    setShowCreateModal(false);
    setNewPost({
      type: "query",
      content: "",
      tags: "",
      pollOptions: ["", ""],
      imageUrl: "",
    });
    showToast("Post created successfully!");
  };

  const LeftPanel = () => (
    <div className="lg:col-span-1 space-y-6">
      <div
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          boxShadow: theme.cardShadow,
        }}
        className="rounded-2xl p-6"
      >
        <h3 className="font-semibold mb-4 flex items-center">
          <BarChart3
            className="w-5 h-5 mr-2"
            style={{ color: theme.primary }}
          />
          Market Overview
        </h3>
        <div className="space-y-4">
          {marketData.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-opacity-50 cursor-pointer transition-all duration-200" style={{ background: theme.surfaceHover }}>
              <span className="font-semibold" style={{ color: theme.text }}>{item.symbol}</span>
              <div className="text-right">
                <div className="font-bold" style={{ color: theme.text }}>
                  {item.symbol === "BTC" ? "$" : ""}
                  {item.price.toLocaleString()}
                  {item.symbol === "10Y" ? "%" : ""}
                </div>
                <div
                  className={`text-sm flex items-center font-semibold ${
                    item.change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {item.change >= 0 ? (
                    <ArrowUp className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDown className="w-3 h-3 mr-1" />
                  )}
                  {item.changePercent >= 0 ? "+" : ""}
                  {item.changePercent}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          boxShadow: theme.cardShadow,
        }}
        className="rounded-2xl p-6"
      >
        <h3 className="font-semibold mb-4 flex items-center">
          <Newspaper
            className="w-5 h-5 mr-2"
            style={{ color: theme.secondary }}
          />
          Latest News
        </h3>
        <div className="space-y-4">
          {latestNews.map((news) => (
            <a
              key={news.id}
              href="https://example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block cursor-pointer hover:opacity-80 transition-all duration-200 p-3 rounded-xl hover:bg-opacity-50"
              style={{ background: theme.surfaceHover }}
            >
              <p className="font-semibold text-sm mb-2" style={{ color: theme.text }}>{news.title}</p>
              <div
                className="flex items-center space-x-2 text-xs font-medium"
                style={{ color: theme.textMuted }}
              >
                <span>{news.source}</span>
                <span>•</span>
                <span>{news.time}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          boxShadow: theme.cardShadow,
        }}
        className="rounded-2xl p-6"
      >
        <h3 className="font-semibold mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2" style={{ color: theme.accent }} />
          Watchlist
        </h3>
        <div className="space-y-3">
          {watchlistItems.map((item) => (
            <div
              key={item.symbol}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-opacity-70 cursor-pointer transition-all duration-200 border"
              style={{ 
                background: theme.surfaceHover,
                borderColor: selectedWatchlist.includes(item.symbol) ? theme.primary : theme.border
              }}
              onClick={() => {
                setSelectedWatchlist((prev) =>
                  prev.includes(item.symbol)
                    ? prev.filter((sym) => sym !== item.symbol)
                    : [...prev, item.symbol]
                );
                showToast(
                  `${item.symbol} ${
                    selectedWatchlist.includes(item.symbol)
                      ? "removed from"
                      : "added to"
                  } watchlist`,
                  "success"
                );
              }}
            >
              <div>
                <div className="font-bold" style={{ color: theme.text }}>{item.symbol}</div>
                <div className="text-xs font-medium" style={{ color: theme.textMuted }}>
                  {item.name}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold" style={{ color: theme.text }}>${item.price}</div>
                <div
                  className={`text-xs flex items-center justify-end font-semibold ${
                    item.change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {item.change >= 0 ? (
                    <ArrowUp className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDown className="w-3 h-3 mr-1" />
                  )}
                  {item.changePercent >= 0 ? "+" : ""}
                  {item.changePercent}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          boxShadow: theme.cardShadow,
        }}
        className="rounded-2xl p-6"
      >
        <h3 className="font-semibold mb-4 flex items-center">
          <LineChart
            className="w-5 h-5 mr-2"
            style={{ color: theme.primary }}
          />
          Top Analysts
        </h3>
        <div className="space-y-4">
          {topAnalysts.map((analyst) => (
            <div
              key={analyst.id}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-opacity-50 cursor-pointer transition-all duration-200"
              style={{ background: theme.surfaceHover }}
            >
              <img
                src={analyst.avatar}
                alt={analyst.name}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm mb-1" style={{ color: theme.text }}>
                  {analyst.name}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium" style={{ color: theme.textMuted }}>
                    {analyst.specialty}
                  </span>
                  <span className="text-xs text-green-500 font-semibold flex-shrink-0">
                    {analyst.accuracy} accuracy
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <ThemeContext.Provider value={theme}>
      <div
        className={`min-h-screen transition-all duration-300 ${montserrat.variable}`}
        style={{ 
          background: theme.background, 
          color: theme.text,
          fontFamily: 'var(--font-montserrat), system-ui, sans-serif'
        }}
      >
        <header
          style={{
            backgroundColor: theme.surface,
            borderBottom: `1px solid ${theme.border}`,
            boxShadow: theme.cardShadow,
          }}
          className="sticky top-0 z-40 backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <div
                    style={{ background: theme.gradient }}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity">FinanceHub</h1>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <AnimatePresence>
                  {(!quickPostVisible || isMobile) && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: 20 }}
                      transition={{ duration: 0.2 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowCreateModal(true)}
                      style={{ background: theme.gradient }}
                      className="flex items-center sm:space-x-2 p-2 sm:px-4 sm:py-2 rounded-full text-white font-medium cursor-pointer shadow-lg"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Create Post</span>
                    </motion.button>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => setIsDark(!isDark)}
                  style={{
                    backgroundColor: theme.surfaceHover,
                    border: `1px solid ${theme.border}`,
                  }}
                  className="p-3 rounded-2xl hover:opacity-70 transition-all duration-200 cursor-pointer"
                >
                  {isDark ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>

                <div className="flex items-center space-x-3">
                  <div className="relative" data-profile-dropdown>
                    <button
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={mockUsers[0].avatar || "/placeholder.svg"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-blue-500 transition-all duration-200"
                      />
                    </button>

                    {/* Profile Dropdown */}
                    <AnimatePresence>
                      {showProfileDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          style={{
                            backgroundColor: theme.surface,
                            border: `1px solid ${theme.border}`,
                            boxShadow: theme.cardShadow,
                          }}
                          className="absolute top-full right-0 mt-2 w-64 rounded-2xl p-2 z-50"
                        >
                          {/* Profile Header */}
                            <div className="flex items-center space-x-3">
                              <img
                                src={mockUsers[0].avatar || "/placeholder.svg"}
                                alt="Profile"
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <h3 className="font-semibold" style={{ color: theme.text }}>
                                  {mockUsers[0].name}
                                </h3>
                                <p className="text-sm" style={{ color: theme.textMuted }}>
                                  @{mockUsers[0].username}
                                </p>
                                <p className="text-xs" style={{ color: theme.textMuted }}>
                                  {mockUsers[0].followers.toLocaleString()} followers
                                </p>
                              </div>
                            </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <LeftPanel />
            <div className="lg:col-span-3">
              {/* Quick Post Section */}
              <div
                ref={quickPostRef}
                style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                  boxShadow: theme.cardShadow,
                }}
                className="hidden md:block rounded-2xl p-4 mb-6"
              >
                {!showQuickPost ? (
                  // Collapsed Quick Post
                  <div 
                    onClick={() => setShowQuickPost(true)}
                    className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-all duration-200"
                  >
                    <img
                      src={mockUsers[0].avatar || "/placeholder.svg"}
                      alt="Your avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div
                      style={{
                        backgroundColor: theme.surfaceHover,
                        border: `1px solid ${theme.border}`,
                        color: theme.textMuted,
                      }}
                      className="flex-1 px-4 py-3 rounded-full text-left"
                    >
                      What's on your mind about finance?
                    </div>
                    <button
                      style={{
                        backgroundColor: theme.surfaceHover,
                        border: `1px solid ${theme.border}`,
                        color: theme.primary,
                      }}
                      className="p-3 rounded-full hover:opacity-80 transition-all duration-200"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  // Expanded Quick Post
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold" style={{ color: theme.text }}>Create New Post</h3>
                      <button
                        onClick={() => setShowQuickPost(false)}
                        style={{ color: theme.textSecondary }}
                        className="hover:opacity-70 cursor-pointer"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Post Type Selection */}
                    <div className="flex space-x-2">
                      {(["query", "content", "poll"] as const).map((type) => {
                        const isSelected = newPost.type === type;
                        return (
                          <button
                            key={type}
                            onClick={() =>
                              setNewPost((prev) => ({ ...prev, type }))
                            }
                            style={{
                              backgroundColor: isSelected ? theme.primary : theme.surface,
                              color: isSelected ? "#FFFFFF" : theme.text,
                              border: `2px solid ${isSelected ? theme.primary : theme.border}`,
                              padding: "8px 24px",
                              borderRadius: "12px",
                              fontWeight: "600",
                              fontSize: "16px",
                              textTransform: "capitalize",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.opacity = "0.8";
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = "1";
                            }}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>

                    {/* Content Input */}
                    <textarea
                      value={newPost.content}
                      onChange={(e) =>
                        setNewPost((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      placeholder={
                        newPost.type === "query"
                          ? "Ask your finance question..."
                          : newPost.type === "poll"
                          ? "What would you like to ask?"
                          : "Share your insights..."
                      }
                      style={{
                        backgroundColor: theme.surfaceHover,
                        border: `1px solid ${theme.border}`,
                        color: theme.text,
                      }}
                      className="w-full p-4 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      rows={3}
                    />

                    {/* Poll Options for Quick Post */}
                    {newPost.type === "poll" && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: theme.text }}>
                          Poll Options
                        </label>
                        {newPost.pollOptions.map((option, index) => (
                          <input
                            key={index}
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...newPost.pollOptions];
                              newOptions[index] = e.target.value;
                              setNewPost((prev) => ({
                                ...prev,
                                pollOptions: newOptions,
                              }));
                            }}
                            placeholder={`Option ${index + 1}`}
                            style={{
                              backgroundColor: theme.surfaceHover,
                              border: `1px solid ${theme.border}`,
                              color: theme.text,
                            }}
                            className="w-full p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm"
                          />
                        ))}
                        <button
                          onClick={() =>
                            setNewPost((prev) => ({
                              ...prev,
                              pollOptions: [...prev.pollOptions, ""],
                            }))
                          }
                          style={{ color: theme.primary }}
                          className="text-sm hover:opacity-70 cursor-pointer font-medium"
                        >
                          + Add Option
                        </button>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            backgroundColor: theme.surfaceHover,
                            border: `1px solid ${theme.border}`,
                            color: theme.primary,
                          }}
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:opacity-80 transition-all duration-200 cursor-pointer text-sm font-medium"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Photo</span>
                        </button>
                        
                        {newPost.imageUrl && (
                          <div className="text-xs text-green-500 font-medium">
                            ✓ Image added
                          </div>
                        )}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (!newPost.content.trim()) {
                            showToast("Please enter some content", "error");
                            return;
                          }
                          handleCreatePost();
                          setShowQuickPost(false);
                        }}
                        style={{ background: theme.gradient }}
                        className="px-6 py-2 rounded-lg text-white font-semibold cursor-pointer shadow-lg text-sm"
                      >
                        Post
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Latest Posts</h2>
                  <div className="flex items-center space-x-2">
                    <Filter
                      style={{ color: theme.textSecondary }}
                      className="w-5 h-5"
                    />
                    <select
                      value={selectedFilter}
                      onChange={(e) =>
                        setSelectedFilter(
                          e.target.value as typeof selectedFilter
                        )
                      }
                      style={{
                        backgroundColor: theme.surface,
                        border: `1px solid ${theme.border}`,
                        color: theme.text,
                      }}
                      className="px-4 py-2 rounded-xl cursor-pointer font-medium hover:border-opacity-70 transition-all duration-200"
                    >
                      <option value="all">All Posts</option>
                      <option value="query">Queries</option>
                      <option value="content">Content</option>
                      <option value="poll">Polls</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                {filteredPosts.map((post) => (
                  <MemoizedPostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onVote={handleVote}
                    onComment={handleComment}
                    onLikeComment={handleLikeComment}
                    onShare={handleShare}
                    comments={comments}
                    likedPosts={likedPosts}
                    likedComments={likedComments}
                    votedPolls={votedPolls}
                    showComments={showComments}
                    setShowComments={setShowComments}
                  />
                ))}
                {filteredPosts.length === 0 && (
                  <div
                    style={{
                      backgroundColor: theme.surface,
                      border: `1px solid ${theme.border}`,
                      boxShadow: theme.cardShadow,
                    }}
                    className="rounded-2xl p-8 text-center"
                  >
                    <p className="text-lg font-semibold mb-3" style={{ color: theme.text }}>No posts found</p>
                    <p style={{ color: theme.textMuted }} className="text-sm font-medium">
                      {selectedFilter === "all"
                        ? "There are no posts yet."
                        : `There are no ${selectedFilter} posts available.`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ backgroundColor: theme.modalOverlay }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
                              <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  style={{
                    backgroundColor: theme.surface,
                    border: `1px solid ${theme.border}`,
                    boxShadow: theme.cardShadow,
                  }}
                  className="w-full max-w-2xl rounded-3xl p-8 max-h-[90vh] overflow-y-auto"
                >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Create New Post</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    style={{ color: theme.textSecondary }}
                    className="hover:opacity-70 cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Post Type
                    </label>
                    <div className="flex space-x-2">
                      {(["query", "content", "poll"] as const).map((type) => {
                        const isSelected = newPost.type === type;
                        return (
                          <button
                            key={type}
                            onClick={() =>
                              setNewPost((prev) => ({ ...prev, type }))
                            }
                            style={{
                              backgroundColor: isSelected ? theme.primary : theme.surface,
                              color: isSelected ? "#FFFFFF" : theme.text,
                              border: `2px solid ${isSelected ? theme.primary : theme.border}`,
                              padding: "8px 24px",
                              borderRadius: "12px",
                              fontWeight: "600",
                              fontSize: "16px",
                              textTransform: "capitalize",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.opacity = "0.8";
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = "1";
                            }}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {newPost.type === "poll" ? "Poll Question" : "Content"}
                    </label>
                    <textarea
                      value={newPost.content}
                      onChange={(e) =>
                        setNewPost((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      placeholder={
                        newPost.type === "query"
                          ? "Ask your finance question..."
                          : newPost.type === "poll"
                          ? "What would you like to ask?"
                          : "Share your insights..."
                      }
                      style={{
                        backgroundColor: theme.surfaceHover,
                        border: `1px solid ${theme.border}`,
                        color: theme.text,
                      }}
                      className="w-full p-4 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Add Image (optional)
                    </label>
                    <div className="space-y-3">
                      <div className="flex space-x-3">
                        <input
                          type="url"
                          value={newPost.imageUrl}
                          onChange={(e) =>
                            setNewPost((prev) => ({
                              ...prev,
                              imageUrl: e.target.value,
                            }))
                          }
                          placeholder="Paste image URL"
                          style={{
                            backgroundColor: theme.surfaceHover,
                            border: `1px solid ${theme.border}`,
                            color: theme.text,
                          }}
                          className="flex-1 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                                                <button
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            backgroundColor: theme.surfaceHover,
                            border: `2px dashed ${theme.border}`,
                            color: theme.primary,
                          }}
                          className="px-4 py-4 rounded-xl hover:opacity-80 transition-all duration-200 cursor-pointer flex items-center space-x-2 font-medium"
                        >
                          <Upload className="w-4 h-4" />
                          <span className="hidden sm:inline">Upload</span>
                        </button>
                      </div>
                      
                      {newPost.imageUrl && (
                        <div className="relative mt-3 rounded-xl overflow-hidden">
                          <img
                            src={newPost.imageUrl}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "https://via.placeholder.com/600x300?text=Invalid+Image+URL";
                            }}
                          />
                          <button
                            onClick={() =>
                              setNewPost((prev) => ({
                                ...prev,
                                imageUrl: "",
                              }))
                            }
                            style={{
                              backgroundColor: theme.surface,
                              color: theme.text,
                            }}
                            className="absolute top-2 right-2 p-2 rounded-full hover:opacity-80 transition-opacity cursor-pointer shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {newPost.type === "poll" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Poll Options
                      </label>
                      <div className="space-y-2">
                        {newPost.pollOptions.map((option, index) => (
                                                      <input
                              key={index}
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...newPost.pollOptions];
                                newOptions[index] = e.target.value;
                                setNewPost((prev) => ({
                                  ...prev,
                                  pollOptions: newOptions,
                                }));
                              }}
                              placeholder={`Option ${index + 1}`}
                              style={{
                                backgroundColor: theme.surfaceHover,
                                border: `1px solid ${theme.border}`,
                                color: theme.text,
                              }}
                              className="w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            />
                        ))}
                        <button
                          onClick={() =>
                            setNewPost((prev) => ({
                              ...prev,
                              pollOptions: [...prev.pollOptions, ""],
                            }))
                          }
                          style={{ color: theme.primary }}
                          className="text-sm hover:opacity-70 cursor-pointer"
                        >
                          + Add Option
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      value={newPost.tags}
                      onChange={(e) =>
                        setNewPost((prev) => ({
                          ...prev,
                          tags: e.target.value,
                        }))
                      }
                      placeholder="e.g. CreditCards, Investing, Advice"
                      style={{
                        backgroundColor: theme.surfaceHover,
                        border: `1px solid ${theme.border}`,
                        color: theme.text,
                      }}
                      className="w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCreatePost}
                      style={{ background: theme.gradient }}
                      className="flex-1 py-3 rounded-xl text-white font-semibold cursor-pointer shadow-lg"
                    >
                      Create Post
                    </motion.button>
                    <button
                      onClick={() => setShowCreateModal(false)}
                      style={{
                        backgroundColor: theme.surfaceHover,
                        border: `1px solid ${theme.border}`,
                        color: theme.text,
                      }}
                      className="px-6 py-3 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          style={{
            position: "fixed",
            bottom: "1rem",
            right: "1rem",
            zIndex: 9999,
            pointerEvents: "none",
            width: "auto",
            maxWidth: "20rem",
            display: "flex",
            flexDirection: "column-reverse",
            gap: "0.5rem",
          }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {toasts.slice(-MAX_TOASTS).map((toast) => (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  transition: { duration: 0.2 },
                }}
                transition={{
                  layout: { duration: 0.2 },
                  opacity: { duration: 0.2 },
                }}
                style={{
                  backgroundColor:
                    toast.type === "error"
                      ? theme.error
                      : toast.type === "info"
                      ? theme.primary
                      : theme.success,
                  boxShadow: theme.cardShadow,
                  pointerEvents: "auto",
                  transformOrigin: "bottom",
                  willChange: "transform, opacity",
                }}
                className="px-4 py-3 rounded-lg text-white font-medium"
              >
                {toast.message}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <footer
          style={{
            background: theme.surfaceGradient,
            borderTop: `2px solid ${theme.border}`,
          }}
          className="mt-20 py-8 relative overflow-hidden"
        >
          {/* Gradient overlay for modern effect */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: theme.gradient,
            }}
          />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Brand Section */}
              <div className="lg:col-span-1 space-y-4">
                <div className="flex items-center space-x-3">
                  <div
                    style={{ background: theme.gradient }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold" style={{ color: theme.text }}>FinanceHub</h2>
                </div>
                <p
                  style={{ color: theme.textSecondary }}
                  className="text-base leading-relaxed max-w-sm"
                >
                  Your go-to platform for financial discussions, market insights,
                  and expert advice from professionals worldwide.
                </p>
              </div>

              {/* Quick Links */}
              <div className="lg:col-span-1 space-y-4">
                <h3 className="text-lg font-semibold" style={{ color: theme.text }}>Quick Links</h3>
                <div className="space-y-2">
                  {['Market Overview', 'Latest News', 'Top Analysts', 'Community'].map((link, index) => (
                    <a
                      key={index}
                      href="#"
                      style={{ color: theme.textMuted }}
                      className="block hover:opacity-70 transition-all duration-200 cursor-pointer text-sm font-medium"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="lg:col-span-1 space-y-4">
                <h3 className="text-lg font-semibold" style={{ color: theme.text }}>Platform Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-xl" style={{ background: theme.surfaceHover }}>
                    <div className="text-lg font-bold" style={{ color: theme.primary }}>24k+</div>
                    <div className="text-xs font-medium" style={{ color: theme.textMuted }}>Active Users</div>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{ background: theme.surfaceHover }}>
                    <div className="text-lg font-bold" style={{ color: theme.secondary }}>15k+</div>
                    <div className="text-xs font-medium" style={{ color: theme.textMuted }}>Posts</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="pt-8 border-t" style={{ borderColor: theme.border }}>
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <p style={{ color: theme.textMuted }} className="text-sm font-medium">
                  © {new Date().getFullYear()} FinanceHub. All rights reserved.
                </p>
                <div className="flex items-center space-x-6">
                  {['Privacy', 'Terms', 'Support'].map((item, index) => (
                    <a
                      key={index}
                      href="#"
                      style={{ color: theme.textMuted }}
                      className="text-sm font-medium hover:opacity-70 transition-opacity cursor-pointer"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeContext.Provider>
  );
}
"use client"
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon, Sun, Search, X, Heart, MessageCircle, Send, ChevronLeft, ChevronRight,
  Clock, LogOut, Bookmark, Share2, Menu, Hash, Home, Book, Users, Calendar,
  Settings, User, Plus, ArrowUp, MapPin, Award, Star, BookOpen, Link2, CheckCircle
} from "lucide-react";

type Post = {
  id: number;
  title: string;
  content: string;
  tags: string[];
  category: "Enlightenment" | "Mindfulness" | "Wellness" | "Guidance";
  imageUrl: string;
  likes: number;
  comments: Comment[];
  authorName: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  liked: boolean;
  bookmarked?: boolean;
};

type Comment = {
  id: number;
  author: string;
  content: string;
  date: string;
  avatar?: string;
};

type Teacher = {
  id: number;
  name: string;
  title: string;
  bio: string;
  experience: string[];
  imageUrl: string;
  specialties: string[];
  quote?: string;
  location?: string;
  yearsOfExperience?: number;
  socialLinks?: {
    website?: string;
    instagram?: string;
    youtube?: string;
  };
};

type Practice = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  benefits: string[];
};

type View = "home" | "practices" | "teachers" | "events" | "bookmarks" | "settings" | "profile";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>("home");
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    tags: "",
    imageUrl: "",
    category: "Enlightenment" as Post["category"],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [commentText, setCommentText] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [practiceCategoryFilter, setPracticeCategoryFilter] = useState("All");
  const postsPerPage = 6;
  const [activePracticeId, setActivePracticeId] = useState<number | null>(null);
  const [activeTeacherId, setActiveTeacherId] = useState<number | null>(null);

  // Posts data
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: "What I Discovered Living with Monks in Tibet",
      content:
        "Just returned from spending three months in a secluded monastery nestled high in the Himalayan mountains. The experience was truly transformative. The monks taught me that genuine peace isn't about escaping our problems—it's about facing them with a calm and centered mind. The absence of technology created space for profound inner connection.",
      tags: ["monastery", "tibet", "meditation"],
      category: "Mindfulness",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      likes: 108,
      comments: [
        {
          id: 1,
          author: "Brother Ming",
          content:
            "This beautifully captures the essence of monastic life. Your journey reminds me of my first days at the monastery... keep practicing 🙏",
          date: "2 days ago",
          avatar: "https://images.unsplash.com/photo-1611695434398-4f4b330623e6?q=80&w=2565&auto=format&fit=crop&ixlib=rb-4.0.3",
        },
      ],
      authorName: "Dharmesh Patel",
      authorAvatar:
        "https://images.unsplash.com/photo-1659177139127-f23081f97a95?q=80&w=2662&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      date: "30 Jan 2024",
      readTime: "12 min read",
      liked: false,
      bookmarked: true,
    },
    {
      id: 2,
      title: "Tea Ceremony Wisdom Learned from Master Wei",
      content:
        "I spent several weeks learning the proper way to perform a traditional tea ceremony from our monastery's tea master. The process transcends mere taste—every movement carries profound meaning and intention. Master Wei guided me with gentle patience, repeatedly saying 'slower, more mindful' until the subtle rhythms became second nature. The ceremonial preparation of tea became a moving meditation, teaching me presence in each moment.",
      tags: ["tea-ceremony", "mindfulness", "tradition"],
      category: "Wellness",
      imageUrl:
        "https://images.unsplash.com/photo-1559629395-cdd7da2ba741?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      likes: 95,
      comments: [
        {
          id: 1,
          author: "Brother Ananda",
          content: "The way of tea is indeed the way of Buddha. Beautiful reflection.",
          date: "1 day ago",
          avatar: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3",
        },
        {
          id: 2,
          author: "Master Wei",
          content: "You have captured the essence of the ceremony. Remember that patience cultivates wisdom.",
          date: "12 hours ago",
          avatar: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2676&auto=format&fit=crop&ixlib=rb-4.0.3",
        },
      ],
      authorName: "Tenzin Gyatso",
      authorAvatar:
        "https://images.unsplash.com/photo-1558868540-3b5e8ca26dc2?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      date: "29 Jan 2024",
      readTime: "8 min read",
      liked: true,
      bookmarked: false,
    },
    {
      id: 3,
      title: "Walking Meditation Transformed My Perspective",
      content:
        "Walking can be a profound spiritual practice when approached with intention. For the past two months, I've practiced walking meditation daily, moving deliberately and feeling every connection between foot and earth. What initially seemed mundane has become extraordinary—each step becomes a microcosm of mindfulness. The practice has significantly reduced my anxiety and brought unexpected clarity to complicated decisions.",
      tags: ["walking", "meditation", "mindfulness"],
      category: "Guidance",
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1676815865390-8e3a9336f64b?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      likes: 76,
      comments: [
        {
          id: 1,
          author: "Master Thich",
          content: "Peace is indeed in every step. The present moment contains infinite wonders if we are truly there.",
          date: "3 days ago",
          avatar: "https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
        },
      ],
      authorName: "Kelsang Dorje",
      authorAvatar:
        "https://images.unsplash.com/photo-1650821298507-8addef856dfb?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      date: "28 Jan 2024",
      readTime: "15 min read",
      liked: false,
      bookmarked: false,
    },
    {
      id: 4,
      title: "Sacred Morning Chants: Dawn Prayers in the Mountains",
      content:
        "Experience the transformative power of dawn prayers echoing through the valleys. Our ancient Sanskrit chants carry the wisdom of generations, awakening the soul as the sun rises over the peaks. Each syllable vibrates with intention, connecting past to present in an unbroken lineage of spiritual practice. These morning rituals create the foundation for a day lived with purpose and awareness.",
      tags: ["chanting", "prayer", "dawn"],
      category: "Enlightenment",
      imageUrl:
        "https://images.unsplash.com/photo-1500904156668-758cff89dcff?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      likes: 124,
      comments: [
        {
          id: 1,
          author: "Rinpoche Karma",
          content:
            "The morning practice is indeed the foundation of spiritual life. The vibrations set during dawn ripple throughout our entire day.",
          date: "1 week ago",
          avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
        },
      ],
      authorName: "Lobsang Rinchen",
      authorAvatar:
        "https://images.unsplash.com/photo-1646303242249-27a33cc6d004?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      date: "24 Jan 2024",
      readTime: "10 min read",
      liked: false,
      bookmarked: true,
    },
    {
      id: 5,
      title: "Mindful Gardening: Cultivating Inner Peace",
      content:
        "Our monastery garden is more than a source of sustenance; it's a living meditation. Each plant becomes a teacher, every season a lesson in impermanence and renewal. Tending to growing things with full attention creates a bridge between our inner and outer landscapes. The practice of mindful gardening has taught me patience, acceptance, and the profound joy of nurturing life without attachment to outcomes.",
      tags: ["gardening", "mindfulness", "nature"],
      category: "Guidance",
      imageUrl: "https://images.unsplash.com/photo-1464638681273-0962e9b53566?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.0.3",
      likes: 89,
      comments: [
        {
          id: 1,
          author: "Brother Chen",
          content: "Every plant teaches the dharma in its own way. The garden is a perfect teacher of both effort and surrender.",
          date: "5 days ago",
          avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3",
        },
      ],
      authorName: "Tashi Norbu",
      authorAvatar:
        "https://images.unsplash.com/photo-1627982990743-83af3bdf01ca?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      date: "20 Jan 2024",
      readTime: "8 min read",
      liked: false,
      bookmarked: false,
    },
    {
      id: 6,
      title: "Ancient Wisdom for Modern Challenges",
      content:
        "How do ancient Buddhist teachings apply to contemporary life? The timeless principles of mindfulness, compassion, and non-attachment offer profound solutions to modern stress and disconnection. These practices weren't designed for monastery walls alone—they were created to navigate the complexities of human experience. By integrating these ancient techniques into daily routines, we discover their remarkable relevance to our digital age.",
      tags: ["wisdom", "modern-life", "meditation"],
      category: "Enlightenment",
      imageUrl:
        "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3Bpcml0dWFsfGVufDB8fDB8fHww",
      likes: 112,
      comments: [
        {
          id: 1,
          author: "Master Rinchen",
          content: "The essence of dharma remains unchanged through time. Only the applications evolve to meet each era's unique challenges.",
          date: "2 days ago",
          avatar: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.0.3",
        },
      ],
      authorName: "Jamyang Dorje",
      authorAvatar:
        "https://images.unsplash.com/photo-1691201664219-712c535ed3f2?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      date: "18 Jan 2024",
      readTime: "12 min read",
      liked: false,
      bookmarked: false,
    },
  ]);
  
  // Teachers data with more simplified display
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: 1,
      name: "Pema Chodron",
      title: "Meditation Master & Buddhist Nun",
      bio: "Pema Chodron is an American Tibetan Buddhist with over 45 years of study and practice in the Shambhala tradition. Her teachings focus on using painful emotions as catalysts for wisdom and compassion.",
      experience: [
        "Ordained as a Buddhist nun in 1981",
        "Director of Gampo Abbey in Nova Scotia",
        "Author of numerous books on Buddhist practice",
        "Leading retreats internationally for over 30 years"
      ],
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL3uSdT7HOAQS3Y1UwkUSVTUkjTC9BvGB5lmQfhEWyTQ&s&ec=72940543",
      specialties: ["Meditation", "Compassion Practices", "Dealing with Difficult Emotions", "Buddhist Psychology"],
      quote: "You are the sky. Everything else is just the weather.",
      location: "Gampo Abbey, Nova Scotia, Canada",
      yearsOfExperience: 45,
      socialLinks: {
        website: "https://www.instagram.com",
        youtube: "https://youtube.com",
        instagram: "https://www.instagram.com"
      }
    },
    {
      id: 2,
      name: "Thich Nhat Hanh",
      title: "Zen Master & Peace Activist",
      bio: "Thich Nhat Hanh was a Vietnamese Zen Buddhist monk, global spiritual leader, and peace activist renowned for his teachings on mindfulness, global ethics, and peace. His gentle yet powerful teachings have impacted millions worldwide.",
      experience: [
        "Ordained as a monk at the age of 16",
        "Nominated for the Nobel Peace Prize by Martin Luther King Jr.",
        "Founded the Plum Village Tradition of Buddhism",
        "Published over 100 books on mindfulness and peace"
      ],
      imageUrl: "https://images.unsplash.com/photo-1618590067824-5ba32ca76ce9?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      specialties: ["Mindfulness", "Engaged Buddhism", "Walking Meditation", "Peaceful Conflict Resolution"],
      quote: "Peace in oneself, peace in the world.",
      location: "Plum Village, France",
      yearsOfExperience: 70,
      socialLinks: {
        website: "https://www.instagram.com",
        instagram: "https://www.instagram.com"
      }
    },
    {
      id: 3,
      name: "Jack Kornfield",
      title: "Mindfulness Teacher & Author",
      bio: "Jack Kornfield trained as a Buddhist monk in Thailand, Burma, and India and has taught meditation worldwide since 1974. He is one of the key teachers to introduce mindfulness practices to the West.",
      experience: [
        "Trained as a monk under Buddhist masters in Southeast Asia",
        "Co-founded the Insight Meditation Society",
        "Founded Spirit Rock Meditation Center",
        "PhD in clinical psychology from Saybrook University"
      ],
      imageUrl: "https://images.unsplash.com/photo-1525026198548-4baa812f1183?q=80&w=2608&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      specialties: ["Vipassana Meditation", "Western Integration of Eastern Wisdom"],
      quote: "In the end, just three things matter: How well we have lived, how well we have loved, how well we have learned to let go.",
      location: "Spirit Rock Center, California, USA",
      yearsOfExperience: 50,
      socialLinks: {
        website: "https://www.instagram.com",
        instagram: "https://www.instagram.com"
      }
    },
    {
      id: 4,
      name: "Tara Brach",
      title: "Meditation Teacher & Psychologist",
      bio: "Tara Brach is a leading Western teacher of Buddhist meditation, emotional healing, and spiritual awakening. She has practiced and taught meditation for over 40 years and is the founder of the Insight Meditation Community of Washington.",
      experience: [
        "PhD in Clinical Psychology",
        "Founded the Insight Meditation Community of Washington",
        "Creator of the RAIN mindfulness technique",
        "Author of bestselling books on mindfulness and compassion"
      ],
      imageUrl: "https://images.unsplash.com/photo-1531123414780-f74242c2b052?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      specialties: ["Radical Acceptance", "Self-Compassion", "Emotional Healing", "RAIN Meditation"],
      quote: "The curious paradox is that when I accept myself just as I am, then I can change.",
      location: "Washington, D.C., USA",
      yearsOfExperience: 40,
      socialLinks: {
        website: "https://www.instagram.com",
        youtube: "https://youtube.com",
        instagram: "https://www.instagram.com"
      }
    },
    {
      id: 5,
      name: "Sadhguru Jaggi Vasudev",
      title: "Yogi & Mystic",
      bio: "Sadhguru is an Indian yoga guru, mystic, and author who founded the Isha Foundation. His approach combines the ancient yogic sciences with contemporary needs, addressing all aspects of human wellbeing.",
      experience: [
        "Founded Isha Foundation, a non-profit organization",
        "Created Inner Engineering program taught worldwide",
        "Established Isha Yoga Center at the foothills of the Velliangiri Mountains",
        "Launched global ecological initiatives including Rally for Rivers and Cauvery Calling"
      ],
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlrJwMeAzhpTfr2ue0g3t29as_pTzgi8LEJY9nErzSMA&s&ec=72940543",
      specialties: ["Yoga", "Inner Engineering", "Meditation", "Consciousness"],
      quote: "The only way out is in.",
      location: "Isha Yoga Center, Coimbatore, India",
      yearsOfExperience: 35,
      socialLinks: {
        website: "https://www.instagram.com",
        instagram: "https://www.instagram.com"
      }
    },
    {
      id: 6,
      name: "Sharon Salzberg",
      title: "Loving-Kindness Meditation Teacher",
      bio: "Sharon Salzberg is a meditation pioneer who has played a crucial role in bringing mindfulness and loving-kindness meditation to the West. She co-founded the Insight Meditation Society and has been teaching worldwide for over 45 years.",
      experience: [
        "Co-founded the Insight Meditation Society in Barre, Massachusetts",
        "Trained in vipassana meditation in India, Nepal, and Burma",
        "Author of eleven books including 'Lovingkindness' and 'Real Happiness'",
        "Led retreats and workshops on lovingkindness meditation since 1974"
      ],
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZNZY6tBE2_WXdmQFvPMtxlZWHSgSQbWXps0vpW0UN9g&s&ec=72940543",
      specialties: ["Loving-Kindness Meditation", "Compassion", "Forgiveness Practices", "Mindfulness"],
      quote: "Mindfulness isn't difficult. We just need to remember to do it.",
      location: "New York City, USA",
      yearsOfExperience: 45,
      socialLinks: {
        website: "https://www.instagram.com",
        instagram: "https://www.instagram.com"
      }
    }
  ]);

  // New Practices data
  const [practices, setPractices] = useState<Practice[]>([
    {
      id: 1,
      title: "Mindful Breathing Meditation",
      description: "A foundational practice focusing on breath awareness to anchor attention in the present moment. This meditation helps develop concentration and calm the nervous system.",
      imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "Meditation",
      duration: "10-20 minutes",
      difficulty: "Beginner",
      benefits: ["Reduces stress", "Improves focus", "Calms anxiety", "Enhances awareness"]
    },
    {
      id: 2,
      title: "Loving-Kindness Practice",
      description: "A heart-centered meditation that cultivates compassion and goodwill toward yourself and others. This practice dissolves barriers and promotes a sense of connection and empathy.",
      imageUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "Meditation",
      duration: "15-30 minutes",
      difficulty: "Intermediate",
      benefits: ["Increases compassion", "Reduces negative emotions", "Improves relationships", "Promotes emotional healing"]
    },
    {
      id: 3,
      title: "Walking Meditation",
      description: "A moving meditation practice that brings mindful awareness to the experience of walking. Each step becomes an opportunity to return to the present moment.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB1xWzTjy104jU6LyNJfzsny9Tq6iW6SXcq9FULQQnjA&s&ec=72940543",
      category: "Movement",
      duration: "15-45 minutes",
      difficulty: "Beginner",
      benefits: ["Integrates mindfulness into movement", "Boosts energy", "Reduces fatigue", "Improves circulation"]
    },
    {
      id: 4,
      title: "Body Scan Relaxation",
      description: "A systematic practice of bringing attention to each part of the body, releasing tension and cultivating deeper bodily awareness. Often practiced lying down.",
      imageUrl: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "Relaxation",
      duration: "20-45 minutes",
      difficulty: "Beginner",
      benefits: ["Releases physical tension", "Improves sleep", "Enhances body awareness", "Reduces stress"]
    },
    {
      id: 5,
      title: "Mindful Tea Ceremony",
      description: "A contemplative ritual centered around the preparation and consumption of tea. Each action becomes a meditation on presence and gratitude.",
      imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "Ritual",
      duration: "15-30 minutes",
      difficulty: "Intermediate",
      benefits: ["Cultivates present moment awareness", "Creates space for reflection", "Encourages slowness", "Nurtures appreciation"]
    },
    {
      id: 6,
      title: "Zen Chanting",
      description: "A vibrational practice using sacred sounds and mantras to focus the mind and open the heart. The rhythmic repetition creates a meditative state.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8EALRSvMsLxXyyXZclwGfQkOhZCYt2F2GAHkd6kxPFQ&s&ec=72940543",
      category: "Sound",
      duration: "10-30 minutes",
      difficulty: "Intermediate",
      benefits: ["Harmonizes body energy", "Deepens concentration", "Opens the heart", "Creates spiritual connection"]
    },
    {
      id: 7,
      title: "Mindful Journaling",
      description: "A reflective writing practice that combines present-moment awareness with self-inquiry. A powerful tool for processing emotions and insights.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY1ioAuWqKhAy5ESh4YIRx4pmMFrCtHeNCpOQ80kb7mA&s&ec=72940543",
      category: "Reflection",
      duration: "15-30 minutes",
      difficulty: "Beginner",
      benefits: ["Clarifies thinking", "Processes emotions", "Encourages self-discovery", "Tracks inner growth"]
    },
    {
      id: 8,
      title: "Qigong Flow",
      description: "An ancient Chinese practice that combines gentle movement, breath control, and meditation to cultivate and balance life energy.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhFx7glOsOk7eLKQHT7h64z3ZXpZsQNtRIr1eqIAWTjA&s&ec=72940543",
      category: "Movement",
      duration: "20-45 minutes",
      difficulty: "Intermediate",
      benefits: ["Balances energy", "Improves flexibility", "Enhances vitality", "Strengthens immune system"]
    },
    {
      id: 9,
      title: "Nature Bathing",
      description: "A contemplative practice of immersing yourself in natural environments with full sensory awareness. Trees, water, and earth become teachers of presence.",
      imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "Nature",
      duration: "30-90 minutes",
      difficulty: "Beginner",
      benefits: ["Reduces stress hormones", "Improves mood", "Enhances immunity", "Deepens connection to nature"]
    },
    {
      id: 10,
      title: "Yoga Nidra",
      description: "A guided meditation practice done in a lying position that induces complete physical, mental, and emotional relaxation while maintaining awareness.",
      imageUrl: "https://images.unsplash.com/photo-1592029780368-c1fff15bcfd5?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "Relaxation",
      duration: "20-45 minutes",
      difficulty: "Beginner",
      benefits: ["Promotes deep relaxation", "Improves sleep", "Reduces anxiety", "Accesses subconscious mind"]
    },
    {
      id: 11,
      title: "Zen Archery",
      description: "A meditative martial art that focuses on the process rather than the outcome. Each shot becomes a practice in presence, alignment, and release.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1N7EjyB7h1MTVf2ZdvZhOfEMVAuE7FD1O6X0IC5l0iA&s&ec=72940543",
      category: "Movement",
      duration: "45-90 minutes",
      difficulty: "Advanced",
      benefits: ["Develops concentration", "Teaches non-attachment", "Improves body alignment", "Cultivates patience"]
    },
    {
      id: 12,
      title: "Gratitude Meditation",
      description: "A heart-opening practice focusing on appreciation and thankfulness for the blessings in your life, transforming your perspective toward abundance.",
      imageUrl: "https://images.unsplash.com/photo-1516401266446-6432a8a07d41?q=80&w=2575&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "Meditation",
      duration: "10-20 minutes",
      difficulty: "Beginner",
      benefits: ["Increases happiness", "Improves resilience", "Enhances relationships", "Shifts perspective"]
    }
  ]);

  const selectedPost = useMemo(() => {
    return posts.find((post) => post.id === selectedPostId);
  }, [posts, selectedPostId]);

  const selectedTeacher = useMemo(() => {
    return teachers.find((teacher) => teacher.id === selectedTeacherId);
  }, [teachers, selectedTeacherId]);

  const setSelectedPost = (post: Post) => {
    setSelectedPostId(post.id);
    setShowAllComments(false);
  };

  const bookmarkedPosts = useMemo(() => {
    return posts.filter(post => post.bookmarked);
  }, [posts]);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Scroll to top implementation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", (!darkMode).toString());
    document.documentElement.classList.toggle("dark");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    if (newPost.content.trim().length < 150) {
      alert("Post content must be at least 150 characters long."); 
      return; 
    }

    const tagsArray = newPost.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const post: Post = {
      id: posts.length + 1,
      title: newPost.title,
      content: newPost.content,
      tags: tagsArray,
      category: newPost.category,
      imageUrl:
        newPost.imageUrl ||
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
      likes: 0,
      comments: [],
      authorName: "You",
      authorAvatar: "https://randomuser.me/api/portraits/lego/1.jpg",
      date: new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      readTime: "2 min read",
      liked: false,
      bookmarked: false,
    };

    setPosts([post, ...posts]);
    setNewPost({
      title: "",
      content: "",
      tags: "",
      imageUrl: "",
      category: "Enlightenment",
    });
    setShowPostModal(false);
  };

  const filteredPosts = posts.filter((post) => {
    // If we're on the bookmarks view, only show bookmarked posts
    if (currentView === "bookmarks" && !post.bookmarked) {
      return false;
    }
    
    const categoryMatch =
      activeCategory === "All" || post.category === activeCategory;
    const searchLower = searchTerm.toLowerCase();
    const searchMatch =
      !searchTerm ||
      post.title.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
      post.authorName.toLowerCase().includes(searchLower);

    return categoryMatch && searchMatch;
  });

  const filteredPractices = practices.filter((practice) => {
    const categoryMatch = practiceCategoryFilter === "All" || practice.category === practiceCategoryFilter;
    const searchLower = searchTerm.toLowerCase();
    const searchMatch =
      !searchTerm ||
      practice.title.toLowerCase().includes(searchLower) ||
      practice.description.toLowerCase().includes(searchLower) ||
      practice.category.toLowerCase().includes(searchLower) ||
      practice.benefits.some((benefit) => benefit.toLowerCase().includes(searchLower));
    return categoryMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const toggleLike = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const newLikedState = !post.liked;
          return {
            ...post,
            liked: newLikedState,
            likes: newLikedState ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  const toggleBookmark = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            bookmarked: !post.bookmarked,
          };
        }
        return post;
      })
    );
  };

  const addComment = (postId: number) => {
    if (!commentText[postId] || commentText[postId].trim() === "") return;

    const newComment: Comment = {
      id: Date.now(),
      author: "You",
      content: commentText[postId],
      date: "Just now",
      avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
    };

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
    setCommentText((prev) => ({ ...prev, [postId]: "" }));
  };
  
  const featuredPost = currentView === "bookmarks" && bookmarkedPosts.length > 0 
    ? bookmarkedPosts[0] 
    : posts[0];

  const categories = [
    "All",
    "Enlightenment",
    "Mindfulness",
    "Wellness",
    "Guidance",
  ];

  const practiceCategories = [
    "All",
    "Meditation",
    "Movement",
    "Relaxation",
    "Ritual",
    "Sound",
    "Reflection",
    "Nature"
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } }
  };

  const scaleUp = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } }
  };

  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  const renderViewTitle = () => {
    switch(currentView) {
      case "home": return "Mindful Reflections";
      case "practices": return "Mindful Practices";
      case "teachers": return "Our Teachers";
      case "events": return "Upcoming Events";
      case "bookmarks": return "Your Bookmarks";
      case "settings": return "Settings";
      case "profile": return "Your Profile";
      default: return "Mindful Path";
    }
  };

  const renderViewDescription = () => {
    switch(currentView) {
      case "home": return "Authentic stories from monks and spiritual practitioners. Genuine insights from personal journeys.";
      case "practices": return "Explore meditation, mindfulness, and yoga techniques to enhance your spiritual journey.";
      case "teachers": return "Learn from experienced practitioners who share their wisdom and guidance.";
      case "events": return "Join our community gatherings, retreats, and workshops to deepen your practice.";
      case "bookmarks": return "Posts you've saved for later reading and reflection.";
      case "settings": return "Customize your experience and preferences.";
      case "profile": return "Manage your account and personal information.";
      default: return "";
    }
  };

  const handleStartPractice = (practiceId: number) => {
    setShowToast(true);
    setToastMessage("A practitioner will contact you soon");
    setActivePracticeId(practiceId);
    setTimeout(() => {
      setShowToast(false);
      setActivePracticeId(null);
      setToastMessage("");
    }, 2000);
  };

  const handleScheduleSession = (teacherId: number) => {
    setActiveTeacherId(teacherId);
    setShowToast(true);
    setToastMessage("A practitioner will contact you soon");
    setTimeout(() => {
      setActiveTeacherId(null);
      setShowToast(false);
      setToastMessage("");
    }, 2000);
  };

  // After all modal state declarations (showPostModal, selectedPost, selectedTeacher, showLogoutModal)
  useEffect(() => {
    const modalOpen = showPostModal || selectedPost || selectedTeacher || showLogoutModal;
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showPostModal, selectedPost, selectedTeacher, showLogoutModal]);

  // In the App component, add this function:
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setToastMessage('Copied to clipboard');
      setTimeout(() => {
        setShowToast(false);
        setToastMessage('');
      }, 2000);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans ${
        darkMode 
          ? "dark bg-gray-950 text-gray-100" 
          : "bg-gray-50 text-gray-900"
      }`}
      style={{ fontFamily: "'Inter', 'SF Pro Display', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* Header */}
      <header
        className={`fixed w-full top-0 z-50 border-b ${
          darkMode 
            ? "bg-gray-950/90 border-gray-800 backdrop-blur-lg" 
            : "bg-white/90 border-gray-100 backdrop-blur-lg"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center py-4 relative">
            <div className="flex items-center">
              <a href="#" className="flex items-center" onClick={(e) => {e.preventDefault(); setCurrentView("home");}}>
                <span className="text-xl font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Mindful Path
                </span>
              </a>
            </div>
            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex items-center space-x-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <a 
                href="#" 
                className={`text-sm font-medium flex items-center gap-1.5 ${
                  currentView === "home"
                    ? darkMode ? "text-white" : "text-gray-900" 
                    : darkMode ? "text-gray-400 hover:text-indigo-400" : "text-gray-600 hover:text-indigo-600"
                } transition-colors`}
                onClick={(e) => {e.preventDefault(); setCurrentView("home");}}
              >
                <Home className="h-4 w-4" />
                Home
              </a>
              <a 
                href="#" 
                className={`text-sm font-medium flex items-center gap-1.5 ${
                  currentView === "practices"
                    ? darkMode ? "text-white" : "text-gray-900" 
                    : darkMode ? "text-gray-400 hover:text-indigo-400" : "text-gray-600 hover:text-indigo-600"
                } transition-colors`}
                onClick={(e) => {e.preventDefault(); setCurrentView("practices");}}
              >
                <Book className="h-4 w-4" />
                Practices
              </a>
              <a 
                href="#" 
                className={`text-sm font-medium flex items-center gap-1.5 ${
                  currentView === "teachers"
                    ? darkMode ? "text-white" : "text-gray-900" 
                    : darkMode ? "text-gray-400 hover:text-indigo-400" : "text-gray-600 hover:text-indigo-600"
                } transition-colors`}
                onClick={(e) => {e.preventDefault(); setCurrentView("teachers");}}
              >
                <Users className="h-4 w-4" />
                Teachers
              </a>
            </div>
            <div className="flex items-center space-x-4">
              {/* Dark mode toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className={`cursor-pointer p-2 rounded-full transition-colors ${
                  darkMode
                    ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </motion.button>
              
              {/* Bookmarks button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                
                onClick={(e) => { 
                  e.preventDefault();
                  if (currentView === "bookmarks") {
                    setCurrentView("home"); 
                  } else {
                    setCurrentView("bookmarks"); 
                  }
                }}
                className={`hidden sm:flex cursor-pointer p-2 rounded-full transition-colors ${
                  currentView === "bookmarks"
                    ? darkMode
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-600 text-white"
                    : darkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                aria-label="Bookmarks"
              >
                <Bookmark className={`h-5 w-5 ${currentView === "bookmarks" ? "fill-white" : ""}`} />
              </motion.button>

              {/* New Post button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPostModal(true)}
                className={`hidden sm:flex items-center gap-1.5 cursor-pointer px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  darkMode
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden md:inline">New Post</span>
              </motion.button>

              {/* Mobile menu toggle */}
              <motion.button 
                whileTap={{ scale: 0.95 }}
                className="md:hidden p-2 rounded-full"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className={`h-5 w-5 ${darkMode ? "text-white" : "text-gray-800"}`} />
              </motion.button>

              {/* Profile button */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="cursor-pointer relative p-1"
                >
                  <img
                    src="https://plus.unsplash.com/premium_photo-1661964132047-f330b945e86e?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500"
                  />
                </motion.button>
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute right-0 mt-2 w-48 rounded-xl py-1 shadow-xl ${
                        darkMode ? "bg-gray-800 ring-1 ring-gray-700" : "bg-white ring-1 ring-gray-200"
                      }`}
                    >
                      <a 
                        href="#" 
                        className={`flex items-center w-full px-4 py-2 text-sm ${
                          darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          setShowProfileMenu(false);
                          setShowLogoutModal(true);
                        }}
                      >
                        <User className="h-4 w-4 mr-2" />
                        My Profile
                      </a>
                      <a 
                        href="#" 
                        className={`flex items-center w-full px-4 py-2 text-sm ${
                          darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          setShowProfileMenu(false);
                          setShowLogoutModal(true);
                        }}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </a>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setShowLogoutModal(true);
                        }}
                        className={`flex items-center w-full px-4 py-2 text-sm ${
                          darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`fixed z-40 w-full ${darkMode ? "bg-gray-900" : "bg-white"} border-b ${darkMode ? "border-gray-800" : "border-gray-200"} mt-16`}
          >
            <div className="px-4 py-6 space-y-4">
              <a 
                href="#" 
                className={`flex items-center gap-2 py-2 font-medium ${
                  currentView === "home" 
                    ? darkMode ? "text-white" : "text-gray-900" 
                    : darkMode ? "text-gray-400" : "text-gray-600"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentView("home");
                  setMobileMenuOpen(false);
                }}
              >
                <Home className="h-5 w-5" />
                Home
              </a>
              <a 
                href="#" 
                className={`flex items-center gap-2 py-2 font-medium ${
                  currentView === "practices" 
                    ? darkMode ? "text-white" : "text-gray-900" 
                    : darkMode ? "text-gray-400" : "text-gray-600"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentView("practices");
                  setMobileMenuOpen(false);
                }}
              >
                <Book className="h-5 w-5" />
                Practices
              </a>
              <a 
                href="#" 
                className={`flex items-center gap-2 py-2 font-medium ${
                  currentView === "teachers" 
                    ? darkMode ? "text-white" : "text-gray-900" 
                    : darkMode ? "text-gray-400" : "text-gray-600"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentView("teachers");
                  setMobileMenuOpen(false);
                }}
              >
                <Users className="h-5 w-5" />
                Teachers
              </a>
             
              <a 
                href="#" 
                className={`flex items-center gap-2 py-2 font-medium ${
                  currentView === "bookmarks" 
                    ? darkMode ? "text-white" : "text-gray-900" 
                    : darkMode ? "text-gray-400" : "text-gray-600"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentView("bookmarks");
                  setMobileMenuOpen(false);
                }}
              >
                <Bookmark className="h-5 w-5" />
                Bookmarks
              </a>
              <button
                className={`flex items-center gap-2 w-full py-2 font-medium ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
                onClick={() => {
                  setShowPostModal(true);
                  setMobileMenuOpen(false);
                }}
              >
                <Plus className="h-5 w-5" />
                New Post
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`pt-16 ${darkMode ? "bg-gray-950" : "bg-gray-50"}`}>
        {/* Hero Section with Featured Post for Home and Bookmarks Views */}
        {(currentView === "home" || currentView === "bookmarks") && filteredPosts.length > 0 && (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-7xl mx-auto relative"
          >
            <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden rounded-none md:rounded-2xl mt-6 md:mt-8 mx-auto max-w-7xl md:px-4">
              <img
                src={featuredPost.imageUrl}
                alt={featuredPost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20"></div>
              
              <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-3/4 lg:w-2/3">
                <motion.div variants={slideUp}>
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-indigo-600 text-white rounded-full mb-3">
                    {featuredPost.category}
                  </span>
                  <h1
                    className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight cursor-pointer"
                    onClick={() => setSelectedPost(featuredPost)}
                  >
                    {featuredPost.title}
                  </h1>
                  <p
                    className="text-base md:text-lg text-gray-200 mb-5 line-clamp-2 cursor-pointer"
                    onClick={() => setSelectedPost(featuredPost)}
                  >
                    {featuredPost.content}
                  </p>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <img
                        src={featuredPost.authorAvatar}
                        alt={featuredPost.authorName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30"
                      />
                      <div className="ml-3">
                        <div className="text-white font-medium">
                          {featuredPost.authorName}
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-gray-300">
                          <span>{featuredPost.date}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {featuredPost.readTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <motion.button 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedPost(featuredPost)}
                      className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white font-medium hover:bg-white/20 transition-colors"
                    >
                      Read Article
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Practices View */}
        {currentView === "practices" && (
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={slideUp}
              className="mb-10"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {renderViewTitle()}
                  </h2>
                  <p className={`text-base ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {renderViewDescription()}
                  </p>
                </div>
                
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search practices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl ${
                      darkMode
                        ? "bg-gray-900 border border-gray-800 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        : "bg-white border border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    } focus:outline-none text-sm transition-all duration-300`}
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Practice Categories */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={slideUp}
              className="flex overflow-x-auto pb-3 mb-8 category-tabs space-x-2 no-scrollbar"
            >
              {practiceCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setPracticeCategoryFilter(category)}
                  className={`cursor-pointer px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    practiceCategoryFilter === category
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                      : darkMode
                        ? "bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
            
            {/* Practice Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPractices.map((practice, index) => (
                <motion.div
                  key={practice.id}
                  initial="hidden"
                  animate="visible"
                  variants={scaleUp}
                  transition={{ delay: index * 0.1 }}
                  className={`overflow-hidden rounded-xl flex flex-col h-full ${
                    darkMode 
                      ? "bg-gray-900/80 border border-gray-800/50 hover:bg-gray-900" 
                      : "bg-white border border-gray-200/50 hover:bg-gray-50"
                  } shadow-lg transition-all duration-300`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={practice.imageUrl} 
                      alt={practice.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-indigo-600 text-white mb-2">
                        {practice.category}
                      </span>
                      <h3 className="text-xl font-bold text-white">{practice.title}</h3>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`flex items-center space-x-1 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          <Clock className="h-3.5 w-3.5" />
                          <span>{practice.duration}</span>
                        </div>
                        <div className={`flex items-center space-x-1 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 14C21.2091 14 23 12.2091 23 10C23 7.79086 21.2091 6 19 6M19 6C16.7909 6 15 7.79086 15 10C15 12.2091 16.7909 14 19 14M19 6V5M19 14V15M5 10C5 12.2091 6.79086 14 9 14C11.2091 14 13 12.2091 13 10C13 7.79086 11.2091 6 9 6C6.79086 6 5 7.79086 5 10ZM15 19C15 16.7909 12.3137 15 9 15C5.68629 15 3 16.7909 3 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{practice.difficulty}</span>
                        </div>
                      </div>
                      <p className={`text-sm mb-4 line-clamp-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{practice.description}</p>
                      <div className="mt-4">
                        <h4 className={`text-xs font-medium mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Benefits</h4>
                        <div className="flex flex-wrap gap-2">
                          {practice.benefits.slice(0, 3).map((benefit, i) => (
                            <span 
                              key={i}
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                darkMode 
                                  ? "bg-indigo-900/30 text-indigo-300 border border-indigo-800/50" 
                                  : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                              }`}
                            >
                              {benefit}
                            </span>
                          ))}
                          {practice.benefits.length > 3 && (
                            <span className={`text-xs font-medium ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                              +{practice.benefits.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleStartPractice(practice.id)}
                        className={`w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${
                          darkMode 
                            ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        } transition-colors shadow-md`}
                      >
                        {activePracticeId === practice.id ? (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            className="flex items-center gap-2"
                          >
                            <CheckCircle className="h-5 w-5 text-white" />
                            <span>Practice Started</span>
                          </motion.span>
                        ) : (
                          "Start Practice"
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Teachers View - Redesigned for a more modern, unified look */}
        {currentView === "teachers" && (
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={slideUp}
              className="mb-10"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {renderViewTitle()}
                  </h2>
                  <p className={`text-base ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {renderViewDescription()}
                  </p>
                </div>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((teacher, index) => (
                <motion.div
                  key={teacher.id}
                  initial="hidden"
                  animate="visible"
                  variants={scaleUp}
                  transition={{ delay: index * 0.1 }}
                  className={`overflow-hidden rounded-xl h-96 ${
                    darkMode 
                      ? "bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-800/50" 
                      : "bg-gradient-to-b from-white to-gray-50 border border-gray-200/50"
                  } shadow-lg transition-all duration-300 relative`}
                >
                  <div className="absolute inset-0 z-10 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-indigo-500/20 shadow-lg">
                            <img 
                              src={teacher.imageUrl} 
                              alt={teacher.name}
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="ml-4">
                            <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                              {teacher.name}
                            </h3>
                            <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                              {teacher.title}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {teacher.quote && (
                        <div className={`mb-4 text-sm italic ${darkMode ? "text-indigo-300" : "text-indigo-600"}`}>
                          "{teacher.quote}"
                        </div>
                      )}
                      
                      <p className={`text-sm mb-4 line-clamp-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {teacher.bio}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {teacher.specialties.slice(0, 3).map((specialty, i) => (
                          <span 
                            key={i}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              darkMode 
                                ? "bg-indigo-900/30 text-indigo-300 border border-indigo-800/50" 
                                : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                            }`}
                          >
                            {specialty}
                          </span>
                        ))}
                        {teacher.specialties.length > 3 && (
                          <span className={`text-xs font-medium ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                            +{teacher.specialties.length - 3} more
                          </span>
                        )}
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedTeacherId(teacher.id)}
                        className={`w-full py-2.5 rounded-lg text-sm font-medium ${
                          darkMode 
                            ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        } transition-colors shadow-md`}
                      >
                        View Full Profile
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/5 z-0 opacity-50"></div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Blog Section for Home and Bookmarks Views */}
        {(currentView === "home" || currentView === "bookmarks") && (
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={slideUp}
              className="mb-10"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {renderViewTitle()}
                  </h2>
                  <p
                    className={`text-base ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {renderViewDescription()}
                  </p>
                </div>

                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search posts, topics, or authors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl ${
                      darkMode
                        ? "bg-gray-900 border border-gray-800 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        : "bg-white border border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    } focus:outline-none text-sm transition-all duration-300`}
                  />
                </div>
              </div>
            </motion.div>

            {/* Messages for empty states */}
            {filteredPosts.length === 0 && (
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className={`text-center py-16 rounded-2xl ${
                  darkMode ? "bg-gray-900" : "bg-white"
                } shadow-sm`}
              >
                {currentView === "bookmarks" ? (
                  <>
                    <Bookmark className={`mx-auto h-16 w-16 mb-4 ${darkMode ? "text-gray-700" : "text-gray-300"}`} />
                    <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                      No bookmarks yet
                    </h3>
                    <p className={`max-w-md mx-auto ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Save your favorite posts by clicking the bookmark icon to read them later.
                    </p>
                    <button
                      onClick={() => setCurrentView("home")}
                      className="mt-6 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Browse Posts
                    </button>
                  </>
                ) : (
                  <>
                    <Search className={`mx-auto h-16 w-16 mb-4 ${darkMode ? "text-gray-700" : "text-gray-300"}`} />
                    <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                      No posts found
                    </h3>
                    <p className={`max-w-md mx-auto ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Try adjusting your search or category filters to find what you're looking for.
                    </p>
                  </>
                )}
              </motion.div>
            )}

            {filteredPosts.length > 0 && (
              <>
                {/* Categories */}
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={slideUp}
                  className="flex overflow-x-auto pb-3 mb-8 category-tabs space-x-2 no-scrollbar"
                >
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`cursor-pointer px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        activeCategory === category
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                          : darkMode
                          ? "bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </motion.div>
                
                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentPosts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial="hidden"
                      animate="visible"
                      variants={scaleUp}
                      transition={{ delay: index * 0.1 }}
                      className={`rounded-xl overflow-hidden ${
                        darkMode
                          ? "bg-gray-900 hover:bg-gray-800/80 ring-1 ring-gray-800"
                          : "bg-white hover:bg-gray-50 shadow-sm ring-1 ring-gray-100"
                      } transition-all duration-300 flex flex-col h-full`}
                    >
                      <div className="relative h-56 overflow-hidden cursor-pointer">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                          onClick={() => setSelectedPost(post)}
                        />
                        <div className="absolute top-4 left-4 z-10">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full bg-indigo-600 text-white shadow-lg`}
                          >
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="mb-3">
                          <div
                            className={`flex items-center justify-between text-xs ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            <span>{post.date}</span>
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {post.readTime}
                            </span>
                          </div>
                        </div>
                        <h3
                          className={`text-lg font-bold mb-3 leading-tight cursor-pointer hover:text-indigo-500 transition-colors ${darkMode ? "text-white" : "text-gray-900"}`}
                          onClick={() => setSelectedPost(post)}
                        >
                          {post.title}
                        </h3>
                        <div
                          className="mb-5 cursor-pointer"
                          onClick={() => setSelectedPost(post)}
                        >
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-300" : "text-gray-600"
                            } mb-4 line-clamp-3`}
                          >
                            {post.content}
                          </p>
                        </div>
                      </div>
                      {/* Profile and actions section at the very bottom of the card */}
                      <div className="flex items-center justify-between px-5 pb-5 pt-0 mt-auto">
                        <div className="flex items-center">
                          <img
                            src={post.authorAvatar}
                            alt={post.authorName}
                            className="w-9 h-9 rounded-full mr-3 object-cover ring-1 ring-gray-300/20"
                          />
                          <span className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{post.authorName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(post.id);
                            }}
                            className={`cursor-pointer flex items-center justify-center h-8 w-8 rounded-full ${
                              post.bookmarked
                                ? "text-indigo-500 bg-indigo-500/10"
                                : darkMode
                                ? "text-gray-400 hover:text-indigo-400 bg-gray-800 hover:bg-gray-700"
                                : "text-gray-500 hover:text-indigo-500 bg-gray-100 hover:bg-gray-200"
                            } transition-colors`}
                          >
                            <Bookmark
                              className={`h-4 w-4 ${
                                post.bookmarked ? "fill-indigo-500" : ""
                              }`}
                            />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(post.id);
                            }}
                            className={`cursor-pointer flex items-center justify-center h-8 w-8 rounded-full ${
                              post.liked
                                ? "text-pink-500 bg-pink-500/10"
                                : darkMode
                                ? "text-gray-400 hover:text-pink-400 bg-gray-800 hover:bg-gray-700"
                                : "text-gray-500 hover:text-pink-500 bg-gray-100 hover:bg-gray-200"
                            } transition-colors`}
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                post.liked ? "fill-pink-500" : ""
                              }`}
                            />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`cursor-pointer flex items-center justify-center h-8 w-8 rounded-full ${
                              darkMode
                                ? "text-gray-400 hover:text-indigo-400 bg-gray-800 hover:bg-gray-700"
                                : "text-gray-500 hover:text-indigo-500 bg-gray-100 hover:bg-gray-200"
                            } transition-colors`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPost(post);
                            }}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12 space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`cursor-pointer p-2 rounded-xl ${
                        currentPage === 1
                          ? "opacity-50 cursor-not-allowed"
                          : darkMode 
                            ? "hover:bg-gray-800" 
                            : "hover:bg-gray-100"
                      } transition-colors`}
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </motion.button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`cursor-pointer w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
                          currentPage === i + 1
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                            : darkMode 
                              ? "hover:bg-gray-800" 
                              : "hover:bg-gray-100"
                        }`}
                        aria-label={`Page ${i + 1}`}
                      >
                        {i + 1}
                      </motion.button>
                    ))}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className={`cursor-pointer p-2 rounded-xl ${
                        currentPage === totalPages
                          ? "opacity-50 cursor-not-allowed"
                          : darkMode 
                            ? "hover:bg-gray-800" 
                            : "hover:bg-gray-100"
                      } transition-colors`}
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </motion.button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Call to Action - Only show on home view */}
        {currentView === "home" && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className={`rounded-2xl overflow-hidden relative ${darkMode ? "bg-gray-900" : "bg-white"} shadow-lg`}
            >
              <div className="relative z-10 px-6 py-12 md:p-12 text-center">
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-indigo-600 text-white mb-4">Share Your Wisdom</span>
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Your Journey Has Value
                </h2>
                <p className={`max-w-xl mx-auto mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Each spiritual experience is unique and offers insights that might help others on their path. 
                  Share your story and become part of our mindful community.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPostModal(true)}
                  className="cursor-pointer px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-500 hover:to-purple-500 shadow-md transition-all"
                >
                  Share Your Journey
                </motion.button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 z-0"></div>
            </motion.div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className={`border-t ${
          darkMode ? "bg-gray-950 border-gray-800" : "bg-gray-900 border-gray-800"
        }`}
      >
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">

      
            <div>
              <span className="inline-block text-xl font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Mindful Path
              </span>
              <p className="mt-4 text-sm text-gray-400 max-w-md mx-auto md:mx-0">
                Sharing authentic wisdom from spiritual practitioners worldwide. Genuine insights for your journey.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">Press Kit</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Stay Connected
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Receive weekly wisdom and meditation guidance.
              </p>

              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-indigo-500/20 text-indigo-300 text-sm p-3 rounded-lg mb-4 text-center"
                >
                  Thank you for joining our mindful community!
                </motion.div>
              ) : (
                <button
                  onClick={() => {
                    setSubscribed(true);
                    setTimeout(() => setSubscribed(false), 5000);
                  }}
                  className="cursor-pointer w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  Subscribe Now
                </button>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Follow Us
              </h3>
              <div className="flex justify-center md:justify-start space-x-4">
                <a href="#" className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-indigo-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-indigo-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-indigo-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

          </div>

          <div className="mt-10 pt-8 border-t border-gray-700 text-center">
            <p className="text-xs text-gray-500">
              © 2025 Mindful Path. All rights reserved.
            </p>
          </div>

        </div>
      </footer>

      {/* Post Creation Modal */}
      <AnimatePresence>
        {showPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowPostModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className={`relative w-full max-w-xl rounded-2xl p-6 overflow-hidden ${
                darkMode ? "bg-gray-900 ring-1 ring-gray-800" : "bg-white"
              } shadow-xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPostModal(false)}
                className={`cursor-pointer absolute top-4 right-4 p-1 rounded-full ${
                  darkMode ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                } transition-colors`}
              >
                <X className="h-6 w-6" />
              </button>

              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-indigo-600 text-white rounded-full mb-2">
                  New Reflection
                </span>
                <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Share Your Journey
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Title
                    </label>
                    <input
                      type="text"
                      value={newPost.title}
                      onChange={(e) =>
                        setNewPost({ ...newPost, title: e.target.value })
                      }
                      placeholder="Enter your post title"
                      className={`w-full p-3 rounded-lg ${
                        darkMode
                          ? "bg-gray-800 border border-gray-700 text-white focus:border-indigo-500"
                          : "bg-white border border-gray-300 text-gray-900 focus:border-indigo-500"
                      } focus:ring-1 focus:ring-indigo-500 focus:outline-none`}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Category
                    </label>
                    <select
                      value={newPost.category}
                      onChange={(e) =>
                        setNewPost({ ...newPost, category: e.target.value as Post["category"] })
                      }
                      className={`w-full p-3 rounded-lg ${
                        darkMode
                          ? "bg-gray-800 border border-gray-700 text-white focus:border-indigo-500"
                          : "bg-white border border-gray-300 text-gray-900 focus:border-indigo-500"
                      } focus:ring-1 focus:ring-indigo-500 focus:outline-none`}
                    >
                      <option value="Enlightenment">Enlightenment</option>
                      <option value="Mindfulness">Mindfulness</option>
                      <option value="Wellness">Wellness</option>
                      <option value="Guidance">Guidance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Content, 150 Chracters Minimum
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) =>
                      setNewPost({ ...newPost, content: e.target.value })
                    }
                    placeholder="Share your spiritual journey..."
                    rows={5}
                    className={`w-full p-3 rounded-lg ${
                      darkMode
                        ? "bg-gray-800 border border-gray-700 text-white focus:border-indigo-500"
                        : "bg-white border border-gray-300 text-gray-900 focus:border-indigo-500"
                    } focus:ring-1 focus:ring-indigo-500 focus:outline-none`}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Tags
                    </label>
                    <div className="flex items-center">
                      <Hash className="h-5 w-5 mr-2 text-gray-500" />
                      <input
                        type="text"
                        value={newPost.tags}
                        onChange={(e) =>
                          setNewPost({ ...newPost, tags: e.target.value })
                        }
                        placeholder="Comma separated tags"
                        className={`w-full p-3 rounded-lg ${
                          darkMode
                            ? "bg-gray-800 border border-gray-700 text-white focus:border-indigo-500"
                            : "bg-white border border-gray-300 text-gray-900 focus:border-indigo-500"
                        } focus:ring-1 focus:ring-indigo-500 focus:outline-none`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Image URL (optional)
                    </label>
                    <input
                      type="text"
                      value={newPost.imageUrl}
                      onChange={(e) =>
                        setNewPost({ ...newPost, imageUrl: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                      className={`w-full p-3 rounded-lg ${
                        darkMode
                          ? "bg-gray-800 border border-gray-700 text-white focus:border-indigo-500"
                          : "bg-white border border-gray-300 text-gray-900 focus:border-indigo-500"
                      } focus:ring-1 focus:ring-indigo-500 focus:outline-none`}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className={`cursor-pointer px-5 py-2.5 rounded-lg font-medium ${
                      darkMode
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } transition-colors`}
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!newPost.title.trim() || newPost.content.trim().length < 150}
                    className={`cursor-pointer px-5 py-2.5 rounded-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-600 disabled:hover:to-purple-600`}>
                    Publish
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedPostId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className={`relative w-full max-w-4xl my-12 rounded-2xl ${
                darkMode ? "bg-gray-900" : "bg-white"
              } shadow-xl`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fixed position close button that remains visible */}
              <button
                onClick={() => setSelectedPostId(null)}
                className={`fixed top-5 right-5 z-50 p-2 rounded-full shadow-lg ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
                } hover:scale-105 transition-transform`}
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="relative h-72 md:h-80">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20" />
                
                <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-indigo-600 text-white rounded-full mb-3 shadow-lg">
                    {selectedPost.category}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                    {selectedPost.title}
                  </h1>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center">
                      <img
                        src={selectedPost.authorAvatar}
                        alt={selectedPost.authorName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white">
                          {selectedPost.authorName}
                        </p>
                        <div className="flex items-center space-x-3 text-xs text-gray-300">
                          <span>{selectedPost.date}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {selectedPost.readTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(selectedPost.id);
                        }}
                        className={`cursor-pointer flex items-center space-x-1 px-3 py-1.5 rounded-full backdrop-blur-sm ${
                          selectedPost.bookmarked
                            ? "bg-indigo-500/20 text-indigo-300"
                            : "bg-white/10 text-white hover:bg-white/20"
                        } transition-colors`}
                      >
                        <Bookmark
                          className={`h-4 w-4 ${
                            selectedPost.bookmarked ? "fill-indigo-300" : ""
                          }`}
                        />
                        <span className="text-xs font-medium">
                          {selectedPost.bookmarked ? "Saved" : "Save"}
                        </span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(selectedPost.id);
                        }}
                        className={`cursor-pointer flex items-center space-x-1 px-3 py-1.5 rounded-full backdrop-blur-sm ${
                          selectedPost.liked
                            ? "bg-pink-500/20 text-pink-300"
                            : "bg-white/10 text-white hover:bg-white/20"
                        } transition-colors`}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            selectedPost.liked ? "fill-pink-300" : ""
                          }`}
                        />
                        <span className="text-xs font-medium">
                          {selectedPost.likes}
                        </span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="cursor-pointer flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare();
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                        <span className="text-xs font-medium">
                          Share
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-10">
                <div
                  className={`prose max-w-none mb-8 ${
                    darkMode ? "prose-invert text-gray-300" : "text-gray-700"
                  }`}
                >
                  <p className="text-base md:text-lg leading-relaxed">{selectedPost.content}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {selectedPost.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        darkMode
                          ? "bg-gray-800 text-indigo-300 hover:bg-gray-700"
                          : "bg-gray-100 text-indigo-600 hover:bg-gray-200"
                      } cursor-pointer transition-colors`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div
                  className={`border-t ${
                    darkMode ? "border-gray-800" : "border-gray-200"
                  } pt-8`}
                >
                  <h3
                    className={`text-lg font-semibold mb-6 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Comments ({selectedPost.comments.length})
                  </h3>

                  <div className="space-y-4">
                    {selectedPost.comments
                      .slice(0, showAllComments ? selectedPost.comments.length : Math.min(2, selectedPost.comments.length))
                      .map((comment) => (
                        <div
                          key={comment.id}
                          className={`p-4 rounded-xl ${
                            darkMode ? "bg-gray-800" : "bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start">
                            <img 
                              src={comment.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"} 
                              alt={comment.author}
                              className="w-9 h-9 rounded-full mr-3 object-cover" 
                            />
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span
                                  className={`font-medium ${
                                    darkMode ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {comment.author}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {comment.date}
                                </span>
                              </div>
                              <p
                                className={`mt-2 text-sm ${
                                  darkMode ? "text-gray-300" : "text-gray-600"
                                }`}
                              >
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    
                    {selectedPost.comments.length > 2 && !showAllComments && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowAllComments(true);
                        }}
                        className={`w-full py-2 text-sm font-medium rounded-lg ${
                          darkMode 
                            ? "bg-gray-800 text-indigo-400 hover:bg-gray-700" 
                            : "bg-gray-100 text-indigo-600 hover:bg-gray-200"
                        } transition-colors`}
                      >
                        Show all {selectedPost.comments.length} comments
                      </button>
                    )}
                  </div>

                  <div className="mt-6">
                    <h4 className={`text-sm font-medium mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
                      Add a comment
                    </h4>
                    <div className="flex gap-3">
                      <img
                        src="https://randomuser.me/api/portraits/lego/1.jpg"
                        alt="Your avatar"
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            id={`comment-modal-${selectedPost.id}`}
                            type="text"
                            placeholder="Share your thoughts..."
                            value={commentText[selectedPost.id] || ""}
                            onChange={(e) =>
                              setCommentText({
                                ...commentText,
                                [selectedPost.id]: e.target.value,
                              })
                            }
                            className={`flex-grow p-3 pr-12 text-sm rounded-lg border w-full ${
                              darkMode
                               ? "bg-gray-800 border-gray-700 text-white focus:border-indigo-500"
                                : "bg-white border-gray-200 text-gray-900 focus:border-indigo-500"
                            } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                            onKeyPress={(e) =>
                              e.key === "Enter" && addComment(selectedPost.id)
                            }
                          />
                          <button
                            onClick={() => addComment(selectedPost.id)}
                            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full ${
                              commentText[selectedPost.id]?.trim()
                                ? "bg-indigo-600 text-white"
                                : darkMode
                                ? "bg-gray-700 text-gray-400"
                                : "bg-gray-200 text-gray-500"
                            }`}
                            disabled={!commentText[selectedPost.id]?.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teacher Detail Modal */}
      <AnimatePresence>
        {selectedTeacher && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedTeacherId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className={`relative w-full max-w-4xl my-12 rounded-2xl ${
                darkMode ? "bg-gray-900" : "bg-white"
              } shadow-xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedTeacherId(null)}
                className={`absolute top-4 right-4 p-2 rounded-full ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
                } hover:scale-105 transition-transform shadow-lg z-10`}
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 relative h-96 md:h-full overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
                  <img
                    src={selectedTeacher.imageUrl}
                    alt={selectedTeacher.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
                  
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h1 className="text-2xl font-bold text-white mb-1">
                      {selectedTeacher.name}
                    </h1>
                    <p className="text-gray-300 mb-3">
                      {selectedTeacher.title}
                    </p>
                    
                    {selectedTeacher.location && (
                      <div className="flex items-center text-gray-300 text-sm mb-3">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{selectedTeacher.location}</span>
                      </div>
                    )}
                    
                    {selectedTeacher.yearsOfExperience && (
                      <div className="flex items-center text-gray-300 text-sm">
                        <Award className="h-4 w-4 mr-2" />
                        <span>{selectedTeacher.yearsOfExperience} years of experience</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="md:col-span-2 p-6">
                  {selectedTeacher.quote && (
                    <div className="mb-6 text-lg italic border-l-4 border-indigo-500 pl-4 py-2">
                      <p className={`${darkMode ? "text-indigo-300" : "text-indigo-600"}`}>
                        "{selectedTeacher.quote}"
                      </p>
                    </div>
                  )}
                  
                  <div className="mb-8">
                    <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                      About
                    </h2>
                    <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {selectedTeacher.bio}
                    </p>
                  </div>
                  
                  <div className="mb-8">
                    <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                      Specialties
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeacher.specialties.map((specialty, i) => (
                        <span 
                          key={i}
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                            darkMode 
                              ? "bg-indigo-900/30 text-indigo-300 border border-indigo-800/50" 
                              : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                          }`}
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                      Experience
                    </h2>
                    <ul className={`space-y-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {selectedTeacher.experience.map((exp, i) => (
                        <li key={i} className="flex items-start">
                          <span className="inline-block h-2 w-2 mt-2 mr-2 rounded-full bg-indigo-500"></span>
                          {exp}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {selectedTeacher.socialLinks && Object.values(selectedTeacher.socialLinks).some(link => link) && (
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                      <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                        Connect
                      </h2>
                      <div className="flex space-x-4">
                        {selectedTeacher.socialLinks.website && (
                          <a 
                            href={selectedTeacher.socialLinks.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`p-3 rounded-full ${
                              darkMode 
                                ? "bg-gray-800 text-gray-300 hover:text-indigo-300" 
                                : "bg-gray-100 text-gray-600 hover:text-indigo-600"
                            }`}
                          >
                            <Link2 className="h-5 w-5" />
                          </a>
                        )}
                        {selectedTeacher.socialLinks.instagram && (
                          <a 
                            href={selectedTeacher.socialLinks.instagram} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`p-3 rounded-full ${
                              darkMode 
                                ? "bg-gray-800 text-gray-300 hover:text-pink-400" 
                                : "bg-gray-100 text-gray-600 hover:text-pink-600"
                            }`}
                          >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                          </a>
                        )}
                        {selectedTeacher.socialLinks.youtube && (
                          <a 
                            href={selectedTeacher.socialLinks.youtube} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`p-3 rounded-full ${
                              darkMode 
                                ? "bg-gray-800 text-gray-300 hover:text-red-400" 
                                : "bg-gray-100 text-gray-600 hover:text-red-600"
                            }`}
                          >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-8">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleScheduleSession(selectedTeacher.id)}
                      className={`w-full py-3 rounded-lg text-base font-medium flex items-center justify-center gap-2 ${
                        darkMode 
                          ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      } transition-colors shadow-md`}
                    >
                      {activeTeacherId === selectedTeacher.id ? (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="h-5 w-5 text-white" />
                          <span>Session Scheduled</span>
                        </motion.span>
                      ) : (
                        "Schedule a Session"
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className={`relative w-full max-w-sm rounded-xl p-6 ${
                darkMode ? "bg-gray-900 ring-1 ring-gray-800" : "bg-white"
              } shadow-xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3
                className={`text-lg font-semibold mb-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Demo Mode
              </h3>
              <p
                className={`mb-6 text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                This is a demonstration application. This functionality is not available in this preview.
              </p>
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowLogoutModal(false)}
                  className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg z-40 ${
              darkMode 
                ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            } transition-all duration-300`}
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 ${
              darkMode 
                ? "bg-gray-800 text-white border border-gray-700" 
                : "bg-white text-gray-900 border border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
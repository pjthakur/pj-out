"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Menu,
  X,
  Search,
  User,
  LogOut,
  Clock,
  TrendingUp,
  Globe,
  Smartphone,
  Cpu,
  Shield,
  ChevronRight,
  Star,
  Eye,
  MessageCircle,
  Share2,
  Bell,
  Play,
  Twitter,
  Facebook,
  Instagram,
  Copy,
} from "lucide-react";

interface User {
  email: string;
  name: string;
}

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  readTime: string;
  views: string;
  comments: number;
  author: string;
  publishedAt: string;
  featured?: boolean;
  likes: number;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface NewsletterFormData {
  email: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

const TechPulse: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
    null
  );
  const [shareArticle, setShareArticle] = useState<NewsArticle | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [newsletterForm, setNewsletterForm] = useState<NewsletterFormData>({
    email: "",
  });
  const [loginErrors, setLoginErrors] = useState<Partial<LoginFormData>>({});
  const [newsletterError, setNewsletterError] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedArticles, setLikedArticles] = useState<Set<string>>(new Set());

  // Toast utility functions
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success', duration: number = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const categories = [
    "All",
    "AI",
    "Blockchain",
    "Cybersecurity",
    "Mobile",
    "Cloud",
    "Hardware",
  ];

  const newsArticles: NewsArticle[] = [
    {
      id: "1",
      title:
        "Revolutionary AI Breakthrough Changes Everything We Know About Machine Learning",
      excerpt:
        "Scientists at leading tech companies have developed a new approach to artificial intelligence that promises to revolutionize how machines learn and adapt.",
      content: `<div class="prose max-w-none">
        <p>In a groundbreaking development that could reshape the entire landscape of artificial intelligence, researchers at leading technology companies have unveiled a revolutionary approach to machine learning that promises unprecedented capabilities in pattern recognition and adaptive learning.</p>
        
        <h2>The Breakthrough</h2>
        <p>The new methodology, dubbed "Neural Synthesis Architecture" (NSA), represents a fundamental shift from traditional deep learning approaches. Unlike conventional neural networks that require massive datasets and extensive training periods, NSA can learn and adapt with minimal data exposure, mimicking the efficiency of human cognitive processes.</p>
        
        <h2>Key Innovations</h2>
        <p>The research team has identified three critical innovations that make this breakthrough possible:</p>
        <ul>
          <li><strong>Adaptive Memory Networks:</strong> These allow the AI to retain and apply knowledge across different domains without forgetting previous learnings.</li>
          <li><strong>Contextual Reasoning Modules:</strong> Enable the system to understand nuanced relationships between concepts, much like human intuition.</li>
          <li><strong>Self-Optimizing Algorithms:</strong> The AI can modify its own learning processes to become more efficient over time.</li>
        </ul>
        
        <h2>Real-World Applications</h2>
        <p>The implications of this breakthrough extend far beyond academic research. Industries from healthcare to autonomous vehicles are already exploring potential applications. Early tests show the system can diagnose medical conditions with 97% accuracy using just a fraction of the data required by current AI systems.</p>
        
        <p>Dr. Sarah Chen, lead researcher on the project, explains: "We're not just improving existing AI capabilities – we're fundamentally changing how machines can think and learn. This could be the key to achieving true artificial general intelligence."</p>
        
        <h2>Looking Forward</h2>
        <p>While the technology is still in early stages, major tech companies are already investing heavily in development. The next phase of research will focus on scaling the system and addressing ethical considerations around such powerful AI capabilities.</p>
      </div>`,
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
      category: "AI",
      readTime: "5 min read",
      views: "12.5K",
      comments: 89,
      author: "Dr. Sarah Chen",
      publishedAt: "2 hours ago",
      featured: true,
      likes: 245,
    },
    {
      id: "2",
      title:
        "Quantum Computing Reaches New Milestone with 1000-Qubit Processor",
      excerpt:
        "The latest quantum processor breakthrough brings us closer to solving complex problems that are impossible for traditional computers.",
      content: `<div class="prose max-w-none">
        <p>The quantum computing industry has achieved another major milestone with the successful development and testing of a 1000-qubit quantum processor, marking a significant step toward practical quantum supremacy in real-world applications.</p>
        
        <h2>Technical Achievement</h2>
        <p>This latest processor represents a 10x improvement over previous quantum systems, utilizing advanced error correction and qubit stabilization techniques that maintain coherence for unprecedented durations. The system operates at near absolute zero temperatures and requires sophisticated isolation from electromagnetic interference.</p>
        
        <h2>Breakthrough Applications</h2>
        <p>With 1000 qubits at their disposal, researchers can now tackle problems that would take classical computers thousands of years to solve, including molecular simulation for drug discovery, optimization problems in logistics, and cryptographic applications.</p>
        
        <p>The implications for industries are immense – from revolutionizing pharmaceutical research to transforming financial modeling and weather prediction systems.</p>
      </div>`,
      image:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop",
      category: "Hardware",
      readTime: "7 min read",
      views: "8.2K",
      comments: 45,
      author: "Michael Rodriguez",
      publishedAt: "4 hours ago",
      likes: 189,
    },
    {
      id: "3",
      title:
        "Major Security Vulnerability Discovered in Popular Cloud Platforms",
      excerpt:
        "Cybersecurity researchers have identified critical vulnerabilities affecting millions of cloud-based applications worldwide.",
      content: `<div class="prose max-w-none">
        <p>A team of cybersecurity researchers has uncovered a series of critical vulnerabilities in major cloud computing platforms that could potentially expose millions of applications and their sensitive data to malicious attacks.</p>
        
        <h2>The Vulnerability</h2>
        <p>The discovered flaws, collectively termed "CloudStorm," affect the fundamental authentication mechanisms used by cloud platforms to verify user identities and manage access permissions. The vulnerabilities could allow attackers to escalate privileges, access sensitive data, and potentially take control of entire cloud infrastructures.</p>
        
        <h2>Immediate Response</h2>
        <p>Major cloud providers have been notified and are working around the clock to deploy patches and security updates. Users are advised to review their security configurations and implement additional authentication measures as a precautionary step.</p>
        
        <p>This discovery highlights the critical importance of continuous security auditing in cloud environments and the need for robust security practices as organizations increasingly rely on cloud services.</p>
      </div>`,
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop",
      category: "Cybersecurity",
      readTime: "4 min read",
      views: "15.7K",
      comments: 156,
      author: "Alex Thompson",
      publishedAt: "6 hours ago",
      likes: 312,
    },
    {
      id: "4",
      title:
        "Next-Generation 6G Technology Promises 100x Faster Internet Speeds",
      excerpt:
        "Early testing of 6G networks shows unprecedented data transfer rates that could transform how we interact with digital content.",
      content: `<div class="prose max-w-none">
        <p>The telecommunications industry is setting its sights on the future with early 6G technology demonstrations showing internet speeds up to 100 times faster than current 5G networks, promising to revolutionize everything from streaming media to autonomous vehicle communications.</p>
        
        <h2>Speed Revolution</h2>
        <p>Initial tests have achieved data transfer rates exceeding 1 terabit per second, enabling possibilities that seemed like science fiction just years ago. At these speeds, downloading a full-length 4K movie would take less than a second, and real-time holographic communications could become mainstream.</p>
        
        <h2>Beyond Speed</h2>
        <p>However, 6G isn't just about faster downloads. The technology promises ultra-low latency, enhanced AI integration, and the ability to support millions of connected devices per square kilometer – crucial for the Internet of Things and smart city applications.</p>
        
        <p>While commercial deployment is still years away, the early results suggest that 6G could be the foundation for truly immersive digital experiences and seamless integration between physical and virtual worlds.</p>
      </div>`,
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
      category: "Mobile",
      readTime: "6 min read",
      views: "9.3K",
      comments: 67,
      author: "Emma Liu",
      publishedAt: "8 hours ago",
      likes: 156,
    },
    {
      id: "5",
      title: "Blockchain Technology Revolutionizes Supply Chain Management",
      excerpt:
        "Major corporations are adopting blockchain solutions to create transparent and efficient supply chain tracking systems.",
      content: `<div class="prose max-w-none">
        <p>Leading corporations across various industries are implementing blockchain technology to create unprecedented transparency and efficiency in their supply chain operations, marking a significant shift toward more accountable and sustainable business practices.</p>
        
        <h2>Transparency Revolution</h2>
        <p>Blockchain's immutable ledger system allows companies and consumers to track products from their origin to final delivery, creating an unbreakable chain of custody that prevents fraud and ensures authenticity.</p>
        
        <h2>Real-World Implementation</h2>
        <p>Major retailers are already using blockchain to track everything from food products to luxury goods, providing consumers with detailed information about product origins, manufacturing processes, and environmental impact.</p>
        
        <p>This technology is particularly valuable in industries where authenticity and ethical sourcing are crucial, such as pharmaceuticals, organic foods, and luxury goods.</p>
      </div>`,
      image:
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
      category: "Blockchain",
      readTime: "5 min read",
      views: "6.8K",
      comments: 34,
      author: "David Park",
      publishedAt: "12 hours ago",
      likes: 98,
    },
    {
      id: "6",
      title: "Cloud Computing Giants Announce Major Infrastructure Expansion",
      excerpt:
        "Leading cloud providers are investing billions in new data centers to meet growing demand for cloud services.",
      content: `<div class="prose max-w-none">
        <p>Major cloud computing providers have announced massive infrastructure investments, with plans to build dozens of new data centers worldwide to meet the exponentially growing demand for cloud services and edge computing capabilities.</p>
        
        <h2>Investment Scale</h2>
        <p>The combined investment from leading providers exceeds $50 billion, representing one of the largest infrastructure expansions in the technology sector's history. These new facilities will incorporate the latest in energy-efficient design and renewable energy sources.</p>
        
        <h2>Global Reach</h2>
        <p>The expansion focuses on bringing cloud services closer to end users through edge computing locations, reducing latency and improving performance for applications requiring real-time processing.</p>
        
        <p>This infrastructure boom reflects the continued digital transformation of businesses worldwide and the increasing reliance on cloud-based services for everything from data storage to artificial intelligence processing.</p>
      </div>`,
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
      category: "Cloud",
      readTime: "4 min read",
      views: "7.1K",
      comments: 28,
      author: "Rachel Green",
      publishedAt: "1 day ago",
      likes: 134,
    },
    {
      id: "7",
      title:
        "Virtual Reality Technology Transforms Medical Training and Patient Care",
      excerpt:
        "Healthcare professionals are using VR to train surgeons, treat phobias, and provide immersive therapy experiences for patients worldwide.",
      content: `<div class="prose max-w-none">
        <p>Virtual Reality technology is revolutionizing healthcare by providing innovative solutions for medical training, patient treatment, and therapeutic interventions that were previously impossible or impractical.</p>
        
        <h2>Medical Training Revolution</h2>
        <p>Medical schools and hospitals are implementing VR systems that allow students and professionals to practice complex surgical procedures in risk-free virtual environments. These simulations provide detailed anatomical models and realistic surgical scenarios.</p>
        
        <h2>Patient Treatment Applications</h2>
        <p>VR therapy is showing remarkable success in treating conditions like PTSD, phobias, and chronic pain. Patients can be gradually exposed to controlled virtual environments that help them overcome fears and manage symptoms.</p>
        
        <p>The technology is also being used for rehabilitation therapy, helping stroke patients regain motor skills through engaging virtual exercises and activities.</p>
      </div>`,
      image:
        "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&h=400&fit=crop",
      category: "AI",
      readTime: "6 min read",
      views: "11.2K",
      comments: 73,
      author: "Dr. Jennifer Walsh",
      publishedAt: "14 hours ago",
      likes: 187,
    },
    {
      id: "8",
      title: "Sustainable Tech: Solar Panel Efficiency Breaks 30% Barrier",
      excerpt:
        "New perovskite-silicon tandem solar cells achieve record-breaking efficiency rates, promising cheaper and more accessible renewable energy.",
      content: `<div class="prose max-w-none">
        <p>Researchers have achieved a major breakthrough in renewable energy technology with solar panels that can convert over 30% of sunlight into electricity, surpassing previous efficiency records.</p>
        
        <h2>Breakthrough Technology</h2>
        <p>The new perovskite-silicon tandem cells combine two different materials to capture a broader spectrum of sunlight, significantly improving energy conversion rates compared to traditional silicon-only panels.</p>
        
        <h2>Environmental Impact</h2>
        <p>This advancement could accelerate the global transition to renewable energy by making solar power more cost-effective and efficient, potentially reducing installation costs and increasing adoption rates worldwide.</p>
        
        <p>The technology promises to make renewable energy more accessible to developing nations and could play a crucial role in meeting global climate targets.</p>
      </div>`,
      image:
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=400&fit=crop",
      category: "Hardware",
      readTime: "5 min read",
      views: "9.8K",
      comments: 52,
      author: "Dr. Marcus Silva",
      publishedAt: "18 hours ago",
      likes: 203,
    },
    {
      id: "9",
      title: "Apple and Google Announce Major Privacy Updates for Mobile Users",
      excerpt:
        "Tech giants introduce new privacy features that give users unprecedented control over their personal data and app permissions.",
      content: `<div class="prose max-w-none">
        <p>Major technology companies are rolling out comprehensive privacy updates that fundamentally change how mobile applications can collect and use personal data.</p>
        
        <h2>Enhanced User Control</h2>
        <p>The new features include granular permission controls, real-time tracking alerts, and simplified privacy dashboards that make it easier for users to understand and control their data sharing.</p>
        
        <h2>Industry Impact</h2>
        <p>These changes are expected to significantly impact digital advertising and app development, forcing companies to adopt more transparent and user-friendly data practices.</p>
        
        <p>Privacy advocates praise these moves as important steps toward giving users more control over their digital lives and personal information.</p>
      </div>`,
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop",
      category: "Mobile",
      readTime: "4 min read",
      views: "13.5K",
      comments: 94,
      author: "Sarah Kim",
      publishedAt: "1 day ago",
      likes: 278,
    },
    {
      id: "10",
      title: "Autonomous Vehicles Reach New Safety Milestone in Urban Testing",
      excerpt:
        "Self-driving cars demonstrate 40% fewer accidents than human drivers in comprehensive city-wide testing programs.",
      content: `<div class="prose max-w-none">
        <p>Extensive testing programs in major cities have shown that autonomous vehicles are significantly safer than human-operated cars, marking a crucial milestone for the self-driving car industry.</p>
        
        <h2>Safety Statistics</h2>
        <p>The latest data from comprehensive testing programs shows autonomous vehicles have 40% fewer accidents per mile driven compared to human drivers, with particularly strong performance in complex urban environments.</p>
        
        <h2>Technology Advances</h2>
        <p>Improvements in sensor technology, machine learning algorithms, and real-time processing capabilities have enabled these vehicles to better navigate challenging situations like pedestrian crossings, construction zones, and adverse weather conditions.</p>
        
        <p>Regulatory agencies are now considering frameworks that could accelerate the deployment of autonomous vehicles in urban areas.</p>
      </div>`,
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
      category: "AI",
      readTime: "7 min read",
      views: "16.3K",
      comments: 118,
      author: "Robert Chen",
      publishedAt: "2 days ago",
      likes: 341,
    },
    {
      id: "11",
      title:
        "Edge Computing Revolution: Processing Power Moves Closer to Users",
      excerpt:
        "New edge computing infrastructure promises ultra-low latency for applications ranging from gaming to industrial automation.",
      content: `<div class="prose max-w-none">
        <p>The computing industry is experiencing a fundamental shift as processing power moves from centralized cloud servers to edge locations closer to end users, enabling new applications and dramatically improving performance.</p>
        
        <h2>Technical Innovation</h2>
        <p>Edge computing nodes are being deployed in cellular towers, retail locations, and industrial sites, providing powerful computing capabilities with latency measured in single-digit milliseconds rather than the 50-100ms typical of cloud services.</p>
        
        <h2>Real-World Applications</h2>
        <p>This technology enables real-time applications like autonomous vehicles, industrial robotics, augmented reality, and ultra-responsive gaming experiences that were previously impossible with traditional cloud computing.</p>
        
        <p>The edge computing market is expected to grow exponentially as 5G networks provide the high-speed, low-latency connectivity needed to fully realize its potential.</p>
      </div>`,
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
      category: "Cloud",
      readTime: "6 min read",
      views: "8.7K",
      comments: 61,
      author: "Lisa Chang",
      publishedAt: "2 days ago",
      likes: 156,
    },
    {
      id: "12",
      title: "Cryptocurrency Market Sees Major Institutional Adoption Wave",
      excerpt:
        "Fortune 500 companies and central banks worldwide are integrating blockchain technology and digital currencies into their operations.",
      content: `<div class="prose max-w-none">
        <p>The cryptocurrency and blockchain industry is experiencing unprecedented institutional adoption as major corporations and government entities integrate digital assets into their financial strategies.</p>
        
        <h2>Corporate Adoption</h2>
        <p>Major companies are not only investing in cryptocurrencies as treasury assets but also implementing blockchain technology for supply chain management, smart contracts, and cross-border payments.</p>
        
        <h2>Government Integration</h2>
        <p>Central banks worldwide are developing digital versions of their national currencies, while regulatory frameworks are becoming more supportive of blockchain innovation and cryptocurrency trading.</p>
        
        <p>This mainstream adoption is driving increased stability and legitimacy in the cryptocurrency market, attracting more traditional investors and use cases.</p>
      </div>`,
      image:
        "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop",
      category: "Blockchain",
      readTime: "5 min read",
      views: "12.4K",
      comments: 87,
      author: "Michael Torres",
      publishedAt: "3 days ago",
      likes: 234,
    },
    {
      id: "13",
      title:
        "Breakthrough in Neuromorphic Computing Mimics Human Brain Function",
      excerpt:
        "Scientists develop computer chips that process information like biological neural networks, promising ultra-efficient AI systems.",
      content: `<div class="prose max-w-none">
        <p>Researchers have made significant advances in neuromorphic computing, creating chips that mimic the structure and function of biological neural networks to achieve unprecedented efficiency in AI processing.</p>
        
        <h2>Brain-Inspired Architecture</h2>
        <p>Unlike traditional digital processors, neuromorphic chips use analog signals and event-driven processing that closely resembles how neurons communicate in the human brain, resulting in dramatically lower power consumption.</p>
        
        <h2>Efficiency Breakthrough</h2>
        <p>These chips can perform AI tasks using up to 1000 times less energy than conventional processors, making it possible to run sophisticated AI applications on battery-powered devices for extended periods.</p>
        
        <p>Applications range from autonomous drones and smart sensors to prosthetic limbs and brain-computer interfaces that could revolutionize how humans interact with technology.</p>
      </div>`,
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
      category: "Hardware",
      readTime: "8 min read",
      views: "7.9K",
      comments: 45,
      author: "Dr. Amanda Foster",
      publishedAt: "3 days ago",
      likes: 198,
    },
    {
      id: "14",
      title: "Next-Gen Cybersecurity: AI-Powered Threat Detection Systems",
      excerpt:
        "Advanced machine learning algorithms can now predict and prevent cyber attacks before they happen, revolutionizing digital security.",
      content: `<div class="prose max-w-none">
        <p>The cybersecurity industry is being transformed by artificial intelligence systems that can predict, identify, and neutralize cyber threats in real-time, offering unprecedented protection for digital infrastructure.</p>
        
        <h2>Predictive Security</h2>
        <p>AI-powered security systems analyze patterns in network traffic, user behavior, and system interactions to identify potential threats before they can cause damage, moving from reactive to proactive cybersecurity.</p>
        
        <h2>Automated Response</h2>
        <p>These systems can automatically isolate infected systems, block malicious traffic, and implement countermeasures without human intervention, responding to threats in milliseconds rather than hours or days.</p>
        
        <p>The technology is particularly crucial as cyber attacks become more sophisticated and frequent, with AI helping to level the playing field between attackers and defenders.</p>
      </div>`,
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
      category: "Cybersecurity",
      readTime: "6 min read",
      views: "14.1K",
      comments: 102,
      author: "David Park",
      publishedAt: "4 days ago",
      likes: 267,
    },
  ];

  const filteredArticles = newsArticles.filter((article) => {
    const matchesCategory =
      selectedCategory === "All" || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = newsArticles.find((article) => article.featured);
  const regularArticles = filteredArticles.filter(
    (article) => !article.featured
  );

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const toggleLogin = useCallback(() => {
    setIsLoginOpen((prev) => !prev);
    setLoginErrors({});
    setLoginForm({ email: "", password: "" });
    setIsMenuOpen(false);
    // loveleen
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = useCallback(() => {
    const errors: Partial<LoginFormData> = {};

    if (!loginForm.email) {
      errors.email = "Email is required";
    } else if (!validateEmail(loginForm.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!loginForm.password) {
      errors.password = "Password is required";
    } else if (loginForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setLoginErrors(errors);

    if (Object.keys(errors).length === 0) {
      // Sample credentials check
      if (
        loginForm.email === "demo@techpulse.com" &&
        loginForm.password === "demo123"
      ) {
        setUser({ email: loginForm.email, name: "Demo User" });
        setIsLoginOpen(false);
        showToast("Successfully logged in! Welcome back.", "success");
      } else {
        errors.password =
          "Invalid credentials. Use: demo@techpulse.com / demo123";
        setLoginErrors(errors);
      }
    }
  }, [loginForm, showToast]);

  const handleLogout = useCallback(() => {
    setUser(null);
    showToast("Successfully logged out. See you next time!", "success");
  }, [showToast]);

  const handleNewsletterSubmit = useCallback(() => {
    if (!newsletterForm.email) {
      setNewsletterError("Email is required");
      return;
    }
    if (!validateEmail(newsletterForm.email)) {
      setNewsletterError("Please enter a valid email");
      return;
    }

    setNewsletterError("");
    showToast("Successfully subscribed to our newsletter!", "success");
    setNewsletterForm({ email: "" });
  }, [newsletterForm, showToast]);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handleArticleClick = useCallback((article: NewsArticle) => {
    setSelectedArticle(article);
  }, []);

  const handleBackToNews = useCallback(() => {
    setSelectedArticle(null);
  }, []);

  const handleLikeArticle = useCallback(
    (articleId: string) => {
      setLikedArticles((prev) => {
        const newLiked = new Set(prev);
        if (newLiked.has(articleId)) {
          newLiked.delete(articleId);
        } else {
          newLiked.add(articleId);
        }
        return newLiked;
      });
    },
    []
  );

  const handleShareClick = useCallback((article: NewsArticle) => {
    setShareArticle(article);
    setIsShareOpen(true);
  }, []);

  const handleCloseShare = useCallback(() => {
    setIsShareOpen(false);
    setShareArticle(null);
  }, []);

  const handleShare = useCallback(
    (platform: string) => {
      if (!shareArticle) return;

      const url = `https://techpulse.com/article/${shareArticle.id}`;
      const text = shareArticle.title;

      let shareUrl = "";
      switch (platform) {
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(url)}`;
          break;
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`;
          break;
        case "linkedin":
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`;
          break;
        case "copy":
          navigator.clipboard.writeText(url);
          showToast("Link copied to clipboard!", "success", 3000);
          handleCloseShare();
          return;
      }

      if (shareUrl) {
        window.open(shareUrl, "_blank", "width=600,height=400");
        handleCloseShare();
      }
    },
    [shareArticle, showToast]
  );

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLoginOpen(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);
  useEffect(() => {
    const shouldLockScroll =
      isLoginOpen || isShareOpen || isMenuOpen || selectedArticle;

    if (shouldLockScroll) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isLoginOpen, isShareOpen, isMenuOpen, selectedArticle]);

  // Remove scroll detection - we want a simple static header

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");
        * {
          font-family: "Roboto", sans-serif;
        }
      `}</style>

      {/* Toast Notifications */}
      <div className="fixed bottom-4 left-4 right-4 md:top-4 md:right-4 md:left-auto md:bottom-auto z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`w-full md:min-w-80 md:max-w-sm bg-white/95 backdrop-blur-lg shadow-xl rounded-lg pointer-events-auto ring-1 ring-black/5 transform transition-all duration-300 ease-in-out ${
              toast.type === 'success' ? 'border-l-4 border-green-500' :
              toast.type === 'error' ? 'border-l-4 border-red-500' :
              'border-l-4 border-blue-500'
            }`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {toast.type === 'success' && (
                    <div className="h-5 w-5 text-green-500">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  {toast.type === 'error' && (
                    <div className="h-5 w-5 text-red-500">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                  {toast.type === 'info' && (
                    <div className="h-5 w-5 text-blue-500">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {toast.message}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
                    onClick={() => removeToast(toast.id)}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Static Header */}
      <header className="bg-white shadow-lg sticky top-0 z-40 border-b border-gray-200">
        {/* Main Header */}
        <div className="bg-white py-5 lg:py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-8">
              {/* Logo */}
              <div className="flex items-center space-x-4 flex-shrink-0">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-md">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    TechPulse
                  </h1>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-10 flex-1 justify-center">
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 cursor-pointer text-sm tracking-wide"
                >
                  HOME
                </button>
                <button
                  onClick={() => scrollToSection("technology")}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 cursor-pointer text-sm tracking-wide"
                >
                  TECH
                </button>
                <button
                  onClick={() => scrollToSection("featured")}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 cursor-pointer text-sm tracking-wide"
                >
                  FEATURED
                </button>
                <button
                  onClick={() => scrollToSection("latest")}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 cursor-pointer text-sm tracking-wide"
                >
                  LATEST
                </button>
                <button
                  onClick={() => scrollToSection("trending")}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 cursor-pointer text-sm tracking-wide"
                >
                  TRENDING
                </button>
                <button
                  onClick={() => scrollToSection("videos")}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 cursor-pointer text-sm tracking-wide"
                >
                  VIDEOS
                </button>
                <button
                  onClick={() => scrollToSection("newsletter")}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 cursor-pointer text-sm tracking-wide"
                >
                  SUBSCRIBE
                </button>
              </nav>

              {/* Search and Login */}
              <div className="flex items-center space-x-3 lg:space-x-5 flex-shrink-0">
                {/* Search Bar - Desktop Only */}
                <div className="relative hidden lg:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search news..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 lg:w-56 xl:w-64 text-sm bg-gray-50 focus:bg-white transition-colors duration-200"
                  />
                </div>

                {/* User Controls */}
                {user ? (
                  <div className="flex items-center space-x-2 lg:space-x-3 xl:space-x-4">
                    <span className="text-sm font-medium text-gray-700 hidden 2xl:block truncate max-w-32">
                      Welcome, {user.name}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 lg:space-x-2 text-red-600 hover:text-red-700 py-2 px-2 lg:px-3 rounded-lg hover:bg-red-50 transition-all duration-200 cursor-pointer flex-shrink-0"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm hidden xl:block">Logout</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={toggleLogin}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 lg:px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer text-sm font-medium flex-shrink-0"
                  >
                    <User className="h-4 w-4" />
                    <span>Login</span>
                  </button>
                )}

                {/* Mobile Menu Button */}
                <button
                  onClick={toggleMenu}
                  className="lg:hidden p-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 cursor-pointer flex-shrink-0"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-1 pb-5">
                <button
                  onClick={() => scrollToSection("home")}
                  className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-3 rounded-lg transition-all duration-200 w-full text-left cursor-pointer"
                >
                  HOME
                </button>
                <button
                  onClick={() => scrollToSection("technology")}
                  className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-3 rounded-lg transition-all duration-200 w-full text-left cursor-pointer"
                >
                  TECH
                </button>
                <button
                  onClick={() => scrollToSection("featured")}
                  className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-3 rounded-lg transition-all duration-200 w-full text-left cursor-pointer"
                >
                  FEATURED
                </button>
                <button
                  onClick={() => scrollToSection("latest")}
                  className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-3 rounded-lg transition-all duration-200 w-full text-left cursor-pointer"
                >
                  LATEST
                </button>
                <button
                  onClick={() => scrollToSection("trending")}
                  className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-3 rounded-lg transition-all duration-200 w-full text-left cursor-pointer"
                >
                  TRENDING
                </button>
                <button
                  onClick={() => scrollToSection("videos")}
                  className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-3 rounded-lg transition-all duration-200 w-full text-left cursor-pointer"
                >
                  VIDEOS
                </button>
                <button
                  onClick={() => scrollToSection("newsletter")}
                  className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-3 rounded-lg transition-all duration-200 w-full text-left cursor-pointer"
                >
                  SUBSCRIBE
                </button>

                {/* Mobile User Controls */}
                <div className="pt-4 border-t border-gray-200 mt-4">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 py-2 px-3">
                        <User className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Welcome, {user.name}
                        </span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 text-red-600 hover:text-red-700 hover:bg-red-50 py-3 px-3 rounded-lg transition-all duration-200 cursor-pointer w-full"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={toggleLogin}
                      className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-5 py-3 rounded-full hover:bg-blue-700 transition-all duration-200 w-full cursor-pointer font-medium"
                    >
                      <User className="h-4 w-4" />
                      <span>Login</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md transform transition-all duration-300 scale-100 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <button
                onClick={toggleLogin}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
                {loginErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {loginErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
                {loginErrors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {loginErrors.password}
                  </p>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Demo Credentials:</strong>
                  <br />
                  Email: demo@techpulse.com
                  <br />
                  Password: demo123
                </p>
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {isShareOpen && shareArticle && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 md:p-8 w-full max-w-md transform transition-all duration-300 scale-100 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Share Article
              </h2>
              <button
                onClick={handleCloseShare}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                {shareArticle.title}
              </h3>
              <p className="text-sm text-gray-600">
                Share this article with your network
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm md:text-md">
              <button
                onClick={() => handleShare("twitter")}
                className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-all duration-200 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4.36a9.32 9.32 0 01-2.89 1.1A4.52 4.52 0 0016.1 0c-2.4 0-4.4 1.94-4.4 4.35 0 .34.04.66.1.97C7.69 5.2 4.07 3.3 1.64.44a4.28 4.28 0 00-.6 2.18c0 1.51.8 2.85 2 3.63A4.5 4.5 0 01.96 6v.06c0 2.1 1.52 3.85 3.55 4.25a4.53 4.53 0 01-2 .07c.57 1.76 2.23 3.03 4.2 3.06A9.06 9.06 0 010 19.54 12.8 12.8 0 006.29 21c7.55 0 11.68-6.09 11.68-11.38 0-.17 0-.35-.01-.52A8.18 8.18 0 0023 3z" />
                </svg>
                <span>Twitter</span>
              </button>

              <button
                onClick={() => handleShare("facebook")}
                className="flex items-center justify-center space-x-2 bg-blue-700 text-white px-4 py-3 rounded-lg hover:bg-blue-800 transition-all duration-200 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v9h4v-9h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
                <span>Facebook</span>
              </button>

              <button
                onClick={() => handleShare("linkedin")}
                className="flex items-center justify-center space-x-2 bg-pink-600 text-white px-4 py-3 rounded-lg hover:bg-pink-700 transition-all duration-200 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 0012 7a4 4 0 00-4 4.37v4.63h8z" />
                  <line x1="8" y1="16" x2="8" y2="16" />
                </svg>
                <span>Instagram</span>
              </button>

              <button
                onClick={() => handleShare("copy")}
                className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                <span>Copy </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section
        id="home"
        className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Stay Ahead of Tomorrow
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto px-4 sm:px-0">
              Breaking technology news, in-depth analysis, and expert insights
              that shape the future
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
              <button
                onClick={() => scrollToSection("latest")}
                className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm md:text-base cursor-pointer"
              >
                <span>Latest News</span>
                <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
              </button>
              <button
                className="border-2 border-white text-white px-6 md:px-8 py-3 md:py-4 rounded-full hover:bg-white hover:text-gray-900 transition-all duration-200 font-medium text-sm md:text-base cursor-pointer"
                onClick={() => scrollToSection("newsletter")}
              >
                Subscribe Newsletter
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Search Section - Below Hero */}
      <section className="lg:hidden bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50 focus:bg-white transition-colors duration-200 shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section id="technology" className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-4 md:px-6 py-2 rounded-full font-medium transition-all duration-200 text-sm md:text-base cursor-pointer ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Article Detail View */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={handleBackToNews}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 cursor-pointer bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
              >
                <ChevronRight className="h-5 w-5 rotate-180" />
                <span className="font-medium hidden md:block">Back to News</span>
              </button>

              <div className="flex items-center space-x-3 md:space-x-4">
                <button
                  onClick={() => handleShareClick(selectedArticle)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer bg-white/80 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full shadow-lg"
                >
                  <Share2 className="h-5 w-5" />
                  <span className="hidden md:block">Share</span>
                </button>

                <button
                  onClick={() => handleLikeArticle(selectedArticle.id)}
                  className={`flex items-center space-x-2 transition-colors duration-200 cursor-pointer px-3 md:px-4 py-2 rounded-full shadow-lg backdrop-blur-sm ${
                    likedArticles.has(selectedArticle.id)
                      ? "text-red-500 hover:text-red-600 bg-red-50/80"
                      : "text-gray-600 hover:text-red-500 bg-white/80"
                  }`}
                >
                  <Star
                    className={`h-5 w-5 ${
                      likedArticles.has(selectedArticle.id)
                        ? "fill-current"
                        : ""
                    }`}
                  />
                  <span className="hidden md:block">
                    {selectedArticle.likes +
                      (likedArticles.has(selectedArticle.id) ? 1 : 0)}
                  </span>
                </button>
              </div>
            </div>

            <article className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-64 md:h-96 object-cover"
              />

              <div className="p-3 py-4 md:p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {selectedArticle.category}
                  </span>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{selectedArticle.readTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{selectedArticle.views}</span>
                    </div>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {selectedArticle.title}
                </h1>

                <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-semibold">
                        {selectedArticle.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {selectedArticle.author}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedArticle.publishedAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLikeArticle(selectedArticle.id)}
                      className={`flex items-center space-x-1 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer backdrop-blur-sm ${
                        likedArticles.has(selectedArticle.id)
                          ? "bg-red-50/80 text-red-600 border border-red-200/50 shadow-lg"
                          : "bg-gray-50/80 text-gray-600 border border-gray-200/50 hover:bg-red-50/80 hover:text-red-600 shadow-lg"
                      }`}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          likedArticles.has(selectedArticle.id)
                            ? "fill-current"
                            : ""
                        }`}
                      />
                      <span>
                        {selectedArticle.likes +
                          (likedArticles.has(selectedArticle.id) ? 1 : 0)}
                      </span>
                    </button>
                  </div>
                </div>

                <div
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />
              </div>
            </article>
          </div>
        </div>
      )}

      {/* Featured News */}
      {featuredArticle && selectedCategory === "All" && !selectedArticle && !searchQuery.trim() && (
        <section
          id="featured"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-64 md:h-full object-cover cursor-pointer"
                  onClick={() => handleArticleClick(featuredArticle)}
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    FEATURED
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {featuredArticle.category}
                  </span>
                </div>
                <h2
                  className="text-3xl font-bold text-gray-900 mb-4 hover:text-blue-600 cursor-pointer transition-colors duration-200"
                  onClick={() => handleArticleClick(featuredArticle)}
                >
                  {featuredArticle.title}
                </h2>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                  {/* Left Section */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{featuredArticle.readTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{featuredArticle.views}</span>
                    </div>

                    <button
                      onClick={() => handleLikeArticle(featuredArticle.id)}
                      className={`flex items-center space-x-1 transition-colors duration-200 cursor-pointer ${
                        likedArticles.has(featuredArticle.id)
                          ? "text-red-500 hover:text-red-600"
                          : "text-gray-500 hover:text-red-500"
                      }`}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          likedArticles.has(featuredArticle.id)
                            ? "fill-current"
                            : ""
                        }`}
                      />
                      <span>
                        {featuredArticle.likes +
                          (likedArticles.has(featuredArticle.id) ? 1 : 0)}
                      </span>
                    </button>
                  </div>

                  {/* Right Section */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleShareClick(featuredArticle)}
                      className="text-gray-500 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleArticleClick(featuredArticle)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-200 font-medium cursor-pointer"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* News Grid */}
      {!selectedArticle && (
        <section
          id="latest"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className=" text-2xl md:text-3xl font-bold text-gray-900">
              Latest News
            </h2>
            <div className="flex items-center space-x-2 text-gray-600 ">
              <TrendingUp className="h-5 w-5" />
              <span className="font-medium">Trending Now</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                    onClick={() => handleArticleClick(article)}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3
                    className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer transition-colors duration-200 line-clamp-2"
                    onClick={() => handleArticleClick(article)}
                  >
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{article.readTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{article.views}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareClick(article);
                        }}
                        className="hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 ">
                      <span className="hidden md:inline">
                        By {article.author}
                      </span>
                      <span className=" hidden md:inline mx-2">•</span>
                      <span>{article.publishedAt}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-gray-500">
                        {/* <MessageCircle className="h-4 w-4" />
                                                    <span className="text-sm">{article.comments}</span> */}
                      </div>
                      
                      {/* Star button that works for all users */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeArticle(article.id);
                        }}
                        className={`transition-colors duration-200 cursor-pointer ${
                          likedArticles.has(article.id)
                            ? "text-red-500 hover:text-red-600"
                            : "text-gray-500 hover:text-red-500"
                        }`}
                      >
                        <div className="flex items-center space-x-1">
                          <Star
                            className={`h-4 w-4 ${
                              likedArticles.has(article.id)
                                ? "fill-current text-red-500"
                                : ""
                            }`}
                          />
                          <span className="text-sm">
                            {article.likes +
                              (likedArticles.has(article.id) ? 1 : 0)}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No articles found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </section>
      )}

      {/* Trending Topics Section */}
      <section id="trending" className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {" "}
              Trending Now
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Hot topics and breaking news that everyone's talking about
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-red-500">
              <div className="flex items-center space-x-2 md:space-x-3 mb-3">
                <span className="bg-red-100 text-red-600 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                  #1
                </span>
                <span className="text-xs md:text-sm text-gray-500">
                  AI Revolution
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">
                Machine Learning Breakthrough
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">
                15.2K discussions
              </p>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-orange-500">
              <div className="flex items-center space-x-2 md:space-x-3 mb-3">
                <span className="bg-orange-100 text-orange-600 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                  #2
                </span>
                <span className="text-xs md:text-sm text-gray-500">
                  Quantum Tech
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">
                1000-Qubit Processor
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">
                12.8K discussions
              </p>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-yellow-500">
              <div className="flex items-center space-x-2 md:space-x-3 mb-3">
                <span className="bg-yellow-100 text-yellow-600 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                  #3
                </span>
                <span className="text-xs md:text-sm text-gray-500">
                  Cybersecurity
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">
                Cloud Vulnerabilities
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">
                10.5K discussions
              </p>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-green-500">
              <div className="flex items-center space-x-2 md:space-x-3 mb-3">
                <span className="bg-green-100 text-green-600 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                  #4
                </span>
                <span className="text-xs md:text-sm text-gray-500">
                  6G Networks
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">
                Ultra-Fast Internet
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">
                9.2K discussions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Insights Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              📊 Tech by the Numbers
            </h2>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Key statistics shaping the technology landscape
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center text-white">
              <div className=" bg-white/50 bg-opacity-20 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:bg-opacity-30 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold mb-2">50B+</div>
                <div className="text-base md:text-lg font-medium mb-1">
                  IoT Devices
                </div>
                <div className="text-sm opacity-80">Connected by 2025</div>
              </div>
            </div>

            <div className="text-center text-white">
              <div className="bg-white/50 bg-opacity-20 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:bg-opacity-30 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold mb-2">$2T</div>
                <div className="text-base md:text-lg font-medium mb-1">
                  AI Market
                </div>
                <div className="text-sm opacity-80">Global value by 2030</div>
              </div>
            </div>

            <div className="text-center text-white">
              <div className="bg-white/50 bg-opacity-20 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:bg-opacity-30 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold mb-2">100x</div>
                <div className="text-base md:text-lg font-medium mb-1">
                  6G Speed
                </div>
                <div className="text-sm opacity-80">Faster than 5G</div>
              </div>
            </div>

            <div className="text-center text-white">
              <div className="bg-white/50 bg-opacity-20 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:bg-opacity-30 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold mb-2">95%</div>
                <div className="text-base md:text-lg font-medium mb-1">
                  Cloud Adoption
                </div>
                <div className="text-sm opacity-80">By enterprises</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video & Media Section */}
      <section id="videos" className="py-12 md:py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              🎥 Tech Videos & Media
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Watch the latest tech demos, interviews, and breakthrough
              announcements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div
              className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() =>
                window.open(
                  "https://www.youtube.com/",
                  "_blank"
                )
              }
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=225&fit=crop"
                  alt="AI Demo"
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center">
                  <div className="bg-red-600 rounded-full p-3 md:p-4 hover:bg-red-700 transition-colors duration-200 cursor-pointer">
                    <Play className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                </div>
                <div className="absolute top-3 md:top-4 right-3 md:right-4 bg-red-600 text-white px-2 py-1 rounded text-xs md:text-sm font-bold">
                  LIVE
                </div>
              </div>
              <div className="p-4 md:p-6">
                <h3 className="font-bold text-base md:text-lg mb-2">
                  The Future of AI: ChatGPT and Beyond
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  Revolutionary AI technology demonstration and analysis
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 ">
                  <span>12:34</span>
                  <span>•</span>
                  <span>2.1M views</span>
                  <span className="hidden md:inline">•</span>
                  <span className="text-red-500 hidden md:inline">
                    🔴 YouTube
                  </span>
                </div>
              </div>
            </div>

            <div
              className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() =>
                window.open(
                  "https://www.youtube.com/",
                  "_blank"
                )
              }
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=225&fit=crop"
                  alt="Tech Interview"
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center">
                  <div className="bg-red-600 rounded-full p-3 md:p-4 hover:bg-red-700 transition-colors duration-200 cursor-pointer">
                    <Play className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-4 md:p-6">
                <h3 className="font-bold text-base md:text-lg mb-2">
                  Tesla CEO on Future of Technology
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  Exclusive interview with tech industry leaders
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>28:15</span>
                  <span>•</span>
                  <span>1.8M views</span>
                  <span className="hidden md:inline">•</span>
                  <span className="text-red-500 hidden md:inline">
                    🔴 YouTube
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden">
              <div
                className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() =>
                  window.open(
                    "https://www.youtube.com/",
                    "_blank"
                  )
                }
              >
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=225&fit=crop"
                    alt="AI Demo"
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center">
                    <div className="bg-red-600 rounded-full p-3 md:p-4 hover:bg-red-700 transition-colors duration-200 cursor-pointer">
                      <Play className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute top-3 md:top-4 right-3 md:right-4 bg-red-600 text-white px-2 py-1 rounded text-xs md:text-sm font-bold">
                    LIVE
                  </div>
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="font-bold text-base md:text-lg mb-2">
                    The Future of AI: ChatGPT and Beyond
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Revolutionary AI technology demonstration and analysis
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 ">
                    <span>12:34</span>
                    <span>•</span>
                    <span>2.1M views</span>
                    <span className="hidden md:inline">•</span>
                    <span className="text-red-500 hidden md:inline">
                      🔴 YouTube
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() =>
                  window.open(
                    "https://www.youtube.com/",
                    "_blank"
                  )
                }
              >
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=225&fit=crop"
                    alt="AI Demo"
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center">
                    <div className="bg-red-600 rounded-full p-3 md:p-4 hover:bg-red-700 transition-colors duration-200 cursor-pointer">
                      <Play className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute top-3 md:top-4 right-3 md:right-4 bg-red-600 text-white px-2 py-1 rounded text-xs md:text-sm font-bold">
                    LIVE
                  </div>
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="font-bold text-base md:text-lg mb-2">
                    The Future of AI: ChatGPT and Beyond
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Revolutionary AI technology demonstration and analysis
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 ">
                    <span>12:34</span>
                    <span>•</span>
                    <span>2.1M views</span>
                    <span className="hidden md:inline">•</span>
                    <span className="text-red-500 hidden md:inline">
                      🔴 YouTube
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() =>
                  window.open(
                    "https://www.youtube.com/",
                    "_blank"
                  )
                }
              >
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=225&fit=crop"
                    alt="AI Demo"
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center">
                    <div className="bg-red-600 rounded-full p-3 md:p-4 hover:bg-red-700 transition-colors duration-200 cursor-pointer">
                      <Play className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute top-3 md:top-4 right-3 md:right-4 bg-red-600 text-white px-2 py-1 rounded text-xs md:text-sm font-bold">
                    LIVE
                  </div>
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="font-bold text-base md:text-lg mb-2">
                    The Future of AI: ChatGPT and Beyond
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Revolutionary AI technology demonstration and analysis
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 ">
                    <span>12:34</span>
                    <span>•</span>
                    <span>2.1M views</span>
                    <span className="hidden md:inline">•</span>
                    <span className="text-red-500 hidden md:inline">
                      🔴 YouTube
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() =>
                window.open(
                  "https://www.youtube.com/",
                  "_blank"
                )
              }
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop"
                  alt="Product Launch"
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center">
                  <div className="bg-red-600 rounded-full p-3 md:p-4 hover:bg-red-700 transition-colors duration-200 cursor-pointer">
                    <Play className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                </div>
                <div className="absolute top-3 md:top-4 right-3 md:right-4 bg-yellow-600 text-black px-2 py-1 rounded text-xs md:text-sm font-bold">
                  NEW
                </div>
              </div>
              <div className="p-4 md:p-6">
                <h3 className="font-bold text-base md:text-lg mb-2">
                  Apple Vision Pro Launch Event
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  Revolutionary mixed reality technology announcement
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>1:15:42</span>
                  <span>•</span>
                  <span>5.2M views</span>
                  <span className="hidden md:inline">•</span>
                  <span className="text-red-500 hidden md:inline">
                    🔴 YouTube
                  </span>
                </div>
              </div>
            </div>

            <div
              className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() =>
                window.open(
                  "https://www.youtube.com/",
                  "_blank"
                )
              }
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop"
                  alt="Neural Networks"
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center">
                  <div className="bg-red-600 rounded-full p-3 md:p-4 hover:bg-red-700 transition-colors duration-200 cursor-pointer">
                    <Play className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-4 md:p-6">
                <h3 className="font-bold text-base md:text-lg mb-2">
                  How Neural Networks Really Work
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  Deep dive into machine learning fundamentals
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>19:13</span>
                  <span>•</span>
                  <span>3.4M views</span>
                  <span className="hidden md:inline">•</span>
                  <span className="text-red-500 hidden md:inline">
                    🔴 YouTube
                  </span>
                </div>
              </div>
            </div>

            <div
              className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() =>
                window.open(
                  "https://www.youtube.com/",
                  "_blank"
                )
              }
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop"
                  alt="Quantum Computing"
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center">
                  <div className="bg-red-600 rounded-full p-3 md:p-4 hover:bg-red-700 transition-colors duration-200 cursor-pointer">
                    <Play className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                </div>
                <div className="absolute top-3 md:top-4 right-3 md:right-4 bg-purple-600 text-white px-2 py-1 rounded text-xs md:text-sm font-bold">
                  TECH
                </div>
              </div>
              <div className="p-4 md:p-6">
                <h3 className="font-bold text-base md:text-lg mb-2">
                  Quantum Computing Explained
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  Understanding the future of computational power
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>22:47</span>
                  <span>•</span>
                  <span>1.2M views</span>
                  <span className="hidden md:inline">•</span>
                  <span className="text-red-500 hidden md:inline">
                    🔴 YouTube
                  </span>
                </div>
              </div>
            </div>

            <div
              className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() =>
                window.open(
                  "https://www.youtube.com/",
                  "_blank"
                )
              }
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=225&fit=crop"
                  alt="Cybersecurity"
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center">
                  <div className="bg-red-600 rounded-full p-3 md:p-4 hover:bg-red-700 transition-colors duration-200 cursor-pointer">
                    <Play className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                </div>
                <div className="absolute top-3 md:top-4 right-3 md:right-4 bg-red-600 text-white px-2 py-1 rounded text-xs md:text-sm font-bold">
                  ALERT
                </div>
              </div>
              <div className="p-4 md:p-6">
                <h3 className="font-bold text-base md:text-lg mb-2">
                  Cybersecurity in the AI Age
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  Protecting against next-generation cyber threats
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>35:12</span>
                  <span>•</span>
                  <span>892K views</span>
                  <span className="hidden md:inline">•</span>
                  <span className="text-red-500 hidden md:inline">
                    🔴 YouTube
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section
        id="newsletter"
        className="bg-gradient-to-r from-blue-600 to-purple-600"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Stay in the Loop
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-6 md:mb-8 max-w-2xl mx-auto">
              Get the latest tech news and insights delivered straight to your
              inbox
            </p>

            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <input
                  type="email"
                  value={newsletterForm.email}
                  onChange={(e) =>
                    setNewsletterForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="Enter your email"
                  className="flex-1 bg-white px-4 md:px-6 py-3 md:py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 text-sm md:text-base"
                />
                <button
                  onClick={handleNewsletterSubmit}
                  className="bg-white text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-full hover:bg-gray-100 transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-sm md:text-base cursor-pointer"
                >
                  Subscribe
                </button>
              </div>
              {newsletterError && (
                <p className="text-red-200 text-sm mt-2">{newsletterError}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">TechPulse</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your premier source for technology news, insights, and analysis.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 cursor-pointer transition-colors duration-200">
                  <span className="text-sm" onClick={() => window.open("https://www.facebook.com/")}>f</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 cursor-pointer transition-colors duration-200">
                  <span className="text-sm" onClick={() => window.open("https://www.twitter.com/")}>t</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 cursor-pointer transition-colors duration-200">
                  <span className="text-sm" onClick={() => window.open("https://www.linkedin.com/")}>in</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    Artificial Intelligence
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    Blockchain
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    Cybersecurity
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    Mobile Technology
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    Our Team
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 TechPulse. All rights reserved. Built with
              cutting-edge technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TechPulse;

// Zod Schema
export const Schema = {
    "commentary": "Tech News Website Interface",
    "template": "nextjs-developer",
    "title": "Tech News",
    "description": "A tech news website interface built with Next.js and TypeScript",
    "additional_dependencies": ["lucide-react"],
    "has_additional_dependencies": true,
    "install_dependencies_command": "npm install lucide-react",
    "port": 3000,
    "file_path": "pages/index.tsx",
    "code": "<see code above>"
}
"use client";

import { useState, useEffect, useRef } from "react";
import { Montserrat} from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Moon,
  Sun,
  MessageSquare,
  Menu,
  X,
  ChevronRight,
  ArrowUp,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Copy,
  CheckCircle2,
} from "lucide-react";

const monsterrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const themes = {
  light: {
    primary: "#8000ff",
    primaryHover: "#6a00d6",
    primaryLight: "#e0d0ff",
    secondary: "#f3f4f6",
    background: "#ffffff",
    secondaryBackground: "#f9fafb",
    cardBackground: "#f8fafc",
    cardBorder: "#e2e8f0",
    text: "#111827",
    secondaryText: "#4b5563",
    tertiaryText: "#9ca3af",
    border: "#e5e7eb",
    borderHover: "#d1d5db",
    hover: "#f3f4f6",
    hoverStrong: "#e5e7eb",
    shadow: "rgba(0, 0, 0, 0.05)",
    shadowStrong: "rgba(0, 0, 0, 0.1)",
    accent1: "#3b82f6",
    accent2: "#10b981",
    accent3: "#f97316",
    accent4: "#8b5cf6",
  },
  dark: {
    primary: "#a855f7",
    primaryHover: "#9333ea",
    primaryLight: "#44337a",
    secondary: "#2d3748",
    background: "#111827",
    secondaryBackground: "#1f2937",
    cardBackground: "#1f2937",
    cardBorder: "#374151",
    text: "#f9fafb",
    secondaryText: "#d1d5db",
    tertiaryText: "#9ca3af",
    border: "#374151",
    borderHover: "#4b5563",
    hover: "#2d3748",
    hoverStrong: "#374151",
    shadow: "rgba(0, 0, 0, 0.3)",
    shadowStrong: "rgba(0, 0, 0, 0.5)",
    accent1: "#3b82f6",
    accent2: "#10b981",
    accent3: "#f97316",
    accent4: "#8b5cf6",
  },
};

interface Citation {
  id: string;
  title: string;
  url: string;
  source: string;
}

interface Conversation {
  id: string;
  query: string;
  answer: string;
  citations: Citation[];
  followUpQuestions: string[];
  time: string;
  threadId: string;
}

interface Thread {
  id: string;
  title: string;
  time: string;
  conversations: Conversation[];
}

const initialThreads: Thread[] = [
  {
    id: "thread-1",
    title: "What is quantum computing?",
    time: "Yesterday",
    conversations: [
      {
        id: "conv-1-1",
        threadId: "thread-1",
        query: "What is quantum computing?",
        answer:
          "Quantum computing is a type of computing that uses quantum phenomena such as superposition and entanglement to perform operations on data. Unlike classical computers that use bits (0s and 1s), quantum computers use quantum bits or qubits, which can exist in multiple states simultaneously due to superposition. This allows quantum computers to process vast amounts of information simultaneously, potentially solving certain complex problems much faster than classical computers.",
        citations: [
          {
            id: "qc-citation-1",
            title: "Principles of Quantum Computing",
            url: "https://example.com/quantum-principles",
            source: "Journal of Quantum Physics",
          },
          {
            id: "qc-citation-2",
            title: "Quantum Computing: A New Era of Processing",
            url: "https://example.com/quantum-new-era",
            source: "Tech Innovations Quarterly",
          },
          {
            id: "qc-citation-3",
            title: "Applications of Quantum Computing",
            url: "https://example.com/quantum-applications",
            source: "International Conference on Computing",
          },
        ],
        followUpQuestions: [
          "What are the practical applications of quantum computing?",
          "How does quantum entanglement work?",
          "When will quantum computers become mainstream?",
        ],
        time: "Yesterday",
      },
      {
        id: "conv-1-2",
        threadId: "thread-1",
        query: "What are the practical applications of quantum computing?",
        answer:
          "Practical applications of quantum computing include cryptography, where quantum computers could potentially break current encryption methods but also enable more secure quantum encryption. In pharmaceuticals, quantum computers can simulate molecular structures to accelerate drug discovery. For optimization problems, they can find optimal solutions for complex logistics, financial modeling, and traffic routing. Quantum machine learning algorithms could process vast datasets more efficiently than classical computers. While many of these applications are still theoretical or in early stages, companies like IBM, Google, and D-Wave are making progress toward practical quantum computing solutions.",
        citations: [
          {
            id: "qc-app-citation-1",
            title: "Commercial Applications of Quantum Computing",
            url: "https://example.com/quantum-commercial",
            source: "Business Technology Review",
          },
          {
            id: "qc-app-citation-2",
            title: "Quantum Computing in Drug Discovery",
            url: "https://example.com/quantum-pharma",
            source: "Journal of Computational Chemistry",
          },
        ],
        followUpQuestions: [
          "How are quantum computers being used in finance?",
          "What quantum computing breakthroughs happened recently?",
          "How do quantum computers compare to supercomputers?",
        ],
        time: "Yesterday",
      },
    ],
  },
  {
    id: "thread-2",
    title: "How does GPT-4 work?",
    time: "2 days ago",
    conversations: [
      {
        id: "conv-2-1",
        threadId: "thread-2",
        query: "How does GPT-4 work?",
        answer:
          "GPT-4 is a large language model based on transformer architecture. It works by processing text using attention mechanisms that analyze relationships between words in a sequence. The model is trained on vast amounts of text data using a process called unsupervised learning, where it learns to predict the next word in a sequence based on context. GPT-4 has more parameters and refined training procedures compared to its predecessors, allowing it to generate more coherent, contextually appropriate, and human-like text responses.",
        citations: [
          {
            id: "gpt-citation-1",
            title: "Understanding GPT-4 Architecture",
            url: "https://example.com/gpt4-architecture",
            source: "AI Research Journal",
          },
          {
            id: "gpt-citation-2",
            title: "Evolution of Large Language Models",
            url: "https://example.com/llm-evolution",
            source: "Machine Learning Today",
          },
          {
            id: "gpt-citation-3",
            title: "GPT-4 vs Previous Generations",
            url: "https://example.com/gpt-comparison",
            source: "OpenAI Publications",
          },
        ],
        followUpQuestions: [
          "What are the limitations of GPT-4?",
          "How is GPT-4 different from GPT-3?",
          "What ethical concerns surround large language models?",
        ],
        time: "2 days ago",
      },
    ],
  },
  {
    id: "thread-3",
    title: "Best programming languages to learn in 2023",
    time: "3 days ago",
    conversations: [
      {
        id: "conv-3-1",
        threadId: "thread-3",
        query: "Best programming languages to learn in 2023",
        answer:
          "The best programming languages to learn in 2023 include Python, JavaScript, and Rust. Python remains extremely popular due to its simplicity, versatility, and strong presence in data science, machine learning, and back-end development. JavaScript continues to dominate web development, with frameworks like React, Angular, and Vue making it essential for front-end developers. Rust is gaining significant traction for systems programming due to its performance and memory safety features. Other notable mentions include TypeScript, Go, and Swift, each valuable in specific domains like type-safe web development, cloud services, and iOS development respectively.",
        citations: [
          {
            id: "prog-citation-1",
            title: "Programming Language Trends 2023",
            url: "https://example.com/prog-trends-2023",
            source: "Developer Insights Magazine",
          },
          {
            id: "prog-citation-2",
            title: "Industry Demand for Programming Skills",
            url: "https://example.com/prog-industry-demand",
            source: "TechHire Quarterly",
          },
          {
            id: "prog-citation-3",
            title: "Learning Curve Analysis: Top Programming Languages",
            url: "https://example.com/prog-learning-curve",
            source: "Educational Technology Review",
          },
        ],
        followUpQuestions: [
          "Which programming language is best for beginners?",
          "What programming languages pay the highest salaries?",
          "How long does it take to become proficient in Python?",
        ],
        time: "3 days ago",
      },
    ],
  },
];

const generateMockAnswer = (query: string, threadId: string): Conversation => {
  const randomId = Math.floor(Math.random() * 10000);

  return {
    id: `conv-${randomId}`,
    threadId,
    query,
    answer: `${query} is a fascinating topic that spans multiple disciplines. The key aspects include advanced algorithms, data structures, and theoretical foundations that make it particularly relevant in today's technological landscape. Research in this field has expanded significantly in recent years, with major contributions from leading academic institutions and industry research labs.

Recent studies have shown that applications of ${query.toLowerCase()} have revolutionized approaches in machine learning, data analysis, and computational systems. The integration with existing technologies has created new opportunities for innovation and problem-solving across various domains.`,
    citations: [
      {
        id: `citation-${randomId}-1`,
        title: `The Complete Guide to ${query}`,
        url: "https://example.com/research-paper-1",
        source: "Journal of Computer Science",
      },
      {
        id: `citation-${randomId}-2`,
        title: `Understanding ${query}: A Comprehensive Analysis`,
        url: "https://example.com/research-paper-2",
        source: "Tech Innovations Quarterly",
      },
      {
        id: `citation-${randomId}-3`,
        title: `Future Directions in ${query} Research`,
        url: "https://example.com/research-paper-3",
        source: "International Conference on Computing",
      },
    ],
    followUpQuestions: [
      `What are the practical applications of ${query}?`,
      `How is ${query} expected to evolve in the next decade?`,
      `What are the limitations of current ${query} technologies?`,
    ],
    time: "Just now",
  };
};

const Toast = ({
  message,
  visible,
  onClose,
}: {
  message: string;
  visible: boolean;
  onClose: () => void;
}) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-5 py-4 rounded-lg shadow-lg flex items-center gap-3"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            color: "white",
            backdropFilter: "blur(8px)",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
          }}
        >
          <CheckCircle2 size={20} className="text-green-400" />
          <span className="font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [isSearching, setIsSearching] = useState(false);
  const [theme, setTheme] = useState(themes.light);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [feedbackState, setFeedbackState] = useState<
    Record<string, "like" | "dislike" | null>
  >({});
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTheme(isDarkMode ? themes.dark : themes.light);
  }, [isDarkMode]);

  useEffect(() => {
    setIsLargeScreen(window.innerWidth >= 1024);

    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showToast = (message: string) => {
    setToast({ visible: true, message });
  };

  const closeToast = () => {
    setToast({ visible: false, message: "" });
  };

  const createNewThread = (initialQuery: string) => {
    setIsSearching(true);

    const threadId = `thread-${Date.now()}`;

    setTimeout(() => {
      const conversation = generateMockAnswer(initialQuery, threadId);

      const newThread: Thread = {
        id: threadId,
        title: initialQuery,
        time: "Just now",
        conversations: [conversation],
      };

      setThreads((prev) => [newThread, ...prev]);

      setActiveThread(newThread);

      setQuery("");
      setIsSearching(false);

      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 100);
    }, 800);
  };

  const addConversationToThread = (threadId: string, questionText: string) => {
    setIsSearching(true);

    setTimeout(() => {
      const newConversation = generateMockAnswer(questionText, threadId);

      setThreads((prevThreads) => {
        return prevThreads.map((thread) => {
          if (thread.id === threadId) {
            const updatedThread = {
              ...thread,
              conversations: [...thread.conversations, newConversation],
            };

            setActiveThread(updatedThread);

            return updatedThread;
          }
          return thread;
        });
      });

      setQuery("");
      setIsSearching(false);

      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 100);
    }, 800);
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    if (activeThread) {
      addConversationToThread(activeThread.id, query);
    } else {
      createNewThread(query);
    }
  };

  const handleThreadClick = (threadId: string) => {
    const thread = threads.find((t) => t.id === threadId);
    if (thread) {
      setActiveThread(thread);
      setSidebarOpen(false);
    }
  };

  const handleFollowUpQuestion = (question: string) => {
    if (activeThread) {
      addConversationToThread(activeThread.id, question);
    }
  };

  const handleNewChat = () => {
    setActiveThread(null);
    setSidebarOpen(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard");
  };

  const handleFeedback = (conversationId: string, type: "like" | "dislike") => {
    setFeedbackState((prev) => {
      if (prev[conversationId] === type) {
        return { ...prev, [conversationId]: null };
      }
      return { ...prev, [conversationId]: type };
    });

    showToast(
      type === "like"
        ? "Thanks for your positive feedback!"
        : "Thanks for your feedback"
    );
  };

  return (
    <div
      className={`${monsterrat.variable} font-sans min-h-screen h-screen flex flex-col`}
      style={{
        backgroundColor: theme.background,
        color: theme.text,
      }}
    >
      <header
        className="lg:hidden flex items-center justify-between p-4 border-b"
        style={{ borderColor: theme.border }}
      >
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-full hover:bg-opacity-40 active:bg-opacity-60 transition-all duration-200 cursor-pointer"
          style={{
            backgroundColor: sidebarOpen ? theme.hover : "transparent",
            color: theme.text,
          }}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: theme.primary }}>
          Perplexity
        </h1>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-full hover:bg-opacity-40 active:bg-opacity-60 transition-all duration-200 cursor-pointer"
          style={{ backgroundColor: "transparent" }}
        >
          {isDarkMode ? (
            <Sun size={24} color={theme.text} />
          ) : (
            <Moon size={24} color={theme.text} />
          )}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden h-[calc(100%-5rem)] lg:h-full">
        <AnimatePresence>
          {(sidebarOpen || isLargeScreen) && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed lg:relative z-40 w-[300px] border-r overflow-hidden flex flex-col"
              style={{
                backgroundColor: theme.secondaryBackground,
                borderColor: theme.border,
                top: 0,
                height: '100vh',
                left: 0,
                boxShadow: isDarkMode ? "none" : "2px 0 8px rgba(0,0,0,0.05)",
              }}
            >
              <div
                className="flex items-center justify-between p-4 border-b"
                style={{ 
                  borderColor: theme.border,
                  backgroundColor: isLargeScreen ? 'transparent' : theme.secondaryBackground,
                  position: isLargeScreen ? 'relative' : 'sticky',
                  top: 0,
                  zIndex: 10
                }}
              >
                <div className="flex items-center gap-2">
                  <h1
                    className="text-xl font-bold"
                    style={{ color: theme.primary }}
                  >
                    Perplexity
                  </h1>
                </div>
                <button
                  className="lg:hidden p-2 rounded-full hover:bg-opacity-40 active:bg-opacity-60 transition-all duration-200 cursor-pointer"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X size={24} color={theme.text} />
                </button>
              </div>

              <div
                className="p-4 border-b"
                style={{ borderColor: theme.border }}
              >
                <button
                  className="w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer hover:shadow-md"
                  style={{
                    backgroundColor: theme.secondary,
                    color: theme.primary,
                    border: `1px solid ${theme.border}`,
                  }}
                  onClick={handleNewChat}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare size={18} />
                    <span className="font-medium">New Chat</span>
                  </div>
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="p-4 pb-24">
                  <h2
                    className="text-sm font-medium mb-2"
                    style={{ color: theme.secondaryText }}
                  >
                    Chat History
                  </h2>
                  {threads.map((thread) => (
                    <motion.div
                      key={thread.id}
                      className="p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 hover:shadow-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        backgroundColor:
                          activeThread?.id === thread.id
                            ? theme.hover
                            : "transparent",
                        borderLeft:
                          activeThread?.id === thread.id
                            ? `3px solid ${theme.primary}`
                            : "3px solid transparent",
                      }}
                      onClick={() => handleThreadClick(thread.id)}
                    >
                      <p className="font-medium truncate">{thread.title}</p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: theme.secondaryText }}
                      >
                        {thread.time}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div
                className="mt-auto border-t flex items-center justify-between sticky bottom-0"
                style={{ 
                  borderColor: theme.border,
                  backgroundColor: theme.secondaryBackground,
                  boxShadow: `0 -2px 10px ${theme.shadow}`,
                  display: isLargeScreen ? 'flex' : 'none',
                  padding: '16px',
                  height: '78px'
                }}
              >
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-full hover:bg-opacity-40 active:bg-opacity-60 transition-all duration-200 cursor-pointer flex items-center justify-center"
                  style={{ 
                    backgroundColor: "transparent",
                    width: '36px',
                    height: '36px'
                  }}
                >
                  {isDarkMode ? (
                    <Sun size={24} color={theme.text} />
                  ) : (
                    <Moon size={24} color={theme.text} />
                  )}
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 cursor-pointer backdrop-blur-sm"
            style={{
              backdropFilter: 'blur(4px)'
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 flex flex-col h-full overflow-hidden">
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth"
            style={{
              height: "calc(100% - 4rem)",
              backgroundColor: theme.background,
            }}
          >
            <div className="max-w-3xl mx-auto">
              {!activeThread ? (
                <motion.div
                  className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] lg:min-h-[calc(100vh-12rem)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className="w-20 h-20 mb-6 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent4})`,
                      boxShadow: `0 10px 25px -5px ${theme.shadowStrong}`,
                    }}
                  >
                    <Search size={32} color="white" />
                  </div>
                  <h1
                    className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(90deg, ${theme.primary}, ${theme.accent4})`,
                    }}
                  >
                    Discover knowledge with AI
                  </h1>
                  <p
                    className="text-center mb-10 text-lg"
                    style={{ color: theme.secondaryText }}
                  >
                    Ask any question to get instant, cited answers.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    {[
                      "How do quantum computers work?",
                      "What are the latest AI breakthroughs?",
                      "Explain the multiverse theory",
                    ].map((suggestion, i) => (
                      <motion.button
                        key={i}
                        className="p-4 rounded-lg text-left transition-all duration-200 cursor-pointer hover:shadow-md"
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          backgroundColor: theme.secondaryBackground,
                          border: `1px solid ${theme.border}`,
                          boxShadow: `0 2px 5px ${theme.shadow}`,
                        }}
                        onClick={() => createNewThread(suggestion)}
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                activeThread.conversations.map((conversation, index) => (
                  <motion.div
                    key={conversation.id}
                    className="mb-12 last:mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="mb-4">
                      <h2 className="text-lg font-semibold mb-2">
                        {conversation.query}
                      </h2>
                      <div
                        className="text-xs"
                        style={{ color: theme.secondaryText }}
                      >
                        {conversation.time}
                      </div>
                    </div>

                    <div
                      className="rounded-lg p-6 transition-all duration-300"
                      style={{
                        backgroundColor: theme.cardBackground,
                        border: `1px solid ${theme.cardBorder}`,
                        boxShadow: `0 4px 12px ${theme.shadow}`,
                      }}
                    >
                      <div
                        className={`${monsterrat.variable} font-serif leading-relaxed`}
                      >
                        {conversation.answer}
                      </div>

                      <div
                        className="mt-6 pt-4 border-t"
                        style={{ borderColor: theme.border }}
                      >
                        <h3 className="text-sm font-semibold mb-3">Sources</h3>
                        <div className="grid grid-cols-1 gap-2">
                          {conversation.citations.map((citation) => (
                            <motion.a
                              key={citation.id}
                              href={citation.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center p-3 rounded-lg transition-all duration-200 cursor-pointer"
                              whileHover={{
                                scale: 1.01,
                                backgroundColor: theme.hover,
                              }}
                              style={{
                                backgroundColor: "transparent",
                                color: theme.text,
                                border: `1px solid transparent`,
                              }}
                            >
                              <div className="flex-1">
                                <p className="font-medium">{citation.title}</p>
                                <p
                                  className="text-xs"
                                  style={{ color: theme.secondaryText }}
                                >
                                  {citation.source}
                                </p>
                              </div>
                              <ExternalLink
                                size={16}
                                style={{ color: theme.primary }}
                              />
                            </motion.a>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="text-sm font-semibold mb-3">
                          Follow-up questions
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {conversation.followUpQuestions.map(
                            (question, idx) => (
                              <motion.button
                                key={idx}
                                className="py-2 px-4 rounded-full text-sm transition-all duration-200 cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                  backgroundColor: "transparent",
                                  border: `1px solid ${theme.border}`,
                                  color: theme.primary,
                                }}
                                onClick={() => handleFollowUpQuestion(question)}
                              >
                                {question}
                              </motion.button>
                            )
                          )}
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <motion.button
                            className="p-2 rounded-full transition-all duration-200 cursor-pointer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            style={{
                              backgroundColor:
                                feedbackState[conversation.id] === "like"
                                  ? theme.primaryLight
                                  : "transparent",
                              color:
                                feedbackState[conversation.id] === "like"
                                  ? theme.primary
                                  : theme.secondaryText,
                            }}
                            onClick={() =>
                              handleFeedback(conversation.id, "like")
                            }
                          >
                            {feedbackState[conversation.id] === "like" ? (
                              <ThumbsUp
                                size={18}
                                fill={theme.primary}
                                color={theme.primary}
                              />
                            ) : (
                              <ThumbsUp size={18} />
                            )}
                          </motion.button>
                          <motion.button
                            className="p-2 rounded-full transition-all duration-200 cursor-pointer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            style={{
                              backgroundColor:
                                feedbackState[conversation.id] === "dislike"
                                  ? theme.primaryLight
                                  : "transparent",
                              color:
                                feedbackState[conversation.id] === "dislike"
                                  ? theme.primary
                                  : theme.secondaryText,
                            }}
                            onClick={() =>
                              handleFeedback(conversation.id, "dislike")
                            }
                          >
                            {feedbackState[conversation.id] === "dislike" ? (
                              <ThumbsDown
                                size={18}
                                fill={theme.primary}
                                color={theme.primary}
                              />
                            ) : (
                              <ThumbsDown size={18} />
                            )}
                          </motion.button>
                        </div>
                        <motion.button
                          className="p-2 rounded-full transition-all duration-200 cursor-pointer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          style={{ backgroundColor: "transparent" }}
                          onClick={() => copyToClipboard(conversation.answer)}
                        >
                          <Copy
                            size={18}
                            style={{ color: theme.secondaryText }}
                          />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <div className="p-4 border-t" style={{ borderColor: theme.border }}>
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder={
                    activeThread ? "Ask a follow-up..." : "Ask anything..."
                  }
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full p-3 pl-10 pr-12 rounded-lg outline-none transition-colors cursor-text focus:shadow-md focus:border-primary"
                  style={{
                    backgroundColor: theme.secondaryBackground,
                    color: theme.text,
                    border: `1px solid ${theme.border}`,
                    boxShadow: `0 2px 5px ${theme.shadow}`,
                    height: '46px'
                  }}
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  size={18}
                  color={theme.secondaryText}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md transition-all duration-200 cursor-pointer ${
                    !query.trim() || isSearching
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  style={{
                    backgroundColor: theme.primary,
                    color: "white",
                    boxShadow: `0 2px 5px ${theme.shadowStrong}`,
                  }}
                  disabled={isSearching || !query.trim()}
                >
                  {isSearching ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <ArrowUp size={16} />
                  )}
                </motion.button>
              </form>
            </div>
          </div>
        </main>
      </div>

      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={closeToast}
      />
    </div>
  );
}
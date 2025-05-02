"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faker } from "@faker-js/faker";
import { Toaster, toast } from "sonner";

interface Reply {
  id: number;
  author: string;
  role: string;
  content: string;
  upvotes: number;
}

interface Question {
  id: number;
  title: string;
  author: string;
  role: string;
  content: string;
  upvotes: number;
  replies: Reply[];
}

interface Fundraiser {
  id: number;
  title: string;
  description: string;
  goal: number;
  raised: number;
  supporters: number;
}

interface UserData {
  name: string;
  email: string;
  role: string;
}

interface QuestionForm {
  title: string;
  content: string;
}

interface FundraiserForm {
  title: string;
  description: string;
  goal: number;
}

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("forum");
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [currentFundraiser, setCurrentFundraiser] = useState<Fundraiser | null>(null);
  const [donationAmount, setDonationAmount] = useState(25);

  const handleOpenDonate = (fundraiser: Fundraiser) => {
    setCurrentFundraiser(fundraiser);
    setShowDonateModal(true);
  };

  const handleDonateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentFundraiser) return;

    setFundraisers(
      fundraisers.map((f) =>
        f.id === currentFundraiser.id
          ? {
              ...f,
              raised: f.raised + Number(donationAmount),
              supporters: f.supporters + 1,
            }
          : f
      )
    );

    setShowDonateModal(false);
    setDonationAmount(25);

    toast.success(`Thank you for your $${donationAmount} donation!`);
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const replyInputRef = useRef<HTMLTextAreaElement>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    role: "",
  });

  const fundraisersRef = useRef<HTMLDivElement>(null);

  const [questionPage, setQuestionPage] = useState(1);
  const [fundraiserPage, setFundraiserPage] = useState(1);
  const itemsPerPage = 5;

  const [showModal, setShowModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showFundraiserModal, setShowFundraiserModal] = useState(false);
  const [registrationType, setRegistrationType] = useState("");

  const [questionForm, setQuestionForm] = useState<QuestionForm>({
    title: "",
    content: "",
  });

  const [fundraiserForm, setFundraiserForm] = useState<FundraiserForm>({
    title: "",
    description: "",
    goal: 5000,
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);

  const generateQuestions = (count: number): Question[] => {
    const roles = ["patient", "patient", "psychologist", "psychiatrist"];
    const questions: Question[] = [];

    for (let i = 0; i < count; i++) {
      const role = roles[Math.floor(Math.random() * roles.length)];
      const questionId = i + 1;
      const repliesCount = Math.floor(Math.random() * 4) + 1;
      const replies: Reply[] = [];

      for (let j = 0; j < repliesCount; j++) {
        const replyRole = roles[Math.floor(Math.random() * roles.length)];
        const replyId = questionId * 100 + j + 1;

        replies.push({
          id: replyId,
          author:
            replyRole === "patient"
              ? faker.internet.userName()
              : replyRole === "psychologist"
              ? `Dr. ${faker.person.lastName()}`
              : `Dr. ${faker.person.lastName()}, MD`,
          role: replyRole,
          content: faker.lorem.paragraph(),
          upvotes: Math.floor(Math.random() * 25),
        });
      }

      questions.push({
        id: questionId,
        title: faker.lorem.sentence().replace(".", "?"),
        author:
          role === "patient"
            ? faker.internet.userName()
            : role === "psychologist"
            ? `Dr. ${faker.person.lastName()}`
            : `Dr. ${faker.person.lastName()}, MD`,
        role: role,
        content: faker.lorem.paragraph(),
        upvotes: Math.floor(Math.random() * 50) + 5,
        replies: replies,
      });
    }

    return questions;
  };

  const generateFundraisers = (count: number, startId: number = 1): Fundraiser[] => {
    const fundraisers: Fundraiser[] = [];

    for (let i = 0; i < count; i++) {
      const goal = Math.floor(Math.random() * 15000) + 3000;
      const raised = Math.floor(Math.random() * goal);

      fundraisers.push({
        id: startId + i,
        title: faker.lorem.sentence().replace(".", ""),
        description: faker.lorem.paragraph(),
        goal: goal,
        raised: raised,
        supporters: Math.floor(Math.random() * 200) + 10,
      });
    }

    return fundraisers;
  };

  useEffect(() => {
    setQuestions(generateQuestions(5));
    setFundraisers(generateFundraisers(6, 1));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };
  const [upvotedQuestions, setUpvotedQuestions] = useState(new Set());
const [upvotedReplies, setUpvotedReplies] = useState(new Map());
  

  // Toggle functions
  // const toggleDarkMode = () => {
  //   setDarkMode(!darkMode);
  // };

  const upvoteQuestion = (id: number) => {
    if (upvotedQuestions.has(id)) {
      setQuestions(
        questions.map((q) => (q.id === id ? { ...q, upvotes: q.upvotes - 1 } : q))
      );
      
      // Update tracking state
      const updatedUpvotes = new Set(upvotedQuestions);
      updatedUpvotes.delete(id);
      setUpvotedQuestions(updatedUpvotes);
      
      toast.info("Upvote removed");
    } else {
      // Add upvote
      setQuestions(
        questions.map((q) => (q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q))
      );
      
      const updatedUpvotes = new Set(upvotedQuestions);
      updatedUpvotes.add(id);
      setUpvotedQuestions(updatedUpvotes);
      
      // Show feedback toast
      toast.success("Question upvoted");
    }
  };
  
  const upvoteReply = (questionId: number, replyId: number) => {
    const key = `${questionId}-${replyId}`;
    
    if (upvotedReplies.has(key)) {
      setQuestions(
        questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                replies: q.replies.map((r) =>
                  r.id === replyId ? { ...r, upvotes: r.upvotes - 1 } : r
                ),
              }
            : q
        )
      );
      
      const updatedUpvotes = new Map(upvotedReplies);
      updatedUpvotes.delete(key);
      setUpvotedReplies(updatedUpvotes);
      
      toast.info("Upvote removed");
    } else {
      setQuestions(
        questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                replies: q.replies.map((r) =>
                  r.id === replyId ? { ...r, upvotes: r.upvotes + 1 } : r
                ),
              }
            : q
        )
      );
      
      const updatedUpvotes = new Map(upvotedReplies);
      updatedUpvotes.set(key, true);
      setUpvotedReplies(updatedUpvotes);
      
      toast.success("Reply upvoted");
    }
  };

  // const upvoteReply = (questionId: number, replyId: number) => {
  //   setQuestions(
  //     questions.map((q) =>
  //       q.id === questionId
  //         ? {
  //             ...q,
  //             replies: q.replies.map((r) =>
  //               r.id === replyId ? { ...r, upvotes: r.upvotes + 1 } : r
  //             ),
  //           }
  //         : q
  //     )
  //   );
  // };

  const handleReplyClick = (questionId: number) => {
    setReplyingTo(replyingTo === questionId ? null : questionId);
    setReplyText("");

    setTimeout(() => {
      if (replyInputRef.current) {
        replyInputRef.current.focus();
      }
    }, 100);
  };

  const handleSubmitReply = (questionId: number, event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (replyText.trim() === "") return;

    const newReply: Reply = {
      id: Date.now(),
      author: userData.name || "You",
      role: userData.role.toLowerCase() || "patient",
      content: replyText,
      upvotes: 0,
    };

    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, replies: [...q.replies, newReply] } : q
      )
    );

    setReplyingTo(null);
    setReplyText("");
  };

  const sortedReplies = (
    replies: {
      id: number;
      author: string;
      role: string;
      content: string;
      upvotes: number;
    }[]
  ) => {
    // If logged in as psychologist or psychiatrist, put your reply at the very top
    if (
      isLoggedIn &&
      (userData.role.toLowerCase() === "psychologist" || userData.role.toLowerCase() === "psychiatrist")
    ) {
      const yourReplies = replies.filter(
        (r) => r.author === userData.name && r.role === userData.role.toLowerCase()
      );
      const otherReplies = replies.filter(
        (r) => !(r.author === userData.name && r.role === userData.role.toLowerCase())
      );
      // Sort other replies as before
      otherReplies.sort((a, b) => {
        if (
          (a.role === "psychologist" || a.role === "psychiatrist") &&
          b.role !== "psychologist" &&
          b.role !== "psychiatrist"
        ) {
          return -1;
        } else if (
          (b.role === "psychologist" || b.role === "psychiatrist") &&
          a.role !== "psychologist" &&
          a.role !== "psychiatrist"
        ) {
          return 1;
        }
        return b.upvotes - a.upvotes;
      });
      return [...yourReplies, ...otherReplies];
    }
    // Default sort
    return [...replies].sort((a, b) => {
      if (
        (a.role === "psychologist" || a.role === "psychiatrist") &&
        b.role !== "psychologist" &&
        b.role !== "psychiatrist"
      ) {
        return -1;
      } else if (
        (b.role === "psychologist" || b.role === "psychiatrist") &&
        a.role !== "psychologist" &&
        a.role !== "psychiatrist"
      ) {
        return 1;
      }
      return b.upvotes - a.upvotes;
    });
  };

  const getProgressColor = (raised: number, goal: number) => {
    const percentage = (raised / goal) * 100;
    if (percentage < 30) return "bg-amber-500";
    if (percentage < 75) return "bg-cyan-500";
    return "bg-emerald-500";
  };

  const scrollTOForum = () => {
    setActiveTab("forum");

    if (menuOpen) {
      setMenuOpen(false);
    }

    const contentSection = document.getElementById("content-section");
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToFundraisers = () => {
    setActiveTab("fundraisers");

    if (menuOpen) {
      setMenuOpen(false);
    }

    const contentSection = document.getElementById("content-section");
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleJoinCommunity = () => {
    setShowModal(true);
  };

  const handleRegistrationSelect = (type: string) => {
    setRegistrationType(type);
  };

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";

    setIsLoggedIn(true);
    setUserData({
      name,
      email,
      role: registrationType,
    });

    toast.success(
      `Thank you for registering as a ${registrationType}! You are now logged in.`
    );
    setShowModal(false);
    setRegistrationType("");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData({
      name: "",
      email: "",
      role: "",
    });
  };

  const handleRegisterButton = (type: string) => {
    setShowModal(true);
    setRegistrationType(type);
  };

  const handleQuestionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setQuestionForm({
      ...questionForm,
      [name]: value,
    });
  };

  const handleQuestionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newQuestion: Question = {
      id: Date.now(),
      title: questionForm.title,
      author: isLoggedIn ? userData.name : "Anonymous User",
      role: isLoggedIn ? userData.role.toLowerCase() : "patient",
      content: questionForm.content,
      upvotes: 0,
      replies: [],
    };

    setQuestions([newQuestion, ...questions]);

    setQuestionForm({
      title: "",
      content: "",
    });
    setShowQuestionModal(false);

    toast.success("Your question has been posted successfully!");
  };

  const handleFundraiserFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFundraiserForm({
      ...fundraiserForm,
      [name]: name === "goal" ? Number(value) : value,
    });
  };

  const handleFundraiserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newFundraiser: Fundraiser = {
      id: Date.now(),
      title: fundraiserForm.title,
      description: fundraiserForm.description,
      goal: fundraiserForm.goal,
      raised: 0,
      supporters: 0,
    };

    setFundraisers([newFundraiser, ...fundraisers]);

    setFundraiserForm({
      title: "",
      description: "",
      goal: 5000,
    });
    setShowFundraiserModal(false);

    toast.success("Your fundraiser has been created successfully!");
  };

  const loadMoreQuestions = () => {
    const newQuestions = generateQuestions(itemsPerPage);
    setQuestions([...questions, ...newQuestions]);
    setQuestionPage(questionPage + 1);
    
    toast.success(`Loaded ${itemsPerPage} more questions`);
  };

  const loadMoreFundraisers = () => {
    // Find the current max ID
    const maxId = fundraisers.length > 0 ? Math.max(...fundraisers.map(f => f.id)) : 0;
    const newFundraisers = generateFundraisers(itemsPerPage, maxId + 1);
    setFundraisers([...fundraisers, ...newFundraisers]);
    setFundraiserPage(fundraiserPage + 1);
    
    toast.success(`Loaded ${itemsPerPage} more fundraisers`);
  };

  const [showCardNumber, setShowCardNumber] = useState(false);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Toaster 
  position="top-right" 
  richColors
/>
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <div className="text-indigo-600 dark:text-indigo-400 font-bold text-2xl mr-2">
                MindConnect
              </div>
              <motion.div
                className="hidden md:flex space-x-1"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <span className="text-teal-500">⬤</span>
                <span className="text-purple-500">⬤</span>
                <span className="text-amber-500">⬤</span>
              </motion.div>
            </motion.div>

            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-700 dark:text-gray-200 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {menuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-2 rounded-md ${
                  activeTab === "forum"
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                    : "text-gray-600 dark:text-gray-300"
                }`}
                onClick={scrollTOForum}
              >
                Forum
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-2 rounded-md ${
                  activeTab === "fundraisers"
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                    : "text-gray-600 dark:text-gray-300"
                }`}
                onClick={scrollToFundraisers}
              >
                Fundraisers
              </motion.button>
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                Resources
              </motion.button> */}

              {/* User profile or login */}
              {isLoggedIn ? (
                <div className="flex items-center space-x-3 ml-4 border-l border-gray-200 dark:border-gray-600 pl-4">
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 
                      ${
                        userData.role === "Patient"
                          ? "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300"
                          : userData.role === "Psychologist"
                          ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300"
                          : userData.role === "Psychiatrist"
                          ? "bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300"
                          : "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300"
                      }`}
                    >
                      {userData.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:flex flex-col">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {userData.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {userData.role}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="text-sm px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300"
                  >
                    Logout
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleJoinCommunity}
                  className="ml-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-md shadow-md"
                >
                  Sign In
                </motion.button>
              )}

              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-2 ml-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                {darkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </motion.button> */}
            </nav>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-gray-800 shadow-inner"
            >
              <div className="px-4 py-3 space-y-2">
                {isLoggedIn && (
                  <div className="flex items-center py-2 border-b border-gray-200 dark:border-gray-700 mb-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3
                      ${
                        userData.role === "Patient"
                          ? "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300"
                          : userData.role === "Psychologist"
                          ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300"
                          : userData.role === "Psychiatrist"
                          ? "bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300"
                          : "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300"
                      }`}
                    >
                      {userData.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {userData.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {userData.role}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  className={`block w-full text-left px-3 py-2 rounded-md ${
                    activeTab === "forum"
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                  onClick={scrollTOForum}
                >
                  Forum
                </button>
                <button
                  className={`block w-full text-left px-3 py-2 rounded-md ${
                    activeTab === "fundraisers"
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                  onClick={scrollToFundraisers}
                >
                  Fundraisers
                </button>
                {/* <button
                  className="block w-full text-left px-3 py-2 rounded-md text-gray-600 dark:text-gray-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Resources
                </button> */}

                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 my-2 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300"
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleJoinCommunity();
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 my-2 bg-indigo-600 rounded-md text-white"
                  >
                    Sign In
                  </button>
                )}

                {/* <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-gray-600 dark:text-gray-300">
                    Dark Mode
                  </span>
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {darkMode ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      </svg>
                    )}
                  </button>
                </div> */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-800 dark:to-purple-900 text-white py-16 md:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-extrabold mb-4"
              >
                Your Mental Health <br className="hidden sm:block" />
                <span className="text-amber-300">Matters</span>
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl mb-8 text-indigo-100"
              >
                Connect with professionals and peers who understand. Share
                experiences, ask questions, and find support in a safe
                environment.
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                {!isLoggedIn && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleJoinCommunity}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 rounded-lg font-medium shadow-lg"
                  >
                    Join Our Community
                  </motion.button>
                )}
                {/* <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-medium"
                >
                  Learn More
                </motion.button> */}
              </motion.div>
            </div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              className="md:w-2/5 relative"
            >
              <div className="aspect-w-4 aspect-h-3 bg-indigo-200 dark:bg-indigo-900 rounded-2xl overflow-hidden shadow-2xl">
                <svg
                  className="w-full h-full text-indigo-500/30"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={0.5}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      {!isLoggedIn ? (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Join Our Community
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                Register based on your role and begin your journey with us.
                Whether you're seeking help or offering it, there's a place for
                you here.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="mb-4 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-200 dark:bg-purple-700 text-purple-600 dark:text-purple-300 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Patient
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Seek support, ask questions, and connect with others on
                    similar journeys
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRegisterButton("Patient")}
                  className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-md"
                >
                  Register as Patient
                </motion.button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-b from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="mb-4 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-200 dark:bg-indigo-700 text-indigo-600 dark:text-indigo-300 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Psychologist
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Offer therapeutic guidance and professional insights to
                    those in need
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRegisterButton("Psychologist")}
                  className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md"
                >
                  Register as Psychologist
                </motion.button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-b from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="mb-4 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-200 dark:bg-teal-700 text-teal-600 dark:text-teal-300 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Psychiatrist
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Provide medical expertise and psychiatric evaluation for
                    complex cases
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRegisterButton("Psychiatrist")}
                  className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-md"
                >
                  Register as Psychiatrist
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      ) : null}
      <main className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto" id="content-section">
          <AnimatePresence mode="wait">
            {activeTab === "forum" && (
              <motion.div
                key="forum"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Community Forum
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowQuestionModal(true)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium shadow-md"
                  >
                    Ask a Question
                  </motion.button>
                </div>

                <div className="space-y-6">
                  {questions.map((question) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              {question.title}
                            </h3>
                            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                              <span
                                className={`font-medium ${
                                  question.role === "psychologist"
                                    ? "text-indigo-600 dark:text-indigo-400"
                                    : question.role === "psychiatrist"
                                    ? "text-teal-600 dark:text-teal-400"
                                    : "text-gray-600 dark:text-gray-400"
                                }`}
                              >
                                {question.author}
                              </span>
                              <span className="mx-2">•</span>
                              <span className="capitalize">
                                {question.role}
                              </span>
                            </div>
                          </div>
<motion.button
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  onClick={() => upvoteQuestion(question.id)}
  className={`flex flex-col items-center rounded-md ${
    upvotedQuestions.has(question.id)
      ? "bg-indigo-100 dark:bg-indigo-800/50" 
      : "bg-gray-100 dark:bg-gray-700"
  } px-3 py-2`}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 ${
      upvotedQuestions.has(question.id)
        ? "text-indigo-600 dark:text-indigo-400" 
        : "text-gray-600 dark:text-gray-300"
    }`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 15l7-7 7 7"
    />
  </svg>
  <span className={`font-medium ${
    upvotedQuestions.has(question.id)
      ? "text-indigo-700 dark:text-indigo-300" 
      : "text-gray-800 dark:text-gray-200"
  }`}>
    {question.upvotes}
  </span>
</motion.button>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          {question.content}
                        </p>

                        <div className="mt-4 mb-3">
                          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            Replies ({question.replies.length})
                          </h4>
                        </div>

                        <div className="space-y-4">
                          {sortedReplies(question.replies).map((reply) => (
                            <div
                              key={reply.id}
                              className={`p-4 rounded-lg ${
                                reply.role === "psychologist" ||
                                reply.role === "psychiatrist"
                                  ? "bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-indigo-500"
                                  : "bg-gray-50 dark:bg-gray-700/50"
                              }`}
                            >
                              <div className="flex justify-between">
                                <div className="flex items-center mb-2">
                                  <span
                                    className={`font-medium ${
                                      reply.role === "psychologist"
                                        ? "text-indigo-600 dark:text-indigo-400"
                                        : reply.role === "psychiatrist"
                                        ? "text-teal-600 dark:text-teal-400"
                                        : "text-gray-700 dark:text-gray-300"
                                    }`}
                                  >
                                    {reply.author}
                                  </span>
                                  {/* Tag for current user's professional reply */}
                                  {isLoggedIn &&
                                    reply.author === userData.name &&
                                    (userData.role.toLowerCase() === "psychologist" || userData.role.toLowerCase() === "psychiatrist") &&
                                    reply.role === userData.role.toLowerCase() && (
                                      <span className="ml-2 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 text-xs rounded-full capitalize">
                                        You • {userData.role}
                                      </span>
                                    )}
                                  {(reply.role === "psychologist" || reply.role === "psychiatrist") &&
                                    // Only show the default tag if not the current user's professional reply
                                    (!(
                                      isLoggedIn &&
                                      reply.author === userData.name &&
                                      (userData.role.toLowerCase() === "psychologist" || userData.role.toLowerCase() === "psychiatrist") &&
                                      reply.role === userData.role.toLowerCase()
                                    )) && (
                                      <span className="ml-2 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 text-xs rounded-full capitalize">
                                        {reply.role}
                                      </span>
                                    )}
                                </div>
<motion.button
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  onClick={() => upvoteReply(question.id, reply.id)}
  className={`flex items-center space-x-1 ${
    upvotedReplies.has(`${question.id}-${reply.id}`)
      ? "text-indigo-600 dark:text-indigo-400" 
      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
  }`}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 15l7-7 7 7"
    />
  </svg>
  <span className="text-sm font-medium">{reply.upvotes}</span>
</motion.button>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300">
                                {reply.content}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Reply form */}
                        <div className="mt-6">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleReplyClick(question.id)}
                            className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                            {replyingTo === question.id
                              ? "Cancel reply"
                              : "Reply to this question"}
                          </motion.button>

                          <AnimatePresence>
                            {replyingTo === question.id && (
                              <motion.form
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                onSubmit={(e) =>
                                  handleSubmitReply(question.id, e)
                                }
                                className="mt-4"
                              >
                                <div className="mb-3">
                                  <textarea
                                    ref={replyInputRef}
                                    value={replyText}
                                    onChange={(e) =>
                                      setReplyText(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                                    placeholder="Write your reply here..."
                                    rows={4}
                                    required
                                  />
                                </div>
                                <div className="flex justify-end">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-md shadow-md"
                                  >
                                    Post Reply
                                  </motion.button>
                                </div>
                              </motion.form>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12 text-center">
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={loadMoreQuestions}
    className="px-6 py-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 rounded-lg font-medium"
  >
    {questionPage > 1 ? `Load More Questions (Page ${questionPage})` : "Load More Questions"}
  </motion.button>
</div>
              </motion.div>
            )}

            {activeTab === "fundraisers" && (
              <motion.div
                ref={fundraisersRef}
                key="fundraisers"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Fundraisers
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFundraiserModal(true)}
                    className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium shadow-md"
                  >
                    Start a Fundraiser
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {fundraisers.map((fundraiser) => (
                    <motion.div
                      key={fundraiser.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col h-full"
                    >
                      <div className="p-6 flex flex-col h-full">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                            {fundraiser.title}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                            {fundraiser.description}
                          </p>
                        </div>
                        <div className="mt-auto">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              Raised: ${fundraiser.raised.toLocaleString()}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              Goal: ${fundraiser.goal.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${getProgressColor(
                                fundraiser.raised,
                                fundraiser.goal
                              )}`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  (fundraiser.raised / fundraiser.goal) * 100
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {fundraiser.supporters} supporters
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleOpenDonate(fundraiser)}
                              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded-md"
                            >
                              Donate Now
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12 text-center">
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={loadMoreFundraisers}
    className="px-6 py-3 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-900/60 rounded-lg font-medium"
  >
    {fundraiserPage > 1 ? `View More Fundraisers (Page ${fundraiserPage})` : "View More Fundraisers"}
  </motion.button>
</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <footer className="bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <h3 className="text-indigo-600 dark:text-indigo-400 font-bold text-2xl">
                  MindConnect
                </h3>
                <div className="ml-2 flex space-x-1">
                  <span className="text-teal-500">⬤</span>
                  <span className="text-purple-500">⬤</span>
                  <span className="text-amber-500">⬤</span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Connecting people with mental health resources and professionals
                for better wellbeing.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Resources
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    Mental Health Guides
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    Crisis Hotlines
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Company
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
            <p className="text-center text-gray-500 dark:text-gray-400">
              &copy; 2025 MindConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 bg-gray-900/75 transition-opacity"
                onClick={() => setShowModal(false)}
              />

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                &#8203;
              </span>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              >
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-5 sm:text-center text-left">
                        Join Our Community
                      </h3>

                      {!registrationType ? (
                        <div>
                          <p className="mt-2 text-gray-600 dark:text-gray-300 mb-5">
                            Please select how you'd like to join our community:
                          </p>
                          <div className="grid grid-cols-1 gap-4 mb-4">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                handleRegistrationSelect("Patient")
                              }
                              className="py-3 px-4 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-lg flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <div className="p-2 bg-purple-200 dark:bg-purple-800 rounded-full mr-4">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-purple-600 dark:text-purple-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                  </svg>
                                </div>
                                I'm seeking support as a patient
                              </div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                handleRegistrationSelect("Psychologist")
                              }
                              className="py-3 px-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-lg flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <div className="p-2 bg-indigo-200 dark:bg-indigo-800 rounded-full mr-4">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-indigo-600 dark:text-indigo-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                  </svg>
                                </div>
                                I'm a psychologist looking to help
                              </div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                handleRegistrationSelect("Psychiatrist")
                              }
                              className="py-3 px-4 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 rounded-lg flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <div className="p-2 bg-teal-200 dark:bg-teal-800 rounded-full mr-4">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-teal-600 dark:text-teal-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                                    />
                                  </svg>
                                </div>
                                I'm a psychiatrist looking to help
                              </div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                handleRegistrationSelect("Supporter")
                              }
                              className="py-3 px-4 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-lg flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <div className="p-2 bg-amber-200 dark:bg-amber-800 rounded-full mr-4">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-amber-600 dark:text-amber-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                  </svg>
                                </div>
                                I'm a supporter/caregiver
                              </div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="mt-2"
                        >
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white sm:text-center text-left">
                            Register as a {registrationType}
                          </h4>
                          <form
                            onSubmit={handleRegisterSubmit}
                            className="mt-4 space-y-4"
                          >
                            <div>
                              <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left"
                              >
                                Full Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                placeholder="John Doe"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left"
                              >
                                Email
                              </label>
                              <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                placeholder="john.doe@example.com"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left"
                              >
                                Password
                              </label>
                              <input
                                type="password"
                                name="password"
                                id="password"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                placeholder="••••••••"
                              />
                            </div>

                            {(registrationType === "Psychologist" ||
                              registrationType === "Psychiatrist") && (
                              <div>
                                <label
                                  htmlFor="credentials"
                                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left"
                                >
                                  Professional Credentials
                                </label>
                                <input
                                  type="text"
                                  name="credentials"
                                  id="credentials"
                                  required
                                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                  placeholder="License number, certifications, etc."
                                />
                              </div>
                            )}

                            <div className="flex items-center mt-3">
                              <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label
                                htmlFor="terms"
                                className="ml-2 block text-sm text-gray-700 dark:text-gray-300 text-left"
                              >
                                I agree to the{" "}
                                <a
                                  href="#"
                                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                  Terms of Service
                                </a>{" "}
                                and{" "}
                                <a
                                  href="#"
                                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                  Privacy Policy
                                </a>
                              </label>
                            </div>

                            <div className="flex justify-between mt-6">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => setRegistrationType("")}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                              >
                                Back
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-md"
                              >
                                Register
                              </motion.button>
                            </div>
                          </form>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showQuestionModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 bg-gray-900/75 transition-opacity"
                onClick={() => setShowQuestionModal(false)}
              />

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                &#8203;
              </span>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              >
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 focus:outline-none"
                    onClick={() => setShowQuestionModal(false)}
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-5">
                        Ask a Question
                      </h3>

                      <form
                        onSubmit={handleQuestionSubmit}
                        className="space-y-4"
                      >
                        <div>
                          <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Question Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            value={questionForm.title}
                            onChange={handleQuestionFormChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                            placeholder="E.g., How can I manage anxiety before important events?"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="content"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Details
                          </label>
                          <textarea
                            name="content"
                            id="content"
                            rows={5}
                            value={questionForm.content}
                            onChange={handleQuestionFormChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Provide more details about your question..."
                          />
                        </div>

                        <div className="flex justify-between items-center pt-4">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {isLoggedIn
                              ? `Posting as ${userData.name}`
                              : "Posting anonymously"}
                          </p>
                          <div className="flex space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={() => setShowQuestionModal(false)}
                              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              Cancel
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="submit"
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-md text-sm font-medium"
                            >
                              Post Question
                            </motion.button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showFundraiserModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 bg-gray-900/75 transition-opacity"
                onClick={() => setShowFundraiserModal(false)}
              />

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                &#8203;
              </span>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              >
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 focus:outline-none"
                    onClick={() => setShowFundraiserModal(false)}
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-5">
                        Start a Fundraiser
                      </h3>

                      <form
                        onSubmit={handleFundraiserSubmit}
                        className="space-y-4"
                      >
                        <div>
                          <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Fundraiser Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            value={fundraiserForm.title}
                            onChange={handleFundraiserFormChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                            placeholder="E.g., Support Mental Health Awareness Workshop"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Description
                          </label>
                          <textarea
                            name="description"
                            id="description"
                            rows={5}
                            value={fundraiserForm.description}
                            onChange={handleFundraiserFormChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Explain what the fundraiser is for and how the funds will be used..."
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="goal"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Fundraising Goal ($)
                          </label>
                          <input
                            type="number"
                            name="goal"
                            id="goal"
                            min="100"
                            step="100"
                            value={fundraiserForm.goal}
                            onChange={handleFundraiserFormChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <div className="flex justify-between items-center pt-4">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {isLoggedIn
                              ? `Creating as ${userData.name}`
                              : "Login to track your fundraiser"}
                          </p>
                          <div className="flex space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={() => setShowFundraiserModal(false)}
                              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              Cancel
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="submit"
                              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md shadow-md text-sm font-medium"
                            >
                              Create Fundraiser
                            </motion.button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showDonateModal && currentFundraiser && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 bg-gray-900/75 transition-opacity"
                onClick={() => setShowDonateModal(false)}
              />

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                &#8203;
              </span>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle sm:max-w-md sm:w-full"
              >
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 focus:outline-none"
                    onClick={() => setShowDonateModal(false)}
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900 sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-teal-600 dark:text-teal-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                        Make a Donation
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          You're donating to:{" "}
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {currentFundraiser.title}
                          </span>
                        </p>
                      </div>

                      <form
                        onSubmit={handleDonateSubmit}
                        className="mt-4 space-y-4"
                      >
                        <div>
                          <label
                            htmlFor="donation-amount"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Donation Amount ($)
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                                $
                              </span>
                            </div>
                            <input
                              type="number"
                              name="donation-amount"
                              id="donation-amount"
                              min="1"
                              step="1"
                              value={donationAmount}
                              onChange={(e) =>
                                setDonationAmount(Number(e.target.value))
                              }
                              className="block w-full pl-7 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                              placeholder="0"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center">
                              <label htmlFor="currency" className="sr-only">
                                Currency
                              </label>
                              <span className="px-3 py-2 text-gray-500 dark:text-gray-400 sm:text-sm">
                                USD
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Select a preset amount:
                          </p>
                          <div className="grid grid-cols-4 gap-2">
                            {[10, 25, 50, 100].map((amount) => (
                              <button
                                key={amount}
                                type="button"
                                onClick={() => setDonationAmount(amount)}
                                className={`py-2 px-3 border dark:border-gray-600 rounded-md shadow-sm text-sm font-medium 
                            ${
                              donationAmount === amount
                                ? "bg-teal-500 border-teal-500 text-white dark:bg-teal-600 dark:border-teal-600"
                                : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-650"
                            }`}
                              >
                                ${amount}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Payment Method
                          </label>
                          <div className="flex space-x-2 mb-4">
                            <div className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 flex items-center space-x-2 bg-white dark:bg-gray-700 cursor-pointer">
                              <div className="w-10 h-6 flex justify-center items-center">
                                <svg
                                  className="h-5"
                                  viewBox="0 0 40 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <rect
                                    width="40"
                                    height="24"
                                    rx="4"
                                    fill="#2566AF"
                                  />
                                  <path
                                    d="M16.5857 16.2262H13.4712L15.3473 7.84598H18.4618L16.5857 16.2262Z"
                                    fill="white"
                                  />
                                  <path
                                    d="M26.1303 8.08042C25.4591 7.83255 24.3445 7.55566 23.0074 7.55566C20.262 7.55566 18.3379 8.9254 18.3243 10.9292C18.2969 12.3776 19.7054 13.1755 20.7586 13.6572C21.8393 14.146 22.2217 14.4643 22.2217 14.9111C22.2081 15.6196 21.334 15.9438 20.5215 15.9438C19.3727 15.9438 18.7561 15.7664 17.7848 15.372L17.3618 15.1662L16.9114 17.6077C17.7032 17.9319 19.1799 18.2224 20.7106 18.2363C23.628 18.2363 25.5111 16.8942 25.5386 14.7547C25.552 13.636 24.8537 12.7645 23.278 12.0283C22.307 11.5882 21.7042 11.2918 21.7179 10.8035C21.7179 10.3775 22.2079 9.93082 23.2819 9.93082C24.1788 9.91698 24.8537 10.1437 25.3726 10.3775L25.6726 10.5271L26.1303 8.08042Z"
                                    fill="white"
                                  />
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M31.5817 7.84598H29.1762C28.5186 7.84598 28.0271 8.03538 27.7541 8.67546L24.3379 16.2263H27.2552C27.2552 16.2263 27.6647 15.0852 27.7541 14.8468C28.0543 14.8468 30.3521 14.8468 30.7483 14.8468C30.8236 15.1523 31.0422 16.2263 31.0422 16.2263H33.6335L31.5817 7.84598ZM28.3925 12.7507C28.5735 12.2551 29.3803 10.0957 29.3803 10.0957C29.3662 10.1234 29.6123 9.48336 29.747 9.06062L29.9383 10.0127C29.9383 10.0127 30.4161 12.3349 30.5014 12.7507H28.3925Z"
                                    fill="white"
                                  />
                                </svg>
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {showCardNumber ? "4242 4242 4242 4242" : "•••• 4242"}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => setShowCardNumber((prev) => !prev)}
                              className="flex items-center justify-center flex-none w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                            >
                              {showCardNumber ? (
                                // Eye-off (slashed eye) icon
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.364-6.364A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-6.364-2.364M3 3l18 18" />
                                </svg>
                              ) : (
                                // Eye icon
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7.5 0c-1.74-4.14-5.82-7-10.5-7S3.24 7.86 1.5 12c1.74 4.14 5.82 7 10.5 7s8.76-2.86 10.5-7z" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              Currently: $
                              {currentFundraiser.raised.toLocaleString()} raised
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              Goal: ${currentFundraiser.goal.toLocaleString()}
                            </span>
                          </div>
                          <div className="relative w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div
                              className={`h-4 rounded-full ${getProgressColor(
                                currentFundraiser.raised,
                                currentFundraiser.goal
                              )}`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  (currentFundraiser.raised /
                                    currentFundraiser.goal) *
                                    100
                                )}%`,
                              }}
                            ></div>
                            <div
                              className={`absolute h-4 rounded-r-full bg-${
                                getProgressColor(
                                  currentFundraiser.raised + donationAmount,
                                  currentFundraiser.goal
                                ).split("bg-")[1]
                              }/50`}
                              style={{
                                left: `${Math.min(
                                  100,
                                  (currentFundraiser.raised /
                                    currentFundraiser.goal) *
                                    100
                                )}%`,
                                width: `${Math.min(
                                  100 -
                                    Math.min(
                                      100,
                                      (currentFundraiser.raised /
                                        currentFundraiser.goal) *
                                        100
                                    ),
                                  (donationAmount / currentFundraiser.goal) *
                                    100
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                            Your donation will help raise the total by{" "}
                            {(
                              (donationAmount /
                                (currentFundraiser.goal -
                                  currentFundraiser.raised)) *
                              100
                            ).toFixed(1)}
                            % of the remaining goal.
                          </p>
                        </div>

                        <div className="flex justify-between pt-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => setShowDonateModal(false)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md shadow-md"
                          >
                            Donate ${donationAmount}
                          </motion.button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
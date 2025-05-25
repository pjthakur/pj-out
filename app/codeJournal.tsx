"use client";

import React, { useState, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  prism,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import {
  FiCalendar,
  FiCode,
  FiClock,
  FiBarChart2,
  FiSmile,
  FiPlus,
  FiX,
  FiSave,
  FiEdit,
  FiTrash2,
  FiMenu,
  FiXCircle,
  FiCheckCircle,
  FiMoon,
  FiSun,
  FiSearch,
  FiFilter,
  FiTag,
  FiHash,
  FiBook,
  FiMessageSquare,
  FiActivity,
  FiAward,
  FiBriefcase,
  FiGithub,
  FiInfo,
  FiHeart,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiCoffee,
} from "react-icons/fi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: Date;
}

interface JournalEntry {
  id: string;
  date: Date;
  content: string;
  mood: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  hours: number;
}

interface Reminder {
  id: string;
  title: string;
  time: string;
  days: string[];
  isActive: boolean;
}

interface Progress {
  date: string;
  hours: number;
  snippetsCreated: number;
  entriesCreated: number;
}
const initialSnippets: CodeSnippet[] = [
  {
    id: "1",
    title: "React useState Hook Example",
    code: `import React, { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}`,
    language: "javascript",
    tags: ["React", "Hooks"],
    createdAt: new Date("2025-03-15"),
  },
  {
    id: "2",
    title: "TypeScript Interface",
    code: `interface User {\n  id: string;\n  name: string;\n  email: string;\n  isActive: boolean;\n}\n\nconst user: User = {\n  id: '123',\n  name: 'John Doe',\n  email: 'john@example.com',\n  isActive: true\n};`,
    language: "typescript",
    tags: ["TypeScript", "Interface"],
    createdAt: new Date("2025-03-16"),
  },
  {
    id: "3",
    title: "CSS Grid Layout",
    code: `.container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-gap: 20px;\n}\n\n.item {\n  padding: 20px;\n  background-color: #f0f0f0;\n  border-radius: 8px;\n}`,
    language: "css",
    tags: ["CSS", "Grid", "Layout"],
    createdAt: new Date("2025-03-17"),
  },
  {
    id: "4",
    title: "Express.js API Route with Middleware",
    code: `const express = require('express');\nconst router = express.Router();\nconst authMiddleware = require('../middleware/auth');\n\n// Protected route with middleware\nrouter.get('/profile', authMiddleware, async (req, res) => {\n  try {\n    const user = await User.findById(req.user.id).select('-password');\n    res.json(user);\n  } catch (err) {\n    console.error(err.message);\n    res.status(500).send('Server Error');\n  }\n});\n\nmodule.exports = router;`,
    language: "javascript",
    tags: ["Node.js", "Express", "API"],
    createdAt: new Date("2025-05-10"),
  },
  {
    id: "5",
    title: "React useEffect Cleanup",
    code: `import React, { useState, useEffect } from 'react';\n\nfunction DataFetcher() {\n  const [data, setData] = useState(null);\n  const [isLoading, setIsLoading] = useState(false);\n\n  useEffect(() => {\n    let isMounted = true;\n    setIsLoading(true);\n    \n    const fetchData = async () => {\n      try {\n        const response = await fetch('https://api.example.com/data');\n        const json = await response.json();\n        \n        if (isMounted) {\n          setData(json);\n          setIsLoading(false);\n        }\n      } catch (error) {\n        if (isMounted) {\n          console.error('Error fetching data:', error);\n          setIsLoading(false);\n        }\n      }\n    };\n    \n    fetchData();\n    \n    // Cleanup function to prevent state updates on unmounted component\n    return () => {\n      isMounted = false;\n    };\n  }, []);\n\n  return (\n    <div>\n      {isLoading ? (\n        <p>Loading...</p>\n      ) : data ? (\n        <pre>{JSON.stringify(data, null, 2)}</pre>\n      ) : (\n        <p>No data available</p>\n      )}\n    </div>\n  );\n}`,
    language: "jsx",
    tags: ["React", "Hooks", "useEffect", "Cleanup"],
    createdAt: new Date("2025-05-11"),
  },
  {
    id: "6",
    title: "CSS Animation with Keyframes",
    code: `@keyframes float {\n  0% {\n    transform: translateY(0px);\n    box-shadow: 0 5px 15px 0px rgba(0, 0, 0, 0.6);\n  }\n  50% {\n    transform: translateY(-20px);\n    box-shadow: 0 25px 15px 0px rgba(0, 0, 0, 0.2);\n  }\n  100% {\n    transform: translateY(0px);\n    box-shadow: 0 5px 15px 0px rgba(0, 0, 0, 0.6);\n  }\n}\n\n.floating-element {\n  width: 150px;\n  height: 150px;\n  border-radius: 50%;\n  background-color: #6c5ce7;\n  animation: float 6s ease-in-out infinite;\n  margin: 50px auto;\n}`,
    language: "css",
    tags: ["CSS", "Animation", "Keyframes"],
    createdAt: new Date("2025-05-12"),
  },
  {
    id: "7",
    title: "Python Data Processing with Pandas",
    code: `import pandas as pd\nimport matplotlib.pyplot as plt\n\n# Load data from CSV\ndf = pd.read_csv('sales_data.csv')\n\n# Data cleaning\ndf.dropna(inplace=True)\ndf['date'] = pd.to_datetime(df['date'])\ndf['month'] = df['date'].dt.month\ndf['year'] = df['date'].dt.year\n\n# Group data by month and calculate sum of sales\nmonthly_sales = df.groupby(['year', 'month'])['sales_amount'].sum().reset_index()\n\n# Create visualization\nplt.figure(figsize=(12, 6))\nplt.plot(monthly_sales['month'], monthly_sales['sales_amount'], marker='o')\nplt.title('Monthly Sales Performance')\nplt.xlabel('Month')\nplt.ylabel('Sales Amount ($)')\nplt.grid(True, linestyle='--', alpha=0.7)\nplt.tight_layout()\nplt.savefig('monthly_sales.png')\nplt.show()`,
    language: "python",
    tags: ["Python", "Pandas", "Data Analysis"],
    createdAt: new Date("2025-05-13"),
  },
  {
    id: "8",
    title: "Next.js API Route with Error Handling",
    code: `// pages/api/users/[id].js\nimport { connectToDatabase } from '../../../utils/database';\n\nexport default async function handler(req, res) {\n  const { id } = req.query;\n  \n  // Validate request method\n  if (req.method !== 'GET') {\n    return res.status(405).json({ message: 'Method not allowed' });\n  }\n  \n  try {\n    // Connect to database\n    const { db } = await connectToDatabase();\n    \n    // Find user by ID\n    const user = await db.collection('users').findOne(\n      { _id: ObjectId(id) },\n      { projection: { password: 0 } } // Exclude password\n    );\n    \n    // Check if user exists\n    if (!user) {\n      return res.status(404).json({ message: 'User not found' });\n    }\n    \n    // Return user data\n    return res.status(200).json(user);\n  } catch (error) {\n    console.error('Error fetching user:', error);\n    return res.status(500).json({ message: 'Internal server error' });\n  }\n}`,
    language: "javascript",
    tags: ["Next.js", "API", "Error Handling"],
    createdAt: new Date("2025-05-14"),
  },
];

const initialJournalEntries: JournalEntry[] = [
  {
    id: "1",
    date: new Date("2025-05-15"),
    content:
      "Today I learned about React Server Components and how they can improve performance by moving some rendering work to the server. The new paradigm opens up interesting possibilities for hybrid rendering strategies.",
    mood: 5,
    tags: ["React", "Performance"],
    hours: 3,
  },
  {
    id: "2",
    date: new Date("2025-05-16"),
    content:
      "Struggled with TypeScript generics today. Need to revisit the documentation and practice more examples. The concept of extending types and using constraints is particularly challenging.",
    mood: 2,
    tags: ["TypeScript", "Learning"],
    hours: 4,
  },
  {
    id: "3",
    date: new Date("2025-05-17"),
    content:
      "Implemented a complex animation using Framer Motion. Very satisfied with the results! The way it handles gestures and transitions makes creating fluid interactions much easier.",
    mood: 5,
    tags: ["Animation", "Framer Motion"],
    hours: 2,
  },
  {
    id: "4",
    date: new Date("2025-05-14"),
    content:
      "Started learning about WebSockets today and implemented a real-time chat application using Socket.io. It's fascinating how easy it is to establish bidirectional communication channels. Need to explore authentication and security aspects next.",
    mood: 4,
    tags: ["WebSockets", "Socket.io", "Real-time"],
    hours: 3.5,
  },
  {
    id: "5",
    date: new Date("2025-05-13"),
    content:
      "Deep dive into Redux Toolkit today. The createSlice API drastically reduces boilerplate code compared to traditional Redux. Also explored RTK Query for data fetching - it's a game changer for handling cached API requests and invalidation.",
    mood: 5,
    tags: ["Redux", "Redux Toolkit", "State Management"],
    hours: 4,
  },
  {
    id: "6",
    date: new Date("2025-05-12"),
    content:
      "Spent hours debugging a memory leak in our React application. Finally tracked it down to unused event listeners not being cleaned up in useEffect hooks. Important lesson: always return cleanup functions from effects that set up subscriptions or timers.",
    mood: 2,
    tags: ["Debugging", "Memory Leaks", "React"],
    hours: 5,
  },
  {
    id: "7",
    date: new Date("2025-05-11"),
    content:
      "Explored TailwindCSS today as an alternative to CSS-in-JS solutions. The utility-first approach is growing on me - it's super efficient once you get used to the class names. The built-in responsive design utilities make media queries almost unnecessary.",
    mood: 4,
    tags: ["CSS", "TailwindCSS", "Styling"],
    hours: 2.5,
  },
  {
    id: "8",
    date: new Date("2025-05-10"),
    content:
      "Just completed my first GraphQL API with Apollo Server. The schema-first approach forces better API design, and clients only fetching exactly what they need is so efficient. Resolvers were tricky at first but make perfect sense now.",
    mood: 5,
    tags: ["GraphQL", "Apollo", "API"],
    hours: 4,
  },
];

const initialReminders: Reminder[] = [
  {
    id: "1",
    title: "Study React Hooks",
    time: "09:00",
    days: ["Monday", "Wednesday", "Friday"],
    isActive: true,
  },
  {
    id: "2",
    title: "Algorithms Practice",
    time: "18:00",
    days: ["Tuesday", "Thursday"],
    isActive: true,
  },
  {
    id: "3",
    title: "Weekend Project Time",
    time: "10:00",
    days: ["Saturday", "Sunday"],
    isActive: false,
  },
  {
    id: "4",
    title: "GraphQL Course",
    time: "19:30",
    days: ["Monday", "Thursday"],
    isActive: true,
  },
  {
    id: "5",
    title: "Code Review Session",
    time: "14:00",
    days: ["Wednesday"],
    isActive: true,
  },
  {
    id: "6",
    title: "Open Source Contribution",
    time: "20:00",
    days: ["Tuesday", "Friday"],
    isActive: false,
  },
  {
    id: "7",
    title: "System Design Learning",
    time: "17:30",
    days: ["Monday", "Wednesday", "Friday"],
    isActive: true,
  },
  {
    id: "8",
    title: "LeetCode Practice Session",
    time: "08:00",
    days: ["Saturday"],
    isActive: true,
  },
];

const generateDetailedProgressData = () => {
  const data = [];
  const today = new Date();

  const hourPatterns = [
    [3, 4, 2, 5, 1, 0, 3],
    [4, 3, 5, 4, 2, 1, 3],
    [3, 2, 6, 4, 5, 0, 0],
    [5, 4, 4, 3, 2, 2, 4],
  ];

  const snippetPatterns = [
    [1, 0, 2, 1, 0, 0, 0],
    [0, 1, 2, 0, 1, 0, 1],
    [1, 0, 1, 2, 1, 0, 0],
    [2, 1, 0, 1, 0, 0, 1],
  ];

  const entryPatterns = [
    [1, 1, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 0],
    [1, 0, 1, 1, 1, 0, 0],
    [1, 1, 0, 1, 0, 0, 1],
  ];

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const formattedDate = date.toISOString().split("T")[0];

    const weekNum = Math.floor(i / 7);
    const dayInWeek = i % 7;

    const hourPattern =
      hourPatterns[Math.min(weekNum, hourPatterns.length - 1)];
    const snippetPattern =
      snippetPatterns[Math.min(weekNum, snippetPatterns.length - 1)];
    const entryPattern =
      entryPatterns[Math.min(weekNum, entryPatterns.length - 1)];

    const hours =
      hourPattern[dayInWeek] +
      (Math.random() > 0.7 ? Math.floor(Math.random() * 2) : 0);
    const snippetsCreated =
      snippetPattern[dayInWeek] + (Math.random() > 0.8 ? 1 : 0);
    const entriesCreated =
      entryPattern[dayInWeek] + (Math.random() > 0.9 ? 1 : 0);

    data.push({
      date: formattedDate,
      hours: hours,
      snippetsCreated: snippetsCreated,
      entriesCreated: entriesCreated,
    });
  }

  return data;
};

const initialProgressData = generateDetailedProgressData();

const InfoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}> = ({ isOpen, onClose, darkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div
        className={`relative w-full max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 ${
          darkMode
            ? "bg-gray-900 border border-white/10 text-white"
            : "bg-white border border-gray-100 text-gray-900"
        }`}
      >
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold">About DevJournal</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              darkMode
                ? "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800"
            }`}
            aria-label="Close modal"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div
          className={`space-y-4 md:space-y-6 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          <div className="flex items-start space-x-3 md:space-x-4">
            <div
              className={`p-2 md:p-3 rounded-xl flex-shrink-0 ${
                darkMode ? "bg-purple-500/20" : "bg-purple-100"
              }`}
            >
              <FiCode
                className={`h-5 w-5 md:h-6 md:w-6 ${
                  darkMode ? "text-purple-300" : "text-purple-600"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`text-base md:text-lg font-semibold mb-1 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Track Your Coding Journey
              </h3>
              <p className="text-sm md:text-base leading-relaxed">
                DevJournal helps you document your progress, save useful code
                snippets, and build consistent coding habits.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 md:space-x-4">
            <div
              className={`p-2 md:p-3 rounded-xl flex-shrink-0 ${
                darkMode ? "bg-teal-500/20" : "bg-teal-100"
              }`}
            >
              <FiMessageSquare
                className={`h-5 w-5 md:h-6 md:w-6 ${
                  darkMode ? "text-teal-300" : "text-teal-600"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`text-base md:text-lg font-semibold mb-1 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Journal Your Learnings
              </h3>
              <p className="text-sm md:text-base leading-relaxed">
                Create entries to document what you've learned, track your mood,
                and record your coding hours.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 md:space-x-4">
            <div
              className={`p-2 md:p-3 rounded-xl flex-shrink-0 ${
                darkMode ? "bg-pink-500/20" : "bg-pink-100"
              }`}
            >
              <FiActivity
                className={`h-5 w-5 md:h-6 md:w-6 ${
                  darkMode ? "text-pink-300" : "text-pink-600"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`text-base md:text-lg font-semibold mb-1 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Visualize Your Progress
              </h3>
              <p className="text-sm md:text-base leading-relaxed">
                See your coding activity over time with beautiful charts and
                track your learning trajectory.
              </p>
            </div>
          </div>

          <div className={`mt-4 md:mt-6 pt-4 md:pt-6 border-t ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}>
            <h3
              className={`text-base md:text-lg font-semibold mb-3 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Features
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 md:gap-y-2 text-sm md:text-base">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 flex-shrink-0"></span>
                Code snippet library
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 flex-shrink-0"></span>
                Coding journal entries
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 flex-shrink-0"></span>
                Customizable reminders
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 flex-shrink-0"></span>
                Progress visualization
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 flex-shrink-0"></span>
                Dark & light modes
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 flex-shrink-0"></span>
                Mood tracking
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 flex-shrink-0"></span>
                Tag organization
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 flex-shrink-0"></span>
                Searchable content
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const CodingJournal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "journal" | "snippets" | "reminders" | "progress"
  >("journal");
  const [snippets, setSnippets] = useState<CodeSnippet[]>(initialSnippets);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(
    initialJournalEntries
  );
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [progressData, setProgressData] =
    useState<Progress[]>(initialProgressData);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);

  const [isAddingSnippet, setIsAddingSnippet] = useState<boolean>(false);
  const [isAddingJournal, setIsAddingJournal] = useState<boolean>(false);
  const [isAddingReminder, setIsAddingReminder] = useState<boolean>(false);

  const [newSnippet, setNewSnippet] = useState<Partial<CodeSnippet>>({
    title: "",
    code: "",
    language: "javascript",
    tags: [],
  });

  const [newJournalEntry, setNewJournalEntry] = useState<Partial<JournalEntry>>(
    {
      content: "",
      mood: 3,
      tags: [],
      hours: 1,
    }
  );

  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: "",
    time: "09:00",
    days: [],
    isActive: true,
  });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentTagFilter, setCurrentTagFilter] = useState<string>("");

  const [editingSnippetId, setEditingSnippetId] = useState<string | null>(null);
  const [editingJournalId, setEditingJournalId] = useState<string | null>(null);
  const [editingReminderId, setEditingReminderId] = useState<string | null>(
    null
  );

  const [currentTagInput, setCurrentTagInput] = useState<string>("");

  // Toast notification state
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  useEffect(() => {
    if (editingSnippetId) {
      const snippetToEdit = snippets.find((s) => s.id === editingSnippetId);
      if (snippetToEdit) {
        setNewSnippet({
          title: snippetToEdit.title,
          code: snippetToEdit.code,
          language: snippetToEdit.language,
          tags: [...snippetToEdit.tags],
        });
        setIsAddingSnippet(true);
      }
    }
  }, [editingSnippetId, snippets]);

  useEffect(() => {
    if (editingJournalId) {
      const entryToEdit = journalEntries.find((e) => e.id === editingJournalId);
      if (entryToEdit) {
        setNewJournalEntry({
          content: entryToEdit.content,
          mood: entryToEdit.mood,
          tags: [...entryToEdit.tags],
          hours: entryToEdit.hours,
        });
        setIsAddingJournal(true);
      }
    }
  }, [editingJournalId, journalEntries]);

  useEffect(() => {
    if (editingReminderId) {
      const reminderToEdit = reminders.find((r) => r.id === editingReminderId);
      if (reminderToEdit) {
        setNewReminder({
          title: reminderToEdit.title,
          time: reminderToEdit.time,
          days: [...reminderToEdit.days],
          isActive: reminderToEdit.isActive,
        });
        setIsAddingReminder(true);
      }
    }
  }, [editingReminderId, reminders]);

  useEffect(() => {
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href =
      "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(linkElement);

    return () => {
      document.head.removeChild(linkElement);
    };
  }, []);

  useEffect(() => {
    document.body.style.fontFamily = "'Outfit', sans-serif";

    return () => {
      document.body.style.fontFamily = "";
    };
  }, []);

  // Prevent background scrolling when modals are open
  useEffect(() => {
    if (isInfoModalOpen || isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isInfoModalOpen, isMobileMenuOpen]);

  // Toast notification function
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  const getChartData = (): ChartData<"line"> => {
    return {
      labels: progressData.map((item) => {
        const date = new Date(item.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [
        {
          label: "Coding Hours",
          data: progressData.map((item) => item.hours),
          borderColor: darkMode
            ? "rgba(138, 43, 226, 1)"
            : "rgba(102, 51, 153, 1)",
          backgroundColor: darkMode
            ? "rgba(138, 43, 226, 0.2)"
            : "rgba(102, 51, 153, 0.2)",
          borderWidth: 3,
          pointBackgroundColor: darkMode ? "#fff" : "#6633cc",
          pointBorderColor: darkMode
            ? "rgba(138, 43, 226, 1)"
            : "rgba(102, 51, 153, 1)",
          pointHoverBackgroundColor: darkMode
            ? "rgba(138, 43, 226, 1)"
            : "rgba(102, 51, 153, 1)",
          pointHoverBorderColor: darkMode ? "#fff" : "#fff",
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.4,
        },
        {
          label: "Journal Entries",
          data: progressData.map((item) => item.entriesCreated),
          borderColor: darkMode
            ? "rgba(64, 224, 208, 1)"
            : "rgba(0, 173, 181, 1)",
          backgroundColor: darkMode
            ? "rgba(64, 224, 208, 0.2)"
            : "rgba(0, 173, 181, 0.2)",
          borderWidth: 3,
          pointBackgroundColor: darkMode ? "#fff" : "#00adb5",
          pointBorderColor: darkMode
            ? "rgba(64, 224, 208, 1)"
            : "rgba(0, 173, 181, 1)",
          pointHoverBackgroundColor: darkMode
            ? "rgba(64, 224, 208, 1)"
            : "rgba(0, 173, 181, 1)",
          pointHoverBorderColor: darkMode ? "#fff" : "#fff",
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.4,
        },
        {
          label: "Code Snippets",
          data: progressData.map((item) => item.snippetsCreated),
          borderColor: darkMode
            ? "rgba(255, 105, 180, 1)"
            : "rgba(255, 64, 129, 1)",
          backgroundColor: darkMode
            ? "rgba(255, 105, 180, 0.2)"
            : "rgba(255, 64, 129, 0.2)",
          borderWidth: 3,
          pointBackgroundColor: darkMode ? "#fff" : "#ff4081",
          pointBorderColor: darkMode
            ? "rgba(255, 105, 180, 1)"
            : "rgba(255, 64, 129, 1)",
          pointHoverBackgroundColor: darkMode
            ? "rgba(255, 105, 180, 1)"
            : "rgba(255, 64, 129, 1)",
          pointHoverBorderColor: darkMode ? "#fff" : "#fff",
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.4,
        },
      ],
    };
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            family: "'Outfit', sans-serif",
            size: 14,
            weight: "bold",
          },
          color: darkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)",
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: darkMode
          ? "rgba(30, 30, 30, 0.8)"
          : "rgba(255, 255, 255, 0.8)",
        titleColor: darkMode
          ? "rgba(255, 255, 255, 0.9)"
          : "rgba(0, 0, 0, 0.9)",
        bodyColor: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
        titleFont: {
          family: "'Outfit', sans-serif",
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          family: "'Outfit', sans-serif",
          size: 13,
        },
        padding: 12,
        cornerRadius: 8,
        boxPadding: 4,
      },
      title: {
        display: true,
        text: "Coding Progress Over Time",
        color: darkMode ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)",
        font: {
          size: 18,
          family: "'Outfit', sans-serif",
          weight: "bold",
        },
        padding: {
          bottom: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
        },
        ticks: {
          color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
          font: {
            family: "'Outfit', sans-serif",
            size: 12,
          },
          padding: 10,
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
          display: false,
        },
        ticks: {
          color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
          font: {
            family: "'Outfit', sans-serif",
            size: 12,
          },
          padding: 10,
        },
        border: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 3,
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    animation: {
      duration: 1000,
    },
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const createOrUpdateSnippet = () => {
    if (!newSnippet.title || !newSnippet.code) return;

    if (editingSnippetId) {
      setSnippets(
        snippets.map((snippet) =>
          snippet.id === editingSnippetId
            ? {
                ...snippet,
                title: newSnippet.title || "",
                code: newSnippet.code || "",
                language: newSnippet.language || "javascript",
                tags: newSnippet.tags || [],
              }
            : snippet
        )
      );
      setEditingSnippetId(null);
    } else {
      const snippet: CodeSnippet = {
        id: generateId(),
        title: newSnippet.title || "",
        code: newSnippet.code || "",
        language: newSnippet.language || "javascript",
        tags: newSnippet.tags || [],
        createdAt: new Date(),
      };

      setSnippets([snippet, ...snippets]);

      const updatedProgressData = [...progressData];
      const today = new Date().toISOString().split("T")[0];
      const todayProgressIndex = updatedProgressData.findIndex(
        (p) => p.date === today
      );

      if (todayProgressIndex !== -1) {
        updatedProgressData[todayProgressIndex].snippetsCreated += 1;
        setProgressData(updatedProgressData);
      }
    }

    setNewSnippet({
      title: "",
      code: "",
      language: "javascript",
      tags: [],
    });
    setIsAddingSnippet(false);
  };

  const createOrUpdateJournalEntry = () => {
    if (!newJournalEntry.content) return;

    if (editingJournalId) {
      setJournalEntries(
        journalEntries.map((entry) =>
          entry.id === editingJournalId
            ? {
                ...entry,
                content: newJournalEntry.content || "",
                mood: (newJournalEntry.mood as 1 | 2 | 3 | 4 | 5) || 3,
                tags: newJournalEntry.tags || [],
                hours: newJournalEntry.hours || 1,
              }
            : entry
        )
      );
      setEditingJournalId(null);
    } else {
      const entry: JournalEntry = {
        id: generateId(),
        date: new Date(),
        content: newJournalEntry.content || "",
        mood: (newJournalEntry.mood as 1 | 2 | 3 | 4 | 5) || 3,
        tags: newJournalEntry.tags || [],
        hours: newJournalEntry.hours || 1,
      };

      setJournalEntries([entry, ...journalEntries]);

      const updatedProgressData = [...progressData];
      const today = new Date().toISOString().split("T")[0];
      const todayProgressIndex = updatedProgressData.findIndex(
        (p) => p.date === today
      );

      if (todayProgressIndex !== -1) {
        updatedProgressData[todayProgressIndex].entriesCreated += 1;
        updatedProgressData[todayProgressIndex].hours += entry.hours;
        setProgressData(updatedProgressData);
      }
    }

    setNewJournalEntry({
      content: "",
      mood: 3,
      tags: [],
      hours: 1,
    });
    setIsAddingJournal(false);
  };

  const createOrUpdateReminder = () => {
    if (!newReminder.title || !newReminder.time || !newReminder.days?.length)
      return;

    if (editingReminderId) {
      setReminders(
        reminders.map((reminder) =>
          reminder.id === editingReminderId
            ? {
                ...reminder,
                title: newReminder.title || "",
                time: newReminder.time || "09:00",
                days: newReminder.days || [],
                isActive:
                  newReminder.isActive !== undefined
                    ? newReminder.isActive
                    : true,
              }
            : reminder
        )
      );
      setEditingReminderId(null);
    } else {
      const reminder: Reminder = {
        id: generateId(),
        title: newReminder.title || "",
        time: newReminder.time || "09:00",
        days: newReminder.days || [],
        isActive:
          newReminder.isActive !== undefined ? newReminder.isActive : true,
      };

      setReminders([...reminders, reminder]);
    }

    setNewReminder({
      title: "",
      time: "09:00",
      days: [],
      isActive: true,
    });
    setIsAddingReminder(false);
  };

  const deleteSnippet = (id: string) => {
    setSnippets(snippets.filter((snippet) => snippet.id !== id));
  };

  const deleteJournalEntry = (id: string) => {
    setJournalEntries(journalEntries.filter((entry) => entry.id !== id));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id));
  };

  const toggleReminderStatus = (id: string) => {
    setReminders(
      reminders.map((reminder) =>
        reminder.id === id
          ? { ...reminder, isActive: !reminder.isActive }
          : reminder
      )
    );
  };

  const addTag = (type: "snippet" | "journal") => {
    if (!currentTagInput.trim()) return;

    if (type === "snippet") {
      setNewSnippet({
        ...newSnippet,
        tags: [...(newSnippet.tags || []), currentTagInput.trim()],
      });
    } else {
      setNewJournalEntry({
        ...newJournalEntry,
        tags: [...(newJournalEntry.tags || []), currentTagInput.trim()],
      });
    }

    setCurrentTagInput("");
  };

  const removeTag = (type: "snippet" | "journal", tagIndex: number) => {
    if (type === "snippet") {
      const newTags = [...(newSnippet.tags || [])];
      newTags.splice(tagIndex, 1);
      setNewSnippet({
        ...newSnippet,
        tags: newTags,
      });
    } else {
      const newTags = [...(newJournalEntry.tags || [])];
      newTags.splice(tagIndex, 1);
      setNewJournalEntry({
        ...newJournalEntry,
        tags: newTags,
      });
    }
  };

  const toggleDay = (day: string) => {
    const currentDays = newReminder.days || [];
    const updatedDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];

    setNewReminder({
      ...newReminder,
      days: updatedDays,
    });
  };

  const cancelAddingSnippet = () => {
    setIsAddingSnippet(false);
    setEditingSnippetId(null);
    setNewSnippet({
      title: "",
      code: "",
      language: "javascript",
      tags: [],
    });
  };

  const cancelAddingJournal = () => {
    setIsAddingJournal(false);
    setEditingJournalId(null);
    setNewJournalEntry({
      content: "",
      mood: 3,
      tags: [],
      hours: 1,
    });
  };

  const cancelAddingReminder = () => {
    setIsAddingReminder(false);
    setEditingReminderId(null);
    setNewReminder({
      title: "",
      time: "09:00",
      days: [],
      isActive: true,
    });
  };

  const filteredSnippets = snippets.filter(
    (snippet) =>
      (snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )) &&
      (!currentTagFilter || snippet.tags.includes(currentTagFilter))
  );

  const filteredEntries = journalEntries.filter(
    (entry) =>
      (entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )) &&
      (!currentTagFilter || entry.tags.includes(currentTagFilter))
  );

  const allTags = [
    ...new Set([
      ...snippets.flatMap((snippet) => snippet.tags),
      ...journalEntries.flatMap((entry) => entry.tags),
    ]),
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const renderMoodEmoji = (mood: 1 | 2 | 3 | 4 | 5) => {
    switch (mood) {
      case 1:
        return "😖";
      case 2:
        return "😕";
      case 3:
        return "😐";
      case 4:
        return "🙂";
      case 5:
        return "😄";
      default:
        return "😐";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-slate-50 text-gray-900"
      }`}
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <div className="fixed inset-0 z-0">
        <div
          className={`absolute inset-0 ${
            darkMode
              ? "bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-blue-900/30"
              : "bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50"
          }`}
        ></div>

        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 blur-3xl animate-blob"></div>
        <div className="absolute top-3/4 right-1/3 w-80 h-80 rounded-full bg-gradient-to-r from-fuchsia-500/10 to-pink-500/10 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-2/3 w-72 h-72 rounded-full bg-gradient-to-r from-blue-500/10 to-teal-500/10 blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Mobile header buttons - reorganized for better alignment */}
      <div className="md:hidden fixed top-4 left-4 right-4 z-50 flex justify-between items-center">
        {/* Left side - Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className={`p-3 rounded-full backdrop-blur-lg border shadow-lg transition-all cursor-pointer ${
            darkMode
              ? "bg-white/10 border-white/10 text-white hover:bg-white/15"
              : "bg-white/80 border-gray-200 text-gray-800 hover:bg-white"
          }`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <FiSun className="h-5 w-5" />
          ) : (
            <FiMoon className="h-5 w-5" />
          )}
        </button>

        {/* Right side - Info and Menu buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsInfoModalOpen(true)}
            className={`p-3 rounded-full backdrop-blur-lg border shadow-lg transition-all cursor-pointer ${
              darkMode
                ? "bg-white/10 border-white/10 text-white hover:bg-white/15"
                : "bg-white/80 border-gray-200 text-gray-800 hover:bg-white"
            }`}
            aria-label="Open info"
          >
            <FiInfo className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-3 rounded-full backdrop-blur-lg border shadow-lg transition-all cursor-pointer ${
              darkMode
                ? "bg-white/10 border-white/10 text-white hover:bg-white/15"
                : "bg-white/80 border-gray-200 text-gray-800 hover:bg-white"
            }`}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <FiX className="h-5 w-5" />
            ) : (
              <FiMenu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Desktop buttons - keep existing layout */}
      <div className="hidden md:block fixed top-6 right-20 z-50">
        <button
          onClick={() => setIsInfoModalOpen(true)}
          className={`p-3 rounded-full backdrop-blur-lg border shadow-lg transition-all cursor-pointer ${
            darkMode
              ? "bg-white/10 border-white/10 text-white hover:bg-white/15"
              : "bg-white/80 border-gray-200 text-gray-800 hover:bg-white"
          }`}
          aria-label="Open info"
        >
          <FiInfo className="h-6 w-6" />
        </button>
      </div>

      <div className="hidden md:block fixed top-6 right-36 z-50">
        <button
          onClick={toggleDarkMode}
          className={`p-3 rounded-full backdrop-blur-lg border shadow-lg transition-all cursor-pointer ${
            darkMode
              ? "bg-white/10 border-white/10 text-white hover:bg-white/15"
              : "bg-white/80 border-gray-200 text-gray-800 hover:bg-white"
          }`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <FiSun className="h-6 w-6" />
          ) : (
            <FiMoon className="h-6 w-6" />
          )}
        </button>
      </div>

      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        darkMode={darkMode}
      />

      {/* Toast Notification */}
      {toast.isVisible && (
        <div className="fixed top-20 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 sm:w-auto z-50 animate-in slide-in-from-top duration-300">
          <div
            className={`px-4 py-3 sm:px-6 sm:py-4 rounded-xl shadow-lg backdrop-blur-lg border flex items-start sm:items-center space-x-3 ${
              toast.type === 'success'
                ? darkMode
                  ? 'bg-green-500/20 border-green-500/30 text-green-100'
                  : 'bg-green-100 border-green-200 text-green-800'
                : toast.type === 'error'
                ? darkMode
                  ? 'bg-red-500/20 border-red-500/30 text-red-100'
                  : 'bg-red-100 border-red-200 text-red-800'
                : darkMode
                ? 'bg-blue-500/20 border-blue-500/30 text-blue-100'
                : 'bg-blue-100 border-blue-200 text-blue-800'
            }`}
          >
            <div className="flex items-center flex-shrink-0">
              {toast.type === 'success' && <FiCheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />}
              {toast.type === 'error' && <FiXCircle className="h-4 w-4 sm:h-5 sm:w-5" />}
              {toast.type === 'info' && <FiInfo className="h-4 w-4 sm:h-5 sm:w-5" />}
            </div>
            <span className="font-medium text-sm sm:text-base leading-relaxed">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        {/* header */}
        <header className="text-center mb-12">
          <div className="inline-block mb-4">
            <div
              className={`p-3 rounded-xl ${
                darkMode ? "bg-purple-500/20" : "bg-purple-500/10"
              }`}
            >
              <FiCode
                className={`h-10 w-10 ${
                  darkMode ? "text-purple-300" : "text-purple-700"
                }`}
              />
            </div>
          </div>
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-3 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              DevJournal
            </span>
          </h1>
          <p
            className={`text-lg md:text-xl ${
              darkMode ? "text-gray-300" : "text-gray-600"
            } max-w-lg mx-auto`}
          >
            Track your coding journey, one line at a time
          </p>
        </header>

        {/* Desktop navigation */}
        <nav className="hidden md:flex justify-center mb-10">
          <div
            className={`flex space-x-1 p-1.5 rounded-2xl shadow-lg ${
              darkMode
                ? "bg-white/10 backdrop-blur-lg border border-white/10"
                : "bg-white/70 backdrop-blur-lg border border-gray-100"
            }`}
          >
            <button
              onClick={() => setActiveTab("journal")}
              className={`flex items-center px-6 py-3.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === "journal"
                  ? darkMode
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20"
                  : darkMode
                  ? "text-white hover:bg-white/10"
                  : "text-gray-700 hover:bg-white/80"
              }`}
            >
              <FiMessageSquare className="h-5 w-5 mr-2" />
              Journal
            </button>
            <button
              onClick={() => setActiveTab("snippets")}
              className={`flex items-center px-6 py-3.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === "snippets"
                  ? darkMode
                    ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-teal-600/20"
                    : "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-teal-600/20"
                  : darkMode
                  ? "text-white hover:bg-white/10"
                  : "text-gray-700 hover:bg-white/80"
              }`}
            >
              <FiCode className="h-5 w-5 mr-2" />
              Snippets
            </button>
            <button
              onClick={() => setActiveTab("reminders")}
              className={`flex items-center px-6 py-3.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === "reminders"
                  ? darkMode
                    ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/20"
                    : "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/20"
                  : darkMode
                  ? "text-white hover:bg-white/10"
                  : "text-gray-700 hover:bg-white/80"
              }`}
            >
              <FiClock className="h-5 w-5 mr-2" />
              Reminders
            </button>
            <button
              onClick={() => setActiveTab("progress")}
              className={`flex items-center px-6 py-3.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === "progress"
                  ? darkMode
                    ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/20"
                    : "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/20"
                  : darkMode
                  ? "text-white hover:bg-white/10"
                  : "text-gray-700 hover:bg-white/80"
              }`}
            >
              <FiActivity className="h-5 w-5 mr-2" />
              Progress
            </button>
          </div>
        </nav>

        {/* Mobile navigation */}
        <div
          className={`fixed inset-y-0 left-0 transform ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:hidden backdrop-blur-xl w-72 z-40 transition-transform duration-300 ease-in-out ${
            darkMode
              ? "bg-gray-900/95 border-r border-white/10"
              : "bg-white/95 border-r border-gray-200"
          }`}
        >
          <div className="flex flex-col h-full pt-20 pb-6 px-4">
            <div className="px-4 py-3 mb-6">
              <h2
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                DevJournal
              </h2>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Coding tracker & organizer
              </p>
            </div>

            <button
              onClick={() => {
                setActiveTab("journal");
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center px-4 py-3.5 rounded-xl mb-2 font-medium transition-all cursor-pointer ${
                activeTab === "journal"
                  ? darkMode
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                  : darkMode
                  ? "text-white hover:bg-white/10"
                  : "text-gray-700 hover:bg-gray-100/80"
              }`}
            >
              <FiMessageSquare className="h-5 w-5 mr-3" />
              Journal
            </button>
            <button
              onClick={() => {
                setActiveTab("snippets");
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center px-4 py-3.5 rounded-xl mb-2 font-medium transition-all cursor-pointer ${
                activeTab === "snippets"
                  ? darkMode
                    ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white"
                    : "bg-gradient-to-r from-cyan-600 to-teal-600 text-white"
                  : darkMode
                  ? "text-white hover:bg-white/10"
                  : "text-gray-700 hover:bg-gray-100/80"
              }`}
            >
              <FiCode className="h-5 w-5 mr-3" />
              Snippets
            </button>
            <button
              onClick={() => {
                setActiveTab("reminders");
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center px-4 py-3.5 rounded-xl mb-2 font-medium transition-all cursor-pointer ${
                activeTab === "reminders"
                  ? darkMode
                    ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white"
                    : "bg-gradient-to-r from-pink-600 to-rose-600 text-white"
                  : darkMode
                  ? "text-white hover:bg-white/10"
                  : "text-gray-700 hover:bg-gray-100/80"
              }`}
            >
              <FiClock className="h-5 w-5 mr-3" />
              Reminders
            </button>
            <button
              onClick={() => {
                setActiveTab("progress");
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center px-4 py-3.5 rounded-xl mb-2 font-medium transition-all cursor-pointer ${
                activeTab === "progress"
                  ? darkMode
                    ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white"
                    : "bg-gradient-to-r from-amber-600 to-orange-600 text-white"
                  : darkMode
                  ? "text-white hover:bg-white/10"
                  : "text-gray-700 hover:bg-gray-100/80"
              }`}
            >
              <FiActivity className="h-5 w-5 mr-3" />
              Progress
            </button>

            <div className="mt-auto">
              <div
                className={`p-4 rounded-xl ${
                  darkMode ? "bg-white/5" : "bg-gray-100/80"
                }`}
              >
                <h3
                  className={`font-medium mb-1 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <FiGithub className="inline-block h-4 w-4 mr-2" />
                  GitHub Commits
                </h3>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Connect GitHub to track your commits and contributions
                </p>
                <button
                  className={`mt-3 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    darkMode
                      ? "bg-white/10 hover:bg-white/15 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  } cursor-pointer`}
                  onClick={() => showToast("GitHub integration coming soon! 🚀", "info")}
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and filters */}
        {activeTab !== "progress" && (
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-4 py-3.5 pl-12 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    darkMode
                      ? "bg-white/10 backdrop-blur-lg border border-white/10 placeholder-gray-400 text-white"
                      : "bg-white/80 backdrop-blur-lg border border-gray-100 placeholder-gray-400 text-gray-900"
                  }`}
                />
                <FiSearch
                  className={`absolute left-4 top-4 h-5 w-5 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </div>
            </div>

            <div className="w-full md:w-64">
              <div className="relative">
                <select
                  value={currentTagFilter}
                  onChange={(e) => setCurrentTagFilter(e.target.value)}
                  className={`w-full appearance-none px-4 py-3.5 pl-12 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer ${
                    darkMode
                      ? "bg-white/10 backdrop-blur-lg border border-white/10 text-white"
                      : "bg-white/80 backdrop-blur-lg border border-gray-100 text-gray-900"
                  }`}
                >
                  <option value="">All Tags</option>
                  {allTags.map((tag) => (
                    <option
                      key={tag}
                      value={tag}
                      className={
                        darkMode
                          ? "bg-gray-800 text-white"
                          : "bg-white text-gray-800"
                      }
                    >
                      {tag}
                    </option>
                  ))}
                </select>
                <FiTag
                  className={`absolute left-4 top-4 h-5 w-5 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                  <FiFilter
                    className={darkMode ? "text-gray-400" : "text-gray-500"}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (activeTab === "journal") {
                  setIsAddingJournal(true);
                  setEditingJournalId(null);
                }
                if (activeTab === "snippets") {
                  setIsAddingSnippet(true);
                  setEditingSnippetId(null);
                }
                if (activeTab === "reminders") {
                  setIsAddingReminder(true);
                  setEditingReminderId(null);
                }
              }}
              className={`flex items-center justify-center px-5 py-3.5 rounded-xl font-medium shadow-lg transition-all cursor-pointer ${
                activeTab === "journal"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-600/20 hover:shadow-purple-600/40"
                  : activeTab === "snippets"
                  ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-teal-600/20 hover:shadow-teal-600/40"
                  : "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-pink-600/20 hover:shadow-pink-600/40"
              }`}
            >
              <FiPlus className="h-5 w-5 mr-2" />
              {activeTab === "journal" && "New Entry"}
              {activeTab === "snippets" && "New Snippet"}
              {activeTab === "reminders" && "New Reminder"}
            </button>
          </div>
        )}

        <div className="mb-16">
          {/* Journal tab */}
          {activeTab === "journal" && (
            <div className="space-y-8">
              {isAddingJournal && (
                <div
                  className={`mb-10 p-8 rounded-2xl border shadow-xl transition-all transform ${
                    darkMode
                      ? "bg-white/10 backdrop-blur-lg border-white/10"
                      : "bg-white/90 backdrop-blur-lg border-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2
                      className={`text-2xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {editingJournalId
                        ? "Edit Journal Entry"
                        : "New Journal Entry"}
                    </h2>
                    <button
                      onClick={cancelAddingJournal}
                      className={`p-2 rounded-full transition-all cursor-pointer ${
                        darkMode
                          ? "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800"
                      }`}
                      aria-label="Close form"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Coding Hours
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="24"
                      value={newJournalEntry.hours}
                      onChange={(e) =>
                        setNewJournalEntry({
                          ...newJournalEntry,
                          hours: parseInt(e.target.value) || 0,
                        })
                      }
                      className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                        darkMode
                          ? "bg-white/5 border border-white/10 text-white"
                          : "bg-white border border-gray-200 text-gray-900"
                      }`}
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      How was your coding session?
                    </label>
                    <div
                      className={`flex justify-between items-center p-4 rounded-xl ${
                        darkMode
                          ? "bg-white/5 border border-white/10"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      {[1, 2, 3, 4, 5].map((mood) => (
                        <button
                          key={mood}
                          onClick={() =>
                            setNewJournalEntry({
                              ...newJournalEntry,
                              mood: mood as 1 | 2 | 3 | 4 | 5,
                            })
                          }
                          className={`text-2xl p-3 rounded-full transition-all cursor-pointer ${
                            newJournalEntry.mood === mood
                              ? "bg-purple-500 transform scale-110 shadow-md"
                              : darkMode
                              ? "hover:bg-white/10"
                              : "hover:bg-gray-100"
                          }`}
                          aria-label={`Mood ${mood}`}
                        >
                          {renderMoodEmoji(mood as 1 | 2 | 3 | 4 | 5)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Journal Entry
                    </label>
                    <textarea
                      placeholder="What did you learn today?"
                      value={newJournalEntry.content}
                      onChange={(e) =>
                        setNewJournalEntry({
                          ...newJournalEntry,
                          content: e.target.value,
                        })
                      }
                      rows={5}
                      className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none ${
                        darkMode
                          ? "bg-white/5 border border-white/10 text-white placeholder-gray-400"
                          : "bg-white border border-gray-200 text-gray-900 placeholder-gray-400"
                      }`}
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {newJournalEntry.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                            darkMode
                              ? "bg-purple-500/30 text-purple-100"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {tag}
                          <button
                            onClick={() => removeTag("journal", index)}
                            className={`ml-1.5 cursor-pointer ${
                              darkMode
                                ? "text-purple-200 hover:text-white"
                                : "text-purple-400 hover:text-purple-900"
                            }`}
                            aria-label={`Remove tag ${tag}`}
                          >
                            <FiX className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Add a tag"
                        value={currentTagInput}
                        onChange={(e) => setCurrentTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag("journal");
                          }
                        }}
                        className={`flex-grow px-4 py-3 rounded-l-xl focus:outline-none transition-all ${
                          darkMode
                            ? "bg-white/5 border border-white/10 text-white placeholder-gray-400"
                            : "bg-white border border-gray-200 text-gray-900 placeholder-gray-400"
                        }`}
                      />
                      <button
                        onClick={() => addTag("journal")}
                        className="px-4 py-3 rounded-r-xl font-medium transition-all cursor-pointer bg-purple-600 hover:bg-purple-700 text-white"
                        aria-label="Add tag"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={cancelAddingJournal}
                      className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer ${
                        darkMode
                          ? "bg-white/5 hover:bg-white/10 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={createOrUpdateJournalEntry}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 transition-all flex items-center cursor-pointer"
                      aria-label="Save journal entry"
                    >
                      <FiSave className="h-5 w-5 mr-2" />
                      {editingJournalId ? "Update Entry" : "Save Entry"}
                    </button>
                  </div>
                </div>
              )}

              {filteredEntries.length === 0 ? (
                <div
                  className={`text-center py-16 rounded-2xl ${
                    darkMode
                      ? "bg-white/5 backdrop-blur-lg"
                      : "bg-white/60 backdrop-blur-lg"
                  }`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                      darkMode
                        ? "bg-purple-500/20 text-purple-300"
                        : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    <FiMessageSquare className="h-10 w-10" />
                  </div>
                  <h3
                    className={`text-xl md:text-2xl font-bold mb-3 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    No journal entries found
                  </h3>
                  <p
                    className={
                      darkMode
                        ? "text-gray-400 max-w-md mx-auto"
                        : "text-gray-600 max-w-md mx-auto"
                    }
                  >
                    {searchTerm || currentTagFilter
                      ? "Try changing your search or filter to find what you are looking for."
                      : "Create your first journal entry to start tracking your progress and insights."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8">
                  {filteredEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className={`p-6 rounded-2xl border shadow-lg transition-all hover:shadow-xl ${
                        darkMode
                          ? "bg-white/10 backdrop-blur-lg border-white/10 hover:bg-white/15"
                          : "bg-white/80 backdrop-blur-lg border-gray-100 hover:bg-white/95"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                        <div className="flex items-center">
                          <span
                            className={`text-4xl mr-4 p-2 rounded-full ${
                              entry.mood >= 4
                                ? darkMode
                                  ? "bg-green-500/20"
                                  : "bg-green-100"
                                : entry.mood <= 2
                                ? darkMode
                                  ? "bg-red-500/20"
                                  : "bg-red-100"
                                : darkMode
                                ? "bg-yellow-500/20"
                                : "bg-yellow-100"
                            }`}
                          >
                            {renderMoodEmoji(entry.mood)}
                          </span>
                          <div>
                            <h3
                              className={`text-xl font-bold ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {formatDate(entry.date)}
                            </h3>
                            <span
                              className={
                                darkMode
                                  ? "text-gray-300 text-sm"
                                  : "text-gray-600 text-sm"
                              }
                            >
                              {entry.hours}{" "}
                              {entry.hours === 1 ? "hour" : "hours"} of coding
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2 sm:ml-auto">
                          <button
                            onClick={() => setEditingJournalId(entry.id)}
                            className={`p-2 rounded-lg transition-all cursor-pointer ${
                              darkMode
                                ? "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800"
                            }`}
                            aria-label="Edit entry"
                          >
                            <FiEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteJournalEntry(entry.id)}
                            className={`p-2 rounded-lg transition-all cursor-pointer ${
                              darkMode
                                ? "bg-white/5 hover:bg-red-500/30 text-gray-300 hover:text-red-100"
                                : "bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-800"
                            }`}
                            aria-label="Delete entry"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <p
                        className={`mb-5 whitespace-pre-wrap leading-relaxed ${
                          darkMode ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        {entry.content}
                      </p>

                      {entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {entry.tags.map((tag, index) => (
                            <span
                              key={index}
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                darkMode
                                  ? "bg-purple-500/20 text-purple-200"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Snippets tab */}
          {activeTab === "snippets" && (
            <div className="space-y-8">
              {isAddingSnippet && (
                <div
                  className={`mb-10 p-8 rounded-2xl border shadow-xl transition-all ${
                    darkMode
                      ? "bg-white/10 backdrop-blur-lg border-white/10"
                      : "bg-white/90 backdrop-blur-lg border-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2
                      className={`text-2xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {editingSnippetId
                        ? "Edit Code Snippet"
                        : "New Code Snippet"}
                    </h2>
                    <button
                      onClick={cancelAddingSnippet}
                      className={`p-2 rounded-full transition-all cursor-pointer ${
                        darkMode
                          ? "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800"
                      }`}
                      aria-label="Close form"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="Snippet title"
                      value={newSnippet.title}
                      onChange={(e) =>
                        setNewSnippet({
                          ...newSnippet,
                          title: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${
                        darkMode
                          ? "bg-white/5 border border-white/10 text-white placeholder-gray-400"
                          : "bg-white border border-gray-200 text-gray-900 placeholder-gray-400"
                      }`}
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Language
                    </label>
                    <select
                      value={newSnippet.language}
                      onChange={(e) =>
                        setNewSnippet({
                          ...newSnippet,
                          language: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer ${
                        darkMode
                          ? "bg-white/5 border border-white/10 text-white"
                          : "bg-white border border-gray-200 text-gray-900"
                      }`}
                    >
                      <option
                        value="javascript"
                        className={darkMode ? "bg-gray-800" : "bg-white"}
                      >
                        JavaScript
                      </option>
                      <option
                        value="typescript"
                        className={darkMode ? "bg-gray-800" : "bg-white"}
                      >
                        TypeScript
                      </option>
                      <option
                        value="jsx"
                        className={darkMode ? "bg-gray-800" : "bg-white"}
                      >
                        JSX
                      </option>
                      <option
                        value="tsx"
                        className={darkMode ? "bg-gray-800" : "bg-white"}
                      >
                        TSX
                      </option>
                      <option
                        value="css"
                        className={darkMode ? "bg-gray-800" : "bg-white"}
                      >
                        CSS
                      </option>
                      <option
                        value="html"
                        className={darkMode ? "bg-gray-800" : "bg-white"}
                      >
                        HTML
                      </option>
                      <option
                        value="python"
                        className={darkMode ? "bg-gray-800" : "bg-white"}
                      >
                        Python
                      </option>
                      <option
                        value="java"
                        className={darkMode ? "bg-gray-800" : "bg-white"}
                      >
                        Java
                      </option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Code
                    </label>
                    <textarea
                      placeholder="Paste your code here"
                      value={newSnippet.code}
                      onChange={(e) =>
                        setNewSnippet({
                          ...newSnippet,
                          code: e.target.value,
                        })
                      }
                      rows={8}
                      className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-mono text-sm resize-none ${
                        darkMode
                          ? "bg-white/5 border border-white/10 text-white placeholder-gray-400"
                          : "bg-white border border-gray-200 text-gray-900 placeholder-gray-400"
                      }`}
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {newSnippet.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                            darkMode
                              ? "bg-teal-500/30 text-teal-100"
                              : "bg-teal-100 text-teal-800"
                          }`}
                        >
                          {tag}
                          <button
                            onClick={() => removeTag("snippet", index)}
                            className={`ml-1.5 cursor-pointer ${
                              darkMode
                                ? "text-teal-200 hover:text-white"
                                : "text-teal-400 hover:text-teal-900"
                            }`}
                            aria-label={`Remove tag ${tag}`}
                          >
                            <FiX className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Add a tag"
                        value={currentTagInput}
                        onChange={(e) => setCurrentTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag("snippet");
                          }
                        }}
                        className={`flex-grow px-4 py-3 rounded-l-xl focus:outline-none transition-all ${
                          darkMode
                            ? "bg-white/5 border border-white/10 text-white placeholder-gray-400"
                            : "bg-white border border-gray-200 text-gray-900 placeholder-gray-400"
                        }`}
                      />
                      <button
                        onClick={() => addTag("snippet")}
                        className="px-4 py-3 rounded-r-xl font-medium transition-all cursor-pointer bg-teal-600 hover:bg-teal-700 text-white"
                        aria-label="Add tag"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={cancelAddingSnippet}
                      className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer ${
                        darkMode
                          ? "bg-white/5 hover:bg-white/10 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={createOrUpdateSnippet}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-medium shadow-lg shadow-teal-600/20 hover:shadow-teal-600/40 transition-all flex items-center cursor-pointer"
                      aria-label="Save snippet"
                    >
                      <FiSave className="h-5 w-5 mr-2" />
                      {editingSnippetId ? "Update Snippet" : "Save Snippet"}
                    </button>
                  </div>
                </div>
              )}

              {filteredSnippets.length === 0 ? (
                <div
                  className={`text-center py-16 rounded-2xl ${
                    darkMode
                      ? "bg-white/5 backdrop-blur-lg"
                      : "bg-white/60 backdrop-blur-lg"
                  }`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                      darkMode
                        ? "bg-teal-500/20 text-teal-300"
                        : "bg-teal-100 text-teal-600"
                    }`}
                  >
                    <FiCode className="h-10 w-10" />
                  </div>
                  <h3
                    className={`text-xl md:text-2xl font-bold mb-3 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    No code snippets found
                  </h3>
                  <p
                    className={
                      darkMode
                        ? "text-gray-400 max-w-md mx-auto"
                        : "text-gray-600 max-w-md mx-auto"
                    }
                  >
                    {searchTerm || currentTagFilter
                      ? "Try changing your search or filter to find what you are looking for."
                      : "Create your first code snippet to start building your personal code library."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8">
                  {filteredSnippets.map((snippet) => (
                    <div
                      key={snippet.id}
                      className={`p-6 rounded-2xl border shadow-lg transition-all hover:shadow-xl ${
                        darkMode
                          ? "bg-white/10 backdrop-blur-lg border-white/10 hover:bg-white/15"
                          : "bg-white/80 backdrop-blur-lg border-gray-100 hover:bg-white/95"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                        <div>
                          <h3
                            className={`text-xl font-bold ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {snippet.title}
                          </h3>
                          <div className="flex items-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mr-2 ${
                                darkMode
                                  ? "bg-teal-500/30 text-teal-100"
                                  : "bg-teal-100 text-teal-800"
                              }`}
                            >
                              {snippet.language}
                            </span>
                            <span
                              className={
                                darkMode
                                  ? "text-gray-300 text-sm"
                                  : "text-gray-600 text-sm"
                              }
                            >
                              {formatDate(snippet.createdAt)}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2 sm:ml-auto">
                          <button
                            onClick={() => setEditingSnippetId(snippet.id)}
                            className={`p-2 rounded-lg transition-all cursor-pointer ${
                              darkMode
                                ? "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800"
                            }`}
                            aria-label="Edit snippet"
                          >
                            <FiEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteSnippet(snippet.id)}
                            className={`p-2 rounded-lg transition-all cursor-pointer ${
                              darkMode
                                ? "bg-white/5 hover:bg-red-500/30 text-gray-300 hover:text-red-100"
                                : "bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-800"
                            }`}
                            aria-label="Delete snippet"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mb-5 rounded-xl overflow-hidden ring-1 ring-gray-900/5 shadow-md">
                        <SyntaxHighlighter
                          language={snippet.language}
                          style={darkMode ? vscDarkPlus : prism}
                          customStyle={{
                            margin: 0,
                            borderRadius: "0.75rem",
                            fontSize: "0.875rem",
                            lineHeight: "1.5",
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                          showLineNumbers
                        >
                          {snippet.code}
                        </SyntaxHighlighter>
                      </div>

                      {snippet.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {snippet.tags.map((tag, index) => (
                            <span
                              key={index}
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                darkMode
                                  ? "bg-teal-500/20 text-teal-200"
                                  : "bg-teal-100 text-teal-800"
                              }`}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reminders tab */}
          {activeTab === "reminders" && (
            <div className="space-y-8">
              {isAddingReminder && (
                <div
                  className={`mb-10 p-8 rounded-2xl border shadow-xl transition-all ${
                    darkMode
                      ? "bg-white/10 backdrop-blur-lg border-white/10"
                      : "bg-white/90 backdrop-blur-lg border-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2
                      className={`text-2xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {editingReminderId ? "Edit Reminder" : "New Reminder"}
                    </h2>
                    <button
                      onClick={cancelAddingReminder}
                      className={`p-2 rounded-full transition-all cursor-pointer ${
                        darkMode
                          ? "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800"
                      }`}
                      aria-label="Close form"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="What do you want to be reminded of?"
                      value={newReminder.title}
                      onChange={(e) =>
                        setNewReminder({
                          ...newReminder,
                          title: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                        darkMode
                          ? "bg-white/5 border border-white/10 text-white placeholder-gray-400"
                          : "bg-white border border-gray-200 text-gray-900 placeholder-gray-400"
                      }`}
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Time
                    </label>
                    <input
                      type="time"
                      value={newReminder.time}
                      onChange={(e) =>
                        setNewReminder({
                          ...newReminder,
                          time: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all cursor-pointer ${
                        darkMode
                          ? "bg-white/5 border border-white/10 text-white"
                          : "bg-white border border-gray-200 text-gray-900"
                      }`}
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Days
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ].map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`px-2 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                            newReminder.days?.includes(day)
                              ? "bg-pink-600 text-white shadow-md shadow-pink-600/30"
                              : darkMode
                              ? "bg-white/5 text-gray-300 hover:bg-white/10"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          aria-label={`Toggle ${day}`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={cancelAddingReminder}
                      className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer ${
                        darkMode
                          ? "bg-white/5 hover:bg-white/10 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={createOrUpdateReminder}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-medium shadow-lg shadow-pink-600/20 hover:shadow-pink-600/40 transition-all flex items-center cursor-pointer"
                      aria-label="Save reminder"
                    >
                      <FiSave className="h-5 w-5 mr-2" />
                      {editingReminderId ? "Update Reminder" : "Save Reminder"}
                    </button>
                  </div>
                </div>
              )}

              {reminders.length === 0 ? (
                <div
                  className={`text-center py-16 rounded-2xl ${
                    darkMode
                      ? "bg-white/5 backdrop-blur-lg"
                      : "bg-white/60 backdrop-blur-lg"
                  }`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                      darkMode
                        ? "bg-pink-500/20 text-pink-300"
                        : "bg-pink-100 text-pink-600"
                    }`}
                  >
                    <FiClock className="h-10 w-10" />
                  </div>
                  <h3
                    className={`text-xl md:text-2xl font-bold mb-3 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    No reminders found
                  </h3>
                  <p
                    className={
                      darkMode
                        ? "text-gray-400 max-w-md mx-auto"
                        : "text-gray-600 max-w-md mx-auto"
                    }
                  >
                    Create your first reminder to establish a consistent coding
                    routine.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  {reminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className={`p-4 sm:p-6 rounded-2xl border shadow-lg transition-all hover:shadow-xl ${
                        reminder.isActive
                          ? darkMode
                            ? "bg-white/10 backdrop-blur-lg border-white/10 hover:bg-white/15"
                            : "bg-white/80 backdrop-blur-lg border-gray-100 hover:bg-white/95"
                          : darkMode
                          ? "bg-white/5 backdrop-blur-lg border-white/5 hover:bg-white/10"
                          : "bg-white/60 backdrop-blur-lg border-gray-100 hover:bg-white/80"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4 sm:mb-5">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <h3
                              className={`text-lg sm:text-xl font-bold truncate ${
                                reminder.isActive
                                  ? darkMode
                                    ? "text-white"
                                    : "text-gray-900"
                                  : darkMode
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              {reminder.title}
                            </h3>
                            <span
                              className={`self-start sm:self-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                reminder.isActive
                                  ? darkMode
                                    ? "bg-green-500/30 text-green-200"
                                    : "bg-green-100 text-green-800"
                                  : darkMode
                                  ? "bg-gray-500/30 text-gray-300"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {reminder.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <div
                            className={`flex items-center mt-2 ${
                              reminder.isActive
                                ? darkMode
                                  ? "text-pink-300"
                                  : "text-pink-600"
                                : darkMode
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            <FiClock className="h-4 w-4 mr-1.5 flex-shrink-0" />
                            <span className="text-sm sm:text-base">{formatTime(reminder.time)}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 self-end sm:self-start">
                          <button
                            onClick={() => toggleReminderStatus(reminder.id)}
                            className={`p-2 rounded-lg transition-all cursor-pointer ${
                              reminder.isActive
                                ? darkMode
                                  ? "bg-green-500/20 hover:bg-green-500/30 text-green-200"
                                  : "bg-green-100 hover:bg-green-200 text-green-800"
                                : darkMode
                                ? "bg-gray-500/20 hover:bg-gray-500/30 text-gray-300"
                                : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                            }`}
                            aria-label={
                              reminder.isActive
                                ? "Deactivate reminder"
                                : "Activate reminder"
                            }
                          >
                            {reminder.isActive ? (
                              <FiCheckCircle className="h-4 w-4" />
                            ) : (
                              <FiXCircle className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => setEditingReminderId(reminder.id)}
                            className={`p-2 rounded-lg transition-all cursor-pointer ${
                              darkMode
                                ? "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800"
                            }`}
                            aria-label="Edit reminder"
                          >
                            <FiEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteReminder(reminder.id)}
                            className={`p-2 rounded-lg transition-all cursor-pointer ${
                              darkMode
                                ? "bg-white/5 hover:bg-red-500/30 text-gray-300 hover:text-red-100"
                                : "bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-800"
                            }`}
                            aria-label="Delete reminder"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {reminder.days.map((day) => (
                          <span
                            key={day}
                            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium ${
                              reminder.isActive
                                ? darkMode
                                  ? "bg-pink-500/20 text-pink-200"
                                  : "bg-pink-100 text-pink-800"
                                : darkMode
                                ? "bg-gray-500/20 text-gray-300"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Progress tab */}
          {activeTab === "progress" && (
            <div className="space-y-8">
              <div
                className={`p-6 md:p-8 rounded-2xl border shadow-xl transition-all ${
                  darkMode
                    ? "bg-white/10 backdrop-blur-lg border-white/10"
                    : "bg-white/90 backdrop-blur-lg border-gray-100"
                }`}
              >
                <h2
                  className={`text-2xl font-bold mb-8 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Coding Activity
                </h2>
                <div className="h-80 w-full">
                  <Line data={getChartData()} options={chartOptions} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  className={`p-6 rounded-2xl border shadow-lg transition-all ${
                    darkMode
                      ? "bg-white/10 backdrop-blur-lg border-white/10"
                      : "bg-white/80 backdrop-blur-lg border-gray-100"
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <div
                      className={`p-3 rounded-full mr-4 ${
                        darkMode ? "bg-purple-500/20" : "bg-purple-100"
                      }`}
                    >
                      <FiClock
                        className={`h-6 w-6 ${
                          darkMode ? "text-purple-300" : "text-purple-600"
                        }`}
                      />
                    </div>
                    <h3
                      className={`text-lg font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Total Hours
                    </h3>
                  </div>
                  <p
                    className={`text-3xl font-bold mb-1 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {progressData.reduce((total, day) => total + day.hours, 0)}
                  </p>
                  <p
                    className={
                      darkMode
                        ? "text-gray-300 text-sm"
                        : "text-gray-600 text-sm"
                    }
                  >
                    In the last 14 days
                  </p>
                </div>

                <div
                  className={`p-6 rounded-2xl border shadow-lg transition-all ${
                    darkMode
                      ? "bg-white/10 backdrop-blur-lg border-white/10"
                      : "bg-white/80 backdrop-blur-lg border-gray-100"
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <div
                      className={`p-3 rounded-full mr-4 ${
                        darkMode ? "bg-teal-500/20" : "bg-teal-100"
                      }`}
                    >
                      <FiMessageSquare
                        className={`h-6 w-6 ${
                          darkMode ? "text-teal-300" : "text-teal-600"
                        }`}
                      />
                    </div>
                    <h3
                      className={`text-lg font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Journal Entries
                    </h3>
                  </div>
                  <p
                    className={`text-3xl font-bold mb-1 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {progressData.reduce(
                      (total, day) => total + day.entriesCreated,
                      0
                    )}
                  </p>
                  <p
                    className={
                      darkMode
                        ? "text-gray-300 text-sm"
                        : "text-gray-600 text-sm"
                    }
                  >
                    In the last 14 days
                  </p>
                </div>

                <div
                  className={`p-6 rounded-2xl border shadow-lg transition-all ${
                    darkMode
                      ? "bg-white/10 backdrop-blur-lg border-white/10"
                      : "bg-white/80 backdrop-blur-lg border-gray-100"
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <div
                      className={`p-3 rounded-full mr-4 ${
                        darkMode ? "bg-pink-500/20" : "bg-pink-100"
                      }`}
                    >
                      <FiCode
                        className={`h-6 w-6 ${
                          darkMode ? "text-pink-300" : "text-pink-600"
                        }`}
                      />
                    </div>
                    <h3
                      className={`text-lg font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Code Snippets
                    </h3>
                  </div>
                  <p
                    className={`text-3xl font-bold mb-1 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {progressData.reduce(
                      (total, day) => total + day.snippetsCreated,
                      0
                    )}
                  </p>
                  <p
                    className={
                      darkMode
                        ? "text-gray-300 text-sm"
                        : "text-gray-600 text-sm"
                    }
                  >
                    In the last 14 days
                  </p>
                </div>
              </div>

              <div
                className={`p-6 md:p-8 rounded-2xl border shadow-xl transition-all ${
                  darkMode
                    ? "bg-white/10 backdrop-blur-lg border-white/10"
                    : "bg-white/90 backdrop-blur-lg border-gray-100"
                }`}
              >
                <div className="flex items-center mb-8">
                  <div
                    className={`p-3 rounded-full mr-4 ${
                      darkMode ? "bg-amber-500/20" : "bg-amber-100"
                    }`}
                  >
                    <FiSmile
                      className={`h-6 w-6 ${
                        darkMode ? "text-amber-300" : "text-amber-600"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-lg font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Coding Mood Tracker
                  </h3>
                </div>

                <div className="grid grid-cols-5 gap-6">
                  {[5, 4, 3, 2, 1].map((mood) => {
                    const count = journalEntries.filter(
                      (entry) => entry.mood === mood
                    ).length;
                    const percentage =
                      journalEntries.length > 0
                        ? Math.round((count / journalEntries.length) * 100)
                        : 0;

                    return (
                      <div key={mood} className="flex flex-col items-center">
                        <div
                          className={`text-4xl mb-3 p-3 rounded-full ${
                            mood >= 4
                              ? darkMode
                                ? "bg-green-500/20"
                                : "bg-green-100"
                              : mood <= 2
                              ? darkMode
                                ? "bg-red-500/20"
                                : "bg-red-100"
                              : darkMode
                              ? "bg-yellow-500/20"
                              : "bg-yellow-100"
                          }`}
                        >
                          {renderMoodEmoji(mood as 1 | 2 | 3 | 4 | 5)}
                        </div>
                        <div
                          className={`h-40 w-full rounded-xl overflow-hidden flex items-end ${
                            darkMode ? "bg-white/5" : "bg-gray-100"
                          }`}
                        >
                          <div
                            className={`w-full transition-all duration-700 ease-in-out ${
                              mood === 5
                                ? "bg-gradient-to-t from-green-600 to-green-400"
                                : mood === 4
                                ? "bg-gradient-to-t from-teal-600 to-teal-400"
                                : mood === 3
                                ? "bg-gradient-to-t from-yellow-600 to-yellow-400"
                                : mood === 2
                                ? "bg-gradient-to-t from-orange-600 to-orange-400"
                                : "bg-gradient-to-t from-red-600 to-red-400"
                            }`}
                            style={{
                              height: `${percentage}%`,
                            }}
                          ></div>
                        </div>
                        <div
                          className={`mt-3 text-lg font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {percentage}%
                        </div>
                        <div
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {count} {count === 1 ? "day" : "days"}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
                  <div
                    className={`p-4 rounded-xl ${
                      darkMode ? "bg-white/5" : "bg-gray-100/60"
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <FiAward
                        className={`h-5 w-5 mr-2 ${
                          darkMode ? "text-amber-300" : "text-amber-600"
                        }`}
                      />
                      <h4
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Longest Streak
                      </h4>
                    </div>
                    <p
                      className={`text-2xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      7 days
                    </p>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Your best streak ever
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-xl ${
                      darkMode ? "bg-white/5" : "bg-gray-100/60"
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <FiBriefcase
                        className={`h-5 w-5 mr-2 ${
                          darkMode ? "text-blue-300" : "text-blue-600"
                        }`}
                      />
                      <h4
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Most Productive Day
                      </h4>
                    </div>
                    <p
                      className={`text-2xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Wednesday
                    </p>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Average of 3.5 hours
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-6 md:p-8 rounded-2xl border shadow-xl transition-all ${
                  darkMode
                    ? "bg-white/10 backdrop-blur-lg border-white/10"
                    : "bg-white/90 backdrop-blur-lg border-gray-100"
                }`}
              >
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Weekly Coding Goals
                </h2>

                <div className="space-y-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Hours Spent Coding
                        </h3>
                        <p
                          className={
                            darkMode
                              ? "text-gray-300 text-sm"
                              : "text-gray-600 text-sm"
                          }
                        >
                          Goal: 20 hours / week
                        </p>
                      </div>
                      <span
                        className={`text-lg font-semibold min-w-[60px] text-right ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        15 / 20
                      </span>
                    </div>
                    <div className={`w-full h-3 rounded-full overflow-hidden ${
                      darkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}>
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Code Snippets Created
                        </h3>
                        <p
                          className={
                            darkMode
                              ? "text-gray-300 text-sm"
                              : "text-gray-600 text-sm"
                          }
                        >
                          Goal: 5 / week
                        </p>
                      </div>
                      <span
                        className={`text-lg font-semibold min-w-[60px] text-right ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        3 / 5
                      </span>
                    </div>
                    <div className={`w-full h-3 rounded-full overflow-hidden ${
                      darkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}>
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-teal-600 transition-all duration-500"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Journal Entries
                        </h3>
                        <p
                          className={
                            darkMode
                              ? "text-gray-300 text-sm"
                              : "text-gray-600 text-sm"
                          }
                        >
                          Goal: 7 / week
                        </p>
                      </div>
                      <span
                        className={`text-lg font-semibold min-w-[60px] text-right ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        6 / 7
                      </span>
                    </div>
                    <div className={`w-full h-3 rounded-full overflow-hidden ${
                      darkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}>
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-pink-600 to-rose-600 transition-all duration-500"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* footer */}
        <footer
          className={`mt-16 py-10 border-t ${
            darkMode
              ? "border-white/10 text-gray-300"
              : "border-gray-200 text-gray-600"
          }`}
        >
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-1">
                <div className="flex items-center mb-4">
                  <div
                    className={`p-2 rounded-lg ${
                      darkMode ? "bg-purple-500/20" : "bg-purple-100"
                    }`}
                  >
                    <FiCode
                      className={`h-5 w-5 ${
                        darkMode ? "text-purple-300" : "text-purple-600"
                      }`}
                    />
                  </div>
                  <h3
                    className={`ml-2 text-xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    DevJournal
                  </h3>
                </div>
                <p
                  className={`mb-4 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Track your coding journey with the most thoughtfully designed
                  developer journal application.
                </p>
                <div className="flex space-x-3">
                  <a
                    href="#"
                    className={`p-2 rounded-full transition-colors ${
                      darkMode
                        ? "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <FiGithub className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className={`p-2 rounded-full transition-colors ${
                      darkMode
                        ? "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <FiTwitter className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className={`p-2 rounded-full transition-colors ${
                      darkMode
                        ? "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <FiLinkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>

              <div>
                <h4
                  className={`text-sm font-semibold uppercase mb-4 ${
                    darkMode ? "text-gray-200" : "text-gray-900"
                  }`}
                >
                  Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className={`text-sm hover:underline ${
                        darkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Journal
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={`text-sm hover:underline ${
                        darkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Code Snippets
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={`text-sm hover:underline ${
                        darkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Reminders
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={`text-sm hover:underline ${
                        darkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Progress Charts
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4
                  className={`text-sm font-semibold uppercase mb-4 ${
                    darkMode ? "text-gray-200" : "text-gray-900"
                  }`}
                >
                  Resources
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className={`text-sm hover:underline ${
                        darkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={`text-sm hover:underline ${
                        darkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      API
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={`text-sm hover:underline ${
                        darkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Tutorials
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={`text-sm hover:underline ${
                        darkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Support
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4
                  className={`text-sm font-semibold uppercase mb-4 ${
                    darkMode ? "text-gray-200" : "text-gray-900"
                  }`}
                >
                  Connect
                </h4>
                <div className="flex items-center mb-3">
                  <FiCoffee
                    className={`h-4 w-4 mr-2 ${
                      darkMode ? "text-amber-300" : "text-amber-600"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Buy us a coffee
                  </span>
                </div>
                <div className="flex items-center mb-3">
                  <FiHeart
                    className={`h-4 w-4 mr-2 ${
                      darkMode ? "text-pink-300" : "text-pink-600"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Become a supporter
                  </span>
                </div>
                <div className="flex items-center">
                  <FiHash
                    className={`h-4 w-4 mr-2 ${
                      darkMode ? "text-blue-300" : "text-blue-600"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    @DevJournal
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`mt-10 pt-6 border-t flex flex-col md:flex-row justify-between items-center ${
                darkMode ? "border-white/5" : "border-gray-100"
              }`}
            >
              <p
                className={`text-sm mb-4 md:mb-0 ${
                  darkMode ? "text-gray-500" : "text-gray-600"
                }`}
              >
                &copy; {new Date().getFullYear()} DevJournal. All rights
                reserved.
              </p>
              <div className="flex space-x-6">
                <a
                  href="#"
                  className={`text-sm ${
                    darkMode
                      ? "text-gray-500 hover:text-gray-300"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className={`text-sm ${
                    darkMode
                      ? "text-gray-500 hover:text-gray-300"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className={`text-sm ${
                    darkMode
                      ? "text-gray-500 hover:text-gray-300"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -30px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(20px, 30px) scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 10s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default CodingJournal;
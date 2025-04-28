"use client";

import { useState, useEffect, useMemo } from 'react';
import { faker } from '@faker-js/faker';
import { IoChevronBack } from "react-icons/io5";
import { FaGoogleScholar } from "react-icons/fa6";

type UserRole = 'professor' | 'phd_scholar';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
}

interface Comment {
  id: string;
  userId: string;
  user: User;
  content: string;
  timestamp: Date;
}

interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  content: string;
  authorId: string;
  author: User;
  publicationDate: Date;
  keywords: string[];
  citations: number;
  references: string[];
  comments: Comment[];
}

const generateFakeData = () => {
  const users: User[] = Array(15).fill(null).map((_, index) => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: index < 5 ? 'professor' : 'phd_scholar',
    avatar: faker.image.avatar(),
    department: faker.helpers.arrayElement([
      'Computer Science', 'Physics', 'Mathematics', 'Biology', 
      'Chemistry', 'Engineering', 'Economics', 'Psychology'
    ])
  }));

  const papers: ResearchPaper[] = Array(30).fill(null).map(() => {
    const authorIndex = faker.number.int({ min: 0, max: users.length - 1 });
    const author = users[authorIndex];
    const numComments = faker.number.int({ min: 0, max: 8 });
    
    const comments: Comment[] = Array(numComments).fill(null).map(() => {
      const commentUserIndex = faker.number.int({ min: 0, max: users.length - 1 });
      const commentUser = users[commentUserIndex];
      
      return {
        id: faker.string.uuid(),
        userId: commentUser.id,
        user: commentUser,
        content: faker.lorem.paragraphs({ min: 1, max: 3 }),
        timestamp: faker.date.recent({ days: 60 })
      };
    });

    const numReferences = faker.number.int({ min: 3, max: 15 });
    const references = Array(numReferences).fill(null).map(() => 
      faker.lorem.sentence({ min: 5, max: 15 })
    );

    return {
      id: faker.string.uuid(),
      title: faker.lorem.sentence({ min: 5, max: 12 }),
      abstract: faker.lorem.paragraphs({ min: 1, max: 2 }),
      content: faker.lorem.paragraphs({ min: 10, max: 20 }),
      authorId: author.id,
      author: author,
      publicationDate: faker.date.past({ years: 2 }),
      keywords: Array(faker.number.int({ min: 3, max: 8 }))
        .fill(null)
        .map(() => faker.word.noun()),
      citations: faker.number.int({ min: 0, max: 150 }),
      references: references,
      comments: comments
    };
  });

  return { users, papers };
};

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [paperFormAddShow, setPaperFormAdd] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newPaperForm, setNewPaperForm] = useState({
    title: '',
    abstract: '',
    content: '',
    keywords: '',
    references: ''
  });
  const [newComment, setNewComment] = useState('');

  const { users, papers: initialPapers } = useMemo(() => generateFakeData(), []);
  const [papers, setPapers] = useState(initialPapers);
  
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);
  
  useEffect(() => {
    if (darkMode) {document.documentElement.classList.add('dark');document.documentElement.style.setProperty('--background', '#0a0a0a');
      document.documentElement.style.setProperty('--foreground', '#ededed');
    } else {
      document.documentElement.classList.remove('dark');
      // document.documentElement.classList.remove('dark');
      document.documentElement.style.setProperty('--background', '#ffffff');
      document.documentElement.style.setProperty('--foreground', '#171717');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.getElementById('mobileMenu');
      const hamburgeButton = document.getElementById('hamburgeButton');
      
      if (mobileMenu && !mobileMenu.contains(event.target as Node) && 
          hamburgeButton && !hamburgeButton.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = (userIndex: number) => {
    setCurrentUser(users[userIndex]);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoggedIn(false);
    setSelectedPaper(null);
    setPaperFormAdd(false);
  };

  const filteredPapers = useMemo(() => {
    if (!searchQuery.trim()) return papers;
    
    const lowerQuery = searchQuery.toLowerCase();
    return papers.filter(paper => 
      paper.title.toLowerCase().includes(lowerQuery) || 
      paper.abstract.toLowerCase().includes(lowerQuery) ||
      paper.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery)) ||
      paper.author.name.toLowerCase().includes(lowerQuery) ||
      paper.author.department.toLowerCase().includes(lowerQuery)
    );
  }, [papers, searchQuery]);

  const topCitedPapers = useMemo(() => {
    return [...papers].sort((a, b) => b.citations - a.citations).slice(0, 3);
  }, [papers]);

  const recentPapers = useMemo(() => {
    return [...papers]
      .sort((a, b) => b.publicationDate.getTime() - a.publicationDate.getTime())
      .slice(0, 3);
  }, [papers]);

  const selectPaper = (paper: ResearchPaper) => {
    setSelectedPaper(paper);
    setPaperFormAdd(false);
  };

  const handleCommentSubmit = () => {
    if (!selectedPaper || !currentUser || !newComment.trim()) return;

    const comment: Comment = {
      id: faker.string.uuid(),
      userId: currentUser.id,
      user: currentUser,
      content: newComment,
      timestamp: new Date()
    };

    const updatedPaper = {
      ...selectedPaper,
      comments: [comment, ...selectedPaper.comments]
    };

    setPapers(prev => prev.map(p => 
      p.id === selectedPaper.id ? updatedPaper : p
    ));
    
    setSelectedPaper(updatedPaper);
    setNewComment('');
  };

  const handlePaperSubmit = () => {
    if (!currentUser) return;
    if (!newPaperForm.title || !newPaperForm.abstract || !newPaperForm.content) return;
    // if (!newPaperForm.title || !newPaperForm.abstract || !newPaperForm.content) return;

    const newPaper: ResearchPaper = {
      id: faker.string.uuid(),
      title: newPaperForm.title,
      abstract: newPaperForm.abstract,
      content: newPaperForm.content,
      authorId: currentUser.id,
      author: currentUser,
      publicationDate: new Date(),
      keywords: newPaperForm.keywords.split(',').map(k => k.trim()),
      citations: 0,
      references: newPaperForm.references.split('\n').filter(r => r.trim()),
      comments: []
    };

    setPapers(prev => [newPaper, ...prev]);
    setPaperFormAdd(false);
    setNewPaperForm({
      title: '',
      abstract: '',
      content: '',
      keywords: '',
      references: ''
    });
    
    setSelectedPaper(newPaper);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <header className={`sticky top-0 z-20 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between relative">
          <div className="flex items-center justify-between w-full md:w-auto mb-2 md:mb-0">
            <div className="flex items-center gap-2">
              <FaGoogleScholar className='h-8 w-8'/>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Academic Research Hub
              </h1>
            </div>
            
            <button 
              id="hamburgeButton" className="md:hidden p-2 rounded-md focus:outline-none"onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          
          <div className="hidden md:flex items-center">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-4"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            
            {loggedIn ? (
              <div className="flex items-center">
                {currentUser?.role === 'phd_scholar' && (
                  <button 
                    onClick={() => {
                      setPaperFormAdd(true);
                      setSelectedPaper(null);
                    }}
                    className="mr-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Post Research
                  </button>
                )}
                <div className="flex items-center mr-4">
                  <img 
                    src={currentUser?.avatar} 
                    alt="User avatar" 
                    className="h-8 w-8 rounded-full mr-2" 
                  />
                  <div>
                    <p className="text-sm font-medium">{currentUser?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {currentUser?.role === 'professor' ? 'Professor' : 'PhD Scholar'} • {currentUser?.department}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className={`text-sm ${darkMode ? 'text-gray-300 hover:text-red-400' : 'text-gray-600 hover:text-red-600'}`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="text-sm">
                Login as: 
                <button 
                  onClick={() => handleLogin(0)}
                  className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                >
                  Professor
                </button>
                <button 
                  onClick={() => handleLogin(5)}
                  className="ml-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md"
                >
                  PhD Scholar
                </button>
              </div>
            )}
          </div>
          
          {mobileMenuOpen && (
            <div 
              id="mobileMenu" 
              className="md:hidden absolute top-full right-0 mt-1 w-72 rounded-md shadow-lg py-1 z-50 overflow-hidden"
              style={{ 
                backgroundColor: darkMode ? 'rgb(31, 41, 55)' : 'white',
                borderColor: darkMode ? 'rgb(55, 65, 81)' : 'rgb(229, 231, 235)',
                borderWidth: '1px'
              }}
            >
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold">Theme</p>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    aria-label="Toggle dark mode"
                  >
                    {darkMode ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                </p>
              </div>
              
              {loggedIn ? (
                <>
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <img 
                        src={currentUser?.avatar} 
                        alt="User avatar" 
                        className="h-10 w-10 rounded-full mr-3" 
                      />
                      <div>
                        <p className="font-medium">{currentUser?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {currentUser?.role === 'professor' ? 'Professor' : 'PhD Scholar'} • {currentUser?.department}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {currentUser?.role === 'phd_scholar' && (
                    <button 
                      onClick={() => {
                        setPaperFormAdd(true);
                        setSelectedPaper(null);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Post New Research
                    </button>
                  )}
                  
                  <button 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-red-600 dark:text-red-400"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold mb-3">Login as:</p>
                  <div className="space-y-2">
                    <button 
                      onClick={() => {
                        handleLogin(0);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Professor
                    </button>
                    <button 
                      onClick={() => {
                        handleLogin(5);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      PhD Scholar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {loggedIn && !selectedPaper && (
          <div className="container mx-auto px-4 py-3 w-full sm:w-[50%]">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search papers by title, keywords, author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white placeholder-gray-500 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              />
            </div>
          </div>
        )}
      </header>

      {!loggedIn ? (
        <div className="container mx-auto px-4 py-12 flex flex-col items-center">
          <div className="max-w-4xl text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Academic Research Hub
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-gray-600 dark:text-gray-300">
              A platform for professors and PhD scholars to share, discover, and collaborate on research
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => handleLogin(0)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-lg font-medium flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Login as Professor
              </button>
              <button 
                onClick={() => handleLogin(5)}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-lg font-medium flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Login as PhD Scholar
              </button>
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl">
            <div className={`flex flex-col items-center p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-xl font-bold mb-2">Browse Research Papers</h2>
              <p className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Explore academic papers published by fellow researchers across departments.
              </p>
            </div>
            
            <div className={`flex flex-col items-center p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h2 className="text-xl font-bold mb-2">Contribute and Collaborate</h2>
              <p className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Share your research, receive feedback, and collaborate with your peers.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <main className="container mx-auto px-4 py-6">
          {!selectedPaper && !paperFormAddShow ? (
            <div className="flex flex-col lg:flex-row gap-6">
              <section className="lg:w-2/3">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {searchQuery ? 'Search Results' : 'All Research Papers'}
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {filteredPapers.map(paper => (
                    <div 
                      key={paper.id} 
                      onClick={() => selectPaper(paper)}
                      className={`p-4 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg ${
                        darkMode 
                          ? 'bg-gray-800 hover:bg-gray-750' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <h3 className="font-medium text-lg mb-2 md:mb-0 md:mr-6">{paper.title}</h3>
                        <div className="flex items-center space-x-4">
                          <span className={`${
                            darkMode 
                              ? 'bg-blue-900 text-blue-100' 
                              : 'bg-blue-100 text-blue-800'
                          } text-xs px-2 py-1 rounded-full whitespace-nowrap`}>
                            {paper.citations} citations
                          </span>
                          <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'} whitespace-nowrap`}>
                            {new Date(paper.publicationDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center mt-2">
                        <img 
                          src={paper.author.avatar} 
                          alt={paper.author.name} 
                          className="h-5 w-5 rounded-full mr-2" 
                        />
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {paper.author.name} • {paper.author.department}
                        </p>
                      </div>
                      <p className={`mt-3 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'} line-clamp-2`}>
                        {paper.abstract}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {paper.keywords.map((keyword, idx) => (
                          <span key={idx} className={`${
                            darkMode 
                              ? 'bg-gray-700 text-gray-200' 
                              : 'bg-gray-100 text-gray-800'
                          } text-xs px-2 py-1 rounded-full`}>
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {filteredPapers.length === 0 && (
                    <div className="text-center py-12">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500 text-lg">No research papers found matching your search criteria.</p>
                    </div>
                  )}
                </div>
              </section>
              
              
              <div className="lg:w-1/3">
                <div className="lg:sticky lg:top-36 space-y-6">
                  <section>
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Top 3 Most Cited Papers
                    </h2>
                    <div className="space-y-3">
                      {topCitedPapers.map(paper => (
                        <div 
                          key={paper.id} 
                          onClick={() => selectPaper(paper)}
                          className={`p-3 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg ${
                            darkMode 
                              ? 'bg-gray-800 hover:bg-gray-750' 
                              : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          <h3 className="font-medium text-md mb-2 line-clamp-2">{paper.title}</h3>
                          <div className="flex items-center justify-between">
                            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                              {paper.author.name}
                            </p>
                            <span className={`${
                              darkMode 
                                ? 'bg-blue-900 text-blue-100' 
                                : 'bg-blue-100 text-blue-800'
                            } text-xs px-2 py-1 rounded-full`}>
                              {paper.citations} citations
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                  
                  <section>
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Top 3 Recently Published
                    </h2>
                    <div className="space-y-3">
                      {recentPapers.map(paper => (
                        <div 
                          key={paper.id} 
                          onClick={() => selectPaper(paper)}
                          className={`p-3 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg ${
                            darkMode 
                              ? 'bg-gray-800 hover:bg-gray-750' 
                              : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          <h3 className="font-medium text-md mb-2 line-clamp-2">{paper.title}</h3>
                          <div className="flex items-center justify-between">
                            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                              {new Date(paper.publicationDate).toLocaleDateString()}
                            </p>
                            <span className={`text-xs ${
                              darkMode 
                                ? 'bg-purple-900 text-purple-100' 
                                : 'bg-purple-100 text-purple-800'
                            } px-2 py-1 rounded-full`}>
                              {paper.comments.length} comments
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          ) : paperFormAddShow ? (
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center mb-6">
                <button 
                  onClick={() => setPaperFormAdd(false)}
                  className={`mr-3 flex items-center ${
                    darkMode 
                      ? 'text-gray-300 hover:text-blue-400' 
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                 <IoChevronBack />
                  Back
                </button>
                <h2 className="text-2xl font-bold">Post New Research Paper</h2>
              </div>
              <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="mb-6">
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Title
                  </label>
                  <input 
                    type="text"
                    id="title"
                    value={newPaperForm.title}
                    onChange={(e) => setNewPaperForm({ ...newPaperForm, title: e.target.value })}
                    className={`block w-full px-3 py-2 border rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="abstract" className="block text-sm font-medium mb-2">
                    Abstract
                  </label>
                  <textarea 
                    id="abstract"
                    value={newPaperForm.abstract}
                    onChange={(e) => setNewPaperForm({ ...newPaperForm, abstract: e.target.value })}
                    rows={3}
                    className={`block w-full px-3 py-2 border rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="content" className="block text-sm font-medium mb-2">
                    Full Content
                  </label>
                  <textarea 
                    id="content"
                    value={newPaperForm.content}
                    onChange={(e) => setNewPaperForm({ ...newPaperForm, content: e.target.value })}
                    rows={10}
                    className={`block w-full px-3 py-2 border rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="keywords" className="block text-sm font-medium mb-2">
                    Keywords (comma separated)
                  </label>
                  <input 
                    type="text"
                    id="keywords"
                    value={newPaperForm.keywords}
                    onChange={(e) => setNewPaperForm({ ...newPaperForm, keywords: e.target.value })}
                    className={`block w-full px-3 py-2 border rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="references" className="block text-sm font-medium mb-2">
                    References (one per line)
                  </label>
                  <textarea 
                    id="references"
                    value={newPaperForm.references}
                    onChange={(e) => setNewPaperForm({ ...newPaperForm, references: e.target.value })}
                    rows={5}
                    className={`block w-full px-3 py-2 border rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={handlePaperSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Submit Paper
                  </button>
                </div>
              </div>
            </div>
          ) : (
            selectedPaper && (
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-6">
                  <button 
                    onClick={() => setSelectedPaper(null)}
                    className={`mr-3 flex items-center ${
                      darkMode 
                        ? 'text-gray-300 hover:text-blue-400' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <IoChevronBack />
                    Back
                  </button>
                  <h2 className="text-2xl font-bold">{selectedPaper.title}</h2>
                </div>
                <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <img 
                        src={selectedPaper.author.avatar} 
                        alt={selectedPaper.author.name} 
                        className="h-8 w-8 rounded-full mr-2" 
                      />
                      <div>
                        <p className="font-medium">{selectedPaper.author.name}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          {selectedPaper.author.role === 'professor' ? 'Professor' : 'PhD Scholar'} • {selectedPaper.author.department}
                        </p>
                      </div>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Published on {new Date(selectedPaper.publicationDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Abstract</h2>
                    <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>{selectedPaper.abstract}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Keywords</h2>
                    <div className="flex flex-wrap gap-2">
                      {selectedPaper.keywords.map((keyword, idx) => (
                        <span key={idx} className={`${
                            darkMode 
                              ? 'bg-gray-700 text-gray-200' 
                              : 'bg-gray-100 text-gray-800'
                          } px-3 py-1 rounded-full`}
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Full Content</h2>
                    <div className={`prose ${darkMode ? 'prose-invert' : ''} max-w-none`}>
                      {selectedPaper.content.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">References</h2>
                    <ul className="list-decimal pl-5 space-y-1">
                      {selectedPaper.references.map((reference, idx) => (
                        <li key={idx} className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
                          {reference}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h2 className="text-xl font-semibold mb-4">Comments & Reviews</h2>
                  
                  {loggedIn && (
                    <div className="mb-6">
                      <div className="flex items-start mb-3">
                        <img 
                          src={currentUser?.avatar} 
                          alt={currentUser?.name} 
                          className="h-8 w-8 rounded-full mr-3" 
                        />
                        <p className="text-sm font-medium">{currentUser?.name}</p>
                      </div>
                      <div className="flex">
                        <textarea 
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add your comment or review..."
                          rows={3}
                          className={`flex-1 px-3 py-2 border rounded-md ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        />
                        <button 
                          onClick={handleCommentSubmit}
                          disabled={!newComment.trim()}
                          className={`ml-2 px-4 py-2 rounded-md flex-shrink-0 ${
                            newComment.trim() 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                              : `${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'} cursor-not-allowed`
                          }`}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {selectedPaper.comments.length > 0 ? (
                      selectedPaper.comments.map(comment => (
                        <div key={comment.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} pb-4 last:border-none`}>
                          <div className="flex items-start mb-2">
                            <img 
                              src={comment.user.avatar} 
                              alt={comment.user.name} 
                              className="h-8 w-8 rounded-full mr-2" 
                            />
                            <div>
                              <p className="font-medium">{comment.user.name}</p>
                              <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                {comment.user.role === 'professor' ? 'Professor' : 'PhD Scholar'} • {new Date(comment.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="pl-10">
                            <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>{comment.content}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={`text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No comments yet. Be the first to review this paper!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </main>
      )}
      
      <footer className={`mt-12 py-6 border-t ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Academic Research Hub • All rights reserved</p>
          <p className="mt-1">A platform for professors and PhD scholars to share knowledge and collaborate</p>
        </div>
      </footer>
    </div>
  );
}
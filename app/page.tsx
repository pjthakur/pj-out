'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LockClosedIcon, SunIcon, MoonIcon, FireIcon, UsersIcon, ArrowRightIcon, HeartIcon } from '@heroicons/react/24/solid'
import { faker } from '@faker-js/faker'

const generateFakeData = () => {
  const tags = ['comedy', 'standup', 'funny', 'joke', 'laughter', 'stage fright', 
    'audience', 'performance', 'mishap', 'storytelling', 'awkward moment', 'new york', 
    'los angeles', 'tour', 'heckler', 'comeback', 'punchline', 'setup', 'mic drop',
    'improvisation', 'routine', 'special', 'open mic', 'comedy club'];

  return Array.from({ length: 8 }, (_, i) => {
    const isPaid = faker.datatype.boolean();
      
    const fullContent = faker.lorem.paragraphs(4);
    const preview = fullContent.split('.')[0] + '...';
    
    const commentCount = faker.datatype ? 
      faker.number.int({ min: 2, max: 8 }) : 
      faker.number.int({ min: 2, max: 8 });
      
    const commentsList = Array.from({ length: commentCount }, (_, j) => ({
      id: `${i}-${j}`,
      author: {
        name: faker.person ? faker.person.fullName() : faker.name.fullName(),
        avatar: faker.image.avatar()
      },
      content: faker.lorem.sentence(10),
      date: `${faker.datatype ? 
        faker.number.int({ min: 1, max: 24 }) : 
        faker.number.int({ min: 1, max: 24 })} hours ago`,
      likes: faker.datatype ? 
        faker.number.int({ min: 0, max: 50 }) : 
        faker.number.int({ min: 0, max: 50 })
    }));
    
    return {
      id: i + 1,
      author: {
        id: 100 + i,
        name: faker.person ? faker.person.fullName() : faker.name.fullName(),
        avatar: faker.image.avatar(),
        verified: faker.datatype ? faker.datatype.boolean(0.7) : faker.helpers.maybe(() => true, { probability: 0.7 })
      },
      title: faker.book.title().replace(/^./, str => str.toUpperCase()),
      preview,
      fullContent,
      isPaid,
      price: isPaid ? parseFloat(faker.finance.amount({min:2.99, max:9.99, dec:2})) : 0,
      purchaseCount: isPaid ? (faker.datatype ? 
        faker.number.int({ min: 50, max: 5000 }) : 
        faker.number.int({ min: 50, max: 5000 })) : 0,
      likes: faker.datatype ? 
        faker.number.int({ min: 10, max: 5000 }) : 
        faker.number.int({ min: 10, max: 5000 }),
      comments: commentsList,
      commentCount: commentsList.length,
      date: `${faker.datatype ? 
        faker.number.int({ min: 1, max: 30 }) : 
        faker.number.int({ min: 1, max: 30 })} days ago`,
      tags: Array.from(
        { length: faker.datatype ? 
          faker.number.int({ min: 1, max: 4 }) : 
          faker.number.int({ min: 1, max: 4 }) 
        }, 
        () => tags[faker.datatype ? 
          faker.number.int({ min: 0, max: tags.length - 1 }) : 
          faker.number.int({ min: 0, max: tags.length - 1 })]
      )
    }
  });
};

const ShimmerEffect = () => {
  return (
    <div className="animate-pulse">
      <div className={`py-12 bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900`}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto w-3/4 mb-6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-8"></div>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="h-12 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="h-12 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800">
                <div className="p-5 flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
                
                <div className="px-5">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                </div>
                
                <div className="px-5 pb-5">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                      <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [purchasedPosts, setPurchasedPosts] = useState<number[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [comedianPosts, setComedianPosts] = useState<any[]>([]);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [expandedComments, setExpandedComments] = useState<number[]>([]);
  const [newComments, setNewComments] = useState<{[key: number]: string}>({});
  const [likedComments, setLikedComments] = useState<string[]>([]);

  const handleSigninClick = () => {
    setIsPageLoading(true);

    setTimeout(() => {
      setIsUserSignedIn(prev=>!prev);
      setIsPageLoading(false);
    }, 1500);
  };

  const handleCommentLike = (commentId: string) => {
    if (likedComments.includes(commentId)) {
      setLikedComments(likedComments.filter(id => id !== commentId));
    } else {
      setLikedComments([...likedComments, commentId]);
    }
  };


  useEffect(() => {
    setComedianPosts(generateFakeData());
  }, []);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handlePurchase = (post: any) => {
    setSelectedPost(post);
    setShowPaymentModal(true);
  };

  const completePurchase = () => {
    setLoading(true);
    setTimeout(() => {
      if (selectedPost) {
        setPurchasedPosts([...purchasedPosts, selectedPost.id]);
      }
      setShowPaymentModal(false);
      setLoading(false);
    }, 1500);
  };

  const isPurchased = (postId: number) => {
    return purchasedPosts.includes(postId);
  };

  const contentReCreate = () => {
    setComedianPosts(generateFakeData());
    setLikedPosts([]);
    setExpandedComments([]);
    setNewComments({});
  };

  const handleLikePost = (postId: number) => {
    if (likedPosts.includes(postId)) {
      // Unlike post
      setLikedPosts(likedPosts.filter(id => id !== postId));
      setComedianPosts(posts => 
        posts.map(post => 
          post.id === postId ? { ...post, likes: post.likes - 1 } : post
        )
      );
    } else {
      setLikedPosts([...likedPosts, postId]);
      setComedianPosts(posts => 
        posts.map(post => 
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    }
  };

  const toggleComments = (postId: number) => {
    if (expandedComments.includes(postId)) {
      setExpandedComments(expandedComments.filter(id => id !== postId));
    } else {
      setExpandedComments([...expandedComments, postId]);
    }
  };

  const handleCommentChange = (postId: number, value: string) => {
    setNewComments({
      ...newComments,
      [postId]: value
    });
  };

  const addComment = (postId: number) => {
    if (!newComments[postId]?.trim()) return;
    
    const newComment = {
      id: `${postId}-${Date.now()}`,
      author: {
        name: "You",
        avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80"
      },
      content: newComments[postId],
      date: "Just now",
      likes: 0
    };
    
    setComedianPosts(posts => 
      posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              comments: [newComment, ...post.comments],
              commentCount: post.commentCount + 1
            } 
          : post
      )
    );
    
    setNewComments({
      ...newComments,
      [postId]: ""
    });
  };
  const handleExpploreContentClick = () => {
    const contentSection = document.querySelector('#content-section');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  if(isPageLoading) {
    return <ShimmerEffect />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md sticky top-0 z-10`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FireIcon className="h-8 w-8 text-yellow-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">LaughLounge</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
            >
              {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
            
            <button onClick={handleSigninClick} className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} px-4 py-2 rounded-md transition-colors`}>
              {isUserSignedIn ? 'Sign Out' : 'Sign In'}
            </button>
            {/* <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md transition-colors">
              Sign Up
            </button> */}
          </div>
        </div>
      </nav>

      <section className={`py-12 ${darkMode ? 'bg-gradient-to-b from-gray-800 to-gray-900' : 'bg-gradient-to-b from-amber-50 to-gray-50'}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Where Comedy Comes to Life</h1>
            <p className="text-xl mb-8 opacity-90">Exclusive jokes, stories, and insights from the world's funniest comedians.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={handleExpploreContentClick} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center">
                Explore Content <ArrowRightIcon className="ml-2 h-5 w-5" />
              </button>
              <button 
                onClick={contentReCreate}
                className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'} px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
              >
                Refresh Content
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="content-section" className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Stories</h2>
            <a href="#" className="text-amber-500 hover:text-amber-600 font-medium flex items-center">
              View all <ArrowRightIcon className="ml-1 h-4 w-4" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {comedianPosts.map(post => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`min-h-[500px] flex flex-col rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} transition-all duration-300 hover:shadow-xl`}
              >
                <div className="p-5 flex items-center space-x-4">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-bold">{post.author.name}</h3>
                      {post.author.verified && (
                        <svg className="w-4 h-4 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm opacity-70">{post.date}</p>
                  </div>
                </div>
                {/* Content */}
                <div className="px-5 flex-1 flex flex-col">
                  <h2 className="text-xl font-bold mb-3">{post.title}</h2>
                  <div className="mb-4 flex-1 flex flex-col">
                    <p>{post.preview}</p>
                    {post.isPaid && !isPurchased(post.id) && (
                      <div className="relative flex-1 flex flex-col">
                        <div className="flex-1 flex items-center justify-center min-h-0">
                          <div className="blur-sm select-none pointer-events-none bg-gray-200 dark:bg-gray-700 opacity-50 rounded-lg w-full h-full flex items-center justify-center">
                            <p className="text-transparent">{post.fullContent.substring(0, 250)}...</p>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} shadow-lg flex items-center justify-center`}>
                              <LockClosedIcon className="h-4 w-4 mr-2 text-amber-500" />
                              <span>Premium Content</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {(post.isPaid && isPurchased(post.id)) && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="mt-4"
                      >
                        <p>{post.fullContent}</p>
                      </motion.div>
                    )}
                    {!post.isPaid && (
                      <p className="mt-4 flex-1">{post.fullContent}</p>
                    )}
                  </div>
                </div>
                {/* Bottom section always at the bottom */}
                <div className="px-5 pb-5 mt-auto">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag: string, index: number) => (
                      <span key={index} className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>#{tag}</span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                      <button 
                        onClick={() => handleLikePost(post.id)}
                        className={`flex items-center text-sm transition-colors ${likedPosts.includes(post.id) ? 'text-red-500' : ''}`}
                      >
                        <HeartIcon className={`h-5 w-5 mr-1 ${likedPosts.includes(post.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} /> 
                        {post.likes}
                      </button>
                      <button 
                        onClick={() => toggleComments(post.id)} 
                        className="flex items-center text-sm opacity-70 hover:opacity-100"
                      >
                        <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                        {post.commentCount}
                      </button>
                    </div>
                    {post.isPaid && !isPurchased(post.id) && (
                      <button 
                        onClick={() => handlePurchase(post)}
                        className="flex items-center bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-lg transition-colors"
                      >
                        <span className="mr-1">${post.price}</span>
                        <div className="flex items-center text-xs opacity-80">
                          <UsersIcon className="h-3 w-3 mr-1" /> {post.purchaseCount}
                        </div>
                      </button>
                    )}
                    {post.isPaid && isPurchased(post.id) && (
                      <div className="text-sm bg-green-500 text-white px-2 py-1 rounded-lg">
                        Purchased
                      </div>
                    )}
                  </div>
                  <AnimatePresence>
                    {expandedComments.includes(post.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center mb-4">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={newComments[post.id] || ''}
                              onChange={(e) => handleCommentChange(post.id, e.target.value)}
                              placeholder="Add a comment..."
                              className={`w-full px-3 py-2 rounded-lg ${
                                darkMode 
                                  ? 'bg-gray-700 border-gray-600 focus:border-amber-500' 
                                  : 'bg-white border-gray-300 focus:border-amber-500'
                              } border focus:outline-none transition-colors`}
                              onKeyDown={(e) => e.key === 'Enter' && addComment(post.id)}
                            />
                          </div>
                          <button
                            onClick={() => addComment(post.id)}
                            disabled={!newComments[post.id]?.trim()}
                            className={`ml-2 px-3 py-2 rounded-lg ${
                              newComments[post.id]?.trim()
                                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                : `${darkMode ? 'bg-gray-700' : 'bg-gray-200'} cursor-not-allowed opacity-50`
                            } transition-colors`}
                          >
                            Post
                          </button>
                        </div>
                        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                          {post.comments.map((comment: any) => (
                            <motion.div
                              key={comment.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                            >
                              <div className="flex items-center mb-2">
                                <img
                                  src={comment.author.avatar}
                                  alt={comment.author.name}
                                  className="w-8 h-8 rounded-full mr-2"
                                />
                                <div>
                                  <div className="font-medium text-sm">{comment.author.name}</div>
                                  <div className="text-xs opacity-70">{comment.date}</div>
                                </div>
                              </div>
                              <p className="text-sm">{comment.content}</p>
                              <div className="flex items-center mt-2 text-xs">
                                <button className="flex items-center opacity-70 hover:opacity-100" onClick = {()=>handleCommentLike(comment.id)}>
                                  <HeartIcon className="h-3 w-3 mr-1" fill={`${likedComments.includes(comment.id)?"red":"#fff"}`} stroke={`${likedComments.includes(comment.id)?"red":"#fff"}`} />
                                  <span>{comment.likes}</span>
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showPaymentModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`rounded-xl shadow-2xl w-full max-w-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Complete Purchase</h3>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {selectedPost && (
                <>
                  <div className="flex items-center space-x-4 mb-4">
                    <img 
                      src={selectedPost.author.avatar}
                      alt={selectedPost.author.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold">{selectedPost.author.name}</h4>
                      <p className="text-sm opacity-70">{selectedPost.title}</p>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="flex justify-between mb-2">
                      <span>Price:</span>
                      <span className="font-bold">${selectedPost.price}</span>
                    </div>
                    <div className="flex items-center text-sm opacity-70">
                      <UsersIcon className="h-4 w-4 mr-2" />
                      <span>{selectedPost.purchaseCount} people have purchased this content</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-4">
                    <button
                      onClick={completePurchase}
                      disabled={loading}
                      className={`bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-medium flex items-center justify-center transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {loading ? (
                        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : null}
                      {loading ? 'Processing...' : `Pay $${selectedPost.price} Now`}
                    </button>
                    <button 
                      onClick={() => setShowPaymentModal(false)}
                      className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} py-3 rounded-lg transition-colors`}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className={`py-8 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} mt-12`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <FireIcon className="h-6 w-6 text-yellow-500 mr-2" />
              <span className="font-bold text-lg">LaughLounge</span>
            </div>
            <div className="flex space-x-8">
              <a href="#" className="hover:text-amber-500 transition-colors">About</a>
              <a href="#" className="hover:text-amber-500 transition-colors">For Comedians</a>
              <a href="#" className="hover:text-amber-500 transition-colors">Privacy</a>
              <a href="#" className="hover:text-amber-500 transition-colors">Terms</a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm opacity-70">
            © {new Date().getFullYear()} LaughLounge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

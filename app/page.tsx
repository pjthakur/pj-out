"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";

interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
  replies: Comment[];
  likes: number;
  likedBy: number[];
}

interface ReplyFormData {
  author: string;
  text: string;
}

const BlogWebsite: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "Alex Johnson",
      text: "This is a great article! I learned a lot about the latest tech trends.",
      date: "21 hours ago",
      likes: 0,
      likedBy: [],
      replies: [
        {
          id: 11,
          author: "Sam Lee",
          text: "I completely agree! The advancements in AI are amazing.",
          date: "19 hours ago",
          likes: 0,
          likedBy: [],
          replies: [],
        },
      ],
    },
    {
      id: 2,
      author: "Jordan Smith",
      text: "The section on cybersecurity was particularly insightful. Thanks for sharing!",
      date: "15 hours ago",
      likes: 0,
      likedBy: [],
      replies: [],
    },
  ]);
  const [newComment, setNewComment] = useState<{ author: string; text: string }>({
    author: "",
    text: "",
  });
  const [replyForms, setReplyForms] = useState<{ [key: number]: ReplyFormData }>({});
  const [expandedComments, setExpandedComments] = useState<number[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number>(1);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('darkMode') === 'true' || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('darkMode'));
      setDarkMode(isDark);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleAddComment = () => {
    if (!newComment.author.trim() || !newComment.text.trim()) {
      setNotification({ message: "Please fill out all fields", type: 'error' });
      return;
    }

    const commentWithUserId = {
      ...newComment,
      id: Date.now(),
      date: "Just now",
      replies: [],
      likes: 0,
      likedBy: [],
    };

    setComments([commentWithUserId, ...comments]);
    setNewComment({ author: "", text: "" });
    setNotification({ message: "Comment added successfully", type: 'success' });
  };

  const handleReply = (commentId: number) => {
    const replyForm = replyForms[commentId];
    if (!replyForm?.author.trim() || !replyForm?.text.trim()) {
      setNotification({ message: "Please fill out all fields", type: 'error' });
      return;
    }

    const newReply: Comment = {
      id: Date.now(),
      author: replyForm.author,
      text: replyForm.text,
      date: "Just now",
      replies: [],
      likes: 0,
      likedBy: [],
    };

    const updatedComments = comments.map((comment) =>
      comment.id === commentId
        ? { ...comment, replies: [...comment.replies, newReply] }
        : comment
    );

    setComments(updatedComments);
    setReplyForms((prev) => ({
      ...prev,
      [commentId]: { author: "", text: "" },
    }));
    setNotification({ message: "Reply added successfully", type: 'success' });
  };

  const handleDeleteComment = (commentId: number, parentId?: number) => {
    if (parentId) {
      // حذف رد من تعليق رئيسي
      setComments(comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.filter(reply => reply.id !== commentId)
          };
        }
        return comment;
      }));
    } else {
      // حذف تعليق رئيسي
      setComments(comments.filter((comment) => comment.id !== commentId));
    }
    setNotification({ message: "Comment deleted successfully", type: 'success' });
  };

  const handleLikeComment = (commentId: number) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        const hasLiked = comment.likedBy.includes(currentUserId);
        return {
          ...comment,
          likes: hasLiked ? comment.likes - 1 : comment.likes + 1,
          likedBy: hasLiked
            ? comment.likedBy.filter((id) => id !== currentUserId)
            : [...comment.likedBy, currentUserId],
        };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  const toggleReplies = (commentId: number) => {
    setExpandedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const handleNewCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewComment((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReplyFormChange = (commentId: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setReplyForms((prev) => ({
      ...prev,
      [commentId]: {
        ...prev[commentId],
        [e.target.name]: e.target.value,
      },
    }));
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-950' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'}`}>
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 dark:from-indigo-400 dark:to-purple-400">
            Article Title
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl
            aliquet nunc, quis aliquam nisl nisl eu nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet
            nunc, quis aliquam nisl nisl eu nisl.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Comments</h2>

          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <div className={`border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow ${
                darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold mr-3">
                      {comment.author[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-gray-100">{comment.author}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{comment.date}</p>
                    </div>
                  </div>
                  {comment.author !== "You" && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-gray-700 dark:text-gray-200 mb-4">{comment.text}</p>
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className={`flex items-center transition-colors ${
                      comment.likedBy.includes(currentUserId)
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                    <span>{comment.likes}</span>
                  </button>
                  <button
                    onClick={() => toggleReplies(comment.id)}
                    className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {expandedComments.includes(comment.id) ? "Hide Replies" : "View Replies"}
                  </button>
                </div>

                <AnimatePresence>
                  {expandedComments.includes(comment.id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4"
                    >
                      {comment.replies.map((reply) => (
                        <motion.div
                          key={reply.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mb-4"
                        >
                          <div className={`border rounded-xl p-4 ${
                            darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold mr-2">
                                  {reply.author[0].toUpperCase()}
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-700 dark:text-gray-100">{reply.author}</h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{reply.date}</p>
                                </div>
                              </div>
                              {reply.author !== "You" && (
                                <button
                                  onClick={() => handleDeleteComment(reply.id, comment.id)}
                                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                            <p className="text-gray-700 dark:text-gray-200">{reply.text}</p>
                          </div>
                        </motion.div>
                      ))}

                      <div className="mt-4">
                        <input
                          type="text"
                          name="author"
                          placeholder="Your name"
                          value={replyForms[comment.id]?.author || ""}
                          onChange={(e) => handleReplyFormChange(comment.id, e)}
                          className={`w-full p-2 mb-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                            darkMode ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'bg-white border-gray-300'
                          }`}
                        />
                        <textarea
                          name="text"
                          placeholder="Write a reply..."
                          value={replyForms[comment.id]?.text || ""}
                          onChange={(e) => handleReplyFormChange(comment.id, e)}
                          className={`w-full p-3 mb-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                            darkMode ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'bg-white border-gray-300'
                          }`}
                          rows={2}
                        />
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleReply(comment.id)}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm"
                        >
                          Post Reply
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Leave a Comment</h2>
          <div className={`border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow ${
            darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
          }`}>
            <input
              type="text"
              name="author"
              placeholder="Your name"
              value={newComment.author}
              onChange={handleNewCommentChange}
              className={`w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                darkMode ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'bg-white border-gray-300'
              }`}
            />
            <textarea
              name="text"
              placeholder="Write a comment..."
              value={newComment.text}
              onChange={handleNewCommentChange}
              className={`w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                darkMode ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'bg-white border-gray-300'
              }`}
              rows={4}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddComment}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm"
            >
              Post Comment
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center ${
                notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              } text-white`}
            >
              <span>{notification.message}</span>
              <button onClick={closeNotification} className="ml-4 text-white hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BlogWebsite;
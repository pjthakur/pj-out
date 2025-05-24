"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon, FiSearch, FiX, FiChevronRight, FiArrowLeft } from "react-icons/fi";

interface BlogPost {
  id: number;
  title: string;
  date: string;
  preview: string;
  content: string;
  tags: string[];
  imageUrl: string;
}


const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Getting Started with Next.js and TypeScript",
    date: "May 15, 2023",
    preview: "Learn how to set up a new project with Next.js and TypeScript for modern web development.",
    content: `
      Next.js is a React framework that enables server-side rendering and static site generation, making it perfect for building high-performance web applications.
      
      When combined with TypeScript, you get the benefits of static typing, which can help catch errors during development and improve code quality.
      
      To get started, you can use the create-next-app command with the --typescript flag to set up a new project. This will create a new directory with all the necessary files and configurations.
      
      Next.js also provides features like file-based routing, API routes, and built-in CSS support, making it a great choice for both small and large projects.
    `,
    tags: ["Next.js", "TypeScript", "Web Development"],
    imageUrl: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Building Responsive UIs with Tailwind CSS",
    date: "June 2, 2023",
    preview: "Discover how to create beautiful, responsive user interfaces using utility-first CSS with Tailwind.",
    content: `
      Tailwind CSS is a utility-first CSS framework that allows you to build custom designs without leaving your HTML. Unlike traditional CSS frameworks like Bootstrap, Tailwind doesn't provide pre-designed components.
      
      Instead, it gives you low-level utility classes that you can combine to create unique designs. This approach gives you more flexibility and control over your styling.
      
      Tailwind is also highly customizable. You can configure colors, spacing, breakpoints, and more through a configuration file. This makes it easy to maintain a consistent design system across your project.
      
      The framework also includes a responsive design system, making it simple to create layouts that work well on different screen sizes.
    `,
    tags: ["CSS", "Tailwind", "Responsive Design"],
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Animation Techniques with Framer Motion",
    date: "July 10, 2023",
    preview: "Explore how to add delightful animations to your React applications using Framer Motion.",
    content: `
      Framer Motion is a production-ready motion library for React that makes it easy to create animations for your web applications.
      
      With Framer Motion, you can animate any React component with a simple declarative syntax. The library provides components like motion.div that accept props for defining animations.
      
      Some of the key features include keyframes, variants for orchestrating complex animations, and gesture recognition for drag, hover, and tap interactions.
      
      Framer Motion also handles animation accessibility concerns automatically, such as respecting the user's preference for reduced motion.
      
      By using Framer Motion, you can create smooth, professional-looking animations without having to write complex CSS keyframes or JavaScript animation code.
    `,
    tags: ["React", "Animation", "Framer Motion"],
    imageUrl: "https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "State Management in Modern React Applications",
    date: "August 5, 2023",
    preview: "Compare different state management approaches in React and learn when to use each one.",
    content: `
      As React applications grow in complexity, managing state becomes increasingly challenging. Fortunately, there are several approaches and libraries available to help.
      
      For local component state, React's useState and useReducer hooks are often sufficient. They're simple to use and don't require additional dependencies.
      
      For sharing state between components, you can use React's Context API. This is built into React and works well for moderate-sized applications with infrequent updates.
      
      For larger applications with complex state requirements, external libraries like Redux, Zustand, or Jotai might be more appropriate. Each has its own strengths and trade-offs.
      
      The key is to choose the right tool for your specific needs. Overengineering state management can lead to unnecessary complexity, while underengineering can result in prop drilling and maintenance challenges.
    `,
    tags: ["React", "State Management", "JavaScript"],
    imageUrl: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Optimizing Performance in Next.js Applications",
    date: "September 12, 2023",
    preview: "Learn techniques to improve the speed and user experience of your Next.js websites.",
    content: `
      Performance optimization is crucial for providing a good user experience. Next.js includes several features to help you build fast web applications.
      
      Image optimization is handled through the Next.js Image component, which automatically optimizes images and serves them in modern formats like WebP.
      
      Next.js also provides automatic code splitting, which means that only the JavaScript needed for the current page is loaded. This reduces the initial bundle size and improves page load times.
      
      For data fetching, Next.js offers static generation and server-side rendering. Static generation pre-renders pages at build time, while server-side rendering generates pages on each request.
      
      You can also use incremental static regeneration to update static pages after they've been built, combining the benefits of static generation and server-side rendering.
      
      Finally, Next.js includes built-in support for performance analytics through the Next.js Analytics feature, allowing you to track and improve Core Web Vitals.
    `,
    tags: ["Next.js", "Performance", "Optimization"],
    imageUrl: "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2081&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Creating Custom React Hooks for Reusable Logic",
    date: "October 8, 2023",
    preview: "Learn how to extract and reuse stateful logic across multiple components using custom React hooks.",
    content: `
      Custom hooks are one of the most powerful features in React, allowing you to extract component logic into reusable functions.
      
      A custom hook is a JavaScript function whose name starts with "use" and that may call other hooks. This naming convention is important as it allows React to check for violations of hook rules.
      
      Custom hooks are perfect for sharing stateful logic between components without changing their structure. For example, you could create a useForm hook to handle form validation, submission, and error states.
      
      When creating custom hooks, focus on making them generic enough to be reusable but specific enough to be useful. A good custom hook solves a clear problem and has a well-defined responsibility.
      
      Remember that custom hooks can call other hooks, including built-in hooks like useState and useEffect, as well as other custom hooks. This composition allows for powerful patterns.
      
      By leveraging custom hooks, you can significantly reduce code duplication in your application and make your components cleaner and more focused on rendering.
    `,
    tags: ["React", "Custom Hooks", "JavaScript"],
    imageUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2031&auto=format&fit=crop"
  },
  {
    id: 7,
    title: "Implementing Authentication in Next.js Applications",
    date: "November 15, 2023",
    preview: "A comprehensive guide to adding secure authentication to your Next.js projects.",
    content: `
      Authentication is a critical aspect of most web applications. In Next.js, there are several approaches to implementing authentication.
      
      Next-Auth (now Auth.js) is a popular solution that provides built-in support for many authentication providers like Google, Facebook, and GitHub. It also supports email/password authentication and JWT sessions.
      
      For applications requiring more customization, you can implement your own authentication system using JWT (JSON Web Tokens) or session cookies. Next.js API routes make it straightforward to create authentication endpoints.
      
      When implementing authentication, it's important to consider both client-side and server-side protection. Client-side protection prevents unauthorized users from accessing certain pages, while server-side protection secures your API routes and data.
      
      For server-side rendering (SSR) in Next.js, you can use getServerSideProps to check authentication status and redirect unauthenticated users. For static pages, you can use client-side redirection based on the authentication state.
      
      Remember to follow security best practices like using HTTPS, implementing proper password hashing, and protecting against common vulnerabilities such as CSRF (Cross-Site Request Forgery) and XSS (Cross-Site Scripting).
    `,
    tags: ["Next.js", "Authentication", "Security"],
    imageUrl: "https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 8,
    title: "Building a Headless CMS with Next.js",
    date: "December 5, 2023",
    preview: "How to create a flexible content management system using Next.js and a headless CMS platform.",
    content: `
      A headless CMS separates the content management from the presentation layer, giving developers the freedom to build front-ends with their preferred technologies.
      
      Next.js is an excellent framework for building the front-end of a headless CMS due to its hybrid rendering capabilities. You can use static generation for content that doesn't change frequently and server-side rendering for dynamic content.
      
      There are many headless CMS platforms available, including Contentful, Sanity, Strapi, and Prismic. Each has its own features, pricing model, and developer experience.
      
      When connecting your Next.js application to a headless CMS, you'll typically use their API to fetch content. Many CMS providers offer JavaScript SDKs that simplify this process.
      
      For optimal performance, consider implementing incremental static regeneration (ISR) to update your content without rebuilding the entire site. This provides a good balance between the benefits of static generation and the freshness of content.
      
      Content preview can be implemented by creating special routes in your Next.js application that fetch draft content from your CMS. This allows content editors to preview their changes before publishing.
      
      With this approach, you get the flexibility and developer experience of a modern JavaScript framework while providing content editors with a familiar and user-friendly interface for managing content.
    `,
    tags: ["Next.js", "CMS", "Content Management"],
    imageUrl: "https://images.unsplash.com/photo-1561736778-92e52a7769ef?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 9,
    title: "Mastering CSS Grid for Modern Layouts",
    date: "January 10, 2024",
    preview: "An in-depth look at how CSS Grid can transform your approach to web layout design.",
    content: `
      CSS Grid Layout is a two-dimensional layout system that has revolutionized how we create web layouts. Unlike flexbox, which is primarily designed for one-dimensional layouts, Grid excels at creating complex two-dimensional layouts.
      
      The basic concept of Grid involves defining a container as a grid with rows and columns, then placing items within the grid. The power of Grid comes from its ability to control both rows and columns simultaneously.
      
      One of the most powerful features of Grid is the ability to create template areas. This allows you to name areas of your grid and place items in those areas, making your CSS more readable and your layouts more maintainable.
      
      Grid also provides powerful alignment capabilities. You can align items both horizontally and vertically within their grid cells, as well as align the entire grid within its container.
      
      Responsive design with Grid is straightforward using features like minmax(), auto-fill, and auto-fit. These allow you to create flexible grids that adapt to different screen sizes without media queries.
      
      For complex layouts, you can nest grids within grid items, creating highly sophisticated layouts that would be difficult or impossible with other CSS layout techniques.
      
      With browser support for CSS Grid now at over 95%, it's an essential tool for modern web development that every front-end developer should master.
    `,
    tags: ["CSS", "Grid Layout", "Web Design"],
    imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2064&auto=format&fit=crop"
  }
];

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(blogPosts);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  
  useEffect(() => {
    const savedTheme = localStorage.getItem('blog-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem('blog-theme', theme);
    document.body.style.backgroundColor = theme === 'dark' ? '#121212' : '#ffffff';
    document.body.style.color = theme === 'dark' ? '#f8f8f8' : '#121212';
  }, [theme]);

  
  useEffect(() => {
    if (selectedPost) {
      
      const scrollY = window.scrollY;
      
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'hidden';
      
      return () => {
        
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflowY = '';
        
        window.scrollTo(0, scrollY);
      };
    }
  }, [selectedPost]);

  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPosts(blogPosts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = blogPosts.filter(
        post =>
          post.title.toLowerCase().includes(query) ||
          post.preview.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query))
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery]);

  
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  
  const bgClass = theme === 'dark' ? 'bg-[#121212]' : 'bg-white';
  const textClass = theme === 'dark' ? 'text-[#f8f8f8]' : 'text-[#121212]';
  const cardBgClass = theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-[#f9f9f9]';
  const borderClass = theme === 'dark' ? 'border-[#333]' : 'border-[#eaeaea]';
  const hoverClass = theme === 'dark' ? 'hover:bg-[#252525]' : 'hover:bg-[#f1f1f1]';
  const modalBgClass = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white';

  
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      
      setTimeout(() => {
        
        const sectionPosition = section.getBoundingClientRect().top;
        
        const offsetPosition = sectionPosition + window.pageYOffset - 20; 
        
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  return (
    <div className={`min-h-screen w-full ${bgClass} ${textClass} transition-colors duration-300`}>
      <motion.header 
        className={`sticky top-0 z-50 ${bgClass} border-b ${borderClass} backdrop-blur-md bg-opacity-80`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div 
            className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text"
            whileHover={{ scale: 1.05 }}
          >
            My Personal Blog
          </motion.div>
          
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6">
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} className="hover:text-blue-500 transition-colors">Home</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }} className="hover:text-blue-500 transition-colors">About</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="hover:text-blue-500 transition-colors">Contact</a>
            </nav>
            
            <motion.button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-blue-500' : 'bg-yellow-400'} text-white md:order-last`}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
            >
              {theme === 'dark' ? <FiMoon size={20} /> : <FiSun size={20} />}
            </motion.button>
            
            <button 
              className="md:hidden focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className={`md:hidden ${cardBgClass} border-b ${borderClass}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-4 py-3">
                <nav className="flex flex-col space-y-3">
                  <a 
                    href="#home" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      setMobileMenuOpen(false);
                      scrollToSection('home');
                    }} 
                    className="hover:text-blue-500 transition-colors py-2 px-4 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    Home
                  </a>
                  <a 
                    href="#about" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      setMobileMenuOpen(false);
                      scrollToSection('about');
                    }} 
                    className="hover:text-blue-500 transition-colors py-2 px-4 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    About
                  </a>
                  <a 
                    href="#contact" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      setMobileMenuOpen(false);
                      scrollToSection('contact');
                    }} 
                    className="hover:text-blue-500 transition-colors py-2 px-4 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    Contact
                  </a>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="container mx-auto px-4 pt-4 md:pt-8 pb-4">
        <section id="home" className="mb-8 md:mb-16 mt-4 md:mt-8">
          <motion.div 
            className="relative overflow-hidden rounded-2xl h-[300px] md:h-[400px] lg:h-[500px] shadow-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/70 to-purple-600/70 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop" 
              alt="Blog Hero" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-4 md:px-6 lg:px-12">
              <motion.h1 
                className="text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 md:mb-4"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Welcome to My Blog
              </motion.h1>
              <motion.p 
                className="text-base md:text-lg lg:text-xl text-white/90 max-w-2xl"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Explore articles about web development, programming, and modern UI design trends.
              </motion.p>
            </div>
          </motion.div>
        </section>

        <motion.div 
          className={`relative mb-6 md:mb-8 ${cardBgClass} rounded-xl p-2 shadow-md`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center">
            <FiSearch className="ml-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search posts by title, content or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full p-2 pl-3 outline-none ${cardBgClass} ${textClass}`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mr-3 text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            )}
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-fr">
          <AnimatePresence>
            {filteredPosts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-16"
              >
                <p className="text-xl">No posts found matching "{searchQuery}"</p>
              </motion.div>
            ) : (
              filteredPosts.map((post) => (
                <motion.article
                  key={post.id}
                  className={`${cardBgClass} rounded-xl overflow-hidden shadow-lg border ${borderClass} ${hoverClass} transition-all duration-300 cursor-pointer flex flex-col`}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-sm text-blue-500 mb-2">{post.date}</p>
                    <h2 className="text-xl font-bold mb-3 min-h-[3.5rem] leading-tight">{post.title}</h2>
                    <p className={`mb-4 flex-grow text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {post.preview}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`text-xs px-2 py-1 rounded-full ${
                            theme === 'dark' ? 'bg-[#2a2a2a] text-blue-400' : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={`px-6 py-3 flex justify-end border-t ${borderClass}`}>
                    <span className="text-sm flex items-center text-blue-500 font-medium">
                      Read More <FiChevronRight className="ml-1" />
                    </span>
                  </div>
                </motion.article>
              ))
            )}
          </AnimatePresence>
        </div>

        <section id="about" className="mt-12 md:mt-24 py-8 md:py-16 border-t border-b">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`max-w-4xl mx-auto ${textClass}`}
          >
            <h2 className="text-3xl font-bold mb-6 md:mb-10 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">About Me</h2>
            
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
              <div className="w-full md:w-1/3">
                <div className="rounded-full overflow-hidden aspect-square shadow-lg border-4 border-blue-500">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"
                    alt="Author profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-2/3">
                <h3 className="text-xl font-bold mb-4">Hi, I'm Alex</h3>
                <p className="mb-4">I'm a passionate web developer and designer with over 5 years of experience creating modern, responsive websites and applications.</p>
                <p className="mb-4">My journey in web development started when I was in college, tinkering with HTML and CSS to create simple websites. Today, I specialize in React, Next.js, and modern front-end technologies.</p>
                <p className="mb-4">This blog is where I share my experiences, insights, and tutorials on web development, design patterns, and best practices that I've learned along the way.</p>
                
                <div className="mt-6">
                  <h4 className="font-bold mb-3">My Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'UI/UX Design', 'Framer Motion'].map((skill, index) => (
                      <span 
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${
                          theme === 'dark' ? 'bg-[#2a2a2a] text-blue-400' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
        
        <section id="contact" className="py-6 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Get In Touch</h2>
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
                Feel free to reach out with any questions, collaboration opportunities, or just to say hello. I'd love to hear from you!
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className={`p-6 md:p-8 rounded-xl ${cardBgClass} border ${borderClass}`}
              >
                <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className={`w-10 h-10 rounded-lg ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'} flex items-center justify-center mr-4`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="font-medium">hello@example.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className={`w-10 h-10 rounded-lg ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'} flex items-center justify-center mr-4`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="font-medium">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className={`w-10 h-10 rounded-lg ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'} flex items-center justify-center mr-4`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                      <p className="font-medium">San Francisco, CA</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`p-6 md:p-8 rounded-xl ${cardBgClass} border ${borderClass}`}
              >
                <h3 className="text-xl font-semibold mb-6">Office Hours</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <span className="font-medium">Monday - Friday</span>
                    <span className="text-blue-500 font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <span className="font-medium">Saturday</span>
                    <span className="text-blue-500 font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="font-medium">Sunday</span>
                    <span className="text-red-500 font-medium">Closed</span>
                  </div>
                </div>

                <div className={`mt-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-200'} border`}>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    <span className="font-medium">Note:</span> Response time during business hours is typically within 2 hours.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>

      <AnimatePresence>
        {selectedPost && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              className="absolute inset-0 bg-white/20 dark:bg-black/40 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            ></motion.div>
            
            <motion.div
              className={`${modalBgClass}/90 backdrop-blur-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl z-10 relative border border-white/20 dark:border-gray-700/50`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <button
                  onClick={() => setSelectedPost(null)}
                  className={`absolute top-4 right-4 p-2 rounded-full ${
                    theme === 'dark' ? 'bg-black/60' : 'bg-white/80'
                  } hover:bg-blue-500 hover:text-white transition-colors backdrop-blur-sm z-20 border border-white/30`}
                  aria-label="Close modal"
                >
                  <FiX size={20} />
                </button>
              </div>
              
              <div className="p-4 md:p-6 lg:p-8">
                <p className="text-sm text-blue-500 mb-2">{selectedPost.date}</p>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">{selectedPost.title}</h1>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedPost.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`text-xs px-2 py-1 rounded-full ${
                        theme === 'dark' ? 'bg-white/10 text-blue-400 border border-white/20' : 'bg-blue-100/80 text-blue-700 border border-blue-200/50'
                      } backdrop-blur-sm`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className={`prose max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
                  {selectedPost.content.split('\n').map((paragraph, idx) => {
                    const trimmedParagraph = paragraph.trim();
                    if (!trimmedParagraph) return null;
                    return (
                      <p key={idx} className="mb-4">{trimmedParagraph}</p>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className={`pb-4 ${borderClass}`}>
        <div className="container mx-auto px-4">
          
          
          <div className="text-center">
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
              © {new Date().getFullYear()} My Personal Blog. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
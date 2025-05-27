"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, type FormEvent, type ChangeEvent } from "react"
import { Plus, Moon, Sun, X } from "lucide-react"

// Theme
type Theme = "light" | "dark"
const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
}>({
  theme: "light",
  toggleTheme: () => {},
})

// Modal 
type ModalType = "about" | "contact" | "privacy" | "terms" | null
const ModalContext = createContext<{
  modalType: ModalType
  openModal: (type: ModalType) => void
  closeModal: () => void
}>({
  modalType: null,
  openModal: () => {},
  closeModal: () => {},
})

// Blog post type
type BlogPost = {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  imageUrl?: string
  category: string
}

// Sample data
const initialBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with Next.js",
    excerpt: "Learn the basics of Next.js and how to create your first application.",
    content: `
      <p>Next.js is a React framework that enables server-side rendering and generating static websites. It's a popular choice for building modern web applications.</p>
      <p>To get started with Next.js, you need to have Node.js installed on your machine. Then, you can create a new Next.js app using the following command:</p>
      <pre><code>npx create-next-app@latest my-app</code></pre>
      <p>This will create a new Next.js app in the my-app directory. You can then navigate to the directory and start the development server:</p>
      <pre><code>cd my-app\nnpm run dev</code></pre>
      <p>This will start the development server at http://localhost:3000. You can now start building your application!</p>
      <h2 class="text-black text-lg font-bold">Key Features of Next.js</h2>
      <ul>
        <li>Server-side rendering</li>
        <li>Static site generation</li>
        <li>API routes</li>
        <li>File-based routing</li>
        <li>Built-in CSS and Sass support</li>
      </ul>
      <p>Next.js provides an excellent developer experience with features like Fast Refresh, which gives you instant feedback on edits made to your React components.</p>
    `,
    author: "Jane Smith",
    date: "May 10, 2023",
    imageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "Development",
  },
  {
    id: "2",
    title: "Mastering TypeScript",
    excerpt: "Discover how TypeScript can improve your JavaScript development experience.",
    content: `
      <p>TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.</p>
      <p>TypeScript adds optional types to JavaScript that support tools for large-scale JavaScript applications for any browser, for any host, on any OS. TypeScript compiles to readable, standards-based JavaScript.</p>
      <h2 class="text-black text-lg font-bold">Why Use TypeScript?</h2>
      <p>TypeScript provides several benefits over plain JavaScript:</p>
      <ul>
        <li>Static typing</li>
        <li>Object-oriented features</li>
        <li>Compile-time errors</li>
        <li>Great tooling support</li>
        <li>Predictability</li>
      </ul>
      <p>To install TypeScript, you can use npm:</p>
      <pre><code>npm install -g typescript</code></pre>
      <p>Once installed, you can compile TypeScript files to JavaScript using the tsc command:</p>
      <pre><code>tsc filename.ts</code></pre>
      <p>This will generate a JavaScript file that you can run in any JavaScript environment.</p>
      <h2 class="text-black text-lg font-bold">TypeScript with React</h2>
      <p>TypeScript works great with React. It can help you catch errors early and provide better documentation of your components.</p>
      <p>When using TypeScript with React, you can define the props and state of your components using interfaces:</p>
      <pre><code>interface Props {\n  name: string;\n  age: number;\n}\n\nconst Person: React.FC&lt;Props&gt; = ({ name, age }) => {\n  return &lt;div&gt;{name} is {age} years old.&lt;/div&gt;;\n};</code></pre>
    `,
    author: "John Doe",
    date: "June 15, 2023",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "TypeScript",
  },
  {
    id: "3",
    title: "Responsive Design Principles",
    excerpt: "Learn how to create websites that look great on any device.",
    content: `
      <p>Responsive web design is an approach to web design that makes web pages render well on a variety of devices and window or screen sizes.</p>
      <p>The key principles of responsive design include:</p>
      <h2 class="text-black text-lg font-bold">Fluid Grids</h2>
      <p>Instead of using fixed-width layouts, responsive design uses relative units like percentages to create fluid grids. This allows the layout to adapt to different screen sizes.</p>
      <h2 class="text-black text-lg font-bold">Flexible Images</h2>
      <p>Images should also be flexible and adapt to different screen sizes. This can be achieved by setting the max-width property to 100%:</p>
      <pre><code>img {\n  max-width: 100%;\n  height: auto;\n}</code></pre>
      <h2 class="text-black text-lg font-bold">Media Queries</h2>
      <p>Media queries allow you to apply different styles based on the characteristics of the device, such as its width, height, or orientation:</p>
      <pre><code>@media (max-width: 768px) {\n  /* Styles for screens smaller than 768px */\n}</code></pre>
      <h2 class="text-black text-lg font-bold">Mobile-First Approach</h2>
      <p>A mobile-first approach means designing for mobile devices first, then progressively enhancing the design for larger screens. This ensures that your website works well on all devices, regardless of their capabilities.</p>
      <p>By following these principles, you can create websites that provide an optimal viewing experience across a wide range of devices.</p>
    `,
    author: "Emily Chen",
    date: "July 22, 2023",
    imageUrl:
      "https://images.unsplash.com/photo-1546146830-2cca9512c68e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80",
    category: "Design",
  },
  {
    id: "4",
    title: "Introduction to React Hooks",
    excerpt: "Explore the power of React Hooks and how they can simplify your code.",
    content: `
      <p>React Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 as a way to use state and other React features without writing a class.</p>
      <h2 class="text-black text-lg font-bold">useState</h2>
      <p>The useState hook lets you add state to function components:</p>
      <pre><code>import React, { useState } from 'react';\n\nfunction Counter() {\n  const [counter, setCounter] = useState(0);\n\n  return (\n    &lt;div&gt;\n      &lt;p&gt;You clicked {counter} times&lt;/p&gt;\n      &lt;button onClick={() =&gt; setCounter(counter + 1)}&gt;\n        Click me\n      &lt;/button&gt;\n    &lt;/div&gt;\n  );\n}</code></pre>
      <h2 class="text-black text-lg font-bold">useEffect</h2>
      <p>The useEffect hook lets you perform side effects in function components:</p>
      <pre><code>import React, { useState, useEffect } from 'react';\n\nfunction Example() {\n  const [counter, setCounter] = useState(0);\n\n  useEffect(() => {\n    document.title = \`You clicked \${counter} times\`;\n  });\n\n  return (\n    &lt;div&gt;\n      &lt;p&gt;You clicked {counter} times&lt;/p&gt;\n      &lt;button onClick={() =&gt; setCounter(counter + 1)}&gt;\n        Click me\n      &lt;/button&gt;\n    &lt;/div&gt;\n  );\n}</code></pre>
      <h2 class="text-black text-lg font-bold">useContext</h2>
      <p>The useContext hook lets you subscribe to React context without introducing nesting:</p>
      <pre><code>import React, { useContext } from 'react';\n\nconst ThemeContext = React.createContext('light');\n\nfunction ThemedButton() {\n  const theme = useContext(ThemeContext);\n  return &lt;button theme={theme}&gt;I am styled by theme context!&lt;/button&gt;;\n}</code></pre>
      <p>These are just a few examples of the hooks available in React. Hooks provide a more direct API to the React concepts you already know: props, state, context, refs, and lifecycle.</p>
    `,
    author: "Alex Johnson",
    date: "August 5, 2023",
    imageUrl:
      "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "React",
  },
  {
    id: "5",
    title: "CSS Grid Layout: A Complete Guide",
    excerpt: "Master CSS Grid Layout and create complex web layouts with ease.",
    content: `
      <p>CSS Grid Layout is a two-dimensional layout system designed for the web. It lets you lay out items in rows and columns, and has many features that make building complex layouts straightforward.</p>
      <h2 class="text-black text-lg font-bold">Basic Concepts</h2>
      <p>To create a grid container, you set the display property to grid:</p>
      <pre><code>.container {\n  display: grid;\n}</code></pre>
      <p>You can then define the columns and rows of the grid using the grid-template-columns and grid-template-rows properties:</p>
      <pre><code>.container {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-template-rows: 100px 200px;\n}</code></pre>
      <p>This creates a grid with three equal-width columns and two rows with heights of 100px and 200px.</p>
      <h2 class="text-black text-lg font-bold">Grid Lines</h2>
      <p>Grid lines are the lines that make up the grid. You can refer to them by their line number:</p>
      <pre><code>.item {\n  grid-column: 1 / 3;\n  grid-row: 2 / 3;\n}</code></pre>
      <p>This places the item from column line 1 to column line 3, and from row line 2 to row line 3.</p>
      <h2 class="text-black text-lg font-bold">Grid Areas</h2>
      <p>You can also name areas of the grid and place items in those areas:</p>
      <pre><code>.container {\n  display: grid;\n  grid-template-areas:\n    "header header header"\n    "sidebar content content"\n    "footer footer footer";\n}\n\n.header { grid-area: header; }\n.sidebar { grid-area: sidebar; }\n.content { grid-area: content; }\n.footer { grid-area: footer; }</code></pre>
      <p>This creates a layout with a header spanning all three columns, a sidebar in the first column of the second row, content spanning the second and third columns of the second row, and a footer spanning all three columns of the third row.</p>
      <h2 class="text-black text-lg font-bold">Responsive Grids</h2>
      <p>You can create responsive grids using the repeat function and the minmax function:</p>
      <pre><code>.container {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\n}</code></pre>
      <p>This creates as many columns as can fit in the container, where each column is at least 200px wide and takes up an equal amount of the remaining space.</p>
    `,
    author: "Sophia Lee",
    date: "September 12, 2023",
    category: "CSS",
  },
]

//categories 
const categories = [
  "Development",
  "TypeScript",
  "Design",
  "React",
  "CSS",
  "JavaScript",
  "UI/UX",
  "Backend",
  "DevOps",
  "Career",
]

// Modal 
function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY
      
      // Prevent scrolling
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
      
      // Prevent touch scrolling on mobile
      const preventTouchMove = (e: TouchEvent) => {
        e.preventDefault()
      }
      
      document.addEventListener('touchmove', preventTouchMove, { passive: false })
      
      return () => {
        // Restore scrolling
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        
        // Restore scroll position
        window.scrollTo(0, scrollY)
        
        // Remove touch event listener
        document.removeEventListener('touchmove', preventTouchMove)
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 1rem;
          animation: fadeIn 0.2s ease-out;
          overscroll-behavior: none;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .modal {
          background-color: #FFFAEC;
          color: #3D3D3D;
          border-radius: 16px;
          padding: 0;
          width: 100%;
          max-width: 520px;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: slideIn 0.3s ease-out;
          overscroll-behavior: contain;
        }
        
        .dark .modal {
          background-color: #1F1F1F;
          color: #F5ECD5;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 2rem 0 2rem;
          margin-bottom: 1.5rem;
        }
        
        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(135deg, #578E7E, #6BA293);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dark .modal-title {
          background: linear-gradient(135deg, #6BA293, #7BB3A5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 12px;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .close-button:hover {
          background-color: rgba(0, 0, 0, 0.05);
          color: #333;
          transform: scale(1.05);
        }
        
        .dark .close-button {
          color: #B0B0B0;
        }
        
        .dark .close-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: #F5ECD5;
        }
        
        .modal-content {
          padding: 0 2rem 2rem 2rem;
          overflow-y: auto;
          max-height: calc(90vh - 120px);
          overscroll-behavior: contain;
          text-align: left;
        }

        .modal-content::-webkit-scrollbar {
          width: 6px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }

        .dark .modal-content::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }

        .modal-content h4 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 2rem 0 1.25rem 0;
          color: #578E7E;
          line-height: 1.3;
          border-left: 4px solid #578E7E;
          padding-left: 1rem;
          letter-spacing: -0.025em;
        }

        .dark .modal-content h4 {
          color: #6BA293;
          border-left-color: #6BA293;
        }

        .modal-content h4:first-child {
          margin-top: 0;
        }

        .modal-content p {
          line-height: 1.7;
          margin-bottom: 1.25rem;
          color: #444;
          font-size: 1rem;
          font-weight: 400;
          text-align: left;
        }

        .dark .modal-content p {
          color: #D0D0D0;
        }

        .modal-content p:last-child {
          margin-bottom: 0;
          font-size: 0.9rem;
          color: #666;
          font-style: italic;
          font-weight: 400;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #E0E0E0;
        }

        .dark .modal-content p:last-child {
          color: #999;
          border-top-color: #444;
        }

        @media (max-width: 640px) {
          .modal {
            margin: 1rem;
            max-width: calc(100vw - 2rem);
          }

          .modal-header {
            padding: 1.5rem 1.5rem 0 1.5rem;
          }

          .modal-content {
            padding: 0 1.5rem 1.5rem 1.5rem;
          }

          .modal-title {
            font-size: 1.25rem;
          }
        }
      `}</style>

      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  )
}

// Footer Component
function Footer() {
  const { modalType, openModal, closeModal } = useContext(ModalContext)
  const { theme } = useContext(ThemeContext)

  return (
    <footer className={theme === "dark" ? "footer-dark" : "footer-light"}>
      <style jsx>{`
        footer {
          margin-top: auto;
          padding: 2rem 1.5rem;
          text-align: center;
          border-top: 1px solid;
        }
        
        .footer-light {
          border-color: #D5C8A3;
          color: #666666;
        }
        
        .footer-dark {
          border-color: #4D4D4D;
          color: #B0B0B0;
        }
        
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .footer-links {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }
        
        .footer-link {
          font-weight: 500;
          transition: opacity 0.2s ease;
          cursor: pointer;
        }
        
        .footer-link:hover {
          opacity: 0.8;
        }
        
        .copyright {
          font-size: 0.875rem;
        }
        
        @media (max-width: 640px) {
          .footer-links {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>

      <div className="footer-content">
        <div className="footer-links">
          <span className="footer-link" onClick={() => openModal("about")}>
            About
          </span>
          <span className="footer-link" onClick={() => openModal("contact")}>
            Contact
          </span>
          <span className="footer-link" onClick={() => openModal("privacy")}>
            Privacy Policy
          </span>
          <span className="footer-link" onClick={() => openModal("terms")}>
            Terms of Service
          </span>
        </div>

        <div className="copyright">© {new Date().getFullYear()} InsightBlog. All rights reserved.</div>
      </div>

      <Modal isOpen={modalType === "about"} onClose={closeModal} title="About InsightBlog">
        <p>
          InsightBlog is a premier platform for sharing knowledge and insights about web development, design, and
          technology. Our mission is to provide high-quality content that helps developers and designers stay up-to-date
          with the latest trends and best practices.
        </p>
        <p>
          Founded in 2023, InsightBlog has quickly become a trusted resource for professionals and enthusiasts alike.
          Our team of experienced writers and industry experts are dedicated to creating valuable content that educates
          and inspires.
        </p>
        <p>
          Whether you're a seasoned developer or just starting your journey in tech, InsightBlog has something for you.
          Join our community today and be part of the conversation!
        </p>
      </Modal>

      <Modal isOpen={modalType === "contact"} onClose={closeModal} title="Contact Us">
        <p className="italic">We'd love to hear from you! Please use the information below to get in touch with our team.</p>
        <div style={{ marginTop: "1rem" }}>
          <h4 className="text-black text-xl font-bold">Email</h4>
          <p>contact@insightblog.com</p>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <h4 className="text-black text-xl font-bold">Address</h4>
          <p>123 Tech Avenue, San Francisco, CA 94107</p>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <h4 className="text-black text-xl font-bold">Social Media</h4>
          <p>Follow us on Twitter, LinkedIn, and GitHub</p>
        </div>
        <div style={{ marginTop: "1.5rem" }}>
          <p className="text-gray-500">
            For business inquiries, please email business@insightblog.com. For content submissions, please email
            submissions@insightblog.com.
          </p>
        </div>
      </Modal>

      <Modal isOpen={modalType === "privacy"} onClose={closeModal} title="Privacy Policy">
        <h4 className="text-black text-xl font-bold">Information We Collect</h4>
        <p>
          We collect information you provide directly to us, such as when you create an account, subscribe to our
          newsletter, or contact us. This information may include your name, email address, and any other information
          you choose to provide.
        </p>
        <h4 className="text-black text-xl font-bold">How We Use Your Information</h4>
        <p>
          We use the information we collect to provide, maintain, and improve our services, to communicate with you, and
          to personalize your experience.
        </p>
        <h4 className="text-black text-xl font-bold">Cookies</h4>
        <p>
          We use cookies and similar technologies to collect information about your browsing activities and to
          distinguish you from other users of our website.
        </p>
        <h4 className="text-black text-xl font-bold">Data Security</h4>
        <p>
          We take reasonable measures to help protect your personal information from loss, theft, misuse, and
          unauthorized access, disclosure, alteration, and destruction.
        </p>
        <h4 className="text-black text-xl font-bold">Changes to This Policy</h4>
        <p>
          We may update this privacy policy from time to time. We will notify you of any changes by posting the new
          privacy policy on this page.
        </p>
        <p className="text-gray-500">Last updated: May 17, 2025</p>
      </Modal>

      <Modal isOpen={modalType === "terms"} onClose={closeModal} title="Terms of Service">
        <h4 className="text-black text-xl font-bold">Acceptance of Terms</h4>
        <p>
          By accessing or using InsightBlog, you agree to be bound by these Terms of Service and all applicable laws and
          regulations.
        </p>
        <h4 className="text-black text-xl font-bold">User Accounts</h4>
        <p>
          When you create an account with us, you must provide accurate and complete information. You are responsible
          for safeguarding the password and for all activities that occur under your account.
        </p>
        <h4 className="text-black text-xl font-bold">Content</h4>
        <p>
          Our website may contain content provided by third parties. We are not responsible for the content of any
          third-party websites linked to or from our website.
        </p>
        <h4 className="text-black text-xl font-bold">Intellectual Property</h4>
        <p>
          The content on InsightBlog, including text, graphics, logos, and software, is owned by InsightBlog or its
          licensors and is protected by copyright and other intellectual property laws.
        </p>
        <h4 className="text-black text-xl font-bold">Termination</h4>
        <p>
          We may terminate or suspend your account and bar access to our website immediately, without prior notice or
          liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>
        <p className="text-gray-500">Last updated: May 17, 2025</p>
      </Modal>
    </footer>
  )
}

// App Component 
export default function BlogApp() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts)
  const [currentPostId, setCurrentPostId] = useState<string | null>(null)
  const [theme, setTheme] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [isPreviewingPost, setIsPreviewingPost] = useState(false)
  const [modalType, setModalType] = useState<ModalType>(null)
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: categories[0],
    imageUrl: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize theme from localStorage on mount
  useEffect(() => {
    setTheme("light") // Always default to light mode
    setMounted(true)
  }, [])

  // Update 
  useEffect(() => {
    if (!mounted) return

    document.body.className = theme
    localStorage.setItem("theme", theme)
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  // Modal handlers
  const openModal = (type: ModalType) => {
    setModalType(type)
  }

  const closeModal = () => {
    setModalType(null)
  }

  // Find current post
  const currentPost = currentPostId ? blogPosts.find((post) => post.id === currentPostId) : null

  // Handle new post form input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewPost((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle image URL input
  const handleImageUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setNewPost((prev) => ({ ...prev, imageUrl: value }))

    // Clear error for this field if it exists
    if (errors.imageUrl) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.imageUrl
        return newErrors
      })
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!newPost.title?.trim()) {
      newErrors.title = "Title is required"
    }

    if (!newPost.excerpt?.trim()) {
      newErrors.excerpt = "Excerpt is required"
    }

    if (!newPost.content?.trim()) {
      newErrors.content = "Content is required"
    }

    if (!newPost.author?.trim()) {
      newErrors.author = "Author is required"
    }

    //  

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Create new blog post
    const newBlogPost: BlogPost = {
      id: Date.now().toString(),
      title: newPost.title!,
      excerpt: newPost.excerpt!,
      content: newPost.content!,
      author: newPost.author!,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      category: newPost.category!,
    }

    // Add imageUrl
    if (newPost.imageUrl?.trim()) {
      newBlogPost.imageUrl = newPost.imageUrl
    }

    // Add to blog posts
    setBlogPosts((prev) => [newBlogPost, ...prev])

    // Reset form
    setNewPost({
      title: "",
      excerpt: "",
      content: "",
      author: "",
      category: categories[0],
      imageUrl: "",
    })

    // Exit create mode
    setIsCreatingPost(false)
    setIsPreviewingPost(false)
  }

  // Toggle preview mode
  const togglePreview = () => {
    if (!isPreviewingPost && !validateForm()) {
      return
    }
    setIsPreviewingPost(!isPreviewingPost)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ModalContext.Provider value={{ modalType, openModal, closeModal }}>
        <div className={`blog-app ${theme}`}>
          <style jsx global>{`
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            
            html, body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              line-height: 1.6;
              font-size: 16px;
            }
            
            body {
              transition: background-color 0.3s ease, color 0.3s ease;
            }
            
            body.light {
              background-color: #FFFAEC;
              color: #3D3D3D;
            }
            
            body.dark {
              background-color: #292929;
              color: #F5ECD5;
            }
            
            a {
              text-decoration: none;
              transition: color 0.2s ease;
            }
            
            .light a {
              color: #578E7E;
            }
            
            .dark a {
              color: #6BA293;
            }
            
            img {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
            }
            
            pre {
              padding: 1rem;
              border-radius: 6px;
              overflow-x: auto;
              font-size: 0.9rem;
              margin: 1.5rem 0;
            }
            
            .light pre {
              background-color: #EAE0C9;
              color: #333;
            }
            
            .dark pre {
              background-color: #1E1E1E;
              color: #F5ECD5;
            }
            
            code {
              font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
            }
            
            h1, h2, h3, h4, h5, h6 {
              margin: 1.5rem 0 1rem;
              line-height: 1.3;
            }
            
            p {
              margin-bottom: 1.2rem;
            }
            
            ul, ol {
              margin: 1rem 0;
              padding-left: 1.5rem;
            }
            
            .blog-app {
              min-height: 100vh;
              display: flex;
              flex-direction: column;
              padding-top: 80px; /* Add padding to account for fixed header */
            }

            button {
              cursor: pointer;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            }

            input, textarea, select {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            }

            @media (max-width: 480px) {
              html, body {
                font-size: 14px;
              }
              
              h1 {
                font-size: 1.75rem;
              }
              
              h2 {
                font-size: 1.5rem;
              }
            }
          `}</style>

          <Header
            toggleTheme={toggleTheme}
            theme={theme}
            onHomeClick={() => {
              setCurrentPostId(null)
              setIsCreatingPost(false)
              setIsPreviewingPost(false)
            }}
            onNewPostClick={() => {
              setCurrentPostId(null)
              setIsCreatingPost(true)
              setIsPreviewingPost(false)
            }}
            isCreatingPost={isCreatingPost}
          />

          <main className="main-content">
            {isCreatingPost ? (
              isPreviewingPost ? (
                <PostPreview
                  post={{
                    id: "preview",
                    title: newPost.title || "Post Title",
                    excerpt: newPost.excerpt || "Post excerpt goes here...",
                    content: newPost.content || "<p>Post content goes here...</p>",
                    author: newPost.author || "Author Name",
                    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
                    imageUrl: newPost.imageUrl || undefined,
                    category: newPost.category || categories[0],
                  }}
                  onBackClick={togglePreview}
                  onPublishClick={handleSubmit}
                  theme={theme}
                />
              ) : (
                <CreatePostForm
                  post={newPost}
                  onInputChange={handleInputChange}
                  onImageUrlChange={handleImageUrlChange}
                  onSubmit={handleSubmit}
                  onPreviewClick={togglePreview}
                  onCancelClick={() => setIsCreatingPost(false)}
                  errors={errors}
                  categories={categories}
                  theme={theme}
                />
              )
            ) : currentPost ? (
              <BlogPost post={currentPost} onBackClick={() => setCurrentPostId(null)} theme={theme} />
            ) : (
              <BlogList posts={blogPosts} onPostClick={setCurrentPostId} theme={theme} />
            )}
          </main>

          <Footer />
        </div>
      </ModalContext.Provider>
    </ThemeContext.Provider>
  )
}

// Header 
function Header({
  toggleTheme,
  theme,
  onHomeClick,
  onNewPostClick,
  isCreatingPost,
}: {
  toggleTheme: () => void
  theme: Theme
  onHomeClick: () => void
  onNewPostClick: () => void
  isCreatingPost: boolean
}) {
  return (
    <header className={theme === "dark" ? "header-dark" : "header-light"}>
      <style jsx>{`
        header {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background-color: ${theme === "light" ? "#FFFAEC" : "#292929"};
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .header-light {
          border-bottom: 1px solid #D5C8A3;
        }
        
        .header-dark {
          border-bottom: 1px solid #4D4D4D;
        }
        
        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          cursor: pointer;
        }
        
        .header-light .logo {
          color: #3D3D3D;
        }
        
        .header-dark .logo {
          color: #F5ECD5;
        }
        
        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .new-post-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
          transition: all 0.2s ease;
          border: none;
          gap: 0.5rem;
        }
        
        .header-light .new-post-btn {
          background-color: #578E7E;
          color: white;
        }
        
        .header-light .new-post-btn:hover {
          background-color: #467a6b;
        }
        
        .header-dark .new-post-btn {
          background-color: #6BA293;
          color: white;
        }
        
        .header-dark .new-post-btn:hover {
          background-color: #5a9283;
        }
        
        .theme-toggle {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transition: background-color 0.2s ease;
        }
        
        .header-light .theme-toggle {
          color: #3D3D3D;
        }
        
        .header-light .theme-toggle:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .header-dark .theme-toggle {
          color: #F5ECD5;
        }
        
        .header-dark .theme-toggle:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 640px) {
          .new-post-btn span {
            display: none;
          }

          .new-post-btn {
            padding: 0.5rem;
          }
        }

        @media (max-width: 480px) {
          header {
            padding: 1rem;
          }
          
          .logo {
            font-size: 1.25rem;
          }
        }
      `}</style>

      <div className="logo" onClick={onHomeClick}>
        InsightBlog
      </div>

      <div className="header-right">
        {!isCreatingPost && (
          <button className="new-post-btn" onClick={onNewPostClick}>
            <Plus size={16} />
            <span>New Post</span>
          </button>
        )}
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? (
            <Moon size={20} />
          ) : (
            <Sun size={20} />
          )}
        </button>
      </div>
    </header>
  )
}

// Blog List Component
function BlogList({
  posts,
  onPostClick,
  theme,
}: {
  posts: BlogPost[]
  onPostClick: (id: string) => void
  theme: Theme
}) {
  return (
    <div className="blog-list">
      <style jsx>{`
        .blog-list {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        
        .blog-heading {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .blog-heading h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        
        .blog-heading p {
          color: ${theme === "light" ? "#666666" : "#B0B0B0"};
        }
        
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        @media (max-width: 768px) {
          .posts-grid {
            grid-template-columns: 1fr;
          }
          
          .blog-heading h1 {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .blog-list {
            padding: 1.5rem 0.75rem;
          }
          
          .blog-heading {
            margin-bottom: 2rem;
          }
          
          .blog-heading h1 {
            font-size: 1.75rem;
          }
        }
      `}</style>

      <div className="blog-heading">
        <h1>Welcome to InsightBlog</h1>
        <p>Discover the latest insights in web development, design, and technology</p>
      </div>

      <div className="posts-grid">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} onClick={() => onPostClick(post.id)} theme={theme} />
        ))}
      </div>
    </div>
  )
}

// Blog Card Component
function BlogCard({
  post,
  onClick,
  theme,
}: {
  post: BlogPost
  onClick: () => void
  theme: Theme
}) {
  const defaultImage =
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"

  return (
    <article
      className="blog-card"
      onClick={onClick}
      style={{
        backgroundColor: theme === "light" ? "#F5ECD5" : "#3D3D3D",
        boxShadow: theme === "light" ? "0 4px 6px rgba(0, 0, 0, 0.05)" : "0 4px 6px rgba(0, 0, 0, 0.2)",
        borderRadius: "12px",
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <style jsx>{`
        .blog-card:hover {
          transform: translateY(-5px);
          box-shadow: ${theme === "light" ? "0 10px 15px rgba(0, 0, 0, 0.1)" : "0 10px 15px rgba(0, 0, 0, 0.3)"};
        }
        
        .card-image {
          height: 200px;
          overflow: hidden;
          background-color: #e0e0e0;
          flex-shrink: 0;
        }
        
        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .blog-card:hover .card-image img {
          transform: scale(1.05);
        }
        
        .card-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        
        .card-category {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          margin-bottom: 1rem;
          background-color: ${theme === "light" ? "rgba(87, 142, 126, 0.1)" : "rgba(107, 162, 147, 0.2)"};
          color: ${theme === "light" ? "#578E7E" : "#6BA293"};
          align-self: flex-start;
        }
        
        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          line-height: 1.4;
          color: ${theme === "light" ? "#3D3D3D" : "#F5ECD5"};
        }
        
        .card-excerpt {
          margin-bottom: 1rem;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          color: ${theme === "light" ? "#666666" : "#B0B0B0"};
          flex-grow: 1;
        }
        
        .card-meta {
          display: flex;
          align-items: center;
          font-size: 0.875rem;
          color: ${theme === "light" ? "#666666" : "#B0B0B0"};
          margin-top: auto;
        }
      `}</style>

      <div className="card-image">
        <img src={post.imageUrl || defaultImage} alt={post.title} />
      </div>

      <div className="card-content">
        <span className="card-category">{post.category}</span>
        <h2 className="card-title">{post.title}</h2>
        <p className="card-excerpt">{post.excerpt}</p>
        <div className="card-meta">
          {post.author} • {post.date}
        </div>
      </div>
    </article>
  )
}

// Blog Post 
function BlogPost({
  post,
  onBackClick,
  theme,
}: {
  post: BlogPost
  onBackClick: () => void
  theme: Theme
}) {
  // 
  const safeContent = post.content.replace(/\{count\}/g, "{counter}").replace(/\{counter\}/g, "{counter}")
  const defaultImage =
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"

  return (
    <div className="blog-post">
      <style jsx>{`
        .blog-post {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        
        .post-header {
          margin-bottom: 2rem;
        }
        
        .back-button {
          display: inline-flex;
          align-items: center;
          margin-bottom: 1.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        
        .back-button:hover {
          opacity: 0.8;
        }
        
        .post-title {
          font-size: 2.5rem;
          line-height: 1.2;
          margin-bottom: 1rem;
        }
        
        .post-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          color: ${theme === "light" ? "#666666" : "#B0B0B0"};
        }
        
        .post-category {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          background-color: ${theme === "light" ? "rgba(87, 142, 126, 0.1)" : "rgba(107, 162, 147, 0.2)"};
          color: ${theme === "light" ? "#578E7E" : "#6BA293"};
        }
        
        .post-image {
          width: 100%;
          height: 400px;
          margin-bottom: 2rem;
          border-radius: 12px;
          overflow: hidden;
          background-color: #e0e0e0;
        }
        
        .post-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .post-content {
          font-size: 1.125rem;
          line-height: 1.8;
        }
        
        .post-content h2 {
          font-size: 1.75rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        .post-content ul, .post-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .post-content li {
          margin-bottom: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .post-title {
            font-size: 2rem;
          }
          
          .post-image {
            height: 300px;
          }
        }

        @media (max-width: 480px) {
          .blog-post {
            padding: 1.5rem 0.75rem;
          }
          
          .post-title {
            font-size: 1.75rem;
          }
          
          .post-image {
            height: 200px;
          }
          
          .post-content {
            font-size: 1rem;
          }
        }
      `}</style>

      <div className="post-header">
        <div className="back-button" onClick={onBackClick}>
          ← Back to all posts
        </div>

        <h1 className="post-title">{post.title}</h1>

        <div className="post-meta">
          <span>
            {post.author} • {post.date}
          </span>
          <span className="post-category">{post.category}</span>
        </div>
      </div>

      {(post.imageUrl || defaultImage) && (
        <div className="post-image">
          <img src={post.imageUrl || defaultImage} alt={post.title} />
        </div>
      )}

      <div className="post-content" dangerouslySetInnerHTML={{ __html: safeContent }} />
    </div>
  )
}

// Create Post 
function CreatePostForm({
  post,
  onInputChange,
  onImageUrlChange,
  onSubmit,
  onPreviewClick,
  onCancelClick,
  errors,
  categories,
  theme,
}: {
  post: Partial<BlogPost>
  onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onImageUrlChange: (e: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: FormEvent) => void
  onPreviewClick: () => void
  onCancelClick: () => void
  errors: Record<string, string>
  categories: string[]
  theme: Theme
}) {
  return (
    <div className="create-post">
      <style jsx>{`
        .create-post {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        
        .form-header {
          margin-bottom: 2rem;
        }
        
        .form-title {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.375rem;
          font-size: 1rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          border: 1px solid ${theme === "light" ? "#D5C8A3" : "#4D4D4D"};
          background-color: ${theme === "light" ? "white" : "#444"};
          color: ${theme === "light" ? "#3D3D3D" : "#F5ECD5"};
        }
        
        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          border-color: ${theme === "light" ? "#578E7E" : "#6BA293"};
          box-shadow: 0 0 0 3px ${theme === "light" ? "rgba(87, 142, 126, 0.2)" : "rgba(107, 162, 147, 0.2)"};
          outline: none;
        }
        
        .form-textarea {
          min-height: 200px;
          resize: vertical;
        }
        
        .error-message {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: ${theme === "light" ? "#E53935" : "#FF5252"};
        }
        
        .form-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-primary {
          background-color: ${theme === "light" ? "#578E7E" : "#6BA293"};
          color: white;
          border: none;
        }
        
        .btn-primary:hover {
          background-color: ${theme === "light" ? "#467a6b" : "#5a9283"};
        }
        
        .btn-secondary {
          background-color: transparent;
          border: 1px solid ${theme === "light" ? "#D5C8A3" : "#4D4D4D"};
          color: ${theme === "light" ? "#3D3D3D" : "#F5ECD5"};
        }
        
        .btn-secondary:hover {
          background-color: ${theme === "light" ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.1)"};
        }
        
        .image-preview {
          margin-top: 1rem;
          border-radius: 0.375rem;
          overflow: hidden;
          max-height: 200px;
        }
        
        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .helper-text {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: ${theme === "light" ? "#666666" : "#B0B0B0"};
        }

        .optional-label {
          font-size: 0.75rem;
          font-weight: normal;
          margin-left: 0.5rem;
          opacity: 0.7;
        }

        @media (max-width: 480px) {
          .create-post {
            padding: 1.5rem 0.75rem;
          }
          
          .form-buttons {
            flex-direction: column;
          }
          
          .btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="form-header">
        <h1 className="form-title">Create New Blog Post</h1>
      </div>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-input"
            value={post.title}
            onChange={onInputChange}
            placeholder="Enter post title"
          />
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="excerpt">
            Excerpt
          </label>
          <input
            type="text"
            id="excerpt"
            name="excerpt"
            className="form-input"
            value={post.excerpt}
            onChange={onInputChange}
            placeholder="Enter a short excerpt"
          />
          {errors.excerpt && <div className="error-message">{errors.excerpt}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            className="form-textarea"
            value={post.content}
            onChange={onInputChange}
            placeholder="Write your blog post content here..."
          ></textarea>
          <div className="helper-text">
            You can use HTML tags for formatting. For example, &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;li&gt;, etc.
          </div>
          {errors.content && <div className="error-message">{errors.content}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="author">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            className="form-input"
            value={post.author}
            onChange={onInputChange}
            placeholder="Enter author name"
          />
          {errors.author && <div className="error-message">{errors.author}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="category">
            Category
          </label>
          <select id="category" name="category" className="form-select" value={post.category} onChange={onInputChange}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="imageUrl">
            Image URL <span className="optional-label">(optional)</span>
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            className="form-input"
            value={post.imageUrl}
            onChange={onImageUrlChange}
            placeholder="Enter image URL (e.g., from Unsplash)"
          />
          <div className="helper-text">If no image is provided, a default image will be used.</div>

          {post.imageUrl && (
            <div className="image-preview">
              <img src={post.imageUrl || "/placeholder.svg"} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-buttons">
          <button type="button" className="btn btn-secondary" onClick={onCancelClick}>
            Cancel
          </button>
          <button type="button" className="btn btn-secondary" onClick={onPreviewClick}>
            Preview
          </button>
          <button type="submit" className="btn btn-primary">
            Publish
          </button>
        </div>
      </form>
    </div>
  )
}

// Post Preview Component
function PostPreview({
  post,
  onBackClick,
  onPublishClick,
  theme,
}: {
  post: BlogPost
  onBackClick: () => void
  onPublishClick: (e: FormEvent) => void
  theme: Theme
}) {
  const defaultImage =
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"

  return (
    <div className="blog-post">
      <style jsx>{`
        .blog-post {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        
        .post-header {
          margin-bottom: 2rem;
        }
        
        .preview-banner {
          background-color: ${theme === "light" ? "#578E7E" : "#6BA293"};
          color: white;
          text-align: center;
          padding: 0.5rem;
          border-radius: 0.375rem;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }
        
        .back-button {
          display: inline-flex;
          align-items: center;
          margin-bottom: 1.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        
        .back-button:hover {
          opacity: 0.8;
        }
        
        .post-title {
          font-size: 2.5rem;
          line-height: 1.2;
          margin-bottom: 1rem;
        }
        
        .post-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          color: ${theme === "light" ? "#666666" : "#B0B0B0"};
        }
        
        .post-category {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          background-color: ${theme === "light" ? "rgba(87, 142, 126, 0.1)" : "rgba(107, 162, 147, 0.2)"};
          color: ${theme === "light" ? "#578E7E" : "#6BA293"};
        }
        
        .post-image {
          width: 100%;
          height: 400px;
          margin-bottom: 2rem;
          border-radius: 12px;
          overflow: hidden;
          background-color: #e0e0e0;
        }
        
        .post-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .post-content {
          font-size: 1.125rem;
          line-height: 1.8;
        }
        
        .post-content h2 {
          font-size: 1.75rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        .post-content ul, .post-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .post-content li {
          margin-bottom: 0.5rem;
        }
        
        .publish-button {
          display: inline-block;
          margin-top: 2rem;
          padding: 0.75rem 1.5rem;
          background-color: ${theme === "light" ? "#578E7E" : "#6BA293"};
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .publish-button:hover {
          background-color: ${theme === "light" ? "#467a6b" : "#5a9283"};
        }
        
        @media (max-width: 768px) {
          .post-title {
            font-size: 2rem;
          }
          
          .post-image {
            height: 300px;
          }
        }

        @media (max-width: 480px) {
          .blog-post {
            padding: 1.5rem 0.75rem;
          }
          
          .post-title {
            font-size: 1.75rem;
          }
          
          .post-image {
            height: 200px;
          }
          
          .post-content {
            font-size: 1rem;
          }
        }
      `}</style>

      <div className="preview-banner">Preview Mode</div>

      <div className="post-header">
        <div className="back-button" onClick={onBackClick}>
          ← Back to editor
        </div>

        <h1 className="post-title">{post.title}</h1>

        <div className="post-meta">
          <span>
            {post.author} • {post.date}
          </span>
          <span className="post-category">{post.category}</span>
        </div>
      </div>

      {(post.imageUrl || defaultImage) && (
        <div className="post-image">
          <img src={post.imageUrl || defaultImage} alt={post.title} />
        </div>
      )}

      <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />

      <button className="publish-button" onClick={onPublishClick}>
        Publish Post
      </button>
    </div>
  )
}
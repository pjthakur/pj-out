"use client";

import { Montserrat } from 'next/font/google';
import { useState, useEffect } from "react";
import { faker } from "@faker-js/faker";
import {
  Menu,
  X,
  Edit2,
  Save,
  Eye,
  Send,
  Copy,
  ExternalLink,
  FileText,
  Code,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { Toaster, toast } from 'sonner';

const montserrat = Montserrat({ subsets: ['latin'] });

interface DocPage {
  id: string;
  title: string;
  category: string;
  content: string;
  lastUpdated: Date;
}

const generateFakeData = (): DocPage[] => {
  const categories = [
    "Authentication",
    "Users",
    "Products",
    "Orders",
    "Analytics",
    "Webhooks",
  ];

  return Array.from({ length: 20 }, (_, i) => {
    const category = categories[Math.floor(Math.random() * categories.length)];

    const content = `# ${faker.commerce.productName()} API

## Overview

This endpoint allows you to manage ${category.toLowerCase()} in your application.

\`\`\`typescript
interface ${category.slice(0, -1)} {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  ${faker.lorem.word()}: ${faker.helpers.arrayElement([
      "string",
      "number",
      "boolean",
      "object",
    ])};
  ${faker.lorem.word()}: ${faker.helpers.arrayElement([
      "string",
      "number",
      "boolean",
      "object",
    ])};
}
\`\`\`

## Endpoints

### GET /api/v1/${category.toLowerCase()}

Retrieve a list of all ${category.toLowerCase()}.

**Parameters:**

| Name  | Type   | Description |
|-------|--------|-------------|
| page  | number | Page number for pagination |
| limit | number | Number of results per page |
| sort  | string | Field to sort by           |

**Example Response:**

\`\`\`json
{
  "data": [
    {
      "id": "${faker.string.uuid()}",
      "name": "${faker.person.fullName()}",
      "created_at": "${faker.date.past().toISOString()}",
      "updated_at": "${faker.date.recent().toISOString()}"
    }
  ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10
  }
}
\`\`\`

### POST /api/v1/${category.toLowerCase()}

Create a new ${category.slice(0, -1).toLowerCase()}.

**Request Body:**

\`\`\`json
{
  "name": "string",
  "${faker.lorem.word()}": "${faker.helpers.arrayElement([
      "string",
      "number",
      "boolean",
      "object",
    ])}"
}
\`\`\`

**Example Response:**

\`\`\`json
{
  "id": "${faker.string.uuid()}",
  "name": "New ${category.slice(0, -1)}",
  "created_at": "${new Date().toISOString()}",
  "updated_at": "${new Date().toISOString()}"
}
\`\`\`
`;

    return {
      id: faker.string.uuid(),
      title: `${category} API Reference`,
      category,
      content,
      lastUpdated: faker.date.recent(),
    };
  });
};

export default function Home() {
  const [docPages, setDocPages] = useState<DocPage[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedPage, setSelectedPage] = useState<DocPage | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);

  useEffect(() => {
    const data = generateFakeData();
    setDocPages(data);
    if (data.length > 0) {
      setSelectedPage(data[0]);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (prefersDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const handleEdit = () => {
    if (selectedPage) {
      setEditedContent(selectedPage.content);
      setIsEditing(true);
      
      toast.info('Editing document', {
        description: 'You can now edit the document content.',
        icon: <Edit2 size={18} />,
      });
    }
  };

  const handleSave = () => {
    if (selectedPage) {
      const updatedPages = docPages.map((page) =>
        page.id === selectedPage.id
          ? { ...page, content: editedContent, lastUpdated: new Date() }
          : page
      );

      setDocPages(updatedPages);
      setSelectedPage({
        ...selectedPage,
        content: editedContent,
        lastUpdated: new Date(),
      });
      setIsEditing(false);
      setDeployedUrl(null);
      
      toast.success('Documentation saved successfully!', {
        description: 'Changes have been saved to the document.',
        duration: 3000,
      });
    }
  };

  const handleDeploy = () => {
    toast.loading('Deploying documentation...', {
      description: 'Please wait while we publish your changes.',
      id: 'deploy-toast',
    });
    
    setTimeout(() => {
      const fakeDeployUrl = `https://docs.${faker.internet.domainName()}/${selectedPage?.category
        .toLowerCase()
        .replace(/\s+/g, "-")}`;
      setDeployedUrl(fakeDeployUrl);
      
      toast.dismiss('deploy-toast');
      toast.success('Deployment successful!', {
        description: 'Your documentation has been published.',
        action: {
          label: 'View',
          onClick: () => window.open(fakeDeployUrl, '_blank'),
        },
      });
    }, 1500);
  };

  const pagesByCategory = docPages.reduce<Record<string, DocPage[]>>(
    (acc, page) => {
      if (!acc[page.category]) {
        acc[page.category] = [];
      }
      acc[page.category].push(page);
      return acc;
    },
    {}
  );

  return (
    <div className={`min-h-screen ${montserrat.className}`}>
      <Toaster position="top-right" expand={false} richColors closeButton />
      <div className="flex flex-col dark:bg-gray-900 dark:text-white min-h-screen">
        <header className="sticky top-0 z-30 w-full px-4 md:px-6 py-4 bg-white shadow-md dark:bg-gray-800 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden mr-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center">
              <span className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                A
              </span>
              <h1 className="ml-2 text-xl font-bold">API Docs</h1>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {isMounted && (
            <AnimatePresence>
              {(menuOpen ||
                (typeof window !== "undefined" &&
                  window.innerWidth >= 768)) && (
                <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`${
                    menuOpen ? "block" : "hidden"
                  } md:block w-64 lg:w-72 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto flex-shrink-0 fixed md:static inset-y-0 left-0 pt-16 md:pt-0 z-20`}
                >
                  <div className="p-4">
                    <div className="mb-4">
                      <h2 className="text-lg font-bold text-gray-950 dark:text-white">
                        API DOCUMENTATION
                      </h2>
                    </div>
                    <nav className="space-y-6">
                      {Object.entries(pagesByCategory).map(
                        ([category, pages]) => (
                          <div key={category} className="space-y-2">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                              {category}
                            </h3>
                            <ul className="space-y-1">
                              {pages.map((page, index) => (
                                <motion.li 
                                  key={page.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                >
                                  <button
                                    onClick={() => {
                                      setSelectedPage(page);
                                      setIsEditing(false);
                                      setMenuOpen(false);
                                      
                                      toast.info(`Viewing ${page.title}`, {
                                        description: 'Document loaded successfully',
                                        icon: <FileText size={16} />,
                                        duration: 2000,
                                      });
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                                      selectedPage?.id === page.id 
                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                                  >
                                    {page.title}
                                  </button>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        )
                      )}
                    </nav>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-4">
            {selectedPage && (
              <motion.div
                key={selectedPage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                      {selectedPage.title}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Last updated:{" "}
                      {selectedPage.lastUpdated.toLocaleDateString()} at{" "}
                      {selectedPage.lastUpdated.toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex space-x-3">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                        >
                          <X size={18} className="mr-1" /> Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center"
                        >
                          <Save size={18} className="mr-1" /> Save
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleEdit}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      >
                        <Edit2 size={18} className="mr-1" /> Edit
                      </button>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full h-[500px] p-4 border border-gray-300 dark:border-gray-700 rounded-md font-mono text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="prose dark:prose-invert max-w-none bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <style jsx global>{`
                      .prose {
                        max-width: none;
                        color: #374151;
                      }
                      .dark .prose {
                        color: #e5e7eb;
                      }
                      
                      /* Headings */
                      .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
                        font-weight: 700;
                        line-height: 1.25;
                        margin-top: 1.5em;
                        margin-bottom: 0.5em;
                      }
                      .prose h1 {
                        font-size: 2em;
                        margin-top: 0;
                      }
                      .prose h2 {
                        font-size: 1.5em;
                      }
                      .prose h3 {
                        font-size: 1.25em;
                      }
                      
                      /* Tables */
                      .prose table {
                        border-collapse: collapse;
                        width: 100%;
                        margin: 1.5em 0;
                      }
                      .prose table th,
                      .prose table td {
                        border: 1px solid #e5e7eb;
                        padding: 0.75rem;
                        text-align: left;
                      }
                      .prose th {
                        background-color: #f9fafb;
                        font-weight: 600;
                      }
                      .dark .prose th {
                        background-color: #374151;
                        border-color: #4b5563;
                      }
                      .dark .prose td,
                      .dark .prose th {
                        border-color: #4b5563;
                      }
                      
                      /* Code blocks */
                      .prose code {
                        font-family: monospace;
                        font-size: 0.9em;
                        padding: 0.2em 0.4em;
                        border-radius: 3px;
                        background-color: #f3f4f6;
                      }
                      .dark .prose code {
                        background-color:rgb(0, 0, 0);
                      }
                      .prose pre {
                        background-color:rgb(0, 0, 0);
                        border-radius: 0.375rem;
                        overflow-x: auto;
                        padding: 1rem;
                        margin: 1.5em 0;
                      }
                      .dark .prose pre {
                        background-color: rgb(0, 0, 0);
                      }
                      .prose pre code {
                        background-color: transparent;
                        border-radius: 0;
                        padding: 0;
                        font-size: 0.9em;
                        color: inherit;
                      }
                      
                      /* Lists */
                      .prose ul, .prose ol {
                        margin: 1.25em 0;
                        padding-left: 1.625em;
                      }
                      .prose li {
                        margin: 0.5em 0;
                      }
                      .prose ul {
                        list-style-type: disc;
                      }
                      .prose ol {
                        list-style-type: decimal;
                      }
                      
                      /* Blockquotes */
                      .prose blockquote {
                        border-left: 4px solid #e5e7eb;
                        padding-left: 1rem;
                        font-style: italic;
                        margin: 1.5em 0;
                        color: #6b7280;
                      }
                      .dark .prose blockquote {
                        border-color: #4b5563;
                        color: #9ca3af;
                      }
                      
                      /* Strong and emphasis */
                      .prose strong {
                        font-weight: 700;
                      }
                      .prose em {
                        font-style: italic;
                      }
                    `}</style>
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]} 
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        code({inline, className, children, ...props}: any) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <pre className={`language-${match[1]}`}>
                              <code className={`language-${match[1]}`} {...props}>
                                {children}
                              </code>
                            </pre>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {selectedPage.content}
                    </ReactMarkdown>
                  </motion.div>
                )}

                <AnimatePresence>
                  {deployedUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mt-6 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-md"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-green-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                            Successfully deployed!
                          </h3>
                          <div className="mt-2 flex items-center">
                            <input
                              readOnly
                              value={deployedUrl}
                              className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(deployedUrl);
                              }}
                              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-l-0 border-gray-300 dark:border-gray-700 rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-600"
                              title="Copy to clipboard"
                            >
                              <Copy size={16} />
                            </button>
                            <a
                              href={deployedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                              title="Open in new tab"
                            >
                              <ExternalLink size={16} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div 
                  className="flex justify-end mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <button
                    onClick={handleDeploy}
                    disabled={isEditing}
                    className={`px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium flex items-center group ${
                      isEditing 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-green-700'
                    }`}
                  >
                    <Send size={18} className={`mr-2 ${!isEditing && 'group-hover:translate-x-1'} transition-transform`} /> 
                    Deploy changes
                  </button>
                </motion.div>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
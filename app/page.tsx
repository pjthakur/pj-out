"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Inter, Space_Grotesk } from "next/font/google"
import Head from "next/head"
import dynamic from 'next/dynamic'
import { ActionMeta, SingleValue } from 'react-select'

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: '--font-space-grotesk',
})

type RequestTypeOption = {
  value: string;
  label: string;
}

const Select = dynamic(() => import('react-select'), {
  ssr: false,
  loading: () => (
    <select className="w-32 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded-md px-3 py-2">
      <option value="GET">GET</option>
    </select>
  )
}) as React.ComponentType<any>

const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-in-out animate-slide-up">
        <div className="flex items-center p-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-purple-600 dark:text-purple-400"
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
          </div>
          <div className="ml-3">
            <p className="text-sm font-space-grotesk font-medium text-gray-900 dark:text-white">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto -mx-1.5 -my-1.5 bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 inline-flex h-8 w-8"
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1">
          <div className="bg-purple-600 h-1 w-full animate-progress"></div>
        </div>
      </div>
    </div>
  );
};

const styles = `
  @keyframes slide-up {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes progress {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }

  .animate-slide-up {
    animation: slide-up 0.3s ease-out;
  }

  .animate-progress {
    animation: progress 3s linear forwards;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default function ApiPlayground() {
  const [url, setUrl] = useState("")
  const [method, setMethod] = useState("GET")
  const [headers, setHeaders] = useState("")
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<{
    status?: number
    statusText?: string
    headers?: Record<string, string>
    data?: any
    error?: string
    time?: number
  }>({})
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isUrlFocused, setIsUrlFocused] = useState(false)
  const [isHeadersFocused, setIsHeadersFocused] = useState(false)
  const [isBodyFocused, setIsBodyFocused] = useState(false)
  const responseRef = useRef<HTMLDivElement>(null)
  const responseDataRef = useRef<HTMLPreElement>(null)
  const [showToast, setShowToast] = useState(false)

  const requestTypeOptions: RequestTypeOption[] = [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'DELETE', label: 'DELETE' },
    { value: 'PATCH', label: 'PATCH' },
    { value: 'HEAD', label: 'HEAD' },
    { value: 'OPTIONS', label: 'OPTIONS' },
  ]

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
      borderColor: isDarkMode ? '#1e293b' : '#e5e7eb',
      color: isDarkMode ? '#f3f4f6' : '#111827',
      boxShadow: state.isFocused ? `0 0 0 1px ${isDarkMode ? '#8b5cf6' : '#8b5cf6'}` : 'none',
      '&:hover': {
        borderColor: isDarkMode ? '#8b5cf6' : '#8b5cf6',
      },
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? (isDarkMode ? '#8b5cf6' : '#8b5cf6')
        : state.isFocused
          ? (isDarkMode ? '#1e293b' : '#f3f4f6')
          : (isDarkMode ? '#0f172a' : '#ffffff'),
      color: state.isSelected
        ? 'white'
        : (isDarkMode ? '#f3f4f6' : '#111827'),
      '&:active': {
        backgroundColor: isDarkMode ? '#8b5cf6' : '#8b5cf6',
      },
    }),
    singleValue: (base: any) => ({
      ...base,
      color: isDarkMode ? '#f3f4f6' : '#111827',
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
      borderColor: isDarkMode ? '#1e293b' : '#e5e7eb',
    }),
    input: (base: any) => ({
      ...base,
      color: isDarkMode ? '#f3f4f6' : '#111827',
    }),
  }

  const parseHeaders = (headersString: string): Record<string, string> => {
    if (!headersString.trim()) return {}

    const result: Record<string, string> = {}
    const lines = headersString.split("\n")

    lines.forEach((line) => {
      const [key, value] = line.split(":", 2).map((part) => part.trim())
      if (key && value) {
        result[key] = value
      }
    })

    return result
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      setResponse({ error: "Please enter a URL" })
      return
    }

    setLoading(true)
    setResponse({})

    const startTime = performance.now()

    try {
      const parsedHeaders = parseHeaders(headers)

      const options: RequestInit = {
        method,
        headers: {
          ...parsedHeaders,
          ...(method !== "GET" && method !== "HEAD" && body && !parsedHeaders["Content-Type"]
            ? { "Content-Type": "application/json" }
            : {}),
        },
      }
      if (method !== "GET" && method !== "HEAD" && body) {
        try {
          const parsedBody = JSON.parse(body)
          options.body = JSON.stringify(parsedBody)
        } catch (e) {
          options.body = body
        }
      }

      const fetchResponse = await fetch(url, options)
      const responseHeaders: Record<string, string> = {}

      fetchResponse.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      let data
      const contentType = fetchResponse.headers.get("content-type") || ""

      if (contentType.includes("application/json")) {
        data = await fetchResponse.json()
      } else if (contentType.includes("text/")) {
        data = await fetchResponse.text()
      } else {
        data = `[Binary data: ${contentType}]`
      }

      const endTime = performance.now()

      setResponse({
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        headers: responseHeaders,
        data,
        time: Math.round(endTime - startTime),
      })

      if (responseRef.current) {
        responseRef.current.scrollIntoView({ behavior: "smooth" })
      }
    } catch (error) {
      const endTime = performance.now()
      setResponse({
        error: `Request failed: ${error instanceof Error ? error.message : String(error)}`,
        time: Math.round(endTime - startTime),
      })
    } finally {
      setLoading(false)
    }
  }

  const formatJSON = (data: any): string => {
    try {
      return JSON.stringify(data, null, 2)
    } catch (e) {
      return String(data)
    }
  }

  const getStatusColor = (status?: number): string => {
    if (!status) return "text-gray-500"
    if (status >= 200 && status < 300) return "text-green-500"
    if (status >= 300 && status < 400) return "text-blue-500"
    if (status >= 400 && status < 500) return "text-yellow-500"
    return "text-red-500"
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(prefersDark)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  const copyToClipboard = () => {
    if (responseDataRef.current && response.data) {
      const textToCopy = typeof response.data === "object" ? formatJSON(response.data) : String(response.data)
      navigator.clipboard.writeText(textToCopy).then(() => {
        setShowToast(true)
      })
    }
  }

  const exampleApis = [
    {
      name: "Get a post",
      url: "https://jsonplaceholder.typicode.com/posts/1",
      method: "GET",
    },
    {
      name: "List public APIs",
      url: "https://api.publicapis.org/entries",
      method: "GET",
    },
    {
      name: "Create a post",
      url: "https://jsonplaceholder.typicode.com/posts",
      method: "POST",
      body: JSON.stringify({ title: "foo", body: "bar", userId: 1 }, null, 2),
    },
  ]

  const loadExample = (example: (typeof exampleApis)[0]) => {
    setUrl(example.url)
    setMethod(example.method)
    if (example.body) {
      setBody(example.body)
    } else {
      setBody("")
    }
  }

  const handleHeaderButtonClick = () => {
    setShowToast(true)
  }

  return (
    <div
      className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}
      style={{
        backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
        color: isDarkMode ? '#f3f4f6' : '#111827',
        minHeight: '100vh',
        transition: 'background-color 0.3s, color 0.3s',
        width: '100%',
        overflowX: 'hidden'
      }}
    >
      <Head>
        <title>API Testing Playground</title>
        <meta name="description" content="A modern API testing playground" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div style={{
        backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
        color: isDarkMode ? '#f3f4f6' : '#111827',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}>
        {/* Header */}
        <header style={{
          borderBottom: `1px solid ${isDarkMode ? '#1e293b' : '#e5e7eb'}`,
          backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
          width: '100%',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-md border-2 border-purple-500 flex items-center justify-center transition-all duration-300 hover:rotate-12">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-purple-500"
                    >
                      <path d="M18 10h-4V6" />
                      <path d="M14 10L21 3" />
                      <path d="M6 14h4v4" />
                      <path d="M10 14L3 21" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h1 style={{ color: isDarkMode ? '#f9fafb' : '#111827' }} className="text-xl font-space-grotesk font-semibold">API Playground</h1>
                  <p style={{ color: isDarkMode ? '#e5e7eb' : '#6b7280' }} className="text-xs font-inter">Test your APIs with ease</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <nav className="hidden md:flex space-x-6">
                  <button
                    onClick={handleHeaderButtonClick}
                    style={{ color: isDarkMode ? '#f3f4f6' : '#4b5563' }}
                    className="text-sm font-space-grotesk font-semibold tracking-wide hover:text-purple-500 transition-all duration-200 cursor-pointer hover:scale-105"
                  >
                    Documentation
                  </button>
                  <button
                    onClick={handleHeaderButtonClick}
                    style={{ color: isDarkMode ? '#f3f4f6' : '#4b5563' }}
                    className="text-sm font-space-grotesk font-semibold tracking-wide hover:text-purple-500 transition-all duration-200 cursor-pointer hover:scale-105"
                  >
                    Examples
                  </button>
                  <button
                    onClick={handleHeaderButtonClick}
                    style={{ color: isDarkMode ? '#f3f4f6' : '#4b5563' }}
                    className="text-sm font-space-grotesk font-semibold tracking-wide hover:text-purple-500 transition-all duration-200 cursor-pointer hover:scale-105"
                  >
                    About
                  </button>
                </nav>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/15 transition-colors duration-200 cursor-pointer"
                  aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDarkMode ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: isDarkMode ? '#f3f4f6' : '#4b5563' }}
                    >
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: isDarkMode ? '#f3f4f6' : '#4b5563' }}
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="grid gap-8 lg:grid-cols-2 grid-cols-1">
            {/* Request section */}
            <section className="order-1 lg:order-none w-full">
              <div style={{
                border: `1px solid ${isDarkMode ? '#1e293b' : '#e5e7eb'}`,
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                boxShadow: isDarkMode
                  ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                transform: 'translateY(0)',
                transition: 'all 0.3s ease',
              }}
                className="rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div style={{
                  borderBottom: `1px solid ${isDarkMode ? '#1e293b' : '#e5e7eb'}`,
                  backgroundColor: isDarkMode ? '#1e293b' : '#f9fafb',
                }} className="px-6 py-4">
                  <h2 style={{ color: isDarkMode ? '#f9fafb' : '#111827' }} className="text-lg font-space-grotesk font-medium">Request</h2>
                </div>
                <div className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="url" style={{ color: isDarkMode ? '#f3f4f6' : '#374151' }} className="block text-sm font-medium mb-1">
                        URL
                      </label>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={requestTypeOptions.find(option => option.value === method)}
                          onChange={(selectedOption: SingleValue<RequestTypeOption>) => setMethod(selectedOption?.value || 'GET')}
                          options={requestTypeOptions}
                          styles={customStyles}
                          className="w-32 border rounded-md border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          isSearchable={false}
                          components={{
                            IndicatorSeparator: () => null
                          }}
                        />
                        <input
                          id="url"
                          type="text"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          onFocus={() => setIsUrlFocused(true)}
                          onBlur={() => setIsUrlFocused(false)}
                          placeholder="https://api.example.com/endpoint"
                          style={{
                            backgroundColor: isDarkMode ? '#111827' : 'transparent',
                            color: isDarkMode ? '#f3f4f6' : '#111827'
                          }}
                          className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="headers" style={{ color: isDarkMode ? '#f3f4f6' : '#374151' }} className="block text-sm font-medium mb-1">
                        Headers{" "}
                        <span style={{ color: isDarkMode ? '#cbd5e1' : '#6b7280' }} className="text-xs">
                          (one per line, format: Key: Value)
                        </span>
                      </label>
                      <div
                        className={`rounded-md border ${isHeadersFocused ? "border-purple-500 ring-1 ring-purple-500" : "border-gray-300 dark:border-gray-700"} transition-all duration-200`}
                      >
                        <textarea
                          id="headers"
                          value={headers}
                          onChange={(e) => setHeaders(e.target.value)}
                          onFocus={() => setIsHeadersFocused(true)}
                          onBlur={() => setIsHeadersFocused(false)}
                          placeholder="Content-Type: application/json
Authorization: Bearer token"
                          rows={3}
                          style={{
                            backgroundColor: isDarkMode ? '#111827' : 'transparent',
                            color: isDarkMode ? '#f9fafb' : '#111827'
                          }}
                          className="w-full px-3 py-2 rounded-md focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 whitespace-pre-wrap break-words overflow-x-hidden"
                        />
                      </div>
                    </div>

                    {method !== "GET" && method !== "HEAD" && (
                      <div>
                        <label htmlFor="body" style={{ color: isDarkMode ? '#f3f4f6' : '#374151' }} className="block text-sm font-medium mb-1">
                          Body
                        </label>
                        <div
                          className={`rounded-md border ${isBodyFocused ? "border-purple-500 ring-1 ring-purple-500" : "border-gray-300 dark:border-gray-700"} transition-all duration-200`}
                        >
                          <textarea
                            id="body"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            onFocus={() => setIsBodyFocused(true)}
                            onBlur={() => setIsBodyFocused(false)}
                            placeholder='{"key": "value"}'
                            rows={5}
                            style={{
                              backgroundColor: isDarkMode ? '#111827' : 'transparent',
                              color: isDarkMode ? '#f9fafb' : '#111827'
                            }}
                            className="w-full px-3 py-2 rounded-md focus:outline-none font-mono text-sm"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:hover:bg-purple-600 flex justify-center items-center cursor-pointer"
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            <svg
                              className="mr-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                            Send Request
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Example APIs */}
              <div style={{
                border: `1px solid ${isDarkMode ? '#1e293b' : '#e5e7eb'}`,
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                boxShadow: isDarkMode
                  ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                transform: 'translateY(0)',
                transition: 'all 0.3s ease',
              }}
                className="mt-6 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-1">
                <div style={{
                  borderBottom: `1px solid ${isDarkMode ? '#1e293b' : '#e5e7eb'}`,
                  backgroundColor: isDarkMode ? '#1e293b' : '#f9fafb',
                }} className="px-6 py-3">
                  <h3 style={{ color: isDarkMode ? '#f9fafb' : '#111827' }} className="text-sm font-space-grotesk font-medium">Example APIs</h3>
                </div>
                <div style={{
                  borderColor: isDarkMode ? '#1e293b' : '#e5e7eb'
                }} className="divide-y">
                  {exampleApis.map((example, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                        borderColor: isDarkMode ? '#1e293b' : '#e5e7eb'
                      }}
                      className="px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 cursor-pointer flex justify-between items-center"
                      onClick={() => loadExample(example)}
                    >
                      <div>
                        <p style={{ color: isDarkMode ? '#f9fafb' : '#111827' }} className="text-sm font-medium">{example.name}</p>
                        <p style={{ color: isDarkMode ? '#e5e7eb' : '#6b7280' }} className="text-xs mt-1 truncate max-w-xs">{example.url}</p>
                      </div>
                      <span
                        style={{
                          backgroundColor: example.method === "GET"
                            ? isDarkMode ? '#064e3b' : '#dcfce7'
                            : example.method === "POST"
                              ? isDarkMode ? '#1e3a8a' : '#dbeafe'
                              : example.method === "PUT"
                                ? isDarkMode ? '#713f12' : '#fef3c7'
                                : example.method === "DELETE"
                                  ? isDarkMode ? '#7f1d1d' : '#fee2e2'
                                  : isDarkMode ? '#1f2937' : '#f3f4f6',
                          color: example.method === "GET"
                            ? isDarkMode ? '#6ee7b7' : '#166534'
                            : example.method === "POST"
                              ? isDarkMode ? '#93c5fd' : '#1e40af'
                              : example.method === "PUT"
                                ? isDarkMode ? '#fbbf24' : '#92400e'
                                : example.method === "DELETE"
                                  ? isDarkMode ? '#fca5a5' : '#991b1b'
                                  : isDarkMode ? '#f3f4f6' : '#4b5563'
                        }}
                        className="text-xs px-2 py-1 rounded-full"
                      >
                        {example.method}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Response section */}
            <section ref={responseRef} className="order-2 lg:order-none w-full">
              <div style={{
                border: `1px solid ${isDarkMode ? '#1e293b' : '#e5e7eb'}`,
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                boxShadow: isDarkMode
                  ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                transform: 'translateY(0)',
                transition: 'all 0.3s ease',
              }}
                className="rounded-lg overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div style={{
                  borderBottom: `1px solid ${isDarkMode ? '#1e293b' : '#e5e7eb'}`,
                  backgroundColor: isDarkMode ? '#1e293b' : '#f9fafb',
                }} className="px-6 py-4 flex justify-between items-center">
                  <h2 style={{ color: isDarkMode ? '#f9fafb' : '#111827' }} className="text-lg font-space-grotesk font-medium">Response</h2>
                  {response.status && (
                    <div className="flex items-center space-x-2">
                      <span style={{ color: isDarkMode ? '#e5e7eb' : '#6b7280' }} className="text-xs">{response.time}ms</span>
                      <button
                        onClick={copyToClipboard}
                        style={{ color: isDarkMode ? '#e5e7eb' : '#6b7280' }}
                        className="hover:text-purple-500 transition-colors duration-150 relative cursor-pointer"
                        title="Copy to clipboard"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div style={{
                        borderColor: isDarkMode ? '#1f2937' : '#d1d5db',
                        borderTopColor: '#8b5cf6'
                      }} className="w-10 h-10 border-2 rounded-full animate-spin"></div>
                      <p style={{ color: isDarkMode ? '#e5e7eb' : '#6b7280' }} className="mt-4 text-sm">Waiting for response...</p>
                    </div>
                  ) : response.error ? (
                    <div style={{
                      backgroundColor: isDarkMode ? '#7f1d1d' : '#fef2f2',
                      borderColor: isDarkMode ? '#991b1b' : '#fecaca'
                    }} className="p-4 rounded-md border animate-fade-in">
                      <p style={{ color: isDarkMode ? '#fca5a5' : '#b91c1c' }}>{response.error}</p>
                      {response.time && (
                        <p style={{ color: isDarkMode ? '#e5e7eb' : '#6b7280' }} className="mt-2 text-xs">Time: {response.time}ms</p>
                      )}
                    </div>
                  ) : response.status ? (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex items-center gap-3">
                        <span style={{ color: getStatusColor(response.status) }} className="text-2xl font-bold">
                          {response.status}
                        </span>
                        <span style={{ color: isDarkMode ? '#e5e7eb' : '#4b5563' }}>{response.statusText}</span>
                      </div>

                      {response.headers && Object.keys(response.headers).length > 0 && (
                        <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
                          <h3 style={{ color: isDarkMode ? '#f3f4f6' : '#374151' }} className="text-sm font-medium mb-2">Headers</h3>
                          <div style={{
                            border: `1px solid ${isDarkMode ? '#1e293b' : '#e5e7eb'}`,
                            backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb'
                          }} className="max-h-40 overflow-y-auto rounded-md p-3">
                            {Object.entries(response.headers).map(([key, value]) => (
                              <div key={key} className="text-xs font-mono mb-1">
                                <span style={{ color: '#8b5cf6' }}>{key}:</span>{" "}
                                <span style={{ color: isDarkMode ? '#f3f4f6' : '#374151' }}>{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
                        <h3 style={{ color: isDarkMode ? '#f3f4f6' : '#374151' }} className="text-sm font-medium mb-2">Body</h3>
                        <pre
                          ref={responseDataRef}
                          style={{
                            border: `1px solid ${isDarkMode ? '#1e293b' : '#e5e7eb'}`,
                            backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
                            color: isDarkMode ? '#f3f4f6' : '#374151'
                          }}
                          className="max-h-[calc(100vh-400px)] overflow-y-auto rounded-md p-3 text-xs font-mono whitespace-pre-wrap"
                        >
                          {typeof response.data === "object" ? formatJSON(response.data) : String(response.data)}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div style={{
                        borderColor: isDarkMode ? '#1e293b' : '#e5e7eb'
                      }} className="w-16 h-16 rounded-full border-2 flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ color: isDarkMode ? '#e5e7eb' : '#d1d5db' }}
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                      </div>
                      <p style={{ color: isDarkMode ? '#e5e7eb' : '#6b7280' }}>No response yet</p>
                      <p style={{ color: isDarkMode ? '#9ca3af' : '#9ca3af' }} className="text-sm mt-1">
                        Enter a URL and click Send Request
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer style={{
          borderTop: `1px solid ${isDarkMode ? '#1e293b' : '#e5e7eb'}`,
          backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
          width: '100%'
        }} className="mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-md border-2 border-purple-500 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-purple-500"
                    >
                      <path d="M18 10h-4V6" />
                      <path d="M14 10L21 3" />
                      <path d="M6 14h4v4" />
                      <path d="M10 14L3 21" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ color: isDarkMode ? '#f9fafb' : '#111827' }} className="text-lg font-semibold">API Playground</h3>
                    <p style={{ color: isDarkMode ? '#e5e7eb' : '#6b7280' }} className="mt-1 text-sm">
                      A modern, elegant tool for testing and debugging APIs with ease.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ color: isDarkMode ? '#f9fafb' : '#111827' }} className="text-sm font-semibold mb-4">Resources</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      style={{ color: isDarkMode ? '#e5e7eb' : '#6b7280' }}
                      className="text-sm hover:text-purple-500 transition-colors duration-150 flex items-center cursor-pointer"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      style={{ color: isDarkMode ? '#e5e7eb' : '#6b7280' }}
                      className="text-sm hover:text-purple-500 transition-colors duration-150 flex items-center cursor-pointer"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      API References
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      style={{ color: isDarkMode ? '#e5e7eb' : '#6b7280' }}
                      className="text-sm hover:text-purple-500 transition-colors duration-150 flex items-center cursor-pointer"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Examples
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 style={{ color: isDarkMode ? '#f9fafb' : '#111827' }} className="text-sm font-semibold mb-4">Connect</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      style={{ color: isDarkMode ? '#e5e7eb' : '#6b7280' }}
                      className="text-sm hover:text-purple-500 transition-colors duration-150 flex items-center cursor-pointer"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.239 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      style={{ color: isDarkMode ? '#e5e7eb' : '#6b7280' }}
                      className="text-sm hover:text-purple-500 transition-colors duration-150 flex items-center cursor-pointer"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      style={{ color: isDarkMode ? '#e5e7eb' : '#6b7280' }}
                      className="text-sm hover:text-purple-500 transition-colors duration-150 flex items-center cursor-pointer"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                      Discord
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div style={{
              borderTop: `1px solid ${isDarkMode ? '#1e293b' : '#e5e7eb'}`
            }} className="mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p style={{ color: isDarkMode ? '#e5e7eb' : '#6b7280' }} className="text-sm">
                &copy; {new Date().getFullYear()} API Playground. All rights reserved.
              </p>
              <div className="mt-4 md:mt-0 flex space-x-6">
                <a
                  href="#"
                  style={{ color: isDarkMode ? '#e5e7eb' : '#6b7280' }}
                  className="text-sm hover:text-purple-500 transition-colors duration-150 cursor-pointer"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  style={{ color: isDarkMode ? '#e5e7eb' : '#6b7280' }}
                  className="text-sm hover:text-purple-500 transition-colors duration-150 cursor-pointer"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message="Copied to clipboard!"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  )
}
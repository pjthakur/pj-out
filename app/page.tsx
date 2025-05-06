"use client";

import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type TestMode = "REST" | "GraphQL" | "WebSocket";

interface WebSocketMessage {
  type: "incoming" | "outgoing" | "system";
  data: string;
  timestamp: number;
}

export default function Page() {
  const [url, setUrl] = useState<string>("");
  const [testMode, setTestMode] = useState<TestMode>("REST");
  const [gqlQuery, setGqlQuery] = useState<string>("{\n  __typename\n}");
  const [gqlVariables, setGqlVariables] = useState<string>("{}");
  const [wsMessages, setWsMessages] = useState<WebSocketMessage[]>([]);
  const [wsInputMessage, setWsInputMessage] = useState<string>("");
  const [wsConnectionStatus, setWsConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected" | "error"
  >("disconnected");
  const wsRef = useRef<WebSocket | null>(null);
  const messageLogRef = useRef<HTMLDivElement>(null);
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Simulation mode state
  const [simulateError, setSimulateError] = useState<boolean>(false);
  const [errorType, setErrorType] = useState<string>("network");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Add state for REST body
  const [restBody, setRestBody] = useState<string>("{}");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Effect to scroll WebSocket message log
  useEffect(() => {
    if (messageLogRef.current) {
      messageLogRef.current.scrollTop = messageLogRef.current.scrollHeight;
    }
  }, [wsMessages]);

  // Effect to clean up WebSocket on component unmount or mode change
  useEffect(() => {
    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      wsRef.current = null;
      setWsConnectionStatus("disconnected");
    };
  }, [testMode]);

  const simulateNetworkError = () => {
    setLoading(false);
    if (errorType === "network") {
      setError(
        "Failed to fetch: Network error. The server may be down or unreachable."
      );
      setResponse(null);
    } else if (errorType === "timeout") {
      setError(
        "Request timed out after 30 seconds. The server may be busy or unresponsive."
      );
      setResponse(null);
    } else if (errorType === "cors") {
      setError(
        "CORS error: Access to the resource has been blocked by CORS policy."
      );
      setResponse(null);
    } else if (errorType === "http") {
      setError("HTTP error! status: 500 Internal Server Error");
      setResponse(
        JSON.stringify(
          {
            error: true,
            message: "Internal Server Error",
            status: 500,
          },
          null,
          2
        )
      );
    }
  };

  const handleSendRequest = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);

    if (simulateError) {
      setTimeout(simulateNetworkError, 1000);
      return;
    }

    let requestUrl = url;
    if (!requestUrl.match(/^https?:\/\//)) {
      requestUrl = `https://${requestUrl}`;
    }

    try {
      const options: RequestInit = {
        method: method,
        headers: { "Content-Type": "application/json" },
      };
      if (method === "POST" || method === "PUT" || method === "DELETE") {
        // Validate JSON
        try {
          options.body = restBody ? JSON.stringify(JSON.parse(restBody)) : "{}";
        } catch (e) {
          setError("Invalid JSON in request body.");
          setLoading(false);
          return;
        }
      }

      const res = await fetch(requestUrl, options);
      const contentType = res.headers.get("content-type");
      let data: any;

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
        setResponse(JSON.stringify(data, null, 2));
      } else {
        data = await res.text();
        setResponse(
          data || `Status: ${res.status} ${res.statusText} (No Content)`
        );
      }

      if (!res.ok) {
        setError(`HTTP error! status: ${res.status} ${res.statusText}`);
        setResponse(
          (prev) =>
            prev || `Error occurred, status: ${res.status} ${res.statusText}`
        );
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(
        err.message ||
          "An unexpected error occurred. Check URL and CORS policy."
      );
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSendGraphQLRequest = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);

    if (simulateError) {
      // Simulate loading for a realistic feel
      setTimeout(simulateNetworkError, 1000);
      return;
    }

    let requestUrl = url;
    if (!requestUrl.match(/^https?:\/\//)) {
      requestUrl = `https://${requestUrl}`;
    }

    let variablesObject = {};
    try {
      if (gqlVariables.trim()) {
        variablesObject = JSON.parse(gqlVariables);
      }
    } catch (e) {
      setError("Invalid JSON in Variables field.");
      setLoading(false);
      return;
    }

    const body = JSON.stringify({
      query: gqlQuery,
      variables: variablesObject,
    });

    try {
      const options: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: body,
      };
      const res = await fetch(requestUrl, options);
      const data = await res.json();

      if (data.errors) {
        setError(
          `GraphQL Error(s): ${data.errors
            .map((e: any) => e.message)
            .join(", ")}`
        );
        setResponse(JSON.stringify(data, null, 2));
      } else if (!res.ok) {
        setError(`HTTP error! status: ${res.status} ${res.statusText}`);
        setResponse(JSON.stringify(data, null, 2));
      } else {
        setResponse(JSON.stringify(data, null, 2));
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(
        err.message ||
          "An unexpected network error occurred. Check URL and CORS policy."
      );
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWebSocket = () => {
    if (simulateError) {
      setError(null);
      setWsMessages([]);
      setWsConnectionStatus("connecting");
      addWsSystemMessage(`Attempting to connect to ${url}...`);

      // Simulate connection attempt and then failure
      setTimeout(() => {
        if (errorType === "network") {
          setWsConnectionStatus("error");
          addWsSystemMessage(
            "Connection failed: Network error. The server may be unreachable."
          );
          setError("WebSocket connection failed: Network error");
        } else if (errorType === "timeout") {
          setWsConnectionStatus("error");
          addWsSystemMessage("Connection timed out after 10 seconds.");
          setError("WebSocket connection timed out");
        } else if (errorType === "protocol") {
          setWsConnectionStatus("error");
          addWsSystemMessage(
            "Connection failed: Protocol error. WebSocket handshake failed."
          );
          setError("WebSocket protocol error. Handshake failed.");
        } else {
          setWsConnectionStatus("error");
          addWsSystemMessage("Connection failed: Unknown error.");
          setError("WebSocket connection failed");
        }
      }, 2000);

      return;
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      addWsSystemMessage("Already connected.");
      return;
    }
    if (!url || !url.match(/^wss?:\/\//)) {
      setError("Invalid WebSocket URL. Must start with ws:// or wss://");
      return;
    }
    setError(null);
    setWsMessages([]);
    setWsConnectionStatus("connecting");
    addWsSystemMessage(`Attempting to connect to ${url}...`);

    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => {
      setWsConnectionStatus("connected");
      addWsSystemMessage("Connection established.");
    };

    wsRef.current.onmessage = (event) => {
      addWsMessage("incoming", event.data);
    };

    wsRef.current.onerror = (event) => {
      console.error("WebSocket Error:", event);
      setError("WebSocket error occurred. See console for details.");
      setWsConnectionStatus("error");
      addWsSystemMessage("WebSocket error occurred.");
    };

    wsRef.current.onclose = (event) => {
      // Check current status before setting disconnected to avoid race conditions
      setWsConnectionStatus((currentStatus) => {
        if (currentStatus !== "connecting" && currentStatus !== "error") {
          addWsSystemMessage(
            `Connection closed. Code: ${event.code}, Reason: ${
              event.reason || "N/A"
            }`
          );
          wsRef.current = null;
          return "disconnected";
        }
        if (currentStatus === "error") {
          wsRef.current = null; // ensure cleanup on error too
        }
        return currentStatus; // Maintain connecting/error status if close event is part of that flow
      });
      if (
        wsRef.current &&
        (wsConnectionStatus === "connected" ||
          wsConnectionStatus === "disconnected")
      ) {
        addWsSystemMessage(
          `Connection closed. Code: ${event.code}, Reason: ${
            event.reason || "N/A"
          }`
        );
        wsRef.current = null; // Clean up ref
      } else if (!wsRef.current) {
        // Already cleaned up, potentially by error or explicit disconnect
      }
    };
  };

  const handleDisconnectWebSocket = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      addWsSystemMessage("Closing connection...");
      wsRef.current.close();
    } else {
      addWsSystemMessage("Not connected.");
      setWsConnectionStatus("disconnected");
      wsRef.current = null;
    }
  };

  const handleSendWebSocketMessage = () => {
    if (simulateError && wsConnectionStatus === "connected") {
      addWsMessage("outgoing", wsInputMessage);
      setWsInputMessage("");

      // Simulate connection drop after sending message
      setTimeout(() => {
        setWsConnectionStatus("error");
        addWsSystemMessage("Connection unexpectedly closed: Error code 1006");
        setError("WebSocket connection lost");
      }, 500);

      return;
    }

    if (
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN &&
      wsInputMessage
    ) {
      wsRef.current.send(wsInputMessage);
      addWsMessage("outgoing", wsInputMessage);
      setWsInputMessage("");
    } else if (!wsInputMessage) {
      addWsSystemMessage("Cannot send empty message.");
    } else {
      addWsSystemMessage("Not connected or connection not open.");
    }
  };

  const scrollToSection =
    (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setIsMenuOpen(false);
    };

  const addWsSystemMessage = (message: string) => {
    setWsMessages((prev) => [
      ...prev,
      { type: "system", data: message, timestamp: Date.now() },
    ]);
  };

  const addWsMessage = (type: "incoming" | "outgoing", data: string) => {
    setWsMessages((prev) => [...prev, { type, data, timestamp: Date.now() }]);
  };

  const formatJsonOrText = (data: any): string => {
    try {
      if (
        typeof data === "string" &&
        data.trim().startsWith("{") &&
        data.trim().endsWith("}")
      ) {
        return JSON.stringify(JSON.parse(data), null, 2);
      } else if (typeof data === "object") {
        return JSON.stringify(data, null, 2);
      }
      return String(data);
    } catch (e) {
      return String(data);
    }
  };

  const features = [
    {
      title: "Instant Testing",
      description:
        "Quickly send GET, POST, PUT, DELETE requests to any endpoint.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 mb-3 text-[#41EAD4]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
          />
        </svg>
      ),
    },
    {
      title: "Clear Responses",
      description:
        "View formatted JSON or raw text responses directly in the browser.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 mb-3 text-[#41EAD4]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
          />
        </svg>
      ),
    },
    {
      title: "Error Handling",
      description:
        "Get immediate feedback on network errors or non-OK HTTP statuses.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 mb-3 text-[#41EAD4]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.008v.008H12v-.008Z"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>SnapAPI - Instant API Testing</title>
        <meta
          name="description"
          content="SnapAPI: Test REST, GraphQL, and WebSocket endpoints instantly in your browser. View formatted JSON or raw responses."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Smooch+Sans:wght@400;700;900&display=swap" rel="stylesheet" />
        <link rel="icon" href="https://img.icons8.com/neon/96/api.png" />
      </Head>

      <style jsx global>{`
        @font-face {
          font-family: 'Smooch Sans';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url(https://fonts.gstatic.com/s/smoochsans/v14/c4mz1n5uGsXss2LJh1QH6b129FZvxPj6.woff2) format('woff2');
        }
        @font-face {
          font-family: 'Smooch Sans';
          font-style: normal;
          font-weight: 700;
          font-display: swap;
          src: url(https://fonts.gstatic.com/s/smoochsans/v14/c4mz1n5uGsXss2LJh1QH6b129FZvxPj6.woff2) format('woff2');
        }
        @font-face {
          font-family: 'Smooch Sans';
          font-style: normal;
          font-weight: 900;
          font-display: swap;
          src: url(https://fonts.gstatic.com/s/smoochsans/v14/c4mz1n5uGsXss2LJh1QH6b129FZvxPj6.woff2) format('woff2');
        }
        body {
          font-family: 'Smooch Sans', sans-serif;
          background-color: #011627;
          color: #FDFFFC;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-size: 18px; /* Increased base font size */
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #011627; }
        ::-webkit-scrollbar-thumb { background: #41EAD4; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #B91372; }
        ::selection { background-color: #B91372; color: #FDFFFC; }
        button, a, select, .cursor-pointer {
          cursor: pointer;
        }
      `}</style>

      <div className="bg-[#011627] scroll-smooth">
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 sm:px-6 lg:px-8">
          <div
            className={`max-w-7xl mx-auto rounded-lg transition-all duration-300 ease-in-out shadow-lg ${
              isScrolled
                ? "bg-[#011627]/90 backdrop-blur-lg border border-[#FDFFFC]/10"
                : "bg-[#011627]/75 backdrop-blur-md border border-transparent"
            }`}
          >
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex-shrink-0 flex items-center">
                  <a
                    href="#hero"
                    onClick={scrollToSection("hero")}
                    className="flex items-center group focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-offset-[#011627] focus:ring-[#41EAD4] rounded p-1 -ml-1 cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 512 512"
                    >
                      <g fillRule="evenodd" clipRule="evenodd">
                        <path
                          fill="#41EAD4"
                          d="M128 352c53.023 0 96-42.977 96-96h32c0 70.688-57.309 128-128 128S0 326.688 0 256c0-70.691 57.309-128 128-128 31.398 0 60.141 11.344 82.406 30.117l-.039.059c3.414 2.93 5.625 7.215 5.625 12.082 0 8.824-7.156 16-16 16-3.859 0-7.371-1.434-10.145-3.723l-.039.059C173.109 168.516 151.562 160 128 160c-53.023 0-96 42.977-96 96s42.977 96 96 96z"
                        />
                        <path
                          fill="#ffffff"
                          d="M352 384c-8.844 0-16-7.156-16-16s7.156-16 16-16c53.023 0 96-42.977 96-96s-42.977-96-96-96-96 42.977-96 96h-32c0-70.691 57.312-128 128-128s128 57.309 128 128c0 70.688-57.312 128-128 128zm-64-48c8.844 0 16 7.156 16 16s-7.156 16-16 16-16-7.156-16-16 7.156-16 16-16z"
                        />
                      </g>
                    </svg>
                    <span className="text-3xl font-bold text-[#FDFFFC] group-hover:text-[#FDFFFC]/90 transition-colors">
                      SnapAPI
                    </span>
                  </a>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-1">
                    <a
                      href="#hero"
                      onClick={scrollToSection("hero")}
                      className="text-[#FDFFFC]/80 hover:text-[#41EAD4] hover:bg-[#B91372]/20 focus:bg-[#B91372]/30 focus:text-[#41EAD4] px-3 py-2 rounded-md text-lg font-medium transition-all outline-none focus:ring-1 focus:ring-[#41EAD4] cursor-pointer"
                    >
                      Home
                    </a>
                    <a
                      href="#features"
                      onClick={scrollToSection("features")}
                      className="text-[#FDFFFC]/80 hover:text-[#41EAD4] hover:bg-[#B91372]/20 focus:bg-[#B91372]/30 focus:text-[#41EAD4] px-3 py-2 rounded-md text-lg font-medium transition-all outline-none focus:ring-1 focus:ring-[#41EAD4] cursor-pointer"
                    >
                      Features
                    </a>
                    <a
                      href="#demo"
                      onClick={scrollToSection("demo")}
                      className="text-[#FDFFFC]/80 hover:text-[#41EAD4] hover:bg-[#B91372]/20 focus:bg-[#B91372]/30 focus:text-[#41EAD4] px-3 py-2 rounded-md text-lg font-medium transition-all outline-none focus:ring-1 focus:ring-[#41EAD4] cursor-pointer"
                    >
                      Demo
                    </a>
                    <a
                      href="#about"
                      onClick={scrollToSection("about")}
                      className="text-[#FDFFFC]/80 hover:text-[#41EAD4] hover:bg-[#B91372]/20 focus:bg-[#B91372]/30 focus:text-[#41EAD4] px-3 py-2 rounded-md text-lg font-medium transition-all outline-none focus:ring-1 focus:ring-[#41EAD4] cursor-pointer"
                    >
                      About
                    </a>
                    <a
                      href="#contact"
                      onClick={scrollToSection("contact")}
                      className="text-[#FDFFFC]/80 hover:text-[#41EAD4] hover:bg-[#B91372]/20 focus:bg-[#B91372]/30 focus:text-[#41EAD4] px-3 py-2 rounded-md text-lg font-medium transition-all outline-none focus:ring-1 focus:ring-[#41EAD4] cursor-pointer"
                    >
                      Contact
                    </a>
                  </div>
                </div>
                <div className="md:hidden flex items-center">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-[#FDFFFC]/80 hover:text-[#41EAD4] hover:bg-[#B91372]/30 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#41EAD4] cursor-pointer"
                    aria-controls="mobile-menu"
                    aria-expanded={isMenuOpen}
                  >
                    <span className="sr-only">Open menu</span>
                    <svg
                      className={`block h-6 w-6 ${
                        isMenuOpen ? "hidden" : "block"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16m-7 6h7"
                      />
                    </svg>
                    <svg
                      className={`h-6 w-6 ${isMenuOpen ? "block" : "hidden"}`}
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
              </div>
            </div>
            <div
              className={`md:hidden ${
                isMenuOpen ? "block" : "hidden"
              } border-t border-[#FDFFFC]/10 bg-[#011627]/70 backdrop-blur-lg rounded-b-lg`}
              id="mobile-menu"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a
                  href="#hero"
                  onClick={scrollToSection("hero")}
                  className="text-[#FDFFFC]/90 hover:text-[#41EAD4] hover:bg-[#B91372]/30 focus:bg-[#B91372]/40 block px-3 py-2 rounded-md text-lg font-medium transition-all outline-none focus:ring-1 focus:ring-[#41EAD4] cursor-pointer"
                >
                  Home
                </a>
                <a
                  href="#features"
                  onClick={scrollToSection("features")}
                  className="text-[#FDFFFC]/90 hover:text-[#41EAD4] hover:bg-[#B91372]/30 focus:bg-[#B91372]/40 block px-3 py-2 rounded-md text-lg font-medium transition-all outline-none focus:ring-1 focus:ring-[#41EAD4] cursor-pointer"
                >
                  Features
                </a>
                <a
                  href="#demo"
                  onClick={scrollToSection("demo")}
                  className="text-[#FDFFFC]/90 hover:text-[#41EAD4] hover:bg-[#B91372]/30 focus:bg-[#B91372]/40 block px-3 py-2 rounded-md text-lg font-medium transition-all outline-none focus:ring-1 focus:ring-[#41EAD4] cursor-pointer"
                >
                  Demo
                </a>
                <a
                  href="#about"
                  onClick={scrollToSection("about")}
                  className="text-[#FDFFFC]/90 hover:text-[#41EAD4] hover:bg-[#B91372]/30 focus:bg-[#B91372]/40 block px-3 py-2 rounded-md text-lg font-medium transition-all outline-none focus:ring-1 focus:ring-[#41EAD4] cursor-pointer"
                >
                  About
                </a>
                <a
                  href="#contact"
                  onClick={scrollToSection("contact")}
                  className="text-[#FDFFFC]/90 hover:text-[#41EAD4] hover:bg-[#B91372]/30 focus:bg-[#B91372]/40 block px-3 py-2 rounded-md text-lg font-medium transition-all outline-none focus:ring-1 focus:ring-[#41EAD4] cursor-pointer"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </nav>

        <section
          id="hero"
          className="min-h-screen flex items-center justify-center bg-[#011627] text-[#FDFFFC] pt-24 relative overflow-hidden"
        >
          <div className="absolute inset-0 z-0">
            <div className="absolute -top-20 -left-20 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-br from-[#FF0022]/20 to-[#B91372]/10 rounded-full opacity-50 filter blur-2xl animate-pulse animation-delay-1000"></div>
            <div className="absolute -bottom-24 -right-10 w-80 h-80 sm:w-[30rem] sm:h-[30rem] bg-gradient-to-tl from-[#41EAD4]/25 to-[#B91372]/5 rounded-full opacity-60 filter blur-3xl animate-pulse"></div>
            <div className="absolute top-[15%] right-[5%] w-48 h-48 sm:w-64 sm:h-64 transform rotate-45 bg-[#FF0022]/15 opacity-40 filter blur-xl animate-pulse animation-delay-2000"></div>
            <div className="absolute bottom-[10%] left-[10%] w-40 h-40 sm:w-52 sm:h-52 transform -rotate-12 bg-[#41EAD4]/10 rounded-lg opacity-50 filter blur-xl animate-pulse animation-delay-500"></div>
          </div>

          <div className="text-center z-10 p-6 relative">
            <h1 className="text-6xl sm:text-6xl md:text-7xl font-semibold mb-4 tracking-tighter leading-tight text-shadow-sm shadow-[#000]/30">
              Test APIs in a <span className="text-[#41EAD4]">Snap</span>
              <span className="text-[#FF0022]">.</span>
              <br className="hidden sm:block" />
            </h1>
            <p className="text-2xl sm:text-2xl md:text-3xl text-[#FDFFFC]/80 mb-10 max-w-3xl mx-auto font-light">
              SnapAPI: The simplest way to send requests & view responses, right
              from your browser.
            </p>
            <a
              href="#demo"
              onClick={scrollToSection("demo")}
              className={`inline-block bg-[#41EAD4] text-[#011627] hover:bg-opacity-95 hover:shadow-[#41EAD4]/40 transition-all duration-300 ease-in-out transform hover:scale-[1.03] px-10 py-4 rounded-lg text-xl sm:text-2xl font-bold shadow-lg focus:outline-none focus:ring-4 focus:ring-[#41EAD4]/50 cursor-pointer`}
            >
              Launch Tester
            </a>
          </div>
        </section>

        <section
          id="features"
          className="py-20 sm:py-28 bg-[#011627]/95 border-t border-[#FDFFFC]/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-center text-[#FDFFFC] mb-16">
              Core <span className="text-[#41EAD4]">Features</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {[
                {
                  ...features[0],
                  accentColor: "#FF0022",
                  hoverAccentColor: "#FF0022",
                },
                {
                  ...features[1],
                  accentColor: "#41EAD4",
                  hoverAccentColor: "#41EAD4",
                },
                {
                  ...features[2],
                  accentColor: "#B91372",
                  hoverAccentColor: "#B91372",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`
                    bg-[#FDFFFC]/5 backdrop-filter backdrop-blur-sm
                    rounded-xl
                    p-6 lg:p-8
                    text-center shadow-lg
                    border-t-4
                    border-[${feature.accentColor}]
                    transition-all duration-300 ease-in-out
                    transform hover:scale-[1.02] hover:shadow-xl
                    hover:border-[${feature.hoverAccentColor}]
                    group
                    cursor-pointer
                 `}
                  style={
                    {
                      "--accent-color": feature.accentColor,
                    } as React.CSSProperties
                  }
                >
                  <div className="flex justify-center items-center mb-5">
                    {React.cloneElement(feature.icon, {
                      className: `w-12 h-12 mb-3 text-[${feature.accentColor}] transition-transform duration-300 group-hover:scale-110`,
                    })}
                  </div>
                  <h3 className="text-2xl font-semibold text-[#FDFFFC] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#FDFFFC]/70 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="demo"
          className="py-20 sm:py-28 bg-gradient-to-b from-[#011627]/95 to-[#011627] relative overflow-hidden border-t border-b border-[#FDFFFC]/10"
        >
          <div className="absolute -top-10 -right-10 w-1/3 h-1/3 bg-[#41EAD4]/5 rounded-full filter blur-3xl opacity-40 animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-1/2 h-1/2 bg-[#B91372]/5 rounded-full filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-4xl sm:text-5xl font-bold text-center text-[#FDFFFC] mb-16">
              Live API & WebSocket{" "}
              <span className="text-[#41EAD4]">Playground</span>
            </h2>

            {/* Mode Selector Tabs */}
            <div className="flex flex-col sm:flex-row md:flex-row gap-3 sm:gap-4 md:gap-4 mb-8 border-b border-[#FDFFFC]/10 pb-4 md:justify-center lg:justify-center xl:justify-center">
              {(["REST", "GraphQL", "WebSocket"] as TestMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setTestMode(mode);
                    setError(null);
                    setResponse(null);
                    if (mode !== "WebSocket" && wsRef.current) {
                      handleDisconnectWebSocket();
                    }
                  }}
                  className={`w-full sm:w-auto md:w-auto px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ease-in-out border-2 cursor-pointer ${
                    testMode === mode
                      ? "bg-[#41EAD4] text-[#011627] border-[#41EAD4] shadow-md scale-105"
                      : "bg-[#011627] text-[#FDFFFC] border-[#B91372]/50 hover:border-[#FF0022] hover:text-[#FF0022] focus:outline-none focus:ring-2 focus:ring-[#41EAD4]"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-10 xl:gap-12 items-start lg:items-stretch">
              {/* --- Tester Card --- */}
              <div className="w-full lg:w-[60%] xl:w-3/5 flex flex-col bg-gradient-to-br from-[#02223a] via-[#011627] to-[#1a2a3a] text-[#FDFFFC] rounded-2xl shadow-[0_4px_32px_0_#41EAD4]/20 border-2 border-[#41EAD4]/60 overflow-hidden">
                <div className="p-5 sm:p-6 border-b-4 border-[#41EAD4] flex justify-between items-center flex-shrink-0 bg-[#011627]/95 backdrop-blur-sm relative">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#41EAD4] flex items-center tracking-tight drop-shadow-lg">
                    <svg
                      className="w-8 h-8 mr-3 text-[#41EAD4]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 7.5 3.75 12l3 4.5m10.5-9L20.25 12l-3 4.5m-8.25 4.5h7.5"
                      />
                    </svg>
                    {testMode} Tester
                  </h3>

                  {/* Error simulation toggle */}
                  <div className="flex items-center">
                    <label
                      htmlFor="simulate-error"
                      className="mr-3 text-base font-bold text-[#41EAD4] tracking-wide"
                    >
                      Simulate Error
                    </label>
                    <div
                      className="relative inline-block w-14 h-8 align-middle select-none cursor-pointer transition-all duration-200"
                      onClick={() => setSimulateError(!simulateError)}
                    >
                      <input
                        type="checkbox"
                        id="simulate-error"
                        checked={simulateError}
                        onChange={() => setSimulateError(!simulateError)}
                        className="opacity-0 absolute w-8 h-8 cursor-pointer"
                      />
                      <div
                        className={`block w-14 h-8 rounded-full transition-colors duration-200 ease-in-out border-2 ${
                          simulateError ? "bg-[#41EAD4] border-[#41EAD4]" : "bg-[#B91372]/40 border-[#B91372]/60"
                        }`}
                      ></div>
                      <div
                        className={`dot absolute left-1 top-1 w-6 h-6 rounded-full bg-white border-2 border-[#011627] shadow-lg transition-transform duration-200 ease-in-out ${
                          simulateError ? "transform translate-x-6 scale-110 border-[#41EAD4]" : "border-[#B91372]"
                        }`}
                      ></div>
                    </div>
                  </div>
                  {/* Accent bar below title for extra pop */}
                  <div className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-[#41EAD4] via-[#B91372] to-[#41EAD4] rounded-b"></div>
                </div>

                <div className="p-5 sm:p-6 space-y-6 flex-grow overflow-y-auto">
                  {/* Error type selector (only visible when simulation is enabled) */}
                  {simulateError && (
                    <div className="flex flex-col rounded-lg border border-[#FF0022]/20 bg-[#FF0022]/5 p-3">
                      <label className="block text-base font-medium text-[#FF0022] mb-2">
                        Error Type to Simulate:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {testMode !== "WebSocket" ? (
                          <>
                            <button
                              onClick={() => setErrorType("network")}
                              className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer ${
                                errorType === "network"
                                  ? "bg-[#FF0022] text-white"
                                  : "bg-[#FF0022]/10 text-[#FF0022]"
                              }`}
                            >
                              Network Error
                            </button>
                            <button
                              onClick={() => setErrorType("timeout")}
                              className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer ${
                                errorType === "timeout"
                                  ? "bg-[#FF0022] text-white"
                                  : "bg-[#FF0022]/10 text-[#FF0022]"
                              }`}
                            >
                              Timeout
                            </button>
                            <button
                              onClick={() => setErrorType("cors")}
                              className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer ${
                                errorType === "cors"
                                  ? "bg-[#FF0022] text-white"
                                  : "bg-[#FF0022]/10 text-[#FF0022]"
                              }`}
                            >
                              CORS Error
                            </button>
                            <button
                              onClick={() => setErrorType("http")}
                              className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer ${
                                errorType === "http"
                                  ? "bg-[#FF0022] text-white"
                                  : "bg-[#FF0022]/10 text-[#FF0022]"
                              }`}
                            >
                              HTTP 500
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setErrorType("network")}
                              className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer ${
                                errorType === "network"
                                  ? "bg-[#FF0022] text-white"
                                  : "bg-[#FF0022]/10 text-[#FF0022]"
                              }`}
                            >
                              Connection Error
                            </button>
                            <button
                              onClick={() => setErrorType("timeout")}
                              className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer ${
                                errorType === "timeout"
                                  ? "bg-[#FF0022] text-white"
                                  : "bg-[#FF0022]/10 text-[#FF0022]"
                              }`}
                            >
                              Connection Timeout
                            </button>
                            <button
                              onClick={() => setErrorType("protocol")}
                              className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer ${
                                errorType === "protocol"
                                  ? "bg-[#FF0022] text-white"
                                  : "bg-[#FF0022]/10 text-[#FF0022]"
                              }`}
                            >
                              Protocol Error
                            </button>
                          </>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-[#011627]/70 italic">
                        All requests will fail with the selected error type.
                      </p>
                    </div>
                  )}

                  {/* --- REST MODE --- */}
                  {testMode === "REST" && (
                    <>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-grow">
                          <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://api.example.com/resource"
                            className="w-full pl-4 pr-10 py-3 rounded-lg border border-[#41EAD4]/20 bg-[#011627]/70 text-[#FDFFFC] focus:outline-none focus:ring-2 focus:ring-[#41EAD4]/80 focus:border-[#41EAD4]/50 placeholder-[#FDFFFC]/40 shadow-sm text-base transition-colors duration-200 cursor-text"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#41EAD4]/60 text-sm font-mono">
                            {method}
                          </span>
                        </div>
                        <button
                          onClick={handleSendRequest}
                          disabled={loading || !url}
                          className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 ease-in-out shadow-md flex-shrink-0 cursor-pointer ${
                            loading || !url
                              ? "bg-[#011627]/30 text-[#41EAD4]/40 cursor-not-allowed"
                              : "bg-[#41EAD4] text-[#011627] hover:bg-opacity-90 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#011627] focus:ring-[#41EAD4]"
                          }`}
                        >
                          {loading ? "Sending..." : "Send Request"}
                        </button>
                      </div>
                      {/* Show textarea for POST/PUT/DELETE */}
                      {(method === "POST" || method === "PUT" || method === "DELETE") && (
                        <div className="mt-3">
                          <label className="block text-lg font-medium text-[#41EAD4] mb-1.5 cursor-pointer">
                            Request Body (JSON)
                          </label>
                          <textarea
                            value={restBody}
                            onChange={(e) => setRestBody(e.target.value)}
                            rows={6}
                            placeholder={`{
  "key": "value"
}`}
                            className="w-full p-3 font-mono text-base border border-[#41EAD4]/20 rounded-lg shadow-sm bg-[#011627]/70 text-[#FDFFFC] focus:outline-none focus:ring-1 focus:ring-[#41EAD4]/80 focus:border-[#41EAD4]/50 resize-y cursor-text"
                          />
                        </div>
                      )}
                      <div className="flex flex-wrap items-center justify-start gap-2 pb-2 border-b border-[#41EAD4]/10">
                        <span className="text-base font-medium text-[#41EAD4]/80 mr-2">
                          Method:
                        </span>
                        {(["GET", "POST", "PUT", "DELETE"] as HttpMethod[]).map((m) => (
                          <button
                            key={m}
                            onClick={() => setMethod(m)}
                            className={`px-4 py-2 rounded-full font-medium text-base transition-all duration-200 ease-in-out border cursor-pointer ${
                              method === m
                                ? "bg-[#B91372] text-[#FDFFFC] border-transparent shadow-sm scale-105"
                                : "bg-[#011627]/30 text-[#41EAD4]/80 border-[#41EAD4]/20 hover:bg-[#B91372]/20 hover:text-[#B91372] hover:border-[#B91372]/40 focus:outline-none focus:ring-1 focus:ring-[#B91372]"
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                      {/* --- Response Area --- */}
                      {error ? (
                        <div className="pt-2 space-y-3">
                          <h4 className="text-xl font-semibold text-[#41EAD4]">Response</h4>
                          <div className="bg-[#FF0022]/10 border border-[#FF0022]/40 text-[#FF0022] p-3 rounded-lg text-base font-medium shadow-inner">
                            <strong>Error:</strong> {error}
                            {response && (
                              <pre className="mt-3 bg-[#B91372]/10 p-3 rounded-lg border border-[#B91372]/30 text-[#FDFFFC] font-mono text-base whitespace-pre-wrap break-words">
                                {response}
                              </pre>
                            )}
                          </div>
                        </div>
                      ) : response ? (
                        <div className="pt-2 space-y-3">
                          <h4 className="text-xl font-semibold text-[#41EAD4]">Response</h4>
                          <pre className="bg-[#011627]/80 p-4 rounded-lg border border-[#41EAD4]/10 overflow-auto text-base leading-relaxed text-[#FDFFFC] max-h-[28rem] whitespace-pre-wrap break-words shadow-inner font-mono">
                            {response}
                          </pre>
                        </div>
                      ) : (
                        <div className="pt-2 text-center text-[#41EAD4]/40 text-lg min-h-[10rem] flex items-center justify-center">
                          (Response will appear here)
                        </div>
                      )}
                    </>
                  )}

                  {/* --- GRAPHQL MODE --- */}
                  {testMode === "GraphQL" && (
                    <>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="GraphQL Endpoint URL (e.g., /graphql)"
                          className="flex-grow p-3 rounded-lg border border-[#41EAD4]/20 bg-[#011627]/70 text-[#FDFFFC] focus:outline-none focus:ring-2 focus:ring-[#41EAD4]/80 focus:border-[#41EAD4]/50 placeholder-[#41EAD4]/40 shadow-sm text-base transition-colors duration-200 cursor-text"
                        />
                        <button
                          onClick={handleSendGraphQLRequest}
                          disabled={loading || !url || !gqlQuery}
                          className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 ease-in-out shadow-md flex-shrink-0 cursor-pointer ${
                            loading || !url || !gqlQuery
                              ? "bg-[#011627]/30 text-[#41EAD4]/40 cursor-not-allowed"
                              : "bg-[#41EAD4] text-[#011627] hover:bg-opacity-90 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#011627] focus:ring-[#41EAD4]"
                          }`}
                        >
                          {loading ? "Sending..." : "Send Query"}
                        </button>
                      </div>
                      <div>
                        <label
                          htmlFor="gql-query"
                          className="block text-lg font-medium text-[#41EAD4] mb-1.5 cursor-pointer"
                        >
                          Query
                        </label>
                        <textarea
                          id="gql-query"
                          value={gqlQuery}
                          onChange={(e) => setGqlQuery(e.target.value)}
                          rows={8}
                          className="w-full p-3 font-mono text-base border border-[#41EAD4]/20 rounded-lg shadow-sm bg-[#011627]/70 text-[#FDFFFC] focus:outline-none focus:ring-1 focus:ring-[#41EAD4]/80 focus:border-[#41EAD4]/50 resize-y cursor-text"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="gql-vars"
                          className="block text-lg font-medium text-[#41EAD4] mb-1.5 cursor-pointer"
                        >
                          Variables (JSON)
                        </label>
                        <textarea
                          id="gql-vars"
                          value={gqlVariables}
                          onChange={(e) => setGqlVariables(e.target.value)}
                          rows={4}
                          className="w-full p-3 font-mono text-base border border-[#41EAD4]/20 rounded-lg shadow-sm bg-[#011627]/70 text-[#FDFFFC] focus:outline-none focus:ring-1 focus:ring-[#41EAD4]/80 focus:border-[#41EAD4]/50 resize-y cursor-text"
                        />
                      </div>
                      {/* --- Response Area --- */}
                      {error ? (
                        <div className="pt-2 space-y-3">
                          <h4 className="text-xl font-semibold text-[#41EAD4]">Response</h4>
                          <div className="bg-[#FF0022]/10 border border-[#FF0022]/40 text-[#FF0022] p-3 rounded-lg text-base font-medium shadow-inner">
                            <strong>Error:</strong> {error}
                            {response && (
                              <pre className="mt-3 bg-[#B91372]/10 p-3 rounded-lg border border-[#B91372]/30 text-[#FDFFFC] font-mono text-base whitespace-pre-wrap break-words">
                                {response}
                              </pre>
                            )}
                          </div>
                        </div>
                      ) : response ? (
                        <div className="pt-2 space-y-3">
                          <h4 className="text-xl font-semibold text-[#41EAD4]">Response</h4>
                          <pre className="bg-[#011627]/80 p-4 rounded-lg border border-[#41EAD4]/10 overflow-auto text-base leading-relaxed text-[#FDFFFC] max-h-[28rem] whitespace-pre-wrap break-words shadow-inner font-mono">
                            {response}
                          </pre>
                        </div>
                      ) : (
                        <div className="pt-2 text-center text-[#41EAD4]/40 text-lg min-h-[10rem] flex items-center justify-center">
                          (Response will appear here)
                        </div>
                      )}
                    </>
                  )}

                  {/* --- WEBSOCKET MODE --- */}
                  {testMode === "WebSocket" && (
                    <>
                      <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="ws:// or wss:// address"
                          className="flex-grow p-3 rounded-lg border border-[#41EAD4]/20 bg-[#011627]/70 text-[#FDFFFC] focus:outline-none focus:ring-2 focus:ring-[#41EAD4]/80 focus:border-[#41EAD4]/50 placeholder-[#41EAD4]/40 shadow-sm text-base transition-colors duration-200 disabled:opacity-50 cursor-text"
                          disabled={
                            wsConnectionStatus === "connected" ||
                            wsConnectionStatus === "connecting"
                          }
                        />
                        {wsConnectionStatus === "disconnected" ||
                        wsConnectionStatus === "error" ? (
                          <button
                            onClick={handleConnectWebSocket}
                            disabled={
                              !url ||
                              (!url.match(/^wss?:\/\//) && !simulateError)
                            }
                            className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 ease-in-out shadow-md flex-shrink-0 cursor-pointer ${
                              !url ||
                              (!url.match(/^wss?:\/\//) && !simulateError)
                                ? "bg-[#011627]/30 text-[#41EAD4]/40 cursor-not-allowed"
                                : "bg-[#41EAD4] text-[#011627] hover:bg-opacity-90 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#011627] focus:ring-[#41EAD4]"
                            }`}
                          >
                            Connect
                          </button>
                        ) : (
                          <button
                            onClick={handleDisconnectWebSocket}
                            className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 ease-in-out shadow-md flex-shrink-0 cursor-pointer ${
                              wsConnectionStatus === "connecting"
                                ? "bg-[#B91372]/70 text-[#FDFFFC] cursor-wait"
                                : "bg-[#FF0022] text-[#FDFFFC] hover:bg-opacity-90 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#011627] focus:ring-[#FF0022]"
                            }`}
                          >
                            {wsConnectionStatus === "connecting"
                              ? "Connecting..."
                              : "Disconnect"}
                          </button>
                        )}
                      </div>
                      <div className="border-t border-[#41EAD4]/10 pt-4 space-y-3">
                        <label className="block text-lg font-medium text-[#41EAD4] cursor-pointer">
                          Message Log{" "}
                          <span
                            className={`text-sm ml-1 px-2 py-0.5 rounded-full ${
                              wsConnectionStatus === "connected"
                                ? "bg-[#41EAD4]/20 text-[#41EAD4]"
                                : wsConnectionStatus === "connecting"
                                ? "bg-[#B91372]/20 text-[#B91372]"
                                : wsConnectionStatus === "disconnected"
                                ? "bg-[#011627]/10 text-[#41EAD4]/60"
                                : "bg-[#FF0022]/10 text-[#FF0022]"
                            }`}
                          >
                            {wsConnectionStatus}
                          </span>
                        </label>
                        <div
                          ref={messageLogRef}
                          className="bg-[#011627]/80 p-4 rounded-lg border border-[#41EAD4]/10 overflow-y-auto text-base leading-relaxed text-[#FDFFFC] h-60 whitespace-pre-wrap break-words shadow-inner font-mono space-y-1.5"
                        >
                          {wsMessages.map((msg, index) => (
                            <div
                              key={index}
                              className={`flex ${
                                msg.type === "outgoing"
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <span
                                className={`max-w-[85%] px-3 py-2 rounded-md ${
                                  msg.type === "incoming"
                                    ? "bg-[#41EAD4]/20 text-[#FDFFFC]/90"
                                    : msg.type === "outgoing"
                                    ? "bg-[#B91372]/20 text-[#FDFFFC]/90"
                                    : "bg-[#011627]/10 text-[#FDFFFC]/60 italic text-sm"
                                }`}
                              >
                                {msg.data}
                                <span className="block text-sm opacity-60 mt-0.5 text-right">
                                  {new Date(msg.timestamp).toLocaleTimeString()}
                                </span>
                              </span>
                            </div>
                          ))}
                          {wsMessages.length === 0 && (
                            <p className="text-center text-[#41EAD4]/40 italic text-lg">
                              (Messages will appear here)
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <input
                          type="text"
                          value={wsInputMessage}
                          onChange={(e) => setWsInputMessage(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSendWebSocketMessage()
                          }
                          placeholder="Type message to send..."
                          className="flex-grow p-3 rounded-lg border border-[#41EAD4]/20 bg-[#011627]/70 text-[#FDFFFC] focus:outline-none focus:ring-1 focus:ring-[#41EAD4]/80 focus:border-[#41EAD4]/50 placeholder-[#41EAD4]/40 shadow-sm text-base disabled:opacity-50 cursor-text"
                          disabled={wsConnectionStatus !== "connected"}
                        />
                        <button
                          onClick={handleSendWebSocketMessage}
                          className="px-5 py-3 rounded-lg font-semibold text-base transition-all duration-200 ease-in-out shadow-sm bg-[#011627]/10 text-[#41EAD4]/80 border border-[#41EAD4]/15 hover:bg-[#011627]/20 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-[#B91372] cursor-pointer"
                          disabled={
                            (wsConnectionStatus !== "connected" ||
                              !wsInputMessage) &&
                            !simulateError
                          }
                        >
                          Send
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* --- Info Panel (Updated Context) --- */}
              <div className="w-full lg:w-[40%] xl:w-2/5 text-[#FDFFFC]/90 self-center p-6 lg:p-8 rounded-xl bg-[#011627]/70 backdrop-blur-md border border-[#FDFFFC]/15 shadow-lg">
                <h3 className="text-2xl font-semibold text-[#41EAD4] mb-5 flex items-center">
                  <svg
                    className="w-8 h-8 mr-2 text-[#41EAD4]/80"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                    />
                  </svg>
                  Testing Modes
                </h3>
                {testMode === "REST" && (
                  <p className="mb-4 text-[#FDFFFC]/80 text-lg leading-relaxed">
                    Use standard HTTP methods (GET, POST, PUT, DELETE) to
                    interact with RESTful APIs. Enter the full URL and view the
                    response.
                  </p>
                )}
                {testMode === "GraphQL" && (
                  <p className="mb-4 text-[#FDFFFC]/80 text-lg leading-relaxed">
                    Enter your GraphQL endpoint URL (usually POST), write your
                    query, and optionally provide JSON variables. The response,
                    including any errors, will be displayed.
                  </p>
                )}
                {testMode === "WebSocket" && (
                  <p className="mb-4 text-[#FDFFFC]/80 text-lg leading-relaxed">
                    Enter the WebSocket URL (ws:// or wss://), connect, and
                    send/receive messages in real-time. Monitor connection
                    status and logs.
                  </p>
                )}
                <div className="space-y-3 border-t border-[#FDFFFC]/15 pt-5 mt-5">
                  <div className="flex items-start">
                    <span className="text-[#41EAD4] mt-1 mr-2 text-xl">✓</span>
                    <span className="text-[#FDFFFC]/80 text-lg">
                      Switch easily between testing modes.
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-[#41EAD4] mt-1 mr-2 text-xl">✓</span>
                    <span className="text-[#FDFFFC]/80 text-lg">
                      Clear presentation of responses and logs.
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-[#FF0022]/80 mt-1 mr-2 text-xl">
                      !
                    </span>
                    <span className="text-[#FDFFFC]/80 text-lg">
                      Browser limitations (CORS for HTTP, secure context for
                      wss://) may apply.
                    </span>
                  </div>

                  {/* New feature highlight */}
                  <div className="mt-6 p-3 rounded-lg bg-[#000000]/20 border border-[#B91372]/40">
                    <h4 className="font-medium text-lg text-[#F495CB] mb-2">
                      New: Error Simulation
                    </h4>
                    <p className="text-[#FDFFFC]/90 text-base">
                      Toggle "Simulate Error" to test your application's error
                      handling without needing a real server. Choose from common
                      error types like network failures, timeouts, and more.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="bg-[#011627]/95 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row min-h-[60vh] md:min-h-[70vh]">
              <div className="w-full md:w-1/2 flex flex-col justify-center bg-[#011627] p-8 sm:p-12 lg:p-16 order-2 md:order-1">
                <h2 className="text-4xl sm:text-5xl font-bold text-[#FDFFFC] mb-5">
                  About <span className="text-[#41EAD4]">SnapAPI</span>
                </h2>
                <p className="text-xl text-[#FDFFFC]/80 mb-5 leading-relaxed">
                  SnapAPI was built out of a need for a dead-simple, instant API
                  testing tool without the overhead of complex desktop
                  applications or browser extensions.
                </p>
                <p className="text-lg text-[#FDFFFC]/80 mb-8 leading-relaxed">
                  We believe testing should be fast and accessible. This tool
                  focuses on core functionality: sending requests and viewing
                  responses, quickly and clearly.
                </p>
                <div className="mt-auto md:mt-0 pt-4">
                  <a
                    href="#contact"
                    onClick={scrollToSection("contact")}
                    className={`inline-block border-2 border-[#41EAD4] text-[#41EAD4] hover:bg-[#41EAD4] hover:text-[#011627] focus:bg-[#41EAD4] focus:text-[#011627] focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#011627] focus:ring-[#41EAD4] transition-all duration-300 ease-in-out px-8 py-3 rounded-md text-lg font-semibold focus:outline-none cursor-pointer`}
                  >
                    Share Feedback
                  </a>
                </div>
              </div>
              <div className="w-full md:w-1/2 flex items-center justify-center bg-[#011627]/90 p-8 sm:p-12 lg:p-16 order-1 md:order-2 relative min-h-[40vh] md:min-h-full">
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                  <div className="absolute inset-0 transform rotate-[25deg] bg-gradient-to-br from-[#B91372]/20 to-[#41EAD4]/10 rounded-2xl shadow-lg animate-pulse animation-delay-1000"></div>
                  <div className="absolute inset-[15%] transform rotate-[-15deg] bg-gradient-to-tl from-[#41EAD4]/30 via-[#FDFFFC]/5 to-[#FF0022]/20 backdrop-blur-sm border border-[#FDFFFC]/10 rounded-xl shadow-xl animate-pulse animation-delay-500"></div>
                  <div className="absolute inset-[30%] transform rotate-[10deg] bg-[#FDFFFC]/20 backdrop-blur-md border border-[#FDFFFC]/20 rounded-lg shadow-2xl animate-pulse"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-[-20deg]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="80"
                      height="80"
                      viewBox="0 0 512 512"
                    >
                      <g fillRule="evenodd" clipRule="evenodd">
                        <path
                          fill="#41EAD4"
                          d="M128 352c53.023 0 96-42.977 96-96h32c0 70.688-57.309 128-128 128S0 326.688 0 256c0-70.691 57.309-128 128-128 31.398 0 60.141 11.344 82.406 30.117l-.039.059c3.414 2.93 5.625 7.215 5.625 12.082 0 8.824-7.156 16-16 16-3.859 0-7.371-1.434-10.145-3.723l-.039.059C173.109 168.516 151.562 160 128 160c-53.023 0-96 42.977-96 96s42.977 96 96 96z"
                        />
                        <path
                          fill="#ffffff"
                          d="M352 384c-8.844 0-16-7.156-16-16s7.156-16 16-16c53.023 0 96-42.977 96-96s-42.977-96-96-96-96 42.977-96 96h-32c0-70.691 57.312-128 128-128s128 57.309 128 128c0 70.688-57.312 128-128 128zm-64-48c8.844 0 16 7.156 16 16s-7.156 16-16 16-16-7.156-16-16 7.156-16 16-16z"
                        />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="bg-[#011627] overflow-hidden border-t border-[#FDFFFC]/10"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row min-h-[80vh]">
              {/* Left Panel: Visual Element & Intro Text */}
              <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 relative overflow-hidden bg-gradient-to-br from-[#011627] via-[#011627]/95 to-[#B91372]/10">
                {/* Abstract Shapes */}
                <div className="absolute inset-0 z-0 opacity-50">
                  <div className="absolute -top-1/4 -left-1/4 w-3/5 h-3/5 bg-gradient-to-tr from-[#FF0022]/30 to-[#B91372]/10 rounded-full filter blur-3xl animate-pulse"></div>
                  <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-bl from-[#41EAD4]/20 to-[#B91372]/5 rounded-full filter blur-2xl animate-pulse animation-delay-2000"></div>
                </div>

                <div className="relative z-10">
                  <h2 className="text-4xl sm:text-5xl font-bold text-[#FDFFFC] mb-4">
                    Let's Connect<span className="text-[#FF0022]">.</span>
                  </h2>
                  <p className="text-xl text-[#FDFFFC]/80 mb-8 leading-relaxed">
                    Have questions, feedback, or a project idea? We're here to
                    listen. Fill out the form, and we'll get back to you soon.
                  </p>
                </div>

                {/* Optional: Small decorative element or contact info */}
                <div className="relative z-10 mt-auto text-base text-[#FDFFFC]/50">
                  Response typically within 24 hours.
                </div>
              </div>

              {/* Right Panel: Contact Form */}
              <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-[#011627]/90">
                <div className="w-full max-w-md">
                  <form className="space-y-6">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-lg font-medium text-[#FDFFFC]/80 mb-1.5"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="contact-name"
                        placeholder="Your Name"
                        className="w-full px-4 py-3 bg-[#011627]/70 text-[#FDFFFC] placeholder-[#FDFFFC]/50 rounded-lg border border-[#FDFFFC]/20 focus:outline-none focus:ring-2 focus:ring-[#41EAD4]/80 focus:border-[#41EAD4]/50 transition-colors duration-200 shadow-sm text-lg cursor-text"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-lg font-medium text-[#FDFFFC]/80 mb-1.5"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="contact-email"
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-3 bg-[#011627]/70 text-[#FDFFFC] placeholder-[#FDFFFC]/50 rounded-lg border border-[#FDFFFC]/20 focus:outline-none focus:ring-2 focus:ring-[#41EAD4]/80 focus:border-[#41EAD4]/50 transition-colors duration-200 shadow-sm text-lg cursor-text"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-lg font-medium text-[#FDFFFC]/80 mb-1.5"
                      >
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        placeholder="How can we help?"
                        className="w-full px-4 py-3 bg-[#011627]/70 text-[#FDFFFC] placeholder-[#FDFFFC]/50 rounded-lg border border-[#FDFFFC]/20 resize-y focus:outline-none focus:ring-2 focus:ring-[#41EAD4]/80 focus:border-[#41EAD4]/50 transition-colors duration-200 shadow-sm text-lg cursor-text"
                      ></textarea>
                    </div>
                    <div className="pt-4">
                      <button
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          alert("Contact form is for demo purposes only.");
                        }}
                        className={`w-full px-6 py-3.5 bg-[#41EAD4] text-[#011627] rounded-lg font-bold text-xl border border-transparent shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#011627]/80 focus:ring-[#41EAD4] transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.99] cursor-pointer`}
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-[#011627] text-[#FDFFFC]/60 py-8 border-t border-[#FDFFFC]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex-shrink-0">
                <a
                  href="#hero"
                  onClick={scrollToSection("hero")}
                  className="flex items-center group focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-offset-[#011627] focus:ring-[#41EAD4] rounded-full py-1 px-2 -ml-2 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 512 512"
                  >
                    <g fillRule="evenodd" clipRule="evenodd">
                      <path
                        fill="#41EAD4"
                        d="M128 352c53.023 0 96-42.977 96-96h32c0 70.688-57.309 128-128 128S0 326.688 0 256c0-70.691 57.309-128 128-128 31.398 0 60.141 11.344 82.406 30.117l-.039.059c3.414 2.93 5.625 7.215 5.625 12.082 0 8.824-7.156 16-16 16-3.859 0-7.371-1.434-10.145-3.723l-.039.059C173.109 168.516 151.562 160 128 160c-53.023 0-96 42.977-96 96s42.977 96 96 96z"
                      />
                      <path
                        fill="#ffffff"
                        d="M352 384c-8.844 0-16-7.156-16-16s7.156-16 16-16c53.023 0 96-42.977 96-96s-42.977-96-96-96-96 42.977-96 96h-32c0-70.691 57.312-128 128-128s128 57.309 128 128c0 70.688-57.312 128-128 128zm-64-48c8.844 0 16 7.156 16 16s-7.156 16-16 16-16-7.156-16-16 7.156-16 16-16z"
                      />
                    </g>
                  </svg>
                  <span className="text-2xl font-semibold text-[#FDFFFC]/90 group-hover:text-[#FDFFFC] transition-colors duration-300">
                    SnapAPI
                  </span>
                </a>
              </div>

              <div className="text-base text-center md:text-right">
                &copy; {new Date().getFullYear()} SnapAPI. All rights reserved.
                <span className="mx-1 hidden sm:inline">|</span>
                <br className="sm:hidden" />
                <span className="opacity-70">
                  Instant API & WebSocket Testing Tool.
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaGift, 
  FaRocket, 
  FaCheckCircle, 
  FaTimesCircle
} from "react-icons/fa";

interface IconProps {
  className?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

export const Activity = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

export const BookOpen = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export const Brain = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-5 0v-15A2.5 2.5 0 0 1 9.5 2z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 5 0v-15A2.5 2.5 0 0 0 14.5 2z" />
  </svg>
);

export const Droplets = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 6 5.3 2.5 3.5 2.5 5.7c0 2.22 1.8 4.05 4 4.05z" />
    <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
  </svg>
);

export const Salad = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <path d="M7 21h10" />
    <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9z" />
    <path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1" />
    <path d="m13 12 4-4" />
    <path d="M10.9 7.25A3.99 3.99 0 0 0 4 10c0 .73.2 1.41.54 2" />
  </svg>
);

export const Dumbbell = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <path d="M6.5 6.5h11" />
    <path d="M6.5 17.5h11" />
    <path d="M6.5 6.5v11" />
    <path d="M17.5 6.5v11" />
    <path d="M3 12h18" />
  </svg>
);

export const Target = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export const PenTool = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <path d="m12 19 7-7 3 3-7 7-3-3z" />
    <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="m2 2 7.586 7.586" />
    <circle cx="11" cy="11" r="2" />
  </svg>
);

export const Music = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

export const Smartphone = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </svg>
);

export const User = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const Palette = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <circle cx="13.5" cy="6.5" r=".5" />
    <circle cx="17.5" cy="10.5" r=".5" />
    <circle cx="8.5" cy="7.5" r=".5" />
    <circle cx="6.5" cy="12.5" r=".5" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);

export const Star = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const Zap = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export const Flame = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

export const Lightbulb = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8a6 6 0 0 0-12 0c0 1.23.5 2.4 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
  </svg>
);

export const Gamepad2 = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <line x1="6" x2="10" y1="12" y2="12" />
    <line x1="8" x2="8" y1="10" y2="14" />
    <line x1="15" x2="15.01" y1="13" y2="13" />
    <line x1="18" x2="18.01" y1="11" y2="11" />
    <rect width="20" height="12" x="2" y="6" rx="2" />
  </svg>
);

export const Home = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const Info = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

export const Plus = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export const ChevronLeft = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const ChevronRight = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const Check = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const BarChart3 = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
);

export const TrendingUp = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

export const Trophy = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

export const Crown = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" />
    <path d="M12 8v7" />
    <path d="M8 9v2" />
    <path d="M16 9v2" />
  </svg>
);

export const Diamond = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <path d="M2.7 10.3 12 21l9.3-10.7" />
    <path d="M12 3 2.7 10.3l9.3 10.7 9.3-10.7L12 3Z" />
  </svg>
);

export const Sparkles = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

export const Heart = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const Coffee = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
    <line x1="6" x2="6" y1="2" y2="4" />
    <line x1="10" x2="10" y1="2" y2="4" />
    <line x1="14" x2="14" y1="2" y2="4" />
  </svg>
);

export const Sprout = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <path d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
  </svg>
);

export const CircleDot = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="1" />
  </svg>
);

export const X = ({
  className,
  width = 24,
  height = 24,
  x,
  y,
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    x={x}
    y={y}
  >
    <path d="m18 6-12 12" />
    <path d="m6 6 12 12" />
  </svg>
);

interface Habit {
  id: string;
  name: string;
  color: string;
  icon: string;
  streak: number;
  longestStreak: number;
  completedDates: string[];
  target: number;
  category: string;
  createdAt: string;
  achievedMilestonesHistory?: Array<{ date: string; milestoneDays: number }>;
}

interface DayCompletion {
  date: string;
  habits: { [habitId: string]: boolean };
  timestamp: number;
}

interface Milestone {
  days: number;
  title: string;
  icon: string;
  color: string;
}

interface NewHabitForm {
  name: string;
  icon: string;
  category: string;
}

interface UserProfile {
  name: string;
  email: string;
  image: string;
  joinedDate: string;
}

interface Toast {
  id: string;
  message: string;
  type: "info" | "success" | "warning";
}

const STORAGE_KEYS = {
  HABITS: "habit-tracker-habits",
  COMPLETIONS: "habit-tracker-completions",
  PROFILE: "habit-tracker-profile",
  LAST_OPENED: "habit-tracker-last-opened",
  AUTO_CHECKIN_DISMISSED: "habit-tracker-auto-checkin-dismissed",
};

const HabitTracker: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [currentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [completions, setCompletions] = useState<DayCompletion[]>([]);
  const [animatingHabit, setAnimatingHabit] = useState<string | null>(null);
  const [celebratingMilestone, setCelebratingMilestone] = useState<{
    habitId: string;
    milestone: Milestone;
  } | null>(null);
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [viewMode, setViewMode] = useState<
    "overview" | "timeline" | "analytics"
  >("overview");
  const [monthTransition, setMonthTransition] = useState<
    "none" | "left" | "right"
  >("none");
  const [newHabitForm, setNewHabitForm] = useState<NewHabitForm>({
    name: "",
    icon: "Target",
    category: "Health",
  });
  const [activeTab, setActiveTab] = useState<"home" | "profile" | "about">(
    "home"
  );
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    image: "User",
    joinedDate: new Date().toISOString(),
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [streakCelebration, setStreakCelebration] = useState<{
    habitId: string;
    streak: number;
  } | null>(null);
  const [showMilestoneMarkers, setShowMilestoneMarkers] = useState(false);
  const [pendingCompletions, setPendingCompletions] = useState<{
    [habitId: string]: boolean;
  }>({});
  const [timelineMilestoneDetail, setTimelineMilestoneDetail] = useState<{
    date: string;
    milestone: Milestone;
  } | null>(null);
  const [shouldAutoOpenCheckIn, setShouldAutoOpenCheckIn] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);


  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const fadeInStagger = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1 
      }
    }
  };





  const expandCollapse = {
    hidden: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    visible: { 
      opacity: 1, 
      height: "auto", 
      transition: { 
        duration: 0.4, 
        ease: "easeInOut" as const,
        height: { duration: 0.4 },
        opacity: { duration: 0.3, delay: 0.1 }
      } 
    }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        ease: "easeOut" as const,
        staggerChildren: 0.1 
      } 
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      transition: { duration: 0.3 } 
    }
  };

  const buttonHover = {
    rest: { scale: 1 },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } }
  };

  const iconMap = useMemo(
    () => ({
      Activity,
      BookOpen,
      Brain,
      Droplets,
      Salad,
      Dumbbell,
      Target,
      PenTool,
      Music,
      Smartphone,
      Coffee,
      Palette,
      Star,
      Zap,
      Flame,
      Lightbulb,
      Gamepad2,
      Home,
      Info,
      Plus,
      ChevronLeft,
      ChevronRight,
      Check,
      BarChart3,
      TrendingUp,
      Trophy,
      Crown,
      Diamond,
      Sparkles,
      Heart,
      X,
    }),
    []
  );

  const milestones: Milestone[] = useMemo(
    () => [
      {
        days: 3,
        title: "First Steps",
        icon: "Sprout",
        color: "from-green-400 to-emerald-500",
      },
      {
        days: 7,
        title: "One Week Strong",
        icon: "Sparkles",
        color: "from-emerald-400 to-green-500",
      },
      {
        days: 14,
        title: "Two Week Warrior",
        icon: "Zap",
        color: "from-green-400 to-teal-500",
      },
      {
        days: 21,
        title: "Habit Former",
        icon: "Trophy",
        color: "from-teal-400 to-green-500",
      },
      {
        days: 30,
        title: "Monthly Master",
        icon: "Crown",
        color: "from-lime-400 to-green-500",
      },
      {
        days: 60,
        title: "Consistency Champion",
        icon: "Flame",
        color: "from-green-500 to-emerald-500",
      },
      {
        days: 90,
        title: "Quarterly Queen/King",
        icon: "Diamond",
        color: "from-emerald-500 to-green-600",
      },
      {
        days: 180,
        title: "Half-Year Hero",
        icon: "Star",
        color: "from-green-600 to-teal-600",
      },
      {
        days: 365,
        title: "Year-Long Legend",
        icon: "Target",
        color: "from-gradient-rainbow",
      },
    ],
    []
  );

  const habitIcons = useMemo(
    () => [
      "Activity",
      "BookOpen",
      "Brain",
      "Droplets",
      "Salad",
      "Dumbbell",
      "Target",
      "PenTool",
      "Music",
      "Smartphone",
      "Coffee",
      "Palette",
      "Star",
      "Zap",
      "Flame",
      "Lightbulb",
      "Gamepad2",
      "Home",
    ],
    []
  );

  const categories = useMemo(
    () => [
      "Health",
      "Learning",
      "Wellness",
      "Productivity",
      "Creative",
      "Social",
    ],
    []
  );

  const profileIcons = useMemo(
    () => [
      "User",
      "Star",
      "Zap",
      "Flame",
      "Diamond",
      "Target",
      "Dumbbell",
      "Brain",
      "BookOpen",
      "Palette",
      "Trophy",
      "Crown",
    ],
    []
  );

  const navItems = useMemo(
    () => [
      { id: "home", label: "Home", icon: Home },
      { id: "profile", label: "Profile", icon: User },
      { id: "about", label: "About", icon: Info },
    ],
    []
  );

  const getIconComponent = useCallback(
    (iconName: string) => {
      return iconMap[iconName as keyof typeof iconMap] || Target;
    },
    [iconMap]
  );

  const formatDate = useCallback((date: Date): string => {
    return date.toISOString().split("T")[0];
  }, []);

  const saveToStorage = useCallback((key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
    }
  }, []);

  const loadFromStorage = useCallback((key: string) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      return null;
    }
  }, []);

  const generateInitialData = useCallback(() => {
    const mockHabits: Habit[] = [
      {
        id: "1",
        name: "Morning Workout",
        color: "from-green-500 to-emerald-600",
        icon: "Dumbbell",
        streak: 5,
        longestStreak: 12,
        completedDates: [],
        target: 30,
        category: "Health",
        createdAt: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        achievedMilestonesHistory: [],
      },
      {
        id: "2",
        name: "Read 30 Minutes",
        color: "from-emerald-500 to-teal-500",
        icon: "BookOpen",
        streak: 3,
        longestStreak: 8,
        completedDates: [],
        target: 30,
        category: "Learning",
        createdAt: new Date(
          Date.now() - 25 * 24 * 60 * 60 * 1000
        ).toISOString(),
        achievedMilestonesHistory: [],
      },
      {
        id: "3",
        name: "Meditation",
        color: "from-teal-500 to-green-500",
        icon: "Brain",
        streak: 7,
        longestStreak: 15,
        completedDates: [],
        target: 30,
        category: "Wellness",
        createdAt: new Date(
          Date.now() - 20 * 24 * 60 * 60 * 1000
        ).toISOString(),
        achievedMilestonesHistory: [],
      },
      {
        id: "4",
        name: "Drink Water",
        color: "from-blue-500 to-teal-500",
        icon: "Droplets",
        streak: 2,
        longestStreak: 10,
        completedDates: [],
        target: 30,
        category: "Health",
        createdAt: new Date(
          Date.now() - 15 * 24 * 60 * 60 * 1000
        ).toISOString(),
        achievedMilestonesHistory: [],
      },
    ];

    const mockCompletions: DayCompletion[] = [];
    const today = new Date();

    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = formatDate(date);

      const dayCompletion: DayCompletion = {
        date: dateStr,
        habits: {},
        timestamp: date.getTime(),
      };

      mockHabits.forEach((habit) => {
        let completionChance = 0.7;
        
        if (habit.id === "1") {
          const dayOfWeek = date.getDay();
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            completionChance = 0.3;
          } else {
            completionChance = 0.8;
          }
        }
        
        if (habit.id === "2") {
          completionChance = 0.6;
          if (i >= 15 && i <= 20) {
            completionChance = 0.2;
          }
        }
        
        if (habit.id === "3") {
          completionChance = 0.85;
          if (i >= 20 && i <= 25) {
            completionChance = 0.3;
          }
        }
        
        if (habit.id === "4") {
          completionChance = 0.5;
          if (i === 5 || i === 12 || i === 18 || i === 22) {
            completionChance = 0.1;
          }
        }

        if (Math.random() < completionChance) {
          dayCompletion.habits[habit.id] = true;
        }
      });

      mockCompletions.push(dayCompletion);
    }

    return { habits: mockHabits, completions: mockCompletions };
  }, [formatDate]);

  useEffect(() => {
    if (!isInitialized) {
      const savedHabits = loadFromStorage(STORAGE_KEYS.HABITS);
      const savedCompletions = loadFromStorage(STORAGE_KEYS.COMPLETIONS);
      const savedProfile = loadFromStorage(STORAGE_KEYS.PROFILE);
      const lastOpened = loadFromStorage(STORAGE_KEYS.LAST_OPENED);

      if (savedHabits && savedCompletions) {
        const migratedHabits = savedHabits.map((h: Habit) => ({
          ...h,
          achievedMilestonesHistory: h.achievedMilestonesHistory || [],
        }));
        setHabits(migratedHabits);
        setCompletions(savedCompletions);
      } else {
        const initialData = generateInitialData();
        setHabits(initialData.habits);
        setCompletions(initialData.completions);
      }

      if (savedProfile) {
        setUserProfile(savedProfile);
      }

      const today = formatDate(new Date());
      const lastOpenedDate = lastOpened || '';
      
      if (lastOpenedDate !== today) {
        setShouldAutoOpenCheckIn(true);
        saveToStorage(STORAGE_KEYS.LAST_OPENED, today);
      }

      setIsInitialized(true);
    }
  }, [isInitialized, loadFromStorage, generateInitialData, formatDate, saveToStorage]);

  useEffect(() => {
    if (isInitialized && habits.length > 0) {
      saveToStorage(STORAGE_KEYS.HABITS, habits);
    }
  }, [habits, isInitialized, saveToStorage]);

  useEffect(() => {
    if (isInitialized && completions.length > 0) {
      saveToStorage(STORAGE_KEYS.COMPLETIONS, completions);
    }
  }, [completions, isInitialized, saveToStorage]);

  useEffect(() => {
    if (isInitialized) {
      saveToStorage(STORAGE_KEYS.PROFILE, userProfile);
    }
  }, [userProfile, isInitialized, saveToStorage]);



  useEffect(() => {
    const isAnyModalOpen =
      showCheckIn ||
      showAddHabit ||
      celebratingMilestone !== null ||
      streakCelebration !== null ||
      timelineMilestoneDetail !== null;
    document.body.style.overflow = isAnyModalOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [
    showCheckIn,
    showAddHabit,
    celebratingMilestone,
    streakCelebration,
    timelineMilestoneDetail,
  ]);

  const calculateStreakWithCompletions = useCallback(
    (habit: Habit, currentCompletions: DayCompletion[]): number => {
      const today = new Date();
      let streak = 0;
      let checkDate = new Date(today);

      const todayStr = formatDate(today);
      const todayCompletion = currentCompletions.find(
        (c) => c.date === todayStr
      );

      if (!todayCompletion?.habits[habit.id]) {
        checkDate.setDate(checkDate.getDate() - 1);
      }

      while (checkDate >= new Date(habit.createdAt)) {
        const dateStr = formatDate(checkDate);
        const completion = currentCompletions.find((c) => c.date === dateStr);

        if (completion && completion.habits[habit.id]) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      return streak;
    },
    [formatDate]
  );

  const calculateStreak = useCallback(
    (habit: Habit): number => {
      return calculateStreakWithCompletions(habit, completions);
    },
    [completions, calculateStreakWithCompletions]
  );

  const getHabitCompletion = useCallback(
    (habitId: string, date: Date): boolean => {
      const dateStr = formatDate(date);
      const completion = completions.find((c) => c.date === dateStr);
      return completion?.habits[habitId] || false;
    },
    [completions, formatDate]
  );

  const showToast = useCallback(
    (message: string, type: "info" | "success" | "warning" = "info") => {
      const id = Date.now().toString();
      const newToast = { id, message, type };
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 3000);
    },
    []
  );


  useEffect(() => {
    if (isInitialized && shouldAutoOpenCheckIn && habits.length > 0 && activeTab === "home") {

      const today = formatDate(new Date());
      const todayCompletion = completions.find((c) => c.date === today);
      const hasCheckedInToday = todayCompletion && Object.keys(todayCompletion.habits).length > 0;
      const autoDismissedDate = loadFromStorage(STORAGE_KEYS.AUTO_CHECKIN_DISMISSED);
      const hasAutoDismissedToday = autoDismissedDate === today;
      
              if (!hasCheckedInToday && !hasAutoDismissedToday) {
          const timer = setTimeout(() => {
            setShowCheckIn(true);
            setShouldAutoOpenCheckIn(false);
            
            const hour = new Date().getHours();
            let message = "Time for your daily check-in!";
            
            if (hour >= 5 && hour < 12) {
              message = "Good morning! Ready to start your day strong?";
            } else if (hour >= 12 && hour < 17) {
              message = "Good afternoon! Time for your daily check-in";
            } else if (hour >= 17 && hour < 21) {
              message = "Good evening! Let's check in on your habits";
            } else {
              message = "Ready to check in on your daily habits?";
            }
            
            showToast(message, "info");
          }, 1000);
          
          return () => clearTimeout(timer);
        } else {
          setShouldAutoOpenCheckIn(false);
        }
    }
  }, [isInitialized, shouldAutoOpenCheckIn, habits.length, activeTab, showToast, formatDate, completions, loadFromStorage]);

  const getCurrentDayCompletions = useCallback(() => {
    const today = formatDate(currentDate);
    const todayCompletion = completions.find((c) => c.date === today);
    const actualCompletions = todayCompletion?.habits || {};
    return { ...actualCompletions, ...pendingCompletions };
  }, [currentDate, formatDate, completions, pendingCompletions]);

  const toggleHabitCompletion = useCallback(
    (habitId: string) => {
      const currentCompletions = getCurrentDayCompletions();
      const isCurrentlyCompleted = currentCompletions[habitId] || false;

      setPendingCompletions((prev) => ({
        ...prev,
        [habitId]: !isCurrentlyCompleted,
      }));
    },
    [getCurrentDayCompletions]
  );

  const submitCheckIn = useCallback(() => {
    const today = formatDate(currentDate);
    const existingCompletion = completions.find((c) => c.date === today);

    let newCompletions: DayCompletion[];

    if (existingCompletion) {
      newCompletions = completions.map((c) =>
        c.date === today
          ? {
              ...c,
              habits: { ...c.habits, ...pendingCompletions },
              timestamp: Date.now(),
            }
          : c
      );
    } else {
      const newCompletion: DayCompletion = {
        date: today,
        habits: { ...pendingCompletions },
        timestamp: Date.now(),
      };
      newCompletions = [...completions, newCompletion];
    }

    setCompletions(newCompletions);

    const updatedHabits = habits.map((habit) => {
      const newStreak = calculateStreakWithCompletions(habit, newCompletions);
      let newAchievedHistory = habit.achievedMilestonesHistory
        ? [...habit.achievedMilestonesHistory]
        : [];

      const wasCompletedInThisCheckin = pendingCompletions[habit.id];
      if (wasCompletedInThisCheckin) {
        const achievedMilestoneForThisHabitNow = milestones.find(
          (m) => m.days === newStreak
        );
        if (achievedMilestoneForThisHabitNow) {
          const historyEntry = {
            date: today,
            milestoneDays: achievedMilestoneForThisHabitNow.days,
          };
          const alreadyLogged = newAchievedHistory.some(
            (entry) =>
              entry.date === today &&
              entry.milestoneDays === achievedMilestoneForThisHabitNow.days
          );
          if (!alreadyLogged) {
            newAchievedHistory.push(historyEntry);
          }
        }
      }

      return {
        ...habit,
        streak: newStreak,
        longestStreak: Math.max(habit.longestStreak || 0, newStreak),
        completedDates: newCompletions
          .filter((c) => c.habits[habit.id])
          .map((c) => c.date),
        achievedMilestonesHistory: newAchievedHistory,
      };
    });

    setHabits(updatedHabits);

    Object.entries(pendingCompletions).forEach(([habitId, isCompleted]) => {
      if (isCompleted) {
        const habit = updatedHabits.find((h) => h.id === habitId);
        if (habit) {
          setTimeout(() => {
            setAnimatingHabit(habitId);
            
            if (habit.streak > 1) {
              setTimeout(() => {
                setStreakCelebration({ habitId, streak: habit.streak });
                setTimeout(() => setStreakCelebration(null), 2000);
              }, 200);
            } else if (habit.streak === 1) {
              setTimeout(() => {
                showToast(`Great start on ${habit.name}!`, "success");
              }, 200);
            }

            const achievedMilestone = milestones.find(
              (m) => m.days === habit.streak
            );
            if (achievedMilestone) {
              setTimeout(() => {
                setCelebratingMilestone({
                  habitId,
                  milestone: achievedMilestone,
                });
                setTimeout(() => setCelebratingMilestone(null), 4000);
              }, 2500);
            }

            setTimeout(() => setAnimatingHabit(null), 1500);
          }, 100);
        }
      }
    });

    setPendingCompletions({});
    setShowCheckIn(false);
  }, [
    currentDate,
    formatDate,
    completions,
    pendingCompletions,
    habits,
    calculateStreakWithCompletions,
    milestones,
  ]);

  const navigateMonth = useCallback((direction: "next" | "prev") => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setMonthTransition(direction === "next" ? "left" : "right");

    animationFrameRef.current = requestAnimationFrame(() => {
      setTimeout(() => {
        setSelectedMonth((prev) =>
          direction === "next"
            ? new Date(prev.getFullYear(), prev.getMonth() + 1)
            : new Date(prev.getFullYear(), prev.getMonth() - 1)
        );
        setTimeout(() => setMonthTransition("none"), 150);
      }, 150);
    });
  }, []);

  const addNewHabit = useCallback(() => {
    if (!newHabitForm.name.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitForm.name.trim(),
      icon: newHabitForm.icon,
      category: newHabitForm.category,
      color: "from-green-500 to-emerald-500",
      streak: 0,
      longestStreak: 0,
      completedDates: [],
      target: 30,
      createdAt: new Date().toISOString(),
      achievedMilestonesHistory: [],
    };

    setHabits((prev) => [...prev, newHabit]);
    setNewHabitForm({ name: "", icon: "Target", category: "Health" });
    setShowAddHabit(false);
    showToast("New habit added successfully!", "success");
  }, [newHabitForm, showToast]);

  const getDaysInMonth = useCallback((date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }, []);

  const getMonthName = useCallback((date: Date): string => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, []);

  const getCircularTimelineData = useCallback(
    (habit: Habit) => {
      const daysInMonth = getDaysInMonth(selectedMonth);
      const centerX = 120;
      const centerY = 120;
      const radius = 75;
      const days = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const angle = (day / daysInMonth) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        const numberRadius = radius + 20;
        const numberX = centerX + numberRadius * Math.cos(angle);
        const numberY = centerY + numberRadius * Math.sin(angle);

        const date = new Date(
          selectedMonth.getFullYear(),
          selectedMonth.getMonth(),
          day
        );
        const isCompleted = getHabitCompletion(habit.id, date);
        const isToday =
          formatDate(date) === formatDate(currentDate) &&
          selectedMonth.getMonth() === currentDate.getMonth() &&
          selectedMonth.getFullYear() === currentDate.getFullYear();

        const dateStr = formatDate(date);
        const milestoneEntry = habit.achievedMilestonesHistory?.find(
          (entry) => entry.date === dateStr
        );
        const achievedMilestoneOnThisDay = milestoneEntry
          ? milestones.find((m) => m.days === milestoneEntry.milestoneDays)
          : null;

        days.push({
          day,
          x,
          y,
          numberX,
          numberY,
          isCompleted,
          isToday,
          date,
          achievedMilestoneOnThisDay,
        });
      }

      return days;
    },
    [selectedMonth, getDaysInMonth, getHabitCompletion, formatDate, currentDate]
  );

  const getMonthProgress = useCallback(
    (habit: Habit): number => {
      const daysInMonth = getDaysInMonth(selectedMonth);
      let completedDays = 0;

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(
          selectedMonth.getFullYear(),
          selectedMonth.getMonth(),
          day
        );
        if (getHabitCompletion(habit.id, date)) {
          completedDays++;
        }
      }

      return daysInMonth > 0 ? (completedDays / daysInMonth) * 100 : 0;
    },
    [selectedMonth, getDaysInMonth, getHabitCompletion]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart) return;

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };
      const deltaX = touchStart.x - touchEnd.x;
      const deltaY = touchStart.y - touchEnd.y;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          navigateMonth("next");
        } else {
          navigateMonth("prev");
        }
      }

      setTouchStart(null);
    },
    [touchStart, navigateMonth]
  );

  const getNextMilestone = useCallback(
    (habit: Habit): Milestone | null => {
      return milestones.find((m) => m.days > habit.streak) || null;
    },
    [milestones]
  );

  const getAchievedMilestones = useCallback(
    (habit: Habit): Milestone[] => {
      return milestones.filter((m) => m.days <= habit.longestStreak);
    },
    [milestones]
  );

  const getTodayCompletionRate = useCallback((): number => {
    const today = formatDate(currentDate);
    const todayCompletion = completions.find((c) => c.date === today);
    const completedCount = habits.filter(
      (h) => todayCompletion?.habits[h.id]
    ).length;
    return habits.length > 0 ? (completedCount / habits.length) * 100 : 0;
  }, [currentDate, formatDate, completions, habits]);

  const updateProfile = useCallback(() => {
    setIsEditingProfile(false);
    showToast("Profile updated successfully!", "success");
  }, [showToast]);

  const getTotalStats = useCallback(() => {
    const totalHabits = habits.length;
    const totalCompletions = completions.reduce((acc, comp) => {
      return acc + Object.values(comp.habits).filter(Boolean).length;
    }, 0);
    const bestStreak = Math.max(...habits.map((h) => h.longestStreak || 0), 0);
    const daysActive = new Set(completions.map((c) => c.date)).size;
    return { totalHabits, totalCompletions, bestStreak, daysActive };
  }, [habits, completions]);

  if (!isInitialized) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <motion.div 
          className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8"
          variants={fadeInUp}
        >
          <div className="flex items-center space-x-3">
            <motion.div 
              className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full"
              animate={{
                opacity: [0.7, 1, 0.7],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            />
            <span className="text-white font-medium">
              Loading your habits...
            </span>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        const stats = getTotalStats();
        return (
          <motion.div 
            className="space-y-6 lg:space-y-8 mb-6"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabContentVariants}
            key="profile"
          >
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  {React.createElement(getIconComponent(userProfile.image), {
                    className: "w-10 h-10 text-white",
                  })}
                </div>
                {isEditingProfile ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={(e) =>
                        setUserProfile((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full bg-white/10 border border-white/30 rounded-2xl px-4 py-3 text-white text-center placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                    />
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) =>
                        setUserProfile((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full bg-white/10 border border-white/30 rounded-2xl px-4 py-3 text-white text-center placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-green-400/50"
                    />
                    <div className="grid grid-cols-6 lg:grid-cols-8 gap-2">
                      {profileIcons.map((iconName) => {
                        const IconComponent = getIconComponent(iconName);
                        return (
                          <button
                            key={iconName}
                            onClick={() =>
                              setUserProfile((prev) => ({
                                ...prev,
                                image: iconName,
                              }))
                            }
                            className={`p-3 cursor-pointer rounded-xl border transition-all flex items-center justify-center ${
                              userProfile.image === iconName
                                ? "border-green-400 bg-white/20"
                                : "border-white/20 bg-white/10"
                            }`}
                          >
                            <IconComponent className="w-6 h-6 text-white" />
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        className="flex-1 bg-white/10 cursor-pointer border border-white/30 text-white py-3 rounded-2xl font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={updateProfile}
                        className="flex-1 bg-gradient-to-r from-green-500 cursor-pointer to-emerald-500 text-white py-3 rounded-2xl font-semibold"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {userProfile.name}
                    </h2>
                    <p className="text-white/90 mb-4">{userProfile.email}</p>
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="bg-white/20 border cursor-pointer border-white/30 text-white px-6 py-2 rounded-2xl font-medium hover:bg-white/30 transition-all"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl">
              <h3 className="text-white font-bold text-xl mb-4">
                Your Journey
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {[
                  { label: "Total Habits", value: stats.totalHabits },
                  { label: "Completions", value: stats.totalCompletions },
                  { label: "Streak", value: stats.bestStreak },
                  { label: "Active Days", value: stats.daysActive },
                ].map((stat, index) => (
                  <div
                    key={`stat-${index}`}
                    className="bg-white/5 rounded-2xl p-4 text-center border border-white/10"
                  >
                    <p className="text-3xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="text-white/90 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl">
              <h3 className="text-white font-bold text-xl mb-4">
                Achievements
              </h3>
              <div className="grid grid-cols-3 lg:grid-cols-6 xl:grid-cols-9 gap-3 lg:gap-4">
                {milestones
                  .filter((m) => habits.some((h) => h.longestStreak >= m.days))
                  .map((milestone) => {
                    const IconComponent = getIconComponent(milestone.icon);
                    return (
                      <div
                        key={milestone.days}
                        className="bg-white/5 rounded-2xl p-3 text-center border border-white/10"
                      >
                        <div className="text-2xl mb-1 flex justify-center">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-white/90 text-xs font-medium">
                          {milestone.title}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl">
              <div className={`flex items-center justify-between ${showMilestoneMarkers ? 'mb-4' : 'mb-0'}`}>
                <h3 className="text-white font-bold text-xl">
                  Milestone Progress
                </h3>
                <button
                  onClick={() => setShowMilestoneMarkers(!showMilestoneMarkers)}
                  className="bg-white/20 border cursor-pointer border-white/30 text-white px-4 py-2 rounded-2xl font-medium hover:bg-white/30 transition-all text-sm flex items-center justify-center"
                >
                  {showMilestoneMarkers ? "Hide" : "Show"} Details
                </button>
              </div>

              <AnimatePresence>
              {showMilestoneMarkers && (
                  <motion.div 
                    className="space-y-4"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={expandCollapse}
                  >
                  {habits.map((habit) => {
                    const achievedMilestones = getAchievedMilestones(habit);
                    const nextMilestone = getNextMilestone(habit);
                    const IconComponent = getIconComponent(habit.icon);

                    return (
                      <div
                        key={habit.id}
                        className="bg-white/5 rounded-2xl p-4 border border-white/10"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <IconComponent className="w-6 h-6 text-white" />
                          <div className="flex-1">
                            <h4 className="text-white font-medium">
                              {habit.name}
                            </h4>
                            <p className="text-white/90 text-sm">
                              Current streak: {habit.streak} days
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {achievedMilestones.map((milestone) => {
                            const MilestoneIcon = getIconComponent(
                              milestone.icon
                            );
                            return (
                              <div
                                key={`${habit.id}-milestone-${milestone.days}`}
                                className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl px-3 py-1 flex items-center space-x-2"
                              >
                                <MilestoneIcon className="w-4 h-4 text-white" />
                                <span className="text-green-100 text-xs font-medium">
                                  {milestone.title}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {nextMilestone && (
                          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white/90 text-sm">
                                Next Milestone:
                              </span>
                              <span className="text-green-300 text-sm font-medium">
                                {nextMilestone.title}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
                                  style={{
                                    width: `${
                                      (habit.streak / nextMilestone.days) * 100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-white/90 text-xs">
                                {habit.streak}/{nextMilestone.days}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </motion.div>
        );

      case "about":
        return (
          <motion.div 
            className="space-y-6 mb-6"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabContentVariants}
            key="about"
          >
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent mb-2">
                  Habit Flow
                </h2>
                <p className="text-white/90">Version 1.0.0</p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    title: "About the App",
                    content:
                      "Habit Flow is a modern, beautifully designed habit tracking app that helps you build better daily routines. Track your progress with stunning circular timelines, celebrate milestones, and transform your life one habit at a time.",
                  },
                  {
                    title: "Features",
                    content:
                      "Beautiful glassmorphism design\nCircular timeline visualization\nInteractive milestone markers\nStreak celebrations & animations\nOffline-first functionality\nComprehensive analytics\nCustomizable habit categories",
                  },
                  {
                    title: "Developer",
                    content: "Created with React and TypeScript",
                  },
                ].map((section, index) => (
                  <div
                    key={`about-${index}`}
                    className="bg-white/5 rounded-2xl p-4 border border-white/10"
                  >
                    <h3 className="text-white font-bold mb-2">
                      {section.title}
                    </h3>
                    {section.title === "Developer" ? (
                      <p className="text-white/90 text-sm leading-relaxed flex items-center space-x-1">
                        <span>Created with Love using React and TypeScript</span>
                      </p>
                    ) : section.title === "Features" ? (
                      <div className="space-y-2">
                        {section.content.split('\n').map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-300 flex-shrink-0" />
                            <span className="text-white/90 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                    <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line">
                      {section.content}
                    </p>
                    )}
                  </div>
                ))}
                </div>
              </div>
          </motion.div>
        );

      default:
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabContentVariants}
            key="home"
          >
            <motion.div 
              className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-6 lg:p-8 mb-6 shadow-2xl"
              variants={fadeIn}
            >
              <div className="flex items-center justify-center mb-6 lg:mb-8">
                <div className="relative w-32 h-32 lg:w-40 lg:h-40">
                                      <svg className="transform -rotate-90 w-32 h-32 lg:w-40 lg:h-40">
                                          <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                        fill="transparent"
                        className="lg:hidden"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="10"
                        fill="transparent"
                        className="hidden lg:block"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="url(#todayGradient)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 56 * (1 - getTodayCompletionRate() / 100)
                        }`}
                        className="transition-all duration-1000 ease-out lg:hidden"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="url(#todayGradient)"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 70}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 70 * (1 - getTodayCompletionRate() / 100)
                        }`}
                        className="transition-all duration-1000 ease-out hidden lg:block"
                        strokeLinecap="round"
                      />
                    <defs>
                      <linearGradient
                        id="todayGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {Math.round(getTodayCompletionRate())}%
                    </span>
                    <span className="text-white/90 text-xs">Today</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  {
                    label: "Best Streak",
                    value: Math.max(
                      ...habits.map((h) => h.longestStreak || 0),
                      0
                    ),
                    color: "text-green-300"
                  },
                  {
                    label: "Active Tasks",
                    value: habits.filter((h) => calculateStreak(h) > 0).length,
                    color: habits.filter((h) => calculateStreak(h) > 0).length > habits.length / 2 
                      ? "text-green-300" : "text-orange-300"
                  },
                  { 
                    label: "Today's Progress", 
                    value: `${getCurrentDayCompletions() ? Object.values(getCurrentDayCompletions()).filter(Boolean).length : 0}/${habits.length}`,
                    color: getTodayCompletionRate() > 50 ? "text-green-300" : "text-red-300"
                  },
                ].map((stat, index) => (
                  <div
                    key={`home-stat-${index}`}
                    className="text-center bg-white/5 rounded-2xl p-3 border border-white/10"
                  >
                    <p className="text-white/90 text-xs uppercase tracking-wide mb-1">
                      {stat.label}
                    </p>
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 bg-white/5 rounded-2xl p-4 border border-white/10">
                <h3 className="text-white/90 text-sm font-medium mb-3">Today's Status</h3>
                <div className="space-y-2">
                  {habits.map((habit) => {
                    const isCompletedToday = getCurrentDayCompletions()[habit.id] || false;
                    const IconComponent = getIconComponent(habit.icon);
                    return (
                      <div key={habit.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="w-4 h-4 text-white/90" />
                          <span className="text-white/90 text-sm">{habit.name}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                          isCompletedToday 
                            ? "bg-green-500/20 text-green-300 border border-green-400/30"
                            : "bg-red-500/20 text-red-300 border border-red-400/30"
                        }`}>
                          {isCompletedToday ? (
                            <>
                              <FaCheckCircle className="w-3 h-3" />
                              <span>Done</span>
                            </>
                          ) : (
                            <>
                              <FaTimesCircle className="w-3 h-3" />
                              <span>Pending</span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-2 mb-6 shadow-xl"
              variants={fadeIn}
            >
              <div className="flex space-x-1">
                {[
                  { id: "overview", label: "Overview", icon: BarChart3 },
                  { id: "timeline", label: "Timeline", icon: CircleDot },
                  { id: "analytics", label: "Analytics", icon: TrendingUp },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setViewMode(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                      viewMode === tab.id
                        ? "bg-white/20 text-white shadow-lg"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <tab.icon className="w-4 h-4 text-white" />
                    <span className="text-xs">{tab.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-4 mb-6 shadow-xl"
              variants={fadeIn}
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigateMonth("prev")}
                  className="text-white/90 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <div className="text-center overflow-hidden">
                  <div
                    className={`transition-transform duration-300 ${
                      monthTransition === "left"
                        ? "transform translate-x-full opacity-0"
                        : monthTransition === "right"
                        ? "transform -translate-x-full opacity-0"
                        : "transform translate-x-0 opacity-100"
                    }`}
                  >
                    <h2 className="text-white font-semibold text-lg">
                      {getMonthName(selectedMonth)}
                    </h2>
                    <p className="text-white/90 text-xs">Swipe to navigate</p>
                  </div>
                </div>
                <button
                  onClick={() => navigateMonth("next")}
                  className="text-white/90 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </motion.div>

            {viewMode === "overview" && (
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mb-6"
                initial="hidden"
                animate="visible"
                variants={fadeInStagger}
              >
                {habits.map((habit, index) => {
                  const progress = getMonthProgress(habit);
                  const streak = calculateStreak(habit);
                  const nextMilestone = getNextMilestone(habit);
                  const isAnimating = animatingHabit === habit.id;
                  const IconComponent = getIconComponent(habit.icon);

                  return (
                    <motion.div
                      key={habit.id}
                      onClick={() =>
                        setSelectedHabit(
                          selectedHabit === habit.id ? null : habit.id
                        )
                      }
                      className={`backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl cursor-pointer transition-all duration-500 ${
                        isAnimating
                          ? "bg-white/20 ring-2 ring-green-400/50"
                          : ""
                      } ${
                        selectedHabit === habit.id
                          ? "ring-2 ring-green-400/50"
                          : ""
                      }`}
                      variants={fadeIn}
                      whileHover={{ opacity: 0.9 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative w-20 h-20 mx-auto mb-4">
                        <svg className="transform -rotate-90 w-20 h-20">
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="4"
                            fill="transparent"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke={`url(#gradient-${habit.id})`}
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 32}`}
                            strokeDashoffset={`${
                              2 * Math.PI * 32 * (1 - progress / 100)
                            }`}
                            className="transition-all duration-1000 ease-out"
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient
                              id={`gradient-${habit.id}`}
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#10B981" />
                              <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      <div className="text-center">
                        <h3 className="text-white font-bold text-sm mb-2">
                          {habit.name}
                        </h3>
                        <div className="space-y-2">
                          <div className={`rounded-xl px-3 py-1 ${
                            streak > 0 
                              ? "bg-green-500/20 border border-green-400/30"
                              : "bg-red-500/20 border border-red-400/30"
                          }`}>
                            <span className="text-white/90 text-xs flex items-center space-x-1 justify-center">
                              <Flame className={`w-3 h-3 ${
                                streak > 0 ? "text-green-300" : "text-red-300"
                              }`} />
                              <span>{streak > 0 ? `${streak} days` : "No streak"}</span>
                            </span>
                          </div>
                          <div className="text-white/90 text-xs">
                            {Math.round(progress)}% this month
                          </div>
                          
                          <div className="flex justify-center space-x-1">
                            {[...Array(7)].map((_, i) => {
                              const checkDate = new Date();
                              checkDate.setDate(checkDate.getDate() - (6 - i));
                              const isCompleted = getHabitCompletion(habit.id, checkDate);
                              return (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    isCompleted 
                                      ? "bg-green-500" 
                                      : "bg-white/20"
                                  }`}
                                  title={`${checkDate.toLocaleDateString()}: ${
                                    isCompleted ? "Completed" : "Missed"
                                  }`}
                                />
                              );
                            })}
                          </div>
                          <div className="text-white/90 text-xs">Last 7 days</div>
                          
                          {nextMilestone && (
                            <div className="text-green-300 text-xs">
                              Next: {nextMilestone.title}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {viewMode === "timeline" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6">
                {habits.map((habit) => {
                  const timelineData = getCircularTimelineData(habit);
                  const streak = calculateStreak(habit);
                  const progress = getMonthProgress(habit);
                  const IconComponent = getIconComponent(habit.icon);

                  return (
                    <div
                      key={habit.id}
                      className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="w-6 h-6 text-white" />
                          <div>
                            <h3 className="text-white font-bold">
                              {habit.name}
                            </h3>
                            <p className="text-white/90 text-sm flex items-center space-x-1">
                              <Flame className="w-3 h-3 text-white" />
                              <span>{streak} day streak</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="relative flex justify-center items-center">
                        <svg width="240" height="240" className="mx-auto">
                          <circle
                            cx="120"
                            cy="120"
                            r="75"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                            strokeDasharray="2,2"
                          />
                          {timelineData.map((day) => (
                            <g key={`${habit.id}-day-${day.day}`}>
                              <circle
                                cx={day.x}
                                cy={day.y}
                                r={day.isToday ? "8" : "6"}
                                                                  fill={
                                    day.achievedMilestoneOnThisDay
                                      ? "transparent"
                                      : day.isCompleted
                                      ? "#10B981"
                                      : day.isToday
                                      ? getCurrentDayCompletions()[habit.id] === false
                                        ? "rgba(239, 68, 68, 0.8)"
                                        : "rgba(255, 255, 255, 0.3)"
                                      : day.date > currentDate
                                      ? "rgba(255, 255, 255, 0.15)"
                                      : "rgba(239, 68, 68, 0.6)"
                                  }
                                                                  stroke={
                                    day.achievedMilestoneOnThisDay
                                      ? "rgb(253 224 71)"
                                      : day.isToday
                                      ? "#FFFFFF"
                                      : day.isCompleted
                                      ? "#059669"
                                      : day.date > currentDate
                                      ? "rgba(255, 255, 255, 0.3)"
                                      : "#DC2626"
                                  }
                                strokeWidth={
                                  day.achievedMilestoneOnThisDay
                                    ? "2"
                                    : day.isToday
                                    ? "2"
                                    : "1"
                                }
                                className={`transition-all duration-300 ${
                                  day.achievedMilestoneOnThisDay
                                    ? "cursor-pointer hover:scale-110"
                                    : day.isCompleted
                                    ? ""
                                    : day.date > currentDate
                                    ? "opacity-50"
                                    : ""
                                }`}
                                onClick={
                                  day.achievedMilestoneOnThisDay
                                    ? () =>
                                        setTimelineMilestoneDetail({
                                          date: formatDate(day.date),
                                          milestone:
                                            day.achievedMilestoneOnThisDay!,
                                        })
                                    : undefined
                                }
                              />
                              {day.achievedMilestoneOnThisDay &&
                                React.createElement(
                                  getIconComponent(
                                    day.achievedMilestoneOnThisDay.icon
                                  ),
                                  {
                                    x: day.x - (day.isToday ? 6 : 5),
                                    y: day.y - (day.isToday ? 6 : 5),
                                    width: day.isToday ? 12 : 10,
                                    height: day.isToday ? 12 : 10,
                                    className: `text-yellow-300 pointer-events-none`,
                                  }
                                )}
                              

                              <text
                                x={day.numberX}
                                y={day.numberY + 4}
                                textAnchor="middle"
                                className="fill-white text-xs font-medium"
                                style={{ fontSize: "10px" }}
                              >
                                {day.day}
                              </text>
                            </g>
                          ))}
                          <text
                            x="120"
                            y="115"
                            textAnchor="middle"
                            className="fill-white text-sm font-bold"
                          >
                            {getMonthName(selectedMonth).split(" ")[0]}
                          </text>
                          <text
                            x="120"
                            y="130"
                            textAnchor="middle"
                            className="fill-white/60 text-xs"
                          >
                            {Math.round(progress)}% Complete
                          </text>
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {viewMode === "analytics" && (
              <div className="space-y-6 lg:space-y-8 mb-6">
                <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl">
                  <h3 className="text-white font-bold mb-4">
                    {getMonthName(selectedMonth)} Statistics
                  </h3>
                  <div className="space-y-4">
                    {habits.map((habit) => {
                      const streak = calculateStreak(habit);
                      const progress = getMonthProgress(habit);
                      const completionRate = habit.completedDates.length;
                      const IconComponent = getIconComponent(habit.icon);

                      return (
                        <div
                          key={habit.id}
                          className="bg-white/5 rounded-2xl p-4 border border-white/10"
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <IconComponent className="w-6 h-6 text-white" />
                            <div className="flex-1">
                              <h4 className="text-white font-medium">
                                {habit.name}
                              </h4>
                              <p className="text-white/90 text-sm">
                                {habit.category}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 lg:grid-cols-4 gap-2 lg:gap-4 text-center">
                            {[
                              { 
                                label: "Current", 
                                value: `${streak}d`,
                                color: streak > 0 ? "text-green-300" : "text-red-300"
                              },
                              {
                                label: "Best",
                                value: `${habit.longestStreak}d`,
                                color: "text-blue-300"
                              },
                              { 
                                label: "Total", 
                                value: completionRate,
                                color: "text-purple-300"
                              },
                              {
                                label: "Success",
                                value: `${Math.round((completionRate / (new Date().getDate())) * 100)}%`,
                                color: completionRate > 15 ? "text-green-300" : "text-orange-300"
                              }
                            ].map((stat, index) => (
                              <div key={`${habit.id}-stat-${index}`}>
                                <p className="text-white/90 text-xs uppercase">
                                  {stat.label}
                                </p>
                                <p className={`font-bold text-sm ${stat.color}`}>
                                  {stat.value}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-white/90 mb-1">
                              <span>This Month</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${habit.color} transition-all duration-1000`}
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        );
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="fixed top-4 left-0 right-0 z-[60] flex flex-col items-center space-y-2">
        <AnimatePresence>
        {toasts.map((toast) => (
            <motion.div
            key={toast.id}
              className={`backdrop-blur-lg border rounded-2xl px-6 py-3 shadow-2xl ${
              toast.type === "success"
                ? "bg-green-500/20 border-green-400/30 text-green-100"
                : toast.type === "warning"
                ? "bg-yellow-500/20 border-yellow-400/30 text-yellow-100"
                : "bg-blue-500/20 border-blue-400/30 text-blue-100"
            }`}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
          >
            <p className="font-medium text-sm">{toast.message}</p>
            </motion.div>
        ))}
        </AnimatePresence>
      </div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl"
          animate={{
            opacity: [0.7, 1, 0.7],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />
        <motion.div 
          className="absolute top-40 right-8 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl"
          animate={{
            opacity: [0.7, 1, 0.7],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }
          }}
        />
        <motion.div 
          className="absolute bottom-32 left-6 w-36 h-36 bg-teal-500/20 rounded-full blur-3xl"
          animate={{
            opacity: [0.7, 1, 0.7],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-12 w-28 h-28 bg-lime-500/15 rounded-full blur-2xl"
          animate={{
            opacity: [0.7, 1, 0.7],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }
          }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/10 border-b border-white/20 px-4 lg:px-8 py-4 shadow-xl">
        <div className="max-w-md lg:max-w-4xl xl:max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                Habit Flow
              </h1>
              <p className="text-white/90 text-xs">
                Welcome back, {userProfile.name.split(" ")[0]}!
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="hidden lg:flex items-center space-x-4 mr-6">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-2xl transition-all duration-200 cursor-pointer ${
                    activeTab === item.id
                      ? "bg-white/20 shadow-lg text-white"
                      : "hover:bg-white/10 text-white/90 hover:text-white"
                  }`}
                  variants={buttonHover}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.button>
              ))}
            </div>
            
            {activeTab === "home" && (
              <>
                <motion.button
                  onClick={() => setShowAddHabit(true)}
                  className="bg-white/20 border border-white/30 text-white p-2 rounded-2xl backdrop-blur-sm hover:bg-white/30 transition-all duration-200 shadow-lg cursor-pointer"
                  variants={buttonHover}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Plus className="w-5 h-5 text-white" />
                </motion.button>
                <motion.button
                  onClick={() => setShowCheckIn(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-2xl font-semibold shadow-xl hover:opacity-90 transition-opacity duration-200 text-sm cursor-pointer"
                  variants={buttonHover}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  Check In
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative z-10 max-w-md lg:max-w-4xl xl:max-w-6xl mx-auto p-4 lg:p-8 pb-24 lg:pb-8 mt-20"
        onTouchStart={activeTab === "home" ? handleTouchStart : undefined}
        onTouchEnd={activeTab === "home" ? handleTouchEnd : undefined}
      >
        <AnimatePresence mode="wait">
        {renderContent()}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 backdrop-blur-lg bg-white/10 border-t border-white/20 px-4 lg:px-8 py-2 shadow-2xl lg:hidden">
        <div className="max-w-md lg:max-w-4xl xl:max-w-6xl mx-auto">
          <div className="flex items-center justify-around">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-2xl transition-all duration-200 cursor-pointer ${
                  activeTab === item.id
                    ? "bg-white/20 shadow-lg"
                    : "hover:bg-white/10"
                }`}
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <item.icon
                  className={`w-6 h-6 text-white transition-all duration-200 ${
                    activeTab === item.id ? "opacity-100" : "opacity-70"
                  }`}
                />
                <span
                  className={`text-xs font-medium transition-all duration-200 ${
                    activeTab === item.id ? "text-white" : "text-white/90"
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
      {streakCelebration && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="text-center"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <motion.div 
                className="text-6xl mb-4 flex justify-center"
                animate={{
                  opacity: [0.7, 1, 0.7],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
              <Flame className="w-16 h-16 text-orange-500" />
              </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {streakCelebration.streak} Day
              {streakCelebration.streak > 1 ? "s" : ""}!
            </h2>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-lime-400 to-green-500 bg-clip-text text-transparent mb-4">
              Amazing streak!
            </h3>
            </motion.div>
          </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {showCheckIn && (
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="backdrop-blur-2xl bg-white/15 border border-white/30 rounded-3xl p-8 max-w-sm lg:max-w-md w-full shadow-2xl max-h-[80vh] overflow-y-auto"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeInUp}
            >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Daily Check-in
              </h2>
              <p className="text-white/90">
                Mark your completed habits for today
              </p>
              <div className="mt-4 bg-white/10 rounded-2xl p-3">
                <p className="text-white/90 text-sm">
                  {currentDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {habits.map((habit) => {
                const currentCompletions = getCurrentDayCompletions();
                const isCompleted = currentCompletions[habit.id] || false;
                const streak = calculateStreak(habit);
                const IconComponent = getIconComponent(habit.icon);

                return (
                  <button
                    key={habit.id}
                    onClick={() => toggleHabitCompletion(habit.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isCompleted
                        ? "bg-white/20 border-green-400/50 shadow-lg shadow-green-400/20"
                        : "bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <IconComponent className="w-6 h-6 text-white" />
                      <div className="text-left">
                        <span className="text-white font-medium block">
                          {habit.name}
                        </span>
                        <span className="text-white/90 text-sm flex items-center space-x-1">
                          <Flame className="w-3 h-3 text-white" />
                          <span>{streak} days</span>
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        isCompleted
                          ? "bg-green-500 border-green-500 shadow-lg shadow-green-500/30"
                          : "border-white/40 hover:border-white/60"
                      }`}
                    >
                      {isCompleted && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setPendingCompletions({});
                  setShowCheckIn(false);
                  setShouldAutoOpenCheckIn(false);
                  const today = formatDate(new Date());
                  saveToStorage(STORAGE_KEYS.AUTO_CHECKIN_DISMISSED, today);
                }}
                className="flex-1 bg-white/10 border border-white/30 text-white py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-200 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={submitCheckIn}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-semibold shadow-xl hover:opacity-90 transition-opacity duration-200 cursor-pointer"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {showAddHabit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-2xl bg-white/15 border border-white/30 rounded-3xl p-8 max-w-sm lg:max-w-lg w-full shadow-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Add New Habit
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-white/90 text-sm font-medium block mb-2">
                  Habit Name
                </label>
                <input
                  type="text"
                  value={newHabitForm.name}
                  onChange={(e) =>
                    setNewHabitForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g., Morning Jog"
                  className="w-full bg-white/10 border border-white/30 rounded-2xl px-4 py-3 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-white/90 text-sm font-medium block mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-4 lg:grid-cols-6 gap-3">
                  {habitIcons.map((iconName) => {
                    const IconComponent = getIconComponent(iconName);
                    return (
                      <button
                        key={iconName}
                        onClick={() =>
                          setNewHabitForm((prev) => ({
                            ...prev,
                            icon: iconName,
                          }))
                        }
                        className={`bg-white/10 hover:bg-white/20 border rounded-xl p-3 transition-all duration-200 cursor-pointer flex items-center justify-center ${
                          newHabitForm.icon === iconName
                            ? "border-green-400 bg-white/20"
                            : "border-white/20"
                        }`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-white/90 text-sm font-medium block mb-2">
                  Category
                </label>
                <select
                  value={newHabitForm.category}
                  onChange={(e) =>
                    setNewHabitForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full bg-white/10 border border-white/30 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_12px] bg-[right_1rem_center] bg-no-repeat pr-10"
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="bg-slate-800 text-white"
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-8">
              <button
                onClick={() => {
                  setShowAddHabit(false);
                  setNewHabitForm({
                    name: "",
                    icon: "Target",
                    category: "Health",
                  });
                }}
                className="flex-1 bg-white/10 border border-white/30 text-white py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={addNewHabit}
                disabled={!newHabitForm.name.trim()}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-semibold shadow-xl hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Add Habit
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
      {celebratingMilestone && (
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="backdrop-blur-2xl bg-white/15 border border-white/30 rounded-3xl p-8 max-w-sm lg:max-w-md w-full shadow-2xl text-center relative overflow-hidden"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeInUp}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-green-500/10"></div>
              <div className="absolute top-4 right-4 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-green-400/20 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                <motion.div 
                  className="text-6xl mb-6 flex justify-center"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
              {React.createElement(
                getIconComponent(celebratingMilestone.milestone.icon),
                {
                      className: "w-16 h-16 text-yellow-300 drop-shadow-lg",
                }
              )}
                </motion.div>
                
                <motion.h2 
                  className="text-3xl font-bold text-white mb-3 flex items-center justify-center space-x-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <FaGift className="w-8 h-8 text-yellow-300" />
                  <span>Milestone Achieved!</span>
                </motion.h2>
                
                <motion.div 
                  className="bg-gradient-to-r from-yellow-400/20 to-green-400/20 border border-yellow-400/30 rounded-2xl p-4 mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent mb-2">
              {celebratingMilestone.milestone.title}
            </h3>
                  <p className="text-white/90 font-medium">
                    {celebratingMilestone.milestone.days} Days Strong!
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-white/10 rounded-2xl p-4 mb-6 border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-white/90 leading-relaxed">
                    Amazing work on <span className="text-green-300 font-semibold">
                      {habits.find((h) => h.id === celebratingMilestone.habitId)?.name}
                    </span>! You've successfully completed {celebratingMilestone.milestone.days} consecutive days.
            </p>
                </motion.div>
                
                <motion.div 
                  className="flex justify-center space-x-4 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                      transition: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    <Sparkles className="w-8 h-8 text-yellow-300" />
                  </motion.div>
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      transition: {
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.3
                      }
                    }}
                  >
                    <Trophy className="w-8 h-8 text-green-300" />
                  </motion.div>
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, -10, 10, 0],
                      transition: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.6
                      }
                    }}
                  >
                    <Crown className="w-8 h-8 text-yellow-300" />
                  </motion.div>
                </motion.div>
                
                <motion.p 
                  className="text-white/90 text-sm italic flex items-center justify-center space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <span>Keep up the incredible momentum!</span>
                  <FaRocket className="w-4 h-4 text-blue-300" />
                </motion.p>
            </div>
            </motion.div>
          </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {timelineMilestoneDetail && (
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="backdrop-blur-2xl bg-white/15 border border-white/30 rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center relative overflow-hidden"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeInUp}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-green-500/10"></div>
              <div className="absolute top-2 right-2 w-16 h-16 bg-yellow-400/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-2 left-2 w-12 h-12 bg-green-400/20 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                <motion.div 
                  className="flex justify-center mb-4"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
              {React.createElement(
                getIconComponent(timelineMilestoneDetail.milestone.icon),
                {
                      className: "w-12 h-12 text-yellow-300 drop-shadow-lg",
                }
              )}
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-r from-yellow-400/20 to-green-400/20 border border-yellow-400/30 rounded-2xl p-4 mb-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent mb-2">
              {timelineMilestoneDetail.milestone.title}
            </h3>
                  <p className="text-white/90 font-medium text-sm">
                    {timelineMilestoneDetail.milestone.days} Days Achievement
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-white/10 rounded-2xl p-4 mb-4 border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
            <p className="text-white/90 text-sm mb-2">
                    <span className="text-green-300 font-medium">Achieved on:</span>
                  </p>
                  <p className="text-white/90 font-medium text-sm">
              {new Date(
                timelineMilestoneDetail.date + "T00:00:00"
              ).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
                </motion.div>
                
                <motion.p 
                  className="text-white/90 text-sm mb-6 leading-relaxed flex items-center justify-center space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <span>
                    Congratulations on reaching the <span className="text-green-300 font-semibold">
                      {timelineMilestoneDetail.milestone.days}-day
                    </span> milestone!
                  </span>
                  <FaGift className="w-4 h-4 text-yellow-300" />
                </motion.p>
                
                <motion.button
              onClick={() => setTimelineMilestoneDetail(null)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-xl hover:opacity-90 transition-opacity duration-200 cursor-pointer flex items-center space-x-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
            >
                  <span>Awesome!</span>
                  <FaRocket className="w-4 h-4" />
                </motion.button>
          </div>
            </motion.div>
          </motion.div>
      )}
      </AnimatePresence>

      <style jsx global>{`
     @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap');

        html,
        body {
          font-family: 'Manrope', sans-serif;
        }

        * {
          scrollbar-width: none; 
          -ms-overflow-style: none; 
        }

        *::-webkit-scrollbar {
          display: none; 
        }
      `}</style>
    </motion.div>
  );
};

export default HabitTracker; 
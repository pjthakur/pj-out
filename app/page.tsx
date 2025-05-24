"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import {
    FiSun, FiMoon, FiUpload, FiMusic, FiDownload,
    FiShare2, FiCopy, FiTwitter, FiInstagram, FiFacebook
} from 'react-icons/fi';
import { HiPlay, HiPause, HiOutlineVolumeUp, HiOutlineVolumeOff } from 'react-icons/hi';
import { RiTiktokLine } from 'react-icons/ri';
import { MdUndo, MdRedo } from 'react-icons/md';
import { toast, Toaster } from 'sonner';

export default function PodcastClips() {
    // Theme state
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Audio file states
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [audioSrc, setAudioSrc] = useState<string>('');
    const [fileName, setFileName] = useState<string>('');
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Audio player states
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.8);

    // Clipping states
    const [clipStart, setClipStart] = useState(0);
    const [clipEnd, setClipEnd] = useState(60);
    const [isProcessingClip, setIsProcessingClip] = useState(false);
    const [captions, setCaptions] = useState<string>("Select a part of the audio to see transcription");
    const [clipHistory, setClipHistory] = useState<{ start: number, end: number }[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isClipCreated, setIsClipCreated] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    // Touch gesture states
    const [touchStartX, setTouchStartX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);

    // Refs
    const audioRef = useRef<HTMLAudioElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Format time from seconds to MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Load theme from localStorage on initial render
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
            setTheme(savedTheme);
        }
    }, []);

    // Save theme to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Toggle theme and provide haptic feedback
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    };

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        if (!file.type.includes('audio')) {
            alert('Please upload an audio file');
            return;
        }

        handleUploadedFile(file);
    };

    // Process uploaded file
    const handleUploadedFile = (file: File) => {
        // Clean up previous URL if exists
        if (audioSrc) {
            URL.revokeObjectURL(audioSrc);
        }

        // Create a new object URL
        const url = URL.createObjectURL(file);

        // Update state
        setAudioFile(file);
        setAudioSrc(url);
        setFileName(file.name);
        setIsFileUploaded(true);
        setIsPlaying(false);
        setCurrentTime(0);
        setClipStart(0);
        setIsClipCreated(false);

        // Add initial state to history
        setClipHistory([{ start: 0, end: Math.min(60, duration || 60) }]);
        setHistoryIndex(0);

        // Haptic feedback for successful upload
        if (navigator.vibrate) {
            navigator.vibrate([30, 30, 60]);
        }
    };

    // Handle drag and drop events
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleUploadedFile(files[0]);
        }
    };

    // Trigger file input click
    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Load audio and metadata
    useEffect(() => {
        if (audioRef.current && audioSrc) {
            audioRef.current.src = audioSrc;
            audioRef.current.load();
        }
    }, [audioSrc]);

    // Audio event handlers
    const handleMetadataLoaded = () => {
        if (!audioRef.current) return;

        const audioDuration = audioRef.current.duration;
        setDuration(audioDuration);
        setClipEnd(Math.min(60, audioDuration));

        // Redraw waveform
        drawWaveform();
    };

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        const time = audioRef.current.currentTime;
        const audioIsPlaying = !audioRef.current.paused;
        
        console.log('Time update - Current time:', time, 'Audio paused:', audioRef.current.paused, 'Audio ended:', audioRef.current.ended);
        
        // Stop playback if we've reached the clip end
        if (time >= clipEnd && isPlaying) {
            console.log('Reached clip end, stopping playback');
            audioRef.current.pause();
            // Reset to clip start for next play
            audioRef.current.currentTime = clipStart;
            setIsPlaying(false);
            return;
        }
        
        setCurrentTime(time);

        // Update captions based on current time
        setCaptions(generateCaptions(time));

        // Redraw current position
        drawWaveform();
    };

    // Play/pause toggle
    const togglePlayPause = async () => {
        if (!audioRef.current || !audioSrc) {
            console.log('Cannot play - no audio ref or source');
            return;
        }

        console.log('Toggle play/pause - Current state:', isPlaying, 'Audio paused:', audioRef.current.paused);

        try {
            if (isPlaying) {
                audioRef.current.pause();
                console.log('Audio paused');
                setIsPlaying(false);
            } else {
                // Check if audio is ready to play
                if (audioRef.current.readyState >= 2) {
                    console.log('Starting audio playback from position:', clipStart);
                    
                    // Set the audio to start from the clip start position
                    audioRef.current.currentTime = clipStart;
                    
                    await audioRef.current.play();
                    console.log('Audio play started successfully from:', clipStart);
                    setIsPlaying(true);
                } else {
                    console.log('Audio not ready, readyState:', audioRef.current.readyState);
                    toast.error('Audio not ready', {
                        description: 'Please wait for the audio to load completely.',
                        duration: 3000,
                    });
                }
            }

            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(25);
            }
        } catch (error) {
            console.error('Audio play failed:', error);
            setIsPlaying(false);
            
            // Show user-friendly error message
            toast.error('Audio playback failed', {
                description: 'Please try again or check your browser settings.',
                duration: 3000,
            });
        }
    };

    // Toggle mute
    const toggleMute = () => {
        if (!audioRef.current) return;

        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    // Handle volume change
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);

        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    // Handle clip start change
    const handleClipStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStart = parseFloat(e.target.value);
        if (newStart < clipEnd - 1) {
            setClipStart(newStart);
            
            // If audio is currently playing and is before the new start, seek to new start
            if (audioRef.current && isPlaying && audioRef.current.currentTime < newStart) {
                audioRef.current.currentTime = newStart;
                console.log('Adjusted playback position to new clip start:', newStart);
            }
            
            drawWaveform();
        }
    };

    // Handle clip end change
    const handleClipEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEnd = parseFloat(e.target.value);
        if (newEnd > clipStart + 1 && newEnd - clipStart <= 60) {
            setClipEnd(newEnd);
            
            // If audio is currently playing and is past the new end, pause and reset
            if (audioRef.current && isPlaying && audioRef.current.currentTime > newEnd) {
                audioRef.current.pause();
                audioRef.current.currentTime = clipStart;
                setIsPlaying(false);
                console.log('Stopped playback due to clip end change');
            }
            
            drawWaveform();
        }
    };

    // Create clip and open share modal
    const createAndShareClip = () => {
        if (!audioRef.current || !audioSrc) return;

        setIsProcessingClip(true);

        // Add to history
        const newHistory = [...clipHistory.slice(0, historyIndex + 1), { start: clipStart, end: clipEnd }];
        setClipHistory(newHistory);
        setHistoryIndex(historyIndex + 1);

        // Simulate processing
        setTimeout(() => {
            setIsProcessingClip(false);
            setIsClipCreated(true);
            
            // Open share modal after processing
            openShareModal();

            // Haptic feedback - stronger for completion
            if (navigator.vibrate) {
                navigator.vibrate([50, 50, 100]);
            }
        }, 1000);
    };

    // Open share modal
    const openShareModal = () => {
        setIsShareModalOpen(true);
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }
    };

    // Close share modal
    const closeShareModal = () => {
        setIsShareModalOpen(false);
    };

    // Handle escape key to close modal
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isShareModalOpen) {
                closeShareModal();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isShareModalOpen]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isShareModalOpen) {
            // Store original body style
            const originalStyle = window.getComputedStyle(document.body).overflow;
            
            // Prevent scrolling
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '0px'; // Prevent layout shift
            
            // Cleanup function to restore scroll
            return () => {
                document.body.style.overflow = originalStyle;
                document.body.style.paddingRight = '';
            };
        }
    }, [isShareModalOpen]);

    // Undo clip
    const handleUndo = () => {
        if (historyIndex <= 0) return;

        const prevClip = clipHistory[historyIndex - 1];
        setClipStart(prevClip.start);
        setClipEnd(prevClip.end);
        setHistoryIndex(historyIndex - 1);

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }
    };

    // Redo clip
    const handleRedo = () => {
        if (historyIndex >= clipHistory.length - 1) return;

        const nextClip = clipHistory[historyIndex + 1];
        setClipStart(nextClip.start);
        setClipEnd(nextClip.end);
        setHistoryIndex(historyIndex + 1);

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }
    };

    // Handle touch gestures for swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
        setIsSwiping(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isSwiping) return;

        const touchX = e.touches[0].clientX;
        const diffX = touchX - touchStartX;

        // Threshold for swipe action
        if (Math.abs(diffX) > 70) {
            if (diffX > 0) {
                // Swipe right - redo
                handleRedo();
            } else {
                // Swipe left - undo
                handleUndo();
            }
            setIsSwiping(false);
        }
    };

    const handleTouchEnd = () => {
        setIsSwiping(false);
    };

    // Share clip to a social platform
    const shareClip = (platform: string) => {
        if (!audioSrc) return;

        // In a real app, this would generate a shareable link
        const message = `Check out this podcast clip from ${formatTime(clipStart)} to ${formatTime(clipEnd)} on ${platform}!`;

        // Use toast instead of alert
        toast.success(`Sharing to ${platform}`, {
            description: message,
            duration: 3000,
            icon: platform === 'Twitter' ? <FiTwitter /> :
                platform === 'Instagram' ? <FiInstagram /> :
                    platform === 'Facebook' ? <FiFacebook /> :
                        platform === 'TikTok' ? <RiTiktokLine /> :
                            platform === 'Copy' ? <FiCopy /> : <FiDownload />,
        });

        // Close modal after sharing
        if (isShareModalOpen) {
            setTimeout(() => {
                closeShareModal();
            }, 500);
        }

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(40);
        }
    };

    // Generate simulated captions
    const generateCaptions = (time: number) => {
        if (duration === 0) return "Upload an audio file to see transcription";

        const captions = [
            "Welcome to this podcast where we explore interesting topics.",
            "Our guest today has amazing insights to share with us.",
            "Let's dive deeper into the subject of audio processing.",
            "Creating clips from podcasts is a great way to share highlights.",
            "The web platform offers powerful capabilities for audio manipulation.",
            "Modern browsers can process audio without sending data to servers.",
            "Privacy is important when handling media files online.",
            "React and TypeScript provide a robust foundation for web apps.",
            "User experience is enhanced with haptic feedback on mobile devices.",
            "Thank you for using our podcast clips creator!",
        ];

        // Select caption based on current time
        const position = Math.floor((time / duration) * captions.length);
        return captions[Math.min(position, captions.length - 1)];
    };

    // Generate waveform visualization on canvas
    const drawWaveform = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw background
        const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
        if (theme === 'light') {
            bgGradient.addColorStop(0, '#f0f9ff');
            bgGradient.addColorStop(1, '#e0f2fe');
        } else {
            bgGradient.addColorStop(0, '#0c4a6e');
            bgGradient.addColorStop(1, '#082f49');
        }
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        // Draw "bars"
        const barWidth = 2;
        const gap = 3;
        const totalBars = Math.floor(width / (barWidth + gap));

        // Create bar gradient
        const barGradient = ctx.createLinearGradient(0, height / 2 - 40, 0, height / 2 + 40);
        if (theme === 'light') {
            barGradient.addColorStop(0, '#4f46e5');  // More saturated indigo
            barGradient.addColorStop(1, '#3b82f6');  // More saturated blue
        } else {
            barGradient.addColorStop(0, '#818cf8');  // Lighter indigo
            barGradient.addColorStop(1, '#60a5fa');  // Lighter blue
        }
        ctx.fillStyle = barGradient;

        for (let i = 0; i < totalBars; i++) {
            // Use a seeded random for consistency
            const seed = i * 1.3;
            const randomHeight = (Math.sin(seed) * 0.5 + 0.5) * height * 0.7;
            const barHeight = randomHeight + (height * 0.1);
            const x = i * (barWidth + gap) + gap / 2;
            const y = (height - barHeight) / 2;
            ctx.fillRect(x, y, barWidth, barHeight);
        }

        // Draw selected area with gradient
        const selectionGradient = ctx.createLinearGradient(0, 0, 0, height);
        if (theme === 'light') {
            selectionGradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
            selectionGradient.addColorStop(1, 'rgba(37, 99, 235, 0.3)');
        } else {
            selectionGradient.addColorStop(0, 'rgba(96, 165, 250, 0.3)');
            selectionGradient.addColorStop(1, 'rgba(59, 130, 246, 0.3)');
        }

        const startX = (clipStart / duration) * width;
        const endX = (clipEnd / duration) * width;

        ctx.fillStyle = selectionGradient;
        ctx.fillRect(startX, 0, endX - startX, height);

        // Draw start and end handles with improved visibility
        // Start handle indicator
        const handleWidth = 8;

        // Draw handle gradients
        const startHandleGradient = ctx.createLinearGradient(0, 0, 0, height);
        if (theme === 'light') {
            startHandleGradient.addColorStop(0, '#4338ca'); // Indigo
            startHandleGradient.addColorStop(1, '#3730a3');
        } else {
            startHandleGradient.addColorStop(0, '#6366f1');
            startHandleGradient.addColorStop(1, '#4f46e5');
        }

        const endHandleGradient = ctx.createLinearGradient(0, 0, 0, height);
        if (theme === 'light') {
            endHandleGradient.addColorStop(0, '#7c3aed'); // Purple
            endHandleGradient.addColorStop(1, '#6d28d9');
        } else {
            endHandleGradient.addColorStop(0, '#8b5cf6');
            endHandleGradient.addColorStop(1, '#7c3aed');
        }

        // Start handle - thicker with a grip indicator
        ctx.fillStyle = startHandleGradient;
        ctx.fillRect(startX - handleWidth / 2, 0, handleWidth, height);

        // Add grip lines to start handle
        ctx.fillStyle = theme === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)';
        ctx.fillRect(startX - handleWidth / 2 + 2, height / 4, handleWidth - 4, 2);
        ctx.fillRect(startX - handleWidth / 2 + 2, height / 2, handleWidth - 4, 2);
        ctx.fillRect(startX - handleWidth / 2 + 2, height * 3 / 4, handleWidth - 4, 2);

        // Add arrow indicator for dragging
        ctx.beginPath();
        ctx.moveTo(startX - 10, height / 2);
        ctx.lineTo(startX - 4, height / 2 - 6);
        ctx.lineTo(startX - 4, height / 2 + 6);
        ctx.closePath();
        ctx.fillStyle = theme === 'light' ? 'rgba(79, 70, 229, 0.8)' : 'rgba(139, 92, 246, 0.8)';
        ctx.fill();

        // End handle - thicker with a grip indicator
        ctx.fillStyle = endHandleGradient;
        ctx.fillRect(endX - handleWidth / 2, 0, handleWidth, height);

        // Add grip lines to end handle
        ctx.fillStyle = theme === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)';
        ctx.fillRect(endX - handleWidth / 2 + 2, height / 4, handleWidth - 4, 2);
        ctx.fillRect(endX - handleWidth / 2 + 2, height / 2, handleWidth - 4, 2);
        ctx.fillRect(endX - handleWidth / 2 + 2, height * 3 / 4, handleWidth - 4, 2);

        // Add arrow indicator for dragging
        ctx.beginPath();
        ctx.moveTo(endX + 10, height / 2);
        ctx.lineTo(endX + 4, height / 2 - 6);
        ctx.lineTo(endX + 4, height / 2 + 6);
        ctx.closePath();
        ctx.fillStyle = theme === 'light' ? 'rgba(124, 58, 237, 0.8)' : 'rgba(167, 139, 250, 0.8)';
        ctx.fill();

        // Draw current position
        const posX = (currentTime / duration) * width;
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(posX - 1, 0, 2, height);

    }, [theme, clipStart, clipEnd, currentTime, duration]);

    // Call drawWaveform when the relevant states change
    useEffect(() => {
        drawWaveform();
    }, [drawWaveform]);

    // Calculate clip duration
    const clipDuration = clipEnd - clipStart;

    // Theme-specific styles
    const bgColor = theme === 'light' ? 'bg-gray-50' : 'bg-slate-950';
    const textColor = theme === 'light' ? 'text-gray-800' : 'text-gray-100';
    const cardBg = theme === 'light' ? 'bg-white' : 'bg-slate-900';
    const buttonBg = theme === 'light'
        ? 'bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800'
        : 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700';
    const secondaryBg = theme === 'light' ? 'bg-gray-100' : 'bg-slate-800';
    const borderColor = theme === 'light' ? 'border-gray-200' : 'border-slate-700';
    const accent = theme === 'light' ? 'text-indigo-600' : 'text-indigo-400';
    const peachAccent = theme === 'light' ? 'from-peach-400 to-peach-500' : 'from-peach-500 to-peach-600';
    const blueAccent = theme === 'light' ? 'from-indigo-600 to-blue-600' : 'from-blue-600 to-indigo-700';
    const softShadow = 'shadow-[0_8px_30px_rgb(0,0,0,0.12)]';
    const cardShadow = 'shadow-[0_4px_12px_rgba(0,0,0,0.05)]';

    // Track colors for sliders
    const startTrackColor = theme === 'light' ? '#4f46e5' : '#6366f1';
    const endTrackColor = theme === 'light' ? '#7c3aed' : '#8b5cf6';
    const trackBgLight = theme === 'light' ? '#e2e8f0' : '#1e293b';

    // Text colors
    const labelColor = theme === 'light' ? 'text-gray-800' : 'text-gray-300';
    const subtleTextColor = theme === 'light' ? 'text-gray-700' : 'text-gray-300';
    const timeDisplayColor = theme === 'light' ? 'text-gray-800' : 'text-gray-200';
    const secondaryTextColor = theme === 'light' ? 'text-gray-600' : 'text-gray-400';

    // Gradient text
    const headingGradient = theme === 'light'
        ? 'bg-gradient-to-r from-indigo-700 to-blue-600'
        : 'bg-gradient-to-r from-indigo-400 to-blue-300';
    const subHeadingGradient = theme === 'light'
        ? 'bg-gradient-to-r from-indigo-600 to-blue-500'
        : 'bg-gradient-to-r from-indigo-400 to-blue-300';

    return (
        <div
            className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            ref={wrapperRef}
        >
            {/* Toaster component for notifications */}
            <Toaster position="top-center" theme={theme} richColors />

            {/* Audio element (hidden) */}
            <audio
                ref={audioRef}
                onLoadedMetadata={handleMetadataLoaded}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
            />

            {/* File input (hidden) */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="audio/*"
                className="hidden"
            />

            {/* Parallax Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${theme === 'light' ? 'from-indigo-50/80 via-white/50 to-blue-50/80' : 'from-slate-950 via-slate-900/70 to-blue-950/60'} opacity-90`}></div>

                {/* Decorative elements with parallax effect */}
                <motion.div
                    className={`absolute top-[5%] left-[8%] w-64 h-64 rounded-full bg-gradient-to-r ${blueAccent} opacity-${theme === 'light' ? '10' : '15'} blur-3xl`}
                    animate={{
                        x: [0, 10, 0, -10, 0],
                        y: [0, -10, 0, 10, 0],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 20,
                        ease: "easeInOut"
                    }}
                />

                <motion.div
                    className={`absolute bottom-[15%] right-[5%] w-80 h-80 rounded-full bg-gradient-to-r ${peachAccent} opacity-${theme === 'light' ? '10' : '15'} blur-3xl`}
                    animate={{
                        x: [0, -15, 0, 15, 0],
                        y: [0, 10, 0, -10, 0],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 25,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />

                <motion.div
                    className={`absolute top-[40%] right-[25%] w-48 h-48 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 opacity-${theme === 'light' ? '10' : '5'} blur-2xl`}
                    animate={{
                        x: [0, 10, 0, -10, 0],
                        y: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 15,
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                />
            </div>

            {/* Header */}
            <header className={`sticky top-0 z-10 ${cardBg} ${cardShadow} backdrop-blur-sm bg-opacity-90 py-4 px-6 flex justify-between items-center`}>
                <h1 className={`text-xl font-bold bg-clip-text text-transparent ${headingGradient}`}>
                    Podcast Clips
                </h1>
                <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-full ${secondaryBg} ${softShadow} hover:scale-105 transition-all active:scale-95`}
                    aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                >
                    {theme === 'light' ? <FiMoon className={accent} size={20} /> : <FiSun className={accent} size={20} />}
                </button>
            </header>

            <main className={`max-w-md mx-auto py-6 px-4 flex flex-col gap-5 ${isFileUploaded ? 'pb-6' : 'pb-6'}`}>
                {/* File Upload Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`${cardBg} rounded-2xl ${cardShadow} p-4 overflow-hidden`}
                >
                    {isFileUploaded ? (
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-full bg-gradient-to-r ${blueAccent} text-white`}>
                                <FiMusic size={24} />
                            </div>
                            <div className="flex-1 truncate">
                                <h3 className="font-medium">{fileName}</h3>
                                <p className={`text-xs ${secondaryTextColor}`}>
                                    {formatTime(duration)} • MP3
                                </p>
                            </div>
                            <button
                                onClick={triggerFileInput}
                                className={`p-2 rounded-lg ${secondaryBg} transition-all hover:scale-105 active:scale-95`}
                            >
                                Change
                            </button>
                        </div>
                    ) : (
                        <div
                            className={`border-2 border-dashed ${isDragging ? 'border-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/10' : borderColor} rounded-xl p-6 text-center transition-colors duration-200`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={triggerFileInput}
                        >
                            <div className="flex flex-col items-center justify-center gap-2">
                                <div className={`p-3 rounded-full bg-gradient-to-r ${blueAccent} text-white ${softShadow}`}>
                                    <FiUpload size={24} />
                                </div>
                                <h3 className={`font-medium ${labelColor}`}>Upload your podcast</h3>
                                <p className={`text-sm ${secondaryTextColor} max-w-xs`}>
                                    Drag and drop your MP3 file here, or tap to browse
                                </p>
                                <div className="mt-2">
                                    <button
                                        className={`py-2 px-4 rounded-lg ${buttonBg} text-white ${softShadow} transition-all hover:scale-105 active:scale-95`}
                                    >
                                        Choose File
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Waveform and clip selection - Only shown if file is uploaded */}
                {isFileUploaded && (
                    <AnimatePresence>
                        <motion.div
                            key="waveform-section"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className={`${cardBg} rounded-2xl ${cardShadow} p-5`}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h2 className={`text-lg font-semibold bg-clip-text text-transparent ${subHeadingGradient}`}>Select Clip <span className={`text-sm font-normal ${secondaryTextColor}`}>(max 60s)</span></h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleUndo}
                                        disabled={historyIndex <= 0}
                                        className={`p-1.5 rounded-lg ${secondaryBg} ${historyIndex <= 0 ? 'opacity-50' : 'transition-all hover:scale-105 active:scale-95'}`}
                                        aria-label="Undo"
                                    >
                                        <MdUndo size={18} className={labelColor} />
                                    </button>
                                    <button
                                        onClick={handleRedo}
                                        disabled={historyIndex >= clipHistory.length - 1}
                                        className={`p-1.5 rounded-lg ${secondaryBg} ${historyIndex >= clipHistory.length - 1 ? 'opacity-50' : 'transition-all hover:scale-105 active:scale-95'}`}
                                        aria-label="Redo"
                                    >
                                        <MdRedo size={18} className={labelColor} />
                                    </button>
                                </div>
                            </div>

                            {/* Waveform visualization */}
                            <div className="relative mb-3 rounded-xl overflow-hidden ${softShadow}">
                                <canvas
                                    ref={canvasRef}
                                    width={500}
                                    height={120}
                                    className="w-full h-28 touch-none"
                                />
                                <div className="absolute top-0 left-0 w-full flex justify-between px-1.5 mt-1 pointer-events-none">
                                    <span className="inline-flex items-center justify-center h-5 px-1.5 rounded-full bg-indigo-600 text-white text-xs shadow-lg">
                                        Start
                                    </span>
                                    <span className="inline-flex items-center justify-center h-5 px-1.5 rounded-full bg-purple-600 text-white text-xs shadow-lg">
                                        End
                                    </span>
                                </div>
                                <div className="absolute bottom-1 w-full text-center text-xs text-white font-medium bg-black/30 py-0.5 rounded-full mx-auto pointer-events-none" style={{ width: '180px', left: 'calc(50% - 90px)' }}>
                                    Drag handles to adjust clip
                                </div>
                            </div>

                            {/* Time display */}
                            <div className="flex justify-between text-sm mb-2">
                                <div className={`font-mono font-medium ${timeDisplayColor}`}>{formatTime(clipStart)}</div>
                                <div className={`font-medium bg-clip-text text-transparent ${subHeadingGradient} font-mono`}>{formatTime(clipDuration)} / 60s</div>
                                <div className={`font-mono font-medium ${timeDisplayColor}`}>{formatTime(clipEnd)}</div>
                            </div>

                            {/* Range sliders */}
                            <div className="flex gap-4 mb-8">
                                <div className="flex-1">
                                    <label className={`text-xs font-medium ${labelColor} block mb-2`}>
                                        Clip Start Time
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="range"
                                            min={0}
                                            max={Math.max(0, duration - 1)}
                                            step={0.5}
                                            value={clipStart}
                                            onChange={handleClipStartChange}
                                            className="w-full h-8 appearance-none cursor-pointer bg-gray-200 dark:bg-slate-700 rounded-lg range-input range-indigo"
                                            style={{
                                                backgroundImage: `linear-gradient(to right, ${startTrackColor} 0%, ${startTrackColor} ${(clipStart / Math.max(duration, 1)) * 100}%, ${trackBgLight} ${(clipStart / Math.max(duration, 1)) * 100}%)`
                                            }}
                                        />
                                        <div className="flex justify-between mt-2">
                                            <span className={`text-xs font-medium ${subtleTextColor}`}>
                                                0:00
                                            </span>
                                            <span className={`text-xs font-medium ${subtleTextColor}`}>
                                                {formatTime(duration)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className={`text-xs font-medium ${labelColor} block mb-2`}>
                                        Clip End Time
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="range"
                                            min={1}
                                            max={duration}
                                            step={0.5}
                                            value={clipEnd}
                                            onChange={handleClipEndChange}
                                            className="w-full h-8 appearance-none cursor-pointer bg-gray-200 dark:bg-slate-700 rounded-lg range-input range-purple"
                                            style={{
                                                backgroundImage: `linear-gradient(to right, ${trackBgLight} 0%, ${trackBgLight} ${(clipEnd / Math.max(duration, 1)) * 100}%, ${endTrackColor} ${(clipEnd / Math.max(duration, 1)) * 100}%)`
                                            }}
                                        />
                                        <div className="flex justify-between mt-2">
                                            <span className={`text-xs font-medium ${subtleTextColor}`}>
                                                0:00
                                            </span>
                                            <span className={`text-xs font-medium ${subtleTextColor}`}>
                                                {formatTime(duration)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between px-1 mb-1">
                                <div className="py-1 px-2 rounded-md flex items-center">
                                    <span className="inline-block w-3 h-3 bg-indigo-500 rounded-full mr-1"></span>
                                    <p className={`text-xs ${subtleTextColor}`}>
                                        Selected: <span className="font-semibold">{formatTime(clipDuration)}</span>
                                    </p>
                                </div>
                                <div className=" py-1 px-2 rounded-md">
                                    <p className={`text-xs ${subtleTextColor}`}>
                                        Swipe <span className="font-semibold">←</span> undo, <span className="font-semibold">→</span> redo
                                    </p>
                                </div>
                            </div>

                            {/* Export clip button */}
                            <button
                                onClick={createAndShareClip}
                                disabled={isProcessingClip || clipDuration > 60}
                                className={`w-full py-3 px-4 rounded-xl mt-4 ${isProcessingClip || clipDuration > 60
                                    ? 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-500'
                                    : `${buttonBg} text-white ${softShadow} transition-all hover:scale-[1.02] active:scale-[0.98]`
                                    } flex items-center justify-center gap-2`}
                            >
                                {isProcessingClip ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : clipDuration > 60 ? (
                                    'Clip too long (max 60s)'
                                ) : (
                                    <>
                                        <FiDownload size={18} />
                                        Export Clip
                                    </>
                                )}
                            </button>
                        </motion.div>

                        {/* Caption preview */}
                        <motion.div
                            key="caption-section"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className={`${cardBg} rounded-2xl ${cardShadow} p-5`}
                        >
                            <h2 className={`text-lg font-semibold bg-clip-text text-transparent ${subHeadingGradient} mb-3`}>Transcript Preview</h2>
                            <div className={`p-4 rounded-xl ${secondaryBg} min-h-16 flex items-center ${labelColor} text-sm italic ${softShadow} backdrop-blur-sm`}>
                                {captions}
                            </div>
                        </motion.div>

                        {/* Share Modal */}
                        <AnimatePresence>
                            {isShareModalOpen && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                                    onClick={closeShareModal}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        onClick={(e) => e.stopPropagation()}
                                        className={`w-full max-w-md ${cardBg} rounded-2xl shadow-2xl overflow-hidden`}
                                    >
                                        {/* Modal Header */}
                                        <div className={`p-5 border-b ${borderColor} flex items-center justify-between`}>
                                            <h2 className={`text-lg font-semibold bg-clip-text text-transparent ${subHeadingGradient}`}>
                                                Share Your Clip
                                            </h2>
                                            <button
                                                onClick={closeShareModal}
                                                className={`p-2 rounded-lg ${secondaryBg} transition-all hover:scale-105 active:scale-95`}
                                            >
                                                <svg className={`w-5 h-5 ${labelColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Modal Content */}
                                        <div className="p-5">
                                            {/* Clip info */}
                                            <div className={`p-3 rounded-xl ${secondaryBg} mb-5 flex items-center justify-between`}>
                                                <div>
                                                    <p className={`text-sm font-medium ${labelColor}`}>Selected Clip</p>
                                                    <p className={`text-xs ${secondaryTextColor}`}>
                                                        {formatTime(clipStart)} - {formatTime(clipEnd)} • {formatTime(clipDuration)}
                                                    </p>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full ${buttonBg} text-white text-xs font-medium`}>
                                                    Ready to share
                                                </div>
                                            </div>

                                            {/* Social icons */}
                                            <div className="grid grid-cols-4 gap-3 mb-5">
                                                <button
                                                    onClick={() => shareClip('Twitter')}
                                                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 transition-all hover:scale-105 active:scale-95"
                                                >
                                                    <FiTwitter size={24} className="text-blue-500" />
                                                    <span className={`text-xs ${labelColor} font-medium`}>Twitter</span>
                                                </button>

                                                <button
                                                    onClick={() => shareClip('Instagram')}
                                                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-peach-50 to-pink-50 dark:from-peach-900/20 dark:to-pink-900/20 transition-all hover:scale-105 active:scale-95"
                                                >
                                                    <FiInstagram size={24} className="text-pink-500" />
                                                    <span className={`text-xs ${labelColor} font-medium`}>Instagram</span>
                                                </button>

                                                <button
                                                    onClick={() => shareClip('Facebook')}
                                                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 transition-all hover:scale-105 active:scale-95"
                                                >
                                                    <FiFacebook size={24} className="text-blue-600" />
                                                    <span className={`text-xs ${labelColor} font-medium`}>Facebook</span>
                                                </button>

                                                <button
                                                    onClick={() => shareClip('TikTok')}
                                                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 transition-all hover:scale-105 active:scale-95"
                                                >
                                                    <RiTiktokLine size={24} className={textColor} />
                                                    <span className={`text-xs ${labelColor} font-medium`}>TikTok</span>
                                                </button>
                                            </div>

                                            {/* Copy and download */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    onClick={() => shareClip('Copy')}
                                                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl ${secondaryBg} ${softShadow} transition-all hover:scale-[1.02] active:scale-[0.98]`}
                                                >
                                                    <FiCopy size={18} className={labelColor} />
                                                    <span className={labelColor}>Copy Link</span>
                                                </button>

                                                <button
                                                    onClick={() => shareClip('Download')}
                                                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl ${buttonBg} text-white ${softShadow} transition-all hover:scale-[1.02] active:scale-[0.98]`}
                                                >
                                                    <FiDownload size={18} />
                                                    <span>Download</span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </AnimatePresence>
                )}

                {/* Instructions for when no file is uploaded */}
                {!isFileUploaded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className={`${cardBg} rounded-2xl ${cardShadow} p-6 text-center`}
                    >
                        <div className="mx-auto mb-4 flex flex-col items-center">
                            <div className={`inline-flex p-4 mb-4 rounded-full bg-gradient-to-br ${blueAccent} text-white ${softShadow}`}>
                                <FiMusic size={30} />
                            </div>
                            <h2 className={`text-xl font-semibold mb-3 bg-clip-text text-transparent ${headingGradient}`}>Create & Share Podcast Clips</h2>
                            <p className={`${secondaryTextColor} mb-6 max-w-xs mx-auto`}>
                                Upload your favorite podcast and create short 60-second clips to share with your friends.
                            </p>

                            <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${blueAccent} flex items-center justify-center text-white font-semibold ${softShadow}`}>
                                        1
                                    </div>
                                    <p className={`text-xs ${subtleTextColor}`}>Upload podcast</p>
                                </div>

                                <div className="flex flex-col items-center gap-2">
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-semibold ${softShadow}`}>
                                        2
                                    </div>
                                    <p className={`text-xs ${subtleTextColor}`}>Select clip</p>
                                </div>

                                <div className="flex flex-col items-center gap-2">
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${blueAccent} flex items-center justify-center text-white font-semibold ${softShadow}`}>
                                        3
                                    </div>
                                    <p className={`text-xs ${subtleTextColor}`}>Share it</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>

            {/* Floating Player Controls - Only show when audio is uploaded */}
            {isFileUploaded && (
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed bottom-4 left-4 right-4 z-50"
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={`max-w-md mx-auto ${cardBg} rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-sm bg-opacity-95 border border-opacity-20`} 
                         style={{borderColor: theme === 'light' ? '#e2e8f0' : '#334155'}}>
                        
                        {/* Main player controls */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex flex-col items-center">
                                <button
                                    onClick={togglePlayPause}
                                    className={`p-3 rounded-full bg-gradient-to-r ${blueAccent} text-white shadow-lg transition-all hover:scale-105 active:scale-95`}
                                >
                                    {isPlaying ? <HiPause size={20} /> : <HiPlay size={20} />}
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={toggleMute}
                                    className={`p-2 rounded-lg ${isMuted ? accent : subtleTextColor} hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
                                >
                                    {isMuted ? <HiOutlineVolumeOff size={18} /> : <HiOutlineVolumeUp size={18} />}
                                </button>
                                <div className="flex items-center">
                                    <input
                                        type="range"
                                        min={0}
                                        max={1}
                                        step={0.05}
                                        value={volume}
                                        onChange={handleVolumeChange}
                                        onTouchStart={(e) => e.stopPropagation()}
                                        onTouchMove={(e) => e.stopPropagation()}
                                        onTouchEnd={(e) => e.stopPropagation()}
                                        className="w-16 h-2 appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 rounded-lg range-input range-volume"
                                        style={{
                                            backgroundImage: `linear-gradient(to right, ${theme === 'light' ? '#4f46e5' : '#6366f1'} 0%, ${theme === 'light' ? '#4f46e5' : '#6366f1'} ${volume * 100}%, ${theme === 'light' ? '#e2e8f0' : '#1e293b'} ${volume * 100}%)`
                                        }}
                                    />
                                </div>
                            </div>

                            <div className={`text-sm font-medium font-mono ${timeDisplayColor} min-w-[45px] text-right`}>
                                {formatTime(currentTime)}
                            </div>
                        </div>

                        {/* Clip info bar */}
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1">
                                <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
                                <span className={subtleTextColor}>
                                    Clip: {formatTime(clipStart)} - {formatTime(clipEnd)}
                                </span>
                            </div>
                            <span className={`${subtleTextColor} font-mono`}>
                                {formatTime(clipDuration)} / 60s
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}

            <footer className={`px-4 text-center text-sm text-gray-500 dark:text-gray-400 ${isFileUploaded ? 'pb-35' : 'pb-8'}`}>
                <p>Create and share podcast moments that matter</p>
            </footer>

            <style jsx global>{`
                /* Global styles for custom range inputs */
                .range-input {
                    -webkit-appearance: none;
                    appearance: none;
                    background: transparent;
                    cursor: pointer;
                }
                
                /* Track styles - WebKit */
                .range-input::-webkit-slider-runnable-track {
                    height: 8px;
                    border-radius: 4px;
                    background: transparent;
                }
                
                /* Track styles - Firefox */
                .range-input::-moz-range-track {
                    height: 8px;
                    border-radius: 4px;
                    background: transparent;
                    border: none;
                }
                
                /* Thumb styles for WebKit/Blink */
                .range-input::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    cursor: pointer;
                    border: 3px solid white;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    margin-top: -6px; /* Centers thumb on track */
                }
                
                /* Thumb styles for Firefox */
                .range-input::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    cursor: pointer;
                    border: 3px solid white;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    background: transparent;
                }
                
                /* Remove default Firefox styles */
                .range-input::-moz-range-progress {
                    background: transparent;
                }
                
                .range-input::-moz-range-track {
                    background: transparent;
                }
                
                /* Active thumb state */
                .range-input:active::-webkit-slider-thumb {
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }
                
                .range-input:active::-moz-range-thumb {
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }
                
                /* Hover state */
                .range-input:hover::-webkit-slider-thumb {
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
                }
                
                .range-input:hover::-moz-range-thumb {
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
                }
                
                .range-input:focus {
                    outline: none;
                }
                
                /* Color variants for indigo (start slider) */
                .range-indigo::-webkit-slider-thumb {
                    background: #4338ca;
                }
                
                .range-indigo::-moz-range-thumb {
                    background: #4338ca;
                }
                
                /* Color variants for purple (end slider) */
                .range-purple::-webkit-slider-thumb {
                    background: #7c3aed;
                }
                
                .range-purple::-moz-range-thumb {
                    background: #7c3aed;
                }
                
                /* Color variants for volume slider */
                .range-volume::-webkit-slider-thumb {
                    background: #4f46e5;
                    width: 14px;
                    height: 14px;
                    margin-top: -5px;
                    border: 2px solid white;
                    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
                }
                
                .range-volume::-moz-range-thumb {
                    background: #4f46e5;
                    width: 14px;
                    height: 14px;
                    border: 2px solid white;
                    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
                }

                /* Volume slider track for smaller size */
                .range-volume::-webkit-slider-runnable-track {
                    height: 4px;
                    border-radius: 2px;
                }
                
                .range-volume::-moz-range-track {
                    height: 4px;
                    border-radius: 2px;
                }
            `}</style>
        </div>
    );
}
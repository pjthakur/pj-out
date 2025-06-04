"use client";
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Menu, X, Globe, Trophy, Target, BookOpen, Home, Info, Mail, Phone, Clock, Zap, Star, Award, Volume2, VolumeX, Moon, Sun, Share2, RotateCcw, Settings, Play, Users, Gamepad2, Brain, MapPin, Flag, ChevronDown } from 'lucide-react';

// Types and Interfaces
interface Country {
    name: string;
    code: string;
    capital: string;
    population: string;
    funFact: string;
    continent: string;
    currency: string;
    language: string;
    flagEmoji: string;
}

interface GameState {
    currentCountry: Country | null;
    options: Country[];
    score: number;
    streak: number;
    bestStreak: number;
    totalQuestions: number;
    correctAnswers: number;
    showResult: boolean;
    isCorrect: boolean;
    showLearnMore: boolean;
    gameStarted: boolean;
    gameMode: 'flags' | 'capitals' | 'mixed';
    difficulty: 'easy' | 'medium' | 'hard';
    timeLeft: number;
    timerActive: boolean;
    hintsUsed: number;
    hintsAvailable: number;
    selectedAnswer: Country | null;
}

interface Settings {
    soundEnabled: boolean;
    darkMode: boolean;
    timerEnabled: boolean;
    hintsEnabled: boolean;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    requirement: number;
    progress: number;
}

const GeoQuizPro: React.FC = () => {
    // Enhanced country data with flag emojis instead of API calls
    const countries: Country[] = useMemo(() => [
        {
            name: "Japan",
            code: "JP",
            capital: "Tokyo",
            population: "125.8 million",
            funFact: "Japan consists of 6,852 islands, but only about 430 are inhabited.",
            continent: "Asia",
            currency: "Japanese Yen (¥)",
            language: "Japanese",
            flagEmoji: "🇯🇵"
        },
        {
            name: "Brazil",
            code: "BR",
            capital: "Brasília",
            population: "215.3 million",
            funFact: "Brazil is home to about 60% of the Amazon rainforest.",
            continent: "South America",
            currency: "Brazilian Real (R$)",
            language: "Portuguese",
            flagEmoji: "🇧🇷"
        },
        {
            name: "France",
            code: "FR",
            capital: "Paris",
            population: "67.8 million",
            funFact: "France is the most visited country in the world with over 89 million tourists annually.",
            continent: "Europe",
            currency: "Euro (€)",
            language: "French",
            flagEmoji: "🇫🇷"
        },
        {
            name: "Australia",
            code: "AU",
            capital: "Canberra",
            population: "25.7 million",
            funFact: "Australia is the only country that is also a continent.",
            continent: "Oceania",
            currency: "Australian Dollar (A$)",
            language: "English",
            flagEmoji: "🇦🇺"
        },
        {
            name: "Canada",
            code: "CA",
            capital: "Ottawa",
            population: "38.2 million",
            funFact: "Canada has more lakes than the rest of the world combined.",
            continent: "North America",
            currency: "Canadian Dollar (C$)",
            language: "English, French",
            flagEmoji: "🇨🇦"
        },
        {
            name: "Italy",
            code: "IT",
            capital: "Rome",
            population: "59.1 million",
            funFact: "Italy has more UNESCO World Heritage Sites than any other country.",
            continent: "Europe",
            currency: "Euro (€)",
            language: "Italian",
            flagEmoji: "🇮🇹"
        },
        {
            name: "South Korea",
            code: "KR",
            capital: "Seoul",
            population: "51.8 million",
            funFact: "South Korea has the fastest internet speeds in the world.",
            continent: "Asia",
            currency: "Korean Won (₩)",
            language: "Korean",
            flagEmoji: "🇰🇷"
        },
        {
            name: "Germany",
            code: "DE",
            capital: "Berlin",
            population: "83.2 million",
            funFact: "Germany has over 1,500 breweries and produces more than 5,000 types of beer.",
            continent: "Europe",
            currency: "Euro (€)",
            language: "German",
            flagEmoji: "🇩🇪"
        },
        {
            name: "Mexico",
            code: "MX",
            capital: "Mexico City",
            population: "128.9 million",
            funFact: "Mexico City is built on a lake and is sinking at a rate of 6-8 inches per year.",
            continent: "North America",
            currency: "Mexican Peso ($)",
            language: "Spanish",
            flagEmoji: "🇲🇽"
        },
        {
            name: "India",
            code: "IN",
            capital: "New Delhi",
            population: "1.38 billion",
            funFact: "India has 22 official languages and over 1,600 spoken languages.",
            continent: "Asia",
            currency: "Indian Rupee (₹)",
            language: "Hindi, English",
            flagEmoji: "🇮🇳"
        },
        {
            name: "United Kingdom",
            code: "GB",
            capital: "London",
            population: "67.5 million",
            funFact: "The UK invented the world's first postage stamp in 1840.",
            continent: "Europe",
            currency: "British Pound (£)",
            language: "English",
            flagEmoji: "🇬🇧"
        },
        {
            name: "Spain",
            code: "ES",
            capital: "Madrid",
            population: "47.4 million",
            funFact: "Spain has the second-highest number of UNESCO World Heritage Sites after Italy.",
            continent: "Europe",
            currency: "Euro (€)",
            language: "Spanish",
            flagEmoji: "🇪🇸"
        },
        {
            name: "China",
            code: "CN",
            capital: "Beijing",
            population: "1.41 billion",
            funFact: "The Great Wall of China is not visible from space with the naked eye.",
            continent: "Asia",
            currency: "Chinese Yuan (¥)",
            language: "Mandarin Chinese",
            flagEmoji: "🇨🇳"
        },
        {
            name: "Russia",
            code: "RU",
            capital: "Moscow",
            population: "146.7 million",
            funFact: "Russia spans 11 time zones, the most of any country in the world.",
            continent: "Europe/Asia",
            currency: "Russian Ruble (₽)",
            language: "Russian",
            flagEmoji: "🇷🇺"
        },
        {
            name: "United States",
            code: "US",
            capital: "Washington, D.C.",
            population: "333.3 million",
            funFact: "The US has no official national language at the federal level.",
            continent: "North America",
            currency: "US Dollar ($)",
            language: "English (de facto)",
            flagEmoji: "🇺🇸"
        },
        {
            name: "Argentina",
            code: "AR",
            capital: "Buenos Aires",
            population: "45.8 million",
            funFact: "Argentina is the birthplace of tango and has won the most Copa América titles.",
            continent: "South America",
            currency: "Argentine Peso ($)",
            language: "Spanish",
            flagEmoji: "🇦🇷"
        },
        {
            name: "Egypt",
            code: "EG",
            capital: "Cairo",
            population: "104.3 million",
            funFact: "The Great Pyramid of Giza was the world's tallest building for over 3,800 years.",
            continent: "Africa",
            currency: "Egyptian Pound (£)",
            language: "Arabic",
            flagEmoji: "🇪🇬"
        },
        {
            name: "Thailand",
            code: "TH",
            capital: "Bangkok",
            population: "69.8 million",
            funFact: "Thailand is the only Southeast Asian country never to have been colonized.",
            continent: "Asia",
            currency: "Thai Baht (฿)",
            language: "Thai",
            flagEmoji: "🇹🇭"
        },
        {
            name: "Netherlands",
            code: "NL",
            capital: "Amsterdam",
            population: "17.4 million",
            funFact: "The Netherlands has more museums per square mile than any other country.",
            continent: "Europe",
            currency: "Euro (€)",
            language: "Dutch",
            flagEmoji: "🇳🇱"
        },
        {
            name: "Sweden",
            code: "SE",
            capital: "Stockholm",
            population: "10.4 million",
            funFact: "Sweden has not been at war for over 200 years, since 1814.",
            continent: "Europe",
            currency: "Swedish Krona (kr)",
            language: "Swedish",
            flagEmoji: "🇸🇪"
        }
    ], []);

    // Achievements system
    const initialAchievements: Achievement[] = useMemo(() => [
        {
            id: 'first_correct',
            title: 'First Steps',
            description: 'Answer your first question correctly',
            icon: '🎯',
            unlocked: false,
            requirement: 1,
            progress: 0
        },
        {
            id: 'streak_5',
            title: 'Getting Hot',
            description: 'Achieve a 5-question streak',
            icon: '🔥',
            unlocked: false,
            requirement: 5,
            progress: 0
        },
        {
            id: 'streak_10',
            title: 'On Fire',
            description: 'Achieve a 10-question streak',
            icon: '⚡',
            unlocked: false,
            requirement: 10,
            progress: 0
        },
        {
            id: 'score_50',
            title: 'Half Century',
            description: 'Score 50 points',
            icon: '🏆',
            unlocked: false,
            requirement: 50,
            progress: 0
        },
        {
            id: 'speed_demon',
            title: 'Speed Demon',
            description: 'Answer 5 questions in under 3 seconds each',
            icon: '💨',
            unlocked: false,
            requirement: 5,
            progress: 0
        }
    ], []);

    // Game State
    const [gameState, setGameState] = useState<GameState>({
        currentCountry: null,
        options: [],
        score: 0,
        streak: 0,
        bestStreak: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        showResult: false,
        isCorrect: false,
        showLearnMore: false,
        gameStarted: false,
        gameMode: 'flags',
        difficulty: 'medium',
        timeLeft: 15,
        timerActive: false,
        hintsUsed: 0,
        hintsAvailable: 3,
        selectedAnswer: null
    });

    // Settings State
    const [settings, setSettings] = useState<Settings>({
        soundEnabled: true,
        darkMode: false,
        timerEnabled: true,
        hintsEnabled: true
    });

    // UI State
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showAchievements, setShowAchievements] = useState(false);
    const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
    const [showCountryModal, setShowCountryModal] = useState(false);
    const [selectedCountryDetails, setSelectedCountryDetails] = useState<Country | null>(null);
    const [fastAnswerCount, setFastAnswerCount] = useState(0);
    const [activeSection, setActiveSection] = useState('home');

    // Refs for sections
    const homeRef = useRef<HTMLElement>(null);
    const featuresRef = useRef<HTMLElement>(null);
    const howItWorksRef = useRef<HTMLElement>(null);
    const gameRef = useRef<HTMLElement>(null);
    const aboutRef = useRef<HTMLElement>(null);
    const contactRef = useRef<HTMLElement>(null);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (gameState.timerActive && gameState.timeLeft > 0 && settings.timerEnabled) {
            interval = setInterval(() => {
                setGameState(prev => {
                    if (prev.timeLeft <= 1) {
                        return {
                            ...prev,
                            timeLeft: 0,
                            timerActive: false,
                            showResult: true,
                            isCorrect: false,
                            totalQuestions: prev.totalQuestions + 1,
                            streak: 0,
                            selectedAnswer: null
                        };
                    }
                    return { ...prev, timeLeft: prev.timeLeft - 1 };
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [gameState.timerActive, gameState.timeLeft, settings.timerEnabled]);

    // Prevent body scroll when modals are open
    useEffect(() => {
        const body = document.body;
        if (showSettings || showAchievements || showCountryModal || isMobileMenuOpen) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = 'unset';
        }

        return () => {
            body.style.overflow = 'unset';
        };
    }, [showSettings, showAchievements, showCountryModal, isMobileMenuOpen]);

    // Scroll spy effect
    useEffect(() => {
        const handleScroll = () => {
            const sections = [
                { id: 'home', ref: homeRef },
                { id: 'features', ref: featuresRef },
                { id: 'how-it-works', ref: howItWorksRef },
                { id: 'game', ref: gameRef },
                { id: 'about', ref: aboutRef },
                { id: 'contact', ref: contactRef }
            ];

            const scrollPosition = window.scrollY + 100;

            for (const section of sections) {
                const element = section.ref.current;
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Get difficulty settings
    const getDifficultySettings = useCallback(() => {
        switch (gameState.difficulty) {
            case 'easy':
                return { timeLimit: 20, countries: countries.slice(0, 10) };
            case 'medium':
                return { timeLimit: 15, countries: countries.slice(0, 15) };
            case 'hard':
                return { timeLimit: 10, countries: countries };
            default:
                return { timeLimit: 15, countries: countries.slice(0, 15) };
        }
    }, [gameState.difficulty, countries]);

    // Generate random question
    const generateQuestion = useCallback(() => {
        const { countries: availableCountries } = getDifficultySettings();
        const randomIndex = Math.floor(Math.random() * availableCountries.length);
        const correctCountry = availableCountries[randomIndex];

        const wrongOptions = availableCountries
            .filter(country => country.name !== correctCountry.name)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        const allOptions = [correctCountry, ...wrongOptions].sort(() => Math.random() - 0.5);

        const { timeLimit } = getDifficultySettings();

        setGameState(prev => ({
            ...prev,
            currentCountry: correctCountry,
            options: allOptions,
            showResult: false,
            showLearnMore: false,
            timeLeft: timeLimit,
            timerActive: settings.timerEnabled,
            selectedAnswer: null
        }));
    }, [getDifficultySettings, settings.timerEnabled]);

    // Check achievements
    const checkAchievements = useCallback((newGameState: GameState) => {
        setAchievements(prev => prev.map(achievement => {
            if (achievement.unlocked) return achievement;

            let progress = achievement.progress;
            let unlocked = false;

            switch (achievement.id) {
                case 'first_correct':
                    progress = newGameState.correctAnswers;
                    unlocked = progress >= achievement.requirement;
                    break;
                case 'streak_5':
                    progress = newGameState.streak;
                    unlocked = progress >= achievement.requirement;
                    break;
                case 'streak_10':
                    progress = newGameState.streak;
                    unlocked = progress >= achievement.requirement;
                    break;
                case 'score_50':
                    progress = newGameState.score;
                    unlocked = progress >= achievement.requirement;
                    break;
                case 'speed_demon':
                    progress = fastAnswerCount;
                    unlocked = progress >= achievement.requirement;
                    break;
            }

            return { ...achievement, progress, unlocked };
        }));
    }, [fastAnswerCount]);

    // Scroll to section
    const scrollToSection = useCallback((sectionId: string) => {
        const refs: { [key: string]: React.RefObject<HTMLElement | null> } = {
            'home': homeRef,
            'features': featuresRef,
            'how-it-works': howItWorksRef,
            'game': gameRef,
            'about': aboutRef,
            'contact': contactRef
        };

        const ref = refs[sectionId];
        if (ref?.current) {
            ref.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        setIsMobileMenuOpen(false);
    }, []);

    // Start game
    const startGame = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            gameStarted: true,
            score: 0,
            streak: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            showResult: false,
            showLearnMore: false,
            hintsUsed: 0,
            hintsAvailable: 3,
            selectedAnswer: null
        }));
        setFastAnswerCount(0);
        generateQuestion();
    }, [generateQuestion]);

    // Handle answer selection
    const handleAnswer = useCallback((selectedCountry: Country) => {
        if (gameState.showResult) return;

        const answerTime = getDifficultySettings().timeLimit - gameState.timeLeft;
        const isFastAnswer = answerTime <= 3;

        if (isFastAnswer) {
            setFastAnswerCount(prev => prev + 1);
        }

        const isCorrect = selectedCountry.name === gameState.currentCountry?.name;
        const newStreak = isCorrect ? gameState.streak + 1 : 0;
        const newBestStreak = Math.max(newStreak, gameState.bestStreak);
        const newScore = isCorrect ? gameState.score + (gameState.difficulty === 'hard' ? 3 : gameState.difficulty === 'medium' ? 2 : 1) : gameState.score;
        const newCorrectAnswers = isCorrect ? gameState.correctAnswers + 1 : gameState.correctAnswers;

        const newGameState = {
            ...gameState,
            score: newScore,
            streak: newStreak,
            bestStreak: newBestStreak,
            totalQuestions: gameState.totalQuestions + 1,
            correctAnswers: newCorrectAnswers,
            showResult: true,
            isCorrect,
            timerActive: false,
            selectedAnswer: selectedCountry
        };

        setGameState(newGameState);
        checkAchievements(newGameState);

        if (settings.soundEnabled) {
            console.log(isCorrect ? 'Correct sound!' : 'Wrong sound!');
        }
    }, [gameState, getDifficultySettings, checkAchievements, settings.soundEnabled]);

    // Use hint
    const useHint = useCallback(() => {
        if (gameState.hintsAvailable <= 0 || !settings.hintsEnabled) return;

        setGameState(prev => ({
            ...prev,
            hintsAvailable: prev.hintsAvailable - 1,
            hintsUsed: prev.hintsUsed + 1
        }));

        if (gameState.currentCountry) {
            setSelectedCountryDetails(gameState.currentCountry);
            setShowCountryModal(true);
        }
    }, [gameState.hintsAvailable, gameState.currentCountry, settings.hintsEnabled]);

    // Next question
    const nextQuestion = useCallback(() => {
        generateQuestion();
    }, [generateQuestion]);

    // Reset game
    const resetGame = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            gameStarted: false,
            score: 0,
            streak: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            showResult: false,
            showLearnMore: false,
            hintsUsed: 0,
            hintsAvailable: 3,
            selectedAnswer: null
        }));
    }, []);

    // Share results
    const shareResults = useCallback(() => {
        const accuracy = gameState.totalQuestions > 0
            ? Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100)
            : 0;

        const text = `I just scored ${gameState.score} points with ${accuracy}% accuracy on GeoQuiz Pro! My best streak was ${gameState.bestStreak}. Can you beat it?`;
        const url = encodeURIComponent(window.location.href);
        const quote = encodeURIComponent(text);

        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`;

        window.open(facebookShareUrl, '_blank');
    }, [gameState]);

    // Toggle mobile menu
    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prev => !prev);
    }, []);

    // Close modal when clicking outside
    const handleModalBackdropClick = useCallback((e: React.MouseEvent, closeModal: () => void) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    }, []);

    // Calculate accuracy
    const accuracy = gameState.totalQuestions > 0 ? Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100) : 0;

    return (
        <div className={`min-h-screen transition-colors duration-300 ${settings.darkMode ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'} font-roboto`}>
            {/* Roboto Font */}
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />

            {/* Navigation */}
            <nav className={`${settings.darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-md border-b ${settings.darkMode ? 'border-gray-700' : 'border-gray-200'} fixed top-0 w-full z-50 transition-all duration-300`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('home')}>
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                                <Globe className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                GeoQuiz Pro
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {[
                                { id: 'home', label: 'Home', icon: Home },
                                { id: 'features', label: 'Features', icon: Star },
                                { id: 'how-it-works', label: 'How It Works', icon: Info },
                                { id: 'game', label: 'Play Game', icon: Gamepad2 },
                                { id: 'about', label: 'About', icon: Users },
                                { id: 'contact', label: 'Contact', icon: Mail }
                            ].map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => scrollToSection(id)}
                                    className={`cursor-pointer font-medium transition-colors duration-200 flex items-center space-x-1 ${activeSection === id
                                        ? 'text-blue-600'
                                        : settings.darkMode
                                            ? 'text-gray-300 hover:text-blue-400'
                                            : 'text-gray-700 hover:text-blue-600'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Theme Toggle & Settings */}
                        <div className="hidden md:flex items-center space-x-4">
                            <button
                                onClick={() => setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
                                className={`cursor-pointer p-2 rounded-lg ${settings.darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-all duration-200`}
                            >
                                {settings.darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </button>

                            <button
                                onClick={() => setShowSettings(true)}
                                className={`cursor-pointer p-2 rounded-lg ${settings.darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-all duration-200`}
                            >
                                <Settings className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center space-x-2">
                            <button
                                onClick={() => setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
                                className={`cursor-pointer p-2 rounded-lg ${settings.darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-all duration-200`}
                            >
                                {settings.darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </button>
                            <button
                                onClick={toggleMobileMenu}
                                className={`cursor-pointer ${settings.darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} p-2 rounded-lg transition-colors duration-200`}
                            >
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div
                            className={`md:hidden border-t ${settings.darkMode ? 'border-gray-700 bg-gray-800/95' : 'border-gray-200 bg-white/95'} backdrop-blur-sm py-4`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col space-y-4">
                                {[
                                    { id: 'home', label: 'Home', icon: Home },
                                    { id: 'features', label: 'Features', icon: Star },
                                    { id: 'how-it-works', label: 'How It Works', icon: Info },
                                    { id: 'game', label: 'Play Game', icon: Gamepad2 },
                                    { id: 'about', label: 'About', icon: Users },
                                    { id: 'contact', label: 'Contact', icon: Mail }
                                ].map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => scrollToSection(id)}
                                        className={`cursor-pointer font-medium transition-colors duration-200 flex items-center space-x-2 px-2 text-left ${activeSection === id
                                            ? 'text-blue-600'
                                            : settings.darkMode
                                                ? 'text-gray-300 hover:text-blue-400'
                                                : 'text-gray-700 hover:text-blue-600'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{label}</span>
                                    </button>
                                ))}

                                <div className={`border-t ${settings.darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4`}>
                                    <button
                                        onClick={() => {
                                            setShowSettings(true);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`cursor-pointer ${settings.darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} font-medium transition-colors duration-200 flex items-center space-x-2 px-2 text-left`}
                                    >
                                        <Settings className="h-4 w-4" />
                                        <span>Settings</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section ref={homeRef} id="home" className="pt-4 min-h-screen flex items-center justify-center">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <div className="mb-8">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 py-6">
                            Master World Geography
                        </h1>
                        <p className={`text-xl sm:text-2xl ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-4xl mx-auto mb-12 leading-relaxed`}>
                            Test your knowledge of countries, flags, and cultures in our interactive geography quiz.
                            Challenge yourself and discover fascinating facts about nations around the world.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                            <button
                                onClick={() => scrollToSection('game')}
                                className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
                            >
                                <Play className="h-5 w-5" />
                                <span>Start Playing Now</span>
                            </button>

                            <button
                                onClick={() => scrollToSection('features')}
                                className={`cursor-pointer ${settings.darkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-50'} px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-gray-200 flex items-center space-x-2`}
                            >
                                <Info className="h-5 w-5" />
                                <span>Learn More</span>
                            </button>
                        </div>
                    </div>

                    {/* Hero Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {[
                            { number: '20+', label: 'Countries', icon: Flag },
                            { number: '3', label: 'Game Modes', icon: Gamepad2 },
                            { number: '5', label: 'Achievements', icon: Trophy },
                            { number: '∞', label: 'Fun Learning', icon: Brain }
                        ].map(({ number, label, icon: Icon }, index) => (
                            <div key={index} className={`${settings.darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm rounded-xl p-6 border ${settings.darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-all duration-300`}>
                                <Icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                                <div className="text-3xl font-bold text-blue-600 mb-2">{number}</div>
                                <div className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section ref={featuresRef} id="features" className="pb-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className={`text-3xl sm:text-4xl font-bold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>
                            Powerful Features
                        </h2>
                        <p className={`text-lg ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
                            Everything you need to master world geography in an engaging, interactive way
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Flag,
                                title: 'Flag Quiz',
                                description: 'Test your knowledge by identifying countries from their flags',
                                color: 'blue'
                            },
                            {
                                icon: MapPin,
                                title: 'Capital Quiz',
                                description: 'Match countries with their capital cities',
                                color: 'green'
                            },
                            {
                                icon: Clock,
                                title: 'Timed Challenges',
                                description: 'Race against time with adjustable difficulty levels',
                                color: 'orange'
                            },
                            {
                                icon: Trophy,
                                title: 'Achievement System',
                                description: 'Unlock achievements and track your progress',
                                color: 'purple'
                            },
                            {
                                icon: Zap,
                                title: 'Hint System',
                                description: 'Get helpful hints when you need them most',
                                color: 'yellow'
                            },
                            {
                                icon: BookOpen,
                                title: 'Educational Content',
                                description: 'Learn fascinating facts about countries worldwide',
                                color: 'red'
                            }
                        ].map(({ icon: Icon, title, description, color }, index) => (
                            <div key={index} className={`${settings.darkMode ? 'bg-gray-800/70' : 'bg-white/70'} backdrop-blur-sm rounded-xl p-6 border ${settings.darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                                <div className={`bg-${color}-100 p-3 rounded-lg w-fit mb-4`}>
                                    <Icon className={`h-6 w-6 text-${color}-600`} />
                                </div>
                                <h3 className={`text-xl font-bold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>{title}</h3>
                                <p className={`${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section ref={howItWorksRef} id="how-it-works" className={`py-20 ${settings.darkMode ? 'bg-gray-800/30' : 'bg-gray-50/50'}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className={`text-3xl sm:text-4xl font-bold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>
                            How It Works
                        </h2>
                        <p className={`text-lg ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
                            Get started in three simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '1',
                                title: 'Choose Your Mode',
                                description: 'Select from flag quiz, capital quiz, or mixed mode with your preferred difficulty level',
                                icon: Settings
                            },
                            {
                                step: '2',
                                title: 'Answer Questions',
                                description: 'Test your knowledge by selecting the correct answer from multiple choices',
                                icon: Target
                            },
                            {
                                step: '3',
                                title: 'Learn & Improve',
                                description: 'Discover fascinating facts about countries and track your progress',
                                icon: Award
                            }
                        ].map(({ step, title, description, icon: Icon }, index) => (
                            <div key={index} className="text-center relative">
                                <div className="relative mb-6">
                                    <div className={`w-16 h-16 ${settings.darkMode ? 'bg-gray-700' : 'bg-white'} rounded-full flex items-center justify-center mx-auto border-4 border-blue-600 shadow-lg`}>
                                        <Icon className="h-7 w-7 text-blue-600" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        {step}
                                    </div>
                                </div>
                                <h3 className={`text-xl font-bold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'} mb-3`}>{title}</h3>
                                <p className={`${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>

                                {index < 2 && (
                                    <div className="hidden md:block absolute top-8 left-full w-full">
                                        <ChevronDown className="h-6 w-6 text-blue-600 mx-auto transform rotate-90" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Game Section */}
            <section ref={gameRef} id="game" className="py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Game Mode & Difficulty Selection */}
                    {!gameState.gameStarted && (
                        <div className="mb-6">
                            <div className="text-center mb-6">
                                <h2 className={`text-2xl sm:text-3xl font-bold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'} mb-3`}>
                                    Ready to Play?
                                </h2>
                                <p className={`text-base ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Choose your game mode and difficulty level
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-6">
                                {/* Game Mode */}
                                <div className={`${settings.darkMode ? 'bg-gray-800/70' : 'bg-white/70'} backdrop-blur-sm rounded-xl p-4 border ${settings.darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
                                    <h3 className={`text-base font-bold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'} mb-3`}>Game Mode</h3>
                                    <div className="space-y-2">
                                        {[
                                            { mode: 'flags' as const, label: 'Flag Quiz', desc: 'Identify countries by their flags' },
                                            { mode: 'capitals' as const, label: 'Capital Quiz', desc: 'Match countries with capitals' },
                                            { mode: 'mixed' as const, label: 'Mixed Quiz', desc: 'Flags and capitals combined' }
                                        ].map(({ mode, label, desc }) => (
                                            <button
                                                key={mode}
                                                onClick={() => setGameState(prev => ({ ...prev, gameMode: mode }))}
                                                className={`cursor-pointer w-full text-left p-3 rounded-lg transition-all duration-200 ${gameState.gameMode === mode
                                                    ? 'bg-blue-100 border-2 border-blue-500 text-blue-800'
                                                    : settings.darkMode
                                                        ? 'bg-gray-700 border border-gray-600 hover:bg-gray-600 text-gray-200'
                                                        : 'bg-gray-50 border border-gray-300 hover:bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                <div className="font-medium text-sm">{label}</div>
                                                <div className="text-xs opacity-70">{desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Difficulty */}
                                <div className={`${settings.darkMode ? 'bg-gray-800/70' : 'bg-white/70'} backdrop-blur-sm rounded-xl p-4 border ${settings.darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
                                    <h3 className={`text-base font-bold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'} mb-3`}>Difficulty</h3>
                                    <div className="space-y-2">
                                        {[
                                            { level: 'easy' as const, label: 'Easy', desc: '10 countries, 20s timer' },
                                            { level: 'medium' as const, label: 'Medium', desc: '15 countries, 15s timer' },
                                            { level: 'hard' as const, label: 'Hard', desc: '20 countries, 10s timer' }
                                        ].map(({ level, label, desc }) => (
                                            <button
                                                key={level}
                                                onClick={() => setGameState(prev => ({ ...prev, difficulty: level }))}
                                                className={`cursor-pointer w-full text-left p-3 rounded-lg transition-all duration-200 ${gameState.difficulty === level
                                                    ? 'bg-green-100 border-2 border-green-500 text-green-800'
                                                    : settings.darkMode
                                                        ? 'bg-gray-700 border border-gray-600 hover:bg-gray-600 text-gray-200'
                                                        : 'bg-gray-50 border border-gray-300 hover:bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                <div className="font-medium text-sm">{label}</div>
                                                <div className="text-xs opacity-70">{desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        <div className={`${settings.darkMode ? 'bg-gray-800/70' : 'bg-white/70'} backdrop-blur-sm rounded-lg p-3 border ${settings.darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                            <div className="flex items-center space-x-2">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <Trophy className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className={`text-xs ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Score</p>
                                    <p className={`text-lg font-bold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{gameState.score}</p>
                                </div>
                            </div>
                        </div>

                        <div className={`${settings.darkMode ? 'bg-gray-800/70' : 'bg-white/70'} backdrop-blur-sm rounded-lg p-3 border ${settings.darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                            <div className="flex items-center space-x-2">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <Target className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                    <p className={`text-xs ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Streak</p>
                                    <p className={`text-lg font-bold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{gameState.streak}</p>
                                </div>
                            </div>
                        </div>

                        <div className={`${settings.darkMode ? 'bg-gray-800/70' : 'bg-white/70'} backdrop-blur-sm rounded-lg p-3 border ${settings.darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                            <div className="flex items-center space-x-2">
                                <div className="bg-purple-100 p-2 rounded-lg">
                                    <Award className="h-4 w-4 text-purple-600" />
                                </div>
                                <div>
                                    <p className={`text-xs ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Best</p>
                                    <p className={`text-lg font-bold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{gameState.bestStreak}</p>
                                </div>
                            </div>
                        </div>

                        <div className={`${settings.darkMode ? 'bg-gray-800/70' : 'bg-white/70'} backdrop-blur-sm rounded-lg p-3 border ${settings.darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                            <div className="flex items-center space-x-2">
                                <div className="bg-orange-100 p-2 rounded-lg">
                                    <BookOpen className="h-4 w-4 text-orange-600" />
                                </div>
                                <div>
                                    <p className={`text-xs ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</p>
                                    <p className={`text-lg font-bold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{accuracy}%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Game Area */}
                    <div className={`${settings.darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm rounded-2xl shadow-2xl border ${settings.darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                        {!gameState.gameStarted ? (
                            // Start Screen
                            <div className="p-6 text-center min-h-[350px] flex flex-col justify-center">
                                <div className="mb-6">
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Globe className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className={`text-xl font-bold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'} mb-3`}>Ready to Start?</h3>
                                    <p className={`${settings.darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm max-w-2xl mx-auto`}>
                                        Challenge yourself with our {gameState.gameMode} quiz on {gameState.difficulty} difficulty.
                                        Score points, build streaks, and learn amazing facts about countries worldwide!
                                    </p>
                                </div>

                                <button
                                    onClick={startGame}
                                    className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-base hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    Start {gameState.gameMode.charAt(0).toUpperCase() + gameState.gameMode.slice(1)} Quiz
                                </button>
                            </div>
                        ) : (
                            // Game Content - Optimized for No Scroll
                            <div className="p-3 sm:p-6">
                                {gameState.currentCountry && (
                                    <div className="max-w-4xl mx-auto">
                                        {/* Game Header */}
                                        <div className="flex flex-row justify-between items-center mb-4 sm:mb-6">
                                            <div className="flex items-center">
                                                {settings.timerEnabled && (
                                                    <div className={`flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-3 rounded-lg ${gameState.timeLeft <= 5 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                                                        <span className="font-bold text-sm sm:text-base">{gameState.timeLeft}s</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                {settings.hintsEnabled && gameState.hintsAvailable > 0 && !gameState.showResult && (
                                                    <button
                                                        onClick={useHint}
                                                        className="cursor-pointer flex items-center space-x-1 bg-yellow-100 text-yellow-700 px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-yellow-200 transition-all duration-200"
                                                    >
                                                        <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        <span>Hint ({gameState.hintsAvailable})</span>
                                                    </button>
                                                )}

                                                <button
                                                    onClick={resetGame}
                                                    className="cursor-pointer flex items-center space-x-1 bg-gray-100 text-gray-700 px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-200 transition-all duration-200"
                                                >
                                                    <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    <span className="hidden sm:inline">Reset</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Question Section */}
                                        <div className="text-center mb-4 sm:mb-6">
                                            <h3 className={`text-sm sm:text-lg font-semibold ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1 sm:mb-2`}>
                                                {gameState.gameMode === 'flags' ? 'Which flag belongs to:' :
                                                    gameState.gameMode === 'capitals' ? 'What is the capital of:' :
                                                        'Question about:'}
                                            </h3>
                                            <h4 className="text-xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 sm:mb-6">
                                                {gameState?.currentCountry?.name}
                                            </h4>
                                        </div>

                                        {/* Options Grid - Compact Design */}
                                        <div className="mb-4 sm:mb-6">
                                            {gameState.gameMode === 'flags' ? (
                                                // Flag Options - Compact Layout
                                                <div className="grid grid-cols-2 gap-2 sm:gap-4 max-w-lg sm:max-w-2xl mx-auto">
                                                    {gameState.options.map((country, index) => {
                                                        const isCorrectAnswer = country.name === gameState?.currentCountry?.name;
                                                        const isSelectedAnswer = gameState.selectedAnswer && country.name === gameState.selectedAnswer.name;
                                                        const isWrongSelection = gameState.showResult && !gameState.isCorrect && isSelectedAnswer;
                                                        
                                                        return (
                                                            <div
                                                                key={index}
                                                                className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105 ${!gameState.showResult ? 'hover:shadow-lg' : ''}`}
                                                                onClick={() => !gameState.showResult && handleAnswer(country)}
                                                            >
                                                                <div className={`
                                                                    rounded-xl border-2 p-3 sm:p-6 text-center transition-all duration-300
                                                                    ${gameState.showResult
                                                                        ? isCorrectAnswer
                                                                            ? 'border-green-400 bg-green-50 shadow-green-200'
                                                                            : isWrongSelection
                                                                                ? 'border-red-400 bg-red-50 shadow-red-200'
                                                                                : settings.darkMode
                                                                                    ? 'border-gray-600 bg-gray-700/50 opacity-50'
                                                                                    : 'border-gray-300 bg-gray-50 opacity-50'
                                                                        : settings.darkMode
                                                                            ? 'border-gray-600 bg-gray-700/30 hover:border-blue-400 hover:bg-gray-600/50'
                                                                            : 'border-gray-200 bg-white/70 hover:border-blue-400 hover:bg-blue-50/50'
                                                                    } shadow-lg
                                                                `}>
                                                                    <div className="text-3xl sm:text-5xl mb-2">
                                                                        {country.flagEmoji}
                                                                    </div>
                                                                    
                                                                    {/* Result Indicators */}
                                                                    {gameState.showResult && isCorrectAnswer && (
                                                                        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
                                                                            <div className="bg-green-500 text-white p-1 sm:p-2 rounded-full shadow-lg">
                                                                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                                </svg>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {gameState.showResult && isWrongSelection && (
                                                                        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
                                                                            <div className="bg-red-500 text-white p-1 sm:p-2 rounded-full shadow-lg">
                                                                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                                </svg>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                // Capital Options - Compact Layout
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 max-w-2xl sm:max-w-3xl mx-auto">
                                                    {gameState.options.map((country, index) => {
                                                        const isCorrectAnswer = country.name === gameState?.currentCountry?.name;
                                                        const isSelectedAnswer = gameState.selectedAnswer && country.name === gameState.selectedAnswer.name;
                                                        const isWrongSelection = gameState.showResult && !gameState.isCorrect && isSelectedAnswer;
                                                        
                                                        return (
                                                            <div
                                                                key={index}
                                                                className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105 ${!gameState.showResult ? 'hover:shadow-lg' : ''}`}
                                                                onClick={() => !gameState.showResult && handleAnswer(country)}
                                                            >
                                                                <div className={`
                                                                    rounded-lg border-2 p-3 sm:p-4 text-left transition-all duration-300
                                                                    ${gameState.showResult
                                                                        ? isCorrectAnswer
                                                                            ? 'border-green-400 bg-green-50'
                                                                            : isWrongSelection
                                                                                ? 'border-red-400 bg-red-50'
                                                                                : settings.darkMode
                                                                                    ? 'border-gray-600 bg-gray-700/50 opacity-60'
                                                                                    : 'border-gray-300 bg-gray-50 opacity-60'
                                                                        : settings.darkMode
                                                                            ? 'border-gray-600 bg-gray-700/30 hover:border-blue-400 hover:bg-gray-600/50'
                                                                            : 'border-gray-200 bg-white/70 hover:border-blue-400 hover:bg-blue-50/50'
                                                                    } shadow-lg
                                                                `}>
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex-1">
                                                                            <div className={`font-bold text-sm sm:text-lg mb-1 ${
                                                                                gameState.showResult
                                                                                    ? isCorrectAnswer
                                                                                        ? 'text-green-800'
                                                                                        : isWrongSelection
                                                                                            ? 'text-red-800'
                                                                                            : settings.darkMode ? 'text-gray-400' : 'text-gray-600'
                                                                                    : settings.darkMode ? 'text-gray-200' : 'text-gray-800'
                                                                            }`}>
                                                                                {country.capital}
                                                                            </div>
                                                                            {gameState.showResult && (
                                                                                <div className={`text-xs sm:text-sm ${
                                                                                    isCorrectAnswer ? 'text-green-600' : 
                                                                                    isWrongSelection ? 'text-red-600' : 
                                                                                    settings.darkMode ? 'text-gray-400' : 'text-gray-500'
                                                                                }`}>
                                                                                    Capital of {country.name}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        
                                                                        {/* Result Indicators */}
                                                                        {gameState.showResult && isCorrectAnswer && (
                                                                            <div className="ml-2">
                                                                                <div className="bg-green-500 text-white p-1 sm:p-2 rounded-full">
                                                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                                    </svg>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {gameState.showResult && isWrongSelection && (
                                                                            <div className="ml-2">
                                                                                <div className="bg-red-500 text-white p-1 sm:p-2 rounded-full">
                                                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                                    </svg>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {/* Result Section - Compact */}
                                        <div className="min-h-[120px] sm:min-h-[140px] flex flex-col justify-center">
                                            {gameState.showResult ? (
                                                <div className="text-center animate-in fade-in duration-500">
                                                    <div className={`inline-flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-bold mb-3 sm:mb-4 ${gameState.isCorrect
                                                        ? 'bg-green-100 text-green-800 border border-green-300'
                                                        : 'bg-red-100 text-red-800 border border-red-300'
                                                        }`}>
                                                        <span>{gameState.isCorrect ? '🎉 Correct!' : '❌ Incorrect'}</span>
                                                        {gameState.isCorrect && (
                                                            <span className="text-xs sm:text-sm font-normal">
                                                                +{gameState.difficulty === 'hard' ? '3' : gameState.difficulty === 'medium' ? '2' : '1'} pts
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Learn More Section - Compact */}
                                                    {gameState.showLearnMore && (
                                                        <div className={`${settings.darkMode ? 'bg-gray-700/50' : 'bg-blue-50'} rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 animate-in slide-in-from-bottom duration-500`}>
                                                            <div className="flex items-center justify-center mb-2 sm:mb-3">
                                                                <div className="text-lg sm:text-xl mr-2">{gameState.currentCountry.flagEmoji}</div>
                                                                <h4 className={`text-sm sm:text-base font-bold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                                                    {gameState?.currentCountry?.name}
                                                                </h4>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2 sm:gap-3 text-left text-xs sm:text-sm">
                                                                <div>
                                                                    <p className={`font-semibold ${settings.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Capital:</p>
                                                                    <p className={`${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{gameState.currentCountry.capital}</p>
                                                                </div>
                                                                <div>
                                                                    <p className={`font-semibold ${settings.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Population:</p>
                                                                    <p className={`${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{gameState.currentCountry.population}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Action Buttons - Consistent Sizing */}
                                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center">
                                                        <button
                                                            onClick={() => setGameState(prev => ({ ...prev, showLearnMore: !prev.showLearnMore }))}
                                                            className="cursor-pointer flex items-center space-x-1 sm:space-x-2 bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-200 transition-all duration-200 w-full sm:w-auto justify-center"
                                                        >
                                                            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                                                            <span>{gameState.showLearnMore ? 'Hide' : 'Learn'}</span>
                                                        </button>

                                                        <button
                                                            onClick={shareResults}
                                                            className="cursor-pointer flex items-center space-x-1 sm:space-x-2 bg-green-100 text-green-700 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-200 transition-all duration-200 w-full sm:w-auto justify-center"
                                                        >
                                                            <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                                            <span>Share</span>
                                                        </button>

                                                        <button
                                                            onClick={nextQuestion}
                                                            className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 w-full sm:w-auto flex items-center justify-center space-x-1 sm:space-x-2"
                                                        >
                                                            <span className="sm:hidden">Next →</span>
                                                            <span className="hidden sm:inline">Next Question →</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                // Empty state
                                                <div className="flex items-center justify-center">
                                                    <p className={`text-xs ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'} opacity-60`}>
                                                        Select an answer to continue
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section ref={aboutRef} id="about" className={`py-20 ${settings.darkMode ? 'bg-gray-800/30' : 'bg-gray-50/50'}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className={`text-3xl sm:text-4xl font-bold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>
                            About GeoQuiz Pro
                        </h2>
                        <p className={`text-lg ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
                            Making geography learning fun, interactive, and accessible for everyone
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className={`text-2xl font-bold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'} mb-6`}>
                                Our Mission
                            </h3>
                            <p className={`${settings.darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6 leading-relaxed`}>
                                We believe that learning about our world should be engaging, interactive, and fun.
                                GeoQuiz Pro combines the excitement of gaming with educational content to help you
                                master world geography one question at a time.
                            </p>
                            <p className={`${settings.darkMode ? 'text-gray-300' : 'text-gray-600'} mb-8 leading-relaxed`}>
                                Whether you're a student preparing for exams, a teacher looking for interactive
                                content, or simply someone curious about the world, our platform offers multiple
                                game modes and difficulty levels to suit your needs.
                            </p>

                            <div className="space-y-4">
                                {[
                                    { number: '20+', label: 'Countries covered with detailed information' },
                                    { number: '3', label: 'Different game modes for varied learning' },
                                    { number: '100%', label: 'Free to play with no hidden costs' }
                                ].map(({ number, label }, index) => (
                                    <div key={index} className="flex items-center space-x-4 flex-col md:flex-row">
                                        <div className="text-2xl font-bold text-blue-600">{number}</div>
                                        <div className={`${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { title: 'Interactive Learning', desc: 'Hands-on quiz experience', icon: '🎮' },
                                { title: 'Real Data', desc: 'Accurate country information', icon: '📊' },
                                { title: 'Progress Tracking', desc: 'Monitor your improvement', icon: '📈' },
                                { title: 'Mobile Friendly', desc: 'Play anywhere, anytime', icon: '📱' }
                            ].map(({ title, desc, icon }, index) => (
                                <div key={index} className={`${settings.darkMode ? 'bg-gray-800/70' : 'bg-white/70'} backdrop-blur-sm rounded-xl p-6 border ${settings.darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg hover:shadow-xl transition-all duration-300 text-center`}>
                                    <div className="text-3xl mb-3">{icon}</div>
                                    <h4 className={`font-bold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>{title}</h4>
                                    <p className={`text-sm ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section ref={contactRef} id="contact" className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className={`text-3xl sm:text-4xl font-bold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>
                        Get In Touch
                    </h2>
                    <p className={`text-lg ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'} mb-12 max-w-2xl mx-auto`}>
                        Have questions, suggestions, or just want to say hello? We'd love to hear from you!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {[
                            { icon: Mail, title: 'Email Us', desc: 'contact@geoquizpro.com', action: 'mailto:contact@geoquizpro.com' },
                            { icon: Phone, title: 'Call Us', desc: '+1 (555) 123-4567', action: 'tel:+15551234567' },
                            { icon: Globe, title: 'Follow Us', desc: '@geoquizpro', action: '#' }
                        ].map(({ icon: Icon, title, desc, action }, index) => (
                            <a
                                key={index}
                                href={action}
                                className={`cursor-pointer ${settings.darkMode ? 'bg-gray-800/70 hover:bg-gray-700/70' : 'bg-white/70 hover:bg-white/90'} backdrop-blur-sm rounded-xl p-6 border ${settings.darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 block`}
                            >
                                <Icon className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                                <h3 className={`font-bold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>{title}</h3>
                                <p className={`${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{desc}</p>
                            </a>
                        ))}
                    </div>

                    <button
                        onClick={() => scrollToSection('game')}
                        className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Start Playing Now
                    </button>
                </div>
            </section>

            {/* Settings Modal */}
            {showSettings && (
                <div
                    className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={(e) => handleModalBackdropClick(e, () => setShowSettings(false))}
                >
                    <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in duration-300`}>
                        <div className={`p-6 border-b ${settings.darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-center justify-between">
                                <h3 className={`text-xl font-bold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Settings</h3>
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className={`cursor-pointer ${settings.darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            {[
                                { key: 'soundEnabled', label: 'Sound Effects', icon: settings.soundEnabled ? Volume2 : VolumeX },
                                { key: 'timerEnabled', label: 'Timer', icon: Clock },
                                { key: 'hintsEnabled', label: 'Hints', icon: Zap }
                            ].map(({ key, label, icon: Icon }) => (
                                <div key={key} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Icon className={`h-5 w-5 ${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                                        <span className={`font-medium ${settings.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{label}</span>
                                    </div>
                                    <button
                                        onClick={() => setSettings(prev => ({ ...prev, [key]: !prev[key as keyof Settings] }))}
                                        className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${settings[key as keyof Settings] ? 'bg-blue-600' : settings.darkMode ? 'bg-gray-600' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${settings[key as keyof Settings] ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                            ))}

                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        setShowAchievements(true);
                                        setShowSettings(false);
                                    }}
                                    className="cursor-pointer w-full flex items-center space-x-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                                >
                                    <Trophy className="h-5 w-5 text-blue-600" />
                                    <span className="font-medium text-blue-800">View Achievements</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Achievements Modal */}
            {showAchievements && (
                <div
                    className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={(e) => handleModalBackdropClick(e, () => setShowAchievements(false))}
                >
                    <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-2xl animate-in zoom-in duration-300 max-h-[80vh] overflow-y-auto`}>
                        <div className={`p-6 border-b ${settings.darkMode ? 'border-gray-700' : 'border-gray-200'} sticky top-0 ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className="flex items-center justify-between">
                                <h3 className={`text-xl font-bold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Achievements</h3>
                                <button
                                    onClick={() => setShowAchievements(false)}
                                    className={`cursor-pointer ${settings.darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            {achievements.map((achievement) => (
                                <div
                                    key={achievement.id}
                                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${achievement.unlocked
                                        ? 'border-green-500 bg-green-50'
                                        : settings.darkMode
                                            ? 'border-gray-600 bg-gray-700'
                                            : 'border-gray-300 bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="text-3xl">{achievement.icon}</div>
                                        <div className="flex-1">
                                            <h4 className={`font-bold ${achievement.unlocked
                                                ? 'text-green-800'
                                                : settings.darkMode
                                                    ? 'text-gray-200'
                                                    : 'text-gray-800'
                                                }`}>
                                                {achievement.title}
                                                {achievement.unlocked && <span className="ml-2 text-green-600">✓</span>}
                                            </h4>
                                            <p className={`text-sm ${achievement.unlocked
                                                ? 'text-green-600'
                                                : settings.darkMode
                                                    ? 'text-gray-400'
                                                    : 'text-gray-600'
                                                }`}>
                                                {achievement.description}
                                            </p>
                                            {!achievement.unlocked && (
                                                <div className="mt-2">
                                                    <div className={`w-full bg-gray-200 rounded-full h-2 ${settings.darkMode ? 'bg-gray-600' : ''}`}>
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${Math.min((achievement.progress / achievement.requirement) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                    <p className={`text-xs mt-1 ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {achievement.progress} / {achievement.requirement}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Country Details Modal */}
            {showCountryModal && selectedCountryDetails && (
                <div
                    className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={(e) => handleModalBackdropClick(e, () => setShowCountryModal(false))}
                >
                    <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-lg animate-in zoom-in duration-300`}>
                        <div className={`p-6 border-b ${settings.darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="font-medium">{selectedCountryDetails.flagEmoji}</div>
                                    <h3 className={`text-xl font-bold ${settings.darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                        {selectedCountryDetails.name}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setShowCountryModal(false)}
                                    className={`cursor-pointer ${settings.darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors duration-200`}
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { label: 'Capital', value: selectedCountryDetails.capital },
                                    { label: 'Population', value: selectedCountryDetails.population },
                                    { label: 'Continent', value: selectedCountryDetails.continent },
                                    { label: 'Currency', value: selectedCountryDetails.currency },
                                    { label: 'Language', value: selectedCountryDetails.language }
                                ].map(({ label, value }) => (
                                    <div key={label}>
                                        <p className={`font-semibold ${settings.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}:</p>
                                        <p className={`${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{value}</p>
                                    </div>
                                ))}
                                <div>
                                    <p className={`font-semibold ${settings.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Fun Fact:</p>
                                    <p className={`${settings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedCountryDetails.funFact}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className={`${settings.darkMode ? 'bg-gray-900 text-white' : 'bg-gray-900 text-white'} py-8 sm:py-12`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                                    <Globe className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xl font-bold">GeoQuiz Pro</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Master world geography through interactive quizzes and discover fascinating facts about countries worldwide.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Quick Links</h4>
                            <div className="space-y-2">
                                <button onClick={() => scrollToSection('home')} className="cursor-pointer text-gray-400 hover:text-white transition-colors duration-200 block text-sm text-left">Home</button>
                                <button onClick={() => scrollToSection('features')} className="cursor-pointer text-gray-400 hover:text-white transition-colors duration-200 block text-sm text-left">Features</button>
                                <button onClick={() => scrollToSection('game')} className="cursor-pointer text-gray-400 hover:text-white transition-colors duration-200 block text-sm text-left">Play Game</button>
                                <button onClick={() => scrollToSection('about')} className="cursor-pointer text-gray-400 hover:text-white transition-colors duration-200 block text-sm text-left">About</button>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Game Features</h4>
                            <div className="space-y-2">
                                <p className="text-gray-400 text-sm">Flag & Capital Quiz</p>
                                <p className="text-gray-400 text-sm">Achievement System</p>
                                <p className="text-gray-400 text-sm">Multiple Difficulties</p>
                                <p className="text-gray-400 text-sm">Real-time Scoring</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Contact Info</h4>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-400 text-sm">contact@geoquizpro.com</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-6 sm:pt-8 mt-6 sm:mt-8 text-center">
                        <p className="text-gray-400 text-sm">
                            © 2025 GeoQuiz Pro. All rights reserved. Built with React & TypeScript.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default GeoQuizPro;

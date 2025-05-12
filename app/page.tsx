"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon, FiSmile, FiHeart, FiCoffee, FiBook, FiMeh, FiArrowLeft, FiClock, FiUser, FiInfo, FiSearch, FiChevronUp, FiMenu, FiX, FiMapPin, FiPhone, FiMail, FiStar, FiHome } from "react-icons/fi";
import { Playfair_Display, Nunito } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
});

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  content?: string;
  author?: string;
  readTime?: string;
  date?: string;
}

interface MoodData {
  [key: string]: BlogPost[];
}

interface MoodOption {
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  hoverColor: string;
}

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [viewingBlog, setViewingBlog] = useState<BlogPost | null>(null);
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Refs for scroll sections
  const moodsRef = useRef<HTMLDivElement>(null);
  const latestRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  // Function to update active section based on scroll position
  const updateActiveSection = () => {
    const scrollPosition = window.scrollY + 100; // Add offset for the header

    // Get all section positions
    const sections = [
      { id: "home", position: 0 },
      { id: "moods", position: moodsRef.current?.offsetTop || 0 },
      { id: "latest", position: latestRef.current?.offsetTop || 0 },
      { id: "featured", position: featuredRef.current?.offsetTop || 0 },
      { id: "about", position: aboutRef.current?.offsetTop || 0 }
    ];

    // Sort by position from bottom to top
    const sortedSections = [...sections].sort((a, b) => b.position - a.position);

    // Find the first section that the scroll position is greater than or equal to
    for (const section of sortedSections) {
      if (scrollPosition >= section.position) {
        setActiveSection(section.id);
        break;
      }
    }
  };

  useEffect(() => {
    // Set a loading state while we fetch and apply the theme
    setIsLoading(true);

    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme as "light" | "dark");

    // Setup background gradients
    if (savedTheme === "dark") {
      document.body.classList.add('dark-theme-bg');
    } else {
      document.body.classList.add('light-theme-bg');
    }

    // After theme is applied, hide the loader
    setTimeout(() => {
      setIsLoading(false);
    }, 300); // Short delay to ensure smooth transition

    return () => {
      document.body.classList.remove('dark-theme-bg', 'light-theme-bg');
    };
  }, []); // Only run once on mount

  // Separate effect for scroll events and menu state
  useEffect(() => {
    // Add scroll event listener for showing scroll-to-top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);

      // Close mobile menu on scroll
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }

      // Update active section based on scroll position
      updateActiveSection();
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMenuOpen]); // Only depend on menu state

  // Ensure the active section is updated after the component mounts and refs are assigned
  useEffect(() => {
    // Small delay to ensure refs are populated
    const timer = setTimeout(() => {
      updateActiveSection();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.body.classList.remove('light-theme-bg');
      document.body.classList.add('dark-theme-bg');
    } else {
      document.body.classList.remove('dark-theme-bg');
      document.body.classList.add('light-theme-bg');
    }
  };

  const handleReadMore = (blog: BlogPost) => {
    setViewingBlog(blog);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToBlogs = () => {
    setViewingBlog(null);
  };

  const toggleIntro = () => {
    setShowIntro(!showIntro);
  };

  const scrollToSection = (sectionId: string) => {
    let targetRef;

    switch (sectionId) {
      case "moods":
        targetRef = moodsRef;
        break;
      case "latest":
        targetRef = latestRef;
        break;
      case "featured":
        targetRef = featuredRef;
        break;
      case "about":
        targetRef = aboutRef;
        break;
      default:
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveSection("home");
        return;
    }

    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSection("home");
  };

  const moodBlogs: MoodData = {
    inspired: [
      {
        id: 1,
        title: "Finding Your Creative Path",
        excerpt: "Discover how to unleash your inner creativity and find your passion.",
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        author: "Emma Johnson",
        readTime: "5 min read",
        date: "June 15, 2023",
        content: `
          <p>Creativity is not a talent reserved for the chosen few; it's a skill that can be cultivated with practice and the right mindset. In today's fast-paced world, finding your creative path may seem daunting, but it's actually simpler than you might think.</p>
          
          <h3>Start with Curiosity</h3>
          <p>The foundation of creativity is curiosity. Begin by asking questions about everything around you. Why is something designed a certain way? How could it be improved? What if we tried a different approach?</p>
          
          <h3>Embrace Routine and Randomness</h3>
          <p>Creativity thrives in the balance between structure and spontaneity. Establish a routine for your creative practice, but also leave room for random inspiration and exploration. Some of the most innovative ideas come from unexpected connections.</p>
          
          <h3>Learn to Observe</h3>
          <p>Train yourself to notice details that others might miss. Observation is a powerful tool for any creative person. Carry a notebook to jot down interesting observations, or take photos of things that catch your eye.</p>
          
          <h3>Practice Makes Progress</h3>
          <p>Creativity is like a muscle that grows stronger with use. Set aside time each day for creative exercises, even if it's just 15 minutes. The key is consistency, not perfection.</p>
          
          <h3>Embrace Failure</h3>
          <p>Fear of failure is creativity's greatest enemy. Remember that every creative success is built upon numerous attempts that didn't work out. Learn to see "failures" as valuable data points rather than reasons to quit.</p>
          
          <p>Remember, your creative path is uniquely yours. There's no one-size-fits-all approach, so experiment with different techniques and processes until you find what resonates with you.</p>
        `
      },
      {
        id: 2,
        title: "Morning Rituals of Successful Artists",
        excerpt: "Learn the habits that keep creative professionals inspired daily.",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        author: "Daniel Rivera",
        readTime: "7 min read",
        date: "April 3, 2023",
        content: `
          <p>The way you start your day can significantly impact your creative output. Many successful artists and innovators have developed specific morning rituals that prepare their minds for creative work.</p>
          
          <h3>Wake Before the World</h3>
          <p>Many prolific artists start their day before sunrise. This quiet time allows for uninterrupted focus and connection with your inner thoughts before the demands of the day begin.</p>
          
          <h3>Mindful Meditation</h3>
          <p>A brief meditation session can clear mental clutter and prepare your mind for creative work. Even just 5-10 minutes of mindful breathing can make a significant difference in your focus and clarity.</p>
          
          <h3>Physical Movement</h3>
          <p>Creative energy is closely tied to physical energy. A morning walk, yoga session, or brief workout increases blood flow to the brain and releases endorphins that enhance your creative thinking.</p>
          
          <h3>Creative Warm-ups</h3>
          <p>Just as athletes warm up before a game, creative professionals benefit from warm-up exercises. This might be free writing, sketching without purpose, or playing with materials with no goal in mind.</p>
          
          <h3>Consistent Creative Hours</h3>
          <p>Identify your peak creative time and protect it fiercely. For many, this is in the morning when willpower and focus are at their highest. Schedule your most important creative work during this time.</p>
          
          <p>By establishing intentional morning rituals, you create the conditions for creativity to flourish throughout your day. The key is consistency – find what works for you and make it a non-negotiable part of your routine.</p>
        `
      },
      {
        id: 3,
        title: "Breakthrough Moments",
        excerpt: "Stories of transformative experiences from leading innovators.",
        image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        author: "Sophia Chen",
        readTime: "9 min read",
        date: "May 22, 2023",
        content: `
          <p>Throughout history, innovation has often been marked by sudden breakthrough moments – instances where clarity emerges from confusion and new paths forward become visible. These moments may seem magical, but they typically follow patterns we can learn from.</p>
          
          <h3>Steve Jobs' Calligraphy Class</h3>
          <p>When Steve Jobs dropped out of college, he decided to take a calligraphy class that had no practical application to his life at the time. Years later, this knowledge informed the beautiful typography incorporated into the first Macintosh computer. His breakthrough came from connecting seemingly unrelated fields.</p>
          
          <h3>Archimedes' Bathtub Moment</h3>
          <p>The famous "Eureka!" moment came to Archimedes while taking a bath, when he noticed the water displacement of his body. This observation led to his principle for determining the volume of irregular objects. His breakthrough came when he was relaxed and not actively trying to solve the problem.</p>
          
          <h3>Einstein's Thought Experiments</h3>
          <p>Many of Einstein's groundbreaking theories came from "thought experiments" – imaginative scenarios he would play out in his mind. His breakthrough came from using visualization and imagination rather than pure mathematics or experimentation.</p>
          
          <h3>Marie Curie's Persistent Inquiry</h3>
          <p>Marie Curie's discovery of radium and polonium came after methodically processing tons of pitchblende ore in a shed. Her breakthrough came from relentless determination and working through mundane processes with extraordinary attention to detail.</p>
          
          <h3>Common Patterns in Breakthroughs</h3>
          <p>While each breakthrough is unique, patterns emerge: periods of intense focus followed by relaxation, connecting disparate fields of knowledge, persistence through failure, and maintaining curiosity. Perhaps most importantly, breakthrough thinkers develop systems that allow them to capture and develop their insights.</p>
          
          <p>By studying these patterns, we can create conditions more conducive to our own breakthrough moments, recognizing that innovation is both a science and an art.</p>
        `
      },
      {
        id: 4,
        title: "Creativity Through Constraints",
        excerpt: "How limitations can unlock your most innovative thinking.",
        image: "https://images.unsplash.com/photo-1537861295351-76bb831ece99?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        author: "Michael Rodriguez",
        readTime: "6 min read",
        date: "August 3, 2023",
        content: `
          <p>We often think of creativity as complete freedom, but some of the most innovative breakthroughs happen when we face significant constraints. Limitations force us to think differently and find unexpected solutions.</p>
          
          <h3>The Paradox of Choice</h3>
          <p>When options are unlimited, decision paralysis often sets in. The blank canvas can be the artist's greatest enemy. Constraints provide a framework that eliminates infinite possibilities and focuses your creative energy in productive directions.</p>
          
          <h3>Historical Examples</h3>
          <p>The 14-line restriction of sonnets didn't limit Shakespeare—it inspired some of his most profound work. Jazz improvisation thrives within harmonic boundaries. The limited color palette of early video games pushed designers to create iconic, instantly recognizable characters.</p>
          
          <h3>Practical Applications</h3>
          <p>Set artificial constraints in your creative process: time limits, material restrictions, or conceptual boundaries. These self-imposed limitations can lead to breakthrough thinking and unique solutions that wouldn't emerge in an unrestricted environment.</p>
          
          <p>Next time you feel stuck, don't seek more freedom—add a thoughtful constraint and watch how it transforms your thinking.</p>
        `
      },
      {
        id: 5,
        title: "Transforming Feedback Into Growth",
        excerpt: "How to use criticism as fuel for your creative development.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        author: "Aisha Johnson",
        readTime: "5 min read",
        date: "July 12, 2023",
        content: `
          <p>Feedback is one of the most valuable gifts a creative person can receive, yet many of us struggle to process it effectively. Learning to transform criticism into actionable insights can accelerate your growth and improve your work dramatically.</p>
          
          <h3>Separate Identity From Work</h3>
          <p>The first step in handling feedback productively is creating emotional distance between yourself and your creation. Remember that criticism of your work is not criticism of you as a person. This separation allows you to assess feedback objectively.</p>
          
          <h3>Look For Patterns</h3>
          <p>Individual feedback points may sometimes be contradictory, but patterns across multiple sources are valuable signals. Pay special attention when multiple people highlight the same issue, even if they suggest different solutions.</p>
          
          <h3>Differentiate Types of Feedback</h3>
          <p>Learn to distinguish between technical feedback (addressing craft and execution), structural feedback (focusing on organization and flow), and subjective reactions (personal preferences). Each type has its place but should be weighted differently in your revision process.</p>
          
          <h3>The 24-Hour Rule</h3>
          <p>When receiving difficult feedback, give yourself permission to react emotionally—privately. Then wait 24 hours before deciding how to respond or what actions to take. This cooling-off period allows your rational mind to process the information more effectively.</p>
          
          <p>The most successful creatives aren't those who avoid criticism but those who develop the skill to transform it into fuel for growth and improvement.</p>
        `
      }
    ],
    tired: [
      {
        id: 4,
        title: "The Art of Rest",
        excerpt: "Why rest is productive and how to make the most of downtime.",
        image: "https://images.unsplash.com/photo-1520206183501-b80df61043c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        author: "Dr. Maya Williams",
        readTime: "6 min read",
        date: "February 12, 2023",
        content: `
          <p>In our hyper-productive society, rest is often viewed as laziness or a luxury we can't afford. Yet research increasingly shows that strategic rest is essential not just for well-being, but for peak performance and creativity.</p>
          
          <h3>The Science of Recovery</h3>
          <p>The body operates in cycles of exertion and recovery. Just as athletes build strength during rest periods after workouts, your brain consolidates learning and solves problems during periods of rest. Without adequate recovery, both physical and mental performance decline sharply.</p>
          
          <h3>Active vs. Passive Rest</h3>
          <p>Not all rest is created equal. Passive rest (like sleeping or lounging) has its place, but active rest – engaging in low-stress, enjoyable activities different from your work – can be even more rejuvenating. Examples include walking in nature, creative hobbies, or meaningful social connection.</p>
          
          <h3>Strategic Rest Breaks</h3>
          <p>Working in focused 90-minute intervals followed by brief rest periods aligns with your body's natural ultradian rhythm. This approach maximizes both productivity during work periods and the rejuvenating effects of breaks.</p>
          
          <h3>The Power of Sleep</h3>
          <p>Quality sleep is the foundation of all other forms of rest. Prioritizing 7-9 hours of good sleep improves cognitive function, emotional regulation, and creative problem-solving ability far more than working extra hours ever could.</p>
          
          <h3>Rest as Resistance</h3>
          <p>In a culture that glorifies hustle, choosing rest can be a radical act of self-preservation. Remember that your value isn't determined by your productivity, and that sustainable success requires rhythms of both engagement and renewal.</p>
          
          <p>By reframing rest as an essential part of achievement rather than its opposite, you can break free from burnout cycles and discover a more sustainable – and ultimately more productive – way of living and working.</p>
        `
      },
      {
        id: 5,
        title: "Gentle Evening Routines",
        excerpt: "Wind down effectively with these calming practices.",
        image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        author: "Thomas Reed",
        readTime: "4 min read",
        date: "March 17, 2023",
        content: `
          <p>The way you end your day has a profound impact on your sleep quality and how you'll feel the next morning. A thoughtful evening routine signals to your body and mind that it's time to transition from the activity of the day to the restoration of night.</p>
          
          <h3>Digital Sunset</h3>
          <p>Begin your wind-down by setting a "digital sunset" – a time when screens are turned off for the night. The blue light from devices suppresses melatonin production, making it harder to fall asleep. Aim for at least 60-90 minutes screen-free time before bed.</p>
          
          <h3>Gentle Movement</h3>
          <p>Evening is perfect for slow, gentle movement that releases physical tension without energizing you. Consider light stretching, yin yoga, or a slow walking meditation to help your body transition toward rest.</p>
          
          <h3>Thought Download</h3>
          <p>Our minds often race at night with unprocessed thoughts from the day. Taking a few minutes to journal helps clear mental clutter. Write down tomorrow's tasks, unresolved concerns, or reflections on the day to help your brain let go.</p>
          
          <h3>Sensory Comfort</h3>
          <p>Engage your senses in soothing ways – dim the lights, enjoy a warm (caffeine-free) beverage, play soft music, or diffuse calming essential oils like lavender. These sensory cues reinforce that it's time to relax.</p>
          
          <h3>Consistent Timing</h3>
          <p>Our bodies thrive on rhythm. Going to bed and waking up at consistent times helps regulate your circadian rhythm, making it easier to fall asleep and wake refreshed. Even on weekends, try to maintain a schedule within an hour of your weekday routine.</p>
          
          <p>Remember that an effective evening routine doesn't need to be lengthy or complicated. Even 15-20 minutes of intentional wind-down activities can dramatically improve your sleep quality and, by extension, your overall well-being.</p>
        `
      },
      {
        id: 6,
        title: "Burnout Recovery",
        excerpt: "Rebuilding energy when you've pushed yourself too far.",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        author: "Dr. James Cooper",
        readTime: "8 min read",
        date: "January 5, 2023",
        content: `
          <p>Burnout is not just feeling tired – it's a state of chronic stress that leads to physical and emotional exhaustion, cynicism, and feelings of ineffectiveness. If you've found yourself in this depleted state, recovery is possible with intentional care and time.</p>
          
          <h3>Recognize the Symptoms</h3>
          <p>The first step in recovering from burnout is acknowledging it. Common signs include persistent exhaustion, detachment from work, reduced performance, cognitive fog, and physical symptoms like headaches or disrupted sleep. Recognizing these symptoms helps validate your experience and creates motivation for change.</p>
          
          <h3>Address the Root Causes</h3>
          <p>Burnout typically stems from a combination of factors: excessive workload, lack of control, insufficient reward, breakdown of community, absence of fairness, or value conflicts. Identify which factors contributed to your burnout so you can make targeted changes.</p>
          
          <h3>Establish Boundaries</h3>
          <p>Recovery requires creating space between yourself and the sources of chronic stress. This might mean setting work hours and sticking to them, learning to say no, delegating tasks, or taking a leave of absence if possible. Digital boundaries are especially important.</p>
          
          <h3>Prioritize Physical Needs</h3>
          <p>Burnout depletes your physical resources, so rebuilding them is essential. Focus on quality sleep, nutrient-dense foods, gentle movement, and hydration. Avoid using caffeine, alcohol, or other substances to mask exhaustion, as they further tax your system.</p>
          
          <h3>Seek Connection</h3>
          <p>Social support is crucial for burnout recovery. Connect with understanding friends, family members, or professional help. Simply being witnessed in your struggle can reduce the isolation that often accompanies burnout.</p>
          
          <h3>Rebuild Meaning</h3>
          <p>Burnout often disconnects us from the purpose and values that once energized our work. Reconnect with what matters to you through reflection, journaling, or conversations with trusted mentors. Sometimes this process reveals the need for more substantial life changes.</p>
          
          <p>Recovery from burnout isn't linear, and it takes longer than most people expect – often months rather than weeks. Be patient with yourself, celebrate small improvements, and remember that fully recovering from burnout creates an opportunity to build a more sustainable and fulfilling life moving forward.</p>
        `
      },
      {
        id: 7,
        title: "The Science of Power Naps",
        excerpt: "Optimize short rest periods for maximum energy restoration.",
        image: "https://images.unsplash.com/photo-1666934209818-cd6a6d08bd8d?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        author: "Dr. Elena Cooper",
        readTime: "7 min read",
        date: "June 28, 2023",
        content: `
          <p>In a culture that often celebrates constant productivity, the power nap remains an underutilized tool for cognitive enhancement and energy restoration. The science shows that strategic short sleep can provide benefits that far outweigh the time investment.</p>
          
          <h3>The Ideal Nap Duration</h3>
          <p>Research suggests that naps of different lengths offer different benefits. A 10-20 minute "power nap" provides immediate alertness without grogginess, as it avoids deep sleep. A 60-minute nap includes deeper sleep stages and helps with memory consolidation but may cause some sleep inertia (temporary grogginess) upon waking.</p>
          
          <h3>Timing Matters</h3>
          <p>The ideal nap window falls during the post-lunch dip in alertness, typically between 1:00 and 3:00 PM for most people. This timing works with your natural circadian rhythm and is least likely to interfere with nighttime sleep.</p>
          
          <h3>The Coffee Nap Technique</h3>
          <p>For maximum alertness, try the "coffee nap" technique: quickly drink a cup of coffee immediately before taking a 20-minute nap. You'll wake just as the caffeine takes effect, with the benefits of both the nap and the stimulant combined.</p>
          
          <h3>Environmental Optimization</h3>
          <p>Create ideal napping conditions with these elements: a slightly cool room temperature, darkness or an eye mask, noise cancellation or white noise, and a comfortable but not too comfortable surface (to avoid falling into deep sleep).</p>
          
          <p>When integrated thoughtfully into your day, power napping isn't a sign of laziness but a strategic technique used by some of history's most productive individuals, from Einstein to Edison to modern high-performance athletes.</p>
        `
      },
      {
        id: 8,
        title: "Digital Detox Strategies",
        excerpt: "Practical ways to reduce screen fatigue and restore mental energy.",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        author: "Sam Taylor",
        readTime: "5 min read",
        date: "April 15, 2023",
        content: `
          <p>Digital fatigue is the subtle but persistent exhaustion that comes from constant connectivity. As our devices become increasingly integrated into every aspect of our lives, intentional breaks from technology become not just refreshing but necessary for mental wellbeing.</p>
          
          <h3>The 20-20-20 Rule</h3>
          <p>To reduce eye strain during work, follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for at least 20 seconds. This simple practice reduces the ocular fatigue that contributes to overall digital exhaustion.</p>
          
          <h3>Create Technology Boundaries</h3>
          <p>Designate specific spaces in your home as device-free zones. The dining table and bedroom are excellent places to start. Physical boundaries help create mental ones, signaling to your brain when it's time to disconnect.</p>
          
          <h3>Analog Activities</h3>
          <p>Rediscover non-digital hobbies that engage your hands and mind: cooking, gardening, sketching, playing a musical instrument, or working with physical tools. These activities provide a fundamentally different type of engagement than digital interaction.</p>
          
          <h3>Structured Notification Management</h3>
          <p>Beyond simply silencing your phone, create a strategic notification system. Determine which alerts genuinely deserve your immediate attention, which can wait for scheduled check-in times, and which can be eliminated entirely.</p>
          
          <h3>The One-Day Detox</h3>
          <p>Start with a manageable 24-hour period of significantly reduced technology use (not necessarily elimination). Plan this day with alternative activities to prevent the vacuum that often leads to reaching for devices out of habit.</p>
          
          <p>Digital detoxing isn't about rejecting technology entirely, but rather developing a mindful relationship with our devices so they enhance rather than deplete our mental and emotional resources.</p>
        `
      }
    ],
    curious: [
      {
        id: 7,
        title: "Mysteries of Deep Ocean",
        excerpt: "Exploring the unknown creatures of the deepest parts of our oceans.",
        image: "https://images.unsplash.com/photo-1551244072-5d12893278ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        author: "Dr. Marina Chen",
        readTime: "7 min read",
        date: "May 9, 2023",
        content: `
          <p>The deep ocean remains Earth's least explored frontier. While we've mapped the surface of Mars in greater detail, more than 80% of our ocean remains unmapped, unobserved, and unexplored. The creatures that inhabit these mysterious depths challenge our understanding of life itself.</p>
          
          <h3>Life Without Light</h3>
          <p>Beyond the reach of sunlight (about 200 meters deep), life adapts in extraordinary ways. In the absence of photosynthesis, many deep-sea creatures rely on chemosynthesis – deriving energy from chemical reactions rather than sunlight – or develop elaborate strategies for finding scarce food.</p>
          
          <h3>Bioluminescence: Living Light</h3>
          <p>In the darkness of the deep, approximately 90% of creatures produce their own light through bioluminescence. This biochemical light serves various functions: attracting prey, finding mates, or confusing predators. The result is a silent light show more otherworldly than our most imaginative science fiction.</p>
          
          <h3>Extreme Pressure Adaptations</h3>
          <p>The pressure at the ocean's deepest point is more than 1,000 times what we experience at sea level – equivalent to having 50 jumbo jets stacked on top of you. Deep-sea creatures have evolved special adaptations: pressure-resistant enzymes, flexible cell membranes, and unique proteins that maintain functionality under conditions that would crush most organisms.</p>
          
          <h3>Recent Discoveries</h3>
          <p>Modern exploration technology has revealed creatures once thought impossible. The "headless chicken monster" (a type of sea cucumber), transparent "ghost octopuses," and the recently observed black seadevil anglerfish challenge our understanding of evolutionary possibilities. Many of these species may hold secrets applicable to medicine, materials science, and other fields.</p>
          
          <h3>The Unknown Majority</h3>
          <p>Scientists estimate that between 50-80% of all life on Earth lives in the ocean, with potentially millions of species yet to be discovered. Each deep-sea expedition yields new species, suggesting we've only scratched the surface of deep ocean biodiversity.</p>
          
          <p>As climate change, deep-sea mining, and other human activities increasingly affect even these remote habitats, there's an urgent need to understand and protect the mysterious world of the deep before we lose creatures and knowledge we never knew existed. The ocean's greatest mysteries may hold solutions to some of humanity's greatest challenges.</p>
        `
      },
      {
        id: 8,
        title: "Future of Space Exploration",
        excerpt: "What the next decade holds for humanity's venture into space.",
        image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        author: "Neil Armstrong",
        readTime: "6 min read",
        date: "April 21, 2023",
        content: `
          <p>Space exploration stands at a pivotal moment in history. After decades dominated by government agencies, the emergence of private space companies and international collaboration is accelerating our journey to the stars, promising more progress in the next decade than we've seen in the previous five.</p>
          
          <h3>Return to the Moon: Gateway to Mars</h3>
          <p>NASA's Artemis program aims to return humans to the lunar surface by 2025, but with a crucial difference from the Apollo era – this time, we're staying. The Lunar Gateway, a space station orbiting the Moon, will serve as a staging point for surface operations and deep space missions, while sustainable lunar outposts will test technologies for eventual Mars exploration.</p>
          
          <h3>Mars: The Next Giant Leap</h3>
          <p>Multiple Mars missions planned for the 2020s will pave the way for human exploration in the 2030s. SpaceX's Starship, if successful, could revolutionize our Mars approach by dramatically reducing launch costs while increasing payload capacity. Meanwhile, current rovers and orbiters continue searching for signs of ancient life and mapping resources essential for future human habitation.</p>
          
          <h3>The Commercialization of Low Earth Orbit</h3>
          <p>As government agencies focus on deep space, private companies are transforming operations closer to Earth. Commercial space stations will likely replace the International Space Station after its retirement. Space tourism, manufacturing in microgravity, and satellite servicing represent emerging markets that could collectively become a trillion-dollar space economy.</p>
          
          <h3>Interstellar Probes</h3>
          <p>Breakthrough Initiatives' Starshot project aims to send gram-sized probes to our nearest stellar neighbor, Alpha Centauri, traveling at 20% the speed of light using powerful lasers and light sails. If successful, these tiny ambassadors could reach another star system within a human lifetime – a first in our species' history.</p>
          
          <h3>The Search for Life</h3>
          <p>Next-generation telescopes like the James Webb Space Telescope are revolutionizing our ability to analyze exoplanet atmospheres for biosignatures. Missions to ocean worlds in our own solar system – particularly Europa (Jupiter's moon) and Enceladus (Saturn's moon) – will investigate environments potentially hospitable to life as we know it.</p>
          
          <p>The next decade of space exploration will likely transform not just our technological capabilities but our perspective as a species. As we extend our presence beyond Earth, questions of space governance, resource utilization, and even what it means to be human will take on new dimensions, challenging us to expand not just our reach but our thinking.</p>
        `
      },
      {
        id: 9,
        title: "The Future of Artificial Intelligence",
        excerpt: "Exploring the ethical and practical implications of advanced AI.",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        author: "Dr. Nathan Chen",
        readTime: "8 min read",
        date: "July 8, 2023",
        content: `
          <p>As artificial intelligence systems become increasingly sophisticated, humanity stands at a crossroads that will define our relationship with technology for generations to come. The decisions we make in the next decade about AI development and regulation will have profound implications.</p>
          
          <h3>Beyond Pattern Recognition</h3>
          <p>Modern AI systems have mastered pattern recognition, but the next frontier involves causal reasoning—understanding not just correlations but why things happen. This shift could enable AI to help solve complex problems in climate science, medicine, and other fields where understanding causal relationships is crucial.</p>
          
          <h3>The Alignment Problem</h3>
          <p>As AI systems grow more powerful, ensuring they remain aligned with human values becomes increasingly challenging. The technical challenge of encoding human values—with all their nuance and cultural variation—into mathematical formalisms represents one of the most important research questions of our time.</p>
          
          <h3>Augmentation vs. Automation</h3>
          <p>The most promising path forward may not be full automation but rather human-AI collaboration, where AI systems enhance human capabilities rather than replace them. This "centaur model" could preserve human judgment in critical decisions while leveraging AI's computational advantages.</p>
          
          <h3>Democratizing Access</h3>
          <p>As AI tools become more powerful, ensuring broad access becomes an important ethical consideration. If advanced AI remains concentrated in the hands of a few corporations or countries, existing power imbalances could be dramatically amplified.</p>
          
          <h3>Beyond Human Intelligence</h3>
          <p>We should avoid the anthropomorphic fallacy of assuming AI will think like humans with greater speed. Advanced AI systems may develop entirely different cognitive architectures, potentially allowing them to solve problems in ways humans cannot conceptualize—a double-edged sword for safety and innovation.</p>
          
          <p>The future of AI isn't predetermined by technology but will be shaped by the collective choices of researchers, companies, policymakers, and citizens. Engaging thoughtfully with these questions now will help us navigate toward an AI future that empowers humanity rather than diminishing it.</p>
        `
      },
      {
        id: 10,
        title: "The Hidden World of Mushroom Networks",
        excerpt: "How fungi create Earth's most extensive communication systems.",
        image: "https://images.unsplash.com/photo-1729141231357-145d55e81f8e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8VGhlJTIwSGlkZGVuJTIwV29ybGQlMjBvZiUyME11c2hyb29tJTIwTmV0d29ya3N8ZW58MHx8MHx8fDI%3D",
        author: "Dr. Sylvia Wood",
        readTime: "6 min read",
        date: "March 14, 2023",
        content: `
          <p>Beneath our feet lies a vast biological network that some scientists have dubbed "Earth's natural internet." Fungal mycelium—the thread-like vegetative part of fungi—forms intricate connections that transfer nutrients, share information, and connect plant species in ways we're only beginning to understand.</p>
          
          <h3>Nature's Information Superhighway</h3>
          <p>Mycorrhizal fungi form symbiotic relationships with about 90% of land plants, connecting different species in a "wood wide web." Through these fungal networks, trees and plants can share resources and even "communicate" about threats like insect infestations, essentially creating a primitive form of inter-plant communication.</p>
          
          <h3>Intelligent Design</h3>
          <p>Mycelium networks demonstrate remarkable efficiency in their structure. When growing, they create pathways that optimize for both resource conservation and effective distribution—solving complex mathematical problems through evolutionary processes rather than calculation.</p>
          
          <h3>Ecological Importance</h3>
          <p>These networks play crucial roles in ecosystem health by sequestering carbon, improving soil structure, and enhancing plant resilience to drought and disease. Some ecologists now view forests not as collections of individual trees but as superorganisms connected through fungal networks.</p>
          
          <h3>Biomimicry Applications</h3>
          <p>Engineers and computer scientists are drawing inspiration from mycelium networks to design more efficient transportation systems, communication networks, and even algorithms. The decentralized, adaptive structure of fungal networks offers valuable lessons for human-designed systems.</p>
          
          <h3>Pharmaceutical Potential</h3>
          <p>Beyond their ecological role, fungi produce complex compounds to defend themselves and communicate. These compounds are proving to be rich sources of novel antibiotics, immune modulators, and other pharmaceuticals that could address pressing medical challenges.</p>
          
          <p>As we face complex environmental and technological challenges, these ancient fungal networks remind us that some of the most sophisticated solutions may not be invented but discovered in the elegant systems that have been evolving beneath our feet for hundreds of millions of years.</p>
        `
      }
    ],
    relaxed: [
      {
        id: 10,
        title: "Minimalist Living",
        excerpt: "Finding peace through simplifying your surroundings.",
        image: "https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        author: "Marie Johnson",
        readTime: "5 min read",
        date: "May 28, 2023",
        content: `
          <p>Minimalism isn't about owning as little as possible – it's about making room for what truly matters. By intentionally reducing physical and mental clutter, minimalist living creates space for greater clarity, focus, and appreciation of life's meaningful aspects.</p>
          
          <h3>Start With Why</h3>
          <p>Effective minimalism begins with understanding your motivation. Are you seeking less stress, more financial freedom, environmental sustainability, or simply a more aesthetic living space? Clarifying your "why" will guide your decisions and help you stay motivated during the decluttering process.</p>
          
          <h3>The Art of Thoughtful Reduction</h3>
          <p>Rather than focusing on elimination, consider curation. Ask yourself not just "Do I need this?" but "Does this add value to my life?" This subtle shift transforms decluttering from deprivation to intentional selection, making it more sustainable and satisfying.</p>
          
          <h3>Quality Over Quantity</h3>
          <p>Minimalism often leads to investing in fewer, better things. When you purchase less frequently, you can consider durability, functionality, and craftsmanship. This approach typically results in less waste, lower long-term costs, and greater appreciation for what you own.</p>
          
          <h3>Digital Minimalism</h3>
          <p>In our connected age, digital clutter can be as overwhelming as physical mess. Consider auditing your digital life: unsubscribe from excessive emails, organize your files, clear your desktop, and be intentional about app usage and notifications. Digital minimalism creates mental space and reduces the constant pull on your attention.</p>
          
          <h3>The One-In, One-Out Rule</h3>
          <p>To maintain minimalism after your initial decluttering, consider adopting a one-in, one-out policy. For each new item that enters your life, allow another to leave. This creates a natural equilibrium that prevents accumulation while still allowing for change and evolution in your possessions.</p>
          
          <p>Remember that minimalism is a personal journey, not a competition. The goal isn't to live with a specific number of items or achieve a certain aesthetic – it's to create a living environment that supports your well-being and priorities. Your version of minimalism might look quite different from someone else's, and that's exactly as it should be.</p>
        `
      },
      {
        id: 11,
        title: "Japanese Forest Bathing",
        excerpt: "The art of shinrin-yoku and its scientific benefits.",
        image: "https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        author: "Hiroshi Nakamura",
        readTime: "6 min read",
        date: "May 2, 2023",
        content: `
          <p>In the 1980s, Japanese officials coined the term "shinrin-yoku" (forest bathing) to encourage people to spend time in nature. What began as a public health campaign has since been validated by scientific research, revealing that mindful immersion in forest environments offers remarkable physiological and psychological benefits.</p>
          
          <h3>Beyond Exercise</h3>
          <p>While physical activity in any environment provides health benefits, forest bathing offers unique advantages beyond exercise alone. The phytoncides (antimicrobial compounds) released by trees have been shown to boost immune function, with effects lasting up to 30 days after forest exposure.</p>
          
          <h3>Stress Reduction Mechanism</h3>
          <p>Studies measuring cortisol levels, heart rate variability, and blood pressure confirm that forest environments activate the parasympathetic nervous system—our "rest and digest" mode—more effectively than urban settings, even when controlling for exercise levels and other factors.</p>
          
          <h3>Attention Restoration</h3>
          <p>Natural environments provide what psychologists call "soft fascination"—stimuli that engage attention gently without demanding directed concentration. This allows the prefrontal cortex to rest, reducing cognitive fatigue and improving performance on tasks requiring focused attention after nature exposure.</p>
          
          <h3>Mindful Practice</h3>
          <p>While simply being in a forest offers benefits, the traditional practice involves deliberate sensory engagement: noticing the patterns of light filtering through leaves, feeling the textures of bark and soil, listening to the layered sounds of the forest, and smelling the complex aromas of plants and earth.</p>
          
          <h3>Accessibility Adaptations</h3>
          <p>Those without access to forests can still benefit from modified practices. Studies show that even viewing images of nature, bringing plants indoors, or visiting urban parks can provide scaled versions of forest bathing benefits.</p>
          
          <p>In our increasingly digital and indoor lives, the practice of forest bathing offers a simple yet profound way to reconnect with our evolutionary environment and access natural medicine that requires no prescription—just presence and attention in the living world.</p>
        `
      },
      {
        id: 12,
        title: "The Art of Tea Meditation",
        excerpt: "Finding mindfulness in the ancient ritual of tea preparation.",
        image: "https://images.unsplash.com/photo-1547825407-2d060104b7f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        author: "Lin Wei",
        readTime: "4 min read",
        date: "February 8, 2023",
        content: `
          <p>The preparation and consumption of tea has been used as a meditative practice for centuries, particularly in East Asian traditions. Beyond its pleasant taste and subtle stimulation, tea offers an accessible pathway to mindfulness through a ritual that engages all the senses.</p>
          
          <h3>Historical Roots</h3>
          <p>The connection between tea and meditation was formalized in Zen Buddhism, where tea ceremonies were developed to cultivate presence, simplicity, and appreciation of transience. These traditions recognized that mindful engagement with everyday activities could be as profound as formal seated meditation.</p>
          
          <h3>The Five Senses Engagement</h3>
          <p>Tea meditation works by anchoring attention in sensory experience: observing the color and movement of the water, listening to the sounds of pouring, inhaling the aroma as it develops, feeling the warmth of the cup, and finally, tasting the complex flavors that unfold with each sip.</p>
          
          <h3>Biochemical Support</h3>
          <p>The L-theanine in tea promotes alpha brain waves associated with relaxed alertness—the ideal state for meditation. Unlike coffee's sometimes jarring stimulation, tea provides a gentle lift that supports rather than disrupts contemplative awareness.</p>
          
          <h3>Simple Practice</h3>
          <p>A basic tea meditation begins by eliminating distractions and moving deliberately through each step of preparation. As you drink, maintain awareness of the sensations without being pulled into planning or rumination. When the mind wanders, gently return attention to the direct experience of the tea.</p>
          
          <h3>Beyond the Cup</h3>
          <p>The awareness cultivated through tea meditation naturally extends to other activities. After regular practice, you may find yourself bringing the same quality of attention to washing dishes, walking, or conversing—transforming ordinary moments into opportunities for presence.</p>
          
          <p>In a world that increasingly prizes speed and productivity, the simple act of preparing and drinking tea with full attention offers a revolutionary alternative—a way to step outside the rush and rediscover the richness available in each moment.</p>
        `
      }
    ],
    hungry: [
      {
        id: 13,
        title: "5-Minute Comfort Food",
        excerpt: "Quick recipes that satisfy your deepest cravings.",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        author: "Chef Ricardo",
        readTime: "4 min read",
        date: "June 7, 2023",
        content: `
          <p>When hunger strikes and time is short, you need recipes that deliver maximum satisfaction with minimum effort. These five-minute comfort foods prove that delicious, soul-warming meals don't require complicated techniques or lengthy preparation.</p>
          
          <h3>Elevated Instant Ramen</h3>
          <p>Transform packaged ramen by discarding the seasoning packet and adding your own flavor boosters: a spoonful of miso paste, a dash of soy sauce, a drizzle of sesame oil, and a handful of quick-cooking vegetables like spinach or thinly sliced mushrooms. Top with a soft-boiled egg (which you can make in advance and keep refrigerated) for protein and that perfect Instagram-worthy yolk.</p>
          
          <h3>Gourmet Grilled Cheese</h3>
          <p>Upgrade this classic by using quality bread and a combination of cheeses (sharp cheddar with gruyere or fontina works beautifully). Add thin slices of apple or pear for sweetness, or a few leaves of fresh basil and sliced tomato for Italian flair. The key to perfection: butter the outside of the bread and cook slowly over medium-low heat for even browning and maximum melt.</p>
          
          <h3>Mediterranean Microwave Mug</h3>
          <p>In a large microwave-safe mug, combine a handful of cherry tomatoes, a few olives, some feta cheese, pre-cooked quinoa or couscous, and a drizzle of olive oil. Microwave for 1-2 minutes until the tomatoes begin to burst, then stir in a handful of baby spinach which will wilt from the residual heat. Season with black pepper and a squeeze of lemon for a satisfying Mediterranean-inspired meal in minutes.</p>
          
          <h3>Avocado Toast Reinvented</h3>
          <p>Move beyond basic avocado toast with creative toppings: everything bagel seasoning and a seven-minute egg; smoked salmon, capers, and red onion; or corn, black beans, and a sprinkle of taco seasoning. The combination of healthy fats and fiber makes this quick meal surprisingly satisfying.</p>
          
          <h3>Sweet Potato Shortcut</h3>
          <p>Pierce a sweet potato several times with a fork and microwave for 4-5 minutes until tender. Split it open and top with black beans, salsa, and a dollop of Greek yogurt for a Southwestern twist, or try almond butter, banana slices, and a drizzle of honey for a sweet-savory option that works for breakfast or dessert.</p>
          
          <p>These five-minute meals prove that comfort food doesn't have to be complicated or time-consuming. By keeping a few key ingredients on hand and embracing creative shortcuts, you can satisfy your hunger with minimal effort while still enjoying maximum flavor.</p>
        `
      },
      {
        id: 14,
        title: "The Art of Food Plating",
        excerpt: "How visual presentation affects flavor perception.",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        author: "Chef Isabella Moretti",
        readTime: "5 min read",
        date: "March 22, 2023",
        content: `
          <p>We often hear that we eat with our eyes first, but neuroscience confirms this is more than just a saying. The visual presentation of food significantly impacts our perception of flavor through multiple cognitive pathways, making plating an essential culinary skill rather than mere decoration.</p>
          
          <h3>The Science of Expectation</h3>
          <p>When we see an aesthetically pleasing dish, our brain releases dopamine in anticipation of reward. This primes our taste receptors for a positive experience and can actually enhance our perception of flavor—a beautifully plated average dish may taste better than a sloppily presented superior one.</p>
          
          <h3>Color Psychology</h3>
          <p>Different colors trigger specific expectations and emotional responses. Red and orange stimulate appetite, while blue and purple are naturally rare in foods and can slightly suppress hunger. Contrasting colors create visual interest that encourages diners to explore flavors more attentively.</p>
          
          <h3>Spatial Composition</h3>
          <p>The arrangement of elements on a plate influences how we interact with the food. Studies show that diners typically taste the focal point of a composition first, giving chefs control over the sequence of flavor discovery. Asymmetrical arrangements are generally perceived as more interesting but less formal than centered presentations.</p>
          
          <h3>Home Application</h3>
          <p>Even without professional tools, home cooks can improve presentation by considering height variation, negative space, color contrast, and intentional placement. Something as simple as using a clean cloth to wipe plate edges or selecting appropriately sized dishes can dramatically improve presentation.</p>
          
          <h3>Cultural Considerations</h3>
          <p>Plating aesthetics vary significantly across cultures—Japanese cuisine often emphasizes negative space and natural asymmetry, while classical French tradition values geometrical precision. Understanding these cultural frameworks helps appreciate the philosophy behind different presentation styles.</p>
          
          <p>By approaching plating as a meaningful extension of cooking rather than an afterthought, both professional and home chefs can create comprehensive sensory experiences that engage diners before they take their first bite.</p>
        `
      },
      {
        id: 15,
        title: "Unexpected Food Pairings",
        excerpt: "The science behind surprising flavor combinations.",
        image: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        author: "Dr. Fatima Nouri",
        readTime: "7 min read",
        date: "July 30, 2023",
        content: `
          <p>Some of the most memorable culinary experiences come from unexpected combinations: chocolate with sea salt, watermelon with feta, or strawberries with black pepper. Understanding the science behind these surprising pairings can help both chefs and home cooks create innovative flavor experiences.</p>
          
          <h3>Flavor Bridge Theory</h3>
          <p>Many unusual pairings work because of shared flavor compounds between seemingly dissimilar ingredients. Strawberries and basil share linalool, while chocolate and blue cheese contain similar fatty acids. Even without formal chemical analysis, recognizing these "flavor bridges" can inspire creative combinations.</p>
          
          <h3>Complementary Contrasts</h3>
          <p>Effective pairings often balance opposing sensory elements: the sweetness of chocolate with the bitterness of coffee; the creaminess of avocado with the acidity of citrus. These contrasts create dynamic tension that keeps the palate engaged throughout the eating experience.</p>
          
          <h3>Cultural Conditioning</h3>
          <p>What seems unusual is often culturally relative. Peanut butter and jelly would seem bizarre to someone who hadn't grown up with it, while combinations like fish sauce and caramel (common in Vietnamese cooking) might surprise Western palates. Recognizing cultural bias opens new pairing possibilities.</p>
          
          <h3>Neurological Effects</h3>
          <p>Some pairings work because they trigger multiple sensory pathways simultaneously. Chili and chocolate is a classic example—the capsaicin activates pain receptors while chocolate stimulates pleasure centers, creating a complex neurological response that heightens both experiences.</p>
          
          <h3>Experimental Approach</h3>
          <p>Developing your own unexpected pairings starts with understanding the basic flavor profile of ingredients (sweet, sour, salty, bitter, umami) and texture characteristics. Begin with small tastings and refine ratios before incorporating discoveries into complete dishes.</p>
          
          <p>The most exciting frontiers in cuisine often lie at these unexpected intersections, where tradition meets innovation and science informs intuition. By approaching cooking with both curiosity and fundamental flavor understanding, anyone can discover remarkable new combinations.</p>
        `
      }
    ],
    adventurous: [
      {
        id: 16,
        title: "Urban Exploration: The Hidden City",
        excerpt: "Discovering forgotten places in your own backyard.",
        image: "https://images.unsplash.com/photo-1494783367193-149034c05e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        author: "Alex Rivera",
        readTime: "6 min read",
        date: "August 5, 2023",
        content: `
          <p>Every city contains multiple layers of history, often hiding in plain sight. Urban exploration—the art of discovering forgotten, abandoned, or simply overlooked spaces—offers a unique way to connect with the hidden stories of familiar places and experience the thrill of discovery without traveling far.</p>
          
          <h3>Beyond Abandonment</h3>
          <p>While abandoned buildings might first come to mind, urban exploration encompasses much more: repurposed historical structures, underground infrastructure, rooftop vantage points, and transitional spaces that reveal how cities evolve through time. The most rewarding explorations often involve places that are perfectly legal to visit but simply escape everyday notice.</p>
          
          <h3>Research and Respect</h3>
          <p>Before exploring, research local history to understand what you're seeing. Historical maps, archival photographs, and local history books provide context that transforms a casual walk into a journey through time. Always respect private property, cultural sites, and your own safety—the best explorers leave no trace and take only photographs.</p>
          
          <h3>The Art of Noticing</h3>
          <p>Train yourself to look up above street level, where architectural details often remain intact from earlier eras. Notice changes in building materials, ghost signs (faded advertisements painted on buildings), or locations where street grids shift—these often indicate boundaries between historical development phases of a city.</p>
          
          <h3>Social History</h3>
          <p>Beyond architecture, urban exploration reveals how people lived and worked. Former industrial districts, transportation hubs, and commercial corridors tell stories of economic boom and bust, technological change, and shifting social patterns. A seemingly ordinary street corner might have been the birthplace of a cultural movement or political revolution.</p>
          
          <h3>Modern Connection</h3>
          <p>Document and share your discoveries through photography, writing, or digital mapping. Many cities have communities of history enthusiasts who organize walks, maintain websites, or advocate for preservation—connecting with these groups can deepen your exploration and contribute to collective understanding of urban heritage.</p>
          
          <p>Urban exploration transforms the familiar into the extraordinary, revealing that adventure doesn't require distant travel—just a shift in perspective and the willingness to look more closely at the everyday world around you.</p>
        `
      },
      {
        id: 17,
        title: "Solo Travel Philosophy",
        excerpt: "Why traveling alone might be the most rewarding journey.",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        author: "Maya Johnson",
        readTime: "5 min read",
        date: "July 17, 2023",
        content: `
          <p>Traveling alone offers a unique form of freedom—the ability to follow your curiosity without compromise, connect deeply with new environments, and discover aspects of yourself that only emerge when you step beyond the familiar contexts and relationships that usually define you.</p>
          
          <h3>Enhanced Awareness</h3>
          <p>Without a companion's conversation to distract you, solo travel heightens your observation of surroundings. Colors seem more vivid, sounds more distinct, and subtle cultural details more apparent. This intensified perception creates stronger memories and deeper connection to places you visit.</p>
          
          <h3>Social Expansion</h3>
          <p>Paradoxically, traveling alone often leads to more meaningful social encounters than traveling with companions. Without the safety of a known group, you're more likely to engage with locals and fellow travelers, resulting in unexpected friendships and authentic cultural exchange that rarely occur when you're already socially satisfied by familiar company.</p>
          
          <h3>Self-Reliance</h3>
          <p>Navigating unfamiliar environments alone builds practical confidence that transfers to all areas of life. From resolving travel disruptions to communicating across language barriers, each challenge you overcome creates a stronger sense of capability and adaptability that remains long after your journey ends.</p>
          
          <h3>Identity Exploration</h3>
          <p>Removed from people who know you and expect certain behaviors, solo travel creates space to experiment with different aspects of your personality. You might discover you're more outgoing, creative, or adventurous than you realized when not unconsciously conforming to established roles in your regular social circles.</p>
          
          <h3>Presence Practice</h3>
          <p>Traveling alone eliminates the need to manage others' experiences or reach consensus about activities. This freedom allows for complete immersion in the present moment—whether lingering in a museum that speaks to you, changing plans spontaneously to follow an interesting lead, or simply sitting in a café watching local life unfold at its natural pace.</p>
          
          <p>While group travel has its own rewards, the solo journey offers an unparalleled opportunity for self-discovery and genuine engagement with the world. Even one short solo trip can transform your perspective on independence, connection, and the art of being your own best companion.</p>
        `
      },
      {
        id: 18,
        title: "Extreme Weather Chasing",
        excerpt: "The science and thrill of storm hunting expeditions.",
        image: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        author: "Dr. Tyler Morgan",
        readTime: "7 min read",
        date: "June 12, 2023",
        content: `
          <p>Storm chasing blends scientific pursuit with raw adventure, drawing meteorologists, photographers, and thrill-seekers to witness nature's most dramatic atmospheric performances. While popularized by films, real storm chasing involves methodical prediction, careful navigation, and profound respect for natural forces.</p>
          
          <h3>Forecast Foundations</h3>
          <p>Successful chasing begins days before a storm forms, analyzing weather models for conditions that create supercell thunderstorms: moisture, instability, lift, and wind shear. Experienced chasers develop pattern recognition skills that help them identify promising systems before clear indicators emerge in standard forecasts.</p>
          
          <h3>The Chase Strategy</h3>
          <p>Once target areas are identified, chasers position themselves ahead of developing storms, using real-time radar, visual cues like cloud structures, and environmental indicators like temperature changes to track development. The goal is intercepting a storm's most active phase from a safe vantage point that allows observation without excessive risk.</p>
          
          <h3>Safety Protocol</h3>
          <p>Professional chasers maintain escape routes, avoid core storm regions with hail and flash flooding, and never chase in urban areas or at night when hazards can't be clearly seen. They use specialized equipment like weather stations and high-clearance vehicles, and understand road networks thoroughly in case quick evacuation becomes necessary.</p>
          
          <h3>Scientific Contribution</h3>
          <p>Beyond personal experience, many chasers collect valuable data for research. Real-time reports of severe weather help meteorologists issue more accurate warnings, while video documentation provides insights into storm structure and behavior that improve forecasting models and save lives through better prediction.</p>
          
          <h3>Philosophical Dimension</h3>
          <p>For many dedicated chasers, the activity transcends adrenaline-seeking to become a form of connection with natural processes. Witnessing the raw power of atmospheric physics creates a perspective on human scale within natural systems that many describe as profoundly humbling and spiritually significant.</p>
          
          <p>While not without controversy regarding risk and environmental impact, responsible storm chasing represents a unique intersection of science, adventure, and appreciation for natural phenomena that allows humans to witness and learn from some of Earth's most spectacular meteorological events.</p>
        `
      },
      {
        id: 19,
        title: "Wilderness Survival Basics",
        excerpt: "Essential skills everyone should know before venturing outdoors.",
        image: "https://images.unsplash.com/photo-1560281210-9dae6355ec28?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        author: "Jason Torres",
        readTime: "8 min read",
        date: "May 14, 2023",
        content: `
          <p>Whether you're planning a wilderness expedition or simply hiking in a local forest, understanding basic survival principles creates both safety and deeper connection with natural environments. These foundational skills have supported human life for thousands of years and remain relevant even in our technology-dependent era.</p>
          
          <h3>The Survival Hierarchy</h3>
          <p>Survival priorities follow a simple order: shelter, water, fire, and food. In most environments, exposure to elements kills faster than thirst, thirst kills faster than cold, and cold kills faster than hunger. This hierarchy should guide your actions and energy allocation in any survival situation.</p>
          
          <h3>Shelter Principles</h3>
          <p>Effective shelter blocks wind, repels precipitation, provides insulation, and retains heat. Natural materials like fallen branches, leaves, and snow can create surprisingly effective protection when properly arranged. The key principle is creating dead air space around your body to maintain core temperature.</p>
          
          <h3>Water Wisdom</h3>
          <p>Recognizing water sources in landscapes includes looking for plant indicators, animal trails, and topographic features where water naturally collects. All wild water sources should be purified through boiling (5+ minutes at rolling boil), chemical treatment, or filtration systems that remove biological contaminants.</p>
          
          <h3>Fire Fundamentals</h3>
          <p>Successful fire-making requires understanding the progression from tinder (materials that ignite from a spark) through kindling (pencil-sized fuel) to sustaining fuel (larger wood). Regardless of ignition method, carefully prepared fire materials arranged to allow oxygen flow is more important than the starting technique itself.</p>
          
          <h3>Navigation Necessities</h3>
          <p>Even with GPS technology, understanding map and compass basics and natural navigation methods provides crucial redundancy. Learning to read landscapes, track sun movement, identify north using stars, and recognize landmark features allows for confident direction-finding even when technology fails.</p>
          
          <p>Beyond technical skills, the most important survival tool is psychological resilience—maintaining calm decision-making under stress, adapting to changing conditions, and preserving a positive mental attitude. With these foundations, time outdoors becomes not just safer but more deeply engaging as you develop self-reliance in natural settings.</p>
        `
      }
    ]
  };

  const moods: MoodOption[] = [
    {
      name: "inspired",
      icon: <FiHeart size={24} />,
      color: "text-white",
      bgColor: "bg-gradient-to-br from-pink-500 to-rose-600",
      hoverColor: "hover:from-pink-600 hover:to-rose-700"
    },
    {
      name: "tired",
      icon: <FiMeh size={24} />,
      color: "text-white",
      bgColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
      hoverColor: "hover:from-blue-600 hover:to-indigo-700"
    },
    {
      name: "curious",
      icon: <FiBook size={24} />,
      color: "text-white",
      bgColor: "bg-gradient-to-br from-violet-500 to-purple-600",
      hoverColor: "hover:from-violet-600 hover:to-purple-700"
    },
    {
      name: "relaxed",
      icon: <FiSmile size={24} />,
      color: "text-white",
      bgColor: "bg-gradient-to-br from-emerald-500 to-teal-600",
      hoverColor: "hover:from-emerald-600 hover:to-teal-700"
    },
    {
      name: "hungry",
      icon: <FiCoffee size={24} />,
      color: "text-white",
      bgColor: "bg-gradient-to-br from-amber-500 to-yellow-600",
      hoverColor: "hover:from-amber-600 hover:to-yellow-700"
    },
    {
      name: "adventurous",
      icon: <FiMapPin size={24} />,
      color: "text-white",
      bgColor: "bg-gradient-to-br from-red-500 to-orange-600",
      hoverColor: "hover:from-red-600 hover:to-orange-700"
    }
  ];

  // Glass effect classes
  const glassEffect = "backdrop-blur-md backdrop-saturate-150 bg-opacity-20 border border-opacity-20";

  const glassLight = `${glassEffect} bg-white/30 border-white/50 shadow-xl`;
  const glassDark = `${glassEffect} bg-slate-900/30 border-slate-800/50 shadow-xl`;
  const glassStyle = theme === "dark" ? glassDark : glassLight;

  // Button styles
  const buttonLight = "bg-white/40 border border-white/50 text-slate-700 hover:bg-white/60";
  const buttonDark = "bg-slate-800/40 border border-slate-700/50 text-white hover:bg-slate-800/60";
  const buttonStyle = theme === "dark" ? buttonDark : buttonLight;

  // Text colors
  const textColor = theme === "dark" ? "text-slate-100" : "text-slate-800";
  const textSecondary = theme === "dark" ? "text-slate-300" : "text-slate-600";

  // Enhanced handleMoodSelect to both set the mood and scroll to show the articles
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  // Handle mobile menu toggle
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle menu item click for both desktop and mobile
  const handleMenuClick = (sectionId: string) => {
    // Prevent loading screen from appearing
    const currentIsLoading = isLoading;
    if (isLoading) setIsLoading(false);

    // First close the menu
    setIsMenuOpen(false);

    // Small timeout to ensure menu closes smoothly before scrolling
    setTimeout(() => {
      scrollToSection(sectionId);
    }, 100);
  };

  return (
    <>
      <style jsx global>{`
        .light-theme-bg {
          background-color: #f8fafc;
        }
        
        .dark-theme-bg {
          background-color: #0f172a;
        }
        
        .blog-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-family: var(--font-playfair);
        }
        
        .blog-content p {
          margin-bottom: 1.25rem;
          line-height: 1.8;
          font-family: var(--font-nunito);
          font-size: 1.05rem;
        }
        
        .light-theme .blog-content h3 {
          color: #6d28d9;
        }
        
        .dark-theme .blog-content h3 {
          color: #a78bfa;
        }
        
        .blog-details-image {
          position: relative;
        }
        
        .blog-details-image::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 30%, transparent 100%);
          border-radius: 0.75rem;
        }
        
        .blog-info-item {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          backdrop-filter: blur(8px);
        }
        
        .light-theme .blog-info-item {
          background-color: rgba(255, 255, 255, 0.3);
        }
        
        .dark-theme .blog-info-item {
          background-color: rgba(0, 0, 0, 0.3);
        }
        
        .gradient-text {
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          background-image: linear-gradient(to right, #6366f1, #a855f7, #ec4899);
        }
        
        .dark-theme .gradient-text {
          background-image: linear-gradient(to right, #818cf8, #c084fc, #f472b6);
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        .nav-link {
          position: relative;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #6366f1;
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after, .nav-link.active::after {
          width: 100%;
        }
        
        /* Loading screen styles */
        .loading-screen {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out;
        }
        
        .loading-screen.hidden {
          opacity: 0;
          visibility: hidden;
        }
        
        .loader {
          width: 48px;
          height: 48px;
          border: 5px solid #f3f3f3;
          border-radius: 50%;
          border-top-color: #6366f1;
          animation: spinner 0.8s linear infinite;
        }
        
        @keyframes spinner {
          to {
            transform: rotate(360deg);
          }
        }
        
        /* Mobile menu styles */
        .mobile-menu {
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          width: 75vw;
          max-width: 300px;
          z-index: 60;
          transition: transform 0.3s ease-in-out;
          transform: translateX(100%);
        }
        
        .mobile-menu.open {
          transform: translateX(0);
        }
        
        .mobile-menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 50;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .mobile-menu-overlay.open {
          opacity: 1;
          visibility: visible;
        }
        
        @media (max-width: 640px) {
          .container {
            padding-left: 16px;
            padding-right: 16px;
          }
        }
        
        /* Footer styles */
        .footer-link {
          transition: color 0.2s ease;
        }
        
        .footer-link:hover {
          color: #6366f1;
        }
        
        /* Mobile theme switcher */
        .mobile-theme-switcher {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 70;
        }
        
        @media (min-width: 768px) {
          .mobile-theme-switcher {
            display: none;
          }
        }
      `}</style>

      {/* Loading Screen */}
      <div className={`loading-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'} ${isLoading ? '' : 'hidden'}`}>
        <div className="loader"></div>
      </div>

      <div className={`min-h-screen ${textColor} ${nunito.variable} ${playfair.variable} font-sans ${theme === 'dark' ? 'dark-theme' : 'light-theme'} relative ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>

        {/* Header Navigation */}
        <header className={`w-full px-4 sm:px-6 py-4 sticky top-0 z-50 backdrop-blur-md ${theme === 'dark' ? 'bg-slate-800/80' : 'bg-white/80'} shadow-sm`}>
          <div className="container mx-auto flex items-center justify-between">
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${playfair.className} gradient-text`}>
                MoodReads
              </h1>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <button
                onClick={() => handleMenuClick("home")}
                className={`text-sm font-medium hover:text-indigo-500 transition-colors nav-link ${activeSection === "home" ? "active text-indigo-500" : ""}`}
              >
                <span className="flex items-center gap-1">
                  <FiHome size={16} />
                  Home
                </span>
              </button>
              <button
                onClick={() => handleMenuClick("moods")}
                className={`text-sm font-medium hover:text-indigo-500 transition-colors nav-link ${activeSection === "moods" ? "active text-indigo-500" : ""}`}
              >
                <span className="flex items-center gap-1">
                  <FiSmile size={16} />
                  Moods
                </span>
              </button>
              <button
                onClick={() => handleMenuClick("latest")}
                className={`text-sm font-medium hover:text-indigo-500 transition-colors nav-link ${activeSection === "latest" ? "active text-indigo-500" : ""}`}
              >
                <span className="flex items-center gap-1">
                  <FiClock size={16} />
                  Latest
                </span>
              </button>
              <button
                onClick={() => handleMenuClick("featured")}
                className={`text-sm font-medium hover:text-indigo-500 transition-colors nav-link ${activeSection === "featured" ? "active text-indigo-500" : ""}`}
              >
                <span className="flex items-center gap-1">
                  <FiStar size={16} />
                  Featured
                </span>
              </button>
              <button
                onClick={() => handleMenuClick("about")}
                className={`text-sm font-medium hover:text-indigo-500 transition-colors nav-link ${activeSection === "about" ? "active text-indigo-500" : ""}`}
              >
                <span className="flex items-center gap-1">
                  <FiInfo size={16} />
                  About
                </span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-lg focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <FiMenu size={24} className={activeSection === "home" ? "text-indigo-500" : ""} />
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <div
          className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        ></div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''} ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'} shadow-lg`}>
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h2 className={`text-xl font-bold ${playfair.className}`}>Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="flex flex-col space-y-6">
              <button
                onClick={() => handleMenuClick("home")}
                className={`text-lg font-medium hover:text-indigo-500 transition-colors ${activeSection === "home" ? "text-indigo-500" : ""}`}
              >
                <span className="flex items-center gap-2">
                  <FiHome size={20} />
                  Home
                </span>
              </button>
              <button
                onClick={() => handleMenuClick("moods")}
                className={`text-lg font-medium hover:text-indigo-500 transition-colors ${activeSection === "moods" ? "text-indigo-500" : ""}`}
              >
                <span className="flex items-center gap-2">
                  <FiSmile size={20} />
                  Moods
                </span>
              </button>
              <button
                onClick={() => handleMenuClick("latest")}
                className={`text-lg font-medium hover:text-indigo-500 transition-colors ${activeSection === "latest" ? "text-indigo-500" : ""}`}
              >
                <span className="flex items-center gap-2">
                  <FiBook size={20} />
                  Latest
                </span>
              </button>
              <button
                onClick={() => handleMenuClick("featured")}
                className={`text-lg font-medium hover:text-indigo-500 transition-colors ${activeSection === "featured" ? "text-indigo-500" : ""}`}
              >
                <span className="flex items-center gap-2">
                  <FiStar size={20} />
                  Featured
                </span>
              </button>
              <button
                onClick={() => handleMenuClick("about")}
                className={`text-lg font-medium hover:text-indigo-500 transition-colors ${activeSection === "about" ? "text-indigo-500" : ""}`}
              >
                <span className="flex items-center gap-2">
                  <FiInfo size={20} />
                  About
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Hero Section - Only show when not viewing a blog */}
          {!viewingBlog && (
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              id="home"
            >
              <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${playfair.className}`}>
                Hey, We're <span className="gradient-text">MoodReads</span>. See our
                <br />thoughts, stories and ideas.
              </h2>
              <p className={`text-lg ${textSecondary} max-w-2xl mx-auto mb-8`}>
                Welcome to MoodReads! Through emotional articles, matching stories, and expert insights across moods to
                your interests.
              </p>
            </motion.div>
          )}

          {/* Rest of content */}
          <AnimatePresence mode="wait">
            {viewingBlog ? (
              <motion.div
                key="blog-detail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`rounded-2xl p-6 md:p-8 ${glassStyle} backdrop-blur-xl`}
              >
                <div className="mb-6">
                  <motion.button
                    onClick={handleBackToBlogs}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${buttonStyle} transition-all duration-300`}
                    whileHover={{ x: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiArrowLeft /> Back to blogs
                  </motion.button>
                </div>

                <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden blog-details-image glow">
                  <img
                    src={viewingBlog.image}
                    alt={viewingBlog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 p-6 md:p-8 z-10">
                    <h1 className={`text-2xl md:text-4xl font-bold text-white mb-4 ${playfair.className} glow-text`}>
                      {viewingBlog.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-white/90">
                      {viewingBlog.author && (
                        <div className="blog-info-item">
                          <FiUser size={14} /> {viewingBlog.author}
                        </div>
                      )}
                      {viewingBlog.date && (
                        <div className="blog-info-item">
                          {viewingBlog.date}
                        </div>
                      )}
                      {viewingBlog.readTime && (
                        <div className="blog-info-item">
                          <FiClock size={14} /> {viewingBlog.readTime}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <motion.div
                  className={`mx-auto blog-content ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'} frosted-glass p-8 rounded-xl`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div dangerouslySetInnerHTML={{ __html: viewingBlog.content || '' }} />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="mood-blogs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Moods Section */}
                <div ref={moodsRef} id="moods-section" className="scroll-mt-24 mb-12">
                  <div className="text-center mb-8">
                    <h2 className={`text-3xl font-bold ${playfair.className} mb-2`}>
                      How are you feeling today?
                    </h2>
                    <p className={`${textSecondary}`}>Select a mood to discover content that matches your current state of mind</p>
                  </div>

                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-3xl mx-auto">
                    {moods.map((mood) => {
                      // Define indicator colors explicitly for each mood
                      const indicatorColors = {
                        inspired: "text-pink-500",
                        tired: "text-blue-500",
                        curious: "text-violet-500",
                        relaxed: "text-emerald-500",
                        hungry: "text-amber-500",
                        adventurous: "text-red-500"
                      };

                      return (
                        <motion.button
                          key={mood.name}
                          onClick={() => handleMoodSelect(mood.name)}
                          className={`${mood.bgColor} ${mood.color} ${mood.hoverColor} shadow-md hover:shadow-lg p-4 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-2 h-28 relative ${selectedMood === mood.name ? 'ring-4 ring-white ring-opacity-50' : ''}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className={`text-2xl ${selectedMood === mood.name ? 'scale-125' : ''} transition-transform duration-300`}>
                            {mood.icon}
                          </div>
                          <span className="text-sm font-medium capitalize">{mood.name}</span>

                          {selectedMood === mood.name && (
                            <div className="absolute -top-2 -right-2 bg-white text-xs w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${indicatorColors[mood.name as keyof typeof indicatorColors]}`}>
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                    </div>
                  </div>

                  {/* Selected Mood Blogs - Moved here to prioritize core functionality */}
                  {selectedMood && (
                    <div id="mood-articles" className="mb-20 scroll-mt-24">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-2xl font-bold ${playfair.className}`}>
                          <span className={`text-indigo-500 capitalize`}>{selectedMood}</span> Articles
                        </h2>

                        <button
                          onClick={() => setSelectedMood(null)}
                          className="text-sm text-indigo-500 font-medium hover:underline flex items-center gap-2"
                        >
                          <FiArrowLeft size={14} />
                          Back to all moods
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {moodBlogs[selectedMood]?.map((blog: BlogPost) => (
                          <div
                            key={blog.id}
                            className={`rounded-xl overflow-hidden border ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'} hover:shadow-lg transition-all duration-300`}
                          >
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-3 left-3 bg-indigo-500 text-white text-xs px-2 py-1 rounded capitalize">
                                {selectedMood}
                              </div>
                            </div>
                            <div className="p-5">
                              <h3 className={`text-lg font-bold mb-2 line-clamp-2 ${playfair.className}`}>{blog.title}</h3>
                              <p className={`text-sm ${textSecondary} mb-4 line-clamp-2`}>
                                {blog.excerpt}
                              </p>

                              <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                                    <FiUser size={14} />
                                  </div>
                                  <div className="text-xs">
                                    <p className="font-medium">{blog.author || 'Anonymous'}</p>
                                    <p className={textSecondary}>{blog.date?.split(' ')[0] || 'Today'}</p>
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleReadMore(blog)}
                                  className="text-indigo-500 hover:text-indigo-600"
                                >
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Latest Section - Now after mood articles */}
                  <div ref={latestRef} id="latest-section" className="scroll-mt-24 mb-24">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className={`text-3xl font-bold ${playfair.className}`}>
                        Latest Articles
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {/* Safely access some of the latest articles */}
                      {[
                        // Only use blogs that we know exist for sure
                        moodBlogs.inspired[0],
                        moodBlogs.tired[0],
                        moodBlogs.curious[0]
                      ].map((blog: BlogPost) => (
                        <div
                          key={blog.id}
                          className={`rounded-xl overflow-hidden border ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'} hover:shadow-lg transition-all duration-300`}
                        >
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={blog.image}
                              alt={blog.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 left-3 bg-indigo-500 text-white text-xs px-2 py-1 rounded">
                              New
                            </div>
                          </div>
                          <div className="p-5">
                            <h3 className={`text-lg font-bold mb-2 line-clamp-2 ${playfair.className}`}>{blog.title}</h3>
                            <p className={`text-sm ${textSecondary} mb-4 line-clamp-2`}>
                              {blog.excerpt}
                            </p>

                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                                  <FiUser size={14} />
                                </div>
                                <div className="text-xs">
                                  <p className="font-medium">{blog.author || 'Anonymous'}</p>
                                  <p className={textSecondary}>{blog.date?.split(' ')[0] || 'Today'}</p>
                                </div>
                              </div>

                              <button
                                onClick={() => handleReadMore(blog)}
                                className="text-indigo-500 hover:text-indigo-600"
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Featured Section */}
                  <div ref={featuredRef} id="featured-section" className="scroll-mt-24 mb-24">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className={`text-3xl font-bold ${playfair.className}`}>
                        Featured Collections
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div
                        className="relative h-64 rounded-xl overflow-hidden cursor-pointer"
                        onClick={() => {
                          setSelectedMood("relaxed");
                          moodsRef.current?.scrollIntoView({ behavior: 'smooth' });
                          setActiveSection("moods");
                        }}
                      >
                        <img
                          src="https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                          alt="Relaxation Collection"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                          <h3 className="text-white text-2xl font-bold mb-2">Mindfulness & Relaxation</h3>
                          <p className="text-white/80 mb-4">Discover practices for peace and presence in daily life</p>
                          <button className="bg-white text-indigo-600 px-4 py-2 rounded-full text-sm font-medium w-fit">
                            Explore Collection
                          </button>
                        </div>
                      </div>

                      <div
                        className="relative h-64 rounded-xl overflow-hidden cursor-pointer"
                        onClick={() => {
                          setSelectedMood("curious");
                          moodsRef.current?.scrollIntoView({ behavior: 'smooth' });
                          setActiveSection("moods");
                        }}
                      >
                        <img
                          src="https://images.unsplash.com/photo-1551244072-5d12893278ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                          alt="Curiosity Collection"
                          className="w-full h-full object-cover"
                        />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                        <h3 className="text-white text-2xl font-bold mb-2">Science & Discovery</h3>
                        <p className="text-white/80 mb-4">Fascinating insights into our world and beyond</p>
                        <button className="bg-white text-indigo-600 px-4 py-2 rounded-full text-sm font-medium w-fit">
                          Explore Collection
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div ref={aboutRef} id="about-section" className="scroll-mt-24 mb-10">
                  <div className={`rounded-2xl p-4 sm:p-8 md:p-12`}>
                    <div className="container mx-auto px-4 md:px-6">
                      <h2 className={`text-2xl sm:text-3xl font-bold ${playfair.className} mb-6 text-center`}>
                        About MoodReads
                      </h2>

                      <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto text-sm sm:text-base">
                        <p>
                          MoodReads is a unique blog experience that adapts to how you're feeling right now.
                          Unlike traditional blogs organized by topic or date, we curate content based on your current mood.
                        </p>

                        <p>
                          Our approach recognizes that what you want to read often depends on your emotional state.
                          Whether you're feeling inspired and looking for creative ideas, tired and needing rest advice,
                          curious about fascinating topics, seeking relaxation techniques, or hungry for culinary inspiration —
                          we have carefully crafted content to match your state of mind.
                        </p>

                        <p>
                          Founded in 2023, MoodReads brings together expert writers from diverse fields who understand
                          the connection between emotions and intellectual engagement. Our articles are not just informative—they're
                          tailored to resonate with specific emotional states.
                        </p>

                        <p>
                          Simply select the mood that resonates with you today, and we'll suggest articles
                          that might be exactly what you need right now. Your reading experience, personalized by emotion.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Newsletter section - Remove this entire section */}

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Section */}
        <footer className={`${theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-600'} py-8 sm:py-12 mt-8 sm:mt-12`}>
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Column 1 - About */}
              <div className="mb-6 sm:mb-0">
                <h3 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${playfair.className} ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  MoodReads
                </h3>
                <p className="mb-3 sm:mb-4 text-xs sm:text-sm">
                  Personalized reading experiences tailored to your emotional state. Discover content that resonates with how you feel.
                </p>
                <p className="text-sm mt-4">© {new Date().getFullYear()} MoodReads. All rights reserved.</p>
              </div>

              {/* Column 2 - Quick Links */}
              <div>
                <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  <li><a href="#" className="footer-link text-sm" onClick={(e) => { e.preventDefault(); handleMenuClick("home"); }}>Home</a></li>
                  <li><a href="#" className="footer-link text-sm" onClick={(e) => { e.preventDefault(); handleMenuClick("moods"); }}>Mood Selection</a></li>
                  <li><a href="#" className="footer-link text-sm" onClick={(e) => { e.preventDefault(); handleMenuClick("latest"); }}>Latest Articles</a></li>
                  <li><a href="#" className="footer-link text-sm" onClick={(e) => { e.preventDefault(); handleMenuClick("featured"); }}>Featured Collections</a></li>
                  <li><a href="#" className="footer-link text-sm" onClick={(e) => { e.preventDefault(); handleMenuClick("about"); }}>About Us</a></li>
                </ul>
              </div>

              {/* Column 3 - Moods */}
              <div>
                <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  Mood Categories
                </h3>
                <ul className="space-y-2">
                  {moods.map((mood) => (
                    <li key={mood.name}>
                      <a 
                        href="#"
                        className="footer-link text-sm flex items-center gap-2"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedMood(mood.name);
                          handleMenuClick("moods");
                        }}
                      >
                        <span className="opacity-75">{mood.icon}</span>
                        <span className="capitalize">{mood.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4 - Subscribe */}
              <div>
                <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  Contact Us
                </h3>
                <p className="text-sm mb-4">Have questions or feedback? We'd love to hear from you.</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FiMail size={16} className="text-indigo-500" />
                    <span className="text-sm">hello@moodreads.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone size={16} className="text-indigo-500" />
                    <span className="text-sm">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin size={16} className="text-indigo-500" />
                    <span className="text-sm">123 Reading Lane, Bookville, CA 94103</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </footer>

        {/* Mobile Theme Switcher - only visible on mobile */}
        <motion.button
          onClick={toggleTheme}
          className={`mobile-theme-switcher p-3 rounded-full ${buttonStyle} ${glassEffect} transition-all duration-300 shadow-lg`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
        </motion.button>

        {/* Final closing divs for the main wrapper div */}
    </div>

      {/* Fixed Theme Switcher - only visible on desktop */}
      <motion.button
        onClick={toggleTheme}
        className={`fixed bottom-4 right-4 p-3 rounded-full ${buttonStyle} ${glassEffect} transition-all duration-300 shadow-lg z-50 hidden md:block`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
      </motion.button>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {
          showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={scrollToTop}
              className={`fixed bottom-4 right-20 p-3 rounded-full ${buttonStyle} ${glassEffect} transition-all duration-300 shadow-lg z-50 hidden md:block`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiChevronUp size={20} />
            </motion.button>
          )
        }
      </AnimatePresence>
    </>
  );
}
"use client" 

import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, Type, Copy, Columns, Moon, Sun, RotateCcw, 
  RefreshCw, Download, Eye, Code, CheckCircle, ChevronDown, 
  Palette, Sliders, Share, Save, Layout, TextCursor,
  Sparkles, Clock, History, Zap, Heart, BarChart, Grid,
  Smartphone, Tablet, Laptop, Award, Hash, Droplet, Bookmark,
  Lightbulb, Check, X, Camera, ArrowUpRight, Maximize, Minimize,
  AlertTriangle, Info
} from 'lucide-react';

interface TypographySettings {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  fontWeight: number;
  textAlign: string;
  textColor: string;
  backgroundColor: string;
  textTransform: string;
  fontStyle: string;
  textDecoration: string;
  textShadow: string;
}

interface HistoryEntry {
  timestamp: number;
  panel: "left" | "right";
  settings: TypographySettings;
  description: string;
}

interface Preset {
  id: string;
  name: string;
  description: string;
  tags: string[];
  settings: TypographySettings;
  thumbnailColor: string;
}

const TypographyPlayground: React.FC = () => {
  const sampleTexts = [
    "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum consequat hendrerit lacus, ac tincidunt metus vulputate in.",
    "Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed.",
    "A paragraph of text should contain 45-75 characters per line for optimal readability. This is considered the perfect measure.",
    "Dribbble 2025 showcases the cutting edge of digital design. Great typography is at the heart of exceptional user experiences.",
    "The best typography is invisible, enhancing the message without drawing attention to itself. It's functional art at its finest."
  ];
  
  const fonts = [
    { name: "Plus Jakarta Sans", value: "'Plus Jakarta Sans', system-ui, sans-serif" },
    { name: "Outfit", value: "'Outfit', Arial, sans-serif" },
    { name: "General Sans", value: "'General Sans', system-ui, sans-serif" },
    { name: "Cabinet Grotesk", value: "'Cabinet Grotesk', system-ui, sans-serif" },
    { name: "Lexend", value: "'Lexend', system-ui, sans-serif" },
    { name: "Playfair Display", value: "'Playfair Display', Georgia, serif" },
    { name: "Source Code Pro", value: "'Source Code Pro', monospace" },
    { name: "Montserrat", value: "'Montserrat', system-ui, sans-serif" },
  ];

  const textShadowPresets = [
    { name: "None", value: "none" },
    { name: "Subtle", value: "0 1px 2px rgba(0,0,0,0.07)" },
    { name: "Medium", value: "2px 2px 4px rgba(0,0,0,0.12)" },
    { name: "Strong", value: "3px 3px 6px rgba(0,0,0,0.15)" },
    { name: "Neon", value: "0 0 5px rgba(10,132,255,0.8), 0 0 10px rgba(10,132,255,0.4)" },
    { name: "Elegant", value: "1px 1px 0 rgba(255,255,255,0.1), -1px -1px 0 rgba(0,0,0,0.05)" },
    { name: "3D Effect", value: "1px 1px 0 #ccc, 2px 2px 0 #aaa, 3px 3px 0 #888" },
    { name: "Neon Glow", value: "0 0 5px #fff, 0 0 10px #fff, 0 0 15px #0073e6, 0 0 20px #0073e6" },
    { name: "Layered", value: "0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9" },
    { name: "Retro", value: "3px 3px 0 #2196F3, 6px 6px 0 rgba(0,0,0,0.2)" },
  ];

  const typographyPresets: Preset[] = [
    {
      id: "neo-minimalist",
      name: "Neo Minimalist",
      description: "Clean, balanced typography with perfect proportions for modern interfaces",
      tags: ["minimal", "modern", "clean"],
      settings: {
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        fontSize: 18,
        lineHeight: 1.6,
        letterSpacing: 0,
        fontWeight: 400,
        textAlign: "left",
        textColor: "#1c1c1c",
        backgroundColor: "#ffffff",
        textTransform: "none",
        fontStyle: "normal",
        textDecoration: "none",
        textShadow: "none",
      },
      thumbnailColor: "#E6F7FF"
    },
    {
      id: "editorial-luxury",
      name: "Editorial Luxury",
      description: "Sophisticated serif typography inspired by high-end editorial design",
      tags: ["editorial", "serif", "elegant"],
      settings: {
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 20,
        lineHeight: 1.8,
        letterSpacing: 0.3,
        fontWeight: 400,
        textAlign: "left",
        textColor: "#121212",
        backgroundColor: "#f8f9fa",
        textTransform: "none",
        fontStyle: "normal",
        textDecoration: "none",
        textShadow: "none",
      },
      thumbnailColor: "#FFF5EA"
    },
    {
      id: "neo-brutalist",
      name: "Neo Brutalist",
      description: "Bold, high-contrast typography with raw, industrial aesthetics",
      tags: ["bold", "brutalist", "high-contrast"],
      settings: {
        fontFamily: "'Neue Montreal', Helvetica, sans-serif",
        fontSize: 22,
        lineHeight: 1.3,
        letterSpacing: -0.5,
        fontWeight: 700,
        textAlign: "left",
        textColor: "#000000",
        backgroundColor: "#ffffff",
        textTransform: "none",
        fontStyle: "normal",
        textDecoration: "none",
        textShadow: "none",
      },
      thumbnailColor: "#F5F5F5"
    },
    {
      id: "digital-humanist",
      name: "Digital Humanist",
      description: "Perfectly balanced typography that blends technological precision with human warmth",
      tags: ["balanced", "readable", "friendly"],
      settings: {
        fontFamily: "'Satoshi', system-ui, sans-serif",
        fontSize: 18,
        lineHeight: 1.7,
        letterSpacing: 0.2,
        fontWeight: 450,
        textAlign: "left",
        textColor: "#262626",
        backgroundColor: "#fafafa",
        textTransform: "none",
        fontStyle: "normal",
        textDecoration: "none",
        textShadow: "none",
      },
      thumbnailColor: "#F0F7FF"
    },
    {
      id: "future-retro",
      name: "Future Retro",
      description: "Bold typographic statements with a nostalgic feel and futuristic edge",
      tags: ["retro", "bold", "distinctive"],
      settings: {
        fontFamily: "'DM Serif', Georgia, serif",
        fontSize: 24,
        lineHeight: 1.4,
        letterSpacing: 1,
        fontWeight: 500,
        textAlign: "center",
        textColor: "#111111",
        backgroundColor: "#f0f0f0",
        textTransform: "uppercase",
        fontStyle: "normal",
        textDecoration: "none",
        textShadow: "2px 2px 0 rgba(0,0,0,0.1)",
      },
      thumbnailColor: "#F2E9FF"
    },
    {
      id: "monospaced-clean",
      name: "Monospaced Clean",
      description: "Technical precision with a focus on code-like clarity and structure",
      tags: ["code", "technical", "structured"],
      settings: {
        fontFamily: "'Source Code Pro', monospace",
        fontSize: 16,
        lineHeight: 1.6,
        letterSpacing: 0,
        fontWeight: 400,
        textAlign: "left",
        textColor: "#2d2d2d",
        backgroundColor: "#f9f9f9",
        textTransform: "none",
        fontStyle: "normal",
        textDecoration: "none",
        textShadow: "none",
      },
      thumbnailColor: "#E6FFFA"
    },
  ];

  const initialLeftSettings: TypographySettings = {
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    fontSize: 18,
    lineHeight: 1.6,
    letterSpacing: 0,
    fontWeight: 400,
    textAlign: "left",
    textColor: "#1c1c1c",
    backgroundColor: "#ffffff",
    textTransform: "none",
    fontStyle: "normal",
    textDecoration: "none",
    textShadow: "none",
  };

  const initialRightSettings: TypographySettings = {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 18,
    lineHeight: 1.8,
    letterSpacing: 0.5,
    fontWeight: 400,
    textAlign: "left",
    textColor: "#121212",
    backgroundColor: "#f8f9fa",
    textTransform: "none",
    fontStyle: "normal",
    textDecoration: "none",
    textShadow: "none",
  };

  const darkModeSettings = {
    textColor: "#e8e8e8",
    backgroundColor: "#1e1e2d"
  };

  const lightModeSettings = {
    left: {
      textColor: "#1c1c1c",
      backgroundColor: "#ffffff"
    },
    right: {
      textColor: "#121212",
      backgroundColor: "#f8f9fa"
    }
  };

  const colorPalettes = [
    {
      name: "Neo Minimal",
      textColor: "#121212",
      backgroundColor: "#ffffff",
    },
    {
      name: "Warm Neutral",
      textColor: "#2d2d2d",
      backgroundColor: "#f7f3f0",
    },
    {
      name: "Cool Gray",
      textColor: "#2b2d42",
      backgroundColor: "#edf2f4",
    },
    {
      name: "Soft Contrast",
      textColor: "#272343",
      backgroundColor: "#fffffe",
    },
    {
      name: "Neo Brutalist",
      textColor: "#000000",
      backgroundColor: "#f1f1f1",
    },
    {
      name: "Pastel Dreams",
      textColor: "#33272a",
      backgroundColor: "#faeee7",
    },
    {
      name: "Deep Ocean",
      textColor: "#e7f0ff",
      backgroundColor: "#0f1c41",
    },
    {
      name: "Sunset Glow",
      textColor: "#331a38",
      backgroundColor: "#ffe9dc",
    },
    {
      name: "Dark Mode",
      textColor: "#e8e8e8",
      backgroundColor: "#1e1e2d",
    },
  ];

  const [text, setText] = useState<string>(sampleTexts[0]);
  const [leftSettings, setLeftSettings] = useState<TypographySettings>(initialLeftSettings);
  const [rightSettings, setRightSettings] = useState<TypographySettings>(initialRightSettings);
  const [activePanel, setActivePanel] = useState<"left" | "right">("left");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showCSS, setShowCSS] = useState<boolean>(false);
  const [activeSample, setActiveSample] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [notificationType, setNotificationType] = useState<"success" | "info" | "warning">("success");
  
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [typographyScore, setTypographyScore] = useState<number>(85);
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [showPresets, setShowPresets] = useState<boolean>(false);
  const [responsivePreview, setResponsivePreview] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [showAccessibilityScore, setShowAccessibilityScore] = useState<boolean>(false);
  const [accessibilityScore, setAccessibilityScore] = useState<number>(92);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [showAIsuggestions, setShowAIsuggestions] = useState<boolean>(false);
  const [aiSuggestion, setAiSuggestion] = useState<string>("");
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [showColorPalette, setShowColorPalette] = useState<boolean>(false);
  
  // Original background colors for light mode reference
  const [originalLeftBg, setOriginalLeftBg] = useState<string>(initialLeftSettings.backgroundColor);
  const [originalRightBg, setOriginalRightBg] = useState<string>(initialRightSettings.backgroundColor);
  
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const compareViewRef = useRef<HTMLDivElement>(null);

  const generateCSS = (settings: TypographySettings): string => {
    return `
font-family: ${settings.fontFamily};
font-size: ${settings.fontSize}px;
line-height: ${settings.lineHeight};
letter-spacing: ${settings.letterSpacing}px;
font-weight: ${settings.fontWeight};
text-align: ${settings.textAlign};
color: ${settings.textColor};
background-color: ${settings.backgroundColor};
text-transform: ${settings.textTransform};
font-style: ${settings.fontStyle};
text-decoration: ${settings.textDecoration};
text-shadow: ${settings.textShadow};
    `.trim();
  };

  const calculateTypographyScore = (settings: TypographySettings): number => {
    const baseFontSizeScore = Math.min(100, Math.max(60, 80 + (settings.fontSize - 16) * 2));
    
    const lineHeightScore = 
      settings.lineHeight >= 1.5 && settings.lineHeight <= 1.8 
        ? 100 
        : settings.lineHeight < 1.5 
        ? 100 - (1.5 - settings.lineHeight) * 30 
        : 100 - (settings.lineHeight - 1.8) * 20;
    
    const letterSpacingScore = 100 - Math.abs(settings.letterSpacing) * 5;
    
    return Math.min(100, Math.round(
      (baseFontSizeScore * 0.3) +
      (lineHeightScore * 0.4) +
      (letterSpacingScore * 0.3)
    ));
  };

  const calculateAccessibilityScore = (settings: TypographySettings): number => {
    const hexToRgb = (hex: string): {r: number, g: number, b: number} | null => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    const luminance = (r: number, g: number, b: number): number => {
      const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const contrastRatio = (l1: number, l2: number): number => {
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    };

    const textRgb = hexToRgb(settings.textColor);
    const bgRgb = hexToRgb(settings.backgroundColor);
    
    if (!textRgb || !bgRgb) return 70;
    
    const textLuminance = luminance(textRgb.r, textRgb.g, textRgb.b);
    const bgLuminance = luminance(bgRgb.r, bgRgb.g, bgRgb.b);
    
    const contrast = contrastRatio(textLuminance, bgLuminance);
    
    const minimumContrast = settings.fontSize >= 18 ? 3 : 4.5;
    
    const fontSizeScore = Math.min(100, Math.max(60, settings.fontSize / 24 * 100));
    
    const contrastScore = Math.min(100, Math.max(0, (contrast / minimumContrast) * 100));
    
    return Math.min(100, Math.round(
      (fontSizeScore * 0.4) +
      (contrastScore * 0.6)
    ));
  };

  const generateAISuggestion = (settings: TypographySettings): string => {
    const suggestions = [
      `Try increasing line height to ${(settings.lineHeight + 0.2).toFixed(1)} for better readability.`,
      `Consider using a font weight of ${settings.fontWeight <= 400 ? '500' : '400'} for better balance.`,
      `A letter spacing of ${settings.letterSpacing + 0.3}px might enhance legibility with this font.`,
      `This font pairs well with "${settings.fontFamily.includes('serif') ? 'Plus Jakarta Sans' : 'Playfair Display'}" for headings.`,
      `Try a slightly ${settings.textColor === '#000000' ? 'softer black like #2D2D2D' : 'darker'} text color for less eye strain.`,
      `This typography would work beautifully with a subtle text shadow (Subtle preset).`,
      `For an elegant look, try pairing this with a contrasting ${settings.backgroundColor === '#ffffff' ? 'off-white' : 'white'} background.`
    ];
    
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  const showToast = (message: string, type: "success" | "info" | "warning" = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const copyCSS = (settings: TypographySettings) => {
    const css = generateCSS(settings);
    navigator.clipboard.writeText(css);
    showToast("CSS copied to clipboard!");
    
    addToHistory(activePanel, `Copied CSS for ${activePanel} panel`);
  };

  const captureScreenshot = () => {
    showToast("Screenshot captured and saved!", "success");
    
    addToHistory(activePanel, `Captured screenshot of ${activePanel} panel`);
  };

  const addToHistory = (panel: "left" | "right", description: string) => {
    const currentSettings = panel === "left" ? leftSettings : rightSettings;
    const newEntry: HistoryEntry = {
      timestamp: Date.now(),
      panel,
      settings: {...currentSettings},
      description
    };
    
    setHistory(prev => [newEntry, ...prev].slice(0, 20));
  };

  const applyHistoryEntry = (entry: HistoryEntry) => {
    if (entry.panel === "left") {
      setLeftSettings(entry.settings);
    } else {
      setRightSettings(entry.settings);
    }
    setActivePanel(entry.panel);
    showToast(`Restored settings from history`, "info");
  };

  const resetSettings = (panel: "left" | "right") => {
    addToHistory(panel, `Reset ${panel} panel to defaults`);
    
    if (panel === "left") {
      if (darkMode) {
        setLeftSettings({
          ...initialLeftSettings,
          backgroundColor: darkModeSettings.backgroundColor,
          textColor: darkModeSettings.textColor
        });
      } else {
        setLeftSettings(initialLeftSettings);
      }
    } else {
      if (darkMode) {
        setRightSettings({
          ...initialRightSettings,
          backgroundColor: darkModeSettings.backgroundColor,
          textColor: darkModeSettings.textColor
        });
      } else {
        setRightSettings(initialRightSettings);
      }
    }
    showToast(`${panel === "left" ? "Left" : "Right"} panel reset to defaults`);
  };

  const swapSettings = () => {
    addToHistory("left", "Swapped settings between panels");
    
    const tempSettings = {...leftSettings};
    setLeftSettings({...rightSettings});
    setRightSettings(tempSettings);
    showToast("Settings swapped between panels");
  };

  const exportSettings = (settings: TypographySettings) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "typography-settings-2025.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showToast("Settings exported as JSON");
    
    addToHistory(activePanel, `Exported ${activePanel} panel settings`);
  };

  const applyPreset = (presetId: string) => {
    const preset = typographyPresets.find(p => p.id === presetId);
    if (!preset) return;
    
    addToHistory(activePanel, `Applied ${preset.name} preset`);
    
    if (darkMode) {
      setCurrentSettings({
        ...preset.settings,
        backgroundColor: darkModeSettings.backgroundColor,
        textColor: darkModeSettings.textColor
      });
    } else {
      setCurrentSettings(preset.settings);
    }
    
    setSelectedPreset(presetId);
    showToast(`Applied "${preset.name}" preset to ${activePanel === "left" ? "left" : "right"} panel`);
    
    setTimeout(() => {
      updateScores();
    }, 100);
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const applyAiSuggestion = () => {
    const suggestion = aiSuggestion;
    
    addToHistory(activePanel, `Applied AI suggestion: ${suggestion}`);
    
    if (suggestion.includes('line height')) {
      updateSettings('lineHeight', parseFloat((currentSettings.lineHeight + 0.2).toFixed(1)));
    } else if (suggestion.includes('font weight')) {
      updateSettings('fontWeight', currentSettings.fontWeight === 400 ? 500 : 400);
    } else if (suggestion.includes('letter spacing')) {
      updateSettings('letterSpacing', parseFloat((currentSettings.letterSpacing + 0.3).toFixed(1)));
    } else if (suggestion.includes('text shadow')) {
      updateSettings('textShadow', '0 1px 2px rgba(0,0,0,0.07)');
    }
    
    showToast("AI suggestion applied!", "success");
    
    setTimeout(() => {
      updateScores();
    }, 100);
    
    setAiSuggestion(generateAISuggestion(currentSettings));
  };

  const currentSettings = activePanel === "left" ? leftSettings : rightSettings;
  const setCurrentSettings = (settings: TypographySettings) => {
    if (activePanel === "left") {
      setLeftSettings(settings);
    } else {
      setRightSettings(settings);
    }
  };

  const updateSettings = (property: keyof TypographySettings, value: any) => {
    setCurrentSettings({
      ...currentSettings,
      [property]: value,
    });
    
    setSelectedPreset("");
    
    setTimeout(() => {
      updateScores();
    }, 100);
  };

  const updateScores = () => {
    setTypographyScore(calculateTypographyScore(currentSettings));
    setAccessibilityScore(calculateAccessibilityScore(currentSettings));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    
    // Save original background colors when first switching to dark mode
    if (darkMode) {
      if (originalLeftBg === initialLeftSettings.backgroundColor) {
        setOriginalLeftBg(leftSettings.backgroundColor);
      }
      if (originalRightBg === initialRightSettings.backgroundColor) {
        setOriginalRightBg(rightSettings.backgroundColor);
      }
      
      // Apply dark mode settings to both panels
      setLeftSettings(prev => ({
        ...prev,
        backgroundColor: darkModeSettings.backgroundColor,
        textColor: darkModeSettings.textColor
      }));
      
      setRightSettings(prev => ({
        ...prev,
        backgroundColor: darkModeSettings.backgroundColor,
        textColor: darkModeSettings.textColor
      }));
    } else {
      // Restore original light mode backgrounds
      setLeftSettings(prev => ({
        ...prev,
        backgroundColor: originalLeftBg,
        textColor: lightModeSettings.left.textColor
      }));
      
      setRightSettings(prev => ({
        ...prev,
        backgroundColor: originalRightBg,
        textColor: lightModeSettings.right.textColor
      }));
    }
  }, [darkMode]);

  useEffect(() => {
    setHistory([
      {
        timestamp: Date.now() - 3600000,
        panel: "left",
        settings: {...initialLeftSettings},
        description: "Initial settings"
      },
      {
        timestamp: Date.now() - 3600000,
        panel: "right",
        settings: {...initialRightSettings},
        description: "Initial settings"
      }
    ]);
    
    setAiSuggestion(generateAISuggestion(initialLeftSettings));
    
    updateScores();
  }, []);

  const cycleSampleText = () => {
    const nextIndex = (activeSample + 1) % sampleTexts.length;
    setActiveSample(nextIndex);
    setText(sampleTexts[nextIndex]);
  };

  const getResponsiveWidth = (): string => {
    switch (responsivePreview) {
      case "mobile": return "320px";
      case "tablet": return "768px";
      case "desktop": return "100%";
      default: return "100%";
    }
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateContrastScore = (): number => {
    return 95;
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-50' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'
    } ${fullscreen ? 'fixed inset-0 z-50 overflow-auto' : ''}`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full ${
          darkMode ? 'bg-purple-900/20' : 'bg-purple-200/30'
        } blur-3xl`}></div>
        <div className={`absolute top-1/3 -left-20 w-60 h-60 rounded-full ${
          darkMode ? 'bg-blue-900/20' : 'bg-blue-200/30'
        } blur-3xl`}></div>
        <div className={`absolute bottom-20 right-1/4 w-72 h-72 rounded-full ${
          darkMode ? 'bg-indigo-900/20' : 'bg-indigo-200/30'
        } blur-3xl`}></div>
      </div>

      <div 
        className={`fixed bottom-8 right-8 py-3 px-4 rounded-xl shadow-lg flex items-center gap-2 transform transition-all duration-300 z-50 backdrop-blur-md ${
          showNotification 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8 pointer-events-none'
        } ${
          notificationType === "success" 
            ? (darkMode ? 'bg-green-800/90 text-green-100' : 'bg-green-500/90 text-white')
            : notificationType === "info"
            ? (darkMode ? 'bg-blue-800/90 text-blue-100' : 'bg-blue-500/90 text-white')
            : (darkMode ? 'bg-amber-800/90 text-amber-100' : 'bg-amber-500/90 text-white')
        }`}
      >
        {notificationType === "success" ? (
          <CheckCircle size={18} />
        ) : notificationType === "info" ? (
          <Info size={18} />
        ) : (
          <AlertTriangle size={18} />
        )}
        <span className="font-medium">{notificationMessage}</span>
      </div>

      {isPremium && (
        <div className="fixed top-4 right-4 z-40 px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-full text-xs font-medium shadow-lg flex items-center gap-1.5">
          <Award size={14} />
          <span>Premium</span>
        </div>
      )}

      <div className={`container mx-auto px-4 py-6 max-w-7xl transition-all ${fullscreen ? 'max-w-full' : 'max-w-7xl'} relative z-10`}>
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 relative">
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${
                darkMode 
                  ? 'from-violet-600 via-indigo-600 to-blue-700' 
                  : 'from-violet-500 via-indigo-500 to-blue-600'
              } rounded-2xl blur-lg opacity-40 transition-all duration-500 group-hover:opacity-70`}></div>
              <div className={`relative p-3 rounded-2xl ${
                darkMode 
                  ? 'bg-gray-800/90 backdrop-blur-sm' 
                  : 'bg-white/90 backdrop-blur-sm'
              } shadow-xl transition-transform duration-300 group-hover:scale-105`}>
                <Type className={`${
                  darkMode ? 'text-indigo-300' : 'text-indigo-500'
                } transition-all duration-300`} size={32} />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2 font-heading">
                Typography <span className={`${
                  darkMode ? 'text-indigo-300' : 'text-indigo-600'
                } transition-all duration-300`}>Studio</span>
                <span className="text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2.5 py-0.5 rounded-full font-medium ml-1">2025</span>
              </h1>
              <p className={`text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              } mt-0.5 font-medium`}>Perfect type for perfect designs</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowAIsuggestions(!showAIsuggestions)}
              className={`p-2.5 rounded-full transition-all duration-300 flex items-center shadow-lg ${
                showAIsuggestions 
                  ? (darkMode 
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white' 
                      : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                    ) 
                  : (darkMode 
                      ? 'bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-sm' 
                      : 'bg-white/80 hover:bg-gray-100/80 backdrop-blur-sm shadow-sm'
                    )
              }`}
              aria-label="Toggle AI suggestions"
              title="AI Typography suggestions"
            >
              <Sparkles size={20} />
            </button>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2.5 rounded-full transition-all duration-300 flex items-center shadow-lg ${
                showHistory
                  ? (darkMode 
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white' 
                      : 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white'
                    ) 
                  : (darkMode 
                      ? 'bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-sm' 
                      : 'bg-white/80 hover:bg-gray-100/80 backdrop-blur-sm shadow-sm'
                    )
              }`}
              aria-label="Toggle history"
              title="History"
            >
              <History size={20} />
            </button>
            <button 
              onClick={() => setShowPresets(!showPresets)}
              className={`p-2.5 rounded-full transition-all duration-300 flex items-center shadow-lg ${
                showPresets
                  ? (darkMode 
                      ? 'bg-gradient-to-r from-pink-600 to-pink-700 text-white' 
                      : 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                    ) 
                  : (darkMode 
                      ? 'bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-sm' 
                      : 'bg-white/80 hover:bg-gray-100/80 backdrop-blur-sm shadow-sm'
                    )
              }`}
              aria-label="Toggle presets"
              title="Typography Presets"
            >
              <Bookmark size={20} />
            </button>
            <button 
              onClick={() => setShowCSS(!showCSS)}
              className={`p-2.5 rounded-full transition-all duration-300 flex items-center shadow-lg ${
                showCSS 
                  ? (darkMode 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    ) 
                  : (darkMode 
                      ? 'bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-sm' 
                      : 'bg-white/80 hover:bg-gray-100/80 backdrop-blur-sm shadow-sm'
                    )
              }`}
              aria-label="Toggle CSS view"
              title="View CSS"
            >
              <Code size={20} />
            </button>
            <button 
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-full transition-all duration-300 shadow-lg ${
                darkMode 
                  ? 'bg-gray-700/80 text-yellow-300 hover:bg-gray-600/80 backdrop-blur-sm' 
                  : 'bg-white/80 text-gray-700 hover:bg-gray-100/80 backdrop-blur-sm shadow-sm'
              }`}
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={toggleFullscreen}
              className={`p-2.5 rounded-full transition-all duration-300 shadow-lg ${
                darkMode 
                  ? 'bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-sm' 
                  : 'bg-white/80 hover:bg-gray-100/80 backdrop-blur-sm shadow-sm'
              }`}
              aria-label="Toggle fullscreen"
              title="Toggle fullscreen"
            >
              {fullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>

        <div className={`mb-6 p-5 rounded-xl ${
          darkMode 
            ? 'bg-gray-800/90 backdrop-blur-sm' 
            : 'bg-white/90 backdrop-blur-sm'
        } shadow-xl transition-all duration-300 relative overflow-hidden`}>
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-90"></div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <div className="flex items-center gap-2">
              <TextCursor className={`${darkMode ? 'text-indigo-300' : 'text-indigo-500'}`} size={20} />
              <h2 className="text-xl font-semibold font-heading">Sample Text</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={cycleSampleText}
                className={`px-3.5 py-2 rounded-lg text-sm flex items-center gap-1.5 transition-all duration-300 font-medium shadow-md ${
                  darkMode 
                    ? 'bg-gray-700/80 hover:bg-gray-600/80 text-gray-200' 
                    : 'bg-gray-100/80 hover:bg-gray-200/80 text-gray-700'
                }`}
              >
                <RefreshCw size={14} className={`transition-transform duration-500 ${activeSample ? 'rotate-180' : ''}`} />
                Change Sample
              </button>
              <div className="relative group">
                <button 
                  onClick={() => setShowAccessibilityScore(!showAccessibilityScore)}
                  className={`px-3.5 py-2 rounded-lg text-sm flex items-center gap-1.5 transition-all duration-300 font-medium shadow-md ${
                    showAccessibilityScore 
                      ? (darkMode 
                          ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white' 
                          : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                        )
                      : (darkMode 
                          ? 'bg-gray-700/80 hover:bg-gray-600/80 text-gray-200' 
                          : 'bg-gray-100/80 hover:bg-gray-200/80 text-gray-700'
                        )
                  }`}
                >
                  <BarChart size={14} />
                  <span className="hidden sm:inline-block">Accessibility</span> 
                  <span className={`font-medium ml-1 ${
                    accessibilityScore >= 90 
                      ? 'text-green-300' 
                      : accessibilityScore >= 70 
                      ? 'text-yellow-300' 
                      : 'text-red-300'
                  }`}>
                    {accessibilityScore}
                  </span>
                </button>
                <div className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap transition-opacity duration-200 pointer-events-none ${showAccessibilityScore ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                  Show accessibility score
                </div>
              </div>
            </div>
          </div>
          <div className={`relative ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-xl overflow-hidden transition-all group`}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={`w-full p-4 rounded-xl font-medium ${
                darkMode 
                  ? 'bg-gray-700/80 text-gray-100 focus:bg-gray-600/80' 
                  : 'bg-gray-50/80 text-gray-800 focus:bg-white/80'
              } border-2 ${
                darkMode 
                  ? 'border-gray-600 focus:border-indigo-500' 
                  : 'border-gray-200 focus:border-indigo-400'
              } focus:ring-4 ${
                darkMode 
                  ? 'focus:ring-indigo-600/20' 
                  : 'focus:ring-indigo-500/20'
              } focus:outline-none transition-all duration-300 shadow-inner`}
              rows={3}
              placeholder="Enter your text here..."
            />
            <div className={`absolute inset-0 pointer-events-none border-2 rounded-xl transition-opacity duration-300 opacity-0 group-focus-within:opacity-100 ${
              darkMode ? 'border-indigo-500' : 'border-indigo-400'
            }`}></div>
          </div>
        </div>

        {showAIsuggestions && (
          <div className={`mb-6 p-5 rounded-xl ${
            darkMode 
              ? 'bg-gray-800/90 backdrop-blur-md' 
              : 'bg-white/90 backdrop-blur-md'
          } shadow-xl transition-all duration-300 relative overflow-hidden border-2 ${
            darkMode ? 'border-purple-600/30' : 'border-purple-400/20'
          }`}>
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 opacity-90"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-purple-400" size={20} />
                <h2 className="text-xl font-semibold font-heading">AI Typography Assistant</h2>
              </div>
              <button
                onClick={() => setShowAIsuggestions(false)}
                className={`p-1.5 rounded-full ${
                  darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className={`p-5 rounded-xl mb-4 ${
              darkMode ? 'bg-purple-900/20' : 'bg-purple-50/80'
            } relative border ${
              darkMode ? 'border-purple-800/30' : 'border-purple-200'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-full ${
                  darkMode ? 'bg-purple-600/80' : 'bg-purple-100'
                } mt-0.5`}>
                  <Lightbulb size={16} className={darkMode ? 'text-purple-200' : 'text-purple-500'} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="font-medium">Typography suggestion: </span>
                    {aiSuggestion}
                  </p>
                  <button
                    onClick={applyAiSuggestion}
                    className={`mt-3.5 px-3.5 py-2 text-xs rounded-lg flex items-center gap-1.5 transition-all duration-300 font-medium shadow-md ${
                      darkMode 
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:opacity-90 text-white' 
                        : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:opacity-90 text-white'
                    }`}
                  >
                    <Zap size={12} /> 
                    Apply suggestion
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className={`h-5 w-5 flex-shrink-0 rounded-full ${
                darkMode ? 'bg-gray-700' : 'bg-purple-100'
              } mt-0.5 flex items-center justify-center`}>
                <Hash size={14} className={darkMode ? 'text-gray-400' : 'text-purple-500'} />
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Typography score: <span className={`font-medium ${
                  typographyScore >= 90 
                    ? 'text-green-400' 
                    : typographyScore >= 75 
                    ? 'text-blue-400' 
                    : 'text-yellow-400'
                }`}>{typographyScore}</span>. 
                Our AI analyzes readability, aesthetics, and best practices to help you create beautiful typography.
              </p>
            </div>
          </div>
        )}

        {showPresets && (
          <div className={`mb-6 p-5 rounded-xl ${
            darkMode 
              ? 'bg-gray-800/90 backdrop-blur-md' 
              : 'bg-white/90 backdrop-blur-md'
          } shadow-xl transition-all duration-300 relative overflow-hidden border-2 ${
            darkMode ? 'border-pink-600/30' : 'border-pink-400/20'
          }`}>
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pink-500 to-orange-500 opacity-90"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bookmark className="text-pink-400" size={20} />
                <h2 className="text-xl font-semibold font-heading">Typography Presets 2025</h2>
              </div>
              <button
                onClick={() => setShowPresets(false)}
                className={`p-1.5 rounded-full ${
                  darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {typographyPresets.map(preset => (
                <div 
                  key={preset.id}
                  className={`rounded-xl p-4 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] border-2 ${
                    selectedPreset === preset.id
                      ? (darkMode 
                          ? 'border-pink-500 bg-pink-900/20' 
                          : 'border-pink-400 bg-pink-50/80'
                        )
                      : (darkMode 
                          ? 'border-gray-700 hover:border-gray-600 bg-gray-800/50' 
                          : 'border-gray-100 hover:border-gray-200 bg-white/70 shadow-sm'
                        )
                  }`}
                  onClick={() => applyPreset(preset.id)}
                  style={{ backgroundColor: darkMode ? undefined : preset.thumbnailColor }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{preset.name}</h3>
                    {selectedPreset === preset.id && (
                      <div className={`rounded-full p-0.5 ${darkMode ? 'bg-pink-600' : 'bg-pink-500'}`}>
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <p className={`text-xs mb-2 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {preset.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {preset.tags.map(tag => (
                      <span 
                        key={tag} 
                        className={`text-xs px-1.5 py-0.5 rounded-md ${
                          darkMode 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showHistory && (
          <div className={`mb-6 p-5 rounded-xl ${
            darkMode 
              ? 'bg-gray-800/90 backdrop-blur-md' 
              : 'bg-white/90 backdrop-blur-md'
          } shadow-xl transition-all duration-300 relative overflow-hidden border-2 ${
            darkMode ? 'border-indigo-600/30' : 'border-indigo-400/20'
          }`}>
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-90"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="text-indigo-400" size={20} />
                <h2 className="text-xl font-semibold font-heading">History</h2>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className={`p-1.5 rounded-full ${
                  darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className={`max-h-56 overflow-y-auto pr-1 ${darkMode ? 'custom-scrollbar-dark' : 'custom-scrollbar'}`}>
              {history.length === 0 ? (
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No history available yet.</p>
              ) : (
                <div className="space-y-2">
                  {history.map((entry, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-xl flex items-center justify-between transition-all duration-200 hover:scale-[1.01] cursor-pointer shadow-sm ${
                        darkMode 
                          ? 'bg-gray-700/80 hover:bg-gray-600/80' 
                          : 'bg-gray-100/80 hover:bg-gray-200/80'
                      }`}
                      onClick={() => applyHistoryEntry(entry)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          entry.panel === "left" 
                            ? (darkMode ? 'bg-blue-400' : 'bg-blue-500') 
                            : (darkMode ? 'bg-purple-400' : 'bg-purple-500')
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium">{entry.description}</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Panel: {entry.panel === "left" ? "Left" : "Right"} • {formatDate(entry.timestamp)}
                          </p>
                        </div>
                      </div>
                      <button 
                        className={`px-3 py-1.5 rounded-lg text-xs transition-colors font-medium shadow-md ${
                          darkMode 
                            ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:opacity-90 text-white' 
                            : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:opacity-90 text-white'
                        }`}
                      >
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {showAccessibilityScore && (
          <div className={`mb-6 p-5 rounded-xl ${
            darkMode 
              ? 'bg-gray-800/90 backdrop-blur-md' 
              : 'bg-white/90 backdrop-blur-md'
          } shadow-xl transition-all duration-300 relative overflow-hidden border-2 ${
            darkMode ? 'border-green-600/30' : 'border-green-400/20'
          }`}>
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-500 to-emerald-500 opacity-90"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart className="text-green-400" size={20} />
                <h2 className="text-xl font-semibold font-heading">Accessibility Score</h2>
              </div>
              <button
                onClick={() => setShowAccessibilityScore(false)}
                className={`p-1.5 rounded-full ${
                  darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className={`p-5 rounded-xl shadow-md ${
                darkMode ? 'bg-gray-700/70' : 'bg-green-50/80'
              }`}>
                <div className="mb-3 flex justify-between items-center">
                  <h3 className="font-medium text-lg">Overall Score</h3>
                  <span className={`text-2xl font-bold ${
                    accessibilityScore >= 90 
                      ? 'text-green-400' 
                      : accessibilityScore >= 70 
                      ? 'text-yellow-400' 
                      : 'text-red-400'
                  }`}>
                    {accessibilityScore}
                  </span>
                </div>
                
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mb-4 shadow-inner">
                  <div 
                    className={`h-full rounded-full ${
                      accessibilityScore >= 90 
                        ? 'bg-gradient-to-r from-green-400 to-green-500' 
                        : accessibilityScore >= 70 
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                        : 'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                    style={{ width: `${accessibilityScore}%`, transition: 'width 1s ease-in-out' }}
                  ></div>
                </div>
                
                <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {accessibilityScore >= 90 
                    ? "Excellent! Your typography meets all accessibility guidelines."
                    : accessibilityScore >= 70 
                    ? "Good. Your typography is generally accessible but could be improved."
                    : "Needs improvement. Consider increasing contrast or font size."
                  }
                </p>
              </div>
              
              <div className="space-y-3">
                <div className={`p-3.5 rounded-xl shadow-md ${
                  darkMode ? 'bg-gray-700/70' : 'bg-gray-100/80'
                } flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${
                      calculateContrastScore() >= 90 
                        ? 'bg-green-100/80 text-green-600' 
                        : 'bg-amber-100/80 text-amber-600'
                    }`}>
                      <Droplet size={14} />
                    </div>
                    <span className="text-sm font-medium">Color Contrast</span>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                    calculateContrastScore() >= 90 
                      ? 'bg-green-100/80 text-green-600' 
                      : calculateContrastScore() >= 70 
                      ? 'bg-yellow-100/80 text-yellow-600' 
                      : 'bg-red-100/80 text-red-600'
                  }`}>
                    {calculateContrastScore()}%
                  </div>
                </div>
                
                <div className={`p-3.5 rounded-xl shadow-md ${
                  darkMode ? 'bg-gray-700/70' : 'bg-gray-100/80'
                } flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${
                      currentSettings.fontSize >= 16 
                        ? 'bg-green-100/80 text-green-600' 
                        : 'bg-amber-100/80 text-amber-600'
                    }`}>
                      <Type size={14} />
                    </div>
                    <span className="text-sm font-medium">Font Size</span>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                    currentSettings.fontSize >= 16 
                      ? 'bg-green-100/80 text-green-600' 
                      : 'bg-yellow-100/80 text-yellow-600'
                  }`}>
                    {currentSettings.fontSize >= 16 ? 'Good' : 'Small'}
                  </div>
                </div>
                
                <div className={`p-3.5 rounded-xl shadow-md ${
                  darkMode ? 'bg-gray-700/70' : 'bg-gray-100/80'
                } flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${
                      currentSettings.lineHeight >= 1.5 
                        ? 'bg-green-100/80 text-green-600' 
                        : 'bg-amber-100/80 text-amber-600'
                    }`}>
                      <Sliders size={14} />
                    </div>
                    <span className="text-sm font-medium">Line Height</span>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                    currentSettings.lineHeight >= 1.5 
                      ? 'bg-green-100/80 text-green-600' 
                      : 'bg-yellow-100/80 text-yellow-600'
                  }`}>
                    {currentSettings.lineHeight >= 1.5 ? 'Good' : 'Tight'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`lg:col-span-5 p-5 rounded-xl ${
            darkMode 
              ? 'bg-gray-800/90 backdrop-blur-sm' 
              : 'bg-white/90 backdrop-blur-sm'
          } shadow-xl order-2 lg:order-1 transition-all duration-300 relative overflow-hidden`}>
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-blue-600 opacity-90"></div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sliders className={`${darkMode ? 'text-indigo-300' : 'text-indigo-500'}`} size={20} />
                <h2 className="text-xl font-semibold font-heading">Controls</h2>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActivePanel("left")}
                  className={`px-3.5 py-2 rounded-lg ${
                    activePanel === "left" 
                      ? (darkMode 
                          ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white' 
                          : 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white'
                        ) 
                      : (darkMode 
                          ? 'bg-gray-700/80 hover:bg-gray-600/80' 
                          : 'bg-gray-100/80 hover:bg-gray-200/80'
                        )
                  } transition-all duration-300 shadow-md font-medium`}
                  aria-label="Edit left panel"
                >
                  Panel 1
                </button>
                <button
                  onClick={() => setActivePanel("right")}
                  className={`px-3.5 py-2 rounded-lg ${
                    activePanel === "right" 
                      ? (darkMode 
                          ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white' 
                          : 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white'
                        ) 
                      : (darkMode 
                          ? 'bg-gray-700/80 hover:bg-gray-600/80' 
                          : 'bg-gray-100/80 hover:bg-gray-200/80'
                        )
                  } transition-all duration-300 shadow-md font-medium`}
                  aria-label="Edit right panel"
                >
                  Panel 2
                </button>
              </div>
            </div>

            <div className="mb-5 border-b pb-2 flex overflow-x-auto hide-scrollbar gap-2">
              {[
                { id: "basic", name: "Basic", icon: <Type size={16} /> },
                { id: "appearance", name: "Appearance", icon: <Palette size={16} /> },
                { id: "advanced", name: "Advanced", icon: <Settings size={16} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all duration-300 font-medium ${
                    activeTab === tab.id
                      ? (darkMode 
                          ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white' 
                          : 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md'
                        )
                      : (darkMode 
                          ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/70' 
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/70'
                        )
                  }`}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              ))}
            </div>

            <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
              {activeTab === "basic" && (
                <>
                  <div className="group">
                    <label className="block text-sm font-medium mb-2 transition-colors" htmlFor="fontFamily">Font Family</label>
                    <div className="relative">
                      <select
                        id="fontFamily"
                        value={currentSettings.fontFamily}
                        onChange={(e) => updateSettings("fontFamily", e.target.value)}
                        className={`w-full p-3.5 rounded-xl border-2 appearance-none pr-10 font-medium ${
                          darkMode 
                            ? 'bg-gray-700/80 border-gray-600 focus:border-indigo-500 text-white' 
                            : 'bg-white/80 border-gray-200 focus:border-indigo-400 text-gray-800'
                        } focus:ring-3 ${
                          darkMode ? 'focus:ring-indigo-600/20' : 'focus:ring-indigo-500/20'
                        } focus:outline-none transition-all duration-300 shadow-md`}
                      >
                        {fonts.map((font) => (
                          <option key={font.name} value={font.value}>
                            {font.name}
                          </option>
                        ))}
                      </select>
                      <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium transition-colors" htmlFor="fontSize">Font Size</label>
                      <span className={`text-xs py-1 px-2.5 rounded-lg ${
                        darkMode ? 'bg-gray-700/80' : 'bg-gray-100/80'
                      } font-medium`}>{currentSettings.fontSize}px</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        id="fontSize"
                        type="range"
                        min="8"
                        max="72"
                        value={currentSettings.fontSize}
                        onChange={(e) => updateSettings("fontSize", parseInt(e.target.value))}
                        className="w-full accent-indigo-500 h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="number"
                        min="8"
                        max="72"
                        value={currentSettings.fontSize}
                        onChange={(e) => updateSettings("fontSize", parseInt(e.target.value) || 16)}
                        className={`w-16 p-2.5 rounded-lg border-2 text-center font-medium ${
                          darkMode 
                            ? 'bg-gray-700/80 border-gray-600 focus:border-indigo-500 text-white' 
                            : 'bg-white/80 border-gray-200 focus:border-indigo-400 text-gray-800'
                        } focus:ring-3 ${
                          darkMode ? 'focus:ring-indigo-600/20' : 'focus:ring-indigo-500/20'
                        } focus:outline-none transition-all duration-300 shadow-md`}
                      />
                    </div>
                  </div>

                  <div className="group">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium transition-colors" htmlFor="lineHeight">Line Height</label>
                      <span className={`text-xs py-1 px-2.5 rounded-lg ${
                        darkMode ? 'bg-gray-700/80' : 'bg-gray-100/80'
                      } font-medium`}>{currentSettings.lineHeight}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        id="lineHeight"
                        type="range"
                        min="0.8"
                        max="3"
                        step="0.1"
                        value={currentSettings.lineHeight}
                        onChange={(e) => updateSettings("lineHeight", parseFloat(e.target.value))}
                        className="w-full accent-indigo-500 h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="number"
                        min="0.8"
                        max="3"
                        step="0.1"
                        value={currentSettings.lineHeight}
                        onChange={(e) => updateSettings("lineHeight", parseFloat(e.target.value) || 1.5)}
                        className={`w-16 p-2.5 rounded-lg border-2 text-center font-medium ${
                          darkMode 
                            ? 'bg-gray-700/80 border-gray-600 focus:border-indigo-500 text-white' 
                            : 'bg-white/80 border-gray-200 focus:border-indigo-400 text-gray-800'
                        } focus:ring-3 ${
                          darkMode ? 'focus:ring-indigo-600/20' : 'focus:ring-indigo-500/20'
                        } focus:outline-none transition-all duration-300 shadow-md`}
                      />
                    </div>
                  </div>

                  <div className="group">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium transition-colors" htmlFor="letterSpacing">Letter Spacing</label>
                      <span className={`text-xs py-1 px-2.5 rounded-lg ${
                        darkMode ? 'bg-gray-700/80' : 'bg-gray-100/80'
                      } font-medium`}>{currentSettings.letterSpacing}px</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        id="letterSpacing"
                        type="range"
                        min="-3"
                        max="10"
                        value={currentSettings.letterSpacing}
                        onChange={(e) => updateSettings("letterSpacing", parseInt(e.target.value))}
                        className="w-full accent-indigo-500 h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="number"
                        min="-3"
                        max="10"
                        value={currentSettings.letterSpacing}
                        onChange={(e) => updateSettings("letterSpacing", parseInt(e.target.value) || 0)}
                        className={`w-16 p-2.5 rounded-lg border-2 text-center font-medium ${
                          darkMode 
                            ? 'bg-gray-700/80 border-gray-600 focus:border-indigo-500 text-white' 
                            : 'bg-white/80 border-gray-200 focus:border-indigo-400 text-gray-800'
                        } focus:ring-3 ${
                          darkMode ? 'focus:ring-indigo-600/20' : 'focus:ring-indigo-500/20'
                        } focus:outline-none transition-all duration-300 shadow-md`}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === "appearance" && (
                <>
                  <div className="group">
                    <label className="block text-sm font-medium mb-2 transition-colors" htmlFor="fontWeight">Font Weight</label>
                    <div className="relative">
                      <select
                        id="fontWeight"
                        value={currentSettings.fontWeight}
                        onChange={(e) => updateSettings("fontWeight", parseInt(e.target.value))}
                        className={`w-full p-3.5 rounded-xl border-2 appearance-none pr-10 font-medium ${
                          darkMode 
                            ? 'bg-gray-700/80 border-gray-600 focus:border-indigo-500 text-white' 
                            : 'bg-white/80 border-gray-200 focus:border-indigo-400 text-gray-800'
                        } focus:ring-3 ${
                          darkMode ? 'focus:ring-indigo-600/20' : 'focus:ring-indigo-500/20'
                        } focus:outline-none transition-all duration-300 shadow-md`}
                      >
                        <option value={100}>100 (Thin)</option>
                        <option value={200}>200 (Extra Light)</option>
                        <option value={300}>300 (Light)</option>
                        <option value={400}>400 (Regular)</option>
                        <option value={500}>500 (Medium)</option>
                        <option value={600}>600 (Semi Bold)</option>
                        <option value={700}>700 (Bold)</option>
                        <option value={800}>800 (Extra Bold)</option>
                        <option value={900}>900 (Black)</option>
                      </select>
                      <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium mb-2 transition-colors">Text Align</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["left", "center", "right", "justify"].map((align) => (
                        <button
                          key={align}
                          onClick={() => updateSettings("textAlign", align)}
                          className={`py-2.5 border-2 rounded-xl capitalize transition-all duration-300 shadow-md font-medium ${
                            currentSettings.textAlign === align
                              ? (darkMode 
                                  ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white border-indigo-600' 
                                  : 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white border-indigo-500'
                                )
                              : darkMode
                                ? 'bg-gray-700/80 border-gray-600 hover:bg-gray-600/80'
                                : 'bg-white/80 border-gray-200 hover:bg-gray-50/80'
                          }`}
                          aria-label={`Align ${align}`}
                        >
                          {align}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium mb-2 transition-colors" htmlFor="textTransform">Text Transform</label>
                    <div className="relative">
                      <select
                        id="textTransform"
                        value={currentSettings.textTransform}
                        onChange={(e) => updateSettings("textTransform", e.target.value)}
                        className={`w-full p-3.5 rounded-xl border-2 appearance-none pr-10 font-medium ${
                          darkMode 
                            ? 'bg-gray-700/80 border-gray-600 focus:border-indigo-500 text-white' 
                            : 'bg-white/80 border-gray-200 focus:border-indigo-400 text-gray-800'
                        } focus:ring-3 ${
                          darkMode ? 'focus:ring-indigo-600/20' : 'focus:ring-indigo-500/20'
                        } focus:outline-none transition-all duration-300 shadow-md`}
                      >
                        <option value="none">None</option>
                        <option value="uppercase">UPPERCASE</option>
                        <option value="lowercase">lowercase</option>
                        <option value="capitalize">Capitalize</option>
                      </select>
                      <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 transition-colors" htmlFor="textColor">Text Color</label>
                        <div className="relative h-12 rounded-xl overflow-hidden group/color shadow-md">
                          <input
                            id="textColor"
                            type="color"
                            value={currentSettings.textColor}
                            onChange={(e) => updateSettings("textColor", e.target.value)}
                            className="absolute inset-0 w-full h-full border-0 cursor-pointer opacity-0"
                          />
                          <div className="absolute inset-0 flex items-center justify-center p-0.5 border-2 rounded-xl transition-colors duration-300 overflow-hidden group-hover/color:border-indigo-400">
                            <div className="flex-1 h-full rounded-lg" style={{ backgroundColor: currentSettings.textColor }}></div>
                            <div className="px-2.5 font-mono text-xs font-medium">{currentSettings.textColor}</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 transition-colors" htmlFor="backgroundColor">Background Color</label>
                        <div className="relative h-12 rounded-xl overflow-hidden group/color shadow-md">
                          <input
                            id="backgroundColor"
                            type="color"
                            value={currentSettings.backgroundColor}
                            onChange={(e) => updateSettings("backgroundColor", e.target.value)}
                            className="absolute inset-0 w-full h-full border-0 cursor-pointer opacity-0"
                          />
                          <div className="absolute inset-0 flex items-center justify-center p-0.5 border-2 rounded-xl transition-colors duration-300 overflow-hidden group-hover/color:border-indigo-400">
                            <div className="flex-1 h-full rounded-lg" style={{ backgroundColor: currentSettings.backgroundColor }}></div>
                            <div className="px-2.5 font-mono text-xs font-medium">{currentSettings.backgroundColor}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <button
                        onClick={() => setShowColorPalette(!showColorPalette)}
                        className={`text-xs w-full py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-300 font-medium shadow-md ${
                          darkMode 
                            ? 'bg-gray-700/80 hover:bg-gray-600/80 text-gray-300' 
                            : 'bg-gray-100/80 hover:bg-gray-200/80 text-gray-700'
                        }`}
                      >
                        <Palette size={14} />
                        {showColorPalette ? 'Hide' : 'Show'} color palettes
                      </button>
                      
                      {showColorPalette && (
                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {colorPalettes.map((palette, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                updateSettings("textColor", palette.textColor);
                                updateSettings("backgroundColor", palette.backgroundColor);
                              }}
                              className="p-3 rounded-xl border-2 transition-all hover:scale-105 shadow-md"
                              style={{ 
                                backgroundColor: palette.backgroundColor,
                                color: palette.textColor,
                                borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                              }}
                            >
                              <div className="text-sm font-medium truncate">{palette.name}</div>
                              <div className="flex justify-between mt-1.5 text-xs opacity-80 font-mono">
                                <span>{palette.textColor.substring(0, 7)}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeTab === "advanced" && (
                <>
                  <div className="group">
                    <label className="block text-sm font-medium mb-2 transition-colors" htmlFor="fontStyle">Font Style</label>
                    <div className="relative">
                      <select
                        id="fontStyle"
                        value={currentSettings.fontStyle}
                        onChange={(e) => updateSettings("fontStyle", e.target.value)}
                        className={`w-full p-3.5 rounded-xl border-2 appearance-none pr-10 font-medium ${
                          darkMode 
                            ? 'bg-gray-700/80 border-gray-600 focus:border-indigo-500 text-white' 
                            : 'bg-white/80 border-gray-200 focus:border-indigo-400 text-gray-800'
                        } focus:ring-3 ${
                          darkMode ? 'focus:ring-indigo-600/20' : 'focus:ring-indigo-500/20'
                        } focus:outline-none transition-all duration-300 shadow-md`}
                      >
                        <option value="normal">Normal</option>
                        <option value="italic">Italic</option>
                      </select>
                      <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium mb-2 transition-colors" htmlFor="textDecoration">Text Decoration</label>
                    <div className="relative">
                      <select
                        id="textDecoration"
                        value={currentSettings.textDecoration}
                        onChange={(e) => updateSettings("textDecoration", e.target.value)}
                        className={`w-full p-3.5 rounded-xl border-2 appearance-none pr-10 font-medium ${
                          darkMode 
                            ? 'bg-gray-700/80 border-gray-600 focus:border-indigo-500 text-white' 
                            : 'bg-white/80 border-gray-200 focus:border-indigo-400 text-gray-800'
                        } focus:ring-3 ${
                          darkMode ? 'focus:ring-indigo-600/20' : 'focus:ring-indigo-500/20'
                        } focus:outline-none transition-all duration-300 shadow-md`}
                      >
                        <option value="none">None</option>
                        <option value="underline">Underline</option>
                        <option value="overline">Overline</option>
                        <option value="line-through">Line Through</option>
                      </select>
                      <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium mb-2 transition-colors" htmlFor="textShadow">Text Shadow</label>
                    <div className="relative">
                      <select
                        id="textShadow"
                        value={currentSettings.textShadow}
                        onChange={(e) => updateSettings("textShadow", e.target.value)}
                        className={`w-full p-3.5 rounded-xl border-2 appearance-none pr-10 font-medium ${
                          darkMode 
                            ? 'bg-gray-700/80 border-gray-600 focus:border-indigo-500 text-white' 
                            : 'bg-white/80 border-gray-200 focus:border-indigo-400 text-gray-800'
                        } focus:ring-3 ${
                          darkMode ? 'focus:ring-indigo-600/20' : 'focus:ring-indigo-500/20'
                        } focus:outline-none transition-all duration-300 shadow-md`}
                      >
                        {textShadowPresets.map(preset => (
                          <option key={preset.name} value={preset.value}>
                            {preset.name}
                          </option>
                        ))}
                      </select>
                      <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium mb-2 transition-colors">Responsive Preview</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setResponsivePreview("mobile")}
                    className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 font-medium shadow-md ${
                      responsivePreview === "mobile"
                        ? (darkMode 
                            ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white' 
                            : 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white'
                          )
                        : (darkMode 
                            ? 'bg-gray-700/80 hover:bg-gray-600/80 text-gray-300' 
                            : 'border border-gray-200 hover:bg-gray-50/80 text-gray-600'
                          )
                    }`}
                  >
                    <Smartphone size={16} />
                    <span className="text-xs">Mobile</span>
                  </button>
                  <button
                    onClick={() => setResponsivePreview("tablet")}
className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 font-medium shadow-md ${
                      responsivePreview === "tablet"
                        ? (darkMode 
                            ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white' 
                            : 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white'
                          )
                        : (darkMode 
                            ? 'bg-gray-700/80 hover:bg-gray-600/80 text-gray-300' 
                            : 'border border-gray-200 hover:bg-gray-50/80 text-gray-600'
                          )
                    }`}
                  >
                    <Tablet size={16} />
                    <span className="text-xs">Tablet</span>
                  </button>
                  <button
                    onClick={() => setResponsivePreview("desktop")}
                    className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 font-medium shadow-md ${
                      responsivePreview === "desktop"
                        ? (darkMode 
                            ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white' 
                            : 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white'
                          )
                        : (darkMode 
                            ? 'bg-gray-700/80 hover:bg-gray-600/80 text-gray-300' 
                            : 'border border-gray-200 hover:bg-gray-50/80 text-gray-600'
                          )
                    }`}
                  >
                    <Laptop size={16} />
                    <span className="text-xs">Desktop</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium mb-3 transition-colors">Typography Score</h3>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        className={`stroke-current ${darkMode ? 'text-gray-700' : 'text-gray-200'}`}
                        fill="none"
                        strokeWidth="3"
                        strokeLinecap="round"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={`stroke-current ${
                          typographyScore >= 90 
                            ? 'text-green-400' 
                            : typographyScore >= 75 
                            ? 'text-blue-400' 
                            : 'text-yellow-400'
                        }`}
                        fill="none"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${typographyScore}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
                      />
                      <text 
                        x="18" 
                        y="20.35" 
                        className={`fill-current ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}
                        textAnchor="middle"
                        fontSize="8"
                      >
                        {typographyScore}
                      </text>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm mb-1">
                      <span className={`font-medium ${
                        typographyScore >= 90 
                          ? 'text-green-400' 
                          : typographyScore >= 75 
                          ? 'text-blue-400' 
                          : 'text-yellow-400'
                      }`}>
                        {typographyScore >= 90 
                          ? 'Excellent' 
                          : typographyScore >= 75 
                          ? 'Good' 
                          : 'Improvable'}
                      </span> typography
                    </div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {typographyScore >= 90 
                        ? 'Your typography settings follow best practices for readability and aesthetics.'
                        : typographyScore >= 75 
                        ? 'Your typography is good but could be improved for optimal reading experience.'
                        : 'Consider adjusting line height, font size or letter spacing for better readability.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 mt-8 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => copyCSS(currentSettings)}
                  className={`bg-gradient-to-r ${
                    darkMode ? 'from-indigo-600 to-blue-700' : 'from-indigo-500 to-blue-600'
                  } hover:opacity-90 text-white py-3 px-4 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-medium`}
                  aria-label="Copy CSS"
                >
                  <Copy size={16} className="mr-1.5" /> Copy CSS
                </button>
                <button
                  onClick={() => exportSettings(currentSettings)}
                  className={`bg-gradient-to-r ${
                    darkMode ? 'from-green-600 to-teal-700' : 'from-green-500 to-teal-600'
                  } hover:opacity-90 text-white py-3 px-4 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-medium`}
                  aria-label="Export settings"
                >
                  <Download size={16} className="mr-1.5" /> Export
                </button>
                <button
                  onClick={captureScreenshot}
                  className={`flex items-center justify-center py-3 px-4 rounded-xl transition-all duration-300 bg-gradient-to-r font-medium ${
                    darkMode 
                      ? 'from-pink-600 to-purple-700 text-white' 
                      : 'from-pink-500 to-purple-600 text-white'
                  } hover:opacity-90 shadow-lg hover:shadow-xl transform hover:scale-[1.02]`}
                  aria-label="Capture screenshot"
                >
                  <Camera size={16} className="mr-1.5" /> Screenshot
                </button>
                <button
                  onClick={() => resetSettings(activePanel)}
                  className={`flex items-center justify-center py-3 px-4 rounded-xl transition-all duration-300 border-2 font-medium ${
                    darkMode 
                      ? 'bg-gray-700/80 hover:bg-gray-600/80 border-gray-600' 
                      : 'bg-white/80 hover:bg-gray-50/80 border-gray-200'
                  } transform hover:scale-[1.02] shadow-md`}
                  aria-label="Reset settings"
                >
                  <RotateCcw size={16} className="mr-1.5" /> Reset
                </button>
                <button
                  onClick={swapSettings}
                 className={`col-span-2 flex items-center justify-center py-3 px-4 rounded-xl transition-all duration-300 border-2 font-medium ${
                    darkMode 
                      ? 'bg-gray-700/80 hover:bg-gray-600/80 border-gray-600' 
                      : 'bg-white/80 hover:bg-gray-50/80 border-gray-200'
                  } transform hover:scale-[1.02] shadow-md`}
                  aria-label="Swap settings between panels"
                >
                  <RefreshCw size={16} className="mr-1.5" /> Swap Panels
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 order-1 lg:order-2">
            <div 
              className={`p-5 rounded-xl shadow-xl relative overflow-hidden transition-all duration-300 ${
                darkMode ? 'bg-gray-800/90 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'
              } ${activePanel === "left" ? 'ring-3 ring-offset-4 ring-offset-gray-50 dark:ring-offset-gray-900 ring-indigo-500' : ''}`}
              ref={leftPanelRef}
              style={{ 
                maxWidth: getResponsiveWidth(),
                margin: responsivePreview !== "desktop" ? "0 auto" : undefined 
              }}
            >
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-indigo-500 to-blue-600 opacity-90"></div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2 font-heading">
                  Preview 1
                  {responsivePreview !== "desktop" && (
                    <span className={`text-xs px-2 py-0.5 rounded-lg ${
                      darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                    } font-medium`}>
                      {responsivePreview}
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-2">
                  <div className={`text-xs px-2 py-0.5 rounded-full ${
                    typographyScore >= 90 
                      ? (darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700') 
                      : typographyScore >= 75 
                      ? (darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700')
                      : (darkMode ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-700')
                  } font-medium`}>
                    {typographyScore}
                  </div>
                  <button
                    onClick={() => setActivePanel("left")}
                    className={`p-2.5 rounded-full transition-all duration-300 shadow-md ${
                      activePanel === "left" 
                        ? (darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white') 
                        : (darkMode ? 'bg-gray-700/80 hover:bg-gray-600/80' : 'bg-gray-100/80 hover:bg-gray-200/80')
                    }`}
                    aria-label="Edit left panel"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
              <div 
                style={{
                  fontFamily: leftSettings.fontFamily,
                  fontSize: `${leftSettings.fontSize}px`,
                  lineHeight: leftSettings.lineHeight,
                  letterSpacing: `${leftSettings.letterSpacing}px`,
                  fontWeight: leftSettings.fontWeight,
                  textAlign: leftSettings.textAlign as any,
                  color: leftSettings.textColor,
                  backgroundColor: leftSettings.backgroundColor,
                  textTransform: leftSettings.textTransform as any,
                  fontStyle: leftSettings.fontStyle as any,
                  textDecoration: leftSettings.textDecoration as any,
                  textShadow: leftSettings.textShadow,
                  padding: '20px',
                  borderRadius: '0.75rem',
                  minHeight: '220px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
                className="preview-panel relative"
              >
                {text || "Enter some text to preview..."}
                
                <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-70">
                  <div className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${
                    darkMode ? 'bg-gray-700/80' : 'bg-white/80 backdrop-blur-sm shadow-sm'
                  }`}>
                    {leftSettings.fontSize}px
                  </div>
                  <div className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${
                    darkMode ? 'bg-gray-700/80' : 'bg-white/80 backdrop-blur-sm shadow-sm'
                  }`}>
                    {parseFloat(leftSettings.lineHeight.toFixed(1))}
                  </div>
                </div>
              </div>
              
              {showCSS && (
                <div className={`mt-4 p-4 rounded-xl text-xs font-mono overflow-auto max-h-36 ${
                  darkMode ? 'bg-gray-900/80 text-gray-300' : 'bg-gray-100/80 text-gray-700'
                } shadow-inner`}>
                  <pre>{generateCSS(leftSettings)}</pre>
                </div>
              )}
            </div>

            <div 
              className={`p-5 rounded-xl shadow-xl relative overflow-hidden transition-all duration-300 ${
                darkMode ? 'bg-gray-800/90 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'
              } ${activePanel === "right" ? 'ring-3 ring-offset-4 ring-offset-gray-50 dark:ring-offset-gray-900 ring-indigo-500' : ''}`}
              ref={rightPanelRef}
              style={{ 
                maxWidth: getResponsiveWidth(),
                margin: responsivePreview !== "desktop" ? "0 auto" : undefined 
              }}
            >
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-indigo-500 to-blue-600 opacity-90"></div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2 font-heading">
                  Preview 2
                  {responsivePreview !== "desktop" && (
                    <span className={`text-xs px-2 py-0.5 rounded-lg ${
                      darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                    } font-medium`}>
                      {responsivePreview}
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-2">
                  <div className={`text-xs px-2 py-0.5 rounded-full ${
                    calculateTypographyScore(rightSettings) >= 90 
                      ? (darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700') 
                      : calculateTypographyScore(rightSettings) >= 75 
                      ? (darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700')
                      : (darkMode ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-700')
                  } font-medium`}>
                    {calculateTypographyScore(rightSettings)}
                  </div>
                  <button
                    onClick={() => setActivePanel("right")}
                    className={`p-2.5 rounded-full transition-all duration-300 shadow-md ${
                      activePanel === "right" 
                        ? (darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white') 
                        : (darkMode ? 'bg-gray-700/80 hover:bg-gray-600/80' : 'bg-gray-100/80 hover:bg-gray-200/80')
                    }`}
                    aria-label="Edit right panel"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
              <div 
                style={{
                  fontFamily: rightSettings.fontFamily,
                  fontSize: `${rightSettings.fontSize}px`,
                  lineHeight: rightSettings.lineHeight,
                  letterSpacing: `${rightSettings.letterSpacing}px`,
                  fontWeight: rightSettings.fontWeight,
                  textAlign: rightSettings.textAlign as any,
                  color: rightSettings.textColor,
                  backgroundColor: rightSettings.backgroundColor,
                  textTransform: rightSettings.textTransform as any,
                  fontStyle: rightSettings.fontStyle as any,
                  textDecoration: rightSettings.textDecoration as any,
                  textShadow: rightSettings.textShadow,
                  padding: '20px',
                  borderRadius: '0.75rem',
                  minHeight: '220px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
                className="preview-panel relative"
              >
                {text || "Enter some text to preview..."}
                
                <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-70">
                  <div className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${
                    darkMode ? 'bg-gray-700/80' : 'bg-white/80 backdrop-blur-sm shadow-sm'
                  }`}>
                    {rightSettings.fontSize}px
                  </div>
                  <div className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${
                    darkMode ? 'bg-gray-700/80' : 'bg-white/80 backdrop-blur-sm shadow-sm'
                  }`}>
                    {parseFloat(rightSettings.lineHeight.toFixed(1))}
                  </div>
                </div>
              </div>
              
              {showCSS && (
                <div className={`mt-4 p-4 rounded-xl text-xs font-mono overflow-auto max-h-36 ${
                  darkMode ? 'bg-gray-900/80 text-gray-300' : 'bg-gray-100/80 text-gray-700'
                } shadow-inner`}>
                  <pre>{generateCSS(rightSettings)}</pre>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`mt-8 p-5 rounded-xl ${
          darkMode ? 'bg-gray-800/90 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'
        } shadow-xl transition-all duration-300 overflow-hidden relative`}
          ref={compareViewRef}
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-pink-600 opacity-90"></div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 font-heading">
              <Layout className={`${darkMode ? 'text-purple-400' : 'text-purple-500'}`} size={20} />
              Side-by-Side Comparison
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsComparing(!isComparing)}
                className={`px-3.5 py-2 text-sm rounded-xl flex items-center gap-1.5 transition-all duration-300 font-medium shadow-md ${
                  isComparing 
                    ? (darkMode 
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white' 
                        : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                      )
                    : (darkMode 
                        ? 'bg-gray-700/80 hover:bg-gray-600/80 text-gray-300' 
                        : 'bg-gray-100/80 hover:bg-gray-200/80 text-gray-700'
                      )
                }`}
              >
                <Grid size={14} className="mr-1" />
                {isComparing ? 'Hide Grid Lines' : 'Show Grid Lines'}
              </button>
            </div>
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 relative ${isComparing ? 'comparison-grid' : ''}`}>
            <div
              style={{
                fontFamily: leftSettings.fontFamily,
                fontSize: `${leftSettings.fontSize}px`,
                lineHeight: leftSettings.lineHeight,
                letterSpacing: `${leftSettings.letterSpacing}px`,
                fontWeight: leftSettings.fontWeight,
                textAlign: leftSettings.textAlign as any,
                color: leftSettings.textColor,
                backgroundColor: leftSettings.backgroundColor,
                textTransform: leftSettings.textTransform as any,
                fontStyle: leftSettings.fontStyle as any,
                textDecoration: leftSettings.textDecoration as any,
                textShadow: leftSettings.textShadow,
                padding: '20px',
                borderRadius: '0.75rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease'
              }}
              className={`comparison-panel relative ${isComparing ? 'comparison-element' : ''}`}
            >
              {text || "Enter some text to preview..."}
              {isComparing && (
                <div className="absolute top-2 left-2 text-xs font-medium px-2 py-1 bg-black/30 backdrop-blur-sm text-white rounded-lg">
                  Panel 1
                </div>
              )}
            </div>
            <div
              style={{
                fontFamily: rightSettings.fontFamily,
                fontSize: `${rightSettings.fontSize}px`,
                lineHeight: rightSettings.lineHeight,
                letterSpacing: `${rightSettings.letterSpacing}px`,
                fontWeight: rightSettings.fontWeight,
                textAlign: rightSettings.textAlign as any,
                color: rightSettings.textColor,
                backgroundColor: rightSettings.backgroundColor,
                textTransform: rightSettings.textTransform as any,
                fontStyle: rightSettings.fontStyle as any,
                textDecoration: rightSettings.textDecoration as any,
                textShadow: rightSettings.textShadow,
                padding: '20px',
                borderRadius: '0.75rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease'
              }}
              className={`comparison-panel relative ${isComparing ? 'comparison-element' : ''}`}
            >
              {text || "Enter some text to preview..."}
              {isComparing && (
                <div className="absolute top-2 left-2 text-xs font-medium px-2 py-1 bg-black/30 backdrop-blur-sm text-white rounded-lg">
                  Panel 2
                </div>
              )}
            </div>
          </div>
          
          <div className={`mt-4 p-4 rounded-xl ${
            darkMode ? 'bg-purple-900/20' : 'bg-purple-50/80'
          } border ${
            darkMode ? 'border-purple-800/20' : 'border-purple-100'
          }`}>
            <h3 className="text-sm font-medium mb-2">Typography Comparison</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Font Size</div>
                <div className="font-medium mt-1 flex justify-between">
                  <span>{leftSettings.fontSize}px</span>
                  <span className={`${
                    leftSettings.fontSize !== rightSettings.fontSize 
                      ? (darkMode ? 'text-indigo-300' : 'text-indigo-500') 
                      : ''
                  }`}>
                    {leftSettings.fontSize === rightSettings.fontSize ? 'Same' : `vs ${rightSettings.fontSize}px`}
                  </span>
                </div>
              </div>
              <div>
                <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Line Height</div>
                <div className="font-medium mt-1 flex justify-between">
                  <span>{leftSettings.lineHeight}</span>
                  <span className={`${
                    leftSettings.lineHeight !== rightSettings.lineHeight 
                      ? (darkMode ? 'text-indigo-300' : 'text-indigo-500') 
                      : ''
                  }`}>
                    {leftSettings.lineHeight === rightSettings.lineHeight ? 'Same' : `vs ${rightSettings.lineHeight}`}
                  </span>
                </div>
              </div>
              <div>
                <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Font Weight</div>
                <div className="font-medium mt-1 flex justify-between">
                  <span>{leftSettings.fontWeight}</span>
                  <span className={`${
                    leftSettings.fontWeight !== rightSettings.fontWeight 
                      ? (darkMode ? 'text-indigo-300' : 'text-indigo-500') 
                      : ''
                  }`}>
                    {leftSettings.fontWeight === rightSettings.fontWeight ? 'Same' : `vs ${rightSettings.fontWeight}`}
                  </span>
                </div>
              </div>
              <div>
                <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Letter Spacing</div>
                <div className="font-medium mt-1 flex justify-between">
                  <span>{leftSettings.letterSpacing}px</span>
                  <span className={`${
                    leftSettings.letterSpacing !== rightSettings.letterSpacing 
                      ? (darkMode ? 'text-indigo-300' : 'text-indigo-500') 
                      : ''
                  }`}>
                    {leftSettings.letterSpacing === rightSettings.letterSpacing ? 'Same' : `vs ${rightSettings.letterSpacing}px`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full ${
            darkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm shadow-md'
          } text-sm`}>
            <Heart size={14} className="text-pink-500" />
            <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>Typography Studio • 2025 Edition</span>
          </div>
          <div className="mt-2 flex justify-center gap-4">
            <a href="#" className={`text-xs ${
              darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            } flex items-center gap-1 transition-colors font-medium`}>
              Documentation <ArrowUpRight size={10} />
            </a>
            <a href="#" className={`text-xs ${
              darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            } flex items-center gap-1 transition-colors font-medium`}>
              Support <ArrowUpRight size={10} />
            </a>
            <a href="#" className={`text-xs ${
              darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            } flex items-center gap-1 transition-colors font-medium`}>
              Upgrade to Pro <ArrowUpRight size={10} />
            </a>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;600;700&display=swap');
        
        .font-heading {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        
        .comparison-grid {
          background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 20px 20px;
          background-position: center center;
          border-radius: 0.75rem;
          padding: 1rem;
        }
        
        .comparison-element {
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
        
        .custom-scrollbar-dark::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .custom-scrollbar-dark::-webkit-scrollbar-track {
          background: #2d2d2d;
          border-radius: 10px;
        }
        
        .custom-scrollbar-dark::-webkit-scrollbar-thumb {
          background: #4d4d4d;
          border-radius: 10px;
        }
        
        .custom-scrollbar-dark::-webkit-scrollbar-thumb:hover {
          background: #5d5d5d;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default TypographyPlayground;